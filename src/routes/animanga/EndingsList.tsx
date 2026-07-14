import { endings } from '@/lib/collections/animanga/endings'
import { ThemeSongListPage } from '@/routes/animanga/components/ThemeSongListPage'

export default function EndingsList() {
  return <ThemeSongListPage title="Endings" tagline="Ending themes, ranked." collection={endings} />
}
