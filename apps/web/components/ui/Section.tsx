import { cn } from "@/lib/cn";
import { Container } from "./Container";

/** A vertical page section with consistent rhythm. */
export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Standard section heading block: optional eyebrow, title, and lead text. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </Heading>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>
      ) : null}
    </div>
  );
}
