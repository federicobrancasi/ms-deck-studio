// Six designs of the house style, picked side by side by people as the clearest and best-looking. Every visible word
// comes from the slide's fields.
//   fork-cover: a cover with the idea drawn on the right: a start, one node, a fork into 2-4 end cards
//   sieve:      of 100, the ones that were caught sit in a tray, the ones that slipped fell through into a bin (1-2 columns, clicks)
//   flow-bands: how it works as bands sized by share: a source, a node, two gates, three outcomes with big % (clicks)
//   dumbbell:   before -> after per group, the biggest gains bold, the rest muted, one calm note for marked rows
//   ladders:    one ladder per column with a label on each rung, a giant result under each column
//   launch:     next steps as a countdown to a rocket on its pad (blue page)
import { W, arrowHead, body, bodyHeight, esc, fmt, heading, ic, iconTile, msLogo, pill, r1 } from '../src/kit.mjs';

// ---------- sieve and flow-bands: 4 px outlines, 20 px corners, tinted fills ----------
const NUMBERS = (() => {
const SW = 4;
const at = (x, y, w, h) => `left:${r1(x)}px;top:${r1(y)}px${w != null ? `;width:${r1(w)}px` : ''}${h != null ? `;height:${r1(h)}px` : ''}`;
const t = (cls, style, html, { nolint = false } = {}) => `<div class="${cls}${nolint ? ' nolint' : ''}"${style ? ` style="${style}"` : ''} data-t>${html}</div>`;
const svgLayer = (cls, w, h, inner) => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;
const mix = (tone, pct) => `color-mix(in srgb, var(--${tone}) ${pct}%, #fff)`;
/** A deterministic wobble in [-1, 1] for item i, so drawings look hand-placed but never change between builds. */
const wob = (i, k = 1) => Math.sin(i * 12.9898 * k + 78.233) * 0.999;
/** A point and its angle (degrees) on a cubic Bezier at t. */
function bez(p0, p1, p2, p3, tt) {
	const u = 1 - tt;
	const x = u * u * u * p0[0] + 3 * u * u * tt * p1[0] + 3 * u * tt * tt * p2[0] + tt * tt * tt * p3[0];
	const y = u * u * u * p0[1] + 3 * u * u * tt * p1[1] + 3 * u * tt * tt * p2[1] + tt * tt * tt * p3[1];
	const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * tt * (p2[0] - p1[0]) + 3 * tt * tt * (p3[0] - p2[0]);
	const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * tt * (p2[1] - p1[1]) + 3 * tt * tt * (p3[1] - p2[1]);
	return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
}
/** A band (a ribbon of constant-ish width) from x0 (spanning a0..b0) to x1 (spanning a1..b1), as an S-curve. */
const band = (x0, a0, b0, x1, a1, b1, fill) => {
	const xm = (x0 + x1) / 2;
	return `<path d="M ${r1(x0)} ${r1(a0)} C ${r1(xm)} ${r1(a0)} ${r1(xm)} ${r1(a1)} ${r1(x1)} ${r1(a1)} L ${r1(x1)} ${r1(b1)} C ${r1(xm)} ${r1(b1)} ${r1(xm)} ${r1(b0)} ${r1(x0)} ${r1(b0)} Z" fill="${fill}"/>`;
};

return {
	/** A sieve: of 100 things, the ones that were caught sit as dots in a tray with a net for a bottom; the ones that
	 * slipped through lie as rings in a bin below, the last row still falling. One or two panels side by side, one per
	 * click (earlier panels stay bright). Fields: eyebrow, title, kicker (small caps over the panels),
	 * panels (1–2): [{ name, value (0–100 caught), big (default 'value%'), label (e.g. 'caught'), tone }],
	 * caught: { title, icon } (the tray's label), missed: { title, icon } (the bin's label),
	 * caughtTone (default 'green'), missedTone (default 'red'). */
	'sieve': {
		clicks: true,
		css: `
.sieve { position: relative; width: 1728px; }
.sieve .sieve-kicker { position: absolute; color: var(--body); }
.sieve .sieve-panel { position: absolute; }
.sieve .sieve-panel.rv-past { opacity: 1; }
.sieve .sieve-rule { position: absolute; width: 2px; background: var(--line); }
.sieve .sieve-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.sieve .sieve-head { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 26px; }
.sieve .sieve-big { font-size: 128px; font-weight: 700; letter-spacing: -.045em; line-height: .9; color: var(--fg); white-space: nowrap; }
.sieve .sieve-name { font-size: 34px; font-weight: 600; color: var(--ink); line-height: 1.2; white-space: nowrap; }
.sieve .sieve-label { font-size: 34px; font-weight: 600; color: var(--fg); line-height: 1.2; white-space: nowrap; }
.sieve .sieve-tag { position: absolute; display: flex; align-items: center; gap: 10px; color: var(--fg); }
.sieve .sieve-tag .lbl { color: var(--fg); font-size: 18px; }
`,
		render(s, ctx = {}) {
			const H = bodyHeight(s);
			const cT = s.caughtTone ?? 'green', mT = s.missedTone ?? 'red';
			const panels = (s.panels ?? []).slice(0, 2), one = panels.length === 1;
			const gap = 96, pw = one ? Math.min(W, 1180) : (W - gap) / 2, cols = 25, pitch = (pw - 40) / cols, r = pitch * 0.36;
			const kick = 0, head = 50, tray = { y: 196, h: 186 }, bin = { y: 418, h: H - 418 };
			let html = s.kicker ? t('lbl sieve-kicker', at(0, kick), fmt(s.kicker)) : '';
			panels.forEach((p, k) => {
				let svg = '';
				// The tray: solid sides and top, a dashed net for a bottom.
				const tx0 = 0, tx1 = pw, ty0 = tray.y, ty1 = tray.y + tray.h;
				svg += `<path d="M ${tx0 + 20} ${ty0} H ${tx1 - 20} Q ${tx1} ${ty0} ${tx1} ${ty0 + 20} V ${ty1} M ${tx0} ${ty1} V ${ty0 + 20} Q ${tx0} ${ty0} ${tx0 + 20} ${ty0}" fill="none" stroke="var(--${cT})" stroke-width="${SW}" stroke-linecap="round"/>`;
				svg += `<rect x="${tx0}" y="${ty0}" width="${pw}" height="${tray.h}" rx="20" fill="${mix(cT, 7)}"/>`;
				svg += `<line x1="${tx0}" y1="${ty1}" x2="${tx1}" y2="${ty1}" stroke="var(--${cT})" stroke-width="${SW}" stroke-dasharray="4 14" stroke-linecap="round"/>`;
				// The bin: an open box.
				const by0 = bin.y, by1 = bin.y + bin.h - 4;
				svg += `<rect x="0" y="${by0}" width="${pw}" height="${by1 - by0}" rx="20" fill="${mix(mT, 6)}"/>`;
				svg += `<path d="M 0 ${by0} V ${by1 - 20} Q 0 ${by1} 20 ${by1} H ${pw - 20} Q ${pw} ${by1} ${pw} ${by1 - 20} V ${by0}" fill="none" stroke="var(--${mT})" stroke-width="${SW}" stroke-linecap="round"/>`;
				// Caught: filled dots in the tray, from the bottom row up.
				const caught = Math.round(p.value), missed = 100 - caught;
				for (let i = 0; i < caught; i++) {
					const c = i % cols, row = Math.floor(i / cols);
					svg += `<circle cx="${r1(20 + (c + 0.5) * pitch)}" cy="${r1(ty1 - 24 - row * pitch)}" r="${r1(r)}" fill="var(--${cT})"/>`;
				}
				// Missed: rings that fell through the net. The lower rows have landed in the bin; the top row is still falling.
				const rows = Math.ceil(missed / cols);
				for (let i = 0; i < missed; i++) {
					const c = i % cols, row = Math.floor(i / cols), falling = row === rows - 1;
					const x = 20 + (c + 0.5) * pitch + wob(i) * 3;
					const y = by1 - 30 - row * (pitch * 1.18) - (falling ? 26 + Math.abs(wob(i, 3)) * 34 : Math.abs(wob(i, 3)) * 3);
					if (falling) {
						svg += `<line x1="${r1(x)}" y1="${r1(y - r - 40)}" x2="${r1(x)}" y2="${r1(y - r - 8)}" stroke="var(--${mT})" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7" opacity=".7"/>`;
					}
					svg += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r - 1.5)}" fill="#fff" stroke="var(--${mT})" stroke-width="3.5"/>`;
				}
				const tag = (o, tone, x, y) => o ? `<div class="sieve-tag t-${tone}" style="${at(x, y)}">${ic(o.icon ?? 'bot', 26)}<span class="lbl" data-t>${fmt(o.title ?? '')}</span></div>` : '';
				const headHtml = `<div class="sieve-head" style="top:${head}px">${t(`sieve-big t-${p.tone ?? 'blue'}`, '', esc(p.big ?? `${p.value}%`))}<div>${t('sieve-name', '', fmt(p.name), { nolint: true })}${p.label ? t(`sieve-label t-${p.tone ?? 'blue'}`, '', fmt(p.label)) : ''}</div></div>`;
				const rule = k ? `<div class="sieve-rule" style="left:${-gap / 2}px;top:${head}px;height:${H - head}px"></div>` : '';
				const later = ctx.step && k >= ctx.step ? ';visibility:hidden' : '';
				html += `<div class="sieve-panel" data-key="panel-${k}" style="${at(one ? (W - pw) / 2 : k * (pw + gap), 0, pw, H)}${later}">${rule}${svgLayer('sieve-svg', pw, H, svg)}${headHtml}${tag(s.caught ?? s.strong, cT, 22, ty0 + 14)}${tag(s.missed ?? s.cheap, mT, 22, by0 + 14)}</div>`;
			});
			return heading(s) + body(`<div class="sieve" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},
	/** How it works, as bands whose width is the share: a source, a node (with its questions as little marks), a first
	 * gate that sends part of the flow straight to a bottom outcome, a second gate that splits the rest between a top and
	 * a middle outcome; each outcome card shows its share big. Built in three clicks (node, gate 1, gate 2); every part
	 * stays at full strength once shown. Fields: eyebrow, title, kicker (small caps, top left),
	 * source: { title, icon }, node: { title, sub, icon, marks (question marks, 0–14) },
	 * gates (2): [{ title, yes, no }, { title, yes, no }],
	 * outcomes (3): [top, middle, bottom], each { title, share (0–100) }: gate 1 'no' goes to the bottom one, gate 2
	 * 'yes' to the top one and 'no' to the middle one. The shares set the band widths. */
	'flow-bands': {
		clicks: true,
		css: `
.flow-bands { position: relative; width: 1728px; }
.flow-bands .flow-bands-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.flow-bands .flow-bands-kicker { position: absolute; color: var(--body); }
.flow-bands .flow-bands-card { position: absolute; box-sizing: border-box; border-radius: 20px; border: ${SW}px solid var(--fg); background: var(--tint); display: flex; flex-direction: column; justify-content: center; gap: 10px; padding: 0 24px; }
.flow-bands .flow-bands-card .flow-bands-t { font-size: 30px; font-weight: 600; color: var(--ink); line-height: 1.15; white-space: nowrap; }
.flow-bands .flow-bands-card .flow-bands-s { font-size: 24px; color: var(--body); line-height: 1.2; white-space: nowrap; }
.flow-bands .flow-bands-gate { position: absolute; box-sizing: border-box; border-radius: 20px; border: ${SW}px solid var(--orange); background: var(--orange-tint); display: grid; place-items: center; text-align: center; padding: 0 14px; }
.flow-bands .flow-bands-gate div { font-size: 27px; font-weight: 600; color: var(--ink); line-height: 1.18; }
.flow-bands .flow-bands-out { position: absolute; box-sizing: border-box; border-radius: 20px; border: ${SW}px solid var(--purple); background: var(--purple-tint); display: flex; align-items: center; gap: 18px; padding: 0 22px; }
.flow-bands .flow-bands-out .flow-bands-share { font-size: 62px; font-weight: 700; letter-spacing: -.035em; color: var(--purple); line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.flow-bands .flow-bands-out .flow-bands-t { min-width: 0; font-size: 25px; font-weight: 600; color: var(--ink); line-height: 1.2; overflow-wrap: break-word; }
.flow-bands .flow-bands-yn { position: absolute; transform: translate(-50%, -50%); }
.flow-bands .flow-bands-yn.lbl { font-size: 22px; font-weight: 700; }
.flow-bands .flow-bands-hid { visibility: hidden; }
`,
		render(slide, ctx = {}) {
			// Generic field names, mapped onto the drawing's parts.
			const o = slide.outcomes ?? [];
			const s = { ...slide, prompt: slide.source ?? slide.prompt, call: slide.node ?? slide.call, gate1: slide.gates?.[0] ?? slide.gate1, gate2: slide.gates?.[1] ?? slide.gate2, strongLow: o[0] ?? slide.strongLow, strongFull: o[1] ?? slide.strongFull, cheap: o[2] ?? slide.cheap };
			const H = bodyHeight(s);
			const k = ctx.step ?? 3;
			const hid = n => (k < n ? ' flow-bands-hid' : '');
			const vis = n => (k < n ? ' visibility="hidden"' : '');
			const S = 1.8; // px of band per percent of traffic
			const Y = 380, top0 = Y - 50 * S, bot0 = Y + 50 * S;
			const cheap = s.cheap?.share ?? 33, low = s.strongLow?.share ?? 34, full = s.strongFull?.share ?? 33;
			const strong = low + full;
			const fill = mix('blue', 16);
			const P = { x0: 0, x1: 200 }, C = { x0: 290, x1: 620 }, G1 = { x0: 690, x1: 890 }, G2 = { x0: 1060, x1: 1250 }, M = { x0: 1440, x1: W };
			const g2y = 200, g2top = g2y - (strong / 2) * S;
			const yLow = 90, yFull = 330, yCheap = 600;
			let svg = `<defs><linearGradient id="flow-bands-fade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${fill}"/><stop offset="0.55" stop-color="${fill}"/><stop offset="1" stop-color="${fill}" stop-opacity="0"/></linearGradient></defs>`;
			svg += `<g${vis(1)}>${band(P.x1, top0, bot0, C.x0, top0, bot0, fill)}</g>`;
			svg += `<g${vis(2)}>${band(C.x1, top0, bot0, G1.x0, top0, bot0, fill)}`
				+ band(G1.x1, top0, top0 + strong * S, G2.x0, g2top, g2top + strong * S, k < 3 ? 'url(#flow-bands-fade)' : fill)
				+ band(G1.x1, top0 + strong * S, bot0, M.x0, yCheap - (cheap / 2) * S, yCheap + (cheap / 2) * S, fill) + '</g>';
			svg += `<g${vis(3)}>${band(G2.x1, g2top, g2top + low * S, M.x0, yLow - (low / 2) * S, yLow + (low / 2) * S, fill)}`
				+ band(G2.x1, g2top + low * S, g2top + strong * S, M.x0, yFull - (full / 2) * S, yFull + (full / 2) * S, fill) + '</g>';
			// The call's questions, as little marks in two rows.
			const marks = Math.min(14, s.call?.marks ?? 14), perRow = Math.ceil(marks / 2);
			let qs = '';
			for (let i = 0; i < marks; i++) {
				const cx = 18 + (i % perRow) * 36, cy = 18 + Math.floor(i / perRow) * 36;
				qs += `<circle cx="${cx}" cy="${cy}" r="13" fill="#fff" stroke="var(--purple)" stroke-width="3"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="var(--purple)">?</text>`;
			}
			const qsW = perRow * 36, qsH = 72;
			let html = '';
			if (s.kicker) {
				html += t('lbl flow-bands-kicker', at(0, 0), fmt(s.kicker));
			}
			const pr = s.prompt ?? {};
			html += `<div class="flow-bands-card t-blue${hid(1)}" style="${at(P.x0, top0 - 20, P.x1 - P.x0, bot0 - top0 + 40)};align-items:center;padding:0">${ic(pr.icon ?? 'chat', 64, 'var(--blue)')}${t('flow-bands-t', '', fmt(pr.title ?? ''))}</div>`;
			const c = s.call ?? {};
			html += `<div class="flow-bands-card t-purple${hid(1)}" style="${at(C.x0, Y - 170, C.x1 - C.x0, 340)}">${ic(c.icon ?? 'brainCircuit', 52, 'var(--purple)')}${t('flow-bands-t', '', fmt(c.title ?? ''))}${c.sub ? t('flow-bands-s', '', fmt(c.sub)) : ''}${svgLayer('flow-bands-qs', qsW, qsH, qs)}</div>`;
			const gate = (g, b, yc, h, n) => `<div class="flow-bands-gate${hid(n)}" style="${at(b.x0, yc - h / 2, b.x1 - b.x0, h)}">${t('', '', fmt(g?.title ?? ''))}</div>`;
			html += gate(s.gate1, G1, Y, bot0 - top0 + 40, 2) + gate(s.gate2, G2, g2y, strong * S + 40, 3);
			const yn = (text, x, y, tone, n) => text ? `<div class="lbl flow-bands-yn t-${tone}${hid(n)}" style="${at(x, y)};color:var(--fg)" data-t>${fmt(text)}</div>` : '';
			html += yn(s.gate1?.yes, 960, top0 - 46, 'blue', 2) + yn(s.gate1?.no, 1010, bot0 + 70, 'blue', 2);
			html += yn(s.gate2?.yes, 1320, yLow - 24, 'blue', 3) + yn(s.gate2?.no, 1330, yFull + 6, 'blue', 3);
			const outcome = (m, yc, n) => `<div class="flow-bands-out${hid(n)}" style="${at(M.x0, yc - 74, M.x1 - M.x0, 148)}" data-fit>${t('flow-bands-share', '', esc(`${m?.share ?? ''}%`))}${t('flow-bands-t', '', fmt(m?.title ?? ''), { nolint: true })}</div>`;
			html += outcome(s.cheap, yCheap, 2) + outcome(s.strongLow, yLow, 3) + outcome(s.strongFull, yFull, 3);
			return heading(s) + body(`<div class="flow-bands" style="height:${H}px">${svgLayer('flow-bands-svg', W, H, svg)}${html}</div>`, { vcenter: false });
		},
	},
};
})();

// ---------- fork-cover and dumbbell: 10 px rails with round caps, 18 px cards with a 3 px border ----------
const COVER = (() => {
const svg = (cls, w, h, inner) => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;
const mix = (tone, pct, base = '#fff') => `color-mix(in srgb, var(--${tone}) ${pct}%, ${base})`;
/** A text box at an absolute position: class, left, top, width, inner HTML, extra style. */
const at = (cls, x, y, w, html, style = '') => `<div class="${cls}" style="left:${r1(x)}px;top:${r1(y)}px;width:${r1(w)}px;${style}" data-t>${html}</div>`;

/** A polyline with rounded corners (an SVG path). */
function rounded(pts, r = 28) {
	let d = `M ${r1(pts[0][0])} ${r1(pts[0][1])}`;
	for (let i = 1; i < pts.length - 1; i++) {
		const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
		const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
		const k = Math.min(r, l1 / 2, l2 / 2);
		d += ` L ${r1(x1 - ((x1 - x0) / l1) * k)} ${r1(y1 - ((y1 - y0) / l1) * k)} Q ${r1(x1)} ${r1(y1)} ${r1(x1 + ((x2 - x1) / l2) * k)} ${r1(y1 + ((y2 - y1) / l2) * k)}`;
	}
	const last = pts[pts.length - 1];
	return d + ` L ${r1(last[0])} ${r1(last[1])}`;
}

/** The one stroke width of every drawn line, rail and track. */
const S = 10;
const line = (d, tone = 'blue', w = S) => `<path d="${d}" stroke="var(--${tone})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const arrow = (x, y, tone = 'blue') => `<path d="M ${x - 22} ${y - 16} L ${x} ${y} L ${x - 22} ${y + 16}" stroke="var(--${tone})" stroke-width="${S}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
/** An end card (where the fork can end), CSS scoped to the design n. */
const endCss = n => `.${n} .${n}-end { position: absolute; display: flex; align-items: center; gap: 20px; padding: 0 26px; box-sizing: border-box; border-radius: 18px; background: #fff; border: 3px solid var(--fg); transform: translateY(-50%); }
.${n} .${n}-et { font-size: 28px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.${n} .${n}-es { margin-top: 2px; font-size: 22px; color: var(--body); white-space: nowrap; }`;
const endCard = (n, e, x, y, w, h) => `<div class="${n}-end t-${e.tone ?? 'purple'}" style="left:${r1(x)}px;top:${r1(y)}px;width:${r1(w)}px;height:${h}px" data-fit>${iconTile(e.icon ?? 'bot', { tone: e.tone ?? 'purple', size: 56 })}<div><div class="${n}-et nolint" data-t>${fmt(e.title)}</div>${e.sub ? `<div class="${n}-es" data-t>${fmt(e.sub)}</div>` : ''}</div></div>`;

return {
	/** A cover with the idea drawn on the right half: a start (an icon in a circle) leads into one big node (an icon in a
	 * purple ring, its label under it), which forks into 2–4 end cards, the most important on top. The left is the
	 * built-in title: eyebrow, title, sub (one plain line), speaker, pills. Fields: eyebrow, title, sub (or quote, for
	 * real words someone said), speaker: { initials, name, role }, pills, start: { icon }, node: { icon, label },
	 * ends (2–4, top to bottom): [{ title, sub, icon, tone }]. */
	'fork-cover': {
		bare: true,
		css: `
.fork-cover { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.fork-cover .fork-cover-svg { position: absolute; left: 0; top: 0; }
.fork-cover .fork-cover-left { width: 820px; }
.fork-cover .fork-cover-ic { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); }
.fork-cover .fork-cover-node { position: absolute; text-align: center; font-size: 27px; font-weight: 600; color: var(--purple); white-space: nowrap; }
${endCss('fork-cover')}
`,
		render(s) {
			const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
			const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
			const left = `<div class="tf-left fork-cover-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : s.quote ? `<div class="tf-quote" data-t>\u201c${fmt(s.quote)}\u201d</div>` : ''}${sp}${pills}</div>`;
			const y0 = 540, xIn = 1000, xNode = 1226, R = 96, xFork = 1392, xCard = 1478, cardW = 1824 - xCard, cardH = 112;
			const ends = (s.ends ?? []).slice(0, 4);
			const ys = { 2: [380, 700], 3: [290, 540, 790], 4: [230, 410, 670, 850] }[Math.max(2, Math.min(4, (s.ends ?? []).length))];
			let g = line(`M ${xIn + 46} ${y0} H ${xNode - R}`);
			ends.forEach((e, i) => {
				const y = ys[i];
				g += line(y === y0 ? `M ${xNode + R} ${y0} H ${xCard - 8}` : rounded([[xNode + R, y0], [xFork, y0], [xFork, y], [xCard - 8, y]], 64)) + arrow(xCard - 8, y);
			});
			g += `<circle cx="${xNode}" cy="${y0}" r="${R}" fill="${mix('purple', 12)}" stroke="var(--purple)" stroke-width="${S}"/>`;
			const node = s.node ?? {};
			const html = `<div class="fork-cover-ic" style="left:${xIn}px;top:${y0}px">${iconTile(s.start?.icon ?? 'chat', { tone: 'blue', size: 92, round: true })}</div>`
				+ `<div class="fork-cover-ic" style="left:${xNode}px;top:${y0}px;color:var(--purple)">${ic(node.icon ?? 'brain', 92)}</div>`
				+ (node.label ? at('fork-cover-node', xNode - 160, y0 + R + 22, 320, fmt(node.label)) : '')
				+ ends.map((e, i) => endCard('fork-cover', e, xCard, ys[i], cardW, cardH)).join('');
			return `<div class="fork-cover">${svg('fork-cover-svg', 1920, 1080, g)}${left}${html}${msLogo()}</div>`;
		},
	},
	/** Before -> after per group, with a hierarchy: one row per group, a hollow grey dot (before) joined by a green bar to
	 * a filled green dot (after) on a 0–max scale, the gain on the right. Rows with hi: true (the few that matter) are at
	 * full strength, the rest muted. Rows with mark: true get a small grey marker, explained by one calm note under the
	 * chart (the honest caveat). Fields: eyebrow, title, rows (4–12): [{ label, from, to, gain, hi, mark }],
	 * max (default 100), unit (default '%'), legend: { from, to }, mark: { icon, text }, axis (word at the scale's end). */
	'dumbbell': {
		css: `
.dumbbell { position: relative; width: 1728px; }
.dumbbell .dumbbell-svg { position: absolute; left: 0; top: 0; }
.dumbbell .dumbbell-lab { position: absolute; font-size: 26px; font-weight: 600; color: var(--ink); white-space: nowrap; text-align: right; }
.dumbbell .dumbbell-lab.dumbbell-mute { font-size: 23px; font-weight: 400; color: var(--muted); }
.dumbbell .dumbbell-gain { position: absolute; font-size: 36px; font-weight: 700; letter-spacing: -.01em; color: var(--green); white-space: nowrap; font-variant-numeric: tabular-nums; }
.dumbbell .dumbbell-gain.dumbbell-mute { font-size: 24px; font-weight: 600; color: var(--muted); }
.dumbbell .dumbbell-mark { position: absolute; display: grid; place-items: center; color: var(--muted); }
.dumbbell .dumbbell-tick { position: absolute; text-align: center; font-size: 19px; color: var(--muted); font-variant-numeric: tabular-nums; }
.dumbbell .dumbbell-head { position: absolute; display: flex; align-items: center; gap: 36px; }
.dumbbell .dumbbell-k { display: flex; align-items: center; gap: 12px; font-size: 23px; color: var(--body); white-space: nowrap; }
.dumbbell .dumbbell-note { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 23px; color: var(--body); white-space: nowrap; }
.dumbbell .dumbbell-axis { position: absolute; font-size: 19px; color: var(--muted); white-space: nowrap; }
`,
		render(s) {
			const rows = s.rows ?? [];
			const max = s.max ?? 100;
			const x0 = 330, x1 = 1330, xGain = 1390, xMark = 1462;
			// Rows share the body's height: up to 64 px each, so a short chart is as big as a long one.
			const top = 66, pitch = Math.min(64, Math.max(44, (bodyHeight(s) - top - 120) / Math.max(rows.length, 1)));
			const yAxis = top + rows.length * pitch + 4;
			const H = yAxis + 96;
			const X = v => x0 + (v / max) * (x1 - x0);
			let g = '';
			for (let t = 0; t <= max; t += max / 4) {
				g += `<path d="M ${r1(X(t))} ${top - 14} V ${yAxis}" stroke="var(--line)" stroke-width="2"/>`;
			}
			let html = '';
			rows.forEach((r, i) => {
				const y = top + i * pitch + pitch / 2;
				const hi = !!r.hi;
				g += `<path d="M ${r1(X(r.from))} ${y} H ${r1(X(r.to))}" stroke="${mix('green', hi ? 42 : 16)}" stroke-width="${hi ? 14 : 10}" stroke-linecap="round"/>`;
				g += `<circle cx="${r1(X(r.from))}" cy="${y}" r="${hi ? 12 : 10}" fill="#fff" stroke="${hi ? 'var(--neutral)' : mix('neutral', 55)}" stroke-width="4"/>`;
				g += `<circle cx="${r1(X(r.to))}" cy="${y}" r="${hi ? 16 : 11}" fill="${hi ? 'var(--green)' : mix('green', 55)}"/>`;
				html += at(`dumbbell-lab nolint${hi ? '' : ' dumbbell-mute'}`, 0, y - (hi ? 17 : 15), x0 - 34, fmt(r.label));
				html += at(`dumbbell-gain nolint${hi ? '' : ' dumbbell-mute'}`, xGain, y - (hi ? 23 : 16), 120, esc(r.gain));
				if (r.mark) {
					html += `<div class="dumbbell-mark" style="left:${xMark}px;top:${y - 16}px;width:32px;height:32px">${ic(s.mark?.icon ?? 'money', 30)}</div>`;
				}
			});
			for (let t = 0; t <= max; t += max / 4) {
				html += at('dumbbell-tick nolint', X(t) - 40, yAxis + 8, 80, `${t}${s.unit ?? '%'}`);
			}
			if (s.axis) {
				html += at('dumbbell-axis', x1 + 56, yAxis + 8, 200, fmt(s.axis));
			}
			const lg = s.legend ?? {};
			html += `<div class="dumbbell-head" style="left:${x0 - 12}px;top:0">`
				+ `<span class="dumbbell-k">${svg('', 30, 30, `<circle cx="15" cy="15" r="10" fill="#fff" stroke="var(--neutral)" stroke-width="4"/>`)}<span data-t>${fmt(lg.from ?? 'Before')}</span></span>`
				+ `<span class="dumbbell-k">${svg('', 34, 34, `<circle cx="17" cy="17" r="15" fill="var(--green)"/>`)}<span data-t>${fmt(lg.to ?? 'After')}</span></span></div>`;
			if (s.mark?.text) {
				html += `<div class="dumbbell-note" style="left:${x0 - 12}px;top:${yAxis + 54}px">${ic(s.mark.icon ?? 'money', 30, 'var(--muted)')}<span data-t>${fmt(s.mark.text)}</span></div>`;
			}
			return heading(s) + body(`<div class="dumbbell" style="height:${H}px">${svg('dumbbell-svg', W, H, g)}${html}</div>`, { vcenter: true });
		},
	},
};
})();

// ---------- ladders and launch: tinted tiles, white icon wells, 10 px rails ----------
const OBJECTS = (() => {
const RAIL = '#b6c2d3', GREY = '#8a8f98', CONNECTOR = 'var(--connector)';
const at = (x, y, w, h) => `left:${r1(x)}px;top:${r1(y)}px${w != null ? `;width:${r1(w)}px` : ''}${h != null ? `;height:${r1(h)}px` : ''}`;
const t = (cls, style, html) => `<div class="${cls}" style="${style}" data-t>${html}</div>`;
const svgLayer = (cls, w, h, inner) => `<svg class="${cls}" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;
const line = (x0, y0, x1, y1, colour = CONNECTOR, width = 4, arrow = true) => `<path d="M ${r1(x0)} ${r1(y0)} L ${r1(x1)} ${r1(y1)}" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" fill="none"/>${arrow ? arrowHead(x1, y1, x0, y0, colour, width) : ''}`;

// ---------- shared pieces (each design gets its own copy of the CSS, so every selector names the design) ----------

/** CSS for the tile, the icon well and the ladder chips, scoped to one design. */
const shared = name => `
.${name} .hc-tile { position: absolute; display: flex; align-items: center; gap: 22px; padding: 0 30px; border-radius: 22px; background: var(--tint); color: var(--fg); }
.${name} .hc-tile.hc-tile-v { flex-direction: column; justify-content: center; gap: 10px; padding: 0; text-align: center; }
.${name} .hc-well { width: 76px; height: 76px; border-radius: 50%; background: #fff; display: grid; place-items: center; flex: none; color: var(--fg); }
.${name} .hc-tt { font-size: 32px; font-weight: 700; line-height: 1.15; color: var(--ink); white-space: nowrap; }
.${name} .hc-ts { margin-top: 4px; font-family: var(--mono); font-size: 23px; font-weight: 500; line-height: 1.3; color: var(--body); white-space: nowrap; }
.${name} .hc-chip { position: absolute; transform: translate(-50%, -50%); padding: 7px 16px; border-radius: 12px; background: #fff; box-shadow: 0 0 0 3px var(--blue); color: var(--ink); font-family: var(--mono); font-size: 25px; font-weight: 600; line-height: 1.2; white-space: nowrap; }
.${name} .hc-chip.hc-chip-off { box-shadow: 0 0 0 3px #d3d8e0; color: var(--muted); font-family: var(--sans); font-weight: 500; }
.${name} .hc-svg { position: absolute; left: 0; top: 0; overflow: visible; }
`;

/** A tile: tinted, radius 22, a white icon well, a title and a mono sub. vertical: icon above the words. */
function tile({ x, y, w, h, tone, icon, title, sub, vertical = false, extra = '' }) {
	return `<div class="hc-tile${vertical ? ' hc-tile-v' : ''} t-${tone}" style="${at(x, y, w, h)}"><span class="hc-well">${ic(icon, 40)}</span><div>${t('hc-tt', '', fmt(title))}${sub ? t('hc-ts nolint', '', fmt(sub)) : ''}${extra}</div></div>`;
}

/** The ladder: two grey rails, blue rungs (a dashed grey one when unused), a chip on each used rung.
 * rungs: [{ y, chip }] with chip null for an unused rung (offText is then shown on it). */
function ladder({ x0, x1, top, bot, rungs, offText }) {
	let svg = `<path d="M ${r1(x0)} ${r1(top)} V ${r1(bot)} M ${r1(x1)} ${r1(top)} V ${r1(bot)}" stroke="${RAIL}" stroke-width="10" stroke-linecap="round"/>`;
	let html = '';
	for (const r of rungs) {
		if (r.chip != null) {
			svg += `<path d="M ${r1(x0)} ${r1(r.y)} H ${r1(x1)}" stroke="var(--blue)" stroke-width="10" stroke-linecap="round"/>`;
			html += `<div class="hc-chip nolint" style="left:${r1((x0 + x1) / 2)}px;top:${r1(r.y)}px" data-t>${fmt(r.chip)}</div>`;
		} else {
			svg += `<path d="M ${r1(x0)} ${r1(r.y)} H ${r1(x1)}" stroke="#d3d8e0" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/>`;
			if (offText) {
				html += `<div class="hc-chip hc-chip-off" style="left:${r1((x0 + x1) / 2)}px;top:${r1(r.y)}px" data-t>${fmt(offText)}</div>`;
			}
		}
	}
	return { svg, html };
}

return {
	/** One ladder per column: three rungs, bottom to top, each with a chip naming what sits there (null = not used, a
	 * dashed grey rung), the row names on the left, and the column's result as a giant number in a tile under it.
	 * Fields: eyebrow, title, rows: [bottom, middle, top] (row names), columns (2–5): [{ name, rungs: [bottom, middle,
	 * top], value, tone (default 'green') }], caption (left of the results), unused (text on an unused rung). */
	'ladders': {
		css: shared('ladders') + `
.ladders { position: relative; width: 1728px; }
.ladders .ladders-level { position: absolute; left: 0; display: flex; align-items: center; color: var(--muted); font-size: 19px; }
.ladders .ladders-name { position: absolute; text-align: center; font-size: 34px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.ladders .ladders-hero { position: absolute; display: grid; place-items: center; border-radius: 22px; background: var(--tint); }
.ladders .ladders-v { font-size: 82px; font-weight: 700; letter-spacing: -.035em; line-height: 1; color: var(--fg); white-space: nowrap; font-variant-numeric: tabular-nums; }
.ladders .ladders-cap { position: absolute; left: 0; color: var(--green); font-size: 19px; line-height: 1.5; white-space: normal; }
`,
		render(s) {
			s = { ...s, levels: s.rows ?? s.levels };
			const tiers = s.columns ?? s.tiers ?? [];
			const left = 190, colW = (W - left) / tiers.length;
			const top = 74, bot = 404, rungY = [360, 240, 120];
			const heroY = 452, heroH = 150, railGap = 318;
			let svg = '', html = '';
			(s.levels ?? []).forEach((lv, k) => {
				html += `<div class="lbl ladders-level" style="${at(0, rungY[k] - 20, left - 20, 40)}" data-t>${fmt(lv)}</div>`;
			});
			tiers.forEach((tr, i) => {
				const cx = left + colW * i + colW / 2;
				const L = ladder({ x0: cx - railGap / 2, x1: cx + railGap / 2, top, bot, rungs: rungY.map((y, k) => ({ y, chip: tr.rungs?.[k] ?? null })), offText: s.unused });
				svg += L.svg;
				html += L.html;
				html += `<div class="ladders-name" style="${at(cx - colW / 2, 0, colW, 46)}" data-t>${fmt(tr.name)}</div>`;
				html += `<div class="ladders-hero t-${tr.tone ?? 'green'}" style="${at(cx - railGap / 2 - 12, heroY, railGap + 24, heroH)}"><span class="ladders-v" data-t>${esc(tr.value)}</span></div>`;
			});
			if (s.caption) {
				html += `<div class="lbl ladders-cap" style="${at(0, heroY + 30, left - 24, heroH - 60)};display:flex;align-items:center" data-t>${fmt(s.caption)}</div>`;
			}
			const h = heroY + heroH;
			return heading(s) + body(`<div class="ladders" style="height:${h}px">${svgLayer('hc-svg', W, h, svg)}${html}</div>`);
		},
	},
	/** Next steps as a countdown to a launch, for a blue page (bg: 'blue'): white step cards numbered down along a dashed
	 * track that ends at a rocket waiting on its pad, engine not lit. Fields: eyebrow, title, steps (3): [{ icon, title,
	 * sub }], pad (label under the rocket). */
	'launch': {
		css: `
.launch { position: relative; width: 1728px; }
.launch .launch-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.launch .launch-card { position: absolute; border-radius: 22px; background: #fff; padding: 34px 34px 0; }
.launch .launch-top { display: flex; align-items: center; justify-content: space-between; }
.launch .launch-n { width: 76px; height: 76px; border-radius: 50%; background: var(--blue); color: #fff; display: grid; place-items: center; font-size: 40px; font-weight: 700; }
.launch .launch-well { width: 76px; height: 76px; border-radius: 50%; background: var(--blue-tint); color: var(--blue); display: grid; place-items: center; }
.launch .launch-t { margin-top: 34px; font-size: 38px; font-weight: 700; line-height: 1.15; color: var(--ink); white-space: nowrap; }
.launch .launch-s { margin-top: 10px; font-size: 27px; line-height: 1.3; color: var(--body); white-space: nowrap; }
.launch .launch-pad { position: absolute; transform: translateX(-50%); color: #fff; font-size: 20px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const steps = s.steps ?? [];
			const cw = 340, ch = 300, gap = 52, cy = 330;
			const cardY = cy - ch / 2;
			// Rocket on the right, standing on a pad; the track runs under the cards to the pad.
			const rx = 1520, padY = 560, bodyW = 128, bodyTop = 70, bodyBot = padY - 70;
			let svg = '';
			const trackY = padY;
			svg += `<path d="M 40 ${trackY} H ${rx - 150}" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 18"/>`;
			steps.forEach((_, i) => {
				const x = i * (cw + gap) + cw / 2;
				svg += `<path d="M ${x} ${cardY + ch + 6} V ${trackY - 14}" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16"/><circle cx="${x}" cy="${trackY}" r="13" fill="#fff"/>`;
			});
			// Launch pad and tower.
			svg += `<path d="M ${rx - 170} ${padY} H ${rx + 170}" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`;
			svg += `<path d="M ${rx - 120} ${padY} L ${rx - 96} ${padY - 26} H ${rx + 96} L ${rx + 120} ${padY}" fill="rgba(255,255,255,.25)" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>`;
			const tx0 = rx + 128, tx1 = rx + 170;
			svg += `<path d="M ${tx0} ${padY - 26} V ${bodyTop + 70} M ${tx1} ${padY - 26} V ${bodyTop + 70}" stroke="rgba(255,255,255,.8)" stroke-width="6" stroke-linecap="round"/>`;
			for (let y = bodyTop + 70; y < padY - 60; y += 56) {
				svg += `<path d="M ${tx0} ${y} L ${tx1} ${y + 56} M ${tx1} ${y} L ${tx0} ${y + 56}" stroke="rgba(255,255,255,.45)" stroke-width="4" stroke-linecap="round"/>`;
			}
			svg += `<path d="M ${tx0} ${bodyTop + 200} H ${rx + bodyW / 2 + 6}" stroke="rgba(255,255,255,.8)" stroke-width="6" stroke-linecap="round"/>`;
			// The rocket: body, nose, window, fins, nozzle. Engine not lit.
			const bx0 = rx - bodyW / 2, bx1 = rx + bodyW / 2, by = bodyBot - 26;
			svg += `<path d="M ${bx0 + 6} ${by - 120} L ${bx0 - 60} ${by + 6} L ${bx0 + 6} ${by - 16} Z M ${bx1 - 6} ${by - 120} L ${bx1 + 60} ${by + 6} L ${bx1 - 6} ${by - 16} Z" fill="#cfe4f7" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>`;
			svg += `<path d="M ${bx0} ${by} V ${bodyTop + 150} C ${bx0} ${bodyTop + 70}, ${rx - 30} ${bodyTop + 18}, ${rx} ${bodyTop} C ${rx + 30} ${bodyTop + 18}, ${bx1} ${bodyTop + 70}, ${bx1} ${bodyTop + 150} V ${by} Z" fill="#fff"/>`;
			svg += `<path d="M ${bx0 + 8} ${bodyTop + 120} H ${bx1 - 8}" stroke="var(--blue)" stroke-width="6" stroke-linecap="round" opacity=".35"/>`;
			svg += `<circle cx="${rx}" cy="${bodyTop + 205}" r="34" fill="var(--blue)" stroke="#cfe4f7" stroke-width="10"/>`;
			svg += `<path d="M ${rx - 30} ${by} L ${rx - 40} ${padY - 26} H ${rx + 40} L ${rx + 30} ${by} Z" fill="#cfe4f7" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>`;
			let html = '';
			steps.forEach((st, i) => {
				html += `<div class="launch-card" style="${at(i * (cw + gap), cardY, cw, ch)}" data-fit><div class="launch-top"><span class="launch-n" data-t>${steps.length - i}</span><span class="launch-well">${ic(st.icon ?? 'checkmark', 40)}</span></div>${t('launch-t', '', fmt(st.title))}${st.sub ? t('launch-s', '', fmt(st.sub)) : ''}</div>`;
			});
			if (s.pad) {
				html += `<div class="lbl launch-pad" style="left:${rx}px;top:${padY + 28}px" data-t>${fmt(s.pad)}</div>`;
			}
			return heading(s) + body(`<div class="launch" style="height:${H}px">${svgLayer('launch-svg', W, H, svg)}${html}</div>`, { vcenter: false });
		},
	},
};
})();

export const designs = { ...NUMBERS, ...COVER, ...OBJECTS };
