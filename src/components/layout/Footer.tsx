import { For } from 'solid-js'
import { SiBun, SiGithub, SiPocketbase, SiSolid } from 'solid-icons/si'
import { TbFillHeart } from 'solid-icons/tb'
import { useUI } from '@/context/UIContext'

// Same 4 colors (and order) as Home's Explore section dots -- a small deliberate echo, not a new palette.
const SWATCHES = ['bg-accent', 'bg-amber', 'bg-lavender', 'bg-sage']

const TECH_LINKS = [
  { label: 'Bun', href: 'https://bun.sh/', icon: SiBun },
  { label: 'SolidJS', href: 'https://www.solidjs.com/', icon: SiSolid },
  { label: 'PocketBase', href: 'https://pocketbase.io/', icon: SiPocketbase },
]

export function Footer() {
  const { contentWidth } = useUI()

  return (
    // Mirrors the sidebar's own divider-row-above-Settings structure exactly: a separate 1px
    // border div, then a fixed h-12 content row. Putting border-t directly on an h-12 element
    // would absorb the border inside the 48px (box-sizing: border-box) instead of adding it on
    // top, landing 1px short of where the sidebar's divider (which *isn't* absorbed into its
    // Settings row) sits.
    <footer>
      <div class="border-t border-border" />
      <div
        class="flex flex-col items-center gap-3 px-5 py-3 text-center sm:grid sm:h-12 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4 sm:px-11 sm:py-0 sm:text-left"
        classList={{ 'mx-auto w-full max-w-6xl': contentWidth() === 'centered' }}
      >
        <div class="flex items-center justify-center gap-2 sm:justify-start">
          <For each={SWATCHES}>{(color) => <span class={`size-2 rounded-full ${color}`} />}</For>
        </div>

        <p class="text-base text-text-2">
          made with <TbFillHeart size={16} class="inline align-middle text-accent" /> by{' '}
          <span class="accent font-semibold">reki</span>
        </p>

        <div class="flex items-center justify-center gap-3 text-text-3 sm:justify-end">
          <For each={TECH_LINKS}>
            {(tech) => (
              <a
                href={tech.href}
                target="_blank"
                rel="noreferrer"
                aria-label={tech.label}
                class="transition-colors hover:text-text-1"
              >
                <tech.icon size={20} />
              </a>
            )}
          </For>
          <a
            href="https://github.com/anzuftnw/reki.dev"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            class="transition-colors hover:text-text-1"
          >
            <SiGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
