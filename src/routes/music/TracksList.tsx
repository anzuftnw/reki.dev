import { createResource, For, Show } from 'solid-js'
import { tracks } from '@/lib/collections/music/tracks'
import { ScrobbleStat } from '@/routes/music/components/ScrobbleStat'

export default function TracksList() {
  const [items] = createResource(() => tracks.list())

  return (
    <section>
      <h1>Tracks</h1>
      <Show when={!items.loading} fallback={<p>Loading...</p>}>
        <ul>
          <For each={items()}>
            {(item) => (
              <li>
                <article>
                  <h3>{item.title}</h3>
                  <p>{item.artist}</p>
                  <ScrobbleStat scrobbles={item.scrobbles} />
                </article>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </section>
  )
}
