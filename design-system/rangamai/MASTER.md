# Design System Master File — RANGAMAI

> **LOGIC:** When building a specific page, first check `design-system/rangamai/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> This file is the **source of truth** for the RANGAMAI public website. It was
> seeded from the `ui-ux-pro-max` skill and then reconciled with the actual
> implementation in `apps/web` (tokens live in `apps/web/app/globals.css`).
> Keep the two in sync when either changes.

---

**Project:** RANGAMAI — AI-native software studio
**Category:** AI / Software Solutions (B2B, premium/serious)
**Style:** AI-Native UI — minimal chrome, neutral surfaces, purple + cyan accents
**Design Dials:** Motion 4/10 (Standard, CSS-first) | Density 5/10 (Standard)

---

## Global Rules

### Color Palette

Tokens are CSS variables in `apps/web/app/globals.css`. Light and dark are BOTH
first-class (dark applies via `prefers-color-scheme` and via `[data-theme]`).
Surfaces are intentionally neutral (not tinted purple) for a premium/serious feel.

**Light mode**

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#FFFFFF` | `--background` |
| Foreground | `#0F172A` | `--foreground` |
| Card | `#FFFFFF` | `--card` |
| Card Foreground | `#0F172A` | `--card-foreground` |
| Muted | `#F1F5F9` | `--muted` |
| Muted Foreground | `#475569` | `--muted-foreground` |
| Border / Input | `#E2E8F0` | `--border` / `--input` |
| Primary | `#7C3AED` | `--primary` |
| On Primary | `#FFFFFF` | `--primary-foreground` |
| Secondary | `#EDE9FE` | `--secondary` |
| On Secondary | `#4C1D95` | `--secondary-foreground` |
| Accent | `#0891B2` | `--accent` |
| On Accent | `#FFFFFF` | `--accent-foreground` |
| Destructive | `#DC2626` | `--destructive` |
| Success | `#059669` | `--success` |
| Ring (focus) | `#7C3AED` | `--ring` |

**Dark mode**

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0F172A` | `--background` |
| Foreground | `#E2E8F0` | `--foreground` |
| Card | `#111827` | `--card` |
| Muted | `#1E293B` | `--muted` |
| Muted Foreground | `#94A3B8` | `--muted-foreground` |
| Border / Input | `#1E293B` | `--border` / `--input` |
| Primary | `#A78BFA` | `--primary` |
| On Primary | `#0F172A` | `--primary-foreground` |
| Secondary | `#1E1B4B` | `--secondary` |
| On Secondary | `#DDD6FE` | `--secondary-foreground` |
| Accent | `#22D3EE` | `--accent` |
| Ring (focus) | `#A78BFA` | `--ring` |

**Color Notes:** Purple primary carries brand + focus; cyan accent for eyebrows
and secondary emphasis. Dark-mode brand values are lightened (violet/cyan) to
hold ≥4.5:1 contrast on dark surfaces.

### Typography

- **Heading Font:** Space Grotesk (via `next/font`, `--font-space-grotesk`)
- **Body Font:** DM Sans (via `next/font`, `--font-dm-sans`)
- **Loaded with** `next/font/google` (self-hosted, `display: swap`) — NOT a CSS
  `@import` (better LCP + no layout shift + privacy).
- **Mood:** modern, precise, engineered, calm, credible

Do not reintroduce a Google Fonts `<link>`/`@import`; fonts are wired in
`apps/web/app/layout.tsx`.

### Spacing

*Density: 5/10 — Standard.* Use Tailwind's default scale. Section rhythm is
`py-16 sm:py-20 lg:py-24` (see `components/ui/Section.tsx`). Page gutter is
`px-4 sm:px-6 lg:px-8` inside a `max-w-6xl` container.

### Radii

| Token | Value |
|-------|-------|
| `--radius` (lg) | `0.75rem` |
| md | `calc(--radius - 0.25rem)` |
| sm | `calc(--radius - 0.375rem)` |

Cards use `rounded-xl`; buttons/inputs `rounded-lg`.

### Shadows

Kept subtle and brand-tinted on hover for interactive cards:
`hover:shadow-lg hover:shadow-primary/5`. No heavy drop shadows.

---

## Component Specs

Components live in `apps/web/components/ui`. Match these, don't re-invent.

### Buttons (`ui/Button.tsx`)
- Variants: `primary` (bg-primary), `secondary` (bg-secondary + border), `ghost`.
- Sizes: `sm` (h-9), `md` (h-11), `lg` (h-12). Always `cursor-pointer`,
  `transition-colors` 200ms, visible focus ring.
- `ButtonLink` auto-detects external URLs → `target=_blank rel=noopener noreferrer`.

### Cards (`ui/Card.tsx`)
- `bg-card border border-border rounded-xl p-6`.
- `interactive` prop adds a subtle hover lift (`-translate-y-1`) + border tint.
  Never shift layout of surrounding content.

### Inputs (contact form)
- `border border-border bg-background rounded-lg px-3.5 py-2.5 text-sm`.
- Focus: the global `:focus-visible` ring (2px `--ring`, 2px offset). No removed outlines.

### Icons (`ui/Icon.tsx`)
- **SVG only, lucide-react.** No emoji as icons, ever. Unknown names fall back to `Sparkles`.

---

## Style Guidelines

**Style:** AI-Native / minimal. Clean neutral surfaces, generous whitespace,
one accent language (purple + cyan). Subtle radial brand glow allowed on hero
and CTA bands only (`radial-gradient` from `--primary`), never behind body text.

### Page Pattern (homepage)

Hero (single `<h1>`) → Services Preview → Showcase → Why RANGAMAI → How We Work
→ Trusted By → Final CTA → Footer. One `<h1>` per page; sections use `<h2>`.

CTA strategy: primary CTA in hero + closing CTA band. CTA label contrast ≥4.5:1
against fill.

---

## Motion

**CSS-first, standard tier (4/10). No GSAP** (skill's GSAP snippets are NOT used
here — the spec calls for animations "sparingly").

- Entrance: `.animate-fade-up` (opacity + 12px rise, 0.5s, `cubic-bezier(0.22,1,0.36,1)`).
- Hover: `transition-colors` / `transition-transform` 150–300ms.
- **All motion is gated by `prefers-reduced-motion: reduce`**, which globally
  neutralizes animation/transition durations in `globals.css`.

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons** — use lucide SVG via `ui/Icon.tsx`.
- ❌ **Missing `cursor-pointer`** on clickable elements.
- ❌ **Layout-shifting hovers** — no scale transforms that reflow neighbours.
- ❌ **Low contrast text** — maintain 4.5:1 minimum (both light and dark).
- ❌ **Instant state changes** — always transition (150–300ms).
- ❌ **Invisible focus states** — the focus ring is required for a11y.
- ❌ **GSAP / heavy JS animation** — CSS-first only for this project.
- ❌ **Google Fonts `@import`/`<link>`** — use `next/font`.
- ❌ Tinted-purple page backgrounds — surfaces stay neutral.

Note: unlike the generic skill default, **dark mode is a first-class, supported
theme here** — not an anti-pattern.

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (SVG / lucide only)
- [ ] All icons from one set (lucide-react)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Text contrast ≥4.5:1 in BOTH light and dark mode
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind the sticky header
- [ ] No horizontal scroll on mobile
- [ ] One `<h1>` per page; heading hierarchy correct
- [ ] `alt` text on all meaningful images
