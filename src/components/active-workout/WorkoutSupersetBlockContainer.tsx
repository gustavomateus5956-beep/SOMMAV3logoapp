import React from 'react';
import { Layers, ArrowUpDown, Unlink, ArrowDown, Timer, Settings2 } from 'lucide-react';

export interface WorkoutSupersetBlockContainerProps {
  blockId: string;
  blockName: string;
  transitionRestSeconds: number;
  blockRestSeconds: number;
  onOpenRestConfig: () => void;
  onSwapExercises: () => void;
  onRemoveBlock: () => void;
  exerciseCardA1: React.ReactNode;
  exerciseCardA2: React.ReactNode;
}

export const WorkoutSupersetBlockContainer: React.FC<WorkoutSupersetBlockContainerProps> = ({
  blockName,
  transitionRestSeconds,
  blockRestSeconds,
  onOpenRestConfig,
  onSwapExercises,
  onRemoveBlock,
  exerciseCardA1,
  exerciseCardA2
}) => {
  return (
    <div className="relative rounded-3xl bg-[#12161c] border border-[#0066ff]/35 shadow-lg shadow-[#0066ff]/5 p-3 sm:p-4 space-y-3.5 transition-all">
      {/* 1. Header do Bloco */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066ff]/15 border border-[#0066ff]/30 text-[#38bdf8]">
            <Layers className="w-3.5 h-3.5 text-[#0066ff]" />
            <span className="text-xs font-black tracking-wider uppercase">
              {blockName}
            </span>
          </div>
          <span className="text-[11px] text-[#8c90a1] hidden sm:inline">
            Bi-set combinado
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Inverter A1 <-> A2 */}
          <button
            type="button"
            onClick={onSwapExercises}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181c21] hover:bg-[#20252c] border border-[#262a30] hover:border-[#0066ff]/40 text-[#8c90a1] hover:text-white text-[11px] font-bold transition-all cursor-pointer"
            title="Inverter ordem dos exercícios (A1 ↔ A2)"
            aria-label="Inverter ordem dos exercícios no Superset"
          >
            <ArrowUpDown className="w-3 h-3 text-[#38bdf8]" />
            <span>A1 ↔ A2</span>
          </button>

          {/* Desagrupar / Remover do bloco */}
          <button
            type="button"
            onClick={onRemoveBlock}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181c21] hover:bg-[#2d1518]/40 border border-[#262a30] hover:border-[#ef4444]/40 text-[#8c90a1] hover:text-[#ef4444] text-[11px] font-bold transition-all cursor-pointer"
            title="Desfazer agrupamento do Superset"
            aria-label="Desagrupar Superset"
          >
            <Unlink className="w-3 h-3" />
            <span className="hidden sm:inline">Desagrupar</span>
          </button>
        </div>
      </div>

      {/* 2. Card do Exercício A1 */}
      <div className="space-y-1">
        {exerciseCardA1}
      </div>

      {/* 3. Conexão Visual A1 -> A2 (Transição) */}
      <div className="flex items-center justify-center py-0.5">
        <button
          type="button"
          onClick={onOpenRestConfig}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181c21] hover:bg-[#1e232b] border border-[#262a30] hover:border-[#0066ff]/50 text-xs shadow-xs transition-all cursor-pointer group"
          title="Clique para configurar o tempo de transição entre exercícios"
        >
          <ArrowDown className="w-3.5 h-3.5 text-[#0066ff] group-hover:translate-y-0.5 transition-transform" />
          <span className="text-[#8c90a1] text-[11px]">Entre A1 e A2:</span>
          <span className="font-mono font-bold text-white text-[11px] group-hover:text-[#38bdf8] transition-colors">
            {transitionRestSeconds === 0 ? 'Sem descanso' : `${transitionRestSeconds}s`}
          </span>
        </button>
      </div>

      {/* 4. Card do Exercício A2 */}
      <div className="space-y-1">
        {exerciseCardA2}
      </div>

      {/* 5. Footer do Bloco: Descanso após o bloco */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#101419]/90 border border-[#262a30] text-xs">
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 text-[#ff8400]" />
          <span className="text-[#8c90a1] text-[11px] sm:text-xs">Descanso após bloco:</span>
          <span className="font-mono font-bold text-white text-xs sm:text-sm">
            {blockRestSeconds}s
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenRestConfig}
          className="flex items-center gap-1 text-[11px] font-bold text-[#0066ff] hover:text-[#38bdf8] px-2.5 py-1 rounded-lg hover:bg-[#181c21] transition-colors cursor-pointer"
        >
          <Settings2 className="w-3 h-3" />
          <span>Ajustar descanso</span>
        </button>
      </div>
    </div>
  );
};
