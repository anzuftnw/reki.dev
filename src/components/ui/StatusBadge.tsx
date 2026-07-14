interface StatusBadgeProps {
  status: string
}

export function StatusBadge(props: StatusBadgeProps) {
  return (
    <span class="inline-flex items-center rounded-full bg-surface-3 px-3 py-0.5 font-mono text-2xs tracking-wide text-text-2 uppercase">
      {props.status}
    </span>
  )
}
