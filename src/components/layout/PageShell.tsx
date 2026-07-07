import type { ParentComponent } from 'solid-js'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'

export const PageShell: ParentComponent = (props) => {
  return (
    <div class="shell">
      <Sidebar />
      <div class="shell-content">
        <TopBar />
        <main>{props.children}</main>
        <Footer />
      </div>
    </div>
  )
}
