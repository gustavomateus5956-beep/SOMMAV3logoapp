import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { Routine, Exercise, WorkoutSessionRecord, TabType } from '../types';
import { INITIAL_ROUTINES } from '../data/mockData';
import { ExerciseLibraryModal } from './ExerciseLibraryModal';
import { WorkoutSessionDetailModal } from './WorkoutSessionDetailModal';
import { storageService } from '../services/storageService';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { PageHeader } from './PageHeader';

import { WorkoutQuickActions } from './workout/WorkoutQuickActions';
import { WorkoutTodaySection } from './workout/WorkoutTodaySection';
import { WorkoutRoutinesSection } from './workout/WorkoutRoutinesSection';
import { WorkoutHistorySection } from './workout/WorkoutHistorySection';
import { WorkoutCreateRoutineModal } from './workout/WorkoutCreateRoutineModal';

interface WorkoutViewProps {
  onStartRoutine: (routine: Routine | null) => void;
  onViewRoutineDetail: (routine: Routine) => void;
  onNavigate?: (tab: TabType) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  onStartRoutine,
  onViewRoutineDetail,
  onNavigate
}) => {
  const { user } = useUser();
  const { workoutStatus, activeSession, maximizeWorkout } = useWorkout();
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineMuscle, setNewRoutineMuscle] = useState('');
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [targetRoutineForExercise, setTargetRoutineForExercise] = useState<Routine | null>(null);
  
  // Historical sessions for current logged in user
  const [historySessions, setHistorySessions] = useState<WorkoutSessionRecord[]>([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState<WorkoutSessionRecord | null>(null);

  // Load user-specific sessions whenever user changes or view is focused
  const loadUserSessions = () => {
    if (user?.id) {
      const sessions = storageService.getWorkoutSessions(user.id);
      setHistorySessions(sessions);
    } else {
      setHistorySessions([]);
    }
  };

  useEffect(() => {
    loadUserSessions();
  }, [user?.id]);

  // Check if today's workout was completed today
  const todaySession = historySessions.find((s) => s.dateDisplay === 'Hoje' || s.dateDisplay.toLowerCase().includes('hoje'));
  const todayPlannedRoutine = routines[0] || INITIAL_ROUTINES[0];

  const handleCreateRoutine = () => {
    if (!newRoutineName.trim()) return;
    const newRoutine: Routine = {
      id: `custom-${Date.now()}`,
      name: newRoutineName.trim(),
      category: newRoutineMuscle.trim() || 'Personalizado',
      muscleGroups: newRoutineMuscle.trim() || 'Vários',
      lastSession: 'Nunca realizado',
      exercisesCount: 3,
      estimatedMinutes: 50,
      exercises: [
        {
          id: `ex-cust-1`,
          name: 'Supino Reto com Barra',
          muscleGroup: 'Peitoral',
          sets: [
            { id: 'cs-1', setNumber: 1, prevWeight: 80, prevReps: 10, weight: 80, reps: 10, completed: false },
            { id: 'cs-2', setNumber: 2, prevWeight: 84, prevReps: 8, weight: 84, reps: 8, completed: false }
          ]
        },
        {
          id: `ex-cust-2`,
          name: 'Desenvolvimento Militar',
          muscleGroup: 'Ombros',
          sets: [
            { id: 'cs-3', setNumber: 1, prevWeight: 20, prevReps: 10, weight: 20, reps: 10, completed: false },
            { id: 'cs-4', setNumber: 2, prevWeight: 22, prevReps: 8, weight: 22, reps: 8, completed: false }
          ]
        }
      ]
    };
    setRoutines([newRoutine, ...routines]);
    setNewRoutineName('');
    setNewRoutineMuscle('');
    setShowNewRoutineModal(false);
  };

  const handleAddExerciseFromLibrary = (exercise: Exercise) => {
    if (targetRoutineForExercise) {
      setRoutines((prev) =>
        prev.map((r) => {
          if (r.id === targetRoutineForExercise.id) {
            const updated = [...r.exercises, exercise];
            return {
              ...r,
              exercises: updated,
              exercisesCount: updated.length
            };
          }
          return r;
        })
      );
    } else {
      // Start instant workout with selected exercise
      onStartRoutine({
        id: `workout-${Date.now()}`,
        name: 'Treino com Exercício Selecionado',
        category: exercise.muscleGroup,
        muscleGroups: exercise.muscleGroup,
        lastSession: 'Hoje',
        exercisesCount: 1,
        estimatedMinutes: 45,
        exercises: [exercise]
      });
      setShowExerciseLibrary(false);
    }
  };

  const handleRepeatHistoricalSession = (session: WorkoutSessionRecord) => {
    const routineFromHistory: Routine = {
      id: session.routineId || `routine-${Date.now()}`,
      name: session.routineName,
      category: session.muscleGroups || 'Treino',
      muscleGroups: session.muscleGroups,
      lastSession: session.dateDisplay,
      exercisesCount: session.exercises.length,
      estimatedMinutes: session.durationMinutes,
      exercises: session.exercises.map((ex) => ({
        id: ex.exerciseId,
        name: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets.map((s, sIdx) => ({
          id: `s-${sIdx}`,
          setNumber: s.setNumber,
          prevWeight: s.weight,
          prevReps: s.reps,
          weight: s.weight,
          reps: s.reps,
          completed: false
        }))
      }))
    };
    onStartRoutine(routineFromHistory);
  };

  return (
    <div className="flex flex-col w-full pb-24 md:pb-12 gap-5">
      {/* Top Welcome & Consistency Header */}
      <section className="flex flex-col gap-4">
        <PageHeader
          category="CENTRAL DE TREINAMENTO"
          title="Treino"
          subtitle="Rotinas ativas, prescrições e histórico de sessões"
          badge={
            <div className="flex items-center gap-1.5 bg-[#181c21] px-3.5 py-1.5 rounded-full border border-[#262a30] shadow-sm">
              <Flame className="w-4 h-4 text-[#ff8400] fill-[#ff8400]" />
              <span className="text-xs font-bold text-white tracking-wide">
                Ofensiva {user?.streakDays || 14}
              </span>
            </div>
          }
        />

        {/* Quick Action Buttons & Evolução Navigation Banner */}
        <WorkoutQuickActions
          onStartEmptyWorkout={() => onStartRoutine(null)}
          onNavigate={onNavigate}
        />
      </section>

      {/* 1. SEÇÃO TREINO DE HOJE */}
      <WorkoutTodaySection
        workoutStatus={workoutStatus}
        activeSession={activeSession}
        maximizeWorkout={maximizeWorkout}
        todaySession={todaySession}
        todayPlannedRoutine={todayPlannedRoutine}
        onStartRoutine={onStartRoutine}
        onViewSessionDetail={(session) => setSelectedHistorySession(session)}
      />

      {/* 2. SEÇÃO SEUS TREINOS / MINHAS ROTINAS */}
      <WorkoutRoutinesSection
        routines={routines}
        onOpenNewRoutineModal={() => setShowNewRoutineModal(true)}
        onStartRoutine={onStartRoutine}
        onAddExerciseToRoutine={(routine) => {
          setTargetRoutineForExercise(routine);
          setShowExerciseLibrary(true);
        }}
        onViewRoutineDetail={onViewRoutineDetail}
      />

      {/* 3. SEÇÃO HISTÓRICO DE TREINOS */}
      <WorkoutHistorySection
        historySessions={historySessions}
        onSelectSession={(session) => setSelectedHistorySession(session)}
      />

      {/* Modal for creating a new routine */}
      <WorkoutCreateRoutineModal
        isOpen={showNewRoutineModal}
        onClose={() => setShowNewRoutineModal(false)}
        routineName={newRoutineName}
        onRoutineNameChange={setNewRoutineName}
        routineMuscle={newRoutineMuscle}
        onRoutineMuscleChange={setNewRoutineMuscle}
        onCreateRoutine={handleCreateRoutine}
      />

      {/* Historical Session Detail Modal */}
      {selectedHistorySession && (
        <WorkoutSessionDetailModal
          session={selectedHistorySession}
          onClose={() => setSelectedHistorySession(null)}
          onRepeatWorkout={handleRepeatHistoricalSession}
        />
      )}

      {/* Exercise Library Modal */}
      {showExerciseLibrary && (
        <ExerciseLibraryModal
          title={
            targetRoutineForExercise
              ? `Adicionar à rotina: ${targetRoutineForExercise.name}`
              : 'Biblioteca de Exercícios'
          }
          onClose={() => {
            setShowExerciseLibrary(false);
            setTargetRoutineForExercise(null);
          }}
          onAddExercise={handleAddExerciseFromLibrary}
        />
      )}
    </div>
  );
};
