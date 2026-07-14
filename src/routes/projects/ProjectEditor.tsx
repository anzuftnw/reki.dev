import { useNavigate } from '@solidjs/router'
import { projects } from '@/lib/collections/projects'
import { ProjectForm } from '@/routes/projects/components/ProjectForm'

export default function ProjectEditor() {
  const navigate = useNavigate()

  return (
    <section class="flex flex-col gap-6">
      <h1 class="text-xl font-semibold">New project</h1>
      <ProjectForm
        submitLabel="Save"
        onSubmit={async (data) => {
          const project = await projects.create(data)
          navigate(`/projects/${project.slug}`)
        }}
      />
    </section>
  )
}
