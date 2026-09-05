# Plan: Set daily printer rental to $100/day

## Goal
Change the DNP DS40 daily rental rate from **$95/day** to **$100/day**, keeping every public surface (site, FAQ, structured data, AI summary) in sync.

## Scope (price lives in one constant + three hardcoded mentions)
- `src/lib/pricingData.ts` → `PRICING.baseRental.price` (95 → 100) — drives PricingSection, DailyRentalSection, and ServiceSchema automatically.
- `src/pages/Pricing.tsx` → two hardcoded `$95/day` strings in meta descriptions.
- `public/llms.txt` → `$95 per day` line.
- No FAQ copy mentions a dollar amount for the daily rate; no edits needed there.

## Steps
1. `src/lib/pricingData.ts`: change `baseRental.price` from `95` to `100`.
2. `src/pages/Pricing.tsx`: replace `$95/day` with `$100/day` in both the `description` and `ogDescription` props.
3. `public/llms.txt`: update `Daily printer rental: $95 per day` → `$100 per day`.
4. Verify no remaining `$95`/`95 per day` references with a repo grep.
5. `bun run build` to confirm a clean build.

## Out of scope
- Prepaid Media Kit stays at $100 flat (already set last round).
- Security deposit, print server, and all other pricing unchanged.
- No sitemap resubmission needed (price isn't in the sitemap); advise republish so Google re-crawls the updated ServiceSchema.
