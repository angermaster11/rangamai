import type { Homepage } from "@rangamai/shared";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/** Closing call-to-action band before the footer. */
export function FinalCta({ home }: { home: Homepage }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)]"
          />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {home.finalCtaHeading}
          </h2>
          {home.finalCtaSubheading ? (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {home.finalCtaSubheading}
            </p>
          ) : null}
          <div className="mt-8">
            <ButtonLink href={home.finalCta.href} size="lg">
              {home.finalCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
