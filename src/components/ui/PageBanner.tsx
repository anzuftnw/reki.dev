import { Show } from 'solid-js'
import { Picture } from '@/components/ui/Picture'
import { useUI } from '@/context/UIContext'
import banner from '@/assets/banner.jpg'
import bannerAvif from '@/assets/banner.avif'
import bannerWebp from '@/assets/banner.webp'

// Shared with Home's hero fade-out distance -- scrolling the hero away takes you exactly to
// where a normal page's banner height would end, instead of an arbitrary scroll distance.
export const PAGE_BANNER_HEIGHT_PX = 256

/** Full-bleed edge-to-edge in 'full' content-width mode, with the title/subtitle overlaid on the
 *  image like a mini-hero; a rounded, bordered card in 'centered' mode with no overlay text --
 *  that reads as cramped at card size, so the caller renders its own title below instead. */
export function PageBanner(props: { title?: string; subtitle?: string }) {
  const { contentWidth } = useUI()
  const isCentered = () => contentWidth() === 'centered'

  return (
    <div classList={{ '-mx-5 -mt-8 sm:-mx-11': !isCentered() }}>
      <div class="relative h-64" classList={{ 'overflow-hidden rounded-xl border border-border': isCentered() }}>
        <Picture avif={bannerAvif} webp={bannerWebp} fallback={banner} alt="" class="size-full object-cover" />
        <Show when={!isCentered() && props.title}>
          <div class="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 to-transparent p-5 sm:p-11">
            <h1 class="text-2xl font-semibold text-white">{props.title}</h1>
            <Show when={props.subtitle}>
              <p class="text-white/80">{props.subtitle}</p>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}
