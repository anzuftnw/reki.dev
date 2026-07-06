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
    <dialog ref={ref} onClose={() => props.onClose()}>
      {props.children}
    </dialog>
  )
}
