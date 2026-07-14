import { createResource, createSignal, For, Show } from 'solid-js'
import { games } from '@/lib/collections/games/games'
import { GameCard } from '@/routes/games/components/GameCard'
import { GameForm } from '@/routes/games/components/GameForm'
import { Button } from '@/components/ui/Button'
import { PageBanner } from '@/components/ui/PageBanner'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

export default function Games() {
  const [list, { refetch }] = createResource(() => games.list())
  const { isOwner } = useAuth()
  const { editMode, contentWidth } = useUI()
  const [creating, setCreating] = createSignal(false)
  const isCentered = () => contentWidth() === 'centered'

  return (
    <section class="flex flex-col gap-6">
      <PageBanner title="Games" />

      <div class="flex items-baseline" classList={{ 'justify-between': isCentered(), 'justify-end': !isCentered() }}>
        <Show when={isCentered()}>
          <h1 class="text-xl font-semibold">Games</h1>
        </Show>
        <Show when={isOwner() && editMode()}>
          <Button size="sm" onClick={() => setCreating(true)}>
            New game
          </Button>
        </Show>
      </div>

      <Show when={creating()}>
        <GameForm
          submitLabel="Save"
          onSubmit={async (data) => {
            await games.create(data)
            setCreating(false)
            refetch()
          }}
        />
      </Show>

      <Show when={!list.loading} fallback={<p class="text-sm text-text-3">Loading…</p>}>
        <Show when={list()?.length} fallback={<p class="text-sm text-text-3">No games yet.</p>}>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <For each={list()}>{(game) => <GameCard game={game} />}</For>
          </div>
        </Show>
      </Show>
    </section>
  )
}
