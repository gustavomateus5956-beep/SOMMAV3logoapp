/**
 * Dicionário centralizado de regiões e grupos corporais PT-BR.
 * Mapeia valores da ExerciseDB e termos internacionais para o padrão brasileiro SOMMA+.
 */

export const BODY_PART_PT_BR: Record<string, string> = {
  chest: 'Peitoral',
  back: 'Costas',
  'upper arms': 'Braços',
  'lower arms': 'Antebraços',
  'upper legs': 'Coxas',
  'lower legs': 'Pernas',
  shoulders: 'Ombros',
  waist: 'Abdômen / Core',
  neck: 'Pescoço',
  cardio: 'Cardiorrespiratório'
};

/**
 * Traduz e normaliza a região corporal (bodyPart) para Português do Brasil.
 */
export function translateBodyPart(bodyPart?: string): string {
  if (!bodyPart) return 'Geral';
  const clean = bodyPart.toLowerCase().trim();
  
  if (BODY_PART_PT_BR[clean]) {
    return BODY_PART_PT_BR[clean];
  }

  // Comparações parciais inteligentes
  if (clean.includes('chest')) return 'Peitoral';
  if (clean.includes('back')) return 'Costas';
  if (clean.includes('shoulder')) return 'Ombros';
  if (clean.includes('upper arm') || clean.includes('arm')) return 'Braços';
  if (clean.includes('lower arm') || clean.includes('forearm')) return 'Antebraços';
  if (clean.includes('waist') || clean.includes('abs') || clean.includes('core')) return 'Abdômen / Core';
  if (clean.includes('upper leg') || clean.includes('thigh')) return 'Coxas';
  if (clean.includes('lower leg') || clean.includes('calf')) return 'Pernas';
  if (clean.includes('leg')) return 'Pernas';
  if (clean.includes('neck')) return 'Pescoço';
  if (clean.includes('cardio')) return 'Cardiorrespiratório';

  return bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1);
}
