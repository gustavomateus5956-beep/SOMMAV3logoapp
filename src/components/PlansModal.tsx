import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { USER_SUBSCRIPTION_PLAN } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { useScrollLock } from '../hooks/useScrollLock';

interface PlansModalProps {
  onClose: () => void;
}

export const PlansModal: React.FC<PlansModalProps> = ({ onClose }) => {
  useScrollLock(true);
  const { user, updateUser } = useUser();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'combo' | 'treino' | 'dieta'>('combo');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activePlanName = user?.plan || 'SOMMA Black Anual';

  const handleSave = () => {
    const chosenPlanName =
      selectedPlan === 'combo'
        ? (billingPeriod === 'annual' ? 'SOMMA Black Anual' : 'SOMMA Black Mensal')
        : selectedPlan === 'treino'
        ? 'SOMMA Treino'
        : 'SOMMA Nutrição';

    updateUser({ plan: chosenPlanName });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 overscroll-contain">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-[#101419] border border-[#262a30] rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250 overscroll-contain">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#0066ff] uppercase tracking-wider">
              Ecossistema SOMMA
            </span>
            <h2 className="text-base font-bold text-white">Seu Plano & Benefícios</h2>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          
          {/* Active Subscription Banner */}
          <div className="p-3.5 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Assinatura Ativa: {activePlanName}</span>
                <span className="text-[11px] text-[#4edea3]">Renovação automática • Benefícios inclusos</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3]">
              Ativo
            </span>
          </div>

          <p className="text-xs text-[#8c90a1] text-center">
            Seu plano inclui acompanhamento com 1 profissional dedicado por pilar (Treino, Nutrição e Fisioterapia).
          </p>

          {/* Billing Switch */}
          <div className="w-full bg-[#181c21] p-1 rounded-xl flex items-center border border-[#262a30]">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                billingPeriod === 'monthly' ? 'bg-[#262a30] text-white shadow-sm' : 'text-[#8c90a1]'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('annual')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                billingPeriod === 'annual' ? 'bg-[#0066ff] text-white shadow-sm' : 'text-[#8c90a1]'
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] bg-[#4edea3] text-black px-1.5 py-0.2 rounded font-extrabold">
                -20% OFF
              </span>
            </button>
          </div>

          {/* Combo Plan Featured (Active User Plan) */}
          <div
            onClick={() => setSelectedPlan('combo')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 relative ${
              selectedPlan === 'combo'
                ? 'bg-[#0066ff]/10 border-[#0066ff] ring-1 ring-[#0066ff]'
                : 'bg-[#181c21] border-[#262a30]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#4edea3] text-black">
                    SEU PLANO ATUAL
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0066ff] text-white">
                    Mais Completo
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">SOMMA Multidisciplinar Pro</h3>
                <span className="text-xs text-[#8c90a1]">Treinador + Nutricionista + Fisioterapeuta integrados</span>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-white">
                  R$ {billingPeriod === 'annual' ? '39,90' : '49,90'}
                </span>
                <span className="text-[10px] text-[#8c90a1] block">/ mês</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#262a30]/50 text-xs text-[#c2c6d8]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>1 Treinador dedicado com periodização na aba Treinos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>1 Nutricionista esportiva com macros na aba Dieta</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>1 Fisioterapeuta dedicado para mobilidade e recuperação</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>Chat ilimitado na SOMMA+ com feedback técnico</span>
              </div>
            </div>
          </div>

          {/* Individual Plans Alternatives */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setSelectedPlan('treino')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'treino'
                  ? 'bg-[#0066ff]/10 border-[#0066ff]'
                  : 'bg-[#181c21] border-[#262a30]'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">SOMMA Apenas Treino</span>
                <span className="text-[10px] text-[#8c90a1]">1 Treinador exclusivo</span>
              </div>
              <div className="mt-3">
                <span className="text-sm font-bold text-white">
                  R$ {billingPeriod === 'annual' ? '24,90' : '29,90'}
                </span>
                <span className="text-[10px] text-[#8c90a1]">/mês</span>
              </div>
            </div>

            <div
              onClick={() => setSelectedPlan('dieta')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'dieta'
                  ? 'bg-[#0066ff]/10 border-[#0066ff]'
                  : 'bg-[#181c21] border-[#262a30]'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">SOMMA Apenas Dieta</span>
                <span className="text-[10px] text-[#8c90a1]">1 Nutricionista exclusiva</span>
              </div>
              <div className="mt-3">
                <span className="text-sm font-bold text-white">
                  R$ {billingPeriod === 'annual' ? '24,90' : '29,90'}
                </span>
                <span className="text-[10px] text-[#8c90a1]">/mês</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="p-4 bg-[#181c21] border-t border-[#262a30]">
          <button
            type="button"
            onClick={handleSave}
            className="w-full h-12 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                <span>Plano Atualizado com Sucesso!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirmar Configurações do Plano</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
