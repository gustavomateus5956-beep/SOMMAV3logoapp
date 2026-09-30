import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { NutritionCatalogService } from '../src/features/nutrition/NutritionCatalogService';
import { SommaFoodProvider } from '../src/features/nutrition/SommaFoodProvider';
import { calculateNutritionForGrams, resolveFoodQuantity } from '../src/features/nutrition/nutritionCalculation';
import { toLegacyFoodItem, toLegacyMacros, toMealFoodEntry, sumMealNutrition, displayNutrient, nutrientPercent, remainingNutrient } from '../src/features/nutrition/legacyFoodAdapter';
import { INITIAL_NUTRITION_PLAN } from '../src/data/dietData';
import { AddFoodModal } from '../src/components/AddFoodModal';
import type { Food, IFoodProvider, FoodSearchResult } from '../src/features/nutrition/food';

// Synthetic calculations are test fixtures, not additions to the real catalog.
const fixture = (): Food => ({ id:'fixture',name:'Alimento de teste',category:'cereais-e-derivados',
  aliases:['teste'], source:'custom', nutritionPer100g:{calories:128,protein:2.123456,carbohydrates:20,fat:0,
    micronutrients:{testVitamin:{value:5.6789,unit:'µg'}}}, portions:[],householdMeasures:[],
  metadata:{sourceVersion:'fixture-v1',sourceRecordId:'fixture',notes:'Synthetic fixture only'} });
const fixtureService=()=>new NutritionCatalogService({provider:new SommaFoodProvider([fixture()]),catalogVersion:'fixture-v1'});

test('service searches all 597 records, accent-free aliases, category, stable pagination and ID',async()=>{
  const s=new NutritionCatalogService();
  assert.equal((await s.search('')).total,597);
  assert((await s.search('FEIJAO PRETO cozido')).items.some(f=>f.id==='somma:taco:4:0567'));
  assert((await s.search('macaxeira cozida')).items.some(f=>f.id==='somma:taco:4:0129'));
  assert.equal((await s.search('',{category:'frutas-e-derivados'})).total,96);
  assert.equal((await s.getById('somma:taco:4:0001'))!.name,'Arroz integral cozido');
  assert.equal(await s.getById('missing'),null);
  const ids:string[]=[];
  for(let page=1;page<=6;page++) {
    const r=await s.search('',{page,limit:100});ids.push(...r.items.map(f=>f.id));
    assert.equal(r.hasNextPage,page<6);
  }
  assert.equal(ids.length,597);assert.equal(new Set(ids).size,597);
  await assert.rejects(s.search('',{page:0}),RangeError);
  await assert.rejects(s.calculate('missing',{amount:150,unit:'g'}),/não encontrado/);
});
test('128 kcal per 100 g becomes 192 kcal per 150 g; micronutrients keep units and precision',()=>{
  const per100=fixture().nutritionPer100g;
  const n=calculateNutritionForGrams(per100,150);
  assert.equal(n.calories,192);assert.equal(n.protein,2.123456*1.5);
  assert.equal(n.micronutrients!.testVitamin.value,5.6789*1.5);
  assert.equal(n.micronutrients!.testVitamin.unit,'µg');
  assert.equal(per100.protein,2.123456);
  assert.notEqual(n.micronutrients,per100.micronutrients);
});
test('unknown is absent through calculation, adapter, snapshot and meal entry; real zero remains zero',async()=>{
  const s=fixtureService(); const snap=await s.createSnapshot('fixture',{amount:150,unit:'g'});
  const view=toLegacyFoodItem(fixture()); const entry=toMealFoodEntry(snap,'test-entry');
  assert.equal(snap.nutrients.sodium,undefined);assert.equal(view.fiber,undefined);
  assert.equal(entry.fats,0);assert.equal(displayNutrient(undefined),'—');
  assert.equal(displayNutrient(0),'0');
  const empty=fixture();empty.nutritionPer100g={};
  const absent=await new NutritionCatalogService({provider:new SommaFoodProvider([empty]),catalogVersion:'test'})
    .createSnapshot('fixture',{amount:100,unit:'g'});
  const missingEntry=toMealFoodEntry(absent,'unknown');
  assert.equal(missingEntry.calories,undefined);assert(!('calories' in missingEntry));
  assert.deepEqual(JSON.parse(JSON.stringify(absent)).nutrients,{});
});
test('adapter maps carbohydrates/fat only and rounds the final quantity, never the source first',async()=>{
  const s=fixtureService();const snap=await s.createSnapshot('fixture',{amount:150,unit:'g'});
  const entry=toMealFoodEntry(snap,'test');
  assert.equal(entry.protein,3.2); assert.equal(entry.carbs,30); assert.equal(entry.fats,0);
  assert.equal(entry.snapshot!.nutrients.protein,3.185184);
  assert.equal(toLegacyFoodItem(fixture()).servingUnit,'g');
  assert.deepEqual(toLegacyMacros({calories:128.49,carbohydrates:4.567,fat:1.234}),{calories:128,carbs:4.6,fats:1.2});
  const totals=sumMealNutrition([entry,entry]);
  assert.equal(totals.protein,6.370368); // not 3.2 + 3.2
});
test('quantity validation rejects zero, negative, non-finite values and overflow',()=>{
  for(const grams of [0,-1,NaN,Infinity,-Infinity])
    assert.throws(()=>calculateNutritionForGrams({calories:128},grams),RangeError);
  assert.throws(()=>calculateNutritionForGrams({calories:1000},Number.MAX_VALUE),RangeError);
  assert.throws(()=>calculateNutritionForGrams({calories:NaN},100),RangeError);
  assert.throws(()=>calculateNutritionForGrams({protein:-1},100),RangeError);
});
test('ambiguous ml and household units are refused; documented food-specific mass is scaled',()=>{
  const f=fixture();
  f.portions=[{id:'volume-only',label:'Copo',amount:1,unit:'copo',milliliters:200},
    {id:'documented',label:'Duas fatias',amount:2,unit:'fatia',grams:60},
    {id:'liquid',label:'100 ml com massa medida',amount:100,unit:'ml',grams:103}];
  for(const unit of ['ml','unidade','colher_sopa','concha','xicara','fatia'] as const)
    assert.throws(()=>resolveFoodQuantity(f,{amount:1,unit}),/massa documentada/);
  assert.throws(()=>resolveFoodQuantity(f,{amount:1,unit:'copo',portionId:'volume-only'}));
  assert.throws(()=>resolveFoodQuantity(f,{amount:1,unit:'fatia',portionId:'other-food-portion'}));
  assert.throws(()=>resolveFoodQuantity(f,{amount:1,unit:'ml',portionId:'documented'}));
  assert.equal(resolveFoodQuantity(f,{amount:3,unit:'fatia',portionId:'documented'}).grams,90);
  assert.equal(resolveFoodQuantity(f,{amount:200,unit:'ml',portionId:'liquid'}).grams,206);
  f.portions.push({...f.portions[1]});
  assert.throws(()=>resolveFoodQuantity(f,{amount:1,unit:'fatia',portionId:'documented'}));
});
test('historical snapshot is deep-frozen and independent of future provider records and JSON copies',async()=>{
  let current=fixture();
  const provider:IFoodProvider={providerId:'somma',displayName:'fixture',
    search:async()=>({items:[current],provider:'somma',page:1,limit:20,hasNextPage:false}),
    getById:async()=>current};
  const s=new NutritionCatalogService({provider,catalogVersion:'v1'});
  const snap=await s.createSnapshot('fixture',{amount:150,unit:'g'});
  const before=JSON.stringify(snap);
  current.name='Nome atualizado';current.nutritionPer100g.calories=999;
  current.metadata!.notes='Mudou';
  assert.equal(JSON.stringify(snap),before);
  assert(Object.isFrozen(snap));assert(Object.isFrozen(snap.nutrients.micronutrients!.testVitamin));
  assert.equal(Reflect.set(snap.nutrients,'calories',1),false);
  assert.equal(Reflect.set(snap.provenance!,'notes','changed'),false);
  const parsed=JSON.parse(before);parsed.nutrients.calories=2;
  assert.equal(snap.nutrients.calories,192);
  assert.equal(snap.catalogVersion,'v1');assert.equal(snap.quantity.amount,150);
  assert.equal(snap.provider,'somma');assert.equal(snap.source,'custom');
  assert.equal(snap.displayName,'Alimento de teste');
  assert.equal(snap.provenance!.sourceVersion,'fixture-v1');
});
test('service cancellation is checked before and after awaited operations',async()=>{
  const s=new NutritionCatalogService();const signal=AbortSignal.abort();
  await assert.rejects(s.search('',{signal}));await assert.rejects(s.getById('x',signal));
  await assert.rejects(s.createSnapshot('x',{amount:100,unit:'g'},signal));
  let release!:(value:FoodSearchResult)=>void;
  const provider:IFoodProvider={providerId:'somma',displayName:'delayed',
    search:()=>new Promise(r=>{release=r;}),getById:async()=>fixture()};
  const delayed=new NutritionCatalogService({provider,catalogVersion:'test'});
  const c=new AbortController();const pending=delayed.search('',{signal:c.signal});c.abort();
  release({items:[fixture()],provider:'somma',page:1,limit:20,hasNextPage:false});
  await assert.rejects(pending);
});
test('an in-flight calculation captures the requested quantity before the await',async()=>{
  let release!:(food:Food)=>void;
  const provider:IFoodProvider={providerId:'somma',displayName:'delayed',
    search:async()=>({items:[],provider:'somma',page:1,limit:20,hasNextPage:false}),
    getById:()=>new Promise(r=>{release=r;})};
  const s=new NutritionCatalogService({provider,catalogVersion:'test'});
  const quantity={amount:150,unit:'g' as const}; const pending=s.createSnapshot('fixture',quantity);
  quantity.amount=300; release(fixture());
  assert.equal((await pending).nutrients.calories,192);
});
test('legacy meals keep stored numbers; an unknown nutrient propagates only in its own total',async()=>{
  const entries=INITIAL_NUTRITION_PLAN.meals.filter(m=>m.completed).flatMap(m=>m.foods);
  const original=JSON.stringify(INITIAL_NUTRITION_PLAN);
  const total=sumMealNutrition(entries);
  for(const k of ['calories','protein','carbs','fats'] as const)
    assert.equal(total[k],entries.reduce((n,e)=>n+e[k]!,0));
  const f=fixture();delete f.nutritionPer100g.calories;
  const snap=await new NutritionCatalogService({provider:new SommaFoodProvider([f]),catalogVersion:'test'})
    .createSnapshot(f.id,{amount:100,unit:'g'});
  const mixed=sumMealNutrition([...entries,toMealFoodEntry(snap)]);
  assert.equal(mixed.calories,undefined);assert.equal(mixed.protein,total.protein!+2.123456);
  assert.equal(remainingNutrient(mixed.calories,2000),undefined);
  assert.equal(nutrientPercent(mixed.calories,2000),undefined);
  assert.equal(nutrientPercent(500,2000),25);
  assert.deepEqual(sumMealNutrition([]),{calories:0,protein:0,carbs:0,fats:0});
  assert.equal(JSON.stringify(INITIAL_NUTRITION_PLAN),original);
});
test('AddFoodModal keeps its view contract and uses service plus explicit adapter, never the mock database',async()=>{
  const html=renderToStaticMarkup(React.createElement(AddFoodModal,{mealName:'Almoço',onClose(){},onAddFood(){}}));
  assert(html.includes('Adicionar Alimento'));assert(html.includes('Almoço'));
  assert(html.includes('max-w-lg'));assert(html.includes('Carregando alimentos'));
  assert(html.includes('Cereais e derivados'));assert(html.includes('Frutas e derivados'));
  const source=readFileSync(new URL('../src/components/AddFoodModal.tsx',import.meta.url),'utf8');
  assert(!source.includes('SOLID_FOOD_DATABASE'));
  assert(!source.includes('new SommaFoodProvider'));
  assert(source.includes('service.search('));assert(source.includes('service.createSnapshot('));
  assert(source.includes('toMealFoodEntry(snapshot)'));assert(source.includes('controller.abort()'));
  const s=new NutritionCatalogService();const snap=await s.createSnapshot('somma:taco:4:0003',{amount:150,unit:'g'});
  const entry=toMealFoodEntry(snap);
  assert.equal(entry.portion,150);assert.equal(entry.portionUnit,'g');assert.equal(entry.portionDisplay,'150g');
  assert.equal(entry.calories,192);assert(entry.snapshot);
});
test('unsupported external providers and POF records are refused without fallback',async()=>{
  assert.throws(()=>new NutritionCatalogService({provider:{providerId:'fatsecret'} as IFoodProvider,catalogVersion:'test'}));
  const f=fixture();f.source='pof';
  const s=new NutritionCatalogService({provider:new SommaFoodProvider([f]),catalogVersion:'test'});
  await assert.rejects(s.search(''),/não habilitada/);
  await assert.rejects(s.getById(f.id),/não habilitada/);
});
