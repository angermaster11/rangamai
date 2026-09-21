import type { Homepage } from "@rangamai/shared";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

/** "Why RANGAMAI" — value propositions from the homepage CMS content. */
export function WhyRangamai({ home }: { home: Homepage }) {
  if (home.valueProps.length === 0) return null;

  return (
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
  );
}
