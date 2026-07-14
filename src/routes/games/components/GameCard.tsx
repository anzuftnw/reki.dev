import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { games, type Game } from '@/lib/collections/games/games'

export function GameCard(props: { game: Game }) {
  const cover = () => games.coverUrl(props.game)

  return (
    <A href={`/games/${props.game.slug}`} class="block h-full">
      <article class="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:-translate-y-0.5 hover:border-border-strong">
        <Show when={cover()}>{(url) => <img src={url()} alt="" class="h-32 w-full object-cover" />}</Show>
        <div class="flex flex-1 flex-col gap-2 p-4">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-lg font-semibold text-text-1">{props.game.name}</h3>
            <StatusBadge status={props.game.status} />
          </div>
          <Show when={props.game.tagline}>
            <p class="line-clamp-2 text-sm text-text-2">{props.game.tagline}</p>
          </Show>
        </div>
      </article>
    </A>
  )
}
