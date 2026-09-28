import React from 'react';
import { Timer, Play, Pause, FastForward } from 'lucide-react';

interface ActiveWorkoutRestBottomBarProps {
  remainingSeconds: number | null;
  totalSeconds: number | null;
  isPaused: boolean;
  onAddSeconds: (delta: number) => void;
  onTogglePause: () => void;
  onSkip: () => void;
}

/**
 * Formata segundos em MM:SS
 */
function formatTime(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const ActiveWorkoutRestBottomBar: React.FC<ActiveWorkoutRestBottomBarProps> = ({
  remainingSeconds,
  totalSeconds,
  isPaused,
  onAddSeconds,
  onTogglePause,
  onSkip
}) => {
  if (remainingSeconds === null || remainingSeconds <= 0) {
    return null;
  }

  const effectiveTotal = Math.max(1, totalSeconds ?? remainingSeconds);
  const rawPercentage = (remainingSeconds / effectiveTotal) * 100;
  const percentage = Math.min(100, Math.max(0, rawPercentage));

  return (
    <div
      className="shrink-0 bg-[#101419]/95 backdrop-blur-md border-t border-[#262a30] shadow-[0_-8px_24px_rgba(0,0,0,0.6)] z-30 select-none animate-in slide-in-from-bottom duration-250"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Barra de Progresso Visual no Topo do Componente (Diminui progressivamente) */}
      <div className="w-full h-1 bg-[#1a2028] overflow-hidden relative">
        <div
          className={`h-full bg-[#0066ff] shadow-[0_0_10px_rgba(0,102,255,0.7)] ${
            isPaused ? '' : 'transition-[width] duration-1000 ease-linear'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Conteúdo Principal: Informações de Descanso e Controles Compactos */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Esquerda: Rótulo e Contador Regressivo */}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c90a1] flex items-center gap-1.5 leading-none">
            <Timer className={`w-3.5 h-3.5 text-[#0066ff] ${isPaused ? '' : 'animate-spin-slow'}`} />
            <span>Descanso</span>
            {isPaused && (
              <span className="text-[9px] font-semibold text-[#ffb59d] lowercase">(pausado)</span>
            )}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums leading-tight mt-0.5 tracking-tight">
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* Direita: Controles [-15s] [Pausar/Play] [+30s] [Pular] */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Botão -15s */}
          <button
            type="button"
            onClick={() => onAddSeconds(-15)}
            aria-label="Remover 15 segundos"
            title="Remover 15 segundos (-15s)"
            className="h-8 px-2 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 border border-[#262a30] text-[11px] font-bold text-[#8c90a1] hover:text-white transition-all cursor-pointer"
          >
            -15s
          </button>

          {/* Botão Pausar / Retomar */}
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={isPaused ? 'Retomar descanso' : 'Pausar descanso'}
            title={isPaused ? 'Retomar descanso' : 'Pausar descanso'}
            className="w-8 h-8 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 border border-[#262a30] flex items-center justify-center text-white transition-all cursor-pointer"
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-white" />
            )}
          </button>

          {/* Botão +30s */}
          <button
            type="button"
            onClick={() => onAddSeconds(30)}
            aria-label="Adicionar 30 segundos"
            title="Adicionar 30 segundos (+30s)"
            className="h-8 px-2 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 border border-[#262a30] text-[11px] font-bold text-[#38bdf8] hover:text-white transition-all cursor-pointer"
          >
            +30s
          </button>

          {/* Botão Pular */}
          <button
            type="button"
            onClick={onSkip}
            aria-label="Pular descanso"
            title="Pular descanso imediatamente"
            className="h-8 px-3 rounded-lg bg-[#0066ff] hover:bg-[#0054d6] active:scale-95 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-[#0066ff]/20"
          >
            <FastForward className="w-3.5 h-3.5 fill-white" />
            <span>Pular</span>
          </button>
        </div>
      </div>
    </div>
  );
};
