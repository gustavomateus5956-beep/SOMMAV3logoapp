import React, { useState, useEffect } from 'react';
import { X, Check, Sliders, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import type { ExerciseSet, SetMethod } from '../../types';
import type {
  SetPrescription,
  DropSetConfig,
  RestPauseConfig,
  AmrapConfig,
  LoadRule,
  LoadIncrement
} from '../../features/workout-engine/contracts';
import { prescribeCompoundStages } from '../../features/workout-engine/compoundSets';
import { updatePrescription } from '../../features/workout-engine/setAdapter';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface MethodPrescriptionSheetProps {
  isOpen: boolean;
  set: ExerciseSet;
  exerciseName?: string;
  isProfessionalRoutine?: boolean;
  onClose: () => void;
  onSavePrescription: (configuredSet: ExerciseSet) => void;
}

export const MethodPrescriptionSheet: React.FC<MethodPrescriptionSheetProps> = ({
  isOpen,
  set,
  exerciseName,
  isProfessionalRoutine = false,
  onClose,
  onSavePrescription
}) => {
  useScrollLock(isOpen);

  const initialMethod: SetMethod =
    set.prescription?.method ?? set.method ?? (set.type === 'dropset' ? 'dropset' : set.type === 'rest_pause' ? 'rest_pause' : set.type === 'amrap' ? 'amrap' : 'dropset');

  const [activeMethod, setActiveMethod] = useState<SetMethod>(initialMethod);

  // --- DROP SET CONFIG STATE ---
  const existingDropConfig = set.prescription?.methodConfig?.method === 'dropset' ? (set.prescription.methodConfig as DropSetConfig) : undefined;
  const initialDropsCount = existingDropConfig?.drops?.length ?? 2;
  const [dropsCount, setDropsCount] = useState<number>(initialDropsCount);
  
  const initialReductionType = existingDropConfig?.drops?.[0]?.loadRule?.mode === 'ABSOLUTE' ? 'fixed' : 'percent';
  const [reductionType, setReductionType] = useState<'percent' | 'fixed'>(initialReductionType);
  
  const initialPercent = existingDropConfig?.drops?.[0]?.loadRule && 'percent' in existingDropConfig.drops[0].loadRule
    ? existingDropConfig.drops[0].loadRule.percent
    : 20;
  const [reductionPercent, setReductionPercent] = useState<number>(initialPercent);

  const initialFixedLoad = existingDropConfig?.drops?.[0]?.loadRule && 'weightKg' in existingDropConfig.drops[0].loadRule
    ? existingDropConfig.drops[0].loadRule.weightKg
    : 5;
  const [fixedLoadReduction, setFixedLoadReduction] = useState<number>(initialFixedLoad);

  const initialDropPause = existingDropConfig?.drops?.[0]?.restSeconds ?? 10;
  const [dropPauseSeconds, setDropPauseSeconds] = useState<number>(initialDropPause);

  const [targetRepsRange, setTargetRepsRange] = useState<string>(
    set.prescription?.repsRange ?? set.targetRepsRange ?? '8–12'
  );

  const [targetRir, setTargetRir] = useState<number | null>(
    set.prescription?.rir !== undefined ? set.prescription.rir : 1
  );

  const [loadIncrement, setLoadIncrement] = useState<number>(2.5);
  const [roundingPolicy, setRoundingPolicy] = useState<'nearest' | 'up' | 'down'>('nearest');
  const [allowStudentManualAdjustment, setAllowStudentManualAdjustment] = useState<boolean>(true);

  // --- REST-PAUSE CONFIG STATE ---
  const existingRestPauseConfig = set.prescription?.methodConfig?.method === 'rest_pause' ? (set.prescription.methodConfig as RestPauseConfig) : undefined;
  const initialMiniSets = existingRestPauseConfig?.pauses?.length ?? 2;
  const [miniSetsCount, setMiniSetsCount] = useState<number>(initialMiniSets);
  const initialPauseSecs = existingRestPauseConfig?.pauses?.[0]?.restSeconds ?? 15;
  const [restPauseSeconds, setRestPauseSeconds] = useState<number>(initialPauseSecs);

  // --- AMRAP CONFIG STATE ---
  const [amrapTargetReps, setAmrapTargetReps] = useState<string>('Máximo técnico');
  const [amrapTimeLimit, setAmrapTimeLimit] = useState<string>('');

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const m = set.prescription?.method ?? set.method ?? (set.type === 'rest_pause' ? 'rest_pause' : set.type === 'amrap' ? 'amrap' : 'dropset');
      setActiveMethod(m);
      setError('');
    }
  }, [isOpen, set]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      setError('');
      const nextType = activeMethod === 'dropset' ? 'dropset' : activeMethod === 'rest_pause' ? 'rest_pause' : activeMethod === 'amrap' ? 'amrap' : 'working';
      let baseSet = updatePrescription({ ...set, type: nextType }, {
        method: activeMethod,
        repsRange: targetRepsRange.trim() || undefined,
        rir: targetRir
      });

      if (activeMethod === 'dropset') {
        const increment: LoadIncrement = {
          amount: loadIncrement,
          unit: 'kg',
          rounding: roundingPolicy
        };

        const loadRule: LoadRule =
          reductionType === 'percent'
            ? { mode: 'PERCENT_PREVIOUS', percent: reductionPercent, increment }
            : { mode: 'ABSOLUTE', weightKg: fixedLoadReduction, increment };

        // Prescribe compound stages via workout engine (creates schemaVersion: 1 methodConfig with N drops)
        let updatedSet = prescribeCompoundStages(baseSet, dropsCount);

        // Enrich drop items with the configured loadRule and pause
        const currentConfig = updatedSet.prescription?.methodConfig as DropSetConfig | undefined;
        if (currentConfig && currentConfig.method === 'dropset') {
          const enrichedDrops = currentConfig.drops.map(() => ({
            loadRule,
            restSeconds: dropPauseSeconds
          }));

          updatedSet = updatePrescription(updatedSet, {
            methodConfig: {
              method: 'dropset',
              drops: enrichedDrops
            }
          });
        }

        onSavePrescription(updatedSet);
      } else if (activeMethod === 'rest_pause') {
        // Prescribe compound stages for rest-pause with the prescribed pause seconds
        const updatedSet = prescribeCompoundStages(baseSet, miniSetsCount, restPauseSeconds);
        onSavePrescription(updatedSet);
      } else if (activeMethod === 'amrap') {
        const amrapConfig: AmrapConfig = {
          method: 'amrap',
          targetRir: targetRir ?? undefined,
          timeLimitSeconds: amrapTimeLimit ? parseInt(amrapTimeLimit, 10) : undefined
        };
        const updatedSet = updatePrescription(baseSet, {
          methodConfig: amrapConfig
        });
        onSavePrescription(updatedSet);
      } else {
        onSavePrescription(baseSet);
      }

      onClose();
    } catch (err) {
      setError((err as Error).message || 'Erro ao salvar prescrição do método');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Top Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#262a30]/60 shrink-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff]">
              PRESCRIÇÃO DO PROFISSIONAL
            </span>
            <h3 className="text-base font-extrabold text-white truncate mt-0.5">
              Configurar Método de Treino
            </h3>
            <span className="text-xs text-[#8c90a1] truncate">
              {exerciseName ? `${exerciseName} • ` : ''}Série {set.setNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar configuração do método"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* Method selector tabs */}
          <div>
            <label className="text-[11px] font-bold text-[#8c90a1] uppercase block mb-1.5">
              Selecione o Método
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dropset', label: 'Drop Set' },
                { id: 'rest_pause', label: 'Rest-Pause' },
                { id: 'amrap', label: 'AMRAP' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMethod(m.id as SetMethod)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    activeMethod === m.id
                      ? 'bg-[#0066ff] text-white border-[#0066ff] shadow-md shadow-[#0066ff]/20'
                      : 'bg-[#181c21] text-[#8c90a1] border-[#262a30] hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* DROP SET FORM */}
          {activeMethod === 'dropset' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#181c21] border border-[#262a30] rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Estrutura de Drops
                  </span>
                  <span className="text-[11px] font-mono text-[#38bdf8]">
                    {dropsCount} {dropsCount === 1 ? 'queda' : 'quedas'}
                  </span>
                </div>

                {/* Número de drops */}
                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                    Número de reduções (drops) além da principal:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDropsCount(num)}
                        className={`flex-1 h-10 rounded-xl font-bold text-sm border transition-all ${
                          dropsCount === num
                            ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#38bdf8]'
                            : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipo de redução */}
                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                    Tipo de redução de carga:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReductionType('percent')}
                      className={`h-9 rounded-xl text-xs font-bold border transition-all ${
                        reductionType === 'percent'
                          ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#38bdf8]'
                          : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                      }`}
                    >
                      Percentual (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReductionType('fixed')}
                      className={`h-9 rounded-xl text-xs font-bold border transition-all ${
                        reductionType === 'fixed'
                          ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#38bdf8]'
                          : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                      }`}
                    >
                      Carga Fixa (kg)
                    </button>
                  </div>
                </div>

                {/* Redução percentual ou fixa */}
                {reductionType === 'percent' ? (
                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                      Percentual de redução por queda:
                    </label>
                    <div className="flex items-center gap-2">
                      {[15, 20, 25, 30].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setReductionPercent(pct)}
                          className={`flex-1 h-9 rounded-xl text-xs font-bold border transition-all ${
                            reductionPercent === pct
                              ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#38bdf8]'
                              : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                          }`}
                        >
                          -{pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                      Redução fixa por queda (kg):
                    </label>
                    <div className="flex items-center gap-2">
                      {[2.5, 5, 10, 15].map((kg) => (
                        <button
                          key={kg}
                          type="button"
                          onClick={() => setFixedLoadReduction(kg)}
                          className={`flex-1 h-9 rounded-xl text-xs font-bold border transition-all ${
                            fixedLoadReduction === kg
                              ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#38bdf8]'
                              : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                          }`}
                        >
                          -{kg}kg
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pausa entre drops */}
                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                    Pausa prevista entre drops:
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { sec: 0, label: '0s (sem pausa)' },
                      { sec: 10, label: '10s' },
                      { sec: 15, label: '15s' },
                      { sec: 20, label: '20s' }
                    ].map((p) => (
                      <button
                        key={p.sec}
                        type="button"
                        onClick={() => setDropPauseSeconds(p.sec)}
                        className={`flex-1 h-9 rounded-xl text-xs font-bold border transition-all ${
                          dropPauseSeconds === p.sec
                            ? 'bg-[#0066ff]/20 border-[#0066ff] text-[#38bdf8]'
                            : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parâmetros complementares */}
              <div className="bg-[#181c21] border border-[#262a30] rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Metas & Ajuste de Carga
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                      Faixa / Meta de Reps:
                    </label>
                    <input
                      type="text"
                      value={targetRepsRange}
                      onChange={(e) => setTargetRepsRange(e.target.value)}
                      placeholder="Ex: 8–12 ou Falha"
                      className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                      RIR Alvo:
                    </label>
                    <select
                      value={targetRir === null ? 'none' : targetRir}
                      onChange={(e) =>
                        setTargetRir(e.target.value === 'none' ? null : Number(e.target.value))
                      }
                      className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                    >
                      <option value="0">0 (Falha técnica)</option>
                      <option value="1">1 rep na reserva</option>
                      <option value="2">2 reps na reserva</option>
                      <option value="none">Sem meta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                      Incremento previsto:
                    </label>
                    <select
                      value={loadIncrement}
                      onChange={(e) => setLoadIncrement(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                    >
                      <option value={1}>1.0 kg</option>
                      <option value={2}>2.0 kg</option>
                      <option value={2.5}>2.5 kg</option>
                      <option value={5}>5.0 kg</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                      Arredondamento visual:
                    </label>
                    <select
                      value={roundingPolicy}
                      onChange={(e) => setRoundingPolicy(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                    >
                      <option value="nearest">Mais próximo</option>
                      <option value="up">Para cima</option>
                      <option value="down">Para baixo</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#262a30]/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      Permitir ajuste manual da carga pelo aluno
                    </span>
                    <span className="text-[10px] text-[#8c90a1]">
                      A sugestão do método nunca bloqueia o registro real do aluno
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowStudentManualAdjustment}
                    onChange={(e) => setAllowStudentManualAdjustment(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0066ff] focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* REST-PAUSE FORM */}
          {activeMethod === 'rest_pause' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#181c21] border border-[#262a30] rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Configuração do Rest-Pause
                  </span>
                  <span className="text-[11px] font-mono text-[#4edea3]">
                    {miniSetsCount} mini-sets · {restPauseSeconds}s
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                    Número de mini-sets (após série principal):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMiniSetsCount(num)}
                        className={`flex-1 h-10 rounded-xl font-bold text-sm border transition-all ${
                          miniSetsCount === num
                            ? 'bg-[#00a572]/20 border-[#00a572] text-[#4edea3]'
                            : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1.5">
                    Pausa prescrita entre mini-sets:
                  </label>
                  <div className="flex items-center gap-2">
                    {[10, 15, 20, 30].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setRestPauseSeconds(sec)}
                        className={`flex-1 h-10 rounded-xl font-bold text-xs border transition-all ${
                          restPauseSeconds === sec
                            ? 'bg-[#00a572]/20 border-[#00a572] text-[#4edea3]'
                            : 'bg-[#14181f] border-[#262a30] text-[#8c90a1] hover:text-white'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#14181f] border border-[#262a30] flex items-center gap-2 text-xs text-[#8c90a1]">
                  <Info className="w-4 h-4 text-[#4edea3] shrink-0" />
                  <span>
                    No Rest-Pause, a carga de referência utilizada em cada mini-set é a mesma da série principal.
                  </span>
                </div>
              </div>

              <div className="bg-[#181c21] border border-[#262a30] rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Metas de Execução
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                      Meta de Reps:
                    </label>
                    <input
                      type="text"
                      value={targetRepsRange}
                      onChange={(e) => setTargetRepsRange(e.target.value)}
                      placeholder="Ex: 3–5 reps"
                      className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                      RIR Alvo:
                    </label>
                    <select
                      value={targetRir === null ? 'none' : targetRir}
                      onChange={(e) =>
                        setTargetRir(e.target.value === 'none' ? null : Number(e.target.value))
                      }
                      className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                    >
                      <option value="0">0 (Falha)</option>
                      <option value="1">1 rep</option>
                      <option value="none">Sem meta</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AMRAP FORM */}
          {activeMethod === 'amrap' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#181c21] border border-[#262a30] rounded-2xl p-4 space-y-3.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Configuração AMRAP (As Many Reps As Possible)
                </span>

                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                    Meta de Repetições:
                  </label>
                  <input
                    type="text"
                    value={amrapTargetReps}
                    onChange={(e) => setAmrapTargetReps(e.target.value)}
                    placeholder="Ex: Máximo de reps técnicas"
                    className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8c90a1] block mb-1">
                    Limite de tempo (segundos, opcional):
                  </label>
                  <input
                    type="number"
                    value={amrapTimeLimit}
                    onChange={(e) => setAmrapTimeLimit(e.target.value)}
                    placeholder="Sem limite de tempo"
                    className="w-full h-10 px-3 rounded-xl bg-[#14181f] border border-[#262a30] text-white text-xs font-semibold focus:border-[#0066ff] outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#14181f] border border-[#262a30] flex items-center gap-2 text-xs text-[#8c90a1]">
                  <Info className="w-4 h-4 text-[#ff5c5c] shrink-0" />
                  <span>
                    O método AMRAP estimula o máximo volume mantendo a técnica correta, sem presumir falha muscular precoce.
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-[#2d1518] border border-[#ef4444]/40 text-xs text-[#ff8f8f]">
              {error}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#14181f] border-t border-[#262a30] flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-xs font-semibold text-[#c2c6d8] hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[2] h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/25 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Salvar Prescrição do Método
          </button>
        </div>
      </div>
    </div>
  );
};
