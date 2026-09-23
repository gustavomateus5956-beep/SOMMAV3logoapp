import React, { useState } from 'react';
import { 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Bell, 
  Dumbbell, 
  Activity, 
  Flame, 
  Trophy, 
  HeartPulse, 
  Building2, 
  Calendar, 
  Award 
} from 'lucide-react';
import { PageHeader } from './PageHeader';

export const PassView: React.FC = () => {
  const [notified, setNotified] = useState(false);

  // Conceptual future categories under study (no real or fictional partners)
  const conceptualCategories = [
    {
      id: 'academias',
      name: 'Academias',
      description: 'Estruturas de musculação e treinamento de força',
      icon: Dumbbell,
      color: '#0066ff'
    },
    {
      id: 'estudios',
      name: 'Estúdios',
      description: 'Espaços focados em funcional, bike indoor, yoga e pilates',
      icon: Activity,
      color: '#4edea3'
    },
    {
      id: 'boxes',
      name: 'Boxes',
      description: 'Centros de cross training e condicionamento metabólico',
      icon: Flame,
      color: '#ffb59d'
    },
    {
      id: 'centros',
      name: 'Centros esportivos',
      description: 'Complexos com pistas, quadras e modalidades esportivas',
      icon: Trophy,
      color: '#b3c5ff'
    },
    {
      id: 'clinicas',
      name: 'Clínicas',
      description: 'Serviços de fisioterapia, recovery e biomecânica',
      icon: HeartPulse,
      color: '#4edea3'
    },
    {
      id: 'parceiros',
      name: 'Parceiros',
      description: 'Marcas de suplementação, vestuário e produtos de performance',
      icon: Building2,
      color: '#0066ff'
    },
    {
      id: 'eventos',
      name: 'Eventos',
      description: 'Competições, encontros de treino e workshops esportivos',
      icon: Calendar,
      color: '#ffb59d'
    },
    {
      id: 'beneficios',
      name: 'Benefícios',
      description: 'Condições exclusivas e incentivos no ecossistema SOMMA',
      icon: Award,
      color: '#b3c5ff'
    }
  ];

  return (
    <div className="flex flex-col w-full gap-5 pb-24 md:pb-12 max-w-[480px] md:max-w-none mx-auto">
      {/* Top Banner / Header: PageHeader */}
      <PageHeader
        category="PROJETO & EXPANSÃO"
        title="SOMMA Pass"
        subtitle="Ecossistema conceitual de acesso esportivo e benefícios em validação de mercado"
        badge={
          <span className="px-2.5 py-1 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] text-[10px] font-extrabold uppercase tracking-wide border border-[#0066ff]/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse"></span>
            Em breve
          </span>
        }
      />

      {/* Concept Presentation Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c2025] via-[#161a20] to-[#101419] p-6 border border-[#262a30] shadow-lg flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#b3c5ff]">
          <Sparkles className="w-4 h-4 text-[#0066ff]" />
          <span>Projeto Conceitual em Estudo</span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
            Acesso integrado a múltiplos espaços e benefícios para atletas.
          </h2>
          <p className="text-xs md:text-sm text-[#8c90a1] leading-relaxed">
            O <strong>SOMMA Pass</strong> é um projeto futuro concebido para conectar atletas a espaços de treinamento,
            saúde e vantagens exclusivas em uma única experiência.
          </p>
          <p className="text-xs md:text-sm text-[#8c90a1] leading-relaxed">
            A operação comercial, o modelo de acesso e os acordos de parceria serão validados por meio de pesquisa
            de mercado antes de qualquer disponibilidade oficial.
          </p>
        </div>

        {/* Informative Status Banner */}
        <div className="p-3.5 rounded-xl bg-[#181c21] border border-[#262a30]/80 flex items-start sm:items-center gap-3 text-xs text-[#8c90a1]">
          <Info className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-semibold text-white">Status do Projeto:</span>
            <span>Pesquisa de mercado e mapeamento de categorias. Não há rede credenciada ativa no momento.</span>
          </div>
        </div>
      </section>

      {/* Conceptual Categories Under Study */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5 px-1">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Categorias em Estudo para Futura Integração
          </h3>
          <span className="text-[11px] text-[#8c90a1]">
            Segmentos contemplados na pesquisa de mercado do ecossistema SOMMA Pass:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {conceptualCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="p-4 rounded-2xl bg-[#1c2025] border border-[#262a30] flex flex-col gap-2.5 shadow-sm"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{category.name}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#262a30] text-[#8c90a1]">
                      Estudo
                    </span>
                  </div>
                  <span className="text-xs text-[#8c90a1] leading-relaxed">
                    {category.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Early Access & Market Research Notification Box */}
      <section className="p-5 rounded-2xl bg-[#1c2025] border border-[#262a30] flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Pesquisa de Interesse & Lançamento</span>
            <span className="text-xs text-[#8c90a1]">
              Acompanhe os avanços e ajude a indicar regiões e segmentos prioritários para o SOMMA Pass.
            </span>
          </div>
        </div>

        {notified ? (
          <div className="p-3 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center gap-2 text-xs font-semibold text-[#4edea3]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Seu interesse foi registrado com sucesso! Você receberá atualizações sobre a pesquisa.</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNotified(true)}
            className="w-full h-11 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#0066ff]/20"
          >
            <Bell className="w-4 h-4" />
            <span>Quero acompanhar novidades do SOMMA Pass</span>
          </button>
        )}
      </section>
    </div>
  );
};

