import { pb } from '@/lib/pocketbase'
import type { Artist } from '@/lib/collections/music/artists'
import type { Album } from '@/lib/collections/music/albums'

export const TRACK_GENRES = ['pop', 'rock', 'electronic', 'jazz', 'hip hop', 'soundtrack', 'other'] as const
export type TrackGenre = (typeof TRACK_GENRES)[number]

export interface Track {
  id: string
  title: string
  artist: string[]
  album?: string
  cover?: string
  genre?: TrackGenre
  duration?: number
  score?: number
  scrobbles?: number
  notes?: string
  favorite?: boolean
  created: string
  updated: string
  expand?: { artist?: Artist[]; album?: Album }
}

export interface TrackInput {
  title: string
  artist: string[]
  album?: string
  cover?: File | null
  genre?: TrackGenre
  duration?: number
  score?: number
  scrobbles?: number
  notes?: string
  favorite?: boolean
}

const collection = () => pb.collection('tracks')

export const tracks = {
  list: () => collection().getFullList<Track>({ expand: 'artist,album', sort: '-created' }),
  create: (data: TrackInput) => collection().create<Track>(data),
  update: (id: string, data: Partial<TrackInput>) => collection().update<Track>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (item: Track) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
}
