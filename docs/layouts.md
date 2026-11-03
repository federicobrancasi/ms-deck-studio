# Layouts

Layouts come in three levels of craft: **simple** (cards and big numbers), **graphs** (charts, tables, diagrams) and
**illustrations** (drawn objects, in [designs.md](designs.md)). Every slide is plain data: `{ id, layout, eyebrow, title, ...fields, notes, sources }`. This page lists every built-in
layout and its fields. The limits in brackets are what fits at full size: if the build warns "shrunk" or "taller than
its area", cut words, not the font size. The guide (`npm run guide`) shows each one as a working slide.

## Fields every slide can have

| Field | What it does |
| --- | --- |
| `id` | kebab-case, unique in the deck |
| `layout` | one of the layouts below, or a design from `designs/` |
| `eyebrow` | 2–4 words, the topic, in blue capitals above the title |
| `title` | the claim, 8 words or fewer (about 48 characters) |
| `tag` | a pill right of the title: `{ text, tone, icon }`, e.g. `{ text: 'Prototype', tone: 'orange', icon: 'beaker' }` |
| `notes` | speaker notes, 2–5 plain sentences. Required. |
| `say` | the one line to say (≤ 70 characters), goes into the notes as "Say: …" |
| `sources` | `['Label | https://…']` or `[{ text, url }]`. Required when the slide shows a statistic. |
| `nosrc` | `true` when the numbers on the slide are not statistics (rules, dates, counts in a diagram) |
| `link` | a QR badge bottom-right and a real link in the PDF: `{ url, label, logo \| icon, caption, from }` |
| `bg` | `'dark'`, `'blue'` or `'tint'`: a full-colour page, one or two per part |
| `clicks` | `[{ caption, say }]`: one PDF page per click (see [builds.md](builds.md)) |
| `reveal` | CSS selector of the items a click reveals, for layouts not in the built-in list |
| `tier` | pacing tag for long talks: `'C'` Core, `'N'` Optional, `'X'` Cut first (shown when `deck.showTiers`) |
| `minutes` | override the time estimate (a slide counts 1.3 min, a poll or live demo 4) |
| `maxWords` | a reference page (a table to look things up in) may raise the 25-word limit |
| `defines`, `aliases`, `allowTerms` | the term check: terms this slide explains, other spellings, terms used on purpose before they are explained |

Inline markup in any text field: `{{blue|marked words}}` (tones: blue, green, red, orange, purple, neutral), `**strong**`,
`` `code` ``, and `\n` for a line break.

Tones: `blue` neutral and primary, `green` good, `red` bad, `orange` attention, `purple` the AI or model, `neutral` grey.

## Level 1: simple cards

Tinted panels and big numbers, no drawings: the fastest way to a good deck. Card layouts may carry up to 35 words
(labels and numbers don't count). [examples/update.mjs](../examples/update.mjs) uses all of them.

| Layout | Use it for | Fields |
| --- | --- | --- |
| `cards` | an overview: a solid hero card, a stat card, 2–4 numbered cards | `hero: { label, title, sub }`, `stat: { value, label, sub, tone }`, `items: [{ title, text, tone }]` |
| `scorecard` | two numbers head to head, a delta badge, and rows that count the cases | `left`, `right`: `{ label, value, sub, tone }`, `delta: { text, tone }`, `rows` (0–4): `[{ value, label, text, tone }]` |
| `bignumber` | one number that is the point, very big, with a meter and the problem / insight under it | `value`, `unit`, `tone`, `meter: { value (0–1), label }`, `panels` (1–2): `[{ label, title, text, tone }]` |
| `breakdown` | a change per category, green better, red worse, grey flat | `items` (3–6): `[{ title, sub, value, tone, detail }]`, `cols` (default 3) |
| `versus` | two options with their pluses (green bar) and costs (orange bar) | `left`, `right`: `{ label, title, items: [{ title, text, good: false }] }`, `vs` |
| `takeaways` | 2–4 numbered points and a note | `items: [{ label, title, text, tone }]`, `note` |

## Cards and words

| Layout | Use it for | Fields |
| --- | --- | --- |
| `title` | the cover | `eyebrow`, `title`, `sub` (one plain line; `quote` only for real words someone said, drawn in quotation marks), `speaker: { initials, name, role }`, `pills`, `card: { label, big, sub, rows: [{ title, value, note, tone }] }` (or `rows: 'blocks'` to list the parts of a long talk with their minutes, computed by the build) |
| `section` | first slide of a part (or draw all dividers with a design: `deck.divider`) | `number`, `eyebrow` ('Part 7  ·  Block name  ·  12 minutes': the build fills in the part number and minutes), `title`, `sub` (≤ 100 chars), `chips` (≤ 3; string or `{ icon, text }`, ≤ 32 chars), `tone` |
| `statement` | one big sentence | `eyebrow`, `text` (≤ 110 chars, 1–2 `{{tone\|marks}}`), `chips` (≤ 4: `{ icon, text, tone }`), `note` (≤ 160) |
| `quote` | a real quote, with a source | `eyebrow`, `text` (≤ 140), `who: { initials, name, role }` |
| `pillars` | 2–4 ideas side by side | `items: [{ icon, title (≤ 28), text (≤ 100), example (≤ 80), exampleLabel, tone }]`, `exampleLabel` (default 'Example'), `height` (px, default 430) |
| `counters` | 1–3 big numbers | `items: [{ value (≤ 6 chars, e.g. '84%', '~54', '255k'), label (≤ 40), sub (≤ 80), tone }]`, `note` |
| `checklist` | 3–5 rows (or 6–10 with `columns: 2, dense: true`) | `items: [{ icon, tone, title (≤ 56; ≤ 38 in 2 cols), sub (≤ 80; ≤ 54 in 2 cols) }]` |
| `steps` | 2–6 numbered steps (+ a card on the right) | `steps: [{ title (≤ 48), text (≤ 80), tone }]`, `aside: { label, title, text, prompt, mono }` (a copy-paste prompt goes in `prompt`) |
| `pipeline` | stages left to right | `stages` (2–5): `[{ icon, title (≤ 22), sub (≤ 54), chip, tone, on }]`, `loop: { from, to, label }` (0-based stage indexes, an arrow back), `branch: { from, label, title, sub, tone, icon }` (a failure path under a stage), `stageHeight` (px, default 236: every stage has this height, so raise it if a stage overflows) |
| `sequence` | messages between 2–4 parties | `parties: [{ icon, title, sub, tone }]`, `steps` (2–5): `[{ from, to (0-based), text (≤ 40), mono, reply (≤ 32), replyTone, tone }]` |
| `journey` | one thing travelling across 3–5 stops | `nodes: [{ icon, title, sub (≤ 50), tone, result, resultTone }]`, `hops: ['label', …]`, `packet: { text, icon }` |
| `timeline` | 3–8 dates | `items: [{ date, title (≤ 30), sub (≤ 60), tone, now }]`, `alternate: true` (labels above/below, for 6+ items) |
| `layers` | 2–5 stacked bands | `layers: [{ icon, title, sub, tone, chips: [], callout }]` |
| `matrix` | a table (≤ 7 rows) | `columns: [{ label, width }]` (e.g. '1.4fr', '320px'), `rows: [[cell, …]]`, where a cell is text or `{ text, ok: true/false, icon, tone, mono, pill }`; a row can be `{ cells, tone }` to tint it; `note` |
| `board` | 2–4 columns of cards | `columns: [{ title, icon, tone, items: ['text' or { title, sub }] }]` (≤ 4 items each) |
| `split` | before / after, weak / strong | `left`, `right`: `{ label, tone, icon, title, prompt \| text \| lines: ['…' or { text, ok }], mono, notes: ['chip'…], on }`, `verdict: { text, tone, icon }`, `height` |
| `code` | ≤ 12 lines of code + ≤ 3 numbered callouts | `lang`, `file`, `dir`, `code` (string), `from` (first line number), `highlight: [line numbers]`, `diff: true` (lines start with '+', '-' or ' '), `callouts: [{ lines: [a, b], title, text }]`, `fontSize`, `calloutsWidth`, `hideLines` |
| `ui` | a mock chat window (tool calls, approvals) | `window: { title, width, blocks: [{ kind: 'user' \| 'agent' \| 'tool' \| 'approve' \| 'toast' \| 'text', text, cmd, buttons, status, statusTone, icon, tone }] }`, `callouts` (≤ 3) |
| `poll` | predict, then reveal (2 pages) | `lead` (≤ 120), `options` (2–4): `[{ text (≤ 40), sub, correct: true }]`, `answer` (≤ 160), `kind: 'hands'` for a show of hands, `reveal: false` for no answer page |
| `image` | a screenshot in `assets/` | `src: 'assets/x.png'`, `alt`, `width`, `height`, `crop: [x, y, w, h]` (a region in the PNG's own pixels, scaled to `width`; use it, full screenshots are unreadable on a slide; without `crop` the whole image is fitted inside the frame), `placeholder` (text shown if the file is missing), `callouts` (≤ 3) |
| `term` | a plain-English definition card (only when the term is new to them and needed later) | `term` (≤ 24), `def` (≤ 110), `analogy` (≤ 90), `example` (≤ 90), `exampleLabel`, `symptom` (≤ 90, "you've seen this when…"), `todo` (≤ 90, what to do), `aliases` |
| `posts` | 1–4 posts from X, Reddit, Hacker News, a blog or GitHub, drawn as cards in our look (never screenshots or logos) | `posts: [{ platform: 'x' \| 'reddit' \| 'hn' \| 'blog' \| 'github' \| 'youtube' \| 'linkedin' \| 'news', author (≤ 28), handle, sub, initials, date, text (1 post ≤ 220 chars; 2 posts ≤ 130; 4 posts ≤ 80), metrics: [{ icon, text }] (e.g. `heart` '15.9k', `repeat` '1.4k', `eye` '3.4M views', `arrowUp` '561 points', `chat` '403 comments'), tone, size }]`, `callouts` (≤ 3, single post only), `takeaway` (one line under the cards), `takeawayTone`, `takeawayIcon`, `width`. Three cards: keep each text to about 3 lines (≤ 110 chars) |
| `agenda` | list of parts with minutes | `items: [{ number, title, sub, minutes, tone }]` |
| `quad` | a 2×2 (no apostrophes in the axis labels: the vertical one renders them badly) | `x: { label, low, high }`, `y: { label, low, high }`, `cells: [topLeft, topRight, bottomLeft, bottomRight]`, each `{ icon, title, text (≤ 80), example (≤ 60), tone }` |
| `grid` | 4–8 small cards | `items: [{ icon, title (≤ 32), text (≤ 80), tone }]`, `cols`, `tinted: true` |
| `end` | closing link + QR | `url`, `title`, `meta`, `qr`, `qrCaption` |
| `html` | an escape hatch: raw HTML in the body | `html` (string). Prefer a design plugin. |

## Level 2: diagrams

The preferred layouts: a shape carries the idea, so the slide needs few words.

| Layout | Draws | Fields |
| --- | --- | --- |
| `tree` | a request branching into what the agent could do; your words cut some branches | `root: { label, text (≤ 40) }`, `branches` (3–6): `[{ text (≤ 22), cut: 'the words that cut it' (≤ 24) }]` (list the open ones last), `cutLabel`, `keepLabel` |
| `spectrum` | a scale between two extremes, with the good zone | `left`, `right`: `{ title (≤ 18), text (≤ 34), icon, tone }`, `zone: { from, to (0–1), title, text (≤ 50), tone }`, `marks: [{ at, label, tone }]` |
| `chat` | a conversation (light, or `dark: true` like the editor) | `messages` (2–4): `[{ from: 'user' \| 'agent' \| 'note', text (≤ 120), label, mono, icon, tone }]`, `window` (bar title), `width`, `callouts` (≤ 3) |
| `files` | a folder tree with explained files | `root`, `items: [{ path: 'a/b/FILE.md' (end folders with /), title (≤ 26), text (≤ 40), icon, tone }]` (an item without `title` is drawn, not explained; ≤ 3 explained) |
| `cycle` | a loop of 3–6 steps | `steps: [{ icon, title (≤ 24), sub (≤ 28), tone }]`, `center: { title (≤ 28), icon }`, `aside: { label, title, text }` |
| `flow` | boxes and arrows with yes/no branches | `nodes: [{ id, col, row, title (≤ 24), sub (≤ 32), icon, tone, kind: 'decision' }]`, `edges: [{ from, to, label, tone, bend: 'below' \| 'above', dashed }]`, `cols`, `rows` (≤ 5 × 3) |
| `bars` | a bar chart | `bars` (2–8): `[{ label, value, text, tone, on }]`, `unit`, `max`, `horizontal: true` (long labels), `note` |
| `funnel` | narrowing stages with numbers | `stages` (2–5): `[{ value, label (≤ 34), tone }]`, `note` |
| `hero` | one giant number or word, optionally with a brand logo | `logo` (slug), `logoText`, `icon`, `value` (≤ 6 chars), `label` (≤ 70), `sub` (a pill, ≤ 30), `subTone`, `tone`, `title` (optional), `align: 'left'` |
| `venn` | 2–3 overlapping circles | `sets: [{ title (≤ 20), sub, tone }]`, `center: { title, icon }` |
| `iceberg` | what you see versus what's underneath | `top: { label, items (1–2) }`, `bottom: { label, items (3–8, ≤ 18 chars each) }` |
| `media` | 1–6 pictures with captions, or groups of stacked strips (chat lines) | `items: [{ src, alt, caption, sub, kind: 'image' \| 'video' \| 'website' \| 'motion' \| 'cad' \| 'svg', fit, placeholder }]`, `cols`, `height`; or `groups: [{ title, tone, icon, items: [{ src }] }]` |
| `terminal` | a terminal with commands and output | `lines: [{ cmd } \| { out, tone } \| { comment }]`, `window`, `width`, `fontSize`, `callouts` (≤ 3) |
| `icons` | 2–5 big icons with 1–3 words each | `items: [{ icon, title (≤ 16), sub (≤ 24), tone }]`, `arrows: true`, `note` |
| `story` | **what happened**: a real event in 3–5 beats on a timeline, with the outcome on the right. It goes right before the point it supports, and may use up to **45 words**. | `eyebrow` ('What happened · 24 April 2026'), `title` (the event in plain words), `who: { icon, text (≤ 50 chars) }`, `beats` (3–5): `[{ time (≤ 16 chars: 'The task', '9:41 pm', 'Day 2'), text (≤ 12 words), icon, tone }]`, `outcome: { label, value (≤ 7 chars), text (≤ 14 words), pill, pillTone, tone }`, `link` (the original account), `look`: `road`, `number`, `panels` or `split` (full-page pictures of the same data) |
| `lanes` | **who does what**: steps left to right in 2–3 lanes (e.g. People and AI) | `lanes: [{ id, title (≤ 10), icon, tone }]`, `steps` (3–7): `[{ lane (a lane id; `null` = across all lanes, e.g. the release), icon, title (≤ 24), sub (≤ 20) }]`, `hops: ['', 'label on the line into step 2', …]` |

## Agents and people working together

Hand-drawn layouts, most of them built click by click (`clicks`, one page per click). Agents have their own colours
(purple, teal, magenta, gold, indigo, blue), outside the meaning colours on purpose. The example deck
[examples/demo-talk.mjs](../examples/demo-talk.mjs) uses all of them.

| Layout | Draws | Fields |
| --- | --- | --- |
| `cover-branches` | a cover with a family tree of ideas on the right | `eyebrow`, `title`, `sub`, `parts: [{ text, sub }]`, `speaker`, `branch` (as for `branches`), `look: 'open' \| 'card' \| 'half'` |
| `branches` | **why many agents beat one** on an open-ended task, 4 clicks: one path, six paths, ideas mix, mixes mix | `branch: { task: { label, text }, one, room, rounds: [{ label, value }] (4), key, count, agents: [{ color, idea }] (6), pairs: [[a, b], …] }` |
| `dial` | **how much better**: a speed dial from where it started to where it got, and a card for the thing itself | `dial: { from, to, start, value, ticks, big, label, unit }`, `card: { site, icon, id, idIcon, name, sub, chips, challenge: { label, text } }` |
| `crowd` | **many agents, one board, one result**: a grid of 100 faces into a shared board into a big number | `count: { value, label }`, `board: { label, note, icon }`, `result: { value, label, icon }` |
| `room` | **how a room of agents works**, 7 clicks: goal in every inbox, they split the work, a message wakes one agent, it tests, turns run out, you choose, the choice | `room: { goal, agents: [{ name, model }] (3), claims (3), ask, reply, budget, used (7 numbers), check, choices: [{ text, icon, mine }], combine }` |
| `team` | **a lead and two teammates**, 5 clicks: you ask, tasks, reports, review (one sent back), answer | `team: { ask, answer, worker: { task, report, fixed }, scout: { task, report }, rework }` |
| `convo` | **a real conversation**, one message per click, earlier ones fade | `cast: { Name: { model, color } }`, `pinned: { icon, text }`, `messages: [{ at, who, tag, quote \| text, basis } \| { at, you: true, … } \| { at, event, who, icon }]`, `look: 'light' \| 'dark'` (with `bg: 'dark'`) |
| `listen` | **a pause before the conversations**, on a dark page: the title on the left, every agent's face around a typing bubble | `title`, `sub`, `moments: [{ title, cast, you, icon, room }]`, `bg: 'dark'` |
| `moments-cards`, `moments-inbox` | the same pause as four cards, or as an inbox of unread threads | as `listen`, plus `inbox: { title, note }` |
| `demo` | **hand over to a live demo**: a big line left, what to watch for right | `title`, `sub`, `watch: [{ icon, text }]`, `watchLabel`, `bg: 'blue'` |
| `screens` | **where you click, then what you get**, 2 clicks, with a ring on the spot | `shots: [{ src, alt, label, width, ring: [x, y, w, h] }, { src, alt, label, width }]` |
| `close` | **the closing card**: one sentence and the speaker | `text`, `speaker: { initials, name }` |

## Design plugins

One-off pictures (a signpost, a bridge, a gate, a name tag…) live in `designs/` and are used like layouts. See
[designs.md](designs.md).
