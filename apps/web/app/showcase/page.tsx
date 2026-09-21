import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { FinalCtaBand } from "@/components/sections/FinalCtaBand";

/** ISR: refresh the showcase list at most once every 60s. */
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Showcase",
  description:
    "Case studies from RANGAMAI — real products we've designed and built, with the problem, approach, and outcome for each.",
  path: "/showcase",
});

/** Showcase listing — all published projects, ordered. Statically generated. */
export default async function ShowcasePage() {
  const projects = await getProjects();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Showcase", path: "/showcase" },
        ])}
      />
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Showcase"
          title="Work we've shipped"
          lead="A selection of products we've designed and built end to end. Each case study covers the problem, our approach, and what we delivered."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <FinalCtaBand
        heading="Have a project like these?"
        subheading="We'd like to hear about it. Tell us what you're building."
        cta={{ label: "Start a project", href: "/contact" }}
      />
    </>
  );
}
