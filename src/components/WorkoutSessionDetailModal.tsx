import React, { useState } from 'react';
import { X, Calendar, Clock, Dumbbell, Award, Share2, Instagram, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { WorkoutSessionRecord, Routine } from '../types';
import { ExportCardModal, WorkoutExportData } from './ExportCardModal';
import { getSetTypeConfig, SetTypeIcon } from '../data/setTypes';
import { useScrollLock } from '../hooks/useScrollLock';

interface WorkoutSessionDetailModalProps {
  session: WorkoutSessionRecord | null;
  onClose: () => void;
  onRepeatWorkout?: (session: WorkoutSessionRecord) => void;
}

export const WorkoutSessionDetailModal: React.FC<WorkoutSessionDetailModalProps> = ({
  session,
  onClose,
  onRepeatWorkout
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  useScrollLock(!!session);

  if (!session) return null;

  const exportPayload: WorkoutExportData = {
    title: session.routineName,
    duration: session.durationFormatted,
    volume: `${session.totalVolume.toLocaleString()} kg`,
    exercisesCount: session.totalExercises,
    completedSets: session.totalCompletedSets,
    prsCount: session.prsCount || 0,
    exercisesPreview: session.exercises.slice(0, 3).map((ex) => ({
      name: ex.exerciseName,
      detail: `${ex.sets.filter((s) => s.completed).length} séries concluídas`
    }))
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 overscroll-contain">
      <div className="w-full max-w-[500px] max-h-[90vh] bg-[#101419] border border-[#262a30] rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 overscroll-contain">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4edea3] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Treino Concluído
              </span>
              <span className="text-[#424656] text-xs">•</span>
              <span className="text-xs text-[#8c90a1]">{session.dateDisplay}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5 truncate">{session.routineName}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-[#12171f] border-b border-[#262a30]/60">
          <div className="bg-[#181c21] p-2.5 rounded-xl border border-[#262a30]/70 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c90a1]">Duração</span>
            <span className="text-xs font-black text-white mt-1">{session.durationFormatted}</span>
          </div>

          <div className="bg-[#181c21] p-2.5 rounded-xl border border-[#262a30]/70 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c90a1]">Volume</span>
            <span className="text-xs font-black text-[#4edea3] mt-1 tabular-nums">
              {session.totalVolume.toLocaleString()} kg
            </span>
          </div>

          <div className="bg-[#181c21] p-2.5 rounded-xl border border-[#262a30]/70 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c90a1]">Séries</span>
            <span className="text-xs font-black text-[#b3c5ff] mt-1">{session.totalCompletedSets}</span>
          </div>

          <div className="bg-[#181c21] p-2.5 rounded-xl border border-[#262a30]/70 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c90a1]">Recordes</span>
            <div className="flex items-center gap-1 mt-1">
              <Award className="w-3.5 h-3.5 text-[#ffb59d]" />
              <span className="text-xs font-black text-[#ffb59d]">{session.prsCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Notes if present */}
        {session.notes && (
          <div className="px-5 py-2.5 bg-[#161a20] border-b border-[#262a30]/40 text-xs text-[#8c90a1] italic">
            "{session.notes}"
          </div>
        )}

        {/* Exercises list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {session.exercises.map((exercise, exIndex) => (
            <div
              key={exercise.exerciseId || `ex-${exIndex}`}
              className="bg-[#1c2025] rounded-xl p-3.5 border border-[#262a30] shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#0066ff]/20 text-[#0066ff] text-xs font-black flex items-center justify-center">
                    {exIndex + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{exercise.exerciseName}</h4>
                </div>
                <span className="text-[11px] text-[#8c90a1]">{exercise.muscleGroup}</span>
              </div>

              {/* Professional Note if present */}
              {exercise.professionalNote && (
                <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-[#0066ff]/10 border border-[#0066ff]/20 text-[11px] text-[#c2c6d8] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
                  <span className="italic truncate font-medium">"{exercise.professionalNote}"</span>
                </div>
              )}

              {/* Sets Table */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 gap-1 text-[10px] font-bold text-[#8c90a1] uppercase px-2 py-0.5">
                  <span className="col-span-3 text-center">Tipo / Série</span>
                  <span className="col-span-3 text-center">Alvo</span>
                  <span className="col-span-3 text-center">Realizado</span>
                  <span className="col-span-3 text-center">Status</span>
                </div>

                {exercise.sets.map((set, sIdx) => {
                  const setTypeConfig = getSetTypeConfig(set.type);
                  const isSpecial = set.type && set.type !== 'working';

                  return (
                    <div key={`set-${sIdx}`} className="flex flex-col gap-0.5">
                      <div className="grid grid-cols-12 gap-1 items-center p-1.5 rounded-lg bg-[#14181f] text-xs font-semibold">
                        <div className="col-span-3 flex items-center justify-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold border ${
                              isSpecial
                                ? `${setTypeConfig.badgeBg} ${setTypeConfig.badgeBorder} ${setTypeConfig.badgeText}`
                                : 'bg-[#1c2025] border-[#262a30] text-[#c2c6d8]'
                            }`}
                            title={setTypeConfig.name}
                          >
                            <SetTypeIcon type={set.type} className="w-3 h-3" />
                            <span>{set.setNumber}</span>
                          </span>
                        </div>

                        <div className="col-span-3 text-center text-[#8c90a1] text-[11px] tabular-nums truncate">
                          {set.targetWeight || set.targetReps ? (
                            <span>
                              {set.targetWeight ? `${set.targetWeight}k` : ''}
                              {set.targetReps ? ` × ${set.targetReps}` : ''}
                            </span>
                          ) : set.prevWeight ? (
                            <span>{set.prevWeight}k × {set.prevReps}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>

                        <div className="col-span-3 text-center font-bold text-white tabular-nums">
                          {set.weight}k × {set.reps}
                        </div>

                        <div className="col-span-3 flex items-center justify-center gap-1">
                          {set.isPr ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#ffb59d]/20 text-[#ffb59d] border border-[#ffb59d]/30">
                              PR
                            </span>
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#181c21] border-t border-[#262a30] flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex-1 h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#ffb59d]" />
            <span>Exportar Imagem</span>
          </button>

          {onRepeatWorkout && (
            <button
              type="button"
              onClick={() => {
                onRepeatWorkout(session);
                onClose();
              }}
              className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Treinar Novamente</span>
            </button>
          )}
        </div>

      </div>

      {showExportModal && (
        <ExportCardModal
          workoutData={exportPayload}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
