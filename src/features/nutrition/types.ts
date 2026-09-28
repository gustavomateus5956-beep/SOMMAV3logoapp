/**
 * types.ts
 * 
 * Contratos arquiteturais para o ecossistema SOMMA Nutrition.
 * Prepara a aplicação para a futura biblioteca nutricional completa
 * (TACO/POF, FatSecret, Open Food Facts, etc.) e SOMMA Intelligence.
 */

export type FoodDatabaseSource = 
  | 'somma' 
  | 'taco' 
  | 'pof' 
  | 'fatsecret' 
  | 'openfoodfacts' 
  | 'custom';

export type FoodPortionUnit = 
  | 'g' 
  | 'ml' 
  | 'unidade' 
  | 'colher_sopa' 
  | 'colher_cha' 
  | 'fatia' 
  | 'xicara' 
  | 'copo' 
  | 'scoop' 
  | 'prato' 
  | 'porcao';

export interface NutrientProfile {
  calories: number;        // kcal
  protein: number;         // g
  carbohydrates: number;   // g
  fats: number;            // g
  fiber?: number;          // g
  sodiumMg?: number;       // mg
  sugar?: number;          // g
  saturatedFat?: number;   // g
  potassiumMg?: number;    // mg
  calciumMg?: number;      // mg
  ironMg?: number;         // mg
}

export interface FoodPortionOption {
  unit: FoodPortionUnit;
  label: string;           // e.g. "1 colher de sopa (25g)", "1 fatia média (30g)"
  gramsEquivalent: number; // Peso equivalente em gramas para cálculo proporcional
  isDefault?: boolean;
}

export interface FoodItemModel {
  id: string;
  name: string;
  originalName?: string;
  brand?: string;
  barcode?: string;
  source: FoodDatabaseSource;
  category?: string;
  nutritionPer100g: NutrientProfile;
  portions?: FoodPortionOption[];
  verified?: boolean;
  imageUrl?: string;
}

export interface FoodSearchQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  language?: 'pt-BR' | 'en';
}

/**
 * Interface contratual para provedores de alimentos (IFoodProvider).
 * Futuramente implementada por SommaFoodProvider, FatSecretProvider, OpenFoodFactsProvider, etc.
 */
export interface IFoodProvider {
  readonly providerId: FoodDatabaseSource;
  readonly displayName: string;
  search(query: string, options?: FoodSearchQueryOptions): Promise<FoodItemModel[]>;
  getByBarcode?(barcode: string): Promise<FoodItemModel | null>;
  getById?(id: string): Promise<FoodItemModel | null>;
}

/**
 * Modos de entrada alimentar previstos para a SOMMA Intelligence
 */
export type FoodLoggingInputMethod = 
  | 'search'          // Busca textual clássica
  | 'barcode'         // Scanner de código de barras
  | 'text'            // Prompt / descrição em linguagem natural ("comi 2 ovos e 1 pão")
  | 'voice'           // Áudio transcrito pelo usuário
  | 'package_photo'   // Foto frontal da embalagem do produto
  | 'label_photo'     // Foto da tabela nutricional / rótulo
  | 'plate_photo';    // Foto do prato montado com estimativa visual de porções

/**
 * Estrutura do plano nutricional e estratégia prescrita por profissional
 */
export interface NutritionPlanProfessional {
  name: string;
  role?: string;
  registration?: string; // CRN / CREM
}

export interface NutritionPlanStrategyData {
  goal: string;
  calorieTarget: number;
  proteinTarget: number;
  carbohydrateTarget: number;
  fatTarget: number;
  fiberTarget?: number;
  waterTargetMl?: number;
  strategy?: string;
  notes?: string;
  professional?: NutritionPlanProfessional;
  updatedAt?: string;
}
