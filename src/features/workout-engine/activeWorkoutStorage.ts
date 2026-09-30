import type { ActiveWorkoutSession } from '../../context/WorkoutContext';
import { storageService } from '../../services/storageService';
import { normalizeStructure, assertStructure } from './workoutStructure';

export interface ActiveWorkoutDraft { session: ActiveWorkoutSession; status: 'active' | 'minimized' | 'completed' }
export function serializeActiveWorkout(session: ActiveWorkoutSession, status: ActiveWorkoutDraft['status']): string {
  assertStructure(session);
  return JSON.stringify({ schemaVersion: 1, status, session: { ...session, startedAt: session.startedAt.toISOString() } });
}
export function deserializeActiveWorkout(json: string): ActiveWorkoutDraft {
  const raw = JSON.parse(json);
  if (raw.schemaVersion !== 1 || !['active', 'minimized', 'completed'].includes(raw.status) || !raw.session) throw new Error('Rascunho de treino não suportado.');
  const session = raw.session;
  const startedAt = new Date(session.startedAt);
  if (!Number.isFinite(startedAt.getTime()) || !Number.isFinite(session.seconds) || session.seconds < 0) throw new Error('Tempo de treino inválido.');
  for (const key of ['restSeconds', 'restTotalSeconds']) if (session[key] !== null && (!Number.isFinite(session[key]) || session[key] < 0)) throw new Error('Descanso inválido.');
  return { status: raw.status, session: { ...session, ...normalizeStructure(session.exercises, session.blocks), startedAt } };
}
export function readActiveWorkout(userId: string): ActiveWorkoutDraft | null {
  const json = storageService.getActiveWorkoutDraft(userId);
  if (!json) return null;
  try { return deserializeActiveWorkout(json); } catch (error) { console.error('Rascunho de treino inválido:', error); return null; }
}
export function writeActiveWorkout(userId: string, session: ActiveWorkoutSession, status: ActiveWorkoutDraft['status']): void {
  storageService.saveActiveWorkoutDraft(userId, serializeActiveWorkout(session, status));
}
export function clearActiveWorkout(userId: string): void { storageService.clearActiveWorkoutDraft(userId); }
