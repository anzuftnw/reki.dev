import { createResource, For, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  manga,
  MANGA_FORMATS,
  MANGA_STATUSES,
  MEDIA_GENRES,
  type Manga,
  type MangaInput,
} from '@/lib/collections/animanga/manga'

const fields: EntityFieldConfig<Manga>[] = [
  { type: 'text', key: 'title', label: 'Title', required: true },
  { type: 'number', key: 'year', label: 'Year', required: true },
  { type: 'select', key: 'format', label: 'Format', options: [...MANGA_FORMATS], required: true },
  { type: 'number', key: 'chapters', label: 'Chapters', required: true },
  { type: 'number', key: 'volumes', label: 'Volumes', required: true },
  { type: 'multiselect', key: 'genres', label: 'Genres', options: [...MEDIA_GENRES] },
  { type: 'file', key: 'cover', label: 'Cover', required: true },
  { type: 'select', key: 'status', label: 'Status', options: [...MANGA_STATUSES], required: true },
  { type: 'number', key: 'score', label: 'Score', min: 0, max: 10 },
  { type: 'number', key: 'chaptersRead', label: 'Chapters read' },
  { type: 'number', key: 'volumesRead', label: 'Volumes read' },
  { type: 'date', key: 'startDate', label: 'Start date' },
  { type: 'date', key: 'endDate', label: 'End date' },
  { type: 'number', key: 'rereadCount', label: 'Reread count' },
  { type: 'number', key: 'anilistId', label: 'AniList ID' },
  { type: 'textarea', key: 'notes', label: 'Notes' },
  { type: 'bool', key: 'favorite', label: 'Favorite' },
]

export default function MangaList() {
  const [items, { refetch }] = createResource(() => manga.list())

  const config: ListPageConfig<Manga> = {
    title: 'Manga',
    tagline: 'Everything read, reading, and queued.',
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (m) => m.id,
    getCover: (m) => manga.coverUrl(m),
    getTitle: (m) => m.title,
    getSubtitle: (m) => `${m.year} · ${m.format}`,
    isFavorite: (m) => m.favorite,
    renderBadges: (m) => (
      <>
        <Show when={m.score != null}>
          <StatusBadge status={`${m.score}/10`} />
        </Show>
        <For each={m.genres.slice(0, 2)}>{(g) => <StatusBadge status={g} />}</For>
      </>
    ),
    renderDetails: (m) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <span>
          {m.chaptersRead ?? 0}/{m.chapters} chapters · {m.volumesRead ?? 0}/{m.volumes} volumes
        </span>
        <Show when={m.notes}>
          <span>{m.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (m) => m.title,
    statusFilter: {
      getValue: (m) => m.status,
      values: MANGA_STATUSES.map((s) => ({ value: s, label: s })),
    },
    filters: [
      {
        key: 'format',
        label: 'Format',
        options: MANGA_FORMATS.map((f) => ({ value: f, label: f })),
        getValue: (m) => m.format,
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
      <GenericEntityForm<Manga>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await manga.update(formProps.initial.id, data as unknown as Partial<MangaInput>)
          else await manga.create(data as unknown as MangaInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (m) => manga.remove(m.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Reading', value: (items) => items.filter((m) => m.status === 'reading').length },
      { label: 'Completed', value: (items) => items.filter((m) => m.status === 'completed').length },
      {
        label: 'Avg score',
        value: (items) => {
          const scored = items.filter((m) => m.score != null)
          return scored.length ? (scored.reduce((sum, m) => sum + (m.score ?? 0), 0) / scored.length).toFixed(1) : '—'
        },
      },
    ],
    statsBreakdowns: [
      { label: 'By status', getGroup: (m) => m.status },
      { label: 'By format', getGroup: (m) => m.format },
    ],
  }

  return <ListPageTemplate config={config} />
}
