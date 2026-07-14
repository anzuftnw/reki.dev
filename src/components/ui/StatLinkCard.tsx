import { A } from '@solidjs/router'
import type { IconTypes } from 'solid-icons'

export function StatLinkCard(props: { href: string; icon: IconTypes; label: string; stat: string }) {
  return (
    <A href={props.href} class="block">
      <article class="flex items-center gap-3 rounded-xl border border-border bg-surface-1 p-4 transition-colors hover:border-border-strong hover:bg-surface-2">
        <props.icon class="size-6 shrink-0 text-text-2" />
        <div class="flex flex-col">
          <span class="font-medium text-text-1">{props.label}</span>
          <span class="text-sm text-text-3">{props.stat}</span>
        </div>
      </article>
    </A>
  )
}
