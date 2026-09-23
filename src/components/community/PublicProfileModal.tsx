import React, { useState } from 'react';
import { 
  X, 
  Check, 
  UserPlus, 
  MapPin, 
  Calendar, 
  Dumbbell, 
  Flame, 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { PublicUserProfile, CommunityPost, RoutineStory } from '../../types';

interface PublicProfileModalProps {
  user: PublicUserProfile;
  userPosts: CommunityPost[];
  userStory?: RoutineStory;
  onClose: () => void;
  onOpenStory?: (story: RoutineStory) => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  user,
  userPosts,
  userStory,
  onClose,
  onOpenStory
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [activeTab, setActiveTab] = useState<'posts' | 'stats'>('posts');

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#101419] border border-[#262a30] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Bar */}
        <div className="relative h-28 bg-gradient-to-r from-[#0066ff]/40 via-[#181c21] to-[#4edea3]/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar perfil público"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="px-5 pt-0 pb-4 relative shrink-0 border-b border-[#262a30]">
          <div className="flex items-end justify-between -mt-12 mb-3">
            <div className="relative">
              {userStory ? (
                <button
                  type="button"
                  onClick={() => onOpenStory && onOpenStory(userStory)}
                  className="p-[3px] rounded-full bg-gradient-to-tr from-[#0066ff] via-[#79a9ff] to-[#4edea3] hover:scale-105 transition-transform cursor-pointer"
                  title="Ver rotina ativa"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#101419]"
                  />
                </button>
              ) : (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#101419] shadow-lg"
                />
              )}

              {userStory && (
                <span className="absolute bottom-0 right-0 bg-[#0066ff] text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full border-2 border-[#101419]">
                  Rotina
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleFollow}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isFollowing
                  ? 'bg-[#262a30] text-[#c2c6d8] hover:bg-[#32363d]'
                  : 'bg-[#0066ff] hover:bg-[#0054d6] text-white shadow-md shadow-[#0066ff]/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Seguindo</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Seguir</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">{user.name}</h2>
              {user.verified && (
                <span className="w-4 h-4 rounded-full bg-[#0066ff] text-white flex items-center justify-center text-[10px] font-black">
                  ✓
                </span>
              )}
              {user.badge && (
                <span className="px-2 py-0.5 rounded-full bg-[#0066ff]/20 text-[#79a9ff] text-[10px] font-bold border border-[#0066ff]/30">
                  {user.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-[#8c90a1] font-mono">{user.username}</span>
          </div>

          {user.bio && (
            <p className="mt-2 text-xs text-[#c2c6d8] leading-relaxed">
              {user.bio}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-[#8c90a1] flex-wrap">
            {user.gymLocation && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#79a9ff]" />
                <span>{user.gymLocation}</span>
              </div>
            )}
            {user.specialty && (
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffb59d]" />
                <span>{user.specialty}</span>
              </div>
            )}
          </div>

          {/* Social Stats Row */}
          <div className="mt-4 grid grid-cols-4 gap-2 bg-[#181c21] p-3 rounded-xl border border-[#262a30] text-center">
            <div>
              <span className="block text-sm font-bold text-white">{followersCount}</span>
              <span className="text-[10px] text-[#8c90a1]">Seguidores</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-white">{user.followingCount}</span>
              <span className="text-[10px] text-[#8c90a1]">Seguindo</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-[#79a9ff]">{user.totalWorkouts}</span>
              <span className="text-[10px] text-[#8c90a1]">Treinos</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-[#ffb59d]">{user.streakDays}d</span>
              <span className="text-[10px] text-[#8c90a1]">Sequência</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center border-b border-[#262a30] px-4 shrink-0 bg-[#101419]">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'posts'
                ? 'text-[#0066ff] border-[#0066ff]'
                : 'text-[#8c90a1] border-transparent hover:text-white'
            }`}
          >
            Publicações ({userPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'text-[#0066ff] border-[#0066ff]'
                : 'text-[#8c90a1] border-transparent hover:text-white'
            }`}
          >
            Estatísticas de Atleta
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'posts' ? (
            userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-[#181c21] border border-[#262a30] rounded-xl p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#79a9ff] uppercase tracking-wider">
                      {post.type === 'workout' ? 'Treino Concluído' : post.type === 'evolution' ? 'Evolução' : 'Publicação'}
                    </span>
                    <span className="text-[10px] text-[#8c90a1]">{post.timeAgo}</span>
                  </div>

                  <p className="text-xs text-[#c2c6d8] leading-relaxed">
                    {post.caption}
                  </p>

                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt="Mídia da publicação" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}

                  {post.workoutData && (
                    <div className="bg-[#101419] p-2.5 rounded-lg border border-[#262a30] text-xs">
                      <div className="font-bold text-white">{post.workoutData.routineName}</div>
                      <div className="text-[11px] text-[#8c90a1] mt-0.5">
                        {post.workoutData.totalExercises} exercícios • {post.workoutData.durationMinutes} min • {post.workoutData.totalVolume.toLocaleString()} kg
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-[#8c90a1] pt-1">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#ffb59d]" /> {post.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[#79a9ff]" /> {post.commentsCount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-[#8c90a1]">
                Nenhuma publicação deste usuário ainda.
              </div>
            )
          ) : (
            <div className="space-y-3">
              <div className="bg-[#181c21] p-4 rounded-xl border border-[#262a30] flex flex-col gap-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Consistência SOMMA</h4>
                <div className="flex items-center justify-between text-xs text-[#c2c6d8]">
                  <span>Dias treinados este mês</span>
                  <span className="font-bold text-white">18 dias</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#c2c6d8]">
                  <span>Total de volume acumulado</span>
                  <span className="font-bold text-[#4edea3]">142.500 kg</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#c2c6d8]">
                  <span>Recordes Pessoais (PRs)</span>
                  <span className="font-bold text-[#ffb59d]">14 batidos</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
