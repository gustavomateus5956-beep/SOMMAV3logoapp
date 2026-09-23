import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { MOCK_POSTS, MOCK_LOCAL_ATHLETES, USER_PROFILE } from '../data/mockData';
import { FeedPost } from '../types';
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

  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
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

  const handleToggleCheer = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isCheered = p.userCheered;
          const currentCount = p.cheerCount ?? 0;
          return {
            ...p,
            userCheered: !isCheered,
            cheerCount: isCheered ? Math.max(0, currentCount - 1) : currentCount + 1
          };
        }
        return p;
      })
    );
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

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComments = [
            ...(p.comments || []),
            {
              id: `c-${Date.now()}`,
              author: userName,
              role: 'Você',
              text: commentInput.trim()
            }
          ];
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: newComments
          };
        }
        return p;
      })
    );
    setCommentInput('');
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

  const handlePublish = () => {
    const newPost: FeedPost = {
      id: `user-post-${Date.now()}`,
      authorName: userName,
      authorBadge: 'Você',
      authorVerified: true,
      authorAvatar: avatarUrl,
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
      cheerCount: 1,
      userCheered: true,
      commentsCount: 0
    };

    setPosts([newPost, ...posts]);
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
