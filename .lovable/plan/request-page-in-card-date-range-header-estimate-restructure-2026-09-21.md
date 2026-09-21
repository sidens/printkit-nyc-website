# Request page: in-card date-range header + estimate restructure

Restructure how the selected date range is shown on `/request`.
**Layout and copy only.** No pricing math, availability logic, Formspree payload,
or validation changes. All edits are in `src/components/request/RequestForm.tsx`
only. Prices stay $100/day, $100 media kit, $35/day server, $200 deposit.

## Current state (verified)

The card at lines 288–302 wraps only the `<Calendar>`. Below the card sit:
- a standalone `<p aria-live="polite">{selectedRangeText}</p>` (line 303),
  whose `selectedRangeText` const (lines 227–229) reads
  `"{start} to {end} · {n} days"` or, when empty, `"Choose a pickup date, then a return date."`;
- a dot-based legend ("Available" / "Already booked") at lines 305–308;
- an "Availability updated {relativeTime}" line at 309–311, only when ready.

`quote.days` is `0` exactly when no full range is selected (see `quote.ts`).
The Estimate card (lines 375–395) always renders the subtotal/tax/total/deposit/
dueAtPickup block even when `quote.days === 0`, and shows
"Choose your dates to calculate the rental." as the no-range muted line.

## Changes

### 1. Imports
Add `ArrowRight` and `RefreshCw` to the `lucide-react` import (line 11).
`ArrowRight` is new; `RefreshCw` was not previously imported.

### 2. New derived values (replace the `selectedRangeText` const, lines 227–229)
```ts
const hasFullRange = !!(selectedRange?.from && selectedRange.to);
const pickupActive = !selectedRange?.from;
const returnActive = !!selectedRange?.from && !selectedRange?.to;
const pickupText = selectedRange?.from ? format(selectedRange.from, "EEE, MMM d") : "Select date";
const returnText = selectedRange?.to ? format(selectedRange.to, "EEE, MMM d") : "Select date";

const syncedTitle = availability.generated ? new Date(availability.generated).toLocaleString() : "";
const syncedText = availability.generated ? `Synced ${relativeTime(availability.generated)}` : "";
const isStale =
  availability.status === "ready" &&
  !!availability.generated &&
  Date.now() - new Date(availability.generated).getTime() > 24 * 60 * 60 * 1000;
```
This removes the `selectedRangeText` const entirely, which satisfies
**instructions #1 and #2** (the standalone line and the "Choose a pickup date…"
helper text both come from that const and its `<p>`).

### 3. Calendar card restructure (replace lines 288–311)
Card becomes three stacked regions inside one bordered container:

```
┌─────────────────────────────────────────────┐
│ PICKUP                RETURN        [n days]│  ← header row
│  Wed, Sep 23    →    Fri, Sep 25            │
├─────────────────────────────────────────────┤  border-t
│              <Calendar grid>                │
├─────────────────────────────────────────────┤  border-t
│ 23 Available   23 Booked     ↻ Synced 2h ago │  ← footer row
└─────────────────────────────────────────────┘
```

**Header row** — `flex items-center gap-3 px-3 pt-3`, wraps to column under 400px
(`max-[399px]:flex-col max-[399px]:items-start`):
- Inner slots group: `flex items-center gap-3 flex-1` (always stays side by side).
  - Pickup slot: `<p className="text-xs tracking-wide text-muted-foreground uppercase">Pickup</p>`
    then `<p className="text-base font-medium">{pickupText}</p>` ("Select date"
    renders muted via `text-muted-foreground` when empty).
  - `<ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />`.
  - Return slot: same structure with "Return" / `{returnText}`.
  - Active slot gets `border-b-2 border-primary` on its wrapper div.
    `pickupActive` when no `from`; `returnActive` when `from` set but no `to`;
    neither active when both filled. Inactive slots have no bottom border.
- Days pill (only when `hasFullRange`):
  `<span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
    {quote.days} {quote.days === 1 ? "day" : "days"}</span>`.
  On <400px it drops to its own line under the slots (the column wrap).

**Grid** — `<div className="border-t border-border flex justify-center overflow-x-auto">`
wrapping the existing `<Calendar>` unchanged (mode, selected, onSelect, disabled,
modifiers, modifiersClassNames all untouched).

**Footer row** (the previously-approved layout now placed inside the card) —
`border-t border-border pt-3 mt-2 px-3 pb-3 flex justify-between items-center text-xs text-muted-foreground gap-2 max-[399px]:flex-col max-[399px]:items-start`:
- Legend (`aria-label="Availability legend"`): two inline swatches, no dots.
  - Available: `<span className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-normal">23</span>` then "Available".
  - Booked: same swatch classes plus `text-muted-foreground opacity-50 line-through`, then "Booked".
- Sync line, only when `availability.status === "ready"`:
  `<span className="inline-flex items-center gap-1.5" title={syncedTitle}>`
  with `<RefreshCw className="w-3 h-3" />` and text
  `isStale ? `${syncedText} · we'll confirm by email` : syncedText`.

Keep the `availability.status === "unknown"` highlight box (lines 283–287) exactly
as-is, above the card. Keep the `dateError` `<p role="alert">` in the fieldset,
below the card.

### 4. Estimate card (replace lines 375–395)
- Heading stays: `<h2 id="estimate-heading">Estimate</h2>`.
- No-range muted line text changes from
  "Choose your dates to calculate the rental." to
  **"Pick your dates to see an estimate."**
- When `quote.days > 0`, directly under the heading add two lines:
  - `<p className="text-sm font-medium">`
    `{format(selectedRange.from, "EEE MMM d")} → {format(selectedRange.to, "EEE MMM d")} · {quote.days} {quote.days === 1 ? "day" : "days"}`
    (uses the → arrow character).
  - `<p className="text-xs text-muted-foreground">Pickup and return days both count.</p>`
- Gate the entire line-items + totals block (the `<div className="space-y-3 text-sm">`
  with printer/server/media rows, subtotal/tax, total/deposit/dueAtPickup) behind
  `quote.days > 0`. When no range, none of it renders — no zero-dollar lines.
- Gate the disclaimer `<p>` ("An estimate, not a confirmed booking…") behind
  `quote.days > 0` as well, so the no-range card shows **only** the heading and the
  one muted line.

## Out of scope
- No changes to `quote.ts`, `availability.ts`, Formspree payload keys, validation,
  the add-ons fieldset, or any other file.
- The Calendar's `mode`, `onSelect`, `disabled`, `modifiers`, and
  `modifiersClassNames` props are untouched.
- Pricing values are unchanged.

## Verify
- Build passes (check `/tmp/observability/build-errors.log`).
- Playwright against `/request` with a mocked "ready" `availability.json`:
  - No range: header shows Pickup "Select date" (active border) → Return "Select date"; Estimate card shows only heading + "Pick your dates to see an estimate."
  - After picking a range: header shows "Wed, Sep 23 → Fri, Sep 25" with a "3 days" pill; Estimate shows the range summary line + "Pickup and return days both count." then line items.
  - Active border moves Pickup → Return → none as selection fills.
  - Under 400px: slots stay side by side, pill wraps to its own line; footer wraps to two lines.
  - Stale (>24h) sync text appends " · we'll confirm by email".
