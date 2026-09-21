import type { MetadataRoute } from "next";
import { getProjects, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/**
 * Dynamic sitemap, generated from content accessors so it always reflects the
 * published services and projects (ProductDescription.md §16).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([
    getServices(),
    getProjects(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/showcase"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.7 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: absoluteUrl(`/showcase/${p.slug}`),
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
