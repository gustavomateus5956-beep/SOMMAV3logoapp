import React from 'react';
import { X, Play, Clock, Dumbbell, Flame, ShieldCheck } from 'lucide-react';
import { Routine } from '../types';
import { ExerciseGuidanceSection } from './ExerciseGuidanceSection';
import { getSetTypeConfig, SetTypeIcon } from '../data/setTypes';
import { useScrollLock } from '../hooks/useScrollLock';

interface RoutineDetailModalProps {
  routine: Routine | null;
  onClose: () => void;
  onStartRoutine: (routine: Routine) => void;
}

export const RoutineDetailModal: React.FC<RoutineDetailModalProps> = ({
  routine,
  onClose,
  onStartRoutine
}) => {
  useScrollLock(!!routine);

  if (!routine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 overscroll-contain">
      <div className="w-full max-w-[460px] max-h-[85vh] bg-[#101419] border border-[#262a30] rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 overscroll-contain">
        {/* Header */}
        <div className="px-5 py-4 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066ff]">
              Estrutura de Treino
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">{routine.name}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Professional Certification Banner if certified */}
        {routine.isProfessionalCertified && routine.certifiedBy && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-[#0066ff]/10 via-[#181d24] to-[#00a572]/10 border-b border-[#0066ff]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0066ff]" />
              <div className="flex flex-col">
                <span className="font-bold text-white leading-tight">
                  Montado por {routine.certifiedBy.professionalName}
                </span>
                <span className="text-[10px] text-[#8c90a1]">
                  {routine.certifiedBy.registrationNumber} • {routine.certifiedBy.professionalRole}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-[#0066ff]/20 text-[#b3c5ff] px-2 py-0.5 rounded-full border border-[#0066ff]/30">
              SOMMA TRAIN
            </span>
          </div>
        )}

        {/* Quick specs */}
        <div className="px-5 py-3 bg-[#12171f] border-b border-[#262a30]/50 flex items-center gap-4 text-xs text-[#c2c6d8]">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-[#0066ff]" />
            <span>{routine.exercisesCount} exercícios</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#424656]"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#4edea3]" />
            <span>~{routine.estimatedMinutes} min</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#424656]"></div>
          <span className="text-[#8c90a1]">{routine.lastSession}</span>
        </div>

        {/* Exercises list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
          {routine.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-[#1c2025] rounded-xl p-3.5 border border-[#262a30]/70 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#262a30] text-[#0066ff] text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{exercise.name}</h4>
                    <span className="text-xs text-[#8c90a1]">{exercise.muscleGroup}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#4edea3] bg-[#00a572]/20 px-2 py-0.5 rounded-full">
                  {exercise.sets && exercise.sets.length > 0 ? `${exercise.sets.length} séries` : 'Séries a definir'}
                </span>
              </div>

              {/* Guidance & Professional Orientation */}
              <ExerciseGuidanceSection exercise={exercise} />

              {/* Set targets */}
              {exercise.sets && exercise.sets.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[11px] text-[#c2c6d8]">
                  {exercise.sets.map((set) => {
                    const setTypeConfig = getSetTypeConfig(set.type);
                    const isSpecial = set.type && set.type !== 'working';

                    return (
                      <div
                        key={set.id}
                        className="bg-[#181c21] p-2 rounded-lg text-center border border-[#262a30]/50 flex flex-col justify-between gap-1"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={`px-1 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border ${
                              isSpecial
                                ? `${setTypeConfig.badgeBg} ${setTypeConfig.badgeBorder} ${setTypeConfig.badgeText}`
                                : 'text-[#8c90a1] border-[#262a30]'
                            }`}
                          >
                            <SetTypeIcon type={set.type} className="w-2.5 h-2.5" />
                            <span>SÉRIE {set.setNumber}</span>
                          </span>
                        </div>
                        <span className="font-bold text-white text-xs tabular-nums">
                          {set.targetWeight || set.weight}kg × {set.targetReps || set.reps}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-[11px] text-[#8c90a1] italic pt-1 px-1">
                  Séries e cargas a definir na execução ou pelo treinador
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-[#181c21] border-t border-[#262a30] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-sm font-semibold transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => {
              onStartRoutine(routine);
              onClose();
            }}
            className="flex-2 h-12 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Iniciar Este Treino</span>
          </button>
        </div>
      </div>
    </div>
  );
};
