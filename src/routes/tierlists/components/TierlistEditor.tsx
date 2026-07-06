import { createSignal, Show } from 'solid-js'
import { useAuth } from '@/context/AuthContext'
import { tierlists, type Tierlist, type Tier } from '@/lib/collections/tierlists'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F']

export function TierlistEditor(props: { tierlist: Tierlist; onChange: () => void }) {
  const { isOwner } = useAuth()
  const [label, setLabel] = createSignal('')
  const [tier, setTier] = createSignal<Tier>('S')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const entries = [
      ...props.tierlist.entries,
      { id: crypto.randomUUID(), tier: tier(), position: props.tierlist.entries.length, label: label() },
    ]
    await tierlists.update(props.tierlist.id, { entries })
    setLabel('')
    props.onChange()
  }

  return (
    <Show when={isOwner()}>
      <form onSubmit={handleSubmit}>
        <Input label="Entry" value={label()} onInput={(e) => setLabel(e.currentTarget.value)} />
        <label>
          <span>Tier</span>
          <select value={tier()} onChange={(e) => setTier(e.currentTarget.value as Tier)}>
            {TIERS.map((t) => (
              <option value={t}>{t}</option>
            ))}
          </select>
        </label>
        <Button type="submit">Add entry</Button>
      </form>
    </Show>
  )
}
