import { pb } from '@/lib/pocketbase'
import { RANK_VALUES, type Rank } from '@/lib/collections/shared'

export const CHARACTER_GENDERS = ['male', 'female', 'other'] as const
export type CharacterGender = (typeof CHARACTER_GENDERS)[number]

export { RANK_VALUES as CHARACTER_RANKS }

export interface Character {
  id: string
  name: string
  gender: CharacterGender
  dateOfBirth?: string
  cover?: string
  rank: Rank
  anilistId?: number
  notes?: string
  favorite?: boolean
  created: string
  updated: string
}

export interface CharacterInput {
  name: string
  gender: CharacterGender
  dateOfBirth?: string | null
  cover?: File | null
  rank: Rank
  anilistId?: number
  notes?: string
  favorite?: boolean
}

const collection = () => pb.collection('characters')

export const characters = {
  list: () => collection().getFullList<Character>({ sort: '-created' }),
  create: (data: CharacterInput) => collection().create<Character>(data),
  update: (id: string, data: Partial<CharacterInput>) => collection().update<Character>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (item: Character) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
}
