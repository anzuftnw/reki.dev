import { createMemo, createSignal, For, Match, Show, Switch, type JSX } from 'solid-js'
import { TbOutlineLayoutGrid, TbOutlineLayoutList, TbOutlineList } from 'solid-icons/tb'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { Button } from '@/components/ui/Button'

export type ViewMode = 'grid' | 'compact' | 'detailed'

const VIEW_MODE_META: Record<ViewMode, { label: string; icon: (props: { class?: string }) => JSX.Element }> = {
  grid: { label: 'Grid', icon: TbOutlineLayoutGrid },
  compact: { label: 'Compact', icon: TbOutlineList },
  detailed: { label: 'Detailed', icon: TbOutlineLayoutList },
}

export interface ListGridFilterOption {
  value: string
  label: string
}

export interface ListGridFilterDef<T> {
  key: string
  label: string
  options: ListGridFilterOption[]
  getValue: (item: T) => string
}

export interface ListGridSortDef<T> {
  key: string
  label: string
  compare: (a: T, b: T) => number
}

export interface StatusFilterValue {
  value: string
  label: string
}

export interface StatusFilterDef<T> {
  getValue: (item: T) => string | undefined
  values: StatusFilterValue[]
}

export interface ListGridConfig<T> {
  // Owned by the caller (not fetched internally) so a single resource can be shared with
  // whatever else on the tab needs the same list -- e.g. computing "unowned" options for an
  // add-form picker. Two independent createResource calls hitting the same PB collection
  // trigger the SDK's default auto-cancellation and throw a stray abort error.
  items: () => T[] | undefined
  loading: () => boolean
  refetch: () => void
  getId: (item: T) => string
  getCover: (item: T) => string | null
  getTitle: (item: T) => string
  getSubtitle?: (item: T) => string
  renderBadges?: (item: T) => JSX.Element
  /** Extra content shown only in the 'detailed' view mode (e.g. notes, extra stats). */
  renderDetails?: (item: T) => JSX.Element
  /** Renders as a row of pill tabs with live counts above the filter bar (e.g. Watching/Completed/...).
   *  Only meaningful for collections with a real status-like field -- omit for ones that don't have one. */
  statusFilter?: StatusFilterDef<T>
  filters: ListGridFilterDef<T>[]
  sorts: ListGridSortDef<T>[]
  defaultSort: string
  /** Which view modes this instance offers. Defaults to just 'grid' (no toggle shown). */
  viewModes?: ViewMode[]
  defaultViewMode?: ViewMode
  searchValue?: (item: T) => string
  renderForm: (formProps: { initial?: T; onCancel: () => void; onSaved: () => void }) => JSX.Element
  onDelete: (item: T) => Promise<unknown>
}

export function ListGridTab<T>(props: { config: ListGridConfig<T> }) {
  const { isOwner } = useAuth()
  const { editMode } = useUI()
  const [search, setSearch] = createSignal('')
  const [filterValues, setFilterValues] = createSignal<Record<string, string>>({})
  const [statusValue, setStatusValue] = createSignal('')
  const [sortKey, setSortKey] = createSignal(props.config.defaultSort)
  const [creating, setCreating] = createSignal(false)
  const [editingId, setEditingId] = createSignal<string | null>(null)

  const viewModes = createMemo<ViewMode[]>(() => props.config.viewModes ?? ['grid'])
  const [viewMode, setViewMode] = createSignal<ViewMode>(props.config.defaultViewMode ?? viewModes()[0])

  // Counts reflect the full unstatused list (not the search/filter state) -- like an inbox's
  // per-folder counts, they shouldn't jump around as someone types into the search box.
  const statusCounts = createMemo(() => {
    const statusFilter = props.config.statusFilter
    if (!statusFilter) return null
    const items = props.config.items() ?? []
    const counts = new Map<string, number>()
    for (const item of items) {
      const value = statusFilter.getValue(item)
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return counts
  })

  const visible = createMemo(() => {
    const config = props.config
    const term = search().trim().toLowerCase()
    const filters = filterValues()
    let list = config.items() ?? []
    if (config.statusFilter && statusValue()) {
      list = list.filter((item) => config.statusFilter!.getValue(item) === statusValue())
    }
    if (term) {
      list = list.filter((item) => (config.searchValue?.(item) ?? config.getTitle(item)).toLowerCase().includes(term))
    }
    for (const filter of config.filters) {
      const value = filters[filter.key]
      if (value) list = list.filter((item) => filter.getValue(item) === value)
    }
    const sort = config.sorts.find((s) => s.key === sortKey())
    return sort ? [...list].sort(sort.compare) : list
  })

  const handleDelete = async (item: T) => {
    if (!window.confirm(`Remove "${props.config.getTitle(item)}"?`)) return
    await props.config.onDelete(item)
    props.config.refetch()
  }

  const editActions = (item: T) => (
    <Show when={isOwner() && editMode()}>
      <div class="flex shrink-0 gap-1">
        <Button size="sm" variant="ghost" onClick={() => setEditingId(props.config.getId(item))}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleDelete(item)}>
          Remove
        </Button>
      </div>
    </Show>
  )

  const withEditFallback = (item: T, view: JSX.Element) => (
    <Show
      when={editingId() !== props.config.getId(item)}
      fallback={props.config.renderForm({
        initial: item,
        onCancel: () => setEditingId(null),
        onSaved: () => {
          setEditingId(null)
          props.config.refetch()
        },
      })}
    >
      {view}
    </Show>
  )

  return (
    <div class="flex flex-col gap-4">
      <Show when={props.config.statusFilter}>
        {(statusFilter) => {
          const total = createMemo(() => props.config.items()?.length ?? 0)
          return (
            <div class="flex flex-wrap gap-1 border-b border-border pb-2">
              <button
                type="button"
                onClick={() => setStatusValue('')}
                class={`rounded-md px-3 py-1 text-sm transition-colors ${
                  statusValue() === '' ? 'bg-surface-3 text-text-1' : 'text-text-3 hover:text-text-1'
                }`}
              >
                All ({total()})
              </button>
              <For each={statusFilter().values}>
                {(status) => (
                  <button
                    type="button"
                    onClick={() => setStatusValue(status.value)}
                    class={`rounded-md px-3 py-1 text-sm transition-colors ${
                      statusValue() === status.value ? 'bg-surface-3 text-text-1' : 'text-text-3 hover:text-text-1'
                    }`}
                  >
                    {status.label} ({statusCounts()?.get(status.value) ?? 0})
                  </button>
                )}
              </For>
            </div>
          )
        }}
      </Show>

      <div class="flex flex-wrap items-center gap-2">
        <input
          placeholder="Search…"
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
          class="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-1 outline-none focus:border-border-strong"
        />
        <For each={props.config.filters}>
          {(filter) => (
            <select
              value={filterValues()[filter.key] ?? ''}
              onChange={(e) => setFilterValues({ ...filterValues(), [filter.key]: e.currentTarget.value })}
              class="rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
            >
              <option value="">{filter.label}: All</option>
              <For each={filter.options}>{(opt) => <option value={opt.value}>{opt.label}</option>}</For>
            </select>
          )}
        </For>
        <select
          value={sortKey()}
          onChange={(e) => setSortKey(e.currentTarget.value)}
          class="rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm text-text-1"
        >
          <For each={props.config.sorts}>{(sort) => <option value={sort.key}>Sort: {sort.label}</option>}</For>
        </select>

        <Show when={viewModes().length > 1}>
          <div class="flex gap-0.5 rounded-lg border border-border-strong bg-surface-1/50 p-0.5">
            <For each={viewModes()}>
              {(mode) => {
                const meta = VIEW_MODE_META[mode]
                return (
                  <button
                    type="button"
                    aria-label={meta.label}
                    aria-pressed={viewMode() === mode}
                    onClick={() => setViewMode(mode)}
                    class={`rounded-md p-2 transition-colors ${
                      viewMode() === mode ? 'bg-surface-3 text-text-1' : 'text-text-3 hover:text-text-1'
                    }`}
                  >
                    <meta.icon class="size-4" />
                  </button>
                )
              }}
            </For>
          </div>
        </Show>

        <Show when={isOwner() && editMode()}>
          <Button size="sm" class="ml-auto" onClick={() => setCreating(true)}>
            Add
          </Button>
        </Show>
      </div>

      <Show when={creating()}>
        {props.config.renderForm({
          onCancel: () => setCreating(false),
          onSaved: () => {
            setCreating(false)
            props.config.refetch()
          },
        })}
      </Show>

      <Switch>
        <Match when={viewMode() === 'grid'}>
          <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <For each={visible()}>
              {(item) =>
                withEditFallback(
                  item,
                  <article class="flex h-full flex-col gap-2 rounded-xl border border-border bg-surface-1 p-3">
                    <Show when={props.config.getCover(item)}>
                      {(url) => <img src={url()} alt="" class="aspect-square w-full rounded-lg object-cover" />}
                    </Show>
                    <div class="flex flex-col gap-1">
                      <h3 class="text-sm font-medium text-text-1">{props.config.getTitle(item)}</h3>
                      <Show when={props.config.getSubtitle?.(item)}>
                        <p class="text-xs text-text-3">{props.config.getSubtitle!(item)}</p>
                      </Show>
                      <div class="flex flex-wrap gap-1">{props.config.renderBadges?.(item)}</div>
                    </div>
                    <div class="mt-auto pt-1">{editActions(item)}</div>
                  </article>,
                )
              }
            </For>
          </div>
        </Match>

        <Match when={viewMode() === 'compact'}>
          <ul class="flex flex-col divide-y divide-border">
            <For each={visible()}>
              {(item) =>
                withEditFallback(
                  item,
                  <li class="flex items-center gap-3 py-2">
                    <Show when={props.config.getCover(item)}>
                      {(url) => <img src={url()} alt="" class="size-8 shrink-0 rounded object-cover" />}
                    </Show>
                    <span class="text-sm text-text-1">{props.config.getTitle(item)}</span>
                    <Show when={props.config.getSubtitle?.(item)}>
                      <span class="text-xs text-text-3">{props.config.getSubtitle!(item)}</span>
                    </Show>
                    <div class="flex flex-wrap gap-1">{props.config.renderBadges?.(item)}</div>
                    <div class="ml-auto">{editActions(item)}</div>
                  </li>,
                )
              }
            </For>
          </ul>
        </Match>

        <Match when={viewMode() === 'detailed'}>
          <div class="flex flex-col gap-3">
            <For each={visible()}>
              {(item) =>
                withEditFallback(
                  item,
                  <article class="flex gap-4 rounded-xl border border-border bg-surface-1 p-4">
                    <Show when={props.config.getCover(item)}>
                      {(url) => <img src={url()} alt="" class="size-24 shrink-0 rounded-lg object-cover" />}
                    </Show>
                    <div class="flex flex-1 flex-col gap-2">
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="font-medium text-text-1">{props.config.getTitle(item)}</h3>
                        {editActions(item)}
                      </div>
                      <Show when={props.config.getSubtitle?.(item)}>
                        <p class="text-sm text-text-3">{props.config.getSubtitle!(item)}</p>
                      </Show>
                      <div class="flex flex-wrap gap-1">{props.config.renderBadges?.(item)}</div>
                      {props.config.renderDetails?.(item)}
                    </div>
                  </article>,
                )
              }
            </For>
          </div>
        </Match>
      </Switch>

      <Show when={!props.config.loading() && visible().length === 0}>
        <p class="text-sm text-text-3">Nothing here yet.</p>
      </Show>
    </div>
  )
}
