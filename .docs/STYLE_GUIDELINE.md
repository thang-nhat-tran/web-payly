# Style Guideline — Payly Design System

> Mastercard-inspired. Full reference: `.docs/DESIGN_SYSTEM.md`.

---

## How `global.css` works

Tokens are declared in `@theme {}`. Tailwind v4 auto-generates utility classes and CSS variables from each token.

```
--color-canvas        →  bg-canvas, text-canvas, border-canvas
--color-ink           →  bg-ink, text-ink
--spacing-3           →  p-3, m-3, gap-3, px-3, py-3 …
--radius-cta          →  rounded-cta
--shadow-card         →  shadow-card
--text-h2             →  text-h2
--breakpoint-md       →  md: prefix
```

One declaration → utility class **and** CSS variable (usable in `<style scoped>`).

---

## 5-second rules

1. **Page background is already Canvas Cream** (`#F3F0EE`) — no `bg-*` needed on root
2. **Body text is already Ink Black** at weight 450 — no `text-ink` on every paragraph
3. **Font is already Sofia Sans** — no `font-sans` needed everywhere
4. **H1/H2/H3 are already styled** (500 weight, -2% tracking) — plain `<h1>` is correct
5. **Signal Orange is a legal color** — never use `bg-signal` or `text-signal` on marketing CTAs

---

## Buttons — 4 CTA types

```vue
<!-- Primary — Ink Pill (marketing CTAs) -->
<button class="btn-primary">Learn more</button>

<!-- Secondary — Outlined Pill (paired or utility actions) -->
<button class="btn-secondary">View details</button>

<!-- Consent — Signal Orange (legal / privacy ONLY) -->
<button class="btn-consent">Accept all</button>

<!-- Icon-only circle (carousel, search toggle) -->
<button class="btn-icon" aria-label="Next">→</button>
```

- `btn-primary` and `btn-secondary` share **20px radius** (`rounded-cta`)
- `btn-consent` uses **24px radius** (`rounded-consent`) — the extra 4px visually marks it as consent
- Never use Signal Orange outside `btn-consent` — it reads as a compliance color

---

## Eyebrow label

```vue
<!-- Always: accent dot + uppercase text + small gray color -->
<p class="eyebrow text-signal-light">• Services</p>

<!-- Or manually -->
<p class="text-eyebrow font-bold tracking-eyebrow uppercase text-slate">
  • Solutions
</p>
```

Rules:
- **Only place** uppercase tracking (+4%) appears
- Paired with a tiny accent dot (bullet or SVG)
- Never use uppercase on headings or body copy

---

## Headings — use plain HTML

```vue
<!-- All auto-styled: 500 weight, -2% tracking, Ink Black -->
<h1>The future of payments</h1>  <!-- 64px -->
<h2>Our services</h2>            <!-- 36px -->
<h3>Card security</h3>           <!-- 24px -->
```

Override color only when the section surface requires it:

```vue
<footer class="bg-ink text-canvas-lifted">
  <!-- h2 would be invisible — override to canvas -->
  <h2 class="text-canvas">We're always here when you need us</h2>
</footer>
```

---

## Cards & Containers

```vue
<!-- Generic content card — 40px radius, soft atmospheric shadow -->
<article class="card">
  <h3>Card title</h3>
  <p class="text-slate text-sm mt-2">Supporting copy.</p>
</article>

<!-- Hero media frame — stadium shape, fills container -->
<div class="frame-stadium w-full aspect-video bg-ink">
  <!-- video / image -->
</div>

<!-- Raised section — one step lighter than canvas -->
<section class="bg-canvas-lifted rounded-hero p-5">
  <!-- lifted cream content -->
</section>
```

---

## Circular portrait + satellite CTA

```vue
<div class="relative inline-block">
  <!-- Portrait: perfect circle, any size -->
  <div class="portrait w-72 h-72">
    <img src="..." alt="..." class="w-full h-full object-cover" />
  </div>

  <!-- Satellite: docked bottom-right, protrudes ~40% outside -->
  <button
    class="btn-satellite absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"
    aria-label="Explore"
  >
    →
  </button>
</div>
```

---

## Floating Nav Pill

```vue
<nav class="nav-pill fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
  <span class="font-bold text-ink">Payly</span>
  <a class="text-nav font-medium tracking-nav text-ink">Features</a>
  <a class="text-nav font-medium tracking-nav text-ink">Pricing</a>
  <button class="btn-primary">Get started</button>
</nav>
```

- Always floating (not flush at `y=0`) — use `top-6` or similar offset
- The pill shape is preserved at every breakpoint

---

## Footer

```vue
<footer class="bg-ink text-canvas py-8 px-6">
  <h2 class="text-canvas">We're always here when you need us</h2>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
    <!-- Column header: uppercase, muted, +4% tracking -->
    <div>
      <p class="eyebrow text-slate mb-3">Support</p>
      <ul class="flex flex-col gap-2">
        <li><a class="text-sm text-canvas font-[450] hover:text-canvas-lifted">Help center ↗</a></li>
      </ul>
    </div>
  </div>
</footer>
```

---

## Responsive

```vue
<!-- Mobile-first, stack → grid at md -->
<div class="flex flex-col md:flex-row gap-3">
  <article class="card flex-1">...</article>
  <article class="card flex-1">...</article>
</div>

<!-- Heading scales with breakpoint -->
<h1 class="text-h2 md:text-h1">Hero headline</h1>
```

| Prefix | Width     |
|--------|-----------|
| `sm:`  | ≥ 768px   |
| `md:`  | ≥ 1024px  |
| `lg:`  | ≥ 1440px  |

---

## CSS variables in scoped styles

Every token is also a CSS variable:

```vue
<template>
  <div class="orbital-section">
    <h2>Our services</h2>
  </div>
</template>

<style scoped>
.orbital-section {
  background-color: var(--color-canvas);
  padding: var(--spacing-7) var(--spacing-3);
  border-radius: var(--radius-hero);
}

/* Orbital decorative arc — Light Signal Orange only */
.orbital-section::after {
  content: '';
  position: absolute;
  border: 1px solid var(--color-signal-light);
  border-radius: var(--radius-circle);
  /* size / position per design */
}
</style>
```

---

## Cheat sheet

| Need | Class |
|------|-------|
| **Colors** | |
| Page background | `bg-canvas` (default — no class needed) |
| Raised section | `bg-canvas-lifted` |
| White surface | `bg-surface-white` |
| Primary text | `text-ink` (default — no class needed) |
| Muted text | `text-slate` |
| Link | `text-link` |
| Footer surface | `bg-ink text-canvas` |
| **Buttons** | |
| Marketing CTA | `btn-primary` |
| Secondary action | `btn-secondary` |
| Legal / consent | `btn-consent` |
| Icon circle | `btn-icon` |
| Portrait micro-CTA | `btn-satellite` |
| **Radius** | |
| CTA buttons | `rounded-cta` (20px) |
| Consent button | `rounded-consent` (24px) |
| Hero / stadium | `rounded-hero` (40px) |
| Circle | `rounded-circle` (50%) |
| Full pill | `rounded-pill` (999px) |
| **Shadows** | |
| Nav pill | `shadow-float` |
| Elevated card / hero | `shadow-card` |
| **Typography** | |
| Hero headline | `text-h1` — use plain `<h1>` |
| Section heading | `text-h2` — use plain `<h2>` |
| Card title | `text-h3` — use plain `<h3>` |
| Eyebrow label | `.eyebrow` |
| Body | `text-base` (default) |
| Muted body | `text-slate` |
| **Spacing** | |
| 8px | `p-1` / `gap-1` |
| 16px | `p-2` |
| 24px | `p-3` (default gaps) |
| 32px | `p-4` |
| 48px | `p-5` (section inner) |
| 64px | `p-6` |
| 96px | `p-7` (section-to-section) |
| 128px | `p-8` (generous section) |
| **Components** | |
| Content card | `.card` |
| Hero / media frame | `.frame-stadium` |
| Circular portrait | `.portrait` |
| Floating nav | `.nav-pill` |

---

## 5 common mistakes

| ❌ Wrong | ✅ Correct | Why |
|----------|-----------|-----|
| `bg-white` | `bg-surface-white` or `bg-canvas` | Pure white breaks the warm editorial tone |
| `bg-signal` on a CTA | `btn-primary` (ink) | Signal Orange is a consent color — using it on marketing dilutes the legal signal |
| `rounded-lg` (Tailwind default 8px) | `rounded-cta` (20px) or `rounded-pill` | The 8–16px range is intentionally absent from this system |
| `shadow-md` (Tailwind default) | `shadow-card` or `shadow-float` | Defaults are overridden; tight hard shadows break the atmospheric philosophy |
| `<h1 class="text-4xl font-bold">` | `<h1>` plain HTML | Base styles already apply 64px / 500 weight / -2% tracking |
| `uppercase` on a section title | `uppercase` only inside `.eyebrow` | Uppercase tracking is reserved for the 14px eyebrow scale |
