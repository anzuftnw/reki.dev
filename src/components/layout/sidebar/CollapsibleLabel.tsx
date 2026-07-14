import type { JSX } from 'solid-js'
import { Collapsible } from '@/components/ui/Collapsible'

export function CollapsibleLabel(props: { collapsed: boolean; class?: string; children: JSX.Element }) {
  return (
    <Collapsible open={!props.collapsed} axis="width">
      <span class={`pl-2 whitespace-nowrap ${props.class ?? ''}`}>{props.children}</span>
    </Collapsible>
  )
}
