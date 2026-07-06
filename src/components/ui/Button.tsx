import { splitProps, type ComponentProps } from 'solid-js'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:opacity-90',
  secondary: 'bg-muted/10 text-foreground border border-border hover:bg-muted/20',
  ghost: 'text-foreground hover:bg-muted/10',
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
      class={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant()]} ${sizeClasses[size()]} ${local.class ?? ''}`}
      {...rest}
    />
  )
}
