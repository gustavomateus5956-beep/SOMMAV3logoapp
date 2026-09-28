import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Routine, Exercise, WorkoutSessionRecord, CompletedExerciseLog, CompletedSetLog } from '../types';
import { repositories } from '../data';
import { useUser } from './UserContext';
import { playRestFinishedSound } from '../utils/workoutSound';

export type WorkoutSessionStatus = 'idle' | 'active' | 'minimized' | 'completed';

export interface ActiveWorkoutSession {
  routine: Routine | null;
  workoutName: string;
  muscleGroups: string;
  exercises: Exercise[];
  startedAt: Date;
  seconds: number;
  isTimerPaused: boolean;
  restSeconds: number | null;
  restTotalSeconds: number | null;
  isRestPaused: boolean;
  lastActiveExerciseIndex: number;
  lastActiveSetIndex: number;
  finalDurationSeconds?: number;
}

export interface WorkoutContextType {
  workoutStatus: WorkoutSessionStatus;
  activeSession: ActiveWorkoutSession | null;
  // Metrics
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  progressPercentage: number;
  restSeconds: number | null;
  restTotalSeconds: number | null;
  // Actions
  startWorkout: (routine: Routine | null) => void | Promise<void>;
  minimizeWorkout: () => void;
  maximizeWorkout: () => void;
  updateExercises: (exercises: Exercise[] | ((prev: Exercise[]) => Exercise[])) => void;
  setWorkoutName: (name: string) => void;
  setRestSeconds: (
    seconds: number | null | ((prev: number | null) => number | null),
    totalOverride?: number | null
  ) => void;
  adjustRestSeconds: (delta: number) => void;
  skipRest: () => void;
  setIsRestPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
  setIsTimerPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
  setLastActivePosition: (exerciseIndex: number, setIndex: number) => void;
  completeSetInContext: (
    exercises: Exercise[],
    exIndex: number,
    setIndex: number,
    targetRest: number | null
  ) => void;
  completeWorkoutInContext: (frozenSeconds: number) => void;
  finishWorkout: () => Promise<WorkoutSessionRecord | null> | WorkoutSessionRecord | null;
  discardWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useUser();
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutSessionStatus>('idle');
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);

  // Interval reference for global ticking (works both when active and minimized)
  const timerRef = useRef<number | null>(null);

  // Background ticker for workout time and rest countdown
  useEffect(() => {
    if (workoutStatus === 'active' || workoutStatus === 'minimized') {
      timerRef.current = window.setInterval(() => {
        setActiveSession((prev) => {
          if (!prev) return null;

          let newSeconds = prev.seconds;
          if (!prev.isTimerPaused) {
            newSeconds = prev.seconds + 1;
          }

          let newRestSeconds = prev.restSeconds;
          let newRestTotalSeconds = prev.restTotalSeconds;
          if (newRestSeconds !== null && !prev.isRestPaused) {
            if (newRestSeconds <= 1) {
              newRestSeconds = null;
              newRestTotalSeconds = null;
              playRestFinishedSound();
            } else {
              newRestSeconds = newRestSeconds - 1;
            }
          }

          return {
            ...prev,
            seconds: newSeconds,
            restSeconds: newRestSeconds,
            restTotalSeconds: newRestTotalSeconds
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [workoutStatus]);

  // Derived metrics
  const exercises = activeSession?.exercises || [];
  const totalExercises = exercises.length;
  const completedExercises = exercises.filter(
    (ex) => ex.sets.length > 0 && ex.sets.every((s) => s.completed)
  ).length;

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );

  const progressPercentage =
    totalExercises > 0
      ? Math.round((completedExercises / totalExercises) * 100)
      : totalSets > 0
        ? Math.round((completedSets / totalSets) * 100)
        : 0;

  // Start new workout
  const startWorkout = useCallback(async (routine: Routine | null) => {
    let initialExercises: Exercise[] = [];

    if (routine && routine.exercises && routine.exercises.length > 0) {
      initialExercises = JSON.parse(JSON.stringify(routine.exercises)) as Exercise[];
      // Enrich with previous performance if available
      if (user?.id) {
        await Promise.all(
          initialExercises.map(async (ex) => {
            try {
              const past = await repositories.workout.getLastExercisePerformance(user.id, ex.name);
              if (past && past.sets.length > 0) {
                ex.sets.forEach((set, idx) => {
                  const prevSet = past.sets[idx] || past.sets[past.sets.length - 1];
                  if (prevSet) {
                    set.prevWeight = prevSet.weight;
                    set.prevReps = prevSet.reps;
                    if (!set.weight || set.weight === 0) {
                      set.weight = prevSet.weight;
                    }
                    if (!set.reps || set.reps === 0) {
                      set.reps = prevSet.reps;
                    }
                  }
                });
              }
            } catch (err) {
              console.error(`Erro ao consultar performance anterior de "${ex.name}":`, err);
            }
          })
        );
      }
    } else {
      // Manual/free workout starts completely empty: no default exercises, no Supino, no mock
      initialExercises = [];
    }

    const muscleGroups = routine?.muscleGroups || (initialExercises.length > 0 ? initialExercises.map((e) => e.muscleGroup).slice(0, 2).join(' & ') : 'Livre');

    setActiveSession({
      routine,
      workoutName: routine?.name || 'Treino Personalizado',
      muscleGroups,
      exercises: initialExercises,
      startedAt: new Date(),
      seconds: 0,
      isTimerPaused: false,
      restSeconds: null,
      restTotalSeconds: null,
      isRestPaused: false,
      lastActiveExerciseIndex: 0,
      lastActiveSetIndex: 0
    });

    setWorkoutStatus('active');
  }, [user?.id]);

  // Minimize workout to background floating widget
  const minimizeWorkout = useCallback(() => {
    if (workoutStatus === 'active') {
      setWorkoutStatus('minimized');
    }
  }, [workoutStatus]);

  // Maximize workout back to full modal
  const maximizeWorkout = useCallback(() => {
    if (workoutStatus === 'minimized') {
      setWorkoutStatus('active');
    }
  }, [workoutStatus]);

  // Update exercises in session
  const updateExercises = useCallback(
    (action: Exercise[] | ((prev: Exercise[]) => Exercise[])) => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const newExercises = typeof action === 'function' ? action(prev.exercises) : action;
        return {
          ...prev,
          exercises: newExercises
        };
      });
    },
    []
  );

  const setWorkoutName = useCallback((name: string) => {
    setActiveSession((prev) => (prev ? { ...prev, workoutName: name } : null));
  }, []);

  const setRestSeconds = useCallback(
    (
      action: number | null | ((prev: number | null) => number | null),
      totalOverride?: number | null
    ) => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const nextVal = typeof action === 'function' ? action(prev.restSeconds) : action;
        let nextTotal = prev.restTotalSeconds;
        if (nextVal === null) {
          nextTotal = null;
        } else if (totalOverride !== undefined) {
          nextTotal = totalOverride;
        } else if (prev.restTotalSeconds === null || prev.restSeconds === null) {
          nextTotal = nextVal;
        }
        return {
          ...prev,
          restSeconds: nextVal,
          restTotalSeconds: nextTotal
        };
      });
    },
    []
  );

  const adjustRestSeconds = useCallback((delta: number) => {
    setActiveSession((prev) => {
      if (!prev || prev.restSeconds === null) return prev;
      const nextRemaining = Math.max(0, prev.restSeconds + delta);
      if (nextRemaining === 0) {
        return {
          ...prev,
          restSeconds: null,
          restTotalSeconds: null
        };
      }
      const currentTotal = prev.restTotalSeconds ?? prev.restSeconds;
      const nextTotal = Math.max(nextRemaining, currentTotal + delta);
      return {
        ...prev,
        restSeconds: nextRemaining,
        restTotalSeconds: nextTotal
      };
    });
  }, []);

  const skipRest = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        restSeconds: null,
        restTotalSeconds: null
      };
    });
  }, []);

  const setIsRestPaused = useCallback(
    (action: boolean | ((prev: boolean) => boolean)) => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const nextVal = typeof action === 'function' ? action(prev.isRestPaused) : action;
        return {
          ...prev,
          isRestPaused: nextVal
        };
      });
    },
    []
  );

  const setIsTimerPaused = useCallback(
    (action: boolean | ((prev: boolean) => boolean)) => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const nextVal = typeof action === 'function' ? action(prev.isTimerPaused) : action;
        return {
          ...prev,
          isTimerPaused: nextVal
        };
      });
    },
    []
  );

  const setLastActivePosition = useCallback((exerciseIndex: number, setIndex: number) => {
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            lastActiveExerciseIndex: exerciseIndex,
            lastActiveSetIndex: setIndex
          }
        : null
    );
  }, []);

  const completeSetInContext = useCallback(
    (newExercises: Exercise[], exIndex: number, setIndex: number, targetRest: number | null) => {
      setActiveSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          exercises: newExercises,
          lastActiveExerciseIndex: exIndex,
          lastActiveSetIndex: setIndex,
          restSeconds: targetRest !== null ? targetRest : prev.restSeconds,
          restTotalSeconds: targetRest !== null ? targetRest : prev.restTotalSeconds,
          isRestPaused: targetRest !== null ? false : prev.isRestPaused
        };
      });
    },
    []
  );

  const isFinishingRef = useRef(false);

  // Freeze session and timers upon completion snapshot
  const completeWorkoutInContext = useCallback((frozenSeconds: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setWorkoutStatus('completed');
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        seconds: frozenSeconds,
        finalDurationSeconds: frozenSeconds,
        restSeconds: null,
        restTotalSeconds: null,
        isTimerPaused: true,
        isRestPaused: true
      };
    });
  }, []);

  // Finish and save workout
  const finishWorkout = useCallback(async (): Promise<WorkoutSessionRecord | null> => {
    if (!activeSession || isFinishingRef.current) return null;
    isFinishingRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const finalSeconds = activeSession.finalDurationSeconds ?? activeSession.seconds;
    const durationMinutes = Math.max(1, Math.round(finalSeconds / 60));
    const now = new Date();

    let sessionTotalVolume = 0;
    let sessionCompletedSets = 0;
    let detectedPrs = 0;

    const completedExercisesLog: CompletedExerciseLog[] = activeSession.exercises.map((ex) => {
      const mappedSets: CompletedSetLog[] = ex.sets.map((s) => {
        const isPr = Boolean(s.prevWeight && s.weight > s.prevWeight && s.reps >= (s.prevReps || 0));
        if (s.completed) {
          sessionTotalVolume += s.weight * s.reps;
          sessionCompletedSets += 1;
          if (isPr) detectedPrs += 1;
        }

        return {
          setNumber: s.setNumber,
          type: s.type || 'working',
          targetWeight: s.targetWeight,
          targetReps: s.targetReps,
          weight: s.weight,
          reps: s.reps,
          completed: s.completed,
          prevWeight: s.prevWeight,
          prevReps: s.prevReps,
          isPr,
          instruction: s.instruction
        };
      });

      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        professionalNote: ex.professionalNote,
        sets: mappedSets
      };
    });

    const sessionRecord: WorkoutSessionRecord = {
      id: `workout-session-${Date.now()}`,
      userId: user?.id || 'user_lucas_default',
      routineId: activeSession.routine?.id,
      routineName: activeSession.workoutName,
      muscleGroups: activeSession.muscleGroups,
      startedAt: activeSession.startedAt.toISOString(),
      finishedAt: now.toISOString(),
      dateDisplay: 'Hoje',
      durationMinutes,
      durationFormatted: `${durationMinutes} min`,
      totalVolume: sessionTotalVolume,
      totalCompletedSets: sessionCompletedSets,
      totalExercises: activeSession.exercises.length,
      prsCount: detectedPrs,
      exercises: completedExercisesLog,
      notes: activeSession.routine?.category ? `Categoria: ${activeSession.routine.category}` : undefined
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

    setWorkoutStatus('completed');
    setActiveSession(null);

    // After brief completed state, reset to idle
    setTimeout(() => {
      isFinishingRef.current = false;
      setWorkoutStatus('idle');
    }, 500);

    return sessionRecord;
  }, [activeSession, user, updateUser]);

  // Discard workout without saving
  const discardWorkout = useCallback(() => {
    setActiveSession(null);
    setWorkoutStatus('idle');
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        workoutStatus,
        activeSession,
        totalExercises,
        completedExercises,
        totalSets,
        completedSets,
        progressPercentage,
        restSeconds: activeSession?.restSeconds ?? null,
        restTotalSeconds: activeSession?.restTotalSeconds ?? null,
        startWorkout,
        minimizeWorkout,
        maximizeWorkout,
        updateExercises,
        setWorkoutName,
        setRestSeconds,
        adjustRestSeconds,
        skipRest,
        setIsRestPaused,
        setIsTimerPaused,
        setLastActivePosition,
        completeSetInContext,
        completeWorkoutInContext,
        finishWorkout,
        discardWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout deve ser usado dentro de um WorkoutProvider');
  }
  return context;
};
