import { createResource, For, Show } from 'solid-js'
import { blog } from '@/lib/collections/blog'
import { PostCard } from '@/routes/blog/components/PostCard'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

export default function BlogList() {
  const [posts] = createResource(() => blog.list())
  const { isOwner } = useAuth()
  const { editMode } = useUI()

  return (
    <section class="flex flex-col gap-6">
      <div class="flex items-baseline justify-between">
        <h1 class="text-xl font-semibold">Blog</h1>
        <Show when={isOwner() && editMode()}>
          <Button href="/blog/new" size="sm">
            New post
          </Button>
        </Show>
      </div>

      <Show when={!posts.loading} fallback={<p class="text-sm text-text-3">Loading…</p>}>
        <Show when={posts()?.length} fallback={<p class="text-sm text-text-3">No posts yet.</p>}>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <For each={posts()}>{(post) => <PostCard post={post} />}</For>
          </div>
        </Show>
      </Show>
    </section>
  )
}
