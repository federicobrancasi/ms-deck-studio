// Example: a quick update at level 1 (simple). Cards, big numbers and a scorecard: no drawings.
// Every name and number here is made up. Build: node src/build.mjs --deck update
const SAMPLE = 'Sample data, made up for this example';

export default {
	title: 'Exploring a smaller model for suggestions',
	file: 'update',
	ref: 'Model exploration  \u00b7  Team review  \u00b7  1 Dec 2026',
	slides: [
		{ id: 'cover', layout: 'title', eyebrow: 'Exploration', title: 'A smaller model\nfor suggestions', sub: 'A comparison against the model we use today.', speaker: { initials: 'FB', name: 'Federico Brancasi', role: 'Microsoft  \u00b7  1 Dec 2026' },
			notes: 'One sentence on why we looked: a smaller model could run on the device.' },
		{ id: 'overview', layout: 'cards', title: 'The candidate in three points',
			hero: { label: 'Model overview', title: 'The challenger', sub: 'An open, small model' },
			stat: { value: '2B', label: 'Parameters', sub: 'about a tenth of today\u2019s', tone: 'blue' },
			items: [{ title: 'Open', text: 'Weights and code are public.' }, { title: 'Local', text: 'Runs on a laptop, no network.' }, { title: 'Whole-file', text: 'Predicts the final file, not a diff.' }],
			sources: [SAMPLE], notes: 'What we tested, in one page.' },
		{ id: 'score', layout: 'scorecard', eyebrow: 'Scorecard', title: 'Today\u2019s model still wins overall',
			left: { label: 'Today', value: '71%', sub: 'Current model' }, right: { label: 'Candidate', value: '58%', sub: 'Smaller model' },
			delta: { text: '\u221213 pts', tone: 'orange' },
			rows: [{ value: '22', label: 'Better', text: 'Cases only the candidate got right', tone: 'green' }, { value: '48', label: 'Worse', text: 'It changed code it should have left', tone: 'orange' }, { value: '130', label: 'Same', text: 'Both right, or both wrong', tone: 'neutral' }],
			sources: [SAMPLE], notes: 'Pass rate on 200 sample editing tasks. The rows count tasks.' },
		{ id: 'cause', layout: 'bignumber', eyebrow: 'Root cause', title: 'It doesn\u2019t know when to stay quiet', value: '76%', unit: 'of its failures', tone: 'orange',
			meter: { value: 0.76, label: 'Failures where it edited too much' },
			panels: [{ label: 'The problem', title: 'It edits more than asked', text: 'Extra comments, logic and changes.', tone: 'orange' }, { label: 'The insight', title: 'It was trained on final files', text: 'So it never learned to make one small change.', tone: 'blue' }],
			sources: [SAMPLE], notes: 'Most of the gap has one cause, and it comes from how it was trained.' },
		{ id: 'breakdown', layout: 'breakdown', eyebrow: 'By category', title: 'Better on bugs, worse on restraint',
			items: [
				{ title: 'Stay quiet', sub: 'No edit needed', value: '\u221218%', tone: 'red', detail: 'Candidate 61%  vs  today 79%' },
				{ title: 'Follow-ups', sub: 'Needed next edits', value: '+6%', tone: 'green', detail: 'Candidate 66%  vs  today 60%' },
				{ title: 'Reported bugs', sub: 'From real users', value: '+19%', tone: 'green', detail: 'Candidate 41%  vs  today 22%' },
				{ title: 'General', sub: 'Mixed tasks', value: '\u221215%', tone: 'red', detail: 'Candidate 47%  vs  today 62%' },
				{ title: 'Optional', sub: 'Nice to have', value: '\u221230%', tone: 'red', detail: 'Candidate 40%  vs  today 70%' },
				{ title: 'Mechanical', sub: 'Simple edits', value: '\u22122%', tone: 'neutral', detail: 'Candidate 8%  vs  today 10%' },
			], sources: [SAMPLE], notes: 'Where it wins and where it loses.' },
		{ id: 'tradeoffs', layout: 'versus', eyebrow: 'Where it runs', title: 'On the device or in the cloud',
			left: { label: 'Local', title: 'On the device', items: [{ title: 'Private', text: 'Code stays on the machine' }, { title: 'Instant', text: 'No network' }, { title: 'Needs hardware', text: 'Not every machine', good: false }] },
			right: { label: 'Cloud', title: 'In the cloud', items: [{ title: 'Most capable', text: 'No hardware limit' }, { title: 'Everywhere', text: 'Any device' }, { title: 'Latency', text: 'Slower when offline', good: false }] },
			notes: 'The trade-off we would be making.' },
		{ id: 'learned', layout: 'takeaways', eyebrow: 'Summary', title: 'What this taught us',
			items: [{ label: 'The finding', title: 'Small models can win on narrow tasks', text: 'It beat today\u2019s model on reported bugs.' }, { label: 'The opportunity', title: 'Small, specialised helpers', text: 'Cheap, fast models for one job each.' }],
			note: 'Not a drop-in replacement, but worth a place in the plan.', notes: 'End on what to do with it.' },
		{ id: 'close', layout: 'close', text: 'Questions?', speaker: { initials: 'FB', name: 'Federico Brancasi' }, notes: 'Take questions.' },
	],
};
