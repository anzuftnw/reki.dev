import { makeListCollection } from '@/lib/collections/base'

export interface OpeningItem {
  id: string
  title: string
  series: string
  score: number
}

export const openings = makeListCollection<OpeningItem>('openings')
