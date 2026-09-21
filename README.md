# RANGAMAI

AI-native software studio website — a fast, SEO-complete public site for
RANGAMAI (AI agents, AI systems, web & mobile apps, custom software), plus a
NestJS API and a protected admin dashboard.

Monorepo (npm workspaces). **Built so far (development stage):** the public
website (`apps/web`), the backend API (`apps/api`), and the admin dashboard
(`apps/admin`), all wired to a local MongoDB. Docker/Nginx/AWS deployment and
email notifications come in a later phase.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict) — web & admin
- **NestJS 11** + **Mongoose 8** + **MongoDB** — API
- **Tailwind CSS v4** (CSS-first `@theme`, tokens as CSS variables), "Ink & Amber" theme
- **next/font** — Space Grotesk (headings) + DM Sans (body); **lucide-react** icons
- Auth: **JWT in an HttpOnly cookie**, **bcryptjs** hashing, **class-validator** DTOs
- **Cloudinary** for media; **zod** on the web contact route
- **npm workspaces** (no pnpm/Docker required this phase)

## Layout

```
rangamai/
├── apps/
│   ├── web/                 Next.js public website (:3000)
│   │   ├── app/             routes, layout, sitemap.ts, robots.ts, api/contact
│   │   ├── components/      ui/ + sections/ + layout/
│   │   └── lib/
│   │       ├── content/     accessors — API-first, seed fallback
│   │       ├── api.ts       server-side API fetch (unwraps ApiResponse)
│   │       └── seo.ts       metadata + JSON-LD builders
│   ├── admin/               Next.js admin dashboard (:3001)
│   │   ├── app/(dashboard)/ protected CRUD screens + login
│   │   ├── components/      ui.tsx primitives, forms/, Sidebar/Topbar
│   │   └── lib/             api client, useAsync, form helpers
│   └── api/                 NestJS backend (:4000, global prefix /api)
│       └── src/             auth, users, services, projects, clients,
│                            leads, media, settings, homepage, stats, seed
├── packages/
│   └── shared/              domain types + seed content (built to dist/;
│                            single source of truth for web, admin, and api)
└── design-system/rangamai/  design system source of truth (MASTER.md)
```

## Getting started

Prerequisites: Node 24+, a local **MongoDB** (`mongod`) reachable on
`mongodb://127.0.0.1:27017`.

```bash
npm install
npm run build:shared                          # emit shared dist/ (types + seed)

# API — copy env, fill secrets, seed the DB
cp .env.example apps/api/.env.local           # set JWT_SECRET, ADMIN_EMAIL/PASSWORD, etc.
npm run seed                                  # upsert admin user + seed content into Mongo

# Web + admin env (both just point at the API)
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > apps/web/.env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > apps/admin/.env.local
```

Run each app (separate terminals, from repo root — these are convenience
scripts in the root `package.json`):

```bash
npm run dev        # apps/web  → http://localhost:3000  (rebuilds shared first)
npm run dev:admin  # apps/admin → http://localhost:3001
npm run dev:api    # apps/api   → http://localhost:4000
```

`npm run build` / `npm run lint` cover `apps/web`; build the others with
`npm run build --workspace <admin|api>`. `npm run build:shared` re-emits the
shared `dist/` when its types or seed change (it also runs automatically before
`npm run dev` / `build`).

## Data layer

Pages, SEO, and the sitemap call **only** the async accessors in
`apps/web/lib/content` (e.g. `getServiceBySlug`, `getFeaturedProjects`). When
`NEXT_PUBLIC_API_URL` is set they fetch from the NestJS API and **fall back to
the `@rangamai/shared` seed** if it's unreachable — so the site builds and
renders either way. Data-driven routes use ISR (`revalidate = 60`) so admin
edits surface without a redeploy. Domain types + seed content live once in
`packages/shared` and are shared by all three apps.

## API

- Uniform envelope: `{ success, data?, error?, fieldErrors? }` on every response.
- Public: `GET /api/{services,projects,clients,settings,homepage}` (published
  only) and `POST /api/leads` (rate-limited). Everything mutating is under
  `/api/admin/*` behind a JWT cookie guard.
- Security: helmet, CORS with credentials, global + per-route throttling,
  validation whitelist, image-only ≤5 MB media uploads.

## Admin dashboard

Login at `/login` with the seeded `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Manage
leads, services, projects, clients, media (Cloudinary), homepage content, and
site settings. Middleware guards routes on cookie presence; the dashboard
layout does the authoritative `/auth/me` check.

## Contact form

`POST /api/contact` (web) validates against `LeadInput` (zod), applies in-memory
per-IP rate limiting + a honeypot, then forwards the lead server-side to the API
`POST /api/leads`, which persists it. Email notification is currently an honest
dev-log stub (no provider configured yet) — a documented TODO until an official
inbox exists.

## Design system

See `design-system/rangamai/MASTER.md` — the source of truth for the Ink & Amber
tokens, components, motion, and the pre-delivery checklist.

## Security notes

- No secrets in the repo. `.env*` is gitignored; `.env.example` holds
  placeholders only. Never hardcode API keys / DB passwords / JWT / Cloudinary
  secrets — use environment variables. Passwords are bcrypt-hashed; the JWT
  rides in an HttpOnly cookie (set `COOKIE_SECURE=true` behind HTTPS).
- `/api/*` is disallowed in `robots.txt`; the admin app is `noindex`.

## Status

Development only — no deployment yet. **Media uploads need Cloudinary keys** in
`apps/api/.env.local` (endpoints return 503 until set). Not built yet: email
provider (Resend), Docker/Nginx/AWS/CI-CD.
