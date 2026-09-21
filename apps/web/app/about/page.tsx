import type { Metadata } from "next";
import { getHomepage, getSiteSettings } from "@/lib/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { FinalCtaBand } from "@/components/sections/FinalCtaBand";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "RANGAMAI is an AI-native software studio building intelligent agents, AI systems, and custom software that runs in production — with a small, senior team.",
  path: "/about",
});

/** About — who we are, why RANGAMAI, and how we work. */
export default async function AboutPage() {
  const [home, settings] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      {/* Intro */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            About us
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            An AI-native studio for serious software
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {settings.companyName} designs and builds AI-powered products,
            intelligent agents, and custom software for businesses. We work as a
            small, senior team — clear architecture, honest scope, and results
            you can measure. We build for production from day one, not just for
            a demo.
          </p>
        </Container>
      </section>

      {/* Why us (value props) */}
      <Section>
        <SectionHeading
          eyebrow="Why us"
          title={home.whyHeading}
          lead={home.whySubheading}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {home.valueProps.map((prop) => (
            <Card key={prop.title} className="flex gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon name={prop.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {prop.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {prop.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* How we work (process) */}
      <Section className="border-t border-border bg-muted/40">
        <SectionHeading
          eyebrow="Our process"
          title={home.processHeading}
          lead="A clear, repeatable path from idea to a maintained product — no surprises."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {home.processSteps.map((step) => (
            <li key={step.step} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon name={step.icon} className="h-4.5 w-4.5" />
                </span>
                <span className="font-mono text-sm font-medium text-muted-foreground">
                  {String(step.step).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <FinalCtaBand
        heading="Let's build something that lasts."
        subheading="Tell us what you're working on and we'll tell you the simplest way to get there."
        cta={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
