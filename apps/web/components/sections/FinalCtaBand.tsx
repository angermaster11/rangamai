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
        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" aria-hidden />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/70">
              {subheading}
            </p>
          ) : null}
          <div className="mt-8">
            <ButtonLink href={cta.href} size="lg" variant="accent">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
