// Design plugins for the guide itself: pages that show slides instead of being one. Each takes slide images (src: a
// PNG of a built page, e.g. from guide/specimens.mjs) and lays them out as a style guide would: a cover, contents, the
// three levels, an annotated slide, do and don't, colour swatches, the type scale, a catalogue and strips of pages.
import { esc, fmt, ic, heading, body, bodyHeight, msLogo, W, r1, asset, phone, laptop, monitor, appWindow, browser, person, agent, layer } from '../src/kit.mjs';

/** A slide image with a thin frame, or a placeholder if it isn't built yet. */
function shot(src, w, extra = '') {
	const h = Math.round((w * 9) / 16);
	const rel = src ? asset(src) : null;
	return rel
		? `<div class="gd-shot" style="width:${w}px;height:${h}px${extra}"><img src="${esc(rel)}" alt=""></div>`
		: `<div class="gd-shot missing" data-missing="${esc(src ?? '')}" style="width:${w}px;height:${h}px${extra}"></div>`;
}

const SHOT_CSS = (name) => `
.${name} .gd-shot { position: relative; flex: none; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 0 0 1.5px var(--line-strong); }
.${name} .gd-shot img { display: block; width: 100%; height: 100%; }
.${name} .gd-shot.missing { background: var(--surface); }
.${name} .gd-name { display: inline-block; font-family: var(--mono); font-size: 19px; color: var(--blue); background: var(--blue-tint); padding: 3px 10px; border-radius: 6px; white-space: nowrap; }
`;

export const designs = {
	/** The cover: logo, eyebrow, title, a line under it and a meta line on the left; on the right, a few pages fanned
	 * out, each with a small label. eyebrow, title, sub, meta, shots: [{ src, label }] (up to 3) */
	'guide-cover': {
		bare: true,
		css: `
.guide-cover { position: absolute; inset: 0; }
.guide-cover .gc-left { position: absolute; left: 96px; top: 300px; width: 760px; }
.guide-cover .gc-title { margin-top: 26px; font-size: 96px; font-weight: 600; line-height: 1.04; letter-spacing: -.025em; color: var(--ink); }
.guide-cover .gc-sub { margin-top: 30px; font-size: 30px; line-height: 1.4; color: var(--body); }
.guide-cover .gc-meta { position: absolute; left: 96px; bottom: 96px; font-size: 22px; color: var(--muted); }
.guide-cover .gc-stack { position: absolute; left: 0; top: 0; }
.guide-cover .gc-item { position: absolute; }
.guide-cover .gc-lbl { position: absolute; right: calc(100% + 28px); flex-direction: row-reverse; display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--blue); white-space: nowrap; }
.guide-cover .gc-lbl b { width: 30px; height: 30px; border-radius: 50%; background: var(--blue); color: #fff; display: grid; place-items: center; font-size: 15px; letter-spacing: 0; }
${SHOT_CSS('guide-cover')}
`,
		render(s) {
			const shots = (s.shots ?? []).slice(0, 3);
			const w = 560, h = Math.round((w * 9) / 16), gap = 40, x = 1264;
			const y0 = Math.round((1080 - (shots.length * h + (shots.length - 1) * gap)) / 2);
			const items = shots.map((sh, i) => `<div class="gc-item" style="left:${x}px;top:${y0 + i * (h + gap)}px">${shot(sh.src, w)}${sh.label ? `<div class="gc-lbl" style="top:${Math.round(h / 2) - 15}px" data-t><b>${i + 1}</b>${fmt(sh.label)}</div>` : ''}</div>`).join('');
			return `${msLogo()}<div class="guide-cover"><div class="gc-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="gc-title" data-t>${fmt(s.title)}</div>${s.sub ? `<div class="gc-sub" data-t>${fmt(s.sub)}</div>` : ''}</div>${s.meta ? `<div class="gc-meta" data-t>${fmt(s.meta)}</div>` : ''}<div class="gc-stack">${items}</div></div>`;
		},
	},

	/** Contents in two columns: a number, a title, a line, and the page. items: [{ title, sub, page }] */
	'guide-contents': {
		css: `
.guide-contents { display: grid; grid-template-columns: 1fr 1fr; grid-auto-flow: column; column-gap: 96px; row-gap: 8px; }
.guide-contents .gt-row { display: flex; align-items: baseline; gap: 28px; padding: 18px 0; box-shadow: inset 0 -1.5px 0 var(--line); }
.guide-contents .gt-n { width: 56px; font-size: 32px; font-weight: 600; color: var(--blue); font-variant-numeric: tabular-nums; flex: none; }
.guide-contents .gt-b { flex: 1; min-width: 0; }
.guide-contents .gt-t { font-size: 30px; font-weight: 600; color: var(--ink); }
.guide-contents .gt-s { margin-top: 4px; font-size: 21px; color: var(--muted); }
.guide-contents .gt-p { font-size: 22px; color: var(--muted); font-variant-numeric: tabular-nums; }
`,
		render(s) {
			const rows = Math.ceil(s.items.length / 2);
			const items = s.items.map((it, i) => `<div class="gt-row"><span class="gt-n nolint" data-t>${String(i + 1).padStart(2, '0')}</span><div class="gt-b"><div class="gt-t" data-t>${fmt(it.title)}</div>${it.sub ? `<div class="gt-s" data-t>${fmt(it.sub)}</div>` : ''}</div><span class="gt-p nolint" data-t>${esc(it.page ?? '')}</span></div>`).join('');
			return heading(s) + body(`<div class="guide-contents" style="grid-template-rows:repeat(${rows},auto)">${items}</div>`);
		},
	},

	/** The three levels side by side: a number, a name, a page that shows it, what it's for, its layouts.
	 * levels: [{ title, src, use, layouts }] */
	'guide-levels': {
		css: `
.guide-levels { display: flex; gap: 48px; }
.guide-levels .gl-col { flex: 1; min-width: 0; }
.guide-levels .gl-head { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
.guide-levels .gl-n { width: 46px; height: 46px; border-radius: 50%; background: var(--fg); color: #fff; display: grid; place-items: center; font-size: 22px; font-weight: 700; flex: none; }
.guide-levels .gl-t { font-size: 34px; font-weight: 600; color: var(--ink); }
.guide-levels .gl-use { margin-top: 22px; font-size: 23px; line-height: 1.4; color: var(--ink); }
.guide-levels .gl-lay { margin-top: 16px; font-family: var(--mono); font-size: 17px; line-height: 1.5; color: var(--muted); }
${SHOT_CSS('guide-levels')}
`,
		render(s) {
			const tones = ['blue', 'green', 'purple'];
			const w = Math.floor((W - 48 * (s.levels.length - 1)) / s.levels.length);
			const cols = s.levels.map((l, i) => `<div class="gl-col t-${l.tone ?? tones[i]}"><div class="gl-head"><span class="gl-n" data-t>${i + 1}</span><span class="gl-t" data-t>${fmt(l.title)}</span></div>${shot(l.src, w)}<div class="gl-use" data-t>${fmt(l.use)}</div><div class="gl-lay nolint" data-t>${fmt(l.layouts)}</div></div>`).join('');
			return heading(s) + body(`<div class="guide-levels">${cols}</div>`, { vcenter: false });
		},
	},

	/** One slide, annotated: numbered pins on the picture (x, y in the slide's own 1920 × 1080 pixels) and the same
	 * numbers in a list beside it; optional dashed boxes with a label (the grid). src, pins: [{ x, y }],
	 * items: [{ title, text }], boxes: [{ x, y, w, h, label }] */
	'guide-anatomy': {
		css: `
.guide-anatomy { position: relative; display: flex; gap: 56px; align-items: center; }
.guide-anatomy .ga-pic { position: relative; flex: none; }
.guide-anatomy .ga-pin { position: absolute; width: 38px; height: 38px; margin: -19px 0 0 -19px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 18px; font-weight: 700; box-shadow: 0 0 0 4px #fff; }
.guide-anatomy .ga-box { position: absolute; border: 2.5px dashed var(--orange); border-radius: 4px; }
.guide-anatomy .ga-box span { position: absolute; right: 8px; top: 50%; width: 32px; height: 32px; margin-top: -16px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 15px; font-weight: 700; }
.guide-anatomy .ga-list { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 18px; }
.guide-anatomy .ga-item { display: flex; gap: 18px; }
.guide-anatomy .ga-item b { width: 34px; height: 34px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 16px; flex: none; }
.guide-anatomy .ga-t { font-size: 24px; font-weight: 600; color: var(--ink); }
.guide-anatomy .ga-x { margin-top: 2px; font-size: 19px; line-height: 1.38; color: var(--body); }
${SHOT_CSS('guide-anatomy')}
`,
		render(s) {
			const w = s.width ?? 1140, k = w / 1920;
			const pins = (s.pins ?? []).map((p, i) => `<span class="ga-pin nolint" style="left:${r1(p.x * k)}px;top:${r1(p.y * k)}px" data-t>${i + 1}</span>`).join('');
			const boxes = (s.boxes ?? []).map(b => `<div class="ga-box" style="left:${r1(b.x * k)}px;top:${r1(b.y * k)}px;width:${r1(b.w * k)}px;height:${r1(b.h * k)}px">${b.label ? `<span class="nolint" data-t>${fmt(b.label)}</span>` : ''}</div>`).join('');
			const list = (s.items ?? []).map((it, i) => `<div class="ga-item"><b class="nolint" data-t>${i + 1}</b><div><div class="ga-t" data-t>${fmt(it.title)}</div>${it.text ? `<div class="ga-x" data-t>${fmt(it.text)}</div>` : ''}</div></div>`).join('');
			return heading(s) + body(`<div class="guide-anatomy"><div class="ga-pic">${shot(s.src, w)}${boxes}${pins}</div>${list ? `<div class="ga-list">${list}</div>` : ''}</div>`);
		},
	},

	/** Do and don't: two slides side by side, a red or green verdict over each and a line under it.
	 * items: [{ src, kind: 'dont' | 'do', label, text }] (2) */
	'guide-pair': {
		css: `
.guide-pair { display: flex; gap: 56px; }
.guide-pair .gp-col { flex: 1; }
.guide-pair .gp-v { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; font-size: 26px; font-weight: 700; color: var(--fg); }
.guide-pair .gp-v .ic { flex: none; }
.guide-pair .gp-col.t-red .gd-shot { box-shadow: 0 0 0 3px var(--red); }
.guide-pair .gp-col.t-green .gd-shot { box-shadow: 0 0 0 3px var(--green); }
.guide-pair .gp-x { margin-top: 20px; font-size: 23px; line-height: 1.4; color: var(--body); }
${SHOT_CSS('guide-pair')}
`,
		render(s) {
			const w = Math.floor((W - 56) / 2);
			const cols = s.items.map(it => {
				const dont = it.kind === 'dont';
				return `<div class="gp-col t-${dont ? 'red' : 'green'}"><div class="gp-v">${ic(dont ? 'dismissCircle' : 'checkCircle', 34)}<span data-t>${fmt(it.label ?? (dont ? 'Don\u2019t' : 'Do'))}</span></div>${shot(it.src, w)}${it.text ? `<div class="gp-x" data-t>${fmt(it.text)}</div>` : ''}</div>`;
			}).join('');
			return heading(s) + body(`<div class="guide-pair">${cols}</div>`);
		},
	},

	/** Colour swatches: a block per tone with its name and hex, its tint under it, what it means and its contrast; and a
	 * row of neutrals. colors: [{ name, hex, tint, role, ratio }], neutrals: [{ name, hex, role }] */
	'guide-swatches': {
		css: `
.guide-swatches { display: flex; flex-direction: column; gap: 40px; }
.guide-swatches .gs-row { display: flex; gap: 20px; }
.guide-swatches .gs-c { flex: 1; min-width: 0; }
.guide-swatches .gs-main { height: 190px; border-radius: 14px 14px 0 0; padding: 22px 24px; display: flex; flex-direction: column; justify-content: flex-end; color: #fff; }
.guide-swatches .gs-name { font-size: 27px; font-weight: 600; }
.guide-swatches .gs-hex { margin-top: 2px; font-family: var(--mono); font-size: 18px; opacity: .92; }
.guide-swatches .gs-tint { height: 56px; border-radius: 0 0 14px 14px; padding: 0 24px; display: flex; align-items: center; font-family: var(--mono); font-size: 16px; }
.guide-swatches .gs-role { margin-top: 16px; font-size: 21px; line-height: 1.35; color: var(--ink); }
.guide-swatches .gs-ratio { margin-top: 6px; font-family: var(--mono); font-size: 16px; color: var(--muted); }
.guide-swatches .gs-n { flex: 1; display: flex; align-items: center; gap: 16px; }
.guide-swatches .gs-dot { width: 56px; height: 56px; border-radius: 12px; flex: none; box-shadow: inset 0 0 0 1.5px var(--line); }
.guide-swatches .gs-nt { font-size: 21px; font-weight: 600; color: var(--ink); }
.guide-swatches .gs-nx { font-size: 17px; color: var(--muted); }
`,
		render(s) {
			const cols = s.colors.map(c => `<div class="gs-c"><div class="gs-main" style="background:${c.hex}"><div class="gs-name" data-t>${fmt(c.name)}</div><div class="gs-hex nolint" data-t>${esc(c.hex)}</div></div><div class="gs-tint nolint" style="background:${c.tint};color:${c.hex}" data-t>tint ${esc(c.tint)}</div><div class="gs-role" data-t>${fmt(c.role)}</div>${c.ratio ? `<div class="gs-ratio nolint" data-t>${esc(c.ratio)}</div>` : ''}</div>`).join('');
			const neutrals = (s.neutrals ?? []).map(n => `<div class="gs-n"><span class="gs-dot" style="background:${n.hex}"></span><div><div class="gs-nt" data-t>${fmt(n.name)}</div><div class="gs-nx nolint" data-t>${esc(n.hex)}  \u00b7  ${fmt(n.role)}</div></div></div>`).join('');
			return heading(s) + body(`<div class="guide-swatches"><div class="gs-row">${cols}</div>${neutrals ? `<div class="gs-row">${neutrals}</div>` : ''}</div>`);
		},
	},

	/** The type scale: each role written in its own size and weight, with its spec beside it.
	 * rows: [{ role, spec, cls (a class from theme/studio.css), sample }] */
	'guide-typescale': {
		css: `
.guide-typescale { display: flex; flex-direction: column; }
.guide-typescale .gy-row { display: flex; align-items: center; gap: 48px; padding: 14px 0; box-shadow: inset 0 -1.5px 0 var(--line); }
.guide-typescale .gy-meta { width: 330px; flex: none; }
.guide-typescale .gy-role { font-size: 21px; font-weight: 600; color: var(--ink); }
.guide-typescale .gy-spec { margin-top: 2px; font-family: var(--mono); font-size: 16px; color: var(--muted); }
.guide-typescale .gy-sample { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; }
`,
		render(s) {
			const rows = s.rows.map(r => `<div class="gy-row"><div class="gy-meta"><div class="gy-role" data-t>${fmt(r.role)}</div><div class="gy-spec nolint" data-t>${esc(r.spec)}</div></div><div class="gy-sample ${esc(r.cls)} nolint" data-t>${fmt(r.sample)}</div></div>`).join('');
			return heading(s) + body(`<div class="guide-typescale">${rows}</div>`);
		},
	},

	/** A catalogue page: up to six slides in a grid, each with its layout name and what it's for.
	 * items: [{ src, name, text }], cols (default 3) */
	'guide-catalog': {
		css: `
.guide-catalog { display: grid; justify-content: center; column-gap: 56px; row-gap: 30px; }
.guide-catalog .gk-cap { margin-top: 12px; display: flex; align-items: baseline; gap: 14px; }
.guide-catalog .gk-x { font-size: 20px; color: var(--body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
${SHOT_CSS('guide-catalog')}
`,
		render(s) {
			const cols = s.cols ?? 3, gapX = 56;
			const rows = Math.ceil(s.items.length / cols);
			const H = bodyHeight(s);
			const byH = Math.floor(((H - 30 * (rows - 1)) / rows - 44) * 16 / 9);
			const w = Math.min(Math.floor((W - gapX * (cols - 1)) / cols), byH);
			const cells = s.items.map(it => `<div style="width:${w}px">${shot(it.src, w)}<div class="gk-cap"><span class="gd-name nolint" data-t>${esc(it.name)}</span><span class="gk-x" data-t>${fmt(it.text ?? '')}</span></div></div>`).join('');
			return heading(s) + body(`<div class="guide-catalog" style="grid-template-columns:repeat(${cols},${w}px)">${cells}</div>`);
		},
	},

	/** Strips of pages: rows of slides left to right, with a label before each row and an arrow between pages (a deck's
	 * outline, or the clicks of one slide). rows: [{ label, sub, items: [{ src, caption }] }], arrows (default true) */
	/** The props of src/kit.mjs side by side, each with its name: a phone, a laptop, a monitor, an app window and a
	 * browser, holding sample screens. Fields: eyebrow, title, screens: { phone, laptop, monitor, app, browser } (srcs). */
	'guide-props': {
		css: `
.guide-props { position: relative; width: 1728px; }
.guide-props .gpr-n { position: absolute; transform: translateX(-50%); font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--blue); white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s), sc = s.screens ?? {}, floor = H - 70;
			const P = phone({ x: 30, w: 220, src: sc.phone });
			P.html = phone({ x: 30, y: floor - P.h, w: 220, src: sc.phone }).html;
			const L0 = laptop({ w: 470 }), L = laptop({ x: 330, y: floor - L0.h, w: 470, src: sc.laptop });
			const M0 = monitor({ w: 400 }), M = monitor({ x: 880, y: floor - M0.h, w: 400, src: sc.monitor });
			const A = appWindow({ x: 1340, y: 0, w: 388, h: 250, title: 'App window', sideTitle: 'Explorer', rows: 5, src: sc.app });
			const B = browser({ x: 1340, y: 300, w: 388, h: floor - 300, url: 'contoso.com/notes', tab: 'Contoso Notes', src: sc.browser });
			const name = (x, y, text) => `<div class="gpr-n nolint" style="left:${r1(x)}px;top:${r1(y)}px" data-t>${esc(text)}</div>`;
			const html = P.html + L.html + M.html + A.html + B.html
				+ name(30 + 110, floor + 22, 'phone()') + name(330 + 235, floor + 22, 'laptop()') + name(880 + 200, floor + 22, 'monitor()')
				+ `<div style="position:absolute;left:96px;right:0;top:${floor}px;height:3px;background:var(--line-strong)"></div>`
				+ name(1340 + 194, 256, 'appWindow()') + name(1340 + 194, floor + 22, 'browser()');
			return heading(s) + body(`<div class="guide-props" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},
	/** The characters of src/kit.mjs in a row, each with its call: people in different outfits and poses holding
	 * different things, and the agent. Fields: eyebrow, title, cast: [{ kind: 'person' | 'agent', label, ...options }]. */
	'guide-cast': {
		css: `
.guide-cast { position: relative; width: 1728px; }
.guide-cast .gcs-n { position: absolute; transform: translateX(-50%); font-family: var(--mono); font-size: 18px; font-weight: 600; color: var(--blue); white-space: nowrap; text-align: center; }
`,
		render(s) {
			const H = bodyHeight(s), cast = s.cast ?? [], floor = H - 80, cw = W / Math.max(1, cast.length);
			let g = `<path d="M 0 ${floor} H ${W}" stroke="var(--line-strong)" stroke-width="4"/>`, html = '';
			cast.forEach((c, i) => {
				const x = cw * i + cw / 2, k = c.k ?? Math.min(1.4, (floor - 20) / 340);
				g += (c.kind === 'agent' ? agent(x, floor, k, c) : person(x, floor, k, c)).svg;
				html += `<div class="gcs-n nolint" style="left:${r1(x)}px;top:${floor + 20}px" data-t>${esc(c.label ?? '')}</div>`;
			});
			return heading(s) + body(`<div class="guide-cast" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},
	'guide-strip': {
		css: `
.guide-strip { display: flex; flex-direction: column; gap: 34px; }
.guide-strip .gs-r { display: flex; align-items: center; }
.guide-strip .gs-l { width: 290px; flex: none; padding-right: 24px; }
.guide-strip .gs-lt { font-size: 27px; font-weight: 600; color: var(--ink); }
.guide-strip .gs-ls { margin-top: 4px; font-size: 19px; line-height: 1.35; color: var(--muted); }
.guide-strip .gs-items { display: flex; align-items: flex-start; }
.guide-strip .gs-a { flex: none; display: grid; place-items: center; color: var(--connector); }
.guide-strip .gs-cap { margin-top: 12px; font-size: 21px; line-height: 1.35; color: var(--body); }
${SHOT_CSS('guide-strip')}
`,
		render(s) {
			const H = bodyHeight(s);
			const arrows = s.arrows !== false;
			const labelled = s.rows.some(r => r.label);
			const avail = W - (labelled ? 290 : 0);
			const most = Math.max(...s.rows.map(r => r.items.length));
			const gap = arrows ? (most > 4 ? 26 : 56) : 16;
			const hasCaps = s.rows.some(r => r.items.some(it => it.caption));
			const byW = Math.floor((avail - gap * (most - 1)) / most);
			const byH = Math.floor(((H - 34 * (s.rows.length - 1)) / s.rows.length - (hasCaps ? 70 : 0)) * 16 / 9);
			const w = Math.min(byW, byH);
			const rows = s.rows.map(r => {
				const items = r.items.map((it, k) => `${k && arrows ? `<span class="gs-a" style="width:${gap}px;height:${Math.round((w * 9) / 16)}px">${ic('arrowRight', gap > 40 ? 32 : 20)}</span>` : k ? `<span style="width:${gap}px;flex:none"></span>` : ''}<div style="width:${w}px;flex:none">${shot(it.src, w)}${it.caption ? `<div class="gs-cap" data-t>${fmt(it.caption)}</div>` : ''}</div>`).join('');
				return `<div class="gs-r">${labelled ? `<div class="gs-l">${r.label ? `<div class="gs-lt" data-t>${fmt(r.label)}</div>` : ''}${r.sub ? `<div class="gs-ls" data-t>${fmt(r.sub)}</div>` : ''}</div>` : ''}<div class="gs-items">${items}</div></div>`;
			}).join('');
			return heading(s) + body(`<div class="guide-strip">${rows}</div>`);
		},
	},
};
