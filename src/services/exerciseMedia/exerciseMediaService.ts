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

function normalizeExerciseName(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bc\/\b/g, 'com')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const NAME_TO_EXTERNAL_ID: Record<string, string> = {
  'supino reto com barra': '0025',
  'supino reto': '0025',
  'supino inclinado com halteres': '0314',
  'supino inclinado': '0314',
  'crucifixo inclinado no cabo': '1270',
  'supino declinado': '0033',
  'paralelas com peso corporal': '0251',
  'paralelas': '0251',
  'puxador alto frente lat pulldown': '0198',
  'puxador alto frente': '0198',
  'puxador alto': '0198',
  'remada curvada com barra': '0027',
  'remada curvada': '0027',
  'remada baixa no triangulo': '0861',
  'remada baixa': '0861',
  'barra fixa pull up': '0651',
  'barra fixa': '0651',
  'levantamento terra classico': '0032',
  'levantamento terra': '0032',
  'desenvolvimento militar com halteres': '0405',
  'desenvolvimento militar': '0405',
  'elevacao lateral na polia baixa': '0178',
  'elevacao lateral': '0178',
  'crucifixo invertido': '0225',
  'agachamento livre com barra': '0043',
  'agachamento livre': '0043',
  'leg press 45 articulado': '1425',
  'leg press 45': '1425',
  'leg press': '1425',
  'cadeira extensora': '0585',
  'stiff com barra halteres': '0432',
  'stiff com barra': '0432',
  'stiff': '0432',
  'mesa flexora deitada': '0586',
  'mesa flexora': '0586',
  'elevacao pelvica com barra hip thrust': '1409',
  'elevacao pelvica com barra': '1409',
  'elevacao pelvica': '1409',
  'gemeos sentado na maquina': '0088',
  'gemeos sentado': '0088',
  'rosca direta barra w': '0447',
  'rosca direta': '0447',
  'rosca martelo com halteres': '0313',
  'rosca martelo': '0313',
  'rosca scott unilateral com halter': '0372',
  'rosca scott': '0372',
  'triceps corda no pulley': '0200',
  'triceps corda': '0200',
  'triceps frances unilateral': '1736',
  'triceps frances': '1736',
  'triceps testa com barra w': '0060',
  'triceps testa': '0060',
  'abdominal no cabo cable crunch': '0175',
  'abdominal no cabo': '0175',
  'elevacao de pernas na barra fixa': '0472',
  'elevacao de pernas': '0472',
  'prancha isometrica': '0464',
  'prancha': '0464'
};

function findExternalIdByName(name?: string): string | null {
  if (!name) return null;
  const norm = normalizeExerciseName(name);
  if (NAME_TO_EXTERNAL_ID[norm]) {
    return NAME_TO_EXTERNAL_ID[norm];
  }
  for (const [key, extId] of Object.entries(NAME_TO_EXTERNAL_ID)) {
    if (norm.includes(key) || key.includes(norm)) {
      return extId;
    }
  }
  return null;
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
  const cacheKey = baseId || exercise.id || exercise.name || 'ex';

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

      // 4. Checar mapeamento explícito ExerciseDB por ID
      const mappedMedia = SOMMA_EXERCISE_MEDIA_MAP[baseId] || SOMMA_EXERCISE_MEDIA_MAP[exercise.id];

      if (mappedMedia && mappedMedia.provider === 'exercisedb' && mappedMedia.externalId) {
        const result = await getExerciseDbMedia(mappedMedia.externalId);
        mediaCache.set(cacheKey, result);
        return result;
      }

      // 5. Checar mapeamento por nome normalizado
      const nameMatchedExtId = findExternalIdByName(exercise.name);
      if (nameMatchedExtId) {
        const result = await getExerciseDbMedia(nameMatchedExtId);
        mediaCache.set(cacheKey, result);
        return result;
      }

      // 6. Fallback limpo quando não há mídia cadastrada
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
  const cacheKey = baseId || exercise.id || exercise.name || 'ex';

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

  // 3. Se mapeou por nome
  const nameMatchedExtId = findExternalIdByName(exercise.name);
  if (nameMatchedExtId) {
    const gifUrl = `https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@main/assets/${nameMatchedExtId.padStart(4, '0')}.gif`;
    const result: ExerciseMediaResult = {
      provider: 'exercisedb',
      externalId: nameMatchedExtId,
      gifUrl,
      isAvailable: true,
      sourceLabel: 'ExerciseDB V1'
    };
    mediaCache.set(cacheKey, result);
    return result;
  }

  return null;
}
