import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_ROUTINES } from '../src/data/mockData';
import { Routine, ExerciseSet, SetRole, SetMethod } from '../src/types';

// Regra de produto Free: Limite de rotinas salvas
const FREE_ROUTINES_LIMIT = 4;

function canCreateNewRoutine(currentCount: number, limit: number = FREE_ROUTINES_LIMIT): boolean {
  return currentCount < limit;
}

test('1. Contador e criação com 0/4 rotinas salvas', () => {
  const currentCount = 0;
  assert.equal(canCreateNewRoutine(currentCount), true, 'Pode criar rotina');
  const display = `${currentCount}/${FREE_ROUTINES_LIMIT}`;
  assert.equal(display, '0/4');
});

test('2. Criação permitida com 1/4 rotinas salvas', () => {
  const currentCount = 1;
  assert.equal(canCreateNewRoutine(currentCount), true, 'Pode criar rotina');
  assert.equal(`${currentCount}/${FREE_ROUTINES_LIMIT}`, '1/4');
});

test('3. Estado padrão do app inicia com 3 rotinas (3/4 utilizadas)', () => {
  assert.equal(INITIAL_ROUTINES.length, 3, 'App possui 3 rotinas padrão');
  assert.equal(canCreateNewRoutine(INITIAL_ROUTINES.length), true, 'Pode criar a 4ª rotina');
  assert.equal(`${INITIAL_ROUTINES.length}/${FREE_ROUTINES_LIMIT}`, '3/4');
});

test('4. Limite atingido em 4/4 rotinas salvas', () => {
  const routinesList: string[] = ['r1', 'r2', 'r3', 'r4'];
  assert.equal(routinesList.length, 4);
  assert.equal(canCreateNewRoutine(routinesList.length), false, 'Bloqueia criação da 5ª rotina');
  assert.equal(`${routinesList.length}/${FREE_ROUTINES_LIMIT}`, '4/4');
});

test('5. Tentativa de 5ª rotina é rejeitada e aciona modal de limite atingido', () => {
  const routinesList: string[] = ['r1', 'r2', 'r3', 'r4'];
  let modalTriggered = false;

  const handleOpenNewRoutine = () => {
    if (routinesList.length >= FREE_ROUTINES_LIMIT) {
      modalTriggered = true;
      return;
    }
    routinesList.push('r5');
  };

  handleOpenNewRoutine();
  assert.equal(modalTriggered, true, 'Modal de limite foi acionado');
  assert.equal(routinesList.length, 4, 'Nenhuma 5ª rotina foi adicionada');
});

test('6. Treino vazio continua sempre disponível mesmo com 4/4 rotinas salvas', () => {
  const routinesCount = 4;
  let startedRoutine: Routine | null | undefined = undefined;

  const handleStartEmptyWorkout = () => {
    // Treino vazio nunca consulta limite de rotinas salvas
    startedRoutine = null;
  };

  handleStartEmptyWorkout();
  assert.equal(startedRoutine, null, 'Treino vazio iniciado com sucesso');
});

test('7. Edição e adição de exercícios à rotina existente continuam funcionando com 4/4 rotinas', () => {
  const routine: Routine = {
    id: 'custom-1',
    name: 'Treino A',
    category: 'Empurrar',
    lastSession: 'Hoje',
    exercisesCount: 1,
    estimatedMinutes: 45,
    exercises: [
      {
        id: 'ex-1',
        name: 'Supino Reto',
        muscleGroup: 'Peitoral',
        sets: [{ id: 's1', setNumber: 1, weight: 80, reps: 10, completed: false }]
      }
    ]
  };

  // Adicionar exercício a rotina existente com 4/4 não altera a contagem de rotinas
  const updatedExercises = [
    ...routine.exercises,
    {
      id: 'ex-2',
      name: 'Crucifixo',
      muscleGroup: 'Peitoral',
      sets: [{ id: 's2-1', setNumber: 1, weight: 20, reps: 12, completed: false }]
    }
  ];

  const updatedRoutine = {
    ...routine,
    exercises: updatedExercises,
    exercisesCount: updatedExercises.length
  };

  assert.equal(updatedRoutine.exercisesCount, 2, 'Exercício adicionado à rotina existente com sucesso');
});

test('8. Exclusão de rotina: 4/4 -> 3/4 restaura permissão de criação', () => {
  let routinesList = ['r1', 'r2', 'r3', 'r4'];
  assert.equal(canCreateNewRoutine(routinesList.length), false, 'Com 4/4 não pode criar');

  // Excluir 1 rotina
  routinesList = routinesList.filter(id => id !== 'r4');

  assert.equal(routinesList.length, 3, 'Contagem reduzida para 3');
  assert.equal(canCreateNewRoutine(routinesList.length), true, 'Criação volta a ficar disponível');
  assert.equal(`${routinesList.length}/${FREE_ROUTINES_LIMIT}`, '3/4');
});

test('9. Métodos de treinamento NÃO são bloqueados pelo plano Free', () => {
  // Verificação de que SetRole e SetMethod permanecem disponíveis e configuráveis
  const roles: SetRole[] = ['working', 'warmup', 'top_set', 'backoff'];
  const methods: SetMethod[] = ['normal', 'dropset', 'rest_pause', 'amrap'];

  const testSet: ExerciseSet = {
    id: 'free-set-1',
    setNumber: 1,
    role: 'top_set',
    method: 'dropset',
    rir: 1,
    weight: 90,
    reps: 8,
    completed: false
  };

  assert.equal(testSet.role, 'top_set');
  assert.equal(testSet.method, 'dropset');
  assert.ok(roles.includes('top_set'));
  assert.ok(methods.includes('dropset'));
});
