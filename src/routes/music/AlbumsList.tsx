import { createMemo, createResource, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'
import { albums, type Album, type AlbumInput } from '@/lib/collections/music/albums'
import { artists } from '@/lib/collections/music/artists'

export default function AlbumsList() {
  const [items, { refetch }] = createResource(() => albums.list())
  const [artistList] = createResource(() => artists.list())

  const artistOptions = createMemo(() => (artistList() ?? []).map((a) => ({ id: a.id, label: a.name })))
  const artistNames = (a: Album) => (a.expand?.artist ?? []).map((ar) => ar.name).join(', ')

  const fields: EntityFieldConfig<Album>[] = [
    { type: 'text', key: 'title', label: 'Title', required: true },
    { type: 'relation', key: 'artist', label: 'Artist', options: artistOptions, multi: true },
    { type: 'file', key: 'cover', label: 'Cover', required: true },
    { type: 'date', key: 'releaseDate', label: 'Release date' },
    { type: 'number', key: 'score', label: 'Score', min: 0, max: 10 },
    { type: 'number', key: 'scrobbles', label: 'Scrobbles' },
    { type: 'textarea', key: 'notes', label: 'Notes' },
    { type: 'bool', key: 'favorite', label: 'Favorite' },
  ]

  const config: ListPageConfig<Album> = {
    title: 'Albums',
    tagline: 'Full releases, not just singles.',
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (a) => a.id,
    getCover: (a) => albums.coverUrl(a),
    getTitle: (a) => a.title,
    getSubtitle: artistNames,
    isFavorite: (a) => a.favorite,
    renderBadges: (a) => (
      <>
        <Show when={a.score != null}>
          <StatusBadge status={`${a.score}/10`} />
        </Show>
        <Show when={a.scrobbles != null}>
          <StatusBadge status={`${a.scrobbles!.toLocaleString()} plays`} />
        </Show>
      </>
    ),
    renderDetails: (a) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <Show when={a.releaseDate}>
          <span>{formatDate(a.releaseDate!)}</span>
        </Show>
        <Show when={a.notes}>
          <span>{a.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (a) => `${a.title} ${artistNames(a)}`,
    filters: [],
    sorts: [
      { key: 'recent', label: 'Recently added', compare: (a, b) => b.created.localeCompare(a.created) },
      { key: 'scrobbles', label: 'Scrobbles', compare: (a, b) => (b.scrobbles ?? 0) - (a.scrobbles ?? 0) },
      { key: 'score', label: 'Score', compare: (a, b) => (b.score ?? 0) - (a.score ?? 0) },
      { key: 'title', label: 'Title', compare: (a, b) => a.title.localeCompare(b.title) },
      {
        key: 'releaseDate',
        label: 'Release date',
        compare: (a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''),
      },
    ],
    defaultSort: 'recent',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <GenericEntityForm<Album>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await albums.update(formProps.initial.id, data as unknown as Partial<AlbumInput>)
          else await albums.create(data as unknown as AlbumInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (a) => albums.remove(a.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Favorites', value: (items) => items.filter((a) => a.favorite).length },
      {
        label: 'Total scrobbles',
        value: (items) => items.reduce((sum, a) => sum + (a.scrobbles ?? 0), 0).toLocaleString(),
      },
    ],
  }

  return <ListPageTemplate config={config} />
}
