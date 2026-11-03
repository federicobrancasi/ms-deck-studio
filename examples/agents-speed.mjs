// Example: an illustrated update on twelve small pull requests in microsoft/vscode (the Agents window, faster), set in
// one world (a workbench of tagged parts) with one recurring object (a job tag is one pull request: its number, a stamp
// for merged or open, and the day it merged). Ten slides, each drawn by a design in designs/gallery-workbench.mjs
// (gwb-*), with stills from the pull requests' public demo videos in assets/gallery-workbench/.
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Real work, public sources.
// Build: node src/build.mjs --deck agents-speed
const A = 'assets/gallery-workbench';
const pr = (n, label = '') => `microsoft/vscode #${n}${label ? ` ${label}` : ''} | https://github.com/microsoft/vscode/pull/${n}`;
const ALL_PRS = 'microsoft/vscode, 12 pull requests, Feb\u2013Oct 2026 | https://github.com/microsoft/vscode/pulls?q=author%3Afedericobrancasi';

// The twelve tags, grouped: side by side, attachments, polish, speed, terminal. Dates are the merge dates (UTC).
const GROUPS = [
	{ title: 'Side by side', icon: 'split', tags: [{ num: '#334962', date: '8 Sep' }, { num: '#335746', date: '11 Sep' }] },
	{ title: 'Attachments', icon: 'image', tags: [{ num: '#317776', date: '28 May' }, { num: '#317817', date: '1 Jun' }] },
	{ title: 'Polish', icon: 'wrench', tags: [{ num: '#335072', date: '8 Sep' }, { num: '#335741', date: '11 Sep' }, { num: '#341028', date: '12 Oct' }, { num: '#342084', date: '16 Oct' }] },
	{ title: 'Speed', icon: 'timer', tags: [{ num: '#336291', date: '15 Sep' }, { num: '#336462', date: '16 Sep' }, { num: '#336551', date: '17 Sep' }] },
	{ title: 'Terminal', icon: 'terminal', tags: [{ num: '#295983', date: 'Draft', state: 'open' }] },
];

export default {
	title: 'The Agents window, faster',
	file: 'agents-speed',
	ref: 'The Agents window, faster  \u00b7  November 2026  \u00b7  Federico Brancasi',
	wordBudget: 15,
	slides: [
		{ id: 'cover', layout: 'gwb-cover', eyebrow: 'VS Code  \u00b7  Agents window',
			title: 'The Agents window, faster',
			sub: 'Twelve small pull requests in VS Code: eleven merged, one open.',
			speaker: { initials: 'FB', name: 'Federico Brancasi', role: 'Microsoft  \u00b7  VS Code' },
			logo: 'vscode',
			src: `${A}/cover-fork.png`,
			groups: [{ n: 2 }, { n: 2 }, { n: 4 }, { n: 3 }, { n: 1, open: true }],
			nosrc: true,
			say: 'Twelve small changes: a quicker Agents window and three faster hot paths.',
			notes: 'Twelve small, focused pull requests in microsoft/vscode. Eleven merged between 28 May and 16 Oct 2026; one, the terminal change, is still an open draft (opened 18 Feb 2026). The monitor shows the real Agents window from the demo of #335746: a conversation and its fork, side by side. Each tag on the bench rail is one pull request: green tick merged, orange clock open.' },

		{ id: 'overview', layout: 'gwb-board', eyebrow: 'What changed',
			title: 'Twelve small changes, eleven already merged',
			counts: [
				{ value: '12', label: 'pull requests on GitHub', logo: 'github', tone: 'neutral' },
				{ value: '11', label: 'merged', tone: 'green' },
				{ value: '1', label: 'open', tone: 'orange' },
			],
			groups: GROUPS,
			sources: [ALL_PRS],
			say: 'Five groups: side by side, attachments, polish, speed, terminal.',
			notes: 'Each tag is one pull request: its number, a stamp, and the day it merged (28 May to 16 Oct 2026). Side by side and attachments are about using the Agents window: Alt-click on New and Fork, and sending files with no text. Polish is four small fixes in the sessions list, Customizations and the fork button. Speed is three measured hot paths: Quick Open, deepFreeze and URI formatting. Terminal ghost text (#295983) is still an open draft.' },

		{ id: 'beside', layout: 'gwb-beside', eyebrow: 'Side by side',
			title: 'Alt-click opens it beside, not instead',
			key: { top: '\u2325', bottom: 'alt' },
			rows: [
				{ button: { icon: 'add', text: 'New' },
					before: { src: `${A}/alt-new-before.png`, label: 'Before' },
					after: { src: `${A}/alt-new-after.png`, label: 'After', ring: [0.5, 0.03, 0.995, 0.97] },
					tag: { num: '#334962', date: '8 Sep' } },
				{ button: { icon: 'fork', text: 'Fork' },
					before: { src: `${A}/alt-fork-before.png`, label: 'Before' },
					after: { src: `${A}/alt-fork-after.png`, label: 'After', ring: [0.625, 0.05, 0.995, 0.99] },
					tag: { num: '#335746', date: '11 Sep' } },
			],
			clicks: [
				{ caption: 'Alt-click New: a new session opens beside', say: 'Alt-click New and the new session opens next to the one you are in.' },
				{ caption: 'Alt-click Fork: the fork opens beside its source', say: 'Same gesture on Fork: the fork opens beside the conversation it came from.' },
			],
			sources: [pr(334962), pr(335746)],
			notes: 'Alt-click (Option-click on macOS) on New in the Agents window opens the new session beside the current one, so you keep it in view (#334962). #335746 does the same for Fork Conversation at a checkpoint: the fork opens beside its source and takes focus. A plain click, the keyboard, /fork and the regular chat view are unchanged; no new buttons, commands or keybindings. Stills from the demo videos in the two pull requests, cropped to the chat panes.' },

		{ id: 'attach', layout: 'gwb-attach', eyebrow: 'Attachments in chat',
			title: 'Send files without typing a word',
			input: {
				chips: [{ icon: 'image', text: 'image1.webp' }, { icon: 'image', text: 'image2.jpeg' }, { icon: 'document', text: 'superSecretFile1.txt' }, { icon: 'document', text: 'superSecretFile2.md' }],
				placeholder: 'Describe what to build',
				tools: ['Agent', 'Auto'],
			},
			bubble: 'Attached 4 files',
			still: { src: `${A}/tiles.png`, label: 'Now, as tiles', ring: [0.53, 0.06, 0.993, 0.36] },
			tags: [{ num: '#317776', date: '28 May' }, { num: '#317817', date: '1 Jun' }],
			clicks: [
				{ caption: 'Files alone can be sent', say: 'Attach files, type nothing, press send: it goes.' },
				{ caption: 'The request shows them as tiles', say: 'And the transcript now shows them as tiles: thumbnails for images, name and type for files.' },
			],
			sources: [pr(317776), pr(317817)],
			notes: 'Before #317776, the send button stayed off until you typed something, even with files attached. Now explicit file, folder and image attachments are enough; hidden or automatic context still is not. #317776 showed the request as a summary line, "Attached 4 files", in both VS Code and the Agents window. Four days later #317817 replaced that line with tiles above the message: square thumbnails for images, a tile with the name and type for files. Chip names and the still are from the two PR demos.' },

		{ id: 'polish', layout: 'gwb-bench', eyebrow: 'Small polish fixes',
			title: 'Four small things now line up',
			cards: [
				{ label: 'Sessions list', kind: 'chevron', text: 'Pinned', value: 'Chevron matches the section', tag: { num: '#342084', date: '16 Oct' } },
				{ label: 'Customizations', kind: 'section', value: 'Click again: back to the list', tag: { num: '#341028', date: '12 Oct' } },
				{ label: 'Fork button', kind: 'glyph', value: '\u22121.999 \u2192 \u22120.003 px', nolint: true, tag: { num: '#335072', date: '8 Sep' } },
				{ label: 'Fork tooltip', kind: 'tooltip', value: 'Caret centred within 0.011 px', tag: { num: '#335741', date: '11 Sep' } },
			],
			sources: [pr(342084), pr(341028), pr(335072), pr(335741)],
			say: 'Four fixes you only notice when they are wrong.',
			notes: 'Sessions list (#342084): after a section header had stuck to the top while scrolling, collapsing it left the chevron pointing down; now every rendered copy of the header updates. Customizations (#341028): clicking the section you are already in now takes you back to its list from a detail page, in both windows. Fork button (#335072): the 12 px glyph sat left in a 16 px box; measured offset went from \u22121.999 px to \u22120.003 px. Fork tooltip (#335741): three causes fixed, and every pointer tooltip now centres within 0.011 px. The button drawings are magnified schematics.' },

		{ id: 'quick-open', layout: 'gwb-stopwatch', eyebrow: 'Speed  \u00b7  Quick Open',
			title: 'Quick Open answers about 20% sooner',
			watch: { max: 80, major: 10, label: 20, before: 53.2, after: 42.1, value: '42.1', unit: 'ms', from: 'median, was 53.2' },
			legend: { before: 'Before', after: 'After' },
			rows: [
				{ label: 'Median', before: 53.2, after: 42.1, change: '\u221220.9%', hi: true },
				{ label: 'Mean', before: 49.2, after: 39.8, change: '\u221219.1%' },
				{ label: 'p95', before: 70.4, after: 49.8, change: '\u221229.3%', hi: true },
			],
			scale: { max: 80, ticks: [0, 20, 40, 60, 80], unit: 'ms' },
			scope: 'Warm, local benchmark: 11,082 files, 256 samples a side.',
			job: { num: '#336291', date: '15 Sep' },
			sources: [pr(336291, 'benchmark, Apple M5 Max')],
			say: 'Typing in Cmd+P gets to results about a fifth sooner.',
			notes: 'Fuzzy scoring built temporary objects, sorted their keys and hashed them before every cache lookup, even on hits. #336291 computes the same numeric hash directly. Timed from the input event to two animation frames after the results are applied (not a display timestamp), warm, in real Electron Quick Open on an Apple M5 Max: median 53.2 to 42.1 ms, mean 49.2 to 39.8, p95 70.4 to 49.8. Same frozen workspace of 11,082 paths, 256 samples per variant, counterbalanced order. A controlled local measurement, not a claim that everything in VS Code is 20% faster.' },

		{ id: 'deepfreeze', layout: 'gwb-queue', eyebrow: 'Speed  \u00b7  deepFreeze',
			title: 'One cursor makes deepFreeze linear',
			rows: [
				{ label: 'Before  \u00b7  O(n\u00b2)', code: 'stack.shift()', mode: 'shift', crates: 9, value: '1.4', unit: 's', tone: 'red', sub: 'wide graph, 100,000 objects' },
				{ label: 'After  \u00b7  O(n)', code: 'stack[index]', mode: 'cursor', crates: 9, done: 4, marker: 'index', value: '10\u201311.2', unit: 'ms', tone: 'green', sub: 'wide graph, 100,000 objects' },
			],
			job: { num: '#336551', date: '17 Sep' },
			clicks: [
				{ caption: 'shift() moves every crate along, every time', say: 'shift() re-indexes the whole queue on every call.' },
				{ caption: 'An index walks along; nothing moves', say: 'An index cursor reads in place: linear, same order.' },
			],
			sources: [pr(336551, 'Node 24 benchmark')],
			notes: 'deepFreeze walks an object graph with a worklist and drained it with Array.shift(), which re-indexes the array on every call, so a wide graph took quadratic time. #336551 reads the worklist with an index instead and clears each slot, so it stays linear and keeps the exact traversal order (pop() would reverse it, and getters make order observable). Node 24, a wide graph of 100,000 sibling objects: 1.4 s before (the slower of two runs), 10 to 11.2 ms after; the PR reports 64 to 137 times faster across the two runs. Below about 1,000 objects it is within noise, and the PR makes no claim about startup.' },

		{ id: 'uri', layout: 'gwb-tape', eyebrow: 'Speed  \u00b7  URIs',
			title: 'URIs become strings in about half the time',
			text: '/src/C#/main.cs', hit: 6, escaped: '%23',
			rows: ['Before  \u00b7  every character', 'After  \u00b7  find, then copy'],
			hop: 'one step per character', jump: 'find #', copied: 'copied whole', fast: 'two copies, one escape',
			result: { value: '166', unit: 'ns', from: 'per operation,\nwas 346 ns (Electron)', pill: '\u221252.2%', other: 'Node.js: 394 \u2192 230 ns' },
			scope: 'Component benchmark, VS Code URI corpus.',
			job: { num: '#336462', date: '16 Sep' },
			sources: [pr(336462, 'benchmark, 105,025 entries, Apple M3 Pro')],
			say: 'In Electron, turning a URI into a string takes about half the time.',
			notes: 'Minimal URI encoding scanned every character in JavaScript, even when nothing needed escaping, and appended characters one at a time after a delimiter. #336462 uses native string search to find the first ? or #, returns components without delimiters unchanged, and copies the safe runs as substrings. The path on the slide is an example: the # inside it becomes %23. On VS Code\u2019s URI corpus (105,025 entries), Apple M3 Pro: 346 to 166 ns per operation in Electron (\u221252.2%), 394 to 230 ns in Node.js (\u221241.8%). A component benchmark, not startup or renderer latency.' },

		{ id: 'terminal', layout: 'gwb-terminal', eyebrow: 'Terminal  \u00b7  Open draft',
			title: 'A draft adds typo fixes as ghost text',
			tag: { text: 'Open  \u00b7  draft', tone: 'orange', icon: 'clock' },
			window: 'Terminal', prompt: 'PS>',
			lines: [
				{ cmd: 'git statys' },
				{ out: "git: 'statys' is not a git command." },
				{ ghost: 'git status', kind: 'builtin' },
				{ cmd: 'mkdor hello' },
				{ out: "mkdor: The term 'mkdor' is not recognized\u2026" },
				{ ghost: 'mkdir hello', kind: 'ai' },
			],
			legend: { builtin: { text: 'Built-in fix', icon: 'wrench' }, ai: { text: 'Copilot fix', logo: 'githubcopilot' } },
			keys: { caps: ['Tab'] },
			job: { num: '#295983', date: 'Draft', state: 'open' },
			sources: [pr(295983, '(open, draft)')],
			say: 'Still a draft: the fix appears as ghost text, Tab accepts it.',
			notes: 'Open draft #295983, since 18 Feb 2026, not merged. When a command fails, the terminal shows the correction as dim ghost text at the next prompt; Tab or the right arrow accepts it. Built-in quick fixes come first (git statys to git status); when there is none, it asks Copilot (mkdor hello to mkdir hello, ld -la to ls -la). The slide replays the PR demo, in PowerShell. Two new settings turn ghost text and auto-fill on. Known gaps in the PR: shell aliases and history are not used yet, PowerShell suggestions are not shell-aware, and debug logging still has to come out.' },

		{ id: 'close', layout: 'gwb-close', bg: 'blue', eyebrow: 'In short',
			title: 'Small, focused changes add up',
			sub: 'Eleven merged into VS Code, one still an open draft.',
			speaker: { initials: 'FB', name: 'Federico Brancasi', role: 'Microsoft  \u00b7  VS Code' },
			merged: { count: 11, top: { num: '#342084', date: '16 Oct' }, label: 'merged' },
			open: { num: '#295983', date: 'Draft', label: 'open', count: 1 },
			sources: [ALL_PRS],
			say: 'Small, focused, measured. Questions?',
			notes: 'Each pull request does one thing: a gesture, a missing case, a misaligned pixel, a hot path. Eleven are merged between 28 May and 16 Oct 2026; the terminal ghost text (#295983) is still an open draft. Ask the room which of the merged ones they have already noticed, and which rough edge they would fix next.' },
	],
};
