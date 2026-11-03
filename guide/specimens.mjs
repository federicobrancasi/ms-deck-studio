import chatMedia from '../examples/chat-media.mjs';
import agentsSpeed from '../examples/agents-speed.mjs';
import freight from '../examples/freight-line.mjs';
import switchboard from '../examples/switchboard.mjs';
import fitting from '../examples/fitting-room.mjs';
import customs from '../examples/green-channel.mjs';
import kitchen from '../examples/tasting-pass.mjs';
import pet from '../examples/pet-studio-example.mjs';
import walk from '../examples/code-walkthroughs-example.mjs';
import bakery from '../examples/first-order.mjs';
import port from '../examples/new-terminal.mjs';
import film from '../examples/daily-film.mjs';
import studio from '../examples/pr-videos.mjs';
// Specimens for the guide: every layout once, with neutral content (no product, no company, no project). The guide
// shows these pages as thumbnails and annotated examples; it is built first by `npm run guide`.
// Numbers here are placeholders and the slides say so where it matters.
const SAMPLE = 'Sample data';
const spec = s => ({ notes: 'Specimen for the guide.', ...s });

// ---------- level 1: simple (cards, big numbers, words) ----------
const simple = [
	{ id: 's1-title', layout: 'title', eyebrow: 'Team  \u00b7  Review', title: 'The claim of the talk,\nin one line', sub: 'One sentence that frames why it matters.', speaker: { initials: 'AB', name: 'Your Name', role: 'Team  \u00b7  1 Dec 2026' } },
	{ id: 's1-cards', layout: 'cards', title: 'What changes, in three points',
		hero: { label: 'Overview', title: 'The new version', sub: 'A faster start, the same features' },
		stat: { value: '3\u00d7', label: 'Faster to start', sub: SAMPLE, tone: 'blue' },
		items: [{ title: 'Smaller', text: 'Half the download size.' }, { title: 'Local', text: 'Runs on the device, no network.' }, { title: 'Compatible', text: 'Same settings and files.' }] },
	{ id: 's1-scorecard', layout: 'scorecard', eyebrow: 'Scorecard', title: 'The baseline still wins overall',
		left: { label: 'Baseline', value: '71%', sub: 'Current version', tone: 'blue' },
		right: { label: 'New version', value: '58%', sub: 'Candidate', tone: 'blue' },
		delta: { text: '\u221213 pts', tone: 'orange' },
		rows: [{ value: '22', label: 'Better', text: 'Cases the new version solved', tone: 'green' }, { value: '48', label: 'Worse', text: 'Cases it broke', tone: 'orange' }, { value: '130', label: 'Same', text: 'No difference', tone: 'neutral' }],
		sources: [SAMPLE] },
	{ id: 's1-bignumber', layout: 'bignumber', eyebrow: 'Root cause', title: 'Most failures have one cause', value: '76%', unit: 'of failures', tone: 'orange',
		meter: { value: 0.76, label: 'Share of failures with this cause' },
		panels: [{ label: 'The problem', title: 'It changes too much', text: 'Edits go beyond what was asked.', tone: 'orange' }, { label: 'The insight', title: 'It never learned to stop', text: 'Training rewarded the end result only.', tone: 'blue' }],
		sources: [SAMPLE] },
	{ id: 's1-breakdown', layout: 'breakdown', eyebrow: 'By category', title: 'Better on two, worse on three',
		items: [
			{ title: 'Category A', sub: 'Short tasks', value: '\u221218%', tone: 'red', detail: 'New 61%  vs  base 79%' },
			{ title: 'Category B', sub: 'Follow-ups', value: '+4%', tone: 'green', detail: 'New 65%  vs  base 61%' },
			{ title: 'Category C', sub: 'Reported bugs', value: '+19%', tone: 'green', detail: 'New 41%  vs  base 22%' },
			{ title: 'Category D', sub: 'Mixed tasks', value: '\u221221%', tone: 'red', detail: 'New 42%  vs  base 63%' },
			{ title: 'Category E', sub: 'Optional', value: '\u221230%', tone: 'red', detail: 'New 40%  vs  base 70%' },
			{ title: 'Category F', sub: 'Simple edits', value: '\u22125%', tone: 'neutral', detail: 'New 0%  vs  base 5%' },
		], sources: [SAMPLE] },
	{ id: 's1-versus', layout: 'versus', eyebrow: 'Trade-offs', title: 'On the device or in the cloud',
		left: { label: 'Option A', title: 'On the device', items: [{ title: 'Private', text: 'Data stays on the machine' }, { title: 'Instant', text: 'No network round trip' }, { title: 'Needs hardware', text: 'Not every device can run it', good: false }] },
		right: { label: 'Option B', title: 'In the cloud', items: [{ title: 'Most capable', text: 'Not limited by the device' }, { title: 'Everywhere', text: 'Any device, any size' }, { title: 'Latency', text: 'Slower on a bad connection', good: false }] } },
	{ id: 's1-takeaways', layout: 'takeaways', eyebrow: 'Summary', title: 'What we learned',
		items: [{ label: 'The finding', title: 'Small can beat big on narrow tasks', text: 'With the right training, size mattered less.' }, { label: 'The next step', title: 'Try it where speed matters most', text: 'Start with one workflow and measure.' }],
		note: 'Not a replacement yet, but worth a place in the plan.' },
	{ id: 's1-statement', layout: 'statement', eyebrow: 'The point', text: 'A slide says {{blue|one thing}}, and the title says it.' },
	{ id: 's1-counters', layout: 'counters', eyebrow: 'At a glance', title: 'Three numbers to remember',
		items: [{ value: '42%', label: 'Faster', sub: 'median time', tone: 'green' }, { value: '3', label: 'Teams', sub: 'in the pilot', tone: 'blue' }, { value: '\u221210%', label: 'Errors', sub: 'per week', tone: 'purple' }], sources: [SAMPLE] },
	{ id: 's1-checklist', layout: 'checklist', eyebrow: 'Next steps', title: 'Three things to do this month',
		items: [{ icon: 'checkCircle', tone: 'green', title: 'Ship the pilot to one team' }, { icon: 'chart', tone: 'blue', title: 'Measure it against the baseline' }, { icon: 'people', tone: 'purple', title: 'Decide with the results in hand' }] },
	{ id: 's1-quote', layout: 'quote', bg: 'blue', eyebrow: 'From the pilot', text: 'It was faster, and I stopped noticing it was there.', who: { initials: 'AB', name: 'A pilot user', role: 'Sample quote' } },
	{ id: 's1-section', layout: 'section', number: '02', eyebrow: 'Part 2', title: 'The results', sub: 'What changed, and by how much.', chips: [{ icon: 'chart', text: 'Numbers' }, { icon: 'checkCircle', text: 'Decision' }] },
	{ id: 's1-close', layout: 'close', text: 'Questions?', speaker: { initials: 'AB', name: 'Your Name' } },
];

// ---------- level 2: graphs (charts, tables, diagrams) ----------
const graphs = [
	{ id: 's2-bars', layout: 'bars', eyebrow: 'Adoption', title: 'Weekly use doubled after the launch', tag: { text: 'Preview', tone: 'orange', icon: 'beaker' }, unit: '%', max: 100,
		bars: [{ label: 'Jun', value: 22 }, { label: 'Jul', value: 25 }, { label: 'Aug', value: 31 }, { label: 'Sep', value: 58, on: true }, { label: 'Oct', value: 63 }],
		note: 'Share of people who used it at least once a week.', sources: ['Usage dashboard, Oct 2026 (sample data)'] },
	{ id: 's2-funnel', layout: 'funnel', eyebrow: 'Requests', title: 'Only a few requests need a person', stages: [{ value: '12,400', label: 'requests last month' }, { value: '1,860', label: 'could not be undone', tone: 'orange' }, { value: '214', label: 'went to a person', tone: 'red' }], sources: [SAMPLE] },
	{ id: 's2-matrix', layout: 'matrix', eyebrow: 'Results', title: 'Better on three of four tasks',
		columns: [{ label: 'Task', width: '1.5fr' }, { label: 'Baseline', width: '1fr' }, { label: 'New', width: '1fr' }, { label: 'Change', width: '1fr' }],
		rows: [
			['Task one', { text: '71%', mono: true }, { text: '84%', mono: true }, { text: '+13 pts', ok: true }],
			['Task two', { text: '64%', mono: true }, { text: '73%', mono: true }, { text: '+9 pts', ok: true }],
			['Task three', { text: '58%', mono: true }, { text: '66%', mono: true }, { text: '+8 pts', ok: true }],
			['Task four', { text: '80%', mono: true }, { text: '79%', mono: true }, { text: '\u22121 pt', ok: false }],
			{ cells: ['Overall', { text: '68%', mono: true }, { text: '76%', mono: true }, { text: '+8 pts', ok: true }], tone: 'blue' },
		], note: 'Pass rate, 400 runs per task.', sources: [SAMPLE] },
	{ id: 's2-hero', layout: 'hero', eyebrow: 'The headline number', value: '\u221248%', tone: 'green', icon: 'timer', label: 'time to the first answer, after six months', sub: 'same team, same hours', sources: [SAMPLE] },
	{ id: 's2-flow', layout: 'flow', eyebrow: 'Process', title: 'Risky actions stop and ask a person', cols: 4, rows: 2,
		nodes: [
			{ id: 'a', col: 0, row: 0, title: 'A request comes in', icon: 'mail', tone: 'blue' },
			{ id: 'q', col: 1, row: 0, title: 'Can it be undone?', kind: 'decision' },
			{ id: 'go', col: 3, row: 0, title: 'It runs', icon: 'play', tone: 'green' },
			{ id: 'p', col: 1, row: 1, title: 'A person decides', icon: 'person', tone: 'orange' },
			{ id: 'l', col: 2, row: 1, title: 'It is logged', icon: 'history', tone: 'blue' },
		],
		edges: [{ from: 'a', to: 'q' }, { from: 'q', to: 'go', label: 'yes', tone: 'green' }, { from: 'q', to: 'p', label: 'no', tone: 'orange' }, { from: 'p', to: 'l' }, { from: 'l', to: 'go', label: 'if allowed' }] },
	{ id: 's2-pipeline', layout: 'pipeline', eyebrow: 'Releases', title: 'Every change takes the same four stops',
		stages: [{ icon: 'edit', title: 'Write', sub: 'Draft the change', tone: 'blue' }, { icon: 'beaker', title: 'Test', sub: 'Automated checks', tone: 'green' }, { icon: 'eye', title: 'Review', sub: 'A second pair of eyes', tone: 'purple', on: true }, { icon: 'rocket', title: 'Ship', sub: 'Weekly release', tone: 'blue' }],
		loop: { from: 2, to: 0, label: 'changes requested' } },
	{ id: 's2-build', layout: 'pipeline', eyebrow: 'Click by click', title: 'Each click adds one step',
		stages: [{ icon: 'edit', title: 'Write', tone: 'blue' }, { icon: 'beaker', title: 'Test', tone: 'green' }, { icon: 'eye', title: 'Review', tone: 'purple' }],
		clicks: [{ caption: 'First, someone writes the change', say: '.' }, { caption: 'Then automated tests run on it', say: '.' }, { caption: 'Then a person reviews it', say: '.' }] },
	{ id: 's2-lanes', layout: 'lanes', eyebrow: 'Who does what', title: 'People decide, automation does the legwork',
		lanes: [{ id: 'p', title: 'People', icon: 'people', tone: 'green' }, { id: 'a', title: 'Automation', icon: 'settings', tone: 'purple' }],
		steps: [{ lane: 'p', icon: 'bug', title: 'Someone reports it' }, { lane: 'a', icon: 'search', title: 'It is sorted', sub: 'and de-duplicated' }, { lane: 'a', icon: 'code', title: 'A fix is drafted' }, { lane: 'p', icon: 'checkmark', title: 'Someone approves' }, { lane: null, icon: 'rocket', title: 'Release' }] },
	{ id: 's2-timeline', layout: 'timeline', eyebrow: 'Roadmap', title: 'From pilot to everyone in a year',
		items: [{ date: 'Jan 2026', title: 'Pilot', sub: 'One team' }, { date: 'Mar 2026', title: 'Rules written' }, { date: 'Jun 2026', title: 'Ten teams' }, { date: 'Sep 2026', title: 'Everyone' }, { date: 'Dec 2026', title: 'Today', now: true }] },
	{ id: 's2-cycle', layout: 'cycle', eyebrow: 'Quality', title: 'Fix the pattern, not just the bug',
		steps: [{ icon: 'bug', title: 'Spot a pattern' }, { icon: 'shield', title: 'Write a rule' }, { icon: 'wrench', title: 'Fix old cases' }, { icon: 'sparkle', title: 'New work follows' }], center: { title: 'it gets better', icon: 'repeat' } },
	{ id: 's2-layers', layout: 'layers', eyebrow: 'Architecture', title: 'Three layers, one owner each',
		layers: [{ icon: 'window', title: 'Interface', sub: 'What people see', tone: 'blue' }, { icon: 'settings', title: 'Services', sub: 'What it does', tone: 'purple' }, { icon: 'database', title: 'Data', sub: 'What it keeps', tone: 'green' }] },
	{ id: 's2-quad', layout: 'quad', eyebrow: 'Decisions', title: 'Watch closely only where it matters',
		x: { label: 'Undo', low: 'hard', high: 'easy' }, y: { label: 'Stakes', low: 'low', high: 'high' },
		cells: [{ icon: 'eye', title: 'Approve each step', tone: 'red' }, { icon: 'checklist', title: 'Review it first', tone: 'orange' }, { icon: 'shield', title: 'Sandbox it', tone: 'purple' }, { icon: 'play', title: 'Let it run', tone: 'green' }] },
	{ id: 's2-split', layout: 'split', eyebrow: 'Before and after', title: 'One screen instead of three',
		left: { label: 'Before', tone: 'orange', icon: 'dismissCircle', lines: [{ text: 'Three screens', ok: false }, { text: 'Two logins', ok: false }] },
		right: { label: 'After', tone: 'green', icon: 'checkCircle', lines: [{ text: 'One screen', ok: true }, { text: 'One login', ok: true }] },
		verdict: { text: 'Fewer places to get lost.', tone: 'blue', icon: 'lightbulb' } },
	{ id: 's2-code', layout: 'code', eyebrow: 'In code', title: 'The setting is one line', lang: 'json', file: 'settings.json',
		code: '{\n  "editor.fontSize": 14,\n  "feature.enabled": true,\n  "feature.mode": "fast"\n}', highlight: [3],
		callouts: [{ lines: [3, 3], title: 'Turn it on', text: 'Off by default.' }] },
	{ id: 's2-terminal', layout: 'terminal', eyebrow: 'Try it', title: 'One command to build the deck', window: 'Terminal',
		lines: [{ cmd: 'npm run build -- --deck my-talk' }, { out: 'Checks: clean', tone: 'green' }, { comment: 'out/my-talk.pdf' }] },
];

// ---------- level 3: illustrations (drawn objects, click-by-click pictures) ----------
const drawn = [
	{ id: 's3-roadsign', layout: 'roadsign', eyebrow: 'Sales', title: 'Orders fell where checkout got slower',
		big: { change: '\u221212%', plate: 'Slow checkout', sub: 'more than three steps' }, small: { change: '+8%', plate: 'Fast checkout' },
		kicker: 'Orders, per checkout', lines: [{ text: '**Slow checkout:** fewer orders', tone: 'red' }, { text: '**Fast checkout:** steady growth', tone: 'green' }],
		pill: { text: 'Cut a step, not a feature', tone: 'blue', icon: 'lightbulb' }, sources: [SAMPLE] },
	{ id: 's3-gate', layout: 'gate', eyebrow: 'Safety', title: 'A note on the wall does not stop anyone', note: 'Please don\u2019t\ntouch live data',
		open: { label: 'advice', sub: 'a rule people may skip' }, closed: { label: 'a wall', sub: 'a rule that is enforced', text: 'Scripts get **no access** to live data.' } },
	{ id: 's3-metro', layout: 'metro', eyebrow: 'Process', title: 'A failed payment takes the long way round',
		start: { title: 'Order placed' }, junction: { title: 'Payment failed?' }, end: { title: 'Order shipped' },
		yes: 'yes', no: 'no', then: 'then', loop: [{ title: 'Retry the card', sub: 'once, an hour later' }, { title: 'Email the customer', sub: 'with a pay link' }] },
	{ id: 's3-keyring', layout: 'keyring', eyebrow: 'Access', title: 'Every key opens a different door',
		keys: [
			{ name: 'Public key', text: 'pk_live_\u2026', title: 'Fine in the page', sub: 'opens the front door', tone: 'green' },
			{ name: 'Server key', text: 'sk_live_\u2026', title: 'Server only', sub: 'opens every door', tone: 'blue' },
			{ name: 'Admin key', text: 'adm_\u2026', title: 'Vault only', sub: 'changes the locks', tone: 'purple' },
			{ name: 'Leaked key', text: 'sk_live_\u2026', title: 'Leaked? Replace it.', tone: 'red', broken: true, chips: ['a chat', 'a screenshot'] },
		] },
	{ id: 's3-gears', layout: 'gears', bg: 'blue', eyebrow: 'Release checklist', title: 'Four checks before anything ships',
		gears: [{ icon: 'documentText', title: 'Explain it', sub: 'in plain words' }, { icon: 'beaker', title: 'Test it', sub: 'on a clean machine' }, { icon: 'warning', title: 'Break it', sub: 'on purpose' }, { icon: 'people', title: 'Fresh eyes', sub: 'someone new reads it' }],
		accept: { icon: 'checkmark', title: 'Ship' } },
	{ id: 's3-balloon', layout: 'balloon', bg: 'blue', eyebrow: 'Retrospective', title: 'Drop what slows you down',
		text: 'We shipped faster the month\nwe stopped doing things\njust because we always had.', who: { name: 'A team lead', role: 'sample quote' }, bags: ['Weekly\nstatus deck', 'Manual\nreleases'] },
	{ id: 's3-story', layout: 'story', look: 'road', eyebrow: 'What happened  \u00b7  March 2026', title: 'A two-day report now takes an hour',
		who: { icon: 'people', text: 'A finance team (sample story)' },
		beats: [{ time: 'Before', icon: 'calendar', text: 'Two days by hand, every month' }, { time: 'Week 1', icon: 'bot', tone: 'purple', text: 'An assistant drafts it' }, { time: 'The catch', icon: 'warning', tone: 'red', text: 'Two numbers wrong in the draft' }, { time: 'The fix', icon: 'checkmark', tone: 'green', text: 'Checked against last month, then signed' }],
		outcome: { label: 'Since April', value: '1 hour', text: 'to a report a person signs off', tone: 'green' }, sources: [SAMPLE] },
	{ id: 's3-convo', layout: 'convo', look: 'light', eyebrow: 'A conversation', title: 'Three agents agree on a plan',
		cast: { Planner: { model: 'model A', color: 'purple' }, Builder: { model: 'model B', color: 'teal' }, Checker: { model: 'model C', color: 'gold' } },
		messages: [{ at: 1, who: 'Planner', tag: 'plans', text: 'Three parts: colours, toggle, tests.' }, { at: 1, who: 'Builder', tag: 'builds', text: 'Colours done. I added one setting.' }, { at: 1, who: 'Checker', tag: 'checks', text: 'Two charts are unreadable. Sending back.' }],
		clicks: [{ caption: 'Each agent says what it did', say: '.' }] },
];

// ---------- the house style: the six designs people picked side by side ----------
const house = [
	{ id: 'h-cover', layout: 'fork-cover', eyebrow: 'Team  \u00b7  Study', title: 'One check routes the work', sub: 'What we found, and why it matters.', speaker: { initials: 'AB', name: 'Your Name', role: 'Team' },
		start: { icon: 'mail' }, node: { icon: 'checklist', label: 'One check' }, ends: [{ title: 'Careful path', sub: 'full review', tone: 'purple' }, { title: 'Careful path', sub: 'light review', tone: 'purple' }, { title: 'Fast path', sub: 'instant', icon: 'flash', tone: 'neutral' }] },
	{ id: 'h-sieve', layout: 'sieve', eyebrow: 'Hard cases', title: 'Today we miss two in three', kicker: '100 cases that need care',
		panels: [{ name: 'Today', value: 34, big: '34%', label: 'caught', tone: 'red' }, { name: 'New', value: 91, big: '91%', label: 'caught', tone: 'green' }],
		caught: { title: 'Careful path', icon: 'checkCircle' }, missed: { title: 'Fell through', icon: 'arrowDown' } },
	{ id: 'h-flow', layout: 'flow-bands', eyebrow: 'How it works', title: 'One check, then two small decisions', kicker: 'Band width: share of cases',
		source: { title: 'Case', icon: 'mail' }, node: { title: 'Quick check', sub: '10 questions', icon: 'checklist', marks: 10 },
		gates: [{ title: 'Needs care?', yes: 'yes', no: 'no' }, { title: 'Light review?', yes: 'yes', no: 'no' }],
		outcomes: [{ title: 'Light review', share: 41 }, { title: 'Full review', share: 22 }, { title: 'Fast path', share: 37 }] },
	{ id: 'h-dumbbell', layout: 'dumbbell', eyebrow: 'By group', title: 'Better in all six groups', legend: { from: 'Before', to: 'After' },
		rows: [{ label: 'Group A', from: 52, to: 84, gain: '+32', hi: true }, { label: 'Group B', from: 61, to: 88, gain: '+27', hi: true }, { label: 'Group C', from: 70, to: 82, gain: '+12' }, { label: 'Group D', from: 66, to: 75, gain: '+9', mark: true }, { label: 'Group E', from: 73, to: 80, gain: '+7' }, { label: 'Group F', from: 77, to: 80, gain: '+3' }],
		mark: { icon: 'money', text: 'Cheaper only on this one' }, axis: 'Score' },
	{ id: 'h-ladders', layout: 'ladders', eyebrow: 'Every plan', title: 'Every plan costs less', rows: ['Low', 'Mid', 'High'],
		columns: [{ name: 'Basic', rungs: ['fast', 'light', null], value: '\u221212%' }, { name: 'Plus', rungs: ['fast', 'light', 'full'], value: '\u221218%' }, { name: 'Pro', rungs: ['fast', 'light', 'full'], value: '\u221231%' }],
		caption: 'Cost vs today', unused: 'not used' },
	{ id: 'h-launch', layout: 'launch', bg: 'blue', eyebrow: 'Next', title: 'Prove it live before it ships',
		steps: [{ icon: 'plug', title: 'Wire it up', sub: 'one per case' }, { icon: 'beaker', title: 'Shadow run', sub: 'every plan' }, { icon: 'people', title: 'A/B test', sub: 'before rollout' }], pad: 'Go live' },
];

// ---------- more illustrations: designs/illustrations.mjs ----------
const PIC = n => `assets/samples/sample-${n}.svg`;
const more = [
	{ id: 'm-picture', layout: 'picture-cover', eyebrow: 'Team  \u00b7  Launch', title: 'The new dashboard is live', sub: 'What changed, and what it looks like.',
		speaker: { initials: 'AB', name: 'Your Name', role: 'Team' }, pills: [{ text: 'Shipped', tone: 'green', icon: 'checkCircle' }],
		src: PIC('chart'), side: [PIC('list'), PIC('canvas')], caption: 'A sample screen' },
	{ id: 'm-factory', layout: 'factory', eyebrow: 'How it works', title: 'One request in, a finished report out',
		input: { icon: 'mail', title: 'A request', sub: 'one line' },
		stations: [{ icon: 'search', title: 'Gather', tone: 'blue' }, { icon: 'edit', title: 'Draft', tone: 'purple' }, { icon: 'checklist', title: 'Check', tone: 'orange' }, { icon: 'eye', title: 'Review', tone: 'green' }],
		output: { title: 'The report', sub: 'signed off' } },
	{ id: 'm-orbit', layout: 'orbit', eyebrow: 'The family', title: 'One engine, five products',
		center: { icon: 'settings', title: 'One engine' },
		items: [{ icon: 'document', title: 'Reports', tone: 'blue' }, { icon: 'slideText', title: 'Slides', tone: 'purple' }, { icon: 'videoClip', title: 'Videos', tone: 'red' }, { icon: 'mail', title: 'Emails', tone: 'green' }, { icon: 'chat', title: 'Answers', tone: 'orange' }] },
	{ id: 'm-stopwatch', layout: 'stopwatch', eyebrow: 'Fast', title: 'A one-minute job takes nine seconds',
		max: 60, unit: 's', center: { value: '60 s', label: 'by hand' },
		parts: [{ value: 6, label: 'Build', tone: 'blue' }, { value: 3, label: 'Check', tone: 'purple' }], sources: [SAMPLE] },
	{ id: 'm-devices', layout: 'devices', eyebrow: 'Any input', title: 'A phone photo in, a page and a slide out',
		from: { kind: 'phone', icon: 'image', title: 'A photo', sub: 'of a whiteboard' }, via: { icon: 'bot', title: 'An assistant' },
		to: [{ kind: 'file', src: PIC('list'), title: 'A page', sub: 'clean notes' }, { kind: 'laptop', src: PIC('canvas'), title: 'A slide', sub: 'the diagram, redrawn' }] },
	{ id: 'm-film', layout: 'film-strip', eyebrow: 'Storyboard', title: 'Every scene, planned before filming', aspect: 0.8,
		rows: [{ label: 'Scenes', sub: 'one minute', frames: [
			{ icon: 'flag', title: 'Hook', tone: 'blue', tag: 'drawn' }, { icon: 'image', title: 'Before', tone: 'neutral', tag: 'recorded' }, { icon: 'image', title: 'After', tone: 'neutral', tag: 'recorded' },
			{ icon: 'dataBar', title: 'Numbers', tone: 'purple', tag: 'drawn' }, { icon: 'people', title: 'Quote', tone: 'orange', tag: 'card' }, { icon: 'checkmark', title: 'Close', tone: 'green', tag: 'drawn' }] }],
		legend: [{ tone: 'blue', text: 'drawn' }, { tone: 'neutral', text: 'recorded' }, { tone: 'orange', text: 'card' }] },
	{ id: 'm-hopper', layout: 'hopper', eyebrow: 'Triage', title: '400 ideas in, five projects out',
		input: { value: '400', label: 'ideas sent in' }, output: { value: '5', label: 'projects funded', count: 5 },
		result: { icon: 'rocket', title: 'Five projects', sub: 'staffed this quarter' }, sources: [SAMPLE] },
	{ id: 'm-odometer', layout: 'odometer', eyebrow: 'This year', title: 'Thousands of orders, a handful of returns',
		counters: [{ value: '12,480', label: 'Orders', tone: 'blue' }, { value: '96', label: 'Returns', tone: 'orange' }, { value: '18', label: 'Countries', tone: 'green' }], sources: [SAMPLE] },
	{ id: 'm-pinboard', layout: 'pinboard', eyebrow: 'Found in testing', title: 'Three bugs, caught before launch', label: 'Fixed this week',
		items: [{ title: 'Slow search', sub: 'big accounts', from: '9 s', to: '1 s' }, { title: 'Lost drafts', sub: 'on refresh', tone: 'orange' }, { title: 'Wrong totals', sub: 'in one currency', tone: 'purple' }] },
	{ id: 'm-moving', layout: 'moving', eyebrow: 'Migration', title: 'Four services moved before the old servers stop',
		from: { title: 'Old servers', sub: 'switched off in June' }, to: { title: 'New platform', sub: 'one place' }, sign: { text: 'Ends June 30' },
		boxes: [{ title: 'Billing', done: true }, { title: 'Search', done: true }, { title: 'Accounts', done: true }, { title: 'Reports', done: true }, { title: 'Archive', sub: 'next' }] },
	{ id: 'm-scales', layout: 'scales', eyebrow: 'Validated', title: 'The new system gives the same answers', max: 20,
		items: [{ title: 'Invoices', left: { label: 'old', value: '412' }, right: { label: 'new', value: '412' }, note: 'identical' }, { title: 'Refunds', left: { label: 'old', value: '57' }, right: { label: 'new', value: '58' }, note: 'one rounding fix' }], sources: [SAMPLE] },
];

// ---------- props: frames for devices and windows (src/props.mjs) ----------
const propsPage = [{ id: 'p-props', layout: 'guide-props', eyebrow: 'Props', title: 'Real devices, drawn once',
	screens: { laptop: PIC('chart'), monitor: PIC('list') } }];

const castPage = [{ id: 'p-cast', layout: 'guide-cast', eyebrow: 'Characters', title: 'People and an agent, drawn once',
	cast: [
		{ kind: 'person', label: "pose: 'wave'", pose: 'wave', top: 'blue', outfit: 'hoodie', hair: 'dark', skin: 'medium' },
		{ kind: 'person', label: "hold: 'laptop'", pose: 'hold', hold: 'laptop', top: 'purple', outfit: 'blazer', hair: 'blonde', hairStyle: 'long', glasses: true },
		{ kind: 'agent', label: "agent()", pose: 'wave' },
		{ kind: 'person', label: "hold: 'clipboard'", pose: 'stand', hold: 'clipboard', top: 'orange', outfit: 'coat', hair: 'grey', skin: 'deep', mood: 'focus' },
		{ kind: 'agent', label: "hold: 'wrench'", pose: 'hold', hold: 'wrench', tone: 'blue', mood: 'busy', wheels: false },
		{ kind: 'person', label: "pose: 'point'", pose: 'point', top: 'green', outfit: 'shirt', hair: 'red', hairStyle: 'bun', skin: 'light', badge: 'blue' },
	] }];

// ---------- the gallery worlds: a cover and one signature slide from each illustrated example ----------
const pick = (deck, id, as) => ({ ...deck.slides.find(x => x.id === id), id: as });
const worlds2 = [
	pick(kitchen, 'cover', 'w2-kitchen-cover'), pick(pet, 'cover', 'w2-pet-cover'), pick(walk, 'cover', 'w2-walk-cover'), pick(bakery, 'cover', 'w2-bakery-cover'),
	pick(kitchen, 'pass', 'w2-kitchen-pass'), pick(pet, 'reels', 'w2-pet-reels'), pick(walk, 'film', 'w2-walk-shoot'), pick(bakery, 'try1', 'w2-bakery-door'),
];
const worlds3 = [
	pick(freight, 'cover', 'w3-rail'), pick(switchboard, 'cover', 'w3-switch'), pick(fitting, 'cover', 'w3-tailor'),
	pick(customs, 'cover', 'w3-airport'), pick(chatMedia, 'cover', 'w3-chat'), pick(agentsSpeed, 'cover', 'w3-bench'),
];
const worlds = [
	pick(port, 'cover', 'w-port-cover'), pick(port, 'hazards', 'w-port-light'),
	pick(film, 'cover', 'w-film-cover'), pick(film, 'spotlight', 'w-film-spot'),
	pick(studio, 'cover', 'w-studio-cover'), pick(studio, 'count', 'w-studio-shelf'),
];

// ---------- do and don't ----------
const pairs = [
	{ id: 'x-wall', layout: 'checklist', eyebrow: 'Quarterly review', title: 'Quarterly results', maxWords: 90,
		items: [
			{ icon: 'circle', tone: 'neutral', title: 'Revenue grew in most regions compared to last quarter', sub: 'Strongest growth in the two markets we entered this year, weaker elsewhere' },
			{ icon: 'circle', tone: 'neutral', title: 'Customer satisfaction stayed roughly flat overall', sub: 'Some improvement in support response times, but onboarding still slow' },
			{ icon: 'circle', tone: 'neutral', title: 'Costs increased slightly due to new hires and tools', sub: 'Expected to stabilise next quarter as the new team ramps up' },
		] },
	{ id: 'x-claim', layout: 'bars', eyebrow: 'Quarterly review', title: 'Growth came from two new markets', unit: '%', max: 40,
		bars: [{ label: 'North', value: 4 }, { label: 'South', value: 6 }, { label: 'East', value: 5 }, { label: 'New A', value: 31, on: true }, { label: 'New B', value: 27, on: true }],
		note: 'Revenue growth by region, quarter on quarter.', sources: [SAMPLE] },
	{ id: 'x-rainbow', layout: 'bars', eyebrow: 'Quarterly review', title: 'Growth came from two new markets', unit: '%', max: 40,
		bars: [{ label: 'North', value: 4, tone: 'red' }, { label: 'South', value: 6, tone: 'orange' }, { label: 'East', value: 5, tone: 'green' }, { label: 'New A', value: 31, tone: 'purple' }, { label: 'New B', value: 27, tone: 'blue' }],
		note: 'Revenue growth by region, quarter on quarter.', sources: [SAMPLE] },
];

export default {
	title: 'Specimens',
	file: 'specimens',
	ref: 'Deck name  \u00b7  Context  \u00b7  1 Dec 2026',
	variety: false,
	nosrc: true,
	maxWords: 60,
	sections: [
		{ id: 'simple', title: 'Simple', slides: simple.map(spec) },
		{ id: 'graphs', title: 'Graphs', slides: graphs.map(spec) },
		{ id: 'drawn', title: 'Illustrations', slides: drawn.map(spec) },
		{ id: 'house', title: 'House style', slides: house.map(spec) },
		{ id: 'more', title: 'More illustrations', slides: more.map(spec) },
		{ id: 'worlds', title: 'Gallery worlds', slides: worlds },
		{ id: 'worlds2', title: 'More gallery worlds', slides: worlds2 },
		{ id: 'worlds3', title: 'Six more worlds', slides: worlds3 },
		{ id: 'props', title: 'Props', slides: propsPage.map(spec) },
		{ id: 'cast', title: 'Characters', slides: castPage.map(spec) },
		{ id: 'pairs', title: 'Do and don\u2019t', slides: pairs.map(spec) },
	],
};
