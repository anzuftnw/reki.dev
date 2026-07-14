import { createSignal, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { A } from '@solidjs/router'
import type { NavItem } from '@/lib/navigation'
import { CollapsibleLabel } from './CollapsibleLabel'
import { IconSlot } from './IconSlot'

export const rowBase = 'flex h-8 items-center rounded-md text-sm transition-[width] duration-200'

export function NavRow(props: { item: NavItem; iconOnly: boolean; active: boolean; end?: boolean }) {
  let triggerRef: HTMLAnchorElement | undefined
  const [tooltipPos, setTooltipPos] = createSignal<{ top: number; left: number } | null>(null)

  // Sidebar's own container scrolls (overflow-y-auto), which clips any absolutely-positioned
  // child that pokes out its right edge -- so the tooltip is portaled to <body> and positioned
  // in viewport coordinates from the trigger's rect, same reason Kobalte's Tooltip used a portal.
  const showTooltip = () => {
    if (!triggerRef || !props.iconOnly) return
    const rect = triggerRef.getBoundingClientRect()
    setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 8 })
  }
  const hideTooltip = () => setTooltipPos(null)

  return (
    <>
      <A
        ref={triggerRef}
        href={props.item.href}
        aria-label={props.item.label}
        class={rowBase}
        classList={{
          'text-text-2 hover:bg-surface-3 hover:text-text-1': !props.active,
          'bg-surface-3 font-medium text-text-1': props.active,
          'w-full': !props.iconOnly,
          'w-8': props.iconOnly,
        }}
        end={props.end}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={(e) => e.key === 'Escape' && hideTooltip()}
      >
        <IconSlot>
          <props.item.icon size={20} classList={{ 'text-accent': props.active, 'text-text-3': !props.active }} />
        </IconSlot>
        <CollapsibleLabel collapsed={props.iconOnly}>{props.item.label}</CollapsibleLabel>
      </A>
      <Show when={tooltipPos()}>
        {(pos) => (
          <Portal>
            <span
              role="tooltip"
              class="pointer-events-none fixed z-50 -translate-y-1/2 rounded-md border border-border-strong bg-surface-3 px-2 py-1 text-xs whitespace-nowrap text-text-1 shadow-md"
              style={{ top: `${pos().top}px`, left: `${pos().left}px` }}
            >
              {props.item.label}
            </span>
          </Portal>
        )}
      </Show>
    </>
  )
}
