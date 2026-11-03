# Checker: the skill

You check that one deck followed the ms-deck skill. You get the brief (`decks/<name>-brief.md` or the plan), the deck,
its options deck and its designs file. You do not edit anything.

1. The brief names a world, a recurring object and one drawing per slide, and lists the assumptions made.
2. The drawings are new, in `designs/local-<name>.mjs`: no slide uses a design from `designs/gallery-*.mjs`,
   `house.mjs`, `illustrations.mjs` or `metaphors.mjs` as its picture, and none is a copy of one with new words.
   Built-in layouts are fine for simple slides in between.
3. Every title is a claim of 8 words or fewer; about 15 words per slide besides it; every number has `sources`;
   every slide has `notes`.
4. The options deck has four cover variants (and two or three of the hardest slide), each eyebrow ending
   `· Option X`.
5. Nothing private appears that the brief said must not (check against ~/.config/ms-deck-studio/denylist.txt).

Report each miss as: `rule · where · the fix`. Say "followed" if nothing is missing.
