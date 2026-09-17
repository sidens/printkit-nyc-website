# Accessibility review: PrintKit NYC

Overall the site is in good shape. Every photo has a real description, every form field has a visible label, the phone error message is announced properly, and all four main pages wrap their content in a single page-content landmark. No critical blockers found.

## What to fix

**1. Add a "Skip to content" link**
Keyboard and screen-reader users currently have to tab through the whole header on every page. Add a link that appears when tabbed to and jumps straight to the page content.

**2. The 404 page is missing a content landmark**
Every other page has one; the "Page not found" page doesn't, and its "Return to Home" link does a full page reload instead of an in-app jump.

**3. Full-height pages on mobile browsers**
All pages use the older full-screen height measure, which can hide content behind the phone browser's address bar. Switch to the modern one.

**4. Label the two menus**
The top menu and footer menu should be named ("Main" and "Footer") so screen readers can tell them apart.

**5. Announce the form's success state**
After the request form is sent, the confirmation replaces the form silently for screen-reader users. Make it announce itself and move focus to the confirmation heading.

## Technical details

- New `SkipLink` component rendered at the top of each page shell; `<main>` gets `id="main-content"` and `tabIndex={-1}`.
- `src/pages/NotFound.tsx`: wrap in `<main>`, swap `<a href="/">` for react-router `<Link>`.
- Replace `min-h-screen` with `min-h-dvh` in `Index.tsx`, `Pricing.tsx`, `FAQ.tsx`, `Request.tsx`, `NotFound.tsx`.
- `aria-label="Main"` on the `Header.tsx` nav, `aria-label="Footer"` on the `Footer.tsx` nav.
- `RequestForm.tsx`: success panel gets `role="status"` / `aria-live="polite"`, heading gets `tabIndex={-1}` and focus on mount.

No copy, pricing, layout, or form-submission behavior changes.
