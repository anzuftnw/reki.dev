import { createSignal, For, Show } from 'solid-js'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  arknightsCollection,
  type ArknightsCollectionEntry,
  type ArknightsOperator,
} from '@/lib/collections/games/arknights'

export function ArknightsEntryForm(props: {
  initial?: ArknightsCollectionEntry
  unownedOperators: ArknightsOperator[]
  onCancel: () => void
  onSaved: () => void
}) {
  const initialOperator = props.initial?.expand?.operator
  const [operatorId, setOperatorId] = createSignal(initialOperator?.id ?? props.unownedOperators[0]?.id ?? '')
  const [elite, setElite] = createSignal((props.initial?.elite ?? 0).toString())
  const [level, setLevel] = createSignal((props.initial?.level ?? 1).toString())
  const [potential, setPotential] = createSignal((props.initial?.potential ?? 1).toString())
  const [trust, setTrust] = createSignal((props.initial?.trust ?? 0).toString())
  // Skill level's valid range is 1-7 (min=1 in both the HTML input and the PB schema), so a
  // stored 0 only ever means "PocketBase's zero-value default for an unset optional number
  // field" -- never a real level. Collapse it back to blank here, or the field re-opens showing
  // "0" and trips the input's own min=1 constraint on next save.
  const orBlank = (n?: number) => (n ? n.toString() : '')
  const [skill1Level, setSkill1Level] = createSignal(orBlank(props.initial?.skill1Level))
  const [skill1Mastery, setSkill1Mastery] = createSignal(props.initial?.skill1Mastery?.toString() ?? '')
  const [skill2Level, setSkill2Level] = createSignal(orBlank(props.initial?.skill2Level))
  const [skill2Mastery, setSkill2Mastery] = createSignal(props.initial?.skill2Mastery?.toString() ?? '')
  const [skill3Level, setSkill3Level] = createSignal(orBlank(props.initial?.skill3Level))
  const [skill3Mastery, setSkill3Mastery] = createSignal(props.initial?.skill3Mastery?.toString() ?? '')
  const [module1Tier, setModule1Tier] = createSignal(props.initial?.module1Tier?.toString() ?? '')
  const [module2Tier, setModule2Tier] = createSignal(props.initial?.module2Tier?.toString() ?? '')
  const [skinsOwned, setSkinsOwned] = createSignal(props.initial?.skinsOwned?.join(', ') ?? '')
  const [favorite, setFavorite] = createSignal(!!props.initial?.favorite)
  const [notes, setNotes] = createSignal(props.initial?.notes ?? '')
  const [submitting, setSubmitting] = createSignal(false)

  const num = (v: string) => (v === '' ? undefined : Number(v))

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const data = {
      operator: operatorId(),
      elite: Number(elite()),
      level: Number(level()),
      potential: Number(potential()),
      trust: num(trust()),
      skill1Level: num(skill1Level()),
      skill1Mastery: num(skill1Mastery()),
      skill2Level: num(skill2Level()),
      skill2Mastery: num(skill2Mastery()),
      skill3Level: num(skill3Level()),
      skill3Mastery: num(skill3Mastery()),
      module1Tier: num(module1Tier()),
      module2Tier: num(module2Tier()),
      skinsOwned: skinsOwned()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      favorite: favorite() || undefined,
      notes: notes() || undefined,
    }
    if (props.initial) {
      await arknightsCollection.update(props.initial.id, data)
    } else {
      await arknightsCollection.create(data)
    }
    props.onSaved()
  }

  return (
    <form
      onSubmit={handleSubmit}
      class="col-span-full flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4"
    >
      <Show
        when={!props.initial}
        fallback={<p class="text-sm text-text-2">Operator: {initialOperator?.name}</p>}
      >
        <label class="flex flex-col gap-1">
          <span class="text-sm text-text-2">Operator</span>
          <select
            value={operatorId()}
            onChange={(e) => setOperatorId(e.currentTarget.value)}
            class="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-1"
          >
            <For each={props.unownedOperators}>{(op) => <option value={op.id}>{op.name}</option>}</For>
          </select>
        </label>
      </Show>

      <div class="grid grid-cols-3 gap-3">
        <label class="flex flex-col gap-1">
          <span class="text-sm text-text-2">Elite</span>
          <select
            value={elite()}
            onChange={(e) => setElite(e.currentTarget.value)}
            class="rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
          >
            <option value="0">E0</option>
            <option value="1">E1</option>
            <option value="2">E2</option>
          </select>
        </label>
        <Input label="Level" type="number" min="1" value={level()} onInput={(e) => setLevel(e.currentTarget.value)} />
        <label class="flex flex-col gap-1">
          <span class="text-sm text-text-2">Potential</span>
          <select
            value={potential()}
            onChange={(e) => setPotential(e.currentTarget.value)}
            class="rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
          >
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <option value={p}>P{p}</option>
            ))}
          </select>
        </label>
      </div>

      <Input label="Trust" type="number" min="0" max="200" value={trust()} onInput={(e) => setTrust(e.currentTarget.value)} />

      <div class="flex flex-col gap-2">
        <span class="text-sm text-text-2">Skills (level 1-7, mastery 0-3)</span>
        <div class="grid grid-cols-3 gap-2">
          <div class="flex gap-1">
            <input
              placeholder="S1 lvl"
              type="number"
              min="1"
              max="7"
              value={skill1Level()}
              onInput={(e) => setSkill1Level(e.currentTarget.value)}
              class="w-full rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            />
            <input
              placeholder="mst"
              type="number"
              min="0"
              max="3"
              value={skill1Mastery()}
              onInput={(e) => setSkill1Mastery(e.currentTarget.value)}
              class="w-16 rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            />
          </div>
          <div class="flex gap-1">
            <input
              placeholder="S2 lvl"
              type="number"
              min="1"
              max="7"
              value={skill2Level()}
              onInput={(e) => setSkill2Level(e.currentTarget.value)}
              class="w-full rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            />
            <input
              placeholder="mst"
              type="number"
              min="0"
              max="3"
              value={skill2Mastery()}
              onInput={(e) => setSkill2Mastery(e.currentTarget.value)}
              class="w-16 rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            />
          </div>
          <div class="flex gap-1">
            <input
              placeholder="S3 lvl"
              type="number"
              min="1"
              max="7"
              value={skill3Level()}
              onInput={(e) => setSkill3Level(e.currentTarget.value)}
              class="w-full rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            />
            <input
              placeholder="mst"
              type="number"
              min="0"
              max="3"
              value={skill3Mastery()}
              onInput={(e) => setSkill3Mastery(e.currentTarget.value)}
              class="w-16 rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <Input
          label="Module 1 tier"
          type="number"
          min="0"
          max="3"
          value={module1Tier()}
          onInput={(e) => setModule1Tier(e.currentTarget.value)}
        />
        <Input
          label="Module 2 tier"
          type="number"
          min="0"
          max="3"
          value={module2Tier()}
          onInput={(e) => setModule2Tier(e.currentTarget.value)}
        />
      </div>

      <Input
        label="Skins owned (comma-separated)"
        value={skinsOwned()}
        onInput={(e) => setSkinsOwned(e.currentTarget.value)}
      />

      <label class="flex items-center gap-2 text-sm text-text-2">
        <input type="checkbox" checked={favorite()} onChange={(e) => setFavorite(e.currentTarget.checked)} />
        Favorite
      </label>

      <Input label="Notes" value={notes()} onInput={(e) => setNotes(e.currentTarget.value)} />

      <div class="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={submitting()}>
          {props.initial ? 'Save changes' : 'Add'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
