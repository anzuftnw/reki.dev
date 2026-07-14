import { createResource, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { artists, ARTIST_RANKS, type Artist, type ArtistInput } from '@/lib/collections/music/artists'

const fields: EntityFieldConfig<Artist>[] = [
  { type: 'text', key: 'name', label: 'Name', required: true },
  { type: 'file', key: 'cover', label: 'Cover', required: true },
  { type: 'select', key: 'rank', label: 'Rank', options: [...ARTIST_RANKS] },
  { type: 'number', key: 'scrobbles', label: 'Scrobbles' },
  { type: 'text', key: 'lastfmUrl', label: 'last.fm URL' },
  { type: 'textarea', key: 'notes', label: 'Notes' },
  { type: 'bool', key: 'favorite', label: 'Favorite' },
]

export default function ArtistsList() {
  const [items, { refetch }] = createResource(() => artists.list())

  const config: ListPageConfig<Artist> = {
    title: 'Artists',
    tagline: 'Who actually gets the plays.',
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (a) => a.id,
    getCover: (a) => artists.coverUrl(a),
    getTitle: (a) => a.name,
    getSubtitle: (a) => (a.scrobbles != null ? `${a.scrobbles.toLocaleString()} scrobbles` : ''),
    isFavorite: (a) => a.favorite,
    renderBadges: (a) => <Show when={a.rank}>{(r) => <StatusBadge status={r()} />}</Show>,
    renderDetails: (a) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <Show when={a.lastfmUrl}>
          <a href={a.lastfmUrl} target="_blank" rel="noreferrer" class="text-accent hover:underline">
            last.fm profile
          </a>
        </Show>
        <Show when={a.notes}>
          <span>{a.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (a) => a.name,
    filters: [
      {
        key: 'rank',
        label: 'Rank',
        options: ARTIST_RANKS.map((r) => ({ value: r, label: r })),
        getValue: (a) => a.rank ?? '',
      },
    ],
    sorts: [
      { key: 'scrobbles', label: 'Scrobbles', compare: (a, b) => (b.scrobbles ?? 0) - (a.scrobbles ?? 0) },
      {
        key: 'rank',
        label: 'Rank',
        compare: (a, b) => ARTIST_RANKS.indexOf(a.rank ?? 'F') - ARTIST_RANKS.indexOf(b.rank ?? 'F'),
      },
      { key: 'name', label: 'Name', compare: (a, b) => a.name.localeCompare(b.name) },
      { key: 'recent', label: 'Recently added', compare: (a, b) => b.created.localeCompare(a.created) },
    ],
    defaultSort: 'scrobbles',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <GenericEntityForm<Artist>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await artists.update(formProps.initial.id, data as unknown as Partial<ArtistInput>)
          else await artists.create(data as unknown as ArtistInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (a) => artists.remove(a.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Favorites', value: (items) => items.filter((a) => a.favorite).length },
      {
        label: 'Total scrobbles',
        value: (items) => items.reduce((sum, a) => sum + (a.scrobbles ?? 0), 0).toLocaleString(),
      },
    ],
    statsBreakdowns: [{ label: 'By rank', getGroup: (a) => a.rank }],
  }

  return <ListPageTemplate config={config} />
}
