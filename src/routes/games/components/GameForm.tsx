import { createEffect, createSignal, Show } from 'solid-js'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { slugify } from '@/lib/slugify'
import type { Game, GameInput, GameStatus } from '@/lib/collections/games/games'

const STATUSES: GameStatus[] = ['active', 'paused', 'retired']

export function GameForm(props: { initial?: Game; submitLabel: string; onSubmit: (data: GameInput) => Promise<void> }) {
  const [name, setName] = createSignal(props.initial?.name ?? '')
  const [slug, setSlug] = createSignal(props.initial?.slug ?? '')
  const [slugTouched, setSlugTouched] = createSignal(!!props.initial)
  const [tagline, setTagline] = createSignal(props.initial?.tagline ?? '')
  const [order, setOrder] = createSignal(props.initial?.order?.toString() ?? '')
  const [status, setStatus] = createSignal<GameStatus>(props.initial?.status ?? 'active')
  const [cover, setCover] = createSignal<File | null>(null)
  const [submitting, setSubmitting] = createSignal(false)
  const [error, setError] = createSignal('')

  createEffect(() => {
    if (!slugTouched()) setSlug(slugify(name()))
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await props.onSubmit({
        name: name(),
        slug: slug(),
        tagline: tagline() || undefined,
        order: order() ? Number(order()) : undefined,
        status: status(),
        cover: cover(),
      })
    } catch {
      setError('Something went wrong saving this game.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} class="flex max-w-md flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4">
      <Input label="Name" value={name()} onInput={(e) => setName(e.currentTarget.value)} required />
      <Input
        label="Slug"
        value={slug()}
        onInput={(e) => {
          setSlugTouched(true)
          setSlug(e.currentTarget.value)
        }}
        required
      />
      <Input label="Tagline" value={tagline()} onInput={(e) => setTagline(e.currentTarget.value)} />
      <Input label="Order" type="number" value={order()} onInput={(e) => setOrder(e.currentTarget.value)} />

      <label class="flex flex-col gap-1">
        <span class="text-sm text-text-2">Status</span>
        <select
          value={status()}
          onChange={(e) => setStatus(e.currentTarget.value as GameStatus)}
          class="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-1"
        >
          {STATUSES.map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm text-text-2">Cover image</span>
        <input
          type="file"
          accept="image/*"
          onInput={(e) => setCover(e.currentTarget.files?.[0] ?? null)}
          class="text-sm text-text-2"
        />
      </label>

      <div class="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={submitting()}>
          {props.submitLabel}
        </Button>
        <Show when={error()}>
          <p role="alert" class="text-sm text-red-soft">
            {error()}
          </p>
        </Show>
      </div>
    </form>
  )
}
