# Audit and tighten support claims across the site

## Current support promises found on the website

| Location | Exact claim | Potential overcommitment |
|----------|-------------|--------------------------|
| Homepage CTA (`CTASection.tsx`) | "We'll respond within 24 hours with availability and next steps." | Fixed 24-hour SLA; conflicts with form confirmation. |
| Request form confirmation (`RequestForm.tsx`) | "We'll review your dates and send you a text message within 1–2 business days with availability and next steps." | More realistic, but inconsistent with homepage. |
| "What's included" list (`KitSection.tsx`) | "Email support during rental" | Vague scope — what does "support" cover? |
| Homepage FAQ "What happens if something breaks?" (`FAQSection.tsx`) | "Contact us immediately via email or phone. We'll troubleshoot with you and, if needed, arrange a replacement or alternative solution." | Promises phone contact (no number shown), troubleshooting, and replacement/alternative solution. |
| FAQ page "What happens if something breaks or stops working?" (`faqData.ts`) | "If you run into issues during your rental, email support is available." | Less specific than homepage FAQ; inconsistent. |
| FAQ page "Can I add accessories later or change my rental?" (`faqData.ts`) | "Yes, as long as availability allows. Just reach out before pickup and we'll do our best to accommodate changes." | Reasonable, but "do our best" could be tightened. |
| `public/llms.txt` | "We review availability and confirm quickly." | Vague "quickly"; also lists `hello@printkitnyc.com` as contact. |
| Request page metadata (`Request.tsx`) | "Quick response, easy booking process." | Vague "quick response." |
| `LocalBusinessSchema.tsx` | Email `hello@printkitnyc.com` | Accurate, but no phone number despite phone being mentioned elsewhere. |

## Issues to fix

1. **Response-time conflict:** Homepage says 24 hours; form confirmation says 1–2 business days.
2. **Phone support without a phone number:** Homepage FAQ mentions "email or phone" but no phone number is displayed anywhere on the site or in schema.
3. **Replacement promise:** "Arrange a replacement or alternative solution" implies spare inventory and on-call logistics.
4. **Vague support scope:** "Email support during rental" doesn't clarify whether it's setup help, troubleshooting, or general questions.
5. **Inconsistent FAQ answers:** Homepage FAQ and `/faq` page give different answers to the same breakage question.
6. **LLMs.txt / metadata still imply speed:** "confirm quickly" and "quick response" add implicit pressure.

## Proposed revised support language

- **Response time everywhere:** Standardize on "within 1–2 business days" and clarify that it's by text message after form submission.
- **Contact channel:** Lead with email (`hello@printkitnyc.com`) and the phone field collected on the request form. Remove the generic "phone" support promise unless a number is actually published.
- **Breakage / issues:** Replace "replacement or alternative solution" with language like "we'll troubleshoot with you and help determine the best path forward" — no guaranteed replacement.
- **Support scope:** Change "Email support during rental" to something narrower, e.g., "Setup help and troubleshooting via email during your rental."
- **LLMs.txt and meta:** Replace "quickly" / "quick response" with "We review requests and reply within 1–2 business days."

## Implementation steps

1. Update `src/components/CTASection.tsx` — change "within 24 hours" to "within 1–2 business days."
2. Update `src/components/request/RequestForm.tsx` — keep the 1–2 business days text; consider clarifying "text message" vs. "email" channel.
3. Update `src/components/KitSection.tsx` — replace "Email support during rental" with a scoped support line.
4. Update `src/components/FAQSection.tsx` — revise the breakage answer to remove the unpublished phone option and the replacement guarantee.
5. Update `src/lib/faqData.ts` — align the `/faq` page breakage answer with the homepage FAQ and tighten the "change your rental" answer.
6. Update `public/llms.txt` — replace "confirm quickly" with the standardized response-time language.
7. Update `src/pages/Request.tsx` metadata — replace "Quick response" with "Response within 1–2 business days."
8. Verify no other support claims remain out of sync using a site-wide search.

## Out of scope (unless you say otherwise)

- Adding a published phone number.
- Changing the actual workflow or support hours.
- Adding a dedicated /contact page.
