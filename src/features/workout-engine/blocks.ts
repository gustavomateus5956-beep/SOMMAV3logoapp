import type { VisualWorkoutBlock, WorkoutBlock } from './contracts';

/** Explicit bridge only. No scheduler, timer or load execution. */
export function fromVisualBlock(block: VisualWorkoutBlock, order: number): WorkoutBlock {
  return { schemaVersion: 1, id: block.id, name: block.name, type: 'SUPERSET', order,
    exerciseIds: [...block.exerciseIds], restBetweenExercisesSeconds: block.transitionRestSeconds,
    restAfterBlockSeconds: block.blockRestSeconds, legacyVisualType: block.type };
}

export function toVisualBlock(block: WorkoutBlock): VisualWorkoutBlock {
  if (block.type !== 'SUPERSET' || block.exerciseIds.length !== 2 ||
      block.restBetweenExercisesSeconds === undefined || block.restAfterBlockSeconds === undefined) {
    throw new Error('O Superset visual atual exige dois exercícios e descansos explícitos.');
  }
  return { id: block.id, name: block.name ?? 'SUPERSET', type: block.legacyVisualType ?? 'superset',
    exerciseIds: [...block.exerciseIds], transitionRestSeconds: block.restBetweenExercisesSeconds,
    blockRestSeconds: block.restAfterBlockSeconds };
}

export function validateBlocks(blocks: WorkoutBlock[], exerciseIds: string[]): void {
  const ids = new Set<string>();
  const orders = new Set<number>();
  const members = new Set<string>();
  for (const block of blocks) {
    if (block.schemaVersion !== 1 || !block.id || ids.has(block.id) || !Number.isInteger(block.order) || block.order < 0 || orders.has(block.order)) throw new Error('Bloco/ordem inválido ou duplicado.');
    ids.add(block.id); orders.add(block.order);
    if (!['STANDARD', 'SUPERSET'].includes(block.type) || (block.type === 'STANDARD' ? block.exerciseIds.length !== 1 : block.exerciseIds.length < 2)) throw new Error('Membros incompatíveis com o bloco.');
    for (const id of block.exerciseIds) {
      if (!exerciseIds.includes(id) || members.has(id)) throw new Error('Exercício ausente ou agrupado mais de uma vez.');
      members.add(id);
    }
    for (const value of [block.restBetweenExercisesSeconds, block.restAfterBlockSeconds]) {
      if (value !== undefined && (!Number.isFinite(value) || value < 0)) throw new Error('Descanso inválido.');
    }
  }
}
