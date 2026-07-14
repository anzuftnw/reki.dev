import { useNavigate } from '@solidjs/router'
import { blog } from '@/lib/collections/blog'
import { PostForm } from '@/routes/blog/components/PostForm'

export default function BlogEditor() {
  const navigate = useNavigate()

  return (
    <section class="flex flex-col gap-6">
      <h1 class="text-xl font-semibold">New post</h1>
      <PostForm
        submitLabel="Save"
        onSubmit={async (data) => {
          const post = await blog.create(data)
          navigate(`/blog/${post.slug}`)
        }}
      />
    </section>
  )
}
