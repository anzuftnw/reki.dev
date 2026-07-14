import { createContext, createUniqueId, Show, useContext, type Accessor, type JSX } from 'solid-js'

// Hand-rolled WAI-ARIA Tabs (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) -- there's no native
// HTML tabs element, and this is the one Kobalte primitive with no native-element replacement.
// Roving tabindex + arrow/Home/End key nav, with automatic activation (moving focus also
// selects), matching the behavior this app relied on before.

interface TabsContextValue {
  value: Accessor<string>
  setValue: (value: string) => void
  baseId: string
  order: string[]
  elements: Map<string, HTMLButtonElement>
  register: (value: string, el: HTMLButtonElement) => void
  unregister: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>()

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs.* components must be used within <Tabs>')
  return ctx
}

export function Tabs(props: { value: string; onChange: (value: string) => void; children: JSX.Element }) {
  const order: string[] = []
  const elements = new Map<string, HTMLButtonElement>()

  const ctx: TabsContextValue = {
    value: () => props.value,
    setValue: props.onChange,
    baseId: createUniqueId(),
    order,
    elements,
    register: (value, el) => {
      if (!order.includes(value)) order.push(value)
      elements.set(value, el)
    },
    unregister: (value) => {
      const i = order.indexOf(value)
      if (i !== -1) order.splice(i, 1)
      elements.delete(value)
    },
  }

  return <TabsContext.Provider value={ctx}>{props.children}</TabsContext.Provider>
}

function TabsList(props: { class?: string; 'aria-label'?: string; children: JSX.Element }) {
  return (
    <div role="tablist" aria-label={props['aria-label']} class={props.class}>
      {props.children}
    </div>
  )
}

function TabsTrigger(props: { value: string; class?: string; children: JSX.Element }) {
  const ctx = useTabsContext()
  const selected = () => ctx.value() === props.value

  const handleKeyDown = (e: KeyboardEvent) => {
    const { order, elements, setValue } = ctx
    const idx = order.indexOf(props.value)
    if (idx === -1) return
    let nextIdx: number | undefined
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % order.length
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + order.length) % order.length
    else if (e.key === 'Home') nextIdx = 0
    else if (e.key === 'End') nextIdx = order.length - 1
    if (nextIdx === undefined) return
    e.preventDefault()
    const nextValue = order[nextIdx]
    setValue(nextValue)
    elements.get(nextValue)?.focus()
  }

  return (
    <button
      type="button"
      ref={(el) => {
        ctx.register(props.value, el)
      }}
      role="tab"
      id={`${ctx.baseId}-tab-${props.value}`}
      aria-selected={selected()}
      aria-controls={`${ctx.baseId}-panel-${props.value}`}
      tabIndex={selected() ? 0 : -1}
      data-selected={selected() ? '' : undefined}
      onClick={() => ctx.setValue(props.value)}
      onKeyDown={handleKeyDown}
      class={props.class}
    >
      {props.children}
    </button>
  )
}

function TabsContent(props: { value: string; class?: string; children: JSX.Element }) {
  const ctx = useTabsContext()
  return (
    <Show when={ctx.value() === props.value}>
      <div
        role="tabpanel"
        id={`${ctx.baseId}-panel-${props.value}`}
        aria-labelledby={`${ctx.baseId}-tab-${props.value}`}
        tabIndex={0}
        class={props.class}
      >
        {props.children}
      </div>
    </Show>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
