# Clicks, notes and handouts

## One click, one page

A slide with `clicks` becomes one PDF page per click. Presenting is pressing the right arrow in any PDF viewer
(PowerPoint, Preview, Acrobat, a browser): there are no animations to break.

```js
{ id: 'release', layout: 'pipeline', title: 'Every change takes the same four stops', stages: [...],
  clicks: [
    { caption: 'A person or an agent writes it', say: 'It starts like any change.' },
    { caption: 'Tests run on every change', say: 'Nothing goes further if a test fails.' },
    ...
  ] }
```

- **Any list-like layout** reveals one item per click: pillars, counters, checklist, steps, pipeline, journey, timeline,
  grid, board, icons, cycle, lanes. The newest item stays bright, earlier ones fade to about 38%, later ones are hidden
  but keep their place. A connector before an item (an arrow between stages) shows and hides with it.
  For any other layout, say which items to reveal: `reveal: '.css-selector'`; `revealFrom: 2` shows two on the first click.
- **Hand-drawn click layouts** draw each click themselves: `branches`, `room`, `team`, `convo`, `screens`, and any
  design with `clicks: true` (`sieve`, `flow-bands`, …). They read `ctx.step` (1-based) and `ctx.steps`.
- **Keep the whole picture:** `keepPast: true` on a slide keeps earlier items at full strength instead of fading them.
  Use it when the last click should show everything (a flow, a comparison).
- Under the slide, numbered dots (done, now, next) and **the caption of this click**, one line. If you can't write the
  caption, you don't need the click.
- **Nothing moves between clicks.** Every element with a `data-key` must keep its place on every page of the slide;
  the build checks it ("moves between clicks").
- The counter in the corner counts slides, not clicks.

## Speaker notes

Every build writes `out/<deck>-notes.md`: per slide its PDF pages, the **Say** line, one line per click
(caption and what to say), the notes, and every source with its full link. Every slide needs `notes` (2–5 plain
sentences: what to say, what to ask the room, any caveat); the build flags a slide without them.

## Handouts

`npm run handout -- --deck <name>` (after a build) writes `out/<deck>-handout.pdf`: one page per slide, the slide on the
left, and on the right the layout, the Say line, the notes, the clicks and the sources. Send it to people who missed
the talk. The guide's handout is the reference for every layout.

## What a build writes

| File | What it is |
| --- | --- |
| `out/<deck>.pdf` | the deck, one page per click, with real links |
| `out/<deck>-contact.png` | every page on one sheet: spot the slide that's busier than the rest |
| `out/<deck>-slides/NNN.png` | one PNG per page, for review |
| `out/<deck>-notes.md` | speaker notes |
| `out/<deck>-checks.txt` | the checks report; it must end with `Checks: clean` |

Optional delivery: set `deliverDir` (and `deliverNames: { pdf, contact, notes }`) on the deck, or `DELIVER_DIR`, and
the build copies the fresh files there.
