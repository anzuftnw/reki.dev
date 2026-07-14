import { useLocation } from '@solidjs/router'
import { matchNavItem } from '@/lib/navigation'
import { useUI } from '@/context/UIContext'
import { Breadcrumb } from '@/components/layout/topbar/Breadcrumb'
import { SidebarToggle } from '@/components/layout/topbar/SidebarToggle'
import { ThemeToggle } from '@/components/layout/topbar/ThemeToggle'
import { EditModeToggle } from '@/components/layout/topbar/EditModeToggle'

export function TopBar() {
  const location = useLocation()
  const { pageTitle, pageActions, heroProgress } = useUI()

  const match = () => matchNavItem(location.pathname)

  return (
    <header class="absolute inset-x-0 top-0 z-20 h-14">
      <div
        class="absolute inset-0 border-b border-border bg-canvas backdrop-blur-md"
        style={{ opacity: heroProgress() }}
      />

      <div class="relative flex h-full items-center justify-between gap-4 px-3">
        <div class="flex items-center gap-3">
          <SidebarToggle />
          <Breadcrumb match={match()} pageTitle={pageTitle()} />
        </div>

        <div role="toolbar" aria-label="Page actions" class="flex items-center gap-2">
          {pageActions()}
          <EditModeToggle />
          <button
            type="button"
            aria-label="Search"
            class="flex h-8 items-center gap-2 rounded-md border border-border-strong bg-surface-1/50 px-3 font-mono text-sm text-text-2 transition-colors hover:bg-surface-3 hover:text-text-1"
          >
            <span aria-hidden="true">⌘K</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
