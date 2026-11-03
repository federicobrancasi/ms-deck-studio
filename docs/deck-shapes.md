# Deck shapes

Start from the shape that fits, copy its example, then cut.

| Shape | The arc | Slides | Example |
| --- | --- | --- | --- |
| Update (level 1) | cover, overview cards, scorecard, the cause as a big number, the breakdown, the trade-off, what we learned, questions | 5–8 | [update.mjs](../examples/update.mjs) |
| Illustrated study (house style) | drawn cover, the problem you can count, how it works sized by share, per-group results, per-plan results, a drawn close | 6–8 | [front-desk.mjs](../examples/front-desk.mjs) |
| Demo talk | cover with a picture of the idea, where it comes from, how it works (click by click), live demo, real moments, what's next, one closing line | 8–14 | [demo-talk.mjs](../examples/demo-talk.mjs) |
| Long talk | blue signpost cover, agenda, parts with signpost dividers and pacing tags, a different metaphor on each slide, a break | 40+ | [metaphors.mjs](../examples/metaphors.mjs) |
| Study report | puzzle, method, one real example, mechanism, results, so what | 8–14 | [study-report.mjs](../examples/study-report.mjs) |
| Results page | one table: baseline, change, overall, sample size, unit, sources | 1 | [results-page.mjs](../examples/results-page.mjs) |
| Decision review | the question, the criteria, the cases (one per slide), the verdict, the next step | 6–10 | use the study shape, with a `quad` or `matrix` for the criteria |

## Demo talk

1. **Cover** (`cover-branches` or `title`): the name, one line, the parts, the speaker, a picture of the idea.
2. **Where it comes from** (`dial`, `crowd`, `story`): the moment that started it, with its source.
3. **How it works** (`branches`, `room`, `team`, or any layout with `clicks`): one idea per click, a caption each.
4. **Live demo** (`demo`, `bg: 'blue'`): what to watch for. Count 3–4 minutes. The next slides are the fallback.
5. **Real moments** (`listen` then `convo`): what really happened, word for word, one message per click.
6. **Next** (`team`, `timeline`): what comes after, with a Prototype pill if it isn't shipped.
7. **Close** (`close`): one sentence with the phrase to remember in blue.

## Long talk

- A cover with the parts and their minutes (`cover-signpost`, or `title` with `card.rows: 'blocks'`).
- Every part opens with a divider (`deck.divider: 'divider-signpost'`): number, title, minutes, the stops of the part,
  and the trail of all parts with this one marked. Minutes are computed from the slides, so they never go stale.
- **Pacing tags** (`deck.showTiers: true`, `tier: 'C' | 'N' | 'X'`): Core slides tell the whole story alone, Optional
  ones add to it, Cut-first ones go when time is short. A filtered deck (`filter: s => s.tier === 'C'`) builds the short
  cut, and the build checks that no kept slide uses a term whose explanation was cut.
- A different design on every slide: the metaphors in `designs/` (bridge, road sign, gate, name tag…), one per idea.
- One poll or "hands up" per part; a QR code on about one slide in four.

## Study report

Open on the surprise, not the method. Show one real example before any average. The mechanism is one picture (`flow`).
The results say the sample size and the unit. "So what" is three things to do, each following from a slide before.
