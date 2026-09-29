import React from 'react';
import { X, AlertCircle, Dumbbell, Sparkles } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface RoutineLimitSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onManageRoutines?: () => void;
  onExploreSommaPlus?: () => void;
  currentCount?: number;
  maxLimit?: number;
}

export const RoutineLimitSheet: React.FC<RoutineLimitSheetProps> = ({
  isOpen,
  onClose,
  onManageRoutines,
  onExploreSommaPlus,
  currentCount = 4,
  maxLimit = 4
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleManage = () => {
    onClose();
    if (onManageRoutines) {
      onManageRoutines();
    }
  };

  const handleExplore = () => {
    if (onExploreSommaPlus) {
      onExploreSommaPlus();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#ff8400]/15 border border-[#ff8400]/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#ff8400]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pt-2 pb-5 space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff8400]">
              Plano Gratuito
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Limite de rotinas atingido
            </h3>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] flex items-center justify-between">
            <span className="text-xs text-[#8c90a1]">Rotinas salvas</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#ff8400]/20 text-[#ff8400] border border-[#ff8400]/30">
              {currentCount}/{maxLimit} utilizadas
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-[#8c90a1] leading-relaxed">
            <p>
              Você já possui <strong className="text-white font-semibold">{maxLimit} rotinas salvas</strong>.
            </p>
            <p>
              Você pode editar ou excluir uma rotina atual para criar outra.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#38bdf8]">
              <Dumbbell className="w-4 h-4 shrink-0 text-[#0066ff]" />
              <span>Treinos vazios continuam disponíveis ilimitadamente.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-5 border-t border-[#262a30]/60 bg-[#101419]/60 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleManage}
            className="w-full h-12 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066ff]/20 transition-all cursor-pointer flex items-center justify-center"
          >
            Gerenciar rotinas
          </button>

          <button
            type="button"
            onClick={handleExplore}
            className="w-full h-11 rounded-xl bg-[#181c21] hover:bg-[#20252c] border border-[#262a30] hover:border-[#0066ff]/30 text-[#8c90a1] hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff8400]" />
            <span>Conhecer SOMMA+</span>
          </button>
        </div>
      </div>
    </div>
  );
};
