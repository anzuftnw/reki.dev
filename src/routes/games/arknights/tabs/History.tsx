import { GenericHistoryTab } from '@/templates/workspace/GenericHistoryTab'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { TabbedPageSubtab } from '@/templates/tabbed-page/TabbedPageTemplate'

export const arknightsHistorySubtabs: TabbedPageSubtab[] = [
  {
    key: 'pulls',
    label: 'Operator Pulls',
    render: () => (
      <GenericHistoryTab
        config={{
          game: 'arknights',
          category: 'pulls',
          renderExtra: (entry) => (entry.rarity ? <StatusBadge status={`${entry.rarity}★`} /> : null),
        }}
      />
    ),
  },
  {
    key: 'tasks',
    label: 'Tasks',
    render: () => <GenericHistoryTab config={{ game: 'arknights', category: 'tasks' }} />,
  },
]
