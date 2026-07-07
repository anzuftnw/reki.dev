import { createSignal, For, Show, type JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import { A, useLocation } from '@solidjs/router'
import { TbOutlineChevronDown } from 'solid-icons/tb'
import { matchNavItem, navGroups, settingsItem } from '@/lib/navigation'
import { useUI } from '@/context/UIContext'

// A plain max-width transition has a "dead zone" — since the label is much narrower than any
// max-width we'd pick, most of the range animates nothing and the visible shrink gets crammed
// into the tail end, reading as a late, jumpy snap. Animating grid-template-columns (1fr <-> 0fr)
// instead interpolates against the label's actual rendered width, so it shrinks smoothly and in
// step with the sidebar's own width transition, in both directions. The left padding lives here
// (rather than a row-level flex `gap`) so it collapses away with the label instead of leaving a
// phantom gap once the label's width hits zero.
function CollapsibleLabel(props: { collapsed: boolean; class?: string; children: JSX.Element }) {
  return (
    <span
      class="grid transition-[grid-template-columns,opacity] duration-200"
      style={{ 'grid-template-columns': props.collapsed ? '0fr' : '1fr', opacity: props.collapsed ? 0 : 1 }}
    >
      <span class={`overflow-hidden pl-2.5 whitespace-nowrap ${props.class ?? ''}`}>{props.children}</span>
    </span>
  )
}

// Every row's icon sits in an identically-sized 26px slot (matching the logo square) so their
// visual centers line up in one column regardless of the glyph's own rendered size (the logo
// square is bigger than the 18px nav icons) — in both expanded and icon-only mode.
const ICON_SLOT = 26
// Row width toggles between full-row (expanded) and a fixed 36px square (icon-only, matching the
// topbar's own icon buttons) — both are concrete lengths, so width transitions smoothly. Centering
// the icon slot within that square is done with a numeric margin-left (also a concrete length),
// never `justify-content`, which is a keyword and can't be transitioned — that mismatch (position
// snapping instantly while width/label eased over 200ms) was the source of the jumpiness.
const ROW_SIZE = 36
const ICON_MARGIN = (ROW_SIZE - ICON_SLOT) / 2

function IconSlot(props: { class?: string; iconOnly: boolean; children: JSX.Element }) {
  return (
    <span
      class={`flex size-6.5 shrink-0 items-center justify-center rounded-md transition-[margin-left] duration-200 ${props.class ?? ''}`}
      style={{ 'margin-left': props.iconOnly ? `${ICON_MARGIN}px` : '0px' }}
    >
      {props.children}
    </span>
  )
}

// 8px of breathing room between the icon and the pill's own edge in expanded mode; 0 in icon-only
// mode, where the icon is already centered in its fixed 36px square via IconSlot's own margin.
const rowStyle = (iconOnly: boolean) => ({
  'padding-left': iconOnly ? '0px' : '8px',
  'padding-right': iconOnly ? '0px' : '8px',
})
const rowBase = 'flex h-9 items-center rounded-md text-sm transition-[width,padding] duration-200'

export function Sidebar() {
  const location = useLocation()
  const { sidebarState } = useUI()
  const [collapsedGroups, setCollapsedGroups] = createSignal<Record<string, boolean>>({})
  const [tooltip, setTooltip] = createSignal<{ label: string; top: number } | null>(null)

  const collapsed = () => sidebarState() === 'collapsed'
  const hidden = () => sidebarState() === 'hidden'
  // Both `collapsed` and `hidden` should keep the compact/icon-only internal layout — only
  // `expanded` shows full labels. Without this, collapsing straight to hidden would instantly
  // revert every row to its expanded appearance (labels re-growing, divider un-collapsing) for
  // the brief moment before the sidebar itself finishes shrinking to 0 and clips it away.
  const iconOnly = () => sidebarState() !== 'expanded'

  const isActive = (href: string) => matchNavItem(location.pathname)?.item.href === href
  const isGroupCollapsed = (label: string) => collapsedGroups()[label] ?? false
  const toggleGroup = (label: string) =>
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }))

  // Nav rows live inside an overflow-y-auto container, which per the CSS overflow spec forces
  // overflow-x to clip too — so a row-anchored absolute tooltip gets cut off. Portal it to <body>
  // instead, positioned from the hovered row's own rect, so ancestor clipping can't touch it.
  const showTooltip = (label: string) => (e: MouseEvent) => {
    if (!collapsed()) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({ label, top: rect.top + rect.height / 2 })
  }
  const hideTooltip = () => setTooltip(null)

  return (
    <aside
      class="relative flex h-screen flex-col border-border bg-surface-1 transition-[width] duration-200"
      classList={{ 'overflow-hidden': hidden(), 'border-r': !hidden() }}
      style={{ width: hidden() ? '0px' : collapsed() ? '68px' : '232px' }}
    >
      {/* Fixed h-14 to match the TopBar's own height exactly, so the logo and the topbar's
          leftmost icon sit at the same vertical center — the sidebar/topbar corner lines up. */}
      <div
        class="flex h-14 shrink-0 items-center border-b border-border transition-[padding] duration-200"
        style={{ 'padding-left': iconOnly() ? '16px' : '16px', 'padding-right': iconOnly() ? '16px' : '16px' }}
      >
        <A href="/" class={rowBase} classList={{ 'w-full': !iconOnly(), 'w-9': iconOnly() }} style={rowStyle(iconOnly())} end>
          <IconSlot iconOnly={iconOnly()} class="bg-accent text-sm font-semibold text-accent-foreground">
            r
          </IconSlot>
          <CollapsibleLabel collapsed={iconOnly()} class="font-medium text-text-1">
            reki.dev
          </CollapsibleLabel>
        </A>
      </div>

      <div
        class="flex flex-1 flex-col gap-6 overflow-y-auto py-4 transition-[padding] duration-200"
        style={{ 'padding-left': iconOnly() ? '16px' : '16px', 'padding-right': iconOnly() ? '16px' : '16px' }}
      >
        <nav aria-label="Primary">
          <For each={navGroups}>
            {(group) => (
              <div class="mb-3.5 last:mb-0">
                <Show when={group.label}>
                  {/* Fixed height (not collapsed to 0) so items below don't reflow/shift when the
                      sidebar collapses — the label just fades out, leaving quiet breathing room
                      between groups rather than a divider competing with the icons. */}
                  <div class="relative mb-1 h-4">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.label as string)}
                      class="absolute inset-0 flex items-center justify-between text-[10px] font-semibold tracking-wide text-text-3 uppercase transition-opacity duration-200"
                      style={{ opacity: iconOnly() ? 0 : 1, 'pointer-events': iconOnly() ? 'none' : 'auto' }}
                    >
                      {group.label}
                      <TbOutlineChevronDown
                        size={12}
                        class="transition-transform"
                        style={{ transform: isGroupCollapsed(group.label as string) ? 'rotate(-90deg)' : 'none' }}
                      />
                    </button>
                  </div>
                </Show>
                <div
                  class="grid transition-[grid-template-rows] duration-200"
                  style={{
                    'grid-template-rows': iconOnly() || !isGroupCollapsed(group.label ?? '') ? '1fr' : '0fr',
                  }}
                >
                  <ul class="flex flex-col gap-0.5 overflow-hidden">
                    <For each={group.items}>
                      {(item) => (
                        <li>
                          <A
                            href={item.href}
                            class={rowBase}
                            classList={{
                              'text-text-2 hover:bg-surface-3 hover:text-text-1': !isActive(item.href),
                              'bg-surface-3 font-medium text-text-1': isActive(item.href),
                              'w-full': !iconOnly(),
                              'w-9': iconOnly(),
                            }}
                            style={rowStyle(iconOnly())}
                            end={item.href === '/'}
                            onMouseEnter={showTooltip(item.label)}
                            onMouseLeave={hideTooltip}
                          >
                            <IconSlot iconOnly={iconOnly()}>
                              <item.icon
                                size={18}
                                classList={{ 'text-accent': isActive(item.href), 'text-text-3': !isActive(item.href) }}
                              />
                            </IconSlot>
                            <CollapsibleLabel collapsed={iconOnly()}>{item.label}</CollapsibleLabel>
                          </A>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            )}
          </For>
        </nav>
      </div>

      <div>
        <div
          class="transition-[padding] duration-200"
          style={{ 'padding-left': iconOnly() ? '16px' : '16px', 'padding-right': iconOnly() ? '16px' : '16px' }}
        >
          <div class="border-t border-border" />
        </div>
        <div
          class="py-4 transition-[padding] duration-200"
          style={{ 'padding-left': iconOnly() ? '16px' : '16px', 'padding-right': iconOnly() ? '16px' : '16px' }}
        >
          <A
            href={settingsItem.href}
            class={rowBase}
            classList={{
              'text-text-2 hover:bg-surface-3 hover:text-text-1': !isActive(settingsItem.href),
              'bg-surface-3 font-medium text-text-1': isActive(settingsItem.href),
              'w-full': !iconOnly(),
              'w-9': iconOnly(),
            }}
            style={rowStyle(iconOnly())}
            onMouseEnter={showTooltip(settingsItem.label)}
            onMouseLeave={hideTooltip}
          >
            <IconSlot iconOnly={iconOnly()}>
              <settingsItem.icon
                size={18}
                classList={{ 'text-accent': isActive(settingsItem.href), 'text-text-3': !isActive(settingsItem.href) }}
              />
            </IconSlot>
            <CollapsibleLabel collapsed={iconOnly()}>{settingsItem.label}</CollapsibleLabel>
          </A>
        </div>
      </div>

      <Portal mount={document.body}>
        <Show when={tooltip()}>
          {(t) => (
            <div
              class="pointer-events-none fixed z-50 -translate-y-1/2 rounded-md border border-border-strong bg-surface-3 px-2 py-1 text-xs whitespace-nowrap text-text-1 shadow-md"
              style={{ top: `${t().top}px`, left: '64px' }}
            >
              {t().label}
            </div>
          )}
        </Show>
      </Portal>
    </aside>
  )
}
