export function ScrobbleStat(props: { scrobbles: number }) {
  return <span>{props.scrobbles.toLocaleString()} scrobbles</span>
}
