# Show Pricing and FAQ on every screen size

Right now the top menu hides the "Pricing" and "FAQ" links on phones and small
screens — only "Check availability" stays visible. On a phone there is no way to
reach those two pages from the menu.

## The fix

Keep all three links visible at every width, with tighter spacing on small
screens so they fit comfortably on one line:

```text
PrintKit NYC        Pricing   FAQ   Check availability
```

- Remove the rule that hides Pricing and FAQ below tablet width.
- Reduce the gap between links on small screens and restore the wider spacing
  from tablet up, so nothing crowds the logo.
- Slightly smaller text for the two secondary links on the narrowest phones,
  keeping "Check availability" the most prominent item.

No hamburger menu needed — three short links fit fine.

## Also

Add Pricing and FAQ links to the footer so there is a second path to them from
the bottom of any page.

## Technical notes

- `src/components/Header.tsx`: drop `hidden md:inline` from the Pricing and FAQ
  links; change nav spacing to `gap-4 sm:gap-6 md:gap-8`, and use
  `text-xs sm:text-sm` on the two secondary links.
- `src/components/Footer.tsx`: add a small inline link row (Pricing, FAQ,
  Check availability) using existing muted/primary tokens.
- Verify at 375px, 768px, and desktop that the header stays on one line with no
  overflow, and that the build is clean.
