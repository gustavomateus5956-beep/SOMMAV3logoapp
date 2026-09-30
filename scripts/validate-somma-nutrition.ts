import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import catalogJson from '../src/data/nutrition/somma-foods-br.json';
import taxonomy from '../src/data/nutrition/somma-foods-taxonomy.json';
import index from '../src/data/nutrition/somma-foods-search-index.json';
import summary from '../src/data/nutrition/somma-foods-summary.json';
import sources from '../data-sources/nutrition/sources.json';
import type { Food } from '../src/features/nutrition/food';

export const catalog = catalogJson as unknown as Food[];
export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLocaleLowerCase('pt-BR').replace(/\s+/g,' ').trim();
const coreUnits: Record<string,string> = { calories:'kcal',protein:'g',fat:'g',carbohydrates:'g',fiber:'g',
  sodium:'mg',saturatedFat:'g',cholesterol:'mg',calcium:'mg',iron:'mg',potassium:'mg' };
const microUnits: Record<string,string> = {magnesium:'mg',manganese:'mg',phosphorus:'mg',copper:'mg',
  zinc:'mg',retinol:'µg',retinolEquivalent:'µg',retinolActivityEquivalent:'µg',thiamin:'mg',riboflavin:'mg',
  pyridoxine:'mg',niacin:'mg',vitaminC:'mg'};

/** Validation is intentionally specific to version 1, not a permissive future-source importer. */
export function validateCatalog(foods: readonly Food[]) {
  const ids = new Set<string>();
  const categories = new Set(taxonomy.categories.map(c=>c.id));
  for(const f of foods) {
    assert(/^somma:taco:4:\d{4}$/.test(f.id));
    assert(!ids.has(f.id), `Duplicate ID: ${f.id}`); ids.add(f.id);
    assert(typeof f.name==='string' && f.name.trim().length>1);
    assert(Array.isArray(f.aliases) && f.aliases.every(a=>typeof a==='string' && a.trim()));
    assert.equal(new Set(f.aliases).size,f.aliases.length);
    assert(categories.has(f.category!));
    assert.equal(f.source,'taco'); assert.equal(f.externalProvider,undefined);
    const m=f.metadata!;
    assert(m && m.sourceVersion && m.sourceUrl && m.retrievedAt && m.originalName);
    assert.equal(f.id,`somma:taco:4:${m.sourceRecordId!.padStart(4,'0')}`);
    const source=sources.sources.find(s=>s.id===m.sourceLicenseId)!;
    assert(source && source.redistribution==='allowed-with-attribution');
    assert.equal(m.sourceSha256,source.sha256);
    assert.equal(m.sourceUrl,source.url);
    assert(m.sourceLocations && Object.keys(m.sourceLocations).length>=23);
    assert(f.nutritionPer100g && typeof f.nutritionPer100g==='object');
    for(const [k,v] of Object.entries(f.nutritionPer100g)) {
      if(k==='micronutrients') continue;
      assert(k in coreUnits,`Unexpected nutrient ${k}`);
      assert(typeof v==='number' && Number.isFinite(v) && v>=0,`${f.id}: ${k}`);
      if(coreUnits[k]==='g') assert(v<=100,`${f.id}: ${k} exceeds mass basis`);
      if(k==='calories') assert(v<=1000);
      assert(m.sourceLocations[k]); assert.equal(m.nutrientStatus?.[k],undefined);
    }
    for(const [k,v] of Object.entries(f.nutritionPer100g.micronutrients??{})) {
      assert.equal(v.unit,microUnits[k]); assert(k in microUnits);
      assert(typeof v.value==='number' && Number.isFinite(v.value) && v.value>=0);
      assert(m.sourceLocations[k]); assert.equal(m.nutrientStatus?.[k],undefined);
    }
    for(const [k,v] of Object.entries(m.nutrientStatus??{})) {
      assert(['trace','notApplicable','notAnalyzed','underReview','invalidSourceValue'].includes(v));
      assert(!(k in f.nutritionPer100g) && !(k in (f.nutritionPer100g.micronutrients??{})));
      assert(m.sourceLocations[k]);
    }
    // This release has only source-supported mass references, no invented servings/densities.
    assert.deepEqual(f.householdMeasures,[]);
    assert.equal(f.portions.length,1);
    assert.deepEqual(f.portions[0],{id:f.id+':100g',label:'100 g de parte comestível (referência)',
      amount:100,unit:'g',grams:100});
  }
}

export function validateArtifacts() {
  validateCatalog(catalog);
  assert.equal(catalog.length,597); assert.equal(summary.total,catalog.length);
  assert.equal(taxonomy.categories.length,15);
  assert.equal(new Set(taxonomy.categories.map(c=>c.id)).size,15);
  assert.equal(index.entries.length,catalog.length);
  assert.equal(new Set(index.entries.map(e=>e.id)).size,catalog.length);
  assert.equal(index.version,summary.catalogVersion);
  for(const f of catalog) {
    const entry=index.entries.find(e=>e.id===f.id)!;
    assert(entry); assert.equal(entry.category,f.category);
    assert.equal(entry.text,normalize([f.name,...f.aliases].join(' ')));
    assert(!/[\u0300-\u036f]/.test(entry.text.normalize('NFD')));
  }
  const counts: Record<string,number>={};
  const coverage: Record<string,number>={};
  for(const f of catalog) {
    counts[f.category!]=(counts[f.category!]??0)+1;
    for(const key of [...Object.keys(f.nutritionPer100g).filter(k=>k!=='micronutrients'),
      ...Object.keys(f.nutritionPer100g.micronutrients??{})]) coverage[key]=(coverage[key]??0)+1;
  }
  assert.deepEqual(counts,summary.categoryCounts);
  assert.deepEqual(coverage,summary.nutrientCoverage);
  assert.equal(summary.withHouseholdMeasures,0);
  assert.equal(summary.duplicatesRemoved,0);
}

if(process.argv[1] && fileURLToPath(import.meta.url)===process.argv[1]) {
  validateArtifacts(); console.log('Valid: 597 foods, 15 categories, provenance, nutrients, portions and search index.');
}
