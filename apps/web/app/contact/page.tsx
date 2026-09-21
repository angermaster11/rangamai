import type { Metadata } from "next";
import { getServices, getSiteSettings } from "@/lib/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with RANGAMAI. Tell us about your project — AI agents, AI systems, web or mobile apps, or custom software — and we'll map the simplest path to shipping it.",
  path: "/contact",
});

const CHANNEL_ICON: Record<string, string> = {
  whatsapp: "MessageCircle",
  email: "Mail",
  phone: "Phone",
  instagram: "Instagram",
  linkedin: "Linkedin",
};

/** Contact page — form (validated dev stub) plus direct contact channels. */
export default async function ContactPage() {
  const [services, settings] = await Promise.all([
    getServices(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Intro + channels */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Let's talk
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Tell us what you're building and we'll get back to you with the
              simplest way to make it happen.
            </p>

            <div className="mt-8 space-y-3">
              {settings.socialLinks.map((link) => {
                const external = /^https?:\/\//.test(link.href);
                return (
                  <a
                    key={link.kind}
                    href={link.href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon name={CHANNEL_ICON[link.kind]} className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-medium">{link.label}</span>
                      {link.kind === "email" ? (
                        <span className="text-muted-foreground">{settings.email}</span>
                      ) : link.kind === "phone" || link.kind === "whatsapp" ? (
                        <span className="text-muted-foreground">{settings.phone}</span>
                      ) : null}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm services={services} />
          </div>
        </div>
      </Container>
    </>
  );
}
