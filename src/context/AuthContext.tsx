import { createContext, useContext, createSignal, onCleanup, type ParentComponent } from 'solid-js'
import type { RecordModel } from 'pocketbase'
import { pb } from '@/lib/pocketbase'

interface AuthContextValue {
  user: () => RecordModel | null
  isOwner: () => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal(pb.authStore.record)

  const unsubscribe = pb.authStore.onChange(() => {
    setUser(pb.authStore.record)
  })
  onCleanup(unsubscribe)

  const value: AuthContextValue = {
    user,
    isOwner: () => pb.authStore.isValid,
    login: async (email, password) => {
      await pb.collection('users').authWithPassword(email, password)
    },
    logout: () => {
      pb.authStore.clear()
    },
  }

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
