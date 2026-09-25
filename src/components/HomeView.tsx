import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Flame, 
  Timer, 
  Dumbbell, 
  TrendingUp, 
  Check, 
  Minus, 
  Clock, 
  Users, 
  ChevronRight, 
  Award, 
  MessageSquare, 
  Utensils, 
  CheckCircle2, 
  Eye, 
  RotateCcw,
  Sparkles,
  Droplet,
  Plus
} from 'lucide-react';
import { TabType, Routine, WorkoutSessionRecord, FeedPost } from '../types';
import { INITIAL_ROUTINES } from '../data/mockData';
import { repositories } from '../data';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutSessionDetailModal } from './WorkoutSessionDetailModal';
import { PageHeader } from './PageHeader';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
  onStartRoutine: (routine: Routine) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onStartRoutine }) => {
  const { user } = useUser();
  const { workoutStatus, maximizeWorkout } = useWorkout();

  // Sessions and routine state
  const [todaySession, setTodaySession] = useState<WorkoutSessionRecord | null>(null);
  const [selectedSessionModal, setSelectedSessionModal] = useState<WorkoutSessionRecord | null>(null);

  // Quick diet water tracking state
  const [waterMl, setWaterMl] = useState(2250);

  // Community preview state
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const plannedRoutine = INITIAL_ROUTINES.find((r) => r.id === 'rotina-a') || INITIAL_ROUTINES[0];
  const userFirstName = user?.name ? user.name.trim().split(' ')[0] : 'Atleta';

  // Dynamic greeting according to time of day
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  // Format date in Brazilian Portuguese
  const rawDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());
  const capitalizedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      repositories.workout
        .getWorkoutHistory(user.id)
        .then((sessions) => {
          if (!isMounted) return;
          const found = sessions.find((s) => s.dateDisplay === 'Hoje' || s.dateDisplay.toLowerCase().includes('hoje'));
          setTodaySession(found || null);
        })
        .catch((err) => {
          console.error('Erro ao recuperar treino de hoje no repositório:', err);
        });
    } else {
      setTodaySession(null);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;
    repositories.community
      .getPosts()
      .then((data) => {
        if (!isMounted) return;
        setPosts(data);
      })
      .catch((err) => {
        console.error('Erro ao recuperar posts da comunidade no repositório:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const latestPost = posts[0] || null;

  return (
    <div className="flex flex-col w-full gap-5 pb-24 md:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0066ff] text-white text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header: Consistent Hierarchy (Data, Saudação) */}
      <PageHeader
        category={capitalizedDate}
        title={`${greeting}, ${userFirstName}`}
      />

      {/* 2. Ações Rápidas (Layout 2x2 no mobile) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
            AÇÕES RÁPIDAS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Registrar Refeição */}
          <button
            type="button"
            onClick={() => onNavigate('dieta')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1c2025] hover:bg-[#262a30] border border-[#262a30] transition-all cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4edea3]/15 text-[#4edea3] flex items-center justify-center group-hover:bg-[#4edea3] group-hover:text-black transition-colors shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-[#4edea3] transition-colors truncate">
                Registrar Refeição
              </span>
              <span className="text-[10px] text-[#8c90a1] truncate">
                Nutrição e macros
              </span>
            </div>
          </button>

          {/* 2. Registrar Peso */}
          <button
            type="button"
            onClick={() => onNavigate('evolucao')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1c2025] hover:bg-[#262a30] border border-[#262a30] transition-all cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ffb59d]/15 text-[#ffb59d] flex items-center justify-center group-hover:bg-[#ffb59d] group-hover:text-black transition-colors shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-[#ffb59d] transition-colors truncate">
                Registrar Peso
              </span>
              <span className="text-[10px] text-[#8c90a1] truncate">
                Atualizar biometria
              </span>
            </div>
          </button>

          {/* 3. Ver Profissionais */}
          <button
            type="button"
            onClick={() => onNavigate('profissionais')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1c2025] hover:bg-[#262a30] border border-[#262a30] transition-all cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0066ff]/15 text-[#0066ff] flex items-center justify-center group-hover:bg-[#0066ff] group-hover:text-white transition-colors shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-[#b3c5ff] transition-colors truncate">
                Ver Profissionais
              </span>
              <span className="text-[10px] text-[#8c90a1] truncate">
                Equipe dedicada
              </span>
            </div>
          </button>

          {/* 4. Publicar Treino */}
          <button
            type="button"
            onClick={() => onNavigate('comunidade')}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1c2025] hover:bg-[#262a30] border border-[#262a30] transition-all cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#b3c5ff]/15 text-[#b3c5ff] flex items-center justify-center group-hover:bg-[#0066ff] group-hover:text-white transition-colors shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white group-hover:text-[#b3c5ff] transition-colors truncate">
                Publicar Treino
              </span>
              <span className="text-[10px] text-[#8c90a1] truncate">
                Feed comunitário
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Card do Treino (Concluído ou Treino de Hoje) */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1c2025] p-5 flex flex-col gap-4 border border-[#262a30] shadow-lg">
        {todaySession ? (
          /* Quando o treino de hoje já foi concluído */
          <>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-extrabold uppercase tracking-wider">
                    Treino Concluído
                  </span>
                  <span className="text-[#424656] text-xs">•</span>
                  <span className="text-xs text-[#8c90a1]">{todaySession.dateDisplay}</span>
                </div>
                <h2 className="text-lg md:text-xl font-extrabold text-white mt-1">
                  {todaySession.routineName}
                </h2>
                <span className="text-xs text-[#8c90a1]">
                  {todaySession.muscleGroups || 'Peitoral & Tríceps'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 border border-[#00a572]/30 flex items-center justify-center text-[#4edea3]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#262a30]/60 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8c90a1] font-semibold uppercase">Duração</span>
                <span className="text-sm font-bold text-white">{todaySession.durationFormatted}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8c90a1] font-semibold uppercase">Volume</span>
                <span className="text-sm font-bold text-[#4edea3] tabular-nums">
                  {todaySession.totalVolume.toLocaleString()} kg
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8c90a1] font-semibold uppercase">Séries</span>
                <span className="text-sm font-bold text-[#b3c5ff]">
                  {todaySession.totalCompletedSets} feitas
                </span>
              </div>
            </div>

            {/* Actions: Altura consistente, textos centralizados, sem quebra ou overflow em 375px */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedSessionModal(todaySession)}
                className="h-11 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer px-2"
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span className="truncate">Ver Resumo</span>
              </button>

              <button
                type="button"
                onClick={() => onStartRoutine(plannedRoutine)}
                className="h-11 rounded-xl bg-[#0066ff]/20 hover:bg-[#0066ff]/30 text-[#b3c5ff] border border-[#0066ff]/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer px-2"
                title="Iniciar outro treino hoje"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Treinar Novamente</span>
              </button>
            </div>
          </>
        ) : (
          /* Quando o treino de hoje está pendente */
          <>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] text-[11px] font-bold uppercase tracking-wider">
                    Treino de Hoje
                  </span>
                  <span className="text-[#424656] text-xs">•</span>
                  <span className="text-xs text-[#c2c6d8] font-semibold">
                    {plannedRoutine.category || 'Foco Hipertrofia'}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-extrabold text-white mt-1">
                  {plannedRoutine.name}
                </h2>
                <span className="text-xs text-[#8c90a1]">
                  {plannedRoutine.muscleGroups || 'Peitoral & Tríceps'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#262a30] text-[#c2c6d8] text-xs font-semibold">
                Hoje
              </span>
            </div>

            {/* Specs Ribbon */}
            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 py-2 border-y border-[#262a30]/60 text-xs text-[#c2c6d8]">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-[#8c90a1]" />
                <span>
                  <strong className="text-white font-semibold">~{plannedRoutine.estimatedMinutes} min</strong> est.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#8c90a1]" />
                <span>
                  <strong className="text-white font-semibold">{plannedRoutine.exercisesCount}</strong> exercícios
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4edea3]" />
                <span>
                  <strong className="text-[#4edea3] font-semibold">Sobrecarga:</strong> +2.5 kg
                </span>
              </div>
            </div>

            {/* Primary Workout CTA */}
            {workoutStatus === 'minimized' ? (
              <button
                type="button"
                onClick={maximizeWorkout}
                className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#0066ff] to-[#0054d6] hover:brightness-110 active:scale-[0.98] text-white text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0066ff]/20 transition-all cursor-pointer animate-pulse"
              >
                <RotateCcw className="w-5 h-5" />
                <span>RETOMAR TREINO EM ANDAMENTO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onStartRoutine(plannedRoutine)}
                className="w-full h-[52px] rounded-xl bg-[#0066ff] hover:bg-[#0054d6] active:scale-[0.98] text-white text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>COMEÇAR TREINO</span>
              </button>
            )}

            {/* Direct link to Treino tab */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <span className="text-[#8c90a1] text-[11px]">Periodização ativa da semana</span>
              <button
                type="button"
                onClick={() => onNavigate('treino')}
                className="text-xs text-[#0066ff] hover:text-[#b3c5ff] font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Abrir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* 4. Consistência da Semana */}
      <section className="flex flex-col gap-3 rounded-2xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Consistência da Semana</span>
            <span className="text-[#424656] text-xs">•</span>
            <span className="text-xs text-[#8c90a1]">Semana 21</span>
          </div>
          <span className="text-xs text-[#4edea3] font-semibold">4 de 5 treinos</span>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {/* SEG */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#262a30]">
            <span className="text-[10px] font-bold text-[#8c90a1]">SEG</span>
            <div className="w-6 h-6 rounded-full bg-[#00a572] flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          {/* TER */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#262a30]">
            <span className="text-[10px] font-bold text-[#8c90a1]">TER</span>
            <div className="w-6 h-6 rounded-full bg-[#00a572] flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          {/* QUA (Rest) */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#262a30]">
            <span className="text-[10px] font-bold text-[#8c90a1]">QUA</span>
            <div className="w-6 h-6 rounded-full bg-[#101419] flex items-center justify-center text-[#8c90a1]">
              <Minus className="w-3.5 h-3.5" />
            </div>
          </div>
          {/* QUI */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#262a30]">
            <span className="text-[10px] font-bold text-[#8c90a1]">QUI</span>
            <div className="w-6 h-6 rounded-full bg-[#00a572] flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          {/* SEX */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#262a30]">
            <span className="text-[10px] font-bold text-[#8c90a1]">SEX</span>
            <div className="w-6 h-6 rounded-full bg-[#00a572] flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          {/* SAB (Today) */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#31353b] ring-1 ring-[#0066ff]/40">
            <span className="text-[10px] font-bold text-[#b3c5ff]">SÁB</span>
            <div className="w-6 h-6 rounded-full bg-[#0066ff]/25 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0066ff] animate-pulse"></span>
            </div>
          </div>
          {/* DOM */}
          <div className="flex flex-col items-center gap-1.5 py-2 rounded-xl bg-[#262a30] opacity-40">
            <span className="text-[10px] font-bold text-[#8c90a1]">DOM</span>
            <div className="w-6 h-6 rounded-full bg-[#101419] flex items-center justify-center text-[#8c90a1]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Resumo da Dieta & Nutrição (Sem badge 'Planejada', CTA 'Abrir') */}
      <section className="rounded-2xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Resumo da Dieta</span>
              <span className="text-[11px] text-[#8c90a1]">Balanço energético de hoje</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('dieta')}
            className="text-xs font-bold text-[#0066ff] hover:text-[#b3c5ff] flex items-center gap-0.5 cursor-pointer"
          >
            <span>Abrir</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Caloric bar */}
        <div className="p-3.5 rounded-xl bg-[#181c21] border border-[#262a30]/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8c90a1]">Consumido hoje</span>
            <span className="font-extrabold text-white">
              <strong className="text-[#4edea3]">1.890</strong> / 2.750 kcal
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#262a30] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00a572] to-[#4edea3] rounded-full" style={{ width: '68%' }} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1.5 text-center text-[11px]">
            <div className="p-1.5 rounded-lg bg-[#262a30]/50 flex flex-col">
              <span className="text-[#8c90a1] text-[10px]">Proteínas</span>
              <span className="font-bold text-white">185g / 200g</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#262a30]/50 flex flex-col">
              <span className="text-[#8c90a1] text-[10px]">Carboidratos</span>
              <span className="font-bold text-white">310g / 330g</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#262a30]/50 flex flex-col">
              <span className="text-[#8c90a1] text-[10px]">Gorduras</span>
              <span className="font-bold text-white">65g / 75g</span>
            </div>
          </div>
        </div>

        {/* Quick Water Tracker */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#181c21] border border-[#262a30]/60 text-xs">
          <div className="flex items-center gap-2.5">
            <Droplet className="w-4 h-4 text-[#0066ff] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[#8c90a1] text-[10px] uppercase font-bold">Hidratação</span>
              <span className="font-extrabold text-white">{waterMl} ml / 3.000 ml</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWaterMl((w) => w + 250);
              showToast('+250ml de água registrados!');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#0066ff]/20 hover:bg-[#0066ff]/30 text-[#b3c5ff] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250ml</span>
          </button>
        </div>
      </section>

      {/* 6. Resumo de Evolução & Performance */}
      <section className="rounded-2xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffb59d]/20 text-[#ffb59d] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Resumo de Evolução</span>
              <span className="text-[11px] text-[#8c90a1]">Cargas, PRs e medidas corporais</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('evolucao')}
            className="text-xs font-bold text-[#0066ff] hover:text-[#b3c5ff] flex items-center gap-0.5 cursor-pointer"
          >
            <span>Abrir</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* PR Card */}
          <div className="p-3.5 rounded-xl bg-[#181c21] border border-[#262a30]/60 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#ffb59d] text-[10px] font-extrabold uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Recorde Pessoal</span>
            </div>
            <span className="text-sm font-extrabold text-white">Supino: 100 kg</span>
            <span className="text-[11px] text-[#4edea3] font-semibold">+4 kg nesta semana</span>
          </div>

          {/* Weight Delta Card */}
          <div className="p-3.5 rounded-xl bg-[#181c21] border border-[#262a30]/60 flex flex-col gap-1">
            <span className="text-[#8c90a1] text-[10px] font-extrabold uppercase">
              Peso Corporal
            </span>
            <span className="text-sm font-extrabold text-white">82.4 kg</span>
            <span className="text-[11px] text-[#4edea3] font-semibold">-0.6 kg (Gordura -1.2%)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#181c21] border border-[#262a30]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0066ff]" />
            <span className="text-[#c2c6d8]">Status: <strong>Progressão Ativa</strong> no ciclo</span>
          </div>
          <span className="text-[#8c90a1] text-[11px]">12.8 ton movidas</span>
        </div>
      </section>

      {/* 7. Preview Simples da Comunidade (Substitui Stories e Feed antigo) */}
      <section className="rounded-2xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Comunidade</span>
              <span className="text-[11px] text-[#8c90a1]">Atividades recentes dos atletas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('comunidade')}
              className="h-8 px-3 rounded-lg bg-[#0066ff]/20 hover:bg-[#0066ff]/30 text-[#b3c5ff] text-xs font-bold transition-colors cursor-pointer"
            >
              Publicar
            </button>
            <button
              type="button"
              onClick={() => onNavigate('comunidade')}
              className="h-8 px-3 rounded-lg bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Abrir</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Publicação recente única */}
        {latestPost ? (
          <div 
            onClick={() => onNavigate('comunidade')}
            className="p-3.5 rounded-xl bg-[#181c21] border border-[#262a30]/60 flex flex-col gap-2.5 cursor-pointer hover:border-[#31353b] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={latestPost.authorAvatar}
                  alt={`Foto de ${latestPost.authorName}`}
                  className="w-8 h-8 rounded-full object-cover bg-[#262a30] shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{latestPost.authorName}</span>
                  <span className="text-[10px] text-[#8c90a1]">{latestPost.timeAgo || latestPost.createdAt || 'Recente'}</span>
                </div>
              </div>

              {latestPost.workoutData && (
                <span className="text-[10px] font-extrabold text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded-full">
                  {latestPost.workoutData.routineName}
                </span>
              )}
            </div>

            <p className="text-xs text-[#c2c6d8] line-clamp-2 leading-relaxed">
              {latestPost.caption || latestPost.content}
            </p>

            <div className="flex items-center gap-4 text-xs text-[#8c90a1] pt-1 border-t border-[#262a30]/50">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#ffb59d]" />
                {latestPost.likesCount ?? latestPost.cheerCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {latestPost.commentsCount ?? latestPost.comments?.length ?? 0}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#181c21] border border-[#262a30]/60 text-center text-xs text-[#8c90a1]">
            Nenhuma publicação recente. Conecte-se com outros atletas!
          </div>
        )}
      </section>

      {/* Historical Session Detail Modal */}
      {selectedSessionModal && (
        <WorkoutSessionDetailModal
          session={selectedSessionModal}
          onClose={() => setSelectedSessionModal(null)}
          onRepeatWorkout={() => {
            onStartRoutine(plannedRoutine);
            setSelectedSessionModal(null);
          }}
        />
      )}
    </div>
  );
};
