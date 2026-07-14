import { createMemo, For, Show } from 'solid-js'
import { StatBlock } from '@/components/ui/StatBlock'
import type { OverviewStatDef } from '@/templates/list-page/GenericOverviewTab'

export interface BreakdownDef<T> {
  label: string
  getGroup: (item: T) => string | undefined
}

export interface GenericStatsConfig<T> {
  items: () => T[] | undefined
  stats: OverviewStatDef<T>[]
  breakdowns?: BreakdownDef<T>[]
}

export function GenericStatsTab<T>(props: { config: GenericStatsConfig<T> }) {
  const items = createMemo(() => props.config.items() ?? [])
  const stats = createMemo(() => props.config.stats.map((s) => ({ label: s.label, value: s.value(items()) })))

  const breakdowns = createMemo(() =>
    (props.config.breakdowns ?? []).map((breakdown) => {
      const counts = new Map<string, number>()
      for (const item of items()) {
        const group = breakdown.getGroup(item)
        if (group) counts.set(group, (counts.get(group) ?? 0) + 1)
      }
      const rows = [...counts.entries()].sort((a, b) => b[1] - a[1])
      const max = rows[0]?.[1] ?? 1
      return { label: breakdown.label, rows: rows.map(([group, count]) => ({ group, count, pct: (count / max) * 100 })) }
    }),
  )

  return (
    <div class="flex flex-col gap-6">
      <StatBlock stats={stats()} />

      <For each={breakdowns()}>
        {(breakdown) => (
          <div class="flex flex-col gap-2">
            <h2 class="text-sm font-medium text-text-2">{breakdown.label}</h2>
            <Show when={breakdown.rows.length} fallback={<p class="text-sm text-text-3">Nothing to break down yet.</p>}>
              <div class="flex flex-col gap-2">
                <For each={breakdown.rows}>
                  {(row) => (
                    <div class="flex items-center gap-3">
                      <span class="w-32 shrink-0 truncate text-sm text-text-2">{row.group}</span>
                      <div class="h-2 flex-1 rounded-full bg-surface-2">
                        <div class="h-full rounded-full bg-accent" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span class="w-8 shrink-0 text-right text-sm text-text-3">{row.count}</span>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}
