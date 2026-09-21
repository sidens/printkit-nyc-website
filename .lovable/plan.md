# Standardize required/optional indicators on /request

Make the form's required-vs-optional cues consistent. **Copy and label
attributes only** — no pricing, availability, validation, Formspree, or layout
changes. All edits in `src/components/request/RequestForm.tsx`.

## Current state (verified)

The form uses three different conventions at once:
- `*` suffix on required field labels: "Pickup and return dates *", "Full name
  *", "Email *", and dynamically on phone ("Mobile number for texts *",
  "Best number to call *").
- "(optional)" in two section legends: "How will you print? (optional)" and
  "Add-ons (optional)".
- Bare labels with no marker for other optional fields: "What's this for?",
  "Anything else we should know?", "Best time to call".

This mix makes it unclear which fields are actually required.

## Approach

Standard web convention: **mark required fields with `*`, leave optional
fields unmarked.** Remove all "(optional)" text from legends and labels. This
is the W3C-recommended pattern — mark one (required) or the other (optional),
never both, and `*` for required is the most widely understood cue.

## Changes (all in `src/components/request/RequestForm.tsx`)

### 1. Section legends — remove "(optional)"

- Line 369: `How will you print? (optional)` → `How will you print?`
- Line 388: `Add-ons (optional)` → `Add-ons`
- Line 389 helper text already says "Both are optional." — keep as-is.

### 2. Phone label — remove "(optional)" suffix

- Line 528: the email-preference branch `Phone (optional)` → `Phone`
- The text and call branches already use `*` and stay unchanged.

### 3. Optional field labels — add no markers

These already have no marker, so they stay as-is:
- "What's this for?" (line 557)
- "Anything else we should know?" (line 562)
- "Best time to call" (line 551)

### 4. Required field labels — already use `*`, keep as-is

- "Pickup and return dates *" (line 308)
- "Full name *" (line 488)
- "Email *" (line 492)
- "Mobile number for texts *" / "Best number to call *" (lines 525, 527)

## Out of scope

- No changes to validation, `required` HTML attributes, Formspree payload,
  pricing, availability, or layout.
- The "Your details" heading (line 484) and "Estimate" heading stay bare.

## Verify

- Build passes (check `/tmp/observability/build-errors.log`).
- Playwright against `/request`: visually confirm no "(optional)" text remains
  anywhere on the form, `*` markers are present on required fields only, and
  optional fields have no marker.
