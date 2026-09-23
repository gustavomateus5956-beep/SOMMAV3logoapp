import { Exercise, LibraryExercise } from '../../types';
import { SOMMA_EXERCISE_MEDIA_MAP } from './exerciseMediaMap';
import { getExerciseDbMedia } from './exerciseDbProvider';
import { ExerciseMediaResult } from './types';

// Cache em memória para evitar requisições ou resoluções duplicadas
const mediaCache = new Map<string, ExerciseMediaResult>();
const pendingRequests = new Map<string, Promise<ExerciseMediaResult>>();

/**
 * Extrai o ID base do exercício SOMMA (remove prefixos dinâmicos como ex-lib-12345-)
 */
export function extractBaseSommaId(exerciseId: string): string {
  if (!exerciseId) return '';
  if (exerciseId.startsWith('ex-lib-')) {
    const parts = exerciseId.split('-');
    // ex-lib-<timestamp>-<actual-id>
    if (parts.length >= 4) {
      return parts.slice(3).join('-');
    }
  }
  return exerciseId;
}

/**
 * Resolve a mídia do exercício de forma assíncrona, consultando cache, mapping e providers.
 * 1. Mídia ExerciseDB (definida ou mapeada)
 * 2. Fallback limpo SOMMA+ (placeholder)
 */
export async function resolveExerciseMedia(
  exercise: Exercise | LibraryExercise | { id: string; name?: string; media?: any }
): Promise<ExerciseMediaResult> {
  const baseId = extractBaseSommaId(exercise.id);
  const cacheKey = baseId || exercise.id;

  // 1. Checar cache em memória
  if (mediaCache.has(cacheKey)) {
    return mediaCache.get(cacheKey)!;
  }

  // 2. Evitar chamadas simultâneas duplicadas
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const resolutionPromise = (async (): Promise<ExerciseMediaResult> => {
    try {
      // 3. Checar se o próprio objeto já possui definição de mídia
      if (exercise.media?.gifUrl) {
        const result: ExerciseMediaResult = {
          provider: exercise.media.provider || 'exercisedb',
          externalId: exercise.media.externalId,
          gifUrl: exercise.media.gifUrl,
          imageUrl: exercise.media.imageUrl,
          videoUrl: exercise.media.videoUrl,
          isAvailable: true,
          sourceLabel: exercise.media.provider === 'somma' ? 'SOMMA Media' : 'ExerciseDB V1'
        };
        mediaCache.set(cacheKey, result);
        return result;
      }

      // 4. Checar mapeamento explícito ExerciseDB
      const mappedMedia = SOMMA_EXERCISE_MEDIA_MAP[baseId] || SOMMA_EXERCISE_MEDIA_MAP[exercise.id];

      if (mappedMedia && mappedMedia.provider === 'exercisedb' && mappedMedia.externalId) {
        const result = await getExerciseDbMedia(mappedMedia.externalId);
        mediaCache.set(cacheKey, result);
        return result;
      }

      // 5. Fallback limpo quando não há mídia cadastrada
      const fallbackResult: ExerciseMediaResult = {
        provider: 'somma',
        isAvailable: false
      };
      mediaCache.set(cacheKey, fallbackResult);
      return fallbackResult;
    } catch {
      const errorFallback: ExerciseMediaResult = {
        provider: 'somma',
        isAvailable: false
      };
      return errorFallback;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, resolutionPromise);
  return resolutionPromise;
}

/**
 * Resolução síncrona preliminar (para renderização instantânea quando em cache ou mapeado)
 */
export function getExerciseMediaImmediate(
  exercise: Exercise | LibraryExercise | { id: string; name?: string; media?: any }
): ExerciseMediaResult | null {
  const baseId = extractBaseSommaId(exercise.id);
  const cacheKey = baseId || exercise.id;

  if (mediaCache.has(cacheKey)) {
    return mediaCache.get(cacheKey)!;
  }

  // 1. Se já possui gifUrl estático
  if (exercise.media?.gifUrl) {
    return {
      provider: exercise.media.provider || 'exercisedb',
      externalId: exercise.media.externalId,
      gifUrl: exercise.media.gifUrl,
      isAvailable: true,
      sourceLabel: 'ExerciseDB V1'
    };
  }

  // 2. Se tem no map estático ExerciseDB
  const mappedMedia = SOMMA_EXERCISE_MEDIA_MAP[baseId] || SOMMA_EXERCISE_MEDIA_MAP[exercise.id];
  if (mappedMedia && mappedMedia.provider === 'exercisedb' && mappedMedia.externalId) {
    const gifUrl = `https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@main/assets/${mappedMedia.externalId.padStart(4, '0')}.gif`;
    const result: ExerciseMediaResult = {
      provider: 'exercisedb',
      externalId: mappedMedia.externalId,
      gifUrl,
      isAvailable: true,
      sourceLabel: 'ExerciseDB V1'
    };
    mediaCache.set(cacheKey, result);
    return result;
  }

  return null;
}
