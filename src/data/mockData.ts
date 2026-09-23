import { Routine, FeedPost, Professional, RoutineFlash, DiscoverAthlete, UserSubscriptionPlan } from '../types';

export const USER_PROFILE = {
  name: 'Lucas Andrade',
  role: 'Atleta Intermediário',
  joinedDate: 'Jan 2024',
  avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
  weight: 82.4,
  height: 1.78,
  totalWorkouts: 184,
  totalPrs: 12,
  streakDays: 14,
  weeklyGoalCompleted: 4,
  weeklyGoalTotal: 5,
  currentPlan: 'SOMMA Black Anual',
  activeCoach: {
    name: 'Rodrigo Faissal',
    role: 'Coach',
    specialty: 'Treinos & Periodização Semanal',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx35zJnr9nH0kXUsN5YzmZ91n1mNe3Ma0kbRuc6623KulBJIpHp5K2r7iXRV962CFOZ0ELkMtsJ2lyYrbM7HWqmomiBTQ6Wt6zhuVaJd8z_Vt3sYku95J5VargiTea0pIYEjayboywPAuobFxv1ic19Pc_KdCMdfUugyQnoGR8PGGj7n8N-N19Ou5saxVeZ63PdFoc4Jxy75meA_sCHTPDnc3QfWKTDzr68TbDmbDU-7zKbY81AffwTw',
    nextCheckin: '28/05'
  }
};

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rotina-a',
    name: 'Treino A - Peito, Ombro e Tríceps',
    category: 'Empurrar',
    lastSession: 'há 2 dias',
    exercisesCount: 4,
    estimatedMinutes: 55,
    isProfessionalCertified: true,
    certifiedBy: {
      certified: true,
      professionalName: 'Rodrigo Faissal',
      professionalRole: 'Coach & Especialista em Hipertrofia',
      registrationNumber: 'CREF 049210-G/SP',
      certifiedDate: 'Prescrito em 12/05/2026',
      notes: 'Periodização ondulatória focada em recrutamento de feixe clavicular e estabilidade escapular.'
    },
    exercises: [
      {
        id: 'ex-1',
        name: 'Supino Reto com Barra',
        muscleGroup: 'Peitoral',
        equipment: 'Barra',
        targetMuscles: ['Peitoral Maior', 'Tríceps', 'Deltóide Anterior'],
        professionalNote: 'Seu foco hoje é controle de movimento. Não aumente a carga caso perca a amplitude ou a estabilidade escapular.',
        instructions: '1. Deite no banco mantendo as escápulas aduzidas e os pés firmes no solo.\n2. Desça a barra de forma controlada até tocar suavemente a linha do peito.\n3. Mantenha os cotovelos a ~70 graus em relação ao tronco.\n4. Empurre com força focando na contração do peitoral sem desencostar os ombros do banco.',
        sets: [
          { id: 's1', setNumber: 1, type: 'warmup', prevWeight: 60, prevReps: 15, targetWeight: 60, targetReps: 15, weight: 60, reps: 15, instruction: 'Use carga leve apenas para preparar articulações e movimento.', completed: true },
          { id: 's2', setNumber: 2, type: 'working', prevWeight: 84, prevReps: 10, targetWeight: 84, targetReps: 10, weight: 84, reps: 10, instruction: 'Primeira série de trabalho. Foque em 3s na fase excêntrica.', completed: true },
          { id: 's3', setNumber: 3, type: 'working', prevWeight: 92, prevReps: 8, targetWeight: 92, targetReps: 8, weight: 92, reps: 8, completed: true },
          { id: 's4', setNumber: 4, type: 'max_strength', prevWeight: 98, prevReps: 4, targetWeight: 100, targetReps: 4, weight: 100, reps: 4, instruction: 'Utilizar a maior carga planejada mantendo a técnica rigorosa.', completed: false }
        ]
      },
      {
        id: 'ex-2',
        name: 'Supino Inclinado com Halteres',
        muscleGroup: 'Peitoral Superior',
        equipment: 'Halteres',
        targetMuscles: ['Feixe Clavicular', 'Deltóide Anterior'],
        professionalNote: 'Banco a 30º. Mantenha os cotovelos convergentes e contração de pico no topo.',
        instructions: '1. Ajuste o banco em inclinação de 30º.\n2. Suba os halteres em linha reta sobre a linha superior do tórax.\n3. Desça controlando o peso até sentir o alongamento controlado do peitoral.',
        sets: [
          { id: 's5', setNumber: 1, type: 'working', prevWeight: 30, prevReps: 10, targetWeight: 32, targetReps: 10, weight: 32, reps: 10, completed: false },
          { id: 's6', setNumber: 2, type: 'working', prevWeight: 32, prevReps: 8, targetWeight: 34, targetReps: 8, weight: 34, reps: 8, completed: false },
          { id: 's7', setNumber: 3, type: 'dropset', prevWeight: 26, prevReps: 12, targetWeight: 26, targetReps: 12, weight: 26, reps: 12, instruction: 'Após atingir a falha técnica, reduza aproximadamente 20% da carga e continue.', completed: false }
        ]
      },
      {
        id: 'ex-3',
        name: 'Desenvolvimento Militar c/ Halteres',
        muscleGroup: 'Deltóides',
        equipment: 'Halteres',
        professionalNote: 'Tronco firme no encosto, evite hiperlordose durante a fase concêntrica.',
        instructions: '1. Sente-se com as costas apoiadas e os halteres na altura das orelhas.\n2. Empurre os halteres para cima sem bater no topo.\n3. Desça controladamente até os cotovelos formarem 90º.',
        sets: [
          { id: 's8', setNumber: 1, type: 'working', prevWeight: 22, prevReps: 10, targetWeight: 24, targetReps: 10, weight: 24, reps: 10, completed: false },
          { id: 's9', setNumber: 2, type: 'working', prevWeight: 24, prevReps: 8, targetWeight: 24, targetReps: 8, weight: 24, reps: 8, completed: false },
          { id: 's10', setNumber: 3, type: 'failure', prevWeight: 26, prevReps: 8, targetWeight: 26, targetReps: 8, weight: 26, reps: 8, instruction: 'Executar até a falha técnica conforme orientação.', completed: false }
        ]
      },
      {
        id: 'ex-4',
        name: 'Tríceps Corda no Pulley',
        muscleGroup: 'Tríceps',
        equipment: 'Polia',
        professionalNote: 'Abra a corda na parte inferior para ativar o pico de contração da cabeça lateral.',
        instructions: '1. Segure a corda com os cotovelos colados ao tronco.\n2. Estenda completamente os braços e separe as mãos no final do movimento.\n3. Retorne até os antebraços ficarem paralelos ao chão.',
        sets: [
          { id: 's11', setNumber: 1, type: 'working', prevWeight: 22, prevReps: 15, targetWeight: 25, targetReps: 15, weight: 25, reps: 15, completed: false },
          { id: 's12', setNumber: 2, type: 'rest_pause', prevWeight: 25, prevReps: 12, targetWeight: 25, targetReps: 12, weight: 25, reps: 12, instruction: 'Pausa de 15 segundos após as primeiras 8 reps antes de finalizar.', completed: false },
          { id: 's13', setNumber: 3, type: 'dropset', prevWeight: 20, prevReps: 12, targetWeight: 20, targetReps: 15, weight: 20, reps: 12, instruction: 'Drop imediato de carga: reduza 2 placas e continue.', completed: false }
        ]
      }
    ]
  },
  {
    id: 'rotina-b',
    name: 'Treino B - Costas e Bíceps',
    category: 'Puxar',
    lastSession: 'há 4 dias',
    exercisesCount: 5,
    estimatedMinutes: 60,
    isProfessionalCertified: true,
    certifiedBy: {
      certified: true,
      professionalName: 'Rodrigo Faissal',
      professionalRole: 'Coach & Especialista em Hipertrofia',
      registrationNumber: 'CREF 049210-G/SP',
      certifiedDate: 'Prescrito em 12/05/2026',
      notes: 'Foco na espessura de dorsais com remadas controladas e sobrecarga progressiva.'
    },
    exercises: [
      {
        id: 'ex-b1',
        name: 'Puxador Alto Frente (Lat Pulldown)',
        muscleGroup: 'Dorsais',
        sets: [
          { id: 'sb1', setNumber: 1, prevWeight: 65, prevReps: 12, weight: 70, reps: 10, completed: false },
          { id: 'sb2', setNumber: 2, prevWeight: 70, prevReps: 10, weight: 75, reps: 8, completed: false },
          { id: 'sb3', setNumber: 3, prevWeight: 75, prevReps: 8, weight: 80, reps: 8, completed: false }
        ]
      },
      {
        id: 'ex-b2',
        name: 'Remada Curvada com Barra',
        muscleGroup: 'Dorsais / Rombóides',
        sets: [
          { id: 'sb4', setNumber: 1, prevWeight: 70, prevReps: 10, weight: 75, reps: 10, completed: false },
          { id: 'sb5', setNumber: 2, prevWeight: 75, prevReps: 8, weight: 80, reps: 8, completed: false },
          { id: 'sb6', setNumber: 3, prevWeight: 80, prevReps: 6, weight: 82.5, reps: 6, completed: false }
        ]
      },
      {
        id: 'ex-b3',
        name: 'Remada Baixa no Triângulo',
        muscleGroup: 'Dorsais',
        sets: [
          { id: 'sb7', setNumber: 1, prevWeight: 60, prevReps: 12, weight: 65, reps: 12, completed: false },
          { id: 'sb8', setNumber: 2, prevWeight: 65, prevReps: 10, weight: 70, reps: 10, completed: false }
        ]
      },
      {
        id: 'ex-b4',
        name: 'Rosca Direta Barra W',
        muscleGroup: 'Bíceps',
        sets: [
          { id: 'sb9', setNumber: 1, prevWeight: 28, prevReps: 10, weight: 30, reps: 10, completed: false },
          { id: 'sb10', setNumber: 2, prevWeight: 30, prevReps: 8, weight: 32, reps: 8, completed: false },
          { id: 'sb11', setNumber: 3, prevWeight: 32, prevReps: 8, weight: 32, reps: 8, completed: false }
        ]
      },
      {
        id: 'ex-b5',
        name: 'Rosca Martelo Alternada',
        muscleGroup: 'Braquial / Antebraço',
        sets: [
          { id: 'sb12', setNumber: 1, prevWeight: 14, prevReps: 12, weight: 16, reps: 12, completed: false },
          { id: 'sb13', setNumber: 2, prevWeight: 16, prevReps: 10, weight: 16, reps: 10, completed: false }
        ]
      }
    ]
  },
  {
    id: 'rotina-c',
    name: 'Treino C - Pernas Completo',
    category: 'Inferiores',
    lastSession: 'há 1 semana',
    exercisesCount: 6,
    estimatedMinutes: 65,
    exercises: [
      {
        id: 'ex-c1',
        name: 'Agachamento Livre com Barra',
        muscleGroup: 'Quadríceps / Glúteos',
        sets: [
          { id: 'sc1', setNumber: 1, prevWeight: 100, prevReps: 10, weight: 110, reps: 10, completed: false },
          { id: 'sc2', setNumber: 2, prevWeight: 120, prevReps: 8, weight: 130, reps: 8, completed: false },
          { id: 'sc3', setNumber: 3, prevWeight: 130, prevReps: 5, weight: 140, reps: 4, completed: false }
        ]
      },
      {
        id: 'ex-c2',
        name: 'Leg Press 45°',
        muscleGroup: 'Quadríceps',
        sets: [
          { id: 'sc4', setNumber: 1, prevWeight: 280, prevReps: 12, weight: 300, reps: 12, completed: false },
          { id: 'sc5', setNumber: 2, prevWeight: 320, prevReps: 10, weight: 340, reps: 10, completed: false }
        ]
      },
      {
        id: 'ex-c3',
        name: 'Cadeira Extensora',
        muscleGroup: 'Quadríceps',
        sets: [
          { id: 'sc6', setNumber: 1, prevWeight: 50, prevReps: 15, weight: 55, reps: 15, completed: false },
          { id: 'sc7', setNumber: 2, prevWeight: 55, prevReps: 12, weight: 60, reps: 12, completed: false }
        ]
      }
    ]
  }
];

export const MOCK_DAILY_ROUTINES: RoutineFlash[] = [
  {
    id: 'routine-user',
    authorName: 'Sua Rotina',
    authorAvatar: 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
    isUser: true,
    hasUnseen: false,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    caption: 'Rotina de quadríceps com foco em profundidade total. Leg press subiu!',
    timeAgo: 'há 25 min',
    expiresInHours: 23,
    targetMuscle: 'Quadríceps & Glúteo',
    todayVolume: '9.200 kg',
    statBadge: 'Leg 340kg',
    workoutHighlight: 'Rotina C • Inferiores'
  },
  {
    id: 'routine-1',
    authorName: 'Matheus Silva',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jd23T-l8YdGDbEsuT4rypw-Gwrqx3nsXr3o89dyLyo1JLwu9FqPRYA4mquhzSAWAshEM4J1YpgfN7TzK4LeO27rdpiBJ1qut7Ck8b9ngApGWX61iYxU23WqOEESiH0jSxQVl7GecIxaVLkkhazZZjDVx1n2h33cds909uKU1iYVfc7k5ZZf3Q-X7-QUk010p3E2buMFkYvcecYx3beSD1mnGyJeS24kcNuMo7jzTu_keVN5chDuisA',
    hasUnseen: true,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    caption: 'Bati PR no Supino Inclinado com 34kg cada halter! Carga mantida por 8 reps.',
    timeAgo: 'há 2 horas',
    expiresInHours: 22,
    targetMuscle: 'Peitoral & Deltoide',
    todayVolume: '8.920 kg',
    statBadge: '+2 Novos PRs',
    workoutHighlight: 'Rotina A • Push Pesado'
  },
  {
    id: 'routine-2',
    authorName: 'Mariana Costa',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hluTOfLwbFh-uaxfMHxbERT5D1AwIn6wSa37maicy2yoAocZTze-xxidXOlroj4fCSRaTU8wTvb_My5c-JZqYUDXUf0kgTifmy_B2bhLd1eV_jbqv_rtiuYsT0wEsdxNgT3nCb5VfHR9KXvaBHpOLNkcL8mpbcQ607T2w3gba__3uGF9k4j3SSYhHO2RWCg34eDB--eLwGDCBBIMxsynZqKXY-zPwZ7c_hjgHi2f8Yhc-6G3yrUVHA',
    hasUnseen: true,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    caption: 'Rotina matinal paga às 07h. Foco em cadência lenta no agachamento.',
    timeAgo: 'há 4 horas',
    expiresInHours: 20,
    targetMuscle: 'Cadeia Posterior',
    todayVolume: '6.400 kg',
    statBadge: 'Agachamento 70kg',
    workoutHighlight: 'Rotina Força • 18/20'
  },
  {
    id: 'routine-3',
    authorName: 'Rodrigo Coach',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq0YgBwdksClOOLS2ECSZPXkPnc0yZFSJqlg7oJVcR8ZBWuVbPNpAb_bMOLRRXMc1hknBX7f3yF0kXKFUx4fPWZ0yjX9T6dcbgHrhxLmmKzsKsmPIzaGj73nUhZWLxlJPovT3e--mGSfxH8qKAhl6yJPbx3nbFO4meK-smrxNgNLrvkO50e9YX1vnIxS5VuyGNspb3PD03ZnCBgVTHiyWD6kkueRyYj2rMyGoli5xrzyjap0MSe9PAAw',
    hasUnseen: true,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    caption: 'Ajuste biomecânico: rotação externa do ombro protege o manguito nas séries pesadas.',
    timeAgo: 'há 6 horas',
    expiresInHours: 18,
    targetMuscle: 'Biomecânica Aplicada',
    todayVolume: 'Masterclass',
    statBadge: 'Dica do Coach',
    workoutHighlight: 'Dicas do Especialista'
  }
];

export const MOCK_POSTS: FeedPost[] = [
  {
    id: 'post-inf-1',
    authorName: 'Victor "Mutante" Lima',
    authorHandle: '@victor.mutante',
    authorBadge: 'INFLUENCER SOMMA',
    isInfluencer: true,
    influencerBadge: 'INFLUENCER SOMMA',
    authorVerified: true,
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVidrfeoWvK94sJeOaPnymTJE1Q9eImNr6gwNem8J5nkHUm24epPY8MB8fuw7PWhdzxmCIxA-raya2lkPyVVAbyoj7wF8JmPe1q2hgwG-loUpJGoS9UojDKQ757OTOewQGVIGSN-t3X-sLX-VLMEBGjmQsHLXLj3tbrG9E6tcXMZ9SxMUcmcgIV6j5JhVWN6MDB_pZgiVyKEH59e1GFKfaD7qWbVud2rzrq_T8S4e4eQPIm_YRM4lHZA',
    timeAgo: 'há 45 min',
    location: 'SOMMA Training Lab • SP',
    tag1: '14.800 KG DE VOLUME',
    tag2: 'PROTOCOLO SOMMA PRO',
    title: 'Leg Day Pesado com o Protocolo SOMMA ⚡🔥',
    caption: 'Ciclo de sobrecarga progressiva de 6 semanas concluído! Periodização montada no SOMMA alinhada com 3.200 kcal limpas. 260kg no agachamento e técnica firme. A constância no app não mente! Quem já pagou o treino hoje?',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    duration: '1h 22m',
    volume: '14.800 kg',
    exercisesCount: 7,
    prsCount: 3,
    exercisesPreview: [
      { name: 'Agachamento Livre com Barra', detail: '4 × 6 @ 240-260 kg', isPr: true },
      { name: 'Leg Press 45° Articulado', detail: '4 × 10 @ 480 kg', isPr: true },
      { name: 'Hack Machine 45°', detail: '3 × 12 @ 220 kg' },
      { name: 'Cadeira Extensora Unilateral', detail: '4 × 15 @ 75 kg' }
    ],
    cheerCount: 342,
    userCheered: false,
    commentsCount: 28,
    comments: [
      {
        id: 'inf-c1',
        author: 'Dr. Rodrigo Menezes',
        role: 'Coach SOMMA Pro',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACoayZ5ZZFHjnUm4wRUcl9UFxpAg2Lr9FM0T3AhueW-XeVbdOxiLsPrZEraKdwZtR7XTcFHiZUgRTiE7-5c7PIqmRDxR0RXXQmfrheLiibc9yNDqUivQZJpqLtplD0D9HAIfjk7PaFn_v_2mKcJQQy_x9_eZi6mh-p9LS6SB4aD_3QAfS4PdYF5mc4-bnlQ8FDwXpknVTuQLYI5kxZaZLqV0Dv961pPbMIU8cblwaTCLtZhRFd8QXMCg',
        text: 'Volume absurdo mantendo a profundidade abaixo do paralelo. Ajustamos a deload na próxima semana!'
      },
      {
        id: 'inf-c2',
        author: 'Lucas Andrade',
        role: 'Atleta',
        avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
        text: 'Inspiração pura! Agachamento monstro demais.'
      }
    ]
  },
  {
    id: 'post-inf-2',
    authorName: 'Letícia "Lelê" Fontana',
    authorHandle: '@lele.fontana',
    authorBadge: 'INFLUENCER SOMMA',
    isInfluencer: true,
    influencerBadge: 'EMBAIXADORA SOMMA',
    authorVerified: true,
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJQ7kJ6F4igJ9UsAVhURuQ9v9umSwG_0rLdfQGutKCEpEGmCIaNUvD2lmI3MjV7Sm-ha0cxOltubvuacp4MTBoNTB_pme_wCor5t1vZSIpQIBjFjFP2E12mWcCQwInhKa-pfm_-cTzNqskV0avRCWBAel6qxDrKNjzYsnDzcyW-99wekdF14nrFv5ULn7wpdrR4eDaaSdsafV1t0EVna2c6LwLEwAzUThs8lzLlHpsUXQ_2lytr8NMBg',
    timeAgo: 'há 2 horas',
    location: 'Bio Ritmo Jardins',
    tag1: 'GLÚTEO & POSTERIOR',
    tag2: 'DIETA 100% SINCRONIZADA',
    title: 'Foco na biomecânica e macros batidos no relógio! ✨',
    caption: 'Com a periodização de 1 especialista por área no plano SOMMA, o treino conversa com a dieta em tempo real. Levantamento terra romeno subiu 12kg no bloco. Disciplina gera liberdade! 💛',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
    duration: '58m',
    volume: '7.850 kg',
    exercisesCount: 5,
    prsCount: 2,
    exercisesPreview: [
      { name: 'Levantamento Terra Romeno c/ Halteres', detail: '4 × 10 @ 28 kg cada', isPr: true },
      { name: 'Elevação Pélvica c/ Barra Pesada', detail: '4 × 8 @ 140 kg', isPr: true },
      { name: 'Cadeira Flexora Unilateral', detail: '3 × 12 @ 35 kg' }
    ],
    cheerCount: 289,
    userCheered: false,
    commentsCount: 19
  },
  {
    id: 'post-1',
    authorName: 'Matheus Silva',
    authorBadge: 'Atleta',
    authorVerified: true,
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jd23T-l8YdGDbEsuT4rypw-Gwrqx3nsXr3o89dyLyo1JLwu9FqPRYA4mquhzSAWAshEM4J1YpgfN7TzK4LeO27rdpiBJ1qut7Ck8b9ngApGWX61iYxU23WqOEESiH0jSxQVl7GecIxaVLkkhazZZjDVx1n2h33cds909uKU1iYVfc7k5ZZf3Q-X7-QUk010p3E2buMFkYvcecYx3beSD1mnGyJeS24kcNuMo7jzTu_keVN5chDuisA',
    timeAgo: 'há 3 horas',
    location: 'Academia Olimpo',
    tag1: '2 NOVOS RECORDES',
    tag2: 'PEITO & TRÍCEPS',
    title: 'Treino A - Foco em Cargas Pesadas 🔥',
    caption: 'Senti a evolução hoje! Carga subiu no supino mantendo técnica impecável.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
    duration: '1h 05m',
    volume: '8.920 kg',
    exercisesCount: 6,
    prsCount: 2,
    exercisesPreview: [
      { name: 'Supino Inclinado c/ Halteres', detail: '4 × 8 @ 34 kg', isPr: true },
      { name: 'Crucifixo Reto na Polia', detail: '3 × 12 @ 18 kg' },
      { name: 'Paralelas (Dips)', detail: '3 × 10 @ +12 kg', isPr: true },
      { name: 'Tríceps Corda pulley', detail: '4 × 15 @ 25 kg' }
    ],
    cheerCount: 24,
    userCheered: false,
    commentsCount: 5,
    comments: [
      {
        id: 'c1',
        author: 'Dr. Rodrigo Menezes',
        role: 'Coach SOMMA Pro',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACoayZ5ZZFHjnUm4wRUcl9UFxpAg2Lr9FM0T3AhueW-XeVbdOxiLsPrZEraKdwZtR7XTcFHiZUgRTiE7-5c7PIqmRDxR0RXXQmfrheLiibc9yNDqUivQZJpqLtplD0D9HAIfjk7PaFn_v_2mKcJQQy_x9_eZi6mh-p9LS6SB4aD_3QAfS4PdYF5mc4-bnlQ8FDwXpknVTuQLYI5kxZaZLqV0Dv961pPbMIU8cblwaTCLtZhRFd8QXMCg',
        text: 'Excelente progressão na última série! Bloqueio de ombros firme e carga sólida.'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Mariana Costa',
    authorBadge: 'PRO',
    authorVerified: true,
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hluTOfLwbFh-uaxfMHxbERT5D1AwIn6wSa37maicy2yoAocZTze-xxidXOlroj4fCSRaTU8wTvb_My5c-JZqYUDXUf0kgTifmy_B2bhLd1eV_jbqv_rtiuYsT0wEsdxNgT3nCb5VfHR9KXvaBHpOLNkcL8mpbcQ607T2w3gba__3uGF9k4j3SSYhHO2RWCg34eDB--eLwGDCBBIMxsynZqKXY-zPwZ7c_hjgHi2f8Yhc-6G3yrUVHA',
    timeAgo: 'há 4 horas',
    location: 'Smart Fit Paulista',
    tag1: 'MEMBROS INFERIORES',
    title: 'Treino de Inferiores Concluído ⚡',
    caption: 'Fechando o ciclo de força do mês! 18 treinos cumpridos de 20 planejados. Consistência vence o desânimo ⚡',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop',
    duration: '50m',
    volume: '6.400 kg',
    exercisesCount: 5,
    prsCount: 1,
    exercisesPreview: [
      { name: 'Agachamento Livre Barra', detail: '4 × 10 @ 70 kg' },
      { name: 'Leg Press 45°', detail: '4 × 12 @ 180 kg', isPr: true },
      { name: 'Cadeira Extensora', detail: '3 × 15 @ 45 kg' },
      { name: 'Mesa Flexora', detail: '3 × 12 @ 40 kg' }
    ],
    cheerCount: 42,
    userCheered: false,
    commentsCount: 8
  }
];

export const MOCK_LOCAL_ATHLETES = [
  {
    name: 'Lucas Mendes',
    specialty: 'Treino Push / Pull',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApDtRciYLjahRNEhKuYrV2FQbAHn2G0Mgj-qsUVrmDAtCCluNHAhh8K0kCX6kBkdoxc5FQc0LhSFsXRZmSLtWGwnb83O8JTpKurYqfsbX208UVA57sb508RBbqpvaVzyrpLMQgowMbZdB4O9ulP0m6R8JsgGY87-zVjD2RHjVgZwyW5fGZ0kL8SZuUINjeqXZ8hKlGI8ma9VuZujl-2fXTevHvFkFkSAY51xzfrwY76PYa3pR4TdteDQ',
    following: false
  },
  {
    name: 'Camila Rocha',
    specialty: 'Hipertrofia & Mobilidade',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFSVV1OJXfonehQawDNkBPhKWpxauVV8_sp8QuQIGXYtMeArV30kAGFFV7MrpKxfqHFQ_WJVCPfyfu9Ni5ZUx16R7ntqWOu41Uddi5iUwerCqgIALSxfDTuBzZaaHd4F3LSq-Ui9bAZ8eQTmp_M41QTvWwIqUF-WlnhnWAILcyxuQioqRldZC3NVBHXfw8PJKPgA2mqQ99aOO-7GRQFqRUsquZnp7kd9iaV-a6BDlx8mByj1-J5NV67A',
    following: false
  }
];

export const DISCOVERABLE_ATHLETES: DiscoverAthlete[] = [
  {
    id: 'disc-1',
    name: 'Gabriel Siqueira',
    handle: '@biel.powerlift',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jd23T-l8YdGDbEsuT4rypw-Gwrqx3nsXr3o89dyLyo1JLwu9FqPRYA4mquhzSAWAshEM4J1YpgfN7TzK4LeO27rdpiBJ1qut7Ck8b9ngApGWX61iYxU23WqOEESiH0jSxQVl7GecIxaVLkkhazZZjDVx1n2h33cds909uKU1iYVfc7k5ZZf3Q-X7-QUk010p3E2buMFkYvcecYx3beSD1mnGyJeS24kcNuMo7jzTu_keVN5chDuisA',
    category: 'Powerlifting',
    specialty: 'SBD • Força Máxima',
    gymLocation: 'Ironberg Alphaville',
    city: 'Barueri, SP',
    streakDays: 34,
    isActiveToday: true,
    verifiedBadge: 'ELITE',
    followersCount: 1420,
    following: false,
    topPR: 'Supino: 172.5 kg • Terra: 260 kg',
    bio: 'Focado em quebrar a barreira dos 600kg de total. Treino pesado com periodização ondulatória.',
    recentWorkout: 'Supino Pausado 160kg × 3 reps',
    matchPercentage: 98
  },
  {
    id: 'disc-2',
    name: 'Mariana Costa',
    handle: '@mari.costafit',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hluTOfLwbFh-uaxfMHxbERT5D1AwIn6wSa37maicy2yoAocZTze-xxidXOlroj4fCSRaTU8wTvb_My5c-JZqYUDXUf0kgTifmy_B2bhLd1eV_jbqv_rtiuYsT0wEsdxNgT3nCb5VfHR9KXvaBHpOLNkcL8mpbcQ607T2w3gba__3uGF9k4j3SSYhHO2RWCg34eDB--eLwGDCBBIMxsynZqKXY-zPwZ7c_hjgHi2f8Yhc-6G3yrUVHA',
    category: 'Hipertrofia',
    specialty: 'Inferiores & Glúteo Isolado',
    gymLocation: 'Smart Fit Paulista',
    city: 'São Paulo, SP',
    streakDays: 28,
    isActiveToday: true,
    verifiedBadge: 'PRO',
    followersCount: 3890,
    following: false,
    topPR: 'Leg Press 45°: 360 kg • Agachamento: 130 kg',
    bio: 'Atleta de fisiculturismo categoria Bikini. Foco em técnica, amplitude e consistência diária.',
    recentWorkout: 'Leg Press 45° 360kg × 10 reps',
    matchPercentage: 95
  },
  {
    id: 'disc-3',
    name: 'Felipe "Thor" Castro',
    handle: '@felipe.cross',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLrttJa6__YHVJQgqZGUtjGE9eNyY7NTm-QSBlliwduuJ17HWYJAk4FJlIyyxeqp7xunPefB5tcDO--qRmD5Eco38JrGMGZ6Ua273SsiLIEmBQOL3k_VraNFYjhwyhQSGPL6Ay85rTyjcyVGqgt5jiQt1Y1YnkmFkLkBVkwNUh35rtsQZ5rJkm1tPkA0cX_qgfYAZRB4r_r4ZZL2Ngd-whRgHZ5SfMz1e5sQVnDg9fQCFHMbBI31BsRA',
    category: 'Cross Training',
    specialty: 'LPO & Condicionamento Metabólico',
    gymLocation: 'CrossFit Perdizes',
    city: 'São Paulo, SP',
    streakDays: 45,
    isActiveToday: true,
    verifiedBadge: 'ATLETA',
    followersCount: 2150,
    following: false,
    topPR: 'Snatch: 115 kg • Clean & Jerk: 145 kg',
    bio: 'Preparação para a seletiva nacional. Levantamento olímpico e capacidade aeróbica máxima.',
    recentWorkout: 'WOD Grace em 1m 58s',
    matchPercentage: 91
  },
  {
    id: 'disc-4',
    name: 'Digo Calistenia',
    handle: '@digo.street',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYR3dv0HQTyJ2BZ7kOJgIlEa64sAUCWWcUjr5Pa4iDshrfcGvJYDiRxGrTKPxj4KFnMj24gH1Ep3EKdeCGofZjSDLolzxhjmla4ac6jxSWuBD7diuqV_PupqVBpeQ6SNy8zwW43BFWNiUXzJzpf95K7xY-fGYPF2zHRfpcuBU8X7E269nxenrS0Z3wlCAshF5N6eZhsVQU-RKFQJvTsM-SskYvMM8BK-gjZ4GLfTUNqC6HCrIHcIEs-Q',
    category: 'Calistenia',
    specialty: 'Street Lifting & Estáticos',
    gymLocation: 'Parque Ibirapuera / CT Street',
    city: 'São Paulo, SP',
    streakDays: 19,
    isActiveToday: false,
    verifiedBadge: 'ATLETA',
    followersCount: 1780,
    following: false,
    topPR: 'Muscle-Up +24 kg • Dips +60 kg',
    bio: 'Dominando o próprio peso e sobrecargas no Street Workout. Planilhas de calistenia progressiva.',
    recentWorkout: 'Barra Fixa Lastrada +36kg × 5 reps',
    matchPercentage: 88
  },
  {
    id: 'disc-5',
    name: 'Beatriz Albuquerque',
    handle: '@bia.running',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4yFeH1a4TcP2m-eQHJ85qqDA-tFyo5JGp_xqwCNdtkQe4mSPAlwvvDrmbDRbKSGwt1zceFqveAhlmdvDhbb0ffG7lJ7Oj_NWPxFu-2bpJC4yEHH700CwyMQ2pnOKzApC9IP55IPdchE9PXvbj5DlbYcDf6xwbhK0IpFNR_pK6uRAGO_AHqHetyCVb0pBTbLHrF1p1xRzW1zZ8IhSUAxhPhHix72G-eMUpKLOR85gNYQCBFgId63X7bQ',
    category: 'Endurance',
    specialty: 'Meia Maratona & Fortalecimento',
    gymLocation: 'Bluefit Moema / Pista Ibirapuera',
    city: 'São Paulo, SP',
    streakDays: 52,
    isActiveToday: true,
    verifiedBadge: 'ATLETA',
    followersCount: 2900,
    following: false,
    topPR: '10 km em 41m 20s • Meia Maratona 1h 32m',
    bio: 'Corredora amadora com rotina de musculação periodizada para prevenção de lesões e potência.',
    recentWorkout: 'Longão de 18km @ Pace 4:28/km',
    matchPercentage: 86
  },
  {
    id: 'disc-6',
    name: 'Rodrigo Menezes',
    handle: '@rodrigo.coach',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACoayZ5ZZFHjnUm4wRUcl9UFxpAg2Lr9FM0T3AhueW-XeVbdOxiLsPrZEraKdwZtR7XTcFHiZUgRTiE7-5c7PIqmRDxR0RXXQmfrheLiibc9yNDqUivQZJpqLtplD0D9HAIfjk7PaFn_v_2mKcJQQy_x9_eZi6mh-p9LS6SB4aD_3QAfS4PdYF5mc4-bnlQ8FDwXpknVTuQLYI5kxZaZLqV0Dv961pPbMIU8cblwaTCLtZhRFd8QXMCg',
    category: 'Treinador',
    specialty: 'Biomecânica & Hipertrofia Científica',
    gymLocation: 'SOMMA Training Lab',
    city: 'São Paulo, SP',
    streakDays: 80,
    isActiveToday: true,
    verifiedBadge: 'COACH',
    followersCount: 6240,
    following: true,
    topPR: 'Agachamento: 220 kg • Supino: 180 kg',
    bio: 'Preparador físico credenciado CREF. Mentor de atletas de força e entusiastas do treino sério.',
    recentWorkout: 'Periodização de Força Bloco 3',
    matchPercentage: 99
  }
];

export const MOCK_ACTIVE_PARTNER_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDLrttJa6__YHVJQgqZGUtjGE9eNyY7NTm-QSBlliwduuJ17HWYJAk4FJlIyyxeqp7xunPefB5tcDO--qRmD5Eco38JrGMGZ6Ua273SsiLIEmBQOL3k_VraNFYjhwyhQSGPL6Ay85rTyjcyVGqgt5jiQt1Y1YnkmFkLkBVkwNUh35rtsQZ5rJkm1tPkA0cX_qgfYAZRB4r_r4ZZL2Ngd-whRgHZ5SfMz1e5sQVnDg9fQCFHMbBI31BsRA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDYR3dv0HQTyJ2BZ7kOJgIlEa64sAUCWWcUjr5Pa4iDshrfcGvJYDiRxGrTKPxj4KFnMj24gH1Ep3EKdeCGofZjSDLolzxhjmla4ac6jxSWuBD7diuqV_PupqVBpeQ6SNy8zwW43BFWNiUXzJzpf95K7xY-fGYPF2zHRfpcuBU8X7E269nxenrS0Z3wlCAshF5N6eZhsVQU-RKFQJvTsM-SskYvMM8BK-gjZ4GLfTUNqC6HCrIHcIEs-Q',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4yFeH1a4TcP2m-eQHJ85qqDA-tFyo5JGp_xqwCNdtkQe4mSPAlwvvDrmbDRbKSGwt1zceFqveAhlmdvDhbb0ffG7lJ7Oj_NWPxFu-2bpJC4yEHH700CwyMQ2pnOKzApC9IP55IPdchE9PXvbj5DlbYcDf6xwbhK0IpFNR_pK6uRAGO_AHqHetyCVb0pBTbLHrF1p1xRzW1zZ8IhSUAxhPhHix72G-eMUpKLOR85gNYQCBFgId63X7bQ'
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'dr-rodrigo',
    name: 'Dr. Rodrigo Menezes',
    title: 'Personal Trainer & Especialista em Força',
    registration: 'CREF 049281-G/SP',
    category: 'personal',
    categoryLabel: 'Personal Trainer & Preparador Físico',
    rating: 4.9,
    reviewCount: 48,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACoayZ5ZZFHjnUm4wRUcl9UFxpAg2Lr9FM0T3AhueW-XeVbdOxiLsPrZEraKdwZtR7XTcFHiZUgRTiE7-5c7PIqmRDxR0RXXQmfrheLiibc9yNDqUivQZJpqLtplD0D9HAIfjk7PaFn_v_2mKcJQQy_x9_eZi6mh-p9LS6SB4aD_3QAfS4PdYF5mc4-bnlQ8FDwXpknVTuQLYI5kxZaZLqV0Dv961pPbMIU8cblwaTCLtZhRFd8QXMCg',
    detailAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvSQJf4uwvk_BmjTflZvS2p0WaTRkPeLiQO-JT75UnuWL8fCX8YBE4jIpEG3GDiu9rz_myjQyOI1f8AIPpeJK5czID4aMJcEs_GZxlv6hi0kpwGwaHe01HpPCQsnC9v1kss8tSTnWkIzE3Itxv-71Rv7LIwd__NwcnVOOGDbtzkNT_VaNLRobIFHXIMIvkOxZXMgxIOx2Gy5-9S7kw4T3G2Y0t7SdtPS_pDkg7g8dECeBf9p6TuNKHBg',
    verified: true,
    experienceYears: 9,
    activeStudents: 120,
    focusAreas: 'Hipertrofia, Periodização de Força e Reabilitação.',
    bio: 'Graduado em Educação Física (USP), mestre em Fisiologia do Exercício. Foco em progressão de carga segura, hipertrofia e reabilitação de lesões articulares com biomecânica avançada.',
    specialties: ['Periodização RPE', 'Biomecânica', 'Reabilitação'],
    pricingEstimate: 'Incluso no seu Plano Ativo',
    modality: 'Online no app SOMMA • Presencial credenciado',
    nextSlots: 'Terça, 28/05 às 10:00 e 16:30',
    isLinkedToUserPlan: true,
    assignedAreaName: 'Treinamento & Periodização de Força',
    prescriptionSummary: 'Rotinas A, B e C ativas no app • Foco em Força e Sobrecarga Progressiva',
    nextCheckInDate: 'Terça, 28/05',
    plans: [
      {
        id: 'plan-1',
        title: 'Consultoria de Treino Mensal',
        badge: 'Mais Escolhido',
        subtitle: 'Integração nativa no App SOMMA',
        price: 190,
        period: '/ mês',
        isFeatured: true,
        features: [
          'Periodização 100% individual montada na sua aba Treino',
          'Ajuste semanal de sobrecarga progressiva e faixas de RPE',
          'Análise de vídeos da execução dos seus levantamentos chave',
          'Chat direto com o Rodrigo de seg a sex na SOMMA+'
        ]
      },
      {
        id: 'plan-2',
        title: 'Avaliação Biomecânica & Prescrição',
        subtitle: 'Sessão individual intensiva de 60 min',
        price: 150,
        period: 'sessão única',
        features: [
          'Correção postural em tempo real dos 3 grandes levantamentos (agachamento, terra e supino)',
          'Identificação de assimetrias e encurtamentos antes de aumentar o peso',
          'Relatório técnico de mobilidade enviado pelo app'
        ]
      },
      {
        id: 'plan-3',
        title: 'Acompanhamento Integrado',
        badge: 'Parceria Multidisciplinar',
        subtitle: 'Treino + Nutricionista Parceira Credenciada',
        price: 340,
        period: '/ mês',
        features: [
          'Alinhamento sinérgico entre volume calórico e periodização de choque',
          'Plano de macronutrientes calibrado para recuperação de tendões e síntese proteica',
          'Acesso ao time integrado de saúde esportiva'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Lucas A.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkx7ru5OR7LvCWWHK0MilQxwOx4fKrvgaLmotwBTKtJIsCYAMNbjP1Jw7iIrlVsP46gVe-ArQ9EQ66KzPN0ZyJwiaekz0yZunfcCNvzD4NZf1gtt4mhDXcZgYD-_uo6CSTlt40PTkbzgoFSM192gfr9FMv5MzJPPQTaur80XNOZ-_a_4nZ1EnnJyDZMb0xbcGwJ0eoDSu3MczHDuAR6xV7BV_nWgWRm79r7S6wgoc6aTisrScCD7b0-w',
        rating: 5,
        duration: 'Membro SOMMA há 1 ano',
        comment: 'Em 4 meses com o Rodrigo meu supino subiu de 80kg para 100kg sem dor nos ombros. Periodização impecável e feedback cirúrgico dos vídeos.',
        achievement: '+20kg Carga Supino • 0 Lesões'
      },
      {
        id: 'rev-2',
        author: 'Mariana C.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtYMoampSkdVpNH8I2O5teWYNrZ0XxjFf7SvMlGsuzh9LuuANy0_igA8pYOEhLwLVVfW38zpxfg4dMEOZpv5GdnyB4HFzvMGchnqiXPmpOo9o5VGWuxPcJGXVHkpWluP1JJ8XDmFGH2flNQpAdNLPWKPE5h2761dCcqCdjAn1H4YngYSUYuB_ExwmJ0bBUw1q-xXQxbTWmp3kk2y5I_yMXaYAm1HIN8THLra-Zv4JBoL05nfPD7TycKg',
        rating: 5,
        duration: 'Membro SOMMA há 6 meses',
        comment: 'Excelente acompanhamento das séries e cargas pelo app. O Rodrigo não deixa a gente acomodar e sempre calibra o descanso correto.'
      }
    ]
  },
  {
    id: 'dra-camila',
    name: 'Dra. Camila Vasconcelos',
    title: 'Nutricionista Esportiva & Performance',
    registration: 'CRN-3 38921',
    category: 'nutri',
    categoryLabel: 'Nutricionista Esportiva',
    rating: 5.0,
    reviewCount: 68,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx1h79Kzn9UX4yxSt_OTDMe3IPdJsWQ2hyYG_DKzpTZLEzKoIBSdwNpzGkbuq92t73oWPi3hvioCY7dovE-XzyikiH_LMmeZnCNAFZInVg0xNz30VeHeAITLJdUqGAg-MHOlNa0yQba5WJh9gYnMDzCHKfIMAgJuwfsM3k38M853O7x8Qgy7g3MFEG-1akp6qmZplPs9S2twXnMvLlX2y--RMOlgzj7UQYfglgOezTq0sfUOWUS467ow',
    detailAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC404ejHLumLg75SShXa6pSDmKRhPXW_e3JuEHjBcx9U2l4n0gaDdTVUCIZYCLQuv0hV8Q-QcspFR02Ob7c5-6YKG5Pe4o_iH3WSv0IaMakCFJyXU7GNA1aQZUCEMhRzm1XGpz7j3UWwUkb8RcFznlNZfNbEg0Lppjx0q-EEsqQuPb50MsbIHxYF-DaGWI5tikecQGG0oUvi1-IzdlNRJq8c9xlxcql5zJsay1HLeP-DM-yUOuBUTobBg',
    verified: true,
    experienceYears: 8,
    activeStudents: 95,
    focusAreas: 'Composição corporal, hipertrofia limpa e sincronização de macros.',
    bio: 'Especialista em nutrição para esportes de força e hipertrofia. Planos alimentares individualizados com foco em aderência e sustentabilidade metabólica sem restrições extremas.',
    specialties: ['Composição Corporal', 'Hipertrofia Limpa', 'Suplementação Científica'],
    pricingEstimate: 'Incluso no seu Plano Ativo',
    modality: 'Online & Presencial (São Paulo)',
    nextSlots: 'Quarta, 29/05 às 14:00',
    isLinkedToUserPlan: true,
    assignedAreaName: 'Nutrição Esportiva & Composição Corporal',
    prescriptionSummary: 'Plano Hipertrofia Limpa (2.650 kcal • 185g Proteína ativa)',
    nextCheckInDate: 'Segunda, 02/06'
  },
  {
    id: 'dr-lucas-fisio',
    name: 'Dr. Lucas Ferraz',
    title: 'Fisioterapeuta Esportivo & Recovery',
    registration: 'CREFITO-3 19283-F',
    category: 'fisio',
    categoryLabel: 'Fisioterapeuta Esportivo',
    rating: 4.8,
    reviewCount: 34,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVidrfeoWvK94sJeOaPnymTJE1Q9eImNr6gwNem8J5nkHUm24epPY8MB8fuw7PWhdzxmCIxA-raya2lkPyVVAbyoj7wF8JmPe1q2hgwG-loUpJGoS9UojDKQ757OTOewQGVIGSN-t3X-sLX-VLMEBGjmQsHLXLj3tbrG9E6tcXMZ9SxMUcmcgIV6j5JhVWN6MDB_pZgiVyKEH59e1GFKfaD7qWbVud2rzrq_T8S4e4eQPIm_YRM4lHZA',
    detailAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQCHK0tZRo-O5coz0JzIAs5tt5L_5AG9vhYapIlu-s24azT5Ds4VI1yQhlV1fXNZafcp0VJsNcHcG3o6-pmfC9bsIhpxxW4PVZpe3iRYF-ObauLknc8S_vOfQZe3_UgTFiKhjb_ibUtMASHEmcaglYi5h_FQr_46YyFvqA5104Z0aydsd7q4wjCjC6P7BWMDmR3RW8150CCAwVHvOP2xtv8d4fJO2hmecsnwiDCP4_pIunG079D6tBLw',
    verified: true,
    experienceYears: 7,
    activeStudents: 60,
    focusAreas: 'Prevenção de lesões no treino, mobilidade articular e recovery muscular.',
    bio: 'Fisioterapia desportiva com foco em atletas de musculação e powerlifting. Prevenção de lesões no supino e agachamento, recovery muscular acelerado e liberação miofascial precisa.',
    specialties: ['Reabilitação de Ombro e Joelho', 'Mobilidade Articular', 'Recovery Muscular'],
    pricingEstimate: 'Incluso no seu Plano Ativo (Slot Disponível)',
    modality: 'Presencial • Clínicas parceiras • Tele-avaliação',
    nextSlots: 'Segunda, 27/05 às 09:30',
    isLinkedToUserPlan: false,
    assignedAreaName: 'Fisioterapia & Recovery Muscular',
    prescriptionSummary: 'Disponível para ativação imediata no seu plano',
    nextCheckInDate: 'Avaliação Inicial Disponível'
  },
  {
    id: 'dra-mariana-vasc',
    name: 'Mariana Vasconcelos',
    title: 'Personal Trainer & Biomecânica',
    registration: 'CREF 081294-G/RJ',
    category: 'personal',
    categoryLabel: 'Personal Trainer & Biomecânica',
    rating: 4.9,
    reviewCount: 29,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJQ7kJ6F4igJ9UsAVhURuQ9v9umSwG_0rLdfQGutKCEpEGmCIaNUvD2lmI3MjV7Sm-ha0cxOltubvuacp4MTBoNTB_pme_wCor5t1vZSIpQIBjFjFP2E12mWcCQwInhKa-pfm_-cTzNqskV0avRCWBAel6qxDrKNjzYsnDzcyW-99wekdF14nrFv5ULn7wpdrR4eDaaSdsafV1t0EVna2c6LwLEwAzUThs8lzLlHpsUXQ_2lytr8NMBg',
    verified: true,
    experienceYears: 6,
    activeStudents: 55,
    focusAreas: 'Biomecânica de execução, correção postural sob carga pesada e consultoria 100% online.',
    bio: 'Mestre em Biomecânica pela UFRJ. Análise de vetores de força e alavancas mecânicas para máxima eficiência neural e recrutamento muscular.',
    specialties: ['Biomecânica de Precisão', 'Treino Feminino Avançado', 'Consultoria 100% Online'],
    pricingEstimate: 'Disponível para troca de especialista',
    modality: 'Consultoria 100% Online',
    nextSlots: 'Quinta, 30/05 às 11:00',
    isLinkedToUserPlan: false,
    assignedAreaName: 'Treinamento & Biomecânica'
  }
];

export const USER_SUBSCRIPTION_PLAN: UserSubscriptionPlan = {
  id: 'plan-somma-pro',
  name: 'Plano SOMMA Multidisciplinar Performance',
  badge: 'PLANO ATIVO PRO',
  status: 'active',
  renewalDate: '28 de Junho de 2026',
  billingPeriod: 'Anual',
  priceMonthly: 'R$ 49,90 / mês',
  description: 'Acompanhamento integrado com 1 especialista dedicado de cada área técnica sincronizado no seu aplicativo.',
  includedFeatures: [
    '1 Treinador credenciado com periodização 100% individual na aba Treinos',
    '1 Nutricionista esportiva com cardápios e macros calibrados na aba Dieta',
    '1 Fisioterapeuta dedicado para mobilidade e prevenção articular',
    'Chat direto e ilimitado com seu time multidisciplinar',
    'Sincronização em tempo real de treinos, PRs e registro nutricional'
  ]
};
