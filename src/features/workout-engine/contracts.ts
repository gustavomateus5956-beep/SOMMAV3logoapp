import type { SetRole, SetMethod } from '../../types';

// Public names, existing wire values: no destructive enum migration.
export const SET_ROLES = { WARMUP: 'warmup', WORKING: 'working', TOP_SET: 'top_set', BACKOFF: 'backoff' } as const satisfies Record<string, SetRole>;
export const SET_METHODS = { STANDARD: 'normal', DROP_SET: 'dropset', REST_PAUSE: 'rest_pause', AMRAP: 'amrap' } as const satisfies Record<string, SetMethod>;

export interface LoadIncrement { amount: number; unit: 'kg'; rounding: 'nearest' | 'up' | 'down' }
export type LoadRule =
  | { mode: 'ABSOLUTE'; weightKg: number; increment?: LoadIncrement }
  | { mode: 'PERCENT_PREVIOUS' | 'PERCENT_TOP_SET' | 'PERCENT_WORKING_LOAD'; percent: number; referenceSetId?: string; increment?: LoadIncrement };

export interface DropSetConfig { method: 'dropset'; drops: { loadRule?: LoadRule; targetReps?: number; restSeconds?: number }[] }
export interface RestPauseConfig { method: 'rest_pause'; pauses: { restSeconds: number; targetReps?: number }[] }
export interface AmrapConfig { method: 'amrap'; timeLimitSeconds?: number; targetRir?: number; maxReps?: number }
export type MethodConfig = { method: 'normal' } | DropSetConfig | RestPauseConfig | AmrapConfig;

export interface SetPrescription {
  /** Opt-in for Stage 3; old records are never reinterpreted on read. */
  completionRule?: 'ALL_PRESCRIBED_SEGMENTS';
  schemaVersion: 1;
  role: SetRole;
  method: SetMethod;
  weightKg?: number;
  reps?: number;
  /** Keep original range text; do not infer an exact result from a range. */
  repsRange?: string;
  rir?: number | null;
  rpe?: number | null;
  restSeconds?: number;
  instruction?: string;
  methodConfig?: MethodConfig;
  loadRule?: LoadRule;
}

export interface SetPerformanceSegment {
  /** Explicit confirmation of actual execution. Absent only in Stage 1/2 records. */
  completed?: boolean;
  id: string;
  order: number;
  kind: 'PRIMARY' | 'DROP' | 'REST_PAUSE';
  weightKg?: number;
  reps?: number;
  rir?: number | null;
  rpe?: number | null;
  restBeforeSeconds?: number;
}

export interface SetPerformance {
  /** Manual abandonment; completed remains false. No failure inference. */
  interrupted?: boolean;
  schemaVersion: 1;
  /** Draft values remain drafts until completed. */
  completed: boolean;
  weightKg?: number;
  reps?: number;
  rir?: number | null;
  rpe?: number | null;
  segments?: SetPerformanceSegment[];
}

export interface WorkoutBlock {
  schemaVersion: 1;
  id: string;
  name?: string;
  type: 'STANDARD' | 'SUPERSET';
  order: number;
  /** Ordered session exercise-instance IDs, not catalog IDs. */
  exerciseIds: string[];
  restBetweenExercisesSeconds?: number;
  restAfterBlockSeconds?: number;
  legacyVisualType?: 'superset' | 'biset';
}

export interface VisualWorkoutBlock {
  id: string;
  name: string;
  type: 'superset' | 'biset';
  exerciseIds: string[];
  transitionRestSeconds: number;
  blockRestSeconds: number;
}
