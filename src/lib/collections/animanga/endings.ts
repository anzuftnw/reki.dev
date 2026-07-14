import { makeThemeSongCollection, type ThemeSong, type ThemeSongInput } from '@/lib/collections/animanga/themeSong'

export type { ThemeSong as Ending, ThemeSongInput as EndingInput }
export const endings = makeThemeSongCollection('endings')
