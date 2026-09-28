import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWorkoutMuscleScores,
  mapSommaMuscleToGroup,
  extractExerciseMuscleGroups,
  SOMMA_MUSCLE_LABELS,
  UNMAPPED_SOMMA_KEYS
} from '../src/features/muscle-map/sommaMuscleMapAdapter';
import type { Exercise } from '../src/types';

test('1. Treino vazio retorna values={}, details=[] e mode=planned', () => {
  const result = calculateWorkoutMuscleScores([]);
  assert.deepEqual(result.values, {});
  assert.equal(result.details.length, 0);
  assert.equal(result.hasCompletedSets, false);
  assert.equal(result.totalCompletedSets, 0);
  assert.equal(result.mode, 'planned');
});

test('2. Mapeamento de chaves SOMMA para MuscleGroup', () => {
  assert.equal(mapSommaMuscleToGroup('pectorals'), 'CHEST');
  assert.equal(mapSommaMuscleToGroup('Peitoral'), 'CHEST');
  assert.equal(mapSommaMuscleToGroup('triceps'), 'TRICEPS');
  assert.equal(mapSommaMuscleToGroup('Tríceps'), 'TRICEPS');
  assert.equal(mapSommaMuscleToGroup('biceps'), 'BICEPS');
  assert.equal(mapSommaMuscleToGroup('Bíceps'), 'BICEPS');
  assert.equal(mapSommaMuscleToGroup('lats'), 'LATS');
  assert.equal(mapSommaMuscleToGroup('Dorsais'), 'LATS');
  assert.equal(mapSommaMuscleToGroup('quads'), 'QUADS');
  assert.equal(mapSommaMuscleToGroup('Quadríceps'), 'QUADS');
  assert.equal(mapSommaMuscleToGroup('hamstrings'), 'HAMSTRINGS');
  assert.equal(mapSommaMuscleToGroup('calves'), 'CALVES');
  assert.equal(mapSommaMuscleToGroup('glutes'), 'GLUTES');
  assert.equal(mapSommaMuscleToGroup('traps'), 'TRAPEZIUS');
  assert.equal(mapSommaMuscleToGroup('Trapézio'), 'TRAPEZIUS');
  assert.equal(mapSommaMuscleToGroup('delts'), 'SHOULDERS_FRONT');
  assert.equal(mapSommaMuscleToGroup('abs'), 'CORE');
  assert.equal(mapSommaMuscleToGroup('obliques'), 'OBLIQUES');
});

test('3. Chaves SOMMA sem correspondência no MuscleMap são tratadas como unmapped/null', () => {
  for (const unmapped of UNMAPPED_SOMMA_KEYS) {
    const mapped = mapSommaMuscleToGroup(unmapped);
    assert.equal(mapped, null, `Chave ${unmapped} deveria ser unmapped (null)`);
  }
});

test('4. Supino com peito + tríceps + ombros (extração e cálculo)', () => {
  const supino: Exercise = {
    id: '0025',
    name: 'Supino Reto com Barra',
    muscleGroup: 'Peitoral',
    target: 'Peitoral',
    secondaryMuscles: ['Tríceps', 'Ombros'],
    sets: [
      { id: 's1', setNumber: 1, weight: 60, reps: 10, completed: true },
      { id: 's2', setNumber: 2, weight: 80, reps: 10, completed: true },
      { id: 's3', setNumber: 3, weight: 80, reps: 8, completed: false }
    ]
  };

  const groups = extractExerciseMuscleGroups(supino);
  assert.equal(groups.primary, 'CHEST');
  assert.ok(groups.secondary.includes('TRICEPS'));
  assert.ok(groups.secondary.includes('SHOULDERS_FRONT'));

  const result = calculateWorkoutMuscleScores([supino]);
  assert.equal(result.totalCompletedSets, 2);
  assert.equal(result.hasCompletedSets, true);
  assert.equal(result.mode, 'live');

  // Peito (primário): 2 séries * 1.0 = 2.0 rawLoad -> score 100
  // Tríceps (secundário): 2 séries * 0.5 = 1.0 rawLoad -> score 50
  // Ombros (secundário): 2 séries * 0.5 = 1.0 rawLoad -> score 50
  assert.equal(result.values.CHEST?.score, 100);
  assert.equal(result.values.TRICEPS?.score, 50);
  assert.equal(result.values.SHOULDERS_FRONT?.score, 50);

  const chestDetail = result.details.find(d => d.group === 'CHEST');
  assert.equal(chestDetail?.primarySets, 2);
  assert.equal(chestDetail?.secondarySets, 0);
  assert.equal(chestDetail?.completedSets, 2);

  const tricepsDetail = result.details.find(d => d.group === 'TRICEPS');
  assert.equal(tricepsDetail?.primarySets, 0);
  assert.equal(tricepsDetail?.secondarySets, 2);
  assert.equal(tricepsDetail?.completedSets, 2);
});

test('5. Rosca com bíceps', () => {
  const rosca: Exercise = {
    id: '0447',
    name: 'Rosca com Barra W',
    muscleGroup: 'Braços',
    target: 'Bíceps',
    secondaryMuscles: ['Antebraços'],
    sets: [
      { id: 'sb1', setNumber: 1, weight: 30, reps: 10, completed: true },
      { id: 'sb2', setNumber: 2, weight: 30, reps: 10, completed: true }
    ]
  };

  const result = calculateWorkoutMuscleScores([rosca]);
  assert.equal(result.values.BICEPS?.score, 100);
  assert.equal(result.values.FOREARMS?.score, 50);
  assert.equal(result.mode, 'completed'); // all 2 sets completed
});

test('6. Agachamento com quadríceps e secundários', () => {
  const agachamento: Exercise = {
    id: '0043',
    name: 'Completo Agachamento com Barra',
    muscleGroup: 'Pernas',
    target: 'Glúteos',
    secondaryMuscles: ['Quadríceps', 'Posteriores de coxa', 'Panturrilhas'],
    sets: [
      { id: 'sc1', setNumber: 1, weight: 100, reps: 10, completed: true },
      { id: 'sc2', setNumber: 2, weight: 120, reps: 8, completed: true }
    ]
  };

  const result = calculateWorkoutMuscleScores([agachamento]);
  assert.equal(result.values.GLUTES?.score, 100);
  assert.equal(result.values.QUADS?.score, 50);
  assert.equal(result.values.HAMSTRINGS?.score, 50);
  assert.equal(result.values.CALVES?.score, 50);
});

test('7. Marcar e desmarcar série atualiza scores dinamicamente', () => {
  const exercise: Exercise = {
    id: 'ex-1',
    name: 'Supino Reto',
    muscleGroup: 'Peitoral',
    target: 'Peitoral',
    secondaryMuscles: ['Tríceps'],
    sets: [
      { id: 's1', setNumber: 1, weight: 50, reps: 10, completed: false },
      { id: 's2', setNumber: 2, weight: 60, reps: 10, completed: false }
    ]
  };

  // Sem séries concluídas: estado planejado (scores suaves entre 15 e 25)
  const planned = calculateWorkoutMuscleScores([exercise]);
  assert.equal(planned.hasCompletedSets, false);
  assert.equal(planned.mode, 'planned');
  assert.ok(planned.values.CHEST!.score >= 15 && planned.values.CHEST!.score <= 25);
  assert.ok(planned.values.TRICEPS!.score >= 15 && planned.values.TRICEPS!.score <= 25);

  // Marcar série 1
  exercise.sets[0].completed = true;
  const marked1 = calculateWorkoutMuscleScores([exercise]);
  assert.equal(marked1.hasCompletedSets, true);
  assert.equal(marked1.mode, 'live');
  assert.equal(marked1.values.CHEST?.score, 100);
  assert.equal(marked1.values.TRICEPS?.score, 50);

  // Desmarcar série 1 (volta para planned)
  exercise.sets[0].completed = false;
  const unmarked = calculateWorkoutMuscleScores([exercise]);
  assert.equal(unmarked.hasCompletedSets, false);
  assert.equal(unmarked.mode, 'planned');
  assert.ok(unmarked.values.CHEST!.score <= 25);
});

test('8. Múltiplos exercícios do mesmo músculo acumulam corretamente', () => {
  const supinoReto: Exercise = {
    id: '0025',
    name: 'Supino Reto com Barra',
    muscleGroup: 'Peitoral',
    target: 'Peitoral',
    secondaryMuscles: ['Tríceps'],
    sets: [{ id: 's1', setNumber: 1, weight: 80, reps: 10, completed: true }]
  };

  const supinoInclinado: Exercise = {
    id: '0314',
    name: 'Supino Inclinado com Halteres',
    muscleGroup: 'Peitoral',
    target: 'Peitoral',
    secondaryMuscles: ['Tríceps'],
    sets: [{ id: 's2', setNumber: 1, weight: 30, reps: 10, completed: true }]
  };

  const tricepsCorda: Exercise = {
    id: '0200',
    name: 'Tríceps Corda',
    muscleGroup: 'Tríceps',
    target: 'Tríceps',
    secondaryMuscles: [],
    sets: [{ id: 's3', setNumber: 1, weight: 25, reps: 15, completed: true }]
  };

  const result = calculateWorkoutMuscleScores([supinoReto, supinoInclinado, tricepsCorda]);
  // Peito: 2 * 1.0 = 2.0 rawLoad
  // Tríceps: 2 * 0.5 (secundário) + 1 * 1.0 (primário) = 2.0 rawLoad
  // Ambos têm rawLoad 2.0, ambos devem ter score 100
  assert.equal(result.values.CHEST?.score, 100);
  assert.equal(result.values.TRICEPS?.score, 100);

  const tricepsDetail = result.details.find(d => d.group === 'TRICEPS');
  assert.equal(tricepsDetail?.primarySets, 1);
  assert.equal(tricepsDetail?.secondarySets, 2);
  assert.equal(tricepsDetail?.completedSets, 3);
});

test('9. Exercício legado sem muscle metadata é ignorado sem quebrar o treino', () => {
  const legacy: any = {
    id: 'legacy-unknown-999',
    name: 'Exercício Desconhecido Antigo',
    sets: [{ id: 's1', setNumber: 1, weight: 10, reps: 10, completed: true }]
  };

  const supino: Exercise = {
    id: '0025',
    name: 'Supino Reto',
    muscleGroup: 'Peitoral',
    target: 'Peitoral',
    sets: [{ id: 's2', setNumber: 1, weight: 80, reps: 10, completed: true }]
  };

  const result = calculateWorkoutMuscleScores([legacy, supino]);
  assert.equal(result.values.CHEST?.score, 100);
  assert.equal(Object.keys(result.values).length, 1);
  assert.equal(result.details.length, 1);
});
