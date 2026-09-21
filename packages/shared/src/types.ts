/**
 * RANGAMAI shared domain types.
 *
 * These interfaces are the single contract shared by the public website
 * (`apps/web`), the admin dashboard (`apps/admin`), and the NestJS API
 * (`apps/api`). They are shaped to match the MongoDB schema
 * (ProductDescription.md §5, §8, §12, §17). The website reads these shapes
 * through `lib/content/*` accessors — backed by the API, with seed fallback.
 */

/** SEO metadata block attached to every publicly indexable entity. */
export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

/** A reference to a media asset (Cloudinary URL + metadata). */
export interface MediaRef {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/** A service RANGAMAI offers (AI Agents, Web Apps, …). Spec §5. */
export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  banner?: MediaRef;
  images?: MediaRef[];
  /** lucide-react icon name, e.g. "Bot", "BrainCircuit". */
  icon?: string;
  /** Bullet points describing what the service includes. */
  highlights?: string[];
  displayOrder: number;
  featured: boolean;
  published: boolean;
  seo?: SeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

/** A single before/after or descriptive metric shown on a case study. */
export interface ProjectMetric {
  label: string;
  value: string;
}

/** A portfolio project / case study. Spec §7, §8. */
export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage?: MediaRef;
  description: string;
  problem?: string;
  solution?: string;
  keyFeatures?: string[];
  techStack?: string[];
  metrics?: ProjectMetric[];
  /** Client company name (denormalized for display). */
  client?: string;
  industry?: string;
  /** Slugs of related services. */
  servicesUsed?: string[];
  gallery?: MediaRef[];
  liveUrl?: string;
  githubUrl?: string;
  displayOrder: number;
  featured: boolean;
  published: boolean;
  seo?: SeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

/** A client / partner. Spec §9. */
export interface Client {
  id: string;
  companyName: string;
  logo?: MediaRef;
  website?: string;
  industry?: string;
  description?: string;
  /** Whether the logo may be shown publicly under "Trusted By". */
  showPublicly: boolean;
  displayOrder: number;
}

/** Lead statuses. Spec §12. */
export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  CONVERTED = "CONVERTED",
  CLOSED = "CLOSED",
  LOST = "LOST",
}

/** A contact-form submission. Spec §10, §12. */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  /** Requested service slug or free text. */
  service?: string;
  budgetRange?: string;
  projectType?: string;
  message: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** The payload accepted by the public contact endpoint (no server fields). */
export type LeadInput = Pick<
  Lead,
  "name" | "email" | "phone" | "company" | "service" | "budgetRange" | "projectType" | "message"
>;

/** A configurable social / contact link. Spec §11. */
export interface ContactLink {
  /** e.g. "whatsapp" | "email" | "phone" | "instagram" | "linkedin". */
  kind: string;
  label: string;
  /** Fully-formed href: tel:, mailto:, https://, or wa.me link. */
  href: string;
}

/** Site-wide settings / contact info, admin-managed. Spec §11, §17. */
export interface SiteSettings {
  companyName: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  socialLinks: ContactLink[];
  seo?: SeoMeta;
}

/** A step in the "How We Work" process. Spec §4. */
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

/** A "Why RANGAMAI" value proposition. */
export interface ValueProp {
  title: string;
  description: string;
  icon?: string;
}

/** Homepage CMS content, admin-managed. Spec §4, §14. */
export interface Homepage {
  heroHeading: string;
  heroSubheading: string;
  heroPrimaryCta: { label: string; href: string };
  heroSecondaryCta?: { label: string; href: string };
  heroImage?: MediaRef;
  /** Slugs of services featured on the homepage, in order. */
  featuredServiceSlugs: string[];
  /** Slugs of projects featured on the homepage, in order. */
  featuredProjectSlugs: string[];
  whyHeading: string;
  whySubheading?: string;
  valueProps: ValueProp[];
  processHeading: string;
  processSteps: ProcessStep[];
  finalCtaHeading: string;
  finalCtaSubheading?: string;
  finalCta: { label: string; href: string };
}

/* ------------------------------------------------------------------ */
/* Admin / API contracts (Phase 2)                                     */
/* ------------------------------------------------------------------ */

/** Admin roles. Kept as a union so it can grow without a schema change. */
export type AdminRole = "ADMIN" | "EDITOR";

/**
 * An admin dashboard user. This is the SAFE, public-facing shape — it never
 * carries the password hash (that lives only in the Mongo document, server-side).
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt?: string;
  updatedAt?: string;
}

/** A media asset stored in Cloudinary and catalogued in Mongo. Spec §17. */
export interface Media {
  id: string;
  url: string;
  /** Cloudinary public_id, used for deletion. */
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Uniform API envelope returned by every `apps/api` endpoint.
 * `apps/web` and `apps/admin` unwrap `data` and surface `error`/`fieldErrors`.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  /** Human-readable error message when `success` is false. */
  error?: string;
  /** Per-field validation messages, keyed by field name. */
  fieldErrors?: Record<string, string[]>;
}

/** Admin dashboard summary metrics (real counts, no fake analytics). Spec §13. */
export interface AdminStats {
  totalLeads: number;
  newLeads: number;
  totalServices: number;
  publishedServices: number;
  totalProjects: number;
  publishedProjects: number;
  totalClients: number;
  totalMedia: number;
}
