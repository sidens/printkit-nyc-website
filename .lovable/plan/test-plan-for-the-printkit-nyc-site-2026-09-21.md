# Test plan for the PrintKit NYC site

Two deliverables: a written checklist kept in the project, plus automated tests that run on every build.

## 1. Written checklist — `docs/TEST-PLAN.md`

A walkthrough document grouped by area, each item written as "do this, expect that".

**Pages and navigation**
- Home, Pricing, FAQ, Request all load; header links work from every page; the header CTA always says "Check availability" and lands on /request.
- Footer links (Pricing, FAQ, Check availability) work.
- A made-up URL shows the friendly not-found page.
- `/manual` opens the printer manual; `/manual.pdf` downloads it; `/quickstart` opens the quickstart page.

**Prices shown on the site** (must match everywhere)
- $100/day printer, $100 prepaid media kit (up to 400 4×6 prints), $35/day print server, $200 refundable deposit, sales tax on everything except the deposit.

**Request form — dates**
- Past dates and booked dates cannot be picked; the pickup/return header fills in order and shows "{n} days".
- The "Synced …" line appears in the card footer; if the availability file is stale, the wording changes to mention email confirmation.

**Request form — estimate**
- With no dates: "Pick your dates to see an estimate", no dollar lines.
- With dates: day count, printer line, optional server and media kit lines, subtotal, tax, total, deposit, due before pickup — all arithmetic spot-checked by hand once.

**Request form — options**
- Media kit is off by default; checking it reveals size choice and kit count; kit count stays within 0–4.
- Choosing "From devices (wireless/ethernet)" shows the print-server hint and does not auto-check the add-on.

**Request form — contact and submit**
- Email selected: phone optional, form submits.
- Text or Call selected: phone required, short/invalid numbers blocked with a visible message; Call also shows "Best time to call".
- Success screen says "Request sent" with the wording matching the chosen contact method.
- Testimonial pull quote sits directly above the submit button.

**Accessibility and responsive**
- Skip link works; whole form usable by keyboard; error messages announced.
- Check at phone, tablet and desktop widths; nothing overlaps or gets cut off.

**Search and sharing**
- `robots.txt`, `sitemap.xml`, `llms.txt` reachable; page titles and descriptions unique; structured data still shows offers for each product.

## 2. Automated tests

Add the standard Vitest + Testing Library setup (`vitest.config.ts`, `src/test/setup.ts`, `test` script), then these test files:

- `src/lib/quote.test.ts` — pricing math: day counting (pickup and return both count), printer only, printer + server, each media size and 0–4 kits, tax applied to subtotal but never the deposit, invalid/empty dates return zeros.
- `src/lib/availability.test.ts` — blocked dates parsed, horizon respected, malformed or missing file falls back to the "unknown" state.
- `src/lib/pricingData.test.ts` — guards the published numbers ($100 / $100 / $35 / $200) so a stray edit fails the build.
- `src/components/request/RequestForm.test.tsx` — renders; empty-state estimate copy; media kit opt-in reveals size and count; phone optional under Email and required under Text/Call; device print method shows the hint; submit payload contains the expected keys (fetch mocked, nothing sent to Formspree).

Playwright is used ad hoc for visual/end-to-end spot checks; it is not added to the build.

## Out of scope
No copy, pricing, layout or behavior changes — this work only adds the checklist and tests. Anything the tests expose gets reported back to you before any fix.
