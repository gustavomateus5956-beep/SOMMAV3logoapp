import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { LoadProgressionItem } from './types';

interface StrengthEvolutionTabProps {
  progressionList: LoadProgressionItem[];
  selectedExerciseId: string;
  onSelectExercise: (id: string) => void;
  onOpenLogPr: (exerciseId: string) => void;
}

export const StrengthEvolutionTab: React.FC<StrengthEvolutionTabProps> = ({
  progressionList,
  selectedExerciseId,
  onSelectExercise,
  onOpenLogPr
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'peito' | 'costas' | 'pernas'>('todos');

  const activeExercise = progressionList.find((p) => p.id === selectedExerciseId) || progressionList[0];

  const filteredProgression = progressionList.filter((item) => {
    if (selectedCategory === 'todos') return true;
    return item.category === selectedCategory;
  });

  return (
    <>
      {/* Summary KPIs: Global Strength & Volume */}
      <div className="bg-gradient-to-br from-[#1c2025] to-[#14181f] rounded-2xl p-4 md:p-5 border border-[#262a30] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0066ff]" />
            <span className="text-sm font-bold text-white">Balanço de Sobrecarga Progressiva</span>
          </div>
          <span className="text-[11px] bg-[#00a572]/20 text-[#4edea3] font-bold px-2.5 py-0.5 rounded-full border border-[#4edea3]/30">
            +18.4% de Carga Média
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#181c21] p-3 rounded-xl border border-[#262a30]/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider">
              Volume Total
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-[#b3c5ff]">42.8t</span>
              <span className="text-[10px] text-[#4edea3] font-bold">+3.2t</span>
            </div>
          </div>

          <div className="bg-[#181c21] p-3 rounded-xl border border-[#262a30]/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider">
              Recordes (PRs)
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-white">12</span>
              <span className="text-[10px] text-[#ffb59d] font-bold">ativos</span>
            </div>
          </div>

          <div className="bg-[#181c21] p-3 rounded-xl border border-[#262a30]/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#8c90a1] uppercase tracking-wider">
              RPE Médio
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-[#4edea3]">8.7</span>
              <span className="text-[10px] text-[#8c90a1]">/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SECTION: ORGANIZED LOAD PROGRESSION TABLE */}
      <div className="bg-[#1c2025] rounded-2xl p-4 md:p-5 border border-[#262a30] shadow-sm flex flex-col gap-4">
        
        {/* Header & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0066ff]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Tabela de Progressão de Carga
              </h2>
            </div>
            <p className="text-xs text-[#8c90a1] mt-0.5">
              Evolução comparativa de cargas máximas (1RM) e séries de trabalho.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenLogPr(selectedExerciseId)}
            className="h-9 px-3.5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Teste (1RM)</span>
          </button>
        </div>

        {/* Muscle Group Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-[#0066ff] text-white'
                : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
            }`}
          >
            Todos os Movimentos
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('peito')}
            className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'peito'
                ? 'bg-[#0066ff] text-white'
                : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
            }`}
          >
            Peitoral & Tríceps
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('pernas')}
            className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'pernas'
                ? 'bg-[#0066ff] text-white'
                : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
            }`}
          >
            Pernas & Quadríceps
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('costas')}
            className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'costas'
                ? 'bg-[#0066ff] text-white'
                : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
            }`}
          >
            Costas & Posteriores
          </button>
        </div>

        {/* Structured Table */}
        <div className="w-full bg-[#181c21] rounded-xl overflow-hidden border border-[#262a30]/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262a30] bg-[#14181f] text-[11px] font-bold text-[#8c90a1]">
                  <th className="py-2.5 px-3.5">EXERCÍCIO</th>
                  <th className="py-2.5 px-3 text-center">CARGA BASE</th>
                  <th className="py-2.5 px-3 text-center">1RM ATUAL (PR)</th>
                  <th className="py-2.5 px-3 text-center">PROGRESSÃO</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262a30]/50 text-xs">
                {filteredProgression.map((item) => {
                  const deltaKg = item.currentPr - item.initialWeight;
                  const deltaPct = Math.round((deltaKg / item.initialWeight) * 100);
                  const isSelected = item.id === selectedExerciseId;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectExercise(item.id)}
                      className={`hover:bg-[#20252d] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#0066ff]/10 border-l-2 border-l-[#0066ff]' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5">
                        <div className="flex flex-col">
                          <span className={`font-bold ${isSelected ? 'text-[#0066ff]' : 'text-white'}`}>
                            {item.exercise}
                          </span>
                          <span className="text-[10px] text-[#8c90a1]">
                            {item.categoryLabel} • {item.workingSet}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center text-[#8c90a1] font-medium">
                        {item.initialWeight} kg
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-extrabold text-white text-sm">
                            {item.currentPr} kg
                          </span>
                          <span className="text-[10px] text-[#8c90a1]">
                            {item.repsAtPr} reps • {item.lastPrDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded-md">
                          <ArrowUpRight className="w-3 h-3" />
                          +{deltaKg} kg (+{deltaPct}%)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block ${
                          item.status === 'teste_favoravel'
                            ? 'bg-[#ffb59d]/15 text-[#ffb59d] border border-[#ffb59d]/30'
                            : item.status === 'progressao'
                            ? 'bg-[#0066ff]/20 text-[#b3c5ff] border border-[#0066ff]/30'
                            : 'bg-[#262a30] text-[#c2c6d8]'
                        }`}>
                          {item.statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection of Selected Exercise */}
        <div className="bg-[#101419] p-4 rounded-xl border border-[#262a30] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#0066ff] tracking-wider">
                Histórico & Curva do Movimento
              </span>
              <h3 className="text-sm font-extrabold text-white">{activeExercise.exercise}</h3>
            </div>

            <div className="flex items-center gap-1.5 bg-[#181c21] border border-[#262a30] px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 text-[#4edea3]" />
              <span className="text-xs font-bold text-[#4edea3]">
                +{activeExercise.currentPr - activeExercise.initialWeight} kg desde o início
              </span>
            </div>
          </div>

          {/* Log Table of Selected Exercise */}
          <div className="w-full bg-[#181c21] rounded-xl overflow-hidden border border-[#262a30]/60">
            <div className="grid grid-cols-5 px-3 py-2 bg-[#14181f] text-[#8c90a1] text-[10px] font-bold">
              <span>DATA</span>
              <span className="text-center">CARGA</span>
              <span className="text-center">REPS</span>
              <span className="text-center">1RM ESTIMADA</span>
              <span className="text-right">RPE</span>
            </div>

            {activeExercise.history.map((h, i) => (
              <div
                key={i}
                className={`grid grid-cols-5 px-3 py-2.5 items-center text-xs border-b border-[#262a30]/30 last:border-none ${
                  i === 0 ? 'bg-[#0066ff]/10 font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>}
                  <span className="text-white">{h.date}</span>
                </div>
                <span className="text-center font-bold text-white">{h.weight} kg</span>
                <span className="text-center text-[#c2c6d8]">{h.reps} reps</span>
                <span className="text-center text-[#b3c5ff] font-semibold">{h.estimated1RM} kg</span>
                <span className="text-right font-extrabold text-[#4edea3]">{h.rpe.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Coach Insight Card */}
      <div className="bg-[#181c21] rounded-2xl p-4 border border-[#262a30] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-white">Diretriz Técnica do Treinador</span>
          <p className="text-xs text-[#8c90a1] leading-relaxed">
            A progressão de carga no {activeExercise.exercise} manteve o RPE estável abaixo de 9.0 nas séries de trabalho. O volume semanal está calibrado para continuidade da hipertrofia miofibrilar.
          </p>
        </div>
      </div>
    </>
  );
};
