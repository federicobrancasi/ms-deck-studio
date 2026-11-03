// A gallery for inspiration (the studio world): read it for technique: a projector whose gripped lens sits inside its body, a TV wall where each screen shows its output, shelves you can count in fives.
// A new deck draws its own pictures in designs/local-<deck>.mjs: do not reuse these as they are. Every visible
// word comes from the slide's fields; examples/pr-videos.mjs shows them in a deck.
// One drawing style: 4 px ink outlines, 20 px corners, tinted fills, Fluent icons, no shadows. One object comes back on
// every slide: the screen (a rounded frame with a play bar), which is what the tools make.
//   sd-cover-a:  a cover: a pull request ticket stands in a projector's slot; its purple beam lights a real still (clean)
//   sd-cover-b:  the same with more mechanics: the ticket half fed in, a framed screen on a tripod, a power cable
//   sd-cover-c:  the full scene: the agent visible inside, a side table, motion, sparkles and dust, a pull-down screen
//   sd-tv-wall:  a wall of four TV sets, one channel per tool, each playing what its tool makes
//   sd-knife:    a Swiss Army knife with four blades open, one per tool
//   sd-toolbelt: the agent (a purple bot) wearing a tool belt, one tool in each of its four loops
//   sd-doors:    four studio doors, one per tool, a window into each; the on-air lamp lit over one
//   sd-dominoes: one push from the pull request topples six domino steps (pips count them) into the finished screen
//   sd-patch:    a patch bay: every word on the screen is plugged by a green cable into its source; one loose red plug
//   sd-race:     two lanes of 100 dots (seconds): watching the video vs making it (render and encode), flag at the end
//   sd-mailroom: a chat ask goes to the agent, who sorts small PRs as letters to read and big ones as video parcels
//   sd-loupe:    a light table of real stills, muted, with a loupe that magnifies one of them
//   sd-shelf:    wooden shelves of tapes and binders, one per video and deck, in fives between bookends, totals beside
//   sd-parcels:  four parcels on a post-office counter, one per pull request, stamped merged or in review
//   sd-tower:    a close: a radio mast broadcasts the skills into chat windows all around it
import { esc, fmt, ic, iconTile, pill, msLogo, heading, body, bodyHeight, W, r1, STYLE, t, at, mix, asset, wob } from '../src/kit.mjs';

const SW = STYLE.stroke;
const R = STYLE.radius;
const svg = (cls, w, h, inner) => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;
const rect = (x, y, w, h, { rx = R, fill = '#fff', stroke = 'var(--ink)', sw = SW, extra = '' } = {}) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`;
const circle = (cx, cy, rr, { fill = '#fff', stroke = 'var(--ink)', sw = SW, extra = '' } = {}) => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(rr)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`;
const line = (x1, y1, x2, y2, { stroke = 'var(--ink)', sw = SW, extra = '' } = {}) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"${extra}/>`;
/** An icon placed in HTML, centred on (x, y). */
const icAt = (cls, x, y, name, size, color) => `<span class="${cls}" style="position:absolute;left:${r1(x - size / 2)}px;top:${r1(y - size / 2)}px;width:${size}px;height:${size}px;display:block;line-height:0">${ic(name, size, color)}</span>`;

/** CSS every design shares, each rule under the design's own name. */
function common(n, { bare = false } = {}) {
	return `
.${n} { position: ${bare ? 'absolute' : 'relative'}; ${bare ? 'left: 0; top: 0; width: 1920px; height: 1080px;' : `width: ${W}px;`} }
.${n} .${n}-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-ic { color: var(--fg); }
.${n} .${n}-lab { position: absolute; font-size: 26px; font-weight: 600; line-height: 1.2; color: var(--ink); }
.${n} .${n}-sub { position: absolute; font-size: 22px; line-height: 1.3; color: var(--body); }
.${n} .${n}-c { text-align: center; }
.${n} .${n}-mono { font-family: var(--mono); }
.${n} .${n}-caps { position: absolute; font-size: 20px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.${n} .${n}-scr { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: ${R}px; background: #fff; overflow: hidden; display: flex; flex-direction: column; }
.${n} .${n}-scr-pic { flex: 1; position: relative; background: var(--tint); color: var(--fg); display: grid; place-items: center; }
.${n} .${n}-scr-pic img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
.${n} .${n}-scr-bar { flex: none; border-top: ${SW}px solid var(--ink); display: flex; align-items: center; gap: 10px; padding: 0 14px; color: var(--ink); background: #fff; }
.${n} .${n}-scr-track { flex: 1; height: 8px; border-radius: 4px; background: var(--track); position: relative; overflow: hidden; }
.${n} .${n}-scr-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: var(--fg); }
.${n} .${n}-scr-time { font-size: 20px; font-weight: 600; color: var(--body); white-space: nowrap; }
`;
}

/** The screen that comes back on every slide: a picture (or an icon on a tint) over a play bar. */
function screen(n, x, y, w, h, { src, tone = 'purple', prog = 0.42, bar = 40, icon = 'play', time, style = '' } = {}) {
	const a = src ? asset(src) : null;
	const pic = a ? `<img src="${a}" alt="">` : src ? `<span data-missing="${esc(src)}">${ic(icon, Math.round(Math.min(w, h) * 0.3))}</span>` : ic(icon, Math.round(Math.min(w, h) * 0.3));
	return `<div class="${n}-scr t-${tone}" style="${at(x, y, w, h)}${style}"><div class="${n}-scr-pic">${pic}</div>`
		+ `<div class="${n}-scr-bar" style="height:${bar}px">${ic('play', Math.round(bar * 0.5))}<span class="${n}-scr-track"><span class="${n}-scr-fill" style="width:${Math.round(prog * 100)}%"></span></span>`
		+ `${time ? t(`${n}-scr-time`, '', fmt(time), { tag: 'span', nolint: true }) : ''}</div></div>`;
}

/** The title block of a cover or a close: eyebrow, title, sub, speaker, pills. */
function coverLeft(n, s) {
	const sp = s.speaker;
	return `<div class="${n}-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="${n}-title" data-t>${fmt(s.title ?? '')}</div>`
		+ (s.sub ? `<div class="${n}-tsub" data-t>${fmt(s.sub)}</div>` : '')
		+ (sp ? `<div class="${n}-who"><span class="${n}-av" data-t>${esc(sp.initials ?? '')}</span><span class="${n}-name" data-t>${fmt(sp.name ?? '')}</span><span class="${n}-role" data-t>${fmt(sp.role ?? '')}</span></div>` : '')
		+ (s.pills ? `<div class="${n}-pills">${s.pills.map(p => pill(p)).join('')}</div>` : '') + '</div>';
}
const coverCss = (n, tw = 620) => `
.${n} .${n}-left { position: absolute; left: 96px; top: 150px; width: 800px; height: 790px; display: flex; flex-direction: column; justify-content: center; }
.${n} .${n}-title { margin-top: 26px; max-width: ${tw}px; font-size: 84px; font-weight: 600; line-height: 1.06; letter-spacing: -.022em; color: var(--ink); }
.${n} .${n}-tsub { margin-top: 30px; font-size: 30px; line-height: 1.38; color: var(--body); max-width: 700px; text-wrap: balance; }
.${n} .${n}-who { margin-top: 48px; display: flex; align-items: center; gap: 16px; white-space: nowrap; }
.${n} .${n}-av { width: 48px; height: 48px; border-radius: 50%; background: var(--blue-tint); color: var(--blue); display: grid; place-items: center; font-size: 20px; font-weight: 700; }
.${n} .${n}-name { font-size: 25px; font-weight: 600; color: var(--ink); }
.${n} .${n}-role { font-size: 23px; color: var(--body); }
.${n} .${n}-pills { margin-top: 30px; display: flex; gap: 12px; }
`;

/** Pips of a die face for 1..6, as fractions of the face. */
const PIPS = {
	1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
	4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]], 5: [[0.26, 0.26], [0.74, 0.26], [0.5, 0.5], [0.26, 0.74], [0.74, 0.74]],
	6: [[0.3, 0.22], [0.7, 0.22], [0.3, 0.5], [0.7, 0.5], [0.3, 0.78], [0.7, 0.78]],
};

/** The convex hull of a set of points (monotone chain): the outline of a beam from a lens to a screen. */
function hull(pts) {
	const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo = [], up = [];
	for (const q of p) {
		while (lo.length >= 2 && cross(lo.at(-2), lo.at(-1), q) <= 0) {
			lo.pop();
		}
		lo.push(q);
	}
	for (const q of p.reverse()) {
		while (up.length >= 2 && cross(up.at(-2), up.at(-1), q) <= 0) {
			up.pop();
		}
		up.push(q);
	}
	return [...lo.slice(0, -1), ...up.slice(0, -1)];
}
const poly = (pts, extra = '') => `<polygon points="${pts.map(p => `${r1(p[0])},${r1(p[1])}`).join(' ')}"${extra}/>`;
/** Whether (x, y) lies inside a convex polygon. */
function inside(pts, x, y) {
	const c = pts.map((p, i) => {
		const q = pts[(i + 1) % pts.length];
		return (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]);
	});
	return c.every(v => v >= 0) || c.every(v => v <= 0);
}

/** A beam of light from a lens (an ellipse) to a screen box: the hull of both, drawn under the screen, with dashed rays
 * along its two long edges. */
function beam(lens, box, { fill = mix('purple', 16), rays = true } = {}) {
	const pts = [];
	for (let k = 0; k < 32; k++) {
		const a = k / 32 * 2 * Math.PI;
		pts.push([lens.x + lens.rx * Math.cos(a), lens.y + lens.ry * Math.sin(a)]);
	}
	const i = 10;
	pts.push([box.x + i, box.y + i], [box.x + box.w - i, box.y + i], [box.x + box.w - i, box.y + box.h - i], [box.x + i, box.y + box.h - i]);
	const hp = hull(pts);
	let g = poly(hp, ` fill="${fill}"`);
	if (rays) {
		const isLens = p => Math.hypot((p[0] - lens.x) / lens.rx, (p[1] - lens.y) / lens.ry) < 1.05;
		hp.forEach((p, k) => {
			const q = hp[(k + 1) % hp.length];
			if (isLens(p) !== isLens(q)) {
				g += line(p[0], p[1], q[0], q[1], { stroke: mix('purple', 50), sw: 4, extra: ' stroke-dasharray="2 14"' });
			}
		});
	}
	return { pts: hp, svg: g };
}

/** A pull request ticket standing upright (an admission ticket: side notches, a perforation, a barcode on the stub),
 * its foot at (cx, foot): whatever draws over its foot afterwards (a slot, a lid) makes it look fed in. */
function ticketHtml(n, cx, foot, tk = {}, { w = 152, h = 188, rot = 0 } = {}) {
	const ny = Math.round(h * 0.6), r = 16, nr = 13, o = SW / 2;
	const d = `M ${r} ${o} H ${w - r} A ${r - o} ${r - o} 0 0 1 ${w - o} ${r} V ${ny - nr} A ${nr} ${nr} 0 0 0 ${w - o} ${ny + nr} V ${h - r} A ${r - o} ${r - o} 0 0 1 ${w - r} ${h - o} H ${r} A ${r - o} ${r - o} 0 0 1 ${o} ${h - r} V ${ny + nr} A ${nr} ${nr} 0 0 0 ${o} ${ny - nr} V ${r} A ${r - o} ${r - o} 0 0 1 ${r} ${o} Z`;
	const code = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
	const bx = (w - code.length * 7) / 2;
	const bars = code.map((b, i) => `<rect x="${r1(bx + i * 7)}" y="${ny + 18}" width="${b ? 4 : 2}" height="28" fill="var(--ink)"/>`).join('');
	return `<div class="${n}-ticket" style="${at(cx - w / 2, foot - h, w, h)}${rot ? `;transform:rotate(${rot}deg)` : ''}">`
		+ `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="#fff" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
		+ line(nr + 10, ny, w - nr - 10, ny, { sw: 3, extra: ' stroke-dasharray="2 9"' }) + bars + '</svg>'
		+ `<div class="${n}-tk-top" style="height:${ny}px">${ic(tk.icon ?? 'pr', 46)}${t(`${n}-tk`, '', fmt(tk.text ?? ''), { nolint: true })}</div></div>`;
}
const ticketCss = n => `
.${n} .${n}-ticket { position: absolute; transform-origin: 50% 100%; }
.${n} .${n}-ticket > svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .${n}-tk-top { position: absolute; left: 0; top: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--blue); }
.${n} .${n}-tk { font-family: var(--mono); font-size: 23px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.${n} .${n}-agent { color: var(--purple); font-weight: 600; }
.${n} .${n}-cap { position: absolute; font-family: var(--mono); font-size: 20px; color: var(--muted); white-space: nowrap; text-align: right; }
`;

/** A modern digital projector seen from the side, lens on the right: a white lid with a slot on top (where the ticket
 * goes in), a tinted shell with vents and the agent's badge, rubber feet and a lens barrel with a focus ring.
 * level 0: clean. 1: more mechanics (a gripped focus ring, buttons, a power cable). 2: the agent visible inside, behind
 * a window. Returns the drawing (draw it after the ticket), the HTML on top, the lens and the slot. */
function projector(n, x, y, level, agent = {}, { floor } = {}) {
	const w = 340, h = 156, rx = 34, lid = 50;
	const ly = y + lid + (h - lid) / 2;
	const lens = { x: x + w + 60, y: ly, rx: 14, ry: 50 };
	let g = '', html = '';
	if (level >= 1 && floor != null) {
		g += `<path d="M ${x + 4} ${ly + 26} C ${x - 64} ${ly + 26} ${x - 40} ${floor - 2} ${x - 118} ${floor - 2}" fill="none" stroke="var(--ink)" stroke-width="${SW}" stroke-linecap="round"/>`
			+ rect(x - 170, floor - 26, 54, 26, { rx: 8, fill: '#fff' }) + line(x - 186, floor - 18, x - 170, floor - 18, { sw: 4 }) + line(x - 186, floor - 8, x - 170, floor - 8, { sw: 4 });
	}
	g += rect(x + 46, y + h - 8, 60, 24, { rx: 8, fill: 'var(--ink)', sw: 0 }) + rect(x + w - 106, y + h - 8, 60, 24, { rx: 8, fill: 'var(--ink)', sw: 0 });
	// The lens: a tapered barrel out of the body, a gripped focus ring, a dark bezel, and the glass seen a little
	// from the front (layered tints and a curved reflection, no gradients). Centred on the body, clear of its base.
	const lc = y + h / 2 + 4, bx0 = x + w - 16, bx1 = x + w + 24, fx = x + w + 28, fw = 28, gx = fx + fw + 8;
	g += `<path d="M ${bx0} ${r1(lc - 38)} L ${bx1} ${r1(lc - 46)} L ${bx1} ${r1(lc + 46)} L ${bx0} ${r1(lc + 38)} Z" fill="#fff" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
	if (level >= 1) {
		g += line(bx0 + 18, lc - 41, bx0 + 18, lc + 41, { sw: 3 });
	}
	g += rect(fx, lc - 56, fw, 112, { rx: 10, fill: mix('purple', 30) });
	for (let k = 0; k < 6; k++) {
		const yy = lc - 37 + k * 14.8;
		g += line(fx + 8, yy, fx + fw - 8, yy, { stroke: 'var(--purple)', sw: 4 });
	}
	g += `<ellipse cx="${gx}" cy="${r1(lc)}" rx="22" ry="56" fill="var(--ink)" stroke="var(--ink)" stroke-width="${SW}"/>`
		+ `<ellipse cx="${gx + 3}" cy="${r1(lc)}" rx="16" ry="45" fill="var(--purple)"/>`
		+ `<ellipse cx="${gx + 5}" cy="${r1(lc)}" rx="11" ry="30" fill="${mix('purple', 55)}"/>`
		+ `<ellipse cx="${gx + 6}" cy="${r1(lc)}" rx="5" ry="14" fill="${mix('purple', 80)}"/>`
		+ `<path d="M ${gx - 4} ${r1(lc - 34)} Q ${gx + 6} ${r1(lc - 41)} ${gx + 11} ${r1(lc - 27)}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`
		+ `<circle cx="${gx + 12}" cy="${r1(lc - 16)}" r="3.5" fill="#fff"/>`;
	lens.x = gx + 4; lens.y = lc; lens.rx = 14; lens.ry = 45;
	// The body: white lid, tinted shell, the seam between them.
	const o = SW / 2;
	g += rect(x, y, w, h, { rx, fill: '#fff' })
		+ `<path d="M ${x + o} ${y + lid} H ${x + w - o} V ${y + h - rx} A ${rx - o} ${rx - o} 0 0 1 ${x + w - rx} ${y + h - o} H ${x + rx} A ${rx - o} ${rx - o} 0 0 1 ${x + o} ${y + h - rx} Z" fill="${mix('purple', 16)}"/>`
		+ line(x, y + lid, x + w, y + lid);
	// The slot on top, over the foot of the ticket.
	const slot = { cx: x + 142, top: y - 20 };
	g += rect(x + 52, y - 20, 180, 26, { rx: 10, fill: 'var(--ink)', sw: 0 });
	// The lid: a power light (and buttons).
	g += circle(x + w - 40, y + 25, 8, { fill: 'var(--green)', sw: 3 });
	if (level >= 1) {
		g += rect(x + w - 136, y + 17, 32, 16, { rx: 8, sw: 3 }) + rect(x + w - 94, y + 17, 32, 16, { rx: 8, sw: 3 });
	}
	// The shell: vents, and the agent (a badge, or a window with the agent inside).
	const vents = level === 2 ? 3 : level === 1 ? 5 : 4;
	for (let k = 0; k < vents; k++) {
		g += line(x + 36 + k * 18, y + lid + 24, x + 36 + k * 18, y + h - 24, { sw: 5 });
	}
	if (level === 2) {
		const wx = x + 112, wy = y + lid + 14, ww = 186, wh = h - lid - 28, cx = wx + ww / 2, cy = wy + wh / 2;
		g += `<clipPath id="${n}-win"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="14"/></clipPath>`
			+ rect(wx, wy, ww, wh, { rx: 14, fill: mix('purple', 8) })
			+ `<g clip-path="url(#${n}-win)">${circle(cx, cy, 76, { fill: mix('purple', 14), sw: 0 })}${circle(cx, cy, 54, { fill: mix('purple', 24), sw: 0 })}${circle(cx, cy, 34, { fill: '#fff', sw: 0 })}`
			+ line(wx + ww - 22, wy + 12, wx + ww - 34, wy + 40, { stroke: '#fff', sw: 6 }) + line(wx + ww - 22, wy + 52, wx + ww - 27, wy + 64, { stroke: '#fff', sw: 6 }) + '</g>'
			+ rect(wx, wy, ww, wh, { rx: 14, fill: 'none' });
		html += icAt(`${n}-ic t-purple`, cx, cy, agent.icon ?? 'bot', 50) + icAt(`${n}-ic t-purple`, cx - 62, cy - 14, 'sparkle', 26) + icAt(`${n}-ic t-purple`, cx + 58, cy + 16, 'sparkle', 20);
	} else {
		const cx = x + 224;
		g += circle(cx, ly, 38, { fill: '#fff' });
		html += icAt(`${n}-ic t-purple`, cx, ly, agent.icon ?? 'bot', 46);
	}
	return { g, html, lens, slot, x, y, w, h, feet: y + h + 16 };
}

/** A drawn stand-in for what a tool makes, when there is no still: a slide with page dots, or a how-to-test video (the
 * bug, ticked steps, a play bar). */
function preview(n, x, y, w, h, it, { bar = 30, mute = false } = {}) {
	const tone = it.tone ?? 'blue';
	const cls = mute ? ' mute' : '';
	if (it.src) {
		return screen(n, x, y, w, h, { src: it.src, tone, bar, prog: it.prog ?? 0.4 }).replace(`${n}-scr t-${tone}`, `${n}-scr t-${tone}${cls}`);
	}
	const pw = w - 2 * SW, ph = h - bar - 3 * SW;
	const mk = (l, tp, ww, hh, bg, extra = '') => `<span class="${n}-mk" style="left:${r1(l)}px;top:${r1(tp)}px;width:${r1(ww)}px;height:${r1(hh)}px;background:${bg}${extra}"></span>`;
	let pic = '', ctrl = '';
	if (it.kind === 'slides') {
		pic = mk(pw * 0.09, ph * 0.14, pw * 0.42, ph * 0.09, 'var(--ink)')
			+ [0, 1, 2].map(k => mk(pw * 0.09, ph * (0.36 + k * 0.15), pw * (0.3 - k * 0.04), ph * 0.06, 'var(--faint)')).join('')
			+ [0.32, 0.5, 0.68].map((v, k) => mk(pw * (0.6 + k * 0.11), ph * (0.84 - v), pw * 0.08, ph * v, k === 2 ? 'var(--fg)' : mix(tone, 40))).join('')
			+ mk(pw * 0.57, ph * 0.84, pw * 0.36, 3, 'var(--ink)');
		const dots = [0, 1, 2, 3, 4].map(k => `<span class="${n}-dot${k === 2 ? ' on' : ''}"></span>`).join('');
		ctrl = `<span class="${n}-dots">${dots}</span><span style="flex:1"></span>${ic('arrowRight', Math.round(bar * 0.55))}`;
	} else {
		const d = Math.min(ph * 0.62, pw * 0.34);
		pic = `<span class="${n}-mk" style="left:${r1(pw * 0.08)}px;top:${r1((ph - d) / 2)}px;width:${r1(d)}px;height:${r1(d)}px;border-radius:50%;background:#fff;display:grid;place-items:center;color:var(--fg)">${ic(it.icon ?? 'bug', Math.round(d * 0.56))}</span>`
			+ [0, 1, 2].map(k => {
				const yy = ph * (0.24 + k * 0.24), dd = Math.round(ph * 0.13);
				return mk(pw * 0.5, yy - dd / 2, dd, dd, k < 2 ? 'var(--fg)' : '#fff', `;border-radius:50%;box-shadow:0 0 0 3px var(--fg)`) + mk(pw * 0.5 + dd + 12, yy - 4, pw * (0.3 - k * 0.05), 8, k < 2 ? mix(tone, 45) : 'var(--faint)');
			}).join('');
		ctrl = `${ic('play', Math.round(bar * 0.5))}<span class="${n}-scr-track"><span class="${n}-scr-fill" style="width:${Math.round((it.prog ?? 0.55) * 100)}%"></span></span>`;
	}
	return `<div class="${n}-scr t-${tone}${cls}" style="${at(x, y, w, h)}"><div class="${n}-scr-pic"${it.kind === 'slides' ? ' style="background:#fff"' : ''}>${pic}</div>`
		+ `<div class="${n}-scr-bar" style="height:${bar}px">${ctrl}</div></div>`;
}
const previewCss = n => `
.${n} .${n}-mk { position: absolute; display: block; border-radius: 4px; }
.${n} .${n}-dots { display: flex; gap: 7px; align-items: center; }
.${n} .${n}-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--faint); }
.${n} .${n}-dot.on { background: var(--fg); }
.${n} .${n}-scr.mute .${n}-scr-pic > * { opacity: .62; }
.${n} .${n}-scr.mute .${n}-scr-fill, .${n} .${n}-scr.mute .${n}-dot.on { background: var(--faint); }
.${n} .${n}-scr.mute .${n}-scr-bar { color: var(--muted); }
`;

/** A tool's label: its icon on a tile, its name and what goes in and out. The highlighted tool is in its colour, the
 * others muted. align: 'left' (tile first), 'right' (tile last, text right-aligned) or 'center' (stacked). */
function toolLabel(n, it, x, y, w, { align = 'left', tile = 56 } = {}) {
	const tone = it.tone ?? 'blue';
	const tl = tile ? iconTile(it.icon ?? 'box', { tone, size: tile, solid: !!it.hi }) : '';
	return `<div class="${n}-tl ${align}${it.hi ? ' hi' : ''} t-${tone}" style="${at(x, y, w)}">${tl}<div class="${n}-tlx">`
		+ t(`${n}-tln`, '', fmt(it.name ?? ''), { nolint: true }) + (it.sub ? t(`${n}-tls`, '', fmt(it.sub), { nolint: true }) : '') + '</div></div>';
}
const labelCss = n => `
.${n} .${n}-tl { position: absolute; display: flex; align-items: center; gap: 16px; }
.${n} .${n}-tl.right { flex-direction: row-reverse; text-align: right; }
.${n} .${n}-tl.center { flex-direction: column; text-align: center; gap: 10px; }
.${n} .${n}-tl.mid { justify-content: center; }
.${n} .${n}-tln { font-size: 30px; font-weight: 600; line-height: 1.1; color: var(--body); white-space: nowrap; }
.${n} .${n}-tl.hi .${n}-tln { color: var(--fg); }
.${n} .${n}-tls { margin-top: 4px; font-size: 23px; line-height: 1.2; color: var(--muted); white-space: nowrap; }
.${n} .${n}-tl.hi .${n}-tls { color: var(--body); }
.${n} .${n}-tl:not(.hi) .ictile { background: var(--surface) !important; }
`;
/** A light wood for shelves, tables and consoles, and its grain. */
const WOOD = 'color-mix(in srgb, var(--orange) 22%, var(--yellow-tint))';
const GRAIN = 'color-mix(in srgb, var(--orange) 46%, var(--yellow-tint))';
export const designs = {
	/** Cover A, simple: a pull request ticket stands in the slot of a modern projector (the agent's badge on its side);
	 * the purple beam from its lens lights a screen with a real still. Fields: eyebrow, title, sub, speaker: { initials,
	 * name, role }, pills, ticket: { icon (default 'pr'), text }, agent: { icon (default 'bot'), label } (under the
	 * projector), src (the still), caption (over the screen), time (on the play bar). */
	'sd-cover-a': {
		bare: true,
		css: common('sd-cover-a', { bare: true }) + coverCss('sd-cover-a') + ticketCss('sd-cover-a'),
		render(s) {
			const n = 'sd-cover-a';
			const sx = 1196, sy = 176, sw = 628, bar = 52, sh = Math.round(sw * 9 / 16) + bar + SW * 3;
			const P = projector(n, 690, 792, 0, s.agent);
			const b = beam(P.lens, { x: sx, y: sy, w: sw, h: sh });
			const agent = s.agent ?? {};
			const art = svg(`${n}-svg`, 1920, 1080, b.svg)
				+ screen(n, sx, sy, sw, sh, { src: s.src, tone: 'purple', bar, prog: 0.38, time: s.time })
				+ (s.caption ? t(`${n}-cap`, at(sx, sy - 44, sw), fmt(s.caption), { nolint: true }) : '')
				+ ticketHtml(n, P.slot.cx, P.y - 2, s.ticket)
				+ svg(`${n}-svg`, 1920, 1080, P.g) + P.html
				+ (agent.label ? t(`${n}-lab ${n}-c ${n}-agent`, at(P.x, P.feet + 22, P.w), fmt(agent.label), { nolint: true }) : '');
			return `<div class="${n}">${art}${coverLeft(n, s)}${msLogo()}</div>`;
		},
	},

	/** Cover B, more detail: the projector has a gripped focus ring, buttons and a power cable to the floor; the ticket is
	 * half fed into its slot; the beam lights a framed projection screen on a tripod. Same fields as sd-cover-a. */
	'sd-cover-b': {
		bare: true,
		css: common('sd-cover-b', { bare: true }) + coverCss('sd-cover-b') + ticketCss('sd-cover-b') + `
.sd-cover-b .sd-cover-b-feed { position: absolute; color: var(--blue); }
`,
		render(s) {
			const n = 'sd-cover-b';
			const sx = 1232, sy = 208, sw = 576, bar = 48, sh = Math.round(sw * 9 / 16) + bar + SW * 3;
			const py = 770, floor = py + 156 + 16;
			const P = projector(n, 700, py, 1, s.agent, { floor });
			const b = beam(P.lens, { x: sx, y: sy, w: sw, h: sh });
			const agent = s.agent ?? {};
			// The stand: a pole behind the screen, a tripod on the floor; the case on top; the floor itself.
			const pole = sx + sw / 2, joint = floor - 128;
			let stand = line(pole, sy + sh, pole, joint, { sw: 10 })
				+ line(pole, joint, pole - 150, floor, { sw: 7 }) + line(pole, joint, pole + 150, floor, { sw: 7 }) + line(pole, joint, pole + 14, floor - 14, { sw: 7 })
				+ circle(pole, joint, 13, { fill: 'var(--ink)', sw: 0 });
			const frame = rect(sx - 20, sy - 20, sw + 40, sh + 40, { rx: 28, fill: '#fff' }) + rect(sx - 46, sy - 58, sw + 92, 34, { rx: 17, fill: 'var(--surface)' })
				+ rect(sx - 46, sy - 58, 26, 34, { rx: 10, fill: 'var(--ink)' }) + rect(sx + sw + 20, sy - 58, 26, 34, { rx: 10, fill: 'var(--ink)' });
			const ground = line(620, floor + 1, 1840, floor + 1, { stroke: 'var(--line-strong)', sw: 6 });
			const feed = icAt(`${n}-feed`, P.slot.cx + 112, P.y - 112, 'arrowDown', 40) + icAt(`${n}-feed`, P.slot.cx + 112, P.y - 70, 'arrowDown', 40);
			const art = svg(`${n}-svg`, 1920, 1080, ground + b.svg + stand + frame)
				+ screen(n, sx, sy, sw, sh, { src: s.src, tone: 'purple', bar, prog: 0.38, time: s.time })
				+ (s.caption ? t(`${n}-cap`, at(sx, sy - 104, sw), fmt(s.caption), { nolint: true }) : '')
				+ ticketHtml(n, P.slot.cx, P.y + 40, s.ticket) + feed
				+ svg(`${n}-svg`, 1920, 1080, P.g) + P.html
				+ icAt(`${n}-ic t-purple`, 1260, 660, 'sparkle', 40) + icAt(`${n}-ic t-purple`, 1400, 716, 'sparkle', 28)
				+ (agent.label ? t(`${n}-lab ${n}-c ${n}-agent`, at(P.x, floor + 22, P.w), fmt(agent.label), { nolint: true }) : '');
			return `<div class="${n}">${art}${coverLeft(n, s)}${msLogo()}</div>`;
		},
	},

	/** Cover C, the full scene: the projector stands on a side table, the agent visible inside it through a window; the
	 * ticket drops into its slot (motion lines); the beam, full of sparkles and dust, lights a pull-down screen hanging
	 * from its case, playing (a play bar with the time). Same fields as sd-cover-a. */
	'sd-cover-c': {
		bare: true,
		css: common('sd-cover-c', { bare: true }) + coverCss('sd-cover-c') + ticketCss('sd-cover-c'),
		render(s) {
			const n = 'sd-cover-c';
			const sx = 1214, sy = 214, sw = 600, bar = 50, sh = Math.round(sw * 9 / 16) + bar + SW * 3;
			const py = 724;
			const P = projector(n, 690, py, 2, s.agent);
			const b = beam(P.lens, { x: sx, y: sy, w: sw, h: sh });
			const agent = s.agent ?? {};
			// The table and the floor.
			const top = P.feet, floor = 1020;
			let scene = line(600, floor, 1850, floor, { stroke: 'var(--line-strong)', sw: 6 })
				+ rect(P.x + 6, top + 22, 18, floor - top - 22, { rx: 6, fill: 'var(--ink)', sw: 0 }) + rect(P.x + P.w + 64, top + 22, 18, floor - top - 22, { rx: 6, fill: 'var(--ink)', sw: 0 })
				+ rect(P.x - 26, top, P.w + 136, 26, { rx: 10, fill: WOOD })
				+ `<path d="M ${P.x + 10} ${top + 10} q 80 -6 160 0 t 150 0" fill="none" stroke="${GRAIN}" stroke-width="3" stroke-linecap="round"/>`;
			// Dust in the beam, and light rays at the lens.
			let dust = '';
			for (let i = 0; i < 70; i++) {
				const dx = 1100 + Math.abs(wob(i, 1.7)) * 760, dy = 230 + Math.abs(wob(i, 2.9)) * 640;
				if (inside(b.pts, dx, dy) && !(dx > sx - 14 && dx < sx + sw + 14 && dy > sy - 14 && dy < sy + sh + 60)) {
					dust += circle(dx, dy, 3 + Math.abs(wob(i, 5.1)) * 3, { fill: mix('purple', 45), sw: 0 });
				}
			}
			const L = P.lens;
			let rays = '';
			[-38, -18, 2].forEach(a => {
				const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180);
				rays += line(L.x + 40 * c, L.y + 40 * sn, L.x + 76 * c, L.y + 76 * sn, { stroke: 'var(--purple)', sw: 5 });
			});
			// The screen: a case on two wall hooks, the fabric with a border, a weighted bar and a pull ring.
			const hang = rect(sx - 30, sy - 30, sw + 60, sh + 56, { rx: 14, fill: '#fff' })
				+ line(sx + 60, sy - 92, sx + 60, sy - 64, { sw: 6 }) + line(sx + sw - 60, sy - 92, sx + sw - 60, sy - 64, { sw: 6 })
				+ rect(sx - 54, sy - 66, sw + 108, 40, { rx: 20, fill: 'var(--surface)' })
				+ rect(sx - 54, sy - 66, 28, 40, { rx: 10, fill: 'var(--ink)' }) + rect(sx + sw + 26, sy - 66, 28, 40, { rx: 10, fill: 'var(--ink)' })
				+ rect(sx - 40, sy + sh + 22, sw + 80, 18, { rx: 9, fill: 'var(--ink)', sw: 0 })
				+ line(sx + sw / 2, sy + sh + 40, sx + sw / 2, sy + sh + 58, { sw: 4 }) + circle(sx + sw / 2, sy + sh + 72, 14, { fill: 'none', sw: 5 });
			// The ticket drops in: motion lines above it and beside it.
			const tx = P.slot.cx, tfoot = P.y + 30;
			let motion = '';
			[-46, 0, 46].forEach((dx, k) => {
				motion += line(tx + dx, tfoot - 188 - 28 - k % 2 * 14, tx + dx, tfoot - 188 - 78 - k % 2 * 14, { stroke: 'var(--blue)', sw: 5 });
			});
			const sparkles = [[1222, 690, 42], [1404, 712, 30], [1296, 772, 24]]
				.filter(([x, y]) => inside(b.pts, x, y)).map(([x, y, z]) => icAt(`${n}-ic t-purple`, x, y, 'sparkle', z)).join('');
			const art = svg(`${n}-svg`, 1920, 1080, scene + b.svg + dust + rays + hang)
				+ screen(n, sx, sy, sw, sh, { src: s.src, tone: 'purple', bar, prog: 0.42, time: s.time })
				+ (s.caption ? t(`${n}-cap`, at(sx, sy - 136, sw), fmt(s.caption), { nolint: true }) : '')
				+ svg(`${n}-svg`, 1920, 1080, motion)
				+ ticketHtml(n, tx, tfoot, s.ticket)
				+ svg(`${n}-svg`, 1920, 1080, P.g) + P.html + sparkles
				+ (agent.label ? t(`${n}-lab ${n}-c ${n}-agent`, at(P.x + 40, top + 44, P.w - 10), fmt(agent.label), { nolint: true }) : '');
			return `<div class="${n}">${art}${coverLeft(n, s)}${msLogo()}</div>`;
		},
	},

	/** A wall of four TV sets, two by two on a low console, one channel per tool: each screen plays what its tool makes
	 * (a still, or a drawn slide or test video), the set's display shows the channel; the highlighted channel is lit and
	 * the rest are muted. Labels sit outside the wall. Fields: eyebrow, title, items (4): [{ ch, icon, name, sub, tone,
	 * hi, src, kind: 'slides' | 'test' }]. */
	'sd-tv-wall': {
		css: common('sd-tv-wall') + previewCss('sd-tv-wall') + labelCss('sd-tv-wall') + `
.sd-tv-wall .sd-tv-wall-ch { position: absolute; font-family: var(--mono); font-size: 24px; font-weight: 700; color: #fff; text-align: center; white-space: nowrap; line-height: 1; }
.sd-tv-wall .sd-tv-wall-ch.off { color: var(--faint); }
`,
		render(s) {
			const n = 'sd-tv-wall';
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 4);
			const tw = 560, th = 280, gx = 18, gy = 14;
			const x0 = (W - (2 * tw + gx)) / 2, y0 = 84;
			const base = y0 + 2 * th + gy;
			let g = rect(x0 - 40, base, 2 * tw + gx + 80, 26, { rx: 10, fill: WOOD })
				+ `<path d="M ${x0 - 10} ${base + 13} q 200 -6 400 0 t 400 0 t 330 0" fill="none" stroke="${GRAIN}" stroke-width="3" stroke-linecap="round"/>`
				+ rect(x0, base + 26, 22, H - base - 26, { rx: 6, fill: 'var(--ink)', sw: 0 }) + rect(x0 + 2 * tw + gx - 22, base + 26, 22, H - base - 26, { rx: 6, fill: 'var(--ink)', sw: 0 });
			let html = '';
			items.forEach((it, i) => {
				const c = i % 2, r = Math.floor(i / 2);
				const x = x0 + c * (tw + gx), y = y0 + r * (th + gy);
				const hi = !!it.hi;
				if (r === 0) {
					const ax = x + tw / 2;
					g += line(ax, y - 20, ax - 92, y - 64, { sw: 5 }) + line(ax, y - 20, ax + 78, y - 68, { sw: 5 })
						+ circle(ax - 92, y - 64, 8, { fill: 'var(--ink)', sw: 0 }) + circle(ax + 78, y - 68, 8, { fill: 'var(--ink)', sw: 0 })
						+ `<path d="M ${ax - 42} ${y + 2} A 42 26 0 0 1 ${ax + 42} ${y + 2} Z" fill="${hi ? mix('purple', 20) : 'var(--surface)'}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				}
				g += rect(x, y, tw, th, { rx: 26, fill: hi ? mix('purple', 16) : 'var(--surface)' });
				const sx = x + 22, sy = y + 22, sw = 418, sh = th - 44;
				if (hi) {
					g += rect(sx - 9, sy - 9, sw + 18, sh + 18, { rx: 24, fill: 'none', stroke: 'var(--purple)', sw: 6 });
				}
				html += preview(n, sx, sy, sw, sh, it, { bar: 34, mute: !hi });
				// The panel: channel display, two knobs, a speaker grille.
				const px = sx + sw + 20, pw = x + tw - 20 - px;
				g += rect(px, sy + 4, pw, 54, { rx: 12, fill: 'var(--ink)', sw: 0 });
				html += t(`${n}-ch${hi ? '' : ' off'}`, at(px, sy + 19, pw), esc(it.ch ?? String(i + 1)), { nolint: true });
				[0, 1].forEach(k => {
					const kx = px + pw / 2, ky = sy + 100 + k * 62;
					g += circle(kx, ky, 22, { fill: '#fff' }) + line(kx, ky, kx + (k ? 10 : -8), ky - 14, { sw: 4 });
				});
				for (let k = 0; k < 4; k++) {
					g += line(px + 12, sy + 186 + k * 12, px + pw - 12, sy + 186 + k * 12, { stroke: 'var(--faint)', sw: 4 });
				}
				const lw = x0 - 36;
				html += c === 0
					? toolLabel(n, it, 0, y + th / 2 - 36, lw, { align: 'right' })
					: toolLabel(n, it, x + tw + 36, y + th / 2 - 36, lw, { align: 'left' });
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A Swiss Army knife with four blades open, one per tool, each labelled at its tip; the highlighted blade is the big
	 * main blade, the others muted. The agent's badge is on the handle. Fields: eyebrow, title, items (4): [{ icon, name,
	 * sub, tone, hi }] (blades in order: main, screwdriver, saw, small), badge: { icon (default 'bot') }. */
	'sd-knife': {
		css: common('sd-knife') + labelCss('sd-knife'),
		render(s) {
			const n = 'sd-knife';
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 4);
			const hy = 556, hh = 144, hx0 = 470, hx1 = 1258;
			const pl = [hx0 + 78, hy - 22], pr = [hx1 - 78, hy - 22];
			const pivots = [pl, pl, pr, pr];
			const angles = [116, 166, 64, 14], lens = [430, 290, 360, 300], thick = [42, 24, 32, 30];
			const shapes = ['main', 'driver', 'saw', 'small'];
			const blade = (kind, L, T) => {
				const end = `H -${T} A ${T} ${T} 0 0 1 -${T} -${T} Z`;
				if (kind === 'driver') {
					return `M -${T} -${T} H ${L - 62} L ${L - 54} ${-T + 14} Q ${L - 42} ${-T + 20} ${L - 32} ${-T + 12} L ${L - 26} -${T} H ${L - 8} Q ${L} -${T} ${L} ${-T + 8} V ${T - 8} Q ${L} ${T} ${L - 8} ${T} ${end}`;
				}
				if (kind === 'saw') {
					let p = `M -${T} -${T} H ${L - 70} Q ${L - 14} -${T} ${L} ${-T * 0.3} L ${L - 36} ${T}`;
					for (let x = L - 36; x > 54; x -= 17) {
						p += ` L ${x - 8} ${T - 11} L ${x - 17} ${T}`;
					}
					return p + ` ${end}`;
				}
				return `M -${T} -${T} H ${L * 0.72} Q ${L * 0.94} -${T} ${L} ${-T * 0.3} Q ${L * 0.86} ${T} ${L * 0.6} ${T} ${end}`;
			};
			let g = circle(hx1 + 20, hy, 36, { fill: 'none', sw: 7 });
			let html = '';
			items.forEach((it, i) => {
				const [px, py] = pivots[i], a = angles[i], L = lens[i], T = thick[i], tone = it.tone ?? 'blue';
				const hi = !!it.hi;
				const nick = shapes[i] === 'main' || shapes[i] === 'small' ? `<path d="M ${r1(L * 0.2)} ${-T + 12} q 18 -9 36 0" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>` : '';
				const bevel = shapes[i] === 'main' || shapes[i] === 'small' ? `<path d="M ${r1(L * 0.12)} ${r1(T * 0.45)} H ${r1(L * 0.58)}" fill="none" stroke="${mix(tone, hi ? 60 : 32)}" stroke-width="4" stroke-linecap="round"/>` : '';
				g += `<g transform="translate(${px} ${py}) rotate(${-a})"><path d="${blade(shapes[i], L, T)}" fill="${mix(tone, hi ? 34 : 13)}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>${bevel}${nick}</g>`;
				const rad = a * Math.PI / 180, tx = px + Math.cos(rad) * (L + 18), ty = py - Math.sin(rad) * (L + 18);
				const lw = 270;
				if (a > 140) {
					html += toolLabel(n, it, tx - lw, ty - 34, lw, { align: 'right' });
				} else if (a < 40) {
					html += toolLabel(n, it, tx, ty - 34, lw, { align: 'left' });
				} else {
					html += toolLabel(n, it, tx - lw / 2, ty - 78, lw, { align: 'mid' });
				}
			});
			// The handle: the steel liner, the scale with two ridges, the agent's badge, the rivets.
			g += rect(hx0 - 8, hy - hh / 2 - 8, hx1 - hx0 + 16, hh + 16, { rx: (hh + 16) / 2, fill: '#fff' })
				+ rect(hx0, hy - hh / 2, hx1 - hx0, hh, { rx: hh / 2, fill: mix('neutral', 16) })
				+ line(hx0 + 150, hy - 40, hx1 - 150, hy - 40, { stroke: 'var(--faint)', sw: 4 })
				+ line(hx0 + 150, hy + 40, hx1 - 150, hy + 40, { stroke: 'var(--faint)', sw: 4 })
				+ rect(864 - 48, hy - 48, 96, 96, { rx: 26, fill: 'var(--purple)' });
			[pl, pr].forEach(([px, py]) => {
				g += circle(px, py, 15, { fill: 'var(--surface)' }) + circle(px, py, 4, { fill: 'var(--ink)', sw: 0 });
			});
			html += icAt(`${n}-ic`, 864, hy, s.badge?.icon ?? 'bot', 56, '#fff');
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The agent (a purple bot) wearing a leather tool belt: four tools sit in its loops, one per tool (an icon on the
	 * tool's head), each named under it; the highlighted one is solid, the rest muted. Fields: eyebrow, title, items (4):
	 * [{ icon, name, sub, tone, hi }]. */
	'sd-toolbelt': {
		css: common('sd-toolbelt') + labelCss('sd-toolbelt'),
		render(s) {
			const n = 'sd-toolbelt';
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 4);
			const cx = 864;
			const LEATHER = 'color-mix(in srgb, var(--orange) 42%, var(--yellow-tint))';
			const LOOP = 'color-mix(in srgb, var(--orange) 28%, var(--yellow-tint))';
			let g = '', html = '';
			// The bot: antenna, head, ears, face, neck, arms, body.
			g += line(cx, 30, cx, 66, { sw: 6 }) + circle(cx, 26, 15, { fill: 'var(--purple)' })
				+ rect(cx - 168, 108, 30, 56, { rx: 12, fill: 'var(--purple)' }) + rect(cx + 138, 108, 30, 56, { rx: 12, fill: 'var(--purple)' })
				+ rect(cx - 144, 62, 288, 160, { rx: 46, fill: mix('purple', 20) })
				+ rect(cx - 110, 88, 220, 108, { rx: 32, fill: '#fff' })
				+ rect(cx - 62, 112, 26, 38, { rx: 13, fill: 'var(--ink)', sw: 0 }) + rect(cx + 36, 112, 26, 38, { rx: 13, fill: 'var(--ink)', sw: 0 })
				+ `<path d="M ${cx - 30} 168 Q ${cx} 186 ${cx + 30} 168" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>`
				+ rect(cx - 44, 220, 88, 26, { rx: 8, fill: mix('purple', 34) });
			const tl = cx - 350, tr = cx + 350, tt = 244, tb = 548;
			[-1, 1].forEach(d => {
				const sx = cx + d * 344, ex = cx + d * 410, hx = cx + d * 396;
				const arm = `M ${sx} 300 L ${ex} 410 L ${hx} 492`;
				g += `<path d="${arm}" fill="none" stroke="var(--ink)" stroke-width="56" stroke-linecap="round" stroke-linejoin="round"/>`
					+ `<path d="${arm}" fill="none" stroke="${mix('purple', 20)}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>`
					+ circle(hx, 510, 34, { fill: mix('purple', 34) }) + circle(sx, 300, 30, { fill: mix('purple', 34) });
			});
			[cx - 150, cx + 86].forEach(lx => {
				g += rect(lx, tb - 12, 64, 44, { rx: 10, fill: mix('purple', 34) }) + rect(lx - 22, tb + 26, 108, 30, { rx: 15, fill: mix('purple', 20) });
			});
			g += rect(tl, tt, tr - tl, tb - tt, { rx: 64, fill: mix('purple', 20) });
			// The belt and its buckle.
			const by = 440, bh = 60;
			g += rect(tl - 8, by, tr - tl + 16, bh, { rx: 14, fill: LEATHER })
				+ line(tl + 14, by + 10, tr - 14, by + 10, { stroke: 'var(--ink)', sw: 3, extra: ' stroke-dasharray="8 10"' })
				+ line(tl + 14, by + bh - 10, tr - 14, by + bh - 10, { stroke: 'var(--ink)', sw: 3, extra: ' stroke-dasharray="8 10"' })
				+ rect(cx - 46, by - 10, 92, bh + 20, { rx: 16, fill: 'var(--yellow)' }) + rect(cx - 26, by + 8, 52, bh - 16, { rx: 8, fill: LEATHER })
				+ line(cx - 26, by + bh / 2, cx + 8, by + bh / 2, { sw: 6 });
			// The tools, each through a loop.
			items.forEach((it, i) => {
				const x = cx + [-282, -98, 98, 282][i];
				const tone = it.tone ?? 'blue', hi = !!it.hi;
				const head = 100, hyy = 300;
				g += rect(x - 16, hyy + head / 2, 32, 168, { rx: 14, fill: hi ? mix(tone, 40) : mix(tone, 16) })
					+ rect(x - head / 2, hyy - head / 2, head, head, { rx: 26, fill: hi ? 'var(--' + tone + ')' : mix(tone, 14) })
					+ rect(x - 32, by - 18, 64, bh + 36, { rx: 12, fill: LOOP })
					+ line(x - 22, by - 8, x - 22, by + bh + 8, { stroke: 'var(--ink)', sw: 3, extra: ' stroke-dasharray="7 8"' })
					+ line(x + 22, by - 8, x + 22, by + bh + 8, { stroke: 'var(--ink)', sw: 3, extra: ' stroke-dasharray="7 8"' });
				html += `<span class="t-${tone}">${icAt(`${n}-ic`, x, hyy, it.icon ?? 'box', 56, hi ? '#fff' : null)}</span>`;
				html += toolLabel(n, it, x - 120 + [-14, 0, 0, 14][i], 612, 240, { align: 'center', tile: 0 });
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Four studio doors down a corridor, one per tool: through each door's window you see what is made inside (a still,
	 * a drawn slide or test video), its name on a plate, what goes in and out on the floor below; over the highlighted
	 * door the on-air lamp is lit and light spills from under it, the others are dark and muted. Fields: eyebrow, title,
	 * items (4): [{ icon, name, sub, tone, hi, src, kind: 'slides' | 'test' }], lamp (the lit lamp's word, default
	 * 'On air'). */
	'sd-doors': {
		css: common('sd-doors') + previewCss('sd-doors') + `
.sd-doors .sd-doors-plate { position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--fg); }
.sd-doors .sd-doors-name { font-size: 27px; font-weight: 600; color: var(--body); white-space: nowrap; }
.sd-doors .sd-doors-plate.hi .sd-doors-name { color: var(--ink); }
.sd-doors .sd-doors-io { position: absolute; font-size: 25px; color: var(--muted); text-align: center; white-space: nowrap; }
.sd-doors .sd-doors-io.hi { color: var(--purple); font-weight: 600; }
.sd-doors .sd-doors-lamp { position: absolute; font-size: 22px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #fff; text-align: center; white-space: nowrap; line-height: 1; }
`,
		render(s) {
			const n = 'sd-doors';
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 4);
			const floor = 572, step = 420;
			let g = rect(0, floor - 14, W, 14, { rx: 0, fill: 'var(--surface)', sw: 0 }) + line(0, floor, W, floor, { stroke: 'var(--line-strong)', sw: 6 });
			let html = '';
			items.forEach((it, i) => {
				const cx = W / 2 + (i - 1.5) * step, tone = it.tone ?? 'blue', hi = !!it.hi;
				const dx = cx - 136, dw = 272, dy = 112;
				// The lamp over the door.
				g += line(cx, 76, cx, 96, { sw: 5 }) + rect(cx - 92, 10, 184, 62, { rx: 31, fill: hi ? 'var(--purple)' : 'var(--surface)' });
				if (hi) {
					html += t(`${n}-lamp`, at(cx - 92, 30, 184), fmt(s.lamp ?? 'On air'), { nolint: true });
					g += line(cx - 122, 24, cx - 140, 14, { stroke: 'var(--purple)', sw: 5 }) + line(cx - 126, 46, cx - 148, 46, { stroke: 'var(--purple)', sw: 5 })
						+ line(cx + 122, 24, cx + 140, 14, { stroke: 'var(--purple)', sw: 5 }) + line(cx + 126, 46, cx + 148, 46, { stroke: 'var(--purple)', sw: 5 });
					g += poly([[dx + 8, floor], [dx + dw - 8, floor], [dx + dw + 70, floor + 46], [dx - 70, floor + 46]], ` fill="${mix('purple', 22)}"`);
				}
				// The frame, the door, the window, the plate, the handle, the kick plate.
				g += rect(dx - 20, dy - 20, dw + 40, floor - dy + 20, { rx: 14, fill: 'var(--surface)' })
					+ rect(dx, dy, dw, floor - dy, { rx: 8, fill: mix(tone, hi ? 26 : 9) })
					+ rect(dx + 18, dy + 30, dw - 36, 178, { rx: 16, fill: '#fff' })
					+ rect(dx + 28, 336, dw - 56, 58, { rx: 12, fill: '#fff' })
					+ rect(dx - 6, dy + 50, 12, 44, { rx: 4, fill: 'var(--ink)', sw: 0 }) + rect(dx - 6, floor - 124, 12, 44, { rx: 4, fill: 'var(--ink)', sw: 0 })
					+ circle(dx + dw - 40, 462, 15, { fill: 'var(--surface)' }) + rect(dx + dw - 100, 454, 62, 16, { rx: 8, fill: 'var(--ink)', sw: 0 })
					+ rect(dx + 18, floor - 50, dw - 36, 34, { rx: 8, fill: mix(tone, hi ? 40 : 16) });
				html += preview(n, dx + 28, dy + 40, dw - 56, 158, it, { bar: 26, mute: !hi });
				html += `<div class="${n}-plate t-${tone}${hi ? ' hi' : ''}" style="${at(dx + 28, 336, dw - 56, 58)}" data-shape>${ic(it.icon ?? 'box', 28)}${t(`${n}-name`, '', fmt(it.name ?? ''), { nolint: true })}</div>`;
				if (it.sub) {
					html += t(`${n}-io${hi ? ' hi' : ''}`, at(cx - 180, floor + 62, 360), fmt(it.sub), { nolint: true });
				}
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},
	/** One push from the pull request and six dominoes fall, one per step (the pips count them; the first ones are already
	 * falling), into the finished screen. Fields: eyebrow, title, start: { icon (default 'pr'), title }, steps (6): [{
	 * icon, title, sub, tone }], end: { src, title, sub }, falling (how many dominoes already tip over, default 3). */
	'sd-dominoes': {
		css: common('sd-dominoes') + `
.sd-dominoes .sd-dominoes-tile { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: 18px; background: #fff; transform-origin: 100% 100%; overflow: hidden; }
.sd-dominoes .sd-dominoes-top { position: absolute; left: 0; right: 0; top: 0; background: var(--tint); color: var(--fg); display: grid; place-items: center; border-bottom: ${SW}px solid var(--ink); }
.sd-dominoes .sd-dominoes-pip { position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: var(--fg); }
.sd-dominoes .sd-dominoes-start { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: ${R}px; background: var(--blue-tint); color: var(--blue); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 12px; }
.sd-dominoes .sd-dominoes-stt { font-size: 24px; font-weight: 600; color: var(--ink); text-align: center; line-height: 1.15; }
.sd-dominoes .sd-dominoes-step { color: var(--fg); }
`,
		render(s) {
			const n = 'sd-dominoes';
			const H = bodyHeight(s);
			const steps = (s.steps ?? []).slice(0, 6);
			const floor = 470, dw = 104, dh = 236, x0 = 262, gap = 196;
			const falling = s.falling ?? 3;
			const angles = [33, 29, 12, 0, 0, 0];
			let g = line(0, floor + SW / 2, W, floor + SW / 2, { stroke: 'var(--line-strong)', sw: 6 });
			let html = '';
			const st = s.start ?? {};
			html += `<div class="${n}-start" style="${at(0, floor - 200, 190, 200)}">${ic(st.icon ?? 'pr', 56)}${t(`${n}-stt`, '', fmt(st.title ?? ''), { nolint: true })}</div>`;
			g += `<path d="M 196 ${floor - 150} Q 228 ${floor - 190} ${x0 + 6} ${floor - 186}" fill="none" stroke="var(--blue)" stroke-width="${SW}" stroke-linecap="round"/>`
				+ `<path d="M ${x0 - 14} ${floor - 200} L ${x0 + 6} ${floor - 186} L ${x0 - 12} ${floor - 170}" fill="none" stroke="var(--blue)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			steps.forEach((it, i) => {
				const x = x0 + i * gap;
				const a = i < falling ? angles[i] : 0;
				const tone = it.tone ?? 'blue';
				const top = dh * 0.5;
				const pips = (PIPS[i + 1] ?? []).map(([fx, fy]) => `<span class="${n}-pip" style="left:${r1(fx * (dw - 2 * SW))}px;top:${r1(top + fy * (dh - top - 2 * SW))}px"></span>`).join('');
				html += `<div class="${n}-tile t-${tone}" style="${at(x, floor - dh, dw, dh)};transform:rotate(${a}deg)"><div class="${n}-top" style="height:${r1(top)}px">${ic(it.icon ?? 'circle', 52)}</div>${pips}</div>`;
				if (a > 0) {
					g += `<path d="M ${x + dw / 2 - 40} ${floor - dh - 26} q 40 -26 84 -6" fill="none" stroke="var(--faint)" stroke-width="${SW}" stroke-linecap="round" transform="rotate(${a} ${x + dw} ${floor})"/>`;
				}
				html += t(`${n}-lab ${n}-c ${n}-step t-${tone}`, at(x + dw / 2 - 90, floor + 26, 180), fmt(it.title ?? ''), { nolint: true });
				if (it.sub) {
					html += t(`${n}-sub ${n}-c`, at(x + dw / 2 - 92, floor + 62, 184), fmt(it.sub));
				}
			});
			const end = s.end ?? {};
			const ex = x0 + 5 * gap + dw + 70, ew = W - ex, eh = Math.round(ew * 9 / 16) + 44 + SW * 3;
			const ey = floor - 80 - eh;
			g += rect(ex + ew / 2 - 10, ey + eh - 4, 20, floor - ey - eh + 4, { rx: 6, fill: 'var(--ink)', sw: 0 }) + rect(ex + ew / 2 - 70, floor - 18, 140, 18, { rx: 9, fill: 'var(--ink)', sw: 0 });
			html += screen(n, ex, ey, ew, eh, { src: end.src, tone: 'green', bar: 44, prog: 0.12 });
			if (end.title) {
				html += t(`${n}-lab ${n}-c`, at(ex, floor + 26, ew), fmt(end.title), { nolint: true });
			}
			if (end.sub) {
				html += t(`${n}-sub ${n}-c`, at(ex, floor + 62, ew), fmt(end.sub), { nolint: true });
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A patch bay: the words on a screen each plug, by a green cable, into the socket of their source; unused sockets
	 * are grey; one word has no source: its red cable hangs loose and it never renders. Fields: eyebrow, title, kicker (a
	 * line at the top of the screen), words: [{ text, to (socket index), mono, big }], sockets: [{ label, icon }], loose: {
	 * text, label } (the unsourced word and what happens to it), panel (a line under the sockets). */
	'sd-patch': {
		css: common('sd-patch') + `
.sd-patch .sd-patch-chip { position: absolute; box-sizing: border-box; height: 64px; border: ${SW}px solid var(--ink); border-radius: 12px; background: #fff; display: flex; align-items: center; padding: 0 20px; font-size: 27px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.sd-patch .sd-patch-chip.big { font-size: 31px; }
.sd-patch .sd-patch-chip.mono { font-family: var(--mono); font-size: 24px; font-weight: 600; }
.sd-patch .sd-patch-chip.bad { border-color: var(--red); border-style: dashed; background: var(--red-tint); color: var(--red); }
.sd-patch .sd-patch-kick { position: absolute; font-family: var(--mono); font-size: 20px; color: var(--muted); white-space: nowrap; }
.sd-patch .sd-patch-sock { position: absolute; font-size: 26px; font-weight: 600; color: var(--ink); white-space: nowrap; line-height: 1; }
.sd-patch .sd-patch-sock.off { color: var(--muted); font-weight: 400; }
.sd-patch .sd-patch-bad { color: var(--red); }
`,
		render(s) {
			const n = 'sd-patch';
			const H = bodyHeight(s);
			const words = s.words ?? [];
			const sockets = s.sockets ?? [];
			const scr = { x: 0, y: 6, w: 800, h: 590 };
			const px = 1190, pw = W - px, py = 6, ph = 560;
			const rowY = i => 112 + i * 92;
			const sockY = i => py + 52 + i * ((ph - 104) / Math.max(1, sockets.length - 1));
			const scx = px + 64;
			const chipW = w => Math.round((w.mono ? 14.6 : w.big ? 16.6 : 14.4) * [...String(w.text)].length + 48);
			let html = screen(n, scr.x, scr.y, scr.w, scr.h, { tone: 'neutral', bar: 48, prog: 0.55, icon: 'circle' }).replace(`<div class="${n}-scr-pic">`, `<div class="${n}-scr-pic" style="background:#fff">`);
			html = html.replace(/<span class="ic"[^]*?<\/span>(?=<\/div><div class="sd-patch-scr-bar")/, '');
			if (s.kicker) {
				html += t(`${n}-kick`, at(40, 38), fmt(s.kicker), { nolint: true });
			}
			let under = '', over = '';
			const used = new Set();
			const all = [...words.map(w => ({ ...w })), ...(s.loose ? [{ text: s.loose.text, loose: true }] : [])];
			all.forEach((w, i) => {
				const y = rowY(i), cw = chipW(w);
				html += t(`${n}-chip${w.big ? ' big' : ''}${w.mono ? ' mono' : ''}${w.loose ? ' bad' : ''}`, at(40, y - 32, cw), fmt(w.text), { nolint: true });
				const jx = 40 + cw;
				if (w.loose) {
					const ex = 960, ey = H - 56;
					over += `<path d="M ${jx} ${y} C ${jx + 120} ${y} ${ex - 60} ${y + 20} ${ex} ${ey - 40}" fill="none" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>`
						+ `<path d="M ${jx} ${y} C ${jx + 120} ${y} ${ex - 60} ${y + 20} ${ex} ${ey - 40}" fill="none" stroke="var(--red)" stroke-width="7" stroke-linecap="round"/>`
						+ rect(ex - 18, ey - 44, 36, 48, { rx: 8, fill: 'var(--red)' }) + line(ex - 8, ey + 4, ex - 8, ey + 22, { sw: 5 }) + line(ex + 8, ey + 4, ex + 8, ey + 22, { sw: 5 });
					html += icAt(`${n}-ic t-red`, ex - 58, ey - 16, 'dismissCircle', 40);
					if (s.loose.label) {
						html += t(`${n}-lab ${n}-bad`, `${at(ex - 480, ey - 32, 392)};text-align:right;white-space:nowrap`, fmt(s.loose.label));
					}
					return;
				}
				const k = w.to ?? i;
				used.add(k);
				const sy = sockY(k);
				const d = `M ${jx} ${y} C ${jx + 160} ${y + 10} ${scx - 260} ${sy + 90} ${scx - 34} ${sy}`;
				over += `<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--green)" stroke-width="7" stroke-linecap="round"/>`
					+ circle(jx, y, 9, { fill: 'var(--green)' });
			});
			let g = rect(px, py, pw, ph, { fill: 'var(--surface)' });
			sockets.forEach((so, k) => {
				const sy = sockY(k), on = used.has(k);
				g += circle(scx, sy, 30, { fill: on ? 'var(--green-tint)' : '#fff', stroke: on ? 'var(--ink)' : 'var(--faint)' }) + circle(scx, sy, 11, { fill: on ? 'var(--ink)' : 'var(--faint)', sw: 0 });
				html += icAt(`${n}-ic t-${on ? 'green' : 'neutral'}`, scx + 66, sy, so.icon ?? 'circle', 34, on ? null : 'var(--faint)');
				html += t(`${n}-sock${on ? '' : ' off'}`, at(scx + 102, sy - 14, pw - 180), fmt(so.label ?? ''), { nolint: true });
			});
			over += [...used].map(k => rect(scx - 46, sockY(k) - 12, 24, 24, { rx: 6, fill: 'var(--ink)', sw: 0 })).join('');
			if (s.panel) {
				html += t(`${n}-sub`, at(px, py + ph + 18, pw), fmt(s.panel));
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}${svg(`${n}-svg`, W, H, over)}</div>`, { vcenter: false });
		},
	},

	/** Two lanes of dots, one per second: on the top lane the video plays all of them; on the bottom lane it is made in
	 * a few (one coloured run per part), and a flag marks where it is done, tied to the same second on the top lane.
	 * Fields: eyebrow, title, total (seconds, default 100), unit (default 's'), watch: { icon, label }, make: { icon,
	 * label }, parts: [{ value, label, tone }], done (the flag's label), note (a line in the empty part of the lane). */
	'sd-race': {
		css: common('sd-race') + `
.sd-race .sd-race-big { position: absolute; font-size: 60px; font-weight: 600; line-height: 1; letter-spacing: -.02em; color: var(--fg); white-space: nowrap; }
.sd-race .sd-race-end { color: var(--ink); }
.sd-race .sd-race-flag { position: absolute; font-size: 26px; font-weight: 700; color: #fff; white-space: nowrap; line-height: 1; }
.sd-race .sd-race-note { position: absolute; font-size: 30px; line-height: 1.3; color: var(--body); }
.sd-race .sd-race-lane { position: absolute; font-size: 28px; font-weight: 600; color: var(--ink); white-space: nowrap; }
`,
		render(s) {
			const n = 'sd-race';
			const H = bodyHeight(s);
			const total = s.total ?? 100, unit = s.unit ?? 's';
			const parts = s.parts ?? [];
			const made = parts.reduce((a, p) => a + p.value, 0);
			const per = Math.ceil(total / 2);
			const x0 = 262, pitch = 26, gg = 20, rowGap = 30;
			const dx = i => x0 + (i % per) * pitch + Math.floor((i % per) / 10) * gg;
			const dy = (y, i) => y + Math.floor(i / per) * rowGap;
			const yA = 150, yB = 440;
			let g = '', html = '';
			html += screen(n, 0, yA - 56, 160, 112, { tone: 'neutral', bar: 28, prog: 0.6, icon: 'play' });
			html += `<div style="${at(20, yB - 50, 120, 120)};position:absolute;box-sizing:border-box;border:${SW}px solid var(--ink);border-radius:50%;background:var(--purple-tint);color:var(--purple);display:grid;place-items:center">${ic(s.make?.icon ?? 'bot', 64)}</div>`;
			if (s.watch?.label) {
				html += t(`${n}-lane`, at(0, yA + 72), fmt(s.watch.label), { nolint: true });
			}
			if (s.make?.label) {
				html += t(`${n}-lane`, at(0, yB + 86), fmt(s.make.label), { nolint: true });
			}
			// Top lane: every second of the video.
			for (let i = 0; i < total; i++) {
				const hit = i === made - 1;
				g += circle(dx(i), dy(yA, i), hit ? 11 : 9, { fill: hit ? 'var(--green)' : 'var(--faint)', sw: 0 });
			}
			const xe = dx(per - 1) + 34;
			g += line(xe, yA + rowGap + 16, xe, yA - 96, { sw: 5 }) + `<path d="M ${xe} ${yA - 96} L ${xe + 58} ${yA - 80} L ${xe} ${yA - 64} Z" fill="var(--ink)" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			html += t(`${n}-big ${n}-end`, `${at(xe - 250, yA - 102, 234)};text-align:right`, `${total} ${esc(unit)}`, { nolint: true });
			// Bottom lane: the parts, then nothing.
			let i0 = 0;
			parts.forEach((p, k) => {
				const tone = p.tone ?? 'blue';
				for (let i = i0; i < i0 + p.value; i++) {
					g += circle(dx(i), dy(yB, i), 11, { fill: `var(--${tone})`, sw: 0 });
				}
				const a = dx(i0) - 12, b = dx(i0 + p.value - 1) + 12;
				g += `<path d="M ${a} ${yB + rowGap + 22} L ${a} ${yB + rowGap + 34} L ${b} ${yB + rowGap + 34} L ${b} ${yB + rowGap + 22}" fill="none" stroke="var(--${tone})" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
				html += t(`${n}-big t-${tone}`, at(a, yB + rowGap + 56), `${p.value} ${esc(unit)}`, { nolint: true });
				html += t(`${n}-sub`, at(a, yB + rowGap + 124), fmt(p.label ?? ''), { nolint: true });
				i0 += p.value;
			});
			for (let i = made; i < total; i++) {
				g += circle(dx(i), dy(yB, i), 8, { fill: 'none', stroke: 'var(--line-strong)', sw: 3 });
			}
			// The flag where it is done, tied to the same second of the video.
			const xf = dx(made - 1) + 22;
			g += line(dx(made - 1), yA + 18, dx(made - 1), yB - 26, { stroke: 'var(--green)', sw: 4, extra: ' stroke-dasharray="2 12"' })
				+ line(xf, yB + 16, xf, yB - 130, { sw: 5 }) + `<path d="M ${xf} ${yB - 130} L ${xf + 116} ${yB - 130} L ${xf + 98} ${yB - 108} L ${xf + 116} ${yB - 86} L ${xf} ${yB - 86} Z" fill="var(--green)" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
			if (s.done) {
				html += `<div style="${at(xf + 4, yB - 126, 94, 36)};position:absolute;display:grid;place-items:center" data-shape>${t(`${n}-flag`, 'position:static', fmt(s.done), { nolint: true }).replace(' data-t', ' data-t data-on="#107c10"')}</div>`;
			}
			if (s.note) {
				html += t(`${n}-note`, at(dx(made + 12), yB - 112, Math.min(640, W - dx(made + 12))), fmt(s.note));
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	'sd-mailroom': {
		css: common('sd-mailroom') + `
.sd-mailroom .sd-mailroom-msg { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: ${R}px; background: #fff; padding: 22px 24px; display: flex; gap: 16px; align-items: flex-start; }
.sd-mailroom .sd-mailroom-av { flex: none; width: 52px; height: 52px; border-radius: 50%; background: var(--blue-tint); color: var(--blue); display: grid; place-items: center; }
.sd-mailroom .sd-mailroom-txt { font-size: 28px; font-weight: 600; line-height: 1.25; color: var(--ink); }
.sd-mailroom .sd-mailroom-ch { position: absolute; font-family: var(--mono); font-size: 22px; color: var(--muted); white-space: nowrap; }
.sd-mailroom .sd-mailroom-head { position: absolute; font-size: 30px; font-weight: 600; color: var(--fg); white-space: nowrap; }
.sd-mailroom .sd-mailroom-pl { color: var(--purple); }
.sd-mailroom .sd-mailroom-head.sd-mailroom-ink { color: var(--ink); }
.sd-mailroom .sd-mailroom-tag { position: absolute; font-size: 20px; font-weight: 600; color: var(--purple); white-space: nowrap; text-align: center; }
`,
		render(s) {
			const n = 'sd-mailroom';
			const H = bodyHeight(s);
			let g = '', html = '';
			const ask = s.ask ?? {};
			const mx = 0, my = 264, mw = 430, mh = 132;
			if (ask.channel) {
				html += t(`${n}-ch`, at(mx + 4, my - 44), fmt(ask.channel), { nolint: true });
			}
			html += `<div class="${n}-msg" style="${at(mx, my, mw, mh)}" data-fit><span class="${n}-av">${ic('person', 30)}</span>${t(`${n}-txt`, '', fmt(ask.text ?? ''))}</div>`;
			// The agent at its desk.
			const cx = 640, cy = 330, cr = 104;
			g += `<path d="M ${mx + mw + 10} ${my + mh / 2} L ${cx - cr - 30} ${cy}" stroke="var(--blue)" stroke-width="${SW}" stroke-linecap="round" fill="none"/>`
				+ `<path d="M ${cx - cr - 48} ${cy - 16} L ${cx - cr - 28} ${cy} L ${cx - cr - 48} ${cy + 16}" stroke="var(--blue)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
				+ circle(cx, cy, cr, { fill: 'var(--purple-tint)' }) + rect(cx - 150, cy + cr + 10, 300, 26, { rx: 13, fill: 'var(--ink)', sw: 0 })
				+ rect(cx - 126, cy + cr + 36, 18, 70, { rx: 6, fill: 'var(--ink)', sw: 0 }) + rect(cx + 108, cy + cr + 36, 18, 70, { rx: 6, fill: 'var(--ink)', sw: 0 });
			html += icAt(`${n}-ic t-purple`, cx, cy, s.clerk?.icon ?? 'bot', 116);
			if (s.clerk?.label) {
				html += t(`${n}-lab ${n}-c ${n}-pl`, at(cx - 170, cy + cr + 118, 340), fmt(s.clerk.label), { nolint: true });
			}
			// Two pigeonholes on the right.
			const bx = 930, bw = W - bx;
			const top = { y: 0, h: 232 }, bot = { y: 272, h: H - 272 - 8 };
			g += rect(bx, top.y, bw, top.h, { fill: 'var(--surface)' }) + rect(bx, bot.y, bw, bot.h, { fill: mix('purple', 8) });
			g += `<path d="M ${cx + cr + 16} ${cy - 30} C ${cx + cr + 110} ${cy - 90} ${bx - 120} ${top.y + 130} ${bx - 18} ${top.y + 130}" stroke="var(--faint)" stroke-width="${SW}" stroke-linecap="round" fill="none"/>`
				+ `<path d="M ${bx - 36} ${top.y + 114} L ${bx - 18} ${top.y + 130} L ${bx - 36} ${top.y + 146}" stroke="var(--faint)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
				+ `<path d="M ${cx + cr + 16} ${cy + 30} C ${cx + cr + 110} ${cy + 90} ${bx - 120} ${bot.y + 180} ${bx - 22} ${bot.y + 180}" stroke="var(--purple)" stroke-width="${SW + 4}" stroke-linecap="round" fill="none"/>`
				+ `<path d="M ${bx - 46} ${bot.y + 158} L ${bx - 20} ${bot.y + 180} L ${bx - 46} ${bot.y + 202}" stroke="var(--purple)" stroke-width="${SW + 4}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
			const rd = s.read ?? {}, vd = s.video ?? {};
			html += t(`${n}-head ${n}-ink`, at(bx + 32, top.y + 26), fmt(rd.title ?? ''), { nolint: true });
			if (rd.sub) {
				html += t(`${n}-sub`, at(bx + 32, top.y + 70, 300), fmt(rd.sub), { nolint: true });
			}
			const nl = rd.count ?? 4;
			for (let i = 0; i < nl; i++) {
				const ex = bx + 344 + i * 96, ey = top.y + 58 + wob(i) * 8, ew = 136, eh = 112;
				g += `<g transform="rotate(${r1(-6 + wob(i, 3) * 4)} ${ex + ew / 2} ${ey + eh / 2})">${rect(ex, ey, ew, eh, { rx: 12 })}<path d="M ${ex + 4} ${ey + 8} L ${ex + ew / 2} ${ey + 54} L ${ex + ew - 4} ${ey + 8}" fill="none" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
					+ line(ex + 22, ey + 76, ex + ew - 22, ey + 76, { stroke: 'var(--green)', sw: 6 }) + line(ex + 22, ey + 92, ex + ew - 52, ey + 92, { stroke: 'var(--red)', sw: 6 }) + '</g>';
			}
			html += t(`${n}-head t-purple`, at(bx + 32, bot.y + 26), fmt(vd.title ?? ''), { nolint: true });
			if (vd.sub) {
				html += t(`${n}-sub`, at(bx + 32, bot.y + 70, 600), fmt(vd.sub), { nolint: true });
			}
			const np = vd.count ?? 3;
			for (let i = 0; i < np; i++) {
				const pw = 196, ph = 186, step = pw + 40, ox = bx + (bw - (np * pw + (np - 1) * 40 + 26)) / 2 + i * step, py = bot.y + bot.h - ph - 34;
				g += `<path d="M ${ox} ${py} L ${ox + 26} ${py - 26} L ${ox + pw + 26} ${py - 26} L ${ox + pw + 26} ${py + ph - 26} L ${ox + pw} ${py + ph}" fill="${mix('purple', 30)}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
					+ rect(ox, py, pw, ph, { rx: 10, fill: mix('purple', 16) }) + rect(ox + pw / 2 - 14, py, 28, ph, { rx: 0, fill: mix('yellow', 55), sw: 0 })
					+ line(ox + pw / 2 - 14, py + 2, ox + pw / 2 - 14, py + ph - 2, { sw: 3 }) + line(ox + pw / 2 + 14, py + 2, ox + pw / 2 + 14, py + ph - 2, { sw: 3 })
					+ rect(ox, py, pw, ph, { rx: 10, fill: 'none' });
				html += screen(n, ox + 20, py + 44, pw - 40, 100, { tone: 'purple', bar: 26, prog: 0.25 + i * 0.25, icon: 'play' });
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A light table of real stills (one row per kind, a small tag under each), all muted but one, which a big loupe
	 * magnifies on the right. Fields: eyebrow, title, rows (2): [{ label, items (4): [{ src, tag }] }], focus: [row, col],
	 * caption (under the loupe). */
	'sd-loupe': {
		css: common('sd-loupe') + `
.sd-loupe .sd-loupe-th { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: 12px; overflow: hidden; background: #fff; }
.sd-loupe .sd-loupe-th img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sd-loupe .sd-loupe-th.mute { opacity: .42; border-color: var(--faint); }
.sd-loupe .sd-loupe-th.on { border-color: var(--blue); box-shadow: 0 0 0 4px var(--blue); }
.sd-loupe .sd-loupe-tag { position: absolute; font-family: var(--mono); font-size: 20px; color: var(--muted); white-space: nowrap; text-align: center; }
.sd-loupe .sd-loupe-tag.on { color: var(--blue); font-weight: 600; }
.sd-loupe .sd-loupe-cap { position: absolute; font-size: 26px; font-weight: 600; color: var(--ink); text-align: center; white-space: nowrap; }
`,
		render(s) {
			const n = 'sd-loupe';
			const H = bodyHeight(s);
			const rows = (s.rows ?? []).slice(0, 2);
			const [fr, fc] = s.focus ?? [0, 0];
			const tx = 0, ty = 10, tw = 1080, th = 600;
			const tw1 = 228, th1 = Math.round(tw1 * 9 / 16), gx = 26;
			let g = rect(tx, ty, tw, th, { fill: mix('blue', 5) });
			let html = '';
			let focusBox = null;
			rows.forEach((row, r) => {
				const ly = ty + 34 + r * 282;
				html += t(`${n}-caps`, at(tx + 40, ly), fmt(row.label ?? ''), { nolint: true });
				(row.items ?? []).slice(0, 4).forEach((it, c) => {
					const x = tx + 40 + c * (tw1 + gx), y = ly + 44;
					const on = r === fr && c === fc;
					const a = asset(it.src);
					html += `<div class="${n}-th${on ? ' on' : ' mute'}" style="${at(x, y, tw1, th1)}">${a ? `<img src="${a}" alt="">` : `<span data-missing="${esc(it.src)}"></span>`}</div>`;
					if (it.tag) {
						html += t(`${n}-tag${on ? ' on' : ''}`, at(x, y + th1 + 14, tw1), fmt(it.tag), { nolint: true });
					}
					if (on) {
						focusBox = { x, y, w: tw1, h: th1, src: it.src };
					}
				});
			});
			// The loupe.
			const cx = 1392, cy = 300, rr = 250;
			if (focusBox) {
				const a = asset(focusBox.src);
				const p1 = [cx + rr * Math.cos(-2.2), cy + rr * Math.sin(-2.2)], p2 = [cx + rr * Math.cos(2.35), cy + rr * Math.sin(2.35)];
				g += `<polygon points="${focusBox.x + focusBox.w},${focusBox.y} ${r1(p1[0])},${r1(p1[1])} ${r1(p2[0])},${r1(p2[1])} ${focusBox.x + focusBox.w},${focusBox.y + focusBox.h}" fill="${mix('blue', 10)}"/>`
					+ line(focusBox.x + focusBox.w, focusBox.y, p1[0], p1[1], { stroke: 'var(--blue)', sw: 4, extra: ' stroke-dasharray="2 12"' })
					+ line(focusBox.x + focusBox.w, focusBox.y + focusBox.h, p2[0], p2[1], { stroke: 'var(--blue)', sw: 4, extra: ' stroke-dasharray="2 12"' });
				const iw = rr * 2 * 16 / 9 * 1.02, ih = iw * 9 / 16;
				g += `<line x1="${cx + rr * 0.72}" y1="${cy + rr * 0.72}" x2="${cx + rr * 1.17}" y2="${cy + rr * 1.17}" stroke="var(--ink)" stroke-width="58" stroke-linecap="round"/>`
					+ `<line x1="${cx + rr * 0.78}" y1="${cy + rr * 0.78}" x2="${cx + rr * 0.9}" y2="${cy + rr * 0.9}" stroke="var(--blue)" stroke-width="58"/>`
					+ `<clipPath id="${n}-clip"><circle cx="${cx}" cy="${cy}" r="${rr}"/></clipPath>`
					+ circle(cx, cy, rr, { fill: '#000', sw: 0 })
					+ (a ? `<image href="${a}" x="${r1(cx - iw / 2)}" y="${r1(cy - ih / 2)}" width="${r1(iw)}" height="${r1(ih)}" clip-path="url(#${n}-clip)" preserveAspectRatio="xMidYMid slice"/>` : '')
					+ circle(cx, cy, rr + 9, { fill: 'none', sw: 22 }) + circle(cx, cy, rr - 4, { fill: 'none', stroke: 'var(--blue)', sw: 4 });
			}
			if (s.caption) {
				html += t(`${n}-cap`, at(cx - 230, cy + rr + 44, 460), fmt(s.caption), { nolint: true });
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Two wooden wall shelves (grain, brackets, a bookend at each end): one video tape per video (a labelled spine, a
	 * small window onto its spools, a play mark) and one binder per deck (a label holder, a finger ring), in groups of five with a
	 * clear gap between groups; the last item of a shelf leans on the bookend. Each total is big beside its shelf. Fields:
	 * eyebrow, title, shelves (2): [{ value (how many to draw), label, sub, tone, kind: 'tape' | 'binder' }]. */
	'sd-shelf': {
		css: common('sd-shelf') + `
.sd-shelf .sd-shelf-num { position: absolute; font-size: 150px; font-weight: 600; line-height: .9; letter-spacing: -.03em; color: var(--fg); }
.sd-shelf .sd-shelf-name { position: absolute; font-size: 36px; font-weight: 600; color: var(--ink); white-space: nowrap; }
`,
		render(s) {
			const n = 'sd-shelf';
			const H = bodyHeight(s);
			const shelves = (s.shelves ?? []).slice(0, 2);
			const bx0 = 0, bx1 = 1372, bt = 28, endW = 48, endH = 150;
			const xl = 34 + endW + 6, xr = 1300;
			const tops = [262, 612];
			const END = mix('neutral', 24);
			let g = '', over = '', html = '';
			shelves.forEach((sh, k) => {
				const tone = sh.tone ?? 'blue';
				const top = tops[k];
				const tape = sh.kind === 'tape';
				const count = Math.max(1, sh.value ?? 0);
				const groups = Math.ceil(count / 5);
				const gap = tape ? 2 : 4, ggap = tape ? 26 : 28, lean = tape ? 9 : 12;
				const reach = endH * Math.tan(lean * Math.PI / 180);
				const iw = (xr - reach - xl - (count - 1) * gap - (groups - 1) * (ggap - gap)) / count;
				const ih = tape ? 212 : 228;
				// The board: wood with grain, a knot, two brackets under it.
				g += rect(bx0, top, bx1 - bx0, bt, { rx: 6, fill: WOOD })
					+ `<path d="M ${bx0 + 24} ${top + 10} q 130 -5 260 0 t 260 0 t 260 0 t 260 0 t 260 0" fill="none" stroke="${GRAIN}" stroke-width="3" stroke-linecap="round"/>`
					+ `<path d="M ${bx0 + 150} ${top + 19} q 120 4 240 0 t 240 0 t 240 0 t 240 0" fill="none" stroke="${GRAIN}" stroke-width="3" stroke-linecap="round"/>`
					+ `<ellipse cx="${k ? 980 : 420}" cy="${top + 14}" rx="16" ry="5" fill="none" stroke="${GRAIN}" stroke-width="3"/>`;
				[[bx0 + 120, 1], [bx1 - 120, -1]].forEach(([bx, d]) => {
					g += `<path d="M ${bx} ${top + bt} H ${bx + d * 46} L ${bx} ${top + bt + 44} Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
						+ circle(bx + d * 13, top + bt + 13, 5, { fill: '#fff', sw: 3 });
				});
				// The bookends.
				const el = 34, er = xr;
				g += `<path d="M ${el} ${top} V ${top - 84} Q ${el} ${top - endH} ${el + endW} ${top - endH} V ${top} Z" fill="${END}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
					+ `<path d="M ${er + endW} ${top} V ${top - 84} Q ${er + endW} ${top - endH} ${er} ${top - endH} V ${top} Z" fill="${END}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
					+ circle(el + 28, top - 48, 9, { fill: '#fff', sw: 3 }) + circle(er + 20, top - 48, 9, { fill: '#fff', sw: 3 });
				// The items: in fives, the last one leaning on the right bookend.
				for (let i = 0; i < count; i++) {
					const last = i === count - 1 && count > 1;
					let x = xl + i * (iw + gap) + Math.floor(i / 5) * (ggap - gap);
					if (last) {
						x = xr - reach - iw;
					}
					const y = top - ih, cx = x + iw / 2;
					let it;
					if (tape) {
						const l1 = iw - 22 - Math.abs(wob(i, 3)) * 6, l2 = iw - 22 - Math.abs(wob(i, 7)) * 8;
						it = rect(x, y, iw, ih, { rx: 6, fill: mix(tone, 26) })
							+ rect(x + 5, y + 14, iw - 10, 70, { rx: 4, fill: '#fff', sw: 3 })
							+ line(x + 11, y + 32, x + 11 + l1, y + 32, { stroke: mix(tone, 70), sw: 3 })
							+ line(x + 11, y + 46, x + 11 + l2, y + 46, { stroke: mix(tone, 70), sw: 3 })
							+ line(x + 11, y + 60, x + 11 + l1 * 0.6, y + 60, { stroke: mix(tone, 70), sw: 3 })
							+ rect(x + 6, y + 100, iw - 12, 60, { rx: 8, fill: '#fff', sw: 3 })
							+ circle(cx, y + 116, 7, { fill: mix(tone, 55), sw: 3 }) + circle(cx, y + 144, 7, { fill: mix(tone, 55), sw: 3 })
							+ `<path d="M ${r1(cx - 6)} ${y + 177} L ${r1(cx + 8)} ${y + 187} L ${r1(cx - 6)} ${y + 197} Z" fill="var(--${tone})" stroke="var(--${tone})" stroke-width="2" stroke-linejoin="round"/>`;
					} else {
						it = rect(x, y, iw, ih, { rx: 8, fill: mix(tone, 22) })
							+ rect(x + 10, y + 18, iw - 20, 104, { rx: 8, fill: mix(tone, 10), sw: 3 })
							+ rect(x + 16, y + 26, iw - 32, 88, { rx: 3, fill: '#fff', sw: 0 })
							+ [0, 1, 2].map(j => line(x + 22, y + 46 + j * 16, x + iw - 22 - (j === 2 ? 10 : 0), y + 46 + j * 16, { stroke: mix(tone, 60), sw: 3 })).join('')
							+ circle(cx, y + ih - 56, 17, { fill: 'var(--surface)', sw: SW }) + circle(cx, y + ih - 56, 8, { fill: mix(tone, 60), sw: 0 })
							+ line(x + 2, y + ih - 16, x + iw - 2, y + ih - 16, { sw: 3 });
					}
					if (last) {
						over += `<g transform="rotate(${lean} ${r1(x + iw)} ${top})">${it}</g>`;
					} else {
						g += it;
					}
				}
				const ny = top - 236;
				html += t(`${n}-num t-${tone}`, at(1414, ny), esc(String(sh.value)), { nolint: true });
				html += t(`${n}-name`, at(1418, ny + 148), fmt(sh.label ?? ''), { nolint: true });
				if (sh.sub) {
					html += t(`${n}-sub`, at(1418, ny + 198, W - 1418), fmt(sh.sub));
				}
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g + over)}${html}</div>`, { vcenter: false });
		},
	},
	/** Parcels on a post-office counter, one per pull request: a shipping label with its number and what is inside, and
	 * a rubber stamp (green when merged, orange when in review); a bracket under the counter groups them by repository.
	 * Fields: eyebrow, title, items (≤ 4): [{ num, what, state: 'merged' | 'review', stamp, date }], groups: [{ label, from,
	 * to }] (item indexes). */
	'sd-parcels': {
		css: common('sd-parcels') + `
.sd-parcels .sd-parcels-label { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: 12px; background: #fff; padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
.sd-parcels .sd-parcels-num { font-family: var(--mono); font-size: 40px; font-weight: 700; color: var(--ink); line-height: 1.05; }
.sd-parcels .sd-parcels-what { font-size: 25px; font-weight: 600; color: var(--body); white-space: nowrap; }
.sd-parcels .sd-parcels-stamp { position: absolute; box-sizing: border-box; border-radius: 50%; border: 6px double var(--fg); color: var(--fg); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: color-mix(in srgb, var(--fg) 8%, #fdf6e0); }
.sd-parcels .sd-parcels-sw { font-size: 22px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; line-height: 1.1; }
.sd-parcels .sd-parcels-sd { display: block; font-size: 20px; font-weight: 600; line-height: 1.2; letter-spacing: 0; text-transform: none; }
.sd-parcels .sd-parcels-grp { position: absolute; font-family: var(--mono); font-size: 24px; color: var(--ink); white-space: nowrap; text-align: center; font-weight: 600; }
`,
		render(s) {
			const n = 'sd-parcels';
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 4);
			const counter = 500, bw = 330, bh = 330, dep = 44, step = 424, x0 = 26;
			let g = rect(0, counter, W, 34, { rx: 10, fill: 'var(--surface)' });
			let html = '';
			items.forEach((it, i) => {
				const x = x0 + i * step, y = counter - bh;
				const ok = it.state === 'merged';
				const tone = ok ? 'green' : 'orange';
				g += `<path d="M ${x} ${y} L ${x + dep} ${y - dep} L ${x + bw + dep} ${y - dep} L ${x + bw + dep} ${y + bh - dep} L ${x + bw} ${y + bh}" fill="${mix('yellow', 38)}" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`
					+ line(x + bw, y, x + bw + dep, y - dep)
					+ `<path d="M ${x + bw / 2 - 18} ${y} L ${x + bw / 2 - 18 + dep} ${y - dep} L ${x + bw / 2 + 18 + dep} ${y - dep} L ${x + bw / 2 + 18} ${y} Z" fill="${mix('yellow', 80)}" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>`
					+ rect(x, y, bw, bh, { rx: 10, fill: 'var(--yellow-tint)' })
					+ rect(x + bw / 2 - 18, y + 2, 36, 64, { rx: 0, fill: mix('yellow', 80), sw: 0 }) + line(x + bw / 2 - 18, y + 2, x + bw / 2 - 18, y + 66, { sw: 3 }) + line(x + bw / 2 + 18, y + 2, x + bw / 2 + 18, y + 66, { sw: 3 })
					+ rect(x, y, bw, bh, { rx: 10, fill: 'none' });
				html += `<div class="${n}-label" style="${at(x + 28, y + 74, bw - 56, 100)}" data-fit>${t(`${n}-num`, '', esc(it.num ?? ''), { nolint: true })}${t(`${n}-what`, '', fmt(it.what ?? ''), { nolint: true })}</div>`;
				const sr = 74;
				html += `<div class="${n}-stamp t-${tone}" style="${at(x + bw - sr * 2 - 14, y + bh - sr * 2 - 6, sr * 2, sr * 2)};transform:rotate(${ok ? -12 : 10}deg)" data-shape>`
					+ (ok ? ic('checkmark', 30) : ic('eye', 28))
					+ t(`${n}-sw`, '', fmt(it.stamp ?? '') + (it.date ? `<span class="${n}-sd">${fmt(it.date)}</span>` : ''), { nolint: true }) + '</div>';
			});
			(s.groups ?? []).forEach(gr => {
				const a = x0 + gr.from * step, b = x0 + gr.to * step + bw + dep;
				const yb = counter + 70;
				g += `<path d="M ${a} ${yb - 14} L ${a} ${yb} L ${b} ${yb} L ${b} ${yb - 14}" fill="none" stroke="var(--faint)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
				html += t(`${n}-grp`, at(a, yb + 16, b - a), fmt(gr.label ?? ''), { nolint: true });
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${svg(`${n}-svg`, W, H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A close: a radio mast with the agent at its top broadcasts in purple waves, and chat windows all around it each
	 * show a slash command arriving with what it makes (a screen or a slide). Left: eyebrow, title, sub, speaker, pills.
	 * Fields: eyebrow, title, sub, speaker: { initials, name, role }, pills, mast: { icon (default 'bot') }, chats (4): [{
	 * command, kind: 'video' | 'slides', src }]. */
	'sd-tower': {
		bare: true,
		css: common('sd-tower', { bare: true }) + coverCss('sd-tower', 820) + `
.sd-tower .sd-tower-chat { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: ${R}px; background: #fff; }
.sd-tower .sd-tower-cmd { position: absolute; font-family: var(--mono); font-size: 26px; font-weight: 700; color: var(--fg); white-space: nowrap; }
.sd-tower .sd-tower-slide { position: absolute; box-sizing: border-box; border: ${SW}px solid var(--ink); border-radius: 12px; background: var(--blue-tint); }
.sd-tower .sd-tower-slide i { position: absolute; display: block; height: 10px; border-radius: 5px; background: var(--blue); }
`,
		render(s) {
			const n = 'sd-tower';
			const mx = 1400, base = 968, topY = 380, beacon = 330;
			let g = '';
			// Waves.
			for (let k = 0; k < 4; k++) {
				const r = 80 + k * 66;
				const op = [0.9, 0.7, 0.5, 0.32][k];
				const arc = (a0, a1) => `<path d="M ${r1(mx + r * Math.cos(a0))} ${r1(beacon + r * Math.sin(a0))} A ${r} ${r} 0 0 1 ${r1(mx + r * Math.cos(a1))} ${r1(beacon + r * Math.sin(a1))}" fill="none" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" opacity="${op}"/>`;
				g += arc(-Math.PI / 3.2, Math.PI / 3.2) + arc(Math.PI - Math.PI / 3.2, Math.PI + Math.PI / 3.2);
			}
			// The mast: two legs and cross braces.
			const lx0 = mx - 120, rx0 = mx + 120, lx1 = mx - 22, rx1 = mx + 22;
			const legX = (x0, x1, y) => x0 + (x1 - x0) * (base - y) / (base - topY);
			g += line(mx - 220, base, 1830, base, { stroke: 'var(--line-strong)', sw: 6 });
			const ys = [base, 830, 712, 610, 522, 446, topY];
			for (let i = 0; i < ys.length - 1; i++) {
				const ya = ys[i], yb = ys[i + 1];
				g += line(legX(lx0, lx1, ya), ya, legX(rx0, rx1, yb), yb, { sw: 4 }) + line(legX(rx0, rx1, ya), ya, legX(lx0, lx1, yb), yb, { sw: 4 }) + line(legX(lx0, lx1, yb), yb, legX(rx0, rx1, yb), yb, { sw: 4 });
			}
			g += line(lx0, base, lx1, topY, { sw: 8 }) + line(rx0, base, rx1, topY, { sw: 8 }) + line(mx, topY, mx, beacon + 40, { sw: 8 })
				+ circle(mx, beacon, 50, { fill: 'var(--purple)' });
			let html = icAt(`${n}-ic`, mx, beacon, s.mast?.icon ?? 'bot', 54, '#fff');
			// Chat windows around it.
			let tails = '';
			const spots = [[1000, 180], [1540, 150], [960, 560], [1550, 530]];
			(s.chats ?? []).slice(0, 4).forEach((c, i) => {
				const [x, y] = spots[i];
				const w = 258, h = 236;
				const tone = c.kind === 'slides' ? 'blue' : 'purple';
				const left = x < mx;
				const tail = left ? `M ${x + w - 70} ${y + h - SW / 2} L ${x + w - 24} ${y + h + 36} L ${x + w - 30} ${y + h - SW / 2}` : `M ${x + 70} ${y + h - SW / 2} L ${x + 24} ${y + h + 36} L ${x + 30} ${y + h - SW / 2}`;
				tails += `<path d="${tail} Z" fill="#fff"/><path d="${tail}" fill="none" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"/>`;
				html += `<div class="${n}-chat t-${tone}" style="${at(x, y, w, h)}"></div>`;
				html += t(`${n}-cmd t-${tone}`, at(x + 24, y + 22), esc(c.command ?? ''), { nolint: true });
				if (c.kind === 'slides') {
					html += `<div class="${n}-slide" style="${at(x + 24, y + 74, w - 48, 136)}"><i style="left:18px;top:20px;width:110px"></i><i style="left:18px;top:44px;width:150px;background:var(--faint)"></i><i style="left:18px;top:86px;width:60px;height:26px;border-radius:8px;background:var(--green)"></i><i style="left:90px;top:86px;width:60px;height:26px;border-radius:8px;background:var(--orange)"></i></div>`;
				} else {
					html += screen(n, x + 24, y + 74, w - 48, 136, { src: c.src, tone, bar: 30, prog: 0.3 + i * 0.15 });
				}
			});
			return `<div class="${n}">${svg(`${n}-svg`, 1920, 1080, g)}${html}${svg(`${n}-svg`, 1920, 1080, tails)}${coverLeft(n, s)}${msLogo()}</div>`;
		},
	},
};
