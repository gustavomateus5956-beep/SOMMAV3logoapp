import React from 'react';
import { 
  Dumbbell, 
  Clock, 
  Play, 
  Eye, 
  CheckCircle2, 
  RotateCcw, 
  TrendingUp 
} from 'lucide-react';
import { Routine, WorkoutSessionRecord } from '../../types';
import { WorkoutSessionStatus } from '../../context/WorkoutContext';

interface WorkoutTodaySectionProps {
  workoutStatus: WorkoutSessionStatus;
  activeSession: {
    workoutName: string;
    muscleGroups: string;
    seconds: number;
  } | null;
  maximizeWorkout: () => void;
  todaySession: WorkoutSessionRecord | undefined;
  todayPlannedRoutine: Routine;
  onStartRoutine: (routine: Routine) => void;
  onViewSessionDetail: (session: WorkoutSessionRecord) => void;
}

export const WorkoutTodaySection: React.FC<WorkoutTodaySectionProps> = ({
  workoutStatus,
  activeSession,
  maximizeWorkout,
  todaySession,
  todayPlannedRoutine,
  onStartRoutine,
  onViewSessionDetail
}) => {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm font-bold text-white tracking-tight uppercase text-[11px] text-[#8c90a1]">
          Treino de Hoje
        </h2>
        {todaySession ? (
          <span className="text-xs text-[#4edea3] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Concluído Hoje
          </span>
        ) : (
          <span className="text-xs text-[#b3c5ff] font-semibold">Programado</span>
        )}
      </div>

      {/* Em Andamento Banner if Minimized */}
      {workoutStatus === 'minimized' && activeSession && (
        <div className="bg-[#1c2025] p-4 md:p-5 rounded-2xl border border-[#0066ff]/50 flex flex-col gap-3.5 shadow-lg shadow-[#0066ff]/10 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0066ff]/20 text-[#79a9ff] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-ping" />
                  EM ANDAMENTO
                </span>
                <span className="text-xs text-[#8c90a1] font-mono">
                  {Math.floor(activeSession.seconds / 60)} min decorridos
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{activeSession.workoutName}</h3>
              <span className="text-xs text-[#8c90a1]">{activeSession.muscleGroups}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/40 flex items-center justify-center text-[#79a9ff]">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>

          <button
            type="button"
            onClick={maximizeWorkout}
            className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retomar Treino em Andamento</span>
          </button>
        </div>
      )}

      {todaySession ? (
        /* Card when today's workout has already been completed */
        <div className="bg-[#1c2025] p-4 md:p-5 rounded-2xl border border-[#00a572]/40 flex flex-col gap-3.5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00a572]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-extrabold uppercase tracking-wider">
                  PAGO HOJE
                </span>
                <span className="text-xs text-[#8c90a1]">{todaySession.dateDisplay}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{todaySession.routineName}</h3>
              <span className="text-xs text-[#8c90a1]">{todaySession.muscleGroups || 'Treino Completo'}</span>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 border border-[#00a572]/40 flex items-center justify-center text-[#4edea3]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-1 border-y border-[#262a30]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8c90a1] font-semibold uppercase">Duração</span>
              <span className="text-sm font-bold text-white">{todaySession.durationFormatted}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8c90a1] font-semibold uppercase">Volume Total</span>
              <span className="text-sm font-bold text-[#4edea3] tabular-nums">
                {todaySession.totalVolume.toLocaleString()} kg
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8c90a1] font-semibold uppercase">Séries</span>
              <span className="text-sm font-bold text-[#b3c5ff]">{todaySession.totalCompletedSets} feitas</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => onViewSessionDetail(todaySession)}
              className="flex-1 h-11 bg-[#262a30] hover:bg-[#31353b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Resumo Completo</span>
            </button>

            <button
              type="button"
              onClick={() => onStartRoutine(todayPlannedRoutine)}
              className="h-11 px-4 bg-[#0066ff]/20 hover:bg-[#0066ff]/30 text-[#b3c5ff] border border-[#0066ff]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Iniciar outro treino hoje"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Treinar Novamente</span>
            </button>
          </div>
        </div>
      ) : (
        /* Card when today's workout has not been started yet */
        <div className="bg-[#1c2025] p-4 md:p-5 rounded-2xl border border-[#262a30] hover:border-[#0066ff]/40 flex flex-col gap-3.5 shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] text-[10px] font-extrabold uppercase tracking-wider">
                  {todayPlannedRoutine.category || 'Treino A'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{todayPlannedRoutine.name}</h3>
              <span className="text-xs text-[#8c90a1]">
                {todayPlannedRoutine.muscleGroups || 'Peitoral, Ombros e Tríceps'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#262a30] text-[#c2c6d8] text-xs font-semibold">
              Hoje
            </span>
          </div>

          <div className="flex items-center gap-4 py-1 border-y border-[#262a30] text-xs text-[#c2c6d8]">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-[#8c90a1]" />
              <span>{todayPlannedRoutine.exercisesCount} exercícios</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#424656]"></div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8c90a1]" />
              <span>~{todayPlannedRoutine.estimatedMinutes} min</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#424656]"></div>
            <div className="flex items-center gap-1 text-[#4edea3]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sobrecarga progressiva</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartRoutine(todayPlannedRoutine)}
            className="w-full h-12 bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>INICIAR TREINO</span>
          </button>
        </div>
      )}
    </section>
  );
};
