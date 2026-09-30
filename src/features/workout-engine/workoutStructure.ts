import { isPrimaryPr, primaryPerformance } from './setMetrics';
import type { Exercise, Routine, WorkoutSessionRecord, CompletedExerciseLog } from '../../types';
import type { WorkoutBlock } from './contracts';
import { normalizeExercises, normalizeSet, toCompletedSetLog } from './setAdapter';
import { validateBlocks } from './blocks';

export interface WorkoutStructure { exercises: Exercise[]; blocks: WorkoutBlock[] }
const uuid = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const standard = (id: string, order: number): WorkoutBlock => ({ schemaVersion: 1, id: uuid('block'), type: 'STANDARD', order, exerciseIds: [id] });

/** Allocate identity once; catalogRef and legacy IDs remain independent. */
export function instantiateExercise(exercise: Exercise): Exercise {
  const id = uuid('exercise');
  return { ...structuredClone(exercise), legacyExerciseId: exercise.legacyExerciseId ?? exercise.id,
    id, exerciseInstanceId: id, sets: exercise.sets.map(normalizeSet) };
}

export function assertStructure(structure: WorkoutStructure): void {
  const ids = structure.exercises.map(ex => ex.exerciseInstanceId!);
  if (ids.some((id, i) => !id || structure.exercises[i].id !== id) || new Set(ids).size !== ids.length) throw new Error('Identidade de instância inválida/duplicada.');
  validateBlocks(structure.blocks, ids);
  if (structure.blocks.some(b => b.type === 'SUPERSET' && b.exerciseIds.length !== 2)) throw new Error('Esta versão aceita apenas Superset de dois exercícios.');
  if (JSON.stringify(structure.blocks.flatMap(b => b.exerciseIds)) !== JSON.stringify(ids)) throw new Error('Blocos devem cobrir todos os exercícios na ordem visual.');
}

function ordered(exercises: Exercise[], blocks: WorkoutBlock[]): WorkoutStructure {
  const orderedBlocks = blocks.map((b, order) => ({ ...structuredClone(b), order }));
  const byId = new Map(exercises.map(ex => [ex.exerciseInstanceId, ex]));
  const sorted = orderedBlocks.flatMap(b => b.exerciseIds.map(id => {
    const ex = byId.get(id); if (!ex) throw new Error('Membro de bloco inexistente.'); return structuredClone(ex);
  }));
  const result = { exercises: sorted, blocks: orderedBlocks }; assertStructure(result); return result;
}

/** Pure, additive legacy normalization; never infers a Superset or writes storage. */
export function normalizeStructure(exercises: Exercise[], blocks?: WorkoutBlock[]): WorkoutStructure {
  const normalized = normalizeExercises(exercises).map(ex => ex.exerciseInstanceId
    ? { ...ex, id: ex.exerciseInstanceId } : instantiateExercise(ex));
  const existing = new Set(normalized.map(ex => ex.exerciseInstanceId!));
  if (existing.size !== normalized.length) throw new Error('Instâncias duplicadas.');
  const normalizedBlocks = (blocks ?? []).map(b => ({ ...structuredClone(b), exerciseIds: b.exerciseIds.map(ref => {
    if (existing.has(ref)) return ref;
    const matches = exercises.flatMap((ex, index) => ex.id === ref ? [normalized[index].exerciseInstanceId!] : []);
    if (matches.length !== 1) throw new Error('Referência de bloco legado ambígua ou ausente.');
    return matches[0];
  }) })).sort((a,b) => a.order-b.order);
  validateBlocks(normalizedBlocks, [...existing]);
  const used = new Set(normalizedBlocks.flatMap(b => b.exerciseIds));
  normalized.forEach(ex => { if (!used.has(ex.exerciseInstanceId!)) normalizedBlocks.push(standard(ex.exerciseInstanceId!, normalizedBlocks.length)); });
  return ordered(normalized, normalizedBlocks);
}

/** Used for set edits, adding exercises and removing exercises. Blocks own ordering. */
export function reconcileExercises(current: WorkoutStructure, exercises: Exercise[]): WorkoutStructure {
  const normalized = normalizeExercises(exercises).map(ex => ex.exerciseInstanceId ? ex : instantiateExercise(ex));
  const ids = new Set(normalized.map(ex => ex.exerciseInstanceId!));
  const blocks = current.blocks.flatMap(block => {
    const members = block.exerciseIds.filter(id => ids.has(id));
    if (!members.length) return [];
    return [{ ...block, exerciseIds: members, type: members.length === 1 ? 'STANDARD' as const : block.type }];
  });
  return normalizeStructure(normalized, blocks);
}

export function addExercise(current: WorkoutStructure, exercise: Exercise): WorkoutStructure {
  const next = instantiateExercise(exercise);
  next.sets = next.sets.map(set => normalizeSet({ ...set, id: uuid('set'), performance: { schemaVersion: 1, completed: false } }));
  return reconcileExercises(current, [...current.exercises, next]);
}
export function removeExercise(current: WorkoutStructure, instanceId: string): WorkoutStructure {
  return reconcileExercises(current, current.exercises.filter(ex => ex.exerciseInstanceId !== instanceId));
}

export function createSuperset(current: WorkoutStructure, first: string, second: string, visualType: 'superset' | 'biset' = 'superset'): WorkoutStructure {
  assertStructure(current);
  const a = current.blocks.find(b => b.exerciseIds.includes(first));
  const b = current.blocks.find(b => b.exerciseIds.includes(second));
  if (!a || !b || a.id === b.id || a.type !== 'STANDARD' || b.type !== 'STANDARD') throw new Error('Escolha dois exercícios independentes.');
  const combined: WorkoutBlock = { ...a, type: 'SUPERSET', name: `SUPERSET ${current.blocks.filter(b => b.type === 'SUPERSET').length + 1}`,
    exerciseIds: [first, second], legacyVisualType: visualType, restBetweenExercisesSeconds: a.restBetweenExercisesSeconds ?? 0, restAfterBlockSeconds: a.restAfterBlockSeconds ?? 90 };
  return ordered(current.exercises, current.blocks.filter(block => block.id !== b.id).map(block => block.id === a.id ? combined : block));
}

/** Adding a second member to STANDARD creates SUPERSET; a third is explicitly unsupported. */
export function addExerciseToBlock(current: WorkoutStructure, blockId: string, instanceId: string): WorkoutStructure {
  const block = current.blocks.find(b => b.id === blockId);
  if (!block || block.type !== 'STANDARD') throw new Error('Não é permitido adicionar um terceiro membro.');
  return createSuperset(current, block.exerciseIds[0], instanceId);
}
export function swapBlockMembers(current: WorkoutStructure, blockId: string): WorkoutStructure {
  const block = current.blocks.find(b => b.id === blockId);
  if (!block || block.type !== 'SUPERSET') throw new Error('Superset inexistente.');
  return ordered(current.exercises, current.blocks.map(b => b.id === blockId ? { ...b, exerciseIds: [...b.exerciseIds].reverse() } : b));
}
export function dissolveBlock(current: WorkoutStructure, blockId: string): WorkoutStructure {
  return ordered(current.exercises, current.blocks.flatMap(b => b.id === blockId && b.type === 'SUPERSET'
    ? b.exerciseIds.map((id, i) => ({ ...b, id: i === 0 ? b.id : uuid('block'), type: 'STANDARD' as const, exerciseIds: [id] })) : [b]));
}
export function removeBlockMember(current: WorkoutStructure, blockId: string, instanceId: string): WorkoutStructure {
  const block = current.blocks.find(b => b.id === blockId);
  if (!block?.exerciseIds.includes(instanceId)) throw new Error('Membro inexistente.');
  // V1 pair: both stay in the workout, in the same visual order, now independent.
  return dissolveBlock(current, blockId);
}
export function updateBlockRest(current: WorkoutStructure, blockId: string, between: number, after: number): WorkoutStructure {
  if (![between, after].every(n => Number.isFinite(n) && n >= 0)) throw new Error('Descanso inválido.');
  if (!current.blocks.some(b => b.id === blockId)) throw new Error('Bloco inexistente.');
  return ordered(current.exercises, current.blocks.map(b => b.id === blockId ? { ...b, restBetweenExercisesSeconds: between, restAfterBlockSeconds: after } : b));
}

/** New workout: fresh identities, targets retained, no previous execution copied. */
export function startWorkoutStructure(routine: Routine | null): WorkoutStructure {
  const source = normalizeStructure(routine?.exercises ?? [], routine?.blocks);
  const remap = new Map<string, string>();
  const exercises = source.exercises.map(ex => {
    const next = instantiateExercise(ex); remap.set(ex.exerciseInstanceId!, next.exerciseInstanceId!);
    next.sets = next.sets.map(set => normalizeSet({ ...set, id: uuid('set'),
      weight: set.prescription?.weightKg ?? (routine?.fromHistory ? 0 : set.weight), reps: set.prescription?.reps ?? (routine?.fromHistory ? 0 : set.reps),
      performance: { schemaVersion: 1, completed: false } }));
    return next;
  });
  return ordered(exercises, source.blocks.map(b => ({ ...b, id: uuid('block'), exerciseIds: b.exerciseIds.map(id => remap.get(id)!) })));
}

export function toCompletedExerciseLog(exercise: Exercise): CompletedExerciseLog {
  const { id, name, sets, ...metadata } = structuredClone(exercise);
  return { ...metadata, exerciseId: exercise.legacyExerciseId ?? exercise.id, exerciseInstanceId: exercise.exerciseInstanceId,
    catalogRef: structuredClone(exercise.catalogRef), legacyExerciseId: exercise.legacyExerciseId,
    exerciseName: exercise.name, muscleGroup: exercise.muscleGroup, professionalNote: exercise.professionalNote,
    restSeconds: exercise.restSeconds,
    sets: exercise.sets.map(s => toCompletedSetLog(s, isPrimaryPr(s))) };
}

export function historyStructure(session: WorkoutSessionRecord): WorkoutStructure {
  return normalizeStructure(session.exercises.map(ex => ({ ...structuredClone(ex), id: ex.exerciseInstanceId ?? ex.exerciseId,
    exerciseInstanceId: ex.exerciseInstanceId, legacyExerciseId: ex.legacyExerciseId ?? ex.exerciseId,
    name: ex.exerciseName, muscleGroup: ex.muscleGroup,
    sets: ex.sets.map(s => normalizeSet({ ...s, id: s.setId ?? uuid('set') })) })), session.blocks);
}
export function repeatWorkoutRoutine(session: WorkoutSessionRecord): Routine {
  const source = historyStructure(session);
  return { id: session.routineId ?? uuid('routine'), name: session.routineName, category: session.muscleGroups ?? 'Treino',
    muscleGroups: session.muscleGroups, lastSession: session.dateDisplay, exercisesCount: source.exercises.length,
    estimatedMinutes: session.durationMinutes, blocks: source.blocks, fromHistory: true,
    exercises: source.exercises.map(ex => ({ ...ex, sets: ex.sets.map(set => normalizeSet({ ...set,
      prevWeight: primaryPerformance(set)?.weightKg, prevReps: primaryPerformance(set)?.reps, weight: set.prescription?.weightKg ?? 0, reps: set.prescription?.reps ?? 0,
      performance: { schemaVersion: 1, completed: false } })) })) };
}

/** Optional previous values use explicit reference only, never a name or array position as exercise identity. */
export function previousExerciseReference(exercise: Exercise, history: WorkoutSessionRecord[]): CompletedExerciseLog | undefined {
  for (const session of history) {
    const matches = session.exercises.filter(old => exercise.catalogRef && old.catalogRef
      ? exercise.catalogRef.provider === old.catalogRef.provider && exercise.catalogRef.id === old.catalogRef.id
      : (exercise.legacyExerciseId ?? exercise.id) === (old.legacyExerciseId ?? old.exerciseId));
    if (matches.length > 1) return undefined; // Cannot attribute duplicate old occurrences safely.
    if (matches.length === 1) return matches[0];
  }
  return undefined;
}
