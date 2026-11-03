// Review sheets: for every page of a built deck, one image with the page on the left and its four quadrants zoomed on
// the right, so a reviewer (a person or a checker agent) sees the detail a contact sheet hides. It also flags large
// empty areas inside the body of each page (a hint, not a failure).
// Usage: npm run review -- --deck <name>   ->  out/<name>-review/NNN.png and out/<name>-review.txt
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { chromePath } from './chrome.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--deck');
const name = i >= 0 ? process.argv[i + 1] : null;
if (!name) {
	console.error('Usage: npm run review -- --deck <name>   (build the deck first)');
	process.exit(1);
}
const { getDeck } = await import('./decks.mjs');
const deck = (await getDeck(name)).deck ?? (await getDeck(name));
const file = deck.file ?? name;
const dir = path.join(ROOT, 'out', `${file}-slides`);
if (!fs.existsSync(dir)) {
	console.error(`No pages at out/${file}-slides/: build the deck first (node src/build.mjs --deck ${name}).`);
	process.exit(1);
}
const pages = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const outDir = path.join(ROOT, 'out', `${file}-review`);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath() });
const page = await browser.newPage({ viewport: { width: 2400, height: 1080 } });
const report = [];
for (const f of pages) {
	const data = fs.readFileSync(path.join(dir, f)).toString('base64');
	const url = `data:image/png;base64,${data}`;
	// Empty-area hint: the largest blank cell in a 12 x 6 grid over the body (y 230..980), measured in the page.
	const empty = await page.evaluate(async src => {
		const img = new Image();
		img.src = src;
		await img.decode();
		const c = document.createElement('canvas');
		c.width = img.width;
		c.height = img.height;
		const g = c.getContext('2d');
		g.drawImage(img, 0, 0);
		const sx = img.width / 1920, cols = 12, rows = 6, x0 = 96, x1 = 1824, y0 = 230, y1 = 980;
		const cw = (x1 - x0) / cols, ch = (y1 - y0) / rows, blank = [];
		const bg = g.getImageData(Math.round(40 * sx), Math.round(600 * sx), 1, 1).data;
		for (let r = 0; r < rows; r++) {
			for (let k = 0; k < cols; k++) {
				const d = g.getImageData(Math.round((x0 + k * cw) * sx), Math.round((y0 + r * ch) * sx), Math.round(cw * sx), Math.round(ch * sx)).data;
				let diff = 0;
				for (let p = 0; p < d.length; p += 16) {
					if (Math.abs(d[p] - bg[0]) + Math.abs(d[p + 1] - bg[1]) + Math.abs(d[p + 2] - bg[2]) > 30) diff++;
				}
				blank.push(diff < 3);
			}
		}
		// The largest rectangle of blank cells.
		let best = { area: 0 };
		for (let r0 = 0; r0 < rows; r0++) for (let c0 = 0; c0 < cols; c0++) for (let r1 = r0; r1 < rows; r1++) for (let c1 = c0; c1 < cols; c1++) {
			let ok = true;
			for (let r = r0; r <= r1 && ok; r++) for (let k = c0; k <= c1 && ok; k++) ok = blank[r * cols + k];
			const area = (r1 - r0 + 1) * (c1 - c0 + 1);
			if (ok && area > best.area) best = { area, r0, c0, r1, c1 };
		}
		return { share: best.area / (cols * rows), where: best.area ? `${best.c0 < cols / 3 ? 'left' : best.c0 >= 2 * cols / 3 ? 'right' : 'middle'}, ${best.r0 < rows / 2 ? 'top' : 'bottom'}` : '' };
	}, url);
	const n = f.replace('.png', '');
	if (empty.share >= 0.2) {
		report.push(`page ${Number(n)}  empty area: about ${Math.round(empty.share * 100)}% of the body is blank (${empty.where})`);
	}
	await page.setContent(`<html><body style="margin:0;background:#eef0f3;font:600 22px system-ui;color:#5f6168">
<div style="position:absolute;left:20px;top:20px;width:1280px"><img src="${url}" style="width:1280px;border-radius:6px;box-shadow:0 0 0 1px #d6d9e0"><div style="margin-top:10px">Page ${Number(n)}</div></div>
${[[0, 0], [1, 0], [0, 1], [1, 1]].map(([qx, qy], k) => `<div style="position:absolute;left:${1320 + qx * 540}px;top:${20 + qy * 330}px;width:520px;height:300px;overflow:hidden;border-radius:6px;box-shadow:0 0 0 1px #d6d9e0;background:#fff"><img src="${url}" style="position:absolute;width:1040px;left:${-qx * 520}px;top:${-qy * 292}px"></div>`).join('')}
</body></html>`);
	await page.screenshot({ path: path.join(outDir, `${n}.png`), clip: { x: 0, y: 0, width: 2400, height: 760 } });
}
await browser.close();
const txt = report.length ? `Review hints (${report.length}):\n${report.map(r => `  ${r}`).join('\n')}` : 'Review hints: none';
fs.writeFileSync(path.join(ROOT, 'out', `${file}-review.txt`), txt + '\n');
console.log(`${txt}\nReview sheets: out/${file}-review/ (${pages.length} pages: the page, and its four quarters zoomed)`);
