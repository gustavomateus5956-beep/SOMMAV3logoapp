import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface IncompleteSetsModalProps {
  isOpen: boolean;
  pendingSetsCount: number;
  onContinueWorkout: () => void;
  onConfirmFinish: () => void;
}

export const IncompleteSetsModal: React.FC<IncompleteSetsModalProps> = ({
  isOpen,
  pendingSetsCount,
  onContinueWorkout,
  onConfirmFinish
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1c2025] border border-[#262a30] rounded-2xl p-5 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Séries ainda pendentes</h4>
            <p className="text-xs text-[#8c90a1] mt-0.5">
              Você tem {pendingSetsCount} série(s) não marcadas.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#c2c6d8] leading-relaxed">
          Deseja salvar o treino com o volume concluído até agora ou continuar executando as séries?
        </p>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onContinueWorkout}
            className="flex-1 h-10 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Continuar Treinando
          </button>
          <button
            type="button"
            onClick={onConfirmFinish}
            className="flex-1 h-10 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Finalizar Assim Mesmo
          </button>
        </div>
      </div>
    </div>
  );
};

interface DiscardWorkoutModalProps {
  isOpen: boolean;
  onMinimize: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const DiscardWorkoutModal: React.FC<DiscardWorkoutModalProps> = ({
  isOpen,
  onMinimize,
  onDiscard,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1c2025] border border-[#262a30] rounded-2xl p-5 flex flex-col gap-4 shadow-2xl">
        <h4 className="text-base font-bold text-white">Pausar ou Sair do Treino</h4>
        <p className="text-xs text-[#8c90a1] leading-relaxed">
          Você pode minimizar a sessão para conferir a dieta e retornar, ou descartar esta sessão.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onMinimize}
            className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            <span>Minimizar (Continuar em Segundo Plano)</span>
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="w-full h-11 rounded-xl bg-[#262a30] hover:bg-red-500/20 hover:text-red-400 text-[#8c90a1] text-xs font-bold transition-colors cursor-pointer"
          >
            Descartar Treino
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-xs text-[#8c90a1] hover:text-white transition-colors cursor-pointer text-center"
          >
            Voltar para o treino
          </button>
        </div>
      </div>
    </div>
  );
};
