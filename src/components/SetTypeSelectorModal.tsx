import React, { useState } from 'react';
import { X, Check, Dumbbell, Sparkles } from 'lucide-react';
import { SetTypeKey } from '../types';
import { SET_TYPE_LIST, getSetTypeConfig, SetTypeIcon } from '../data/setTypes';

interface SetTypeSelectorModalProps {
  currentType: SetTypeKey;
  setNumber: number;
  exerciseName: string;
  currentInstruction?: string;
  onClose: () => void;
  onSelectType: (type: SetTypeKey) => void;
}

export const SetTypeSelectorModal: React.FC<SetTypeSelectorModalProps> = ({
  currentType,
  setNumber,
  exerciseName,
  onClose,
  onSelectType
}) => {
  const [selectedType, setSelectedType] = useState<SetTypeKey>(currentType || 'working');

  const handleSave = () => {
    onSelectType(selectedType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#181c21] border border-[#262a30] rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#12161b] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c90a1]">
              Série {setNumber} • {exerciseName}
            </span>
            <h3 className="text-sm font-bold text-white">Objetivo & Tipo da Série</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Set Types List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2 no-scrollbar">
          <span className="text-[11px] font-bold text-[#8c90a1] uppercase block px-1">
            Selecione o Tipo
          </span>

          <div className="grid grid-cols-1 gap-1.5">
            {SET_TYPE_LIST.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedType(item.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? `${item.badgeBg} ${item.badgeBorder} shadow-sm`
                      : 'bg-[#1c2025] border-[#262a30] hover:bg-[#20252b]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                      isSelected
                        ? `${item.badgeBorder} bg-[#101419]`
                        : 'border-[#262a30] bg-[#14181f]'
                    }`}
                  >
                    <SetTypeIcon type={item.id} className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${item.badgeBg} ${item.badgeBorder} ${item.badgeText}`}
                      >
                        {item.symbol} {item.shortLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8c90a1] mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0066ff] flex items-center justify-center text-white shrink-0 mt-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#12161b] border-t border-[#262a30] flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-10 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            Aplicar à Série {setNumber}
          </button>
        </div>
      </div>
    </div>
  );
};
