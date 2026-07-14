import { openings } from '@/lib/collections/animanga/openings'
import { ThemeSongListPage } from '@/routes/animanga/components/ThemeSongListPage'

export default function OpeningsList() {
  return <ThemeSongListPage title="Openings" tagline="Opening themes, ranked." collection={openings} />
}
