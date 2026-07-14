import { A } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { projects, type Project } from '@/lib/collections/projects'

export function ProjectCard(props: { project: Project }) {
  const cover = () => projects.coverUrl(props.project)

  return (
    <A href={`/projects/${props.project.slug}`} class="block h-full">
      <article class="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:-translate-y-0.5 hover:border-border-strong">
        <Show when={cover()}>
          {(url) => <img src={url()} alt="" class="h-36 w-full object-cover" />}
        </Show>
        <div class="flex flex-1 flex-col gap-2 p-4">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-lg font-semibold text-text-1">{props.project.title}</h3>
            <Show when={!props.project.publishedAt}>
              <StatusBadge status="Draft" />
            </Show>
          </div>
          <p class="line-clamp-2 text-sm text-text-2">{props.project.summary}</p>
          <div class="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <StatusBadge status={props.project.status} />
            <For each={props.project.tech}>{(tech) => <StatusBadge status={tech} />}</For>
          </div>
        </div>
      </article>
    </A>
  )
}
