# Homepage background rhythm cleanup

Yes — the same issue now sits between Pricing and "Print quality & speed". Fixing one pair by hand just moves the problem, so the homepage should get one consistent rhythm.

## Current state

Section order and background, top to bottom:

```text
Hero            white
How it works    off-white
Kit             white
Testimonial     off-white
Pricing         white   <- same as next
Print quality   white   <- double padding, no divider
Compatibility   off-white
Pickup          white
FAQ             off-white
CTA             white
```

Every section uses the same top and bottom padding (80px mobile, 112px desktop). When two neighbours share a background, that padding stacks into a ~160–224px gap with nothing to break it up — exactly what you saw after the testimonial.

## The fix

Alternate the background strictly all the way down the page, so no two neighbours ever match:

```text
Hero            white
How it works    off-white
Kit             white
Testimonial     off-white
Pricing         white
Print quality   off-white   (changed)
Compatibility   white       (changed)
Pickup          off-white   (changed)
FAQ             white       (changed)
CTA             off-white   (changed)
```

The closing call-to-action ending on off-white also flows into the footer, which is already off-white, so a thin top border stays on the footer to keep them distinct.

Nothing moves, nothing is reworded, no spacing values change — only which sections carry the tinted background.

## Files touched

- `src/components/PrintQualitySection.tsx`
- `src/components/CompatibilitySection.tsx`
- `src/components/PickupSection.tsx`
- `src/components/FAQSection.tsx`
- `src/components/CTASection.tsx`

Each is a one-line change swapping `bg-background` and `section-alt`.

## Check

Screenshot the full homepage in light and dark mode and confirm no two touching sections share a background, then confirm the build is clean.
