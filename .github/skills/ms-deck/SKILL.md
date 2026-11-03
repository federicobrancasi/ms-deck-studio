---
name: ms-deck
description: Plan a Microsoft-style slide deck with the user, then build it as a checked 16:9 PDF with speaker notes using ms-deck-studio - a demo talk, a long talk, a study report, a results page or a review. Use when asked to make slides, a deck, a talk or a presentation in the Microsoft look.
---

# Microsoft deck

Make a deck in the white Microsoft look of [ms-deck-studio](https://github.com/federicobrancasi/ms-deck-studio):
a claim in every title, a picture that carries it, a source under every number, one page per click.
The repo has the details: [docs/principles.md](../../../docs/principles.md), [docs/layouts.md](../../../docs/layouts.md),
[docs/deck-shapes.md](../../../docs/deck-shapes.md). Read them before writing slides; this file only says how to work.

## 1. Ask four things, decide the rest

Read the request, the workspace and anything the user points to first. Then ask **four questions in one form**
(question forms when the host has them), each with concrete options and a recommendation:

1. **Goal and audience:** what should they think or do afterwards, and what do they already know?
2. **Level of craft** (recommend one): **simple** (cards and big numbers), **graphs** (charts and diagrams) or
   **illustrations** (drawn objects). Show the guide's levels page.
3. **What must not appear:** unreleased work, code names, customers, internal numbers. Offer to add them to the
   denylist (`~/.config/ms-deck-studio/denylist.txt`).
4. **Checkers at the end?** (recommend yes): after the build, subagents check every number and claim against the
   sources, every page at full size, and that this skill was followed; you fix what they find and check again.

Decide everything else yourself and write it into the brief as **assumptions** the user can correct: the shape
(update, demo talk, long talk, study report, results page, decision review), setting and minutes, the story order,
which slides build click by click, and Core/Optional/Cut first for long talks.
Ask a follow-up only for facts only the user knows (a number with no source, a quote, a screenshot).
**If you can't ask** (you are a subagent, or the user is away), decide all four as well (checkers: yes) and mark
them assumed.

## The house style (what people pick)

When several versions were compared side by side, these *qualities* won every time. Aim for them on every illustrated
deck (the design names show one way each was done, not the way to do it):

- **A hero drawing on the cover**, not a card of numbers: the idea itself, filling the right half (`fork-cover`).
- **Numbers you can count**: 100 dots, the ones that made it in a tray, the ones that didn't in a bin (`sieve`).
- **Flows sized by share**: how it works as bands whose width is the share of traffic, big % on the ends
  (`flow-bands`), built click by click with every step staying bright.
- **Highlight the few, mute the rest**: in a before → after chart the biggest wins are bold, the rest grey, and the
  honest caveat is one calm line (`dumbbell`).
- **One object, reused**: the same drawing (a ladder, a tray) on several slides, with giant result numbers under it
  (`ladders`).
- **A drawn close**, not a bullet list: the next steps as a countdown to a launch on a blue page (`launch`).
- **Fewer words than you think**: about 15 per slide besides the title; numbers and labels don't count.

## Inspiration, never a template

The examples and their drawings (`examples/new-terminal.mjs`, `daily-film.mjs`, `pr-videos.mjs`, `demo-talk.mjs`,
`front-desk.mjs`; `designs/gallery-*.mjs`, `house.mjs`, `illustrations.mjs`, `metaphors.mjs`) show **the bar**,
not the answer. Look at their contact sheets (`dist/examples/`) to see how good a deck should be, and read their code
to learn a technique. Then:

- **Never use a gallery, house or illustration design as a slide's picture in a new deck**, and never copy one and
  change its words. If the new deck looks like a harbour, a cinema or a studio, start again.
- **Every illustrated deck gets its own world** (chosen from its topic), one recurring object, and new drawings in
  `designs/local-<deck>.mjs`. At most borrow a technique: how a beam starts at its lamp, how dots fall into a tray.
- Follow [docs/illustrating.md](../../../docs/illustrating.md): pick the world, one drawing per slide, the polish
  checklist, options for the slides that matter.

Every slide must pass the **stranger test**: someone new can describe it in one sentence without help.

## 2. Agree on a brief

Write the brief: the takeaway, audience and setting, the shape, and **per slide its claim title, layout and what it
shows** (and its clicks). For an illustrated deck, name the **world** and the **recurring object**, then one line per
slide: the drawing and what the numbers become (see the table in docs/illustrating.md). In plan mode the plan is the brief. Build nothing until the user approves it.

## 3. Build

- Work in a clone of ms-deck-studio (`npm ci`). Start with `npm run new -- <name> --title "…" --world "…"`: it
  creates the deck, its designs file, the options deck and a brief to fill in (all git-ignored). Slides are plain data; never hand-edit the HTML or PDF.
- Pick layouts from the agreed level (`docs/layouts.md`): cards and big numbers for simple, charts and diagrams for
  graphs. For illustrations, **draw new designs for this deck** (see the house style above); built-in layouts are
  fine for the simple slides in between. A deck may borrow from a lower level, never fake a higher one. A different
  picture on every slide.
- Microsoft rules, always:
  - Colour means the same thing everywhere: blue primary, green good, red bad, orange attention, purple the AI, grey
    context, and never colour alone.
  - Titles are claims of 8 words or fewer, in sentence case. Eyebrows are 2–4 words.
  - At most 25 words on a slide besides the title (aim for ~15; `wordBudget: 15` on the deck enforces it, except on
    stories and conversations, which are read aloud). The rest goes in `notes`, and every slide has notes.
  - Every statistic has `sources`. Dates are written in words (11 Oct 2026).
  - Use Microsoft's fictional companies (Contoso, Fabrikam, Northwind) for examples, and label sample data.
  - No blur, filters or emoji. Use the official logo only from `assets/brand/`, and never invent one.
- Checkpoint before building the rest: show the user the cover, the hardest slide and one click of a click-by-click
  slide (PNG from `out/<name>-slides/`), and wait for their OK. If you can't ask, note what you would have shown.
- **Options for illustrated decks:** draw **4 cover variants** (simple → rich, or different objects) and 2–3 of the
  hardest slide in `decks/<name>-options.mjs`, each eyebrow ending `· Option A`, and let the user pick. Swap the picks
  into the deck.
- **The detail bar** ([docs/illustrating.md](../../../docs/illustrating.md#the-detail-bar)): characters from one
  shared helper, fully drawn (clothes, faces, hands holding their tools); devices from the props in `src/kit.mjs`
  (`phone`, `laptop`, `monitor`, `appWindow`, `browser`); people and the agent from `person()` and `agent()`; machines with real mechanics; sets that *are* the idea, no
  decorative props; real sprites and stills, sharp; logos (`logo('slack')`) beside product names. When a user asks for
  "better", redraw the objects with more care and keep the story.
- Real pictures beat mock-ups: put stills of the actual product or output in `assets/local-*/` (not committed) and
  frame them in your own drawing (a screen, a cinema, a gallery). From an animated webp, extract full frames with
  `magick file.webp -coalesce frame-%03d.png` (without `-coalesce` you get partial frames).
- New drawings go in `designs/local-<deck>.mjs` (not committed; see `docs/designs.md`), with names prefixed by the
  deck so they never collide. Move one to a public `designs/` file only if it is generic. Draw with the helpers in `src/kit.mjs` (`STYLE`, `t`, `at`, `layer`, `band`, `mix`) so it matches.

## 4. Check, review, deliver

- `node src/build.mjs --deck <name>` must end with `Checks: clean`. Fix the slide, not the check.
- `npm run links -- --deck <name>` if there are public links or QR codes (links to private repos fail by design:
  skip the check and say so). `npm run privacy` before anything is shared; if the content is internal and there is no
  denylist yet, create one with its project words first, or say plainly that nothing was checked.
- Look at the contact sheet and **every page at full size**. For drawings, check the list in docs/illustrating.md:
  nothing floats, parts stay inside their object, light starts at its source, no crossing lines, no empty corners.
  Read only the titles in order: they must tell the story.
  Write each defect as `slide · problem → fix`. Clipped text, wrong facts and missing sources block delivery.
- **If the user wanted checkers** (question 4), start three subagents in parallel with the prompts in
  [checkers/](checkers/) (`facts.md`, `pages.md`, `skill.md`), each with the brief, the deck files, the sources and
  the PNG paths (run `npm run review -- --deck <name>` first for zoomed review sheets): **facts** (every number, name and claim against the sources), **pages** (every
  PNG at full size against the detail bar: clipped, floating, overlapping, crossing lines, empty corners, unclear
  pictures) and **the skill** (its own world and new drawings, no reused gallery or house designs, brief and
  assumptions written). Fix what they find, rebuild, and ask them to confirm, until nothing is left. If a subagent has
  no tools, do that check yourself. List what they found and what you fixed when you deliver.
- Deliver `out/<name>.pdf`, the notes (`out/<name>-notes.md`), the contact sheet and, if useful, the handout
  (`npm run handout -- --deck <name>`) or a PowerPoint file (`npm run pptx -- --deck <name>`). Say what differs from the brief and why.
