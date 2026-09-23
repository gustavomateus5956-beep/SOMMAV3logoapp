import React, { useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight, Dumbbell, Sparkles } from 'lucide-react';
import { RoutineStory, UserProfile } from '../../types';

interface RoutineStoriesBarProps {
  stories: RoutineStory[];
  currentUser: UserProfile | null;
  onOpenStory: (story: RoutineStory, index: number) => void;
  onCreateStory: () => void;
}

export const RoutineStoriesBar: React.FC<RoutineStoriesBarProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onCreateStory
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if current user has an active routine story
  const userStory = stories.find((s) => s.isUser || s.userId === currentUser?.id);
  const communityStories = stories.filter((s) => !s.isUser && s.userId !== currentUser?.id);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || fullName;
  };

  return (
    <div className="relative w-full bg-[#101419] border-y border-[#262a30] py-3.5 px-4">
      {/* Scroll Left Button (Desktop only) */}
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Rolar rotinas para a esquerda"
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white items-center justify-center border border-[#262a30] shadow-md transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal Stories Bubble Track */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* 1. BOLHA DO PRÓPRIO USUÁRIO ("SEU TREINO" / "VOCÊ") */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
          <div className="relative">
            {userStory ? (
              <button
                type="button"
                onClick={() => onOpenStory(userStory, 0)}
                className={`p-[2.5px] rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
                  userStory.viewed
                    ? 'border-2 border-[#32363d] bg-[#181c21]'
                    : 'bg-gradient-to-tr from-[#0066ff] via-[#79a9ff] to-[#4edea3]'
                }`}
                aria-label="Ver sua rotina de hoje"
              >
                <img
                  src={currentUser?.avatar || userStory.authorAvatar}
                  alt="Sua foto"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#101419]"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={onCreateStory}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] border-2 border-dashed border-[#0066ff]/60 hover:border-[#0066ff] bg-[#181c21] flex items-center justify-center transition-all hover:scale-105 cursor-pointer group"
                aria-label="Publicar sua rotina de hoje"
              >
                <img
                  src={currentUser?.avatar || 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k'}
                  alt="Sua foto"
                  className="w-full h-full rounded-full object-cover opacity-70 group-hover:opacity-90"
                />
              </button>
            )}

            {/* Quick Add Story Plus Button */}
            <button
              type="button"
              onClick={onCreateStory}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0066ff] hover:bg-[#0054d6] text-white flex items-center justify-center border-2 border-[#101419] shadow-sm transition-transform hover:scale-110 cursor-pointer"
              title="Publicar nova rotina de hoje"
              aria-label="Adicionar nova rotina"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          <span className="text-[11px] font-semibold text-white truncate max-w-[68px] text-center">
            {userStory ? 'Sua rotina' : 'Seu treino'}
          </span>
        </div>

        {/* 2. DEMAIS BOLHAS: COMUNIDADE */}
        {communityStories.map((story, idx) => {
          const isUnseen = !story.viewed;
          // Actual index in combined array
          const globalIndex = userStory ? idx + 1 : idx;

          return (
            <div 
              key={story.id} 
              className="flex flex-col items-center gap-1.5 shrink-0 select-none"
            >
              <button
                type="button"
                onClick={() => onOpenStory(story, globalIndex)}
                className={`p-[2.5px] rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isUnseen
                    ? 'bg-gradient-to-tr from-[#0066ff] via-[#79a9ff] to-[#4edea3] shadow-sm shadow-[#0066ff]/20'
                    : 'border-2 border-[#262a30] bg-[#181c21]'
                }`}
                aria-label={`Ver rotina de ${story.authorName}`}
              >
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#101419]"
                />
              </button>

              <span className={`text-[11px] font-medium truncate max-w-[68px] text-center ${
                isUnseen ? 'text-white font-semibold' : 'text-[#8c90a1]'
              }`}>
                {getFirstName(story.authorName)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button (Desktop only) */}
      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Rolar rotinas para a direita"
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white items-center justify-center border border-[#262a30] shadow-md transition-all cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
