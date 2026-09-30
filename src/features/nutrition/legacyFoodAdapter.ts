import type { FoodItem, MealFoodEntry } from '../../types';
import type { Food, Nutrition } from './food';
import { immutableCopy, type NutritionSnapshot } from './nutritionSnapshot';
import taxonomy from '../../data/nutrition/somma-foods-taxonomy.json';

type MacroKey = 'calories' | 'protein' | 'carbs' | 'fats';
export type LegacyMacros = { [K in MacroKey]?: number };
export type CatalogFoodItem = Omit<FoodItem, 'category' | MacroKey | 'fiber'> & LegacyMacros & {
  category: string; fiber?: number;
};
export function roundNutrient(value: number | undefined, digits = 1): number | undefined {
  return value === undefined ? undefined : Number(value.toFixed(digits));
}
/** Presentation only; the dash is never a numeric fallback. */
export function displayNutrient(value: number | undefined, digits = 1): string {
  return value === undefined ? '—' : String(roundNutrient(value, digits));
}
export function toLegacyMacros(n: Nutrition, rounded = true): LegacyMacros {
  const values: LegacyMacros = {};
  const pairs = [['calories', n.calories], ['protein', n.protein],
    ['carbs', n.carbohydrates], ['fats', n.fat]] as const;
  for (const [key, value] of pairs)
    if (value !== undefined) values[key] = rounded ? roundNutrient(value, key === 'calories' ? 0 : 1) : value;
  return values;
}
export function toLegacyFoodItem(food: Food): CatalogFoodItem {
  return { id: food.id, name: food.name,
    category: taxonomy.categories.find(c => c.id === food.category)?.label ?? food.category ?? 'Sem categoria',
    servingSize: 100, servingUnit: 'g', ...toLegacyMacros(food.nutritionPer100g),
    ...(food.nutritionPer100g.fiber === undefined ? {} : { fiber: roundNutrient(food.nutritionPer100g.fiber) }),
  };
}
export function toMealFoodEntry(snapshot: NutritionSnapshot, id = `mfe-${crypto.randomUUID()}`): MealFoodEntry {
  return { id, foodId: snapshot.foodId, name: snapshot.displayName,
    portion: snapshot.grams, portionUnit: 'g', portionDisplay: `${snapshot.grams}g`,
    ...toLegacyMacros(snapshot.nutrients), snapshot: immutableCopy(snapshot),
  };
}
/** New entries use exact captured values; legacy entries retain their stored values. */
export function sumMealNutrition(entries: readonly MealFoodEntry[]): LegacyMacros {
  const total: LegacyMacros = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  for (const entry of entries) {
    const n = entry.snapshot ? toLegacyMacros(entry.snapshot.nutrients, false) : entry;
    for (const key of ['calories', 'protein', 'carbs', 'fats'] as const)
      total[key] = total[key] === undefined || n[key] === undefined ? undefined : total[key]! + n[key]!;
  }
  return total;
}
export function nutrientPercent(value: number | undefined, target: number): number | undefined {
  if (value === undefined || !Number.isFinite(target) || target <= 0) return undefined;
  return Math.min(100, Math.max(0, Math.round(value / target * 100)));
}
export function remainingNutrient(value: number | undefined, target: number): number | undefined {
  return value === undefined ? undefined : Math.max(0, target - value);
}
