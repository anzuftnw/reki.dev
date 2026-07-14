// Shared between Anime and Manga -- both use the identical genre list.
export const MEDIA_GENRES = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'ecchi',
  'fantasy',
  'horror',
  'mahou shoujo',
  'mecha',
  'music',
  'mystery',
  'psychological',
  'romance',
  'sci-fi',
  'slice of life',
  'sports',
  'supernatural',
  'thriller',
] as const
export type MediaGenre = (typeof MEDIA_GENRES)[number]
