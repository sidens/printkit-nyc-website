# Make print media optional in the request form

## Goal
The print media block on `/request` currently forces a size selection (a 4×6/6×8/5×7 radio group with one always selected) plus a kit stepper, so it reads as required. The WCMPlus print server is a single unchecked checkbox and reads as optional. Make print media behave the same way: an opt-in checkbox, unchecked by default, that reveals the size and kit controls only when checked.

## Scope
Edit only `src/components/request/RequestForm.tsx`. No changes to `src/lib/quote.ts`, the route, SEO, Header, Footer, other pages, or the Formspree endpoint. Quote math is unchanged — media cost stays `kits × MEDIA[size].price`, so `kits = 0` (checkbox off) yields $0 media.

## Changes to `RequestForm.tsx`

### 1. New state: `mediaKitOptIn`
- Add `mediaKitOptIn: false` to `formData` (default unchecked, mirroring `printServer`).
- Reset it to `false` in `resetForm`.

### 2. Opt-in checkbox (replaces the current "Print media" legend block)
Replace the current `<fieldset>` legend `"Print media"` and the immediately-shown radio group + stepper with:
- A checkbox row identical in style to the print server row:
  - `Checkbox id="mediaKitOptIn"`, bound to `formData.mediaKitOptIn`.
  - Label: `"Add a prepaid media kit (optional)"`.
- Keep this inside the existing fieldset, before the print server checkbox, so both add-ons sit together as optional opt-ins.

### 3. Conditional media controls (only when opted in)
When `mediaKitOptIn` is true, render (with a left indent/inner spacing to show they belong to the kit):
- The existing `RadioGroup` for print size (4×6 / 6×8 / 5×7), unchanged.
- The existing "One size per rental…" note.
- The existing 5×7 special-order notice when `printSize === "5x7"`.
- The existing media-kits stepper (0–4).

When `mediaKitOptIn` is false, render none of the above.

### 4. Keep quote + payload correct when opted out
- The `calculateQuote` call already uses `formData.mediaKits`. Set `mediaKits` to `0` when the checkbox is unchecked and to `1` (the sensible minimum once opted in) when it is first checked, then let the stepper adjust from there. `printSize` keeps its last value (default `"4x6"`) so a later opt-in still has a valid size.
- Formspree payload: keep the existing `printSize` and `mediaKits` keys. When opted out, `mediaKits` is `0`; `printSize` stays the stored value. No new payload keys.

### 5. Estimate line
The estimate already hides the `Media kit` row when `quote.media === 0`, so an opted-out request shows no media line — consistent with the print server being hidden when unchecked.

## Verification
- Build/typecheck passes.
- Playwright on `/request`: media controls are hidden by default; checking "Add a prepaid media kit (optional)" reveals size + stepper and the estimate gains a media line; unchecking hides them and zeroes the media line. Formspree payload still contains `printSize` and `mediaKits` (0 when opted out).
