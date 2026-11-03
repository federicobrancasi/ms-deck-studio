// Example: an illustrated trial report, set in one world (a telephone exchange) with one recurring object (the
// switchboard that patches each call). The Grand Meridian hotel sends every guest call to one of six desks. Today a call
// card of keywords and a fixed list decides; on two floors the operators tried asking a few short questions first, then
// patching each call to the desk most likely to solve it with the staff on shift. Ten slides, each drawn by a design in
// designs/gallery-switchboard.mjs (gsb-*).
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every name and number here is made up.
// Build: node src/build.mjs --deck switchboard
const SAMPLE = 'Sample data, made up for this example';
const SPEAKER = { initials: 'YN', name: 'Your Name', role: 'Grand Meridian  \u00b7  Nov 2026' };
const TRIAL = { text: 'Trial', tone: 'orange', icon: 'beaker' };
const OP = { name: 'Operator' };

// The six desks a call can be patched to, most able first.
const LINES = [
	{ name: 'Manager' },
	{ name: 'Concierge' },
	{ name: 'Reception' },
	{ name: 'Housekeeping' },
	{ name: 'Kitchen' },
	{ name: 'Recording' },
];

export const cover = {
	id: 'cover', layout: 'gsb-cover', look: 'board', eyebrow: 'Grand Meridian  \u00b7  Switchboard trial',
	title: 'A few questions before patching the call',
	sub: 'Fewer guests passed from desk to desk.',
	speaker: SPEAKER,
	pills: [{ text: 'Trial on two floors', tone: 'orange', icon: 'beaker' }],
	box: OP,
	old: { name: 'Call card', caption: 'keywords, a fixed list', tag: { text: 'Today', tone: 'neutral' } },
	caption: '8 questions, then a patch',
	tag: TRIAL,
	boardLabel: '8 questions',
	lines: LINES,
	pick: 2,
	sources: [SAMPLE],
	notes: 'At the Grand Meridian every guest call goes through the switchboard to one of six desks. Today the operator matches a few keywords on a call card and follows a fixed list. On two floors we tried something else: the operator asks a few short questions, then patches the call to the desk most likely to sort it out with the staff on shift. The picture is the idea: a call rings in, the operator asks, and the cord goes to one of six lines. All numbers in this deck are sample data.',
};

export const today = {
	id: 'today', layout: 'gsb-today', eyebrow: 'Today\u2019s switchboard', title: 'Today, four keywords and a fixed list decide',
	box: { name: 'Call card' },
	scoresLabel: '4 keywords',
	scores: ['Booking', 'Complaint', 'Request', 'Question'],
	rules: 'Fixed list: the first desk that matches',
	kicker: 'Share of calls, a normal day',
	outs: [
		{ name: 'Manager', share: 2, big: '2%', label: 'rarely' },
		{ name: 'Reception', share: 38, big: 'the rest' },
		{ name: 'Recording', share: 60, big: '3 in 5', label: 'about' },
	],
	sources: [SAMPLE],
	notes: 'Today the operator listens for four keywords and the call card sends the call to the first desk on its list that matches. On a normal day that is the recorded menu for about three calls in five, the front desk for most of the rest, and the duty manager rarely. The cord widths are those shares.',
};

export const catchSlide = {
	id: 'catch', layout: 'gsb-yard', eyebrow: 'What the call card misses', title: 'The card sends 55 of 100 urgent calls to a recording',
	kicker: '100 logged calls that needed a person',
	tag: TRIAL,
	panels: [
		{ name: 'Call card', caught: 45, big: '55', label: 'recorded', tone: 'red' },
		{ name: 'Asking', caught: 91, big: '9', label: 'recorded', tone: 'green' },
	],
	strong: { title: 'A person', icon: 'checkCircle' },
	cheap: { title: 'Recording', icon: 'arrowDown' },
	note: { icon: 'info', text: 'All calls recorded: 30% asking, 64% card' },
	clicks: [
		{ caption: 'Call card: 55 of 100', say: 'Of a hundred calls that needed a person, the call card sends fifty-five to the recorded menu.' },
		{ caption: 'Asking first: 9 of 100', say: 'When the operator asks first, nine end up at the menu.' },
	],
	sources: [SAMPLE],
	notes: 'Front-of-house staff went through 1,200 logged calls and marked the ones that needed a person; each lamp is one of those in a hundred. The call card puts 45 of them through to a person, the operator\u2019s questions 91. Part of it comes from sending fewer calls to the menu overall: 30% against 64%.',
};

export const how = {
	id: 'how', layout: 'gsb-how', look: 'line', eyebrow: 'How it works', title: 'Ask, guess, then patch for the shift',
	tag: TRIAL,
	sketch: 'Illustrative',
	steps: [
		{ title: 'Ask', sub: '8 questions' },
		{ title: 'Guess', sub: 'odds and minutes' },
		{ title: 'Patch', sub: 'for the shift' },
	],
	box: OP,
	readout: '8 answers',
	cols: ['Solved', 'Minutes'],
	options: [
		{ ...LINES[0], bar: [0.92, 1] },
		{ ...LINES[1], bar: [0.84, 0.7] },
		{ ...LINES[2], bar: [0.8, 0.45] },
		{ ...LINES[3], bar: [0.7, 0.3] },
		{ ...LINES[4], bar: [0.66, 0.25] },
		{ ...LINES[5], bar: [0.4, 0.05] },
	],
	pick: 2,
	budget: 'Shift',
	clicks: [
		{ caption: 'Ask: eight questions', say: 'The operator asks the guest eight short questions, most of them yes or no.' },
		{ caption: 'Guess: odds and minutes', say: 'A card on the desk turns the answers into how likely each desk is to sort it out, and how long it takes.' },
		{ caption: 'Patch: the shift decides', say: 'The operator patches to the best desk that the staff on shift can take.' },
	],
	sources: [SAMPLE],
	notes: 'Three steps per call. Ask: eight short questions, under twenty seconds. Guess: a printed card turns the answers into each desk\u2019s chance of sorting it out first time, and the staff minutes it takes. Patch: the best chance for the minutes the shift can spare; a busy night spares fewer. The bars on the board are illustrative.',
};

export const ask = {
	id: 'ask', layout: 'gsb-levers', eyebrow: 'The 8 questions', title: 'The questions describe the call, never solve it',
	tag: TRIAL,
	box: OP,
	kicker: '8 questions, 8 answers',
	levers: ['Who is calling', 'Urgent?', 'Room given', 'Language', 'Called before?', 'Needs a person', 'Money involved', 'Quick answer'],
	groups: [
		{ from: 0, to: 0, value: '3', label: 'kinds' },
		{ from: 1, to: 7, value: '7', label: 'yes or no' },
	],
	ticket: { title: 'Per call', rows: [
		{ value: '20 s', label: 'of asking' },
		{ value: '0', label: 'promises made' },
	] },
	sources: [SAMPLE],
	notes: 'On the switchboard: one lamp and one lever key per question. The operator asks who is calling (a guest, a visitor or a supplier), and seven yes-or-no questions: is it urgent, did they give a room number, do they need another language, have they called before, do they need a person, is money involved, is it a quick answer. Asking takes about twenty seconds, and the operator never promises anything: they only decide where the call goes.',
};

export const worth = {
	id: 'worth', layout: 'gsb-gradient', eyebrow: 'Why it pays', title: 'A person helps most on hard calls',
	tag: TRIAL,
	cheap: { name: 'Recording' },
	strong: { name: 'Manager' },
	unit: 'Sorted first time',
	gapLabel: 'points',
	stretches: [
		{ name: 'Simple call', sub: 'a taxi', cheap: 85, strong: 92, gap: '+7' },
		{ name: 'Average call', cheap: 60, strong: 78, gap: '+18' },
		{ name: 'Hard call', sub: 'a night complaint', cheap: 30, strong: 71, gap: '+41', hi: true },
	],
	sources: [SAMPLE],
	notes: 'Why asking first pays: the gap between the recorded menu and a person grows with how hard the call is. For a taxi or the wifi password the menu sorts out 85% and the duty manager 92%, so the menu is fine. For a complaint at night, 30 against 71. So the operator spends staff time where it changes the most, which only works if the hard calls can be told apart.',
};

export const budget = {
	id: 'budget', layout: 'gsb-budget', eyebrow: 'One call, three shifts', title: 'The shift decides where one call goes',
	tag: TRIAL,
	box: OP,
	task: { label: 'Room 412', text: 'The heating is broken' },
	stops: [
		{ budget: '1 desk', tier: 'Night', name: 'Recording', chance: '40%', cost: '1 min' },
		{ budget: '3 desks', tier: 'Day', name: 'Housekeeping', chance: '75%', cost: '6 min' },
		{ budget: '6 desks', tier: 'Full', name: 'Manager', chance: '90%', cost: '9 min' },
	],
	today: { text: 'The card picks a recording', at: 0 },
	clicks: [
		{ caption: 'Night: a recording, 40%', say: 'With one desk open, the call goes to the recorded menu.' },
		{ caption: 'Day: housekeeping, 75%', say: 'In the day it goes to housekeeping. The call card would still pick the menu.' },
		{ caption: 'Full staff: the manager, 90%', say: 'With every desk open, the duty manager takes it.' },
	],
	sources: [SAMPLE],
	notes: 'One call, a broken heater in room 412. The percentages are the chance it is sorted out first time and the minutes are staff time. On a night shift with one desk open, the call goes to the recorded menu; in the day, to housekeeping; with full staff, to the duty manager. The call card picks the menu every time.',
};

export const results = {
	id: 'results', layout: 'gsb-map', eyebrow: 'Results  \u00b7  1,200 logged calls', title: '68% sorted first time, in fewer minutes',
	tag: TRIAL,
	xLabel: 'Staff minutes (1\u00d7 = today)',
	yLabel: 'Sorted first time',
	yMin: 53, yMax: 88, yTicks: [60, 70, 80],
	corner: 'Quicker and better',
	old: { name: 'Call card (today)', stops: [
		{ name: 'Night', cost: 0.4, solved: 55, value: false, lab: [-60, 18, 120, 'center'] },
		{ name: 'Lean', cost: 0.7, solved: 58, value: false, lab: [-50, -46, 100, 'center'] },
		{ name: 'Day (today)', cost: 1, solved: 60, today: true, lab: [-100, 22, 200, 'center'] },
		{ name: 'Busy', cost: 1.4, solved: 62, value: false, lab: [22, -14, 140, 'left'] },
	] },
	line: { name: 'Asking first', stops: [
		{ name: 'Night', cost: 0.5, solved: 63, value: false, lab: [-130, -14, 110, 'right'] },
		{ name: 'Day', cost: 0.85, solved: 68, hi: true, chip: 'tint', lab: [-262, -112, 240, 'right'] },
		{ name: 'Busy', cost: 1.2, solved: 71, value: false, lab: [22, 2, 160, 'left'] },
		{ name: 'Full staff', cost: 1.8, solved: 77, hi: true, chip: 'white', lab: [30, 14, 300, 'left'] },
		{ name: 'Every desk', cost: 4, solved: 82, lab: [-80, -66, 160, 'center'] },
	] },
	ref: { name: 'Manager for every call', cost: 9, solved: 85, lab: [-150, 30, 300, 'center'] },
	clicks: [
		{ caption: 'Today: 60% sorted at day staffing', say: 'This is today\u2019s call card: each shift is a point on the grey line; the day shift sorts out 60% first time.' },
		{ caption: 'Asking first: 68% at 0.85\u00d7', say: 'Asking first sorts out 68% with fewer staff minutes, and 77% with full staff.' },
	],
	sources: [SAMPLE],
	notes: 'Logged calls from two floors over six weeks, each kind of call weighted equally. 1\u00d7 is today\u2019s staff minutes per call on a day shift, and the asking time is included. Today\u2019s day shift sorts out 60% first time; asking first sorts out 68% at 0.85\u00d7 and 77% with full staff at 1.8\u00d7. Sending every call to the duty manager would sort out 85% at nine times the staff time.',
};

export const groups = {
	id: 'groups', layout: 'gsb-board', eyebrow: 'Gains by kind of call', title: 'Most calls gain; long ones need full staff',
	tag: TRIAL,
	heads: ['Kind of call', 'Day shift \u00b7 0.85\u00d7', 'Full staff \u00b7 1.8\u00d7'],
	rows: [
		{ name: 'Lost property', a: 21.0, b: 24.0, hi: true },
		{ name: 'Room service', a: 11.5, b: 13.0 },
		{ name: 'Bookings', a: 9.0, b: 15.5 },
		{ name: 'Taxis', a: 4.2, b: 4.0 },
		{ name: 'Late arrivals', a: 2.0, b: 8.5 },
		{ name: 'Noise', a: -1.5, b: 10.0, hi: true },
		{ name: 'Group bookings', a: -2.5, b: 17.0, hi: true },
		{ name: 'Complaints', a: -3.0, b: 14.5, hi: true },
	],
	total: { name: 'Average', a: '+5.1', b: '+13.3' },
	note: 'All eight gain',
	clicks: [
		{ caption: 'Day shift: lost property wins, long calls lose', say: 'On a day shift, lost property gains 21 points, and three long kinds of call lose a little.' },
		{ caption: 'Full staff: every kind of call gains', say: 'With full staff, every kind of call gains.' },
	],
	sources: [SAMPLE],
	notes: 'Points of calls sorted out first time over today, by kind of call. On a day shift most of the gain is lost property, plus 21, and three long kinds of call lose between 1.5 and 3 points. With full staff all eight gain, and the average goes from plus 5.1 to plus 13.3.',
};

export const next = {
	id: 'next', layout: 'gsb-works', bg: 'blue', eyebrow: 'Where it stands', title: 'Two floors now; the rest after training',
	stops: [
		{ state: 'done', label: 'Done 2 Sep', title: 'New call card', sub: 'A separate fix' },
		{ state: 'building', label: 'Running', title: 'Two floors', sub: 'Six-week trial' },
		{ state: 'survey', label: 'Open question', title: 'Training', sub: 'For every operator' },
		{ state: 'survey', label: 'Not yet', title: 'All floors', sub: 'After the summer' },
	],
	notes: 'What is done: a new call card, on 2 September, and it is a separate fix that stands on its own. Asking first runs as a six-week trial on two floors. How to train every operator is still open. All floors would follow after the summer. The recommendation is the simplest version: the eight questions.',
};

export default {
	title: 'A few questions before patching the call',
	file: 'switchboard',
	ref: 'Grand Meridian  \u00b7  Switchboard trial  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [cover, today, catchSlide, how, ask, worth, budget, results, groups, next],
};
