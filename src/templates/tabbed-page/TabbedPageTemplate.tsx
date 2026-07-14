import { createMemo, For, Show, type JSX } from 'solid-js'
import { useSearchParams } from '@solidjs/router'
import { Tabs } from '@/components/ui/Tabs'
import { PageBanner } from '@/components/ui/PageBanner'
import { useUI } from '@/context/UIContext'

// Generic "header + tab bar (+ optional subtabs)" page shell. Shared by Games' per-game
// workspaces (Overview/Collection/Teams/Planner/History) and Animanga/Music list pages
// (Overview/List/Stats) -- both turned out to be the same shape, just different tab configs.

export interface TabbedPageSubtab {
  key: string
  label: string
  render: () => JSX.Element
}

export interface TabbedPageTab {
  key: string
  label: string
  render?: () => JSX.Element
  subtabs?: TabbedPageSubtab[]
}

export interface TabbedPageConfig {
  name: string
  tagline?: string
  tabs: TabbedPageTab[]
}

export function TabbedPageTemplate(props: { config: TabbedPageConfig }) {
  const { contentWidth } = useUI()
  const isCentered = () => contentWidth() === 'centered'
  const [searchParams, setSearchParams] = useSearchParams<{ tab?: string; subtab?: string }>()
  const tabs = () => props.config.tabs

  const activeTabKey = createMemo(() => {
    const fromUrl = searchParams.tab
    return tabs().some((t) => t.key === fromUrl) ? fromUrl! : (tabs()[0]?.key ?? '')
  })
  const activeTab = createMemo(() => tabs().find((t) => t.key === activeTabKey()))
  const activeSubtabKey = createMemo(() => {
    const subtabs = activeTab()?.subtabs
    if (!subtabs?.length) return undefined
    const fromUrl = searchParams.subtab
    return subtabs.some((s) => s.key === fromUrl) ? fromUrl! : subtabs[0].key
  })

  return (
    <section class="flex flex-col gap-6">
      <PageBanner title={props.config.name} subtitle={props.config.tagline} />

      <Show when={isCentered()}>
        <header class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-semibold text-text-1">{props.config.name}</h1>
            <Show when={props.config.tagline}>
              <p class="text-text-3">{props.config.tagline}</p>
            </Show>
          </div>
        </header>
      </Show>

      <Tabs value={activeTabKey()} onChange={(key) => setSearchParams({ tab: key, subtab: undefined })}>
        <Tabs.List
          aria-label={`${props.config.name} sections`}
          class="flex gap-1 overflow-x-auto border-b border-border"
        >
          <For each={tabs()}>
            {(tab) => (
              <Tabs.Trigger
                value={tab.key}
                class="border-b-2 border-transparent px-3 py-2 text-sm whitespace-nowrap text-text-3 transition-colors hover:text-text-1 data-selected:border-accent data-selected:text-text-1"
              >
                {tab.label}
              </Tabs.Trigger>
            )}
          </For>
        </Tabs.List>

        <For each={tabs()}>
          {(tab) => (
            <Tabs.Content value={tab.key} class="pt-4">
              <Show when={tab.subtabs} fallback={tab.render?.()}>
                {(subtabs) => (
                  <div class="flex flex-col gap-4">
                    <div class="flex w-fit gap-1 rounded-lg border border-border-strong bg-surface-1/50 p-1">
                      <For each={subtabs()}>
                        {(sub) => (
                          <button
                            type="button"
                            onClick={() => setSearchParams({ subtab: sub.key })}
                            class={`rounded-md px-3 py-1 text-sm transition-colors ${
                              activeSubtabKey() === sub.key
                                ? 'bg-surface-3 text-text-1'
                                : 'text-text-3 hover:text-text-1'
                            }`}
                          >
                            {sub.label}
                          </button>
                        )}
                      </For>
                    </div>
                    <For each={subtabs()}>
                      {(sub) => <Show when={activeSubtabKey() === sub.key}>{sub.render()}</Show>}
                    </For>
                  </div>
                )}
              </Show>
            </Tabs.Content>
          )}
        </For>
      </Tabs>
    </section>
  )
}
