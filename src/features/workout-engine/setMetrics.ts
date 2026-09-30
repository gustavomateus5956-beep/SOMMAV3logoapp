import type { ExerciseSet } from '../../types';
import type { SetPerformance, SetPerformanceSegment, SetPrescription } from './contracts';

export type SetMetricInput = Pick<ExerciseSet, 'weight' | 'reps' | 'completed'> & Partial<ExerciseSet>;
export type SetExecutionState = 'NOT_STARTED' | 'PARTIAL' | 'COMPLETED';
export const executionLabels: Record<SetExecutionState, string> = { NOT_STARTED: 'Não iniciada', PARTIAL: 'Parcial', COMPLETED: 'Concluída' };
export const segmentLabels = { PRIMARY: 'Principal', DROP: 'Drop', REST_PAUSE: 'Rest-pause' };

export function requiredSegmentKinds(p: SetPrescription): SetPerformanceSegment['kind'][] | undefined {
  const c = p.methodConfig;
  if (c?.method === 'dropset') return ['PRIMARY', ...c.drops.map(() => 'DROP' as const)];
  if (c?.method === 'rest_pause') return ['PRIMARY', ...c.pauses.map(() => 'REST_PAUSE' as const)];
  return undefined;
}
export function orderedSegments(p?: SetPerformance): SetPerformanceSegment[] {
  return [...(p?.segments ?? [])].sort((a, b) => a.order - b.order);
}
export function segmentWasPerformed(s: SetPerformanceSegment, p: SetPerformance): boolean {
  // Legacy unflagged segments were only observations when the parent was checked.
  return s.completed ?? p.completed;
}
export function requiredSegmentsPerformed(p: SetPrescription | undefined, r: SetPerformance): boolean {
  const segments = orderedSegments(r);
  const required = p && requiredSegmentKinds(p);
  if (p?.completionRule && !required) return false;
  if (!required) return segments.length === 0 || segments.every(s => segmentWasPerformed(s, r));
  return required.every((kind, order) => segments.some(s => s.order === order && s.kind === kind && segmentWasPerformed(s, r)))
    && segments.every(s => segmentWasPerformed(s, r));
}
export function setExecutionState(s: SetMetricInput): SetExecutionState {
  const r = s.performance;
  if (!r) return s.completed && !s.prescription?.completionRule ? 'COMPLETED' : 'NOT_STARTED';
  const explicitSegments = s.prescription?.completionRule === 'ALL_PRESCRIBED_SEGMENTS' || r.segments?.some(segment => segment.completed !== undefined);
  if (r.completed && !r.interrupted && (!explicitSegments || requiredSegmentsPerformed(s.prescription, r))) return 'COMPLETED';
  if (r.interrupted || orderedSegments(r).some(segment => segmentWasPerformed(segment, r))) return 'PARTIAL';
  return 'NOT_STARTED';
}
export function isSetCompleted(s: SetMetricInput): boolean { return setExecutionState(s) === 'COMPLETED'; }

/** Reference is always PRIMARY, never the last or heaviest intensity segment. */
export function primaryPerformance(s: SetMetricInput): { weightKg?: number; reps?: number; rir?: number | null; rpe?: number | null } | undefined {
  const r = s.performance;
  if (r?.segments?.length) return orderedSegments(r).find(segment => segment.kind === 'PRIMARY' && segmentWasPerformed(segment, r));
  if (!isSetCompleted(s)) return undefined;
  return { weightKg: r?.weightKg ?? s.weight, reps: r?.reps ?? s.reps, rir: r?.rir, rpe: r?.rpe };
}
export function intensitySegments(s: SetMetricInput): SetPerformanceSegment[] {
  return orderedSegments(s.performance).filter(segment => segment.kind !== 'PRIMARY' && segmentWasPerformed(segment, s.performance!));
}
const nonNegative = (n?: number) => Number.isFinite(n) && n! >= 0 ? n! : 0;
export function setMetrics(s: SetMetricInput) {
  const segments = orderedSegments(s.performance).filter(segment => segmentWasPerformed(segment, s.performance!));
  const completed = isSetCompleted(s);
  const observations = s.performance?.segments?.length ? segments : completed ? [{ weightKg: s.performance?.weightKg ?? s.weight, reps: s.performance?.reps ?? s.reps }] : [];
  return { prescribedSets: 1, completedSets: completed ? 1 : 0,
    // A simple completed performance is one implicit segment, without allocating it in storage.
    performedSegments: observations.length,
    volume: observations.reduce((sum, segment) => sum + nonNegative(segment.weightKg) * nonNegative(segment.reps), 0),
    performedReps: observations.reduce((sum, segment) => sum + nonNegative(segment.reps), 0) };
}
export function isPrimaryPr(s: SetMetricInput): boolean {
  const main = primaryPerformance(s);
  return isSetCompleted(s) && Boolean(s.prevWeight && main?.weightKg !== undefined && main.weightKg > s.prevWeight && (main.reps ?? 0) >= (s.prevReps ?? 0));
}
export function workoutMetrics(exercises: { sets: SetMetricInput[] }[]) {
  return exercises.flatMap(ex => ex.sets).reduce((total, s) => {
    const m = setMetrics(s);
    return { prescribedSets: total.prescribedSets + m.prescribedSets, completedSets: total.completedSets + m.completedSets,
      performedSegments: total.performedSegments + m.performedSegments, performedReps: total.performedReps + m.performedReps,
      volume: total.volume + m.volume, prs: total.prs + Number(isPrimaryPr(s)) };
  }, { prescribedSets: 0, completedSets: 0, performedSegments: 0, performedReps: 0, volume: 0, prs: 0 });
}
