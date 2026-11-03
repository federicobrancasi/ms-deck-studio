// Props: detailed, reusable frames for the devices and windows that illustrated decks keep needing: an iPhone, a
// laptop, a monitor, an app window and a browser. A prop is a frame, not a picture: it holds what you put in it (a
// real screenshot with `src`, or your own HTML with `content`) and draws the device around it in the house style
// (ink outlines, true proportions, no shadows). Every prop is absolutely positioned at (x, y) inside your design and
// sized by its width, so it drops into any scene; the screen area is returned too, to place things on top of it.
// Use them so devices look real, and spend your own drawing time on the idea. See docs/designs.md (Props).
import { asset, esc, r1, t } from './kit.mjs';

const INK = 'var(--ink)';
const STEEL = '#c9ccd3';
const abs = (x, y, w, h, extra = '') => `position:absolute;left:${r1(x)}px;top:${r1(y)}px;width:${r1(w)}px;height:${r1(h)}px;${extra}`;
const svgAbs = (x, y, w, h, inner) => `<svg style="${abs(x, y, w, h)}overflow:visible" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;

/** What goes on a screen: an image (src, under assets/), your HTML (content), or a plain tint. fit: 'cover' (fill and
 * crop, default) or 'contain'; pixelated: true keeps pixel art crisp. */
function screenFill({ src, content, fit = 'cover', pixelated = false, bg = '#f7f8fa' }, w, h, radius) {
	const u = src ? asset(src) : null;
	const img = u ? `<img src="${esc(u)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:${fit};${pixelated ? 'image-rendering:pixelated;' : ''}">` : '';
	return `<div style="position:absolute;inset:0;overflow:hidden;border-radius:${r1(radius)}px;background:${bg}">${img}${content ?? ''}</div>`;
}

/** Placeholder screens, drawn when a prop gets neither src nor content: code lines for an app window, a page for a
 * browser, a feed for a phone, a dashboard for a laptop or monitor. They read as "a real screen" without real data. */
const bar = (x, y, w, h, c, r = 4) => `<div style="${abs(x, y, w, h)}border-radius:${r1(r)}px;background:${c}"></div>`;
function codeLines(w, h, dark) {
	const cols = ['var(--purple)', 'var(--blue)', 'var(--green)', 'var(--orange)'], base = dark ? '#3a3d45' : '#d6d9e0';
	const lh = Math.max(14, h / 18), s = lh / 22;
	let out = '';
	for (let i = 0, y = lh; y < h - lh; i++, y += lh) {
		out += bar(10 * s, y, 18 * s, 6 * s, base, 3);
		const ind = ((i * 7) % 4) * 18 * s;
		let x = 44 * s + ind;
		for (let k = 0; k < 1 + ((i * 5) % 3); k++) {
			const ww = (40 + ((i * 31 + k * 17) % 90)) * s;
			if (x + ww > w - 10) {
				break;
			}
			out += bar(x, y, ww, 7 * s, (i + k) % 3 ? cols[(i + k) % 4] : base, 3.5);
			x += ww + 10 * s;
		}
	}
	return out;
}
function pageLines(w, h) {
	const s = w / 900;
	let out = bar(w * 0.08, 34 * s, w * 0.36, 22 * s, 'var(--ink)', 11 * s) + bar(w * 0.08, 70 * s, w * 0.5, 12 * s, '#d6d9e0', 6 * s);
	const cw = (w * 0.84 - 2 * 24 * s) / 3;
	for (let i = 0; i < 3; i++) {
		const x = w * 0.08 + i * (cw + 24 * s), y = 116 * s;
		out += `<div style="${abs(x, y, cw, Math.min(h - y - 24 * s, 220 * s))}border-radius:${r1(14 * s)}px;border:2px solid #d6d9e0;box-sizing:border-box;background:#fff"></div>`
			+ bar(x + 16 * s, y + 18 * s, cw - 32 * s, Math.min(90 * s, h * 0.25), ['var(--blue-tint)', '#f1ecfa', '#e9f5e8'][i], 8 * s)
			+ bar(x + 16 * s, y + 18 * s + Math.min(90 * s, h * 0.25) + 16 * s, cw * 0.6, 9 * s, 'var(--ink)', 5 * s);
	}
	return out;
}
function feed(w, h) {
	return bar(0, 0, w, h, 'var(--blue-tint)', 0) + `<div style="${abs(w * 0.18, h * 0.3, w * 0.64, w * 0.64)}border-radius:50%;background:#fff;border:3px solid var(--blue);box-sizing:border-box"></div>`
		+ `<svg style="${abs(w * 0.42, h * 0.3 + w * 0.22, w * 0.2, w * 0.2)}" viewBox="0 0 10 10"><path d="M 2 1 L 9 5 L 2 9 Z" fill="var(--blue)"/></svg>`
		+ bar(w * 0.08, h * 0.8, w * 0.55, h * 0.018, 'var(--ink)', 4) + bar(w * 0.08, h * 0.84, w * 0.75, h * 0.014, '#5f6168', 4);
}
function dash(w, h) {
	const s = w / 600;
	let out = bar(0, 0, w * 0.2, h, '#f7f8fa', 0) + bar(w * 0.04, 24 * s, w * 0.12, 9 * s, 'var(--blue)', 5);
	for (let i = 0; i < 6; i++) {
		out += bar(w * 0.04, (54 + i * 26) * s, w * 0.11, 7 * s, '#d6d9e0', 4);
	}
	out += bar(w * 0.27, 26 * s, w * 0.3, 14 * s, 'var(--ink)', 7);
	const hs = [0.35, 0.5, 0.42, 0.62, 0.55, 0.9, 1, 0.66, 0.58, 0.72], bw = (w * 0.66) / hs.length;
	hs.forEach((v, i) => {
		const bh = (h - 90 * s) * 0.8 * v;
		out += bar(w * 0.27 + i * bw, h - 30 * s - bh, bw * 0.62, bh, i === 5 || i === 6 ? 'var(--blue)' : '#d6d9e0', 3);
	});
	return out;
}

/**
 * An iPhone, seen from the front: a rounded body with thin even bezels, the Dynamic Island, the side buttons, and a
 * status bar (time, signal, battery) over the screen. The screen is 9:19.5; a 9:16 reel fills it with fit: 'cover'.
 * Options: x, y, w (body width, default 300), src | content, fit, pixelated, time ('9:41'), statusDark (dark status
 * text on a light screen), color ('ink' | 'silver'). Returns { html, w, h, screen: { x, y, w, h } } in your coordinates.
 */
export function phone({ x = 0, y = 0, w = 300, src, content, fit, pixelated, time = '9:41', statusDark, color = 'ink' } = {}) {
	statusDark ??= !src && !content;
	const bz = Math.max(6, w * 0.035), sw = w - 2 * bz, sh = sw * 19.5 / 9, h = sh + 2 * bz;
	const rOut = w * 0.16, rIn = rOut - bz;
	const body = color === 'silver' ? '#e3e5ea' : '#1b1b1f';
	const btn = (bx, by, bh) => `<rect x="${r1(bx)}" y="${r1(by)}" width="${r1(w * 0.014)}" height="${r1(bh)}" rx="${r1(w * 0.007)}" fill="${body}" stroke="${INK}" stroke-width="1.5"/>`;
	const frame = btn(-w * 0.012, h * 0.17, h * 0.045) + btn(-w * 0.012, h * 0.24, h * 0.08) + btn(-w * 0.012, h * 0.34, h * 0.08) + btn(w - w * 0.002, h * 0.27, h * 0.13)
		+ `<rect x="0" y="0" width="${r1(w)}" height="${r1(h)}" rx="${r1(rOut)}" fill="${body}" stroke="${INK}" stroke-width="3"/>`
		+ `<rect x="1.8" y="1.8" width="${r1(w - 3.6)}" height="${r1(h - 3.6)}" rx="${r1(rOut - 1.8)}" fill="none" stroke="${STEEL}" stroke-width="1.5"/>`;
	const fg = statusDark ? '#1b1b1f' : '#fff';
	const s = w / 300;
	const status = `<div style="${abs(sw * 0.1, sw * 0.045, sw * 0.25, 22 * s)}font-size:${r1(15 * s)}px;font-weight:600;color:${fg};line-height:${r1(22 * s)}px" data-t class="nolint" data-on="${statusDark ? '#ffffff' : '#000000'}">${esc(time)}</div>`
		+ `<svg style="${abs(sw - 74 * s, sw * 0.045 + 5 * s, 62 * s, 12 * s)}" viewBox="0 0 62 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="${fg}"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="${fg}"/><rect x="10" y="3" width="3" height="9" rx="1" fill="${fg}"/><rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="${fg}"/><rect x="31" y="0.5" width="24" height="11" rx="3.2" fill="none" stroke="${fg}" stroke-width="1.4"/><rect x="33.3" y="2.8" width="17" height="6.4" rx="1.6" fill="${fg}"/><rect x="56.4" y="4" width="1.8" height="4" rx="0.9" fill="${fg}"/></svg>`;
	const island = `<div style="${abs((sw - sw * 0.3) / 2, sw * 0.035, sw * 0.3, sw * 0.088)}border-radius:${r1(sw * 0.044)}px;background:#000"></div>`;
	const home = `<div style="${abs((sw - sw * 0.36) / 2, sh - sw * 0.04, sw * 0.36, Math.max(4, sw * 0.014))}border-radius:4px;background:${fg};opacity:.85"></div>`;
	const html = `<div style="${abs(x, y, w, h)}">${svgAbs(0, 0, w, h, frame)}<div style="${abs(bz, bz, sw, sh)}">${screenFill({ src, content: content ?? (src ? '' : feed(sw, sh)), fit, pixelated, bg: '#000' }, sw, sh, rIn)}${status}${island}${home}</div></div>`;
	return { html, w, h, screen: { x: x + bz, y: y + bz, w: sw, h: sh } };
}

/**
 * A laptop: a lid with an even bezel and a camera dot, the screen 16:10, and a base seen slightly from the front (a
 * lip and a thumb notch). Options: x, y, w (lid width, default 640), src | content, fit, pixelated.
 * Returns { html, w, h, screen } (w and h include the base, which is wider than the lid).
 */
export function laptop({ x = 0, y = 0, w = 640, src, content, fit, pixelated } = {}) {
	const bz = w * 0.03, sw = w - 2 * bz, sh = sw * 10 / 16, lidH = sh + bz * 1.6, baseW = w * 1.16, baseH = w * 0.034;
	const bx = (w - baseW) / 2, H = lidH + baseH + 4;
	const art = `<rect x="0" y="0" width="${r1(w)}" height="${r1(lidH)}" rx="${r1(w * 0.025)}" fill="#1b1b1f" stroke="${INK}" stroke-width="3"/>`
		+ `<circle cx="${r1(w / 2)}" cy="${r1(bz * 0.5)}" r="${r1(Math.max(2, w * 0.004))}" fill="#3a3d45"/>`
		+ `<path d="M ${r1(bx)} ${r1(lidH)} H ${r1(bx + baseW)} V ${r1(lidH + baseH * 0.55)} Q ${r1(bx + baseW)} ${r1(lidH + baseH)} ${r1(bx + baseW - baseH)} ${r1(lidH + baseH)} H ${r1(bx + baseH)} Q ${r1(bx)} ${r1(lidH + baseH)} ${r1(bx)} ${r1(lidH + baseH * 0.55)} Z" fill="${STEEL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
		+ `<path d="M ${r1(w / 2 - w * 0.08)} ${r1(lidH + 1.5)} Q ${r1(w / 2)} ${r1(lidH + baseH * 0.5)} ${r1(w / 2 + w * 0.08)} ${r1(lidH + 1.5)}" fill="#e3e5ea" stroke="${INK}" stroke-width="2"/>`;
	const html = `<div style="${abs(x, y, w, H)}">${svgAbs(0, 0, w, H, art)}<div style="${abs(bz, bz, sw, sh)}">${screenFill({ src, content: content ?? (src ? '' : dash(sw, sh)), fit, pixelated, bg: '#fff' }, sw, sh, 4)}</div></div>`;
	return { html, w: baseW, h: H, screen: { x: x + bz, y: y + bz, w: sw, h: sh } };
}

/**
 * A desktop monitor: a thin even bezel, the screen 16:9, a neck and a weighted foot standing on whatever is below.
 * Options: x, y, w (default 720), src | content, fit, pixelated. Returns { html, w, h, screen }.
 */
export function monitor({ x = 0, y = 0, w = 720, src, content, fit, pixelated } = {}) {
	const bz = w * 0.022, sw = w - 2 * bz, sh = sw * 9 / 16, bodyH = sh + bz * 2.6, neckH = w * 0.11, footW = w * 0.34, footH = w * 0.022;
	const H = bodyH + neckH + footH;
	const art = `<path d="M ${r1(w / 2 - w * 0.05)} ${r1(bodyH - 2)} L ${r1(w / 2 - w * 0.07)} ${r1(bodyH + neckH)} H ${r1(w / 2 + w * 0.07)} L ${r1(w / 2 + w * 0.05)} ${r1(bodyH - 2)} Z" fill="${STEEL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
		+ `<rect x="${r1((w - footW) / 2)}" y="${r1(bodyH + neckH - 2)}" width="${r1(footW)}" height="${r1(footH + 2)}" rx="${r1(footH / 2)}" fill="${STEEL}" stroke="${INK}" stroke-width="3"/>`
		+ `<rect x="0" y="0" width="${r1(w)}" height="${r1(bodyH)}" rx="${r1(w * 0.018)}" fill="#1b1b1f" stroke="${INK}" stroke-width="3"/>`
		+ `<rect x="${r1(w / 2 - w * 0.03)}" y="${r1(bodyH - bz * 0.95)}" width="${r1(w * 0.06)}" height="${r1(bz * 0.3)}" rx="${r1(bz * 0.15)}" fill="#3a3d45"/>`;
	const html = `<div style="${abs(x, y, w, H)}">${svgAbs(0, 0, w, H, art)}<div style="${abs(bz, bz, sw, sh)}">${screenFill({ src, content: content ?? (src ? '' : dash(sw, sh)), fit, pixelated, bg: '#fff' }, sw, sh, 3)}</div></div>`;
	return { html, w, h: H, screen: { x: x + bz, y: y + bz, w: sw, h: sh } };
}

/**
 * An app window in the editor's look: a title bar (traffic lights and a centred title), an activity bar of icons, a
 * sidebar with a header and rows (one selected), the main area (src | content), and a blue status bar. Set sidebar or
 * activity to false to drop them. Options: x, y, w (default 900), h (default w * 0.6), title, sideTitle, rows (number
 * of sidebar rows, default 8), selected (row index), theme ('light' | 'dark'), src | content, fit.
 * Returns { html, w, h, main: { x, y, w, h } } (the main area, to place callouts over it).
 */
export function appWindow({ x = 0, y = 0, w = 900, h, title = '', sideTitle = '', rows = 8, selected = 1, sidebar = true, activity = true, theme = 'light', src, content, fit } = {}) {
	h ??= w * 0.6;
	const dark = theme === 'dark';
	const c = dark ? { bg: '#1f1f23', bar: '#18181b', side: '#232328', line: '#3a3d45', fg: '#c9ccd3', row: '#3a3d45', sel: '#0f3a5f' } : { bg: '#ffffff', bar: '#f3f4f6', side: '#f7f8fa', line: '#d6d9e0', fg: '#5f6168', row: '#d6d9e0', sel: '#e3effb' };
	const s = w / 900, tb = 34 * s, ab = activity ? 48 * s : 0, sb = sidebar ? 220 * s : 0, st = 22 * s;
	let inner = `<div style="${abs(0, 0, w, tb)}background:${c.bar};border-bottom:1.5px solid ${c.line}"></div>`;
	inner += ['#e5484d', '#f5a524', '#30a46c'].map((col, i) => `<div style="${abs(14 * s + i * 20 * s, tb / 2 - 6 * s, 12 * s, 12 * s)}border-radius:50%;background:${col}"></div>`).join('');
	if (title) {
		inner += t('nolint', `${abs(w * 0.2, 0, w * 0.6, tb)}text-align:center;font-size:${r1(14 * s)}px;line-height:${r1(tb)}px;color:${c.fg};white-space:nowrap;overflow:hidden`, esc(title));
	}
	if (activity) {
		inner += `<div style="${abs(0, tb, ab, h - tb - st)}background:${c.bar};border-right:1.5px solid ${c.line}"></div>`;
		for (let i = 0; i < 5; i++) {
			inner += `<div style="${abs(ab / 2 - 11 * s, tb + 16 * s + i * 44 * s, 22 * s, 22 * s)}border-radius:${r1(5 * s)}px;border:${r1(2.5 * s)}px solid ${i === 0 ? (dark ? '#fff' : '#1b1b1f') : c.fg};box-sizing:border-box;opacity:${i === 0 ? 1 : 0.55}"></div>`;
		}
	}
	if (sidebar) {
		inner += `<div style="${abs(ab, tb, sb, h - tb - st)}background:${c.side};border-right:1.5px solid ${c.line}"></div>`;
		inner += sideTitle ? t('nolint', `${abs(ab + 16 * s, tb + 10 * s, sb - 32 * s, 20 * s)}font-size:${r1(11 * s)}px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c.fg}`, esc(sideTitle)) : `<div style="${abs(ab + 16 * s, tb + 16 * s, sb * 0.4, 8 * s)}border-radius:4px;background:${c.row}"></div>`;
		for (let i = 0; i < rows; i++) {
			const ry = tb + 44 * s + i * 32 * s;
			if (ry + 30 * s > h - st) {
				break;
			}
			if (i === selected) {
				inner += `<div style="${abs(ab + 6 * s, ry - 8 * s, sb - 12 * s, 26 * s)}border-radius:${r1(6 * s)}px;background:${c.sel}"></div>`;
			}
			inner += `<div style="${abs(ab + 18 * s, ry, (0.45 + ((i * 37) % 40) / 100) * (sb - 40 * s), 9 * s)}border-radius:5px;background:${i === selected ? 'var(--blue)' : c.row}"></div>`;
		}
	}
	const main = { x: ab + sb, y: tb, w: w - ab - sb, h: h - tb - st };
	inner += `<div style="${abs(main.x, main.y, main.w, main.h)}">${screenFill({ src, content: content ?? (src ? '' : codeLines(main.w, main.h, dark)), fit, bg: c.bg }, main.w, main.h, 0)}</div>`;
	inner += `<div style="${abs(0, h - st, w, st)}background:var(--blue)"></div>`;
	const html = `<div style="${abs(x, y, w, h)}overflow:hidden;border-radius:${r1(12 * s)}px;border:3px solid ${INK};box-sizing:border-box;background:${c.bg}">${inner}</div>`;
	return { html, w, h, main: { x: x + main.x, y: y + main.y, w: main.w, h: main.h } };
}

/**
 * A browser window: a tab strip with one tab (its title), an address bar with the URL and a lock, and the page (src |
 * content). Options: x, y, w (default 900), h (default w * 0.62), url, tab, src | content, fit.
 * Returns { html, w, h, page: { x, y, w, h } }.
 */
export function browser({ x = 0, y = 0, w = 900, h, url = '', tab = '', src, content, fit } = {}) {
	h ??= w * 0.62;
	const s = w / 900, tabsH = 38 * s, barH = 44 * s, top = tabsH + barH;
	let inner = `<div style="${abs(0, 0, w, tabsH)}background:#e9ebef"></div>`;
	inner += ['#e5484d', '#f5a524', '#30a46c'].map((col, i) => `<div style="${abs(14 * s + i * 20 * s, tabsH / 2 - 6 * s, 12 * s, 12 * s)}border-radius:50%;background:${col}"></div>`).join('');
	inner += `<div style="${abs(90 * s, 7 * s, 230 * s, tabsH - 7 * s)}border-radius:${r1(10 * s)}px ${r1(10 * s)}px 0 0;background:#fff"></div>`;
	if (tab) {
		inner += t('nolint', `${abs(106 * s, 7 * s, 200 * s, tabsH - 7 * s)}font-size:${r1(13 * s)}px;line-height:${r1(tabsH - 7 * s)}px;color:#1b1b1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`, esc(tab));
	}
	inner += `<div style="${abs(0, tabsH, w, barH)}background:#fff;border-bottom:1.5px solid #d6d9e0"></div>`;
	inner += `<div style="${abs(110 * s, tabsH + 8 * s, w - 220 * s, barH - 16 * s)}border-radius:${r1(14 * s)}px;background:#f1f2f5"></div>`;
	inner += `<svg style="${abs(124 * s, tabsH + barH / 2 - 7 * s, 11 * s, 14 * s)}" viewBox="0 0 11 14"><rect x="0.8" y="6" width="9.4" height="7.2" rx="1.6" fill="#5f6168"/><path d="M 2.8 6 V 4.2 a 2.7 2.7 0 0 1 5.4 0 V 6" fill="none" stroke="#5f6168" stroke-width="1.6"/></svg>`;
	if (url) {
		inner += t('nolint', `${abs(144 * s, tabsH + 8 * s, w - 270 * s, barH - 16 * s)}font-size:${r1(14 * s)}px;line-height:${r1(barH - 16 * s)}px;color:#1b1b1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`, esc(url));
	}
	['M 2 7 H 12 M 6 3 L 2 7 L 6 11', 'M 12 7 H 2 M 8 3 L 12 7 L 8 11'].forEach((d, i) => {
		inner += `<svg style="${abs((20 + i * 34) * s, tabsH + barH / 2 - 7 * s, 14 * s, 14 * s)}" viewBox="0 0 14 14"><path d="${d}" fill="none" stroke="${i ? '#b8bcc4' : '#5f6168'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
	});
	const page = { x: 0, y: top, w, h: h - top };
	inner += `<div style="${abs(page.x, page.y, page.w, page.h)}">${screenFill({ src, content: content ?? (src ? '' : pageLines(page.w, page.h)), fit, bg: '#fff' }, page.w, page.h, 0)}</div>`;
	const html = `<div style="${abs(x, y, w, h)}overflow:hidden;border-radius:${r1(12 * s)}px;border:3px solid ${INK};box-sizing:border-box;background:#fff">${inner}</div>`;
	return { html, w, h, page: { x: x + page.x, y: y + page.y, w: page.w, h: page.h } };
}

