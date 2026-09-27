import taxonomy from '../../data/somma/somma-exercises-taxonomy-categorized.json';
import type { ExternalExerciseResult } from '../../types';
import type { NormalizedExternalCatalogResponse } from './types';
import type { CatalogQuery, SommaDatasetExercise, SommaTerm } from './sommaDatasetTypes';

export const SOMMA_CATALOG_SIZE = 1324;
export const sommaFilterOptions = taxonomy;
export const normalizeSommaSearch = (text: string): string => text
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').trim();

const defaultLoader = async (): Promise<SommaDatasetExercise[]> =>
  (await import('../../data/somma/somma-exercises-ptbr-categorized.json')).default;

export function adaptSommaExercise(record: SommaDatasetExercise): ExternalExerciseResult {
  return {
    provider: 'somma',
    externalId: record.id,
    name: record.name,
    originalName: record.originalName,
    bodyPart: record.bodyPart.label,
    target: record.target.label,
    equipment: record.equipment.label,
    secondaryMuscles: record.secondaryMuscles.map(term => term.label),
    instructions: [...record.instructionSteps.ptBr],
    instructionText: record.instructions.ptBr,
    // Media paths are preserved in the source, but assets have not been supplied.
  };
}

function matchesTerm(term: SommaTerm, value?: string): boolean {
  if (!value || value === 'Todos' || value === 'all') return true;
  const query = normalizeSommaSearch(value);
  return normalizeSommaSearch(term.key) === query || normalizeSommaSearch(term.label) === query;
}

export class InvalidSommaCursorError extends Error {}

/** Lazy-loaded local catalog. A rejected load is retryable and never cached as empty. */
export class SommaDatasetProvider {
  private pending?: Promise<SommaDatasetExercise[]>;
  private byId = new Map<string, SommaDatasetExercise>();
  private searchText = new Map<string, string>();

  constructor(private readonly loader = defaultLoader) {}

  private async load(): Promise<SommaDatasetExercise[]> {
    if (!this.pending) {
      this.pending = this.loader().then(records => {
        if (records.length !== SOMMA_CATALOG_SIZE || new Set(records.map(r => r.id)).size !== records.length) {
          throw new Error('Catálogo SOMMA inválido: quantidade ou IDs inconsistentes.');
        }
        this.byId = new Map(records.map(record => [record.id, record]));
        this.searchText = new Map(records.map(record => [record.id, normalizeSommaSearch([
          record.id, record.name, record.originalName, ...record.aliasesPtBr, ...record.aliasesEn,
          record.searchText, record.bodyPart.key, record.target.key, record.equipment.key,
        ].join(' '))]));
        return records;
      }).catch(error => {
        this.pending = undefined;
        throw error;
      });
    }
    return this.pending;
  }

  async getById(id: string, signal?: AbortSignal): Promise<ExternalExerciseResult | null> {
    signal?.throwIfAborted();
    await this.load();
    signal?.throwIfAborted();
    const record = this.byId.get(id);
    return record ? adaptSommaExercise(record) : null;
  }

  async search(options: CatalogQuery = {}, signal?: AbortSignal): Promise<NormalizedExternalCatalogResponse> {
    signal?.throwIfAborted();
    const records = await this.load();
    signal?.throwIfAborted();
    const terms = normalizeSommaSearch(options.query || '').split(' ').filter(Boolean);
    const filtered = records.filter(record =>
      terms.every(term => this.searchText.get(record.id)!.includes(term)) &&
      matchesTerm(record.bodyPart, options.bodyPart) &&
      matchesTerm(record.equipment, options.equipment) &&
      matchesTerm(record.target, options.targetMuscle) &&
      matchesTerm(record.libraryCategory, options.libraryCategory) &&
      matchesTerm(record.activityType, options.activityType) &&
      matchesTerm(record.environment, options.environment) &&
      (!options.collection || options.collection === 'Todos' || options.collection === 'all' ||
        record.collections.some(term => matchesTerm(term, options.collection)))
    );
    const queryKey = JSON.stringify([
      options.query || '', options.bodyPart || '', options.equipment || '', options.targetMuscle || '',
      options.libraryCategory || '', options.activityType || '', options.environment || '', options.collection || '',
    ]);
    let offset = 0;
    if (options.after) {
      try {
        const cursor = JSON.parse(decodeURIComponent(options.after.slice('somma:'.length)));
        if (!options.after.startsWith('somma:') || cursor.query !== queryKey ||
          !Number.isInteger(cursor.offset) || cursor.offset < 0 || cursor.offset > filtered.length) throw new Error();
        offset = cursor.offset;
      } catch {
        throw new InvalidSommaCursorError('Cursor SOMMA inválido para esta busca.');
      }
    }
    const limit = Math.max(1, Math.min(100, Math.floor(options.limit || 20)));
    const page = filtered.slice(offset, offset + limit);
    const end = offset + page.length;
    return {
      exercises: page.map(adaptSommaExercise),
      total: filtered.length,
      hasNextPage: end < filtered.length,
      nextCursor: end < filtered.length
        ? `somma:${encodeURIComponent(JSON.stringify({ query: queryKey, offset: end }))}` : undefined,
    };
  }
}

export const sommaDatasetProvider = new SommaDatasetProvider();
