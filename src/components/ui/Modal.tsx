import { createEffect, type ParentComponent } from 'solid-js'

interface ModalProps {
  open: boolean
  onClose: () => void
}

export const Modal: ParentComponent<ModalProps> = (props) => {
  let dialogRef: HTMLDialogElement | undefined

  createEffect(() => {
    if (!dialogRef) return
    if (props.open && !dialogRef.open) dialogRef.showModal()
    else if (!props.open && dialogRef.open) dialogRef.close()
  })

  // Clicking the backdrop hits the <dialog> element itself (its content box is sized to its
  // children) -- clicking inside the actual content never reaches this handler.
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogRef) props.onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault()
        props.onClose()
      }}
      onClick={handleBackdropClick}
      class="modal-dialog m-auto rounded-xl border border-border bg-surface-1 p-6 text-text-1 shadow-lg"
    >
      <div>{props.children}</div>
    </dialog>
  )
}
