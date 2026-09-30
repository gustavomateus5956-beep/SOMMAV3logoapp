import test from 'node:test';
import assert from 'node:assert/strict';
import { SommaFoodProvider } from '../src/features/nutrition/SommaFoodProvider';
import { catalog, validateCatalog, validateArtifacts } from './validate-somma-nutrition';

test('all committed artifacts reconcile, with licensed provenance on every food',validateArtifacts);
test('default provider includes TACO; lookup, accent-free and regional alias searches work',async()=>{
  const p=new SommaFoodProvider();
  assert.equal((await p.search('',{limit:100})).total,597);
  assert.equal((await p.getById('somma:taco:4:0001'))!.name,'Arroz integral cozido');
  assert((await p.search('FEIJAO preto cozido')).items.some(f=>f.name==='Feijão preto cozido'));
  assert((await p.search('aipim cozida')).items.some(f=>f.name==='Mandioca cozida'));
  assert((await p.search('macaxeira cozida')).items.some(f=>f.name==='Mandioca cozida'));
  assert((await p.search('pao de sal')).items.some(f=>f.name==='Pão francês de trigo'));
});
test('preparations remain distinct and category filters select the source group',async()=>{
  const p=new SommaFoodProvider();
  const rice=await p.search('arroz integral');
  assert(rice.items.some(f=>f.name.endsWith('cru')));
  assert(rice.items.some(f=>f.name.endsWith('cozido')));
  assert.equal((await p.search('',{category:'frutas-e-derivados',limit:100})).total,96);
});
test('every original alias and every accent-free name retrieves its own identity',async()=>{
  const p=new SommaFoodProvider();
  for(const f of catalog) {
    for(const query of [f.name.normalize('NFD').replace(/[\u0300-\u036f]/g,''),...f.aliases]) {
      const result=await p.search(query,{limit:100});
      assert(result.items.some(item=>item.id===f.id),`${f.id}: ${query}`);
    }
  }
});
test('source spot-checks, malformed values, trace and zero remain distinguishable',async()=>{
  const p=new SommaFoodProvider();
  const rice=(await p.getById('somma:taco:4:0001'))!;
  assert(Math.abs(rice.nutritionPer100g.calories!-123.5348925)<1e-8);
  assert.equal(rice.nutritionPer100g.cholesterol,undefined);
  assert.equal(rice.metadata!.nutrientStatus!.cholesterol,'notApplicable');
  assert.equal(rice.nutritionPer100g.micronutrients!.riboflavin,undefined);
  assert.equal(rice.metadata!.nutrientStatus!.riboflavin,'trace');
  assert.equal((await p.getById('somma:taco:4:0288'))!.nutritionPer100g.carbohydrates,undefined);
  assert.equal((await p.getById('somma:taco:4:0373'))!.nutritionPer100g.micronutrients!.pyridoxine,undefined);
  assert.equal((await p.getById('somma:taco:4:0540'))!.name,'Feijoada');
  assert(catalog.some(f=>Object.values(f.nutritionPer100g).includes(0)));
  assert(catalog.every(f=>f.nutritionPer100g.sugars===undefined && f.nutritionPer100g.transFat===undefined));
});
test('validator rejects duplicate identities, unlicensed sources, wrong units and invented portions',()=>{
  assert.throws(()=>validateCatalog([catalog[0],catalog[0]]));
  for(const mutate of [
    (f:any)=>f.category='unknown', (f:any)=>f.source='pof',
    (f:any)=>f.metadata.sourceSha256='wrong',
    (f:any)=>f.nutritionPer100g.calories=NaN,
    (f:any)=>f.nutritionPer100g.protein=-1,
    (f:any)=>f.nutritionPer100g.micronutrients.magnesium.unit='g',
    (f:any)=>f.nutritionPer100g.cholesterol=0,
    (f:any)=>f.portions[0].milliliters=100,
    (f:any)=>f.householdMeasures=[{id:'cup',unit:'copo',amount:1,grams:200}],
  ]) {const f=structuredClone(catalog[0]);mutate(f);assert.throws(()=>validateCatalog([f]));}
});
