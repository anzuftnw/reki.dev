import { pb } from '@/lib/pocketbase'

export interface BlogPost {
  id: string
  slug: string
  title: string
  body: string
  publishedAt: string
}

const collection = () => pb.collection('blog_posts')

export const blog = {
  list: () => collection().getFullList<BlogPost>({ sort: '-publishedAt' }),
  getBySlug: (slug: string) =>
    collection().getFirstListItem<BlogPost>(pb.filter('slug = {:slug}', { slug })),
  create: (data: Partial<BlogPost>) => collection().create<BlogPost>(data),
  update: (id: string, data: Partial<BlogPost>) => collection().update<BlogPost>(id, data),
  remove: (id: string) => collection().delete(id),
}
