import { splitProps, type ComponentProps } from 'solid-js'

interface PictureProps extends Omit<ComponentProps<'img'>, 'src'> {
  avif: string
  webp: string
  fallback: string
}

/** AVIF -> WebP -> original-format fallback. Pair with a source image run through `bun run optimize-images`. */
export function Picture(props: PictureProps) {
  const [local, imgProps] = splitProps(props, ['avif', 'webp', 'fallback'])

  return (
    <picture>
      <source srcset={local.avif} type="image/avif" />
      <source srcset={local.webp} type="image/webp" />
      <img src={local.fallback} {...imgProps} />
    </picture>
  )
}
