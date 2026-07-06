import { splitProps, type ComponentProps } from 'solid-js'

interface InputProps extends ComponentProps<'input'> {
  label: string
}

export function Input(props: InputProps) {
  const [local, inputProps] = splitProps(props, ['label'])

  return (
    <label>
      <span>{local.label}</span>
      <input {...inputProps} />
    </label>
  )
}
