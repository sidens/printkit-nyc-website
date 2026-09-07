# Host the DNP DS40 user manual at printkitnyc.com/manual

Host the uploaded `DS40_80_Users_Manual_Ver_1.18.pdf` (2.1 MB) so it opens when someone visits `https://printkitnyc.com/manual` — a clean, stable link to paste into emails, texts, or other documents.

## What to do

1. Copy the PDF into `public/` as `public/manual.pdf`.
   - This alone gives you `https://printkitnyc.com/manual.pdf` as a direct download/view URL.
2. Add a small `public/manual/index.html` that embeds the PDF inline, so `printkitnyc.com/manual` opens the manual in the browser:
   ```html
   <object data="/manual.pdf" type="application/pdf" style="width:100vw;height:100vh">
     <p>View the <a href="/manual.pdf">DNP DS40 user manual (PDF)</a>.</p>
   </object>
   ```
   - GitHub Pages serves `public/manual/index.html` at `/manual` (and `/manual/`), so this is the exact URL you asked for. The `<object>` shows the PDF inline; the fallback link covers browsers that block embedded PDFs.
3. No other site changes — nothing links to it from the app unless you ask.

## Why not the Lovable CDN?

Files uploaded via the assets CDN are served under a path that only resolves on Lovable-hosted sites. Your site deploys to GitHub Pages via GitHub Actions, where that path would 404. Committing the PDF to `public/` guarantees the link works on your real domain. At 2.1 MB it's fine for a repo that already holds product photos.

## Notes

- The URL `printkitnyc.com/manual` is permanent once you link it elsewhere — keep the filename stable.
- A republish/deploy is required before the URL works.
- This is a static, no-JS approach, so it works in any browser and for any scraper.

## Verification

- Confirm `public/manual.pdf` and `public/manual/index.html` exist.
- `curl` the local dev server at `/manual.pdf` (expect `application/pdf`) and `/manual/` (expect HTML with the `<object>`).
