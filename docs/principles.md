# The look, in ten rules

The look is white Microsoft: white pages, the Microsoft palette with fixed meanings, one type scale, a claim on every
slide and a picture that carries it. These rules come from decks that worked in front of real rooms. The build checks
most of them; the rest are on the review list in [presenting.md](presenting.md).

1. **One idea per slide.** The title says the point, not the topic: "Support waits fell by half", not "Support metrics".
   At most 8 plain words (about 48 characters). If you need a second idea, you need a second slide.
2. **Show it, then name it.** A real moment first (a screen, a number, a quote, a story), then the word for it.
   Explain a term on the slide where it first appears (`defines`), or give it a `term` card.
3. **Few words on the page.** At most 25 words besides the title. The build counts them and warns above 30.
   Everything else goes into the speaker notes: you say it, they don't read it.
4. **A picture carries the idea.** At least half of each part is diagrams, pictures or one big idea. Text-box layouts
   (checklist, steps, pillars, board, grid, matrix, split, term) are the exception. The build counts them.
5. **A new design on every slide.** Never the same layout twice in a row, and a layout at most twice per part.
   One or two full-colour pages per part (`bg: 'dark'` or `'blue'`) give the deck a rhythm.
6. **Colour always means the same thing.** Blue primary and neutral, green good, red bad, orange attention, purple the AI
   or model, grey context. Never colour alone: pair it with an icon or a word, so it reads in black and white.
7. **Every number has a source.** `sources: ['Label | https://…']`, shown as one line under the slide. Say what is
   measured, on how many, and the unit. Made-up numbers say so ("Sample data").
8. **Honesty.** No invented quotes, numbers or incidents. A quote is word for word, or the notes keep the original and
   say it was reworded. Previews and prototypes say so with a pill (`tag: { text: 'Prototype', tone: 'orange' }`).
9. **The story before the point.** If a slide relies on a real event, a `story` slide comes right before it: when, who,
   what they did, what went wrong, the outcome. The point may not depend on the notes for the facts.
10. **It must survive any PDF viewer.** No blurred shadows, filters or animations: macOS Preview draws them as grey
    boxes. A build is one page per click, so presenting is pressing the right arrow.

## The tone

Plain, calm and concrete. Say what happens and what to do. Start from what the audience has felt ("you've seen this
when…"). No hype: never "game-changer", "seamless", "revolutionary" or "unlock", no emoji, no sparkles. Dates in words
("11 Oct 2026", never 10/11), numbers with their unit.

## Three levels of craft

One look, three levels. Pick the level for the deck; all three share the colours, the type and the frame, so they mix.

| Level | What carries the slide | Use it for | Layouts |
| --- | --- | --- | --- |
| **1. Simple** | tinted cards, big numbers, short labels | updates, reviews, results | `cards`, `scorecard`, `bignumber`, `breakdown`, `versus`, `takeaways`, `statement`, `counters`, `checklist` |
| **2. Graphs** | a chart, a table or a diagram | reports, explanations | `bars`, `funnel`, `matrix`, `flow`, `pipeline`, `lanes`, `timeline`, `cycle`, `layers`, `quad`, `code` |
| **3. Illustrations** | a drawn object, or a picture built click by click | talks people should remember | the designs in `designs/`, `story`, `convo`, `branches`, `room`, `team` |

The guide ([dist/guide.pdf](../dist/guide.pdf)) shows every layout of each level.
