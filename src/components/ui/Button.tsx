import { splitProps, type ComponentProps } from 'solid-js'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:brightness-105',
  secondary: 'bg-surface-2 text-text-1 border border-border hover:bg-surface-3',
  ghost: 'text-text-1 hover:bg-surface-3',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-sm',
  md: 'px-4 py-2 text-base',
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['variant', 'size', 'class'])
  const variant = () => local.variant ?? 'primary'
  const size = () => local.size ?? 'md'

  return (
    <button
      class={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant()]} ${sizeClasses[size()]} ${local.class ?? ''}`}
      {...rest}
    />
  )
}
