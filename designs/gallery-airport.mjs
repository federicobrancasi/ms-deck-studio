// A gallery for inspiration (the airport customs world): read it for technique: one luggage tag helper that carries
// what is in the bag on every slide, a scanner whose screen lights one cell per check, belts that sort bags into two
// ends. A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as they are.
// The world: each bag rides a belt with a luggage tag; the quick check is the X-ray scanner (its screen lights one
// cell per question); "could it be dangerous?" is the scanner, "does it match the form?" the gate; a bag either rides
// up to the green gate (it goes through) or reaches the desk where it is opened with you. Today's check is an officer
// in purple. Every visible word comes from the slide's fields.
// examples/green-channel.mjs uses every design here (gap-*).
import { STYLE, at, body, bodyHeight, esc, fmt, heading, ic, laptop, msLogo, pill, r1, t } from '../src/kit.mjs';

const SW = STYLE.stroke;
// The drawing colours are CSS variables, so a dark page can redraw the same objects in light lines.
const LINE = 'var(--gap-line)', PAPER = 'var(--gap-paper)', METAL = 'var(--gap-metal)', SCREEN = 'var(--gap-screen)';
const svgEl = (w, h, inner) => `<svg class="gap-svg" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;
/** The click being drawn; without clicks, the whole picture. */
const stepOf = ctx => (ctx?.step >= 1 ? ctx.step : 99);

/** CSS shared by every design of this world, scoped to the design n. */
const base = n => `
.${n} { position: relative; width: 1728px; --gap-line: var(--ink); --gap-paper: #fff; --gap-metal: var(--line-strong); --gap-screen: #1f232b; }
.${n} .gap-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .gap-x { position: absolute; white-space: nowrap; text-wrap-style: balance; }
.${n} .gap-shape { position: absolute; }
.${n} .gap-tagtx { position: absolute; font-family: var(--mono); color: var(--ink); white-space: nowrap; }
.${n} .gap-cap { font-size: 19px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--fg); }
.${n} .gap-lbl { font-size: 26px; font-weight: 600; color: var(--ink); }
.${n} .gap-sub { font-size: 22px; color: var(--body); }
.${n} .gap-scr { font-size: 22px; font-weight: 600; color: #fff; }
.${n} .gap-sign { display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 22px; border-radius: 10px; background: var(--fg); color: #fff; font-size: 28px; font-weight: 700; }
.${n} .gap-flag { font-size: 21px; font-weight: 700; line-height: 1.2; color: var(--fg); }
.${n} .gap-notice { position: absolute; background: #fff; border: 4px solid var(--line-strong); border-radius: 18px; overflow: hidden; }
.${n} .gap-notice.gap-on { border-color: var(--orange); }
.${n} .gap-notice.gap-ghost { opacity: .45; }
.${n} .gap-pr-bar { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 16px; background: var(--surface); border-bottom: 2px solid var(--line); font-size: 17px; font-weight: 600; color: var(--muted); }
.${n} .gap-pr-bar i { display: block; width: 10px; height: 10px; border-radius: 50%; background: var(--line-strong); }
.${n} .gap-pr-bar span { margin-left: 6px; }
.${n} .gap-pr-in { padding: 16px 22px 20px; }
.${n} .gap-pr-head { display: flex; align-items: center; gap: 12px; font-size: 27px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.${n} .gap-pr-head .ic { color: var(--orange); }
.${n} .gap-pr-why { margin-top: 8px; font-size: 22px; line-height: 1.35; color: var(--body); }
.${n} .gap-pr-btns { display: flex; gap: 10px; margin-top: 14px; }
.${n} .gap-pr-head .gap-pr-btns { margin: 0 0 0 auto; }
.${n} .gap-btn { padding: 5px 20px; border-radius: 8px; font-size: 21px; font-weight: 600; background: var(--blue-tint); color: var(--blue); }
.${n} .gap-btn.gap-solid { background: var(--blue); color: #fff; }
.${n} .gap-notice.gap-small { border-width: 0; border-radius: 6px; }
.${n} .gap-notice.gap-small .gap-pr-bar { height: 26px; font-size: 14px; padding: 0 10px; gap: 6px; }
.${n} .gap-notice.gap-small .gap-pr-bar i { width: 8px; height: 8px; }
.${n} .gap-notice.gap-small .gap-pr-in { padding: 12px 14px 14px; }
.${n} .gap-notice.gap-small .gap-pr-head { font-size: 21px; gap: 8px; }
.${n} .gap-notice.gap-small .gap-btn { font-size: 17px; padding: 4px 14px; }
`;

/** A text element at (x, y): align 'c' centres it on x, 'r' ends it at x, 'cc' centres it both ways.
 * o: { w, h, tone, nolint, wrap (let it wrap within w), style }. */
function tx(cls, x, y, html, o = {}) {
	const shift = o.align === 'c' ? ';transform:translateX(-50%)' : o.align === 'r' ? ';transform:translateX(-100%)' : o.align === 'cc' ? ';transform:translate(-50%,-50%)' : '';
	const wrap = o.wrap ? ';white-space:normal' : '';
	return t(`gap-x ${cls}${o.tone ? ` t-${o.tone}` : ''}`, `${at(x, y, o.w, o.h)}${shift}${wrap}${o.style ?? ''}`, html, { nolint: !!o.nolint });
}

/** A line with an open arrowhead at its tip. ang: the direction at the tip, in degrees (0 = right, 90 = down). */
function arrow(d, tip, ang, o = {}) {
	const col = o.color ?? 'var(--connector)', sw = o.sw ?? 4;
	return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`
		+ `<path d="M -14 -11 L 0 0 L -14 11" transform="translate(${r1(tip[0])} ${r1(tip[1])}) rotate(${ang})" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// ---------- the luggage tag: the recurring object ----------

/** The tag's shape: clipped corners at the eyelet end (left), the end tinted by tone (neutral before a decision, green
 * when it goes through, orange when it is opened), a reinforced eyelet, and, with from, a string tied to a bag's handle.
 * Returns { svg, end } (end: the width of the tinted end; the writing starts after it). */
function tagShape(x, y, w, h, o = {}) {
	const c = Math.min(h * 0.3, 24), end = o.end ?? Math.round(Math.min(h * 0.62, 50));
	const tone = o.tone ?? 'neutral', fill = tone === 'neutral' ? 'var(--line-strong)' : `var(--${tone})`;
	const sw = o.sw ?? 3, ex = x + end * 0.45, ey = y + h / 2, er = Math.max(5, Math.min(h * 0.13, 9));
	const outline = `M ${r1(x + c)} ${r1(y)} H ${r1(x + w - 10)} Q ${r1(x + w)} ${r1(y)} ${r1(x + w)} ${r1(y + 10)} V ${r1(y + h - 10)} Q ${r1(x + w)} ${r1(y + h)} ${r1(x + w - 10)} ${r1(y + h)} H ${r1(x + c)} L ${r1(x)} ${r1(y + h - c)} V ${r1(y + c)} Z`;
	let svg = `<path d="${outline}" fill="${PAPER}"/>`;
	svg += `<path d="M ${r1(x + end)} ${r1(y)} H ${r1(x + c)} L ${r1(x)} ${r1(y + c)} V ${r1(y + h - c)} L ${r1(x + c)} ${r1(y + h)} H ${r1(x + end)} Z" fill="${fill}"/>`;
	svg += `<path d="${outline}" fill="none" stroke="${LINE}" stroke-width="${sw}" stroke-linejoin="round"/>`;
	svg += `<line x1="${r1(x + end)}" y1="${r1(y)}" x2="${r1(x + end)}" y2="${r1(y + h)}" stroke="${LINE}" stroke-width="${sw}"/>`;
	svg += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(er)}" fill="${PAPER}" stroke="${LINE}" stroke-width="2.5"/>`;
	if (o.from) {
		const [fx, fy] = o.from;
		svg += `<path d="M ${r1(fx)} ${r1(fy)} C ${r1(fx - 6)} ${r1((fy + ey) / 2 + 10)} ${r1(ex + 4)} ${r1(ey - 40)} ${r1(ex)} ${r1(ey)}" fill="none" stroke="${LINE}" stroke-width="2.5" stroke-linecap="round"/>`;
	}
	return { svg, end };
}

/** A one-line luggage tag at (x, y) with a label on it, sized to the text. o: { fs, h, w, tone, from: [x, y] }.
 * Returns { svg, html, w, h }. */
function luggageTag(x, y, text, o = {}) {
	const fs = o.fs ?? 24, h = o.h ?? Math.round(fs * 1.75);
	const end = Math.round(Math.min(h * 0.62, 50));
	const w = o.w ?? Math.round(String(text).length * fs * 0.61 + end + 32);
	const shape = tagShape(x, y, w, h, { tone: o.tone, from: o.from, end });
	const html = `<div class="gap-shape" data-shape style="${at(x + end, y, w - end, h)}">${t('gap-tagtx', `left:14px;top:0;height:${h}px;line-height:${h}px;font-size:${fs}px`, esc(text ?? ''), { nolint: true })}</div>`;
	return { svg: shape.svg, html, w, h };
}

/** The tag standing on its own: a caption above, the one-line tag, an optional note under it.
 * o: { cap, label, note: { icon, text }, fs, tone }. Returns { svg, html, w, h } (h: the tag's bottom, from y). */
function bagTag(x, y, o = {}) {
	const tg = luggageTag(x, y + 38, o.label ?? '', { fs: o.fs ?? 28, tone: o.tone });
	let html = tx('gap-cap t-blue', x, y, fmt(o.cap ?? ''), { nolint: true }) + tg.html;
	if (o.note) {
		html += tx('gap-sub', x + 4, y + 38 + tg.h + 14, `${ic(o.note.icon ?? 'dismissCircle', 24, 'var(--muted)')} ${fmt(o.note.text ?? '')}`, { style: ';display:flex;align-items:center;gap:10px' });
	}
	return { svg: tg.svg, html, w: tg.w, h: 38 + tg.h };
}

// ---------- bags, belts and machines ----------

const SHADES = { dark: ['#3a3d45', '#5c606a'], grey: ['#8b909a', '#6b7079'], silver: ['#cfd4dc', '#a1a7b1'] };

/** A bag standing on y (a belt or a desk), centred on cx, h tall. kind: 'case' (a hard-shell spinner: ribs, a
 * telescopic handle, wheels), 'duffel' (a zip, two handles, round end panels), 'pack' (a backpack: a grab loop, a
 * front pocket, a side strap). shade: 'dark' | 'grey' | 'silver'. o.xray draws it as the scanner sees it (blue lines,
 * with what's packed inside). Returns { svg, handle: [x, y] } (where a tag is tied). */
function bag(kind, cx, y, h, shade = 'dark', o = {}) {
	const ln = o.xray ? '#62b3f2' : LINE;
	const [fill, rib] = o.xray ? ['none', '#62b3f2'] : SHADES[shade] ?? SHADES.dark;
	let s = '', handle;
	if (kind === 'case') {
		const wh = Math.max(6, h * 0.07), bh = h * 0.72, bw = h * 0.6, x = cx - bw / 2, top = y - wh - bh;
		const hx1 = cx - bw * 0.22, hx2 = cx + bw * 0.22, ht = top - h * 0.2;
		s += `<path d="M ${r1(hx1)} ${r1(top)} V ${r1(ht)} H ${r1(hx2)} V ${r1(top)}" fill="none" stroke="${ln}" stroke-width="${SW}" stroke-linejoin="round"/>`;
		s += `<rect x="${r1(hx1 - 6)}" y="${r1(ht - 7)}" width="${r1(hx2 - hx1 + 12)}" height="14" rx="7" fill="${ln}"/>`;
		[0.2, 0.8].forEach(f => { s += `<rect x="${r1(x + bw * f - 7)}" y="${r1(y - wh - 2)}" width="14" height="${r1(wh + 2)}" rx="5" fill="${ln}"/>`; });
		s += `<rect x="${r1(x)}" y="${r1(top)}" width="${r1(bw)}" height="${r1(bh)}" rx="${r1(bw * 0.14)}" fill="${fill}" stroke="${ln}" stroke-width="${SW}"/>`;
		[0.3, 0.5, 0.7].forEach(f => { s += `<line x1="${r1(x + bw * f)}" y1="${r1(top + bh * 0.13)}" x2="${r1(x + bw * f)}" y2="${r1(top + bh * 0.87)}" stroke="${rib}" stroke-width="4" stroke-linecap="round"/>`; });
		const sy = top + bh * 0.3;
		s += `<path d="M ${r1(x)} ${r1(sy - 12)} h -7 v 24 h 7" fill="none" stroke="${ln}" stroke-width="3" stroke-linejoin="round"/>`;
		handle = [x - 7, sy];
	} else if (kind === 'duffel') {
		const bh = h, bw = h * 1.8, x = cx - bw / 2, top = y - bh, rr = bh * 0.42;
		const a = cx - bw * 0.22, b = cx + bw * 0.22;
		s += `<path d="M ${r1(a)} ${r1(top + 6)} C ${r1(a)} ${r1(top - bh * 0.5)} ${r1(b)} ${r1(top - bh * 0.5)} ${r1(b)} ${r1(top + 6)}" fill="none" stroke="${ln}" stroke-width="${SW + 2}" stroke-linecap="round"/>`;
		s += `<rect x="${r1(x)}" y="${r1(top)}" width="${r1(bw)}" height="${r1(bh)}" rx="${r1(rr)}" fill="${fill}" stroke="${ln}" stroke-width="${SW}"/>`;
		s += `<path d="M ${r1(x + rr)} ${r1(top + 3)} C ${r1(x + rr * 1.55)} ${r1(top + bh * 0.3)} ${r1(x + rr * 1.55)} ${r1(top + bh * 0.7)} ${r1(x + rr)} ${r1(y - 3)} M ${r1(x + bw - rr)} ${r1(top + 3)} C ${r1(x + bw - rr * 1.55)} ${r1(top + bh * 0.3)} ${r1(x + bw - rr * 1.55)} ${r1(top + bh * 0.7)} ${r1(x + bw - rr)} ${r1(y - 3)}" fill="none" stroke="${rib}" stroke-width="4"/>`;
		s += `<line x1="${r1(x + rr * 1.5)}" y1="${r1(top + bh * 0.2)}" x2="${r1(x + bw - rr * 1.5)}" y2="${r1(top + bh * 0.2)}" stroke="${o.xray ? rib : '#c9cdd4'}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>`;
		if (o.xray) {
			// What the scanner sees inside: a laptop, a cable, a bottle.
			s += `<rect x="${r1(x + rr * 1.6)}" y="${r1(top + bh * 0.36)}" width="${r1(bw * 0.36)}" height="${r1(bh * 0.4)}" rx="5" fill="none" stroke="${rib}" stroke-width="3"/>`;
			s += `<path d="M ${r1(cx + bw * 0.08)} ${r1(top + bh * 0.7)} q 18 -26 36 0 t 36 0" fill="none" stroke="${rib}" stroke-width="3" stroke-linecap="round"/>`;
		}
		handle = [a, top + 6];
	} else {
		const bw = h * 0.72, x = cx - bw / 2, top = y - h;
		s += `<path d="M ${r1(cx - 14)} ${r1(top + 8)} C ${r1(cx - 14)} ${r1(top - 22)} ${r1(cx + 14)} ${r1(top - 22)} ${r1(cx + 14)} ${r1(top + 8)}" fill="none" stroke="${ln}" stroke-width="${SW}" stroke-linecap="round"/>`;
		s += `<path d="M ${r1(x + 6)} ${r1(top + h * 0.26)} C ${r1(x - 16)} ${r1(top + h * 0.45)} ${r1(x - 16)} ${r1(top + h * 0.72)} ${r1(x + 6)} ${r1(y - 14)}" fill="none" stroke="${ln}" stroke-width="${SW}" stroke-linecap="round"/>`;
		s += `<path d="M ${r1(x)} ${r1(y - 10)} V ${r1(top + bw * 0.45)} C ${r1(x)} ${r1(top - 4)} ${r1(x + bw)} ${r1(top - 4)} ${r1(x + bw)} ${r1(top + bw * 0.45)} V ${r1(y - 10)} Q ${r1(x + bw)} ${r1(y)} ${r1(x + bw - 10)} ${r1(y)} H ${r1(x + 10)} Q ${r1(x)} ${r1(y)} ${r1(x)} ${r1(y - 10)} Z" fill="${fill}" stroke="${ln}" stroke-width="${SW}" stroke-linejoin="round"/>`;
		s += `<rect x="${r1(x + bw * 0.16)}" y="${r1(top + h * 0.52)}" width="${r1(bw * 0.68)}" height="${r1(h * 0.36)}" rx="9" fill="${rib}" stroke="${ln}" stroke-width="3"/>`;
		s += `<line x1="${r1(x + bw * 0.24)}" y1="${r1(top + h * 0.6)}" x2="${r1(x + bw * 0.76)}" y2="${r1(top + h * 0.6)}" stroke="${o.xray ? rib : '#c9cdd4'}" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>`;
		handle = [x - 10, top + h * 0.5];
	}
	return { svg: s, handle };
}

/** A leg from top down to the floor, with a foot. */
function leg(x, top, floor) {
	return `<rect x="${r1(x - 7)}" y="${r1(top)}" width="14" height="${r1(floor - top - 8)}" fill="${METAL}" stroke="${LINE}" stroke-width="3"/><rect x="${r1(x - 20)}" y="${r1(floor - 9)}" width="40" height="9" rx="3" fill="${LINE}"/>`;
}

/** A conveyor belt from x0 to x1, its top at y: the belt, the frame with its rollers, legs to the floor.
 * o: { legs: [x...], floor, pitch }. */
function belt(x0, x1, y, o = {}) {
	let s = '';
	for (const lx of o.legs ?? []) {
		s += leg(lx, y + 34, o.floor);
	}
	s += `<rect x="${r1(x0)}" y="${r1(y)}" width="${r1(x1 - x0)}" height="12" rx="6" fill="${LINE}"/>`;
	s += `<rect x="${r1(x0 + 6)}" y="${r1(y + 12)}" width="${r1(x1 - x0 - 12)}" height="24" rx="10" fill="${PAPER}" stroke="${LINE}" stroke-width="3"/>`;
	const n = Math.max(1, Math.round((x1 - x0 - 40) / (o.pitch ?? 110))), step = (x1 - x0 - 40) / n;
	for (let i = 0; i <= n; i++) {
		s += `<circle cx="${r1(x0 + 20 + i * step)}" cy="${r1(y + 24)}" r="5" fill="${PAPER}" stroke="${LINE}" stroke-width="2.5"/>`;
	}
	return s;
}

/** One cell of a check screen: 'tick' (asked, blue), 'ok' (fine, green), 'flag' (a problem, orange), 'off'. */
function cell(x, y, c, st) {
	const fill = { tick: 'var(--blue)', ok: 'var(--green)', flag: 'var(--orange)' }[st] ?? '#3c4250';
	let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(c)}" height="${r1(c)}" rx="${r1(c * 0.2)}" fill="${fill}"/>`;
	if (st === 'tick' || st === 'ok') {
		s += `<path d="M ${r1(x + c * 0.25)} ${r1(y + c * 0.52)} L ${r1(x + c * 0.43)} ${r1(y + c * 0.7)} L ${r1(x + c * 0.76)} ${r1(y + c * 0.32)}" fill="none" stroke="#fff" stroke-width="${r1(c * 0.13)}" stroke-linecap="round" stroke-linejoin="round"/>`;
	} else if (st === 'flag') {
		s += `<line x1="${r1(x + c / 2)}" y1="${r1(y + c * 0.22)}" x2="${r1(x + c / 2)}" y2="${r1(y + c * 0.56)}" stroke="#fff" stroke-width="${r1(c * 0.15)}" stroke-linecap="round"/><circle cx="${r1(x + c / 2)}" cy="${r1(y + c * 0.77)}" r="${r1(c * 0.09)}" fill="#fff"/>`;
	}
	return s;
}

/** The check screen: a bezel, one cell per check, an optional title, on a post down to o.post.
 * o: { cells: [state...], cols, cell, gap, pad, title, titleFs }. Returns { svg, html, w, h }. */
function screen(cx, top, o = {}) {
	const cells = o.cells ?? [], cols = o.cols ?? 6, c = o.cell ?? 20, g = o.gap ?? 6, pad = o.pad ?? 12;
	const rows = Math.ceil(cells.length / cols), th = o.title ? 36 : 0;
	const w = cols * (c + g) - g + pad * 2, h = rows * (c + g) - g + pad * 2 + th, x = cx - w / 2;
	let svg = '';
	if (o.post) {
		svg += `<rect x="${r1(cx - 7)}" y="${r1(top + h - 4)}" width="14" height="${r1(o.post - top - h + 4)}" fill="${LINE}"/>`;
	}
	svg += `<rect x="${r1(x)}" y="${r1(top)}" width="${r1(w)}" height="${r1(h)}" rx="10" fill="${LINE}"/>`;
	svg += `<rect x="${r1(x + 5)}" y="${r1(top + 5)}" width="${r1(w - 10)}" height="${r1(h - 10)}" rx="6" fill="${SCREEN}"/>`;
	cells.forEach((st, i) => { svg += cell(x + pad + (i % cols) * (c + g), top + th + pad + Math.floor(i / cols) * (c + g), c, st); });
	const html = o.title ? tx('gap-scr', cx, top + 8, fmt(o.title), { align: 'c', nolint: true, style: `;font-size:${o.titleFs ?? 22}px;line-height:30px` }) : '';
	return { svg, html, w, h };
}

/** The X-ray scanner the belt runs through, its belt top at y: a hood with a blue band, the tunnel with lead curtains
 * at both mouths, the scan beam lit from its emitter in the roof, and (with o.floor) a cabinet with a control panel.
 * o.inside: SVG drawn inside the tunnel (an X-ray view of a bag). */
function scanner(x, y, w, h, o = {}) {
	const top = y - h, mouth = top + h * 0.24, in0 = x + 14, in1 = x + w - 14;
	let s = '';
	if (o.floor) {
		s += `<rect x="${r1(x + 22)}" y="${r1(y + 30)}" width="${r1(w - 44)}" height="${r1(o.floor - y - 30)}" rx="6" fill="${METAL}" stroke="${LINE}" stroke-width="${SW}"/>`;
		const py = y + 56;
		s += `<rect x="${r1(x + w - 150)}" y="${r1(py)}" width="96" height="40" rx="6" fill="${PAPER}" stroke="${LINE}" stroke-width="3"/>`;
		['var(--green)', 'var(--orange)', 'var(--blue)'].forEach((c, i) => { s += `<circle cx="${r1(x + w - 130 + i * 28)}" cy="${r1(py + 20)}" r="7" fill="${c}"/>`; });
		[0, 1, 2].forEach(i => { s += `<line x1="${r1(x + 50)}" y1="${r1(py + 8 + i * 14)}" x2="${r1(x + 130)}" y2="${r1(py + 8 + i * 14)}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`; });
	}
	s += `<rect x="${r1(x + w * 0.14)}" y="${r1(top - 22)}" width="${r1(w * 0.72)}" height="30" rx="10" fill="${PAPER}" stroke="${LINE}" stroke-width="${SW}"/>`;
	s += `<rect x="${r1(x)}" y="${r1(top)}" width="${r1(w)}" height="${r1(h + 34)}" rx="16" fill="${PAPER}" stroke="${LINE}" stroke-width="${SW}"/>`;
	s += `<rect x="${r1(x + 4)}" y="${r1(top + h * 0.08)}" width="${r1(w - 8)}" height="${r1(Math.max(6, h * 0.07))}" fill="var(--blue)"/>`;
	s += `<rect x="${r1(in0)}" y="${r1(mouth)}" width="${r1(in1 - in0)}" height="${r1(y - mouth + 4)}" rx="6" fill="${SCREEN}"/>`;
	s += o.inside ?? '';
	s += `<rect x="${r1(in0)}" y="${r1(y)}" width="${r1(in1 - in0)}" height="8" fill="#555b66"/>`;
	const bx = x + w / 2;
	s += `<rect x="${r1(bx - 18)}" y="${r1(mouth)}" width="36" height="${r1(y - mouth)}" fill="var(--blue)" opacity=".22"/>`;
	s += `<rect x="${r1(bx - 3)}" y="${r1(mouth)}" width="6" height="${r1(y - mouth)}" fill="var(--blue)"/>`;
	s += `<rect x="${r1(bx - 16)}" y="${r1(mouth - 2)}" width="32" height="10" rx="3" fill="var(--blue)"/>`;
	for (const c0 of [in0 + 4, in1 - 4 - 32]) {
		for (let i = 0; i < 5; i++) {
			s += `<rect x="${r1(c0 + i * 6.8)}" y="${r1(mouth + 2)}" width="4.6" height="${r1(y - mouth - 4)}" rx="2" fill="#c3c8d0"/>`;
		}
	}
	return s;
}

/** The boarding gate, standing on y: two pedestals with blue tops, glass flaps closed between them, and a boarding pass
 * lying on the reader of the left one, lit from the reader below it. */
function gate(x, y, w, h) {
	const pw = w * 0.2, fy0 = y - h * 0.8, fy1 = y - h * 0.3;
	let s = '';
	const ped = px => `<rect x="${r1(px)}" y="${r1(y - h)}" width="${r1(pw)}" height="${r1(h)}" rx="10" fill="${PAPER}" stroke="${LINE}" stroke-width="${SW}"/><rect x="${r1(px + 4)}" y="${r1(y - h + 14)}" width="${r1(pw - 8)}" height="8" fill="var(--blue)"/>`;
	const flap = (x0, x1) => `<path d="M ${r1(x0)} ${r1(fy0)} H ${r1(x1 - 14)} Q ${r1(x1)} ${r1(fy0)} ${r1(x1)} ${r1(fy0 + 14)} V ${r1(fy1 - 14)} Q ${r1(x1)} ${r1(fy1)} ${r1(x1 - 14)} ${r1(fy1)} H ${r1(x0)} Z" fill="#dcebf8" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>`;
	const mid = x + w / 2;
	s += flap(x + pw, mid - 3);
	s += `<g transform="translate(${r1(2 * mid)} 0) scale(-1 1)">${flap(x + pw, mid - 3)}</g>`;
	s += `<path d="M ${r1(x + pw + 20)} ${r1(fy1 - 12)} L ${r1(x + pw + 44)} ${r1(fy0 + 12)} M ${r1(x + w - pw - 44)} ${r1(fy1 - 12)} L ${r1(x + w - pw - 20)} ${r1(fy0 + 12)}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
	s += ped(x) + ped(x + w - pw);
	// The reader: a glass plate on the left pedestal, a pass lying on it, lit from below.
	const ry = y - h;
	s += `<path d="M ${r1(x + 4)} ${r1(ry)} L ${r1(x + 10)} ${r1(ry - 10)} H ${r1(x + pw - 10)} L ${r1(x + pw - 4)} ${r1(ry)} Z" fill="var(--blue)" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>`;
	let pass = `<rect x="${r1(x - 8)}" y="${r1(ry - 26)}" width="${r1(pw + 16)}" height="18" rx="3" fill="#fff" stroke="${LINE}" stroke-width="2.5"/><rect x="${r1(x - 8)}" y="${r1(ry - 26)}" width="14" height="18" rx="3" fill="var(--blue)"/>`;
	for (let i = 0; i < 5; i++) {
		pass += `<line x1="${r1(x + 14 + i * 5)}" y1="${r1(ry - 22)}" x2="${r1(x + 14 + i * 5)}" y2="${r1(ry - 12)}" stroke="${LINE}" stroke-width="2"/>`;
	}
	return `${s}<g transform="rotate(-8 ${r1(x + pw / 2)} ${r1(ry - 14)})">${pass}</g>`;
}

// ---------- people and screens ----------

const SKIN = '#f1c6a2', SKIN_LINE = '#b07a52', HAIR = '#3b302b', PURPLE_DARK = '#5e3f99';

/** The officer (today's check, in purple), behind a desk: a cap with a badge and visor, a face, ears, a jacket
 * with lapels, epaulettes, a chest badge and buttons, a shirt and tie, hands. o.raise: one arm up holding a red card
 * (a refusal); otherwise both hands rest on the desk. Drawn in a 300 x 470 box at (x, y), the desk at the bottom.
 * Returns { svg, plate: [x, y] } (the centre of the nameplate on the desk's front). */
function inspector(x, y, o = {}) {
	const P = 'var(--purple)';
	const limb = d => `<path d="${d}" fill="none" stroke="${LINE}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>`;
	const hand = (hx, hy, r = 19) => `<circle cx="${hx}" cy="${hy}" r="${r}" fill="${SKIN}" stroke="${LINE}" stroke-width="3.5"/><path d="M ${r1(hx - r * 0.65)} ${r1(hy - r * 0.1)} q ${r1(r * 0.35)} ${r1(-r * 0.6)} ${r1(r * 0.9)} ${r1(-r * 0.35)}" fill="none" stroke="${SKIN_LINE}" stroke-width="3" stroke-linecap="round"/>`;
	let s = '';
	if (o.raise) {
		s += `<g transform="rotate(14 318 50)"><rect x="282" y="-10" width="76" height="106" rx="9" fill="var(--red)" stroke="${LINE}" stroke-width="4"/></g>`;
		s += limb('M 214 266 L 276 200 L 294 118');
		s += `<path d="M 270 122 L 318 128" stroke="${PURPLE_DARK}" stroke-width="10" stroke-linecap="round"/>`;
	}
	s += `<rect x="130" y="160" width="40" height="72" rx="10" fill="${SKIN}" stroke="${LINE}" stroke-width="3.5"/>`;
	s += `<path d="M 44 470 V 314 Q 46 242 112 228 L 150 238 L 188 228 Q 254 242 256 314 V 470 Z" fill="${P}" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>`;
	s += `<path d="M 124 230 L 150 292 L 176 230 L 150 240 Z" fill="#fff" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>`;
	s += `<path d="M 144 246 H 156 L 162 302 L 150 318 L 138 302 Z" fill="${PURPLE_DARK}" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round"/>`;
	s += `<path d="M 112 228 L 150 336 M 188 228 L 150 336" stroke="${PURPLE_DARK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
	s += `<rect x="60" y="238" width="48" height="14" rx="6" transform="rotate(-14 84 245)" fill="${PURPLE_DARK}" stroke="${LINE}" stroke-width="2.5"/>`;
	s += `<rect x="192" y="238" width="48" height="14" rx="6" transform="rotate(14 216 245)" fill="${PURPLE_DARK}" stroke="${LINE}" stroke-width="2.5"/>`;
	s += `<path d="M 178 268 h 26 v 13 q 0 14 -13 20 q -13 -6 -13 -20 Z" fill="var(--yellow)" stroke="${LINE}" stroke-width="2.5" stroke-linejoin="round"/>`;
	s += [352, 392].map(by => `<circle cx="150" cy="${by}" r="5.5" fill="var(--yellow)" stroke="${LINE}" stroke-width="2"/>`).join('');
	s += '<g transform="translate(0 18)">';
	s += `<circle cx="97" cy="128" r="12" fill="${SKIN}" stroke="${LINE}" stroke-width="3.5"/><circle cx="203" cy="128" r="12" fill="${SKIN}" stroke="${LINE}" stroke-width="3.5"/>`;
	s += `<circle cx="150" cy="122" r="54" fill="${SKIN}" stroke="${LINE}" stroke-width="4"/>`;
	s += `<path d="M 99 116 Q 98 88 118 82 L 120 104 Q 108 104 104 118 Z M 201 116 Q 202 88 182 82 L 180 104 Q 192 104 196 118 Z" fill="${HAIR}"/>`;
	s += `<ellipse cx="131" cy="128" rx="5" ry="6.5" fill="${LINE}"/><ellipse cx="169" cy="128" rx="5" ry="6.5" fill="${LINE}"/>`;
	s += `<path d="M 120 113 q 11 ${o.raise ? 4 : -6} 22 ${o.raise ? 3 : -1} M 158 ${o.raise ? 116 : 112} q 11 ${o.raise ? -1 : -5} 22 ${o.raise ? -4 : 1}" stroke="${LINE}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
	s += `<path d="M 150 132 q -7 12 2 15" stroke="${SKIN_LINE}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
	s += o.raise ? `<path d="M 137 158 H 163" stroke="${LINE}" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M 136 154 Q 150 165 164 154" stroke="${LINE}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
	s += `<path d="M 92 100 C 90 60 116 44 150 44 C 184 44 210 60 208 100 Z" fill="${P}" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>`;
	s += `<rect x="93" y="86" width="114" height="16" rx="4" fill="${PURPLE_DARK}" stroke="${LINE}" stroke-width="3"/>`;
	s += `<path d="M 90 102 Q 150 116 210 102 Q 215 111 207 116 Q 150 132 93 116 Q 85 111 90 102 Z" fill="${LINE}"/>`;
	s += `<path d="M 150 58 l 10 6 v 10 q 0 7 -10 11 q -10 -4 -10 -11 v -10 Z" fill="var(--yellow)" stroke="${LINE}" stroke-width="2"/>`;
	s += '</g>';
	s += limb('M 86 268 L 64 324 L 104 338');
	if (!o.raise) {
		s += limb('M 214 268 L 236 324 L 196 338');
	}
	s += `<rect x="0" y="350" width="300" height="120" fill="${PAPER}" stroke="${LINE}" stroke-width="4"/>`;
	s += `<rect x="-16" y="334" width="332" height="20" rx="6" fill="${METAL}" stroke="${LINE}" stroke-width="4"/>`;
	s += `<rect x="60" y="384" width="180" height="54" rx="8" fill="var(--purple-tint)" stroke="${P}" stroke-width="3"/>`;
	s += hand(116, 334, 18);
	if (!o.raise) {
		s += hand(184, 334, 18);
	} else {
		s += hand(296, 102, 21);
	}
	return { svg: `<g transform="translate(${r1(x)} ${r1(y)})">${s}</g>`, plate: [x + 150, y + 411] };
}

/** The notice you see when a bag is opened: a title bar (where), a shield and the question, the reason, and two
 * buttons. p: { title, buttons: [yes, no], app }. o: { state: 'on' | 'plain' | 'ghost', inline (buttons on the
 * question's line), small, reason, echo (the reason repeats words already on the slide), h }. */
function noticeBox(x, y, w, p = {}, o = {}) {
	const [allow, skip] = p.buttons ?? ['', ''];
	const btns = `<div class="gap-pr-btns">${t('gap-btn gap-solid', '', esc(allow), { tag: 'span', nolint: true })}${t('gap-btn', '', esc(skip), { tag: 'span', nolint: true })}</div>`;
	const cls = `gap-notice${o.state === 'ghost' ? ' gap-ghost' : o.state === 'plain' ? '' : ' gap-on'}${o.small ? ' gap-small' : ''}`;
	const bar = p.app ? `<div class="gap-pr-bar"><i></i><i></i><i></i>${t('', '', esc(p.app), { tag: 'span', nolint: true })}</div>` : '';
	// The dialog's title is a fixed label of the drawn screen; a reason it echoes word for word isn't new reading either.
	const head = `<div class="gap-pr-head">${ic('shield', o.small ? 22 : 28)}${t('', '', fmt(p.title ?? ''), { tag: 'span', nolint: true })}${o.inline ? btns : ''}</div>`;
	return `<div class="${cls}" style="${at(x, y, w, o.h)}">${bar}<div class="gap-pr-in">${head}${o.reason ? t('gap-pr-why', '', fmt(o.reason), { nolint: !!o.echo }) : ''}${o.inline ? '' : btns}</div></div>`;
}

/** An outcome sign: green (a play mark) or orange (a shield). o: { text, tone, icon }. */
function sign(x, y, o = {}, align = 'c') {
	const icon = o.icon ?? (o.tone === 'green' ? 'play' : 'shield');
	return tx('gap-sign', x, y, `${ic(icon, 30)}<span>${fmt(o.text ?? '')}</span>`, { tone: o.tone ?? 'green', align, nolint: true });
}

/** A speech bubble with its tail on the bottom or the left edge, pointing at `to`. */
function bubble(x, y, w, h, tail, o = {}) {
	const stroke = o.stroke ?? 'var(--blue)', sw = o.sw ?? 4, b = 16;
	let s = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${o.r ?? 24}" fill="#fff" stroke="${stroke}" stroke-width="${sw}"/>`;
	if (tail) {
		const [tx2, ty2] = tail.to;
		if (tail.side === 'left') {
			s += `<path d="M ${r1(x + 1)} ${r1(tail.at - b)} L ${r1(tx2)} ${r1(ty2)} L ${r1(x + 1)} ${r1(tail.at + b)}" fill="#fff" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><line x1="${r1(x + sw / 2 + 1)}" y1="${r1(tail.at - b + 3)}" x2="${r1(x + sw / 2 + 1)}" y2="${r1(tail.at + b - 3)}" stroke="#fff" stroke-width="${sw + 2}"/>`;
		} else {
			s += `<path d="M ${r1(tail.at - b)} ${r1(y + h - 1)} L ${r1(tx2)} ${r1(ty2)} L ${r1(tail.at + b)} ${r1(y + h - 1)}" fill="#fff" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><line x1="${r1(tail.at - b + 3)}" y1="${r1(y + h - sw / 2 - 1)}" x2="${r1(tail.at + b - 3)}" y2="${r1(y + h - sw / 2 - 1)}" stroke="#fff" stroke-width="${sw + 2}"/>`;
		}
	}
	return s;
}

/** A stopwatch with a 10-second dial: a crown and a side button, a ring with one tick a second, and an arc for the
 * share of the dial that passed (frac). */
function stopwatch(cx, cy, r, frac, tone = 'purple') {
	let s = `<rect x="${r1(cx - 16)}" y="${r1(cy - r - 36)}" width="32" height="20" rx="5" fill="${LINE}"/><rect x="${r1(cx - 6)}" y="${r1(cy - r - 18)}" width="12" height="16" fill="${LINE}"/>`;
	s += `<rect x="${r1(cx + r * 0.62)}" y="${r1(cy - r * 0.92)}" width="22" height="14" rx="4" transform="rotate(45 ${r1(cx + r * 0.62 + 11)} ${r1(cy - r * 0.92 + 7)})" fill="${LINE}"/>`;
	s += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${PAPER}" stroke="${LINE}" stroke-width="10"/>`;
	for (let i = 0; i < 10; i++) {
		const a = (i / 10) * Math.PI * 2, r0 = r - 12, rr = r - (i % 5 ? 18 : 24);
		s += `<line x1="${r1(cx + Math.sin(a) * r0)}" y1="${r1(cy - Math.cos(a) * r0)}" x2="${r1(cx + Math.sin(a) * rr)}" y2="${r1(cy - Math.cos(a) * rr)}" stroke="var(--faint)" stroke-width="3" stroke-linecap="round"/>`;
	}
	const ra = r - 34, a1 = Math.min(0.999, frac) * Math.PI * 2;
	s += `<path d="M ${r1(cx)} ${r1(cy - ra)} A ${r1(ra)} ${r1(ra)} 0 ${a1 > Math.PI ? 1 : 0} 1 ${r1(cx + Math.sin(a1) * ra)} ${r1(cy - Math.cos(a1) * ra)}" fill="none" stroke="var(--${tone})" stroke-width="14" stroke-linecap="round"/>`;
	return s;
}

const D = {};
export const designs = D;

/** The cover, with the idea drawn as one baggage line across the page: a bag waits and asks to go through, one goes
 * through the scanner (its screen lights one cell per question), one rides the ramp up through the green gate, one
 * reaches the desk where a notice asks. Each bag carries its label on a tag. No clicks. Fields: eyebrow, title,
 * sub, speaker: { initials, name, role }, pills, scene: { ask (the waiting bag's bubble), check (the screen's title),
 * cells (how many questions), flags (the cells the bag in the scanner lights up), clear, open (the two signs), notice:
 * { title, buttons, app }, tags: { wait, scan, clear, open } }. */
D['gap-cover'] = {
	bare: true,
	css: `${base('gap-cover')}
.gap-cover { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.gap-cover .gap-cv-text { position: absolute; left: 96px; top: 150px; width: 1300px; }
.gap-cover .gap-cv-title { margin-top: 16px; }
.gap-cover .gap-cv-sub { margin-top: 18px; font-size: 27px; color: var(--body); }
.gap-cover .gap-cv-meta { margin-top: 26px; display: flex; align-items: center; gap: 28px; }
.gap-cover .gap-cv-meta .tf-speaker { margin-top: 0; }
.gap-cover .gap-cv-meta .tf-pills { margin-top: 0; }
.gap-cover .gap-ask { display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 28px; font-weight: 700; color: var(--blue); }
`,
	render(s) {
		const sc = s.scene ?? {}, tags = sc.tags ?? {};
		const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
		const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
		const text = `<div class="gap-cv-text"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl gap-cv-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="gap-cv-sub" data-t>${fmt(s.sub)}</div>` : ''}<div class="gap-cv-meta">${sp}${pills}</div></div>`;
		const FL = 944, Y = 790, MOUTH = 534;
		let svg = `<defs><clipPath id="gap-cv-out"><rect x="0" y="0" width="${MOUTH - 4}" height="1080"/></clipPath><clipPath id="gap-cv-in"><rect x="${MOUTH}" y="0" width="320" height="1080"/></clipPath></defs>`;
		let html = '';
		svg += `<line x1="96" y1="${FL}" x2="1824" y2="${FL}" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
		// The upper belt's legs stand behind the lower belt.
		svg += belt(1236, 1500, 640, { legs: [1270, 1470], floor: FL });
		svg += leg(1130, 728, FL);
		svg += belt(1000, 1590, Y, { legs: [1550], floor: FL });
		svg += belt(96, 1012, Y, { legs: [150, 470, 950], floor: FL });
		// The diverter, and the ramp that starts on top of it.
		svg += `<rect x="976" y="752" width="64" height="48" rx="8" fill="${METAL}" stroke="${LINE}" stroke-width="${SW}"/><circle cx="1008" cy="776" r="7" fill="${PAPER}" stroke="${LINE}" stroke-width="3"/>`;
		const ang = Math.atan2(640 - 752, 1240 - 1016) * 180 / Math.PI, len = Math.hypot(1240 - 1016, 640 - 752);
		svg += `<g transform="translate(1016 752) rotate(${r1(ang)})">${belt(0, len, 0, { pitch: 70 })}</g>`;

		// The scanner, with the duffel half inside it (the inside half as the X-ray sees it).
		const inside = `<g clip-path="url(#gap-cv-in)">${bag('duffel', 520, Y, 96, 'grey', { xray: true }).svg}</g>`;
		svg += scanner(520, Y, 360, 170, { floor: FL, inside });
		const cells = Array.from({ length: sc.cells ?? 0 }, (_, i) => ((sc.flags ?? []).includes(i) ? 'flag' : 'tick'));
		const scr = screen(700, 448, { cells, cols: 8, cell: 20, gap: 6, title: sc.check, post: 600 });
		svg += scr.svg;
		html += scr.html;
		const duffel = bag('duffel', 520, Y, 96, 'grey');
		svg += `<g clip-path="url(#gap-cv-out)">${duffel.svg}</g>`;

		// The bag that waits, asking.
		const waiting = bag('case', 250, Y, 190, 'dark');
		svg += waiting.svg;
		svg += bubble(118, 466, 300, 78, { at: 250, to: [250, 584] });
		html += tx('gap-ask', 268, 505, `${ic(sc.askIcon ?? 'person', 32)}<span>${fmt(sc.ask ?? '')}</span>`, { align: 'cc', nolint: true });

		// Through: the gate at the top of the ramp, its light curtain, the backpack going through.
		svg += `<rect x="1330" y="458" width="16" height="182" fill="${METAL}" stroke="${LINE}" stroke-width="3"/><rect x="1478" y="458" width="16" height="182" fill="${METAL}" stroke="${LINE}" stroke-width="3"/>`;
		svg += `<rect x="1318" y="442" width="188" height="22" rx="6" fill="${METAL}" stroke="${LINE}" stroke-width="${SW}"/><rect x="1352" y="464" width="120" height="6" fill="var(--green)"/>`;
		for (let i = 0; i < 10; i++) {
			svg += `<rect x="${1354 + i * 12}" y="470" width="5" height="168" fill="var(--green)" opacity=".38"/>`;
		}
		const pack = bag('pack', 1420, 640, 120, 'grey');
		svg += pack.svg;
		svg += `<line x1="1360" y1="428" x2="1360" y2="442" stroke="${LINE}" stroke-width="3"/><line x1="1464" y1="428" x2="1464" y2="442" stroke="${LINE}" stroke-width="3"/>`;
		html += sign(1412, 372, { text: sc.clear, tone: 'green' });

		// You're asked: the desk, its screen on a post with the dialog, the sign above it.
		svg += `<rect x="1806" y="470" width="14" height="306" fill="${LINE}"/>`;
		svg += `<rect x="1592" y="794" width="220" height="${FL - 794}" fill="${PAPER}" stroke="${LINE}" stroke-width="${SW}"/><rect x="1580" y="776" width="244" height="20" rx="6" fill="${METAL}" stroke="${LINE}" stroke-width="${SW}"/>`;
		svg += `<rect x="1560" y="440" width="264" height="164" rx="12" fill="${LINE}"/>`;
		html += noticeBox(1570, 450, 244, sc.notice ?? {}, { small: true, h: 144 });
		svg += `<line x1="1620" y1="428" x2="1620" y2="440" stroke="${LINE}" stroke-width="3"/><line x1="1766" y1="428" x2="1766" y2="440" stroke="${LINE}" stroke-width="3"/>`;
		html += sign(1693, 372, { text: sc.open, tone: 'orange' });
		const desk = bag('case', 1700, 776, 160, 'silver');
		svg += desk.svg;

		// The tags, each tied to its bag.
		for (const [x, y, text, b, tone] of [[104, 818, tags.wait, waiting, 'neutral'], [330, 874, tags.scan, duffel, 'neutral'], [1296, 690, tags.clear, pack, 'green'], [1610, 834, tags.open, desk, 'orange']]) {
			const tg = luggageTag(x, y, text ?? '', { tone, from: b.handle, fs: 21 });
			svg += tg.svg;
			html += tg.html;
		}
		return `<div class="gap-cover">${svgEl(1920, 1080, svg)}${text}${html}${msLogo()}</div>`;
	},
};

/** The job, click by click: what you said, what is in the bag (on its tag), the checkpoint, the two ends (through;
 * opened, with a reason), then the two ways a check can be wrong. Fields: eyebrow, title,
 * you: { cap, text }, bag: { cap, label }, officer (label), icon (the checkpoint's), clear, notice: { title, buttons, app }, reason, wrong (the
 * mistakes' heading), mistakes (2): [{ cap, title, sub }], clicks (7). */
D['gap-job'] = {
	clicks: true,
	css: `${base('gap-job')}
.gap-job .gap-you { font-size: 30px; line-height: 1.3; color: var(--ink); }
.gap-job .gap-officer { font-size: 34px; font-weight: 700; color: var(--ink); }
.gap-job .gap-clear { font-size: 42px; font-weight: 700; color: var(--ink); }
.gap-job .gap-mt { font-size: 30px; font-weight: 700; line-height: 1.2; color: var(--ink); }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), H = bodyHeight(s);
		let svg = '', html = '';
		if (step >= 1) {
			svg += `<rect x="0" y="40" width="380" height="230" rx="24" fill="var(--blue-tint)"/>`;
			html += tx('gap-cap t-blue', 32, 76, fmt(s.you?.cap ?? ''), { nolint: true });
			html += tx('gap-you', 32, 116, fmt(s.you?.text ?? ''), { w: 320, wrap: true });
		}
		if (step >= 2) {
			svg += arrow('M 190 284 V 384', [190, 388], 90);
			const tg = bagTag(0, 420, { cap: s.bag?.cap, label: s.bag?.label, fs: 26 });
			svg += tg.svg;
			html += tg.html;
		}
		if (step >= 3) {
			svg += arrow('M 392 150 C 450 150 440 300 478 306', [482, 307], 15);
			svg += arrow('M 438 481 C 466 474 450 372 478 357', [482, 354], -35);
			svg += `<circle cx="564" cy="330" r="78" fill="var(--blue)"/>`;
			html += tx('', 564, 330, ic(s.icon ?? 'eye', 76, '#fff'), { align: 'cc', nolint: true });
			html += tx('gap-officer', 564, 420, fmt(s.officer ?? ''), { align: 'c', nolint: true });
		}
		if (step >= 4) {
			svg += arrow('M 648 300 C 690 300 682 135 718 135', [722, 135], 0);
			svg += `<rect x="730" y="35" width="456" height="200" rx="24" fill="var(--green-tint)"${step >= 6 ? ' stroke="var(--red)" stroke-width="6"' : ''}/>`;
			svg += `<circle cx="806" cy="135" r="46" fill="var(--green)"/>`;
			html += tx('', 810, 135, ic('play', 50, '#fff'), { align: 'cc', nolint: true });
			html += tx('gap-clear', 878, 108, fmt(s.clear ?? ''), { nolint: true });
		}
		if (step >= 5) {
			svg += arrow('M 648 360 C 690 360 682 418 718 418', [722, 418], 0);
			html += noticeBox(730, 316, 456, s.notice, { reason: s.reason, state: step >= 7 ? 'on' : 'plain' });
		}
		const ms = s.mistakes ?? [];
		const mistake = (m, y, h, tone) => {
			svg += `<rect x="1262" y="${y}" width="466" height="${h}" rx="22" fill="var(--${tone}-tint)" stroke="var(--${tone})" stroke-width="4"/>`;
			const top = y + h / 2 - (m.sub ? 70 : 44);
			html += tx('gap-cap', 1294, top, fmt(m.cap ?? ''), { tone, nolint: true });
			html += tx('gap-mt', 1294, top + 34, fmt(m.title ?? ''), { w: 410, wrap: true });
			if (m.sub) html += tx('gap-sub', 1294, top + 84, fmt(m.sub));
		};
		if (step >= 6) {
			html += tx('gap-cap', 1262, 0, `${ic('warning', 24)} ${fmt(s.wrong ?? '')}`, { tone: 'red', nolint: true, style: ';display:flex;align-items:center;gap:10px' });
			svg += arrow('M 1196 135 H 1248', [1252, 135], 0, { color: 'var(--red)', dash: '8 10' });
			mistake(ms[0] ?? {}, 40, 190, 'red');
		}
		if (step >= 7) {
			svg += arrow('M 1196 418 H 1248', [1252, 418], 0, { color: 'var(--orange)', dash: '8 10' });
			mistake(ms[1] ?? {}, 320, 196, 'orange');
		}
		return heading(s) + body(`<div class="gap-job" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Today's check, click by click: the bag's tag, the officer (in purple) at its desk, the red card it raises with
 * its one-line verdict, the notice that shows you its reason, and a stopwatch for the wait. Fields:
 * eyebrow, title, bag: { cap, label, note: { icon, text } }, officer (the nameplate), verdict: { text, reason }, notice:
 * { title, buttons, app }, time (the stopwatch), timeFrac (its arc, a share of the 10-second dial), per (a pill under it),
 * clicks (5). */
D['gap-today'] = {
	clicks: true,
	css: `${base('gap-today')}
.gap-today .gap-time { font-size: 52px; font-weight: 700; letter-spacing: -.02em; color: var(--purple); }
.gap-today .gap-plate { font-size: 24px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--purple); }
.gap-today .gap-reply { font-size: 29px; line-height: 1.35; color: var(--ink); }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), H = bodyHeight(s);
		let svg = '', html = '';
		const tg = bagTag(0, 6, { cap: s.bag?.cap, label: s.bag?.label, note: s.bag?.note, fs: 25 });
		svg += tg.svg;
		html += tg.html;
		if (step >= 2) {
			const man = inspector(560, 210, { raise: step >= 3 });
			svg += `<line x1="500" y1="682" x2="1020" y2="682" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
			svg += man.svg;
			html += tx('gap-plate', man.plate[0], man.plate[1], fmt(s.officer ?? ''), { align: 'cc', nolint: true });
		}
		if (step >= 3) {
			svg += bubble(1000, 0, 728, 204, { side: 'left', at: 150, to: [936, 226] }, { stroke: 'var(--purple)' });
			html += `<div class="gap-x" style="${at(1034, 28)}">${pill({ text: s.verdict?.text ?? '', tone: 'red', solid: true })}</div>`;
			html += tx('gap-reply', 1034, 86, fmt(s.verdict?.reason ?? ''), { w: 664, wrap: true });
		}
		if (step >= 4) {
			html += noticeBox(1080, 300, 648, s.notice, { reason: s.verdict?.reason, echo: true });
		}
		if (step >= 5) {
			svg += stopwatch(240, 418, 116, s.timeFrac ?? 0.05);
			html += tx('gap-time', 240, 418, esc(s.time ?? ''), { align: 'cc', nolint: true });
			html += `<div class="gap-x" style="${at(240, 572)};transform:translateX(-50%)">${pill({ text: s.per ?? '', icon: 'repeat', tone: 'purple' })}</div>`;
		}
		return heading(s) + body(`<div class="gap-today" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Two kinds of check, row by row: on the left the writer (today's, purple) and its one-line verdict, on the right
 * the checklist (the quick check, blue) and its numbers with bars; then how long each takes, whether asking twice gives
 * the same answer, and whether it writes a reason. Fields: eyebrow, title, vs, left: { name, sub, icon, verdict,
 * reply }, right: { name, sub, icon, head, answers: [{ q, v ('17%') }] }, rows (4): [{ label, left: { text, icon,
 * tone }, right: { text, icon, tone } }] (row 1 is what each gives back), clicks (5). */
D['gap-two-kinds'] = {
	clicks: true,
	css: `${base('gap-two-kinds')}
.gap-two-kinds .gap-nm { font-size: 46px; font-weight: 700; letter-spacing: -.01em; color: var(--fg); }
.gap-two-kinds .gap-vs { font-size: 26px; font-weight: 700; letter-spacing: .1em; color: var(--faint); }
.gap-two-kinds .gap-row { font-size: 19px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--body); }
.gap-two-kinds .gap-val { display: flex; align-items: center; gap: 14px; font-size: 34px; font-weight: 700; color: var(--fg); }
.gap-two-kinds .gap-reply { font-size: 24px; line-height: 1.35; color: var(--ink); }
.gap-two-kinds .gap-ch { font-size: 24px; font-weight: 700; color: var(--ink); }
.gap-two-kinds .gap-q { font-size: 22px; color: var(--ink); }
.gap-two-kinds .gap-v { font-size: 22px; font-weight: 700; color: var(--blue); }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), H = bodyHeight(s);
		const L = s.left ?? {}, R = s.right ?? {}, rows = s.rows ?? [];
		let svg = '', html = '';
		const dash = (x, y) => `<line x1="${x}" y1="${y}" x2="${x + 34}" y2="${y}" stroke="var(--line-strong)" stroke-width="3"/>`;
		const label = (i, y) => {
			html += tx('gap-row', 864, y - 13, fmt(rows[i]?.label ?? ''), { align: 'c', nolint: true });
			svg += dash(608, y) + dash(1086, y);
		};
		const val = (side, o, y, tone) => {
			if (!o) return;
			const icon = o.icon ? ic(o.icon, 34, o.tone ? `var(--${o.tone})` : 'var(--fg)') : '';
			html += side === 'l'
				? tx('gap-val', 590, y - 22, `${icon}<span>${fmt(o.text ?? '')}</span>`, { tone, align: 'r', nolint: true })
				: tx('gap-val', 1134, y - 22, `${icon}<span>${fmt(o.text ?? '')}</span>`, { tone, nolint: true });
		};
		const ys = [205, 368, 468, 568];
		[318, 418, 518].forEach((y, i) => { if (step >= (i === 2 ? 5 : 1)) svg += `<line x1="0" y1="${y}" x2="1728" y2="${y}" stroke="var(--line)" stroke-width="2"/>`; });
		html += tx('gap-vs', 864, 28, esc(s.vs ?? ''), { align: 'c', nolint: true });
		// The writer.
		svg += `<circle cx="45" cy="45" r="45" fill="var(--purple)"/>`;
		html += tx('', 45, 45, ic(L.icon ?? 'personSearch', 52, '#fff'), { align: 'cc', nolint: true });
		html += tx('gap-nm', 110, 0, fmt(L.name ?? ''), { tone: 'purple', nolint: true });
		html += tx('gap-sub', 110, 60, fmt(L.sub ?? ''), { nolint: true });
		svg += `<rect x="40" y="112" width="550" height="186" rx="20" fill="#fff" stroke="var(--purple)" stroke-width="4"/>`;
		html += `<div class="gap-x" style="${at(66, 130)}">${pill({ text: L.verdict ?? '', tone: 'red', solid: true, size: 's' })}</div>`;
		html += tx('gap-reply', 66, 184, fmt(L.reply ?? ''), { w: 500, wrap: true });
		label(0, ys[0]);
		[1, 2].forEach(i => { label(i, ys[i]); val('l', rows[i]?.left, ys[i], 'purple'); });
		// The checklist.
		if (step >= 2) {
			svg += `<circle cx="1683" cy="45" r="45" fill="var(--blue)"/>`;
			html += tx('', 1683, 45, ic(R.icon ?? 'checklist', 52, '#fff'), { align: 'cc', nolint: true });
			html += tx('gap-nm', 1618, 0, fmt(R.name ?? ''), { tone: 'blue', align: 'r', nolint: true });
			html += tx('gap-sub', 1618, 60, fmt(R.sub ?? ''), { align: 'r', nolint: true });
			svg += `<rect x="1138" y="112" width="550" height="186" rx="20" fill="#fff" stroke="var(--blue)" stroke-width="4"/>`;
			html += tx('gap-ch', 1162, 128, fmt(R.head ?? ''), { nolint: true });
			(R.answers ?? []).slice(0, 3).forEach((a, i) => {
				const y = 176 + i * 40;
				html += tx('gap-q', 1162, y, fmt(a.q ?? ''), { nolint: true });
				svg += `<rect x="1430" y="${y + 11}" width="150" height="10" rx="5" fill="var(--blue-tint)"/>`;
				if (step >= 3) {
					const pct = Math.min(100, parseFloat(a.v) || 0);
					if (pct > 0) svg += `<rect x="1430" y="${y + 11}" width="${r1(1.5 * pct)}" height="10" rx="5" fill="var(--blue)"/>`;
					html += tx('gap-v', 1664, y, esc(a.v ?? ''), { align: 'r', nolint: true });
				}
			});
		}
		if (step >= 4) {
			[1, 2].forEach(i => val('r', rows[i]?.right, ys[i], 'blue'));
		}
		if (step >= 5) {
			label(3, ys[3]);
			val('l', rows[3]?.left, ys[3], 'purple');
			val('r', rows[3]?.right, ys[3], 'blue');
		}
		return heading(s) + body(`<div class="gap-two-kinds" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** How it decides, in big type: the quick check (a big count of questions), the fixed rules (braces: plain code), and
 * the two ends; then the rule in one sentence. Fields: eyebrow, title, officerCap, endsCap, check: { name, big, sub },
 * rules: { name, big, sub }, clear, open, rule (one sentence, marks allowed), clicks (4: ends, check, rules, rule). */
D['gap-decide'] = {
	clicks: true,
	css: `${base('gap-decide')}
.gap-decide .gap-capg { font-size: 19px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--body); }
.gap-decide .gap-nm { font-size: 64px; font-weight: 700; letter-spacing: -.02em; color: var(--fg); }
.gap-decide .gap-huge { font-size: 190px; font-weight: 700; letter-spacing: -.04em; line-height: 1; color: var(--fg); }
.gap-decide .gap-brace { font-size: 150px; font-weight: 400; line-height: 1; color: var(--muted); }
.gap-decide .gap-end { font-size: 74px; font-weight: 700; letter-spacing: -.02em; color: var(--fg); }
.gap-decide .gap-rule { font-size: 60px; line-height: 1.3; letter-spacing: -.01em; color: var(--ink); white-space: normal; }
.gap-decide .gap-rule .mark { background: none; padding: 0; margin: 0; font-weight: 700; }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), H = bodyHeight(s);
		const C = s.check ?? {}, R = s.rules ?? {};
		let svg = '', html = '';
		html += tx('gap-capg', 0, 0, fmt(s.officerCap ?? ''), { nolint: true });
		svg += `<line x1="0" y1="36" x2="980" y2="36" stroke="var(--line-strong)" stroke-width="2"/>`;
		html += tx('gap-capg', 1060, 0, fmt(s.endsCap ?? ''), { nolint: true });
		svg += `<line x1="1060" y1="36" x2="1728" y2="36" stroke="var(--line-strong)" stroke-width="2"/>`;
		html += tx('gap-end', 1060, 54, fmt(s.clear ?? ''), { tone: 'green', nolint: true });
		svg += `<line x1="1060" y1="182" x2="1728" y2="182" stroke="var(--line)" stroke-width="2"/>`;
		html += tx('gap-end', 1060, 200, fmt(s.open ?? ''), { tone: 'orange', nolint: true });
		if (step >= 2) {
			html += tx('gap-nm', 0, 58, fmt(C.name ?? ''), { tone: 'blue', nolint: true });
			html += tx('gap-huge', -6, 150, esc(C.big ?? ''), { tone: 'blue', nolint: true });
			html += tx('gap-sub', 0, 352, fmt(C.sub ?? ''), { style: ';font-size:27px' });
		}
		if (step >= 3) {
			svg += arrow('M 418 104 H 524', [528, 104], 0, { color: 'var(--muted)', sw: 3 });
			html += tx('gap-nm', 560, 58, fmt(R.name ?? ''), { tone: 'neutral', nolint: true, style: ';color:var(--ink)' });
			html += tx('gap-brace', 556, 168, esc(R.big ?? ''), { nolint: true });
			html += tx('gap-sub', 560, 352, fmt(R.sub ?? ''), { style: ';font-size:27px' });
			svg += arrow('M 966 104 H 1036', [1040, 104], 0, { color: 'var(--muted)', sw: 3 });
			svg += arrow('M 1000 104 V 236 Q 1000 252 1016 252 H 1036', [1040, 252], 0, { color: 'var(--muted)', sw: 3 });
		}
		if (step >= 4) {
			svg += `<line x1="0" y1="430" x2="1728" y2="430" stroke="var(--line)" stroke-width="2"/>`;
			html += tx('gap-rule', 0, 466, fmt(s.rule ?? ''), { w: 1728, wrap: true });
		}
		return heading(s) + body(`<div class="gap-decide" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** The two questions as two machines over three belts: the scanner (the first question) and the gate (the second),
 * each with a screen of its checks; one belt per bag, with what you said on the left, the
 * bag stopped where a check flagged it (its screen shows which), and where it ended. Fields: eyebrow, title, saidHead,
 * you (the speaker label), harm: { name, count, cells }, asked: { name, count, cells } (cells: how many checks),
 * cases (3): [{ said, label, stop: 'harm' | 'asked' | none, flags (the cells it lights up), flag (what they found, two
 * short lines), out (the end's sign) }], clicks (4: machines, then a belt each). */
D['gap-lanes'] = {
	clicks: true,
	css: `${base('gap-lanes')}
.gap-lanes .gap-hd { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 700; color: var(--ink); }
.gap-lanes .gap-cnt { font-size: 23px; font-weight: 700; color: var(--blue); }
.gap-lanes .gap-said { font-size: 21px; line-height: 1.32; color: var(--ink); }
.gap-lanes .gap-said b { color: var(--blue); }
.gap-lanes .gap-said .ic { color: var(--blue); vertical-align: -4px; margin-right: 6px; }
.gap-lanes .gap-said .mark { background: none; padding: 0; margin: 0; font-weight: 700; }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), H = bodyHeight(s);
		const HC = 830, AC = 1240, LY = [372, 504, 636], nH = s.harm?.cells ?? 0, nA = s.asked?.cells ?? 0;
		let svg = '', html = '';
		svg += `<rect x="640" y="0" width="380" height="${H}" rx="20" fill="var(--surface)"/><rect x="1050" y="0" width="380" height="${H}" rx="20" fill="var(--surface)"/>`;
		// Could it do harm? The scanner, with its 12 checks on its screen.
		html += tx('gap-cnt', HC, 0, fmt(s.harm?.count ?? ''), { align: 'c', nolint: true });
		svg += belt(662, 998, 176, { pitch: 80 });
		svg += scanner(690, 176, 280, 54);
		const hs = screen(HC, 34, { cells: Array(nH).fill('tick'), cols: 6, cell: 18, gap: 5, pad: 10, post: 102 });
		svg += hs.svg;
		html += tx('gap-hd', HC, 222, fmt(s.harm?.name ?? ''), { align: 'c', nolint: true });
		// The second question: the gate, its screen on the right pedestal.
		svg += `<line x1="1072" y1="212" x2="1408" y2="212" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
		const as = screen(1308, 34, { cells: Array(nA).fill('tick'), cols: 6, cell: 18, gap: 5, pad: 10, post: 118 });
		svg += as.svg;
		svg += gate(1110, 212, 220, 96);
		html += tx('gap-cnt', 1308, 0, fmt(s.asked?.count ?? ''), { align: 'c', nolint: true });
		html += tx('gap-hd', AC, 222, fmt(s.asked?.name ?? ''), { align: 'c', nolint: true });
		// You: a check-in kiosk on a table, the declaration form on its screen (field lines with tick boxes, a submit bar).
		const field = (w, tick) => `<div style="display:flex;align-items:center;gap:6px"><i style="display:block;width:10px;height:10px;border-radius:2px;border:2px solid ${tick ? 'var(--blue)' : 'var(--line-strong)'};background:${tick ? 'var(--blue)' : '#fff'}"></i><b style="display:block;width:${w}%;height:6px;border-radius:3px;background:var(--line-strong)"></b></div>`;
		const chat = `<div style="position:absolute;inset:0;background:#fff;padding:10px 14px;display:flex;flex-direction:column;gap:7px"><b style="display:block;width:46%;height:8px;border-radius:3px;background:var(--ink)"></b>${[[70, 1], [55, 0], [62, 1]].map(([w, k]) => field(w, k)).join('')}<b style="display:block;align-self:flex-end;width:34%;height:12px;border-radius:4px;background:var(--blue)"></b></div>`;
		html += laptop({ x: 186, y: 4, w: 228, content: chat }).html;
		svg += `<rect x="140" y="188" width="12" height="16" fill="var(--line-strong)" stroke="var(--ink)" stroke-width="3"/><rect x="448" y="188" width="12" height="16" fill="var(--line-strong)" stroke="var(--ink)" stroke-width="3"/>`;
		svg += `<line x1="100" y1="205" x2="500" y2="205" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
		svg += `<rect x="110" y="178" width="380" height="14" rx="5" fill="var(--line-strong)" stroke="var(--ink)" stroke-width="3"/>`;
		html += tx('gap-hd', 300, 222, `${ic('person', 28, 'var(--blue)')}<span>${fmt(s.saidHead ?? '')}</span>`, { align: 'c', nolint: true });
		// The three belts on one rack: an upright at each end, standing on the floor.
		const FL = H - 2;
		svg += `<line x1="610" y1="${FL}" x2="1728" y2="${FL}" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
		[634, 1712].forEach(x => { svg += leg(x, LY[0] + 20, FL); });
		LY.forEach(y => { svg += belt(620, 1728, y, { pitch: 110 }); });

		const cellsOf = (n, flags) => Array.from({ length: n }, (_, i) => ((flags ?? []).includes(i) ? 'flag' : 'ok'));
		const laneScreen = (cx, y, n, flags) => screen(cx, y - 70, { cells: cellsOf(n, flags), cols: 6, cell: 14, gap: 4, pad: 8, post: y }).svg;
		(s.cases ?? []).slice(0, 3).forEach((c, i) => {
			if (step < i + 2) return;
			const y = LY[i];
			svg += `<rect x="0" y="${y - 94}" width="600" height="84" rx="14" fill="var(--blue-tint)"/>`;
			html += tx('gap-said', 18, y - 86, `${ic('person', 24)}<b>${fmt(s.you ?? '')}</b> ${fmt(c.said ?? '')}`, { w: 566, wrap: true });
			const tone = c.stop ? 'orange' : 'green';
			let b;
			svg += laneScreen(860, y, nH, c.stop === 'harm' ? c.flags : []);
			if (c.stop === 'harm') {
				b = bag('pack', 712, y, 78, 'grey');
				html += tx('gap-flag', 930, y - 76, fmt(c.flag ?? ''), { tone: 'orange' });
			} else {
				svg += laneScreen(1215, y, nA, c.stop === 'asked' ? c.flags : []);
				if (c.stop === 'asked') {
					b = bag('case', 1100, y, 80, 'silver');
					html += tx('gap-flag', 1284, y - 76, fmt(c.flag ?? ''), { tone: 'orange' });
				} else {
					b = bag('case', 1480, y, 80, 'dark');
				}
			}
			svg += b.svg;
			html += sign(1728, y - 76, { text: c.out, tone }, 'r');
			const tg = luggageTag(c.stop === 'harm' ? 672 : c.stop === 'asked' ? 1046 : 1436, y + 16, c.label ?? '', { fs: 20, h: 34, tone, from: b.handle });
			svg += tg.svg;
			html += tg.html;
		});
		return heading(s) + body(`<div class="gap-lanes" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** A diamond (a question in a flowchart) with its text kept inside. state: 'on' | 'ghost'. */
function diamond(cx, cy, hw, hh, text, state) {
	const on = state === 'on';
	const svg = `<path d="M ${cx} ${cy - hh} L ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy} Z" fill="#fff" stroke="${on ? 'var(--ink)' : 'var(--line-strong)'}" stroke-width="${on ? 5 : 4}" stroke-linejoin="round"/>`;
	const html = `<div class="gap-shape" data-shape style="${at(cx - hw * 0.62, cy - hh * 0.62, hw * 1.24, hh * 1.24)}">${t(`gap-dtx${on ? '' : ' gap-dim'}`, 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)', fmt(text ?? ''), { nolint: true })}</div>`;
	return { svg, html };
}

/** A small rounded label on a line: a word ('yes', 'no') or a check and its answer. tone: a colour, or none (grey). */
function chip(x, y, html, tone, o = {}) {
	return tx(`gap-chip${tone ? '' : ' gap-dim'}${o.big ? ' gap-chip-l' : ''}`, x, y, html, { align: 'cc', tone, nolint: true });
}

const CLOSE_CSS = n => `${base(n)}
.${n} .gap-said { font-size: 22px; line-height: 1.32; color: var(--ink); }
.${n} .gap-said b { color: var(--fg); }
.${n} .gap-said .ic { color: var(--fg); vertical-align: -4px; margin-right: 6px; }
.${n} .gap-dtx { font-size: 24px; font-weight: 700; line-height: 1.2; text-align: center; color: var(--ink); white-space: nowrap; }
.${n} .gap-dim { color: var(--faint); border-color: var(--line-strong); }
.${n} .gap-chip { display: flex; align-items: center; gap: 8px; padding: 0 14px; height: 32px; border-radius: 10px; border: 3px solid var(--fg); background: #fff; font-size: 20px; color: var(--ink); }
.${n} .gap-chip b { color: var(--fg); }
.${n} .gap-chip.gap-dim { border-color: var(--line-strong); color: var(--faint); }
.${n} .gap-chip-l { height: 40px; font-size: 22px; }
.${n} .gap-clear { display: flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 700; color: var(--fg); }
.${n} .gap-clear.gap-dim { color: var(--faint); }
.${n} .gap-note { font-size: 21px; line-height: 1.3; color: var(--ink); white-space: normal; }
.${n} .gap-why { font-size: 20px; line-height: 1.3; font-style: italic; color: var(--body); white-space: normal; text-align: right; }
.${n} .gap-time { font-size: 22px; font-weight: 700; color: var(--fg); }
.${n} .gap-lh { font-size: 24px; font-weight: 700; color: var(--ink); }
.${n} .gap-lsub { font-size: 19px; font-weight: 600; color: var(--muted); }
.${n} .gap-lq { font-size: 21px; color: var(--ink); }
.${n} .gap-lv { font-size: 21px; font-weight: 600; color: var(--body); }
.${n} .gap-lq.gap-hi, .${n} .gap-lv.gap-hi { font-weight: 700; }
.${n} .gap-lv.gap-hi { color: var(--fg); }
`;

/** One bag up close (shared by gap-close-ask and gap-close-run): what you said, the bag's tag, a two-question
 * flowchart that lights up click by click, the notice at the bottom, and the answers in two lists on the right.
 * mode 'ask': a harm check is very sure, so it is opened at once. mode 'run': no harm, a doubt, then a sign carries it
 * to the green end. */
function closeUp(s, ctx, mode) {
	const step = stepOf(ctx), H = bodyHeight(s), F = s.flow ?? {}, ask = mode === 'ask';
	const last = ask ? 4 : 5;
	let svg = '', html = '';
	const ghost = 'var(--line-strong)';
	const doubtOn = !ask && step >= 4;
	svg += `<rect x="0" y="0" width="780" height="80" rx="16" fill="${doubtOn ? 'var(--orange-tint)' : 'var(--blue-tint)'}"${doubtOn ? ' stroke="var(--orange)" stroke-width="3"' : ''}/>`;
	html += tx('gap-said', 18, s.said && s.said.length > 70 ? 8 : 22, `${ic('person', 24)}<b>${fmt(s.you ?? '')}</b> ${fmt(s.said ?? '')}`, { w: 744, wrap: true, tone: doubtOn ? 'orange' : 'blue' });
	const tone = step >= last ? (ask ? 'orange' : 'green') : 'neutral';
	const tg = luggageTag(0, 100, s.label ?? '', { fs: 27, h: 54, tone });
	svg += tg.svg;
	html += tg.html;
	svg += arrow('M 130 160 V 228', [130, 232], 90, { color: 'var(--ink)' });

	// The flowchart.
	const Y = 316, d1 = diamond(130, Y, 130, 80, F.harm, step >= 3 ? 'on' : 'ghost'), d2 = diamond(560, Y, 130, 80, F.asked, !ask && step >= 4 ? 'on' : 'ghost');
	const col = (on, c) => (on ? `var(--${c})` : ghost);
	const harmYes = ask && step >= 3, harmNo = !ask && step >= 3, doubt = !ask && step >= 4, signOn = !ask && step >= 5;
	svg += arrow(`M 260 ${Y} H 426`, [430, Y], 0, { color: col(harmNo, 'green') });
	svg += arrow(`M 690 ${Y} H 796`, [800, Y], 0, { color: ghost });
	svg += arrow(`M 130 ${Y + 80} V 532`, [130, 536], 90, { color: col(harmYes, 'orange') });
	svg += `<path d="M 560 ${Y + 80} V 452" stroke="${col(doubt, 'orange')}" stroke-width="4"/>`;
	svg += arrow('M 560 488 V 532', [560, 536], 90, { color: ghost });
	// The closer look: from the doubt round to the green end, drawn only once there is a doubt.
	if (doubt) svg += arrow('M 712 470 H 900 Q 924 470 924 446 V 362', [924, 358], -90, { color: col(signOn, 'green'), sw: signOn ? 6 : 4 });
	svg += d1.svg + d2.svg;
	html += d1.html + d2.html;
	svg += `<rect x="800" y="${Y - 40}" width="250" height="80" rx="40" fill="${signOn ? 'var(--green-tint)' : '#fff'}" stroke="${signOn ? 'var(--green)' : ghost}" stroke-width="${signOn ? 5 : 4}"/>`;
	html += tx(`gap-clear${signOn ? '' : ' gap-dim'}`, 925, Y, `${ic('play', 32)}<span>${fmt(F.clear ?? '')}</span>`, { align: 'cc', tone: signOn ? 'green' : null, nolint: true });
	html += chip(345, Y, esc(F.no ?? ''), harmNo ? 'green' : null);
	html += chip(745, Y, esc(F.yes ?? ''), null);
	html += chip(130, 428, esc(F.yes ?? ''), harmYes ? 'orange' : null);
	if (ask) {
		html += chip(560, 470, esc(F.no ?? ''), null);
		if (step >= 3) html += chip(130, 490, `<span>${fmt(s.chip?.text ?? '')}</span><b>${esc(s.chip?.v ?? '')}</b>`, 'orange', { big: true });
	} else {
		const c = s.chips ?? {};
		if (step >= 3) html += chip(345, 262, `<span>${fmt(c.harm?.text ?? '')}</span><b>${esc(c.harm?.v ?? '')}</b>`, 'green');
		html += doubt ? chip(560, 470, `<span>${fmt(c.doubt?.text ?? '')}</span><b>${esc(c.doubt?.v ?? '')}</b>`, 'orange', { big: true }) : chip(560, 470, esc(F.no ?? ''), null);
		if (doubt) html += tx('gap-why', 380, 462, fmt(s.why ?? ''), { w: 250, align: 'r' });
		if (signOn) {
			html += chip(900, 516, `<span>${fmt(c.sign?.text ?? '')}</span><b>${esc(c.sign?.v ?? '')}</b>`, 'green', { big: true });
			html += tx('gap-note', 760, 150, `${ic('checkmark', 24, 'var(--green)')} ${fmt(s.ok ?? '')}`, { w: 300 });
			html += tx('gap-time', 760, 222, fmt(s.time ?? ''), { tone: 'green' });
		}
	}
	html += noticeBox(0, 540, 740, s.notice, { inline: true, reason: ask && step >= 4 ? s.reason : '', state: ask && step >= 4 ? 'on' : 'ghost' });
	if (ask && step >= 4) {
		html += tx('gap-time', 766, 596, fmt(s.time ?? ''), { tone: 'orange' });
	}

	// The answers: a lookup table of check names and values, not text to read (so not counted as words).
	if (step >= 2) {
		const L = s.lists ?? {}, AX = 1090, AW = 290, BX = 1410, BW = 318;
		const list = (x, w, y0, pitch, items, hiFrom) => items.forEach((it, i) => {
			const y = y0 + i * pitch, hi = it.tone && step >= (it.from ?? hiFrom);
			if (hi) svg += `<rect x="${x - 8}" y="${y - 7}" width="${w + 16}" height="38" rx="8" fill="var(--${it.tone}-tint)"/>`;
			html += tx(`gap-lq${hi ? ' gap-hi' : ''}`, x, y, fmt(it.q ?? ''), { nolint: true });
			html += tx(`gap-lv${hi ? ' gap-hi' : ''}`, x + w, y, esc(it.v ?? ''), { align: 'r', tone: hi ? it.tone : null, nolint: true });
		});
		html += tx('gap-lh', AX, 0, fmt(L.harm ?? ''), { nolint: true });
		svg += `<line x1="${AX}" y1="40" x2="${AX + AW}" y2="40" stroke="var(--ink)" stroke-width="3"/>`;
		list(AX, AW, 58, 47, s.harmList ?? [], 3);
		html += tx('gap-lh', BX, 0, fmt(L.asked ?? ''), { nolint: true });
		svg += `<line x1="${BX}" y1="40" x2="${BX + BW}" y2="40" stroke="var(--ink)" stroke-width="3"/>`;
		html += tx('gap-lsub', BX, 54, fmt(L.signs ?? ''), { nolint: true });
		list(BX, BW, 90, 43, s.signs ?? [], 3);
		html += tx('gap-lsub', BX, 356, fmt(L.doubts ?? ''), { nolint: true });
		list(BX, BW, 392, 43, s.doubts ?? [], 3);
	}
	return { svg, html, H };
}

/** Up close, a bag that is opened: the harm question lights up, its check is very sure, and the notice opens at
 * once with that check's reason. Fields: eyebrow, title, you, said, label, flow: { harm, asked, clear, yes, no }, lists:
 * { harm, asked, signs, doubts }, harmList, signs, doubts: [{ q, v, tone, from (the click it lights up) }],
 * chip: { text, v } (the check on the harm path), notice: { title, buttons, app }, reason, time, clicks (4). */
D['gap-close-ask'] = {
	clicks: true,
	css: CLOSE_CSS('gap-close-ask'),
	render(s, ctx = {}) {
		const { svg, html, H } = closeUp(s, ctx, 'ask');
		return heading(s) + body(`<div class="gap-close-ask" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Up close, a bag that goes through after a closer look: no harm, a doubt stops it at once, then a very sure sign
 * carries it round to the green end. Fields: as gap-close-ask, with chips: { harm, doubt, sign } ({ text, v } each)
 * instead of chip, why (a note by the doubt), ok (a note by the green end), and clicks (5). */
D['gap-close-run'] = {
	clicks: true,
	css: CLOSE_CSS('gap-close-run'),
	render(s, ctx = {}) {
		const { svg, html, H } = closeUp(s, ctx, 'run');
		return heading(s) + body(`<div class="gap-close-run" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** A small suitcase to count with (one in a hundred, or one mistake): a body, a handle, two ribs. look: a tone
 * ('red', 'orange') filled, or 'gone' (a dashed green outline: one that no longer happens). */
function miniCase(x, y, w, h, look) {
	const top = y + h * 0.2, gone = look === 'gone';
	const fill = gone ? 'var(--green-tint)' : `var(--${look})`, stroke = gone ? 'var(--green)' : fill;
	return `<path d="M ${r1(x + w * 0.32)} ${r1(top)} V ${r1(y + 2)} H ${r1(x + w * 0.68)} V ${r1(top)}" fill="none" stroke="${gone ? 'var(--green)' : fill}" stroke-width="3"${gone ? ' stroke-dasharray="4 4"' : ''}/>`
		+ `<rect x="${r1(x)}" y="${r1(top)}" width="${r1(w)}" height="${r1(h * 0.8)}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${gone ? ' stroke-dasharray="5 4"' : ''}/>`
		+ (gone ? '' : [0.36, 0.64].map(f => `<line x1="${r1(x + w * f)}" y1="${r1(top + 6)}" x2="${r1(x + w * f)}" y2="${r1(y + h - 6)}" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/>`).join(''));
}

/** The results as a table you can count, built row by row: today's check against the quick check. Mistake 1 (a risky
 * one went through) as red suitcases in a tray, only the mistakes drawn; mistake 2 (a safe one was stopped) as one suitcase
 * per hundred, the ones that no longer happen dashed and boxed in green, named underneath; the wait as one bar per tenth of a second. Fields:
 * eyebrow, title, bench: { cap, text }, cols (2): [{ name, sub, tone }], risky: { cap, title, sub, note, today: { count,
 * value, sub }, now: { none, value, sub } }, needless: { cap, title, sub, today: { count, value, sub }, now: { count,
 * value, sub, delta } }, wait: { title, sub, unit (seconds a bar), today: { seconds, value, sub }, now: { seconds,
 * value, sub, delta } }; each row's note is its legend (what one case or bar stands for). Clicks (4: header, then a
 * row each). */
D['gap-results'] = {
	clicks: true,
	css: `${base('gap-results')}
.gap-results .gap-capg { font-size: 19px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--body); }
.gap-results .gap-bench { font-size: 23px; line-height: 1.35; color: var(--ink); white-space: normal; }
.gap-results .gap-col { font-size: 31px; font-weight: 700; color: var(--fg); }
.gap-results .gap-rt { font-size: 29px; font-weight: 700; color: var(--ink); }
.gap-results .gap-note { font-size: 19px; font-style: italic; color: var(--muted); }
.gap-results .gap-big { font-size: 64px; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: var(--fg); }
.gap-results .gap-delta { font-size: 27px; font-weight: 700; line-height: 1.2; color: var(--green); white-space: normal; }
.gap-results .gap-none { display: flex; align-items: center; gap: 14px; font-size: 36px; font-weight: 700; color: var(--green); }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), H = bodyHeight(s);
		const [c0, c1] = s.cols ?? [{}, {}], X0 = 424, V0 = 780, X1 = 1112, V1 = 1468;
		let svg = '', html = '';
		html += tx('gap-capg', 0, 0, fmt(s.bench?.cap ?? ''), { nolint: true });
		html += tx('gap-bench', 0, 32, fmt(s.bench?.text ?? ''), { w: 390 });
		html += tx('gap-col', X0, 4, fmt(c0.name ?? ''), { tone: c0.tone ?? 'neutral', nolint: true });
		html += tx('gap-sub', X0, 50, fmt(c0.sub ?? ''));
		html += tx('gap-col', X1, 4, fmt(c1.name ?? ''), { tone: c1.tone ?? 'green', nolint: true });
		html += tx('gap-sub', X1, 50, fmt(c1.sub ?? ''));
		const rule = y => `<line x1="0" y1="${y}" x2="1728" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;
		svg += rule(106);
		const value = (x, y, o, tone) => {
			html += tx('gap-big', x, y, esc(o?.value ?? ''), { tone, nolint: true });
			html += tx('gap-sub', x, y + 74, fmt(o?.sub ?? ''));
		};
		const R = s.risky ?? {}, N = s.needless ?? {}, Wt = s.wait ?? {};
		if (step >= 2) {
			html += tx('gap-cap', 0, 130, fmt(R.cap ?? ''), { tone: 'red', nolint: true });
			html += tx('gap-rt', 0, 160, fmt(R.title ?? ''), { nolint: true });
			html += tx('gap-sub', 0, 202, fmt(R.sub ?? ''));
			html += tx('gap-note', 0, 238, fmt(R.note ?? ''));
			svg += `<rect x="${X0}" y="144" width="310" height="104" rx="18" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
			const n = R.today?.count ?? 0, cw = 44, gap = 26, x0 = X0 + (310 - (n * cw + (n - 1) * gap)) / 2;
			for (let i = 0; i < n; i++) svg += miniCase(x0 + i * (cw + gap), 164, cw, 64, 'red');
			value(V0, 148, R.today, 'neutral');
			svg += `<rect x="${X1}" y="144" width="310" height="104" rx="18" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
			html += tx('gap-none', X1 + 155, 196, `${ic('checkCircle', 44)}<span>${fmt(R.now?.none ?? '')}</span>`, { align: 'cc', nolint: true });
			value(V1, 148, R.now, 'green');
			svg += rule(288);
		}
		if (step >= 3) {
			html += tx('gap-cap', 0, 316, fmt(N.cap ?? ''), { tone: 'orange', nolint: true });
			html += tx('gap-rt', 0, 346, fmt(N.title ?? ''), { nolint: true });
			html += tx('gap-sub', 0, 388, fmt(N.sub ?? ''));
			html += tx('gap-note', 0, 424, fmt(N.note ?? ''));
			const grid = (x, n, total, look) => {
				for (let i = 0; i < total; i++) svg += miniCase(x + (i % 8) * 40, 306 + Math.floor(i / 8) * 54, 30, 42, i < n ? 'orange' : look);
			};
			grid(X0, N.today?.count ?? 0, N.today?.count ?? 0, 'orange');
			value(V0, 300, N.today, 'neutral');
			const before = N.today?.count ?? 0, now = N.now?.count ?? 0;
			grid(X1, now, before, 'gone');
			if (before > now) {
				// The ones that no longer happen, boxed in green and named underneath.
				const first = now % 8, row = Math.floor(now / 8), bx = X1 + first * 40 - 8, by = 306 + row * 54 - 8, bw = (8 - first) * 40 + 6;
				svg += `<rect x="${bx}" y="${by}" width="${bw}" height="58" rx="12" fill="none" stroke="var(--green)" stroke-width="3"/>`;
				html += tx('gap-delta', bx + bw / 2, by + 66, fmt(N.now?.delta ?? ''), { align: 'c' });
			}
			value(V1, 300, N.now, 'green');
			svg += rule(488);
		}
		if (step >= 4) {
			html += tx('gap-rt', 0, 528, fmt(Wt.title ?? ''), { nolint: true });
			html += tx('gap-sub', 0, 570, fmt(Wt.sub ?? ''));
			html += tx('gap-note', 0, 606, fmt(Wt.note ?? ''));
			const unit = Wt.unit ?? 0.1, total = Math.round((Wt.today?.seconds ?? 0) / unit), lit = Math.round((Wt.now?.seconds ?? 0) / unit);
			const per = Math.ceil(total / 2);
			const bars = (x, n, tone) => {
				for (let i = 0; i < total; i++) {
					const bx = x + (i % per) * 24, by = 516 + Math.floor(i / per) * 48;
					svg += i < n ? `<rect x="${bx}" y="${by}" width="14" height="36" rx="4" fill="var(--${tone})"/>` : `<rect x="${bx + 1.5}" y="${by + 1.5}" width="11" height="33" rx="4" fill="none" stroke="var(--line-strong)" stroke-width="3"/>`;
				}
			};
			bars(X0, total, 'muted');
			value(V0, 512, Wt.today, 'neutral');
			bars(X1, lit, 'green');
			value(V1, 512, Wt.now, 'green');
			html += tx('gap-delta', V1, 596, fmt(Wt.now?.delta ?? ''), { w: 236 });
		}
		return heading(s) + body(`<div class="gap-results" style="height:${H}px">${svgEl(1728, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** The close, on a dark page, in big type built click by click, with the scene on the right: the scanner and its
 * screen of ticks still working, a bag through with a green tag, and today's desk, empty, with a closed sign.
 * Fields: eyebrow, lines (3): [{ big, sub } | { thanks }], scene: { check (the screen's title), cells, tag, officer
 * (the nameplate), closed (the sign) }, clicks (3). */
D['gap-closing'] = {
	clicks: true,
	bare: true,
	css: `${base('gap-closing')}
.gap-closing { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; --gap-line: #d5d8de; --gap-paper: #2a2c33; --gap-metal: #4a4d56; --gap-screen: #111318; }
.gap-closing .gap-big { font-size: 112px; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: #fff; }
.gap-closing .gap-big.gap-old { color: #b9a1e8; }
.gap-closing .gap-bsub { font-size: 30px; color: #c4c7ce; }
.gap-closing .gap-thanks { font-size: 50px; font-weight: 700; color: #6cb8f6; }
.gap-closing .gap-tagtx { color: #fff; }
.gap-closing .gap-plate { font-size: 22px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #b9a1e8; }
.gap-closing .gap-shut { font-size: 26px; font-weight: 700; color: #fff; }
/* The step bar's unvisited dots are too faint on a dark page (3.8:1); lift them on this one. */
.gap-closing ~ .bs-bar .bs-dot.next { color: #a9adb6; }
`,
	render(s, ctx = {}) {
		const step = stepOf(ctx), sc = s.scene ?? {}, L = s.lines ?? [];
		let svg = '', html = '';
		html += tx('st-eyebrow', 96, 100, fmt(s.eyebrow ?? ''), { nolint: true });
		html += tx('gap-big', 96, 176, fmt(L[0]?.big ?? ''), { nolint: true });
		html += tx('gap-bsub', 96, 312, fmt(L[0]?.sub ?? ''));
		if (step >= 2) {
			html += tx('gap-big gap-old', 96, 430, fmt(L[1]?.big ?? ''), { nolint: true });
			html += tx('gap-bsub', 96, 566, fmt(L[1]?.sub ?? ''));
		}
		if (step >= 3) {
			html += tx('gap-thanks', 96, 700, fmt(L[2]?.thanks ?? ''), { nolint: true });
		}
		// The scene: the scanner still working, a bag through, and (from the second click) the empty desk.
		const FL = 900, Y = 760;
		svg += `<line x1="1040" y1="${FL}" x2="1824" y2="${FL}" stroke="#4a4d56" stroke-width="4" stroke-linecap="round"/>`;
		svg += belt(1040, 1580, Y, { legs: [1058, 1562], floor: FL });
		svg += scanner(1080, Y, 300, 160, { floor: FL });
		const scr = screen(1230, 420, { cells: Array(sc.cells ?? 0).fill('tick'), cols: 8, cell: 20, gap: 6, title: sc.check, post: Y - 160 - 22 });
		svg += scr.svg;
		html += scr.html;
		const b = bag('case', 1470, Y, 150, 'silver');
		svg += b.svg;
		const tg = luggageTag(1396, Y + 30, sc.tag ?? '', { tone: 'green', from: b.handle });
		svg += tg.svg;
		html += tg.html;
		if (step >= 2) {
			svg += `<rect x="1626" y="${Y}" width="190" height="${FL - Y}" fill="#2a2c33" stroke="#d5d8de" stroke-width="${SW}"/><rect x="1612" y="${Y - 20}" width="218" height="22" rx="6" fill="#4a4d56" stroke="#d5d8de" stroke-width="${SW}"/>`;
			svg += `<rect x="1651" y="${Y + 40}" width="140" height="46" rx="8" fill="#3a2d55" stroke="#b9a1e8" stroke-width="3"/>`;
			html += tx('gap-plate', 1721, Y + 63, fmt(sc.officer ?? ''), { align: 'cc', nolint: true });
			svg += `<path d="M 1680 ${Y - 80} L 1668 ${Y - 20} M 1762 ${Y - 80} L 1774 ${Y - 20}" stroke="#d5d8de" stroke-width="5" stroke-linecap="round"/>`;
			svg += `<rect x="1652" y="${Y - 148}" width="138" height="72" rx="10" fill="#4a4d56" stroke="#d5d8de" stroke-width="${SW}"/>`;
			html += tx('gap-shut', 1721, Y - 112, fmt(sc.closed ?? ''), { align: 'cc', nolint: true });
		}
		return `<div class="gap-closing">${svgEl(1920, 1080, svg)}${html}</div>`;
	},
};
