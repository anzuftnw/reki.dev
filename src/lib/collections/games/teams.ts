import { pb } from '@/lib/pocketbase'

export interface TeamSlot {
  refCollection: string
  refId: string
  role?: string
  extra?: Record<string, unknown>
}

export interface GameTeam {
  id: string
  game: string
  name: string
  slots: TeamSlot[]
  tags?: string[]
  favorite?: boolean
  notes?: string
  created: string
  updated: string
}

export interface GameTeamInput {
  game: string
  name: string
  slots: TeamSlot[]
  tags?: string[]
  favorite?: boolean
  notes?: string
}

const collection = () => pb.collection('game_teams')

export const gameTeams = {
  listByGame: (game: string) =>
    collection().getFullList<GameTeam>({ filter: pb.filter('game = {:game}', { game }), sort: '-created' }),
  create: (data: GameTeamInput) => collection().create<GameTeam>(data),
  update: (id: string, data: Partial<GameTeamInput>) => collection().update<GameTeam>(id, data),
  remove: (id: string) => collection().delete(id),
}
