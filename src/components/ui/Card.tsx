import type { ParentComponent } from 'solid-js'

// Generic content-agnostic container with no more specific semantic tag —
// feature-specific cards (PostCard, MediaItemCard, ...) should use <article> instead.
export const Card: ParentComponent<{ class?: string }> = (props) => {
  return (
    <div class={`rounded-xl border border-border bg-surface-1 p-4 ${props.class ?? ''}`}>{props.children}</div>
  )
}
