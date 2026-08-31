# Republish + GA4 Conversion & Search-Term Tracking

## What you have today
- GA4 (`G-GCJ47RJJ2P`) is loaded in `index.html` with only the base `config` — it tracks the initial page load but nothing else.
- The app is a React SPA, so route changes (Home → Pricing → FAQ → Request) currently register **zero** page views in GA.
- No conversion events exist for the request form.

## Part 1 — Republish
Publish the current build so all recent changes go live for Google's next crawl:
- Product schema `offers` fix (resolves the GSC product-snippet error)
- Prepaid-media-kit-only pricing
- Updated support copy, favicons, sitemap, llms.txt

## Part 2 — Better GA4 tracking (code changes)

**1. SPA page-view tracking**
- Add `src/lib/analytics.ts` with a typed `gtag` helper.
- In `src/components/ScrollToTop.tsx` (already fires on every route change), also send `gtag('event', 'page_view', { page_path, page_title })` so every route is measured.

**2. Conversion events**
- In `src/components/request/RequestForm.tsx`, on successful Formspree submission fire `gtag('event', 'generate_lead', { event_category: 'form', event_label: 'rental_request' })`.
- Fire `gtag('event', 'form_submit_error', ...)` on failure so you can spot broken submissions.
- Optionally track CTA clicks: "Check availability" header button and "See full pricing details" → `select_content` events, so you can see the funnel: landing → pricing → request → submit.

**3. Traffic-source capture**
- GA4 automatically captures referrer/UTM source on the landing page — no code needed. Organic Google visits will show as `google / organic` in acquisition reports.

## Part 3 — Search terms → form inquiries (the honest setup)

GA4 does **not** receive the actual keywords people typed into Google (Google withholds them as "not provided"). The correct way to see search queries next to conversions:

1. **Link Search Console to GA4** (manual step in your Google accounts — I can't do this via API):
   - GA4 Admin → Product Links → Search Console Links → link `sc-domain:printkitnyc.com`.
   - Then in GA4: Reports → Library → publish the "Search Console" collection.
   - This adds **Queries** and **Google Organic Search Traffic** reports inside GA4, so you can see which queries drive sessions and compare against your `generate_lead` conversions.
2. **Mark the conversion**: In GA4 Admin → Events → mark `generate_lead` as a Key Event (conversion). I'll use the exact event name GA recommends so it appears in standard reports.
3. After republishing, re-verify the sitemap is healthy (already 0 errors / 4 pages from the last submission).

## Deliverables
- New: `src/lib/analytics.ts` (gtag helper + page_view + lead events)
- Edits: `ScrollToTop.tsx`, `RequestForm.tsx`, `Header.tsx`/CTA click tracking
- Publish the site
- A short checklist of the 2 manual Google-account steps (GSC↔GA4 link, mark key event)

## Out of scope
- No Tag Manager migration (gtag.js is fine at this scale)
- No changes to form fields or pricing
