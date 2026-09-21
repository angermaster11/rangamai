import { Sparkles } from "lucide-react";
import type { Homepage } from "@rangamai/shared";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Homepage hero. Single <h1> for the page (SEO/a11y heading hierarchy).
 * Editorial, typography-led — no decorative glow. A short amber rule under the
 * heading carries the brand accent.
 */
export function Hero({ home }: { home: Homepage }) {
  return (
    <section className="border-b border-border">
      <Container className="py-20 sm:py-28 lg:py-32">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          AI-native software studio
        </p>

        <h1 className="mt-7 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {home.heroHeading}
        </h1>

        {/* Brand accent rule */}
        <div className="mt-6 h-1 w-16 rounded-full bg-accent" aria-hidden />

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {home.heroSubheading}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={home.heroPrimaryCta.href} size="lg">
            {home.heroPrimaryCta.label}
          </ButtonLink>
          {home.heroSecondaryCta ? (
            <ButtonLink
              href={home.heroSecondaryCta.href}
              size="lg"
              variant="secondary"
            >
              {home.heroSecondaryCta.label}
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
