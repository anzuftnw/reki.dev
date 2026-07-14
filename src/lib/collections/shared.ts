// Shared across Characters (animanga) and Artists (music) -- both use the same SS-F tier scale.
export const RANK_VALUES = ['SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F'] as const
export type Rank = (typeof RANK_VALUES)[number]
