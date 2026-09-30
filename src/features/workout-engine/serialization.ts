import { validateCompoundPerformance } from './compoundSets';
import { prescriptionOf } from './setAdapter';
import { historyStructure } from './workoutStructure';
import type { ExerciseSet, WorkoutSessionRecord } from '../../types';
import { normalizeSet } from './setAdapter';
import { validateBlocks } from './blocks';
import { SET_METHODS, SET_ROLES } from './contracts';

function finite(value: unknown, name: string, integer = false, max = Infinity): void {
  if (value === undefined || value === null) return;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) throw new Error(`Valor inválido: ${name}`);
}

export function validateSet(set: ExerciseSet): void {
  if (!set || typeof set !== 'object' || typeof set.id !== 'string' || !set.id || typeof set.completed !== 'boolean' || typeof set.weight !== 'number' || typeof set.reps !== 'number' || typeof set.setNumber !== 'number') throw new Error('Série inválida.');
  finite(set.setNumber, 'setNumber', true);
  finite(set.weight, 'weight'); finite(set.reps, 'reps', true);
  if (set.performance) validateCompoundPerformance(prescriptionOf(set), set.performance);
  const s = normalizeSet(set);
  const p = s.prescription;
  const r = s.performance;
  if (p.schemaVersion !== 1 || r.schemaVersion !== 1) throw new Error('Versão de série não suportada.');
  if (!Object.values(SET_ROLES).includes(p.role) || !Object.values(SET_METHODS).includes(p.method)) throw new Error('Função/método inválido.');
  if (typeof r.completed !== 'boolean') throw new Error('Execução inválida.');
  for (const value of [p, r, ...(r.segments ?? [])]) {
    finite(value.weightKg, 'weightKg'); finite(value.reps, 'reps', true);
    finite(value.rir, 'rir', true); finite(value.rpe, 'rpe', false, 10);
  }
  finite(p.restSeconds, 'restSeconds');
  const ids = new Set<string>(); const orders = new Set<number>();
  for (const segment of r.segments ?? []) {
    if (!segment.id || ids.has(segment.id) || orders.has(segment.order) || !Number.isInteger(segment.order) || segment.order < 0 || !['PRIMARY', 'DROP', 'REST_PAUSE'].includes(segment.kind)) throw new Error('Segmento inválido/duplicado.');
    ids.add(segment.id); orders.add(segment.order); finite(segment.restBeforeSeconds, 'restBeforeSeconds');
  }
  const validateLoad = (rule: NonNullable<typeof p.loadRule>) => {
    if (!['ABSOLUTE', 'PERCENT_PREVIOUS', 'PERCENT_TOP_SET', 'PERCENT_WORKING_LOAD'].includes(rule.mode)) throw new Error('LoadRule inválida.');
    const value = rule.mode === 'ABSOLUTE' ? rule.weightKg : rule.percent;
    if (value === undefined) throw new Error('Carga/percentual obrigatório.');
    finite(value, 'load');
    if (rule.increment) {
      finite(rule.increment.amount, 'increment');
      if (!(rule.increment.amount > 0) || rule.increment.unit !== 'kg' || !['nearest', 'up', 'down'].includes(rule.increment.rounding)) throw new Error('Incremento inválido.');
    }
  };
  if (p.loadRule) validateLoad(p.loadRule);
  const config = p.methodConfig;
  if (config) {
    if (config.method !== p.method) throw new Error('MethodConfig incompatível.');
    if (config.method === 'dropset') for (const drop of config.drops) {
      if (drop.loadRule) validateLoad(drop.loadRule);
      finite(drop.targetReps, 'drop reps', true); finite(drop.restSeconds, 'drop rest');
    }
    if (config.method === 'rest_pause') for (const pause of config.pauses) {
      if (pause.restSeconds === undefined) throw new Error('Pausa obrigatória.');
      finite(pause.restSeconds, 'pause'); finite(pause.targetReps, 'pause reps', true);
    }
    if (config.method === 'amrap') {
      finite(config.timeLimitSeconds, 'timeLimit'); finite(config.targetRir, 'targetRir', true); finite(config.maxReps, 'maxReps', true);
    }
  }
}

export function serializeSet(set: ExerciseSet): string {
  validateSet(set);
  return JSON.stringify(normalizeSet(set));
}
export function deserializeSet(json: string): ExerciseSet {
  const set = JSON.parse(json) as ExerciseSet;
  validateSet(set);
  return normalizeSet(set);
}

/** Additive in-memory adaptation. Reading does not write to storage. */
export function normalizeSession(session: WorkoutSessionRecord): WorkoutSessionRecord {
  const structure = historyStructure(session);
  return { ...structuredClone(session), blocks: structure.blocks,
    exercises: structure.exercises.map(ex => {
      const { id, name, sets, ...rest } = ex;
      return { ...rest, exerciseId: ex.legacyExerciseId ?? id, exerciseName: name,
        sets: sets.map(set => { const { id: setId, ...log } = set; return { ...log, setId }; }) };
    }) };
}
export function serializeSession(session: WorkoutSessionRecord): string {
  if (session.workoutEngineVersion !== undefined && session.workoutEngineVersion !== 1) throw new Error('Versão de treino não suportada.');
  for (const exercise of session.exercises) for (const [index, set] of exercise.sets.entries()) validateSet({ ...set, id: set.setId ?? `legacy-${index}` });
  const normalized = normalizeSession(session);
  if (normalized.blocks) validateBlocks(normalized.blocks, normalized.exercises.map(ex => ex.exerciseInstanceId!));
  return JSON.stringify(normalized);
}
export function deserializeSession(json: string): WorkoutSessionRecord {
  const session = JSON.parse(json) as WorkoutSessionRecord;
  serializeSession(session);
  return normalizeSession(session);
}
