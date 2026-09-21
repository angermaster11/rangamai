/**
 * Content accessors — the single interface the site uses to read data.
 *
 * Pages, SEO builders, sitemap, and components call ONLY these functions.
 * Right now they read from typed seed data. In a later phase the bodies are
 * swapped to fetch from the NestJS API (same signatures, same return shapes)
 * — no page, route, or SEO code needs to change.
 *
 * All functions are async so the future API-backed implementation is a
 * drop-in with no call-site changes.
 */
import {
  type Client,
  type Homepage,
  type Project,
  type Service,
  type SiteSettings,
  services as seedServices,
  projects as seedProjects,
  clients as seedClients,
  siteSettings as seedSiteSettings,
  homepage as seedHomepage,
} from "@rangamai/shared";

const byDisplayOrder = <T extends { displayOrder: number }>(a: T, b: T) =>
  a.displayOrder - b.displayOrder;

/* ------------------------------ Services ------------------------------ */

/** All published services, ordered by displayOrder. */
export async function getServices(): Promise<Service[]> {
  return seedServices
    .filter((s) => s.published)
    .slice()
    .sort(byDisplayOrder);
}

/** A single published service by slug, or null if not found. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return seedServices.find((s) => s.slug === slug && s.published) ?? null;
}

/** Published featured services, ordered. */
export async function getFeaturedServices(): Promise<Service[]> {
  return (await getServices()).filter((s) => s.featured);
}

/* ------------------------------ Projects ------------------------------ */

/** All published projects, ordered by displayOrder. */
export async function getProjects(): Promise<Project[]> {
  return seedProjects
    .filter((p) => p.published)
    .slice()
    .sort(byDisplayOrder);
}

/** A single published project by slug, or null if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return seedProjects.find((p) => p.slug === slug && p.published) ?? null;
}

/** Published featured projects, ordered. */
export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

/* ------------------------------- Clients ------------------------------ */

/** Publicly-shown clients, ordered — for the "Trusted By" section. */
export async function getPublicClients(): Promise<Client[]> {
  return seedClients
    .filter((c) => c.showPublicly)
    .slice()
    .sort(byDisplayOrder);
}

/* --------------------------- Settings & CMS --------------------------- */

/** Site-wide settings and contact info. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return seedSiteSettings;
}

/** Homepage CMS content. */
export async function getHomepage(): Promise<Homepage> {
  return seedHomepage;
}

/* -------------------- Convenience for homepage CMS -------------------- */

/**
 * Resolve the homepage's featured service slugs to full Service objects,
 * preserving the admin-defined order in `featuredServiceSlugs`.
 */
export async function getHomepageServices(): Promise<Service[]> {
  const [home, all] = await Promise.all([getHomepage(), getServices()]);
  const bySlug = new Map(all.map((s) => [s.slug, s]));
  return home.featuredServiceSlugs
    .map((slug) => bySlug.get(slug))
    .filter((s): s is Service => Boolean(s));
}

/**
 * Resolve the homepage's featured project slugs to full Project objects,
 * preserving the admin-defined order in `featuredProjectSlugs`.
 */
export async function getHomepageProjects(): Promise<Project[]> {
  const [home, all] = await Promise.all([getHomepage(), getProjects()]);
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  return home.featuredProjectSlugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Project => Boolean(p));
}
