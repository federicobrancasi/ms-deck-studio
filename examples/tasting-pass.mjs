// Example: an illustrated trial report, set in one world (a restaurant kitchen) with one recurring object (the order
// ticket) and one fully drawn character (the chef) in every pose. Bistro Lumen tries a tasting pass on a few dishes:
// one chef cooks, the head chef tastes and scores the plate, and below a 3 a second chef re-plates it before it goes
// out. Ten slides, each drawn by a design in designs/gallery-kitchen.mjs (gk-*).
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every name and number here is made up.
// Build: node src/build.mjs --deck tasting-pass
const SAMPLE = 'Sample data, made up for this example';
const SPEAKER = { initials: 'YN', name: 'Your Name', role: 'Bistro Lumen  \u00b7  Nov 2026' };

// Each chef: an accent colour, an icon on the apron badge and a first name.
const ANA = { accent: 'gold', icon: 'food', tag: 'Ana' };
const BEN = { accent: 'teal', icon: 'food', tag: 'Ben' };
const CLEO = { accent: 'indigo', icon: 'food', tag: 'Cleo' };
const DEV = { accent: 'magenta', icon: 'food', tag: 'Dev' };

const TRIES = [
	{ name: 'Three dishes + bread', core: 'Three dishes', extra: ['Bread'], gain: 2.6, hi: true, tag: 'Best' },
	{ name: 'Three dishes + soup', core: 'Three dishes', extra: ['Soup'], gain: 2.3 },
	{ name: 'Every dish', core: 'Three dishes', extra: ['Bread', 'Soup', 'Salads', 'Desserts'], gain: 2.2 },
	{ name: 'Three dishes', core: 'Three dishes', extra: [], gain: 2.1, hi: true, tag: 'Kept' },
	{ name: 'Risotto first', core: 'Risotto only', extra: [], gain: 1.4 },
	{ name: 'Two dishes', core: 'Risotto, fish', extra: [], gain: 1.2 },
];

export default {
	title: 'A tasting pass makes more diners happy',
	file: 'tasting-pass',
	ref: 'Bistro Lumen  \u00b7  The tasting pass  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [
		{ id: 'cover', layout: 'gk-cover-pass', eyebrow: 'Bistro Lumen  \u00b7  Kitchen trial',
			title: 'A tasting pass makes\nmore diners happy',
			sub: 'Three weeks of Saturdays; the best version stays on the menu.',
			speaker: SPEAKER,
			sign: { icon: 'food', text: 'Bistro Lumen' },
			result: { name: 'Best version, week 3', big: '+2.6', label: 'more happy diners in 10' },
			cooks: [
				{ ...ANA, name: 'Ana', role: 'cooks' },
				{ ...BEN, name: 'Ben', role: 'tastes' },
				{ ...CLEO, name: 'Cleo', role: 're-plates' },
			],
			sources: [SAMPLE],
			notes: 'Bistro Lumen sends every order to one station. For three Saturdays we tried a tasting pass on a few dishes: the head chef tastes each plate before it leaves and sends the weak ones back for a second go. The best version left 2.6 more diners in every 10 happy with their plate, and it stays. All numbers are sample data.',
			say: 'Tasting a few dishes before they go out made diners happier.' },

		{ id: 'rules', layout: 'gk-rail', eyebrow: 'How the kitchen works', title: 'Each order goes to its station',
			kicker: 'The station card  \u00b7  18 dishes, then the specials',
			task: 'Order', rules: 18, match: 5,
			cooks: [
				{ ...ANA, name: 'Ana', sub: 'grill', on: true },
				{ ...CLEO, name: 'Cleo', sub: 'pasta' },
				{ ...DEV, name: 'Dev', sub: 'pastry' },
			],
			note: 'Most dishes are cooked by **one chef alone**.',
			sources: [SAMPLE],
			notes: 'Every order is read against the station card, dish by dish, and goes to the station that cooks it; anything not on the card goes to the specials. Most dishes are made by one chef from start to finish: dish 5, the steak, is Ana\u2019s on the grill. The trial never moved a dish to another station, it only changed what happens at the pass.' },

		{ id: 'pass', layout: 'gk-pass', eyebrow: 'The idea', title: 'The pass adds a taster and a second try',
			kicker: 'The risotto, on trial', ticket: 'Risotto',
			cooks: [
				{ ...ANA, name: 'Ana', role: 'cooks it' },
				{ ...BEN, name: 'Ben', role: 'tastes it, 1 to 5' },
				{ ...CLEO, name: 'Cleo', role: 're-plates it' },
			],
			pass: { label: '3 to 5: served' }, fix: { label: 'below 3: again' }, served: 'Served',
			clicks: [
				{ caption: 'A chef cooks the dish', say: 'Ana cooks the risotto as usual.' },
				{ caption: 'The head chef tastes it, 1 to 5', say: 'Ben tastes it at the pass and gives it a score.' },
				{ caption: 'Below 3, a second chef re-plates it', say: 'Only a low score sends it to Cleo for a second go.' },
			],
			sources: [SAMPLE],
			notes: 'The tasting pass has three steps. A chef cooks the dish, the head chef tastes it and scores it from 1 to 5, and below 3 a second chef makes it again; at 3 or more the plate goes straight out. For the risotto that is Ana, then Ben at the pass, then Cleo.' },

		{ id: 'four', layout: 'gk-four', eyebrow: 'Three dishes', title: 'We changed only 3 of 18 dishes',
			rules: 18, rest: '15 unchanged',
			changed: [
				{ rule: 3, label: 'Risotto', cooks: [ANA, BEN, CLEO], sub: 'was Ana alone' },
				{ rule: 9, label: 'Fish of the day', cooks: [CLEO, BEN, ANA], sub: 'was Cleo alone' },
				{ rule: 15, label: 'Souffl\u00e9', cooks: [DEV, BEN, DEV], sub: 'Dev twice, slower' },
			],
			sources: [SAMPLE],
			notes: 'The trial added the tasting pass to three dishes and left the other 15 alone. The souffl\u00e9 goes back to the same chef: if it falls, Dev makes it again, more slowly. Ben is always the one who tastes.' },

		{ id: 'stack', layout: 'gk-spikes', eyebrow: 'Dish by dish', title: 'Each dish helps; together they help most',
			kicker: 'Week 1  \u00b7  happy diners in 10, over a normal Saturday',
			legend: '1 ticket = 0.1 diner in 10',
			spikes: [
				{ value: 0.9, big: '+0.9', name: 'Risotto only', chips: ['Risotto'] },
				{ value: 0.6, big: '+0.6', name: 'Fish only', chips: ['Fish'] },
				{ value: 0.5, big: '+0.5', name: 'Souffl\u00e9 only', chips: ['Souffl\u00e9'] },
				{ value: 2.2, big: '+2.2', name: 'All three (week 1)', chips: ['Risotto', 'Fish', 'Souffl\u00e9'], hi: true },
			],
			join: 'Alone: about half a diner each',
			sources: [SAMPLE],
			notes: 'In week 1 each dish on its own added between half and one happy diner in ten; the three together added 2.2. Read it as \u201cthey add up\u201d, not as an exact sum. The three dishes settled at +2.1 over the three weeks (next slide).' },

		{ id: 'top', layout: 'gk-hang', eyebrow: 'Six versions', title: 'Every version beat a normal Saturday',
			kicker: 'Below the line: more happy diners in 10',
			line: 'normal Saturday', scale: 90,
			base: { name: 'Normal Saturday', value: '7.1 in 10' },
			tickets: TRIES.map(r => ({ ...r, text: `+${r.gain.toFixed(1)}` })),
			sources: [SAMPLE],
			notes: 'Six versions of the trial against a normal Saturday, when 7.1 diners in 10 rate their plate as great. Most build on the same three dishes; the best also tastes the bread. The three dishes alone are the version we keep.',
			say: 'The best versions all start from the same three dishes.' },

		{ id: 'sittings', layout: 'gk-tally', eyebrow: 'Three dishes + bread', title: 'Happier diners at every sitting',
			legend: { base: 'happy before', extra: 'happy now', rest: 'not happy' },
			rows: [
				{ name: 'Lunch', sub: '7.4 \u2192 9.8 in 10', base: 74, extra: 24, big: '+2.4' },
				{ name: 'Early dinner', sub: '7.2 \u2192 9.9 in 10', base: 72, extra: 27, big: '+2.7' },
				{ name: 'Late dinner', sub: '6.8 \u2192 9.6 in 10', base: 68, extra: 28, big: '+2.8' },
				{ name: 'Terrace', sub: '7.0 \u2192 9.5 in 10', base: 70, extra: 25, big: '+2.5' },
			],
			note: { icon: 'info', text: 'Each row: 100 diners.' },
			sources: [SAMPLE],
			notes: 'Each row draws 100 diners as tickets: grey were happy on a normal Saturday, green are the extra happy diners with the tasting pass, the rest were not happy. The late sitting gains most, when the kitchen is tired. The four rows average +2.6 in 10.' },

		{ id: 'cost', layout: 'gk-recipes', eyebrow: 'What it costs', title: 'Tasting everything barely helps more',
			tickets: [
				{ name: 'Three dishes', chips: ['Risotto', 'Fish', 'Souffl\u00e9'], big: '+2.1', label: '3 dishes', price: '+4 min', priceLabel: 'wait', priceTone: 'green' },
				{ name: 'Every dish', chips: ['Risotto', 'Fish', 'Souffl\u00e9', 'Bread', 'Soup', 'Salads', 'Desserts'], big: '+2.2', label: '7 dishes', price: '+15 min', priceLabel: 'wait', priceTone: 'orange' },
			],
			note: { icon: 'info', text: 'Extra wait per table, on a full Saturday.' },
			sources: [SAMPLE],
			notes: 'Tasting every dish is +2.2; the three dishes alone are +2.1. But tasting everything keeps a full table waiting 15 minutes longer, against 4 for the three dishes. Twice the tasting buys a tenth of a diner.' },

		{ id: 'stays', layout: 'gk-menu', eyebrow: 'What stays', title: 'The tasting pass stays on weekends',
			menu: { label: 'Weekdays', title: 'Today\u2019s kitchen', lines: ['18 dishes'], badge: 'Unchanged' },
			special: { label: 'Weekends', title: 'Tasting pass', lines: ['Three dishes'], flag: 'Weekends' },
			prs: [
				{ repo: 'Kitchen', num: 'Note 12', text: 'Taster at the pass', stamp: 'Done', tone: 'green' },
				{ repo: 'Door', num: 'Note 14', text: 'Ask diners', stamp: 'Next', tone: 'orange' },
			],
			sources: [SAMPLE],
			notes: 'From now on the tasting pass runs on weekends for the three dishes, and weekdays stay as they were. Dropping it is one line on the kitchen board. Next, front of house will ask diners at the door, so we can measure without counting plates.' },

		{ id: 'next', layout: 'gk-bell', bg: 'blue', eyebrow: 'Proposed next', title: 'Next: Sundays, then the bread',
			steps: [
				{ icon: 'calendar', title: 'Add Sundays', sub: 'busier' },
				{ icon: 'food', title: 'Taste the bread', sub: '+2.6 vs +2.1' },
				{ icon: 'people', title: 'Ask diners', sub: 'every visit' },
			],
			bell: 'Next service',
			sources: [SAMPLE],
			notes: 'A proposal, not a decision. First, run the tasting pass on Sundays too. Second, add the bread: that version is +2.6 against +2.1. Third, ask diners at the door so every visit is rated. Questions welcome.' },
	],
};
