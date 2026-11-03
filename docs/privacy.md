# Privacy: what never goes on a public slide

This repo is public. Your decks are not: keep them in `decks/` (ignored by git) or in another folder.

## Never on a slide you share

- Unreleased product names, internal code names, internal URLs, dashboards, ticket numbers.
- Internal results (evaluation numbers, telemetry, revenue) unless they are published.
- Customer names and data, colleagues' names and words without their OK.
- Screenshots with any of the above in a corner: crop them (`crop: [x, y, w, h]`).

## Making an example public

Recreate it, don't redact it. Use Microsoft's fictional companies (Contoso, Fabrikam, Northwind Traders, Woodgrove Bank,
Adventure Works, Tailspin Toys, Wide World Importers), made-up numbers marked "Sample data", and placeholder names
(Ada, Bix, Cora). Keep the shape of the slide, change every fact.

## The denylist check

`npm run privacy` searches every file git would commit, and the built speaker notes, for the words in your denylist.
The list lives outside the repo (`~/.config/ms-deck-studio/denylist.txt`, or `DECK_DENYLIST=/path`), one word per line,
because a committed list of private words would itself leak them. Run it before every push.
