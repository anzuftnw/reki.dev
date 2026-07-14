import { createEffect, createResource, createSignal, For, onCleanup, Show } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { blog } from '@/lib/collections/blog'
import { useUI } from '@/context/UIContext'
import { useAuth } from '@/context/AuthContext'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PostForm } from '@/routes/blog/components/PostForm'

export default function BlogPost() {
  const params = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, { refetch }] = createResource(() => params.slug, (slug) => blog.getBySlug(slug))
  const [html] = createResource(
    () => post()?.body,
    (body) => import('@/lib/markdown/renderMarkdown').then((m) => m.renderMarkdown(body)),
  )
  const { setPageTitle, editMode } = useUI()
  const { isOwner } = useAuth()
  const [editing, setEditing] = createSignal(false)

  createEffect(() => setPageTitle(post()?.title ?? null))
  onCleanup(() => setPageTitle(null))

  const handleDelete = async () => {
    const current = post()
    if (!current) return
    if (!window.confirm(`Delete "${current.title}"? This can't be undone.`)) return
    await blog.remove(current.id)
    navigate('/blog')
  }

  return (
    <Show when={!post.loading} fallback={<p class="text-sm text-text-3">Loading…</p>}>
      <Show when={post()} fallback={<p class="text-sm text-text-3">Post not found.</p>}>
        {(current) => (
          <Show
            when={!editing()}
            fallback={
              <PostForm
                initial={current()}
                submitLabel="Save changes"
                onSubmit={async (data) => {
                  await blog.update(current().id, data)
                  setEditing(false)
                  refetch()
                }}
              />
            }
          >
            <article class="flex max-w-2xl flex-col gap-6">
              <header class="flex flex-col gap-3">
                <div class="flex flex-wrap items-center gap-2">
                  <Show when={current().publishedAt} fallback={<StatusBadge status="Draft" />}>
                    {(date) => <span class="font-mono text-xs text-text-3">{formatDate(date())}</span>}
                  </Show>
                  <For each={current().tags}>{(tag) => <StatusBadge status={tag} />}</For>
                </div>
                <h1 class="text-3xl font-semibold text-text-1">{current().title}</h1>
                <Show when={isOwner() && editMode()}>
                  <div class="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </Show>
              </header>

              <Show when={html()} fallback={<p class="text-sm text-text-3">Rendering…</p>}>
                {(rendered) => <div class="markdown-body" innerHTML={rendered()} />}
              </Show>
            </article>
          </Show>
        )}
      </Show>
    </Show>
  )
}
