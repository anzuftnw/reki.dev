import { createResource, Show } from 'solid-js'
import { useParams } from '@solidjs/router'
import { blog } from '@/lib/collections/blog'

export default function BlogPost() {
  const params = useParams<{ slug: string }>()
  const [post] = createResource(() => params.slug, (slug) => blog.getBySlug(slug))

  return (
    <Show when={post()} fallback={<p>Loading...</p>}>
      {(post) => (
        <article>
          <h1>{post().title}</h1>
          <p>{post().publishedAt}</p>
          <p>{post().body}</p>
        </article>
      )}
    </Show>
  )
}
