import { createMemo, createResource, For, Show } from 'solid-js'
import { StatBlock } from '@/components/ui/StatBlock'
import { arknightsCollection, arknightsOperators } from '@/lib/collections/games/arknights'

export function ArknightsOverviewTab() {
  const [owned] = createResource(() => arknightsCollection.listOwned())
  const [roster] = createResource(() => arknightsOperators.list())

  const stats = createMemo(() => {
    const ownedList = owned() ?? []
    const rosterList = roster() ?? []
    const sixStarOwned = ownedList.filter((e) => e.expand?.operator?.rarity === 6).length
    const sixStarTotal = rosterList.filter((o) => o.rarity === 6).length
    const maxPotential = ownedList.filter((e) => e.potential >= 6).length
    return [
      { label: 'Operators owned', value: `${ownedList.length} / ${rosterList.length}` },
      { label: '6★ owned', value: `${sixStarOwned} / ${sixStarTotal}` },
      { label: 'Max potential', value: maxPotential },
      { label: 'Teams built', value: '—' },
    ]
  })

  const favorites = createMemo(() => (owned() ?? []).filter((e) => e.favorite))

  return (
    <div class="flex flex-col gap-6">
      <StatBlock stats={stats()} />

      <div class="flex flex-col gap-3">
        <h2 class="text-sm font-medium text-text-2">Favorites</h2>
        <Show
          when={favorites().length}
          fallback={<p class="text-sm text-text-3">No favorites marked yet — star an operator in the Collection tab.</p>}
        >
          <div class="flex flex-wrap gap-3">
            <For each={favorites()}>
              {(entry) => (
                <div class="flex items-center gap-2 rounded-lg border border-border bg-surface-1 py-2 pr-3 pl-2">
                  <Show when={arknightsOperators.coverUrl(entry.expand!.operator!)}>
                    {(url) => <img src={url()} alt="" class="size-8 rounded-md object-cover" />}
                  </Show>
                  <span class="text-sm text-text-1">{entry.expand?.operator?.name}</span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}
