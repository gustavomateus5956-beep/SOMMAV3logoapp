import React from 'react';
import type { ExerciseSet } from '../../types';
import type { SetPrescription, DropSetConfig, RestPauseConfig } from '../../features/workout-engine/contracts';

export interface MethodSummaryInfo {
  method: string;
  label: string;
  details: string;
  fullSummary: string;
  dropsCount?: number;
  reductionText?: string;
  pauseSeconds?: number;
  miniSetsCount?: number;
}

/**
 * Extracts a concise human-readable summary of the prescribed method
 * following the SOMMA+ product guidelines (e.g. "2 quedas · -20% · 10s" or "2 mini-sets · 15s").
 */
export function getMethodSummary(set?: Partial<ExerciseSet> | null): MethodSummaryInfo | null {
  if (!set) return null;
  const prescription = set.prescription as SetPrescription | undefined;
  const method = prescription?.method ?? set.method ?? (set.type === 'dropset' ? 'dropset' : set.type === 'rest_pause' ? 'rest_pause' : set.type === 'amrap' ? 'amrap' : 'normal');

  if (method === 'dropset') {
    const config = prescription?.methodConfig as DropSetConfig | undefined;
    const dropsCount = config?.drops?.length ?? 2; // Default to 2 drops if not explicitly set
    
    // Check reduction in drops[0] loadRule
    let reductionText = '-20%';
    const rule = config?.drops?.[0]?.loadRule;
    if (rule) {
      if (rule.mode === 'PERCENT_PREVIOUS' || rule.mode === 'PERCENT_TOP_SET' || rule.mode === 'PERCENT_WORKING_LOAD') {
        reductionText = `-${rule.percent}%`;
      } else if (rule.mode === 'ABSOLUTE') {
        reductionText = `${rule.weightKg} kg`;
      }
    }

    const restSeconds = config?.drops?.[0]?.restSeconds ?? (prescription?.restSeconds ? Math.min(prescription.restSeconds, 30) : 10);
    const pausePart = restSeconds > 0 ? `${restSeconds}s` : 'sem pausa';
    const dropsLabel = dropsCount === 1 ? '1 queda' : `${dropsCount} quedas`;
    const details = `${dropsLabel} · ${reductionText} · ${pausePart}`;

    return {
      method: 'dropset',
      label: 'Drop Set',
      details,
      fullSummary: `Drop Set: ${details}`,
      dropsCount,
      reductionText,
      pauseSeconds: restSeconds
    };
  }

  if (method === 'rest_pause') {
    const config = prescription?.methodConfig as RestPauseConfig | undefined;
    const miniSetsCount = config?.pauses?.length ?? 2; // Default to 2 mini-sets
    const pauseSeconds = config?.pauses?.[0]?.restSeconds ?? 15;
    const miniSetsLabel = miniSetsCount === 1 ? '1 mini-set' : `${miniSetsCount} mini-sets`;
    const details = `${miniSetsLabel} · ${pauseSeconds}s`;

    return {
      method: 'rest_pause',
      label: 'Rest-Pause',
      details,
      fullSummary: `Rest-Pause: ${details}`,
      miniSetsCount,
      pauseSeconds
    };
  }

  if (method === 'amrap') {
    return {
      method: 'amrap',
      label: 'AMRAP',
      details: 'Máximo de reps',
      fullSummary: 'AMRAP · Máximo de repetições técnicas'
    };
  }

  return null;
}

interface MethodSummaryBadgeProps {
  set?: Partial<ExerciseSet> | null;
  className?: string;
  showTitle?: boolean;
}

export const MethodSummary: React.FC<MethodSummaryBadgeProps> = ({
  set,
  className = '',
  showTitle = true
}) => {
  const summary = getMethodSummary(set);
  if (!summary) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono tracking-tight ${
        summary.method === 'dropset'
          ? 'bg-[#0066ff]/15 text-[#38bdf8] border border-[#0066ff]/30'
          : summary.method === 'rest_pause'
          ? 'bg-[#00a572]/15 text-[#4edea3] border border-[#00a572]/30'
          : 'bg-[#ff5c5c]/15 text-[#ff8f8f] border border-[#ff5c5c]/30'
      } ${className}`}
      title={summary.fullSummary}
    >
      {showTitle && <span className="font-bold">{summary.label}:</span>}
      <span>{summary.details}</span>
    </div>
  );
};
