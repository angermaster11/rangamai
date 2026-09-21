/**
 * Content accessors — the single interface the site uses to read data.
 *
 * Pages, SEO builders, sitemap, and components call ONLY these functions.
 * Each one fetches from the NestJS API when it's configured, and FALLS BACK to
 * the bundled `@rangamai/shared` seed content when the API is unset or
 * unreachable. So the site always renders: live data when the backend is up,
 * seed data otherwise. Signatures and return shapes are unchanged from the
 * seed-only phase — no page, route, or SEO code needed to change.
 *
 * All functions are async and return the same shapes regardless of source.
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
import { API_ENABLED, apiFetch } from "@/lib/api";

const byDisplayOrder = <T extends { displayOrder: number }>(a: T, b: T) =>
  a.displayOrder - b.displayOrder;

/**
 * Runs an API call, falling back to a seed-derived value on any error (or when
 * the API isn't configured). Logs a one-line warning server-side so a silent
 * fallback is still observable in dev, without breaking the render.
 */
async function withFallback<T>(
  apiCall: () => Promise<T>,
  fallback: () => T,
  label: string,
): Promise<T> {
  if (!API_ENABLED) return fallback();
  try {
    return await apiCall();
  } catch (err) {
    console.warn(
      `[content] API fetch for ${label} failed, using seed fallback:`,
      err instanceof Error ? err.message : err,
    );
    return fallback();
  }
}

/* ------------------------------ Services ------------------------------ */

const seedPublishedServices = () =>
  seedServices.filter((s) => s.published).slice().sort(byDisplayOrder);

/** All published services, ordered by displayOrder. */
export async function getServices(): Promise<Service[]> {
  return withFallback(
    () => apiFetch<Service[]>("/services"),
    seedPublishedServices,
    "services",
  );
}

/** A single published service by slug, or null if not found. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return withFallback(
    async () => {
      try {
        return await apiFetch<Service>(`/services/${encodeURIComponent(slug)}`);
      } catch (err) {
        // A genuine 404 should resolve to null, not trigger the seed fallback.
        if (err instanceof Error && /not found/i.test(err.message)) return null;
        throw err;
      }
    },
    () => seedServices.find((s) => s.slug === slug && s.published) ?? null,
    `service:${slug}`,
  );
}

/** Published featured services, ordered. */
export async function getFeaturedServices(): Promise<Service[]> {
  return (await getServices()).filter((s) => s.featured);
}

/* ------------------------------ Projects ------------------------------ */

const seedPublishedProjects = () =>
  seedProjects.filter((p) => p.published).slice().sort(byDisplayOrder);

/** All published projects, ordered by displayOrder. */
export async function getProjects(): Promise<Project[]> {
  return withFallback(
    () => apiFetch<Project[]>("/projects"),
    seedPublishedProjects,
    "projects",
  );
}

/** A single published project by slug, or null if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return withFallback(
    async () => {
      try {
        return await apiFetch<Project>(`/projects/${encodeURIComponent(slug)}`);
      } catch (err) {
        if (err instanceof Error && /not found/i.test(err.message)) return null;
        throw err;
      }
    },
    () => seedProjects.find((p) => p.slug === slug && p.published) ?? null,
    `project:${slug}`,
  );
}

/** Published featured projects, ordered. */
export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

/* ------------------------------- Clients ------------------------------ */

const seedPublicClients = () =>
  seedClients.filter((c) => c.showPublicly).slice().sort(byDisplayOrder);

/** Publicly-shown clients, ordered — for the "Trusted By" section. */
export async function getPublicClients(): Promise<Client[]> {
  return withFallback(
    () => apiFetch<Client[]>("/clients"),
    seedPublicClients,
    "clients",
  );
}

/* --------------------------- Settings & CMS --------------------------- */

/** Site-wide settings and contact info. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return withFallback(
    () => apiFetch<SiteSettings>("/settings"),
    () => seedSiteSettings,
    "settings",
  );
}

/** Homepage CMS content. */
export async function getHomepage(): Promise<Homepage> {
  return withFallback(
    () => apiFetch<Homepage>("/homepage"),
    () => seedHomepage,
    "homepage",
  );
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
