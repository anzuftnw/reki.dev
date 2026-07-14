import { createResource, createSignal, For, Show, type JSX } from 'solid-js'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { gameTeams, type GameTeam, type TeamSlot } from '@/lib/collections/games/teams'

export interface SlotOption {
  id: string
  label: string
}

export interface GenericTeamsTabConfig {
  game: string
  refCollection: string
  slotOptions: () => SlotOption[]
  renderSlot: (slot: TeamSlot) => JSX.Element
}

export function GenericTeamsTab(props: { config: GenericTeamsTabConfig }) {
  const [teams, { refetch }] = createResource(() => props.config.game, gameTeams.listByGame)
  const { isOwner } = useAuth()
  const { editMode } = useUI()
  const [editingId, setEditingId] = createSignal<string | null>(null)
  const [creating, setCreating] = createSignal(false)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this team?')) return
    await gameTeams.remove(id)
    refetch()
  }

  return (
    <div class="flex flex-col gap-4">
      <Show when={isOwner() && editMode()}>
        <div>
          <Button size="sm" onClick={() => setCreating(true)}>
            New team
          </Button>
        </div>
      </Show>

      <Show when={creating()}>
        <TeamForm
          config={props.config}
          submitLabel="Save"
          onCancel={() => setCreating(false)}
          onSaved={() => {
            setCreating(false)
            refetch()
          }}
        />
      </Show>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={teams()}>
          {(team) => (
            <Show
              when={editingId() !== team.id}
              fallback={
                <TeamForm
                  config={props.config}
                  initial={team}
                  submitLabel="Save changes"
                  onCancel={() => setEditingId(null)}
                  onSaved={() => {
                    setEditingId(null)
                    refetch()
                  }}
                />
              }
            >
              <article class="flex flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="font-medium text-text-1">{team.name}</h3>
                  <Show when={isOwner() && editMode()}>
                    <div class="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(team.id)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(team.id)}>
                        Delete
                      </Button>
                    </div>
                  </Show>
                </div>
                <div class="flex flex-wrap gap-2">
                  <For each={team.slots}>{(slot) => props.config.renderSlot(slot)}</For>
                </div>
                <Show when={team.notes}>
                  <p class="text-sm text-text-3">{team.notes}</p>
                </Show>
              </article>
            </Show>
          )}
        </For>
      </div>

      <Show when={!teams.loading && teams()?.length === 0 && !creating()}>
        <p class="text-sm text-text-3">No teams yet.</p>
      </Show>
    </div>
  )
}

function TeamForm(props: {
  config: GenericTeamsTabConfig
  initial?: GameTeam
  submitLabel: string
  onCancel: () => void
  onSaved: () => void
}) {
  const [name, setName] = createSignal(props.initial?.name ?? '')
  const [notes, setNotes] = createSignal(props.initial?.notes ?? '')
  const [slots, setSlots] = createSignal<TeamSlot[]>(props.initial?.slots ?? [])
  const [submitting, setSubmitting] = createSignal(false)

  const addSlot = () => {
    const first = props.config.slotOptions()[0]
    if (!first) return
    setSlots([...slots(), { refCollection: props.config.refCollection, refId: first.id, role: '' }])
  }
  const updateSlot = (index: number, patch: Partial<TeamSlot>) =>
    setSlots(slots().map((s, i) => (i === index ? { ...s, ...patch } : s)))
  const removeSlot = (index: number) => setSlots(slots().filter((_, i) => i !== index))

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const data = { game: props.config.game, name: name(), slots: slots(), notes: notes() || undefined }
    if (props.initial) {
      await gameTeams.update(props.initial.id, data)
    } else {
      await gameTeams.create(data)
    }
    props.onSaved()
  }

  return (
    <form onSubmit={handleSubmit} class="flex max-w-lg flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4">
      <Input label="Team name" value={name()} onInput={(e) => setName(e.currentTarget.value)} required />

      <div class="flex flex-col gap-2">
        <span class="text-sm text-text-2">Slots</span>
        <For each={slots()}>
          {(slot, index) => (
            <div class="flex items-center gap-2">
              <select
                value={slot.refId}
                onChange={(e) => updateSlot(index(), { refId: e.currentTarget.value })}
                class="flex-1 rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
              >
                <For each={props.config.slotOptions()}>{(opt) => <option value={opt.id}>{opt.label}</option>}</For>
              </select>
              <input
                placeholder="Role"
                value={slot.role ?? ''}
                onInput={(e) => updateSlot(index(), { role: e.currentTarget.value })}
                class="w-28 rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
              />
              <Button type="button" size="sm" variant="ghost" onClick={() => removeSlot(index())}>
                Remove
              </Button>
            </div>
          )}
        </For>
        <div>
          <Button type="button" size="sm" variant="secondary" onClick={addSlot}>
            Add slot
          </Button>
        </div>
      </div>

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
