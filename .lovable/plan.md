# Restructure media and add-ons on the request page

Pricing math stays exactly as it is today. No price values change anywhere.

## 1. Request form: new "Print media" section

In `src/components/request/RequestForm.tsx`, after "How will you print?" and before the add-on section:

- Heading: **Print media**
- Subtext: "Every rental needs one roll of DS40 media. Ours comes loaded in the printer and test-printed before pickup."
- Two stacked option cards (same card styling as "How will you print?") in one radio group:
  - **PrintKit media kit** — selected by default. Price shown on the right, updating live with size x kits.
    - Expands when selected: size toggle ("4x6 · 400 prints · $100", "6x8 · 200 prints · $120", "5x7 · 200 prints · $160", default 4x6), kits stepper (min 1, max 4, default 1) labeled with the selected size's yield, e.g. "Kits (400 prints each)".
    - The existing one-size-per-rental line and the existing 5x7 special-order box stay exactly as written today.
  - **I'll bring my own DS40 media** — right side shows "—". When selected, a small muted note: "Must be DNP DS40 media, one size for the whole rental. You'll load it yourself before your event."

The old paragraph "Both are optional. Bring your own DNP DS40-compatible media and skip the print server, or add either below." and the "Add a prepaid media kit" checkbox are removed.

The estimate card shows the media line only when the PrintKit kit is selected; choosing "bring my own" drops that line and its cost, using the same quote function as today (kits counted as 0).

## 2. Add-on section

Heading becomes **Add-on** (singular) with only the WCMPlus print server checkbox, unchanged, including the existing hint tied to "How will you print?".

## 3. Request email fields

The submitted request replaces the old media add-on value with three fields: `mediaChoice` ("kit" or "byo"), `mediaSize`, and `mediaKits`.

## 4. Copy elsewhere

- Home pricing block (`src/components/PricingSection.tsx`): "Prepaid Media Kit (optional)" becomes "Media kit", keeping its $100 price and the existing "(up to 400 4×6 prints)" count.
- FAQ answer to "How do I get print media?" becomes, verbatim: "Add a media kit when you request dates: one roll, loaded and test-printed before pickup. 4×6 is $100 for 400 prints; 6×8 and 5×7 are available too. You can bring your own DNP DS40 media instead."
  This question appears both on the FAQ page (`src/lib/faqData.ts`) and in the homepage FAQ block (`src/components/FAQSection.tsx`); both get the same replacement so they stay in sync. No other FAQ answer or price changes.

Nothing on the site mentions DNP box sizes, rolls per box, retailers, or other sellers' media prices.

## Technical notes

- Form state: replace `mediaKitOptIn` with `mediaChoice: "kit" | "byo"` defaulting to `"kit"`, and `mediaKits` defaulting to `1`. Switching to `byo` passes `kits: 0` into `calculateQuote` without mutating the user's stored size/kit choices; switching back restores them.
- Stepper bounds become 1–4 while the kit is selected.
- `src/lib/quote.ts`, `src/lib/pricingData.ts`, availability logic, the Formspree endpoint, route, SEO props, Header and Footer are untouched.
- Existing tests that assert the old opt-in checkbox and `mediaKits: 0` payload (`src/components/request/RequestForm.test.tsx`) are updated to the new default-on kit behaviour, plus a case for selecting "bring my own". `docs/TEST-PLAN.md` gets the matching checklist edits.
- Verification: run the Vitest suite and the build, and spot-check /request in the browser for both media choices.
