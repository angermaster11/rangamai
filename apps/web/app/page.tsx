import {
  getHomepage,
  getHomepageProjects,
  getHomepageServices,
  getPublicClients,
} from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Showcase } from "@/components/sections/Showcase";
import { WhyRangamai } from "@/components/sections/WhyRangamai";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { FinalCta } from "@/components/sections/FinalCta";

/** ISR: refresh homepage CMS content at most once every 60s. */
export const revalidate = 60;

/** Homepage — generated from CMS content (API), seed fallback. */
export default async function HomePage() {
  const [home, services, projects, clients] = await Promise.all([
    getHomepage(),
    getHomepageServices(),
    getHomepageProjects(),
    getPublicClients(),
  ]);

  return (
    <>
      <Hero home={home} />
      <ServicesPreview services={services} />
      <Showcase projects={projects} />
      <WhyRangamai home={home} />
      <HowWeWork home={home} />
      <TrustedBy clients={clients} />
      <FinalCta home={home} />
    </>
  );
}
