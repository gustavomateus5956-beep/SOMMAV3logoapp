import React from 'react';
import { X, Dumbbell, Activity, Info } from 'lucide-react';
import type { Exercise } from '../../types';
import { calculateWorkoutMuscleScores } from '../../features/muscle-map/sommaMuscleMapAdapter';
import { SommaMuscleMap } from '../muscle-map/SommaMuscleMap';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ActiveWorkoutMuscleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
}

export const ActiveWorkoutMuscleSheet: React.FC<ActiveWorkoutMuscleSheetProps> = ({
  isOpen,
  onClose,
  exercises
}) => {
  useScrollLock(isOpen);

  // O cálculo é reativo: qualquer série marcada/desmarcada atualiza instantaneamente
  const analysis = React.useMemo(() => {
    return calculateWorkoutMuscleScores(exercises);
  }, [exercises]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] bg-[#101419] border border-[#262a30] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250 overscroll-contain">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-extrabold text-white">Distribuição Muscular</h3>
              <span className="text-xs text-[#8c90a1] mt-0.5">
                {analysis.hasCompletedSets
                  ? `${analysis.totalCompletedSets} ${analysis.totalCompletedSets === 1 ? 'série computada' : 'séries computadas'} em tempo real`
                  : exercises.length > 0
                    ? 'Projeção estimada pelos exercícios da ficha'
                    : 'Nenhum exercício adicionado'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar distribuição muscular"
            className="w-9 h-9 rounded-full bg-[#262a30] hover:bg-[#31353b] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          
          {/* 1. Visualizador Corporal (Frente e Costas com Azul SOMMA) */}
          <div className="w-full flex flex-col items-center justify-center pt-1">
            <SommaMuscleMap
              values={analysis.values}
              mode={analysis.mode}
              view="BOTH"
              compact={false}
              figureWidth={150}
            />
          </div>

          {/* 2. Lista de Músculos Trabalhados */}
          {analysis.details.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center px-4 bg-[#14181f] rounded-2xl border border-[#262a30]/60">
              <div className="w-12 h-12 rounded-xl bg-[#181c21] flex items-center justify-center text-[#8c90a1] mb-2.5">
                <Dumbbell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <span className="text-sm font-bold text-white mb-1">
                Nenhum músculo trabalhado ainda.
              </span>
              <p className="text-xs text-[#8c90a1] max-w-xs leading-relaxed">
                Adicione exercícios ao treino e complete séries para acompanhar o mapa de estímulo corporal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8c90a1] pb-1 border-b border-[#262a30]/50 font-semibold">
                <span>Músculo Ativado</span>
                <span>Carga & Volume</span>
              </div>

              <div className="space-y-2.5">
                {analysis.details.map((m) => (
                  <div
                    key={m.group}
                    className="p-3 rounded-2xl bg-[#14181f] border border-[#262a30] hover:border-[#0066ff]/40 transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">
                          {m.label}
                        </span>
                        <span className="text-[11px] text-[#8c90a1] mt-0.5">
                          {analysis.hasCompletedSets ? (
                            m.primarySets > 0 && m.secondarySets > 0 ? (
                              `${m.primarySets} séries principais • ${m.secondarySets} envolvidas`
                            ) : m.primarySets > 0 ? (
                              `${m.primarySets} séries principais`
                            ) : (
                              `${m.secondarySets} séries envolvidas`
                            )
                          ) : (
                            `${m.plannedSets} séries planejadas`
                          )}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-[#38bdf8] text-xs">
                          Carga muscular {m.loadPercentage}%
                        </span>
                        <span className="text-[10px] text-[#8c90a1] font-medium">
                          Score {m.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Barra de Intensidade SOMMA */}
                    <div className="w-full h-2 rounded-full bg-[#1c2025] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0054d6] to-[#0066ff] transition-all duration-300 shadow-sm shadow-[#0066ff]/30"
                        style={{ width: `${Math.max(4, m.loadPercentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nota biomecânica discreta */}
          {analysis.details.length > 0 && (
            <div className="p-3 rounded-xl bg-[#181c21]/80 border border-[#262a30]/80 flex items-start gap-2 text-[11px] text-[#8c90a1]">
              <Info className="w-3.5 h-3.5 text-[#0066ff] shrink-0 mt-0.5" />
              <span>
                A contribuição ponderada atribui peso 1.0 para o músculo primário do exercício e peso 0.5 para os sinergistas/secundários.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#181c21] border-t border-[#262a30] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs sm:text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
