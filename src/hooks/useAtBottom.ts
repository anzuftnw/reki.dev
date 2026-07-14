import { createEffect, createSignal, onCleanup } from 'solid-js'

/** True once `element()` has been scrolled to (within a couple px of) its maximum scroll position. */
export function useAtBottom(element: () => Element | null | undefined, epsilonPx = 4): () => boolean {
  const [atBottom, setAtBottom] = createSignal(false)

  createEffect(() => {
    const el = element()
    if (!el) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - epsilonPx)
        ticking = false
      })
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    onCleanup(() => el.removeEventListener('scroll', onScroll))
  })

  return atBottom
}
