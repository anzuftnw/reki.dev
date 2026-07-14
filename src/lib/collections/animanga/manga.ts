import { pb } from '@/lib/pocketbase'
import { MEDIA_GENRES, type MediaGenre } from '@/lib/collections/animanga/shared'

export const MANGA_FORMATS = ['manga', 'manhwa', 'manhua', 'light novel', 'one-shot'] as const
export type MangaFormat = (typeof MANGA_FORMATS)[number]

export const MANGA_STATUSES = ['reading', 'rereading', 'completed', 'on hold', 'dropped', 'plan to read'] as const
export type MangaStatus = (typeof MANGA_STATUSES)[number]

export { MEDIA_GENRES }
export type { MediaGenre }

export interface Manga {
  id: string
  title: string
  year: number
  format: MangaFormat
  chapters: number
  volumes: number
  genres: MediaGenre[]
  cover?: string
  status: MangaStatus
  score?: number
  chaptersRead?: number
  volumesRead?: number
  startDate?: string
  endDate?: string
  rereadCount?: number
  anilistId?: number
  notes?: string
  favorite?: boolean
  created: string
  updated: string
}

export interface MangaInput {
  title: string
  year: number
  format: MangaFormat
  chapters: number
  volumes: number
  genres: MediaGenre[]
  cover?: File | null
  status: MangaStatus
  score?: number
  chaptersRead?: number
  volumesRead?: number
  startDate?: string | null
  endDate?: string | null
  rereadCount?: number
  anilistId?: number
  notes?: string
  favorite?: boolean
}

const collection = () => pb.collection('manga')

export const manga = {
  list: () => collection().getFullList<Manga>({ sort: '-created' }),
  create: (data: MangaInput) => collection().create<Manga>(data),
  update: (id: string, data: Partial<MangaInput>) => collection().update<Manga>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (item: Manga) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
}
