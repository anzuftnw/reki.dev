import { For } from 'solid-js'
import { Card } from '@/components/ui/Card'

export interface Stat {
  label: string
  value: string | number
}

export function StatBlock(props: { stats: Stat[] }) {
  return (
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <For each={props.stats}>
        {(stat) => (
          <Card class="flex flex-col gap-1">
            <span class="text-2xs tracking-wide text-text-3 uppercase">{stat.label}</span>
            <span class="text-xl font-semibold text-text-1">{stat.value}</span>
          </Card>
        )}
      </For>
    </div>
  )
}
