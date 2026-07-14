import { createSignal, onCleanup, onMount } from 'solid-js'

export function useMediaQuery(query: string): () => boolean {
  const [matches, setMatches] = createSignal(false)

  onMount(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    onCleanup(() => mql.removeEventListener('change', onChange))
  })

  return matches
}
