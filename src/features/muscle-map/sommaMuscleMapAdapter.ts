import { isSetCompleted } from '../workout-engine/setMetrics';
import type { MuscleGroup, MuscleMapValues, MuscleMapValue } from '@musclemap/core';
import type { Exercise, CompletedExerciseLog } from '../../types';

/**
 * Rótulos oficiais em português brasileiro para cada um dos 21 grupos musculares do MuscleMap.
 */
export const SOMMA_MUSCLE_LABELS: Record<MuscleGroup, string> = {
  CHEST: 'Peitoral',
  BACK_UPPER: 'Costas Superiores',
  BACK_LOWER: 'Lombar',
  TRAPEZIUS: 'Trapézio',
  RHOMBOIDS: 'Romboides',
  LATS: 'Dorsais',
  SHOULDERS_FRONT: 'Deltoides Anteriores',
  SHOULDERS_SIDE: 'Deltoides Laterais',
  SHOULDERS_REAR: 'Deltoides Posteriores',
  BICEPS: 'Bíceps',
  TRICEPS: 'Tríceps',
  FOREARMS: 'Antebraços',
  CORE: 'Abdômen / Core',
  OBLIQUES: 'Oblíquos',
  GLUTES: 'Glúteos',
  QUADS: 'Quadríceps',
  HAMSTRINGS: 'Posteriores de Coxa',
  CALVES: 'Panturrilhas',
  HIP_FLEXORS: 'Flexores do Quadril',
  ADDUCTORS: 'Adutores',
  ABDUCTORS: 'Abdutores'
};

/**
 * Chaves da taxonomia SOMMA que não possuem correspondência em superfícies musculares
 * esqueléticas do MuscleMap (ex: sistema cardiovascular, pescoço/mãos/pés sem grupo no visualizador).
 */
export const UNMAPPED_SOMMA_KEYS: ReadonlyArray<string> = [
  'cardiovascular system',
  'sistema cardiovascular',
  'cardio',
  'neck',
  'pescoço',
  'sternocleidomastoid',
  'esternocleidomastoideo',
  'feet',
  'pés',
  'hands',
  'mãos',
  'ankles',
  'tornozelos',
  'ankle stabilizers',
  'estabilizadores do tornozelo',
  'wrists',
  'punhos'
];

/**
 * Dicionário unificado de normalização: mapeia tanto chaves em inglês da taxonomia SOMMA
 * quanto rótulos / sinônimos em português para os MuscleGroup oficiais do @musclemap/core.
 */
const MUSCLE_LOOKUP_MAP: Record<string, MuscleGroup> = {
  // Peitoral
  'pectorals': 'CHEST',
  'chest': 'CHEST',
  'upper chest': 'CHEST',
  'peitoral': 'CHEST',
  'peito': 'CHEST',
  'peitoral maior': 'CHEST',
  'peitoral superior': 'CHEST',
  'peitoral inferior': 'CHEST',
  'feixe clavicular': 'CHEST',
  'fibras esternais': 'CHEST',
  'porcao clavicular': 'CHEST',

  // Dorsais / Costas
  'lats': 'LATS',
  'latissimus dorsi': 'LATS',
  'dorsais': 'LATS',
  'dorsal': 'LATS',
  'latissimo do dorso': 'LATS',

  // Trapézio e Romboides
  'traps': 'TRAPEZIUS',
  'trapezius': 'TRAPEZIUS',
  'trapezio': 'TRAPEZIUS',
  'trapézio': 'TRAPEZIUS',
  'levator scapulae': 'TRAPEZIUS',
  'elevador da escapula': 'TRAPEZIUS',
  'elevador da escápula': 'TRAPEZIUS',

  'rhomboids': 'RHOMBOIDS',
  'romboides': 'RHOMBOIDS',
  'rombóides': 'RHOMBOIDS',

  // Costas Superior / Lombar
  'upper back': 'BACK_UPPER',
  'costas superiores': 'BACK_UPPER',
  'back': 'BACK_UPPER',
  'costas': 'BACK_UPPER',

  'lower back': 'BACK_LOWER',
  'lombar': 'BACK_LOWER',
  'spine': 'BACK_LOWER',
  'coluna': 'BACK_LOWER',

  // Ombros / Deltoides
  'delts': 'SHOULDERS_FRONT',
  'deltoids': 'SHOULDERS_FRONT',
  'deltoides': 'SHOULDERS_FRONT',
  'deltóides': 'SHOULDERS_FRONT',
  'deltoide': 'SHOULDERS_FRONT',
  'deltóide': 'SHOULDERS_FRONT',
  'deltoide anterior': 'SHOULDERS_FRONT',
  'deltóide anterior': 'SHOULDERS_FRONT',
  'deltoides anteriores': 'SHOULDERS_FRONT',
  'shoulders': 'SHOULDERS_FRONT',
  'ombros': 'SHOULDERS_FRONT',
  'ombro': 'SHOULDERS_FRONT',

  'deltoide lateral': 'SHOULDERS_SIDE',
  'deltóide lateral': 'SHOULDERS_SIDE',
  'deltoides laterais': 'SHOULDERS_SIDE',
  'lateral deltoids': 'SHOULDERS_SIDE',

  'rear deltoids': 'SHOULDERS_REAR',
  'deltoide posterior': 'SHOULDERS_REAR',
  'deltóide posterior': 'SHOULDERS_REAR',
  'deltoides posteriores': 'SHOULDERS_REAR',
  'rotator cuff': 'SHOULDERS_REAR',
  'manguito rotador': 'SHOULDERS_REAR',

  // Braços (Bíceps, Tríceps, Antebraços)
  'biceps': 'BICEPS',
  'bíceps': 'BICEPS',
  'biceps braquial': 'BICEPS',
  'bíceps braquial': 'BICEPS',
  'brachialis': 'BICEPS',
  'braquial': 'BICEPS',

  'triceps': 'TRICEPS',
  'tríceps': 'TRICEPS',
  'triceps braquial': 'TRICEPS',
  'tríceps braquial': 'TRICEPS',

  'forearms': 'FOREARMS',
  'lower arms': 'FOREARMS',
  'antebraços': 'FOREARMS',
  'antebramos': 'FOREARMS',
  'antebraço': 'FOREARMS',
  'wrist flexors': 'FOREARMS',
  'flexores do punho': 'FOREARMS',
  'wrist extensors': 'FOREARMS',
  'extensores do punho': 'FOREARMS',
  'grip muscles': 'FOREARMS',
  'musculos da pegada': 'FOREARMS',

  // Core / Abdômen
  'abs': 'CORE',
  'abdominals': 'CORE',
  'abdomen': 'CORE',
  'abdômen': 'CORE',
  'lower abs': 'CORE',
  'abdomen inferior': 'CORE',
  'core': 'CORE',
  'waist': 'CORE',
  'serratus anterior': 'CORE',
  'serrátil anterior': 'CORE',

  'obliques': 'OBLIQUES',
  'obliquos': 'OBLIQUES',
  'oblíquos': 'OBLIQUES',

  // Membros Inferiores
  'glutes': 'GLUTES',
  'gluteos': 'GLUTES',
  'glúteos': 'GLUTES',
  'gluteo': 'GLUTES',
  'glúteo': 'GLUTES',

  'quads': 'QUADS',
  'quadriceps': 'QUADS',
  'quadríceps': 'QUADS',
  'quadriceps femoral': 'QUADS',

  'hamstrings': 'HAMSTRINGS',
  'posteriores de coxa': 'HAMSTRINGS',
  'posterior de coxa': 'HAMSTRINGS',
  'isquiotibiais': 'HAMSTRINGS',
  'isquiotibial': 'HAMSTRINGS',

  'calves': 'CALVES',
  'lower legs': 'CALVES',
  'panturrilhas': 'CALVES',
  'panturrilha': 'CALVES',
  'soleus': 'CALVES',
  'soleo': 'CALVES',
  'sóleo': 'CALVES',
  'shins': 'CALVES',
  'tibiais': 'CALVES',
  'tibial': 'CALVES',

  'hip flexors': 'HIP_FLEXORS',
  'flexores do quadril': 'HIP_FLEXORS',
  'flexor do quadril': 'HIP_FLEXORS',

  'adductors': 'ADDUCTORS',
  'adutores': 'ADDUCTORS',
  'adutor': 'ADDUCTORS',
  'inner thighs': 'ADDUCTORS',
  'parte interna das coxas': 'ADDUCTORS',
  'groin': 'ADDUCTORS',
  'virilha': 'ADDUCTORS',

  'abductors': 'ABDUCTORS',
  'abdutores': 'ABDUCTORS',
  'abdutor': 'ABDUCTORS'
};

/**
 * Normaliza um texto para consulta no mapa de músculos (remove acentos, espaços extras e pontuação).
 */
export function normalizeMuscleKey(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Mapa pré-normalizado garantindo resolução 100% insensível a acentuação e cedilhas */
const NORMALIZED_LOOKUP_MAP: Record<string, MuscleGroup> = {};
for (const [rawKey, group] of Object.entries(MUSCLE_LOOKUP_MAP)) {
  NORMALIZED_LOOKUP_MAP[normalizeMuscleKey(rawKey)] = group;
}

/**
 * Mapeia uma chave ou rótulo textual SOMMA para o MuscleGroup do MuscleMap.
 * Retorna null se não houver mapeamento correspondente.
 */
export function mapSommaMuscleToGroup(rawInput?: string): MuscleGroup | null {
  if (!rawInput) return null;
  const norm = normalizeMuscleKey(rawInput);
  if (!norm) return null;

  // Busca exata
  if (NORMALIZED_LOOKUP_MAP[norm]) {
    return NORMALIZED_LOOKUP_MAP[norm];
  }

  // Busca por contenção (substring)
  for (const [key, group] of Object.entries(NORMALIZED_LOOKUP_MAP)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return group;
    }
  }

  return null;
}

/**
 * Extrai os grupos musculares alvo (primário) e secundários de um exercício.
 * Usa dados nativos do exercício (target, secondaryMuscles, targetMuscles, bodyPart).
 */
export function extractExerciseMuscleGroups(
  exercise: Exercise | CompletedExerciseLog | {
    target?: string;
    secondaryMuscles?: string[];
    targetMuscles?: string[];
    muscleGroup?: string;
    bodyPart?: string;
  }
): { primary: MuscleGroup | null; secondary: MuscleGroup[] } {
  let primary: MuscleGroup | null = null;
  const secondarySet = new Set<MuscleGroup>();

  // 1. Tenta identificar o músculo primário
  const primaryCandidate = (exercise as any).target || (exercise as any).muscleGroup || (exercise as any).bodyPart;
  if (primaryCandidate) {
    primary = mapSommaMuscleToGroup(primaryCandidate);
  }

  // 2. Coleta músculos secundários
  const secondaryCandidates: string[] = [];
  if (Array.isArray((exercise as any).secondaryMuscles)) {
    secondaryCandidates.push(...(exercise as any).secondaryMuscles);
  }
  if (Array.isArray((exercise as any).targetMuscles)) {
    // targetMuscles costuma incluir o primário no índice 0
    (exercise as any).targetMuscles.forEach((m: string, idx: number) => {
      if (idx === 0 && !primary) {
        primary = mapSommaMuscleToGroup(m);
      } else if (idx > 0) {
        secondaryCandidates.push(m);
      }
    });
  }

  secondaryCandidates.forEach((cand) => {
    const mapped = mapSommaMuscleToGroup(cand);
    if (mapped && mapped !== primary) {
      secondarySet.add(mapped);
    }
  });

  return {
    primary,
    secondary: Array.from(secondarySet)
  };
}

export interface MuscleWorkloadDetail {
  group: MuscleGroup;
  label: string;
  score: number; // 0-100 normalizado para o visualizador MuscleMap
  rawLoad: number; // Carga muscular ponderada bruta (peso 1.0 para alvo, 0.5 para secundário)
  completedSets: number; // Quantidade REAL de séries concluídas envolvendo este músculo
  primarySets: number; // Quantidade de séries onde é o músculo alvo principal
  secondarySets: number; // Quantidade de séries onde atua como sinergista / secundário
  plannedSets: number; // Quantidade de séries previstas na rotina
  loadPercentage: number; // Percentual de carga muscular relativa (0-100%)
}

export interface WorkoutMuscleAnalysis {
  values: MuscleMapValues;
  details: MuscleWorkloadDetail[];
  hasCompletedSets: boolean;
  totalCompletedSets: number;
  totalPlannedSets: number;
  mode: 'planned' | 'live' | 'completed';
}

const PRIMARY_MUSCLE_WEIGHT = 1.0;
const SECONDARY_MUSCLE_WEIGHT = 0.5;

/**
 * Motor de cálculo oficial de ativação e carga muscular do SOMMA+.
 *
 * Regras:
 * - Primário: peso 1.0 por série
 * - Secundário: peso 0.5 por série
 * - Normalização: músculo com maior carga = 100, demais proporcionais de 0 a 100
 * - Estado planejado (0 séries concluídas): intensidade visual suave entre 15 e 25
 * - Treino vazio: values = {}, sem músculos destacados
 */
export function calculateWorkoutMuscleScores(
  exercises: Array<Exercise | CompletedExerciseLog>
): WorkoutMuscleAnalysis {
  if (!exercises || exercises.length === 0) {
    return {
      values: {},
      details: [],
      hasCompletedSets: false,
      totalCompletedSets: 0,
      totalPlannedSets: 0,
      mode: 'planned'
    };
  }

  // Acumuladores por grupo muscular
  interface MuscleAccumulator {
    group: MuscleGroup;
    rawCompletedLoad: number;
    rawPlannedLoad: number;
    completedSets: number;
    primarySets: number;
    secondarySets: number;
    plannedSets: number;
  }

  const accumulators = new Map<MuscleGroup, MuscleAccumulator>();

  const getOrCreate = (group: MuscleGroup): MuscleAccumulator => {
    let acc = accumulators.get(group);
    if (!acc) {
      acc = {
        group,
        rawCompletedLoad: 0,
        rawPlannedLoad: 0,
        completedSets: 0,
        primarySets: 0,
        secondarySets: 0,
        plannedSets: 0
      };
      accumulators.set(group, acc);
    }
    return acc;
  };

  let totalCompletedSets = 0;
  let totalPlannedSets = 0;
  let allSetsCompleted = true;
  let anySetExists = false;

  for (const ex of exercises) {
    const { primary, secondary } = extractExerciseMuscleGroups(ex);

    // Se o exercício não tiver metadados musculares mapeáveis (ex: legado desconhecido), ignora
    if (!primary && secondary.length === 0) {
      continue;
    }

    const sets = ex.sets || [];
    const completedSetsCount = sets.filter(isSetCompleted).length;
    const plannedSetsCount = sets.length > 0 ? sets.length : 3;

    if (sets.length > 0) {
      anySetExists = true;
      if (completedSetsCount < sets.length) {
        allSetsCompleted = false;
      }
    }

    totalCompletedSets += completedSetsCount;
    totalPlannedSets += plannedSetsCount;

    // 1. Acumula estímulo do músculo primário
    if (primary) {
      const acc = getOrCreate(primary);
      acc.plannedSets += plannedSetsCount;
      acc.rawPlannedLoad += plannedSetsCount * PRIMARY_MUSCLE_WEIGHT;

      if (completedSetsCount > 0) {
        acc.completedSets += completedSetsCount;
        acc.primarySets += completedSetsCount;
        acc.rawCompletedLoad += completedSetsCount * PRIMARY_MUSCLE_WEIGHT;
      }
    }

    // 2. Acumula estímulo dos músculos secundários
    for (const sec of secondary) {
      const acc = getOrCreate(sec);
      acc.plannedSets += plannedSetsCount;
      acc.rawPlannedLoad += plannedSetsCount * SECONDARY_MUSCLE_WEIGHT;

      if (completedSetsCount > 0) {
        acc.completedSets += completedSetsCount;
        acc.secondarySets += completedSetsCount;
        acc.rawCompletedLoad += completedSetsCount * SECONDARY_MUSCLE_WEIGHT;
      }
    }
  }

  const hasCompletedSets = totalCompletedSets > 0;
  const mode: 'planned' | 'live' | 'completed' = !hasCompletedSets
    ? 'planned'
    : anySetExists && allSetsCompleted
      ? 'completed'
      : 'live';

  const values: MuscleMapValues = {};
  const details: MuscleWorkloadDetail[] = [];

  if (hasCompletedSets) {
    // Modo REAL (Live / Completed): normaliza com base nas séries concluídas
    let maxCompletedLoad = 0;
    for (const acc of accumulators.values()) {
      if (acc.rawCompletedLoad > maxCompletedLoad) {
        maxCompletedLoad = acc.rawCompletedLoad;
      }
    }

    for (const acc of accumulators.values()) {
      if (acc.rawCompletedLoad <= 0) continue;

      const score = maxCompletedLoad > 0
        ? Math.max(1, Math.round((acc.rawCompletedLoad / maxCompletedLoad) * 100))
        : 0;

      const loadPercentage = score;

      const mapValue: MuscleMapValue = {
        score,
        sets: acc.completedSets
      };

      values[acc.group] = mapValue;

      details.push({
        group: acc.group,
        label: SOMMA_MUSCLE_LABELS[acc.group] || acc.group,
        score,
        rawLoad: acc.rawCompletedLoad,
        completedSets: acc.completedSets,
        primarySets: acc.primarySets,
        secondarySets: acc.secondarySets,
        plannedSets: acc.plannedSets,
        loadPercentage
      });
    }
  } else {
    // Modo PLANEJADO: calcula intensidade suave entre 15 e 25
    let maxPlannedLoad = 0;
    for (const acc of accumulators.values()) {
      if (acc.rawPlannedLoad > maxPlannedLoad) {
        maxPlannedLoad = acc.rawPlannedLoad;
      }
    }

    for (const acc of accumulators.values()) {
      if (acc.rawPlannedLoad <= 0) continue;

      const relativeRatio = maxPlannedLoad > 0 ? acc.rawPlannedLoad / maxPlannedLoad : 0;
      // Score visual planejado entre 15 e 25 (suave)
      const score = Math.round(15 + relativeRatio * 10);
      const loadPercentage = Math.round(relativeRatio * 100);

      const mapValue: MuscleMapValue = {
        score,
        sets: acc.plannedSets
      };

      values[acc.group] = mapValue;

      details.push({
        group: acc.group,
        label: SOMMA_MUSCLE_LABELS[acc.group] || acc.group,
        score,
        rawLoad: acc.rawPlannedLoad,
        completedSets: 0,
        primarySets: 0,
        secondarySets: 0,
        plannedSets: acc.plannedSets,
        loadPercentage
      });
    }
  }

  // Ordena os detalhes do maior estímulo para o menor
  details.sort((a, b) => b.rawLoad - a.rawLoad || b.completedSets - a.completedSets);

  return {
    values,
    details,
    hasCompletedSets,
    totalCompletedSets,
    totalPlannedSets,
    mode
  };
}
