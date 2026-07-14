import { createEffect, For, onCleanup } from 'solid-js'
import { A } from '@solidjs/router'
import { SiAnilist, SiDiscord, SiLastdotfm, SiSteam } from 'solid-icons/si'
import { Card } from '@/components/ui/Card'
import { Picture } from '@/components/ui/Picture'
import { PAGE_BANNER_HEIGHT_PX } from '@/components/ui/PageBanner'
import { Footer } from '@/components/layout/Footer'
import { useUI } from '@/context/UIContext'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useAtBottom } from '@/hooks/useAtBottom'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import banner from '@/assets/banner.jpg'
import bannerAvif from '@/assets/banner.avif'
import bannerWebp from '@/assets/banner.webp'
import avatar from '@/assets/avatar.jpg'
import avatarAvif from '@/assets/avatar.avif'
import avatarWebp from '@/assets/avatar.webp'

const EXPLORE_ITEMS = [
  { label: 'Projects', href: '/projects', dot: 'bg-accent', description: 'Things I’ve built and am still building.' },
  { label: 'Blog', href: '/blog', dot: 'bg-amber', description: 'Notes, write-ups, and whatever’s on my mind.' },
  // TODO(phase 4): point at /animanga once the group-overview page exists
  { label: 'Animanga', href: '/anime', dot: 'bg-lavender', description: 'Anime & manga I’m tracking and rating.' },
  // TODO(phase 4): point at /music once the group-overview page exists
  { label: 'Music', href: '/music/artists', dot: 'bg-sage', description: 'Artists, albums, and what I’m listening to.' },
]

// TODO: fill in real profile URLs whenever -- left as inert placeholders on purpose.
const SOCIAL_LINKS = [
  { label: 'Discord', href: '#', icon: SiDiscord },
  { label: 'Steam', href: '#', icon: SiSteam },
  { label: 'AniList', href: '#', icon: SiAnilist },
  { label: 'Last.fm', href: '#', icon: SiLastdotfm },
]

// Distance (px) scrolled before the hero is fully faded/zoomed/parallaxed away -- tied to the
// same height every other page's banner uses, so the giant hero fades out over exactly the
// scroll distance a normal page's banner would occupy, instead of an arbitrary number.
const HERO_FADE_THRESHOLD_PX = PAGE_BANNER_HEIGHT_PX
// Background image fades almost fully out (not to 0 — leaves a faint trace under the Explore section's border).
const BG_FADE_AMOUNT = 0.94
// Subtle Ken Burns-style zoom as you scroll past the hero.
const BG_SCALE_AMOUNT = 0.07
// Hero text fades slightly faster than the background so it's gone before the section boundary.
const TEXT_FADE_AMOUNT = 1.15
// Hero text drifts upward slower than actual scroll distance, for a parallax depth effect.
const TEXT_PARALLAX_SPEED = 0.18

export default function Home() {
  const { setHeroProgress, mainEl, contentWidth, setScrolledToBottom } = useUI()
  const { progress: scrollP, rawScroll } = useScrollProgress(mainEl, HERO_FADE_THRESHOLD_PX)
  const atBottom = useAtBottom(mainEl)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  createEffect(() => setHeroProgress(scrollP()))
  // Other pages always want a solid TopBar -- reset the shared progress value on unmount so
  // navigating away before scrolling doesn't leave it stuck at whatever it last was on Home.
  onCleanup(() => setHeroProgress(1))

  createEffect(() => setScrolledToBottom(atBottom()))
  onCleanup(() => setScrolledToBottom(false))

  return (
    // -mb-8 cancels main's own pb-8 too, so the footer sits flush with the true bottom of the
    // scrollable area instead of leaving a residual gap that reads as "floating".
    <div class="-mx-5 -mt-14 -mb-8 sm:-mx-11">
      <section class="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 sm:px-11">
        <div
          class="pointer-events-none absolute inset-0"
          style={{
            'background-image': `linear-gradient(90deg, color-mix(in oklch, var(--color-canvas) 88%, transparent) 0%, color-mix(in oklch, var(--color-canvas) 45%, transparent) 55%, color-mix(in oklch, var(--color-canvas) 15%, transparent) 100%), radial-gradient(120% 70% at 50% 100%, var(--color-canvas) 0%, transparent 60%), -webkit-image-set(url(${bannerAvif}) type("image/avif"), url(${bannerWebp}) type("image/webp"), url(${banner}) type("image/jpeg")), image-set(url(${bannerAvif}) type("image/avif"), url(${bannerWebp}) type("image/webp"), url(${banner}) type("image/jpeg"))`,
            'background-size': 'cover, cover, cover, cover',
            'background-position': 'center, center, center, center',
            opacity: 1 - scrollP() * BG_FADE_AMOUNT,
            transform: prefersReducedMotion() ? undefined : `scale(${1 + scrollP() * BG_SCALE_AMOUNT})`,
            'transform-origin': 'center top',
          }}
        />

        <div
          class="relative max-w-xl"
          style={{
            opacity: Math.max(0, 1 - scrollP() * TEXT_FADE_AMOUNT),
            transform: prefersReducedMotion() ? undefined : `translateY(${-rawScroll() * TEXT_PARALLAX_SPEED}px)`,
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

        <div class="absolute bottom-8 left-5 flex items-center gap-2 font-mono text-2xs tracking-widest text-text-3 sm:left-11">
          <span class="h-px w-6 bg-text-3" />
          SCROLL
        </div>
      </section>

      {/* The border-t divider stays full-bleed (matching the hero's full-width feel) in both
          modes -- only the heading/content inside gets constrained when centered, like a normal
          page's content. */}
      <section id="explore" class="border-t border-border py-14">
        <div class="px-5 sm:px-11" classList={{ 'mx-auto w-full max-w-6xl': contentWidth() === 'centered' }}>
          <div class="mb-6 flex items-baseline justify-between">
            <h2 class="font-mono text-xs tracking-widest text-text-3 uppercase">Explore</h2>
            <span class="font-mono text-xs text-text-3">{EXPLORE_ITEMS.length} sections</span>
          </div>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <For each={EXPLORE_ITEMS}>
              {(item) => (
                <A href={item.href}>
                  <Card class="h-full transition-all hover:-translate-y-0.5 hover:border-border-strong">
                    <span class={`block size-2 rounded-full ${item.dot}`} />
                    <h3 class="mt-3 text-lg font-semibold text-text-1">{item.label}</h3>
                    <p class="mt-1 text-sm text-text-2">{item.description}</p>
                  </Card>
                </A>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* Unlike the Explore divider (a hero-exit transition, kept full-bleed), this and any later
          section dividers shrink with the content in centered mode -- a divider wider than the
          content on either side of it reads as a mistake, not a design choice. */}
      <section>
        <div
          class="border-t border-border px-5 py-14 sm:px-11"
          classList={{ 'mx-auto w-full max-w-6xl': contentWidth() === 'centered' }}
        >
          <h2 class="mb-6 font-mono text-xs tracking-widest text-text-3 uppercase">About</h2>
          <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Picture
              avif={avatarAvif}
              webp={avatarWebp}
              fallback={avatar}
              alt=""
              class="size-20 shrink-0 rounded-full border border-border object-cover"
            />
            <div class="flex flex-col gap-2">
              <p class="text-lg font-semibold text-text-1">reki</p>
              {/* TODO: replace with a real bio */}
              <p class="max-w-md text-sm text-text-2">Add a short bio here.</p>
              <div class="mt-1 flex items-center gap-3">
                <For each={SOCIAL_LINKS}>
                  {(link) => (
                    <a href={link.href} aria-label={link.label} class="text-text-3 transition-colors hover:text-text-1">
                      <link.icon size={20} />
                    </a>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
