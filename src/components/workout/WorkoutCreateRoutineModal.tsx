import React from 'react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface WorkoutCreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineName: string;
  onRoutineNameChange: (val: string) => void;
  routineMuscle: string;
  onRoutineMuscleChange: (val: string) => void;
  onCreateRoutine: () => void;
}

export const WorkoutCreateRoutineModal: React.FC<WorkoutCreateRoutineModalProps> = ({
  isOpen,
  onClose,
  routineName,
  onRoutineNameChange,
  routineMuscle,
  onRoutineMuscleChange,
  onCreateRoutine
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain">
      <div className="w-full max-w-sm bg-[#1c2025] border border-[#262a30] rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 overscroll-contain">
        <h3 className="text-base font-bold text-white">Criar Nova Rotina de Treino</h3>
        <p className="text-xs text-[#8c90a1]">
          Defina o título e foco muscular da rotina para estruturar suas séries.
        </p>

        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] font-bold text-[#8c90a1] uppercase block mb-1">
              Nome da Rotina
            </label>
            <input
              type="text"
              placeholder="Ex: Treino D - Ombros e Abdômen"
              value={routineName}
              onChange={(e) => onRoutineNameChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-sm focus:border-[#0066ff] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8c90a1] uppercase block mb-1">
              Foco Muscular
            </label>
            <input
              type="text"
              placeholder="Ex: Deltóides e Core"
              value={routineMuscle}
              onChange={(e) => onRoutineMuscleChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-sm focus:border-[#0066ff] outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-[#262a30] text-xs font-semibold text-white cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onCreateRoutine}
            className="flex-1 h-10 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-xs font-bold text-white cursor-pointer"
          >
            Salvar Rotina
          </button>
        </div>
      </div>
    </div>
  );
};
