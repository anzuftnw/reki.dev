import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useParams } from '@solidjs/router'
import ArknightsWorkspace from '@/routes/games/arknights/ArknightsWorkspace'

const WORKSPACES: Record<string, Component> = {
  arknights: ArknightsWorkspace,
}

export default function GameWorkspace() {
  const params = useParams<{ slug: string }>()
  const workspace = () => WORKSPACES[params.slug]

  return (
    <Show when={workspace()} fallback={<p class="text-sm text-text-3">This game's workspace isn't built yet.</p>}>
      {(Workspace) => <Dynamic component={Workspace()} />}
    </Show>
  )
}
