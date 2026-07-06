import { makeListCollection } from '@/lib/collections/base'

export interface TrackItem {
  id: string
  title: string
  artist: string
  album?: string
  scrobbles: number
  score: number
}

export const tracks = makeListCollection<TrackItem>('tracks')
