// Example: an illustrated story talk, set in one world (a railway) with one recurring object (the signal box, with a
// signaller at the lever). Lakeside Freight's dispatch learned to ask three questions about every load, one step at a
// time: "heavy or light?", "what does the load need, and the cheapest train that carries it?", and "which service
// should run it?" (direct, transfer, inspection stop). Ten slides, each drawn by a design in designs/gallery-railway.mjs
// (grw-*). The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every name and number here is made up.
// Build: node src/build.mjs --deck freight-line
const SAMPLE = 'Sample data, made up for this example';
const SPEAKER = { initials: 'YN', name: 'Your Name', role: 'Lakeside Freight' };

export default {
	title: 'From one train to the right journey',
	file: 'freight-line',
	ref: 'Lakeside Freight  \u00b7  How dispatch decides  \u00b7  Nov 2026',
	wordBudget: 20,
	slides: [
		{ id: 'cover', layout: 'grw-cover', eyebrow: 'Lakeside Freight  \u00b7  Dispatch', title: 'Dispatch picks the journey, not just the train',
			sub: 'Three questions our dispatch office learned to ask.', speaker: SPEAKER,
			box: { name: 'Service pick' }, task: 'Your load', labels: { check: 'hub' },
			routes: [{ title: 'Direct', sub: 'one express, door to door' }, { title: 'Transfer', sub: 'local first, express if needed' }, { title: 'Inspection', sub: 'stop, inspect, continue' }],
			trains: { express: { name: 'Express' }, local: { name: 'Local' }, inspected: { name: 'Freighter' }, inspector: { name: 'Inspector' } },
			nosrc: true,
			sources: [SAMPLE],
			say: 'Dispatch used to pick a train. Now it picks the journey.',
			notes: 'This is the story of how Lakeside Freight\u2019s dispatch office decides what happens to each load, told in three steps; in each step it learned to ask a better question. The picture is where it has got to: your load waits at the signal box, and three lines branch to three services: a direct express, a local that hands over at a hub only if needed, and a stop for an inspection. Every name and number in this deck is made up.' },

		{ id: 'journey', layout: 'grw-line', eyebrow: 'Three steps', title: 'Each step changed the question dispatch asks',
			stations: [
				{ name: 'Weighbridge', when: 'Spring 2024', question: 'Heavy or\nlight?', tone: 'blue' },
				{ name: 'Load match', when: 'Autumn 2024', question: 'What it needs, and\nthe cheapest train?', tone: 'blue' },
				{ name: 'Service pick', when: 'Summer 2025', question: 'Which service\nruns it?', tone: 'purple' },
			],
			halts: [{ at: 0.012, when: '2023', text: 'Line opens' }, { at: 0.925, when: 'Winter 2025', text: 'All depots' }],
			clicks: [
				{ caption: 'Step 1: the weighbridge', say: 'First, dispatch asked one question: heavy or light?' },
				{ caption: 'Step 2: the load match', say: 'Then it asked what each load needs.' },
				{ caption: 'Step 3: the service pick', say: 'Now it asks which service should run it.' },
			],
			nosrc: true,
			sources: [SAMPLE],
			notes: 'The line opened in 2023, and dispatch changed its question three times: the weighbridge in spring 2024, the load match that autumn, the service pick in summer 2025; by winter every depot used it. All dates are sample data. The next slides take the steps one at a time.' },

		{ id: 'weighbridge', layout: 'grw-points', eyebrow: 'Step 1  \u00b7  The weighbridge', title: 'The weighbridge asked one yes-or-no question',
			box: { name: 'Weighbridge' }, question: 'Heavy load?', yes: 'yes', no: 'no', task: 'Your load',
			pools: [{ title: 'Mainline locos', count: 9, big: '9' }, { title: 'Shunters', count: 5, big: '5' }],
			specs: ['A scale at the depot gate', 'About 2 minutes a wagon'],
			sources: [SAMPLE],
			say: 'One lever, two tracks: a mainline loco or a shunter.',
			notes: 'The first rule was a weighbridge at the depot gate: heavy loads went to one of 9 mainline locomotives, light ones to one of 5 shunters. Weighing took about two minutes a wagon. All sample data.' },

		{ id: 'coin', layout: 'grw-coin', eyebrow: 'Step 1  \u00b7  Limits', title: 'Weight alone sent a third of loads wrong',
			box: { name: 'Weighbridge' },
			coin: { value: '1 in 3', label: 'loads on the wrong train', sub: '900 loads checked' },
			tags: [
				{ value: '45%', text: 'of loads are mixed cargo', tone: 'orange' },
				{ value: '1 in 4', text: 'light loads that needed a cold van', tone: 'red' },
			],
			sources: [SAMPLE],
			say: 'Weight alone was close to a coin toss.',
			notes: 'A check of 900 loads found that one in three had gone on the wrong kind of train. Weight says nothing about mixed cargo, which is 45% of loads, and one light load in four needed a refrigerated van that a shunter could not pull. All sample data.' },

		{ id: 'load-match', layout: 'grw-match', eyebrow: 'Step 2  \u00b7  Load match', title: 'The load match asks what the load needs',
			kicker: 'Four needs, then the cheapest train that covers them',
			labels: ['Cold', 'Weight', 'Size', 'Speed'],
			rows: [
				{ label: 'Easy load', quote: 'Boxes of books, no rush', needs: [0.05, 0.40, 0.30, 0.10], train: { name: 'Shunter' }, size: 0.1, why: 'A small van is enough' },
				{ label: 'Hard load', quote: 'Frozen fish, by tomorrow', needs: [0.95, 0.60, 0.50, 0.90], train: { name: 'Reefer express' }, size: 1, why: 'Worth the express' },
			],
			clicks: [
				{ caption: 'Easy load, small train', say: 'Nothing about the books is hard, so a shunter takes them.' },
				{ caption: 'Hard load, express', say: 'Fish must stay cold and arrive fast: it gets the reefer express.' },
			],
			sources: [SAMPLE],
			say: 'Ask what the load needs, not which train is free.',
			notes: 'The load match scores four needs for every load: cold, weight, size and speed. It then picks the cheapest train whose wagons cover all four. Each train\u2019s profile is a line in the depot book, so a new locomotive joins without changing anything else. The loads and scores are sample data.' },

		{ id: 'savings', layout: 'grw-fares', eyebrow: 'Step 2  \u00b7  Results', title: 'Same punctuality, three times the savings',
			trays: [
				{ name: 'Weighbridge', saved: 11, big: '11%', label: 'saved', quality: '91% on time' },
				{ name: 'Load match', saved: 35, big: '35%', label: 'saved', quality: '93% on time' },
			],
			key: 'Each coin: 1% of the cost of always sending an express. Green: saved.',
			baseline: 'Always an express: 94% on time, 900 loads.',
			live: { label: 'Six-week trial on two lines', items: [
				{ value: '\u22128%', text: 'time in transit' },
				{ value: '\u221220%', text: 'damaged loads' },
				{ value: '\u22126%', text: 'cost per tonne' },
			] },
			sources: [SAMPLE],
			say: 'The load match saved three times more, and kept trains on time.',
			notes: 'Each tray is the cost of always sending an express for 900 sample loads, as 100 coins; green coins are saved. The weighbridge saves 11% with 91% on time; the load match saves 35% with 93%, close to always sending an express (94%). On the right, a six-week trial on two lines: 8% less time in transit, 20% fewer damaged loads, 6% lower cost per tonne. All sample data.' },

		{ id: 'limit', layout: 'grw-buffers', bg: 'dark', eyebrow: 'Step 2  \u00b7  The limit', title: 'One train per load was the limit',
			quote: 'Some loads need more than a better train: they need a different journey.',
			who: 'A night dispatcher (sample quote)',
			box: { name: 'Load match' }, task: 'Your load', end: 'One load,\none train',
			maxWords: 24,
			nosrc: true,
			sources: [SAMPLE],
			say: 'The load match still sends every load on one train.',
			notes: 'The load match picks one train for each load, door to door. The quote is a sample quote, written for this example. The next step changes what dispatch decides: not which train, but which journey.' },

		{ id: 'service-pick', layout: 'grw-routes', eyebrow: 'Step 3  \u00b7  Service pick', title: 'The service pick chooses the journey',
			box: { name: 'Service pick' }, task: 'Weighed first',
			routes: [
				{ title: 'Direct', sub: 'one express' },
				{ title: 'Transfer', sub: 'local, then express if late' },
				{ title: 'Inspection', sub: 'stop, inspect, continue' },
			],
			trains: { express: { name: 'Express' }, local: { name: 'Local' }, express2: { name: 'Express' }, freight: { name: 'Freighter' }, inspector: { name: 'Inspector' } },
			labels: { check: 'hub', ifNeeded: 'only if needed', revise: 'continue' },
			clicks: [
				{ caption: 'Every load is checked first', say: 'Every load still starts with its four needs.' },
				{ caption: 'Direct: one express', say: 'Urgent loads go straight through on one express.' },
				{ caption: 'Transfer: express if needed', say: 'Most loads start on a local and only switch at the hub if they are late.' },
				{ caption: 'Inspection: a stop on the way', say: 'Fragile loads stop for an inspection, then carry on.' },
			],
			nosrc: true,
			sources: [SAMPLE],
			say: 'The question is no longer which train, but which journey.',
			notes: 'The four needs stay the first check: every load is scored at the gate. Then dispatch picks a service. Direct: one express, door to door. Transfer: a local train first; at the hub, a check decides, and the load moves to an express only if it is running late. Inspection: the load stops at a yard to be checked and secured, then continues. All sample data.' },

		{ id: 'results', layout: 'grw-map', eyebrow: 'Step 3  \u00b7  Results', title: 'Picking the journey beat the best single train',
			tag: { text: 'Sample data', tone: 'orange', icon: 'beaker' },
			axes: { x: 'Cost change', y: 'On time' },
			xRange: [-100, 25], yRange: [60, 100],
			line: { label: 'Load match: one train', points: [[-92, 68], [-86, 73], [-78, 77], [-70, 80], [-60, 81]] },
			best: { x: 0, y: 86, label: 'Best single train, 86%' },
			stations: [
				{ x: -45, y: 86, name: 'Service pick', value: '~45%', text: 'cheaper' },
				{ x: -5, y: 95, name: 'Service pick, priority', value: '95%', text: 'on time, ~5% cheaper' },
			],
			note: 'Made-up positions',
			sources: [SAMPLE],
			say: 'Choosing the journey went past what one train can do.',
			notes: 'Cost change against always using the best single train across, share of loads on time up. The load match, one train per load, tops out below the best single train (86%). The service pick matches it at about 45% lower cost; its priority setting gets 95% of loads in on time at about 5% lower cost. All sample data.' },

		{ id: 'next', layout: 'grw-next', bg: 'blue', eyebrow: 'What\u2019s next', title: 'Next, one timetable with three speeds',
			from: 'Service pick', task: 'Your load',
			station: { name: 'Network timetable', sub: 'One plan, three speeds', pill: { text: 'Starting', tone: 'green', icon: 'checkmark' } },
			next: { name: 'Live tracking', sub: 'It would replace:', pill: { text: 'Planned', tone: 'orange', icon: 'calendar' }, replaces: ['paper waybills', 'phone calls', 'depot books'] },
			line: 'From one train to **the right journey**.',
			nosrc: true,
			sources: [SAMPLE],
			say: 'From one train to the right journey.',
			notes: 'Next, the three services come together in one network timetable with three speeds, starting this winter. Further out, live tracking of every wagon would replace paper waybills, phone calls between depots and the depot books. The line to remember: each step changed the question, from one train to the right journey. All sample data.' },
	],
};
