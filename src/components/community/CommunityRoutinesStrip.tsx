import React from 'react';
import { Zap, Clock, Plus } from 'lucide-react';
import { RoutineFlash } from '../../types';

interface CommunityRoutinesStripProps {
  routines: RoutineFlash[];
  onAddRoutine: () => void;
  onViewRoutine: (index: number) => void;
}

export const CommunityRoutinesStrip: React.FC<CommunityRoutinesStripProps> = ({
  routines,
  onAddRoutine,
  onViewRoutine
}) => {
  return (
    <section aria-label="Rotinas dos Atletas (24 horas)" className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-white tracking-wider uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#0066ff] fill-[#0066ff]" /> Rotinas
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] border border-[#0066ff]/40 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Duração de 24h
          </span>
        </div>
        <span className="text-[11px] text-[#8c90a1] font-medium hidden sm:inline">
          Acompanhe o que os atletas treinaram hoje
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2.5 pt-1 no-scrollbar select-none">
        {/* Add Routine Button for User */}
        <button
          type="button"
          onClick={onAddRoutine}
          className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
        >
          <div className="relative w-[70px] h-[86px] rounded-2xl p-[2px] bg-gradient-to-b from-[#262a30] to-[#181c21] group-hover:border-[#0066ff] border border-dashed border-[#3a404d] transition-all flex flex-col items-center justify-center gap-1">
            <div className="w-9 h-9 rounded-full bg-[#0066ff] text-white flex items-center justify-center shadow-md">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-[#dae1ff] text-center leading-tight">
              Postar<br/>Rotina
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#8c90a1] text-center">Sua Rotina</span>
        </button>

        {/* Athletes 24h Routines with athletic cards & countdown timers */}
        {routines.map((routine, index) => (
          <button
            key={routine.id}
            type="button"
            onClick={() => onViewRoutine(index)}
            className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer text-left"
          >
            <div
              className={`relative w-[70px] h-[86px] rounded-2xl p-[2px] transition-all transform group-hover:scale-105 overflow-hidden shadow-md ${
                routine.hasUnseen
                  ? 'ring-2 ring-[#0066ff] ring-offset-2 ring-offset-[#101419]'
                  : 'border border-[#262a30]'
              }`}
            >
              {/* Background image preview */}
              <img
                src={routine.imageUrl}
                alt={routine.caption}
                className="w-full h-full object-cover rounded-xl filter brightness-[0.75] group-hover:brightness-90 transition-all"
              />
              
              {/* 24h expiration badge in top right */}
              <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[8px] font-black text-[#4edea3] flex items-center gap-0.5">
                <Clock className="w-2 h-2" />
                <span>{routine.expiresInHours}h</span>
              </div>

              {/* Athlete small avatar in bottom left */}
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                <img
                  src={routine.authorAvatar}
                  alt={routine.authorName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/40"
                />
                {routine.statBadge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb59d]" />
                )}
              </div>
            </div>

            {/* Caption & Name */}
            <div className="flex flex-col items-center max-w-[70px]">
              <span className="text-[11px] font-bold text-white truncate w-full text-center">
                {routine.authorName.split(' ')[0]}
              </span>
              <span className="text-[9px] font-medium text-[#8c90a1] truncate w-full text-center">
                {routine.workoutHighlight?.split('•')[0] || routine.targetMuscle || 'Treino'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
