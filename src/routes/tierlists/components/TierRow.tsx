import { For } from 'solid-js'
import type { Tier, TierEntry } from '@/lib/collections/tierlists'

export function TierRow(props: { tier: Tier; entries: TierEntry[] }) {
  return (
    <section>
      <h2>{props.tier}</h2>
      <ul>
        <For each={props.entries}>
          {(entry) => (
            <li>
              {entry.imageUrl && <img src={entry.imageUrl} alt={entry.label} />}
              <span>{entry.label}</span>
            </li>
          )}
        </For>
      </ul>
    </section>
  )
}
