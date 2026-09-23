import React from 'react';
import { Plus, Dumbbell, Clock, Play, Eye } from 'lucide-react';
import { Routine } from '../../types';

interface WorkoutRoutinesSectionProps {
  routines: Routine[];
  onOpenNewRoutineModal: () => void;
  onStartRoutine: (routine: Routine) => void;
  onAddExerciseToRoutine: (routine: Routine) => void;
  onViewRoutineDetail: (routine: Routine) => void;
}

export const WorkoutRoutinesSection: React.FC<WorkoutRoutinesSectionProps> = ({
  routines,
  onOpenNewRoutineModal,
  onStartRoutine,
  onAddExerciseToRoutine,
  onViewRoutineDetail
}) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-tight">Seus Treinos</h2>
          <span className="bg-[#262a30] text-[#c2c6d8] px-2 py-0.5 rounded-full text-[11px] font-bold">
            {routines.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenNewRoutineModal}
          className="text-[#0066ff] hover:text-[#b3c5ff] text-xs font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Rotina</span>
        </button>
      </div>

      {/* Routines Stack */}
      <div className="flex flex-col gap-3">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="bg-[#1c2025] p-4 rounded-2xl border border-[#262a30] flex flex-col gap-3 shadow-sm hover:border-[#31353b] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col pr-2 gap-0.5">
                <h3 className="text-sm font-bold text-white leading-snug">{routine.name}</h3>
                <span className="text-xs text-[#8c90a1]">
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

            {/* Action row: Iniciar + Adicionar Exercício + Visualizar */}
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
                className="h-11 px-3.5 bg-[#262a30] hover:bg-[#31353b] text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
