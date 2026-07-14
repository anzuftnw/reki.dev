import { createMemo, createResource, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDuration } from '@/lib/format'
import { tracks, TRACK_GENRES, type Track, type TrackInput } from '@/lib/collections/music/tracks'
import { artists } from '@/lib/collections/music/artists'
import { albums } from '@/lib/collections/music/albums'

export default function TracksList() {
  const [items, { refetch }] = createResource(() => tracks.list())
  const [artistList] = createResource(() => artists.list())
  const [albumList] = createResource(() => albums.list())

  const artistOptions = createMemo(() => (artistList() ?? []).map((a) => ({ id: a.id, label: a.name })))
  const albumOptions = createMemo(() => (albumList() ?? []).map((a) => ({ id: a.id, label: a.title })))
  const artistNames = (t: Track) => (t.expand?.artist ?? []).map((a) => a.name).join(', ')

  const fields: EntityFieldConfig<Track>[] = [
    { type: 'text', key: 'title', label: 'Title', required: true },
    { type: 'relation', key: 'artist', label: 'Artist', options: artistOptions, multi: true },
    { type: 'relation', key: 'album', label: 'Album', options: albumOptions },
    { type: 'file', key: 'cover', label: 'Cover' },
    { type: 'select', key: 'genre', label: 'Genre', options: [...TRACK_GENRES] },
    { type: 'number', key: 'duration', label: 'Duration (seconds)' },
    { type: 'number', key: 'score', label: 'Score', min: 0, max: 10 },
    { type: 'number', key: 'scrobbles', label: 'Scrobbles' },
    { type: 'textarea', key: 'notes', label: 'Notes' },
    { type: 'bool', key: 'favorite', label: 'Favorite' },
  ]

  const config: ListPageConfig<Track> = {
    title: 'Tracks',
    tagline: 'Individual songs, sorted by whatever matters right now.',
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (t) => t.id,
    getCover: (t) => tracks.coverUrl(t),
    getTitle: (t) => t.title,
    getSubtitle: artistNames,
    isFavorite: (t) => t.favorite,
    renderBadges: (t) => (
      <>
        <Show when={t.genre}>{(g) => <StatusBadge status={g()} />}</Show>
        <Show when={t.score != null}>
          <StatusBadge status={`${t.score}/10`} />
        </Show>
      </>
    ),
    renderDetails: (t) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <span>
          <Show when={t.expand?.album}>{(album) => <>{album().title} · </>}</Show>
          <Show when={t.duration != null}>{formatDuration(t.duration!)}</Show>
        </span>
        <Show when={t.notes}>
          <span>{t.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (t) => `${t.title} ${artistNames(t)}`,
    filters: [
      {
        key: 'genre',
        label: 'Genre',
        options: TRACK_GENRES.map((g) => ({ value: g, label: g })),
        getValue: (t) => t.genre ?? '',
      },
    ],
    sorts: [
      { key: 'recent', label: 'Recently added', compare: (a, b) => b.created.localeCompare(a.created) },
      { key: 'scrobbles', label: 'Scrobbles', compare: (a, b) => (b.scrobbles ?? 0) - (a.scrobbles ?? 0) },
      { key: 'score', label: 'Score', compare: (a, b) => (b.score ?? 0) - (a.score ?? 0) },
      { key: 'title', label: 'Title', compare: (a, b) => a.title.localeCompare(b.title) },
    ],
    defaultSort: 'recent',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <GenericEntityForm<Track>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await tracks.update(formProps.initial.id, data as unknown as Partial<TrackInput>)
          else await tracks.create(data as unknown as TrackInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (t) => tracks.remove(t.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Favorites', value: (items) => items.filter((t) => t.favorite).length },
      {
        label: 'Total scrobbles',
        value: (items) => items.reduce((sum, t) => sum + (t.scrobbles ?? 0), 0).toLocaleString(),
      },
    ],
    statsBreakdowns: [{ label: 'By genre', getGroup: (t) => t.genre }],
  }

  return <ListPageTemplate config={config} />
}
