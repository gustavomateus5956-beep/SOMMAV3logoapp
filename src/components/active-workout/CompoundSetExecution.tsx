import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Minus,
  Plus,
  Clock,
  Flame,
  AlertTriangle,
  Timer,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import type { ExerciseSet, Exercise, Routine } from '../../types';
import type { SetPerformanceSegment } from '../../features/workout-engine/contracts';
import {
  prescribeCompoundStages,
  segmentDrafts,
  recordCompoundPerformance
} from '../../features/workout-engine/compoundSets';
import {
  requiredSegmentKinds,
  requiredSegmentsPerformed,
  segmentLabels,
  setMetrics,
  setExecutionState,
  orderedSegments,
  segmentWasPerformed
} from '../../features/workout-engine/setMetrics';
import { MethodSummary, getMethodSummary } from './MethodSummary';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface CompoundSetExecutionProps {
  set: ExerciseSet;
  exercise?: Exercise;
  routine?: Routine | null;
  onSave: (set: ExerciseSet) => void;
  onClose: () => void;
}

export function CompoundSetExecution({
  set,
  exercise,
  routine,
  onSave,
  onClose
}: CompoundSetExecutionProps) {
  useScrollLock(true);

  // If set has compound method but no methodConfig yet, automatically prescribe standard defaults
  const [draft, setDraft] = useState<ExerciseSet>(() => {
    const planned = requiredSegmentKinds(set.prescription!);
    if (!planned) {
      try {
        const isRestPause = set.prescription?.method === 'rest_pause' || set.type === 'rest_pause';
        return prescribeCompoundStages(set, 2, isRestPause ? 15 : undefined);
      } catch {
        return set;
      }
    }
    return set;
  });

  // Segments initialized from drafts
  const [segments, setSegments] = useState<SetPerformanceSegment[]>(() => {
    try {
      const planned = requiredSegmentKinds(draft.prescription!);
      if (planned) {
        return segmentDrafts(draft);
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [error, setError] = useState<string>('');
  const [showEffortInput, setShowEffortInput] = useState<boolean>(() => {
    return Boolean(draft.prescription?.rir !== undefined && draft.prescription?.rir !== null);
  });

  const methodSummary = useMemo(() => getMethodSummary(draft), [draft]);
  const isDropSet = draft.prescription?.method === 'dropset' || draft.type === 'dropset';
  const isRestPause = draft.prescription?.method === 'rest_pause' || draft.type === 'rest_pause';

  // Planned kinds: ['PRIMARY', 'DROP', 'DROP'] or ['PRIMARY', 'REST_PAUSE', 'REST_PAUSE']
  const plannedKinds = useMemo(() => requiredSegmentKinds(draft.prescription!), [draft]);
  const totalStages = plannedKinds?.length ?? segments.length;

  // Active stage index: the first segment that is not completed
  const currentActiveIndex = useMemo(() => {
    const idx = segments.findIndex((s) => !s.completed);
    return idx === -1 ? Math.max(0, segments.length - 1) : idx;
  }, [segments]);

  // Patching a segment
  const patchSegment = (id: string, updates: Partial<SetPerformanceSegment>) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setError('');
  };

  // Preview performance object
  const previewSet = useMemo(
    () => ({
      ...draft,
      performance: { schemaVersion: 1 as const, completed: false, segments }
    }),
    [draft, segments]
  );

  const metrics = useMemo(() => setMetrics(previewSet), [previewSet]);
  const isAllPerformed = useMemo(
    () => requiredSegmentsPerformed(draft.prescription, previewSet.performance),
    [draft.prescription, previewSet.performance]
  );

  // Status label for student: "Não iniciada", "Em andamento", "Concluída", "Interrompida"
  const studentStatus = useMemo(() => {
    if (draft.performance?.interrupted) return 'Interrompida';
    const state = setExecutionState(previewSet);
    if (state === 'COMPLETED') return 'Concluída';
    if (state === 'PARTIAL' || segments.some((s) => s.completed)) return 'Em andamento';
    return 'Não iniciada';
  }, [draft.performance?.interrupted, previewSet, segments]);

  // Save handler
  const handleFinish = (finish: 'SAVE' | 'COMPLETE' | 'INTERRUPT') => {
    try {
      setError('');
      // If user interrupted and some segment has values filled but wasn't marked completed,
      // we still preserve existing confirmed segments
      const next = recordCompoundPerformance(draft, segments, finish);
      onSave(next);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Erro ao registrar etapas.');
    }
  };

  // Step complete action
  const handleCompleteCurrentStage = (index: number) => {
    const targetSegment = segments[index];
    if (!targetSegment) return;

    if (targetSegment.reps === undefined || targetSegment.reps === null || targetSegment.reps < 0) {
      setError('Informe as repetições realizadas para confirmar a etapa.');
      return;
    }

    patchSegment(targetSegment.id, { completed: true });
  };

  // Step reopen action
  const handleReopenStage = (index: number) => {
    const targetSegment = segments[index];
    if (!targetSegment) return;
    patchSegment(targetSegment.id, { completed: false });
  };

  // Numeric adjust helpers
  const adjustWeight = (segmentId: string, currentWeight: number | undefined, delta: number) => {
    const val = currentWeight !== undefined ? currentWeight : 0;
    const next = Math.max(0, parseFloat((val + delta).toFixed(1)));
    patchSegment(segmentId, { weightKg: next });
  };

  const adjustReps = (segmentId: string, currentReps: number | undefined, delta: number) => {
    const val = currentReps !== undefined ? currentReps : 0;
    const next = Math.max(0, val + delta);
    patchSegment(segmentId, { reps: next });
  };

  const professionalNote = exercise?.professionalNote;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Executar método de treino composto"
    >
      <div
        className="w-full max-w-lg bg-[#101419] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* 1. Header com Resumo Compacto da Prescrição */}
        <div className="px-5 pt-2 pb-3.5 border-b border-[#262a30]/80 bg-[#14181f] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff]">
                  {isDropSet ? 'EXECUÇÃO DE DROP SET' : isRestPause ? 'EXECUÇÃO DE REST-PAUSE' : 'MÉTODO COMPOSTO'}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    studentStatus === 'Concluída'
                      ? 'bg-[#00a572]/20 text-[#4edea3] border-[#00a572]/30'
                      : studentStatus === 'Interrompida'
                      ? 'bg-[#ef4444]/20 text-[#ff8f8f] border-[#ef4444]/30'
                      : studentStatus === 'Em andamento'
                      ? 'bg-[#0066ff]/20 text-[#38bdf8] border-[#0066ff]/30'
                      : 'bg-[#262a30] text-[#8c90a1] border-[#363a40]'
                  }`}
                >
                  {studentStatus}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white truncate mt-0.5">
                {exercise?.name ?? 'Exercício'} · Série {set.setNumber}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Fechar execução"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Resumo Compacto da Prescrição (Section 6) */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <MethodSummary set={draft} showTitle={false} />
            {draft.prescription?.repsRange && (
              <span className="text-[11px] font-mono text-[#8c90a1] bg-[#181c21] px-2 py-0.5 rounded border border-[#262a30]">
                Alvo: {draft.prescription.repsRange}
              </span>
            )}
            {draft.prescription?.rir !== undefined && draft.prescription?.rir !== null && (
              <span className="text-[11px] font-mono text-[#8c90a1] bg-[#181c21] px-2 py-0.5 rounded border border-[#262a30]">
                RIR {draft.prescription.rir}
              </span>
            )}
          </div>

          {/* Orientações do Treinador se houver */}
          {professionalNote && (
            <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#0066ff]/10 border border-[#0066ff]/20 flex items-start gap-2 text-xs text-[#b3c5ff]">
              <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-bold text-white mr-1">Orientação do Especialista:</span>
                <span className="text-[#c2c6d8]">{professionalNote}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Conteúdo da Execução Passo a Passo */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar">
          {/* Banner de Conclusão quando todas as etapas estiverem completas */}
          {isAllPerformed && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0066ff]/20 via-[#00a572]/15 to-[#0066ff]/20 border border-[#00a572]/40 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00a572]/20 text-[#4edea3] mb-0.5">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                {isDropSet ? 'DROP SET CONCLUÍDO' : 'REST-PAUSE CONCLUÍDO'}
              </h4>
              <div className="text-xs text-[#c2c6d8] font-mono space-y-0.5 pt-1">
                {orderedSegments(previewSet.performance).map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-center gap-1.5">
                    {idx > 0 && <span className="text-[#38bdf8]">↳</span>}
                    <span className="text-white font-bold">{s.weightKg ?? 0} kg</span>
                    <span>×</span>
                    <span className="text-[#4edea3] font-bold">{s.reps ?? 0} reps</span>
                    {s.restBeforeSeconds ? (
                      <span className="text-[#8c90a1] text-[10px]">({s.restBeforeSeconds}s)</span>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#8c90a1] pt-1">
                {metrics.volume.toLocaleString('pt-BR')} kg de volume total · {metrics.performedReps} repetições
              </p>
            </div>
          )}

          {/* Lista de Etapas */}
          <div className="space-y-3">
            {segments.map((segment, index) => {
              const isPrimary = segment.kind === 'PRIMARY';
              const isDrop = segment.kind === 'DROP';
              const isRP = segment.kind === 'REST_PAUSE';
              const isCompleted = Boolean(segment.completed);
              const isActive = index === currentActiveIndex;

              // Title label
              let stageTitle = `Série principal`;
              if (isDrop) {
                stageTitle = `DROP ${index} DE ${totalStages - 1}`;
              } else if (isRP) {
                stageTitle = `MINI-SET ${index} DE ${totalStages - 1}`;
              }

              // Pause info if configured
              const pauseSecs = segment.restBeforeSeconds ?? (isRP ? 15 : isDrop ? 10 : undefined);

              return (
                <div
                  key={segment.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isCompleted
                      ? 'bg-[#14181f]/80 border-[#262a30] opacity-90'
                      : isActive
                      ? 'bg-[#181c21] border-[#0066ff]/60 shadow-lg shadow-[#0066ff]/5'
                      : 'bg-[#14181f]/50 border-[#262a30]/60'
                  }`}
                >
                  {/* Stage Header */}
                  <div
                    className={`px-4 py-3 flex items-center justify-between border-b ${
                      isCompleted ? 'border-[#262a30]/50' : 'border-[#262a30]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-[#00a572] text-[#101419]'
                            : isActive
                            ? 'bg-[#0066ff] text-white shadow-sm'
                            : 'bg-[#262a30] text-[#8c90a1]'
                        }`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider truncate">
                        {stageTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Pausa prescrita visual notice */}
                      {!isPrimary && pauseSecs && (
                        <span className="text-[10px] font-mono text-[#8c90a1] flex items-center gap-1 bg-[#14181f] px-2 py-0.5 rounded border border-[#262a30]">
                          <Timer className="w-3 h-3 text-[#38bdf8]" />
                          Pausa {pauseSecs}s
                        </span>
                      )}

                      {/* Completed badge or reopen button */}
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={() => handleReopenStage(index)}
                          className="text-[11px] text-[#38bdf8] hover:underline font-semibold cursor-pointer"
                        >
                          Editar
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#8c90a1] font-semibold">
                          Pendente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stage Body */}
                  {isCompleted ? (
                    /* Collapsed completed summary */
                    <div className="px-4 py-2.5 flex items-center justify-between text-xs text-[#c2c6d8]">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-white text-sm">
                          {segment.weightKg ?? 0} kg
                        </span>
                        <span className="text-[#8c90a1]">×</span>
                        <span className="font-bold text-[#4edea3] text-sm">
                          {segment.reps ?? 0} reps
                        </span>
                        {segment.rir !== undefined && segment.rir !== null && (
                          <span className="text-[#8c90a1] text-[11px]">· RIR {segment.rir}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#4edea3] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Concluído
                      </span>
                    </div>
                  ) : (
                    /* Expanded Active Input Area */
                    <div className="p-4 space-y-3.5">
                      {/* Carga e Reps */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Carga (kg) */}
                        <div className="bg-[#14181f] border border-[#262a30] rounded-xl p-3 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#8c90a1] uppercase">
                            <span>Carga</span>
                            {/* Prepared for future suggestedLoad without fake math */}
                            {(segment as any).suggestedLoad !== undefined && (
                              <span className="text-[#38bdf8] text-[10px]">
                                Sugerida: {(segment as any).suggestedLoad} kg
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => adjustWeight(segment.id, segment.weightKg, -2.5)}
                              className="w-10 h-10 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-[#262a30]"
                              aria-label="Diminuir carga em 2.5 kg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <div className="flex-1 relative">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={segment.weightKg === undefined ? '' : segment.weightKg}
                                placeholder="0"
                                onChange={(e) =>
                                  patchSegment(segment.id, {
                                    weightKg: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0
                                  })
                                }
                                className="w-full h-10 bg-[#101419] border border-[#262a30] focus:border-[#0066ff] rounded-lg text-center text-base font-extrabold text-white tabular-nums outline-none"
                              />
                              <span className="absolute right-2 top-2.5 text-xs text-[#8c90a1] pointer-events-none">
                                kg
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => adjustWeight(segment.id, segment.weightKg, 2.5)}
                              className="w-10 h-10 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-[#262a30]"
                              aria-label="Aumentar carga em 2.5 kg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Repetições */}
                        <div className="bg-[#14181f] border border-[#262a30] rounded-xl p-3 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#8c90a1] uppercase">
                            <span>Repetições</span>
                            {draft.prescription?.repsRange && (
                              <span className="text-[#8c90a1] text-[10px]">
                                Alvo: {draft.prescription.repsRange}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => adjustReps(segment.id, segment.reps, -1)}
                              className="w-10 h-10 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-[#262a30]"
                              aria-label="Diminuir repetições"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <div className="flex-1 relative">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={segment.reps === undefined ? '' : segment.reps}
                                placeholder="0"
                                onChange={(e) =>
                                  patchSegment(segment.id, {
                                    reps: e.target.value === '' ? undefined : parseInt(e.target.value, 10) || 0
                                  })
                                }
                                className="w-full h-10 bg-[#101419] border border-[#262a30] focus:border-[#0066ff] rounded-lg text-center text-base font-extrabold text-white tabular-nums outline-none"
                              />
                              <span className="absolute right-2 top-2.5 text-xs text-[#8c90a1] pointer-events-none">
                                reps
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => adjustReps(segment.id, segment.reps, 1)}
                              className="w-10 h-10 rounded-lg bg-[#181c21] hover:bg-[#262a30] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-[#262a30]"
                              aria-label="Aumentar repetições"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Optional RIR / RPE (Section 13) */}
                      {showEffortInput ? (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                              RIR Observado (opcional):
                            </label>
                            <select
                              value={segment.rir === undefined || segment.rir === null ? 'none' : segment.rir}
                              onChange={(e) =>
                                patchSegment(segment.id, {
                                  rir: e.target.value === 'none' ? null : Number(e.target.value)
                                })
                              }
                              className="w-full h-9 px-3 rounded-lg bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                            >
                              <option value="none">Não informado</option>
                              <option value="0">0 (Falha)</option>
                              <option value="1">1 rep na reserva</option>
                              <option value="2">2 reps na reserva</option>
                              <option value="3">3 reps na reserva</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                              Pausa realizada antes (s):
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={segment.restBeforeSeconds ?? ''}
                              placeholder={pauseSecs ? `${pauseSecs}s` : '0s'}
                              onChange={(e) =>
                                patchSegment(segment.id, {
                                  restBeforeSeconds:
                                    e.target.value === '' ? undefined : parseInt(e.target.value, 10) || 0
                                })
                              }
                              className="w-full h-9 px-3 rounded-lg bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowEffortInput(true)}
                          className="text-[11px] text-[#8c90a1] hover:text-[#c2c6d8] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          + Registrar esforço (RIR / Pausa real)
                        </button>
                      )}

                      {/* Botão de Conclusão da Etapa */}
                      <button
                        type="button"
                        onClick={() => handleCompleteCurrentStage(index)}
                        className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.99] text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-[#0066ff]/20 transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        {isPrimary
                          ? 'Concluir Série Principal'
                          : isDrop
                          ? `Concluir Drop ${index} de ${totalStages - 1}`
                          : `Concluir Mini-set ${index} de ${totalStages - 1}`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#2d1518] border border-[#ef4444]/40 flex items-center gap-2 text-xs text-[#ff8f8f] animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* 3. Rodapé com Ações do Aluno */}
        <div className="p-4 bg-[#14181f] border-t border-[#262a30] flex flex-col gap-2.5 shrink-0">
          {/* Se todas as etapas foram concluídas, botão primário em destaque verde */}
          {isAllPerformed ? (
            <button
              type="button"
              onClick={() => handleFinish('COMPLETE')}
              className="w-full h-12 rounded-xl bg-[#00a572] hover:bg-[#009163] active:scale-[0.99] text-sm font-extrabold text-[#101419] flex items-center justify-center gap-2 shadow-lg shadow-[#00a572]/25 transition-all cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              Concluir Série Composta
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Interrupção amigável (Section 12) */}
              <button
                type="button"
                onClick={() => handleFinish('INTERRUPT')}
                className="flex-1 h-11 rounded-xl bg-[#181c21] hover:bg-[#2d1518] border border-[#262a30] hover:border-[#ef4444]/40 text-xs font-bold text-[#c2c6d8] hover:text-[#ff8f8f] transition-colors cursor-pointer"
                title="Salva as etapas já realizadas e interrompe a série"
              >
                Interromper método
              </button>

              {/* Salvar registro em andamento */}
              <button
                type="button"
                onClick={() => handleFinish('SAVE')}
                className="flex-1 h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Salvar registro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
