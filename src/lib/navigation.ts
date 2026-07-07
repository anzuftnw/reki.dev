import type { IconTypes } from 'solid-icons'
import {
  TbOutlineBook2,
  TbOutlineDisc,
  TbOutlineFileText,
  TbOutlineFolder,
  TbOutlineHome,
  TbOutlineListDetails,
  TbOutlineMicrophone2,
  TbOutlineMovie,
  TbOutlineMusic,
  TbOutlinePlaylist,
  TbOutlineSettings,
  TbOutlineUsers,
  TbOutlineVinyl,
} from 'solid-icons/tb'

export interface NavItem {
  label: string
  href: string
  icon: IconTypes
}

export interface NavGroup {
  label: string | null
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { label: 'Home', href: '/', icon: TbOutlineHome },
      { label: 'Projects', href: '/projects', icon: TbOutlineFolder },
      { label: 'Blog', href: '/blog', icon: TbOutlineFileText },
    ],
  },
  {
    label: 'Animanga',
    items: [
      { label: 'Anime', href: '/anime', icon: TbOutlineMovie },
      { label: 'Manga', href: '/manga', icon: TbOutlineBook2 },
      { label: 'Characters', href: '/characters', icon: TbOutlineUsers },
      { label: 'Openings', href: '/openings', icon: TbOutlineMusic },
      { label: 'Endings', href: '/endings', icon: TbOutlineVinyl },
      { label: 'Soundtracks', href: '/soundtracks', icon: TbOutlineDisc },
    ],
  },
  {
    label: 'Music',
    items: [
      { label: 'Artists', href: '/music/artists', icon: TbOutlineMicrophone2 },
      { label: 'Albums', href: '/music/albums', icon: TbOutlinePlaylist },
      { label: 'Tracks', href: '/music/tracks', icon: TbOutlineListDetails },
    ],
  },
]

// Pinned to the sidebar bottom, outside the regular nav groups — kept here (rather than
// hardcoded in Sidebar) so matchNavItem/breadcrumbs can resolve it like any other item.
export const settingsItem: NavItem = { label: 'Settings', href: '/settings', icon: TbOutlineSettings }

export function matchNavItem(pathname: string): { group: NavGroup; item: NavItem } | null {
  let best: { group: NavGroup; item: NavItem } | null = null

  for (const group of navGroups) {
    for (const item of group.items) {
      const isMatch =
        item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)

      if (isMatch && (!best || item.href.length > best.item.href.length)) {
        best = { group, item }
      }
    }
  }

  if (!best && (pathname === settingsItem.href || pathname.startsWith(`${settingsItem.href}/`))) {
    best = { group: { label: null, items: [settingsItem] }, item: settingsItem }
  }

  return best
}
