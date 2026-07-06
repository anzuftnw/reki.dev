import { Show } from 'solid-js'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface MediaItemCardProps {
  title: string
  score: number
  status?: string
}

export function MediaItemCard(props: MediaItemCardProps) {
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.score}/10</p>
      <Show when={props.status}>
        <StatusBadge status={props.status!} />
      </Show>
    </article>
  )
}
