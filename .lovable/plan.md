# Host the DNP DS40 user manual PDF on the site

Host the uploaded `DS40_80_Users_Manual_Ver_1.18.pdf` (2.1 MB) so you get a stable public URL you can paste into emails, texts, or other documents.

## What to do

1. Copy the PDF into `public/` with a clean, stable filename:
   - `public/dnp-ds40-user-manual.pdf`
   - Live URL after the next deploy: `https://printkitnyc.com/dnp-ds40-user-manual.pdf`
2. No page or component changes — the file is simply hosted, not linked anywhere on the site unless you ask.

## Why not the Lovable CDN?

Files uploaded via the assets CDN are served under a path that only resolves on Lovable-hosted sites. Your site deploys to GitHub Pages via GitHub Actions, where that path would 404. Committing the PDF to `public/` guarantees the link works on your real domain. At 2.1 MB it's fine for a repo that already holds product photos.

## Notes

- The filename is permanent once linked elsewhere — renaming later breaks your existing links, so `dnp-ds40-user-manual.pdf` is chosen as version-agnostic (the uploaded file says "Ver 1.18" in the name).
- A republish/deploy is required before the URL works.

## Verification

- Confirm `public/dnp-ds40-user-manual.pdf` exists and the dev server serves it (`curl` the local URL, expect a PDF response).
