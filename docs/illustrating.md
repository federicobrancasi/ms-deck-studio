# Illustrating a deck

How the illustrated examples in this repo were made, as a method you can repeat on any topic. The examples show the bar;
they are **not templates**. A new deck takes the method and draws its own pictures.

| Example | World | Recurring object | Contact sheet |
| --- | --- | --- | --- |
| [demo-talk](../examples/demo-talk.mjs) | a team of agents | the six agents and their ideas | [PDF](../dist/examples/demo-talk.pdf) · [sheet](../dist/examples/demo-talk-contact.png) |
| [new-terminal](../examples/new-terminal.mjs) | a port | the shipping container | [PDF](../dist/examples/new-terminal.pdf) · [sheet](../dist/examples/new-terminal-contact.png) |
| [pet-studio-example](../examples/pet-studio-example.mjs) | a pixel film set | the real pet sprite | [PDF](../dist/examples/pet-studio-example.pdf) · [sheet](../dist/examples/pet-studio-example-contact.png) |
| [tasting-pass](../examples/tasting-pass.mjs) | a kitchen | one chef, drawn once, in every pose | [PDF](../dist/examples/tasting-pass.pdf) · [sheet](../dist/examples/tasting-pass-contact.png) |
| [daily-film](../examples/daily-film.mjs) | a cinema | the agent's projector | [PDF](../dist/examples/daily-film.pdf) · [sheet](../dist/examples/daily-film-contact.png) |
| [chat-media](../examples/chat-media.mjs) | a chat with a voice and a pen | the chat window | [PDF](../dist/examples/chat-media.pdf) · [sheet](../dist/examples/chat-media-contact.png) |
| [agents-speed](../examples/agents-speed.mjs) | a workbench | the job tag | [PDF](../dist/examples/agents-speed.pdf) · [sheet](../dist/examples/agents-speed-contact.png) |
| [freight-line](../examples/freight-line.mjs) | a railway | the train | [PDF](../dist/examples/freight-line.pdf) · [sheet](../dist/examples/freight-line-contact.png) |
| [switchboard](../examples/switchboard.mjs) | a switchboard | the patch cord | [PDF](../dist/examples/switchboard.pdf) · [sheet](../dist/examples/switchboard-contact.png) |
| [fitting-room](../examples/fitting-room.mjs) | a tailor's rack | the jacket on its hanger | [PDF](../dist/examples/fitting-room.pdf) · [sheet](../dist/examples/fitting-room-contact.png) |
| [green-channel](../examples/green-channel.mjs) | an airport customs hall | the suitcase on the belt | [PDF](../dist/examples/green-channel.pdf) · [sheet](../dist/examples/green-channel-contact.png) |
| [code-walkthroughs-example](../examples/code-walkthroughs-example.mjs) | a press and screens | the Agents window | [PDF](../dist/examples/code-walkthroughs-example.pdf) · [sheet](../dist/examples/code-walkthroughs-example-contact.png) |
| [first-order](../examples/first-order.mjs) | a bakery | the order ticket | [PDF](../dist/examples/first-order.pdf) · [sheet](../dist/examples/first-order-contact.png) |
| [pr-videos](../examples/pr-videos.mjs) | a studio | a screen with a play bar | [PDF](../dist/examples/pr-videos.pdf) · [sheet](../dist/examples/pr-videos-contact.png) |

Their drawings are in the `designs/gallery-*.mjs` files. Read them for technique. **Don't use them as a new deck's pictures**: if every talk is a harbour,
no talk is memorable.

## 1. Pick a world

One place the whole deck lives in, chosen from the topic, not from the gallery:

- A migration with a deadline is a **harbour**: ships leave a pier that is closing.
- Content that becomes video is a **cinema**: a page goes into a projector and comes out as film.
- Tools that make things are a **studio**: channels, tapes on a shelf, parcels at the counter.
- Others: a kitchen (recipes, ovens, plates), a railway (lines, stations, a timetable), a garden (seeds, beds, a
  harvest), a post office, a newsroom, an observatory, a workshop, a library.

Then pick **one recurring object** that stands for the unit of the story (a container is a test, a tape is a video)
and draw it the same way on every slide it appears on.

## 2. One picture per slide, in that world

Write a one-line drawing for every slide before building anything: the object, and what the numbers become.

| The slide says | Draw |
| --- | --- |
| What it is (cover) | the idea as a hero drawing on the right half: the input going in, the output on a screen |
| Many in, a few out | a crowd of dots with a few lit by spotlights |
| How it works | one machine with its parts in order: dominoes, faders on a desk, stamps on a manifest |
| Two versions match | two needles on one dial, two waveforms with matching ticks |
| Problems found | rocks lit by a lighthouse, each with a buoy and a label |
| A safety rule | a sealed envelope opened only after, a vault with cut cables |
| Volume | things you can count: boats, boxes, tapes in groups of five, with the total big beside them |
| Share | lanes of dots, the biggest one coloured, the rest grey |
| An incident | a storm, then the fix, then calm water, along a timeline |
| What's next | a drawn close: a switch about to flip, a mast broadcasting, a chart for the next trip |

Keep the house qualities on every slide: a claim as the title, about 15 words besides it, numbers you can count, the
few highlighted and the rest muted, purple for the AI, green for good, red for bad.

## 3. Draw it well

Every drawing is a design in `designs/local-<deck>.mjs` (see [designs.md](designs.md) for the rules and the helpers).
The checks catch overflow and contrast; these are the things a reviewer catches by eye, learnt from real reviews:

- **Nothing floats.** Objects rest on something: a projector on a table, a ship on the water, a tape on a shelf.
- **Parts stay inside their object.** A lens stays within the body's height; a label stays inside its tag.
- **Light starts at its source.** A beam leaves the lamp or the lens, not a point beside it.
- **Lines never cross.** Routes, cables and mooring lines take separate paths.
- **No empty corners**, and nothing crammed: balance the scene across the page.
- **Real objects, real proportions.** A projector has reels on arms and a film path; a lighthouse has a gallery, a
  lantern and a dome. Simple shapes, but the right ones.
- **The recurring object looks the same everywhere**: draw it with one helper function.
- **Pictures only if sharp.** Use a real screenshot or frame only at full resolution (extract frames from the master
  video with ffmpeg); otherwise draw the screen.
- **Labels are a word or two.** The notes carry the rest.

Look at every slide at full size, not just the contact sheet. Polish at least twice.

## The detail bar

What separates a slide people remember from a clip-art slide is the detail on the one or two objects it is about.
This list comes from real reviews of real decks; each line is what was asked for after a first version.

| Draw | Like this | Not like this |
| --- | --- | --- |
| **Characters** (a chef, a pilot, a clerk) | one shared helper, used in every pose: a pleated toque and band, a face, a double-breasted jacket with two rows of buttons, a neckerchief and an apron in the role's colour, hands that hold the role's tool (a ladle, a scorecard, a whisk) | a circle on a rectangle; a different body on every slide |
| **Devices** | the props in `src/kit.mjs` (`phone`, `laptop`, `monitor`, `appWindow`, `browser`): a real iPhone with a Dynamic Island and side buttons, the content filling its screen | a rounded rectangle with a picture pasted in, cropped or off-centre |
| **Machines** | real mechanics: a feed tray, rollers, a belt, an output tray, a panel with a dial; it stands on legs or a table | a box with an arrow in and an arrow out |
| **Sets and scenes** | the set *is* the idea (a director's chair for "the pet directs its film", a pass with a bell for "a judge sends it back") | props for decoration: a curtain, a random plant, confetti |
| **Real material** | the real sprites, at whole pixels (`pixelated: true`), and sharp stills extracted from the master | blurry screenshots, upscaled thumbnails |
| **Products** | the brand's logo beside its name (`logo('slack')`), small | logos as decoration, or a drawn imitation of one |
| **Screens inside drawings** | a real-looking UI: a title bar, a sidebar, the selected row, the status bar | three grey bars |
| **Every object** | resting on something, inside its own outline, light starting at its source, the same look every time it comes back | floating, overlapping a neighbour, a lens hanging below its body |

When the user loves a deck but asks for "better", it is almost always this table: keep the story and the layout,
and redraw the objects with more care.

## 4. Offer options for the slides that matter

For the cover, draw **four** variants (simple → rich, or four different objects); for the one or two hardest slides,
two or three in a separate `decks/<deck>-options.mjs`, each with `· Option A` in its eyebrow. Let the user pick, then swap
the winners into the deck. It's cheaper than arguing about one drawing.

## 5. Tools that help

- `npm run new -- <name> --world "…"` starts a deck with its drawings file, an options deck and a brief to fill in.
- The kit draws the common things for you, in the house style: devices (`phone`, `laptop`, `monitor`, `appWindow`,
  `browser`) and characters (`person`, `agent`); see [designs.md](designs.md).
- `npm run review -- --deck <name>` makes a review sheet for every page (the page and its four quarters zoomed) and
  flags large empty areas. Look at them, or give them to checker agents with the prompts in
  `.github/skills/ms-deck/checkers/`.
- `npm run pptx -- --deck <name>` when someone needs PowerPoint.

## 6. What to give the agent

To get a deck like the examples with little effort, give the agent (with the `ms-deck` skill):

- the **topic and the takeaway**: what the audience should think afterwards;
- the **facts with their sources**: numbers, dates, links, and what must not appear;
- **real material** if you have it: screenshots, video masters, quotes;
- the **level**: "illustrated" for decks like these.

For example:

> Make an illustrated deck (10 slides) about our move to the new build system. Audience: the whole team. Takeaway:
> it's done, builds are 3× faster, and here's what changed for you. Facts are in notes.md. Don't mention the vendor.

The agent picks a world, writes the brief with one drawing per slide, shows you options for the cover, and builds.
