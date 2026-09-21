# Simplify the contact-method section of the request form

## Problem

The request form collects a **required** phone number and then shows a single checkbox: "It's okay to text me at this number about my rental." That reads ambiguous — a "No" doesn't say whether the renter wants a call or just email, and it doesn't let anyone state a preference.

The fix doesn't need three options. Email is your default channel; the only real question worth asking is whether they'd rather get a text instead.

## The simple change

Replace the "OK to text" checkbox with one two-option question:

```text
Phone number *          [required tel input — unchanged]

How should we reply?
( ● Email   ○ Text me instead )
```

- Two radio options: **Email** (pre-selected, the default) and **Text me instead**.
- Phone number stays **required** — you need it on file regardless, and it's what a text reply uses.
- No "call" option. No extra helper text. One line, one choice.

This matches the spirit of the feedback ("prefer a call or a text") without adding a full contact-method picker.

## Implementation — `src/components/request/RequestForm.tsx`

- Replace `smsOk: boolean` state with `preferredContact: "email" | "text"`, default `"email"`.
- Swap the checkbox for a two-option `RadioGroup` (Email / Text me instead), Email pre-selected.
- Phone field, label, and 10-digit validation all stay exactly as-is.
- `resetForm()` resets `preferredContact` to `"email"`.

### Formspree payload

Replace `"OK to text": "Yes" | "No"` with:

```text
"Preferred reply": "Email" | "Text"
```

No other payload keys change.

### Confirmation copy (this file only)

The success message leads with email now: "reply by text message (or email)" → "reply by email — or by text if you chose that — within 1–2 business days."

## Out of scope

- No "call" option, no three-way picker.
- Phone stays required for everyone.
- No changes to `CTASection.tsx`, `llms.txt`, or any other page — those still say "text message or email," which remains true (you offer both).
- No changes to dates, add-ons, estimate, or any other form section.

## Technical notes

- Single file: `src/components/request/RequestForm.tsx`.
- Reuses the already-imported `RadioGroup` / `RadioGroupItem`.
- No new dependencies, no logic changes elsewhere.

## Verification

1. Build passes.
2. Playwright: Email pre-selected on load; selecting "Text me instead" works; phone still required; a valid submit sends `"Preferred reply"` with the right value.
3. Grep confirms no `smsOk` / `"OK to text"` references remain.
