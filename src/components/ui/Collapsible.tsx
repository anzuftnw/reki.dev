import { createSignal, onCleanup, onMount, type JSX } from 'solid-js'

// Content-only animated collapse box (no built-in trigger -- callers wire their own toggle
// button/aria-expanded). Measures the content's natural size via ResizeObserver rather than a
// static one-time read, since webfont swap-in can change measured text width after first paint.
export function Collapsible(props: { open: boolean; axis?: 'height' | 'width'; class?: string; children: JSX.Element }) {
  let contentRef: HTMLDivElement | undefined
  const [size, setSize] = createSignal(0)
  const axis = () => props.axis ?? 'height'

  onMount(() => {
    if (!contentRef) return
    const measure = () => setSize(axis() === 'width' ? contentRef!.scrollWidth : contentRef!.scrollHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(contentRef)
    onCleanup(() => ro.disconnect())
  })

  return (
    <div
      class={`overflow-hidden transition-[height,width,opacity] duration-200 ${props.class ?? ''}`}
      style={{ [axis()]: props.open ? `${size()}px` : '0px', opacity: props.open ? 1 : 0 }}
    >
      <div ref={contentRef}>{props.children}</div>
    </div>
  )
}
