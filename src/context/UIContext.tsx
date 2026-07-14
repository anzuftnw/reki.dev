import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type JSX,
  type ParentComponent,
} from 'solid-js'
import { useAuth } from '@/context/AuthContext'

type Theme = 'auto' | 'light' | 'dark'
type SidebarState = 'expanded' | 'collapsed' | 'hidden'
type ContentWidth = 'full' | 'centered'

const THEME_CYCLE: Theme[] = ['auto', 'light', 'dark']
const SIDEBAR_CYCLE: SidebarState[] = ['expanded', 'collapsed', 'hidden']
const CONTENT_WIDTH_CYCLE: ContentWidth[] = ['full', 'centered']

interface UIContextValue {
  pageTitle: () => string | null
  setPageTitle: (title: string | null) => void
  pageActions: () => JSX.Element | null
  setPageActions: (actions: JSX.Element | null) => void
  editMode: () => boolean
  toggleEditMode: () => void
  theme: () => Theme
  cycleTheme: () => void
  sidebarState: () => SidebarState
  cycleSidebar: () => void
  contentWidth: () => ContentWidth
  cycleContentWidth: () => void
  /** 0 = fully faded out, 1 = fully visible. Lets a page (e.g. Home's hero) drive the TopBar's opacity as it scrolls. Defaults to 1 (always visible). */
  heroProgress: () => number
  setHeroProgress: (value: number) => void
  /** AppLayout's scrollable <main> element, set via ref. Lets pages read scroll position (e.g. via useScrollProgress) without querying the DOM directly. */
  mainEl: () => HTMLElement | null
  setMainEl: (el: HTMLElement | null) => void
  /** True once Home has been scrolled all the way to its footer. Lets the sidebar's
   *  divider-above-Settings only go full-bleed (to line up with the footer) once the footer is
   *  actually in view, instead of the whole time you're on Home. Defaults to false. */
  scrolledToBottom: () => boolean
  setScrolledToBottom: (value: boolean) => void
}

const UIContext = createContext<UIContextValue>()

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'auto' || stored === 'light' || stored === 'dark') return stored
  return 'auto'
}

function getInitialSidebarState(): SidebarState {
  const stored = localStorage.getItem('sidebarState')
  if (stored === 'expanded' || stored === 'collapsed' || stored === 'hidden') return stored
  return 'expanded'
}

function getInitialContentWidth(): ContentWidth {
  const stored = localStorage.getItem('contentWidth')
  if (stored === 'full' || stored === 'centered') return stored
  return 'full'
}

export const UIProvider: ParentComponent = (props) => {
  const { isOwner } = useAuth()

  const [pageTitle, setPageTitle] = createSignal<string | null>(null)
  const [pageActions, setPageActions] = createSignal<JSX.Element | null>(null)
  const [editMode, setEditMode] = createSignal(false)
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme())
  const [sidebarState, setSidebarState] = createSignal<SidebarState>(getInitialSidebarState())
  const [contentWidth, setContentWidth] = createSignal<ContentWidth>(getInitialContentWidth())
  const [heroProgress, setHeroProgress] = createSignal(1)
  const [mainEl, setMainEl] = createSignal<HTMLElement | null>(null)
  const [scrolledToBottom, setScrolledToBottom] = createSignal(false)

  createEffect(() => {
    if (!isOwner()) setEditMode(false)
  })

  createEffect(() => {
    if (theme() === 'auto') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme())
    }
    localStorage.setItem('theme', theme())
  })

  createEffect(() => {
    localStorage.setItem('sidebarState', sidebarState())
  })

  createEffect(() => {
    localStorage.setItem('contentWidth', contentWidth())
  })

  const value: UIContextValue = {
    pageTitle,
    setPageTitle,
    pageActions,
    setPageActions,
    editMode,
    toggleEditMode: () => setEditMode((v) => !v),
    theme,
    cycleTheme: () => setTheme((t) => THEME_CYCLE[(THEME_CYCLE.indexOf(t) + 1) % THEME_CYCLE.length]),
    sidebarState,
    cycleSidebar: () =>
      setSidebarState((s) => SIDEBAR_CYCLE[(SIDEBAR_CYCLE.indexOf(s) + 1) % SIDEBAR_CYCLE.length]),
    contentWidth,
    cycleContentWidth: () =>
      setContentWidth((w) => CONTENT_WIDTH_CYCLE[(CONTENT_WIDTH_CYCLE.indexOf(w) + 1) % CONTENT_WIDTH_CYCLE.length]),
    heroProgress,
    setHeroProgress,
    mainEl,
    setMainEl,
    scrolledToBottom,
    setScrolledToBottom,
  }

  return <UIContext.Provider value={value}>{props.children}</UIContext.Provider>
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return ctx
}
