import { pb } from '@/lib/pocketbase'

export type ProjectStatus = 'wip' | 'complete' | 'archived'

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  body?: string
  cover?: string
  codeUrl?: string
  liveUrl?: string
  tech?: string[]
  status: ProjectStatus
  featured?: boolean
  order?: number
  publishedAt?: string
  created: string
  updated: string
}

export interface ProjectInput {
  title: string
  slug: string
  summary: string
  body?: string
  cover?: File | null
  codeUrl?: string
  liveUrl?: string
  tech?: string[]
  status: ProjectStatus
  featured?: boolean
  order?: number
  publishedAt?: string | null
}

const collection = () => pb.collection('projects')

export const projects = {
  list: () => collection().getFullList<Project>({ sort: '+order,-publishedAt' }),
  getBySlug: (slug: string) =>
    collection().getFirstListItem<Project>(pb.filter('slug = {:slug}', { slug })),
  create: (data: ProjectInput) => collection().create<Project>(data),
  update: (id: string, data: Partial<ProjectInput>) => collection().update<Project>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (project: Project) =>
    project.cover ? pb.files.getURL(project, project.cover, { thumb: '800x0' }) : null,
}
