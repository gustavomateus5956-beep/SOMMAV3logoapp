import React, { useState, useEffect } from 'react';
import { X, Clock, ArrowDown, Timer } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface BlockRestConfigSheetProps {
  isOpen: boolean;
  blockName: string;
  currentTransitionRest: number;
  currentBlockRest: number;
  onClose: () => void;
  onSave: (transitionSecs: number, blockRestSecs: number) => void;
}

const TRANSITION_PRESETS = [
  { label: 'Sem descanso (0s)', value: 0 },
  { label: '10s', value: 10 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 }
];

const BLOCK_REST_PRESETS = [
  { label: '30s', value: 30 },
  { label: '45s', value: 45 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '120s', value: 120 },
  { label: '150s', value: 150 },
  { label: '180s', value: 180 }
];

export const BlockRestConfigSheet: React.FC<BlockRestConfigSheetProps> = ({
  isOpen,
  blockName,
  currentTransitionRest,
  currentBlockRest,
  onClose,
  onSave
}) => {
  useScrollLock(isOpen);

  const [transitionRest, setTransitionRest] = useState(currentTransitionRest);
  const [blockRest, setBlockRest] = useState(currentBlockRest);

  useEffect(() => {
    if (isOpen) {
      setTransitionRest(currentTransitionRest);
      setBlockRest(currentBlockRest);
    }
  }, [isOpen, currentTransitionRest, currentBlockRest]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(transitionRest, blockRest);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#262a30]/60 shrink-0">
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0066ff]" />
              <span>Configurar descansos do bloco</span>
            </h3>
            <p className="text-xs text-[#8c90a1] truncate mt-0.5">{blockName}</p>
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

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* 1. Transição entre A1 e A2 */}
          <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <ArrowDown className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Transição entre exercícios (A1 → A2)</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#38bdf8]">
                {transitionRest === 0 ? 'Sem descanso' : `${transitionRest}s`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {TRANSITION_PRESETS.map((preset) => {
                const isSelected = transitionRest === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setTransitionRest(preset.value)}
                    className={`h-9 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                      isSelected
                        ? 'bg-[#0066ff] border-[#0066ff] text-white shadow-xs'
                        : 'bg-[#101419] border-[#262a30] text-[#8c90a1] hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Descanso após o bloco completo */}
          <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Timer className="w-3.5 h-3.5 text-[#ff8400]" />
                <span>Descanso após o bloco (após A2)</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#ff8400]">
                {blockRest}s
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {BLOCK_REST_PRESETS.map((preset) => {
                const isSelected = blockRest === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setBlockRest(preset.value)}
                    className={`h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#0066ff] border-[#0066ff] text-white shadow-xs'
                        : 'bg-[#101419] border-[#262a30] text-[#8c90a1] hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Stepper fino */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8c90a1]">Ajuste fino:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBlockRest((prev) => Math.max(15, prev - 15))}
                  className="w-8 h-8 rounded-lg bg-[#101419] border border-[#262a30] hover:border-[#0066ff] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                >
                  -15s
                </button>
                <span className="font-mono text-sm font-bold text-white w-12 text-center">
                  {blockRest}s
                </span>
                <button
                  type="button"
                  onClick={() => setBlockRest((prev) => Math.min(600, prev + 15))}
                  className="w-8 h-8 rounded-lg bg-[#101419] border border-[#262a30] hover:border-[#0066ff] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                >
                  +15s
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262a30]/60 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#181c21] hover:bg-[#20252c] text-[#8c90a1] hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-[#262a30]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold shadow-md shadow-[#0066ff]/25 transition-all cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
