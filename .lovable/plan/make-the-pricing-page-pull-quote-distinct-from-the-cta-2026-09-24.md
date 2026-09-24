# Make the pricing-page pull quote distinct from the CTA

## Problem
On `/pricing`, the East View pull quote sits inside `PricingCTASection`'s centered
`max-w-2xl` block directly above the "Check availability" heading, on the same
background with no divider. The size jump to the heading is the only signal, so the
quote reads as part of the CTA rather than as separate social proof.

## Approach (chosen: subtle quote card)
Wrap the existing pull quote in a soft bordered container that echoes the homepage
testimonial cards, so the quote reads as its own element while staying inside the
existing section (the alternating background rhythm is preserved).

## Edit — `src/components/pricing/PricingCTASection.tsx`
Only the testimonial block changes. The section, container, heading, paragraph,
button, and `handleRequestClick` stay exactly as-is.

1. Add `import { Quote } from "lucide-react";` at the top.
2. Replace the current quote wrapper:
   ```
   {testimonial && (
     <div className="mb-10">
       <blockquote className="text-base text-foreground">
         {testimonial.pullQuote}
       </blockquote>
       <p className="text-xs text-muted-foreground mt-3">
         {testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ""}
       </p>
     </div>
   )}
   ```
   with a subtle card container:
   ```
   {testimonial && (
     <div className="mb-10 max-w-xl mx-auto card-elevated p-6 md:p-8 text-left">
       <Quote className="w-5 h-5 text-primary/30 mb-3" aria-hidden="true" />
       <blockquote className="text-base md:text-lg leading-relaxed text-foreground">
         {testimonial.pullQuote}
       </blockquote>
       <p className="text-xs text-muted-foreground mt-3">
         {testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ""}
       </p>
     </div>
   )}
   ```
   - `card-elevated` gives the same soft border + `--shadow-soft` used by the
     homepage testimonial cards, so the two surfaces feel related.
   - `p-6 md:p-8`, `max-w-xl mx-auto`, and `text-left` make it read as a contained
     quote card rather than a continuation of the centered CTA copy.
   - The `Quote` icon (`w-5 h-5 text-primary/30`) matches the homepage cards'
     treatment in a slightly smaller size appropriate to the pull quote.

No other file, copy, pricing logic, or component changes.

## Verify
- Build passes (`tsgo --noEmit` + Vite build).
- Playwright on `/pricing`: the quote sits inside its own bordered card with a quote
  icon, visually separate from the "Check availability" heading; the CTA heading,
  paragraph, and button are unchanged; the section background still alternates
  correctly with the section above it.
