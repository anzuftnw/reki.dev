interface ProjectCardProps {
  title: string
  description: string
  href?: string
}

export function ProjectCard(props: ProjectCardProps) {
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
      {props.href && <a href={props.href}>View</a>}
    </article>
  )
}
