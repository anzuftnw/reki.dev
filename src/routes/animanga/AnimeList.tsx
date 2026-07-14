import { createResource, For, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  anime,
  ANIME_SEASONS,
  ANIME_FORMATS,
  ANIME_STATUSES,
  MEDIA_GENRES,
  type Anime,
  type AnimeInput,
} from '@/lib/collections/animanga/anime'

const fields: EntityFieldConfig<Anime>[] = [
  { type: 'text', key: 'title', label: 'Title', required: true },
  { type: 'select', key: 'season', label: 'Season', options: [...ANIME_SEASONS], required: true },
  { type: 'number', key: 'year', label: 'Year', required: true },
  { type: 'select', key: 'format', label: 'Format', options: [...ANIME_FORMATS], required: true },
  { type: 'number', key: 'episodes', label: 'Episodes', required: true },
  { type: 'number', key: 'episodeLength', label: 'Episode length (min)', required: true },
  { type: 'multiselect', key: 'genres', label: 'Genres', options: [...MEDIA_GENRES] },
  { type: 'file', key: 'cover', label: 'Cover', required: true },
  { type: 'select', key: 'status', label: 'Status', options: [...ANIME_STATUSES], required: true },
  { type: 'number', key: 'score', label: 'Score', min: 0, max: 10 },
  { type: 'number', key: 'episodesWatched', label: 'Episodes watched' },
  { type: 'date', key: 'startDate', label: 'Start date' },
  { type: 'date', key: 'endDate', label: 'End date' },
  { type: 'number', key: 'rewatchCount', label: 'Rewatch count' },
  { type: 'number', key: 'anilistId', label: 'AniList ID' },
  { type: 'textarea', key: 'notes', label: 'Notes' },
  { type: 'bool', key: 'favorite', label: 'Favorite' },
]

export default function AnimeList() {
  const [items, { refetch }] = createResource(() => anime.list())

  const config: ListPageConfig<Anime> = {
    title: 'Anime',
    tagline: 'Everything watched, watching, and queued.',
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (a) => a.id,
    getCover: (a) => anime.coverUrl(a),
    getTitle: (a) => a.title,
    getSubtitle: (a) => `${a.year} · ${a.format}`,
    isFavorite: (a) => a.favorite,
    renderBadges: (a) => (
      <>
        <Show when={a.score != null}>
          <StatusBadge status={`${a.score}/10`} />
        </Show>
        <For each={a.genres.slice(0, 2)}>{(g) => <StatusBadge status={g} />}</For>
      </>
    ),
    renderDetails: (a) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <span>
          {a.episodesWatched ?? 0}/{a.episodes} episodes · {a.episodeLength}min each
        </span>
        <Show when={a.notes}>
          <span>{a.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (a) => a.title,
    statusFilter: {
      getValue: (a) => a.status,
      values: ANIME_STATUSES.map((s) => ({ value: s, label: s })),
    },
    filters: [
      {
        key: 'format',
        label: 'Format',
        options: ANIME_FORMATS.map((f) => ({ value: f, label: f })),
        getValue: (a) => a.format,
      },
      {
        key: 'season',
        label: 'Season',
        options: ANIME_SEASONS.map((s) => ({ value: s, label: s })),
        getValue: (a) => a.season,
      },
    ],
    sorts: [
      { key: 'recent', label: 'Recently added', compare: (a, b) => b.created.localeCompare(a.created) },
      { key: 'score', label: 'Score', compare: (a, b) => (b.score ?? 0) - (a.score ?? 0) },
      { key: 'title', label: 'Title', compare: (a, b) => a.title.localeCompare(b.title) },
      { key: 'year', label: 'Year', compare: (a, b) => b.year - a.year },
    ],
    defaultSort: 'recent',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <GenericEntityForm<Anime>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await anime.update(formProps.initial.id, data as unknown as Partial<AnimeInput>)
          else await anime.create(data as unknown as AnimeInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (a) => anime.remove(a.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Watching', value: (items) => items.filter((a) => a.status === 'watching').length },
      { label: 'Completed', value: (items) => items.filter((a) => a.status === 'completed').length },
      {
        label: 'Avg score',
        value: (items) => {
          const scored = items.filter((a) => a.score != null)
          return scored.length ? (scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length).toFixed(1) : '—'
        },
      },
    ],
    statsBreakdowns: [
      { label: 'By status', getGroup: (a) => a.status },
      { label: 'By format', getGroup: (a) => a.format },
      { label: 'By season', getGroup: (a) => a.season },
    ],
  }

  return <ListPageTemplate config={config} />
}
