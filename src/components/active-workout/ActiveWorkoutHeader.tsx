import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Timer,
  Play,
  Pause,
  MoreVertical,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import type { MuscleMapValues } from '@musclemap/core';
import { MiniMuscleMapButton } from '../muscle-map/MiniMuscleMapButton';

interface ActiveWorkoutHeaderProps {
  isTimerPaused: boolean;
  seconds: number;
  onTogglePauseTimer: () => void;
  onMinimize: () => void;
  onConclude: () => void;
  totalCompletedSets: number;
  totalSetsCount: number;
  progressPercentage: number;
  restSeconds: number | null;
  isRestPaused: boolean;
  onAddRestSeconds: (delta: number) => void;
  onTogglePauseRest: () => void;
  onSkipRest: () => void;
  onOpenRestSettings?: () => void;
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  totalVolume: number;
  formatTimer: (secs: number) => string;
  onOpenMuscleDistribution?: () => void;
  muscleValues?: MuscleMapValues;
  onDiscard?: () => void;
}

export const ActiveWorkoutHeader: React.FC<ActiveWorkoutHeaderProps> = ({
  isTimerPaused,
  seconds,
  onTogglePauseTimer,
  onMinimize,
  onConclude,
  totalCompletedSets,
  restSeconds,
  isRestPaused,
  onAddRestSeconds,
  onTogglePauseRest,
  onSkipRest,
  onOpenRestSettings,
  workoutName,
  onWorkoutNameChange,
  totalVolume,
  formatTimer,
  onOpenMuscleDistribution,
  muscleValues,
  onDiscard
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newNameInput, setNewNameInput] = useState(workoutName);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Keep input in sync with current workout name
  useEffect(() => {
    setNewNameInput(workoutName);
  }, [workoutName]);

  const handleOpenRename = () => {
    setIsMenuOpen(false);
    setNewNameInput(workoutName);
    setIsRenameOpen(true);
  };

  const handleSaveRename = () => {
    const trimmed = newNameInput.trim();
    if (trimmed) {
      onWorkoutNameChange(trimmed);
      setIsRenameOpen(false);
    }
  };

  // Format duration nicely (e.g. "8s" if < 60, or "MM:SS")
  const formatDurationDisplay = (totalSecs: number) => {
    if (totalSecs < 60) return `${totalSecs}s`;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#101419] border-b border-[#1c2025] shrink-0 z-20">
      {/* Top Bar: [ Recolher ]   TREINO (Informativo, não editável inline)   [ Timer ] [ Menu ] [ CONCLUIR ] */}
      <div className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Button Recolher / Voltar */}
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimizar treino"
          className="w-9 h-9 rounded-full bg-[#181c21] hover:bg-[#262a30] active:scale-95 border border-[#262a30] flex items-center justify-center text-[#c2c6d8] hover:text-white transition-all shrink-0 cursor-pointer"
          title="Minimizar treino para segundo plano"
        >
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center: Workout Title (Informativo, sem sobreposição, truncamento inteligente) */}
        <div className="flex-1 min-w-0 px-2 flex items-center justify-center">
          <h2
            className="text-sm sm:text-base font-bold text-white truncate text-center select-none"
            title={workoutName}
          >
            {workoutName}
          </h2>
        </div>

        {/* Right: Timer icon + Menu 3 Pontos + Concluir button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenRestSettings && (
            <button
              type="button"
              onClick={onOpenRestSettings}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                restSeconds !== null
                  ? 'bg-[#0066ff]/20 text-[#0066ff] border-[#0066ff]/40'
                  : 'bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white border-[#262a30]'
              }`}
              title="Configurar ou ver descanso"
              aria-label="Descanso"
            >
              <Timer className="w-4 h-4" />
            </button>
          )}

          {/* Menu de Ações do Treino (Três Pontos) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Ações do treino"
              aria-expanded={isMenuOpen}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                isMenuOpen
                  ? 'bg-[#0066ff]/20 text-[#38bdf8] border-[#0066ff]/40'
                  : 'bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white border-[#262a30]'
              }`}
              title="Mais opções do treino"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#181c21] border border-[#2a303c] rounded-2xl p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={handleOpenRename}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#22272e] flex items-center gap-2.5 text-xs font-semibold text-white transition-colors cursor-pointer text-left"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>Renomear treino</span>
                </button>

                {onDiscard && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDiscard();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#ef4444]/10 flex items-center gap-2.5 text-xs font-semibold text-[#ef4444] transition-colors cursor-pointer text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Descartar treino</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Botão Concluir */}
          <button
            type="button"
            onClick={onConclude}
            className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-full bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-[#0066ff]/25"
          >
            Concluir
          </button>
        </div>
      </div>

      {/* Horizontal Stats Row: Duração | Volume | Séries | Muscle Map Action */}
      <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between border-t border-[#181c21]/80">
        <div className="flex items-center gap-5 sm:gap-8">
          {/* Duração */}
          <div 
            onClick={onTogglePauseTimer} 
            className="flex flex-col cursor-pointer group"
            title={isTimerPaused ? 'Retomar cronômetro' : 'Pausar cronômetro'}
          >
            <span className="text-[10px] font-semibold tracking-wider text-[#8c90a1] uppercase">
              Duração
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0066ff] group-hover:text-[#38bdf8] tabular-nums transition-colors flex items-center gap-1">
              {formatDurationDisplay(seconds)}
              {isTimerPaused && (
                <span className="text-[10px] text-[#ffb59d] font-normal">(Pausado)</span>
              )}
            </span>
          </div>

          {/* Volume */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-[#8c90a1] uppercase">
              Volume
            </span>
            <span className="text-sm sm:text-base font-bold text-white tabular-nums">
              {totalVolume.toLocaleString()} kg
            </span>
          </div>

          {/* Séries */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-[#8c90a1] uppercase">
              Séries
            </span>
            <span className="text-sm sm:text-base font-bold text-white tabular-nums">
              {totalCompletedSets}
            </span>
          </div>
        </div>

        {/* Mini Preview Visual do Muscle Map (Clicável, Frente e Costas com Highlights em Azul SOMMA) */}
        {onOpenMuscleDistribution && (
          <MiniMuscleMapButton
            values={muscleValues}
            onClick={onOpenMuscleDistribution}
          />
        )}
      </div>

      {/* Modal / Dialog de Renomear Treino */}
      {isRenameOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-[#14181f] border border-[#262a30] rounded-t-3xl sm:rounded-2xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#262a30]/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Renomear Treino</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRenameOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8c90a1]">Nome da sessão</label>
              <input
                type="text"
                value={newNameInput}
                onChange={(e) => setNewNameInput(e.target.value)}
                placeholder="Ex: Treino A - Peito e Tríceps"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newNameInput.trim()) {
                    handleSaveRename();
                  } else if (e.key === 'Escape') {
                    setIsRenameOpen(false);
                  }
                }}
                className="w-full h-11 px-3.5 rounded-xl bg-[#101419] border border-[#262a30] text-white text-sm placeholder-[#8c90a1] focus:border-[#0066ff] outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRenameOpen(false)}
                className="h-10 px-4 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-xs font-semibold text-[#8c90a1] hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newNameInput.trim()}
                onClick={handleSaveRename}
                className="h-10 px-5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white shadow-md shadow-[#0066ff]/25 transition-all cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
