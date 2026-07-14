import { pb } from '@/lib/pocketbase'

// Openings/Endings/Soundtracks share an identical schema (per their PocketBase migrations) --
// one factory instead of three copy-pasted CRUD modules.
export interface ThemeSong {
  id: string
  title: string
  artist: string
  anime: string
  slot: number
  cover?: string
  youtubeUrl?: string
  audioFile?: string
  score?: number
  notes?: string
  favorite?: boolean
  created: string
  updated: string
}

export interface ThemeSongInput {
  title: string
  artist: string
  anime: string
  slot: number
  cover?: File | null
  youtubeUrl?: string
  audioFile?: File | null
  score?: number
  notes?: string
  favorite?: boolean
}

export function makeThemeSongCollection(name: 'openings' | 'endings' | 'soundtracks') {
  const collection = () => pb.collection(name)

  return {
    list: () => collection().getFullList<ThemeSong>({ sort: '-created' }),
    create: (data: ThemeSongInput) => collection().create<ThemeSong>(data),
    update: (id: string, data: Partial<ThemeSongInput>) => collection().update<ThemeSong>(id, data),
    remove: (id: string) => collection().delete(id),
    coverUrl: (item: ThemeSong) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
    audioUrl: (item: ThemeSong) => (item.audioFile ? pb.files.getURL(item, item.audioFile) : null),
  }
}
