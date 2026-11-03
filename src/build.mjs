// Builds a deck: slide content -> HTML -> checks -> PDF + one PNG per page + contact sheet + speaker notes.
// Usage: node src/build.mjs --deck <name | path/to/deck.mjs> [--no-png] [--no-pdf] [--no-deliver]
// A slide with `clicks` is drawn once per click: one click = the next PDF page.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { LAYOUTS as BASE_LAYOUTS, ROOT, esc, fmt, plain, pill, ic, qrSvg, slideName } from './layouts.mjs';
import { DIAGRAMS, logo } from './diagrams.mjs';
import { EXTRAS } from './extras.mjs';
import { CARDS } from './cards.mjs';
import { deckPages } from './pages.mjs';
import { loadDesigns } from './designs.mjs';
import { chromePath } from './chrome.mjs';
import { getDeck } from './decks.mjs';

// Built-in layouts, plus the design plugins in designs/ (one-off pictures: a signpost, a bridge, a gate...).
const BUILT_IN = { ...BASE_LAYOUTS, ...DIAGRAMS, ...CARDS, ...EXTRAS };
const PLUGINS = await loadDesigns(BUILT_IN);
const LAYOUTS = { ...BUILT_IN, ...Object.fromEntries(Object.entries(PLUGINS.designs).map(([name, d]) => [name, (s, ctx) => d.render(s, ctx)])) };
// Layouts that are mostly text in boxes. A section should be at least half diagrams, pictures and big single ideas.
const TEXTY = new Set(['checklist', 'steps', 'pillars', 'board', 'grid', 'matrix', 'split', 'term']);
// Layouts that draw their own clicks from ctx.step. Any other layout with `clicks` reveals its items one per click:
// REVEAL names the items for the common layouts; `reveal: '.css-selector'` on a slide names them for any other.
const STEP_AWARE = new Set(['convo', 'screens', 'branches', 'room', 'team']);
const REVEAL = {
	pillars: '.pillar', counters: '.counter', checklist: '.check-row', steps: '.step', pipeline: '.stage', journey: '.j-node',
	timeline: '.tl-item', grid: '.gcard', board: '.bcol', icons: '.icons-item', cycle: '.cy-node', lanes: '.ln-step',
};
// Layouts drawn without the header line and slide counter.
const BARE = new Set(['title', 'end', 'close', 'cover-branches']);

const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : null).filter(Boolean));
const deck = await getDeck(args.deck ?? 'guide');
// A deck can draw every section divider with one design plugin (deck.divider, e.g. 'divider-signpost'): the slides keep
// layout: 'section', so the time estimate and the checks still treat them as dividers.
const DIVIDER = deck.divider && PLUGINS.designs[deck.divider] ? deck.divider : null;
if (deck.divider && !DIVIDER) {
	throw new Error(`deck.divider: no design "${deck.divider}" in designs/`);
}
if (DIVIDER) {
	LAYOUTS.section = (s, ctx) => PLUGINS.designs[DIVIDER].render(s, ctx);
}
const drawnBy = layout => (layout === 'section' && DIVIDER ? DIVIDER : layout);
/** A cover or closing card has no header line or counter: the built-in ones, and any design that says bare: true. */
const isBare = layout => BARE.has(layout) || !!PLUGINS.designs[layout]?.bare;

// ---------- pages ----------

const { pages, slides: totalSlides } = deckPages(deck);
const total = pages.length;
// Section dividers show where we are among the parts that made it into this deck.
const parts = deck.parts ?? [...new Map(pages.filter(p => p.section.number).map(p => [p.section.id, p.section])).values()].map(sec => ({ id: sec.id, number: sec.number, title: sec.title, short: sec.short }));

// Minutes per part in this deck: about 1.3 minutes a slide, 4 for a poll (question plus reveal) or a live demo.
const MINUTES_PER = { slide: 1.3, interactive: 4 };
function slideMinutes(s) {
	if (typeof s.minutes === 'number') {
		return s.minutes;
	}
	const live = /live/i.test(typeof s.tag === 'object' ? s.tag?.text ?? '' : s.tag ?? '');
	return s.layout === 'poll' || live ? MINUTES_PER.interactive : s.layout === 'section' ? 0.5 : MINUTES_PER.slide;
}
const partMinutes = new Map();
for (const p of pages) {
	if (!p.reveal && p.first) {
		partMinutes.set(p.section.id, (partMinutes.get(p.section.id) ?? 0) + slideMinutes(p.s));
	}
}
// Core minutes per block (the running order of a long talk), for the title card's rows. The break counts in the total only.
const coreBlocks = [];
let coreTotal = 0;
for (const p of pages) {
	if (p.reveal || !p.first || p.s.tier !== 'C') {
		continue;
	}
	const m = slideMinutes(p.s);
	coreTotal += m;
	if (p.section.id === 'break' || !p.section.block) {
		continue;
	}
	const last = coreBlocks[coreBlocks.length - 1];
	if (last?.block === p.section.block) {
		last.minutes += m;
	} else {
		coreBlocks.push({ block: p.section.block, minutes: m });
	}
}
const hasBreak = pages.some(p => p.section.id === 'break' && p.s.tier === 'C');

// Pacing tags for long talks: what must stay, what can go if time is short, what goes first.
const TIERS = { C: { text: 'Core', tone: 'blue' }, N: { text: 'Optional', tone: 'purple' }, X: { text: 'Cut first', tone: 'orange' } };

/** The number shown for a part: its position among the parts in this deck (so a pruned deck counts 1, 2, 3). */
function partNumber(section) {
	const i = parts.findIndex(x => x.id === section.id);
	return i >= 0 ? String(i + 1).padStart(2, '0') : '';
}


function sourceText(src) {
	return typeof src === 'string' ? src.split(' | ')[0] : src.text;
}
function sourceUrl(src) {
	return typeof src === 'string' ? src.split(' | ')[1] ?? '' : src.url ?? '';
}

/** The bar under a click-by-click slide: numbered dots (done, now, next) and the caption of the current step. */
function stepBar(p) {
	const steps = p.s.clicks;
	if (!steps?.length || !p.step) {
		return '';
	}
	const dots = steps.map((st, k) => {
		const state = k + 1 < p.step ? 'done' : k + 1 === p.step ? 'now' : 'next';
		return `<span class="bs-dot ${state}" data-t>${k + 1}</span>`;
	}).join('');
	return `<div class="bs-bar"><span class="bs-dots">${dots}</span><span class="bs-cap" data-t>${fmt(steps[p.step - 1].caption)}</span></div>`;
}

function frame(p, inner, ctx) {
	const s = p.s;
	const bare = isBare(s.layout);
	const chrome = bare ? '' : `<div class="chrome-ref" data-t>${esc(p.section.ref ?? deck.ref)}</div><div class="chrome-count" data-t>${String(p.slideNo).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}</div>`;
	const tier = deck.showTiers && !bare ? `<div class="chrome-tier">${pill({ ...(TIERS[s.tier] ?? { text: s.tier ?? '?', tone: 'red' }), size: 's' })}${pill({ text: `${partNumber(p.section)} ${p.section.short ?? p.section.title}`.trim(), tone: 'neutral', size: 's' })}</div>` : '';
	// The "remember" line is no longer drawn: it goes into the speaker notes as "Say: ...".
	const link = s.link && !bare ? linkBadge(s.link) : '';
	const sourceItem = src => sourceUrl(src) ? `<a href="${esc(sourceUrl(src))}">${esc(sourceText(src))}</a>` : esc(sourceText(src));
	const sources = s.sources?.length ? `<div class="sources no-pill" data-t><b>Sources:</b> ${s.sources.map(sourceItem).join('  \u00b7  ')}</div>` : '';
	const progress = `<div class="progress"><i style="width:${((p.slideNo / totalSlides) * 100).toFixed(3)}%"></i></div>`;
	const steps = stepBar(p);
	const cls = `slide${s.bg ? ` bg-${s.bg}` : ''}${link ? ' has-link' : ''}${steps ? ' has-steps' : ''}`;
	const ownsClicks = STEP_AWARE.has(s.layout) || !!PLUGINS.designs[drawnBy(s.layout)]?.clicks;
	const reveal = p.step && !ownsClicks ? (s.reveal ?? REVEAL[s.layout]) : null;
	if (p.step && !ownsClicks && !reveal) {
		throw new Error(`Slide ${p.slideNo} (${s.id}): layout "${s.layout}" has clicks but no items to reveal (add reveal: '.css-selector', or give the design clicks: true and draw ctx.step)`);
	}
	const stepAttr = p.step ? ` data-step="${p.step}"${reveal ? ` data-reveal="${esc(reveal)}" data-reveal-from="${s.revealFrom ?? 1}"${s.keepPast ? ' data-keep-past' : ''}` : ''}` : '';
	return `<section class="${cls}" data-n="${ctx.n}" data-slide="${p.slideNo}"${stepAttr} data-id="${esc(s.id ?? '')}" data-layout="${s.layout}"${bare ? ' data-bare' : ''}${deck.wordBudget && !s.maxWords ? ` data-word-budget="${Number(deck.wordBudget)}"` : ''}${(s.maxWords ?? deck.maxWords) ? ` data-max-words="${Number(s.maxWords ?? deck.maxWords)}"` : ''}>${chrome}${tier}${inner}${steps}${link}${sources}${progress}</section>\n`;
}

/** "m:ss" or "h:mm:ss" for a number of seconds. */
function clock(seconds) {
	const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), sec = seconds % 60;
	return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
}

/** Seconds from a YouTube-style time ("549", "549s", "9m09s", "1h2m3s"). */
function seconds(t) {
	const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t ?? '');
	return m ? (Number(m[1] ?? 0) * 3600) + (Number(m[2] ?? 0) * 60) + Number(m[3] ?? 0) : null;
}

const SITES = {
	'github.com': 'GitHub', 'youtube.com': 'YouTube', 'youtu.be': 'YouTube', 'x.com': 'X', 'twitter.com': 'X',
	'docs.github.com': 'GitHub Docs', 'github.blog': 'GitHub blog', 'code.visualstudio.com': 'VS Code docs',
	'claude.com': 'Claude', 'platform.claude.com': 'Claude docs', 'support.claude.com': 'Claude help', 'claude.dev': 'Claude blog',
	'anthropic.com': 'Anthropic', 'openai.com': 'OpenAI', 'openrouter.ai': 'OpenRouter', 'supabase.com': 'Supabase docs',
	'arxiv.org': 'arXiv', 'news.ycombinator.com': 'Hacker News', 'reddit.com': 'Reddit',
};

/** Where a link goes, in words. Never a cut-off address: a PDF viewer would turn that into a broken link. */
export function linkWhere(l) {
	if (l.where) {
		return l.where;
	}
	let u;
	try {
		u = new URL(l.url);
	} catch {
		return '';
	}
	const host = u.hostname.replace(/^www\./, '');
	const parts = u.pathname.split('/').filter(Boolean);
	const t = seconds(u.searchParams.get('t') ?? (/(?:^|&)t=([^&]+)/.exec(u.hash.slice(1))?.[1]));
	const at = l.from ?? (t ? clock(t) : null);
	const from = at ? ` \u00b7 from ${at}` : '';
	if (host === 'github.com') {
		const repo = parts.slice(0, 2).join('/');
		const last = parts.length > 4 ? parts[parts.length - 1] : '';
		return `GitHub \u00b7 ${repo}${last ? ` \u00b7 ${last}` : ''}`;
	}
	if (host === 'x.com' || host === 'twitter.com') {
		return `X \u00b7 @${parts[0]}${from}`;
	}
	if (host.endsWith('youtube.com') || host === 'youtu.be') {
		return `YouTube${from}`;
	}
	if (host === 'code.visualstudio.com') {
		return parts[0] === 'blogs' ? 'VS Code blog' : parts[0] === 'updates' ? 'VS Code release notes' : 'VS Code docs';
	}
	return `${SITES[host] ?? host}${from}`;
}

/** A QR code with a short label in the bottom-right corner, and a real link in the PDF.
 * link: { url, label, logo (theme/logos slug), icon, caption, where (override the "where" line), from ('20:59' for a video
 * that can't start at a minute from its link, e.g. on X) } */
function linkBadge(l) {
	const mark = l.logo ? logo(l.logo, 26) : ic(l.icon ?? 'link', 24, 'var(--blue)');
	const video = /youtube\.com|youtu\.be|\.mp4$/.test(l.url) || !!l.from;
	const caption = l.caption ?? (video ? 'Scan or click to watch' : 'Scan or click to open');
	return `<a class="link-badge" href="${esc(l.url)}" data-t><span class="lb-text"><span class="lb-cap">${esc(caption)}</span><span class="lb-title">${mark}<span>${fmt(l.label)}</span></span><span class="lb-where">${esc(linkWhere(l))}</span></span>${qrSvg(l.url)}</a>`;
}

const PAGE_SCRIPT = `
// Click-by-click reveal: on step k the first (revealFrom + k - 1) items show, the newest one highlighted, earlier ones
// dimmed, later ones hidden but still in place (so nothing moves between clicks).
for (const slide of document.querySelectorAll('.slide[data-reveal]')) {
	const step = Number(slide.dataset.step), from = Number(slide.dataset.revealFrom);
	const shown = from + step - 1;
	const items = [...slide.querySelectorAll(slide.dataset.reveal)];
	items.forEach((el, i) => {
		const keep = slide.hasAttribute('data-keep-past');
		const state = i < shown - 1 ? (keep ? 'rv-kept' : 'rv-past') : i === shown - 1 ? 'rv-now' : 'rv-later';
		el.dataset.key = 'reveal-' + i;
		el.classList.add(state);
		// A connector right before an item (an arrow between two stages) shows and hides with it.
		const prev = el.previousElementSibling;
		if (i > 0 && prev && !items.includes(prev) && state !== 'rv-now') {
			prev.classList.add(state);
		}
	});
}
window.__fit = async () => {
	await document.fonts.ready;
	for (const el of document.querySelectorAll('[data-autofit]')) {
		const width = Number(el.dataset.autofit);
		let size = parseFloat(getComputedStyle(el).fontSize);
		const from = size;
		let guard = 0;
		while (el.scrollWidth > width + 0.5 && size > 14 && guard++ < 160) {
			size -= 1;
			el.style.fontSize = size + 'px';
		}
		if (guard) { el.dataset.shrunk = String(size); el.dataset.from = String(from); }
	}
	window.__READY__ = true;
};
window.__lint = () => {
	const out = [];
	for (const slide of document.querySelectorAll('.slide')) {
		const n = Number(slide.dataset.n);
		const sr = slide.getBoundingClientRect();
		const label = el => (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 60);
		for (const box of slide.querySelectorAll('[data-fit]')) {
			if (box.scrollWidth > box.clientWidth + 2 || box.scrollHeight > box.clientHeight + 2) {
				out.push({ n, kind: 'overflow', text: label(box) });
			}
		}
		for (const el of slide.querySelectorAll('.sources')) {
			if (el.scrollWidth > el.clientWidth + 1) out.push({ n, kind: 'sources line cut off (shorten the names or dates, or drop one; the notes keep every link)', text: label(el) });
		}
		const shown = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
		const texts = [...slide.querySelectorAll('[data-t]')].filter(el => shown(el) && el.textContent.trim());
		for (const el of texts) {
			const r = el.getBoundingClientRect();
			const x0 = r.left - sr.left, x1 = r.right - sr.left, y0 = r.top - sr.top, y1 = r.bottom - sr.top;
			if (x0 < 60 || x1 > 1860 || y0 < 24 || y1 > 1062) {
				out.push({ n, kind: 'outside the frame', text: label(el) });
			}
		}
		for (let i = 0; i < texts.length; i++) {
			for (let j = i + 1; j < texts.length; j++) {
				const a = texts[i], b = texts[j];
				if (a.contains(b) || b.contains(a)) continue;
				const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
				const ix = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
				const iy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
				if (ix > 3 && iy > 3) out.push({ n, kind: 'overlap', text: label(a) + '  <->  ' + label(b) });
			}
		}
		for (const el of slide.querySelectorAll('[data-shrunk]')) {
			const size = Number(el.dataset.shrunk), from = Number(el.dataset.from);
			if (size < from * 0.82 && !el.closest('.chrome-tier')) out.push({ n, kind: 'text shrunk from ' + from + 'px to ' + size + 'px to fit (shorten it)', text: label(el) });
		}
		for (const region of slide.querySelectorAll('.body, .stmt, .quote, .sec')) {
			const rr = region.getBoundingClientRect();
			let top = Infinity, bottom = -Infinity;
			for (const el of region.querySelectorAll('*')) {
				if (el.parentElement?.closest('.shot')) continue; // a cropped screenshot is clipped by its frame
				const r = el.getBoundingClientRect();
				if (!r.width || !r.height) continue;
				top = Math.min(top, r.top);
				bottom = Math.max(bottom, r.bottom);
			}
			if (top < rr.top - 2 || bottom > rr.bottom + 2) out.push({ n, kind: 'content taller than its area (cut text or items)', text: Math.round(top - sr.top) + '..' + Math.round(bottom - sr.top) + 'px, area ' + Math.round(rr.top - sr.top) + '..' + Math.round(rr.bottom - sr.top) + 'px' });
		}
		for (const m of slide.querySelectorAll('[data-missing]')) out.push({ n, kind: 'missing screenshot', text: m.dataset.missing });
		// Text drawn inside a shape (a diamond, a tag, a tile in an SVG) must stay inside it: mark the shape's box with
		// data-shape and put the text in it; the check compares their boxes (the overflow check can't see SVG shapes).
		for (const shape of slide.querySelectorAll('[data-shape]')) {
			const b = shape.getBoundingClientRect();
			for (const el of shape.querySelectorAll('[data-t]')) {
				if (!shown(el)) continue;
				const r = el.getBoundingClientRect();
				if (r.left < b.left - 2 || r.right > b.right + 2 || r.top < b.top - 2 || r.bottom > b.bottom + 2) out.push({ n, kind: 'text spills out of its drawn shape (shorten it or make the shape bigger)', text: label(el) });
			}
		}
		// Contrast of the text as drawn, on full-colour pages (bg: blue | dark), where a layout's grey can disappear.
		if (slide.classList.contains('bg-blue') || slide.classList.contains('bg-dark')) {
			const rgb = v => (v.match(/[\\d.]+/g) || []).slice(0, 4).map(Number);
			const lum = ([r, g, b]) => { const c = [r, g, b].map(x => x / 255).map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
			const page = rgb(getComputedStyle(slide).backgroundColor);
			for (const el of slide.querySelectorAll('[data-t]')) {
				if (!shown(el) || !el.textContent.trim() || el.closest('.sources, .chrome-ref, .chrome-count, .progress')) continue;
				// The colour under the text: the nearest ancestor with a solid background, else the page.
				// A design that draws the surface under its text in SVG says so with data-on="#hex" on the text or a parent.
				const onEl = el.closest('[data-on]');
				let bg = onEl ? (onEl.dataset.on.match(/[0-9a-f]{2}/gi) || []).map(h => parseInt(h, 16)) : page, up = onEl ? null : el;
				while (up && up !== slide) { const c = rgb(getComputedStyle(up).backgroundColor); if (c.length === 4 ? c[3] > 0.9 : c.length === 3) { bg = c; break; } up = up.parentElement; }
				const cs = getComputedStyle(el), fg = rgb(cs.color);
				if (Number(cs.opacity) < 0.5 || (fg.length === 4 && fg[3] < 0.5)) continue;
				const [x, y] = [lum(fg), lum(bg)].sort((a, b) => b - a);
				const ratio = (x + 0.05) / (y + 0.05);
				const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
				if (ratio < (large ? 3 : 4.5)) out.push({ n, kind: 'text hard to read on this coloured page (contrast ' + ratio.toFixed(1) + ':1)', text: label(el) });
			}
		}
		// macOS Preview draws a blurred shadow, or anything under a CSS filter, as a solid gray box in the PDF.
		const blurred = v => !!v && v !== 'none' && v.split(/,(?![^(]*\\))/).some(sh => ((sh.replace(/[a-z-]+\\([^)]*\\)/g, '').match(/-?[\\d.]+px/g) ?? []).map(parseFloat)[2] ?? 0) > 0);
		for (const el of slide.querySelectorAll('*')) {
			const cs = getComputedStyle(el);
			if (cs.visibility === 'hidden' || !el.getClientRects().length) continue;
			const inheritedText = el.parentElement && getComputedStyle(el.parentElement).textShadow === cs.textShadow;
			if (blurred(cs.boxShadow) || (blurred(cs.textShadow) && !inheritedText) || cs.filter !== 'none' || (cs.backdropFilter ?? 'none') !== 'none') {
				out.push({ n, kind: 'blurred shadow or filter (macOS Preview shows a gray box; use a sharp ring)', text: (el.getAttribute('class') || el.tagName.toLowerCase()) + (label(el) ? ': ' + label(el) : '') });
			}
		}
		// Words the audience has to read, besides the title. Chrome, sources, the link badge, code lines and labels (eyebrows,
		// numbered badges, small-caps labels, file names, initials) don't count.
		if (!['section', 'title', 'end', 'agenda', 'close', 'listen'].includes(slide.dataset.layout) && !slide.hasAttribute('data-bare')) {
			const skip = '.head, .chrome-ref, .chrome-count, .chrome-tier, .sources, .link-badge, .code-lines, .tx-body, .st-eyebrow, .st-badge, .lbl, .chat-label, .fx-name, .av, .beat-time, .sx-time, .sp-head, .bs-bar.all, .bs-dot, .nolint, .num';
			const counted = [...slide.querySelectorAll('[data-t]')].filter(el => !el.closest(skip) && shown(el));
			const set = new Set(counted);
			let words = 0;
			for (const el of counted) {
				let up = el.parentElement, nested = false;
				while (up && up !== slide) { if (set.has(up)) { nested = true; break; } up = up.parentElement; }
				// A number on its own (a chart value, a share, a delta) is data, not a word to read.
				if (!nested) words += (el.textContent || '').split(/\\s+/).filter(w => /[A-Za-z]/.test(w)).length;
			}
			slide.dataset.words = String(words);
			// [keep to, warn above]. A story may tell more; a conversation builds up one message per click and is read aloud.
			// A reference page (a table to look things up in, not a slide to read aloud) may set maxWords.
			// A deck's wordBudget lowers the limit everywhere except where the words are read aloud (a story, a conversation).
			const readAloud = { story: [45, 50], convo: [50, 60] }[slide.dataset.layout];
			const budget = slide.dataset.wordBudget ? [Number(slide.dataset.wordBudget), Number(slide.dataset.wordBudget)] : null;
			const limits = slide.dataset.maxWords ? [Number(slide.dataset.maxWords), Number(slide.dataset.maxWords)] : readAloud ?? budget ?? { cards: [35, 40], scorecard: [35, 40], bignumber: [35, 40], breakdown: [35, 40], versus: [35, 40], takeaways: [35, 40] }[slide.dataset.layout] ?? [25, 30];
			if (words > limits[1]) out.push({ n, kind: 'too much text: ' + words + ' words besides the title (keep it to ' + limits[0] + '; move the rest to the notes)', text: label(slide.querySelector('.st-title') || slide) });
		}
	}
	// Nothing may jump between the clicks of one slide: every element with data-key keeps its place on every page of
	// that slide (hidden elements keep their place too, so later clicks can reveal them in position).
	const bySlide = new Map();
	for (const slide of document.querySelectorAll('.slide[data-step]')) {
		const list = bySlide.get(slide.dataset.slide) ?? [];
		list.push(slide);
		bySlide.set(slide.dataset.slide, list);
	}
	for (const slides of bySlide.values()) {
		const seen = new Map();
		for (const slide of slides) {
			const sr = slide.getBoundingClientRect();
			for (const el of slide.querySelectorAll('[data-key]')) {
				const r = el.getBoundingClientRect();
				const box = [r.left - sr.left, r.top - sr.top, r.width, r.height].map(v => Math.round(v));
				const first = seen.get(el.dataset.key);
				if (!first) {
					seen.set(el.dataset.key, { box, n: Number(slide.dataset.n) });
				} else if (box.some((v, i) => Math.abs(v - first.box[i]) > 1)) {
					out.push({ n: Number(slide.dataset.n), kind: 'moves between clicks (keep it in place on every click)', text: el.dataset.key + ': ' + first.box.join(',') + ' on page ' + first.n + ', ' + box.join(',') + ' here' });
				}
			}
		}
	}
	return out;
};
window.__fit();
`;

// ---------- static checks ----------

function slideText(s) {
	const skip = new Set(['notes', 'sources', 'id', 'layout', 'tier', 'icon', 'tone', 'remember', 'code', 'src', 'lang', 'file', 'dir', 'answer', 'nosrc', 'defines', 'aliases', 'allowTerms', 'term', 'url', 'qr', 'link', 'say', 'bg', 'logo']);
	const parts = [];
	const walk = v => {
		if (typeof v === 'string') {
			parts.push(plain(v));
		} else if (Array.isArray(v)) {
			v.forEach(walk);
		} else if (v && typeof v === 'object') {
			for (const [k, x] of Object.entries(v)) {
				if (!skip.has(k)) {
					walk(x);
				}
			}
		}
	};
	walk(s);
	return parts.join(' \n ');
}

function staticChecks() {
	const out = [];
	// Statistics: thousands, percentages, multipliers, money, k/M suffixes, and numbers with 3+ digits that aren't years.
	const number = /\b\d{1,3}(?:[,'\u2019]\d{3})+\b|\b\d+(?:\.\d+)?\s?%|\b\d+(?:\.\d+)?\s?[x\u00d7](?![a-z])|[$\u20ac\u00a3]\s?\d|\bCHF\s?\d|\b\d+(?:\.\d+)?\s?(?:k|K|M|bn|million|billion)\b|\b(?!(?:19|20)\d\d\b)\d{3,}\b/;
	const terms = new Map();
	const addTerm = (name, at) => {
		for (const variant of [name, name.replace(/^(the|a|an)\s+/i, '')]) {
			const key = plain(variant).toLowerCase().trim();
			if (key && !terms.has(key)) {
				terms.set(key, at);
			}
		}
	};
	pages.forEach((p, i) => {
		if (p.reveal || !p.first) {
			return;
		}
		const s = p.s;
		if (s.layout === 'term') {
			addTerm(s.term, i);
			for (const a of s.aliases ?? []) {
				addTerm(a, i);
			}
		}
		for (const d of s.defines ?? []) {
			addTerm(d, i);
		}
		if (!isBare(s.layout) && s.layout !== 'section' && s.layout !== 'agenda' && !(s.nosrc ?? deck.nosrc) && !s.sources?.length && number.test(slideText(s))) {
			out.push({ n: i + 1, kind: 'number without a source', text: (slideText(s).match(number) ?? [''])[0] });
		}
		if (!s.notes && !isBare(s.layout)) {
			out.push({ n: i + 1, kind: 'no speaker notes', text: slideName(s).slice(0, 60) });
		}
		for (const [k, st] of (s.clicks ?? []).entries()) {
			if (!st.caption || !st.say) {
				out.push({ n: i + k + 1, kind: 'click without a caption or say line', text: `${slideName(s).slice(0, 40)}, step ${k + 1}` });
			}
		}
	});
	// A different design on every slide: neighbours differ, and a part uses a layout at most twice. A story's look counts
	// as its own design (story:road and story:number are different pictures).
	const design = s => s.layout + (s.look ? `:${s.look}` : '');
	const kept = pages.filter(p => !p.reveal && p.first);
	// A reference document (deck.variety: false, e.g. the guide) shows layouts on purpose, so it skips the variety checks.
	const variety = deck.variety !== false;
	kept.forEach((p, i) => {
		const prev = kept[i - 1];
		if (variety && prev && prev.section === p.section && design(prev.s) === design(p.s) && p.s.layout !== 'section') {
			out.push({ n: pages.indexOf(p) + 1, kind: 'same design as the previous slide (pick another layout)', text: design(p.s) });
		}
	});
	if (deck.showTiers) {
		// A short cut keeps only Core slides, so two Core slides with the same layout may end up side by side there.
		const core = kept.filter(p => p.s.tier === 'C');
		core.forEach((p, i) => {
			const prev = core[i - 1];
			if (prev && design(prev.s) === design(p.s) && p.s.layout !== 'section' && kept.indexOf(prev) !== kept.indexOf(p) - 1) {
				out.push({ n: pages.indexOf(p) + 1, kind: 'same design as the previous Core slide (they sit side by side in the short cut)', text: design(p.s) });
			}
		});
	}
	for (const sec of variety ? new Set(kept.map(p => p.section)) : []) {
		const own = kept.filter(p => p.section === sec && p.s.layout !== 'section');
		const seen = new Map();
		for (const p of own) {
			seen.set(design(p.s), (seen.get(design(p.s)) ?? 0) + 1);
			if (seen.get(design(p.s)) === 3) {
				out.push({ n: pages.indexOf(p) + 1, kind: 'layout used a third time in this part (use another design)', text: design(p.s) });
			}
		}
		const texty = own.filter(p => TEXTY.has(p.s.layout)).length;
		if (own.length >= 4 && texty * 2 > own.length) {
			out.push({ n: pages.indexOf(own[0]) + 1, kind: `text-box layouts on ${texty} of ${own.length} slides in this part (make at least half diagrams, pictures or big single ideas)`, text: sec.short ?? sec.title });
		}
	}
	// In a pruned deck (deck.filter, e.g. Core slides only), a kept slide may use a term whose explanation was cut.
	if (deck.filter) {
		const kept = new Set(pages.map(p => p.s));
		const cut = new Map();
		for (const sec of deck.sections) {
			for (const s of sec.slides) {
				if (kept.has(s)) {
					continue;
				}
				const names = [...(s.layout === 'term' ? [s.term, ...(s.aliases ?? [])] : []), ...(s.defines ?? [])];
				for (const name of names) {
					for (const variant of [name, name.replace(/^(the|a|an)\s+/i, '')]) {
						const key = plain(variant).toLowerCase().trim();
						if (key && !terms.has(key) && !cut.has(key)) {
							cut.set(key, `${sec.short ?? sec.title}, "${plain(s.title ?? s.term ?? s.id)}"`);
						}
					}
				}
			}
		}
		for (const [name, where] of cut) {
			const re = new RegExp(`(^|[^a-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(e?s)?($|[^a-z0-9])`);
			pages.forEach((p, i) => {
				if (!p.reveal && !(p.s.allowTerms ?? []).map(x => x.toLowerCase()).includes(name) && re.test(slideText(p.s).toLowerCase())) {
					out.push({ n: i + 1, kind: 'term used, but its explanation was cut', text: `"${name}" (explained in ${where})` });
				}
			});
		}
	}
	for (const [name, at] of terms) {
		const re = new RegExp(`(^|[^a-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(e?s)?($|[^a-z0-9])`);
		pages.slice(0, at).forEach((p, i) => {
			if (!p.reveal && p.first && !(p.s.allowTerms ?? []).map(x => x.toLowerCase()).includes(name) && re.test(slideText(p.s).toLowerCase())) {
				out.push({ n: i + 1, kind: 'term used before it is explained', text: `"${name}" (explained on slide ${at + 1})` });
			}
		});
	}
	return out;
}

function luminance(hex) {
	const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
	const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
	return (x + 0.05) / (y + 0.05);
}
function contrastReport() {
	const C = { ink: '#1b1b1f', body: '#5f6168', muted: '#72767e', blue: '#0078d4', green: '#107c10', red: '#d13438', orange: '#d83b01', purple: '#8661c5' };
	const tints = { blue: '#eef4fd', green: '#eef7ea', red: '#fbeeed', orange: '#fcf1ec', purple: '#f3effa' };
	const lines = [];
	for (const [name, hex] of Object.entries(C)) {
		const r = contrast(hex, '#ffffff');
		const onTint = tints[name] ? `, on its tint ${contrast(hex, tints[name]).toFixed(2)}` : '';
		lines.push(`${name.padEnd(7)} ${hex} on white ${r.toFixed(2)}${r >= 4.5 ? ' (AA)' : r >= 3 ? ' (AA large text only)' : ' (FAILS)'}${onTint}`);
	}
	// Full-colour backgrounds (bg: 'dark' | 'blue').
	const DARK = '#1b1b1f';
	const onDark = { white: '#ffffff', grey: '#a9adb6', blue: '#6cb8f6', green: '#7bd389', red: '#f1707b', orange: '#f7a35c', purple: '#b9a1e8' };
	lines.push(`on dark ${DARK}: ${Object.entries(onDark).map(([k, v]) => `${k} ${contrast(v, DARK).toFixed(2)}`).join(', ')}`);
	lines.push(`on blue #0078d4: white ${contrast('#ffffff', '#0078d4').toFixed(2)} (AA)`);
	// Agent colours (theme/extras.css): who is speaking in a conversation. Outside the meaning colours on purpose.
	const agentLight = { purple: '#8661c5', teal: '#03787c', magenta: '#b4009e', gold: '#8a6400', indigo: '#4f52b2', blue: '#0078d4' };
	const agentDark = { purple: '#b9a1e8', teal: '#5cc6c9', magenta: '#ef8fe0', gold: '#e8c25a', indigo: '#a9abff', blue: '#6cb8f6' };
	lines.push(`agents on white: ${Object.entries(agentLight).map(([k, v]) => `${k} ${contrast(v, '#ffffff').toFixed(2)}`).join(', ')}`);
	lines.push(`agents on dark ${DARK}: ${Object.entries(agentDark).map(([k, v]) => `${k} ${contrast(v, DARK).toFixed(2)}`).join(', ')}`);
	return lines;
}

// ---------- browser ----------

// ---------- main ----------

const buildDir = path.join(ROOT, 'build');
const outDir = path.join(ROOT, 'out');
const pngDir = path.join(outDir, `${deck.file}-slides`);
fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

let htmlBody = '';
for (const [i, p] of pages.entries()) {
	const layout = LAYOUTS[p.s.layout];
	if (!layout) {
		throw new Error(`Slide ${i + 1} (${p.section.id}): unknown layout "${p.s.layout}"`);
	}
	const ctx = { n: i + 1, total, sectionId: p.section.id, parts, reveal: p.reveal, minutes: Math.max(1, Math.round(partMinutes.get(p.section.id) ?? 0)), blocks: coreBlocks, coreTotal, hasBreak, step: p.step, steps: p.steps, slideNo: p.slideNo, totalSlides };
	htmlBody += frame(p, await layout(p.s, ctx), ctx);
}
const htmlPath = path.join(buildDir, `${deck.file}.html`);
fs.writeFileSync(htmlPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(deck.title)}</title><link rel="stylesheet" href="../theme/studio.css"><link rel="stylesheet" href="../theme/deck.css"><link rel="stylesheet" href="../theme/cards.css"><link rel="stylesheet" href="../theme/extras.css"><style>\n${process.env.DECK_FONT === 'inter' ? ':root { --sans: \'Inter\', system-ui, sans-serif; }\n' : ''}${[...new Set(pages.map(p => drawnBy(p.s.layout)))].map(name => PLUGINS.css[name]).filter(Boolean).join('\n')}\n</style></head><body>\n${htmlBody}<script>${PAGE_SCRIPT}</script></body></html>`);

const browser = await chromium.launch({ executablePath: chromePath(), headless: true, args: ['--headless=new', '--hide-scrollbars', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('requestfailed', r => {
	if (!/Aptos/.test(r.url())) {
		pageErrors.push(`${r.url()}: ${r.failure()?.errorText}`);
	}
});
await page.route('**/*', route => ['file:', 'data:'].includes(new URL(route.request().url()).protocol) ? route.continue() : route.abort());
await page.goto(pathToFileURL(htmlPath).href);
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 60000 });
const fonts = await page.evaluate(() => ({ aptos: [...document.fonts].some(f => f.family.replace(/"/g, '') === 'Aptos' && f.status === 'loaded') }));
const lint = [...(await page.evaluate(() => window.__lint())), ...staticChecks()].sort((a, b) => a.n - b.n);
// Words on each slide (its last click), as the check counts them: the title, labels, numbers and the chrome don't count.
const wordsPerSlide = await page.evaluate(() => { const m = new Map(); for (const el of document.querySelectorAll('.slide[data-words]')) m.set(el.dataset.slide, el.dataset.words); return [...m].map(([k, v]) => `${k}: ${v}`).join(', '); });
// Design files that don't load, or break the rules (unscoped CSS, soft shadows), are reported with the page they're on.
const usedDesigns = new Set(pages.map(p => drawnBy(p.s.layout)));
for (const pr of PLUGINS.problems) {
	const name = Object.keys(PLUGINS.owner).find(k => PLUGINS.owner[k] === pr.file && usedDesigns.has(k));
	if (name || !Object.values(PLUGINS.owner).includes(pr.file)) {
		lint.push({ n: 0, kind: pr.kind, text: pr.text });
	}
}

if (!args['no-pdf']) {
	await page.pdf({ path: path.join(outDir, `${deck.file}.pdf`), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
}
if (!args['no-png']) {
	fs.rmSync(pngDir, { recursive: true, force: true });
	fs.mkdirSync(pngDir, { recursive: true });
	const slides = page.locator('.slide');
	for (let i = 0; i < total; i++) {
		await slides.nth(i).screenshot({ path: path.join(pngDir, `${String(i + 1).padStart(3, '0')}.png`) });
	}
	// Contact sheet: every slide on one image, labelled with number, tier and section.
	const cols = Math.min(5, total);
	const thumbs = pages.map((p, i) => `<figure><img src="${pathToFileURL(path.join(pngDir, `${String(i + 1).padStart(3, '0')}.png`)).href}"><figcaption><b>${i + 1}</b> slide ${p.slideNo}${typeof p.step === 'number' ? `, click ${p.step}/${p.steps}` : ''} \u00b7 ${esc(slideName(p.s).slice(0, 48))}</figcaption></figure>`).join('');
	const contactPath = path.join(buildDir, `${deck.file}-contact.html`);
	fs.writeFileSync(contactPath, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../theme/studio.css"><style>body{margin:0;padding:32px;background:#eef0f3;font-family:var(--sans)} .g{display:grid;grid-template-columns:repeat(${cols},384px);gap:22px} figure{margin:0} img{width:384px;height:216px;display:block;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.12);background:#fff} figcaption{margin-top:7px;font-size:13px;color:#5f6168;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:384px} b{color:#1b1b1f}</style></head><body><div class="g">${thumbs}</div></body></html>`);
	await page.setViewportSize({ width: cols * 384 + (cols - 1) * 22 + 64, height: 800 });
	await page.goto(pathToFileURL(contactPath).href);
	await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => { }))));
	await page.screenshot({ path: path.join(outDir, `${deck.file}-contact.png`), fullPage: true });
}
await browser.close();

// Speaker notes with full source links: one entry per slide, with its PDF pages and one line per click.
const talkMinutes = Math.round(pages.filter(p => !p.reveal && p.first).reduce((a, p) => a + slideMinutes(p.s), 0) * 10) / 10;
const notes = [`# ${deck.title}: speaker notes\n`, `${totalSlides} slides, ${total} PDF pages (one page per click), about ${talkMinutes} minutes with the demos. Built ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC.\n`];
pages.forEach((p, i) => {
	if (p.reveal) {
		notes.push(`### ${i + 1}. (reveal of ${i})\n`);
		return;
	}
	if (!p.first) {
		return;
	}
	const s = p.s;
	const span = pages.filter(q => q.s === s).map(q => pages.indexOf(q) + 1);
	const where = span.length > 1 ? `PDF pages ${span[0]}\u2013${span[span.length - 1]}` : `PDF page ${span[0]}`;
	const minutes = typeof s.minutes === 'number' ? ` \u00b7 about ${s.minutes} min` : '';
	notes.push(`### ${p.slideNo}. ${slideName(s)}  \n_${where}${minutes}_\n`);
	if (s.say ?? s.remember) {
		notes.push(`**Say:** ${plain(s.say ?? s.remember)}\n`);
	}
	if (s.clicks?.length) {
		notes.push(s.clicks.map((st, k) => `${k + 1}. **${plain(st.caption)}** (page ${span[k] ?? span[0]}): ${plain(st.say)}`).join('\n') + '\n');
	}
	if (s.notes) {
		notes.push(`${s.notes}\n`);
	}
	if (s.sources?.length) {
		notes.push(`Sources:\n${s.sources.map(src => `- ${sourceText(src)}${sourceUrl(src) ? ` \u2014 ${sourceUrl(src)}` : ''}`).join('\n')}\n`);
	}
});
fs.writeFileSync(path.join(outDir, `${deck.file}-notes.md`), notes.join('\n'));

const report = [
	`${deck.title}: ${totalSlides} slides, ${total} pages`,
	`Font: ${fonts.aptos ? 'Aptos (from the local Office install)' : 'Aptos MISSING, falling back to Segoe UI / Inter'}`,
	...(pageErrors.length ? ['Page errors:', ...pageErrors.map(e => `  ${e}`)] : []),
	`Talk time: about ${talkMinutes} min (${MINUTES_PER.slide} min a slide, ${MINUTES_PER.interactive} for a poll or live demo${pages.some(p => typeof p.s.minutes === 'number') ? `; set: ${pages.filter(p => !p.reveal && p.first && typeof p.s.minutes === 'number').map(p => `slide ${p.slideNo} ${p.s.minutes}`).join(', ')}` : ''})`,
	`Words per slide (besides the title): ${wordsPerSlide || 'none counted'}`,
	`Designs: ${pages.filter(p => !p.reveal && p.first).map(p => p.s.layout + (p.s.look ? `:${p.s.look}` : '')).join(', ')}`,
	`Checks: ${lint.length ? `${lint.length} warning(s)` : 'clean'}`,
	...lint.map(w => `  page ${String(w.n).padStart(3)}  ${w.kind}: ${w.text}`),
	'Text colours (WCAG contrast):',
	...contrastReport().map(l => `  ${l}`),
	`Output: ${path.relative(ROOT, outDir)}/${deck.file}.pdf, ${deck.file}-contact.png, ${deck.file}-slides/, ${deck.file}-notes.md`,
];
// Optional delivery: copy only the files this run produced to a folder, under the names the deck gives them
// (deck.deliverDir, deck.deliverNames: { pdf, contact, notes }). Off unless the deck or DELIVER_DIR names a folder.
const deliverDir = process.env.DELIVER_DIR ?? deck.deliverDir;
if (!args['no-deliver'] && deck.deliver !== false && deliverDir) {
	fs.mkdirSync(deliverDir, { recursive: true });
	const names = deck.deliverNames ?? {};
	const fresh = [
		!args['no-pdf'] && [`${deck.file}.pdf`, names.pdf],
		!args['no-png'] && names.contact !== false && [`${deck.file}-contact.png`, names.contact],
		names.notes !== false && [`${deck.file}-notes.md`, names.notes],
	].filter(Boolean).map(([from, to]) => [from, to ?? from]);
	for (const [from, to] of fresh) {
		fs.copyFileSync(path.join(outDir, from), path.join(deliverDir, to));
	}
	report.push(`Delivered to ${deliverDir}: ${fresh.map(([, to]) => to).join(', ')}`);
}
fs.writeFileSync(path.join(outDir, `${deck.file}-checks.txt`), report.join('\n') + '\n');
console.log(report.join('\n'));
// --strict (CI): fail unless the checks are clean.
if (args.strict && !report.some(l => l === 'Checks: clean')) {
	process.exit(1);
}
