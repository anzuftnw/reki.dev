import { createResource, Show } from 'solid-js'
import { ListPageTemplate, type ListPageConfig } from '@/templates/list-page/ListPageTemplate'
import { GenericEntityForm, type EntityFieldConfig } from '@/templates/list-page/GenericEntityForm'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { makeThemeSongCollection, type ThemeSong, type ThemeSongInput } from '@/lib/collections/animanga/themeSong'

type ThemeSongCollection = ReturnType<typeof makeThemeSongCollection>

const fields: EntityFieldConfig<ThemeSong>[] = [
  { type: 'text', key: 'title', label: 'Title', required: true },
  { type: 'text', key: 'artist', label: 'Artist', required: true },
  { type: 'text', key: 'anime', label: 'Anime', required: true },
  { type: 'number', key: 'slot', label: 'Slot (1 = OP1/ED1…)', required: true },
  { type: 'file', key: 'cover', label: 'Cover' },
  { type: 'text', key: 'youtubeUrl', label: 'YouTube URL' },
  { type: 'file', key: 'audioFile', label: 'Audio file' },
  { type: 'number', key: 'score', label: 'Score', min: 0, max: 10 },
  { type: 'textarea', key: 'notes', label: 'Notes' },
  { type: 'bool', key: 'favorite', label: 'Favorite' },
]

// Shared page for Openings/Endings/Soundtracks -- identical schema and identical shape of
// list/overview/stats, just a different collection and title.
export function ThemeSongListPage(props: { title: string; tagline: string; collection: ThemeSongCollection }) {
  const [items, { refetch }] = createResource(() => props.collection.list())

  const config: ListPageConfig<ThemeSong> = {
    title: props.title,
    tagline: props.tagline,
    items: () => items(),
    loading: () => items.loading,
    refetch,
    getId: (t) => t.id,
    getCover: (t) => props.collection.coverUrl(t),
    getTitle: (t) => t.title,
    getSubtitle: (t) => t.anime,
    isFavorite: (t) => t.favorite,
    renderBadges: (t) => (
      <>
        <StatusBadge status={`#${t.slot}`} />
        <Show when={t.score != null}>
          <StatusBadge status={`${t.score}/10`} />
        </Show>
      </>
    ),
    renderDetails: (t) => (
      <div class="flex flex-col gap-1 pt-1 text-xs text-text-3">
        <Show when={t.youtubeUrl}>
          <a href={t.youtubeUrl} target="_blank" rel="noreferrer" class="text-accent hover:underline">
            Watch on YouTube
          </a>
        </Show>
        <Show when={t.notes}>
          <span>{t.notes}</span>
        </Show>
      </div>
    ),
    searchValue: (t) => `${t.title} ${t.artist} ${t.anime}`,
    filters: [],
    sorts: [
      { key: 'recent', label: 'Recently added', compare: (a, b) => b.created.localeCompare(a.created) },
      { key: 'anime', label: 'Anime', compare: (a, b) => a.anime.localeCompare(b.anime) || a.slot - b.slot },
      { key: 'score', label: 'Score', compare: (a, b) => (b.score ?? 0) - (a.score ?? 0) },
      { key: 'title', label: 'Title', compare: (a, b) => a.title.localeCompare(b.title) },
    ],
    defaultSort: 'recent',
    viewModes: ['grid', 'compact', 'detailed'],
    defaultViewMode: 'grid',
    renderForm: (formProps) => (
      <GenericEntityForm<ThemeSong>
        fields={fields}
        initial={formProps.initial}
        submitLabel={formProps.initial ? 'Save' : 'Add'}
        onCancel={formProps.onCancel}
        onSubmit={async (data) => {
          if (formProps.initial) await props.collection.update(formProps.initial.id, data as unknown as Partial<ThemeSongInput>)
          else await props.collection.create(data as unknown as ThemeSongInput)
          formProps.onSaved()
        }}
      />
    ),
    onDelete: (t) => props.collection.remove(t.id),
    overviewStats: [
      { label: 'Total', value: (items) => items.length },
      { label: 'Favorites', value: (items) => items.filter((t) => t.favorite).length },
      {
        label: 'Avg score',
        value: (items) => {
          const scored = items.filter((t) => t.score != null)
          return scored.length ? (scored.reduce((sum, t) => sum + (t.score ?? 0), 0) / scored.length).toFixed(1) : '—'
        },
      },
    ],
  }

  return <ListPageTemplate config={config} />
}
