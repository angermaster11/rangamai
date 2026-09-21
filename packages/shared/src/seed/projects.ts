import type { Project } from "../types";

/**
 * Seed projects / case studies (ProductDescription.md §7, §8).
 * Example slugs from the spec: mecfinders, onchikitsa.
 */
export const projects: Project[] = [
  {
    id: "prj-mecfinders",
    title: "MecFinders",
    slug: "mecfinders",
    shortDescription:
      "An on-demand marketplace connecting stranded drivers with nearby verified mechanics.",
    description:
      "MecFinders is a location-based marketplace that matches drivers who need roadside or workshop help with verified mechanics near them. RANGAMAI designed and built the platform end to end — the customer app, the mechanic-facing tools, and the backend that handles matching, requests, and status tracking in real time.",
    problem:
      "Drivers with a breakdown had no fast, trustworthy way to find a competent mechanic nearby, and independent mechanics had no steady channel to reach new customers.",
    solution:
      "We built a two-sided platform with location-based matching, verified mechanic profiles, transparent request status, and a lightweight admin layer to manage listings and quality — kept intentionally simple so it could launch fast and scale sensibly.",
    keyFeatures: [
      "Location-based mechanic discovery and matching",
      "Verified mechanic profiles with services and ratings",
      "Real-time request and status tracking",
      "Admin tooling for listings and quality control",
    ],
    techStack: ["Next.js", "TypeScript", "NestJS", "MongoDB", "Cloudinary"],
    metrics: [
      { label: "Match time", value: "Minutes, not hours" },
      { label: "Sides served", value: "Drivers + mechanics" },
    ],
    client: "MecFinders",
    industry: "Automotive services",
    servicesUsed: ["web-applications", "custom-software"],
    liveUrl: "https://mecfinders.example",
    displayOrder: 1,
    featured: true,
    published: true,
    seo: {
      metaTitle: "MecFinders — On-Demand Mechanic Marketplace | RANGAMAI Case Study",
      metaDescription:
        "How RANGAMAI designed and built MecFinders, a location-based marketplace connecting drivers with verified mechanics in real time.",
    },
  },
  {
    id: "prj-onchikitsa",
    title: "Onchikitsa",
    slug: "onchikitsa",
    shortDescription:
      "A telehealth platform bringing consultations, records, and follow-ups into one place.",
    description:
      "Onchikitsa is a healthcare platform that lets patients consult practitioners, keep their records in one place, and manage follow-ups without the usual friction. RANGAMAI built the web platform and the backend services behind it, with a strong focus on clarity, privacy, and a calm, trustworthy interface.",
    problem:
      "Patients juggled scattered records, phone-tag scheduling, and no clear follow-up path, while practitioners lacked a single tool to manage consultations and history.",
    solution:
      "We delivered a unified platform for consultations, structured patient records, and follow-up management — designed to feel reassuring rather than clinical, with privacy-first data handling and a clean, accessible UI.",
    keyFeatures: [
      "Consultation booking and management",
      "Structured, private patient records",
      "Follow-up scheduling and reminders",
      "Accessible, calm interface for all ages",
    ],
    techStack: ["Next.js", "TypeScript", "NestJS", "MongoDB"],
    metrics: [
      { label: "Focus", value: "Privacy-first" },
      { label: "Experience", value: "Calm & accessible" },
    ],
    client: "Onchikitsa",
    industry: "Healthcare",
    servicesUsed: ["web-applications", "ai-systems"],
    liveUrl: "https://onchikitsa.example",
    displayOrder: 2,
    featured: true,
    published: true,
    seo: {
      metaTitle: "Onchikitsa — Telehealth Platform | RANGAMAI Case Study",
      metaDescription:
        "How RANGAMAI built Onchikitsa, a privacy-first telehealth platform unifying consultations, patient records, and follow-ups.",
    },
  },
  {
    id: "prj-agent-desk",
    title: "AgentDesk",
    slug: "agent-desk",
    shortDescription:
      "An AI support copilot that drafts, retrieves, and resolves tickets alongside human agents.",
    description:
      "AgentDesk is an AI copilot for customer support teams. It reads the full ticket context, retrieves relevant help-centre and product knowledge, drafts accurate replies, and can take safe actions through connected tools — always with a human in control. RANGAMAI built the retrieval layer, the agent orchestration, and the evaluation harness that keeps answer quality measurable.",
    problem:
      "Support teams were overwhelmed by repetitive tickets and inconsistent answers, while off-the-shelf bots gave confidently wrong replies that eroded customer trust.",
    solution:
      "We built a grounded AI copilot: retrieval over the team's real knowledge base, drafted responses with citations, tool-use for common actions, and an evaluation harness so quality is tracked release over release rather than assumed.",
    keyFeatures: [
      "Grounded, cited answer drafting for agents",
      "Retrieval over help-centre and product docs",
      "Safe tool-use with human approval",
      "Continuous evaluation of answer quality",
    ],
    techStack: ["Next.js", "TypeScript", "Python", "Vector search", "NestJS"],
    metrics: [
      { label: "Answers", value: "Grounded + cited" },
      { label: "Control", value: "Human-in-the-loop" },
    ],
    client: "Internal / RANGAMAI Labs",
    industry: "Customer support",
    servicesUsed: ["ai-agents", "ai-systems"],
    displayOrder: 3,
    featured: true,
    published: true,
    seo: {
      metaTitle: "AgentDesk — AI Support Copilot | RANGAMAI Case Study",
      metaDescription:
        "How RANGAMAI built AgentDesk, a grounded AI support copilot that drafts cited replies and takes safe actions with a human in the loop.",
    },
  },
];
