# Tighten the /request date-picker section (layout only)

Scope: `src/components/request/RequestForm.tsx` only. No changes to availability logic, quote math, Formspree payload, disabled-date rules, or the "unknown" highlight-box behavior. Add `RefreshCw` to the existing `lucide-react` import.

## 1. Move the helper text above the calendar

Today the string `"Choose a pickup date, then a return date."` only appears as the empty-state of the dynamic `selectedRangeText` paragraph that sits *below* the calendar.

- Add a new static `<p className="text-sm text-muted-foreground">Choose a pickup date, then a return date.</p>` directly under the `<legend>` "Pickup and return dates *", above the calendar (and above the `unknown` highlight-box, whose rendering is unchanged).
- The existing `selectedRangeText` paragraph below the calendar now renders **only when a range is selected** (`{selectedRange?.from && selectedRange.to && (...)}`), so the empty-state phrase is no longer duplicated; the live summary ("Mon Sep 21 to Wed Sep 23 · 3 days") still appears with `aria-live="polite"` when dates are chosen.

## 2. Footer inside the bordered card

Wrap the `<Calendar>` and a new footer in one bordered card so the footer lives inside the same border:

```text
<div className="rounded-lg border border-border bg-card overflow-hidden">
  <div className="flex justify-center overflow-x-auto">
    <Calendar ... />            ← unchanged props/modifiers
  </div>
  <div className="border-t border-border pt-3 mt-2 px-3 pb-3 flex justify-between items-center text-xs text-muted-foreground gap-2 max-[399px]:flex-col max-[399px]:items-start">
    …legend…                   ← left
    …sync…                     ← right (only when ready)
  </div>
</div>
```

Remove the old legend block (the two dot-icon spans) and the `Availability updated {relativeTime}` paragraph from their current positions below the card — they now live in the footer.

## 3. Legend (left) — swatches match day cells exactly

Replace the dot icons with a sample `23` rendered like the Calendar's own day cells (`h-9 w-9 rounded-md text-sm font-normal`, mirroring the `day`/`cell` classes in `src/components/ui/calendar.tsx`):

```text
<span> /* available swatch */  className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-normal"            23 </span> Available
<span> /* booked swatch */     className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-normal text-muted-foreground opacity-50 line-through"  23 </span> Booked
```

- Available swatch: ghost-day look (transparent bg, normal foreground) — same as an available day.
- Booked swatch: adds `text-muted-foreground opacity-50 line-through` — same as `day_disabled` + the `booked` modifier already applied to the calendar.
- No dot icons. Wrap each pair as `inline-flex items-center gap-1.5`; the two pairs sit in an `inline-flex items-center gap-3`.

## 4. Sync line (right) — only when `availability.status === "ready"`

```text
<RefreshCw className="w-3 h-3" />
<span title="{full timestamp}">Synced {relativeTime(availability.generated)}</span>
```

- `title` attribute carries the full timestamp for hover: `new Date(availability.generated).toLocaleString()` (`generated` is an ISO string, e.g. `2026-09-20T14:03:00.000Z`).
- Reuse the existing `relativeTime` helper for the visible "Synced …" text.

### Stale (>24h) variant

Compute `isStale = Date.now() - new Date(availability.generated).getTime() > 24*60*60*1000` (only meaningful when ready). When stale, the right-side text becomes:

```text
Synced {relativeTime} · we'll confirm by email
```

Same muted style, no warning colors. The icon and title stay.

## 5. Narrow screens (<400px)

`max-[399px]:flex-col max-[399px]:items-start` on the footer makes it wrap to two lines — legend first, sync second — both left-aligned. At ≥400px it stays a single `justify-between` row.

## Out of scope (unchanged)
- `useAvailability`, `isDisabledDate`, `rangeCrossesBlockedDate`, `handleRangeSelect`, the Formspree payload, the estimate panel, add-ons, success state.
- The `unknown` highlight-box still renders in the same place with the same copy.
- No new files, no route/SEO/Header/Footer changes, no price or logic edits.
