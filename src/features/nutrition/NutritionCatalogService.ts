import type { Food, FoodSearchOptions, FoodSearchResult, IFoodProvider } from './food';
import { SommaFoodProvider } from './SommaFoodProvider';
import { calculateFoodNutrition, type FoodQuantity } from './nutritionCalculation';
import { immutableCopy, type NutritionSnapshot } from './nutritionSnapshot';
import summary from '../../data/nutrition/somma-foods-summary.json';
import taxonomy from '../../data/nutrition/somma-foods-taxonomy.json';

type ServiceConfig = { provider: IFoodProvider; catalogVersion: string };
export class NutritionCatalogService {
  private readonly provider: IFoodProvider;
  readonly catalogVersion: string;
  constructor(config?: ServiceConfig) {
    this.provider = config?.provider ?? new SommaFoodProvider();
    this.catalogVersion = config?.catalogVersion ?? summary.catalogVersion;
    if (this.provider.providerId !== 'somma' || !this.catalogVersion.trim())
      throw new Error('Este serviço aceita somente catálogo local versionado.');
  }
  getCategories(): { id: string; label: string }[] { return structuredClone(taxonomy.categories); }
  private checkSource(food: Food): void {
    if (food.externalProvider || !['taco', 'somma', 'custom'].includes(food.source))
      throw new Error('Fonte não habilitada nesta etapa.');
  }
  async search(query: string, options: FoodSearchOptions = {}): Promise<FoodSearchResult> {
    options.signal?.throwIfAborted();
    const result = await this.provider.search(query, options);
    options.signal?.throwIfAborted();
    result.items.forEach(food => this.checkSource(food));
    return structuredClone(result);
  }
  async getById(foodId: string, signal?: AbortSignal): Promise<Food | null> {
    signal?.throwIfAborted();
    const food = await this.provider.getById(foodId, signal);
    signal?.throwIfAborted();
    if (food) this.checkSource(food);
    return food ? structuredClone(food) : null;
  }
  /** Preview from the selected local record, without rounding. */
  calculateForFood(food: Food, quantity: FoodQuantity) {
    this.checkSource(food); return calculateFoodNutrition(food, quantity);
  }
  async calculate(foodId: string, quantity: FoodQuantity, signal?: AbortSignal) {
    const requestedQuantity = structuredClone(quantity);
    const food = await this.getById(foodId, signal);
    if (!food) throw new Error('Alimento não encontrado no catálogo.');
    return { food, ...this.calculateForFood(food, requestedQuantity) };
  }
  async createSnapshot(foodId: string, quantity: FoodQuantity, signal?: AbortSignal): Promise<NutritionSnapshot> {
    const calculation = await this.calculate(foodId, quantity, signal);
    signal?.throwIfAborted();
    const { food, nutrition, ...resolved } = calculation;
    return immutableCopy({ schemaVersion: 1 as const, foodId: food.id,
      provider: this.provider.providerId, source: food.source, catalogVersion: this.catalogVersion,
      capturedAt: new Date().toISOString(), displayName: food.name,
      ...(food.category ? { category: food.category } : {}), ...resolved,
      nutritionPer100g: food.nutritionPer100g, nutrients: nutrition,
      ...(food.metadata ? { provenance: food.metadata } : {}),
    });
  }
}
// Shared by modal instances. No remote provider or fallback is constructed.
export const nutritionCatalogService = new NutritionCatalogService();
