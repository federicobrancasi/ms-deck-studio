// A gallery for inspiration (the press-and-screens world): read it for technique: a machine with real mechanics, an app window that expands click by click, three conditions as one picture. A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as they are.
// Every visible word comes from the slide's fields; examples/code-walkthroughs-example.mjs shows them in a deck.
// One drawing style: 4 px outlines, 20 px corners, tinted fills, Fluent icons, no shadows, blur or filters.
// One object comes back across the deck: the front page (a masthead, a picture on top, one story per intent, a fold),
// always drawn by gwPage(). The answer in the chat reads like that page; a press prints it from a pull request's diff.
//   gw-cover-d:    the agent's press, side view with a cut-away window: the 20 files in a feed hopper, the paper path round
//                  two drums and through two roller pairs (belt and motor), the front page standing in the output tray
//   gw-tape:       the pull request as one strip of wire copy in file order; the pieces of one story lit up
//   gw-answer:     an Agents window answer, built in four clicks: prompt, media card, intent cards, folded steps
//   gw-sort-bands: the files sorted into intents as bands sized by lines, one intent lit
//   gw-shoot:      a camera filming two builds of the app, and the proof sheet where each claim gets its source
//   gw-proofs:     three front pages from trial runs, ticks under each, and the minutes they took
//   gw-player:     a full Agents window: the media card, the same card grown into a video player, then a deck player
//   gw-three:      three overlapping circles, one per condition; the card only where all three overlap
//   gw-inches:     a commit as strips of type, sized by lines: new files in blue, existing ones as grey stubs
//   gw-close:      a blue close with three front pages on a ledge (a video, slides, both)
import { W, asset, at, body, bodyHeight, esc, fmt, heading, ic, logo, mix, msLogo, pill, r1, STYLE, t, wob } from '../src/kit.mjs';

/** A brand mark, or a Fluent icon when the mark isn't in this checkout (the VS Code mark is local-only: see docs/designs.md). */
function brand(slug, size, color) {
	try {
		return logo(slug, size, color);
	} catch {
		return ic(slug === 'vscode' ? 'code' : 'apps', size, color ?? 'var(--blue)');
	}
}

const SW = STYLE.stroke;
const svg = (cls, w, h, inner, defs = '') => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>`;
const base = n => `.${n} { position: relative; width: ${W}px; }
.${n} .${n}-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-a { position: absolute; }
.${n} .${n}-ic { position: absolute; display: grid; place-items: center; }`;
const rect = (x, y, w, h, rx, fill, stroke = 'none', sw = SW, extra = '') => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(Math.max(0, w))}" height="${r1(Math.max(0, h))}" rx="${r1(rx)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
const line = (x1, y1, x2, y2, stroke, sw = SW, extra = '') => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`;
const circle = (cx, cy, r, fill, stroke = 'none', sw = SW, extra = '') => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
const img = (cls, src, x, y, w, h) => {
	const a = asset(src ?? '');
	return a ? `<img class="${cls}" src="${a}" alt="" style="${at(x, y, w, h)}">` : `<div class="${cls}" data-missing="${esc(src ?? '')}" style="${at(x, y, w, h)}"></div>`;
};
const icAt = (n, x, y, name, size, color) => `<span class="${n}-ic" style="${at(x - size / 2, y - size / 2, size, size)}">${ic(name, size, color)}</span>`;
const logoAt = (n, x, y, slug, size, color) => `<span class="${n}-ic" style="${at(x - size / 2, y - size / 2, size, size)}">${brand(slug, size, color)}</span>`;
/** A play mark: a white disc with a triangle. */
const playMark = (cx, cy, r, tone = 'blue') => circle(cx, cy, r, '#fff', `var(--${tone})`, SW)
	+ `<path d="M ${r1(cx - r * 0.3)} ${r1(cy - r * 0.42)} L ${r1(cx + r * 0.46)} ${r1(cy)} L ${r1(cx - r * 0.3)} ${r1(cy + r * 0.42)} Z" fill="var(--${tone})"/>`;

/** The front page, the deck's one recurring object: a sheet with a masthead, a picture on top (a video with a play mark,
 * or a slide), stories below it, each with a coloured rule like the real cards, and a fold crease near the bottom.
 * hi: indexes of stories drawn in blue (the rest grey), or 'all'. Returns SVG only. */
function gwPage(x, y, w, { h = w * 1.3, stories = 5, hi = 'all', picture = 'video', fold = true, stroke = 'var(--blue)', tone = 'blue' } = {}) {
	const pad = w * 0.075, mh = Math.max(7, w * 0.032), iw = w - 2 * pad;
	let g = rect(x, y, w, h, Math.max(8, w * 0.03), '#fff', stroke, SW);
	g += rect(x + pad, y + pad, iw * 0.46, mh, mh / 2, 'var(--ink)');
	g += rect(x + w - pad - iw * 0.18, y + pad + mh * 0.15, iw * 0.18, mh * 0.7, mh * 0.35, 'var(--line-strong)');
	const ry = y + pad + mh + w * 0.035;
	g += line(x + pad, ry, x + w - pad, ry, 'var(--line-strong)', Math.max(2, w * 0.006));
	const py = ry + w * 0.04, ph = h * 0.33;
	if (picture === 'both') {
		// Two cards stacked, as the chat shows them: the video first, then the slides.
		const hh = (ph - w * 0.03) / 2, dyb = py + hh + w * 0.03;
		g += rect(x + pad, py, iw, hh, w * 0.02, mix(tone, 16)) + playMark(x + pad + iw / 2, py + hh / 2, hh * 0.3, tone);
		g += rect(x + pad, dyb, iw, hh, w * 0.02, mix(tone, 12));
		g += rect(x + pad + iw * 0.3, dyb + hh * 0.16, iw * 0.4, hh * 0.68, w * 0.01, '#fff', `var(--${tone})`, Math.max(2, SW * 0.6));
		g += rect(x + pad + iw * 0.34, dyb + hh * 0.3, iw * 0.2, hh * 0.1, hh * 0.05, 'var(--ink)') + rect(x + pad + iw * 0.34, dyb + hh * 0.5, iw * 0.32, hh * 0.22, 2, mix(tone, 30));
	} else if (picture === 'deck') {
		g += rect(x + pad, py, iw, ph, w * 0.02, mix(tone, 12));
		const sx = x + pad + iw * 0.14, sw = iw * 0.72, sh = ph * 0.76, sy = py + (ph - sh) / 2;
		g += rect(sx, sy, sw, sh, w * 0.012, '#fff', `var(--${tone})`, Math.max(2, SW * 0.6));
		g += rect(sx + sw * 0.08, sy + sh * 0.2, sw * 0.5, sh * 0.1, sh * 0.05, 'var(--ink)');
		g += rect(sx + sw * 0.08, sy + sh * 0.44, sw * 0.38, sh * 0.34, sh * 0.04, mix(tone, 30));
		g += rect(sx + sw * 0.54, sy + sh * 0.44, sw * 0.38, sh * 0.34, sh * 0.04, mix(tone, 30));
		const ar = ph * 0.07, ay = py + ph / 2;
		g += `<path d="M ${r1(x + pad + iw * 0.08)} ${r1(ay - ar)} L ${r1(x + pad + iw * 0.08 - ar)} ${r1(ay)} L ${r1(x + pad + iw * 0.08)} ${r1(ay + ar)}" fill="none" stroke="var(--${tone})" stroke-width="${Math.max(2, SW * 0.7)}" stroke-linecap="round" stroke-linejoin="round"/>`;
		g += `<path d="M ${r1(x + w - pad - iw * 0.08)} ${r1(ay - ar)} L ${r1(x + w - pad - iw * 0.08 + ar)} ${r1(ay)} L ${r1(x + w - pad - iw * 0.08)} ${r1(ay + ar)}" fill="none" stroke="var(--${tone})" stroke-width="${Math.max(2, SW * 0.7)}" stroke-linecap="round" stroke-linejoin="round"/>`;
	} else {
		g += rect(x + pad, py, iw, ph, w * 0.02, mix(tone, 16));
		g += playMark(x + pad + iw / 2, py + ph * 0.46, Math.min(iw, ph) * 0.17, tone);
		const by = py + ph - ph * 0.1;
		g += line(x + pad + iw * 0.06, by, x + pad + iw * 0.94, by, '#fff', Math.max(3, ph * 0.035));
		g += line(x + pad + iw * 0.06, by, x + pad + iw * 0.4, by, `var(--${tone})`, Math.max(3, ph * 0.035));
	}
	const fy = fold ? y + h - pad * 0.95 - w * 0.03 : y + h - pad;
	const sy0 = py + ph + w * 0.05, sy1 = fold ? fy - w * 0.05 : fy, per = (sy1 - sy0) / stories;
	for (let i = 0; i < stories; i++) {
		const on = hi === 'all' || (Array.isArray(hi) && hi.includes(i));
		const sy = sy0 + i * per, sh = per * 0.74, lw = Math.max(4, w * 0.014);
		g += rect(x + pad, sy, lw, sh, lw / 2, on ? `var(--${tone})` : 'var(--connector)');
		const tx = x + pad + lw + w * 0.035, tw = x + w - pad - tx;
		const bh = Math.max(4, sh * 0.26);
		g += rect(tx, sy + sh * 0.06, tw * (0.5 + 0.25 * Math.abs(wob(i + 3))), bh, bh / 2, on ? 'var(--ink)' : 'var(--faint)');
		g += rect(tx, sy + sh * 0.56, tw * 0.94, bh * 0.7, bh * 0.35, 'var(--line-strong)');
	}
	if (fold) {
		g += line(x + 2, fy, x + w - 2, fy, 'var(--connector)', Math.max(2, w * 0.006), `stroke-dasharray="${r1(w * 0.03)} ${r1(w * 0.022)}"`);
		const cx = x + w / 2, cs = w * 0.03;
		g += `<path d="M ${r1(cx - cs)} ${r1(fy + w * 0.022)} L ${r1(cx)} ${r1(fy + w * 0.022 + cs * 0.8)} L ${r1(cx + cs)} ${r1(fy + w * 0.022)}" fill="none" stroke="var(--connector)" stroke-width="${Math.max(2, w * 0.007)}" stroke-linecap="round" stroke-linejoin="round"/>`;
	}
	return g;
}

/** A diff sheet: a page of code lines, some added (a + and a green bar), some removed (a − and a red bar). */
function gwDiff(x, y, w, h, { rows = 12, seed = 0 } = {}) {
	let g = rect(x, y, w, h, 12, '#fff', 'var(--neutral)', SW);
	const pad = w * 0.09, top = y + h * 0.16, step = (h - h * 0.16 - pad) / rows;
	g += rect(x + pad, y + pad * 0.8, w * 0.4, step * 0.34, step * 0.17, 'var(--ink)');
	for (let i = 0; i < rows; i++) {
		const k = (i * 7 + seed * 3) % 10, yy = top + i * step, kind = k < 4 ? 'add' : k === 4 || k === 7 ? 'del' : 'ctx';
		const bw = (w - 2 * pad - w * 0.1) * (0.35 + 0.6 * Math.abs(wob(i + seed * 5)));
		if (kind !== 'ctx') {
			g += rect(x + 3, yy - step * 0.18, w - 6, step * 0.72, 0, kind === 'add' ? mix('green', 12) : mix('red', 12));
			const sx = x + pad * 0.55, sy = yy + step * 0.18, sz = step * 0.16;
			g += line(sx - sz, sy, sx + sz, sy, `var(--${kind === 'add' ? 'green' : 'red'})`, 3);
			if (kind === 'add') g += line(sx, sy - sz, sx, sy + sz, 'var(--green)', 3);
		}
		g += rect(x + pad + w * 0.06, yy, bw, step * 0.36, step * 0.18, kind === 'add' ? 'var(--green)' : kind === 'del' ? 'var(--red)' : 'var(--line-strong)', 'none', 0, kind === 'ctx' ? '' : 'opacity=".55"');
	}
	return g;
}

/** The left column of a cover: eyebrow, title, one line, two people credited, pills. */
function coverText(s, n) {
	const people = (s.people ?? []).map(p => `<div class="${n}-who"><span class="${n}-av t-${p.tone ?? 'blue'}" data-t>${esc(p.initials)}</span><div><div class="${n}-name" data-t>${fmt(p.name)}</div><div class="${n}-role" data-t>${fmt(p.role ?? '')}</div></div></div>`).join('');
	const pills = s.pills ? `<div class="${n}-pills">${s.pills.map(pill).join('')}</div>` : '';
	const eye = s.eyeLogo ? `<div class="${n}-eye">${brand(s.eyeLogo, 34)}<div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div></div>` : `<div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div>`;
	return `<div class="tf-left ${n}-left">${eye}<div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${people ? `<div class="${n}-people">${people}</div>` : ''}${pills}</div>`;
}
const coverCss = n => `
.${n} { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.${n} .${n}-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-left { width: 800px; }
.${n} .${n}-a { position: absolute; }
.${n} .${n}-ic { position: absolute; display: grid; place-items: center; }
.${n} .${n}-people { margin-top: 44px; display: flex; flex-direction: column; gap: 18px; }
.${n} .${n}-who { display: flex; align-items: center; gap: 16px; }
.${n} .${n}-av { width: 48px; height: 48px; border-radius: 50%; background: var(--tint); color: var(--fg); display: grid; place-items: center; font-size: 20px; font-weight: 700; flex: none; }
.${n} .${n}-name { font-size: 25px; font-weight: 600; color: var(--ink); line-height: 1.2; }
.${n} .${n}-role { font-size: 21px; color: var(--body); line-height: 1.3; }
.${n} .${n}-pills { margin-top: 30px; display: flex; gap: 12px; }
.${n} .${n}-eye { display: flex; align-items: center; gap: 14px; }
.${n} .${n}-slip { font-family: var(--mono); font-size: 21px; font-weight: 600; color: var(--blue); white-space: nowrap; }
.${n} .${n}-cap { color: var(--muted); }
.${n} .${n}-slot { color: #fff; font-size: 14px; line-height: 20px; }
`;

/** A belt round two pulleys: the two outer tangent lines between circle (x1, y1, ra) and circle (x2, y2, rb). */
function belt(x1, y1, ra, x2, y2, rb, stroke) {
	const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.acos((ra - rb) / d);
	let g = '';
	for (const sgn of [1, -1]) {
		const t1 = a + sgn * b;
		g += line(x1 + ra * Math.cos(t1), y1 + ra * Math.sin(t1), x2 + rb * Math.cos(t1), y2 + rb * Math.sin(t1), stroke, 3);
	}
	return g;
}

/** The press, side elevation, standing on two legs on the floor. The pull request's diff leans in a feed hopper at the
 * back left and goes down through the input slot; a cut-away window shows the paper path: down, round a turn drum,
 * through two pairs of rollers, round a second drum and up out of the output slot, where the front page stands in the
 * output tray. level 1: the bare machine; 2: drive belt, motor, direction marks, a control panel, a crossbar; 3: the
 * agent's press (purple, GitHub Copilot nameplate), the paper changes from diff to print on its way through, earlier
 * pages in the tray, a drawn deck page on the front page; 4: as 3, with all 20 files stacked in the hopper and the five intents on
 * the panel's screen. Fields: prompt, inLabel, inCount (level 4), outLabel (level 4), agent. */
function coverDesign(n, level) {
	return {
		bare: true,
		css: `${coverCss(n)}
.${n} .${n}-in { display: flex; align-items: center; gap: 10px; }
.${n} .${n}-in .lbl { color: var(--ink); }
.${n} .${n}-lip { color: var(--fg); text-align: center; }
`,
		render(s) {
			const rich = level >= 3, tone = rich ? 'purple' : 'blue', T = `var(--${tone})`;
			const fy = 968, bx0 = 1030, bx1 = 1810, by0 = 650, by1 = 900, plateY = by0 - 24;
			const inX = 1160, outX = 1560, pw = 340, ph = 480;
			const wx0 = bx0 + 34, wx1 = 1652, wy0 = by0 + 30, wy1 = by1 - 56;
			let g = '', html = '';
			// The floor, and two legs with feet; a crossbar from level 2.
			g += line(960, fy, 1880, fy, 'var(--body)', SW * 1.5);
			const legW = 40, legs = [bx0 + 50, bx1 - 50 - legW];
			for (const lx of legs) g += rect(lx, by1 - 10, legW, fy - by1, 6, 'var(--body)') + rect(lx - 16, fy - 14, legW + 32, 14, 5, 'var(--body)');
			if (level >= 2) g += rect(legs[0] + legW - 2, fy - 44, legs[1] - legs[0] - legW + 4, 12, 5, 'var(--body)');
			// The feed hopper: a back plate and two side guides, leaning back; the diff (and, at level 4, the other 19
			// files behind it) rests on the plate, its foot in the input slot.
			const sw0 = 216, sh0 = 300;
			let hop = rect(inX - 130, plateY - 366, 260, 380, 18, 'var(--surface)', 'var(--body)', 3);
			if (level >= 4) {
				for (let i = 19; i >= 1; i--) hop += rect(inX - sw0 / 2 + i * 0.5, plateY + 12 - sh0 - i * 3.4, sw0, sh0, 10, '#fff', 'var(--connector)', 1.6);
			}
			hop += gwDiff(inX - sw0 / 2, plateY + 12 - sh0, sw0, sh0, { rows: 10, seed: 2 });
			g += `<g transform="rotate(-10 ${inX} ${plateY})">${hop}</g>`;
			// The hopper's front: a funnel standing on the top plate, narrowing to the slot; the sheets' feet are inside it.
			const hy = plateY - 92;
			g += `<path d="M ${inX - 172} ${hy} H ${inX + 150} L ${inX + 124} ${plateY + 2} H ${inX - 132} Z" fill="${mix(tone, 16)}" stroke="${T}" stroke-width="${SW}" stroke-linejoin="round"/>`;
			g += line(inX - 150, hy + 22, inX + 130, hy + 22, mix(tone, 45), 3);
			// The output tray: earlier pages behind (level 3+), today's front page, then the tray's front lip over its foot.
			const px = outX - pw / 2, py = plateY - 4 - ph;
			if (rich) {
				g += rect(px + 30, py - 22, pw, ph, 12, '#fff', 'var(--connector)', SW) + rect(px + 15, py - 11, pw, ph, 12, '#fff', 'var(--connector)', SW);
			}
			g += gwPage(px, py, pw, { h: ph, picture: rich ? 'deck' : 'video' });
			const tx0 = px - 28, tw = pw + 70;
			g += rect(tx0, plateY - 34, tw, 38, 12, '#fff', T, SW);
			if (level >= 4 && s.outLabel) html += t(`lbl ${n}-a ${n}-lip t-${tone}`, at(tx0 + 8, plateY - 26, tw - 16), fmt(s.outLabel), { nolint: true });
			// The body, and the top plate with the two slots.
			g += rect(bx0, by0, bx1 - bx0, by1 - by0, 26, mix(tone, rich ? 10 : 7), T, SW);
			g += rect(bx0 - 16, plateY, bx1 - bx0 + 32, 28, 12, T);
			g += rect(inX - 122, plateY + 9, 244, 9, 4.5, 'var(--ink)') + rect(px - 14, plateY + 9, pw + 28, 9, 4.5, 'var(--ink)');
			// The cut-away window and the paper path through it.
			g += rect(wx0, wy0, wx1 - wx0, wy1 - wy0, 16, '#fff', T, 3);
			const py0 = 770, rr = 38, d1 = inX + rr, d2 = outX - rr;
			const path = `M ${inX} ${wy0 + 2} V ${py0 - rr} A ${rr} ${rr} 0 0 0 ${d1} ${py0} H ${d2} A ${rr} ${rr} 0 0 0 ${outX} ${py0 - rr} V ${wy0 + 2}`;
			g += `<path d="${path}" fill="none" stroke="var(--connector)" stroke-width="16" stroke-linejoin="round"/><path d="${path}" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>`;
			if (rich) {
				const mid = 1345;
				const a = `M ${inX} ${wy0 + 2} V ${py0 - rr} A ${rr} ${rr} 0 0 0 ${d1} ${py0} H ${mid}`, b = `M ${mid} ${py0} H ${d2} A ${rr} ${rr} 0 0 0 ${outX} ${py0 - rr} V ${wy0 + 2}`;
				g += `<path d="${a}" fill="none" stroke="var(--green)" stroke-width="4" stroke-dasharray="12 8 0 0" opacity=".75"/><path d="${a}" fill="none" stroke="var(--red)" stroke-width="4" stroke-dasharray="0 46 8 10" opacity=".75"/>`;
				g += `<path d="${b}" fill="none" stroke="var(--blue)" stroke-width="4" stroke-dasharray="16 7" opacity=".8"/>`;
			}
			// Two turn drums inside the bends, and two pairs of rollers pinching the paper.
			for (const [cx, cy] of [[d1, py0 - rr], [d2, py0 - rr]]) g += circle(cx, cy, 29, mix(tone, 18), T, SW) + circle(cx, cy, 8, T) + circle(cx, cy, 3, '#fff');
			for (const rx of [1290, 1410]) {
				for (const cy of [py0 - 27, py0 + 27]) g += circle(rx, cy, 23, '#fff', T, SW) + circle(rx, cy, 7, T) + line(rx - 12, cy - 12, rx - 7, cy - 17, mix(tone, 45), 3);
			}
			const pulley = level >= 2 ? circle(1290, py0 + 27, 14, mix(tone, 30), T, 3) + circle(1290, py0 + 27, 4, T) : '';
			if (level >= 2) {
				// The drive: a belt over the pulleys of the drums and the upper rollers, a motor driving the lower ones.
				const mx = 1084, my = wy1 - 50, mpx = mx + 30, mpy = my + 14;
				g += rect(mx - 6, wy1 - 12, 72, 10, 3, 'var(--body)') + rect(mx, my, 60, 38, 8, mix(tone, 22), T, 3);
				g += belt(mpx, mpy, 9, 1290, py0 + 27, 14, T);
				g += circle(mpx, mpy, 9, T) + circle(mpx, mpy, 3, '#fff');
				g += pulley;
				// Direction marks on the paper.
				const chev = (x, y, dx, dy) => `<path d="M ${x - dy * 7 - dx * 5} ${y - dx * 7 - dy * 5} L ${x + dx * 4} ${y + dy * 4} L ${x + dy * 7 - dx * 5} ${y + dx * 7 - dy * 5}" fill="none" stroke="${T}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
				g += chev(inX, wy0 + 26, 0, 1) + chev(1350, py0, 1, 0) + chev(outX, wy0 + 26, 0, -1);
				// The control panel: a screen, a dial, a button.
				const cx0 = 1674, cw = bx1 - 34 - cx0;
				g += rect(cx0, wy0, cw, wy1 - wy0, 14, '#fff', T, 3);
				g += rect(cx0 + 12, wy0 + 12, cw - 24, 62, 8, 'var(--ink)');
				if (level >= 4) {
					for (let i = 0; i < 5; i++) g += rect(cx0 + 22, wy0 + 20 + i * 10, (cw - 44) * [0.5, 0.7, 1, 0.75, 0.4][i], 5, 2.5, i === 2 ? mix('blue', 70) : mix('blue', 35));
				} else if (rich) {
					g += rect(cx0 + 22, wy0 + 50, cw - 44, 8, 4, '#3a3a40') + rect(cx0 + 22, wy0 + 50, (cw - 44) * 0.6, 8, 4, mix('purple', 70));
				} else {
					g += circle(cx0 + 26, wy0 + 30, 5, mix('blue', 70));
					for (let i = 0; i < 3; i++) g += rect(cx0 + 38, wy0 + 26 + i * 13, (cw - 64) * [0.8, 0.6, 0.7][i], 6, 3, mix('blue', 45));
				}
				g += circle(cx0 + cw / 2, wy0 + 108, 18, '#fff', T, 3) + line(cx0 + cw / 2, wy0 + 108, cx0 + cw / 2 + 9, wy0 + 96, T, 3);
				g += circle(cx0 + cw / 2, wy0 + 146, 8, T);
			}
			// Under the window: vents (levels 1–2) or the agent's nameplate (3–4).
			if (rich) {
				html += logoAt(n, wx0 + 20, by1 - 28, 'githubcopilot', 30, 'var(--purple)');
				html += t(`lbl ${n}-a ${n}-cap`, at(wx0 + 44, by1 - 40, 260) + ';color:var(--purple)', fmt(s.agent ?? 'GitHub Copilot'), { nolint: true });
			} else if (level === 1) {
				for (let i = 0; i < 7; i++) g += rect(1680, wy0 + 14 + i * 22, bx1 - 34 - 1680, 10, 5, mix(tone, 30));
			}
			// The caption over the hopper: what goes in.
			const inText = level >= 4 && s.inCount ? `${s.inLabel ?? 'Pull request'}  \u00b7  ${s.inCount}` : (s.inLabel ?? 'Pull request');
			html += `<div class="${n}-a ${n}-in" style="${at(985, 196)}">${brand('github', 26, '#1b1b1f')}${t('lbl', '', fmt(inText), { tag: 'span', nolint: true })}</div>`;
			return `<div class="${n}">${svg(`${n}-svg`, 1920, 1080, g)}${coverText(s, n)}${html}${msLogo()}</div>`;
		},
	};
}

export const designs = {
	'gw-cover-d': coverDesign('gw-cover-d', 4),
	/** The pull request as one strip of wire copy, in path order, snaking over three rows: a piece per file, as long as
	 * the lines it adds; the pieces of one intent are lit blue, the rest white. Two big numbers on the left.
	 * Fields: eyebrow, title, pieces: [{ file, add, g, more }], hi (the intent to light), stats (2): [{ value, label, tone }],
	 * start: { text } (a label at the start of the tape), legend: { on, off }. */
	'gw-tape': {
		css: `${base('gw-tape')}
.gw-tape .gw-tape-big { font-size: 112px; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: var(--fg, var(--ink)); white-space: nowrap; }
.gw-tape .gw-tape-lab { font-size: 26px; line-height: 1.3; color: var(--body); }
.gw-tape .gw-tape-start { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gw-tape .gw-tape-key { display: flex; align-items: center; gap: 12px; font-size: 22px; color: var(--body); white-space: nowrap; }
.gw-tape .gw-tape-sw { width: 34px; height: 22px; border-radius: 5px; border: 3px solid var(--line-strong); flex: none; }
`,
		render(s) {
			const n = 'gw-tape', H = bodyHeight(s), pieces = s.pieces ?? [], hi = s.hi ?? 3;
			const x0 = 640, x1 = 1590, len = x1 - x0, rows = [140, 330, 520], th = 62, R = (rows[1] - rows[0]) / 2;
			const gap = 5, min = 18, total = pieces.reduce((a, p) => a + p.add, 0);
			// Pack whole pieces into the three rows, each piece as long as its lines: find the largest scale that fits.
			let k = (len * 3) / total, rowsOf;
			for (; k > 0.1; k *= 0.98) {
				rowsOf = [[]];
				let used = 0;
				for (const p of pieces) {
					const w = Math.max(min, p.add * k) + (used && !p.more ? gap : 0);
					if (used + w > len && !p.more) { rowsOf.push([]); used = 0; }
					rowsOf[rowsOf.length - 1].push(p);
					used += Math.max(min, p.add * k) + (rowsOf[rowsOf.length - 1].length > 1 && !p.more ? gap : 0);
				}
				if (rowsOf.length <= 3) break;
			}
			let g = '', html = '';
			const d = `M ${x0 - 40} ${rows[0]} H ${x1} A ${R} ${R} 0 0 1 ${x1} ${rows[1]} H ${x0} A ${R} ${R} 0 0 0 ${x0} ${rows[2]} H ${x1 + 30}`;
			g += `<path d="${d}" fill="none" stroke="var(--line-strong)" stroke-width="${th}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${th - 8}"/>`;
			let tear = `M ${x1 + 30} ${rows[2] - th / 2}`;
			for (let i = 1; i <= 6; i++) tear += ` L ${x1 + 30 + (i % 2 ? 10 : 0)} ${r1(rows[2] - th / 2 + i * th / 6)}`;
			g += `<path d="${tear} L ${x1 + 60} ${rows[2] + th / 2} V ${rows[2] - th / 2} Z" fill="#fff"/>`;
			g += `<path d="${tear}" fill="none" stroke="var(--line-strong)" stroke-width="3"/>`;
			rowsOf.forEach((rp, row) => {
				const y = rows[row];
				let off = 0;
				rp.forEach((p, i) => {
					if (i && !p.more) {
						const sxp = row === 1 ? x1 - off - gap / 2 : x0 + off + gap / 2;
						g += line(sxp, y - th / 2 + 4, sxp, y + th / 2 - 4, 'var(--connector)', 2.5);
						off += gap;
					}
					const w = Math.max(min, p.add * k), on = p.g === hi;
					const xa = row === 1 ? x1 - off - w : x0 + off;
					g += rect(xa, y - th / 2 + 6, w, th - 12, 3, on ? mix('blue', 26) : '#fff', on ? 'var(--blue)' : 'none', on ? 3 : 0);
					if (w > 26) {
						g += rect(xa + 7, y - 10, (w - 14) * 0.9, 6, 3, on ? 'var(--blue)' : 'var(--line-strong)');
						g += rect(xa + 7, y + 6, (w - 14) * 0.6, 6, 3, on ? 'var(--blue)' : 'var(--line-strong)', 'none', 0, 'opacity=".6"');
					}
					off += w;
				});
			});
			// The start of the tape: a clean cut with the pull request's name above it.
			g += line(x0 - 40, rows[0] - th / 2, x0 - 40, rows[0] + th / 2, 'var(--line-strong)', 3);
			const st = s.start ?? {};
			html += `<div class="${n}-a ${n}-start" style="${at(x0 - 40, rows[0] - th / 2 - 50)}">${brand('github', 28, '#1b1b1f')}${t('', '', fmt(st.text ?? 'Pull request'), { tag: 'span', nolint: true })}</div>`;
			const lg = s.legend ?? {};
			html += `<div class="${n}-a ${n}-key" style="${at(x0 - 40, H - 40)}"><span class="${n}-sw" style="background:${mix('blue', 26)};border-color:var(--blue)"></span>${t('', '', fmt(lg.on ?? 'One story'), { tag: 'span' })}<span style="width:28px"></span><span class="${n}-sw"></span>${t('', '', fmt(lg.off ?? 'The rest'), { tag: 'span' })}</div>`;
			(s.stats ?? []).slice(0, 2).forEach((st2, i) => {
				const y = i ? 330 : 40;
				html += t(`${n}-a ${n}-big t-${st2.tone ?? 'neutral'}`, at(0, y) + (st2.tone ? '' : ';color:var(--ink)'), esc(st2.value));
				html += t(`${n}-a ${n}-lab`, at(0, y + 120, 520), fmt(st2.label ?? ''));
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The answer in a drawn Agents window, built in four clicks: the prompt, the media card on top, one card per intent
	 * below it, and every other step folded into one line. A numbered note on the left names each part.
	 * Fields: eyebrow, title, window (title bar), prompt, media: { title, meta, button }, cards: [{ full, files, add, del }],
	 * folded (the folded line), parts (4): [{ title, sub }]. Clicks: 4. */
	'gw-answer': {
		clicks: true,
		css: `${base('gw-answer')}
.gw-answer .gw-answer-part { position: absolute; display: flex; gap: 18px; align-items: flex-start; }
.gw-answer .gw-answer-part.past { opacity: .42; }
.gw-answer .gw-answer-num { width: 44px; height: 44px; border-radius: 50%; background: var(--blue); color: #fff; display: grid; place-items: center; font-size: 22px; font-weight: 700; flex: none; }
.gw-answer .gw-answer-pt { font-size: 30px; font-weight: 600; color: var(--ink); line-height: 1.2; white-space: nowrap; }
.gw-answer .gw-answer-ps { font-size: 23px; color: var(--body); line-height: 1.3; margin-top: 4px; white-space: nowrap; }
.gw-answer .gw-answer-win { font-size: 18px; font-weight: 600; color: var(--body); white-space: nowrap; }
.gw-answer .gw-answer-prompt { font-family: var(--mono); font-size: 19px; color: var(--ink); white-space: nowrap; }
.gw-answer .gw-answer-prompt b { color: var(--blue); font-weight: 600; }
.gw-answer .gw-answer-mt { font-size: 21px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; }
.gw-answer .gw-answer-mm { font-size: 17px; color: var(--muted); white-space: nowrap; }
.gw-answer .gw-answer-btn { font-size: 17px; font-weight: 600; color: #fff; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
.gw-answer .gw-answer-ct { font-size: 19px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gw-answer .gw-answer-cs { font-family: var(--mono); font-size: 17px; color: var(--muted); white-space: nowrap; text-align: right; }
.gw-answer .gw-answer-cs .add { color: var(--green); } .gw-answer .gw-answer-cs .del { color: var(--red); }
.gw-answer .gw-answer-fold { font-size: 19px; color: var(--body); white-space: nowrap; display: flex; align-items: center; gap: 8px; }
.gw-answer .gw-answer-hide { visibility: hidden; }
`,
		render(s, ctx = {}) {
			const n = 'gw-answer', H = bodyHeight(s), step = ctx.step ?? 4;
			const wx = 600, ww = W - wx, top = 0, bar = 46;
			const cx0 = wx + 40, cx1 = W - 40;
			let g = '', html = '';
			const show = i => step >= i;
			const vis = i => (show(i) ? '' : ` ${n}-hide`);
			// The window.
			g += rect(wx, top, ww, H, STYLE.radius, '#fff', 'var(--ink)', SW);
			g += `<path d="M ${wx} ${top + bar} V ${top + STYLE.radius} Q ${wx} ${top} ${wx + STYLE.radius} ${top} H ${W - STYLE.radius} Q ${W} ${top} ${W} ${top + STYLE.radius} V ${top + bar} Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}"/>`;
			html += logoAt(n, wx + 34, top + bar / 2, 'vscode', 26);
			html += t(`${n}-a ${n}-win`, at(wx + 60, top + 11, 400), fmt(s.window ?? 'Agents window'), { nolint: true });
			// 1. The prompt, right-aligned like a sent message.
			const py = top + bar + 24, ph = 50;
			const pText = esc(s.prompt ?? '').replace(/^(\/\S+)/, '<b>$1</b>');
			const pw2 = 640;
			g += `<g class="${show(1) ? '' : `${n}-hide`}">${rect(cx1 - pw2, py, pw2, ph, 12, 'var(--surface)', 'var(--line-strong)', 2)}</g>`;
			html += t(`${n}-a ${n}-prompt${vis(1)}`, at(cx1 - pw2 + 20, py + 13, pw2 - 30), pText, { nolint: true });
			// 2. The media card: a picture with a play mark, the title, its details and a Play button.
			const my = py + ph + 22, mh = 150, mw = cx1 - cx0;
			let mg = rect(cx0, my, mw, mh, 14, '#fff', 'var(--blue)', SW);
			const tx = cx0 + 16, ty = my + 16, tw = 210, tth = mh - 32;
			mg += rect(tx, ty, tw, tth, 8, mix('blue', 12));
			mg += rect(tx + 18, ty + 22, tw * 0.55, 10, 5, 'var(--ink)') + rect(tx + 18, ty + 42, tw * 0.4, 7, 3.5, 'var(--line-strong)');
			mg += playMark(tx + tw / 2, ty + tth * 0.62, 22);
			const bx = tx + tw + 26;
			mg += rect(bx, my + 92, 136, 38, 8, 'var(--blue)');
			g += `<g class="${show(2) ? '' : `${n}-hide`}">${mg}</g>`;
			const m = s.media ?? {};
			html += t(`${n}-a ${n}-mt${vis(2)}`, at(bx, my + 22, cx1 - bx - 20), fmt(m.title ?? ''), { nolint: true });
			html += t(`${n}-a ${n}-mm${vis(2)}`, at(bx, my + 56, cx1 - bx - 20), fmt(m.meta ?? ''), { nolint: true });
			html += `<div class="${n}-a ${n}-btn${vis(2)}" style="${at(bx + 16, my + 100)}">${ic('play', 18)}${t('', '', fmt(m.button ?? 'Play Video'), { tag: 'span', nolint: true })}</div>`;
			// 3. One card per intent.
			const cards = s.cards ?? [], cy0 = my + mh + 18, ch = 50, cg = 10;
			let cgSvg = '';
			cards.forEach((c, i) => {
				const y = cy0 + i * (ch + cg);
				cgSvg += rect(cx0, y, mw, ch, 10, '#fff', 'var(--line-strong)', 2) + rect(cx0 + 2, y + 8, 6, ch - 16, 3, 'var(--blue)');
				html += t(`${n}-a ${n}-ct${vis(3)}`, at(cx0 + 24, y + 12, mw - 260), fmt(c.full ?? c.title), { nolint: true });
				html += t(`${n}-a ${n}-cs${vis(3)}`, at(cx1 - 230, y + 14, 214), `${c.files} files <span class="add">+${c.add}</span> ${c.del ? `<span class="del">\u2212${c.del}</span>` : '<span>\u22120</span>'}`, { nolint: true });
			});
			g += `<g class="${show(3) ? '' : `${n}-hide`}">${cgSvg}</g>`;
			// 4. Everything else, folded into one line.
			const fy = cy0 + cards.length * (ch + cg) + 18;
			g += `<g class="${show(4) ? '' : `${n}-hide`}">${line(wx + 4, fy - 8, W - 4, fy - 8, 'var(--connector)', 2.5, 'stroke-dasharray="14 10"')}</g>`;
			html += `<div class="${n}-a ${n}-fold${vis(4)}" style="${at(cx0 + 4, fy)}">${ic('checkmark', 22)}${t('', '', fmt(s.folded ?? ''), { tag: 'span', nolint: true })}${ic('arrowDown', 18)}</div>`;
			// The notes on the left, one per click, level with the part they name.
			const ys = [py + ph / 2, my + mh / 2, cy0 + (cards.length * (ch + cg)) / 2, fy + 14];
			const ends = [wx - 10, cx0 - 8, cx0 - 8, cx0 - 6];
			(s.parts ?? []).slice(0, 4).forEach((p, i) => {
				const y = ys[i] - 26, state = step === i + 1 || step >= 4 ? '' : step > i + 1 ? ' past' : ` ${n}-hide`;
				html += `<div class="${n}-part${state}" data-key="part-${i}" style="${at(0, y, 540)}"><span class="${n}-num">${i + 1}</span><div>${t(`${n}-pt`, '', fmt(p.title))}${p.sub ? t(`${n}-ps`, '', fmt(p.sub)) : ''}</div></div>`;
				if (!state.includes('hide')) g += line(62 + String(p.title).length * 15 + 24, ys[i], ends[i], ys[i], 'var(--connector)', 3, 'stroke-dasharray="3 9"');
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** Sorting by intent, as bands: the pieces of the pull request in path order on the left, one card per intent in
	 * review order on the right, and a band from every piece to its intent, as wide as its lines. One intent is lit.
	 * Fields: eyebrow, title, pieces, groups: [{ title, files, add }], hi, left, right (small-caps labels), skill (a pill). */
	'gw-sort-bands': {
		css: `${base('gw-sort-bands')}
.gw-sort-bands .gw-sort-bands-ct { font-size: 22px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gw-sort-bands .gw-sort-bands-cs { font-family: var(--mono); font-size: 18px; color: var(--muted); white-space: nowrap; text-align: right; }
.gw-sort-bands .gw-sort-bands-cs.on, .gw-sort-bands .gw-sort-bands-ct.on { color: var(--blue); }
.gw-sort-bands .gw-sort-bands-num { font-size: 20px; font-weight: 700; color: var(--muted); }
.gw-sort-bands .gw-sort-bands-num.on { color: var(--blue); }
`,
		render(s) {
			const n = 'gw-sort-bands', H = bodyHeight(s), pieces = s.pieces ?? [], groups = s.groups ?? [], hi = s.hi ?? 3;
			const top = 64, avail = H - top - 4, gapL = 4, minL = 4, cardMin = 58, gapR = 14, pad = 10;
			const lx0 = 150, lx1 = 250, rx0 = 1150, rx1 = W;
			let k = 0.4, cards;
			for (; k > 0.05; k -= 0.005) {
				const leftH = pieces.reduce((a, p, i) => a + minL + p.add * k + (i && !p.more ? gapL : 0), 0);
				cards = groups.map((gr, j) => {
					const span = pieces.filter(p => p.g === j + 1).reduce((a, p) => a + minL + p.add * k, 0);
					return { span, h: Math.max(cardMin, span + 2 * pad) };
				});
				const rightH = cards.reduce((a, c) => a + c.h, 0) + gapR * (groups.length - 1);
				if (leftH <= avail && rightH <= avail) break;
			}
			let g = '', html = '', y = top;
			const left = pieces.map((p, i) => {
				if (i && !p.more) y += gapL;
				const a = y, h = minL + p.add * k;
				y += h;
				return { a, b: a + h };
			});
			let cy = top;
			cards.forEach(c => { c.y = cy; c.next = cy + (c.h - c.span) / 2; cy += c.h + gapR; });
			// Bands first (grey under blue), then the slips and the cards over them.
			let grey = '', blue = '';
			pieces.forEach((p, i) => {
				const c = cards[p.g - 1], h = minL + p.add * k, a1 = c.next;
				c.next += h;
				const b = `<path d="M ${lx1} ${r1(left[i].a)} C ${r1((lx1 + rx0) / 2)} ${r1(left[i].a)} ${r1((lx1 + rx0) / 2)} ${r1(a1)} ${rx0} ${r1(a1)} L ${rx0} ${r1(a1 + h)} C ${r1((lx1 + rx0) / 2)} ${r1(a1 + h)} ${r1((lx1 + rx0) / 2)} ${r1(left[i].b)} ${lx1} ${r1(left[i].b)} Z"`;
				if (p.g === hi) blue += `${b} fill="${mix('blue', 34)}" stroke="${mix('blue', 34)}" stroke-width="3"/>`;
				else grey += `${b} fill="var(--connector)" opacity=".38"/>`;
			});
			g += grey + blue;
			pieces.forEach((p, i) => {
				const on = p.g === hi;
				g += rect(lx0, left[i].a, lx1 - lx0, left[i].b - left[i].a, 2, on ? 'var(--blue)' : '#fff', on ? 'var(--blue)' : 'var(--neutral)', 2);
			});
			groups.forEach((gr, j) => {
				const c = cards[j], on = j + 1 === hi, cls = on ? ' on' : '';
				g += rect(rx0, c.y, rx1 - rx0, c.h, 12, '#fff', on ? 'var(--blue)' : 'var(--line-strong)', on ? SW : 2.5);
				g += rect(rx0 + 2, c.y + 8, 7, c.h - 16, 3.5, on ? 'var(--blue)' : 'var(--connector)');
				const ty = c.y + c.h / 2 - 15;
				html += t(`${n}-a ${n}-num${cls}`, at(rx0 + 26, ty + 1, 24), String(j + 1), { nolint: true });
				html += t(`${n}-a ${n}-ct${cls}`, at(rx0 + 56, ty, 270), fmt(gr.title), { nolint: true });
				html += t(`${n}-a ${n}-cs${cls}`, at(rx1 - 230, ty + 3, 210), `+${Number(gr.add).toLocaleString('en-US')} \u00b7 ${gr.files} files`, { nolint: true });
			});
			html += t(`lbl ${n}-a`, at(lx0 - 20, 14, 400), fmt(s.left ?? 'Files, path order'), { nolint: true });
			html += t(`lbl ${n}-a`, at(rx0, 14, 560), fmt(s.right ?? 'Intents, review order'), { nolint: true });
			if (s.skill) html += `<div class="${n}-a" style="${at(560, 4)}">${pill({ text: s.skill, tone: 'purple', icon: 'sort' })}</div>`;
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Filming the real app: two monitors on a desk, the build before and after the change; the agent's camera on a tripod
	 * takes in both; beside it, the proof sheet where every claim carries its source, with a tick.
	 * Fields: eyebrow, title, before, after: { label }, camera: { label }, proofs: [{ src }], stats (2): [{ value, label }]. */
	'gw-shoot': {
		css: `${base('gw-shoot')}
.gw-shoot .gw-shoot-tag { font-family: var(--mono); font-size: 18px; color: var(--body); white-space: nowrap; }
.gw-shoot .gw-shoot-big { font-size: 80px; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: var(--ink); white-space: nowrap; }
.gw-shoot .gw-shoot-lab { font-size: 24px; color: var(--body); line-height: 1.25; }
.gw-shoot .gw-shoot-cam { font-size: 20px; font-weight: 600; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const n = 'gw-shoot', H = bodyHeight(s);
			let g = '', html = '';
			const deskY = 530, fy = H - 4;
			// The desk, with two monitors on stands.
			g += line(0, fy, 1150, fy, 'var(--body)', SW * 1.5);
			const cx = 1040, cy = 300, lensX = cx - 104, sw0 = 420, sh0 = 360, sy = deskY - 60 - sh0;
			g += `<path d="M ${lensX} ${cy - 6} L 886 ${sy + 16} L 886 ${sy + sh0 - 16} L ${lensX} ${cy + 14} Z" fill="${mix('neutral', 10)}"/>`;
			g += rect(0, deskY, 900, 18, 6, 'var(--body)');
			g += rect(30, deskY + 18, 22, fy - deskY - 18, 4, 'var(--body)') + rect(850, deskY + 18, 22, fy - deskY - 18, 4, 'var(--body)');
			const scr = (x, after) => {
				const sw = sw0, sh = sh0, sy = deskY - 60 - sh;
				let m = rect(x + sw / 2 - 14, sy + sh, 28, 46, 0, 'var(--body)') + rect(x + sw / 2 - 70, deskY - 16, 140, 16, 6, 'var(--body)');
				m += rect(x, sy, sw, sh, 14, '#fff', 'var(--ink)', SW);
				m += rect(x + 2, sy + 2, sw - 4, 30, 12, 'var(--surface)') + line(x, sy + 32, x + sw, sy + 32, 'var(--ink)', 2);
				const ex = x + 18, ew = after ? sw - 150 : sw - 36, ey = sy + 46;
				for (let i = 0; i < 7; i++) {
					const kind = [0, 1, 0, 2, 2, 0, 1][i];
					const fill = kind === 1 ? mix('red', 18) : kind === 2 ? mix('green', 18) : 'none';
					if (kind) m += rect(ex, ey + i * 28, ew, 24, 3, fill);
					m += rect(ex + 10, ey + i * 28 + 9, ew * (0.4 + 0.4 * Math.abs(wob(i + (after ? 2 : 0)))), 7, 3.5, kind === 1 ? 'var(--red)' : kind === 2 ? 'var(--green)' : 'var(--line-strong)', 'none', 0, kind ? 'opacity=".55"' : '');
				}
				if (after) {
					const lx = x + sw - 120;
					m += rect(lx, sy + 40, 104, sh - 56, 8, mix('blue', 10), 'var(--blue)', 3);
					for (let i = 0; i < 6; i++) m += rect(lx + 12, sy + 56 + i * 30, i === 2 ? 80 : 66, 9, 4.5, i === 2 ? 'var(--blue)' : mix('blue', 40));
				}
				return m;
			};
			g += scr(20, false) + scr(470, true);
			g += line(lensX, cy - 6, 892, sy + 16, 'var(--body)', 2, 'stroke-dasharray="4 10"') + line(lensX, cy + 14, 892, sy + sh0 - 16, 'var(--body)', 2, 'stroke-dasharray="4 10"');
			const b = s.before ?? {}, a = s.after ?? {};
			html += `<div class="${n}-a" style="${at(20, 52)}">${pill({ text: b.label ?? 'Before', tone: 'neutral', icon: 'history', size: 's' })}</div>`;
			html += `<div class="${n}-a" style="${at(490, 52)}">${pill({ text: a.label ?? 'After', tone: 'blue', icon: 'checkmark', size: 's' })}</div>`;
			// The agent's camera on a tripod at the right of the desk, facing the screens; its view starts at the lens.
			g += line(cx, cy + 50, cx - 70, fy, 'var(--body)', SW) + line(cx, cy + 50, cx + 70, fy, 'var(--body)', SW) + line(cx, cy + 50, cx, fy, 'var(--body)', SW);
			g += rect(cx - 40, cy - 64, 56, 22, 6, 'var(--body)');
			g += rect(cx - 60, cy - 44, 130, 96, 14, '#fff', 'var(--body)', SW);
			g += rect(lensX + 8, cy - 30, cx - 60 - lensX - 8, 64, 8, mix('neutral', 18), 'var(--body)', SW);
			g += `<ellipse cx="${lensX + 8}" cy="${cy + 2}" rx="9" ry="32" fill="${mix('blue', 30)}" stroke="var(--body)" stroke-width="${SW}"/>`;
			g += circle(cx + 46, cy - 22, 8, 'var(--blue)');
			g += rect(cx - 36, cy - 20, 76, 50, 8, mix('neutral', 10), 'var(--body)', 3);
			html += t(`${n}-a ${n}-cam`, at(cx - 90, cy - 112, 200) + ';text-align:center', fmt((s.camera ?? {}).label ?? 'Playwright'), { nolint: true });
			// The proof sheet: each claim a line of text with its source and a tick.
			const px = 1240, py = 60, pw = W - px, ph = 370;
			g += rect(px, py, pw, ph, 14, '#fff', 'var(--neutral)', SW);
			html += t(`lbl ${n}-a`, at(px + 28, py + 24, pw - 56), fmt(s.sheet ?? 'Every claim, sourced'), { nolint: true });
			(s.proofs ?? []).slice(0, 4).forEach((p, i) => {
				const y = py + 74 + i * 72;
				g += rect(px + 28, y + 4, pw * 0.3, 9, 4.5, 'var(--line-strong)') + rect(px + 28, y + 24, pw * 0.22, 9, 4.5, 'var(--line-strong)');
				g += circle(px + pw - 44, y + 18, 17, 'var(--green)');
				g += `<path d="M ${px + pw - 52} ${y + 18} l 6 6 l 11 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
				html += t(`${n}-a ${n}-tag`, at(px + 28 + pw * 0.4, y + 4, pw * 0.6 - 100), fmt(p.src), { nolint: true });
			});
			(s.stats ?? []).slice(0, 2).forEach((st, i) => {
				const x = px + i * (pw / 2);
				html += t(`${n}-a ${n}-big`, at(x, 540), esc(st.value));
				html += t(`${n}-a ${n}-lab`, at(x, 636, pw / 2 - 20), fmt(st.label ?? ''));
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Trial runs: three front pages, one per kind of pull request, with a row of ticks under each (the checks each
	 * passed), and on the right the minutes each took, with the range.
	 * Fields: eyebrow, title, runs (3): [{ label, picture, answers, of }], times: [{ value, unit, label, from, to, max }]. */
	'gw-proofs': {
		css: `${base('gw-proofs')}
.gw-proofs .gw-proofs-lab { font-size: 24px; font-weight: 600; color: var(--ink); white-space: nowrap; text-align: center; }
.gw-proofs .gw-proofs-of { font-size: 22px; font-weight: 600; color: var(--green); white-space: nowrap; text-align: center; }
.gw-proofs .gw-proofs-big { font-size: 96px; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: var(--ink); white-space: nowrap; }
.gw-proofs .gw-proofs-big small { font-size: 36px; letter-spacing: 0; margin-left: 8px; color: var(--body); }
.gw-proofs .gw-proofs-tl { font-size: 23px; color: var(--body); white-space: nowrap; }
.gw-proofs .gw-proofs-ax { font-family: var(--mono); font-size: 17px; color: var(--muted); white-space: nowrap; }
`,
		render(s) {
			const n = 'gw-proofs', H = bodyHeight(s);
			let g = '', html = '';
			const runs = (s.runs ?? []).slice(0, 3), colW = 360, pw = 250, ph = 330;
			runs.forEach((r, i) => {
				const cx = i * colW + colW / 2, x = cx - pw / 2, y = 100;
				html += t(`${n}-a ${n}-lab`, at(cx - colW / 2, 40, colW), fmt(r.label));
				g += rect(x + 14, y + 10, pw, ph, 10, '#fff', 'var(--connector)', SW);
				g += gwPage(x, y, pw, { h: ph, picture: r.picture ?? 'video' });
				const of = r.of ?? 6, got = r.answers ?? of, dx = 38, ty = y + ph + 60;
				for (let k = 0; k < of; k++) {
					const tx = cx - ((of - 1) * dx) / 2 + k * dx;
					g += circle(tx, ty, 15, k < got ? 'var(--green)' : '#fff', 'var(--green)', 3);
					if (k < got) g += `<path d="M ${tx - 7} ${ty} l 5 5 l 9 -10" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
				}
				html += t(`${n}-a ${n}-of`, at(cx - colW / 2, ty + 28, colW), `${got} of ${of} ${esc(r.ofLabel ?? '')}`, { nolint: true });
			});
			g += line(1130, 0, 1130, H, 'var(--line)', 2);
			(s.times ?? []).slice(0, 2).forEach((tm, i) => {
				const x = 1200, y = 40 + i * 320, bw = W - x - 20;
				html += t(`${n}-a ${n}-big`, at(x, y), `${esc(tm.value)}<small>${esc(tm.unit ?? 'min')}</small>`);
				html += t(`${n}-a ${n}-tl`, at(x, y + 104, bw), fmt(tm.label ?? ''));
				if (tm.from != null) {
					const max = tm.max ?? 30, X = v => x + (v / max) * bw, ly = y + 186;
					g += line(x, ly, x + bw, ly, 'var(--track)', 10);
					g += line(X(tm.from), ly, X(tm.to), ly, mix('blue', 45), 10);
					g += circle(X(Number(tm.value)), ly, 13, 'var(--blue)', '#fff', 3);
					html += t(`${n}-a ${n}-ax`, at(X(tm.from) - 30, ly + 18, 60) + ';text-align:center', `${tm.from}`, { nolint: true });
					html += t(`${n}-a ${n}-ax`, at(X(tm.to) - 30, ly + 18, 60) + ';text-align:center', `${tm.to}`, { nolint: true });
				}
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** The media preview in a full Agents window (sessions on the left, the chat in the middle, the diff an intent card
	 * opens on the right), in three clicks: the compact card at the top of the answer with the intent cards below it;
	 * the same frame grown to the chat's full width as a video player (the card's old outline and an arrow show the
	 * growth; the intent cards slide down under it); the same frame as a deck player with arrows and thumbnails.
	 * Fields: eyebrow, title, window, sidebar, prompts (3), media: { title, meta, button }, cards, folded, input,
	 * video: { time }, deck: { pages: [src], current (1-based) }, side (the diff tab's title). Clicks: 3. */
	'gw-player': {
		clicks: true,
		css: `${base('gw-player')}
.gw-player .gw-player-win { font-size: 17px; font-weight: 600; color: var(--body); white-space: nowrap; }
.gw-player .gw-player-prompt { font-family: var(--mono); font-size: 16px; color: var(--ink); white-space: nowrap; }
.gw-player .gw-player-prompt b { color: var(--blue); font-weight: 600; }
.gw-player .gw-player-mt { font-size: 17px; font-weight: 600; color: var(--ink); line-height: 1.3; }
.gw-player .gw-player-mm { font-size: 14px; color: var(--muted); white-space: nowrap; }
.gw-player .gw-player-btn { font-size: 15px; font-weight: 600; color: #fff; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
.gw-player .gw-player-ct { font-size: 15px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gw-player .gw-player-cs { font-family: var(--mono); font-size: 14px; color: var(--muted); white-space: nowrap; text-align: right; }
.gw-player .gw-player-cs .add { color: var(--green); } .gw-player .gw-player-cs .del { color: var(--red); }
.gw-player .gw-player-fold { font-size: 14px; color: var(--body); white-space: nowrap; display: flex; align-items: center; gap: 6px; }
.gw-player .gw-player-time { font-family: var(--mono); font-size: 14px; color: #fff; white-space: nowrap; }
.gw-player .gw-player-count { font-family: var(--mono); font-size: 14px; white-space: nowrap; }
.gw-player .gw-player-ph { font-size: 15px; color: var(--muted); white-space: nowrap; }
.gw-player .gw-player-side { font-size: 14px; font-weight: 600; color: var(--body); white-space: nowrap; }
.gw-player .gw-player-shot { position: absolute; display: block; object-fit: cover; border-radius: 4px; }
.gw-player .gw-player-ov { position: absolute; overflow: visible; }
.gw-player .gw-player-it { font-size: 15px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gw-player .gw-player-count { background: rgba(27,27,31,.72); color: #fff; border-radius: 6px; padding: 2px 0; text-align: center; }
`,
		render(s, ctx = {}) {
			const n = 'gw-player', H = bodyHeight(s), step = ctx.step ?? 3;
			const bar = 40, stH = 24, sbW = 290, pad = 28, cw = 720;
			const chat0 = sbW, cx0 = chat0 + pad, cx1 = cx0 + cw, chat1 = cx1 + pad;
			let g = '', html = '';
			// The window: frame, title bar with its three controls and the VS Code mark, a status bar.
			g += rect(0, 0, W, H, 14, '#fff', 'var(--ink)', 3);
			g += `<path d="M 1.5 ${bar} V 14 Q 1.5 1.5 14 1.5 H ${W - 14} Q ${W - 1.5} 1.5 ${W - 1.5} 14 V ${bar} Z" fill="var(--surface)"/>` + line(0, bar, W, bar, 'var(--line-strong)', 2);
			for (let i = 0; i < 3; i++) g += circle(24 + i * 22, bar / 2, 6.5, 'var(--line-strong)');
			html += logoAt(n, 112, bar / 2, 'vscode', 22);
			html += t(`${n}-a ${n}-win`, at(132, 9, 400), fmt(s.window ?? 'Agents window'), { nolint: true });
			g += `<path d="M 1.5 ${H - stH} H ${W - 1.5} V ${H - 14} Q ${W - 1.5} ${H - 1.5} ${W - 14} ${H - 1.5} H 14 Q 1.5 ${H - 1.5} 1.5 ${H - 14} Z" fill="var(--surface)"/>` + line(0, H - stH, W, H - stH, 'var(--line-strong)', 2);
			for (const [x, w] of [[20, 70], [104, 46], [W - 220, 60], [W - 140, 90]]) g += rect(x, H - stH + 9, w, 6, 3, 'var(--faint)');
			// The sessions list: a header and rows; this run's session lit (the slides run is another session).
			const active = step === 3 ? 1 : 0;
			g += rect(1.5, bar + 1, sbW - 1.5, H - bar - stH - 2, 0, 'var(--surface-2)') + line(sbW, bar, sbW, H - stH, 'var(--line-strong)', 2);
			html += t(`lbl ${n}-a`, at(22, bar + 18, 240), fmt(s.sidebar ?? 'Sessions'), { nolint: true });
			for (let i = 0; i < 9; i++) {
				const y = bar + 54 + i * 60, on = i === active;
				if (on) g += rect(10, y - 6, sbW - 20, 52, 8, 'var(--blue-tint)') + rect(10, y + 6, 4, 28, 2, 'var(--blue)');
				g += circle(36, y + 20, 9, on ? 'var(--blue)' : 'var(--line-strong)');
				g += rect(56, y + 8, (sbW - 90) * (0.55 + 0.35 * Math.abs(wob(i + 2))), 9, 4.5, on ? 'var(--ink)' : 'var(--faint)');
				g += rect(56, y + 26, (sbW - 90) * (0.35 + 0.25 * Math.abs(wob(i + 9))), 7, 3.5, 'var(--line-strong)');
			}
			// Beside the chat: the multi-file diff an intent card opened, named after its group; muted context.
			const r0 = chat1;
			g += line(r0, bar, r0, H - stH, 'var(--line-strong)', 2);
			g += rect(r0 + 1, bar + 1, W - r0 - 2.5, 38, 0, 'var(--surface)') + line(r0, bar + 40, W, bar + 40, 'var(--line)', 2);
			g += rect(r0 + 1, bar + 1, 520, 39, 0, '#fff') + line(r0 + 1, bar + 2, r0 + 520, bar + 2, 'var(--blue)', 3);
			html += t(`${n}-a ${n}-side`, at(r0 + 18, bar + 11, 490), fmt(s.side ?? ''), { nolint: true });
			let dy = bar + 56;
			for (const block of [[0, 2, 2, 0, 1, 2, 2], [0, 2, 2, 2, 0], [0, 1, 2, 0]]) {
				g += rect(r0 + 16, dy, W - r0 - 32, 30, 6, 'var(--surface)') + rect(r0 + 30, dy + 11, 160, 8, 4, 'var(--faint)') + rect(W - 96, dy + 11, 24, 8, 4, mix('green', 50)) + rect(W - 66, dy + 11, 16, 8, 4, mix('red', 50));
				dy += 40;
				block.forEach((k, i) => {
					if (k) g += rect(r0 + 16, dy - 4, W - r0 - 32, 22, 0, k === 1 ? mix('red', 8) : mix('green', 8));
					g += rect(r0 + 26, dy + 3, 18, 7, 3.5, 'var(--line)');
					g += rect(r0 + 58, dy + 3, (W - r0 - 140) * (0.3 + 0.55 * Math.abs(wob(i + dy))), 7, 3.5, k === 1 ? mix('red', 45) : k === 2 ? mix('green', 45) : 'var(--line-strong)');
					dy += 24;
				});
				dy += 14;
			}
			// The chat: the prompt, right-aligned.
			const prompt = (s.prompts ?? [])[step - 1] ?? s.prompt ?? '';
			const pText = esc(prompt).replace(/^(\/\S+)/, '<b>$1</b>');
			const pw = 500, pTop = bar + 12, fTop = pTop + 52;
			g += rect(cx1 - pw, pTop, pw, 40, 10, 'var(--surface)', 'var(--line-strong)', 1.5);
			html += t(`${n}-a ${n}-prompt`, at(cx1 - pw + 16, pTop + 10, pw - 24), pText, { nolint: true });
			const m = (s.media ?? [])[step === 3 ? 1 : 0] ?? {};
			const card = (y, c) => {
				g += rect(cx0, y, cw, 44, 8, '#fff', 'var(--line-strong)', 1.5) + rect(cx0 + 1.5, y + 8, 4, 28, 2, 'var(--blue)');
				html += t(`${n}-a ${n}-ct`, at(cx0 + 18, y + 12, cw - 210), fmt(c.full ?? c.title ?? ''), { nolint: true });
				html += t(`${n}-a ${n}-cs`, at(cx1 - 180, y + 13, 164), `${c.files} files <span class="add">+${c.add}</span> <span class="del">\u2212${c.del}</span>`, { nolint: true });
			};
			const iconBtn = (x, y, name) => { html += `<span class="${n}-ic" style="${at(x, y, 22, 22)}">${ic(name, 22, 'var(--body)')}</span>`; };
			const chevron = (x, y) => { g += `<path d="M ${x} ${y + 6} L ${x + 8} ${y - 2} L ${x + 16} ${y + 6}" fill="none" stroke="var(--body)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`; };
			// The info row under an expanded player: title and details on the left; Reveal, Copy Path, Collapse on the right.
			const infoRow = y => {
				html += t(`${n}-a ${n}-it`, at(cx0 + 4, y, cw - 150), fmt(String(m.title ?? '').replace(/\n/g, ' ')), { nolint: true });
				html += t(`${n}-a ${n}-mm`, at(cx0 + 4, y + 23, cw - 150), fmt(m.meta ?? ''), { nolint: true });
				iconBtn(cx1 - 104, y + 9, 'folder');
				iconBtn(cx1 - 68, y + 9, 'copy');
				g += rect(cx1 - 36, y + 4, 32, 32, 6, 'var(--blue-tint)');
				chevron(cx1 - 28, y + 18);
			};
			const inTop = H - stH - 54;
			if (step === 1) {
				// The compact card: a still, the title, its details, then Play Video with Reveal and Copy Path beside it.
				const mW = 680, mH = 136;
				g += rect(cx0, fTop, mW, mH, 12, '#fff', 'var(--blue)', 3);
				const tx = cx0 + 12, ty = fTop + 12, tw = 200, th = mH - 24;
				g += rect(tx, ty, tw, th, 6, mix('blue', 12)) + rect(tx + 14, ty + 14, 96, 8, 4, 'var(--ink)') + rect(tx + 14, ty + 30, 70, 6, 3, 'var(--line-strong)');
				g += rect(tx + tw - 70, ty + 14, 56, th - 28, 4, mix('blue', 8), 'var(--blue)', 2);
				for (let i = 0; i < 5; i++) g += rect(tx + tw - 62, ty + 24 + i * 15, i === 2 ? 40 : 32, 5, 2.5, i === 2 ? 'var(--blue)' : mix('blue', 40));
				g += playMark(tx + 74, ty + th * 0.62, 20);
				const bx = tx + tw + 20;
				html += t(`${n}-a ${n}-mt`, at(bx, fTop + 14, cx0 + mW - bx - 16), fmt(m.title ?? ''), { nolint: true });
				html += t(`${n}-a ${n}-mm`, at(bx, fTop + 66, cx0 + mW - bx - 14), fmt(m.meta ?? ''), { nolint: true });
				iconBtn(bx + 144, fTop + 97, 'folder');
				iconBtn(bx + 176, fTop + 97, 'copy');
				g += rect(bx, fTop + 92, 128, 32, 7, 'var(--blue)');
				html += `<div class="${n}-a ${n}-btn" style="${at(bx + 14, fTop + 99)}">${ic('play', 15)}${t('', '', fmt(m.button ?? 'Play Video'), { tag: 'span', nolint: true })}</div>`;
				const ax = bx + 104, ay = fTop + 114;
				g += `<path d="M ${ax} ${ay} l 0 30 l 8 -7 l 6 13 l 6 -3 l -6 -13 l 11 0 Z" fill="#fff" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>`;
				(s.cards ?? []).slice(0, 5).forEach((c, i) => card(fTop + mH + 16 + i * 52, c));
				const foldY = fTop + mH + 16 + 5 * 52 + 2;
				html += `<div class="${n}-a ${n}-fold" style="${at(cx0 + 4, foldY)}">${ic('checkmark', 18)}${t('', '', fmt(s.folded ?? ''), { tag: 'span', nolint: true })}${ic('arrowDown', 15)}</div>`;
			} else if (step === 2) {
				// The same card, grown to the chat's full width: the player, then its info row, then the intent cards.
				const vh = Math.round(cw * 9 / 16), vx = cx0, vy = fTop;
				g += rect(vx, vy, cw, vh, 8, '#1b1b1f');
				const ax = vx + 28, ay = vy + 20, aw = cw - 56, ah = vh - 84;
				g += rect(ax, ay, aw, ah, 6, '#fff') + rect(ax, ay, aw, 26, 6, 'var(--surface)') + rect(ax, ay + 20, aw, 6, 0, 'var(--surface)');
				for (let i = 0; i < 7; i++) {
					const k = [0, 1, 2, 2, 0, 1, 2][i], y = ay + 40 + i * 32;
					if (k) g += rect(ax + 14, y - 6, aw - 190, 26, 3, k === 1 ? mix('red', 16) : mix('green', 16));
					g += rect(ax + 28, y + 3, (aw - 220) * (0.35 + 0.45 * Math.abs(wob(i + 4))), 8, 4, k === 1 ? 'var(--red)' : k === 2 ? 'var(--green)' : 'var(--line-strong)', 'none', 0, k ? 'opacity=".55"' : '');
				}
				g += rect(ax + aw - 160, ay + 38, 146, ah - 54, 6, mix('blue', 10), 'var(--blue)', 2.5);
				for (let i = 0; i < 6; i++) g += rect(ax + aw - 146, ay + 54 + i * 30, i === 3 ? 118 : 96, 9, 4.5, i === 3 ? 'var(--blue)' : mix('blue', 40));
				// Native controls, playing.
				const cy = vy + vh - 30;
				g += rect(vx + 22, cy - 11, 6, 22, 2, '#fff') + rect(vx + 34, cy - 11, 6, 22, 2, '#fff');
				html += t(`${n}-a ${n}-time`, at(vx + 58, cy - 10, 120), fmt((s.video ?? {}).time ?? '0:32 / 1:15'), { nolint: true });
				const sb0 = vx + 190, sb1 = vx + cw - 110, now = sb0 + (sb1 - sb0) * 0.43;
				g += line(sb0, cy, sb1, cy, '#5f6168', 5) + line(sb0, cy, now, cy, '#fff', 5) + circle(now, cy, 8, '#fff');
				html += `<span class="${n}-ic" style="${at(vx + cw - 90, cy - 12, 24, 24)}">${ic('speaker', 24, '#fff')}</span><span class="${n}-ic" style="${at(vx + cw - 50, cy - 12, 24, 24)}">${ic('window', 24, '#fff')}</span>`;
				// The growth: the compact card's outline where it was, and an arrow down to where the player now ends.
				const gx = vx + 10, gy = vy + 10, gw = 660, gh = 105;
				g += rect(gx, gy, gw, gh, 10, 'none', '#fff', 4, 'stroke-dasharray="12 9"');
				const arrow = (x0, y0, x1, y1) => {
					const a = Math.atan2(y1 - y0, x1 - x0), hx = Math.cos(a), hy = Math.sin(a);
					const head = `M ${r1(x1 - hx * 16 - hy * 10)} ${r1(y1 - hy * 16 + hx * 10)} L ${x1} ${y1} L ${r1(x1 - hx * 16 + hy * 10)} ${r1(y1 - hy * 16 - hx * 10)}`;
					let a2 = '';
					for (const [c, w] of [['#fff', 10], ['var(--blue)', 4]]) a2 += line(x0, y0, x1, y1, c, w) + `<path d="${head}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
					return a2;
				};
				g += arrow(gx + gw / 2, gy + gh + 12, gx + gw / 2, gy + gh + 92);
				infoRow(vy + vh + 6);
				card(vy + vh + 56, (s.cards ?? [])[0] ?? {});
			} else {
				// A deck run: the slide fills the frame, the arrows sit over its edges (shown on hover), the page count on its
				// corner; the thumbnails below; then the info row.
				const d = s.deck ?? {}, pages = d.pages ?? [], cur = (d.current ?? 1) - 1;
				const vh = Math.round(cw * 9 / 16), vx = cx0, vy = fTop;
				g += rect(vx - 2, vy - 2, cw + 4, vh + 4, 8, '#fff', 'var(--line-strong)', 2);
				html += img(`${n}-shot`, pages[cur], vx, vy, cw, vh);
				const arrowsHtml = [[vx + 30, -1], [vx + cw - 30, 1]].map(([x, dir]) => `<svg class="${n}-ov" style="${at(x - 24, vy + vh / 2 - 24, 48, 48)}" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#fff" stroke="var(--blue)" stroke-width="3"/><path d="M ${24 - dir * 4} 15 L ${24 + dir * 5} 24 L ${24 - dir * 4} 33" fill="none" stroke="var(--blue)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`).join('');
				html += arrowsHtml;
				html += `<svg class="${n}-ov" style="${at(vx + cw - 42, vy + vh / 2 + 6, 26, 36)}" width="26" height="36" viewBox="0 0 26 36"><path d="M 3 3 l 0 28 l 7 -6 l 5 12 l 5 -2 l -5 -12 l 10 0 Z" fill="#fff" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
				html += t(`${n}-a ${n}-count`, at(vx + cw - 74, vy + vh - 38, 62), `${cur + 1} / ${pages.length}`, { nolint: true });
				const th = 40, tw = th * 16 / 9, tg = 10, ty = vy + vh + 10, tx0 = vx + (cw - (pages.length * tw + (pages.length - 1) * tg)) / 2;
				pages.forEach((p, i) => {
					const x = tx0 + i * (tw + tg), on = i === cur;
					html += img(`${n}-shot`, p, x, ty, tw, th);
					g += rect(x - (on ? 4 : 1.5), ty - (on ? 4 : 1.5), tw + (on ? 8 : 3), th + (on ? 8 : 3), 6, 'none', on ? 'var(--blue)' : 'var(--line-strong)', on ? 3 : 1.5);
				});
				infoRow(ty + th + 10);
			}
			// The chat's input, fixed at the bottom.
			g += rect(chat0 + 1, inTop - 8, chat1 - chat0 - 2, H - stH - inTop + 7, 0, '#fff');
			g += rect(cx0, inTop, cw, 44, 10, '#fff', 'var(--line-strong)', 2);
			g += rect(cx1 - 40, inTop + 8, 30, 28, 6, 'var(--blue)') + `<path d="M ${cx1 - 30} ${inTop + 15} L ${cx1 - 18} ${inTop + 22} L ${cx1 - 30} ${inTop + 29} Z" fill="#fff"/>`;
			html += t(`${n}-a ${n}-ph`, at(cx0 + 16, inTop + 12, 300), fmt(s.input ?? 'Ask a follow-up'), { nolint: true });
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The three conditions as one picture: three overlapping circles, one per condition, and the media card only in
	 * the middle, where all three overlap (with a tick). On the right, what the answer looks like: with all three, the
	 * card leads it and the intent cards follow; otherwise the file is just a pill in the text.
	 * Fields: eyebrow, title, conds (3): [{ icon | logo, title, sub }] (top, bottom left, bottom right),
	 * yes: { label }, no: { label, file }. */
	'gw-three': {
		css: `${base('gw-three')}
.gw-three .gw-three-ct { font-size: 20px; font-weight: 600; color: var(--ink); line-height: 1.2; text-align: center; white-space: nowrap; }
.gw-three .gw-three-cs { font-family: var(--mono); font-size: 14px; color: var(--body); text-align: center; white-space: nowrap; }
.gw-three .gw-three-out { display: flex; align-items: center; gap: 10px; }
.gw-three .gw-three-file { font-family: var(--mono); font-size: 15px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const n = 'gw-three', H = bodyHeight(s), conds = (s.conds ?? []).slice(0, 3);
			const R = 230, D = 130, cx = 480, cy = 370;
			const C = [[cx, cy - D], [cx - D * 0.866, cy + D / 2], [cx + D * 0.866, cy + D / 2]];
			let g = '', html = '';
			const defs = `<clipPath id="${n}-a"><circle cx="${C[0][0]}" cy="${C[0][1]}" r="${R}"/></clipPath><clipPath id="${n}-ab" clip-path="url(#${n}-a)"><circle cx="${r1(C[1][0])}" cy="${C[1][1]}" r="${R}"/></clipPath>`;
			for (const [x, y] of C) g += circle(x, y, R, 'var(--blue)', 'none', 0, 'fill-opacity=".07"');
			g += `<circle cx="${r1(C[2][0])}" cy="${C[2][1]}" r="${R}" fill="var(--blue)" fill-opacity=".3" clip-path="url(#${n}-ab)"/>`;
			for (const [x, y] of C) g += circle(x, y, R, 'none', 'var(--blue)', 3, 'stroke-opacity=".55"');
			// Each condition's label, in the part of its circle no other circle covers.
			const spots = [[cx, 52], [cx - 218, 456], [cx + 218, 456]];
			conds.forEach((c, i) => {
				const [x, y] = spots[i];
				html += c.logo ? logoAt(n, x, y + 16, c.logo, 32) : icAt(n, x, y + 16, c.icon ?? 'checkmark', 32, `var(--${c.tone ?? 'blue'})`);
				html += t(`${n}-a ${n}-ct`, at(x - 110, y + 42, 220), fmt(c.title));
				if (c.sub) html += t(`${n}-a ${n}-cs`, at(x - 100, y + 74, 200), fmt(c.sub), { nolint: true });
			});
			// Where only two meet: no card, just the file's pill (grey).
			const chip = (x, y) => rect(x - 32, y - 15, 64, 30, 15, '#fff', 'var(--connector)', 2.5) + rect(x - 16, y - 8, 12, 16, 2, 'none', 'var(--muted)', 2) + rect(x + 2, y - 3, 16, 6, 3, 'var(--faint)');
			const pairs = [[cx - 132, 296], [cx + 132, 296], [cx, 526]];
			for (const [x, y] of pairs) g += chip(x, y);
			// The card, only where all three overlap.
			const mw = 156, mh = 98, mx = cx - mw / 2, my = cy - mh / 2 + 6;
			g += rect(mx, my, mw, mh, 10, '#fff', 'var(--blue)', 3);
			g += rect(mx + 10, my + 10, 64, mh - 20, 6, mix('blue', 14)) + playMark(mx + 42, my + mh / 2, 15);
			g += rect(mx + 84, my + 18, 60, 8, 4, 'var(--ink)') + rect(mx + 84, my + 34, 44, 6, 3, 'var(--line-strong)') + rect(mx + 84, my + 62, 52, 20, 5, 'var(--blue)');
			g += circle(mx + mw, my, 17, 'var(--green)', '#fff', 3) + `<path d="M ${mx + mw - 8} ${my} l 5 5 l 10 -11" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
			// What the answer looks like, on the right.
			const ox = 1000, ow = W - ox;
			const yes = s.yes ?? {}, no = s.no ?? {};
			// With all three: the card leads, the intent cards follow.
			const y1 = 40;
			html += `<div class="${n}-a ${n}-out t-green" style="${at(ox, y1)}">${ic('check', 26, 'var(--green)')}${t('lbl', 'color:var(--green)', fmt(yes.label ?? 'All three'), { tag: 'span', nolint: true })}</div>`;
			const ay = y1 + 46;
			g += rect(ox, ay, ow, 300, 14, 'var(--surface-2)', 'var(--line-strong)', 2);
			g += rect(ox + 20, ay + 20, ow - 40, 130, 12, '#fff', 'var(--blue)', 3);
			g += rect(ox + 32, ay + 32, 190, 106, 6, mix('blue', 14)) + playMark(ox + 127, ay + 85, 22);
			g += rect(ox + 242, ay + 42, 300, 11, 5.5, 'var(--ink)') + rect(ox + 242, ay + 64, 220, 8, 4, 'var(--line-strong)') + rect(ox + 242, ay + 100, 120, 30, 7, 'var(--blue)');
			for (let i = 0; i < 3; i++) {
				const yy = ay + 166 + i * 42;
				g += rect(ox + 20, yy, ow - 40, 34, 8, '#fff', 'var(--line-strong)', 1.5) + rect(ox + 21.5, yy + 7, 4, 20, 2, 'var(--blue)');
				g += rect(ox + 40, yy + 13, 260 + 80 * Math.abs(wob(i + 3)), 8, 4, 'var(--ink)') + rect(ow + ox - 130, yy + 13, 90, 8, 4, 'var(--line-strong)');
			}
			// The arrow from the middle of the circles to that answer.
			const sx = mx + mw + 26, sy = cy + 6, ex = ox - 16, ey = ay + 85;
			g += `<path d="M ${sx} ${sy} C ${sx + 160} ${sy}, ${ex - 160} ${ey}, ${ex} ${ey}" fill="none" stroke="var(--blue)" stroke-width="4" stroke-linecap="round"/>`;
			g += `<path d="M ${ex - 14} ${ey - 10} L ${ex} ${ey} L ${ex - 14} ${ey + 10}" fill="none" stroke="var(--blue)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
			// Otherwise: plain text with the file as a pill; a grey arrow from the bottom pair's pill.
			const y2 = 446;
			{
				const sx2 = cx, sy2 = 543, ex2 = ox - 16, ey2 = y2 + 46 + 95;
				g += `<path d="M ${sx2} ${sy2} C ${sx2} ${H - 20}, ${ex2 - 260} ${H - 10}, ${ex2} ${ey2}" fill="none" stroke="var(--connector)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
				g += `<path d="M ${ex2 - 12} ${ey2 - 9} L ${ex2} ${ey2} L ${ex2 - 12} ${ey2 + 9}" fill="none" stroke="var(--connector)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
			}
			html += `<div class="${n}-a ${n}-out" style="${at(ox, y2)}">${ic('dismiss', 26, 'var(--muted)')}${t('lbl', '', fmt(no.label ?? 'Otherwise'), { tag: 'span', nolint: true })}</div>`;
			const by = y2 + 46, bh = H - by - 4;
			g += rect(ox, by, ow, bh, 14, 'var(--surface-2)', 'var(--line-strong)', 2);
			g += rect(ox + 24, by + 26, ow * 0.62, 9, 4.5, 'var(--faint)') + rect(ox + 24, by + 46, ow * 0.48, 9, 4.5, 'var(--faint)');
			const pw2 = 380, py2 = by + 76;
			g += rect(ox + 24, py2, pw2, 38, 19, '#fff', 'var(--line-strong)', 2);
			html += `<span class="${n}-ic" style="${at(ox + 38, py2 + 8, 22, 22)}">${ic('document', 22, 'var(--body)')}</span>`;
			html += t(`${n}-a ${n}-file`, at(ox + 68, py2 + 9, pw2 - 60), fmt(no.file ?? ''), { nolint: true });
			g += rect(ox + 24, py2 + 62, ow * 0.56, 9, 4.5, 'var(--faint)') + rect(ox + 24, py2 + 82, ow * 0.4, 9, 4.5, 'var(--faint)');
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g, defs)}${html}</div>`, { vcenter: false });
		},
	},

	/** A commit as strips of set type, one per file, as long as the lines it adds: new files in blue, files that already
	 * existed as grey stubs. Two big numbers in the empty corner. Fields: eyebrow, title, files: [{ file, add, isNew }],
	 * stats (2): [{ value, label, tone }]. */
	'gw-inches': {
		css: `${base('gw-inches')}
.gw-inches .gw-inches-f { font-family: var(--mono); font-size: 18px; color: var(--body); white-space: nowrap; text-align: right; }
.gw-inches .gw-inches-f.on { color: var(--blue); font-weight: 600; }
.gw-inches .gw-inches-v { font-family: var(--mono); font-size: 18px; color: var(--muted); white-space: nowrap; }
.gw-inches .gw-inches-v.on { color: var(--blue); font-weight: 600; }
.gw-inches .gw-inches-big { font-size: 104px; font-weight: 700; letter-spacing: -.04em; line-height: .95; white-space: nowrap; color: var(--fg); }
.gw-inches .gw-inches-lab { font-size: 25px; color: var(--body); line-height: 1.25; }
`,
		render(s) {
			const n = 'gw-inches', H = bodyHeight(s), files = s.files ?? [];
			const nx = 400, sx = nx + 20, maxW = 1080, pitch = Math.min(46, H / files.length), sh = pitch * 0.62;
			const most = Math.max(...files.map(f => f.add)), k = maxW / most;
			let g = '', html = '';
			files.forEach((f, i) => {
				const y = i * pitch + (pitch - sh) / 2, w = Math.max(8, f.add * k), on = !!f.isNew;
				g += rect(sx, y, w, sh, 4, on ? mix('blue', 22) : '#fff', on ? 'var(--blue)' : 'var(--neutral)', 2.5);
				if (w > 40) for (let j = 0; j < Math.floor((w - 16) / 26); j++) g += rect(sx + 10 + j * 26, y + sh / 2 - 3, 18, 6, 3, on ? 'var(--blue)' : 'var(--line-strong)', 'none', 0, 'opacity=".5"');
				html += t(`${n}-a ${n}-f${on ? ' on' : ''}`, at(0, y + sh / 2 - 12, nx), fmt(f.file), { nolint: true });
				html += t(`${n}-a ${n}-v${on ? ' on' : ''}`, at(sx + w + 14, y + sh / 2 - 12, 64), `+${f.add}`, { nolint: true });
				if (on) html += `<div class="${n}-a" style="${at(sx + maxW + 110, y + sh / 2 - 15)}">${pill({ text: s.newLabel ?? 'New', tone: 'blue', size: 's' })}</div>`;
			});
			const newCount = files.filter(f => f.isNew).length;
			g += line(sx - 10, newCount * pitch + 6, W, newCount * pitch + 6, 'var(--line)', 2, 'stroke-dasharray="4 10"');
			(s.stats ?? []).slice(0, 2).forEach((st, i) => {
				const x = 1120, y = newCount * pitch + 50 + i * 220;
				html += t(`${n}-a ${n}-big t-${st.tone ?? 'neutral'}`, at(x, y), esc(st.value));
				html += t(`${n}-a ${n}-lab`, at(x, y + 108, W - x), fmt(st.label ?? ''));
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The close on a blue page: the line to remember, the prompt to try, the setting, both names; on the right three front
	 * pages on a ledge, one per answer (a video, slides, both). Fields: eyebrow, title, prompt, sub, people,
	 * pages (3): [{ label, picture: 'video' | 'deck' | 'both' }]. */
	'gw-close': {
		bare: true,
		css: `${coverCss('gw-close')}
.gw-close .st-eyebrow, .gw-close .st-title-xl, .gw-close .tf-quote, .gw-close .gw-close-name, .gw-close .gw-close-role { color: #fff; }
.gw-close .gw-close-av { background: #fff; color: var(--blue); }
.gw-close .gw-close-try { margin-top: 36px; display: inline-block; align-self: flex-start; padding: 14px 22px; border-radius: 12px; background: #fff; font-family: var(--mono); font-size: 24px; color: var(--ink); white-space: nowrap; }
.gw-close .gw-close-try b { color: var(--blue); font-weight: 600; }
.gw-close .gw-close-lab { font-size: 24px; font-weight: 600; color: #fff; white-space: nowrap; text-align: center; }
.gw-close .ms-logo .name { color: #fff; }
`,
		render(s) {
			const n = 'gw-close';
			let g = '', html = '';
			const ly = 820, pw = 250, ph = 330, fy = 920;
			g += line(980, fy, 1860, fy, '#fff', SW * 1.5);
			g += rect(1000, ly, 840, 18, 6, '#fff') + rect(1040, ly + 18, 22, fy - ly - 18, 4, '#fff') + rect(1778, ly + 18, 22, fy - ly - 18, 4, '#fff');
			(s.pages ?? []).slice(0, 3).forEach((p, i) => {
				const x = 1030 + i * 280, y = ly - ph;
				g += gwPage(x, y, pw, { h: ph, picture: p.picture ?? 'video', stroke: '#fff' });
				html += t(`${n}-a ${n}-lab`, at(x - 15, y - 50, pw + 30), fmt(p.label));
			});
			const pText = esc(s.prompt ?? '').replace(/^(\/\S+)/, '<b>$1</b>');
			const people = (s.people ?? []).map(p => `<div class="${n}-who"><span class="${n}-av" data-t>${esc(p.initials)}</span><div><div class="${n}-name" data-t>${fmt(p.name)}</div></div></div>`).join('');
			const left = `<div class="tf-left ${n}-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div><div class="${n}-try" data-t>${pText}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}<div class="${n}-people">${people}</div>${s.pills ? `<div class="${n}-pills">${s.pills.map(p => pill({ ...p, white: true })).join('')}</div>` : ''}</div>`;
			return `<div class="${n}">${svg(`${n}-svg`, 1920, 1080, g)}${left}${html}${msLogo()}</div>`;
		},
	},
};

/** A round icon tile: solid blue when it is the current click, a light tint otherwise. */
function iconTileSolid(name, on) {
	return `<span style="width:64px;height:64px;border-radius:50%;flex:none;display:grid;place-items:center;background:${on ? 'var(--blue)' : 'var(--blue-tint)'};color:${on ? '#fff' : 'var(--blue)'}">${ic(name, 34)}</span>`;
}
