# Plan: Testimonial card rework + pricing striping fix

## 1. Homepage testimonial cards (`TestimonialSection.tsx` + `testimonials.ts`)

### a) Shorten context strings (`src/data/testimonials.ts`)
- `admiration-2026-09`: change `context` to `"Fashion week studio · Week-long rental"`
- `eastview-2026-09`: change `context` to `"Charity golf fundraiser · 3-day rental"`
- No other fields change.

### b) Reorder each card (`src/components/TestimonialSection.tsx`)
Each `<figure>` becomes, top to bottom:
1. lucide `Quote` icon, `w-6 h-6 text-primary/30`
2. full quote as `<blockquote>` (`text-base md:text-lg`)
3. attribution: name (`font-medium`), then `" · company"` in muted text when `company` exists (with the existing Admiration link behavior)
4. context line last, `text-xs text-muted-foreground mt-1`

Remove the eyebrow (the uppercase context line above the quote).

### c) Visible container
Wrap each card in `card-elevated p-8 h-full bg-card`.

### d) Gap and columns
Grid: `md:grid-cols-2`, `gap-8 lg:gap-12`, stacked below `md`.

### Heading
Keep `"What renters say"` h2 unchanged.

## 2. `/pricing` striping fix

### Problem
`PricingTestimonialQuote` is its own `<section className="bg-background ...">` placed directly before `PricingCTASection` (also `bg-background`). Two adjacent same-background sections break the alternating stripe rhythm.

### Fix
Move the pull quote inside `PricingCTASection`'s existing `<section>` and `container-narrow`/`max-w-2xl mx-auto text-center` block, as the first element above the `h2` heading.

- Remove `PricingTestimonialQuote`'s own `<section>` wrapper and its `bg-background` class.
- Implementation approach: inline the quote markup into `PricingCTASection.tsx` (or import the component and render it inside the CTA section's container), so the quote sits inside the CTA section's container above the heading.
- Spacing: `mb-10` between the quote block and the `"Check availability"` heading.
- Keep the quote centered, `max-w-2xl`, `text-base`, with `"Sam K., Admiration"` in `text-xs text-muted-foreground` beneath it. No card, no icon, no border.
- Remove the standalone `<PricingTestimonialQuote />` render from `Pricing.tsx` (it now lives inside `PricingCTASection`).

### Result
The CTA section retains its single `section-padding bg-background`, and the quote no longer introduces a duplicate background block, restoring the alternating stripe rhythm.

## 3. `/request`
No changes. The East View pull quote above the submit button stays as is.

## Verification
- Build passes (typecheck + Vite build).
- Playwright: homepage shows two cards with quote icon → quote → attribution → context order, `card-elevated` containers, `gap-12` at lg.
- Playwright: `/pricing` shows the Admiration pull quote directly above the "Check availability" heading inside the same section, with correct alternating background rhythm and no duplicate bg block.
- Run the existing Vitest suite (no behavioral logic changes expected to break tests).
