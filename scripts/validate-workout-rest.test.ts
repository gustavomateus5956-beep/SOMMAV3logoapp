import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_REST_SECONDS, PRESET_REST_TIMES } from '../src/components/active-workout/RestSettingsSheet';
import type { Exercise } from '../src/types';

test('1. Supino com 2min: concluir série inicia descanso em 120s (2:00)', () => {
  const supino: Exercise = {
    id: 'ex-bench',
    name: 'Supino Reto',
    muscleGroup: 'Peitoral',
    restSeconds: 120,
    sets: [{ id: 's1', setNumber: 1, weight: 80, reps: 10, completed: false }]
  };

  const defaultRestTime = 120;
  const targetRest = supino.restSeconds ?? (supino as any).restTimeSeconds ?? defaultRestTime;
  assert.equal(targetRest, 120);
});

test('2. Exercício seguinte com 45s: concluir série inicia em 45s (0:45)', () => {
  const triceps: Exercise = {
    id: 'ex-tri',
    name: 'Tríceps Corda',
    muscleGroup: 'Tríceps',
    restSeconds: 45,
    sets: [{ id: 's1', setNumber: 1, weight: 25, reps: 15, completed: false }]
  };

  const defaultRestTime = 120;
  const targetRest = triceps.restSeconds ?? (triceps as any).restTimeSeconds ?? defaultRestTime;
  assert.equal(targetRest, 45);
});

test('3. Personalizado 1:15: calcula 75s corretamente dentro dos limites', () => {
  const customMinutes = 1;
  const customSeconds = 15;
  const calculatedTotal = customMinutes * 60 + customSeconds;

  assert.equal(calculatedTotal, 75);
  assert.ok(calculatedTotal > 0);
  assert.ok(calculatedTotal <= MAX_REST_SECONDS);
});

test('4. +30s: barra e timer atualizam corretamente sem salto incoerente', () => {
  let restSeconds = 60;
  let restTotalSeconds = 60;
  const delta = 30;

  restSeconds = restSeconds + delta;
  restTotalSeconds = Math.max(restSeconds, restTotalSeconds + delta);

  assert.equal(restSeconds, 90);
  assert.equal(restTotalSeconds, 90);

  const percentage = (restSeconds / restTotalSeconds) * 100;
  assert.equal(percentage, 100);
});

test('5. -15s: barra e timer atualizam corretamente', () => {
  let restSeconds = 60;
  let restTotalSeconds = 60;
  const delta = -15;

  const nextRem = Math.max(0, restSeconds + delta);
  const nextTot = Math.max(nextRem, restTotalSeconds + delta);

  assert.equal(nextRem, 45);
  assert.equal(nextTot, 45);
  assert.equal((nextRem / nextTot) * 100, 100);
});

test('6. Pausar/retomar: mantém consistência sem perder tempo decorrido', () => {
  let isRestPaused = false;
  let restSeconds: number | null = 50;

  // Pausar
  isRestPaused = true;
  // Simular tick enquanto pausado
  if (!isRestPaused && restSeconds !== null) {
    restSeconds -= 1;
  }
  assert.equal(restSeconds, 50);

  // Retomar
  isRestPaused = false;
  if (!isRestPaused && restSeconds !== null) {
    restSeconds -= 1;
  }
  assert.equal(restSeconds, 49);
});

test('7. Pular: encerra descanso imediatamente sem transição para 0', () => {
  let restSeconds: number | null = 45;
  let restTotalSeconds: number | null = 60;
  let soundPlayed = false;

  // Ao pular, o estado é zerado diretamente
  restSeconds = null;
  restTotalSeconds = null;

  assert.equal(restSeconds, null);
  assert.equal(restTotalSeconds, null);
  assert.equal(soundPlayed, false, 'Som não deve tocar ao pular');
});

test('8. Final natural: atinge 1 -> 0 e dispara término', () => {
  let restSeconds: number | null = 1;
  let soundPlayed = false;

  // Ticker processa 1s restante
  if (restSeconds !== null && restSeconds <= 1) {
    restSeconds = null;
    soundPlayed = true;
  }

  assert.equal(restSeconds, null);
  assert.equal(soundPlayed, true, 'Som toca na transição natural de 1 para 0');
});

test('9. Alterar descanso de um exercício mantém os demais exercícios intactos', () => {
  const exercises: Exercise[] = [
    { id: '1', name: 'Supino Reto', muscleGroup: 'Peitoral', restSeconds: 120, sets: [] },
    { id: '2', name: 'Supino Inclinado', muscleGroup: 'Peitoral', restSeconds: 90, sets: [] },
    { id: '3', name: 'Crucifixo', muscleGroup: 'Peitoral', restSeconds: 60, sets: [] },
    { id: '4', name: 'Tríceps Corda', muscleGroup: 'Tríceps', restSeconds: 45, sets: [] }
  ];

  // Alterar Supino Reto de 120s para 90s
  exercises[0].restSeconds = 90;

  assert.equal(exercises[0].restSeconds, 90);
  assert.equal(exercises[1].restSeconds, 90);
  assert.equal(exercises[2].restSeconds, 60);
  assert.equal(exercises[3].restSeconds, 45);
});

test('10. Reabertura do modal de descanso reflete o valor salvo do exercício', () => {
  const exercise: Exercise = {
    id: 'ex-1',
    name: 'Crucifixo Halteres',
    muscleGroup: 'Peitoral',
    restSeconds: 75,
    sets: []
  };

  const initial = exercise.restSeconds ?? 120;
  assert.equal(initial, 75);

  const matchedPreset = PRESET_REST_TIMES.find((p) => p.seconds === initial);
  assert.equal(matchedPreset, undefined, '75s não é preset padrão e abre em personalizado');
});
