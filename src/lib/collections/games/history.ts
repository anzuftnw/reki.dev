import { pb } from '@/lib/pocketbase'

export interface GameHistoryEntry {
  id: string
  game: string
  category: string
  occurredAt: string
  label: string
  rarity?: number
  isFeatured?: boolean
  meta?: Record<string, unknown>
  notes?: string
  created: string
  updated: string
}

export interface GameHistoryEntryInput {
  game: string
  category: string
  occurredAt: string
  label: string
  rarity?: number
  isFeatured?: boolean
  meta?: Record<string, unknown>
  notes?: string
}

const collection = () => pb.collection('game_history_entries')

export const gameHistory = {
  listByCategory: (game: string, category: string) =>
    collection().getFullList<GameHistoryEntry>({
      filter: pb.filter('game = {:game} && category = {:category}', { game, category }),
      sort: '-occurredAt',
    }),
  create: (data: GameHistoryEntryInput) => collection().create<GameHistoryEntry>(data),
  update: (id: string, data: Partial<GameHistoryEntryInput>) => collection().update<GameHistoryEntry>(id, data),
  remove: (id: string) => collection().delete(id),
}
