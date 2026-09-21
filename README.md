# RANGAMAI

AI-native software studio website — a fast, SEO-complete public site for
RANGAMAI (AI agents, AI systems, web & mobile apps, custom software).

This is a monorepo. **This phase builds the public website only** (`apps/web`),
running on typed seed content. The NestJS backend, admin dashboard, MongoDB
Atlas, Cloudinary, Resend, and AWS/Docker deployment come in later phases — the
data layer is already structured so they slot in without rewriting pages.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme`, design tokens as CSS variables)
- **next/font** — Space Grotesk (headings) + DM Sans (body)
- **lucide-react** icons (no emoji), **zod** validation
- **npm workspaces** (no pnpm/Docker required this phase)

## Layout

```
rangamai/
├── apps/
│   └── web/                 Next.js public website
│       ├── app/             routes, layout, sitemap.ts, robots.ts, api/contact
│       ├── components/      ui/ + sections/ + layout/
│       └── lib/
│           ├── content/     accessors — the ONLY data interface pages use
│           ├── seed/        typed seed content (services, projects, …)
│           └── seo.ts       metadata + JSON-LD builders
├── packages/
│   └── shared/              domain types + enums (match future MongoDB schema)
└── design-system/rangamai/  design system source of truth (MASTER.md)
```

## Getting started

```bash
npm install
cp .env.example .env.local   # fill NEXT_PUBLIC_SITE_URL for correct canonical/OG URLs
npm run dev                  # http://localhost:3000
```

Other scripts (run from repo root):

```bash
npm run build   # production build (SSG/ISR) of apps/web
npm run start   # serve the production build
npm run lint    # lint apps/web
```

## Data layer

Pages, SEO, and the sitemap call **only** the async accessors in
`apps/web/lib/content` (e.g. `getServiceBySlug`, `getFeaturedProjects`). Today
those read from `apps/web/lib/seed`. In a later phase their bodies fetch from
the NestJS API — same signatures, same return shapes — so no page or SEO code
changes. Domain types live in `packages/shared` and are shaped to match the
future MongoDB schema.

## SEO

- Root `metadataBase` + title template + default OpenGraph/Twitter in `layout.tsx`
- Per-route `generateMetadata` (canonical, OG, Twitter) from content
- Dynamic `sitemap.xml` and `robots.txt` from content accessors
- JSON-LD: Organization (site-wide), Service, CreativeWork, BreadcrumbList
- Dynamic `opengraph-image` default share card
- SSG for detail pages (`generateStaticParams`); semantic HTML, single `<h1>`/page

## Contact form (dev stub)

`POST /api/contact` validates against the future `LeadInput` shape (zod) and
applies in-memory per-IP rate limiting, with a honeypot for bots. **It does not
yet persist or email** — that's a documented TODO to forward to the NestJS API
+ Resend in the backend phase. The UI shows real success/error states.

## Design system

See `design-system/rangamai/MASTER.md` — the source of truth for tokens,
components, motion, and the pre-delivery checklist. Page-specific overrides go
in `design-system/rangamai/pages/`.

## Security notes

- No secrets in the repo. `.env*` is gitignored; `.env.example` holds
  placeholders only. Never hardcode API keys/DB passwords/JWT/Cloudinary/AWS
  secrets — use environment variables.
- `/api/*` is disallowed in `robots.txt`.

## Status (this phase)

Development only — no deployment yet. Not built this phase: admin dashboard,
NestJS backend + CRUD, MongoDB, Cloudinary, Resend, Docker/Nginx/AWS/CI-CD.
