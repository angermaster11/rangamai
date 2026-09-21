import type { Homepage } from "@rangamai/shared";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

/** "How We Work" — the ordered process steps (Understand → … → Support). */
export function HowWeWork({ home }: { home: Homepage }) {
  if (home.processSteps.length === 0) return null;

  return (
    <Section className="border-y border-border bg-muted/40">
      <SectionHeading
        eyebrow="Our process"
        title={home.processHeading}
        lead="A clear, repeatable path from idea to a maintained product — no surprises."
      />

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {home.processSteps.map((step) => (
          <li
            key={step.step}
            className="relative rounded-xl border border-border bg-card p-6"
          >
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
  );
}
