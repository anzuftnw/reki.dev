import { ProjectCard } from '@/routes/projects/components/ProjectCard'

export default function Projects() {
  return (
    <section>
      <h1>Projects</h1>
      <ul>
        <li>
          <ProjectCard title="reki.dev" description="This very site." />
        </li>
      </ul>
    </section>
  )
}
