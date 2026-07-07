import { Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useLocation } from '@solidjs/router'
import {
  TbOutlineDeviceDesktop,
  TbOutlineLayoutSidebar,
  TbOutlineLayoutSidebarLeftCollapse,
  TbOutlineLayoutSidebarLeftExpand,
  TbOutlineMoon,
  TbOutlineSun,
} from 'solid-icons/tb'
import { matchNavItem } from '@/lib/navigation'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

const THEME_ICON = {
  auto: TbOutlineDeviceDesktop,
  light: TbOutlineSun,
  dark: TbOutlineMoon,
}

const SIDEBAR_ICON = {
  expanded: TbOutlineLayoutSidebarLeftCollapse,
  collapsed: TbOutlineLayoutSidebar,
  hidden: TbOutlineLayoutSidebarLeftExpand,
}

const chip =
  'rounded-md border border-border-strong bg-surface-1/50 text-text-2 transition-colors hover:bg-surface-3 hover:text-text-1'
const iconButton = `flex size-9 items-center justify-center ${chip}`

export function TopBar() {
  const location = useLocation()
  const { isOwner } = useAuth()
  const { pageTitle, pageActions, editMode, toggleEditMode, theme, cycleTheme, sidebarState, cycleSidebar, heroProgress } =
    useUI()

  const match = () => matchNavItem(location.pathname)

  return (
    <header class="absolute inset-x-0 top-0 z-20 h-14">
      <div
        class="absolute inset-0 border-b border-border bg-canvas backdrop-blur-md"
        style={{ opacity: heroProgress() }}
      />

      <div class="relative flex h-full items-center justify-between gap-4 px-2.5">
        <div class="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Sidebar: ${sidebarState()}. Click to change.`}
            onClick={cycleSidebar}
            class={iconButton}
          >
            <Dynamic component={SIDEBAR_ICON[sidebarState()]} size={18} />
          </button>

          <nav aria-label="Breadcrumb">
            <ol class="flex items-center gap-2 text-sm">
              <Show when={match()?.group.label}>
                <li class="text-text-2">{match()?.group.label}</li>
                <li aria-hidden="true" class="text-text-3">
                  /
                </li>
              </Show>
              <li class={pageTitle() ? 'text-text-2' : 'font-medium text-text-1'}>{match()?.item.label}</li>
              <Show when={pageTitle()}>
                <li aria-hidden="true" class="text-text-3">
                  /
                </li>
                <li aria-current="page" class="font-medium text-text-1">
                  {pageTitle()}
                </li>
              </Show>
            </ol>
          </nav>
        </div>

        <div role="toolbar" aria-label="Page actions" class="flex items-center gap-2">
          {pageActions()}

          <Show when={isOwner()}>
            <button
              type="button"
              role="switch"
              aria-checked={editMode()}
              onClick={toggleEditMode}
              class={`flex h-9 items-center px-2.5 text-sm ${chip}`}
            >
              {editMode() ? 'Editing' : 'Viewing'}
            </button>
          </Show>

          <button
            type="button"
            aria-label="Search"
            class={`flex h-9 items-center gap-1.5 px-3 font-mono text-sm ${chip}`}
          >
            <span aria-hidden="true">⌘K</span>
          </button>

          <button
            type="button"
            aria-label={`Theme: ${theme()}. Click to switch.`}
            onClick={cycleTheme}
            class={iconButton}
          >
            <Dynamic component={THEME_ICON[theme()]} size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
