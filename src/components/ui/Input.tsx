import { splitProps, type ComponentProps } from 'solid-js'

interface InputProps extends ComponentProps<'input'> {
  label: string
}

export function Input(props: InputProps) {
  const [local, inputProps] = splitProps(props, ['label'])

  return (
    <label class="flex flex-col gap-1">
      <span class="text-sm text-text-2">{local.label}</span>
      <input
        {...inputProps}
        class={`rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text-1 outline-none focus:border-border-strong ${inputProps.class ?? ''}`}
      />
    </label>
  )
}
