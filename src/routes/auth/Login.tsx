import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email(), password())
      navigate('/')
    } catch {
      setError('Login failed')
    }
  }

  return (
    <section>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
        <Button type="submit">Log in</Button>
      </form>
      {error() && <p role="alert">{error()}</p>}
    </section>
  )
}
