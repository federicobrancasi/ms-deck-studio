// Example: an illustrated study, set in one world (a tailor's rack) with one recurring object (a jacket on a hanger is
// a model, cut to four sizes, with a price tag). Contoso's support assistant picks, for each request, the cheapest
// model whose skills cover what the request needs: a request is a customer with four measurements, and the cheapest
// jacket that fits every one wins. Ten slides, each drawn by a design in designs/gallery-tailor.mjs (gtl-*).
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every name and number here is made up.
// Build: node src/build.mjs --deck fitting-room
const SAMPLE = 'Sample data, made up for this example';
const SPEAKER = { initials: 'FB', name: 'Federico Brancasi', role: 'Microsoft' };
const SKILLS = ['Reasoning', 'Writing', 'Math', 'Tool use'];
const REQUEST = 'Refund three orders and explain why';
const NEED = [0.7, 0.55, 0.4, 0.8];

export default {
	title: 'The cheapest model that fits each request',
	file: 'fitting-room',
	ref: 'Contoso support  \u00b7  Model fitting study  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [
		{ id: 'cover', layout: 'gtl-cover-rail', eyebrow: 'Contoso support  \u00b7  Study',
			title: 'The cheapest model that fits each request',
			sub: 'How the assistant picks a model, and what it saved.',
			pills: [{ text: 'Sample data', tone: 'orange', icon: 'beaker' }],
			request: REQUEST, requestLabel: 'The request', needs: SKILLS, need: NEED,
			jackets: [{ price: '$' }, { price: '$$' }, { price: '$$$' }, { price: '$$$$' }], pick: 2, fits: 'Fits', small: 'Too small',
			rail: { from: 'Cheapest', to: 'Dearest' },
			notes: 'A short study of how Contoso\u2019s support assistant chooses a model. Every request is a customer with four measurements, one per skill it needs; every model is a jacket cut to four sizes, with a price tag. The assistant tries the jackets from the cheapest up and takes the first that fits. As on slide 4, the two cheapest jackets are too small for this request and the third fits. All numbers in this deck are sample data.',
			sources: [SAMPLE],
			say: 'Every request is a customer; we find the cheapest jacket that fits.' },

		{ id: 'old', layout: 'gtl-two-sizes', eyebrow: 'Where we started', title: 'The old router knew only big or small',
			before: { label: 'Old router  \u00b7  2025', text: 'One score:\nbig or small' },
			need: 0.6,
			pool: { label: 'Model pool  \u00b7  8 models', text: 'It uses two of the eight' },
			models: [
				{ name: 'Wren S', icon: 'cube' },
				{ name: 'Wren M', icon: 'cube' },
				{ name: 'Kite S', icon: 'cube', on: true, role: 'Small' },
				{ name: 'Kite M', icon: 'cube' },
				{ name: 'Kite L', icon: 'cube' },
				{ name: 'Heron M', icon: 'cube' },
				{ name: 'Heron L', icon: 'cube', on: true, role: 'Big', big: true },
				{ name: 'Heron XL', icon: 'cube' },
			],
			stamp: 'New model? Retrain.',
			sources: [SAMPLE],
			notes: 'The old router gave each request one score and sent it to a small model or a big one, so six of the eight models in the pool never got any traffic. Every time a model was added or re-priced, it had to be retrained. The jacket sizes are drawn, not measured.',
			say: 'One score, two models, and a retrain for every change.' },

		{ id: 'measure', layout: 'gtl-measure', eyebrow: 'How it works  \u00b7  1', title: 'First, measure what the request needs',
			request: REQUEST,
			reader: { name: 'Skill reader', sub: 'a small text model' },
			slip: 'Its four measurements', needs: SKILLS, need: NEED,
			chip: { icon: 'timer', text: '40 ms' },
			clicks: [
				{ caption: 'Measured by a small model', say: 'A small model reads the request, before any big model runs.' },
				{ caption: 'Out come four needs', say: 'It gives four scores, one per skill: the request\u2019s measurements.' },
			],
			sources: [SAMPLE],
			notes: 'Step one looks only at the request. A small text model reads it and scores four skills from 0 to 1: how much reasoning, writing, math and tool use it needs. For this refund request that is .7, .55, .4 and .8. It takes about 40 ms.',
			say: 'Step one: measure the request, never the models.' },

		{ id: 'fit', layout: 'gtl-try-on', eyebrow: 'How it works  \u00b7  2', title: 'The cheapest model that fits every need wins',
			order: 'Cheapest first', needs: SKILLS, need: NEED, shortLabel: 'Shortfall',
			jackets: [
				{ name: 'Wren S', price: '$0.002', size: [0.5, 0.6, 0.45, 0.6], shortfall: '0.40', verdict: 'Too small' },
				{ name: 'Kite M', price: '$0.004', size: [0.75, 0.6, 0.5, 0.72], shortfall: '0.08', verdict: 'Too small' },
				{ name: 'Heron L', price: '$0.012', size: [0.85, 0.7, 0.6, 0.9], shortfall: '0.00', verdict: 'Fits' },
			],
			clicks: [
				{ caption: 'Wren S: short by 0.40', say: 'The cheapest jacket first: too small on reasoning and tool use.' },
				{ caption: 'Kite M: short by 0.08', say: 'Closer, but still short on tool use.' },
				{ caption: 'Heron L fits every need, so it wins', say: 'The first jacket within the threshold wins: here Heron L.' },
			],
			sources: [SAMPLE],
			notes: 'Step two is a plain rule. Each model has four sizes and a price in a config file. For each model we add up how far it falls short of each need; a roomy fit on one skill never makes up for a tight one on another. The cheapest model whose shortfall is within a small threshold wins. An easier request would stop at Wren S.',
			say: 'Cheapest first; the first jacket that fits wins.' },

		{ id: 'catalog', layout: 'gtl-rails', eyebrow: 'The model list', title: 'New models join with a config edit',
			file: 'models.yaml',
			added: { label: 'Added', count: 4 }, removed: { label: 'Removed', count: 2 },
			counter: { value: '0', label: 'retraining runs', sub: 'over three months' },
			note: { icon: 'checkCircle', text: 'A new model gets traffic on day one' },
			sources: [SAMPLE],
			notes: 'Because the reader only measures requests, the models live in a config file. In three months the team added four models and removed two, and none of it needed retraining: a new model is one entry with its four sizes and its price.',
			say: 'Four in, two out, nothing retrained.' },

		{ id: 'cost', layout: 'gtl-coins', eyebrow: 'Results  \u00b7  1,000 tickets', title: 'Same quality for under half the cost',
			heads: { cost: 'Cost  \u00b7  each stack is 10% of always-Heron XL', saved: 'Saved', quality: 'Quality' },
			rows: [
				{ name: 'Always Heron XL', icon: 'cube', sub: 'the biggest model', cost: 100, saved: '0%', quality: '90.2' },
				{ name: 'Old router', sub: 'big or small', cost: 88, saved: '12%', quality: '89.5' },
				{ name: 'Fitting', sub: 'the cheapest that fits', cost: 48, saved: '52%', quality: '89.9', hi: true },
			],
			sources: [SAMPLE],
			notes: 'On 1,000 past tickets with known good answers, always using the biggest model scores 90.2. The fitting rule scores 89.9 and spends 52% less; the old router saved 12%. The threshold is a dial: loosen it and it saves more for a little quality.',
			say: 'Same quality as the biggest model, for less than half the cost.' },

		{ id: 'languages', layout: 'gtl-languages', eyebrow: 'Across languages', title: 'Steady across twelve languages',
			axis: { from: 85, to: 91, label: 'Quality (%)' },
			band: { from: 87.6, to: 88.3, label: '0.7-point spread' },
			legend: { a: 'Fitting', b: 'Always Heron XL' },
			rows: [
				{ name: 'English', glyph: 'Aa', n: '600 tickets', a: 88.3, b: 90.4 },
				{ name: 'European', glyph: '\u00c9', n: 'fr de es it  \u00b7  240', a: 87.9, b: 89.1 },
				{ name: 'East Asian', glyph: '\u5b57', n: 'zh ja ko  \u00b7  90', a: 87.6, b: 90.0 },
				{ name: 'Other', glyph: '\u042f', n: 'ru ar tr vi  \u00b7  70', a: 88.0, b: 88.9 },
			],
			sources: [SAMPLE],
			notes: 'Customers write in twelve languages. The fitting rule keeps quality between 87.6 and 88.3 in all four groups, a 0.7-point spread, so the language a customer writes in doesn\u2019t change which jacket they get. The smaller groups have fewer tickets, so read them with care.',
			say: 'Same fit whatever language the customer writes in.' },

		{ id: 'test', layout: 'gtl-flight', eyebrow: 'A/B test', title: 'A two-week test: faster, fewer errors',
			arms: [{ name: 'Control  \u00b7  old router', users: '12K' }, { name: 'Fitting', users: '12K' }],
			users: 'users',
			when: '14 days  \u00b7  2\u201315 Sep 2026  \u00b7  support chat',
			head: 'Change with fitting  \u00b7  green is better',
			rows: [
				{ label: 'Replies with an error', value: 14.0, text: '\u221214.0%', hi: true },
				{ label: 'Time to answer (p50)', value: 5.2, text: '\u22125.2%' },
				{ label: 'Time to first word (p50)', value: 3.9, text: '\u22123.9%' },
				{ label: 'Cost per request', value: 3.1, text: '\u22123.1%' },
				{ label: 'Chats per user', value: 1.4, text: '+1.4%' },
				{ label: 'Cost per user per day', value: 0.5, text: '+0.5%', flat: true, note: 'not significant' },
			],
			caveat: { icon: 'info', text: 'Thumbs-down +3%: mostly the assistant\u2019s edits, not the pick' },
			sources: [SAMPLE],
			notes: 'For two weeks, half of the support chat users got the fitting rule and half kept the old router, about 12K users each. Errors fell 14%, answers came 5.2% faster, and people chatted a little more. Cost per request fell 3.1%, but with more chats the cost per user per day stayed flat. Thumbs-down rose 3%; most of them were about the assistant\u2019s edits, not the model it picked.',
			say: 'Faster, fewer errors, and people used it more.' },

		{ id: 'live', layout: 'gtl-traffic', eyebrow: 'In production', title: 'Live for every Contoso support chat',
			source: { icon: 'chatMultiple', name: 'Support chat', sub: 'Contoso', value: '410K', unit: 'requests a week' },
			node: { name: 'Fitting', sub: '60 ms median' },
			models: [
				{ name: 'Heron L', icon: 'cube', share: 28.0 },
				{ name: 'Kite S', icon: 'cube', share: 24.5, hi: true },
				{ name: 'Wren S', icon: 'cube', share: 19.5, hi: true },
				{ name: 'Kite M', icon: 'cube', share: 11.0 },
				{ name: 'Wren M', icon: 'cube', share: 7.0 },
				{ name: 'Kite L', icon: 'cube', share: 5.0 },
				{ name: 'Heron M', icon: 'cube', share: 3.0 },
				{ name: 'Heron XL', icon: 'cube', share: 2.0 },
			],
			total: { value: '44%', label: 'the two cheapest' },
			clicks: [
				{ caption: '410K requests a week', say: 'Every new support chat is fitted, in 60 ms.' },
				{ caption: 'Each model gets a share', say: 'Band width is each model\u2019s share of the week\u2019s requests.' },
				{ caption: 'The two cheapest: 44%', say: 'The two cheapest models take 44% of the requests.' },
			],
			sources: [SAMPLE],
			notes: 'The fitting rule now picks the model for every new Contoso support chat: 410K requests a week, 60 ms at the median. The two cheapest models take 44% of them; the biggest, Heron XL, only 2%. To keep each model\u2019s cache warm, a chat keeps its model until it is summarized.',
			say: 'It is live, and 44% of requests go to the two cheapest models.' },

		{ id: 'next', layout: 'gtl-sewing', bg: 'blue', eyebrow: 'What comes next', title: 'Next: images, agents and long chats',
			board: 'Next on the bench',
			next: [
				{ icon: 'image', title: 'Images', sub: 'a fifth need: vision' },
				{ icon: 'bot', title: 'Agents', sub: 'needs per agent' },
				{ icon: 'chatMultiple', title: 'Long chats', sub: 're-fit mid-chat' },
			],
			nosrc: true,
			notes: 'Three things come next. Images: a fifth measurement for vision, so pictures go to models that can see them. Agents: measure each step of a multi-step task, not just the first message. Long chats: re-fit when a conversation gets harder, weighed against losing the cache.',
			say: 'Next on the bench: images, agents and long chats.' },
	],
};
