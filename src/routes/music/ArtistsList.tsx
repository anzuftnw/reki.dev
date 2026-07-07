import { createResource, For, Show, createEffect, onCleanup } from 'solid-js'
import { artists } from '@/lib/collections/music/artists'
import { ScrobbleStat } from '@/routes/music/components/ScrobbleStat'
import { SyncButton } from '@/routes/music/components/SyncButton'
import { useUI } from '@/context/UIContext'

export default function ArtistsList() {
  const [items] = createResource(() => artists.list())
  const { setPageActions } = useUI()

  createEffect(() => setPageActions(<SyncButton />))
  onCleanup(() => setPageActions(null))

  return (
    <section>
      <h1>Artists</h1>
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
