import { type ParentComponent, createEffect } from 'solid-js'

interface ModalProps {
  open: boolean
  onClose: () => void
}

export const Modal: ParentComponent<ModalProps> = (props) => {
  let ref: HTMLDialogElement | undefined

  createEffect(() => {
    if (props.open) {
      ref?.showModal()
    } else {
      ref?.close()
    }
  })

  return (
    <dialog
      ref={ref}
      onClose={() => props.onClose()}
      class="rounded-xl border border-border bg-surface-1 p-6 text-text-1 shadow-lg backdrop:bg-black/40"
    >
      {props.children}
    </dialog>
  )
}
