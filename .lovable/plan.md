# Next phases: revert MCP, new favicon, media kit price

## Phase 1 — Undo the MCP agent changes

The MCP setup should be undone with Lovable's built-in revert, not by writing code. Use the revert button on the message that added the MCP integration, or pick the prior version in the History tab. A quick check of the current files shows no `src/lib/mcp/` or `supabase/functions/mcp` present, so the revert may already be partially or fully done — after reverting I'll confirm nothing MCP-related remains (Vite plugin line, `@lovable.dev/mcp-js` dependency, consent route, manifest folder) and clean up any leftovers.

## Phase 2 — New favicon, 3 options

Generate three distinct square icon concepts fitting PrintKit NYC (photo-print/printer theme, brand colors from the existing design system), present them for you to pick, then wire the winner up:

- Resize the chosen art to a square 64x64 `public/favicon.png`
- Point `index.html` at it and remove the leftover `public/favicon.ico`

Before generating, I need to know the direction you want (see question below).

## Phase 3 — Halve the prepaid media kit price

Prepaid media kit goes from $150 to $75. Text updates in:

- `src/components/pricing/AddOnsSection.tsx` — "$150 flat" -> "$75 flat"
- `src/components/request/RequestForm.tsx` — add-on label "($150 — up to 400 prints)" -> "($75 — up to 400 prints)"
- `src/lib/faqData.ts` — the media FAQ mentions the prepaid kit without a price; I'll add "$75" there for consistency unless you'd rather leave it price-free.

Print count stays at "up to 400 prints" unless you want that changed too.

## Technical notes

- No backend or data changes; pricing is static copy in components.
- Favicon follows the standard path: raster art padded to a square, referenced with `type="image/png"`, old `.ico` deleted so browsers don't fall back to it.
