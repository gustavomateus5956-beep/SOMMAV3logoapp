import React from 'react';
import { Dumbbell, Ruler, History, TrendingUp } from 'lucide-react';
import { PageHeader } from '../PageHeader';

export type EvolutionTabType = 'cargas' | 'medidas' | 'historico';

interface EvolutionHeaderProps {
  activeTab: EvolutionTabType;
  onSelectTab: (tab: EvolutionTabType) => void;
  onBack?: () => void;
}

export const EvolutionHeader: React.FC<EvolutionHeaderProps> = ({
  activeTab,
  onSelectTab,
  onBack
}) => {
  return (
    <>
      {/* Standardized Page Header */}
      <PageHeader
        category="MÉTRICAS & PROGRESSÃO"
        title="Evolução"
        subtitle="Histórico de cargas, biometria e recordes pessoais"
        onBack={onBack}
        badge={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c2025] border border-[#262a30]">
            <TrendingUp className="w-4 h-4 text-[#ffb59d]" />
            <span className="text-xs font-bold text-white">Progresso</span>
          </div>
        }
      />

      {/* Segmented Control Tabs: Strictly ONE concise word per option as requested */}
      <div className="w-full bg-[#181c21] p-1.5 rounded-2xl flex items-center border border-[#262a30] shadow-sm">
        <button
          type="button"
          onClick={() => onSelectTab('cargas')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'cargas'
              ? 'bg-[#0066ff] text-white shadow-md'
              : 'text-[#8c90a1] hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Cargas</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('medidas')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'medidas'
              ? 'bg-[#0066ff] text-white shadow-md'
              : 'text-[#8c90a1] hover:text-white'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Medidas</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('historico')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'historico'
              ? 'bg-[#0066ff] text-white shadow-md'
              : 'text-[#8c90a1] hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico</span>
        </button>
      </div>
    </>
  );
};
