import { createMemo, createSignal, For } from 'solid-js'
import { A, useLocation } from '@solidjs/router'
import { TbFillFeather } from 'solid-icons/tb'
import { filterVisibleNavGroups, matchNavItem, navGroups, settingsItem } from '@/lib/navigation'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { NavGroup } from './NavGroup'
import { NavRow } from './NavRow'
import { CollapsibleLabel } from './CollapsibleLabel'
import { IconSlot } from './IconSlot'

export function Sidebar() {
  const location = useLocation()
  const { sidebarState, scrolledToBottom } = useUI()
  const { isOwner } = useAuth()
  const [collapsedGroups, setCollapsedGroups] = createSignal<Record<string, boolean>>({})
  const visibleGroups = createMemo(() => filterVisibleNavGroups(navGroups, isOwner()))

  const collapsed = () => sidebarState() === 'collapsed'
  const hidden = () => sidebarState() === 'hidden'
  const iconOnly = () => sidebarState() !== 'expanded'

  // The divider above Settings only goes full-bleed once you're on Home AND scrolled all the way
  // to its footer, where the footer's height now matches the Settings row's height (48px) --
  // lining the two up into one continuous line, the same trick used for the sidebar-logo/TopBar
  // boundary. Before that (or on any other page), the footer isn't in view to line up with, so
  // the divider keeps its normal inset.
  const isHome = () => location.pathname === '/'
  const dividerFullBleed = () => isHome() && scrolledToBottom()
  const match = createMemo(() => matchNavItem(location.pathname))
  const isActive = (href: string) => match()?.item?.href === href
  const isGroupCollapsed = (label: string) => collapsedGroups()[label] ?? false
  const toggleGroup = (label: string) =>
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <aside
      class="relative flex h-auto flex-col border-border bg-surface-1 transition-[width] duration-200 sm:h-screen"
      classList={{ 'overflow-hidden': hidden(), 'border-r': !hidden() }}
      style={{
        width: hidden() ? '0px' : collapsed() ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
      }}
    >
      <div class="flex h-14 shrink-0 items-center border-b border-border px-3">
        <A
          href="/"
          aria-label="reki.dev"
          class="flex items-center"
          classList={{ 'w-full': !iconOnly(), 'w-8': iconOnly() }}
          end
        >
          <IconSlot class="bg-accent-foreground text-accent">
            <TbFillFeather size={20} />
          </IconSlot>
          <CollapsibleLabel collapsed={iconOnly()} class="font-medium text-text-1">
            reki.dev
          </CollapsibleLabel>
        </A>
      </div>

      <div class="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-3">
        <nav aria-label="Primary">
          <For each={visibleGroups()}>
            {(group) => (
              <NavGroup
                group={group}
                iconOnly={iconOnly()}
                collapsed={isGroupCollapsed(group.label ?? '')}
                active={!match()?.item && match()?.group.label === group.label}
                onToggle={() => toggleGroup(group.label as string)}
                isActive={isActive}
              />
            )}
          </For>
        </nav>
      </div>

      <div class="transition-[padding] duration-200" classList={{ 'px-3': !dividerFullBleed() }}>
        <div class="border-t border-border" />
      </div>
      <div class="flex h-12 shrink-0 items-center px-3">
        <NavRow item={settingsItem} iconOnly={iconOnly()} active={isActive(settingsItem.href)} />
      </div>
    </aside>
  )
}
