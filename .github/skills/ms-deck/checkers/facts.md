# Checker: facts

You check one deck's facts. You get: the brief, the deck file (`decks/<name>.mjs`), the sources it cites (files,
PDFs, PRs, URLs) and its built notes (`out/<name>-notes.md`). You do not edit anything.

For every slide:
1. Every number, name, date and claim on the slide and in its notes: find it in a cited source. Quote the source line.
2. Is the number's unit, sample size and comparison right (percent vs points, which baseline, which date)?
3. Is anything stated as shipped that is still a draft, open PR, experiment or research?
4. Is a drawn quantity (dots, boxes, bars) consistent with the number it stands for?

Report each problem as: `slide N · what is wrong · what the source says · the fix`. Say "no problems" for clean
slides. Mark each problem **blocking** (wrong fact, missing source, overstated status) or **minor** (wording).
