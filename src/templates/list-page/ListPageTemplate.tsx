import { TabbedPageTemplate, type TabbedPageConfig } from '@/templates/tabbed-page/TabbedPageTemplate'
import { ListGridTab, type ListGridConfig } from '@/templates/list-grid/ListGridTab'
import { GenericOverviewTab, type OverviewStatDef } from '@/templates/list-page/GenericOverviewTab'
import { GenericStatsTab, type BreakdownDef } from '@/templates/list-page/GenericStatsTab'

export interface ListPageConfig<T> extends ListGridConfig<T> {
  title: string
  tagline?: string
  isFavorite: (item: T) => boolean | undefined
  overviewStats: OverviewStatDef<T>[]
  statsBreakdowns?: BreakdownDef<T>[]
}

export function ListPageTemplate<T>(props: { config: ListPageConfig<T> }) {
  const config = props.config

  const tabbedConfig: TabbedPageConfig = {
    name: config.title,
    tagline: config.tagline,
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        render: () => (
          <GenericOverviewTab
            config={{
              items: config.items,
              getCover: config.getCover,
              getTitle: config.getTitle,
              isFavorite: config.isFavorite,
              stats: config.overviewStats,
            }}
          />
        ),
      },
      {
        key: 'list',
        label: 'List',
        render: () => <ListGridTab config={config} />,
      },
      {
        key: 'stats',
        label: 'Stats',
        render: () => (
          <GenericStatsTab config={{ items: config.items, stats: config.overviewStats, breakdowns: config.statsBreakdowns }} />
        ),
      },
    ],
  }

  return <TabbedPageTemplate config={tabbedConfig} />
}
