import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Dumbbell, 
  Utensils, 
  HeartPulse, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Search,
  Star,
  RefreshCw,
  Calendar,
  Layers,
  Award,
  ArrowLeft
} from 'lucide-react';
import { Professional, TabType } from '../types';
import { USER_SUBSCRIPTION_PLAN } from '../data/mockData';
import { PageHeader } from './PageHeader';

interface ProfessionalsViewProps {
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
  onOpenChat: (professional: Professional) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenPlans: () => void;
  onAssignToSlot: (professional: Professional) => void;
  onBack?: () => void;
}

export const ProfessionalsView: React.FC<ProfessionalsViewProps> = ({
  professionals,
  onSelectProfessional,
  onOpenChat,
  onNavigateTab,
  onOpenPlans,
  onAssignToSlot,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'personal' | 'nutri' | 'fisio'>('all');
  const [showDirectory, setShowDirectory] = useState(false);

  // Active specialists (1 per area)
  const activePersonal = professionals.find((p) => p.category === 'personal' && p.isLinkedToUserPlan);
  const activeNutri = professionals.find((p) => p.category === 'nutri' && p.isLinkedToUserPlan);
  const activeFisio = professionals.find((p) => p.category === 'fisio' && p.isLinkedToUserPlan);

  // Default candidate for Fisio slot if unlinked
  const availableFisioCandidate = professionals.find((p) => p.category === 'fisio' && !p.isLinkedToUserPlan);

  // Directory filter (excluding currently active linked ones to keep discovery clear)
  const otherProfessionals = professionals.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.focusAreas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.registration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-24 md:pb-12 gap-5">
      {/* Standardized Page Header */}
      <PageHeader
        category="CORPO TÉCNICO DEDICADO"
        title="Profissionais"
        subtitle="Especialistas credenciados vinculados à sua periodização e dieta"
        onBack={onBack}
        badge={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c2025] border border-[#262a30]">
            <ShieldCheck className="w-4 h-4 text-[#0066ff]" />
            <span className="text-xs font-bold text-white">3 Ativos</span>
          </div>
        }
      />

      {/* Hero: User Subscription Plan Card */}
      <div className="bg-gradient-to-br from-[#1c2025] via-[#161a20] to-[#12161c] p-4 md:p-5 rounded-2xl border border-[#0066ff]/40 shadow-md flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] border border-[#0066ff]/30">
                {USER_SUBSCRIPTION_PLAN.badge}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#4edea3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                Assinatura Ativa
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-1">
              {USER_SUBSCRIPTION_PLAN.name}
            </h2>
            <span className="text-xs text-[#8c90a1]">
              Cobrança {USER_SUBSCRIPTION_PLAN.billingPeriod} • Renovação em {USER_SUBSCRIPTION_PLAN.renewalDate}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenPlans}
            className="h-8 px-3 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            <span>Detalhes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Pillars Status Badges */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#262a30]/70 text-center">
          <div className="p-2 rounded-xl bg-[#101419]/70 border border-[#262a30] flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#b3c5ff]">
              <Dumbbell className="w-3 h-3 text-[#0066ff]" />
              <span>Treinador</span>
            </div>
            <span className="text-xs font-bold text-white mt-0.5 truncate max-w-full">
              {activePersonal ? activePersonal.name.split(' ')[1] || 'Ativo' : 'Pendente'}
            </span>
            <span className="text-[9px] text-[#4edea3] font-semibold">1/1 Ocupado</span>
          </div>

          <div className="p-2 rounded-xl bg-[#101419]/70 border border-[#262a30] flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#b3c5ff]">
              <Utensils className="w-3 h-3 text-[#0066ff]" />
              <span>Nutricionista</span>
            </div>
            <span className="text-xs font-bold text-white mt-0.5 truncate max-w-full">
              {activeNutri ? activeNutri.name.split(' ')[1] || 'Ativa' : 'Pendente'}
            </span>
            <span className="text-[9px] text-[#4edea3] font-semibold">1/1 Ocupado</span>
          </div>

          <div className="p-2 rounded-xl bg-[#101419]/70 border border-[#262a30] flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#b3c5ff]">
              <HeartPulse className="w-3 h-3 text-[#0066ff]" />
              <span>Fisioterapeuta</span>
            </div>
            <span className="text-xs font-bold text-white mt-0.5 truncate max-w-full">
              {activeFisio ? activeFisio.name.split(' ')[1] || 'Ativo' : 'Disponível'}
            </span>
            <span className={`text-[9px] font-semibold ${activeFisio ? 'text-[#4edea3]' : 'text-[#ffd700]'}`}>
              {activeFisio ? '1/1 Ocupado' : 'Slot Aberto ⚡'}
            </span>
          </div>
        </div>
      </div>

      {/* Section: Active Team (1 Specialist per Area) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0066ff]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Seu Time Ativo no App (1 por Área)
            </h3>
          </div>
          <span className="text-[11px] text-[#8c90a1]">Sincronização Direta</span>
        </div>

        {/* 1. Personal Trainer Slot */}
        {activePersonal && (
          <div className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activePersonal.avatar}
                    alt={activePersonal.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#0066ff] bg-[#262a30]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#0066ff] text-white rounded-full p-0.5 ring-2 ring-[#1c2025]">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{activePersonal.name}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3]">
                      Treinador Ativo
                    </span>
                  </div>
                  <span className="text-xs text-[#0066ff] font-semibold">{activePersonal.registration}</span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5">
                    Próximo check-in: {activePersonal.nextCheckInDate || '28/05'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#ffb59d]/15 text-[#ffb59d] px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0">
                <Star className="w-3 h-3 fill-[#ffb59d]" />
                <span>{activePersonal.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Prescribed routines summary */}
            <div className="p-3 rounded-xl bg-[#14181f] border border-[#262a30]/60 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Dumbbell className="w-4 h-4 text-[#0066ff] shrink-0" />
                <span className="text-[#c2c6d8] truncate font-medium">
                  {activePersonal.prescriptionSummary || 'Treinos A, B e C ativos com RPE'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('treino')}
                className="text-[#0066ff] hover:underline font-bold text-[11px] shrink-0 cursor-pointer"
              >
                Abrir Treinos →
              </button>
            </div>

            {/* Actions for active Personal (NO HIRE BUTTON!) */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#262a30]/60">
              <button
                type="button"
                onClick={() => onOpenChat(activePersonal)}
                className="flex-1 h-10 px-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat com o Coach</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectProfessional(activePersonal)}
                className="h-10 px-3.5 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#b3c5ff] hover:text-white border border-[#262a30] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Perfil</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Nutritionist Slot */}
        {activeNutri && (
          <div className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activeNutri.avatar}
                    alt={activeNutri.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#0066ff] bg-[#262a30]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#0066ff] text-white rounded-full p-0.5 ring-2 ring-[#1c2025]">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{activeNutri.name}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3]">
                      Nutri Ativa
                    </span>
                  </div>
                  <span className="text-xs text-[#0066ff] font-semibold">{activeNutri.registration}</span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5">
                    Próximo check-in: {activeNutri.nextCheckInDate || '02/06'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#ffb59d]/15 text-[#ffb59d] px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0">
                <Star className="w-3 h-3 fill-[#ffb59d]" />
                <span>{activeNutri.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Prescribed diet summary */}
            <div className="p-3 rounded-xl bg-[#14181f] border border-[#262a30]/60 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Utensils className="w-4 h-4 text-[#0066ff] shrink-0" />
                <span className="text-[#c2c6d8] truncate font-medium">
                  {activeNutri.prescriptionSummary || 'Hipertrofia Limpa • 2.650 kcal (185g Proteína)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('dieta')}
                className="text-[#0066ff] hover:underline font-bold text-[11px] shrink-0 cursor-pointer"
              >
                Abrir Dieta →
              </button>
            </div>

            {/* Actions for active Nutri (NO HIRE BUTTON!) */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#262a30]/60">
              <button
                type="button"
                onClick={() => onOpenChat(activeNutri)}
                className="flex-1 h-10 px-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat com a Nutri</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectProfessional(activeNutri)}
                className="h-10 px-3.5 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#b3c5ff] hover:text-white border border-[#262a30] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Perfil</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Physiotherapist Slot (Either Active or Available in Plan) */}
        {activeFisio ? (
          <div className="bg-[#1c2025] rounded-2xl p-4 border border-[#262a30] flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activeFisio.avatar}
                    alt={activeFisio.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#0066ff] bg-[#262a30]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#0066ff] text-white rounded-full p-0.5 ring-2 ring-[#1c2025]">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{activeFisio.name}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3]">
                      Fisioterapeuta Ativo
                    </span>
                  </div>
                  <span className="text-xs text-[#0066ff] font-semibold">{activeFisio.registration}</span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5">
                    Prevenção de ombro & mobilidade articular
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#ffb59d]/15 text-[#ffb59d] px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0">
                <Star className="w-3 h-3 fill-[#ffb59d]" />
                <span>{activeFisio.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#262a30]/60">
              <button
                type="button"
                onClick={() => onOpenChat(activeFisio)}
                className="flex-1 h-10 px-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat com o Fisio</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectProfessional(activeFisio)}
                className="h-10 px-3.5 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#b3c5ff] hover:text-white border border-[#262a30] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Perfil</span>
              </button>
            </div>
          </div>
        ) : availableFisioCandidate ? (
          /* Slot is Available in Plan - Activate without hiring costs */
          <div className="bg-gradient-to-br from-[#1c2025] to-[#141b24] rounded-2xl p-4 border border-[#ffd700]/30 flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={availableFisioCandidate.avatar}
                    alt={availableFisioCandidate.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-1 ring-[#31353b] bg-[#262a30]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#ffd700] text-black rounded-full p-0.5 ring-2 ring-[#1c2025]">
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">
                      {availableFisioCandidate.name}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700]">
                      Slot Disponível
                    </span>
                  </div>
                  <span className="text-xs text-[#0066ff] font-semibold">
                    {availableFisioCandidate.registration}
                  </span>
                  <span className="text-[11px] text-[#4edea3] font-medium mt-0.5">
                    Incluso no seu Plano SOMMA Pro (Sem custo extra)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#ffb59d]/15 text-[#ffb59d] px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0">
                <Star className="w-3 h-3 fill-[#ffb59d]" />
                <span>{availableFisioCandidate.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-xs text-[#c2c6d8] leading-relaxed">
              Ative o Dr. Lucas Ferraz para acompanhamento de mobilidade escapular, manguito rotador e prevenção de sobrecarga articular no supino pesado.
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-[#262a30]/60">
              <button
                type="button"
                onClick={() => onAssignToSlot(availableFisioCandidate)}
                className="flex-1 h-10 px-3 rounded-xl bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0054d6] hover:to-[#0047b3] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>Ativar no Meu Plano</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectProfessional(availableFisioCandidate)}
                className="h-10 px-3.5 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#b3c5ff] hover:text-white border border-[#262a30] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Perfil</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Accordion / Toggle: Explore Credentialed Specialists for Swapping */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowDirectory(!showDirectory)}
          className="p-3.5 rounded-2xl bg-[#181c21] hover:bg-[#1c2025] border border-[#262a30] flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-[#0066ff]" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white">
                Outros Especialistas Credenciados SOMMA
              </span>
              <span className="text-[11px] text-[#8c90a1]">
                Consulte profissionais para eventual troca técnica de responsável
              </span>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-[#8c90a1] transition-transform duration-200 ${
              showDirectory ? 'rotate-90' : ''
            }`}
          />
        </button>

        {showDirectory && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#8c90a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar especialista por nome, área ou registro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#181c21] border border-[#262a30] text-white text-xs placeholder:text-[#8c90a1] focus:border-[#0066ff] outline-none"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
                }`}
              >
                Todos
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('personal')}
                className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'personal'
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
                }`}
              >
                <Dumbbell className="w-3 h-3" />
                <span>Treinadores</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('nutri')}
                className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'nutri'
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
                }`}
              >
                <Utensils className="w-3 h-3" />
                <span>Nutricionistas</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('fisio')}
                className={`h-7 px-3 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  selectedCategory === 'fisio'
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-[#181c21] text-[#8c90a1] hover:text-white border border-[#262a30]'
                }`}
              >
                <HeartPulse className="w-3 h-3" />
                <span>Fisioterapeutas</span>
              </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {otherProfessionals.map((prof) => (
                <div
                  key={prof.id}
                  className="p-3.5 rounded-xl bg-[#1c2025] border border-[#262a30] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#31353b] bg-[#262a30] shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{prof.name}</span>
                        {prof.isLinkedToUserPlan && (
                          <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-[#4edea3]/20 text-[#4edea3]">
                            Ativo
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#0066ff]">{prof.registration}</span>
                      <span className="text-[10px] text-[#8c90a1] truncate">{prof.title}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProfessional(prof)}
                    className="h-8 px-3 rounded-lg bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-medium flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Ver</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SOMMA Guarantee & Medical Support Stamp */}
      <div className="p-4 rounded-2xl bg-[#181c21] border border-[#262a30] flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-[#4edea3] shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">Validação Técnica SOMMA+</span>
          <span className="text-[11px] text-[#8c90a1] leading-tight mt-0.5">
            Garantia de 1 profissional de referência por área com conselho regional ativo (CREF, CRN, CREFITO) e alinhamento biomecânico em tempo real.
          </span>
        </div>
      </div>

    </div>
  );
};
