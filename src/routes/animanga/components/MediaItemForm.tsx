import { createSignal, Show } from 'solid-js'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface MediaItemFormProps {
  onSubmit: (data: { title: string; score: number }) => void | Promise<void>
}

export function MediaItemForm(props: MediaItemFormProps) {
  const { isOwner } = useAuth()
  const [title, setTitle] = createSignal('')
  const [score, setScore] = createSignal(0)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    await props.onSubmit({ title: title(), score: score() })
    setTitle('')
    setScore(0)
  }

  return (
    <Show when={isOwner()}>
      <form onSubmit={handleSubmit}>
        <Input label="Title" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} />
        <Input
          label="Score"
          type="number"
          value={score()}
          onInput={(e) => setScore(Number(e.currentTarget.value))}
        />
        <Button type="submit">Add</Button>
      </form>
    </Show>
  )
}
