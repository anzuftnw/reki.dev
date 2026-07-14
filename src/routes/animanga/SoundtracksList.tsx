import { soundtracks } from '@/lib/collections/animanga/soundtracks'
import { ThemeSongListPage } from '@/routes/animanga/components/ThemeSongListPage'

export default function SoundtracksList() {
  return <ThemeSongListPage title="Soundtracks" tagline="OST tracks worth remembering." collection={soundtracks} />
}
