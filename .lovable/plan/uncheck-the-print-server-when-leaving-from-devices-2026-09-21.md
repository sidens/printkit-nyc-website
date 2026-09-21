# Uncheck the print server when leaving "From devices"

Single-line behavior tweak in `src/components/request/RequestForm.tsx`. No pricing, availability, estimate, copy, payload, or layout changes.

## What changes

`handlePrintMethodChange` currently auto-checks the print server only when transitioning into "devices", and leaves it untouched when moving away:

```ts
const handlePrintMethodChange = (value: string) => {
  setPrintMethodError("");
  setFormData((current) => ({
    ...current,
    printMethod: value,
    printServer: value === "devices" && current.printMethod !== "devices" ? true : current.printServer,
  }));
};
```

New rule:

- Selecting "From devices (wireless/ethernet)" still auto-checks the print server (only at the moment of selection, as today).
- Selecting "From a computer (USB)" or "Not sure yet" **unchecks the print server** if it was checked.

This keeps the existing "user can manually uncheck after auto-check" behavior intact: the auto-uncheck only fires on the print-method change, not while staying on devices. A user who manually re-checks the server while on computer/unsure is not affected unless they switch print methods again.

## Implementation

Replace the `printServer` line in `handlePrintMethodChange` so the value is derived from the transition:

- `value === "devices"` → `true` (entering devices, auto-check)
- `value !== "devices"` → `false` (leaving devices, auto-uncheck)

```ts
const handlePrintMethodChange = (value: string) => {
  setPrintMethodError("");
  setFormData((current) => ({
    ...current,
    printMethod: value,
    printServer: value === "devices",
  }));
};
```

Note: this intentionally does not preserve a user's manual re-check across a print-method switch — switching methods resets the server to match the method's default. This matches the requested behavior ("if 'from devices' is selected and then moved off to the other options, the print server checkbox un-selects").

## Files touched

- `src/components/request/RequestForm.tsx` — `handlePrintMethodChange` only.

## Verification

- Run the Vitest suite; the existing "auto-checks the print server for device printing but respects unchecking" test should still pass (it clicks devices → server checked; clicks server → unchecked; no move-off step is asserted there).
- Spot-check `/request` in the browser: select "From devices" (server auto-checks), select "From a computer (USB)" (server auto-unchecks), select "From devices" again (server auto-checks), manually uncheck, select "Not sure yet" (server stays unchecked).
