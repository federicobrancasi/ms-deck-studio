// A gallery for inspiration (the switchboard world): read it for technique: one helper that draws the recurring object
// in two states (grey for the old way, purple for the new), cords that fan out to labelled lines with the picked one
// patched, and counting lamps on jack strips. A new deck draws its own pictures in designs/local-<deck>.mjs; do not
// reuse these as they are.
// World: a telephone exchange. Each job is an incoming call; the switchboard patches it; each place it can go is a
// line on the jack field, with its name on the line card. Recurring object: the switchboard (swb()): grey with four
// meters for the old way (kind 'meters'), purple with a panel of lit question lamps and the operator's headset for the
// new way (kind 'lamps'). Every visible word comes from the slide's fields; examples/switchboard.mjs shows them in a
// deck.
//   gsb-cover:    the cover; look 'board' (a call rings in, the switchboard patches it to one of six lines), 'boards'
//                (today's grey exchange and the new switchboard), 'close' (the switchboard up close), 'fork' (two lines)
//   gsb-today:    the grey exchange with four meters; cable bundles sized by share run to three line cards
//   gsb-yard:     two lamp fields of 100 calls: lines to the able desk (green) and to the cheap one (red) (2 clicks)
//   gsb-how:      ask, guess, patch; look 'line' (the switchboard, a board, the jack field, 3 clicks), 'cabin' (at the
//                operator's desk), 'board' (one board)
//   gsb-levers:   the switchboard face: one lamp and one lever key per question, grouped by what they return; a ticket
//   gsb-gradient: three rising floors, each with two gauge glasses (the cheap and the able line) and the gap between them
//   gsb-budget:   a knob with three marks patches the same call to three lines (3 clicks)
//   gsb-map:      a cost-quality chart: the old way grey, the new way purple (2 clicks)
//   gsb-board:    a hanging board: one row per group, a gain bar each (2 clicks)
//   gsb-works:    the close (blue page): a finished line on poles, poles without wire, survey stakes
import { W, STYLE, at, t, layer, band, mix, wob, r1, esc, fmt, ic, iconTile, pill, heading, body, bodyHeight, logo, msLogo } from '../src/kit.mjs';

const SW = STYLE.stroke, SB = STYLE.strokeBold;
const CABLE = '#8a8f98';

// ---------- the recurring objects ----------

/** Cables along the paths ds: a rubber-sheathed line with a highlight. tone: the sheath (purple: a patched call). */
function cables(ds, { s = 1, tone = null, colour = CABLE, opacity = 1 } = {}) {
	const list = Array.isArray(ds) ? ds : [ds];
	const c = tone ? `var(--${tone})` : colour;
	return `<g opacity="${opacity}">${list.map(d => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${r1(9 * s)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${r1(2.2 * s)}" stroke-linecap="round" opacity=".45" transform="translate(0 ${r1(-1.6 * s)})"/>`).join('')}</g>`;
}

/** A jack socket at (x, y) facing right (a cable plugs in from the left): a brass ring round a dark hole. */
function jack(x, y, s = 1, { lit = false } = {}) {
	return `<rect x="${r1(x - 6 * s)}" y="${r1(y - 15 * s)}" width="${r1(18 * s)}" height="${r1(30 * s)}" rx="${r1(5 * s)}" fill="#fff" stroke="var(--ink)" stroke-width="${r1(3 * s)}"/>`
		+ `<circle cx="${r1(x + 3 * s)}" cy="${r1(y)}" r="${r1(6 * s)}" fill="${lit ? 'var(--purple)' : 'var(--ink)'}"/>`;
}

/** A plug at the end of a cable that arrives at (x, y) from the left: a sleeve, a collar and a tip. */
function plug(x, y, s = 1, tone = 'purple') {
	return `<rect x="${r1(x - 34 * s)}" y="${r1(y - 9 * s)}" width="${r1(24 * s)}" height="${r1(18 * s)}" rx="${r1(4 * s)}" fill="var(--${tone})"/>`
		+ `<rect x="${r1(x - 12 * s)}" y="${r1(y - 6 * s)}" width="${r1(8 * s)}" height="${r1(12 * s)}" rx="${r1(2 * s)}" fill="var(--ink)"/>`
		+ `<path d="M ${r1(x - 4 * s)} ${r1(y)} H ${r1(x + 4 * s)}" stroke="var(--ink)" stroke-width="${r1(5 * s)}" stroke-linecap="round"/>`;
}

/** A call travelling along a cable: a lit bead with a ring. */
function bead(x, y, s = 1) {
	return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(20 * s)}" fill="${mix('blue', 18)}" stroke="var(--blue)" stroke-width="${r1(3 * s)}"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(9 * s)}" fill="var(--blue)"/>`;
}

/** A desk telephone on a small side table, standing on the floor at y = g: the incoming call. Returns the SVG and where
 * its cord leaves (to the right). */
function deskPhone(x, g, s = 1, { muted = false, floor = true } = {}) {
	const c = muted ? 'var(--faint)' : 'var(--blue)', ink = muted ? 'var(--faint)' : 'var(--ink)';
	const tw = 150 * s, th = 96 * s, top = g - th;
	let o = `<rect x="${r1(x)}" y="${r1(top)}" width="${r1(tw)}" height="${r1(12 * s)}" rx="${r1(4 * s)}" fill="${ink}"/>`;
	o += `<path d="M ${r1(x + 18 * s)} ${r1(top + 12 * s)} L ${r1(x + 10 * s)} ${r1(g)} M ${r1(x + tw - 18 * s)} ${r1(top + 12 * s)} L ${r1(x + tw - 10 * s)} ${r1(g)}" stroke="${ink}" stroke-width="${r1(6 * s)}" stroke-linecap="round"/>`;
	// The phone: a sloped body, a rotary dial, the handset in its cradle.
	const px = x + 22 * s, pw = 106 * s, pb = top, pt = top - 52 * s;
	o += `<path d="M ${r1(px)} ${r1(pb)} L ${r1(px + 14 * s)} ${r1(pt)} H ${r1(px + pw - 14 * s)} L ${r1(px + pw)} ${r1(pb)} Z" fill="${muted ? '#f4f5f7' : mix('blue', 16)}" stroke="${c}" stroke-width="${r1(4 * s)}" stroke-linejoin="round"/>`;
	o += `<circle cx="${r1(px + pw / 2)}" cy="${r1(pb - 24 * s)}" r="${r1(16 * s)}" fill="#fff" stroke="${c}" stroke-width="${r1(3 * s)}"/><circle cx="${r1(px + pw / 2)}" cy="${r1(pb - 24 * s)}" r="${r1(5 * s)}" fill="${c}"/>`;
	o += `<path d="M ${r1(px - 6 * s)} ${r1(pt - 4 * s)} q ${r1(10 * s)} ${r1(-22 * s)} ${r1(30 * s)} ${r1(-16 * s)} H ${r1(px + pw - 24 * s)} q ${r1(20 * s)} ${r1(-6 * s)} ${r1(30 * s)} ${r1(16 * s)}" fill="none" stroke="${c}" stroke-width="${r1(13 * s)}" stroke-linecap="round" stroke-linejoin="round"/>`;
	// It rings: three short marks over the handset.
	if (!muted) {
		for (const [dx, dy, ex, ey] of [[-20, -44, -32, -58], [pw / 2, -52, pw / 2, -70], [pw + 20, -44, pw + 32, -58]]) {
			o += `<path d="M ${r1(px + dx * 1 * s)} ${r1(pt + dy * s)} L ${r1(px + ex * s)} ${r1(pt + ey * s)}" stroke="var(--blue)" stroke-width="${r1(4 * s)}" stroke-linecap="round"/>`;
		}
	}
	if (floor) {
		o += `<path d="M ${r1(x - 20 * s)} ${r1(g)} H ${r1(x + tw + 20 * s)}" stroke="var(--faint)" stroke-width="${r1(3 * s)}" stroke-linecap="round"/>`;
	}
	return { svg: o, out: [px + pw, pb - 8 * s] };
}

/** Switchboard geometry at scale s: it stands on the floor at y = g, its left edge at x. */
function swbGeo(x, g, s = 1) {
	const w = 300 * s, legH = 66 * s, frontH = 58 * s, shelfH = 26 * s, panelH = 236 * s, headH = 52 * s;
	const deskTop = g - legH - frontH, shelfTop = deskTop - shelfH, panelTop = shelfTop - panelH, headTop = panelTop - headH;
	return { x, g, s, w, cx: x + w / 2, legH, frontH, shelfH, panelH, headH, deskTop, shelfTop, panelTop, headTop,
		head: { x: x - 10 * s, y: headTop, w: w + 20 * s, h: headH },
		panel: { x: x + 24 * s, y: panelTop + 112 * s, w: w - 48 * s, h: 98 * s },
		out: [x + w + 10 * s, deskTop + 18 * s], in: [x - 10 * s, deskTop + 18 * s] };
}

/** The switchboard: a cabinet with a name header, a jack field with lamps, a question panel (14 purple lamps) or four
 * meters (kind 'meters'), a key shelf, a desk front with cords hanging in loops, legs on the floor and, for the
 * operator, a headset on its hook. muted: grey, not in play. */
function swb(geo, { kind = 'lamps', lamps = 14, muted = false, headset = true, floor = true } = {}) {
	const { x, g, s, w, deskTop, shelfTop, panelTop, headTop } = geo;
	const tone = kind === 'lamps' ? 'purple' : 'neutral';
	const frame = muted ? 'var(--faint)' : `var(--${tone})`, ink = muted ? 'var(--faint)' : 'var(--ink)';
	const lw = r1(SW * Math.min(1.2, Math.max(0.7, s)));
	const wood = muted ? '#f4f5f7' : kind === 'lamps' ? mix('purple', 10) : '#eef0f3';
	let o = '';
	// Legs and the floor line.
	for (const lx of [x + 16 * s, x + w - 30 * s]) {
		o += `<rect x="${r1(lx)}" y="${r1(deskTop + geo.frontH)}" width="${r1(14 * s)}" height="${r1(geo.legH)}" rx="${r1(3 * s)}" fill="${ink}"/>`;
	}
	// Desk front, with cords hanging in loops under the shelf.
	o += `<rect x="${r1(x - 8 * s)}" y="${r1(deskTop)}" width="${r1(w + 16 * s)}" height="${r1(geo.frontH)}" rx="${r1(6 * s)}" fill="${wood}" stroke="${frame}" stroke-width="${lw}"/>`;
	for (let i = 0; i < 4; i++) {
		const cx = x + (0.2 + i * 0.2) * w, dep = (30 + (i % 2) * 14) * s;
		o += `<path d="M ${r1(cx - 14 * s)} ${r1(deskTop + geo.frontH - 2)} q ${r1(14 * s)} ${r1(dep * 2)} ${r1(28 * s)} 0" fill="none" stroke="${muted ? 'var(--faint)' : i % 2 ? 'var(--neutral)' : frame}" stroke-width="${r1(4 * s)}" stroke-linecap="round"/>`;
	}
	// The key shelf, seen a little from above, with a row of keys and two plugs waiting.
	o += `<path d="M ${r1(x - 16 * s)} ${r1(deskTop)} L ${r1(x - 2 * s)} ${r1(shelfTop)} H ${r1(x + w + 2 * s)} L ${r1(x + w + 16 * s)} ${r1(deskTop)} Z" fill="#fff" stroke="${frame}" stroke-width="${lw}" stroke-linejoin="round"/>`;
	for (let i = 0; i < 9; i++) {
		const kx = x + 20 * s + i * ((w - 40 * s) / 8);
		o += `<rect x="${r1(kx - 4 * s)}" y="${r1(shelfTop + 6 * s)}" width="${r1(8 * s)}" height="${r1(14 * s)}" rx="${r1(3 * s)}" fill="${i % 3 === 1 && !muted ? `var(--${tone})` : ink}"/>`;
	}
	// The upright panel.
	o += `<rect x="${r1(x)}" y="${r1(panelTop)}" width="${r1(w)}" height="${r1(geo.panelH)}" fill="${wood}" stroke="${frame}" stroke-width="${lw}"/>`;
	// Jack field: three rows of jacks, a small lamp over each.
	const cols = 8, jw = (w - 48 * s) / cols;
	for (let r = 0; r < 3; r++) {
		for (let c = 0; c < cols; c++) {
			const jx = x + 24 * s + (c + 0.5) * jw, jy = panelTop + 22 * s + r * 30 * s;
			const on = !muted && (r * cols + c) % 7 === 3;
			o += `<circle cx="${r1(jx)}" cy="${r1(jy - 9 * s)}" r="${r1(3.6 * s)}" fill="${on ? 'var(--yellow)' : '#fff'}" stroke="${ink}" stroke-width="${r1(1.6 * s)}"/>`;
			o += `<circle cx="${r1(jx)}" cy="${r1(jy + 4 * s)}" r="${r1(5.5 * s)}" fill="#fff" stroke="${ink}" stroke-width="${r1(2 * s)}"/><circle cx="${r1(jx)}" cy="${r1(jy + 4 * s)}" r="${r1(2.2 * s)}" fill="${ink}"/>`;
		}
	}
	// The front panel: the question lamps, or four meters.
	const p = geo.panel;
	o += `<rect x="${r1(p.x)}" y="${r1(p.y)}" width="${r1(p.w)}" height="${r1(p.h)}" rx="${r1(8 * s)}" fill="#fff" stroke="${frame}" stroke-width="${lw}"/>`;
	if (kind === 'lamps') {
		for (let i = 0; i < 14; i++) {
			const c = i % 7, row = Math.floor(i / 7);
			const lx = p.x + (c + 0.5) * (p.w / 7), ly = p.y + (row + 0.5) * (p.h / 2);
			const lit = i < lamps && !muted;
			o += `<circle cx="${r1(lx)}" cy="${r1(ly)}" r="${r1(12 * s)}" fill="${lit ? 'var(--purple)' : '#fff'}" stroke="${frame}" stroke-width="${r1(lw * 0.6)}"/>`;
			if (lit) {
				o += `<circle cx="${r1(lx - 4 * s)}" cy="${r1(ly - 4 * s)}" r="${r1(3.2 * s)}" fill="#fff" opacity=".7"/>`;
			}
		}
	} else {
		for (let i = 0; i < 4; i++) {
			const dx = p.x + (i + 0.5) * (p.w / 4), dy = p.y + p.h * 0.68, R = Math.min(p.w / 9.5, p.h * 0.42);
			const a = Math.PI * (1.15 + 0.22 * i);
			o += `<path d="M ${r1(dx - R)} ${r1(dy)} A ${r1(R)} ${r1(R)} 0 0 1 ${r1(dx + R)} ${r1(dy)} Z" fill="${mix('neutral', 8)}" stroke="${frame}" stroke-width="${r1(lw * 0.7)}"/>`;
			o += `<path d="M ${r1(dx)} ${r1(dy)} L ${r1(dx + Math.cos(a) * R * 0.86)} ${r1(dy + Math.sin(a) * R * 0.86)}" stroke="${ink}" stroke-width="${r1(lw * 0.8)}" stroke-linecap="round"/><circle cx="${r1(dx)}" cy="${r1(dy)}" r="${r1(4 * s)}" fill="${ink}"/>`;
		}
	}
	// Two patch cords from the jack field down to the shelf.
	if (!muted) {
		for (const [c, r] of [[1, 2], [6, 1]]) {
			const jx = x + 24 * s + (c + 0.5) * jw, jy = panelTop + 26 * s + r * 30 * s;
			o += `<path d="M ${r1(jx)} ${r1(jy)} C ${r1(jx + (c < 4 ? -30 : 30) * s)} ${r1(jy + 60 * s)} ${r1(jx + (c < 4 ? -40 : 40) * s)} ${r1(p.y - 4 * s)} ${r1(jx + (c < 4 ? -46 : 46) * s)} ${r1(p.y - 2 * s)}" fill="none" stroke="var(--${tone})" stroke-width="${r1(4 * s)}" stroke-linecap="round" opacity="0"/>`;
		}
	}
	// The name header on top.
	o += `<rect x="${r1(geo.head.x)}" y="${r1(headTop)}" width="${r1(geo.head.w)}" height="${r1(geo.headH)}" rx="${r1(10 * s)}" fill="#fff" stroke="${frame}" stroke-width="${lw}"/>`;
	// The operator's headset on a hook on the side.
	if (headset && kind === 'lamps') {
		const hx = x + w + 4 * s, hy = panelTop + 40 * s;
		o += `<path d="M ${r1(hx)} ${r1(hy)} h ${r1(26 * s)} v ${r1(32 * s)}" fill="none" stroke="${ink}" stroke-width="${r1(4 * s)}" stroke-linecap="round"/>`;
		o += `<path d="M ${r1(hx + 2 * s)} ${r1(hy + 64 * s)} A ${r1(24 * s)} ${r1(30 * s)} 0 0 1 ${r1(hx + 50 * s)} ${r1(hy + 64 * s)}" fill="none" stroke="${frame}" stroke-width="${r1(6 * s)}" stroke-linecap="round"/>`;
		o += `<rect x="${r1(hx - 6 * s)}" y="${r1(hy + 56 * s)}" width="${r1(16 * s)}" height="${r1(26 * s)}" rx="${r1(6 * s)}" fill="${frame}"/><rect x="${r1(hx + 42 * s)}" y="${r1(hy + 56 * s)}" width="${r1(16 * s)}" height="${r1(26 * s)}" rx="${r1(6 * s)}" fill="${frame}"/>`;
		o += `<path d="M ${r1(hx + 50 * s)} ${r1(hy + 78 * s)} q ${r1(-4 * s)} ${r1(26 * s)} ${r1(-28 * s)} ${r1(28 * s)}" fill="none" stroke="${ink}" stroke-width="${r1(3 * s)}" stroke-linecap="round"/><circle cx="${r1(hx + 20 * s)}" cy="${r1(hy + 106 * s)}" r="${r1(5 * s)}" fill="${ink}"/>`;
	}
	if (floor) {
		o += `<path d="M ${r1(x - 40 * s)} ${r1(g)} H ${r1(x + w + 40 * s)}" stroke="var(--faint)" stroke-width="${r1(3 * s)}" stroke-linecap="round"/>`;
	}
	return o;
}

/** A lever key on the key shelf: a collar on the shelf at (x, base), a rod up, a round grip. lean: -1, 0 or 1 (back,
 * centre, thrown). tone colours the grip; muted keys are grey. */
function leverKey(x, base, len, { tone = 'purple', lean = 0, muted = false } = {}) {
	const tx = x + lean * len * 0.28, ty = base - len;
	const c = muted ? 'var(--neutral)' : `var(--${tone})`;
	return `<rect x="${r1(x - 14)}" y="${r1(base - 10)}" width="28" height="14" rx="4" fill="#3a3a40"/>`
		+ `<path d="M ${r1(x)} ${r1(base - 6)} L ${r1(tx)} ${r1(ty)}" stroke="${muted ? '#9a9da4' : 'var(--ink)'}" stroke-width="8" stroke-linecap="round"/>`
		+ `<circle cx="${r1(tx)}" cy="${r1(ty)}" r="15" fill="${muted ? '#fff' : c}" stroke="${muted ? c : 'var(--ink)'}" stroke-width="3.5"/>`
		+ `<circle cx="${r1(tx - 4.5)}" cy="${r1(ty - 4.5)}" r="4" fill="#fff" opacity="${muted ? 0 : 0.7}"/>`;
}

/** A rotary knob at (cx, cy) on a round plate, its pointer at angle a (degrees, 0 = right, -90 = up). */
function knob(cx, cy, r, a, { tone = 'orange' } = {}) {
	const rad = a * Math.PI / 180;
	return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${mix(tone, 14)}" stroke="var(--${tone})" stroke-width="${SW}"/>`
		+ `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.55)}" fill="#fff" stroke="var(--ink)" stroke-width="3.5"/>`
		+ `<path d="M ${r1(cx)} ${r1(cy)} L ${r1(cx + Math.cos(rad) * r * 0.9)} ${r1(cy + Math.sin(rad) * r * 0.9)}" stroke="var(--ink)" stroke-width="${r1(Math.max(4, r * 0.14))}" stroke-linecap="round"/>`;
}

/** A jack strip, seen from the front: a rail of sockets from x0 to x1 at height y, n holes. */
function jackStrip(x0, x1, y, n) {
	let o = `<rect x="${r1(x0)}" y="${r1(y - 15)}" width="${r1(x1 - x0)}" height="30" rx="8" fill="#f4f5f7" stroke="var(--line-strong)" stroke-width="2"/>`;
	const pitch = (x1 - x0 - 20) / n;
	for (let i = 0; i < n; i++) {
		o += `<circle cx="${r1(x0 + 10 + (i + 0.5) * pitch)}" cy="${r1(y)}" r="4" fill="#c9ccd3"/>`;
	}
	return o;
}

/** A gauge glass on a plinth: a tube filled to v (0..100) of its height h, standing at (cx, y). */
function gauge(cx, y, h, v, { tone = 'purple', light = false, w = 64 } = {}) {
	const top = y - h, lvl = y - (h * v) / 100;
	let g = `<rect x="${r1(cx - w / 2 - 14)}" y="${r1(y)}" width="${r1(w + 28)}" height="16" rx="5" fill="var(--ink)"/>`;
	g += `<rect x="${r1(cx - w / 2)}" y="${r1(top)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(w / 2)}" fill="#fff"/>`;
	g += `<clipPath id="gsb-g-${r1(cx)}-${r1(y)}"><rect x="${r1(cx - w / 2)}" y="${r1(top)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(w / 2)}"/></clipPath>`;
	g += `<rect x="${r1(cx - w / 2)}" y="${r1(lvl)}" width="${r1(w)}" height="${r1(y - lvl)}" fill="${light ? mix(tone, 38) : `var(--${tone})`}" clip-path="url(#gsb-g-${r1(cx)}-${r1(y)})"/>`;
	g += `<path d="M ${r1(cx - w / 2)} ${r1(lvl)} H ${r1(cx + w / 2)}" stroke="var(--${tone})" stroke-width="3"/>`;
	g += `<rect x="${r1(cx - w / 2)}" y="${r1(top)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(w / 2)}" fill="none" stroke="var(--ink)" stroke-width="${SW}"/>`;
	g += `<path d="M ${r1(cx - w / 2 + 12)} ${r1(top + w / 2)} V ${r1(y - 16)}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
	return g;
}

// ---------- shared CSS ----------

/** CSS every gsb- design shares, scoped to the design n. */
const shared = n => `
.${n} { position: relative; }
.${n} .${n}-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-sign { position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 14px; padding: 0 18px; background: #fff; border: 3px solid var(--ink); border-radius: 12px; }
.${n} .${n}-sign.hi { border-color: var(--purple); box-shadow: 0 0 0 4px var(--purple-tint); }
.${n} .${n}-sign.dim { border-color: var(--faint); }
.${n} .${n}-sign.dim .${n}-sign-t, .${n} .${n}-sign.dim .${n}-sign-s { color: var(--muted); }
.${n} .${n}-sign-t { font-size: 25px; font-weight: 600; color: var(--ink); line-height: 1.12; white-space: nowrap; }
.${n} .${n}-sign-s { font-size: 19px; color: var(--body); line-height: 1.2; white-space: nowrap; }
.${n} .${n}-boxname { position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 10px; background: #fff; border: 3px solid var(--purple); border-radius: 10px; font-weight: 600; color: var(--purple); white-space: nowrap; }
.${n} .${n}-boxname.meters { border-color: var(--neutral); color: var(--neutral); }
.${n} .${n}-boxname.mute { border-color: var(--faint); color: var(--muted); }
.${n} .${n}-kicker { position: absolute; color: var(--body); }
.${n} .${n}-hide { visibility: hidden; }
`;

/** A line card: the brand mark, the name and a second line. */
const sign = (n, x, y, w, h, p, { hi = false, dim = false, key = null, hidden = false } = {}) => `<div class="${n}-sign${hi ? ' hi' : ''}${dim ? ' dim' : ''}${hidden ? ` ${n}-hide` : ''}" style="${at(x, y, w, h)}"${key ? ` data-key="${key}"` : ''} data-fit>${p.logo ? logo(p.logo, Math.round(Math.min(40, h * 0.46)), dim ? '#b9bcc4' : null) : ''}<div><div class="${n}-sign-t nolint" data-t>${fmt(p.name ?? '')}</div>${p.sub ? `<div class="${n}-sign-s nolint" data-t>${fmt(p.sub)}</div>` : ''}</div></div>`;

/** The name on a switchboard's header. */
const swbName = (n, geo, b = {}, { kind = 'lamps', size = 22, mute = false, hidden = false } = {}) => {
	const h = geo.head;
	return `<div class="${n}-boxname${kind === 'meters' ? ' meters' : ''}${mute ? ' mute' : ''}${hidden ? ` ${n}-hide` : ''}" style="${at(h.x + 6, h.y + 5, h.w - 12, h.h - 10)};font-size:${size}px" data-fit>${b.logo ? logo(b.logo, Math.round(size * 1.1), mute ? '#b9bcc4' : null) : ''}<span class="nolint" data-t>${fmt(b.name ?? '')}</span></div>`;
};

/** Lines: a card per line (sign) with a jack on its left; the cable from (x0, y0) fans out to each jack, the
 * picked one patched in purple with its plug. Returns { svg, html }. */
function lineCards(n, plats, { x0, y0, xc, ys, w = 224, h = 70, pick = null, s = 1, show = true, hidden = false } = {}) {
	let svg = '', html = '';
	const xj = xc - 18 * s, xm = (x0 + xj) / 2;
	const path = (y, end = 30) => `M ${r1(x0)} ${r1(y0)} C ${r1(xm)} ${r1(y0)} ${r1(xm)} ${r1(y)} ${r1(xj - end * s)} ${r1(y)}`;
	if (show) {
		svg += cables(ys.map(y => path(y, 44)), { s });
		if (pick != null && ys[pick] != null) {
			svg += cables(path(ys[pick]), { s, tone: 'purple' }) + plug(xj - 6 * s, ys[pick], s);
		}
		ys.forEach((y, i) => {
			if (i !== pick) {
				svg += plug(xj - 14 * s, y, s, 'neutral');
			}
			svg += jack(xj, y, s, { lit: i === pick });
		});
	}
	plats.forEach((p, i) => { html += sign(n, xc, ys[i] - h / 2, w, h, p, { hi: i === pick && show, hidden, key: `line-${i}` }); });
	return { svg, html };
}

/** The cover's left column: eyebrow, title, sub, speaker, pills (the built-in title's classes). */
const coverLeft = (s, width = 800) => {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar nolint" data-t>${esc(s.speaker.initials)}</span><span class="tf-name nolint" data-t>${fmt(s.speaker.name)}</span><span class="tf-role nolint" data-t>${fmt(s.speaker.role)}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left" style="width:${width}px"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
};

const svgLayer = (n, w, h, inner) => `<svg class="${n}-svg" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;

export const designs = {
	/** The cover. Left: eyebrow, title, sub, speaker, pills. Right, by look: 'board' (a call rings in, the purple
	 * switchboard patches it to one of six lines), 'boards' (today's grey exchange and the new switchboard side by side,
	 * a caption under each), 'close' (the switchboard up close, its question lamps labelled), 'fork' (one call, two lines).
	 * Fields: box: { name, logo }, old: { name, caption, tag }, caption, tag, boardLabel, pick (the patched line),
	 * lines (2–6, top to bottom): [{ name, sub, logo }]. */
	'gsb-cover': {
		bare: true,
		css: `${shared('gsb-cover')}
.gsb-cover { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.gsb-cover .gsb-cover-cap { position: absolute; text-align: center; font-size: 26px; font-weight: 600; white-space: nowrap; }
.gsb-cover .gsb-cover-tag { position: absolute; transform: translateX(-50%); }
.gsb-cover .gsb-cover-board { position: absolute; font-size: 24px; font-weight: 600; color: var(--purple); white-space: nowrap; text-align: right; }
`,
		render(s) {
			const n = 'gsb-cover', look = s.look ?? 'board';
			const plats = s.lines ?? [];
			let g = '', html = '';
			const sag = (a, b, d = 40) => `M ${r1(a[0])} ${r1(a[1])} C ${r1(a[0] + 30)} ${r1(a[1] + d)} ${r1(b[0] - 30)} ${r1(b[1] + d)} ${r1(b[0])} ${r1(b[1])}`;
			if (look === 'board') {
				const fl = 800, geo = swbGeo(1076, fl, 0.92), ph = deskPhone(884, fl, 0.9);
				g += ph.svg + cables(sag(ph.out, geo.in, 46), { tone: 'blue', s: 0.9 }) + swb(geo);
				html += swbName(n, geo, s.box, { size: 20 });
				const ys = plats.map((_, i) => 330 + i * 98);
				const lc = lineCards(n, plats, { x0: geo.out[0] + 40, y0: geo.out[1], xc: 1600, ys, h: 68, pick: s.pick ?? 2 });
				g += cables(`M ${r1(geo.out[0])} ${r1(geo.out[1])} H ${r1(geo.out[0] + 42)}`);
				g += lc.svg;
				html += lc.html;
			} else if (look === 'boards') {
				const fl = 820, oldG = swbGeo(980, fl, 0.7), newG = swbGeo(1490, fl, 0.92), ph = deskPhone(1270, fl, 0.8);
				g += swb(oldG, { kind: 'meters' }) + swb(newG) + ph.svg;
				g += cables(`M ${r1(1270 + 30)} ${r1(ph.out[1])} C 1240 ${r1(ph.out[1] + 60)} ${r1(oldG.out[0] + 30)} ${r1(oldG.out[1] + 60)} ${r1(oldG.out[0])} ${r1(oldG.out[1])}`, { s: 0.85 });
				g += cables(`M ${r1(ph.out[0])} ${r1(ph.out[1])} C ${r1(ph.out[0] + 40)} ${r1(ph.out[1] + 50)} ${r1(newG.in[0] - 40)} ${r1(newG.in[1] + 50)} ${r1(newG.in[0])} ${r1(newG.in[1])}`, { s: 0.85, tone: 'purple' });
				html += swbName(n, oldG, s.old, { kind: 'meters', size: 18 }) + swbName(n, newG, s.box, { size: 21 });
				if (s.old?.tag) {
					html += `<div class="gsb-cover-tag" style="left:${r1(oldG.cx)}px;top:${r1(oldG.headTop - 56)}px">${pill({ ...s.old.tag, size: 's' })}</div>`;
				}
				if (s.tag) {
					html += `<div class="gsb-cover-tag" style="left:${r1(newG.cx)}px;top:${r1(newG.headTop - 56)}px">${pill({ ...s.tag, size: 's' })}</div>`;
				}
				html += t('gsb-cover-cap', `${at(oldG.cx - 150, fl + 26, 300)};color:var(--neutral)`, fmt(s.old?.caption ?? ''));
				html += t('gsb-cover-cap', `${at(newG.cx - 170, fl + 26, 340)};color:var(--purple)`, fmt(s.caption ?? ''));
			} else if (look === 'close') {
				const fl = 960, geo = swbGeo(1216, fl, 1.48), ph = deskPhone(950, fl, 0.9, { floor: false });
				g += `<path d="M 930 ${fl} H 1720" stroke="var(--faint)" stroke-width="4" stroke-linecap="round"/>`;
				g += ph.svg + cables(sag(ph.out, geo.in, 50), { tone: 'blue', s: 1.1 }) + swb(geo, { floor: false });
				html += swbName(n, geo, s.box, { size: 30 });
				if (s.boardLabel) {
					const p = geo.panel, ly = p.y + p.h / 2;
					g += `<path d="M ${r1(p.x - 4)} ${r1(ly)} H ${r1(p.x - 90)}" stroke="var(--purple)" stroke-width="4" stroke-linecap="round"/><circle cx="${r1(p.x - 4)}" cy="${r1(ly)}" r="6" fill="var(--purple)"/>`;
					html += t('gsb-cover-board nolint', at(p.x - 390, ly - 17, 290), fmt(s.boardLabel));
				}
			} else {
				// 'fork': one call, the switchboard, two lines.
				const fl = 760, geo = swbGeo(1110, fl, 0.78), ph = deskPhone(940, fl, 0.8);
				g += ph.svg + cables(sag(ph.out, geo.in, 30), { tone: 'blue', s: 0.85 }) + swb(geo);
				html += swbName(n, geo, s.box, { size: 18 });
				const two = [plats[0] ?? {}, plats[plats.length - 1] ?? {}];
				const lc = lineCards(n, two, { x0: geo.out[0] + 60, y0: geo.out[1], xc: 1576, ys: [400, 880], w: 248, h: 80, pick: 0 });
				g += cables(`M ${r1(geo.out[0])} ${r1(geo.out[1])} H ${r1(geo.out[0] + 62)}`);
				g += lc.svg;
				html += lc.html;
			}
			return `<div class="${n}">${svgLayer(n, 1920, 1080, g)}${coverLeft(s, 800)}${html}${msLogo()}</div>`;
		},
	},
	/** Today: a call comes into the grey exchange with four meters (the scores, listed beside it), then cable
	 * bundles sized by share run to three line cards, each with its share big. Fields: eyebrow, title, kicker, box: { name },
	 * scores: [4 names], scoresLabel, rules (one line), outs (top to bottom): [{ name, logo, sub, share (0–100, the band),
	 * big, label }]. */
	'gsb-today': {
		css: `${shared('gsb-today')}
.gsb-today .gsb-today-sl { position: absolute; font-size: 24px; font-weight: 600; color: var(--neutral); white-space: nowrap; }
.gsb-today .gsb-today-score { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 24px; color: var(--ink); white-space: nowrap; }
.gsb-today .gsb-today-rules { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 23px; color: var(--body); line-height: 1.25; }
.gsb-today .gsb-today-big { position: absolute; font-size: 46px; font-weight: 700; letter-spacing: -.02em; color: var(--ink); white-space: nowrap; line-height: 1; }
.gsb-today .gsb-today-lab { position: absolute; font-size: 20px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const n = 'gsb-today', H = bodyHeight(s);
			const fl = 640, geo = swbGeo(196, fl, 1.04), ph = deskPhone(4, fl, 0.86, { floor: false });
			const yT = 520, x0 = 860, x1 = 1270, total = 180;
			let g = ph.svg + cables(`M ${r1(ph.out[0])} ${r1(ph.out[1])} C ${r1(ph.out[0] + 30)} ${r1(ph.out[1] + 40)} ${r1(geo.in[0] - 30)} ${r1(geo.in[1] + 40)} ${r1(geo.in[0])} ${r1(geo.in[1])}`, { tone: 'blue', s: 0.9 });
			g += `<path d="M 0 ${fl} H 1000" stroke="var(--faint)" stroke-width="3" stroke-linecap="round"/>`;
			g += swb(geo, { kind: 'meters', floor: false });
			g += cables(`M ${r1(geo.out[0])} ${r1(geo.out[1])} C ${r1(geo.out[0] + 150)} ${r1(geo.out[1])} ${r1(x0 - 150)} ${yT} ${x0} ${yT}`, { s: 1.2 });
			g += `<rect x="${x0 - 10}" y="${yT - total / 2 - 8}" width="16" height="${total + 16}" rx="5" fill="var(--neutral)"/>`;
			g += `<path d="M ${x0 - 2} ${yT + total / 2 + 8} V ${fl}" stroke="var(--neutral)" stroke-width="8"/>`;
			let html = swbName(n, geo, s.box, { kind: 'meters', size: 24 });
			// The four scores, listed beside the box, each with a dial like the ones on its panel.
			const sx = geo.x + geo.w + 60, sy = 110;
			html += t(`${n}-sl`, at(sx, sy - 52), fmt(s.scoresLabel ?? ''));
			(s.scores ?? []).forEach((name, i) => {
				const dial = `<svg width="34" height="22" viewBox="0 0 34 22"><path d="M 3 19 A 14 14 0 0 1 31 19" fill="${mix('neutral', 8)}" stroke="var(--neutral)" stroke-width="3"/><path d="M 17 19 L ${r1(17 + Math.cos(Math.PI * (1.2 + 0.2 * i)) * 11)} ${r1(19 + Math.sin(Math.PI * (1.2 + 0.2 * i)) * 11)}" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/></svg>`;
				html += `<div class="${n}-score" style="${at(sx, sy + i * 50)}">${dial}<span class="nolint" data-t>${fmt(name)}</span></div>`;
			});
			// Bundles sized by share, from the cable clamp to the line cards.
			const outs = s.outs ?? [];
			const sum = outs.reduce((a, o) => a + o.share, 0) || 1;
			const yEnd = outs.length === 3 ? [96, 300, 530] : outs.map((_, i) => 100 + i * 180);
			let a = yT - total / 2;
			outs.forEach((o, i) => {
				const th = Math.max(4, (total * o.share) / sum);
				const b0 = a, b1 = a + th, e0 = yEnd[i] - th / 2, e1 = yEnd[i] + th / 2;
				g += band(x0, b0, b1, x1, e0, e1, mix('neutral', i === outs.length - 1 ? 30 : 22));
				a = b1;
				html += sign(n, x1, yEnd[i] - 36, 238, 72, o);
				html += t(`${n}-lab`, at(x1 + 262, yEnd[i] - 46), fmt(o.label ?? ''));
				html += t(`${n}-big nolint`, at(x1 + 262, yEnd[i] - 18), fmt(o.big ?? `${o.share}%`));
			});
			if (s.rules) {
				html += `<div class="${n}-rules" style="${at(sx, sy + 4 * 50 + 14, 330)}">${ic('bookOpen', 30, 'var(--neutral)')}<span data-t>${fmt(s.rules)}</span></div>`;
			}
			if (s.kicker) {
				html += t(`lbl ${n}-kicker`, at(x1, 18), fmt(s.kicker));
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** Of 100 hard calls, where each went: two lamp fields per panel, jack strips for the able line (lamps lit green)
	 * and for the cheap line (lit red, the ones that slipped). One panel per click; earlier panels stay
	 * bright. Fields: eyebrow, title, kicker, panels (1–2): [{ name, caught (0–100), big, label, tone }],
	 * strong: { title, icon }, cheap: { title, icon }, note: { icon, text } (one calm line under the yards). */
	'gsb-yard': {
		clicks: true,
		css: `${shared('gsb-yard')}
.gsb-yard .gsb-yard-panel { position: absolute; }
.gsb-yard .gsb-yard-head { position: absolute; left: 0; display: flex; align-items: center; gap: 24px; }
.gsb-yard .gsb-yard-big { font-size: 112px; font-weight: 700; letter-spacing: -.045em; line-height: .9; color: var(--fg); white-space: nowrap; }
.gsb-yard .gsb-yard-name { font-size: 32px; font-weight: 600; color: var(--ink); line-height: 1.2; white-space: nowrap; }
.gsb-yard .gsb-yard-label { font-size: 26px; color: var(--fg); line-height: 1.25; white-space: nowrap; }
.gsb-yard .gsb-yard-yl { position: absolute; display: flex; align-items: center; gap: 10px; color: var(--fg); font-size: 22px; font-weight: 600; white-space: nowrap; }
.gsb-yard .gsb-yard-rule { position: absolute; width: 2px; background: var(--line); }
.gsb-yard .gsb-yard-note { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 23px; color: var(--body); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			const n = 'gsb-yard', H = bodyHeight(s);
			const panels = (s.panels ?? []).slice(0, 2), gap = 110, pw = (W - gap) / 2;
			const cols = 25, pitch = (pw - 26) / cols, rowH = 38;
			const top = s.kicker ? 46 : 0;
			const yHead = top, yS = top + 150, yC = yS + 4 * rowH + 84;
			let html = s.kicker ? t(`lbl ${n}-kicker`, at(0, 0), fmt(s.kicker)) : '';
			// A lamp on the strip: lit in its tone (a call on that line), with a highlight.
			const lamp = (x, y, tone) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(pitch * 0.36)}" fill="var(--${tone})" stroke="var(--ink)" stroke-width="2"/><circle cx="${r1(x - pitch * 0.11)}" cy="${r1(y - pitch * 0.11)}" r="${r1(pitch * 0.09)}" fill="#fff" opacity=".7"/>`;
			panels.forEach((p, k) => {
				const caught = Math.round(p.caught), missed = 100 - caught;
				let g = '';
				const yard = (y0, count, tone) => {
					// Four jack strips, a lamp per call on that line, holes left dark.
					for (let r = 0; r < 4; r++) {
						const y = y0 + 12 + (r + 1) * rowH;
						g += `<rect x="0" y="${r1(y - 16)}" width="${r1(pw)}" height="32" rx="9" fill="#f4f5f7" stroke="var(--line-strong)" stroke-width="2"/>`;
						for (let c = 0; c < cols; c++) {
							const i = r * cols + c, cx = 13 + (c + 0.5) * pitch;
							g += i < count ? lamp(cx, y, tone) : `<circle cx="${r1(cx)}" cy="${r1(y)}" r="5" fill="#c9ccd3"/>`;
						}
					}
				};
				yard(yS, caught, 'green');
				yard(yC, missed, 'red');
				const tag = (o, tone, y) => o ? `<div class="${n}-yl t-${tone}" style="${at(0, y)}">${ic(o.icon ?? 'routing', 26)}<span class="nolint" data-t>${fmt(o.title ?? '')}</span></div>` : '';
				const head = `<div class="${n}-head" style="top:${yHead}px">${t(`${n}-big t-${p.tone ?? 'red'} nolint`, '', esc(p.big ?? String(missed)))}<div>${t(`${n}-name nolint`, '', fmt(p.name ?? ''))}${p.label ? t(`${n}-label t-${p.tone ?? 'red'}`, '', fmt(p.label)) : ''}</div></div>`;
				const rule = k ? `<div class="${n}-rule" style="left:${-gap / 2}px;top:${yHead}px;height:${r1(yC + 4 * rowH + 30 - yHead)}px"></div>` : '';
				const later = ctx.step && k >= ctx.step ? `;visibility:hidden` : '';
				html += `<div class="${n}-panel" data-key="panel-${k}" style="${at(k * (pw + gap), 0, pw, H)}${later}">${rule}${svgLayer(n, pw, H, g)}${head}${tag(s.strong, 'green', yS - 4)}${tag(s.cheap, 'red', yC - 4)}</div>`;
			});
			if (s.note?.text) {
				const shown = !ctx.step || ctx.step >= panels.length;
				html += `<div class="${n}-note" style="${at(0, yC + 4 * rowH + 56)}${shown ? '' : ';visibility:hidden'}" data-key="note">${ic(s.note.icon ?? 'info', 28, 'var(--muted)')}<span data-t>${fmt(s.note.text)}</span></div>`;
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${html}</div>`, { vcenter: false });
		},
	},
	/** How it works: ask, guess, patch. Fields: eyebrow, title, steps (3): [{ title, sub }], box: { name, logo },
	 * readout (the label of the answers), cols: [chance, cost] (the board's column heads), options (top to bottom):
	 * [{ name, sub, logo, bar: [chance 0–1, cost 0–1] }] (a sketch, not data), pick (index of the lit option),
	 * budget (the lever's label). look: 'line' (switchboard, board, jack field; built in 3 clicks), 'cabin' (at the desk),
	 * 'board' (one departures board). sketch: a small label on the board when its bars are illustrative. */
	'gsb-how': {
		clicks: true,
		css: `${shared('gsb-how')}
.gsb-how .gsb-how-h { position: absolute; display: flex; align-items: flex-start; gap: 16px; }
.gsb-how .gsb-how-n { flex: none; width: 50px; height: 50px; border-radius: 50%; background: var(--blue); color: #fff; display: grid; place-items: center; font-size: 26px; font-weight: 700; }
.gsb-how .gsb-how-t { font-size: 34px; font-weight: 700; color: var(--ink); line-height: 1.05; white-space: nowrap; }
.gsb-how .gsb-how-s { margin-top: 6px; font-size: 23px; color: var(--body); white-space: nowrap; }
.gsb-how .gsb-how-lab { position: absolute; font-size: 22px; font-weight: 600; white-space: nowrap; text-align: center; }
.gsb-how .gsb-how-row { position: absolute; display: flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gsb-how .gsb-how-row .gsb-how-rs { font-weight: 400; color: var(--body); font-size: 18px; }
.gsb-how .gsb-how-sketch { position: absolute; }
.gsb-how .gsb-how-col { position: absolute; font-size: 17px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			const n = 'gsb-how', H = bodyHeight(s), look = s.look ?? 'line';
			const step = ctx.step ?? Infinity;
			const opts = s.options ?? [], steps = s.steps ?? [];
			let g = '', html = '';
			const hide = k => (step < k ? ` ${n}-hide` : '');
			const header = (k, x, y, w) => {
				const st = steps[k - 1] ?? {};
				return `<div class="${n}-h${hide(k)}" style="${at(x, y, w)}" data-key="h${k}"><span class="${n}-n nolint" data-t>${k}</span><div><div class="${n}-t nolint" data-t>${fmt(st.title ?? '')}</div>${st.sub ? `<div class="${n}-s" data-t>${fmt(st.sub)}</div>` : ''}</div></div>`;
			};
			// The prediction board: a framed board, two column heads, one row per option with a chance bar and a cost bar.
			const board = (x, y, w, k, { posts = 0, frame = true } = {}) => {
				const rowH = 46, headH = 44, h = headH + opts.length * rowH + 22;
				const xc = x + w - 210, xk = x + w - 84, cw = 110, kw = 64;
				let sv = '';
				if (posts) {
					sv += [x + 50, x + w - 50].map(px => `<path d="M ${r1(px)} ${r1(y + h)} V ${r1(posts)}" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>`).join('');
				}
				if (frame) {
					sv += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="16" fill="#fff" stroke="var(--ink)" stroke-width="${SB}"/>`;
				}
				let hh = t(`${n}-col nolint`, at(xc, y + 14), fmt(s.cols?.[0] ?? '')) + t(`${n}-col nolint`, at(xk, y + 14), fmt(s.cols?.[1] ?? ''));
				if (s.sketch) {
					hh += t(`lbl ${n}-sketch`, `${at(x + 18, y + 16)};color:var(--orange)`, fmt(s.sketch));
				}
				opts.forEach((o, i) => {
					const ry = y + headH + i * rowH + rowH / 2, lit = i === s.pick && step >= 3;
					if (lit) {
						sv += `<rect x="${r1(x + 10)}" y="${r1(ry - rowH / 2 + 3)}" width="${r1(w - 20)}" height="${rowH - 6}" rx="8" fill="${mix('purple', 12)}"/>`;
					}
					sv += `<rect x="${r1(xc)}" y="${r1(ry - 9)}" width="${r1(cw)}" height="18" rx="5" fill="${mix('purple', 12)}"/><rect x="${r1(xc)}" y="${r1(ry - 9)}" width="${r1(cw * (o.bar?.[0] ?? 0.5))}" height="18" rx="5" fill="var(--purple)"/>`;
					sv += `<rect x="${r1(xk)}" y="${r1(ry - 9)}" width="${r1(kw * (o.bar?.[1] ?? 0.5))}" height="18" rx="5" fill="var(--orange)" opacity=".85"/>`;
					hh += `<div class="${n}-row" style="${at(x + 18, ry - 15)}">${o.logo ? logo(o.logo, 24) : ''}<span class="nolint" data-t>${fmt(o.name)}${o.sub ? ` <span class="${n}-rs">${fmt(o.sub)}</span>` : ''}</span></div>`;
				});
				return { svg: sv, html: `<div class="${hide(k).trim()}" data-key="board">${hh}</div>`, h };
			};
			// The 25 answers as bars on a small board.
			const readout = (x, y, w, h, posts = 0) => {
				let sv = posts ? [x + 24, x + w - 24].map(px => `<path d="M ${r1(px)} ${r1(y + h)} V ${r1(posts)}" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>`).join('') : '';
				sv += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="12" fill="#fff" stroke="var(--purple)" stroke-width="${SW}"/>`;
				const bw = (w - 24) / 25;
				for (let i = 0; i < 25; i++) {
					const v = 0.2 + 0.75 * Math.abs(wob(i, 5));
					sv += `<rect x="${r1(x + 12 + i * bw + 1)}" y="${r1(y + h - 12 - (h - 24) * v)}" width="${r1(bw - 2)}" height="${r1((h - 24) * v)}" rx="1.5" fill="var(--purple)"/>`;
				}
				return sv;
			};
			if (look === 'line') {
				const fl = 640, yT = 634, geo = swbGeo(20, fl, 0.86), xF = 1160;
				const ys = opts.map((_, i) => 160 + i * ((600 - 160) / Math.max(1, opts.length - 1)));
				g += `<path d="M 0 ${fl} H ${W}" stroke="var(--faint)" stroke-width="3" stroke-linecap="round"/>`;
				g += swb(geo, { floor: false });
				html += swbName(n, geo, s.box, { size: 18 });
				// The trunk: from the switchboard down to the floor and along it to the jack field.
				g += cables(`M ${r1(geo.out[0])} ${r1(geo.out[1])} C ${r1(geo.out[0] + 50)} ${r1(geo.out[1])} ${r1(geo.out[0] + 20)} ${yT} ${r1(geo.out[0] + 90)} ${yT} H ${xF}`, { s: 1.1 });
				// Ask: the readout of 25 numbers on a stand.
				g += readout(410, 380, 172, 92, fl);
				html += t(`${n}-lab nolint`, `${at(410, 338, 172)};color:var(--purple)`, fmt(s.readout ?? ''));
				// Predict: the board on its stand, a knob on its right leg.
				if (step >= 2) {
					g += board(636, 150, 486, 2, { posts: fl }).svg;
				}
				html += board(636, 150, 486, 2).html;
				if (step >= 3) {
					g += `<path d="M 1076 540 H 1094" stroke="var(--ink)" stroke-width="5"/>` + knob(1124, 540, 30, -30);
				}
				html += t(`${n}-lab${hide(3)}`, `${at(1100, 580, 140)};color:var(--orange);text-align:left`, fmt(s.budget ?? ''));
				// Pick: the jack field, one line per option, the picked one patched.
				const lc = lineCards(n, opts, { x0: xF, y0: yT, xc: 1440, ys, w: W - 1440, h: 60, pick: step >= 3 ? s.pick : null, s: 0.9, show: step >= 3, hidden: step < 3 });
				g += lc.svg;
				html += lc.html;
				if (step <= 2) {
					g += bead(step <= 1 ? 340 : 880, yT, 1);
				} else if (s.pick != null) {
					g += bead(1440 - 16 * 0.9 - 66, ys[s.pick], 0.8);
				}
				html += header(1, 0, 0, 440) + header(2, 636, 0, 480) + header(3, 1160, 0, 440);
			} else if (look === 'cabin') {
				const floor = 560;
				// The switchboard's jack field across the top: rows of jacks, a lamp over each.
				g += `<rect x="0" y="0" width="${W}" height="150" rx="10" fill="${mix('purple', 10)}" stroke="var(--purple)" stroke-width="${SW}"/>`;
				for (let r = 0; r < 3; r++) {
					for (let c = 0; c < 36; c++) {
						const jx = 30 + c * ((W - 60) / 35), jy = 34 + r * 42, on = (r * 36 + c) % 11 === 4;
						g += `<circle cx="${r1(jx)}" cy="${jy - 11}" r="4.5" fill="${on ? 'var(--yellow)' : '#fff'}" stroke="var(--ink)" stroke-width="1.8"/><circle cx="${r1(jx)}" cy="${jy + 5}" r="7" fill="#fff" stroke="var(--ink)" stroke-width="2"/><circle cx="${r1(jx)}" cy="${jy + 5}" r="2.8" fill="var(--ink)"/>`;
					}
				}
				g += `<rect x="0" y="150" width="${W}" height="12" rx="4" fill="var(--purple)"/>`;
				g += `<path d="M 0 ${floor} H ${W}" stroke="var(--ink)" stroke-width="${SB}"/>`;
				for (let x = 40; x < W; x += 120) {
					g += `<path d="M ${x} ${floor + 3} l -26 40" stroke="var(--line-strong)" stroke-width="3"/>`;
				}
				// 1 Ask: the question board on the wall, 14 lamps, and its readout.
				g += `<rect x="20" y="200" width="420" height="140" rx="16" fill="#fff" stroke="var(--purple)" stroke-width="${SW}"/>`;
				for (let i = 0; i < 14; i++) {
					const c = i % 7, row = Math.floor(i / 7);
					g += `<circle cx="${r1(20 + (c + 0.5) * 60)}" cy="${r1(235 + row * 70)}" r="20" fill="var(--purple)" stroke="var(--ink)" stroke-width="3"/><circle cx="${r1(14 + (c + 0.5) * 60)}" cy="${r1(229 + row * 70)}" r="5" fill="#fff" opacity=".7"/>`;
				}
				g += `<path d="M 230 340 V 372" stroke="var(--purple)" stroke-width="4"/>`;
				g += readout(135, 372, 190, 92, floor);
				html += t(`${n}-lab nolint`, `${at(20, 474, 420)};color:var(--purple)`, fmt(s.readout ?? ''));
				// 2 Predict: the board on its stand.
				const b = board(570, 190, 490, 0, { posts: floor });
				g += b.svg;
				html += b.html;
				// 3 Pick: the key shelf with one lever key per option, the picked one thrown (purple), a plate under each.
				const lx0 = 1150, lw = (W - lx0 - 10) / Math.max(1, opts.length);
				g += `<path d="M ${lx0 - 8} ${floor} L ${lx0} ${floor - 34} H ${W - 8} L ${W} ${floor} Z" fill="var(--ink)"/>`;
				opts.forEach((o, i) => {
					const cx = lx0 + (i + 0.5) * lw, pulled = i === s.pick;
					g += leverKey(cx, floor - 28, 150, { tone: 'purple', lean: pulled ? 1 : 0, muted: !pulled });
					html += `<div class="${n}-sign${pulled ? ' hi' : ''}" style="${at(cx - lw / 2 + 6, floor - 104, lw - 12, 60)};justify-content:center;padding:0">${o.logo ? logo(o.logo, 30) : ''}</div>`;
				});
				// The setting: a knob on a plate mounted under the jack field.
				const dx = lx0 + 70, dy = 236;
				g += `<path d="M ${dx} 162 V ${dy - 40}" stroke="var(--ink)" stroke-width="5"/>` + knob(dx, dy, 40, -30);
				html += `<div class="${n}-lab" style="${at(dx + 56, dy - 16, 160)};color:var(--orange);text-align:left" data-t>${fmt(s.budget ?? '')}</div>`;
				html += header(1, 20, floor + 46, 440) + header(2, 580, floor + 46, 440) + header(3, lx0, floor + 46, 560);
			} else {
				// 'board': one departures board hung from the roof, three columns.
				const x = 0, y = 40, w = W, h = 480;
				g += `<rect x="0" y="0" width="${W}" height="10" rx="3" fill="var(--neutral)"/>`;
				g += [260, W - 260].map(px => `<path d="M ${px} 4 V ${y}" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>`).join('');
				g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff" stroke="var(--ink)" stroke-width="${SB}"/>`;
				g += `<path d="M 470 ${y + 30} V ${y + h - 30} M 1050 ${y + 30} V ${y + h - 30}" stroke="var(--line)" stroke-width="3"/>`;
				g += readout(70, y + 200, 330, 150);
				html += t(`${n}-lab nolint`, `${at(70, y + 370, 330)};color:var(--purple)`, fmt(s.readout ?? ''));
				const b = board(520, y + 120, 480, 0, { frame: false });
				g += b.svg;
				html += b.html;
				const py = y + 120 + 44 + (s.pick ?? 0) * 46 + 23;
				g += `<path d="M 1010 ${r1(py)} H 1130" stroke="var(--purple)" stroke-width="6" stroke-linecap="round"/><path d="M 1112 ${r1(py - 14)} L 1132 ${r1(py)} L 1112 ${r1(py + 14)}" stroke="var(--purple)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
				const o = opts[s.pick ?? 0] ?? {};
				html += sign(n, 1150, py - 40, 420, 80, o, { hi: true });
				g += knob(1190, py + 110, 30, -30);
				html += `<div class="${n}-lab" style="${at(1234, py + 94, 200)};color:var(--orange);text-align:left" data-t>${fmt(s.budget ?? '')}</div>`;
				html += header(1, 70, y + 36, 380) + header(2, 520, y + 36, 480) + header(3, 1150, y + 36, 500);
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** The lever frame inside the box: one lever per question on a cast-iron bed, a brass plate under each with its name,
	 * brackets that group the levers by what they return, and a ticket for the price of the call. Fields: eyebrow, title,
	 * kicker, box: { name, logo } (the panel's header), levers: [names], groups: [{ from, to (lever indexes), value, label }], ticket: { title, rows: [{ value, label }] }. */
	'gsb-levers': {
		css: `${shared('gsb-levers')}
.gsb-levers .gsb-levers-plate { position: absolute; box-sizing: border-box; display: grid; place-items: center; text-align: center; padding: 0 4px; background: #fff; border: 3px solid var(--purple); border-radius: 8px; font-size: 17px; font-weight: 600; line-height: 1.12; color: var(--ink); }
.gsb-levers .gsb-levers-g { position: absolute; display: flex; justify-content: center; align-items: baseline; gap: 12px; white-space: nowrap; }
.gsb-levers .gsb-levers-g b { font-size: 40px; font-weight: 700; color: var(--purple); line-height: 1; }
.gsb-levers .gsb-levers-g span { font-size: 23px; color: var(--body); }
.gsb-levers .gsb-levers-tk { position: absolute; box-sizing: border-box; padding: 20px 26px 0 52px; }
.gsb-levers .gsb-levers-tt { font-size: 24px; font-weight: 700; color: var(--ink); white-space: nowrap; display: flex; align-items: center; gap: 10px; }
.gsb-levers .gsb-levers-tr { margin-top: 10px; display: flex; align-items: baseline; gap: 12px; white-space: nowrap; }
.gsb-levers .gsb-levers-tr b { font-size: 30px; color: var(--orange); font-weight: 700; }
.gsb-levers .gsb-levers-tr span { font-size: 21px; color: var(--body); }
.gsb-levers .gsb-levers-kicker { font-size: 26px; font-weight: 600; color: var(--purple); }
`,
		render(s) {
			const n = 'gsb-levers', H = bodyHeight(s);
			const lv = s.levers ?? [], k = Math.max(1, lv.length), pitch = W / k;
			const bedY = 466, bedH = 34, len = 92, plateY = bedY + bedH + 14, plateH = 60;
			let g = '', html = '';
			// The switchboard's face behind the key shelf: rows of jacks, then one lamp per question, lit.
			const wy0 = s.ticket ? 214 : 60, wy1 = bedY - 10;
			g += `<rect x="0" y="${wy0}" width="${W}" height="${wy1 - wy0}" rx="10" fill="${mix('purple', 10)}" stroke="var(--purple)" stroke-width="${SW}"/>`;
			for (let r = 0; r < 2; r++) {
				for (let c = 0; c < 36; c++) {
					const jx = 30 + c * ((W - 60) / 35), jy = wy0 + 34 + r * 40, on = (r * 36 + c) % 11 === 4;
					g += `<circle cx="${r1(jx)}" cy="${jy - 11}" r="4.5" fill="${on ? 'var(--yellow)' : '#fff'}" stroke="var(--ink)" stroke-width="1.8"/><circle cx="${r1(jx)}" cy="${jy + 5}" r="7" fill="#fff" stroke="var(--ink)" stroke-width="2"/><circle cx="${r1(jx)}" cy="${jy + 5}" r="2.8" fill="var(--ink)"/>`;
				}
			}
			// The key shelf: one lever key per question, its lamp above it.
			g += `<path d="M 0 ${bedY + bedH} L 8 ${bedY} H ${W - 8} L ${W} ${bedY + bedH} Z" fill="var(--ink)"/>`;
			g += `<path d="M 0 ${bedY + bedH + 6} H ${W}" stroke="var(--line-strong)" stroke-width="3"/>`;
			if (s.box) {
				const hw = 420, hx = (W - 500) / 2 - hw / 2 + 120, hy = wy0 - 26;
				g += `<rect x="${hx}" y="${hy}" width="${hw}" height="52" rx="10" fill="#fff" stroke="var(--purple)" stroke-width="${SW}"/>`;
				html += `<div class="${n}-boxname" style="${at(hx + 6, hy + 5, hw - 12, 42)};font-size:22px" data-fit>${s.box.logo ? logo(s.box.logo, 24) : ''}<span class="nolint" data-t>${fmt(s.box.name ?? '')}</span></div>`;
			}
			lv.forEach((name, i) => {
				const cx = (i + 0.5) * pitch;
				const ly = wy0 + 124;
				g += `<circle cx="${r1(cx)}" cy="${ly}" r="17" fill="var(--purple)" stroke="var(--ink)" stroke-width="3"/><circle cx="${r1(cx - 5)}" cy="${ly - 5}" r="4.5" fill="#fff" opacity=".7"/>`;
				g += leverKey(cx, bedY + 6, len, { tone: 'ink', lean: (i % 3) - 1 });
				html += `<div class="${n}-plate" style="${at(cx - pitch / 2 + 4, plateY, pitch - 8, plateH)}" data-shape data-fit><span class="nolint" data-t>${fmt(name)}</span></div>`;
			});
			// Groups: a bracket under their plates, what they return.
			const gy = plateY + plateH + 14;
			(s.groups ?? []).forEach(gr => {
				const x0 = gr.from * pitch + 8, x1 = (gr.to + 1) * pitch - 8, xm = (x0 + x1) / 2;
				g += `<path d="M ${r1(x0)} ${gy} V ${gy + 12} H ${r1(x1)} V ${gy}" stroke="var(--purple)" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
				const wv = Math.max(200, x1 - x0 + 40);
				html += `<div class="${n}-g" style="${at(Math.max(0, Math.min(W - wv, xm - wv / 2)), gy + 22, wv)}"><b class="nolint" data-t>${esc(gr.value)}</b><span data-t>${fmt(gr.label ?? '')}</span></div>`;
			});
			// The ticket: a call ticket with a perforated stub.
			const tk = s.ticket;
			if (tk) {
				const tw = 470, th = 40 + 42 * ((tk.rows ?? []).length) + 26, tx = W - tw, ty = 0;
				g += `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="16" fill="${mix('orange', 7)}" stroke="var(--orange)" stroke-width="${SW}"/>`;
				g += `<path d="M ${tx + 34} ${ty + 10} V ${ty + th - 10}" stroke="var(--orange)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
				for (const cy of [ty + th * 0.3, ty + th * 0.7]) {
					g += `<circle cx="${tx}" cy="${r1(cy)}" r="9" fill="#fff" stroke="var(--orange)" stroke-width="${SW}"/><rect x="${tx - 12}" y="${r1(cy - 12)}" width="12" height="24" fill="#fff"/>`;
				}
				html += `<div class="${n}-tk" style="${at(tx, ty, tw, th)}"><div class="${n}-tt">${tk.logo ? logo(tk.logo, 28) : ''}<span class="nolint" data-t>${fmt(tk.title ?? '')}</span></div>${(tk.rows ?? []).map(r => `<div class="${n}-tr"><b class="nolint" data-t>${esc(r.value)}</b><span class="nolint" data-t>${fmt(r.label)}</span></div>`).join('')}</div>`;
			}
			if (s.kicker) {
				html += t(`${n}-kicker`, at(0, 0), fmt(s.kicker));
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** The harder the job, the more the able line is worth: a line climbing in three stretches, each steeper, with a
	 * pair of gauge glasses on a level platform at each (cheap line light, able line solid), the gap between them as
	 * a bracket. Fields: eyebrow, title, cheap: { name, logo }, strong: { name, logo }, unit (e.g. 'chance of solving'),
	 * stretches (3): [{ name, sub, cheap, strong, gap, hi }]. */
	'gsb-gradient': {
		css: `${shared('gsb-gradient')}
.gsb-gradient .gsb-gradient-v { position: absolute; text-align: center; font-size: 28px; font-weight: 700; color: var(--purple); white-space: nowrap; }
.gsb-gradient .gsb-gradient-gap { position: absolute; font-size: 30px; font-weight: 700; color: var(--orange); white-space: nowrap; line-height: 1; }
.gsb-gradient .gsb-gradient-gap.hi { font-size: 52px; }
.gsb-gradient .gsb-gradient-gap small { display: block; margin-top: 4px; font-size: 20px; font-weight: 600; }
.gsb-gradient .gsb-gradient-name { position: absolute; text-align: center; font-size: 27px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.gsb-gradient .gsb-gradient-sub { position: absolute; text-align: center; font-size: 21px; color: var(--body); white-space: nowrap; }
.gsb-gradient .gsb-gradient-key { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gsb-gradient .gsb-gradient-unit { position: absolute; font-size: 22px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const n = 'gsb-gradient', H = bodyHeight(s);
			const st = (s.stretches ?? []).slice(0, 3);
			const terr = [{ x0: 0, x1: 470, y: 560 }, { x0: 600, x1: 1060, y: 500 }, { x0: 1250, x1: W, y: 350 }];
			let g = '', html = '';
			// The floor: three platforms, each higher, joined by slopes that get steeper.
			const prof = `M 0 ${terr[0].y} H ${terr[0].x1} L ${terr[1].x0} ${terr[1].y} H ${terr[1].x1} L ${terr[2].x0} ${terr[2].y} H ${W}`;
			g += `<path d="${prof} V ${H} H 0 Z" fill="var(--track)"/>`;
			g += `<path d="${prof}" fill="none" stroke="var(--neutral)" stroke-width="5" stroke-linejoin="round"/>`;
			const gh = 290;
			st.forEach((p, i) => {
				const tr = terr[i], cx = (tr.x0 + tr.x1) / 2 + (i === 2 ? -60 : 0), base = tr.y - 2;
				const xa = cx - 52, xb = cx + 52;
				g += gauge(xa, base - 16, gh, p.cheap, { light: true });
				g += gauge(xb, base - 16, gh, p.strong);
				const ya = base - 16 - (gh * p.cheap) / 100, yb = base - 16 - (gh * p.strong) / 100;
				const yTop = base - 16 - gh;
				html += t(`${n}-v nolint`, `${at(xa - 48, yTop - 44, 96)};color:${mix('purple', 75, '#1b1b1f')}`, `${esc(String(p.cheap))}%`);
				html += t(`${n}-v nolint`, at(xb - 48, yTop - 44, 96), `${esc(String(p.strong))}%`);
				// The gap: a bracket from the cheap level up to the strong level, right of the pair.
				const bx = xb + 52;
				g += `<path d="M ${r1(bx)} ${r1(ya)} H ${r1(bx + 16)} V ${r1(yb)} H ${r1(bx)}" stroke="var(--orange)" stroke-width="${p.hi ? 5 : 3.5}" fill="none" stroke-linejoin="round"/>`;
				html += `<div class="${n}-gap${p.hi ? ' hi' : ''}" style="${at(bx + 28, (ya + yb) / 2 - (p.hi ? 34 : 22))}"><span class="nolint" data-t>${esc(p.gap ?? `+${p.strong - p.cheap}`)}</span><small data-t>${fmt(s.gapLabel ?? '')}</small></div>`;
				html += t(`${n}-name nolint`, at(cx - 160, base + 22, 320), fmt(p.name ?? ''));
				if (p.sub) {
					html += t(`${n}-sub`, at(cx - 160, base + 60, 320), fmt(p.sub));
				}
			});
			// The key: which glass is which line.
			const key = (o, light, y) => `<div class="${n}-key" style="${at(0, y)}"><svg width="26" height="44" viewBox="0 0 26 44"><rect x="3" y="3" width="20" height="38" rx="10" fill="${light ? mix('purple', 38) : 'var(--purple)'}" stroke="var(--ink)" stroke-width="3"/></svg>${o?.logo ? logo(o.logo, 30) : ''}<span class="nolint" data-t>${fmt(o?.name ?? '')}</span></div>`;
			html += key(s.cheap, true, 0) + key(s.strong, false, 60);
			if (s.unit) {
				html += t(`${n}-unit`, at(0, 128), fmt(s.unit));
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** One call, three settings: a knob with a mark per setting patches the same call to a different line at each, with
	 * its chance and cost beside the card. One click per setting; earlier cards stay bright.
	 * Fields: eyebrow, title, task: { label, text }, stops (3, cheapest first): [{ budget, tier, name, logo, chance, cost }],
	 * today: { text, at (stop index) }, box: { name, logo } (the panel's header). */
	'gsb-budget': {
		clicks: true,
		css: `${shared('gsb-budget')}
.gsb-budget .gsb-budget-task { position: absolute; box-sizing: border-box; padding: 16px 22px; border: 3px solid var(--blue); border-radius: 14px; background: var(--blue-tint); }
.gsb-budget .gsb-budget-task .lbl { color: var(--blue); }
.gsb-budget .gsb-budget-tt { margin-top: 6px; font-size: 26px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gsb-budget .gsb-budget-n { position: absolute; text-align: center; white-space: nowrap; }
.gsb-budget .gsb-budget-n b { display: block; font-size: 30px; font-weight: 700; color: var(--orange); line-height: 1.1; }
.gsb-budget .gsb-budget-n span { font-size: 20px; color: var(--body); }
.gsb-budget .gsb-budget-n.off b { color: var(--muted); }
.gsb-budget .gsb-budget-res { position: absolute; display: flex; align-items: baseline; gap: 16px; white-space: nowrap; }
.gsb-budget .gsb-budget-res b { font-size: 50px; font-weight: 700; letter-spacing: -.02em; color: var(--purple); line-height: 1; }
.gsb-budget .gsb-budget-res span { font-size: 30px; font-weight: 600; color: var(--orange); }
.gsb-budget .gsb-budget-today { position: absolute; }
`,
		render(s, ctx = {}) {
			const n = 'gsb-budget', H = bodyHeight(s);
			const stops = (s.stops ?? []).slice(0, 3), step = Math.min(ctx.step ?? stops.length, stops.length);
			const cur = step - 1;
			let g = '', html = '';
			// The budget knob on a control panel standing on the floor: one mark per setting, the label outside the plate.
			const px = 290, py = 480, R = 96, angs = [-160, -90, -20].slice(0, stops.length), fl = 680;
			const pt = (a, r) => [px + Math.cos(a * Math.PI / 180) * r, py + Math.sin(a * Math.PI / 180) * r];
			g += `<rect x="${px - 236}" y="${py - 236}" width="472" height="366" rx="18" fill="${mix('purple', 10)}" stroke="var(--purple)" stroke-width="${SW}"/>`;
			for (const lx of [px - 200, px + 186]) {
				g += `<rect x="${lx}" y="${py + 130}" width="14" height="${fl - py - 130}" rx="3" fill="var(--ink)"/>`;
			}
			g += `<path d="M ${px - 260} ${fl} H ${px + 260}" stroke="var(--faint)" stroke-width="3" stroke-linecap="round"/>`;
			stops.forEach((st, i) => {
				const [ax, ay] = pt(angs[i], R + 8), [bx, by] = pt(angs[i], R + 24);
				g += `<path d="M ${r1(ax)} ${r1(ay)} L ${r1(bx)} ${r1(by)}" stroke="${i === cur ? 'var(--orange)' : 'var(--ink)'}" stroke-width="6" stroke-linecap="round"/>`;
				const [lx, ly] = pt(angs[i], angs[i] === -90 ? R + 62 : R + 84);
				html += `<div class="${n}-n${i === cur ? '' : ' off'}" style="${at(lx - 55, ly - 30, 110)}"><b class="nolint" data-t>${esc(st.budget)}</b><span class="nolint" data-t>${fmt(st.tier ?? '')}</span></div>`;
			});
			g += knob(px, py, R, angs[Math.max(0, cur)]);
			// From the panel, one cable to a jack per line (cheapest at the bottom); the picked one patched in purple.
			const ys = [560, 360, 160].slice(0, stops.length), xc = 1180;
			// The panel's name header, and the call coming in from the card above it.
			const hw = 380, hy = py - 236 - 40;
			g += cables(`M 220 96 C 220 160 ${px} ${hy - 70} ${px} ${hy}`, { tone: 'blue', s: 0.9 });
			g += `<rect x="${px - hw / 2}" y="${hy}" width="${hw}" height="52" rx="10" fill="#fff" stroke="var(--purple)" stroke-width="${SW}"/>`;
			if (s.box) {
				html += `<div class="${n}-boxname" style="${at(px - hw / 2 + 6, hy + 5, hw - 12, 42)};font-size:21px" data-fit>${s.box.logo ? logo(s.box.logo, 23) : ''}<span class="nolint" data-t>${fmt(s.box.name ?? '')}</span></div>`;
			}
			const lc = lineCards(n, stops, { x0: px + 236, y0: py + 80, xc, ys, w: 250, h: 72, pick: Math.max(0, cur) });
			g += lc.svg;
			html += lc.html;
			stops.forEach((st, i) => {
				const shown = i <= cur;
				html += `<div class="${n}-res${shown ? '' : ` ${n}-hide`}" style="${at(xc + 272, ys[i] - 26)}" data-key="res-${i}"><b class="nolint" data-t>${esc(st.chance)}</b><span class="nolint" data-t>${esc(st.cost)}</span></div>`;
			});
			if (s.today) {
				const i = s.today.at ?? 0;
				html += `<div class="${n}-today" style="${at(xc, ys[i] + 48)}">${pill({ text: s.today.text, tone: 'neutral', icon: 'history', size: 's' })}</div>`;
			}
			if (s.task) {
				html += `<div class="${n}-task" style="${at(0, 0, 440)}"><div class="lbl nolint" data-t>${fmt(s.task.label ?? '')}</div><div class="${n}-tt" data-t>${fmt(s.task.text ?? '')}</div></div>`;
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** Results as a line map: cost across (log scale, 1× = today), share solved up. Today is a grey line with a
	 * point per setting; the new way is a purple line with a point per setting; a reference is a grey square.
	 * The corner that is cheaper and better than today is green. Click 1: today's line; click 2: the new line.
	 * Fields: eyebrow, title, xLabel, yLabel, corner (its label), old: { name, stops: [{ name, cost, solved, today }] },
	 * line: { name, stops: [{ name, cost, solved, hi, place: 'r'|'l'|'a'|'b' }] }, ref: { name, cost, solved },
	 * xTicks, yTicks, yMin, yMax. */
	'gsb-map': {
		clicks: true,
		css: `${shared('gsb-map')}
.gsb-map .gsb-map-tick { position: absolute; text-align: center; font-size: 20px; color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
.gsb-map .gsb-map-ax { position: absolute; font-size: 21px; color: var(--body); white-space: nowrap; }
.gsb-map .gsb-map-st { position: absolute; font-size: 21px; color: var(--body); white-space: nowrap; line-height: 1.15; }
.gsb-map .gsb-map-st b { color: var(--ink); font-weight: 600; }
.gsb-map .gsb-map-st b, .gsb-map .gsb-map-st span, .gsb-map .gsb-map-hi b, .gsb-map .gsb-map-hi span { display: inline-block; padding: 0 5px; border-radius: 5px; }
.gsb-map .gsb-map-chip b, .gsb-map .gsb-map-chip span { background: #fff; }
.gsb-map .gsb-map-chip-tint b, .gsb-map .gsb-map-chip-tint span { background: ${mix('green', 8)}; }
.gsb-map .gsb-map-st.old b { color: var(--neutral); }
.gsb-map .gsb-map-hi { position: absolute; white-space: nowrap; line-height: 1; }
.gsb-map .gsb-map-hi b { font-size: 58px; font-weight: 700; letter-spacing: -.03em; color: var(--purple); }
.gsb-map .gsb-map-hi span { margin-top: 6px; font-size: 24px; font-weight: 600; color: var(--ink); }
.gsb-map .gsb-map-name { position: absolute; }
.gsb-map .gsb-map-corner { position: absolute; font-size: 17px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--green); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			const n = 'gsb-map', H = bodyHeight(s), step = ctx.step ?? Infinity;
			const x0 = 120, x1 = 1520, yTop = 64, yBot = 596, lo = 0.25, hi = 16;
			const yMin = s.yMin ?? 48, yMax = s.yMax ?? 78;
			const X = c => x0 + ((Math.log2(c) - Math.log2(lo)) / (Math.log2(hi) - Math.log2(lo))) * (x1 - x0);
			const Y = v => yBot - ((v - yMin) / (yMax - yMin)) * (yBot - yTop);
			let g = '', html = '';
			// The corner: cheaper and better than today's default.
			const today = (s.old?.stops ?? []).find(o => o.today);
			if (today) {
				g += `<rect x="${x0}" y="${yTop}" width="${r1(X(today.cost) - x0)}" height="${r1(Y(today.solved) - yTop)}" fill="${mix('green', 8)}"/>`;
				g += `<path d="M ${r1(X(today.cost))} ${yTop} V ${r1(Y(today.solved))} H ${x0}" stroke="${mix('green', 45)}" stroke-width="2" stroke-dasharray="6 6" fill="none"/>`;
				html += t(`${n}-corner`, at(x0 + 18, yTop + 14), fmt(s.corner ?? ''));
			}
			for (const c of s.xTicks ?? [0.25, 0.5, 1, 2, 4, 8, 16]) {
				g += `<path d="M ${r1(X(c))} ${yTop} V ${yBot}" stroke="var(--line)" stroke-width="2"/>`;
				html += t(`${n}-tick nolint`, at(X(c) - 50, yBot + 12, 100), `${c}\u00d7`);
			}
			for (const v of s.yTicks ?? [50, 60, 70]) {
				g += `<path d="M ${x0} ${r1(Y(v))} H ${x1}" stroke="var(--line)" stroke-width="2"/>`;
				html += t(`${n}-tick nolint`, `${at(0, Y(v) - 13, x0 - 18)};text-align:right`, `${v}%`);
			}
			g += `<path d="M ${x0} ${yTop} V ${yBot} H ${x1}" stroke="var(--line-strong)" stroke-width="3" fill="none"/>`;
			html += t(`${n}-ax`, `${at(x1 - 600, yBot + 50, 600)};text-align:right`, fmt(s.xLabel ?? ''));
			html += t(`${n}-ax`, at(x0 + 2, yTop - 46), fmt(s.yLabel ?? ''));
			// A line on the chart: thick, with white points ringed in the line's colour.
			const lineSvg = (stops, colour, w) => {
				const pts = stops.map(o => [X(o.cost), Y(o.solved)]);
				let o = `<path d="M ${pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join(' L ')}" stroke="${colour}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
				stops.forEach((st, i) => {
					const big = st.hi || st.today;
					o += `<circle cx="${r1(pts[i][0])}" cy="${r1(pts[i][1])}" r="${big ? 17 : 11}" fill="#fff" stroke="${big && st.today ? 'var(--ink)' : colour}" stroke-width="${big ? 6 : 5}"/>`;
				});
				return o;
			};
			// A point's label: lab = [dx, dy, width, align] from the point; value: false shows the name alone.
			const label = (st, old) => {
				const x = X(st.cost), y = Y(st.solved), [dx, dy, w, align] = st.lab ?? [-60, 20, 120, 'center'];
				const val = st.value === false ? '' : `<br><span class="nolint" data-t>${esc(`${st.solved.toFixed(1)}% \u00b7 ${st.cost}\u00d7`)}</span>`;
				return `<div class="${n}-st${old ? ' old' : ''}${st.chip ? ` ${n}-chip${st.chip === 'tint' ? '-tint' : ''}` : ''}" style="${at(x + dx, y + dy, w)};text-align:${align}" data-key="${old ? 'o' : 'n'}-${esc(st.name)}"><b class="nolint" data-t>${fmt(st.name)}</b>${val}</div>`;
			};
			if (s.old) {
				g += lineSvg(s.old.stops, mix('neutral', 45), 10);
				s.old.stops.forEach(st => { html += label(st, true); });
			}
			if (s.ref) {
				const rx = X(s.ref.cost), ry = Y(s.ref.solved);
				g += `<rect x="${r1(rx - 14)}" y="${r1(ry - 14)}" width="28" height="28" rx="4" fill="#fff" stroke="var(--neutral)" stroke-width="5"/>`;
				const [dx, dy, w, align] = s.ref.lab ?? [-314, 22, 300, 'right'];
				html += `<div class="${n}-st old ${n}-chip" style="${at(rx + dx, ry + dy, w)};text-align:${align}"><b class="nolint" data-t>${fmt(s.ref.name)}</b><br><span class="nolint" data-t>${esc(`${s.ref.solved.toFixed(1)}% \u00b7 ${s.ref.cost}\u00d7`)}</span></div>`;
			}
			if (s.line) {
				const show = step >= 2;
				if (show) {
					g += lineSvg(s.line.stops, 'var(--purple)', 12);
				}
				s.line.stops.forEach(st => {
					if (st.hi) {
						const x = X(st.cost), y = Y(st.solved), [dx, dy, w, align] = st.lab ?? [30, 10, 240, 'left'];
						html += `<div class="${n}-hi${show ? '' : ` ${n}-hide`}${st.chip ? ` ${n}-chip${st.chip === 'tint' ? '-tint' : ''}` : ''}" style="${at(x + dx, y + dy, w)};text-align:${align}" data-key="hi-${esc(st.name)}"><b class="nolint" data-t>${esc(`${st.solved.toFixed(1)}%`)}</b><br><span class="nolint" data-t>${esc(`${st.cost}\u00d7 \u00b7 ${st.name}`)}</span></div>`;
					} else {
						html += label(st, false).replace(`class="${n}-st"`, `class="${n}-st${show ? '' : ` ${n}-hide`}"`);
					}
				});
			}
			// Line names, like a transit map's key.
			const keys = [s.old && { text: s.old.name, tone: 'neutral', on: true }, s.line && { text: s.line.name, tone: 'purple', on: step >= 2 }].filter(Boolean);
			html += `<div class="${n}-name" style="${at(x1 + 40, yTop + 160, W - x1 - 40)}">${keys.map((k, i) => `<div style="display:flex;align-items:center;gap:12px;margin-bottom:22px${k.on ? '' : ';visibility:hidden'}" data-key="key-${i}"><svg width="46" height="16" viewBox="0 0 46 16"><path d="M 4 8 H 42" stroke="${k.tone === 'purple' ? 'var(--purple)' : mix('neutral', 45)}" stroke-width="${k.tone === 'purple' ? 12 : 10}" stroke-linecap="round"/></svg><span class="nolint" style="font-size:22px;font-weight:600;color:${k.tone === 'purple' ? 'var(--purple)' : 'var(--neutral)'};white-space:normal;line-height:1.2" data-t>${fmt(k.text)}</span></div>`).join('')}</div>`;
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** A departures board hung from the roof: one row per group, a bar from zero to its change (green up, red down); rows
	 * with hi: true at full strength, the rest muted. A second column (click 2) shows the change at a second setting.
	 * Fields: eyebrow, title, heads: [group, first, second], rows: [{ name, a, b, hi }], total: { name, a, b }, note. */
	'gsb-board': {
		clicks: true,
		css: `${shared('gsb-board')}
.gsb-board .gsb-board-hd { position: absolute; font-size: 18px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.gsb-board .gsb-board-nm { position: absolute; font-size: 24px; color: var(--muted); white-space: nowrap; }
.gsb-board .gsb-board-nm.hi { color: var(--ink); font-weight: 600; }
.gsb-board .gsb-board-v { position: absolute; font-size: 23px; font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gsb-board .gsb-board-v.hi { font-size: 27px; font-weight: 700; }
.gsb-board .gsb-board-b { position: absolute; font-size: 25px; font-weight: 700; color: var(--green); white-space: nowrap; text-align: right; font-variant-numeric: tabular-nums; }
.gsb-board .gsb-board-b.mute { font-weight: 600; font-size: 23px; color: ${mix('green', 75, '#5f6168')}; }
.gsb-board .gsb-board-note { position: absolute; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; color: var(--green); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			const n = 'gsb-board', H = bodyHeight(s), step = ctx.step ?? Infinity;
			const rows = s.rows ?? [], top = 24, pitch = 46, yR = top + 66;
			const h = yR + rows.length * pitch + (s.total ? 66 : 14) - top;
			const xZ = 760, k = 11.5, xB = 1660;
			let g = '', html = '';
			g += `<rect x="0" y="0" width="${W}" height="10" rx="3" fill="var(--neutral)"/>`;
			g += [320, W - 320].map(px => `<path d="M ${px} 4 V ${top}" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>`).join('');
			g += `<rect x="0" y="${top}" width="${W}" height="${r1(h)}" rx="18" fill="#fff" stroke="var(--ink)" stroke-width="${SB}"/>`;
			const later = step < 2 ? ` ${n}-hide` : '';
			const hd = s.heads ?? [];
			html += t(`${n}-hd nolint`, at(36, top + 22), fmt(hd[0] ?? ''));
			html += t(`${n}-hd nolint`, at(xZ - 120, top + 22), fmt(hd[1] ?? ''));
			html += `<div class="${n}-hd nolint${later}" style="${at(xB - 330, top + 22, 330)};text-align:right" data-key="hd2" data-t>${fmt(hd[2] ?? '')}</div>`;
			rows.forEach((r, i) => {
				const y = yR + i * pitch + pitch / 2, up = r.a >= 0, tone = up ? 'green' : 'red';
				const xe = xZ + r.a * k;
				if (i % 2) {
					g += `<rect x="12" y="${r1(y - pitch / 2)}" width="${W - 24}" height="${pitch}" fill="var(--surface-2)"/>`;
				}
				g += `<rect x="${r1(Math.min(xZ, xe))}" y="${r1(y - (r.hi ? 14 : 11))}" width="${r1(Math.abs(xe - xZ))}" height="${r.hi ? 28 : 22}" rx="5" fill="${r.hi ? `var(--${tone})` : mix(tone, 35)}"/>`;
				html += t(`${n}-nm nolint${r.hi ? ' hi' : ''}`, at(36, y - 15), fmt(r.name));
				const txt = `${up ? '+' : '\u2212'}${Math.abs(r.a).toFixed(1)}`;
				const vs = `color:${r.hi ? `var(--${tone})` : mix(tone, 75, '#5f6168')}`;
				html += up ? t(`${n}-v nolint${r.hi ? ' hi' : ''}`, `${at(xe + 12, y - (r.hi ? 17 : 15))};${vs}`, txt) : t(`${n}-v nolint${r.hi ? ' hi' : ''}`, `${at(xe - 112, y - (r.hi ? 17 : 15), 100)};text-align:right;${vs}`, txt);
				if (r.b != null) {
					html += `<div class="${n}-b nolint${r.hi ? '' : ' mute'}${later}" style="${at(xB - 150, y - 16, 150)}" data-key="b-${i}" data-t>${esc(`+${r.b.toFixed(1)}`)}</div>`;
				}
			});
			// The zero line and the column rule go over the row shading.
			g += `<path d="M ${xZ} ${yR - 8} V ${r1(yR + rows.length * pitch + 4)}" stroke="var(--ink)" stroke-width="3"/>`;
			g += `<path d="M ${xB - 330} ${yR - 14} V ${r1(yR + rows.length * pitch + 50)}" stroke="var(--line-strong)" stroke-width="3"/>`;
			if (s.total) {
				const y = yR + rows.length * pitch + 36;
				g += `<path d="M 24 ${y - 30} H ${W - 24}" stroke="var(--line-strong)" stroke-width="3"/>`;
				html += t(`${n}-nm nolint hi`, at(36, y - 15), fmt(s.total.name));
				html += t(`${n}-v nolint hi`, `${at(xZ + 12, y - 17)};color:var(--green)`, esc(s.total.a));
				html += `<div class="${n}-b nolint${later}" style="${at(xB - 150, y - 16, 150)}" data-key="b-total" data-t>${esc(s.total.b)}</div>`;
			}
			if (s.note) {
				html += `<div class="${n}-note${later}" style="${at(xB - 330, top + h + 18, 330)};justify-content:flex-end" data-key="note">${ic('checkCircle', 26)}<span data-t>${fmt(s.note)}</span></div>`;
			}
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** What is done and what is not, on a blue page: a finished line on its own poles (wired, with a terminal box),
	 * poles without wire and a cable drum, then survey stakes. Each stop is a sign on two posts. Fields: eyebrow, title,
	 * stops (3–4): [{ state: 'done' | 'building' | 'survey', label, title, sub }]. */
	'gsb-works': {
		css: `${shared('gsb-works')}
.gsb-works .gsb-works-card { position: absolute; box-sizing: border-box; padding: 20px 24px; background: #fff; border-radius: 16px; }
.gsb-works .gsb-works-tt { margin-top: 12px; font-size: 32px; font-weight: 700; color: var(--ink); white-space: nowrap; line-height: 1.1; }
.gsb-works .gsb-works-ss { margin-top: 8px; font-size: 22px; color: var(--body); line-height: 1.25; }
.gsb-works .gsb-works-flag { position: absolute; font-size: 22px; font-weight: 600; color: #fff; white-space: nowrap; text-align: center; }
`,
		render(s) {
			const n = 'gsb-works', H = bodyHeight(s);
			const stops = (s.stops ?? []).slice(0, 4), k = stops.length || 1;
			const yG = 610, seg = W / k, cw = seg - 40, chH = 176, cardY = 110, armY = cardY + chH + 46;
			const WHITE = '#fff', SOFT = 'rgba(255,255,255,.55)';
			let g = '', html = '';
			g += `<path d="M 0 ${yG} H ${W}" stroke="rgba(255,255,255,.35)" stroke-width="3"/>`;
			// A telephone pole: a post from the ground up to the sign, a crossarm with three insulators.
			const pole = x => `<path d="M ${r1(x)} ${yG} V ${cardY + chH}" stroke="${WHITE}" stroke-width="10" stroke-linecap="round"/><path d="M ${r1(x - 40)} ${armY} H ${r1(x + 40)}" stroke="${WHITE}" stroke-width="8" stroke-linecap="round"/>`
				+ [-30, 0, 30].map(d => `<rect x="${r1(x + d - 5)}" y="${armY - 16}" width="10" height="14" rx="3" fill="${WHITE}"/>`).join('');
			stops.forEach((st, i) => {
				const xa = i * seg, cx = xa + 20, p0 = cx + 60, p1 = cx + cw - 60;
				if (st.state === 'done' || st.state === 'building') {
					g += pole(p0) + pole(p1);
				} else {
					g += [cx + 40, cx + cw - 40].map(px => `<path d="M ${r1(px)} ${cardY + chH} V ${yG}" stroke="${SOFT}" stroke-width="5" stroke-linecap="round"/>`).join('');
					g += `<path d="M ${r1(xa + 10)} ${yG - 4} H ${r1(xa + seg - 10)}" stroke="${SOFT}" stroke-width="3" stroke-dasharray="3 14" stroke-linecap="round"/>`;
					for (const px of [xa + seg * 0.32, xa + seg * 0.68]) {
						g += `<path d="M ${r1(px)} ${yG} V ${yG - 44}" stroke="${WHITE}" stroke-width="5" stroke-linecap="round"/><path d="M ${r1(px)} ${yG - 44} L ${r1(px + 30)} ${yG - 35} L ${r1(px)} ${yG - 26} Z" fill="var(--orange)" stroke="${WHITE}" stroke-width="2"/>`;
					}
				}
				if (st.state === 'done') {
					// Wires strung between the two poles, and a terminal box at the end: a finished line of its own.
					for (const d of [-30, 0, 30]) {
						g += `<path d="M ${r1(p0 + d)} ${armY - 14} Q ${r1((p0 + p1) / 2 + d)} ${armY + 36} ${r1(p1 + d)} ${armY - 14}" fill="none" stroke="${WHITE}" stroke-width="3"/>`;
					}
					g += `<path d="M ${r1(p1 + 30)} ${armY - 14} q 30 30 34 120 V ${yG - 60}" fill="none" stroke="${WHITE}" stroke-width="3"/><rect x="${r1(p1 + 44)}" y="${yG - 64}" width="40" height="64" rx="6" fill="${WHITE}"/><circle cx="${r1(p1 + 64)}" cy="${yG - 40}" r="7" fill="var(--green)"/>`;
				} else if (st.state === 'building') {
					// Poles up, no wire yet: a cable drum waits on the ground between them.
					const dx = (p0 + p1) / 2;
					g += `<path d="M ${r1(dx - 44)} ${yG} L ${r1(dx)} ${yG - 50} L ${r1(dx + 44)} ${yG}" fill="none" stroke="${WHITE}" stroke-width="6" stroke-linejoin="round"/>`;
					g += `<circle cx="${r1(dx)}" cy="${yG - 50}" r="44" fill="var(--blue)" stroke="${WHITE}" stroke-width="7"/><circle cx="${r1(dx)}" cy="${yG - 50}" r="30" fill="none" stroke="${SOFT}" stroke-width="10"/><circle cx="${r1(dx)}" cy="${yG - 50}" r="8" fill="${WHITE}"/>`;
					g += `<path d="M ${r1(dx + 30)} ${yG - 80} q 30 -20 60 6" fill="none" stroke="${WHITE}" stroke-width="3"/>`;
				}
				const tone = st.state === 'done' ? 'green' : st.state === 'building' ? 'orange' : 'blue';
				const icon = st.state === 'done' ? 'checkCircle' : st.state === 'building' ? 'wrench' : 'flag';
				html += `<div class="${n}-card" style="${at(cx, cardY, cw, chH)}" data-fit>${pill({ text: st.label ?? '', tone, icon, size: 's' }).replace('class="st-pill', 'class="nolint st-pill').replace(' data-t ', ' data-t data-on="#ffffff" ')}<div class="${n}-tt nolint" data-t>${fmt(st.title ?? '')}</div>${st.sub ? `<div class="${n}-ss" data-t>${fmt(st.sub)}</div>` : ''}</div>`;
			});
			return heading(s) + body(`<div class="${n}" style="width:${W}px;height:${H}px">${svgLayer(n, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	// @@DESIGNS
};
