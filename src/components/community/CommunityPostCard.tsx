import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Dumbbell, 
  TrendingUp, 
  Clock, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Send, 
  Utensils, 
  Camera, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import { CommunityPost, Comment } from '../../types';
import { storageService } from '../../services/storageService';

interface CommunityPostCardProps {
  post: CommunityPost;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  onOpenProfile: (post: CommunityPost) => void;
  onPostUpdated?: (updatedPost: CommunityPost) => void;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  currentUserId = 'user_lucas_default',
  currentUserName = 'Lucas Andrade',
  currentUserAvatar = 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
  onOpenProfile,
  onPostUpdated
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || post.userCheered || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.cheerCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [shareToast, setShareToast] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);

  const handleToggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    const nextCount = nextState ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLikesCount(nextCount);

    const result = storageService.toggleLikePost(post.id, currentUserId);
    if (onPostUpdated) {
      onPostUpdated({
        ...post,
        isLiked: result.isLiked,
        likesCount: result.likesCount,
        userCheered: result.isLiked,
        cheerCount: result.likesCount
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      userId: currentUserId,
      authorName: currentUserName,
      authorHandle: `@${currentUserName.toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: currentUserAvatar,
      content: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = storageService.addCommentToPost(post.id, newComment);
    setComments(updated);
    setNewCommentText('');
    if (onPostUpdated) {
      onPostUpdated({
        ...post,
        comments: updated,
        commentsCount: updated.length
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}#community-post-${post.id}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      } catch {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      }
    } else {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const getTypeBadge = () => {
    switch (post.type) {
      case 'workout':
        return {
          label: 'Treino',
          icon: Dumbbell,
          bg: 'bg-[#0066ff]/15 text-[#79a9ff] border-[#0066ff]/30'
        };
      case 'evolution':
        return {
          label: 'Evolução',
          icon: TrendingUp,
          bg: 'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/30'
        };
      case 'diet':
        return {
          label: 'Alimentação',
          icon: Utensils,
          bg: 'bg-[#ffb59d]/15 text-[#ffb59d] border-[#ffb59d]/30'
        };
      case 'photo':
        return {
          label: 'Foto',
          icon: Camera,
          bg: 'bg-[#b3c5ff]/15 text-[#dae1ff] border-[#b3c5ff]/30'
        };
      default:
        return {
          label: 'Comunidade',
          icon: Sparkles,
          bg: 'bg-[#262a30] text-[#c2c6d8] border-[#32363d]'
        };
    }
  };

  const badgeInfo = getTypeBadge();
  const BadgeIcon = badgeInfo.icon;

  // Support both new workoutData and legacy workoutSummary fields
  const workoutInfo = post.workoutData || (post.duration && post.volume ? {
    routineName: post.title || 'Treino Concluído',
    muscleGroups: post.tag1,
    durationMinutes: parseInt(post.duration) || 50,
    durationFormatted: post.duration,
    totalVolume: parseInt(post.volume.replace(/\D/g, '')) || 8000,
    totalCompletedSets: (post.exercisesCount || 6) * 3,
    totalExercises: post.exercisesCount || 6,
    prsCount: post.prsCount || 0,
    exercisesPreview: post.exercisesPreview
  } : null);

  return (
    <article 
      className="w-full bg-[#101419] border border-[#262a30] hover:border-[#32363d] rounded-2xl overflow-hidden shadow-md transition-all duration-200"
    >
      {/* 1. Header do Autor */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onOpenProfile(post)}
            className="shrink-0 group focus:outline-none cursor-pointer"
            aria-label={`Ver perfil de ${post.authorName}`}
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#262a30] group-hover:ring-[#0066ff] transition-all"
            />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenProfile(post)}
                className="text-xs sm:text-sm font-bold text-white hover:text-[#79a9ff] transition-colors truncate cursor-pointer text-left"
              >
                {post.authorName}
              </button>

              {post.authorVerified && (
                <span 
                  className="w-3.5 h-3.5 rounded-full bg-[#0066ff] text-white flex items-center justify-center text-[8px] font-black shrink-0" 
                  title="Verificado SOMMA"
                >
                  ✓
                </span>
              )}

              {post.authorBadge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#0066ff]/20 text-[#79a9ff] border border-[#0066ff]/30 shrink-0">
                  {post.authorBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#8c90a1] mt-0.5">
              {post.authorHandle && <span>{post.authorHandle}</span>}
              <span>•</span>
              <span className="font-mono text-[10px]">{post.timeAgo}</span>
              {post.location && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline truncate max-w-[120px]">{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tipo de Publicação Badge */}
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${badgeInfo.bg}`}>
          <BadgeIcon className="w-3 h-3 stroke-[2.5]" />
          <span>{badgeInfo.label}</span>
        </div>
      </div>

      {/* 2. Legenda / Conteúdo de Texto */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-xs sm:text-sm text-[#c2c6d8] leading-relaxed whitespace-pre-line">
            {post.caption}
          </p>
        </div>
      )}

      {/* 3. Conteúdo Específico por Tipo */}
      {/* 3A. TREINO CONCLUÍDO (CARD DE TREINO SOMMA) */}
      {workoutInfo && (
        <div className="px-4 pb-3">
          <div className="bg-[#181c21] border border-[#262a30] rounded-xl p-3.5 flex flex-col gap-3">
            {/* Workout Card Header */}
            <div className="flex items-center justify-between border-b border-[#262a30] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0066ff]/20 text-[#0066ff] flex items-center justify-center font-bold">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#79a9ff] block">
                    Treino Concluído
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {workoutInfo.routineName}
                  </h3>
                </div>
              </div>

              {workoutInfo.muscleGroups && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#262a30] text-[#c2c6d8]">
                  {workoutInfo.muscleGroups}
                </span>
              )}
            </div>

            {/* Metric Telemetry Row */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-[#101419] p-2 rounded-lg border border-[#262a30]">
                <span className="text-[10px] text-[#8c90a1] block flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-[#79a9ff]" /> Duração
                </span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  {workoutInfo.durationFormatted || `${workoutInfo.durationMinutes} min`}
                </span>
              </div>

              <div className="bg-[#101419] p-2 rounded-lg border border-[#262a30]">
                <span className="text-[10px] text-[#8c90a1] block flex items-center justify-center gap-1">
                  <Dumbbell className="w-3 h-3 text-[#4edea3]" /> Exercícios
                </span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  {workoutInfo.totalExercises}
                </span>
              </div>

              <div className="bg-[#101419] p-2 rounded-lg border border-[#262a30]">
                <span className="text-[10px] text-[#8c90a1] block flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-[#ffb59d]" /> Volume
                </span>
                <span className="text-xs font-bold text-white mt-0.5 block truncate">
                  {workoutInfo.totalVolume.toLocaleString()} kg
                </span>
              </div>

              {workoutInfo.prsCount ? (
                <div className="bg-[#101419] p-2 rounded-lg border border-[#ffb59d]/30 bg-[#ffb59d]/5 col-span-3 sm:col-span-1">
                  <span className="text-[10px] text-[#ffb59d] font-bold block flex items-center justify-center gap-1">
                    <Trophy className="w-3 h-3 text-[#ffb59d]" /> PRs
                  </span>
                  <span className="text-xs font-bold text-[#ffb59d] mt-0.5 block">
                    +{workoutInfo.prsCount} Novo{workoutInfo.prsCount > 1 ? 's' : ''}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Exercise Preview List */}
            {workoutInfo.exercisesPreview && workoutInfo.exercisesPreview.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-[#262a30]">
                {workoutInfo.exercisesPreview.slice(0, 3).map((ex, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between text-xs py-0.5 text-[#c2c6d8]"
                  >
                    <span className="truncate pr-2 font-medium">{ex.name}</span>
                    <span className="text-[11px] font-mono text-[#8c90a1] shrink-0">
                      {ex.detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3B. EVOLUÇÃO CORPORAL */}
      {post.evolutionData && (
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-br from-[#181c21] to-[#121f1a] border border-[#4edea3]/30 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#4edea3] block">
                    Evolução Registrada
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {post.evolutionData.metricName}
                  </h4>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3]">
                {post.evolutionData.period}
              </span>
            </div>

            {/* Progression Comparison */}
            <div className="bg-[#101419]/80 p-3 rounded-xl border border-[#262a30] flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-[#8c90a1] block">Início</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                  {post.evolutionData.beforeValue}
                </span>
              </div>

              <div className="text-xs font-bold text-[#8c90a1]">→</div>

              <div>
                <span className="text-[10px] text-[#8c90a1] block">Atual</span>
                <span className="text-sm font-bold text-[#4edea3] font-mono mt-0.5 block">
                  {post.evolutionData.currentValue}
                </span>
              </div>

              <div className="border-l border-[#262a30] pl-3">
                <span className="text-[10px] text-[#8c90a1] block">Variação</span>
                <span className="text-xs font-extrabold text-[#4edea3] bg-[#4edea3]/15 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                  {post.evolutionData.changeText}
                </span>
              </div>
            </div>

            {post.evolutionData.secondaryMetric && (
              <div className="text-[11px] text-[#c2c6d8] flex items-center gap-1.5 px-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>{post.evolutionData.secondaryMetric}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3C. FOTO / MÍDIA */}
      {post.imageUrl && (
        <div className="px-4 pb-3">
          <div className="w-full rounded-xl overflow-hidden border border-[#262a30] bg-black max-h-[420px] flex items-center justify-center">
            <img
              src={post.imageUrl}
              alt="Mídia da publicação"
              className="w-full h-auto max-h-[420px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* 4. Barra de Ações Consistente */}
      <div className="px-4 py-2.5 border-t border-[#262a30] flex items-center justify-between bg-[#14181d]">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botão Curtir */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isLiked
                ? 'bg-[#ffb59d]/15 text-[#ffb59d] font-bold scale-105'
                : 'text-[#8c90a1] hover:text-white hover:bg-[#262a30]'
            }`}
            aria-label={isLiked ? 'Descurtir' : 'Curtir'}
          >
            <Heart 
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'fill-[#ffb59d] text-[#ffb59d]' : ''
              }`} 
            />
            <span className="font-mono text-xs">{likesCount}</span>
          </button>

          {/* Botão Comentar */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              showComments
                ? 'bg-[#0066ff]/15 text-[#79a9ff] font-bold'
                : 'text-[#8c90a1] hover:text-white hover:bg-[#262a30]'
            }`}
            aria-label="Ver comentários"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-mono text-xs">{comments.length}</span>
          </button>

          {/* Botão Compartilhar */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#8c90a1] hover:text-white hover:bg-[#262a30] transition-colors cursor-pointer"
            aria-label="Compartilhar publicação"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Compartilhar</span>
          </button>
        </div>

        {/* Botão Salvar */}
        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isSaved ? 'text-[#0066ff]' : 'text-[#8c90a1] hover:text-white'
          }`}
          aria-label={isSaved ? 'Salvo' : 'Salvar'}
          title={isSaved ? 'Salvo nos favoritos' : 'Salvar publicação'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#0066ff]' : ''}`} />
        </button>
      </div>

      {/* Feedback Toast de Compartilhamento */}
      {shareToast && (
        <div className="px-4 py-2 bg-[#0066ff]/15 border-t border-[#0066ff]/30 text-center text-xs font-bold text-[#79a9ff] animate-in fade-in">
          ✓ Link da publicação copiado para a área de transferência!
        </div>
      )}

      {/* 5. Gaveta de Comentários Inline */}
      {showComments && (
        <div className="px-4 py-3 bg-[#0d1116] border-t border-[#262a30] space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* Lista de Comentários */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={c.authorAvatar || c.avatar || currentUserAvatar}
                    alt={c.authorName || c.author || 'Usuário'}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-[#181c21] p-2.5 rounded-xl border border-[#262a30]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-[11px]">
                        {c.authorName || c.author || 'Usuário SOMMA'}
                      </span>
                      {c.authorBadge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0066ff]/20 text-[#79a9ff] font-bold">
                          {c.authorBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[#c2c6d8] leading-relaxed text-[11px]">
                      {c.content || c.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-2 text-[11px] text-[#8c90a1]">
                Seja o primeiro a comentar nesta publicação!
              </p>
            )}
          </div>

          {/* Formulário para Adicionar Comentário */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Escreva um comentário de incentivo..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 h-9 px-3.5 rounded-full bg-[#181c21] border border-[#262a30] text-xs text-white placeholder:text-[#8c90a1] outline-none focus:border-[#0066ff] transition-colors"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="h-9 px-3.5 rounded-full bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span className="hidden sm:inline">Publicar</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
