# Clarify the contact-method section of the request form

## Problem

The request form collects a **required** phone number and then shows a single checkbox: "It's okay to text me at this number about my rental." That's confusing because:

- A "No" on the checkbox doesn't say whether the renter wants a call or just email.
- Requiring a phone number reads oddly when your real default channel is email.
- A renter can't explicitly pick how they want to be contacted.

Feedback you received ("I love it when forms say would you prefer a call or a text") points at the fix, but your default channel is email and you still need to capture a phone number for everyone.

## What we'll change

Replace the single "OK to text" checkbox with a **preferred contact method** choice: **Email / Text / Phone call**, with **Email pre-selected** as the default. Phone stays required for everyone (you always want one on file).

### 1. Form contact section — `src/components/request/RequestForm.tsx`

Replace the `smsOk: boolean` state and its checkbox with a `preferredContact: "email" | "text" | "call"` field, default `"email"`.

New contact block layout (phone field stays as-is above it):

```text
Phone number *          [required tel input, 10-digit validation stays]

How would you like us to reply?
( ○ Email  ○ Text  ○ Phone call )   ← RadioGroup, Email pre-selected
```

Details:
- Use the existing `RadioGroup` / `RadioGroupItem` components (already imported).
- Label the group "How would you like us to reply?" with a one-line helper: "Email is our default — pick text or a call if you'd prefer."
- Phone number remains `required` and keeps its current 10-digit validation and error message for everyone.
- Keep the phone field label "Phone number *" so it's clear it's always needed.

### 2. Formspree payload — `src/components/request/RequestForm.tsx`

Replace the current `"OK to text": "Yes" | "No"` key/value with:

```text
"Preferred contact": "Email" | "Text" | "Phone call"
```

No other payload keys change. `_replyto` and `_subject` stay as-is.

### 3. Form reset — `src/components/request/RequestForm.tsx`

In `resetForm()`, set `preferredContact: "email"` (replacing the `smsOk: false` reset).

### 4. Confirmation + site copy consistency

Your default channel is now email, so lead with email everywhere the copy currently leads with "text message (or email)":

- `RequestForm.tsx` success message: "reply by text message (or email)" → "reply by email (or your preferred method) within 1–2 business days."
- `src/components/CTASection.tsx`: "reply by text message (or email)" → "reply by email (or your preferred method) within 1–2 business days."
- `public/llms.txt`: "reply by text message or email" → "reply by email (or your preferred method) within 1–2 business days."

The "1–2 business days" timeframe and the rest of those sentences stay unchanged.

## Out of scope

- Making phone optional (you want it required for everyone).
- Adding a dedicated /contact page.
- Changing the actual response workflow or response time.
- Touching the date picker, add-ons, estimate, or any other form section.

## Technical notes

- Single file for the form logic: `src/components/request/RequestForm.tsx`. Plus `CTASection.tsx` and `public/llms.txt` for the copy alignment.
- No new dependencies. Uses the existing `RadioGroup` import.
- No price, product, or availability-logic changes.

## Verification

1. Build passes (typecheck + Vite).
2. Playwright: open `/request`, confirm Email is pre-selected, selecting Text/Call works, phone stays required, and a valid submit sends `"Preferred contact"` with the right value in the Formspree payload.
3. Grep confirms no remaining bare `"OK to text"` or `smsOk` references, and no "reply by text message (or email)" copy left in the three updated locations.
