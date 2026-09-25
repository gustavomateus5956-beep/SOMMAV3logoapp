import React from 'react';
import { 
  X, 
  Play, 
  Clock, 
  Dumbbell, 
  ShieldCheck, 
  Timer
} from 'lucide-react';
import { Routine } from '../types';
import { ExerciseMedia } from './exercise/ExerciseMedia';
import { ExerciseGuidanceSection } from './ExerciseGuidanceSection';
import { getSetTypeConfig } from '../data/setTypes';
import { useScrollLock } from '../hooks/useScrollLock';

interface RoutineDetailModalProps {
  routine: Routine | null;
  onClose: () => void;
  onStartRoutine: (routine: Routine) => void;
}

export const RoutineDetailModal: React.FC<RoutineDetailModalProps> = ({
  routine,
  onClose,
  onStartRoutine
}) => {
  useScrollLock(!!routine);

  if (!routine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-end md:items-center p-0 md:p-4 overscroll-contain">
      <div className="w-full max-w-[480px] max-h-[90vh] bg-[#101419] border border-[#262a30] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200 overscroll-contain">
        
        {/* 1. Header Padronizado */}
        <div className="px-5 py-4 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between shrink-0">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff]">
              ESTRUTURA DE TREINO
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white truncate mt-0.5">
              {routine.name}
            </h2>
            <span className="text-xs text-[#8c90a1] truncate">
              {routine.muscleGroups || routine.category || 'Treino Completo'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar visualização de treino"
            className="w-9 h-9 rounded-full bg-[#262a30] hover:bg-[#31353b] text-[#c2c6d8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Banner de Prescrição Profissional se certificado */}
        {routine.isProfessionalCertified && routine.certifiedBy && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-[#0066ff]/15 via-[#181d24] to-[#00a572]/10 border-b border-[#0066ff]/20 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white truncate leading-tight">
                  Montado por {routine.certifiedBy.professionalName}
                </span>
                <span className="text-[10px] text-[#8c90a1] truncate">
                  {routine.certifiedBy.registrationNumber} • {routine.certifiedBy.professionalRole}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-extrabold bg-[#0066ff]/20 text-[#b3c5ff] px-2 py-0.5 rounded-full border border-[#0066ff]/30 shrink-0 ml-2">
              SOMMA PRO
            </span>
          </div>
        )}

        {/* 3. Specs Ribbon (Exercícios, Duração Estimada, Histórico) */}
        <div className="px-5 py-3 bg-[#14181d] border-b border-[#262a30]/60 flex items-center gap-4 text-xs text-[#c2c6d8] shrink-0">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-[#0066ff]" />
            <span className="font-semibold text-white">{routine.exercisesCount} exercícios</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#424656]" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#4edea3]" />
            <span className="font-semibold text-white">~{routine.estimatedMinutes} min</span>
          </div>
          {routine.lastSession && (
            <>
              <div className="w-1 h-1 rounded-full bg-[#424656]" />
              <span className="text-[#8c90a1] truncate">{routine.lastSession}</span>
            </>
          )}
        </div>

        {/* 4. Lista dos Exercícios com Thumbnail Clara e Tabela Moderna de Séries */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar">
          {routine.exercises.map((exercise, index) => {
            const hasSets = exercise.sets && exercise.sets.length > 0;
            const restSeconds = (exercise as any).restTimeSeconds || 90;
            const formattedRest = restSeconds >= 60 
              ? `${Math.floor(restSeconds / 60)}min${restSeconds % 60 ? ` ${restSeconds % 60}s` : ''}`
              : `${restSeconds}s`;

            return (
              <div
                key={exercise.id}
                className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3 shadow-sm"
              >
                {/* Cabeçalho do Exercício com Thumbnail Visível e Destaque */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Miniatura do Exercício Clara e Circular */}
                    <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden bg-[#181c21] border border-[#262a30] flex items-center justify-center shrink-0 shadow-sm">
                      <div className="w-full h-full flex items-center justify-center p-1 pointer-events-none">
                        <ExerciseMedia
                          exercise={exercise}
                          size="sm"
                          forceStaticThumbnail={true}
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0066ff] text-white text-[9px] font-bold flex items-center justify-center shadow">
                        {index + 1}
                      </span>
                    </div>

                    {/* Nome do Exercício + Grupo Muscular */}
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate leading-snug">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#8c90a1] mt-0.5">
                        <span className="truncate">{exercise.muscleGroup}</span>
                        {restSeconds > 0 && (
                          <>
                            <span className="text-[#424656]">•</span>
                            <span className="inline-flex items-center gap-1 text-[#0066ff] text-[11px] font-semibold shrink-0">
                              <Timer className="w-3 h-3" />
                              {formattedRest}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badge de Quantidade de Séries */}
                  <span className="text-xs font-bold text-[#b3c5ff] bg-[#0066ff]/15 px-2.5 py-1 rounded-full border border-[#0066ff]/25 shrink-0">
                    {hasSets ? `${exercise.sets.length} séries` : 'A definir'}
                  </span>
                </div>

                {/* Orientações e Instruções Técnicas (se houver) */}
                <ExerciseGuidanceSection exercise={exercise} />

                {/* Bloco Moderno de Séries: Estilo Tabela Alinhada com Treino Ativo */}
                {hasSets ? (
                  <div className="flex flex-col gap-1.5 pt-1">
                    {/* Header da Tabela */}
                    <div className="grid grid-cols-12 text-[10px] font-bold text-[#8c90a1] uppercase px-2.5 py-1 bg-[#14181d] rounded-lg border border-[#262a30]/50">
                      <span className="col-span-3">SÉRIE</span>
                      <span className="col-span-5 text-center">CARGA ALVO</span>
                      <span className="col-span-4 text-right">REPS</span>
                    </div>

                    {/* Linhas das Séries */}
                    {exercise.sets.map((set, sIdx) => {
                      const setTypeConfig = getSetTypeConfig(set.type);
                      const isSpecial = set.type && set.type !== 'working';

                      let setSymbol = `${set.setNumber || sIdx + 1}`;
                      let symbolBadge = 'text-white bg-[#181c21] border-[#262a30]';

                      if (set.type === 'warmup') {
                        setSymbol = 'W';
                        symbolBadge = 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/30';
                      } else if (set.type === 'failure') {
                        setSymbol = 'F';
                        symbolBadge = 'text-[#ff5c5c] bg-[#ff5c5c]/10 border-[#ff5c5c]/30';
                      } else if (set.type === 'dropset') {
                        setSymbol = 'D';
                        symbolBadge = 'text-[#0066ff] bg-[#0066ff]/10 border-[#0066ff]/30';
                      }

                      const targetWeight = set.targetWeight ?? set.weight ?? 0;
                      const targetReps = set.targetReps ?? set.reps ?? 0;

                      return (
                        <div
                          key={set.id || `set-${sIdx}`}
                          className="grid grid-cols-12 items-center px-2.5 py-2 rounded-lg bg-[#181c21]/70 hover:bg-[#181c21] border border-[#262a30]/40 text-xs transition-colors"
                        >
                          {/* Coluna Série */}
                          <div className="col-span-3 flex items-center gap-1.5 min-w-0">
                            <span className={`w-6 h-6 rounded-md border text-[11px] font-bold flex items-center justify-center tabular-nums shrink-0 ${symbolBadge}`}>
                              {setSymbol}
                            </span>
                            {isSpecial && (
                              <span className="text-[10px] text-[#8c90a1] truncate hidden sm:inline">
                                {setTypeConfig.label}
                              </span>
                            )}
                          </div>

                          {/* Coluna Carga Alvo */}
                          <div className="col-span-5 text-center font-bold text-white tabular-nums">
                            {targetWeight > 0 ? `${targetWeight} kg` : 'Peso corporal'}
                          </div>

                          {/* Coluna Reps */}
                          <div className="col-span-4 text-right font-semibold text-[#b3c5ff] tabular-nums">
                            {targetReps > 0 ? `${targetReps} reps` : 'Até a falha'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#8c90a1] italic p-2.5 rounded-xl bg-[#14181d] border border-[#262a30]/40 text-center">
                    Séries e cargas serão registradas durante a execução.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 5. Rodapé com Botão Principal de Ação */}
        <div className="p-4 sm:p-5 bg-[#181c21] border-t border-[#262a30] flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => {
              onStartRoutine(routine);
              onClose();
            }}
            className="flex-2 h-12 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white shrink-0" />
            <span>Iniciar este treino</span>
          </button>
        </div>
      </div>
    </div>
  );
};
