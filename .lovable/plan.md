# Clarify media-kit size wording (copy-only)

The prepaid media kit's "400 prints" figure is only true for 4×6 media. 6×8 and 5×7 yield ~200 prints and are priced differently, quoted by email. These copy edits make the 4×6 sizing explicit everywhere it currently reads as size-agnostic, and point to email for other sizes — without adding size options to the site or changing any price.

No product is added, removed, or repriced. Prices stay: $100/day rental, $100 media kit, $35/day print server, $200 deposit. The request form keeps its two add-on ids (`prepaid-media`, `print-server`) and all submission behavior.

## Changes

### 1. Central pricing constant — `src/lib/pricingData.ts`
- `prepaidMediaKit.note`: `"up to 400 prints"` → `"up to 400 4×6 prints"` (using the × character, matching the FAQ's existing style). No price/name/unit change.

### 2. Pricing page add-ons card — `src/components/pricing/AddOnsSection.tsx`
- Prepaid Media Kit card `description`: `"Up to 400 prints for one flat price"` → `"Up to 400 4×6 prints for one flat price"`.
- Add one line of smaller muted text beneath **that card only** (not the print-server card): `"4×6 media. 6×8 and 5×7 available on request — email us for a quote."` Match the section's existing small/muted text styling (`text-sm text-muted-foreground`). The card render currently maps uniformly over `addonMeta`, so render this extra line conditionally for the `prepaidMediaKit` key. Do not add a third card.

### 3. Request form add-on checkbox — `src/components/request/RequestForm.tsx`
- First checkbox label: `"Prepaid media kit ($100 — up to 400 prints)"` → `"Prepaid media kit ($100 — up to 400 4×6 prints)"`.
- Leave `addon.id` (`prepaid-media`), the WCMPlus label, and all submission logic untouched.

### 4. FAQ page answer — `src/lib/faqData.ts` (General Questions)
- "How do I get print media?" answer: append `"... media. 6×8 and 5×7 media are available on request at a different price and print count — email us and we'll quote it."` to the existing sentence.
- The two other FAQ answers that already say "400 4×6 prints" ("How many prints can I make?" here, and the homepage "How do I get print media?" in `FAQSection.tsx`) are left untouched.

### 5. HEIC note — `src/lib/faqData.ts` (Equipment Details)
- "Can I print from an iPad or iPhone?" answer: append a second paragraph inside the same accordion answer:
  `"One setup note: iPhones that save photos in HEIC format can produce prints with white edges over AirPrint. Set Camera → Formats → "Most Compatible" on the device before your event and prints will come out full-bleed."`
- Keep it inside the same answer; no new FAQ question.

## Verification
- Search the whole project for the bare string `400 prints` (no size in front). Every remaining instance must read `400 4×6 prints`.
- Confirm no price value changed and the request form still submits the same two add-on ids.
- Confirm the FAQ structured data (built from `allFaqs`) reflects the revised answers.
- Check for a clean build.

## Out of scope
- The homepage FAQ `FAQSection.tsx` "How do I get print media?" answer (already says 4×6).
- Any component or form logic not named above.
