export type MainTabType = 'inicio' | 'treino' | 'dieta' | 'pass' | 'perfil';
export type SecondaryViewType = 'evolucao' | 'comunidade' | 'profissionais';
export type TabType = MainTabType | SecondaryViewType;

export type SetTypeKey =
  | 'warmup'
  | 'working'
  | 'dropset'
  | 'max_strength'
  | 'failure'
  | 'rest_pause'
  | 'amrap';

export interface SetTypeConfig {
  id: SetTypeKey;
  name: string;
  label: string;
  shortLabel: string;
  description: string;
  symbol: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  type?: SetTypeKey;
  targetWeight?: number;
  targetReps?: number;
  prevWeight?: number;
  prevReps?: number;
  weight: number; // Carga real executada
  reps: number;   // Repetições reais executadas
  rpe?: number;
  completed: boolean;
  instruction?: string;
  restTimeSeconds?: number;
}

export type ExerciseMediaProvider = 'exercisedb' | 'somma' | 'external';
export type ExerciseSource = 'somma' | 'exercisedb' | 'external';

export interface ExerciseExternalRef {
  provider: ExerciseMediaProvider;
  id: string;
}

export interface ExerciseMedia {
  provider: ExerciseMediaProvider;
  externalId?: string;
  thumbnailUrl?: string;
  gifUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ExternalExerciseResult {
  provider: 'exercisedb';
  externalId: string;
  name: string;
  originalName?: string;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  gifUrl?: string;
}

export interface Exercise {
  id: string;
  name: string;
  originalName?: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  notes?: string;
  equipment?: string;
  targetMuscles?: string[];
  tips?: string;
  professionalNote?: string; // Orientação específica do treinador/profissional
  instructions?: string;     // Instruções gerais de execução
  executionTips?: string[];  // Passos de execução detalhados
  media?: ExerciseMedia;
  source?: ExerciseSource;
  external?: ExerciseExternalRef;
  bodyPart?: string;
  target?: string;
}

export interface LibraryExercise {
  id: string;
  name: string;
  muscleGroup: string;
  targetMuscles: string[];
  equipment: 'Barra' | 'Halteres' | 'Máquina' | 'Polia' | 'Peso Corporal';
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  tips: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  media?: ExerciseMedia;
}

export interface RoutineCertificate {
  certified: boolean;
  professionalName: string;
  professionalRole: string;
  registrationNumber: string; // e.g. CREF 049210-G/SP
  certifiedDate: string;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  category: string;
  muscleGroups?: string;
  lastSession: string;
  exercisesCount: number;
  estimatedMinutes: number;
  exercises: Exercise[];
  isProfessionalCertified?: boolean;
  certifiedBy?: RoutineCertificate;
}

export interface CompletedSetLog {
  setNumber: number;
  type?: SetTypeKey;
  targetWeight?: number;
  targetReps?: number;
  weight: number;
  reps: number;
  completed: boolean;
  prevWeight?: number;
  prevReps?: number;
  isPr?: boolean;
  instruction?: string;
}

export interface CompletedExerciseLog {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  professionalNote?: string;
  sets: CompletedSetLog[];
}

export interface WorkoutSessionRecord {
  id: string;
  userId: string;
  routineId?: string;
  routineName: string;
  muscleGroups?: string;
  startedAt: string; // ISO string
  finishedAt: string; // ISO string
  dateDisplay: string; // e.g. "Hoje, 18:30" or "Ontem" or "14/09"
  durationMinutes: number;
  durationFormatted: string; // e.g. "54 min" or "1h 05m"
  totalVolume: number;
  totalCompletedSets: number;
  totalExercises: number;
  exercises: CompletedExerciseLog[];
  prsCount?: number;
  notes?: string;
}

// Nutrition & Diet Types
export interface FoodItem {
  id: string;
  name: string;
  category: 'Proteínas' | 'Carboidratos' | 'Gorduras Boas' | 'Frutas & Vegetais' | 'Laticínios' | 'Suplementos';
  servingSize: number; // in grams or ml
  servingUnit: string; // 'g', 'ml', 'unid', 'fatia', 'colher'
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface MealFoodEntry {
  id: string;
  foodId: string;
  name: string;
  portion: number; // quantity of servingUnit or grams
  portionDisplay: string; // e.g. "180g" or "2 fatias"
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyMeal {
  id: string;
  name: string;
  time: string;
  badge?: string; // e.g. "Pré-Treino", "Pós-Treino"
  targetCalories: number;
  foods: MealFoodEntry[];
  completed: boolean;
}

export interface NutritionPlan {
  id: string;
  title: string;
  objective: string;
  professionalName: string;
  professionalRole: string;
  professionalCremOrCrn: string; // CRN 38921
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  targetFiber: number;
  targetWaterMl: number;
  meals: DailyMeal[];
  supplementStack: {
    id: string;
    name: string;
    dosage: string;
    timing: string;
    taken: boolean;
  }[];
}

export type PostType = 'workout' | 'evolution' | 'diet' | 'photo' | 'text' | 'community';

export interface Comment {
  id: string;
  postId?: string;
  userId?: string;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
  authorBadge?: string;
  content?: string;
  createdAt?: string;
  // Backward compatibility
  author?: string;
  role?: string;
  avatar?: string;
  text?: string;
}

export interface WorkoutPostData {
  routineName: string;
  muscleGroups?: string;
  durationMinutes: number;
  durationFormatted?: string;
  totalVolume: number;
  totalCompletedSets: number;
  totalExercises: number;
  prsCount?: number;
  prs?: string[];
  exercisesPreview?: {
    name: string;
    detail: string;
    isPr?: boolean;
  }[];
}

export interface EvolutionPostData {
  metricName: string; // e.g. 'Peso Corporal'
  beforeValue: string; // e.g. '75,2 kg'
  currentValue: string; // e.g. '73,8 kg'
  changeText: string; // e.g. '-1,4 kg'
  period: string; // e.g. '4 semanas'
  secondaryMetric?: string; // e.g. 'Percentual de Gordura: 16% → 14%'
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

export interface CommunityPost {
  id: string;
  userId?: string;
  type?: PostType;
  authorName: string;
  authorHandle?: string;
  authorBadge?: string;
  isInfluencer?: boolean;
  influencerBadge?: string; // 'INFLUENCER SOMMA' | 'EMBAIXADOR SOMMA' | 'SOMMA CREATOR'
  authorVerified?: boolean;
  authorAvatar: string;
  createdAt?: string;
  timeAgo: string;
  title?: string;
  caption: string;
  content?: string;
  media?: string;
  imageUrl?: string;
  location?: string;
  tag1?: string;
  tag2?: string;
  workoutData?: WorkoutPostData;
  evolutionData?: EvolutionPostData;
  likesCount?: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: Comment[];
  sharesCount?: number;
  isSaved?: boolean;
  // Legacy compatibility fields
  duration?: string;
  volume?: string;
  exercisesCount?: number;
  prsCount?: number;
  exercisesPreview?: {
    name: string;
    detail: string;
    isPr?: boolean;
  }[];
  cheerCount?: number;
  userCheered?: boolean;
  workoutSummary?: {
    routineName: string;
    prs: string[];
    topSet: string;
  };
}

export type FeedPost = CommunityPost;

export interface RoutineStoryItem {
  id: string;
  type: 'workout' | 'evolution' | 'photo' | 'diet' | 'text';
  imageUrl?: string;
  caption: string;
  workoutHighlight?: string;
  statBadge?: string;
  todayVolume?: string;
  createdAt?: string;
}

export interface RoutineStory {
  id: string;
  userId?: string;
  authorName: string;
  authorHandle?: string;
  authorAvatar: string;
  authorVerified?: boolean;
  isUser?: boolean;
  hasUnseen?: boolean;
  viewed?: boolean;
  type?: 'workout' | 'evolution' | 'photo' | 'diet';
  content?: string;
  media?: string;
  imageUrl: string;
  caption: string;
  createdAt?: string;
  timeAgo: string;
  expiresAt?: string;
  expiresInHours: number; // Duration 24h countdown
  targetMuscle?: string;
  todayVolume?: string;
  statBadge?: string;
  workoutHighlight?: string;
  items?: RoutineStoryItem[];
}

export type RoutineFlash = RoutineStory;

export interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified?: boolean;
  badge?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  totalWorkouts: number;
  streakDays: number;
  gymLocation?: string;
  specialty?: string;
}

export interface DiscoverAthlete {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: 'Hipertrofia' | 'Powerlifting' | 'Calistenia' | 'Cross Training' | 'Endurance' | 'Treinador';
  specialty: string;
  gymLocation: string;
  city: string;
  streakDays: number;
  isActiveToday: boolean;
  verifiedBadge?: string; // 'PRO' | 'ATLETA' | 'COACH' | 'ELITE'
  followersCount: number;
  following: boolean;
  topPR: string;
  bio: string;
  recentWorkout?: string;
  matchPercentage?: number;
}

export interface ProfessionalPlan {
  id: string;
  title: string;
  badge?: string;
  subtitle: string;
  price: number;
  period: string;
  features: string[];
  isFeatured?: boolean;
}

export interface ProfessionalReview {
  id: string;
  author: string;
  avatar: string;
  badge?: string;
  rating: number;
  duration: string;
  comment: string;
  achievement?: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  registration: string;
  category: 'personal' | 'nutri' | 'fisio';
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  detailAvatar?: string;
  verified: boolean;
  focusAreas: string;
  experienceYears?: number;
  activeStudents?: number;
  bio?: string;
  specialties?: string[];
  pricingEstimate?: string;
  modality?: string;
  nextSlots?: string;
  plans?: ProfessionalPlan[];
  reviews?: ProfessionalReview[];
  // Plan linkage fields
  isLinkedToUserPlan?: boolean;
  assignedAreaName?: string;
  prescriptionSummary?: string;
  nextCheckInDate?: string;
}

export interface UserSubscriptionPlan {
  id: string;
  name: string;
  badge: string;
  status: 'active' | 'trial';
  renewalDate: string;
  billingPeriod: 'Mensal' | 'Anual';
  priceMonthly: string;
  description: string;
  includedFeatures: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  password?: string;
  avatar?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  plan?: string;
  role?: string;
  joinedDate?: string;
  totalWorkouts?: number;
  totalPrs?: number;
  streakDays?: number;
  linkedProfessionalIds?: string[];
}

