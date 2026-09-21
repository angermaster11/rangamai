import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@rangamai/shared";
import { Card } from "./Card";

/**
 * Project / case-study summary card. Reused on the homepage showcase and the
 * /showcase listing. Uses a text-led design since real cover images arrive in
 * a later phase (Cloudinary).
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/showcase/${project.slug}`}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Card interactive className="flex h-full flex-col">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
          {project.industry ? <span>{project.industry}</span> : null}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        {project.techStack?.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.techStack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          View case study
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Card>
    </Link>
  );
}
