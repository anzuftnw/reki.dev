import { TabbedPageTemplate, type TabbedPageConfig } from '@/templates/tabbed-page/TabbedPageTemplate'
import { ArknightsOverviewTab } from '@/routes/games/arknights/tabs/Overview'
import { ArknightsCollectionTab } from '@/routes/games/arknights/tabs/Collection'
import { ArknightsTeamsTab } from '@/routes/games/arknights/tabs/Teams'
import { ArknightsPlannerTab } from '@/routes/games/arknights/tabs/Planner'
import { arknightsHistorySubtabs } from '@/routes/games/arknights/tabs/History'

const config: TabbedPageConfig = {
  name: 'Arknights',
  tagline: 'Tower-defense gacha RPG by Hypergryph.',
  tabs: [
    { key: 'overview', label: 'Overview', render: () => <ArknightsOverviewTab /> },
    { key: 'collection', label: 'Collection', render: () => <ArknightsCollectionTab /> },
    { key: 'teams', label: 'Teams', render: () => <ArknightsTeamsTab /> },
    { key: 'planner', label: 'Planner', render: () => <ArknightsPlannerTab /> },
    { key: 'history', label: 'History', subtabs: arknightsHistorySubtabs },
  ],
}

export default function ArknightsWorkspace() {
  return <TabbedPageTemplate config={config} />
}
