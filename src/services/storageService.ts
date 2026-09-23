import { UserProfile, WorkoutSessionRecord, CommunityPost, RoutineStory, Comment } from '../types';

const STORAGE_KEYS = {
  USERS: 'somma_users',
  SESSION: 'somma_session',
  WORKOUTS_PREFIX: 'somma_workouts_',
  COMMUNITY_POSTS: 'somma_community_posts',
  ROUTINE_STORIES: 'somma_routine_stories',
  STORY_VIEWS: 'somma_story_views',
} as const;

// Default initial user for testing/demo purposes
const DEFAULT_INITIAL_USER: UserProfile = {
  id: 'user_lucas_default',
  name: 'Lucas Andrade',
  username: 'lucasandrade',
  email: 'lucas@somma.com',
  password: 'password123',
  avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1URm0XDVMSrJNRDc_1GLuvyv0l5c4j4WEL9rP3UPflZRz5H1m9TZPGBMK00H335edXtA8GKJ3D11CB0zoo-_xT8BX4Of8ILIXCOvazguboO4Lw5pTVsG7iJggnbin_E1GWeZ841ZBSPfxaiVabJ12AEsVjplJzt2l3sdqKXs6S9GfMO-qHvR_UCqAjtllBiVgbQolwJ6Cwt3wA0KGJybX7eKNw07aG_W4HSTR08k3vGpETwMxoMon6YKB-UxRSpFwJWPCD7sWLk24k',
  role: 'Atleta Intermediário',
  joinedDate: 'Jan 2024',
  age: 26,
  weight: 82.4,
  height: 1.78,
  totalWorkouts: 184,
  totalPrs: 12,
  streakDays: 14,
  goal: 'Hipertrofia e Força',
  plan: 'SOMMA Black Anual',
  linkedProfessionalIds: ['dr-rodrigo', 'dra-camila'],
};

// Seed initial authentic workouts for Lucas demo account
const INITIAL_DEMO_WORKOUTS: WorkoutSessionRecord[] = [
  {
    id: 'workout-session-1',
    userId: 'user_lucas_default',
    routineId: 'rotina-a',
    routineName: 'Treino A • Peito e Tríceps',
    muscleGroups: 'Peitoral & Tríceps',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    finishedAt: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
    dateDisplay: 'Hoje',
    durationMinutes: 58,
    durationFormatted: '58 min',
    totalVolume: 7840,
    totalCompletedSets: 14,
    totalExercises: 4,
    prsCount: 1,
    notes: 'Supino reto com execução bem controlada e pico de contração no tríceps corda.',
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Supino Reto com Barra',
        muscleGroup: 'Peitoral',
        professionalNote: 'Controle excêntrico de 3 segundos por repetição.',
        sets: [
          { setNumber: 1, type: 'warmup', targetWeight: 60, targetReps: 15, prevWeight: 60, prevReps: 15, weight: 60, reps: 15, completed: true, instruction: 'Aquecimento preparatório' },
          { setNumber: 2, type: 'working', targetWeight: 84, targetReps: 10, prevWeight: 80, prevReps: 10, weight: 84, reps: 10, completed: true },
          { setNumber: 3, type: 'working', targetWeight: 92, targetReps: 8, prevWeight: 90, prevReps: 8, weight: 92, reps: 8, completed: true },
          { setNumber: 4, type: 'max_strength', targetWeight: 100, targetReps: 3, prevWeight: 96, prevReps: 3, weight: 100, reps: 3, completed: true, isPr: true, instruction: 'Força máxima planejada' }
        ]
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Supino Inclinado com Halteres',
        muscleGroup: 'Peitoral Superior',
        sets: [
          { setNumber: 1, type: 'working', targetWeight: 32, targetReps: 10, prevWeight: 30, prevReps: 10, weight: 32, reps: 10, completed: true },
          { setNumber: 2, type: 'working', targetWeight: 34, targetReps: 8, prevWeight: 32, prevReps: 8, weight: 34, reps: 8, completed: true },
          { setNumber: 3, type: 'dropset', targetWeight: 26, targetReps: 12, prevWeight: 26, prevReps: 12, weight: 26, reps: 12, completed: true, instruction: 'Drop de 20% pós-falha' }
        ]
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Desenvolvimento Militar c/ Halteres',
        muscleGroup: 'Deltóides',
        sets: [
          { setNumber: 1, type: 'working', prevWeight: 22, prevReps: 10, weight: 24, reps: 10, completed: true },
          { setNumber: 2, type: 'working', prevWeight: 24, prevReps: 8, weight: 24, reps: 8, completed: true },
          { setNumber: 3, type: 'failure', targetWeight: 26, targetReps: 8, prevWeight: 26, prevReps: 8, weight: 26, reps: 8, completed: true, instruction: 'Falha técnica controlada' }
        ]
      },
      {
        exerciseId: 'ex-4',
        exerciseName: 'Tríceps Corda no Pulley',
        muscleGroup: 'Tríceps',
        sets: [
          { setNumber: 1, type: 'working', prevWeight: 22, prevReps: 15, weight: 25, reps: 15, completed: true },
          { setNumber: 2, type: 'rest_pause', prevWeight: 25, prevReps: 12, weight: 25, reps: 15, completed: true, instruction: 'Rest-pause de 15s' },
          { setNumber: 3, type: 'working', prevWeight: 25, prevReps: 12, weight: 25, reps: 12, completed: true },
          { setNumber: 4, type: 'dropset', targetWeight: 20, targetReps: 12, prevWeight: 20, prevReps: 10, weight: 22, reps: 10, completed: true, instruction: 'Drop set 2 placas' }
        ]
      }
    ]
  },
  {
    id: 'workout-session-2',
    userId: 'user_lucas_default',
    routineId: 'rotina-b',
    routineName: 'Treino B • Costas e Bíceps',
    muscleGroups: 'Dorsais & Bíceps',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    dateDisplay: 'Ontem',
    durationMinutes: 62,
    durationFormatted: '1h 02m',
    totalVolume: 8200,
    totalCompletedSets: 14,
    totalExercises: 5,
    prsCount: 0,
    notes: 'Ótima cadência nas remadas.',
    exercises: [
      {
        exerciseId: 'ex-b1',
        exerciseName: 'Puxador Alto Frente (Lat Pulldown)',
        muscleGroup: 'Dorsais',
        sets: [
          { setNumber: 1, prevWeight: 65, prevReps: 12, weight: 70, reps: 10, completed: true },
          { setNumber: 2, prevWeight: 70, prevReps: 10, weight: 75, reps: 8, completed: true },
          { setNumber: 3, prevWeight: 75, prevReps: 8, weight: 80, reps: 8, completed: true }
        ]
      },
      {
        exerciseId: 'ex-b2',
        exerciseName: 'Remada Curvada com Barra',
        muscleGroup: 'Dorsais',
        sets: [
          { setNumber: 1, prevWeight: 70, prevReps: 10, weight: 75, reps: 10, completed: true },
          { setNumber: 2, prevWeight: 75, prevReps: 8, weight: 80, reps: 8, completed: true },
          { setNumber: 3, prevWeight: 80, prevReps: 6, weight: 82.5, reps: 6, completed: true }
        ]
      },
      {
        exerciseId: 'ex-b4',
        exerciseName: 'Rosca Direta Barra W',
        muscleGroup: 'Bíceps',
        sets: [
          { setNumber: 1, prevWeight: 28, prevReps: 10, weight: 30, reps: 10, completed: true },
          { setNumber: 2, prevWeight: 30, prevReps: 8, weight: 32, reps: 8, completed: true }
        ]
      }
    ]
  },
  {
    id: 'workout-session-3',
    userId: 'user_lucas_default',
    routineId: 'rotina-c',
    routineName: 'Treino C • Pernas Completo',
    muscleGroups: 'Quadríceps & Glúteos',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 70).toISOString(),
    dateDisplay: 'Há 3 dias',
    durationMinutes: 70,
    durationFormatted: '1h 10m',
    totalVolume: 11450,
    totalCompletedSets: 15,
    totalExercises: 5,
    prsCount: 2,
    notes: 'Agachamento com 140kg sólida e Leg Press sem travamento de joelho.',
    exercises: [
      {
        exerciseId: 'ex-c1',
        exerciseName: 'Agachamento Livre com Barra',
        muscleGroup: 'Pernas',
        sets: [
          { setNumber: 1, prevWeight: 100, prevReps: 10, weight: 110, reps: 10, completed: true },
          { setNumber: 2, prevWeight: 120, prevReps: 8, weight: 130, reps: 8, completed: true },
          { setNumber: 3, prevWeight: 130, prevReps: 5, weight: 140, reps: 4, completed: true, isPr: true }
        ]
      },
      {
        exerciseId: 'ex-c2',
        exerciseName: 'Leg Press 45°',
        muscleGroup: 'Pernas',
        sets: [
          { setNumber: 1, prevWeight: 280, prevReps: 12, weight: 300, reps: 12, completed: true },
          { setNumber: 2, prevWeight: 320, prevReps: 10, weight: 340, reps: 10, completed: true, isPr: true }
        ]
      }
    ]
  }
];

class StorageService {
  /**
   * Returns all registered users in localStorage.
   */
  public getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        // Initialize with default demo user
        const initialList = [DEFAULT_INITIAL_USER];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialList));
        return initialList;
      }
      return JSON.parse(data) as UserProfile[];
    } catch (error) {
      console.error('Erro ao ler usuários do localStorage:', error);
      return [DEFAULT_INITIAL_USER];
    }
  }

  /**
   * Find a user by email address (case-insensitive).
   */
  public getUserByEmail(email: string): UserProfile | null {
    const normalizedEmail = email.trim().toLowerCase();
    const users = this.getAllUsers();
    return users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
  }

  /**
   * Find a user by ID.
   */
  public getUserById(id: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find((u) => u.id === id) || null;
  }

  /**
   * Save or update a user in the local storage list.
   */
  public saveUser(user: UserProfile): void {
    try {
      const users = this.getAllUsers();
      const existingIndex = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...user };
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuário no localStorage:', error);
    }
  }

  /**
   * Save session token/user id.
   */
  public saveSession(userId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, userId);
    } catch (error) {
      console.error('Erro ao salvar sessão no localStorage:', error);
    }
  }

  /**
   * Retrieve active session user (if any).
   */
  public getSession(): UserProfile | null {
    try {
      const userId = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!userId) return null;
      return this.getUserById(userId);
    } catch (error) {
      console.error('Erro ao recuperar sessão:', error);
      return null;
    }
  }

  /**
   * Clear active session (logout).
   */
  public removeSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Erro ao remover sessão:', error);
    }
  }

  /**
   * Clear all user-specific data or remove user.
   */
  public clearUserData(userId: string): void {
    try {
      const users = this.getAllUsers().filter((u) => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const currentSessionId = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (currentSessionId === userId) {
        this.removeSession();
      }
      localStorage.removeItem(`${STORAGE_KEYS.WORKOUTS_PREFIX}${userId}`);
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
    }
  }

  /**
   * Get all completed workout sessions for a given user.
   */
  public getWorkoutSessions(userId: string): WorkoutSessionRecord[] {
    try {
      const storageKey = `${STORAGE_KEYS.WORKOUTS_PREFIX}${userId}`;
      const data = localStorage.getItem(storageKey);
      if (!data) {
        // If it's the demo user Lucas, initialize with authentic demo workouts
        if (userId === 'user_lucas_default') {
          localStorage.setItem(storageKey, JSON.stringify(INITIAL_DEMO_WORKOUTS));
          return INITIAL_DEMO_WORKOUTS;
        }
        return [];
      }
      return JSON.parse(data) as WorkoutSessionRecord[];
    } catch (error) {
      console.error('Erro ao recuperar sessões de treino:', error);
      return [];
    }
  }

  /**
   * Save a newly completed workout session for a given user.
   */
  public saveWorkoutSession(userId: string, session: WorkoutSessionRecord): void {
    try {
      const storageKey = `${STORAGE_KEYS.WORKOUTS_PREFIX}${userId}`;
      const sessions = this.getWorkoutSessions(userId);
      const updated = [session, ...sessions.filter((s) => s.id !== session.id)];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar sessão de treino:', error);
    }
  }

  /**
   * Look up previous logged performance for a specific exercise name.
   */
  public getLastExercisePerformance(
    userId: string,
    exerciseName: string
  ): { sets: { weight: number; reps: number }[] } | null {
    try {
      const sessions = this.getWorkoutSessions(userId);
      for (const session of sessions) {
        const found = session.exercises.find(
          (e) => e.exerciseName.toLowerCase().trim() === exerciseName.toLowerCase().trim()
        );
        if (found && found.sets.length > 0) {
          return {
            sets: found.sets.map((s) => ({ weight: s.weight, reps: s.reps }))
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar performance anterior do exercício:', error);
      return null;
    }
  }

  /**
   * COMMUNITY & SOCIAL FEED METHODS
   */
  public getCommunityPosts(): CommunityPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(INITIAL_SEED_POSTS));
        return INITIAL_SEED_POSTS;
      }
      return JSON.parse(data) as CommunityPost[];
    } catch (error) {
      console.error('Erro ao recuperar posts da comunidade:', error);
      return INITIAL_SEED_POSTS;
    }
  }

  public saveCommunityPost(post: CommunityPost): void {
    try {
      const current = this.getCommunityPosts();
      const updated = [post, ...current.filter((p) => p.id !== post.id)];
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar post da comunidade:', error);
    }
  }

  public toggleLikePost(
    postId: string,
    userId: string
  ): { likesCount: number; isLiked: boolean } {
    try {
      const posts = this.getCommunityPosts();
      let result = { likesCount: 0, isLiked: false };
      const updated = posts.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const currentLikes = p.likesCount ?? p.cheerCount ?? 0;
          const likesCount = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
          result = { likesCount, isLiked };
          return { ...p, isLiked, likesCount, userCheered: isLiked, cheerCount: likesCount };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
      return result;
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      return { likesCount: 0, isLiked: false };
    }
  }

  public addCommentToPost(postId: string, comment: Comment): Comment[] {
    try {
      const posts = this.getCommunityPosts();
      let updatedComments: Comment[] = [];
      const updated = posts.map((p) => {
        if (p.id === postId) {
          const comments = [comment, ...(p.comments || [])];
          updatedComments = comments;
          return {
            ...p,
            comments,
            commentsCount: comments.length
          };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
      return updatedComments;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      return [];
    }
  }

  /**
   * ROUTINE STORIES (STORIES VISUAIS FITNESS) METHODS
   */
  public getRoutineStories(): RoutineStory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINE_STORIES);
      const viewedIds = this.getViewedStoryIds();
      let stories: RoutineStory[] = [];
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ROUTINE_STORIES, JSON.stringify(INITIAL_SEED_STORIES));
        stories = INITIAL_SEED_STORIES;
      } else {
        stories = JSON.parse(data) as RoutineStory[];
      }
      return stories.map((s) => ({
        ...s,
        viewed: viewedIds.includes(s.id),
        hasUnseen: !viewedIds.includes(s.id)
      }));
    } catch (error) {
      console.error('Erro ao recuperar rotinas stories:', error);
      return INITIAL_SEED_STORIES;
    }
  }

  public saveRoutineStory(story: RoutineStory): void {
    try {
      const current = this.getRoutineStories();
      const updated = [story, ...current.filter((s) => s.id !== story.id)];
      localStorage.setItem(STORAGE_KEYS.ROUTINE_STORIES, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar rotina story:', error);
    }
  }

  public getViewedStoryIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORY_VIEWS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public markStoryViewed(storyId: string): void {
    try {
      const current = this.getViewedStoryIds();
      if (!current.includes(storyId)) {
        const updated = [...current, storyId];
        localStorage.setItem(STORAGE_KEYS.STORY_VIEWS, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Erro ao marcar story como visto:', error);
    }
  }
}

// Initial authentic seed stories
const INITIAL_SEED_STORIES: RoutineStory[] = [
  {
    id: 'story-1',
    userId: 'user-matheus',
    authorName: 'Matheus Silva',
    authorHandle: '@matheussilva',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jd23T-l8YdGDbEsuT4rypw-Gwrqx3nsXr3o89dyLyo1JLwu9FqPRYA4mquhzSAWAshEM4J1YpgfN7TzK4LeO27rdpiBJ1qut7Ck8b9ngApGWX61iYxU23WqOEESiH0jSxQVl7GecIxaVLkkhazZZjDVx1n2h33cds909uKU1iYVfc7k5ZZf3Q-X7-QUk010p3E2buMFkYvcecYx3beSD1mnGyJeS24kcNuMo7jzTu_keVN5chDuisA',
    authorVerified: true,
    viewed: false,
    hasUnseen: true,
    type: 'workout',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    caption: 'Bati PR no Supino Inclinado com 34kg cada halter! Carga mantida por 8 reps firmes.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    timeAgo: 'há 45 min',
    expiresInHours: 23,
    targetMuscle: 'Peitoral & Deltoide',
    todayVolume: '8.920 kg',
    statBadge: '+1 Novo PR',
    workoutHighlight: 'Treino A • Peito & Tríceps',
    items: [
      {
        id: 'item-1-1',
        type: 'workout',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
        caption: 'Supino inclinado 34kg halter batido com controle excêntrico total 🔥',
        workoutHighlight: 'Supino 34kg Halter',
        statBadge: 'PR Batido',
        todayVolume: '8.920 kg',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: 'item-1-2',
        type: 'photo',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
        caption: 'Pump pós-treino pago! Hidratação e shake pós agora 🥤',
        statBadge: 'Pump Pós-Treino',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      }
    ]
  },
  {
    id: 'story-2',
    userId: 'user-mariana',
    authorName: 'Mariana Costa',
    authorHandle: '@mari.costafit',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hluTOfLwbFh-uaxfMHxbERT5D1AwIn6wSa37maicy2yoAocZTze-xxidXOlroj4fCSRaTU8wTvb_My5c-JZqYUDXUf0kgTifmy_B2bhLd1eV_jbqv_rtiuYsT0wEsdxNgT3nCb5VfHR9KXvaBHpOLNkcL8mpbcQ607T2w3gba__3uGF9k4j3SSYhHO2RWCg34eDB--eLwGDCBBIMxsynZqKXY-zPwZ7c_hjgHi2f8Yhc-6G3yrUVHA',
    authorVerified: true,
    viewed: false,
    hasUnseen: true,
    type: 'workout',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    caption: 'Rotina matinal paga às 07h. Foco em cadência lenta no agachamento.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    timeAgo: 'há 2 horas',
    expiresInHours: 22,
    targetMuscle: 'Cadeia Posterior',
    todayVolume: '6.400 kg',
    statBadge: 'Agachamento 70kg',
    workoutHighlight: 'Rotina Força • 18/20'
  },
  {
    id: 'story-3',
    userId: 'user-pedro',
    authorName: 'Pedro Mendes',
    authorHandle: '@pedro.mendes',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    viewed: false,
    hasUnseen: true,
    type: 'evolution',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    caption: 'Composição corporal atualizada com o nutri: -1.8% de gordura em 30 dias!',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    timeAgo: 'há 3 horas',
    expiresInHours: 21,
    targetMuscle: 'Evolução Corporal',
    statBadge: '-1,8% Gordura',
    workoutHighlight: 'Check-in Nutrição'
  },
  {
    id: 'story-4',
    userId: 'user-rodrigo',
    authorName: 'Dr. Rodrigo Menezes',
    authorHandle: '@rodrigo.coach',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq0YgBwdksClOOLS2ECSZPXkPnc0yZFSJqlg7oJVcR8ZBWuVbPNpAb_bMOLRRXMc1hknBX7f3yF0kXKFUx4fPWZ0yjX9T6dcbgHrhxLmmKzsKsmPIzaGj73nUhZWLxlJPovT3e--mGSfxH8qKAhl6yJPbx3nbFO4meK-smrxNgNLrvkO50e9YX1vnIxS5VuyGNspb3PD03ZnCBgVTHiyWD6kkueRyYj2rMyGoli5xrzyjap0MSe9PAAw',
    authorVerified: true,
    viewed: false,
    hasUnseen: true,
    type: 'diet',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    caption: 'Ajuste biomecânico: rotação externa do ombro protege o manguito nas séries pesadas.',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    timeAgo: 'há 4 horas',
    expiresInHours: 20,
    targetMuscle: 'Biomecânica',
    todayVolume: 'Dica do Coach',
    statBadge: 'Técnica & Saúde'
  },
  {
    id: 'story-5',
    userId: 'user-ana',
    authorName: 'Ana Beatriz',
    authorHandle: '@anabeatriz.fit',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    viewed: true,
    hasUnseen: false,
    type: 'diet',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    caption: 'Pré-treino equilibrado: mingau proteico com morangos e pasta de amendoim 🍓',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    timeAgo: 'há 5 horas',
    expiresInHours: 19,
    statBadge: '42g Proteína',
    workoutHighlight: 'Alimentação Limpa'
  }
];

// Initial authentic seed community posts
const INITIAL_SEED_POSTS: CommunityPost[] = [
  {
    id: 'post-seed-1',
    userId: 'user-matheus',
    type: 'workout',
    authorName: 'Gustavo Mateus',
    authorHandle: '@gustavomateus',
    authorVerified: true,
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jd23T-l8YdGDbEsuT4rypw-Gwrqx3nsXr3o89dyLyo1JLwu9FqPRYA4mquhzSAWAshEM4J1YpgfN7TzK4LeO27rdpiBJ1qut7Ck8b9ngApGWX61iYxU23WqOEESiH0jSxQVl7GecIxaVLkkhazZZjDVx1n2h33cds909uKU1iYVfc7k5ZZf3Q-X7-QUk010p3E2buMFkYvcecYx3beSD1mnGyJeS24kcNuMo7jzTu_keVN5chDuisA',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    timeAgo: 'há 20 min',
    caption: 'Mais um treino concluído com foco em técnica estrita e sobrecarga progressiva. Tríceps corda queimando até a última repetição!',
    workoutData: {
      routineName: 'Treino A • Peito + Tríceps',
      muscleGroups: 'Peitoral & Tríceps',
      durationMinutes: 58,
      durationFormatted: '58 min',
      totalVolume: 7840,
      totalCompletedSets: 14,
      totalExercises: 10,
      prsCount: 1,
      prs: ['Supino Reto 100kg'],
      exercisesPreview: [
        { name: 'Supino Reto com Barra', detail: '4 séries • 100 kg máx', isPr: true },
        { name: 'Supino Inclinado c/ Halteres', detail: '3 séries • 34 kg' },
        { name: 'Desenvolvimento Militar', detail: '3 séries • 24 kg' },
        { name: 'Tríceps Corda no Pulley', detail: '4 séries • 25 kg' }
      ]
    },
    likesCount: 42,
    isLiked: false,
    commentsCount: 2,
    sharesCount: 5,
    comments: [
      {
        id: 'c-1',
        postId: 'post-seed-1',
        userId: 'user-mariana',
        authorName: 'Mariana Costa',
        authorHandle: '@mari.costafit',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hluTOfLwbFh-uaxfMHxbERT5D1AwIn6wSa37maicy2yoAocZTze-xxidXOlroj4fCSRaTU8wTvb_My5c-JZqYUDXUf0kgTifmy_B2bhLd1eV_jbqv_rtiuYsT0wEsdxNgT3nCb5VfHR9KXvaBHpOLNkcL8mpbcQ607T2w3gba__3uGF9k4j3SSYhHO2RWCg34eDB--eLwGDCBBIMxsynZqKXY-zPwZ7c_hjgHi2f8Yhc-6G3yrUVHA',
        content: 'Supino com 100kg tá monstro demais! Parabéns pela constância 💪',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: 'c-2',
        postId: 'post-seed-1',
        userId: 'user-rodrigo',
        authorName: 'Dr. Rodrigo Menezes',
        authorHandle: '@rodrigo.coach',
        authorBadge: 'COACH SOMMA',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq0YgBwdksClOOLS2ECSZPXkPnc0yZFSJqlg7oJVcR8ZBWuVbPNpAb_bMOLRRXMc1hknBX7f3yF0kXKFUx4fPWZ0yjX9T6dcbgHrhxLmmKzsKsmPIzaGj73nUhZWLxlJPovT3e--mGSfxH8qKAhl6yJPbx3nbFO4meK-smrxNgNLrvkO50e9YX1vnIxS5VuyGNspb3PD03ZnCBgVTHiyWD6kkueRyYj2rMyGoli5xrzyjap0MSe9PAAw',
        content: 'Ótima cadência nas séries pesadas. Deload programado para semana que vem!',
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
      }
    ]
  },
  {
    id: 'post-seed-2',
    userId: 'user-pedro',
    type: 'evolution',
    authorName: 'Pedro Mendes',
    authorHandle: '@pedro.mendes',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    timeAgo: 'há 1 hora',
    caption: 'Resultados do último ciclo de definição com a dieta do SOMMA. Redução de gordura visceral mantendo 100% da massa magra construída!',
    evolutionData: {
      metricName: 'Peso Corporal & Gordura',
      beforeValue: '75,2 kg',
      currentValue: '73,8 kg',
      changeText: '-1,4 kg',
      period: 'Últimas 4 semanas',
      secondaryMetric: 'Gordura: 15.8% → 13.9%'
    },
    likesCount: 88,
    isLiked: false,
    commentsCount: 0,
    sharesCount: 8,
    comments: []
  },
  {
    id: 'post-seed-3',
    userId: 'user-mariana',
    type: 'photo',
    authorName: 'Mariana Costa',
    authorHandle: '@mari.costafit',
    authorVerified: true,
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hluTOfLwbFh-uaxfMHxbERT5D1AwIn6wSa37maicy2yoAocZTze-xxidXOlroj4fCSRaTU8wTvb_My5c-JZqYUDXUf0kgTifmy_B2bhLd1eV_jbqv_rtiuYsT0wEsdxNgT3nCb5VfHR9KXvaBHpOLNkcL8mpbcQ607T2w3gba__3uGF9k4j3SSYhHO2RWCg34eDB--eLwGDCBBIMxsynZqKXY-zPwZ7c_hjgHi2f8Yhc-6G3yrUVHA',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    timeAgo: 'há 2 horas',
    caption: 'Constância é não negociar com a preguiça das 06h da manhã. Treino de inferiores concluído com carga máxima!',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop',
    likesCount: 154,
    isLiked: true,
    commentsCount: 0,
    sharesCount: 14,
    comments: []
  },
  {
    id: 'post-seed-4',
    userId: 'user-ana',
    type: 'diet',
    authorName: 'Ana Beatriz',
    authorHandle: '@anabeatriz.fit',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    timeAgo: 'há 5 horas',
    caption: 'Almoço pós-treino com 48g de proteína limpa: frango grelhado, batata-doce, abacate e salada colorida rica em micronutrientes 🥗✨',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
    likesCount: 67,
    isLiked: false,
    commentsCount: 0,
    sharesCount: 3,
    comments: []
  }
];

export const storageService = new StorageService();
