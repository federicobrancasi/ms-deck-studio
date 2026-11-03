// Example: an illustrated update about three open pull requests in microsoft/vscode that give Copilot chat a voice and
// a pen: read answers aloud (#331859), a built-in Generate Image tool (#335735), and teaching the VS Code pet new moves
// and reactions from chat (#338664). All three are open drafts, and the deck says so on every slide about them. The
// world is the chat window drawn big; the recurring object is the answer card with its toolbar. Ten slides, each drawn
// by a design in designs/gallery-chatmedia.mjs (gcm-*); the pictures are frames from the PRs' public demo videos
// (assets/gallery-chatmedia/). The gallery is inspiration: a new deck invents its own world and draws its own pictures
// (docs/illustrating.md).
// Real work, public sources.
// Build: node src/build.mjs --deck chat-media
const GH = 'https://github.com/microsoft/vscode/pull';
const SRC = {
	ra: `microsoft/vscode#331859, Read chat responses aloud | ${GH}/331859`,
	img: `microsoft/vscode#335735, chat: add Microsoft MAI image generation | ${GH}/335735`,
	pet: `microsoft/vscode#338664, pet: teach the VS Code pet new moves | ${GH}/338664`,
};
const A = 'assets/gallery-chatmedia/';
// The product's words and pictures, read by every drawing (designs/gallery-chatmedia.mjs).
const UI = { assistant: 'Copilot', placeholder: 'Chat with Copilot', slash: '/pet', picture: `${A}dog.png`, pictureSize: [1134, 774], pet: `${A}pet-idle.png`, reaction: `${A}grr.png`, reactionSize: [290, 340] };
const SPEAKER = { initials: 'FB', name: 'Federico Brancasi', role: 'VS Code team  \u00b7  Nov 2026' };
const DRAFT = { text: 'Draft PR', tone: 'orange', icon: 'pr' };
const DRAFT_PROTO = { text: 'Draft PR, prototype', tone: 'orange', icon: 'beaker' };

export const cover = {
	id: 'cover', layout: 'gcm-cover', ui: UI, eyebrow: 'Three open PRs',
	title: 'Copilot chat gets a voice and a pen',
	sub: 'Read answers aloud, generate images, teach the pet new moves.',
	speaker: SPEAKER,
	pills: [{ text: '3 open draft PRs', tone: 'orange', icon: 'pr' }, { text: 'microsoft/vscode', tone: 'neutral', icon: 'git' }],
	say: 'Three open PRs give chat a voice and a pen.',
	notes: 'Three pull requests of mine in microsoft/vscode, all still open as drafts: one reads chat answers aloud, one adds a Generate Image tool to Agent chat and the Agents window, and one lets you describe a move and the agent draws it for the VS Code pet. The picture is the chat panel: the speaker button under an answer is lit and its sound goes out, a pen is finishing the picture in the answer (a real image from the demo), and the pet sits on the chat input as it does in the product. The point I want you to leave with: each one is designed to add as little UI as possible.',
	sources: [SRC.ra, SRC.img, SRC.pet],
};

export const three = {
	id: 'three', layout: 'gcm-three', ui: UI, eyebrow: 'At a glance',
	title: 'Three open PRs, one main way in each',
	slash: '/pet', ask: 'an ANGRY move\u2026', prTag: 'Draft PR',
	prs: [
		{ name: 'Read aloud', ref: '#331859', size: '+1,914 lines', way: 'The speaker button', wayIcon: 'speaker' },
		{ name: 'Generate Image', ref: '#335735', size: '+3,339 lines', way: 'A tool the model calls', wayIcon: 'image' },
		{ name: 'Teach the pet', ref: '#338664', size: '+4,504 lines', way: 'The /pet command', wayIcon: 'chat' },
	],
	say: 'One button, one tool, one slash command.',
	notes: 'Here is the whole talk on one page. One: a speaker button on any chat answer reads it aloud. Two: a Generate Image tool the model calls in Agent chat, so the picture lands inside the answer, in the preview chat already has. Three: /pet in the Agents window, where you describe a move and the agent draws it for the pet. Each also has a little around it: a setup command for the first two (and a remove command for the image credentials), and /pet-play plus a Taught Moves menu for the pet. All three are open drafts; the sizes are the PRs\u2019 added lines (26, 48 and 35 files changed).',
	sources: [SRC.ra, SRC.img, SRC.pet],
};

export const readShot = {
	id: 'read-shot', layout: 'gcm-screen', ui: UI, eyebrow: 'Read aloud  \u00b7  #331859', tag: DRAFT,
	title: 'One click reads the answer aloud',
	device: 'strip', src: `${A}read-aloud-strip.png`, size: [2132, 590], ring: [34, 485, 88, 88],
	points: [{ title: 'Reads the answer, not the steps' }, { title: 'No key? The platform voice reads it' }],
	say: 'The speaker button, on any answer.',
	notes: 'This is a frame from the demo video in the PR: the end of a story in chat, and the speaker button in the answer\u2019s toolbar, ringed. One click reads the answer: the answer itself, not the narration of the steps the agent took. With nothing configured it falls back to the platform\u2019s own speech synthesizer, so it works with no setup; with an endpoint and key set up (the Speech: Set Up Read Aloud command) it uses the MAI voice through Azure Speech, and the switch happens without a reload. The PR was verified end to end in Code OSS, with 198 targeted tests and 5,475 across the wider chat, markdown, speech and accessibility sweep.',
	sources: [SRC.ra],
};

export const pipe = {
	id: 'pipe', layout: 'gcm-pipe', ui: UI, eyebrow: 'How read aloud works', tag: DRAFT,
	title: 'A short first piece starts the sound fast',
	stations: [{ title: 'Answer only' }, { title: 'Clean it' }, { title: 'Cut, short first' }, { title: 'Play while fetching' }],
	lanes: ['Fetch', 'Play'], rate: '24 kHz', start: 'Sound starts',
	clicks: [
		{ caption: 'Answer only', say: 'It reads the answer, not the step narration.' },
		{ caption: 'Clean it', say: 'Emoji and markdown go; pauses go between blocks.' },
		{ caption: 'Cut, short first', say: 'The first piece is short, so sound starts fast.' },
		{ caption: 'Play while fetching', say: 'Each piece plays while the next one is fetched.' },
	],
	say: 'Short first piece, then play while the next one loads.',
	notes: 'How it works, straight from the PR. It takes the response text: the answer, not the step narration. It cleans it up: strips emoji and markdown, and punctuates so it pauses between blocks (code blocks are separated from the text that follows). It splits the text into pieces, the first one short so the sound starts fast. Each piece goes to the speech service as SSML, and plays at 24 kHz while the next piece is already being fetched. After the review, the platform voice speaks the same pieces one after the other, because one long utterance can stall in Chromium.',
	sources: [SRC.ra],
};

export const plug = {
	id: 'plug', layout: 'gcm-plug', ui: UI, eyebrow: 'What read aloud needs', tag: DRAFT,
	title: 'When the endpoint lands, one file changes',
	engine: 'Read-aloud engine', ask: '{ endpoint, credential }',
	file: 'maiSpeechCredentials.ts', fileSub: 'The only file that changes',
	today: { label: 'Today', text: 'Your endpoint and key' },
	next: { label: 'Next', text: 'Product endpoint, your sign-in' },
	note: { icon: 'warning', text: 'Release blocker: endpoint and sign-in.' },
	say: 'It waits on a product endpoint; then one file changes.',
	notes: 'This is why it is a draft. There is no product endpoint for verbatim speech yet: the voice backend VS Code already talks to runs text through a narrator first, so it would rewrite the answer instead of reading it. So today the PR calls the Azure Speech endpoint directly, with the endpoint as a setting and the key in secret storage, both entered by you. A verbatim endpoint looks feasible. When it lands, only maiSpeechCredentials.ts changes: the endpoint moves to product.json and the key becomes the identity you already signed in with. The engine only ever asks for an endpoint and a credential. In the review, product authentication and service ownership (a product-owned endpoint and the signed-in identity) were called the release blocker. The other review findings are addressed: long answers on the platform voice now play in pieces, a stale key after an endpoint change is fixed, and the web mismatch was resolved by making read aloud desktop-only. One automated-review suggestion (a context key used as state) was left open on purpose, with the reason in the thread.',
	sources: [SRC.ra],
};

export const imageShot = {
	id: 'image-shot', layout: 'gcm-screen', ui: UI, eyebrow: 'Generate Image  \u00b7  #335735', tag: DRAFT_PROTO,
	title: 'A chat tool draws the image you ask for',
	device: 'laptop', src: `${A}image-chat-1610.png`, size: [3022, 1889], ring: [416, 672, 1168, 756],
	points: [{ title: 'MAI-Image-2.6, 1024\u00d71024' }, { title: 'Existing preview and Save' }, { title: 'Your endpoint, your bill' }],
	say: 'You ask, the model calls the tool, the picture lands in chat.',
	notes: 'A frame from the PR\u2019s demo, in the Agents window: the ask was \u201cUse the Generate Image tool to create a 1024\u00d71024 image of a purple dog\u201d, and the picture lands in the answer. The model in chat calls a built-in Generate Image tool, which calls a Microsoft MAI image deployment you set up with Chat: Set Up Image Generation (endpoint, deployment name and API key, the key in secret storage). The PR\u2019s live check (in its validation list, not the demo) used MAI-Image-2.6 and got a 1024\u00d71024 PNG back. Note that this does not turn on native image generation in the chat model: the model calls a tool. It reuses chat\u2019s existing image preview, carousel and Save. It is a bring-your-own-endpoint prototype: usage is charged to your Azure resource, not to Copilot.',
	sources: [SRC.img],
};

export const fork = {
	id: 'fork', layout: 'gcm-fork', ui: UI, eyebrow: 'How Generate Image works', tag: DRAFT_PROTO,
	title: 'The model gets text, you get the picture',
	model: 'The model', tool: 'Generate Image', deploy: 'Your MAI deployment', result: 'Text result', you: 'To you: the picture', back: 'To the model: text only',
	guards: ['Never overwrites a file', 'Caps the response size', 'No automatic retry'],
	say: 'Pixels to you, words to the model.',
	notes: 'The tool splits the result. You get the picture, in the preview chat already has, with Save, and optionally as a new PNG in the project or the session\u2019s worktree; previews survive reloading the conversation. The model only gets text back, not the image bytes. Three guards: files are created exclusively, so nothing is overwritten at the actual disk write; the fetch has an opt-in limit on the response size; and a failed or cancelled call is not repeated automatically, because each one may be billed. The tool only registers when it is configured and AI features are on. Tests: 885 targeted unit tests and 80 integration tests.',
	sources: [SRC.img],
};

export const teach = {
	id: 'teach', layout: 'gcm-teach', ui: UI, eyebrow: 'Teach the pet  \u00b7  #338664', tag: DRAFT,
	title: 'Describe a move, and the agent draws it',
	slash: '/pet', ask: 'an ANGRY move: it gets furious and turns red\u2026',
	tools: [{ name: 'petGuide', text: 'poses and art style' }, { name: 'teachPet', text: 'preview, then save' }],
	frames: [`${A}angry-004.png`, `${A}angry-005.png`, `${A}angry-006.png`, `${A}angry-007.png`, `${A}angry-008.png`, `${A}angry-010.png`, `${A}angry-011.png`, `${A}angry-012.png`],
	strip: 'What the pet played, from the demo',
	limitsLabel: 'Every move, at most', limits: [{ value: '24\u00d724', unit: 'pixels' }, { value: '16', unit: 'frames' }, { value: '5 s', unit: 'long' }],
	more: { label: 'Four more, one line each', items: [{ src: `${A}move-frozen.png`, name: 'frozen' }, { src: `${A}move-sleepy.png`, name: 'sleepy' }, { src: `${A}move-yay.png`, name: 'yay' }, { src: `${A}move-pizza.png`, name: 'pizza' }] },
	say: 'One sentence, and the pet learns a move.',
	notes: 'In the Agents window you type /pet and describe a move. The agent uses two tools: petGuide gives it the pet\u2019s poses, its art style and what it knows; teachPet previews every frame and then saves. Moves are drawn in layers: the pet\u2019s real poses and expressions, props, and shaded pixel text. The strip is the ANGRY move from the demo: eight selected frames, cropped from the video exactly as VS Code drew it. As the request asked, it turns red, steam puffs from its antennae, then it cools down back to normal. Agent input is untrusted, so a move is validated whole and nothing is saved until it is valid: at most 24\u00d724 pixels, 16 frames and 5 seconds. On the right, four more moves from the second demo video, each from a one-line request: FROZEN, SLEEPY, YAY and PIZZA. /pet-play plays a move right away without the agent, and Taught Moves in the pet\u2019s menu lists them.',
	sources: [SRC.pet],
};

export const react = {
	id: 'react', layout: 'gcm-react', ui: UI, eyebrow: 'Teach the pet  \u00b7  Reactions', tag: DRAFT,
	title: 'The pet reacts before the agent answers',
	panels: [{ title: 'Teach once' }, { title: 'Say the word' }, { title: 'It reacts first' }],
	teach: 'whenever I say bugs or broken, play ANGRY', taught: 'Taught the pet',
	message: 'Check the vscode repo it\u2019s full of {{orange|bugs}}!!!!!', local: 'Matched locally', thinking: 'Analyzing',
	clicks: [
		{ caption: 'Teach it', say: 'You tell the pet when to play a move.' },
		{ caption: 'Send it', say: 'Later you send a message that has the word.' },
		{ caption: 'GRR!', say: 'The pet plays ANGRY while the agent is still analyzing.' },
	],
	say: 'Matching runs locally, so the pet reacts first.',
	notes: 'Reactions tell the pet when to play a move. In the demo: /pet whenever I say bugs or broken, play ANGRY. The agent saved it and, as the demo video shows, added a few similar phrases such as \u201cit\u2019s broken\u201d and \u201cdoesn\u2019t work\u201d. Then: \u201cCheck the vscode repo it\u2019s full of bugs!!!!!\u201d. The third panel is a real frame from the demo video: the pet shouts GRR! while the agent is still analyzing the message (the label Analyzing is from the same frame), because matching runs locally as the message is sent. Moves and reactions are stored per user, so both windows share them; the pet announces what it plays, and reduced motion shows a still frame. Known limits in the PR: two windows saving at the same moment can overwrite each other, and the preview shows only the right-facing pet.',
	sources: [SRC.pet],
};

export const close = {
	id: 'close', layout: 'gcm-close', ui: UI, bg: 'blue', eyebrow: 'What is next',
	title: 'All three are open: what each still needs',
	branches: [
		{ icon: 'speaker', name: 'Read aloud', ref: '#331859', waits: 'Product endpoint, sign-in' },
		{ icon: 'image', name: 'Generate Image', ref: '#335735', waits: 'Team review' },
		{ pet: true, name: 'Teach the pet', ref: '#338664', waits: 'Team review' },
	],
	main: 'main', waitsLabel: 'Still needs', line: 'Three features, little new UI.',
	say: 'Three features, as little new UI as possible. All still open.',
	notes: 'To be clear: none of this is merged; all three are open draft PRs. Read aloud needs a product-owned endpoint for verbatim speech and your existing sign-in; the reviewer asked to be told when the endpoint lands so it can merge. Generate Image needs a review from the team first, and it is a bring-your-own-endpoint prototype: the PR says a dedicated product endpoint, integrated authentication and product billing or entitlement decisions are not included, and it has only had the automated Copilot review so far. Teach the pet has also only had the automated Copilot review, with three of its suggestions still open, so it needs a first review from the team. The closing line is the design goal of all three: each reuses what chat already has (the answer toolbar, the image preview and Save, the chat input and slash commands) and adds as little new UI as it can. If you want to try them, each PR description has the steps. Thanks.',
	sources: [SRC.ra, SRC.img, SRC.pet],
};

export default {
	title: 'Chat that talks and draws',
	file: 'chat-media',
	ref: 'Chat that talks and draws  \u00b7  VS Code team  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [cover, three, readShot, pipe, plug, imageShot, fork, teach, react, close],
};
