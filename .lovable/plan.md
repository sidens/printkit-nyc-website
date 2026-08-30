# Prepaid media kit only — remove per-print billing

The $0.40/print "billed after return" option goes away. Print media becomes the optional **Prepaid Media Kit ($75 flat, up to 400 prints)** — renters either add it or supply their own DNP DS40 media.

## Changes

### 1. `src/lib/pricingData.ts`
- Remove the `printMedia` entry; `prepaidMediaKit` stays as the single media option.

### 2. Homepage pricing card — `src/components/PricingSection.tsx`
- Replace the "Print Media — $0.40 per print" row with "Prepaid Media Kit (optional) — $75 flat, up to 400 prints".

### 3. Pricing page add-ons — `src/components/pricing/AddOnsSection.tsx`
- Drop the per-print `printMedia` card; Prepaid Media Kit and Print Server remain.

### 4. Request form — `src/components/request/RequestForm.tsx`
- No change needed: the prepaid kit is already an optional add-on checkbox.

### 5. FAQs — `src/lib/faqData.ts`
- "How many prints can I make?" → media kit covers ~400 prints via the optional prepaid kit (or bring your own DS40 media).
- "How does print media billing work?" → repost as "How do I get print media?": prepaid kit $75 flat for up to 400 prints, no usage tracking; otherwise bring your own media.

### 6. Structured data — `src/components/ServiceSchema.tsx`
- Remove the per-print `Product` offer from the offer catalog; keep the Prepaid Media Kit product.

### 7. AI summary — `public/llms.txt`
- Remove the $0.40/print line; keep the $75 prepaid kit line.

## Technical notes

- Static copy/schema edits only; no backend or form-integration changes.
- After merging, republish so Google re-crawls the updated offer catalog (avoids new Search Console product-snippet warnings about a stale per-print price).
