import React, { useState } from 'react';
import { Plus, Scale, Ruler } from 'lucide-react';
import { BodyMeasurement, WeightLog } from './types';

interface MeasurementsEvolutionTabProps {
  measurements: BodyMeasurement[];
  weightHistory: WeightLog[];
  onOpenLogWeight: () => void;
}

export const MeasurementsEvolutionTab: React.FC<MeasurementsEvolutionTabProps> = ({
  measurements,
  weightHistory,
  onOpenLogWeight
}) => {
  const [measurementFilter, setMeasurementFilter] = useState<'todos' | 'superior' | 'tronco' | 'inferior'>('todos');

  const filteredMeasurements = measurements.filter((m) => {
    if (measurementFilter === 'todos') return true;
    return m.region === measurementFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Main Weight & Body Composition Card */}
      <div className="bg-gradient-to-br from-[#1c2025] via-[#181c21] to-[#12161c] rounded-2xl p-5 border border-[#262a30] shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#0066ff] uppercase tracking-wider">
              Composição Corporal & Biometria
            </span>
            <h2 className="text-base font-extrabold text-white mt-0.5">
              Balanço Atual de Peso & Gordura
            </h2>
            <span className="text-xs text-[#8c90a1]">
              Última aferição: 24 de Outubro • Protocolo 7 Dobras & Balança Digital
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenLogWeight}
            className="h-8 px-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Atualizar Peso</span>
          </button>
        </div>

        {/* Key Body Metrix Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-[#101419] p-3 rounded-xl border border-[#262a30] flex flex-col justify-between">
            <span className="text-[10px] text-[#8c90a1] uppercase font-bold">Peso Corporal</span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-white">{weightHistory[0]?.weight}</span>
              <span className="text-xs text-[#8c90a1] ml-1">kg</span>
            </div>
            <span className="text-[10px] text-[#4edea3] font-bold mt-1">-1.6 kg (últimos 30d)</span>
          </div>

          <div className="bg-[#101419] p-3 rounded-xl border border-[#262a30] flex flex-col justify-between">
            <span className="text-[10px] text-[#8c90a1] uppercase font-bold">Gordura (BF%)</span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-[#4edea3]">
                {weightHistory[0]?.bodyFatPercentage}%
              </span>
            </div>
            <span className="text-[10px] text-[#4edea3] font-bold mt-1">-1.2% gordura</span>
          </div>

          <div className="bg-[#101419] p-3 rounded-xl border border-[#262a30] flex flex-col justify-between">
            <span className="text-[10px] text-[#8c90a1] uppercase font-bold">Massa Magra</span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-[#b3c5ff]">70.2</span>
              <span className="text-xs text-[#8c90a1] ml-1">kg</span>
            </div>
            <span className="text-[10px] text-[#4edea3] font-bold mt-1">+1.4 kg massa</span>
          </div>

          <div className="bg-[#101419] p-3 rounded-xl border border-[#262a30] flex flex-col justify-between">
            <span className="text-[10px] text-[#8c90a1] uppercase font-bold">Meta do Ciclo</span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-white">85.0</span>
              <span className="text-xs text-[#8c90a1] ml-1">kg</span>
            </div>
            <span className="text-[10px] text-[#b3c5ff] font-bold mt-1">Superávit Limpo</span>
          </div>
        </div>
      </div>

      {/* Weight Progression Timeline */}
      <div className="bg-[#1c2025] rounded-2xl p-4 md:p-5 border border-[#262a30] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0066ff]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Histórico de Pesagens Semanal
            </h3>
          </div>
          <span className="text-xs text-[#8c90a1]">{weightHistory.length} registros</span>
        </div>

        <div className="w-full bg-[#181c21] rounded-xl overflow-hidden border border-[#262a30]/70">
          <div className="grid grid-cols-4 px-3.5 py-2 bg-[#14181f] text-[#8c90a1] text-[11px] font-bold">
            <span>DATA</span>
            <span className="text-center">PESO (KG)</span>
            <span className="text-center">BF (%)</span>
            <span className="text-right">OBSERVAÇÃO</span>
          </div>

          {weightHistory.map((w, index) => (
            <div
              key={w.id}
              className={`grid grid-cols-4 px-3.5 py-2.5 items-center text-xs border-b border-[#262a30]/40 last:border-none ${
                index === 0 ? 'bg-[#0066ff]/10 font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-1.5">
                {index === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>}
                <span className="text-white">{w.date}</span>
              </div>
              <span className="text-center font-bold text-white">{w.weight.toFixed(1)} kg</span>
              <span className="text-center text-[#4edea3] font-bold">{w.bodyFatPercentage}%</span>
              <span className="text-right text-[11px] text-[#8c90a1] truncate">{w.note || 'Ok'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body Measurements Section */}
      <div className="bg-[#1c2025] rounded-2xl p-4 md:p-5 border border-[#262a30] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#0066ff]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Circunferências Corporais (cm)
              </h3>
            </div>
            <span className="text-xs text-[#8c90a1]">
              Medições organizadas por regiões anatômicas e variação
            </span>
          </div>

          {/* Filter by Anatomical Region */}
          <div className="flex items-center gap-1.5 bg-[#181c21] p-1 rounded-xl border border-[#262a30]">
            <button
              type="button"
              onClick={() => setMeasurementFilter('todos')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                measurementFilter === 'todos' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1]'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setMeasurementFilter('superior')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                measurementFilter === 'superior' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1]'
              }`}
            >
              Superiores
            </button>
            <button
              type="button"
              onClick={() => setMeasurementFilter('tronco')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                measurementFilter === 'tronco' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1]'
              }`}
            >
              Tronco
            </button>
            <button
              type="button"
              onClick={() => setMeasurementFilter('inferior')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                measurementFilter === 'inferior' ? 'bg-[#0066ff] text-white' : 'text-[#8c90a1]'
              }`}
            >
              Inferiores
            </button>
          </div>
        </div>

        {/* Table of Measurements */}
        <div className="w-full bg-[#181c21] rounded-xl overflow-hidden border border-[#262a30]/80">
          <div className="grid grid-cols-4 px-3.5 py-2.5 bg-[#14181f] text-[#8c90a1] text-[11px] font-bold">
            <span>REGIÃO / MEMBRO</span>
            <span className="text-center">ATUAL</span>
            <span className="text-center">ANTERIOR</span>
            <span className="text-right">VARIAÇÃO</span>
          </div>

          <div className="divide-y divide-[#262a30]/40 text-xs">
            {filteredMeasurements.map((m) => {
              const isWaist = m.name.toLowerCase().includes('cintura');
              // For waist, negative is good (fat loss). For arms/chest/legs, positive is muscle gain.
              const isFavorable = isWaist ? m.deltaCm < 0 : m.deltaCm > 0;

              return (
                <div
                  key={m.id}
                  className="grid grid-cols-4 px-3.5 py-3 items-center hover:bg-[#20252d] transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="text-[10px] text-[#8c90a1]">{m.regionLabel} • {m.lastUpdated}</span>
                  </div>

                  <span className="text-center font-extrabold text-white text-sm">
                    {m.currentCm.toFixed(1)} cm
                  </span>

                  <span className="text-center text-[#8c90a1]">
                    {m.previousCm.toFixed(1)} cm
                  </span>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-extrabold px-2 py-0.5 rounded ${
                      isFavorable
                        ? 'bg-[#00a572]/15 text-[#4edea3]'
                        : m.deltaCm === 0
                        ? 'bg-[#262a30] text-[#c2c6d8]'
                        : 'bg-[#ffb59d]/15 text-[#ffb59d]'
                    }`}>
                      {m.deltaCm > 0 ? `+${m.deltaCm.toFixed(1)} cm` : `${m.deltaCm.toFixed(1)} cm`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
