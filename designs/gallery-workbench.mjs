// A gallery for inspiration (the workbench world: a workbench of tagged parts): read it for technique: one recurring
// object drawn by one helper (a job tag with its number, a stamp and a date, hanging from whatever it belongs to), real
// stills framed in drawn devices with the changed part ringed, and before/after pictures built click by click.
// A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as they are. Every visible word comes
// from the slide's fields; examples/agents-speed.mjs shows them in a deck.
// One drawing style: ink outlines, tinted fills, Fluent icons, no shadows, blur or filters.
//   gwb-cover:     a workbench with a monitor (a real still), a stopwatch, tools on a pegboard, the tags on the bench rail
//   gwb-board:     the tags grouped in trays on a bench, a sign per group on the pegboard, the counts big on the left
//   gwb-beside:    a modifier key + click on a button (its tag tied to it), then the real before and after stills (clicks)
//   gwb-attach:    a chat input with files and no text, then the real still of the request drawn as tiles (clicks)
//   gwb-bench:     four inspection cards, each a before and after of one small fix, its tag hanging under the card
//   gwb-stopwatch: a stopwatch with the before and after hands, and the before-to-after rows beside it
//   gwb-queue:     a roller conveyor of crates: shift() moves every crate, an index cursor moves none (clicks)
//   gwb-tape:      a string as letter tiles: one hop per letter, then one jump to the delimiter and two runs copied whole
//   gwb-terminal:  a terminal where the fix for a typo appears as dim ghost text, built-in in blue, the AI's in purple
//   gwb-close:     a close on a blue page: the merged tags on a ring in one S-hook, the open one in another
import { W, asset, at, bodyHeight, esc, fmt, heading, ic, logo, mix, monitor, msLogo, r1, STYLE } from '../src/kit.mjs';

const SW = STYLE.stroke;
const INK = 'var(--ink)';
const STRING = 'var(--body)';
const P = (x, y) => `${r1(x)} ${r1(y)}`;
const svg = (w, h, inner, defs = '') => `<svg class="gwb-svg" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;

/** A checked piece of text. align: 'l' | 'c' (centred on x) | 'r' (ends at x) | 'cm' (centred on x and y) | 'm'. */
function tx(cls, x, y, html, { w, h, nolint = false, on, align = 'l', key, style = '' } = {}) {
	const tr = { l: '', c: 'transform:translateX(-50%);text-align:center;', r: 'transform:translateX(-100%);text-align:right;', cm: 'transform:translate(-50%,-50%);text-align:center;', m: 'transform:translateY(-50%);' }[align];
	return `<div class="gwb-a ${cls}${nolint ? ' nolint' : ''}" style="${at(x, y, w, h)};${tr}${style}"${on ? ` data-on="${on}"` : ''}${key ? ` data-key="${key}"` : ''} data-t>${html}</div>`;
}
const icAt = (x, y, name, size, color) => `<span class="gwb-ic" style="${at(x, y)}">${ic(name, size, color)}</span>`;
const img = (cls, src, x, y, w, h, extra = '') => {
	const a = asset(src ?? '');
	return a ? `<img class="${cls}" src="${a}" alt="" style="${at(x, y, w, h)};${extra}">` : `<div class="${cls}" data-missing="${esc(src)}" style="${at(x, y, w, h)}"></div>`;
};

/** The CSS every design shares, scoped to its name. */
const base = (n, { bare = false } = {}) => `
.${n} { position: ${bare ? 'absolute; left: 0; top: 0; width: 1920px; height: 1080px' : `relative; width: ${W}px`}; }
.${n} .gwb-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .gwb-a { position: absolute; white-space: nowrap; }
.${n} .gwb-ic { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); }
.${n} .gwb-tag { position: absolute; }
.${n} .gwb-tag .gwb-svg { overflow: visible; }
.${n} .gwb-tag-num { position: absolute; left: 0; right: 0; text-align: center; font-family: var(--mono); font-weight: 700; color: var(--ink); white-space: nowrap; letter-spacing: -.02em; }
.${n} .gwb-tag-word { position: absolute; left: 0; right: 0; text-align: center; font-size: 15px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
.${n} .gwb-tag-date { position: absolute; left: 0; right: 0; text-align: center; font-size: 15px; font-weight: 600; color: var(--muted); white-space: nowrap; }
.${n} .gwb-tag-ic { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); }
.${n} .gwb-lbl { font-size: 16px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); }
.${n} .gwb-big { font-size: 112px; font-weight: 700; letter-spacing: -.045em; line-height: .92; }
.${n} .gwb-mid { font-size: 60px; font-weight: 700; letter-spacing: -.035em; line-height: 1; }
.${n} .gwb-num { font-size: 26px; font-weight: 700; letter-spacing: -.01em; }
.${n} .gwb-cap { font-size: 25px; font-weight: 600; color: var(--ink); line-height: 1.25; }
.${n} .gwb-sub { font-size: 21px; color: var(--body); line-height: 1.3; }
.${n} .gwb-mono { font-family: var(--mono); }
.${n} .gwb-fg { color: var(--fg); }
.${n} .gwb-keycap { font-size: 22px; font-weight: 600; color: var(--ink); line-height: 1.1; }
.${n} .gwb-shot { position: absolute; display: block; object-fit: cover; }
.${n} .gwb-chip { display: flex; align-items: center; gap: 8px; font-size: 19px; font-weight: 600; color: var(--ink); background: #fff; border: 2px solid var(--line-strong); border-radius: 10px; padding: 3px 10px; }
.${n} .gwb-chip-dark { font-size: 16px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink); background: #fff; border-radius: 8px; padding: 4px 10px; }
.${n} .gwb-hidden { visibility: hidden; }
`;

// ---------- the job tag: the recurring object ----------

/** A manila-style job tag hanging by its eyelet at (x, y): white card with clipped top corners, a blue eyelet with the
 * string through it, the PR number, a round stamp (green tick merged, orange clock open), the stamp's word and a date.
 * w sets the size (h = 1.95 w with a date, 1.7 w without). rot turns it around the eyelet. Text is optional: small
 * or stacked tags pass num: null. Returns { html, top: [x, y] } (where the string meets the top edge). */
function jobTag({ x, y, w = 100, num = null, state = 'merged', word = null, date = null, rot = 0, key = null, hidden = false, dim = false, string = true } = {}) {
	const tone = state === 'open' ? 'orange' : 'green';
	const h = w * (date ? 1.95 : num || word ? 1.72 : 1.5), hy = w * 0.2, ch = w * 0.26, rr = Math.min(10, w * 0.1);
	let g = `<path d="M ${P(ch, 1.5)} H ${r1(w - ch)} L ${P(w - 1.5, ch)} V ${r1(h - rr)} Q ${P(w - 1.5, h - 1.5)} ${P(w - rr, h - 1.5)} H ${r1(rr)} Q ${P(1.5, h - 1.5)} ${P(1.5, h - rr)} V ${r1(ch)} Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
	g += `<circle cx="${r1(w / 2)}" cy="${r1(hy)}" r="${r1(w * 0.09)}" fill="${mix('blue', 20)}" stroke="var(--blue)" stroke-width="3"/>`;
	g += `<circle cx="${r1(w / 2)}" cy="${r1(hy)}" r="${r1(w * 0.034)}" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
	if (string) g += `<path d="M ${P(w / 2, hy)} V -1" stroke="${STRING}" stroke-width="2.5" stroke-linecap="round"/>`;
	const numY = hy + w * 0.2, numSize = Math.max(15, r1(w * 0.19));
	const sy = num ? numY + numSize + w * 0.36 : hy + w * 0.5, sr = w * 0.27;
	if (num) g += `<path d="M ${P(w * 0.14, numY + numSize + w * 0.06)} H ${r1(w * 0.86)}" stroke="var(--line-strong)" stroke-width="2"/>`;
	g += `<circle cx="${r1(w / 2)}" cy="${r1(sy)}" r="${r1(sr)}" fill="${mix(tone, 12)}" stroke="var(--${tone})" stroke-width="3.5"/>`;
	g += `<circle cx="${r1(w / 2)}" cy="${r1(sy)}" r="${r1(sr - 5)}" fill="none" stroke="var(--${tone})" stroke-width="1.5" stroke-dasharray="3 3"/>`;
	let html = `<span class="gwb-tag-ic" style="${at(w / 2, sy)}">${ic(state === 'open' ? 'clock' : 'checkmark', r1(sr * 1.1), `var(--${tone})`)}</span>`;
	if (num) html += `<div class="gwb-tag-num nolint" style="top:${r1(numY)}px;font-size:${numSize}px" data-on="#ffffff" data-t>${esc(num)}</div>`;
	if (word) html += `<div class="gwb-tag-word nolint" style="top:${r1(sy + sr + w * 0.06)}px;color:var(--${tone})" data-on="#ffffff" data-t>${esc(word)}</div>`;
	if (date) html += `<div class="gwb-tag-date nolint" style="top:${r1(sy + sr + w * 0.06 + 22)}px" data-on="#ffffff" data-t>${esc(date)}</div>`;
	const vis = hidden ? 'visibility:hidden;' : dim ? 'opacity:.35;' : '';
	const out = `<div class="gwb-tag"${key ? ` data-key="${key}"` : ''}${num ? ' data-shape' : ''} style="${at(x - w / 2, y - hy, w, h)};transform-origin:${r1(w / 2)}px ${r1(hy)}px;${rot ? `transform:rotate(${r1(rot)}deg);` : ''}${vis}">${svg(w, h, g)}${html}</div>`;
	const a = rot * Math.PI / 180;
	return { html: out, top: [x + Math.sin(a) * hy, y - Math.cos(a) * hy], h, bottom: y - hy + h };
}

/** A tag's fields with their defaults: the stamp's word follows its state unless the slide gives one. */
const tagOpts = tg => ({ num: tg.num, date: tg.date, state: tg.state ?? 'merged', word: tg.word ?? (tg.state === 'open' ? 'Open' : 'Merged') });

/** A narrow pegboard panel the full height of the body, with one peg and a job tag hanging from it. */
function tagStrip(x, w, H, tg, { tagW = 92, key = 'tag', pegY = 44 } = {}) {
	const T = hungTag(x + w / 2, pegY, { w: tagW, ...tagOpts(tg), key, drop: 28 });
	return { svg: pegboard(x, 2, w, H - 4, { step: 30 }) + T.svg, html: T.html };
}

/** A string from a hook to a tag's top edge, sagging a little. */
const tagString = (from, to, sag = 6) => `<path d="M ${P(...from)} Q ${P((from[0] + to[0]) / 2 + sag * 0.3, (from[1] + to[1]) / 2 + sag)} ${P(...to)}" fill="none" stroke="${STRING}" stroke-width="2.5" stroke-linecap="round"/>`;

/** A wall peg: a round plate screwed to the wall and a short peg sticking out of it, seen from the front. */
const peg = (x, y, { color = INK, fill = '#fff' } = {}) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="11" fill="${fill}" stroke="${color}" stroke-width="3"/><circle cx="${r1(x)}" cy="${r1(y)}" r="4" fill="${color}"/>`;

/** One tag on its peg: the peg, the string and the tag. Returns { svg, html, bottom }. */
function hungTag(px, py, o) {
	const T = jobTag({ ...o, x: px, y: py + (o.drop ?? 30) });
	return { svg: (o.hidden ? '' : tagString([px, py], T.top, 2) + peg(px, py)), html: T.html, bottom: T.bottom };
}

// ---------- the stopwatch ----------

/** A mechanical stopwatch standing at (cx, cy) with radius r: a lanyard ring, the crown and stem, two side pushers,
 * the case, a bezel, minor and major ticks over `max` units per turn. hands: [{ v, tone, w }]; sector: [from, to, tone].
 * Returns { svg, ring: [x, y] (the lanyard ring), ang: v => degrees, pt }. */
function stopwatch(cx, cy, r, { max = 80, major = 10, minor = 2, hands = [], sector = null, stroke = INK, face = '#fff', ticks = true } = {}) {
	const ang = v => -90 + 360 * v / max;
	const pt = (rad, deg) => [cx + Math.cos(deg * Math.PI / 180) * rad, cy + Math.sin(deg * Math.PI / 180) * rad];
	const k = r / 100;
	let g = '';
	// Side pushers at 40 degrees either side of the crown, drawn under the case.
	for (const d of [-130, -50]) {
		const [px, py] = pt(r + 8 * k, d);
		g += `<rect x="${r1(px - 9 * k)}" y="${r1(py - 7 * k)}" width="${r1(18 * k)}" height="${r1(14 * k)}" rx="${r1(3 * k)}" transform="rotate(${d + 90} ${r1(px)} ${r1(py)})" fill="${mix('neutral', 18)}" stroke="${stroke}" stroke-width="3"/>`;
	}
	// Stem, crown and lanyard ring.
	const top = cy - r;
	g += `<rect x="${r1(cx - 7 * k)}" y="${r1(top - 16 * k)}" width="${r1(14 * k)}" height="${r1(20 * k)}" fill="${mix('neutral', 18)}" stroke="${stroke}" stroke-width="3"/>`;
	g += `<rect x="${r1(cx - 17 * k)}" y="${r1(top - 30 * k)}" width="${r1(34 * k)}" height="${r1(16 * k)}" rx="${r1(4 * k)}" fill="${mix('neutral', 18)}" stroke="${stroke}" stroke-width="3"/>`;
	for (let i = 1; i < 4; i++) g += `<path d="M ${P(cx - 17 * k + i * 8.5 * k, top - 28 * k)} V ${r1(top - 16 * k)}" stroke="${stroke}" stroke-width="1.5"/>`;
	const ringY = top - 42 * k;
	g += `<circle cx="${r1(cx)}" cy="${r1(ringY)}" r="${r1(12 * k)}" fill="none" stroke="${stroke}" stroke-width="${r1(Math.max(3, 4 * k))}"/>`;
	// Case and bezel.
	g += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${mix('neutral', 14)}" stroke="${stroke}" stroke-width="${STYLE.strokeBold}"/>`;
	g += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.9)}" fill="${face}" stroke="${stroke}" stroke-width="3"/>`;
	if (sector) {
		const [a, b, tone] = sector, R = r * 0.84;
		const [x0, y0] = pt(R, ang(a)), [x1, y1] = pt(R, ang(b));
		g += `<path d="M ${P(cx, cy)} L ${P(x0, y0)} A ${r1(R)} ${r1(R)} 0 ${b - a > max / 2 ? 1 : 0} 1 ${P(x1, y1)} Z" fill="${mix(tone, 24)}"/>`;
	}
	if (ticks) {
		for (let v = 0; v < max; v += minor) {
			const isMajor = Math.abs(v / major - Math.round(v / major)) < 1e-6;
			const [a0, b0] = pt(r * (isMajor ? 0.74 : 0.8), ang(v)), [a1, b1] = pt(r * 0.86, ang(v));
			g += `<path d="M ${P(a0, b0)} L ${P(a1, b1)}" stroke="${isMajor ? stroke : 'var(--faint)'}" stroke-width="${isMajor ? 4 : 2}" stroke-linecap="round"/>`;
		}
	}
	for (const hd of hands) {
		const [hx, hy] = pt(r * (hd.len ?? 0.8), ang(hd.v)), [tx0, ty0] = pt(r * 0.14, ang(hd.v) + 180);
		g += `<path d="M ${P(tx0, ty0)} L ${P(hx, hy)}" stroke="var(--${hd.tone})" stroke-width="${hd.w ?? 6}" stroke-linecap="round"/>`;
	}
	g += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(Math.max(6, 9 * k))}" fill="${stroke}"/>`;
	return { svg: g, ring: [cx, ringY], ang, pt };
}

// ---------- the workshop ----------

/** A workbench: a thick top with a lip, a front rail (where tags hang) and two legs down to `floor`. */
function bench(x0, x1, y, { floor = y + 260, rail = true, stroke = INK, top = 'var(--track)', legs = true } = {}) {
	let g = '';
	if (legs) for (const lx of [x0 + 36, x1 - 64]) g += `<rect x="${r1(lx)}" y="${r1(y + 30)}" width="28" height="${r1(floor - y - 30)}" fill="${mix('neutral', 16)}" stroke="${stroke}" stroke-width="3"/>`;
	if (rail) g += `<rect x="${r1(x0 + 18)}" y="${r1(y + 30)}" width="${r1(x1 - x0 - 36)}" height="22" fill="${mix('neutral', 22)}" stroke="${stroke}" stroke-width="3"/>`;
	g += `<rect x="${r1(x0)}" y="${r1(y)}" width="${r1(x1 - x0)}" height="32" rx="6" fill="${top}" stroke="${stroke}" stroke-width="${SW}"/>`;
	g += `<path d="M ${P(x0 + 16, y + 11)} H ${r1(x0 + (x1 - x0) * 0.38)} M ${P(x0 + (x1 - x0) * 0.52, y + 20)} H ${r1(x1 - 24)}" stroke="var(--line-strong)" stroke-width="2.5" stroke-linecap="round"/>`;
	return g;
}

/** A pegboard: a panel with a grid of holes. */
function pegboard(x, y, w, h, { step = 36 } = {}) {
	let g = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="14" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
	for (let yy = y + step * 0.75; yy < y + h - step * 0.4; yy += step) {
		for (let xx = x + step * 0.75; xx < x + w - step * 0.4; xx += step) g += `<circle cx="${r1(xx)}" cy="${r1(yy)}" r="3.5" fill="var(--line-strong)"/>`;
	}
	return g;
}

/** A keyboard key: a skirt and a lighter top face. The label goes on top as HTML. */
const keycap = (x, y, w, h, { stroke = INK } = {}) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="14" fill="var(--line-strong)" stroke="${stroke}" stroke-width="3"/><rect x="${r1(x + 7)}" y="${r1(y + 5)}" width="${r1(w - 14)}" height="${r1(h - 20)}" rx="10" fill="#fff" stroke="${stroke}" stroke-width="2"/>`;

/** The pointer: an arrow cursor with its tip at (x, y). */
const cursor = (x, y, s = 1) => `<path d="M ${P(x, y)} l 0 ${r1(30 * s)} l ${r1(7.5 * s)} ${r1(-7 * s)} l ${r1(5.5 * s)} ${r1(12 * s)} l ${r1(5.5 * s)} ${r1(-2.5 * s)} l ${r1(-5.5 * s)} ${r1(-11.5 * s)} l ${r1(10.5 * s)} 0 Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;

/** An arrow from (x0, y0) to (x1, y1) along a gentle curve, with a filled head. */
function arrow(x0, y0, x1, y1, { tone = 'blue', bend = 0, w = 4, dashed = false } = {}) {
	const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + bend;
	const a = Math.atan2(y1 - my, x1 - mx), L = 16;
	const ex = x1 - Math.cos(a) * L * 0.8, ey = y1 - Math.sin(a) * L * 0.8;
	const h1 = [x1 - Math.cos(a - 0.5) * L, y1 - Math.sin(a - 0.5) * L], h2 = [x1 - Math.cos(a + 0.5) * L, y1 - Math.sin(a + 0.5) * L];
	return `<path d="M ${P(x0, y0)} Q ${P(mx, my)} ${P(ex, ey)}" fill="none" stroke="var(--${tone})" stroke-width="${w}" stroke-linecap="round"${dashed ? ' stroke-dasharray="2 10"' : ''}/><path d="M ${P(x1, y1)} L ${P(...h1)} L ${P(...h2)} Z" fill="var(--${tone})" stroke="var(--${tone})" stroke-width="2" stroke-linejoin="round"/>`;
}

/** A real still in a window frame: an ink outline, rounded, the picture clipped inside. ring: [x0, y0, x1, y1] as
 * fractions of the picture, outlined in blue (the part that changed). */
function still(n, x, y, w, h, src, { ring = null, label = null, key = null, hidden = false } = {}) {
	const vis = hidden ? 'visibility:hidden;' : '';
	let s = `<div class="${n}-still"${key ? ` data-key="${key}"` : ''} style="${at(x, y, w, h)};${vis}">${img('gwb-shot', src, 0, 0, w, h, 'border-radius:12px')}</div>`;
	let g = `<rect x="${r1(x - 3)}" y="${r1(y - 3)}" width="${r1(w + 6)}" height="${r1(h + 6)}" rx="14" fill="#1b1b1f" stroke="${INK}" stroke-width="3"${hidden ? ' visibility="hidden"' : ''}/>`;
	let over = '';
	if (ring) {
		const [a, b, c, d] = ring;
		over += `<rect x="${r1(x + a * w)}" y="${r1(y + b * h)}" width="${r1((c - a) * w)}" height="${r1((d - b) * h)}" rx="10" fill="none" stroke="var(--blue)" stroke-width="5"${hidden ? ' visibility="hidden"' : ''}/>`;
	}
	if (label) s += tx('lbl gwb-chip-dark', x + 14, y + 14, esc(label), { nolint: true, key: key ? `${key}-l` : null, style: vis });
	return { html: s, under: g, over };
}

/** The cover's text column: the VS Code mark beside the eyebrow, the title, a line, the speaker and pills. */
function coverText(s, n, { light = false } = {}) {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
	const mark = s.logo ? `<span class="${n}-mark">${logo(s.logo, 34, light ? '#fff' : null)}</span>` : '';
	return `<div class="tf-left ${n}-left"><div class="${n}-eyebrow-row">${mark}<span class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</span></div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${sp}</div>`;
}
const coverCss = (n, width = 780) => `
.${n} .${n}-left { width: ${width}px; }
.${n} .${n}-eyebrow-row { display: flex; align-items: center; gap: 14px; }
.${n} .${n}-mark { display: grid; place-items: center; }
`;

const D = {};

/** A combination wrench hanging from a peg at (x, y): an open jaw at the top, a ring end at the bottom. */
function wrench(x, y, len = 250) {
	const w = 24, jr = 30, rr = 24;
	let g = `<rect x="${r1(x - w / 2)}" y="${r1(y + jr)}" width="${w}" height="${r1(len - jr - rr)}" rx="8" fill="${mix('neutral', 16)}" stroke="${INK}" stroke-width="3"/>`;
	g += `<circle cx="${r1(x)}" cy="${r1(y + 12)}" r="${jr}" fill="${mix('neutral', 16)}" stroke="${INK}" stroke-width="3"/>`;
	g += `<path d="M ${P(x - 11, y - 20)} L ${P(x - 11, y + 8)} Q ${P(x, y + 18)} ${P(x + 11, y + 8)} L ${P(x + 11, y - 20)}" fill="var(--surface)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
	g += `<circle cx="${r1(x)}" cy="${r1(y + len - rr + 4)}" r="${rr}" fill="${mix('neutral', 16)}" stroke="${INK}" stroke-width="3"/><circle cx="${r1(x)}" cy="${r1(y + len - rr + 4)}" r="11" fill="var(--surface)" stroke="${INK}" stroke-width="3"/>`;
	return g + peg(x, y - 2);
}
/** A screwdriver hanging from a peg at (x, y): a ribbed handle, a shaft and a flat tip. */
function screwdriver(x, y, len = 230) {
	let g = `<rect x="${r1(x - 3.5)}" y="${r1(y + 96)}" width="7" height="${r1(len - 96)}" fill="${mix('neutral', 30)}" stroke="${INK}" stroke-width="2.5"/>`;
	g += `<path d="M ${P(x - 6, y + len)} H ${r1(x + 6)} L ${P(x + 3.5, y + len - 14)} H ${r1(x - 3.5)} Z" fill="${mix('neutral', 30)}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
	g += `<rect x="${r1(x - 19)}" y="${r1(y - 14)}" width="38" height="112" rx="14" fill="${mix('blue', 22)}" stroke="${INK}" stroke-width="3"/>`;
	for (const dx of [-8, 0, 8]) g += `<path d="M ${P(x + dx, y + 22)} V ${r1(y + 84)}" stroke="var(--blue)" stroke-width="3" stroke-linecap="round"/>`;
	return g + peg(x, y);
}

/** The twelve tags hanging from the bench rail, in five groups. groups: [{ n, state }] (or counts), and each tag's
 * state: the last tag of a group marked open: true is orange. */
function railTags(groups, x0, x1, y, { w = 60, unit = 66, gap = 22 } = {}) {
	const total = groups.reduce((a, g) => a + g.n, 0);
	const width = (total - 1) * unit + (groups.length - 1) * gap;
	let x = (x0 + x1) / 2 - width / 2, g = '', html = '';
	groups.forEach((gr, gi) => {
		for (let i = 0; i < gr.n; i++) {
			const T = hungTag(x, y, { w, state: gr.open && i === gr.n - 1 ? 'open' : 'merged', drop: 22, rot: 0 });
			g += T.svg;
			html += T.html;
			x += unit;
		}
		x += gap - (gi === groups.length - 1 ? 0 : 0);
	});
	return { svg: g, html };
}

// The cover in three levels of detail (1: monitor and tags, 2: adds the stopwatch, 3: adds the pegboard and tools).
function coverDesign(n, level) {
	return {
		bare: true,
		css: base(n, { bare: true }) + coverCss(n),
		render(s) {
			const benchY = 812, bx0 = 930, bx1 = 1900;
			let g = '', html = '';
			if (level >= 3) {
				g += pegboard(bx0 + 10, 120, bx1 - bx0 - 10, benchY - 120);
				g += wrench(1772, 196, 250) + screwdriver(1852, 196, 236);
			}
			g += bench(bx0, bx1, benchY, { floor: 1036 }) + `<path d="M ${bx0 - 30} 1036 H 1920" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
			const mw = level >= 2 ? 760 : 820, mx = level >= 2 ? 948 : 1000;
			const M = monitor({ x: 0, y: 0, w: mw, src: s.src });
			const my = benchY - M.h;
			html += monitor({ x: mx, y: my, w: mw, src: s.src }).html;
			if (level >= 2) {
				const sw = stopwatch(1800, benchY - 84, 80, { max: 60, major: 5, minor: 1, hands: [{ v: 47, tone: 'green', w: 5 }, { v: 0, tone: 'neutral', w: 3, len: 0.55 }] });
				g += sw.svg;
			}
			const R = railTags(s.groups ?? [{ n: 2 }, { n: 2 }, { n: 4 }, { n: 3 }, { n: 1, open: true }], bx0 + 64, bx1 - 64, benchY + 58, { w: 56, unit: 62, gap: 18 });
			g += R.svg;
			html += R.html;
			return `<div class="${n}">${svg(1920, 1080, g)}${html}${coverText(s, n)}${msLogo()}</div>`;
		},
	};
}
/** The cover: a workbench under a pegboard (a wrench and a screwdriver on pegs), a monitor on the bench with a real
 * still of the product, a stopwatch beside it, and one job tag per pull request hanging from the bench rail in its
 * groups (the last tag of a group marked open is orange). Left: the eyebrow with a logo, the title, a line, the speaker.
 * Fields: eyebrow, title, sub, speaker: { initials, name, role }, logo, src (the still, 16:9), groups: [{ n, open }]. */
D['gwb-cover'] = { ...coverDesign('gwb-cover', 3) };

// ---------- the overview: the twelve tags, grouped ----------

/** The count column on the left: big numbers with their labels (a logo beside the first label if given). */
function countsColumn(n, counts, x, y0, gap = 230) {
	return (counts ?? []).map((c, i) => {
		const y = y0 + i * gap, tone = c.tone ?? 'neutral';
		const mark = c.logo ? `<span class="${n}-logo">${logo(c.logo, 28)}</span>` : '';
		return tx(`gwb-big t-${tone} ${tone === 'neutral' ? '' : 'gwb-fg'}`, x, y, esc(c.value), { nolint: true })
			+ `<div class="gwb-a ${n}-count" style="${at(x + 4, y + 112)}">${mark}<span class="gwb-cap" data-t>${fmt(c.label)}</span></div>`;
	}).join('');
}
const countsCss = n => `
.${n} .${n}-count { display: flex; align-items: center; gap: 10px; }
.${n} .${n}-logo { display: grid; place-items: center; }
.${n} .${n}-plate { position: absolute; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 24px; box-sizing: border-box; font-size: 20px; font-weight: 600; color: var(--ink); white-space: nowrap; }
`;

/** A steel rail on two brackets, screwed to the board. */
const rail = (x0, x1, y) => `<path d="M ${P(x0 + 14, y - 22)} V ${r1(y + 4)} M ${P(x1 - 14, y - 22)} V ${r1(y + 4)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
	+ `<circle cx="${r1(x0 + 14)}" cy="${r1(y - 22)}" r="6" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${r1(x1 - 14)}" cy="${r1(y - 22)}" r="6" fill="#fff" stroke="${INK}" stroke-width="3"/>`
	+ `<rect x="${r1(x0)}" y="${r1(y)}" width="${r1(x1 - x0)}" height="12" rx="6" fill="${mix('neutral', 22)}" stroke="${INK}" stroke-width="3"/>`;

/** A sign screwed to the board: white, ink outline, two screws; the icon and the word go on top as HTML. */
const sign = (x, y, w, h) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/>`
	+ `<circle cx="${r1(x + 12)}" cy="${r1(y + h / 2)}" r="3" fill="var(--faint)"/><circle cx="${r1(x + w - 12)}" cy="${r1(y + h / 2)}" r="3" fill="var(--faint)"/>`;

/** Lays the groups out along x: each tag gets a centre; groups are separated by gap. */
function layoutGroups(groups, x0, x1, { unit, gap }) {
	const total = groups.reduce((a, g) => a + g.tags.length, 0);
	const width = (total - 1) * unit + (groups.length - 1) * gap;
	let x = (x0 + x1) / 2 - width / 2;
	return groups.map(g => {
		const xs = g.tags.map((_, i) => x + i * unit);
		x = xs[xs.length - 1] + unit + gap;
		return { ...g, xs };
	});
}

/** The overview as trays on a bench: one tray per group, its tags standing in it, the tray's label on its front; a
 * pegboard behind. Fields: eyebrow, title, counts: [{ value, label, tone, logo }], groups: [{ title, icon, tags: [{ num,
 * date, state }] }]. */
D['gwb-board'] = {
	css: base('gwb-board') + countsCss('gwb-board'),
	render(s) {
		const n = 'gwb-board', H = bodyHeight(s);
		const bx0 = 336, bx1 = W, benchY = H - 92, trayTop = benchY - 96;
		let g = pegboard(bx0, 60, bx1 - bx0, benchY - 54) + bench(bx0 - 12, bx1, benchY, { floor: H, rail: false });
		let html = countsColumn(n, s.counts, 0, 22), front = '';
		const L = layoutGroups(s.groups ?? [], bx0, bx1, { unit: 92, gap: 60 });
		L.forEach((gr, gi) => {
			const a = gr.xs[0] - 50, b = gr.xs[gr.xs.length - 1] + 50;
			// The back of the tray, then the tags standing in it, then its front over their feet.
			g += `<path d="M ${P(a + 10, trayTop - 30)} H ${r1(b - 10)} L ${P(b, trayTop)} H ${r1(a)} Z" fill="${mix('neutral', 22)}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
			gr.tags.forEach((tg, i) => {
				const rot = (i - (gr.tags.length - 1) / 2) * 3;
				const T = jobTag({ x: gr.xs[i], y: trayTop - 118, w: 86, ...tagOpts(tg), date: null, rot, key: `tag-${gi}-${i}`, string: false });
				html += T.html;
			});
			front += `<path d="M ${P(a, trayTop)} H ${r1(b)} V ${r1(benchY - 2)} H ${r1(a)} Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
			front += `<path d="M ${P(a, trayTop + 10)} H ${r1(b)}" stroke="var(--line-strong)" stroke-width="2"/>`;
			const sw = Math.max(b - a - 8, 150), sx = Math.min((a + b) / 2 - sw / 2, bx1 - 14 - sw);
			g += sign(sx, 230, sw, 50);
			html += `<div class="${n}-plate" style="${at(sx, 230, sw, 50)}" data-shape>${ic(gr.icon ?? 'tag', 24, 'var(--blue)')}<span data-t data-on="#ffffff">${fmt(gr.title)}</span></div>`;
			html += tx(`gwb-num ${gr.tags.some(t => t.state === 'open') ? 't-orange' : 't-green'} gwb-fg`, (a + b) / 2, trayTop + 48, String(gr.tags.length), { nolint: true, align: 'cm', on: '#ffffff', style: 'z-index:2;font-size:34px' });
		});
		const frontSvg = `<svg class="gwb-svg" style="z-index:1" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${front}</svg>`;
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}${frontSvg}</div></div>`;
	},
};

// ---------- the Agents window slides ----------

/** A drawn UI button: white, ink outline, an icon and a word. */
const uiButton = (x, y, w, h) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="12" fill="#fff" stroke="${INK}" stroke-width="3"/>`;

/** Alt + click opens it beside: one row per pull request. Left: the Alt key, a plus, and the button with the pointer on
 * it. Middle: the real still before, an arrow, the real still after with the new pane ringed. Right: the job tag on its
 * peg. Click by click, one row per click. Fields: eyebrow, title, key: { top, bottom } (the keycap), rows: [{ button:
 * { icon, text }, before: { src, label }, after: { src, label, ring }, tag: { num, date, state } }]. */
D['gwb-beside'] = {
	clicks: true,
	css: base('gwb-beside') + `
.gwb-beside .gwb-beside-still { position: absolute; border-radius: 12px; overflow: hidden; }
.gwb-beside .gwb-beside-btn { display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 600; color: var(--ink); }
.gwb-beside .gwb-beside-k1 { font-size: 30px; font-weight: 600; color: var(--ink); }
.gwb-beside .gwb-beside-k2 { font-size: 21px; font-weight: 600; color: var(--body); }
`,
	render(s, ctx = {}) {
		const n = 'gwb-beside', H = bodyHeight(s), step = ctx.step ?? Infinity;
		const rows = s.rows ?? [], rowH = 314, rowGap = H - 8 - rowH * 2;
		let g = '', html = '', over = '';
		rows.forEach((row, i) => {
			const y = 4 + i * (rowH + rowGap), hidden = step < i + 1, key = `row-${i}`;
			const vis = hidden ? ' visibility="hidden"' : '';
			const hv = hidden ? 'visibility:hidden;' : '';
			// Alt + click on the button, on one line; the job tag tied to the button it changed.
			const by = y + 24, bx = 150, bw = 172;
			g += `<g${vis}>${keycap(0, y + 12, 104, 92)}<path d="M ${P(116, by + 34)} H 138 M ${P(127, by + 23)} V ${r1(by + 45)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>${uiButton(bx, by, bw, 66)}</g>`;
			html += tx(`${n}-k1`, 18, y + 20, esc(s.key?.top ?? '\u2325'), { nolint: true, key: `${key}-k1`, style: hv });
			html += tx(`${n}-k2`, 90, y + 62, esc(s.key?.bottom ?? 'alt'), { nolint: true, align: 'r', key: `${key}-k2`, style: hv });
			html += `<div class="gwb-a ${n}-btn" data-key="${key}-btn" style="${at(bx + 18, by, bw - 30, 66)};${hv}">${ic(row.button?.icon ?? 'add', 28, INK)}<span class="nolint" data-t>${fmt(row.button?.text ?? '')}</span></div>`;
			if (row.tag) {
				const tx0 = bx + bw / 2;
				const T = jobTag({ x: tx0, y: by + 66 + 52, w: 96, ...tagOpts(row.tag), key: `${key}-tag`, hidden });
				g += `<g${vis}><circle cx="${r1(tx0)}" cy="${r1(by + 58)}" r="5" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${tagString([tx0, by + 58], T.top, 1)}</g>`;
				html += T.html;
			}
			over += `<g${vis}>${cursor(bx + bw - 44, by + 34, 1.2)}</g>`;
			// The two stills and the arrow between them.
			const sw = 620, sh = rowH, x0 = 344, x1 = 1084;
			const A = still(n, x0, y, sw, sh, row.before?.src, { label: row.before?.label, key: `${key}-a`, hidden });
			const B = still(n, x1, y, sw, sh, row.after?.src, { label: row.after?.label, ring: row.after?.ring, key: `${key}-b`, hidden });
			g += A.under + B.under;
			over += `<g${vis}>${B.over}${arrow(x0 + sw + 22, y + sh / 2, x1 - 22, y + sh / 2, { tone: 'blue', w: 5 })}</g>`;
			html += A.html + B.html;
		});
		const top = `<svg class="gwb-svg" style="z-index:1" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${over}</svg>`;
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}${top}</div></div>`;
	},
};

/** Files with no text, then tiles. Left: the chat input with file chips and no text, its send button lit, an arrow up
 * to the request it sent (the summary line). Right, on the second click: the real still of the same request drawn as
 * tiles, the tiles ringed. Each pull request's tag hangs under its half. Fields: eyebrow, title, input: { chips: [{ icon,
 * text }], placeholder, tools: [] }, bubble (the request's line), still: { src, label, ring }, tags: [{ num, date }, …]. */
D['gwb-attach'] = {
	clicks: true,
	css: base('gwb-attach') + `
.gwb-attach .gwb-attach-chips { position: absolute; display: flex; flex-wrap: wrap; gap: 10px; width: 690px; }
.gwb-attach .gwb-attach-ph { font-size: 24px; color: var(--muted); }
.gwb-attach .gwb-attach-tool { font-size: 19px; font-weight: 600; color: var(--body); display: flex; align-items: center; gap: 6px; }
.gwb-attach .gwb-attach-bubble { font-size: 25px; font-weight: 600; color: var(--ink); }
.gwb-attach .gwb-attach-still { position: absolute; border-radius: 12px; overflow: hidden; }
`,
	render(s, ctx = {}) {
		const n = 'gwb-attach', H = bodyHeight(s), step = ctx.step ?? Infinity;
		const I = s.input ?? {}, tags = s.tags ?? [];
		let g = '', html = '', over = '';
		// The request it sent: a user bubble at the top right of the left half.
		const bx = 404, by = 26, bw = 316, bh = 64;
		g += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="16" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
		html += tx(`${n}-bubble`, bx + bw / 2, by + bh / 2, fmt(s.bubble ?? ''), { align: 'cm', key: 'bubble' });
		// The input: chips, no text, tools and a lit send button.
		const ix = 0, iy = 150, iw = 740, ih = 280;
		g += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="18" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
		html += `<div class="${n}-chips" data-key="chips" style="${at(ix + 22, iy + 22)}">${(I.chips ?? []).map(c => `<span class="gwb-chip">${ic(c.icon ?? 'document', 22, c.icon === 'image' ? 'var(--blue)' : 'var(--body)')}<span class="nolint" data-t>${esc(c.text)}</span></span>`).join('')}</div>`;
		html += tx(`${n}-ph`, ix + 24, iy + 136, esc(I.placeholder ?? ''), { nolint: true, key: 'ph' });
		g += `<path d="M ${P(ix + 26, iy + 142)} V ${r1(iy + 172)}" stroke="var(--blue)" stroke-width="3"/>`;
		html += `<div class="gwb-a ${n}-tool" data-key="tools" style="${at(ix + 22, iy + ih - 56)}">${ic('add', 24, 'var(--body)')}${(I.tools ?? []).map(t => `<span class="nolint" data-t>${esc(t)}</span>`).join('<span style="width:14px"></span>')}</div>`;
		const sx = ix + iw - 50, sy = iy + ih - 42;
		g += `<circle cx="${sx}" cy="${sy}" r="26" fill="var(--blue)" stroke="${INK}" stroke-width="3"/>`;
		html += icAt(sx, sy, 'arrowUp', 30, '#fff');
		g += cursor(sx + 6, sy + 6, 1.15);
		// The send arrow up to the request.
		g += arrow(sx, sy - 40, bx + bw - 40, by + bh + 12, { tone: 'blue', bend: 0, w: 4, dashed: true });
		// Tag for the first pull request, under the input.
		if (tags[0]) {
			const T = jobTag({ x: 96, y: iy + ih + 44, w: 92, ...tagOpts(tags[0]), key: 'tag-0' });
			g += tagString([96, iy + ih - 2], T.top, 1);
			html += T.html;
		}
		// Second click: the request drawn as tiles, a real still.
		const hidden = step < 2, vis = hidden ? ' visibility="hidden"' : '';
		const stx = 820, sty = 26, stw = W - stx, sth = stw * (s.still?.ratio ?? 780 / 2030);
		const S = still(n, stx, sty, stw, sth, s.still?.src, { ring: s.still?.ring, key: 'still', hidden });
		if (s.still?.label) html += tx('gwb-lbl t-blue gwb-fg', stx, sty + sth + 16, esc(s.still.label), { nolint: true, key: 'still-l', style: hidden ? 'visibility:hidden;' : '' });
		g += S.under;
		over += `<g${vis}>${S.over}${arrow(bx + bw + 14, by + bh / 2, stx - 14, by + bh / 2 + 40, { tone: 'blue', w: 4 })}</g>`;
		html += S.html;
		if (tags[1]) {
			const T = jobTag({ x: stx + stw / 2, y: sty + sth + 50, w: 92, ...tagOpts(tags[1]), key: 'tag-1', hidden });
			g += `<g${vis}>${tagString([stx + stw / 2, sty + sth + 2], T.top, 1)}</g>`;
			html += T.html;
		}
		const top = `<svg class="gwb-svg" style="z-index:1" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${over}</svg>`;
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}${top}</div></div>`;
	},
};

// ---------- polish ----------

/** A small round badge: a green tick or a red cross, so the state reads without colour too. */
const badge = (x, y, ok, r = 17) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="var(--${ok ? 'green' : 'red'})" stroke="#fff" stroke-width="3"/>`
	+ (ok ? `<path d="M ${P(x - r * 0.42, y + r * 0.02)} L ${P(x - r * 0.1, y + r * 0.34)} L ${P(x + r * 0.46, y - r * 0.3)}" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`
		: `<path d="M ${P(x - r * 0.34, y - r * 0.34)} L ${P(x + r * 0.34, y + r * 0.34)} M ${P(x + r * 0.34, y - r * 0.34)} L ${P(x - r * 0.34, y + r * 0.34)}" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`);
const chevron = (x, y, dir, s = 9, color = INK) => dir === 'down'
	? `<path d="M ${P(x - s, y - s / 2)} L ${P(x, y + s / 2)} L ${P(x + s, y - s / 2)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`
	: `<path d="M ${P(x - s / 2, y - s)} L ${P(x + s / 2, y)} L ${P(x - s / 2, y + s)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;

/** One half of a polish card: the drawing of a state. kind: 'chevron' | 'section' | 'glyph' | 'tooltip'. */
function polishHalf(n, kind, x, y, w, h, side, c) {
	const ok = side === 'after';
	let g = '', html = '';
	if (kind === 'chevron') {
		// A collapsed section header that had stuck to the top: its chevron right (collapsed) or still down (wrong);
		// the next section's header follows right under it, since the section is folded away.
		const hy = y + 40;
		g += `<rect x="${r1(x)}" y="${r1(hy)}" width="${r1(w)}" height="56" rx="10" fill="var(--surface)" stroke="${INK}" stroke-width="3"/>`;
		g += chevron(x + 24, hy + 28, ok ? 'right' : 'down', 8, ok ? INK : 'var(--red)');
		html += tx(`${n}-ui`, x + 44, hy + 28, esc(c.text ?? ''), { nolint: true, align: 'm' });
		g += `<rect x="${r1(x)}" y="${r1(hy + 70)}" width="${r1(w)}" height="56" rx="10" fill="#fff" stroke="var(--line-strong)" stroke-width="3"/>`;
		g += chevron(x + 24, hy + 98, 'right', 8, 'var(--faint)');
		g += `<rect x="${r1(x + 44)}" y="${r1(hy + 92)}" width="${r1(w - 70)}" height="12" rx="6" fill="var(--line-strong)"/>`;
	} else if (kind === 'section') {
		// A sidebar with the active section clicked again, and what the main area shows.
		g += `<rect x="${r1(x)}" y="${r1(y + 20)}" width="${r1(w)}" height="${r1(h - 30)}" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
		g += `<path d="M ${P(x + 58, y + 20)} V ${r1(y + h - 10)}" stroke="var(--line-strong)" stroke-width="3"/>`;
		for (let i = 0; i < 4; i++) g += `<rect x="${r1(x + 8)}" y="${r1(y + 36 + i * 30)}" width="42" height="18" rx="5" fill="${i === 1 ? mix('blue', 30) : 'var(--line)'}"${i === 1 ? ` stroke="var(--blue)" stroke-width="2"` : ''}/>`;
		g += cursor(x + 34, y + 76, 0.9);
		const mx = x + 70, mw = w - 82;
		if (ok) {
			for (let i = 0; i < 4; i++) g += `<circle cx="${r1(mx + 8)}" cy="${r1(y + 46 + i * 30)}" r="5" fill="var(--blue)"/><rect x="${r1(mx + 20)}" y="${r1(y + 40 + i * 30)}" width="${r1(mw - 28 - (i % 2) * 22)}" height="12" rx="6" fill="var(--line-strong)"/>`;
		} else {
			g += `<rect x="${r1(mx)}" y="${r1(y + 34)}" width="${r1(mw)}" height="${r1(h - 58)}" rx="6" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>`;
			for (let i = 0; i < 5; i++) g += `<rect x="${r1(mx + 8)}" y="${r1(y + 46 + i * 22)}" width="${r1(mw - 16 - (i % 3) * 14)}" height="9" rx="4.5" fill="var(--line-strong)"/>`;
		}
	} else if (kind === 'glyph') {
		// The button, magnified: the 16 px box the glyph sits in (dashed), and the 12 px glyph left in it or centred.
		const bw = Math.min(w, 140), bx = x + (w - bw) / 2, by = y + 26, bh = 136, box = 96, k = box / 16;
		const qx = bx + (bw - box) / 2, qy = by + (bh - box) / 2, gs = 12 * k, gx = qx + (ok ? 2 * k : 0);
		g += `<rect x="${r1(bx)}" y="${r1(by)}" width="${r1(bw)}" height="${bh}" rx="16" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
		g += `<rect x="${r1(qx)}" y="${r1(qy)}" width="${box}" height="${box}" fill="none" stroke="var(--connector)" stroke-width="2.5" stroke-dasharray="6 6"/>`;
		html += icAt(gx + gs / 2, qy + box / 2, 'fork', r1(gs), INK);
		g += `<path d="M ${P(bx + bw / 2, by - 8)} V ${r1(by + bh + 8)}" stroke="var(--green)" stroke-width="2.5" stroke-dasharray="4 5"/>`;
		if (!ok) g += `<path d="M ${P(gx + gs / 2, by - 8)} V ${r1(by + bh + 8)}" stroke="var(--red)" stroke-width="2.5" stroke-dasharray="4 5"/>`;
	} else if (kind === 'tooltip') {
		// A button with its tooltip under it: the caret off centre, or on it.
		const bx = x + w / 2, by = y + 48;
		g += `<rect x="${r1(bx - 26)}" y="${r1(by - 26)}" width="52" height="52" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
		html += icAt(bx, by, 'fork', 30, INK);
		const off = ok ? 0 : -10, ty = by + 46, tw = w - 16;
		g += `<path d="M ${P(bx + off - 11, ty)} L ${P(bx + off, ty - 12)} L ${P(bx + off + 11, ty)} Z" fill="${INK}"/>`;
		g += `<rect x="${r1(bx - tw / 2 + off)}" y="${r1(ty)}" width="${r1(tw)}" height="48" rx="8" fill="${INK}"/>`;
		g += `<rect x="${r1(bx - tw / 2 + off + 16)}" y="${r1(ty + 19)}" width="${r1(tw - 32)}" height="10" rx="5" fill="#8a8d94"/>`;
		g += `<path d="M ${P(bx, by - 34)} V ${r1(ty + 60)}" stroke="var(--green)" stroke-width="2" stroke-dasharray="4 5"/>`;
		if (!ok) g += `<path d="M ${P(bx + off, ty - 14)} V ${r1(ty + 60)}" stroke="var(--red)" stroke-width="2" stroke-dasharray="4 5"/>`;
	}
	g += badge(x + w - 8, y + 18, ok);
	return { g, html };
}

/** Four inspection cards on the wall, one small fix each: what it looked like before (red cross) and after (green
 * tick), its result in a line, and its job tag hanging under the card. Fields: eyebrow, title, cards (4): [{ label,
 * kind, text (the chevron row's word), before, after (glyph images), value (the line), tone, tag: { num, date } }]. */
D['gwb-bench'] = {
	css: base('gwb-bench') + `
.gwb-bench .gwb-bench-ui { font-size: 20px; font-weight: 600; color: var(--ink); }
.gwb-bench .gwb-bench-val { font-size: 23px; font-weight: 600; color: var(--ink); text-align: center; white-space: normal; line-height: 1.2; }
.gwb-bench .gwb-bench-img { position: absolute; display: block; object-fit: cover; }
`,
	render(s) {
		const n = 'gwb-bench', H = bodyHeight(s), cards = s.cards ?? [];
		const cw = 402, gap = (W - cw * 4) / 3, ch = 420;
		let g = '', html = '';
		cards.forEach((c, i) => {
			const x = i * (cw + gap), cx = x + cw / 2;
			g += `<rect x="${r1(x + 2)}" y="2" width="${cw - 4}" height="${ch}" rx="${STYLE.radius}" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
			html += tx('gwb-lbl', x + 26, 24, esc(c.label ?? ''), { nolint: true });
			const hw = 150, top = 64, hh = 200;
			const L = polishHalf(n, c.kind, x + 26, top, hw, hh, 'before', c), R = polishHalf(n, c.kind, x + cw - 26 - hw, top, hw, hh, 'after', c);
			g += L.g + R.g + arrow(x + 26 + hw + 10, top + 100, x + cw - 26 - hw - 10, top + 100, { tone: 'blue', w: 3.5 });
			html += L.html + R.html;
			html += tx(`${n}-val ${c.tone ? `t-${c.tone} gwb-fg` : ''}`, cx, 304, fmt(c.value ?? ''), { w: cw - 40, align: 'c', nolint: !!c.nolint });
			if (c.tag) {
				const T = jobTag({ x: cx, y: ch + 52, w: 92, ...tagOpts(c.tag), key: `tag-${i}` });
				g += `<circle cx="${r1(cx)}" cy="${ch - 16}" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>` + tagString([cx, ch - 16], T.top, 1);
				html += T.html;
			}
		});
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}</div></div>`;
	},
};

// ---------- speed ----------

/** The stopwatch: before and after on one dial (the gap between the hands shaded green), the result read out on the
 * face; its job tag on a peg beside it. Right: the before-to-after rows on one scale, the ones that matter bold, a
 * calm line of scope. Fields: eyebrow, title, watch: { max, major, before, after, value, unit, from }, rows: [{ label,
 * before, after, change, hi }], scale: { max, ticks, unit }, legend: { before, after }, scope, job (the job tag). */
D['gwb-stopwatch'] = {
	css: base('gwb-stopwatch') + `
.gwb-stopwatch .gwb-stopwatch-dial { font-size: 22px; font-weight: 600; color: var(--muted); }
.gwb-stopwatch .gwb-stopwatch-read { font-size: 64px; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
.gwb-stopwatch .gwb-stopwatch-row { font-size: 27px; font-weight: 600; color: var(--ink); }
.gwb-stopwatch .gwb-stopwatch-v { font-size: 21px; font-weight: 600; font-family: var(--mono); }
.gwb-stopwatch .gwb-stopwatch-chg { font-size: 34px; font-weight: 700; letter-spacing: -.02em; }
.gwb-stopwatch .gwb-stopwatch-muted { color: var(--muted); }
`,
	render(s) {
		const n = 'gwb-stopwatch', H = bodyHeight(s), Wt = s.watch ?? {};
		const r = 236, cx = 420, cy = H - 34 - r;
		let g = bench(150, 740, H - 34, { rail: false, legs: false });
		const SWt = stopwatch(cx, cy, r, { max: Wt.max ?? 80, major: Wt.major ?? 10, minor: 2, sector: [Wt.after, Wt.before, 'green'], hands: [{ v: Wt.before, tone: 'neutral', w: 6 }, { v: Wt.after, tone: 'green', w: 9 }] });
		g += SWt.svg;
		let html = '';
		for (let v = 0; v < (Wt.max ?? 80); v += Wt.label ?? 20) {
			const [lx, ly] = SWt.pt(r * 0.62, SWt.ang(v));
			html += tx(`${n}-dial`, lx, ly, String(v), { nolint: true, align: 'cm' });
		}
		html += tx(`${n}-read t-green gwb-fg`, cx, cy - r * 0.43, `${esc(Wt.value ?? '')}<span style="font-size:34px"> ${esc(Wt.unit ?? '')}</span>`, { nolint: true, align: 'cm', on: '#ffffff' });
		html += tx(`${n}-dial`, cx, cy - r * 0.245, esc(Wt.from ?? ''), { nolint: true, align: 'cm', on: '#ffffff' });
		if (s.job) {
			const T = tagStrip(0, 124, H, s.job, { tagW: 92 });
			g = T.svg + g;
			html += T.html;
		}
		// The rows: one scale, before (grey) and after (green), the change on the right.
		const sx0 = 990, sx1 = 1510, max = s.scale?.max ?? 80, X = v => sx0 + (sx1 - sx0) * v / max;
		const lg = s.legend ?? {};
		g += `<circle cx="${sx0 + 8}" cy="34" r="10" fill="var(--neutral)"/><circle cx="${sx0 + 168}" cy="34" r="10" fill="var(--green)"/>`;
		html += tx('gwb-lbl', sx0 + 26, 34, esc(lg.before ?? 'Before'), { nolint: true, align: 'm' }) + tx('gwb-lbl t-green gwb-fg', sx0 + 186, 34, esc(lg.after ?? 'After'), { nolint: true, align: 'm' });
		(s.rows ?? []).forEach((row, i) => {
			const y = 140 + i * 128, hi = !!row.hi;
			html += tx(`${n}-row ${hi ? '' : `${n}-muted`}`, 790, y, esc(row.label), { nolint: true, align: 'm' });
			g += `<path d="M ${P(sx0, y)} H ${sx1}" stroke="var(--track)" stroke-width="10" stroke-linecap="round"/>`;
			g += `<path d="M ${P(X(row.after), y)} H ${r1(X(row.before))}" stroke="${hi ? mix('green', 55) : 'var(--line-strong)'}" stroke-width="10" stroke-linecap="round"/>`;
			g += `<circle cx="${r1(X(row.before))}" cy="${y}" r="15" fill="var(--neutral)" stroke="#fff" stroke-width="3"/>`;
			g += `<circle cx="${r1(X(row.after))}" cy="${y}" r="${hi ? 17 : 15}" fill="${hi ? 'var(--green)' : mix('green', 55)}" stroke="#fff" stroke-width="3"/>`;
			html += tx(`${n}-v ${n}-muted`, X(row.before), y - 54, esc(String(row.before)), { nolint: true, align: 'c' });
			html += tx(`${n}-v ${hi ? 't-green gwb-fg' : `${n}-muted`}`, X(row.after), y + 24, esc(String(row.after)), { nolint: true, align: 'c' });
			html += tx(`${n}-chg ${hi ? 't-green gwb-fg' : `${n}-muted`}`, W, y, esc(row.change), { nolint: true, align: 'r', style: 'transform:translate(-100%,-50%)' });
		});
		const ty = 140 + (s.rows?.length ?? 3) * 128 - 50;
		for (const v of s.scale?.ticks ?? [0, 20, 40, 60, 80]) {
			g += `<path d="M ${P(X(v), ty - 10)} V ${ty}" stroke="var(--connector)" stroke-width="2"/>`;
			html += tx('gwb-lbl', X(v), ty + 6, `${v}${v === max ? ` ${esc(s.scale?.unit ?? 'ms')}` : ''}`, { nolint: true, align: 'c' });
		}
		if (s.scope) html += tx('gwb-sub', 790, ty + 64, fmt(s.scope), { w: W - 790, style: 'white-space:normal' });
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}</div></div>`;
	},
};

/** A crate: one object in the queue. done: a green tick on it; lifted: drawn a little turned. */
function crate(x, y, s, { done = false, tone = 'neutral', rot = 0 } = {}) {
	const t = rot ? ` transform="rotate(${rot} ${r1(x + s / 2)} ${r1(y + s / 2)})"` : '';
	let g = `<g${t}><rect x="${r1(x)}" y="${r1(y)}" width="${s}" height="${s}" rx="6" fill="${done ? mix('green', 16) : mix(tone, 16)}" stroke="${INK}" stroke-width="3"/>`;
	g += `<path d="M ${P(x + 4, y + s * 0.3)} H ${r1(x + s - 4)} M ${P(x + 4, y + s * 0.7)} H ${r1(x + s - 4)}" stroke="${done ? mix('green', 45) : 'var(--line-strong)'}" stroke-width="3"/>`;
	if (done) g += badge(x + s / 2, y + s / 2, true, 16);
	return g + '</g>';
}

/** deepFreeze's worklist as a roller conveyor of crates, one row per version (one per click). shift: the first crate
 * is taken off and every other crate moves up one place (red arrows). cursor: an index marker walks along; the crates
 * stay put, the ones behind it done. The result on the right of each row. Fields: eyebrow, title, rows: [{ label,
 * code, mode: 'shift' | 'cursor', crates, done, value, unit, sub, tone, pill }], job (the job tag). */
D['gwb-queue'] = {
	clicks: true,
	css: base('gwb-queue') + `
.gwb-queue .gwb-queue-code { font-family: var(--mono); font-size: 24px; font-weight: 600; color: var(--ink); background: var(--surface); border: 2px solid var(--line-strong); border-radius: 8px; padding: 2px 10px; }
.gwb-queue .gwb-queue-lab { font-size: 21px; font-weight: 700; letter-spacing: .04em; }
.gwb-queue .gwb-queue-val { font-size: 84px; font-weight: 700; letter-spacing: -.04em; line-height: 1; }
.gwb-queue .gwb-queue-pill { font-size: 22px; font-weight: 700; border-radius: 999px; padding: 4px 14px; background: var(--tint); }
`,
	render(s, ctx = {}) {
		const n = 'gwb-queue', H = bodyHeight(s), step = ctx.step ?? Infinity;
		const rows = s.rows ?? [], rowH = 300;
		let g = '', html = '';
		rows.forEach((row, i) => {
			const y0 = i * (H - rowH), hidden = step < i + 1, hv = hidden ? 'visibility:hidden;' : '', key = `row-${i}`;
			let rg = '';
			html += tx(`${n}-lab ${row.tone ? `t-${row.tone} gwb-fg` : ''}`, 0, y0 + 2, esc(row.label ?? ''), { nolint: true, key: `${key}-l`, style: hv });
			html += tx(`${n}-code`, 0, y0 + 40, esc(row.code ?? ''), { nolint: true, key: `${key}-c`, style: hv });
			// The conveyor: a belt on rollers, two legs.
			const bx0 = 0, bx1 = 1124, by = y0 + 214;
			for (const lx of [bx0 + 30, bx1 - 50]) rg += `<rect x="${lx}" y="${by + 24}" width="20" height="${r1(rowH - 238)}" fill="${mix('neutral', 16)}" stroke="${INK}" stroke-width="3"/>`;
			rg += `<rect x="${bx0}" y="${by}" width="${bx1 - bx0}" height="30" rx="15" fill="${mix('neutral', 22)}" stroke="${INK}" stroke-width="3"/>`;
			for (let x = bx0 + 24; x < bx1 - 10; x += 52) rg += `<circle cx="${x}" cy="${by + 15}" r="8" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
			const nC = row.crates ?? 9, cs = 82, step2 = 108, cx0 = 150;
			for (let k = 0; k < nC; k++) {
				const x = cx0 + k * step2;
				if (row.mode === 'shift' && k === 0) {
					rg += crate(x - 128, by - cs - 40, cs, { done: true, rot: -10 });
					rg += arrow(x + cs / 2 - 10, by - 10, x - 128 + cs + 12, by - 60, { tone: 'blue', w: 4, bend: -6 });
					continue;
				}
				rg += crate(x, by - cs, cs, { done: row.mode === 'cursor' && k < (row.done ?? 4) });
				if (row.mode === 'shift') rg += arrow(x + cs * 0.72, by - cs - 22, x + cs * 0.28 - 30, by - cs - 22, { tone: 'red', w: 4 });
			}
			if (row.mode === 'cursor') {
				const k = row.done ?? 4, mx = cx0 + k * step2 + cs / 2;
				rg += `<path d="M ${P(mx, by + 34)} L ${P(mx - 16, by + 62)} H ${r1(mx + 16)} Z" fill="var(--blue)" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
				html += tx(`${n}-code`, mx + 30, by + 34, esc(row.marker ?? 'index'), { nolint: true, key: `${key}-m`, style: hv });
			}
			g += `<g data-key="${key}-g"${hidden ? ' visibility="hidden"' : ''}>${rg}</g>`;
			// The result.
			const rx = 1196;
			html += tx(`${n}-val t-${row.tone ?? 'neutral'} gwb-fg`, rx, y0 + 70, `${esc(row.value ?? '')}<span style="font-size:44px"> ${esc(row.unit ?? '')}</span>`, { nolint: true, key: `${key}-v`, style: hv });
			if (row.sub) html += tx('gwb-sub', rx + 4, y0 + 176, fmt(row.sub), { key: `${key}-s`, style: hv });
			if (row.pill) html += tx(`${n}-pill t-${row.tone ?? 'green'} gwb-fg`, rx + 4, y0 + 222, fmt(row.pill), { key: `${key}-p`, style: hv });
		});
		if (s.job) {
			const T = tagStrip(W - 112, 112, H, s.job, { tagW: 88 });
			g = T.svg + g;
			html += T.html;
		}
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}</div></div>`;
	},
};

/** A URI as a strip of letter tiles, twice. Before: one hop over every letter, a tick under each. After: one long
 * jump to the first #, the run before it and the run after it bracketed as copied whole, the # itself escaped. The
 * result on the right. Fields: eyebrow, title, text, hit (index of the #), escaped ('%23'), rows: [label, label],
 * hop, jump, copied, fast (labels), result: { value, unit, from, pill, other }, job (the job tag). */
D['gwb-tape'] = {
	css: base('gwb-tape') + `
.gwb-tape .gwb-tape-ch { font-family: var(--mono); font-size: 34px; font-weight: 600; color: var(--ink); text-align: center; }
.gwb-tape .gwb-tape-esc { font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--orange); text-align: center; }
.gwb-tape .gwb-tape-val { font-size: 92px; font-weight: 700; letter-spacing: -.04em; line-height: 1; }
.gwb-tape .gwb-tape-pill { font-size: 22px; font-weight: 700; border-radius: 999px; padding: 4px 14px; background: var(--tint); }
`,
	render(s) {
		const n = 'gwb-tape', H = bodyHeight(s), chars = [...(s.text ?? '')], hit = s.hit ?? chars.indexOf('#');
		const tw = 58, tg = 8, x0 = 6, th = 72;
		const X = i => x0 + i * (tw + tg);
		let g = '', html = '';
		const rows = s.rows ?? [];
		[0, 1].forEach(r => {
			const y0 = 24 + r * 330, ty = y0 + 116;
			html += tx('gwb-lbl', 0, y0 + 4, esc(rows[r] ?? ''), { nolint: true });
			chars.forEach((c, i) => {
				const esc2 = i === hit;
				g += `<rect x="${r1(X(i))}" y="${ty}" width="${tw}" height="${th}" rx="8" fill="${esc2 ? mix('orange', 14) : '#fff'}" stroke="${esc2 ? 'var(--orange)' : INK}" stroke-width="3"/>`;
				html += esc2 ? tx(`${n}-esc`, X(i) + tw / 2, ty + th / 2, esc(s.escaped ?? '%23'), { nolint: true, align: 'cm' })
					: tx(`${n}-ch`, X(i) + tw / 2, ty + th / 2, esc(c), { nolint: true, align: 'cm' });
			});
			if (r === 0) {
				// One hop per letter, and a tick under each.
				chars.forEach((_, i) => {
					const a = X(i) + tw / 2, b = i + 1 < chars.length ? X(i + 1) + tw / 2 : null;
					if (b) g += `<path d="M ${P(a + 4, ty - 8)} Q ${P((a + b) / 2, ty - 44)} ${P(b - 4, ty - 8)}" fill="none" stroke="var(--red)" stroke-width="3" stroke-linecap="round"/>`;
					g += `<circle cx="${r1(a)}" cy="${ty + th + 20}" r="6" fill="var(--red)"/>`;
				});
				html += tx(`gwb-sub t-red gwb-fg`, X(chars.length - 1) + tw + 24, ty + th / 2, fmt(s.hop ?? ''), { align: 'm' });
			} else {
				// One jump to the #, and the two runs copied whole.
				const a = X(0) + tw / 2, b = X(hit) + tw / 2;
				g += arrow(a, ty - 10, b, ty - 12, { tone: 'blue', bend: -90, w: 4 });
				html += tx('gwb-lbl t-blue gwb-fg', (a + b) / 2, ty - 92, esc(s.jump ?? ''), { nolint: true, align: 'c' });
				const brk = (i0, i1) => {
					const xa = X(i0) + 4, xb = X(i1) + tw - 4, yb = ty + th + 12;
					g += `<path d="M ${P(xa, yb)} V ${yb + 16} H ${r1(xb)} V ${yb}" fill="none" stroke="var(--green)" stroke-width="4" stroke-linejoin="round"/>`;
					html += tx('gwb-lbl t-green gwb-fg', (xa + xb) / 2, yb + 26, esc(s.copied ?? ''), { nolint: true, align: 'c' });
				};
				brk(0, hit - 1);
				if (hit + 1 < chars.length) brk(hit + 1, chars.length - 1);
				html += tx(`gwb-sub t-green gwb-fg`, X(chars.length - 1) + tw + 24, ty + th / 2, fmt(s.fast ?? ''), { align: 'm' });
			}
		});
		// The result.
		const R = s.result ?? {}, rx = 1270;
		html += tx(`${n}-val t-green gwb-fg`, rx, 112, `${esc(R.value ?? '')}<span style="font-size:44px"> ${esc(R.unit ?? '')}</span>`, { nolint: true });
		html += tx('gwb-sub', rx + 4, 226, fmt(R.from ?? ''), { nolint: true });
		if (R.pill) html += tx(`${n}-pill t-green gwb-fg`, rx + 4, 304, fmt(R.pill), { nolint: true });
		if (R.other) html += tx('gwb-sub', rx + 4, 368, fmt(R.other), { nolint: true });
		if (s.scope) html += tx('gwb-sub', rx + 4, 440, fmt(s.scope), { w: W - 130 - rx, style: 'white-space:normal' });
		if (s.job) {
			const T = tagStrip(W - 112, 112, H, s.job, { tagW: 88 });
			g = T.svg + g;
			html += T.html;
		}
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}</div></div>`;
	},
};

// ---------- terminal ----------

/** A terminal on a dark screen: a command fails, and the next prompt shows the fix as dim ghost text with a TAB chip
 * after it, as the pull request draws it. A dotted leader runs from each TAB chip to what made the fix: built-in (blue,
 * an icon) or Copilot (purple, its logo). The job tag on a pegboard strip at the right. Fields: eyebrow, title, window,
 * prompt, lines: [{ cmd } | { out } | { ghost, kind: 'builtin' | 'ai' }], legend: { builtin: { text, icon }, ai: { text,
 * logo } }, keys: { caps: ['Tab'] }, job (the job tag; the slide's own tag is the pill by the title). */
D['gwb-terminal'] = {
	css: base('gwb-terminal') + `
.gwb-terminal .gwb-terminal-line { font-family: var(--mono); font-size: 27px; font-weight: 500; color: #f3f3f3; }
.gwb-terminal .gwb-terminal-p { color: #6cb8f6; }
.gwb-terminal .gwb-terminal-err { color: #f1707b; }
.gwb-terminal .gwb-terminal-ghost { color: #8a8d94; }
.gwb-terminal .gwb-terminal-tab { font-size: 16px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #c8cad0; }
.gwb-terminal .gwb-terminal-leg { display: flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 600; color: var(--ink); }
`,
	render(s) {
		const n = 'gwb-terminal', H = bodyHeight(s);
		const ww = 1040, wh = H - 6, lines = s.lines ?? [], CH = 16.25;
		let g = `<rect x="1.5" y="1.5" width="${ww - 3}" height="${wh - 3}" rx="${STYLE.radius}" fill="#1b1b1f" stroke="${INK}" stroke-width="3"/>`;
		g += `<path d="M 0 58 H ${ww}" stroke="#3a3d45" stroke-width="2"/><path d="M 30 56 H 150" stroke="#6cb8f6" stroke-width="3"/>`;
		let html = tx(`${n}-tab`, 32, 30, esc(s.window ?? 'Terminal'), { nolint: true, align: 'm', on: '#1b1b1f' });
		const pr = s.prompt ?? 'PS>';
		const prompt = `<span class="${n}-p">${esc(pr)}</span> `;
		const legX = ww + 70, legW = 300;
		lines.forEach((ln, i) => {
			const y = 112 + i * 82;
			if (ln.cmd) html += tx(`${n}-line`, 36, y, `${prompt}${esc(ln.cmd)}`, { nolint: true, align: 'm', on: '#1b1b1f' });
			else if (ln.out) html += tx(`${n}-line ${n}-err`, 36, y, esc(ln.out), { nolint: true, align: 'm', on: '#1b1b1f' });
			else if (ln.ghost) {
				const ai = ln.kind === 'ai', tone = ai ? 'purple' : 'blue';
				const pw = (pr.length + 1) * CH, gw = ln.ghost.length * CH;
				html += tx(`${n}-line`, 36, y, prompt, { nolint: true, align: 'm', on: '#1b1b1f' });
				g += `<path d="M ${P(36 + pw, y - 20)} V ${r1(y + 20)}" stroke="#f3f3f3" stroke-width="3"/>`;
				html += tx(`${n}-line ${n}-ghost`, 38 + pw, y, esc(ln.ghost), { nolint: true, align: 'm', on: '#1b1b1f' });
				const kx = 60 + pw + gw;
				g += `<rect x="${r1(kx)}" y="${r1(y - 22)}" width="64" height="44" rx="8" fill="#2b2d33" stroke="var(--${tone})" stroke-width="2.5"/>`;
				html += tx(`${n}-tab`, kx + 32, y, esc(s.keys?.caps?.[0] ?? 'Tab'), { nolint: true, align: 'cm', on: '#2b2d33' });
				// A leader from the chip, out of the window, to what made the fix.
				g += `<path d="M ${P(kx + 76, y)} H ${r1(legX - 8)}" stroke="var(--${tone})" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
				const L = s.legend?.[ai ? 'ai' : 'builtin'] ?? {};
				const mark = L.logo ? logo(L.logo, 40) : ic(L.icon ?? 'wrench', 34, `var(--${tone})`);
				g += `<rect x="${legX}" y="${r1(y - 38)}" width="${r1(legW)}" height="76" rx="14" fill="${mix(tone, 10)}" stroke="var(--${tone})" stroke-width="3"/>`;
				html += `<div class="gwb-a ${n}-leg" style="${at(legX + 22, y)};transform:translateY(-50%)">${mark}<span data-t>${fmt(L.text ?? '')}</span></div>`;
			}
		});
		if (s.job) {
			const T = tagStrip(W - 112, 112, H, s.job, { tagW: 88 });
			g = T.svg + g;
			html += T.html;
		}
		return heading(s) + `<div class="body"><div class="${n}" style="height:${H}px">${svg(W, H, g)}${html}</div></div>`;
	},
};

// ---------- close ----------

/** A close on a blue page: a wall rail with two black S-hooks. On one, a split ring through the eyelets of the merged
 * tags, fanned, the newest in front; on the other, the open one alone. Each count is big beneath its hook. Left:
 * eyebrow, title, sub, speaker. Fields: eyebrow, title, sub, speaker, logo, merged: { count, top: { num, date }, label },
 * open: { num, date, label, count }. */
D['gwb-close'] = {
	bare: true,
	css: base('gwb-close', { bare: true }) + coverCss('gwb-close', 820) + `
.gwb-close .tf-quote, .gwb-close .tf-name, .gwb-close .tf-role { color: #fff; }
.gwb-close .tf-avatar { background: #fff; color: var(--blue); }
.gwb-close .gwb-close-big { font-size: 120px; font-weight: 700; letter-spacing: -.045em; line-height: .9; color: #fff; }
.gwb-close .gwb-close-lab { font-size: 28px; font-weight: 600; color: #fff; }
`,
	render(s) {
		const n = 'gwb-close', M = s.merged ?? {}, O = s.open ?? {};
		let g = '', front = '', html = '';
		const W2 = 'rgba(255,255,255,.92)';
		// A wall rail: a rounded bar on two brackets, each held by two screws.
		const railY = 300, rx0 = 1060, rx1 = 1810;
		for (const bx of [rx0 + 40, rx1 - 40]) {
			g += `<rect x="${bx - 22}" y="${railY - 34}" width="44" height="58" rx="8" fill="${mix('blue', 55, '#fff')}" stroke="#fff" stroke-width="3"/>`
				+ `<circle cx="${bx}" cy="${railY - 20}" r="4.5" fill="#fff"/><circle cx="${bx}" cy="${railY + 10}" r="4.5" fill="#fff"/>`;
		}
		g += `<rect x="${rx0}" y="${railY - 9}" width="${rx1 - rx0}" height="18" rx="9" fill="#fff" stroke="#fff" stroke-width="2"/>`
			+ `<rect x="${rx0 + 8}" y="${railY - 6}" width="${rx1 - rx0 - 16}" height="4" rx="2" fill="${mix('blue', 25, '#fff')}"/>`;
		// An S-hook over the rail at x (black): the top curl wraps the bar, the bottom curl opens upward at hookY.
		const hookY = railY + 70;
		const sHook = x => `<path d="M ${x - 12} ${railY - 2} C ${x - 14} ${railY - 22}, ${x + 14} ${railY - 22}, ${x + 12} ${railY - 4} L ${x} ${hookY - 24} C ${x - 4} ${hookY}, ${x + 22} ${hookY + 6}, ${x + 18} ${hookY - 14}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
		// A black split ring hanging in the hook, through the tags' eyelets: the whole ring is drawn behind the tags,
		// and in front only the arc from the tag's top edge down into the eyelet, so below the hole it goes behind.
		const ringThrough = (cx, eyeY, R, tagTop) => {
			const cy = eyeY - R;
			const back = `<circle cx="${cx}" cy="${r1(cy)}" r="${R}" fill="none" stroke="${INK}" stroke-width="5"/>`;
			const sn = Math.max(-1, Math.min(1, (tagTop - cy) / R)), th = Math.PI - Math.asin(sn);
			const fx = cx + R * Math.cos(th), fy = cy + R * Math.sin(th);
			const front = `<path d="M ${P(fx, fy)} A ${R} ${R} 0 0 0 ${P(cx, eyeY)}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
			return { back, front };
		};
		const p1 = 1300, p2 = 1660, tagW = 124, hy = tagW * 0.2;
		const count = M.count ?? 11, R1 = 34, eye1 = hookY - 6 + 2 * R1;
		g += sHook(p1);
		const ring1 = ringThrough(p1, eye1, R1, eye1 - hy);
		g += ring1.back;
		const spread = 22;
		for (let i = 0; i < count; i++) {
			const top = i === count - 1, rot = top ? 0 : (i - (count - 1)) * (spread / Math.max(1, count - 1)) + spread / 2;
			html += jobTag({ x: p1, y: eye1, w: tagW, string: false, rot, ...(top ? tagOpts(M.top ?? {}) : { num: null, date: null, word: null }) }).html;
		}
		front += ring1.front;
		g += sHook(p2);
		const R2 = 22, eye2 = hookY - 6 + 2 * R2, ring2 = ringThrough(p2, eye2, R2, eye2 - hy);
		g += ring2.back;
		html += jobTag({ x: p2, y: eye2, w: tagW, string: false, ...tagOpts({ ...O, state: 'open' }) }).html;
		front += ring2.front;
		html += tx(`${n}-big`, p1, 740, String(count), { nolint: true, align: 'c' }) + tx(`${n}-lab`, p1, 860, fmt(M.label ?? 'merged'), { align: 'c' });
		html += tx(`${n}-big`, p2, 740, String(O.count ?? 1), { nolint: true, align: 'c' }) + tx(`${n}-lab`, p2, 860, fmt(O.label ?? 'open'), { align: 'c' });
		return `<div class="${n}">${svg(1920, 1080, g)}${html}<svg class="gwb-svg" width="1920" height="1080" viewBox="0 0 1920 1080">${front}</svg>${coverText(s, n, { light: true })}</div>`;
	},
};

export const designs = D;
