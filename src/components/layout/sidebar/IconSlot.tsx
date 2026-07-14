import type { JSX } from 'solid-js'

export function IconSlot(props: { class?: string; children: JSX.Element }) {
  return (
    <span class={`flex size-8 shrink-0 items-center justify-center rounded-md ${props.class ?? ''}`}>
      {props.children}
    </span>
  )
}
