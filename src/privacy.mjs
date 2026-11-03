// Checks that nothing private ends up in the repo or on a slide: every tracked text file (and every built notes file) is
// searched for the words in your denylist. The denylist lives OUTSIDE the repo, because a committed list of private
// words would itself leak them. One term per line (case-insensitive; lines starting with # are comments).
// Usage: node src/privacy.mjs   (DECK_DENYLIST=/path/to/list overrides ~/.config/ms-deck-studio/denylist.txt)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const listFile = process.env.DECK_DENYLIST ?? path.join(os.homedir(), '.config', 'ms-deck-studio', 'denylist.txt');
if (!fs.existsSync(listFile)) {
	console.log(`No denylist at ${listFile}: nothing to check.\nCreate it with one private word per line (project code names, customer names, people) and run again.`);
	process.exit(0);
}
const terms = fs.readFileSync(listFile, 'utf8').split('\n').map(t => t.trim()).filter(t => t && !t.startsWith('#'));

// The files to search: what git tracks (or would add), plus the built notes, which hold the speaker's words.
let files;
try {
	files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
} catch {
	files = [];
}
const out = path.join(ROOT, 'out');
if (fs.existsSync(out)) {
	files.push(...fs.readdirSync(out).filter(f => f.endsWith('-notes.md')).map(f => path.join('out', f)));
}
const TEXT = /\.(mjs|js|json|md|css|html|txt|svg|ya?ml)$/i;
const hits = [];
for (const rel of files) {
	if (!TEXT.test(rel) || rel.startsWith('node_modules/')) {
		continue;
	}
	const lines = fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n');
	lines.forEach((line, i) => {
		for (const t of terms) {
			if (line.toLowerCase().includes(t.toLowerCase())) {
				hits.push(`${rel}:${i + 1}  "${t}"`);
			}
		}
	});
}
if (hits.length) {
	console.log(`Privacy: ${hits.length} hit(s) for terms in ${listFile}:\n${hits.map(h => `  ${h}`).join('\n')}`);
	process.exit(1);
}
console.log(`Privacy: clean (${terms.length} terms, ${files.length} files)`);
