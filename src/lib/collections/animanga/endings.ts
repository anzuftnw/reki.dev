import { makeListCollection } from '@/lib/collections/base'

export interface EndingItem {
  id: string
  title: string
  series: string
  score: number
}

export const endings = makeListCollection<EndingItem>('endings')
