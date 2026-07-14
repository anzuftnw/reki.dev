import { splitProps, type ComponentProps } from 'solid-js'

interface TextareaProps extends ComponentProps<'textarea'> {
  label: string
}

export function Textarea(props: TextareaProps) {
  const [local, textareaProps] = splitProps(props, ['label'])

  return (
    <label class="flex flex-col gap-1">
      <span class="text-sm text-text-2">{local.label}</span>
      <textarea
        {...textareaProps}
        class={`rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm text-text-1 outline-none focus:border-border-strong ${textareaProps.class ?? ''}`}
      />
    </label>
  )
}
