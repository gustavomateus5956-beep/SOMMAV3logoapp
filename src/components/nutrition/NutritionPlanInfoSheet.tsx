import React from 'react';
import { X, Target, Flame, Activity, UserCheck, FileText, Calendar, Droplets } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { NutritionPlanStrategyData } from '../../features/nutrition/types';

export interface NutritionPlanInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  plan: NutritionPlanStrategyData;
}

export const NutritionPlanInfoSheet: React.FC<NutritionPlanInfoSheetProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#14181f] border-t sm:border border-[#262a30] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh] animate-in slide-in-from-bottom duration-250 pb-safe overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle (Mobile) */}
        <div className="w-10 h-1 bg-[#262a30] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-2 pb-3.5 flex items-center justify-between border-b border-[#262a30]/60 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white tracking-tight">
              Informações do Plano
            </h3>
            <p className="text-xs text-[#8c90a1] mt-0.5">
              Estratégia nutricional e metas diárias
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181c21] hover:bg-[#262a30] text-[#8c90a1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar informações do plano"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* 1. OBJETIVO */}
          <div className="p-4 rounded-2xl bg-[#181c22] border border-[#262a30] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8c90a1] tracking-wider uppercase">
                Objetivo
              </span>
              <span className="text-sm sm:text-base font-bold text-white mt-0.5">
                {plan.goal}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0066ff]/15 border border-[#0066ff]/30 text-[#0066ff] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 stroke-[2.25]" />
            </div>
          </div>

          {/* 2. META CALÓRICA */}
          <div className="p-4 rounded-2xl bg-[#181c22] border border-[#262a30] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8c90a1] tracking-wider uppercase">
                Meta Calórica Diária
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white font-mono tabular-nums tracking-tight">
                  {plan.calorieTarget.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-[#8c90a1]">kcal / dia</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#ff8400]/15 border border-[#ff8400]/30 text-[#ff8400] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 stroke-[2.25]" />
            </div>
          </div>

          {/* 3. MACRONUTRIENTES */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#8c90a1] tracking-wider uppercase px-1">
              Macronutrientes
            </span>
            <div className="grid grid-cols-3 gap-2">
              {/* Proteína */}
              <div className="p-3 rounded-xl bg-[#181c22] border border-[#262a30] flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#0066ff]" />
                  <span>Proteína</span>
                </div>
                <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                  {plan.proteinTarget}g
                </span>
              </div>

              {/* Carboidrato */}
              <div className="p-3 rounded-xl bg-[#181c22] border border-[#262a30] flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                  <span>Carbos</span>
                </div>
                <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                  {plan.carbohydrateTarget}g
                </span>
              </div>

              {/* Gordura */}
              <div className="p-3 rounded-xl bg-[#181c22] border border-[#262a30] flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                  <span>Gorduras</span>
                </div>
                <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                  {plan.fatTarget}g
                </span>
              </div>
            </div>

            {/* Extras: Fibras & Água se disponíveis */}
            {(plan.fiberTarget !== undefined || plan.waterTargetMl !== undefined) && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {plan.fiberTarget !== undefined && (
                  <div className="p-2.5 rounded-xl bg-[#181c22]/60 border border-[#262a30] flex items-center justify-between text-xs px-3">
                    <span className="text-[#8c90a1] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#4edea3]" />
                      <span>Fibras</span>
                    </span>
                    <span className="font-bold text-white font-mono">{plan.fiberTarget}g</span>
                  </div>
                )}
                {plan.waterTargetMl !== undefined && (
                  <div className="p-2.5 rounded-xl bg-[#181c22]/60 border border-[#262a30] flex items-center justify-between text-xs px-3">
                    <span className="text-[#8c90a1] flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Água</span>
                    </span>
                    <span className="font-bold text-white font-mono">
                      {(plan.waterTargetMl / 1000).toFixed(1)}L
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. ESTRATÉGIA (Exibido apenas se fornecido) */}
          {plan.strategy && (
            <div className="p-4 rounded-2xl bg-[#181c22] border border-[#262a30] space-y-1.5">
              <span className="text-[10px] font-bold text-[#8c90a1] tracking-wider uppercase block">
                Estratégia Nutricional
              </span>
              <p className="text-xs text-[#c2c6d8] leading-relaxed">
                {plan.strategy}
              </p>
            </div>
          )}

          {/* 5. PROFISSIONAL RESPONSÁVEL (Exibido apenas se existir) */}
          {plan.professional?.name && (
            <div className="p-4 rounded-2xl bg-[#181c22] border border-[#262a30] flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#4edea3]/15 border border-[#4edea3]/30 text-[#4edea3] flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-4 h-4 stroke-[2.25]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-[#8c90a1] tracking-wider uppercase">
                  Profissional Responsável
                </span>
                <span className="text-sm font-bold text-white mt-0.5 truncate">
                  {plan.professional.name}
                </span>
                {plan.professional.role && (
                  <span className="text-xs text-[#8c90a1] mt-0.5">
                    {plan.professional.role}
                  </span>
                )}
                {plan.professional.registration && (
                  <span className="text-[11px] font-mono text-[#38bdf8] mt-1 font-semibold">
                    {plan.professional.registration}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 6. OBSERVAÇÕES (Exibido apenas se existir) */}
          {plan.notes && (
            <div className="p-4 rounded-2xl bg-[#181c22] border border-[#262a30] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8c90a1] tracking-wider uppercase">
                <FileText className="w-3 h-3 text-[#0066ff]" />
                <span>Observações da Prescrição</span>
              </div>
              <p className="text-xs text-[#c2c6d8] leading-relaxed">
                {plan.notes}
              </p>
            </div>
          )}

          {/* 7. PERÍODO / ÚLTIMA ATUALIZAÇÃO (Exibido apenas se existir) */}
          {plan.updatedAt && (
            <div className="px-1 py-1 flex items-center gap-1.5 text-[11px] text-[#8c90a1]">
              <Calendar className="w-3.5 h-3.5 text-[#8c90a1]" />
              <span>Última atualização: {plan.updatedAt}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262a30]/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#181c22] hover:bg-[#20252c] text-white text-xs font-bold border border-[#262a30] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
