interface StatusBadgeProps {
  status: string
}

export function StatusBadge(props: StatusBadgeProps) {
  return <span>{props.status}</span>
}
