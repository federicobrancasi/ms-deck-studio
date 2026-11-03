// Starts a new illustrated deck in one go: the deck, its own designs file (a starter drawing in the house style), an
// options deck with four cover slots, and a brief to fill in first. Nothing is overwritten; everything it writes is
// ignored by git (decks/ and designs/local-*).
// Usage: npm run new -- <name> [--title "Deck title"] [--world "a harbour"]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const name = args.find(a => !a.startsWith('--'));
const opt = k => {
	const i = args.indexOf(`--${k}`);
	return i >= 0 ? args[i + 1] : null;
};
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
	console.error('Usage: npm run new -- <name> [--title "Deck title"] [--world "a harbour"]\n  <name>: lowercase letters, digits and dashes, e.g. q3-migration');
	process.exit(1);
}
const title = opt('title') ?? 'The claim of the talk';
const world = opt('world') ?? 'your world (pick one from the topic: see docs/illustrating.md)';
const prefix = name.split('-').map(w => w[0]).join('').slice(0, 3) + '-';
const files = {
	[`decks/${name}-brief.md`]: `# Brief: ${title}

Fill this in before drawing anything (the ms-deck skill does it with you). Keep it short.

- **Takeaway:** what the audience should think or do afterwards.
- **Audience and setting:** who, live or read alone, minutes.
- **Level:** illustrations.
- **What must not appear:** (add the words to ~/.config/ms-deck-studio/denylist.txt)
- **World:** ${world}
- **Recurring object:** the one thing that comes back on most slides (a container is a test, a tape is a video).
- **Checkers at the end:** yes

## Slides (one line each: claim title, then the drawing, then what the numbers become)

1. Cover: ${title}. The hero drawing:
2.
3.
4.
5.
6.
7.
8.
9.
10. Close (a drawn close):

## Assumptions (what you decided without asking)

-
`,
	[`designs/local-${name}.mjs`]: `// Drawings for decks/${name}.mjs (not committed). World: ${world}.
// Rules and helpers: docs/designs.md. The bar: docs/illustrating.md ("The detail bar"). Every visible word comes from
// the slide's fields. Name every design with the prefix '${prefix}' so it never collides with another deck's.
import { W, STYLE, at, t, mix, layer, wob, r1, esc, fmt, ic, logo, heading, body, bodyHeight, msLogo, phone, laptop, monitor, appWindow, browser } from '../src/kit.mjs';

const SW = STYLE.stroke;

export const designs = {
	/** A starter picture to replace: one object (a rounded card standing on a shelf) with its label and a number.
	 * Fields: eyebrow, title, items: [{ icon, label, value, tone }]. */
	'${prefix}starter': {
		css: \`
.${prefix}starter { position: relative; width: 1728px; }
.${prefix}starter .${prefix}starter-v { position: absolute; font-size: 56px; font-weight: 700; letter-spacing: -.02em; text-align: center; }
.${prefix}starter .${prefix}starter-l { position: absolute; font-size: 24px; color: var(--body); text-align: center; }
\`,
		render(s) {
			const H = bodyHeight(s), items = s.items ?? [], cw = W / Math.max(1, items.length), shelf = H - 120;
			let svg = \`<rect x="0" y="\${shelf}" width="\${W}" height="16" rx="8" fill="var(--line-strong)"/>\`, html = '';
			items.forEach((it, i) => {
				const cx = cw * i + cw / 2, tone = it.tone ?? 'blue';
				svg += \`<rect x="\${r1(cx - 120)}" y="\${shelf - 280}" width="240" height="280" rx="\${STYLE.radius}" fill="\${mix(tone, 14)}" stroke="var(--ink)" stroke-width="\${SW}"/>\`;
				html += \`<span style="position:absolute;left:\${r1(cx - 32)}px;top:\${shelf - 250}px;color:var(--\${tone})">\${ic(it.icon ?? 'star', 64)}</span>\`;
				html += t('${prefix}starter-v nolint', at(cx - 120, shelf - 160, 240) + \`;color:var(--\${tone})\`, esc(String(it.value ?? '')));
				html += t('${prefix}starter-l', at(cx - 150, shelf + 30, 300), fmt(it.label ?? ''));
			});
			return heading(s) + body(\`<div class="${prefix}starter" style="height:\${H}px">\${layer(H, svg)}\${html}</div>\`, { vcenter: false });
		},
	},
};
`,
	[`decks/${name}.mjs`]: `// ${title}. Brief: decks/${name}-brief.md. Drawings: designs/local-${name}.mjs. Options: decks/${name}-options.mjs.
// Build: node src/build.mjs --deck ${name}   (then: npm run review -- --deck ${name})
const SOURCE = 'Where the numbers come from';
const SPEAKER = { initials: 'AB', name: 'Your Name', role: 'Microsoft' };

export const cover = { id: 'cover', layout: 'title', eyebrow: 'Context', title: '${title.replace(/'/g, "\\'")}', sub: 'One line that frames it.',
	speaker: SPEAKER, notes: 'Who you are in one sentence, and why this matters to them.' };

export default {
	title: '${title.replace(/'/g, "\\'")}',
	file: '${name}',
	ref: '${title.replace(/'/g, "\\'")}  \\u00b7  ${new Date().toLocaleString('en-GB', { month: 'short', year: 'numeric' })}',
	wordBudget: 15,
	slides: [
		cover,
		{ id: 'first', layout: '${prefix}starter', eyebrow: 'The point', title: 'A claim in eight words or fewer',
			items: [{ icon: 'rocket', label: 'One thing', value: '12', tone: 'blue' }, { icon: 'checkmark', label: 'Another', value: '3', tone: 'green' }],
			sources: [SOURCE], notes: 'Replace the starter drawing with your own (designs/local-${name}.mjs).' },
		{ id: 'close', layout: 'close', text: 'The line to {{blue|remember}}.', speaker: SPEAKER, notes: 'End here.' },
	],
};
`,
	[`decks/${name}-options.mjs`]: `// Options for decks/${name}.mjs: four covers (and two or three versions of the hardest slide), each eyebrow ending
// "· Option A/B/C/D". Draw each as its own design in designs/local-${name}.mjs, build this deck, let the user pick, then
// put the winner in the main deck.  Build: node src/build.mjs --deck ${name}-options
import deck, { cover } from './${name}.mjs';

const opt = (letter, layout) => ({ ...cover, id: \`cover-\${letter.toLowerCase()}\`, layout, eyebrow: \`\${cover.eyebrow}  \\u00b7  Option \${letter}\` });

export default {
	...deck,
	title: \`\${deck.title}: options\`,
	file: '${name}-options',
	variety: false,
	slides: [
		opt('A', 'title'), // replace 'title' with '${prefix}cover-a' once drawn: simple
		opt('B', 'title'), // '${prefix}cover-b': more detail
		opt('C', 'title'), // '${prefix}cover-c': the full scene
		opt('D', 'title'), // '${prefix}cover-d': a different object
	],
};
`,
};
let wrote = 0;
for (const [rel, text] of Object.entries(files)) {
	const file = path.join(ROOT, rel);
	if (fs.existsSync(file)) {
		console.log(`  kept     ${rel} (already there)`);
		continue;
	}
	fs.writeFileSync(file, text);
	console.log(`  created  ${rel}`);
	wrote++;
}
console.log(`\nNext:\n  1. Fill in decks/${name}-brief.md (or ask your agent to, with the ms-deck skill).\n  2. Draw in designs/local-${name}.mjs; prefix every design '${prefix}'.\n  3. node src/build.mjs --deck ${name}   then   npm run review -- --deck ${name}`);
process.exit(wrote || Object.keys(files).every(f => fs.existsSync(path.join(ROOT, f))) ? 0 : 1);
