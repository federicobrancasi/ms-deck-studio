// A gallery for inspiration (the kitchen world): read it for technique: one fully drawn character helper (the chef) reused in every pose, a pass with tickets and a bell, plates that stack into a result. A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as they are.
// Every visible word comes from the slide's fields. One kitchen, one object: the order ticket (an order, a dish or a version)
// hangs from a steel rail on every page; the cooks are chefs drawn in one helper, each with its own accent colour and,
// optionally, an icon and a short name on its apron. examples/tasting-pass.mjs uses all ten.
//   gk-cover-pass: cover: a ticket rail with the result ticket, three chefs at the pass (cook, taste, re-plate)
//   gk-rail:       a rail of dish tickets; an order checks them in order and drops to the first match: one chef alone
//   gk-pass:       the tasting pass, 3 clicks: a chef cooks, the head chef scores 1-5, below 3 a second chef re-plates
//   gk-four:       the same rail with a few tickets lit, each dropping to its three-chef line
//   gk-spikes:     order spikes: tickets impaled on a spike, one per unit; small piles alone, a tall one together
//   gk-hang:       recipe tickets on a rail: each ticket is a version, its length below the baseline is its gain
//   gk-tally:      100 tickets per group: the baseline grey, the extra green, the rest open
//   gk-recipes:    two order tickets (short and long recipe) with their gain and a price tag each
//   gk-menu:       the menu: the regular card unchanged, a specials card behind a flag, note tickets stamped on a rail
//   gk-bell:       a closing page (blue): next steps as tickets on the rail, a service bell on the counter
import { W, STYLE, at, t, mix, wob, r1, esc, fmt, ic, logo, heading, body, bodyHeight, msLogo, pill } from '../src/kit.mjs';

const SW = STYLE.stroke;
const P = (d, stroke, w = SW, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${r1(w)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const svg = (w, h, inner, cls = 'gk-svg') => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;
const STEEL = 'var(--track)';

/** The shared text classes of design n. */
const base = n => `
.${n} { position: relative; width: ${W}px; }
.${n} .gk-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .gk-tx { position: absolute; white-space: nowrap; }
.${n} .gk-cx { transform: translateX(-50%); text-align: center; }
.${n} .gk-rx { transform: translateX(-100%); text-align: right; }
.${n} .gk-logo { position: absolute; line-height: 0; }
.${n} .gk-ic { position: absolute; line-height: 0; }
.${n} .gk-name { font-size: 26px; font-weight: 600; color: var(--ink); line-height: 1.15; }
.${n} .gk-sub { font-size: 22px; color: var(--body); line-height: 1.25; }
.${n} .gk-num { font-size: 46px; font-weight: 700; letter-spacing: -.02em; line-height: 1; color: var(--fg, var(--ink)); font-variant-numeric: tabular-nums; }
.${n} .gk-big { font-size: 88px; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: var(--fg, var(--ink)); font-variant-numeric: tabular-nums; }
.${n} .gk-chip { white-space: nowrap; font-size: 20px; font-weight: 700; line-height: 1; padding: 6px 11px; border-radius: 999px; border: 2.5px solid var(--fg); color: var(--fg); background: var(--tint); }
.${n} .gk-chip.gk-solid { background: var(--fg); color: #fff; }
.${n} .gk-chip.gk-ghost { background: #fff; border-color: var(--faint); color: var(--body); font-weight: 600; }
.${n} .gk-ctag { font-weight: 700; line-height: 1.2; }
.${n} .gk-rule { font-size: 17px; font-weight: 700; line-height: 1; color: var(--muted); font-variant-numeric: tabular-nums; }
.${n} .gk-mute { opacity: .45; }
.${n} .gk-hid { visibility: hidden; }
.${n} .lbl { color: var(--fg, var(--muted)); }
`;
/** A text element at (x, y): cls adds gk-cx (centred on x) or gk-rx (right edge on x). */
const T = (cls, x, y, html, o = {}) => t(`gk-tx ${cls}`, at(x, y, o.w, o.h) + (o.style ? `;${o.style}` : ''), html, o);
/** A Fluent icon centred on (cx, cy). */
const I = (name, cx, cy, size, color) => `<div class="gk-ic" style="${at(cx - size / 2, cy - size / 2, size, size)}">${ic(name, size, color)}</div>`;
/** A brand mark centred on (cx, cy). */
const L = (slug, cx, cy, size, extra = '') => slug ? `<div class="gk-logo${extra}" style="${at(cx - size / 2, cy - size / 2, size, size)}">${logo(slug, size)}</div>` : '';
/** A chip (a building block of a recipe): tone, solid or ghost (context). */
const chip = (text, tone = 'blue', kind = '') => `<span class="gk-chip t-${tone}${kind ? ` gk-${kind}` : ''} nolint" data-t>${esc(text)}</span>`;

// ---------- the drawn objects ----------

/** The order ticket: a paper slip with a straight top (slid under the rail) and a torn bottom edge.
 * o: { tone, lit (outline in the tone), head (header band height), headFill, fill, lines (grey lines), lineTop, sw, op, stroke } */
function ticket(x, y, w, h, o = {}) {
	const tone = o.tone ?? 'neutral';
	const z = o.z ?? Math.max(3, Math.min(10, w * 0.06));
	const n = Math.max(2, Math.round(w / (z * 2.4)));
	let d = `M ${r1(x)} ${r1(y)} H ${r1(x + w)} V ${r1(y + h - z)}`;
	for (let i = 0; i < n; i++) {
		const xa = x + w - (w * i) / n, xb = x + w - (w * (i + 1)) / n;
		d += ` L ${r1((xa + xb) / 2)} ${r1(y + h)} L ${r1(xb)} ${r1(y + h - z)}`;
	}
	d += ' Z';
	const op = o.op != null ? ` opacity="${o.op}"` : '';
	const stroke = o.stroke ?? (o.lit ? `var(--${tone})` : 'var(--faint)');
	const sw = o.sw ?? 3;
	let g = `<g${op}><path d="${d}" fill="${o.fill ?? '#fff'}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
	if (o.head) {
		g += `<rect x="${r1(x + sw / 2)}" y="${r1(y + sw / 2)}" width="${r1(w - sw)}" height="${r1(o.head - sw / 2)}" fill="${o.headFill ?? mix(tone, o.lit ? 24 : 12)}"/>`;
		g += `<line x1="${r1(x)}" y1="${r1(y + o.head)}" x2="${r1(x + w)}" y2="${r1(y + o.head)}" stroke="${stroke}" stroke-width="2" stroke-dasharray="3 6"/>`;
	}
	for (let i = 0; i < (o.lines ?? 0); i++) {
		const ly = y + (o.lineTop ?? (o.head ?? 0) + 18) + i * (o.lineGap ?? 16);
		g += `<line x1="${r1(x + w * 0.16)}" y1="${r1(ly)}" x2="${r1(x + w * (0.84 - (i % 3) * 0.14))}" y2="${r1(ly)}" stroke="var(--line-strong)" stroke-width="3" stroke-linecap="round"/>`;
	}
	return `${g}</g>`;
}

/** The steel ticket rail screwed to the wall: two brackets and a bar. Draw it after the tickets: it holds their tops. */
function rail(x0, x1, y, o = {}) {
	const c = o.color ?? 'var(--faint)', fill = o.fill ?? STEEL;
	let g = '';
	for (const bx of [x0 + 18, x1 - 18]) {
		g += `<rect x="${r1(bx - 6)}" y="${r1(y - 30)}" width="12" height="30" fill="${c}"/>`;
		g += `<circle cx="${r1(bx)}" cy="${r1(y - 30)}" r="8" fill="${fill}" stroke="${c}" stroke-width="3"/>`;
	}
	return g + `<rect x="${r1(x0)}" y="${r1(y - 9)}" width="${r1(x1 - x0)}" height="18" rx="9" fill="${fill}" stroke="${c}" stroke-width="3"/>`;
}

/** The pass: a steel counter top with a bright edge, over a front panel in sections with rivets and a kick line.
 * Cooks stand behind it, plates and pans sit on it. d: depth of the front panel. */
function counter(x0, x1, y, d = 58, o = {}) {
	const fx0 = x0 + 14, fw = x1 - x0 - 28;
	let g = `<rect x="${r1(fx0)}" y="${r1(y + 14)}" width="${r1(fw)}" height="${r1(d + 2)}" fill="${o.front ?? 'var(--surface)'}" stroke="${o.panel ?? 'var(--line-strong)'}" stroke-width="3"/>`;
	if (d >= 30 && o.seams !== false) {
		const n = Math.max(1, Math.round(fw / 300)), pw = fw / n;
		for (let i = 0; i < n; i++) {
			const px = fx0 + i * pw;
			if (i) {
				g += `<line x1="${r1(px)}" y1="${r1(y + 16)}" x2="${r1(px)}" y2="${r1(y + d + 14)}" stroke="var(--line-strong)" stroke-width="2"/>`;
			}
			for (const rx of [px + 16, px + pw - 16]) {
				g += `<circle cx="${r1(rx)}" cy="${r1(y + 28)}" r="3.2" fill="var(--faint)"/>`;
			}
		}
		g += `<line x1="${r1(fx0 + 2)}" y1="${r1(y + d + 4)}" x2="${r1(fx0 + fw - 2)}" y2="${r1(y + d + 4)}" stroke="var(--line)" stroke-width="2"/>`;
	}
	g += `<rect x="${r1(x0)}" y="${r1(y)}" width="${r1(x1 - x0)}" height="16" rx="6" fill="${o.top ?? STEEL}" stroke="${o.edge ?? 'var(--faint)'}" stroke-width="3"/>`;
	return g + `<line x1="${r1(x0 + 10)}" y1="${r1(y + 5)}" x2="${r1(x1 - 10)}" y2="${r1(y + 5)}" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
}

// ---------- the chef: one drawing for every cook, on every slide ----------
// Units: 1 = 1 px at k = 1; x from the chef's centre, y up from the counter top (by). The outline is purple;
// each chef's accent (gold, magenta, teal, indigo) is on the neckerchief, the apron and its trim.
const SKIN = mix('orange', 14), OUTLINE = 'var(--purple)';
const chefUnits = (cx, by, k) => [v => r1(cx + v * k), v => r1(by - v * k), r1(Math.max(1.8, 3.6 * k)), r1(Math.max(1.2, 2.2 * k))];
const accentOf = o => o.accent ?? 'purple';
/** Whether the chef's apron shows the short name beside its badge (only when there is room to read it). */
const named = (o, k) => !!o.tag && k >= 0.8;
/** Toque height (the pleated part above the band): the head chef's is taller. */
const toqueH = tall => (tall ? 94 : 68);
/** Top of a chef's toque above the counter, in px. */
const cookTop = (k, tall) => (212 + toqueH(tall) * 1.16) * k;

/** A chef from the waist up, behind the counter whose top is at by: a pleated toque with a band (o.tall: the head
 * chef's), a friendly face, a double-breasted jacket with two rows of buttons, a neckerchief and a waist apron in the
 * chef's accent, a white badge for an icon or a logo. Draw it before the counter; chefFront (arms, hands and what they hold)
 * after it, and chefTag (badge mark and name, HTML) with the text. o: { accent, tag, tall, op }. */
function chef(cx, by, k = 1, o = {}) {
	const [X, Y, sw, thin] = chefUnits(cx, by, k), A = `var(--ag-${accentOf(o)})`, At = `var(--ag-${accentOf(o)}-t)`;
	const op = o.op != null ? ` opacity="${o.op}"` : '';
	let g = `<g${op}>`;
	// Neck, then the jacket: square shoulders, straight sides.
	g += `<rect x="${X(-11)}" y="${Y(142)}" width="${r1(22 * k)}" height="${r1(26 * k)}" fill="${SKIN}" stroke="${OUTLINE}" stroke-width="${sw}"/>`;
	g += `<path d="M ${X(-66)} ${Y(-4)} V ${Y(80)} C ${X(-66)} ${Y(106)} ${X(-54)} ${Y(116)} ${X(-28)} ${Y(121)} L ${X(-12)} ${Y(125)} L ${X(12)} ${Y(125)} L ${X(28)} ${Y(121)} C ${X(54)} ${Y(116)} ${X(66)} ${Y(106)} ${X(66)} ${Y(80)} V ${Y(-4)} Z" fill="#fff" stroke="${OUTLINE}" stroke-width="${sw}" stroke-linejoin="round"/>`;
	// Double-breasted: the front flap crosses to the right, with two rows of buttons either side of its edge.
	g += P(`M ${X(-12)} ${Y(124)} Q ${X(14)} ${Y(114)} ${X(15)} ${Y(96)} V ${Y(44)}`, mix('purple', 45), thin);
	for (const bx of [-3, 33]) {
		for (const yy of [56, 74, 92]) {
			g += `<circle cx="${X(bx)}" cy="${Y(yy)}" r="${r1(4.2 * k)}" fill="${mix('purple', 60)}"/>`;
		}
	}
	// The waist apron in the chef's accent: a tint with a solid waistband and trimmed edges.
	g += `<rect x="${X(-64.5)}" y="${Y(40)}" width="${r1(129 * k)}" height="${r1(44 * k)}" fill="${At}"/>`;
	g += `<rect x="${X(-64.5)}" y="${Y(44)}" width="${r1(129 * k)}" height="${r1(8 * k)}" fill="${A}"/>`;
	const lx = named(o, k) ? -38 : 0;
	g += `<circle cx="${X(lx)}" cy="${Y(19)}" r="${r1(15 * k)}" fill="#fff" stroke="${A}" stroke-width="${thin}"/>`;
	// Mandarin collar, then the neckerchief over it: a band and a knot with two tails.
	g += `<rect x="${X(-17)}" y="${Y(138)}" width="${r1(34 * k)}" height="${r1(14 * k)}" rx="${r1(4 * k)}" fill="#fff" stroke="${OUTLINE}" stroke-width="${thin}"/>`;
	g += `<path d="M ${X(-16)} ${Y(126)} Q ${X(0)} ${Y(118)} ${X(16)} ${Y(126)} L ${X(15)} ${Y(132)} Q ${X(0)} ${Y(125)} ${X(-15)} ${Y(132)} Z" fill="${A}"/>`;
	g += `<path d="M ${X(-6)} ${Y(120)} L ${X(-17)} ${Y(100)} L ${X(-6)} ${Y(103)} Z M ${X(-2)} ${Y(120)} L ${X(7)} ${Y(99)} L ${X(-5)} ${Y(104)} Z" fill="${A}" stroke="${A}" stroke-width="${thin}" stroke-linejoin="round"/>`;
	g += `<circle cx="${X(-4)}" cy="${Y(120)}" r="${r1(6 * k)}" fill="${A}"/>`;
	// The head: ears, face, hair at the temples, brows, eyes with a highlight, nose, cheeks, a smile.
	for (const s of [-1, 1]) {
		g += `<ellipse cx="${X(s * 31)}" cy="${Y(164)}" rx="${r1(7 * k)}" ry="${r1(9 * k)}" fill="${SKIN}" stroke="${OUTLINE}" stroke-width="${sw}"/>`;
	}
	g += `<ellipse cx="${X(0)}" cy="${Y(168)}" rx="${r1(31 * k)}" ry="${r1(34 * k)}" fill="${SKIN}" stroke="${OUTLINE}" stroke-width="${sw}"/>`;
	for (const s of [-1, 1]) {
		g += `<path d="M ${X(s * 29.5)} ${Y(170)} C ${X(s * 31)} ${Y(184)} ${X(s * 26)} ${Y(194)} ${X(s * 14)} ${Y(197)} L ${X(s * 21)} ${Y(186)} C ${X(s * 25)} ${Y(182)} ${X(s * 26.5)} ${Y(177)} ${X(s * 26.5)} ${Y(170)} Z" fill="${mix('neutral', 72)}"/>`;
		g += P(`M ${X(s * 18)} ${Y(181)} Q ${X(s * 12)} ${Y(185.5)} ${X(s * 6)} ${Y(181.5)}`, 'var(--ink)', thin);
		g += `<ellipse cx="${X(s * 11)}" cy="${Y(171)}" rx="${r1(3.8 * k)}" ry="${r1(4.8 * k)}" fill="var(--ink)"/>`;
		g += `<circle cx="${X(s * 11 + 1.4)}" cy="${Y(173)}" r="${r1(1.4 * k)}" fill="#fff"/>`;
		g += `<circle cx="${X(s * 19)}" cy="${Y(156)}" r="${r1(5.5 * k)}" fill="${mix('red', 24)}"/>`;
	}
	g += `<ellipse cx="${X(0)}" cy="${Y(161)}" rx="${r1(4.2 * k)}" ry="${r1(3.4 * k)}" fill="${mix('orange', 32)}"/>`;
	g += P(`M ${X(-11)} ${Y(151)} Q ${X(0)} ${Y(140)} ${X(11)} ${Y(151)}`, 'var(--ink)', Math.max(1.4, 2.6 * k));
	// The toque: a pleated crown that puffs at the top, over a band with a stitch line.
	const H = toqueH(o.tall), b1 = 212, b0 = 192, h = f => Y(b1 + H * f);
	g += `<path d="M ${X(-26)} ${Y(b1)} C ${X(-30)} ${h(0.45)} ${X(-50)} ${h(0.7)} ${X(-42)} ${h(0.92)} C ${X(-36)} ${h(1.1)} ${X(-16)} ${h(1.12)} ${X(-9)} ${h(1)} C ${X(-3)} ${h(1.16)} ${X(20)} ${h(1.15)} ${X(25)} ${h(1)} C ${X(44)} ${h(1.06)} ${X(54)} ${h(0.8)} ${X(37)} ${h(0.64)} C ${X(31)} ${h(0.45)} ${X(28)} ${h(0.2)} ${X(26)} ${Y(b1)} Z" fill="#fff" stroke="${OUTLINE}" stroke-width="${sw}" stroke-linejoin="round"/>`;
	for (const px of [-15, -5, 5, 15]) {
		g += P(`M ${X(px)} ${Y(b1 + 2)} C ${X(px * 1.1)} ${h(0.35)} ${X(px * 1.3)} ${h(0.55)} ${X(px * 1.25)} ${h(0.74)}`, mix('purple', 38), thin);
	}
	g += `<rect x="${X(-30)}" y="${Y(b1)}" width="${r1(60 * k)}" height="${r1((b1 - b0) * k)}" rx="${r1(4 * k)}" fill="#fff" stroke="${OUTLINE}" stroke-width="${sw}"/>`;
	g += P(`M ${X(-25)} ${Y((b0 + b1) / 2)} H ${X(25)}`, mix('purple', 38), thin, ` stroke-dasharray="${r1(3 * k)} ${r1(4 * k)}"`);
	return `${g}</g>`;
}

/** A chef's arms, hands and what they hold, by pose: 'cook' (a steel ladle), 'taster' (a clipboard with a score row;
 * with o.raise = [x, y] the other hand is raised to that point to hold up a scorecard), 'remake' (a balloon whisk).
 * Free hands rest on the counter. Draw it after the counter. */
function chefFront(cx, by, k = 1, o = {}) {
	const [X, Y, sw, thin] = chefUnits(cx, by, k);
	const op = o.op != null ? ` opacity="${o.op}"` : '';
	const pose = o.pose ?? 'cook';
	// A sleeve: a thick outlined stroke from the shoulder (tucked inside the jacket's edge) to the wrist, with a cuff.
	const arm = pts => {
		const d = `M ${pts.map(([x, y]) => `${X(x)} ${Y(y)}`).join(' L ')}`;
		const [[ax, ay], [bx, by2]] = pts.slice(-2), len = Math.hypot(bx - ax, by2 - ay) || 1;
		const ux = (bx - ax) / len, uy = (by2 - ay) / len, cx0 = bx - ux * 13, cy0 = by2 - uy * 13;
		const cuff = `M ${X(cx0 - uy * 12)} ${Y(cy0 + ux * 12)} L ${X(cx0 + uy * 12)} ${Y(cy0 - ux * 12)}`;
		return P(d, OUTLINE, 26 * k) + P(d, '#fff', 26 * k - 2 * sw) + P(cuff, OUTLINE, thin);
	};
	const hand = (x, y) => `<ellipse cx="${X(x)}" cy="${Y(y)}" rx="${r1(11 * k)}" ry="${r1(9 * k)}" fill="${SKIN}" stroke="${OUTLINE}" stroke-width="${sw}"/>`;
	let g = `<g${op}>`;
	if (pose === 'taster') {
		// The clipboard held against the chest by the left hand: a board, a clip, a sheet of notes.
		g += arm([[-50, 100], [-76, 72], [-60, 62]]);
		g += `<rect x="${X(-62)}" y="${Y(102)}" width="${r1(54 * k)}" height="${r1(62 * k)}" rx="${r1(5 * k)}" fill="${mix('neutral', 30)}" stroke="var(--neutral)" stroke-width="${thin}"/>`;
		g += `<rect x="${X(-57)}" y="${Y(94)}" width="${r1(44 * k)}" height="${r1(50 * k)}" fill="#fff"/>`;
		g += P(`M ${X(-53)} ${Y(84)} H ${X(-18)} M ${X(-53)} ${Y(74)} H ${X(-24)} M ${X(-53)} ${Y(64)} H ${X(-30)}`, 'var(--line-strong)', thin);
		g += `<rect x="${X(-45)}" y="${Y(108)}" width="${r1(20 * k)}" height="${r1(9 * k)}" rx="${r1(2 * k)}" fill="var(--neutral)"/>`;
		g += hand(-60, 62);
		if (o.raise) {
			const ux = (o.raise[0] - cx) / k, uy = (by - o.raise[1]) / k;
			g += arm([[60, 104], [(60 + ux) / 2 + 14, (104 + uy) / 2 - 18], [ux, uy]]);
			g += hand(ux, uy);
		} else {
			g += arm([[50, 100], [74, 54], [58, -1]]) + hand(58, -1);
		}
	} else {
		g += arm([[-50, 100], [-74, 54], [-58, -1]]) + hand(-58, -1);
		// The tool is held upright beside the body: drawn first, so the sleeve and the fist cover its lower end.
		if (pose === 'remake') {
			// A balloon whisk: a steel handle and wire loops.
			g += P(`M ${X(86)} ${Y(58)} L ${X(86)} ${Y(92)}`, 'var(--neutral)', 7 * k);
			for (const w of [5, 11, 17]) {
				g += P(`M ${X(85)} ${Y(92)} C ${X(85 - w)} ${Y(112)} ${X(86 - w)} ${Y(146)} ${X(86)} ${Y(152)} C ${X(86 + w)} ${Y(146)} ${X(87 + w)} ${Y(112)} ${X(87)} ${Y(92)}`, 'var(--muted)', thin);
			}
		} else {
			// A steel ladle, bowl up.
			g += P(`M ${X(86)} ${Y(58)} L ${X(86)} ${Y(128)}`, 'var(--neutral)', 5 * k);
			g += `<ellipse cx="${X(86)}" cy="${Y(138)}" rx="${r1(11 * k)}" ry="${r1(12 * k)}" fill="${STEEL}" stroke="var(--neutral)" stroke-width="${thin}"/>`;
		}
		g += arm([[50, 100], [76, 50], [84, 74]]);
		g += hand(84, 76);
	}
	return `${g}</g>`;
}

/** The badge mark (and, when there is room, the short name) on a chef's apron, as HTML. c: { tag, accent, icon | logo }. */
function chefTag(c, cx, by, k = 1, extra = '') {
	if (!c) {
		return '';
	}
	const o = typeof c === 'string' ? { logo: c } : c;
	const size = Math.max(16, Math.round(21 * k));
	// The badge shows a brand logo (to name a product) or a Fluent icon; neither by default.
	const mark = (x, y) => (o.logo ? L(o.logo, x, y, size, extra) : o.icon ? `<div class="gk-ic${extra}" style="${at(x - size / 2, y - size / 2, size, size)}">${ic(o.icon, size, `var(--ag-${accentOf(o)})`)}</div>` : '');
	if (!named(o, k)) {
		return mark(cx, by - 19 * k);
	}
	return mark(cx - 38 * k, by - 19 * k)
		+ T(`gk-ctag nolint${extra}`, cx - 18 * k, by - 19 * k - 10.2 * k, esc(o.tag), { style: `font-size:${r1(17 * k)}px;color:var(--ag-${accentOf(o)})` });
}

/** A plate on the counter top at y, seen from the front: a rim, a dish in the tone with a drizzle (a draft is neutral,
 * a finished one green, with a little steam). */
function plate(cx, y, k = 1, tone = 'neutral', o = {}) {
	const op = o.op != null ? ` opacity="${o.op}"` : '';
	const x = v => r1(cx + v * k), yy = v => r1(y - v * k);
	let g = `<g${op}><ellipse cx="${x(0)}" cy="${yy(7)}" rx="${r1(58 * k)}" ry="${r1(12 * k)}" fill="#fff" stroke="var(--faint)" stroke-width="3"/>`;
	g += `<ellipse cx="${x(0)}" cy="${yy(8)}" rx="${r1(40 * k)}" ry="${r1(6.5 * k)}" fill="none" stroke="var(--line)" stroke-width="2"/>`;
	for (const [fx, fy, fr] of [[-17, 18, 13], [17, 18, 13], [0, 30, 14]]) {
		g += `<circle cx="${x(fx)}" cy="${yy(fy)}" r="${r1(fr * k)}" fill="${mix(tone, 32)}" stroke="var(--${tone})" stroke-width="3"/>`;
	}
	g += P(`M ${x(-6)} ${yy(38)} q ${r1(5 * k)} ${r1(-4 * k)} ${r1(10 * k)} 0`, `var(--${tone})`, 2.5);
	if (o.steam ?? tone === 'green') {
		for (const sx of [-12, 2, 16]) {
			g += P(`M ${x(sx)} ${yy(52)} c ${r1(-6 * k)} ${r1(-8 * k)} ${r1(6 * k)} ${r1(-12 * k)} 0 ${r1(-22 * k)}`, 'var(--faint)', 2.5);
		}
	}
	return `${g}</g>`;
}

/** A stack of n clean plates on the counter top at y, seen from the front. */
function plates(cx, y, n = 5, k = 1) {
	let g = '';
	for (let i = 0; i < n; i++) {
		const yy = y - 6 * k - i * 9 * k;
		g += `<ellipse cx="${r1(cx)}" cy="${r1(yy)}" rx="${r1(56 * k)}" ry="${r1(10 * k)}" fill="#fff" stroke="var(--faint)" stroke-width="3"/>`;
	}
	return g;
}

/** A saucepan on the counter top at y: a steel body with a lip and a handle to the left, a wisp of steam. */
function pan(cx, y, k = 1) {
	const x = v => r1(cx + v * k), yy = v => r1(y - v * k);
	let g = `<rect x="${x(-100)}" y="${yy(40)}" width="${r1(64 * k)}" height="${r1(10 * k)}" rx="${r1(5 * k)}" fill="var(--neutral)"/>`;
	g += `<path d="M ${x(-36)} ${yy(44)} V ${yy(6)} Q ${x(-36)} ${yy(0)} ${x(-28)} ${yy(0)} H ${x(28)} Q ${x(36)} ${yy(0)} ${x(36)} ${yy(6)} V ${yy(44)} Z" fill="${STEEL}" stroke="var(--neutral)" stroke-width="3" stroke-linejoin="round"/>`;
	g += `<rect x="${x(-41)}" y="${yy(50)}" width="${r1(82 * k)}" height="${r1(8 * k)}" rx="${r1(4 * k)}" fill="${STEEL}" stroke="var(--neutral)" stroke-width="3"/>`;
	g += P(`M ${x(-24)} ${yy(30)} H ${x(24)}`, '#fff', 3);
	for (const sx of [-10, 8]) {
		g += P(`M ${x(sx)} ${yy(58)} c ${r1(-6 * k)} ${r1(-8 * k)} ${r1(6 * k)} ${r1(-12 * k)} 0 ${r1(-22 * k)}`, 'var(--faint)', 2.5);
	}
	return g;
}

/** An arrow from (x1, y1) to (x2, y2) along a path d (default a straight line), with a head at the end. */
function arrow(d, x2, y2, ang, color, w = SW) {
	const a = (ang * Math.PI) / 180, L0 = 18, s = 10;
	const bx = x2 - Math.cos(a) * L0, by = y2 - Math.sin(a) * L0;
	const px = -Math.sin(a) * s, py = Math.cos(a) * s;
	return P(d, color, w) + `<path d="M ${r1(x2)} ${r1(y2)} L ${r1(bx + px)} ${r1(by + py)} L ${r1(bx - px)} ${r1(by - py)} Z" fill="${color}"/>`;
}

/** The service bell on the counter top at y: a two-step base, a domed bell with a highlight, the plunger and its knob. */
function bell(cx, y, k = 1, o = {}) {
	const c = o.color ?? 'var(--ink)', fill = o.fill ?? STEEL;
	return `<rect x="${r1(cx - 56 * k)}" y="${r1(y - 10 * k)}" width="${r1(112 * k)}" height="${r1(10 * k)}" rx="${r1(4 * k)}" fill="${c}"/>`
		+ `<rect x="${r1(cx - 48 * k)}" y="${r1(y - 17 * k)}" width="${r1(96 * k)}" height="${r1(8 * k)}" rx="${r1(3 * k)}" fill="${c}"/>`
		+ `<path d="M ${r1(cx - 44 * k)} ${r1(y - 17 * k)} C ${r1(cx - 44 * k)} ${r1(y - 79 * k)} ${r1(cx + 44 * k)} ${r1(y - 79 * k)} ${r1(cx + 44 * k)} ${r1(y - 17 * k)} Z" fill="${fill}" stroke="${c}" stroke-width="${r1(SW * k)}" stroke-linejoin="round"/>`
		+ P(`M ${r1(cx - 27 * k)} ${r1(y - 26 * k)} C ${r1(cx - 26 * k)} ${r1(y - 40 * k)} ${r1(cx - 18 * k)} ${r1(y - 48 * k)} ${r1(cx - 8 * k)} ${r1(y - 52 * k)}`, '#fff', 4 * k)
		+ `<rect x="${r1(cx - 5 * k)}" y="${r1(y - 74 * k)}" width="${r1(10 * k)}" height="${r1(13 * k)}" fill="${c}"/>`
		+ `<ellipse cx="${r1(cx)}" cy="${r1(y - 76 * k)}" rx="${r1(15 * k)}" ry="${r1(6 * k)}" fill="${c}"/>`;
}

/** A row of dish tickets hanging from a rail, numbered 1..n: lit ones in the tone, the rest muted.
 * Returns { svg, html, xs } (xs[i] is the centre of ticket i + 1). */
function ruleRail(x0, x1, y, n, o = {}) {
	const lit = new Set(o.lit ?? []), tone = o.tone ?? 'blue', pitch = (x1 - x0) / n, w = pitch * 0.8, h = o.h ?? 92;
	let g = '', html = '';
	const xs = [];
	for (let i = 0; i < n; i++) {
		const cx = x0 + (i + 0.5) * pitch, on = lit.has(i + 1);
		xs.push(cx);
		g += ticket(cx - w / 2, y, w, h + wob(i) * 4, { tone: on ? tone : 'neutral', lit: on, head: 30, lines: 3, lineGap: 14, op: on ? 1 : o.mute ?? 1, headFill: on ? `var(--${tone})` : undefined });
		html += T('gk-rule gk-cx nolint', cx, y + 7, String(i + 1), { w: w - 2, h: 20, style: `color:${on ? '#fff' : 'var(--muted)'}` });
	}
	g += rail(o.railFrom ?? x0 - 30, x1 + 30, y, o.rail);
	return { svg: g, html, xs, pitch };
}

/** The left side of a bare cover: eyebrow, title, sub, speaker, pills (the built-in title frame's classes). */
function coverLeft(s, width = 860) {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left" style="width:${width}px"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
}
/** The kitchen's sign, hanging from the top edge on two chains: a name, with an optional icon or logo. s: { text, icon, logo }. */
function sign(cx, y, w, s) {
	const h = 70;
	let g = '';
	for (const sx of [cx - w / 2 + 40, cx + w / 2 - 40]) {
		g += P(`M ${r1(sx)} 0 V ${r1(y)}`, 'var(--faint)', 3, ' stroke-dasharray="6 6"');
	}
	g += `<rect x="${r1(cx - w / 2)}" y="${r1(y)}" width="${r1(w)}" height="${h}" rx="14" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
	const mark = s.logo ? L(s.logo, cx - w / 2 + 50, y + h / 2, 38) : s.icon ? I(s.icon, cx - w / 2 + 50, y + h / 2, 38, 'var(--ink)') : '';
	const html = mark + T('gk-name nolint', cx - w / 2 + (mark ? 84 : 30), y + 19, fmt(s.text ?? ''), { w: w - 100 });
	return { svg: g, html };
}

/** The three poses at the pass, in order: the cook cooks, the taster scores, the second chef re-plates. */
const POSES = ['cook', 'taster', 'remake'];

/** A faded chef (context, not the point): body and arms in one group with one opacity, clipped at the counter top
 * except for the resting hand, so no line shows through another. Draw it after the counter. id: unique on the page. */
function chefGhost(cx, by, k, o, id, op = 0.42) {
	const clip = `<clipPath id="${id}"><rect x="${r1(cx - 200 * k)}" y="${r1(by - 340 * k)}" width="${r1(400 * k)}" height="${r1(340 * k)}"/><ellipse cx="${r1(cx - 58 * k)}" cy="${r1(by + 1 * k)}" rx="${r1(14 * k)}" ry="${r1(11 * k)}"/></clipPath>`;
	return `<defs>${clip}</defs><g opacity="${op}" clip-path="url(#${id})">${chef(cx, by, k, o)}${chefFront(cx, by, k, o)}</g>`;
}

// ---------- the designs ----------

export const designs = {
	/** Cover: a ticket rail with the result ticket (big number) and a few others, three cooks at the pass (cook, taste,
	 * fix) with their names under the counter, the kitchen's sign above. Left: eyebrow, title, sub, speaker, pills.
	 * Fields: sign: { text, icon, logo }, result: { big, label, name },
	 * cooks (3): [{ name, role, accent, tag (short name on the apron), icon or logo (on the apron badge) }]. */
	'gk-cover-pass': {
		bare: true,
		css: `${base('gk-cover-pass')}
.gk-cover-pass { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.gk-cover-pass .gk-res-big { font-size: 92px; font-weight: 700; letter-spacing: -.04em; line-height: 1; color: var(--green); font-variant-numeric: tabular-nums; }
.gk-cover-pass .gk-res-lab { font-size: 22px; font-weight: 600; color: var(--ink); line-height: 1.2; }
.gk-cover-pass .gk-res-name { font-size: 19px; font-weight: 600; color: var(--muted); line-height: 1.2; }
.gk-cover-pass .gk-role { font-size: 21px; color: var(--body); }
.gk-cover-pass .gk-name { font-size: 23px; }
`,
		render(s) {
			let g = '', html = '';
			const sg = sign(1420, 70, 440, s.sign ?? {});
			g += sg.svg;
			html += sg.html;
			// The rail, with small muted tickets and the result ticket in the middle.
			const ry = 230, rx0 = 1014, rx1 = 1824;
			[1052, 1120, 1188, 1672, 1740].forEach((x, i) => {
				g += ticket(x - 26, ry, 52, 120 + wob(i) * 10, { head: 22, lines: 4, lineGap: 16, op: 0.75 });
			});
			const tw = 360, th = 236, tx = 1420 - tw / 2;
			g += ticket(tx, ry, tw, th, { tone: 'green', lit: true, head: 52, headFill: 'var(--green-tint)', sw: SW });
			g += rail(rx0, rx1, ry);
			const r = s.result ?? {};
			html += T('gk-res-name gk-cx nolint', 1420, ry + 16, fmt(r.name ?? ''), { w: tw - 30 });
			html += T('gk-res-big gk-cx nolint', 1420, ry + 76, esc(r.big ?? ''));
			html += T('gk-res-lab gk-cx', 1420, ry + 172, fmt(r.label ?? ''), { w: tw - 30 });
			// The pass: three cooks behind the counter.
			const cy = 820, k = 1.02, xs = [1150, 1430, 1700];
			const cooks = (s.cooks ?? []).slice(0, 3);
			cooks.forEach((c, i) => {
				g += chef(xs[i], cy, k, { ...c, tall: i === 1 });
			});
			g += counter(1014, 1824, cy, 52);
			// The plate on its way from the cook to the taster, and the saucepan the fixer works from.
			g += plate(1285, cy, 0.9, 'neutral') + pan(1582, cy, 0.65);
			cooks.forEach((c, i) => {
				g += chefFront(xs[i], cy, k, { ...c, pose: c.pose ?? POSES[i] });
				html += chefTag(c, xs[i], cy, k);
				html += T('gk-name gk-cx nolint', xs[i], cy + 88, fmt(c.name ?? ''), { w: 236 });
				html += T('gk-role gk-cx', xs[i], cy + 122, fmt(c.role ?? ''), { w: 236 });
			});
			return `<div class="gk-cover-pass">${svg(1920, 1080, g)}${coverLeft(s, 890)}${html}${msLogo()}</div>`;
		},
	},

	/** How orders are sent: an order ticket on the left checks the dish tickets on the rail in order (a cross under each that
	 * doesn't match), drops at the first match to one cook working alone; other solo cooks stand muted along the counter.
	 * Fields: kicker, task (label on the order ticket), rules (count of tickets), match (the ticket that matches),
	 * cooks: [{ name, sub, on, accent, tag, icon | logo }] (the one with on: true is the match's cook), note (one line, bottom right). */
	'gk-rail': {
		css: `${base('gk-rail')}
.gk-rail .gk-note { font-size: 26px; font-weight: 600; color: var(--ink); line-height: 1.25; white-space: normal; }
`,
		render(s) {
			const H = bodyHeight(s), n = s.rules ?? 18, m = s.match ?? 8;
			let g = '', html = '';
			if (s.kicker) {
				html += T('lbl', 0, 0, fmt(s.kicker));
			}
			const ry = 72, x0 = 230, x1 = 1700;
			const rr = ruleRail(x0, x1, ry, n, { lit: [m], tone: 'blue', h: 96, railFrom: -10 });
			// The order: a ticket at the start of the rail.
			g += ticket(20, ry, 120, 150, { tone: 'blue', lit: true, head: 50, lines: 4, lineGap: 18, sw: SW });
			html += T('gk-name gk-cx nolint', 80, ry + 18, fmt(s.task ?? 'Task'), { w: 120 });
			// It checks tickets 1..m-1 (a small cross under each) and drops at rule m.
			const ly = ry + 128, xm = rr.xs[m - 1];
			for (let i = 0; i < m - 1; i++) {
				const cx = rr.xs[i];
				g += P(`M ${r1(cx - 6)} ${ly + 18} L ${r1(cx + 6)} ${ly + 30} M ${r1(cx + 6)} ${ly + 18} L ${r1(cx - 6)} ${ly + 30}`, 'var(--muted)', 2.5);
			}
			g += rr.svg;
			html += rr.html;
			html += I('checkCircle', xm + 34, ly + 20, 30, 'var(--green)');
			// The kitchen: solo cooks behind the counter; the match's cook takes the ticket.
			const cy = 550, k = 0.92, cooks = s.cooks ?? [];
			const cxs = cooks.map((c, i) => (c.on ? xm : 1060 + (i - 1) * 380));
			cooks.forEach((c, i) => {
				const x = cxs[i];
				if (c.on) {
					g += chef(x, cy, k, c);
				}
			});
			g += arrow(`M 150 ${ly} H ${r1(xm - 24)} Q ${r1(xm)} ${ly} ${r1(xm)} ${ly + 24} V ${r1(cy - cookTop(k) - 22)}`, xm, cy - cookTop(k) - 18, 90, 'var(--blue)', 3.5);
			g += counter(0, W, cy, 50);
			cooks.forEach((c, i) => {
				g += c.on ? chefFront(cxs[i], cy, k, { ...c, pose: c.pose ?? 'cook' }) : chefGhost(cxs[i], cy, k, { ...c, pose: c.pose ?? 'cook' }, `gk-ghost-${s.id}-${i}`);
				if (!i) {
					g += plates(300, cy, 6);
				}
				html += chefTag(c, cxs[i], cy, k, c.on ? '' : ' gk-mute');
				html += T(`gk-name gk-cx nolint${c.on ? '' : ' gk-mute'}`, cxs[i], cy + 78, fmt(c.name ?? ''), { w: 300 });
				if (c.sub) {
					html += T(`gk-sub gk-cx${c.on ? '' : ' gk-mute'}`, cxs[i], cy + 112, fmt(c.sub), { w: 300 });
				}
			});
			if (s.note) {
				html += T('gk-note', 0, 330, fmt(s.note), { w: 420 });
			}
			return heading(s) + body(`<div class="gk-rail" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The tasting pass, built in three clicks: (1) a cook cooks (a plate on the counter), (2) the head chef tastes
	 * and scores 1-5, and a good score goes straight to the bell along an arc over the kitchen, (3) a low score goes to a
	 * second cook, who fixes it and sends it to the bell. Every part stays at full strength once shown.
	 * Fields: kicker, ticket (the label on the ticket above the first cook), cooks (3): [{ name, role, accent, tag, icon | logo }],
	 * pass: { label } (on the arc), fix: { label } (on the way to the second
	 * cook), served (under the bell). */
	'gk-pass': {
		clicks: true,
		css: `${base('gk-pass')}
.gk-pass .gk-score { position: absolute; display: flex; gap: 6px; }
.gk-pass .gk-score span { width: 30px; height: 34px; border-radius: 7px; display: grid; place-items: center; font-size: 20px; font-weight: 700; color: var(--muted); border: 2px solid var(--line-strong); background: #fff; }
.gk-pass .gk-score span.gk-low { color: var(--orange); border-color: var(--orange); }
.gk-pass .gk-score span.gk-ok { color: var(--green); border-color: var(--green); }
.gk-pass .gk-arc-lab { font-size: 25px; font-weight: 700; }
.gk-pass .gk-name { font-size: 25px; }
`,
		render(s, ctx = {}) {
			const H = bodyHeight(s), k = ctx.step ?? 3;
			const shown = n => k >= n;
			const G = (n, inner, key = `p${n}`) => `<g data-key="${key}"${shown(n) ? '' : ' visibility="hidden"'}>${inner}</g>`;
			const hid = n => (shown(n) ? '' : ' gk-hid');
			let g1 = '', g2 = '', g3 = '', html = '';
			const cy = 486, kk = 1.08, xs = [190, 760, 1290], xb = 1630;
			const cooks = s.cooks ?? [];
			if (s.kicker) {
				html += T('lbl', 0, 0, fmt(s.kicker));
			}
			// 1: the order ticket on its rail, the first cook, the plate.
			g1 += ticket(xs[0] + 136, 56, 110, 126, { tone: 'blue', lit: true, head: 44, lines: 3, lineGap: 18, sw: 3.5 });
			g1 += rail(xs[0] + 110, xs[0] + 272, 56);
			html += T(`gk-name gk-cx nolint${hid(1)}`, xs[0] + 191, 70, fmt(s.ticket ?? ''), { w: 110 });
			g1 += chef(xs[0], cy, kk, cooks[0] ?? {});
			// 2: the head chef, with the score card raised in one hand; a good score goes to the bell over the kitchen.
			g2 += chef(xs[1], cy, kk, { ...(cooks[1] ?? {}), tall: true });
			const cardX = xs[1] + 92, cardY = cy - 286;
			// The scorecard on a short stick, held up by the taster's raised hand (drawn with the arms, after the counter).
			g2 += P(`M ${cardX + 30} ${cardY + 54} V ${cardY + 84}`, 'var(--neutral)', 7);
			g2 += `<rect x="${cardX}" y="${cardY}" width="204" height="56" rx="10" fill="#fff" stroke="var(--purple)" stroke-width="3.5"/>`;
			html += `<div class="gk-score${hid(2)}" style="${at(cardX + 12, cardY + 11)}">${[1, 2, 3, 4, 5].map(v => `<span class="nolint${v < 3 ? ' gk-low' : ' gk-ok'}" data-t>${v}</span>`).join('')}</div>`;
			// The arc: from above the taster's card, over the second cook, down to the bell.
			const ax0 = cardX + 135, ay0 = cardY - 8, ax1 = xb - 20, ay1 = cy - 120;
			g2 += arrow(`M ${ax0} ${ay0} C ${ax0 + 120} ${-10} ${ax1 - 120} ${-10} ${ax1} ${ay1}`, ax1, ay1, 70, 'var(--green)', SW);
			const pass = s.pass ?? {};
			html += T(`gk-arc-lab t-green lbl nolint${hid(2)}`, 1180, 16, fmt(pass.label ?? ''), { w: 300 });
			g2 += bell(xb, cy, 1.05);
			// 3: a low score goes along the counter to the second cook, who fixes it and rings the bell.
			g3 += chef(xs[2], cy, kk, cooks[2] ?? {});
			const counterSvg = counter(0, W, cy, 54, { seams: false });
			// Arrows along the counter front: plate -> taster (1/2), taster -> second chef (3, orange), second chef -> bell (3, green).
			const fy = cy + 43;
			const a12 = arrow(`M ${xs[0] + 110} ${fy} H ${xs[1] - 104}`, xs[1] - 100, fy, 0, 'var(--neutral)', 3.5);
			const a23 = arrow(`M ${xs[1] + 110} ${fy} H ${xs[2] - 104}`, xs[2] - 100, fy, 0, 'var(--orange)', 3.5);
			const a3b = arrow(`M ${xs[2] + 110} ${fy} H ${xb - 74}`, xb - 70, fy, 0, 'var(--green)', 3.5);
			const fix = s.fix ?? {};
			html += T(`gk-arc-lab t-orange lbl gk-cx nolint${hid(3)}`, (xs[1] + xs[2]) / 2, cy - 44, fmt(fix.label ?? ''), { w: 260 });
			let after = '';
			const front = i => chefFront(xs[i], cy, kk, { ...(cooks[i] ?? {}), pose: cooks[i]?.pose ?? POSES[i], raise: i === 1 ? [cardX + 30, cardY + 92] : null });
			after += G(1, front(0) + plate(xs[0] + 175, cy, 1.05, 'neutral'), 'a1');
			after += G(2, front(1) + a12, 'a2');
			after += G(3, front(2) + plate(xs[2] + 175, cy, 1.05, 'green') + a23 + a3b, 'a3');
			cooks.forEach((c, i) => {
				html += chefTag(c, xs[i], cy, kk, hid(i + 1));
				html += T(`gk-name gk-cx nolint${hid(i + 1)}`, xs[i], cy + 84, fmt(c.name ?? ''), { w: 300 });
				html += T(`gk-sub gk-cx${hid(i + 1)}`, xs[i], cy + 118, fmt(c.role ?? ''), { w: 300 });
			});
			html += T(`gk-name gk-cx t-green nolint${hid(2)}`, xb, cy + 84, fmt(s.served ?? ''), { w: 200 });
			html += I('checkCircle', xb, cy + 136, 34, `var(--green)${shown(2) ? '' : ';visibility:hidden'}`);
			const g = G(1, g1) + G(2, g2) + G(3, g3) + counterSvg + after;
			return heading(s) + body(`<div class="gk-pass" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A few dishes changed: the rail of dish tickets with the changed ones lit, each dropping (on its own path, never
	 * crossing) to a card with its three-chef line: three small cooks behind a short counter, and the plan in words.
	 * Fields: kicker, rules (count of tickets), rest (label for the unchanged ones), changed: [{ rule, label, cooks: [{ accent, tag, icon | logo }] x3 (the tags go under the chefs), sub }]. */
	'gk-four': {
		css: `${base('gk-four')}
.gk-four .gk-card-h { font-size: 28px; font-weight: 700; color: var(--blue); }
.gk-four .gk-plan { font-size: 24px; font-weight: 600; color: var(--ink); }
.gk-four .gk-rest { font-size: 22px; color: var(--muted); }
`,
		render(s) {
			const H = bodyHeight(s), n = s.rules ?? 18, ch = (s.changed ?? []).slice(0, 4);
			let g = '', html = '';
			if (s.kicker) {
				html += T('lbl', 0, 0, fmt(s.kicker));
			}
			const ry = 70, rr = ruleRail(40, W - 40, ry, n, { lit: ch.map(c => c.rule), tone: 'blue', h: 74, mute: 0.5 });
			g += rr.svg;
			html += rr.html;
			const cw = 396, gap = (W - 4 * cw) / 3, cTop = 300, cH = H - cTop;
			ch.forEach((c, i) => {
				const cx = i * (cw + gap) + cw / 2, sx = rr.xs[c.rule - 1];
				// Elbow paths: the one going furthest right turns highest, so no two cross.
				const lvl = 168 + (ch.length - 1 - i) * 26;
				g += arrow(`M ${r1(sx)} ${ry + 84} V ${lvl} H ${r1(cx)} V ${cTop - 10}`, cx, cTop - 6, 90, 'var(--blue)', 3.5);
				g += `<rect x="${r1(cx - cw / 2)}" y="${cTop}" width="${cw}" height="${cH}" rx="20" fill="var(--blue-tint)" stroke="var(--blue)" stroke-width="${SW}"/>`;
				html += T('gk-card-h gk-cx nolint', cx, cTop + 18, fmt(c.label ?? String(c.rule)), { w: cw - 40 });
				// Three small cooks: the cook, the taster (taller toque), the second chef.
				const k = 0.62, by = cTop + 262, xs3 = [cx - 122, cx, cx + 122];
				const cooks3 = (c.cooks ?? []).map(m => (typeof m === 'string' ? { logo: m } : m));
				xs3.forEach((x, j) => {
					g += chef(x, by, k, { ...(cooks3[j] ?? {}), tall: j === 1 });
				});
				g += counter(cx - cw / 2 + 20, cx + cw / 2 - 20, by, 38, { front: '#fff', seams: false });
				xs3.forEach((x, j) => {
					g += chefFront(x, by, k, { ...(cooks3[j] ?? {}), pose: POSES[j] });
					html += chefTag(cooks3[j], x, by, k);
					// Small chefs: the short name under each chef, on the counter front, arrows between.
					html += T('gk-plan gk-cx nolint', x, by + 18, esc(cooks3[j]?.tag ?? ''), { w: 110, style: `font-size:20px;top:${r1(by + 20)}px;color:var(--ag-${accentOf(cooks3[j] ?? {})})` });
					if (j < 2) {
						g += arrow(`M ${r1(x + 47)} ${by + 32} H ${r1(xs3[j + 1] - 50)}`, xs3[j + 1] - 46, by + 32, 0, mix('purple', 70), 3);
					}
				});
				if (c.sub) {
					html += T('gk-sub gk-cx', cx, by + 70, fmt(c.sub), { w: cw - 30 });
				}
			});
			if (s.rest) {
				html += T('gk-rest gk-rx', W, 0, fmt(s.rest));
			}
			return heading(s) + body(`<div class="gk-four" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Order spikes on a counter: tickets impaled on each spike, one per unit (default 0.1), the pile's number big
	 * on top; the last spike is the combination (green, bold), the others muted. Fields: kicker, unit (default 0.1),
	 * legend (what one ticket is), join (label on a bracket over the single piles), spikes: [{ value, big, name, chips: [], hi }]. */
	'gk-spikes': {
		css: `${base('gk-spikes')}
.gk-spikes .gk-chips { position: absolute; display: flex; gap: 8px; justify-content: center; transform: translateX(-50%); }
.gk-spikes .gk-legend { display: flex; align-items: center; gap: 12px; font-size: 22px; color: var(--body); }
`,
		render(s) {
			const H = bodyHeight(s), unit = s.unit ?? 0.1, sp = s.spikes ?? [];
			let g = '', html = '';
			if (s.kicker) {
				html += T('lbl', 0, 0, fmt(s.kicker));
			}
			const cy = 520, slab = 8.4, xs = sp.length === 4 ? [210, 560, 910, 1400] : sp.map((_, i) => 200 + i * 380);
			g += counter(0, W, cy, 34);
			sp.forEach((p, i) => {
				const x = xs[i], nT = Math.round(p.value / unit), tone = p.hi ? 'green' : 'neutral';
				const top = cy - 16 - nT * slab;
				// The spike: a base and a needle, taller than the pile.
				g += P(`M ${x} ${cy - 6} V ${r1(Math.min(top, cy - 140) - 40)}`, 'var(--ink)', 4);
				g += `<ellipse cx="${x}" cy="${cy - 2}" rx="48" ry="11" fill="var(--ink)"/>`;
				for (let j = 0; j < nT; j++) {
					const y = cy - 16 - (j + 1) * slab, a = wob(j + i * 50) * 5, w = 150 + wob(j, 3) * 8;
					g += `<g transform="rotate(${r1(a)} ${x} ${r1(y + slab / 2)})"><rect x="${r1(x - w / 2)}" y="${r1(y)}" width="${r1(w)}" height="${r1(slab - 2)}" rx="1.5" fill="${p.hi ? mix('green', 30 + (j % 2) * 18) : mix('neutral', 16 + (j % 2) * 14)}" stroke="${p.hi ? 'var(--green)' : 'var(--faint)'}" stroke-width="1.6"/></g>`;
				}
				html += T(`gk-big gk-cx t-${tone} nolint`, x, r1(Math.min(top, cy - 140) - 140), esc(p.big ?? ''), { w: 320 });
				html += T(`gk-name gk-cx nolint${p.hi ? '' : ' gk-mute'}`, x, cy + 64, fmt(p.name ?? ''), { w: 340 });
				html += `<div class="gk-chips" style="${at(x, cy + 104)}">${(p.chips ?? []).map(c => chip(c, p.hi ? 'green' : 'neutral', p.hi ? '' : 'ghost')).join('')}</div>`;
			});
			// A bracket over the single piles with a word (no arrow or equals sign into the last one: the piles are not a sum).
			if (sp.length === 4 && s.join) {
				const by = 112;
				g += P(`M ${xs[0] - 90} ${by + 18} V ${by} H ${xs[2] + 90} V ${by + 18}`, 'var(--neutral)', 3);
				html += T('lbl gk-cx', (xs[0] + xs[2]) / 2, by - 34, fmt(s.join), { w: 500 });
			}
			if (s.legend) {
				html += `<div class="gk-tx gk-legend" style="${at(W - 520, 0)}">${svg(160, 22, `<rect x="4" y="7" width="150" height="7" rx="1.5" fill="${mix('green', 40)}" stroke="var(--green)" stroke-width="1.6"/>`, '')}<span data-t>${fmt(s.legend)}</span></div>`;
			}
			return heading(s) + body(`<div class="gk-spikes" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Recipe tickets on a rail: the baseline first, then one ticket per version; a dashed line marks the baseline's length,
	 * and each version's ticket runs on below it by its gain (green), the gain big at its foot. Fields: kicker, base: { name,
	 * value }, scale (px per unit, default 80), line (label on the dashed line), tickets: [{ name, core, extra: [], gain, text, hi }]. */
	'gk-hang': {
		css: `${base('gk-hang')}
.gk-hang .gk-tn { font-size: 19px; font-weight: 700; color: var(--ink); line-height: 1.15; white-space: normal; text-align: center; }
.gk-hang .gk-chips { position: absolute; display: flex; flex-direction: column; gap: 6px; align-items: center; transform: translateX(-50%); }
.gk-hang .gk-chip { font-size: 16px; padding: 4px 8px; }
.gk-hang .gk-g { font-size: 34px; font-weight: 700; color: var(--green); font-variant-numeric: tabular-nums; }
.gk-hang .gk-g.gk-lo { font-size: 28px; color: ${mix('green', 70, 'var(--body)')}; }
`,
		render(s) {
			const H = bodyHeight(s), tk = s.tickets ?? [], sc = s.scale ?? 80;
			let g = '', html = '';
			const n = tk.length + 1, pitch = W / n, tw = pitch - 18, ry = s.kicker ? 84 : 44, baseLen = 270;
			const all = [{ name: s.base?.name, base: true, text: s.base?.value }, ...tk];
			all.forEach((p, i) => {
				const cx = i * pitch + pitch / 2, x = cx - tw / 2, len = baseLen + (p.base ? 0 : p.gain * sc);
				const hi = !!p.hi;
				g += ticket(x, ry, tw, len, { tone: p.base ? 'neutral' : 'green', lit: !p.base && hi, head: 62, sw: hi ? SW : 3, headFill: p.base ? 'var(--surface)' : hi ? 'var(--green-tint)' : '#fff' });
				if (!p.base) {
					g += `<rect x="${r1(x + 1.5)}" y="${ry + baseLen}" width="${r1(tw - 3)}" height="${r1(p.gain * sc - 9)}" fill="${mix('green', hi ? 34 : 16)}"/>`;
				}
				html += T('gk-tn gk-cx nolint', cx, ry + 8, fmt(p.name ?? ''), { w: tw - 10 });
				if (!p.base) {
					html += `<div class="gk-chips" style="${at(cx, ry + 76)}">${chip(p.core ?? 'Core', 'neutral', 'ghost')}${(p.extra ?? []).map(c => chip(c, 'blue')).join('')}</div>`;
					if (p.tag) {
						html += `<div class="gk-chips" style="${at(cx, ry + baseLen - 50)}">${chip(p.tag, p.tagTone ?? 'green', 'solid')}</div>`;
					}
				}
				html += T(`gk-g gk-cx nolint${hi ? '' : ' gk-lo'}`, cx, ry + len - (p.base ? 56 : 52), esc(p.text ?? `+${p.gain}`), { w: tw, style: p.base ? 'color:var(--body)' : '' });
			});
			g += P(`M 0 ${ry + baseLen} H ${W}`, 'var(--neutral)', 2.5, ' stroke-dasharray="6 8"');
			g += rail(-10, W + 10, ry);
			if (s.line) {
				html += T('lbl gk-cx nolint', pitch / 2, ry + baseLen + 14, fmt(s.line), { w: tw });
			}
			if (s.kicker) {
				html += T('lbl', 0, 0, fmt(s.kicker));
			}
			return heading(s) + body(`<div class="gk-hang" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** 100 tickets per row (two lines of 50): the base grey, the extra green, the rest open; the gain big
	 * on the right. Fields: kicker, legend: { base, extra, rest }, rows: [{ name, sub, base (count), extra (count), big }],
	 * note (one calm line under the rows, with an icon: note: { icon, text }). */
	'gk-tally': {
		css: `${base('gk-tally')}
.gk-tally .gk-k { display: flex; align-items: center; gap: 10px; font-size: 21px; color: var(--body); }
.gk-tally .gk-note { display: flex; align-items: center; gap: 12px; font-size: 22px; color: var(--body); }
.gk-tally .gk-g { font-size: 56px; font-weight: 700; letter-spacing: -.03em; color: var(--green); font-variant-numeric: tabular-nums; line-height: 1; }
`,
		render(s) {
			const H = bodyHeight(s), rows = s.rows ?? [];
			let g = '', html = '';
			const x0 = 330, tw = 18, th = 26, px = 22.4, py = 34, top = 70, pitch = 142;
			const kinds = { base: [mix('neutral', 34), mix('neutral', 60)], extra: ['var(--green)', 'var(--green)'], rest: ['#fff', 'var(--faint)'] };
			rows.forEach((r, i) => {
				const y = top + i * pitch;
				for (let j = 0; j < 100; j++) {
					const c = j % 50, row = Math.floor(j / 50);
					const kind = j < r.base ? 'base' : j < r.base + r.extra ? 'extra' : 'rest';
					g += ticket(x0 + c * px, y + row * py, tw, th, { fill: kinds[kind][0], stroke: kinds[kind][1], sw: 2, z: 3 });
				}
				html += T('gk-name nolint', 0, y + 2, fmt(r.name ?? ''), { w: x0 - 20 });
				html += T('gk-sub nolint', 0, y + 34, fmt(r.sub ?? ''), { w: x0 - 20 });
				html += T('gk-g nolint', x0 + 50 * px + 40, y + 2, esc(r.big ?? ''));
			});
			const lg = s.legend ?? {};
			const key = (k2, text) => `<span class="gk-k">${svg(20, 28, ticket(2, 2, 16, 24, { fill: kinds[k2][0], stroke: kinds[k2][1], sw: 2, z: 4 }), '')}<span data-t>${fmt(text)}</span></span>`;
			html += `<div class="gk-tx" style="${at(x0, 0)};display:flex;gap:34px">${key('base', lg.base ?? '')}${key('extra', lg.extra ?? '')}${key('rest', lg.rest ?? '')}</div>`;
			if (s.note) {
				html += `<div class="gk-tx gk-note" style="${at(0, top + rows.length * pitch + 4)}">${ic(s.note.icon ?? 'info', 28, 'var(--muted)')}<span data-t>${fmt(s.note.text ?? '')}</span></div>`;
			}
			return heading(s) + body(`<div class="gk-tally" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Two order tickets on one rail: a short recipe and a long one (one chip per line), each with its gain big beside it
	 * and a price tag on a string. Fields: kicker, tickets (2): [{ name, chips: [], big, label, price, priceLabel, tone }],
	 * note: { icon, text }. */
	'gk-recipes': {
		css: `${base('gk-recipes')}
.gk-recipes .gk-tn { font-size: 26px; font-weight: 700; color: var(--ink); }
.gk-recipes .gk-tag { font-size: 30px; font-weight: 700; color: var(--fg); font-variant-numeric: tabular-nums; line-height: 1; }
.gk-recipes .gk-tagl { font-size: 19px; color: var(--body); line-height: 1.2; }
.gk-recipes .gk-note { display: flex; align-items: center; gap: 12px; font-size: 22px; color: var(--body); }
`,
		render(s) {
			const H = bodyHeight(s), tk = (s.tickets ?? []).slice(0, 2);
			let g = '', html = '';
			const ry = 44, tw = 300, lh = 50, head = 66;
			const xs = [120, 960];
			tk.forEach((p, i) => {
				const x = xs[i], chips = p.chips ?? [], th = head + 26 + chips.length * lh + 14;
				g += ticket(x, ry, tw, th, { tone: 'blue', lit: true, head, headFill: 'var(--blue-tint)', sw: SW, z: 10 });
				html += T('gk-tn gk-cx nolint', x + tw / 2, ry + 18, fmt(p.name ?? ''), { w: tw - 20 });
				chips.forEach((c, j) => {
					const y = ry + head + 22 + j * lh;
					html += `<div class="gk-tx" style="${at(x + 28, y)}">${chip(c, 'blue', '')}</div>`;
					g += P(`M ${x + 196} ${y + 18} H ${x + tw - 30 - (j % 3) * 16}`, 'var(--line-strong)', 3);
				});
				// The gain, big, to the right of the ticket's head.
				const nx = x + tw + 60;
				html += T(`gk-big t-${p.tone ?? 'green'} nolint`, nx, ry + 34, esc(p.big ?? ''));
				html += T('gk-name', nx, ry + 136, fmt(p.label ?? ''), { w: 380 });
				// The price tag on a string from the ticket's edge.
				const tgx = nx + 10, tgy = ry + 236, tgw = 230, tgh = 92;
				g += P(`M ${x + tw} ${ry + 200} C ${x + tw + 40} ${ry + 220} ${tgx - 20} ${tgy + tgh / 2 - 30} ${tgx + 24} ${tgy + tgh / 2}`, 'var(--muted)', 2.5);
				g += `<path d="M ${tgx} ${tgy + tgh / 2} L ${tgx + 30} ${tgy} H ${tgx + tgw} V ${tgy + tgh} H ${tgx + 30} Z" fill="var(--${p.priceTone ?? 'orange'}-tint)" stroke="var(--${p.priceTone ?? 'orange'})" stroke-width="${SW}" stroke-linejoin="round"/>`;
				g += `<circle cx="${tgx + 24}" cy="${tgy + tgh / 2}" r="6" fill="#fff" stroke="var(--${p.priceTone ?? 'orange'})" stroke-width="3"/>`;
				html += `<div class="gk-tx" data-shape style="${at(tgx + 36, tgy, tgw - 36, tgh)}">${T(`gk-tag t-${p.priceTone ?? 'orange'} nolint`, 10, 14, esc(p.price ?? ''))}${T('gk-tagl', 10, 52, fmt(p.priceLabel ?? ''), { w: tgw - 56 })}</div>`;
			});
			g += rail(60, W - 60, ry);
			if (s.note) {
				html += `<div class="gk-tx gk-note" style="${at(0, H - 60)}">${ic(s.note.icon ?? 'info', 28, 'var(--muted)')}<span data-t>${fmt(s.note.text ?? '')}</span></div>`;
			}
			return heading(s) + body(`<div class="gk-recipes" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** What ships, as a menu: the regular menu card (unchanged, a green tick) and a specials card clipped on it with a
	 * little flag on a pin (who gets it); on the right, note tickets on a rail, each with a round stamp. Fields: kicker,
	 * menu: { label, title, lines: [], badge }, special: { label, title, lines: [], flag }, prs: [{ repo, num, text, stamp, tone }]. */
	'gk-menu': {
		css: `${base('gk-menu')}
.gk-menu .gk-mlab { font-size: 20px; }
.gk-menu .gk-mtitle { font-size: 32px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.gk-menu .gk-mline { font-size: 23px; color: var(--body); line-height: 1.3; }
.gk-menu .gk-flag { font-size: 21px; font-weight: 700; color: #fff; line-height: 1.15; white-space: normal; }
.gk-menu .gk-pr { font-size: 24px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.gk-menu .gk-prs { font-size: 21px; color: var(--body); line-height: 1.25; white-space: normal; }
.gk-menu .gk-stamp { font-size: 19px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--fg); line-height: 1.1; text-align: center; white-space: normal; }
`,
		render(s) {
			const H = bodyHeight(s);
			let g = '', html = '';
			// The regular menu: a tall card with a fold at the top, on an easel.
			const mx = 0, my = 40, mw = 880, mh = 460;
			g += P(`M ${mx + 120} ${my + mh - 20} L ${mx + 70} ${H - 6} M ${mx + mw - 120} ${my + mh - 20} L ${mx + mw - 70} ${H - 6} M ${mx + mw / 2} ${my + mh - 20} L ${mx + mw / 2} ${H - 6}`, 'var(--neutral)', 6);
			g += `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="16" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<rect x="${mx + 16}" y="${my + 16}" width="${mw - 32}" height="${mh - 32}" rx="10" fill="none" stroke="var(--line-strong)" stroke-width="2"/>`;
			const m = s.menu ?? {};
			html += T('lbl gk-mlab nolint', mx + 44, my + 44, fmt(m.label ?? ''));
			html += T('gk-mtitle nolint', mx + 44, my + 80, fmt(m.title ?? ''), { w: 350 });
			(m.lines ?? []).forEach((ln, i) => {
				html += T('gk-mline', mx + 44, my + 140 + i * 40, fmt(ln), { w: 350 });
			});
			if (m.badge) {
				html += `<div class="gk-tx t-green" style="${at(mx + 44, my + mh - 92)};display:flex;align-items:center;gap:12px">${ic('checkCircle', 34, 'var(--green)')}<span class="gk-name" style="color:var(--green)" data-t>${fmt(m.badge)}</span></div>`;
			}
			// The specials card, clipped on at a slight angle over the menu's right side, with a flag pinned on top.
			const sp = s.special ?? {}, sx = 420, sy = 236, sw2 = 420, sh = 220;
			g += `<g><rect x="${sx}" y="${sy}" width="${sw2}" height="${sh}" rx="16" fill="var(--purple-tint)" stroke="var(--purple)" stroke-width="${SW}"/>`
				+ `<rect x="${sx + sw2 / 2 - 40}" y="${sy - 16}" width="80" height="30" rx="6" fill="var(--neutral)"/></g>`;
			const inner = `<div class="lbl gk-mlab t-purple" data-t>${fmt(sp.label ?? '')}</div><div class="gk-mtitle nolint" style="margin-top:8px" data-t>${fmt(sp.title ?? '')}</div>${(sp.lines ?? []).map(l => `<div class="gk-mline" style="margin-top:8px;white-space:normal" data-t>${fmt(l)}</div>`).join('')}`;
			html += `<div class="gk-tx" style="${at(sx + 36, sy + 34, sw2 - 72, sh - 60)};white-space:normal">${inner}</div>`;
			// The flag: a pin standing in the card's corner, a pennant.
			const fx = sx + 50, fy = sy + 4;
			g += P(`M ${fx} ${sy + 2} V ${fy - 140}`, 'var(--ink)', 5);
			g += `<circle cx="${fx}" cy="${sy + 2}" r="8" fill="var(--ink)"/>`;
			g += `<path d="M ${fx + 2} ${fy - 140} H ${fx + 200} L ${fx + 176} ${fy - 104} L ${fx + 200} ${fy - 68} H ${fx + 2} Z" fill="var(--purple)"/>`;
			html += `<div class="gk-tx" data-shape style="${at(fx + 2, fy - 140, 176, 72)}">${T('gk-flag', 14, 10, fmt(sp.flag ?? ''), { w: 150, h: 56 }).replace('data-t', 'data-t data-on="#8661c5"')}</div>`;
			// The note tickets on their rail, each with a stamp.
			const prs = (s.prs ?? []).slice(0, 3), px0 = 1090, ptw = 280, ry = 60;
			prs.forEach((p, i) => {
				const x = px0 + i * (ptw + 40), th = 470;
				g += ticket(x, ry, ptw, th, { tone: p.tone ?? 'green', lit: true, head: 82, headFill: `var(--${p.tone ?? 'green'}-tint)`, lines: 3, lineTop: 380, lineGap: 18, sw: 3.5 });
				html += T('lbl nolint', x + 24, ry + 14, fmt(p.repo ?? ''), { w: ptw - 48 });
				html += T('gk-pr nolint', x + 24, ry + 42, fmt(p.num ?? ''), { w: ptw - 48 });
				html += T('gk-prs', x + 24, ry + 104, fmt(p.text ?? ''), { w: ptw - 48 });
				const scx = x + ptw / 2, scy = ry + 270;
				g += `<g transform="rotate(-10 ${scx} ${scy})"><rect x="${scx - 110}" y="${scy - 42}" width="220" height="84" rx="14" fill="none" stroke="var(--${p.tone ?? 'green'})" stroke-width="5"/><rect x="${scx - 100}" y="${scy - 32}" width="200" height="64" rx="9" fill="none" stroke="var(--${p.tone ?? 'green'})" stroke-width="2"/></g>`;
				html += `<div class="gk-tx t-${p.tone ?? 'green'}" data-shape style="${at(scx - 100, scy - 30, 200, 60)};transform:rotate(-10deg);display:grid;place-items:center">${t('gk-stamp nolint', '', fmt(p.stamp ?? ''))}</div>`;
			});
			g += rail(px0 - 30, px0 + prs.length * ptw + (prs.length - 1) * 40 + 30, ry);
			return heading(s) + body(`<div class="gk-menu" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A closing page for a blue background: next steps as white tickets on a rail (number, icon, title, sub) and a
	 * service bell on the counter at the end, with its label. Fields: eyebrow, title, steps (3): [{ icon, title, sub }], bell. */
	'gk-bell': {
		css: `${base('gk-bell')}
.gk-bell .gk-n { font-size: 22px; font-weight: 800; color: #fff; }
.gk-bell .gk-st { font-size: 30px; font-weight: 700; color: var(--ink); line-height: 1.15; white-space: normal; }
.gk-bell .gk-ss { font-size: 22px; color: var(--body); line-height: 1.3; white-space: normal; }
.gk-bell .gk-bl { font-size: 28px; font-weight: 700; color: #fff; }
`,
		render(s) {
			const H = bodyHeight(s), steps = (s.steps ?? []).slice(0, 3);
			let g = '', html = '';
			const ry = 40, tw = 360, gap = 48, x0 = 40, th = 340, cy = 590;
			steps.forEach((st, i) => {
				const x = x0 + i * (tw + gap);
				g += ticket(x, ry, tw, th, { fill: '#fff', stroke: '#fff', sw: 3, head: 70, headFill: mix('blue', 14), lines: 3, lineTop: th - 90, lineGap: 18, z: 12 });
				g += `<circle cx="${x + 46}" cy="${ry + 35}" r="22" fill="var(--blue)"/>`;
				html += T('gk-n gk-cx nolint', x + 46, ry + 22, String(i + 1), { w: 40 }).replace('data-t', 'data-t data-on="#0078d4"');
				html += `<div class="gk-ic" style="${at(x + tw - 72, ry + 16, 40, 40)}">${ic(st.icon ?? 'checkmark', 40, 'var(--blue)')}</div>`;
				html += T('gk-st', x + 30, ry + 96, fmt(st.title ?? ''), { w: tw - 60 }).replace('data-t', 'data-t data-on="#ffffff"');
				html += T('gk-ss', x + 30, ry + 176, fmt(st.sub ?? ''), { w: tw - 60 }).replace('data-t', 'data-t data-on="#ffffff"');
			});
			g += rail(x0 - 30, x0 + steps.length * (tw + gap) + 10, ry, { color: '#fff', fill: mix('blue', 60, '#ffffff') });
			// The counter at the end, the bell on it.
			const bx = 1500;
			g += `<rect x="0" y="${cy}" width="${W}" height="16" rx="6" fill="#fff"/>`;
			g += `<rect x="14" y="${cy + 16}" width="${W - 28}" height="${H - cy - 22}" fill="none" stroke="#fff" stroke-width="3"/>`;
			g += bell(bx, cy, 2, { color: '#fff', fill: mix('blue', 70, '#ffffff') });
			g += arrow(`M ${x0 + 3 * (tw + gap) - 20} ${ry + 200} C ${bx - 100} ${ry + 200} ${bx} ${ry + 260} ${bx} ${cy - 176}`, bx, cy - 172, 90, '#fff', 4);
			if (s.bell) {
				html += T('gk-bl gk-cx nolint', bx, cy + 32, fmt(s.bell), { w: 400 });
			}
			return heading(s) + body(`<div class="gk-bell" style="height:${H}px">${svg(W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
};
