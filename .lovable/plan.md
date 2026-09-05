# Prepaid media kit: $75 to $100

Raise the optional prepaid media kit price from $75 to $100 everywhere it appears.

## Changes

1. **`src/lib/pricingData.ts`** — change `prepaidMediaKit.price` from `75` to `100`. This single source feeds:
   - Homepage pricing card (`PricingSection.tsx`) — no edit needed
   - Pricing page add-ons (`AddOnsSection.tsx`) — no edit needed
   - Structured data (`ServiceSchema.tsx`) — no edit needed

2. **`src/components/request/RequestForm.tsx`** — checkbox label "Prepaid media kit ($75 — up to 400 prints)" becomes "($100 — up to 400 prints)". This label also flows into the Formspree email, so your notifications will show the new price.

3. **`src/lib/faqData.ts`** — "How do I get print media?" answer: "$75 flat" becomes "$100 flat".

4. **`public/llms.txt`** — the AI-agent summary line "$75 flat for up to 400 prints" becomes "$100 flat ...".

## Verification

- Search for any remaining `$75`/`75` price mentions to confirm none are stale.
- Build passes.

## After shipping

Republish so the live site and structured data update; Google picks up the new price on its next crawl.

## Technical notes

Static copy edits only; no backend or form-integration changes. Print count ("up to 400 prints") and all other prices are unchanged.
