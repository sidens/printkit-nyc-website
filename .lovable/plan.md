# Rework the contact section on the request page

All changes stay in the request form. Dates, availability and the cost estimate keep working exactly as they do today.

## New order of the form

1. Pickup and return dates (calendar card)
2. How will you print?
3. Add-ons
4. Estimate
5. Customer quote
6. Your details (contact)
7. Send button

## How will you print? (optional)

Three choices: From a computer (USB) · From devices (wireless/ethernet) · Not sure yet.

If someone picks the wireless/ethernet option and has not added the print server, a single muted line appears underneath: "Printing from devices needs the WCMPlus print server — add it below." Nothing is checked automatically.

## Your details

- Full name (required)
- Email (required)
- "How should we reach you?" — three equal buttons: Email · Text · Call, with Email chosen by default. Under them, small muted text: "Your itemized quote always comes by email. This is for quick questions and pickup day."
- Phone changes with the choice:
  - Email: "Phone (optional)" — no validation
  - Text: "Mobile number for texts *" — required, plus "We'll only text about this rental."
  - Call: "Best number to call *" — required, plus an optional "Best time to call" box with placeholder "e.g. weekday evenings"
- "What's this for?" and "Anything else we should know?" follow the phone field.

The old "It's okay to text me" checkbox goes away, replaced by the Email/Text/Call choice. No marketing or newsletter opt-ins.

## What you receive by email

The request email keeps the same destination and gains the contact preference, best time to call, and print method. The subject line becomes scannable, for example:

```text
[Text] Sep 23–25 · 3 days · $526.63 · Sam K.
```

## Confirmation screen

Heading becomes "Request sent". The message matches their choice:

- Email: "We'll email you at {email} within 24 hours with availability and your itemized quote."
- Text: "We'll text you at {phone} within 24 hours. Your itemized quote will come by email to {email}."
- Call: "We'll call you at {phone} within 24 hours, around {best time}. Your itemized quote will come by email to {email}."

Any "check your email client" wording is removed.

## Technical notes

- Single file: `src/components/request/RequestForm.tsx`.
- State: replace `smsOk` with `contactPreference: "email" | "text" | "call"` (default `email`), add `bestTimeToCall` and `printMethod` (optional, empty default).
- Phone validation (10+ digits) runs only when preference is `text` or `call`; the input's `required` attribute follows the same rule.
- Segmented toggle built from existing UI primitives with `role="radiogroup"` semantics and visible focus rings; equal-width grid of three.
- Formspree payload (same endpoint `mqeezrqr`) keeps all current keys except "OK to text"; adds `contactPreference`, `bestTimeToCall`, `printMethod`, and a computed `_subject` using `date-fns` short month formatting of the selected range and `dueAtPickup` money formatting.
- Success view reads from a small helper that returns the copy for the active preference; `resetForm` resets the new fields.
- No pricing, quote, availability, or add-on logic is touched.
