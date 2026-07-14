import { pb } from '@/lib/pocketbase'

export type ArknightsProfession =
  | 'Vanguard'
  | 'Guard'
  | 'Defender'
  | 'Sniper'
  | 'Caster'
  | 'Medic'
  | 'Supporter'
  | 'Specialist'

export type ArknightsPosition = 'Melee' | 'Ranged'

export interface ArknightsOperator {
  id: string
  name: string
  rarity: number
  profession: ArknightsProfession
  subProfession: string
  position: ArknightsPosition
  cover?: string
  tags?: string[]
  created: string
  updated: string
}

export interface ArknightsOperatorInput {
  name: string
  rarity: number
  profession: ArknightsProfession
  subProfession: string
  position: ArknightsPosition
  cover?: File | null
  tags?: string[]
}

export interface ArknightsCollectionEntry {
  id: string
  operator: string
  elite: number
  level: number
  potential: number
  trust?: number
  skill1Level?: number
  skill1Mastery?: number
  skill2Level?: number
  skill2Mastery?: number
  skill3Level?: number
  skill3Mastery?: number
  module1Tier?: number
  module2Tier?: number
  skinsOwned?: string[]
  favorite?: boolean
  notes?: string
  acquiredAt?: string
  created: string
  updated: string
  expand?: { operator?: ArknightsOperator }
}

export interface ArknightsCollectionInput {
  operator: string
  elite: number
  level: number
  potential: number
  trust?: number
  skill1Level?: number
  skill1Mastery?: number
  skill2Level?: number
  skill2Mastery?: number
  skill3Level?: number
  skill3Mastery?: number
  module1Tier?: number
  module2Tier?: number
  skinsOwned?: string[]
  favorite?: boolean
  notes?: string
  acquiredAt?: string | null
}

const operatorCollection = () => pb.collection('arknights_operators')
const ownedCollection = () => pb.collection('arknights_collection')

export const arknightsOperators = {
  list: () => operatorCollection().getFullList<ArknightsOperator>({ sort: '-rarity,name' }),
  create: (data: ArknightsOperatorInput) => operatorCollection().create<ArknightsOperator>(data),
  update: (id: string, data: Partial<ArknightsOperatorInput>) =>
    operatorCollection().update<ArknightsOperator>(id, data),
  remove: (id: string) => operatorCollection().delete(id),
  coverUrl: (operator: ArknightsOperator) =>
    operator.cover ? pb.files.getURL(operator, operator.cover, { thumb: '400x0' }) : null,
}

export const arknightsCollection = {
  listOwned: () =>
    ownedCollection().getFullList<ArknightsCollectionEntry>({ expand: 'operator', sort: '-created' }),
  create: (data: ArknightsCollectionInput) => ownedCollection().create<ArknightsCollectionEntry>(data),
  update: (id: string, data: Partial<ArknightsCollectionInput>) =>
    ownedCollection().update<ArknightsCollectionEntry>(id, data),
  remove: (id: string) => ownedCollection().delete(id),
}
