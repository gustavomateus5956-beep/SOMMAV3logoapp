import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle, 
  Award, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  Dumbbell,
  Utensils,
  HeartPulse
} from 'lucide-react';
import { Professional } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';

interface ProfessionalDetailModalProps {
  professional: Professional | null;
  onClose: () => void;
  onOpenChat: (professional: Professional) => void;
  onNavigateToTab?: (tab: 'treino' | 'dieta') => void;
  onAssignToSlot?: (professional: Professional) => void;
  currentPersonalName?: string;
  currentNutriName?: string;
  currentFisioName?: string;
}

export const ProfessionalDetailModal: React.FC<ProfessionalDetailModalProps> = ({
  professional,
  onClose,
  onOpenChat,
  onNavigateToTab,
  onAssignToSlot,
  currentPersonalName = 'Dr. Rodrigo Menezes',
  currentNutriName = 'Dra. Camila Vasconcelos',
  currentFisioName = ''
}) => {
  useScrollLock(!!professional);

  if (!professional) return null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const isLinked = professional.isLinkedToUserPlan;
  const isFisioAvailable = professional.category === 'fisio' && !professional.isLinkedToUserPlan && !currentFisioName;

  const currentOccupant = professional.category === 'personal'
    ? currentPersonalName
    : professional.category === 'nutri'
    ? currentNutriName
    : currentFisioName;

  const isCompetingSlot = !isLinked && currentOccupant && currentOccupant !== professional.name;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-end md:items-center p-0 md:p-4 overscroll-contain">
      <div className="w-full max-w-[500px] h-[94vh] md:h-[90vh] bg-[#101419] border border-[#262a30] rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250 overscroll-contain">
        
        {/* Sticky Header Nav */}
        <div className="px-5 py-3.5 bg-[#181c21] border-b border-[#262a30] flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0066ff]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {isLinked ? 'Seu Especialista Ativo' : 'Especialista Credenciado'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="w-8 h-8 rounded-full bg-[#262a30] hover:bg-[#31353b] flex items-center justify-center text-[#c2c6d8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          
          {/* Plan Compatibility Badge */}
          {isLinked ? (
            <div className="p-3 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] shrink-0 animate-pulse"></span>
                <span className="text-xs font-bold text-[#4edea3] truncate">
                  Incluso no seu Plano SOMMA Pro
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] uppercase shrink-0">
                100% Ativo
              </span>
            </div>
          ) : isFisioAvailable ? (
            <div className="p-3 rounded-xl bg-[#0066ff]/10 border border-[#0066ff]/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
                <span className="text-xs font-bold text-white truncate">
                  Slot de Fisioterapia disponível no seu plano
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] uppercase shrink-0">
                Incluso
              </span>
            </div>
          ) : isCompetingSlot ? (
            <div className="p-3 rounded-xl bg-[#181c21] border border-[#31353b] flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#8c90a1] shrink-0" />
              <div className="flex flex-col text-xs leading-tight">
                <span className="text-white font-semibold">Opção de troca para o seu plano</span>
                <span className="text-[#8c90a1] text-[11px]">
                  Atualmente você trabalha com {currentOccupant} nesta área.
                </span>
              </div>
            </div>
          ) : null}

          {/* Hero Profile Block */}
          <div className="flex items-start gap-4 pb-2 border-b border-[#262a30]/60">
            <div className="relative shrink-0">
              <img
                src={professional.detailAvatar || professional.avatar}
                alt={`Foto de perfil de ${professional.name}`}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#0066ff]/40 bg-[#262a30]"
              />
              {professional.verified && (
                <div className="absolute -bottom-1 -right-1 bg-[#0066ff] text-white rounded-full p-0.5 ring-2 ring-[#101419]">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {professional.name}
              </h2>
              <span className="text-xs font-semibold text-[#0066ff] mt-0.5">
                {professional.registration}
              </span>
              <p className="text-xs text-[#8c90a1] mt-0.5">{professional.title}</p>

              {/* Rating & reviews badge */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center gap-1 bg-[#ffb59d]/15 text-[#ffb59d] px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#ffb59d]" />
                  <span>{professional.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-[#8c90a1]">
                  ({professional.reviewCount} avaliações)
                </span>
              </div>
            </div>
          </div>

          {/* Experience Statistics */}
          <div className="grid grid-cols-3 gap-2 bg-[#181c21] p-3 rounded-xl border border-[#262a30]/70 text-center">
            <div>
              <span className="text-[10px] text-[#8c90a1] uppercase block font-semibold">Experiência</span>
              <span className="text-sm font-extrabold text-white">{professional.experienceYears || 8} anos</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8c90a1] uppercase block font-semibold">Alunos Ativos</span>
              <span className="text-sm font-extrabold text-[#4edea3]">{professional.activeStudents || 100}+</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8c90a1] uppercase block font-semibold">Regra SOMMA</span>
              <span className="text-xs font-bold text-[#b3c5ff]">1 por Área</span>
            </div>
          </div>

          {/* Active Prescription Card (When Linked) */}
          {isLinked && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181c21] to-[#12161c] border border-[#0066ff]/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#0066ff] tracking-wider">
                  Prescrição Ativa no App
                </span>
                <span className="text-[11px] text-[#4edea3] font-bold">Sincronizado</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0066ff]/20 flex items-center justify-center shrink-0">
                  {professional.category === 'personal' ? (
                    <Dumbbell className="w-4 h-4 text-[#0066ff]" />
                  ) : professional.category === 'nutri' ? (
                    <Utensils className="w-4 h-4 text-[#0066ff]" />
                  ) : (
                    <HeartPulse className="w-4 h-4 text-[#0066ff]" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white">
                    {professional.prescriptionSummary || 'Acompanhamento integrado na SOMMA+'}
                  </span>
                  <span className="text-[11px] text-[#8c90a1] mt-0.5">
                    Próximo check-in: {professional.nextCheckInDate || 'Esta semana'}
                  </span>
                </div>
              </div>

              {/* Action buttons inside the card */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#262a30]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(professional);
                  }}
                  className="flex-1 h-9 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Conversar no Chat</span>
                </button>

                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToTab(professional.category === 'personal' ? 'treino' : 'dieta');
                    }}
                    className="h-9 px-3 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Ver no App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bio & Focus */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sobre a Metodologia</h3>
            <p className="text-xs text-[#c2c6d8] leading-relaxed">
              {professional.bio || professional.focusAreas}
            </p>
          </div>

          {/* Specialties Pills */}
          {professional.specialties && professional.specialties.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pilares Técnicos</h3>
              <div className="flex flex-wrap gap-1.5">
                {professional.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 rounded-lg bg-[#262a30] text-[#c2c6d8] text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews section */}
          {professional.reviews && professional.reviews.length > 0 && (
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Avaliações de Atletas SOMMA
                </h3>
                <span className="text-xs text-[#b3c5ff] font-semibold">100% Verificados</span>
              </div>

              <div className="space-y-2.5">
                {professional.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-[#181c21] border border-[#262a30]/70 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-7 h-7 rounded-full object-cover bg-[#262a30]"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{rev.author}</span>
                          <span className="text-[10px] text-[#8c90a1]">{rev.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#ffb59d] text-[#ffb59d]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#c2c6d8] italic">"{rev.comment}"</p>

                    {rev.achievement && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded w-fit">
                        <Award className="w-3 h-3" />
                        <span>{rev.achievement}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions - Tailored to Plan State (NO HIRE / NO PRICE) */}
        <div className="p-4 bg-[#181c21] border-t border-[#262a30] flex items-center justify-between gap-3 shrink-0">
          {isLinked ? (
            <>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#4edea3]">Profissional Ativo</span>
                <span className="text-xs font-bold text-white truncate">
                  {professional.assignedAreaName || professional.categoryLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(professional);
                  }}
                  className="h-11 px-5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat com {professional.name.split(' ')[0]}</span>
                </button>
              </div>
            </>
          ) : isFisioAvailable ? (
            <>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#0066ff]">Slot Disponível</span>
                <span className="text-xs font-bold text-white truncate">
                  Incluso no Plano SOMMA Pro
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onAssignToSlot) {
                    onAssignToSlot(professional);
                    showNotification(`${professional.name} ativado(a) como seu especialista de Fisioterapia!`);
                  }
                }}
                className="h-11 px-5 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ativar no Meu Plano</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#8c90a1]">Limite: 1 por Área</span>
                <span className="text-xs font-bold text-white truncate">
                  Substituição Técnica
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onAssignToSlot) {
                    onAssignToSlot(professional);
                    showNotification(`Solicitação de troca enviada! ${professional.name} assumirá seu acompanhamento de ${professional.categoryLabel}.`);
                  }
                }}
                className="h-11 px-4 rounded-xl bg-[#262a30] hover:bg-[#31353b] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Trocar Especialista no Plano</span>
              </button>
            </>
          )}
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="absolute top-16 left-4 right-4 bg-[#00a572] text-white p-3 rounded-xl shadow-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top duration-200 z-50 text-center">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
};
