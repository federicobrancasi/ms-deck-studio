// A gallery for inspiration (the railway world): read it for technique: real track drawn from route geometry (ballast,
// sleepers square to the curve, rails crossing at the points), one helper that assembles every train from detailed
// cars, and a recurring signal box with a person at the lever. A new deck draws its own pictures in
// designs/local-<deck>.mjs; do not reuse these as they are.
// World: a railway, drawn as a toy-railway diorama seen from a little above. Trains stand on the near rail in side
// view. Dispatch is a signal box beside the line with a signaller at the lever frame: the recurring object, always
// drawn by grwBox(). Every train comes from grwTrain(): an electric locomotive, an express power car, a coach, a local
// unit car and the load's goods van. Liveries: blue for the earlier steps, purple for the latest. Labels sit
// on boards, plates and signs. No shadows, blur or filters: flat fills, a 2 px ink outline.
//
//   grw-cover:   the hero: one signal box at a junction, three lines branch to three services
//   grw-line:    three steps as three stations along one line, each with its signal box and its question (clicks)
//   grw-points:  one lever, one pair of points, two depots of locomotives you can count
//   grw-coin:    the signaller tosses a coin; a station notice board carries two more findings
//   grw-match:   the load's van shows its four needs; the cheapest locomotive that covers them is coupled (clicks)
//   grw-fares:   two ticket windows with a tray of 100 coins each; a departure board with live results
//   grw-buffers: a quote; at night the only line ends at buffer stops, routes beyond marked out (dark page)
//   grw-routes:  one network, three services: an express, a local that hands over, an inspection stop (clicks)
//   grw-map:     a cost-quality map; one line of track ends at buffers, stations sit past it
//   grw-next:    the close (blue page): a finished station, and the works for the next one
import { W, esc, fmt, ic, pill, heading, body, bodyHeight, msLogo, logo, t, at, layer, mix, r1 } from '../src/kit.mjs';

// ---------- palette ----------
const INK = '#2b2f36', STEEL = '#59606a', IRON = '#3a3f47', DARK = '#30343a', SKIN = '#f1c8a4', HAIR = '#5a4535';
const CREAM = '#f6f0e4', BRICK = '#e3c9b4', MORTAR = '#cfae97', SLATE = '#4a5059', GLASS = '#e3ecf5', GLASS_N = '#f3d98f';
const PAL = {
	day: { ballast: '#e6e0d4', edge: '#d3cbbc', stone: '#c3baa9', sleeper: '#8f7a66', sleeperEdge: '#705e4d', rail: '#5d636c', top: '#c9ced5' },
	night: { ballast: '#3d4046', edge: '#33363b', stone: '#52565d', sleeper: '#5e5147', sleeperEdge: '#4b4139', rail: '#8b919a', top: '#d5d9df' },
	blue: { ballast: '#3d8fdc', edge: '#2f86d8', stone: '#6aa9e6', sleeper: '#a9cdf0', sleeperEdge: '#8bbbe9', rail: '#ffffff', top: '#ffffff' },
};
const G = 8; // half the track gauge, in px: the rails sit at ±G from the line's centre
const RAIL_Y = G - 2; // trains stand on the near rail: their wheels touch y + RAIL_Y

let uid = 0;
const nid = p => `${p}-${++uid}`;
const P = (d, stroke, w, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const R = (x, y, w, h, fill, extra = '') => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}"${extra}/>`;
const C = (cx, cy, r, fill, extra = '') => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${fill}"${extra}/>`;
const sk = (w = 2) => ` stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
const grp = (x, y, k, inner) => `<g transform="translate(${r1(x)} ${r1(y)}) scale(${k})">${inner}</g>`;

// ---------- track geometry ----------
/** A route as segments: [['M', x, y], ['L', x, y], ['C', x1, y1, x2, y2, x, y]]. Returns the SVG path and points
 * every `step` px along it, each with its unit tangent. */
function route(segs, step = 3) {
	const raw = [];
	let cx = 0, cy = 0;
	for (const s of segs) {
		if (s[0] === 'M') {
			cx = s[1]; cy = s[2]; raw.push([cx, cy]);
		} else if (s[0] === 'L') {
			const n = Math.max(1, Math.ceil(Math.hypot(s[1] - cx, s[2] - cy) / 2));
			for (let i = 1; i <= n; i++) raw.push([cx + ((s[1] - cx) * i) / n, cy + ((s[2] - cy) * i) / n]);
			cx = s[1]; cy = s[2];
		} else {
			const [, x1, y1, x2, y2, x, y] = s;
			for (let i = 1; i <= 120; i++) {
				const tt = i / 120, u = 1 - tt;
				raw.push([u * u * u * cx + 3 * u * u * tt * x1 + 3 * u * tt * tt * x2 + tt * tt * tt * x, u * u * u * cy + 3 * u * u * tt * y1 + 3 * u * tt * tt * y2 + tt * tt * tt * y]);
			}
			cx = x; cy = y;
		}
	}
	const pts = [];
	let acc = 0, next = 0;
	for (let i = 0; i < raw.length; i++) {
		if (i) acc += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]);
		if (acc >= next || i === raw.length - 1) {
			const a = raw[Math.max(0, i - 1)], b = raw[Math.min(raw.length - 1, i + 1)];
			const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
			pts.push({ x: raw[i][0], y: raw[i][1], tx: (b[0] - a[0]) / L, ty: (b[1] - a[1]) / L, s: acc });
			next += step;
		}
	}
	const d = segs.map(s => `${s[0]} ${s.slice(1).map(r1).join(' ')}`).join(' ');
	return { segs, d, pts, len: acc };
}
const off = (pts, o) => `M ${pts.map(p => `${r1(p.x - p.ty * o)} ${r1(p.y + p.tx * o)}`).join(' L ')}`;

/** Track for several routes at once (so points look right): ballast with stones, sleepers square to the line, then the
 * rails of every route on top, so at a fork the rails cross at the frog. Routes: route() results, or { r, op, bare }
 * (bare: ballast and sleepers only, a line not yet laid). pal: 'day' | 'night' | 'blue'. */
function track(routes, pal = 'day') {
	const c = PAL[pal];
	const list = routes.map(x => (x.pts ? { r: x } : x));
	const pid = `grw-ballast-${pal}`;
	let g = `<defs><pattern id="${pid}" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${c.ballast}"/>`
		+ `<circle cx="3" cy="4" r="1.6" fill="${c.stone}"/><circle cx="10" cy="2.5" r="1.2" fill="${c.stone}"/><circle cx="8" cy="10" r="1.7" fill="${c.stone}"/><circle cx="1.5" cy="11.5" r="1.1" fill="${c.edge}"/></pattern></defs>`;
	for (const { r, op } of list) {
		const o = op != null ? ` opacity="${op}"` : '';
		g += `<path d="${r.d}" fill="none" stroke="${c.edge}" stroke-width="54"${o}/><path d="${r.d}" fill="none" stroke="url(#${pid})" stroke-width="48"${o}/>`;
	}
	const placed = [];
	for (const { r, op, bare } of list) {
		if (bare === 'bed') continue;
		const o = op != null ? ` opacity="${op}"` : '';
		for (let s = 6; s < r.len - 3; s += 15) {
			const p = r.pts[Math.min(r.pts.length - 1, Math.round(s / 3))];
			if (placed.some(q => Math.hypot(q[0] - p.x, q[1] - p.y) < 12)) continue;
			placed.push([p.x, p.y]);
			const nx = -p.ty, ny = p.tx, L = 18;
			g += `<path d="M ${r1(p.x - nx * L)} ${r1(p.y - ny * L)} L ${r1(p.x + nx * L)} ${r1(p.y + ny * L)}" stroke="${c.sleeper}" stroke-width="7"${o}/>`;
			g += `<path d="M ${r1(p.x - nx * L + p.tx * 3)} ${r1(p.y - ny * L + p.ty * 3)} L ${r1(p.x + nx * L + p.tx * 3)} ${r1(p.y + ny * L + p.ty * 3)}" stroke="${c.sleeperEdge}" stroke-width="1.6"${o}/>`;
		}
	}
	for (const { r, op, bare } of list) {
		if (bare) continue;
		const o = op != null ? ` opacity="${op}"` : '';
		for (const side of [-G, G]) {
			const d = off(r.pts, side);
			g += `<path d="${d}" fill="none" stroke="${c.rail}" stroke-width="4.5" stroke-linejoin="round"${o}/><path d="${d}" fill="none" stroke="${c.top}" stroke-width="1.5" stroke-linejoin="round"${o}/>`;
		}
	}
	return g;
}

/** Point rodding: from the signal box along the ground (y) to the points at toeX, on roller stools, with a crank and a
 * stretcher bar across the rails at the toe (track centre ty). */
function rodding(x0, toeX, y, ty) {
	let g = P(`M ${r1(x0)} ${r1(y)} H ${r1(toeX - 14)}`, '#6b7079', 3);
	for (let x = x0 + 18; x < toeX - 20; x += 34) g += R(x - 3, y - 1, 6, 7, '#8a9099');
	g += P(`M ${r1(toeX - 14)} ${r1(y)} L ${r1(toeX)} ${r1(ty - G - 4)}`, '#6b7079', 3);
	g += R(toeX - 20, y - 6, 12, 12, '#7d848d', sk(1.2));
	g += R(toeX - 2, ty - G - 3, 5, 2 * G + 6, IRON);
	return g;
}

// ---------- the train ----------
/** One wheel: tyre, web and hub. spokes: an old wagon's spoked wheel. */
function wheel(cx, cy, r, spokes = false) {
	let g = C(cx, cy, r, DARK) + C(cx, cy, r - 2.4, '#626872');
	if (spokes) {
		for (let i = 0; i < 6; i++) {
			const a = (i * Math.PI) / 3;
			g += P(`M ${r1(cx)} ${r1(cy)} L ${r1(cx + Math.cos(a) * (r - 2.6))} ${r1(cy + Math.sin(a) * (r - 2.6))}`, DARK, 1.6);
		}
	} else {
		g += C(cx, cy, r - 4.6, '#454b53');
	}
	return g + C(cx, cy, 2.4, '#b4bac2');
}

/** A two-axle bogie centred on cx: side frame, coil springs, axle boxes, brake blocks, two wheels. */
function bogie(cx) {
	const r = 10, s = 19;
	let g = '';
	for (const dx of [-s, s]) g += wheel(cx + dx, -r, r);
	g += `<path d="M ${cx - 36} -22 H ${cx + 36} Q ${cx + 40} -22 ${cx + 38} -16 L ${cx + 30} -11 H ${cx - 30} L ${cx - 38} -16 Q ${cx - 40} -22 ${cx - 36} -22 Z" fill="${IRON}"/>`;
	for (const dx of [-s, s]) g += R(cx + dx - 5, -21, 10, 8, '#6a717b', ' rx="1.5"');
	g += P(`M ${cx - 8} -23 l 3 -3 l 3 3 l 3 -3 l 3 3 l 3 -3`, '#8f969f', 1.6);
	return g;
}

/** A two-axle wagon's running gear at cx: W-iron, axle box, leaf spring, a spoked wheel. */
function axle(cx) {
	let g = wheel(cx, -10, 10, true);
	g += P(`M ${cx - 12} -26 L ${cx - 5} -14 M ${cx + 12} -26 L ${cx + 5} -14`, IRON, 2.6);
	g += R(cx - 5, -19, 10, 8, '#6a717b', ' rx="1.5"');
	for (let i = 0; i < 3; i++) g += P(`M ${cx - 16 + i * 2} ${-25 + i * 1.6} Q ${cx} ${-21 + i * 1.6} ${cx + 16 - i * 2} ${-25 + i * 1.6}`, IRON, 1.6);
	return g;
}

/** A buffer at the end of a car: a shank and a round head, pointing left (dir -1) or right (1). */
const buffer = (x, y, dir) => R(dir > 0 ? x : x - 7, y - 3, 7, 6, '#7d848d') + `<ellipse cx="${r1(x + dir * 8)}" cy="${y}" rx="2.4" ry="6" fill="${DARK}"/>`;

const CAR_W = { loco: 220, power: 236, coach: 200, unit: 186, van: 150 };

/** One car of a train, in unit coordinates: the rail at y 0, the car's left end at x 0, its front (if it has a cab) to
 * the right. kind: 'loco' | 'power' | 'coach' | 'unit' | 'van'. tone: the livery colour (a token name), pale: a lighter
 * livery (a cheaper unit), ends: { left, right } what is at each end ('buffers' | 'gangway' | 'cab' | 'none').
 * Returns { g, plate: { x, y, w, h } in unit coordinates }. */
function car(kind, o = {}) {
	const w = o.w ?? CAR_W[kind], tone = o.tone ?? 'blue';
	const body = kind === 'van' ? CREAM : '#ffffff';
	const solid = o.pale ? mix(tone, 55) : `var(--${tone})`;
	const id = nid('grwc');
	let d;
	if (kind === 'power') {
		d = `M 0 -26 V -86 Q 0 -96 12 -96 H ${w * 0.58} C ${w * 0.8} -96 ${w * 0.93} -80 ${w} -40 L ${w} -26 Z`;
	} else if (kind === 'loco') {
		d = `M 0 -26 V -78 L 6 -92 Q 8 -96 14 -96 H ${w - 30} L ${w - 6} -74 L ${w - 1} -56 L ${w} -26 Z`;
	} else if (kind === 'unit') {
		d = `M 0 -26 V -86 Q 0 -96 12 -96 H ${w - 16} Q ${w - 5} -96 ${w - 3} -84 L ${w} -46 V -26 Z`;
	} else if (kind === 'van') {
		d = `M 0 -30 V -84 Q ${w / 2} -98 ${w} -84 V -30 Z`;
	} else {
		d = `M 0 -26 V -86 C 0 -92 6 -95 14 -96 H ${w - 14} C ${w - 6} -95 ${w} -92 ${w} -86 V -26 Z`;
	}
	let g = `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>`;
	// Running gear first: bogies (or a wagon's axles), the underframe and its equipment boxes.
	if (kind === 'van') {
		g += axle(w * 0.27) + axle(w * 0.73);
		g += R(4, -32, w - 8, 6, IRON);
	} else {
		const b = kind === 'coach' || kind === 'unit' ? [w * 0.17, w * 0.83] : [w * 0.2, w * 0.8];
		g += R(8, -27, w - 16, 7, IRON);
		g += R(b[0] + 42, -24, b[1] - b[0] - 84, 10, '#4a5059', ' rx="2"');
		for (let x = b[0] + 50; x < b[1] - 50; x += 26) g += P(`M ${r1(x)} -22 V -16`, '#6b7079', 1.4);
		g += bogie(b[0]) + bogie(b[1]);
	}
	const ends = o.ends ?? {};
	for (const [side, x, dir] of [['left', 0, -1], ['right', w, 1]]) {
		const e = ends[side] ?? (kind === 'van' ? 'buffers' : 'none');
		if (e === 'buffers') {
			const y = kind === 'van' ? -36 : -34;
			g += R(dir > 0 ? x - 2 : x - 4, y - 8, 6, 22, '#4a5059');
			g += buffer(x + dir * 2, y - 2, dir) + buffer(x + dir * 2, y + 10, dir);
			g += P(`M ${x} ${y + 4} h ${dir * 9}`, IRON, 2);
		}
	}
	// The body: white (or cream) with the livery inside its outline.
	g += `<path d="${d}" fill="${body}"/>`;
	g += `<g clip-path="url(#${id})">`;
	if (kind === 'van') {
		for (let x = 10; x < w; x += 11) g += P(`M ${x} -94 V -30`, '#e2d6c2', 1.4);
		g += R(0, -100, w, 13, '#c9ced6');
	} else {
		g += R(0, -100, w, 10, '#cfd4db');
		g += R(0, -60, w, 34, solid);
		g += R(0, -62, w, 2.5, mix(tone, 35));
		if (kind === 'power' || kind === 'loco' || kind === 'unit') {
			// The yellow warning panel on the nose.
			const nx = kind === 'power' ? w * 0.86 : w - 24;
			g += `<path d="M ${r1(nx)} -26 L ${r1(nx)} -64 L ${w + 4} -64 L ${w + 4} -26 Z" fill="${mix('yellow', 90)}"/>`;
		}
	}
	g += '</g>';
	g += `<path d="${d}" fill="none"${sk(2)}/>`;
	// Windows, doors and the cab.
	const glass = (x, y, ww, hh, rx = 3) => R(x, y, ww, hh, '#2f3a48', ` rx="${rx}"`) + P(`M ${r1(x + ww * 0.25)} ${r1(y + hh - 2)} L ${r1(x + ww * 0.55)} ${r1(y + 2)}`, '#7d8fa6', 1.6);
	const door = (x, ww = 18, dbl = false) => {
		let s = R(x, -86, ww, 58, 'none', sk(1.4) + ' rx="2"');
		if (dbl) s += P(`M ${r1(x + ww / 2)} -86 V -28`, INK, 1.2) + glass(x + 3, -80, ww / 2 - 5, 18, 2) + glass(x + ww / 2 + 2, -80, ww / 2 - 5, 18, 2);
		else s += glass(x + 4, -80, ww - 8, 16, 2) + R(x + ww - 6, -54, 2, 8, INK);
		return s;
	};
	let plate;
	if (kind === 'coach') {
		g += door(10) + door(w - 28);
		for (let x = 36; x + 24 < w - 30; x += 30) g += glass(x, -84, 24, 18);
		plate = { x: w * 0.24, y: -56, w: w * 0.52, h: 20 };
	} else if (kind === 'unit') {
		g += door(w * 0.2, 28, true) + door(w * 0.62, 28, true);
		for (const x of [8, w * 0.2 + 34, w * 0.2 + 62, w * 0.62 + 34]) if (x + 22 < w - 30) g += glass(x, -84, 22, 18);
		// Cab: the windscreen on the raked front, a side window, headlights.
		g += `<path d="M ${w - 14} -92 Q ${w - 6} -92 ${w - 5} -84 L ${w - 2} -66 H ${w - 22} V -92 Z" fill="#26303c"/>`;
		g += C(w - 6, -36, 2.6, '#fff', sk(1));
		plate = { x: 6, y: -56, w: w * 0.62, h: 20 };
	} else if (kind === 'power') {
		g += door(18);
		for (let x = 46; x + 24 < w * 0.56; x += 30) g += R(x, -84, 22, 6, '#c9ced6', ' rx="1"');
		g += `<path d="M ${w * 0.6} -92 C ${w * 0.76} -92 ${w * 0.86} -82 ${w * 0.92} -66 L ${w * 0.66} -66 Z" fill="#26303c"/>`;
		g += P(`M ${w * 0.7} -70 L ${w * 0.76} -88`, '#7d8fa6', 1.6);
		g += C(w * 0.96, -36, 2.8, '#fff', sk(1));
		g += R(40, -104, 18, 8, '#8a9099', ' rx="2"') + R(84, -104, 26, 8, '#8a9099', ' rx="2"');
		plate = { x: 30, y: -56, w: w * 0.44, h: 20 };
	} else if (kind === 'loco') {
		g += `<path d="M ${w - 32} -92 L ${w - 8} -72 H ${w - 32} Z" fill="#26303c"/>`;
		g += `<path d="M 8 -90 L 4 -80 V -72 H 22 V -90 Z" fill="#26303c"/>`;
		g += door(w - 54, 16) + door(26, 16);
		for (let x = 56; x < w - 70; x += 9) g += P(`M ${x} -84 V -70`, '#b7bec7', 1.6);
		g += C(w - 3, -36, 2.6, '#fff', sk(1));
		plate = { x: 40, y: -56, w: w - 94, h: 20 };
	} else {
		// The van: a sliding door with a Z-brace and its runner, a label board, roof ribs.
		const dx = w * 0.32, dw = w * 0.36;
		g += R(dx, -82, dw, 50, 'none', sk(1.6));
		g += P(`M ${dx} -82 L ${dx + dw} -32 M ${dx} -57 H ${dx + dw}`, '#b9a98f', 2);
		g += P(`M ${dx - 6} -85 H ${dx + dw + 6}`, IRON, 2.4);
		const pw = Math.min(w - 16, o.plateW ?? 104);
		plate = { x: w * 0.5 - pw / 2, y: -80, w: pw, h: 20 };
		if (o.label !== false) g += R(plate.x, plate.y, plate.w, plate.h, '#fff', sk(1.4) + ' rx="2"');
	}
	if (kind !== 'van') {
		// A folded pantograph on electric cars.
		if (kind === 'loco' || kind === 'unit' || kind === 'power') {
			const px = kind === 'power' ? w * 0.3 : w * 0.42;
			g += R(px - 16, -100, 6, 4, '#e8eaed', sk(1)) + R(px + 14, -100, 6, 4, '#e8eaed', sk(1));
			g += P(`M ${px - 13} -101 L ${px + 8} -107 L ${px - 18} -110 M ${px - 26} -111 H ${px - 10}`, '#4a4e56', 2);
		}
	}
	return { g, plate, w };
}

/** A train: cars from the rear (left) to the front (right), coupled with gangways (passenger cars) or buffers and a
 * screw coupling. x: the rear end, y: the track's centre line (the train stands on the near rail), k: scale.
 * cars: [{ kind, tone, pale, w }]. Returns { svg, plates: [screen rects], w, top, right }. */
function grwTrain(x, y, cars, { k = 1, tone = 'blue' } = {}) {
	const gap = 9;
	let cx = 0, g = '';
	const plates = [];
	cars.forEach((c, i) => {
		const kind = c.kind, prev = cars[i - 1], next = cars[i + 1];
		const pax = kd => kd && kd !== 'van';
		const left = !prev ? (kind === 'van' || kind === 'coach' || kind === 'loco' ? 'buffers' : 'none') : pax(prev.kind) && pax(kind) && prev.kind !== 'loco' && kind !== 'loco' ? 'gangway' : 'buffers';
		const right = !next ? (kind === 'van' || kind === 'coach' ? 'buffers' : 'none') : pax(next.kind) && pax(kind) && next.kind !== 'loco' && kind !== 'loco' ? 'gangway' : 'buffers';
		const one = car(kind, { tone: c.tone ?? tone, pale: c.pale, w: c.w, label: c.label, plateW: c.plateW, ends: c.flip ? { left: right, right: left } : { left, right } });
		g += c.flip ? `<g transform="translate(${r1(cx + one.w)} 0) scale(-1 1)">${one.g}</g>` : `<g transform="translate(${r1(cx)} 0)">${one.g}</g>`;
		if (c.flip && one.plate) one.plate = { ...one.plate, x: one.w - one.plate.x - one.plate.w };
		if (right === 'gangway') {
			g += R(cx + one.w - 1, -84, gap + 2, 52, '#5a6069', sk(1.2));
			for (let j = 1; j < 4; j++) g += P(`M ${r1(cx + one.w - 1 + j * (gap + 2) / 4)} -84 V -32`, '#8a9099', 1);
		}
		if (one.plate) plates.push({ x: x + (cx + one.plate.x) * k, y: y + RAIL_Y + one.plate.y * k, w: one.plate.w * k, h: one.plate.h * k });
		cx += one.w + gap;
	});
	const w = (cx - gap) * k;
	return { svg: grp(x, y + RAIL_Y, k, g), plates, w, top: y + RAIL_Y - 110 * k, right: x + w };
}

// ---------- people ----------
/** A railway worker, standing, seen from the front: peaked cap with a brass badge, face, a uniform jacket with brass
 * buttons over a white shirt and tie, trousers and boots. cx: centre, fy: the feet, k: scale. tone: the uniform's
 * accent (tie and cap band). pose: 'stand' | 'lever' (right hand to reach: [x, y] relative, unit coordinates) | 'toss'
 * (right hand raised, palm up) | 'clipboard' | 'lamp'. legs: false hides the legs (seen behind a counter). */
function grwPerson(cx, fy, k = 1, o = {}) {
	const U = '#33425a', A = `var(--${o.tone ?? 'blue'})`, pose = o.pose ?? 'stand';
	let g = '';
	const arm = pts => {
		const d = `M ${pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join(' L ')}`;
		return P(d, INK, 13) + P(d, U, 9.4);
	};
	const hand = (x, y) => C(x, y, 5.4, SKIN, sk(1.4));
	if (o.legs !== false) {
		g += `<path d="M -15 -82 L -14 -6 H -2 L -1 -70 L 1 -70 L 2 -6 H 14 L 15 -82 Z" fill="${U}"${sk(1.6)}/>`;
		g += `<ellipse cx="-9" cy="-3" rx="10" ry="4" fill="${DARK}"/><ellipse cx="9" cy="-3" rx="10" ry="4" fill="${DARK}"/>`;
	}
	// Arms behind the body for the hanging side, then the jacket, then the working arm in front.
	if (pose !== 'clipboard') g += arm([[-23, -126], [-30, -102], [-29, -84]]) + hand(-29, -82);
	g += `<path d="M -27 -128 Q -31 -102 -25 -78 H 25 Q 31 -102 27 -128 Q 14 -137 0 -137 Q -14 -137 -27 -128 Z" fill="${U}"${sk(1.6)}/>`;
	g += `<path d="M -9 -136 L 0 -116 L 9 -136 Z" fill="#fff"${sk(1.2)}/>`;
	g += `<path d="M -2.5 -131 H 2.5 L 3.5 -113 L 0 -108 L -3.5 -113 Z" fill="${A}"/>`;
	g += P('M 0 -116 V -79', '#1f2b3d', 1.4);
	for (const yy of [-110, -98, -87]) g += C(-6, yy, 1.8, '#e2b84d') + C(6, yy, 1.8, '#e2b84d');
	g += P('M -21 -96 h 9 M 12 -96 h 9', '#1f2b3d', 1.4);
	// Head: neck, ears, face, hair at the temples, eyes, nose, a smile, cheeks; the cap.
	g += R(-5, -144, 10, 9, SKIN, sk(1.2));
	g += `<ellipse cx="-15" cy="-155" rx="3.4" ry="4.6" fill="${SKIN}"${sk(1.2)}/><ellipse cx="15" cy="-155" rx="3.4" ry="4.6" fill="${SKIN}"${sk(1.2)}/>`;
	g += `<ellipse cx="0" cy="-156" rx="14.5" ry="16" fill="${SKIN}"${sk(1.6)}/>`;
	g += `<path d="M -14 -160 Q -15 -152 -12 -148 L -11 -158 Z M 14 -160 Q 15 -152 12 -148 L 11 -158 Z" fill="${HAIR}"/>`;
	g += C(-5.2, -157, 1.9, INK) + C(5.2, -157, 1.9, INK) + C(-4.6, -157.6, 0.6, '#fff') + C(5.8, -157.6, 0.6, '#fff');
	g += C(-9, -150, 2.6, mix('red', 22)) + C(9, -150, 2.6, mix('red', 22));
	g += P('M 0 -155 L -1.4 -151 H 1', '#c99a78', 1.2) + P('M -4.6 -146.5 Q 0 -143 4.6 -146.5', INK, 1.5);
	g += `<path d="M -17 -167 Q -18 -181 0 -182 Q 18 -181 17 -167 Z" fill="${U}"${sk(1.6)}/>`;
	g += R(-16.5, -170, 33, 6, A, sk(1.2));
	g += `<path d="M -15 -164.5 Q 0 -158 17 -164.5 L 15 -166.5 H -14 Z" fill="${DARK}"/>`;
	g += C(0, -176, 2.6, '#e2b84d');
	if (pose === 'lever') {
		const [tx, ty] = o.reach ?? [40, -100];
		g += arm([[23, -126], [(23 + tx) / 2 + 6, (-126 + ty) / 2 + 8], [tx, ty]]) + hand(tx, ty);
	} else if (pose === 'toss') {
		g += arm([[23, -126], [40, -114], [46, -138]]) + `<path d="M 40 -139 Q 46 -133 53 -139" fill="${SKIN}"${sk(1.4)}/>` + hand(46, -140);
	} else if (pose === 'clipboard') {
		g += arm([[-23, -126], [-24, -100], [-10, -98]]) + arm([[23, -126], [26, -104], [12, -112]]);
		g += R(-16, -124, 30, 38, '#a58b6b', sk(1.4) + ' rx="2"') + R(-12, -119, 22, 30, '#fff');
		g += P('M -9 -112 h 15 M -9 -105 h 12 M -9 -98 h 15', '#b7bec7', 1.4) + R(-5, -127, 10, 5, '#6b7079', ' rx="1"');
		g += hand(-10, -98) + hand(12, -112);
	} else if (pose === 'lamp') {
		g += arm([[23, -126], [30, -102], [34, -84]]) + P('M 34 -84 V -76', INK, 1.6);
		g += R(27, -76, 14, 16, '#e9edf2', sk(1.4) + ' rx="2"') + C(34, -66, 3.6, '#f2c94c') + hand(34, -86);
	} else {
		g += arm([[23, -126], [30, -102], [29, -84]]) + hand(29, -82);
	}
	return grp(cx, fy, k, g);
}

// ---------- the signal box: the deck's recurring object ----------
/** A signal box standing on the ground at (x, gy), its left end at x, scale k: a brick locking room with arched windows
 * and a white nameboard; a timber cabin with four glazed bays (the first a door), a balcony rail, a hipped slate roof
 * with finials and a stove pipe; stairs up the left. Inside, a signaller at the lever frame pulls one lever.
 * o: { tone (trim colour), levers (count, default 9), pull (index of the pulled lever), person: true | false | 'toss',
 * stairs (default true), night (lit windows) }. Returns { svg, board, w, h, hand (screen point), top }. */
function grwBox(x, gy, k = 1, o = {}) {
	const T = `var(--${o.tone ?? 'blue'})`, glass = o.night ? GLASS_N : GLASS;
	let g = '';
	// Stairs and their landing, behind everything else.
	if (o.stairs !== false) {
		g += R(-34, -134, 34, 5, IRON) + P('M -30 -129 V 0', IRON, 3);
		g += P('M -108 0 L -30 -132', IRON, 4);
		for (let i = 1; i <= 7; i++) {
			const sx = -108 + (78 * i) / 8, sy = (-132 * i) / 8;
			g += P(`M ${r1(sx - 13)} ${r1(sy)} H ${r1(sx + 9)}`, '#7d6a58', 4);
		}
		g += P('M -116 -34 L -38 -166 H 0', IRON, 2.4) + P('M -116 -34 V -4 M -77 -100 V -66 M -38 -166 V -134', IRON, 2.4);
	}
	// The locking room: plinth, brick courses, arched windows, the nameboard.
	g += R(0, -128, 240, 128, BRICK, sk(2));
	for (let r = 0; r < 13; r++) {
		const y = -9 - r * 9.2;
		g += P(`M 1 ${r1(y)} H 239`, MORTAR, 1);
		for (let xx = r % 2 ? 12 : 0; xx < 240; xx += 24) if (xx > 0) g += P(`M ${xx} ${r1(y)} v -9.2`, MORTAR, 1);
	}
	g += R(-4, -8, 248, 8, '#c8ad97', sk(1.6));
	for (const wx of [30, 162]) {
		g += `<path d="M ${wx} -26 V -64 A 24 24 0 0 1 ${wx + 48} -64 V -26 Z" fill="${glass}"${sk(2)}/>`;
		g += P(`M ${wx + 24} -88 V -26 M ${wx} -46 H ${wx + 48} M ${wx} -66 H ${wx + 48}`, '#fff', 2.4);
		g += R(wx - 4, -28, 56, 5, '#d8d4cc', sk(1.2));
	}
	g += R(24, -122, 192, 26, '#fff', sk(2) + ' rx="2"');
	g += R(-6, -135, 252, 7, '#d8d4cc', sk(1.6));
	// The cabin: boarded lower panel, then the glazed bays with the signaller and the lever frame behind the glass.
	g += R(0, -252, 240, 118, CREAM, sk(2));
	for (let yy = -150; yy < -134; yy += 5) g += P(`M 1 ${yy} H 239`, '#e3d9c6', 1);
	g += R(10, -240, 220, 88, glass);
	const n = o.levers ?? 9, pull = o.pull ?? 4;
	const lx = i => (n > 1 ? 82 + (i * 136) / (n - 1) : 150);
	if (o.person !== false) {
		const pcx = Math.max(100, lx(pull) - 46);
		const target = [(lx(pull) - 13 - pcx) / 0.56, (-182 + 134) / 0.56];
		g += grwPerson(pcx, -134, 0.56, { tone: o.tone, pose: 'lever', reach: target });
	}
	const cols = ['red', 'red', 'ink', 'blue', 'ink', 'red', 'ink', 'yellow', 'red', 'ink', 'blue'];
	for (let i = 0; i < n; i++) {
		const c = cols[i % cols.length], col = c === 'ink' ? DARK : `var(--${c})`;
		const top = i === pull ? [lx(i) - 13, -182] : [lx(i) + 3, -186];
		g += P(`M ${r1(lx(i))} -154 L ${r1(top[0])} ${r1(top[1])}`, col, 5);
		g += R(top[0] - 3, top[1] - 6, 6, 7, '#e8eaed', sk(1) + ' rx="2"');
	}
	g += R(70, -156, 160, 5, '#6b5a49');
	g += R(1, -152, 238, 17, CREAM);
	for (let yy = -148; yy < -134; yy += 5) g += P(`M 1 ${yy} H 239`, '#e3d9c6', 1);
	for (const [a, b] of [[80, 112], [140, 172], [196, 228]]) g += `<path d="M ${a} -240 L ${a + 22} -240 L ${b - 22} -152 L ${b - 44} -152 Z" fill="#fff" opacity=".38"/>`;
	for (const bx of [10, 65, 120, 175]) {
		g += P(`M ${bx + 27.5} -240 V -152`, '#fff', 2) + P(`M ${bx} -211 H ${bx + 55} M ${bx} -182 H ${bx + 55}`, '#fff', 2);
	}
	// The door in the first bay.
	g += R(12, -240, 51, 106, '#f0e6d4', sk(1.4));
	g += R(20, -232, 35, 34, glass, sk(1.2)) + P('M 37.5 -232 V -198', '#fff', 2) + R(20, -190, 35, 48, 'none', sk(1)) + C(54, -168, 2.2, '#c9a64a');
	for (const bx of [10, 65, 120, 175, 230]) g += R(bx - 2, -240, 4, 88, T);
	g += R(0, -252, 240, 12, T, sk(1.6)) + R(4, -152, 232, 4, T);
	g += P('M 0 -252 V -134 M 240 -252 V -134', INK, 2);
	// Balcony: planks and a rail on posts.
	g += R(-34, -134, 288, 4, '#7d6a58');
	g += P('M -34 -158 H 252', IRON, 2) + P(Array.from({ length: 10 }, (_, i) => `M ${-34 + i * 31.8} -158 V -134`).join(' '), IRON, 1.6);
	// Roof: slate with courses, a fascia in the trim colour, a ridge with finials, the stove pipe.
	g += R(186, -330, 16, 40, '#6b7079', sk(1.4)) + R(181, -336, 26, 7, IRON, ' rx="2"');
	g += `<path d="M -20 -252 L 260 -252 L 212 -302 L 28 -302 Z" fill="${SLATE}"${sk(2)}/>`;
	for (const yy of [-264, -276, -289]) {
		const f = (yy + 252) / -50;
		g += P(`M ${r1(-20 + 48 * f)} ${yy} H ${r1(260 - 48 * f)}`, '#5f6670', 1.4);
	}
	g += R(-22, -256, 284, 6, T, sk(1.4));
	g += P('M 28 -302 H 212', '#2f343b', 4) + P('M 28 -302 V -316 M 212 -302 V -316', IRON, 2.4) + C(28, -318, 3, IRON) + C(212, -318, 3, IRON);
	return {
		svg: grp(x, gy, k, g),
		board: { x: x + 28 * k, y: gy - 120 * k, w: 184 * k, h: 22 * k },
		w: 240 * k, h: 318 * k, top: gy - 318 * k,
		lever: { x: x + lx(pull) * k, y: gy - 182 * k },
	};
}

// ---------- signals ----------
/** A semaphore signal on a post standing at (x, gy), h tall: base, white post, ladder, finial, a red arm with a white
 * band pivoting on its spectacle (red and green glasses) with the lamp behind. off: the arm raised (clear). */
function semaphore(x, gy, h, { off = false, k = 1, side = -1 } = {}) {
	if (side > 0) return `<g transform="translate(${r1(2 * x)} 0) scale(-1 1)">${semaphore(x, gy, h, { off, k })}</g>`;
	const top = gy - h, py = top + 36 * k;
	let g = R(x - 9 * k, gy - 8 * k, 18 * k, 8 * k, '#b9bec6', sk(1.4));
	g += `<path d="M ${r1(x - 5 * k)} ${gy - 8 * k} L ${r1(x - 3.5 * k)} ${r1(top + 6 * k)} H ${r1(x + 3.5 * k)} L ${r1(x + 5 * k)} ${gy - 8 * k} Z" fill="#f4f5f7"${sk(1.6)}/>`;
	g += P(`M ${r1(x + 9 * k)} ${gy - 8 * k} V ${r1(py + 26 * k)} M ${r1(x + 16 * k)} ${gy - 8 * k} V ${r1(py + 26 * k)}`, IRON, 1.4);
	for (let yy = gy - 18 * k; yy > py + 28 * k; yy -= 11 * k) g += P(`M ${r1(x + 9 * k)} ${r1(yy)} H ${r1(x + 16 * k)}`, IRON, 1.2);
	g += R(x - 2 * k, py + 26 * k, 24 * k, 3 * k, IRON);
	g += C(x, top + 2 * k, 4 * k, IRON) + P(`M ${x} ${r1(top - 2 * k)} V ${r1(top - 9 * k)}`, IRON, 2 * k);
	g += R(x + 4 * k, py - 9 * k, 12 * k, 16 * k, '#6b7079', sk(1.2) + ` rx="${r1(2 * k)}"`);
	const arm = `<g transform="rotate(${off ? 38 : 0} ${x} ${r1(py)})">`
		+ `<path d="M ${r1(x)} ${r1(py - 5 * k)} H ${r1(x - 58 * k)} V ${r1(py + 5 * k)} H ${r1(x)} Z" fill="var(--red)"${sk(1.4)}/>`
		+ R(x - 48 * k, py - 5 * k, 6 * k, 10 * k, '#fff')
		+ R(x - 2 * k, py - 6 * k, 14 * k, 22 * k, IRON, ` rx="${r1(2 * k)}"`) + C(x + 5 * k, py + 1 * k, 3.6 * k, '#e05a5e') + C(x + 5 * k, py + 10 * k, 3.6 * k, '#5fbf72')
		+ '</g>';
	return g + arm + C(x, py, 2.4 * k, '#b4bac2');
}

/** A colour-light signal on a post at (x, gy), h tall: a black head with a white border and hooded lamps, one lit.
 * lit: 'green' | 'orange' | 'red'. */
function colourLight(x, gy, h, lit = 'green', { k = 1, plate = 0 } = {}) {
	const top = gy - h;
	let g = R(x - 9 * k, gy - 7 * k, 18 * k, 7 * k, '#b9bec6', sk(1.2));
	g += R(x - 3 * k, top + 60 * k, 6 * k, h - 66 * k, '#8a9099', sk(1.2));
	g += P(`M ${r1(x + 8 * k)} ${gy - 7 * k} V ${r1(top + 70 * k)} M ${r1(x + 14 * k)} ${gy - 7 * k} V ${r1(top + 70 * k)}`, IRON, 1.2);
	for (let yy = gy - 16 * k; yy > top + 72 * k; yy -= 10 * k) g += P(`M ${r1(x + 8 * k)} ${r1(yy)} H ${r1(x + 14 * k)}`, IRON, 1);
	g += R(x - 16 * k, top, 32 * k, 64 * k, '#fff', sk(1.6) + ` rx="${r1(8 * k)}"`);
	g += R(x - 11 * k, top + 5 * k, 22 * k, 54 * k, '#22252b', ` rx="${r1(6 * k)}"`);
	const lamps = [['red', 15], ['orange', 32], ['green', 49]];
	for (const [c, dy] of lamps) {
		g += C(x, top + dy * k, 5.6 * k, c === lit ? (c === 'green' ? '#3fbf5f' : `var(--${c})`) : '#454a52');
		g += P(`M ${r1(x - 7 * k)} ${r1(top + (dy - 6) * k)} Q ${x} ${r1(top + (dy - 10) * k)} ${r1(x + 7 * k)} ${r1(top + (dy - 6) * k)}`, '#0f1114', 2 * k);
	}
	if (plate) g += R(x - plate / 2, top + 66 * k, plate, 26, '#fff', sk(1.6) + ' rx="3"');
	return g;
}

// ---------- station, boards and lineside ----------
/** A platform behind the track whose centre is at ty, from x0 to x1: paved top, white coping, a yellow line, a brick face. */
function platform(x0, x1, ty, { pal = 'day' } = {}) {
	const top = ty - 66, face = ty - 46, foot = ty - 26;
	const fill = pal === 'blue' ? 'rgba(255,255,255,.9)' : '#ece8df';
	let g = R(x0, top, x1 - x0, face - top, fill, sk(1.6));
	for (let xx = x0 + 30; xx < x1; xx += 30) g += P(`M ${xx} ${top + 2} V ${face - 2}`, pal === 'blue' ? '#cfe2f6' : '#ddd8cd', 1);
	g += R(x0, top + 9, x1 - x0, 2.5, 'var(--yellow)');
	g += R(x0, face - 4, x1 - x0, 5, '#fff', sk(1.2));
	g += R(x0, face + 1, x1 - x0, foot - face - 1, pal === 'blue' ? '#cde3f8' : BRICK, sk(1.6));
	for (let yy = face + 7; yy < foot; yy += 6) g += P(`M ${x0 + 1} ${yy} H ${x1 - 1}`, pal === 'blue' ? '#b4d3f2' : MORTAR, 1);
	return { svg: g, top, face };
}

/** A canopy over a platform: cast-iron columns with brackets, a roof deck and a white valance with a saw-tooth edge.
 * Columns stand on the platform top (pt). Returns { svg, y } (y: the valance's bottom). */
function canopy(x0, x1, pt, h, { tone = 'blue' } = {}) {
	const y = pt - h, cols = Math.max(2, Math.round((x1 - x0) / 140));
	let g = '';
	for (let i = 0; i <= cols; i++) {
		const cx = x0 + 22 + ((x1 - x0 - 44) * i) / cols;
		g += R(cx - 3, y, 6, h, '#5d636c', sk(1.2)) + R(cx - 6, pt - 8, 12, 8, '#5d636c', sk(1.2)) + R(cx - 6, y + 22, 12, 5, '#5d636c');
		g += P(`M ${r1(cx - 24)} ${y + 10} Q ${r1(cx - 4)} ${y + 12} ${r1(cx)} ${y + 30} M ${r1(cx + 24)} ${y + 10} Q ${r1(cx + 4)} ${y + 12} ${r1(cx)} ${y + 30}`, '#5d636c', 2.2);
	}
	g += `<path d="M ${x0 - 14} ${y - 4} L ${x0 + 6} ${y - 30} H ${x1 - 6} L ${x1 + 14} ${y - 4} Z" fill="#dfe3e8"${sk(1.6)}/>`;
	g += R(x0 - 14, y - 6, x1 - x0 + 28, 6, `var(--${tone})`, sk(1.2));
	let v = `M ${x0 - 14} ${y} H ${x1 + 14} V ${y + 10}`;
	for (let xx = x1 + 14; xx > x0 - 14; xx -= 10) v += ` L ${r1(xx - 5)} ${y + 16} L ${r1(Math.max(x0 - 14, xx - 10))} ${y + 10}`;
	g += `<path d="${v} Z" fill="#fff"${sk(1.2)}/>`;
	return { svg: g, y: y + 16 };
}

/** A sign board on two posts that stand on the ground at gy: a white board with an ink frame and (head > 0) a band
 * along its top in the tone. Returns { svg, text: the board's inner rect, head: the band's rect }. */
function signBoard(x, y, w, h, gy, { tone = 'blue', head = 0, posts = true, pal = 'day' } = {}) {
	let g = '';
	if (posts && gy > y + h) {
		for (const px of [x + w * 0.18, x + w * 0.82]) g += R(px - 3, y + h - 2, 6, gy - y - h + 2, pal === 'blue' ? '#fff' : '#5d636c', sk(1.2)) + R(px - 6, gy - 5, 12, 5, '#8a9099');
	}
	g += R(x, y, w, h, '#fff', sk(2.4) + ' rx="6"');
	if (head) g += `<path d="M ${x + 1.2} ${y + head} V ${y + 6} Q ${x + 1.2} ${y + 1.2} ${x + 6} ${y + 1.2} H ${x + w - 6} Q ${x + w - 1.2} ${y + 1.2} ${x + w - 1.2} ${y + 6} V ${y + head} Z" fill="var(--${tone})"/>`;
	g += R(x + 5, y + 5, w - 10, h - 10, 'none', ` stroke="${mix('neutral', 25)}" stroke-width="1" rx="3"`);
	return { svg: g, text: { x: x + 14, y: y + (head || 0) + 8, w: w - 28, h: h - (head || 0) - 16 }, head: { x: x + 14, y, w: w - 28, h: head } };
}

/** Buffer stops at the end of a line running right, at the track centre (x, ty): rail-built struts, a red and white
 * beam with two buffers facing the train, a red lamp on top. */
function bufferStop(x, ty, { pal = 'day' } = {}) {
	const by = ty + RAIL_Y;
	let g = P(`M ${x - 4} ${by} L ${x + 26} ${by - 40} M ${x + 30} ${by} L ${x + 30} ${by - 44}`, pal === 'night' ? '#9aa0a8' : IRON, 4);
	g += R(x - 4, by - 52, 16, 30, 'var(--red)', sk(1.6) + ' rx="2"') + R(x - 4, by - 42, 16, 8, '#fff');
	g += buffer(x - 4, by - 46, -1) + buffer(x - 4, by - 28, -1);
	g += P(`M ${x + 4} ${by - 52} V ${by - 64}`, IRON, 2.4) + R(x - 2, by - 76, 12, 13, IRON, ' rx="2"') + C(x + 4, by - 69.5, 3.6, '#ff5a5e');
	return g;
}

/** An inspection canopy over the line at track centre ty, from x0 to x1: a pitched roof on steel columns, a raised
 * walkway with a rail, two hanging lamps, and a fascia board for the inspector's name (returned). */
function inspection(x0, x1, ty, { tone = 'purple', h = 150 } = {}) {
	const gy = ty - 24, roof = gy - h;
	let b = '', g = '';
	b += platform(x0 - 6, x1 + 6, ty).svg;
	for (const cx of [x0 + 12, x1 - 12]) b += R(cx - 4, roof + 16, 8, gy - roof - 16, '#6b7079', sk(1.4));
	for (const lx of [x0 + (x1 - x0) * 0.33, x0 + (x1 - x0) * 0.67]) g += P(`M ${r1(lx)} ${roof + 16} V ${roof + 40}`, IRON, 1.6) + `<path d="M ${r1(lx - 10)} ${roof + 48} L ${r1(lx - 6)} ${roof + 40} H ${r1(lx + 6)} L ${r1(lx + 10)} ${roof + 48} Z" fill="#5d636c"/>` + C(lx, roof + 50, 3.2, '#f2c94c');
	g += `<path d="M ${x0 - 12} ${roof + 16} L ${x0 + 20} ${roof - 20} H ${x1 - 20} L ${x1 + 12} ${roof + 16} Z" fill="#dfe3e8"${sk(1.8)}/>`;
	for (let xx = x0 + 30; xx < x1 - 20; xx += 22) g += P(`M ${xx} ${roof - 17} L ${xx - 8} ${roof + 13}`, '#c5cbd3', 1.2);
	g += R(x0 - 12, roof + 16, x1 - x0 + 24, 30, '#fff', sk(2));
	g += R(x0 - 12, roof + 16, x1 - x0 + 24, 6, `var(--${tone})`);
	return { back: b, svg: g, fascia: { x: x0, y: roof + 22, w: x1 - x0, h: 24 }, walk: gy - 46 };
}

// ---------- scenery ----------
/** A tree standing at (x, gy): 'round' (a trunk and a layered crown) or 'pine'. */
function tree(x, gy, k = 1, kind = 'round', pal = 'day') {
	const n = pal === 'night';
	const c1 = n ? '#2c3a33' : mix('green', 34), c2 = n ? '#34453c' : mix('green', 46), c3 = n ? '#3b4d43' : mix('green', 26), trunk = n ? '#3a332d' : '#9a7d63';
	let g = R(-3.5, -44, 7, 44, trunk);
	if (kind === 'pine') {
		g += `<path d="M 0 -118 L 22 -70 H -22 Z M 0 -96 L 28 -46 H -28 Z M 0 -74 L 32 -26 H -32 Z" fill="${c2}"/>`;
		g += `<path d="M 0 -118 L 22 -70 H 8 Z M 0 -96 L 28 -46 H 10 Z M 0 -74 L 32 -26 H 12 Z" fill="${c1}"/>`;
	} else {
		g += C(-16, -54, 20, c1) + C(15, -58, 22, c3) + C(0, -76, 26, c2) + C(-6, -82, 12, c3);
		g += P('M -2 -40 L -10 -54 M 2 -46 L 10 -58', trunk, 2.4);
	}
	return grp(x, gy, k, g);
}
/** A low hill on the horizon: a smooth hump from x0 to x1, h tall. */
const hill = (x0, x1, hz, h, fill) => `<path d="M ${x0} ${hz} C ${r1(x0 + (x1 - x0) * 0.25)} ${r1(hz - h)} ${r1(x0 + (x1 - x0) * 0.75)} ${r1(hz - h)} ${x1} ${hz} Z" fill="${fill}"/>`;
/** The horizon: a line across, hills behind it. hills: [[x0, x1, h, pct]]. */
function horizon(x0, x1, hz, hills = [], pal = 'day') {
	let g = hills.map(([a, b, h, pct]) => hill(a, b, hz, h, pal === 'night' ? `color-mix(in srgb, #ffffff ${pct / 3}%, #1b1b1f)` : pal === 'blue' ? `color-mix(in srgb, #ffffff ${pct}%, #0078d4)` : mix('green', pct))).join('');
	return g + P(`M ${x0} ${hz} H ${x1}`, pal === 'night' ? '#3a3d43' : pal === 'blue' ? 'rgba(255,255,255,.45)' : '#d9dde3', 2);
}
/** A flat cloud. */
const cloud = (x, y, k = 1) => grp(x, y, k, `<path d="M -40 0 Q -42 -16 -24 -16 Q -20 -32 0 -30 Q 16 -40 30 -24 Q 46 -24 44 0 Z" fill="#eef2f6"/>`);

// ---------- shared HTML bits ----------
const css = n => `
.${n} { position: relative; width: ${W}px; }
.${n} .rd-svg { overflow: visible; }
.${n} .${n}-bd { position: absolute; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; color: var(--ink); white-space: nowrap; letter-spacing: .01em; }
.${n} .${n}-pl { position: absolute; display: flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; background: #fff; border: 1.5px solid ${INK}; border-radius: 4px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.${n} .${n}-hd { position: absolute; display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: #fff; white-space: nowrap; }
.${n} .${n}-tx { position: absolute; color: var(--ink); line-height: 1.2; }
.${n} .${n}-sm { position: absolute; color: var(--body); white-space: nowrap; line-height: 1.2; }
.${n} .${n}-big { position: absolute; font-weight: 700; letter-spacing: -.03em; line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.${n} .${n}-hid { visibility: hidden; }
`;
const hid = (n, k, i) => (k < i ? ` ${n}-hid` : '');
const vis = (k, i) => (k < i ? ' visibility="hidden"' : '');
/** Text on a board (nameboard, sign) or plate: centred in rect r, font size fs. */
const onBoard = (cls, r, html, fs, extra = '', on = '#ffffff') => `<div class="${cls}" style="${at(r.x, r.y, r.w, r.h)};font-size:${fs}px${extra}" data-t data-on="${on}">${html}</div>`;
/** A train's plate text: its logo and name. */
const nameHtml = (m, size = 18) => `${m.logo ? logo(m.logo, size) : ''}<span>${fmt(m.name ?? '')}</span>`;

/** The cover's left half: eyebrow, title, sub, speaker and pills (the built-in cover's classes). */
function coverLeft(s, width = 780) {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role ?? '')}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left" style="width:${width}px;bottom:240px"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
}

/** The load: a goods van with a label board. Returns the train and the label's rect. */
const taskVan = (x, ty, k = 1) => grwTrain(x, ty, [{ kind: 'van' }], { k });

export const designs = {
	/** The cover, a hero scene: the main line runs in along the bottom of the page with your load's van; a signal box
	 * with its signaller at the lever frame stands at the junction; two sets of points send three lines off to the
	 * right, each with its own service and a board naming it: an express (Single), a local stopping at a check signal
	 * (the transfer), a train under an inspection canopy with an inspector beside it (the inspection stop). Hills and trees behind.
	 * Fields: eyebrow, title, sub, speaker, pills, box: { name, logo }, task, routes (3, top to bottom):
	 * [{ title, sub }], trains: { express, local, inspected, inspector } (plate names, top to bottom: { name, logo }). */
	'grw-cover': {
		bare: true,
		css: `${css('grw-cover')}
.grw-cover { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
`,
		render(s) {
			const hz = 450, yA = 930, yM = 760, yT = 590, toe1 = 1118, toe2 = 1176;
			let g = '';
			g += cloud(1300, 230, 1.3) + cloud(1690, 160, 1) + cloud(1020, 310, 0.8);
			g += horizon(860, 1920, hz, [[860, 1160, 46, 12], [1080, 1500, 70, 9], [1420, 1760, 52, 13], [1680, 1920, 64, 10]]);
			g += tree(1150, hz + 4, 0.8, 'pine') + tree(1184, hz + 6, 0.62, 'pine') + tree(1470, hz + 2, 0.9) + tree(1508, hz + 4, 0.66) + tree(1880, hz + 2, 0.8, 'pine');
			const main = route([['M', 0, yA], ['L', 1920, yA]]);
			const top = route([['M', toe1, yA], ['C', toe1 + 140, yA, toe1 + 120, yT, toe1 + 280, yT], ['L', 1920, yT]]);
			const mid = route([['M', toe2, yA], ['C', toe2 + 100, yA, toe2 + 90, yM, toe2 + 200, yM], ['L', 1920, yM]]);
			const B = grwBox(822, yA - 30, 1.05, { tone: 'purple', pull: 5, levers: 9 });
			g += B.svg;
			g += semaphore(1098, yA - 30, 190, { off: true, side: 1 });
			let html = '';
			const M = s.trains ?? {}, Lb = s.labels ?? {};
			// Boards stand behind the right end of the line they name.
			const R3 = s.routes ?? [];
			const bw = 236, bh = 66, bx = 1596;
			[yT, yM, yA].forEach((ly, i) => {
				const r = R3[i];
				if (!r) return;
				const by = ly - 34 - bh - 8;
				g += signBoard(bx, by, bw, bh, ly - 28, { tone: 'purple', head: 8 }).svg;
				html += onBoard('grw-cover-bd', { x: bx + 12, y: by + 11, w: bw - 24, h: 28 }, fmt(r.title ?? ''), 24);
				html += onBoard('grw-cover-sm', { x: bx + 8, y: by + 39, w: bw - 16, h: 20 }, fmt(r.sub ?? ''), 15, ';justify-content:center;display:flex;color:var(--body)');
			});
			g += colourLight(1560, yM - 30, 118, 'orange', { k: 0.8, plate: 70 });
			const I = inspection(1236, 1500, yA, { tone: 'purple', h: 84 });
			g += I.back;
			g += track([top, mid, main]);
			g += rodding(1080, toe1, yA - 33, yA);
			const ex = grwTrain(1300, yT, [{ kind: 'coach' }, { kind: 'power' }], { k: 0.66, tone: 'purple' });
			const lo = grwTrain(1300, yM, [{ kind: 'unit', w: 170, flip: true, pale: true }, { kind: 'unit', w: 170, pale: true }], { k: 0.66, tone: 'purple' });
			const cr = grwTrain(1272, yA, [{ kind: 'unit', w: 170, flip: true, pale: true }, { kind: 'unit', w: 170, pale: true }], { k: 0.6, tone: 'purple' });
			g += ex.svg + lo.svg + cr.svg + I.svg;
			g += grwPerson(1530, yA - 28, 0.42, { tone: 'purple', pose: 'clipboard' });
			const V = taskVan(560, yA, 0.9);
			g += V.svg;
			const plate = (tr, m, i = 0) => (m?.name ? onBoard('grw-cover-pl nolint', tr.plates[i], nameHtml(m, 12), 12) : '');
			html += plate(ex, M.express, 1) + plate(lo, M.local, 1) + plate(cr, M.inspected, 1);
			html += onBoard('grw-cover-bd nolint', { x: 1525, y: yM - 30 - 118 + 0.8 * 66, w: 70, h: 26 }, fmt(Lb.check ?? 'check'), 15, ';color:var(--orange)');
			if (s.box?.name) html += onBoard('grw-cover-bd', B.board, `${s.box.logo ? logo(s.box.logo, 20) : ''}${fmt(s.box.name)}`, 20);
			if (s.task) html += onBoard('grw-cover-bd nolint', V.plates[0], fmt(s.task), 15);
			if (M.inspector?.name) html += onBoard('grw-cover-bd nolint', I.fascia, nameHtml(M.inspector, 14), 14);
			return `<div class="grw-cover">${layer(1080, g, 1920)}${coverLeft(s, 780)}${html}${msLogo()}</div>`;
		},
	},

	/** The journey along one line: three stations, each a platform with its own signal box at the end and a tall
	 * station board carrying the step's name, its date and its question; small boards at either end for the dates
	 * before and after. Hills on the horizon. Built one station per click (earlier ones stay).
	 * Fields: eyebrow, title, stations (3): [{ name, when, question, tone }], halts (2): [{ when, text, logo, step }]. */
	'grw-line': {
		clicks: true,
		css: css('grw-line'),
		render(s, ctx = {}) {
			const H = bodyHeight(s), k = ctx.step ?? Infinity, yL = 596, hz = 300;
			let g = cloud(250, 60, 1) + cloud(1300, 40, 0.8) + horizon(0, W, hz, [[0, 380, 60, 10], [300, 820, 84, 8], [760, 1180, 58, 12], [1100, 1560, 80, 9], [1480, W, 62, 11]]);
			g += tree(170, hz + 2, 0.7, 'pine') + tree(1262, hz + 4, 0.8) + tree(1716, hz + 2, 0.7, 'pine');
			const L = route([['M', 0, yL], ['L', W, yL]]);
			let html = '';
			const cxs = [430, 960, 1490];
			let back = '', front = '';
			(s.stations ?? []).slice(0, 3).forEach((st, i) => {
				const cx = cxs[i], tone = st.tone ?? 'blue', n = i + 1, h = hid('grw-line', k, n);
				let sg = '';
				const pf = platform(cx - 170, cx + 200, yL);
				const cn = canopy(cx - 130, cx + 190, pf.top, 190, { tone });
				const sb = signBoard(cx - 135, 96, 330, 150, cn.y - 172, { tone, head: 50 });
				sg += pf.svg + cn.svg;
				sg += P(`M ${cx - 70} ${sb.text.y + sb.text.h + 10} V ${cn.y - 46} M ${cx + 130} ${sb.text.y + sb.text.h + 10} V ${cn.y - 46}`, '#5d636c', 5);
				sg += sb.svg;
				const B = grwBox(cx - 318, yL - 30, 0.5, { tone, stairs: false, pull: 3, levers: 7 });
				sg += B.svg;
				html += onBoard(`grw-line-bd nolint${h}`, B.board, fmt(st.name ?? ''), 12);
				if (i < 2) sg += R(cx + 60, pf.top - 26, 52, 6, '#7d6a58', sk(1)) + R(cx + 64, pf.top - 20, 4, 20, IRON) + R(cx + 104, pf.top - 20, 4, 20, IRON);
				back += `<g${vis(k, n)}>${sg}</g>`;
				html += `<div class="grw-line-hd nolint${h}" style="${at(sb.head.x, sb.head.y + 4, sb.head.w, sb.head.h - 4)};font-size:25px" data-t data-on="var(--${tone})"><span>${fmt(st.name ?? '')}</span><span style="font-size:20px;font-weight:600">${fmt(st.when ?? '')}</span></div>`;
				html += `<div class="grw-line-tx${h}" style="${at(sb.text.x, sb.text.y + 6, sb.text.w, sb.text.h)};font-size:29px;font-weight:600" data-t>${fmt(st.question ?? '')}</div>`;
			});
			g += back + track([L]);
			const ht = grwTrain(cxs[2] - 150, yL, [{ kind: 'unit', w: 170, flip: true }, { kind: 'unit', w: 170 }], { k: 0.86, tone: 'purple' });
			g += `<g${vis(k, 3)}>${ht.svg}</g>`;
			(s.halts ?? []).slice(0, 2).forEach((hl, i) => {
				const st = hl.step ?? 1, x = i ? W - 186 : 0;
				const sb = signBoard(x, yL + 34, 186, 56, H + 40, { posts: false });
				front += `<g${vis(k, st)}>${sb.svg}</g>`;
				html += `<div class="grw-line-bd nolint${hid('grw-line', k, st)}" style="${at(x + 8, yL + 38, 170, 24)};font-size:19px" data-t>${fmt(hl.when ?? '')}</div>`;
				html += `<div class="grw-line-sm${hid('grw-line', k, st)}" style="${at(x + 8, yL + 62, 170, 24)};font-size:18px;display:flex;align-items:center;justify-content:center;gap:6px" data-t>${hl.logo ? logo(hl.logo, 18) : ''}<span>${fmt(hl.text ?? '')}</span></div>`;
			});
			g += front;
			return heading(s) + body(`<div class="grw-line" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A yes-or-no rule: the signal box has one lever; its signaller pulls it; the question is on the board beside the box. The
	 * line runs through a home signal to one pair of points: up to the depot of reasoning locomotives (two roads), down
	 * to the depot of the others; every locomotive drawn, so they can be counted, each road ending at buffer stops.
	 * Fields: eyebrow, title, box: { name }, question, yes, no, task, pools (2, top then bottom): [{ title, count, big }],
	 * specs: [line, line] (on a board under the box). */
	'grw-points': {
		css: css('grw-points'),
		render(s) {
			const H = bodyHeight(s), yA = 452, toe = 640, toe2 = 930, yR1 = 120, yR2 = 250, yO = 590;
			let g = horizon(0, W, 40, [[1100, 1500, 30, 9], [1400, W, 40, 11]]);
			const A = route([['M', 0, yA], ['L', toe, yA]]);
			const up = route([['M', toe, yA], ['C', toe + 140, yA, toe + 130, yR2, toe + 270, yR2], ['L', 1700, yR2]]);
			const up2 = route([['M', toe2, yR2], ['C', toe2 + 100, yR2, toe2 + 90, yR1, toe2 + 200, yR1], ['L', 1700, yR1]]);
			const dn = route([['M', toe, yA], ['C', toe + 120, yA, toe + 110, yO, toe + 240, yO], ['L', 1700, yO]]);
			const B = grwBox(130, yA - 30, 1, { tone: 'blue', levers: 1, pull: 0 });
			g += B.svg;
			const q = signBoard(384, 110, 260, 80, yA - 30, { tone: 'blue', head: 8 });
			g += q.svg;
			g += semaphore(612, yA - 30, 170, { side: 1 });
			g += track([A, up, up2, dn]);
			g += rodding(370, toe, yA - 33, yA);
			for (const yy of [yR1, yR2, yO]) g += bufferStop(1704, yy);
			const pools = s.pools ?? [];
			const lk = 0.36, lw = 220 * lk, pitch = lw + 7;
			const roads = [[yR1, Math.ceil((pools[0]?.count ?? 14) / 2)], [yR2, Math.floor((pools[0]?.count ?? 14) / 2)], [yO, pools[1]?.count ?? 8]];
			for (const [yy, n] of roads) for (let i = 0; i < n; i++) g += grwTrain(1700 - (i + 1) * pitch, yy, [{ kind: 'loco' }], { k: lk, tone: 'blue' }).svg;
			const V = taskVan(400, yA, 0.95);
			g += V.svg;
			let html = '';
			if (s.box?.name) html += onBoard('grw-points-bd', B.board, fmt(s.box.name), 22);
			html += onBoard('grw-points-bd', { x: q.text.x, y: q.text.y + 2, w: q.text.w, h: q.text.h - 2 }, fmt(s.question ?? ''), 26);
			if (s.task) html += onBoard('grw-points-bd nolint', V.plates[0], fmt(s.task), 16);
			// Depot boards: the count big, the name under it.
			const depot = (x, y, gy, p, h = 92) => {
				const sb = signBoard(x, y, 360, h, gy, { tone: 'blue', head: 8 });
				g += sb.svg;
				html += `<div class="grw-points-big nolint" style="${at(x + 16, y + h / 2 - 22, 110)};font-size:48px;color:var(--blue)" data-t>${esc(p.big ?? `~${p.count}`)}</div>`;
				html += `<div class="grw-points-tx" style="${at(x + 124, y + h / 2 - 16, 196)};font-size:24px;font-weight:700;white-space:nowrap" data-t>${fmt(p.title ?? '')}</div>`;
			};
			const yesno = (x, y, gy, text) => {
				const sb = signBoard(x, y, 84, 40, gy, {});
				g += sb.svg;
				html += onBoard('grw-points-bd nolint', { x, y: y + 2, w: 84, h: 36 }, fmt(text), 19, ';color:var(--blue);text-transform:uppercase;letter-spacing:.08em');
			};
			if (pools[0]) depot(1060, 300, yA - 28, pools[0]);
			if (pools[1]) depot(1060, 624, H, pools[1], 66);
			if (s.yes) yesno(950, 304, yA - 28, s.yes);
			if (s.no) yesno(950, 478, yO - 28, s.no);
			const sp = s.specs ?? [];
			if (sp.length) {
				const sb = signBoard(0, 540, 420, 84, H - 2, { tone: 'blue', head: 0 });
				g += sb.svg;
				sp.slice(0, 2).forEach((line, i) => (html += onBoard('grw-points-sm', { x: 12, y: 554 + i * 30, w: 396, h: 26 }, fmt(line), 20, ';display:flex;justify-content:center')));
			}
			return heading(s) + body(`<div class="grw-points" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A rule's limits: the signaller stands at the foot of the signal box and tosses a coin over the points; the coin
	 * carries the agreement rate. On the right, a station notice board on two legs holds two pinned notices, each a big
	 * number and a line. Fields: eyebrow, title, box: { name }, coin: { value, label, sub }, tags (2): [{ value, text, tone }]. */
	'grw-coin': {
		css: css('grw-coin'),
		render(s) {
			const H = bodyHeight(s), yA = 620, toe = 700;
			let g = cloud(170, 70, 1.1) + cloud(820, 40, 0.8);
			g += horizon(0, W, 420, [[0, 420, 50, 10], [300, 880, 70, 8], [800, 1300, 60, 11]]);
			g += tree(800, 422, 0.7) + tree(860, 424, 0.5) + tree(30, 422, 0.6, 'pine');
			const A = route([['M', 0, yA], ['L', W, yA]]);
			const up = route([['M', toe, yA], ['C', toe + 110, yA, toe + 100, yA - 90, toe + 220, yA - 90], ['L', W, yA - 90]]);
			const B = grwBox(110, yA - 30, 1, { tone: 'blue', levers: 1, pull: 0, person: false });
			g += B.svg;
			const trackLayer = track([up, A]) + rodding(350, toe, yA - 33, yA);
			// The signaller in front of the box, tossing the coin; its path rises from the hand to the coin.
			const px = 430, pk = 0.9, hx = px + 46 * pk, hy = yA - 28 - 140 * pk;
			const cx = 600, cy = 170, Rc = 124;
			g += P(`M ${r1(hx)} ${r1(hy - 8)} Q ${r1(hx + 10)} ${r1(cy + 40)} ${r1(cx - Rc * 0.7)} ${r1(cy + Rc * 0.75)}`, mix('neutral', 45), 3, ' stroke-dasharray="2 10"');
			g += grwPerson(px, yA - 28, pk, { tone: 'blue', pose: 'toss' }) + trackLayer;
			g += `<ellipse cx="${cx + 10}" cy="${cy}" rx="${Rc}" ry="${Rc}" fill="#c9a227"/>` + C(cx, cy, Rc, 'var(--yellow)', ' stroke="#b08a1e" stroke-width="5"');
			for (const a of [-0.6, 0.6]) g += P(`M ${r1(cx + Math.cos(Math.PI + a) * (Rc + 26))} ${r1(cy + Math.sin(Math.PI + a) * (Rc + 26))} A ${Rc + 26} ${Rc + 26} 0 0 1 ${r1(cx + Math.cos(Math.PI + a / 3) * (Rc + 26))} ${r1(cy + Math.sin(Math.PI + a / 3) * (Rc + 26))}`, 'var(--line-strong)', 5);
			let html = '';
			const c = s.coin ?? {};
			html += `<div class="grw-coin-big nolint" style="${at(cx - Rc, cy - 74, 2 * Rc)};font-size:86px;text-align:center;color:var(--red)" data-t data-on="#f2c94c">${esc(c.value ?? '')}</div>`;
			html += `<div class="grw-coin-tx" style="${at(cx - Rc + 30, cy + 16, 2 * Rc - 60)};font-size:21px;font-weight:600;text-align:center" data-t data-on="#f2c94c">${fmt(c.label ?? '')}</div>`;
			if (c.sub) html += `<div class="grw-coin-sm" style="${at(cx - Rc + 40, cy + 72, 2 * Rc - 80)};font-size:18px;text-align:center;white-space:normal" data-t data-on="#f2c94c">${fmt(c.sub)}</div>`;
			if (s.box?.name) html += onBoard('grw-coin-bd', B.board, fmt(s.box.name), 21);
			// The notice board: a timber frame on two legs, a green baize face, two pinned notices.
			const nx = 940, nw = W - nx, ny = 0, nh = 450;
			const legEnd = yA - 90 - 30;
			g += R(nx + 60, ny + nh - 4, 14, legEnd - ny - nh + 4, '#7d6a58', sk(1.4)) + R(nx + nw - 74, ny + nh - 4, 14, legEnd - ny - nh + 4, '#7d6a58', sk(1.4));
			g += R(nx, ny, nw, nh, '#8a6f55', sk(2.4) + ' rx="8"') + R(nx + 16, ny + 16, nw - 32, nh - 32, '#5f8a6e', sk(1.6) + ' rx="4"');
			for (let xx = nx + 30; xx < nx + nw - 20; xx += 22) g += P(`M ${xx} ${ny + 18} V ${ny + nh - 18}`, '#6a957a', 1);
			(s.tags ?? []).slice(0, 2).forEach((tg, i) => {
				const x = nx + 50, y = ny + 38 + i * 200, w = nw - 100, h = 172, tone = tg.tone ?? 'red';
				g += `<path d="M ${x} ${y} H ${x + w} V ${y + h - 18} L ${x + w - 18} ${y + h} H ${x} Z" fill="#fff"${sk(1.6)}/><path d="M ${x + w} ${y + h - 18} L ${x + w - 18} ${y + h - 18} V ${y + h}" fill="#e9ecef"${sk(1.2)}/>`;
				g += R(x, y, 10, h, `var(--${tone})`);
				g += C(x + w / 2, y + 10, 6, `var(--${tone})`, sk(1.4)) + C(x + w / 2 - 1.5, y + 8.5, 1.8, '#fff');
				html += `<div class="grw-coin-big nolint t-${tone}" style="${at(x + 36, y + 32)};font-size:66px;color:var(--fg)" data-t>${esc(tg.value ?? '')}</div>`;
				html += `<div class="grw-coin-tx" style="${at(x + 36, y + 112, w - 60)};font-size:26px;font-weight:600" data-t>${fmt(tg.text ?? '')}</div>`;
			});
			return heading(s) + body(`<div class="grw-coin" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Matching needs to a train: two trains, one per click. Each: the load, as a station board with its quote; the load's van, its side a
	 * placard with the four needs as bars; the locomotive coupled to it (the cheapest whose profile covers all
	 * four), with the train's name and logo on its plate; a board with a tick saying why. Small locomotive for the easy
	 * load, a big one for the hard load. Fields: eyebrow, title, kicker, labels (4), rows (2): [{ label, quote, needs
	 * (4 numbers), train: { name, logo }, size (0..1), why }]. */
	'grw-match': {
		clicks: true,
		css: `${css('grw-match')}
.grw-match .grw-match-gv { position: absolute; text-align: center; font-size: 18px; font-weight: 700; color: var(--blue); font-variant-numeric: tabular-nums; }
.grw-match .grw-match-gl { position: absolute; text-align: center; font-size: 15px; font-weight: 600; color: var(--body); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			const H = bodyHeight(s), k = ctx.step ?? Infinity;
			let g = horizon(380, W, 196, [[380, 820, 40, 10], [760, 1300, 56, 8], [1240, W, 44, 11]]) + tree(1500, 198, 0.6) + tree(1560, 200, 0.45) + tree(900, 198, 0.55, 'pine'), html = '';
			if (s.kicker) html += t('lbl grw-match-lb', at(0, 0) + ';position:absolute;white-space:nowrap', fmt(s.kicker));
			(s.rows ?? []).slice(0, 2).forEach((r, i) => {
				const ty = i ? 640 : 300, n = i + 1, h = hid('grw-match', k, n);
				let sg = track([route([['M', 0, ty], ['L', W, ty]])]);
				const sb = signBoard(0, ty - 210, 340, 112, ty - 28, { tone: 'blue', head: 40 });
				sg += sb.svg;
				const vk = 1.42, vw = 250, vx = 380;
				const V = grwTrain(vx, ty, [{ kind: 'van', w: vw, label: false }], { k: vk });
				const sz = r.size ?? 0.5, lw = 200 + 60 * sz, lk = 1.0 + 0.25 * sz;
				const Lo = grwTrain(vx + (vw + 9) * vk, ty, [{ kind: 'loco', w: lw }], { k: lk, tone: 'blue' });
				sg += V.svg + Lo.svg;
				// The placard on the van's side: four bars, their values over them, their names under.
				const px = vx + 12 * vk, pw = (vw - 24) * vk, py = ty + RAIL_Y - 88 * vk, ph = 56 * vk;
				sg += R(px, py, pw, ph, '#fff', sk(1.8) + ' rx="5"');
				const needs = r.needs ?? [0, 0, 0, 0], gap = pw / needs.length, top = py + 26, base = py + ph - 22;
				needs.forEach((v, j) => {
					const bx = px + gap * (j + 0.5) - 15;
					sg += R(bx, top, 30, base - top, mix('blue', 12), ' rx="3"') + R(bx, base - (base - top) * v, 30, Math.max(3, (base - top) * v), 'var(--blue)', ' rx="3"');
					html += `<div class="grw-match-gv nolint${h}" style="${at(px + gap * j, py + 4, gap)}" data-t>${esc(String(v))}</div>`;
					html += `<div class="grw-match-gl nolint${h}" style="${at(px + gap * j, base + 2, gap)}" data-t>${fmt(s.labels?.[j] ?? '')}</div>`;
				});
				const wx = Lo.right + 50, wsb = signBoard(wx, ty - 150, 330, 66, ty - 28, { tone: 'green', head: 8 });
				sg += wsb.svg;
				g += `<g${vis(k, n)}>${sg}</g>`;
				html += `<div class="grw-match-hd nolint${h}" style="${at(sb.head.x, sb.head.y + 2, sb.head.w, sb.head.h - 2)};font-size:22px;justify-content:flex-start" data-t data-on="var(--blue)">${fmt(r.label ?? '')}</div>`;
				html += `<div class="grw-match-tx${h}" style="${at(sb.text.x, sb.text.y + 4, sb.text.w, sb.text.h)};font-size:24px;font-style:italic" data-t>\u201c${fmt(r.quote ?? '')}\u201d</div>`;
				html += onBoard(`grw-match-pl nolint${h}`, Lo.plates[0], nameHtml(r.train ?? {}, 15), 15);
				html += `<div class="grw-match-bd${h}" style="${at(wx + 10, ty - 138, 310, 48)};font-size:24px" data-t>${ic('checkCircle', 30, 'var(--green)')}<span>${fmt(r.why ?? '')}</span></div>`;
			});
			return heading(s) + body(`<div class="grw-match" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Two rules compared, counted in coins: the front of a booking office with two ticket windows, a name board
	 * over each; in each window a tray of 100 coins on the counter (the cost of always using the biggest train), the
	 * saved coins green; the saving big under it with the solved rate. On the right, a departure board hangs from the
	 * ceiling with the live A/B. Fields: eyebrow, title, trays (2): [{ name, saved, big, label, quality }], key,
	 * baseline, live: { label, items: [{ value, text }] }. */
	'grw-fares': {
		css: css('grw-fares'),
		render(s) {
			const H = bodyHeight(s);
			let g = '', html = '';
			const Rc = 14, pitch = 34, tw = 10 * pitch + 24;
			g += R(-8, 30, 1040, 470, CREAM, sk(2) + ' rx="4"');
			for (let yy = 44; yy < 496; yy += 14) g += P(`M -6 ${yy} H 1030`, '#efe6d6', 1);
			(s.trays ?? []).slice(0, 2).forEach((tr, i) => {
				const x = 50 + i * 510, y = 100;
				// The window: a frame in the trim colour, round-topped, with the counter ledge under it.
				g += `<path d="M ${x - 20} ${y + tw + 22} V ${y - 10} Q ${x - 20} ${y - 46} ${x + tw / 2} ${y - 52} Q ${x + tw + 20} ${y - 46} ${x + tw + 20} ${y - 10} V ${y + tw + 22} Z" fill="#e9eef4"${sk(2)}/>`;
				g += `<path d="M ${x - 20} ${y + tw + 22} V ${y - 10} Q ${x - 20} ${y - 46} ${x + tw / 2} ${y - 52} Q ${x + tw + 20} ${y - 46} ${x + tw + 20} ${y - 10} V ${y + tw + 22}" fill="none" stroke="var(--blue)" stroke-width="8"/>`;
				g += R(x - 34, y + tw + 18, tw + 68, 16, '#9a7d63', sk(1.6) + ' rx="3"');
				g += R(x, y, tw, tw, '#c9a27e', sk(2) + ' rx="10"') + R(x + 6, y + 6, tw - 12, tw - 12, '#b38b66', ' rx="7"');
				for (let j = 0; j < 100; j++) {
					const row = Math.floor(j / 10), col = j % 10, cx = x + 12 + pitch / 2 + col * pitch, cy = y + 12 + pitch / 2 + (9 - row) * pitch;
					g += j < (tr.saved ?? 0) ? C(cx, cy, Rc, 'var(--green)', ' stroke="#0b5a0b" stroke-width="2"') + C(cx, cy, Rc - 5, 'none', ' stroke="#5fae5f" stroke-width="1.5"') : C(cx, cy, Rc, '#a07a55', ' stroke="#8a6646" stroke-width="1.5"');
				}
				const sb = signBoard(x + tw / 2 - 120, 4, 240, 46, 0, { tone: 'blue', head: 0, posts: false });
				g += sb.svg;
				html += onBoard('grw-fares-bd nolint', { x: x + tw / 2 - 120, y: 4, w: 240, h: 46 }, fmt(tr.name ?? ''), 27);
				html += `<div class="grw-fares-big nolint" style="${at(x - 10, y + tw + 56)};font-size:58px;color:var(--green)" data-t>${esc(tr.big ?? `${tr.saved}%`)}</div>`;
				html += `<div class="grw-fares-sm" style="${at(x + 190, y + tw + 54)};font-size:22px" data-t>${fmt(tr.label ?? 'saved')}</div>`;
				html += `<div class="grw-fares-sm" style="${at(x + 190, y + tw + 82)};font-size:22px" data-t>${fmt(tr.quality ?? '')}</div>`;
			});
			if (s.key) html += t('lbl', at(0, 652) + ';position:absolute;white-space:nowrap', fmt(s.key));
			if (s.baseline) html += `<div class="grw-fares-sm" style="${at(0, 614)};font-size:22px" data-t>${fmt(s.baseline)}</div>`;
			// The departure board, hung from the ceiling on two rods.
			const lv = s.live ?? {}, bx = 1130, bw = W - bx, by = 30, bh = 500;
			g += R(bx + 80, by + bh - 6, 14, 600 - by - bh + 6, '#5d636c', sk(1.4)) + R(bx + bw - 94, by + bh - 6, 14, 600 - by - bh + 6, '#5d636c', sk(1.4)) + R(bx + 70, 594, 34, 8, '#8a9099') + R(bx + bw - 104, 594, 34, 8, '#8a9099');
			g += R(bx, by, bw, bh, '#22252b', sk(3) + ' rx="12"') + R(bx + 12, by + 12, bw - 24, bh - 24, '#1a1c21', ' rx="6"');
			html += `<div class="grw-fares-hd nolint" style="${at(bx + 34, by + 30, bw - 68, 26)};font-size:17px;letter-spacing:.12em;text-transform:uppercase;color:#c8ccd3" data-t data-on="#1a1c21">${fmt(lv.label ?? '')}</div>`;
			(lv.items ?? []).slice(0, 3).forEach((it, i) => {
				const y = by + 80 + i * 145;
				g += P(`M ${bx + 26} ${y - 14} H ${bx + bw - 26}`, '#3b3f46', 2);
				html += `<div class="grw-fares-big nolint" style="${at(bx + 34, y + 6)};font-size:56px;color:#5fd36f" data-t data-on="#1a1c21">${esc(it.value ?? '')}</div>`;
				html += `<div class="grw-fares-sm" style="${at(bx + 34, y + 76, bw - 68)};font-size:23px;color:#fff" data-t data-on="#1a1c21">${fmt(it.text ?? '')}</div>`;
			});
			return heading(s) + body(`<div class="grw-fares" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The limit, at night (a dark page): the quote at the top; below, a signal box with lit windows sends one
	 * train, its locomotive and the load's van, down the only line it has, to buffer stops with a red lamp; beyond them,
	 * three routes are marked out with sleepers but no rails yet. A board by the buffers names the limit.
	 * Fields: eyebrow, title, quote, who, box: { name }, task, end. */
	'grw-buffers': {
		css: css('grw-buffers'),
		render(s) {
			const H = bodyHeight(s), yA = 580, xE = 1200, hz = 420;
			let g = C(1600, 250, 34, '#f1efe6') + C(1588, 242, 30, '#1b1b1f');
			g += horizon(0, W, hz, [[0, 500, 60, 22], [380, 980, 80, 16], [900, 1400, 56, 22], [1300, W, 74, 16]], 'night');
			g += tree(980, hz + 2, 0.8, 'pine', 'night') + tree(1020, hz + 4, 0.6, 'pine', 'night') + tree(260, hz + 2, 0.7, 'round', 'night');
			const B = grwBox(80, yA - 30, 0.8, { tone: 'blue', night: true, levers: 4, pull: 0 });
			g += B.svg;
			const live = route([['M', 0, yA], ['L', xE + 20, yA]]);
			const a = route([['M', xE + 26, yA], ['L', W, yA]]);
			const b = route([['M', xE + 150, yA], ['C', xE + 260, yA, xE + 250, yA - 120, xE + 380, yA - 120], ['L', W, yA - 120]]);
			const c = route([['M', xE + 150, yA], ['C', xE + 250, yA, xE + 240, yA + 80, xE + 360, yA + 80], ['L', W, yA + 80]]);
			g += track([{ r: b, bare: 'bed', op: 0.45 }, { r: c, bare: 'bed', op: 0.45 }, { r: a, bare: 'bed', op: 0.45 }, live], 'night');
			for (const [x, y] of [[xE + 420, yA - 120], [xE + 520, yA - 120], [xE + 400, yA + 80], [xE + 500, yA + 80], [xE + 280, yA], [xE + 440, yA]]) g += P(`M ${x} ${y - 30} V ${y - 8}`, '#c8ccd3', 3) + R(x - 4, y - 36, 8, 8, 'var(--orange)');
			g += bufferStop(xE, yA, { pal: 'night' });
			const T = grwTrain(560, yA, [{ kind: 'van' }, { kind: 'loco' }], { k: 1.05, tone: 'blue' });
			g += T.svg;
			const sb = signBoard(xE - 160, yA - 218, 260, 90, yA - 28, { tone: 'red', head: 8 });
			g += sb.svg;
			let html = '';
			html += t('grw-buffers-tx', at(0, 0, 1500) + ';font-size:40px;line-height:1.3;font-weight:500;color:#fff', `\u201c${fmt(s.quote ?? '')}\u201d`);
			html += t('grw-buffers-sm nolint', at(0, 136) + ';font-size:22px;color:#c8ccd3', fmt(s.who ?? ''));
			if (s.box?.name) html += onBoard('grw-buffers-bd', B.board, fmt(s.box.name), 18);
			if (s.task) html += onBoard('grw-buffers-bd nolint', T.plates[0], fmt(s.task), 17);
			if (s.end) html += onBoard('grw-buffers-bd', { x: sb.text.x, y: sb.text.y, w: sb.text.w, h: sb.text.h }, fmt(s.end), 22, ';white-space:normal;text-align:center;line-height:1.2');
			return heading(s) + body(`<div class="grw-buffers" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** One network, three services. The signal box holds your load's van at its home signal;
	 * the van carries its scores. Points send three lines off: an express on the top line; a local
	 * that stops at a check signal, with an express waiting on a loop beyond it to take over only if needed; a
	 * train under an inspection canopy with the inspector at its end, then on past a board. A board on posts
	 * names each line. Clicks: the front door, then one service each.
	 * Fields: eyebrow, title, box: { name }, task, score (4), routes (3): [{ title, sub }], trains: { express, local,
	 * express2, freight, inspector }, labels: { check, ifNeeded, revise }. */
	'grw-routes': {
		clicks: true,
		css: css('grw-routes'),
		render(s, ctx = {}) {
			const H = bodyHeight(s), k = ctx.step ?? Infinity, yA = 400, yS = 140, yL = 296, yC = 650, toe = 600, toe2 = 640;
			const M = s.trains ?? {}, Lb = s.labels ?? {}, RT = s.routes ?? [];
			let g = '', html = '';
			const A = route([['M', 0, yA], ['L', W, yA]]);
			const top = route([['M', toe, yA], ['C', toe + 150, yA, toe + 140, yS, toe + 290, yS], ['L', W, yS]]);
			const bot = route([['M', toe2, yA], ['C', toe2 + 150, yA, toe2 + 140, yC, toe2 + 290, yC], ['L', W, yC]]);
			const loop = route([['M', 1250, yA], ['C', 1330, yA, 1320, yL, 1400, yL], ['L', W, yL]]);
			const B = grwBox(90, yA - 30, 0.85, { tone: 'purple', levers: 3, pull: 1 });
			g += B.svg + semaphore(574, yA - 30, 160, { off: true, side: 1 });
			g += horizon(0, 620, 640, [[0, 300, 36, 12], [240, 620, 46, 9]]) + tree(110, 642, 0.9) + tree(180, 642, 0.7, 'pine') + tree(470, 642, 0.8) + tree(540, 642, 0.6, 'pine');
			// Things on the far side of each line, before the track: the boards, the check signal, the canopy's walkway.
			const board = (i, x, y, gy) => {
				const sb = signBoard(x, y, 280, 74, gy, { tone: 'purple', head: 8 });
				const h = hid('grw-routes', k, i + 2);
				html += `<div class="grw-routes-bd nolint${h}" style="${at(x + 12, y + 12, 256, 30)};font-size:26px" data-t>${fmt(RT[i]?.title ?? '')}</div>`;
				html += `<div class="grw-routes-sm${h}" style="${at(x + 12, y + 42, 256, 24)};font-size:18px;display:flex;justify-content:center" data-t>${fmt(RT[i]?.sub ?? '')}</div>`;
				return `<g${vis(k, i + 2)}>${sb.svg}</g>`;
			};
			g += board(0, 880, 0, yS - 28) + board(1, 880, 216, yA - 28) + board(2, 880, 470, yC - 28);
			g += `<g${vis(k, 3)}>${colourLight(1196, yA - 30, 118, 'orange', { k: 0.8, plate: 76 })}</g>`;
			const I = inspection(1156, 1420, yC, { tone: 'purple', h: 104 });
			g += track([top, loop, A, bot]) + rodding(300, toe, yA - 33, yA);
			// Click 1: the load, scored, at the home signal.
			const V = grwTrain(330, yA, [{ kind: 'van', w: 230, plateW: 196 }], { k: 1.0 });
			g += V.svg;
			const vk = 1.0, px = 330 + 14 * vk, pw = (230 - 28) * vk, py = yA + RAIL_Y - 58 * vk, ph = 26 * vk;
			g += R(px, py, pw, ph, '#fff', sk(1.4) + ' rx="4"');
			(s.score ?? [0.6, 0.8, 0.4, 0.7]).forEach((v, j) => {
				const bx = px + (pw / 4) * (j + 0.5) - 10, base = py + ph - 4, tp = py + 4;
				g += R(bx, tp, 20, base - tp, mix('blue', 12), ' rx="3"') + R(bx, base - (base - tp) * v, 20, (base - tp) * v, 'var(--blue)', ' rx="3"');
			});
			if (s.task) html += onBoard('grw-routes-bd nolint', V.plates[0], fmt(s.task), 15);
			if (s.box?.name) html += onBoard('grw-routes-bd', B.board, fmt(s.box.name), 17);
			const pl = (tr, i, m, n, fs = 14) => (m?.name ? onBoard(`grw-routes-pl nolint${hid('grw-routes', k, n)}`, tr.plates[i], nameHtml(m, fs), fs) : '');
			// Click 2: Single, an express.
			const ex = grwTrain(1220, yS, [{ kind: 'coach' }, { kind: 'power' }], { k: 0.72, tone: 'purple' });
			g += `<g${vis(k, 2)}>${ex.svg}</g>`;
			html += pl(ex, 1, M.express, 2, 15);
			// Click 3: a local at the check signal and an express waiting on the loop.
			const lo = grwTrain(890, yA, [{ kind: 'unit', w: 170, flip: true, pale: true }, { kind: 'unit', w: 170, pale: true }], { k: 0.7, tone: 'purple' });
			const ex2 = grwTrain(1420, yL, [{ kind: 'power', w: 220 }], { k: 0.72, tone: 'purple' });
			const ifn = signBoard(1590, yL + 30, 138, 40, yA - 28, {});
			g += `<g${vis(k, 3)}>${lo.svg}${ex2.svg}${ifn.svg}</g>`;
			html += pl(lo, 1, M.local, 3) + pl(ex2, 0, M.express2, 3, 15);
			html += onBoard(`grw-routes-sm nolint${hid('grw-routes', k, 3)}`, { x: 1592, y: yL + 32, w: 134, h: 36 }, fmt(Lb.ifNeeded ?? ''), 17, ';display:flex;align-items:center;justify-content:center;color:var(--body);font-weight:600');
			html += onBoard(`grw-routes-bd nolint${hid('grw-routes', k, 3)}`, { x: 1158, y: yA - 30 - 118 + 0.8 * 66, w: 76, h: 26 }, fmt(Lb.check ?? 'check'), 17, ';color:var(--orange)');
			// Click 4: the inspection canopy with the inspector, then on past the revise board.
			const cr = grwTrain(1164, yC, [{ kind: 'unit', w: 170, flip: true, pale: true }, { kind: 'unit', w: 170, pale: true }], { k: 0.7, tone: 'purple' });
			const rv = signBoard(1468, yC - 140, 128, 46, yC - 28, { tone: 'purple', head: 6 });
			const on = grwTrain(1604, yC, [{ kind: 'unit', w: 170, pale: true }], { k: 0.7, tone: 'purple' });
			g += `<g${vis(k, 4)}>${I.back}${rv.svg}${cr.svg}${I.svg}${grwPerson(1440, yC - 28, 0.44, { tone: 'purple', pose: 'clipboard' })}${on.svg}</g>`;
			html += pl(on, 0, M.freight, 4);
			html += pl(cr, 1, M.freight, 4);
			html += onBoard(`grw-routes-bd nolint${hid('grw-routes', k, 4)}`, I.fascia, nameHtml(M.inspector ?? {}, 15), 15);
			html += onBoard(`grw-routes-bd nolint${hid('grw-routes', k, 4)}`, { x: 1474, y: yC - 132, w: 116, h: 32 }, `${ic('edit', 18, 'var(--purple)')}<span>${fmt(Lb.revise ?? 'revise')}</span>`, 17, ';color:var(--purple)');
			return heading(s) + body(`<div class="grw-routes" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The cost-quality map, drawn as a railway map: cost change across, success rate up. A rule's one-train choices are a
	 * line of real track that ends at buffer stops below the best single choice (a dashed purple line and a diamond);
	 * The new results are stations past it, each with a name board on a post; their numbers big on the right.
	 * Fields: eyebrow, title, axes: { x, y }, xRange, yRange, line: { label, points }, best: { x, y, label },
	 * stations: [{ x, y, name, value, text }], note. */
	'grw-map': {
		css: css('grw-map'),
		render(s) {
			const H = bodyHeight(s);
			const [xa, xb] = s.xRange ?? [-100, 25], [ya, yb] = s.yRange ?? [20, 90];
			const X0 = 90, X1 = 1180, Y0 = H - 90, Y1 = 30;
			const X = v => X0 + ((v - xa) / (xb - xa)) * (X1 - X0), Y = v => Y0 - ((v - ya) / (yb - ya)) * (Y0 - Y1);
			let g = '', html = '';
			for (let v = xa; v <= xb; v += 25) {
				g += P(`M ${r1(X(v))} ${Y1} V ${Y0}`, 'var(--line)', 2);
				html += `<div class="grw-map-sm nolint" style="${at(X(v) - 40, Y0 + 10, 80)};font-size:20px;text-align:center;color:var(--muted)" data-t>${esc(`${v > 0 ? '+' : v < 0 ? '\u2212' : ''}${Math.abs(v)}%`)}</div>`;
			}
			for (let v = Math.ceil(ya / 20) * 20; v <= yb; v += 20) {
				g += P(`M ${X0} ${r1(Y(v))} H ${X1}`, 'var(--line)', 2);
				html += `<div class="grw-map-sm nolint" style="${at(X0 - 70, Y(v) - 13, 56)};font-size:20px;text-align:right;color:var(--muted)" data-t>${v}%</div>`;
			}
			g += P(`M ${X0} ${Y0} H ${X1} M ${X0} ${Y0} V ${Y1}`, 'var(--line-strong)', 3);
			const ax = s.axes ?? {};
			html += `<div class="grw-map-sm" style="${at(X1 - 520, Y0 + 44, 520)};font-size:20px;text-align:right;color:var(--muted)" data-t>${fmt(ax.x ?? '')}</div>`;
			html += `<div class="grw-map-sm" style="${at(X0 + 14, Y1 - 4, 420)};font-size:20px;color:var(--muted)" data-t>${fmt(ax.y ?? '')}</div>`;
			const pts = s.line?.points ?? [];
			if (pts.length > 1) {
				// A Catmull-Rom spline through the points, as cubic segments.
				const Q = pts.map(p => [X(p[0]), Y(p[1])]), at2 = i => Q[Math.max(0, Math.min(Q.length - 1, i))];
				const segs = [['M', Q[0][0], Q[0][1]]];
				for (let i = 0; i < Q.length - 1; i++) {
					const p0 = at2(i - 1), p1 = Q[i], p2 = Q[i + 1], p3 = at2(i + 2);
					segs.push(['C', p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]]);
				}
				const r = route(segs);
				g += track([r]);
				const e = r.pts[r.pts.length - 1], ang = (Math.atan2(e.ty, e.tx) * 180) / Math.PI;
				g += `<g transform="rotate(${r1(ang)} ${r1(e.x)} ${r1(e.y)}) translate(${r1(e.x)} ${r1(e.y)}) scale(0.42) translate(${r1(-e.x)} ${r1(-e.y)})">${bufferStop(e.x, e.y)}</g>`;
				const p0 = s.line.points[0], lx = X(p0[0]) + 70, ly = Y(p0[1]) + 40;
				g += signBoard(lx, ly, 230, 40, Y0 - 4, {}).svg;
				html += onBoard('grw-map-bd', { x: lx + 4, y: ly + 2, w: 222, h: 36 }, fmt(s.line.label ?? ''), 19);
			}
			const b = s.best;
			if (b) {
				g += P(`M ${X0} ${r1(Y(b.y))} H ${X1}`, 'var(--purple)', 3, ' stroke-dasharray="10 8"');
				g += `<path d="M ${r1(X(b.x))} ${r1(Y(b.y) - 20)} L ${r1(X(b.x) + 20)} ${r1(Y(b.y))} L ${r1(X(b.x))} ${r1(Y(b.y) + 20)} L ${r1(X(b.x) - 20)} ${r1(Y(b.y))} Z" fill="var(--purple)"/>`;
				html += `<div class="grw-map-sm" style="${at(X(b.x) - 360, Y(b.y) - 46, 330)};font-size:22px;font-weight:600;text-align:right;color:var(--purple)" data-t>${fmt(b.label ?? '')}</div>`;
			}
			(s.stations ?? []).forEach((st, i) => {
				const cx = X(st.x), cy = Y(st.y);
				g += P(`M ${r1(cx)} ${r1(cy)} V ${r1(cy - 54)}`, IRON, 3);
				const sb = signBoard(cx - 10, cy - 96, 230, 44, cy, { tone: 'green', head: 6, posts: false });
				g += sb.svg;
				g += C(cx, cy, 18, '#fff', ' stroke="var(--green)" stroke-width="7"') + C(cx, cy, 7, 'var(--green)');
				html += onBoard('grw-map-bd nolint', { x: cx - 6, y: cy - 90, w: 222, h: 36 }, fmt(st.name ?? ''), 20, ';color:var(--green)');
				const yy = 30 + i * 280;
				html += `<div class="grw-map-bd nolint" style="${at(1290, yy)};font-size:24px" data-t>${fmt(st.name ?? '')}</div>`;
				html += `<div class="grw-map-big nolint" style="${at(1290, yy + 40)};font-size:72px;color:var(--green)" data-t>${esc(st.value ?? '')}</div>`;
				html += `<div class="grw-map-sm" style="${at(1290, yy + 124, W - 1290)};font-size:23px" data-t>${fmt(st.text ?? '')}</div>`;
			});
			g += P(`M 1250 20 V ${H - 70}`, 'var(--line)', 3);
			if (s.note) html += `<div class="grw-map-sm" style="${at(1290, H - 50, W - 1290)};font-size:21px;color:var(--muted)" data-t>${fmt(s.note)}</div>`;
			return heading(s) + body(`<div class="grw-map" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The close, on a blue page: the line leaves the last halt and reaches a finished station (platform,
	 * canopy on columns, a name board with an optional logo) where your load's train stands; it runs on into the works
	 * for the next one: rails stop, sleepers go on, scaffolding stands round its board, and a site notice lists
	 * what it would replace. One line to remember at the bottom.
	 * Fields: eyebrow, title, from, task, station: { name, logo, sub, pill }, next: { name, sub, pill, replaces }, line. */
	'grw-next': {
		css: `${css('grw-next')}
.grw-next .grw-next-chip { font-size: 19px; color: var(--ink); padding: 3px 12px; border: 1.5px solid ${INK}; border-radius: 999px; text-decoration: line-through; white-space: nowrap; }
.grw-next .grw-next-line { position: absolute; font-size: 36px; font-weight: 600; color: #fff; white-space: nowrap; }
.grw-next .grw-next-line strong { color: #fff; font-weight: 800; text-decoration: underline; text-underline-offset: 8px; text-decoration-thickness: 3px; }
`,
		render(s) {
			const H = bodyHeight(s), yL = 520, hz = 250, xE = 1180;
			let g = horizon(0, W, hz, [[0, 500, 50, 20], [400, 1000, 70, 14], [900, 1400, 50, 20], [1300, W, 64, 14]], 'blue');
			// The halt behind (left), the finished station, the works (right).
			g += platform(0, 200, yL, { pal: 'blue' }).svg;
			const hs = signBoard(30, yL - 140, 150, 40, yL - 66, { pal: 'blue' });
			g += hs.svg;
			const pf = platform(300, 1060, yL, { pal: 'blue' });
			const cn = canopy(330, 1030, pf.top, 220, { tone: 'purple' });
			g += pf.svg + cn.svg;
			const st = s.station ?? {}, nt = s.next ?? {};
			const nb = signBoard(500, cn.y + 8, 380, 150, 0, { posts: false });
			g += P(`M 570 ${cn.y - 4} V ${cn.y + 8} M 810 ${cn.y - 4} V ${cn.y + 8}`, '#fff', 3) + nb.svg;
			g += track([route([['M', 0, yL], ['L', xE, yL]]), { r: route([['M', xE - 4, yL], ['L', W, yL]]), bare: true, op: 0.8 }], 'blue');
			g += bufferStop(xE, yL, { pal: 'night' });
			const T = grwTrain(400, yL, [{ kind: 'van' }, { kind: 'unit', w: 190, flip: true }, { kind: 'unit', w: 190 }], { k: 1, tone: 'purple' });
			g += T.svg;
			// The works: scaffolding round the planner's board, survey pegs along the sleepers.
			const sx = 1300, sw = 400, sy = 40, sg = yL - 40;
			for (const x of [sx, sx + sw / 2, sx + sw]) g += P(`M ${x} ${sg} V ${sy}`, '#fff', 6) + R(x - 12, sg - 4, 24, 6, '#fff');
			for (const y of [sy + 10, sy + 150, sg - 140]) g += P(`M ${sx - 10} ${y} H ${sx + sw + 10}`, '#fff', 6);
			g += P(`M ${sx} ${sy + 150} L ${sx + sw / 2} ${sg - 140} M ${sx + sw / 2} ${sy + 150} L ${sx + sw} ${sg - 140} M ${sx} ${sg - 140} L ${sx + sw / 2} ${sg} M ${sx + sw / 2} ${sg - 140} L ${sx + sw} ${sg}`, 'rgba(255,255,255,.6)', 3);
			const pb = signBoard(sx + 20, sy + 22, sw - 40, 116, 0, { posts: false });
			g += pb.svg;
			for (const x of [1260, 1420, 1580]) g += P(`M ${x} ${yL - 26} V ${yL - 6}`, '#fff', 3) + R(x - 4, yL - 32, 8, 8, 'var(--orange)');
			const site = signBoard(sx - 40, yL + 34, sw + 70, 100, H - 2, {});
			g += site.svg;
			let html = '';
			html += onBoard('grw-next-bd nolint', { x: 34, y: yL - 136, w: 142, h: 32 }, fmt(s.from ?? ''), 17);
			html += onBoard('grw-next-bd', { x: 510, y: cn.y + 14, w: 360, h: 54 }, `${st.logo ? logo(st.logo, 40) : ''}${fmt(st.name ?? '')}`, 40);
			if (st.sub) html += onBoard('grw-next-sm', { x: 510, y: cn.y + 70, w: 360, h: 28 }, fmt(st.sub), 20, ';display:flex;justify-content:center');
			if (st.pill) html += `<div style="position:absolute;${at(510, cn.y + 106, 360)};display:flex;justify-content:center">${pill({ ...st.pill, size: 's', white: true })}</div>`;
			if (s.task) html += onBoard('grw-next-bd nolint', T.plates[0], fmt(s.task), 16);
			html += `<div class="grw-next-bd" style="${at(sx + 30, sy + 30, sw - 60, 60)};font-size:34px;border:3px dashed ${INK};border-radius:4px;box-sizing:border-box" data-t data-on="#ffffff">${fmt(nt.name ?? '')}</div>`;
			if (nt.pill) html += `<div style="position:absolute;${at(sx + 30, sy + 98, sw - 60)};display:flex;justify-content:center">${pill({ ...nt.pill, size: 's', white: true })}</div>`;
			if (nt.sub) html += `<div class="grw-next-sm" style="${at(sx - 26, yL + 46)};font-size:20px" data-t data-on="#ffffff">${fmt(nt.sub)}</div>`;
			if (nt.replaces?.length) html += `<div style="position:absolute;${at(sx - 26, yL + 80, sw + 50)};display:flex;gap:8px;flex-wrap:nowrap">${nt.replaces.map(r => `<span class="grw-next-chip nolint" data-t data-on="#ffffff">${fmt(r)}</span>`).join('')}</div>`;
			if (s.line) html += `<div class="grw-next-line" style="${at(0, H - 56, W)}" data-t data-on="#0078d4">${fmt(s.line)}</div>`;
			return heading(s) + body(`<div class="grw-next" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},
};
