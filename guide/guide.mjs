// The guide: how to make slides in the Microsoft look, at three levels of craft. It is a reference document, not a
// talk: its pages show slides (built from guide/specimens.mjs with neutral content) and explain them.
// Build: npm run guide  ->  out/guide.pdf, out/guide-handout.pdf (each page with its notes)
import specimens from './specimens.mjs';
import { deckPages } from '../src/pages.mjs';

// Where each specimen was drawn: its id (and click) -> the PNG of that page.
const PNG = new Map();
deckPages(specimens).pages.forEach((p, i) => {
	const file = `out/specimens-slides/${String(i + 1).padStart(3, '0')}.png`;
	if (p.first) {
		PNG.set(p.s.id, file);
	}
	if (p.step) {
		PNG.set(`${p.s.id}#${p.step}`, file);
	}
});
const png = id => {
	if (!PNG.has(id)) {
		throw new Error(`guide: no specimen "${id}" in guide/specimens.mjs`);
	}
	return PNG.get(id);
};
const card = (id, name, text) => ({ src: png(id), name, text });

const GUIDE = 'Microsoft deck guide';
const chapter = name => `${GUIDE}  \u00b7  ${name}`;

const intro = {
	id: 'intro', title: 'Introduction', ref: GUIDE,
	slides: [
		{ id: 'cover', layout: 'guide-cover', eyebrow: 'Guide  \u00b7  November 2026', title: 'Microsoft\ndeck guide',
			sub: 'How to make slides in the Microsoft look, from a quick update to a big talk.',
			meta: 'Federico Brancasi  \u00b7  Microsoft',
			shots: [{ src: png('s1-scorecard'), label: 'Simple' }, { src: png('h-dumbbell'), label: 'Graphs' }, { src: png('h-flow'), label: 'Illustrations' }],
			notes: 'The guide shows slides instead of describing them. Every example is built with the kit, from neutral sample content.' },
		{ id: 'contents', layout: 'guide-contents', eyebrow: 'Contents', title: 'What is in this guide',
			items: [],
			notes: 'Read the first two pages, then jump to the level you need. The foundations apply to every level.' },
		{ id: 'levels', layout: 'guide-levels', eyebrow: 'Three levels', title: 'One look, three levels of craft',
			levels: [
				{ title: 'Simple', src: png('s1-breakdown'), use: 'Updates and reviews: numbers and words carry it.', layouts: 'cards  scorecard  bignumber  breakdown  versus  takeaways' },
				{ title: 'Graphs', src: png('s2-lanes'), use: 'Reports: a chart or a diagram carries it.', layouts: 'bars  funnel  matrix  flow  pipeline  lanes  timeline  cycle' },
				{ title: 'Illustrations', src: png('h-flow'), use: 'Big talks: a drawn object carries it.', layouts: 'fork-cover  sieve  flow-bands  dumbbell  ladders  launch' },
			],
			notes: 'Pick the level for the deck, not for each slide: a simple deck can borrow one chart, a talk can use simple cards between drawings. All three share the same colours, type and frame, so they mix.' },
		{ id: 'rules', layout: 'cards', title: 'Every slide makes one point',
			hero: { label: 'The rule', title: 'One slide, one point', sub: 'The title says it. The rest proves it.' },
			stat: { value: '25', label: 'words at most', sub: 'besides the title', tone: 'blue' },
			items: [
				{ title: 'A claim', text: 'The title is the sentence to remember.' },
				{ title: 'A picture', text: 'Cards, a chart or a drawing carry it.' },
				{ title: 'A source', text: 'Every number names where it comes from.' },
			],
			notes: 'This page is itself a level-1 slide (the cards layout). The three habits apply at every level: a claim in the title, something that shows it, and a source under every number.' },
	],
};

const foundations = {
	id: 'foundations', title: 'Foundations', sub: 'Frame, colour, type, do and don\u2019t', ref: chapter('Foundations'),
	slides: [
		{ id: 'anatomy', layout: 'guide-anatomy', eyebrow: 'Anatomy', title: 'Every slide has the same frame', src: png('s2-bars'),
			pins: [{ x: 530, y: 52 }, { x: 1730, y: 52 }, { x: 300, y: 104 }, { x: 1040, y: 160 }, { x: 1690, y: 160 }, { x: 700, y: 480 }, { x: 520, y: 1018 }, { x: 640, y: 1066 }],
			items: [
				{ title: 'Header line', text: 'Deck, context, date' },
				{ title: 'Counter', text: 'Slide number of total' },
				{ title: 'Eyebrow', text: 'The topic, 2\u20134 words, blue caps' },
				{ title: 'Title', text: 'The claim, 8 words or fewer' },
				{ title: 'Tag', text: 'Optional: Preview, Prototype' },
				{ title: 'The picture', text: 'Most of the page' },
				{ title: 'Sources', text: 'One line, every number' },
				{ title: 'Progress bar', text: 'Where we are in the deck' },
			],
			notes: 'The build adds the header line, the counter, the sources line and the progress bar to every slide; covers and closing cards drop them. You write the eyebrow, the title and the body.' },
		{ id: 'grid', layout: 'guide-anatomy', eyebrow: 'Grid', title: 'A 1920 \u00d7 1080 page, 96 px margins', src: png('s1-cards'),
			boxes: [{ x: 96, y: 30, w: 1728, h: 48, label: '1' }, { x: 96, y: 86, w: 1728, h: 120, label: '2' }, { x: 96, y: 236, w: 1728, h: 694, label: '3' }, { x: 96, y: 990, w: 1728, h: 56, label: '4' }],
			items: [
				{ title: 'Header', text: 'Small grey line and counter' },
				{ title: 'Eyebrow and title', text: '21 px caps, 56 px title' },
				{ title: 'Body', text: '1728 \u00d7 694 px, the picture lives here' },
				{ title: 'Footer', text: 'Sources, then a 6 px progress bar' },
			],
			notes: 'Slides are 16:9 at 1920 \u00d7 1080. Text never leaves the safe area (60\u20131860 \u00d7 24\u20131062); the build checks it. Corners are 14\u201322 px; lines 1.5\u20133 px; no blurred shadows anywhere.' },
		{ id: 'colour', layout: 'guide-swatches', eyebrow: 'Colour', title: 'Each colour always means the same thing',
			colors: [
				{ name: 'Blue', hex: '#0078D4', tint: '#EEF4FD', role: 'Primary, neutral, the point', ratio: '4.53 : 1' },
				{ name: 'Green', hex: '#107C10', tint: '#EEF7EA', role: 'Good, done, a gain', ratio: '5.37 : 1' },
				{ name: 'Red', hex: '#D13438', tint: '#FBEEED', role: 'Bad, a loss. Rarely.', ratio: '4.93 : 1' },
				{ name: 'Orange', hex: '#D83B01', tint: '#FCF1EC', role: 'Attention, a warning', ratio: '4.62 : 1' },
				{ name: 'Purple', hex: '#8661C5', tint: '#F3EFFA', role: 'The AI, the model', ratio: '4.64 : 1' },
				{ name: 'Grey', hex: '#5F6168', tint: '#F5F6F8', role: 'Context, not the point', ratio: '6.18 : 1' },
			],
			neutrals: [
				{ name: 'Ink', hex: '#1B1B1F', role: 'titles' },
				{ name: 'Body', hex: '#5F6168', role: 'text' },
				{ name: 'Muted', hex: '#72767E', role: 'small text' },
				{ name: 'Line', hex: '#E3E6EB', role: 'rules' },
				{ name: 'Surface', hex: '#F5F6F8', role: 'cards' },
			],
			notes: 'The ratios are contrast on white; every text colour passes WCAG AA. Tints are for backgrounds, never for text. Pair colour with an icon or a word so the slide still reads in black and white.' },
		{ id: 'type', layout: 'guide-typescale', eyebrow: 'Type', title: 'One type scale for every slide',
			rows: [
				{ role: 'Title XL', spec: '78 px  \u00b7  600', cls: 'st-title-xl', sample: 'Covers and closing lines' },
				{ role: 'Title', spec: '56 px  \u00b7  600', cls: 'st-title', sample: 'The claim on every slide' },
				{ role: 'Sub', spec: '27 px  \u00b7  400', cls: 'st-sub', sample: 'One line under a title or a big number' },
				{ role: 'Card title', spec: '30 px  \u00b7  600', cls: 'st-h3', sample: 'A card or a panel title' },
				{ role: 'Body', spec: '24 px  \u00b7  400', cls: 'st-body', sample: 'Text in cards, captions and table cells' },
				{ role: 'Eyebrow', spec: '21 px  \u00b7  600  \u00b7  caps', cls: 'st-eyebrow', sample: 'The topic' },
				{ role: 'Footnote', spec: '18 px  \u00b7  400', cls: 'st-foot', sample: 'Sources: where every number comes from' },
			],
			notes: 'Aptos when Microsoft Office is installed (embedded in the PDF), then Segoe UI, then Inter. Code in Menlo or Cascadia Mono. Numbers are tabular so columns line up.' },
		{ id: 'dont-words', layout: 'guide-pair', eyebrow: 'Do and don\u2019t', title: 'Say the point, then show it',
			items: [
				{ kind: 'dont', src: png('x-wall'), text: 'A topic for a title, and a paragraph per bullet.' },
				{ kind: 'do', src: png('x-claim'), text: 'The claim as the title, and a chart that proves it.' },
			],
			notes: 'Same content twice. The left slide makes people read; the right one tells them what to think and shows why. Everything that was on the left goes into the speaker notes.' },
		{ id: 'dont-colour', layout: 'guide-pair', eyebrow: 'Do and don\u2019t', title: 'Colour marks what matters',
			items: [
				{ kind: 'dont', src: png('x-rainbow'), text: 'A colour per bar: the eye has nowhere to go.' },
				{ kind: 'do', src: png('x-claim'), text: 'Grey for context, blue for the point.' },
			],
			notes: 'Colour is a signal, not decoration. One tone for the point, grey for the rest, and green or red only when something is better or worse.' },
	],
};

const simple = {
	id: 'simple', title: 'Level 1: Simple', sub: 'Cards, big numbers, scorecards', ref: chapter('Level 1  \u00b7  Simple'),
	slides: [
		{ id: 'simple-a', layout: 'guide-catalog', eyebrow: 'Level 1  \u00b7  Simple', title: 'Cards and big numbers carry the point',
			items: [
				card('s1-cards', 'cards', 'An overview in one page'),
				card('s1-scorecard', 'scorecard', 'Two numbers, head to head'),
				card('s1-bignumber', 'bignumber', 'One number that is the point'),
				card('s1-breakdown', 'breakdown', 'A change per category'),
				card('s1-versus', 'versus', 'Two options, pros and costs'),
				card('s1-takeaways', 'takeaways', 'What to take away'),
			],
			notes: 'Level 1 needs no drawing: tinted panels, big numbers in the meaning colours and short labels. These six layouts cover most updates and reviews.' },
		{ id: 'simple-b', layout: 'guide-catalog', eyebrow: 'Level 1  \u00b7  Simple', title: 'Openers, statements and closers',
			items: [
				card('s1-title', 'title', 'The cover'),
				card('s1-statement', 'statement', 'One sentence, one mark'),
				card('s1-counters', 'counters', 'Up to three numbers'),
				card('s1-checklist', 'checklist', 'Three to five actions'),
				card('s1-quote', 'quote', 'Real words, with a name'),
				card('s1-close', 'close', 'One line, or questions'),
			],
			notes: 'Use a full-colour page (bg: blue or dark) once or twice per deck for rhythm, on a quote or a statement.' },
	],
};

const graphs = {
	id: 'graphs', title: 'Level 2: Graphs', sub: 'Charts, tables, diagrams, builds', ref: chapter('Level 2  \u00b7  Graphs'),
	slides: [
		{ id: 'graphs-data', layout: 'guide-catalog', eyebrow: 'Level 2  \u00b7  Graphs', title: 'Charts and tables for numbers',
			items: [
				card('s2-bars', 'bars', 'Compare values, one highlighted'),
				card('s2-funnel', 'funnel', 'How a number narrows'),
				card('s2-matrix', 'matrix', 'A results table'),
				card('s2-hero', 'hero', 'One giant number'),
				card('s2-split', 'split', 'Before and after'),
				card('s2-timeline', 'timeline', 'Dates and today'),
			],
			notes: 'Level 2 adds charts and diagrams drawn from data. Label values directly, say the unit and the sample size, start bars at zero, and highlight the one the title talks about.' },
		{ id: 'graphs-flow', layout: 'guide-catalog', eyebrow: 'Level 2  \u00b7  Graphs', title: 'Diagrams for how things work',
			items: [
				card('s2-flow', 'flow', 'Steps with yes / no branches'),
				card('s2-pipeline', 'pipeline', 'Stages left to right'),
				card('s2-lanes', 'lanes', 'Who does what'),
				card('s2-cycle', 'cycle', 'A loop that repeats'),
				card('s2-layers', 'layers', 'A stack of parts'),
				card('s2-quad', 'quad', 'A 2 \u00d7 2 decision'),
			],
			notes: 'A diagram replaces a list when the order, the owner or the loop is the point. Boxes are things, lines are relationships, position means something.' },
		{ id: 'graphs-chart', layout: 'guide-anatomy', eyebrow: 'Level 2  \u00b7  Graphs', title: 'A chart makes one point', src: png('x-claim'),
			pins: [{ x: 1030, y: 160 }, { x: 1304, y: 660 }, { x: 1225, y: 374 }, { x: 625, y: 906 }, { x: 300, y: 1016 }],
			items: [
				{ title: 'The title is the finding', text: 'Not \u201cGrowth by region\u201d' },
				{ title: 'One highlight', text: 'Blue for the point, grey for context' },
				{ title: 'Values on the bars', text: 'No axis to read' },
				{ title: 'What is measured', text: 'The unit, in one line' },
				{ title: 'Where it comes from', text: 'Every chart has a source' },
			],
			notes: 'The same rules apply to tables: the baseline first, the change last, the overall row tinted, green and red only with a tick or a cross.' },
		{ id: 'graphs-build', layout: 'guide-strip', eyebrow: 'Level 2  \u00b7  Builds', title: 'A click is the next page of the PDF',
			rows: [{ items: [
				{ src: png('s2-build#1'), caption: '**Click 1.** One item, and a caption that says it.' },
				{ src: png('s2-build#2'), caption: '**Click 2.** The new item is bright, the old one fades.' },
				{ src: png('s2-build#3'), caption: '**Click 3.** Nothing moves; the caption changes.' },
			] }],
			notes: 'Add clicks: [{ caption, say }] to any list-like layout. There are no animations: each click is a real page, so the deck plays in any PDF viewer. If you cannot write the caption, you do not need the click.' },
		{ id: 'graphs-code', layout: 'guide-catalog', eyebrow: 'Level 2  \u00b7  Graphs', title: 'Code and commands, with callouts', cols: 2,
			items: [
				card('s2-code', 'code', 'Up to 12 lines, notes beside them'),
				card('s2-terminal', 'terminal', 'Commands and their output'),
			],
			notes: 'Code is 8 lines or fewer when you can, and the slide says in words what it does. Highlight the line that matters.' },
	],
};

const drawn = {
	id: 'drawn', title: 'Level 3: Illustrations', sub: 'Drawn objects and click-by-click pictures', ref: chapter('Level 3  \u00b7  Illustrations'),
	slides: [
		{ id: 'drawn-why', layout: 'takeaways', eyebrow: 'Level 3  \u00b7  Illustrations', title: 'A drawn object makes an idea stick',
			items: [
				{ label: 'One object', title: 'Pick an everyday thing that is the idea', text: 'A gate, a key, a road sign. If the names could be swapped for any topic, pick another.' },
				{ label: 'Drawn in code', title: 'Draw a new picture for every deck', text: 'The designs here show the style. Invent your own object for your idea.' },
				{ label: 'Same look', title: 'Same colours, lines and type as levels 1 and 2', text: 'So drawings sit next to cards and charts.' },
			],
			notes: 'Save level 3 for talks people should remember. docs/designs.md shows how to write a new design.' },
		{ id: 'drawn-a', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Illustrations', title: 'One object per idea',
			items: [
				card('s3-roadsign', 'roadsign', 'A change, as a warning sign'),
				card('s3-gate', 'gate', 'Advice versus a real barrier'),
				card('s3-metro', 'metro', 'A decision as a metro map'),
				card('s3-keyring', 'keyring', 'Levels of access as keys'),
				card('s3-gears', 'gears', 'Checks that must all turn'),
				card('s3-balloon', 'balloon', 'What to drop to go faster'),
			],
			notes: 'Six of the designs in designs/. Each takes plain fields (a label, a few lines, a tone) and draws the object around them.' },
		{ id: 'house', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  House style', title: 'The six slides people pick',
			items: [
				card('h-cover', 'fork-cover', 'The idea, drawn on the cover'),
				card('h-sieve', 'sieve', 'Numbers you can count'),
				card('h-flow', 'flow-bands', 'A flow sized by share'),
				card('h-dumbbell', 'dumbbell', 'The few that matter, bold'),
				card('h-ladders', 'ladders', 'One object, giant results'),
				card('h-launch', 'launch', 'A drawn close'),
			],
			notes: 'When three versions of the same deck were compared side by side, these six slides won. They share one drawing style and very few words. examples/front-desk.mjs uses all six in order; start there for an illustrated deck.' },
		{ id: 'more-a', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  More illustrations', title: 'Machines for how it works',
			items: [
				card('m-factory', 'factory', 'Steps as machines on a belt'),
				card('m-orbit', 'orbit', 'One engine, many products'),
				card('m-devices', 'devices', 'What goes in, what comes out'),
				card('m-hopper', 'hopper', 'Many in, a few out'),
				card('m-film', 'film-strip', 'Scenes, pictures or drawn cells'),
				card('m-picture', 'picture-cover', 'A cover with a real picture'),
			],
			notes: 'From designs/illustrations.mjs. Use them when the slide explains a process or a product: the factory builds one machine per click, film-strip and picture-cover take real stills (from an animated webp, extract full frames with magick file.webp -coalesce frame-%03d.png).' },
		{ id: 'more-b', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  More illustrations', title: 'Objects for counting and comparing',
			items: [
				card('m-stopwatch', 'stopwatch', 'Time, split into parts'),
				card('m-odometer', 'odometer', 'Big running totals'),
				card('m-scales', 'scales', 'Two values that should match'),
				card('m-pinboard', 'pinboard', 'Bugs found, and what changed'),
				card('m-moving', 'moving', 'A migration against a deadline'),
			],
			notes: 'Each object carries one number story: a stopwatch for speed, an odometer for volume, scales for parity, a pinboard for problems found, a moving van for a migration. Keep labels to a word or two; the object does the talking.' },
		{ id: 'worlds', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Gallery', title: 'Three decks, three worlds', cols: 3,
			items: [
				card('w-port-cover', 'new-terminal', 'A port: boxes you can count'),
				card('w-film-cover', 'daily-film', 'A cinema: a page becomes film'),
				card('w-studio-cover', 'pr-videos', 'A studio: the agent inside the projector'),
				card('w-port-light', 'the same world', 'A lighthouse finds the hazards'),
				card('w-film-spot', 'the same world', 'Spotlights pick ten of many'),
				card('w-studio-shelf', 'the same world', 'Shelves you count in fives'),
			],
			notes: 'Each illustrated example lives in one world chosen from its topic, with one object that comes back on every slide. They show the bar, not a template: a new deck picks its own world and draws its own pictures. docs/illustrating.md explains the method.' },
		{ id: 'worlds2', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Gallery', title: 'Four more worlds, drawn in detail', cols: 4,
			items: [
				card('w2-kitchen-cover', 'tasting-pass', 'A kitchen'),
				card('w2-pet-cover', 'pet-studio-example', 'A film set'),
				card('w2-walk-cover', 'code-walkthroughs-example', 'A press'),
				card('w2-bakery-cover', 'first-order', 'A bakery'),
				card('w2-kitchen-pass', 'kitchen', 'One chef, every pose'),
				card('w2-pet-reels', 'film set', 'Reels on iPhones'),
				card('w2-walk-shoot', 'press', 'Filmed in the app'),
				card('w2-bakery-door', 'bakery', 'A door that closes'),
			],
			notes: 'These four were made by agents that knew only this kit and its skill, then refined from one round of feedback: the characters and devices drawn in full detail (docs/illustrating.md, The detail bar). Two are real projects with public sources (the pet and the code walkthroughs); in the other two every name and number is made up.' },
		{ id: 'worlds3', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Gallery', title: 'Six more worlds', cols: 3,
			items: [
				card('w3-rail', 'freight-line', 'A railway'),
				card('w3-switch', 'switchboard', 'A switchboard'),
				card('w3-tailor', 'fitting-room', 'A tailor\u2019s rack'),
				card('w3-airport', 'green-channel', 'A customs hall'),
				card('w3-chat', 'chat-media', 'A voice and a pen'),
				card('w3-bench', 'agents-speed', 'A workbench'),
			],
			notes: 'Six more decks, each in its own world. Two are real work with public sources (chat-media and agents-speed); in the others every name and number is made up. The gallery website shows every page of every deck.' },
		{ id: 'cast', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Characters', title: 'People and an agent, drawn once', cols: 1,
			items: [card('p-cast', 'src/characters.mjs', "person() and agent(): poses, outfits and what they hold")],
			notes: 'Characters for any deck: a person with a face, hair, clothes and hands, in six poses, holding a laptop, a clipboard, a phone, a mug, a wrench, a flag or a magnifier; and the agent, a friendly robot in the AI\u2019s purple. docs/designs.md, Characters.' },
		{ id: 'props', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Props', title: 'Devices and windows, drawn once', cols: 1,
			items: [card('p-props', 'src/props.mjs', 'phone, laptop, monitor, appWindow, browser: frames that hold a real screen')],
			notes: 'Props are detailed frames for the devices and windows illustrated decks keep needing. They hold a real screenshot or your own HTML and draw the device around it with true proportions, so you can spend your drawing time on the idea. docs/designs.md, Props.' },
		{ id: 'drawn-b', layout: 'guide-catalog', eyebrow: 'Level 3  \u00b7  Illustrations', title: 'Stories and conversations', cols: 2,
			items: [
				card('s3-story', 'story', 'What happened, in beats'),
				card('s3-convo', 'convo', 'A conversation, one message per click'),
			],
			notes: 'A story comes right before the point it supports: when, who, what happened, the outcome. A conversation builds one message per click and keeps every word as it was said.' },
	],
};

const using = {
	id: 'using', title: 'Writing and shapes', sub: 'Titles, deck outlines, the checks', ref: chapter('Writing and shapes'),
	slides: [
		{ id: 'writing', layout: 'matrix', eyebrow: 'Writing', title: 'Write the title last, as a claim',
			columns: [{ label: 'Instead of', width: '1fr' }, { label: 'Write', width: '1.3fr' }, { label: 'Why', width: '1.3fr' }],
			rows: [
				[{ text: 'Q3 results', ok: false }, { text: 'Q3 grew on two new markets', ok: true }, 'It says what to think'],
				[{ text: 'Architecture', ok: false }, { text: 'One queue replaces three services', ok: true }, 'It says what changed'],
				[{ text: '10/11', ok: false }, { text: '11 Oct 2026', ok: true }, 'It reads the same everywhere'],
				[{ text: '+8', ok: false }, { text: '+8 pts, 400 runs', ok: true }, 'It has a unit and a size'],
				[{ text: 'Game-changing', ok: false }, { text: 'Twice as fast', ok: true }, 'It can be checked'],
			],
			notes: 'Sentence case, no full stop, 8 words or fewer. Plain words, no hype, no emoji. Quotes word for word, with a name.' },
		{ id: 'shapes', layout: 'guide-strip', eyebrow: 'Deck shapes', title: 'Three outlines, one per level', arrows: false,
			rows: [
				{ label: 'An update', sub: 'Level 1  \u00b7  5\u20138 slides', items: ['s1-title', 's1-cards', 's1-scorecard', 's1-breakdown', 's1-versus', 's1-takeaways', 's1-close'].map(id => ({ src: png(id) })) },
				{ label: 'A report', sub: 'Level 2  \u00b7  8\u201314 slides', items: ['s1-title', 's1-statement', 's2-pipeline', 's2-split', 's2-flow', 's2-bars', 's1-checklist'].map(id => ({ src: png(id) })) },
				{ label: 'A talk', sub: 'Level 3  \u00b7  6\u201312 slides', items: ['h-cover', 'h-sieve', 'h-flow', 'h-dumbbell', 'h-ladders', 'h-launch'].map(id => ({ src: png(id) })) },
			],
			notes: 'Start with the finding, not the method. Show one real example before an average. End on what to do. The examples/ folder has a full deck for each shape.' },
		{ id: 'checks', layout: 'checklist', eyebrow: 'Before you present', title: 'Five checks before anyone sees it',
			items: [
				{ icon: 'checkCircle', tone: 'green', title: 'The build ends with \u201cChecks: clean\u201d', sub: '`npm run build -- --deck name`' },
				{ icon: 'link', tone: 'blue', title: 'Every link and QR code opens', sub: '`npm run links -- --deck name`' },
				{ icon: 'shieldLock', tone: 'purple', title: 'Nothing private is on a slide', sub: '`npm run privacy`' },
				{ icon: 'apps', tone: 'orange', title: 'The contact sheet looks even', sub: 'No page much busier than the rest' },
				{ icon: 'people', tone: 'blue', title: 'Someone new reads only the titles', sub: 'They should get the story' },
			],
			notes: 'The build checks overflow, overlap, the safe area, word counts, sources, notes, contrast and blurred shadows. The last check is a person: if the titles alone tell the story, the deck works.' },
		{ id: 'end', layout: 'close', text: 'One point per slide.\n{{blue|Show it, and source it.}}', speaker: { initials: 'FB', name: 'Federico Brancasi' },
			notes: 'The end.' },
	],
};

const sections = [intro, foundations, simple, graphs, drawn, using];

// The contents page lists the chapters with the page they start on.
let page = 0;
const starts = new Map();
for (const sec of sections) {
	starts.set(sec.id, page + 1);
	page += sec.slides.length;
}
intro.slides.find(s => s.id === 'contents').items = sections.slice(1).map(sec => ({ title: sec.title, sub: sec.sub, page: String(starts.get(sec.id)) }));

export default {
	title: 'Microsoft deck guide',
	file: 'guide',
	ref: GUIDE,
	variety: false,
	nosrc: true,
	maxWords: 140,
	sections,
};
