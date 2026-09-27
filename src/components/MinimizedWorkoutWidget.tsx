import React, { useState } from 'react';
import {
  ChevronUp,
  Check,
  Dumbbell,
  AlertCircle,
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

  // Format real workout timer (e.g. 54s or 02:15)
  const formatWorkoutTimer = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Format real rest timer (e.g. 01:43)
  const formatRestTimer = (secs: number | null) => {
    if (secs === null) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleConfirmFinish = async () => {
    setShowConfirmModal(false);
    const session = await finishWorkout();
    if (session && onWorkoutFinished) {
      onWorkoutFinished({
        name: session.routineName,
        durationMinutes: session.durationMinutes,
        totalVolume: session.totalVolume,
        setsCompleted: session.totalCompletedSets
      });
    }
  };

  // Detect whether rest timer is currently active
  const isResting = activeSession.restSeconds !== null && activeSession.restSeconds > 0;

  // Active or current exercise name
  const currentExercise =
    activeSession.exercises[activeSession.lastActiveExerciseIndex || 0] ||
    activeSession.exercises[0];
  const currentExerciseName = currentExercise?.name || activeSession.workoutName || 'Treino Ativo';

  return (
    <>
      {/* Floating Bottom Minimized Bar: Posicionado acima da bottom navigation */}
      <div
        id="minimized-workout-widget"
        className="fixed z-45 left-3.5 right-3.5 bottom-[calc(5.4rem+env(safe-area-inset-bottom,0px))] md:bottom-6 md:left-auto md:right-8 md:w-[390px] max-w-[430px] mx-auto animate-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
      >
        <div
          className="rounded-2xl sm:rounded-3xl px-3.5 py-2.5 flex items-center justify-between gap-3 transition-all"
          style={{
            background: 'linear-gradient(180deg, rgba(38, 42, 50, 0.55), rgba(12, 14, 18, 0.42))',
            backdropFilter: 'blur(26px) saturate(145%)',
            WebkitBackdropFilter: 'blur(26px) saturate(145%)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Botão Esquerdo: Circular com Chevron para cima */}
          <button
            type="button"
            onClick={maximizeWorkout}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-[#c2c6d8] hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/10"
            title="Reabrir treino ativo"
            aria-label="Reabrir treino ativo"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Centro: Informações do Treino ou Descanso (clicável para expandir) */}
          <div
            onClick={maximizeWorkout}
            className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer select-none"
          >
            {isResting ? (
              /* ESTADO — DESCANSO */
              <>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="w-2 h-2 rounded-full bg-[#0066ff] shadow-sm shadow-[#0066ff]/60 animate-pulse shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#b3c5ff] tracking-tight">
                    Descanso
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-white tabular-nums tracking-tight">
                    {formatRestTimer(activeSession.restSeconds)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8c90a1] truncate mt-0.5 font-medium leading-tight">
                  {currentExerciseName}
                </p>
              </>
            ) : (
              /* ESTADO — TREINO ATIVO */
              <>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-sm shadow-[#10b981]/60 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Treino
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#c2c6d8] tabular-nums tracking-tight">
                    {formatWorkoutTimer(activeSession.seconds)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8c90a1] truncate mt-0.5 font-medium leading-tight">
                  {currentExerciseName}
                </p>
              </>
            )}
          </div>

          {/* Botão Direito: Ação de encerrar/finalizar com confirmação */}
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#10b981]/20 active:scale-95 text-[#8c90a1] hover:text-[#4edea3] flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/10 hover:border-[#10b981]/30"
            title="Finalizar treino"
            aria-label="Finalizar treino"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>
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
                  {formatWorkoutTimer(activeSession.seconds)}
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
