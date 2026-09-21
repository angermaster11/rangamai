import type { SiteSettings } from "../types";

/**
 * Site-wide settings and contact info (ProductDescription.md §11).
 * Admin-managed via the dashboard; configurable, never hardcoded in components.
 * Phone/WhatsApp are placeholders — swap for the real numbers when available.
 */
const PHONE = "+91 90000 00000";
const PHONE_HREF = "+919000000000";
const EMAIL = "hello@rangamai.in";

export const siteSettings: SiteSettings = {
  companyName: "RANGAMAI",
  tagline: "AI-powered software, agents, and custom solutions for businesses.",
  email: EMAIL,
  phone: PHONE,
  whatsapp: PHONE_HREF,
  address: "India",
  socialLinks: [
    {
      kind: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/${PHONE_HREF.replace(/[^0-9]/g, "")}`,
    },
    { kind: "email", label: "Email", href: `mailto:${EMAIL}` },
    { kind: "phone", label: "Call", href: `tel:${PHONE_HREF}` },
    { kind: "instagram", label: "Instagram", href: "https://instagram.com/rangamai" },
    { kind: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/rangamai" },
  ],
  seo: {
    metaTitle: "RANGAMAI — AI & Software Solutions",
    metaDescription:
      "RANGAMAI builds AI-powered software, intelligent agents, web and mobile applications, and custom digital solutions for businesses.",
  },
};
