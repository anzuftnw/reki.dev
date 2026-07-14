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
    // Derived from the `user` signal (not a direct pb.authStore.isValid read) so it's
    // actually reactive -- authStore itself isn't a Solid signal, so reading it directly
    // here would freeze at whatever it was on first render and never update after login/logout.
    isOwner: () => !!user(),
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
