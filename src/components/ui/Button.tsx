import { splitProps, type ComponentProps } from 'solid-js'
import { A } from '@solidjs/router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'chip'
type Size = 'sm' | 'md' | 'icon'

const variantClasses: Record<Variant, string> = {
  primary: 'rounded-lg font-medium bg-accent text-accent-foreground hover:brightness-105',
  secondary: 'rounded-lg font-medium bg-surface-2 text-text-1 border border-border hover:bg-surface-3',
  ghost: 'rounded-lg font-medium text-text-1 hover:bg-surface-3',
  chip: 'rounded-md border border-border-strong bg-surface-1/50 text-text-2 hover:bg-surface-3 hover:text-text-1',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  icon: 'size-8 p-0',
}

interface ButtonProps extends Omit<ComponentProps<'button'>, 'class'> {
  variant?: Variant
  size?: Size
  class?: string
  /** When set, renders as a router link styled like a button (e.g. "New post") instead of a <button>. */
  href?: string
  end?: boolean
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['variant', 'size', 'class', 'href', 'end'])
  const variant = () => local.variant ?? 'primary'
  const size = () => local.size ?? 'md'
  const classes = () =>
    `inline-flex items-center justify-center gap-2 transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant()]} ${sizeClasses[size()]} ${local.class ?? ''}`

  if (local.href) {
    return (
      <A href={local.href} end={local.end} aria-label={rest['aria-label']} class={classes()}>
        {rest.children}
      </A>
    )
  }

  return <button class={classes()} {...rest} />
}
