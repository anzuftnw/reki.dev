import { makeThemeSongCollection, type ThemeSong, type ThemeSongInput } from '@/lib/collections/animanga/themeSong'

export type { ThemeSong as Opening, ThemeSongInput as OpeningInput }
export const openings = makeThemeSongCollection('openings')
