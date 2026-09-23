import React, { useState } from 'react';
import {
  Play,
  Check,
  Timer,
  Clock,
  ChevronRight,
  Maximize2,
  AlertCircle,
  Dumbbell,
  CheckCircle2,
  X
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

interface MinimizedWorkoutWidgetProps {
  onWorkoutFinished?: (summary: {
    name: string;
    durationMinutes: number;
    totalVolume: number;
    setsCompleted: number;
  }) => void;
}

export const MinimizedWorkoutWidget: React.FC<MinimizedWorkoutWidgetProps> = ({
  onWorkoutFinished
}) => {
  const {
    workoutStatus,
    activeSession,
    totalExercises,
    completedExercises,
    progressPercentage,
    totalSets,
    completedSets,
    maximizeWorkout,
    finishWorkout
  } = useWorkout();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (workoutStatus !== 'minimized' || !activeSession) {
    return null;
  }

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const handleConfirmFinish = () => {
    setShowConfirmModal(false);
    const session = finishWorkout();
    if (session && onWorkoutFinished) {
      onWorkoutFinished({
        name: session.routineName,
        durationMinutes: session.durationMinutes,
        totalVolume: session.totalVolume,
        setsCompleted: session.totalCompletedSets
      });
    }
  };

  return (
    <>
      {/* Floating Bottom Minimized Bar */}
      <div
        id="minimized-workout-widget"
        className="fixed z-40 left-3 right-3 bottom-[72px] md:bottom-5 md:left-auto md:right-8 md:w-[420px] max-w-lg mx-auto animate-in slide-in-from-bottom-4 fade-in duration-200"
      >
        <div className="bg-[#12161b]/95 backdrop-blur-xl border border-[#262a30] hover:border-[#0066ff]/50 rounded-2xl p-3 shadow-2xl shadow-black/80 flex flex-col gap-2 transition-all">
          {/* Top Line: Workout Info + Timer & Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Clickable Area to Expand */}
            <button
              type="button"
              onClick={maximizeWorkout}
              className="flex-1 min-w-0 text-left cursor-pointer focus:outline-none group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-pulse shrink-0" />
                <h4 className="text-xs font-bold text-white truncate group-hover:text-[#b3c5ff] transition-colors">
                  {activeSession.workoutName}
                </h4>
                {activeSession.muscleGroups && (
                  <span className="text-[10px] text-[#8c90a1] truncate hidden sm:inline">
                    · {activeSession.muscleGroups}
                  </span>
                )}
              </div>

              {/* Progress & Real-time Timers */}
              <div className="flex items-center gap-2.5 mt-1 text-[11px] text-[#8c90a1]">
                <span className="font-semibold text-[#c2c6d8] tabular-nums">
                  {completedExercises}/{totalExercises} exercícios
                </span>
                <span>•</span>
                <span className="font-bold text-[#4edea3] tabular-nums">
                  {progressPercentage}%
                </span>
                <span>•</span>
                <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-white tabular-nums">
                  <Clock className="w-3 h-3 text-[#0066ff]" />
                  <span>{formatTimer(activeSession.seconds)}</span>
                </div>

                {activeSession.restSeconds !== null && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#0066ff]/20 text-[#b3c5ff] text-[10px] font-bold border border-[#0066ff]/30">
                    <Timer className="w-2.5 h-2.5 animate-spin" />
                    <span>{formatTimer(activeSession.restSeconds)}</span>
                  </div>
                )}
              </div>
            </button>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              {/* Continuar Button */}
              <button
                type="button"
                onClick={maximizeWorkout}
                className="h-8 px-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#0066ff]/20 cursor-pointer active:scale-95"
                title="Voltar ao treino"
              >
                <span>Continuar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Concluir Check Button */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                  progressPercentage === 100
                    ? 'bg-[#10b981] hover:bg-[#059669] text-white border-[#10b981] shadow-md shadow-[#10b981]/30'
                    : 'bg-[#1c2025] hover:bg-[#262a30] text-[#4edea3] hover:text-white border-[#262a30]'
                }`}
                title="Finalizar treino"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Real-time Progress Bar */}
          <div
            onClick={maximizeWorkout}
            className="w-full bg-[#1c2025] h-1.5 rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="h-full bg-gradient-to-r from-[#0066ff] via-[#4edea3] to-[#4edea3] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(4, progressPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal when finishing from minimized widget */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#181c21] border border-[#262a30] rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Dumbbell className="w-5 h-5 text-[#0066ff]" />
                <span>Finalizar Treino?</span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] text-[#8c90a1] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#12161b] border border-[#262a30] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8c90a1]">Exercícios Concluídos:</span>
                <span className="font-bold text-white">
                  {completedExercises} de {totalExercises}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8c90a1]">Séries Realizadas:</span>
                <span className="font-bold text-white">
                  {completedSets} de {totalSets}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8c90a1]">Tempo Decorrido:</span>
                <span className="font-bold font-mono text-white">
                  {formatTimer(activeSession.seconds)}
                </span>
              </div>

              {progressPercentage < 100 && (
                <div className="mt-1 pt-2 border-t border-[#262a30] flex items-center gap-1.5 text-[11px] text-[#ffb59d]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Você ainda possui exercícios ou séries pendentes.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Continuar Treinando
              </button>

              <button
                type="button"
                onClick={handleConfirmFinish}
                className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#0066ff]/25"
              >
                Finalizar Treino
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
