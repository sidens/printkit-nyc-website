# Fix the gap between the testimonial and pricing headline on the homepage

## Problem
`TestimonialSection` and `PricingSection` are adjacent on `Index.tsx`. Both use
`section-padding section-alt`. `section-padding` is `py-20 md:py-28`, so the
bottom padding of the testimonial plus the top padding of pricing stack into a
~160–224px gap. Because both also use `section-alt` (same background color),
there is no visual divider, so the gap reads as dead space. All other sections
alternate background colors, so their padding reads as intentional separation.

## Fix
Change one section so the two no longer share both classes. Keep the
testimonial as the "alt" (off-white/dark) block and make `PricingSection` start
with the default page background, so the existing color switch provides the
visual divider and the padding stops stacking on the same background.

Edit `src/components/PricingSection.tsx`:
- `<section id="pricing" className="section-padding section-alt">`
  → `<section id="pricing" className="section-padding">`

This removes `section-alt` from pricing only. Pricing keeps `section-padding`
for consistent vertical rhythm. No other section, page, file, copy, or logic
changes.

## Verify
- Build passes.
- Visually confirm the testimonial and pricing headline are no longer
  separated by a large same-background gap; the background now switches between
  the two sections.
- Confirm `/pricing` page (which reuses the styling) still looks correct.
