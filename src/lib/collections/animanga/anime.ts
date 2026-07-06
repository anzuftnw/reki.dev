import { makeListCollection } from '@/lib/collections/base'

export type WatchStatus = 'watching' | 'completed' | 'paused' | 'dropped' | 'planning'

export interface AnimeItem {
  id: string
  title: string
  score: number
  status: WatchStatus
}

export const anime = makeListCollection<AnimeItem>('anime')
