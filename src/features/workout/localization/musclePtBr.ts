/**
 * Dicionário centralizado de músculos anatômicos e músculos-alvo PT-BR.
 * Base para normalização de alvos da ExerciseDB e futura integração com MuscleMap.
 */

export const MUSCLE_PT_BR: Record<string, string> = {
  // Peitoral
  pectorals: 'Peitoral',
  'upper chest': 'Peitoral superior',
  'lower chest': 'Peitoral inferior',
  'middle chest': 'Peitoral médio',
  'sternal head': 'Feixe esternal do peitoral',
  'clavicular head': 'Feixe clavicular do peitoral',

  // Costas
  lats: 'Dorsais',
  'latissimus dorsi': 'Grande dorsal',
  traps: 'Trapézio',
  trapezius: 'Trapézio',
  'upper back': 'Costas superior',
  'middle back': 'Costas média',
  'lower back': 'Lombar',
  spine: 'Eretores da coluna',
  rhomboids: 'Rombóides',
  'teres major': 'Redondo maior',
  'teres minor': 'Redondo menor',
  'levator scapulae': 'Elevador da escápula',

  // Ombros
  delts: 'Deltoides',
  deltoids: 'Deltoides',
  'anterior deltoid': 'Deltoide anterior',
  'lateral deltoid': 'Deltoide lateral',
  'posterior deltoid': 'Deltoide posterior',
  shoulders: 'Ombros',
  'rotator cuff': 'Manguito rotador',
  supraspinatus: 'Supraespinhal',
  infraspinatus: 'Infraespinhal',
  subscapularis: 'Subescapular',

  // Braços
  biceps: 'Bíceps',
  'biceps brachii': 'Bíceps braquial',
  triceps: 'Tríceps',
  'triceps brachii': 'Tríceps braquial',
  brachialis: 'Braquial',
  brachioradialis: 'Braquiorradial',
  forearms: 'Antebraços',
  'wrist flexors': 'Flexores de punho',
  'wrist extensors': 'Extensores de punho',
  'grip muscles': 'Musculatura de pegada',
  hands: 'Mãos / Pegada',

  // Abdômen & Core
  abs: 'Abdômen',
  abdominals: 'Abdômen',
  'upper abs': 'Abdômen superior',
  'lower abs': 'Abdômen inferior',
  obliques: 'Oblíquos',
  'transverse abdominis': 'Transverso abdominal',
  serratus: 'Serrátil anterior',
  'serratus anterior': 'Serrátil anterior',
  core: 'Core',

  // Pernas & Quadril
  quads: 'Quadríceps',
  quadriceps: 'Quadríceps',
  hamstrings: 'Posteriores de coxa',
  glutes: 'Glúteos',
  'gluteus maximus': 'Glúteo máximo',
  'gluteus medius': 'Glúteo médio',
  'gluteus minimus': 'Glúteo mínimo',
  calves: 'Panturrilhas',
  gastrocnemius: 'Gastrocnêmio',
  soleus: 'Sóleo',
  'tibialis anterior': 'Tibial anterior',
  shins: 'Tibial / Canela',
  adductors: 'Adutores',
  abductors: 'Abdutores',
  'inner thighs': 'Parte interna da coxa',
  'hip flexors': 'Flexores do quadril',
  iliopsoas: 'Iliopsoas',
  sartorius: 'Sartório',
  gracilis: 'Grácil',
  pectineus: 'Pectíneo',

  // Pescoço & Diversos
  neck: 'Pescoço',
  sternocleidomastoid: 'Esternocleidomastoideo'
};

/**
 * Traduz e normaliza o nome do músculo para o padrão brasileiro.
 */
export function translateMuscle(muscle?: string): string {
  if (!muscle) return '';
  const clean = muscle.toLowerCase().trim();

  if (MUSCLE_PT_BR[clean]) {
    return MUSCLE_PT_BR[clean];
  }

  // Comparações contextuais
  if (clean.includes('pectoral') || clean.includes('chest')) return 'Peitoral';
  if (clean.includes('bicep')) return 'Bíceps';
  if (clean.includes('tricep')) return 'Tríceps';
  if (clean.includes('delt')) return 'Deltoides';
  if (clean.includes('lat') && !clean.includes('lateral')) return 'Dorsais';
  if (clean.includes('trap')) return 'Trapézio';
  if (clean.includes('quad')) return 'Quadríceps';
  if (clean.includes('hamstring')) return 'Posteriores de coxa';
  if (clean.includes('glute')) return 'Glúteos';
  if (clean.includes('calf') || clean.includes('calves')) return 'Panturrilhas';
  if (clean.includes('abdom') || clean === 'abs') return 'Abdômen';
  if (clean.includes('forearm')) return 'Antebraços';
  if (clean.includes('adductor')) return 'Adutores';
  if (clean.includes('abductor')) return 'Abdutores';
  if (clean.includes('spine') || clean.includes('lower back')) return 'Eretores da coluna';

  return muscle.charAt(0).toUpperCase() + muscle.slice(1);
}

/**
 * Traduz uma lista de músculos anatômicos.
 */
export function translateMuscleList(muscles: string[] = []): string[] {
  return muscles.map(translateMuscle).filter(Boolean);
}
