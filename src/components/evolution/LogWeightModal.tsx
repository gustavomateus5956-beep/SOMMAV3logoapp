import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWeight: (weight: number, bf: number) => void;
  defaultWeight?: string;
  defaultBf?: string;
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({
  isOpen,
  onClose,
  onSaveWeight,
  defaultWeight = '82.4',
  defaultBf = '14.8'
}) => {
  const [inputWeight, setInputWeight] = useState(defaultWeight);
  const [inputBf, setInputBf] = useState(defaultBf);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wNum = parseFloat(inputWeight);
    const bfNum = parseFloat(inputBf);

    if (isNaN(wNum) || wNum <= 0) return;

    onSaveWeight(wNum, !isNaN(bfNum) ? bfNum : 14.8);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain">
      <div className="w-full max-w-sm bg-[#181c21] border border-[#262a30] rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 overscroll-contain">
        <div className="flex items-center gap-2 text-[#0066ff]">
          <Scale className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">Registrar Pesagem Corporal</h3>
        </div>
        <p className="text-xs text-[#8c90a1]">
          Insira o peso matinal em jejum para registrar no gráfico de evolução e recalcular a massa magra.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#c2c6d8] font-semibold">Peso Atual (kg)</label>
            <input
              type="number"
              step="0.1"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-sm font-bold focus:border-[#0066ff] outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#c2c6d8] font-semibold">Gordura Corporal Estimada (% BF)</label>
            <input
              type="number"
              step="0.1"
              value={inputBf}
              onChange={(e) => setInputBf(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-sm font-bold focus:border-[#0066ff] outline-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
            >
              Confirmar Pesagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
