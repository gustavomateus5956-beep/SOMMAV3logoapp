import React from 'react';
import { Timer, Play } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

interface RestSettingsSheetProps {
  isOpen: boolean;
  currentRestSeconds: number;
  exerciseName?: string;
  onClose: () => void;
  onSetRest: (seconds: number, autoStart?: boolean) => void;
}

const PRESET_REST_TIMES = [
  { label: '30s', seconds: 30 },
  { label: '45s', seconds: 45 },
  { label: '1 min', seconds: 60 },
  { label: '1 min 30s', seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '2 min 30s', seconds: 150 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 }
];

export const RestSettingsSheet: React.FC<RestSettingsSheetProps> = ({
  isOpen,
  currentRestSeconds,
  exerciseName,
  onClose,
  onSetRest
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

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
          <h3 className="text-base font-bold text-white tracking-tight">
            Descanso entre Séries
          </h3>
          {exerciseName && (
            <p className="text-xs text-[#8c90a1] truncate mt-0.5">
              {exerciseName}
            </p>
          )}
        </div>

        {/* Presets Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_REST_TIMES.map((item) => {
            const isCurrent = currentRestSeconds === item.seconds;
            return (
              <button
                key={item.seconds}
                type="button"
                onClick={() => {
                  onSetRest(item.seconds, true);
                  onClose();
                }}
                className={`h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0066ff] text-white shadow-md shadow-[#0066ff]/25'
                    : 'bg-[#181c22] hover:bg-[#20252c] text-[#c2c6d8] border border-[#262a30]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Quick Start with Current Rest */}
        <div className="p-4 pt-1 border-t border-[#262a30]/50 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#181c22] hover:bg-[#20252c] text-[#8c90a1] text-xs font-semibold transition-colors cursor-pointer border border-[#262a30]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onSetRest(currentRestSeconds || 60, true);
              onClose();
            }}
            className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0066ff]/20"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Iniciar Descanso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
