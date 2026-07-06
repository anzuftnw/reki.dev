import { A } from '@solidjs/router'
import type { BlogPost } from '@/lib/collections/blog'

export function PostCard(props: { post: BlogPost }) {
  return (
    <article>
      <h3><A href={`/blog/${props.post.slug}`}>{props.post.title}</A></h3>
      <p>{props.post.publishedAt}</p>
    </article>
  )
}
