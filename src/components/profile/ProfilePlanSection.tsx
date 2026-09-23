import React from 'react';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProfilePlanSectionProps {
  displayPlan: string;
  linkedProfessionalsCount: number;
  onOpenPlans: () => void;
}

export const ProfilePlanSection: React.FC<ProfilePlanSectionProps> = ({
  displayPlan,
  linkedProfessionalsCount,
  onOpenPlans
}) => {
  return (
    <section className="bg-[#1c2025] rounded-3xl p-5 border border-[#262a30] flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#0066ff]" />
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Meu plano
          </h2>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30">
          Ativo
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181c21] to-[#12161b] border border-[#0066ff]/35 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">{displayPlan}</span>
              <Sparkles className="w-4 h-4 text-[#0066ff]" />
            </div>
            <span className="text-xs text-[#8c90a1] mt-0.5">
              Renovação automática • Acesso total ao ecossistema SOMMA
            </span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#262a30]/60">
          <div className="flex items-center gap-2 text-xs text-[#c2c6d8]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
            <span>
              <strong>Profissionais vinculados:</strong> {linkedProfessionalsCount > 0 ? `${linkedProfessionalsCount} especialista(s) inclusos no plano` : 'Equipe multidisciplinar habilitada'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#c2c6d8]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
            <span>Periodização automática, progressão de carga e histórico ilimitado</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#c2c6d8]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
            <span>Feedback direto em vídeo e chat integrado</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onOpenPlans}
            className="flex-1 h-10 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#0066ff]/25"
          >
            <span>Ver plano & Benefícios</span>
          </button>
          <button
            type="button"
            onClick={onOpenPlans}
            className="h-10 px-3 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold border border-[#31353b] transition-colors cursor-pointer"
          >
            <span>Alterar plano</span>
          </button>
        </div>
      </div>
    </section>
  );
};
