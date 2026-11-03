// A new deck: copy this file to decks/<name>.mjs (decks/ is not committed), then: node src/build.mjs --deck <name>
// Fields of every layout: docs/layouts.md. The rules: docs/principles.md. Start from an example in examples/ if one fits.
export default {
	title: 'Deck title',
	ref: 'Deck name  \u00b7  context  \u00b7  1 Dec 2026', // the header line on every slide
	// divider: 'divider-signpost', // draw every section divider with this design
	// showTiers: true,             // long talks: show Core / Optional / Cut first on every slide (tier: 'C' | 'N' | 'X')
	slides: [
		{ id: 'cover', layout: 'title', eyebrow: 'Context', title: 'The claim of the talk', sub: 'One line that frames it.',
			speaker: { initials: 'AB', name: 'Your Name', role: 'Microsoft  \u00b7  December 2026' },
			notes: 'Who you are in one sentence, and why this matters to them.' },
		{ id: 'point', layout: 'statement', eyebrow: 'The point', text: 'One sentence, with {{blue|the words that matter}} marked.',
			notes: 'Speaker notes: what to say, what to ask, any caveat.' },
		{ id: 'close', layout: 'close', text: 'The line to {{blue|remember}}.', speaker: { initials: 'AB', name: 'Your Name' },
			notes: 'End here.' },
	],
};
