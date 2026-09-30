/** Canonical catalog contracts. Missing nutrients are unknown, never implicit zero. */
export type FoodProviderId = 'somma' | 'fatsecret' | 'openfoodfacts';
export type FoodSource = 'somma' | 'taco' | 'pof' | 'fatsecret' | 'openfoodfacts' | 'custom';
export interface NutrientQuantity { value: number; unit: 'g' | 'mg' | 'µg'; }
export interface Nutrition {
  /** kcal; all other macros in g, sodium and named minerals in mg. */
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  saturatedFat?: number;
  transFat?: number;
  sugars?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  cholesterol?: number;
  /** Stable nutrient identifiers, including vitamins; units travel with each value. */
  micronutrients?: Record<string, NutrientQuantity>;
}
export type PortionUnit = 'g' | 'ml' | 'unidade' | 'fatia' | 'colher_sopa' |
  'colher_cha' | 'concha' | 'xicara' | 'copo' | 'pedaco' | 'porcao' | 'scoop';
export interface Portion {
  id: string;
  label: string;
  amount: number;
  unit: PortionUnit;
  /** Total mass/volume for amount, not mass/volume per one unit. No ml=g assumption. */
  grams?: number;
  milliliters?: number;
}
export interface HouseholdMeasure extends Portion {
  unit: Exclude<PortionUnit, 'g' | 'ml'>;
}
export interface Food {
  /** Stable provider-scoped ID. Display names are never identity keys. */
  id: string;
  name: string;
  aliases: string[];
  category?: string;
  brand?: string;
  /** String preserves leading zeros. */
  barcode?: string;
  nutritionPer100g: Nutrition;
  portions: Portion[];
  householdMeasures: HouseholdMeasure[];
  source: FoodSource;
  externalProvider?: Exclude<FoodProviderId, 'somma'>;
  externalId?: string;
  metadata?: {
    sourceRecordId?: string;
    sourceVersion?: string;
    sourceUrl?: string;
    retrievedAt?: string;
    verified?: boolean;
    notes?: string;
    originalName?: string;
    sourceLicenseId?: string;
    sourceSha256?: string;
    /** Workbook sheet/cell for each imported nutrient, including absent values. */
    sourceLocations?: Record<string, string>;
    nutrientStatus?: Record<string, 'trace' | 'notApplicable' | 'notAnalyzed' | 'underReview' | 'invalidSourceValue'>;
  };
}
export interface FoodSearchOptions {
  page?: number;
  limit?: number;
  category?: string;
  signal?: AbortSignal;
}
export interface FoodSearchResult {
  items: Food[];
  provider: FoodProviderId;
  page: number;
  limit: number;
  total?: number;
  hasNextPage: boolean;
}
export interface IFoodProvider {
  readonly providerId: FoodProviderId;
  readonly displayName: string;
  search(query: string, options?: FoodSearchOptions): Promise<FoodSearchResult>;
  getById(id: string, signal?: AbortSignal): Promise<Food | null>;
  /** Capability is absent if unsupported. null means not found; errors must reject. */
  getByBarcode?(barcode: string, signal?: AbortSignal): Promise<Food | null>;
}
/** Future adapters only: no implementation, HTTP client or credentials in this stage. */
export interface FatSecretProviderContract extends IFoodProvider {
  readonly providerId: 'fatsecret';
}
export interface OpenFoodFactsProviderContract extends IFoodProvider {
  readonly providerId: 'openfoodfacts';
}
export type FoodInputMethod = 'search' | 'barcode' | 'text' | 'voice' |
  'package_photo' | 'label_photo' | 'plate_photo';
/** Future AI emits a lookup proposal; resolving a provider record precedes logging. */
export interface FoodLookupProposal {
  inputMethod: FoodInputMethod;
  query?: string;
  barcode?: string;
  reference?: { provider: FoodProviderId; id: string };
}
