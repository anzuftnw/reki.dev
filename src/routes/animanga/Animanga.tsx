import { createResource, For, Show } from 'solid-js'
import type { IconTypes } from 'solid-icons'
import { TbOutlineBook2, TbOutlineDisc, TbOutlineMovie, TbOutlineMusic, TbOutlineUsers, TbOutlineVinyl } from 'solid-icons/tb'
import { StatBlock } from '@/components/ui/StatBlock'
import { StatLinkCard } from '@/components/ui/StatLinkCard'
import { PageBanner } from '@/components/ui/PageBanner'
import { useUI } from '@/context/UIContext'
import { anime } from '@/lib/collections/animanga/anime'
import { manga } from '@/lib/collections/animanga/manga'
import { characters } from '@/lib/collections/animanga/characters'
import { openings } from '@/lib/collections/animanga/openings'
import { endings } from '@/lib/collections/animanga/endings'
import { soundtracks } from '@/lib/collections/animanga/soundtracks'

interface SectionSummary {
  href: string
  icon: IconTypes
  label: string
  items: Array<{ favorite?: boolean }> | undefined
}

export default function Animanga() {
  const { contentWidth } = useUI()
  const isCentered = () => contentWidth() === 'centered'
  const [animeList] = createResource(() => anime.list())
  const [mangaList] = createResource(() => manga.list())
  const [characterList] = createResource(() => characters.list())
  const [openingList] = createResource(() => openings.list())
  const [endingList] = createResource(() => endings.list())
  const [soundtrackList] = createResource(() => soundtracks.list())

  const sections = (): SectionSummary[] => [
    { href: '/anime', icon: TbOutlineMovie, label: 'Anime', items: animeList() },
    { href: '/manga', icon: TbOutlineBook2, label: 'Manga', items: mangaList() },
    { href: '/characters', icon: TbOutlineUsers, label: 'Characters', items: characterList() },
    { href: '/openings', icon: TbOutlineMusic, label: 'Openings', items: openingList() },
    { href: '/endings', icon: TbOutlineVinyl, label: 'Endings', items: endingList() },
    { href: '/soundtracks', icon: TbOutlineDisc, label: 'Soundtracks', items: soundtrackList() },
  ]

  const totalEntries = () => sections().reduce((sum, s) => sum + (s.items?.length ?? 0), 0)
  const totalFavorites = () =>
    sections().reduce((sum, s) => sum + (s.items?.filter((i) => i.favorite).length ?? 0), 0)

  return (
    <section class="flex flex-col gap-6">
      <PageBanner title="Animanga" subtitle="Anime, manga, and everything around them." />

      <Show when={isCentered()}>
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-semibold text-text-1">Animanga</h1>
          <p class="text-text-3">Anime, manga, and everything around them.</p>
        </div>
      </Show>

      <StatBlock
        stats={[
          { label: 'Total entries', value: totalEntries() },
          { label: 'Favorites', value: totalFavorites() },
        ]}
      />

      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        <For each={sections()}>
          {(s) => <StatLinkCard href={s.href} icon={s.icon} label={s.label} stat={`${s.items?.length ?? 0} entries`} />}
        </For>
      </div>
    </section>
  )
}
