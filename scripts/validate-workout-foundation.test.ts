import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeSet, updatePerformance, updatePrescription, toCompletedSetLog, startRoutineExercises, repeatHistoricalSet } from '../src/features/workout-engine/setAdapter';
import { serializeSet, deserializeSet, serializeSession, deserializeSession } from '../src/features/workout-engine/serialization';
import { fromVisualBlock, toVisualBlock, validateBlocks } from '../src/features/workout-engine/blocks';
import { SET_ROLES, SET_METHODS } from '../src/features/workout-engine/contracts';
import type { ExerciseSet, WorkoutSessionRecord } from '../src/types';
import { INITIAL_ROUTINES } from '../src/data/mockData';
import { calculateWorkoutMuscleScores } from '../src/features/muscle-map/sommaMuscleMapAdapter';
import { LocalWorkoutRepository } from '../src/data/repositories/LocalWorkoutRepository';
const legacy: ExerciseSet = { id: 's1', setNumber: 1, weight: 80, reps: 10, completed: false };
const file = (path: string) => readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const session = (set = legacy): WorkoutSessionRecord => ({ id:'session', userId:'test', routineName:'Teste', startedAt:'2026-09-29T10:00:00Z', finishedAt:'2026-09-29T10:05:00Z', dateDisplay:'Hoje', durationMinutes:5, durationFormatted:'5 min', totalVolume:0, totalCompletedSets:0, totalExercises:1, exercises:[{exerciseId:'ex1',exerciseName:'Supino',muscleGroup:'Peitoral',sets:[toCompletedSetLog(set)]}] });
test('legacy defaults and no invented prescription from execution',()=>{
 const s=normalizeSet(legacy); assert.equal(s.role,'working');assert.equal(s.method,'normal');assert.equal(s.prescription.weightKg,undefined);assert.equal(s.prescription.rir,undefined);assert.equal(s.performance.rir,undefined); assert.equal(s.weight,80);assert.equal(legacy.prescription,undefined);
});
test('legacy type fallback and canonical precedence',()=>{
 for(const [type,role,method] of [['warmup','warmup','normal'],['dropset','working','dropset'],['rest_pause','working','rest_pause'],['amrap','working','amrap'],['failure','working','normal'],['max_strength','working','normal']] as const){const s=normalizeSet({...legacy,type});assert.equal(s.role,role);assert.equal(s.method,method);assert.equal(s.type,type);}
 const s=normalizeSet({...legacy,type:'warmup',role:'top_set',method:'dropset'});assert.equal(s.role,'top_set');assert.equal(s.method,'dropset');
});
test('all roles and methods serialize independently',()=>{
 for(const role of Object.values(SET_ROLES))for(const method of Object.values(SET_METHODS)){ const s=deserializeSet(serializeSet({...legacy,role,method})); assert.equal(s.role,role); assert.equal(s.method,method); }
});
test('80kg 8–10 RIR2 prescription coexists with 82.5kg 9 RIR1 performance',()=>{
 const s=normalizeSet({...legacy,targetWeight:80,targetRepsRange:'8–10',rir:2});const result=updatePerformance(s,{weightKg:82.5,reps:9,rir:1,completed:true});assert.equal(result.prescription?.weightKg,80);assert.equal(result.prescription?.repsRange,'8–10');assert.equal(result.prescription?.rir,2);assert.equal(result.performance?.rir,1);assert.equal(result.weight,82.5);assert.equal(result.reps,9);assert.equal(s.weight,80);
});
test('editing prescription never overwrites performance',()=>{
 const s=updatePerformance(legacy,{weightKg:82.5,rir:1});const next=updatePrescription(s,{weightKg:80,rir:2,method:'amrap'});assert.deepEqual(next.performance,s.performance);assert.equal(next.targetWeight,80);
});
test('three segments belong to one set and round trip without extra completed sets',()=>{
 const s=updatePerformance(legacy,{completed:true,segments:[{id:'main',order:0,kind:'PRIMARY',weightKg:80,reps:9},{id:'drop1',order:1,kind:'DROP',weightKg:65,reps:10},{id:'drop2',order:2,kind:'DROP',weightKg:52.5,reps:11}]});const out=deserializeSet(serializeSet(s));assert.equal(out.performance?.segments?.length,3);assert.equal(toCompletedSetLog(out).performance?.segments?.[2].weightKg,52.5);assert.equal(session(out).exercises[0].sets.length,1);
});
test('duplicate segments and invalid numbers are rejected',()=>{
 assert.throws(()=>serializeSet({...legacy,weight:NaN}));assert.throws(()=>serializeSet({...legacy,reps:-1}));assert.throws(()=>serializeSet(updatePerformance(legacy,{segments:[{id:'a',order:0,kind:'DROP'},{id:'a',order:1,kind:'DROP'}]})));
});
test('configs and load rules are data only and change no weight',()=>{
 for(const mode of ['PERCENT_PREVIOUS','PERCENT_TOP_SET','PERCENT_WORKING_LOAD'] as const){const s=updatePrescription(legacy,{method:'dropset',loadRule:{mode,percent:80,increment:{amount:2.5,unit:'kg',rounding:'nearest'}},methodConfig:{method:'dropset',drops:[{loadRule:{mode:'ABSOLUTE',weightKg:65},targetReps:10}]}});const out=deserializeSet(serializeSet(s));assert.equal(out.weight,80);assert.equal(out.prescription?.loadRule?.mode,mode);assert.equal(out.performance?.segments,undefined);}
 for(const config of [{method:'rest_pause',pauses:[{restSeconds:15,targetReps:3}]},{method:'amrap',targetRir:1,maxReps:20}] as const){const s=updatePrescription(legacy,{method:config.method,methodConfig:structuredClone(config) as any});assert.equal(deserializeSet(serializeSet(s)).weight,80);}
});
test('method change removes incompatible config; invalid config/version rejected',()=>{
 const s=updatePrescription(legacy,{method:'dropset',methodConfig:{method:'dropset',drops:[]}});assert.equal(updatePrescription(s,{method:'normal'}).prescription?.methodConfig,undefined);
 assert.throws(()=>deserializeSet(JSON.stringify({...s,prescription:{...s.prescription,method:'amrap'}})));assert.throws(()=>deserializeSet(JSON.stringify({...s,performance:{schemaVersion:2,completed:false}})));
});
test('all existing routines retain flat values, source unchanged and zero empty exercises',()=>{
 const before=JSON.stringify(INITIAL_ROUTINES);for(const routine of INITIAL_ROUTINES){const exercises=startRoutineExercises(routine);assert.equal(exercises.length,routine.exercises.length);for(const [i,ex]of exercises.entries())for(const [j,s]of ex.sets.entries()){const old=routine.exercises[i].sets[j];assert.equal(s.weight,old.weight);assert.equal(s.reps,old.reps);assert.equal(s.completed,old.completed);}}
 assert.equal(JSON.stringify(INITIAL_ROUTINES),before);assert.deepEqual(startRoutineExercises(null),[]);
});
test('history preserves role method effort and independent nested data',()=>{
 const s=updatePrescription(legacy,{role:'top_set',method:'amrap',rir:2});const log=toCompletedSetLog(s,true);assert.equal(log.role,'top_set');assert.equal(log.rir,2);log.prescription!.rir=4;assert.equal(s.prescription?.rir,2);assert.equal(log.isPr,true);
});
test('repeat historical session retains prescription but resets execution completion/effort/segments',()=>{
 const s=updatePerformance(updatePrescription(legacy,{rir:2}),{rir:1,completed:true,segments:[{id:'main',kind:'PRIMARY',order:0}]});const repeat=repeatHistoricalSet(toCompletedSetLog(s),'new');assert.equal(repeat.completed,false);assert.equal(repeat.rir,2);assert.equal(repeat.performance?.rir,undefined);assert.equal(repeat.performance?.segments,undefined);assert.equal(s.completed,true);
});
test('session serialization supports old records without IDs or engine version',()=>{
 const old=session();delete old.exercises[0].sets[0].prescription;delete old.exercises[0].sets[0].performance;delete old.exercises[0].sets[0].setId;
 const out=deserializeSession(serializeSession(old));assert.equal(out.id,old.id);assert.equal(out.exercises[0].sets[0].role,'working');assert.equal(old.exercises[0].sets[0].prescription,undefined);assert.equal(out.totalVolume,old.totalVolume);
});
test('visual superset bridge round trip, order and rests unchanged; standard blocks validate',()=>{
 const visual={id:'b1',name:'SUPERSET 1',type:'biset' as const,exerciseIds:['ex1','ex2'],transitionRestSeconds:0,blockRestSeconds:90};const block=fromVisualBlock(visual,0);validateBlocks([block],visual.exerciseIds);assert.deepEqual(toVisualBlock(block),visual);assert.notEqual(block.exerciseIds,visual.exerciseIds);validateBlocks([{schemaVersion:1,id:'single',type:'STANDARD',order:0,exerciseIds:['ex1']}],['ex1']);
 assert.throws(()=>toVisualBlock({...block,exerciseIds:['ex1','ex2','ex3']}));assert.throws(()=>validateBlocks([block],['ex1']));assert.throws(()=>validateBlocks([block,{...block,id:'b2',order:1}],visual.exerciseIds));
});
test('WorkoutBlock persists through JSON contracts without executing anything',()=>{
 const s=session();s.blocks=[{schemaVersion:1,id:'standard',type:'STANDARD',order:0,exerciseIds:['ex1'],restAfterBlockSeconds:90}];const restored=deserializeSession(serializeSession(s));assert.equal(restored.blocks?.[0].id,'standard');assert.deepEqual(restored.blocks?.[0].exerciseIds,[restored.exercises[0].exerciseInstanceId]);
});
test('repository old history read is additive and never rewrites raw storage',async()=>{
 const values=new Map<string,string>();const writes:string[]=[];Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);writes.push(key);}}});
 const repository=new LocalWorkoutRepository();const s=session(updatePerformance(legacy,{completed:true}));await repository.saveWorkoutSession('test',s);const count=writes.length;const result=await repository.getWorkoutHistory('test');assert.equal(writes.length,count);assert.equal(result[0].exercises[0].sets[0].performance?.completed,true);assert.equal((await repository.getLastExercisePerformance('test','Supino'))?.sets[0].weight,80);
});
test('Muscle Map results equal before and after additive adaptation',()=>{
 for(const routine of INITIAL_ROUTINES)assert.deepEqual(calculateWorkoutMuscleScores(startRoutineExercises(routine)),calculateWorkoutMuscleScores(routine.exercises));
});
test('integration guards: both save paths use mapper; rest and local superset remain independent',()=>{
 const modal=file('src/components/ActiveWorkoutModal.tsx');const context=file('src/context/WorkoutContext.tsx');assert.match(modal,/toCompletedSetLog\(s,/);assert.match(context,/toCompletedSetLog\(s,/);assert.match(modal,/updatePerformance\(sets\[setIndex\]/);assert.match(modal,/targetEx.restSeconds \?\? \(targetEx as any\).restTimeSeconds \?\? defaultRestTime/);assert.match(modal,/activeSession\?\.blocks/);assert.ok(!modal.includes('setActiveBlocks'));
});
