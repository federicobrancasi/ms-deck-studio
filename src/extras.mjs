// Layouts for agents and people working together, in the same look as layouts.mjs and diagrams.mjs: white, soft tints, Fluent icons,
// colour with meaning (blue neutral, green good, red bad, orange attention, purple the AI). Every text block carries
// data-t (checked for overflow, overlap and the safe area); labels that are names, not sentences, also carry
// class="nolint" so the word count skips them.
// Click-by-click layouts read ctx.step (1-based) and draw that state. Every element keeps its place on every step, so
// nothing jumps when the presenter clicks to the next page.
import fs from 'node:fs';
import path from 'node:path';
import { esc, fmt, ic, iconTile, pill, heading, body, bodyHeight, arrowHead, msLogo, ROOT, pngSize } from './layouts.mjs';
import { logo } from './diagrams.mjs';
import { LOGOS } from '../theme/logos/logos.mjs';

/** A brand mark if theme/logos has it, else a Fluent icon. */
const mark = (name, size, fallback = 'globe') => (name && LOGOS[name] ? logo(name, size) : ic(name && !LOGOS[name] ? name : fallback, size));

const W = 1728;
const r1 = v => Math.round(v * 10) / 10;

/** A path through points with rounded corners. */
function roundPath(pts, r = 20) {
	let d = `M ${r1(pts[0][0])} ${r1(pts[0][1])}`;
	for (let i = 1; i < pts.length - 1; i++) {
		const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
		const d1 = Math.hypot(x1 - x0, y1 - y0), d2 = Math.hypot(x2 - x1, y2 - y1);
		const rr = Math.min(r, d1 / 2, d2 / 2);
		const ax = x1 - ((x1 - x0) / d1) * rr, ay = y1 - ((y1 - y0) / d1) * rr;
		const bx = x1 + ((x2 - x1) / d2) * rr, by = y1 + ((y2 - y1) / d2) * rr;
		d += ` L ${r1(ax)} ${r1(ay)} Q ${r1(x1)} ${r1(y1)} ${r1(bx)} ${r1(by)}`;
	}
	const [xl, yl] = pts[pts.length - 1];
	return `${d} L ${r1(xl)} ${r1(yl)}`;
}

/** An arrow along points, with a head at the end. */
function arrow(pts, tone, { width = 4, dashed = false } = {}) {
	const color = tone === 'connector' ? 'var(--connector)' : `var(--${tone})`;
	const [x2, y2] = pts[pts.length - 1];
	const [x1, y1] = pts[pts.length - 2];
	return `<path d="${roundPath(pts)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dashed ? ' stroke-dasharray="2 12"' : ''}/>${arrowHead(x2, y2, x1, y1, color, width)}`;
}

/** An agent's face: a round purple tile with a bot, and a moon when it rests. */
function face(size, { tone = 'purple', sleeping = false } = {}) {
	const m = Math.round(size * 0.46);
	const moon = sleeping ? `<span class="ca-moon" style="width:${m}px;height:${m}px">${ic('moon', Math.round(size * 0.28))}</span>` : '';
	return `<span class="ca-face t-${tone}${sleeping ? ' asleep' : ''}" style="width:${size}px;height:${size}px">${ic('bot', Math.round(size * 0.56))}${moon}</span>`;
}

/** A person: a round blue tile. */
function personTile(size, tone = 'blue') {
	return `<span class="ca-face t-${tone}" style="width:${size}px;height:${size}px">${ic('person', Math.round(size * 0.56))}</span>`;
}

/** What an agent says on an arrow: a filled bubble in its colour, centred on (x, y). */
function speech(x, y, text, { tone = 'purple', icon = null, key = 'speech' } = {}) {
	return `<div class="ca-speech t-${tone}" data-key="${key}" style="left:${r1(x)}px;top:${r1(y)}px" data-t>${icon ? ic(icon, 26) : ''}<span>${fmt(text)}</span></div>`;
}

/** An agent in a conversation: a round tile in its own colour (theme/collab.css: who-purple, who-teal, ...). An event
 * row shows what happened (an icon) instead of the face. */
function agentAvatar(size, icon = 'bot') {
	return `<span class="cv-av" style="width:${size}px;height:${size}px">${ic(icon, Math.round(size * (icon === 'bot' ? 0.56 : 0.48)))}</span>`;
}

const at = (ctx, k) => ctx.step === k;
const from = (ctx, k) => ctx.step >= k;

// ---------- shared parts of dial and crowd (where an idea comes from) ----------
const AGENT_COLORS = ['purple', 'teal', 'magenta', 'gold', 'indigo'];

/** An SVG layer the size of the body, under the HTML parts. */
const hdSvg = (svg, H) => `<svg class="hd-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>`;

/** A shared message board as a small card: its icon (or logo) and name on top, messages from different agents in the middle
 * (centred in the space that is left), what was on it at the bottom. */
function hfBoard({ x, y, w, h, label, note, icon }) {
	const msgs = [72, 52, 64, 44].map((pct, i) => `<div class="hd-msg who-${AGENT_COLORS[(i * 2 + 1) % AGENT_COLORS.length]}">${agentAvatar(34)}<i style="width:${pct}%"></i></div>`).join('');
	return `<div class="hd-board" data-fit style="left:${r1(x)}px;top:${r1(y)}px;width:${w}px;height:${h}px"><div class="hd-board-t">${mark(icon, 44, 'chatMultiple')}<span class="lbl nolint" data-t>${fmt(label)}</span></div><div class="hd-msgs">${msgs}</div>${note ? `<div class="hd-board-s" data-t>${fmt(note)}</div>` : ''}</div>`;
}

/** The result, big: an icon, the number and what it means, centred on (cx, cy). */
function hfResult({ cx, cy, value, label, icon = 'rocket', w = 460, h = 300 }) {
	return `<div class="hd-result" style="left:${r1(cx - w / 2)}px;top:${r1(cy - h / 2)}px;width:${w}px;height:${h}px">${iconTile(icon, { tone: 'green', size: 104, round: true })}<span class="hd-result-v" data-t>${fmt(value)}</span><span class="hd-result-l" data-t>${fmt(label)}</span></div>`;
}

// ---------- the branch example (why a room suits open-ended tasks): `branches`, and the picture on `cover-branches` ----------
// Both draw the same example (s.branch, see examples/demo-talk.mjs). One agent takes one path and keeps going down it. Six agents take six.
// When they talk, any two of them, also far apart, mix their ideas into a new one in both their colours; then the mixes
// mix again (three or four colours), and the paths keep branching past the edge of the picture.
const ag = c => `var(--ag-${c})`;
const rad = d => (d * Math.PI) / 180;
const brSvg = (svg, w, h, defs = '') => `<svg class="br-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs ? `<defs>${defs}</defs>` : ''}${svg}</svg>`;
const brSpread = (n, a, b) => Array.from({ length: n }, (_, k) => (n === 1 ? (a + b) / 2 : a + (k * (b - a)) / (n - 1)));
const brMean = v => v.reduce((t, x) => t + x, 0) / v.length;
const brAt = (cx, cy, rx, ry, deg) => [cx + rx * Math.cos(rad(deg)), cy + ry * Math.sin(rad(deg))];
const keyAttr = key => (key ? ` data-key="${key}"` : '');

/** The ideas of the example, round by round: the six agents' own ideas; then a mix of any two of them (B.pairs); then each
 * mix mixes with the next two mixes, so it carries three or four colours. Every idea knows its colours and parents. */
function brGraph(B) {
	const g1 = B.agents.map((a, i) => ({ i, colors: [a.color], parents: [] }));
	const g2 = B.pairs.map(([a, b], i) => ({ i, colors: [B.agents[a].color, B.agents[b].color], parents: [g1[a], g1[b]] }));
	const g3 = [];
	g2.forEach((x, j) => [1, 2].forEach(d => {
		const y = g2[(j + d) % g2.length];
		g3.push({ i: g3.length, colors: [...new Set([...x.colors, ...y.colors])], parents: [x, y] });
	}));
	return { g1, g2, g3 };
}

/** Put ideas in slots in the order of their parents, so lines cross no more than the mixing needs. */
function brPlace(nodes, key, slots, set) {
	[...nodes].sort((a, b) => key(a) - key(b)).forEach((n, k) => set(n, slots[k], k));
}

/** Smooth curves that leave and arrive level (across) or upright (down). */
const brAcross = (xa, ya, xb, yb, k = 0.5) => { const d = (xb - xa) * k; return `M ${r1(xa)} ${r1(ya)} C ${r1(xa + d)} ${r1(ya)}, ${r1(xb - d)} ${r1(yb)}, ${r1(xb)} ${r1(yb)}`; };
const brDown = (xa, ya, xb, yb, k = 0.5) => { const d = (yb - ya) * k; return `M ${r1(xa)} ${r1(ya)} C ${r1(xa)} ${r1(ya + d)}, ${r1(xb)} ${r1(yb - d)}, ${r1(xb)} ${r1(yb)}`; };

/** A straight path from an idea off the right edge (to x), fading out: it keeps going. */
const brOn = (n, x, w, fade) => brCable(`M ${r1(n.x)} ${r1(n.y)} L ${r1(x)} ${r1(n.y)}`, n.colors, w, { casing: 0, fade });

/** A path in an idea's colours on a casing in the colour under it (paper), so crossings stay clean. Two colours make a
 * cable: the second inside the first. fade: the id of gradients that fade each colour out (a path that keeps going). */
function brCable(d, colors, w, { casing = 3, fade = null, dash = null, paper = '#fff' } = {}) {
	const stroke = c => (fade ? `url(#${fade}-${c})` : ag(c));
	const p = (st, sw) => `<path d="${d}" fill="none" stroke="${st}" stroke-width="${r1(sw)}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
	return (casing ? p(paper, w + 2 * casing) : '') + p(stroke(colors[0]), w) + (colors[1] ? p(stroke(colors[1]), w * 0.42) : '');
}

/** Gradients that fade every agent colour into the colour under it (to) along a line from a to b. */
function brFades(id, B, a, b, to = '#fff') {
	return B.agents.map(ag2 => `<linearGradient id="${id}-${ag2.color}" gradientUnits="userSpaceOnUse" x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"><stop offset="0" stop-color="${ag(ag2.color)}"/><stop offset="1" stop-color="${to}"/></linearGradient>`).join('');
}

/** An idea as a dot on a halo in the colour under it (paper): one colour, or a pie in all its colours. */
function brPie(colors, x, y, r, halo = 4, paper = '#fff') {
	let s = halo ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r + halo}" fill="${paper}"/>` : '';
	if (colors.length === 1) {
		return `${s}<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${ag(colors[0])}"/>`;
	}
	colors.forEach((c, k) => {
		const [xa, ya] = brAt(x, y, r, r, -90 + (360 * k) / colors.length), [xb, yb] = brAt(x, y, r, r, -90 + (360 * (k + 1)) / colors.length);
		s += `<path d="M ${r1(x)} ${r1(y)} L ${r1(xa)} ${r1(ya)} A ${r} ${r} 0 0 1 ${r1(xb)} ${r1(yb)} Z" fill="${ag(c)}"/>`;
	});
	return s;
}

/** An agent's own idea: a white pill in its colour, with its face (face 0: words only). Centred on (x, y). */
function brIdea(a, { x, y, size = 19, face = 30, key = null }) {
	return `<div class="br-idea who-${a.color}${face ? ' with-face' : ''}"${keyAttr(key)} style="left:${r1(x)}px;top:${r1(y)}px;font-size:${size}px">${face ? agentAvatar(face) : ''}<span class="nolint" data-t>${fmt(a.idea)}</span></div>`;
}

/** About how wide an idea's pill is (.br-idea in theme/collab.css): its words, from a rough width for each kind of letter,
 * plus the padding and the face. Close enough to space the pills with even gaps. */
function brIdeaW(a, size, face) {
	const em = [...a.idea].reduce((t, ch) => t + (/[ijlftr .,']/.test(ch) ? 0.28 : /[mwMW]/.test(ch) ? 0.8 : /[A-Z]/.test(ch) ? 0.62 : 0.53), 0);
	return em * size + 0.8 * size + (face ? 15 + face : 0.8 * size);
}

/** The task as a box (top-left at x, y). The build flags a label that spills out of it. */
function brTask(B, { x, y, w, h, key = null }) {
	return `<div class="br-task" data-fit${keyAttr(key)} style="left:${r1(x)}px;top:${r1(y)}px;width:${w}px;height:${h}px"><span class="lbl nolint" data-t>${fmt(B.task.label)}</span><span class="br-task-t" data-t>${fmt(B.task.text)}</span></div>`;
}

/** The task as a pill, centred on (x, y): on its own blue tint, or on bg. */
function brBanner(B, { x, y, bg = null }) {
	return `<div class="br-banner" style="left:${r1(x)}px;top:${r1(y)}px${bg ? `;background:${bg}` : ''}">${iconTile('target', { tone: 'blue', size: 42, round: true })}<span class="lbl nolint" data-t>${fmt(B.task.label)}</span><span class="br-banner-t" data-t>${fmt(B.task.text)}</span></div>`;
}

/** A small label in a colour (top-left at x, y): who works on the task. */
const brLbl = (text, x, y, { tone, key = null }) => `<span class="lbl br-lbl t-${tone}"${keyAttr(key)} style="left:${r1(x)}px;top:${r1(y)}px" data-t>${fmt(text)}</span>`;

/** How many paths after a round: the number big, the round small, centred on (x, y). */
function brRound(r, x, y, { tone = 'green', key = null } = {}) {
	return `<div class="br-round"${keyAttr(key)} style="left:${r1(x)}px;top:${r1(y)}px"><span class="br-round-v t-${tone}" data-t>${fmt(r.value)}</span><span class="lbl nolint" data-t>${fmt(r.label)}</span></div>`;
}

/** What the counts count, as a small grey label (top-left at x, y). */
const brCountLbl = (B, x, y) => `<span class="lbl br-lbl br-count-lbl" data-key="count" style="left:${r1(x)}px;top:${r1(y)}px" data-t>${fmt(B.count)}</span>`;

/** The colour key: a pie in three colours, and what it means. Left edge at x, centred on y. */
function brKey(B, x, y) {
	const c = [B.agents[0].color, B.agents[3].color, B.agents[4].color];
	return `<div class="br-key" data-key="key" style="left:${r1(x)}px;top:${r1(y)}px"><svg width="30" height="30" viewBox="0 0 30 30">${brPie(c, 15, 15, 13, 0)}</svg><span data-t>${fmt(B.key)}</span></div>`;
}

/** The family tree (branch design 3) as a picture in a box, with no counts: the task on top; the six agents' own ideas in
 * a row, with even gaps; each mix of any two of them, also far apart, with a line from each parent; mixes of mixes; and
 * lines that keep going and fade out at the bottom of the box. The rows keep design 3's proportions.
 * box: { x, y, w, h }; o: { id, paper (the colour under it: casings, halos and fades take it), size and face (the ideas'
 * text and face size; face 0 for words only), banner (the task's background), k (lines and dots, 1 as on design 3) }.
 * Returns the SVG, its gradients and the HTML, in the box's coordinates. */
function brTree(B, { x, y, w, h }, { id, paper = '#fff', size = 18, face = 28, banner = null, k = 1 }) {
	const G = brGraph(B), L = x, R = x + w, cx = x + w / 2;
	const y0 = y + 28, rest = h - 28, y1 = y0 + 0.185 * rest, y2 = y1 + 0.23 * rest, y3 = y2 + 0.221 * rest, yEnd = y + h;
	const ws = B.agents.map(a => brIdeaW(a, size, face));
	const gap = (w - ws.reduce((t, v) => t + v, 0)) / (ws.length - 1);
	let left = L;
	G.g1.forEach((n, i) => { Object.assign(n, { x: left + ws[i] / 2, y: y1 }); left += ws[i] + gap; });
	brPlace(G.g2, n => brMean(n.parents.map(p => p.x)), brSpread(9, L + 16, R - 16), (n, v) => Object.assign(n, { x: v, y: y2 }));
	brPlace(G.g3, n => brMean(n.parents.map(p => p.x)), brSpread(18, L, R), (n, v) => Object.assign(n, { x: v, y: y3 }));
	let svg = '';
	G.g1.forEach(n => { svg += brCable(brDown(cx, y0 + 10, n.x, n.y), n.colors, 6 * k, { paper }); });
	G.g2.forEach(n => n.parents.forEach(p => { svg += brCable(brDown(p.x, p.y, n.x, n.y), p.colors, 5 * k, { paper }); }));
	G.g3.forEach(n => n.parents.forEach(p => { svg += brCable(brDown(p.x, p.y, n.x, n.y), p.colors, 4 * k, { paper }); }));
	const ends = brSpread(36, L - 14, R + 14);
	[...G.g3].sort((a, b) => a.x - b.x).forEach((n, j) => [0, 1].forEach(t => {
		svg += brCable(brDown(n.x, n.y, ends[2 * j + t], yEnd, 0.55), [n.colors[(j + t) % n.colors.length]], 2.5 * k, { casing: 0, fade: id });
	}));
	G.g2.forEach(n => { svg += brPie(n.colors, n.x, n.y, r1(15 * k), 4, paper); });
	G.g3.forEach(n => { svg += brPie(n.colors, n.x, n.y, r1(9 * k), 3, paper); });
	const html = brBanner(B, { x: cx, y: y0, bg: banner }) + G.g1.map((n, i) => brIdea(B.agents[i], { x: n.x, y: n.y, size, face })).join('');
	return { svg, defs: brFades(id, B, [0, y3], [0, yEnd], paper), html };
}

/** The picture on the right of the cover: the tree from the branches layout, with no counts. s.look picks how it
 * sits on the page: card (in a rounded lavender card), open (on white, bigger, its lines fading off the bottom edge), or
 * half (on a lavender panel down the whole right half). */
function coverArt(s) {
	// open and half run off the bottom of the page: their lines stop just above the progress bar (6px).
	const lavender = 'var(--purple-tint)';
	const looks = {
		card: { panel: { x: 968, y: 118, w: 864, h: 844, r: 56 }, box: { x: 1012, y: 172, w: 776, h: 744 }, paper: lavender, banner: '#fff', size: 16, face: 0, k: 0.85 },
		open: { box: { x: 970, y: 150, w: 854, h: 922 }, paper: '#fff', size: 17, face: 26, k: 0.95 },
		half: { panel: { x: 960, y: 0, w: 960, h: 1080, r: 0 }, box: { x: 1024, y: 150, w: 832, h: 922 }, paper: lavender, banner: '#fff', size: 16, face: 24, k: 0.9 },
	};
	const L = looks[s.look ?? 'open'];
	if (!L) {
		throw new Error(`cover: unknown look "${s.look}" (one of: ${Object.keys(looks).join(', ')})`);
	}
	const t = brTree(s.branch, L.box, { id: `cv-${s.id}`, paper: L.paper, size: L.size, face: L.face, banner: L.banner, k: L.k });
	const p = L.panel;
	const panel = p ? `<div class="cv-panel" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;border-radius:${p.r}px"></div>` : '';
	return `<div class="cv-art">${panel}${brSvg(t.svg, 1920, 1080, t.defs)}${t.html}</div>`;
}

// ---------- shared parts of the slide before the chats (ix-*) ----------

/** Who takes part in a moment: you (the human) first when you do, then the agents, each in its colour. */
const ixWho = m => [...(m.you ? [{ name: 'You', color: 'blue', icon: 'person' }] : []), ...Object.entries(m.cast).map(([name, c]) => ({ name, color: c.color, icon: 'bot' }))];

/** A face in its colour (yours: a person), centred on (x, y), on a ring in the colour under it. */
const ixFace = (p, x, y, size) => `<span class="ix-face who-${p.color}" style="left:${r1(x)}px;top:${r1(y)}px">${agentAvatar(size, p.icon)}</span>`;

export const EXTRAS = {
	/** Title card: logo, eyebrow, the name, one line, the two parts of the talk, the speaker; on the right, the tree from
	 * the branches layout (coverArt; s.look: card, open or half). parts: [{ text, sub }], speaker: { initials, name }, branch: the
	 * example (same data as the branches layout). */
	'cover-branches'(s) {
		const parts = (s.parts ?? []).map((p, k) => `<div class="cv-part"><span class="cv-n" data-t>${k + 1}</span><div><div class="t" data-t>${fmt(p.text)}</div>${p.sub ? `<div class="s" data-t>${fmt(p.sub)}</div>` : ''}</div></div>`).join('');
		const speaker = s.speaker ? `<div class="cv-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span></div>` : '';
		const left = `<div class="cv-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow)}</div><div class="cv-title" data-t>${fmt(s.title)}</div><div class="cv-sub" data-t>${fmt(s.sub)}</div><div class="cv-parts">${parts}</div></div>`;
		return msLogo() + left + coverArt(s) + speaker;
	},

	// ---------- branches: why a room suits open-ended tasks, click by click ----------

	/** Branch design 1, a flow from left to right, built up click by click: (1) one agent picks one idea and keeps going;
	 * (2) a room of six agents tries six ideas at once; (3) they talk, and any two ideas, also far apart, mix into a new one
	 * in both colours; (4) the mixes mix again (three or four colours). The newest paths always run off the right edge and
	 * fade: they keep going. Under each column, the count of paths so far. */
	branches(s, ctx) {
		const H = bodyHeight(s), B = s.branch, G = brGraph(B), id = `bf-${s.id}`, step = ctx?.step ?? 4;
		const top = 30, bottom = 600, cy = (top + bottom) / 2, roundY = 656;
		const taskW = 290, taskH = 140, x1 = 500, x2 = 780, x3 = 1040, x4 = 1290, endX = W;
		// The one agent's idea (agent 0) takes a middle slot, so its path runs almost straight on from the task.
		const slots = brSpread(6, top + 30, bottom - 30);
		[2, 1, 0, 4, 3, 5].forEach((a, r) => Object.assign(G.g1[a], { x: x1, y: slots[r] }));
		brPlace(G.g2, n => brMean(n.parents.map(p => p.y)), brSpread(9, top + 14, bottom - 14), (n, y) => Object.assign(n, { x: x2, y }));
		brPlace(G.g3, n => brMean(n.parents.map(p => p.y)), brSpread(18, top + 4, bottom - 4), (n, y) => Object.assign(n, { x: x3, y }));
		const ideas = step === 1 ? [G.g1[0]] : G.g1;
		const defs = brFades(id, B, [step < 3 ? x2 : x3, 0], [endX - 30, 0]);
		let svg = '';
		ideas.forEach(n => { svg += brCable(brAcross(taskW - 30, cy, n.x, n.y), n.colors, 7); });
		if (step <= 2) {
			ideas.forEach(n => { svg += brOn(n, endX, 7, id); });
		} else {
			G.g2.forEach(n => n.parents.forEach(p => { svg += brCable(brAcross(p.x, p.y, n.x, n.y), p.colors, 5); }));
		}
		if (step === 3) {
			G.g2.forEach(n => { svg += brOn(n, endX, 5, id); });
		}
		if (step >= 4) {
			G.g3.forEach(n => n.parents.forEach(p => { svg += brCable(brAcross(p.x, p.y, n.x, n.y), p.colors, 5); }));
			const ends = brSpread(36, top - 14, bottom + 14);
			[...G.g3].sort((a, b) => a.y - b.y).forEach((n, k) => [0, 1].forEach(t => {
				svg += brCable(brAcross(n.x, n.y, endX, ends[2 * k + t], 0.55), [n.colors[(k + t) % n.colors.length]], 3, { casing: 0, fade: id });
			}));
			G.g3.forEach(n => { svg += brPie(n.colors, n.x, n.y, 9, 3); });
		}
		if (step >= 3) {
			G.g2.forEach(n => { svg += brPie(n.colors, n.x, n.y, 14); });
		}
		const lblY = cy - taskH / 2 - 34;
		const html = [
			step === 1 ? brLbl(B.one.label, 0, lblY, { tone: 'orange', key: 'who-one' }) : brLbl(B.room.label, 0, lblY, { tone: 'purple', key: 'who-room' }),
			brTask(B, { x: 0, y: cy - taskH / 2, w: taskW, h: taskH, key: 'task' }),
			...ideas.map(n => brIdea(B.agents[n.i], { x: n.x, y: n.y, key: `idea-${n.i}` })),
			brCountLbl(B, 0, roundY - 10),
			step === 1 ? brRound({ value: B.one.value, label: B.rounds[0].label }, x1, roundY, { tone: 'orange', key: 'round-one' }) : brRound(B.rounds[0], x1, roundY, { tone: 'purple', key: 'round-0' }),
		];
		[x2, x3, x4].forEach((x, k) => {
			if (step >= (k ? 4 : 3)) {
				html.push(brRound(B.rounds[k + 1], x, roundY, { key: `round-${k + 1}` }));
			}
		});
		if (step >= 3) {
			html.push(brKey(B, 1400, roundY));
		}
		return heading(s) + body(`<div class="br" style="height:${H}px">${brSvg(svg, W, H, defs)}${html.join('')}</div>`, { vcenter: false });
	},

	// ---------- Where the idea comes from: two one-page slides, no clicks ----------

	/** How much something improved: a speed dial from where it started (orange tick) to where it got (green), and on the
	 * right a card for the thing itself. s.dial: { from, to, start, value, ticks, big, label, unit ('\u00d7') },
	 * s.card: { site, icon, id, idIcon, name, sub, chips: [{ text, icon, tone }], challenge: { label, text } } */
	dial(s) {
		const H = bodyHeight(s);
		const G = s.dial, M = s.card, unit = G.unit ?? '\u00d7';
		const r = 330, sw = 58, cx = 440, cy = 446;
		const point = (t, rad) => {
			const a = Math.PI * (1 - (t - G.from) / (G.to - G.from));
			return [cx + rad * Math.cos(a), cy - rad * Math.sin(a)];
		};
		const [sx, sy] = point(G.start ?? G.from, r);
		const [vx, vy] = point(G.value, r);
		let svg = `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="var(--green-tint)" stroke-width="${sw}" stroke-linecap="round"/>`;
		svg += `<path d="M ${r1(sx)} ${r1(sy)} A ${r} ${r} 0 0 1 ${r1(vx)} ${r1(vy)}" fill="none" stroke="var(--green)" stroke-width="${sw}" stroke-linecap="round"/>`;
		const html = [];
		for (const t of G.ticks ?? []) {
			const [lx, ly] = point(t, r + sw / 2 + 34);
			const tone = t === (G.start ?? G.from) ? ' t-orange' : Math.round(G.value) === t ? ' t-green' : '';
			html.push(`<span class="hd-tick nolint${tone}" style="left:${r1(lx)}px;top:${r1(ly)}px" data-t>${t}${esc(unit)}</span>`);
		}
		const [nx, ny] = point(G.value, r - sw / 2 - 26);
		svg += `<line x1="${cx}" y1="${cy}" x2="${r1(nx)}" y2="${r1(ny)}" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="24" fill="var(--ink)"/>`;
		html.push(`<div class="hd-dial" style="left:${cx - 260}px;top:${cy + 42}px;width:520px"><span class="hd-dial-v" data-t>${fmt(G.big)}</span><span class="lbl nolint" data-t>${fmt(G.label)}</span></div>`);
		// The model, on the right: where it lives, its name, what it is, and the challenge.
		const cardX = 960, cardH = 540, cardTop = Math.round((H - cardH) / 2) - 18;
		const chips = M.chips.map(c => pill({ text: c.text, tone: c.tone ?? 'purple', icon: c.icon, white: true })).join('');
		html.push(`<div class="hd-model" data-fit style="left:${cardX}px;top:${cardTop}px;width:${W - cardX}px;height:${cardH}px"><div class="hd-model-site">${mark(M.icon, 46, 'globe')}<span class="lbl nolint" data-t>${fmt(M.site)}</span></div><div class="hd-model-id">${mark(M.idIcon, 30, 'cube')}<span data-t>${esc(M.id)}</span></div><div class="hd-model-name" data-t>${fmt(M.name)}</div><div class="hd-model-sub" data-t>${fmt(M.sub)}</div><div class="hd-model-chips">${chips}</div><div class="hd-model-goal">${iconTile('target', { tone: 'blue', size: 56, round: true })}<div><div class="lbl nolint" data-t>${fmt(M.challenge.label)}</div><div class="hd-model-goal-t" data-t>${fmt(M.challenge.text)}</div></div></div></div>`);
		return heading(s) + body(`<div class="hd" style="height:${H}px">${hdSvg(svg, H)}${html.join('')}</div>`, { vcenter: false });
	},

	/** How they did it: a crowd of 100 agents (one face each), an arrow into one shared board, a shorter arrow into the
	 * result. The whole picture is centred on the page. s.count: { value, label }, s.board: { label, note, icon },
	 * s.result: { value, label, icon } */
	crowd(s) {
		const H = bodyHeight(s);
		const D = { count: s.count, board: s.board, result: s.result };
		const n = 10, av = 36, cell = 46, gridW = n * cell - (cell - av);
		const headH = 104, top = Math.round((H - headH - gridW) / 2), gridTop = top + headH, midY = gridTop + gridW / 2;
		const boardW = 470, boardH = 370, gap = 24, toBoard = 150, toResult = 100, resultText = 232, resultW = 280;
		// Centre the picture: the grid, an arrow, the board, a shorter arrow, the result (its label is the widest part).
		const total = gridW + gap + toBoard + gap + boardW + gap + toResult + gap + resultText;
		const x0 = Math.round((W - total) / 2);
		const boardX = x0 + gridW + gap + toBoard + gap;
		const tipX = boardX + boardW + gap + toResult;
		const html = [`<div class="hd-count" style="left:${x0}px;top:${top}px;height:${headH - 28}px"><span class="hd-count-v" data-t>${fmt(D.count.value)}</span><span class="lbl nolint" data-t>${fmt(D.count.label)}</span></div>`];
		for (let row = 0; row < n; row++) {
			for (let c = 0; c < n; c++) {
				html.push(`<span class="hd-av who-${AGENT_COLORS[(row * 7 + c * 3 + row * c) % AGENT_COLORS.length]}" style="left:${x0 + c * cell}px;top:${gridTop + row * cell}px">${agentAvatar(av)}</span>`);
			}
		}
		html.push(hfBoard({ x: boardX, y: midY - boardH / 2, w: boardW, h: boardH, label: D.board.label, note: D.board.note, icon: D.board.icon }));
		html.push(hfResult({ cx: tipX + gap + resultText / 2, cy: midY, w: resultW, ...D.result }));
		const svg = arrow([[x0 + gridW + gap, midY], [boardX - gap, midY]], 'purple', { width: 6 }) + arrow([[boardX + boardW + gap, midY], [tipX, midY]], 'green', { width: 6 });
		return heading(s) + body(`<div class="hd" style="height:${H}px">${hdSvg(svg, H)}${html.join('')}</div>`, { vcenter: false });
	},

	/** How a room works, click by click: (1) the goal lands in every inbox; (2) they split the work, in speech bubbles;
	 * (3) a message wakes only the agent it is for; (4) that agent tests the change in its own copy and answers; (5) later
	 * the turns run out and you check their work; (6) what you can do next; (7) what I chose: one agent combines the copies.
	 * An agent that speaks gets a filled bubble; what it is doing is a plain line. Everything keeps its place on every click.
	 * s.room: { goal, agents: [{ name, model }], claims: [3], ask, reply, budget, used: [7], check, choices: [{ text, icon,
	 *   mine }], combine } */
	room(s, ctx) {
		const H = bodyHeight(s);
		const R = s.room;
		const k = ctx.step;
		const cardW = 400, gap = 44, cardTop = 190, cardH = 350, trayH = 74, trayW = 214;
		const x0 = W - (3 * cardW + 2 * gap);
		const cards = [0, 1, 2].map(i => x0 + i * (cardW + gap));
		const cx = cards.map(x => x + cardW / 2);
		const trayTop = cardTop - trayH / 2;
		const leftW = x0 - 110;
		const does = (text, icon) => ({ text, icon });
		// Per click: who has new mail, what each agent says or does, who works, who rests, whose copy changed.
		const S = [
			{ mail: [1, 1, 1], tone: 'blue', lines: [does('Reads the goal', 'mail'), does('Reads the goal', 'mail'), does('Reads the goal', 'mail')], active: [1, 1, 1] },
			{ lines: R.claims.map(says => ({ says })), active: [1, 1, 1] },
			{ mail: [0, 1, 0], tone: 'purple', lines: [does('Sent a message', 'send'), does('Woken by mail', 'mailUnread'), does('No mail: resting', 'moon')], active: [1, 1, 0], resting: [0, 0, 1], faded: [0, 0, 1] },
			{ mail: [1, 0, 0], tone: 'red', lines: [does('Reads the answer', 'mailUnread'), does('Tests the change', 'beaker'), does('No mail: resting', 'moon')], active: [1, 1, 0], resting: [0, 0, 1], faded: [0, 0, 1] },
			{ lines: [does('Resting', 'moon'), does('Resting', 'moon'), does('Resting', 'moon')], resting: [1, 1, 1], changed: true, usedUp: true },
			{ lines: [null, null, null], resting: [1, 1, 1], changed: true, usedUp: true },
			{ lines: [null, null, null], resting: [1, 1, 1], changed: true, usedUp: true },
		][k - 1];
		const html = [];
		// Left: you, the goal, what you say or choose, and the turn meter.
		html.push(`<div class="rm-you" data-key="you" style="left:0;top:40px">${personTile(68)}<span class="rm-you-name nolint" data-t>You</span></div>`);
		html.push(`<div class="rm-goal" data-key="goal" data-fit style="left:0;top:124px;width:${leftW}px"><span data-t>${fmt(R.goal)}</span></div>`);
		if (k === 5) {
			html.push(`<div class="rm-you-says" data-key="you-says" data-fit style="left:0;top:276px;width:${leftW}px"><span data-t>${fmt(R.check)}</span></div>`);
		}
		// Click 6 lists what you can do next; click 7 shows what I chose. Rows have a fixed height, so nothing moves.
		const choiceTop = 262, choiceLabelH = 20, choiceGap = 10, choiceH = 60;
		if (k >= 6) {
			const items = R.choices.map(c => {
				const cls = k === 6 ? ' open' : c.mine ? ' mine' : ' faded';
				return `<div class="rm-choice${cls}" data-fit>${ic(c.icon ?? 'arrowRight', 26)}<span data-t>${fmt(c.text)}</span></div>`;
			}).join('');
			html.push(`<div class="rm-choices" data-key="choices" style="left:0;top:${choiceTop}px;width:${leftW}px;gap:${choiceGap}px"><div class="lbl nolint" style="height:${choiceLabelH}px" data-t>You choose</div>${items}</div>`);
		}
		const used = R.used[k - 1];
		html.push(`<div class="rm-meter${S.usedUp ? ' used t-orange' : ' t-blue'}" data-key="meter" style="left:0;top:${H - 176}px;width:${leftW}px"><div class="rm-meter-head"><span class="lbl nolint" data-t>Turns used</span>${S.usedUp ? '<span class="rm-used nolint" data-t>Used up</span>' : ''}</div><div class="rm-meter-num nolint" data-t>${used}<span> / ${R.budget}</span></div><div class="rm-bar"><i style="width:${r1((used / R.budget) * 100)}%"></i></div></div>`);
		// The three agents: inbox on top, face and name, own copy, and what each one says or does.
		R.agents.forEach((a, i) => {
			const n = S.mail?.[i] ?? 0;
			const tone = S.tone ?? 'blue';
			const faded = !!S.faded?.[i];
			const badge = n ? `<span class="rm-badge t-${tone}" data-t>${n}</span>` : '';
			html.push(`<div class="rm-tray${n ? ` has t-${tone}` : ''}${faded ? ' faded' : ''}" data-key="tray-${i}" style="left:${cx[i] - trayW / 2}px;top:${trayTop}px;width:${trayW}px;height:${trayH}px">${ic('inbox', 34)}<span class="lbl nolint" data-t>Inbox</span>${badge}</div>`);
			let copy = '<span class="rm-copy-t nolint" data-t>Own copy of the code</span>';
			const failing = k === 4 && i === 1;
			if (failing) {
				copy = `<span class="rm-copy-t nolint" data-t>Own copy</span><span class="rm-result t-red" data-t>${ic('dismiss', 24)}1 test fails</span>`;
			} else if (S.changed) {
				copy = `<span class="rm-copy-t nolint" data-t>Own copy</span><span class="rm-result t-green nolint" data-t>${ic('check', 24)}Changed</span>`;
			}
			const L = S.lines[i];
			const line = !L ? `<div class="rm-line rm-status later" data-key="line-${i}"><span data-t>-</span></div>`
				: L.says ? `<div class="rm-line rm-say" data-key="line-${i}" data-fit><span data-t>${fmt(L.says)}</span></div>`
					: `<div class="rm-line rm-status" data-key="line-${i}" data-fit>${ic(L.icon, 28)}<span data-t>${fmt(L.text)}</span></div>`;
			const cls = `rm-card${S.active?.[i] ? ' active' : ''}${faded ? ' faded' : ''}`;
			html.push(`<div class="${cls}" data-key="card-${i}" style="left:${cards[i]}px;top:${cardTop}px;width:${cardW}px;height:${cardH}px"><div class="rm-who">${face(70, { sleeping: !!S.resting?.[i] })}<div><div class="rm-name nolint" data-t>${esc(a.name)}</div><div class="lbl rm-model nolint" data-t>${esc(a.model)}</div></div></div><div class="rm-copy${failing || S.changed ? ' marked' : ''}" data-key="copy-${i}"><span class="rm-copy-ic">${ic('folder', 30)}</span>${copy}</div>${line}</div>`);
		});
		// Arrows for this click only: the goal fans out, the question, the answer, the copies combined.
		let svg = '';
		const goalRail = 70, agentRail = 58;
		if (k === 1) {
			svg += `<path d="${roundPath([[x0 - 96, 180], [x0 - 52, 180], [x0 - 52, goalRail], [cx[2], goalRail]])}" fill="none" stroke="var(--blue)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
			for (const c of cx) {
				svg += arrow([[c, goalRail], [c, trayTop - 6]], 'blue', { width: 5 });
			}
			html.push(`<div class="rm-letter" data-key="letter" style="left:${cx[1] - 250}px;top:${goalRail - 44}px;width:500px;height:88px">${iconTile('mail', { tone: 'blue', size: 58, round: true })}<div><div class="lbl nolint" data-t>To: all agents</div><div class="rm-letter-t" data-t>${fmt(R.goal)}</div></div></div>`);
		}
		if (k === 3) {
			svg += arrow([[cards[0] + cardW - 60, cardTop - 2], [cards[0] + cardW - 60, agentRail], [cx[1] + 40, agentRail], [cx[1] + 40, trayTop - 6]], 'purple', { width: 5 });
			html.push(speech((cards[0] + cardW - 60 + cx[1] + 40) / 2, agentRail - 54, R.ask, { tone: 'purple', key: 'ask' }));
		}
		if (k === 4) {
			svg += arrow([[cards[1] + 60, cardTop - 2], [cards[1] + 60, agentRail], [cx[0] + 40, agentRail], [cx[0] + 40, trayTop - 6]], 'red', { width: 5 });
			html.push(speech((cards[1] + 60 + cx[0] + 40) / 2, agentRail - 54, R.reply, { tone: 'red', icon: 'bug', key: 'reply' }));
		}
		if (k === 7) {
			const barTop = cardTop + cardH + 46, barH = 92;
			for (const c of cx) {
				svg += arrow([[c, cardTop + cardH + 6], [c, barTop - 8]], 'green', { width: 5 });
			}
			// The choice I made, into the bar.
			const mine = Math.max(0, R.choices.findIndex(c => c.mine));
			const mineY = choiceTop + choiceLabelH + choiceGap + mine * (choiceH + choiceGap) + choiceH / 2;
			svg += arrow([[leftW + 6, mineY], [x0 - 40, mineY], [x0 - 40, barTop + barH / 2], [x0 - 10, barTop + barH / 2]], 'green', { width: 5 });
			html.push(`<div class="rm-merge" data-key="merge" data-fit style="left:${x0}px;top:${barTop}px;width:${W - x0}px;height:${barH}px">${face(60)}<span class="rm-merge-t" data-t>${fmt(R.combine)}</span><span class="rm-merge-arrow">${ic('arrowRight', 34)}</span><span class="rm-merge-out">${iconTile('folder', { tone: 'green', size: 52 })}<span class="lbl nolint" data-t>One copy</span></span></div>`);
		}
		return heading(s) + body(`<div class="rm" style="height:${H}px"><svg class="rm-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>${html.join('')}</div>`, { vcenter: false });
	},

	/** A full-colour slide that hands over to a live demo: a big line on the left, what to watch for on the right.
	 * watch: [{ icon, text }] */
	demo(s) {
		const items = s.watch.map(w => `<div class="dm-item"><span class="dm-ic">${ic(w.icon, 40)}</span><span class="dm-t" data-t>${fmt(w.text)}</span></div>`).join('');
		return `<div class="dm"><div class="dm-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow)}</div><div class="dm-title" data-t>${fmt(s.title)}</div>${s.sub ? `<div class="dm-sub" data-t>${fmt(s.sub)}</div>` : ''}</div><div class="dm-right"><div class="lbl dm-label" data-t>${fmt(s.watchLabel ?? 'Watch for')}</div>${items}</div></div>`;
	},

	// ---------- Before the chats: what the agents said to each other (three one-page designs, ix-*) ----------
	// s.moments: the four chats that follow, in order: [{ title (short), cast (as on its chat slide), you (the human takes
	// part), icon, room }]. Every face keeps the colour it has on its own chat slide.

	/** Design A, four cards: one per chat, light and dark like the chats themselves. Each card has its number and room, the
	 * moment's icon with a line to it from everyone who takes part, and a short title. */
	'moments-cards'(s) {
		const H = bodyHeight(s), M = s.moments, gap = 32, cw = (W - gap * (M.length - 1)) / M.length, top = 12, ch = H - 24;
		const iconY = 250, faceY = 430, fs = 84, cx = cw / 2;
		const cards = M.map((m, i) => {
			const who = ixWho(m), span = Math.min(cw - 72 - fs, (who.length - 1) * 100);
			const xs = brSpread(who.length, cx - span / 2, cx + span / 2);
			const lines = xs.map((x, k) => `<path class="who-${who[k].color}" d="${brDown(x, faceY, cx, iconY)}" fill="none" style="stroke:var(--who)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>`).join('');
			const faces = xs.map((x, k) => ixFace(who[k], x, faceY, fs)).join('');
			return `<div class="ix-card${i % 2 ? ' bg-dark' : ''}" style="left:${r1(i * (cw + gap))}px;top:${top}px;width:${r1(cw)}px;height:${ch}px"><svg class="ix-svg" width="${r1(cw)}" height="${ch}" viewBox="0 0 ${r1(cw)} ${ch}">${lines}</svg><span class="ix-n" data-t>${i + 1}</span><span class="lbl ix-room nolint" data-t>${fmt(m.room)}</span><span class="ix-icon" style="left:${r1(cx)}px;top:${iconY}px">${ic(m.icon, 64)}</span>${faces}<div class="ix-card-t" data-t>${fmt(m.title)}</div></div>`;
		}).join('');
		return heading(s) + body(`<div class="ix" style="height:${H}px">${cards}</div>`, { vcenter: false });
	},

	/** Design B, the inbox: the four chats as unread threads, in order. Each thread shows the faces that take part, a short
	 * title, who they are (in their colours), the room and the moment's icon. s.inbox: { title, note } */
	'moments-inbox'(s) {
		const H = bodyHeight(s), M = s.moments, w = 1520, barH = 88, rowH = 132, h = barH + rowH * M.length;
		const fs = 72, step = 46, most = Math.max(...M.map(m => ixWho(m).length));
		const rows = M.map((m, i) => {
			const who = ixWho(m);
			const faces = who.map((p, k) => `<span class="ix-stack-f who-${p.color}" style="left:${k * step}px">${agentAvatar(fs, p.icon)}</span>`).join('');
			const names = who.map(p => `<span class="who-${p.color}">${esc(p.name)}</span>`).join('<i>\u00b7</i>');
			return `<div class="ix-row" style="top:${barH + i * rowH}px;height:${rowH}px"><span class="ix-unread" data-t>${i + 1}</span><span class="ix-stack" style="width:${fs + step * (most - 1)}px">${faces}</span><div class="ix-row-main"><div class="ix-subj" data-t>${fmt(m.title)}</div><div class="ix-from nolint" data-t>${names}</div></div><span class="ix-tag nolint" data-t>${fmt(m.room)}</span><span class="ix-row-ic">${ic(m.icon, 34)}</span></div>`;
		}).join('');
		const bar = `<div class="ix-bar" style="height:${barH}px"><span class="ix-dots"><i></i><i></i><i></i></span><span class="ix-bar-t">${ic('inbox', 34)}<span data-t>${fmt(s.inbox.title)}</span></span><span class="ix-new nolint" data-t>${fmt(s.inbox.note)}</span></div>`;
		return heading(s) + body(`<div class="ix" style="height:${H}px"><div class="ix-win" style="left:${r1((W - w) / 2)}px;top:${r1((H - h) / 2)}px;width:${w}px;height:${h}px">${bar}${rows}</div></div>`, { vcenter: false });
	},

	/** Design C, listen in: a pause on a dark page. On the left the line to say; on the right a big speech bubble with the
	 * dots of someone typing, and around it every agent from the four chats, in its colour. Use with bg: 'dark'. */
	listen(s) {
		const people = [];
		for (const m of s.moments) {
			for (const p of ixWho(m)) {
				if (p.icon === 'bot' && !people.some(q => q.name === p.name)) {
					people.push(p);
				}
			}
		}
		const cx = 1400, cy = 540, rx = 360, ry = 300, fs = 92;
		const faces = people.map((p, k) => {
			const [x, y] = brAt(cx, cy, rx, ry, -90 + (360 * k) / people.length);
			return `${ixFace(p, x, y, fs)}<span class="ix-name who-${p.color} nolint" style="left:${r1(x)}px;top:${r1(y + fs / 2 + 12)}px" data-t>${esc(p.name)}</span>`;
		}).join('');
		const bubble = `<div class="ix-bubble" style="left:${cx}px;top:${cy}px"><i></i><i></i><i></i></div>`;
		const left = `<div class="ix-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow)}</div><div class="ix-big" data-t>${fmt(s.title)}</div>${s.sub ? `<div class="ix-sub" data-t>${fmt(s.sub)}</div>` : ''}</div>`;
		return `${left}<div class="ix-listen">${bubble}${faces}</div>`;
	},

	/** A conversation from a real room, one message per click, like a group chat: agents on the left in their own
	 * colour, you on the right. Every row is in place on every click: later rows are hidden, earlier ones fade, the new
	 * one is highlighted. look: 'light' | 'dark' (with bg: 'dark').
	 * cast: { name: { model, color: 'purple' | 'teal' | 'magenta' | 'gold' | 'indigo' } }, pinned: { icon, text },
	 * messages: [{ at (the click it appears on), who, tag, quote, src, basis }
	 *   | { at, you: true, tag, quote, src } | { at, you: true, tag, text }
	 *   | { at, event, who, icon }]
	 * An event (someone joins, someone asks) is as big as a message, in the agent's colour, with an icon instead of the face
	 * and no quote marks. A message from you is plain text (text, no quote marks) when your exact words aren't saved.
	 * basis: the agent's real words when the quote on the slide is reworded (npm run quotes checks the basis). */
	convo(s, ctx) {
		const k = ctx.step;
		const state = at => at < k ? 'past' : at === k ? 'now' : 'later';
		const cast = who => {
			const c = s.cast[who];
			if (!c) {
				throw new Error(`convo: "${who}" is not in the cast of ${s.id}`);
			}
			return c;
		};
		const rows = s.messages.map((m, i) => {
			const st = state(m.at);
			if (m.event) {
				return `<div class="cv-row event who-${cast(m.who).color} ${st}" data-key="row-${i}">${agentAvatar(76, m.icon ?? 'info')}<div class="cv-main"><div class="cv-bubble" data-fit><span data-t>${fmt(m.event)}</span></div></div></div>`;
			}
			const tag = m.tag ? `<span class="cv-tag nolint" data-t>${fmt(m.tag)}</span>` : '';
			const bubble = `<div class="cv-bubble" data-fit><span data-t>${fmt(m.quote ?? m.text)}</span></div>`;
			if (m.you) {
				return `<div class="cv-row you ${st}" data-key="row-${i}"><div class="cv-main"><div class="cv-who">${tag}<span class="cv-name nolint" data-t>You</span></div>${bubble}</div>${personTile(76)}</div>`;
			}
			const c = cast(m.who);
			return `<div class="cv-row agent who-${c.color} ${st}" data-key="row-${i}">${agentAvatar(76)}<div class="cv-main"><div class="cv-who"><span class="cv-name nolint" data-t>${esc(m.who)}</span><span class="cv-model nolint" data-t>${esc(c.model)}</span>${tag}</div>${bubble}</div></div>`;
		}).join('');
		const pin = s.pinned ? `<div class="cv-pin" data-key="pin">${ic(s.pinned.icon ?? 'pin', 26)}<span data-t>${fmt(s.pinned.text)}</span></div>` : '';
		// Rows start at the top, so a short conversation sits where a long one starts.
		return heading(s) + body(`<div class="cv ${s.look ?? 'light'}">${pin}<div class="cv-rows">${rows}</div></div>`, { vcenter: false });
	},

	/** A small team, click by click: you ask the Lead; the Lead gives each engineer a task; they report back; the Lead
	 * accepts one and sends the other back; the fix is accepted and the Lead answers you.
	 * Whatever changes on a click is highlighted. s.team: { ask, answer, worker: { task, report, fixed }, scout: { task,
	 * report }, rework } */
	team(s, ctx) {
		const H = bodyHeight(s);
		const T = s.team;
		const k = ctx.step;
		const html = [];
		let svg = '';
		// Two frames: your chat (you and the Lead), and the teammates' own chats.
		const chatW = 760, mateX = 900;
		html.push(`<div class="tm-frame t-blue" data-key="frame-you" style="left:0;top:0;width:${chatW}px;height:${H}px"><div class="lbl tm-frame-label" data-t>${ic('chat', 24)}Your chat</div></div>`);
		html.push(`<div class="tm-frame t-purple" data-key="frame-mates" style="left:${mateX}px;top:0;width:${W - mateX}px;height:${H}px"><div class="lbl tm-frame-label" data-t>${ic('chatMultiple', 24)}Teammate chats</div></div>`);
		// You, your request and the final answer.
		const youX = 50, youY = 300, youTile = 96;
		html.push(`<div class="tm-you" data-key="you" style="left:${youX}px;top:${youY}px">${personTile(youTile)}<div class="tm-you-name nolint" data-t>You</div></div>`);
		html.push(`<div class="tm-say ask${at(ctx, 1) ? ' now' : ''}" data-key="ask" style="left:40px;top:84px;width:${chatW - 80}px" data-fit><span data-t>${fmt(T.ask)}</span></div>`);
		html.push(`<div class="tm-say answer t-green${from(ctx, 5) ? ' now' : ' later'}" data-key="answer" style="left:40px;top:${H - 136}px;width:${chatW - 80}px" data-fit>${ic('checkmark', 30)}<span data-t>${fmt(T.answer)}</span></div>`);
		// The Lead.
		const leadX = 300, leadY = 220, leadW = 420, leadH = 250;
		const leadStatus = ['Plans the work', 'Assigns tasks', 'Gets reports', 'Reviews them', 'Combines, answers'][k - 1];
		html.push(`<div class="tm-card lead t-blue${k === 2 || k === 4 ? ' now' : ''}" data-key="lead" style="left:${leadX}px;top:${leadY}px;width:${leadW}px;height:${leadH}px"><div class="tm-top">${iconTile('crown', { tone: 'blue', size: 64, round: true })}<div><div class="tm-name nolint" data-t>Lead</div><div class="lbl nolint" data-t>Plans and reviews</div></div></div><div class="tm-status" data-fit>${ic('clipboard', 26)}<span data-t>${fmt(leadStatus)}</span></div></div>`);
		// The Worker and the Scout.
		const mates = [
			{ id: 'worker', name: 'Worker', role: 'Implements and tests', icon: 'wrenchScrewdriver', y: 96 },
			{ id: 'scout', name: 'Scout', role: 'Researches and explores', icon: 'search', y: 396 },
		];
		const mateW = 700, mateH = 210, mateCardX = mateX + 64;
		const state = {
			worker: ['Waiting for a task', 'Assigned', 'Report sent', 'Needs rework', 'Accepted'][k - 1],
			scout: ['Waiting for a task', 'Assigned', 'Report sent', 'Accepted', 'Accepted'][k - 1],
		};
		const stateTone = v => v === 'Accepted' ? 'green' : v === 'Needs rework' ? 'red' : v === 'Waiting for a task' ? 'neutral' : 'blue';
		const stateIcon = v => v === 'Accepted' ? 'check' : v === 'Needs rework' ? 'undo' : v === 'Report sent' ? 'docCheck' : v === 'Assigned' ? 'clipboard' : 'hourglass';
		for (const m of mates) {
			const st = state[m.id];
			// The line under each teammate: its task (click 2), its report (click 3), then the review result.
			const R = T[m.id];
			let line = { icon: 'clipboard', text: R.task, cls: k === 2 ? ' now' : '' };
			if (k === 1) {
				line = { icon: 'clipboard', text: R.task, cls: ' later' };
			} else if (k === 3 || (k >= 4 && m.id === 'scout')) {
				line = { icon: 'docCheck', text: R.report, cls: k === 3 ? ' now' : '' };
			}
			if (k === 4 && m.id === 'worker') {
				line = { icon: 'undo', text: T.rework, cls: ' rework t-red now' };
			}
			if (k === 5 && m.id === 'worker') {
				line = { icon: 'docCheck', text: R.fixed, cls: ' fixed t-green now' };
			}
			const changedPill = (k === 4 && m.id === 'scout') || (k === 5 && m.id === 'worker');
			html.push(`<div class="tm-card mate t-purple" data-key="${m.id}" style="left:${mateCardX}px;top:${m.y}px;width:${mateW}px;height:${mateH}px"><div class="tm-top">${iconTile(m.icon, { tone: 'purple', size: 64, round: true })}<div><div class="tm-name nolint" data-t>${m.name}</div><div class="lbl nolint" data-t>${m.role}</div></div><span class="tm-state nolint${changedPill ? ' now' : ''}">${pill({ text: st, tone: stateTone(st), icon: stateIcon(st), size: 's' })}</span></div><div class="tm-task${line.cls}" data-key="task-${m.id}" data-fit>${ic(line.icon, 24)}<span data-t>${fmt(line.text)}</span></div></div>`);
		}
		// Arrows for this step: the request, the tasks, the reports, the review, the answer.
		const leadR = leadX + leadW, wy = mates[0].y + mateH / 2, sy = mates[1].y + mateH / 2;
		const midX = (leadR + mateCardX) / 2;
		const toMate = (y, yFrom, tone, lift = 0) => arrow([[leadR + 8, yFrom], [midX - lift, yFrom], [midX - lift, y], [mateCardX - 10, y]], tone, { width: 5 });
		const toLead = (y, yTo, tone, lift = 0) => arrow([[mateCardX - 8, y], [midX + lift, y], [midX + lift, yTo], [leadR + 10, yTo]], tone, { width: 5 });
		if (k === 1) {
			// You sit level with the Lead, so the request goes straight across into its left side.
			const youCY = youY + youTile / 2;
			svg += arrow([[youX + youTile + 16, youCY], [leadX - 12, youCY]], 'blue', { width: 5 });
		}
		if (k === 2) {
			svg += toMate(wy - 24, leadY + 70, 'blue', 18) + toMate(sy - 24, leadY + leadH - 70, 'blue', 18);
		}
		if (k === 3) {
			svg += toLead(wy + 24, leadY + 90, 'purple', 18) + toLead(sy + 24, leadY + leadH - 90, 'purple', 18);
		}
		if (k === 4) {
			svg += toMate(wy - 24, leadY + 70, 'red', 18);
		}
		if (k === 5) {
			svg += toLead(wy + 24, leadY + 90, 'green', 18);
			const leadCX = leadX + leadW / 2;
			svg += arrow([[leadCX, leadY + leadH + 10], [leadCX, H - 168]], 'green', { width: 5 });
		}
		return heading(s) + body(`<div class="tm" style="height:${H}px"><svg class="tm-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>${html.join('')}</div>`, { vcenter: false });
	},

	/** Two screenshots side by side, one per click: (1) where you click; (2) what you get, with a ring on the spot you
	 * clicked and an arrow from it. The widths add up to the page with a gap for the arrow.
	 * shots: [{ src, alt, label, width, ring: [x, y, w, h] in the image's own pixels }, { src, alt, label, width }] */
	screens(s, ctx) {
		const k = ctx.step;
		const H = bodyHeight(s);
		const labelH = 34, labelGap = 18;
		const shots = s.shots.map(sh => {
			const file = path.join(ROOT, sh.src);
			if (!fs.existsSync(file)) {
				return { ...sh, missing: true, w: sh.width, h: Math.round(sh.width * 0.56), scale: 1 };
			}
			const size = pngSize(file);
			return { ...sh, rel: path.relative(path.join(ROOT, 'build'), file), w: sh.width, h: Math.round(size.height * sh.width / size.width), scale: sh.width / size.width };
		});
		const x = [0, W - shots[1].w];
		const top = shots.map(sh => Math.round((H - labelH - labelGap - sh.h) / 2) + labelH + labelGap);
		const html = shots.map((sh, i) => {
			const later = i === 1 && k < 2 ? ' later' : '';
			const label = `<div class="sc-label${later}" data-key="label-${i}" style="left:${x[i]}px;top:${top[i] - labelH - labelGap}px"><span class="sc-n t-${i ? 'green' : 'blue'}" data-t>${i + 1}</span><span data-t>${fmt(sh.label)}</span></div>`;
			const img = sh.missing
				? `<div class="ph" data-t>${fmt(`Screenshot: ${sh.alt ?? sh.src}`)}</div>`
				: `<img src="${esc(sh.rel)}" alt="${esc(sh.alt ?? '')}">`;
			return `${label}<div class="shot sc-shot${sh.missing ? ' missing' : ''}${later}"${sh.missing ? ` data-missing="${esc(sh.src)}"` : ''} data-key="shot-${i}" style="left:${x[i]}px;top:${top[i]}px;width:${sh.w}px;height:${sh.h}px">${img}</div>`;
		});
		// On the second click: a ring on the spot you clicked, and an arrow from it to what you get.
		let svg = '';
		const a = shots[0];
		if (a.ring && k === 2) {
			const [rx, ry, rw, rh] = a.ring.map(v => v * a.scale);
			const left = x[0] + rx, ringTop = top[0] + ry;
			svg += `<rect x="${r1(left)}" y="${r1(ringTop)}" width="${r1(rw)}" height="${r1(rh)}" rx="${r1(Math.min(rh / 2, 16))}" fill="none" stroke="var(--blue)" stroke-width="5"/>`;
			const y = ringTop + rh / 2;
			const target = Math.min(Math.max(y, top[1] + 40), top[1] + shots[1].h - 40);
			const pts = target === y
				? [[left + rw + 10, y], [x[1] - 14, y]]
				: [[left + rw + 10, y], [(a.w + x[1]) / 2, y], [(a.w + x[1]) / 2, target], [x[1] - 14, target]];
			svg += arrow(pts, 'blue', { width: 5 });
		}
		return heading(s) + body(`<div class="sc" style="height:${H}px">${html.join('')}<svg class="sc-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg></div>`, { vcenter: false });
	},

	/** Closing card: one sentence in the middle of the slide, and the speaker under it. */
	close(s) {
		const speaker = s.speaker ? `<div class="cl-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span></div>` : '';
		return `${msLogo()}<div class="cl-center"><div class="cl-text" data-t>${fmt(s.text)}</div>${speaker}</div>`;
	},
};
