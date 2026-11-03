// A gallery for inspiration (the harbour world): read it for technique: how a ship carries countable boxes, how a beam starts at its lamp, how a before/after splits a page.
// A new deck draws its own pictures in designs/local-<deck>.mjs: do not reuse these as they are. Every visible
// word comes from the slide's fields; examples/new-terminal.mjs shows them in a deck.
// One harbour, one object: the shipping container comes back on every page.
//   hb-cover:    a cover: a container ship loaded with countable stacks (1 box = 100), a crane lowering the last box on
//   hb-piers:    an old pier chained shut on a date, empty; the moved ships sailing in to the new quay, the native ones moored
//   hb-stamps:   a ship's manifest with one round stamp per step, between the old container and the cleared one
//   hb-gauges:   twin-needle dials, one per line: the old and the new needle almost on top of each other
//   hb-light:    a lighthouse whose beam lights up hazard rocks with danger buoys, one per bug found
//   hb-seal:     before and after, framed the same: a sealed envelope by the crew's box; then opened, its sheet in the box, stamped
//   hb-yard:     three rows you can count: boats, containers, people
//   hb-wakes:    one boat per line, its wake made of dots: the long wake is the one that matters
//   hb-storm:    a ship losing boxes in a storm, a signal buoy, the same ship at a new quay, then one green buoy per clean crossing
//   hb-chart:    a closing card: the statement on the left, a sea chart on the right with a route and its marked hazards
import { W, STYLE, at, t, mix, layer, wob, r1, fmt, ic, pill, heading, body, bodyHeight, msLogo } from '../src/kit.mjs';

const SW = STYLE.stroke;
const P = (d, stroke, w = SW, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

/** The shared text and icon classes of a design n. */
const base = n => `
.${n} { position: relative; width: ${W}px; }
.${n} .hb-tx { position: absolute; white-space: nowrap; }
.${n} .hb-cx { transform: translateX(-50%); text-align: center; }
.${n} .hb-rx { transform: translateX(-100%); text-align: right; }
.${n} .hb-ic { position: absolute; line-height: 0; }
.${n} .hb-name { font-size: 28px; font-weight: 600; color: var(--ink); line-height: 1.15; }
.${n} .hb-sub { font-size: 23px; color: var(--body); line-height: 1.25; }
.${n} .hb-num { font-size: 40px; font-weight: 700; letter-spacing: -.02em; line-height: 1; color: var(--fg, var(--ink)); font-variant-numeric: tabular-nums; }
.${n} .hb-big { font-size: 76px; font-weight: 700; letter-spacing: -.035em; line-height: .95; color: var(--fg, var(--ink)); font-variant-numeric: tabular-nums; }
.${n} .lbl { color: var(--fg, var(--muted)); }
`;
/** A text element at (x, y): cls adds hb-cx (centred on x) or hb-rx (right edge on x). */
const T = (cls, x, y, html, o = {}) => t(`hb-tx ${cls}`, at(x, y, o.w, o.h), html, o);
/** A Fluent icon centred on (cx, cy). */
const I = (name, cx, cy, size, color) => `<div class="hb-ic" style="${at(cx - size / 2, cy - size / 2, size, size)}">${ic(name, size, color)}</div>`;

// ---------- the drawn objects ----------

/** A shipping container, side view: a box with corrugated ribs. Small ones (h < 40) are solid, big ones outlined. */
function crate(x, y, w, h, tone = 'blue', o = {}) {
	const big = h >= 40;
	const fill = o.fill ?? (big ? mix(tone, o.pct ?? 16) : `var(--${tone})`);
	const rib = o.rib ?? (big ? mix(tone, 55) : mix(tone, 55));
	const rx = o.rx ?? (big ? 12 : Math.min(4, h * 0.2));
	let g = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(rx)}" fill="${fill}"${big ? ` stroke="var(--${tone})" stroke-width="${SW}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}/>`;
	const n = Math.max(3, Math.round(w / Math.max(9, h * (big ? 0.3 : 0.36))));
	for (let i = 1; i < n; i++) {
		const xx = x + (w * i) / n;
		g += `<line x1="${r1(xx)}" y1="${r1(y + h * 0.22)}" x2="${r1(xx)}" y2="${r1(y + h * 0.78)}" stroke="${rib}" stroke-width="${r1(big ? 3 : Math.max(1.6, h * 0.08))}" stroke-linecap="round"${o.op ? ` opacity="${o.op}"` : ''}/>`;
	}
	return g;
}

/** A small cargo ship, side view, bow to the right. y is the deck line; the hull is w * 0.2 deep.
 * o: { cargo: tone of the container on deck (null for none), solid (filled hull), op, cabin (default true) } */
function ship(x, y, w, tone = 'blue', o = {}) {
	const h = w * 0.2, sw = o.sw ?? (w >= 120 ? SW : 3);
	const op = o.op ? ` opacity="${o.op}"` : '';
	let g = `<g${op}>`;
	if (o.cabin !== false) {
		const cx = x + w * 0.05, cw = w * 0.17, ch = h * 1.25;
		g += `<rect x="${r1(cx)}" y="${r1(y - ch)}" width="${r1(cw)}" height="${r1(ch + 2)}" rx="${r1(Math.min(8, cw * 0.18))}" fill="#fff" stroke="var(--${tone})" stroke-width="${sw}"/>`;
		g += `<rect x="${r1(cx + cw * 0.2)}" y="${r1(y - ch * 0.78)}" width="${r1(cw * 0.6)}" height="${r1(ch * 0.26)}" rx="${r1(Math.min(4, ch * 0.08))}" fill="${mix(tone, 45)}"/>`;
	}
	if (o.cargo) {
		const cx = x + w * 0.27, cw = w * 0.6, chh = h * 0.95;
		g += crate(cx, y - chh - sw / 2, cw, chh, o.cargo, { pct: 22 });
	}
	g += `<path d="M ${r1(x)} ${r1(y)} H ${r1(x + w)} L ${r1(x + w - h * 0.75)} ${r1(y + h)} H ${r1(x + h * 0.2)} Z" fill="${o.solid ? `var(--${tone})` : mix(tone, 22)}" stroke="var(--${tone})" stroke-width="${sw}" stroke-linejoin="round"/>`;
	return g + '</g>';
}

/** A wavy line from x0 to x1 at y: amplitude amp, wavelength len. */
function wave(x0, x1, y, amp = 8, len = 64) {
	const n = Math.max(1, Math.floor((x1 - x0) / len));
	let d = `M ${r1(x0)} ${r1(y)}`;
	for (let i = 0; i < n; i++) {
		d += ` q ${r1(len / 4)} ${r1(-amp)} ${r1(len / 2)} 0 t ${r1(len / 2)} 0`;
	}
	return d;
}
/** Water: a filled area under a wavy top edge, from x0 to x1, top y to bottom yb. */
const water = (x0, x1, y, yb, amp = 8, len = 64, fill = mix('blue', 9)) => {
	const n = Math.max(1, Math.floor((x1 - x0) / len)), xe = x0 + n * len;
	return `<path d="${wave(x0, xe, y, amp, len)} L ${r1(xe)} ${r1(yb)} L ${r1(x0)} ${r1(yb)} Z" fill="${fill}"/>`;
};
/** The sea fading to white towards the bottom of the body (a gradient, not a filter). */
const SEA = `<defs><linearGradient id="hb-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix('blue', 11)}"/><stop offset=".7" stop-color="${mix('blue', 7)}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>`;
const sea = (x0, x1, y, yb, amp, len) => SEA + water(x0, x1, y, yb, amp, len, 'url(#hb-sea)');
/** Two or three short wave strokes in the water, for movement. */
const ripples = (pts, tone = 'blue', pct = 35) => pts.map(([x, y, len]) => P(wave(x, x + (len ?? 96), y, 6, 48), mix(tone, pct), 4)).join('');

/** A person: a round head over rounded shoulders, standing on base. */
function person(cx, baseY, s, fill) {
	const hr = s * 0.3, bw = s * 0.46;
	return `<circle cx="${r1(cx)}" cy="${r1(baseY - s * 1.12)}" r="${r1(hr)}" fill="${fill}"/>`
		+ `<path d="M ${r1(cx - bw)} ${r1(baseY)} V ${r1(baseY - s * 0.42)} A ${r1(bw)} ${r1(bw)} 0 0 1 ${r1(cx + bw)} ${r1(baseY - s * 0.42)} V ${r1(baseY)} Z" fill="${fill}"/>`;
}

/** A gull: two arcs. */
const gull = (x, y, s = 16) => P(`M ${r1(x - s)} ${r1(y)} q ${r1(s / 2)} ${r1(-s * 0.7)} ${r1(s)} 0 q ${r1(s / 2)} ${r1(-s * 0.7)} ${r1(s)} 0`, 'var(--ink)', 4);

/** A container ship in the cover's style, bow to the right: a solid hull, a white bridge with two windows and a funnel at
 * the stern, container stacks on deck. y is the deck line; the hull is w * 0.184 deep (the cover's ship is 674 wide).
 * o: { load: boxes per column, cargo: a tone or (col, row) => tone (null: an empty slot), op, hull (fill), bridge (false: none) }.
 * Returns { svg, top (the highest point), cargoTop, hd (hull depth) }. */
function freighter(x, y, w, tone = 'blue', o = {}) {
	const s = w / 674, hd = 124 * s, sw = s < 0.3 ? 3 : SW;
	let g = `<g${o.op ? ` opacity="${o.op}"` : ''}>`;
	const load = o.load ?? [3, 3, 2, 3, 3, 2, 3];
	const cx0 = x + 116 * s, cx1 = x + w - 40 * s, gap = Math.max(3, 4 * s);
	const cw = (cx1 - cx0 - gap * (load.length - 1)) / load.length, ch = cw * 0.565;
	let top = y - 196 * s, cargoTop = y;
	load.forEach((n, i) => {
		for (let r = 0; r < n; r++) {
			const ct = typeof o.cargo === 'function' ? o.cargo(i, r) : (o.cargo ?? tone);
			const yy = y - sw / 2 - 2 - ch - r * (ch + gap);
			if (!ct) {
				continue;
			}
			g += crate(cx0 + i * (cw + gap), yy, cw, ch, ct);
			top = Math.min(top, yy);
			cargoTop = Math.min(cargoTop, yy);
		}
	});
	if (o.bridge !== false) {
		g += `<rect x="${r1(x + 22 * s)}" y="${r1(y - 150 * s)}" width="${r1(78 * s)}" height="${r1(150 * s)}" rx="${r1(Math.max(6, 10 * s))}" fill="#fff" stroke="var(--${tone})" stroke-width="${sw}"/>`;
		g += [128, 92].map(k => `<rect x="${r1(x + 36 * s)}" y="${r1(y - k * s)}" width="${r1(50 * s)}" height="${r1(22 * s)}" rx="${r1(Math.max(3, 6 * s))}" fill="${mix(tone, 40)}"/>`).join('');
		g += `<rect x="${r1(x + 44 * s)}" y="${r1(y - 196 * s)}" width="${r1(34 * s)}" height="${r1(46 * s + 4)}" rx="${r1(Math.max(3, 6 * s))}" fill="var(--${tone})"/>`;
	}
	g += `<path d="M ${r1(x)} ${r1(y)} H ${r1(x + w)} L ${r1(x + w - 44 * s)} ${r1(y + hd)} H ${r1(x + 26 * s)} Z" fill="${o.hull ?? `var(--${tone})`}" stroke="var(--${tone})" stroke-width="${sw}" stroke-linejoin="round"/>`;
	return { svg: g + '</g>', top, cargoTop, hd };
}

/** A wake behind a ship sailing right: foam lines trailing left from the stern at (x, y) on the water line, len long. */
function wake(x, y, len = 180, tone = 'blue') {
	return [[-1, 1, 50, 4], [1, 0.7, 40, 4], [0, 0.45, 30, 3]].map(([dir, k, pct, w]) => {
		const l = len * k;
		return P(`M ${r1(x - 4)} ${r1(y)} C ${r1(x - l * 0.35)} ${r1(y + dir * 2)}, ${r1(x - l * 0.7)} ${r1(y + dir * 10)}, ${r1(x - l)} ${r1(y + dir * 14)}`, mix(tone, pct), w);
	}).join('');
}

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
function smooth(pts) {
	let d = `M ${r1(pts[0][0])} ${r1(pts[0][1])}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
		d += ` C ${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)}, ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)}, ${r1(p2[0])} ${r1(p2[1])}`;
	}
	return d;
}

/** A tick in a green disc centred on (cx, cy), radius r. */
const tick = (cx, cy, r = 24) => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r}" fill="var(--green)" stroke="#fff" stroke-width="4"/>` + P(`M ${r1(cx - r * 0.42)} ${r1(cy + r * 0.02)} L ${r1(cx - r * 0.1)} ${r1(cy + r * 0.34)} L ${r1(cx + r * 0.44)} ${r1(cy - r * 0.3)}`, '#fff', 4);

/** A bollard on a quay edge at (cx, y): a short post with a cap. */
const bollard = (cx, y, tone = 'ink') => `<rect x="${r1(cx - 9)}" y="${r1(y - 22)}" width="18" height="24" rx="5" fill="var(--${tone})"/><rect x="${r1(cx - 14)}" y="${r1(y - 28)}" width="28" height="10" rx="5" fill="var(--${tone})"/>`;

/** A sea filled in user space from y0 (tinted) to y1 (white), so every patch of water matches wherever it is. */
const seaDef = (id, y0, y1) => `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${r1(y0)}" x2="0" y2="${r1(y1)}"><stop offset="0" stop-color="${mix('blue', 12)}"/><stop offset=".75" stop-color="${mix('blue', 7)}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>`;

const speakerHtml = sp => sp ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${fmt(sp.initials)}</span><span class="tf-name" data-t>${fmt(sp.name)}</span>${sp.role ? `<span class="tf-role" data-t>${fmt(sp.role)}</span>` : ''}</div>` : '';

export const designs = {
	/** A cover: on the right half a container ship lies at a quay, its deck stacked with boxes in one stack per part
	 * (1 box = unit), the total painted on the hull; a gantry crane on the quay lowers the last box into the one free
	 * slot. Left: eyebrow, title, sub, speaker, pills; the logo on top.
	 * Fields: eyebrow, title, sub, speaker: { initials, name, role }, pills, hull (text on the hull), unit (the legend),
	 * stacks (2–4): [{ name, value, boxes, tone }], lift: { name, value, tone } (the box on the crane). */
	'hb-cover': {
		bare: true,
		css: `
.hb-cover { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.hb-cover .hb-cover-left { width: 800px; }
.hb-cover .hb-tx { position: absolute; white-space: nowrap; }
.hb-cover .hb-cx { transform: translateX(-50%); text-align: center; }
.hb-cover .hb-cover-hull { font-size: 40px; font-weight: 700; letter-spacing: -.02em; color: #fff; }
.hb-cover .hb-cover-n { font-size: 30px; font-weight: 700; letter-spacing: -.01em; line-height: 1.05; color: var(--fg); font-variant-numeric: tabular-nums; }
.hb-cover .hb-cover-k { margin-top: 4px; font-size: 15px; }
.hb-cover .lbl { color: var(--muted); }
`,
		render(s) {
			const left = `<div class="tf-left hb-cover-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${speakerHtml(s.speaker)}${s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : ''}</div>`;
			const deck = 736, wTop = 816, bw = 46, bh = 26, px = 50, py = 30;
			const hx0 = 990, hx1 = 1664;
			let g = '';
			// Sky: two gulls.
			g += gull(1120, 262, 18) + gull(1176, 300, 14) + gull(1012, 330, 12);
			// The quay and its crane.
			const qx = 1700;
			g += `<rect x="${qx}" y="760" width="260" height="300" fill="${mix('neutral', 12)}"/>` + P(`M ${qx} 1060 V 760 H 1960`, 'var(--neutral)');
			g += `<rect x="${qx + 18}" y="738" width="26" height="24" rx="8" fill="var(--neutral)"/>`;
			// Stacks on deck.
			const stacks = (s.stacks ?? []).slice(0, 4);
			let x = 1104, html = '', slot = null;
			const labels = [];
			stacks.forEach((st, k) => {
				const n = st.boxes ?? 1, cols = n >= 12 ? 4 : 2, rows = Math.ceil(n / cols);
				for (let i = 0; i < n; i++) {
					const c = i % cols, r = Math.floor(i / cols);
					g += crate(x + c * px, deck - 4 - bh - r * py, bw, bh, st.tone ?? 'blue');
				}
				if (k === stacks.length - 1 && n % cols) {
					slot = { x: x + (n % cols) * px, y: deck - 4 - bh - (rows - 1) * py };
				}
				const w = cols * px - 4, top = deck - 4 - bh - (rows - 1) * py;
				labels.push({ cx: x + w / 2, x, top, st });
				x += w + 22;
			});
			slot ??= { x: x, y: deck - 4 - bh };
			// The hull, then the water over its keel.
			g += `<rect x="${hx0 + 22}" y="${deck - 150}" width="78" height="150" rx="10" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
			g += `<rect x="${hx0 + 36}" y="${deck - 128}" width="50" height="22" rx="6" fill="${mix('blue', 40)}"/><rect x="${hx0 + 36}" y="${deck - 92}" width="50" height="22" rx="6" fill="${mix('blue', 40)}"/>`;
			g += `<rect x="${hx0 + 44}" y="${deck - 196}" width="34" height="46" rx="6" fill="var(--blue)"/>`;
			g += `<path d="M ${hx0} ${deck} H ${hx1} L ${hx1 - 44} ${deck + 124} H ${hx0 + 26} Z" fill="var(--blue)" stroke="var(--blue)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += water(-24, 1704, wTop, 1080, 9, 72);
			g += ripples([[160, 900, 120], [520, 960, 96], [820, 880, 96], [1250, 950, 96], [1480, 890, 144], [1060, 1000, 120]]);
			// The crane: two legs, a truss girder reaching over the ship, a trolley and the hanging box.
			const gx0 = 1430, gx1 = 1904, gy = 252, legs = [1752, 1872];
			const lift = s.lift ?? {};
			const tone = lift.tone ?? 'orange';
			const hx = slot.x, hy = 410, tx = hx + bw / 2;
			g += legs.map(lx => P(`M ${lx} 760 V ${gy + 30}`, 'var(--ink)', 8)).join('');
			g += P(`M ${legs[0]} 744 L ${legs[1]} 520 M ${legs[1]} 744 L ${legs[0]} 520 M ${legs[0]} 520 H ${legs[1]}`, 'var(--ink)', SW);
			let truss = `M ${gx0} ${gy} H ${gx1} M ${gx0 + 20} ${gy + 30} H ${gx1}`;
			for (let xx = gx0 + 20, up = true; xx < gx1 - 20; xx += 34, up = !up) {
				truss += ` M ${xx} ${up ? gy + 30 : gy} L ${xx + 34} ${up ? gy : gy + 30}`;
			}
			g += P(truss, 'var(--ink)', SW) + P(`M ${gx0} ${gy} L ${gx0 + 20} ${gy + 30}`, 'var(--ink)', SW);
			g += `<rect x="${legs[0] - 6}" y="${gy + 34}" width="76" height="58" rx="10" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/><rect x="${legs[0] + 10}" y="${gy + 48}" width="44" height="22" rx="5" fill="${mix('blue', 40)}"/>`;
			g += `<rect x="${tx - 24}" y="${gy + 30}" width="48" height="22" rx="6" fill="var(--ink)"/>`;
			g += P(`M ${tx - 10} ${gy + 52} L ${tx - 14} ${hy - 18} M ${tx + 10} ${gy + 52} L ${tx + 14} ${hy - 18}`, 'var(--ink)', 3);
			g += `<rect x="${hx - 6}" y="${hy - 20}" width="${bw + 12}" height="10" rx="4" fill="var(--ink)"/>`;
			g += P(`M ${hx + 4} ${hy - 10} L ${hx + 8} ${hy} M ${hx + bw - 4} ${hy - 10} L ${hx + bw - 8} ${hy}`, 'var(--ink)', 3);
			g += crate(hx, hy, bw, bh, tone);
			// A dotted drop line towards the free slot (it stops above the last stack's label).
			const lastTop = labels.length ? labels[labels.length - 1].top - 84 : slot.y - 10;
			g += P(`M ${tx} ${hy + bh + 14} V ${lastTop}`, mix(tone, 70), 4, ' stroke-dasharray="2 12"');
			g += `<rect x="${slot.x}" y="${slot.y}" width="${bw}" height="${bh}" rx="4" fill="none" stroke="${mix(tone, 70)}" stroke-width="3" stroke-dasharray="6 6"/>`;
			// Labels: the value big, the name in small caps, over each stack and beside the hanging box.
			for (const l of labels) {
				html += `<div class="hb-tx hb-cx t-${l.st.tone ?? 'blue'}" style="${at(l.cx, l.top - 74)}">${t('hb-cover-n nolint', '', fmt(l.st.value ?? ''))}${t('lbl hb-cover-k', '', fmt(l.st.name ?? ''))}</div>`;
			}
			html += `<div class="hb-tx t-${tone}" style="${at(hx - 18, hy - 16)};transform:translateX(-100%);text-align:right">${t('hb-cover-n nolint', '', fmt(lift.value ?? ''))}${t('lbl hb-cover-k', '', fmt(lift.name ?? ''))}</div>`;
			html += t('hb-tx hb-cx hb-cover-hull nolint', at((hx0 + hx1) / 2 + 20, deck + 22), fmt(s.hull ?? '')).replace('data-t', 'data-t data-on="#0078d4"');
			if (s.unit) {
				html += `<div class="hb-tx" style="${at(1040, 886)};display:flex;align-items:center;gap:10px"><svg width="34" height="20" viewBox="0 0 34 20">${crate(1, 1, 32, 18, 'blue')}</svg>${t('lbl', '', fmt(s.unit))}</div>`;
			}
			return `<div class="hb-cover">${layer(1080, g, 1920)}${left}${html}${msLogo()}</div>`;
		},
	},

	/** A harbour, side view. Left, the old pier, greyed and empty: chained shut between two posts with a red padlock, a
	 * sign on a post with the date it closes, a cut rope on its bollard. Right, the new dock: a quay with bollards and a
	 * gantry crane, the ships that were already native moored at it (muted, named over them). In between, the moved ships
	 * (in the cover's style, their names on the hulls, a green tick each) sail in from the old pier on curved dotted routes
	 * with wakes, the first one arriving at the quay. Fields: eyebrow, title, from: { title, sub }, to: { title, sub },
	 * closes: { text, icon, tone }, ships (2–3 moved + 1–2 not): [{ title, sub, moved }]. */
	'hb-piers': {
		css: base('hb-piers') + `
.hb-piers .hb-piers-tag { position: absolute; display: flex; align-items: center; gap: 12px; padding: 0 22px; height: 64px; border-radius: 20px; border: ${SW}px solid var(--fg); background: var(--tint); color: var(--fg); box-sizing: border-box; }
.hb-piers .hb-piers-tag div { font-size: 28px; font-weight: 700; white-space: nowrap; color: var(--fg); }
.hb-piers .hb-piers-hull { font-size: 23px; font-weight: 700; color: #fff; line-height: 1; }
.hb-piers .hb-piers-mute { color: var(--muted); }
`,
		render(s) {
			const H = bodyHeight(s);
			const wTop = 300, qTop = 250, qx = 990, bx = 1556, R = W + 96;
			const fr = s.from ?? {}, to = s.to ?? {}, tg = s.closes ?? {};
			let g = seaDef('hb-piers-sea', wTop, H) + `<defs><linearGradient id="hb-piers-quay" gradientUnits="userSpaceOnUse" x1="0" y1="${qTop}" x2="0" y2="${H}"><stop offset="0" stop-color="${mix('blue', 16)}"/><stop offset=".7" stop-color="${mix('blue', 12)}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>`, html = '';
			const patch = (x0, x1, y0) => water(x0, x1 + 28, y0, Math.min(H, y0 + 80), 4, 28, 'url(#hb-piers-sea)');
			// Sky.
			g += gull(560, 92, 18) + gull(616, 126, 14) + gull(820, 70, 12);
			// The old pier: piles first (the water hides their feet), then the deck of grey planks, one missing, one hanging.
			const ox1 = 380, dk = 206;
			for (let x = 24; x <= ox1 - 10; x += 88) {
				g += `<rect x="${x - 9}" y="${dk + 30}" width="18" height="${wTop - dk + 20}" rx="6" fill="${mix('neutral', 45)}"/>`;
			}
			// The quay crane's legs, behind the quay.
			const legs = [1640, 1740], gy = 8;
			g += legs.map(lx => P(`M ${lx} ${qTop} V ${gy + 30}`, 'var(--ink)', 8)).join('');
			g += P(`M ${legs[0]} ${qTop - 10} L ${legs[1]} ${gy + 140} M ${legs[1]} ${qTop - 10} L ${legs[0]} ${gy + 140} M ${legs[0]} ${gy + 140} H ${legs[1]}`, 'var(--ink)', SW);
			let truss = `M 1330 ${gy} H ${R} M 1350 ${gy + 30} H ${R}`;
			for (let xx = 1350, up = true; xx < R - 20; xx += 34, up = !up) {
				truss += ` M ${xx} ${up ? gy + 30 : gy} L ${xx + 34} ${up ? gy : gy + 30}`;
			}
			g += P(truss, 'var(--ink)', SW) + P(`M 1330 ${gy} L 1350 ${gy + 30}`, 'var(--ink)', SW);
			g += `<rect x="${legs[0] - 8}" y="${gy + 34}" width="72" height="54" rx="10" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/><rect x="${legs[0] + 8}" y="${gy + 48}" width="40" height="20" rx="5" fill="${mix('blue', 40)}"/>`;
			const hk = 1560;
			g += `<rect x="${hk - 22}" y="${gy + 30}" width="44" height="20" rx="6" fill="var(--ink)"/>` + P(`M ${hk} ${gy + 50} V ${gy + 128}`, 'var(--ink)', 3);
			g += P(`M ${hk} ${gy + 126} v 14 a 10 10 0 0 1 -18 4`, 'var(--ink)', SW);
			// The sea.
			g += water(-120, R + 40, wTop, H, 7, 64, 'url(#hb-piers-sea)');
			g += ripples([[40, wTop + 300, 120], [210, wTop + 360, 96]], 'blue', 30);
			// The old pier's deck: one grey beam with plank seams, a section broken out and hanging.
			const gap0 = 196, gap1 = 246;
			for (let k = 0; k + 1 < 5; k++) {
				const xa = 24 + k * 88, xb = xa + 88;
				if (xb <= ox1) {
					g += P(`M ${xa} ${dk + 40} L ${xb} ${wTop - 6} M ${xb} ${dk + 40} L ${xa} ${wTop - 6}`, mix('neutral', 35), 4);
				}
			}
			for (const [xa, xb] of [[-60, gap0], [gap1, ox1]]) {
				g += `<rect x="${xa}" y="${dk}" width="${xb - xa}" height="34" rx="8" fill="${mix('neutral', 10)}" stroke="${mix('neutral', 55)}" stroke-width="${SW}"/>`;
				for (let x = xa + 40; x < xb - 16; x += 40) {
					g += P(`M ${x} ${dk + 9} V ${dk + 25}`, mix('neutral', 40), 3);
				}
			}
			g += `<rect x="${gap0 + 6}" y="${dk + 6}" width="56" height="26" rx="6" fill="${mix('neutral', 10)}" stroke="${mix('neutral', 55)}" stroke-width="${SW}" transform="rotate(32 ${gap0 + 6} ${dk + 6})"/>`;
			// A bollard with a cut rope: nothing is moored here any more.
			g += bollard(40, dk, 'neutral') + P(`M 52 ${dk - 16} q 26 6 22 46 q -4 30 10 56`, mix('neutral', 60), 4);
			// The gate: two posts, a chain sagging between them, a padlock.
			const gp = [176, 360], chainY = dk - 92;
			g += gp.map(x => `<rect x="${x - 14}" y="${chainY - 26}" width="28" height="${dk - chainY + 26}" rx="10" fill="var(--neutral)"/><rect x="${x - 18}" y="${chainY - 34}" width="36" height="14" rx="7" fill="var(--neutral)"/>`).join('');
			const lockX = (gp[0] + gp[1]) / 2;
			for (let i = 0; i <= 16; i++) {
				const u = i / 16, x = gp[0] + 14 + (gp[1] - gp[0] - 28) * u, y = chainY + Math.sin(Math.PI * u) * 40;
				g += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${i % 2 ? 7 : 4}" ry="${i % 2 ? 4 : 7}" fill="none" stroke="${mix('neutral', 80, 'var(--ink)')}" stroke-width="3"/>`;
			}
			const lockY = chainY + 40;
			g += P(`M ${lockX - 15} ${lockY} V ${lockY - 16} a 15 15 0 0 1 30 0 V ${lockY}`, 'var(--red)', 7);
			g += `<rect x="${lockX - 28}" y="${lockY - 2}" width="56" height="46" rx="12" fill="var(--red)"/><circle cx="${lockX}" cy="${lockY + 17}" r="6" fill="#fff"/><rect x="${lockX - 2.5}" y="${lockY + 18}" width="5" height="14" rx="2" fill="#fff"/>`;
			// The sign: a post and a board with the date.
			const sx = 110;
			g += `<rect x="${sx - 7}" y="60" width="14" height="${dk - 60}" rx="5" fill="var(--neutral)"/>`;
			html += `<div class="hb-piers-tag t-${tg.tone ?? 'red'}" style="${at(sx - 110, 2, 260)};justify-content:center">${ic(tg.icon ?? 'calendar', 30)}${t('nolint', '', fmt(tg.text ?? ''))}</div>`;
			html += T('lbl', 0, wTop + 64, fmt(fr.title ?? '')) + (fr.sub ? T('hb-sub', 0, wTop + 96, fmt(fr.sub)) : '');
			// The new quay: a long quay at the back, its head coming forward on the right; bollards on its edge.
			g += `<path d="M ${qx} ${qTop} H ${R} V ${H} H ${bx} V ${wTop + 6} H ${qx} Z" fill="url(#hb-piers-quay)"/>`;
			g += `<rect x="${qx}" y="${qTop}" width="${R - qx}" height="16" fill="${mix('blue', 28)}"/>`;
			g += P(`M ${qx} ${qTop} H ${R} M ${bx} ${qTop + 16} V ${H - 60}`, 'var(--blue)', SW);
			for (let y = 360; y < H - 100; y += 120) {
				g += `<rect x="${bx - 10}" y="${y}" width="20" height="56" rx="8" fill="var(--ink)"/>`;
			}
			html += `<div class="hb-tx t-blue" style="${at(bx + 36, qTop + 44)}">${t('lbl', '', fmt(to.title ?? ''))}${to.sub ? t('hb-sub', 'margin-top:6px', fmt(to.sub)) : ''}</div>`;
			// Ships.
			const ships = (s.ships ?? []).slice(0, 6), moved = ships.filter(x => x.moved).slice(0, 3), there = ships.filter(x => !x.moved).slice(0, 2);
			// Already there: moored at the back quay, muted, named over them.
			const mw = 226, mDeck = 334, mg = 44;
			there.forEach((sh, i) => {
				const x = 1034 + i * (mw + mg);
				g += bollard(x - mg / 2, qTop) + bollard(x + mw + mg / 2, qTop);
				g += P(`M ${x + 3} ${mDeck - 1} L ${x - mg / 2} ${qTop - 18} M ${x + mw - 3} ${mDeck - 1} L ${x + mw + mg / 2} ${qTop - 18}`, 'var(--neutral)', 3);
				const f = freighter(x, mDeck, mw, 'neutral', { op: 0.6, load: [2, 3, 3, 2, 3, 3] });
				g += f.svg + patch(x - 12, x + mw + 12, mDeck + f.hd * 0.62);
				html += T('hb-name hb-cx hb-piers-mute nolint', x + mw / 2, 140, fmt(sh.title ?? ''));
				if (sh.sub) {
					html += T('hb-sub hb-cx hb-piers-mute', x + mw / 2, 176, fmt(sh.sub));
				}
			});
			// Moved: sailing in from the old pier, the first one arriving. Routes fan out from the pier, nested.
			const lane = [[1224, 604, 300], [880, 514, 280], [560, 424, 240]];
			const o0 = [[292, wTop + 20], [340, wTop + 20], [390, wTop + 18]];
			const paths = [[[350, 480], [520, 620], [800, 676]], [[400, 440], [540, 530], [690, 556]], [[430, 400]]];
			moved.forEach((sh, i) => {
				const [x, y, w] = lane[i], f = freighter(x, y, w, 'blue', { load: [3, 3, 2, 3, 3, 2, 3] }), wl = y + f.hd * 0.66;
				const tail = x - 110;
				g += P(smooth([o0[i], ...paths[i], [tail, wl + 4]]), mix('blue', 60), 5, ' stroke-dasharray="1 14"');
				g += f.svg + patch(x - 14, x + w + 16, wl) + wake(x, wl + 2, 110);
				g += P(`M ${r1(x + w + 2)} ${r1(wl + 1)} q 14 -12 30 -4`, mix('blue', 55), 4);
				g += tick(x + w - 40, f.cargoTop - 30, 24);
				const fy = y + (wl - y) / 2 - 12;
				html += t('hb-tx hb-cx hb-piers-hull nolint', at(x + w * 0.5, fy), fmt(sh.title ?? '')).replace('data-t', 'data-t data-on="#0078d4"');
			});
			return heading(s) + body(`<div class="hb-piers" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A ship's manifest on a clipboard, with one round rubber stamp per step (numbered, in reading order, each a little
	 * crooked), between the container that goes in and the one that comes out cleared. Fields: eyebrow, title,
	 * input: { title, sub }, sheet (small caps on the clipboard), stamps (6): [{ icon, title, tone }],
	 * output: { title, sub }. */
	'hb-stamps': {
		css: base('hb-stamps') + `
.hb-stamps .hb-stamps-st { position: absolute; width: 220px; height: 220px; }
.hb-stamps .hb-stamps-w { font-size: 21px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--fg); }
.hb-stamps .hb-stamps-no { position: absolute; width: 44px; height: 44px; border-radius: 50%; background: var(--fg); color: #fff; display: grid; place-items: center; font-size: 22px; font-weight: 700; }
`,
		render(s) {
			const H = bodyHeight(s);
			const px0 = 420, px1 = 1310, py0 = 30, py1 = H - 8;
			let g = '';
			// Clipboard.
			g += `<rect x="${px0}" y="${py0}" width="${px1 - px0}" height="${py1 - py0}" rx="20" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			const cx = (px0 + px1) / 2;
			g += `<rect x="${cx - 110}" y="${py0 - 24}" width="220" height="52" rx="14" fill="var(--ink)"/><circle cx="${cx}" cy="${py0 - 4}" r="9" fill="#fff"/>`;
			for (let y = 108; y < py1 - 20; y += 44) {
				g += P(`M ${px0 + 40} ${y} H ${px1 - 40}`, 'var(--line)', 3);
			}
			// The stamps: 3 x 2.
			const stamps = (s.stamps ?? []).slice(0, 6);
			const cols = 3, colX = k => px0 + ((px1 - px0) * (2 * k + 1)) / (2 * cols), rowY = [218, 476];
			let html = T('lbl hb-cx', cx, py0 + 40, fmt(s.sheet ?? ''));
			stamps.forEach((st, i) => {
				const c = i % cols, r = Math.floor(i / cols), x = colX(c), y = rowY[r], tone = st.tone ?? 'blue';
				const rot = r1(wob(i, 2) * 9);
				const R = 104;
				const svg = `<svg width="220" height="220" viewBox="0 0 220 220" style="position:absolute;left:0;top:0"><circle cx="110" cy="110" r="${R}" fill="${mix(tone, 10)}" stroke="var(--${tone})" stroke-width="${SW + 2}"/><circle cx="110" cy="110" r="${R - 16}" fill="none" stroke="var(--${tone})" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/></svg>`;
				html += `<div class="hb-stamps-st t-${tone}" style="${at(x - 110, y - 110)};transform:rotate(${rot}deg)">${svg}${I(st.icon ?? 'checkmark', 110, 86, 64, `var(--${tone})`)}${t('hb-tx hb-cx hb-stamps-w nolint', at(110, 130), fmt(st.title ?? ''))}</div>`;
				html += `<div class="hb-stamps-no t-${tone}" style="${at(x - 104, y - 108)}" data-t>${i + 1}</div>`;
			});
			// Dotted path through the stamps in order.
			const pts = stamps.map((_, i) => [colX(i % cols), rowY[Math.floor(i / cols)]]);
			for (let i = 0; i < pts.length - 1; i++) {
				const [a, b] = [pts[i], pts[i + 1]];
				if (a[1] === b[1]) {
					g += P(`M ${a[0] + 118} ${a[1]} H ${b[0] - 118}`, 'var(--faint)', 4, ' stroke-dasharray="2 10"');
				} else {
					g += P(`M ${a[0]} ${a[1] + 118} C ${a[0]} ${a[1] + 150}, ${b[0]} ${b[1] - 160}, ${b[0] + 40} ${b[1] - 112}`, 'var(--faint)', 4, ' stroke-dasharray="2 10"');
				}
			}
			// In and out containers.
			const cy = 300, cw = 300, ch = 150;
			g += crate(0, cy - ch / 2, cw, ch, 'neutral', { pct: 10 });
			g += P(`M ${cw + 22} ${cy} H ${px0 - 30}`, 'var(--ink)', SW) + P(`M ${px0 - 46} ${cy - 16} L ${px0 - 30} ${cy} L ${px0 - 46} ${cy + 16}`, 'var(--ink)', SW);
			const ox = W - cw;
			g += P(`M ${px1 + 30} ${cy} H ${ox - 22}`, 'var(--ink)', SW) + P(`M ${ox - 38} ${cy - 16} L ${ox - 22} ${cy} L ${ox - 38} ${cy + 16}`, 'var(--ink)', SW);
			g += crate(ox, cy - ch / 2, cw, ch, 'green', { pct: 16 });
			g += `<circle cx="${ox + cw - 14}" cy="${cy - ch / 2 + 6}" r="34" fill="var(--green)"/>`;
			html += I('checkmark', ox + cw - 14, cy - ch / 2 + 6, 40, '#fff');
			const inp = s.input ?? {}, out = s.output ?? {};
			html += T('hb-name nolint hb-cx', cw / 2, cy + ch / 2 + 26, fmt(inp.title ?? '')) + (inp.sub ? T('hb-sub hb-cx', cw / 2, cy + ch / 2 + 64, fmt(inp.sub)) : '');
			html += T('hb-name nolint hb-cx', ox + cw / 2, cy + ch / 2 + 26, fmt(out.title ?? '')) + (out.sub ? T('hb-sub hb-cx', ox + cw / 2, cy + ch / 2 + 64, fmt(out.sub)) : '');
			return heading(s) + body(`<div class="hb-stamps" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** One dial per item, each with two needles on the same scale: the old one (grey, hollow tip) and the new one (in the
	 * tone): when they score the same, the needles all but cover each other. The two values sit under the hub, the note
	 * under them. Fields: eyebrow, title, legend: { old, new }, items (1–3): [{ title, old, new, max, note }], tone
	 * (default 'blue'), verdict: { icon, text } (a line under all dials). */
	'hb-gauges': {
		css: base('hb-gauges') + `
.hb-gauges .hb-gauges-v { display: flex; align-items: baseline; gap: 26px; }
.hb-gauges .hb-gauges-old { color: var(--muted); }
.hb-gauges .hb-gauges-verdict { position: absolute; display: flex; white-space: nowrap; width: max-content; align-items: center; gap: 14px; color: var(--green); font-size: 28px; font-weight: 600; }
.hb-gauges .hb-gauges-key { position: absolute; display: flex; align-items: center; gap: 12px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 3), n = items.length || 1, colW = W / n, tone = s.tone ?? 'blue';
			const R = 236, cyD = 350;
			let g = '', html = '';
			const pt = (cx, a, r) => [cx + r * Math.cos(a), cyD - r * Math.sin(a)];
			items.forEach((it, i) => {
				const cx = colW * i + colW / 2, max = it.max ?? 100;
				// Face: a half disc with a tinted rim, ticks every tenth.
				g += `<path d="M ${cx - R} ${cyD} A ${R} ${R} 0 0 1 ${cx + R} ${cyD} Z" fill="${mix(tone, 5)}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				for (let k = 0; k <= 10; k++) {
					const a = Math.PI * (1 - k / 10), [x1, y1] = pt(cx, a, R - 14), [x2, y2] = pt(cx, a, R - (k % 5 ? 34 : 50));
					g += P(`M ${r1(x1)} ${r1(y1)} L ${r1(x2)} ${r1(y2)}`, k % 5 ? 'var(--faint)' : 'var(--neutral)', k % 5 ? 3 : 4);
				}
				// Where the new value lands: a tinted arc on the rim.
				const an = Math.PI * (1 - Number(String(it.new).replace(/,/g, '')) / max), ao = Math.PI * (1 - Number(String(it.old).replace(/,/g, '')) / max);
				const [ax, ay] = pt(cx, an, R - 14);
				g += P(`M ${cx - R + 14} ${cyD} A ${R - 14} ${R - 14} 0 0 1 ${r1(ax)} ${r1(ay)}`, mix(tone, 30), 12, ' stroke-linecap="butt"');
				// Needles: old (grey, hollow tip), new (tone).
				const [ox, oy] = pt(cx, ao, R - 46), [nx, ny] = pt(cx, an, R - 46);
				g += P(`M ${cx} ${cyD} L ${r1(ox)} ${r1(oy)}`, 'var(--neutral)', 6) + `<circle cx="${r1(ox)}" cy="${r1(oy)}" r="11" fill="#fff" stroke="var(--neutral)" stroke-width="4"/>`;
				g += P(`M ${cx} ${cyD} L ${r1(nx)} ${r1(ny)}`, `var(--${tone})`, 9) + `<circle cx="${r1(nx)}" cy="${r1(ny)}" r="10" fill="var(--${tone})"/>`;
				g += `<circle cx="${cx}" cy="${cyD}" r="20" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
				html += T('hb-name hb-cx nolint', cx, cyD - R - 70, fmt(it.title ?? ''));
				html += `<div class="hb-tx hb-cx hb-gauges-v" style="${at(cx, cyD + 44)}">${t('hb-big hb-gauges-old nolint', '', fmt(String(it.old)))}${t(`hb-big nolint t-${tone}`, '', fmt(String(it.new)))}</div>`;
				if (it.note) {
					html += T('hb-sub hb-cx', cx, cyD + 138, fmt(it.note));
				}
			});
			// Legend, top left: the two needles.
			const lg = s.legend ?? {};
			if (lg.old || lg.new) {
				html += `<div class="hb-gauges-key" style="${at(0, H - 74)}"><svg width="40" height="24" viewBox="0 0 40 24">${P('M 4 12 H 26', 'var(--neutral)', 6)}<circle cx="28" cy="12" r="8" fill="#fff" stroke="var(--neutral)" stroke-width="4"/></svg>${t('lbl', '', fmt(lg.old ?? ''))}<svg width="40" height="24" viewBox="0 0 40 24" style="margin-left:20px">${P('M 4 12 H 26', `var(--${tone})`, 8)}<circle cx="28" cy="12" r="8" fill="var(--${tone})"/></svg>${t(`lbl t-${tone}`, '', fmt(lg.new ?? ''))}</div>`;
			}
			if (s.verdict) {
				html += `<div class="hb-gauges-verdict hb-rx" style="${at(W, H - 80)}">${ic(s.verdict.icon ?? 'checkCircle', 34)}${t('', '', fmt(s.verdict.text ?? ''))}</div>`;
			}
			return heading(s) + body(`<div class="hb-gauges" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A lighthouse on its rock at the left: a tapered, striped tower with a door and windows, a gallery with a railing,
	 * a lantern room with a glowing lamp and a domed cap. Its beam starts at the lamp and sweeps right across the water as
	 * a flat cone; in it, one hazard rock per problem found, each lit on the side facing the light, with a danger buoy
	 * beside it and, above it, an icon, a name, a short line (and a before -> after number). A calm note under the water.
	 * Fields: eyebrow, title, kicker (the note), rocks (3–4): [{ icon, title, sub, from, to, tone }]. */
	'hb-light': {
		css: base('hb-light') + `
.hb-light .hb-light-card { position: absolute; white-space: nowrap; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.hb-light .hb-light-ic { width: 80px; height: 80px; border-radius: 50%; background: #fff; color: var(--fg); border: ${SW}px solid var(--fg); box-sizing: border-box; display: grid; place-items: center; margin-bottom: 6px; }
.hb-light .hb-light-ft { display: flex; align-items: baseline; gap: 10px; margin-top: 2px; }
.hb-light .hb-light-from { font-size: 32px; font-weight: 700; color: var(--muted); }
.hb-light .hb-light-to { font-size: 50px; font-weight: 700; letter-spacing: -.03em; color: var(--green); line-height: 1; }
.hb-light .hb-light-arrow { font-size: 30px; color: var(--muted); }
.hb-light .hb-light-note { position: absolute; display: flex; align-items: center; gap: 12px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const wTop = 486, lx = 150, lampY = 176;
			let g = seaDef('hb-light-sea', wTop, H), html = '';
			// The beam: a wide cone from the lamp down to the water, a brighter core inside it, a short stub behind.
			g += `<path d="M ${lx} ${lampY} L ${W + 96} 40 L ${W + 96} ${wTop + 20} L 400 ${wTop + 20} Z" fill="${mix('yellow', 18)}"/>`;
			g += `<path d="M ${lx} ${lampY} L ${W + 96} 170 L ${W + 96} ${wTop + 20} L 760 ${wTop + 20} Z" fill="${mix('yellow', 26)}"/>`;
			g += `<path d="M ${lx} ${lampY} L -96 ${lampY - 46} L -96 ${lampY + 40} Z" fill="${mix('yellow', 20)}"/>`;
			// Under the water line everything fades: an overlay of sea, see-through at the top, white at the bottom.
			const fade = `<linearGradient id="hb-light-fade" gradientUnits="userSpaceOnUse" x1="0" y1="${wTop}" x2="0" y2="${H}"><stop offset="0" stop-color="${mix('blue', 12)}" stop-opacity=".6"/><stop offset=".4" stop-color="${mix('blue', 9)}" stop-opacity=".97"/><stop offset="1" stop-color="#fff"/></linearGradient>`;
			g += `<defs>${fade}</defs>`;
			// The rocks: jagged, the side facing the light lit, the part under water shaded.
			const rocks = (s.rocks ?? []).slice(0, 4);
			const x0 = 400, step = (W - x0) / (rocks.length || 1);
			let rk = '', buoys = '';
			rocks.forEach((it, i) => {
				const cx = x0 + step * i + step / 2 - 50, tone = it.tone ?? 'red', rw = 200 + wob(i) * 24, peak = wTop - 62 - Math.abs(wob(i, 3)) * 18, foot = wTop + 170;
				const pts = [[-0.62, foot], [-0.46, wTop + 20], [-0.36, peak + 40], [-0.22, peak + 22], [-0.08, peak], [0.06, peak + 18], [0.18, peak + 8], [0.32, peak + 44], [0.44, wTop + 14], [0.6, foot]];
				const inner = k => k > 1 && k < pts.length - 2;
				const xy = pts.map(([u, y], k) => [cx + u * rw + (inner(k) ? wob(i * 10 + k) * 12 : 0), y + (inner(k) ? wob(i * 7 + k, 3) * 12 : 0)]);
				const d = 'M ' + xy.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L ') + ' Z';
				rk += `<path d="${d}" fill="${mix('neutral', 30)}"/>` + P('M ' + xy.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L '), 'var(--neutral)', SW);
				// The lit face: from the left foot over the first peaks, back down a crease.
				const lit = 'M ' + [xy[1], xy[2], xy[3], xy[4], [cx - 0.02 * rw, peak + 60], [cx - 0.2 * rw, wTop + 30]].map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L ') + ' Z';
				rk += `<path d="${lit}" fill="${mix('yellow', 55)}" stroke="var(--neutral)" stroke-width="3" stroke-linejoin="round"/>`;
				// A danger buoy beside the rock: a striped can, a pole with two balls on top, a light.
				const bx = cx + rw / 2 + 56, by = wTop + 18;
				buoys += `<path d="M ${r1(bx - 22)} ${by} L ${r1(bx - 15)} ${by - 52} H ${r1(bx + 15)} L ${r1(bx + 22)} ${by} Z" fill="#fff" stroke="var(--${tone})" stroke-width="${SW}" stroke-linejoin="round"/>`;
				buoys += `<path d="M ${r1(bx - 18.5)} ${by - 26} L ${r1(bx - 15)} ${by - 52} H ${r1(bx + 15)} L ${r1(bx + 18.5)} ${by - 26} Z" fill="var(--${tone})"/>`;
				buoys += P(`M ${r1(bx)} ${by - 54} V ${by - 86}`, 'var(--ink)', SW);
				buoys += `<circle cx="${r1(bx)}" cy="${by - 92}" r="8" fill="var(--ink)"/><circle cx="${r1(bx)}" cy="${by - 112}" r="8" fill="var(--ink)"/>`;
				buoys += `<rect x="${r1(bx - 24)}" y="${by - 4}" width="48" height="10" rx="5" fill="var(--${tone})"/>`;
				buoys += P(wave(bx - 52, bx + 52, by + 18, 5, 26), mix('blue', 40), 3);
				html += `<div class="hb-light-card hb-cx t-${tone}" style="${at(cx + 56, 70)}"><span class="hb-light-ic">${ic(it.icon ?? 'bug', 42)}</span>${t('hb-name nolint', '', fmt(it.title ?? ''))}${it.sub ? t('hb-sub', '', fmt(it.sub)) : ''}${it.from ? `<div class="hb-light-ft">${t('hb-light-from nolint', '', fmt(it.from))}<span class="hb-light-arrow">\u2192</span>${t('hb-light-to nolint', '', fmt(it.to ?? ''))}</div>` : ''}</div>`;
			});
			// The water, the lighthouse's rock and the hazard rocks, the fade over their feet, then the buoys.
			const tb = wTop - 44, tt = 212, bw2 = 78, tw2 = 50;
			g += water(-120, W + 140, wTop, H, 7, 64, 'url(#hb-light-sea)');
			const isle = [[-96, wTop - 30], [-40, wTop - 52], [30, tb - 6], [96, tb - 16], [210, tb - 12], [262, tb + 10], [300, wTop - 10], [330, wTop + 30], [380, wTop + 170]];
			g += `<path d="M -96 ${wTop + 170} L ${isle.map(([x, y]) => `${x} ${y}`).join(' L ')} Z" fill="${mix('neutral', 30)}"/>`;
			g += P('M ' + isle.slice(0, -1).map(([x, y]) => `${x} ${y}`).join(' L '), 'var(--neutral)', SW);
			g += P(`M 262 ${tb + 10} L 236 ${tb + 30} L 252 ${wTop + 4}`, 'var(--neutral)', 3);
			g += rk + water(-120, W + 140, wTop + 6, H, 7, 64, 'url(#hb-light-fade)') + buoys;
			g += ripples([[40, H - 70, 120]], 'blue', 30);
			// The tower: tapered, three blue bands, a door and two windows.
			const tower = `M ${lx - bw2} ${tb} L ${lx - tw2} ${tt} H ${lx + tw2} L ${lx + bw2} ${tb} Z`;
			g += `<clipPath id="hb-light-tower"><path d="${tower}"/></clipPath>`;
			g += `<path d="${tower}" fill="#fff"/><g clip-path="url(#hb-light-tower)">${[tt + 34, tt + 98, tt + 162].map(y => `<rect x="${lx - 100}" y="${y}" width="200" height="30" fill="var(--blue)"/>`).join('')}</g>`;
			g += `<path d="${tower}" fill="none" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += `<path d="M ${lx - 18} ${tb} V ${tb - 30} a 18 18 0 0 1 36 0 V ${tb} Z" fill="${mix('blue', 20)}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += [[lx, tt + 81], [lx, tt + 145]].map(([x, y]) => `<rect x="${x - 10}" y="${y - 12}" width="20" height="24" rx="9" fill="${mix('yellow', 70)}" stroke="var(--ink)" stroke-width="3"/>`).join('');
			// The gallery: a slab with a railing.
			const gy = tt - 4;
			g += `<rect x="${lx - 80}" y="${gy - 12}" width="160" height="16" rx="6" fill="var(--ink)"/>`;
			g += P(`M ${lx - 72} ${gy - 12} V ${gy - 44} H ${lx + 72} V ${gy - 12} M ${lx - 72} ${gy - 28} H ${lx + 72}`, 'var(--ink)', 3) + [-36, 0, 36].map(d => P(`M ${lx + d} ${gy - 44} V ${gy - 12}`, 'var(--ink)', 3)).join('');
			// The lantern room: glass panes around a glowing lamp, then the dome with a vent ball.
			const lt = lampY - 40, lb = gy - 12;
			g += `<rect x="${lx - 42}" y="${lt}" width="84" height="${lb - lt}" rx="8" fill="${mix('yellow', 55)}" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<circle cx="${lx}" cy="${lampY}" r="20" fill="var(--yellow)" stroke="#fff" stroke-width="4"/>`;
			g += P(`M ${lx - 21} ${lt} V ${lb} M ${lx + 21} ${lt} V ${lb}`, 'var(--ink)', 3);
			g += `<rect x="${lx - 52}" y="${lt - 10}" width="104" height="12" rx="6" fill="var(--ink)"/>`;
			g += `<path d="M ${lx - 46} ${lt - 8} C ${lx - 46} ${lt - 52}, ${lx + 46} ${lt - 52}, ${lx + 46} ${lt - 8} Z" fill="var(--blue)" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += P(`M ${lx} ${lt - 42} V ${lt - 56}`, 'var(--ink)', SW) + `<circle cx="${lx}" cy="${lt - 62}" r="8" fill="var(--ink)"/>`;
			if (s.kicker) {
				html += `<div class="hb-light-note" style="${at(x0 + 10, H - 56)}">${ic('history', 30, 'var(--muted)')}${t('hb-sub', '', fmt(s.kicker))}</div>`;
			}
			return heading(s) + body(`<div class="hb-light" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Before and after, framed the same, split by a dashed line marked with the moment in between. Before: the crew
	 * works inside the container while the papers wait outside in an envelope closed with a wax seal and a lock,
	 * held by the keeper. After: the crew is done (faded), the envelope lies open with its flap folded back, the
	 * sheet slides out of it and along a dotted arc into the container, and a badge is stamped on the container.
	 * Fields: eyebrow, title, before: { label, text }, after: { label, text }, split (text on the dashed line),
	 * crew: { icon, tool, title }, keeper: { icon, title }, envelope (small caps over the envelope), grade: { icon, title }. */
	'hb-seal': {
		css: base('hb-seal') + `
.hb-seal .hb-seal-split { position: absolute; display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 20px; border-radius: 26px; background: var(--ink); color: #fff; font-size: 24px; font-weight: 600; transform: translateX(-50%); white-space: nowrap; }
.hb-seal .hb-seal-who { position: absolute; display: flex; align-items: center; gap: 10px; color: var(--fg); font-size: 24px; font-weight: 600; white-space: nowrap; }
.hb-seal .hb-seal-env { font-size: 16px; letter-spacing: .14em; }
`,
		render(s) {
			const H = bodyHeight(s);
			const mid = W / 2;
			let g = '', html = '';
			g += P(`M ${mid} 70 V ${H - 10}`, 'var(--ink)', SW, ' stroke-dasharray="4 14"');
			// The container, cut away: a tinted frame around a white inside.
			const box = (x, y, w, h, tone) => crate(x, y, w, h, tone, { pct: 8 }) + `<rect x="${x + 26}" y="${y + 22}" width="${w - 52}" height="${h - 44}" rx="12" fill="#fff" stroke="${mix(tone, 45)}" stroke-width="3"/>`;
			// A sheet: a white page with a checklist, turned by rot degrees around its centre.
			const sheet = (x, y, w, h, rot) => {
				let e = `<g transform="rotate(${rot} ${r1(x + w / 2)} ${r1(y + h / 2)})"><rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="10" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
				for (let k = 0; k < 4; k++) {
					const yy = y + 30 + k * ((h - 50) / 3.4);
					e += P(`M ${r1(x + 18)} ${r1(yy)} l 7 7 l 13 -14`, 'var(--green)', 4) + P(`M ${r1(x + 52)} ${r1(yy + 1)} H ${r1(x + w - 18 - (k % 2) * 22)}`, 'var(--line-strong)', 4);
				}
				return e + '</g>';
			};
			const ew = 220, eh = 146, ey = 250;
			/** The envelope, closed: the flap down to a wax seal. */
			const sealed = (x, y) => {
				let e = `<rect x="${x}" y="${y}" width="${ew}" height="${eh}" rx="14" fill="${mix('green', 14)}" stroke="var(--green)" stroke-width="${SW}"/>`;
				e += P(`M ${x + 8} ${y + eh - 8} L ${x + ew * 0.38} ${y + eh * 0.5} M ${x + ew - 8} ${y + eh - 8} L ${x + ew * 0.62} ${y + eh * 0.5}`, mix('green', 60), 3);
				e += `<path d="M ${x + 4} ${y + 6} L ${x + ew / 2} ${y + eh * 0.58} L ${x + ew - 4} ${y + 6}" fill="${mix('green', 26)}" stroke="var(--green)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				// The wax: a scalloped disc.
				const cx = x + ew / 2, cy = y + eh * 0.58, n = 10;
				let d = '';
				for (let k = 0; k <= n * 2; k++) {
					const a = (Math.PI * k) / n, r = k % 2 ? 31 : 37;
					d += `${k ? 'L' : 'M'} ${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))} `;
				}
				e += `<path d="${d}Z" fill="var(--green)" stroke="var(--green)" stroke-width="4" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="${mix('green', 55)}" stroke-width="3"/>`;
				return e;
			};
			/** The envelope, open: the flap folded back up showing its inside, the sheet half out of the pocket. */
			const opened = (x, y) => {
				let e = `<path d="M ${x + 4} ${y + 2} L ${x + ew * 0.56} ${y - eh * 0.72} L ${x + ew - 4} ${y + 2} Z" fill="${mix('green', 30)}" stroke="var(--green)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				e += `<rect x="${x}" y="${y}" width="${ew}" height="${eh}" rx="14" fill="${mix('green', 34)}" stroke="var(--green)" stroke-width="${SW}"/>`;
				e += sheet(x + 30, y - 76, 116, 150, -12);
				e += `<path d="M ${x} ${y + 14} Q ${x} ${y} ${x + 14} ${y + 4} L ${x + ew / 2} ${y + eh * 0.5} L ${x + ew - 14} ${y + 4} Q ${x + ew} ${y} ${x + ew} ${y + 14} V ${y + eh - 14} Q ${x + ew} ${y + eh} ${x + ew - 14} ${y + eh} H ${x + 14} Q ${x} ${y + eh} ${x} ${y + eh - 14} Z" fill="${mix('green', 14)}" stroke="var(--green)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				e += P(`M ${x + 8} ${y + eh - 8} L ${x + ew * 0.38} ${y + eh * 0.6} M ${x + ew - 8} ${y + eh - 8} L ${x + ew * 0.62} ${y + eh * 0.6}`, mix('green', 60), 3);
				return e;
			};
			const by = 170, bw = 420, bh = 260, ex = 590;
			const ag = s.crew ?? {}, gr = s.keeper ?? {};
			// Before (left): the crew at work; the papers sealed outside, out of its sight.
			const bx = 40;
			g += box(bx, by, bw, bh, 'purple');
			html += `<div class="hb-ic" style="${at(bx + bw / 2 - 60, by + 62, 120, 120)}">${ic(ag.icon ?? 'people', 120, 'var(--purple)')}</div>`;
			html += I(ag.tool ?? 'wrench', bx + bw / 2 + 96, by + 70, 52, 'var(--purple)');
			html += I('eyeOff', (bx + bw + ex) / 2, ey + eh / 2 - 10, 48, 'var(--red)');
			g += sealed(ex, ey);
			html += I('lockFilled', ex + ew / 2, ey + eh * 0.58, 30, '#fff');
			html += `<div class="hb-seal-who t-green hb-cx" style="${at(ex + ew / 2, ey + eh + 22)}">${ic(gr.icon ?? 'shieldLock', 30)}${t('nolint', '', fmt(gr.title ?? ''))}</div>`;
			html += `<div class="hb-seal-who t-purple hb-cx" style="${at(bx + bw / 2, by + bh + 22)}">${ic(ag.icon ?? 'people', 30)}${t('nolint', '', fmt(ag.title ?? ''))}</div>`;
			if (s.envelope) {
				html += T('lbl hb-seal-env t-green hb-cx', ex + ew / 2, ey - 44, fmt(s.envelope));
			}
			// After (right), framed the same: the crew done, the envelope open, the sheet carried into the container.
			const ax = mid + 40, ex2 = mid + ex;
			g += box(ax, by, bw, bh, 'green');
			html += `<div class="hb-ic" style="${at(ax + 70, by + 62, 120, 120)};opacity:.25">${ic(ag.icon ?? 'people', 120, 'var(--neutral)')}</div>`;
			g += opened(ex2, ey);
			g += sheet(ax + 228, by + 44, 132, 160, 4);
			// The dotted arc from the sheet in the envelope down into the container.
			const a0 = [ex2 + 44, ey - 104], a1 = [ax + 318, by + 30];
			g += P(`M ${a0[0]} ${a0[1]} C ${a0[0] - 30} ${a0[1] - 90}, ${a1[0] + 60} ${a1[1] - 140}, ${a1[0]} ${a1[1]}`, 'var(--green)', 5, ' stroke-dasharray="1 13"');
			g += P(`M ${a1[0] - 16} ${a1[1] - 20} L ${a1[0]} ${a1[1]} L ${a1[0] + 20} ${a1[1] - 12}`, 'var(--green)', 5);
			html += `<div class="hb-seal-who t-green hb-cx" style="${at(ex2 + ew / 2, ey + eh + 22)}">${ic(gr.icon ?? 'shieldLock', 30)}${t('nolint', '', fmt(gr.title ?? ''))}</div>`;
			// The grade: a badge stamped on the container's corner.
			const gx = ax + bw - 4, gy = by + bh - 4;
			g += `<circle cx="${gx}" cy="${gy}" r="62" fill="var(--green)" stroke="#fff" stroke-width="6"/><circle cx="${gx}" cy="${gy}" r="50" fill="none" stroke="${mix('green', 55)}" stroke-width="3"/>`;
			html += I(s.grade?.icon ?? 'checkmark', gx, gy, 64, '#fff');
			html += `<div class="hb-seal-who t-green hb-cx" style="${at(ax + bw / 2, by + bh + 22)}">${ic(s.grade?.icon ?? 'checkmark', 30)}${t('nolint', '', fmt(s.grade?.title ?? ''))}</div>`;
			// Captions under the two scenes.
			const bf = s.before ?? {}, af = s.after ?? {};
			html += T('lbl t-purple', 0, H - 100, fmt(bf.label ?? '')) + T('hb-name', 0, H - 66, fmt(bf.text ?? ''));
			html += T('lbl t-green', ax, H - 100, fmt(af.label ?? '')) + T('hb-name', ax, H - 66, fmt(af.text ?? ''));
			if (s.split) {
				html += `<div class="hb-seal-split" style="${at(mid, 0)}">${ic('flag', 26)}${t('', '', fmt(s.split))}</div>`;
			}
			return heading(s) + body(`<div class="hb-seal" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Big totals as rows of things you can count: one row per total, the number and its word on the left, the drawn
	 * things on the right (boats, containers or people), with what one of them stands for; the last thing is cut to the
	 * remainder. Fields: eyebrow, title, rows (2–3): [{ value, label, kind: 'boat' | 'box' | 'person', count (things,
	 * may be fractional), each (small caps: what one stands for), tone, hi }]. */
	'hb-yard': {
		css: base('hb-yard') + `
.hb-yard .hb-yard-lab { font-size: 26px; color: var(--body); margin-top: 6px; }
.hb-yard .hb-yard-each { font-size: 15px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const rows = (s.rows ?? []).slice(0, 3), x0 = 470, xr = W;
			const tops = [0, 210, 520], hs = [150, 270, 150];
			let g = '', html = '';
			rows.forEach((r, k) => {
				const tone = r.tone ?? 'blue', y0 = tops[k] ?? k * 230, h = hs[k] ?? 160, cnt = r.count ?? 0, full = Math.floor(cnt), frac = cnt - full, total = Math.ceil(cnt);
				const fill = r.hi ? `var(--${tone})` : mix(tone, 60);
				html += `<div class="hb-tx t-${tone}" style="${at(0, y0 + h / 2 - 66)}">${t('hb-big nolint', '', fmt(r.value ?? ''))}${t('hb-yard-lab', '', fmt(r.label ?? ''))}</div>`;
				if (k) {
					g += P(`M 0 ${y0 - 26} H ${W}`, 'var(--line)', 2);
				}
				let ex = x0, ey = y0 + h;
				if (r.kind === 'box') {
					const cols = Math.ceil(total / 4), pw = Math.min(54, (xr - x0) / cols), bw = pw - 6, bh = bw * 0.48, ph = bh + 8;
					const yb = y0 + h / 2 + (4 * ph) / 2 - 18;
					for (let i = 0; i < total; i++) {
						const c = Math.floor(i / 4), rr = i % 4, last = i === total - 1 && frac > 0;
						const x = x0 + c * pw, y = yb - rr * ph - bh;
						if (last) {
							g += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(bw)}" height="${r1(bh)}" rx="4" fill="none" stroke="${mix(tone, 50)}" stroke-width="2.5" stroke-dasharray="4 4"/>`;
							g += crate(x, y, bw * frac, bh, tone, { fill, rib: mix(tone, 30) });
						} else {
							g += crate(x, y, bw, bh, tone, { fill, rib: mix(tone, r.hi ? 55 : 30) });
						}
						ex = Math.max(ex, x + pw);
					}
					ey = yb + 30;
					g += P(`M ${x0 - 10} ${yb + 6} H ${x0 + cols * pw}`, 'var(--ink)', SW);
				} else if (r.kind === 'person') {
					const pw = Math.min(38, (xr - x0) / total), base = y0 + h / 2 + 34;
					for (let i = 0; i < total; i++) {
						g += person(x0 + i * pw + pw / 2, base, pw * 0.98, `var(--${tone})`);
					}
					ex = x0 + total * pw;
					ey = base + 30;
					g += P(`M ${x0 - 10} ${base + 2} H ${ex + 10}`, 'var(--ink)', SW);
				} else {
					const per = Math.ceil(total / 2), pw = Math.min(84, (xr - x0) / per), sw = pw - 14, base = y0 + 52;
					for (const rr of [0, 1]) {
						g += P(wave(x0 - 10, x0 + per * pw, base + rr * 62 + 14, 4, 32), mix('blue', 40), 3);
					}
					for (let i = 0; i < total; i++) {
						const last = i === total - 1 && frac > 0;
						const x = x0 + (i % per) * pw, base2 = base + Math.floor(i / per) * 62;
						if (last) {
							g += `<clipPath id="hb-yard-cut-${k}"><rect x="${r1(x - 4)}" y="${base2 - 60}" width="${r1(sw * frac + 4)}" height="80"/></clipPath><g clip-path="url(#hb-yard-cut-${k})">${ship(x, base2, sw, tone, { cargo: tone, solid: true, sw: 3 })}</g>`;
							g += P(`M ${r1(x + sw * frac + 6)} ${base2 - 30} V ${base2 + 12}`, mix(tone, 50), 3, ' stroke-dasharray="4 6"');
						} else {
							g += ship(x, base2, sw, tone, { cargo: tone, solid: true, sw: 3 });
						}
					}
					ex = x0 + per * pw;
					ey = base + 62 + 36;
				}
				if (r.each) {
					html += T(`lbl hb-yard-each t-${tone}`, x0, Math.min(ey, y0 + h + 4), fmt(r.each));
				}
			});
			return heading(s) + body(`<div class="hb-yard" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** One lane per item: a boat heads right, and behind it trails a wake of dots, one dot per unit. The lanes marked hi
	 * are in their tone at full strength, the rest muted grey; the value sits ahead of each boat. Fields: eyebrow,
	 * title, per (what one dot stands for, e.g. 10), unit (small caps legend, e.g. '1 dot = 10 calls'),
	 * lanes (2–5): [{ title, value, dots, tone, hi }], note: { icon, text } (one calm line under the lanes). */
	'hb-wakes': {
		css: base('hb-wakes') + `
.hb-wakes .hb-wakes-mute { color: var(--muted); font-weight: 400; font-size: 26px; }
.hb-wakes .hb-wakes-v { font-size: 64px; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: var(--fg); font-variant-numeric: tabular-nums; }
.hb-wakes .hb-wakes-v.hb-wakes-mute { font-size: 40px; font-weight: 700; }
.hb-wakes .hb-wakes-note { position: absolute; display: flex; align-items: center; gap: 12px; color: var(--body); font-size: 24px; white-space: nowrap; }
.hb-wakes .hb-wakes-key { position: absolute; display: flex; align-items: center; gap: 10px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const lanes = (s.lanes ?? []).slice(0, 5), xs = 340, top = 74, laneH = Math.min(150, (H - top - (s.note ? 80 : 0)) / (lanes.length || 1));
			const pitch = 18, rowsPer = 4, r = 6;
			let g = '', html = '';
			lanes.forEach((ln, i) => {
				const cy = top + laneH * i + laneH / 2, tone = ln.hi ? (ln.tone ?? 'purple') : 'neutral';
				const dots = ln.dots ?? 0, cols = Math.ceil(dots / rowsPer);
				// Water lane.
				g += `<rect x="${xs - 20}" y="${r1(cy - laneH / 2 + 12)}" width="${W - xs + 20}" height="${r1(laneH - 24)}" rx="20" fill="${mix('blue', ln.hi ? 8 : 4)}"/>`;
				// The wake: columns of dots, the oldest (left) a little more spread out.
				for (let d = 0; d < dots; d++) {
					const c = Math.floor(d / rowsPer), rr = d % rowsPer, back = cols - 1 - c;
					const spread = 1 + back * 0.004;
					const x = xs + c * pitch + pitch / 2, y = cy + 4 + (rr - (rowsPer - 1) / 2) * 15 * spread + wob(d, 2) * 1.2;
					g += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${ln.hi ? `var(--${tone})` : mix('neutral', 45)}"/>`;
				}
				const bx = xs + cols * pitch + 14, bw = 120;
				g += ship(bx, cy + 8, bw, tone, { cargo: tone, solid: !!ln.hi, sw: 3, op: ln.hi ? null : 0.6 });
				html += T(`hb-name hb-rx nolint${ln.hi ? '' : ' hb-wakes-mute'}`, xs - 40, cy - (ln.hi ? 17 : 16), fmt(ln.title ?? ''));
				html += T(`hb-wakes-v nolint t-${tone}${ln.hi ? '' : ' hb-wakes-mute'}`, bx + bw + 26, cy - (ln.hi ? 30 : 20), fmt(ln.value ?? ''));
			});
			if (s.unit) {
				html += `<div class="hb-wakes-key" style="${at(xs, 8)}"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="${r}" fill="var(--neutral)"/></svg>${t('lbl', '', fmt(s.unit))}</div>`;
			}
			if (s.note) {
				html += `<div class="hb-wakes-note" style="${at(xs, H - 44)}">${ic(s.note.icon ?? 'info', 28, 'var(--muted)')}${t('', '', fmt(s.note.text ?? ''))}</div>`;
			}
			return heading(s) + body(`<div class="hb-wakes" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** An incident told along one stretch of water over a date line. A storm: a container ship (the cover's) heels in
	 * big waves under a cloud with lightning and drops red boxes into the sea (the loss, big). A signal buoy with a
	 * magnifier: the moment it was picked up. The same ship upright, moored at a quay with its new sign (the fix).
	 * Then calm water with one green buoy per clean crossing since (the count big). Fields: eyebrow, title, who (small caps,
	 * top left), loss: { value, text, date }, found: { icon, text, sub, date }, fix: { pier (the quay's sign), text, date },
	 * after: { value, text, count, date }. */
	'hb-storm': {
		css: base('hb-storm') + `
.hb-storm .hb-storm-date { font-size: 22px; font-weight: 700; color: var(--fg); }
.hb-storm .hb-storm-box { display: flex; flex-direction: column; gap: 6px; }
.hb-storm .hb-storm-tx { font-size: 25px; color: var(--ink); line-height: 1.25; }
.hb-storm .hb-storm-sign { position: absolute; display: grid; place-items: center; height: 42px; padding: 0 16px; border-radius: 12px; border: ${SW}px solid var(--blue); background: ${mix('blue', 12)}; box-sizing: border-box; transform: translateX(-50%); }
.hb-storm .hb-storm-sign div { font-size: 15px; color: var(--blue); }
`,
		render(s) {
			const H = bodyHeight(s);
			const axisY = H - 70, wTop = 462, xs = [0, 590, 820, 1300, W], seaB = axisY - 26;
			let g = seaDef('hb-storm-sea', wTop - 40, seaB + 20), html = '';
			const ls = s.loss ?? {}, fd = s.found ?? {}, fx2 = s.fix ?? {}, af = s.after ?? {};
			// The surface: big pointed waves in the storm, calming to flat on the right.
			const amp = x => x < 560 ? 24 : x < xs[2] ? 24 - (x - 560) / (xs[2] - 560) * 10 : x < xs[3] ? 14 - (x - xs[2]) / (xs[3] - xs[2]) * 8 : 6;
			const surf = (x0, x1, y, ampOf, lenOf) => {
				let d = `M ${r1(x0)} ${r1(y)}`, x = x0;
				while (x < x1) {
					const len = lenOf(x), a = ampOf(x);
					d += ` Q ${r1(x + len / 4)} ${r1(y - a)} ${r1(x + len / 2)} ${r1(y)} Q ${r1(x + len * 0.75)} ${r1(y + a)} ${r1(x + len)} ${r1(y)}`;
					x += len;
				}
				return { d, x };
			};
			const sf = surf(-96, W + 96, wTop, amp, x => x < xs[2] ? 120 : x < xs[3] ? 80 : 60);
			const seaPath = `<path d="${sf.d} L ${r1(sf.x)} ${seaB} L -96 ${seaB} Z" fill="url(#hb-storm-sea)"/>`;
			// In the storm: a tall swell behind the ship, a row of breaking waves in front of it.
			const taper = (x, a, x1) => x < x1 - 200 ? a : Math.max(0, a * (x1 - x) / 200);
			const bk = surf(-285, 680, wTop - 4, x => taper(x, 150, 680), () => 260);
			const swell = `<path d="${bk.d} L ${r1(bk.x)} ${wTop + 40} L -285 ${wTop + 40} Z" fill="${mix('blue', 22)}"/>` + P(bk.d, mix('blue', 45), SW);
			const sp = surf(-130, 640, wTop + 18, x => taper(x, 64, 640), () => 166);
			const stormPatch = `<path d="${sp.d} L ${r1(sp.x)} ${seaB} L -130 ${seaB} Z" fill="url(#hb-storm-sea)"/>` + P(sp.d, mix('blue', 50), SW);
			// The storm cloud, its rain and a bolt of lightning.
			const cl = [[296, 238, 40], [372, 206, 62], [452, 214, 54], [516, 244, 38]];
			for (let i = 0; i < 11; i++) {
				const x = 280 + i * 26 + wob(i) * 6, y = 300 + Math.abs(wob(i, 3)) * 26;
				g += P(`M ${r1(x)} ${r1(y)} l -12 30`, mix('neutral', 55), 4);
			}
			g += cl.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${mix('neutral', 42)}"/>`).join('') + `<rect x="256" y="240" width="300" height="46" rx="23" fill="${mix('neutral', 42)}"/>`;
			g += `<path d="M 410 276 L 380 340 H 404 L 384 398 L 446 322 H 418 L 440 276 Z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>`;
			// The ship in the storm, heeling bow-down in the waves; gaps in its load where boxes went over.
			const sw0 = 400, sx = 24, sd = wTop - 40;
			const lost = new Set(['4,2', '5,2', '6,2', '6,1', '5,1']);
			const st = freighter(sx, sd, sw0, 'blue', { load: [3, 3, 3, 3, 3, 3, 3], cargo: (c, r) => lost.has(`${c},${r}`) ? null : 'blue' });
			// The same ship at the quay, upright.
			const qx = 1140, qw = 150, qTop = wTop - 36, mw = 300, mx = qx - mw - 24, md = wTop - 22;
			const ms = freighter(mx, md, mw, 'blue', { load: [3, 3, 3, 3, 3, 3, 3] });
			g += swell + ms.svg + seaPath;
			g += `<g transform="rotate(8 ${sx + sw0 / 2} ${sd})">${st.svg}</g>` + stormPatch;
			// Boxes going over: tumbling in the air, splashing, floating.
			const over = [[470, 352, 28, 1], [530, 410, 62, 1], [456, 448, -16, 1], [530, 500, 14, 0.8], [400, 526, -28, 0.6]];
			over.forEach(([x, y, a, op]) => {
				g += `<g transform="rotate(${a} ${x + 30} ${y + 16})"${op < 1 ? ` opacity="${op}"` : ''}>${crate(x, y, 60, 32, 'red')}</g>`;
			});
			// Found: a signal buoy with a magnifier on its mast, sending out a signal.
			const fx = (xs[1] + xs[2]) / 2, fb = wTop + 8;
			g += `<path d="M ${fx - 30} ${fb} L ${fx - 20} ${fb - 54} H ${fx + 20} L ${fx + 30} ${fb} Z" fill="#fff" stroke="var(--orange)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += `<path d="M ${fx - 25.4} ${fb - 25} L ${fx - 20} ${fb - 54} H ${fx + 20} L ${fx + 25.4} ${fb - 25} Z" fill="var(--orange)"/>`;
			g += `<rect x="${fx - 34}" y="${fb - 4}" width="68" height="12" rx="6" fill="var(--orange)"/>`;
			g += P(`M ${fx} ${fb - 56} V ${fb - 116}`, 'var(--ink)', SW);
			const sy = fb - 156;
			g += `<circle cx="${fx}" cy="${sy}" r="42" fill="${mix('orange', 14)}" stroke="var(--orange)" stroke-width="${SW}"/>`;
			g += [1, -1].map(k => P(`M ${fx + k * 58} ${sy - 22} q ${k * 14} 22 0 44 M ${fx + k * 74} ${sy - 36} q ${k * 22} 36 0 72`, mix('orange', 60), 4)).join('');
			html += I(fd.icon ?? 'search', fx, sy, 46, 'var(--orange)');
			g += P(wave(fx - 60, fx + 60, fb + 16, 5, 30), mix('blue', 45), 3);
			// Fix: the quay, its bollard and the mooring lines; the new host's sign on a post.
			g += `<path d="M ${qx} ${seaB} V ${qTop} H ${qx + qw} V ${seaB} Z" fill="${mix('blue', 16)}"/>` + P(`M ${qx} ${seaB - 10} V ${qTop} H ${qx + qw} V ${seaB - 10}`, 'var(--blue)', SW);
			g += `<rect x="${qx}" y="${qTop}" width="${qw}" height="14" fill="${mix('blue', 30)}"/>`;
			g += bollard(qx + 26, qTop) + P(`M ${mx + mw - 4} ${md - 2} L ${qx + 26} ${qTop - 18} M ${mx + mw - 40} ${md - 2} L ${qx + 26} ${qTop - 18}`, 'var(--ink)', 3);
			g += `<rect x="${qx + qw / 2 + 6}" y="${qTop - 96}" width="10" height="96" rx="4" fill="var(--blue)"/>`;
			for (let y = qTop + 40; y < seaB - 30; y += 60) {
				g += `<rect x="${qx - 10}" y="${y}" width="20" height="40" rx="8" fill="var(--ink)"/>`;
			}
			if (fx2.pier) {
				html += `<div class="hb-storm-sign" style="${at(qx + qw / 2 + 11, qTop - 136)}">${t('lbl nolint', '', fmt(fx2.pier))}</div>`;
			}
			// After: calm water, one green buoy per clean crossing, in three rows (the far ones smaller).
			const buoys = af.count ?? 0, rows = 3, per = Math.ceil(buoys / rows), bx0 = xs[3] + 40, bp = Math.min(30, (W - bx0 - 20) / per);
			for (let i = 0; i < buoys; i++) {
				const c = i % per, rr = Math.floor(i / per), k = 0.8 + rr * 0.12;
				const x = bx0 + 10 + c * bp + (rr % 2 ? bp / 2 : 0), y = wTop + 26 + rr * 44;
				g += P(`M ${r1(x - 14 * k)} ${r1(y + 3)} h ${r1(28 * k)}`, mix('blue', 40), 3);
				g += `<path d="M ${r1(x - 12 * k)} ${r1(y)} a ${r1(12 * k)} ${r1(13 * k)} 0 0 1 ${r1(24 * k)} 0 Z" fill="var(--green)"/>` + `<rect x="${r1(x - 3 * k)}" y="${r1(y - 24 * k)}" width="${r1(6 * k)}" height="${r1(12 * k)}" rx="${r1(2 * k)}" fill="var(--green)"/>`;
			}
			// The date line.
			const tones = ['red', 'orange', 'blue', 'green'];
			const dates = [ls.date, fd.date, fx2.date, af.date];
			for (let i = 0; i < 4; i++) {
				g += P(`M ${xs[i] + (i ? 14 : 0)} ${axisY} H ${xs[i + 1] - 14}`, `var(--${tones[i]})`, 8);
				if (dates[i]) {
					html += T(`hb-storm-date nolint t-${tones[i]}`, xs[i] + (i ? 14 : 0), axisY + 18, fmt(dates[i]));
				}
			}
			// Texts above each part.
			html += `<div class="hb-tx hb-storm-box t-red" style="${at(0, 0)}">${t('hb-big nolint', '', fmt(ls.value ?? ''))}${t('hb-storm-tx', '', fmt(ls.text ?? ''))}</div>`;
			if (s.who) {
				html += T('lbl', 0, 132, fmt(s.who));
			}
			html += `<div class="hb-tx hb-storm-box hb-cx t-orange" style="${at(fx, 160)};align-items:center">${t('hb-storm-tx', '', fmt(fd.text ?? ''))}${fd.sub ? t('hb-sub', '', fmt(fd.sub)) : ''}</div>`;
			html += `<div class="hb-tx hb-storm-box hb-cx t-blue" style="${at((xs[2] + xs[3]) / 2, 160)};align-items:center">${t('hb-storm-tx', '', fmt(fx2.text ?? ''))}</div>`;
			html += `<div class="hb-tx hb-storm-box t-green" style="${at(bx0 + 6, 150)}">${t('hb-big nolint', '', fmt(af.value ?? ''))}${t('hb-storm-tx', '', fmt(af.text ?? ''))}</div>`;
			return heading(s) + body(`<div class="hb-storm" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A closing card: the statement big on the left (mark words with {{blue|...}}), the speaker under it; on the right a
	 * sea chart unrolled between two rollers: a coast, a dotted route from a harbour to the next one, and one small buoy
	 * per known hazard along the way, with a compass rose. Fields: text, speaker: { initials, name, role },
	 * chart: { label (small caps, top of the chart), hazards (count of buoys), legend (beside one buoy), from, to }. */
	'hb-chart': {
		bare: true,
		css: `
.hb-chart { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.hb-chart .hb-chart-left { position: absolute; left: 96px; top: 0; bottom: 0; width: 870px; display: flex; flex-direction: column; justify-content: center; }
.hb-chart .hb-chart-text { margin-bottom: 44px; font-size: 72px; font-weight: 600; letter-spacing: -.02em; line-height: 1.12; color: var(--ink); }
.hb-chart .hb-tx { position: absolute; white-space: nowrap; }
.hb-chart .hb-cx { transform: translateX(-50%); text-align: center; }
.hb-chart .hb-chart-key { position: absolute; display: flex; align-items: center; gap: 12px; }
.hb-chart .hb-chart-port { font-size: 22px; font-weight: 600; color: var(--ink); }
.hb-chart .lbl { color: var(--fg, var(--muted)); }
`,
		render(s) {
			const left = `<div class="hb-chart-left">${t('hb-chart-text', '', fmt(s.text ?? ''))}${speakerHtml(s.speaker)}</div>`;
			const c = s.chart ?? {};
			const x0 = 1010, x1 = 1830, y0 = 170, y1 = 900;
			let g = '', html = '';
			// The paper and its two rollers.
			g += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${mix('blue', 6)}" stroke="var(--ink)" stroke-width="${SW}"/>`;
			// Land: two coasts.
			g += `<path d="M ${x0} ${y1 - 250} C ${x0 + 120} ${y1 - 260}, ${x0 + 170} ${y1 - 150}, ${x0 + 300} ${y1 - 120} C ${x0 + 380} ${y1 - 100}, ${x0 + 420} ${y1 - 40}, ${x0 + 470} ${y1} L ${x0} ${y1} Z" fill="${mix('green', 16)}" stroke="var(--green)" stroke-width="3"/>`;
			g += `<path d="M ${x1} ${y0 + 280} C ${x1 - 120} ${y0 + 260}, ${x1 - 150} ${y0 + 170}, ${x1 - 260} ${y0 + 130} C ${x1 - 330} ${y0 + 100}, ${x1 - 360} ${y0 + 40}, ${x1 - 380} ${y0} L ${x1} ${y0} Z" fill="${mix('green', 16)}" stroke="var(--green)" stroke-width="3"/>`;
			// Depth contours.
			g += P(`M ${x0} ${y1 - 320} C ${x0 + 180} ${y1 - 330}, ${x0 + 260} ${y1 - 200}, ${x0 + 420} ${y1 - 170} C ${x0 + 500} ${y1 - 150}, ${x0 + 540} ${y1 - 60}, ${x0 + 580} ${y1}`, mix('blue', 30), 3, ' stroke-dasharray="10 10"');
			g += P(`M ${x1} ${y0 + 350} C ${x1 - 160} ${y0 + 330}, ${x1 - 220} ${y0 + 230}, ${x1 - 330} ${y0 + 190} C ${x1 - 420} ${y0 + 160}, ${x1 - 460} ${y0 + 60}, ${x1 - 480} ${y0}`, mix('blue', 30), 3, ' stroke-dasharray="10 10"');
			// The route, an S from the lower-left harbour to the upper-right one.
			const A = [x0 + 210, y1 - 300], B = [x1 - 290, y0 + 250];
			const c1 = [A[0] + 300, A[1] + 150], c2 = [B[0] - 300, B[1] - 150];
			const bez = tt => {
				const u = 1 - tt;
				return [0, 1].map(k => u * u * u * A[k] + 3 * u * u * tt * c1[k] + 3 * u * tt * tt * c2[k] + tt * tt * tt * B[k]);
			};
			g += P(`M ${A[0] + 40} ${A[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${B[0]} ${B[1]}`, 'var(--blue)', 6, ' stroke-dasharray="3 16"');
			// The buoys: one per known hazard, scattered near the route, never on land or under a label.
			const route = Array.from({ length: 80 }, (_, i) => bez(i / 79));
			const lerp = (pts, x) => {
				for (let i = 0; i < pts.length - 1; i++) {
					const [[ax, ay], [bx, by]] = [pts[i], pts[i + 1]];
					if ((x - ax) * (x - bx) <= 0) {
						return ay + ((by - ay) * (x - ax)) / (bx - ax || 1);
					}
				}
				return null;
			};
			const lowCoast = [[x0, y1 - 250], [x0 + 300, y1 - 120], [x0 + 470, y1]], highCoast = [[x1 - 380, y0], [x1 - 260, y0 + 130], [x1, y0 + 280]];
			const free = (x, y) => {
				const lo = lerp(lowCoast, x), hi = lerp(highCoast, x);
				if ((lo != null && y > lo - 26) || (hi != null && y < hi + 26)) {
					return false;
				}
				const blocked = [[x0, y0, x0 + 340, y0 + 120], [A[0] - 110, A[1] - 60, A[0] + 110, A[1] + 80], [B[0] - 110, B[1] - 50, B[0] + 110, B[1] + 90], [x1 - 190, y1 - 200, x1, y1]];
				return x > x0 + 24 && x < x1 - 24 && y > y0 + 40 && y < y1 - 40 && !blocked.some(([a, b, c, e]) => x > a && x < c && y > b && y < e);
			};
			const n = c.hazards ?? 0, buoys = [];
			let seed = 7;
			const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
			for (let tries = 0; buoys.length < n && tries < 20000; tries++) {
				const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
				const dr = Math.min(...route.map(([rx, ry]) => Math.hypot(rx - x, ry - y)));
				if (dr < 34 || dr > 170 || !free(x, y) || buoys.some(([bx, by]) => Math.hypot(bx - x, by - y) < 30)) {
					continue;
				}
				buoys.push([x, y]);
			}
			buoys.forEach(([bx, by], i) => {
				g += `<circle cx="${r1(bx)}" cy="${r1(by)}" r="9" fill="${i % 3 ? 'var(--orange)' : 'var(--red)'}" stroke="#fff" stroke-width="3"/>`;
			});
			// Harbours: the start (a ship) and the goal (a flag).
			g += ship(A[0] - 60, A[1] - 4, 120, 'blue', { cargo: 'blue', solid: true, sw: 3 });
			g += `<circle cx="${B[0]}" cy="${B[1]}" r="30" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
			html += `<div style="${at(B[0] - 18, B[1] - 18, 36, 36)};position:absolute;line-height:0">${ic('flag', 36, 'var(--blue)')}</div>`;
			// Compass rose.
			const rx = x1 - 110, ry = y1 - 120;
			g += `<circle cx="${rx}" cy="${ry}" r="58" fill="#fff" stroke="var(--ink)" stroke-width="3"/>`;
			g += `<path d="M ${rx} ${ry - 72} L ${rx + 14} ${ry} L ${rx} ${ry + 72} L ${rx - 14} ${ry} Z" fill="var(--ink)"/><path d="M ${rx - 72} ${ry} L ${rx} ${ry - 14} L ${rx + 72} ${ry} L ${rx} ${ry + 14} Z" fill="var(--neutral)"/><circle cx="${rx}" cy="${ry}" r="7" fill="#fff"/>`;
			// Rollers.
			for (const y of [y0, y1]) {
				g += `<rect x="${x0 - 26}" y="${y - 22}" width="${x1 - x0 + 52}" height="44" rx="22" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			}
			if (c.label) {
				html += T('lbl t-blue', x0 + 30, y0 + 40, fmt(c.label));
			}
			if (c.legend) {
				html += `<div class="hb-chart-key" style="${at(x0 + 30, y0 + 74)}"><svg width="44" height="20" viewBox="0 0 44 20"><circle cx="10" cy="10" r="8" fill="var(--red)"/><circle cx="32" cy="10" r="8" fill="var(--orange)"/></svg>${t('lbl t-orange', '', fmt(c.legend))}</div>`;
			}
			if (c.from) {
				html += T('hb-chart-port hb-cx nolint', A[0], A[1] + 36, fmt(c.from));
			}
			if (c.to) {
				html += T('hb-chart-port hb-cx nolint', B[0], B[1] + 42, fmt(c.to));
			}
			return `<div class="hb-chart">${layer(1080, g, 1920)}${left}${html}${msLogo()}</div>`;
		},
	},
};
