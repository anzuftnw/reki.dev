import { Show, type ParentComponent } from 'solid-js'
import { Navigate } from '@solidjs/router'
import { useAuth } from '@/context/AuthContext'

export const RequireOwner: ParentComponent = (props) => {
  const { isOwner } = useAuth()

  return (
    <Show when={isOwner()} fallback={<Navigate href="/" />}>
      {props.children}
    </Show>
  )
}
