import React, { useState } from 'react';
import type { ExerciseSet } from '../../types';
import type { SetPerformanceSegment } from '../../features/workout-engine/contracts';
import { prescribeCompoundStages, segmentDrafts, recordCompoundPerformance } from '../../features/workout-engine/compoundSets';
import { requiredSegmentKinds, requiredSegmentsPerformed, segmentLabels, setMetrics, setExecutionState, executionLabels } from '../../features/workout-engine/setMetrics';

export function CompoundSetEditor({ set, onSave, onClose }: { set: ExerciseSet; onSave: (set: ExerciseSet) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(set);
  const [count, setCount] = useState('');
  const [pause, setPause] = useState('');
  const [error, setError] = useState('');
  const [segments, setSegments] = useState<SetPerformanceSegment[]>(() => requiredSegmentKinds(set.prescription!) ? segmentDrafts(set) : []);
  const planned = requiredSegmentKinds(draft.prescription!);
  const inputClass = 'w-full rounded-lg bg-[#181c21] border border-[#363a40] p-2 text-white text-sm';
  const buttonClass = 'rounded-lg border border-[#363a40] px-3 py-2 text-sm disabled:opacity-40';
  const patch = (id: string, value: Partial<SetPerformanceSegment>) => setSegments(previous => previous.map(s => s.id === id ? { ...s, ...value } : s));
  const preview = { ...draft, performance: { schemaVersion: 1 as const, completed: false, segments } };
  const save = (finish: 'SAVE' | 'COMPLETE' | 'INTERRUPT') => {
    try { onSave(recordCompoundPerformance(draft, segments, finish)); onClose(); }
    catch (err) { setError((err as Error).message); }
  };
  return <div className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-3" role="dialog" aria-modal="true" aria-label="Registrar etapas da série">
    <div className="bg-[#101419] border border-[#363a40] rounded-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto p-4 text-white space-y-3">
      <div className="flex justify-between items-center gap-2"><h3 className="font-bold">{draft.prescription?.method === 'dropset' ? 'Drop Set' : 'Rest-Pause'} · série {set.setNumber}</h3><button className={buttonClass} onClick={onClose}>Cancelar</button></div>
      <p className="text-xs text-[#a5adba]">Uma série, várias etapas. Marque somente o que foi executado. As alterações são gravadas ao salvar. Sem contagem automática de pausas entre etapas.</p>
      {!planned ? <div className="space-y-3">
        <label className="block text-sm">Etapas de intensidade prescritas (além da principal)
          <input aria-label="Etapas de intensidade prescritas" type="number" min="1" step="1" value={count} onChange={e => setCount(e.target.value)} className={inputClass} />
        </label>
        {draft.prescription?.method === 'rest_pause' && <label className="block text-sm">Pausa prescrita entre etapas (s)
          <input aria-label="Pausa prescrita entre etapas" type="number" min="0" value={pause} onChange={e => setPause(e.target.value)} className={inputClass} />
        </label>}
        <button className={buttonClass} onClick={() => {
          try { const next = prescribeCompoundStages(draft, Number(count), pause === '' ? undefined : Number(pause)); setDraft(next); setSegments(segmentDrafts(next)); setError(''); }
          catch (err) { setError((err as Error).message); }
        }}>Definir etapas</button>
      </div> : <>
        <p className="text-xs text-[#a5adba]">{planned.length} etapas prescritas · {setMetrics(preview).performedSegments} executadas · {setMetrics(preview).volume.toLocaleString('pt-BR')} kg de volume</p>
        {segments.map((segment, index) => <fieldset key={segment.id} className="border border-[#363a40] rounded-xl p-3 space-y-2">
          <legend className="px-1 text-sm font-bold">{index + 1}. {segmentLabels[segment.kind]}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(['weightKg', 'reps', 'rir', 'rpe'] as const).map(field => {
              const label = { weightKg: 'Carga (kg)', reps: 'Repetições', rir: 'RIR observado', rpe: 'RPE observado' }[field];
              return <label className="text-xs" key={field}>{label}
                <input aria-label={`${label} etapa ${index + 1}`} type="number" min="0" max={field === 'rpe' ? 10 : undefined} step={field === 'weightKg' || field === 'rpe' ? '0.5' : '1'} value={segment[field] ?? ''}
                  className={inputClass} onChange={e => patch(segment.id, { [field]: e.target.value === '' ? undefined : Number(e.target.value) })} />
              </label>;
            })}
          </div>
          {index > 0 && <label className="block text-xs">Pausa realizada antes (s), opcional
            <input aria-label={`Pausa realizada etapa ${index + 1}`} type="number" min="0" step="1" value={segment.restBeforeSeconds ?? ''} className={inputClass}
              onChange={e => patch(segment.id, { restBeforeSeconds: e.target.value === '' ? undefined : Number(e.target.value) })} />
          </label>}
          <label className="flex gap-2 text-sm items-center"><input type="checkbox" aria-label={`Etapa ${index + 1} executada`} checked={segment.completed === true} onChange={e => patch(segment.id, { completed: e.target.checked })} />Etapa executada</label>
        </fieldset>)}
        <p className="text-xs text-[#a5adba]">Registro salvo: {executionLabels[setExecutionState(set)]}{set.performance?.interrupted ? ' · interrompida' : ''}. Campos em branco permanecem desconhecidos.</p>
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} onClick={() => save('SAVE')}>Salvar registro</button>
          <button className={buttonClass} onClick={() => save('INTERRUPT')}>Interromper série</button>
          <button className={buttonClass + ' bg-[#0066ff]'} disabled={!requiredSegmentsPerformed(draft.prescription, preview.performance)} onClick={() => save('COMPLETE')}>Concluir série composta</button>
        </div>
      </>}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    </div>
  </div>;
}
