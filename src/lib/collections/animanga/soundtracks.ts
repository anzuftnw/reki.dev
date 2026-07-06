import { makeListCollection } from '@/lib/collections/base'

export interface SoundtrackItem {
  id: string
  title: string
  series: string
  score: number
}

export const soundtracks = makeListCollection<SoundtrackItem>('soundtracks')
