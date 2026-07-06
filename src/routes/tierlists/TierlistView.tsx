import { createResource, For, Show } from 'solid-js'
import { useParams } from '@solidjs/router'
import { tierlists, type Tier } from '@/lib/collections/tierlists'
import { TierRow } from '@/routes/tierlists/components/TierRow'
import { TierlistEditor } from '@/routes/tierlists/components/TierlistEditor'

const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F']

export default function TierlistView() {
  const params = useParams<{ id: string }>()
  const [tierlist, { refetch }] = createResource(() => params.id, (id) => tierlists.get(id))

  return (
    <Show when={tierlist()} fallback={<p>Loading...</p>}>
      {(tierlist) => (
        <article>
          <h1>{tierlist().title}</h1>
          <For each={TIERS}>
            {(tier) => (
              <TierRow tier={tier} entries={tierlist().entries.filter((e) => e.tier === tier)} />
            )}
          </For>
          <TierlistEditor tierlist={tierlist()} onChange={refetch} />
        </article>
      )}
    </Show>
  )
}
