import { createResource, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'
import {
  characters,
  CHARACTER_GENDERS,
  CHARACTER_RANKS,
  type Character,
  type CharacterInput,
} from '@/lib/collections/animanga/characters'

const fields: EntityFieldConfig<Character>[] = [
  { type: 'text', key: 'name', label: 'Name', required: true },
  { type: 'select', key: 'gender', label: 'Gender', options: [...CHARACTER_GENDERS], required: true },
  { type: 'date', key: 'dateOfBirth', label: 'Date of birth' },
  { type: 'file', key: 'cover', label: 'Cover', required: true },
  { type: 'select', key: 'rank', label: 'Rank', options: [...CHARACTER_RANKS], required: true },
  { type: 'number', key: 'anilistId', label: 'AniList ID' },
  { type: 'textarea', key: 'notes', label: 'Notes' },
  { type: 'bool', key: 'favorite', label: 'Favorite' },
]

export default function CharactersList() {
  const [items, { refetch }] = createResource(() => characters.list())

  const config: ListPageConfig<Character> = {
    title: 'Characters',
    tagline: 'Favorite faces across everything watched and read.',
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (c) => c.id,
    getCover: (c) => characters.coverUrl(c),
    getTitle: (c) => c.name,
    getSubtitle: (c) => (c.dateOfBirth ? formatDate(c.dateOfBirth) : ''),
    isFavorite: (c) => c.favorite,
    renderBadges: (c) => <StatusBadge status={c.rank} />,
    renderDetails: (c) => (
      <Show when={c.notes}>
        <p class="pt-1 text-xs text-text-3">{c.notes}</p>
      </Show>
    ),
    searchValue: (c) => c.name,
    filters: [
      {
        key: 'rank',
        label: 'Rank',
        options: CHARACTER_RANKS.map((r) => ({ value: r, label: r })),
        getValue: (c) => c.rank,
      },
      {
        key: 'gender',
        label: 'Gender',
        options: CHARACTER_GENDERS.map((g) => ({ value: g, label: g })),
        getValue: (c) => c.gender,
      },
    ],
    sorts: [
      { key: 'recent', label: 'Recently added', compare: (a, b) => b.created.localeCompare(a.created) },
      {
        key: 'rank',
        label: 'Rank',
        compare: (a, b) => CHARACTER_RANKS.indexOf(a.rank) - CHARACTER_RANKS.indexOf(b.rank),
      },
      { key: 'name', label: 'Name', compare: (a, b) => a.name.localeCompare(b.name) },
    ],
    defaultSort: 'rank',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <GenericEntityForm<Character>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await characters.update(formProps.initial.id, data as unknown as Partial<CharacterInput>)
          else await characters.create(data as unknown as CharacterInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (c) => characters.remove(c.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Favorites', value: (items) => items.filter((c) => c.favorite).length },
      { label: 'SS rank', value: (items) => items.filter((c) => c.rank === 'SS').length },
    ],
    statsBreakdowns: [
      { label: 'By rank', getGroup: (c) => c.rank },
      { label: 'By gender', getGroup: (c) => c.gender },
    ],
  }

  return <ListPageTemplate config={config} />
}
