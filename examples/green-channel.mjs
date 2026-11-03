// Example: an illustrated study talk, set in one world (an airport customs hall) with one recurring object (the
// luggage tag: what the scanner sees in a bag, written on its tag). At Northwind Airport an officer reads the X-ray of
// every arriving bag and writes a note; the trial tries one quick scanner check (20 questions) plus fixed rules
// instead. Every bag ends one of two ways: it goes through the green channel, or it is opened with you.
// Ten slides, each drawn by a design in designs/gallery-airport.mjs (gap-*).
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every name and number here is made up.
// Build: node src/build.mjs --deck green-channel
const SAMPLE = 'Sample data, made up for this example';
const SPEAKER = { initials: 'YN', name: 'Your Name', role: 'Customs trial' };

// The two ends, the notice and the timings, the same on every slide.
const CLEAR = 'Through', OPEN = 'Opened with you';
const NOTICE = { title: 'Open this bag?', buttons: ['Open', 'Release'], app: 'Customs \u00b7 Hall B' };
const CHECK_S = '1.5 s', OFFICER_S = '7.5 s';

// The 20 questions: 10 for "could it be dangerous?", 10 for "does it match what you declared?" (5 signs, 5 doubts),
// with the quick check's answers for the two bags up close (how sure it is that the answer is yes).
const HARM = ['A weapon?', 'Explosive?', 'Ammunition?', 'Sharp blade?', 'Live animal?', 'Plants or soil?', 'Fresh meat?', 'Large cash?', 'Always open?', 'Hidden space?'];
const SIGNS = ['On the declaration?', 'Under the allowance?', 'Matches the trip?', 'Personal use?', 'Seen before?'];
const DOUBTS = ['Hard to see inside?', 'Not declared?', 'Odd weight?', 'Many of one thing?', 'New packaging?'];
const rows = (qs, values, marks = {}) => qs.map((q, i) => ({ q, v: `${values[i]}%`, ...(marks[i] ?? {}) }));

const LISTS = { harm: 'Could it be dangerous?', asked: 'Does it match your form?', signs: 'Signs it matches', doubts: 'Doubts' };
const FLOW = { harm: 'Could it be\ndangerous?', asked: 'Does it match\nyour form?', clear: CLEAR, yes: 'yes', no: 'no' };

const flare = {
	said: '\u201cSailing gear from our boat trip: ropes, a life jacket, a torch.\u201d',
	label: 'flare gun, 1 cartridge',
};
const wine = {
	said: '\u201cTwo bottles of wine for my sister, under the allowance.\u201d',
	label: '2 bottles, wrapped in foil',
};

export default {
	title: 'One quick scan, no queue',
	file: 'green-channel',
	ref: 'Northwind Airport  \u00b7  Customs trial  \u00b7  Nov 2026',
	wordBudget: 20,
	slides: [
		{
			id: 'cover', layout: 'gap-cover',
			eyebrow: 'Northwind Airport  \u00b7  Customs trial',
			title: 'One quick scan, no queue',
			sub: 'One scan answers 20 questions; fixed rules decide the rest.',
			speaker: SPEAKER,
			pills: [{ text: 'Trial', icon: 'beaker', tone: 'blue' }, { text: 'Nov 2026', icon: 'calendar', tone: 'neutral' }],
			scene: {
				ask: 'Can I go through?', check: `Quick check \u00b7 ${CHECK_S}`, cells: 20, flags: [0, 1, 8], clear: CLEAR, open: OPEN, notice: NOTICE,
				tags: { wait: 'books, laptop', scan: 'flare gun, \u2026', clear: 'clothes, gifts', open: 'cheese, 3 kg' },
			},
			sources: [SAMPLE],
			say: 'One quick scan decides every bag: it goes through, or it is opened with you.',
			notes: 'This talk is about the customs hall at Northwind Airport: how we decide whether an arriving bag goes through the green channel or is opened with its owner. Today an officer reads the X-ray of every bag and writes a short note. We tried something else: the scanner answers 20 fixed questions about the bag, and fixed rules, plain and printed, decide. The bag goes through, or it is opened with you; the officer only sees the bags that need them. This was a trial on one hall, not a change everywhere. Every name and number here is made up.',
		},
		{
			id: 'job', layout: 'gap-job',
			eyebrow: 'The job',
			title: 'Before a bag goes through, someone decides',
			you: { cap: 'Form', text: 'Clothes and\nsome gifts' },
			bag: { cap: 'The scan', label: 'clothes, gifts,\n2 knives' },
			officer: 'Check',
			clear: CLEAR,
			notice: NOTICE, reason: 'Two long blades.',
			wrong: 'What can go wrong',
			mistakes: [
				{ cap: 'Mistake 1', title: 'A dangerous bag goes through' },
				{ cap: 'Mistake 2', title: 'A harmless bag is opened' },
			],
			clicks: [
				{ caption: 'You declare what is in the bag.', say: 'It starts with the form you filled in.' },
				{ caption: 'The scanner sees what is inside.', say: 'Every bag goes through the X-ray.' },
				{ caption: 'Someone checks the form and the picture.', say: 'Before the bag goes on, someone looks.' },
				{ caption: 'Harmless and as declared: it goes through.', say: 'No wait when it is clearly fine.' },
				{ caption: 'Otherwise it is opened with you, and why.', say: 'You are there, and you hear why.' },
				{ caption: 'Mistake 1 is dangerous.', say: 'A dangerous bag goes through: nothing stopped it.' },
				{ caption: 'Mistake 2 is annoying.', say: 'A harmless bag is opened: you waited for nothing.' },
			],
			sources: [SAMPLE],
			say: 'Someone decides: it goes through, or it is opened with you.',
			notes: 'When a bag arrives, someone compares the passenger\u2019s form with what the scanner sees. If the bag is harmless and matches the form, it goes through the green channel. Otherwise it is opened at the desk with its owner, with a one-line reason. Here the passenger declared clothes and gifts, and the scanner sees two kitchen knives: gifts, perhaps, but blades over the limit, so the bag is opened. A check can be wrong in two ways: a dangerous bag goes through, which is dangerous, or a harmless bag is opened, which is annoying. Every number later in this talk measures one of these two mistakes. The example is made up.',
		},
		{
			id: 'today', layout: 'gap-today',
			eyebrow: 'In use today',
			title: 'Today, an officer reads every bag',
			bag: { cap: 'The scanner sees', label: 'cash, 9,800 EUR\nin a book', note: { icon: 'info', text: 'Near the limit' } },
			officer: 'Officer',
			verdict: { text: 'OPEN', reason: 'Cash hidden in a book.' },
			notice: NOTICE,
			time: OFFICER_S, timeFrac: 7.5 / 10,
			per: '1 officer per bag',
			clicks: [
				{ caption: 'A bag reaches the hall.', say: 'Here: cash, just under the limit, inside a book.' },
				{ caption: 'An officer reads the X-ray and the form.', say: 'A person, trained for years, looks at both.' },
				{ caption: 'They write CLEAR or OPEN, and why.', say: 'One line, with a short reason.' },
				{ caption: 'OPEN: the bag goes to the desk, with the reason.', say: 'CLEAR would have sent it through.' },
				{ caption: 'About 7.5 seconds, every bag.', say: 'One officer per bag, every time.' },
			],
			sources: [SAMPLE],
			say: 'One officer per bag, about 7.5 seconds each.',
			notes: 'Today every arriving bag is read by an officer, drawn here in purple at a desk. For each bag they look at the X-ray and the passenger\u2019s form, then write one line: CLEAR or OPEN, with a short reason. CLEAR sends the bag through the green channel; OPEN sends it to the desk, where it is opened with its owner and the reason is shown. A typical look takes 7.5 seconds, and at peak hours the belt backs up. The bag and the note are made up.',
		},
		{
			id: 'two-kinds', layout: 'gap-two-kinds',
			eyebrow: 'Two kinds of check',
			title: 'One writes a note, one fills a checklist',
			left: { name: 'Officer', sub: 'Writes a note', icon: 'personSearch', verdict: 'OPEN', reply: 'A flare counts as an explosive, even on a boat.' },
			right: { name: 'Quick check', sub: 'A checklist', icon: 'checklist', head: '20 numbers: how sure is \u201cyes\u201d?', answers: [{ q: 'Explosive?', v: '100%' }, { q: 'On the declaration?', v: '12%' }, { q: 'Plants or soil?', v: '0%' }] },
			vs: 'vs',
			rows: [
				{ label: 'What it gives back' },
				{ label: 'How long it takes', left: { text: OFFICER_S, icon: 'timer' }, right: { text: CHECK_S, icon: 'timer' } },
				{ label: 'Ask it twice', left: { text: 'Can change', icon: 'dismissCircle', tone: 'red' }, right: { text: 'Same every time', icon: 'checkCircle', tone: 'green' } },
				{ label: 'A reason you can read', left: { text: 'Writes one', icon: 'checkCircle', tone: 'green' }, right: { text: 'Can\u2019t write one', icon: 'dismissCircle', tone: 'red' } },
			],
			clicks: [
				{ caption: 'The officer writes a sentence.', say: 'They look, think and write; about 7.5 seconds, and two officers can differ.' },
				{ caption: 'The quick check fills a checklist.', say: 'The scanner with a different job.' },
				{ caption: 'Each answer says how sure it is.', say: '100% means surely yes; 0% means surely no.' },
				{ caption: 'In seconds, the same every time.', say: '20 answers in one pass. ' + 'Scanned twice, the bag gets the same answers.' },
				{ caption: 'Its reasons are printed in advance.', say: 'It can\u2019t write a reason, so each danger check has a printed one.' },
			],
			sources: [SAMPLE],
			say: 'The officer writes a sentence; the quick check fills in a checklist.',
			notes: 'Two kinds of check, on the same bag. The passenger declared sailing gear from a boat trip; the scanner sees a flare gun with a cartridge. The officer reads everything and writes a sentence; it takes about 7.5 seconds, and two officers can decide differently. Here they wrote OPEN. The quick check fills in a checklist: 20 fixed yes-or-no questions, and for each it gives how sure it is that the answer is yes, as a percentage. It answers all 20 in one pass in about 1.5 seconds, and the same bag gets the same answers every time. It can\u2019t write a sentence, so the reasons are printed in advance, one per danger check that opens a bag at once.',
		},
		{
			id: 'decide', layout: 'gap-decide',
			eyebrow: 'How it decides',
			title: 'One quick scan, then fixed rules decide',
			officerCap: 'Check', endsCap: 'Every bag ends one of two ways',
			check: { name: 'Quick check', big: '20', sub: `questions \u00b7 ${CHECK_S} \u00b7 **no queue**` },
			rules: { name: 'Fixed rules', big: '{ }', sub: 'printed, plain' },
			clear: CLEAR, open: OPEN,
			rule: `{{green|It goes through}} only when **nothing looks dangerous** and it **matches your form**.`,
			// The rule in one sentence is the slide's point.
			maxWords: 23,
			clicks: [
				{ caption: 'Every bag ends one of two ways.', say: 'It goes through, or it is opened. Nothing in between.' },
				{ caption: 'One quick scan: 20 questions.', say: 'In a second and a half.' },
				{ caption: 'Then fixed rules decide.', say: 'Printed rules, no judgement call. ' + 'Same answers in, same decision out.' },
				{ caption: 'Both must hold.', say: 'Miss either, and it is opened with you. Next: what it checks.' },
			],
			sources: [SAMPLE],
			say: 'One quick scan, then fixed rules: it goes through, or it is opened with you.',
			notes: 'Every bag gets one quick scan: 20 questions, answered in about 1.5 seconds, each with how sure it is that the answer is yes. Then fixed rules, printed on one page, turn the answers into one of two outcomes: the bag goes through, or it is opened with you. In one line: it goes through only when nothing looks dangerous and it matches your form; otherwise it is opened. The exact rules, if asked. One: if any danger check is 85% sure or more, it is opened at once, with that check\u2019s printed reason. Two: it goes through at once if \u201cOn the declaration?\u201d is at least 60%, no danger check is above 25% and no doubt is above 60%. Three: otherwise it gets a second look, and goes through only if no danger check is above 25% and one sign is 90% sure or more. Otherwise it is opened.',
		},
		{
			id: 'two', layout: 'gap-lanes',
			eyebrow: '20 questions',
			title: 'It checks two things',
			saidHead: 'What you declared', you: 'Form:',
			harm: { name: 'Could it be dangerous?', count: '10 checks', cells: 10 },
			asked: { name: 'Does it match your form?', count: '10 checks', cells: 10 },
			cases: [
				{ said: flare.said, label: 'flare gun', stop: 'harm', flags: [1, 2, 8], flag: 'An\nexplosive', out: OPEN },
				{ said: '\u201cOnly clothes, and {{orange|no food}} this time.\u201d', label: 'cheese, 3 kg', stop: 'asked', flags: [6], flag: 'Not\ndeclared', out: OPEN },
				{ said: '\u201cClothes, two books and my laptop.\u201d', label: 'books, laptop', out: CLEAR },
			],
			clicks: [
				{ caption: '20 questions, under two plain ones.', say: 'Every answer serves one of the two.' },
				{ caption: 'Could it be dangerous? Then it is opened.', say: 'Weapons, explosives, animals, cash.' },
				{ caption: 'Not what you declared? It is opened.', say: 'Your form, the allowance, nothing extra.' },
				{ caption: 'Harmless and as declared: it goes through.', say: 'Both must hold.' },
			],
			// The three forms, word for word, are read aloud: about 25 of its words.
			maxWords: 45,
			sources: [SAMPLE],
			say: 'Two questions: could it be dangerous, and does it match your form?',
			notes: 'The 20 answers serve two plain questions, drawn as two machines in the hall. Could it be dangerous? Ten checks, the scanner: a weapon, an explosive, ammunition, a sharp blade, a live animal, plants or soil, fresh meat, a lot of cash, the kinds of item that are always opened, and a hidden space. Does it match your form? Ten checks, the gate: five signs that it matches (it is on the declaration, under the allowance, fits the trip, is for personal use, the scanner has seen this kind of bag before) and five doubts (hard to see inside, something not declared, an odd weight, many of one thing, new packaging). Three made-up bags. A flare gun counts as an explosive, so it is opened. Three kilos of cheese harm nobody, but the form said no food, so it is opened. Clothes, books and a laptop are harmless and declared, so they go through.',
		},
		{
			id: 'close-ask', layout: 'gap-close-ask',
			eyebrow: 'Up close',
			title: 'It holds an explosive, so it is opened',
			you: 'Form:', said: flare.said, label: flare.label,
			flow: FLOW, lists: LISTS, notice: NOTICE,
			reason: 'Flares count as explosives on every flight.',
			harmList: rows(HARM, [10, 100, 100, 0, 0, 0, 0, 0, 100, 0], { 1: { tone: 'orange' }, 2: { tone: 'orange' }, 8: { tone: 'orange' } }),
			signs: rows(SIGNS, [12, 80, 64, 90, 5]),
			doubts: rows(DOUBTS, [8, 88, 0, 0, 20]),
			chip: { text: 'Explosive?', v: '100%' },
			time: `Opened in ${CHECK_S} \u00b7 no queue`,
			clicks: [
				{ caption: 'You declared sailing gear.', say: 'The scanner sees a flare gun. ' + 'Normal on a boat; not on a plane.' },
				{ caption: 'One quick scan answers all 20 questions.', say: 'Each number is how sure it is.' },
				{ caption: 'It holds an explosive: 100%.', say: 'Three danger checks agree.' },
				{ caption: 'So it is opened with you at once.', say: 'With that check\u2019s reason. ' + 'In a second and a half.' },
			],
			// The form, the flow and its notes; the 20 answers are a lookup table and aren't counted.
			maxWords: 40,
			sources: [SAMPLE],
			say: 'It holds an explosive, so it is opened with you at once.',
			notes: 'One made-up bag. The passenger declared sailing gear from a boat trip; the scanner sees a flare gun with one cartridge. The quick check answers all 20 questions with how sure it is that the answer is yes. Could it be dangerous? \u201cExplosive?\u201d 100%, \u201cAmmunition?\u201d 100%, \u201cAlways open?\u201d 100%. A danger check at 85% or more opens the bag at once, so it goes to the desk with the reason printed for that check: \u201cFlares count as explosives on every flight.\u201d Does it match the form? \u201cOn the declaration?\u201d is only 12%, so it could not go through anyway. The scan took 1.5 seconds. Every number is made up.',
		},
		{
			id: 'close-run', layout: 'gap-close-run',
			eyebrow: 'Up close',
			title: 'Hard to see inside, but declared: it goes through',
			you: 'Form:', said: wine.said, label: wine.label,
			flow: FLOW, lists: LISTS, notice: NOTICE,
			harmList: rows(HARM, Array(10).fill(0)),
			signs: rows(SIGNS, [96, 91, 70, 88, 30], { 0: { tone: 'green', from: 5 } }),
			doubts: rows(DOUBTS, [74, 0, 6, 3, 10], { 0: { tone: 'orange', from: 4 } }),
			chips: { harm: { text: 'every danger check', v: '0%' }, doubt: { text: 'Hard to see inside?', v: '74%' }, sign: { text: 'On the declaration?', v: '96%' } },
			why: 'Foil hides what is inside.',
			ok: 'Declared, and nothing looks dangerous.',
			time: 'Through in 1.6 s \u00b7 no queue',
			clicks: [
				{ caption: 'You declared two bottles of wine.', say: 'The scanner sees two bottles. ' + 'Wrapped in foil.' },
				{ caption: 'One quick scan answers all 20 questions.', say: 'Most answers look fine.' },
				{ caption: 'Could it be dangerous? No: all 0%.', say: 'Nothing dangerous.' },
				{ caption: 'A doubt: hard to see inside (74%).', say: 'So it can\u2019t go through at once.' },
				{ caption: 'But it is on your form (96%): it goes through.', say: 'Declared, so a second look is enough; 1.6 seconds.' },
			],
			// The form, the flow and its notes; the 20 answers are a lookup table and aren't counted.
			maxWords: 40,
			sources: [SAMPLE],
			say: 'Hard to see inside, but declared: it goes through.',
			notes: 'A second made-up bag, one the quick check is unsure about. The passenger declared two bottles of wine for their sister, under the allowance; the scanner sees two bottles wrapped in foil. Could it be dangerous? No: all ten danger checks are at 0%. Does it match the form? \u201cOn the declaration?\u201d is 96%, but \u201cHard to see inside?\u201d came back 74% sure: the foil hides the bottles. The doubt keeps the bag from going through at once, so it gets a second look: no danger check is above 25%, and a sign is 90% sure or more, so it goes through, after 1.6 seconds.',
		},
		{
			id: 'results', layout: 'gap-results',
			eyebrow: 'Trial results',
			// A results table: each row names its base, its legend and the change.
			maxWords: 34,
			title: 'Safer, fewer bags opened, a fifth of the wait',
			bench: { cap: 'In the trial week', text: '**2,000** bags with a known answer' },
			cols: [{ name: 'Officer today', tone: 'purple' }, { name: 'Quick check', tone: 'blue' }],
			risky: {
				cap: 'Mistake 1', title: 'A dangerous bag went through', sub: 'of 400 that should be opened', note: '1 case = 1 bag',
				today: { count: 2, value: '0.5%', sub: '2 of 400' }, now: { none: 'None', value: '0%', sub: '0 of 400' },
			},
			needless: {
				cap: 'Mistake 2', title: 'A harmless bag was opened', sub: 'of 1,600 harmless', note: '1 case = 1 in 100',
				today: { count: 22, value: '22%', sub: '352 of 1,600' }, now: { count: 12, value: '12%', sub: '192 of 1,600', delta: '45% fewer' },
			},
			wait: {
				title: 'Typical wait', sub: 'per bag', note: '1 bar = 0.5 s', unit: 0.5,
				today: { seconds: 7.5, value: OFFICER_S }, now: { seconds: 1.5, value: CHECK_S, delta: 'A fifth' },
			},
			clicks: [
				{ caption: 'Both checked the same 2,000 bags.', say: 'Today, an officer reads every bag; new, one quick scan. Each bag has a known right answer.' },
				{ caption: 'A dangerous bag went through: 2 today, none new.', say: 'One in 200 today; none of the 400 that should be opened went through. Each red case is one bag.' },
				{ caption: 'Needless opens: 22% today, 12% new.', say: 'Each orange case is one in a hundred: 45% fewer bags opened for nothing.' },
				{ caption: 'Wait: 7.5 s today, 1.5 s new.', say: 'Each bar is half a second: a fifth of the wait.' },
			],
			sources: [SAMPLE],
			say: 'Against the officer today: safer, fewer bags opened, a fifth of the wait.',
			notes: 'The ending, side by side: today, an officer reads every bag, against the quick scan and its fixed rules. Both checked the same trial week: 2,000 bags whose right answer was known afterwards: 400 should be opened and 1,600 were harmless. Mistake 1, a bag that should be opened went through: 0.5% with the officer, 2 of the 400; the quick check let none of them through. Mistake 2, a harmless bag was opened: 22% with the officer (352 of the 1,600), 12% with the quick check (192), 45% fewer. Each red case is one bag; each orange case is one in a hundred. Typical wait per bag: 7.5 seconds with the officer, 1.5 seconds with the quick check; each bar is half a second. These numbers come from one hall in one week, and the rules were tuned on it, so they are optimistic; the next step is a second hall. Every number here is made up.',
		},
		{
			id: 'closing', layout: 'gap-closing', bg: 'dark',
			eyebrow: 'To wrap up',
			title: 'One quick scan. No queue.',
			lines: [
				{ big: 'One quick scan.', sub: 'Through, or opened with you, in seconds' },
				{ big: 'No queue.', sub: 'Safer, with 45% fewer bags opened for nothing' },
				{ thanks: 'Thank you. Questions?' },
			],
			scene: { check: `Quick check \u00b7 ${CHECK_S}`, cells: 20, tag: 'books, laptop', officer: 'Officer', closed: 'Closed' },
			clicks: [
				{ caption: 'One quick scan: through, or opened with you.', say: 'It decides every bag on its own.' },
				{ caption: 'No queue at the desk.', say: 'Safer, and fewer bags opened for nothing.' },
				{ caption: 'Thank you. Questions?', say: 'Happy to go into any of it.' },
			],
			sources: [SAMPLE],
			say: 'One quick scan. No queue.',
			notes: 'The whole talk in one line. Every bag gets one quick scan: 20 questions in about 1.5 seconds, then fixed rules decide: it goes through only when nothing looks dangerous and it matches your form; otherwise it is opened with you. The officers\u2019 reading desk is closed; they work at the opening desk instead. In the trial week that was safer (none of the 400 that should be opened went through, against 0.5%), with fewer needless opens (12% against 22%, 45% fewer) and a fifth of the wait (1.5 seconds against 7.5). Likely questions: how sure are these numbers? One hall, one week, so the next step is a second hall. What is still missing? A printed reason for every open: when a bag is opened after a second look, there is no printed reason yet. Every number here is made up.',
		},
	],
};
