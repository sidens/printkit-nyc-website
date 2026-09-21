# Codify contact preferences: email default + opt-in text/call

## The contradiction you raised

Requiring a phone number *and* separately asking "is it okay to use it?" is contradictory — from the renter's side, why hand over a phone number if they haven't granted permission? The clean fix is to tie the two together: **the phone number is only required once they've opted into text or call.**

## The model

- **Email is the baseline reply.** You always reply by email, so email + name are the only always-required fields.
- **Text and call are opt-in permissions**, added on top of email. The renter checks whichever they're comfortable with (either, both, or neither).
- **Phone becomes conditionally required** — only when at least one of "Text me" or "Call me" is checked. If they check neither, the phone field is optional and can be left blank. That makes the phone requirement coherent: you only ask for it when they've granted a use for it.

This preserves what you liked about the original checkbox (email *plus* text when approved) and adds an explicit call opt-in, since you won't call someone unless they want it.

## The change

```text
We'll reply by email. Want a faster option? You can also:
[ ] Text me at this number          [ phone input appears/becomes required ]
[ ] Call me at this number
```

Details:
- "We'll reply by email." sets the expectation up front.
- Two checkboxes, both default unchecked, toggle independently.
- Name and Email stay always-required (unchanged).
- Phone field sits with the checkboxes. It's **optional** until at least one checkbox is checked, then it becomes **required** + keeps its 10-digit validation and error message.
- If the renter unchecks both, phone returns to optional and any existing phone error clears.
- No radio group, no forced single choice.

## Implementation — `src/components/request/RequestForm.tsx`

- State: keep `smsOk: boolean`, add `callOk: boolean`, both default `false`.
- Phone `required` is now dynamic: `required={smsOk || callOk}`.
- In `handleSubmit`, only run phone validation when `smsOk || callOk`. If both unchecked, skip phone validation entirely (allow empty).
- Replace the existing checkbox block with the "We'll reply by email." line plus the two checkboxes and the phone input grouped together.
- Phone field label: "Phone number" (drop the `*` when optional; show `*` only when `smsOk || callOk`).
- `resetForm()` resets both checkboxes to `false` (phone goes back to optional).

### Formspree payload

Keep `"OK to text"` and add `"OK to call"`:

```text
"OK to text": "Yes" | "No"     (unchanged)
"OK to call": "Yes" | "No"     (new)
```

Phone still sends whatever was entered (empty string if blank). No other payload keys change.

### Confirmation copy (this file only)

Lead with email: "reply by text message (or email)" → "reply by email — and by text or call if you checked those — within 1–2 business days."

## Out of scope

- No radio group / contact-method picker.
- No changes to `CTASection.tsx`, `llms.txt`, or any other page — "text message or email" there remains accurate.
- No changes to dates, add-ons, estimate, or any other form section.

## Technical notes

- Single file: `src/components/request/RequestForm.tsx`.
- Reuses the existing `Checkbox` and `Input` components (already imported).
- No new dependencies, no logic changes elsewhere.

## Verification

1. Build passes.
2. Playwright:
   - Load form: both checkboxes unchecked, phone optional, submit works with empty phone.
   - Check "Text me": phone becomes required; submit with empty phone shows the error; submit with valid phone succeeds.
   - Check only "Call me": phone required; submit succeeds with valid phone.
   - Uncheck both: phone optional again, error clears.
3. Grep confirms the old single "It's okay to text me…" label is gone and replaced by the new block.
