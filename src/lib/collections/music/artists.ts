import { pb } from '@/lib/pocketbase'
import { RANK_VALUES, type Rank } from '@/lib/collections/shared'

export { RANK_VALUES as ARTIST_RANKS }

export interface Artist {
  id: string
  name: string
  cover?: string
  rank?: Rank
  scrobbles?: number
  lastfmUrl?: string
  notes?: string
  favorite?: boolean
  created: string
  updated: string
}

export interface ArtistInput {
  name: string
  cover?: File | null
  rank?: Rank
  scrobbles?: number
  lastfmUrl?: string
  notes?: string
  favorite?: boolean
}

const collection = () => pb.collection('artists')

export const artists = {
  list: () => collection().getFullList<Artist>({ sort: '-created' }),
  create: (data: ArtistInput) => collection().create<Artist>(data),
  update: (id: string, data: Partial<ArtistInput>) => collection().update<Artist>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (item: Artist) => (item.cover ? pb.files.getURL(item, item.cover, { thumb: '400x0' }) : null),
}
