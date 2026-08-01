# Make PrintKit NYC discoverable by search crawlers and AI agents

The site already has solid basics: per-page titles/descriptions/canonicals, Open Graph and Twitter cards, a sitemap covering all four routes, robots.txt with a sitemap directive, and LocalBusiness + FAQPage structured data. The gaps are around AI agents and machine-readable product/pricing facts.

## What to add

### 1. Explicit AI crawler access in robots.txt
Add named allow blocks so AI/answer engines are unambiguously permitted (they currently only match the `*` rule, and some operators check for their own agent):
GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider.

### 2. An llms.txt file
A plain-text summary at `/llms.txt` — what PrintKit NYC is, the printer model, service area and pickup location, daily/weekend pricing, media/add-on pricing (including the $75 prepaid media kit), how to request dates, and links to the four pages. This is the emerging convention for giving AI agents clean, quotable facts instead of making them parse the React app.

### 3. Product/Service structured data with prices
A new schema component rendering `Service` (or `Product` with `Offer`) JSON-LD on the home and pricing pages: rental offers with prices, currency, availability, and `areaServed` for NYC. This is what lets Google and AI assistants answer "how much does it cost to rent a photo printer in NYC" with your actual numbers.

### 4. BreadcrumbList on inner pages
Breadcrumb JSON-LD on `/pricing`, `/faq`, and `/request` so results show the site hierarchy.

### 5. Sitemap and crawl hygiene
- Add `<lastmod>` entries only if there is a real content-change date to use; otherwise leave them out.
- Add `noindex` to the 404 page so error pages don't get indexed.
- Confirm `dist/404.html` (an SPA copy of index.html) doesn't get crawled as a duplicate — the canonical tag on it should point to `/`.

### 6. Static content fallback for non-JS crawlers
This app is a client-rendered SPA, so crawlers that don't execute JavaScript see an empty page body. Google renders JS, but many AI crawlers and social scrapers do not. Two options:
- **Low effort (recommended now):** rely on the rich head tags plus llms.txt and JSON-LD, which are all in the static HTML and readable without JS.
- **Full fix:** server-side rendering, which would need a migration to Lovable's TanStack Start template — [what the upgrade gives you](https://lovable.dev/blog/building-apps-using-tanstack-start).

## Technical details

- `public/robots.txt` — append per-agent allow blocks, keep the existing blocks and `Sitemap:` line.
- `public/llms.txt` — new static file.
- `src/components/ServiceSchema.tsx` — new Helmet component emitting Service/Offer JSON-LD; prices sourced from the same values shown in `src/components/pricing/AddOnsSection.tsx` and the pricing page so they can't drift.
- `src/components/BreadcrumbSchema.tsx` — new Helmet component, given a route path and label.
- `src/pages/Index.tsx`, `Pricing.tsx`, `FAQ.tsx`, `Request.tsx` — mount the new schema components.
- `src/pages/NotFound.tsx` — add `<Helmet><meta name="robots" content="noindex" /></Helmet>`.
- `public/sitemap.xml` — hand-edited static file; keep that mechanism.

### 7. Fix homepage pricing button destination
The "See full pricing details" button currently links to `/pricing` in source, but the reported behavior lands on the security deposit section. Verify with a browser test; if scroll restoration or a hash is causing the jump, fix the link to explicitly navigate to the top of the pricing page.

## Verification

After the changes, run an SEO review from the SEO tab to confirm the crawl and structured-data checks pass.
