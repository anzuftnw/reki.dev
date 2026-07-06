import type { ParentComponent } from 'solid-js'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export const PageShell: ParentComponent = (props) => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>{props.children}</main>
      <Footer />
    </>
  )
}
