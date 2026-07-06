import { Router, Route } from '@solidjs/router'
import { AuthProvider } from '@/context/AuthContext'
import { PageShell } from '@/components/layout/PageShell'
import Home from '@/routes/home/Home'
import Projects from '@/routes/projects/Projects'
import BlogList from '@/routes/blog/BlogList'
import BlogPost from '@/routes/blog/BlogPost'
import BlogEditor from '@/routes/blog/BlogEditor'
import AnimeList from '@/routes/animanga/AnimeList'
import MangaList from '@/routes/animanga/MangaList'
import CharactersList from '@/routes/animanga/CharactersList'
import OpeningsList from '@/routes/animanga/OpeningsList'
import EndingsList from '@/routes/animanga/EndingsList'
import SoundtracksList from '@/routes/animanga/SoundtracksList'
import ArtistsList from '@/routes/music/ArtistsList'
import AlbumsList from '@/routes/music/AlbumsList'
import TracksList from '@/routes/music/TracksList'
import TierlistIndex from '@/routes/tierlists/TierlistIndex'
import TierlistView from '@/routes/tierlists/TierlistView'
import Login from '@/routes/auth/Login'
import { RequireOwner } from '@/routes/auth/RequireOwner'

export default function App() {
  return (
    <AuthProvider>
      <Router root={PageShell}>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Projects} />

        <Route path="/blog" component={BlogList} />
        <Route path="/blog/new" component={() => <RequireOwner><BlogEditor /></RequireOwner>} />
        <Route path="/blog/:slug" component={BlogPost} />

        <Route path="/anime" component={AnimeList} />
        <Route path="/manga" component={MangaList} />
        <Route path="/characters" component={CharactersList} />
        <Route path="/openings" component={OpeningsList} />
        <Route path="/endings" component={EndingsList} />
        <Route path="/soundtracks" component={SoundtracksList} />

        <Route path="/music/artists" component={ArtistsList} />
        <Route path="/music/albums" component={AlbumsList} />
        <Route path="/music/tracks" component={TracksList} />

        <Route path="/tierlists" component={TierlistIndex} />
        <Route path="/tierlists/:id" component={TierlistView} />

        <Route path="/login" component={Login} />
      </Router>
    </AuthProvider>
  )
}
