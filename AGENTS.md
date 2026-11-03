# AGENTS.md

ms-deck-studio builds Microsoft-style slide decks from plain data: `src/build.mjs` turns a deck (`decks/`, `examples/`,
`guide/`) into a 16:9 PDF (one page per click), PNGs, a contact sheet, speaker notes and a checks report.

## Build and check
- `node src/build.mjs --deck <name>` → `out/<name>.pdf`, `out/<name>-contact.png`, `out/<name>-slides/NNN.png`,
  `out/<name>-notes.md`, `out/<name>-checks.txt`. The report must end with `Checks: clean`. Fix the slide, not the check.
- `npm run guide` (guide + handout), `npm run examples` (every example), `npm run links -- --deck <name>`,
  `npm run privacy` (denylist outside the repo).
- Look at the contact sheet and every changed PNG before calling a change done.
- `npm run guide` builds `guide/specimens.mjs` first (the slides the guide shows), then the guide and its handout.
- After changing the guide, rebuild it and copy `out/guide.pdf`, `out/guide-handout.pdf` and `out/guide-contact.png`
  to `dist/` with `DECK_BRAND=off` (the committed PDFs never carry the logo).

## Where things live
- Layouts: `src/layouts.mjs` (cards and words), `src/diagrams.mjs` (diagrams), `src/extras.mjs` (agents working
  together, click-by-click). Design plugins: `designs/*.mjs` (`export const designs = { name: { css, render, bare } }`,
  every CSS selector names the design). Fields of everything: `docs/layouts.md`, `docs/designs.md`.
- Tokens: `theme/studio.css`. Frame and layouts: `theme/deck.css`, `theme/extras.css`.

## Rules
- The rules of the look are in `docs/principles.md`; follow them in every example and in the guide.
- This repo is public. No real customer, internal project or person's data on any slide, in code or in comments:
  examples use Microsoft's fictional companies and say "Sample data". Run `npm run privacy` before pushing.
- No blurred shadows, filters or emoji (macOS Preview draws blur as grey boxes; the build flags it).
- Keep comments for what isn't obvious. Plain English, sentence case.
