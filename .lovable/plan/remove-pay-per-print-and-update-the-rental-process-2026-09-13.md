# Remove pay-per-print and update the rental process

The website will describe one optional print-media choice only: the **$100 prepaid media kit for up to 400 prints**, or renters may bring compatible DNP DS40 media. The booking process will be: request dates, confirm availability, sign the agreement, pay the invoice, then pick up the printer. Applicable sales tax will be added to rental charges and add-ons, but not to the refundable security deposit.

## Changes

### 1. Remove the remaining pay-per-print language
- Delete the stale “Billed after return based on usage” fallback from the pricing add-ons section.
- Tighten the homepage and full FAQ media answers so they refer only to the prepaid kit or customer-supplied compatible media.
- Search all public pages and search-facing content after the edits to ensure no pay-per-print, per-use billing, or post-return billing language remains.

### 2. Explain the booking steps clearly
- Update the homepage “How it works” section to show the complete sequence:
  1. Submit a date request.
  2. Receive availability confirmation.
  3. Sign the rental agreement.
  4. Pay before pickup, then collect and return the printer.
- Update the pricing-page call to action to state that the agreement is sent after availability is confirmed and payment is due before pickup.
- Update pickup wording where needed so “booking confirmed” is consistent with the signed-agreement-and-payment process.

### 3. Add payment and sales-tax terms to pricing
- Add a clear note to the homepage pricing area that applicable sales tax is added to the rental and optional add-ons, excluding the refundable deposit.
- Expand the pricing page’s deposit/payment area to explain:
  - the agreement must be signed before payment;
  - payment must be received before pickup;
  - applicable sales tax is charged on the rental and add-ons;
  - the $200 refundable deposit is not taxed.
- Keep the existing cancellation and deposit-return terms unless a wording adjustment is needed solely for consistency with prepayment.

### 4. Update request-form expectations
- Keep the request form as an availability request with no payment collected on the website.
- Revise the note beneath the submit button, success message, and confirmation toast so renters know the next steps are availability confirmation, agreement, and payment before pickup.
- Keep the existing Formspree fields and analytics events unchanged.

### 5. Update FAQs and search-facing summaries
- Add or revise a policy FAQ covering when payment is due and how sales tax is calculated.
- Ensure the FAQ structured data automatically reflects the revised answers.
- Update `public/llms.txt` with the agreement-first payment process and the rule that tax excludes the refundable deposit.
- Keep listed base prices and structured product offers unchanged; sales tax remains described as “applicable sales tax,” not a fixed published percentage.

## Technical notes
- This is copy and presentation work only; no online checkout or payment integration will be added.
- Existing rental prices remain $100/day, $100 per prepaid media kit, $35/day for the print server, and a $200 refundable deposit.
- Validate the affected pages at desktop and mobile sizes, confirm the request form still submits correctly, and check for a clean build with no stale billing references.
