import React from 'react';
import { X, ClipboardList, MessageSquarePlus, UserCheck } from 'lucide-react';
import { Exercise } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface ProfessionalInstructionsSheetProps {
  isOpen: boolean;
  exercise: Exercise;
  coachName?: string;
  onClose: () => void;
  onOpenFeedback: () => void;
}

export const ProfessionalInstructionsSheet: React.FC<ProfessionalInstructionsSheetProps> = ({
  isOpen,
  exercise,
  coachName,
  onClose,
  onOpenFeedback
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const instructionText =
    exercise.professionalNote ||
    (exercise as any).instruction ||
    (exercise as any).notes ||
    '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#262a30]/60 shrink-0">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff]">
              Instruções do profissional
            </span>
            <h3 className="text-base font-bold text-white tracking-tight truncate mt-0.5">
              {exercise.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar instruções"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* Caixa de Instrução */}
          <div className="p-4 rounded-2xl bg-[#181c21] border border-[#262a30] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c2c6d8]">
              <ClipboardList className="w-4 h-4 text-[#0066ff] shrink-0" />
              <span>Orientação de execução</span>
            </div>
            <p className="text-sm text-white leading-relaxed whitespace-pre-line">
              "{instructionText}"
            </p>
          </div>

          {/* Identificação do profissional se disponível */}
          {coachName && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#101419] border border-[#262a30] text-xs">
              <UserCheck className="w-4 h-4 text-[#4edea3] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#8c90a1] uppercase tracking-wide">
                  Prescrito por
                </span>
                <span className="font-semibold text-white truncate">{coachName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-[#262a30]/60 bg-[#101419]/60 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFeedback();
            }}
            className="w-full h-12 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066ff]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Tirar dúvida com o profissional</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#181c21] hover:bg-[#20252c] border border-[#262a30] text-[#8c90a1] hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
