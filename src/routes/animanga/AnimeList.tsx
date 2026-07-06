import { createResource, For, Show } from 'solid-js'
import { anime } from '@/lib/collections/animanga/anime'
import { MediaItemCard } from '@/routes/animanga/components/MediaItemCard'
import { MediaItemForm } from '@/routes/animanga/components/MediaItemForm'

export default function AnimeList() {
  const [items, { refetch }] = createResource(() => anime.list())

  const handleAdd = async (data: { title: string; score: number }) => {
    await anime.create({ ...data, status: 'planning' })
    refetch()
  }

  return (
    <section>
      <h1>Anime</h1>
      <Show when={!items.loading} fallback={<p>Loading...</p>}>
        <ul>
          <For each={items()}>
            {(item) => (
              <li>
                <MediaItemCard title={item.title} score={item.score} status={item.status} />
              </li>
            )}
          </For>
        </ul>
      </Show>
      <MediaItemForm onSubmit={handleAdd} />
    </section>
  )
}
