import { createMemo, createResource, Show } from 'solid-js'
import { GenericTeamsTab, type SlotOption } from '@/templates/workspace/GenericTeamsTab'
import { arknightsCollection, arknightsOperators } from '@/lib/collections/games/arknights'

export function ArknightsTeamsTab() {
  const [owned] = createResource(() => arknightsCollection.listOwned())

  const slotOptions = createMemo<SlotOption[]>(() =>
    (owned() ?? [])
      .filter((e) => e.expand?.operator)
      .map((e) => ({ id: e.expand!.operator!.id, label: e.expand!.operator!.name })),
  )

  const operatorById = createMemo(() => {
    const map = new Map<string, { name: string; cover: string | null }>()
    for (const entry of owned() ?? []) {
      const op = entry.expand?.operator
      if (op) map.set(op.id, { name: op.name, cover: arknightsOperators.coverUrl(op) })
    }
    return map
  })

  return (
    <GenericTeamsTab
      config={{
        game: 'arknights',
        refCollection: 'arknights_operators',
        slotOptions: () => slotOptions(),
        renderSlot: (slot) => {
          const op = operatorById().get(slot.refId)
          return (
            <div class="flex items-center gap-2 rounded-lg border border-border bg-surface-2 py-1 pr-2 pl-1">
              <Show when={op?.cover}>{(url) => <img src={url()} alt="" class="size-6 rounded object-cover" />}</Show>
              <span class="text-xs text-text-1">{op?.name ?? 'Unknown'}</span>
              <Show when={slot.role}>
                <span class="text-2xs text-text-3">{slot.role}</span>
              </Show>
            </div>
          )
        },
      }}
    />
  )
}
