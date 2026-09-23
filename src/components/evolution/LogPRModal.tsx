import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { LoadProgressionItem } from './types';

interface LogPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressionList: LoadProgressionItem[];
  initialExerciseId: string;
  onSavePr: (data: { exerciseId: string; weight: number; reps: number; rpe: number }) => void;
}

export const LogPRModal: React.FC<LogPRModalProps> = ({
  isOpen,
  onClose,
  progressionList,
  initialExerciseId,
  onSavePr
}) => {
  const [logExerciseId, setLogExerciseId] = useState(initialExerciseId);
  const [newWeight, setNewWeight] = useState('');
  const [newReps, setNewReps] = useState('1');
  const [newRpe, setNewRpe] = useState('9.5');

  useEffect(() => {
    if (initialExerciseId) {
      setLogExerciseId(initialExerciseId);
    }
  }, [initialExerciseId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(newWeight);
    const repsNum = parseInt(newReps, 10) || 1;
    const rpeNum = parseFloat(newRpe) || 9.5;

    if (isNaN(weightNum) || weightNum <= 0) return;

    onSavePr({
      exerciseId: logExerciseId,
      weight: weightNum,
      reps: repsNum,
      rpe: rpeNum
    });

    setNewWeight('');
    setNewReps('1');
    setNewRpe('9.5');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#181c21] border border-[#262a30] rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center gap-2 text-[#0066ff]">
          <Award className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">Registrar Teste de Sobrecarga</h3>
        </div>
        <p className="text-xs text-[#8c90a1]">
          Atualize sua 1RM estimada e adicione uma nova entrada na tabela de progressão de carga.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#c2c6d8] font-semibold">Exercício</label>
            <select
              value={logExerciseId}
              onChange={(e) => setLogExerciseId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none cursor-pointer"
            >
              {progressionList.map((item) => (
                <option key={item.id} value={item.id} className="bg-[#181c21]">
                  {item.exercise} (Atual: {item.currentPr}kg)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#c2c6d8] font-semibold">Carga Utilizada (kg)</label>
              <input
                type="number"
                step="0.5"
                placeholder="Ex: 102.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-sm font-bold focus:border-[#0066ff] outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#c2c6d8] font-semibold">Repetições Válidas</label>
              <input
                type="number"
                placeholder="Ex: 3"
                value={newReps}
                onChange={(e) => setNewReps(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#101419] border border-[#262a30] text-white text-sm font-bold focus:border-[#0066ff] outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#c2c6d8] font-semibold">Esforço Subjetivo (RPE)</label>
              <span className="text-xs font-bold text-[#4edea3]">RPE {newRpe}</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="10.0"
              step="0.5"
              value={newRpe}
              onChange={(e) => setNewRpe(e.target.value)}
              className="w-full accent-[#0066ff] cursor-pointer"
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
              Salvar na Tabela
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
