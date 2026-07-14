import { pb } from '@/lib/pocketbase'
import { MEDIA_GENRES, type MediaGenre } from '@/lib/collections/animanga/shared'

export const ANIME_SEASONS = ['winter', 'spring', 'summer', 'fall'] as const
export type AnimeSeason = (typeof ANIME_SEASONS)[number]

export const ANIME_FORMATS = ['tv', 'tv short', 'movie', 'ova', 'ona', 'special', 'music'] as const
export type AnimeFormat = (typeof ANIME_FORMATS)[number]

export const ANIME_STATUSES = ['watching', 'rewatching', 'completed', 'on hold', 'dropped', 'plan to watch'] as const
export type AnimeStatus = (typeof ANIME_STATUSES)[number]

export { MEDIA_GENRES }
export type { MediaGenre }

export interface Anime {
  id: string
  title: string
  season: AnimeSeason
  year: number
  format: AnimeFormat
  episodes: number
  episodeLength: number
  genres: MediaGenre[]
  cover?: string
  status: AnimeStatus
  score?: number
  episodesWatched?: number
  startDate?: string
  endDate?: string
  rewatchCount?: number
  anilistId?: number
  notes?: string
  favorite?: boolean
  created: string
  updated: string
}

export interface AnimeInput {
  title: string
  season: AnimeSeason
  year: number
  format: AnimeFormat
  episodes: number
  episodeLength: number
  genres: MediaGenre[]
  cover?: File | null
  status: AnimeStatus
  score?: number
  episodesWatched?: number
  startDate?: string | null
  endDate?: string | null
  rewatchCount?: number
  anilistId?: number
  notes?: string
  favorite?: boolean
}

const collection = () => pb.collection('anime')

export const anime = {
  list: () => collection().getFullList<Anime>({ sort: '-created' }),
  create: (data: AnimeInput) => collection().create<Anime>(data),
  update: (id: string, data: Partial<AnimeInput>) => collection().update<Anime>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (item: Anime) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
}
