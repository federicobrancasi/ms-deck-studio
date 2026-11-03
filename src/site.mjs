// Builds the gallery website (GitHub Pages) into site/: one card per gallery example, and a viewer that flips through
// its pages with the arrow keys. The pages are the decks' own PNGs, scaled down to WebP (Chrome renders them, so no
// extra tools are needed). Build the gallery examples first (npm run gallery).
// Usage: npm run site   ->  site/index.html, site/<deck>/NNN.webp
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { chromePath } from './chrome.mjs';
import { getDeck } from './decks.mjs';
import { plain } from './layouts.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'site');
const REPO = 'https://github.com/federicobrancasi/ms-deck-studio';
const GALLERY = JSON.parse(fs.readFileSync(path.join(ROOT, 'gallery.json'), 'utf8'));
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath() });
const page = await browser.newPage();
const toWebp = async (src, dest, width) => {
	const data = `data:image/png;base64,${fs.readFileSync(src).toString('base64')}`;
	const b64 = await page.evaluate(async ([url, w]) => {
		const img = new Image();
		img.src = url;
		await img.decode();
		const c = document.createElement('canvas');
		c.width = w;
		c.height = Math.round(img.height * w / img.width);
		c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
		return c.toDataURL('image/webp', 0.86).split(',')[1];
	}, [data, width]);
	fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
};

const decks = [];
for (const g of GALLERY) {
	if (!fs.existsSync(path.join(ROOT, 'examples', `${g.deck}.mjs`))) {
		console.log(`site: ${g.deck} skipped (no example yet)`);
		continue;
	}
	const got = await getDeck(g.deck);
	const deck = got.deck ?? got, file = deck.file ?? g.deck;
	const dir = path.join(ROOT, 'out', `${file}-slides`);
	if (!fs.existsSync(dir)) {
		throw new Error(`site: out/${file}-slides/ is missing: run npm run gallery first`);
	}
	const pngs = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
	fs.mkdirSync(path.join(OUT, g.deck), { recursive: true });
	for (const f of pngs) {
		await toWebp(path.join(dir, f), path.join(OUT, g.deck, f.replace('.png', '.webp')), 1280);
	}
	decks.push({ id: g.deck, title: plain(deck.title ?? g.deck), world: g.world, blurb: g.blurb, real: !!g.real, pages: pngs.length,
		pdf: `${REPO}/raw/main/dist/examples/${file}.pdf`, src: `${REPO}/blob/main/examples/${g.deck}.mjs` });
	console.log(`site: ${g.deck} (${pngs.length} pages)`);
}
await browser.close();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ms-deck-studio gallery</title>
<style>
:root { --ink:#1b1b1f; --body:#5f6168; --muted:#72767e; --line:#e3e5ea; --blue:#0078d4; --bg:#f6f7f9; }
* { box-sizing: border-box; } body { margin: 0; font: 16px/1.5 "Segoe UI", Inter, system-ui, sans-serif; color: var(--ink); background: var(--bg); }
header { padding: 56px 6vw 24px; } h1 { margin: 0; font-size: 44px; font-weight: 600; letter-spacing: -.02em; }
header p { max-width: 760px; color: var(--body); font-size: 19px; } header a { color: var(--blue); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 28px; padding: 12px 6vw 64px; }
.card { background: #fff; border-radius: 14px; box-shadow: 0 0 0 1px var(--line); overflow: hidden; cursor: pointer; transition: box-shadow .15s; }
.card:hover { box-shadow: 0 0 0 2px var(--blue); } .card img { display: block; width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.card .b { padding: 16px 18px 18px; } .card h2 { margin: 0 0 4px; font-size: 19px; font-weight: 600; }
.world { font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); }
.card p { margin: 6px 0 0; color: var(--body); font-size: 15px; } .tag { display: inline-block; margin-left: 8px; padding: 1px 8px; border-radius: 8px; background: #e7f2e7; color: #107c10; font-size: 12px; font-weight: 600; letter-spacing: 0; text-transform: none; }
#v { position: fixed; inset: 0; background: rgba(20,20,24,.94); display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 9; }
#v.on { display: flex; } #v img { max-width: 92vw; max-height: 78vh; border-radius: 8px; background: #fff; }
#v .bar { margin-top: 18px; display: flex; gap: 14px; align-items: center; color: #fff; font-size: 15px; }
#v button, #v a { border: 0; border-radius: 10px; padding: 9px 16px; background: #fff; color: var(--ink); font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; }
#v .x { position: absolute; top: 18px; right: 22px; background: transparent; color: #fff; font-size: 28px; }
#v .strip { margin-top: 14px; display: flex; gap: 6px; max-width: 92vw; overflow-x: auto; padding-bottom: 6px; }
#v .strip img { height: 54px; width: auto; border-radius: 4px; opacity: .5; cursor: pointer; } #v .strip img.cur { opacity: 1; outline: 2px solid #fff; }
footer { padding: 0 6vw 48px; color: var(--muted); font-size: 14px; }
</style></head><body>
<header><h1>ms-deck-studio gallery</h1>
<p>Decks made with <a href="${REPO}">ms-deck-studio</a> and its agent skill. Each lives in one world, with one object that comes back on every slide. They show the bar, not a template: a new deck picks its own world and draws its own pictures. Click a deck to flip through it (arrow keys work).</p></header>
<div class="grid">${decks.map((d, i) => `<div class="card" data-i="${i}"><img src="${d.id}/001.webp" alt="${esc(d.title)}" loading="lazy"><div class="b"><div class="world">${esc(d.world)}${d.real ? '<span class="tag">real work</span>' : ''}</div><h2>${esc(d.title)}</h2><p>${esc(d.blurb)}</p></div></div>`).join('')}</div>
<footer>Not an official Microsoft product. In the made-up examples every name and number is invented. <a href="${REPO}">Source on GitHub</a></footer>
<div id="v"><button class="x" aria-label="Close">&times;</button><img id="vi" alt=""><div class="bar"><button id="pv">&larr;</button><span id="vn"></span><button id="nx">&rarr;</button><a id="pdf" target="_blank">PDF</a><a id="src" target="_blank">Source</a></div><div class="strip" id="st"></div></div>
<script>
const D = ${JSON.stringify(decks)};
const v = document.getElementById('v'), vi = document.getElementById('vi'), vn = document.getElementById('vn'), st = document.getElementById('st');
let d = null, k = 1;
const pad = n => String(n).padStart(3, '0');
function show() { vi.src = d.id + '/' + pad(k) + '.webp'; vn.textContent = d.title + '  \\u00b7  ' + k + ' / ' + d.pages; [...st.children].forEach((c, i) => c.classList.toggle('cur', i + 1 === k)); st.children[k - 1]?.scrollIntoView({ block: 'nearest', inline: 'center' }); }
function open(i) { d = D[i]; k = 1; document.getElementById('pdf').href = d.pdf; document.getElementById('src').href = d.src; st.innerHTML = ''; for (let p = 1; p <= d.pages; p++) { const t = document.createElement('img'); t.src = d.id + '/' + pad(p) + '.webp'; t.loading = 'lazy'; t.onclick = () => { k = p; show(); }; st.appendChild(t); } v.classList.add('on'); show(); }
document.querySelectorAll('.card').forEach(c => c.onclick = () => open(+c.dataset.i));
document.getElementById('pv').onclick = () => { if (k > 1) { k--; show(); } };
document.getElementById('nx').onclick = () => { if (k < d.pages) { k++; show(); } };
v.querySelector('.x').onclick = () => v.classList.remove('on');
document.addEventListener('keydown', e => { if (!v.classList.contains('on')) return; if (e.key === 'ArrowRight' && k < d.pages) { k++; show(); } if (e.key === 'ArrowLeft' && k > 1) { k--; show(); } if (e.key === 'Escape') v.classList.remove('on'); });
</script></body></html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`site: site/index.html (${decks.length} decks)`);
