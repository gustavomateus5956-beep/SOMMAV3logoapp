import { LibraryExercise } from '../types';

export const EXERCISE_LIBRARY: LibraryExercise[] = [
  // PEITORAL
  {
    id: 'lib-peito-1',
    name: 'Supino Reto com Barra',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Maior (Fibras Esternais)', 'Deltoide Anterior', 'Tríceps Braquial'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    tips: 'Mantenha escápulas retraídas e deprimidas durante todo o movimento. Pés firmes no chão.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 80
  },
  {
    id: 'lib-peito-2',
    name: 'Supino Inclinado com Halteres',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Superior (Fibras Clavicilares)', 'Deltoide Anterior'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    tips: 'Banco inclinado a 30° ou 45°. Desça até sentir o peitoral alongar, sem projetar os ombros à frente.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 32
  },
  {
    id: 'lib-peito-3',
    name: 'Crucifixo Inclinado no Cabo (Crossover)',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Maior', 'Porção Clavicular'],
    equipment: 'Polia',
    difficulty: 'Iniciante',
    tips: 'Mantenha cotovelos semiflexionados. Foque na contração de pico no centro do tórax.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 20
  },
  {
    id: 'lib-peito-4',
    name: 'Supino Declinado na Máquina Articulada',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Inferior', 'Tríceps'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    tips: 'Excelente para sobrecarga axial segura com estabilização guiada do ombro.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 70
  },
  {
    id: 'lib-peito-5',
    name: 'Paralelas com Peso Corporal / Lastro',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Inferior', 'Tríceps Braquial', 'Deltoide Anterior'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    tips: 'Incline o tronco ligeiramente à frente para recrutar com ênfase as fibras inferiores do peitoral.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0
  },
  {
    id: 'lib-peito-6',
    name: 'Flexão de Braços no Solo',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Maior', 'Deltoide Anterior', 'Tríceps Braquial', 'Core'],
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    tips: 'Corpo em prancha reta contínua. Desça com cotovelos a 45° em relação ao tronco.',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 0
  },
  {
    id: 'lib-peito-7',
    name: 'Supino Reto com Halteres',
    muscleGroup: 'Peitoral',
    targetMuscles: ['Peitoral Maior', 'Deltoide Anterior', 'Tríceps Braquial'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    tips: 'Maior amplitude de movimento e trabalho estabilizador unilateral individualizado.',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 36
  },

  // DORSAIS & COSTAS
  {
    id: 'lib-costas-1',
    name: 'Puxador Alto Frente (Lat Pulldown)',
    muscleGroup: 'Costas',
    targetMuscles: ['Latíssimo do Dorso (Grande Dorsal)', 'Redondo Maior', 'Bíceps'],
    equipment: 'Polia',
    difficulty: 'Iniciante',
    tips: 'Traga a barra em direção à clavícula puxando com os cotovelos para baixo, não com as mãos.',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 70
  },
  {
    id: 'lib-costas-2',
    name: 'Remada Curvada com Barra (Pronada)',
    muscleGroup: 'Costas',
    targetMuscles: ['Trapézio Médio/Inferior', 'Rombóides', 'Grande Dorsal', 'Eretores da Espinha'],
    equipment: 'Barra',
    difficulty: 'Avançado',
    tips: 'Mantenha coluna neutra a 45°. Puxe a barra em direção ao umbigo esmagando as escápulas.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 75
  },
  {
    id: 'lib-costas-3',
    name: 'Remada Baixa no Triângulo (Polia)',
    muscleGroup: 'Costas',
    targetMuscles: ['Grande Dorsal (espessura)', 'Rombóides', 'Braquiorradial'],
    equipment: 'Polia',
    difficulty: 'Iniciante',
    tips: 'Alongue as escápulas à frente na fase excêntrica e trave-as no pico concêntrico sem balanço lombar.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 65
  },
  {
    id: 'lib-costas-4',
    name: 'Barra Fixa (Pull-up)',
    muscleGroup: 'Costas',
    targetMuscles: ['Grande Dorsal', 'Redondo Maior', 'Bíceps Braquial'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    tips: 'Amplitude completa com queixo ultrapassando a barra e extensão controlada.',
    defaultSets: 3,
    defaultReps: 8,
    defaultWeight: 0
  },
  {
    id: 'lib-costas-5',
    name: 'Levantamento Terra Clássico',
    muscleGroup: 'Costas',
    targetMuscles: ['Eretores da Espinha', 'Glúteo Máximo', 'Posteriores', 'Trapézio'],
    equipment: 'Barra',
    difficulty: 'Avançado',
    tips: 'Barra colada nas canelas, respiração diafragmática (bracing) ativada antes da saída.',
    defaultSets: 3,
    defaultReps: 5,
    defaultWeight: 140
  },

  // OMBROS / DELTÓIDES
  {
    id: 'lib-ombro-1',
    name: 'Desenvolvimento Militar com Halteres',
    muscleGroup: 'Ombros',
    targetMuscles: ['Deltoide Anterior', 'Deltoide Lateral', 'Tríceps'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    tips: 'Cotovelos levemente à frente do plano escapular (cerca de 30°), evitando travar no topo.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 26
  },
  {
    id: 'lib-ombro-2',
    name: 'Elevação Lateral na Polia Baixa',
    muscleGroup: 'Ombros',
    targetMuscles: ['Deltoide Lateral (cabeça média)'],
    equipment: 'Polia',
    difficulty: 'Iniciante',
    tips: 'Tensão constante em toda a amplitude. Eleve até a linha do ombro com punho neutro.',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeight: 12
  },
  {
    id: 'lib-ombro-3',
    name: 'Crucifixo Invertido no Peck Deck',
    muscleGroup: 'Ombros',
    targetMuscles: ['Deltoide Posterior', 'Rombóides'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    tips: 'Não junte as escápulas em excesso para isolar a cabeça posterior do deltoide.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 45
  },

  // PERNAS (QUADRÍCEPS, POSTERIORES, GLÚTEOS)
  {
    id: 'lib-pernas-1',
    name: 'Agachamento Livre com Barra',
    muscleGroup: 'Pernas',
    targetMuscles: ['Quadríceps', 'Glúteo Máximo', 'Adutores', 'Core'],
    equipment: 'Barra',
    difficulty: 'Avançado',
    tips: 'Profundidade abaixo de 90° com joelhos acompanhando a direção das pontas dos pés.',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 110
  },
  {
    id: 'lib-pernas-2',
    name: 'Leg Press 45° Articulado',
    muscleGroup: 'Pernas',
    targetMuscles: ['Quadríceps', 'Glúteo Máximo'],
    equipment: 'Máquina',
    difficulty: 'Intermediário',
    tips: 'Lombar e glúteos firmemente apoiados no encosto. Nunca estenda os joelhos até o travamento ósseo.',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 300
  },
  {
    id: 'lib-pernas-3',
    name: 'Cadeira Extensora',
    muscleGroup: 'Pernas',
    targetMuscles: ['Reto Femoral', 'Vasto Lateral', 'Vasto Medial'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    tips: 'Pausa isométrica de 1s no topo para contração máxima dos vastos.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 60
  },
  {
    id: 'lib-pernas-4',
    name: 'Stiff com Barra / Halteres',
    muscleGroup: 'Pernas',
    targetMuscles: ['Isquiotibiais (Bíceps Femoral)', 'Glúteo Máximo', 'Lombar'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    tips: 'Quadril viaja para trás como dobradiça, mantendo leve flexão de joelhos e coluna reta.',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 80
  },
  {
    id: 'lib-pernas-5',
    name: 'Mesa Flexora Deitada',
    muscleGroup: 'Pernas',
    targetMuscles: ['Isquiotibiais (flexores de joelho)'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    tips: 'Mantenha o quadril pressionado contra o banco para não compensar com a lombar.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 45
  },
  {
    id: 'lib-pernas-6',
    name: 'Elevação Pélvica com Barra (Hip Thrust)',
    muscleGroup: 'Pernas',
    targetMuscles: ['Glúteo Máximo', 'Glúteo Médio'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    tips: 'Queixo no peito, rotação posterior de pelve no pico concêntrico por 2 segundos.',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 120
  },
  {
    id: 'lib-pernas-7',
    name: 'Gêmeos Sentado na Máquina (Panturrilha)',
    muscleGroup: 'Pernas',
    targetMuscles: ['Sóleo', 'Gastrocnêmio'],
    equipment: 'Máquina',
    difficulty: 'Iniciante',
    tips: 'Alongamento máximo na descida com pausa de 2 segundos para anular o reflexo elástico.',
    defaultSets: 4,
    defaultReps: 15,
    defaultWeight: 50
  },

  // BRAÇOS (BÍCEPS, TRÍCEPS, ANTEBRAÇO)
  {
    id: 'lib-bracos-1',
    name: 'Rosca Direta Barra W',
    muscleGroup: 'Braços',
    targetMuscles: ['Bíceps Braquial (Cabeça Curta e Longa)', 'Braquial'],
    equipment: 'Barra',
    difficulty: 'Iniciante',
    tips: 'Cotovelos fixos nas laterais do tronco. Não utilize balanço lombar para iniciar o movimento.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 30
  },
  {
    id: 'lib-bracos-2',
    name: 'Rosca Martelo com Halteres',
    muscleGroup: 'Braços',
    targetMuscles: ['Braquial', 'Braquiorradial', 'Bíceps (Cabeça Longa)'],
    equipment: 'Halteres',
    difficulty: 'Iniciante',
    tips: 'Pegada neutra (palmas viradas uma para a outra). Ótimo para espessura do braço.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 16
  },
  {
    id: 'lib-bracos-3',
    name: 'Rosca Scott Unilateral com Halter',
    muscleGroup: 'Braços',
    targetMuscles: ['Bíceps (Cabeça Curta - Pico)'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    tips: 'Isolamento puro no banco Scott. Não estenda totalmente no final para preservar tendões.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 14
  },
  {
    id: 'lib-bracos-4',
    name: 'Tríceps Corda no Pulley',
    muscleGroup: 'Braços',
    targetMuscles: ['Tríceps (Cabeça Lateral e Medial)'],
    equipment: 'Polia',
    difficulty: 'Iniciante',
    tips: 'Abra as pontas da corda na fase final da extensão para ativação máxima da cabeça lateral.',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeight: 25
  },
  {
    id: 'lib-bracos-5',
    name: 'Tríceps Francês Unilateral com Halter',
    muscleGroup: 'Braços',
    targetMuscles: ['Tríceps (Cabeça Longa em Alongamento)'],
    equipment: 'Halteres',
    difficulty: 'Intermediário',
    tips: 'Com o braço elevado, a cabeça longa é recrutada sob alongamento passivo acentuado.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 14
  },
  {
    id: 'lib-bracos-6',
    name: 'Tríceps Testa com Barra W',
    muscleGroup: 'Braços',
    targetMuscles: ['Tríceps Braquial (Cabeça Longa e Medial)'],
    equipment: 'Barra',
    difficulty: 'Intermediário',
    tips: 'Leve a barra ligeiramente atrás da cabeça para manter tensão contínua no tríceps.',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 32
  },

  // ABDÔMEN & CORE
  {
    id: 'lib-core-1',
    name: 'Abdominal no Cabo (Cable Crunch)',
    muscleGroup: 'Core',
    targetMuscles: ['Reto Abdominal'],
    equipment: 'Polia',
    difficulty: 'Iniciante',
    tips: 'Flexione a coluna enrolando o tronco sobre a pelve, não apenas flexionando o quadril.',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 40
  },
  {
    id: 'lib-core-2',
    name: 'Elevação de Pernas na Barra Fixa',
    muscleGroup: 'Core',
    targetMuscles: ['Reto Abdominal Inferior', 'Flexores do Quadril'],
    equipment: 'Peso Corporal',
    difficulty: 'Avançado',
    tips: 'Eleve a pelve em direção às costelas no final do movimento para contrair o abdômen.',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0
  },
  {
    id: 'lib-core-3',
    name: 'Prancha Isométrica com Anti-Extensão',
    muscleGroup: 'Core',
    targetMuscles: ['Transverso do Abdômen', 'Oblíquos', 'Lombar'],
    equipment: 'Peso Corporal',
    difficulty: 'Iniciante',
    tips: 'Glúteos e abdômen contraídos juntos, coluna alinhada da cabeça aos calcanhares.',
    defaultSets: 3,
    defaultReps: 45, // seconds
    defaultWeight: 0
  }
];
