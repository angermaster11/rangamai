import type { Service } from "@rangamai/shared";

/**
 * Seed services — real RANGAMAI offerings (ProductDescription.md §5, §6).
 * Ordering here mirrors the example order in §6. These are read through
 * `lib/content` accessors; a later phase swaps the source for the API.
 */
export const services: Service[] = [
  {
    id: "svc-ai-agents",
    title: "AI Agents",
    slug: "ai-agents",
    shortDescription:
      "Autonomous agents that plan, use tools, and complete real work across your systems.",
    description:
      "We design and ship AI agents that go beyond chat — they reason over your data, call your APIs, and carry multi-step tasks to completion. From customer-facing assistants to internal copilots that operate your tooling, we handle the retrieval, tool-use, guardrails, and evaluation needed to run agents reliably in production.",
    icon: "Bot",
    highlights: [
      "Tool-using agents wired into your existing APIs and databases",
      "Retrieval-augmented reasoning over your private knowledge",
      "Human-in-the-loop controls, guardrails, and audit trails",
      "Evaluation harnesses so quality is measured, not assumed",
    ],
    displayOrder: 1,
    featured: true,
    published: true,
    seo: {
      metaTitle: "AI Agents Development | RANGAMAI",
      metaDescription:
        "RANGAMAI builds production AI agents that reason, use tools, and complete multi-step work across your systems — with guardrails and evaluation built in.",
    },
  },
  {
    id: "svc-ai-systems",
    title: "AI Systems",
    slug: "ai-systems",
    shortDescription:
      "End-to-end intelligent systems: retrieval, models, pipelines, and the product around them.",
    description:
      "We build complete AI systems — not just a model call. That means data pipelines, retrieval and vector search, model selection and orchestration, evaluation, and the application layer that turns intelligence into a product your users actually touch. We keep the architecture simple enough to operate and honest about what the models can and cannot do.",
    icon: "BrainCircuit",
    highlights: [
      "RAG and semantic search over your documents and data",
      "Model orchestration and structured outputs",
      "Data pipelines and ingestion you can maintain",
      "Grounded results with citations, not hallucinated confidence",
    ],
    displayOrder: 2,
    featured: true,
    published: true,
    seo: {
      metaTitle: "AI Systems Engineering | RANGAMAI",
      metaDescription:
        "End-to-end AI systems from RANGAMAI: retrieval, model orchestration, data pipelines, and the product layer — engineered to run in production.",
    },
  },
  {
    id: "svc-web-applications",
    title: "Web Applications",
    slug: "web-applications",
    shortDescription:
      "Fast, SEO-strong web apps built on modern stacks and designed to convert.",
    description:
      "We build web applications that are quick to load, easy to maintain, and pleasant to use — from marketing sites that rank to full product dashboards. We favour proven stacks (Next.js, TypeScript, well-structured APIs) over trendy complexity, and we treat performance, accessibility, and SEO as requirements, not afterthoughts.",
    icon: "Globe",
    highlights: [
      "Next.js + TypeScript front ends with server rendering",
      "Clean, documented REST APIs and databases",
      "SEO, performance, and accessibility built in from day one",
      "Dashboards and internal tools that people enjoy using",
    ],
    displayOrder: 3,
    featured: true,
    published: true,
    seo: {
      metaTitle: "Web Application Development | RANGAMAI",
      metaDescription:
        "RANGAMAI builds fast, SEO-strong web applications on modern stacks — marketing sites, dashboards, and full products engineered to last.",
    },
  },
  {
    id: "svc-mobile-applications",
    title: "Mobile Applications",
    slug: "mobile-applications",
    shortDescription:
      "Cross-platform mobile apps with native-quality feel on iOS and Android.",
    description:
      "We build mobile apps that feel native, ship to both platforms from one codebase, and connect cleanly to your backend. From MVPs to production apps with offline support and push notifications, we focus on smooth interactions, sensible architecture, and a release process you can repeat.",
    icon: "Smartphone",
    highlights: [
      "Cross-platform iOS + Android from a single codebase",
      "Native-quality interactions and platform-correct UX",
      "Offline support, push notifications, and secure auth",
      "Clean API integration with your existing backend",
    ],
    displayOrder: 4,
    featured: false,
    published: true,
    seo: {
      metaTitle: "Mobile App Development | RANGAMAI",
      metaDescription:
        "Cross-platform mobile applications from RANGAMAI with native-quality feel on iOS and Android, offline support, and clean backend integration.",
    },
  },
  {
    id: "svc-custom-software",
    title: "Custom Software",
    slug: "custom-software",
    shortDescription:
      "Bespoke software and workflow automation shaped around how your business actually runs.",
    description:
      "When off-the-shelf tools don't fit, we build software that does. We map your real workflows, automate the repetitive parts, and deliver maintainable systems — internal platforms, integrations, and business automation — without the over-engineering that makes software expensive to own.",
    icon: "Cog",
    highlights: [
      "Business and workflow automation that removes manual steps",
      "Integrations between the tools you already use",
      "Internal platforms and admin systems",
      "Maintainable architecture, documented and handed over",
    ],
    displayOrder: 5,
    featured: false,
    published: true,
    seo: {
      metaTitle: "Custom Software & Automation | RANGAMAI",
      metaDescription:
        "RANGAMAI builds bespoke software and workflow automation shaped around your business — integrations, internal platforms, and maintainable systems.",
    },
  },
];
