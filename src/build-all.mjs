// Builds every deck in a folder (examples/ by default) and prints one line each. Usage: node src/build-all.mjs [folder]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const dir = process.argv[2] ?? 'examples';
let failed = 0;
for (const f of fs.readdirSync(path.join(ROOT, dir)).filter(n => n.endsWith('.mjs') && !n.startsWith('_')).sort()) {
	const name = f.slice(0, -4);
	try {
		const report = execFileSync('node', ['src/build.mjs', '--deck', name], { cwd: ROOT, encoding: 'utf8' });
		const checks = /^Checks: .*$/m.exec(report)?.[0] ?? 'Checks: ?';
		console.log(`${name.padEnd(20)} ${(/(\d+ slides, \d+ pages)/.exec(report) ?? ['', '?'])[1]}  ${checks}`);
		if (checks !== 'Checks: clean') {
			failed++;
		}
	} catch (e) {
		failed++;
		console.log(`${name.padEnd(20)} FAILED: ${String(e.stderr || e.message).split('\n').find(Boolean)}`);
	}
}
process.exit(failed ? 1 : 0);
