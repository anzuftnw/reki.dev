import { Show } from 'solid-js'
import { Switch } from '@/components/ui/Switch'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'

export function EditModeToggle() {
  const { isOwner } = useAuth()
  const { editMode, toggleEditMode } = useUI()

  return (
    <Show when={isOwner()}>
      <Switch checked={editMode()} onChange={toggleEditMode} labelOn="Editing" labelOff="Viewing" />
    </Show>
  )
}
