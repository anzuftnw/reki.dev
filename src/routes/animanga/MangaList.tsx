import { createResource, For, Show } from 'solid-js'
import { manga } from '@/lib/collections/animanga/manga'
import { MediaItemCard } from '@/routes/animanga/components/MediaItemCard'
import { MediaItemForm } from '@/routes/animanga/components/MediaItemForm'

export default function MangaList() {
  const [items, { refetch }] = createResource(() => manga.list())

  const handleAdd = async (data: { title: string; score: number }) => {
    await manga.create({ ...data, status: 'planning' })
    refetch()
  }

  return (
    <section>
      <h1>Manga</h1>
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
