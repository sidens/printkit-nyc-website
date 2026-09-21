# Codify contact preferences: email default + opt-in text/call

## The model you're describing

- **Email is the baseline.** You always reply by email.
- **Texting is an added permission**, not a replacement — the original checkbox let you do *both* email and text, and you want to keep that.
- **Calling is also an added permission** — you won't call someone out of the blue unless they've said it's okay.

So this isn't an either/or radio choice. It's: *email always, plus opt-in permission to text and/or call.* That preserves the original checkbox behavior while making email the clear default and giving an explicit call opt-in.

## The change

Keep the required phone field, then replace the single ambiguous checkbox with a short expectation line and two opt-in checkboxes:

```text
Phone number *        [required tel input — unchanged]

We'll reply by email. Also okay to:
[ ] Text me at this number
[ ] Call me at this number
```

- "We'll reply by email." sets the expectation up front (email is the default).
- Both checkboxes default **unchecked**. Checking either grants that permission *in addition to* email.
- Phone stays **required** — it's what a text or call uses, and you want one on file regardless.
- No radio group, no forced single choice.

## Implementation — `src/components/request/RequestForm.tsx`

- Keep `smsOk: boolean` (rename is optional; behavior unchanged) and add `callOk: boolean`, both default `false`.
- Replace the existing checkbox block with the "We'll reply by email." line plus the two checkboxes above.
- Phone field, label, and 10-digit validation stay exactly as-is.
- `resetForm()` resets both checkboxes to `false`.

### Formspree payload

Keep the existing `"OK to text"` key and add one new key:

```text
"OK to text": "Yes" | "No"     (unchanged)
"OK to call": "Yes" | "No"     (new)
```

No other payload keys change.

### Confirmation copy (this file only)

The success message can now lead with email: "reply by text message (or email)" → "reply by email — and by text or call if you checked those — within 1–2 business days."

## Out of scope

- No radio group / contact-method picker.
- Phone stays required for everyone.
- No changes to `CTASection.tsx`, `llms.txt`, or any other page — "text message or email" there remains accurate.
- No changes to dates, add-ons, estimate, or any other form section.

## Technical notes

- Single file: `src/components/request/RequestForm.tsx`.
- Reuses the existing `Checkbox` component (already imported).
- No new dependencies, no logic changes elsewhere.

## Verification

1. Build passes.
2. Playwright: both checkboxes render unchecked under "We'll reply by email."; each toggles independently; phone still required; a valid submit sends `"OK to text"` and `"OK to call"` with the right Yes/No values.
3. Grep confirms the old single "It's okay to text me…" label is gone and replaced by the new block.
