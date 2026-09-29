import React, { useState } from 'react';
import { X, Layers, Check, Dumbbell } from 'lucide-react';
import { Exercise } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface AddToBlockSheetProps {
  isOpen: boolean;
  sourceExercise: Exercise | null;
  availableExercises: Exercise[];
  onClose: () => void;
  onConfirmGroup: (secondExerciseId: string, blockType: 'superset' | 'biset') => void;
}

export const AddToBlockSheet: React.FC<AddToBlockSheetProps> = ({
  isOpen,
  sourceExercise,
  availableExercises,
  onClose,
  onConfirmGroup
}) => {
  useScrollLock(isOpen);

  const [selectedBlockType, setSelectedBlockType] = useState<'superset' | 'biset'>('superset');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  if (!isOpen || !sourceExercise) return null;

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    onConfirmGroup(selectedTargetId, selectedBlockType);
    setSelectedTargetId(null);
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
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#262a30]/60 shrink-0">
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0066ff]" />
              <span>Adicionar ao bloco</span>
            </h3>
            <p className="text-xs text-[#8c90a1] truncate mt-0.5">
              1º Exercício (A1): <span className="text-white font-medium">{sourceExercise.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Seção 1: Tipo de Bloco */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#8c90a1] tracking-wider uppercase block">
              Tipo de Bloco
            </span>

            <div className="space-y-1.5">
              {/* Bi-set / Superset */}
              <button
                type="button"
                onClick={() => setSelectedBlockType('superset')}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedBlockType === 'superset'
                    ? 'bg-[#181f2a] border-[#0066ff] shadow-xs shadow-[#0066ff]/15'
                    : 'bg-[#181c21] border-[#262a30] hover:bg-[#1f242c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedBlockType === 'superset'
                        ? 'border-[#0066ff] bg-[#0066ff]'
                        : 'border-[#64748b] bg-transparent'
                    }`}
                  >
                    {selectedBlockType === 'superset' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Bi-set / Superset
                    </span>
                    <span className="text-[10px] text-[#8c90a1]">
                      2 exercícios executados em sequência com transição direta
                    </span>
                  </div>
                </div>
              </button>

              {/* Tri-set (Em breve) */}
              <div className="w-full p-3 rounded-xl border border-[#262a30]/50 bg-[#14181f]/60 text-left flex items-center justify-between opacity-55 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#424656]" />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#8c90a1]">
                      Tri-set
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      3 exercícios consecutivos para o mesmo grupo ou sinergistas
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#262a30] text-[#8c90a1] border border-[#363a42]">
                  Em breve
                </span>
              </div>

              {/* Circuito (Em breve) */}
              <div className="w-full p-3 rounded-xl border border-[#262a30]/50 bg-[#14181f]/60 text-left flex items-center justify-between opacity-55 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-[#424656]" />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#8c90a1]">
                      Circuito
                    </span>
                    <span className="text-[10px] text-[#64748b]">
                      4 ou mais exercícios com descanso concentrado ao final
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#262a30] text-[#8c90a1] border border-[#363a42]">
                  Em breve
                </span>
              </div>
            </div>
          </div>

          {/* Seção 2: Escolha do Segundo Exercício */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-[#8c90a1] tracking-wider uppercase block">
              Escolha o segundo exercício (A2)
            </span>

            {availableExercises.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#181c21] border border-[#262a30] text-center text-xs text-[#8c90a1]">
                Nenhum outro exercício disponível no treino para agrupar. Adicione mais exercícios primeiro.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {availableExercises.map((ex) => {
                  const isSelected = selectedTargetId === ex.id;
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setSelectedTargetId(ex.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#181f2a] border-[#0066ff] shadow-xs'
                          : 'bg-[#181c21] border-[#262a30] hover:bg-[#1f242c]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#0066ff] bg-[#0066ff]'
                              : 'border-[#64748b] bg-transparent'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {ex.name}
                          </span>
                          <span className="text-[10px] text-[#8c90a1]">
                            {ex.muscleGroup || 'Músculo'} • {ex.sets.length} séries
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#0066ff]/20 text-[#38bdf8] border border-[#0066ff]/40 shrink-0">
                          A2
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
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
            onClick={handleConfirm}
            disabled={!selectedTargetId}
            className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-[#0066ff]/25 transition-all cursor-pointer"
          >
            Criar Superset
          </button>
        </div>
      </div>
    </div>
  );
};
