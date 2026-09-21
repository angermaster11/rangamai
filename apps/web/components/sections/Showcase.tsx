import type { Project } from "@rangamai/shared";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";

/** Homepage showcase — featured projects / case studies, ordered by the CMS. */
export function Showcase({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section className="border-y border-border bg-muted/40">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="Case studies from real builds"
          lead="A look at products we've designed and shipped — the problem, the approach, and what we delivered."
        />
        <ButtonLink href="/showcase" variant="ghost" className="shrink-0">
          All work
        </ButtonLink>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
