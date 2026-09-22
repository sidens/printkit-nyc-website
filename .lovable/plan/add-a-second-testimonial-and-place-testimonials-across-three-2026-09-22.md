# Add a second testimonial and place testimonials across three pages

## Data — `src/data/testimonials.ts`

Replace the array with two entries. Make `company` optional on the `Testimonial` interface (it is currently required) so the second entry can omit it.

- Entry 1: `admiration-2026-09` — unchanged, keeps `companyUrl: "https://admiration.co"` (link was approved earlier).
- Entry 2: `eastview-2026-09` — verbatim from the brief. `name: "East View Photography"`, no `company`, no `companyUrl`. `context`, `quote`, `pullQuote` verbatim.

```ts
export interface Testimonial {
  id: string;
  quote: string;
  pullQuote: string;
  name: string;
  company?: string;
  companyUrl?: string;
  context: string;
}
```

No other fields. No invented ratings, logos, photos, or job titles.

## 1. Home page — `src/components/TestimonialSection.tsx`

Rewrite to show both entries.

- Outer: `<section className="section-padding section-alt">` → `<div className="container-narrow">`.
- Section heading: `<h2 className="text-3xl md:text-4xl font-semibold mb-10">What renters say</h2>` (matches `KitSection` / `PricingSection` heading style). Left-aligned, no subheading.
- Grid: `<div className="grid md:grid-cols-2 gap-8">` — two equal-height cards side by side at `md` and up, stacked on mobile.
- Each card (`<figure>`):
  - Context line as eyebrow: `text-xs uppercase tracking-wide text-muted-foreground`.
  - lucide `Quote` icon, `w-6 h-6 text-primary/30` (smaller than current `w-8`), above the quote, left-aligned.
  - `<blockquote className="text-base md:text-lg leading-relaxed">` with the full `quote`. Normal weight, not italic.
  - Attribution (`<figcaption>`): render `name` in `font-medium`; if `company` is present, append ` · ` then the company — as a link when `companyUrl` exists (`target="_blank"`, `rel="noopener noreferrer"`, underline on hover only), else plain muted text. When `company` is absent, render only the name. So:
    - admiration → "Sam K." · "Admiration" (link to admiration.co)
    - eastview → "East View Photography" (no company)
  - Cards use `flex flex-col` so equal-height cards align; left-align all text.
- Remove the centered `max-w-3xl` single-quote layout, the single-quote size, and centered alignment.

No carousel, no stars, no avatars, no dots.

## 2. `/request` — `src/components/request/RequestForm.tsx`

The pull-quote block above the submit button (lines 604–607) now uses the `eastview-2026-09` entry instead of `admiration-2026-09`.

- Change `testimonials[0]` → `testimonials[1]` for the `pullQuote`.
- Attribution: render dynamically — `{testimonial.name}` plus `, {testimonial.company}` when `company` is present. For eastview (no company) it reads "East View Photography". Keep the same `text-xs text-muted-foreground` styling and the same bordered `<blockquote>` (`border-l-2 border-primary/40 pl-4 my-6`).
- Keep its position immediately before the submit `<div className="pt-2">` block.

## 3. `/pricing` — new pull quote above `PricingCTASection`

Add the `admiration-2026-09` pull quote directly above `PricingCTASection`, visually part of the same block. `PricingCTASection` itself stays unchanged.

- New component `src/components/pricing/PricingTestimonialQuote.tsx`, rendered in `src/pages/Pricing.tsx` immediately before `<PricingCTASection />`.
- Markup: a section using the same background as `PricingCTASection` (`bg-background`) so they read as one continuous block, with top padding only (`pt-20 md:pt-28 px-6 md:px-8 lg:px-12 pb-0`) so there is no double-padding gap before the CTA's own `section-padding`.
- Inside: `<div className="container-narrow"><div className="max-w-2xl mx-auto text-center">`.
  - `<blockquote className="text-base text-foreground">{admiration pullQuote}</blockquote>`
  - `<p className="text-xs text-muted-foreground mt-3">Sam K., Admiration</p>`
- No card, no icon, no border. Attribution is plain "Sam K., Admiration" (not a link here).

## What stays the same

- No changes to pricing, availability, quote math, Formspree payload logic (only the testimonial source entry changes on `/request`), validation, SEO props, Header, Footer, or any page other than home, `/request`, and `/pricing`.
- No testimonial on `/quickstart`, `/faq`, or `/manual`.
- No `Review`, `AggregateRating`, or any testimonial JSON-LD added.

## Verification

- Build passes (`/tmp/observability/build-errors.log` shows `build OK`).
- Playwright:
  - Home: "What renters say" heading; two equal-height cards at desktop width (admiration with link, eastview with company-only attribution), stacked on mobile; each card shows eyebrow, Quote icon, full quote, attribution.
  - `/request`: bordered pull quote just above submit reads the eastview pullQuote with "East View Photography" beneath.
  - `/pricing`: admiration pull quote centered above the "Check availability" CTA, "Sam K., Admiration" beneath; CTA unchanged.
- Confirm no `Review`/`AggregateRating` schema and no testimonial on `/quickstart`, `/faq`, `/manual`.
- Run `bun run test` — existing suite still passes (test data file shape change; update `TestimonialSection`/`RequestForm` expectations if any test references `testimonials[0]`).
