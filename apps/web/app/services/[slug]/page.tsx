import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/content";
import {
  breadcrumbJsonLd,
  buildMetadata,
  serviceJsonLd,
} from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { FinalCtaBand } from "@/components/sections/FinalCtaBand";

type Params = { slug: string };

/** Pre-render every published service at build time (SSG). */
export async function generateStaticParams(): Promise<Params[]> {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };

  return buildMetadata({
    title: service.seo?.metaTitle ?? service.title,
    description: service.seo?.metaDescription ?? service.shortDescription,
    path: `/services/${service.slug}`,
    ogImage: service.seo?.ogImage,
    absoluteTitle: Boolean(service.seo?.metaTitle),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      {/* Header */}
      <section className="border-b border-border">
        <Container className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <span className="px-2" aria-hidden>
              /
            </span>
            <span className="text-foreground">{service.title}</span>
          </nav>

          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <Icon name={service.icon} className="h-6 w-6" />
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {service.shortDescription}
          </p>
        </Container>
      </section>

      {/* Body */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>

          {service.highlights?.length ? (
            <div className="lg:col-span-1">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                What&apos;s included
              </h2>
              <ul className="mt-4 space-y-3">
                {service.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      <FinalCtaBand
        heading={`Ready to build with ${service.title}?`}
        subheading="Tell us what you're trying to do and we'll map the simplest path to shipping it."
        cta={{ label: "Start a project", href: "/contact" }}
      />
    </>
  );
}
