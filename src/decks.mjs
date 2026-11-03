// Finds a deck by name and fills in its defaults. A deck is one .mjs file whose default export is plain data:
//   export default { title, ref, file?, sections: [{ id, title, short?, slides: [...] }] | slides: [...], showTiers?, ... }
// Where a name is looked up, in order: a path to a .mjs file, decks/<name>.mjs (your own decks, not committed),
// examples/<name>.mjs, guide/<name>.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIRS = ['decks', 'examples', 'guide'];

export function findDeck(name) {
	if (/\.mjs$/.test(name)) {
		const file = path.resolve(name);
		if (fs.existsSync(file)) {
			return file;
		}
		throw new Error(`No deck file at ${file}`);
	}
	for (const dir of DIRS) {
		const file = path.join(ROOT, dir, `${name}.mjs`);
		if (fs.existsSync(file)) {
			return file;
		}
	}
	throw new Error(`Unknown deck "${name}". Known decks: ${listDecks().join(', ')}`);
}

export function listDecks() {
	return DIRS.flatMap(dir => {
		const d = path.join(ROOT, dir);
		return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4)) : [];
	});
}

export async function getDeck(name = 'guide') {
	const file = findDeck(name);
	const mod = await import(pathToFileURL(file).href);
	const raw = typeof mod.default === 'function' ? await mod.default() : mod.default;
	if (!raw || (!raw.sections && !raw.slides)) {
		throw new Error(`${path.relative(ROOT, file)}: the default export needs "sections" or "slides"`);
	}
	const sections = raw.sections ?? [{ id: 'main', title: raw.title, slides: raw.slides }];
	return {
		showTiers: false,
		...raw,
		title: raw.title ?? path.basename(file, '.mjs'),
		ref: raw.ref ?? raw.title ?? '',
		file: raw.file ?? path.basename(file, '.mjs'),
		sections,
	};
}
