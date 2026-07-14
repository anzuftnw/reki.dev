import { Show, type ParentComponent } from 'solid-js'
import { Navigate, useLocation } from '@solidjs/router'
import { useAuth } from '@/context/AuthContext'
import { isRouteAllowed } from '@/lib/navigation'

/**
 * Nav-driven counterpart to RequireOwner: blocks direct navigation to any route
 * whose matching NavItem is marked `visibility: 'owner'`, so a hidden-from-sidebar
 * page can't be reached just by typing its URL. Routes with no matching NavItem
 * (e.g. /blog/:slug) are unaffected — use RequireOwner for those instead.
 */
export const RouteGuard: ParentComponent = (props) => {
  const location = useLocation()
  const { isOwner } = useAuth()

  return (
    <Show when={isRouteAllowed(location.pathname, isOwner())} fallback={<Navigate href="/" />}>
      {props.children}
    </Show>
  )
}
