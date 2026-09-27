import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExerciseMedia } from '../src/components/exercise/ExerciseMedia';
import { getSommaMedia, selectExerciseMediaSource } from '../src/services/exerciseMedia/sommaMediaProvider';
import test from 'node:test';
import data from '../src/data/somma/somma-exercises-ptbr-categorized.json';
import index from '../src/data/somma/somma-exercises-search-index-categorized.json';
import manifest from '../src/data/somma/somma-media-manifest.json';
import checksums from '../src/data/somma/checksums.json';
import { SommaDatasetProvider, sommaFilterOptions, adaptSommaExercise } from '../src/services/exerciseMedia/sommaDatasetProvider';
import { createCatalogSearch, convertExternalToSommaExercise, convertLocalToSommaExercise, localizeExternalExercise, getCatalogExerciseById } from '../src/services/exerciseMedia/exerciseCatalogService';
import { getExerciseMediaImmediate, resolveExerciseMedia } from '../src/services/exerciseMedia/exerciseMediaService';
import { EXERCISE_LIBRARY } from '../src/data/exerciseLibrary';
import type { CatalogQuery } from '../src/services/exerciseMedia/sommaDatasetTypes';
import type { ExternalExerciseResult } from '../src/types';

const provider = new SommaDatasetProvider();
const empty = { exercises: [], total: 0, hasNextPage: false };
async function collect(options: CatalogQuery = {}) {
  const items: ExternalExerciseResult[] = [];
  let after: string | undefined;
  do {
    const page = await provider.search({ ...options, after, limit: 100 });
    items.push(...page.exercises);
    after = page.nextCursor;
  } while (after);
  return items;
}

test('all six imported JSON files match their original SHA-256 checksums', async () => {
  for (const [name, expected] of Object.entries(checksums)) {
    const bytes = await readFile(new URL(`../src/data/somma/${name}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, name);
  }
});

test('1324 unique string IDs and consistent search index, media manifest and taxonomy', () => {
  assert.equal(data.length, 1324);
  assert.equal(new Set(data.map(r => r.id)).size, 1324);
  assert.equal(index.length, 1324);
  assert.equal(manifest.length, 1324);
  const searchIds = new Set(index.map(r => r.id));
  const media = new Map(manifest.map(r => [r.id, r]));
  for (const record of data) {
    assert.equal(typeof record.id, 'string');
    assert.ok(searchIds.has(record.id));
    assert.equal(media.get(record.id)?.gif, record.media.gif);
    assert.equal(media.get(record.id)?.image, record.media.image);
    for (const [term, terms] of [
      [record.bodyPart, sommaFilterOptions.bodyParts], [record.target, sommaFilterOptions.targets],
      [record.equipment, sommaFilterOptions.equipment], [record.libraryCategory, sommaFilterOptions.libraryCategories],
      [record.activityType, sommaFilterOptions.activityTypes], [record.environment, sommaFilterOptions.environments],
    ] as const) assert.ok(terms.some(t => t.key === term.key && t.label === term.label), `${record.id}: ${term.key}`);
  }
});

test('every ID preserves official names, instructions and provider identity', async () => {
  for (const record of data) {
    const found = await provider.getById(record.id);
    assert.ok(found);
    assert.equal(found.provider, 'somma');
    assert.equal(found.name, record.name);
    assert.equal(found.originalName, record.originalName);
    assert.deepEqual(found.instructions, record.instructionSteps.ptBr);
    assert.equal(found.instructionText, record.instructions.ptBr);
    assert.deepEqual(localizeExternalExercise(found), found);
  }
  assert.equal(await provider.getById('missing-id'), null);
  assert.equal((await getCatalogExerciseById('0001'))?.originalName, '3/4 sit-up');
});

test('search finds every record by Portuguese, English and all aliases', async () => {
  for (const record of data) {
    for (const query of new Set([record.name, record.originalName, ...record.aliasesPtBr, ...record.aliasesEn])) {
      const results = await collect({ query });
      assert.ok(results.some(r => r.externalId === record.id), `${record.id}: ${query}`);
    }
  }
  assert.deepEqual(await collect({ query: 'FLEXÃO' }), await collect({ query: 'flexao' }));
});

test('pagination preserves source order and all variants with duplicate names', async () => {
  const results = await collect();
  assert.deepEqual(results.map(r => r.externalId), data.map(r => r.id));
  assert.equal(new Set(results.map(r => r.name)).size, 1311);
  const first = await provider.search({ limit: 20 });
  assert.equal(first.total, 1324);
  assert.equal(first.exercises.length, 20);
  await assert.rejects(provider.search({ query: 'supino', after: first.nextCursor }), /Cursor/);
});

test('every filter follows the official taxonomy, including combined filters', async () => {
  for (const [option, field, terms] of [
    ['bodyPart', 'bodyPart', sommaFilterOptions.bodyParts],
    ['equipment', 'equipment', sommaFilterOptions.equipment],
    ['targetMuscle', 'target', sommaFilterOptions.targets],
    ['libraryCategory', 'libraryCategory', sommaFilterOptions.libraryCategories],
    ['activityType', 'activityType', sommaFilterOptions.activityTypes],
    ['environment', 'environment', sommaFilterOptions.environments],
  ] as const) {
    for (const term of terms) {
      const expected = data.filter(r => r[field].key === term.key).map(r => r.id);
      assert.deepEqual((await collect({ [option]: term.key })).map(r => r.externalId), expected);
      assert.deepEqual((await collect({ [option]: term.label })).map(r => r.externalId), expected);
    }
  }
  for (const term of sommaFilterOptions.collections) {
    assert.deepEqual((await collect({ collection: term.key })).map(r => r.externalId),
      data.filter(r => r.collections.some(c => c.key === term.key)).map(r => r.id));
  }
  assert.deepEqual((await collect({ bodyPart: 'chest', equipment: 'barbell' })).map(r => r.externalId),
    data.filter(r => r.bodyPart.key === 'chest' && r.equipment.key === 'barbell').map(r => r.id));
});

test('routine snapshots retain canonical ID, text, empty sets and independent instance IDs', async () => {
  for (const record of data) {
    const item = adaptSommaExercise(record);
    const snapshot = convertExternalToSommaExercise(item);
    assert.equal(snapshot.catalogRef?.id, record.id);
    assert.equal(snapshot.source, 'somma');
    assert.equal(snapshot.name, record.name);
    assert.equal(snapshot.originalName, record.originalName);
    assert.equal(snapshot.instructions, record.instructions.ptBr);
    assert.deepEqual(snapshot.executionTips, record.instructionSteps.ptBr);
    assert.deepEqual(snapshot.sets, []);
    assert.equal(snapshot.external, undefined);
    assert.notEqual(snapshot.id, convertExternalToSommaExercise(item).id);
    assert.equal(getExerciseMediaImmediate(snapshot)?.imageUrl, record.media.image);
    assert.equal((await resolveExerciseMedia(item as any)).gifUrl, record.media.gif);
    assert.equal(JSON.parse(JSON.stringify(snapshot)).catalogRef.id, record.id);
  }
});

test('legacy local exercises and ExerciseDB conversions still work', () => {
  const local = convertLocalToSommaExercise(EXERCISE_LIBRARY[0]);
  assert.equal(local.name, EXERCISE_LIBRARY[0].name);
  assert.deepEqual(local.sets, []);
  assert.equal(getExerciseMediaImmediate(EXERCISE_LIBRARY[0])?.externalId, '0025');
  assert.equal(getExerciseMediaImmediate({ ...local, source: undefined })?.externalId, '0025');
  // Explicit source=somma follows the local-only rule, even for an unknown legacy ID.
  assert.deepEqual(getExerciseMediaImmediate(local), { provider: 'somma', isAvailable: false });
  const external = convertExternalToSommaExercise({ provider: 'exercisedb', externalId: '0025', name: 'barbell bench press' });
  assert.equal(external.external?.provider, 'exercisedb');
  assert.equal(external.external?.id, '0025');
  assert.equal(external.catalogRef, undefined);
});

test('empty SOMMA searches and aborted requests never invoke ExerciseDB', async () => {
  let calls = 0;
  const search = createCatalogSearch(provider, async () => { calls++; return empty; });
  assert.equal((await search({ query: 'zzzz-no-exercise-zzzz' })).total, 0);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(search({}, controller.signal), { name: 'AbortError' });
  assert.equal(calls, 0);
});

test('unavailable SOMMA falls back, keeps ExerciseDB cursors and retries local on new searches', async () => {
  let fail = true;
  const primary = new SommaDatasetProvider(async () => { if (fail) throw Error('Unavailable'); return data; });
  const requests: CatalogQuery[] = [];
  const search = createCatalogSearch(primary, async options => {
    requests.push(options!);
    return { exercises: [{ provider: 'exercisedb', externalId: 'legacy', name: 'Legacy' }], hasNextPage: true, nextCursor: 'next+/=' };
  });
  const first = await search({ query: 'supino', targetMuscle: 'pectorals' });
  assert.equal(first.exercises[0].provider, 'exercisedb');
  fail = false;
  await search({ after: first.nextCursor, query: 'supino', targetMuscle: 'pectorals' });
  assert.equal(requests[1].after, 'next+/=');
  assert.equal(requests[1].targetMuscle, 'pectorals');
  assert.equal((await search()).total, 1324);
  assert.equal(requests.length, 2);
});

test('invalid data and aborted in-flight loads do not produce partial results', async () => {
  await assert.rejects(new SommaDatasetProvider(async () => data.slice(1)).search(), /inválido/);
  await assert.rejects(new SommaDatasetProvider(async () => [data[1], ...data.slice(1)]).search(), /inválido/);
  let complete!: (value: typeof data) => void;
  const delayed = new SommaDatasetProvider(() => new Promise(resolve => { complete = resolve; }));
  const controller = new AbortController();
  const request = delayed.search({}, controller.signal);
  controller.abort();
  complete(data);
  await assert.rejects(request, { name: 'AbortError' });
  assert.equal((await delayed.search()).total, 1324);
});

test('1324 JPGs and 1324 GIFs exactly match manifest IDs and mediaIds; no missing or orphan files', async () => {
  const imageNames = await readdir(new URL('../public/exercises/images/', import.meta.url));
  const gifNames = await readdir(new URL('../public/exercises/gifs/', import.meta.url));
  assert.equal(imageNames.length, 1324);
  assert.equal(gifNames.length, 1324);
  assert.deepEqual(imageNames.sort(), manifest.map(r => `${r.id}-${r.mediaId}.jpg`).sort());
  assert.deepEqual(gifNames.sort(), manifest.map(r => `${r.id}-${r.mediaId}.gif`).sort());
  for (const record of manifest) {
    assert.equal(record.image, `/exercises/images/${record.id}-${record.mediaId}.jpg`);
    assert.equal(record.gif, `/exercises/gifs/${record.id}-${record.mediaId}.gif`);
    assert.equal(data.find(r => r.id === record.id)?.media.mediaId, record.mediaId);
    const jpg = await readFile(new URL(`../public${record.image}`, import.meta.url));
    const gif = await readFile(new URL(`../public${record.gif}`, import.meta.url));
    assert.deepEqual([...jpg.subarray(0, 3)], [0xff, 0xd8, 0xff], record.image);
    assert.ok(['GIF87a', 'GIF89a'].includes(gif.subarray(0, 6).toString()), record.gif);
    assert.ok(gif.readUInt16LE(6) > 0 && gif.readUInt16LE(8) > 0);
  }
});

test('all catalog thumbnails render only lazy JPGs; detail mounts only its matching GIF', () => {
  for (const record of data) {
    const exercise = adaptSommaExercise(record);
    const thumbnail = renderToStaticMarkup(createElement(ExerciseMedia, { exercise, size: 'sm' }));
    assert.ok(thumbnail.includes(`src="${record.media.image}"`));
    assert.ok(thumbnail.includes('loading="lazy"'));
    assert.ok(!thumbnail.includes('.gif'));
    const detail = renderToStaticMarkup(createElement(ExerciseMedia, { exercise, size: 'md' }));
    assert.ok(detail.includes(`src="${record.media.gif}"`));
    assert.equal((detail.match(/<img /g) || []).length, 1);
    const forcedStatic = renderToStaticMarkup(createElement(ExerciseMedia, { exercise, size: 'md', forceStaticThumbnail: true }));
    assert.ok(forcedStatic.includes(`src="${record.media.image}"`));
    assert.ok(!forcedStatic.includes('.gif'));
  }
});

test('SOMMA source and catalogRef outrank external URLs; unknown IDs never match by name', () => {
  const record = manifest[0];
  const sourceOnly = { source: 'somma' as const, id: record.id, name: 'Supino Reto com Barra', muscleGroup: '', sets: [],
    media: { provider: 'exercisedb' as const, externalId: '0025', gifUrl: 'https://example.invalid/wrong.gif' } };
  assert.equal(getExerciseMediaImmediate(sourceOnly)?.imageUrl, record.image);
  const html = renderToStaticMarkup(createElement(ExerciseMedia, { exercise: sourceOnly, size: 'sm' }));
  assert.ok(html.includes(record.image));
  assert.ok(!html.includes('example.invalid'));
  assert.equal(getSommaMedia({ ...sourceOnly, catalogRef: { provider: 'somma', id: manifest[1].id } }).gifUrl, manifest[1].gif);
  const missing = { ...sourceOnly, id: 'unknown-somma-id' };
  assert.deepEqual(getExerciseMediaImmediate(missing), { provider: 'somma', isAvailable: false });
  assert.ok(!renderToStaticMarkup(createElement(ExerciseMedia, { exercise: missing })).includes('<img '));
  assert.equal(selectExerciseMediaSource({ provider: 'somma', isAvailable: true, gifUrl: '/only.gif' }, true), null);
  assert.equal(selectExerciseMediaSource({ provider: 'somma', isAvailable: true, imageUrl: '/only.jpg' }, false), '/only.jpg');
});

test('legacy ExerciseDB direct GIF and CDN behavior stay intact', () => {
  const external = { provider: 'exercisedb' as const, externalId: '0025', name: 'bench press', gifUrl: 'https://example.invalid/legacy.gif' };
  const html = renderToStaticMarkup(createElement(ExerciseMedia, { exercise: external, size: 'sm', forceStaticThumbnail: true }));
  assert.ok(html.includes(`src="${external.gifUrl}"`));
  assert.ok(!html.includes('/exercises/images/'));
});
