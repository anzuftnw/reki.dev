import { makeListCollection } from '@/lib/collections/base'

export interface CharacterItem {
  id: string
  name: string
  series: string
  score: number
}

export const characters = makeListCollection<CharacterItem>('characters')
