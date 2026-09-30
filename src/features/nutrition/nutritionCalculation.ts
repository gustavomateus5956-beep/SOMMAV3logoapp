import type { Food, Nutrition, Portion, PortionUnit } from './food';

export interface FoodQuantity {
  amount: number;
  unit: PortionUnit;
  /** Required outside g; the portion must belong to this exact food. */
  portionId?: string;
}
export interface ResolvedQuantity {
  quantity: FoodQuantity;
  grams: number;
  massReference?: Portion;
}
function positive(value: number, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0)
    throw new RangeError(`${label} deve ser um número finito maior que zero.`);
  return value;
}
/** Resolve only food-specific recorded mass. No density or generic household assumptions. */
export function resolveFoodQuantity(food: Food, quantity: FoodQuantity): ResolvedQuantity {
  positive(quantity.amount, 'Quantidade');
  if (quantity.unit === 'g') {
    if (quantity.portionId) throw new RangeError('Quantidade em gramas não aceita uma porção adicional.');
    return { quantity: { ...quantity }, grams: quantity.amount };
  }
  const matches = [...food.portions, ...food.householdMeasures]
    .filter(p => p.id === quantity.portionId && p.unit === quantity.unit);
  if (!quantity.portionId || matches.length !== 1 || matches[0].grams === undefined)
    throw new RangeError('Esta medida não possui massa documentada para o alimento. Informe gramas.');
  const portion = matches[0];
  positive(portion.grams!, 'Massa da porção'); positive(portion.amount, 'Quantidade da porção');
  const grams = positive((quantity.amount / portion.amount) * portion.grams!, 'Massa calculada');
  return { quantity: { ...quantity }, grams, massReference: structuredClone(portion) };
}
/** No rounding here. Missing, trace and not-applicable values remain absent. */
export function calculateNutritionForGrams(per100g: Nutrition, grams: number): Nutrition {
  positive(grams, 'Quantidade em gramas');
  const result: Nutrition = {};
  const scale = (value: number) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0)
      throw new RangeError('Nutriente inválido na fonte.');
    const scaled = value * (grams / 100);
    if (!Number.isFinite(scaled)) throw new RangeError('Quantidade excede o limite de cálculo.');
    return scaled;
  };
  for (const key of Object.keys(per100g) as (keyof Nutrition)[]) {
    if (key === 'micronutrients') continue;
    const value = per100g[key];
    if (value !== undefined) result[key] = scale(value);
  }
  if (per100g.micronutrients !== undefined) {
    result.micronutrients = {};
    for (const [key, value] of Object.entries(per100g.micronutrients)) {
      if (!['g', 'mg', 'µg'].includes(value.unit)) throw new RangeError('Unidade de nutriente inválida.');
      result.micronutrients[key] = { value: scale(value.value), unit: value.unit };
    }
  }
  return result;
}
export function calculateFoodNutrition(food: Food, quantity: FoodQuantity) {
  const resolved = resolveFoodQuantity(food, quantity);
  return { ...resolved, nutrition: calculateNutritionForGrams(food.nutritionPer100g, resolved.grams) };
}
