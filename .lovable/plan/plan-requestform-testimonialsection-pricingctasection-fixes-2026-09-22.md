# Plan: RequestForm, TestimonialSection, PricingCTASection fixes

## 1. Formspree submission (`src/components/request/RequestForm.tsx`)

- Add `Accept: "application/json"` to the fetch headers (line ~211):
  `headers: { "Content-Type": "application/json", Accept: "application/json" }`
- In the `catch` block (line ~246), capture the error and `console.error` it:
  `catch (error) { console.error(error); trackFormError(); ... }`

No other changes to the fetch/payload.

## 2. Print server auto-check tracking (`src/components/request/RequestForm.tsx`)

Add state near the other `useState` calls:
`const [serverAutoChecked, setServerAutoChecked] = useState(false);`

Rework `handlePrintMethodChange`:
- `value === "devices"`: set `printServer: true` and `serverAutoChecked: true`.
- otherwise: if `serverAutoChecked` is true, set `printServer: false` and `serverAutoChecked: false`; if the user had checked it themselves (`serverAutoChecked` false), leave `printServer` alone.

In the print server `Checkbox` `onCheckedChange` (line ~482), set `serverAutoChecked` to `false` whenever the user toggles it by hand (in addition to the existing `printServer` update).

This preserves the existing behavior that manually unchecking while staying on devices leaves it unchecked, and extends it so leaving devices clears an auto-checked server.

## 3. Calendar during load (`src/components/request/RequestForm.tsx`)

In `isDisabledDate` (line ~122), always disable dates before `todayYmd()` regardless of `availability.status`. Keep the blocked-date and horizon checks gated on `status === "ready"`:

```
const isDisabledDate = (date: Date) => {
  const value = toYmd(date);
  if (value < todayYmd()) return true;
  if (availability.status !== "ready") return false;
  return value > availability.horizonEnd || blockedDates.has(value);
};
```

## 4. Testimonial selection by id, not index (`src/components/request/RequestForm.tsx`)

Replace both `testimonials[1]` usages (lines ~605, ~607, ~608) with:
```
const testimonial = testimonials.find((t) => t.id === "admiration-2026-09");
```
Render the pull-quote block only when `testimonial` exists, reading `pullQuote`, `name`, `company` from it. (Keep `admiration-2026-09` per the request — this is the request-page pull quote, unchanged from its current testimonial.)

## 5. `PricingCTASection.tsx`

- Change the `find` from `"admiration-2026-09"` to `"eastview-2026-09"`.
- Replace the hardcoded `"Sam K., Admiration"` with:
  `{testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ""}`

## 6. `TestimonialSection.tsx`

- Add `mt-auto` to the `<figcaption>` so both cards' attributions align on the same baseline (quote pushes attribution down).
- Move the context `<p>` inside the `<figcaption>`, after the name/company span, keeping `text-xs text-muted-foreground mt-1`.

## 7. Small cleanups (`src/components/request/RequestForm.tsx`)

- Delete the empty spacer at line ~297:
  `{formData.printMethod !== "unsure" && <div className="mb-4" />}`
- On the "Kits (N prints each)" `Label` (line ~453): remove `htmlFor="media-kits"`.
- On the stepper container `<div>` (line ~456): replace `id="media-kits"` with `aria-label="Media kits"` (remove the `id`).

## Verification

- `tsgo --noEmit` and `npm run build` pass.
- Run the Vitest suite (30 tests); update tests only if a selector relied on `id="media-kits"` or the spacer.
- Playwright: `/request` calendar disables past dates even before availability loads; device → computer clears auto-checked server; submission still posts to Formspree with JSON accept header.
- Playwright: `/pricing` CTA shows East View quote + company-only attribution; homepage cards align attributions on the same baseline.

## Out of scope
- No changes to `quote.ts` pricing math.
- No copy changes beyond what's named here.
- `/request` testimonial content stays as the Admiration pull quote.
