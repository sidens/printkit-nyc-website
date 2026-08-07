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
Replace the confirmation paragraph with a message that tells the user to expect a text-message reply within 1–2 business days.

Final copy:

```text
Request received! We'll review your dates and send you a text message
within 1–2 business days with availability and next steps.
```

## Implementation Steps
1. Edit `src/components/request/RequestForm.tsx` (lines 91–93) to replace the existing confirmation paragraph with the final text above.
2. Verify the change by viewing the component and running a build check.

## Acceptance Criteria
- The confirmation screen no longer mentions email.
- The confirmation screen tells the user to expect a text message.
- The response timeframe is stated as "1–2 business days".
