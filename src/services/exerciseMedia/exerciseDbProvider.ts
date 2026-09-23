import { 
  ExerciseDbExercise, 
  ExerciseDbListResponse, 
  ExerciseDbQueryParams, 
  ExerciseMediaResult, 
  ExternalExerciseResult, 
  NormalizedExternalCatalogResponse 
} from './types';

// Base URL oficial e auditada para ExerciseDB V1 Free
export const EXERCISE_DB_BASE_URL = 'https://oss.exercisedb.dev/api/v1';

// CDN base para assets da ExerciseDB V1
const EXERCISE_DB_GIF_CDN_PRIMARY = 'https://cdn.jsdelivr.net/gh/omercotkd/exercises-gifs@main/assets';
const EXERCISE_DB_GIF_CDN_FALLBACK = 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets';

/**
 * Normaliza o ID para o padrão de 4 dígitos da ExerciseDB V1 legado caso seja numérico
 */
export function normalizeExerciseDbId(id: string): string {
  const clean = (id || '').trim();
  if (/^\d+$/.test(clean) && clean.length < 4) {
    return clean.padStart(4, '0');
  }
  return clean;
}

/**
 * Constrói a URL do GIF da ExerciseDB a partir do externalId.
 */
export function buildExerciseDbGifUrl(externalId: string, useFallback = false): string {
  const normalizedId = normalizeExerciseDbId(externalId);
  // Se for ID hash alfanumérico da nova API oss (ex: "01qpYSe"), usa a URL estática direta
  if (!/^\d+$/.test(normalizedId)) {
    return `https://static.exercisedb.dev/media/${normalizedId}.gif`;
  }
  const base = useFallback ? EXERCISE_DB_GIF_CDN_FALLBACK : EXERCISE_DB_GIF_CDN_PRIMARY;
  return `${base}/${normalizedId}.gif`;
}

/**
 * Normaliza um item bruto retornado pela ExerciseDB V1 em ExternalExerciseResult seguro.
 */
export function normalizeExerciseDbExercise(raw: ExerciseDbExercise): ExternalExerciseResult {
  const externalId = raw.exerciseId || raw.id || '';
  const gifUrl = raw.gifUrl || buildExerciseDbGifUrl(externalId);

  return {
    provider: 'exercisedb',
    externalId,
    name: raw.name || 'Exercício Externo',
    bodyPart: raw.bodyParts && raw.bodyParts.length > 0 ? raw.bodyParts[0] : undefined,
    target: raw.targetMuscles && raw.targetMuscles.length > 0 ? raw.targetMuscles[0] : undefined,
    equipment: raw.equipments && raw.equipments.length > 0 ? raw.equipments[0] : undefined,
    secondaryMuscles: raw.secondaryMuscles || [],
    instructions: raw.instructions || [],
    gifUrl
  };
}

/**
 * Consulta ou resolve a mídia a partir de um ID da ExerciseDB.
 * Retorna dados normalizados isolados da estrutura da API externa.
 */
export async function getExerciseDbMedia(externalId: string): Promise<ExerciseMediaResult> {
  if (!externalId) {
    return {
      provider: 'exercisedb',
      isAvailable: false
    };
  }

  const gifUrl = buildExerciseDbGifUrl(externalId);

  return {
    provider: 'exercisedb',
    externalId,
    gifUrl,
    isAvailable: true,
    sourceLabel: 'ExerciseDB V1'
  };
}

/**
 * Consulta o catálogo da ExerciseDB V1 com suporte a busca por nome, filtros e cursor de paginação.
 */
export async function fetchExerciseDbList(
  params: ExerciseDbQueryParams = {},
  signal?: AbortSignal
): Promise<NormalizedExternalCatalogResponse> {
  const url = new URL(`${EXERCISE_DB_BASE_URL}/exercises`);

  // Parâmetros reais suportados pela API V1 oss.exercisedb.dev
  url.searchParams.set('limit', String(params.limit || 20));

  if (params.name && params.name.trim()) {
    url.searchParams.set('name', params.name.trim());
  }

  if (params.after) {
    url.searchParams.set('after', params.after);
  }

  if (params.bodyParts && params.bodyParts !== 'all') {
    url.searchParams.set('bodyParts', params.bodyParts);
  }

  if (params.equipments && params.equipments !== 'all') {
    url.searchParams.set('equipments', params.equipments);
  }

  if (params.targetMuscles && params.targetMuscles !== 'all') {
    url.searchParams.set('targetMuscles', params.targetMuscles);
  }

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal
    });

    if (!res.ok) {
      throw new Error(`ExerciseDB HTTP ${res.status}`);
    }

    const data: ExerciseDbListResponse = await res.json();
    const rawList = Array.isArray(data.data) ? data.data : [];
    const exercises = rawList.map(normalizeExerciseDbExercise);

    return {
      exercises,
      total: data.meta?.total,
      hasNextPage: Boolean(data.meta?.hasNextPage),
      nextCursor: data.meta?.nextCursor
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    // Falha limpa para evitar quebrar o app
    return {
      exercises: [],
      total: 0,
      hasNextPage: false
    };
  }
}

/**
 * Busca os detalhes de um exercício externo específico por ID.
 */
export async function fetchExerciseDbById(
  externalId: string,
  signal?: AbortSignal
): Promise<ExternalExerciseResult | null> {
  if (!externalId) return null;

  try {
    const res = await fetch(`${EXERCISE_DB_BASE_URL}/exercises/${encodeURIComponent(externalId)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    const raw = json.data || json;
    if (!raw || (!raw.exerciseId && !raw.id && !raw.name)) {
      return null;
    }

    return normalizeExerciseDbExercise(raw);
  } catch {
    return null;
  }
}

/**
 * Busca as listas reais de opções de filtros disponíveis na API ExerciseDB V1.
 */
export async function fetchExerciseDbFilterOptions(signal?: AbortSignal): Promise<{
  bodyParts: string[];
  equipments: string[];
}> {
  try {
    const [bodyPartsRes, equipmentsRes] = await Promise.allSettled([
      fetch(`${EXERCISE_DB_BASE_URL}/bodyparts`, { signal }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${EXERCISE_DB_BASE_URL}/equipments`, { signal }).then((r) => (r.ok ? r.json() : null))
    ]);

    const bodyParts: string[] = [];
    if (bodyPartsRes.status === 'fulfilled' && bodyPartsRes.value?.data) {
      bodyPartsRes.value.data.forEach((item: { name: string }) => {
        if (item?.name) bodyParts.push(item.name);
      });
    }

    const equipments: string[] = [];
    if (equipmentsRes.status === 'fulfilled' && equipmentsRes.value?.data) {
      equipmentsRes.value.data.forEach((item: { name: string }) => {
        if (item?.name) equipments.push(item.name);
      });
    }

    return {
      bodyParts,
      equipments
    };
  } catch {
    return {
      bodyParts: [],
      equipments: []
    };
  }
}
