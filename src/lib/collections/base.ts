import { pb } from '@/lib/pocketbase'

export function makeListCollection<T extends { id: string }>(name: string) {
  const collection = () => pb.collection(name)

  return {
    list: (sort = '-created') => collection().getFullList<T>({ sort }),
    create: (data: Partial<T>) => collection().create<T>(data),
    update: (id: string, data: Partial<T>) => collection().update<T>(id, data),
    remove: (id: string) => collection().delete(id),
  }
}
