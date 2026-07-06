import { createResource, For, Show } from 'solid-js'
import { endings } from '@/lib/collections/animanga/endings'
import { MediaItemCard } from '@/routes/animanga/components/MediaItemCard'
import { MediaItemForm } from '@/routes/animanga/components/MediaItemForm'

export default function EndingsList() {
  const [items, { refetch }] = createResource(() => endings.list())

  const handleAdd = async (data: { title: string; score: number }) => {
    await endings.create({ title: data.title, score: data.score, series: '' })
    refetch()
  }

  return (
    <section>
      <h1>Endings</h1>
      <Show when={!items.loading} fallback={<p>Loading...</p>}>
        <ul>
          <For each={items()}>
            {(item) => (
              <li>
                <MediaItemCard title={item.title} score={item.score} />
              </li>
            )}
          </For>
        </ul>
      </Show>
      <MediaItemForm onSubmit={handleAdd} />
    </section>
  )
}
