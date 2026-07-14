import { pb } from '@/lib/pocketbase'

export interface BlogPost {
  id: string
  slug: string
  title: string
  body: string
  excerpt?: string
  tags?: string[]
  cover?: string
  publishedAt?: string
  created: string
  updated: string
}

export interface BlogPostInput {
  title: string
  slug: string
  body: string
  excerpt?: string
  tags?: string[]
  cover?: File | null
  publishedAt?: string | null
}

const collection = () => pb.collection('blog_posts')

export const blog = {
  list: () => collection().getFullList<BlogPost>({ sort: '-publishedAt' }),
  getBySlug: (slug: string) =>
    collection().getFirstListItem<BlogPost>(pb.filter('slug = {:slug}', { slug })),
  create: (data: BlogPostInput) => collection().create<BlogPost>(data),
  update: (id: string, data: Partial<BlogPostInput>) => collection().update<BlogPost>(id, data),
  remove: (id: string) => collection().delete(id),
  coverUrl: (post: BlogPost) => (post.cover ? pb.files.getURL(post, post.cover, { thumb: '800x0' }) : null),
}
