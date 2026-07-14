export function Switch(props: {
  checked: boolean
  onChange: (checked: boolean) => void
  labelOn: string
  labelOff: string
  class?: string
}) {
  return (
    <label
      class={`flex h-8 w-fit cursor-pointer items-center rounded-md border border-border-strong bg-surface-1/50 px-3 text-sm text-text-2 transition-colors hover:bg-surface-3 hover:text-text-1 ${props.class ?? ''}`}
    >
      <input
        type="checkbox"
        class="sr-only"
        checked={props.checked}
        onChange={(e) => props.onChange(e.currentTarget.checked)}
      />
      {props.checked ? props.labelOn : props.labelOff}
    </label>
  )
}
