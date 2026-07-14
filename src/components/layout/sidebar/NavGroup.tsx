import { createSignal, createUniqueId, For, Show } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'
import { A } from '@solidjs/router'
import { TbOutlineChevronDown } from 'solid-icons/tb'
import { Collapsible } from '@/components/ui/Collapsible'
import type { NavGroup as NavGroupData } from '@/lib/navigation'
import { NavRow, rowBase } from './NavRow'
import { CollapsibleLabel } from './CollapsibleLabel'
import { IconSlot } from './IconSlot'

export function NavGroup(props: {
  group: NavGroupData
  iconOnly: boolean
  collapsed: boolean
  active: boolean
  onToggle: () => void
  isActive: (href: string) => boolean
}) {
  const open = () => props.iconOnly || !props.collapsed
  const contentId = createUniqueId()

  let triggerRef: HTMLAnchorElement | undefined
  const [tooltipPos, setTooltipPos] = createSignal<{ top: number; left: number } | null>(null)

  // Same reasoning as NavRow's tooltip: the sidebar's own container scrolls (overflow-y-auto),
  // so a portal is needed to escape its clipping when icon-only.
  const showTooltip = () => {
    if (!triggerRef || !props.iconOnly) return
    const rect = triggerRef.getBoundingClientRect()
    setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 8 })
  }
  const hideTooltip = () => setTooltipPos(null)

  return (
    <div class="mb-4 last:mb-0">
      <Show when={props.group.label}>
        <div class="mb-1 flex items-center gap-1">
          <A
            ref={triggerRef}
            href={props.group.href ?? '#'}
            aria-label={props.group.label ?? undefined}
            class={rowBase}
            classList={{
              'text-text-2 hover:bg-surface-3 hover:text-text-1': !props.active,
              'bg-surface-3 font-medium text-text-1': props.active,
              'w-full': !props.iconOnly,
              'w-8': props.iconOnly,
            }}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
            onKeyDown={(e) => e.key === 'Escape' && hideTooltip()}
          >
            <Show when={props.group.icon}>
              <IconSlot>
                <Dynamic
                  component={props.group.icon!}
                  size={20}
                  classList={{ 'text-accent': props.active, 'text-text-3': !props.active }}
                />
              </IconSlot>
            </Show>
            <CollapsibleLabel collapsed={props.iconOnly}>{props.group.label}</CollapsibleLabel>
          </A>
          {/* Collapsing a group only matters when there's room to show labels -- icon-only mode
              always forces every group open (see `open` above), so the toggle is moot there. */}
          <Show when={!props.iconOnly}>
            <button
              type="button"
              onClick={props.onToggle}
              aria-expanded={open()}
              aria-controls={contentId}
              aria-label={`${props.collapsed ? 'Expand' : 'Collapse'} ${props.group.label}`}
              class="flex shrink-0 items-center justify-center rounded-md p-2 text-text-3 transition-colors hover:bg-surface-3 hover:text-text-1"
            >
              <TbOutlineChevronDown
                size={16}
                class="transition-transform"
                classList={{ '-rotate-90': props.collapsed }}
              />
            </button>
          </Show>
        </div>
        <Show when={tooltipPos()}>
          {(pos) => (
            <Portal>
              <span
                role="tooltip"
                class="pointer-events-none fixed z-50 -translate-y-1/2 rounded-md border border-border-strong bg-surface-3 px-2 py-1 text-xs whitespace-nowrap text-text-1 shadow-md"
                style={{ top: `${pos().top}px`, left: `${pos().left}px` }}
              >
                {props.group.label}
              </span>
            </Portal>
          )}
        </Show>
      </Show>
      <Collapsible open={open()} axis="height">
        <div id={contentId}>
          <ul class="flex flex-col gap-1">
            <For each={props.group.items}>
              {(item) => (
                <li>
                  <NavRow item={item} iconOnly={props.iconOnly} active={props.isActive(item.href)} end={item.href === '/'} />
                </li>
              )}
            </For>
          </ul>
        </div>
      </Collapsible>
    </div>
  )
}
