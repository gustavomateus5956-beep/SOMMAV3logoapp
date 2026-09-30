import React from 'react';
import { Info, MessageSquarePlus, Timer, Trash2, Layers, Unlink, ClipboardList } from 'lucide-react';
import { Exercise } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ExerciseOptionsSheetProps {
  isOpen: boolean;
  exercise: Exercise;
  totalExercises: number;
  isInBlock?: boolean;
  blockName?: string;
  onClose: () => void;
  onOpenDetail: () => void;
  onOpenFeedback: () => void;
  onOpenInstructions?: () => void;
  onConfigureRest: () => void;
  onRemoveExercise: () => void;
  onAddToBlock?: () => void;
  onRemoveFromBlock?: () => void;
}

export const ExerciseOptionsSheet: React.FC<ExerciseOptionsSheetProps> = ({
  isOpen,
  exercise,
  totalExercises,
  isInBlock = false,
  blockName,
  onClose,
  onOpenDetail,
  onOpenFeedback,
  onOpenInstructions,
  onConfigureRest,
  onRemoveExercise,
  onAddToBlock,
  onRemoveFromBlock
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const hasInstructions = Boolean(exercise.professionalNote?.trim());

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
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-2 shrink-0" />

        {/* Title */}
        <div className="px-5 pt-1 pb-3 text-center border-b border-[#262a30]/50">
          <h3 className="text-sm font-bold text-white truncate px-4">
            {exercise.name}
          </h3>
          <span className="text-xs text-[#8c90a1]">Opções do Exercício</span>
        </div>

        {/* Actions List */}
        <div className="py-2 px-3 space-y-1">
          {/* 1. Ver detalhes e histórico */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDetail();
            }}
            className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#181c22] text-left transition-colors cursor-pointer text-white"
          >
            <Info className="w-4 h-4 text-[#0066ff]" />
            <span className="text-sm font-semibold">Ver detalhes e histórico</span>
          </button>

          {/* 2. Configurar tempo de descanso */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfigureRest();
            }}
            className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#181c22] text-left transition-colors cursor-pointer text-white"
          >
            <Timer className="w-4 h-4 text-[#0066ff]" />
            <span className="text-sm font-semibold">Configurar tempo de descanso</span>
          </button>

          {/* 3. Instruções do profissional (apenas se houver instrução real) */}
          {hasInstructions && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInstructions?.();
              }}
              className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#181c22] text-left transition-colors cursor-pointer text-white"
            >
              <ClipboardList className="w-4 h-4 text-[#ff8400]" />
              <span className="text-sm font-semibold">Instruções do profissional</span>
            </button>
          )}

          {/* 4. Tirar dúvida com o profissional */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFeedback();
            }}
            className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#181c22] text-left transition-colors cursor-pointer text-white"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#4edea3]" />
            <span className="text-sm font-semibold">Tirar dúvida com o profissional</span>
          </button>

          {/* 5. Bi-set / Superset Block Action */}
          {isInBlock ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRemoveFromBlock && onRemoveFromBlock();
              }}
              className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#181c22] text-left transition-colors cursor-pointer text-white"
            >
              <Unlink className="w-4 h-4 text-[#ff8400]" />
              <span className="text-sm font-semibold">Remover do Superset</span>
            </button>
          ) : (
            totalExercises > 1 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddToBlock && onAddToBlock();
                }}
                className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#181c22] text-left transition-colors cursor-pointer text-white"
              >
                <Layers className="w-4 h-4 text-[#0066ff]" />
                <span className="text-sm font-semibold">Adicionar ao bloco</span>
              </button>
            )
          )}

          {/* 6. Separador e Remover exercício */}
          {totalExercises > 1 && (
            <>
              <div className="pt-2 border-t border-[#262a30]/60 mt-1" />
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRemoveExercise();
                }}
                className="w-full h-12 px-4 rounded-xl flex items-center gap-3 hover:bg-[#2d1518]/40 text-left transition-colors cursor-pointer text-[#ef4444]"
              >
                <Trash2 className="w-4 h-4 text-[#ef4444]" />
                <span className="text-sm font-semibold">Remover exercício do treino</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

