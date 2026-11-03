// A gallery for inspiration (the pixel-pet world): read it for technique: real sprites drawn crisp, a director's chair, iPhones that hold a 9:16 reel. A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as they are.
// The drawings of examples/pet-studio-example.mjs, a talk about Pet Studio (github.com/federicobrancasi/pet-studio), a
// kit that makes films, reels, images and moves with the VS Code pet. The world is a small film studio; the recurring
// object is the print: a white-bordered photo hung on a line with a yellow peg. The pet is always the real sprite
// (8x masters in assets/gallery-pet/px/, rendered with the kit), shown at a whole-number scale so every pixel stays square.
//   gp-cover-chair  cover: the pet in sunglasses in a director's chair under a spotlight, a clapperboard and a megaphone
//   gp-ask          a big chat input with the pet sitting on it, a line from the input to the four kinds of output
//   gp-beats        a film's beats as strips of prints hung on lines, with the length and the beat count big
//   gp-phones       iPhones playing real reels, with a short-video app's controls drawn over them
//   gp-sizes        real renders of one image file standing on a shelf, to scale
//   gp-move         a move as text, the build command, the pet it makes in both colorways, the ready-made moves
//   gp-steps        how it works as a strip of prints, one frame per step with the real pet acting it (click by click)
//   gp-sprites      the real pet states on a contact sheet, and the pinned commit as a seal (dark page)
//   gp-signoff      the review package hung on lines and a SIGNED OFF stamp from the reviewer agent
//   gp-close        the closing page (blue): the line to remember, the setup commands, an empty chair saying 'your turn'
import path from 'node:path';
import { esc, fmt, ic, iconTile, pill, heading, body, bodyHeight, msLogo, logo, asset, W, r1, STYLE, t, at, layer, mix, qrSvg, pngSize, ROOT } from '../src/kit.mjs';

const DIR = 'assets/gallery-pet/';
const SW = STYLE.stroke;

/** A picture at an absolute position (pixel art stays crisp); a dashed placeholder when the file is missing. */
function pic(src, x, y, w, h, { fit = 'cover', pixel = true, alt = '' } = {}) {
	const u = src ? asset(src.startsWith('assets/') ? src : DIR + src) : null;
	const box = `position:absolute;${at(x, y, w, h)}`;
	return u
		? `<img src="${esc(u)}" alt="${esc(alt)}" style="${box};object-fit:${fit};${pixel ? 'image-rendering:pixelated;' : ''}">`
		: `<div style="${box};background:var(--surface);border:2px dashed var(--line-strong);box-sizing:border-box"></div>`;
}

/** A yellow clothes peg, its top at y, centred on x: it holds a print on its line. */
const peg = (x, y) => `<svg style="position:absolute;left:${r1(x - 12)}px;top:${r1(y)}px" width="24" height="54" viewBox="0 0 24 54"><rect x="2" y="2" width="20" height="50" rx="6" fill="var(--yellow)" stroke="var(--ink)" stroke-width="3"/><path d="M 12 5 V 49" stroke="var(--ink)" stroke-width="2"/><rect x="5" y="20" width="14" height="7" rx="2" fill="#fff" stroke="var(--ink)" stroke-width="2"/></svg>`;

/** A line between two wall pins, for prints to hang from (SVG, in the layer). */
const line = (x0, x1, y, sag = 10) => `<path d="M ${x0} ${y} Q ${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}" stroke="var(--connector)" stroke-width="3" fill="none"/>`
	+ [x0, x1].map(x => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`).join('');

/** The print: white paper with a thin edge and a picture inside; pad is the white margin, foot room for a caption.
 * Returns HTML. */
function print(src, x, y, w, h, { pad = 12, foot = 0, fit = 'cover', pixel = true } = {}) {
	return `<div style="position:absolute;${at(x, y, w, h)};background:#fff;border:2px solid var(--line-strong);box-sizing:border-box;border-radius:4px"></div>`
		+ pic(src, x + pad, y + pad, w - 2 * pad, h - 2 * pad - foot, { fit, pixel });
}

/** A pet sprite's real (1x) size: the masters in px/ are drawn at 8x with nearest neighbour. */
function petSize(name) {
	const { width, height } = pngSize(path.join(ROOT, DIR, 'px', `${name}.png`));
	return { w: width / 8, h: height / 8 };
}

/** The real pet at a whole-number scale k (every pet pixel becomes k x k), its bottom centre at (cx, bottom). The 8x
 * master is shown at k/8 on whole pixels, so the PNG and the PDF stay sharp. */
function petAt(name, cx, bottom, k = 2) {
	const { w, h } = petSize(name);
	const u = asset(`${DIR}px/${name}.png`);
	const x = Math.round(cx - (w * k) / 2), y = Math.round(bottom - h * k);
	return u ? `<img src="${esc(u)}" alt="" style="position:absolute;left:${x}px;top:${y}px;width:${w * k}px;height:${h * k}px;image-rendering:pixelated">` : '';
}

/** A label on a drawn plate: the wrapper is the plate (data-shape), so the build flags text that spills out of it. */
const plateText = (cls, x, y, w, h, html, on) => `<div data-shape style="position:absolute;${at(x, y, w, h)}">${t(cls, at(0, 0, w, h), html, { nolint: true }).replace(' data-t', ` data-t data-on="${on}"`)}</div>`;

const O = (w = SW) => `stroke="var(--ink)" stroke-width="${w}" stroke-linejoin="round"`;
const WOOD = mix('yellow', 45), WOOD_DARK = mix('yellow', 70), STEEL = 'color-mix(in srgb, var(--ink) 72%, #fff)';
const svgAbs = (w, h, inner, x = 0, y = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;

/** A spotlight head on a pivot at (cx, cy), turned deg degrees: a body and a yellow lens. Returns the drawing and the
 * two ends of the lens, where the beam starts. */
function spot(cx, cy, deg) {
	const a = deg * Math.PI / 180, end = y => [r1(cx + 56 * Math.cos(a) - y * Math.sin(a)), r1(cy + 56 * Math.sin(a) + y * Math.cos(a))];
	const g = `<g transform="rotate(${deg} ${cx} ${cy})"><rect x="${cx - 58}" y="${cy - 32}" width="110" height="64" rx="10" fill="var(--ink)"/><rect x="${cx + 46}" y="${cy - 36}" width="14" height="72" rx="4" fill="var(--yellow)" ${O(3)}/><path d="M ${cx - 42} ${cy - 32} V ${cy + 32} M ${cx - 26} ${cy - 32} V ${cy + 32}" stroke="${STEEL}" stroke-width="3"/></g><circle cx="${cx}" cy="${cy}" r="8" fill="${STEEL}"/>`;
	return { g, l1: end(-30), l2: end(30) };
}
const beam = (l1, t1, t2, l2) => `<path d="M ${l1[0]} ${l1[1]} L ${t1[0]} ${t1[1]} L ${t2[0]} ${t2[1]} L ${l2[0]} ${l2[1]} Z" fill="color-mix(in srgb, var(--yellow) 26%, transparent)"/>`;

/** A light stand: a pole from (x, top) to the floor on three legs. */
const lightStand = (x, top, F) => `<path d="M ${x} ${top} V ${F - 92}" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/>`
	+ `<path d="M ${x} ${F - 100} L ${x - 40} ${F} M ${x} ${F - 100} L ${x + 40} ${F}" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>`;

/** A director's chair seen from the front, standing on the floor F, centred on cx: posts that run from the top of the
 * back to the floor, a canvas back band (band: fill and text), armrest caps, a sagging canvas seat and an X brace. */
function chair(n, cx, F, { band = 'blue', text = '', on = '#0078d4' } = {}) {
	const px = 132, top = F - 488, seat = F - 222, arm = F - 286;
	let g = '';
	const brace = (x0, x1) => `<path d="M ${x0} ${seat + 30} L ${x1} ${F - 26}" stroke="var(--ink)" stroke-width="16" stroke-linecap="round"/><path d="M ${x0} ${seat + 30} L ${x1} ${F - 26}" stroke="${WOOD}" stroke-width="8" stroke-linecap="round"/>`;
	g += brace(cx - px + 20, cx + px - 20) + brace(cx + px - 20, cx - px + 20);
	g += [-1, 1].map(sd => `<rect x="${cx + sd * px - 9}" y="${top}" width="18" height="${F - top}" rx="5" fill="${WOOD}" ${O(3)}/>`).join('');
	g += `<rect x="${cx - px + 9}" y="${top + 16}" width="${2 * px - 18}" height="84" fill="var(--${band})" ${O(3)}/>`;
	g += `<path d="M ${cx - px + 9} ${seat} Q ${cx} ${seat + 26} ${cx + px - 9} ${seat} L ${cx + px - 9} ${seat + 16} Q ${cx} ${seat + 42} ${cx - px + 9} ${seat + 16} Z" fill="var(--${band})" ${O(3)}/>`;
	g += [-1, 1].map(sd => `<path d="M ${cx + sd * px} ${arm + 50} L ${cx + sd * (px + 30)} ${arm + 14}" stroke="var(--ink)" stroke-width="12" stroke-linecap="round"/><path d="M ${cx + sd * px} ${arm + 50} L ${cx + sd * (px + 30)} ${arm + 14}" stroke="${WOOD}" stroke-width="6" stroke-linecap="round"/>`
		+ `<rect x="${cx + sd * px - (sd < 0 ? 46 : 26)}" y="${arm}" width="72" height="18" rx="6" fill="${WOOD_DARK}" ${O(3)}/>`).join('');
	g += [-1, 1].map(sd => `<rect x="${cx + sd * px - 13}" y="${F - 8}" width="26" height="8" rx="3" fill="var(--ink)"/>`).join('');
	const label = text ? plateText(`${n}-band`, cx - px + 12, top + 19, 2 * px - 24, 78, fmt(text), on) : '';
	return { g, label, seat: seat + 14, top, arm, px };
}
const chairCss = (n, color = '#fff') => `.${n} .${n}-band { position: absolute; display: grid; place-items: center; font-size: 30px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: ${color}; white-space: nowrap; }`;

/** The left half of a cover: eyebrow, title, sub, speaker and pills, as the built-in title. */
function coverLeft(s, width = 860) {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left" style="width:${width}px"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="st-sub" style="margin-top:28px" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
}

/** The chat input with the pet sitting on its top edge, as in the editor. (x, y) is the input's top-left. */
function chatInput(n, x, y, w, h, { ask = '', pet = 'stable-idle', petX = 40, mode = 'Agent' } = {}) {
	return petAt(pet, x + petX + 96, y + 4, 2)
		+ `<div class="${n}-input" style="${at(x, y, w, h)}"></div>`
		+ t(`${n}-ask`, at(x + 32, y + 26, w - 64), fmt(ask))
		+ `<div class="${n}-mode" style="${at(x + 32, y + h - 62)}">${ic('bot', 24)}<span data-t class="nolint">${fmt(mode)}</span></div>`
		+ `<div class="${n}-send" style="${at(x + w - 76, y + h - 66, 48, 48)}">${ic('send', 28)}</div>`;
}
const chatCss = n => `
.${n} .${n}-input { position: absolute; background: #fff; border: 3px solid var(--blue); border-radius: ${STYLE.radius}px; box-sizing: border-box; box-shadow: 0 0 0 6px var(--blue-tint); }
.${n} .${n}-ask { position: absolute; font-size: 32px; line-height: 1.3; color: var(--ink); }
.${n} .${n}-mode { position: absolute; display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 10px; background: var(--purple-tint); color: var(--purple); font-size: 21px; font-weight: 600; }
.${n} .${n}-send { position: absolute; display: grid; place-items: center; border-radius: 12px; background: var(--blue); color: #fff; }`;

export const designs = {
	/** Cover option: the title on the left; on the right the real pet (2x, in sunglasses) sitting in a director's chair
	 * with the studio's name on its back, a spotlight on a stand lighting it from the left, a clapperboard leaning on the
	 * chair and a megaphone on the floor. Fields: eyebrow, title, sub, speaker, pills, pet, band (the chair's back). */
	'gp-cover-chair': {
		bare: true,
		css: `
.gp-cover-chair { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
${chairCss('gp-cover-chair')}
`,
		render(s) {
			const F = 960, cx = 1560;
			const c = chair('gp-cover-chair', cx, F, { band: 'blue', text: s.band ?? 'Pet Studio', on: '#0078d4' });
			let g = `<path d="M 990 ${F} H 1824" stroke="var(--line-strong)" stroke-width="${SW}" stroke-linecap="round"/>`;
			// The spotlight: the beam leaves the lens and falls on the chair.
			const sp = spot(1150, 420, 35);
			g += beam(sp.l1, [1590, 650], [1540, 732], sp.l2) + lightStand(1150, 440, F) + sp.g;
			g += c.g;
			// A clapperboard leaning on the chair's left post, and a megaphone lying on the floor.
			const bx = 1300, by = F - 96;
			g += `<g transform="rotate(8 ${bx + 118} ${F})"><rect x="${bx}" y="${by}" width="118" height="96" rx="4" fill="var(--ink)"/><path d="M ${bx + 12} ${by + 34} H ${bx + 106} M ${bx + 12} ${by + 60} H ${bx + 106} M ${bx + 59} ${by + 34} V ${by + 86}" stroke="#fff" stroke-width="2"/>`
				+ `<g transform="rotate(-18 ${bx} ${by})"><rect x="${bx}" y="${by - 22}" width="118" height="20" fill="#fff" ${O(3)}/>${[0, 1, 2, 3].map(i => `<path d="M ${bx + 8 + i * 28} ${by - 22} l 14 0 l -10 20 l -14 0 Z" fill="var(--ink)"/>`).join('')}</g>`
				+ `<rect x="${bx}" y="${by - 4}" width="118" height="10" fill="#fff" ${O(3)}/></g>`;
			g += `<path d="M 1734 916 L 1808 892 L 1808 958 L 1734 934 Z" fill="#fff" ${O()}/><rect x="1712" y="918" width="24" height="14" rx="4" fill="var(--ink)"/><path d="M 1752 934 L 1758 958" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"/>`;
			const html = svgAbs(1920, 1080, g) + c.label + petAt(s.pet ?? 'stable-cool', cx, c.seat, 2);
			return `<div class="gp-cover-chair">${coverLeft(s, 860)}${html}${msLogo()}</div>`;
		},
	},

	/** The ask: a big chat input with the real pet sitting on it and the ask typed in; under it the agents it works in
	 * (logos); a fan of lines from the input to the four kinds of output on the right.
	 * The output the ask makes is drawn bright (on: true); the others are dashed, under orLabel ('Or ask for').
	 * Fields: eyebrow, title, ask, hostsLabel, hosts: [{ logo, text }], outputs (4): [{ icon, title, sub, on }], orLabel. */
	'gp-ask': {
		css: `
.gp-ask { position: relative; width: 1728px; }
${chatCss('gp-ask')}
.gp-ask .gp-ask-hosts { position: absolute; display: flex; align-items: center; gap: 30px; }
.gp-ask .gp-ask-hl { font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.gp-ask .gp-ask-host { display: flex; align-items: center; gap: 10px; font-size: 23px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gp-ask .gp-ask-out { position: absolute; display: flex; align-items: center; gap: 22px; padding: 0 26px; box-sizing: border-box; background: #fff; border: 3px solid var(--fg); border-radius: ${STYLE.radius}px; }
.gp-ask .gp-ask-out.gp-ask-mute { border-color: var(--line-strong); border-style: dashed; }
.gp-ask .gp-ask-out.gp-ask-mute .gp-ask-ot { color: var(--body); }
.gp-ask .gp-ask-or { position: absolute; font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.gp-ask .gp-ask-ot { font-size: 30px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gp-ask .gp-ask-os { margin-top: 2px; font-size: 22px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const ix = 0, iy = 250, iw = 900, ih = 200;
			const outs = (s.outputs ?? []).slice(0, 4);
			const ox = 1200, ow = W - ox, oh = 112, og = (H - 20 - outs.length * oh) / Math.max(1, outs.length - 1);
			const fanY = iy + ih / 2;
			const first = outs.findIndex(o => o.on), y0 = 10 + Math.max(0, first) * (oh + og) + oh / 2;
			let g = `<path d="M ${ix + iw + 6} ${fanY} C ${ix + iw + 140} ${fanY} ${ox - 160} ${y0} ${ox - 14} ${y0}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" fill="none"/>`
				+ `<path d="M ${ox - 34} ${y0 - 14} L ${ox - 14} ${y0} L ${ox - 34} ${y0 + 14}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
			let html = '', orShown = false;
			outs.forEach((o, i) => {
				const cy = 10 + i * (oh + og) + oh / 2;
				if (!o.on && !orShown) {
					html += t('gp-ask-or nolint', at(ox + 4, cy - oh / 2 - 34), fmt(s.orLabel ?? 'Or ask for'));
					orShown = true;
				}
				html += `<div class="gp-ask-out${o.on ? '' : ' gp-ask-mute'} t-${o.tone ?? 'blue'}" style="${at(ox, cy - oh / 2, ow, oh)}" data-fit>${iconTile(o.icon ?? 'video', { tone: o.tone ?? 'blue', size: 64 })}<div><div class="gp-ask-ot nolint" data-t>${fmt(o.title)}</div>${o.sub ? `<div class="gp-ask-os nolint" data-t>${fmt(o.sub)}</div>` : ''}</div></div>`;
			});
			const hosts = `<div class="gp-ask-hosts" style="${at(ix + 4, iy + ih + 80)}"><span class="gp-ask-hl nolint" data-t>${fmt(s.hostsLabel ?? 'Works in')}</span>${(s.hosts ?? []).map(h => `<span class="gp-ask-host">${logo(h.logo, 34)}<span data-t class="nolint">${fmt(h.text)}</span></span>`).join('')}</div>`;
			return heading(s) + body(`<div class="gp-ask" style="height:${H}px">${layer(H, g)}${chatInput('gp-ask', ix, iy, iw, ih, { ask: s.ask, petX: 48 })}${hosts}${html}</div>`, { vcenter: false });
		},
	},

	/** A film's beats as strips of prints: one strip per row, hung from a line by two pegs, each frame a real still with its
	 * time and a word or two under it; on the left the brief as a chat bubble and the big numbers.
	 * Fields: eyebrow, title, brief: { label (small caps), text }, stats: [{ value, label }],
	 * rows: [[{ src, time, label }]] (3 rows of 4). */
	'gp-beats': {
		css: `
.gp-beats { position: relative; width: 1728px; }
.gp-beats .gp-beats-bub { position: absolute; padding: 20px 24px; box-sizing: border-box; background: var(--blue-tint); border: 3px solid var(--blue); border-radius: 18px 18px 18px 4px; }
.gp-beats .gp-beats-who { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--blue); white-space: nowrap; }
.gp-beats .gp-beats-txt { margin-top: 8px; font-size: 28px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gp-beats .gp-beats-num { position: absolute; }
.gp-beats .gp-beats-v { font-size: 112px; font-weight: 700; letter-spacing: -.03em; line-height: .95; color: var(--blue); white-space: nowrap; }
.gp-beats .gp-beats-l { margin-top: 6px; font-size: 26px; color: var(--ink); white-space: nowrap; }
.gp-beats .gp-beats-t { position: absolute; font-size: 18px; line-height: 1.2; color: var(--body); white-space: nowrap; }
.gp-beats .gp-beats-t b { font-family: var(--mono); font-weight: 600; color: var(--ink); margin-right: 8px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const rows = (s.rows ?? []).slice(0, 3);
			const fw = 248, fh = 140, pad = 12, foot = 34, gap = 10;
			const stripW = 4 * fw + 3 * gap + 2 * pad, stripH = fh + foot + 2 * pad, sx = W - stripW - 30;
			const rowH = 232;
			let g = '', html = '';
			rows.forEach((row, r) => {
				const ly = r * rowH + 10, y = ly + 22;
				g += line(sx - 30, sx + stripW + 30, ly, 3);
				html += `<div style="position:absolute;${at(sx, y, stripW, stripH)};background:#fff;border:2px solid var(--line-strong);box-sizing:border-box;border-radius:4px"></div>`;
				row.slice(0, 4).forEach((f, i) => {
					const fx = sx + pad + i * (fw + gap);
					html += pic(f.src, fx, y + pad, fw, fh, { pixel: false })
						+ t('gp-beats-t nolint', at(fx, y + pad + fh + 6, fw), `<b>${esc(f.time)}</b>${fmt(f.label)}`);
				});
				html += peg(sx + 120, ly - 4) + peg(sx + stripW - 120, ly - 4);
			});
			const b = s.brief ?? {};
			const bub = `<div class="gp-beats-bub" style="${at(0, 30, 400)}"><div class="gp-beats-who">${ic('chat', 22)}<span data-t class="nolint">${fmt(b.label ?? 'In chat')}</span></div><div class="gp-beats-txt" data-t>${fmt(b.text ?? '')}</div></div>`;
			const ay = 28 + 22 + 64, arrow = `<path d="M 410 ${ay} H ${sx - 4}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round"/><path d="M ${sx - 24} ${ay - 14} L ${sx - 4} ${ay} L ${sx - 24} ${ay + 14}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
			const nums = (s.stats ?? []).map((st, i) => `<div class="gp-beats-num" style="${at(0, 230 + i * 230, 400)}"><div class="gp-beats-v" data-t>${esc(st.value)}</div><div class="gp-beats-l" data-t>${fmt(st.label)}</div></div>`).join('');
			return heading(s) + body(`<div class="gp-beats" style="height:${H}px">${layer(H, arrow + g)}${bub}${nums}${html}</div>`, { vcenter: false });
		},
	},

	/** Vertical reels on iPhones: a rounded black body with thin even bezels, the side buttons, the Dynamic Island and
	 * a status bar; each reel fills the 9:16 screen at whole pixels (a 1080 x 1920 frame shown at a third). Over it, a
	 * short-video app's controls drawn in the house style: like, comment and share on the right, the reel's name and
	 * caption at the bottom, and a progress line at how far into the reel the frame is.
	 * Fields: eyebrow, title, reels (4): [{ src, name, caption, at (0–1) }], time (status bar clock). */
	'gp-phones': {
		css: `
.gp-phones { position: relative; width: 1728px; }
.gp-phones .gp-phones-scr { position: absolute; overflow: hidden; border-radius: 46px; background: var(--ink); }
.gp-phones .gp-phones-scr img { position: absolute; left: 0; top: 0; width: 360px; height: 640px; image-rendering: pixelated; }
.gp-phones .gp-phones-top { position: absolute; left: 0; top: 0; width: 360px; height: 70px; background: linear-gradient(rgba(0, 0, 0, .45), rgba(0, 0, 0, 0)); }
.gp-phones .gp-phones-bot { position: absolute; left: 0; bottom: 0; width: 360px; height: 230px; background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .72) 60%, rgba(0, 0, 0, .78)); }
.gp-phones .gp-phones-side { position: absolute; right: 0; top: 260px; width: 140px; height: 360px; background: radial-gradient(ellipse at 100% 50%, rgba(0, 0, 0, .42), rgba(0, 0, 0, 0) 70%); }
.gp-phones .gp-phones-island { position: absolute; left: 128px; top: 11px; width: 104px; height: 30px; border-radius: 15px; background: #000; }
.gp-phones .gp-phones-clock { position: absolute; left: 34px; top: 16px; font-size: 16px; font-weight: 600; color: #fff; white-space: nowrap; }
.gp-phones .gp-phones-acts { position: absolute; right: 16px; top: 352px; display: flex; flex-direction: column; align-items: center; gap: 26px; color: #fff; }
.gp-phones .gp-phones-name { position: absolute; left: 18px; display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 700; color: #fff; white-space: nowrap; }
.gp-phones .gp-phones-av { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff; box-sizing: border-box; display: grid; place-items: center; background: var(--blue); }
.gp-phones .gp-phones-cap { position: absolute; left: 18px; font-size: 16px; color: #fff; white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const reels = (s.reels ?? []).slice(0, 4);
			const sw = 360, sh = 640, bz = 12, pw = sw + 2 * bz, ph = sh + 2 * bz, gap = 56;
			const x0 = Math.round((W - (reels.length * pw + (reels.length - 1) * gap)) / 2), y0 = Math.round((H - ph) / 2);
			const icon = name => ic(name, 34);
			let html = '';
			reels.forEach((r, i) => {
				const x = x0 + i * (pw + gap);
				const body = `<rect x="4" y="0" width="${pw}" height="${ph}" rx="58" fill="var(--ink)"/><rect x="5.5" y="1.5" width="${pw - 3}" height="${ph - 3}" rx="56.5" fill="none" stroke="${STEEL}" stroke-width="2"/>`
					+ `<rect x="0" y="118" width="5" height="34" rx="2" fill="var(--ink)"/><rect x="0" y="176" width="5" height="62" rx="2" fill="var(--ink)"/><rect x="0" y="252" width="5" height="62" rx="2" fill="var(--ink)"/>`
					+ `<rect x="${pw + 3}" y="206" width="5" height="96" rx="2" fill="var(--ink)"/>`;
				const u = asset(`${DIR}${r.src}`);
				const bar = `<svg style="position:absolute;left:18px;top:${sh - 14}px" width="${sw - 36}" height="4"><rect width="${sw - 36}" height="4" rx="2" fill="rgba(255,255,255,.35)"/><rect width="${r1((sw - 36) * (r.at ?? 0.5))}" height="4" rx="2" fill="#fff"/></svg>`;
				const status = `<svg style="position:absolute;left:${sw - 94}px;top:19px" width="64" height="14"><rect x="0" y="9" width="3" height="5" rx="1" fill="#fff"/><rect x="5" y="6" width="3" height="8" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="11" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="14" rx="1" fill="#fff"/><rect x="30" y="1" width="26" height="12" rx="3.5" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="32.5" y="3.5" width="18" height="7" rx="1.5" fill="#fff"/><rect x="57.5" y="5" width="2" height="4" rx="1" fill="#fff"/></svg>`;
				html += `<div style="position:absolute;left:${x - 4}px;top:${y0}px;width:${pw + 8}px;height:${ph}px">${svgAbs(pw + 8, ph, body)}`
					+ `<div class="gp-phones-scr" style="left:${bz + 4}px;top:${bz}px;width:${sw}px;height:${sh}px">${u ? `<img src="${esc(u)}" alt="">` : ''}`
					+ `<div class="gp-phones-top"></div><div class="gp-phones-side"></div><div class="gp-phones-bot"></div><div class="gp-phones-island"></div>`
					+ t('gp-phones-clock nolint', '', esc(s.time ?? '9:41')).replace(' data-t', ' data-t data-on="#000000"') + status
					+ `<div class="gp-phones-acts">${['heart', 'chat', 'send'].map(icon).join('')}</div>`
					+ `<div class="gp-phones-name" style="top:${sh - 98}px"><span class="gp-phones-av">${ic('play', 16)}</span><span data-t data-on="#000000" class="nolint">${fmt(r.name)}</span></div>`
					+ t('gp-phones-cap', `top:${sh - 54}px`, fmt(r.caption ?? '')).replace(' data-t', ' data-t data-on="#000000"')
					+ bar + `</div></div>`;
			});
			return heading(s) + body(`<div class="gp-phones" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** Real renders of one image file standing on a shelf, drawn to scale (by their pixel size), each with its name and
	 * size under the shelf; the file they came from as a chip at the top left.
	 * Fields: eyebrow, title, file: { icon, text }, scale (px on the slide per image px), items: [{ src, name, w, h }]. */
	'gp-sizes': {
		css: `
.gp-sizes { position: relative; width: 1728px; }
.gp-sizes .gp-sizes-file { position: absolute; display: flex; align-items: center; gap: 12px; padding: 10px 18px; border-radius: 12px; background: var(--blue-tint); color: var(--blue); font-family: var(--mono); font-size: 24px; white-space: nowrap; }
.gp-sizes .gp-sizes-n { position: absolute; text-align: center; font-size: 22px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gp-sizes .gp-sizes-px { position: absolute; text-align: center; font-family: var(--mono); font-size: 18px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const items = s.items ?? [];
			const k = s.scale ?? 0.14, shelfY = H - 110, busY = 120;
			const widths = items.map(it => Math.max(it.w * k, 110));
			const gap = (W - 20 - widths.reduce((a, b) => a + b, 0)) / Math.max(1, items.length - 1);
			let x = 10, html = '', g = `<rect x="0" y="${shelfY}" width="${W}" height="16" rx="4" fill="var(--line-strong)"/><path d="M 60 ${shelfY + 16} V ${shelfY + 34} M ${W - 60} ${shelfY + 16} V ${shelfY + 34}" stroke="var(--line-strong)" stroke-width="10"/>`;
			const cxs = [];
			const arrow = (cx, y) => `<path d="M ${cx - 12} ${y - 16} L ${cx} ${y} L ${cx + 12} ${y - 16}" stroke="var(--blue)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
			items.forEach((it, i) => {
				const w = it.w * k, h = it.h * k, cx = x + widths[i] / 2, lw = widths[i] + gap - 6;
				cxs.push(cx);
				g += `<path d="M ${r1(cx)} ${busY} V ${r1(shelfY - h - 18)}" stroke="var(--blue)" stroke-width="5" stroke-linecap="round"/>${arrow(r1(cx), r1(shelfY - h - 16))}`;
				html += `<div style="position:absolute;${at(cx - w / 2 - 3, shelfY - h - 6, w + 6, h + 6)};background:#fff;border:2px solid var(--line-strong);box-sizing:border-box"></div>`
					+ pic(it.src, cx - w / 2, shelfY - h - 3, w, h, { fit: 'fill' })
					+ t('gp-sizes-n nolint', at(cx - lw / 2, shelfY + 40, lw), fmt(it.name))
					+ t('gp-sizes-px nolint', at(cx - lw / 2, shelfY + 74, lw), esc(`${it.w} × ${it.h}`));
				x += widths[i] + gap;
			});
			g += `<path d="M ${r1(cxs[0])} ${busY} H ${r1(cxs[cxs.length - 1])} M ${W / 2} 70 V ${busY}" stroke="var(--blue)" stroke-width="5" stroke-linecap="round"/><circle cx="${W / 2}" cy="${busY}" r="10" fill="var(--blue)"/>`;
			const f = s.file ?? {};
			html += `<div style="position:absolute;${at(0, 4, W)};display:flex;justify-content:center"><div class="gp-sizes-file" style="position:relative">${ic(f.icon ?? 'document', 28)}<span data-t class="nolint">${fmt(f.text ?? '')}</span></div></div>`;
			return heading(s) + body(`<div class="gp-sizes" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A move: the text file (12 lines of letters) on a card, an arrow with the build command, the pet it makes in both
	 * colorways, and the ready-made moves as one picture with its count.
	 * Fields: eyebrow, title, file, grid (12 strings), legend: [{ key, text }], command, pets: [{ pet, label, tone }],
	 * gallery: { src, value, label }. */
	'gp-move': {
		css: `
.gp-move { position: relative; width: 1728px; }
.gp-move .gp-move-card { position: absolute; background: #fff; border: 3px solid var(--ink); border-radius: 14px; box-sizing: border-box; }
.gp-move .gp-move-fn { position: absolute; display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gp-move .gp-move-grid { position: absolute; font-family: var(--mono); font-size: 31px; line-height: 35px; letter-spacing: .22em; color: var(--faint); white-space: pre; }
.gp-move .gp-move-grid i { font-style: normal; font-weight: 700; }
.gp-move .gp-move-grid .c { color: color-mix(in srgb, var(--blue) 72%, #fff); } .gp-move .gp-move-grid .a { color: var(--blue); } .gp-move .gp-move-grid .b { color: color-mix(in srgb, var(--blue) 62%, var(--ink)); } .gp-move .gp-move-grid .e { color: var(--ink); }
.gp-move .gp-move-key { position: absolute; font-size: 19px; line-height: 1.5; color: var(--body); white-space: nowrap; }
.gp-move .gp-move-key b { font-family: var(--mono); color: var(--ink); margin-right: 6px; }
.gp-move .gp-move-cmd { position: absolute; padding: 8px 14px; border-radius: ${STYLE.radiusSmall}px; background: var(--blue-tint); color: var(--blue); font-family: var(--mono); font-size: 21px; font-weight: 600; white-space: nowrap; text-align: center; }
.gp-move .gp-move-pl { position: absolute; text-align: center; font-size: 24px; font-weight: 600; white-space: nowrap; }
.gp-move .gp-move-gal { position: absolute; display: flex; align-items: baseline; gap: 16px; }
.gp-move .gp-move-gv { font-size: 72px; font-weight: 700; letter-spacing: -.03em; color: var(--blue); white-space: nowrap; line-height: 1; }
.gp-move .gp-move-gl { font-size: 24px; color: var(--ink); white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const cw = 420, ch = 78 + 12 * 35 + 22 + 30 + 34, top = 20;
			const grid = (s.grid ?? []).map(row => [...row].map(ch => ch === '.' ? '.' : `<i class="${ch.toLowerCase()}">${ch}</i>`).join('')).join('\n');
			let html = `<div class="gp-move-card" style="${at(0, top, cw, ch)}"></div>`
				+ `<div class="gp-move-fn" style="${at(28, top + 22)}">${ic('document', 26)}<span data-t>${fmt(s.file ?? 'move.txt')}</span></div>`
				+ `<div class="gp-move-grid nolint" style="${at(34, top + 78)}" data-t>${grid}</div>`
				+ `<div class="gp-move-key nolint" style="${at(34, top + 78 + 12 * 35 + 22, cw - 50)}" data-t>${(s.legend ?? []).map(l => `<span style="margin-right:18px"><b>${esc(l.key)}</b>${fmt(l.text)}</span>`).join('')}</div>`;
			const ax0 = cw + 22, ax1 = 650, ay = top + ch / 2, px0 = 670, pw = 540, py = top + 60, ph = 400;
			let g = `<path d="M ${ax0} ${ay} H ${ax1}" stroke="var(--blue)" stroke-width="6" stroke-linecap="round"/><path d="M ${ax1 - 20} ${ay - 14} L ${ax1} ${ay} L ${ax1 - 20} ${ay + 14}" stroke="var(--blue)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
				+ `<rect x="${px0}" y="${py}" width="${pw}" height="${ph}" rx="14" fill="var(--ink)"/><path d="M ${px0 + 30} ${py + ph - 70} H ${px0 + pw - 30}" stroke="color-mix(in srgb, var(--ink) 72%, #fff)" stroke-width="4"/>`;
			html += t('gp-move-cmd nolint', at(ax0 + 2, ay - 66, ax1 - ax0 - 4), fmt(s.command ?? ''));
			(s.pets ?? []).slice(0, 2).forEach((p, i) => {
				const x = px0 + (pw - 2 * 192 - 60) / 2 + i * 252;
				html += petAt(p.pet, x + 96, py + ph - 72, 2) + t(`gp-move-pl nolint`, `${at(x - 24, py + ph + 18, 240)};color:var(--${p.tone ?? 'blue'})`, fmt(p.label));
			});
			const gl = s.gallery ?? {};
			const gx = 1250, gw = W - gx, gh = (gw - 24) * 754 / 1056 + 24, gy = py + 10;
			g += line(gx - 20, W - 8, py - 30, 3);
			html += print(gl.src, gx, gy, gw, gh, { pad: 12, fit: 'contain', pixel: false }) + peg(gx + 120, py - 34) + peg(gx + gw - 120, py - 34)
				+ `<div class="gp-move-gal" style="${at(gx, gy + gh + 22, gw)}"><span class="gp-move-gv" data-t>${esc(gl.value ?? '')}</span><span class="gp-move-gl" data-t>${fmt(gl.label ?? '')}</span></div>`;
			return heading(s) + body(`<div class="gp-move" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** How it works as one long strip of prints: one frame per step, the real pet acting it on a dark frame, the step's number
	 * and a word or two under it. Click by click (clicks: true): frames up to the current step are shown, the current
	 * one ringed in blue; on the last click every frame is shown and the last one is ringed in its own tone.
	 * Each frame is as wide as its pet needs (pets at the whole-number scale s.scale, default 2).
	 * Fields: eyebrow, title, scale, steps (4–6): [{ pet (a name in px/), title, tone }], who: [{ from, to, label, tone }]
	 * (brackets under the strip: which steps each actor does). */
	'gp-steps': {
		clicks: true,
		css: `
.gp-steps { position: relative; width: 1728px; }
.gp-steps .gp-steps-f { position: absolute; }
.gp-steps .gp-steps-later { opacity: 0; }
.gp-steps .gp-steps-row { display: flex; justify-content: center; align-items: center; gap: 12px; }
.gp-steps .gp-steps-num { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: 50%; font-size: 22px; font-weight: 700; color: #fff; background: var(--fg); }
.gp-steps .gp-steps-t { font-size: 26px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gp-steps .gp-steps-who { position: absolute; display: flex; justify-content: center; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; color: var(--fg); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			const H = bodyHeight(s);
			const steps = (s.steps ?? []).slice(0, 6);
			const n = steps.length, step = ctx.step ?? n, last = !ctx.steps || step >= ctx.steps, k = s.scale ?? 2;
			const sizes = steps.map(st => petSize(st.pet));
			const pad = 12, gap = 10, sy = 46, m = 24, minW = 210;
			const fh = Math.max(...sizes.map(z => z.h * k)) + 56;
			let fws = sizes.map(z => Math.max(z.w * k + m, minW));
			const extra = (W - 2 * pad - (n - 1) * gap - fws.reduce((a, b) => a + b, 0)) / n;
			fws = fws.map(w => Math.floor(w + extra));
			const xs = fws.map((_, i) => pad + fws.slice(0, i).reduce((a, b) => a + b, 0) + i * gap);
			let g = line(0, W, 12, 3), html = '';
			html += `<div style="position:absolute;${at(0, sy, W, fh + 2 * pad)};background:#fff;border:2px solid var(--line-strong);box-sizing:border-box;border-radius:4px"></div>`;
			html += peg(300, 6) + peg(W - 300, 6);
			steps.forEach((st, i) => {
				const x = xs[i], fw = fws[i], shown = i < step, now = !!ctx.steps && i === step - 1;
				const cls = `gp-steps-f${shown ? '' : ' gp-steps-later'}`;
				const tone = st.tone ?? 'blue';
				html += `<div class="${cls}" data-key="f${i}" style="${at(x, sy + pad, fw, fh)};background:var(--ink);border-radius:2px${now ? `;box-shadow:0 0 0 5px var(--${last ? tone : 'blue'});z-index:2` : ''}">${petAt(st.pet, Math.round(fw / 2), fh - 36, k)}<svg style="position:absolute;left:16px;top:${fh - 34}px" width="${fw - 32}" height="4"><rect width="100%" height="4" fill="${STEEL}"/></svg></div>`;
				html += `<div class="${cls} gp-steps-row" data-key="t${i}" style="${at(x, sy + fh + 2 * pad + 18, fw, 44)}"><span class="gp-steps-num t-${tone}" data-t>${i + 1}</span><span class="gp-steps-t nolint" data-t>${fmt(st.title)}</span></div>`;
			});
			const by = sy + fh + 2 * pad + 88;
			(s.who ?? []).forEach((w, j) => {
				const x0 = xs[w.from] + 10, x1 = xs[w.to] + fws[w.to] - 10;
				const shown = w.to < step;
				g += `<path d="M ${x0} ${by} V ${by + 18} H ${x1} V ${by}" stroke="var(--${w.tone ?? 'neutral'})" stroke-width="${SW}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${shown ? 1 : 0}"/>`;
				html += `<div class="${shown ? '' : 'gp-steps-later'}" data-key="w${j}">${t(`gp-steps-who t-${w.tone ?? 'neutral'}`, at(x0, by + 30, x1 - x0), `${(w.logos ?? []).map(l => logo(l, 28)).join(' ')} ${fmt(w.label)}`)}</div>`;
			});
			return heading(s) + body(`<div class="gp-steps" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The real pet states on a dark contact sheet, each at its own size with its name; on the right a seal: what the
	 * sprites are pinned to, and the two colorways side by side. For a dark page (bg: 'dark').
	 * Fields: eyebrow, title, states: [{ pet, name }], cols, count: { value, label }, pin: { label, text, sub },
	 * colorways: [{ pet, label, color }]. */
	'gp-sprites': {
		css: `
.gp-sprites { position: relative; width: 1728px; }
.gp-sprites .gp-sprites-n { position: absolute; text-align: center; font-family: var(--mono); font-size: 17px; color: #c4c7ce; white-space: nowrap; }
.gp-sprites .gp-sprites-v { position: absolute; font-size: 96px; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: #6cb8f6; white-space: nowrap; }
.gp-sprites .gp-sprites-l { position: absolute; font-size: 26px; color: #fff; white-space: nowrap; }
.gp-sprites .gp-sprites-seal { position: absolute; padding: 20px 22px; box-sizing: border-box; border: 3px solid #7bd389; border-radius: 16px; }
.gp-sprites .gp-sprites-sl { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: #7bd389; white-space: nowrap; }
.gp-sprites .gp-sprites-st { margin-top: 10px; font-family: var(--mono); font-size: 22px; color: #fff; white-space: nowrap; }
.gp-sprites .gp-sprites-ss { margin-top: 6px; font-size: 21px; color: #c4c7ce; }
.gp-sprites .gp-sprites-cw { position: absolute; text-align: center; font-size: 22px; font-weight: 600; white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const states = s.states ?? [];
			const cols = s.cols ?? 7, cw = 176, rh = 196, rows = Math.ceil(states.length / cols);
			const top = (H - rows * rh) / 2;
			let html = '';
			states.forEach((st, i) => {
				const c = i % cols, r = Math.floor(i / cols);
				const x = c * cw, y = top + r * rh;
				html += petAt(st.pet, x + cw / 2, y + 136, 1) + t('gp-sprites-n nolint', at(x, y + 146, cw), esc(st.name));
			});
			const ground = Array.from({ length: rows }, (_, r) => `<path d="M 10 ${r1(top + r * rh + 138)} H ${cols * cw - 10}" stroke="color-mix(in srgb, var(--ink) 72%, #fff)" stroke-width="3"/>`).join('');
			const rx0 = cols * cw + 70;
			const g = ground + `<path d="M ${rx0} 578 H ${W}" stroke="color-mix(in srgb, var(--ink) 72%, #fff)" stroke-width="3"/><path d="M ${cols * cw + 30} 20 V ${H - 20}" stroke="color-mix(in srgb, var(--ink) 72%, #fff)" stroke-width="3"/>`;
			const rx = cols * cw + 70, rw = W - rx;
			const cn = s.count ?? {};
			html += t('gp-sprites-v', at(rx, 10), esc(cn.value ?? '')) + t('gp-sprites-l', at(rx + 4, 116), fmt(cn.label ?? ''));
			const p = s.pin ?? {};
			html += `<div class="gp-sprites-seal" style="${at(rx, 190, rw)}"><div class="gp-sprites-sl">${ic('lock', 22)}<span data-t>${fmt(p.label ?? '')}</span></div><div class="gp-sprites-st nolint" data-t>${fmt(p.text ?? '')}</div><div class="gp-sprites-ss" data-t>${fmt(p.sub ?? '')}</div></div>`;
			(s.colorways ?? []).slice(0, 2).forEach((c, i) => {
				const x = rx + i * (rw / 2);
				html += petAt(c.pet, x + rw / 4, 576, 2) + t('gp-sprites-cw nolint', `${at(x, 592, rw / 2)};color:${c.color}`, fmt(c.label));
			});
			return heading(s) + body(`<div class="gp-sprites" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The sign-off: the review package hung on two lines as prints (real pictures, each with a word or two under
	 * it), and on the right the reviewer agent's verdict as a green stamp, with what happens otherwise.
	 * Fields: eyebrow, title, prints (2): [{ src, label, ratio (w / h) }], agent: { icon, name }, verdict, otherwise. */
	'gp-signoff': {
		css: `
.gp-signoff { position: relative; width: 1728px; }
.gp-signoff .gp-signoff-cap { position: absolute; font-size: 22px; color: var(--body); white-space: nowrap; }
.gp-signoff .gp-signoff-agent { position: absolute; display: flex; align-items: center; gap: 16px; font-size: 28px; font-weight: 600; color: var(--purple); white-space: nowrap; }
.gp-signoff .gp-signoff-stamp { position: absolute; display: grid; place-items: center; text-align: center; border: 7px solid var(--green); border-radius: 18px; color: var(--green); font-size: 44px; font-weight: 800; letter-spacing: .06em; line-height: 1.1; text-transform: uppercase; transform: rotate(-5deg); box-sizing: border-box; }
.gp-signoff .gp-signoff-else { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 24px; color: var(--ink); }
.gp-signoff .gp-signoff-else .ic { color: var(--orange); flex: none; }
`,
		render(s) {
			const H = bodyHeight(s);
			const pw = 900;
			let g = '', html = '', y = 10;
			(s.prints ?? []).slice(0, 2).forEach((p, i) => {
				const h = (pw - 24) / p.ratio + 24 + 40;
				g += line(-10, pw + 10, y, 3);
				html += print(p.src, 0, y + 22, pw, h, { pad: 12, foot: 40, pixel: false }) + peg(220, y - 4) + peg(pw - 220, y - 4)
					+ t('gp-signoff-cap', at(16, y + 22 + h - 44), fmt(p.label));
				y += h + 60;
			});
			const rx = 1020, rw = W - rx, mid = (32 + y - 60) / 2 - 30;
			g += `<path d="M ${pw + 14} 32 H ${pw + 34} V ${r1(y - 60)} H ${pw + 14}" stroke="var(--purple)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
			const a = s.agent ?? {};
			html += `<div class="gp-signoff-agent" style="${at(pw + 50, mid - 84)}">${iconTile(a.icon ?? 'bot', { tone: 'purple', size: 52 })}<span data-t class="nolint">${fmt(a.name ?? '')}</span></div>`;
			g += `<path d="M ${pw + 34} ${r1(mid)} H ${rx + 230}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round"/><path d="M ${rx + 210} ${r1(mid - 14)} L ${rx + 230} ${r1(mid)} L ${rx + 210} ${r1(mid + 14)}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
			html += t('gp-signoff-stamp nolint', at(rx + 250, mid - 105, rw - 260, 210), fmt(s.verdict ?? ''));
			html += `<div class="gp-signoff-else" style="${at(rx + 250, mid + 160, rw - 250)}">${ic('repeat', 34)}<span data-t>${fmt(s.otherwise ?? '')}</span></div>`;
			return heading(s) + body(`<div class="gp-signoff" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The close, for a blue page (bg: 'blue'): the line to remember big on the left, the setup commands on a white
	 * card under it with a QR code for url (drawn here: the frame's link badge reads ink-on-blue in the contrast check),
	 * and on the right an empty director's chair with the invitation on its back and the real pet (2x) waving beside it.
	 * Fields: text (the line), commands: [string], commandsLabel, url, band (the chair's back), pet. */
	'gp-close': {
		css: `
.gp-close { position: relative; width: 1728px; }
.gp-close .gp-close-text { position: absolute; font-size: 78px; font-weight: 600; line-height: 1.12; letter-spacing: -.02em; color: #fff; }
.gp-close .gp-close-cmds { position: absolute; padding: 24px 28px; box-sizing: border-box; background: #fff; border-radius: 16px; }
.gp-close .gp-close-cl { font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--blue); }
.gp-close .gp-close-c { margin-top: 8px; font-family: var(--mono); font-size: 21px; color: var(--ink); white-space: nowrap; }
.gp-close .gp-close-qr { position: absolute; display: block; }
.gp-close .gp-close-qr svg { width: 100%; height: 100%; display: block; }
.gp-close .gp-close-c::before { content: '$ '; color: var(--muted); }
${chairCss('gp-close', 'var(--ink)')}
`,
		render(s) {
			const H = bodyHeight(s);
			const cmds = s.commands ?? [];
			let html = t('gp-close-text', at(0, 0, 980), fmt(s.text ?? ''));
			const th = 56 + cmds.length * 38 + 28, ty = H - th - 10;
			html += `<div class="gp-close-cmds" style="${at(0, ty, 1060, th)}" data-on="#ffffff"><div class="gp-close-cl" data-t>${fmt(s.commandsLabel ?? 'Try it')}</div>${cmds.map(c => `<div class="gp-close-c nolint" data-t>${esc(c)}</div>`).join('')}</div>`;
			if (s.url) {
				html += `<a class="gp-close-qr" href="${esc(s.url)}" style="${at(1060 - 24 - (th - 40), ty + 20, th - 40, th - 40)}">${qrSvg(s.url)}</a>`;
			}
			const F = H - 10, cx = 1340;
			const c = chair('gp-close', cx, F, { band: 'yellow', text: s.band ?? 'Your turn', on: '#f2c94c' });
			const g = `<path d="M 1150 ${F} H ${W}" stroke="#fff" stroke-width="${SW}" stroke-linecap="round"/>` + c.g;
			html += svgAbs(W, H, g) + c.label + petAt(s.pet ?? 'insiders-move-wave', 1610, F, 2);
			return body(`<div class="gp-close" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},
};
