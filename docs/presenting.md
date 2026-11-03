# Before you present

## The checks

```sh
npm run build -- --deck <name>     # must end with "Checks: clean"
npm run links -- --deck <name>     # every QR code read back, every PDF link and source address opened
npm run privacy                    # nothing from your denylist in the repo or the notes
```

What the build checks, on every page: text that overflows its box or leaves the safe area, text that overlaps other
text, text shrunk to fit, content taller than its area, anything that moves between clicks, blurred shadows or
filters, more than 25 words, numbers without a source, slides without notes, clicks without a caption, the same
design twice in a row or three times in a part, too many text-box layouts in a part, terms used before they are
explained, a missing screenshot, a sources line that's cut off, text that spills out of a drawn shape (`data-shape`),
and text that is hard to read on a blue or dark page (its real rendered contrast). And the colour contrast of every
text colour.

## The review

1. Open the contact sheet (`out/<deck>-contact.png`). Is any page much busier, emptier or greyer than the rest?
2. Read only the titles, in order. Do they tell the story on their own?
3. Look at every changed page at full size (`out/<deck>-slides/NNN.png`).
4. Give it to someone who hasn't seen it. Can they repeat each title?
5. Present it once, out loud, with the notes. Time it.

## In the room

- Present the PDF full screen (Preview: View, Slideshow; PowerPoint and Acrobat open PDFs too). Right arrow = next click.
- Keep the notes (`out/<deck>-notes.md`) or the handout on a second screen or on paper.
- QR codes are big enough to scan from the middle of a room; each badge says in words where it goes.
- For a live demo: have it open before you start; the slides after it show what happens if the network fails.

## Fonts and the logo

Aptos is read from a local Microsoft Office install and embedded in the PDF; without Office the deck falls back to
Segoe UI, then Inter. The build says which font it used. The Microsoft logo is not part of the repo: put the official
SVG in `assets/brand/logo.svg` (ignored by git), or the cover shows the wordmark alone.
