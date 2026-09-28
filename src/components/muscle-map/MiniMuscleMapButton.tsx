import React from 'react';
import { MuscleMap } from '@musclemap/react';
import type { MuscleMapValues } from '@musclemap/core';

export interface MiniMuscleMapButtonProps {
  values?: MuscleMapValues;
  onClick?: () => void;
  className?: string;
}

/**
 * MiniMuscleMapButton
 * 
 * Botão compacto e interativo que renderiza uma miniatura do mapa corporal (frente e costas)
 * com ativações musculares em azul SOMMA em tempo real.
 * 
 * Dimensões compactas: ~52px de largura por ~36px de altura.
 * Ao clicar, abre o modal de Distribuição Muscular.
 */
export const MiniMuscleMapButton: React.FC<MiniMuscleMapButtonProps> = ({
  values = {},
  onClick,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir distribuição muscular"
      title="Ver distribuição muscular do treino"
      className={`relative w-[52px] h-[36px] rounded-xl bg-[#14181f] hover:bg-[#1c222b] active:scale-95 border border-[#262a30] hover:border-[#0066ff]/60 flex items-center justify-center overflow-hidden transition-all cursor-pointer group shrink-0 ${className}`}
    >
      {/* Container da miniatura muscular com eventos de ponteiro desativados para o botão responder uniformemente */}
      <div className="pointer-events-none select-none flex items-center justify-center [&_div]:!gap-1 scale-[0.95]">
        <MuscleMap
          values={values}
          view="BOTH"
          sex="MALE"
          monochromeColor="#0066ff"
          monochromeBaseColor="#22272e"
          glow={true}
          showLegend={false}
          tooltipFields={[]}
          figureWidth={20}
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    </button>
  );
};
