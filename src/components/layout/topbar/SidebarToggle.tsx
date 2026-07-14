import { Dynamic } from 'solid-js/web'
import {
  TbOutlineLayoutSidebar,
  TbOutlineLayoutSidebarLeftCollapse,
  TbOutlineLayoutSidebarLeftExpand,
} from 'solid-icons/tb'
import { Button } from '@/components/ui/Button'
import { useUI } from '@/context/UIContext'

const SIDEBAR_ICON = {
  expanded: TbOutlineLayoutSidebarLeftCollapse,
  collapsed: TbOutlineLayoutSidebar,
  hidden: TbOutlineLayoutSidebarLeftExpand,
}

export function SidebarToggle() {
  const { sidebarState, cycleSidebar } = useUI()

  return (
    <Button
      variant="chip"
      size="icon"
      type="button"
      aria-label={`Sidebar: ${sidebarState()}. Click to change.`}
      onClick={cycleSidebar}
    >
      <Dynamic component={SIDEBAR_ICON[sidebarState()]} size={20} />
    </Button>
  )
}
