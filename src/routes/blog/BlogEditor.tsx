import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { blog } from '@/lib/collections/blog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function BlogEditor() {
  const navigate = useNavigate()
  const [title, setTitle] = createSignal('')
  const [slug, setSlug] = createSignal('')
  const [body, setBody] = createSignal('')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const post = await blog.create({
      title: title(),
      slug: slug(),
      body: body(),
      publishedAt: new Date().toISOString(),
    })
    navigate(`/blog/${post.slug}`)
  }

  return (
    <section>
      <h1>New post</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Title" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} />
        <Input label="Slug" value={slug()} onInput={(e) => setSlug(e.currentTarget.value)} />
        <label>
          <span>Body</span>
          <textarea value={body()} onInput={(e) => setBody(e.currentTarget.value)} />
        </label>
        <Button type="submit">Publish</Button>
      </form>
    </section>
  )
}
