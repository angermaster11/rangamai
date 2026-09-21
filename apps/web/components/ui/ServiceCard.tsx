import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@rangamai/shared";
import { Card } from "./Card";
import { Icon } from "./Icon";

/**
 * Service summary card, linking to the service detail page. Reused on the
 * homepage services preview and the /services listing.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Card interactive className="flex h-full flex-col">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon name={service.icon} className="h-5 w-5" />
        </span>
        <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
          {service.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.shortDescription}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Learn more
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Card>
    </Link>
  );
}
