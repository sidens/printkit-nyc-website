# Add one customer testimonial in two places

## Data

Create `src/data/testimonials.ts` exporting a `testimonials` array. One entry, verbatim from the brief. **No `companyUrl`** (link not approved) — "Admiration" renders as plain muted text in both placements.

```ts
export interface Testimonial {
  id: string;
  quote: string;
  pullQuote: string;
  name: string;
  company: string;
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "admiration-2026-09",
    quote:
      "Printing can be one of the hardest and most frustrating parts of running a fashion week collection studio. PrintKit's turnkey kit made it seamless. We printed headshots, wardrobe boards, and model boards throughout the rental, and the setup worked flawlessly from start to finish. Having a fully ready-to-go kit like this is the only way I want to handle printing going forward. Couldn't recommend PrintKit more.",
    pullQuote:
      "PrintKit's turnkey kit made it seamless. The setup worked flawlessly from start to finish.",
    name: "Sam K.",
    company: "Admiration",
    context: "Fashion week collection studio · Week-long rental · DS40 + print server",
  },
];
```

Components read `testimonials[0]`. No testimonial text hardcoded in components.

## 1. Home page

New `src/components/TestimonialSection.tsx`, rendered in `src/pages/Index.tsx` between `<KitSection />` (line 32) and `<PricingSection />` (line 33).

Structure:
- Outer `<section className="section-padding section-alt">`, `<div className="container-narrow">`, `<div className="max-w-3xl mx-auto text-center">`.
- Eyebrow: `context` line, `text-xs uppercase tracking-wide text-muted-foreground`.
- lucide `Quote` icon centered above the quote: `w-8 h-8 text-primary/30`.
- `<blockquote>` with full `quote`: `text-lg md:text-2xl leading-relaxed text-balance`, normal weight, not italic.
- Attribution in a `<figcaption>`: "Sam K." in `font-medium`, then " · Admiration" in muted text (plain text, no link).
- One featured quote only. No carousel, slider dots, plural heading, stars, avatar, or placeholder photo.

## 2. /request

In `src/components/request/RequestForm.tsx`, insert the pull-quote block **immediately before the submit button** — after the notes fieldset (after line 450, before the `<div className="pt-2">` submit block at line 452).

```tsx
<blockquote className="border-l-2 border-primary/40 pl-4 my-6">
  <p className="text-sm text-foreground">{testimonial.pullQuote}</p>
  <p className="text-xs text-muted-foreground mt-2">Sam K., Admiration</p>
</blockquote>
```

No card, no icon. Attribution "Sam K., Admiration" on its own line.

## What stays the same

- No changes to pricing, availability, quote math, Formspree payload, validation, SEO props, Header, Footer, or any page other than the home page and `/request`.
- No testimonial shown on `/pricing` or `/quickstart`.

## Prohibitions (from the brief)

- No `Review`, `AggregateRating`, or any testimonial JSON-LD. No invented star ratings, extra testimonials, logos, photos, or job titles.
- Quote text, punctuation, and attribution unchanged.
- `companyUrl` is removed (link not approved); "Admiration" is plain muted text in both spots.

## Verification

- Build passes (`/tmp/observability/build-errors.log` shows `build OK`).
- Playwright: home page shows the Quote icon, full quote, context eyebrow, and "Sam K. · Admiration" attribution between the Kit section and Pricing section; `/request` shows the bordered pull-quote block just above the submit button with "Sam K., Admiration" underneath.
- Confirm no `Review`/`AggregateRating` schema added and no testimonial on `/pricing` or `/quickstart`.
