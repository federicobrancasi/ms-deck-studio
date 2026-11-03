// Builds a handout from a built deck: one page per slide (the last click of a click-by-click slide), the slide on the
// left and what goes with it on the right: the layout, the line to say, the notes and the sources. For people who read
// the deck instead of hearing it, and for the guide, where the notes explain each layout.
// Usage: node src/handout.mjs --deck <name>   (after node src/build.mjs --deck <name>)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { esc, fmt, slideName } from './layouts.mjs';
import { deckPages } from './pages.mjs';
import { getDeck } from './decks.mjs';
import { chromePath } from './chrome.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : null).filter(Boolean));
const deck = await getDeck(args.deck ?? 'guide');
const { pages } = deckPages(deck);
const pngDir = path.join(ROOT, 'out', `${deck.file}-slides`);
if (!fs.existsSync(pngDir)) {
	throw new Error(`No slide PNGs in ${path.relative(ROOT, pngDir)}: build the deck first (node src/build.mjs --deck ${args.deck ?? 'guide'})`);
}

const sourceText = src => (typeof src === 'string' ? src.split(' | ')[0] : src.text);
const sourceUrl = src => (typeof src === 'string' ? src.split(' | ')[1] ?? '' : src.url ?? '');

// One entry per slide: the page of its last click, so the picture is complete.
const entries = [];
pages.forEach((p, i) => {
	if (p.reveal || !p.last) {
		return;
	}
	entries.push({ p, png: path.join(pngDir, `${String(i + 1).padStart(3, '0')}.png`) });
});

const sheet = entries.map(({ p, png }, k) => {
	const s = p.s;
	const clicks = s.clicks?.length ? `<div class="h-clicks"><div class="h-lbl">${s.clicks.length} clicks</div><ol>${s.clicks.map(c => `<li>${fmt(c.caption)}</li>`).join('')}</ol></div>` : '';
	const say = s.say ? `<div class="h-say"><div class="h-lbl">Say</div><div>${fmt(s.say)}</div></div>` : '';
	const notes = s.notes ? `<div class="h-notes">${fmt(s.notes)}</div>` : '';
	const sources = s.sources?.length ? `<div class="h-src"><div class="h-lbl">Sources</div>${s.sources.map(src => `<div>${esc(sourceText(src))}${sourceUrl(src) ? ` <span>${esc(sourceUrl(src))}</span>` : ''}</div>`).join('')}</div>` : '';
	const section = p.section.number ? `${p.section.number}  \u00b7  ${p.section.title}` : p.section.title !== deck.title ? p.section.title ?? '' : '';
	return `<section class="h-page"><div class="h-head"><span>${esc(deck.title)}</span><span>${esc(section)}</span><span>${k + 1} / ${entries.length}</span></div>
<img class="h-img" src="${pathToFileURL(png).href}">
<div class="h-side"><div class="h-layout"><code>${esc(s.layout)}${s.look ? `  \u00b7  ${esc(s.look)}` : ''}</code></div><div class="h-title">${esc(slideName(s))}</div>${say}${notes}${clicks}${sources}</div></section>`;
}).join('\n');

const css = `
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--sans); color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.h-page { position: relative; width: 1920px; height: 1080px; background: #f5f6f8; page-break-after: always; overflow: hidden; }
.h-head { position: absolute; left: 64px; right: 64px; top: 34px; display: flex; gap: 32px; font-size: 20px; color: var(--muted); }
.h-head span:nth-child(2) { flex: 1; color: var(--blue); font-weight: 600; letter-spacing: .12em; text-transform: uppercase; font-size: 17px; padding-top: 2px; }
.h-img { position: absolute; left: 64px; top: 96px; width: 1248px; height: 702px; border-radius: 14px; background: #fff; box-shadow: 0 0 0 1.5px #d3d8e0; }
.h-side { position: absolute; left: 1360px; top: 96px; width: 496px; bottom: 64px; display: flex; flex-direction: column; gap: 22px; overflow: hidden; }
.h-layout { padding-top: 4px; }
.h-layout code { display: inline-block; font-family: var(--mono); font-size: 22px; color: var(--blue); background: var(--blue-tint); padding: 6px 14px; border-radius: 8px; }
.h-title { font-size: 34px; font-weight: 600; line-height: 1.2; letter-spacing: -.01em; }
.h-lbl { font-size: 15px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.h-say { font-size: 23px; line-height: 1.4; color: var(--ink); }
.h-notes { font-size: 22px; line-height: 1.5; color: var(--body); }
.h-clicks ol { padding-left: 26px; font-size: 20px; line-height: 1.45; color: var(--body); }
.h-src { font-size: 17px; line-height: 1.4; color: var(--muted); }
.h-src span { color: var(--blue); word-break: break-all; }
code { font-family: var(--mono); font-size: .92em; }
.mark.t-blue { color: var(--blue); } .mark.t-green { color: var(--green); } .mark.t-red { color: var(--red); } .mark.t-orange { color: var(--orange); } .mark.t-purple { color: var(--purple); }
`;
const htmlPath = path.join(ROOT, 'build', `${deck.file}-handout.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(deck.title)}: handout</title><link rel="stylesheet" href="../theme/studio.css"><style>${css}</style></head><body>${sheet}</body></html>`);

const browser = await chromium.launch({ executablePath: chromePath(), headless: true, args: ['--headless=new'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(htmlPath).href);
await page.evaluate(async () => {
	await document.fonts.ready;
	await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
});
// Notes that don't fit the side column are a writing problem: report them, like the build does.
const clipped = await page.evaluate(() => [...document.querySelectorAll('.h-side')].map((el, i) => (el.scrollHeight > el.clientHeight + 2 ? i + 1 : 0)).filter(Boolean));
const out = path.join(ROOT, 'out', `${deck.file}-handout.pdf`);
await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
await page.screenshot({ path: path.join(ROOT, 'build', `${deck.file}-handout-first.png`) });
await browser.close();
console.log(`Handout: ${entries.length} pages -> ${path.relative(ROOT, out)}${clipped.length ? `\nNotes cut off on handout pages: ${clipped.join(', ')} (shorten the notes)` : ''}`);
