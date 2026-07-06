import { makeListCollection } from '@/lib/collections/base'

export interface AlbumItem {
  id: string
  title: string
  artist: string
  scrobbles: number
  score: number
}

export const albums = makeListCollection<AlbumItem>('albums')
