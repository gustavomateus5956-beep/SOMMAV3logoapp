import React from 'react';
import {
  ChevronDown,
  Timer,
  Play,
  Pause
} from 'lucide-react';

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
  formatTimer
}) => {
  // Format duration nicely (e.g. "8s" if < 60, or "MM:SS")
  const formatDurationDisplay = (totalSecs: number) => {
    if (totalSecs < 60) return `${totalSecs}s`;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#101419] border-b border-[#1c2025] shrink-0 z-20">
      {/* Top Bar: [ Recolher ]   TREINO   [ Timer ] [ CONCLUIR ] */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Left: Button Recolher / Voltar */}
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Recolher treino"
          className="w-9 h-9 rounded-full bg-[#181c21] hover:bg-[#262a30] border border-[#262a30] flex items-center justify-center text-[#c2c6d8] hover:text-white transition-colors cursor-pointer"
          title="Minimizar treino para segundo plano"
        >
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center: Workout Title (Discreet / Clean) */}
        <div className="flex flex-col items-center max-w-[180px] sm:max-w-[240px]">
          <input
            type="text"
            value={workoutName}
            onChange={(e) => onWorkoutNameChange(e.target.value)}
            className="text-center font-bold text-sm sm:text-base text-white bg-transparent border-none outline-none truncate hover:bg-[#181c21] focus:bg-[#181c21] px-2 py-0.5 rounded transition-all cursor-text"
            title="Clique para editar o nome do treino"
          />
        </div>

        {/* Right: Timer icon + Concluir button */}
        <div className="flex items-center gap-2">
          {onOpenRestSettings && (
            <button
              type="button"
              onClick={onOpenRestSettings}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
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

          <button
            type="button"
            onClick={onConclude}
            className="h-8 sm:h-9 px-4 sm:px-5 rounded-full bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-[#0066ff]/25"
          >
            Concluir
          </button>
        </div>
      </div>

      {/* Horizontal Stats Row: Duração | Volume | Séries | Body Silhouette */}
      <div className="px-5 py-2.5 flex items-center justify-between border-t border-[#181c21]/80">
        <div className="flex items-center gap-6 sm:gap-10">
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

        {/* Minimal Body Silhouette Vector (Front/Back Anatomy Icon) */}
        <div 
          className="w-8 h-8 rounded-lg bg-[#181c21] border border-[#262a30]/80 flex items-center justify-center text-[#8c90a1]"
          title="Mapa de estímulo muscular do treino"
        >
          <svg
            className="w-5 h-5 text-[#8c90a1]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Head */}
            <circle cx="12" cy="4" r="2" />
            {/* Torso & Arms */}
            <path d="M9 7.5h6l1.5 6-1.5.5-1-4h-4l-1 4-1.5-.5 1.5-6z" />
            {/* Legs */}
            <path d="M10 14v7h1.5v-5h1v5H14v-7" />
          </svg>
        </div>
      </div>

      {/* Floating Rest Countdown Bar (when rest is active) */}
      {restSeconds !== null && (
        <div className="bg-[#0066ff]/15 border-t border-b border-[#0066ff]/35 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#0066ff] animate-spin" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#b3c5ff]">
                Descanso em andamento
              </span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-white tabular-nums leading-none">
                {formatTimer(restSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onAddRestSeconds(30)}
              className="px-2 py-1 bg-[#181c21] hover:bg-[#262a30] rounded-lg text-[11px] font-bold text-[#b3c5ff] cursor-pointer border border-[#262a30]"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={() => onAddRestSeconds(-15)}
              className="px-2 py-1 bg-[#181c21] hover:bg-[#262a30] rounded-lg text-[11px] font-bold text-[#8c90a1] cursor-pointer border border-[#262a30]"
            >
              -15s
            </button>
            <button
              type="button"
              onClick={onTogglePauseRest}
              className="p-1.5 bg-[#181c21] hover:bg-[#262a30] rounded-lg text-white cursor-pointer border border-[#262a30]"
            >
              {isRestPaused ? (
                <Play className="w-3.5 h-3.5 fill-white" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onSkipRest}
              className="px-2.5 py-1 bg-[#0066ff] hover:bg-[#0054d6] text-white rounded-lg text-[11px] font-bold cursor-pointer"
            >
              Pular
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
