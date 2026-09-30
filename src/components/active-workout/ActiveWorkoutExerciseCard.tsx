import {
  setExecutionState,
  executionLabels,
  setMetrics,
  requiredSegmentKinds,
  orderedSegments,
  segmentWasPerformed
} from '../../features/workout-engine/setMetrics';
import {
  prescribeCompoundStages,
  segmentDrafts,
  recordCompoundPerformance
} from '../../features/workout-engine/compoundSets';
import { updatePerformance, updatePrescription, normalizeSet } from '../../features/workout-engine/setAdapter';
import type {
  DropSetConfig,
  RestPauseConfig,
  SetPerformanceSegment
} from '../../features/workout-engine/contracts';
import React, { useState } from 'react';
import {
  Timer,
  MoreVertical,
  Check,
  Plus
} from 'lucide-react';
import { Exercise, ExerciseSet, SetRole, SetMethod } from '../../types';
import { ExerciseMedia } from '../exercise/ExerciseMedia';
import { ExerciseOptionsSheet } from './ExerciseOptionsSheet';
import { ProfessionalInstructionsSheet } from './ProfessionalInstructionsSheet';
import { MethodSummary, getMethodSummary } from './MethodSummary';

interface ActiveWorkoutExerciseCardProps {
  exercise: Exercise;
  exIndex: number;
  totalExercises: number;
  blockTag?: string; // e.g. "A1", "A2"
  blockName?: string;
  onOpenFeedback: (exercise: Exercise) => void;
  onStartRest: (seconds?: number) => void;
  onRemoveExercise: (exIndex: number) => void;
  onEditSetType: (exIndex: number, setIndex: number) => void;
  onUpdateSetField: (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => void;
  onToggleSetComplete: (exIndex: number, setIndex: number) => void;
  onEditCompound?: (exIndex: number, setIndex: number) => void;
  onUpdateCompoundSet?: (exIndex: number, setIndex: number, updatedSet: ExerciseSet) => void;
  onAddSet: (exIndex: number) => void;
  onOpenDetail?: (exercise: Exercise) => void;
  onUpdateNotes?: (exIndex: number, notes: string) => void;
  onConfigureRest?: (exercise: Exercise) => void;
  onAddToBlock?: () => void;
  onRemoveFromBlock?: () => void;
}

/**
 * Ensures a set has valid compound prescription (methodConfig and completionRule)
 * so that recordCompoundPerformance and segmentDrafts operate correctly.
 */
export function ensureCompoundPrescription(set: ExerciseSet): ExerciseSet {
  const effectiveMethod =
    set.prescription?.method ??
    set.method ??
    (set.type === 'dropset' ? 'dropset' : set.type === 'rest_pause' ? 'rest_pause' : 'normal');

  let norm = normalizeSet(set);
  if ((effectiveMethod === 'dropset' || effectiveMethod === 'rest_pause') && norm.prescription.method !== effectiveMethod) {
    norm = updatePrescription(norm, { method: effectiveMethod });
  }

  if (norm.prescription?.methodConfig && requiredSegmentKinds(norm.prescription)) {
    return norm;
  }

  const isRP = norm.prescription.method === 'rest_pause';
  const pause = isRP
    ? (norm.prescription?.restSeconds ?? norm.restTimeSeconds ?? 15)
    : undefined;
  return prescribeCompoundStages(norm, 2, pause);
}

/**
 * Resolves child segments for a compound set (Drop Set / Rest-Pause),
 * using existing recorded performance segments or initializing drafts.
 */
function resolveCompoundSegments(set: ExerciseSet): SetPerformanceSegment[] {
  const prepared = ensureCompoundPrescription(set);
  let segments: SetPerformanceSegment[] = [];
  if (prepared.performance?.segments && prepared.performance.segments.length > 0) {
    segments = [...prepared.performance.segments].sort((a, b) => a.order - b.order);
  } else {
    try {
      segments = segmentDrafts(prepared);
    } catch {
      return [];
    }
  }

  const kinds = prepared.prescription ? requiredSegmentKinds(prepared.prescription) : undefined;
  if (kinds && segments.length < kinds.length) {
    try {
      const drafts = segmentDrafts(prepared);
      segments = drafts.map((draft, idx) => {
        const existing = segments.find((s) => s.order === idx);
        return existing || draft;
      });
    } catch {
      // fallback
    }
  }

  // Populate suggestedLoad from prescription if available and not yet explicitly set on segment
  const method = prepared.prescription?.method ?? prepared.method ?? (prepared.type === 'dropset' ? 'dropset' : 'rest_pause');
  const methodConfig = prepared.prescription?.methodConfig;

  return segments.map((seg, idx) => {
    if (idx === 0) return seg;
    const childIdx = idx - 1;
    let suggested: number | undefined = (seg as any).suggestedLoad;
    if (suggested === undefined && methodConfig) {
      if (method === 'dropset' && methodConfig.method === 'dropset') {
        const drop = methodConfig.drops?.[childIdx];
        suggested = (drop as any)?.suggestedLoad ?? (drop?.loadRule?.mode === 'ABSOLUTE' ? drop.loadRule.weightKg : undefined);
      } else if (method === 'rest_pause' && methodConfig.method === 'rest_pause') {
        const pause = methodConfig.pauses?.[childIdx];
        suggested = (pause as any)?.suggestedLoad ?? (pause as any)?.loadRule?.weightKg;
      }
    }
    if (suggested !== undefined && (seg as any).suggestedLoad === undefined) {
      return { ...seg, suggestedLoad: suggested } as SetPerformanceSegment;
    }
    return seg;
  });
}

export const ActiveWorkoutExerciseCard: React.FC<ActiveWorkoutExerciseCardProps> = ({
  exercise,
  exIndex,
  totalExercises,
  blockTag,
  blockName,
  onOpenFeedback,
  onStartRest,
  onRemoveExercise,
  onEditSetType,
  onUpdateSetField,
  onToggleSetComplete,
  onEditCompound,
  onUpdateCompoundSet,
  onAddSet,
  onOpenDetail,
  onUpdateNotes,
  onConfigureRest,
  onAddToBlock,
  onRemoveFromBlock
}) => {
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [showInstructionsSheet, setShowInstructionsSheet] = useState(false);
  const [activeMenuSetIndex, setActiveMenuSetIndex] = useState<number | null>(null);

  // Rest duration format (e.g. 120s -> "2min", 90s -> "1min 30s", 45s -> "45s")
  const exerciseRest = exercise.restSeconds ?? (exercise as any).restTimeSeconds ?? 120;
  const formatRestDisplay = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    if (mins > 0 && remainderSecs > 0) {
      return `${mins}min ${remainderSecs}s`;
    }
    if (mins > 0) {
      return `${mins}min`;
    }
    return `${remainderSecs}s`;
  };

  return (
    <div className="pb-7 mb-7 border-b border-[#1c2025] last:border-b-0 last:mb-2 last:pb-2">
      {/* 1. Exercise Top Row: [Circular Thumbnail] [Name + Subtitle] [•••] */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Circular Thumbnail (48–56px) */}
          <button
            type="button"
            onClick={() => onOpenDetail && onOpenDetail(exercise)}
            title="Ver execução biomecânica e histórico"
            aria-label={`Ver execução de ${exercise.name}`}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#262a30] bg-[#181c21] flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform group shadow-sm p-0.5"
          >
            <ExerciseMedia
              exercise={exercise}
              size="sm"
              forceStaticThumbnail={true}
              className="w-full h-full object-cover rounded-full"
            />
          </button>

          {/* Exercise Title & Subtitle */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {blockTag && (
                <span className="px-2 py-0.5 rounded-lg bg-[#0066ff]/20 text-[#38bdf8] border border-[#0066ff]/40 text-xs font-mono font-black tracking-wider shrink-0">
                  {blockTag}
                </span>
              )}
              <h3
                onClick={() => onOpenDetail && onOpenDetail(exercise)}
                className="text-base sm:text-lg font-bold text-[#0066ff] hover:text-[#38bdf8] transition-colors cursor-pointer truncate leading-tight"
                title={exercise.name}
              >
                {exercise.name}
              </h3>
            </div>

            <span className="text-xs text-[#8c90a1] truncate mt-0.5">
              {exercise.muscleGroup}
              {exercise.equipment && (
                <>
                  {' • '}
                  <span className="text-[#a5b4fc]">{exercise.equipment}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Options Button [•••] */}
        <button
          type="button"
          onClick={() => setShowOptionsSheet(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#8c90a1] hover:text-white hover:bg-[#181c21] transition-colors cursor-pointer shrink-0"
          title="Opções do exercício"
          aria-label="Opções"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Rest line: [Clock icon] Descanso: 2min */}
      <div className="mt-2.5 pl-0.5 flex items-center">
        <button
          type="button"
          onClick={() => {
            if (onConfigureRest) {
              onConfigureRest(exercise);
            } else {
              onStartRest(exerciseRest);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066ff] hover:text-[#38bdf8] transition-colors cursor-pointer"
          title="Toque para configurar ou iniciar descanso"
        >
          <Timer className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Descanso: {formatRestDisplay(exerciseRest)}</span>
        </button>
      </div>

      {/* 3. Sets Table */}
      <div className="mt-3.5 space-y-1.5">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] sm:text-[11px] font-bold text-[#8c90a1] uppercase px-1 pb-1">
          <span className="col-span-2 text-center">SÉRIE</span>
          <span className="col-span-3 text-center truncate">ANTERIOR</span>
          <span className="col-span-3 text-center">KG</span>
          <span className="col-span-2 text-center">REPS</span>
          <span className="col-span-2 text-center">CHECK</span>
        </div>

        {/* Set Rows */}
        {exercise.sets.map((set, setIndex) => {
          // 1. Resolve role and method with backwards compatibility
          const effectiveRole: SetRole = set.role || (set.type === 'warmup' ? 'warmup' : 'working');
          const effectiveMethod: SetMethod =
            set.method ||
            (set.type === 'dropset'
              ? 'dropset'
              : set.type === 'rest_pause'
              ? 'rest_pause'
              : set.type === 'amrap'
              ? 'amrap'
              : 'normal');

          const isCompound = effectiveMethod === 'dropset' || effectiveMethod === 'rest_pause';
          const preparedSet = isCompound ? ensureCompoundPrescription(set) : set;
          const compoundStages = isCompound ? resolveCompoundSegments(preparedSet) : [];
          const primaryStage = compoundStages[0];
          const isPrimaryDone = isCompound
            ? Boolean(primaryStage && segmentWasPerformed(primaryStage, set.performance || { schemaVersion: 1, completed: false }))
            : set.completed;
          const performedCount = isCompound
            ? compoundStages.filter((s) => segmentWasPerformed(s, set.performance || { schemaVersion: 1, completed: false })).length
            : (set.completed ? 1 : 0);
          const activeStageIndex = compoundStages.findIndex(
            (s) => !segmentWasPerformed(s, set.performance || { schemaVersion: 1, completed: false })
          );

          const methodSummary = isCompound ? getMethodSummary(set) : null;
          const prescribedPauseSecs =
            methodSummary?.pauseSeconds ??
            (effectiveMethod === 'dropset'
              ? ((set.prescription?.methodConfig as DropSetConfig | undefined)?.drops?.[0]?.restSeconds ??
                 (set.prescription?.restSeconds ? Math.min(set.prescription.restSeconds, 30) : 10))
              : ((set.prescription?.methodConfig as RestPauseConfig | undefined)?.pauses?.[0]?.restSeconds ??
                 set.prescription?.restSeconds ?? 15));

          // 2. Count ordinals per role up to this set
          let countForRole = 0;
          for (let i = 0; i <= setIndex; i++) {
            const s = exercise.sets[i];
            const r: SetRole = s.role || (s.type === 'warmup' ? 'warmup' : 'working');
            if (r === effectiveRole) {
              countForRole++;
            }
          }

          let setSymbol = `${countForRole}`;
          let symbolStyle = 'text-white bg-[#181c21] border-[#262a30] hover:border-[#0066ff]';

          if (effectiveRole === 'warmup') {
            setSymbol = `A${countForRole}`;
            symbolStyle = 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/40 hover:border-[#fbbf24]';
          } else if (effectiveRole === 'top_set') {
            setSymbol = `T${countForRole}`;
            symbolStyle = 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/40 hover:border-[#38bdf8]';
          } else if (effectiveRole === 'backoff') {
            setSymbol = `B${countForRole}`;
            symbolStyle = 'text-[#c084fc] bg-[#c084fc]/10 border-[#c084fc]/40 hover:border-[#c084fc]';
          } else {
            // working
            setSymbol = `${countForRole}`;
            if (effectiveMethod === 'dropset') {
              symbolStyle = 'text-[#0066ff] bg-[#0066ff]/10 border-[#0066ff]/40 hover:border-[#0066ff]';
            } else if (effectiveMethod === 'rest_pause') {
              symbolStyle = 'text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/40 hover:border-[#4edea3]';
            } else if (effectiveMethod === 'amrap') {
              symbolStyle = 'text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/40 hover:border-[#f43f5e]';
            }
          }

          // 3. Discreet summary tokens
          const summaryTokens: string[] = [];
          if (effectiveMethod === 'dropset') summaryTokens.push('DROP SET');
          else if (effectiveMethod === 'rest_pause') summaryTokens.push('REST-PAUSE');
          else if (effectiveMethod === 'amrap') summaryTokens.push('AMRAP');

          if (effectiveRole === 'top_set') summaryTokens.push('TOP SET');
          else if (effectiveRole === 'backoff') summaryTokens.push('BACK-OFF');

          if (set.targetRepsRange && set.targetRepsRange.trim()) {
            summaryTokens.push(set.targetRepsRange);
          }

          if (set.rir !== undefined && set.rir !== null) {
            summaryTokens.push(`RIR ${set.rir}`);
          } else if (set.rpe !== undefined && set.rpe !== null) {
            summaryTokens.push(`RPE ${set.rpe}`);
          }

          if (set.restTimeSeconds && set.restTimeSeconds > 0 && set.restTimeSeconds !== exerciseRest) {
            summaryTokens.push(`${set.restTimeSeconds}s`);
          }

          // Active stage indexing (0: primary, 1: D1/RP1, 2: D2/RP2, ...)
          const isPrimaryActive = isCompound && !set.completed && activeStageIndex === 0;

          // Compound primary handlers
          const handlePrimaryFieldChange = (field: 'weight' | 'reps', val: number) => {
            if (!isCompound) {
              onUpdateSetField(exIndex, setIndex, field, val);
              return;
            }
            const targetSet = ensureCompoundPrescription(set);
            const stages = resolveCompoundSegments(targetSet);
            const nextStages = stages.map((s, idx) =>
              idx === 0
                ? { ...s, [field === 'weight' ? 'weightKg' : 'reps']: val }
                : s
            );
            const nextSet = updatePerformance(targetSet, {
              ...targetSet.performance,
              [field === 'weight' ? 'weightKg' : 'reps']: val,
              segments: nextStages
            });
            if (onUpdateCompoundSet) {
              onUpdateCompoundSet(exIndex, setIndex, nextSet);
            } else {
              onUpdateSetField(exIndex, setIndex, field, val);
            }
          };

          const handlePrimaryCheck = () => {
            if (!isCompound) {
              onToggleSetComplete(exIndex, setIndex);
              return;
            }

            const targetSet = ensureCompoundPrescription(set);
            const stages = resolveCompoundSegments(targetSet);
            if (isPrimaryDone) {
              // Uncheck primary stage and all subsequent stages
              const nextStages = stages.map((s) => ({ ...s, completed: false }));
              const nextSet = recordCompoundPerformance(targetSet, nextStages, 'SAVE');
              if (onUpdateCompoundSet) {
                onUpdateCompoundSet(exIndex, setIndex, nextSet);
              }
            } else {
              // Confirm primary stage (1 of N stages done)
              const primaryReps = set.reps > 0 ? set.reps : (set.targetReps || 10);
              const primaryWeight = set.weight;
              const nextStages = stages.map((s, idx) =>
                idx === 0
                  ? { ...s, completed: true, weightKg: primaryWeight, reps: primaryReps }
                  : { ...s, completed: false }
              );
              const nextSet = recordCompoundPerformance(targetSet, nextStages, 'SAVE');
              if (onUpdateCompoundSet) {
                onUpdateCompoundSet(exIndex, setIndex, nextSet);
              }
            }
          };

          // Child segment handlers
          const handleChildFieldChange = (
            stageIndex: number,
            field: 'weightKg' | 'reps',
            val?: number
          ) => {
            const targetSet = ensureCompoundPrescription(set);
            const stages = resolveCompoundSegments(targetSet);
            const nextStages = stages.map((s, idx) =>
              idx === stageIndex ? { ...s, [field]: val } : s
            );
            const isAllDone = targetSet.completed && nextStages.every((s) => s.completed);
            const finish = targetSet.performance?.interrupted ? 'INTERRUPT' : isAllDone ? 'COMPLETE' : 'SAVE';
            try {
              const nextSet = recordCompoundPerformance(targetSet, nextStages, finish);
              if (onUpdateCompoundSet) {
                onUpdateCompoundSet(exIndex, setIndex, nextSet);
              }
            } catch {
              const nextSet = updatePerformance(targetSet, {
                completed: targetSet.completed,
                segments: nextStages
              });
              if (onUpdateCompoundSet) {
                onUpdateCompoundSet(exIndex, setIndex, nextSet);
              }
            }
          };

          const handleToggleChildSegment = (stageIndex: number) => {
            const targetSet = ensureCompoundPrescription(set);
            const stages = resolveCompoundSegments(targetSet);
            const targetStage = stages[stageIndex];
            if (!targetStage) return;

            if (targetStage.completed) {
              // Unchecking this stage and any subsequent stages
              const nextStages = stages.map((s, idx) =>
                idx >= stageIndex ? { ...s, completed: false } : s
              );
              const nextSet = recordCompoundPerformance(targetSet, nextStages, 'SAVE');
              if (onUpdateCompoundSet) {
                onUpdateCompoundSet(exIndex, setIndex, nextSet);
              }
            } else {
              // Confirming this stage (and any prior unconfirmed stages)
              const nextStages = stages.map((s, idx) => {
                if (idx < stageIndex) {
                  return {
                    ...s,
                    completed: true,
                    reps: s.reps ?? (idx === 0 ? (set.reps || 10) : 10),
                    weightKg: s.weightKg ?? (idx === 0 ? set.weight : ((s as any).suggestedLoad ?? set.weight))
                  };
                }
                if (idx === stageIndex) {
                  const stageReps = s.reps !== undefined && s.reps !== null && s.reps > 0 ? s.reps : (set.reps || 10);
                  const suggested = (s as any).suggestedLoad as number | undefined;
                  const stageWeight = s.weightKg !== undefined && s.weightKg !== null && s.weightKg > 0
                    ? s.weightKg
                    : (suggested !== undefined ? suggested : set.weight);
                  return {
                    ...s,
                    completed: true,
                    reps: stageReps,
                    weightKg: stageWeight
                  };
                }
                return s;
              });

              const isAllDone = nextStages.every((s) => s.completed);
              const finish = isAllDone ? 'COMPLETE' : 'SAVE';
              const nextSet = recordCompoundPerformance(targetSet, nextStages, finish);
              if (onUpdateCompoundSet) {
                onUpdateCompoundSet(exIndex, setIndex, nextSet);
              }
            }
          };

          const handleFinalizeCompoundSet = () => {
            const targetSet = ensureCompoundPrescription(set);
            const stages = resolveCompoundSegments(targetSet);
            const nextSet = recordCompoundPerformance(targetSet, stages, 'COMPLETE');
            if (onUpdateCompoundSet) {
              onUpdateCompoundSet(exIndex, setIndex, nextSet);
            }
          };

          return (
            <div
              key={set.id || `set-${setIndex}`}
              className={`rounded-2xl p-1 transition-colors ${
                set.completed ? 'bg-[#4edea3]/5' : ''
              }`}
            >
              {/* Compact Method Header */}
              {isCompound && (
                <div className="px-2 pt-1.5 pb-1 flex items-center justify-between border-b border-[#262a30]/40 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-white tracking-wide shrink-0">
                      {setSymbol} {effectiveMethod === 'dropset' ? 'DROP SET' : 'REST-PAUSE'}
                    </span>
                    <span className="text-[11px] font-mono text-[#8c90a1] truncate">
                      {methodSummary?.details ??
                        (effectiveMethod === 'dropset'
                          ? `2 quedas · -20% · ${prescribedPauseSecs}s`
                          : `2 mini-sets · ${prescribedPauseSecs}s`)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {set.performance?.interrupted ? (
                      <span className="text-[10px] font-mono font-bold text-[#ff8f8f] bg-[#ff8f8f]/10 px-1.5 py-0.5 rounded border border-[#ff8f8f]/30">
                        Interrompida
                      </span>
                    ) : set.completed ? (
                      <span className="text-[10px] font-mono font-bold text-[#4edea3] bg-[#4edea3]/10 px-1.5 py-0.5 rounded border border-[#4edea3]/30">
                        ✓ {performedCount}/{compoundStages.length}
                      </span>
                    ) : performedCount > 0 ? (
                      <span className="text-[10px] font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-1.5 py-0.5 rounded border border-[#38bdf8]/30">
                        {performedCount}/{compoundStages.length}
                      </span>
                    ) : null}

                    {/* Secondary 3-dots menu for Interromper / Retomar / Configurar */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuSetIndex(activeMenuSetIndex === setIndex ? null : setIndex)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded text-[#64748b] hover:text-white hover:bg-[#181c21] transition-colors cursor-pointer"
                        title="Opções do método"
                        aria-label="Opções do método"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {activeMenuSetIndex === setIndex && (
                        <div className="absolute right-0 top-full mt-1 z-30 w-44 bg-[#14181f] border border-[#262a30] rounded-xl shadow-2xl py-1 text-xs font-mono">
                          {set.performance?.interrupted ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuSetIndex(null);
                                const targetSet = ensureCompoundPrescription(set);
                                const nextSet = recordCompoundPerformance(targetSet, compoundStages, 'SAVE');
                                if (onUpdateCompoundSet) {
                                  onUpdateCompoundSet(exIndex, setIndex, nextSet);
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-[#38bdf8] hover:bg-[#1e232d] flex items-center gap-2 cursor-pointer"
                            >
                              <span>Retomar método</span>
                            </button>
                          ) : !set.completed && compoundStages.some((s) => s.completed) ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuSetIndex(null);
                                const targetSet = ensureCompoundPrescription(set);
                                const nextSet = recordCompoundPerformance(targetSet, compoundStages, 'INTERRUPT');
                                if (onUpdateCompoundSet) {
                                  onUpdateCompoundSet(exIndex, setIndex, nextSet);
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-[#ff8f8f] hover:bg-[#1e232d] flex items-center gap-2 cursor-pointer"
                            >
                              <span>Interromper método</span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuSetIndex(null);
                              onEditSetType(exIndex, setIndex);
                            }}
                            className="w-full text-left px-3 py-2 text-[#e2e8f0] hover:bg-[#1e232d] flex items-center gap-2 cursor-pointer"
                          >
                            <span>Configurar série</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PRIMARY SET ROW */}
              <div
                className={`grid grid-cols-12 gap-2 items-center p-1 rounded-xl transition-all ${
                  isPrimaryActive ? 'ring-1 ring-[#0066ff]/40 bg-[#0066ff]/[0.03]' : ''
                }`}
              >
                {/* SÉRIE: Clickable set badge */}
                <div className="col-span-2 flex items-center justify-center">
                  <button
                    type="button"
                    disabled={Boolean(set.performance?.segments?.some((s) => s.completed))}
                    onClick={() => onEditSetType(exIndex, setIndex)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all cursor-pointer active:scale-95 ${symbolStyle}`}
                    title="Configurar série (Função, Método, Meta)"
                    aria-label={`Série ${setSymbol}`}
                  >
                    <span className="tabular-nums font-mono">{setSymbol}</span>
                  </button>
                </div>

                {/* ANTERIOR: Previous performance */}
                <div className="col-span-3 flex flex-col items-center justify-center text-center">
                  {set.prevWeight || set.targetWeight ? (
                    <span className="text-xs sm:text-sm text-[#8c90a1] tabular-nums font-medium truncate">
                      {set.prevWeight || set.targetWeight}kg × {set.prevReps || set.targetReps}
                    </span>
                  ) : (
                    <span className="text-xs text-[#4b5563]">-</span>
                  )}
                </div>

                {/* KG: Weight Input */}
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight === 0 ? '' : set.weight}
                    placeholder="0"
                    onChange={(e) =>
                      handlePrimaryFieldChange('weight', parseFloat(e.target.value) || 0)
                    }
                    className="w-full h-10 sm:h-11 bg-[#181c21] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-center text-sm sm:text-base font-bold text-white tabular-nums outline-none transition-colors"
                  />
                </div>

                {/* REPS: Reps Input */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    value={set.reps === 0 ? '' : set.reps}
                    placeholder="0"
                    onChange={(e) =>
                      handlePrimaryFieldChange('reps', parseInt(e.target.value, 10) || 0)
                    }
                    className="w-full h-10 sm:h-11 bg-[#181c21] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-center text-sm sm:text-base font-bold text-white tabular-nums outline-none transition-colors"
                  />
                </div>

                {/* CHECK: Complete Set Button */}
                <div className="col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handlePrimaryCheck}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isPrimaryDone
                        ? 'bg-[#4edea3] text-[#101419] shadow-sm shadow-[#4edea3]/30'
                        : isPrimaryActive
                        ? 'bg-[#181c21] border border-[#0066ff] text-[#38bdf8] hover:border-[#4edea3]/50'
                        : 'bg-[#181c21] border border-[#262a30] text-[#64748b] hover:border-[#4edea3]/50 hover:text-white'
                    }`}
                    title={isPrimaryDone ? 'Desmarcar etapa principal' : 'Concluir etapa principal'}
                    aria-label={isPrimaryDone ? 'Etapa principal concluída' : 'Concluir etapa principal'}
                  >
                    {isPrimaryDone ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : isCompound ? (
                      <span
                        className={`w-3.5 h-3.5 rounded-full border-2 ${
                          isPrimaryActive ? 'border-[#38bdf8]' : 'border-[#4b5563]'
                        }`}
                      />
                    ) : (
                      <Check className="w-5 h-5 stroke-[2]" />
                    )}
                  </button>
                </div>
              </div>

              {/* INLINE COMPOUND STAGES (D1, D2 / RP1, RP2) */}
              {isCompound && compoundStages.length > 1 && (
                <div className="pt-0.5 pb-1 space-y-1">
                  {compoundStages.slice(1).map((segment, childIdx) => {
                    const stageNumber = childIdx + 1;
                    const badgeLabel = effectiveMethod === 'dropset' ? `D${stageNumber}` : `RP${stageNumber}`;
                    const isStageCompleted = Boolean(segment.completed);
                    const isStageActive = !set.completed && activeStageIndex === stageNumber;

                    const suggestedLoad = (segment as any).suggestedLoad as number | undefined;
                    const displayedKg =
                      segment.weightKg !== undefined && segment.weightKg !== null && segment.weightKg > 0
                        ? segment.weightKg
                        : suggestedLoad !== undefined && suggestedLoad > 0
                        ? suggestedLoad
                        : '';
                    const displayedReps =
                      segment.reps !== undefined && segment.reps !== null && segment.reps > 0
                        ? segment.reps
                        : '';

                    return (
                      <React.Fragment key={segment.id || `seg-${stageNumber}`}>
                        {/* Inline Pause between drops/mini-sets */}
                        <div className="grid grid-cols-12 gap-2 items-center py-0.5">
                          <div className="col-span-2" />
                          <div className="col-span-10 flex items-center gap-1.5 text-[10px] font-mono text-[#8c90a1] pl-1">
                            <Timer className="w-3 h-3 text-[#38bdf8]" />
                            <span>⏱ {prescribedPauseSecs}s</span>
                          </div>
                        </div>

                        {/* Child Drop / Mini-set Row */}
                        <div
                          className={`grid grid-cols-12 gap-2 items-center p-1 rounded-xl transition-all ${
                            isStageCompleted
                              ? 'bg-[#4edea3]/5'
                              : isStageActive
                              ? 'ring-1 ring-[#0066ff]/40 bg-[#0066ff]/[0.03]'
                              : ''
                          }`}
                        >
                          {/* SÉRIE: Small subordinate badge */}
                          <div className="col-span-2 flex items-center justify-center">
                            <span
                              className={`w-8 h-8 rounded-lg border text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                                isStageCompleted
                                  ? 'bg-[#4edea3]/10 border-[#4edea3]/40 text-[#4edea3]'
                                  : isStageActive
                                  ? 'bg-[#0066ff]/10 border-[#0066ff]/50 text-[#38bdf8]'
                                  : 'bg-[#181c21] border-[#262a30] text-[#8c90a1]'
                              }`}
                            >
                              {badgeLabel}
                            </span>
                          </div>

                          {/* ANTERIOR: Dashed reference */}
                          <div className="col-span-3 flex items-center justify-center text-center">
                            <span className="text-xs text-[#4b5563] font-mono tabular-nums font-medium">—</span>
                          </div>

                          {/* KG: Weight Input */}
                          <div className="col-span-3">
                            <input
                              type="number"
                              step="0.5"
                              value={displayedKg}
                              placeholder={suggestedLoad !== undefined && suggestedLoad > 0 ? String(suggestedLoad) : '—'}
                              onChange={(e) => {
                                const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                handleChildFieldChange(stageNumber, 'weightKg', val);
                              }}
                              className="w-full h-10 sm:h-11 bg-[#181c21] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-center text-sm sm:text-base font-bold text-white tabular-nums outline-none transition-colors"
                            />
                          </div>

                          {/* REPS: Reps Input */}
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="0"
                              value={displayedReps}
                              placeholder="—"
                              onChange={(e) => {
                                const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                                handleChildFieldChange(stageNumber, 'reps', val);
                              }}
                              className="w-full h-10 sm:h-11 bg-[#181c21] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-center text-sm sm:text-base font-bold text-white tabular-nums outline-none transition-colors"
                            />
                          </div>

                          {/* CHECK: Complete Child Segment Button */}
                          <div className="col-span-2 flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleToggleChildSegment(stageNumber)}
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                                isStageCompleted
                                  ? 'bg-[#4edea3] text-[#101419] shadow-sm shadow-[#4edea3]/30'
                                  : isStageActive
                                  ? 'bg-[#181c21] border border-[#0066ff] text-[#38bdf8] hover:border-[#4edea3]/50'
                                  : 'bg-[#181c21] border border-[#262a30] text-[#64748b] hover:border-[#4edea3]/50 hover:text-white'
                              }`}
                              title={isStageCompleted ? `Desmarcar ${badgeLabel}` : `Concluir ${badgeLabel}`}
                              aria-label={isStageCompleted ? `${badgeLabel} concluído` : `Concluir ${badgeLabel}`}
                            >
                              {isStageCompleted ? (
                                <Check className="w-5 h-5 stroke-[3]" />
                              ) : (
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border-2 ${
                                    isStageActive ? 'border-[#38bdf8]' : 'border-[#4b5563]'
                                  }`}
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* Explicit Conclude Button when all segments are performed but set is not yet completed */}
                  {performedCount === compoundStages.length && !set.completed && compoundStages.length > 0 && (
                    <div className="pt-2 px-1">
                      <button
                        type="button"
                        onClick={handleFinalizeCompoundSet}
                        className="w-full h-9 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Concluir {effectiveMethod === 'dropset' ? 'Drop Set' : 'Rest-Pause'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Discreet Configuration Summary below row */}
              {!isCompound && summaryTokens.length > 0 && (
                <div className="pt-1 pb-0.5 px-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#8c90a1] truncate">
                  <span className="text-[#38bdf8] font-mono tracking-tight font-medium">
                    {summaryTokens.join(' • ')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Wide Button: + Adicionar série */}
      <button
        type="button"
        onClick={() => onAddSet(exIndex)}
        className="w-full h-11 rounded-xl bg-[#181c21] hover:bg-[#20252c] border border-[#262a30] text-[#c2c6d8] hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3 shadow-xs active:scale-[0.99]"
      >
        <Plus className="w-4 h-4 text-[#8c90a1]" />
        <span>Adicionar série</span>
      </button>

      {/* Exercise Options Sheet */}
      <ExerciseOptionsSheet
        isOpen={showOptionsSheet}
        exercise={exercise}
        totalExercises={totalExercises}
        onClose={() => setShowOptionsSheet(false)}
        onOpenFeedback={() => onOpenFeedback(exercise)}
        onOpenDetail={() => onOpenDetail && onOpenDetail(exercise)}
        onOpenInstructions={() => setShowInstructionsSheet(true)}
        onConfigureRest={() => onConfigureRest && onConfigureRest(exercise)}
        onRemoveExercise={() => onRemoveExercise(exIndex)}
        onAddToBlock={onAddToBlock}
        onRemoveFromBlock={onRemoveFromBlock}
      />

      {/* Professional Instructions Sheet */}
      <ProfessionalInstructionsSheet
        isOpen={showInstructionsSheet}
        exercise={exercise}
        onClose={() => setShowInstructionsSheet(false)}
        onOpenFeedback={() => onOpenFeedback(exercise)}
      />
    </div>
  );
};
