// Design plugins: everyday objects that carry one idea each. Every visible word comes from the slide's fields.
//   roadsign:    a big warning sign with a change on it (and a smaller one behind it for comparison), the story beside it
//   nametag:     a "HELLO my name is" sticker with one word on it, its meaning beside it (dark page)
//   gate:        the same staircase twice: a polite note on the wall (advice) and a closed stair gate (a wall)
//   glasses:     a pair of glasses: the draft through the left lens, the rewrite through the right, the prompt between
//   gears:       a row of meshed gears, one per check, turning a bigger final gear (blue page)
//   donut:       one big share as a donut arc, a darker sliver inside it, the two numbers beside it
//   thermometer: levels on a thermometer: what is at stake on the left, what it needs on the right
//   keyring:     a ring of keys, one per credential or access level, the last one snapped in two
//   coatstand:   a bentwood coat stand with a hat on each hook (one role each), a quote or statement beside it
//   balloon:     a hot-air balloon rising as it cuts two sandbags loose, a quote or statement beside it (blue page)
//   metro:       a decision as a metro map: one line, a junction, a straight way and a loop that rejoins it
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, esc, fmt, ic, heading, body, bodyHeight, arrowHead, logo, W, r1 } from '../src/kit.mjs';

// ---------- helpers ----------

const INK = 'var(--ink)';

/** left/top (and width/height) as an inline style. */
const at = (x, y, w, h) => `left:${r1(x)}px;top:${r1(y)}px${w != null ? `;width:${r1(w)}px` : ''}${h != null ? `;height:${r1(h)}px` : ''}`;

/** An SVG layer over the whole design (the deck's .rd-svg: absolute, no pointer events). */
const layer = (H, inner) => `<svg class="rd-svg" width="${W}" height="${r1(H)}" viewBox="0 0 ${W} ${r1(H)}">${inner}</svg>`;

/** A piece of text the build can check: class, inline style, inner HTML (already formatted). */
function t(cls, style, html, { tag = 'div', fit = false } = {}) {
	return `<${tag}${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''} data-t${fit ? ' data-fit' : ''}>${html}</${tag}>`;
}

/** A theme colour mixed with white (or another colour): mix('green', 30) is a soft green. */
const mix = (tone, pct, base = '#fff') => `color-mix(in srgb, var(--${tone}) ${pct}%, ${base})`;

/** The inner paths of a Fluent icon file (e.g. 'bot_48_filled'), to draw inside our own SVG with our own fill. */
function fluent(file) {
	const raw = fs.readFileSync(path.join(ROOT, 'node_modules/@fluentui/svg-icons/icons', `${file}.svg`), 'utf8');
	return raw.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
}

/** A path through points with rounded corners (radius r). */
function rounded(pts, r = 24) {
	let d = `M ${r1(pts[0][0])} ${r1(pts[0][1])}`;
	for (let i = 1; i < pts.length - 1; i++) {
		const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
		const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
		const k = Math.min(r, l1 / 2, l2 / 2);
		const ax = x1 - ((x1 - x0) / l1) * k, ay = y1 - ((y1 - y0) / l1) * k;
		const bx = x1 + ((x2 - x1) / l2) * k, by = y1 + ((y2 - y1) / l2) * k;
		d += ` L ${r1(ax)} ${r1(ay)} Q ${r1(x1)} ${r1(y1)} ${r1(bx)} ${r1(by)}`;
	}
	const last = pts[pts.length - 1];
	return d + ` L ${r1(last[0])} ${r1(last[1])}`;
}

/** Quote marks around a text, unless the slide says quote: false (a plain statement). */
const quoted = (s, html) => (s.quote === false ? html : `\u201c${html}\u201d`);

/** An equilateral triangle with its apex at (cx, top). */
function tri(cx, top, side) {
	const h = (side * Math.sqrt(3)) / 2;
	return `M ${r1(cx)} ${r1(top)} L ${r1(cx + side / 2)} ${r1(top + h)} L ${r1(cx - side / 2)} ${r1(top + h)} Z`;
}

/** A warning sign: a tone triangle with a white field, and a wedge on the field's floor (down: the road drops). Returns
 * the SVG and the white field's top, side and height. */
function warning(cx, top, side, tone, down) {
	const h = (side * Math.sqrt(3)) / 2, edge = side * 0.048, inset = side * 0.062;
	let svg = `<path d="${tri(cx, top, side)}" fill="var(--${tone})" stroke="var(--${tone})" stroke-width="${r1(edge)}" stroke-linejoin="round"/>`;
	const cyc = top + (2 * h) / 3, inr = h / 3;
	const side2 = (side * (inr - inset)) / inr, h2 = (side2 * Math.sqrt(3)) / 2, top2 = cyc - (2 * h2) / 3;
	svg += `<path d="${tri(cx, top2, side2)}" fill="#fff" stroke="#fff" stroke-width="${r1(edge * 0.4)}" stroke-linejoin="round"/>`;
	const floor = top2 + h2 * 0.94, wh = h2 * 0.115, half = y => ((y - top2) / h2) * (side2 / 2);
	const low = down ? cx + half(floor) - side2 * 0.1 : cx - half(floor) + side2 * 0.1;
	const tall = down ? cx - half(floor - wh) + side2 * 0.08 : cx + half(floor - wh) - side2 * 0.08;
	svg += `<path d="M ${r1(low)} ${r1(floor)} L ${r1(tall)} ${r1(floor)} L ${r1(tall)} ${r1(floor - wh)} Z" fill="var(--ink)" stroke="var(--ink)" stroke-width="${r1(side * 0.012)}" stroke-linejoin="round"/>`;
	return { svg, field: { top: top2, side: side2, h: h2 } };
}

// The coat stand's wood, the hats' outlines and their highlights.
const WOOD = '#8f5a2b', WOOD_LIGHT = '#bb8350';
const GOLD = '#e0b240';
const LINE = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
const THIN = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
const SHINE = 'fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="6" stroke-linecap="round"';

/** Bentwood: a round rod along a path, an ink outline around the wood. */
function rod(d, w = 9) {
	return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round"/>`
		+ `<path d="${d}" fill="none" stroke="${WOOD}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** A point on a cubic Bézier curve [p0, p1, p2, p3] at t. */
function bez(p, tt) {
	const u = 1 - tt;
	return [0, 1].map(i => u * u * u * p[0][i] + 3 * u * u * tt * p[1][i] + 3 * u * tt * tt * p[2][i] + tt * tt * tt * p[3][i]);
}

/** A point [x, y] for an SVG path, rounded. */
const PT = p => p.map(v => r1(v)).join(' ');

/** The hats, each drawn upright and seen from the front, the middle of its opening at (0, 0). tip: how far above the
 * opening the hook's tip touches the inside of the crown; lean: how far it tips out on its hook (degrees); k: its scale. */
const HAT_SIZE = 1.2;
const HATS = {
	// A black bowler: the round felt dome, its band with a little bow, the narrow brim rolled up at the sides.
	bowler: {
		tip: 80, lean: 14, svg: `<path d="M -47 -8 C -54 -46, -40 -86, 0 -86 C 40 -86, 54 -46, 47 -8 Z" fill="#2b2b33" ${LINE}/>
<path d="M -48 -9 L -50 -26 C -18 -30, 18 -30, 50 -26 L 48 -9 C 18 -5, -18 -5, -48 -9 Z" fill="#474752" ${LINE}/>
<path d="M -37 -17 L -45 -23 L -45 -11 Z M -37 -17 L -29 -23 L -29 -11 Z" fill="#5a5a66" ${THIN}/><rect x="-40" y="-20.5" width="6" height="7" rx="1.5" fill="#5a5a66" ${THIN}/>
<path d="M -86 -21 C -80 -6, -58 2, 0 2 C 58 2, 80 -6, 86 -21 C 87 -24, 84 -27, 82 -25 C 74 -15, 56 -10, 0 -10 C -56 -10, -74 -15, -82 -25 C -84 -27, -87 -24, -86 -21 Z" fill="#2b2b33" ${LINE}/>
<path d="M -31 -70 C -25 -78, -15 -82, -5 -83" ${SHINE}/>`,
	},
	// A captain's cap: the white top with a gold anchor, the navy band with its gold cord and buttons, the shiny peak.
	captain: {
		tip: 68, lean: 10, svg: `<path d="M -86 -64 C -54 -80, 54 -80, 86 -64 C 86 -50, 72 -41, 58 -37 C 20 -31, -20 -31, -58 -37 C -72 -41, -86 -50, -86 -64 Z" fill="#fff" ${LINE}/>
<path d="M 0 -68 V -47 M -7 -61 H 7 M -10 -52 Q 0 -40 10 -52" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M 0 -68 V -47 M -7 -61 H 7 M -10 -52 Q 0 -40 10 -52" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="0" cy="-70" r="3.5" fill="#fff" stroke="${INK}" stroke-width="2"/>
<path d="M -58 -37 C -20 -31, 20 -31, 58 -37 L 59 -12 C 20 -5, -20 -5, -59 -12 Z" fill="#1f2a44" ${LINE}/>
<path d="M -54 -19 C -20 -13, 20 -13, 54 -19" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/>
<path d="M -54 -19 C -20 -13, 20 -13, 54 -19" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>
<circle cx="-54" cy="-19" r="4.5" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><circle cx="54" cy="-19" r="4.5" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
<path d="M -62 -13 C -40 -3, 40 -3, 62 -13 C 58 5, 32 16, 0 16 C -32 16, -58 5, -62 -13 Z" fill="${INK}" ${LINE}/>
<path d="M -30 9 C -12 12, 12 12, 30 9" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3.5" stroke-linecap="round"/>`,
	},
	// A soft felt beret, hung by its middle: the wide crown droops lower on one side; the narrow band; the stalk on top.
	beret: {
		tip: 60, lean: 8, k: 0.88, svg: `<path d="M -44 -14 C -62 -14, -80 -10, -92 -4 C -100 0, -106 -14, -98 -28 C -90 -42, -54 -64, -2 -67 C 40 -70, 98 -50, 98 -32 C 98 -20, 84 -16, 70 -16 C 60 -16, 52 -15, 44 -14 Z" fill="var(--blue)" ${LINE}/>
<path d="M -6 -64 C -34 -54, -62 -38, -86 -16" fill="none" stroke="#005a9e" stroke-width="3" stroke-linecap="round"/>
<path d="M -44 -16 C -20 -12, 20 -12, 44 -16 L 44 -3 C 20 0, -20 0, -44 -3 Z" fill="#0b3f70" ${LINE}/>
<path d="M 4 -67 C 2 -75, 5 -81, 11 -84" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>`,
	},
	// A cap-style safety helmet: the yellow shell, its raised ridge, the narrow rim and the short peak.
	hardhat: {
		tip: 78, lean: 14, svg: `<path d="M -60 -12 C -66 -60, -34 -100, 8 -100 C 48 -100, 72 -64, 66 -12 Z" fill="#f2c94c"/>
<path d="M 39.3 -91 C 59.7 -77, 70.2 -48.4, 66 -12 L 50 -12 C 54 -46, 52 -74, 39.3 -91 Z" fill="#ddae2c"/>
<path d="M -60 -12 C -66 -60, -34 -100, 8 -100 C 48 -100, 72 -64, 66 -12" fill="none" ${LINE}/>
<path d="M -46 -13 C -52 -52, -34 -88, 4 -100 C -18 -86, -30 -52, -24 -13 Z" fill="#f8dc84" ${LINE}/>
<path d="M 0 -10 C 22 -12, 46 -12, 61 -14 C 64 -15, 66 -18, 67 -23 C 71 -19, 72 -11, 67 -7 C 48 -3, 24 -2, 2 -3 Z" fill="#f2c94c" ${LINE}/>
<path d="M -80 -14 C -84 -2, -62 6, -32 4 C -14 3, -2 -2, 4 -10 C -20 -14, -52 -17, -80 -14 Z" fill="#f2c94c" ${LINE}/>
<path d="M 14 -84 C 22 -87, 30 -87, 37 -84" ${SHINE}/>`,
	},
};

/** A rope from (x1, y1) to (x2, y2): a strand with twist marks across it; `cut` ends it in a few short loose fibres. */
function rope(x1, y1, x2, y2, { w = 6, cut = false } = {}) {
	const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux;
	let out = `<path d="M ${r1(x1)} ${r1(y1)} L ${r1(x2)} ${r1(y2)}" stroke="#8a5a2b" stroke-width="${w}" stroke-linecap="${cut ? 'butt' : 'round'}"/>`;
	for (let d = 6; d < len - 4; d += 7) {
		const cx = x1 + ux * d, cy = y1 + uy * d, h = w / 2 - 0.5;
		out += `<path d="M ${r1(cx + nx * h - ux * 2)} ${r1(cy + ny * h - uy * 2)} L ${r1(cx - nx * h + ux * 2)} ${r1(cy - ny * h + uy * 2)}" stroke="#c4925a" stroke-width="1.6" stroke-linecap="round"/>`;
	}
	if (cut) {
		for (const [a, l, o] of [[-0.32, 6, -1.8], [0.04, 8, 0], [0.36, 6, 1.8]]) {
			const dx = ux * Math.cos(a) - uy * Math.sin(a), dy = ux * Math.sin(a) + uy * Math.cos(a);
			out += `<path d="M ${r1(x2 + nx * o)} ${r1(y2 + ny * o)} l ${r1(dx * l)} ${r1(dy * l)}" stroke="#8a5a2b" stroke-width="2" stroke-linecap="round"/>`;
		}
	}
	return out;
}

export const designs = {
	/** One big warning sign: a red triangle with the change on it and a wedge showing the road go down (or up), on a post
	 * with a plate naming what changed; to its left, smaller and further back, a second sign for the comparison. The
	 * story sits on the right. Fields: eyebrow, title, big / small: { change (e.g. '−11%'), plate, sub (second line of the
	 * plate), tone (big: 'red', small: 'green'), down (big: true, small: false) }, kicker (small caps over the story),
	 * lines: [{ text, tone }] (two or three short lines; **bold** words take the line's tone), pill: { text, tone, icon }. */
	roadsign: {
		css: `
.roadsign { position: relative; width: 1728px; }
.roadsign .rs-num { position: absolute; transform: translate(-50%, -50%); font-weight: 700; letter-spacing: -.03em; line-height: 1; color: var(--ink); white-space: nowrap; }
.roadsign .rs-plate { position: absolute; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; border: 5px solid var(--ink); border-radius: 12px; background: #fff; font-weight: 700; line-height: 1.12; color: var(--ink); white-space: nowrap; }
.roadsign .rs-plate small { font-size: 22px; font-weight: 500; color: var(--body); }
.roadsign .rs-story { position: absolute; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
.roadsign .rs-story .lbl { color: var(--body); line-height: 1.7; white-space: normal; }
.roadsign .rs-line { font-size: 34px; line-height: 1.22; color: var(--ink); }
.roadsign .rs-line strong { color: var(--fg); }
.roadsign .rs-pill { align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; padding: 10px 22px; border-radius: 30px; background: var(--tint); color: var(--fg); font-size: 30px; font-weight: 600; }
`,
		render(s) {
			const H = bodyHeight(s);
			let svg = '', html = '';
			const plate = (p, x, y, style) => t('rs-plate', `left:${x}px;top:${r1(y)}px;${style}`, `<span>${fmt(p.plate)}</span>${p.sub ? `<small>${fmt(p.sub)}</small>` : ''}`);
			// The small sign, further back: smaller, higher up, its post ending higher.
			if (s.small) {
				const small = s.small, sx = 200, sTop = 92, sSide = 250, sH = (sSide * Math.sqrt(3)) / 2;
				svg += `<rect x="${sx - 6}" y="${r1(sTop + sH - 10)}" width="12" height="${r1(H - 140 - sTop - sH + 10)}" rx="3" fill="var(--ink)"/>`;
				const sw = warning(sx, sTop, sSide, small.tone ?? 'green', small.down === true);
				svg += sw.svg;
				html += t('rs-num', `left:${sx}px;top:${r1(sw.field.top + sw.field.h * 0.7)}px;font-size:42px`, fmt(small.change ?? ''));
				if (small.plate) {
					html += plate(small, sx, sTop + sH + 16, 'padding:3px 14px;font-size:24px;border-width:3px;border-radius:8px');
				}
			}
			// The big sign, in front.
			const big = s.big ?? {}, cx = 690, bTop = 4, side = 556, bH = (side * Math.sqrt(3)) / 2;
			svg += `<rect x="${cx - 11}" y="${r1(bTop + bH - 20)}" width="22" height="${r1(H - bTop - bH + 20)}" rx="4" fill="var(--ink)"/>`;
			const bw = warning(cx, bTop, side, big.tone ?? 'red', big.down !== false);
			svg += bw.svg;
			html += t('rs-num', `left:${cx}px;top:${r1(bw.field.top + bw.field.h * 0.705)}px;font-size:104px`, fmt(big.change ?? ''));
			if (big.plate) {
				html += plate(big, cx, bTop + bH + 24, 'padding:6px 26px 8px;font-size:36px');
			}
			// The story, on the right.
			const lines = (s.lines ?? []).map(l => t(`rs-line t-${l.tone ?? 'neutral'}`, l.tone ? '' : '--fg:var(--ink)', fmt(l.text))).join('');
			const pill = s.pill ? `<div class="rs-pill t-${s.pill.tone ?? 'orange'}" data-t>${ic(s.pill.icon ?? 'info', 30)}<span>${fmt(s.pill.text)}</span></div>` : '';
			html += `<div class="rs-story" style="${at(1060, 0, W - 1060, H)}">${s.kicker ? t('lbl', '', fmt(s.kicker)) : ''}${lines}${pill}</div>`;
			return heading(s) + body(`<div class="roadsign" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** A "HELLO my name is" sticker stuck on crooked, one word written on it in marker; what the word means beside it,
	 * and a badge under that. Made for a dark page (bg: 'dark'); with no title the sticker gets the whole height.
	 * Fields: eyebrow, title (optional), hello (default 'Hello'), nameIs (default 'my name is'), word (short: one word of
	 * up to about 8 letters), tone (the sticker, default 'red'), sense: { label, text }, badge: { icon (default 'ribbon'),
	 * title, sub }. */
	nametag: {
		css: `
.nametag { position: relative; width: 1728px; }
.nametag .nt-tag { position: absolute; border-radius: 40px; background: var(--fg); }
.nametag .nt-hello { position: absolute; left: 0; right: 0; top: 26px; margin: 0 auto; width: max-content; text-align: center; color: #fff; line-height: 1; }
.nametag .nt-hello b { display: block; font-size: 112px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.nametag .nt-hello span { display: block; margin-top: 8px; font-size: 42px; font-weight: 600; letter-spacing: .02em; }
.nametag .nt-area { position: absolute; left: 28px; right: 28px; bottom: 52px; border-radius: 12px; background: #fff; display: grid; place-items: center; }
.nametag .nt-name { display: block; font-family: 'Marker Felt', 'Chalkboard SE', var(--sans); font-size: 200px; font-weight: 400; line-height: 1; color: #1b1b1f; margin-top: -14px; white-space: nowrap; }
.nametag .nt-side { position: absolute; display: flex; flex-direction: column; justify-content: center; gap: 22px; }
.nametag .nt-lbl { color: #6cb8f6; }
.nametag .nt-def { font-size: 60px; font-weight: 600; line-height: 1.14; letter-spacing: -.01em; color: #fff; }
.nametag .nt-badge { display: flex; align-items: center; gap: 20px; margin-top: 36px; color: #e3b341; }
.nametag .nt-badge .nt-year { font-size: 36px; font-weight: 700; line-height: 1.15; }
.nametag .nt-badge .nt-by { font-size: 30px; font-weight: 600; line-height: 1.2; color: #f2d58a; }
`,
		render(s) {
			const full = !s.title;
			const H = bodyHeight(s, { full });
			const b = s.badge;
			const tag = { x: 50, w: 900, h: 600 };
			tag.y = (H - tag.h) / 2;
			const sticker = `<div class="nt-tag t-${s.tone ?? 'red'}" style="${at(tag.x, tag.y, tag.w, tag.h)};transform:rotate(-4deg)">`
				+ t('nt-hello', '', `<b>${esc(s.hello ?? 'Hello')}</b><span>${esc(s.nameIs ?? 'my name is')}</span>`)
				+ `<div class="nt-area" style="top:214px" data-fit>${t('nt-name', '', esc(s.word ?? ''), { tag: 'span' })}</div></div>`;
			const badge = b ? `<div class="nt-badge">${ic(b.icon ?? 'ribbon', 64, '#e3b341')}<div>${t('nt-year', '', fmt(b.title ?? ''))}${b.sub ? t('nt-by', '', fmt(b.sub)) : ''}</div></div>` : '';
			const side = `<div class="nt-side" style="${at(1050, 0, 650, H)}">`
				+ (s.sense?.label ? t('lbl nt-lbl', '', fmt(s.sense.label)) : '')
				+ t('nt-def', '', fmt(s.sense?.text ?? ''), { fit: true })
				+ badge
				+ '</div>';
			return heading(s) + body(`<div class="nametag" style="height:${H}px">${sticker}${side}</div>`, { vcenter: false, full });
		},
	},

	/** The same staircase twice, in one axonometric view: on the left only a polite note taped to the wall at the top and
	 * the figure on its way down anyway (advice); on the right a stair gate closed and screwed in between the newel posts,
	 * the figure stopped behind it on the landing (a wall). Fields: eyebrow, title, note (the text on the taped note,
	 * short: two lines), open: { label, sub } (left, orange), closed: { label, sub, text } (right, green; text: one line
	 * under it), figure: 'bot' | 'person' (default 'bot'). */
	gate: {
		css: `
.gate { position: relative; width: 1728px; --yellow: #9a6700; }
.gate .gt-plea { position: absolute; display: flex; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; padding: 0 10px; font-size: 32px; font-weight: 600; line-height: 1.16; color: var(--ink); transform-origin: 0 0; }
.gate .gt-say { position: absolute; display: flex; flex-direction: column; gap: 10px; }
.gate .gt-say b { font-size: 52px; font-weight: 700; line-height: 1; }
.gate .gt-say .lbl { color: var(--body); }
.gate .gt-say.l { align-items: flex-end; text-align: right; }
.gate .gt-note { margin-top: 26px; font-size: 31px; line-height: 1.3; color: var(--ink); }
.gate .gt-note strong { color: var(--green); }
`,
		render(s) {
			const H = bodyHeight(s);
			const green = 'var(--green)';
			const tread = mix('yellow', 26), side = mix('yellow', 10), wood = mix('yellow', 36), woodSide = mix('yellow', 52), plaster = mix('yellow', 4);
			const figure = s.figure === 'person' ? 'person_48_filled' : 'bot_48_filled';
			// One view for everything: the scene turned 22 degrees and seen from 24 degrees above. x runs across the stairs,
			// y up, z towards us, the way down.
			const th = -22 * Math.PI / 180, tilt = 24 * Math.PI / 180;
			const ct = Math.cos(th), st = Math.sin(th), cp = Math.cos(tilt), sp = Math.sin(tilt);
			const n = 5, r = 34, u = 50, wide = 250, L = n * r, deep = 150;
			const wallX = [-46, wide + 30], wallH = 300, wallT = 14, pw = 22, postH = 150, gateH = 118;
			const scene = (ox, oy, withGate) => {
				const P = (x, y, z) => [ox + x * ct + z * st, oy - y * cp + (-x * st + z * ct) * sp];
				const pts = list => list.map(q => P(...q).map(r1).join(',')).join(' ');
				const face = (list, fill, w = 3) => `<polygon points="${pts(list)}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;
				// A box seen from the front, the right and above.
				const box = (x0, x1, y0, y1, z0, z1, front, right, top) => face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], front)
					+ face([[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], right) + face([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], top);
				let out = box(wallX[0], wallX[1], L, L + wallH, -deep - wallT, -deep, plaster, side, tread);
				let note = '';
				if (!withGate && s.note) {
					// The note, taped to the wall at the top of the stairs, in the wall's own plane.
					const nx = [-22, 240], ny = [L + 166, L + 280], nz = -deep;
					out += `<polygon points="${pts([[nx[0], ny[0], nz], [nx[1], ny[0], nz], [nx[1], ny[1], nz], [nx[0], ny[1], nz]])}" fill="${mix('orange', 14)}" stroke="var(--orange)" stroke-width="3.5" stroke-linejoin="round"/>`;
					for (const [t0, t1] of [[nx[0] + 10, nx[0] + 52], [nx[1] - 52, nx[1] - 10]]) {
						out += `<polygon points="${pts([[t0, ny[1] - 10, nz], [t1, ny[1] - 10, nz], [t1, ny[1] + 10, nz], [t0, ny[1] + 10, nz]])}" fill="${mix('yellow', 30)}" opacity=".85"/>`;
					}
					const [tx, ty] = P(nx[0], ny[1], nz);
					note = `<div class="gt-plea" style="left:${r1(tx)}px;top:${r1(ty)}px;width:${nx[1] - nx[0]}px;height:${ny[1] - ny[0]}px;transform:matrix(${r1(ct * 1000) / 1000},${r1(-st * sp * 1000) / 1000},0,${r1(cp * 1000) / 1000},0,0)" data-t data-fit>${fmt(s.note)}</div>`;
				}
				// The landing, then the steps down towards us, and the staircase's open side.
				out += face([[0, L, -deep], [wide, L, -deep], [wide, L, 0], [0, L, 0]], tread);
				const prof = [[wide, 0, -deep], [wide, L, -deep], [wide, L, 0]];
				for (let k = 0; k < n; k++) {
					const y0 = L - k * r, y1 = L - (k + 1) * r;
					out += face([[0, y0, k * u], [wide, y0, k * u], [wide, y1, k * u], [0, y1, k * u]], '#fff');
					prof.push([wide, y1, k * u]);
					if (k < n - 1) {
						out += face([[0, y1, k * u], [wide, y1, k * u], [wide, y1, (k + 1) * u], [0, y1, (k + 1) * u]], tread);
						prof.push([wide, y1, (k + 1) * u]);
					}
				}
				out += face(prof, side);
				// The figure: behind the gate on the landing, or halfway down the stairs.
				const k = 4.2, [ax, ay] = withGate ? P(wide / 2, L, -deep * 0.46) : P(wide / 2 - 6, L - 3 * r, 2.45 * u);
				const eyes = figure.startsWith('bot') ? '<rect x="13" y="10" width="22" height="12" rx="3" fill="#fff"/>' : '';
				out += `<g transform="translate(${r1(ax - 24 * k)} ${r1(ay - 44 * k)}) scale(${k})">${eyes}<g fill="var(--purple)">${fluent(figure)}</g></g>`;
				// The gate between the posts: a frame, upright bars, the latch on the top rail.
				if (withGate) {
					const zg = -pw / 2, g0 = pw, g1 = wide - pw, y0 = L + 6, y1 = L + gateH;
					for (let x = g0 + 22; x < g1 - 12; x += 22) {
						const [bx, byb] = P(x, y0, zg), [, byt] = P(x, y1, zg);
						out += `<path d="M ${r1(bx)} ${r1(byb)} V ${r1(byt)}" stroke="${green}" stroke-width="5.5"/>`;
					}
					out += `<polygon points="${pts([[g0 + 4, y0, zg], [g1 - 4, y0, zg], [g1 - 4, y1, zg], [g0 + 4, y1, zg]])}" fill="none" stroke="${green}" stroke-width="9" stroke-linejoin="round"/>`;
					out += face([[g1 - 44, y1 + 2, zg], [g1 - 24, y1 + 2, zg], [g1 - 24, y1 + 18, zg], [g1 - 44, y1 + 18, zg]], green, 2.5);
				}
				// The newel posts at the top of the stairs, each with a cap and a ball.
				for (const x0 of [0, wide - pw]) {
					out += box(x0, x0 + pw, L, L + postH, -pw, 0, wood, woodSide, tread)
						+ box(x0 - 4, x0 + pw + 4, L + postH, L + postH + 10, -pw - 4, 4, wood, woodSide, tread);
					const [cx, cy] = P(x0 + pw / 2, L + postH + 10, -pw / 2);
					out += `<circle cx="${r1(cx)}" cy="${r1(cy - 11)}" r="11" fill="${wood}" stroke="${INK}" stroke-width="3"/>`;
				}
				if (withGate) {
					// Brackets screwed into both posts: the gate is fixed, not wedged in.
					for (const y of [L + 30, L + gateH - 26]) {
						for (const x of [pw + 1, wide - pw - 1]) {
							const [bx, by] = P(x, y, -pw / 2);
							out += `<rect x="${r1(bx - 9)}" y="${r1(by - 8)}" width="18" height="16" rx="4" fill="${green}" stroke="${INK}" stroke-width="2"/><circle cx="${r1(bx)}" cy="${r1(by)}" r="2.6" fill="#fff"/>`;
						}
					}
				}
				return { svg: out, html: note };
			};
			const oy = 552, ox0 = 400, ox1 = ox0 + 530;
			const a = scene(ox0, oy, false), b = scene(ox1, oy, true);
			const op = s.open ?? {}, cl = s.closed ?? {};
			const lbl = text => (text ? `<span class="lbl" data-t>${fmt(text)}</span>` : '');
			return heading(s) + body(`<div class="gate" style="height:${H}px">
${layer(H, a.svg + b.svg)}
${a.html}
<div class="gt-say l" style="${at(0, 272, ox0 - 110)}"><b data-t style="color:var(--orange)">${fmt(op.label ?? '')}</b>${lbl(op.sub)}</div>
<div class="gt-say" style="${at(ox1 + 360, 272, W - ox1 - 360)}"><b data-t style="color:var(--green)">${fmt(cl.label ?? '')}</b>${lbl(cl.sub)}${cl.text ? `<div class="gt-note" data-t>${fmt(cl.text)}</div>` : ''}</div>
</div>`, { vcenter: false });
		},
	},

	/** A pair of glasses. Through the left lens the draft: the words only the writer understands are marked as holes (wavy
	 * underline and a question mark: mark them with {{orange|...}}). Through the right lens the rewrite. The prompt that
	 * turns one into the other sits in a pill under the bridge, on an arrow from lens to lens. Fields: eyebrow, title,
	 * kicker (small caps over the glasses), left: { label, text }, right: { label, text }, prompt: { icon (default
	 * 'person'), who, text }. Keep each lens to about ten words. */
	glasses: {
		css: `
.glasses { position: relative; width: 1728px; }
.glasses .gl-kicker { position: absolute; transform: translateX(-50%); font-size: 18px; color: var(--muted); }
.glasses .gl-lens { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; border-radius: 50%; }
.glasses .gl-lens .lbl { font-size: 17px; color: var(--fg); }
.glasses .gl-text { font-size: 33px; font-weight: 600; line-height: 1.3; color: var(--ink); }
.glasses .gl-left .mark { padding: 0; margin: 0; background: none; color: var(--orange); text-decoration: underline wavy var(--orange); text-decoration-thickness: 2px; text-underline-offset: 7px; }
.glasses .gl-left .mark::after { content: '?'; display: inline-block; vertical-align: 14px; width: 28px; height: 28px; margin-left: 5px; border-radius: 50%; background: var(--orange); color: #fff; font-size: 20px; font-weight: 700; line-height: 28px; text-align: center; text-decoration: none; }
.glasses .gl-mark { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--fg); color: #fff; }
.glasses .gl-prompt { position: absolute; transform: translateX(-50%); display: flex; align-items: center; gap: 16px; padding: 16px 28px; border-radius: 999px; background: var(--blue); color: #fff; font-size: 28px; font-weight: 600; white-space: nowrap; }
.glasses .gl-prompt .lbl { font-size: 17px; color: #cfe6fb; }
`,
		render(s) {
			const H = bodyHeight(s);
			const R = 222;
			const cy = R + 52;
			const lx = 864 - 306, rx = 864 + 306;
			const P = (x, y) => `${r1(x)} ${r1(y)}`;
			let svg = '';
			// End pieces (the temples go back, away from us), the rims, and the bridge.
			svg += `<path d="M ${P(lx - R - 4, cy - 58)} L ${P(lx - R - 70, cy - 70)}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>`;
			svg += `<path d="M ${P(rx + R + 4, cy - 58)} L ${P(rx + R + 70, cy - 70)}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>`;
			svg += `<circle cx="${lx}" cy="${cy}" r="${R}" fill="var(--orange-tint)" stroke="${INK}" stroke-width="18"/>`;
			svg += `<circle cx="${rx}" cy="${cy}" r="${R}" fill="var(--green-tint)" stroke="${INK}" stroke-width="18"/>`;
			svg += `<path d="M ${P(lx + R - 2, cy - 70)} Q ${P(864, cy - 122)} ${P(rx - R + 2, cy - 70)}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>`;
			// The rewrite: an arrow from one lens to the other, under the bridge.
			const ax0 = lx + R + 24, ax1 = rx - R - 26;
			svg += `<path d="M ${P(ax0, cy + 20)} L ${P(ax1, cy + 20)}" stroke="var(--blue)" stroke-width="6" stroke-linecap="round"/>${arrowHead(ax1, cy + 20, ax1 - 30, cy + 20, 'var(--blue)', 6)}`;
			const lens = (key, x, tone, mark) => `<div class="gl-lens gl-${key} t-${tone}" style="left:${x - R + 40}px;top:${cy - R + 40}px;width:${2 * R - 80}px;height:${2 * R - 80}px" data-fit>${mark}${s[key]?.label ? `<span class="lbl" data-t>${fmt(s[key].label)}</span>` : ''}<div class="gl-text" data-t>${fmt(s[key]?.text ?? '')}</div></div>`;
			const pr = s.prompt;
			const prompt = pr ? `<div class="gl-prompt" style="left:864px;top:${cy + R + 34}px">${ic(pr.icon ?? 'person', 30)}${pr.who ? `<span class="lbl" data-t>${fmt(pr.who)}</span>` : ''}<span data-t>${fmt(pr.text ?? '')}</span></div>` : '';
			return heading(s) + body(`<div class="glasses" style="height:${H}px">
${s.kicker ? `<div class="lbl gl-kicker" style="left:864px;top:0" data-t>${fmt(s.kicker)}</div>` : ''}
${layer(H, svg)}
${lens('left', lx, 'orange', `<span class="gl-mark">${ic('question', 28)}</span>`)}
${lens('right', rx, 'green', `<span class="gl-mark">${ic('checkmark', 28)}</span>`)}
${prompt}
</div>`, { vcenter: false });
		},
	},

	/** A row of checks as meshed gears on a blue page (bg: 'blue'), one gear per check (two to four), each turning the
	 * other way from its neighbour, all driving a bigger green gear at the end: it only turns when every check does.
	 * Fields: eyebrow, title, gears: [{ icon, title (one or two words), sub (a few words) }], accept: { icon (default
	 * 'checkmark'), title }. */
	gears: {
		css: `
.gears { position: relative; width: 1728px; }
.gears .gr-in { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 6px; }
.gears .gr-in .ic { color: var(--blue); }
.gears .gr-t { font-size: 31px; font-weight: 700; line-height: 1.1; color: var(--ink); }
.gears .gr-s { font-size: 22px; font-weight: 500; line-height: 1.2; color: var(--body); }
.gears .gr-acc { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 8px; color: #fff; }
.gears .gr-acc .gr-t { color: #fff; font-size: 42px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const gears = (s.gears ?? []).slice(0, 4);
			const R = 172, depth = 26, teeth = 16, aR = 200;
			const cy = H / 2 + 6;
			const gear = (cx, cyy, r, n, phase, fill) => {
				let d = '';
				for (let i = 0; i < n; i++) {
					const a = phase + (i / n) * Math.PI * 2, w = Math.PI / n;
					const p = (ang, rr) => `${r1(cx + Math.cos(ang) * rr)} ${r1(cyy + Math.sin(ang) * rr)}`;
					d += `${i ? 'L' : 'M'} ${p(a - w * 0.5, r - depth)} L ${p(a - w * 0.32, r)} L ${p(a + w * 0.32, r)} L ${p(a + w * 0.5, r - depth)} L ${p(a + w * 1.5, r - depth)} `;
				}
				return `<path d="${d}Z" fill="${fill}"/>`;
			};
			let svg = '', html = '';
			const step = 2 * R - depth + 4;
			// The row is centred: the checks, then the bigger gear meshed with the last one.
			const total = 2 * R + (gears.length - 1) * step + aR - depth + 4 + aR;
			const x0 = (W - total) / 2 + R;
			gears.forEach((g, k) => {
				const cx = x0 + k * step;
				svg += gear(cx, cy, R, teeth, (k % 2 ? Math.PI / teeth : 0), '#fff');
				svg += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${R - depth - 14}" fill="none" stroke="var(--blue-tint)" stroke-width="4"/>`;
				html += `<div class="gr-in" data-on="#ffffff" style="${at(cx - 118, cy - 118, 236, 236)}">${ic(g.icon ?? 'checkmark', 46)}<span class="gr-t" data-t>${fmt(g.title ?? '')}</span>${g.sub ? `<span class="gr-s" data-t>${fmt(g.sub)}</span>` : ''}</div>`;
			});
			const lastX = x0 + (gears.length - 1) * step;
			const ax = lastX + R + aR - depth + 4;
			svg += gear(ax, cy, aR, 19, Math.PI / 19, '#107c10');
			svg += `<circle cx="${r1(ax)}" cy="${r1(cy)}" r="${aR - depth - 18}" fill="none" stroke="#fff" stroke-width="4" opacity=".35"/>`;
			html += `<div class="gr-acc" style="${at(ax - 130, cy - 130, 260, 260)}">${ic(s.accept?.icon ?? 'checkmark', 64)}<span class="gr-t" data-t>${fmt(s.accept?.title ?? '')}</span></div>`;
			// Small arrows that show the turning: each gear turns the other way from its neighbour.
			gears.forEach((g, k) => {
				const cx = x0 + k * step;
				const up = k % 2 === 0;
				const yA = up ? cy - R - 40 : cy + R + 40;
				svg += `<path d="M ${r1(cx - 70)} ${r1(yA + (up ? 18 : -18))} Q ${r1(cx)} ${r1(yA + (up ? -18 : 18))} ${r1(cx + 70)} ${r1(yA + (up ? 18 : -18))}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>${arrowHead(cx + 72, yA + (up ? 19 : -19), cx + 40, yA, '#fff', 5)}`;
			});
			return heading(s) + body(`<div class="gears" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** One share as a donut: a pale ring for the whole, an arc in the tone for the share, and a darker sliver at its end
	 * for the part of the part; leaders run to the two numbers on the right. A logo or an icon (and a word) sits in the
	 * hole. Fields: eyebrow, title, value (e.g. '18%'), label, part (0 to about 0.35), tone (default 'red'),
	 * inner: { value, label, part } (optional, a share of the whole that sits inside part), center: { logo ('github',
	 * 'githubcopilot', 'x', 'youtube') | icon, text }. */
	donut: {
		css: `
.donut { position: relative; width: 1728px; }
.donut .dn-mark { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px; transform: translate(-50%, -50%); color: var(--fg); }
.donut .dn-name { font-size: 54px; font-weight: 700; letter-spacing: -.01em; color: var(--ink); white-space: nowrap; }
.donut .dn-num { position: absolute; display: flex; flex-direction: column; }
.donut .dn-v { font-weight: 700; letter-spacing: -.035em; line-height: .86; white-space: nowrap; }
.donut .dn-l { margin-top: 14px; font-size: 38px; font-weight: 600; line-height: 1.2; color: var(--ink); }
`,
		render(s) {
			const H = bodyHeight(s);
			const tone = s.tone ?? 'red';
			const main = `var(--${tone})`, deep = `color-mix(in srgb, var(--${tone}) 58%, #1b1b1f)`;
			const cx = 372, cy = H / 2, R = 328, T = 86, rm = R - T / 2;
			const part = s.part ?? 0, inner = s.inner?.part ?? 0;
			// The ring turns so that the middle of the main slice sits a little above the horizontal, level with the big number;
			// the inner sliver follows it clockwise, just below.
			const a0 = -15 * Math.PI / 180 - (part - inner) * Math.PI, a1 = a0 + part * 2 * Math.PI, ai = a1 - inner * 2 * Math.PI;
			const pt = (a, r) => [r1(cx + Math.cos(a) * r), r1(cy + Math.sin(a) * r)];
			const arc = (from, to, colour) => {
				const [x0, y0] = pt(from, rm), [x1, y1] = pt(to, rm);
				return `<path d="M ${x0} ${y0} A ${rm} ${rm} 0 ${to - from > Math.PI ? 1 : 0} 1 ${x1} ${y1}" fill="none" stroke="${colour}" stroke-width="${T}"/>`;
			};
			let svg = `<circle cx="${cx}" cy="${r1(cy)}" r="${rm}" fill="none" stroke="color-mix(in srgb, var(--blue) 17%, #fff)" stroke-width="${T}"/>`;
			svg += arc(a0, a1, main);
			if (inner) {
				svg += arc(ai, a1, deep);
			}
			// White hairlines between the slices.
			(inner ? [a0, ai, a1] : [a0, a1]).forEach(a => {
				const [x0, y0] = pt(a, R - T - 2), [x1, y1] = pt(a, R + 2);
				svg += `<path d="M ${x0} ${y0} L ${x1} ${y1}" stroke="#fff" stroke-width="4"/>`;
			});
			// Leaders from the slices to their numbers: straight to the big one, with one bend to the small one.
			const nx = 830;
			const am = (a0 + (inner ? ai : a1)) / 2, [lx0, ly0] = pt(am, R + 16);
			svg += `<path d="M ${lx0} ${ly0} H ${nx - 26}" stroke="${main}" stroke-width="4" stroke-linecap="round"/>`;
			let bot = '';
			if (inner) {
				const ami = (ai + a1) / 2, [mx0, my0] = pt(ami, R + 16);
				// The small number sits well below the big one, and as low as its slice when that is lower (then the leader
				// runs straight), but stays inside the body.
				const yBot = Math.min(Math.max(ly0 + 268, my0), H - 130);
				const lead = Math.abs(my0 - yBot) < 2 ? [[mx0, my0], [nx - 26, yBot]] : [[mx0, my0], [nx - 66, my0], [nx - 66, yBot], [nx - 26, yBot]];
				svg += `<path d="${rounded(lead, 20)}" fill="none" stroke="${deep}" stroke-width="4" stroke-linecap="round"/>`;
				bot = `<div class="dn-num" style="left:${nx}px;top:${r1(yBot - 66)}px;width:${W - nx}px"><span class="dn-v" style="font-size:150px;color:${deep}" data-t>${esc(s.inner.value ?? '')}</span><span class="dn-l" data-t>${fmt(s.inner.label ?? '')}</span></div>`;
			}
			const c = s.center ?? {};
			const pic = c.logo ? logo(c.logo, 220) : c.icon ? ic(c.icon, 200) : '';
			const mark = pic || c.text ? `<div class="dn-mark t-${tone}" style="left:${cx}px;top:${r1(cy)}px">${pic}${c.text ? `<span class="dn-name" data-t>${fmt(c.text)}</span>` : ''}</div>` : '';
			const top = `<div class="dn-num" style="left:${nx}px;top:${r1(ly0 - 104)}px;width:${W - nx}px"><span class="dn-v" style="font-size:230px;color:${main}" data-t>${esc(s.value ?? '')}</span><span class="dn-l" data-t>${fmt(s.label ?? '')}</span></div>`;
			return heading(s) + body(`<div class="donut" style="height:${H}px">${layer(H, svg)}${mark}${top}${bot}</div>`, { vcenter: false });
		},
	},

	/** A thermometer: one mark per level, from cool (bottom, green) to hot (top, red). Left of each mark what is at stake,
	 * right of it what that level needs; a dotted leader in the level's tone joins them to the glass. Fields: eyebrow,
	 * title, levels (three, bottom to top): [{ left: { icon, text }, right: { icon, text }, tone (default green, yellow,
	 * red) }], labels: [left heading, right heading] (small caps). */
	thermometer: {
		css: `
.thermometer { position: relative; width: 1728px; --yellow: #9a6700; --yellow-tint: #fff6d4; }
.thermometer .t-yellow { --fg: var(--yellow); --tint: var(--yellow-tint); }
.thermometer .th-l { position: absolute; display: flex; align-items: center; gap: 18px; font-size: 34px; font-weight: 700; white-space: nowrap; }
.thermometer .th-l.left { justify-content: flex-end; text-align: right; color: var(--ink); }
.thermometer .th-l.right { color: var(--fg); }
.thermometer .th-ic { width: 70px; height: 70px; border-radius: 50%; background: var(--tint); color: var(--fg); display: grid; place-items: center; flex: none; }
.thermometer .th-end { position: absolute; transform: translateX(-50%); color: var(--ink); }
`,
		render(s) {
			const H = bodyHeight(s);
			const cx = W / 2, tubeW = 92, top = 30, bulbR = 78, bulbY = H - bulbR - 14;
			const levels = s.levels ?? [];
			const span = bulbY - bulbR - 50 - (top + 40);
			const yAt = k => bulbY - bulbR - 50 - span * ((k + 0.5) / levels.length);
			let svg = `<defs><linearGradient id="thermometer-fill" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#107c10"/><stop offset=".5" stop-color="#e3b341"/><stop offset="1" stop-color="#d13438"/></linearGradient></defs>`;
			// Glass: a white tube with an ink outline; the liquid from the bulb nearly to the top.
			svg += `<rect x="${cx - tubeW / 2}" y="${top}" width="${tubeW}" height="${bulbY - top}" rx="${tubeW / 2}" fill="#fff" stroke="#1b1b1f" stroke-width="6"/><circle cx="${cx}" cy="${bulbY}" r="${bulbR}" fill="#fff" stroke="#1b1b1f" stroke-width="6"/>`;
			svg += `<rect x="${cx - tubeW / 2 + 18}" y="${top + 36}" width="${tubeW - 36}" height="${bulbY - top - 36}" rx="${(tubeW - 36) / 2}" fill="url(#thermometer-fill)"/><circle cx="${cx}" cy="${bulbY}" r="${bulbR - 18}" fill="#107c10"/><rect x="${cx - tubeW / 2 + 18}" y="${bulbY - bulbR}" width="${tubeW - 36}" height="${bulbR}" fill="#107c10"/>`;
			let html = '';
			levels.forEach((lv, k) => {
				const y = yAt(k);
				const tone = lv.tone ?? ['green', 'yellow', 'red'][Math.min(k, 2)];
				svg += `<path d="M ${cx - tubeW / 2 - 30} ${r1(y)} H ${cx - tubeW / 2 - 6} M ${cx + tubeW / 2 + 6} ${r1(y)} H ${cx + tubeW / 2 + 30}" stroke="#1b1b1f" stroke-width="6" stroke-linecap="round"/>`;
				svg += `<path d="M ${cx - tubeW / 2 - 50} ${r1(y)} H ${cx - 300}" stroke="var(--${tone})" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 10"/><path d="M ${cx + tubeW / 2 + 50} ${r1(y)} H ${cx + 300}" stroke="var(--${tone})" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 10"/>`;
				html += `<div class="th-l left t-${tone}" style="${at(0, y - 36, cx - 320, 72)}"><span data-t>${fmt(lv.left?.text ?? '')}</span><span class="th-ic">${ic(lv.left?.icon ?? 'circle', 38)}</span></div>`;
				html += `<div class="th-l right t-${tone}" style="${at(cx + 320, y - 36, W - cx - 320, 72)}"><span class="th-ic">${ic(lv.right?.icon ?? 'person', 38)}</span><span data-t>${fmt(lv.right?.text ?? '')}</span></div>`;
			});
			if (s.labels) {
				html += `<div class="lbl th-end" style="${at(cx - 420, 0)}" data-t>${fmt(s.labels[0] ?? '')}</div><div class="lbl th-end" style="${at(cx + 420, 0)}" data-t>${fmt(s.labels[1] ?? '')}</div>`;
			}
			return heading(s) + body(`<div class="thermometer" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** A keyring: one key per credential or level of access, the key's text on its blade and, beside it, where it may
	 * live and what it opens; a key marked broken is snapped in two (leaked: replace it), with chips for where it leaked.
	 * Fields: eyebrow, title, keys (three or four): [{ name (small caps over the blade), text (on the blade, mono, short),
	 * title, sub, tone (default 'blue'), broken, chips: ['...'] }]. */
	keyring: {
		css: `
.keyring { position: relative; width: 1728px; }
.keyring .kr-blade { position: absolute; display: flex; align-items: center; padding-left: 30px; font-family: var(--mono); font-size: 30px; font-weight: 600; letter-spacing: 0; text-transform: none; color: var(--fg); white-space: nowrap; }
.keyring .kr-name { position: absolute; color: var(--fg); }
.keyring .kr-label { position: absolute; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
.keyring .kr-title { font-size: 34px; font-weight: 700; color: var(--fg); line-height: 1.15; white-space: nowrap; }
.keyring .kr-sub { font-size: 26px; color: var(--body); line-height: 1.3; }
.keyring .kr-chips { display: flex; gap: 10px; }
.keyring .kr-chip { display: inline-flex; align-items: center; height: 38px; padding: 0 16px; border-radius: 999px; background: var(--tint); color: var(--fg); font-size: 21px; font-weight: 600; white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const keys = s.keys ?? [];
			const ring = { x: 92, y: H / 2, r: 62 };
			const step = (H - 40) / Math.max(1, keys.length);
			const bowX = 300, bladeX0 = 344, bladeX1 = 1010, bh = 70;
			let svg = '', html = '';
			keys.forEach((k, i) => {
				const y = 12 + step * (i + 0.5);
				const tone = k.tone ?? 'blue';
				const col = `var(--${tone})`, tint = `var(--${tone}-tint)`;
				// From the ring to the key's bow.
				const a = Math.atan2(y - ring.y, bowX - ring.x);
				svg += `<path d="M ${r1(ring.x + Math.cos(a) * ring.r)} ${r1(ring.y + Math.sin(a) * ring.r)} L ${bowX - 46} ${r1(y)}" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>`;
				// The blade (snapped in two when broken), its teeth, then the bow on top.
				const teeth = x1 => `<path d="M ${x1 - 150} ${r1(y + bh / 2)} v 26 h 28 v -12 h 30 v 20 h 30 v -14 h 30 v 22 h 22 V ${r1(y + bh / 2)} Z" fill="${tint}" stroke="${col}" stroke-width="4" stroke-linejoin="round"/>`;
				if (k.broken) {
					const cut = 640;
					svg += `<path d="M ${bladeX0} ${r1(y - bh / 2)} H ${cut} l -18 22 l 24 14 l -16 34 H ${bladeX0} Z" fill="${tint}" stroke="${col}" stroke-width="4" stroke-linejoin="round"/>`;
					svg += `<g transform="rotate(4 ${cut + 60} ${r1(y)}) translate(40 -4)">${teeth(bladeX1)}<path d="M ${cut + 4} ${r1(y - bh / 2)} H ${bladeX1 - 14} Q ${bladeX1} ${r1(y - bh / 2)} ${bladeX1} ${r1(y - bh / 2 + 14)} V ${r1(y + bh / 2)} H ${cut - 10} l 16 -34 l -24 -14 Z" fill="${tint}" stroke="${col}" stroke-width="4" stroke-linejoin="round"/></g>`;
					svg += `<path d="M ${cut + 6} ${r1(y - 52)} l 14 -16 M ${cut + 26} ${r1(y - 46)} l 18 -8 M ${cut + 14} ${r1(y + 52)} l 10 16" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
				} else {
					svg += teeth(bladeX1);
					svg += `<path d="M ${bladeX0} ${r1(y - bh / 2)} H ${bladeX1 - 14} Q ${bladeX1} ${r1(y - bh / 2)} ${bladeX1} ${r1(y - bh / 2 + 14)} V ${r1(y + bh / 2)} H ${bladeX0} Z" fill="${tint}" stroke="${col}" stroke-width="4" stroke-linejoin="round"/>`;
				}
				svg += `<circle cx="${bowX}" cy="${r1(y)}" r="52" fill="${tint}" stroke="${col}" stroke-width="5"/><circle cx="${bowX - 14}" cy="${r1(y)}" r="15" fill="#fff" stroke="${col}" stroke-width="4"/>`;
				if (k.text) {
					html += `<div class="kr-blade lbl t-${tone}" style="${at(bladeX0, y - bh / 2, (k.broken ? 640 : bladeX1 - 150) - bladeX0, bh)}" data-t>${esc(k.text)}</div>`;
				}
				if (k.name) {
					html += `<div class="kr-name lbl t-${tone}" style="${at(bladeX0 + 30, y - bh / 2 - 28)}" data-t>${fmt(k.name)}</div>`;
				}
				const chips = (k.chips ?? []).length ? `<div class="kr-chips">${k.chips.map(c => `<span class="kr-chip" data-t>${fmt(c)}</span>`).join('')}</div>` : '';
				html += `<div class="kr-label t-${tone}" style="${at(1086, y - step / 2 + 6, W - 1086, step - 12)}" data-fit><div class="kr-title" data-t>${fmt(k.title ?? '')}</div>${k.sub ? `<div class="kr-sub" data-t>${fmt(k.sub)}</div>` : ''}${chips}</div>`;
			});
			svg = `<circle cx="${ring.x}" cy="${r1(ring.y)}" r="${ring.r}" fill="none" stroke="var(--ink)" stroke-width="12"/>` + svg;
			return heading(s) + body(`<div class="keyring" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** A tall bentwood coat stand right of centre, a hat on each of its four hooks with the role it stands for beside it;
	 * nobody is wearing them. A quote (or, with quote: false, a plain statement) on the left: its first line sits level
	 * with the upper labels. Fields: eyebrow, title, text (\n for line breaks, about four short lines), who (under it),
	 * quote (default true), hats (four): [{ kind: 'bowler' | 'captain' | 'beret' | 'hardhat', label }] (upper left,
	 * upper right, lower left, lower right). */
	coatstand: {
		css: `
.coatstand { position: relative; width: 1728px; }
.coatstand .ct-quote { position: absolute; }
.coatstand .ct-text { font-size: 54px; font-weight: 600; line-height: 65px; letter-spacing: -.012em; color: var(--ink); }
.coatstand .ct-text.hang { text-indent: -.42em; }
.coatstand .ct-who { margin-top: 34px; font-size: 30px; font-weight: 700; color: var(--ink); }
.coatstand .ct-label { position: absolute; font-size: 32px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink); white-space: nowrap; transform: translateY(-50%); }
`,
		render(s) {
			const H = bodyHeight(s);
			const C = 1150, floor = H - 6, legTop = floor - 176, lineH = 65;
			// The two tiers of hooks: where each joins the pole (y), how far out its tip is (reach) and how high (tip).
			const tiers = [{ y: 182, reach: 150, tip: 70 }, { y: 182 + 3 * lineH, reach: 146, tip: 70 + 3 * lineH }];
			let svg = '';
			// The floor, and the legs bent out to it, joined by a ring.
			svg += `<path d="M ${C - 270} ${floor + 3} H ${C + 270}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
			const legs = [-1, 1].map(side => [[C, legTop], [C + side * 4, legTop + 92], [C + side * 66, floor - 38], [C + side * 124, floor]]);
			for (const leg of legs) {
				svg += rod(`M ${PT(leg[0])} C ${PT(leg[1])}, ${PT(leg[2])}, ${PT(leg[3])}`);
			}
			const [ringL, ringR] = legs.map(leg => bez(leg, 0.74));
			svg += rod(`M ${PT(ringL)} C ${r1(ringL[0] + 40)} ${r1(ringL[1] + 13)}, ${r1(ringR[0] - 40)} ${r1(ringR[1] + 13)}, ${PT(ringR)}`, 6);
			svg += rod(`M ${C} ${legTop} V ${floor + 1}`);
			// The pole, a little wider at the foot, the turned knob on top and the joint where the legs meet.
			svg += `<path d="M ${C - 7} 44 L ${C + 7} 44 L ${C + 9.5} ${legTop + 6} L ${C - 9.5} ${legTop + 6} Z" fill="${WOOD}" ${LINE}/>`;
			svg += `<path d="M ${C - 2.5} 54 V ${legTop - 6}" stroke="${WOOD_LIGHT}" stroke-width="3" stroke-linecap="round"/>`;
			svg += `<rect x="${C - 12}" y="36" width="24" height="10" rx="5" fill="${WOOD}" ${LINE}/>`;
			svg += `<path d="M ${C - 5} 36 L ${C - 4} 30 L ${C + 4} 30 L ${C + 5} 36 Z" fill="${WOOD}" ${LINE}/>`;
			svg += `<circle cx="${C}" cy="17" r="14" fill="${WOOD}" ${LINE}/><path d="M ${C - 8} 10 a 9 9 0 0 1 7 -5" fill="none" stroke="${WOOD_LIGHT}" stroke-width="3.5" stroke-linecap="round"/>`;
			svg += `<rect x="${C - 15}" y="${legTop - 6}" width="30" height="16" rx="7" fill="${WOOD}" ${LINE}/>`;
			// The hooks: each leaves its collar, dips and curves up into its hat, which hangs on the tip and tips out.
			const spots = [];
			for (const tier of tiers) {
				for (const side of [-1, 1]) {
					spots.push({ x: C + side * tier.reach, y: tier.tip, side, tier });
				}
			}
			let hatsSvg = '', html = '';
			(s.hats ?? []).slice(0, 4).forEach((hat, i) => {
				const spot = spots[i], kind = HATS[hat.kind] ?? HATS.bowler, tilt = spot.side * kind.lean, k = HAT_SIZE * (kind.k ?? 1);
				const a = tilt * Math.PI / 180;
				// The hat's axis runs from its tip down through the middle of its opening; the hook comes up along it.
				const axis = [-Math.sin(a), Math.cos(a)];
				const p0 = [C + spot.side * 8, spot.tier.y], p1 = [C + spot.side * 48, spot.tier.y + 8];
				const p2 = [spot.x + axis[0] * 70 * k, spot.y + axis[1] * 70 * k], p3 = [spot.x, spot.y];
				svg += rod(`M ${PT(p0)} C ${PT(p1)}, ${PT(p2)}, ${PT(p3)}`, 7);
				hatsSvg += `<g transform="translate(${r1(spot.x)} ${r1(spot.y)}) rotate(${tilt}) scale(${k}) translate(0 ${kind.tip})">${kind.svg}</g>`;
				const row = spot.tier.tip + 48, edge = C + spot.side * 282;
				const pos = spot.side < 0 ? `right:${r1(W - edge)}px` : `left:${r1(edge)}px`;
				html += t('ct-label', `${pos};top:${row}px`, fmt(hat.label ?? ''));
			});
			for (const tier of tiers) {
				svg += `<rect x="${C - 13}" y="${tier.y - 9}" width="26" height="18" rx="7" fill="${WOOD}" ${LINE}/>`;
			}
			svg += hatsSvg;
			// The text's first line shares the upper row of labels.
			const top = tiers[0].tip + 48 - lineH / 2;
			const quote = `<div class="ct-quote" style="left:0;top:${top}px;width:600px">${t(`ct-text${s.quote === false ? '' : ' hang'}`, '', quoted(s, fmt(s.text ?? '')))}${s.who ? t('ct-who', '', fmt(s.who)) : ''}</div>`;
			return heading(s) + body(`<div class="coatstand" style="height:${H}px">${layer(H, svg)}${quote}${html}</div>`, { vcenter: false });
		},
	},

	/** A striped hot-air balloon rising on the left of a blue page (bg: 'blue'): two sandbags have just been cut loose from
	 * its basket and fall away, each with something to let go of printed on it. A quote (or, with quote: false, a plain
	 * statement) on the right. Fields: eyebrow, title, text (\n for line breaks), who: { name, role }, quote (default
	 * true), bags: [text, text] (short: two lines of up to ~12 characters, \n between them). */
	balloon: {
		css: `
.balloon { position: relative; width: 1728px; }
.balloon .bl-text { position: absolute; display: flex; flex-direction: column; justify-content: center; gap: 40px; }
.balloon .bl-quote { font-size: 58px; font-weight: 600; line-height: 1.18; letter-spacing: -.012em; color: #fff; }
.balloon .bl-who { display: flex; align-items: baseline; gap: 18px; color: #fff; }
.balloon .bl-name { font-size: 34px; font-weight: 700; }
.balloon .bl-role { color: #fff; }
.balloon .bl-bag { position: absolute; width: 150px; text-align: center; font-size: 24px; font-weight: 700; line-height: 1.08; letter-spacing: .01em; color: #4a2a0c; white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const cx = 360, top = 5, R = 137, cy = top + R, throat = top + 2 * R + 30, m = 33;
			let svg = '';
			// The envelope: gores between meridians seen from the side, each seam half an ellipse down to the equator, then a
			// curve in to the throat.
			const down = f => `A ${r1(Math.abs(f) * R)} ${R} 0 0 ${f < 0 ? 0 : 1} ${r1(cx + f * R)} ${cy} C ${r1(cx + f * R)} ${r1(cy + R * 0.62)}, ${r1(cx + f * (m + R * 0.24))} ${r1(throat - R * 0.3)}, ${r1(cx + f * m)} ${throat}`;
			const up = f => `C ${r1(cx + f * (m + R * 0.24))} ${r1(throat - R * 0.3)}, ${r1(cx + f * R)} ${r1(cy + R * 0.62)}, ${r1(cx + f * R)} ${cy} A ${r1(Math.abs(f) * R)} ${R} 0 0 ${f < 0 ? 1 : 0} ${cx} ${top}`;
			const G = 9, seams = Array.from({ length: G + 1 }, (_, k) => Math.sin(-Math.PI / 2 + (Math.PI * k) / G));
			const tones = ['#f7a35c', '#f2c94c', '#ffffff'];
			for (let k = 0; k < G; k++) {
				const fill = tones[Math.abs(k - (G - 1) / 2) % 3];
				svg += `<path d="M ${cx} ${top} ${down(seams[k])} L ${r1(cx + seams[k + 1] * m)} ${throat} ${up(seams[k + 1])} Z" fill="${fill}" stroke="${fill}" stroke-width="1"/>`;
			}
			svg += `<path d="M ${cx} ${top} ${down(-1)} L ${cx + m} ${throat} ${up(1)} Z" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>`;
			// The skirt at the mouth; under it the burner on its two poles, the flame rising into the mouth; two cables.
			const skirt = throat + 21, rimY = skirt + 38, bw = 134, rw = bw + 12, bh = 60, burnerY = skirt + 10;
			svg += `<path d="M ${cx - rw / 2 + 5} ${rimY + 3} L ${cx - m + 5} ${skirt} M ${cx + rw / 2 - 5} ${rimY + 3} L ${cx + m - 5} ${skirt}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
			svg += `<path d="M ${cx - 8} ${rimY} V ${burnerY + 9} M ${cx + 8} ${rimY} V ${burnerY + 9}" stroke="#6e4520" stroke-width="3"/>`;
			svg += `<path d="M ${cx} ${burnerY - 24} C ${cx - 13} ${burnerY - 10}, ${cx - 11} ${burnerY + 1}, ${cx} ${burnerY + 3} C ${cx + 11} ${burnerY + 1}, ${cx + 13} ${burnerY - 10}, ${cx} ${burnerY - 24} Z" fill="#f7a35c"/>`;
			svg += `<path d="M ${cx} ${burnerY - 12} C ${cx - 6} ${burnerY - 4}, ${cx - 5} ${burnerY + 1}, ${cx} ${burnerY + 2} C ${cx + 5} ${burnerY + 1}, ${cx + 6} ${burnerY - 4}, ${cx} ${burnerY - 12} Z" fill="#fde68a"/>`;
			svg += `<rect x="${cx - 14}" y="${burnerY + 2}" width="28" height="11" rx="3.5" fill="#6e4520" stroke="#fff" stroke-width="2.5"/>`;
			svg += `<path d="M ${cx - m} ${throat} H ${cx + m} L ${cx + m - 5} ${skirt} H ${cx - m + 5} Z" fill="#d97b2b" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`;
			// The wicker basket: four rows of weavers, the stakes showing between them, row by row offset; a padded rim.
			const fy = rimY + 8, face = `M ${cx - bw / 2} ${fy} H ${cx + bw / 2} V ${fy + bh - 12} Q ${cx + bw / 2} ${fy + bh} ${cx + bw / 2 - 12} ${fy + bh} H ${cx - bw / 2 + 12} Q ${cx - bw / 2} ${fy + bh} ${cx - bw / 2} ${fy + bh - 12} Z`;
			svg += `<path d="${face}" fill="#c8843f" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`;
			svg += `<clipPath id="balloon-face"><path d="${face}"/></clipPath><g clip-path="url(#balloon-face)" stroke-linecap="round">`;
			for (let row = 0; row < 4; row++) {
				const y = fy + 7 + row * 13.5;
				svg += `<path d="M ${cx - bw / 2} ${y + 12} H ${cx + bw / 2}" stroke="#9a5d25" stroke-width="2.5"/>`;
				for (let x = cx - bw / 2 + (row % 2 ? 8 : 16); x < cx + bw / 2; x += 16) {
					svg += `<path d="M ${x} ${y + 3} V ${y + 9}" stroke="#9a5d25" stroke-width="2.5"/>`;
				}
			}
			svg += `</g><rect x="${cx - rw / 2}" y="${rimY}" width="${rw}" height="16" rx="8" fill="#5c3a1a" stroke="#fff" stroke-width="3"/>`;
			// The two bags were tied to the ends of the rim: their cut rope ends still hang there.
			const stub = side => {
				const x = cx + side * (rw / 2 - 4);
				return `<path d="M ${x} ${rimY - 2} V ${rimY + 18}" stroke="#fff" stroke-width="9"/>${rope(x, rimY - 2, x, rimY + 18)}${rope(x, rimY + 16, x + side * 16, rimY + 50, { cut: true })}`;
			};
			svg += stub(-1) + stub(1);
			// A burlap sandbag around (0, 0): the sand settled at the bottom, the neck gathered and tied, its rope cut.
			const sack = 'M -16 -50 C -40 -46, -66 -30, -74 0 C -82 28, -84 50, -74 61 C -62 71, -32 73, 0 73 C 32 73, 62 71, 74 61 C 84 50, 82 28, 74 0 C 66 -30, 40 -46, 16 -50 Z';
			let weave = '';
			for (let v = -80; v <= 80; v += 8) {
				weave += `M ${v} -48 V 72 `;
			}
			for (let v = -44; v <= 70; v += 8) {
				weave += `M -82 ${v} H 82 `;
			}
			const bag = (x, y, deg, k) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${deg})" stroke-linejoin="round" stroke-linecap="round">
${rope(5, -56, 8, -92, { cut: true })}
<path d="${sack}" fill="#dcb47c"/>
<path d="M 46 -38 C 66 -22, 76 4, 79 30 C 82 50, 78 60, 68 66 C 54 72, 30 73, 12 73 C 44 64, 60 48, 62 24 C 64 0, 58 -22, 46 -38 Z" fill="#c99a5c"/>
<clipPath id="balloon-sack-${k}"><path d="${sack}"/></clipPath><path d="${weave}" clip-path="url(#balloon-sack-${k})" stroke="#9a6a35" stroke-opacity=".16" stroke-width="1.2"/>
<path d="${sack}" fill="none" stroke="#fff" stroke-width="4"/>
<path d="M -36 -40 C -26 -38, -17 -42, -11 -50 M 36 -40 C 26 -38, 17 -42, 11 -50" fill="none" stroke="#b8894f" stroke-width="2.5"/>
<path d="M -10 -56 L -21 -70 Q -15 -76 -9 -70 Q -4 -78 1 -71 Q 7 -78 12 -70 Q 19 -76 21 -68 L 10 -56 Z" fill="#cda067" stroke="#fff" stroke-width="3"/>
<path d="M -5 -57 L -9 -69 M 1 -57 L 1 -70 M 6 -57 L 11 -69" fill="none" stroke="#b8894f" stroke-width="2"/>
${rope(-16, -50, 16, -50, { w: 7 })}${rope(-13, -56, 13, -56, { w: 6 })}
</g>`;
			// Speed lines over a falling bag, parallel to its fall.
			const speed = (x, y) => [[-30, 26], [0, 42], [30, 26]].map(([dx, len]) => `<path d="M ${r1(x + dx)} ${r1(y - len)} V ${r1(y)}" stroke="#fff" stroke-opacity=".72" stroke-width="5" stroke-linecap="round"/>`).join('');
			const drops = [{ x: cx - 150, y: H - 86, deg: -9 }, { x: cx + 164, y: H - 116, deg: 8 }];
			let html = '';
			(s.bags ?? []).slice(0, 2).forEach((text, k) => {
				const d = drops[k], rad = (d.deg * Math.PI) / 180, oy = 16;
				svg += speed(d.x + 6.5 * Math.cos(rad) + 104 * Math.sin(rad), d.y - 104 * Math.cos(rad) + 6.5 * Math.sin(rad)) + bag(d.x, d.y, d.deg, k);
				html += `<div data-on="#dcb47c">${t('bl-bag', `left:${r1(d.x - oy * Math.sin(rad))}px;top:${r1(d.y + oy * Math.cos(rad))}px;transform:translate(-50%, -50%) rotate(${d.deg}deg)`, fmt(text))}</div>`;
			});
			const who = s.who ?? {}, tx = 800;
			const whoLine = who.name || who.role ? `<div class="bl-who">${who.name ? t('bl-name', '', fmt(who.name), { tag: 'span' }) : ''}${who.role ? t('bl-role lbl', '', fmt(who.role), { tag: 'span' }) : ''}</div>` : '';
			html += `<div class="bl-text" style="left:${tx}px;top:0;width:${W - tx}px;height:${H - 30}px">${t('bl-quote', '', quoted(s, fmt(s.text ?? '')))}${whoLine}</div>`;
			return heading(s) + body(`<div class="balloon" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** A decision drawn as a metro map: a line from the start reaches a junction (the question); "no" runs straight to the
	 * terminus in green; "yes" takes an orange loop past two stations and then rejoins the terminus. Fields: eyebrow,
	 * title, start: { title, icon (default 'play') }, junction: { title, icon (default 'question') }, end: { title, icon
	 * (default 'checkmark') }, no, yes, then (labels on the lines; defaults 'no', 'yes', none), loop (two): [{ title, sub }]. */
	metro: {
		css: `
.metro { position: relative; width: 1728px; }
.metro .mt-st { position: absolute; display: grid; place-items: center; border-radius: 50%; background: #fff; }
.metro .mt-name { position: absolute; display: flex; flex-direction: column; align-items: center; text-align: center; transform: translateX(-50%); }
.metro .mt-t { font-size: 31px; font-weight: 700; line-height: 1.15; color: var(--ink); white-space: nowrap; }
.metro .mt-s { margin-top: 6px; font-size: 25px; font-weight: 600; color: var(--body); white-space: nowrap; }
.metro .mt-edge { position: absolute; transform: translate(-50%, -50%); font-size: 27px; font-weight: 700; white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			// The map sits in the middle of the body: the straight line on top, the loop below.
			const yT = Math.round(H / 2 - 125), yL = yT + 250, S = [110, yT], J = [500, yT], T = [1600, yT];
			const d1 = [J[0] + (yL - yT), yL], d2 = [T[0] - (yL - yT), yL];
			const A = [d1[0] + 150, yL], B = [d2[0] - 160, yL];
			let svg = '';
			const line = (pts, colour) => `<path d="${rounded(pts, 40)}" fill="none" stroke="${colour}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
			svg += line([J, d1, d2, T], 'var(--orange)');
			svg += line([J, T], 'var(--green)');
			svg += line([S, J], 'var(--purple)');
			const st = ([x, y], colour, r = 22, icon = '', size = 0) => `<span class="mt-st" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;box-shadow:inset 0 0 0 ${r > 30 ? 10 : 9}px ${colour};color:${colour}">${icon ? ic(icon, size) : ''}</span>`;
			let html = '';
			html += st(S, 'var(--purple)', 38, s.start?.icon ?? 'play', 34);
			html += st(J, 'var(--ink)', 38, s.junction?.icon ?? 'question', 34);
			html += st(A, 'var(--orange)', 24);
			html += st(B, 'var(--orange)', 24);
			html += st(T, 'var(--green)', 44, s.end?.icon ?? 'checkmark', 40);
			const name = ([x, y], o, below) => (o?.title ? `<div class="mt-name" style="left:${x}px;top:${below ? y + 44 : y - 104}px${below ? '' : ';justify-content:flex-end;height:60px'}"><span class="mt-t" data-t>${fmt(o.title)}</span>${o.sub ? `<span class="mt-s" data-t>${fmt(o.sub)}</span>` : ''}</div>` : '');
			html += name(S, s.start) + name(J, s.junction) + name(T, s.end);
			html += name(A, s.loop?.[0], true) + name(B, s.loop?.[1], true);
			html += `<div class="mt-edge" style="left:${J[0] + 170}px;top:${yT - 44}px;color:var(--green)" data-t>${fmt(s.no ?? 'no')}</div>`;
			html += `<div class="mt-edge" style="left:${J[0] + 70}px;top:${(yT + yL) / 2 + 20}px;color:var(--orange)" data-t>${fmt(s.yes ?? 'yes')}</div>`;
			if (s.then) {
				html += `<div class="mt-edge" style="left:${T[0] - 60}px;top:${(yT + yL) / 2 + 20}px;color:var(--orange)" data-t>${fmt(s.then)}</div>`;
			}
			return heading(s) + body(`<div class="metro" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},
};
