import React from 'react';
import { Award, Instagram, Check } from 'lucide-react';
import { Exercise } from '../../types';

interface ActiveWorkoutCelebrationModalProps {
  isOpen: boolean;
  workoutName: string;
  seconds: number;
  totalVolume: number;
  totalCompletedSets: number;
  detectedPrs: number;
  exercises: Exercise[];
  formatTimer: (secs: number) => string;
  onOpenExport: () => void;
  onSaveAndExit: () => void;
}

export const ActiveWorkoutCelebrationModal: React.FC<ActiveWorkoutCelebrationModalProps> = ({
  isOpen,
  workoutName,
  seconds,
  totalVolume,
  totalCompletedSets,
  detectedPrs,
  exercises,
  formatTimer,
  onOpenExport,
  onSaveAndExit
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/92 backdrop-blur-md z-50 flex flex-col items-center justify-between p-6 text-center animate-in zoom-in-95 duration-200 overflow-y-auto no-scrollbar">
      <div className="w-full flex flex-col items-center pt-4">
        <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center text-[#10b981] mb-3 shadow-lg shadow-[#10b981]/20 animate-bounce">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#4edea3]">
          Consistência Registrada
        </span>
        <h3 className="text-2xl font-black text-white mt-1">{workoutName}</h3>
        <p className="text-xs text-[#8c90a1] mt-1 max-w-xs leading-relaxed">
          Treino finalizado com sucesso e salvo no seu perfil SOMMA+.
        </p>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-md my-5">
          <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30] flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Duração</span>
            <span className="text-base font-black text-white mt-0.5">
              {formatTimer(seconds)}
            </span>
          </div>

          <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30] flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Volume Total</span>
            <span className="text-base font-black text-[#4edea3] mt-0.5 tabular-nums">
              {totalVolume.toLocaleString()} kg
            </span>
          </div>

          <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30] flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Séries Concluídas</span>
            <span className="text-base font-black text-[#b3c5ff] mt-0.5">
              {totalCompletedSets}
            </span>
          </div>

          <div className="bg-[#181c21] p-3 rounded-2xl border border-[#262a30] flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase">Recordes (PR)</span>
            <span className="text-base font-black text-[#ffb59d] mt-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {detectedPrs}
            </span>
          </div>
        </div>

        {/* Exercise Summary Preview */}
        <div className="w-full max-w-md bg-[#181c21] rounded-2xl p-4 border border-[#262a30] text-left mb-4">
          <span className="text-xs font-bold text-white block mb-2">Exercícios Executados</span>
          <div className="space-y-2">
            {exercises.map((ex, idx) => (
              <div
                key={`fin-${idx}`}
                className="flex items-center justify-between text-xs py-1 border-b border-[#262a30]/50 last:border-0"
              >
                <span className="font-semibold text-[#c2c6d8] truncate pr-2">{ex.name}</span>
                <span className="text-[11px] text-[#4edea3] font-bold shrink-0">
                  {ex.sets.filter((s) => s.completed).length}/{ex.sets.length} séries
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-md pb-4">
        <button
          type="button"
          onClick={onOpenExport}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Instagram className="w-4 h-4" />
          <span>Compartilhar & Salvar Imagem</span>
        </button>

        <button
          type="button"
          onClick={onSaveAndExit}
          className="w-full h-12 rounded-2xl bg-[#0066ff] hover:bg-[#0054d6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>Salvar Treino no SOMMA</span>
        </button>
      </div>
    </div>
  );
};
