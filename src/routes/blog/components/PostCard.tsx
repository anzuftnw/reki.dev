import { A } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'
import { blog, type BlogPost } from '@/lib/collections/blog'

export function PostCard(props: { post: BlogPost }) {
  const cover = () => blog.coverUrl(props.post)

  return (
    <A href={`/blog/${props.post.slug}`} class="block h-full">
      <article class="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:-translate-y-0.5 hover:border-border-strong">
        <Show when={cover()}>
          {(url) => <img src={url()} alt="" class="h-36 w-full object-cover" />}
        </Show>
        <div class="flex flex-1 flex-col gap-2 p-4">
          <h3 class="text-lg font-semibold text-text-1">{props.post.title}</h3>
          <Show when={props.post.excerpt}>
            <p class="line-clamp-2 text-sm text-text-2">{props.post.excerpt}</p>
          </Show>
          <div class="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <Show when={props.post.publishedAt} fallback={<StatusBadge status="Draft" />}>
              {(date) => <span class="font-mono text-2xs text-text-3">{formatDate(date())}</span>}
            </Show>
            <For each={props.post.tags}>{(tag) => <StatusBadge status={tag} />}</For>
          </div>
        </div>
      </article>
    </A>
  )
}
