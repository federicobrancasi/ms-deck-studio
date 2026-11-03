// Example: a one-page results table. Baseline first, the change last, the overall row tinted, the sample size and the
// unit said under it. Every number here is made up.
// Build: node src/build.mjs --deck results-page
export default {
	title: 'Fabrikam assistant: results by task',
	file: 'results-page',
	ref: 'Fabrikam assistant  \u00b7  Results  \u00b7  14 Sep 2026',
	slides: [
		{ id: 'table', layout: 'matrix', eyebrow: 'Results  \u00b7  14 Sep 2026', title: 'The new version wins four of five tasks', maxWords: 70,
			columns: [{ label: 'Task', width: '1.6fr' }, { label: 'Baseline', width: '0.8fr' }, { label: 'New', width: '0.8fr' }, { label: 'Change', width: '0.8fr' }, { label: 'Runs', width: '0.6fr' }],
			rows: [
				['Summarise a meeting', { text: '71%', mono: true }, { text: '84%', mono: true }, { text: '+13 pts', ok: true }, { text: '400', mono: true }],
				['Draft an email reply', { text: '64%', mono: true }, { text: '73%', mono: true }, { text: '+9 pts', ok: true }, { text: '400', mono: true }],
				['Find a document', { text: '58%', mono: true }, { text: '66%', mono: true }, { text: '+8 pts', ok: true }, { text: '400', mono: true }],
				['Fill in a form', { text: '77%', mono: true }, { text: '81%', mono: true }, { text: '+4 pts', ok: true }, { text: '300', mono: true }],
				['Say when unsure', { text: '80%', mono: true }, { text: '79%', mono: true }, { text: '\u22121 pt', ok: false }, { text: '300', mono: true }],
				{ cells: ['All tasks', { text: '70%', mono: true }, { text: '77%', mono: true }, { text: '+7 pts', ok: true }, { text: '1,800', mono: true }], tone: 'blue' },
			],
			note: 'Pass rate per task. Change in percentage points against the baseline.',
			sources: ['Sample data, made up for this example'],
			notes: 'A results page stands alone: someone who only sees this page should get the claim, the unit, the sample size and the source.' },
	],
};
