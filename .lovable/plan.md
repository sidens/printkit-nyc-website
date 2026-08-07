# Update Form Submission Confirmation Text

## Goal
Correct the post-submission message in the rental request form so it accurately reflects the actual workflow: the form email goes to the business owner, who then replies to the customer via text message.

## Current State
`src/components/request/RequestForm.tsx` shows the following confirmation text after a successful submission:

```text
Check your email client — your rental request should be ready to send.
We'll respond within 24 hours with availability and next steps.
```

This text incorrectly tells the user to check their email and implies the business will respond via email.

## Proposed Change
Replace the confirmation paragraph with a message that tells the user to expect a text-message reply without committing to a 24-hour response time.

Suggested copy (flexible):

```text
Request received! We'll review your dates and send you a text message
with availability and next steps as soon as we can.
```

## Implementation Steps
1. Edit `src/components/request/RequestForm.tsx` (lines 91–93) to replace the existing confirmation paragraph with the updated text.
2. Verify the change by viewing the component and running a build check.

## Open Question
What response-time wording would you prefer? A few options:

- **No timeframe:** "as soon as we can"
- **Business hours:** "within 1–2 business days"
- **Same-day intent:** "as soon as possible, usually same day"
- **Custom text:** tell me exactly what you'd like it to say

Let me know and I'll lock in the final wording.
