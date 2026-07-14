import { createEffect, createResource, createSignal, For, onCleanup, Show } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { projects } from '@/lib/collections/projects'
import { useUI } from '@/context/UIContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProjectForm } from '@/routes/projects/components/ProjectForm'

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [project, { refetch }] = createResource(() => params.slug, (slug) => projects.getBySlug(slug))
  const [html] = createResource(
    () => project()?.body,
    (body) =>
      body ? import('@/lib/markdown/renderMarkdown').then((m) => m.renderMarkdown(body)) : Promise.resolve(null),
  )
  const { setPageTitle, editMode } = useUI()
  const { isOwner } = useAuth()
  const [editing, setEditing] = createSignal(false)

  createEffect(() => setPageTitle(project()?.title ?? null))
  onCleanup(() => setPageTitle(null))

  const handleDelete = async () => {
    const current = project()
    if (!current) return
    if (!window.confirm(`Delete "${current.title}"? This can't be undone.`)) return
    await projects.remove(current.id)
    navigate('/projects')
  }

  return (
    <Show when={!project.loading} fallback={<p class="text-sm text-text-3">Loading…</p>}>
      <Show when={project()} fallback={<p class="text-sm text-text-3">Project not found.</p>}>
        {(current) => (
          <Show
            when={!editing()}
            fallback={
              <ProjectForm
                initial={current()}
                submitLabel="Save changes"
                onSubmit={async (data) => {
                  await projects.update(current().id, data)
                  setEditing(false)
                  refetch()
                }}
              />
            }
          >
            <article class="flex max-w-2xl flex-col gap-6">
              <header class="flex flex-col gap-3">
                <div class="flex flex-wrap items-center gap-2">
                  <StatusBadge status={current().status} />
                  <Show when={!current().publishedAt}>
                    <StatusBadge status="Draft" />
                  </Show>
                  <For each={current().tech}>{(tech) => <StatusBadge status={tech} />}</For>
                </div>
                <h1 class="text-3xl font-semibold text-text-1">{current().title}</h1>
                <p class="text-text-2">{current().summary}</p>
                <div class="flex flex-wrap items-center gap-3">
                  <Show when={current().codeUrl}>
                    {(url) => (
                      <a href={url()} target="_blank" rel="noreferrer" class="text-sm text-accent underline">
                        Code
                      </a>
                    )}
                  </Show>
                  <Show when={current().liveUrl}>
                    {(url) => (
                      <a href={url()} target="_blank" rel="noreferrer" class="text-sm text-accent underline">
                        Live
                      </a>
                    )}
                  </Show>
                </div>
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

              <Show when={html()}>{(rendered) => <div class="markdown-body" innerHTML={rendered()} />}</Show>
            </article>
          </Show>
        )}
      </Show>
    </Show>
  )
}
