import { createEffect, createSignal, For, Show } from 'solid-js'
import { Switch } from '@/components/ui/Switch'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { slugify } from '@/lib/slugify'
import type { Project, ProjectInput, ProjectStatus } from '@/lib/collections/projects'

const STATUS_OPTIONS: ProjectStatus[] = ['wip', 'complete', 'archived']

export function ProjectForm(props: {
  initial?: Project
  onSubmit: (data: ProjectInput) => Promise<void>
  submitLabel: string
}) {
  const [title, setTitle] = createSignal(props.initial?.title ?? '')
  const [slug, setSlug] = createSignal(props.initial?.slug ?? '')
  const [slugTouched, setSlugTouched] = createSignal(!!props.initial)
  const [summary, setSummary] = createSignal(props.initial?.summary ?? '')
  const [body, setBody] = createSignal(props.initial?.body ?? '')
  const [codeUrl, setCodeUrl] = createSignal(props.initial?.codeUrl ?? '')
  const [liveUrl, setLiveUrl] = createSignal(props.initial?.liveUrl ?? '')
  const [tech, setTech] = createSignal(props.initial?.tech?.join(', ') ?? '')
  const [status, setStatus] = createSignal<ProjectStatus>(props.initial?.status ?? 'wip')
  const [featured, setFeatured] = createSignal(!!props.initial?.featured)
  const [published, setPublished] = createSignal(!!props.initial?.publishedAt)
  const [cover, setCover] = createSignal<File | null>(null)
  const [submitting, setSubmitting] = createSignal(false)
  const [error, setError] = createSignal('')

  createEffect(() => {
    if (!slugTouched()) setSlug(slugify(title()))
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await props.onSubmit({
        title: title(),
        slug: slug(),
        summary: summary(),
        body: body() || undefined,
        codeUrl: codeUrl() || undefined,
        liveUrl: liveUrl() || undefined,
        tech: tech()
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        status: status(),
        featured: featured(),
        cover: cover(),
        publishedAt: published() ? (props.initial?.publishedAt ?? new Date().toISOString()) : null,
      })
    } catch {
      setError('Something went wrong saving this project.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} class="flex max-w-2xl flex-col gap-4">
      <Input label="Title" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} required />
      <Input
        label="Slug"
        value={slug()}
        onInput={(e) => {
          setSlugTouched(true)
          setSlug(e.currentTarget.value)
        }}
        required
      />
      <Input label="Summary" value={summary()} onInput={(e) => setSummary(e.currentTarget.value)} required />
      <Input label="Code URL" type="url" value={codeUrl()} onInput={(e) => setCodeUrl(e.currentTarget.value)} />
      <Input label="Live URL" type="url" value={liveUrl()} onInput={(e) => setLiveUrl(e.currentTarget.value)} />
      <Input label="Tech (comma-separated)" value={tech()} onInput={(e) => setTech(e.currentTarget.value)} />

      <label class="flex flex-col gap-1">
        <span class="text-sm text-text-2">Status</span>
        <select
          value={status()}
          onInput={(e) => setStatus(e.currentTarget.value as ProjectStatus)}
          class="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-1 outline-none focus:border-border-strong"
        >
          <For each={STATUS_OPTIONS}>{(s) => <option value={s}>{s}</option>}</For>
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

      <Textarea
        label="Body (Markdown, optional)"
        rows={12}
        value={body()}
        onInput={(e) => setBody(e.currentTarget.value)}
      />

      <div class="flex flex-wrap items-center gap-4">
        <Switch checked={featured()} onChange={setFeatured} labelOn="Featured" labelOff="Not featured" />
        <Switch checked={published()} onChange={setPublished} labelOn="Published" labelOff="Draft" />
      </div>

      <div class="flex items-center gap-3">
        <Button type="submit" disabled={submitting()}>
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
