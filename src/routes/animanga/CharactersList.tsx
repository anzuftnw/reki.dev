import { createResource, For, Show } from 'solid-js'
import { characters } from '@/lib/collections/animanga/characters'
import { MediaItemCard } from '@/routes/animanga/components/MediaItemCard'
import { MediaItemForm } from '@/routes/animanga/components/MediaItemForm'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

export default function CharactersList() {
  const [items, { refetch }] = createResource(() => characters.list())
  const { isOwner } = useAuth()
  const { editMode } = useUI()

  const handleAdd = async (data: { title: string; score: number }) => {
    await characters.create({ name: data.title, score: data.score, series: '' })
    refetch()
  }

  return (
    <section>
      <h1>Characters</h1>
      <Show when={!items.loading} fallback={<p>Loading...</p>}>
        <ul>
          <For each={items()}>
            {(item) => (
              <li>
                <MediaItemCard title={item.name} score={item.score} />
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
