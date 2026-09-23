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
  Search, 
  Utensils, 
  HeartPulse, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  RotateCcw,
  Sparkles,
  Droplet,
  Send,
  Copy,
  Plus
} from 'lucide-react';
import { TabType, Routine, WorkoutSessionRecord, RoutineFlash, FeedPost, Comment } from '../types';
import { INITIAL_ROUTINES, MOCK_DAILY_ROUTINES, MOCK_POSTS } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { storageService } from '../services/storageService';
import { WorkoutSessionDetailModal } from './WorkoutSessionDetailModal';
import { RoutineViewerModal } from './RoutineViewerModal';
import { PageHeader } from './PageHeader';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
  onStartRoutine: (routine: Routine) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onStartRoutine }) => {
  const { user } = useUser();
  const { workoutStatus, activeSession, maximizeWorkout } = useWorkout();

  // Sessions and routine state
  const [todaySession, setTodaySession] = useState<WorkoutSessionRecord | null>(null);
  const [selectedSessionModal, setSelectedSessionModal] = useState<WorkoutSessionRecord | null>(null);

  // Quick diet water tracking state
  const [waterMl, setWaterMl] = useState(2250);

  // Stories and Feed integration state
  const [routinesStories] = useState<RoutineFlash[]>(MOCK_DAILY_ROUTINES);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    const saved = storageService.getCommunityPosts();
    return saved.length > 0 ? saved : MOCK_POSTS;
  });
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedRoutineId, setCopiedRoutineId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const plannedRoutine = INITIAL_ROUTINES.find((r) => r.id === 'rotina-a') || INITIAL_ROUTINES[0];
  const userFirstName = user?.name ? user.name.trim().split(' ')[0] : 'Atleta';
  const streakDays = user?.streakDays ?? 14;

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
    if (user?.id) {
      const sessions = storageService.getWorkoutSessions(user.id);
      const found = sessions.find((s) => s.dateDisplay === 'Hoje' || s.dateDisplay.toLowerCase().includes('hoje'));
      setTodaySession(found || null);
    } else {
      setTodaySession(null);
    }
  }, [user?.id]);

  // Handle post cheer / like
  const handleToggleCheer = (postId: string) => {
    const { likesCount, isLiked } = storageService.toggleLikePost(postId, user?.id || 'user_lucas_default');
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked,
            likesCount,
            userCheered: isLiked,
            cheerCount: likesCount,
          };
        }
        return post;
      })
    );
  };

  // Handle add comment to post
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    const authorName = user?.name || 'Lucas Andrade';
    const authorAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      authorName,
      authorAvatar,
      content: commentInput.trim(),
      text: commentInput.trim(),
      createdAt: 'Agora',
    };

    const updatedComments = storageService.addCommentToPost(postId, newComment);

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: updatedComments.length,
            comments: updatedComments,
          };
        }
        return post;
      })
    );

    setCommentInput('');
    showToast('Comentário publicado no feed!');
  };

  const handleCopyRoutine = (routineTitle: string) => {
    setCopiedRoutineId(routineTitle);
    showToast(`Rotina "${routineTitle}" copiada para seus treinos!`);
    setTimeout(() => setCopiedRoutineId(null), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-24 md:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0066ff] text-white text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header: Consistent Hierarchy (Category, Title) */}
      <PageHeader
        category={capitalizedDate}
        title={`${greeting}, ${userFirstName}`}
      />

      {/* 2. Ações Rápidas (Primeiro Bloco Funcional da Home) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold text-[#8c90a1] uppercase tracking-wider">
            Ações Rápidas
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

      {/* 4. Planned Workout Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1c2025] p-5 flex flex-col gap-4 border border-[#262a30] shadow-lg">
        {todaySession ? (
          /* When today's workout has already been completed */
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

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedSessionModal(todaySession)}
                className="flex-1 h-[48px] rounded-xl bg-[#262a30] hover:bg-[#31353b] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Resumo do Treino</span>
              </button>

              <button
                type="button"
                onClick={() => onStartRoutine(plannedRoutine)}
                className="h-[48px] px-4 rounded-xl bg-[#0066ff]/20 hover:bg-[#0066ff]/30 text-[#b3c5ff] border border-[#0066ff]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Iniciar outro treino hoje"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Treinar Novamente</span>
              </button>
            </div>
          </>
        ) : (
          /* When workout is pending */
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
                <span>Ver Ficha Completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* 5. Weekly Consistency Tracker */}
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

      {/* 6. Resumo da Dieta & Nutrição */}
      <section className="rounded-2xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Resumo da Dieta</span>
                <span className="text-[9px] font-extrabold bg-[#00a572]/20 text-[#4edea3] px-2 py-0.5 rounded-full border border-[#00a572]/30">
                  Planejada
                </span>
              </div>
              <span className="text-[11px] text-[#8c90a1]">Balanço energético de hoje</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('dieta')}
            className="text-xs font-bold text-[#0066ff] hover:text-[#b3c5ff] flex items-center gap-0.5 cursor-pointer"
          >
            Abrir Dieta
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

      {/* 7. Resumo de Evolução & Performance */}
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
            Ver Evolução
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

      {/* 8. SOMMA Pass (Preview & Atalho Conceitual - Em Breve) */}
      <section className="rounded-2xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">SOMMA Pass</span>
                <span className="px-2 py-0.5 rounded-full bg-[#0066ff]/20 text-[#b3c5ff] text-[10px] font-extrabold uppercase tracking-wide border border-[#0066ff]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse"></span>
                  Em breve
                </span>
              </div>
              <span className="text-[11px] text-[#8c90a1]">Conceito de acesso esportivo integrado</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('pass')}
            className="text-xs font-bold text-[#0066ff] hover:text-[#b3c5ff] flex items-center gap-0.5 cursor-pointer"
          >
            <span>Ver Conceito</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#181c21] border border-[#262a30]/60 flex items-center justify-between gap-3 text-xs">
          <span className="text-[#8c90a1] text-xs leading-relaxed">
            Projeto em pesquisa de mercado para conexão futura com estúdios, boxes, centros esportivos e benefícios exclusivos.
          </span>
          <button
            type="button"
            onClick={() => onNavigate('pass')}
            className="px-3 py-1.5 rounded-lg bg-[#262a30] hover:bg-[#31353b] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
          >
            Saiba mais
          </button>
        </div>
      </section>

      {/* 9. Feed SOMMA Integrado (Stories + Posts com Acesso à Comunidade Completa) */}
      <section className="flex flex-col gap-4 rounded-3xl bg-[#1c2025] p-5 border border-[#262a30] shadow-sm">
        {/* Feed Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0066ff]" />
            <div className="flex flex-col">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Feed SOMMA
              </h2>
              <span className="text-[11px] text-[#8c90a1]">Atividades e rotinas dos atletas</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('comunidade')}
            className="text-xs font-bold text-[#0066ff] hover:text-[#b3c5ff] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#0066ff]/10 transition-colors cursor-pointer"
          >
            <span>Ver Comunidade Completa</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stories / Rotinas Rápidas Bar */}
        <div className="flex flex-col gap-2 pt-1 border-t border-[#262a30]/60">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8c90a1]">
            Rotinas Rápidas dos Atletas
          </span>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {routinesStories.map((story, idx) => {
              const isViewed = story.viewed ?? false;

              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    storageService.markStoryViewed(story.id);
                    setViewingStoryIndex(idx);
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group cursor-pointer"
                >
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                        isViewed
                          ? 'ring-2 ring-[#424656]'
                          : 'ring-2 ring-[#0066ff] ring-offset-2 ring-offset-[#101419]'
                      }`}
                    >
                      <img
                        src={story.authorAvatar}
                        alt={`Story de ${story.authorName}`}
                        className="w-full h-full rounded-full object-cover bg-[#262a30]"
                      />
                    </div>
                    {story.authorVerified && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0066ff] text-white flex items-center justify-center text-[9px] font-bold shadow-md">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-[#c2c6d8] truncate max-w-[62px] text-center group-hover:text-white">
                    {story.authorName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Integrated Posts Feed List */}
        <div className="flex flex-col gap-3.5 pt-2">
          {posts.slice(0, 3).map((post) => {
            const isCommentsOpen = activeCommentsPostId === post.id;
            const isCheered = post.isLiked || post.userCheered;
            const cheersCount = post.likesCount ?? post.cheerCount ?? 0;
            const commentsCount = post.commentsCount ?? post.comments?.length ?? 0;
            const postComments = post.comments || [];

            return (
              <article
                key={post.id}
                className="p-4 rounded-2xl bg-[#181c21] border border-[#262a30]/70 flex flex-col gap-3 shadow-sm"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={`Foto de ${post.authorName}`}
                      className="w-10 h-10 rounded-full object-cover bg-[#262a30] shrink-0"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{post.authorName}</span>
                        {post.authorBadge && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#0066ff]/20 text-[#b3c5ff]">
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8c90a1]">{post.timeAgo || post.createdAt}</span>
                    </div>
                  </div>

                  {post.tag1 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#262a30] text-[#c2c6d8] border border-[#31353b]">
                      {post.tag1}
                    </span>
                  )}
                </div>

                {/* Content Text */}
                <p className="text-xs text-[#c2c6d8] leading-relaxed">
                  {post.caption || post.content}
                </p>

                {/* Optional Post Media */}
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-56 bg-black/40 border border-[#262a30]/50">
                    <img
                      src={post.imageUrl}
                      alt="Mídia da postagem"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Routine Card Attachment if present */}
                {post.workoutData && (
                  <div className="p-3 rounded-xl bg-[#14181d] border border-[#262a30] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-[#0066ff]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[11px]">{post.workoutData.routineName}</span>
                        <span className="text-[10px] text-[#8c90a1]">{post.workoutData.totalVolume} kg volume</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyRoutine(post.workoutData?.routineName || 'Rotina')}
                      className="px-2.5 py-1 rounded-lg bg-[#0066ff]/20 hover:bg-[#0066ff]/30 text-[#b3c5ff] text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedRoutineId === post.workoutData.routineName ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                {/* Interactive Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#262a30]/50">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleToggleCheer(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isCheered ? 'text-[#ffb59d]' : 'text-[#8c90a1] hover:text-white'
                      }`}
                    >
                      <Flame className={`w-4 h-4 ${isCheered ? 'fill-[#ffb59d] text-[#ffb59d]' : ''}`} />
                      <span>Dar Força ({cheersCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#8c90a1] hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{commentsCount}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveCommentsPostId(isCommentsOpen ? null : post.id)}
                    className="text-xs text-[#8c90a1] hover:text-white cursor-pointer font-medium"
                  >
                    {isCommentsOpen ? 'Fechar' : 'Comentar'}
                  </button>
                </div>

                {/* Inline Comments Section */}
                {isCommentsOpen && (
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-[#262a30]/40 animate-in fade-in duration-150">
                    {/* Comments List */}
                    {postComments.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                        {postComments.map((c) => (
                          <div key={c.id} className="p-2 rounded-lg bg-[#14181d] text-[11px] flex flex-col gap-0.5">
                            <span className="font-bold text-white">{c.authorName || c.author || 'Usuário'}</span>
                            <span className="text-[#c2c6d8]">{c.content || c.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#8c90a1] italic">Seja o primeiro a comentar.</span>
                    )}

                    {/* Comment Input Form */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Escreva um incentivo..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        className="flex-1 h-9 rounded-xl bg-[#14181d] border border-[#262a30] px-3 text-xs text-white placeholder-[#8c90a1] focus:outline-none focus:border-[#0066ff]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="h-9 px-3 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {/* CTA to Full Community View */}
          <button
            type="button"
            onClick={() => onNavigate('comunidade')}
            className="w-full h-11 rounded-xl bg-[#181c21] hover:bg-[#262a30] text-[#b3c5ff] hover:text-white border border-[#262a30] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
          >
            <Users className="w-4 h-4" />
            <span>Ver todos os posts e atletas da comunidade</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Routine Viewer Modal for Stories */}
      {viewingStoryIndex !== null && (
        <RoutineViewerModal
          routines={routinesStories}
          initialIndex={viewingStoryIndex}
          onClose={() => setViewingStoryIndex(null)}
        />
      )}

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
