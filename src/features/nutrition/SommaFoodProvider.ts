import type { Food, FoodSearchOptions, FoodSearchResult, IFoodProvider } from './food';
import catalog from '../../data/nutrition/somma-foods-br.json';

const normalize = (value: string) => value.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

/** Local-only TACO catalog by default. Explicit injection (including []) remains supported. */
export class SommaFoodProvider implements IFoodProvider {
  readonly providerId = 'somma' as const;
  readonly displayName = 'SOMMA Foods';
  private readonly foods: Food[];

  constructor(catalog: readonly Food[] = defaultCatalog) {
    const ids = new Set<string>();
    for (const food of catalog) {
      if (!food.id.trim() || !food.name.trim() || ids.has(food.id)) {
        throw new Error('Catálogo alimentar inválido: nome ou ID ausente/duplicado.');
      }
      if (food.externalProvider || !['somma', 'taco', 'pof', 'custom'].includes(food.source)) {
        throw new Error('O catálogo local não aceita registros de providers externos.');
      }
      ids.add(food.id);
      for (const [key, value] of Object.entries(food.nutritionPer100g)) {
        if (key === 'micronutrients' || value === undefined) continue;
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
          throw new Error(`Nutriente inválido: ${key}`);
        }
      }
      for (const nutrient of Object.values(food.nutritionPer100g.micronutrients ?? {})) {
        if (!Number.isFinite(nutrient.value) || nutrient.value < 0 || !['g', 'mg', 'µg'].includes(nutrient.unit)) {
          throw new Error('Micronutriente inválido.');
        }
      }
      for (const portion of [...food.portions, ...food.householdMeasures]) {
        if (!portion.id.trim() || !portion.label.trim() || !Number.isFinite(portion.amount) || portion.amount <= 0 ||
          [portion.grams, portion.milliliters].some(value => value !== undefined && (!Number.isFinite(value) || value <= 0))) {
          throw new Error('Porção inválida.');
        }
      }
    }
    this.foods = structuredClone([...catalog]);
  }

  async search(query: string, options: FoodSearchOptions = {}): Promise<FoodSearchResult> {
    options.signal?.throwIfAborted();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
      !Number.isSafeInteger((page - 1) * limit)) throw new RangeError('Paginação inválida.');
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const matches = this.foods.filter(food => {
      const text = normalize([food.name, ...food.aliases, food.brand ?? ''].join(' '));
      return terms.every(term => text.includes(term)) &&
        (!options.category || normalize(food.category ?? '') === normalize(options.category));
    });
    const offset = (page - 1) * limit;
    return { items: structuredClone(matches.slice(offset, offset + limit)), provider: this.providerId,
      page, limit, total: matches.length, hasNextPage: offset + limit < matches.length };
  }

  async getById(id: string, signal?: AbortSignal): Promise<Food | null> {
    signal?.throwIfAborted();
    const food = this.foods.find(item => item.id === id);
    return food ? structuredClone(food) : null;
  }
}

// JSON literals widen units/source to string; import and validation tests check the boundary.
const defaultCatalog = catalog as unknown as Food[];
