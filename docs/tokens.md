# Tokens: colour, type, space

All of them live in [theme/studio.css](../theme/studio.css). Layouts and designs never pick a hex code: they pick a
tone (`t-blue`, `var(--green)`), so a change here changes every deck.

## Colour

| Tone | Hex | Tint | Means | On white |
| --- | --- | --- | --- | --- |
| `blue` | `#0078D4` | `#EEF4FD` | primary, neutral; eyebrows, marks, the progress bar | 4.53:1 |
| `green` | `#107C10` | `#EEF7EA` | good, done, do this, a gain | 5.37:1 |
| `red` | `#D13438` | `#FBEEED` | bad, danger, a loss (use rarely) | 4.93:1 |
| `orange` | `#D83B01` | `#FCF1EC` | attention, a warning, "predict first" | 4.62:1 |
| `purple` | `#8661C5` | `#F3EFFA` | the AI or the model, wherever it acts | 4.64:1 |
| `neutral` | `#5F6168` | `#F5F6F8` | context, what is not the point | 6.18:1 |

Text: ink `#1B1B1F` (17.2:1), body `#5F6168`, muted `#72767E` (4.56:1, the darkest grey that still passes AA for small
text). Lines `#E3E6EB` and `#D3D8E0`; connectors `#B6C2D3`. The signpost yellow is `#F2C94C` (never for text).

Agent colours, for "who is speaking" in conversations, sit outside the meaning colours on purpose: purple, teal
`#03787C`, magenta `#B4009E`, gold `#8A6400`, indigo `#4F52B2`, blue.

Full-colour pages: dark `#1B1B1F` (with light tints of each tone for text) and Microsoft blue `#0078D4` (white text,
4.53:1). Every build prints the contrast table at the end of `out/<deck>-checks.txt`.

## Type

| Role | Size | Weight | Class |
| --- | --- | --- | --- |
| Title XL (cover, closing) | 78 px | 600 | `.st-title-xl` |
| Title (the claim) | 56 px | 600 | `.st-title` |
| Sub | 27 px | 400 | `.st-sub` |
| H3 / H4 (card titles) | 30 / 26 px | 600 | `.st-h3`, `.st-h4` |
| Body | 24 px | 400 | `.st-body` |
| Small | 20 px | 400 | `.st-small` |
| Eyebrow | 21 px, caps, +0.2em | 600 | `.st-eyebrow` |
| Label | 17 px, caps, +0.16em | 600 | `.st-label`, `.lbl` |
| Footnote, sources, header | 18 px | 400 | `.st-foot` |

Fonts: **Aptos** when Microsoft Office is installed (read from the app at build time and embedded in the PDF, never
committed), then Segoe UI, then Inter (bundled, OFL). Code: Menlo, Cascadia Mono, Consolas, then JetBrains Mono.
Numbers are tabular everywhere, so columns of figures line up.

## Space

Slides are 1920 × 1080 (16:9). Margins 96 px left and right; the content area is 1728 px wide. The header line sits
at the top (deck · context · date, and `NN / NN`), the eyebrow and title below it, the body from about 262 px to
956 px (shorter with a QR badge), then the sources line and a 6 px progress bar at the very bottom. The build checks
that no text leaves the safe area (60–1860 × 24–1062).

Corners are round (14–22 px on cards, 50% on avatars). Lines are 1.5–3 px; arrows 3–6 px with round caps.
No blurred shadows anywhere: emphasis is a sharp ring (`box-shadow: 0 0 0 4px var(--fg)`).
