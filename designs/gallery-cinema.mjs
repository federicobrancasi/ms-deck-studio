// A gallery for inspiration (the cinema world): read it for technique: a projector built from simple shapes, a beam onto a screen, lights that pick a few from many, a vault that locks a process in.
// A new deck draws its own pictures in designs/local-<deck>.mjs: do not reuse these as they are. Every visible
// word comes from the slide's fields; examples/daily-film.mjs shows them in a deck.
// One drawing style: 4 px outlines, 20 px corners, tinted fills, Fluent icons, no shadows, blur or filters.
// One object comes back across the deck: the agent's film projector (purple, two reels, a sparkle on its side).
//   cn-cover-a/b/c: the agent's film projector throws a real frame onto a screen; a: clean, b: the report feeds its reel
//                   as a paper tape, c: the tape turns into film, the reels spin, sparkles in the beam, a screen on a stand
//   cn-spot:    the day's merged pull requests as a crowd of dots on a stage; ten lamps on a truss light ten of them
//   cn-lens-photo:  two sharp real frames: the app as recorded, then the glass lens zoomed onto what changed
//   cn-lens-vector: a drawn app window with a drawn glass lens magnifying one changed row, and a caption bar
//   cn-lens-split:  a sharp real frame on the left, the same frame drawn as a numbered plan on the right
//   cn-desk:    the making of the film as a mixing desk: one channel strip per step, faders rising, a master with a monitor
//   cn-clap:    one clapperboard per scene, a row per day, grouped by how the scene was made
//   cn-record:  the day's film as a record of ten tracks, and a crate of drawn scenes with one pulled out
//   cn-marquee: five looks as posters on a cinema wall, under a lit marquee that names what they became
//   cn-vault:   the projector locked in a vault: cut cables outside, an allowlist on the wall, one slot for the film
//   cn-wave:    the delivered and the rebuilt soundtrack as two identical waveforms, stamped
//   cn-switch:  a close on a blue page, one chain: a wall switch still off, a cable to the projector, its unlit beam, the
//               channel with a card per day waiting
import { W, asset, at, body, bodyHeight, esc, fmt, heading, ic, iconTile, mix, msLogo, pill, r1, STYLE, t, wob } from '../src/kit.mjs';

const SW = STYLE.stroke;
const NS = 'vector-effect="non-scaling-stroke"';
const svg = (cls, w, h, inner, defs = '') => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
/** The CSS every body design shares, scoped to its name. */
const base = n => `.${n} { position: relative; width: ${W}px; }
.${n} .${n}-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-a { position: absolute; }
.${n} .${n}-ic { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); }`;
/** An image from assets/, or a placeholder the build reports as missing. */
const img = (cls, src, x, y, w, h) => {
	const a = asset(src ?? '');
	return a ? `<img class="${cls}" src="${a}" alt="" style="${at(x, y, w, h)}">` : `<div class="${cls}" data-missing="${esc(src)}" style="${at(x, y, w, h)}"></div>`;
};
const icAt = (n, x, y, name, size, color) => `<span class="${n}-ic" style="${at(x, y)}">${ic(name, size, color)}</span>`;
/** A four-point sparkle (the AI's mark). */
const sparkle = (x, y, s, fill, extra = '') => `<path d="M ${r1(x)} ${r1(y - s)} Q ${r1(x)} ${r1(y)} ${r1(x + s)} ${r1(y)} Q ${r1(x)} ${r1(y)} ${r1(x)} ${r1(y + s)} Q ${r1(x)} ${r1(y)} ${r1(x - s)} ${r1(y)} Q ${r1(x)} ${r1(y)} ${r1(x)} ${r1(y - s)} Z" fill="${fill}" ${extra}/>`;
const P2 = p => `${r1(p[0])} ${r1(p[1])}`;

/** Convex hull of points (monotone chain), as an SVG path: a projector beam that covers a whole screen. */
function hull(pts) {
	const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo = [], up = [];
	for (const q of p) {
		while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
		lo.push(q);
	}
	for (const q of [...p].reverse()) {
		while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
		up.push(q);
	}
	const h = [...lo.slice(0, -1), ...up.slice(0, -1)];
	return `M ${h.map(P2).join(' L ')} Z`;
}

/** A light beam from a point to a rectangle, filled with a gradient that fades away from the lens. */
function beam(id, L, x, y, w, h, { tone = 'blue', from = 34, to = 8, dashed = false, color = null } = {}) {
	const d = hull([L, [x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
	if (dashed) {
		return { defs: '', svg: `<path d="${d}" fill="none" stroke="${color ?? `var(--${tone})`}" stroke-width="${SW}" stroke-dasharray="3 14" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>` };
	}
	const defs = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r1(L[0])}" y1="${r1(L[1])}" x2="${r1(x + w / 2)}" y2="${r1(y + h / 2)}"><stop offset="0" stop-color="var(--${tone})" stop-opacity="${from / 100}"/><stop offset="1" stop-color="var(--${tone})" stop-opacity="${to / 100}"/></linearGradient>`;
	return { defs, svg: `<path d="${d}" fill="url(#${id})"/>` };
}

const cover = (s, n) => {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left ${n}-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
};

/** A point at deg degrees (0 is right, clockwise) and distance r from (cx, cy). */
const pt = (cx, cy, r, deg) => [cx + Math.cos(deg * Math.PI / 180) * r, cy + Math.sin(deg * Math.PI / 180) * r];

/** A perforated film strip along a path: an outline, a tinted band, and a row of sprocket holes along each edge. */
function filmStrip(d, tone, w = 34, { fill = mix(tone, 14), holes = true } = {}) {
	const p = (sw, stroke, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${r1(sw)}" ${extra}/>`;
	return p(w, `var(--${tone})`) + p(w - 8, fill)
		+ (holes ? p(w - 12, `var(--${tone})`, `stroke-dasharray="${r1(w * 0.17)} ${r1(w * 0.2)}"`) + p(w - 24, fill) : '');
}

/** A strip of paper along a path: a blue outline, white, and grey lines of text running along it. */
function paperStrip(d, w = 44) {
	return `<path d="${d}" fill="none" stroke="var(--blue)" stroke-width="${w}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w - 8}"/>`
		+ `<path d="${d}" fill="none" stroke="var(--line-strong)" stroke-width="8" stroke-dasharray="26 10 12 10"/>`;
}

/** Splits a cubic Bézier at t: two cubics, each as four points. */
function splitCubic(p0, p1, p2, p3, t) {
	const L = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
	const a = L(p0, p1), b = L(p1, p2), c = L(p2, p3), d = L(a, b), e = L(b, c), m = L(d, e);
	return [[p0, a, d, m], [m, e, c, p3]];
}
const cubic = q => `M ${P2(q[0])} C ${P2(q[1])}, ${P2(q[2])}, ${P2(q[3])}`;

/** A film reel: a rim, five round windows, a hub. spin turns the windows (degrees); rich adds the flange's inner edge. */
function filmReel(cx, cy, r, tone, { spin = 0, rich = false, fill = '#fff' } = {}) {
	let g = `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${fill}" stroke="var(--${tone})" stroke-width="${SW}" ${NS}/>`;
	if (rich) g += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.84)}" fill="none" stroke="${mix(tone, 40)}" stroke-width="3" ${NS}/>`;
	for (let i = 0; i < 5; i++) {
		const [hx, hy] = pt(cx, cy, r * 0.5, spin + i * 72 - 90);
		g += `<circle cx="${r1(hx)}" cy="${r1(hy)}" r="${r1(r * 0.19)}" fill="${mix(tone, 18)}" stroke="var(--${tone})" stroke-width="3" ${NS}/>`;
	}
	return g + `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.15)}" fill="var(--${tone})"/><circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r * 0.05)}" fill="#fff"/>`;
}

/** A spin mark: an arc just outside a reel with an arrowhead at its clockwise end. */
function spinArc(cx, cy, r, a0, a1, tone) {
	const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
	const tx = -Math.sin(a1 * Math.PI / 180), ty = Math.cos(a1 * Math.PI / 180), nx = -ty, ny = tx, h = 13;
	return `<path d="M ${r1(x0)} ${r1(y0)} A ${r1(r)} ${r1(r)} 0 0 1 ${r1(x1)} ${r1(y1)}" fill="none" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round" ${NS}/>`
		+ `<path d="M ${r1(x1 - tx * h + nx * h * 0.8)} ${r1(y1 - ty * h + ny * h * 0.8)} L ${r1(x1)} ${r1(y1)} L ${r1(x1 - tx * h - nx * h * 0.8)} ${r1(y1 - ty * h - ny * h * 0.8)}" fill="none" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" ${NS}/>`;
}

/** The agent's film projector, drawn properly: a body on a plinth, a lens barrel with its lens at the front, two reels on
 * posts, and the film threading down from the rear reel into the gate and back up to the front reel. (x, y) is the
 * middle of the body; it faces right and is tilted by rot degrees. level 1: the film as two clean lines; 2: a perforated
 * film strip, vents and a knob; 3: as 2, with the reels spinning. Returns the SVG, the lens tip, the reels and a mapper
 * from the projector's own coordinates to the page. */
function filmProjector({ x, y, k = 1, rot = 0, level = 1, tone = 'purple', fill = mix('purple', 13), plinth = `var(--${tone})` }) {
	const a = rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
	const P = (u, v) => [x + k * (u * c - v * s), y + k * (u * s + v * c)];
	const st = `stroke="var(--${tone})" stroke-width="${SW}" ${NS}`;
	const R = 68, RC = [-78, -176], FC = [82, -176];
	let g = `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)}) scale(${r1(k * 1000) / 1000})">`;
	// The posts that hold the reels.
	g += `<path d="M ${RC[0]} ${RC[1]} V -40 M ${FC[0]} ${FC[1]} V -40" stroke="${plinth}" stroke-width="14" stroke-linecap="round"/>`;
	// The film: down from the rear reel into the gate, and back up to the front reel.
	const r0 = pt(...RC, R - 10, 52), f0 = pt(...FC, R - 10, 128);
	const fd = `M ${P2(r0)} L -22 -40 M 22 -40 L ${P2(f0)}`;
	g += filmStrip(fd, tone, 28, { holes: level >= 2 });
	if (level >= 3) {
		g += spinArc(...RC, R + 20, 196, 252, tone) + spinArc(...RC, R + 20, 290, 318, tone);
		g += spinArc(...FC, R + 20, 232, 260, tone) + spinArc(...FC, R + 20, 290, 346, tone);
	}
	g += filmReel(...RC, R, tone, { spin: 8, rich: level >= 2 }) + filmReel(...FC, R, tone, { spin: 44, rich: level >= 2 });
	// The plinth, the body and the lens.
	g += `<rect x="-112" y="48" width="224" height="30" rx="12" fill="${plinth}"/>`;
	g += `<rect x="-134" y="-62" width="268" height="124" rx="28" fill="${fill}" ${st}/>`;
	g += `<rect x="132" y="-28" width="38" height="56" rx="8" fill="#fff" ${st}/>`;
	g += `<rect x="168" y="-44" width="26" height="88" rx="12" fill="${mix('blue', 28)}" stroke="var(--blue)" stroke-width="${SW}" ${NS}/>`;
	g += `<path d="M 177 -28 V -12" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
	g += sparkle(level >= 2 ? 14 : 0, 0, 32, `var(--${tone})`) + sparkle(level >= 2 ? 54 : 40, -30, 11, `var(--${tone})`);
	if (level >= 2) {
		g += [-30, -12, 6, 24].map(v => `<path d="M -112 ${v} H -84" ${st} stroke-linecap="round" opacity=".55"/>`).join('');
		g += `<circle cx="102" cy="32" r="10" fill="#fff" ${st}/>`;
	}
	g += '</g>';
	return { svg: g, lens: P(194, 0), rear: [...P(...RC), R * k], front: [...P(...FC), R * k], at: P, R };
}

/** The cover, in three levels of detail. Left: eyebrow, title, sub, speaker, pills; the logo on top. Right: the agent's
 * film projector throwing a real frame of the film onto a screen. Level 1: the projector, its beam and a framed screen.
 * Level 2: adds the day's report feeding the rear reel as a paper tape, the perforated film path and a pull-down screen.
 * Level 3: the tape turns into film on the way, the reels spin, sparkles in the beam, and the screen stands on a tripod.
 * Fields: eyebrow, title, sub, speaker: { initials, name, role }, pills, src (the frame on the screen), caption (over the
 * screen), report (the page's tag, levels 2 and 3). */
function coverDesign(n, level) {
	return {
		bare: true,
		css: `
.${n} { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.${n} .${n}-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-left { width: 760px; }
.${n} .${n}-shot { position: absolute; display: block; object-fit: cover; border-radius: 8px; background: #111; }
.${n} .${n}-a { position: absolute; }
.${n} .${n}-cap { color: var(--muted); }
.${n} .${n}-tag { font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--blue); white-space: nowrap; }
`,
		render(s) {
			const L = {
				1: { scr: [1250, 214, 574], pr: { x: 1080, y: 860, k: 1.1, rot: -9 } },
				2: { scr: [1262, 222, 562], pr: { x: 1150, y: 872, k: 0.98, rot: -9 }, page: [724, 880, 164, 152] },
				3: { scr: [1278, 170, 546], pr: { x: 1150, y: 872, k: 0.98, rot: -9 }, page: [724, 880, 164, 152] },
			}[level];
			const [sx, sy, sw] = L.scr, sh = sw * 9 / 16;
			const pr = filmProjector({ ...L.pr, level });
			let defs = '', g = '';
			// The screen's stand (level 3) goes behind the beam.
			if (level === 3) {
				const cx = sx + sw / 2, fy = 1032, top = sy + sh + 14;
				g += `<path d="M ${r1(cx)} ${r1(top)} V ${fy - 64}" stroke="var(--blue)" stroke-width="12" stroke-linecap="round"/>`;
				g += `<path d="M ${r1(cx - 96)} ${fy} L ${r1(cx)} ${fy - 64} L ${r1(cx + 96)} ${fy} M ${r1(cx)} ${fy - 64} V ${fy + 6}" fill="none" stroke="var(--blue)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
				g += `<circle cx="${r1(cx)}" cy="${fy - 64}" r="12" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
			}
			const b = beam(`${n}-beam`, pr.lens, sx, sy, sw, sh, { from: 42, to: 10 });
			defs += b.defs;
			g += b.svg;
			if (level >= 2) {
				[[0.12, 0.62], [0.5, 0.78], [0.9, 0.94]].forEach(([fx, fy]) => {
					g += `<path d="M ${P2(pr.lens)} L ${r1(sx + sw * fx)} ${r1(sy + sh * fy)}" stroke="#fff" stroke-width="${SW}" stroke-linecap="round" opacity=".8" stroke-dasharray="44 26"/>`;
				});
			}
			if (level === 3) {
				const [lx, ly] = pr.lens;
				[[0.34, 0.2, 0.9, 20], [0.56, 0.3, 0.95, 12], [0.36, 0.95, 0.9, 15], [0.78, 0.85, 1, 11]].forEach(([u, fx, fy, z]) => {
					g += sparkle(lx + (sx + sw * fx - lx) * u, ly + (sy + sh * fy - ly) * u, z, 'var(--purple)');
				});
			}
			// The screen.
			if (level === 2) {
				g += `<rect x="${sx - 44}" y="${sy - 50}" width="${sw + 88}" height="26" rx="13" fill="var(--blue)"/>`;
				g += `<path d="M ${r1(sx + sw / 2)} ${r1(sy + sh + 14)} V ${r1(sy + sh + 40)}" stroke="var(--blue)" stroke-width="${SW}" stroke-linecap="round"/><circle cx="${r1(sx + sw / 2)}" cy="${r1(sy + sh + 50)}" r="10" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
			}
			g += `<rect x="${sx - 14}" y="${sy - 14}" width="${sw + 28}" height="${r1(sh + 28)}" rx="${STYLE.radius}" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
			// The day's report, feeding the rear reel: paper all the way (level 2), or paper that turns into film (level 3).
			let html = '';
			if (L.page) {
				const [px, py, pw, ph] = L.page;
				const end = pr.at(-78 - (pr.R - 20), -176), c2 = pr.at(-78 - (pr.R - 20), -90);
				const q = [[px + pw / 2, py + 30], [px + pw / 2, py - 150], c2, end];
				if (level === 2) {
					g += paperStrip(cubic(q), 44);
				} else {
					const [qa, qb] = splitCubic(...q, 0.42);
					g += filmStrip(cubic(qb), 'purple', 36) + paperStrip(cubic(qa), 44);
					const m = qa[3];
					g += `<circle cx="${r1(m[0])}" cy="${r1(m[1])}" r="30" fill="#fff"/>`;
					g += sparkle(m[0] + 2, m[1], 24, 'var(--purple)') + sparkle(m[0] - 46, m[1] - 24, 12, 'var(--purple)') + sparkle(m[0] + 40, m[1] + 30, 9, 'var(--purple)');
				}
				g += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="16" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
				[1, 1, 0, 0].forEach((hi, i) => {
					g += `<rect x="${px + 20}" y="${py + 64 + i * 22}" width="${pw - 40 - (i === 3 ? 40 : 0)}" height="10" rx="5" fill="${hi ? 'var(--blue)' : 'var(--line-strong)'}"/>`;
				});
				html += t(`${n}-a ${n}-tag`, at(px + 20, py + 18), fmt(s.report ?? '#release-notes'), { nolint: true });
			}
			g += pr.svg;
			html += img(`${n}-shot`, s.src, sx, sy, sw, sh);
			if (s.caption) html += t(`lbl ${n}-a ${n}-cap`, at(sx, sy - (level === 2 ? 96 : 60), sw), fmt(s.caption), { nolint: true });
			return `<div class="${n}">${svg(`${n}-svg`, 1920, 1080, g, defs)}${cover(s, n)}${html}${msLogo()}</div>`;
		},
	};
}

export const designs = {
	'cn-cover-a': coverDesign('cn-cover-a', 1),
	'cn-cover-b': coverDesign('cn-cover-b', 2),
	'cn-cover-c': coverDesign('cn-cover-c', 3),

	/** A stage: the day's merged pull requests are a crowd of grey dots on the floor; a lighting truss above holds one
	 * lamp per change in the film, each throwing a cone onto one dot, lit blue. Two big numbers on the left: the lamps,
	 * then the crowd. Fields: eyebrow, title, picked: { value, label } (the lit ones), crowd: { value, label } (all), cols. */
	'cn-spot': {
		css: `${base('cn-spot')}
.cn-spot .cn-spot-big { font-size: 132px; font-weight: 700; letter-spacing: -.045em; line-height: .9; white-space: nowrap; }
.cn-spot .cn-spot-lab { font-size: 28px; font-weight: 600; line-height: 1.25; }
`,
		render(s) {
			const n = 'cn-spot', H = bodyHeight(s);
			const crowd = s.crowd ?? {}, picked = s.picked ?? {};
			const total = Number(crowd.value ?? 138), m = Number(picked.value ?? 10), cols = s.cols ?? 23, rows = Math.ceil(total / cols);
			const x0 = 470, x1 = 1676, fy0 = 372, fy1 = H - 46;
			const px = (x1 - x0) / (cols - 1), py = (fy1 - fy0) / Math.max(1, rows - 1);
			const dot = i => [x0 + (i % cols) * px + wob(i) * 6, fy0 + Math.floor(i / cols) * py + wob(i, 3) * 5];
			const trussY = 26, lampY = 92;
			const rowOrder = [2, 4, 0, 3, 5, 1, 4, 2, 5, 3];
			const lamps = [], lit = new Set();
			for (let j = 0; j < m; j++) {
				const lx = x0 + 10 + j * (x1 - x0 - 20) / Math.max(1, m - 1);
				let col = Math.round((lx - x0) / px), row = Math.min(rows - 1, rowOrder[j % rowOrder.length]);
				let idx = row * cols + col;
				while (idx >= total || lit.has(idx)) idx = (idx + cols + 1) % total;
				lit.add(idx);
				lamps.push({ lx, idx });
			}
			let defs = `<linearGradient id="${n}-cone" gradientUnits="userSpaceOnUse" x1="0" y1="${lampY}" x2="0" y2="${fy1}"><stop offset="0" stop-color="var(--blue)" stop-opacity=".34"/><stop offset="1" stop-color="var(--blue)" stop-opacity=".1"/></linearGradient>`;
			let g = '';
			// The truss: two rails and a zig-zag.
			const tx0 = x0 - 50, tx1 = x1 + 24;
			let zig = `M ${tx0} ${trussY + 26}`;
			for (let x = tx0, k = 0; x <= tx1; x += 26, k++) zig += ` L ${r1(x)} ${k % 2 ? trussY + 26 : trussY}`;
			g += `<path d="${zig}" fill="none" stroke="var(--connector)" stroke-width="3" stroke-linejoin="round"/>`;
			g += `<path d="M ${tx0} ${trussY} H ${tx1} M ${tx0} ${trussY + 26} H ${tx1}" stroke="var(--body)" stroke-width="${SW}" stroke-linecap="round"/>`;
			// Cones and pools first, under the crowd.
			let lampsSvg = '';
			for (const { lx, idx } of lamps) {
				const [dx, dy] = dot(idx);
				const ang = Math.atan2(dx - lx, dy - lampY);
				const mouth = 46, ca = Math.cos(ang), sa = Math.sin(ang);
				const mx = lx + sa * mouth, my = lampY + ca * mouth;
				const mL = [mx - ca * 26, my + sa * 26], mR = [mx + ca * 26, my - sa * 26];
				g += `<path d="M ${P2(mL)} L ${P2(mR)} L ${r1(dx + 46)} ${r1(dy)} L ${r1(dx - 46)} ${r1(dy)} Z" fill="url(#${n}-cone)"/>`;
				g += `<ellipse cx="${r1(dx)}" cy="${r1(dy + 4)}" rx="46" ry="15" fill="${mix('blue', 30)}"/>`;
				const deg = -ang * 180 / Math.PI;
				lampsSvg += `<path d="M ${r1(lx)} ${trussY + 26} V ${lampY}" stroke="var(--body)" stroke-width="${SW}" stroke-linecap="round"/>`;
				lampsSvg += `<g transform="translate(${r1(lx)} ${lampY}) rotate(${r1(deg)})"><path d="M -17 -8 L 17 -8 L 27 ${mouth} L -27 ${mouth} Z" fill="#fff" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/><rect x="-29" y="${mouth - 6}" width="58" height="12" rx="6" fill="var(--blue)"/></g>`;
				lampsSvg += `<circle cx="${r1(lx)}" cy="${lampY}" r="7" fill="var(--ink)"/>`;
			}
			g += lampsSvg;
			for (let i = 0; i < total; i++) {
				const [x, y] = dot(i);
				g += lit.has(i)
					? `<circle cx="${r1(x)}" cy="${r1(y)}" r="17" fill="var(--blue)" stroke="#fff" stroke-width="${SW}"/>`
					: `<circle cx="${r1(x)}" cy="${r1(y)}" r="11" fill="#fff" stroke="var(--faint)" stroke-width="3"/>`;
			}
			g += `<path d="M ${x0 - 40} ${H - 4} H ${x1 + 30}" stroke="var(--line-strong)" stroke-width="${SW}" stroke-linecap="round"/>`;
			const html = t(`${n}-a ${n}-big`, at(0, 40) + ';color:var(--blue)', esc(picked.value ?? '10'), { nolint: true })
				+ t(`${n}-a ${n}-lab`, at(0, 172, 340) + ';color:var(--blue)', fmt(picked.label ?? ''))
				+ t(`${n}-a ${n}-big`, at(0, fy0 + 10) + ';color:var(--body)', esc(crowd.value ?? '138'), { nolint: true })
				+ t(`${n}-a ${n}-lab`, at(0, fy0 + 142, 360) + ';color:var(--body)', fmt(crowd.label ?? ''));
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g, defs)}${html}</div>`, { vcenter: false });
		},
	},

	/** The look, in two real frames of the film: the app as recorded, then the glass lens zoomed onto what changed. A
	 * blue outline marks the change in the first frame and dotted zoom lines run to the lens in the second.
	 * Fields: eyebrow, title, before: { src, label, mark: [fx0, fy0, fx1, fy1] }, after: { src, label, lens: [fx0, fy0, fx1, fy1] }. */
	'cn-lens-photo': {
		css: `${base('cn-lens-photo')}
.cn-lens-photo .cn-lens-photo-shot { position: absolute; display: block; object-fit: cover; border-radius: 14px; background: #111; }
.cn-lens-photo .cn-lens-photo-lab { color: var(--muted); }
.cn-lens-photo .cn-lens-photo-lab.on { color: var(--blue); }
`,
		render(s) {
			const n = 'cn-lens-photo', H = bodyHeight(s);
			const b = s.before ?? {}, a = s.after ?? {};
			const bw = 584, bh = bw * 9 / 16, aw = 1064, ah = aw * 9 / 16, ax = W - aw, ay = (H - ah) / 2 + 22, by = ay + (ah - bh) / 2;
			const [m0, m1, m2, m3] = b.mark ?? [0.3, 0.2, 0.42, 0.28], [l0, l1, l2, l3] = a.lens ?? [0.22, 0.12, 0.54, 0.36];
			const pad = 8, mk = [m0 * bw - pad, by + m1 * bh - pad, m2 * bw + pad, by + m3 * bh + pad];
			const lp = 10, ln = [ax + l0 * aw - lp, ay + l1 * ah - lp, ax + l2 * aw + lp, ay + l3 * ah + lp];
			let g = `<rect x="${r1(mk[0])}" y="${r1(mk[1])}" width="${r1(mk[2] - mk[0])}" height="${r1(mk[3] - mk[1])}" rx="12" fill="none" stroke="var(--blue)" stroke-width="${SW}"/>`;
			g += `<rect x="${r1(ln[0])}" y="${r1(ln[1])}" width="${r1(ln[2] - ln[0])}" height="${r1(ln[3] - ln[1])}" rx="${r1(0.036 * aw + lp)}" fill="none" stroke="var(--blue)" stroke-width="${SW}"/>`;
			g += `<path d="M ${r1(mk[2])} ${r1(mk[1] + 6)} L ${r1(ln[0] + 24)} ${r1(ln[1])} M ${r1(mk[2])} ${r1(mk[3] - 6)} L ${r1(ln[0] + 24)} ${r1(ln[3])}" stroke="var(--blue)" stroke-width="${SW}" stroke-dasharray="2 12" stroke-linecap="round"/>`;
			let html = img(`${n}-shot`, b.src, 0, by, bw, bh) + img(`${n}-shot`, a.src, ax, ay, aw, ah) + svg(`${n}-svg`, W, H, g);
			if (b.label) html += t(`lbl ${n}-a ${n}-lab`, at(0, by - 40), fmt(b.label), { nolint: true });
			if (a.label) html += t(`lbl ${n}-a ${n}-lab on`, at(ax, ay - 40), fmt(a.label), { nolint: true });
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** The look, drawn: a app window (title bar, activity bar, a sidebar of sessions, an editor, the status bar), one
	 * session row changed, and a glass lens over the editor showing that row magnified: its new button under the cursor,
	 * with its tooltip. A caption bar names the change, as in the film. No photo.
	 * Fields: eyebrow, title, tip (the tooltip in the lens), caption: { no, text }. */
	'cn-lens-vector': {
		css: `${base('cn-lens-vector')}
.cn-lens-vector .cn-lens-vector-tip { font-size: 34px; font-weight: 600; color: #fff; white-space: nowrap; display: flex; align-items: center; justify-content: center; }
.cn-lens-vector .cn-lens-vector-no { font-family: var(--mono); font-size: 44px; font-weight: 600; color: var(--blue); line-height: 1; white-space: nowrap; }
.cn-lens-vector .cn-lens-vector-cap { font-size: 32px; font-weight: 700; color: var(--ink); line-height: 1.15; white-space: nowrap; }
`,
		render(s) {
			const n = 'cn-lens-vector', H = bodyHeight(s);
			const wx0 = 96, wx1 = W - 96, wy0 = 4, wy1 = H - 4, tb = 56, ab = 76, sb = 360, stH = 30;
			const sx0 = wx0 + ab, sx1 = sx0 + sb, ex0 = sx1;
			const line = (x, y, w, fill, h = 12) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${h}" rx="${h / 2}" fill="${fill}"/>`;
			let defs = `<clipPath id="${n}-win"><rect x="${wx0}" y="${wy0}" width="${wx1 - wx0}" height="${wy1 - wy0}" rx="${STYLE.radius}"/></clipPath>`;
			let g = `<rect x="${wx0}" y="${wy0}" width="${wx1 - wx0}" height="${wy1 - wy0}" rx="${STYLE.radius}" fill="#fff"/>`;
			let win = '';
			// Title bar, activity bar, status bar.
			win += `<rect x="${wx0}" y="${wy0}" width="${wx1 - wx0}" height="${tb}" fill="var(--surface)"/><rect x="${wx0}" y="${wy0 + tb}" width="${ab}" height="${wy1 - wy0 - tb}" fill="var(--surface)"/>`;
			win += `<rect x="${wx0}" y="${wy1 - stH}" width="${wx1 - wx0}" height="${stH}" fill="var(--blue)"/>`;
			win += ['red', 'yellow', 'green'].map((c, i) => `<circle cx="${wx0 + 30 + i * 26}" cy="${wy0 + tb / 2}" r="8" fill="var(--${c})"/>`).join('');
			const cx = (wx0 + wx1) / 2;
			win += `<rect x="${cx - 230}" y="${wy0 + 13}" width="460" height="30" rx="10" fill="#fff" stroke="var(--line-strong)" stroke-width="3"/>` + line(cx - 70, wy0 + 22, 140, 'var(--line-strong)');
			win += `<path d="M ${wx0} ${wy0 + tb} H ${wx1} M ${sx0} ${wy0 + tb} V ${wy1 - stH} M ${sx1} ${wy0 + tb} V ${wy1 - stH}" stroke="var(--line)" stroke-width="3"/>`;
			win += `<rect x="${wx0}" y="${wy0 + tb + 14}" width="5" height="44" rx="2" fill="var(--blue)"/>`;
			// The sidebar: a header, session rows, one of them changed.
			win += line(sx0 + 24, wy0 + tb + 26, 110, 'var(--faint)');
			const rowY = i => wy0 + tb + 66 + i * 50, chg = 2;
			for (let i = 0; i < 9; i++) {
				const y = rowY(i);
				if (i === chg) win += `<rect x="${sx0 + 8}" y="${y - 6}" width="${sb - 16}" height="44" rx="10" fill="${mix('blue', 12)}"/>`;
				win += `<rect x="${sx0 + 24}" y="${y + 6}" width="20" height="20" rx="6" fill="none" stroke="${i === chg ? 'var(--blue)' : 'var(--faint)'}" stroke-width="3"/>`;
				win += line(sx0 + 58, y + 10, [168, 120, 150, 190, 104, 140, 176, 96, 130][i], i === chg ? 'var(--body)' : 'var(--line-strong)');
			}
			const bx = sx1 - 82, byy = rowY(chg) + 2;
			win += `<rect x="${bx}" y="${byy}" width="28" height="28" rx="7" fill="#fff" stroke="var(--blue)" stroke-width="3"/><path d="M ${bx + 14} ${byy + 7} V ${byy + 21} M ${bx + 7} ${byy + 14} H ${bx + 21}" stroke="var(--blue)" stroke-width="3" stroke-linecap="round"/>`;
			win += `<path d="M ${bx + 40} ${byy + 14} l 6 6 l 11 -12" fill="none" stroke="var(--body)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
			// The editor: tabs and code.
			win += `<rect x="${ex0}" y="${wy0 + tb}" width="${wx1 - ex0}" height="46" fill="var(--surface)"/><rect x="${ex0}" y="${wy0 + tb}" width="220" height="46" fill="#fff"/><rect x="${ex0}" y="${wy0 + tb}" width="220" height="4" fill="var(--blue)"/>`;
			win += line(ex0 + 28, wy0 + tb + 17, 150, 'var(--body)') + line(ex0 + 250, wy0 + tb + 17, 130, 'var(--faint)');
			const tones = ['purple', 'blue', 'green', 'orange'];
			for (let i = 0; i < 13; i++) {
				const y = wy0 + tb + 72 + i * 34, ind = [0, 1, 1, 2, 2, 1, 0, 0, 1, 2, 1, 0, 0][i];
				win += line(ex0 + 24, y, 22, 'var(--line-strong)', 10);
				let x = ex0 + 76 + ind * 40;
				[0, 1, 2].slice(0, 1 + (i % 3)).forEach((_, j) => {
					const w = 60 + Math.abs(wob(i * 3 + j)) * 150;
					win += line(x, y, w, mix(tones[(i + j) % 4], 42), 10);
					x += w + 16;
				});
			}
			g += `<g clip-path="url(#${n}-win)">${win}</g>`;
			g += `<rect x="${wx0}" y="${wy0}" width="${wx1 - wx0}" height="${wy1 - wy0}" rx="${STYLE.radius}" fill="none" stroke="var(--ink)" stroke-width="${SW}"/>`;
			// The glass lens over the editor, the change magnified in it.
			const lx = ex0 + 150, ly = wy0 + tb + 60, lw = 760, lh = 284, lr = 72;
			const mk = [sx0 + 4, rowY(chg) - 10, sx1 - 4, rowY(chg) + 42];
			g += `<rect x="${mk[0]}" y="${mk[1]}" width="${mk[2] - mk[0]}" height="${mk[3] - mk[1]}" rx="12" fill="none" stroke="var(--blue)" stroke-width="${SW}"/>`;
			g += `<path d="M ${mk[2]} ${mk[1] + 4} L ${lx + 30} ${ly + 8} M ${mk[2]} ${mk[3] - 4} L ${lx + 30} ${ly + lh - 8}" stroke="var(--blue)" stroke-width="${SW}" stroke-dasharray="2 12" stroke-linecap="round"/>`;
			defs += `<clipPath id="${n}-lens"><rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="${lr}"/></clipPath>`;
			let lens = `<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="#fff"/>`;
			const ry = ly + 44, rh = 110;
			lens += `<rect x="${lx - 20}" y="${ry}" width="${lw + 40}" height="${rh}" fill="${mix('blue', 12)}"/>`;
			lens += line(lx + 70, ry + rh / 2 - 14, 250, 'var(--body)', 28);
			const pbx = lx + 400, pby = ry + rh / 2 - 36, ps = 72;
			lens += `<rect x="${pbx}" y="${pby}" width="${ps}" height="${ps}" rx="18" fill="#fff" stroke="var(--blue)" stroke-width="${STYLE.strokeBold}"/><path d="M ${pbx + ps / 2} ${pby + 18} V ${pby + ps - 18} M ${pbx + 18} ${pby + ps / 2} H ${pbx + ps - 18}" stroke="var(--blue)" stroke-width="${STYLE.strokeBold + 2}" stroke-linecap="round"/>`;
			lens += `<path d="M ${pbx + 120} ${ry + rh / 2} l 16 16 l 30 -32" fill="none" stroke="var(--body)" stroke-width="${STYLE.strokeBold + 2}" stroke-linecap="round" stroke-linejoin="round"/>`;
			const cxp = pbx + ps / 2 + 6, cyp = pby + ps / 2 + 2;
			lens += `<path d="M ${cxp} ${cyp} l 0 50 l 12 -12 l 10 22 l 10 -5 l -10 -21 l 17 0 Z" fill="var(--ink)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>`;
			const tx = lx + 120, ty = ry + rh + 16, tw = 560, th = 64;
			lens += `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="14" fill="var(--ink)"/>`;
			g += `<g clip-path="url(#${n}-lens)">${lens}</g>`;
			g += `<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="${lr}" fill="none" stroke="var(--blue)" stroke-width="${STYLE.strokeBold}"/>`;
			g += `<rect x="${lx + 12}" y="${ly + 12}" width="${lw - 24}" height="${lh - 24}" rx="${lr - 12}" fill="none" stroke="${mix('blue', 30)}" stroke-width="3"/>`;
			let html = `<div class="${n}-a" data-on="#1b1b1f" data-shape style="${at(tx, ty, tw, th)}">${t(`${n}-tip`, `height:${th}px`, fmt(s.tip ?? ''), { nolint: true })}</div>`;
			['copy', 'search', 'branch', 'extension', 'bot'].forEach((nm, i) => { html += icAt(n, wx0 + ab / 2, wy0 + tb + 36 + i * 60, nm, 30, i ? 'var(--faint)' : 'var(--ink)'); });
			// The caption bar, as in the film.
			const cap = s.caption ?? {}, ccx = ex0 + 40, ccy = wy1 - stH - 120, ccw = 820, cch = 92;
			g += `<rect x="${ccx}" y="${ccy}" width="${ccw}" height="${cch}" rx="${STYLE.radius}" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<rect x="${ccx + 112}" y="${ccy + 22}" width="4" height="${cch - 44}" rx="2" fill="var(--line-strong)"/>`;
			html += t(`${n}-a ${n}-no`, at(ccx + 30, ccy + 24), fmt(cap.no ?? ''), { nolint: true });
			html += t(`${n}-a ${n}-cap`, at(ccx + 140, ccy + 26), fmt(cap.text ?? ''), { nolint: true });
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g, defs)}${html}</div>`, { vcenter: false });
		},
	},

	/** The look, both ways: a real frame of the film on the left, and on the right the same frame drawn as a plan, its
	 * three parts numbered, with a numbered key under it. Fields: eyebrow, title, src, lens: [fx0, fy0, fx1, fy1] (the
	 * lens in the frame), parts (3): [{ title, sub }] (the app, the lens, the line). */
	'cn-lens-split': {
		css: `${base('cn-lens-split')}
.cn-lens-split .cn-lens-split-shot { position: absolute; display: block; object-fit: cover; border-radius: 14px; background: #111; }
.cn-lens-split .cn-lens-split-row { position: absolute; display: flex; align-items: center; gap: 20px; white-space: nowrap; }
.cn-lens-split .cn-lens-split-no { flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-size: 22px; font-weight: 700; color: #fff; background: var(--fg); }
.cn-lens-split .cn-lens-split-t { font-size: 30px; font-weight: 600; color: var(--ink); }
.cn-lens-split .cn-lens-split-s { font-size: 26px; color: var(--body); }
.cn-lens-split .cn-lens-split-pin { position: absolute; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-size: 22px; font-weight: 700; color: #fff; background: var(--fg); transform: translate(-50%, -50%); box-shadow: 0 0 0 4px #fff; }
`,
		render(s) {
			const n = 'cn-lens-split', H = bodyHeight(s);
			const fw = 1040, fh = fw * 9 / 16, fy = (H - fh) / 2;
			const px = fw + 80, pw = W - px, ph = pw * 9 / 16, py = fy;
			const X = f => px + f * pw, Y = f => py + f * ph;
			const [l0, l1, l2, l3] = s.lens ?? [0.22, 0.12, 0.54, 0.36];
			const tones = ['ink', 'blue', 'purple'];
			let g = `<rect x="${px}" y="${py}" width="${r1(pw)}" height="${r1(ph)}" rx="14" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="${SW}"/>`;
			// The app.
			const wa = [0.255, 0.056, 0.966, 0.764];
			g += `<rect x="${r1(X(wa[0]))}" y="${r1(Y(wa[1]))}" width="${r1(X(wa[2]) - X(wa[0]))}" height="${r1(Y(wa[3]) - Y(wa[1]))}" rx="10" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<path d="M ${r1(X(wa[0]) + 2)} ${r1(Y(wa[1]) + 26)} H ${r1(X(wa[2]) - 2)} M ${r1(X(0.415))} ${r1(Y(wa[1]) + 26)} V ${r1(Y(wa[3]) - 2)}" stroke="var(--line-strong)" stroke-width="3"/>`;
			for (let i = 0; i < 5; i++) g += `<rect x="${r1(X(0.43))}" y="${r1(Y(0.42) + i * 22)}" width="${r1(pw * (0.14 + Math.abs(wob(i)) * 0.24))}" height="9" rx="4.5" fill="var(--line-strong)"/>`;
			for (let i = 0; i < 6; i++) g += `<rect x="${r1(X(0.275))}" y="${r1(Y(0.42) + i * 22)}" width="${r1(pw * 0.1)}" height="9" rx="4.5" fill="var(--line-strong)"/>`;
			// The lens.
			g += `<rect x="${r1(X(l0))}" y="${r1(Y(l1))}" width="${r1(X(l2) - X(l0))}" height="${r1(Y(l3) - Y(l1))}" rx="26" fill="${mix('blue', 14)}" stroke="var(--blue)" stroke-width="${STYLE.strokeBold}"/>`;
			g += `<rect x="${r1(X(l0) + 24)}" y="${r1((Y(l1) + Y(l3)) / 2 - 8)}" width="${r1((X(l2) - X(l0)) * 0.55)}" height="16" rx="8" fill="var(--blue)"/>`;
			// The line.
			g += `<rect x="${r1(X(0.0625))}" y="${r1(Y(0.81))}" width="26" height="12" rx="6" fill="var(--purple)"/>`;
			g += `<rect x="${r1(X(0.0625))}" y="${r1(Y(0.87))}" width="${r1(pw * 0.42)}" height="16" rx="8" fill="var(--purple)"/>`;
			let html = img(`${n}-shot`, s.src, 0, fy, fw, fh) + svg(`${n}-svg`, W, H, g);
			const pins = [[X(0.9), Y(0.2)], [X(l2), Y(l1)], [X(0.0625 + 0.42) + 30, Y(0.88)]];
			const parts = (s.parts ?? []).slice(0, 3);
			const ky = py + ph + 34, kh = (fy + fh - ky) / Math.max(1, parts.length);
			parts.forEach((p, i) => {
				const tone = tones[i] === 'ink' ? 'neutral' : tones[i];
				html += `<div class="${n}-pin t-${tone}" style="${at(pins[i][0], pins[i][1])}${tones[i] === 'ink' ? ';background:var(--ink)' : ''}" data-t>${i + 1}</div>`;
				html += `<div class="${n}-row t-${tone}" style="${at(px, ky + i * kh, pw, kh)}"><span class="${n}-no"${tones[i] === 'ink' ? ' style="background:var(--ink)"' : ''} data-t>${i + 1}</span>${t(`${n}-t`, '', fmt(p.title), { tag: 'span', nolint: true })}${p.sub ? t(`${n}-s`, '', fmt(p.sub), { tag: 'span' }) : ''}</div>`;
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** The making of the film as a mixing desk: one channel strip per step (number, icon, name, a knob, a fader and a
	 * level meter), the faders rising from left to right, and a master section with a monitor showing a real frame.
	 * Fields: eyebrow, title, channels (4-6): [{ icon, title, tone }], master: { title, sub, src }. */
	'cn-desk': {
		css: `${base('cn-desk')}
.cn-desk .cn-desk-no { font-size: 18px; font-weight: 600; letter-spacing: .16em; color: var(--muted); text-align: center; }
.cn-desk .cn-desk-t { font-size: 29px; font-weight: 600; color: var(--ink); text-align: center; white-space: nowrap; }
.cn-desk .cn-desk-mt { font-size: 36px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.cn-desk .cn-desk-ms { font-size: 26px; color: var(--body); white-space: nowrap; }
.cn-desk .cn-desk-shot { position: absolute; display: block; object-fit: cover; border-radius: 10px; background: #111; }
`,
		render(s) {
			const n = 'cn-desk', H = bodyHeight(s);
			const chans = (s.channels ?? []).slice(0, 6), master = s.master ?? {};
			const dy0 = 8, dy1 = H - 6;
			const mx0 = 1196, mx1 = W - 24;
			const cx0 = 28, cpitch = (mx0 - 24 - cx0) / chans.length, cw = cpitch - 22;
			let g = `<rect x="2" y="${dy0}" width="${W - 4}" height="${dy1 - dy0}" rx="32" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="${SW}"/>`;
			let html = '';
			const slotTop = 326, slotBot = dy1 - 40, segs = 11, segH = (slotBot - slotTop) / segs;
			chans.forEach((ch, i) => {
				const tone = ch.tone ?? 'blue', x = cx0 + i * cpitch, cx = x + cw / 2;
				g += `<rect x="${r1(x)}" y="${dy0 + 20}" width="${r1(cw)}" height="${dy1 - dy0 - 40}" rx="${STYLE.radius}" fill="#fff" stroke="var(--line)" stroke-width="${SW}"/>`;
				// The knob.
				const ky = 262, ka = (-140 + i * 48) * Math.PI / 180;
				g += `<circle cx="${r1(cx)}" cy="${ky}" r="24" fill="${mix(tone, 12)}" stroke="var(--${tone})" stroke-width="${SW}"/><path d="M ${r1(cx)} ${ky} L ${r1(cx + Math.sin(ka) * 18)} ${r1(ky - Math.cos(ka) * 18)}" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round"/>`;
				// The fader slot with its scale, and the meter.
				const fx = cx - 26, mxl = cx + 30;
				for (let k = 0; k <= 8; k++) {
					const yy = slotTop + k * (slotBot - slotTop) / 8;
					g += `<path d="M ${r1(fx - 30)} ${r1(yy)} H ${r1(fx - 18)}" stroke="var(--faint)" stroke-width="3" stroke-linecap="round"/>`;
				}
				g += `<rect x="${r1(fx - 5)}" y="${slotTop}" width="10" height="${r1(slotBot - slotTop)}" rx="5" fill="var(--line-strong)"/>`;
				const lit = 4 + i;
				for (let k = 0; k < segs; k++) {
					const yy = slotBot - (k + 1) * segH + 4;
					g += `<rect x="${r1(mxl)}" y="${r1(yy)}" width="18" height="${r1(segH - 8)}" rx="4" fill="${k < lit ? `var(--${tone})` : 'var(--track)'}"/>`;
				}
				const capY = slotBot - (slotBot - slotTop) * (0.22 + i * 0.12);
				g += `<rect x="${r1(fx - 34)}" y="${r1(capY - 20)}" width="68" height="40" rx="10" fill="var(--${tone})"/><path d="M ${r1(fx - 22)} ${r1(capY)} H ${r1(fx + 22)}" stroke="#fff" stroke-width="${SW}" stroke-linecap="round"/>`;
				html += t(`${n}-a ${n}-no`, at(x, dy0 + 40, cw), String(i + 1).padStart(2, '0'), { nolint: true });
				html += `<span class="${n}-ic" style="${at(cx, 132)}">${iconTile(ch.icon ?? 'bot', { tone, size: 76 })}</span>`;
				html += t(`${n}-a ${n}-t`, at(x, 184, cw), fmt(ch.title), { nolint: true });
			});
			// The master section: a monitor, the name, a crossfader pushed all the way, a stereo meter fully lit.
			g += `<rect x="${mx0}" y="${dy0 + 20}" width="${mx1 - mx0}" height="${dy1 - dy0 - 40}" rx="${STYLE.radius}" fill="#fff" stroke="var(--blue)" stroke-width="${SW}"/>`;
			const mw = mx1 - mx0 - 56, mh = mw * 9 / 16, mxx = mx0 + 28, myy = dy0 + 48;
			g += `<rect x="${mxx - 8}" y="${myy - 8}" width="${mw + 16}" height="${mh + 16}" rx="16" fill="var(--ink)"/>`;
			html += img(`${n}-shot`, master.src, mxx, myy, mw, mh);
			const ty = myy + mh + 30;
			html += t(`${n}-a ${n}-mt`, at(mxx, ty), fmt(master.title ?? ''), { nolint: true });
			if (master.sub) html += t(`${n}-a ${n}-ms`, at(mxx, ty + 48), fmt(master.sub));
			const sy = ty + 136;
			g += `<rect x="${mxx}" y="${sy - 5}" width="${mw}" height="10" rx="5" fill="var(--line-strong)"/>`;
			g += `<rect x="${mxx + mw - 46}" y="${sy - 34}" width="40" height="68" rx="10" fill="var(--blue)"/><path d="M ${mxx + mw - 26} ${sy - 20} V ${sy + 20}" stroke="#fff" stroke-width="${SW}" stroke-linecap="round"/>`;
			const segW = (mw - 8 * 15) / 16;
			for (const [r, yy] of [[0, sy + 58], [1, sy + 82]]) {
				for (let k = 0; k < 16; k++) g += `<rect x="${r1(mxx + k * (segW + 8))}" y="${yy + r * 0}" width="${r1(segW)}" height="14" rx="4" fill="${k < 13 ? 'var(--green)' : k < 15 ? 'var(--orange)' : 'var(--track)'}"/>`;
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** One clapperboard per scene, a row per day, grouped by how each scene was made: each group has its count over it,
	 * and a key under the rows. Fields: eyebrow, title, rows (2): [{ label, sub, groups: [{ n, kind }] }],
	 * kinds: { [kind]: { icon, tone, label } }. */
	'cn-clap': {
		css: `${base('cn-clap')}
.cn-clap .cn-clap-day { font-size: 40px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.cn-clap .cn-clap-sub { font-size: 28px; color: var(--body); white-space: nowrap; }
.cn-clap .cn-clap-n { font-size: 44px; font-weight: 700; line-height: 1; white-space: nowrap; color: var(--fg); }
.cn-clap .cn-clap-key { position: absolute; display: flex; gap: 56px; }
.cn-clap .cn-clap-key > div { display: flex; align-items: center; gap: 14px; font-size: 27px; color: var(--ink); white-space: nowrap; }
.cn-clap .cn-clap-key .cn-clap-sw { width: 28px; height: 28px; border-radius: 8px; background: var(--tint); box-shadow: inset 0 0 0 4px var(--fg); }
`,
		render(s) {
			const n = 'cn-clap', H = bodyHeight(s);
			const kinds = s.kinds ?? {}, rows = (s.rows ?? []).slice(0, 2);
			const lx = 0, cx0 = 270, gapG = 44;
			const maxScenes = Math.max(...rows.map(r => r.groups.reduce((a, gr) => a + gr.n, 0)));
			const maxGroups = Math.max(...rows.map(r => r.groups.length));
			const pitch = (W - cx0 - (maxGroups - 1) * gapG) / maxScenes, cw = pitch - 24, ch = cw * 0.92;
			let g = '', html = '';
			const rowH = 250, rowY = [14, 14 + rowH + 30];
			rows.forEach((row, ri) => {
				const y0 = rowY[ri], by = y0 + 70;
				html += t(`${n}-a ${n}-day`, at(lx, by + 18), fmt(row.label), { nolint: true });
				if (row.sub) html += t(`${n}-a ${n}-sub`, at(lx, by + 76), fmt(row.sub), { nolint: true });
				let x = cx0, k = 0;
				row.groups.forEach((gr, gi) => {
					const kd = kinds[gr.kind] ?? {}, tone = kd.tone ?? 'blue';
					const gx0 = x;
					for (let j = 0; j < gr.n; j++, k++) {
						const bx = x, bt = by + 30;
						// Board.
						g += `<rect x="${r1(bx)}" y="${r1(bt)}" width="${r1(cw)}" height="${r1(ch)}" rx="${STYLE.radiusSmall}" fill="${mix(tone, 12)}" stroke="var(--${tone})" stroke-width="${SW}"/>`;
						g += `<rect x="${r1(bx)}" y="${r1(bt)}" width="${r1(cw)}" height="22" rx="8" fill="var(--${tone})"/>`;
						for (let q = 0; q < 4; q++) g += `<path d="M ${r1(bx + 14 + q * cw / 4)} ${r1(bt + 2)} l 14 0 l -10 18 l -14 0 Z" fill="#fff"/>`;
						// The clapper stick, open by a few degrees, hinged on the left.
						const ang = -10 - Math.abs(wob(k + ri * 10, 2)) * 14;
						let stripes = '';
						for (let q = 0; q < 4; q++) stripes += `<path d="M ${r1(14 + q * cw / 4)} -22 l 14 0 l -10 20 l -14 0 Z" fill="#fff"/>`;
						g += `<g transform="translate(${r1(bx)} ${r1(bt - 4)}) rotate(${r1(ang)})"><rect x="0" y="-24" width="${r1(cw)}" height="24" rx="8" fill="var(--${tone})"/>${stripes}</g>`;
						g += `<circle cx="${r1(bx + 8)}" cy="${r1(bt - 4)}" r="7" fill="#fff" stroke="var(--${tone})" stroke-width="3"/>`;
						html += `<span class="${n}-ic" style="${at(bx + cw / 2, bt + 22 + (ch - 22) / 2)};color:var(--${tone})">${ic(kd.icon ?? 'film', Math.round(cw * 0.36))}</span>`;
						x += pitch;
					}
					html += t(`${n}-a ${n}-n t-${tone}`, at(gx0, y0 + 2), String(gr.n), { nolint: true });
					g += `<path d="M ${r1(gx0 + 44)} ${y0 + 24} H ${r1(x - 24)}" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round" opacity=".35"/>`;
					x += gapG;
				});
			});
			const keyY = rowY[1] + rowH + 40;
			html += `<div class="${n}-key" style="${at(cx0, keyY)}">${Object.values(kinds).map(kd => `<div class="t-${kd.tone ?? 'blue'}"><span class="${n}-sw"></span><span data-t>${fmt(kd.label ?? '')}</span></div>`).join('')}</div>`;
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The day's film as a record: one ring per track (a change), the length on its label, a tone arm on the first track.
	 * Beside it, a crate of sleeves, one per drawn scene, one pulled out and heading for the record.
	 * Fields: eyebrow, title, record: { tracks, value (on the label), label (under it), caption }, crate: { count, value,
	 * label, sub, pick (index of the pulled sleeve) }. */
	'cn-record': {
		css: `${base('cn-record')}
.cn-record .cn-record-val { font-size: 64px; font-weight: 700; color: #fff; line-height: 1; white-space: nowrap; text-align: center; }
.cn-record .cn-record-day { font-size: 22px; font-weight: 600; color: #fff; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; text-align: center; }
.cn-record .cn-record-cap { font-size: 30px; font-weight: 600; color: var(--blue); white-space: nowrap; }
.cn-record .cn-record-cap b { font-size: 56px; font-weight: 700; margin-right: 12px; }
.cn-record .cn-record-big { font-size: 112px; font-weight: 700; letter-spacing: -.04em; line-height: .9; color: var(--purple); white-space: nowrap; }
.cn-record .cn-record-lab { font-size: 32px; font-weight: 600; color: var(--purple); white-space: nowrap; }
.cn-record .cn-record-sub { font-size: 26px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const n = 'cn-record', H = bodyHeight(s);
			const rec = s.record ?? {}, cr = s.crate ?? {};
			const tracks = Number(rec.tracks ?? 10);
			const cx = 330, cy = H / 2 - 6, R = 318, r0 = 112;
			let g = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${mix('blue', 10)}" stroke="var(--blue)" stroke-width="${SW}"/>`;
			const band = (R - 18 - r0 - 14) / tracks;
			for (let i = 0; i < tracks; i++) {
				const ro = R - 18 - i * band, rm = ro - band / 2;
				g += `<circle cx="${cx}" cy="${cy}" r="${r1(rm)}" fill="none" stroke="${i === 0 ? 'var(--blue)' : mix('blue', i % 2 ? 24 : 38)}" stroke-width="${r1(band - 7)}"/>`;
			}
			// A glint across the grooves.
			g += `<path d="M ${r1(cx + Math.cos(-2.2) * (r0 + 20))} ${r1(cy + Math.sin(-2.2) * (r0 + 20))} A ${r0 + 20} ${r0 + 20} 0 0 1 ${r1(cx + Math.cos(-1.5) * (r0 + 20))} ${r1(cy + Math.sin(-1.5) * (r0 + 20))}" fill="none" stroke="#fff" stroke-width="${SW}" stroke-linecap="round" opacity=".9"/>`;
			g += `<path d="M ${r1(cx + Math.cos(-2.3) * (R - 40))} ${r1(cy + Math.sin(-2.3) * (R - 40))} A ${R - 40} ${R - 40} 0 0 1 ${r1(cx + Math.cos(-1.9) * (R - 40))} ${r1(cy + Math.sin(-1.9) * (R - 40))}" fill="none" stroke="#fff" stroke-width="${SW}" stroke-linecap="round" opacity=".9"/>`;
			g += `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="var(--blue)"/>`;
			// The tone arm, resting on the first (outer) track: a base, a counterweight, a straight arm and a head.
			const pvx = cx + R + 34, pvy = cy - R + 92;
			const na = -0.34, nr = R - 18 - band / 2, nx = cx + Math.cos(na) * nr, ny = cy + Math.sin(na) * nr;
			const ex = nx + 30, ey = ny - 40;
			const ux = (pvx - ex) / Math.hypot(pvx - ex, pvy - ey), uy = (pvy - ey) / Math.hypot(pvx - ex, pvy - ey);
			g += `<circle cx="${pvx}" cy="${pvy}" r="44" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<path d="M ${r1(pvx + ux * 30)} ${r1(pvy + uy * 30)} L ${r1(ex)} ${r1(ey)} L ${r1(nx)} ${r1(ny)}" fill="none" stroke="var(--ink)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round" stroke-linejoin="round"/>`;
			g += `<rect x="${r1(pvx + ux * 30 - 15)}" y="${r1(pvy + uy * 30 - 22)}" width="30" height="44" rx="8" fill="var(--ink)" transform="rotate(${r1(Math.atan2(uy, ux) * 180 / Math.PI + 90)} ${r1(pvx + ux * 30)} ${r1(pvy + uy * 30)})"/>`;
			g += `<circle cx="${pvx}" cy="${pvy}" r="15" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<rect x="${r1(nx - 24)}" y="${r1(ny - 15)}" width="48" height="30" rx="8" fill="#fff" stroke="var(--ink)" stroke-width="${SW}" transform="rotate(${r1(Math.atan2(ny - ey, nx - ex) * 180 / Math.PI)} ${r1(nx)} ${r1(ny)})"/>`;
			let html = t(`${n}-a ${n}-val`, at(cx - r0, cy - 44, 2 * r0), fmt(rec.value ?? ''), { nolint: true }) + `<div data-on="#0078d4">${t(`${n}-a ${n}-day`, at(cx - r0, cy + 28, 2 * r0), fmt(rec.label ?? ''), { nolint: true })}</div>`;
			if (rec.caption) html += t(`${n}-a ${n}-cap`, at(pvx + 80, pvy - 50), `<b>${esc(String(tracks))}</b>${fmt(rec.caption)}`, { nolint: true });
			// The crate: one spine per drawn scene, one pulled out (its gap left in the row) and on its way to the record.
			const count = Number(cr.count ?? 28), pick = Math.min(count - 1, cr.pick ?? 17);
			const kx0 = 900, kx1 = W - 10, ky0 = H - 200, ky1 = H - 8;
			const sw = 18, sg = (kx1 - kx0 - 60 - count * sw) / (count - 1);
			for (let i = 0; i < count; i++) {
				if (i === pick) continue;
				const x = kx0 + 30 + i * (sw + sg), top = ky0 - 104 + Math.round(wob(i, 5) * 6);
				g += `<rect x="${r1(x)}" y="${r1(top)}" width="${sw}" height="${r1(ky1 - 30 - top)}" rx="5" fill="${mix('purple', 16)}" stroke="var(--purple)" stroke-width="3"/>`;
			}
			const pxp = kx0 + 30 + pick * (sw + sg) + sw / 2, psy = ky0 - 282, ps = 168;
			g += `<path d="M ${r1(pxp)} ${ky0 - 96} V ${psy + ps / 2 + 22}" stroke="var(--purple)" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`;
			g += `<g transform="rotate(-10 ${r1(pxp)} ${psy})"><circle cx="${r1(pxp)}" cy="${r1(psy - ps / 2 + 6)}" r="${ps * 0.42}" fill="#fff" stroke="var(--purple)" stroke-width="${SW}"/><circle cx="${r1(pxp)}" cy="${r1(psy - ps / 2 + 6)}" r="${ps * 0.14}" fill="${mix('purple', 30)}"/>`;
			g += `<rect x="${r1(pxp - ps / 2)}" y="${r1(psy - ps / 2)}" width="${ps}" height="${ps}" rx="${STYLE.radiusSmall}" fill="var(--purple)"/></g>`;
			g += sparkle(pxp + ps / 2 + 34, psy - ps / 2 + 10, 20, 'var(--purple)') + sparkle(pxp + ps / 2 + 64, psy - 10, 11, 'var(--purple)') + sparkle(pxp - ps / 2 - 30, psy + 40, 13, 'var(--purple)');
			html += `<span class="${n}-ic" style="${at(pxp, psy + 8)};color:#fff">${ic('drawShape', 64)}</span>`;
			const arcY = cy + 30;
			g += `<path d="M ${r1(pxp - ps / 2 - 40)} ${r1(psy + 50)} C ${r1(pxp - 340)} ${r1(psy + 150)}, ${r1(cx + R + 220)} ${r1(arcY + 40)}, ${r1(cx + R + 30)} ${r1(arcY)}" fill="none" stroke="var(--purple)" stroke-width="${SW}" stroke-dasharray="3 13" stroke-linecap="round"/>`;
			g += `<path d="M ${r1(cx + R + 52)} ${r1(arcY - 16)} L ${r1(cx + R + 30)} ${r1(arcY)} L ${r1(cx + R + 54)} ${r1(arcY + 14)}" fill="none" stroke="var(--purple)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			g += `<rect x="${kx0}" y="${ky0}" width="${kx1 - kx0}" height="${ky1 - ky0}" rx="${STYLE.radius}" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			html += t(`${n}-a ${n}-big`, at(kx0 + 44, ky0 + 46), esc(cr.value ?? String(count)), { nolint: true });
			html += t(`${n}-a ${n}-lab`, at(kx0 + 250, ky0 + 56), fmt(cr.label ?? ''));
			if (cr.sub) html += t(`${n}-a ${n}-sub`, at(kx0 + 250, ky0 + 104), fmt(cr.sub));
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A cinema wall: a lit marquee (bulbs all round) names what came out of it all, and under it the posters of the
	 * looks that came before, small and quieter, joined to the marquee by a bracket. Fields: eyebrow, title,
	 * marquee: { title, sub }, posters (3-5): [{ icon, title, tone }], bracket (a label on the bracket). */
	'cn-marquee': {
		css: `${base('cn-marquee')}
.cn-marquee .cn-marquee-t { font-size: 84px; font-weight: 700; letter-spacing: -.03em; color: var(--blue); line-height: 1; text-align: center; white-space: nowrap; }
.cn-marquee .cn-marquee-s { font-size: 30px; color: var(--body); text-align: center; white-space: nowrap; }
.cn-marquee .cn-marquee-p { font-size: 30px; font-weight: 600; color: var(--ink); text-align: center; white-space: nowrap; }
`,
		render(s) {
			const n = 'cn-marquee', H = bodyHeight(s);
			const posters = (s.posters ?? []).slice(0, 5), mq = s.marquee ?? {};
			const bw = 980, bx = (W - bw) / 2, by = 4, bh = 268;
			let g = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${STYLE.radius + 8}" fill="var(--blue)"/>`;
			g += `<rect x="${bx + 46}" y="${by + 46}" width="${bw - 92}" height="${bh - 92}" rx="${STYLE.radiusSmall}" fill="#fff"/>`;
			// Bulbs all round the board.
			const perim = [];
			const ins = 23, step = 37;
			for (let x = bx + ins; x <= bx + bw - ins + 1; x += (bw - 2 * ins) / Math.round((bw - 2 * ins) / step)) perim.push([x, by + ins], [x, by + bh - ins]);
			for (let y = by + ins + step; y < by + bh - ins - 4; y += (bh - 2 * ins) / Math.round((bh - 2 * ins) / step)) perim.push([bx + ins, y], [bx + bw - ins, y]);
			perim.forEach(([x, y], i) => {
				g += `<circle cx="${r1(x)}" cy="${r1(y)}" r="9" fill="${i % 3 === 1 ? '#fff' : 'var(--yellow)'}"/>`;
			});
			// Posters, the bracket and the stem up to the marquee.
			const pw = 276, ph = 300, py = H - ph - 4, gap = (W - posters.length * pw) / Math.max(1, posters.length - 1);
			const brY = py - 64, midX = W / 2;
			g += `<path d="M ${pw / 2} ${brY + 30} V ${brY} H ${W - pw / 2} V ${brY + 30}" fill="none" stroke="var(--connector)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			g += `<path d="M ${midX} ${brY} V ${by + bh + 18}" stroke="var(--connector)" stroke-width="${SW}" stroke-linecap="round"/><path d="M ${midX - 16} ${by + bh + 34} L ${midX} ${by + bh + 14} L ${midX + 16} ${by + bh + 34}" fill="none" stroke="var(--connector)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			let html = t(`${n}-a ${n}-t`, at(bx, by + 66, bw), fmt(mq.title ?? ''), { nolint: true });
			if (mq.sub) html += `<div data-on="#ffffff">${t(`${n}-a ${n}-s`, at(bx, by + 166, bw), fmt(mq.sub))}</div>`;
			posters.forEach((p, i) => {
				const x = i * (pw + gap), tone = s.muted === false ? p.tone ?? 'blue' : 'neutral';
				g += `<path d="M ${r1(x + pw / 2)} ${brY} V ${py - 22}" stroke="var(--connector)" stroke-width="${SW}" stroke-linecap="round"/><circle cx="${r1(x + pw / 2)}" cy="${py - 14}" r="7" fill="var(--connector)"/>`;
				g += `<rect x="${r1(x)}" y="${py}" width="${pw}" height="${ph}" rx="${STYLE.radius}" fill="#fff" stroke="var(--line-strong)" stroke-width="${SW}"/>`;
				g += `<rect x="${r1(x + 18)}" y="${py + 18}" width="${pw - 36}" height="${ph - 106}" rx="${STYLE.radiusSmall}" fill="${mix(tone, 8)}"/>`;
				// A different simple art on each poster, drawn in its tone.
				const ax = x + pw / 2, ay = py + 18 + (ph - 106) / 2;
				const art = [
					`<rect x="${r1(ax - 60)}" y="${r1(ay - 40)}" width="120" height="80" rx="10" fill="none" stroke="var(--${tone})" stroke-width="${SW}"/>`,
					`<path d="M ${r1(ax - 70)} ${r1(ay + 30)} L ${r1(ax - 20)} ${r1(ay - 30)} L ${r1(ax + 10)} ${r1(ay + 10)} L ${r1(ax + 70)} ${r1(ay - 50)}" fill="none" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 12"/>`,
					`<path d="M ${r1(ax - 80)} ${r1(ay + 40)} Q ${r1(ax)} ${r1(ay - 80)} ${r1(ax + 80)} ${r1(ay + 40)}" fill="none" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round" stroke-dasharray="14 10"/>`,
					`<circle cx="${r1(ax - 8)}" cy="${r1(ay - 8)}" r="44" fill="#fff" stroke="var(--${tone})" stroke-width="${SW}"/><path d="M ${r1(ax + 24)} ${r1(ay + 24)} L ${r1(ax + 60)} ${r1(ay + 60)}" stroke="var(--${tone})" stroke-width="${STYLE.strokeBold + 4}" stroke-linecap="round"/>`,
					`<path d="M ${r1(ax - 80)} ${r1(ay)} H ${r1(ax + 80)}" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round"/><circle cx="${r1(ax + 50)}" cy="${r1(ay)}" r="12" fill="var(--${tone})"/>`,
				][i % 5];
				g += art;
				html += `<span class="${n}-ic" style="${at(ax, ay)};color:var(--${tone})">${i === 3 ? '' : ic(p.icon ?? 'film', 52)}</span>`;
				html += t(`${n}-a ${n}-p`, at(x, py + ph - 72, pw) + ';color:var(--body)', fmt(p.title), { nolint: true });
			});
			if (s.bracket) html += t(`lbl ${n}-a`, at(midX + 24, brY + 14), fmt(s.bracket), { nolint: true });
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The agent's projector locked in a vault (thick riveted walls, a round door with a wheel). Outside on the left, two
	 * cables cut (each with a red cross and what it would have reached); on the inner wall, an allowlist; on the right,
	 * one slot lets the film out to whoever posts it. Fields: eyebrow, title, label (over the vault), inside (under the
	 * projector), cut (2): [{ icon, title }], allow (the list's name), out: { icon, title, sub }, film (on the way out). */
	'cn-vault': {
		css: `${base('cn-vault')}
.cn-vault .cn-vault-cut { font-size: 30px; font-weight: 600; color: var(--red); white-space: nowrap; }
.cn-vault .cn-vault-in { font-size: 26px; font-weight: 600; color: var(--purple); white-space: nowrap; text-align: center; }
.cn-vault .cn-vault-al { font-size: 22px; font-weight: 600; color: var(--green); white-space: nowrap; text-align: center; }
.cn-vault .cn-vault-ot { font-size: 30px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.cn-vault .cn-vault-os { font-size: 25px; color: var(--body); white-space: nowrap; font-family: var(--mono); }
.cn-vault .cn-vault-film { font-size: 22px; font-weight: 600; color: var(--green); white-space: nowrap; }
`,
		render(s) {
			const n = 'cn-vault', H = bodyHeight(s);
			const vx0 = 470, vx1 = 1220, vy0 = 54, vy1 = H - 10, wall = 46;
			let g = `<rect x="${vx0}" y="${vy0}" width="${vx1 - vx0}" height="${vy1 - vy0}" rx="44" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<rect x="${vx0 + wall}" y="${vy0 + wall}" width="${vx1 - vx0 - 2 * wall}" height="${vy1 - vy0 - 2 * wall}" rx="${STYLE.radius}" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			for (let x = vx0 + 50; x < vx1 - 30; x += 54) g += `<circle cx="${x}" cy="${vy0 + wall / 2}" r="5" fill="var(--faint)"/><circle cx="${x}" cy="${vy1 - wall / 2}" r="5" fill="var(--faint)"/>`;
			for (let y = vy0 + 80; y < vy1 - 50; y += 54) g += `<circle cx="${vx0 + wall / 2}" cy="${y}" r="5" fill="var(--faint)"/>`;
			// The round door on the right wall, with a wheel.
			const dx = vx1 - wall / 2, dy = vy0 + 168, dr = 98;
			g += `<circle cx="${dx}" cy="${dy}" r="${dr}" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}"/><circle cx="${dx}" cy="${dy}" r="${dr - 24}" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
			for (let i = 0; i < 12; i++) {
				const a = i * Math.PI / 6;
				g += `<circle cx="${r1(dx + Math.cos(a) * (dr - 12))}" cy="${r1(dy + Math.sin(a) * (dr - 12))}" r="4.5" fill="var(--ink)"/>`;
			}
			g += `<circle cx="${dx}" cy="${dy}" r="44" fill="none" stroke="var(--ink)" stroke-width="${STYLE.strokeBold}"/>`;
			for (let i = 0; i < 3; i++) {
				const a = i * Math.PI / 3 + 0.3;
				g += `<path d="M ${r1(dx - Math.cos(a) * 56)} ${r1(dy - Math.sin(a) * 56)} L ${r1(dx + Math.cos(a) * 56)} ${r1(dy + Math.sin(a) * 56)}" stroke="var(--ink)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round"/>`;
			}
			g += `<circle cx="${dx}" cy="${dy}" r="14" fill="var(--ink)"/>`;
			// Inside: the projector, the allowlist on the wall.
			const pr = filmProjector({ x: 730, y: 470, k: 1.08, level: 2 });
			g += pr.svg;
			const ax = 1010, ay = 352, aw = 124, ah = 168;
			g += `<rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" rx="14" fill="${mix('green', 10)}" stroke="var(--green)" stroke-width="${SW}"/><rect x="${ax + aw / 2 - 26}" y="${ay - 12}" width="52" height="24" rx="8" fill="var(--green)"/>`;
			for (let i = 0; i < 4; i++) {
				const yy = ay + 40 + i * 32;
				g += `<path d="M ${ax + 18} ${yy} l 8 8 l 14 -16" fill="none" stroke="var(--green)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/><path d="M ${ax + 54} ${yy} H ${ax + aw - 20}" stroke="${mix('green', 45)}" stroke-width="${SW + 2}" stroke-linecap="round"/>`;
			}
			// Outside on the left: two cut cables.
			const cuts = (s.cut ?? []).slice(0, 2);
			let html = '';
			cuts.forEach((c, i) => {
				const y = [210, 500][i], ex = 110;
				g += `<path d="M ${vx0} ${y} H ${vx0 - 110}" stroke="var(--body)" stroke-width="${STYLE.strokeBold + 2}" stroke-linecap="round"/><path d="M ${vx0 - 196} ${y} H ${ex + 60}" stroke="var(--body)" stroke-width="${STYLE.strokeBold + 2}" stroke-linecap="round"/>`;
				g += `<path d="M ${vx0 - 110} ${y - 14} v 28 M ${vx0 - 196} ${y - 14} v 28" stroke="var(--body)" stroke-width="${SW}" stroke-linecap="round"/>`;
				const xx = vx0 - 153;
				g += `<circle cx="${xx}" cy="${y}" r="26" fill="var(--red)"/><path d="M ${xx - 10} ${y - 10} L ${xx + 10} ${y + 10} M ${xx + 10} ${y - 10} L ${xx - 10} ${y + 10}" stroke="#fff" stroke-width="${SW}" stroke-linecap="round"/>`;
				html += `<span class="${n}-ic" style="${at(ex, y)}">${iconTile(c.icon ?? 'globe', { tone: 'neutral', size: 104, round: true })}</span>`;
				html += t(`${n}-a ${n}-cut`, at(0, y + 66, 300), fmt(c.title));
			});
			// The slot on the right: the film goes out to the bot.
			const sy = vy1 - 150, ox = 1560;
			g += `<rect x="${vx1 - 14}" y="${sy - 30}" width="28" height="60" rx="8" fill="var(--ink)"/>`;
			g += `<path d="M ${vx1 + 30} ${sy} H ${ox - 82}" stroke="var(--green)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round"/><path d="M ${ox - 104} ${sy - 18} L ${ox - 82} ${sy} L ${ox - 104} ${sy + 18}" fill="none" stroke="var(--green)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round" stroke-linejoin="round"/>`;
			g += `<rect x="${vx1 + 70}" y="${sy - 34}" width="96" height="68" rx="12" fill="${mix('green', 12)}" stroke="var(--green)" stroke-width="${SW}"/>`;
			html += `<span class="${n}-ic" style="${at(vx1 + 118, sy)};color:var(--green)">${ic('videoClip', 38)}</span>`;
			if (s.film) html += t(`${n}-a ${n}-film`, at(vx1 + 60, sy + 48), fmt(s.film), { nolint: true });
			const out = s.out ?? {};
			html += `<span class="${n}-ic" style="${at(ox, sy)}">${iconTile(out.icon ?? 'bot', { tone: 'blue', size: 120, round: true })}</span>`;
			html += t(`${n}-a ${n}-ot`, at(ox - 120, sy + 82, 290), fmt(out.title ?? ''), { nolint: true });
			if (out.sub) html += t(`${n}-a ${n}-os`, at(ox - 120, sy + 126, 290), fmt(out.sub), { nolint: true });
			if (s.label) html += t(`lbl ${n}-a`, at(vx0 + 4, vy0 - 40), fmt(s.label), { nolint: true });
			if (s.inside) html += t(`${n}-a ${n}-in`, at(pr.at(0, 0)[0] - 200, 584, 400), fmt(s.inside), { nolint: true });
			if (s.allow) html += t(`${n}-a ${n}-al`, at(ax - 20, ay + ah + 14, aw + 40), fmt(s.allow), { nolint: true });
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The soundtrack twice: the delivered one and the one rebuilt from the repo, as two identical waveforms on one time
	 * axis, with match ticks between them and a rubber stamp. Fields: eyebrow, title, lanes (2): [{ title, sub, tone }],
	 * stamp: { top, text }, axis: [start, end], note (one quiet line under the stamp). */
	'cn-wave': {
		css: `${base('cn-wave')}
.cn-wave .cn-wave-t { font-size: 36px; font-weight: 700; white-space: nowrap; color: var(--fg); }
.cn-wave .cn-wave-s { font-size: 26px; color: var(--body); white-space: nowrap; margin-top: 6px; }
.cn-wave .cn-wave-stamp { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-12deg); color: var(--green); }
.cn-wave .cn-wave-st { font-size: 24px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; white-space: nowrap; }
.cn-wave .cn-wave-sx { margin-top: 4px; font-size: 48px; font-weight: 700; letter-spacing: -.01em; line-height: 1.1; white-space: nowrap; }
.cn-wave .cn-wave-ax { font-size: 20px; font-weight: 600; color: var(--muted); white-space: nowrap; }
.cn-wave .cn-wave-note { font-size: 25px; color: var(--muted); white-space: nowrap; text-align: center; }
`,
		render(s) {
			const n = 'cn-wave', H = bodyHeight(s);
			const lanes = (s.lanes ?? []).slice(0, 2);
			const wx0 = 330, wx1 = 1330, bars = 84, pitch = (wx1 - wx0) / (bars - 1);
			const ys = [150, 470], amp = 116;
			const level = i => {
				const beat = Math.abs(Math.sin(i * 0.52)) ** 2;
				const env = Math.min(1, i / 7) * Math.min(1, (bars - 1 - i) / 9);
				return Math.max(0.08, env * (0.25 + 0.55 * beat + 0.2 * Math.abs(wob(i, 4))));
			};
			let g = '', html = '';
			lanes.forEach((ln, li) => {
				const tone = ln.tone ?? 'blue', yc = ys[li];
				g += `<rect x="${wx0 - 30}" y="${yc - amp - 22}" width="${wx1 - wx0 + 60}" height="${2 * amp + 44}" rx="${STYLE.radius}" fill="${mix(tone, 7)}"/>`;
				for (let i = 0; i < bars; i++) {
					const h = level(i) * amp, x = wx0 + i * pitch;
					g += `<path d="M ${r1(x)} ${r1(yc - h)} V ${r1(yc + h)}" stroke="var(--${tone})" stroke-width="7" stroke-linecap="round"/>`;
				}
				html += `<div class="${n}-a t-${tone}" style="${at(0, yc - 50, 290)}">${t(`${n}-t`, '', fmt(ln.title), { nolint: true })}${ln.sub ? t(`${n}-s`, '', fmt(ln.sub), { nolint: true }) : ''}</div>`;
			});
			// Match ticks between the two waveforms, at the loudest bars.
			const peaks = [...Array(bars).keys()].filter(i => i > 2 && i < bars - 3 && level(i) > level(i - 1) && level(i) >= level(i + 1) && level(i) > 0.55).filter((_, k) => k % 2 === 0).slice(0, 7);
			for (const i of peaks) {
				const x = wx0 + i * pitch, ya = ys[0] + level(i) * amp + 10, yb = ys[1] - level(i) * amp - 10;
				g += `<path d="M ${r1(x)} ${r1(ya)} V ${r1(yb)}" stroke="var(--green)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
				g += `<circle cx="${r1(x)}" cy="${r1((ys[0] + ys[1]) / 2)}" r="17" fill="#fff" stroke="var(--green)" stroke-width="${SW}"/><path d="M ${r1(x - 7)} ${r1((ys[0] + ys[1]) / 2)} l 5 5 l 9 -10" fill="none" stroke="var(--green)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			}
			// Time axis.
			const axY = ys[1] + amp + 54;
			g += `<path d="M ${wx0} ${axY} H ${wx1}" stroke="var(--line-strong)" stroke-width="${SW}" stroke-linecap="round"/>`;
			for (let k = 0; k <= 10; k++) g += `<path d="M ${r1(wx0 + k * (wx1 - wx0) / 10)} ${axY - 8} V ${axY + 8}" stroke="var(--line-strong)" stroke-width="3" stroke-linecap="round"/>`;
			const [a0, a1] = s.axis ?? [];
			if (a0) html += t(`${n}-a ${n}-ax`, at(wx0 - 12, axY + 18), fmt(a0), { nolint: true });
			if (a1) html += `<div class="${n}-a" style="${at(wx1 - 200, axY + 18, 214)};text-align:right">${t(`${n}-ax`, '', fmt(a1), { nolint: true })}</div>`;
			// The stamp.
			const st = s.stamp ?? {}, scx = 1560, scy = (ys[0] + ys[1]) / 2, sr = 160;
			g += `<g transform="rotate(-12 ${scx} ${scy})"><circle cx="${scx}" cy="${scy}" r="${sr}" fill="${mix('green', 8)}" stroke="var(--green)" stroke-width="${STYLE.strokeBold}"/><circle cx="${scx}" cy="${scy}" r="${sr - 16}" fill="none" stroke="var(--green)" stroke-width="3"/></g>`;
			html += `<div class="${n}-stamp" style="${at(scx - sr, scy - sr, 2 * sr, 2 * sr)}">${t('', 'text-align:center', `${st.top ? `<div class="${n}-st">${fmt(st.top)}</div>` : ''}<div class="${n}-sx">${fmt(st.text ?? '')}</div>`, { nolint: true })}</div>`;
			if (s.note) html += t(`${n}-a ${n}-note`, at(scx - 200, scy + sr + 40, 400), fmt(s.note));
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A close for a blue page, one chain from left to right: a wall switch that is still off (its name on the plate, a
	 * tag on a string from the lever), a cable from the switch into the back of the agent's projector, the projector's
	 * beam (only dotted: it isn't lit yet), and the channel the films go to, a card per day waiting and a ghosted next one.
	 * Fields: eyebrow, title, plate (the switch's name), plateSub (on the plate, under the switch), hang: { title, sub }
	 * (the tag), screen: { title, days: [...], next } (the channel, a card per day, the ghosted card's label), caption
	 * (under the channel). */
	'cn-switch': {
		css: `${base('cn-switch')}
.cn-switch .cn-switch-plate { font-family: var(--mono); font-size: 25px; font-weight: 700; color: var(--ink); white-space: nowrap; text-align: center; }
.cn-switch .cn-switch-ps { font-size: 22px; font-weight: 600; color: var(--orange); white-space: nowrap; text-align: center; }
.cn-switch .cn-switch-tag { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cn-switch .cn-switch-tt { font-size: 28px; font-weight: 700; color: var(--orange); white-space: nowrap; line-height: 1.1; }
.cn-switch .cn-switch-ts { font-size: 23px; color: var(--ink); white-space: nowrap; margin-top: 4px; }
.cn-switch .cn-switch-ch { font-family: var(--mono); font-size: 27px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.cn-switch .cn-switch-day { font-size: 17px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--body); white-space: nowrap; text-align: center; }
.cn-switch .cn-switch-day.next { color: var(--muted); }
.cn-switch .cn-switch-cap { font-size: 27px; color: #fff; white-space: nowrap; display: flex; align-items: center; gap: 12px; }
`,
		render(s) {
			const n = 'cn-switch', H = bodyHeight(s);
			let g = '', html = '';
			// The switch plate: its name on top, the lever down (off), a dashed outline where it goes (on).
			const px = 12, py = 62, pw = 300, ph = 420, lx = px + pw / 2;
			const hy0 = py + 92, hy1 = py + ph - 76, lvH = (hy1 - hy0) / 2 - 16;
			const lvTop = hy1 - 12 - lvH;
			// The cable: out of the plate's side, a soft sag, into a plug at the back of the projector.
			const pr = filmProjector({ x: 748, y: 444, k: 1.12, level: 2, fill: '#fff', plinth: mix('purple', 70) });
			const sock = pr.at(-134, 22), out = [px + pw, py + ph * 0.56];
			const plugL = sock[0] - 58;
			g += `<path d="M ${out[0] - 10} ${r1(out[1])} C ${out[0] + 150} ${r1(out[1])}, ${r1(plugL - 150)} ${r1(sock[1])}, ${r1(plugL)} ${r1(sock[1])}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`;
			g += `<path d="M ${r1(plugL + 40)} ${r1(sock[1] - 10)} H ${r1(sock[0] + 14)} M ${r1(plugL + 40)} ${r1(sock[1] + 10)} H ${r1(sock[0] + 14)}" stroke="var(--faint)" stroke-width="${SW}" stroke-linecap="round"/>`;
			g += `<rect x="${r1(plugL - 4)}" y="${r1(sock[1] - 24)}" width="46" height="48" rx="12" fill="#fff"/>`;
			g += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="36" fill="#fff"/>`;
			g += `<circle cx="${out[0] - 2}" cy="${r1(out[1])}" r="14" fill="#fff" stroke="var(--faint)" stroke-width="${SW}"/>`;
			g += `<rect x="${lx - 66}" y="${hy0}" width="132" height="${hy1 - hy0}" rx="22" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}"/>`;
			g += `<rect x="${lx - 44}" y="${hy0 + 12}" width="88" height="${lvH}" rx="16" fill="none" stroke="var(--orange)" stroke-width="3" stroke-dasharray="8 8"/>`;
			g += `<path d="M ${lx - 16} ${r1(hy0 + 12 + lvH / 2 + 8)} L ${lx} ${r1(hy0 + 12 + lvH / 2 - 8)} L ${lx + 16} ${r1(hy0 + 12 + lvH / 2 + 8)}" fill="none" stroke="var(--orange)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			g += `<rect x="${lx - 44}" y="${lvTop}" width="88" height="${lvH}" rx="16" fill="var(--orange)"/><path d="M ${lx - 22} ${lvTop + 24} H ${lx + 22}" stroke="#fff" stroke-width="${SW}" stroke-linecap="round"/>`;
			if (s.plate) html += `<div data-on="#ffffff">${t(`${n}-a ${n}-plate`, at(px, py + 34, pw), fmt(s.plate), { nolint: true })}</div>`;
			if (s.plateSub) html += `<div data-on="#ffffff">${t(`${n}-a ${n}-ps`, at(px, hy1 + 22, pw), fmt(s.plateSub), { nolint: true })}</div>`;
			// The tag, on a string from the lever, hanging below the plate.
			const tg = s.hang ?? {}, tw = 236, th = 116, tcx = lx + 34, ty = py + ph + 52;
			const knot = [lx + 30, lvTop + lvH - 14];
			g += `<circle cx="${knot[0]}" cy="${knot[1]}" r="6" fill="#fff" stroke="var(--ink)" stroke-width="3"/>`;
			g += `<path d="M ${knot[0]} ${knot[1]} C ${knot[0] + 44} ${knot[1] + 50}, ${tcx + 16} ${ty - 70}, ${tcx} ${ty + 18}" fill="none" stroke="var(--ink)" stroke-width="3"/>`;
			g += `<path d="M ${tcx - tw / 2} ${ty + 34} L ${tcx - tw / 2 + 34} ${ty} H ${tcx + tw / 2 - 34} L ${tcx + tw / 2} ${ty + 34} V ${ty + th - 16} Q ${tcx + tw / 2} ${ty + th} ${tcx + tw / 2 - 16} ${ty + th} H ${tcx - tw / 2 + 16} Q ${tcx - tw / 2} ${ty + th} ${tcx - tw / 2} ${ty + th - 16} Z" fill="#fff" stroke="var(--orange)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += `<circle cx="${tcx}" cy="${ty + 18}" r="7" fill="var(--blue)" stroke="var(--orange)" stroke-width="3"/>`;
			html += `<div class="${n}-a ${n}-tag" data-on="#ffffff" data-shape style="${at(tcx - tw / 2, ty + 30, tw, th - 36)}">${t(`${n}-tt`, '', fmt(tg.title ?? ''), { nolint: true })}${tg.sub ? t(`${n}-ts`, '', fmt(tg.sub), { nolint: true }) : ''}</div>`;
			// The channel: a header, a card per day, the next one ghosted.
			const scr = s.screen ?? {}, days = scr.days ?? [];
			const cx0 = 1060, cx1 = W, cy0 = 70, pad = 30, hdr = 82, gap = 22;
			const cols = 3, cw = (cx1 - cx0 - 2 * pad - (cols - 1) * gap) / cols, thh = cw * 9 / 16, cellH = thh + 46;
			const cells = [...days.map(d => ({ d })), ...(scr.next ? [{ d: scr.next, ghost: true }] : [])];
			const rows = Math.ceil(cells.length / cols), cy1 = cy0 + hdr + pad + rows * cellH + (rows - 1) * gap + pad - 10;
			// The beam, not lit yet: a dotted outline from the lens to the channel.
			const b = beam(`${n}-beam`, pr.lens, cx0, cy0 + 30, 1, cy1 - cy0 - 60, { dashed: true, color: '#fff' });
			g += `<path d="${hull([pr.lens, [cx0, cy0 + 30], [cx0, cy1 - 30]])}" fill="#fff" opacity=".14"/>` + b.svg;
			g += pr.svg;
			g += `<rect x="${cx0}" y="${cy0}" width="${cx1 - cx0}" height="${r1(cy1 - cy0)}" rx="${STYLE.radius}" fill="#fff"/>`;
			g += `<path d="M ${cx0} ${cy0 + hdr} H ${cx1}" stroke="var(--line)" stroke-width="${SW}"/>`;
			cells.forEach((c, i) => {
				const x = cx0 + pad + (i % cols) * (cw + gap), y = cy0 + hdr + pad + Math.floor(i / cols) * (cellH + gap);
				const mx = x + cw / 2, my = y + thh / 2;
				if (c.ghost) {
					g += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(cw)}" height="${r1(thh)}" rx="${STYLE.radiusSmall}" fill="none" stroke="var(--connector)" stroke-width="3" stroke-dasharray="9 9"/>`;
					g += `<path d="M ${r1(mx - 14)} ${r1(my)} H ${r1(mx + 14)} M ${r1(mx)} ${r1(my - 14)} V ${r1(my + 14)}" stroke="var(--connector)" stroke-width="${SW}" stroke-linecap="round"/>`;
				} else {
					g += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(cw)}" height="${r1(thh)}" rx="${STYLE.radiusSmall}" fill="${mix('blue', 12)}" stroke="var(--blue)" stroke-width="3"/>`;
					g += `<circle cx="${r1(mx)}" cy="${r1(my)}" r="24" fill="#fff"/><path d="M ${r1(mx - 7)} ${r1(my - 11)} L ${r1(mx + 11)} ${r1(my)} L ${r1(mx - 7)} ${r1(my + 11)} Z" fill="var(--blue)"/>`;
				}
				html += `<div data-on="#ffffff">${t(`${n}-a ${n}-day${c.ghost ? ' next' : ''}`, at(x, y + thh + 12, cw), fmt(c.d), { nolint: true })}</div>`;
			});
			html += `<div data-on="#ffffff">${t(`${n}-a ${n}-ch`, at(cx0 + pad, cy0 + 24), fmt(scr.title ?? ''), { nolint: true })}</div>`;
			if (s.caption) html += `<div class="${n}-a ${n}-cap" style="${at(cx0, cy1 + 26)}">${ic('bot', 32)}${t('', '', fmt(s.caption), { tag: 'span' })}</div>`;
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
};
