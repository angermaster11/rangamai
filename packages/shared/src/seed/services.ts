import type { Service } from "../types";

/**
 * Seed services — real RANGAMAI offerings (ProductDescription.md §5, §6).
 * Ordering here mirrors the example order in §6. This is the single canonical
 * copy: the API seed script imports it into Mongo, and the public site falls
 * back to it when the API is unreachable.
 *
 * `description` may hold several paragraphs separated by a blank line; the
 * service detail page renders each as its own <p>.
 */
export const services: Service[] = [
  {
    id: "svc-ai-agents",
    title: "AI Agents",
    slug: "ai-agents",
    shortDescription:
      "Production AI agents that understand context, use your tools, and complete multi-step work — with guardrails and a human in control.",
    description: [
      "A chatbot answers questions. An agent gets work done. We design and build AI agents that read context, decide on the next step, call your APIs and databases, and carry a task through to completion — qualifying a lead, resolving a support ticket, reconciling an invoice, or preparing a report that someone used to spend an afternoon on.",
      "Every agent we ship is grounded in your real data. We connect it to your knowledge base, CRM, ticketing system, or internal APIs through well-defined tools, so it works from facts rather than guesses. Retrieval is tuned to your documents, answers carry citations, and anything the agent cannot verify is flagged instead of invented.",
      "Reliability is engineered, not hoped for. We define exactly which actions an agent may take on its own and which need human approval, add guardrails for sensitive data and risky operations, and log every decision so you can audit what happened and why. Before launch we build an evaluation set from your real cases, and we re-run it on every change so quality is measured release over release.",
      "Typical builds include customer support copilots, sales and lead-qualification agents, WhatsApp and website assistants, document-processing agents, and internal operations agents that work across Slack, email, spreadsheets, and your admin tools. We start with one high-value workflow, prove it in production, and expand from there.",
    ].join("\n\n"),
    icon: "Bot",
    highlights: [
      "Tool-using agents connected to your APIs, CRM, databases, and internal systems",
      "Retrieval over your private documents with cited, verifiable answers",
      "Multi-step workflows: plan, act, check, and hand off when needed",
      "Human-in-the-loop approvals for sensitive or high-impact actions",
      "Guardrails for PII, prompt injection, and out-of-scope requests",
      "Evaluation suites built from your real cases, re-run on every release",
      "Full decision logs and audit trails for every agent action",
      "Deployment on web, WhatsApp, Slack, email, or inside your own app",
    ],
    displayOrder: 1,
    featured: true,
    published: true,
    seo: {
      metaTitle: "AI Agent Development Company | RANGAMAI",
      metaDescription:
        "RANGAMAI builds production AI agents that use your tools and data to complete real work — support copilots, sales agents, and workflow automation with guardrails and evaluation built in.",
    },
  },
  {
    id: "svc-ai-systems",
    title: "AI Systems",
    slug: "ai-systems",
    shortDescription:
      "End-to-end AI systems — retrieval, model orchestration, data pipelines, and the product layer — engineered to run reliably in production.",
    description: [
      "Most AI projects stall between the demo and production. The prototype works on ten handpicked examples, then falls apart on real data, real users, and real costs. We build the complete system around the model: how data gets in, how the right context is found, which model handles which job, how outputs are checked, and how it all reaches your users.",
      "At the core of many of our systems is retrieval-augmented generation (RAG). We ingest your documents, PDFs, databases, and knowledge bases, clean and chunk them sensibly, and index them for semantic and keyword search. The model then answers from your actual content — with citations — instead of from general knowledge that may be outdated or wrong.",
      "We choose models for the job rather than by hype. Some tasks need a frontier model; many run faster and cheaper on a smaller one. We orchestrate them with structured outputs, validation, retries, and fallbacks, and we track latency, cost per request, and answer quality so you always know what the system is doing and what it costs to run.",
      "The result is AI that fits into your product and your operations: semantic search across your company's documents, automated extraction from invoices and contracts, classification and routing of incoming requests, summarisation and reporting pipelines, and recommendation features — each with monitoring and an evaluation baseline from day one.",
    ].join("\n\n"),
    icon: "BrainCircuit",
    highlights: [
      "RAG pipelines with semantic and hybrid search over your own data",
      "Document ingestion for PDFs, spreadsheets, databases, and web content",
      "Structured data extraction from invoices, contracts, and forms",
      "Model selection and orchestration balanced for quality, speed, and cost",
      "Validated, structured outputs with retries and safe fallbacks",
      "Evaluation baselines and quality tracking across releases",
      "Monitoring for latency, usage, and cost per request",
      "Clean APIs so AI features plug straight into your product",
    ],
    displayOrder: 2,
    featured: true,
    published: true,
    seo: {
      metaTitle: "AI Systems & RAG Development | RANGAMAI",
      metaDescription:
        "End-to-end AI systems from RANGAMAI: RAG and semantic search, document extraction, model orchestration, and data pipelines — engineered for production with evaluation and monitoring.",
    },
  },
  {
    id: "svc-web-applications",
    title: "Web Applications",
    slug: "web-applications",
    shortDescription:
      "Fast, secure, SEO-strong web applications — from marketing sites to full SaaS platforms and dashboards — built on modern, proven stacks.",
    description: [
      "Your website or web app is often the first and most frequent place customers meet your business. We build web applications that load fast, rank well, and stay easy to change — from high-converting marketing sites to customer portals, SaaS products, booking platforms, and the admin dashboards that run them.",
      "We work primarily with Next.js, React, and TypeScript on the front end, and Node.js or NestJS with MongoDB or PostgreSQL behind it. Pages are server-rendered where it matters for speed and search, APIs are clean and documented, and the codebase is structured so your team — or ours — can extend it without fear.",
      "Performance, accessibility, and SEO are requirements, not a final checklist. We aim for strong Core Web Vitals, semantic markup, structured data, sensible metadata, and responsive layouts that work on every screen size. Security basics — authentication, role-based access, input validation, and rate limiting — are built in from the first commit.",
      "We also build the operational side: content management so your team can update pages without a developer, analytics and lead capture wired into your CRM, payment integrations, and admin panels for managing users, orders, and content. Every project ships with deployment, environments, and documentation in place.",
    ].join("\n\n"),
    icon: "Globe",
    highlights: [
      "Next.js, React, and TypeScript front ends with server-side rendering",
      "Node.js / NestJS APIs with MongoDB or PostgreSQL",
      "SaaS platforms, customer portals, and booking systems",
      "Admin dashboards and CMS so your team can manage content",
      "Technical SEO, structured data, and strong Core Web Vitals",
      "Authentication, role-based access, and secure-by-default APIs",
      "Payment gateway, CRM, email, and analytics integrations",
      "Responsive, accessible design that works on every device",
    ],
    displayOrder: 3,
    featured: true,
    published: true,
    seo: {
      metaTitle: "Web Application Development Company | RANGAMAI",
      metaDescription:
        "RANGAMAI builds fast, secure, SEO-strong web applications with Next.js and TypeScript — SaaS platforms, customer portals, dashboards, and marketing sites engineered to last.",
    },
  },
  {
    id: "svc-mobile-applications",
    title: "Mobile Applications",
    slug: "mobile-applications",
    shortDescription:
      "Cross-platform iOS and Android apps with a native feel, real-time features, and clean integration with your backend.",
    description: [
      "We build mobile apps that people keep on their phones. Using cross-platform technology, we ship to both iOS and Android from a single codebase — cutting development time and cost without compromising on the smooth, responsive experience users expect from a native app.",
      "Many of the apps we build are two-sided or real-time: a customer app and a provider app, live location tracking, instant booking and status updates, in-app chat, and push notifications that arrive at the right moment. We design the backend alongside the app so data flows reliably, even on patchy mobile networks.",
      "Good mobile UX is about details: fast startup, clear navigation, sensible offline behaviour, platform-correct gestures, and forms that are easy to fill on a small screen. We prototype key flows early, test on real devices, and refine until the app feels effortless to use.",
      "We handle the full release path — app store setup, builds, signing, submission to the Google Play Store and Apple App Store, and crash and usage monitoring after launch. Whether you need an MVP to validate an idea or a production app to serve thousands of users, we build it to be maintained and extended.",
    ].join("\n\n"),
    icon: "Smartphone",
    highlights: [
      "Cross-platform iOS and Android apps from a single codebase",
      "Customer and provider (two-sided) app architectures",
      "Real-time location tracking, booking, and live status updates",
      "Push notifications, in-app chat, and offline-friendly behaviour",
      "Secure authentication, OTP login, and role-based access",
      "Payment, maps, and third-party SDK integrations",
      "App Store and Play Store submission and release management",
      "Crash reporting, analytics, and post-launch support",
    ],
    displayOrder: 4,
    featured: false,
    published: true,
    seo: {
      metaTitle: "Mobile App Development Company — iOS & Android | RANGAMAI",
      metaDescription:
        "Cross-platform iOS and Android app development from RANGAMAI — real-time booking, live tracking, push notifications, and secure backends, from MVP to App Store launch.",
    },
  },
  {
    id: "svc-custom-software",
    title: "Custom Software",
    slug: "custom-software",
    shortDescription:
      "Bespoke software, integrations, and workflow automation shaped around how your business actually runs.",
    description: [
      "Off-the-shelf tools are built for the average business. When yours has workflows that don't fit — or your team is stitching together spreadsheets, WhatsApp groups, and five different apps to get one job done — custom software pays for itself quickly. We build systems shaped around how you actually operate.",
      "Every engagement starts by mapping the real workflow: who does what, where data is re-entered, where things get lost, and where delays happen. From there we design the simplest system that removes the manual steps — an internal platform, a set of integrations, an automation pipeline, or a combination of all three.",
      "Common builds include ERP and CRM-style internal platforms, inventory and order management, approval and document workflows, reporting dashboards, and integrations that keep your existing tools — accounting software, payment gateways, CRMs, Google Workspace, and messaging platforms — in sync automatically. Where it adds real value, we add AI to classify, extract, or summarise.",
      "We keep architecture deliberately simple so the software is affordable to run and easy to own. You get clean, documented code, a proper handover, and the option of ongoing support — not a black box that only one developer understands.",
    ].join("\n\n"),
    icon: "Cog",
    highlights: [
      "Workflow mapping to find and remove manual, repetitive steps",
      "Internal platforms: ERP, CRM, inventory, and order management",
      "Approval flows, document management, and role-based access",
      "Integrations with accounting, payments, CRM, and Google Workspace",
      "Automated reports, alerts, and dashboards for decision-makers",
      "AI-assisted extraction, classification, and summarisation where useful",
      "Data migration from spreadsheets and legacy systems",
      "Documented, maintainable code with full handover and ongoing support",
    ],
    displayOrder: 5,
    featured: false,
    published: true,
    seo: {
      metaTitle: "Custom Software Development & Automation | RANGAMAI",
      metaDescription:
        "RANGAMAI builds custom software and workflow automation — internal platforms, ERP and CRM systems, and integrations shaped around how your business actually runs.",
    },
  },
];
