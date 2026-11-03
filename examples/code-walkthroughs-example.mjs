// Example: an illustrated demo talk about real, public work, set in one world (a newsroom with a press) with one
// recurring object (the front page: a picture on top, one story per intent below). Code walkthroughs in the VS Code
// Agents window, by Federico Brancasi and Ladislau Szomoru: one prompt turns a pull request into a narrated video or a
// slide deck, with its code grouped by intent in cards right below. Ten slides, each drawn by a design in
// designs/gallery-walkthrough.mjs (gw-*). The numbers come from public sources: microsoft/vscode#341872 (the pull
// request it explains), microsoft/vscode-team-kit#39 (the pr-studio plugin) and the fbrancasi/chat-media-preview branch
// of microsoft/vscode; the five intent cards come from a run in the Agents window on #341872, filmed in the video attached to #39. The deck pages in
// assets/gallery-walkthrough/ are the ones pr-studio made for #341872, attached to #39.
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Build: node src/build.mjs --deck code-walkthroughs-example
const PR = 'microsoft/vscode#341872 | https://github.com/microsoft/vscode/pull/341872';
const KIT = 'microsoft/vscode-team-kit#39 | https://github.com/microsoft/vscode-team-kit/pull/39';
const BRANCH = 'fbrancasi/chat-media-preview | https://github.com/microsoft/vscode/compare/main...fbrancasi/chat-media-preview';
const MEDIA_COMMIT = 'Commit ef4c220e | https://github.com/microsoft/vscode/commit/ef4c220e';
const RUN = 'Run on #341872, filmed in team-kit#39 | https://github.com/microsoft/vscode-team-kit/pull/39';
const LAD_COMMIT = 'Commit afe0e298 | https://github.com/microsoft/vscode/commit/afe0e298';

/** The 20 files of microsoft/vscode#341872 in path order, with the lines each adds, and the intent (1–5) that owns
 * them. The owners are reconstructed from the five card totals of the Agents window run, which add up exactly to the
 * PR (+1,678 −18); multiDiffEditor.contribution.ts gives one line to intent 5 (`more: true` marks that second piece). */
export const PIECES = [
	{ file: 'multiDiffEditorWidget.ts', add: 10, g: 1 },
	{ file: 'multiDiffEditorWidgetImpl.ts', add: 12, g: 1 },
	{ file: 'multiDiffEditorWidget.test.ts', add: 60, g: 1 },
	{ file: 'accessibleView.ts', add: 1, g: 5 },
	{ file: 'accessibilityConfiguration.ts', add: 5, g: 5 },
	{ file: 'padding.css', add: 4, g: 3 },
	{ file: 'modernUI.contribution.test.ts', add: 40, g: 3 },
	{ file: 'actions.ts', add: 126, g: 4 },
	{ file: 'multiDiffEditorWithFileList.css', add: 50, g: 3 },
	{ file: 'multiDiffEditor.contribution.ts', add: 7, g: 4 },
	{ file: 'multiDiffEditor.contribution.ts', add: 1, g: 5, more: true },
	{ file: 'multiDiffEditor.ts', add: 43, g: 4 },
	{ file: 'multiDiffEditorAccessibilityHelp.ts', add: 45, g: 5 },
	{ file: 'multiDiffEditorFileList.ts', add: 373, g: 3 },
	{ file: 'multiDiffEditorWithFileListWidget.ts', add: 169, g: 3 },
	{ file: 'common/multiDiffEditor.ts', add: 89, g: 2 },
	{ file: 'actions.test.ts', add: 31, g: 4 },
	{ file: 'multiDiffEditorConfiguration.test.ts', add: 97, g: 2 },
	{ file: 'multiDiffEditorWithFileList.test.ts', add: 425, g: 3 },
	{ file: 'multiDiffEditorFixtureUtils.ts', add: 3, g: 3 },
	{ file: 'multiDiffEditorWithFileList.fixture.ts', add: 87, g: 3 },
];

/** The five intent cards of the run, in review order, as the walkthrough skill grouped them. */
export const GROUPS = [
	{ title: 'Viewport state', full: 'Expose the diff viewport state from the multi diff widget', files: 3, add: 82, del: 2 },
	{ title: 'Setting and shared state', full: 'Add the experimental setting, context keys and shared state', files: 2, add: 186, del: 1 },
	{ title: 'File list and split layout', full: 'Build the changed-files list and its split layout', files: 8, add: 1151, del: 3 },
	{ title: 'Wired into the editor', full: 'Wire the file list into the multi diff editor and its commands', files: 4, add: 207, del: 12 },
	{ title: 'Accessibility help', full: 'Add accessibility help for the file list', files: 4, add: 52, del: 0 },
];

/** The first commit of the media preview (ef4c220e): product files only, lines added. */
export const MEDIA_FILES = [
	{ file: 'chatMediaPreviewContentPart.ts', add: 397, isNew: true },
	{ file: 'chatMediaPreview.css', add: 203, isNew: true },
	{ file: 'chatMediaPreview.ts', add: 130, isNew: true },
	{ file: 'partialFileResponse.ts', add: 27, isNew: true },
	{ file: 'chatListRenderer.ts', add: 63 },
	{ file: 'serverToolNames.ts', add: 11 },
	{ file: 'chatViewModel.ts', add: 8 },
	{ file: 'chat.shared.contribution.ts', add: 7 },
	{ file: 'protocolMainService.ts', add: 6 },
	{ file: 'chatFindWidget.ts', add: 4 },
	{ file: 'chatListWidget.ts', add: 2 },
	{ file: 'chatAccessibilityHelp.ts', add: 1 },
	{ file: 'sessionsChatAccessibilityHelp.ts', add: 1 },
	{ file: 'constants.ts', add: 1 },
	{ file: 'vscode-known-variables.json', add: 1 },
];

export const SORT = {
	id: 'sort', eyebrow: 'Lad\u2019s part', title: 'The skill sorts every change by intent',
	pieces: PIECES, groups: GROUPS, hi: 3, left: '20 files  \u00b7  path order', right: '5 intents  \u00b7  review order',
	skill: '/create-code-walkthrough',
	say: 'Lad\u2019s skill puts every change in exactly one story.',
	notes: 'Lad\u2019s walkthrough skill reads the whole diff and gives every hunk exactly one intent and one type: logic, test or supporting. Tests, styles and wiring stay with the behaviour they serve, and the intents come in review order: contracts and foundations first, then what uses them; here, accessibility comes last. Here the eight scattered pieces of the file list become one story of 1,151 lines. The skill does not invent motivation: each card says what changed and how, and the video narrates only those claims.',
	sources: [RUN, PR],
};

const PEOPLE = [
	{ initials: 'FB', name: 'Federico Brancasi', role: 'Video and slide skills, media preview', tone: 'blue' },
	{ initials: 'LS', name: 'Ladislau Szomoru', role: 'Walkthrough skill and intent cards', tone: 'blue' },
];

export const COVER = {
	id: 'cover', eyebrow: 'VS Code  \u00b7  Agents window', title: 'One prompt explains a pull request',
	sub: 'A video or deck on top, its code grouped by intent below.',
	people: PEOPLE, prompt: '/create-code-walkthrough <PR>', inLabel: 'Pull request', window: 'Agents window', eyeLogo: 'vscode', agent: 'GitHub Copilot', inCount: '20 files', outLabel: '5 intents',
	pills: [{ text: 'Experimental', tone: 'orange', icon: 'beaker' }],
	say: 'One prompt, and the pull request explains itself.',
	notes: 'This is what Lad and I built together for the Agents window. You type one prompt with a pull request in it, and you get one answer: a narrated video or a slide deck that explains the change, with every code change grouped by intent right below it. Lad wrote the walkthrough skill that groups the changes; I wrote the pr-studio video and slide skills and the media preview in chat. It is experimental and lives on a branch today. The picture is the talk in one: all 20 files of #341872 go into the press, and a front page with its five intents comes out.',
	sources: [PR, RUN],
};

export default {
	title: 'Code walkthroughs in the Agents window',
	file: 'code-walkthroughs-example',
	ref: 'Code walkthroughs  \u00b7  VS Code team  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [
		{ ...COVER, layout: 'gw-cover-d' },
		{ id: 'file-order', layout: 'gw-tape', eyebrow: 'The problem', title: 'Pull requests arrive in file order',
			pieces: PIECES, hi: 3, start: { text: '#341872, in path order' },
			stats: [{ value: '1,678', label: 'lines added in 20 files' }, { value: '8', label: 'files tell one story', tone: 'blue' }],
			legend: { on: 'The file list', off: 'Everything else' },
			say: 'A diff reads in path order, so one story is cut into pieces.',
			notes: 'This is Lad\u2019s pull request #341872, the multi-file diff editor with a file list, as a reviewer meets it: 20 files in path order, each piece as long as the lines it adds. The blue pieces are one story, the file list and its split layout, spread over 8 files between source, CSS, tests and fixtures. Reading in this order, you rebuild the story in your head. The owner of each piece comes from the five cards of our run (a run in the Agents window, filmed in the video attached to vscode-team-kit#39): their lines add up exactly to the pull request, with one file split between two cards.',
			sources: [PR, RUN] },
		{ id: 'answer', layout: 'gw-answer', eyebrow: 'The answer', title: 'The video leads, the code follows',
			window: 'Agents window', prompt: '/create-code-walkthrough PR 341872 as a video',
			media: { title: 'Video: #341872 Add multi-file diff editor with optional file list widget', meta: 'Video  \u00b7  1:15  \u00b7  microsoft-vscode-341872.mp4', button: 'Play Video' },
			cards: GROUPS, folded: 'Completed 113 steps in 18m 16s',
			parts: [
				{ title: 'One prompt' },
				{ title: 'Video on top' },
				{ title: 'One card per intent' },
				{ title: 'The rest, folded' },
			],
			clicks: [
				{ caption: 'You ask once.', say: 'You type one prompt, with the pull request and what you want.' },
				{ caption: 'The video leads.', say: 'The answer starts with the video, right in the chat.' },
				{ caption: 'The code follows.', say: 'Right below it, the code, one card per intent, in review order.' },
				{ caption: 'Steps fold away.', say: 'Everything the agent did to get there folds into one line.' },
			],
			notes: 'The answer reads like a front page. This is the real run on #341872, redrawn: the prompt, a 1:15 video at the top of the response, the five intent cards below it, and the 113 steps the agent took, folded into one line. There is no closing message: the card is the answer, and VS Code folds anything after it into the Completed line. Each card opens every file of that intent in a diff beside the chat.',
			sources: [RUN, BRANCH] },
		{ ...SORT, layout: 'gw-sort-bands' },
		{ id: 'film', layout: 'gw-shoot', eyebrow: 'Federico\u2019s part', title: 'Visible changes are shot in the real app',
			before: { label: 'Before' }, after: { label: 'After' }, camera: { label: 'Playwright' },
			sheet: 'Every claim, sourced',
			proofs: [{ src: 'line at head' }, { src: 'commit' }, { src: 'description' }, { src: 'review' }],
			stats: [{ value: '90 s', label: 'video, at most' }, { value: '12', label: 'slides, at most' }],
			say: 'My skills capture the real app, then check every claim.',
			notes: 'The pr-studio skills make the media. Like a photo desk, they shoot the real scene when there is one; a change with nothing to see gets a diagram for each idea instead. For a visible change in a merged microsoft/vscode pull request, they download the Insiders builds with and without it and drive each with Playwright in a throwaway profile, so the video shows the real app, before and after. Every claim carries its evidence (a line at the head commit, the description, a commit or the review), and the engine checks every word on screen against the pull request. A reviewer subagent signs off before anything is delivered. A video runs at most 90 seconds; a deck has at most 12 slides.',
			sources: [KIT] },
		{ id: 'player', layout: 'gw-player', eyebrow: 'The media preview', title: 'Click the card and it plays in place',
			window: 'Agents window', sidebar: 'Sessions', side: 'Build the changed-files list and its split layout', input: 'Ask a follow-up',
			prompts: ['/create-code-walkthrough PR 341872 as a video', '/create-code-walkthrough PR 341872 as a video', '/create-code-walkthrough PR 341872 as slides'],
			media: [
				{ title: 'Video: #341872 Add multi-file diff editor\nwith optional file list widget', meta: 'Video  \u00b7  1:15  \u00b7  microsoft-vscode-341872.mp4', button: 'Play Video' },
				{ title: 'Slides: #341872 Add multi-file diff editor with optional file list widget', meta: 'Slide Deck  \u00b7  5 slides  \u00b7  microsoft-vscode-341872.pdf' },
			],
			cards: GROUPS, folded: 'Completed 113 steps in 18m 16s', video: { time: '0:32 / 1:15' },
			deck: { pages: [1, 2, 3, 4, 5].map(i => `assets/gallery-walkthrough/deck-p${i}.jpg`), current: 2 },
			clicks: [
				{ caption: 'The card leads the answer.', say: 'When the agent records a video or a deck, it shows as a card at the top, with the intent cards below.' },
				{ caption: 'Click: the same frame grows.', say: 'Click it and the same frame grows to the chat\u2019s full width and plays, with the native controls.' },
				{ caption: 'A slides run: arrows and thumbnails.', say: 'In a run that asked for slides, the deck plays in the same place, with arrows and thumbnails.' },
			],
			notes: 'The media preview is my part in VS Code. When the agent records a video or a PDF as an artifact of its turn, the chat shows it as a card at the top of the response, with the intent cards right below. Clicking it grows the same card to the chat\u2019s full width (the dashed outline shows where it was); its info row moves under the player, with Reveal, Copy Path and the chevron that shrinks it back, and the intent cards move down. A deck plays with arrows over the slide (shown on hover), its page count on the corner and the thumbnails below. Videos play with the native controls; VS Code\u2019s window decodes WebM, not MP4, so it plays the WebM the skill writes beside the video. The deck pages here are the real ones pr-studio made for #341872 (an agent ran /pr-studio:generate-presentation on it, unaided); the third panel is drawn as if the walkthrough had been asked for slides in another session. The sessions list and the group\u2019s multi-file diff beside the chat are drawn as context.',
			sources: [RUN, BRANCH, KIT] },
		{ id: 'conditions', layout: 'gw-three', eyebrow: 'When it shows', title: 'The card shows only when all three hold',
			conds: [
				{ icon: 'bot', tone: 'purple', title: 'You asked for a listed skill', sub: 'chat.mediaPreview.skills' },
				{ logo: 'vscode', title: 'Local agent-host chat', sub: 'Agents window' },
				{ icon: 'play', title: 'The media can play', sub: '.webm or page images' },
			],
			yes: { label: 'All three: the card leads' }, no: { label: 'Otherwise: no card, just the file', file: 'microsoft-vscode-341872.mp4' },
			say: 'Three conditions; only where all three meet does the card lead.',
			notes: 'It starts when the agent records a video or PDF (.mp4, .webm or .pdf) as an artifact. Then three conditions, and the card shows only where all three meet. First, you asked for a listed skill: this turn, or an earlier turn of the same chat, starts with its slash command or attaches it; a skill the agent loads on its own does not count. The list is the experimental setting chat.mediaPreview.skills; at the branch head its default is the two pr-studio skills and the walkthrough skill. Second, a local agent-host chat, as in the Agents window. Third, the media can play: a video needs its WebM beside it, a deck a slides folder of page images (PNG, JPEG or WebP) beside the PDF. Otherwise there is no card and the file stays an artifact pill. One caveat: when only the third fails, the walkthrough cards still move to the top and a closing message still folds away. The walkthrough skill ends with no closing message, so the card and the cards are the answer.',
			sources: [BRANCH, LAD_COMMIT] },
		{ id: 'little-code', layout: 'gw-inches', eyebrow: 'Little code', title: 'Most existing files changed by a few lines',
			files: MEDIA_FILES,
			newLabel: 'New',
			stats: [{ value: '757', label: 'lines in 4 new files', tone: 'blue' }, { value: '105', label: 'lines added to 11 files', tone: 'neutral' }],
			say: 'Most of it is new files; existing code barely moved.',
			notes: 'I tried to use as little code as possible. In the media preview\u2019s commit, four new files carry the feature: the content part that draws the card and the player, its CSS, the logic that finds the media and the skills, and a 27-line file that, with 5 lines in protocolMainService.ts, makes Electron answer video range requests with 206 (a sixth line there allows .webm files). Eleven existing files gained 1 to 63 lines each, 105 added in all (and 20 removed). Tests add another 170 lines, not shown. Lad\u2019s later commit moved the walkthrough cards right under the video.',
			sources: [MEDIA_COMMIT, LAD_COMMIT] },
		{ id: 'close', layout: 'gw-close', bg: 'blue', eyebrow: 'Your turn', title: 'Try it on your next\npull request',
			prompt: '/create-code-walkthrough <PR> as a video', sub: 'Or as slides, or both.',
			people: PEOPLE, pills: [{ text: 'Experimental  \u00b7  on a branch', tone: 'orange', icon: 'beaker' }],
			pages: [{ label: 'A video', picture: 'video' }, { label: 'Slides', picture: 'deck' }, { label: 'Both', picture: 'both' }],
			say: 'Try it on your next pull request.',
			notes: 'Try it on a pull request you are reviewing: type the prompt in the Agents window, as a video, as slides, or both. It is experimental and on a branch today. The pr-studio skills are in the vscode-team-kit (Chat: Install Plugin from Source; merged 21 Oct 2026). Tell Lad or me what the walkthrough got wrong: that is what we want to fix next.',
			sources: [KIT, BRANCH] },
	],
};
