import { createResource, For, Show } from 'solid-js'
import { openings } from '@/lib/collections/animanga/openings'
import { MediaItemCard } from '@/routes/animanga/components/MediaItemCard'
import { MediaItemForm } from '@/routes/animanga/components/MediaItemForm'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

export default function OpeningsList() {
  const [items, { refetch }] = createResource(() => openings.list())
  const { isOwner } = useAuth()
  const { editMode } = useUI()

  const handleAdd = async (data: { title: string; score: number }) => {
    await openings.create({ title: data.title, score: data.score, series: '' })
    refetch()
  }

  return (
    <section>
      <h1>Openings</h1>
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
      <Show when={isOwner() && editMode()}>
        <MediaItemForm onSubmit={handleAdd} />
      </Show>
    </section>
  )
}
