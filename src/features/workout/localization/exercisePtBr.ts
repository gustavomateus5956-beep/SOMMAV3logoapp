import { EXERCISE_ID_OVERRIDES, EXACT_NAME_OVERRIDES } from './exerciseNameOverrides';
import { SOMMA_EXERCISE_MEDIA_MAP } from '../../../services/exerciseMedia/exerciseMediaMap';
import { EXERCISE_LIBRARY } from '../../../data/exerciseLibrary';

export interface LocalizedExerciseName {
  name: string;
  originalName: string;
  isCustomTranslated: boolean;
}

// Mapa reverso para rápida consulta de equivalências locais SOMMA
const externalIdToSommaNameMap: Record<string, string> = {};
Object.entries(SOMMA_EXERCISE_MEDIA_MAP).forEach(([sommaId, mapping]) => {
  const localEx = EXERCISE_LIBRARY.find((e) => e.id === sommaId);
  if (localEx && mapping.externalId) {
    externalIdToSommaNameMap[mapping.externalId] = localEx.name;
    externalIdToSommaNameMap[mapping.externalId.padStart(4, '0')] = localEx.name;
  }
});

/**
 * Normaliza string removendo acentos e espaços para comparação.
 */
export function normalizeSearchTerm(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Tradutor e normalizador inteligente baseado em padrões de movimentos em academias no Brasil.
 */
function translateByExercisePatterns(rawName: string): string {
  let text = rawName.toLowerCase().trim();

  // 1. Dicionário de movimentos principais
  const movementReplacements: Array<[RegExp, string]> = [
    [/\bbench press\b/gi, 'supino reto'],
    [/\bincline bench press\b/gi, 'supino inclinado'],
    [/\bdecline bench press\b/gi, 'supino declinado'],
    [/\boverhead press\b/gi, 'desenvolvimento de ombros'],
    [/\bshoulder press\b/gi, 'desenvolvimento de ombros'],
    [/\bmilitary press\b/gi, 'desenvolvimento militar'],
    [/\barnold press\b/gi, 'desenvolvimento arnold'],
    [/\bchest fly\b|\bchest flye\b|\bflye\b|\bfly\b/gi, 'crucifixo'],
    [/\breverse fly\b|\brear delt fly\b/gi, 'crucifixo invertido'],
    [/\blat pulldown\b|\bpulldown\b/gi, 'puxada no pulley'],
    [/\bpull-up\b|\bpullup\b/gi, 'barra fixa pronada'],
    [/\bchin-up\b|\bchinup\b/gi, 'barra fixa supinada'],
    [/\bbent over row\b|\bbent-over row\b/gi, 'remada curvada'],
    [/\bupright row\b/gi, 'remada alta'],
    [/\bseated row\b/gi, 'remada sentada'],
    [/\bt-bar row\b/gi, 'remada cavalinho'],
    [/\brow\b/gi, 'remada'],
    [/\bfront squat\b/gi, 'agachamento frontal'],
    [/\bgoblet squat\b/gi, 'agachamento taça (goblet)'],
    [/\bhack squat\b/gi, 'agachamento hack'],
    [/\bsissy squat\b/gi, 'agachamento sissy'],
    [/\bbulgarian split squat\b|\bsplit squat\b/gi, 'agachamento búlgaro'],
    [/\bsquat\b/gi, 'agachamento'],
    [/\bleg press\b/gi, 'leg press'],
    [/\bleg extension\b/gi, 'cadeira extensora'],
    [/\blying leg curl\b|\bleg curl\b/gi, 'mesa flexora'],
    [/\bseated leg curl\b/gi, 'cadeira flexora'],
    [/\bromanian deadlift\b|\brdl\b/gi, 'levantamento terra romeno'],
    [/\bstiff-legged deadlift\b|\bstiff leg deadlift\b|\bstiff deadlift\b/gi, 'stiff'],
    [/\bsumo deadlift\b/gi, 'levantamento terra sumô'],
    [/\bdeadlift\b/gi, 'levantamento terra'],
    [/\bhip thrust\b/gi, 'elevação pélvica'],
    [/\bglute bridge\b/gi, 'ponte de glúteos'],
    [/\bglute kickback\b|\bkickback\b/gi, 'coice para glúteos'],
    [/\bstanding calf raise\b/gi, 'elevação de panturrilha em pé'],
    [/\bseated calf raise\b/gi, 'elevação de panturrilha sentado'],
    [/\bcalf raise\b|\bcalf press\b/gi, 'elevação de panturrilha'],
    [/\bpreacher curl\b/gi, 'rosca scott'],
    [/\bhammer curl\b/gi, 'rosca martelo'],
    [/\bconcentration curl\b/gi, 'rosca concentrada'],
    [/\bspider curl\b/gi, 'rosca aranha'],
    [/\breverse curl\b/gi, 'rosca inversa'],
    [/\bwrist curl\b/gi, 'rosca de punho'],
    [/\bbicep curl\b|\bcurl\b/gi, 'rosca bíceps'],
    [/\bskull crusher\b|\blying triceps extension\b/gi, 'tríceps testa'],
    [/\boverhead triceps extension\b|\bfrench press\b/gi, 'tríceps francês'],
    [/\btriceps pushdown\b|\bpushdown\b/gi, 'tríceps na polia'],
    [/\btriceps extension\b/gi, 'extensão de tríceps'],
    [/\bdip\b|\bdips\b/gi, 'paralelas'],
    [/\blateral raise\b|\bside raise\b/gi, 'elevação lateral'],
    [/\bfront raise\b/gi, 'elevação frontal'],
    [/\bface pull\b/gi, 'face pull na polia'],
    [/\bshrug\b|\bshrugs\b/gi, 'encolhimento de ombros'],
    [/\bhanging leg raise\b/gi, 'elevação de pernas suspenso'],
    [/\bhanging knee raise\b/gi, 'elevação de joelhos suspenso'],
    [/\breverse crunch\b/gi, 'abdominal infra'],
    [/\bcrunch\b/gi, 'abdominal supra'],
    [/\bsit-up\b|\bsitup\b/gi, 'abdominal completo'],
    [/\bside plank\b/gi, 'prancha lateral'],
    [/\bplank\b/gi, 'prancha isométrica'],
    [/\bpush-up\b|\bpushup\b/gi, 'flexão de braços'],
    [/\bwheel rollout\b|\bab roller\b/gi, 'rolo abdominal (ab wheel)'],
    [/\brussian twist\b/gi, 'abdominal giro russo']
  ];

  for (const [regex, replacement] of movementReplacements) {
    if (regex.test(text)) {
      text = text.replace(regex, replacement);
      break;
    }
  }

  // 2. Modificadores e Equipamentos comuns
  const modifierReplacements: Array<[RegExp, string]> = [
    [/\bbarbell\b/gi, 'com barra'],
    [/\bez bar\b|\bez-bar\b|\bez barbell\b/gi, 'com barra EZ'],
    [/\bdumbbell\b/gi, 'com halteres'],
    [/\bcable\b/gi, 'na polia'],
    [/\bmachine\b|\bleverage\b/gi, 'na máquina'],
    [/\bsmith machine\b|\bsmith\b/gi, 'no Smith'],
    [/\bkettlebell\b/gi, 'com kettlebell'],
    [/\bresistance band\b|\bband\b/gi, 'com elástico'],
    [/\bbody weight\b|\bbodyweight\b/gi, 'livre (peso corporal)'],
    [/\bincline\b/gi, 'inclinado'],
    [/\bdecline\b/gi, 'declinado'],
    [/\bseated\b/gi, 'sentado'],
    [/\bstanding\b/gi, 'em pé'],
    [/\blying\b/gi, 'deitado'],
    [/\balternating\b/gi, 'alternado'],
    [/\bsingle arm\b|\bone arm\b/gi, 'unilateral'],
    [/\bsingle leg\b|\bone leg\b/gi, 'unilateral'],
    [/\bwide grip\b/gi, 'pegada aberta'],
    [/\bclose grip\b|\bnarrow grip\b/gi, 'pegada fechada'],
    [/\breverse grip\b/gi, 'pegada invertida'],
    [/\bneutral grip\b/gi, 'pegada neutra']
  ];

  for (const [regex, replacement] of modifierReplacements) {
    text = text.replace(regex, replacement);
  }

  // Limpeza de espaços extras e preposições duplicadas
  text = text
    .replace(/\s+/g, ' ')
    .replace(/com barra com barra/gi, 'com barra')
    .replace(/com halteres com halteres/gi, 'com halteres')
    .replace(/na polia na polia/gi, 'na polia')
    .trim();

  // Capitaliza a primeira letra de cada frase
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Traduz e normaliza o nome do exercício com prioridades estritas:
 * 1. Mapeamento para Exercício Local SOMMA (se já existir equivalente).
 * 2. Sobrescrita manual por ID (`EXERCISE_ID_OVERRIDES`).
 * 3. Sobrescrita manual por Nome Exato (`EXACT_NAME_OVERRIDES`).
 * 4. Normalizador inteligente baseado em padrões de academia brasileira.
 * 5. Fallback formatado preservando originalName.
 */
export function localizeExerciseName(
  rawName: string,
  externalId?: string
): LocalizedExerciseName {
  const originalName = (rawName || '').trim();
  const normalizedOriginal = originalName.toLowerCase();

  // 1. Prioridade: Exercício SOMMA equivalente já existente
  if (externalId && externalIdToSommaNameMap[externalId]) {
    return {
      name: externalIdToSommaNameMap[externalId],
      originalName,
      isCustomTranslated: true
    };
  }

  // 2. Prioridade: Sobrescrita manual por ID
  if (externalId && EXERCISE_ID_OVERRIDES[externalId]) {
    return {
      name: EXERCISE_ID_OVERRIDES[externalId],
      originalName,
      isCustomTranslated: true
    };
  }

  // 3. Prioridade: Sobrescrita manual por Nome Exato
  if (EXACT_NAME_OVERRIDES[normalizedOriginal]) {
    return {
      name: EXACT_NAME_OVERRIDES[normalizedOriginal],
      originalName,
      isCustomTranslated: true
    };
  }

  // 4. Prioridade: Normalizador inteligente por padrões
  const translatedByPattern = translateByExercisePatterns(originalName);
  if (translatedByPattern && translatedByPattern.toLowerCase() !== normalizedOriginal) {
    return {
      name: translatedByPattern,
      originalName,
      isCustomTranslated: true
    };
  }

  // 5. Fallback controlado mantendo original com formatação limpa
  const formatted = originalName
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: formatted,
    originalName,
    isCustomTranslated: false
  };
}
