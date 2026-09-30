import type { Food, FoodProviderId, FoodSource, Nutrition, Portion } from './food';
import type { FoodQuantity } from './nutritionCalculation';
export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
export type NutritionSnapshot = DeepReadonly<{
  schemaVersion: 1;
  foodId: string;
  provider: FoodProviderId;
  source: FoodSource;
  catalogVersion: string;
  capturedAt: string;
  displayName: string;
  category?: string;
  quantity: FoodQuantity;
  grams: number;
  massReference?: Portion;
  nutritionPer100g: Nutrition;
  nutrients: Nutrition;
  provenance?: Food['metadata'];
}>;
/** Independent JSON-compatible value, recursively frozen. */
export function immutableCopy<T>(value: T): DeepReadonly<T> {
  const copy = structuredClone(value);
  const freeze = (node: unknown): void => {
    if (node && typeof node === 'object') { Object.values(node).forEach(freeze); Object.freeze(node); }
  };
  freeze(copy);
  return copy as DeepReadonly<T>;
}
