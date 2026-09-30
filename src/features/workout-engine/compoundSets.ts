import type { ExerciseSet } from '../../types';
import type { SetPerformance, SetPerformanceSegment, SetPrescription } from './contracts';
import { normalizeSet, updatePrescription, updatePerformance } from './setAdapter';
import { orderedSegments, requiredSegmentKinds, requiredSegmentsPerformed, segmentWasPerformed } from './setMetrics';

/** Explicit prescription action, only before observed execution. No load rules execute. */
export function prescribeCompoundStages(set: ExerciseSet, intensityStages: number, prescribedPauseSeconds?: number): ExerciseSet {
  const s = normalizeSet(set);
  if (!['dropset', 'rest_pause'].includes(s.prescription.method)) throw new Error('Método não composto.');
  if (!Number.isInteger(intensityStages) || intensityStages < 1) throw new Error('Informe ao menos uma etapa de intensidade.');
  if (s.completed || s.performance.segments?.some(segment => segmentWasPerformed(segment, s.performance))) throw new Error('Prescrição não pode ser substituída após execução.');
  if (s.prescription.method === 'rest_pause' && (prescribedPauseSeconds === undefined || !Number.isFinite(prescribedPauseSeconds) || prescribedPauseSeconds < 0)) throw new Error('Informe a pausa prescrita em segundos.');
  return updatePrescription(s, { completionRule: 'ALL_PRESCRIBED_SEGMENTS', methodConfig: s.prescription.method === 'dropset'
    ? { method: 'dropset', drops: Array.from({ length: intensityStages }, () => ({})) }
    // Explicit user prescription only; no timer is scheduled.
    : { method: 'rest_pause', pauses: Array.from({ length: intensityStages }, () => ({ restSeconds: prescribedPauseSeconds! })) } });
}

/** Drafts only. Opening an editor never means a segment was performed. */
export function segmentDrafts(set: ExerciseSet): SetPerformanceSegment[] {
  const s = normalizeSet(set);
  const kinds = requiredSegmentKinds(s.prescription);
  if (!kinds) throw new Error('Defina as etapas prescritas antes de registrar segmentos.');
  const existing = orderedSegments(s.performance);
  const length = Math.max(existing.length, kinds.length);
  return Array.from({ length }, (_, order) => {
    const prior = existing.find(segment => segment.order === order);
    if (prior) return { ...structuredClone(prior), completed: segmentWasPerformed(prior, s.performance) };
    return { id: `segment-${crypto.randomUUID()}`, order, kind: kinds[order], completed: false,
      ...(order === 0 ? { weightKg: s.weight, reps: s.reps } : {}) };
  });
}

/** Additional strict rules apply only to Stage 3 explicit segments, not legacy observations. */
export function validateCompoundPerformance(p: SetPrescription, r: SetPerformance): void {
  if (r.interrupted !== undefined && typeof r.interrupted !== 'boolean') throw new Error('Interrupção inválida.');
  if (r.completed && r.interrupted) throw new Error('Série interrompida não pode estar concluída.');
  if (p.completionRule !== undefined && p.completionRule !== 'ALL_PRESCRIBED_SEGMENTS') throw new Error('Regra de conclusão inválida.');
  if (!r.segments?.some(s => s.completed !== undefined) && !p.completionRule) return;
  const required = requiredSegmentKinds(p);
  if (!required || !['dropset', 'rest_pause'].includes(p.method) || p.methodConfig?.method !== p.method) throw new Error('Etapas prescritas incompatíveis.');
  const segments = orderedSegments(r);
  const ids = new Set<string>();
  for (const [index, s] of segments.entries()) {
    const kind = index === 0 ? 'PRIMARY' : p.method === 'dropset' ? 'DROP' : 'REST_PAUSE';
    if (typeof s.id !== 'string' || !s.id || ids.has(s.id) || s.order !== index || s.kind !== kind || typeof s.completed !== 'boolean') throw new Error('Identidade, ordem ou tipo de segmento inválido.');
    ids.add(s.id);
    for (const [key, value] of Object.entries({ weightKg: s.weightKg, reps: s.reps, rir: s.rir, rpe: s.rpe, restBeforeSeconds: s.restBeforeSeconds })) {
      if (value === undefined || ((key === 'rir' || key === 'rpe') && value === null)) continue;
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (['reps', 'rir'].includes(key) && !Number.isInteger(value)) || (key === 'rpe' && value > 10)) throw new Error(`Valor inválido: ${key}`);
    }
    if (s.completed && (s.reps === undefined || s.reps === null)) throw new Error('Repetições observadas são obrigatórias ao confirmar a etapa.');
  }
  if (r.completed && !requiredSegmentsPerformed(p, r)) throw new Error('Existem etapas prescritas não executadas.');
}

/** Replaces one set's observations atomically, never its prescription. No rest timer side effects. */
export function recordCompoundPerformance(set: ExerciseSet, segments: SetPerformanceSegment[], finish: 'SAVE' | 'COMPLETE' | 'INTERRUPT' = 'SAVE'): ExerciseSet {
  const s = normalizeSet(set);
  const performance: SetPerformance = { ...s.performance, segments: structuredClone(segments), completed: finish === 'COMPLETE', interrupted: finish === 'INTERRUPT' };
  if (!segments.length || segments.some(segment => typeof segment.completed !== 'boolean')) throw new Error('Confirme explicitamente as etapas executadas.');
  validateCompoundPerformance(s.prescription, performance);
  const main = segments.find(segment => segment.kind === 'PRIMARY');
  performance.weightKg = main?.weightKg;
  performance.reps = main?.reps;
  performance.rir = main?.rir;
  performance.rpe = main?.rpe;
  return updatePerformance(s, performance);
}
