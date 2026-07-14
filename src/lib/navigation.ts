import type { IconTypes } from 'solid-icons'
import {
  TbOutlineBook2,
  TbOutlineDeviceGamepad2,
  TbOutlineDisc,
  TbOutlineFileText,
  TbOutlineFolder,
  TbOutlineHome,
  TbOutlineLayoutGrid,
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
  /** Defaults to 'public'. 'owner' hides the item from the sidebar for non-owners
   *  and blocks direct navigation to it via RouteGuard — single source of truth
   *  for both. */
  visibility?: 'public' | 'owner'
}

export interface NavGroup {
  label: string | null
  /** Present when the group has its own landing/overview page — the group's sidebar
   *  header links here directly instead of duplicating it as a first "Overview" item.
   *  `icon` is required alongside it so the header can render as a full nav row
   *  (matching NavRow) instead of disappearing in icon-only sidebar mode. */
  href?: string
  icon?: IconTypes
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
    label: 'Games',
    href: '/games',
    icon: TbOutlineLayoutGrid,
    items: [{ label: 'Arknights', href: '/games/arknights', icon: TbOutlineDeviceGamepad2 }],
  },
  {
    label: 'Animanga',
    href: '/animanga',
    icon: TbOutlineLayoutGrid,
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
    href: '/music',
    icon: TbOutlineLayoutGrid,
    items: [
      { label: 'Artists', href: '/music/artists', icon: TbOutlineMicrophone2 },
      { label: 'Albums', href: '/music/albums', icon: TbOutlinePlaylist },
      { label: 'Tracks', href: '/music/tracks', icon: TbOutlineListDetails },
    ],
  },
]

export const settingsItem: NavItem = { label: 'Settings', href: '/settings', icon: TbOutlineSettings }

export function matchNavItem(pathname: string): { group: NavGroup; item: NavItem | null } | null {
  let best: { group: NavGroup; item: NavItem | null; matchedHref: string } | null = null

  const consider = (group: NavGroup, item: NavItem | null, href: string) => {
    const isMatch = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
    if (isMatch && (!best || href.length > best.matchedHref.length)) {
      best = { group, item, matchedHref: href }
    }
  }

  for (const group of navGroups) {
    if (group.href) consider(group, null, group.href)
    for (const item of group.items) consider(group, item, item.href)
  }

  if (!best && (pathname === settingsItem.href || pathname.startsWith(`${settingsItem.href}/`))) {
    best = { group: { label: null, items: [settingsItem] }, item: settingsItem, matchedHref: settingsItem.href }
  }

  return best ? { group: best.group, item: best.item } : null
}

export function filterVisibleNavGroups(groups: NavGroup[], isOwner: boolean): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => (item.visibility ?? 'public') === 'public' || isOwner),
    }))
    .filter((group) => group.items.length > 0)
}

export function isRouteAllowed(pathname: string, isOwner: boolean): boolean {
  const match = matchNavItem(pathname)
  if (!match) return true
  return (match.item?.visibility ?? 'public') === 'public' || isOwner
}
