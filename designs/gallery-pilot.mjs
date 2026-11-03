// A gallery for inspiration (the bakery world): read it for technique: a door that closes on a timeline, shelves stocked
// before it shuts, three tries told click by click. A new deck draws its own pictures in designs/local-<deck>.mjs; do not
// reuse these as they are.
// The world: each order is a ticket on a rail, the oven (purple) does the work, the supplies come from a warehouse
// outside, the back door has a shutter that comes down at opening time, and the result is shown on a screen on the
// counter.
// The recurring object is the order ticket, drawn by one helper. Every visible word comes from the slide's fields.
// examples/first-order.mjs uses every design here (pl-*).
import { STYLE, W, asset, at, body, bodyHeight, esc, fmt, heading, ic, logo, mix, msLogo, pill, r1, t, wob } from '../src/kit.mjs';

const SW = STYLE.stroke;
const svgEl = (w, h, inner) => `<svg class="pl-svg" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;

/** CSS shared by every design of this deck, scoped to the design n. */
const base = n => `
.${n} { position: relative; width: 1728px; }
.${n} .pl-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .pl-obj { position: absolute; }
.${n} .pl-x { position: absolute; white-space: nowrap; }
.${n} .pl-head { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 600; color: var(--ink); }
.${n} .pl-clock { font-family: var(--mono); font-size: 20px; color: var(--muted); }
.${n} .pl-line { display: flex; align-items: center; gap: 12px; font-size: 26px; color: var(--ink); }
.${n} .pl-line.pl-mono { font-family: var(--mono); font-size: 23px; }
.${n} .pl-line.pl-dim { color: var(--muted); }
.${n} .pl-line.pl-bold { font-weight: 700; color: var(--fg); }
.${n} .pl-big { font-size: 104px; font-weight: 700; letter-spacing: -.045em; line-height: .9; color: var(--fg); }
.${n} .pl-unit { font-size: 40px; font-weight: 600; letter-spacing: -.01em; margin-left: 8px; }
.${n} .pl-stamp { border: 5px solid var(--fg); color: var(--fg); border-radius: 12px; padding: 4px 18px; font-size: 28px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; transform: rotate(-7deg); background: #fff; }
.${n} .pl-label { display: flex; align-items: center; gap: 12px; font-size: 26px; font-weight: 600; color: var(--ink); }
.${n} .pl-sub { font-size: 22px; color: var(--body); }
.${n} .pl-tag { display: flex; align-items: center; gap: 10px; padding: 8px 18px; border-radius: 12px; background: var(--tint); color: var(--fg); font-size: 24px; font-weight: 600; }
.${n} .pl-plate { display: flex; align-items: center; gap: 12px; padding: 10px 20px; border-radius: 12px; background: #fff; border: 3px solid var(--fg); color: var(--fg); font-size: 23px; font-weight: 600; }
.${n} .pl-img { position: absolute; object-fit: cover; border-radius: 4px; }
.${n} .pl-num { font-weight: 700; letter-spacing: -.03em; color: var(--fg); line-height: 1; }
`;

/** A text element at (x, y): align 'c' centres it on x, 'r' ends it at x. */
function tx(cls, x, y, html, o = {}) {
	const shift = o.align === 'c' ? ';transform:translateX(-50%)' : o.align === 'r' ? ';transform:translateX(-100%)' : o.align === 'cc' ? ';transform:translate(-50%,-50%)' : '';
	return t(`pl-x ${cls}${o.tone ? ` t-${o.tone}` : ''}`, `${at(x, y, o.w, o.h)}${shift}${o.style ?? ''}`, html, { nolint: !!o.nolint, fit: !!o.fit });
}

// ---------- the order ticket: the recurring object ----------

/** The paper: rounded top corners, a torn (zigzag) bottom edge. */
function paper(w, h, tooth = 22) {
	const n = Math.max(4, Math.round(w / tooth)), tw = w / n;
	let d = `M 0 12 Q 0 0 12 0 H ${r1(w - 12)} Q ${r1(w)} 0 ${r1(w)} 12 V ${r1(h)}`;
	for (let i = n - 1; i >= 0; i--) {
		d += ` L ${r1(i * tw + tw / 2)} ${r1(h - 11)} L ${r1(i * tw)} ${r1(h)}`;
	}
	return `<path d="${d} Z" fill="#fff" stroke="var(--line-strong)" stroke-width="3" stroke-linejoin="round"/>`;
}

/** An order ticket as a positioned block with its own coordinates. o: { x, y, w, h, head, logo or icon (optional),
 * time, headH, big: { value, unit, tone, y }, lines: [{ text, tone, icon, mono, bold, dim, hi }], lineY, pitch,
 * stamp: { text, tone, x, y }, clip (hangs from a rail), spike (skewered on a spike), key, hidden, dim }. */
function ticket(o) {
	const { w, h } = o, headH = o.headH ?? 66;
	let svg = paper(w, h);
	svg += `<line x1="18" y1="${headH}" x2="${w - 18}" y2="${headH}" stroke="var(--line-strong)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
	if (o.clip) {
		const c = w / 2;
		svg += `<path d="M ${r1(c - 30)} -24 H ${r1(c + 30)} L ${r1(c + 25)} 14 H ${r1(c - 25)} Z" fill="var(--line-strong)" stroke="var(--muted)" stroke-width="2.5" stroke-linejoin="round"/>`
			+ `<line x1="${r1(c - 22)}" y1="2" x2="${r1(c + 22)}" y2="2" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round"/><circle cx="${r1(c - 20)}" cy="-12" r="3" fill="var(--muted)"/><circle cx="${r1(c + 20)}" cy="-12" r="3" fill="var(--muted)"/>`;
	}
	let html = tx('pl-head', 20, 0, `${o.logo ? logo(o.logo, 30) : o.icon ? ic(o.icon, 28) : ''}<span>${fmt(o.head ?? '')}</span>`, { nolint: true, h: headH });
	if (o.time) {
		html += tx('pl-clock', w - 20, headH / 2 - 13, esc(o.time), { align: 'r', nolint: true });
	}
	const lines = o.lines ?? [];
	const pitch = o.pitch ?? 52;
	let y = o.lineY ?? headH + 22;
	if (o.big) {
		const by = o.big.y ?? headH + 34;
		html += tx('pl-big', 24, by, `${esc(o.big.value)}${o.big.unit ? `<span class="pl-unit">${esc(o.big.unit)}</span>` : ''}`, { tone: o.big.tone ?? 'blue' });
		y = o.lineY ?? by + 130;
	}
	lines.forEach((l, i) => {
		const ly = y + i * pitch;
		if (l.hi) {
			svg += `<rect x="10" y="${r1(ly - 7)}" width="${w - 20}" height="${pitch - 6}" rx="10" fill="${mix(l.tone ?? 'blue', 12)}"/>`;
		}
		const cls = `pl-line${l.mono ? ' pl-mono' : ''}${l.bold ? ' pl-bold' : ''}${l.dim ? ' pl-dim' : ''}`;
		html += tx(cls, 24, ly, `${l.icon ? ic(l.icon, 26) : ''}<span>${fmt(l.text)}</span>`, { tone: l.tone, nolint: !!l.nolint });
	});
	if (o.stamp) {
		html += tx('pl-stamp', o.stamp.x ?? w / 2, o.stamp.y ?? h - 120, fmt(o.stamp.text), { tone: o.stamp.tone ?? 'green', align: 'c', nolint: true });
	}
	const vis = o.hidden ? ';visibility:hidden' : '';
	return `<div class="pl-obj"${o.key ? ` data-key="${o.key}"` : ''} style="${at(o.x, o.y, w, h)}${vis}">${svgEl(w, h, svg)}${html}</div>`;
}

/** A small blank ticket (for counting): a tinted head, two grey lines, an optional icon. */
function miniTicket(x, y, w, h, tone, rot = 0) {
	const n = Math.max(3, Math.round(w / 16)), tw = w / n;
	let d = `M ${x} ${y + 6} Q ${x} ${y} ${x + 6} ${y} H ${x + w - 6} Q ${x + w} ${y} ${x + w} ${y + 6} V ${y + h}`;
	for (let i = n - 1; i >= 0; i--) {
		d += ` L ${r1(x + i * tw + tw / 2)} ${r1(y + h - 7)} L ${r1(x + i * tw)} ${y + h}`;
	}
	const cx = x + w / 2, cy = y + h / 2;
	return `<g transform="rotate(${r1(rot)} ${r1(cx)} ${r1(cy)})"><path d="${d} Z" fill="#fff" stroke="var(--line-strong)" stroke-width="2.5" stroke-linejoin="round"/>`
		+ `<rect x="${x + 8}" y="${y + 9}" width="${w - 16}" height="12" rx="4" fill="var(--${tone})"/>`
		+ `<rect x="${x + 8}" y="${y + 32}" width="${r1((w - 16) * 0.8)}" height="7" rx="3" fill="var(--line-strong)"/>`
		+ `<rect x="${x + 8}" y="${y + 48}" width="${r1((w - 16) * 0.55)}" height="7" rx="3" fill="var(--line-strong)"/></g>`;
}

/** A steel ticket rail: a tube with a highlight, held by a wall bracket at each end with two screws. */
function rail(x0, x1, y) {
	const bracket = x => `<rect x="${x - 11}" y="${y - 24}" width="22" height="48" rx="7" fill="var(--surface)" stroke="var(--faint)" stroke-width="3"/>`
		+ `<circle cx="${x}" cy="${y - 14}" r="3.5" fill="var(--faint)"/><circle cx="${x}" cy="${y + 14}" r="3.5" fill="var(--faint)"/>`;
	return `<rect x="${x0}" y="${y - 9}" width="${x1 - x0}" height="18" rx="9" fill="var(--track)" stroke="var(--faint)" stroke-width="3"/>`
		+ `<line x1="${x0 + 14}" y1="${y - 3}" x2="${x1 - 14}" y2="${y - 3}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`
		+ bracket(x0 + 11) + bracket(x1 - 11);
}

// ---------- the kitchen ----------

/** A crate from the supplier: three planks with gaps, a post at each side, nails where they cross, an
 * optional logo plate (HTML, returned too) and a check badge. */
function crate(x, y, w, h, o = {}) {
	const tone = o.tone ?? 'neutral';
	if (o.dashed) {
		return { svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${mix(tone, 4)}" stroke="${mix(tone, 45)}" stroke-width="3" stroke-dasharray="10 9"/>`, html: '' };
	}
	const edge = o.dim ? mix(tone, 30) : `var(--${tone})`;
	const post = Math.max(8, Math.round(w * 0.12)), gap = 4;
	let svg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${mix(tone, 7)}"/>`;
	// The gaps between the planks, then the two posts over them.
	[1, 2].forEach(k => { svg += `<rect x="${x + 2}" y="${r1(y + (k * h) / 3 - gap / 2)}" width="${w - 4}" height="${gap}" fill="${mix(tone, 38)}"/>`; });
	svg += `<rect x="${x + 4}" y="${y + 4}" width="${post}" height="${h - 8}" rx="2" fill="${mix(tone, 20)}"/><rect x="${x + w - 4 - post}" y="${y + 4}" width="${post}" height="${h - 8}" rx="2" fill="${mix(tone, 20)}"/>`;
	if (w >= 80) {
		[x + 4 + post / 2, x + w - 4 - post / 2].forEach(nx => [1, 3, 5].forEach(k => { svg += `<circle cx="${r1(nx)}" cy="${r1(y + (k * h) / 6)}" r="2.5" fill="${mix(tone, 65)}"/>`; }));
	}
	svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${edge}" stroke-width="${SW}"/>`;
	let html = '';
	if (o.logo) {
		const s = Math.min(48, Math.round(h * 0.44));
		svg += `<rect x="${r1(x + w / 2 - s / 2 - 9)}" y="${r1(y + h / 2 - s / 2 - 9)}" width="${s + 18}" height="${s + 18}" rx="9" fill="#fff" stroke="${mix(tone, 30)}" stroke-width="2"/>`;
		html += `<div class="pl-obj" style="${at(Math.round(x + w / 2 - s / 2), Math.round(y + h / 2 - s / 2), s, s)}">${logo(o.logo, s)}</div>`;
	}
	if (o.check) {
		svg += `<circle cx="${x + w - 17}" cy="${y + 17}" r="12" fill="var(--green)" stroke="#fff" stroke-width="3"/><path d="M ${x + w - 23} ${y + 17} l 4 4 l 8 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
	}
	return { svg, html };
}

/** A wall shelf: a slab with a front edge on two steel L-brackets, each with a brace and two screws. */
function shelf(x0, x1, y) {
	const br = x => `<path d="M ${x} ${y + 14} V ${y + 60} M ${x} ${y + 14} H ${x + 44} M ${x + 3} ${y + 52} L ${x + 36} ${y + 17}" stroke="var(--faint)" stroke-width="6" stroke-linecap="round" fill="none"/>`
		+ `<circle cx="${x}" cy="${y + 28}" r="3" fill="var(--muted)"/><circle cx="${x}" cy="${y + 48}" r="3" fill="var(--muted)"/>`;
	return br(x0 + 30) + br(x1 - 74)
		+ `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="14" rx="3" fill="var(--line-strong)"/><rect x="${x0}" y="${y + 9}" width="${x1 - x0}" height="5" rx="2" fill="var(--faint)"/>`;
}

/** The back wall in cross-section (brick courses), with a loading door (a roller shutter in guide channels, its coil
 * in a housing) and an optional serving hatch. o: { x, w, top, floor, door: y0, shut, shutTone, hatch: [y0, y1] }. */
function wall(o) {
	const { x, w, top, floor } = o;
	const seg = (y0, y1) => {
		let s = `<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="var(--line)" stroke="var(--line-strong)" stroke-width="3"/>`;
		for (let yy = y0 + 26, k = 0; yy < y1 - 6; yy += 26, k++) {
			s += `<line x1="${x + 2}" y1="${yy}" x2="${x + w - 2}" y2="${yy}" stroke="var(--line-strong)" stroke-width="2"/>`;
			const jx = x + w * (k % 2 ? 0.32 : 0.68);
			s += `<line x1="${r1(jx)}" y1="${yy}" x2="${r1(jx)}" y2="${Math.min(y1 - 2, yy + 26)}" stroke="var(--line-strong)" stroke-width="2"/>`;
		}
		return s;
	};
	let svg = '';
	if (o.hatch) {
		const [h0, h1] = o.hatch;
		svg += seg(top, h0) + seg(h1, o.door);
		svg += `<rect x="${x}" y="${h0}" width="${w}" height="${h1 - h0}" fill="none" stroke="var(--green)" stroke-width="${SW}"/>`;
		// The hatch's slide, raised into its slot, and a sill that sticks out on both sides.
		svg += `<rect x="${x - 8}" y="${h0 - 22}" width="${w + 16}" height="22" rx="6" fill="${mix('green', 25)}" stroke="var(--green)" stroke-width="3"/><line x1="${x + w / 2 - 16}" y1="${h0 - 11}" x2="${x + w / 2 + 16}" y2="${h0 - 11}" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>`;
		svg += `<rect x="${x - 14}" y="${h1 - 2}" width="${w + 28}" height="10" rx="3" fill="${mix('green', 25)}" stroke="var(--green)" stroke-width="3"/>`;
	} else {
		svg += seg(top, o.door);
	}
	// The housing over the door, holding the rolled-up shutter: a box with two bolts and the coil's end.
	const hy = o.door, cx = x + w / 2;
	svg += `<rect x="${x - 8}" y="${hy}" width="${w + 16}" height="34" rx="12" fill="var(--faint)"/><circle cx="${cx}" cy="${hy + 17}" r="10" fill="var(--line-strong)" stroke="var(--muted)" stroke-width="2.5"/><circle cx="${cx}" cy="${hy + 17}" r="3" fill="var(--muted)"/>`;
	svg += `<circle cx="${x + 6}" cy="${hy + 17}" r="3" fill="var(--muted)"/><circle cx="${x + w - 6}" cy="${hy + 17}" r="3" fill="var(--muted)"/>`;
	if (o.shut) {
		const st = o.shutTone ?? 'red';
		const c0 = hy + 34, c1 = floor - 16;
		svg += `<rect x="${x + 8}" y="${c0}" width="${w - 16}" height="${c1 - c0}" fill="${mix(st, 12)}"/>`;
		// Curved slats: a groove and a highlight per slat.
		for (let y = c0 + 22; y < c1 - 4; y += 22) {
			svg += `<line x1="${x + 10}" y1="${y}" x2="${x + w - 10}" y2="${y}" stroke="${mix(st, 45)}" stroke-width="3"/><line x1="${x + 12}" y1="${y + 4}" x2="${x + w - 12}" y2="${y + 4}" stroke="#fff" stroke-width="2"/>`;
		}
		svg += `<rect x="${x + 8}" y="${c0}" width="${w - 16}" height="${c1 - c0}" fill="none" stroke="var(--${st})" stroke-width="${SW}"/>`;
		// The bottom bar with a pull handle, and the guide channels either side.
		svg += `<rect x="${x + 4}" y="${c1}" width="${w - 8}" height="16" rx="3" fill="var(--${st})"/><path d="M ${cx - 18} ${c1 + 4} v 6 h 36 v -6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
		svg += `<rect x="${x}" y="${c0}" width="8" height="${floor - c0}" fill="var(--muted)"/><rect x="${x + w - 8}" y="${c0}" width="8" height="${floor - c0}" fill="var(--muted)"/>`;
		// A padlock through a hasp plate on the slats.
		const ly = floor - 74;
		svg += `<rect x="${cx - 21}" y="${ly - 26}" width="42" height="62" rx="6" fill="${mix(st, 30)}" stroke="var(--${st})" stroke-width="2"/>`;
		svg += `<path d="M ${cx - 11} ${ly} V ${ly - 10} A 11 11 0 0 1 ${cx + 11} ${ly - 10} V ${ly}" stroke="var(--${st})" stroke-width="5" fill="none"/><rect x="${cx - 17}" y="${ly}" width="34" height="28" rx="5" fill="var(--${st})"/><circle cx="${cx}" cy="${ly + 11}" r="4" fill="#fff"/><rect x="${cx - 1.5}" y="${ly + 13}" width="3" height="8" fill="#fff"/>`;
	} else {
		svg += `<rect x="${x + 8}" y="${hy + 34}" width="${w - 16}" height="10" rx="3" fill="var(--surface)" stroke="var(--faint)" stroke-width="2"/>`;
		svg += `<rect x="${x}" y="${hy + 34}" width="8" height="${floor - hy - 34}" fill="var(--line-strong)"/><rect x="${x + w - 8}" y="${hy + 34}" width="8" height="${floor - hy - 34}" fill="var(--line-strong)"/>`;
	}
	return svg;
}

/** The supplier's warehouse: a flat roof with a parapet, a sign (a logo and a name, HTML) with two bolts, a row of
 * windows, and a loading bay with its door rolled up, storage racks inside and dock bumpers. Returns { svg, html }. */
function warehouse(x, w, top, floor, o = {}) {
	let svg = `<rect x="${x}" y="${top + 30}" width="${w}" height="${floor - top - 30}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
	svg += `<rect x="${x - 14}" y="${top + 12}" width="${w + 28}" height="22" rx="4" fill="var(--line-strong)"/><line x1="${x - 10}" y1="${top + 17}" x2="${x + w + 10}" y2="${top + 17}" stroke="#fff" stroke-width="2"/>`;
	const bay0 = floor - (floor - top) * 0.5, bx = x + w * 0.16, bw = w * 0.68;
	// Inside the bay: two racks of boxes on uprights.
	svg += `<rect x="${r1(bx)}" y="${r1(bay0)}" width="${r1(bw)}" height="${r1(floor - bay0)}" fill="${mix('neutral', 38)}"/>`;
	[bay0 + 76, bay0 + 148].forEach((ry, k) => {
		svg += `<rect x="${r1(bx + 10)}" y="${r1(ry)}" width="${r1(bw - 20)}" height="6" fill="${mix('neutral', 60)}"/>`;
		for (let bxx = bx + 18 + (k ? 18 : 0); bxx < bx + bw - 44; bxx += 46) {
			svg += `<rect x="${r1(bxx)}" y="${r1(ry - 30)}" width="34" height="30" rx="3" fill="${mix('neutral', 22)}"/>`;
		}
	});
	svg += `<path d="M ${r1(bx + 10)} ${r1(bay0 + 24)} V ${floor} M ${r1(bx + bw - 10)} ${r1(bay0 + 24)} V ${floor}" stroke="${mix('neutral', 60)}" stroke-width="6"/>`;
	// The bay's door, rolled up under its header, and two dock bumpers.
	svg += `<rect x="${r1(bx)}" y="${r1(bay0)}" width="${r1(bw)}" height="20" fill="var(--line-strong)"/><line x1="${r1(bx)}" y1="${r1(bay0 + 10)}" x2="${r1(bx + bw)}" y2="${r1(bay0 + 10)}" stroke="var(--faint)" stroke-width="2"/>`;
	svg += `<rect x="${r1(bx - 8)}" y="${r1(bay0 - 14)}" width="${r1(bw + 16)}" height="14" rx="4" fill="var(--faint)"/>`;
	svg += `<rect x="${r1(bx - 14)}" y="${floor - 46}" width="12" height="30" rx="3" fill="var(--ink)"/><rect x="${r1(bx + bw + 2)}" y="${floor - 46}" width="12" height="30" rx="3" fill="var(--ink)"/>`;
	// A row of windows between the sign and the bay, if there's room.
	const sw = Math.min(w - 40, 240), sx = x + (w - sw) / 2, sy = top + 54;
	if (bay0 - 14 - (sy + 64) >= 56) {
		const wy = sy + 64 + 18, wh = bay0 - 14 - 18 - wy, n = 3, ww = (bw - 2 * 16) / n;
		for (let k = 0; k < n; k++) {
			const wx = bx + k * (ww + 16);
			svg += `<rect x="${r1(wx)}" y="${r1(wy)}" width="${r1(ww)}" height="${r1(wh)}" rx="3" fill="${mix('blue', 10)}" stroke="var(--line-strong)" stroke-width="3"/><line x1="${r1(wx + ww / 2)}" y1="${r1(wy)}" x2="${r1(wx + ww / 2)}" y2="${r1(wy + wh)}" stroke="var(--line-strong)" stroke-width="2"/>`;
		}
	}
	svg += `<rect x="${r1(sx)}" y="${sy}" width="${r1(sw)}" height="64" rx="12" fill="#fff" stroke="var(--ink)" stroke-width="3"/><circle cx="${r1(sx + 12)}" cy="${sy + 32}" r="3" fill="var(--muted)"/><circle cx="${r1(sx + sw - 12)}" cy="${sy + 32}" r="3" fill="var(--muted)"/>`;
	const html = tx('pl-label', x + w / 2, sy + 12, `${o.logo ? logo(o.logo, 36) : ic(o.icon ?? 'building', 34)}<span>${fmt(o.name ?? '')}</span>`, { align: 'c', nolint: true });
	return { svg, html };
}

/** A countertop bakery oven (in its tone): a plinth, a body with a control strip (a pilot light and two
 * dials), a door with a handle bar and a window onto a rack, and a flue pipe with collars up to flueTo. When it is
 * baking (o.lit): the window glows, loaves sit on the rack, the light is on and heat rises off the top. */
function oven(cx, baseY, w, o = {}) {
	const tone = o.tone ?? 'purple', lit = !!(o.lit ?? o.steam);
	const ow = r1(w * 1.4), oh = r1(w * 0.8), x0 = r1(cx - ow / 2), y0 = r1(baseY - oh);
	let svg = '';
	if (o.flueTo != null) {
		const fx = r1(x0 + ow * 0.74);
		svg += `<rect x="${fx}" y="${o.flueTo}" width="34" height="${r1(y0 - o.flueTo + 4)}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
		for (let y = y0 - 40; y > o.flueTo + 20; y -= 90) svg += `<rect x="${fx - 5}" y="${r1(y)}" width="44" height="12" rx="3" fill="var(--line-strong)"/>`;
	}
	if (lit) {
		[0.16, 0.32, 0.48].forEach((f, i) => {
			const x = x0 + ow * f;
			svg += `<path d="M ${r1(x)} ${r1(y0 - 14)} c -9 -10 9 -18 0 -28 s 9 -18 0 -28" stroke="var(--faint)" stroke-width="5" fill="none" stroke-linecap="round" transform="translate(0 ${i === 1 ? -6 : 0})"/>`;
		});
	}
	svg += `<rect x="${r1(x0 + 10)}" y="${baseY}" width="${r1(ow - 20)}" height="12" rx="4" fill="var(--ink)"/>`;
	svg += `<rect x="${x0}" y="${y0}" width="${ow}" height="${oh}" rx="14" fill="${mix(tone, 16)}" stroke="var(--${tone})" stroke-width="${SW}"/>`;
	// The control strip: a pilot light and two dials.
	const sy = r1(y0 + oh * 0.2);
	svg += `<line x1="${x0 + 4}" y1="${sy}" x2="${r1(x0 + ow - 4)}" y2="${sy}" stroke="var(--${tone})" stroke-width="3"/>`;
	const my = r1((y0 + sy) / 2);
	svg += `<circle cx="${r1(x0 + 26)}" cy="${my}" r="6" fill="${lit ? 'var(--yellow)' : mix('neutral', 30)}" stroke="var(--${tone})" stroke-width="2"/>`;
	[ow - 70, ow - 32].forEach(dx => {
		svg += `<circle cx="${r1(x0 + dx)}" cy="${my}" r="11" fill="#fff" stroke="var(--${tone})" stroke-width="3"/><line x1="${r1(x0 + dx)}" y1="${my}" x2="${r1(x0 + dx + 6)}" y2="${r1(my - 7)}" stroke="var(--${tone})" stroke-width="3" stroke-linecap="round"/>`;
	});
	// The door: a handle bar, then a window with a rack.
	const dx0 = x0 + 14, dy0 = r1(sy + 10), dw = ow - 28, dh = r1(y0 + oh - 12 - dy0);
	svg += `<rect x="${dx0}" y="${dy0}" width="${dw}" height="${dh}" rx="8" fill="${mix(tone, 26)}" stroke="var(--${tone})" stroke-width="3"/>`;
	svg += `<rect x="${dx0 + 24}" y="${dy0 + 8}" width="${dw - 48}" height="9" rx="4.5" fill="var(--${tone})"/>`;
	const wx = dx0 + 14, wy = dy0 + 26, ww = dw - 28, wh = r1(dh - 36);
	svg += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="6" fill="${lit ? mix('yellow', 55) : mix('neutral', 22)}" stroke="var(--${tone})" stroke-width="2"/>`;
	const ry = r1(wy + wh - 10);
	svg += `<line x1="${wx + 6}" y1="${ry}" x2="${wx + ww - 6}" y2="${ry}" stroke="${mix('neutral', 60)}" stroke-width="3"/>`;
	if (lit) {
		const n = 3, lw = (ww - 24) / n;
		for (let k = 0; k < n; k++) {
			const lx = wx + 12 + k * lw + lw * 0.1, lwid = lw * 0.8, lh = Math.min(26, wh * 0.45);
			svg += `<path d="M ${r1(lx)} ${ry} Q ${r1(lx)} ${r1(ry - lh)} ${r1(lx + lwid / 2)} ${r1(ry - lh)} Q ${r1(lx + lwid)} ${r1(ry - lh)} ${r1(lx + lwid)} ${ry} Z" fill="${mix('orange', 45)}" stroke="${mix('orange', 70)}" stroke-width="2"/>`;
			svg += `<path d="M ${r1(lx + lwid * 0.3)} ${r1(ry - lh * 0.55)} l 6 -6 M ${r1(lx + lwid * 0.55)} ${r1(ry - lh * 0.55)} l 6 -6" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
		}
	}
	return svg;
}

/** A checkered floor (the diner tiles of this bakery), from x0 to x1, two rows under y, with a skirting line. */
function checker(x0, x1, y, size = 22) {
	let svg = `<rect x="${x0}" y="${y + 2}" width="${x1 - x0}" height="${2 * size}" fill="#fff"/>`;
	for (let r = 0; r < 2; r++) for (let x = x0, k = 0; x < x1; x += size, k++) {
		if ((k + r) % 2 === 0) svg += `<rect x="${x}" y="${y + 2 + r * size}" width="${Math.min(size, x1 - x)}" height="${size}" fill="${mix('neutral', 55)}"/>`;
	}
	return svg + `<line x1="${x0}" y1="${y + 2 + 2 * size}" x2="${x1}" y2="${y + 2 + 2 * size}" stroke="${mix('neutral', 55)}" stroke-width="2"/>`;
}

/** A kitchen counter: a worktop with a front edge, a drawer strip (with the hob's knobs at o.knobs), a cabinet door
 * with an inset panel and a handle, and a recessed plinth. */
function counter(x, w, top, floor, o = {}) {
	let svg = `<rect x="${x - 10}" y="${top}" width="${w + 20}" height="18" rx="4" fill="var(--line-strong)"/><line x1="${x - 6}" y1="${top + 13}" x2="${x + w + 6}" y2="${top + 13}" stroke="var(--faint)" stroke-width="2"/>`;
	svg += `<rect x="${x}" y="${top + 18}" width="${w}" height="${floor - top - 32}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`;
	svg += `<rect x="${x + 14}" y="${floor - 14}" width="${w - 28}" height="14" fill="var(--line-strong)"/>`;
	const dTop = top + 30, dH = 34, pTop = dTop + dH + 12, pBot = floor - 26;
	svg += `<rect x="${x + 14}" y="${dTop}" width="${w - 28}" height="${dH}" rx="6" fill="#fff" stroke="var(--line-strong)" stroke-width="2.5"/>`;
	(o.knobs ?? []).forEach(kx => { svg += `<circle cx="${kx}" cy="${dTop + dH / 2}" r="11" fill="var(--ink)"/><line x1="${kx}" y1="${dTop + dH / 2 - 8}" x2="${kx}" y2="${dTop + dH / 2 - 2}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`; });
	if (pBot - pTop > 40) {
		svg += `<rect x="${x + 14}" y="${pTop}" width="${w - 28}" height="${pBot - pTop}" rx="8" fill="none" stroke="var(--line-strong)" stroke-width="2.5"/>`;
		if (w >= 500) svg += `<line x1="${x + w - 36}" y1="${pTop + 18}" x2="${x + w - 36}" y2="${pTop + 58}" stroke="var(--faint)" stroke-width="6" stroke-linecap="round"/>`;
	}
	return svg;
}

/** A plain worktop with a front edge and a plinth: for counters that carry labels inside. */
function worktop(x, w, top, floor) {
	return `<rect x="${x - 10}" y="${top}" width="${w + 20}" height="18" rx="4" fill="var(--line-strong)"/><line x1="${x - 6}" y1="${top + 13}" x2="${x + w + 6}" y2="${top + 13}" stroke="var(--faint)" stroke-width="2"/>`
		+ `<rect x="${x}" y="${top + 18}" width="${w}" height="${floor - top - 32}" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="3"/>`
		+ `<rect x="${x + 14}" y="${floor - 14}" width="${w - 28}" height="14" fill="var(--line-strong)"/>`;
}

/** A monitor on a stand with a real frame of the video: a bezel with an inner edge and a camera dot, a play bar with
 * a scrubber, a hinged neck and a sloped foot. Returns { svg, html }. */
function screen(x, y, w, src, surface, o = {}) {
	const h = (w * 9) / 16, pad = 14, barH = 44;
	const bx = x - pad, by = y - pad, bw = w + 2 * pad, bh = h + 2 * pad + barH;
	let svg = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="16" fill="var(--ink)"/>`;
	svg += `<rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${r1(h + 6)}" rx="4" fill="none" stroke="var(--body)" stroke-width="2"/><circle cx="${r1(x + w / 2)}" cy="${by + 6}" r="2.5" fill="var(--body)"/>`;
	const neckTop = by + bh, baseY = surface - 12, ncx = x + w / 2;
	svg += `<rect x="${r1(ncx - 16)}" y="${neckTop}" width="32" height="${r1(baseY - neckTop)}" fill="var(--body)"/><circle cx="${r1(ncx)}" cy="${r1(neckTop + 8)}" r="5" fill="var(--muted)"/>`;
	svg += `<path d="M ${r1(ncx - 60)} ${baseY} H ${r1(ncx + 60)} L ${r1(ncx + 92)} ${surface} H ${r1(ncx - 92)} Z" fill="var(--body)"/>`;
	const by2 = y + h + pad + barH / 2, tx0 = x + 54, tw = w - 134, p = o.progress ?? 1;
	svg += `<rect x="${r1(tx0)}" y="${r1(by2 - 4)}" width="${r1(tw)}" height="8" rx="4" fill="var(--body)"/>`;
	svg += `<rect x="${r1(tx0)}" y="${r1(by2 - 4)}" width="${r1(tw * p)}" height="8" rx="4" fill="var(--blue)"/><circle cx="${r1(tx0 + tw * p)}" cy="${r1(by2)}" r="8" fill="#fff"/>`;
	svg += `<path d="M ${x + 12} ${r1(by2 - 11)} l 19 11 l -19 11 Z" fill="#fff"/>`;
	const rel = asset(src);
	let html = rel ? `<img class="pl-img" src="${esc(rel)}" alt="${esc(o.alt ?? '')}" style="${at(x, y, w, h)}">` : `<div class="pl-obj" data-missing="${esc(src)}" style="${at(x, y, w, h)};background:var(--ink)"></div>`;
	if (o.time) {
		html += `<div class="pl-obj" style="${at(x + w - 64, by2 - 14, 64, 28)};background:var(--ink)">${t('pl-x pl-clock', 'right:0;top:0;color:#fff', esc(o.time), { nolint: true })}</div>`;
	}
	return { svg, html, h, bottom: by + bh };
}

/** A wind-up kitchen timer, built like a stopwatch: a knurled crown on a stem, a side pusher, a bezel, minute ticks
 * (every fifth longer), the time used as an arc with a white tip, and two legs with rubber feet. Returns svg. */
function timer(cx, cy, r, value, max, tone, surface) {
	const pol = (rr, f) => {
		const a = (f * 360 - 90) * (Math.PI / 180);
		return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
	};
	let svg = `<rect x="${cx - 8}" y="${cy - r - 18}" width="16" height="22" fill="var(--body)"/>`;
	svg += `<rect x="${cx - 26}" y="${cy - r - 40}" width="52" height="26" rx="8" fill="var(--ink)"/>`;
	for (let k = -2; k <= 2; k++) svg += `<line x1="${cx + k * 9}" y1="${cy - r - 35}" x2="${cx + k * 9}" y2="${cy - r - 19}" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round"/>`;
	const [px, py] = pol(r + 6, 0.125);
	svg += `<rect x="${r1(px - 10)}" y="${r1(py - 15)}" width="20" height="30" rx="6" fill="var(--ink)" transform="rotate(45 ${r1(px)} ${r1(py)})"/>`;
	const legY = cy + r * 0.72;
	svg += `<path d="M ${r1(cx - r * 0.62)} ${r1(legY)} L ${r1(cx - r * 0.74)} ${surface - 8} H ${r1(cx - r * 0.44)} Z M ${r1(cx + r * 0.62)} ${r1(legY)} L ${r1(cx + r * 0.74)} ${surface - 8} H ${r1(cx + r * 0.44)} Z" fill="var(--ink)"/>`;
	svg += `<rect x="${r1(cx - r * 0.79)}" y="${surface - 10}" width="${r1(r * 0.4)}" height="10" rx="5" fill="var(--body)"/><rect x="${r1(cx + r * 0.39)}" y="${surface - 10}" width="${r1(r * 0.4)}" height="10" rx="5" fill="var(--body)"/>`;
	svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="var(--ink)" stroke-width="${STYLE.strokeBold + 2}"/><circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="var(--line-strong)" stroke-width="2"/>`;
	for (let i = 0; i < 60; i++) {
		const major = i % 5 === 0, [a, b] = pol(r - 10, i / 60), [c, d] = pol(r - (major ? 22 : 16), i / 60);
		svg += `<line x1="${r1(a)}" y1="${r1(b)}" x2="${r1(c)}" y2="${r1(d)}" stroke="${major ? 'var(--muted)' : 'var(--faint)'}" stroke-width="${major ? 3.5 : 2}" stroke-linecap="round"/>`;
	}
	const rr = r - 40;
	svg += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="var(--track)" stroke-width="24"/>`;
	const f = Math.min(0.999, value / max);
	const [x0, y0] = pol(rr, 0), [x1, y1] = pol(rr, f);
	svg += `<path d="M ${r1(x0)} ${r1(y0)} A ${rr} ${rr} 0 ${f > 0.5 ? 1 : 0} 1 ${r1(x1)} ${r1(y1)}" fill="none" stroke="var(--${tone})" stroke-width="24" stroke-linecap="round"/>`;
	svg += `<circle cx="${r1(x1)}" cy="${r1(y1)}" r="5" fill="#fff"/>`;
	return svg;
}

/** An arrow along a path: a dashed line and a chevron at its end, pointing along the last segment. */
function arrow(d, end, from, tone = 'purple', dashed = true) {
	const [x, y] = end, [px, py] = from;
	const a = Math.atan2(y - py, x - px), L = 20;
	const p1 = [x - L * Math.cos(a - 0.6), y - L * Math.sin(a - 0.6)], p2 = [x - L * Math.cos(a + 0.6), y - L * Math.sin(a + 0.6)];
	return `<path d="${d}" stroke="var(--${tone})" stroke-width="6" fill="none" stroke-linecap="round"${dashed ? ' stroke-dasharray="2 14"' : ''}/>`
		+ `<path d="M ${r1(p1[0])} ${r1(p1[1])} L ${x} ${y} L ${r1(p2[0])} ${r1(p2[1])}" stroke="var(--${tone})" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** A tag at (x, y): an icon and a few words on the tone's tint. */
const tag = (x, y, o, extra = {}) => tx('pl-tag', x, y, `${o.icon ? ic(o.icon, 26) : ''}<span>${fmt(o.text)}</span>`, { tone: o.tone ?? 'blue', nolint: !!o.nolint, ...extra });
/** A label: a logo or an icon and a name. */
const label = (x, y, o, extra = {}) => tx('pl-label', x, y, `${o.logo ? logo(o.logo, o.size ?? 34) : o.icon ? ic(o.icon, o.size ?? 30) : ''}<span>${fmt(o.text)}</span>`, { nolint: true, tone: o.tone, ...extra });

/** Wall tiles behind a counter, in the kitchen's tint. */
function backsplash(x0, x1, y0, y1) {
	let svg = '';
	for (let y = y1 - 38; y > y0; y -= 38) svg += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${mix('yellow', 45)}" stroke-width="2"/>`;
	for (let x = x0 + 38; x < x1; x += 38) svg += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${mix('yellow', 45)}" stroke-width="2"/>`;
	return svg;
}

// The back of the kitchen, drawn the same way on every slide that shows it: the supplier's warehouse outside, the
// back wall, the kitchen tinted, and the counter with the oven and its flue.
const FLOOR = 640, WALL = 600, WALL_W = 110, COUNTER = 440, POT = 1500;
function backroom(s, o = {}) {
	let svg = `<rect x="${WALL + WALL_W}" y="20" width="${W - WALL - WALL_W}" height="${FLOOR - 20}" fill="${mix('yellow', 14)}"/>`;
	svg += `<line x1="0" y1="${FLOOR}" x2="${W}" y2="${FLOOR}" stroke="var(--line-strong)" stroke-width="${SW}"/>`;
	const wh = warehouse(20, 340, 220, FLOOR, { name: s.supplier, logo: s.sourceLogo });
	svg += backsplash(1218, 1710, 250, COUNTER);
	svg += wh.svg + counter(1180, 530, COUNTER, FLOOR, { knobs: [POT - 40, POT + 40] }) + oven(POT, COUNTER - 12, 200, { steam: !!o.steam, flueTo: 20 }) + checker(WALL + WALL_W, W, FLOOR);
	const html = wh.html + tx('pl-plate', 1445, 520, `${ic(s.ovenIcon ?? 'food', 30)}<span>${fmt(s.oven ?? '')}</span>`, { align: 'c', tone: 'purple', nolint: true });
	return { svg, html };
}
/** A big number at the top left, with a line under it. */
function bigStat(s) {
	if (!s.big) return '';
	return tx('pl-big', 0, 10, `${esc(s.big.value)}<span class="pl-unit">${esc(s.big.unit ?? '')}</span>`, { tone: s.big.tone ?? 'red' })
		+ (s.big.sub ? tx('pl-sub', 4, 118, fmt(s.big.sub)) : '');
}

const D = {};

/** The cover, with the idea drawn on the right half. Looks: 'line' (the ticket on its rail, the oven, the video on
 * the pass), 'kitchen' (adds the back wall and the stock already on the shelf), 'ticket' (one big ticket, a line
 * stamped served, a real frame stapled to it). Fields: eyebrow, title, sub, speaker: { initials, name, role }, pills,
 * look, ticket: { head, time, lines }, oven (label), video: { src, label, time }, stock (label for the shelf),
 * stamp (look 'ticket'). */
D['pl-cover'] = {
	bare: true,
	css: `${base('pl-cover')}
.pl-cover { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.pl-cover .pl-left { width: 780px; }
.pl-cover .pl-cl { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 24px; font-weight: 600; color: var(--ink); text-align: center; }
.pl-cover .pl-mat { position: absolute; background: #fff; border: 3px solid var(--line-strong); border-radius: 6px; }
`,
	render(s) {
		const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
		const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
		const left = `<div class="tf-left pl-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
		const look = s.look ?? 'line';
		const tk = s.ticket ?? {}, vid = s.video ?? {};
		const cl = (x, y, o) => tx('pl-cl', x, y, `${o.logo ? logo(o.logo, 40) : ic(o.icon ?? 'play', 40)}<span>${fmt(o.text)}</span>`, { align: 'c', nolint: true });
		let svg = '', html = '';
		if (look === 'ticket') {
			svg += rail(1060, 1834, 150);
			html += ticket({ x: 1110, y: 164, w: 340, h: 700, clip: true, head: tk.head, time: tk.time, lines: tk.lines, lineY: 92, pitch: 54, stamp: s.stamp ? { ...s.stamp, x: 170, y: 596 } : null });
			const fx = 1484, fy = 420, fw = 334, fh = (fw * 9) / 16;
			const rel = asset(vid.src ?? '');
			html += `<div class="pl-mat" style="${at(fx - 10, fy - 10, fw + 20, fh + 20)}"></div>`;
			html += rel ? `<img class="pl-img" src="${esc(rel)}" alt="${esc(vid.alt ?? '')}" style="${at(fx, fy, fw, fh)}">` : '';
			// The frame hangs from the rail on a wire, held by the same bulldog clip as the ticket.
			const c = fx + fw / 2;
			svg += `<path d="M ${c} 160 L ${fx + 24} ${fy - 10} M ${c} 160 L ${fx + fw - 24} ${fy - 10}" stroke="var(--muted)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
			svg += `<path d="M ${c - 30} 126 H ${c + 30} L ${c + 25} 164 H ${c - 25} Z" fill="var(--line-strong)" stroke="var(--muted)" stroke-width="2.5" stroke-linejoin="round"/><line x1="${c - 22}" y1="152" x2="${c + 22}" y2="152" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round"/><circle cx="${c - 20}" cy="138" r="3" fill="var(--muted)"/><circle cx="${c + 20}" cy="138" r="3" fill="var(--muted)"/>`;
			html += label(fx + fw / 2, fy + fh + 26, { icon: 'video', text: vid.label ?? '' }, { align: 'c' });
		} else {
			const top = 720, floor = 900;
			svg += look === 'kitchen' ? worktop(1090, 734, top, floor) + `<line x1="990" y1="${floor}" x2="1834" y2="${floor}" stroke="var(--line-strong)" stroke-width="${SW}"/>` : worktop(1000, 824, top, floor);
			// Put the screen on the counter: a 40 px neck between the bezel and the base on the counter top.
			const sy = top - 12 - 40 - ((222 * 9) / 16 + 28 + 44) + 14;
			const scr = screen(1592, sy, 222, vid.src ?? '', top, { time: vid.time, alt: vid.alt, progress: vid.progress });
			svg += scr.svg;
			html += scr.html;
			if (look === 'line') {
				svg += rail(1010, 1250, 230);
				html += ticket({ x: 1035, y: 244, w: 190, h: 236, clip: true, head: tk.head, lines: tk.lines, lineY: 92, pitch: 54 });
				svg += oven(1385, top - 12, 170, { steam: true });
				svg += arrow('M 1130 500 C 1135 600 1180 640 1244 640', [1254, 640], [1244, 640]);
				svg += arrow('M 1494 572 C 1515 548 1540 540 1560 540', [1568, 540], [1556, 540]);
				html += cl(1130, 760, { logo: tk.logo, icon: tk.icon ?? 'receipt', text: tk.label ?? '' });
			} else {
				svg += `<rect x="990" y="150" width="844" height="20" rx="4" fill="var(--line-strong)"/>`;
				svg += wall({ x: 1000, w: 70, top: 170, floor, door: 420, shut: true, shutTone: 'orange' });
				svg += shelf(1100, 1270, 470);
				[0, 1].forEach(i => {
					const c = crate(1110 + i * 84, 404, 70, 66, { check: true });
					svg += c.svg;
				});
				svg += `<path d="M 1281 168 V 176 M 1499 168 V 176" stroke="var(--faint)" stroke-width="6"/>` + rail(1270, 1510, 196);
				html += ticket({ x: 1300, y: 210, w: 180, h: 170, clip: true, head: tk.head, lines: (tk.lines ?? []).slice(-1), lineY: 86, pitch: 54 });
				svg += oven(1390, top - 12, 150, { steam: true });
				svg += arrow('M 1276 476 C 1290 520 1320 556 1328 568', [1330, 578], [1328, 568]);
				svg += arrow('M 1490 590 C 1512 562 1540 548 1560 548', [1568, 548], [1556, 548]);
				html += cl(1180, 760, { icon: 'box', text: s.stock ?? '' });
			}
			html += cl(look === 'line' ? 1385 : 1390, 760, { icon: s.ovenIcon ?? 'food', text: s.oven ?? '' });
			html += cl(1703, 760, { icon: 'video', text: vid.label ?? '' });
		}
		return `<div class="pl-cover">${svgEl(1920, 1080, svg)}${left}${html}${msLogo()}</div>`;
	},
};

/** One ticket sorted into trays: the order's lines on the left, and for each tray a big count, a name and that many
 * small tickets standing in it. Fields: eyebrow, title, ticket: { head, time, lines }, trays (3): [{ value, label,
 * tone, dim, pr }], note: { icon, text }. */
D['pl-sort'] = {
	css: `${base('pl-sort')}
.pl-sort .pl-tl { font-size: 30px; font-weight: 600; color: var(--fg); }
.pl-sort .pl-ref { font-family: var(--mono); font-size: 24px; font-weight: 600; color: var(--fg); }
`,
	render(s) {
		const H = bodyHeight(s);
		const tk = s.ticket ?? {};
		let svg = rail(0, 470, 24), html = '';
		html += ticket({ x: 35, y: 38, w: 400, h: 636, clip: true, head: tk.head, time: tk.time, lines: tk.lines, lineY: 86, pitch: 58 });
		const trays = s.trays ?? [];
		const widths = [250, 250, 590], gap = 44;
		let x = 540;
		trays.forEach((tr, i) => {
			const w = widths[i] ?? 250, tone = tr.tone ?? 'blue';
			html += tx('pl-big', x, 110, esc(String(tr.value)), { tone });
			html += tx('pl-tl', x, 230, fmt(tr.label ?? ''), { tone, nolint: true });
			const back = 380, front = 430, bottom = 600;
			svg += `<path d="M ${x} ${front} L ${x + 14} ${back} H ${x + w - 14} L ${x + w} ${front} Z" fill="${mix(tone, tr.dim ? 3 : 7)}" stroke="${mix(tone, tr.dim ? 30 : 50)}" stroke-width="3" stroke-linejoin="round"/>`;
			const n = Number(tr.value), mw = n > 1 ? 70 : 92, mh = n > 1 ? 130 : 150, mg = 11;
			const total = n * mw + (n - 1) * mg;
			for (let k = 0; k < n; k++) {
				const mx = x + (w - total) / 2 + k * (mw + mg);
				svg += miniTicket(r1(mx), front + 40 - mh, mw, mh, tr.dim ? 'faint' : tone, wob(k + i * 3) * 5);
			}
			svg += `<path d="M ${x} ${front} V ${bottom - 18} Q ${x} ${bottom} ${x + 18} ${bottom} H ${x + w - 18} Q ${x + w} ${bottom} ${x + w} ${bottom - 18} V ${front} Z" fill="${mix(tone, tr.dim ? 6 : 14)}" stroke="var(--${tone})" stroke-width="${SW}" stroke-linejoin="round"${tr.dim ? ' stroke-opacity=".45"' : ''}/>`;
			if (tr.ref) {
				html += tx('pl-ref', x + w / 2, front + 44, esc(tr.ref), { align: 'c', tone, nolint: true });
			}
			x += w + gap;
		});
		if (s.note) {
			html += tx('pl-sub', 540, 636, `${ic(s.note.icon ?? 'info', 24)} ${fmt(s.note.text)}`, { style: ';display:flex;align-items:center;gap:10px' });
		}
		return heading(s) + body(`<div class="pl-sort" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** The ticket rail: one ticket per try, clicked in one by one (earlier ones stay bright). Each ticket: head, time,
 * a big number, a line or two, a stamp. Fields: eyebrow, title, tickets (2–4): [{ head, time, big: { value, unit,
 * tone }, lines: [{ text, icon, tone }], stamp: { text, tone } }]. */
D['pl-rail'] = {
	clicks: true,
	css: base('pl-rail'),
	render(s, ctx = {}) {
		const H = bodyHeight(s);
		const tks = s.tickets ?? [];
		const w = 470, gap = (W - 80 - tks.length * w) / Math.max(1, tks.length - 1);
		let html = '';
		tks.forEach((tk, i) => {
			html += ticket({ x: 40 + i * (w + gap), y: 160, w, h: 440, clip: true, head: tk.head, time: tk.time, big: tk.big, lines: tk.lines, lineY: 236, stamp: tk.stamp ? { ...tk.stamp, y: 318 } : null, key: `ticket-${i}`, hidden: ctx.step && i >= ctx.step });
		});
		return heading(s) + body(`<div class="pl-rail" style="height:${H}px">${svgEl(W, H, rail(16, W - 16, 146))}${html}</div>`, { vcenter: false });
	},
};

/** The back door shut: the supplier's crates outside, the shutter down, the shelf inside empty, the oven cold. Tags
 * name what was wrong. Fields: eyebrow, title, big: { value, unit, tone, sub } (top left), supplier (label),
 * door: { text, icon } (tag at the shutter), shelf: { text, icon } (tag over the empty shelf), oven (the plate),
 * cook: { text, icon } (tag over the oven). */
D['pl-door'] = {
	css: base('pl-door'),
	render(s) {
		const H = bodyHeight(s);
		let { svg, html } = backroom(s);
		html += bigStat(s);
		// Outside: the supplier's crates wait in front of the loading bay.
		[[90, 540], [200, 540], [145, 440]].forEach(([x, y]) => { svg += crate(x, y, 100, 100).svg; });
		svg += wall({ x: WALL, w: WALL_W, top: 20, floor: FLOOR, door: 300, shut: true });
		if (s.door) html += tag(WALL + WALL_W + 30, 330, { tone: 'red', icon: s.door.icon ?? 'dismissCircle', text: s.door.text });
		// Inside: an empty shelf (dashed outlines where the crates should be), and a cold oven.
		svg += shelf(780, 1130, 250);
		[0, 1, 2].forEach(i => { svg += crate(810 + i * 104, 176, 84, 74, { dashed: true }).svg; });
		if (s.shelf) html += tag(780, 96, { tone: 'red', icon: s.shelf.icon ?? 'box', text: s.shelf.text });
		if (s.cook) html += tag(POT, 200, { tone: 'red', icon: s.cook.icon ?? 'key', text: s.cook.text }, { align: 'c' });
		return heading(s) + body(`<div class="pl-door" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Two openings in the back wall: a small hatch that is open (the diff passes through) and the loading door that is
 * shut (the blocked crate waits outside). Inside, the note the kitchen sent back, on a ticket, and the cold oven. Fields:
 * eyebrow, title, big, supplier, hatch: { text, icon } (green tag), door: { text, icon } (red tag), reply: { head,
 * lines }, oven. */
D['pl-hatch'] = {
	css: base('pl-hatch'),
	render(s) {
		const H = bodyHeight(s);
		let { svg, html } = backroom(s);
		html += bigStat(s);
		svg += wall({ x: WALL, w: WALL_W, top: 20, floor: FLOOR, door: 300, shut: true, hatch: [110, 230] });
		// The diff: a small crate sitting in the open hatch, on its sill.
		const dc = crate(WALL + 16, 230 - 72, WALL_W - 32, 70, { tone: 'green', check: true });
		svg += dc.svg;
		if (s.hatch) html += tag(WALL - 24, 172, { tone: 'green', icon: s.hatch.icon ?? 'checkCircle', text: s.hatch.text }, { align: 'r' });
		// The rest of the supplier's crates, still in the bay.
		[[90, 540], [200, 540]].forEach(([x, y]) => { svg += crate(x, y, 100, 100).svg; });
		// The blocked crate, against the shut door.
		const c = crate(WALL - 120, FLOOR - 110, 110, 110, { logo: s.sourceLogo });
		svg += c.svg;
		html += c.html;
		if (s.door) html += tag(WALL + WALL_W + 30, 560, { tone: 'red', icon: s.door.icon ?? 'dismissCircle', text: s.door.text });
		// Inside: the reply on its rail.
		svg += rail(760, 1230, 40);
		const rp = s.reply ?? {};
		html += ticket({ x: 795, y: 54, w: 400, h: 300, clip: true, head: rp.head, lines: rp.lines, lineY: 96, pitch: 54 });
		return heading(s) + body(`<div class="pl-hatch" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Stocked before service: the supplies come in before the shutter shuts the door. Looks: 'scene' (three clicks: the
 * early crew carries the crates in through the open door; the shutter comes down; the oven bakes from the shelf),
 * 'phases' (two bands of time, before and after the shutter), 'shelf' (a close-up of the stocked shelf, one crate per
 * item). Fields: eyebrow, title, look, supplier, setup: { text, icon }, shutter: { text, icon }, ready: { text, icon },
 * shelfLabel, oven, items (look 'shelf': [{ text, hi }] crate labels, hi: true marks the one that matters), phases: [{ title, sub }]. */
D['pl-prep'] = {
	clicks: true,
	css: `${base('pl-prep')}
.pl-prep .pl-ref { font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--ink); background: #fff; border-radius: 6px; padding: 2px 8px; }
.pl-prep .pl-ref.pl-hi { color: var(--blue); }
`,
	render(s, ctx = {}) {
		const H = bodyHeight(s), floor = 640;
		const look = s.look ?? 'scene';
		const step = ctx.step >= 1 ? ctx.step : 3; // no clicks: the whole picture
		let svg = '', html = '';
		const plate = (x, y) => tx('pl-plate', x, y, `${ic(s.ovenIcon ?? 'food', 30)}<span>${fmt(s.oven ?? '')}</span>`, { align: 'c', tone: 'purple', nolint: true });
		const supplier = (x0) => {
			const wh = warehouse(x0, 400, 200, floor, { name: s.supplier });
			svg += wh.svg;
			html += wh.html;
			[[x0 + 80, 530], [x0 + 200, 530], [x0 + 140, 420]].forEach(([x, y]) => { svg += crate(x, y, 110, 110).svg; });
		};
		if (look === 'scene') {
			const br = backroom(s, { steam: step >= 3 });
			svg += br.svg;
			html += br.html;
			[[90, 540], [200, 540], [145, 440]].forEach(([x, y]) => { svg += crate(x, y, 100, 100).svg; });
			svg += wall({ x: WALL, w: WALL_W, top: 20, floor: FLOOR, door: 300, shut: step >= 2, shutTone: 'orange' });
			if (step === 1) {
				svg += arrow('M 320 600 H 720 Q 756 600 756 560 V 246 Q 756 228 774 228', [784, 228], [770, 228], 'blue', false) + arrow('M 756 436 Q 756 418 774 418', [784, 418], [770, 418], 'blue', false);
				if (s.setup) html += tag(390, 530, { tone: 'blue', icon: s.setup.icon ?? 'arrowRight', text: s.setup.text });
			}
			if (step >= 2 && s.shutter) html += tag(WALL + WALL_W + 20, 330, { tone: 'orange', icon: s.shutter.icon ?? 'lock', text: s.shutter.text });
			svg += shelf(790, 1150, 260) + shelf(790, 1150, 450);
			for (let k = 0; k < 9; k++) {
				const row = k < 5 ? 0 : 1, col = row ? k - 5 : k;
				svg += crate(790 + col * 74, row ? 386 : 196, 64, 64, { check: step >= 3 }).svg;
			}
			if (s.shelfLabel) html += tx('pl-sub', 790, 146, fmt(s.shelfLabel), { nolint: true });
			if (step >= 3) {
				svg += arrow('M 1160 228 C 1250 228 1290 330 1340 330', [1350, 330], [1340, 330], 'purple');
				if (s.ready) html += tag(970, 560, { tone: 'green', icon: s.ready.icon ?? 'checkCircle', text: s.ready.text }, { align: 'c' });
			}
		} else if (look === 'phases') {
			const split = 700, y0 = 70, y1 = 610;
			const ph = s.phases ?? [];
			svg += `<rect x="0" y="${y0}" width="${split}" height="${y1 - y0}" rx="20" fill="${mix('blue', 6)}"/>`;
			svg += `<rect x="${split + 20}" y="${y0}" width="${W - split - 20}" height="${y1 - y0}" rx="20" fill="${mix('purple', 6)}"/>`;
			html += label(28, y0 + 22, { icon: 'globe', text: ph[0]?.title ?? '', tone: 'blue' });
			html += tx('pl-sub', 28, y0 + 70, fmt(ph[0]?.sub ?? ''), { nolint: true });
			html += label(split + 48, y0 + 22, { icon: 'lock', text: ph[1]?.title ?? '', tone: 'purple' });
			html += tx('pl-sub', split + 48, y0 + 70, fmt(ph[1]?.sub ?? ''), { nolint: true });
			// The supplier's crates, carried along the bottom of the first band onto the shelf just past the line.
			svg += `<line x1="0" y1="${y1}" x2="${W}" y2="${y1}" stroke="var(--line-strong)" stroke-width="${SW}"/>`;
			const c = crate(70, y1 - 200, 200, 200, { logo: s.sourceLogo });
			svg += c.svg;
			html += c.html;
			html += label(170, y1 - 260, { text: s.supplier ?? '' }, { align: 'c' });
			svg += arrow('M 290 510 C 480 510 580 300 790 300', [804, 300], [790, 300], 'blue', false);
			svg += `<line x1="${split + 10}" y1="${y0 - 20}" x2="${split + 10}" y2="${y1}" stroke="var(--orange)" stroke-width="6" stroke-dasharray="16 12" stroke-linecap="round"/>`;
			if (s.shutter) html += tag(split + 48, y1 - 70, { tone: 'orange', icon: s.shutter.icon ?? 'lock', text: s.shutter.text });
			svg += shelf(760, 1180, 400);
			for (let k = 0; k < 9; k++) {
				const row = k < 5 ? 0 : 1, col = row ? k - 5 : k;
				svg += crate(r1(778 + col * 80 + row * 40), row ? 336 - 64 - 4 : 336, 68, 64, { check: true }).svg;
			}
			if (s.shelfLabel) html += tx('pl-sub', 760, 216, fmt(s.shelfLabel), { nolint: true });
			svg += counter(1290, 380, 440, y1, { knobs: [1440, 1520] });
			svg += oven(1480, 428, 160, { steam: true });
			svg += arrow('M 1190 330 C 1260 320 1350 300 1392 298', [1402, 298], [1392, 298], 'purple');
			html += plate(1480, 520);
			if (s.ready) html += tag(1480, 96, { tone: 'green', icon: s.ready.icon ?? 'checkCircle', text: s.ready.text }, { align: 'c' });
		} else {
			svg += `<rect x="${WALL_W}" y="20" width="${W - WALL_W}" height="${floor - 20}" fill="${mix('yellow', 14)}"/>`;
			svg += `<line x1="0" y1="${floor}" x2="${W}" y2="${floor}" stroke="var(--line-strong)" stroke-width="${SW}"/>`;
			svg += wall({ x: 0, w: WALL_W, top: 20, floor, door: 260, shut: true, shutTone: 'orange' });
			if (s.shutter) html += tag(WALL_W + 30, 40, { tone: 'orange', icon: s.shutter.icon ?? 'lock', text: s.shutter.text });
			const items = s.items ?? [];
			const cw = 190, ch = 130, g = 20, x0 = 170;
			svg += shelf(150, 1250, 300) + shelf(150, 1250, 540);
			items.forEach((p, k) => {
				const row = k < 5 ? 0 : 1, col = row ? k - 5 : k;
				const x = x0 + col * (cw + g) + (row ? (cw + g) / 2 : 0), y = (row ? 540 : 300) - ch;
				svg += crate(x, y, cw, ch, { tone: p.hi ? 'blue' : 'neutral', check: true }).svg;
				html += `<div class="pl-obj" data-shape style="${at(x + 14, y + ch / 2 - 20, cw - 28, 40)};display:grid;place-items:center">${t(`pl-ref${p.hi ? ' pl-hi' : ''}`, '', `${esc(p.text)}`, { nolint: true })}</div>`;
			});
			if (s.shelfLabel) html += tx('pl-sub', 170, 120, fmt(s.shelfLabel), { nolint: true });
			svg += counter(1330, 380, 440, floor, { knobs: [1480, 1560] });
			svg += oven(1520, 428, 160, { steam: true });
			svg += arrow('M 1262 290 C 1320 286 1380 286 1418 292', [1428, 294], [1418, 292], 'purple');
			html += plate(1520, 520);
			if (s.ready) html += tag(1520, 96, { tone: 'green', icon: s.ready.icon ?? 'checkCircle', text: s.ready.text }, { align: 'c' });
		}
		return heading(s) + body(`<div class="pl-prep" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Where the minutes went: a kitchen timer on the counter shows the minutes used out of the session's limit; the
 * ticket, turned on its side, is split into steps sized by their seconds, the one that matters in its tone and the
 * rest muted. Fields: eyebrow, title, timer: { value, max, unit, sub, tone }, kicker, parts: [{ label, seconds,
 * value (shown, e.g. '8.8'), tone, hi }], unit (default 'min'), note: { icon, text }. */
D['pl-time'] = {
	css: `${base('pl-time')}
.pl-time .pl-v { font-size: 44px; font-weight: 700; letter-spacing: -.02em; color: var(--muted); }
.pl-time .pl-v.pl-hi { font-size: 76px; color: var(--fg); }
.pl-time .pl-v .pl-unit { font-size: 26px; }
.pl-time .pl-pl { font-size: 24px; font-weight: 600; color: var(--body); }
.pl-time .pl-pl.pl-hi { color: var(--fg); }
.pl-time .pl-center { display: flex; flex-direction: column; align-items: center; }
`,
	render(s) {
		const H = bodyHeight(s);
		const tm = s.timer ?? {};
		const cx = 190, cy = 300, r = 170, surface = 520;
		let svg = worktop(10, 370, surface, surface + 108);
		svg += timer(cx, cy, r, Number(tm.value ?? 0), Number(tm.max ?? 60), tm.tone ?? 'blue', surface);
		let html = tx('pl-center', cx, cy, `<span class="pl-num t-${tm.tone ?? 'blue'}" style="font-size:88px">${esc(String(tm.value ?? ''))}</span><span class="pl-sub">${fmt(tm.sub ?? '')}</span>`, { align: 'cc', nolint: true });
		// The ticket on its side: a strip with torn ends.
		const x0 = 470, x1 = W, y0 = 250, y1 = 410;
		let d = `M ${x0} ${y0} H ${x1}`;
		for (let y = y0; y < y1; y += 20) d += ` L ${x1 - 10} ${Math.min(y1, y + 10)} L ${x1} ${Math.min(y1, y + 20)}`;
		d += ` H ${x0}`;
		for (let y = y1; y > y0; y -= 20) d += ` L ${x0 + 10} ${Math.max(y0, y - 10)} L ${x0} ${Math.max(y0, y - 20)}`;
		svg += `<path d="${d} Z" fill="#fff" stroke="var(--line-strong)" stroke-width="3" stroke-linejoin="round"/>`;
		const parts = s.parts ?? [];
		const total = parts.reduce((a, p) => a + p.seconds, 0);
		const gx0 = x0 + 26, gx1 = x1 - 26, gap = 8, span = gx1 - gx0 - gap * (parts.length - 1);
		let x = gx0;
		if (s.kicker) html += tx('lbl', x0, 150, fmt(s.kicker), { nolint: true });
		parts.forEach((p, i) => {
			const w = (p.seconds / total) * span, tone = p.tone ?? 'neutral';
			svg += `<rect x="${r1(x)}" y="${y0 + 26}" width="${r1(w)}" height="${y1 - y0 - 52}" rx="10" fill="${p.hi ? `var(--${tone})` : mix(tone, 22)}"/>`;
			const lx = x;
			const o = { nolint: true };
			html += tx(`pl-pl${p.hi ? ` pl-hi t-${tone}` : ''}`, lx, y0 - 12, fmt(p.label), { ...o, style: ';transform:translateY(-100%);line-height:1.2' });
			html += tx(`pl-v${p.hi ? ` pl-hi t-${tone}` : ''}`, lx, y1 + (p.hi ? 18 : 46), `${esc(p.value)}<span class="pl-unit">${esc(s.unit ?? 'min')}</span>`, o);
			x += w + gap;
		});
		if (s.note) html += tx('pl-sub', x0, 610, `${ic(s.note.icon ?? 'info', 26)} ${fmt(s.note.text)}`, { style: ';display:flex;align-items:center;gap:10px' });
		return heading(s) + body(`<div class="pl-time" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** The pass: the delivered video on a screen (a real frame), the order's ticket done on its spike, and the contact
 * sheet standing beside them. Fields: eyebrow, title, video: { src, alt, time, label }, ticket: { head, lines, stamp },
 * sheet: { src, alt, label, tile (repeat one still as a grid of thumbnails) }, spikeLabel. */
D['pl-pass'] = {
	css: `${base('pl-pass')}
.pl-pass .pl-card { position: absolute; background: #fff; border: 3px solid var(--line-strong); border-radius: 10px; overflow: hidden; }
.pl-pass .pl-card img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; }
.pl-pass .pl-card .pl-thumb { position: absolute; border-radius: 2px; object-fit: cover; }
`,
	render(s) {
		const H = bodyHeight(s), top = 560;
		let svg = worktop(10, W - 20, top, H - 2);
		let html = '';
		const v = s.video ?? {};
		const sw = 760, sh = (sw * 9) / 16;
		const sy = top - 12 - 30 - (sh + 28 + 44) + 14;
		const sc = screen(40, sy, sw, v.src ?? '', top, { time: v.time, alt: v.alt, progress: v.progress });
		svg += sc.svg;
		html += sc.html;
		// The spike: a rod on a heavy base, the done ticket skewered on it.
		const kx = 1080;
		svg += `<rect x="${kx - 70}" y="${top - 22}" width="140" height="22" rx="8" fill="var(--ink)"/>`;
		svg += `<path d="M ${kx} ${top - 22} V 34 L ${kx - 3} 28" stroke="var(--muted)" stroke-width="6" stroke-linecap="round" fill="none"/>`;
		const tk = s.ticket ?? {};
		html += ticket({ x: kx - 190, y: 64, w: 380, h: 440, head: tk.head, lines: tk.lines, lineY: 96, pitch: 54, stamp: tk.stamp ? { ...tk.stamp, y: 330 } : null });
		svg += `<rect x="${kx - 3}" y="${top - 56}" width="6" height="34" fill="var(--muted)"/>`;
		html += `<svg class="pl-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><circle cx="${kx}" cy="84" r="9" fill="var(--muted)"/></svg>`;
		// The contact sheet, a card standing on the pass.
		const sh2 = s.sheet ?? {};
		const rel = asset(sh2.src ?? '');
		// A real contact sheet fills the card; with tile: true, one still is repeated as a grid of thumbnails.
		const cw = 340, chh = top - 40 - 22;
		let inner = '';
		if (rel && sh2.tile) {
			const cols = 2, g = 12, tw = (cw - 6 - g * (cols + 1)) / cols, th = (tw * 9) / 16, rows = Math.floor((chh - 6 - g) / (th + g));
			for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) inner += `<img class="pl-thumb" src="${esc(rel)}" alt="" style="${at(g + c * (tw + g), g + r * (th + g), tw, th)}">`;
		} else if (rel) {
			inner = `<img src="${esc(rel)}" alt="${esc(sh2.alt ?? '')}">`;
		}
		html += `<div class="pl-card" style="${at(1360, 40, cw, chh)}">${inner}</div>`;
		svg += `<path d="M 1380 ${top - 22} H 1680 L 1690 ${top} H 1370 Z" fill="var(--faint)"/>`;
		html += label(420, 604, { icon: 'video', text: v.label ?? '' }, { align: 'c' });
		html += label(kx, 604, { icon: 'receipt', text: s.spikeLabel ?? '' }, { align: 'c' });
		html += label(1530, 604, { icon: 'image', text: sh2.label ?? '' }, { align: 'c' });
		return heading(s) + body(`<div class="pl-pass" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** Three habits, as three things on one counter: the crates stocked first, the ticket that says why it stopped, and
 * the timer. Fields: eyebrow, title, items (3): [{ title, sub }], ticket: { head, lines, stamp }, timer: { value,
 * max, label }. */
D['pl-habits'] = {
	css: `${base('pl-habits')}
.pl-habits .pl-ht { font-size: 34px; font-weight: 700; color: var(--ink); text-align: center; }
.pl-habits .pl-hs { font-size: 24px; color: var(--body); text-align: center; }
`,
	render(s) {
		const H = bodyHeight(s), top = 500;
		let svg = `<rect x="0" y="${top}" width="${W}" height="18" rx="4" fill="var(--line-strong)"/>`;
		let html = '';
		const cx = [288, 864, 1440];
		// 1: three crates, stocked, one with the source's logo.
		[[cx[0] - 124, top - 110], [cx[0] + 4, top - 110], [cx[0] - 60, top - 220]].forEach(([x, y], i) => {
			const c = crate(x, y, 120, 110, { logo: i === 2 ? (s.sourceLogo) : null, check: i === 2 });
			svg += c.svg;
			html += c.html;
		});
		// 2: the ticket that says why it stopped, standing in a clip on the counter.
		const tk = s.ticket ?? {};
		svg += `<rect x="${cx[1] - 70}" y="${top - 22}" width="140" height="22" rx="8" fill="var(--ink)"/><path d="M ${cx[1]} ${top - 22} V 70 L ${cx[1] - 3} 64" stroke="var(--muted)" stroke-width="6" stroke-linecap="round" fill="none"/>`;
		html += ticket({ x: cx[1] - 150, y: 110, w: 300, h: 280, head: tk.head, lines: tk.lines, lineY: 92, pitch: 52, stamp: tk.stamp ? { ...tk.stamp, y: 170 } : null });
		html += `<svg class="pl-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><circle cx="${cx[1]}" cy="130" r="9" fill="var(--muted)"/></svg>`;
		// 3: the timer.
		const tm = s.timer ?? {};
		svg += timer(cx[2], 320, 140, Number(tm.value ?? 0), Number(tm.max ?? 60), 'blue', top);
		html += tx('pl-num', cx[2], 320, `<span style="display:flex;flex-direction:column;align-items:center"><span style="font-size:64px;color:var(--blue)">${esc(tm.label ?? '')}</span><span class="pl-sub" style="font-weight:400">${esc(tm.sub ?? '')}</span></span>`, { align: 'cc', nolint: true });
		(s.items ?? []).forEach((it, i) => {
			html += tx('pl-ht', cx[i], top + 52, fmt(it.title), { align: 'c' });
			if (it.sub) html += tx('pl-hs', cx[i], top + 108, fmt(it.sub), { align: 'c' });
		});
		return heading(s) + body(`<div class="pl-habits" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

/** The close, on a blue page: a service bell on the left (how to order), and a menu board on an easel listing what
 * is now on the menu. Fields: eyebrow, title, bell: { text, code }, board: { label, items: [{ icon, title, sub, pill:
 * { text, tone }, date }] }. */
D['pl-menu'] = {
	css: `${base('pl-menu')}
.pl-menu .pl-bell { color: #fff; font-size: 28px; font-weight: 600; text-align: center; }
.pl-menu .pl-code { color: #fff; font-family: var(--mono); font-size: 24px; text-align: center; }
.pl-menu .pl-board { position: absolute; background: #fff; border-radius: 18px; }
.pl-menu .pl-row { position: absolute; display: flex; align-items: center; gap: 24px; }
.pl-menu .pl-mt { font-size: 32px; font-weight: 700; color: var(--ink); }
.pl-menu .pl-ms { font-family: var(--mono); font-size: 22px; color: var(--body); margin-top: 4px; }
.pl-menu .pl-md { font-size: 22px; color: var(--muted); }
.pl-menu .pl-ml { color: var(--blue); }
`,
	render(s) {
		const H = bodyHeight(s), floor = 670;
		let svg = `<line x1="0" y1="${floor}" x2="${W}" y2="${floor}" stroke="${mix('blue', 55)}" stroke-width="${SW}"/>`;
		// The bell: a base, a dome and its button.
		const bx = 260;
		svg += `<rect x="${bx - 200}" y="${floor - 44}" width="400" height="44" rx="10" fill="#fff"/>`;
		svg += `<path d="M ${bx - 170} ${floor - 44} C ${bx - 170} ${floor - 270} ${bx + 170} ${floor - 270} ${bx + 170} ${floor - 44} Z" fill="${mix('blue', 20)}" stroke="#fff" stroke-width="6"/>`;
		svg += `<path d="M ${bx - 110} ${floor - 100} C ${bx - 100} ${floor - 170} ${bx - 50} ${floor - 206} ${bx} ${floor - 210}" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>`;
		svg += `<rect x="${bx - 9}" y="${floor - 262}" width="18" height="56" fill="#fff"/><rect x="${bx - 40}" y="${floor - 278}" width="80" height="18" rx="9" fill="#fff"/>`;
		const b = s.bell ?? {};
		let html = tx('pl-bell', bx, 190, fmt(b.text ?? ''), { align: 'c', nolint: true });
		if (b.code) html += tx('pl-code', bx, 240, esc(b.code), { align: 'c', nolint: true });
		// The menu board on its easel.
		const X0 = 620, X1 = W, Y0 = 0, Y1 = 560;
		svg += `<path d="M ${X0 + 160} ${Y1} L ${X0 + 100} ${floor} M ${X1 - 160} ${Y1} L ${X1 - 100} ${floor} M ${(X0 + X1) / 2} ${Y1} V ${floor}" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`;
		svg += `<rect x="${X0 + 30}" y="${Y1 - 6}" width="${X1 - X0 - 60}" height="22" rx="6" fill="${mix('blue', 20)}"/>`;
		html += `<div class="pl-board" data-on="#ffffff" style="${at(X0, Y0, X1 - X0, Y1 - Y0)}">`;
		const bd = s.board ?? {};
		html += tx('lbl pl-ml', 48, 36, fmt(bd.label ?? ''), { nolint: true });
		(bd.items ?? []).forEach((it, i) => {
			const y = 96 + i * 150;
			if (i) html += `<div class="pl-obj" style="${at(48, y - 22, X1 - X0 - 96, 2)};background:var(--line)"></div>`;
			const tone = it.pill?.tone ?? 'green';
			html += `<div class="pl-row" style="${at(48, y, X1 - X0 - 96, 110)}"><span class="pl-obj" style="position:static">${it.logo ? logo(it.logo, 64) : ic(it.icon ?? 'video', 56, `var(--${tone})`)}</span><div style="flex:1">${t('pl-mt', '', fmt(it.title))}${it.sub ? t('pl-ms nolint', '', esc(it.sub)) : ''}</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${it.pill ? pill({ ...it.pill, tone }) : ''}${it.date ? t('pl-md nolint', '', fmt(it.date)) : ''}</div></div>`;
		});
		html += '</div>';
		return heading(s) + body(`<div class="pl-menu" style="height:${H}px">${svgEl(W, H, svg)}${html}</div>`, { vcenter: false });
	},
};

export const designs = D;
