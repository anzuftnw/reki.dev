import { createResource, For, Show } from 'solid-js'
import type { IconTypes } from 'solid-icons'
import { TbOutlineListDetails, TbOutlineMicrophone2, TbOutlinePlaylist } from 'solid-icons/tb'
import { StatBlock } from '@/components/ui/StatBlock'
import { StatLinkCard } from '@/components/ui/StatLinkCard'
import { PageBanner } from '@/components/ui/PageBanner'
import { useUI } from '@/context/UIContext'
import { artists } from '@/lib/collections/music/artists'
import { albums } from '@/lib/collections/music/albums'
import { tracks } from '@/lib/collections/music/tracks'

interface SectionSummary {
  href: string
  icon: IconTypes
  label: string
  items: Array<{ favorite?: boolean; scrobbles?: number }> | undefined
}

export default function Music() {
  const { contentWidth } = useUI()
  const isCentered = () => contentWidth() === 'centered'
  const [artistList] = createResource(() => artists.list())
  const [albumList] = createResource(() => albums.list())
  const [trackList] = createResource(() => tracks.list())

  const sections = (): SectionSummary[] => [
    { href: '/music/artists', icon: TbOutlineMicrophone2, label: 'Artists', items: artistList() },
    { href: '/music/albums', icon: TbOutlinePlaylist, label: 'Albums', items: albumList() },
    { href: '/music/tracks', icon: TbOutlineListDetails, label: 'Tracks', items: trackList() },
  ]

  const totalEntries = () => sections().reduce((sum, s) => sum + (s.items?.length ?? 0), 0)
  const totalFavorites = () =>
    sections().reduce((sum, s) => sum + (s.items?.filter((i) => i.favorite).length ?? 0), 0)
  const totalScrobbles = () =>
    sections().reduce((sum, s) => sum + (s.items?.reduce((n, i) => n + (i.scrobbles ?? 0), 0) ?? 0), 0)

  return (
    <section class="flex flex-col gap-6">
      <PageBanner title="Music" subtitle="Artists, albums, and tracks on rotation." />

      <Show when={isCentered()}>
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-semibold text-text-1">Music</h1>
          <p class="text-text-3">Artists, albums, and tracks on rotation.</p>
        </div>
      </Show>

      <StatBlock
        stats={[
          { label: 'Total entries', value: totalEntries() },
          { label: 'Favorites', value: totalFavorites() },
          { label: 'Scrobbles', value: totalScrobbles().toLocaleString() },
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
