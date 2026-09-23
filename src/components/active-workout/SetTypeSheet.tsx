import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { SetTypeKey } from '../../types';
import { SetTypeHelpModal } from './SetTypeHelpModal';
import { useScrollLock } from '../../hooks/useScrollLock';

interface SetTypeSheetProps {
  isOpen: boolean;
  currentType?: SetTypeKey;
  setNumber: number;
  onClose: () => void;
  onSelectType: (type: SetTypeKey) => void;
  onRemoveSet: () => void;
}

export const SetTypeSheet: React.FC<SetTypeSheetProps> = ({
  isOpen,
  currentType = 'working',
  setNumber,
  onClose,
  onSelectType,
  onRemoveSet
}) => {
  const [helpType, setHelpType] = useState<SetTypeKey | null>(null);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleOpenHelp = (e: React.MouseEvent, type: SetTypeKey) => {
    e.stopPropagation();
    setHelpType(type);
  };

  const options: Array<{
    key: SetTypeKey;
    symbol: string;
    label: string;
    symbolColor: string;
  }> = [
    {
      key: 'warmup',
      symbol: 'W',
      label: 'Série de aquecimento',
      symbolColor: 'text-[#fbbf24]'
    },
    {
      key: 'working',
      symbol: '1',
      label: 'Série normal',
      symbolColor: 'text-white'
    },
    {
      key: 'failure',
      symbol: 'F',
      label: 'Série até a falha',
      symbolColor: 'text-[#ff5c5c]'
    },
    {
      key: 'dropset',
      symbol: 'D',
      label: 'Drop set',
      symbolColor: 'text-[#0066ff]'
    }
  ];

  return (
    <>
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

          {/* Sheet Title */}
          <div className="px-5 pt-1 pb-3 text-center border-b border-[#262a30]/50">
            <h3 className="text-base font-bold text-white tracking-tight">
              Selecionar tipo de série
            </h3>
          </div>

          {/* Options List */}
          <div className="py-2 px-3 space-y-1">
            {options.map((opt) => {
              const isSelected = currentType === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => {
                    onSelectType(opt.key);
                    onClose();
                  }}
                  className={`w-full h-14 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1c212a] border border-[#0066ff]/40'
                      : 'hover:bg-[#181c22]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-7 text-center font-black text-lg ${opt.symbolColor}`}>
                      {opt.symbol}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {opt.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleOpenHelp(e, opt.key)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#8c90a1] hover:text-white hover:bg-[#262a30] transition-colors cursor-pointer"
                    title="Ver explicação deste tipo de série"
                    aria-label={`Ajuda sobre ${opt.label}`}
                  >
                    <HelpCircle className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              );
            })}

            {/* Separator before Remove */}
            <div className="pt-2 border-t border-[#262a30]/60 mt-1" />

            {/* Remove Set Option */}
            <button
              type="button"
              onClick={() => {
                onRemoveSet();
                onClose();
              }}
              className="w-full h-14 px-4 rounded-xl flex items-center gap-4 text-left hover:bg-[#2d1518]/40 transition-colors cursor-pointer group"
            >
              <span className="w-7 text-center font-black text-lg text-[#ef4444] group-hover:scale-110 transition-transform">
                ✕
              </span>
              <span className="text-sm font-semibold text-[#ef4444]">
                Remover série
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <SetTypeHelpModal
        type={helpType}
        isOpen={Boolean(helpType)}
        onClose={() => setHelpType(null)}
      />
    </>
  );
};
