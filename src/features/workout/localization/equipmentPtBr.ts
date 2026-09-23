/**
 * Dicionário centralizado de equipamentos de treino em PT-BR.
 * Mapeia equipamentos da ExerciseDB para termos usuais em academias brasileiras.
 */

export const EQUIPMENT_PT_BR: Record<string, string> = {
  barbell: 'Barra',
  'olympic barbell': 'Barra olímpica',
  'ez barbell': 'Barra EZ',
  'ez bar': 'Barra EZ',
  'trap bar': 'Barra hexagonal',
  dumbbell: 'Halteres',
  cable: 'Cabo',
  'body weight': 'Peso corporal',
  bodyweight: 'Peso corporal',
  assisted: 'Assistido',
  machine: 'Máquina',
  'leverage machine': 'Máquina articulada',
  'smith machine': 'Smith',
  kettlebell: 'Kettlebell',
  'resistance band': 'Faixa elástica',
  band: 'Elástico',
  'medicine ball': 'Bola medicinal',
  'stability ball': 'Bola suíça',
  rope: 'Corda',
  roller: 'Rolo de liberação',
  'bosu ball': 'Bosu',
  'sled machine': 'Trenó / Sled',
  'stationary bike': 'Bicicleta ergométrica',
  'elliptical machine': 'Elíptico',
  'stepmill machine': 'Escada ergométrica',
  tire: 'Pneu',
  weighted: 'Com sobrecarga'
};

/**
 * Traduz e normaliza o equipamento para o padrão de academias no Brasil.
 */
export function translateEquipment(equipment?: string): string {
  if (!equipment) return 'Livre';
  const clean = equipment.toLowerCase().trim();

  if (EQUIPMENT_PT_BR[clean]) {
    return EQUIPMENT_PT_BR[clean];
  }

  if (clean.includes('barbell') && clean.includes('ez')) return 'Barra EZ';
  if (clean.includes('barbell') && clean.includes('trap')) return 'Barra hexagonal';
  if (clean.includes('barbell')) return 'Barra';
  if (clean.includes('dumbbell')) return 'Halteres';
  if (clean.includes('cable') || clean.includes('pulley')) return 'Cabo';
  if (clean.includes('body weight') || clean.includes('bodyweight')) return 'Peso corporal';
  if (clean.includes('assisted')) return 'Assistido';
  if (clean.includes('smith')) return 'Smith';
  if (clean.includes('machine') || clean.includes('leverage')) return 'Máquina';
  if (clean.includes('band')) return 'Faixa elástica';
  if (clean.includes('kettlebell')) return 'Kettlebell';
  if (clean.includes('ball')) return 'Bola';

  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}
