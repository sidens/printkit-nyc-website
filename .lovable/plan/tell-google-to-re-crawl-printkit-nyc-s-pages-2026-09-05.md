# Tell Google to re-crawl PrintKit NYC's pages

## Current state (verified via Search Console)
- Verified property: `sc-domain:printkitnyc.com`
- Sitemap `https://printkitnyc.com/sitemap.xml`: 4 URLs submitted, 0 errors, **2 warnings**, last downloaded by Google on 2026-09-03.
- The `index:inspect` API can only **read** a URL's index status — it cannot request a live test, request indexing, or force a re-crawl. "Request Indexing" is only available in the Search Console web UI.

## How re-crawling actually works
There is no global "crawl now" button. Two levers, used together:
1. **Resubmit the sitemap** — nudges Google to re-download it sooner (a soft hint, not a guarantee).
2. **Request Indexing per URL** — the strongest per-page nudge, done manually in the Search Console UI (~10 URLs/day limit). This is the real "tell Google to re-crawl this page now" action, and it can't be automated.

## Prerequisite before re-crawling
Make sure your latest pricing changes ($100/day rental, $100 prepaid media kit) are **live on printkitnyc.com** first. Re-crawling stale pages just re-indexes the old prices. Your site deploys via GitHub Actions to GitHub Pages — confirm that deploy has run for the pricing changes before asking Google to re-crawl.

## What I'll do on approval (one API action)
- **Resubmit the sitemap** to `sc-domain:printkitnyc.com` via the Search Console API (`PUT` to the sitemap path). This queues Google to re-download `sitemap.xml` sooner, which re-discovers the four routes.

## What you do yourself (in the Search Console UI)
For each page you want crawled promptly — do this after the site is republished:
1. Open Search Console → **URL Inspection**.
2. Paste the full URL (e.g. `https://printkitnyc.com/pricing`).
3. If it says "URL is not on Google" or shows stale content, click **"Request Indexing"**.
4. Repeat for `/`, `/faq`, `/request`. (Rate limited to ~10/day, so all four is fine.)
This step cannot be done through any API — only in the UI.

## About the 2 sitemap warnings
The Search Console response reports 2 warnings but no cause, so the exact reason is unknown from here. If you'd like, I can inspect each sitemap URL's index state (`index:inspect`) to narrow down whether a specific page is the source — say so and I'll run those reads after the sitemap resubmit. No code or site change is needed to clear a warning unless inspection reveals one.

## Out of scope
- No source code changes — pricing is already updated in the repo.
- No live-test / re-crawl API call (not possible via API).
