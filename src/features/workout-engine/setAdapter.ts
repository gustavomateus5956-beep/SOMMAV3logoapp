import { isSetCompleted, orderedSegments, primaryPerformance } from './setMetrics';
import type { Exercise, ExerciseSet, CompletedSetLog, Routine } from '../../types';
import type { SetPrescription, SetPerformance } from './contracts';

type SetData = Omit<ExerciseSet, 'id'> & { id?: string };
export function prescriptionOf(set: SetData): SetPrescription {
  if (set.prescription) return structuredClone(set.prescription);
  return {
    schemaVersion: 1,
    role: set.role ?? (set.type === 'warmup' ? 'warmup' : 'working'),
    method: set.method ?? (set.type === 'dropset' ? 'dropset' : set.type === 'rest_pause' ? 'rest_pause' : set.type === 'amrap' ? 'amrap' : 'normal'),
    // Legacy execution is never promoted to a target.
    weightKg: set.targetWeight, reps: set.targetReps, repsRange: set.targetRepsRange,
    rir: set.rir, rpe: set.rpe, restSeconds: set.restTimeSeconds, instruction: set.instruction
  };
}

export function normalizeSet<T extends SetData>(set: T): T & { prescription: SetPrescription; performance: SetPerformance } {
  const prescription = prescriptionOf(set);
  const performance: SetPerformance = set.performance ? structuredClone(set.performance) : {
    schemaVersion: 1, completed: set.completed, weightKg: set.weight, reps: set.reps
  };
  const main = orderedSegments(performance).find(segment => segment.kind === 'PRIMARY');
  // Flat fields are a compatibility projection of PRIMARY, never the intensity total.
  if (main) {
    performance.weightKg = main.weightKg; performance.reps = main.reps;
    performance.rir = main.rir; performance.rpe = main.rpe;
  }
  performance.completed = isSetCompleted({ ...set, prescription, performance });
  return {
    ...structuredClone(set), prescription, performance,
    role: prescription.role, method: prescription.method,
    targetWeight: prescription.weightKg, targetReps: prescription.reps,
    targetRepsRange: prescription.repsRange, rir: prescription.rir, rpe: prescription.rpe,
    restTimeSeconds: prescription.restSeconds, instruction: prescription.instruction,
    weight: main ? main.weightKg ?? 0 : performance.weightKg ?? set.weight, reps: main ? main.reps ?? 0 : performance.reps ?? set.reps,
    completed: performance.completed
  };
}

export function updatePerformance<T extends SetData>(set: T, patch: Partial<Omit<SetPerformance, 'schemaVersion'>>): T {
  const current = normalizeSet(set);
  return normalizeSet({ ...current, performance: { ...current.performance, ...structuredClone(patch) } });
}

export function updatePrescription<T extends SetData>(set: T, patch: Partial<Omit<SetPrescription, 'schemaVersion'>>): T {
  const current = normalizeSet(set);
  if (patch.method && patch.method !== current.prescription.method && current.performance.segments?.length) throw new Error('Preserve o método da série com segmentos registrados.');
  const prescription = { ...current.prescription, ...structuredClone(patch) };
  if (prescription.methodConfig?.method !== prescription.method) delete prescription.methodConfig;
  if (!['dropset', 'rest_pause'].includes(prescription.method)) delete prescription.completionRule;
  return normalizeSet({ ...current, prescription });
}

export function normalizeExercises(exercises: Exercise[]): Exercise[] {
  return exercises.map(ex => ({ ...structuredClone(ex), sets: ex.sets.map(normalizeSet) }));
}

export function startRoutineExercises(routine: Routine | null): Exercise[] {
  return normalizeExercises(routine?.exercises ?? []);
}

export function toCompletedSetLog(set: ExerciseSet, isPr = false): CompletedSetLog {
  const { id, ...log } = normalizeSet(set);
  return { ...log, setId: id, isPr };
}

export function repeatHistoricalSet(set: CompletedSetLog, id: string): ExerciseSet {
  const normalized = normalizeSet(set);
  return normalizeSet({ ...normalized, id, prevWeight: primaryPerformance(normalized)?.weightKg, prevReps: primaryPerformance(normalized)?.reps,
    weight: normalized.prescription.weightKg ?? 0, reps: normalized.prescription.reps ?? 0,
    performance: { schemaVersion: 1, completed: false } });
}
