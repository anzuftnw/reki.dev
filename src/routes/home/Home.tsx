import { createSignal, onCleanup, onMount } from 'solid-js'
import { A } from '@solidjs/router'
import { Card } from '@/components/ui/Card'
import { useUI } from '@/context/UIContext'
import banner from '@/assets/banner.jpg'

const EXPLORE_ITEMS = [
  { label: 'Projects', href: '/projects', dot: 'bg-accent', description: 'Things I’ve built and am still building.' },
  { label: 'Blog', href: '/blog', dot: 'bg-amber', description: 'Notes, write-ups, and whatever’s on my mind.' },
  { label: 'Animanga', href: '/anime', dot: 'bg-lavender', description: 'Anime & manga I’m tracking and rating.' },
  { label: 'Music', href: '/music/artists', dot: 'bg-sage', description: 'Artists, albums, and what I’m listening to.' },
]

export default function Home() {
  const { setHeroProgress } = useUI()
  const [scrollP, setScrollP] = createSignal(0)
  const [rawScroll, setRawScroll] = createSignal(0)

  let mainEl: Element | null = null

  onMount(() => {
    mainEl = document.querySelector('main')
    if (!mainEl) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const el = mainEl!
        const y = el.scrollTop
        const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight)
        const threshold = Math.min(560, maxScroll)
        setRawScroll(y)
        const p = Math.min(1, y / threshold)
        setScrollP(p)
        setHeroProgress(p)
        ticking = false
      })
    }

    onScroll()
    mainEl.addEventListener('scroll', onScroll, { passive: true })
    onCleanup(() => {
      mainEl?.removeEventListener('scroll', onScroll)
      setHeroProgress(1)
    })
  })

  return (
    <div class="-mx-5 -mt-14 sm:-mx-11">
      <section class="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 sm:px-11">
        <div
          class="pointer-events-none absolute inset-0"
          style={{
            'background-image': `linear-gradient(90deg, color-mix(in oklch, var(--color-canvas) 88%, transparent) 0%, color-mix(in oklch, var(--color-canvas) 45%, transparent) 55%, color-mix(in oklch, var(--color-canvas) 15%, transparent) 100%), radial-gradient(120% 70% at 50% 100%, var(--color-canvas) 0%, transparent 60%), url(${banner})`,
            'background-size': 'cover, cover, cover',
            'background-position': 'center, center, center',
            opacity: 1 - scrollP() * 0.94,
            transform: `scale(${1 + scrollP() * 0.07})`,
            'transform-origin': 'center top',
          }}
        />

        <div
          class="relative max-w-xl"
          style={{
            opacity: Math.max(0, 1 - scrollP() * 1.15),
            transform: `translateY(${-rawScroll() * 0.18}px)`,
          }}
        >
          <p class="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
            灰羽連盟 · dev &amp; collector
          </p>
          <h1 class="mt-4 text-5xl leading-[0.98] font-semibold tracking-tight text-text-1 sm:text-[4.2rem]">
            I build things &amp; <span class="accent">collect</span> the rest.
          </h1>
          <p class="mt-5 max-w-md text-base leading-relaxed text-text-2 sm:text-lg">
            A personal corner for what I make, what I watch, and what I&rsquo;m still figuring out.
          </p>
          <div class="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#explore"
              class="rounded-full bg-accent px-4 py-2 text-base font-medium text-accent-foreground hover:brightness-105"
            >
              Explore the hub →
            </a>
            <A
              href="/blog"
              class="rounded-full border border-border px-4 py-2 text-base font-medium text-text-1 hover:bg-surface-3"
            >
              Read the blog
            </A>
          </div>
        </div>

        <div class="absolute bottom-8 left-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-text-3 sm:left-11">
          <span class="h-px w-6 bg-text-3" />
          SCROLL
        </div>
      </section>

      <section id="explore" class="border-t border-border px-5 py-14 sm:px-11">
        <div class="mb-6 flex items-baseline justify-between">
          <h2 class="font-mono text-xs tracking-[0.1em] text-text-3 uppercase">Explore</h2>
          <span class="font-mono text-xs text-text-3">{EXPLORE_ITEMS.length} sections</span>
        </div>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
          {EXPLORE_ITEMS.map((item) => (
            <A href={item.href}>
              <Card class="h-full transition-all hover:-translate-y-0.5 hover:border-border-strong">
                <span class={`block size-[9px] rounded-full ${item.dot}`} />
                <h3 class="mt-3 text-lg font-semibold text-text-1">{item.label}</h3>
                <p class="mt-1 text-sm text-text-2">{item.description}</p>
              </Card>
            </A>
          ))}
        </div>
      </section>
    </div>
  )
}
