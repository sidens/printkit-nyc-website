# Fix Google Search Console product snippet errors

## What Google is reporting

Search Console flagged 1 critical Product snippets issue on printkitnyc.com:
"Either 'offers', 'review', or 'aggregateRating' should be specified".

## Confirmed cause

`src/components/ServiceSchema.tsx` builds a `Service` with a `hasOfferCatalog`.
Three of the catalog entries declare `itemOffered` with `"@type": "Product"`:

- Print Media (paper + ribbon)
- Prepaid Media Kit
- WCMPlus Print Server

Google extracts each of those as a standalone Product entity. Because the price
lives on the parent `Offer` and not inside the Product, each Product has no
`offers`, `review`, or `aggregateRating` — which is exactly the reported error.
The other two entries use `"@type": "Service"` and are not affected.

## The fix

Restructure the affected catalog entries so every `Product` carries its own
`offers` block:

```
itemOffered: {
  "@type": "Product",
  name: ...,
  description: ...,
  offers: {
    "@type": "Offer",
    price, priceCurrency, availability,
    priceSpecification: { ...unit pricing... }
  }
}
```

Keep the outer `Offer` price fields as-is so the OfferCatalog still reads
correctly, and keep all values sourced from `src/lib/pricingData.ts` so pricing
stays in one place.

Also add `url` (the pricing page) and reuse the existing site image on each
Product so the snippet has enough context to render.

## Files changed

- `src/components/ServiceSchema.tsx` — only file touched.

## Verification

- Load the homepage in the preview and dump the JSON-LD block to confirm every
  `Product` node now contains an `offers` object.
- Validate the emitted JSON-LD against schema.org Product requirements.
- After publish, use Search Console's URL Inspection to re-check; the issue
  clears on Google's next crawl (no code follow-up needed).
