import { A } from '@solidjs/router'

export function Nav() {
  return (
    <nav>
      <ul>
        <li><A href="/">Home</A></li>
        <li><A href="/projects">Projects</A></li>
        <li><A href="/blog">Blog</A></li>
        <li><A href="/anime">Anime</A></li>
        <li><A href="/manga">Manga</A></li>
        <li><A href="/characters">Characters</A></li>
        <li><A href="/openings">Openings</A></li>
        <li><A href="/endings">Endings</A></li>
        <li><A href="/soundtracks">Soundtracks</A></li>
        <li><A href="/music/artists">Music</A></li>
        <li><A href="/tierlists">Tierlists</A></li>
      </ul>
    </nav>
  )
}
