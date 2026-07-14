import { Dynamic } from 'solid-js/web'
import { TbOutlineDeviceDesktop, TbOutlineMoon, TbOutlineSun } from 'solid-icons/tb'
import { Button } from '@/components/ui/Button'
import { useUI } from '@/context/UIContext'

const THEME_ICON = {
  auto: TbOutlineDeviceDesktop,
  light: TbOutlineSun,
  dark: TbOutlineMoon,
}

export function ThemeToggle() {
  const { theme, cycleTheme } = useUI()

  return (
    <Button
      variant="chip"
      size="icon"
      type="button"
      aria-label={`Theme: ${theme()}. Click to switch.`}
      onClick={cycleTheme}
    >
      <Dynamic component={THEME_ICON[theme()]} size={20} aria-hidden="true" />
    </Button>
  )
}
