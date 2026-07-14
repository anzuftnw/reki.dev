import { createSignal, For, Show, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export interface RelationOption {
  id: string
  label: string
}

export type EntityFieldConfig<T> =
  | { type: 'text'; key: Extract<keyof T, string>; label: string; required?: boolean }
  | { type: 'textarea'; key: Extract<keyof T, string>; label: string; required?: boolean }
  | { type: 'number'; key: Extract<keyof T, string>; label: string; min?: number; max?: number; required?: boolean }
  | { type: 'select'; key: Extract<keyof T, string>; label: string; options: string[]; required?: boolean }
  | { type: 'multiselect'; key: Extract<keyof T, string>; label: string; options: string[] }
  | { type: 'date'; key: Extract<keyof T, string>; label: string; required?: boolean }
  | { type: 'bool'; key: Extract<keyof T, string>; label: string }
  | { type: 'file'; key: Extract<keyof T, string>; label: string; required?: boolean }
  | { type: 'relation'; key: Extract<keyof T, string>; label: string; options: () => RelationOption[]; multi?: boolean }

// Config-driven form for the 9 Animanga/Music lists -- their fields are heterogeneous
// (text/number/select/multiselect/date/bool/file/relation) but the same handful of field
// *shapes* repeat across all 9, so one renderer driven by an EntityFieldConfig[] avoids
// hand-writing 9 near-identical forms.
export function GenericEntityForm<T extends object>(props: {
  fields: EntityFieldConfig<T>[]
  initial?: Partial<T>
  submitLabel: string
  onCancel?: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<void>
}) {
  const initialValues = () => {
    const values: Record<string, unknown> = {}
    for (const field of props.fields) {
      const raw = props.initial?.[field.key]
      if (field.type === 'multiselect') values[field.key] = (raw as string[] | undefined) ?? []
      else if (field.type === 'relation') values[field.key] = field.multi ? ((raw as string[] | undefined) ?? []) : ((raw as string | undefined) ?? '')
      else if (field.type === 'bool') values[field.key] = !!raw
      else if (field.type === 'file') values[field.key] = null
      else if (field.type === 'number') values[field.key] = raw != null ? String(raw) : ''
      else if (field.type === 'date') values[field.key] = (raw as string | undefined)?.slice(0, 10) ?? ''
      else values[field.key] = (raw as string | undefined) ?? ''
    }
    return values
  }

  const [values, setValues] = createStore<Record<string, any>>(initialValues())
  const [submitting, setSubmitting] = createSignal(false)
  const [error, setError] = createSignal('')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const payload: Record<string, unknown> = {}
    for (const field of props.fields) {
      const raw = values[field.key]
      if (field.type === 'number') payload[field.key] = raw === '' ? undefined : Number(raw)
      else if (field.type === 'date') payload[field.key] = raw === '' ? undefined : new Date(raw).toISOString()
      else if (field.type === 'text' || field.type === 'textarea' || field.type === 'select') {
        payload[field.key] = raw === '' ? undefined : raw
      } else payload[field.key] = raw
    }
    try {
      await props.onSubmit(payload)
    } catch {
      setError('Something went wrong saving this.')
      setSubmitting(false)
    }
  }

  const toggleInArray = (key: string, value: string) => {
    const current = (values[key] as string[]) ?? []
    setValues(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value])
  }

  const renderField = (field: EntityFieldConfig<T>): JSX.Element => {
    if (field.type === 'text') {
      return (
        <Input
          label={field.label}
          value={values[field.key]}
          onInput={(e) => setValues(field.key, e.currentTarget.value)}
          required={field.required}
        />
      )
    }
    if (field.type === 'textarea') {
      return (
        <Textarea
          label={field.label}
          rows={4}
          value={values[field.key]}
          onInput={(e) => setValues(field.key, e.currentTarget.value)}
          required={field.required}
        />
      )
    }
    if (field.type === 'number') {
      return (
        <Input
          label={field.label}
          type="number"
          min={field.min}
          max={field.max}
          value={values[field.key]}
          onInput={(e) => setValues(field.key, e.currentTarget.value)}
          required={field.required}
        />
      )
    }
    if (field.type === 'date') {
      return (
        <Input
          label={field.label}
          type="date"
          value={values[field.key]}
          onInput={(e) => setValues(field.key, e.currentTarget.value)}
          required={field.required}
        />
      )
    }
    if (field.type === 'select') {
      return (
        <label class="flex flex-col gap-1">
          <span class="text-sm text-text-2">{field.label}</span>
          <select
            value={values[field.key]}
            onChange={(e) => setValues(field.key, e.currentTarget.value)}
            class="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-1"
          >
            <Show when={!field.required}>
              <option value="">—</option>
            </Show>
            <For each={field.options}>{(opt) => <option value={opt}>{opt}</option>}</For>
          </select>
        </label>
      )
    }
    if (field.type === 'bool') {
      return (
        <label class="flex items-center gap-2 text-sm text-text-2">
          <input
            type="checkbox"
            checked={values[field.key]}
            onChange={(e) => setValues(field.key, e.currentTarget.checked)}
          />
          {field.label}
        </label>
      )
    }
    if (field.type === 'file') {
      return (
        <label class="flex flex-col gap-1">
          <span class="text-sm text-text-2">{field.label}</span>
          <input
            type="file"
            accept="image/*"
            onInput={(e) => setValues(field.key, e.currentTarget.files?.[0] ?? null)}
            class="text-sm text-text-2"
          />
        </label>
      )
    }
    if (field.type === 'multiselect') {
      return (
        <div class="flex flex-col gap-1">
          <span class="text-sm text-text-2">{field.label}</span>
          <div class="flex flex-wrap gap-1">
            <For each={field.options}>
              {(opt) => {
                const selected = () => ((values[field.key] as string[]) ?? []).includes(opt)
                return (
                  <button
                    type="button"
                    onClick={() => toggleInArray(field.key, opt)}
                    class={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                      selected() ? 'border-accent bg-accent/10 text-accent' : 'border-border-strong text-text-3 hover:text-text-1'
                    }`}
                  >
                    {opt}
                  </button>
                )
              }}
            </For>
          </div>
        </div>
      )
    }
    // relation
    if (field.multi) {
      return (
        <div class="flex flex-col gap-1">
          <span class="text-sm text-text-2">{field.label}</span>
          <div class="flex flex-wrap gap-1">
            <For each={field.options()}>
              {(opt) => {
                const selected = () => ((values[field.key] as string[]) ?? []).includes(opt.id)
                return (
                  <button
                    type="button"
                    onClick={() => toggleInArray(field.key, opt.id)}
                    class={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
                      selected() ? 'border-accent bg-accent/10 text-accent' : 'border-border-strong text-text-3 hover:text-text-1'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              }}
            </For>
          </div>
        </div>
      )
    }
    return (
      <label class="flex flex-col gap-1">
        <span class="text-sm text-text-2">{field.label}</span>
        <select
          value={values[field.key]}
          onChange={(e) => setValues(field.key, e.currentTarget.value)}
          class="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-1"
        >
          <option value="">—</option>
          <For each={field.options()}>{(opt) => <option value={opt.id}>{opt.label}</option>}</For>
        </select>
      </label>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      class="col-span-full flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4"
    >
      <For each={props.fields}>{(field) => renderField(field)}</For>

      <div class="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={submitting()}>
          {props.submitLabel}
        </Button>
        <Show when={props.onCancel}>
          <Button type="button" size="sm" variant="ghost" onClick={props.onCancel}>
            Cancel
          </Button>
        </Show>
        <Show when={error()}>
          <p role="alert" class="text-sm text-red-soft">
            {error()}
          </p>
        </Show>
      </div>
    </form>
  )
}
