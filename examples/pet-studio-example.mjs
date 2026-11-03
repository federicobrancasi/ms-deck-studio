// Example: an illustrated talk about a real project with public sources: Pet Studio
// (https://github.com/federicobrancasi/pet-studio), a kit that makes films, vertical reels, images and new moves with
// the VS Code pet when you ask an agent in chat. Set in one world (a small film studio) with one recurring object (the
// print: a white-bordered photo hung on a line with a yellow peg). Ten slides, each drawn by a design in
// designs/gallery-pet.mjs (gp-*); the pictures are real frames and sprites in assets/gallery-pet/ (see its NOTICE.md).
// The gallery is inspiration: a new deck invents its own world and draws its own pictures (docs/illustrating.md).
// Every number and name comes from the public pet-studio repository; each slide links its source.
// Build: node src/build.mjs --deck pet-studio-example
const REPO = 'https://github.com/federicobrancasi/pet-studio';
const SRC = {
	readme: `Pet Studio README | ${REPO}#readme`,
	film: `Coding World README | ${REPO}/tree/main/examples/coding-world`,
	reels: `Example reels | ${REPO}/tree/main/examples`,
	stills: `kit/stills.py | ${REPO}/blob/main/kit/stills.py`,
	moves: `Moves gallery | ${REPO}/tree/main/moves`,
	sprites: `kit/sprites.json | ${REPO}/blob/main/kit/sprites.json`,
	skill: `pet-studio skill | ${REPO}/blob/main/.claude/skills/pet-studio/SKILL.md`,
	signoff: `Sign-off guide | ${REPO}/blob/main/.claude/skills/pet-studio/guides/sign-off.md`,
	director: `pet-director agent | ${REPO}/blob/main/.claude/agents/pet-director.md`,
	pet: `kit/pet.py | ${REPO}/blob/main/kit/pet.py`,
	fetch: `kit/sprites.py | ${REPO}/blob/main/kit/sprites.py`,
	quick: `README Quickstart | ${REPO}#quickstart`,
};
const SPEAKER = { initials: 'FB', name: 'Federico Brancasi', role: 'Author of Pet Studio' };

const DISCLAIMER = 'It is a personal fan project, not an official Microsoft or VS Code project; the pet artwork is Microsoft\'s, used under the VS Code MIT license.';

const cover = {
	id: 'cover', layout: 'gp-cover-chair', eyebrow: 'Pet Studio for VS Code',
	title: 'Ask in chat, get a finished pet film',
	sub: 'Films, reels, images and new moves, built on the real sprites.',
	speaker: SPEAKER,
	pills: [{ text: 'Personal project', tone: 'orange', icon: 'beaker' }, { text: 'Open source, MIT', tone: 'neutral', icon: 'git' }],
	pet: 'stable-cool', band: 'Pet Studio',
	say: 'You ask in chat; a finished pet film comes out.',
	notes: 'Pet Studio is a kit for the VS Code pet: you open it in VS Code, ask the agent for a film, a reel, an image or a new move for the pet, and you get a finished file. On the cover the pet is the director: the real sprite in its sunglasses state, in a director\u2019s chair under a spotlight. ' + DISCLAIMER,
	sources: [SRC.readme],
};

const steps = {
	id: 'steps', layout: 'gp-steps', eyebrow: 'How it works', title: 'Six steps turn your ask into a file',
	steps: [
		{ pet: 'stable-rendering-bubble', title: 'Ask', tone: 'blue' },
		{ pet: 'stable-move-idea', title: 'Brief, beats', tone: 'purple' },
		{ pet: 'stable-cool', title: 'Key frame', tone: 'purple' },
		{ pet: 'stable-move-build', title: 'Build', tone: 'purple' },
		{ pet: 'stable-move-debug', title: 'Review', tone: 'purple' },
		{ pet: 'stable-move-lgtm', title: 'Sign-off', tone: 'green' },
	],
	who: [
		{ from: 0, to: 0, label: 'You', tone: 'blue' },
		{ from: 1, to: 4, label: 'The agent: skill and Python kit', tone: 'purple', logos: ['python'] },
		{ from: 5, to: 5, label: 'Reviewer agent', tone: 'purple' },
	],
	clicks: [
		{ caption: 'One sentence in chat', say: 'You ask, in Copilot or Claude Code.' },
		{ caption: 'The skill sets brief and beats', say: 'Subject, length, format, then one beat per action.' },
		{ caption: 'The key frame comes first', say: 'And looks at it before building the rest.' },
		{ caption: 'Every pet from the real sprites', say: 'Plain Python: Pillow, numpy and ffmpeg.' },
		{ caption: 'A review package, checked', say: 'Contact sheets, motion strips, sound, upload checks.' },
		{ caption: 'Signed off, then delivered', say: 'Then you get the file and the command to re-render it.' },
	],
	say: 'Six steps, and you only do the first one.',
	notes: 'Asking is your step; the rest is the workflow the pet-studio skill gives the agent: brief and beats (two steps in the skill, one frame here), key frame first (for films), build, review, sign-off, then deliver. The pet in each frame acts the step: for the ask, the real state the pet shows while a request runs, with its real speech bubble; then four of the kit\'s ready-made moves built on the real sprites (an idea, building a rocket, a hammer flattening a bug for the review, and a green LGTM check), plus one more real state: sunglasses for the key frame. Every pet is shown at exactly twice its size, so each frame is as wide as its pet needs. The skill lives in the .claude folder, which VS Code with Copilot, the Copilot CLI and Claude Code all read. The kit is plain Python: Pillow, numpy and ffmpeg.',
	sources: [SRC.skill, SRC.readme],
};

export default {
	title: 'Ask in chat, get a finished pet film',
	file: 'pet-studio-example',
	ref: 'Pet Studio  \u00b7  Illustrated talk  \u00b7  Nov 2026',
	wordBudget: 15,
	slides: [
		cover,

		{ id: 'ask', layout: 'gp-ask', eyebrow: 'The ask', title: 'One sentence in chat is the whole brief',
			ask: 'Make a 20 s video of the pet surfing a git branch, for X',
			hostsLabel: 'Works in', orLabel: 'Or ask for',
			hosts: [{ logo: 'vscode', text: 'VS Code' }, { logo: 'githubcopilot', text: 'Copilot CLI' }, { logo: 'claude', text: 'Claude Code' }],
			outputs: [
				{ icon: 'film', title: 'Film', sub: 'MP4 for X', on: true },
				{ icon: 'phone', title: 'Reel', sub: '9:16 MP4' },
				{ icon: 'image', title: 'Image', sub: '7 PNG sizes' },
				{ icon: 'magicWand', title: 'Move', sub: 'sprite sheets, GIF' },
			],
			say: 'You type one sentence; the agent does the rest.',
			notes: 'This is how you start: one sentence in chat, in agent mode. The sentence on the slide is one of the example asks in the README; it gets you an MP4 ready to upload to X, plus a review package. The pet sitting on the chat input is the real sprite, as it sits in the editor. The same ask works in VS Code with Copilot, in the Copilot CLI and in Claude Code. You can also ask for a 9:16 reel, images in seven sizes, or a new move.',
			sources: [SRC.readme, SRC.stills] },

		{ id: 'film', layout: 'gp-beats', eyebrow: 'Pet films', title: 'One brief became a 30-second film',
			brief: { label: 'Another brief', text: 'One line in chat' },
			stats: [{ value: '30 s', label: 'one shot, with music' }, { value: '12', label: 'beats, each one action' }],
			rows: [
				[{ src: 'cw-01.png', time: '0.2', label: 'asleep' }, { src: 'cw-02.png', time: '1.4', label: 'types along' }, { src: 'cw-03.png', time: '2.9', label: 'thinking' }, { src: 'cw-04.png', time: '4.5', label: 'hop and star' }],
				[{ src: 'cw-05.png', time: '7.9', label: 'a bug!' }, { src: 'cw-06.png', time: '10.1', label: 'bonk' }, { src: 'cw-07.png', time: '11.1', label: 'a feature' }, { src: 'cw-08.png', time: '15.2', label: 'types a bridge' }],
				[{ src: 'cw-09.png', time: '18.7', label: 'perch' }, { src: 'cw-10.png', time: '20.9', label: 'shipped!' }, { src: 'cw-11.png', time: '23.4', label: 'a friend' }, { src: 'cw-12.png', time: '26.9', label: 'happy coding!' }],
			],
			say: 'Every frame here is from the real film.',
			notes: 'Coding World is the kit\'s example film: 30 seconds, one shot, made from a one-line brief. The README shows the result but not the brief itself, so the slide doesn\'t quote it. Every film comes with its beats laid out as a strip like this one: one action with a visible result per beat, so it reads with the sound off. The times are seconds into the film. The MP4 with sound is on the v1.5.2 release.',
			sources: [SRC.film, SRC.readme] },

		{ id: 'reels', layout: 'gp-phones', eyebrow: 'Pet reels', title: 'Vertical reels come out ready to post',
			reels: [
				{ src: 'reel-pet-day.png', name: 'pet-day', caption: 'A coding day \u00b7 0:35', at: 220 / 529 },
				{ src: 'reel-blobby.png', name: 'blobby', caption: 'The name reveal \u00b7 0:15', at: 162 / 225 },
				{ src: 'reel-boss-fight.png', name: 'boss-fight', caption: 'A bug in prod \u00b7 0:20', at: 144 / 308 },
				{ src: 'reel-reflection.png', name: 'reflection', caption: 'Wait for it \u00b7 0:17', at: 150 / 255 },
			],
			say: 'Four real reels, as they look in the app.',
			notes: 'These are the kit\'s four example reels, one real frame of each reel\'s GIF in the README, at 9:16: a coding day, the name reveal, a bug in prod, and a wait-for-it at a night pond. They are made for Reels, TikTok, Shorts and X, and the MP4s with sound are on the v1.5.2 release. Each frame fills the phone\'s screen exactly, pixel for pixel. The phones, the status bar, the like, comment and share buttons, the names and the progress lines are drawn for this slide to show how a reel looks in an app; they are not part of the reels. The captions are the ones the README gives each reel.',
			sources: [SRC.reels, SRC.readme] },

		{ id: 'images', layout: 'gp-sizes', eyebrow: 'Pet images', title: 'One image file renders seven sizes',
			file: { icon: 'code', text: 'ship-it/still.py' },
			scale: 0.14,
			items: [
				{ src: 'presets/ship-it-wallpaper.png', name: '4K wallpaper', w: 3840, h: 2160 },
				{ src: 'presets/ship-it-x-post.png', name: 'X post', w: 1920, h: 1080 },
				{ src: 'presets/ship-it-x-header.png', name: 'X header', w: 1500, h: 500 },
				{ src: 'presets/ship-it-square.png', name: 'Square', w: 1080, h: 1080 },
				{ src: 'presets/ship-it-story.png', name: 'Story', w: 1080, h: 1920 },
				{ src: 'presets/ship-it-phone.png', name: 'Phone', w: 1170, h: 2532 },
				{ src: 'presets/ship-it-sticker.png', name: 'Sticker', w: 512, h: 512 },
			],
			say: 'Same scene, laid out again for every frame, not cropped.',
			notes: 'These are the seven real renders of the ship-it example, made for this deck with still render, drawn to scale. One still file describes the scene, and the layout adapts it to each preset rather than cropping: a 4K wallpaper, an X post, an X header, a square post, a 9:16 story, a phone lock screen and a transparent sticker. The pixel sizes under the shelf are the files\' real sizes.',
			sources: [SRC.stills, SRC.readme] },

		{ id: 'moves', layout: 'gp-move', eyebrow: 'New moves', title: 'A move is a grid of letters',
			file: 'wave/move.txt',
			grid: ['..A.........', '...A.....AA.', '....A..AA...', '.....BA.....', '....BACC....', '...BACCCC...', '..BACCCCCC..', '.BACCCCCCCC.', 'BAACCECCECCC', 'BAACCECCECCC', 'BAACCCCCCCCC', '.BAAACCCCCC.'],
			legend: [{ key: 'C A B', text: 'body' }, { key: 'E', text: 'eye' }, { key: '.', text: 'clear' }],
			command: 'kit move build',
			pets: [{ pet: 'stable-move-wave', label: 'Stable', tone: 'blue' }, { pet: 'insiders-move-wave', label: 'Insiders', tone: 'green' }],
			gallery: { src: 'moves.png', value: '14', label: 'ready-made moves' },
			say: 'One grid of letters makes both colorways.',
			notes: 'A move is a text file of frames, 7 to 16 in the kit\'s moves (wave has seven). Each frame is a grid of letters, one per pet pixel: at least 12 by 12, with the pet in the bottom-left 12 by 12, and bigger when a prop needs room. This is a real 12 by 12 frame of the wave move. C, A and B are the body\'s light, mid and dark colours, E is an eye, a dot is transparent, and props get their own letters. Because the letters name shades rather than colours, one grid makes both the blue Stable and the green Insiders pet. The build writes sprite sheets in the format VS Code uses, a GIF and a preview. VS Code only plays the animations it ships, so a new move shows up in films and images, not in the editor. The kit comes with 14 ready-made moves, on the right.',
			sources: [SRC.moves, SRC.readme] },

		steps,

		{ id: 'sprites', layout: 'gp-sprites', bg: 'dark', eyebrow: 'The rules', title: 'Every pet comes from the real sprites',
			cols: 7,
			states: [
				['idle', 'idle'], ['idleTracking', 'idleTracking'], ['rendering', 'rendering'], ['sleep', 'sleep'], ['waking', 'waking'], ['typing', 'typing'], ['press', 'press'],
				['jump', 'jump'], ['love', 'love'], ['worry', 'worry'], ['clapping', 'clapping'], ['cool', 'cool'], ['sing', 'sing'], ['speechless', 'speechless'],
				['dizzy', 'dizzy'], ['falling', 'falling'], ['splat', 'splat'], ['search', 'search'], ['yapping', 'yapping'],
			].map(([file, name]) => ({ pet: `stable-${file}`, name })),
			count: { value: '19', label: 'real states, two colorways' },
			pin: { label: 'Pinned and checked', text: 'microsoft/vscode @ 9c8b8c2', sub: 'Every file\'s SHA-256 checked' },
			colorways: [{ pet: 'stable-idle', label: 'Stable', color: '#6cb8f6' }, { pet: 'insiders-idle', label: 'Insiders', color: '#7bd389' }],
			say: 'The agent never draws the pet from memory.',
			notes: 'Every pet you see in the kit\'s output comes from the real sprites, downloaded from microsoft/vscode at a pinned commit and checked against a SHA-256 for each file. The worlds, props and captions around it are drawn by the kit. These are its 19 states, rendered by the kit at their real size. The skill\'s rules: real sprites only, whole pixels and integer scales, blue for Stable and green for Insiders, and the pet\'s community-picked name, Blobby, never an invented one. The sprites are not stored in the repo; setup downloads them.',
			sources: [SRC.pet, SRC.sprites, SRC.fetch, SRC.skill] },

		{ id: 'signoff', layout: 'gp-signoff', eyebrow: 'The sign-off', title: 'A second agent signs off every piece',
			prints: [
				{ src: 'review-strip.png', label: 'Motion strip, frame by frame', ratio: 1948 / 442 },
				{ src: 'review-audio.png', label: 'Sound, beat by beat', ratio: 1000 / 275 },
			],
			agent: { icon: 'bot', name: 'pet-director' },
			verdict: 'Verdict:\nsigned off',
			otherwise: 'Or fixes, then review again',
			say: 'Nothing is final until a second agent says so.',
			notes: 'The review writes everything a reviewer needs: contact sheets, a frame and a motion strip for every beat, an audio spectrogram, loudness and X upload checks, and for vertical videos the parts the apps cover, shaded. The pet-director agent reads these and its first line is either VERDICT: SIGNED OFF or VERDICT: CHANGES REQUESTED with a list of must-fixes; the agent fixes them, re-renders and asks again. If the agent can\'t start a second agent, it reviews its own work against the same checklist and says that no independent sign-off happened. It cannot hear the audio, so it reads the spectrogram and the loudness numbers, and says so. Both pictures are from the Coding World review; the stamp shows what a sign-off looks like, not a recorded verdict for that film.',
			sources: [SRC.signoff, SRC.director, SRC.readme] },

		{ id: 'close', layout: 'gp-close', bg: 'blue', title: 'Ask in chat, get a finished pet film',
			text: 'Ask in chat.\nGet a finished\npet film.',
			commandsLabel: 'Set it up, then ask',
			commands: ['git clone https://github.com/federicobrancasi/pet-studio', 'cd pet-studio', 'python3 -m pip install -r requirements.txt', 'python3 -m kit doctor'],
			band: 'Your turn', pet: 'insiders-move-wave',
			url: REPO,
			sources: [SRC.quick],
			say: 'Clone it, run doctor, and ask.',
			notes: 'Four lines and you are ready: clone, go into the folder, install the Python requirements (Python 3.9 or later; on Windows use py), and run kit doctor, which checks the setup and downloads the pet sprites. Then open the folder in VS Code with Copilot in agent mode, the Copilot CLI or Claude Code, and ask. New moves for the gallery are welcome. The empty director\'s chair is the invitation, and the green Insiders pet waves you in: your turn. Questions?' },
	],
};
