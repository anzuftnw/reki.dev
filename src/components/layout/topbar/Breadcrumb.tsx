import { createMemo, For } from 'solid-js'
import { A } from '@solidjs/router'
import type { NavGroup, NavItem } from '@/lib/navigation'

interface Crumb {
  label: string
  href: string
}

export function Breadcrumb(props: { match: { group: NavGroup; item: NavItem | null } | null; pageTitle: string | null }) {
  const crumbs = createMemo((): Crumb[] => {
    const list: Crumb[] = []
    const m = props.match
    if (m?.group.label && m.group.href) list.push({ label: m.group.label, href: m.group.href })
    if (m?.item) list.push({ label: m.item.label, href: m.item.href })
    if (props.pageTitle) list.push({ label: props.pageTitle, href: '' })
    return list
  })

  return (
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center gap-2 text-sm">
        <For each={crumbs()}>
          {(crumb, index) => {
            const isCurrent = () => index() === crumbs().length - 1
            return (
              <>
                {index() > 0 && (
                  <li aria-hidden="true" class="text-text-3">
                    /
                  </li>
                )}
                <li
                  aria-current={isCurrent() ? 'page' : undefined}
                  class={isCurrent() ? 'font-medium text-text-1' : 'text-text-2'}
                >
                  {isCurrent() ? crumb.label : (
                    <A href={crumb.href} class="hover:text-text-1">
                      {crumb.label}
                    </A>
                  )}
                </li>
              </>
            )
          }}
        </For>
      </ol>
    </nav>
  )
}
