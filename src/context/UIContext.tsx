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

const THEME_CYCLE: Theme[] = ['auto', 'light', 'dark']
const SIDEBAR_CYCLE: SidebarState[] = ['expanded', 'collapsed', 'hidden']

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
  /** 0 = fully faded out, 1 = fully visible. Lets a page (e.g. Home's hero) drive the TopBar's opacity as it scrolls. Defaults to 1 (always visible). */
  heroProgress: () => number
  setHeroProgress: (value: number) => void
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

export const UIProvider: ParentComponent = (props) => {
  const { isOwner } = useAuth()

  const [pageTitle, setPageTitle] = createSignal<string | null>(null)
  const [pageActions, setPageActions] = createSignal<JSX.Element | null>(null)
  const [editMode, setEditMode] = createSignal(false)
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme())
  const [sidebarState, setSidebarState] = createSignal<SidebarState>(getInitialSidebarState())
  const [heroProgress, setHeroProgress] = createSignal(1)

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
    heroProgress,
    setHeroProgress,
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
