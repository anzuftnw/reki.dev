import { pb } from '@/lib/pocketbase'

export type GameStatus = 'active' | 'paused' | 'retired'

export interface Game {
  id: string
  slug: string
  name: string
  cover?: string
  tagline?: string
  order?: number
  status: GameStatus
  created: string
  updated: string
}

export interface GameInput {
  slug: string
  name: string
  cover?: File | null
  tagline?: string
  order?: number
  status: GameStatus
}

const collection = () => pb.collection('games')

export const games = {
  list: () => collection().getFullList<Game>({ sort: '+order,name' }),
  getBySlug: (slug: string) => collection().getFirstListItem<Game>(pb.filter('slug = {:slug}', { slug })),
  create: (data: GameInput) => collection().create<Game>(data),
  update: (id: string, data: Partial<GameInput>) => collection().update<Game>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (game: Game) => (game.cover ? pb.files.getURL(game, game.cover, { thumb: '800x0' }) : null),
}
