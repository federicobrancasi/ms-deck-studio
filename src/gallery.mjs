// Builds every deck listed in gallery.json (with the brand logo off) and copies its PDF and contact sheet to
// dist/examples/. Fails if a deck's checks are not clean.  Usage: npm run gallery
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'gallery.json'), 'utf8'));
const dist = path.join(ROOT, 'dist', 'examples');
fs.mkdirSync(dist, { recursive: true });
let failed = 0;
for (const { deck } of list) {
	if (!fs.existsSync(path.join(ROOT, 'examples', `${deck}.mjs`))) {
		console.log(`${deck.padEnd(28)} skipped (no examples/${deck}.mjs yet)`);
		continue;
	}
	const report = execFileSync('node', ['src/build.mjs', '--deck', deck], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, DECK_BRAND: 'off' } });
	const checks = /^Checks: .*$/m.exec(report)?.[0] ?? 'Checks: ?';
	console.log(`${deck.padEnd(28)} ${checks}`);
	if (checks !== 'Checks: clean') {
		failed++;
		continue;
	}
	for (const f of [`${deck}.pdf`, `${deck}-contact.png`]) {
		fs.copyFileSync(path.join(ROOT, 'out', f), path.join(dist, f));
	}
}
process.exit(failed ? 1 : 0);
