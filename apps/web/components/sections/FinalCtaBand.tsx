import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Reusable closing call-to-action band. Used on the homepage (via FinalCta)
 * and on listing pages with page-specific copy.
 */
export function FinalCtaBand({
  heading,
  subheading,
  cta,
}: {
  heading: string;
  subheading?: string;
  cta: { label: string; href: string };
}) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)]"
          />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
          <div className="mt-8">
            <ButtonLink href={cta.href} size="lg">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
