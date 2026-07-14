import { createSignal, Show } from 'solid-js'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function Settings() {
  const { isOwner, login, logout } = useAuth()
  const { contentWidth, cycleContentWidth } = useUI()
  const [loginOpen, setLoginOpen] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email(), password())
      setEmail('')
      setPassword('')
      setLoginOpen(false)
    } catch {
      setError('Login failed')
    }
  }

  return (
    <section class="flex flex-col gap-8">
      <h1 class="text-xl font-semibold">Settings</h1>

      <div class="flex flex-col gap-3">
        <h2 class="text-xs font-semibold tracking-wide text-text-3 uppercase">Layout</h2>
        <Button variant="secondary" class="self-start" onClick={cycleContentWidth}>
          Content width: {contentWidth() === 'full' ? 'Full' : 'Centered'}
        </Button>
      </div>

      <Show
        when={isOwner()}
        fallback={
          <div class="flex flex-col gap-3">
            <h2 class="text-xs font-semibold tracking-wide text-text-3 uppercase">Account</h2>
            <Button class="self-start" onClick={() => setLoginOpen(true)}>
              Admin Login
            </Button>
          </div>
        }
      >
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-3">
            <h2 class="text-xs font-semibold tracking-wide text-text-3 uppercase">Account</h2>
            <p class="text-sm text-text-3">Signed in as admin.</p>
            <Button variant="secondary" class="self-start" onClick={logout}>
              Log out
            </Button>
          </div>

          <div class="flex flex-col gap-3">
            <h2 class="text-xs font-semibold tracking-wide text-text-3 uppercase">Connected accounts</h2>
            <div class="flex max-w-xs flex-col gap-2">
              <Button variant="secondary" disabled>
                Connect AniList
              </Button>
              <Button variant="secondary" disabled>
                Connect Steam
              </Button>
              <Button variant="secondary" disabled>
                Connect Last.fm
              </Button>
            </div>
          </div>
        </div>
      </Show>

      <Modal open={loginOpen()} onClose={() => setLoginOpen(false)}>
        <form onSubmit={handleSubmit} class="flex w-72 flex-col gap-3">
          <h2 class="mb-1 text-lg font-semibold">Admin Login</h2>
          <Input label="Email" type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
          <Input
            label="Password"
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <Button type="submit">Log in</Button>
          <Show when={error()}>
            <p role="alert" class="text-sm text-red-soft">
              {error()}
            </p>
          </Show>
        </form>
      </Modal>
    </section>
  )
}
