import { createResource, For, Show } from 'solid-js'
import { artists } from '@/lib/collections/music/artists'
import { ScrobbleStat } from '@/routes/music/components/ScrobbleStat'
import { SyncButton } from '@/routes/music/components/SyncButton'

export default function ArtistsList() {
  const [items] = createResource(() => artists.list())

  return (
    <section>
      <h1>Artists</h1>
      <SyncButton />
      <Show when={!items.loading} fallback={<p>Loading...</p>}>
        <ol>
          <For each={items()}>
            {(item) => (
              <li>
                <article>
                  <h3>{item.name}</h3>
                  <ScrobbleStat scrobbles={item.scrobbles} />
                </article>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </section>
  )
}
