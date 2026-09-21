import type { Metadata } from "next";
import { getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { FinalCtaBand } from "@/components/sections/FinalCtaBand";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "AI agents, AI systems, web and mobile applications, and custom software — production-grade software services from RANGAMAI.",
  path: "/services",
});

/** Services listing — all published services, ordered. Statically generated. */
export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Services"
          title="Software services, engineered to last"
          lead="We design and build AI-native products and the systems around them — from first prototype to a maintained production platform."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      <FinalCtaBand
        heading="Not sure which fits?"
        subheading="Tell us the problem. We'll recommend the simplest path — even if it's less work for us."
        cta={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
