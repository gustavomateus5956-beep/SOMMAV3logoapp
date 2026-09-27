export interface SommaTerm {
  key: string;
  label: string;
}

/** Original dataset contract; adapters must not rewrite the source records. */
export interface SommaDatasetExercise {
  id: string;
  slug: string;
  name: string;
  originalName: string;
  aliasesPtBr: string[];
  aliasesEn: string[];
  category: SommaTerm;
  bodyPart: SommaTerm;
  target: SommaTerm;
  muscleGroups: SommaTerm[];
  secondaryMuscles: SommaTerm[];
  equipment: SommaTerm;
  instructions: { ptBr: string; en: string };
  instructionSteps: { ptBr: string[]; en: string[] };
  media: { image: string; gif: string; hasImage: boolean; hasGif: boolean; mediaId: string };
  attribution: string;
  searchText: string;
  translationMeta: {
    nameMethod: string;
    nameNeedsReview: boolean;
    nameUntranslatedTokens: string[];
    instructionsMethod: string;
    instructionsNeedsReview: boolean;
    instructionResidues: string[];
  };
  libraryCategory: SommaTerm;
  activityType: SommaTerm;
  environment: SommaTerm;
  collections: SommaTerm[];
  classificationMeta: { method: string; confidence: string; needsReview: boolean; reasons: string[] };
}

export interface CatalogQuery {
  query?: string;
  bodyPart?: string;
  equipment?: string;
  targetMuscle?: string;
  libraryCategory?: string;
  activityType?: string;
  environment?: string;
  collection?: string;
  after?: string;
  limit?: number;
}
