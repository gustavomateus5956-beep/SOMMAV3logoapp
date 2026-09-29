import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Trash2, Dumbbell } from 'lucide-react';
import { Routine, Exercise, WorkoutSessionRecord, CompletedExerciseLog, SetTypeKey, SetRole, SetMethod } from '../types';
import { ExportCardModal, WorkoutExportData } from './ExportCardModal';
import { ExerciseLibraryModal } from './ExerciseLibraryModal';
import { repositories } from '../data';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { SetTypeSheet } from './active-workout/SetTypeSheet';
import { RestSettingsSheet } from './active-workout/RestSettingsSheet';
import { ExerciseFeedbackModal } from './ExerciseFeedbackModal';
import { ExerciseDetailModal } from './exercise/ExerciseDetailModal';
import { calculateWorkoutMuscleScores } from '../features/muscle-map/sommaMuscleMapAdapter';

import { ActiveWorkoutHeader } from './active-workout/ActiveWorkoutHeader';
import { ActiveWorkoutExerciseCard } from './active-workout/ActiveWorkoutExerciseCard';
import { ActiveWorkoutCelebrationModal } from './active-workout/ActiveWorkoutCelebrationModal';
import { IncompleteSetsModal, DiscardWorkoutModal } from './active-workout/ActiveWorkoutConfirmModals';
import { ActiveWorkoutMuscleSheet } from './active-workout/ActiveWorkoutMuscleSheet';
import { ActiveWorkoutRestBottomBar } from './active-workout/ActiveWorkoutRestBottomBar';
import { AddToBlockSheet } from './active-workout/AddToBlockSheet';
import { BlockRestConfigSheet } from './active-workout/BlockRestConfigSheet';
import { WorkoutSupersetBlockContainer } from './active-workout/WorkoutSupersetBlockContainer';

export interface WorkoutBlockLocal {
  id: string;
  name: string;
  type: 'superset' | 'biset';
  exerciseIds: string[];
  transitionRestSeconds: number;
  blockRestSeconds: number;
}

interface ActiveWorkoutModalProps {
  routine: Routine | null;
  onClose: () => void;
  onMinimize?: () => void;
  onFinishWorkout: (summary: {
    name: string;
    durationMinutes: number;
    totalVolume: number;
    setsCompleted: number;
  }) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  routine,
  onClose,
  onMinimize,
  onFinishWorkout
}) => {
  const { user, updateUser } = useUser();
  const {
    activeSession,
    workoutStatus,
    minimizeWorkout,
    updateExercises: syncExercisesToContext,
    setRestSeconds: setContextRestSeconds,
    adjustRestSeconds: contextAdjustRestSeconds,
    skipRest: contextSkipRest,
    setIsRestPaused: setContextIsRestPaused,
    setIsTimerPaused: setContextIsTimerPaused,
    setLastActivePosition,
    completeSetInContext,
    completeWorkoutInContext,
    discardWorkout: contextDiscardWorkout
  } = useWorkout();

  const [seconds, setSeconds] = useState(activeSession?.seconds || 0);
  const [isTimerPaused, setIsTimerPaused] = useState(activeSession?.isTimerPaused || false);
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    if (activeSession && activeSession.exercises && activeSession.exercises.length > 0) {
      return activeSession.exercises;
    }
    return [];
  });
  const [workoutName, setWorkoutName] = useState(
    activeSession?.workoutName || routine?.name || 'Treino Personalizado'
  );
  const [isFinished, setIsFinished] = useState(false);
  const [finalWorkoutSeconds, setFinalWorkoutSeconds] = useState<number | null>(null);
  const [showIncompleteConfirm, setShowIncompleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [editingSetType, setEditingSetType] = useState<{ exIndex: number; setIndex: number } | null>(null);
  const [feedbackExercise, setFeedbackExercise] = useState<Exercise | null>(null);
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);
  const [showRestSettings, setShowRestSettings] = useState(false);
  const [exerciseForRestConfig, setExerciseForRestConfig] = useState<Exercise | null>(null);
  const [showMuscleDistribution, setShowMuscleDistribution] = useState(false);

  // Workout Method Engine: Local Blocks (Bi-set / Superset)
  const [activeBlocks, setActiveBlocks] = useState<WorkoutBlockLocal[]>([]);
  const [exerciseForBlockAdd, setExerciseForBlockAdd] = useState<Exercise | null>(null);
  const [blockForRestConfig, setBlockForRestConfig] = useState<WorkoutBlockLocal | null>(null);

  const displaySeconds = finalWorkoutSeconds !== null ? finalWorkoutSeconds : seconds;

  // Rest timer states
  const [restSeconds, setRestSeconds] = useState<number | null>(activeSession?.restSeconds ?? null);
  const [restTotalSeconds, setRestTotalSeconds] = useState<number | null>(activeSession?.restTotalSeconds ?? null);
  const [isRestPaused, setIsRestPaused] = useState(activeSession?.isRestPaused || false);
  const defaultRestTime = 120; // 2 minutes standard

  // Sync with global timer in WorkoutContext (keeps running when minimized!)
  useEffect(() => {
    if (activeSession && !isFinished && workoutStatus !== 'completed') {
      setSeconds(activeSession.seconds);
      setRestSeconds(activeSession.restSeconds);
      setRestTotalSeconds(activeSession.restTotalSeconds);
      setIsRestPaused(activeSession.isRestPaused);
    }
  }, [
    activeSession?.seconds,
    activeSession?.restSeconds,
    activeSession?.restTotalSeconds,
    activeSession?.isRestPaused,
    isFinished,
    workoutStatus
  ]);

  // Initialize exercises with previous performance references
  useEffect(() => {
    let isMounted = true;
    if (routine && routine.exercises.length > 0) {
      const cloned = JSON.parse(JSON.stringify(routine.exercises)) as Exercise[];
      // Enrich with previous exercise data if available for current user
      if (user?.id) {
        Promise.all(
          cloned.map(async (ex) => {
            try {
              const past = await repositories.workout.getLastExercisePerformance(user.id, ex.name);
              if (past && past.sets.length > 0) {
                ex.sets.forEach((set, idx) => {
                  if (past.sets[idx]) {
                    set.prevWeight = past.sets[idx].weight;
                    set.prevReps = past.sets[idx].reps;
                  }
                });
              }
            } catch (err) {
              console.error(`Erro ao buscar performance anterior para "${ex.name}":`, err);
            }
          })
        ).then(() => {
          if (isMounted) {
            setExercises(cloned);
            setWorkoutName(routine.name);
          }
        });
      } else {
        setExercises(cloned);
        setWorkoutName(routine.name);
      }
    } else if (!activeSession?.exercises?.length && exercises.length === 0) {
      // Empty workout initial state: start empty without pre-filled exercises
      setExercises([]);
      setWorkoutName('Treino Vazio');
    }

    return () => {
      isMounted = false;
    };
  }, [routine, user?.id]);

  // Sync state to WorkoutContext whenever exercises change
  const updateExercisesAndSync = (newExercises: Exercise[]) => {
    setExercises(newExercises);
    syncExercisesToContext(newExercises);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRemoveExercise = (exIndex: number) => {
    const updated = exercises.filter((_, idx) => idx !== exIndex);
    updateExercisesAndSync(updated);
  };

  const handleAddExerciseFromLibrary = (exerciseData: Exercise) => {
    const newEx: Exercise = {
      ...exerciseData,
      id: exerciseData.id || `ex-${Date.now()}`,
      sets: exerciseData.sets && exerciseData.sets.length > 0 ? exerciseData.sets : [
        {
          id: `s-${Date.now()}-1`,
          setNumber: 1,
          type: 'working',
          weight: 0,
          reps: 0,
          completed: false
        }
      ]
    };
    updateExercisesAndSync([...exercises, newEx]);
    setShowExerciseLibrary(false);
  };

  const toggleSetComplete = (exIndex: number, setIndex: number) => {
    const updated = [...exercises];
    const targetEx = { ...updated[exIndex] };
    const sets = [...targetEx.sets];
    const currentStatus = sets[setIndex].completed;
    sets[setIndex] = {
      ...sets[setIndex],
      completed: !currentStatus
    };
    targetEx.sets = sets;
    updated[exIndex] = targetEx;
    setExercises(updated);

    // If completing the set, start rest timer using this exercise's individual rest configuration
    const targetRest = !currentStatus
      ? (targetEx.restSeconds ?? (targetEx as any).restTimeSeconds ?? defaultRestTime)
      : null;
    if (targetRest !== null) {
      setRestSeconds(targetRest);
      setRestTotalSeconds(targetRest);
      setIsRestPaused(false);
      setContextRestSeconds(targetRest, targetRest);
      setContextIsRestPaused(false);
    }

    // Atomic update to WorkoutContext (prevents setState during render and batching issues)
    completeSetInContext(updated, exIndex, setIndex, targetRest);
  };

  const updateSetField = (
    exIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: number
  ) => {
    const updated = [...exercises];
    const targetEx = { ...updated[exIndex] };
    const sets = [...targetEx.sets];
    sets[setIndex] = {
      ...sets[setIndex],
      [field]: value
    };
    targetEx.sets = sets;
    updated[exIndex] = targetEx;
    updateExercisesAndSync(updated);
  };

  const addSetToExercise = (exIndex: number) => {
    const updated = [...exercises];
    const targetEx = { ...updated[exIndex] };
    const prevSet = targetEx.sets[targetEx.sets.length - 1];
    targetEx.sets.push({
      id: `s-${Date.now()}-${targetEx.sets.length + 1}`,
      setNumber: targetEx.sets.length + 1,
      type: 'working',
      prevWeight: prevSet?.weight || 60,
      prevReps: prevSet?.reps || 10,
      weight: prevSet?.weight || 60,
      reps: prevSet?.reps || 10,
      completed: false
    });
    updateExercisesAndSync(updated);
  };

  const handleRemoveSet = (exIndex: number, setIndex: number) => {
    const updated = [...exercises];
    if (updated[exIndex]?.sets?.length > 1) {
      updated[exIndex].sets = updated[exIndex].sets
        .filter((_, idx) => idx !== setIndex)
        .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      updateExercisesAndSync(updated);
    }
  };

  const handleUpdateNotes = (exIndex: number, notes: string) => {
    const updated = [...exercises];
    if (updated[exIndex]) {
      updated[exIndex] = {
        ...updated[exIndex],
        professionalNote: notes
      };
      updateExercisesAndSync(updated);
    }
  };

  // Metrics calculation
  let totalVolume = 0;
  let totalCompletedSets = 0;
  let totalSetsCount = 0;
  let detectedPrs = 0;

  exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      totalSetsCount++;
      if (set.completed) {
        totalVolume += (set.weight || 0) * (set.reps || 0);
        totalCompletedSets++;
        if (set.prevWeight && set.weight > set.prevWeight && set.reps >= (set.prevReps || 0)) {
          detectedPrs++;
        }
      }
    });
  });

  const progressPercentage =
    totalSetsCount > 0 ? Math.round((totalCompletedSets / totalSetsCount) * 100) : 0;

  // Muscle activation scores computed reactively for both MiniMuscleMapButton and Muscle Sheet
  const workoutMuscleScores = useMemo(() => {
    return calculateWorkoutMuscleScores(exercises);
  }, [exercises]);

  const isFinalizingRef = useRef(false);
  const isSavingRef = useRef(false);

  const finalizeSession = () => {
    if (isFinalizingRef.current) return;
    isFinalizingRef.current = true;

    const frozen = activeSession?.finalDurationSeconds ?? activeSession?.seconds ?? seconds;
    setFinalWorkoutSeconds(frozen);
    setIsTimerPaused(true);
    setRestSeconds(null);
    setIsFinished(true);

    // Freeze session and timers definitively in WorkoutContext
    completeWorkoutInContext(frozen);
  };

  const handleFinishAttempt = () => {
    const uncompleted = totalSetsCount - totalCompletedSets;
    if (uncompleted > 0) {
      setShowIncompleteConfirm(true);
    } else {
      finalizeSession();
    }
  };

  const confirmFinishWorkout = () => {
    setShowIncompleteConfirm(false);
    finalizeSession();
  };

  const handleUpdateSetType = (type: SetTypeKey) => {
    if (!editingSetType) return;
    const { exIndex, setIndex } = editingSetType;
    const updated = [...exercises];
    const targetEx = { ...updated[exIndex] };
    const sets = [...targetEx.sets];
    sets[setIndex] = {
      ...sets[setIndex],
      type
    };
    targetEx.sets = sets;
    updated[exIndex] = targetEx;
    updateExercisesAndSync(updated);
  };

  const handleUpdateSetConfig = (config: {
    role: SetRole;
    method: SetMethod;
    targetRepsRange?: string;
    rir?: number | null;
    rpe?: number | null;
    restTimeSeconds?: number;
    type?: SetTypeKey;
  }) => {
    if (!editingSetType) return;
    const { exIndex, setIndex } = editingSetType;
    const updated = [...exercises];
    const targetEx = { ...updated[exIndex] };
    const sets = [...targetEx.sets];
    sets[setIndex] = {
      ...sets[setIndex],
      ...config
    };
    targetEx.sets = sets;
    updated[exIndex] = targetEx;
    updateExercisesAndSync(updated);
  };

  // Workout Method Engine: Block Handlers (Bi-set / Superset)
  const handleCreateBlock = (secondExerciseId: string, blockType: 'superset' | 'biset') => {
    if (!exerciseForBlockAdd) return;
    const newBlockId = `block-${Date.now()}`;
    const blockNumber = activeBlocks.length + 1;
    const newBlock: WorkoutBlockLocal = {
      id: newBlockId,
      name: `SUPERSET ${blockNumber}`,
      type: blockType,
      exerciseIds: [exerciseForBlockAdd.id, secondExerciseId],
      transitionRestSeconds: 0,
      blockRestSeconds: 90
    };

    // Reposition second exercise adjacent to the first in exercises list
    const updated = [...exercises];
    const sourceIdx = updated.findIndex((e) => e.id === exerciseForBlockAdd.id);
    const targetIdx = updated.findIndex((e) => e.id === secondExerciseId);

    if (sourceIdx !== -1 && targetIdx !== -1 && targetIdx !== sourceIdx + 1) {
      const [targetEx] = updated.splice(targetIdx, 1);
      const insertAt = targetIdx < sourceIdx ? sourceIdx : sourceIdx + 1;
      updated.splice(insertAt, 0, targetEx);
      updateExercisesAndSync(updated);
    }

    setActiveBlocks((prev) => [...prev, newBlock]);
    setExerciseForBlockAdd(null);
  };

  const handleRemoveBlock = (blockId: string) => {
    setActiveBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleSwapBlockExercises = (blockId: string) => {
    const targetBlock = activeBlocks.find((b) => b.id === blockId);
    if (!targetBlock || targetBlock.exerciseIds.length < 2) return;

    const [id1, id2] = targetBlock.exerciseIds;

    // Swap in activeBlocks
    setActiveBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, exerciseIds: [id2, id1] } : b
      )
    );

    // Swap in exercises array
    const updated = [...exercises];
    const idx1 = updated.findIndex((e) => e.id === id1);
    const idx2 = updated.findIndex((e) => e.id === id2);
    if (idx1 !== -1 && idx2 !== -1) {
      const temp = updated[idx1];
      updated[idx1] = updated[idx2];
      updated[idx2] = temp;
      updateExercisesAndSync(updated);
    }
  };

  const handleUpdateBlockRest = (
    blockId: string,
    transitionSecs: number,
    blockRestSecs: number
  ) => {
    setActiveBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              transitionRestSeconds: transitionSecs,
              blockRestSeconds: blockRestSecs
            }
          : b
      )
    );
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      minimizeWorkout();
    }
  };

  const handleDiscard = () => {
    setShowDiscardConfirm(false);
    contextDiscardWorkout();
    onClose();
  };

  // Final persistence to user storage & Context
  const handleSaveAndExit = async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    const frozenDuration = finalWorkoutSeconds !== null 
      ? finalWorkoutSeconds 
      : (activeSession?.finalDurationSeconds ?? activeSession?.seconds ?? seconds);
    const durationMinutes = Math.max(1, Math.round(frozenDuration / 60));
    const now = new Date();

    const completedExercises: CompletedExerciseLog[] = exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      professionalNote: ex.professionalNote,
      sets: ex.sets.map((s) => ({
        setNumber: s.setNumber,
        type: s.type || 'working',
        targetWeight: s.targetWeight,
        targetReps: s.targetReps,
        weight: s.weight,
        reps: s.reps,
        completed: s.completed,
        prevWeight: s.prevWeight,
        prevReps: s.prevReps,
        isPr: Boolean(s.prevWeight && s.weight > s.prevWeight && s.reps >= (s.prevReps || 0)),
        instruction: s.instruction
      }))
    }));

    const sessionRecord: WorkoutSessionRecord = {
      id: `workout-session-${Date.now()}`,
      userId: user?.id || 'user_lucas_default',
      routineId: routine?.id,
      routineName: workoutName,
      muscleGroups: exercises.map((e) => e.muscleGroup).slice(0, 2).join(' & '),
      startedAt: new Date(Date.now() - frozenDuration * 1000).toISOString(),
      finishedAt: now.toISOString(),
      dateDisplay: 'Hoje',
      durationMinutes,
      durationFormatted: `${durationMinutes} min`,
      totalVolume,
      totalCompletedSets,
      totalExercises: exercises.length,
      prsCount: detectedPrs,
      exercises: completedExercises,
      notes: routine?.category ? `Categoria: ${routine.category}` : undefined
    };

    if (user?.id) {
      try {
        await repositories.workout.saveWorkoutSession(user.id, sessionRecord);
      } catch (err) {
        console.error('Erro ao salvar sessão de treino no repositório:', err);
      }
      updateUser({
        totalWorkouts: (user.totalWorkouts || 0) + 1,
        totalPrs: (user.totalPrs || 0) + detectedPrs
      });
    }

    contextDiscardWorkout();

    onFinishWorkout({
      name: workoutName,
      durationMinutes,
      totalVolume,
      setsCompleted: totalCompletedSets
    });
    onClose();
  };

  // Prepare payload for social export modal
  const exportWorkoutPayload: WorkoutExportData = {
    title: workoutName,
    duration: formatTimer(displaySeconds),
    volume: `${totalVolume.toLocaleString()} kg`,
    exercisesCount: exercises.length,
    completedSets: totalCompletedSets,
    prsCount: detectedPrs,
    exercisesPreview: exercises.slice(0, 4).map((ex) => ({
      name: ex.name,
      detail: `${ex.sets.filter((s) => s.completed).length}/${ex.sets.length} séries • ${ex.muscleGroup}`
    }))
  };

  // Workout Method Engine: Block Mappings
  const blockedExerciseIds = useMemo(
    () => new Set(activeBlocks.flatMap((b) => b.exerciseIds)),
    [activeBlocks]
  );

  const availableExercisesForBlock = useMemo(() => {
    if (!exerciseForBlockAdd) return [];
    return exercises.filter(
      (e) => e.id !== exerciseForBlockAdd.id && !blockedExerciseIds.has(e.id)
    );
  }, [exercises, exerciseForBlockAdd, blockedExerciseIds]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end md:justify-center items-center">
      <div className="w-full max-w-[500px] h-[100dvh] md:h-[92vh] bg-[#101419] md:border border-[#262a30] md:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Top Sticky Bar: [Voltar] TREINO [Timer] [CONCLUIR] + Sub-Stats Horizontal Row */}
        <ActiveWorkoutHeader
          isTimerPaused={isTimerPaused}
          seconds={seconds}
          onTogglePauseTimer={() => {
            const next = !isTimerPaused;
            setIsTimerPaused(next);
            setContextIsTimerPaused(next);
          }}
          onMinimize={handleMinimize}
          onConclude={handleFinishAttempt}
          totalCompletedSets={totalCompletedSets}
          totalSetsCount={totalSetsCount}
          progressPercentage={progressPercentage}
          restSeconds={restSeconds}
          isRestPaused={isRestPaused}
          onAddRestSeconds={(delta) => {
            if (delta > 0) {
              setRestSeconds((prev) => (prev ? prev + delta : delta));
            } else {
              setRestSeconds((prev) => (prev && prev > 15 ? prev + delta : null));
            }
          }}
          onTogglePauseRest={() => {
            const next = !isRestPaused;
            setIsRestPaused(next);
            setContextIsRestPaused(next);
          }}
          onSkipRest={() => {
            setRestSeconds(null);
            setContextRestSeconds(null);
          }}
          onOpenRestSettings={() => {
            setExerciseForRestConfig(null);
            setShowRestSettings(true);
          }}
          workoutName={workoutName}
          onWorkoutNameChange={setWorkoutName}
          totalVolume={totalVolume}
          formatTimer={formatTimer}
          onOpenMuscleDistribution={() => setShowMuscleDistribution(true)}
          muscleValues={workoutMuscleScores.values}
          onDiscard={() => setShowDiscardConfirm(true)}
        />

        {/* Scrollable Exercises Feed (Clean Hevy-style blocks on dark canvas) */}
        <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-2 no-scrollbar ${restSeconds !== null && restSeconds > 0 ? 'pb-24' : 'pb-6'}`}>
          {exercises.length === 0 ? (
            <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center px-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#181c21] border border-[#262a30] flex items-center justify-center text-[#0066ff] mb-4 shadow-sm">
                <Dumbbell className="w-8 h-8 stroke-[1.75]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                Nenhum exercício adicionado
              </h3>
              <p className="text-xs sm:text-sm text-[#8c90a1] max-w-xs mb-6 leading-relaxed">
                Monte seu treino escolhendo exercícios da biblioteca.
              </p>
              <button
                type="button"
                onClick={() => setShowExerciseLibrary(true)}
                className="h-12 px-6 rounded-2xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Adicionar exercício</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDiscardConfirm(true)}
                className="mt-6 text-xs text-[#8c90a1] hover:text-[#ef4444] transition-colors cursor-pointer py-1.5 px-3 rounded-lg flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Descartar treino</span>
              </button>
            </div>
          ) : (
            <>
              {exercises.map((exercise, exIndex) => {
                // Check if this exercise belongs to a block
                const currentBlock = activeBlocks.find((b) =>
                  b.exerciseIds.includes(exercise.id)
                );

                if (currentBlock) {
                  // If it's the second exercise in the block, skip standalone rendering
                  if (currentBlock.exerciseIds[1] === exercise.id) {
                    return null;
                  }

                  // It's the first exercise (A1) in the block!
                  const exA1 = exercise;
                  const exIndexA1 = exIndex;
                  const exIndexA2 = exercises.findIndex(
                    (e) => e.id === currentBlock.exerciseIds[1]
                  );
                  const exA2 = exIndexA2 !== -1 ? exercises[exIndexA2] : null;

                  return (
                    <WorkoutSupersetBlockContainer
                      key={currentBlock.id}
                      blockId={currentBlock.id}
                      blockName={currentBlock.name}
                      transitionRestSeconds={currentBlock.transitionRestSeconds}
                      blockRestSeconds={currentBlock.blockRestSeconds}
                      onOpenRestConfig={() => setBlockForRestConfig(currentBlock)}
                      onSwapExercises={() => handleSwapBlockExercises(currentBlock.id)}
                      onRemoveBlock={() => handleRemoveBlock(currentBlock.id)}
                      exerciseCardA1={
                        <ActiveWorkoutExerciseCard
                          exercise={exA1}
                          exIndex={exIndexA1}
                          totalExercises={exercises.length}
                          blockTag="A1"
                          blockName={currentBlock.name}
                          onOpenFeedback={setFeedbackExercise}
                          onStartRest={(secs) => {
                            const restDuration = secs || exA1.restSeconds || defaultRestTime;
                            setRestSeconds(restDuration);
                            setRestTotalSeconds(restDuration);
                            setContextRestSeconds(restDuration, restDuration);
                            setIsRestPaused(false);
                            setContextIsRestPaused(false);
                          }}
                          onRemoveExercise={handleRemoveExercise}
                          onEditSetType={(eIdx, sIdx) =>
                            setEditingSetType({ exIndex: eIdx, setIndex: sIdx })
                          }
                          onUpdateSetField={updateSetField}
                          onToggleSetComplete={toggleSetComplete}
                          onAddSet={addSetToExercise}
                          onOpenDetail={setSelectedExerciseForDetail}
                          onUpdateNotes={handleUpdateNotes}
                          onConfigureRest={(ex) => {
                            setExerciseForRestConfig(ex);
                            setShowRestSettings(true);
                          }}
                          onRemoveFromBlock={() => handleRemoveBlock(currentBlock.id)}
                        />
                      }
                      exerciseCardA2={
                        exA2 ? (
                          <ActiveWorkoutExerciseCard
                            exercise={exA2}
                            exIndex={exIndexA2}
                            totalExercises={exercises.length}
                            blockTag="A2"
                            blockName={currentBlock.name}
                            onOpenFeedback={setFeedbackExercise}
                            onStartRest={(secs) => {
                              const restDuration = secs || exA2.restSeconds || defaultRestTime;
                              setRestSeconds(restDuration);
                              setRestTotalSeconds(restDuration);
                              setContextRestSeconds(restDuration, restDuration);
                              setIsRestPaused(false);
                              setContextIsRestPaused(false);
                            }}
                            onRemoveExercise={handleRemoveExercise}
                            onEditSetType={(eIdx, sIdx) =>
                              setEditingSetType({ exIndex: eIdx, setIndex: sIdx })
                            }
                            onUpdateSetField={updateSetField}
                            onToggleSetComplete={toggleSetComplete}
                            onAddSet={addSetToExercise}
                            onOpenDetail={setSelectedExerciseForDetail}
                            onUpdateNotes={handleUpdateNotes}
                            onConfigureRest={(ex) => {
                              setExerciseForRestConfig(ex);
                              setShowRestSettings(true);
                            }}
                            onRemoveFromBlock={() => handleRemoveBlock(currentBlock.id)}
                          />
                        ) : null
                      }
                    />
                  );
                }

                // Normal standalone exercise
                return (
                  <ActiveWorkoutExerciseCard
                    key={exercise.id || `ex-${exIndex}`}
                    exercise={exercise}
                    exIndex={exIndex}
                    totalExercises={exercises.length}
                    onOpenFeedback={setFeedbackExercise}
                    onStartRest={(secs) => {
                      const restDuration = secs || exercise.restSeconds || defaultRestTime;
                      setRestSeconds(restDuration);
                      setRestTotalSeconds(restDuration);
                      setContextRestSeconds(restDuration, restDuration);
                      setIsRestPaused(false);
                      setContextIsRestPaused(false);
                    }}
                    onRemoveExercise={handleRemoveExercise}
                    onEditSetType={(eIdx, sIdx) =>
                      setEditingSetType({ exIndex: eIdx, setIndex: sIdx })
                    }
                    onUpdateSetField={updateSetField}
                    onToggleSetComplete={toggleSetComplete}
                    onAddSet={addSetToExercise}
                    onOpenDetail={setSelectedExerciseForDetail}
                    onUpdateNotes={handleUpdateNotes}
                    onConfigureRest={(ex) => {
                      setExerciseForRestConfig(ex);
                      setShowRestSettings(true);
                    }}
                    onAddToBlock={() => setExerciseForBlockAdd(exercise)}
                  />
                );
              })}

              {/* Add Exercise from SOMMA Library */}
              <div className="pt-2 pb-6 space-y-4">
                <button
                  type="button"
                  onClick={() => setShowExerciseLibrary(true)}
                  className="w-full h-12 rounded-xl bg-[#14181f] hover:bg-[#1c2025] border border-dashed border-[#262a30] hover:border-[#0066ff] text-[#0066ff] hover:text-[#38bdf8] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Exercício</span>
                </button>

                {/* Subtle Discard Workout Action */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowDiscardConfirm(true)}
                    className="text-xs text-[#8c90a1] hover:text-[#ef4444] transition-colors cursor-pointer py-1.5 px-3 rounded-lg flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Descartar treino</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Rest Countdown Bar (Preenchimento progressivo que diminui suavemente) */}
        <ActiveWorkoutRestBottomBar
          remainingSeconds={restSeconds}
          totalSeconds={restTotalSeconds}
          isPaused={isRestPaused}
          onAddSeconds={(delta) => {
            contextAdjustRestSeconds(delta);
            if (restSeconds !== null) {
              const nextRem = Math.max(0, restSeconds + delta);
              if (nextRem === 0) {
                setRestSeconds(null);
                setRestTotalSeconds(null);
                setContextRestSeconds(null);
              } else {
                setRestSeconds(nextRem);
                const nextTot = Math.max(nextRem, (restTotalSeconds ?? restSeconds) + delta);
                setRestTotalSeconds(nextTot);
                setContextRestSeconds(nextRem, nextTot);
              }
            }
          }}
          onTogglePause={() => {
            const next = !isRestPaused;
            setIsRestPaused(next);
            setContextIsRestPaused(next);
          }}
          onSkip={() => {
            contextSkipRest();
            setRestSeconds(null);
            setRestTotalSeconds(null);
            setContextRestSeconds(null);
          }}
        />

        {/* Confirmation Modal for Incomplete Sets */}
        <IncompleteSetsModal
          isOpen={showIncompleteConfirm}
          pendingSetsCount={totalSetsCount - totalCompletedSets}
          onContinueWorkout={() => setShowIncompleteConfirm(false)}
          onConfirmFinish={confirmFinishWorkout}
        />

        {/* Confirmation Modal for Discard / Pause */}
        <DiscardWorkoutModal
          isOpen={showDiscardConfirm}
          onMinimize={() => {
            setShowDiscardConfirm(false);
            handleMinimize();
          }}
          onDiscard={handleDiscard}
          onCancel={() => setShowDiscardConfirm(false)}
        />

        {/* Celebratory Finish Summary Screen */}
        <ActiveWorkoutCelebrationModal
          isOpen={isFinished}
          workoutName={workoutName}
          seconds={displaySeconds}
          totalVolume={totalVolume}
          totalCompletedSets={totalCompletedSets}
          detectedPrs={detectedPrs}
          exercises={exercises}
          formatTimer={formatTimer}
          onOpenExport={() => setShowExportModal(true)}
          onSaveAndExit={handleSaveAndExit}
        />

      </div>

      {/* Social Export Modal */}
      {showExportModal && (
        <ExportCardModal
          workoutData={exportWorkoutPayload}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* In-Workout Exercise Library Modal */}
      {showExerciseLibrary && (
        <ExerciseLibraryModal
          title="Adicionar Exercício ao Treino"
          onClose={() => setShowExerciseLibrary(false)}
          onAddExercise={handleAddExerciseFromLibrary}
        />
      )}

      {/* Set Configuration Sheet (Workout Method Engine - Etapa Visual 1) */}
      {editingSetType && (
        <SetTypeSheet
          isOpen={Boolean(editingSetType)}
          setNumber={editingSetType.setIndex + 1}
          currentSet={exercises[editingSetType.exIndex]?.sets[editingSetType.setIndex]}
          currentType={exercises[editingSetType.exIndex]?.sets[editingSetType.setIndex]?.type || 'working'}
          exerciseName={exercises[editingSetType.exIndex]?.name}
          exerciseRestSeconds={exercises[editingSetType.exIndex]?.restSeconds || defaultRestTime}
          onClose={() => setEditingSetType(null)}
          onSaveConfig={handleUpdateSetConfig}
          onSelectType={handleUpdateSetType}
          onRemoveSet={() => handleRemoveSet(editingSetType.exIndex, editingSetType.setIndex)}
        />
      )}

      {/* Rest Settings Bottom Sheet */}
      <RestSettingsSheet
        isOpen={showRestSettings}
        exerciseName={exerciseForRestConfig?.name}
        currentRestSeconds={
          exerciseForRestConfig?.restSeconds ??
          (exerciseForRestConfig as any)?.restTimeSeconds ??
          defaultRestTime
        }
        onClose={() => {
          setShowRestSettings(false);
          setExerciseForRestConfig(null);
        }}
        onSetRest={(selectedSecs, autoStart) => {
          if (exerciseForRestConfig) {
            const updated = [...exercises];
            const foundIdx = updated.findIndex((e) => e.id === exerciseForRestConfig.id);
            if (foundIdx >= 0) {
              updated[foundIdx].restSeconds = selectedSecs;
              (updated[foundIdx] as any).restTimeSeconds = selectedSecs;
              updateExercisesAndSync(updated);
            }
          }
          if (autoStart) {
            setRestSeconds(selectedSecs);
            setRestTotalSeconds(selectedSecs);
            setContextRestSeconds(selectedSecs, selectedSecs);
            setIsRestPaused(false);
            setContextIsRestPaused(false);
          }
        }}
      />

      {/* Exercise Feedback & Question Modal (Teacher & Feed) */}
      {feedbackExercise && (
        <ExerciseFeedbackModal
          exercise={feedbackExercise}
          routineName={workoutName}
          currentWeight={feedbackExercise.sets.find((s) => s.completed && s.weight > 0)?.weight || feedbackExercise.sets[0]?.weight}
          currentReps={feedbackExercise.sets.find((s) => s.completed && s.reps > 0)?.reps || feedbackExercise.sets[0]?.reps}
          onClose={() => setFeedbackExercise(null)}
          onSendMessageToCoach={(msg) => {
            try {
              const existingNotifs = JSON.parse(localStorage.getItem('somma_coach_queries') || '[]');
              existingNotifs.unshift({
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...msg
              });
              localStorage.setItem('somma_coach_queries', JSON.stringify(existingNotifs));
            } catch (e) {
              console.error(e);
            }
          }}
          onPostToFeed={(post) => {
            try {
              const existingPosts = JSON.parse(localStorage.getItem('somma_community_posts') || '[]');
              existingPosts.unshift({
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                likes: 1,
                comments: 0,
                ...post
              });
              localStorage.setItem('somma_community_posts', JSON.stringify(existingPosts));
            } catch (e) {
              console.error(e);
            }
          }}
        />
      )}

      {/* Exercise Biomechanical Detail Modal (Tabs: Resumo, Histórico, Instruções, Recordes) */}
      {selectedExerciseForDetail && (
        <ExerciseDetailModal
          exercise={selectedExerciseForDetail}
          onClose={() => setSelectedExerciseForDetail(null)}
        />
      )}

      {/* Muscle Distribution Bottom Sheet (MuscleMap front & back) */}
      <ActiveWorkoutMuscleSheet
        isOpen={showMuscleDistribution}
        onClose={() => setShowMuscleDistribution(false)}
        exercises={exercises}
      />

      {/* Add To Block Bottom Sheet (Bi-set / Superset) */}
      <AddToBlockSheet
        isOpen={Boolean(exerciseForBlockAdd)}
        sourceExercise={exerciseForBlockAdd}
        availableExercises={availableExercisesForBlock}
        onClose={() => setExerciseForBlockAdd(null)}
        onConfirmGroup={handleCreateBlock}
      />

      {/* Block Rest Settings Bottom Sheet */}
      {blockForRestConfig && (
        <BlockRestConfigSheet
          isOpen={Boolean(blockForRestConfig)}
          blockName={blockForRestConfig.name}
          currentTransitionRest={blockForRestConfig.transitionRestSeconds}
          currentBlockRest={blockForRestConfig.blockRestSeconds}
          onClose={() => setBlockForRestConfig(null)}
          onSave={(trans, blockRest) =>
            handleUpdateBlockRest(blockForRestConfig.id, trans, blockRest)
          }
        />
      )}
    </div>
  );
};
