# Request form: Formspree mapping + required phone

## What's happening today

The form posts JSON to `https://formspree.io/f/mqeezrqr` with these keys:
`name`, `email`, `phone`, `smsOk`, `pickupDate`, `returnDate`, `eventType`, `addons`, `notes`.

Two things worth fixing in that mapping:

1. **Add-ons send IDs, not labels.** The payload sends `prepaid-media, print-server` instead of the human-readable names and prices you see on the form. Your notification email is harder to read than it needs to be.
2. **Field names are camelCase.** Formspree uses the raw key as the label in the email, so you get "smsOk" and "pickupDate" instead of "SMS OK" and "Pickup date".

Everything else maps correctly — the endpoint ID matches the project's Formspree form, and the email field is present.

## Changes

**1. Friendlier Formspree field labels**

Send readable keys so the notification email reads cleanly:

| Sent as | Value |
| --- | --- |
| Name | full name |
| Email | email |
| Phone | phone |
| OK to text | Yes / No |
| Pickup date | date |
| Return date | date |
| Event type | text or "Not specified" |
| Add-ons | comma-separated labels, or "None" |
| Notes | text or "None" |

Also include Formspree's `_replyto` set to the submitter's email so replying to the notification goes straight to them, and `_subject` as `New PrintKit request — {name}` so requests are easy to spot in the inbox.

**2. Make phone required**

- Label becomes "Phone number *"
- Input gets `required`
- Light format validation: accept common US formats, show an inline error if the entered value has fewer than 10 digits, and block submit until it's valid.

**3. Verify end to end**

Submit a live test request through the preview with Playwright, confirm Formspree returns success, and confirm the payload shape in the network request.

## Technical notes

- Single file: `src/components/request/RequestForm.tsx`.
- Add-on labels come from the existing `addons` array in that file; map selected IDs back to labels before joining.
- Phone validation: strip non-digits, require >= 10, keep the raw string as typed in the payload.
- No backend, no new dependencies.
