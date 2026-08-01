# Consistent header CTA

## Problem

The header's call to action changes by page and device:

- Home page (desktop): "Check availability", scrolling to the on-page `#availability` section rather than going to the booking page
- Every other page (desktop): "Request dates", linking to `/request`
- All pages (mobile): "Book now", linking to `/request`

Three labels and two different destinations for the same action.

## Fix

Make the header CTA one label with one destination everywhere:

- Label: **Check availability** (matches the hero button and the section headings on the home and pricing pages, so the wording the visitor clicks stays the same across the site)
- Destination: always `/request`
- Same label and destination on mobile — "Book now" goes away
- Remove the home-page special case entirely, so the header no longer needs to know which page it's on

The on-page `#availability` section keeps its id and its own "Request your dates" button; only the header stops pointing at the anchor.

## Technical notes

- `src/components/Header.tsx`: drop `useLocation` / `isHome` branching and the separate mobile link, and render a single `Link to="/request"` CTA. Keep the existing desktop text styling, and style it so it stays visible at mobile widths where the nav links are hidden.
- No other component or route changes; the `/request` page and CTA sections are untouched.
