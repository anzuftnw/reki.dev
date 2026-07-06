import { Show, createSignal } from 'solid-js'
import { useAuth } from '@/context/AuthContext'
import { pb } from '@/lib/pocketbase'
import { Button } from '@/components/ui/Button'

// Calls the owner-gated PocketBase route registered in pocketbase/pb_hooks/lastfm_sync.pb.js
export function SyncButton() {
  const { isOwner } = useAuth()
  const [syncing, setSyncing] = createSignal(false)

  const handleSync = async () => {
    setSyncing(true)
    try {
      await pb.send('/sync/lastfm', { method: 'POST' })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Show when={isOwner()}>
      <Button onClick={handleSync} disabled={syncing()}>
        {syncing() ? 'Syncing...' : 'Sync from last.fm'}
      </Button>
    </Show>
  )
}
