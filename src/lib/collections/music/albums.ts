import { pb } from '@/lib/pocketbase'
import type { Artist } from '@/lib/collections/music/artists'

export interface Album {
  id: string
  title: string
  artist: string[]
  cover?: string
  releaseDate?: string
  score?: number
  scrobbles?: number
  notes?: string
  favorite?: boolean
  created: string
  updated: string
  expand?: { artist?: Artist[] }
}

export interface AlbumInput {
  title: string
  artist: string[]
  cover?: File | null
  releaseDate?: string | null
  score?: number
  scrobbles?: number
  notes?: string
  favorite?: boolean
}

const collection = () => pb.collection('albums')

export const albums = {
  list: () => collection().getFullList<Album>({ expand: 'artist', sort: '-created' }),
  create: (data: AlbumInput) => collection().create<Album>(data),
  update: (id: string, data: Partial<AlbumInput>) => collection().update<Album>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (item: Album) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
}
