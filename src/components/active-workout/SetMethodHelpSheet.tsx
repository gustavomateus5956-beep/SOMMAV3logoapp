import React from 'react';
import { X, HelpCircle, Check } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface SetMethodHelpSheetProps {
  isOpen: boolean;
  title: string;
  categoryLabel?: 'FUNÇÃO DA SÉRIE' | 'MÉTODO DE INTENSIDADE';
  description: string;
  onClose: () => void;
}

export const SetMethodHelpSheet: React.FC<SetMethodHelpSheetProps> = ({
  isOpen,
  title,
  categoryLabel,
  description,
  onClose
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0066ff]/20 text-[#38bdf8] flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              {categoryLabel && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff]">
                  {categoryLabel}
                </span>
              )}
              <h3 className="text-base font-bold text-white tracking-tight truncate">
                {title}
              </h3>
            </div>
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

        {/* Description Body */}
        <div className="p-5">
          <div className="p-4 rounded-2xl bg-[#181c21] border border-[#262a30]">
            <p className="text-sm text-white leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-[#262a30]/60 bg-[#101419]/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066ff]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Entendi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
