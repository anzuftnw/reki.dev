import { createResource, For, Show } from 'solid-js'
import { projects } from '@/lib/collections/projects'
import { ProjectCard } from '@/routes/projects/components/ProjectCard'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

export default function Projects() {
  const [list] = createResource(() => projects.list())
  const { isOwner } = useAuth()
  const { editMode } = useUI()

  return (
    <section class="flex flex-col gap-6">
      <div class="flex items-baseline justify-between">
        <h1 class="text-xl font-semibold">Projects</h1>
        <Show when={isOwner() && editMode()}>
          <Button href="/projects/new" size="sm">
            New project
          </Button>
        </Show>
      </div>

      <Show when={!list.loading} fallback={<p class="text-sm text-text-3">Loading…</p>}>
        <Show when={list()?.length} fallback={<p class="text-sm text-text-3">No projects yet.</p>}>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <For each={list()}>{(project) => <ProjectCard project={project} />}</For>
          </div>
        </Show>
      </Show>
    </section>
  )
}
