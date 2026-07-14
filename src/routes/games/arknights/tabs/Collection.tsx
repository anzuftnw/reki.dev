import { createMemo, createResource, Show } from 'solid-js'
import {
  ListGridTab,
  type ListGridConfig,
  type ListGridFilterDef,
  type ListGridSortDef,
} from '@/templates/list-grid/ListGridTab'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { arknightsCollection, arknightsOperators, type ArknightsCollectionEntry } from '@/lib/collections/games/arknights'
import { ArknightsEntryForm } from '@/routes/games/arknights/components/ArknightsEntryForm'

const PROFESSIONS = ['Vanguard', 'Guard', 'Defender', 'Sniper', 'Caster', 'Medic', 'Supporter', 'Specialist']

export function ArknightsCollectionTab() {
  const [roster] = createResource(() => arknightsOperators.list())
  const [owned, { refetch: refetchOwned }] = createResource(() => arknightsCollection.listOwned())

  const unownedOperators = createMemo(() => {
    const ownedIds = new Set((owned() ?? []).map((e) => e.operator))
    return (roster() ?? []).filter((op) => !ownedIds.has(op.id))
  })

  const filters: ListGridFilterDef<ArknightsCollectionEntry>[] = [
    {
      key: 'profession',
      label: 'Class',
      options: PROFESSIONS.map((p) => ({ value: p, label: p })),
      getValue: (e) => e.expand?.operator?.profession ?? '',
    },
    {
      key: 'rarity',
      label: 'Rarity',
      options: [6, 5, 4, 3, 2, 1].map((r) => ({ value: r.toString(), label: `${r}★` })),
      getValue: (e) => e.expand?.operator?.rarity?.toString() ?? '',
    },
  ]

  const sorts: ListGridSortDef<ArknightsCollectionEntry>[] = [
    {
      key: 'rarity',
      label: 'Rarity',
      compare: (a, b) => (b.expand?.operator?.rarity ?? 0) - (a.expand?.operator?.rarity ?? 0),
    },
    { key: 'level', label: 'Level', compare: (a, b) => b.level - a.level },
    {
      key: 'name',
      label: 'Name',
      compare: (a, b) => (a.expand?.operator?.name ?? '').localeCompare(b.expand?.operator?.name ?? ''),
    },
  ]

  const config: ListGridConfig<ArknightsCollectionEntry> = {
    items: () => owned(),
    loading: () => owned.loading,
    refetch: refetchOwned,
    getId: (e) => e.id,
    getCover: (e) => (e.expand?.operator ? arknightsOperators.coverUrl(e.expand.operator) : null),
    getTitle: (e) => e.expand?.operator?.name ?? '',
    getSubtitle: (e) => `${e.expand?.operator?.profession ?? ''} · E${e.elite} L${e.level}`,
    renderBadges: (e) => (
      <>
        <StatusBadge status={`${e.expand?.operator?.rarity ?? '?'}★`} />
        <StatusBadge status={`P${e.potential}`} />
      </>
    ),
    renderDetails: (e) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <span>
          {/* Skill level's valid range is 1-7, so a stored 0 only means "not set" (PocketBase's
              zero-value default for an unset optional field) -- `||` catches that, `??` wouldn't. */}
          Trust {e.trust ?? 0} · Skills {e.skill1Level || '—'}/{e.skill2Level || '—'}/{e.skill3Level || '—'} ·
          Modules M1-{e.module1Tier ?? 0} M2-{e.module2Tier ?? 0}
        </span>
        <Show when={e.skinsOwned?.length}>
          <span>Skins: {e.skinsOwned!.join(', ')}</span>
        </Show>
        <Show when={e.notes}>
          <span>{e.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (e) => e.expand?.operator?.name ?? '',
    filters,
    sorts,
    defaultSort: 'rarity',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <ArknightsEntryForm
        initial={formProps.initial}
        unownedOperators={unownedOperators()}
        onCancel={formProps.onCancel}
        onSaved={formProps.onSaved}
      />
    ),
    onDelete: (e) => arknightsCollection.remove(e.id),
  }

  return <ListGridTab config={config} />
}
