import React from 'react';
import { SetTypeKey } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';

interface SetTypeHelpModalProps {
  type: SetTypeKey | null;
  isOpen: boolean;
  onClose: () => void;
}

const SET_TYPE_EXPLANATIONS: Record<string, string> = {
  warmup: 'As séries de aquecimento são usadas para preparar o corpo e as articulações para levantar pesos maiores e prevenir lesões.',
  working: 'Séries de trabalho principais com carga e repetições planejadas para o seu objetivo de treino.',
  failure: 'Séries executadas até a falha concêntrica momentânea, quando nenhuma repetição completa adicional é possível com boa forma.',
  dropset: 'Série executada até a fadiga, seguida imediatamente por redução de carga (20% a 30%) e continuação das repetições sem descanso.'
};

export const SetTypeHelpModal: React.FC<SetTypeHelpModalProps> = ({
  type,
  isOpen,
  onClose
}) => {
  useScrollLock(isOpen);

  if (!isOpen || !type) return null;

  const text = SET_TYPE_EXPLANATIONS[type] || 'Série planejada de treino conforme orientação técnica.';

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#181c21] border border-[#262a30] rounded-2xl p-6 flex flex-col gap-5 shadow-2xl text-center animate-in zoom-in-95 duration-150 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed pt-1">
          {text}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-[#0066ff]/20"
        >
          Ok
        </button>
      </div>
    </div>
  );
};
