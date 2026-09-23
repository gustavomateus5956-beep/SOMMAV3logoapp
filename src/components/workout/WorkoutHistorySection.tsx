import React from 'react';
import { History, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { WorkoutSessionRecord } from '../../types';

interface WorkoutHistorySectionProps {
  historySessions: WorkoutSessionRecord[];
  onSelectSession: (session: WorkoutSessionRecord) => void;
}

export const WorkoutHistorySection: React.FC<WorkoutHistorySectionProps> = ({
  historySessions,
  onSelectSession
}) => {
  return (
    <section className="flex flex-col gap-3 pt-1">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#0066ff]" />
          <h2 className="text-sm font-bold text-white tracking-tight">Histórico de Treinos</h2>
        </div>
        <span className="text-xs text-[#8c90a1]">{historySessions.length} sessões</span>
      </div>

      {historySessions.length === 0 ? (
        <div className="bg-[#1c2025] p-6 rounded-2xl border border-[#262a30] text-center flex flex-col items-center gap-2">
          <History className="w-8 h-8 text-[#8c90a1]" />
          <span className="text-sm font-bold text-white">Nenhum treino registrado ainda</span>
          <p className="text-xs text-[#8c90a1] max-w-xs">
            Conclua sua primeira sessão para visualizar seu histórico e progressão de volume.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {historySessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession(session)}
              className="w-full bg-[#1c2025] hover:bg-[#262a30] p-3.5 rounded-2xl border border-[#262a30] hover:border-[#31353b] flex items-center justify-between text-left transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#14181f] border border-[#262a30] flex items-center justify-center text-[#4edea3] shrink-0 group-hover:border-[#0066ff]/40 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#4edea3]">
                      {session.dateDisplay}
                    </span>
                    <span className="text-[#424656] text-xs">•</span>
                    <span className="text-xs text-[#8c90a1]">{session.durationFormatted}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate leading-snug mt-0.5">
                    {session.routineName}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-[#8c90a1] mt-0.5">
                    <span>{session.totalExercises} exercícios</span>
                    <span>•</span>
                    <span className="text-[#b3c5ff] font-semibold tabular-nums">
                      {session.totalVolume.toLocaleString()} kg
                    </span>
                    {session.prsCount && session.prsCount > 0 ? (
                      <>
                        <span>•</span>
                        <span className="text-[#ffb59d] font-bold flex items-center gap-0.5">
                          <Award className="w-3 h-3" />
                          {session.prsCount} PR
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#8c90a1] group-hover:text-white transition-colors shrink-0">
                <span className="text-xs font-semibold hidden sm:inline">Ver detalhes</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
