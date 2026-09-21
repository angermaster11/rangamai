import type { Homepage } from "@rangamai/shared";
import { FinalCtaBand } from "./FinalCtaBand";

/** Homepage closing call-to-action, sourced from CMS content. */
export function FinalCta({ home }: { home: Homepage }) {
  return (
    <FinalCtaBand
      heading={home.finalCtaHeading}
      subheading={home.finalCtaSubheading}
      cta={home.finalCta}
    />
  );
}
