import { createEffect, createSignal, Show } from 'solid-js'
import { Switch } from '@/components/ui/Switch'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { slugify } from '@/lib/slugify'
import type { BlogPost, BlogPostInput } from '@/lib/collections/blog'

export function PostForm(props: {
  initial?: BlogPost
  onSubmit: (data: BlogPostInput) => Promise<void>
  submitLabel: string
}) {
  const [title, setTitle] = createSignal(props.initial?.title ?? '')
  const [slug, setSlug] = createSignal(props.initial?.slug ?? '')
  const [slugTouched, setSlugTouched] = createSignal(!!props.initial)
  const [excerpt, setExcerpt] = createSignal(props.initial?.excerpt ?? '')
  const [tags, setTags] = createSignal(props.initial?.tags?.join(', ') ?? '')
  const [body, setBody] = createSignal(props.initial?.body ?? '')
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
        body: body(),
        excerpt: excerpt() || undefined,
        tags: tags()
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        cover: cover(),
        publishedAt: published() ? (props.initial?.publishedAt ?? new Date().toISOString()) : null,
      })
    } catch {
      setError('Something went wrong saving this post.')
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
      <Input label="Excerpt" value={excerpt()} onInput={(e) => setExcerpt(e.currentTarget.value)} />
      <Input label="Tags (comma-separated)" value={tags()} onInput={(e) => setTags(e.currentTarget.value)} />

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
        label="Body (Markdown)"
        rows={16}
        value={body()}
        onInput={(e) => setBody(e.currentTarget.value)}
        required
      />

      <Switch checked={published()} onChange={setPublished} labelOn="Published" labelOff="Draft" />

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
