/**
 * SEO helpers: canonical/site URL, Metadata builders, and JSON-LD structured
 * data. Centralised so every page produces consistent, correct metadata
 * (ProductDescription.md §16).
 */
import type { Metadata } from "next";
import type { Project, Service, SiteSettings } from "@rangamai/shared";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "RANGAMAI";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/services/ai-agents". */
  path: string;
  /** Absolute or site-relative OG image URL. */
  ogImage?: string;
  type?: "website" | "article";
}

/** Build a Next.js Metadata object with canonical + OpenGraph + Twitter. */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const image = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ------------------------------ JSON-LD ------------------------------- */

/** Organization schema for the whole site. */
export function organizationJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: SITE_URL,
    description: settings.seo?.metaDescription ?? settings.tagline,
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    sameAs: settings.socialLinks
      .filter((l) => l.href.startsWith("http"))
      .map((l) => l.href),
  };
}

/** Service schema for a service detail page. */
export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.shortDescription,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    url: absoluteUrl(`/services/${service.slug}`),
  };
}

/** CreativeWork schema for a project / case study page. */
export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: absoluteUrl(`/showcase/${project.slug}`),
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(project.industry ? { about: project.industry } : {}),
    ...(project.techStack?.length ? { keywords: project.techStack.join(", ") } : {}),
  };
}

/** Breadcrumb schema from an ordered list of {name, path}. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
