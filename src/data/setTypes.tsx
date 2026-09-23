import React from 'react';
import {
  Flame,
  CircleDot,
  ArrowDownToLine,
  Zap,
  AlertTriangle,
  PauseCircle,
  Infinity as InfinityIcon
} from 'lucide-react';
import { SetTypeKey, SetTypeConfig } from '../types';

export const SET_TYPES: Record<SetTypeKey, SetTypeConfig> = {
  warmup: {
    id: 'warmup',
    name: 'Aquecimento',
    label: 'Aquecimento',
    shortLabel: 'Aquec.',
    description: 'Série preparatória com carga reduzida para preparar articulações e movimento.',
    symbol: '🔥',
    color: '#ff8400',
    badgeBg: 'bg-[#ff8400]/15',
    badgeBorder: 'border-[#ff8400]/40',
    badgeText: 'text-[#ffb59d]'
  },
  working: {
    id: 'working',
    name: 'Série de Trabalho',
    label: 'Trabalho',
    shortLabel: 'Trabalho',
    description: 'Série principal do exercício com intensidade alvo planejada.',
    symbol: '●',
    color: '#0066ff',
    badgeBg: 'bg-[#0066ff]/15',
    badgeBorder: 'border-[#0066ff]/40',
    badgeText: 'text-[#b3c5ff]'
  },
  dropset: {
    id: 'dropset',
    name: 'Drop Set',
    label: 'Drop Set',
    shortLabel: 'Drop',
    description: 'Reduza a carga imediatamente após a falha/conclusão e continue o exercício sem descanso.',
    symbol: '⬇',
    color: '#c084fc',
    badgeBg: 'bg-[#c084fc]/15',
    badgeBorder: 'border-[#c084fc]/40',
    badgeText: 'text-[#e9d5ff]'
  },
  max_strength: {
    id: 'max_strength',
    name: 'Força Máxima',
    label: 'Força Máxima',
    shortLabel: 'F. Máx',
    description: 'Utilizar a maior carga planejada para o exercício, mantendo a técnica rigorosa.',
    symbol: '⚡',
    color: '#facc15',
    badgeBg: 'bg-[#facc15]/15',
    badgeBorder: 'border-[#facc15]/40',
    badgeText: 'text-[#fef08a]'
  },
  failure: {
    id: 'failure',
    name: 'Falha Técnica',
    label: 'Falha',
    shortLabel: 'Falha',
    description: 'Executar até a falha técnica concêntrica respeitando a segurança motora.',
    symbol: '⚠️',
    color: '#f87171',
    badgeBg: 'bg-[#f87171]/15',
    badgeBorder: 'border-[#f87171]/40',
    badgeText: 'text-[#fca5a5]'
  },
  rest_pause: {
    id: 'rest_pause',
    name: 'Rest-Pause',
    label: 'Rest-Pause',
    shortLabel: 'R-Pause',
    description: 'Pequena pausa de 10 a 20 segundos durante a mesma série antes de continuar repetições.',
    symbol: '⏸',
    color: '#22d3ee',
    badgeBg: 'bg-[#22d3ee]/15',
    badgeBorder: 'border-[#22d3ee]/40',
    badgeText: 'text-[#a5f3fc]'
  },
  amrap: {
    id: 'amrap',
    name: 'AMRAP',
    label: 'AMRAP (Máx Reps)',
    shortLabel: 'AMRAP',
    description: 'Executar o máximo de repetições possível (As Many Reps As Possible) com a carga definida.',
    symbol: '∞',
    color: '#4edea3',
    badgeBg: 'bg-[#4edea3]/15',
    badgeBorder: 'border-[#4edea3]/40',
    badgeText: 'text-[#4edea3]'
  }
};

export const SET_TYPE_LIST: SetTypeConfig[] = Object.values(SET_TYPES);

export function getSetTypeConfig(type?: SetTypeKey): SetTypeConfig {
  if (type && SET_TYPES[type]) {
    return SET_TYPES[type];
  }
  return SET_TYPES.working;
}

/**
 * Render compact Lucide icon for a given set type
 */
export const SetTypeIcon: React.FC<{
  type?: SetTypeKey;
  className?: string;
}> = ({ type, className = 'w-3.5 h-3.5' }) => {
  const safeType = type || 'working';

  switch (safeType) {
    case 'warmup':
      return <Flame className={`${className} text-[#ff8400]`} />;
    case 'dropset':
      return <ArrowDownToLine className={`${className} text-[#c084fc]`} />;
    case 'max_strength':
      return <Zap className={`${className} text-[#facc15] fill-[#facc15]/30`} />;
    case 'failure':
      return <AlertTriangle className={`${className} text-[#f87171]`} />;
    case 'rest_pause':
      return <PauseCircle className={`${className} text-[#22d3ee]`} />;
    case 'amrap':
      return <InfinityIcon className={`${className} text-[#4edea3]`} />;
    case 'working':
    default:
      return <CircleDot className={`${className} text-[#0066ff]`} />;
  }
};
