import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { Exercise, ExternalExerciseResult, LibraryExercise } from '../../types';
import { 
  fetchExerciseDbFilterOptions, 
  fetchExerciseDbList, 
  fetchExerciseDbById 
} from './exerciseDbProvider';
import { SOMMA_EXERCISE_MEDIA_MAP } from './exerciseMediaMap';
import { NormalizedExternalCatalogResponse } from './types';
import { 
  translateBodyPart, 
  translateEquipment, 
  translateMuscle, 
  translateMuscleList, 
  localizeExerciseName, 
  normalizeSearchTerm 
} from '../../features/workout/localization';

// Caches em memória da sessão
const searchCache = new Map<string, NormalizedExternalCatalogResponse>();
const exerciseDetailCache = new Map<string, ExternalExerciseResult>();

export const normalizeText = normalizeSearchTerm;

// Re-export das funções de tradução para compatibilidade
export { 
  translateBodyPart as mapBodyPartToSommaMuscleGroup,
  translateEquipment as mapEquipmentToSomma 
};

/**
 * Mapeamento de termos comuns de busca em PT-BR para keywords da ExerciseDB.
 * Permite que o usuário pesquise termos em português (ex: "supino", "agachamento")
 * e a API ExerciseDB (que opera em inglês) encontre os exercícios corretos.
 */
const PT_TO_EXDB_SEARCH_MAP: Array<[RegExp, string]> = [
  [/\bsupino\b/gi, 'bench press'],
  [/\bagachamento\b/gi, 'squat'],
  [/\blevantamento terra\b|\bterra\b/gi, 'deadlift'],
  [/\bstiff\b/gi, 'deadlift'],
  [/\bremada\b/gi, 'row'],
  [/\bpuxada\b/gi, 'pulldown'],
  [/\brosca\b/gi, 'curl'],
  [/\btr[ií]ceps\b/gi, 'triceps'],
  [/\bb[ií]ceps\b/gi, 'bicep'],
  [/\beleva[cç][aã]o\b/gi, 'raise'],
  [/\bcrucifixo\b/gi, 'fly'],
  [/\bdesenvolvimento\b/gi, 'press'],
  [/\bflex[aã]o\b/gi, 'push-up'],
  [/\bbarra fixa\b/gi, 'pull-up'],
  [/\bparalelas?\b/gi, 'dip'],
  [/\bpanturrilha\b/gi, 'calf'],
  [/\babdominal\b/gi, 'crunch'],
  [/\bprancha\b/gi, 'plank'],
  [/\bp[eé]lvica\b/gi, 'hip thrust'],
  [/\bpassada\b|\bavan[cç]o\b/gi, 'lunge'],
  [/\bextensora\b/gi, 'leg extension'],
  [/\bflexora\b/gi, 'leg curl'],
  [/\bencolhimento\b/gi, 'shrug']
];

/**
 * Traduz o termo de busca digitado pelo usuário em português para termo em inglês aceito pela ExerciseDB.
 */
export function mapQueryToExerciseDbTerm(query: string): string {
  let term = query.trim();
  for (const [regex, englishTerm] of PT_TO_EXDB_SEARCH_MAP) {
    if (regex.test(term)) {
      return englishTerm;
    }
  }
  return term;
}

/**
 * Normaliza um resultado da ExerciseDB aplicando localização 100% PT-BR
 * e preservando o nome e dados originais.
 */
export function localizeExternalExercise(ext: ExternalExerciseResult): ExternalExerciseResult {
  const localized = localizeExerciseName(ext.name, ext.externalId);
  const localizedBodyPart = translateBodyPart(ext.bodyPart);
  const localizedEquipment = translateEquipment(ext.equipment);
  const localizedTarget = translateMuscle(ext.target);
  const localizedSecondary = translateMuscleList(ext.secondaryMuscles || []);

  return {
    ...ext,
    name: localized.name,
    originalName: localized.originalName,
    bodyPart: localizedBodyPart,
    equipment: localizedEquipment,
    target: localizedTarget,
    secondaryMuscles: localizedSecondary
  };
}

/**
 * Busca imediata na biblioteca SOMMA interna (~29 exercícios).
 * Suporta busca bilíngue: pesquisa por nome em PT-BR, nome original ou músculos.
 */
export function searchLocalExercises(
  query = '',
  muscleGroup = 'Todos',
  equipment = 'Todos'
): LibraryExercise[] {
  const normQuery = normalizeText(query);
  const normMuscle = normalizeText(muscleGroup);
  const normEquip = normalizeText(equipment);

  return EXERCISE_LIBRARY.filter((ex) => {
    // Mapeamento externo do exercício local para busca bilíngue
    const mediaMap = SOMMA_EXERCISE_MEDIA_MAP[ex.id];
    const englishAlias = mediaMap?.externalId || '';

    const matchSearch =
      !normQuery ||
      normalizeText(ex.name).includes(normQuery) ||
      normalizeText(englishAlias).includes(normQuery) ||
      ex.targetMuscles.some((m) => normalizeText(m).includes(normQuery)) ||
      normalizeText(ex.muscleGroup).includes(normQuery) ||
      normalizeText(ex.equipment).includes(normQuery);

    const matchMuscle =
      normMuscle === 'todos' ||
      normalizeText(ex.muscleGroup) === normMuscle;

    const matchEquipment =
      normEquip === 'todos' ||
      normalizeText(ex.equipment) === normEquip;

    return matchSearch && matchMuscle && matchEquipment;
  });
}

/**
 * Busca assíncrona paginada no catálogo da ExerciseDB V1 com cache
 * e localização imediata dos resultados.
 */
export async function searchExternalExercises(
  options: {
    query?: string;
    bodyPart?: string;
    equipment?: string;
    targetMuscle?: string;
    after?: string;
    limit?: number;
  } = {},
  signal?: AbortSignal
): Promise<NormalizedExternalCatalogResponse> {
  const limit = options.limit || 20;
  
  // Converte termo de busca para a API externa se digitado em português
  const externalQuery = options.query ? mapQueryToExerciseDbTerm(options.query) : undefined;
  const cacheKey = `${externalQuery || ''}|${options.bodyPart || ''}|${options.equipment || ''}|${options.after || ''}|${limit}`;

  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const response = await fetchExerciseDbList(
    {
      name: externalQuery,
      bodyParts: options.bodyPart && options.bodyPart !== 'Todos' ? options.bodyPart : undefined,
      equipments: options.equipment && options.equipment !== 'Todos' ? options.equipment : undefined,
      targetMuscles: options.targetMuscle,
      after: options.after,
      limit
    },
    signal
  );

  // Localiza cada exercício retornado para PT-BR
  const localizedExercises = response.exercises.map(localizeExternalExercise);

  // Armazena no cache de detalhes individuais
  localizedExercises.forEach((ex) => {
    exerciseDetailCache.set(ex.externalId, ex);
  });

  const localizedResponse: NormalizedExternalCatalogResponse = {
    ...response,
    exercises: localizedExercises
  };

  searchCache.set(cacheKey, localizedResponse);
  return localizedResponse;
}

/**
 * Deduplicação inteligente entre a biblioteca local SOMMA e resultados externos:
 * - Evita duplicar se o externalId estiver mapeado na biblioteca local
 * - Evita duplicar se o nome traduzido for idêntico a um exercício local existente
 * Mantém apenas o exercício interno SOMMA original.
 */
export function deduplicateExternalResults(
  localExercises: LibraryExercise[],
  externalExercises: ExternalExerciseResult[]
): ExternalExerciseResult[] {
  const coveredExternalIds = new Set<string>();
  const coveredNormalizedNames = new Set<string>();
  
  localExercises.forEach((loc) => {
    coveredNormalizedNames.add(normalizeText(loc.name));
    const map = SOMMA_EXERCISE_MEDIA_MAP[loc.id];
    if (map && map.externalId) {
      coveredExternalIds.add(map.externalId.padStart(4, '0'));
      coveredExternalIds.add(map.externalId);
    }
  });

  return externalExercises.filter((ext) => {
    if (coveredExternalIds.has(ext.externalId)) {
      return false;
    }
    const extNormalizedName = normalizeText(ext.name);
    if (coveredNormalizedNames.has(extNormalizedName)) {
      return false;
    }
    return true;
  });
}

/**
 * Busca exercício externo por ID com cache e tradução para PT-BR.
 */
export async function getExternalExerciseById(
  externalId: string,
  signal?: AbortSignal
): Promise<ExternalExerciseResult | null> {
  if (exerciseDetailCache.has(externalId)) {
    return exerciseDetailCache.get(externalId)!;
  }

  const result = await fetchExerciseDbById(externalId, signal);
  if (result) {
    const localized = localizeExternalExercise(result);
    exerciseDetailCache.set(externalId, localized);
    return localized;
  }
  return null;
}

/**
 * Converte um exercício externo (ExerciseDB) em uma referência utilizável dentro de uma Rotina SOMMA.
 * Cria um snapshot completo e autocontido.
 * 
 * NOTA DE PRESCRIÇÃO: Não prescreve séries, repetições ou cargas automaticamente.
 * Séries pertencem à rotina/prescrição do profissional ou usuário, iniciando não definidas (sets: []).
 */
export function convertExternalToSommaExercise(
  external: ExternalExerciseResult
): Exercise {
  const timestamp = Date.now();
  const localized = localizeExerciseName(external.name, external.externalId);
  const muscleGroup = translateBodyPart(external.bodyPart);
  const equipment = translateEquipment(external.equipment);

  const targetMuscles = [
    external.target ? translateMuscle(external.target) : '',
    ...translateMuscleList(external.secondaryMuscles || [])
  ].filter(Boolean) as string[];

  // Instruções em PT-BR: se o texto original for em inglês, não expõe o inglês cru.
  // Prioriza orientações em português ou omite instruções cruas não traduzidas.
  const isEnglishInstruction = external.instructions?.some((inst) => 
    /\b(stand|hold|feet|slowly|lower|barbell|dumbbell|cable|chest|elbows|shoulder-width|exhale|inhale)\b/i.test(inst)
  );

  const tips = isEnglishInstruction 
    ? 'Execute o movimento com cadência controlada e amplitude completa.'
    : external.instructions?.[0] || 'Execute o movimento mantendo a postura alinhada.';

  const executionTips = isEnglishInstruction ? undefined : external.instructions;
  const instructions = isEnglishInstruction ? undefined : external.instructions?.join('\n');

  return {
    id: `exdb-${external.externalId}-${timestamp}`,
    name: localized.name,
    originalName: localized.originalName,
    muscleGroup,
    equipment,
    targetMuscles,
    tips,
    instructions,
    executionTips,
    source: 'exercisedb',
    external: {
      provider: 'exercisedb',
      id: external.externalId
    },
    bodyPart: external.bodyPart,
    target: external.target,
    media: {
      provider: 'exercisedb',
      externalId: external.externalId,
      gifUrl: external.gifUrl
    },
    // Sem prescrição automática: séries vazias para a rotina definir
    sets: []
  };
}

/**
 * Converte um LibraryExercise do SOMMA em um Exercise de rotina.
 * 
 * NOTA DE PRESCRIÇÃO: Não prescreve séries automaticamente ao adicionar à rotina.
 * Apenas inicializa a estrutura limpa.
 */
export function convertLocalToSommaExercise(
  libEx: LibraryExercise,
  customSetsCount?: number
): Exercise {
  const timestamp = Date.now();
  const setsCount = customSetsCount ?? 0;

  return {
    id: `ex-lib-${timestamp}-${libEx.id}`,
    name: libEx.name,
    muscleGroup: libEx.muscleGroup,
    equipment: libEx.equipment,
    targetMuscles: libEx.targetMuscles,
    tips: libEx.tips,
    instructions: libEx.tips,
    source: 'somma',
    media: libEx.media,
    sets: setsCount > 0 ? Array.from({ length: setsCount }, (_, idx) => ({
      id: `set-${timestamp}-${idx + 1}`,
      setNumber: idx + 1,
      weight: 0,
      reps: 0,
      completed: false
    })) : []
  };
}
