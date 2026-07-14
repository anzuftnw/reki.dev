import { createEffect, createSignal, onCleanup } from 'solid-js'

interface ScrollProgress {
  /** 0 at the top, 1 once scrolled past `thresholdPx` (or the element's max scroll, whichever is smaller). */
  progress: () => number
  /** Raw scrollTop in px, for effects that want actual distance rather than the normalized 0-1 curve. */
  rawScroll: () => number
}

/** Tracks scroll position of `element()` (read reactively, so it can resolve after mount — e.g. a ref set by an ancestor layout). */
export function useScrollProgress(element: () => Element | null | undefined, thresholdPx: number): ScrollProgress {
  const [progress, setProgress] = createSignal(0)
  const [rawScroll, setRawScroll] = createSignal(0)

  createEffect(() => {
    const el = element()
    if (!el) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = el.scrollTop
        const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
        const threshold = Math.min(thresholdPx, maxScroll)
        setRawScroll(y)
        setProgress(Math.min(1, y / threshold))
        ticking = false
      })
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    onCleanup(() => el.removeEventListener('scroll', onScroll))
  })

  return { progress, rawScroll }
}
