import type { ParentComponent } from 'solid-js'
import { Show } from 'solid-js'
import { useLocation } from '@solidjs/router'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { RouteGuard } from '@/components/auth/RouteGuard'
import { useUI } from '@/context/UIContext'

export const AppLayout: ParentComponent = (props) => {
  const { contentWidth, setMainEl } = useUI()
  const location = useLocation()
  // Home renders its own full-bleed hero (it cancels main's padding itself) and isn't meant to
  // participate in the centered-content-width setting -- constraining it here would also clip
  // the hero to max-w-6xl instead of the full viewport.
  const isHome = () => location.pathname === '/'

  return (
    <div class="flex h-auto flex-col overflow-visible sm:h-screen sm:flex-row sm:overflow-hidden">
      <Sidebar />
      <div class="relative h-auto min-w-0 flex-1 sm:h-screen">
        <TopBar />
        <main ref={setMainEl} class="static px-5 pt-14 pb-8 sm:absolute sm:inset-0 sm:overflow-y-auto sm:px-11">
          <Show
            when={isHome()}
            fallback={
              <div class="pt-8" classList={{ 'mx-auto w-full max-w-6xl': contentWidth() === 'centered' }}>
                <RouteGuard>{props.children}</RouteGuard>
              </div>
            }
          >
            <RouteGuard>{props.children}</RouteGuard>
          </Show>
        </main>
      </div>
    </div>
  )
}
