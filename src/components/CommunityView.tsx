import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { MOCK_LOCAL_ATHLETES, USER_PROFILE } from '../data/mockData';
import { FeedPost, Comment } from '../types';
import { repositories } from '../data';
import { PageHeader } from './PageHeader';
import { CommunityFeedPostCard } from './community/CommunityFeedPostCard';
import { CommunitySuggestedAthletes } from './community/CommunitySuggestedAthletes';
import { CommunityCreateModal } from './community/CommunityCreateModal';
import { useUser } from '../context/UserContext';

interface CommunityViewProps {
  onBack?: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = () => {
  const { user } = useUser();
  const avatarUrl = user?.avatar || USER_PROFILE.avatar;
  const userName = user?.name || USER_PROFILE.name;

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [athletes, setAthletes] = useState(MOCK_LOCAL_ATHLETES);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newCaption, setNewCaption] = useState('');
  const [newMuscleGroup, setNewMuscleGroup] = useState('Peitoral e Ombros');
  const [newHighlightBadge, setNewHighlightBadge] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    repositories.community
      .getPosts()
      .then((data) => {
        if (isMounted) setPosts(data);
      })
      .catch((err) => {
        console.error('Erro ao recuperar posts da comunidade:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleCheer = async (postId: string) => {
    const userId = user?.id || 'user_lucas_default';
    try {
      const { likesCount, isLiked } = await repositories.community.toggleLikePost(postId, userId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked,
              userCheered: isLiked,
              likesCount,
              cheerCount: likesCount
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Erro ao dar força no post:', err);
    }
  };

  const handleCopyRoutine = (postId: string) => {
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleFollowAthlete = (index: number) => {
    setAthletes((prev) =>
      prev.map((a, i) => (i === index ? { ...a, following: !a.following } : a))
    );
  };

  const handleSendComment = async (postId: string) => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      userId: user?.id || 'user_lucas_default',
      authorName: userName,
      authorHandle: user?.username ? `@${user.username}` : '@lucas.andrade',
      authorAvatar: avatarUrl,
      author: userName,
      role: 'Você',
      text: commentInput.trim(),
      content: commentInput.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const updatedComments = await repositories.community.addComment(postId, newComment);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              commentsCount: updatedComments.length || (p.commentsCount + 1),
              comments: updatedComments
            };
          }
          return p;
        })
      );
      setCommentInput('');
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    const newPost: FeedPost = {
      id: `user-post-${Date.now()}`,
      userId: user?.id || 'user_lucas_default',
      type: newPostImage ? 'photo' : 'workout',
      authorName: userName,
      authorHandle: user?.username ? `@${user.username}` : '@lucas.andrade',
      authorBadge: 'Você',
      authorVerified: true,
      authorAvatar: avatarUrl,
      createdAt: new Date().toISOString(),
      timeAgo: 'Agora mesmo',
      location: 'SOMMA Training Lab',
      tag1: 'EVOLUÇÃO',
      tag2: (newMuscleGroup || 'GERAL').toUpperCase(),
      title: newHighlightBadge || 'Treino Concluído com Consistência',
      caption: newCaption.trim() || 'Mais um dia vencido com foco e disciplina!',
      imageUrl: newPostImage || undefined,
      duration: '52 min',
      volume: '7.850 kg',
      exercisesCount: 5,
      prsCount: newHighlightBadge ? 1 : 0,
      exercisesPreview: [
        { name: 'Supino Reto Barra', detail: '4 × 8 @ 96 kg', isPr: !!newHighlightBadge },
        { name: 'Supino Inclinado Halteres', detail: '3 × 10 @ 34 kg' }
      ],
      workoutData: {
        routineName: newHighlightBadge || 'Treino Concluído',
        muscleGroups: newMuscleGroup || 'Peitoral & Ombros',
        durationMinutes: 52,
        durationFormatted: '52 min',
        totalVolume: 7850,
        totalCompletedSets: 12,
        totalExercises: 5,
        prsCount: newHighlightBadge ? 1 : 0,
        prs: newHighlightBadge ? [newHighlightBadge] : []
      },
      likesCount: 1,
      cheerCount: 1,
      isLiked: true,
      userCheered: true,
      commentsCount: 0,
      comments: []
    };

    try {
      await repositories.community.savePost(newPost);
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      console.error('Erro ao salvar publicação na comunidade:', err);
    }

    setNewCaption('');
    setNewPostImage(null);
    setNewHighlightBadge('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col w-full pb-24 md:pb-12 gap-5">
      {/* 1. Header: Clean title without redundant category, duplicate back or badges */}
      <PageHeader
        title="Comunidade"
        subtitle="Compartilhe sua evolução e acompanhe outros atletas."
      />

      {/* 2. Ação Principal: Compartilhar Evolução */}
      <div className="bg-[#1c2025] p-3.5 sm:p-4 rounded-2xl border border-[#262a30] flex items-center justify-between gap-3 shadow-sm hover:border-[#31353b] transition-all">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={avatarUrl}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover border border-[#262a30] shrink-0 bg-[#262a30]"
          />
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="text-left text-xs sm:text-sm text-[#8c90a1] hover:text-[#c2c6d8] transition-colors truncate flex-1 cursor-pointer py-1"
          >
            Compartilhar evolução, treino ou foto...
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-4 bg-[#0066ff] hover:bg-[#0054d6] text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Publicar</span>
        </button>
      </div>

      {/* 3. Feed da Comunidade (Centro da Tela) */}
      <div className="flex flex-col gap-4">
        {posts.map((post, idx) => (
          <React.Fragment key={post.id}>
            <CommunityFeedPostCard
              post={post}
              onToggleCheer={handleToggleCheer}
              onCopyRoutine={handleCopyRoutine}
              isCopied={copiedId === post.id}
              isCommentsOpen={activeCommentsPostId === post.id}
              onToggleComments={() =>
                setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)
              }
              commentInput={commentInput}
              onCommentInputChange={setCommentInput}
              onSendComment={() => handleSendComment(post.id)}
            />

            {/* Sugestões de atletas integradas naturalmente no fluxo do feed */}
            {idx === 1 && athletes.length > 0 && (
              <CommunitySuggestedAthletes
                athletes={athletes}
                onToggleFollow={handleToggleFollowAthlete}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 4. Modal de Publicação */}
      <CommunityCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newMuscleGroup={newMuscleGroup}
        onMuscleGroupChange={setNewMuscleGroup}
        newHighlightBadge={newHighlightBadge}
        onHighlightBadgeChange={setNewHighlightBadge}
        newCaption={newCaption}
        onCaptionChange={setNewCaption}
        newPostImage={newPostImage}
        onRemoveImage={() => setNewPostImage(null)}
        onImageSelect={handleImageUpload}
        fileInputRef={fileInputRef}
        onSetPresetImage={setNewPostImage}
        onPublish={handlePublish}
      />
    </div>
  );
};
