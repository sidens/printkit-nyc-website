# Remove redundant "4×6 media." from the add-ons muted line

On the pricing page's Prepaid Media Kit card, the muted line I added reads:

> "4×6 media. 6×8 and 5×7 available on request — email us for a quote."

The card description directly above it already says "Up to 400 4×6 prints for one flat price," so the "4×6 media." lead-in repeats the size. Drop that lead-in so the muted line is just the new information:

> "6×8 and 5×7 available on request — email us for a quote."

## Change
- `src/components/pricing/AddOnsSection.tsx` — in the conditional muted paragraph under the `prepaidMediaKit` card, change the text from `4×6 media. 6×8 and 5×7 available on request — email us for a quote.` to `6×8 and 5×7 available on request — email us for a quote.`

No other file or wording changes. The description line above keeps "4×6"; the muted line keeps only the 6×8/5×7 request info. Build check after.
