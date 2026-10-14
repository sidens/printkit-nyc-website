# Add an optional "How did you hear about us?" field to the request form

## Goal

Capture lead source on `/request` with a low-friction, optional question so we
can learn where bookings come from. It must not add friction: no validation, no
required marker, skippable entirely.

## Proposed responses (dropdown)

A compact select — a long list of radio cards would overwhelm an optional
question. Options, tuned to a local Brooklyn pickup rental business:

- Google search
- Instagram
- Friend, family, or colleague
- Event planner or another vendor
- Saw the PrintKit at an event
- Other

Choosing **Other** reveals a small free-text input ("Where did you hear about
us?") so "Other" is still actionable data.

## Changes (all in `src/components/request/RequestForm.tsx`)

1. **State** — add `referralSource: ""` and `referralDetail: ""` to `formData`;
   reset both in `resetForm`.

2. **UI** — in the "Your details" section, add the field directly after
   "What's this for?" (before "Anything else we should know?"):
   - Label `How did you hear about us?` — bare, per the site's convention
     (only required fields get `*`).
   - The existing shadcn `Select` (`src/components/ui/select.tsx`) with
     placeholder `Select one` and the six options above.
   - When `Other` is selected, show a one-line `Input` for details beneath.
   - No `required`, no validation, no error states.

3. **Formspree payload** — add one key so the notification email stays
   readable:
   - `"How did you hear about us?"` → the option label, or
     `Other — {referralDetail}` when Other is chosen, or `Not specified` when
     skipped.

4. **Analytics** — pass the chosen source into the `generate_lead` event as a
   `referral` parameter so GA4 can attribute leads without a separate report
   dimension. (Small extension to the `trackGenerateLead` call site; the
   helper in `src/lib/analytics.ts` already accepts params.)

## Out of scope

- No new routes, pages, or backend.
- No changes to pricing, quote math, availability, validation, or the
  testimonial block.
- Tests updated only if an existing test asserts on form field order.

## Verification

- `tsgo --noEmit` and build pass; run the Vitest suite.
- Playwright on `/request`: the field is optional and skippable end to end —
  submit without it (success), then with each source; confirm the payload's
  "How did you hear about us?" value matches the selection, including the
  Other detail string.
