import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getServices, getSiteSettings } from "@/lib/content";

/** Maps a social link kind to the lucide icon name in our registry. */
const SOCIAL_ICON: Record<string, string> = {
  whatsapp: "MessageCircle",
  email: "Mail",
  phone: "Phone",
  instagram: "Instagram",
  linkedin: "Linkedin",
};

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Showcase", href: "/showcase" },
  { label: "Contact", href: "/contact" },
];

/**
 * Site footer — nav, services, and contact channels, all sourced from content
 * accessors (never hardcoded). Server component: renders statically.
 */
export async function Footer() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + tagline */}
          <div className="lg:pr-6">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight text-foreground"
            >
              RANGAM<span className="text-accent">AI</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings.tagline}
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h2 className="text-sm font-semibold text-foreground">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h2 className="text-sm font-semibold text-foreground">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold text-foreground">Get in touch</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {settings.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.whatsapp}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {settings.phone}
                </a>
              </li>
            </ul>

            <div className="mt-4 flex items-center gap-2">
              {settings.socialLinks.map((link) => {
                const external = /^https?:\/\//.test(link.href);
                return (
                  <a
                    key={link.kind}
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Icon name={SOCIAL_ICON[link.kind]} className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {year} {settings.companyName}. All rights reserved.
          </p>
          <p>Built in {settings.address}.</p>
        </div>
      </Container>
    </footer>
  );
}
