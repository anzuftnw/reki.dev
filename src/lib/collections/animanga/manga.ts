import { makeListCollection } from '@/lib/collections/base'

export type ReadStatus = 'reading' | 'completed' | 'paused' | 'dropped' | 'planning'

export interface MangaItem {
  id: string
  title: string
  score: number
  status: ReadStatus
}

export const manga = makeListCollection<MangaItem>('manga')
