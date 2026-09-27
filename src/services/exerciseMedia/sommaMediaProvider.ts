import manifest from '../../data/somma/somma-media-manifest.json';
import type { ExerciseMediaResult } from './types';

export interface SommaMediaSubject {
  id?: string;
  source?: string;
  provider?: string;
  externalId?: string;
  catalogRef?: { provider: string; id: string };
}

const mediaById = new Map(manifest.map(entry => [entry.id, entry]));

export function isSommaMediaSubject(subject: SommaMediaSubject): boolean {
  return subject.source === 'somma' || subject.catalogRef?.provider === 'somma' || subject.provider === 'somma';
}

/** Exact catalog identity only. Never interpret a SOMMA ID as an ExerciseDB ID. */
export function getSommaMedia(subject: SommaMediaSubject): ExerciseMediaResult {
  const id = subject.catalogRef?.provider === 'somma'
    ? subject.catalogRef.id
    : subject.provider === 'somma' ? subject.externalId : subject.id;
  const entry = id ? mediaById.get(id) : undefined;
  if (!entry) return { provider: 'somma', isAvailable: false };
  const imageUrl = entry.hasImage ? entry.image : undefined;
  const gifUrl = entry.hasGif ? entry.gif : undefined;
  return {
    provider: 'somma',
    thumbnailUrl: imageUrl,
    imageUrl,
    gifUrl,
    isAvailable: Boolean(imageUrl || gifUrl),
    sourceLabel: 'SOMMA Media',
  };
}

/** Selecting a URL does not fetch it. Static SOMMA views never fall back to GIF. */
export function selectExerciseMediaSource(media: ExerciseMediaResult | null, staticThumbnail: boolean): string | null {
  if (!media?.isAvailable) return null;
  if (media.provider === 'somma') {
    return staticThumbnail
      ? media.thumbnailUrl || media.imageUrl || null
      : media.gifUrl || media.imageUrl || media.thumbnailUrl || null;
  }
  return media.gifUrl || null;
}
