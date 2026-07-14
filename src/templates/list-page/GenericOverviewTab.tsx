import { createMemo, For, Show } from 'solid-js'
import { StatBlock } from '@/components/ui/StatBlock'

export interface OverviewStatDef<T> {
  label: string
  value: (items: T[]) => string | number
}

export interface GenericOverviewConfig<T> {
  items: () => T[] | undefined
  getCover: (item: T) => string | null
  getTitle: (item: T) => string
  isFavorite: (item: T) => boolean | undefined
  stats: OverviewStatDef<T>[]
}

export function GenericOverviewTab<T>(props: { config: GenericOverviewConfig<T> }) {
  const items = createMemo(() => props.config.items() ?? [])
  const stats = createMemo(() => props.config.stats.map((s) => ({ label: s.label, value: s.value(items()) })))
  const favorites = createMemo(() => items().filter((item) => props.config.isFavorite(item)))

  return (
    <div class="flex flex-col gap-6">
      <StatBlock stats={stats()} />

      <div class="flex flex-col gap-3">
        <h2 class="text-sm font-medium text-text-2">Favorites</h2>
        <Show when={favorites().length} fallback={<p class="text-sm text-text-3">No favorites marked yet.</p>}>
          <div class="flex flex-wrap gap-3">
            <For each={favorites()}>
              {(item) => (
                <div class="flex items-center gap-2 rounded-lg border border-border bg-surface-1 py-2 pr-3 pl-2">
                  <Show when={props.config.getCover(item)}>
                    {(url) => <img src={url()} alt="" class="size-8 rounded-md object-cover" />}
                  </Show>
                  <span class="text-sm text-text-1">{props.config.getTitle(item)}</span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}
