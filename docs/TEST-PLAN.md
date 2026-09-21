# PrintKit NYC — test plan

Two layers of checking:

- **Automated tests** — run `npm test` (or `bun run test`). Covers pricing math, availability parsing, published prices and the request form's behavior.
- **Manual checklist below** — walk through before each publish. Each item is "do this, expect that".

---

## 1. Pages and navigation

| Check | Expect |
| --- | --- |
| Open `/` | Homepage loads, no console errors |
| Open `/pricing`, `/faq`, `/request` | Each loads with its own title in the browser tab |
| Header links from every page | Pricing and FAQ visible at all screen widths and go to the right page |
| Header CTA | Always reads "Check availability" and lands on `/request` |
| Footer links | Pricing, FAQ and Check availability all work |
| Made-up URL, e.g. `/nope` | Friendly not-found page, not a blank screen |
| `/manual` | Printer manual opens inline |
| `/manual.pdf` | The PDF file itself loads/downloads |
| `/quickstart` | Quickstart page loads with its own styling |

## 2. Prices shown on the site

These must match everywhere they appear (home, pricing, FAQ, request form, `llms.txt`, structured data):

- Printer: **$100 per day**
- Prepaid media kit: **$100 flat, up to 400 4×6 prints** (6×8 and 5×7 on request)
- WCMPlus print server: **$35 per day**
- Refundable deposit: **$200**
- Sales tax applies to the rental and add-ons, **never to the deposit**

Search the project for `$95`, `$75`, `$0.40` and bare "400 prints" — there should be no matches.

## 3. Request form — dates

| Check | Expect |
| --- | --- |
| Open the calendar | Past days cannot be clicked |
| Click a booked (struck-through) day | Cannot be selected |
| Select a range that spans a booked day | Range clears with "Those dates cross a booked day…" |
| Pick a pickup date | The Return slot gets the highlighted underline |
| Pick both dates | Header shows "Wed, Sep 23 → Fri, Sep 25" style values and an "{n} days" pill |
| Card footer | Legend (Available / Booked) on the left, "Synced …" on the right with a hover timestamp |
| Availability older than 24h | Right side reads "Synced … · we'll confirm by email", no warning colors |
| Availability file unreachable | Blue note appears: pick dates anyway, we'll confirm by email; calendar still usable |
| Width under 400px | Footer wraps to two left-aligned lines |

## 4. Request form — estimate

| Check | Expect |
| --- | --- |
| No dates selected | Only "Estimate" and "Pick your dates to see an estimate." — no dollar amounts |
| 3-day range, nothing else | Printer $300, tax $26.63, total $326.63, deposit $200, due before pickup $526.63 |
| Add the print server | Extra line "Print server · 3 days × $35" = $105, totals update |
| Add one 4×6 media kit | Extra line $100, totals update |
| Deposit line | Never taxed; always $200 |
| Disclaimer | Present: an estimate, not a confirmed booking; no card or processing fees |

## 5. Request form — options

| Check | Expect |
| --- | --- |
| Add-ons on load | Media kit checkbox unchecked, no size choices visible |
| Check "Add a prepaid media kit" | Size options (4×6, 6×8, 5×7) and a counter starting at 1 appear |
| Counter | Cannot go below 0 or above 4; buttons disable at the limits |
| Choose 5×7 | Special-order note appears |
| Uncheck the media kit | Size choices disappear and kits go back to 0 |
| Choose "From devices (wireless/ethernet)" | Muted line about the WCMPlus print server appears; the add-on is **not** auto-checked |
| Check the print server | That muted line goes away |

## 6. Request form — contact and submit

| Check | Expect |
| --- | --- |
| "How should we reach you?" | Defaults to Email |
| Email selected | Phone label is "Phone", form submits with it empty |
| Text selected | Label "Mobile number for texts *", required, plus "We'll only text about this rental." |
| Call selected | Label "Best number to call *", required, plus a "Best time to call" field |
| Submit with a 6-digit phone under Text | Red message about 10 digits, nothing sent |
| Submit with no dates | "Please choose both a pickup and return date." |
| Testimonial | Pull quote sits directly above the submit button |
| Successful submit | "Request sent" heading with wording matching the chosen contact method; email address shown correctly |
| "Submit another request" | Form returns empty with Email preference and no dates |
| Real end-to-end send | An email arrives with subject like "[Text] Sep 23–25 · 3 days · $526.63 · Sam K." |

## 7. Accessibility and responsive

- Tab from the top of any page: the skip link appears and jumps to the main content.
- The whole request form can be completed with the keyboard alone, including the calendar and the Email/Text/Call toggle.
- Error messages are announced (they use `role="alert"` / `aria-describedby`).
- Check at ~375px, ~768px and ~1280px: nothing overlaps, is cut off, or scrolls sideways.

## 8. Search and sharing

- `/robots.txt`, `/sitemap.xml`, `/llms.txt` all load.
- Each page has a unique title and description; social preview looks right when a link is pasted.
- Structured data: run the Rich Results Test on `/` and `/pricing` — every Product still has an `offers` block, no errors.
- After a publish that changes prices, resubmit the sitemap and request re-indexing in Search Console.

---

## Automated coverage

| File | Covers |
| --- | --- |
| `src/lib/quote.test.ts` | Day counting, printer/server/media pricing, tax rounding, untaxed deposit, invalid dates |
| `src/lib/availability.test.ts` | Parsing blocked dates and horizon; missing, malformed, seed and failed fetches fall back to "unknown" |
| `src/lib/pricingData.test.ts` | Published prices and the 4×6 media note stay put |
| `src/components/request/RequestForm.test.tsx` | Empty estimate state, itemized estimate, media kit opt-in and limits, print method hint, conditional phone rules, submit payload and success screen |

Playwright is used ad hoc for visual and end-to-end spot checks; it is not part of the build.
