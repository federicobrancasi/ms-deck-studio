// Finds Chrome for Testing (installed by Playwright) or the browser named in $CHROME.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function chromePath() {
	if (process.env.CHROME && fs.existsSync(process.env.CHROME)) {
		return process.env.CHROME;
	}
	for (const cache of [path.join(os.homedir(), 'Library/Caches/ms-playwright'), path.join(os.homedir(), '.cache/ms-playwright')]) {
		if (!fs.existsSync(cache)) {
			continue;
		}
		const versions = fs.readdirSync(cache).filter(n => /^chromium-\d+$/.test(n)).sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
		for (const v of versions) {
			for (const rel of ['chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-linux/chrome', 'chrome-linux64/chrome']) {
				const p = path.join(cache, v, rel);
				if (fs.existsSync(p)) {
					return p;
				}
			}
		}
	}
	throw new Error('Chrome for Testing is missing. Run: npx playwright-core install chromium');
}
