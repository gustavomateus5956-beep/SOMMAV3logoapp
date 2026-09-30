import test from 'node:test';
import assert from 'node:assert/strict';
import { SommaFoodProvider } from '../src/features/nutrition/SommaFoodProvider';
import type { Food } from '../src/features/nutrition/food';

// Synthetic structural fixtures; no nutritional values asserted as real food data.
const fixture = (id: string, name: string): Food => ({ id, name, aliases: ['teste'],
  category: 'Genéricos', source: 'custom', nutritionPer100g: {}, portions: [], householdMeasures: [] });

test('explicit empty catalog stays empty, with no provider fallback', async () => {
  const provider = new SommaFoodProvider([]);
  assert.deepEqual((await provider.search('')).items, []);
  assert.equal(await provider.getById('missing'), null);
});
test('accent insensitive aliases, category and pagination preserve identities', async () => {
  const provider = new SommaFoodProvider([fixture('1', 'Feijão teste'), fixture('2', 'Feijão exemplo')]);
  assert.equal((await provider.search('FEIJAO', { limit: 1 })).hasNextPage, true);
  assert.equal((await provider.search('feijao', { limit: 1, page: 2 })).items[0].id, '2');
  assert.equal((await provider.search('teste', { category: 'genericos' })).total, 2);
  assert.equal((await provider.search('', { category: 'Outra' })).total, 0);
});
test('catalog and returned records are isolated from consumer mutations', async () => {
  const food = fixture('1', 'Original');
  const provider = new SommaFoodProvider([food]);
  food.name = 'Changed';
  const result = await provider.getById('1');
  result!.aliases.push('Changed');
  assert.equal((await provider.getById('1'))!.name, 'Original');
  assert.deepEqual((await provider.getById('1'))!.aliases, ['teste']);
});
test('unknown sodium and missing gram equivalence stay unknown', async () => {
  const food = fixture('1', 'Fixture');
  food.householdMeasures = [{ id: 'cup', label: 'Copo', amount: 1, unit: 'copo', milliliters: 200 }];
  const result = await new SommaFoodProvider([food]).getById('1');
  assert.equal(result!.nutritionPer100g.sodium, undefined);
  assert.equal(result!.householdMeasures[0].grams, undefined);
});
test('invalid IDs, nutrients, portions and external records are rejected', () => {
  const food = fixture('1', 'Fixture');
  assert.throws(() => new SommaFoodProvider([food, food]));
  assert.throws(() => new SommaFoodProvider([{ ...food, nutritionPer100g: { fat: NaN } }]));
  assert.throws(() => new SommaFoodProvider([{ ...food, source: 'fatsecret' }]));
  assert.throws(() => new SommaFoodProvider([{ ...food, portions: [{ id: 'p', label: 'p', amount: 0, unit: 'g' }] }]));
});
test('cancellation and invalid pagination reject instead of returning no results', async () => {
  const provider = new SommaFoodProvider();
  const signal = AbortSignal.abort();
  await assert.rejects(provider.search('', { signal }));
  await assert.rejects(provider.getById('1', signal));
  await assert.rejects(provider.search('', { page: 0 }));
  await assert.rejects(provider.search('', { limit: Infinity }));
});
