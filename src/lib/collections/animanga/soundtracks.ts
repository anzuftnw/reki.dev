import { makeThemeSongCollection, type ThemeSong, type ThemeSongInput } from '@/lib/collections/animanga/themeSong'

export type { ThemeSong as Soundtrack, ThemeSongInput as SoundtrackInput }
export const soundtracks = makeThemeSongCollection('soundtracks')
