// Checks every link in a built deck, so nothing on the slides leads to a dead page.
// Usage: node src/check-links.mjs --deck <name | path/to/deck.mjs>   (after a build of that deck, with PNGs and PDF)
//        add --offline to skip the web requests (QR codes and PDF links only)
// 1. Each QR code is read back from the slide PNG and must match the slide's link.
// 2. The PDF must hold a real link for each QR badge, with the same address (a PDF viewer would otherwise guess one).
// 3. Each address (QR links and sources) must open: status 200 and not a "Page not found" page. YouTube is checked with
//    its oEmbed lookup, X with fxtwitter (both block plain requests). Some sites block scripts: they count as "check by hand".
import fs from 'node:fs';
import path from 'node:path';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { getDeck } from './decks.mjs';
import { deckPages } from './pages.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : null).filter(Boolean));
const name = args.deck ?? 'guide';
const deck = await getDeck(name);
// Addresses that are expected to fail for now, with the reason (shown, but not counted as broken).
const PENDING = new Map();
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';

// The pages of the deck in build order (shared with build.mjs: clicks and poll reveals add pages).
const { pages } = deckPages(deck);
const pngDir = path.join(ROOT, 'out', `${deck.file}-slides`);
const pdfFile = path.join(ROOT, 'out', `${deck.file}.pdf`);
const problems = [];
const notes = [];

// ---------- 1. QR codes in the PNGs ----------
function decodeQr(file, region) {
	const png = PNG.sync.read(fs.readFileSync(file));
	const { x, y, w, h } = region ?? { x: 0, y: 0, w: png.width, h: png.height };
	const data = new Uint8ClampedArray(w * h * 4);
	for (let row = 0; row < h; row++) {
		const from = ((y + row) * png.width + x) * 4;
		data.set(png.data.subarray(from, from + w * 4), row * w * 4);
	}
	return jsQR(data, w, h)?.data;
}
let qrChecked = 0;
if (fs.existsSync(pngDir)) {
	pages.forEach((p, i) => {
		const wants = p.s.layout === 'end' ? [{ url: p.s.qr ?? p.s.url, region: { x: 1380, y: 260, w: 480, h: 520 } }]
				: p.s.link?.url ? [{ url: p.s.link.url, region: { x: 1260, y: 840, w: 600, h: 230 } }] : [];
		if (!wants.length) {
			return;
		}
		const file = path.join(pngDir, `${String(i + 1).padStart(3, '0')}.png`);
		if (!fs.existsSync(file)) {
			problems.push(`page ${i + 1}: no PNG to read the QR code from (build with PNGs first)`);
			return;
		}
		for (const want of wants) {
			const got = decodeQr(file, want.region) ?? (wants.length === 1 ? decodeQr(file) : null);
			qrChecked++;
			if (got !== want.url) {
				problems.push(`page ${i + 1}: the QR code reads "${got ?? 'nothing'}", not ${want.url}`);
			}
		}
	});
} else {
	notes.push(`no PNGs in ${path.relative(ROOT, pngDir)}: QR codes not checked`);
}

// ---------- 2. Links in the PDF ----------
// A small reader for the link annotations Chromium writes: /Subtype /Link with /A << /URI (...) >>.
function pdfLinks(file) {
	const raw = fs.readFileSync(file).toString('latin1');
	const pagesOrder = [];
	const objects = new Map();
	for (const m of raw.matchAll(/(\d+) 0 obj\s*([\s\S]*?)endobj/g)) {
		objects.set(Number(m[1]), m[2]);
	}
	// Page objects in document order, from the page tree.
	const kids = id => {
		const o = objects.get(id) ?? '';
		if (/\/Type\s*\/Page\b/.test(o)) {
			pagesOrder.push(id);
			return;
		}
		const k = /\/Kids\s*\[([^\]]*)\]/.exec(o);
		for (const ref of k ? k[1].matchAll(/(\d+) 0 R/g) : []) {
			kids(Number(ref[1]));
		}
	};
	const root = /\/Root\s+(\d+) 0 R/.exec(raw);
	const catalog = root ? objects.get(Number(root[1])) ?? '' : '';
	const top = /\/Pages\s+(\d+) 0 R/.exec(catalog);
	if (top) {
		kids(Number(top[1]));
	}
	const unescapePdf = s => s.replace(/\\([()\\])/g, '$1');
	return pagesOrder.map(id => {
		const o = objects.get(id) ?? '';
		const annots = /\/Annots\s*\[([^\]]*)\]/.exec(o);
		const urls = [];
		for (const ref of annots ? annots[1].matchAll(/(\d+) 0 R/g) : []) {
			const a = objects.get(Number(ref[1])) ?? '';
			const uri = /\/URI\s*\(((?:\\.|[^\\)])*)\)/.exec(a);
			if (uri) {
				urls.push(unescapePdf(uri[1]));
			}
		}
		return urls;
	});
}
let pdfChecked = 0;
if (fs.existsSync(pdfFile)) {
	const links = pdfLinks(pdfFile);
	if (links.length !== pages.length) {
		notes.push(`the PDF has ${links.length} pages, the deck ${pages.length}: PDF links not checked`);
	} else {
		pages.forEach((p, i) => {
			const wants = [p.s.layout === 'end' ? (p.s.qr ?? p.s.url) : p.s.link?.url].filter(Boolean);
			for (const want of wants) {
				pdfChecked++;
				if (!links[i].includes(want)) {
					problems.push(`page ${i + 1}: the PDF has no link to ${want} (links: ${links[i].join(', ') || 'none'})`);
				}
			}
		});
	}
} else {
	notes.push(`no PDF at ${path.relative(ROOT, pdfFile)}: PDF links not checked`);
}

// ---------- 3. Do the addresses open? ----------
const targets = new Map();
const add = (url, where, qr) => {
	if (!/^https?:\/\//.test(url ?? '')) {
		return;
	}
	const t = targets.get(url) ?? { where: [], qr: false };
	t.where.push(where);
	t.qr ||= qr;
	targets.set(url, t);
};
pages.forEach((p, i) => {
	if (p.reveal || !p.first) {
		return;
	}
	add(p.s.link?.url, `page ${i + 1}`, true);
	if (p.s.layout === 'end') {
		add(p.s.qr ?? p.s.url, `page ${i + 1}`, true);
	}
	for (const src of p.s.sources ?? []) {
		add(typeof src === 'string' ? src.split(' | ')[1] : src.url, `page ${i + 1} (source)`, false);
	}
});

async function opens(url, attempt = 0) {
	try {
		return await openOnce(url);
	} catch (e) {
		if (attempt < 2) {
			await new Promise(res => setTimeout(res, 1500 * (attempt + 1)));
			return opens(url, attempt + 1);
		}
		return { ok: true, manual: `no answer (${e.cause?.code ?? e.name})` };
	}
}

async function openOnce(url) {
	const u = new URL(url);
	{
		if (/(^|\.)youtube\.com$|^youtu\.be$/.test(u.hostname)) {
			const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(20000) });
			return r.ok ? { ok: true } : { ok: false, why: `YouTube says ${r.status}` };
		}
		if (/(^|\.)(x|twitter)\.com$/.test(u.hostname)) {
			const m = /^\/([^/]+)\/status\/(\d+)/.exec(u.pathname);
			if (!m) {
				return { ok: true, manual: 'an X page that is not a post' };
			}
			const r = await fetch(`https://api.fxtwitter.com/${m[1]}/status/${m[2]}`, { signal: AbortSignal.timeout(20000) });
			return r.ok ? { ok: true } : { ok: false, why: `X post not found (${r.status})` };
		}
		// Hacker News limits plain requests; its official API answers for items (null when the item doesn't exist).
		if (u.hostname === 'news.ycombinator.com' && u.pathname === '/item' && u.searchParams.get('id')) {
			const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${u.searchParams.get('id')}.json`, { signal: AbortSignal.timeout(20000) });
			const item = r.ok ? await r.json() : null;
			return item && !item.deleted && !item.dead ? { ok: true } : { ok: false, why: 'Hacker News item not found' };
		}
		for (let attempt = 0; attempt < 3; attempt++) {
			const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
			// 429 = too many requests; 419 is what Hacker News answers when asked too fast. Wait and try again.
			if (r.status === 429 || r.status === 419 || r.status >= 500) {
				await new Promise(res => setTimeout(res, 3000 * (attempt + 1)));
				continue;
			}
			if (r.status === 401 || r.status === 403) {
				return { ok: true, manual: `the site blocks scripts (${r.status})` };
			}
			if (!r.ok) {
				return { ok: false, why: `${r.status}` };
			}
			const text = (await r.text()).slice(0, 200000);
			const title = /<title[^>]*>([^<]*)/i.exec(text)?.[1]?.trim() ?? '';
			if (/page not found|\b404\b(?![.\d])|not be found|doesn.t exist|no longer available/i.test(title)) {
				return { ok: false, why: `"${title}"` };
			}
			return { ok: true };
		}
		return { ok: true, manual: 'the site kept saying "try later"' };
	}
}
let webChecked = 0;
if (!args.offline) {
	const list = [...targets.entries()];
	const results = new Map();
	// Sites that rate-limit get one request at a time with a pause; everything else runs six at a time.
	const slow = url => /(^|\.)(ycombinator\.com|reddit\.com)$/.test(new URL(url).hostname);
	const queue = list.filter(([url]) => !slow(url));
	const slowQueue = list.filter(([url]) => slow(url));
	let next = 0;
	await Promise.all([
		...Array.from({ length: 6 }, async () => {
			while (next < queue.length) {
				const [url] = queue[next++];
				results.set(url, await opens(url));
			}
		}),
		(async () => {
			for (const [url] of slowQueue) {
				results.set(url, await opens(url));
				await new Promise(res => setTimeout(res, 1200));
			}
		})(),
	]);
	for (const [url, t] of list) {
		const r = results.get(url);
		webChecked++;
		const where = t.where.length > 3 ? `${t.where.slice(0, 3).join(', ')} and ${t.where.length - 3} more` : t.where.join(', ');
		if (PENDING.has(url)) {
			notes.push(`waiting: ${url} (${PENDING.get(url)}), ${where}`);
		} else if (!r.ok) {
			(t.qr ? problems : notes).push(`${t.qr ? 'broken QR link' : 'broken source link'}: ${url} (${r.why}), ${where}`);
		} else if (r.manual) {
			notes.push(`check by hand: ${url} (${r.manual}), ${where}`);
		}
	}
}

const report = [
	`Links in ${deck.file}: ${qrChecked} QR codes read back, ${pdfChecked} PDF links checked, ${webChecked} addresses opened${args.offline ? ' (offline: none)' : ''}`,
	`Problems: ${problems.length ? problems.length : 'none'}`,
	...problems.map(p => `  ${p}`),
	...(notes.length ? ['Notes:', ...notes.map(n => `  ${n}`)] : []),
];
fs.writeFileSync(path.join(ROOT, 'out', `${deck.file}-links.txt`), report.join('\n') + '\n');
console.log(report.join('\n'));
process.exitCode = problems.length ? 1 : 0;
