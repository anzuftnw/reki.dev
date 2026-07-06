import { createResource, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { tierlists } from '@/lib/collections/tierlists'

export default function TierlistIndex() {
  const [items] = createResource(() => tierlists.list())

  return (
    <section>
      <h1>Tierlists</h1>
      <Show when={!items.loading} fallback={<p>Loading...</p>}>
        <ul>
          <For each={items()}>
            {(list) => (
              <li>
                <A href={`/tierlists/${list.id}`}>{list.title}</A>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </section>
  )
}
