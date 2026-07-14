import { createResource, createSignal, For, Show, type JSX } from 'solid-js'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { gameHistory, type GameHistoryEntry } from '@/lib/collections/games/history'
import { formatDate } from '@/lib/format'

export interface GenericHistoryTabConfig {
  game: string
  category: string
  renderExtra?: (entry: GameHistoryEntry) => JSX.Element
}

export function GenericHistoryTab(props: { config: GenericHistoryTabConfig }) {
  const [entries, { refetch }] = createResource(
    () => [props.config.game, props.config.category] as const,
    ([game, category]) => gameHistory.listByCategory(game, category),
  )
  const { isOwner } = useAuth()
  const { editMode } = useUI()
  const [editingId, setEditingId] = createSignal<string | null>(null)
  const [creating, setCreating] = createSignal(false)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return
    await gameHistory.remove(id)
    refetch()
  }

  return (
    <div class="flex flex-col gap-3">
      <Show when={isOwner() && editMode()}>
        <div>
          <Button size="sm" onClick={() => setCreating(true)}>
            New entry
          </Button>
        </div>
      </Show>

      <Show when={creating()}>
        <EntryForm
          config={props.config}
          submitLabel="Save"
          onCancel={() => setCreating(false)}
          onSaved={() => {
            setCreating(false)
            refetch()
          }}
        />
      </Show>

      <ul class="flex flex-col divide-y divide-border">
        <For each={entries()}>
          {(entry) => (
            <Show
              when={editingId() !== entry.id}
              fallback={
                <EntryForm
                  config={props.config}
                  initial={entry}
                  submitLabel="Save changes"
                  onCancel={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null)
                    refetch()
                  }}
                />
              }
            >
              <li class="flex items-center justify-between gap-3 py-3">
                <div class="flex items-center gap-3">
                  <span class="w-24 shrink-0 font-mono text-xs text-text-3">{formatDate(entry.occurredAt)}</span>
                  <span class="text-sm text-text-1">{entry.label}</span>
                  <Show when={entry.isFeatured}>
                    <span class="text-xs text-accent">★</span>
                  </Show>
                  {props.config.renderExtra?.(entry)}
                </div>
                <Show when={isOwner() && editMode()}>
                  <div class="flex shrink-0 gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(entry.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(entry.id)}>
                      Delete
                    </Button>
                  </div>
                </Show>
              </li>
            </Show>
          )}
        </For>
      </ul>

      <Show when={!entries.loading && entries()?.length === 0 && !creating()}>
        <p class="text-sm text-text-3">No history yet.</p>
      </Show>
    </div>
  )
}

function EntryForm(props: {
  config: GenericHistoryTabConfig
  initial?: GameHistoryEntry
  submitLabel: string
  onCancel: () => void
  onSaved: () => void
}) {
  const [occurredAt, setOccurredAt] = createSignal(props.initial?.occurredAt?.slice(0, 10) ?? '')
  const [label, setLabel] = createSignal(props.initial?.label ?? '')
  const [rarity, setRarity] = createSignal(props.initial?.rarity?.toString() ?? '')
  const [isFeatured, setIsFeatured] = createSignal(!!props.initial?.isFeatured)
  const [notes, setNotes] = createSignal(props.initial?.notes ?? '')
  const [submitting, setSubmitting] = createSignal(false)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const data = {
      game: props.config.game,
      category: props.config.category,
      occurredAt: new Date(occurredAt()).toISOString(),
      label: label(),
      rarity: rarity() ? Number(rarity()) : undefined,
      isFeatured: isFeatured() || undefined,
      notes: notes() || undefined,
    }
    if (props.initial) {
      await gameHistory.update(props.initial.id, data)
    } else {
      await gameHistory.create(data)
    }
    props.onSaved()
  }

  return (
    <form onSubmit={handleSubmit} class="flex max-w-md flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4">
      <Input
        label="Date"
        type="date"
        value={occurredAt()}
        onInput={(e) => setOccurredAt(e.currentTarget.value)}
        required
      />
      <Input label="Label" value={label()} onInput={(e) => setLabel(e.currentTarget.value)} required />
      <Input
        label="Rarity (optional)"
        type="number"
        min="1"
        max="6"
        value={rarity()}
        onInput={(e) => setRarity(e.currentTarget.value)}
      />
      <label class="flex items-center gap-2 text-sm text-text-2">
        <input type="checkbox" checked={isFeatured()} onChange={(e) => setIsFeatured(e.currentTarget.checked)} />
        Featured
      </label>
      <Input label="Notes" value={notes()} onInput={(e) => setNotes(e.currentTarget.value)} />

      <div class="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={submitting()}>
          {props.submitLabel}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
