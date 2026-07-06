import { createResource, For, Show } from 'solid-js'
import { blog } from '@/lib/collections/blog'
import { PostCard } from '@/routes/blog/components/PostCard'

export default function BlogList() {
  const [posts] = createResource(() => blog.list())

  return (
    <section>
      <h1>Blog</h1>
      <Show when={!posts.loading} fallback={<p>Loading...</p>}>
        <ul>
          <For each={posts()}>
            {(post) => (
              <li>
                <PostCard post={post} />
              </li>
            )}
          </For>
        </ul>
      </Show>
    </section>
  )
}
