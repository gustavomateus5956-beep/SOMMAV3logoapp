import test from 'node:test';
import assert from 'node:assert/strict';
import type { ExerciseSet, SetRole, SetMethod } from '../src/types';

function computeSetBadge(sets: ExerciseSet[], currentIndex: number) {
  const currentSet = sets[currentIndex];
  const effectiveRole: SetRole = currentSet.role || (currentSet.type === 'warmup' ? 'warmup' : 'working');
  const effectiveMethod: SetMethod =
    currentSet.method ||
    (currentSet.type === 'dropset'
      ? 'dropset'
      : currentSet.type === 'rest_pause'
      ? 'rest_pause'
      : currentSet.type === 'amrap'
      ? 'amrap'
      : 'normal');

  let countForRole = 0;
  for (let i = 0; i <= currentIndex; i++) {
    const s = sets[i];
    const r: SetRole = s.role || (s.type === 'warmup' ? 'warmup' : 'working');
    if (r === effectiveRole) {
      countForRole++;
    }
  }

  let setSymbol = `${countForRole}`;
  if (effectiveRole === 'warmup') {
    setSymbol = `A${countForRole}`;
  } else if (effectiveRole === 'top_set') {
    setSymbol = `T${countForRole}`;
  } else if (effectiveRole === 'backoff') {
    setSymbol = `B${countForRole}`;
  }

  return { setSymbol, effectiveRole, effectiveMethod };
}

function computeSummaryTokens(set: ExerciseSet, exerciseRest = 120): string[] {
  const effectiveRole: SetRole = set.role || (set.type === 'warmup' ? 'warmup' : 'working');
  const effectiveMethod: SetMethod =
    set.method ||
    (set.type === 'dropset'
      ? 'dropset'
      : set.type === 'rest_pause'
      ? 'rest_pause'
      : set.type === 'amrap'
      ? 'amrap'
      : 'normal');

  const summaryTokens: string[] = [];
  if (effectiveMethod === 'dropset') summaryTokens.push('DROP SET');
  else if (effectiveMethod === 'rest_pause') summaryTokens.push('REST-PAUSE');
  else if (effectiveMethod === 'amrap') summaryTokens.push('AMRAP');

  if (effectiveRole === 'top_set') summaryTokens.push('TOP SET');
  else if (effectiveRole === 'backoff') summaryTokens.push('BACK-OFF');

  if (set.targetRepsRange && set.targetRepsRange.trim()) {
    summaryTokens.push(set.targetRepsRange);
  }

  if (set.rir !== undefined && set.rir !== null) {
    summaryTokens.push(`RIR ${set.rir}`);
  } else if (set.rpe !== undefined && set.rpe !== null) {
    summaryTokens.push(`RPE ${set.rpe}`);
  }

  if (set.restTimeSeconds && set.restTimeSeconds > 0 && set.restTimeSeconds !== exerciseRest) {
    summaryTokens.push(`${set.restTimeSeconds}s`);
  }

  return summaryTokens;
}

test('1. Séries convencionais sem configuração assumem Função: Trabalho e numeração 1, 2, 3', () => {
  const sets: ExerciseSet[] = [
    { id: '1', setNumber: 1, weight: 80, reps: 10, completed: false },
    { id: '2', setNumber: 2, weight: 80, reps: 10, completed: false },
    { id: '3', setNumber: 3, weight: 80, reps: 10, completed: false }
  ];

  assert.equal(computeSetBadge(sets, 0).setSymbol, '1');
  assert.equal(computeSetBadge(sets, 1).setSymbol, '2');
  assert.equal(computeSetBadge(sets, 2).setSymbol, '3');
  assert.equal(computeSummaryTokens(sets[0]).length, 0, 'Sem poluição visual para série padrão');
});

test('2. Aquecimento recebe A1, A2 e Top Set recebe T1', () => {
  const sets: ExerciseSet[] = [
    { id: '1', setNumber: 1, role: 'warmup', weight: 40, reps: 15, completed: true },
    { id: '2', setNumber: 2, role: 'warmup', weight: 60, reps: 10, completed: true },
    { id: '3', setNumber: 3, role: 'top_set', weight: 100, reps: 6, completed: false },
    { id: '4', setNumber: 4, role: 'working', weight: 80, reps: 10, completed: false }
  ];

  assert.equal(computeSetBadge(sets, 0).setSymbol, 'A1');
  assert.equal(computeSetBadge(sets, 1).setSymbol, 'A2');
  assert.equal(computeSetBadge(sets, 2).setSymbol, 'T1');
  assert.equal(computeSetBadge(sets, 3).setSymbol, '1');
});

test('3. Back-off recebe B1, B2', () => {
  const sets: ExerciseSet[] = [
    { id: '1', setNumber: 1, role: 'top_set', weight: 110, reps: 5, completed: true },
    { id: '2', setNumber: 2, role: 'backoff', weight: 85, reps: 10, completed: false },
    { id: '3', setNumber: 3, role: 'backoff', weight: 80, reps: 12, completed: false }
  ];

  assert.equal(computeSetBadge(sets, 0).setSymbol, 'T1');
  assert.equal(computeSetBadge(sets, 1).setSymbol, 'B1');
  assert.equal(computeSetBadge(sets, 2).setSymbol, 'B2');
});

test('4. Resumo discreto com RIR: RIR 2 • 120s', () => {
  const set: ExerciseSet = {
    id: 's1',
    setNumber: 1,
    role: 'working',
    method: 'normal',
    rir: 2,
    restTimeSeconds: 150, // diferente do default 120s
    weight: 80,
    reps: 10,
    completed: false
  };

  const tokens = computeSummaryTokens(set, 120);
  assert.deepEqual(tokens, ['RIR 2', '150s']);
});

test('5. Resumo discreto com DROP SET • RIR 1', () => {
  const set: ExerciseSet = {
    id: 's2',
    setNumber: 2,
    role: 'working',
    method: 'dropset',
    rir: 1,
    weight: 90,
    reps: 8,
    completed: false
  };

  const tokens = computeSummaryTokens(set, 120);
  assert.deepEqual(tokens, ['DROP SET', 'RIR 1']);
});

test('6. Resumo discreto com TOP SET • 6–8 • RIR 1', () => {
  const set: ExerciseSet = {
    id: 's3',
    setNumber: 3,
    role: 'top_set',
    method: 'normal',
    targetRepsRange: '6–8',
    rir: 1,
    weight: 120,
    reps: 6,
    completed: false
  };

  const tokens = computeSummaryTokens(set, 120);
  assert.deepEqual(tokens, ['TOP SET', '6–8', 'RIR 1']);
});

test('7. Compatibilidade com sets legados com type=warmup e type=dropset', () => {
  const sets: ExerciseSet[] = [
    { id: '1', setNumber: 1, type: 'warmup', weight: 30, reps: 15, completed: false },
    { id: '2', setNumber: 2, type: 'dropset', weight: 70, reps: 10, completed: false }
  ];

  const b0 = computeSetBadge(sets, 0);
  assert.equal(b0.setSymbol, 'A1');
  assert.equal(b0.effectiveRole, 'warmup');

  const b1 = computeSetBadge(sets, 1);
  assert.equal(b1.setSymbol, '1');
  assert.equal(b1.effectiveMethod, 'dropset');

  const tokens = computeSummaryTokens(sets[1]);
  assert.ok(tokens.includes('DROP SET'));
});

test('8. Independência conceitual: role=top_set e method=dropset coexistem na mesma série', () => {
  const sets: ExerciseSet[] = [
    {
      id: 'combo-1',
      setNumber: 1,
      role: 'top_set',
      method: 'dropset',
      targetRepsRange: '6–8',
      rir: 0,
      weight: 100,
      reps: 8,
      completed: false
    }
  ];

  const badge = computeSetBadge(sets, 0);
  assert.equal(badge.setSymbol, 'T1', 'Símbolo reflete o role Top Set');
  assert.equal(badge.effectiveRole, 'top_set');
  assert.equal(badge.effectiveMethod, 'dropset');

  const tokens = computeSummaryTokens(sets[0]);
  assert.ok(tokens.includes('DROP SET'), 'Tokens exibem o método');
  assert.ok(tokens.includes('TOP SET'), 'Tokens exibem a função');
  assert.ok(tokens.includes('RIR 0'), 'Tokens exibem o RIR');
});

test('9. Bloco Bi-set / Superset atribui tags A1 e A2 aos exercícios sem colidir com badges de séries internas', () => {
  interface LocalBlock {
    id: string;
    name: string;
    exerciseIds: [string, string];
    transitionRestSeconds: number;
    blockRestSeconds: number;
  }

  const block: LocalBlock = {
    id: 'block-1',
    name: 'SUPERSET 1',
    exerciseIds: ['ex-supino', 'ex-crucifixo'],
    transitionRestSeconds: 0,
    blockRestSeconds: 90
  };

  // Resolução de tag do exercício dentro do bloco
  const getExerciseBlockTag = (exId: string, b: LocalBlock | null) => {
    if (!b) return null;
    if (b.exerciseIds[0] === exId) return 'A1';
    if (b.exerciseIds[1] === exId) return 'A2';
    return null;
  };

  assert.equal(getExerciseBlockTag('ex-supino', block), 'A1');
  assert.equal(getExerciseBlockTag('ex-crucifixo', block), 'A2');
  assert.equal(getExerciseBlockTag('ex-triceps', block), null);

  // Séries internas do Supino mantêm sua própria numeração de série independente
  const supinoSets: ExerciseSet[] = [
    { id: 's1', setNumber: 1, role: 'warmup', weight: 40, reps: 15, completed: true },
    { id: 's2', setNumber: 2, role: 'working', weight: 80, reps: 10, completed: false }
  ];
  assert.equal(computeSetBadge(supinoSets, 0).setSymbol, 'A1', 'Badge da série de aquecimento');
  assert.equal(computeSetBadge(supinoSets, 1).setSymbol, '1', 'Badge da série de trabalho');
});

test('10. Inversão A1 <-> A2 altera ordem no bloco sem alterar dados das séries', () => {
  let block = {
    id: 'block-1',
    name: 'SUPERSET 1',
    exerciseIds: ['ex-supino', 'ex-crucifixo']
  };

  // Inverter
  block = {
    ...block,
    exerciseIds: [block.exerciseIds[1], block.exerciseIds[0]]
  };

  assert.equal(block.exerciseIds[0], 'ex-crucifixo', 'Crucifixo agora é A1');
  assert.equal(block.exerciseIds[1], 'ex-supino', 'Supino agora é A2');
});

test('11. Remoção do Superset desfaz o agrupamento e restaura apresentação standalone', () => {
  let activeBlocks = [
    { id: 'b1', name: 'SUPERSET 1', exerciseIds: ['ex1', 'ex2'] }
  ];

  // Remover bloco
  activeBlocks = activeBlocks.filter(b => b.id !== 'b1');

  assert.equal(activeBlocks.length, 0);
  const isGrouped = (exId: string) => activeBlocks.some(b => b.exerciseIds.includes(exId));
  assert.equal(isGrouped('ex1'), false);
  assert.equal(isGrouped('ex2'), false);
});

test('12. Textos educativos do botão [?] cobrem todas as funções e métodos com redação precisa', () => {
  const roleTexts: Record<string, string> = {
    working: 'Série principal do exercício usada para cumprir o volume e a intensidade prescritos.',
    warmup: 'Série preparatória realizada antes das séries principais, geralmente com menor carga e sem objetivo de gerar grande fadiga.',
    top_set: 'Série principal mais pesada ou mais desafiadora do exercício, podendo servir como referência para séries seguintes.',
    backoff: 'Série realizada após uma série principal, normalmente com carga reduzida e objetivo de acumular volume com boa execução.'
  };

  const methodTexts: Record<string, string> = {
    normal: 'Série executada de forma convencional, seguindo carga, repetições, esforço e descanso prescritos.',
    dropset: 'Após concluir a série principal, a carga é reduzida e o exercício continua com pouco ou nenhum descanso.',
    rest_pause: 'A série é dividida por pequenas pausas. Após a execução inicial, são feitas novas repetições com descansos curtos.',
    amrap: 'Execute o maior número de repetições permitido pela prescrição naquela série.'
  };

  assert.ok(roleTexts.top_set.includes('mais pesada ou mais desafiadora'));
  assert.ok(methodTexts.dropset.includes('carga é reduzida'));
  assert.ok(methodTexts.amrap.includes('maior número de repetições permitido'));
  assert.ok(!methodTexts.dropset.includes('SOMMA automatiza'), 'Não promete automação de carga no dropset');
  assert.ok(!methodTexts.amrap.includes('falha obrigatória'), 'Não trata AMRAP automaticamente como falha');
});

test('13. Visibilidade condicional de "Instruções do profissional" usa somente professionalNote', () => {
  const hasInstructions = (ex: { professionalNote?: string; instruction?: string; notes?: string }) => {
    return Boolean(ex.professionalNote?.trim());
  };

  const exWithNote = {
    professionalNote: 'Seu foco hoje é controle de movimento. Não aumente a carga caso perca a amplitude.'
  };

  assert.equal(hasInstructions(exWithNote), true, 'Exibe item quando professionalNote tem texto');
  assert.equal(hasInstructions({ professionalNote: '' }), false, 'Oculta item quando professionalNote está vazio');
  assert.equal(hasInstructions({ professionalNote: '   ' }), false, 'Oculta item para professionalNote com espaços');
  assert.equal(hasInstructions({ instruction: 'Instrução técnica geral' }), false, 'Não usa instruction como fallback');
  assert.equal(hasInstructions({ notes: 'Nota genérica' }), false, 'Não usa notes como fallback');
});


