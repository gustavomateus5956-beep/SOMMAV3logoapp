import React, { useState, useEffect } from 'react';
import { Dumbbell, ImageOff, Loader2 } from 'lucide-react';
import { Exercise, ExternalExerciseResult, LibraryExercise } from '../../types';
import { resolveExerciseMedia, getExerciseMediaImmediate } from '../../services/exerciseMedia/exerciseMediaService';
import { ExerciseMediaResult } from '../../services/exerciseMedia/types';

type ExerciseMediaSubject = 
  | Exercise 
  | LibraryExercise 
  | ExternalExerciseResult 
  | { id?: string; externalId?: string; name?: string; media?: any; gifUrl?: string };

interface ExerciseMediaProps {
  exercise: ExerciseMediaSubject;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  className?: string;
  showProviderBadge?: boolean;
  altText?: string;
  forceStaticThumbnail?: boolean;
}

export const ExerciseMedia: React.FC<ExerciseMediaProps> = ({
  exercise,
  size = 'md',
  className = '',
  showProviderBadge = false,
  altText,
  forceStaticThumbnail = false
}) => {
  const getInitialMedia = (): ExerciseMediaResult | null => {
    // Se o próprio objeto já possui gifUrl direto (ex: ExternalExerciseResult)
    const directGif = (exercise as any).gifUrl || (exercise as any).media?.gifUrl;
    if (directGif) {
      return {
        provider: (exercise as any).media?.provider || 'exercisedb',
        externalId: (exercise as any).externalId || (exercise as any).media?.externalId,
        gifUrl: directGif,
        isAvailable: true,
        sourceLabel: (exercise as any).media?.provider === 'somma' ? 'SOMMA Media' : 'ExerciseDB V1'
      };
    }
    return getExerciseMediaImmediate(exercise as any);
  };

  const [media, setMedia] = useState<ExerciseMediaResult | null>(getInitialMedia);
  const [isLoading, setIsLoading] = useState<boolean>(!media);
  const [hasError, setHasError] = useState<boolean>(false);

  const subjectKey = (exercise as any).id || (exercise as any).externalId || (exercise as any).name || 'ex';

  useEffect(() => {
    let isMounted = true;
    const initial = getInitialMedia();
    if (initial) {
      setMedia(initial);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    resolveExerciseMedia(exercise as any)
      .then((res) => {
        if (isMounted) {
          setMedia(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMedia({ provider: 'somma', isAvailable: false });
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [subjectKey]);

  // Tamanhos padronizados
  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl',
    md: 'w-full h-44 sm:h-52 rounded-2xl',
    lg: 'w-full h-64 sm:h-80 rounded-2xl',
    responsive: 'w-full h-full rounded-2xl'
  }[size];

  const displayName = exercise.name || altText || 'Exercício';

  // 1. Estado de Carregamento
  if (isLoading) {
    return (
      <div
        className={`${sizeClasses} bg-[#181c21] border border-[#262a30] flex flex-col items-center justify-center text-[#8c90a1] shrink-0 overflow-hidden relative ${className}`}
        aria-label="Carregando visualização do exercício"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-pulse" />
        <Loader2 className="w-5 h-5 text-[#0066ff] animate-spin" />
        {size !== 'sm' && (
          <span className="text-[11px] font-medium mt-2 text-[#8c90a1]">Carregando execução...</span>
        )}
      </div>
    );
  }

  // 2. Provedor ExerciseDB (GIF)
  if (media && media.isAvailable && media.gifUrl && !hasError) {
    return (
      <div
        className={`${sizeClasses} bg-[#181c21] border border-[#262a30] relative overflow-hidden flex items-center justify-center shrink-0 group ${className}`}
      >
        <img
          src={media.gifUrl}
          alt={`Demonstração biomecânica: ${displayName}`}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain p-1 filter drop-shadow transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  // 3. Fallback limpo SOMMA+ (sem mídia ou erro de carregamento)
  return (
    <div
      className={`${sizeClasses} bg-[#181c21] border border-[#262a30] flex flex-col items-center justify-center text-[#8c90a1] shrink-0 p-2 text-center select-none ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-[#1c2025] border border-[#262a30] flex items-center justify-center text-[#8c90a1] mb-1">
        {hasError ? (
          <ImageOff className="w-4 h-4 text-[#8c90a1]" />
        ) : (
          <Dumbbell className="w-4 h-4 text-[#0066ff]" />
        )}
      </div>
      {size !== 'sm' && (
        <>
          <span className="text-[11px] font-bold text-[#c2c6d8] mt-0.5">Animação indisponível</span>
          <span className="text-[10px] text-[#8c90a1] leading-tight mt-0.5">
            Consulte as orientações de execução abaixo
          </span>
        </>
      )}
    </div>
  );
};
