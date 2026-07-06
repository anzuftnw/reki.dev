import { pb } from '@/lib/pocketbase'

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface TierEntry {
  id: string
  tier: Tier
  position: number
  label: string
  imageUrl?: string
  // Optional pointer back to where this entry came from (e.g. { collection: 'anime', id: '...' }).
  // Absent for freeform entries with no corresponding record elsewhere on the site.
  sourceCollection?: string
  sourceId?: string
}

export interface Tierlist {
  id: string
  title: string
  entries: TierEntry[]
}

const collection = () => pb.collection('tierlists')

export const tierlists = {
  list: () => collection().getFullList<Tierlist>({ sort: '-created' }),
  get: (id: string) => collection().getOne<Tierlist>(id),
  create: (data: Partial<Tierlist>) => collection().create<Tierlist>(data),
  update: (id: string, data: Partial<Tierlist>) => collection().update<Tierlist>(id, data),
  remove: (id: string) => collection().delete(id),
}
