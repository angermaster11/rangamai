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
**Style:** Ink & Amber — warm editorial, typography-led, one confident accent
**Design Dials:** Motion 4/10 (Standard, CSS-first) | Density 5/10 (Standard)

---

## Global Rules

### Color Palette

Tokens are CSS variables in `apps/web/app/globals.css`. Light and dark are BOTH
first-class (dark applies via `prefers-color-scheme` and via `[data-theme]`).
Surfaces are **warm** (paper / charcoal, no blue undertone). **Primary = ink**
(near-black; flips to paper in dark mode) and drives buttons, the wordmark, and
the inverted CTA panel. A **single amber accent** carries all the colour: eyebrows,
links, arrows, icon chips, focus ring, and the hero/CTA accent rule.

**Light mode**

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background (paper) | `#FAF9F6` | `--background` |
| Foreground (ink) | `#17161A` | `--foreground` |
| Card | `#FFFFFF` | `--card` |
| Card Foreground | `#17161A` | `--card-foreground` |
| Muted | `#F0EEE8` | `--muted` |
| Muted Foreground | `#6F6A63` | `--muted-foreground` |
| Border / Input | `#E5E1D8` | `--border` / `--input` |
| Primary (ink) | `#17161A` | `--primary` |
| On Primary (paper) | `#FAF9F6` | `--primary-foreground` |
| Secondary (cream) | `#F3EEE3` | `--secondary` |
| On Secondary (amber-brown) | `#92400E` | `--secondary-foreground` |
| Accent (amber) | `#A84D08` | `--accent` |
| On Accent | `#FFFFFF` | `--accent-foreground` |
| Destructive | `#B91C1C` | `--destructive` |
| Success | `#047857` | `--success` |
| Ring (focus, amber) | `#A84D08` | `--ring` |

**Dark mode**

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background (charcoal) | `#1C1917` | `--background` |
| Foreground | `#E7E5E4` | `--foreground` |
| Card | `#24211E` | `--card` |
| Muted | `#2E2A25` | `--muted` |
| Muted Foreground | `#A8A29E` | `--muted-foreground` |
| Border / Input | `#332F2A` | `--border` / `--input` |
| Primary (paper) | `#E7E5E4` | `--primary` |
| On Primary (ink) | `#1C1917` | `--primary-foreground` |
| Secondary | `#2E2A25` | `--secondary` |
| On Secondary (amber) | `#FBBF24` | `--secondary-foreground` |
| Accent (amber) | `#F59E0B` | `--accent` |
| Ring (focus, amber) | `#F59E0B` | `--ring` |

**Color Notes:** Ink primary is the "voice" (buttons, wordmark, inverted CTA);
amber is the only chromatic accent and does all the pointing (links, eyebrows,
arrows, focus). Light accent is darkened amber (`#A84D08`) so small eyebrow/label
text clears 4.5:1 on paper, card, AND muted. Dark accent (`#F59E0B`) sits on
warm charcoal. No purple, no cyan, no blue-slate — warm neutrals throughout.

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

**Style:** Ink & Amber — warm editorial, typography-led. Warm paper/charcoal
surfaces, generous whitespace, one amber accent. **No decorative glow gradients.**
Brand accent shows as a short amber rule (`h-1 w-16 bg-accent`) under the hero
`<h1>` and on the CTA panel — not as a background wash. The final CTA is an
inverted ink panel (`bg-primary`) with an amber button. Left-aligned hero
(not centered) for an editorial, non-template feel.

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
- ❌ **Decorative radial glow gradients** — this brand is typography-led; accent
  shows as a solid amber rule, not a background wash.
- ❌ **Purple / cyan / blue-slate** — the palette is warm ink + amber only.
- ❌ **More than one chromatic accent** — amber does all the pointing; everything
  else is ink/paper/warm-grey.

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
