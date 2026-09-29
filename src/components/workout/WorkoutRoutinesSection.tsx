import React, { useState } from 'react';
import { Plus, Dumbbell, Clock, Play, Eye, Trash2, Check, X } from 'lucide-react';
import { Routine } from '../../types';

interface WorkoutRoutinesSectionProps {
  routines: Routine[];
  onOpenNewRoutineModal: () => void;
  onStartRoutine: (routine: Routine) => void;
  onAddExerciseToRoutine: (routine: Routine) => void;
  onViewRoutineDetail: (routine: Routine) => void;
  onDeleteRoutine?: (routineId: string) => void;
  maxLimit?: number;
}

export const WorkoutRoutinesSection: React.FC<WorkoutRoutinesSectionProps> = ({
  routines,
  onOpenNewRoutineModal,
  onStartRoutine,
  onAddExerciseToRoutine,
  onViewRoutineDetail,
  onDeleteRoutine,
  maxLimit = 4
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isAtLimit = routines.length >= maxLimit;

  return (
    <section className="flex flex-col gap-3">
      {/* 1. Header com Contador Discreto de Rotinas Free */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">Minhas rotinas</h2>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums transition-colors ${
                isAtLimit
                  ? 'bg-[#ff8400]/20 text-[#ff8400] border border-[#ff8400]/30'
                  : 'bg-[#262a30] text-[#c2c6d8]'
              }`}
            >
              {routines.length}/{maxLimit}
            </span>
          </div>
          <span className="text-[11px] text-[#8c90a1] mt-0.5">
            {routines.length} de {maxLimit} utilizadas
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenNewRoutineModal}
          className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isAtLimit
              ? 'bg-[#262a30] hover:bg-[#31353b] text-[#ff8400] border border-[#ff8400]/30'
              : 'bg-[#0066ff] hover:bg-[#0054d6] text-white'
          }`}
          title={isAtLimit ? 'Limite de 4 rotinas atingido' : 'Criar nova rotina'}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Nova Rotina</span>
        </button>
      </div>

      {/* 2. Empty State ou Stack de Rotinas */}
      {routines.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[#181c21] border border-[#262a30] text-center space-y-2">
          <p className="text-xs text-[#8c90a1]">Você não possui rotinas salvas no momento.</p>
          <button
            type="button"
            onClick={onOpenNewRoutineModal}
            className="text-xs font-bold text-[#0066ff] hover:underline cursor-pointer"
          >
            + Criar sua primeira rotina
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {routines.map((routine) => {
            const isConfirmingDelete = confirmDeleteId === routine.id;

            return (
              <div
                key={routine.id}
                className="bg-[#1c2025] p-4 rounded-2xl border border-[#262a30] flex flex-col gap-3 shadow-sm hover:border-[#31353b] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col pr-2 gap-0.5 min-w-0">
                    <h3 className="text-sm font-bold text-white leading-snug truncate">
                      {routine.name}
                    </h3>
                    <span className="text-xs text-[#8c90a1] truncate">
                      {routine.muscleGroups || routine.category} • Última sessão: {routine.lastSession}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#262a30] text-[11px] font-bold text-[#b3c5ff] shrink-0">
                    {routine.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 py-0.5 text-xs text-[#c2c6d8]">
                  <div className="flex items-center gap-1.5">
                    <Dumbbell className="w-4 h-4 text-[#8c90a1]" />
                    <span>{routine.exercisesCount} exercícios</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#424656]"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#8c90a1]" />
                    <span>~{routine.estimatedMinutes} min</span>
                  </div>
                </div>

                {/* Linha de Ações: Iniciar + Adicionar Exercício + Visualizar + Excluir */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onStartRoutine(routine)}
                    className="flex-1 h-11 bg-[#0066ff] hover:bg-[#0054d6] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Iniciar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddExerciseToRoutine(routine)}
                    className="h-11 px-3 bg-[#262a30] hover:bg-[#31353b] text-[#b3c5ff] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Adicionar exercício da biblioteca a este treino"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exercício</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewRoutineDetail(routine)}
                    aria-label={`Visualizar detalhes de ${routine.name}`}
                    className="h-11 px-3 bg-[#262a30] hover:bg-[#31353b] text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                    title="Ver detalhes da rotina"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Excluir rotina (permite liberar espaço para o limite Free) */}
                  {onDeleteRoutine && (
                    <>
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1 bg-[#2d1518] border border-[#ef4444]/40 rounded-xl px-2 h-11 animate-in fade-in duration-150">
                          <span className="text-[10px] text-[#ef4444] font-bold">Excluir?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteRoutine(routine.id);
                              setConfirmDeleteId(null);
                            }}
                            className="w-7 h-7 rounded-lg bg-[#ef4444] text-white flex items-center justify-center cursor-pointer hover:bg-[#dc2626]"
                            title="Confirmar exclusão"
                            aria-label="Confirmar exclusão da rotina"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="w-7 h-7 rounded-lg bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center cursor-pointer"
                            title="Cancelar"
                            aria-label="Cancelar exclusão"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(routine.id)}
                          className="h-11 px-2.5 rounded-xl bg-[#262a30]/60 hover:bg-[#2d1518]/50 text-[#8c90a1] hover:text-[#ef4444] border border-transparent hover:border-[#ef4444]/30 transition-colors cursor-pointer flex items-center justify-center"
                          title="Excluir rotina"
                          aria-label={`Excluir rotina ${routine.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
