# Writing the slides

## Titles

The title is the sentence you want people to repeat tomorrow. Write it last, after you know what the slide shows.

| Topic (skip it) | Claim (write it) |
| --- | --- |
| Q3 results | Q3 grew on two new markets |
| Architecture overview | One queue replaces three services |
| Customer feedback | Support waits fell by half |
| Prompting | A good brief rules things out |

Sentence case, no full stop, 8 words or fewer. The eyebrow above it is the topic, 2–4 words.

## Words on the slide

- At most 25 words besides the title. Card text is one short line. Code is 8 lines or fewer, and the slide says in words
  what it does.
- Mark one or two phrases with `{{blue|…}}`, never a whole sentence.
- Plain words. A term the audience doesn't know gets explained where it first appears, or not used.

## What counts as a word

The build counts the words someone has to read on a slide, besides the title, and prints them per slide in
`out/<deck>-checks.txt`. It warns above 30 (35–40 for card layouts and stories).

- **Counted:** body text, card text, captions of clicks, tags next to the title, notes under a chart.
- **Not counted:** the title, the eyebrow, small-caps labels (`.lbl`), names and labels marked `nolint`, numbers on
  their own (`42%`, `+8 pts`, `1,800`), the header line, sources and the link badge.
- **Lower the limit** for a "very little text" brief: `wordBudget: 15` on the deck. Raise it for one reference page
  (a table to look things up in) with `maxWords` on the slide.

## Numbers and sources

- Every statistic has a source in `sources`, one line under the slide: `'Label, date | https://…'`. Keep the labels
  short ("Contoso survey, Oct 2026"); the notes keep every full link.
- Say what is measured, on how many, and the unit ("Pass rate on 400 tickets per task. Change in percentage points.").
- A results table: the baseline first, the change last, the overall row tinted, green and red always with a tick or cross.
- Made-up numbers (examples, mock-ups) say so: `sources: ['Sample data']`.
- Numbers that change (prices, stars, counts) get a date, and a "check on the morning" note.

## Dates

`11 Oct 2026`, `Oct 2026`, `Tue 1 Dec 2026`. Never `10/11` (it means different days in different countries).

## Quotes

Word for word, with who said it and where. If you shorten one, keep the original words in `basis` and say in the notes
that it was reworded. No invented quotes, ever: a sample quote in an example says "(sample quote)".

## Speaker notes

`notes` on every slide: 2–5 plain sentences. What to say, what to ask the room, any caveat, and the facts you'd need if
someone asks. `say` is the one line to say (it opens the notes as "Say: …").
