import { makeListCollection } from '@/lib/collections/base'

export interface ArtistItem {
  id: string
  name: string
  scrobbles: number
  rank: number
}

export const artists = makeListCollection<ArtistItem>('artists')
