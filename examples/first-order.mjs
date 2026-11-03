// Example: an illustrated pilot story, set in one world (a bakery) with one recurring object (the order ticket).
// Rosa's Bakery takes its first order for a recipe video from its website: three tries in one morning (the first with
// no flour, the second stopped by the back shutter, the third filmed), then recipe videos go on the menu.
// Ten slides, each drawn by a design in designs/gallery-pilot.mjs (pl-*).
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every name and number here is made up.
// Build: node src/build.mjs --deck first-order
const SAMPLE = 'Sample data, made up for this example';
const SPEAKER = { initials: 'YN', name: 'Your Name', role: 'Rosa\u2019s Bakery  \u00b7  Nov 2026' };
const FRAME = 'assets/samples/sample-bread.svg';
const RECIPES = ['Focaccia', 'Rye loaf', 'Cinnamon buns', 'Pretzels', 'Apple tart', 'Sourdough'];

const cover = {
	id: 'cover', layout: 'pl-cover', look: 'line',
	eyebrow: 'Rosa\u2019s Bakery  \u00b7  12 Oct',
	title: 'From an order slip to a recipe video',
	sub: 'Three tries in one morning, one shutter, one fix.',
	speaker: SPEAKER,
	pills: [{ text: '34 min', icon: 'timer', tone: 'purple' }, { text: '1:45 video', icon: 'video', tone: 'green' }, { text: 'Trial bake', icon: 'beaker', tone: 'orange' }],
	ticket: { head: '12 Oct', icon: 'receipt', label: 'Order slip', lines: [{ text: '6 recipes', icon: 'list', dim: true }, { text: 'Rye loaf', icon: 'play', hi: true, tone: 'blue', nolint: true }] },
	oven: 'Oven',
	video: { src: FRAME, label: 'Video, 1:45', time: '1:45', progress: 0.4, alt: 'A frame of the recipe video: a rye loaf on a board' },
	sources: [SAMPLE],
	say: 'This is the story of one order slip and the video it became.',
	notes: 'Rosa\u2019s Bakery started taking orders for short recipe videos from its website. The first order asked for six recipes. The first two tries stopped before the oven was even lit; the third filmed a 1:45 video in 34 minutes. This talk is what it took and what the bakery learned. Every name and number here is made up.',
};

const prep = {
	id: 'prep', layout: 'pl-prep', look: 'scene',
	eyebrow: 'The fix',
	title: 'Stock the shelf before the shutter comes down',
	supplier: 'Mill',
	setup: { text: 'Early crew', icon: 'arrowRight' },
	shutter: { text: 'Shutter down at 7', icon: 'lock' },
	ready: { text: '6 of 6 flours on the shelf', icon: 'checkCircle' },
	shelfLabel: '6 flours the recipes need',
	oven: 'Oven',
	clicks: [
		{ caption: 'The early crew brings in every flour', say: 'Before seven, the early crew carries in every flour the order needs.' },
		{ caption: 'Then the shutter comes down', say: 'Then the back shutter comes down at seven, as it always does.' },
		{ caption: 'The oven bakes from the shelf', say: 'The bakers take what they need from the shelf, so the shutter no longer matters.' },
	],
	sources: [SAMPLE],
	say: 'Stock the shelves before service starts.',
	notes: 'The fix: the early crew reads the order and brings in every flour it names before seven, before the back shutter comes down. The bakers then take from the shelf all morning. On the third try all six flours were on the shelf this way. Leaving the shutter up would let the cold in all morning.',
};

export default {
	title: 'From an order slip to a recipe video',
	file: 'first-order',
	ref: 'Rosa\u2019s Bakery  \u00b7  Recipe videos  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [
		cover,
		{
			id: 'ask', layout: 'pl-sort',
			eyebrow: 'The order',
			title: 'Six recipes asked for, one video made',
			ticket: {
				head: 'Website order, 12 Oct', icon: 'receipt',
				lines: [
					{ text: RECIPES[0], icon: 'bookOpen', tone: 'neutral', nolint: true },
					{ text: RECIPES[1], icon: 'play', bold: true, hi: true, tone: 'blue', nolint: true },
					...RECIPES.slice(2).map(text => ({ text, icon: 'history', dim: true, nolint: true })),
				],
			},
			trays: [
				{ value: 1, label: 'video', tone: 'blue', ref: RECIPES[1] },
				{ value: 1, label: 'a card is enough', tone: 'neutral', ref: RECIPES[0] },
				{ value: 4, label: 'for another day', tone: 'neutral', dim: true },
			],
			note: { icon: 'info', text: 'One video for the trial; the other four wait for a reply' },
			sources: [SAMPLE],
			say: 'One slip in, and the kitchen decides what deserves a video.',
			notes: 'The order listed six recipes. The kitchen sorted them: one video (the rye loaf), one that a printed recipe card explains better than a video (focaccia), and four for another day, each one reply away. The cap of one video was set for the trial.',
		},
		{
			id: 'tries', layout: 'pl-rail',
			eyebrow: 'What happened  \u00b7  12 Oct',
			title: 'Three tries in one morning, one video',
			tag: { text: 'Trial bake', tone: 'orange', icon: 'beaker' },
			tickets: [
				{ head: 'Try 1', icon: 'receipt', time: '6:05', big: { value: '4', unit: 'min', tone: 'red' }, lines: [{ text: 'No flour', icon: 'dismissCircle', tone: 'red' }], stamp: { text: 'Stopped', tone: 'red' } },
				{ head: 'Try 2', icon: 'receipt', time: '7:10', big: { value: '2', unit: 'min', tone: 'red' }, lines: [{ text: 'Shutter', icon: 'lock', tone: 'red' }], stamp: { text: 'Stopped', tone: 'red' } },
				{ head: 'Try 3', icon: 'receipt', time: '8:30', big: { value: '34', unit: 'min', tone: 'green' }, lines: [{ text: 'Video filmed', icon: 'video', tone: 'green' }], stamp: { text: 'Served', tone: 'green' } },
			],
			clicks: [
				{ caption: 'Try 1 stops at the flour', say: 'The first try never had flour to bake with.' },
				{ caption: 'Try 2 hits the shutter', say: 'The second one knew why, and stopped cleanly.' },
				{ caption: 'Try 3 serves a video', say: 'The third one was filmed, in 34 minutes.' },
			],
			sources: [SAMPLE],
			say: 'Three tries, about two and a half hours from first to last.',
			notes: 'All three were trial bakes: the same order, handled exactly as if a customer had placed it, with the video kept in the shop. Between the tries the kitchen changed one thing: each try\u2019s lesson went into the routine before the next one started.',
		},
		{
			id: 'try1', layout: 'pl-door',
			eyebrow: 'Try 1  \u00b7  6:05',
			title: 'Try 1 had no rye flour at all',
			big: { value: '4', unit: 'min', tone: 'red', sub: 'then it stopped, with no video' },
			supplier: 'Mill',
			door: { text: 'Mill: closed', icon: 'dismissCircle' },
			shelf: { text: 'No rye flour', icon: 'box' },
			cook: { text: 'No delivery key', icon: 'key' },
			oven: 'Oven',
			sources: [SAMPLE],
			say: 'No flour, so nothing to film.',
			notes: 'The baker came in at six. The mill\u2019s depot was still closed and nobody had the key for the delivery cage, so there was no rye flour, let alone the other five. The try stopped after four minutes with no plan and no video.',
		},
		{
			id: 'try2', layout: 'pl-hatch',
			eyebrow: 'Try 2  \u00b7  7:10',
			title: 'The recipe got through, the flour didn\u2019t',
			big: { value: '2', unit: 'min', tone: 'red' },
			supplier: 'Mill',
			hatch: { text: 'Recipe card: in', icon: 'checkCircle' },
			door: { text: 'Flour sacks: blocked', icon: 'dismissCircle' },
			reply: {
				head: 'Note', icon: 'receipt',
				lines: [
					{ text: 'The shutter is down', icon: 'lock', tone: 'red' },
					{ text: 'Flour before 7', icon: 'clock', tone: 'neutral' },
					{ text: 'Stopping', icon: 'handStop', dim: true },
				],
			},
			oven: 'Oven',
			sources: [SAMPLE],
			say: 'This time the kitchen said exactly what was wrong, and stopped.',
			notes: 'After the first try, the kitchen learned to name what was missing. On the second try, the recipe card came in through the hatch, but the flour sacks could not: the back shutter comes down at seven when the shop opens. The baker left one note saying what to change, and stopped after two minutes.',
		},
		prep,
		{
			id: 'minutes', layout: 'pl-time',
			eyebrow: 'Try 3  \u00b7  34 minutes',
			title: 'Proving took almost half the time',
			timer: { value: 34, max: 60, sub: 'of 60 min booked', tone: 'blue' },
			kicker: 'Try 3, minutes by step',
			parts: [
				{ label: 'Proving', seconds: 960, value: '16', tone: 'orange', hi: true },
				{ label: 'Filming', seconds: 540, value: '9' },
				{ label: 'Editing and tasting', seconds: 360, value: '6', tone: 'purple' },
				{ label: 'Baking and\nchecks', seconds: 180, value: '3' },
			],
			note: { icon: 'cut', text: 'A second proof took 8 minutes; now done overnight' },
			sources: [SAMPLE],
			say: 'Most of the slowest step was a second proof nobody needed.',
			notes: 'The third try took 34 of the 60 minutes the kitchen had booked. Proving took 16 of them, and a second proof was 8 minutes of that; the dough now proves overnight. Editing and tasting is the time left after the bake.',
		},
		{
			id: 'served', layout: 'pl-pass',
			eyebrow: 'Try 3  \u00b7  served',
			title: 'A 1:45 video, tasted and signed off',
			video: { src: FRAME, time: '1:45', progress: 0.4, label: 'The video, 1:45', alt: 'A frame of the recipe video: a rye loaf on a board' },
			ticket: {
				head: RECIPES[1], icon: 'receipt',
				lines: [
					{ text: 'Crumb test passed', icon: 'checkCircle', tone: 'green' },
					{ text: '12 steps on camera', icon: 'videoClip' },
					{ text: 'Matches the recipe card', icon: 'docCheck' },
				],
				stamp: { text: 'Signed off', tone: 'green' },
			},
			spikeLabel: 'The order, done',
			sheet: { src: FRAME, tile: true, label: 'Contact sheet', alt: 'The video\u2019s contact sheet' },
			sources: [SAMPLE],
			say: 'A real video of a real loaf, every step checked against the card.',
			notes: 'The video shows the rye loaf in five beats; the frame shown is the finished loaf. The crumb was cut and tested, all twelve steps were filmed, the video was checked against the printed recipe card, and Rosa tasted the loaf and signed it off.',
		},
		{
			id: 'habits', layout: 'pl-habits',
			eyebrow: 'What we learned',
			title: 'Three habits from the tries',
			items: [{ title: 'Stock before the shutter' }, { title: 'Say what is missing, then stop' }, { title: 'Time every step' }],
			ticket: { head: 'Note', icon: 'receipt', lines: [{ text: 'rye flour', icon: 'dismissCircle', tone: 'red', nolint: true }], stamp: { text: 'Stopped', tone: 'red' } },
			timer: { value: 34, max: 60, label: '34', sub: 'min' },
			sources: [SAMPLE],
			say: 'Prepare first, say plainly what is wrong, and watch the clock.',
			notes: 'Stock before the shutter: the early crew brings in what the order needs. Say what is missing, then stop: one note that says what to change beats a bake that guesses. Time every step: the clock showed that proving, not baking, was slow.',
		},
		{
			id: 'menu', layout: 'pl-menu', bg: 'blue',
			eyebrow: 'On the menu and on trial',
			title: 'Two things on the menu, one on trial',
			bell: { text: 'Order on the website', code: 'Show me how' },
			board: {
				label: 'On the menu',
				items: [
					{ icon: 'video', title: 'Recipe videos', sub: 'ordered on the website', pill: { text: 'On the menu', tone: 'green', icon: 'checkmark' }, date: '20 Oct 2026' },
					{ icon: 'receipt', title: 'Recipe cards', sub: 'printed at the till', pill: { text: 'On the menu', tone: 'green', icon: 'checkmark' }, date: '28 Oct 2026' },
					{ icon: 'beaker', title: 'Filming before opening', sub: 'early shift', pill: { text: 'Trial', tone: 'orange', icon: 'beaker' }, date: '14 Oct 2026' },
				],
			},
			sources: [SAMPLE],
			say: 'You can order one today: ask for a video of your favourite loaf.',
			notes: 'Recipe videos and printed recipe cards both went on the menu in October. Filming one video on the early shift, before the shop opens, is on trial. Every name and date here is made up.',
		},
	],
};
