import type { Service } from "@rangamai/shared";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";

/** Homepage services preview — featured services, ordered by the CMS. */
export function ServicesPreview({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <Section>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="What we do"
          title="Services built to ship and scale"
          lead="From intelligent agents to full products, we design and build software that runs in production."
        />
        <ButtonLink href="/services" variant="ghost" className="shrink-0">
          All services
        </ButtonLink>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </Section>
  );
}
