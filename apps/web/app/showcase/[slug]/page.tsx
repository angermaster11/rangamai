import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ExternalLink, Github } from "lucide-react";
import { getProjectBySlug, getProjects, getServices } from "@/lib/content";
import {
  breadcrumbJsonLd,
  buildMetadata,
  projectJsonLd,
} from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { FinalCtaBand } from "@/components/sections/FinalCtaBand";

type Params = { slug: string };

/**
 * ISR: re-generate at most once every 60s so admin edits surface without a
 * rebuild. Slugs added after build render on-demand (dynamicParams default).
 */
export const revalidate = 60;

/** Pre-render every published project at build time (SSG), from the API/seed. */
export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Case study not found" };

  return buildMetadata({
    title: project.seo?.metaTitle ?? project.title,
    description: project.seo?.metaDescription ?? project.shortDescription,
    path: `/showcase/${project.slug}`,
    ogImage: project.seo?.ogImage,
    type: "article",
    absoluteTitle: Boolean(project.seo?.metaTitle),
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [project, allServices] = await Promise.all([
    getProjectBySlug(slug),
    getServices(),
  ]);
  if (!project) notFound();

  const relatedServices = allServices.filter((s) =>
    project.servicesUsed?.includes(s.slug),
  );

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(project),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Showcase", path: "/showcase" },
            { name: project.title, path: `/showcase/${project.slug}` },
          ]),
        ]}
      />

      {/* Header */}
      <section className="border-b border-border">
        <Container className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/showcase" className="hover:text-foreground">
              Showcase
            </Link>
            <span className="px-2" aria-hidden>
              /
            </span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          {project.industry ? (
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              {project.industry}
            </p>
          ) : null}
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>

          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <ButtonLink href={project.liveUrl} size="md">
                  Visit live site
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </ButtonLink>
              ) : null}
              {project.githubUrl ? (
                <ButtonLink href={project.githubUrl} size="md" variant="secondary">
                  <Github className="h-4 w-4" aria-hidden />
                  Source
                </ButtonLink>
              ) : null}
            </div>
          )}
        </Container>
      </section>

      {/* Metrics strip */}
      {project.metrics?.length ? (
        <section className="border-b border-border bg-muted/40">
          <Container className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-sm text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-foreground">
                  {m.value}
                </dd>
              </div>
            ))}
          </Container>
        </section>
      ) : null}

      {/* Body */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Overview
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>

            {project.problem ? (
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  The problem
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {project.problem}
                </p>
              </div>
            ) : null}

            {project.solution ? (
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Our solution
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {project.solution}
                </p>
              </div>
            ) : null}

            {project.keyFeatures?.length ? (
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Key features
                </h2>
                <ul className="mt-4 space-y-3">
                  {project.keyFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {project.client ? (
              <div>
                <h2 className="text-sm font-semibold text-foreground">Client</h2>
                <p className="mt-2 text-sm text-muted-foreground">{project.client}</p>
              </div>
            ) : null}

            {project.techStack?.length ? (
              <div>
                <h2 className="text-sm font-semibold text-foreground">Tech stack</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {relatedServices.length ? (
              <div>
                <h2 className="text-sm font-semibold text-foreground">Services used</h2>
                <ul className="mt-3 space-y-2">
                  {relatedServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      <FinalCtaBand
        heading="Want something like this?"
        subheading="Tell us about your project and we'll show you how we'd approach it."
        cta={{ label: "Start a project", href: "/contact" }}
      />
    </>
  );
}
