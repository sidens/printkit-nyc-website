# Request page availability calendar and estimate

## Goal
Rework the existing `/request` form in place so renters can choose a valid date range from live calendar availability, configure prepaid media and the print server, and see an itemized estimate before submitting.

## Implementation

### 1. Availability loader
Create `src/lib/availability.ts` with the documented availability shape and a `useAvailability` hook.

- Fetch `/availability.json` once when the form mounts.
- Return `ready` only for a valid, non-seed response; return `unknown` with no blocked dates for seed, network, or parsing failures.
- Expose the generated timestamp needed by the form’s “Availability updated …” line alongside `status`, `blocked`, and `horizonEnd`.
- Keep availability checks in `YYYY-MM-DD` string form and never persist or retry availability data.

### 2. Pure quote calculation
Create `src/lib/quote.ts` with the exact rates, media options, and one pure quote function.

- Count pickup through return inclusively using calendar-date string arithmetic, avoiding timestamp subtraction.
- Calculate printer, optional server, media, subtotal, tax, total, deposit, and due-before-pickup amount exactly as specified.
- Round only sales tax to two decimals and return all intermediate values without display formatting.

### 3. Date-range calendar
In `src/components/request/RequestForm.tsx`, replace both native date fields with the existing shadcn `Calendar` in range mode.

- Label it “Pickup and return dates” and keep it interactive with `pointer-events-auto`.
- Disable past dates, known blocked dates, and dates beyond the live horizon when availability is ready.
- Reject and clear a completed range crossing any blocked day, with the specified inline message.
- Show the formatted selected range and inclusive day count.
- Add Available / Already booked legend entries.
- Show the requested warning when availability is unknown; otherwise show the generated time as a relative update time.
- Preserve required-date validation and accessible error announcements.

### 4. Add-ons and media controls
Replace the current two add-on checkboxes with:

- A required print-size radio group for 4×6, 6×8, and 5×7, defaulting to 4×6, with exact yields and prices.
- A 0–4 media-kit stepper whose label follows the selected size’s yield.
- The single WCMPlus print-server checkbox at $35/day.
- The always-visible one-size-per-rental note and conditional 5×7 special-order notice, using the provided copy.

The submitted add-on model will change from the two legacy IDs to the new explicit `printSize`, `mediaKits`, and `printServer` fields requested here.

### 5. Live estimate and submission
Add a `card-elevated` estimate below the add-ons using existing semantic tokens and layout utilities.

- Show only nonzero item lines, followed by subtotal, NY sales tax, total, refundable deposit, and “Due before pickup.”
- Format currency only in the component.
- Use the supplied disclaimer with the agreed response timing changed to “within 1–2 business days.”
- Extend the existing Formspree payload with days, print size, kit count, server choice, subtotal, tax, total, due-before-pickup amount, and availability status.
- Keep the current endpoint and success state, rename the button to “Request these dates,” and retain a concise “No payment required now.” line.

## Verification
- Unit-check quote math for same-day, Friday–Sunday, and Friday–Monday rentals, all media sizes, tax exclusion of the deposit, and zero-line omission inputs.
- Verify ready, seed, malformed, and failed availability responses; past/horizon/booked disabling; and blocked-day range rejection.
- Exercise the complete form in desktop and mobile-sized browser views, inspect the Formspree request payload without submitting a real inquiry, and confirm the success flow remains intact through a mocked successful response.
- Confirm the build is clean and no weekly discounts, pay-per-print pricing, extra services, surcharges, deposit tax, or booking/confirmation claims were introduced.

## Scope
Only add `src/lib/availability.ts` and `src/lib/quote.ts`, and edit `src/components/request/RequestForm.tsx`. Do not change the route, page wrapper, SEO, header, footer, global styles, or other pages.
