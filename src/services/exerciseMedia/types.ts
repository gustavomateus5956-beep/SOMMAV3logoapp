import { ExerciseMediaProvider, ExternalExerciseResult } from '../../types';

export type { ExternalExerciseResult };

/**
 * Representação externa retornada pela ExerciseDB (V1).
 * Não deve ser exposta diretamente para os componentes React.
 */
export interface ExerciseDbExercise {
  id?: string;
  exerciseId?: string;
  name?: string;
  gifUrl?: string;
  bodyParts?: string[];
  equipments?: string[];
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
}

export interface ExerciseDbQueryParams {
  name?: string;
  limit?: number;
  after?: string;
  bodyParts?: string;
  equipments?: string;
  targetMuscles?: string;
}

export interface ExerciseDbListResponse {
  success: boolean;
  meta?: {
    total?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    nextCursor?: string;
  };
  data?: ExerciseDbExercise[];
}

/**
 * Formato normalizado de retorno do serviço de mídia para o SOMMA+.
 */
export interface ExerciseMediaResult {
  provider: ExerciseMediaProvider;
  externalId?: string;
  thumbnailUrl?: string;
  gifUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
  sourceLabel?: string;
}

/**
 * Resposta paginada normalizada para o catálogo do SOMMA+.
 */
export interface NormalizedExternalCatalogResponse {
  exercises: ExternalExerciseResult[];
  total?: number;
  hasNextPage: boolean;
  nextCursor?: string;
}
