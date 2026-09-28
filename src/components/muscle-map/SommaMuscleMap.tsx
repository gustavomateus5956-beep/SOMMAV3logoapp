import React from 'react';
import { MuscleMap } from '@musclemap/react';
import type { MuscleMapValues, MuscleMapView, MuscleGroup, MuscleMapValue } from '@musclemap/core';
import { SOMMA_MUSCLE_LABELS } from '../../features/muscle-map/sommaMuscleMapAdapter';

export interface SommaMuscleMapProps {
  values: MuscleMapValues;
  mode?: 'planned' | 'live' | 'completed';
  view?: MuscleMapView;
  compact?: boolean;
  figureWidth?: number;
  className?: string;
  showStatusBadge?: boolean;
  emptyMessage?: string;
  onSelectMuscle?: (selection: { group: MuscleGroup; value?: MuscleMapValue }) => void;
}

export const SommaMuscleMap: React.FC<SommaMuscleMapProps> = ({
  values,
  mode = 'live',
  view = 'BOTH',
  compact = false,
  figureWidth,
  className = '',
  showStatusBadge = false,
  emptyMessage = 'Nenhum músculo trabalhado ainda.',
  onSelectMuscle
}) => {
  // Ajuste do tamanho da figura para desktop / mobile / modal
  const resolvedFigureWidth = figureWidth || (compact ? 125 : 155);
  const activeMuscleCount = Object.keys(values).length;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Badge de status contextual se habilitado */}
      {showStatusBadge && (
        <div className="flex items-center gap-1.5 mb-2.5">
          {mode === 'planned' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1c2025] text-[#8c90a1] border border-[#262a30]">
              Estímulo Previsto
            </span>
          )}
          {mode === 'live' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0066ff]/15 text-[#38bdf8] border border-[#0066ff]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse" />
              Ativação em Tempo Real
            </span>
          )}
          {mode === 'completed' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
              Estímulo Registrado
            </span>
          )}
        </div>
      )}

      {/* Visualizador Anatômico MuscleMap com identidade visual SOMMA+ */}
      <div className="relative flex items-center justify-center p-2 rounded-2xl bg-[#14181f]/40 border border-[#262a30]/50 shadow-inner">
        <MuscleMap
          values={values}
          view={view}
          sex="MALE"
          monochromeColor="#0066ff" // Azul institucional SOMMA+
          monochromeBaseColor="#22272e" // Cinza escuro profundo para corpo em repouso
          glow={true}
          showLegend={false} // Oculta legenda padrão externa em favor da barra nativa SOMMA
          labels={SOMMA_MUSCLE_LABELS}
          figureWidth={resolvedFigureWidth}
          onSelectMuscle={onSelectMuscle}
          className="mx-auto"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>

      {/* Mensagem para estado vazio se não houver músculos ativados */}
      {activeMuscleCount === 0 && (
        <div className="mt-3 text-center">
          <span className="text-xs font-semibold text-[#8c90a1]">
            {emptyMessage}
          </span>
        </div>
      )}
    </div>
  );
};
