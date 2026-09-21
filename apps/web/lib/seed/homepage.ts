import type { Homepage } from "@rangamai/shared";

/**
 * Homepage CMS content (ProductDescription.md §4, §14).
 * Featured services/projects reference slugs from services.ts / projects.ts;
 * accessors resolve and order them. Admin-managed in a later phase.
 */
export const homepage: Homepage = {
  heroHeading: "AI-powered software, built to ship.",
  heroSubheading:
    "RANGAMAI designs and builds intelligent agents, AI systems, web and mobile applications, and custom software for businesses — engineered to run in production, not just demo well.",
  heroPrimaryCta: { label: "Start a Project", href: "/contact" },
  heroSecondaryCta: { label: "See our work", href: "/showcase" },

  featuredServiceSlugs: ["ai-agents", "ai-systems", "web-applications"],
  featuredProjectSlugs: ["mecfinders", "onchikitsa", "agent-desk"],

  whyHeading: "Why RANGAMAI",
  whySubheading:
    "We build serious software with a small, senior team — clear architecture, honest scope, and results you can measure.",
  valueProps: [
    {
      title: "Production-first, not demo-first",
      description:
        "We build for real users and real load: guardrails, evaluation, and maintainable architecture — not a flashy prototype that breaks in week two.",
      icon: "ShieldCheck",
    },
    {
      title: "AI where it earns its place",
      description:
        "We use AI when it genuinely improves the product, and we're honest about where it doesn't. Grounded results with citations over confident guesses.",
      icon: "Sparkles",
    },
    {
      title: "Simple by design",
      description:
        "No over-engineering, no infrastructure you can't operate. We keep systems as simple as the problem allows so you can own them after we hand over.",
      icon: "Layers",
    },
    {
      title: "SEO & performance built in",
      description:
        "Fast load, semantic markup, and search visibility are requirements from day one — never bolted on at the end.",
      icon: "Gauge",
    },
  ],

  processHeading: "How we work",
  processSteps: [
    {
      step: 1,
      title: "Understand",
      description: "We dig into the problem, users, and constraints before writing a line of code.",
      icon: "Search",
    },
    {
      step: 2,
      title: "Plan",
      description: "We propose a clear architecture and scope, and agree on it with you first.",
      icon: "PenLine",
    },
    {
      step: 3,
      title: "Build",
      description: "We ship incrementally in clean, reviewable steps you can follow.",
      icon: "Hammer",
    },
    {
      step: 4,
      title: "Test",
      description: "We verify behaviour, performance, and accessibility — not just the happy path.",
      icon: "FlaskConical",
    },
    {
      step: 5,
      title: "Deploy",
      description: "We release safely with health checks and a path to roll back.",
      icon: "Rocket",
    },
    {
      step: 6,
      title: "Support",
      description: "We stay available after launch and hand over documented, maintainable systems.",
      icon: "LifeBuoy",
    },
  ],

  finalCtaHeading: "Have an idea? Let's build it.",
  finalCtaSubheading:
    "Tell us what you're trying to do. We'll tell you the simplest way to get there.",
  finalCta: { label: "Get in touch", href: "/contact" },
};
