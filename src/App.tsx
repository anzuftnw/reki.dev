import { Router, Route } from '@solidjs/router'
import { AuthProvider } from '@/context/AuthContext'
import { UIProvider } from '@/context/UIContext'
import { AppLayout } from '@/components/layout/AppLayout'
import Home from '@/routes/home/Home'
import Projects from '@/routes/projects/Projects'
import ProjectDetail from '@/routes/projects/ProjectDetail'
import ProjectEditor from '@/routes/projects/ProjectEditor'
import Games from '@/routes/games/Games'
import GameWorkspace from '@/routes/games/GameWorkspace'
import BlogList from '@/routes/blog/BlogList'
import BlogPost from '@/routes/blog/BlogPost'
import BlogEditor from '@/routes/blog/BlogEditor'
import Animanga from '@/routes/animanga/Animanga'
import AnimeList from '@/routes/animanga/AnimeList'
import MangaList from '@/routes/animanga/MangaList'
import CharactersList from '@/routes/animanga/CharactersList'
import OpeningsList from '@/routes/animanga/OpeningsList'
import EndingsList from '@/routes/animanga/EndingsList'
import SoundtracksList from '@/routes/animanga/SoundtracksList'
import Music from '@/routes/music/Music'
import ArtistsList from '@/routes/music/ArtistsList'
import AlbumsList from '@/routes/music/AlbumsList'
import TracksList from '@/routes/music/TracksList'
import Settings from '@/routes/settings/Settings'
import { RequireOwner } from '@/components/auth/RequireOwner'

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router root={AppLayout}>
          <Route path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/new" component={() => <RequireOwner><ProjectEditor /></RequireOwner>} />
          <Route path="/projects/:slug" component={ProjectDetail} />

          <Route path="/blog" component={BlogList} />
          <Route path="/blog/new" component={() => <RequireOwner><BlogEditor /></RequireOwner>} />
          <Route path="/blog/:slug" component={BlogPost} />

          <Route path="/games" component={Games} />
          <Route path="/games/:slug" component={GameWorkspace} />

          <Route path="/animanga" component={Animanga} />
          <Route path="/anime" component={AnimeList} />
          <Route path="/manga" component={MangaList} />
          <Route path="/characters" component={CharactersList} />
          <Route path="/openings" component={OpeningsList} />
          <Route path="/endings" component={EndingsList} />
          <Route path="/soundtracks" component={SoundtracksList} />

          <Route path="/music" component={Music} />
          <Route path="/music/artists" component={ArtistsList} />
          <Route path="/music/albums" component={AlbumsList} />
          <Route path="/music/tracks" component={TracksList} />

          <Route path="/settings" component={Settings} />
        </Router>
      </UIProvider>
    </AuthProvider>
  )
}
