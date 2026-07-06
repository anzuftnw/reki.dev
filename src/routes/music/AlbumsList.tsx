import { createResource, For, Show } from 'solid-js'
import { albums } from '@/lib/collections/music/albums'
import { ScrobbleStat } from '@/routes/music/components/ScrobbleStat'

export default function AlbumsList() {
  const [items] = createResource(() => albums.list())

  return (
    <section>
      <h1>Albums</h1>
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
