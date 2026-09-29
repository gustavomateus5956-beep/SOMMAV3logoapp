import React, { useState, useEffect } from 'react';
import { X, Trash2, Check, Clock, Target, Gauge, HelpCircle } from 'lucide-react';
import { SetTypeKey, SetRole, SetMethod, ExerciseSet } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';
import { SetMethodHelpSheet } from './SetMethodHelpSheet';

export interface SetTypeSheetProps {
  isOpen: boolean;
  setNumber: number;
  currentSet?: ExerciseSet;
  currentType?: SetTypeKey;
  exerciseName?: string;
  exerciseRestSeconds?: number;
  onClose: () => void;
  onSaveConfig?: (config: {
    role: SetRole;
    method: SetMethod;
    targetRepsRange?: string;
    rir?: number | null;
    rpe?: number | null;
    restTimeSeconds?: number;
    type?: SetTypeKey;
  }) => void;
  onSelectType?: (type: SetTypeKey) => void;
  onRemoveSet: () => void;
}

const ROLES: Array<{
  key: SetRole;
  label: string;
  badge: string;
}> = [
  {
    key: 'working',
    label: 'Trabalho',
    badge: '1'
  },
  {
    key: 'warmup',
    label: 'Aquecimento',
    badge: 'A1'
  },
  {
    key: 'top_set',
    label: 'Top Set',
    badge: 'T1'
  },
  {
    key: 'backoff',
    label: 'Back-off',
    badge: 'B1'
  }
];

const METHODS: Array<{
  key: SetMethod;
  label: string;
}> = [
  {
    key: 'normal',
    label: 'Normal'
  },
  {
    key: 'dropset',
    label: 'Drop Set'
  },
  {
    key: 'rest_pause',
    label: 'Rest-Pause'
  },
  {
    key: 'amrap',
    label: 'AMRAP'
  }
];

const ROLE_EXPLANATIONS: Record<SetRole, string> = {
  working:
    'Série principal do exercício usada para cumprir o volume e a intensidade prescritos.',
  warmup:
    'Série preparatória realizada antes das séries principais, geralmente com menor carga e sem objetivo de gerar grande fadiga.',
  top_set:
    'Série principal mais pesada ou mais desafiadora do exercício, podendo servir como referência para séries seguintes.',
  backoff:
    'Série realizada após uma série principal, normalmente com carga reduzida e objetivo de acumular volume com boa execução.'
};

const METHOD_EXPLANATIONS: Record<SetMethod, string> = {
  normal:
    'Série executada de forma convencional, seguindo carga, repetições, esforço e descanso prescritos.',
  dropset:
    'Após concluir a série principal, a carga é reduzida e o exercício continua com pouco ou nenhum descanso.',
  rest_pause:
    'A série é dividida por pequenas pausas. Após a execução inicial, são feitas novas repetições com descansos curtos.',
  amrap:
    'Execute o maior número de repetições permitido pela prescrição naquela série.'
};

const REPS_PRESETS = ['6–8', '8–10', '10–12', '12–15', '15–20'];
const RIR_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: '0 (Falha)', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: 'Sem meta', value: null }
];
const RPE_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: 'Sem meta', value: null }
];

export const SetTypeSheet: React.FC<SetTypeSheetProps> = ({
  isOpen,
  setNumber,
  currentSet,
  currentType = 'working',
  exerciseName,
  exerciseRestSeconds = 120,
  onClose,
  onSaveConfig,
  onSelectType,
  onRemoveSet
}) => {
  useScrollLock(isOpen);

  // Initial role resolution with backwards compatibility
  const initialRole: SetRole = currentSet?.role || (currentType === 'warmup' ? 'warmup' : 'working');

  // Initial method resolution with backwards compatibility
  let initialMethod: SetMethod = currentSet?.method || 'normal';
  if (!currentSet?.method) {
    if (currentType === 'dropset') initialMethod = 'dropset';
    else if (currentType === 'rest_pause') initialMethod = 'rest_pause';
    else if (currentType === 'amrap') initialMethod = 'amrap';
  }

  const [selectedRole, setSelectedRole] = useState<SetRole>(initialRole);
  const [selectedMethod, setSelectedMethod] = useState<SetMethod>(initialMethod);
  const [targetRepsRange, setTargetRepsRange] = useState<string>(
    currentSet?.targetRepsRange || (currentSet?.targetReps ? `${currentSet.targetReps}` : '')
  );
  const [selectedRir, setSelectedRir] = useState<number | null>(
    currentSet?.rir !== undefined ? currentSet.rir : null
  );
  const [selectedRpe, setSelectedRpe] = useState<number | null>(
    currentSet?.rpe !== undefined ? currentSet.rpe : null
  );
  const [restSeconds, setRestSeconds] = useState<number>(
    currentSet?.restTimeSeconds || exerciseRestSeconds
  );

  // Mini Bottom Sheet de Ajuda [?] para Função e Método
  const [activeHelp, setActiveHelp] = useState<{
    title: string;
    categoryLabel: 'FUNÇÃO DA SÉRIE' | 'MÉTODO DE INTENSIDADE';
    description: string;
  } | null>(null);

  // Sync state when sheet opens or currentSet changes
  useEffect(() => {
    if (isOpen) {
      const role: SetRole = currentSet?.role || (currentType === 'warmup' ? 'warmup' : 'working');
      let method: SetMethod = currentSet?.method || 'normal';
      if (!currentSet?.method) {
        if (currentType === 'dropset') method = 'dropset';
        else if (currentType === 'rest_pause') method = 'rest_pause';
        else if (currentType === 'amrap') method = 'amrap';
      }

      setSelectedRole(role);
      setSelectedMethod(method);
      setTargetRepsRange(
        currentSet?.targetRepsRange || (currentSet?.targetReps ? `${currentSet.targetReps}` : '')
      );
      setSelectedRir(currentSet?.rir !== undefined ? currentSet.rir : null);
      setSelectedRpe(currentSet?.rpe !== undefined ? currentSet.rpe : null);
      setRestSeconds(currentSet?.restTimeSeconds || exerciseRestSeconds);
    }
  }, [isOpen, currentSet, currentType, exerciseRestSeconds]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Map role & method to legacy SetTypeKey for backwards compatibility
    let mappedType: SetTypeKey = 'working';
    if (selectedRole === 'warmup') {
      mappedType = 'warmup';
    } else if (selectedMethod === 'dropset') {
      mappedType = 'dropset';
    } else if (selectedMethod === 'rest_pause') {
      mappedType = 'rest_pause';
    } else if (selectedMethod === 'amrap') {
      mappedType = 'amrap';
    }

    if (onSaveConfig) {
      onSaveConfig({
        role: selectedRole,
        method: selectedMethod,
        targetRepsRange: targetRepsRange.trim() || undefined,
        rir: selectedRir,
        rpe: selectedRpe,
        restTimeSeconds: restSeconds,
        type: mappedType
      });
    } else if (onSelectType) {
      onSelectType(mappedType);
    }

    onClose();
  };

  const handleAdjustRest = (delta: number) => {
    setRestSeconds((prev) => Math.max(15, Math.min(900, prev + delta)));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle (Mobile) */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#262a30]/60 shrink-0">
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight">
              Configurar série
            </h3>
            <p className="text-xs text-[#8c90a1] truncate mt-0.5">
              Série {setNumber} {exerciseName ? `• ${exerciseName}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar configuração de série"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* 1. SEÇÃO FUNÇÃO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#8c90a1] tracking-wider uppercase">
                Função
              </span>
              <span className="text-[10px] text-[#64748b]">Papel tático da série</span>
            </div>

            <div className="space-y-1.5">
              {ROLES.map((roleOpt) => {
                const isSelected = selectedRole === roleOpt.key;
                return (
                  <div
                    key={roleOpt.key}
                    onClick={() => setSelectedRole(roleOpt.key)}
                    className={`w-full h-12 px-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#181f2a] border-[#0066ff] shadow-xs shadow-[#0066ff]/15'
                        : 'bg-[#181c21] border-[#262a30] hover:bg-[#1f242c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio indicator */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'border-[#0066ff] bg-[#0066ff]'
                            : 'border-[#64748b] bg-transparent'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-white">
                        {roleOpt.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          isSelected
                            ? 'bg-[#0066ff]/20 text-[#38bdf8] border-[#0066ff]/40'
                            : 'bg-[#101419] text-[#8c90a1] border-[#262a30]'
                        }`}
                      >
                        {roleOpt.badge}
                      </span>

                      {/* Botão de Ajuda [?] */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHelp({
                            title: roleOpt.label.toUpperCase(),
                            categoryLabel: 'FUNÇÃO DA SÉRIE',
                            description: ROLE_EXPLANATIONS[roleOpt.key]
                          });
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#8c90a1] hover:text-[#38bdf8] hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0"
                        title={`O que é ${roleOpt.label}?`}
                        aria-label={`Ajuda sobre ${roleOpt.label}`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. SEÇÃO MÉTODO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#8c90a1] tracking-wider uppercase">
                Método
              </span>
              <span className="text-[10px] text-[#64748b]">Técnica de intensidade</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {METHODS.map((methodOpt) => {
                const isSelected = selectedMethod === methodOpt.key;
                return (
                  <div
                    key={methodOpt.key}
                    onClick={() => setSelectedMethod(methodOpt.key)}
                    className={`h-11 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0066ff] border-[#0066ff] text-white shadow-md shadow-[#0066ff]/20'
                        : 'bg-[#181c21] border-[#262a30] text-[#c2c6d8] hover:bg-[#1f242c]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />}
                      <span className="text-xs sm:text-sm font-bold truncate">
                        {methodOpt.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHelp({
                          title: methodOpt.label.toUpperCase(),
                          categoryLabel: 'MÉTODO DE INTENSIDADE',
                          description: METHOD_EXPLANATIONS[methodOpt.key]
                        });
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 ${
                        isSelected
                          ? 'text-white/80 hover:text-white hover:bg-white/15'
                          : 'text-[#8c90a1] hover:text-[#38bdf8] hover:bg-white/10'
                      }`}
                      title={`O que é ${methodOpt.label}?`}
                      aria-label={`Ajuda sobre ${methodOpt.label}`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. SEÇÃO META (Repetições, RIR, RPE, Descanso) */}
          <div className="space-y-3.5 pt-1">
            <span className="text-[11px] font-bold text-[#8c90a1] tracking-wider uppercase block">
              Meta
            </span>

            {/* Repetições Alvo */}
            <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#c2c6d8] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>Faixa de Repetições</span>
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {targetRepsRange || 'Sem faixa'}
                </span>
              </div>

              {/* Presets de reps */}
              <div className="flex flex-wrap gap-1.5">
                {REPS_PRESETS.map((range) => {
                  const isSelected = targetRepsRange === range;
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setTargetRepsRange(isSelected ? '' : range)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0066ff] border-[#0066ff] text-white shadow-xs'
                          : 'bg-[#101419] border-[#262a30] text-[#8c90a1] hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={targetRepsRange}
                onChange={(e) => setTargetRepsRange(e.target.value)}
                placeholder="Ou digite ex: 8–10, 12, Falha"
                className="w-full h-9 px-3 bg-[#101419] border border-[#262a30] focus:border-[#0066ff] rounded-xl text-xs text-white placeholder-[#64748b] outline-none"
              />
            </div>

            {/* RIR (Repetições na Reserva) */}
            <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#c2c6d8] flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>RIR (Repetições em Reserva)</span>
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {selectedRir !== null ? `RIR ${selectedRir}` : 'Sem meta'}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {RIR_OPTIONS.map((rirOpt) => {
                  const isSelected = selectedRir === rirOpt.value;
                  return (
                    <button
                      key={rirOpt.label}
                      type="button"
                      onClick={() => setSelectedRir(rirOpt.value)}
                      className={`h-8 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#0066ff] border-[#0066ff] text-white shadow-xs'
                          : 'bg-[#101419] border-[#262a30] text-[#8c90a1] hover:text-white'
                      } ${rirOpt.value === null ? 'col-span-2 sm:col-span-1' : ''}`}
                    >
                      {rirOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RPE (Percepção Subjetiva de Esforço) */}
            <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#c2c6d8] flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>RPE (Esforço Percebido)</span>
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {selectedRpe !== null ? `RPE ${selectedRpe}` : 'Sem meta'}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                {RPE_OPTIONS.map((rpeOpt) => {
                  const isSelected = selectedRpe === rpeOpt.value;
                  return (
                    <button
                      key={rpeOpt.label}
                      type="button"
                      onClick={() => setSelectedRpe(rpeOpt.value)}
                      className={`h-8 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#0066ff] border-[#0066ff] text-white shadow-xs'
                          : 'bg-[#101419] border-[#262a30] text-[#8c90a1] hover:text-white'
                      }`}
                    >
                      {rpeOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Descanso da Série */}
            <div className="p-3.5 rounded-2xl bg-[#181c21] border border-[#262a30] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#c2c6d8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Descanso pós-série</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjustRest(-15)}
                  className="w-8 h-8 rounded-lg bg-[#101419] border border-[#262a30] hover:border-[#0066ff] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                >
                  -15s
                </button>
                <span className="font-mono text-sm font-bold text-white w-12 text-center">
                  {restSeconds}s
                </span>
                <button
                  type="button"
                  onClick={() => handleAdjustRest(15)}
                  className="w-8 h-8 rounded-lg bg-[#101419] border border-[#262a30] hover:border-[#0066ff] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                >
                  +15s
                </button>
              </div>
            </div>
          </div>

          {/* Remover Série (Ação de perigo isolada no rodapé do conteúdo) */}
          <div className="pt-2 border-t border-[#262a30]/60">
            <button
              type="button"
              onClick={() => {
                onRemoveSet();
                onClose();
              }}
              className="w-full h-11 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#ef4444] hover:bg-[#2d1518]/30 transition-colors cursor-pointer border border-transparent hover:border-[#ef4444]/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remover série do treino</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#262a30]/60 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-[#181c21] hover:bg-[#20252c] text-[#8c90a1] hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-[#262a30]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold shadow-md shadow-[#0066ff]/25 transition-all cursor-pointer"
          >
            Salvar Configuração
          </button>
        </div>
      </div>

      {/* Mini Bottom Sheet de Ajuda [?] */}
      {activeHelp && (
        <SetMethodHelpSheet
          isOpen={Boolean(activeHelp)}
          title={activeHelp.title}
          categoryLabel={activeHelp.categoryLabel}
          description={activeHelp.description}
          onClose={() => setActiveHelp(null)}
        />
      )}
    </div>
  );
};
