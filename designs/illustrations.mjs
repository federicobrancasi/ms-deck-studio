// Illustrations: drawn objects that carry one idea each, in the house style (4 px outlines, 20 px corners, tinted
// fills, Fluent icons, no shadows). Every visible word comes from the slide's fields.
//   factory:    a conveyor belt: an input goes in, passes 3–6 machines (one per step), comes out finished (clicks)
//   orbit:      one centre with 4–8 satellites around it: one engine, many products
//   stopwatch:  a stopwatch whose face is split into timed parts, with the parts listed beside it
//   devices:    a transformation between devices: a phone, a laptop or a file goes in, 1–2 come out
//   film-strip: 1–2 strips of film, each frame a picture or a drawn cell, with a tag under each frame
//   hopper:     many things pour into a hopper, a few come out of the spout and land on a tray
//   odometer:   1–3 mechanical counters with rolling digits, for big running totals
//   pinboard:   2–5 bugs pinned to a board like specimens, each with what it broke and what it is now
//   moving:     boxes travelling from an old house to a new one, the ones that arrived ticked
//   scales:     1–3 balance scales: two values in the pans, the beam tilts by their difference
//   picture-cover: a cover with a real picture on the right, framed as a film strip, a screen or a plain card
import { STYLE, at, t, mix, layer, wob, esc, fmt, ic, pill, msLogo, heading, body, bodyHeight, W, r1, asset } from '../src/kit.mjs';

const SW = STYLE.stroke;
const TONES = ['blue', 'purple', 'green', 'orange', 'red', 'neutral'];
const img = (src, alt = '') => {
	const rel = src ? asset(src) : null;
	return rel ? `<img src="${esc(rel)}" alt="${esc(alt)}">` : '';
};

export const designs = {
	/** A conveyor belt, left to right: the input waits in a box on the left, each machine above the belt is one step
	 * (a number, a title, a few words), the item changes colour as it passes each machine, and the finished result
	 * comes out on the right (a card, or a picture with a caption). Built click by click when the slide has clicks: one
	 * machine per click, earlier ones stay lit, the result shows on the last click.
	 * Fields: eyebrow, title, input: { icon, title, sub }, stations (3–6): [{ icon, title, sub, tone }],
	 * output: { icon, title, sub, src (a picture in assets/, optional) }. */
	'factory': {
		clicks: true,
		css: `
.factory { position: relative; width: 1728px; }
.factory .fa-in, .factory .fa-out { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; border-radius: 20px; text-align: center; padding: 0 16px; box-sizing: border-box; }
.factory .fa-in { background: var(--blue-tint); box-shadow: inset 0 0 0 4px var(--blue); color: var(--blue); }
.factory .fa-out { background: var(--green-tint); box-shadow: inset 0 0 0 4px var(--green); color: var(--green); overflow: hidden; }
.factory .fa-out.has-img { justify-content: flex-start; padding: 0; }
.factory .fa-out .fa-pic { position: relative; width: 100%; flex: 1; overflow: hidden; }
.factory .fa-out .fa-pic img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.factory .fa-out.has-img .fa-cap { width: 100%; padding: 12px 16px 14px; box-sizing: border-box; background: var(--green); }
.factory .fa-out.has-img .fa-cap .fa-t, .factory .fa-out.has-img .fa-cap .fa-s { color: #fff; }
.factory .fa-t { font-size: 26px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.factory .fa-s { font-size: 19px; color: var(--body); line-height: 1.3; }
.factory .fa-m { position: absolute; display: flex; flex-direction: column; align-items: center; text-align: center; }
.factory .fa-m.off { opacity: .25; }
.factory .fa-mh { height: 112px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding-bottom: 14px; box-sizing: border-box; }
.factory .fa-mt { font-size: 25px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.factory .fa-ms { margin-top: 4px; font-size: 18px; color: var(--body); line-height: 1.3; }
.factory .fa-box { position: relative; width: 100%; height: 176px; border-radius: 20px 20px 8px 8px; background: var(--tint); box-shadow: inset 0 0 0 4px var(--fg); display: grid; place-items: center; color: var(--fg); }
.factory .fa-n { position: absolute; left: -14px; top: -14px; width: 42px; height: 42px; border-radius: 50%; background: var(--fg); color: #fff; display: grid; place-items: center; font-size: 19px; font-weight: 700; box-shadow: 0 0 0 4px #fff; }
.factory .fa-later { visibility: hidden; }
`,
		render(s, ctx = {}) {
			const H = bodyHeight(s);
			const st = (s.stations ?? []).slice(0, 6), n = st.length;
			const k = ctx.step ? Math.min(ctx.step, n) : n, done = !ctx.step || ctx.step >= (ctx.steps ?? n);
			const out = s.output ?? {}, hasPic = !!(out.src && asset(out.src));
			const inW = 176, outW = hasPic ? 340 : 260, gap = 18, boxH = 176;
			const pic = 112 + boxH + 56 + 44 + 60, y0 = Math.max(0, Math.round((H - pic) / 2) - 10);
			const boxTop = y0 + 112, beltY = boxTop + boxH + 56, beltH = 40;
			const bx0 = inW + 24, bx1 = W - outW - 24;
			const mw = Math.min(260, (bx1 - bx0 - 16 - gap * (n - 1)) / Math.max(n, 1));
			const span = n * mw + (n - 1) * gap, mx0 = bx0 + (bx1 - bx0 - span) / 2;
			let svg = '';
			// The belt: a rounded band, chevrons pointing the way, rollers under it, the floor.
			svg += `<rect x="${r1(bx0)}" y="${beltY}" width="${r1(bx1 - bx0)}" height="${beltH}" rx="${beltH / 2}" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}"/>`;
			for (let x = bx0 + 40; x < bx1 - 30; x += 46) {
				svg += `<path d="M ${r1(x)} ${beltY + 12} l 10 8 l -10 8" fill="none" stroke="var(--connector)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
			}
			for (let x = bx0 + 26; x < bx1 - 10; x += 66) {
				svg += `<circle cx="${r1(x)}" cy="${beltY + beltH + 20}" r="14" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/><circle cx="${r1(x)}" cy="${beltY + beltH + 20}" r="3" fill="var(--ink)"/>`;
			}
			svg += `<path d="M 0 ${beltY + beltH + 40} H ${W}" stroke="var(--line-strong)" stroke-width="3" stroke-linecap="round"/>`;
			// The item on the belt between the machines, changing colour as it passes each one.
			const xs = [bx0 + 20, ...st.map((_, i) => mx0 + i * (mw + gap) + mw / 2), bx1 - 20];
			for (let i = 0; i < xs.length - 1; i++) {
				if (i > k) {
					continue;
				}
				const x = (xs[i] + xs[i + 1]) / 2, tone = i === 0 ? 'blue' : st[i - 1].tone ?? TONES[(i - 1) % TONES.length];
				svg += `<rect x="${r1(x - 20)}" y="${beltY - 40}" width="40" height="40" rx="8" fill="${mix(tone, 22)}" stroke="var(--${tone})" stroke-width="${SW}"/><path d="M ${r1(x - 10)} ${beltY - 26} H ${r1(x + 10)} M ${r1(x - 10)} ${beltY - 16} H ${r1(x + 4)}" stroke="var(--${tone})" stroke-width="3" stroke-linecap="round"/>`;
			}
			let html = `<div class="fa-in" style="${at(0, beltY + beltH / 2 - 150, inW, 240)}" data-fit>${ic(s.input?.icon ?? 'document', 56)}${t('fa-t', '', fmt(s.input?.title ?? ''))}${s.input?.sub ? t('fa-s', '', fmt(s.input.sub)) : ''}</div>`;
			st.forEach((m, i) => {
				const tone = m.tone ?? TONES[i % TONES.length], x = mx0 + i * (mw + gap), off = i + 1 > k ? ' off' : '';
				// The nozzle from the machine down to the belt.
				svg += `<path d="M ${r1(x + mw / 2 - 26)} ${boxTop + boxH} L ${r1(x + mw / 2 - 12)} ${beltY - 50} H ${r1(x + mw / 2 + 12)} L ${r1(x + mw / 2 + 26)} ${boxTop + boxH}" fill="${mix(tone, 18)}" stroke="var(--${tone})" stroke-width="${SW}" stroke-linejoin="round"${off ? ' opacity=".25"' : ''}/>`;
				html += `<div class="fa-m t-${tone}${off}" data-key="m-${i}" style="${at(x, y0, mw)}"><div class="fa-mh">${t('fa-mt', '', fmt(m.title ?? ''))}${m.sub ? t('fa-ms', '', fmt(m.sub)) : ''}</div><div class="fa-box" data-fit><span class="fa-n nolint" data-t>${i + 1}</span>${ic(m.icon ?? 'settings', 76)}</div></div>`;
			});
			const outBody = hasPic
				? `<div class="fa-pic">${img(out.src, out.title)}</div><div class="fa-cap">${t('fa-t', '', fmt(out.title ?? ''))}${out.sub ? t('fa-s', '', fmt(out.sub)) : ''}</div>`
				: `${ic(out.icon ?? 'checkCircle', 56)}${t('fa-t', '', fmt(out.title ?? ''))}${out.sub ? t('fa-s', '', fmt(out.sub)) : ''}`;
			const oh = hasPic ? Math.round(outW * 9 / 16) + 86 : 240;
			html += `<div class="fa-out${hasPic ? ' has-img' : ''}${done ? '' : ' fa-later'}" data-key="out" style="${at(W - outW, beltY + beltH / 2 - oh / 2, outW, oh)}" data-fit>${outBody}</div>`;
			return heading(s) + body(`<div class="factory" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** One centre and its satellites: a big ring in the middle (an icon, a name, a line), 4–8 cards around it on an
	 * orbit, each joined to the centre by a dashed spoke. For "one engine, many products".
	 * Fields: eyebrow, title, center: { icon, title, sub, tone (default 'purple') }, items: [{ icon, title, sub, tone }]. */
	'orbit': {
		css: `
.orbit { position: relative; width: 1728px; }
.orbit .ob-c { position: absolute; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: var(--tint); box-shadow: inset 0 0 0 6px var(--fg); color: var(--fg); }
.orbit .ob-ct { margin-top: 6px; font-size: 30px; font-weight: 700; color: var(--ink); line-height: 1.1; }
.orbit .ob-cs { margin-top: 4px; font-size: 19px; color: var(--body); line-height: 1.25; }
.orbit .ob-s { position: absolute; display: flex; align-items: center; gap: 16px; padding: 0 20px; box-sizing: border-box; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 4px var(--fg); transform: translate(-50%, -50%); }
.orbit .ob-w { width: 56px; height: 56px; border-radius: 14px; background: var(--tint); color: var(--fg); display: grid; place-items: center; flex: none; }
.orbit .ob-st { font-size: 24px; font-weight: 700; color: var(--ink); line-height: 1.15; white-space: nowrap; }
.orbit .ob-ss { margin-top: 2px; font-size: 17px; color: var(--body); line-height: 1.25; white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 8), n = items.length;
			const cx = W / 2, cy = H / 2 + 6, rx = 640, ry = Math.min(250, H / 2 - 70), R = 128;
			const c = s.center ?? {}, ct = c.tone ?? 'purple';
			let svg = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--line-strong)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`;
			svg += `<ellipse cx="${cx}" cy="${cy}" rx="${r1(rx * 0.62)}" ry="${r1(ry * 0.62)}" fill="none" stroke="var(--line)" stroke-width="2"/>`;
			let html = '';
			items.forEach((it, i) => {
				const a = (-90 + (360 * i) / n) * Math.PI / 180, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
				const tone = it.tone ?? TONES[i % TONES.length];
				svg += `<path d="M ${cx} ${cy} L ${r1(x)} ${r1(y)}" stroke="var(--${tone})" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" opacity=".7"/><circle cx="${r1(cx + (x - cx) * 0.62)}" cy="${r1(cy + (y - cy) * 0.62)}" r="7" fill="var(--${tone})"/>`;
				html += `<div class="ob-s t-${tone}" style="left:${r1(x)}px;top:${r1(y)}px;height:96px;min-width:240px" data-fit><span class="ob-w">${ic(it.icon ?? 'apps', 32)}</span><div>${t('ob-st nolint', '', fmt(it.title ?? ''))}${it.sub ? t('ob-ss', '', fmt(it.sub)) : ''}</div></div>`;
			});
			html += `<div class="ob-c t-${ct}" style="${at(cx - R, cy - R, R * 2, R * 2)}">${ic(c.icon ?? 'bot', 72)}${t('ob-ct', '', fmt(c.title ?? ''))}${c.sub ? t('ob-cs', '', fmt(c.sub)) : ''}</div>`;
			return heading(s) + body(`<div class="orbit" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** A stopwatch whose face is split into timed parts, one coloured arc each, against the whole dial (max), with the
	 * headline in the middle; the parts are listed on the right with their times big.
	 * Fields: eyebrow, title, max (the whole dial, e.g. 100), unit (default 's'), center: { value, label },
	 * parts (1–4): [{ value, label, sub, tone }]. */
	'stopwatch': {
		css: `
.stopwatch { position: relative; width: 1728px; }
.stopwatch .sw-c { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.stopwatch .sw-cv { font-size: 96px; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: var(--ink); font-variant-numeric: tabular-nums; }
.stopwatch .sw-cl { margin-top: 8px; font-size: 22px; color: var(--body); }
.stopwatch .sw-row { position: absolute; display: flex; align-items: center; gap: 28px; }
.stopwatch .sw-bar { width: 14px; height: 92px; border-radius: 7px; background: var(--fg); flex: none; }
.stopwatch .sw-v { font-size: 76px; font-weight: 700; letter-spacing: -.035em; color: var(--fg); line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; }
.stopwatch .sw-l { font-size: 30px; font-weight: 600; color: var(--ink); line-height: 1.15; }
.stopwatch .sw-s { margin-top: 4px; font-size: 20px; color: var(--body); }
`,
		render(s) {
			const H = bodyHeight(s);
			const max = s.max ?? 60, unit = s.unit ?? 's', parts = (s.parts ?? []).slice(0, 4);
			const R = Math.min(250, H / 2 - 50), cx = 360, cy = H / 2 + 30;
			let svg = '';
			// The crown and the side button.
			svg += `<rect x="${cx - 26}" y="${r1(cy - R - 64)}" width="52" height="34" rx="8" fill="#fff" stroke="var(--ink)" stroke-width="${SW + 2}"/><rect x="${cx - 12}" y="${r1(cy - R - 32)}" width="24" height="26" fill="var(--ink)"/>`;
			svg += `<g transform="rotate(42 ${cx} ${cy})"><rect x="${cx - 16}" y="${r1(cy - R - 34)}" width="32" height="30" rx="7" fill="#fff" stroke="var(--ink)" stroke-width="${SW + 2}"/></g>`;
			svg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="var(--ink)" stroke-width="10"/>`;
			for (let i = 0; i < 60; i++) {
				const a = (i * 6 - 90) * Math.PI / 180, big = i % 5 === 0, r0 = R - (big ? 30 : 20), rr = R - 12;
				svg += `<path d="M ${r1(cx + r0 * Math.cos(a))} ${r1(cy + r0 * Math.sin(a))} L ${r1(cx + rr * Math.cos(a))} ${r1(cy + rr * Math.sin(a))}" stroke="${big ? 'var(--ink)' : 'var(--faint)'}" stroke-width="${big ? 4 : 2}" stroke-linecap="round"/>`;
			}
			// One arc per part, back to back from the top, on a pale track.
			const ar = R - 66, sw = 46;
			svg += `<circle cx="${cx}" cy="${cy}" r="${ar}" fill="none" stroke="var(--track)" stroke-width="${sw}"/>`;
			let a0 = -90;
			for (const [i, p] of parts.entries()) {
				const tone = p.tone ?? TONES[i % TONES.length], sweep = Math.min(359.9, (Number(p.value) / max) * 360), a1 = a0 + sweep;
				const P = d => [cx + ar * Math.cos(d * Math.PI / 180), cy + ar * Math.sin(d * Math.PI / 180)];
				const [x0, y0] = P(a0), [x1, y1] = P(a1);
				svg += `<path d="M ${r1(x0)} ${r1(y0)} A ${ar} ${ar} 0 ${sweep > 180 ? 1 : 0} 1 ${r1(x1)} ${r1(y1)}" fill="none" stroke="var(--${tone})" stroke-width="${sw}" stroke-linecap="butt"/>`;
				a0 = a1 + 1.5;
			}
			const c = s.center ?? {};
			let html = `<div class="sw-c" style="${at(cx - 150, cy - 80, 300, 160)}">${t('sw-cv', '', esc(c.value ?? ''))}${c.label ? t('sw-cl', '', fmt(c.label)) : ''}</div>`;
			const rowH = 132, top = cy - (parts.length * rowH) / 2;
			const vw = Math.max(130, Math.max(...parts.map(p => `${p.value} ${unit}`.length)) * 42 + 10);
			parts.forEach((p, i) => {
				const tone = p.tone ?? TONES[i % TONES.length];
				html += `<div class="sw-row t-${tone}" style="${at(760, top + i * rowH, 940, 110)}"><span class="sw-bar"></span>${t('sw-v nolint', `width:${vw}px`, esc(`${p.value} ${unit}`))}<div>${t('sw-l', '', fmt(p.label ?? ''))}${p.sub ? t('sw-s', '', fmt(p.sub)) : ''}</div></div>`;
			});
			return heading(s) + body(`<div class="stopwatch" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** What goes in and what comes out, as devices: on the left a phone, a laptop or a file (with a picture on its
	 * screen), an agent in the middle, and 1–2 devices on the right with what it made. A caption under each device.
	 * Fields: eyebrow, title, from: { kind: 'phone' | 'laptop' | 'file', src, icon, title, sub },
	 * via: { icon, title } (the middle), to (1–2): [{ kind, src, icon, title, sub }]. */
	'devices': {
		css: `
.devices { position: relative; width: 1728px; }
.devices .dv { position: absolute; display: flex; flex-direction: column; align-items: center; }
.devices .dv-phone { position: relative; border-radius: 44px; background: var(--ink); padding: 14px; box-sizing: border-box; }
.devices .dv-phone::after { content: ''; position: absolute; left: 50%; top: 22px; width: 70px; height: 18px; margin-left: -35px; border-radius: 9px; background: var(--ink); }
.devices .dv-lap { position: relative; border-radius: 18px 18px 6px 6px; background: var(--ink); padding: 14px 14px 18px; box-sizing: border-box; }
.devices .dv-base { height: 20px; border-radius: 4px 4px 14px 14px; background: #c3c8d0; box-shadow: inset 0 -4px 0 #9aa1ab; }
.devices .dv-file { position: relative; border-radius: 16px 46px 16px 16px; background: #fff; box-shadow: inset 0 0 0 4px var(--fg); display: grid; place-items: center; color: var(--fg); }
.devices .dv-scr { position: relative; width: 100%; height: 100%; border-radius: 30px; overflow: hidden; background: #2a2b31; display: grid; place-items: center; color: #fff; }
.devices .dv-lap .dv-scr { border-radius: 6px; }
.devices .dv-scr img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.devices .dv-t { margin-top: 22px; font-size: 27px; font-weight: 700; color: var(--ink); text-align: center; line-height: 1.15; }
.devices .dv-s { margin-top: 4px; font-size: 19px; color: var(--body); text-align: center; }
.devices .dv-via { position: absolute; display: flex; flex-direction: column; align-items: center; text-align: center; }
.devices .dv-vc { width: 150px; height: 150px; border-radius: 50%; background: var(--purple-tint); box-shadow: inset 0 0 0 6px var(--purple); color: var(--purple); display: grid; place-items: center; }
.devices .dv-vt { margin-top: 14px; font-size: 24px; font-weight: 700; color: var(--purple); white-space: nowrap; }
`,
		render(s) {
			const H = bodyHeight(s);
			const to = (s.to ?? []).slice(0, 2);
			const size = d => (d.kind === 'phone' ? [250, 500] : d.kind === 'file' ? [220, 280] : [520, 330]);
			const draw = d => {
				const [w, h] = size(d), tone = d.tone ?? 'blue', pic = img(d.src, d.title);
				const screen = `<div class="dv-scr" data-on="#2a2b31">${pic || ic(d.icon ?? 'image', 64, '#fff')}</div>`;
				if (d.kind === 'phone') {
					return { w, h, html: `<div class="dv-phone" style="width:${w}px;height:${h}px">${screen}</div>` };
				}
				if (d.kind === 'file') {
					return { w, h, html: `<div class="dv-file t-${tone}" style="width:${w}px;height:${h}px">${ic(d.icon ?? 'document', 96)}</div>` };
				}
				return { w, h: h + 20, html: `<div style="width:${w}px"><div class="dv-lap" style="width:${w - 40}px;height:${h}px;margin:0 auto">${screen}</div><div class="dv-base"></div></div>` };
			};
			const caption = d => `${t('dv-t', '', fmt(d.title ?? ''))}${d.sub ? t('dv-s', '', fmt(d.sub)) : ''}`;
			const capH = 90, from = draw(s.from ?? {}), outs = to.map(draw);
			const outsW = outs.reduce((a, o) => a + o.w, 0) + (outs.length - 1) * 48;
			const viaW = 260, gapX = (W - from.w - viaW - outsW) / 2;
			const maxH = Math.max(from.h, ...outs.map(o => o.h));
			const yTop = Math.max(0, (H - maxH - capH) / 2), mid = yTop + maxH / 2;
			let html = `<div class="dv" style="${at(0, yTop + (maxH - from.h) / 2, from.w)}">${from.html}${caption(s.from ?? {})}</div>`;
			const vx = from.w + gapX;
			html += `<div class="dv-via" style="${at(vx, mid - 75, viaW)}"><div class="dv-vc">${ic(s.via?.icon ?? 'bot', 80)}</div>${s.via?.title ? t('dv-vt', '', fmt(s.via.title)) : ''}</div>`;
			let x = vx + viaW + gapX;
			const arrow = (xa, xb) => `<path d="M ${r1(xa)} ${r1(mid)} H ${r1(xb)}" stroke="var(--purple)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round" stroke-dasharray="2 14"/><path d="M ${r1(xb - 18)} ${r1(mid - 16)} L ${r1(xb)} ${r1(mid)} L ${r1(xb - 18)} ${r1(mid + 16)}" fill="none" stroke="var(--purple)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round" stroke-linejoin="round"/>`;
			let svg = arrow(from.w + 24, vx + viaW / 2 - 90) + arrow(vx + viaW / 2 + 90, x - 24);
			outs.forEach((o, i) => {
				html += `<div class="dv" style="${at(x, yTop + (maxH - o.h) / 2, o.w)}">${o.html}${caption(to[i])}</div>`;
				x += o.w + 48;
			});
			return heading(s) + body(`<div class="devices" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** Film: 1–2 strips, each a dark band with sprocket holes, its frames either pictures (src) or drawn cells (an icon
	 * and a word on a tint), a label on the left, and a coloured tag under any frame. A legend for the tags at the end.
	 * Fields: eyebrow, title, rows (1–2): [{ label, sub, frames: [{ src, icon, title, tone, tag }] }],
	 * legend: [{ tone, text }], aspect (frame width / height, default 16/9; drawn cells read better at about 0.8). */
	'film-strip': {
		css: `
.film-strip { position: relative; width: 1728px; }
.film-strip .fs-band { position: absolute; border-radius: 14px; background: var(--ink); }
.film-strip .fs-hole { position: absolute; width: 18px; height: 12px; border-radius: 3px; background: #fff; }
.film-strip .fs-f { position: absolute; overflow: hidden; border-radius: 6px; background: #2a2b31; }
.film-strip .fs-f img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.film-strip .fs-cell { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: var(--tint); color: var(--fg); text-align: center; padding: 0 8px; }
.film-strip .fs-ct { font-size: 19px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.film-strip .fs-l { position: absolute; display: flex; flex-direction: column; justify-content: center; }
.film-strip .fs-lt { font-size: 30px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.film-strip .fs-ls { margin-top: 4px; font-size: 20px; color: var(--body); line-height: 1.3; }
.film-strip .fs-tag { position: absolute; transform: translateX(-50%); padding: 4px 12px; border-radius: 10px; background: var(--tint); color: var(--fg); font-size: 16px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.film-strip .fs-legend { position: absolute; display: flex; gap: 34px; }
.film-strip .fs-li { display: flex; align-items: center; gap: 10px; font-size: 20px; color: var(--body); }
.film-strip .fs-dot { width: 20px; height: 20px; border-radius: 6px; background: var(--fg); }
`,
		render(s) {
			const H = bodyHeight(s);
			const rows = (s.rows ?? []).slice(0, 2), labelled = rows.some(r => r.label);
			const lw = labelled ? 250 : 0, most = Math.max(...rows.map(r => r.frames.length), 1);
			const hasTags = rows.some(r => r.frames.some(f => f.tag)), legendH = s.legend?.length ? 50 : 0;
			const hole = 26, gap = 10, tagH = hasTags ? 46 : 0, rowGap = 34;
			const availH = (H - legendH - rowGap * (rows.length - 1)) / rows.length - tagH;
			const ar = s.aspect ?? 16 / 9;
			const fw = Math.min((W - lw - 24 - gap * (most - 1)) / most, (availH - hole * 2) * ar);
			const fh = fw / ar, bandH = fh + hole * 2;
			const total = rows.length * (bandH + tagH) + rowGap * (rows.length - 1) + legendH;
			let y = Math.max(0, (H - total) / 2), html = '';
			for (const r of rows) {
				const bw = r.frames.length * fw + (r.frames.length - 1) * gap + 24, x0 = lw;
				if (labelled) {
					html += `<div class="fs-l" style="${at(0, y, lw - 30, bandH)}">${t('fs-lt', '', fmt(r.label ?? ''))}${r.sub ? t('fs-ls', '', fmt(r.sub)) : ''}</div>`;
				}
				html += `<div class="fs-band" style="${at(x0, y, bw, bandH)}"></div>`;
				for (let hx = x0 + 14; hx < x0 + bw - 24; hx += 34) {
					html += `<span class="fs-hole" style="${at(hx, y + 7)}"></span><span class="fs-hole" style="${at(hx, y + bandH - 19)}"></span>`;
				}
				r.frames.forEach((f, i) => {
					const fx = x0 + 12 + i * (fw + gap), tone = f.tone ?? 'blue';
					const inner = f.src ? img(f.src, f.title) : `<div class="fs-cell t-${tone}">${ic(f.icon ?? 'image', Math.round(fh * 0.32))}${f.title ? t('fs-ct', '', fmt(f.title)) : ''}</div>`;
					html += `<div class="fs-f" style="${at(fx, y + hole, fw, fh)}">${inner}</div>`;
					if (f.tag) {
						html += `<span class="fs-tag t-${tone} nolint" style="left:${r1(fx + fw / 2)}px;top:${r1(y + bandH + 10)}px" data-t>${fmt(f.tag)}</span>`;
					}
				});
				y += bandH + tagH + rowGap;
			}
			if (legendH) {
				html += `<div class="fs-legend" style="${at(lw, y - rowGap + 6)}">${s.legend.map(l => `<span class="fs-li t-${l.tone ?? 'blue'}"><span class="fs-dot"></span><span data-t>${fmt(l.text)}</span></span>`).join('')}</div>`;
			}
			return heading(s) + body(`<div class="film-strip" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** Many in, few out: a cloud of small tiles pours into a hopper (the big input number beside it), a few come out of
	 * the spout and line up on a tray (the output number beside them), and an arrow leads to what they become.
	 * Fields: eyebrow, title, input: { value, label }, output: { value, label, count (tiles on the tray, ≤ 12) },
	 * result: { icon, title, sub }, chips (tiles in the cloud, default 70). */
	'hopper': {
		css: `
.hopper { position: relative; width: 1728px; }
.hopper .hp-n { position: absolute; }
.hopper .hp-v { font-size: 96px; font-weight: 700; letter-spacing: -.04em; line-height: .95; color: var(--fg); font-variant-numeric: tabular-nums; white-space: nowrap; }
.hopper .hp-l { margin-top: 6px; font-size: 24px; font-weight: 600; color: var(--ink); line-height: 1.2; }
.hopper .hp-r { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-radius: 22px; background: var(--green-tint); box-shadow: inset 0 0 0 4px var(--green); color: var(--green); gap: 10px; padding: 0 18px; box-sizing: border-box; }
.hopper .hp-rt { font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.hopper .hp-rs { font-size: 19px; color: var(--body); }
`,
		render(s) {
			const H = bodyHeight(s);
			const hx = 520, top = 96, tw = 500, bw = 90, hh = 250, sp = 50;
			let svg = '';
			// The cloud of tiles above and inside the hopper.
			const chips = s.chips ?? 70;
			for (let i = 0; i < chips; i++) {
				const fx = (i * 0.6180339) % 1, inside = i % 3 !== 0;
				const y = inside ? top + 30 + (i / chips) * (hh - 90) : 8 + Math.abs(wob(i, 2)) * 90;
				const half = inside ? ((tw - (tw - bw) * ((y - top) / hh)) / 2) - 24 : tw / 2 + 60;
				const x = hx + (fx * 2 - 1) * half, rot = wob(i, 5) * 35;
				svg += `<rect x="${r1(x - 13)}" y="${r1(y - 9)}" width="26" height="18" rx="4" transform="rotate(${r1(rot)} ${r1(x)} ${r1(y)})" fill="${mix(i % 5 === 0 ? 'blue' : 'neutral', i % 5 === 0 ? 30 : 16)}" stroke="${i % 5 === 0 ? 'var(--blue)' : 'var(--faint)'}" stroke-width="2"/>`;
			}
			// The hopper: a funnel with a rim and a spout.
			svg += `<path d="M ${hx - tw / 2} ${top} L ${hx - bw / 2} ${top + hh} V ${top + hh + sp} H ${hx + bw / 2} V ${top + hh} L ${hx + tw / 2} ${top}" fill="none" stroke="var(--ink)" stroke-width="${SW + 2}" stroke-linejoin="round" stroke-linecap="round"/>`;
			svg += `<path d="M ${hx - tw / 2 - 16} ${top} H ${hx - tw / 2 + 40} M ${hx + tw / 2 - 40} ${top} H ${hx + tw / 2 + 16}" stroke="var(--ink)" stroke-width="${SW + 4}" stroke-linecap="round"/>`;
			// The few that came out, falling then lined up on the tray.
			const out = s.output ?? {}, count = Math.min(12, out.count ?? 10);
			const trayY = top + hh + sp + 76, tx0 = hx - 40, cw = 46, tg = 12, trayW = count * (cw + tg) + 40;
			svg += `<path d="M ${hx} ${top + hh + sp + 8} C ${hx} ${trayY - 40}, ${hx + 30} ${trayY - 30}, ${tx0 + 40} ${trayY - 30}" fill="none" stroke="var(--blue)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
			svg += `<path d="M ${tx0} ${trayY + 34} H ${tx0 + trayW}" stroke="var(--ink)" stroke-width="${SW + 2}" stroke-linecap="round"/><path d="M ${tx0} ${trayY + 34} V ${trayY + 14} M ${tx0 + trayW} ${trayY + 34} V ${trayY + 14}" stroke="var(--ink)" stroke-width="${SW + 2}" stroke-linecap="round"/>`;
			for (let i = 0; i < count; i++) {
				const x = tx0 + 20 + i * (cw + tg);
				svg += `<rect x="${x}" y="${trayY - 2}" width="${cw}" height="32" rx="6" fill="${mix('blue', 28)}" stroke="var(--blue)" stroke-width="3"/>`;
			}
			const resX = tx0 + trayW + 120;
			svg += `<path d="M ${tx0 + trayW + 24} ${trayY + 14} H ${resX - 20}" stroke="var(--green)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round"/><path d="M ${resX - 38} ${trayY - 2} L ${resX - 20} ${trayY + 14} L ${resX - 38} ${trayY + 30}" fill="none" stroke="var(--green)" stroke-width="${STYLE.strokeBold}" stroke-linecap="round" stroke-linejoin="round"/>`;
			const inp = s.input ?? {}, res = s.result ?? {};
			let html = `<div class="hp-n t-blue" style="${at(0, top - 10, hx - tw / 2 - 30)}">${t('hp-v nolint', '', esc(inp.value ?? ''))}${inp.label ? t('hp-l', '', fmt(inp.label)) : ''}</div>`;
			html += `<div class="hp-n t-blue" style="${at(tx0 + 20, trayY + 52, 520)}">${t('hp-v nolint', '', esc(out.value ?? ''))}${out.label ? t('hp-l', '', fmt(out.label)) : ''}</div>`;
			const rw = Math.max(300, W - resX);
			html += `<div class="hp-r" style="${at(resX, trayY - 120, rw, 240)}" data-fit>${ic(res.icon ?? 'videoClip', 64)}${t('hp-rt', '', fmt(res.title ?? ''))}${res.sub ? t('hp-rs', '', fmt(res.sub)) : ''}</div>`;
			return heading(s) + body(`<div class="hopper" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** 1–3 mechanical counters: a dark housing with one drum per digit (the next digit peeking above and below, as if
	 * it were rolling), a coloured line under it, and what it counts. For big running totals.
	 * Fields: eyebrow, title, counters (1–3): [{ value (e.g. '954,000'), label, sub, tone }]. */
	'odometer': {
		css: `
.odometer { position: relative; width: 1728px; }
.odometer .od { position: absolute; display: flex; flex-direction: column; align-items: center; }
.odometer .od-box { display: flex; align-items: center; gap: 8px; padding: 22px 24px; border-radius: 20px; background: var(--ink); }
.odometer .od-d { position: relative; width: var(--dw); height: calc(var(--dw) * 1.6); border-radius: 10px; background: #f5f6f8; overflow: hidden; display: grid; place-items: center; }
.odometer .od-d b { font-size: calc(var(--dw) * 1.12); font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; line-height: 1; }
.odometer .od-d i { position: absolute; left: 0; right: 0; text-align: center; font-style: normal; font-size: calc(var(--dw) * 1.12); font-weight: 700; color: #c3c8d0; line-height: 1; }
.odometer .od-d::after { content: ''; position: absolute; inset: 0; border-radius: 10px; box-shadow: inset 0 6px 0 rgba(0,0,0,.08), inset 0 -6px 0 rgba(0,0,0,.08); }
.odometer .od-sep { font-size: calc(var(--dw) * .9); font-weight: 700; color: #f5f6f8; line-height: 1; padding-top: calc(var(--dw) * .45); }
.odometer .od-line { width: 100%; height: 8px; border-radius: 4px; background: var(--fg); margin-top: 18px; }
.odometer .od-l { margin-top: 18px; font-size: 32px; font-weight: 700; color: var(--ink); text-align: center; line-height: 1.15; }
.odometer .od-s { margin-top: 4px; font-size: 21px; color: var(--body); text-align: center; }
`,
		render(s) {
			const H = bodyHeight(s);
			const cs = (s.counters ?? []).slice(0, 3);
			// Drums as big as the room allows: the longest counter fits its share of the width.
			const most = Math.max(...cs.map(c => [...String(c.value)].reduce((a, ch) => a + (/\d/.test(ch) ? 1.11 : 0.45), 0)), 1);
			const dw = Math.max(60, Math.min(124, (W / cs.length - 120) / most));
			const width = c => [...String(c.value)].reduce((a, ch) => a + (/\d/.test(ch) ? dw + 8 : dw * 0.45), 48);
			const ws = cs.map(width), gap = (W - ws.reduce((a, b) => a + b, 0)) / (cs.length + 1);
			let x = gap, html = '';
			cs.forEach((c, i) => {
				const tone = c.tone ?? ['blue', 'purple', 'green'][i % 3];
				const digits = [...String(c.value)].map((ch, k) => (/\d/.test(ch) ? `<span class="od-d"><i style="top:calc(var(--dw) * -.86)">${(Number(ch) + 9) % 10}</i><b>${ch}</b><i style="bottom:calc(var(--dw) * -.86)">${(Number(ch) + 1) % 10}</i></span>` : `<span class="od-sep">${esc(ch)}</span>`)).join('');
				html += `<div class="od t-${tone}" style="${at(x, H / 2 - dw * 1.6 / 2 - 90, ws[i])};--dw:${r1(dw)}px"><div class="od-box nolint" data-t>${digits}</div><div class="od-line"></div>${t('od-l', '', fmt(c.label ?? ''))}${c.sub ? t('od-s', '', fmt(c.sub)) : ''}</div>`;
				x += ws[i] + gap;
			});
			return heading(s) + body(`<div class="odometer" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** Problems pinned like specimens: 2–5 cards on a light board, each with a drawn bug in its tone, a red pin, what it
	 * was and (optionally) a before -> after number. Cards tilt a little, as if pinned by hand.
	 * Fields: eyebrow, title, items (2–5): [{ title, sub, from, to, tone (default 'red') }], label (on the board). */
	'pinboard': {
		css: `
.pinboard { position: relative; width: 1728px; }
.pinboard .pb-board { position: absolute; border-radius: 26px; background: var(--yellow-tint); box-shadow: inset 0 0 0 4px #ecdcae; }
.pinboard .pb-label { position: absolute; font-size: 18px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #8a6400; }
.pinboard .pb-c { position: absolute; border-radius: 18px; background: #fff; box-shadow: 0 0 0 3px var(--line-strong); padding: 26px 22px 22px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; text-align: center; }
.pinboard .pb-t { margin-top: 12px; font-size: 26px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.pinboard .pb-s { margin-top: 6px; font-size: 19px; color: var(--body); line-height: 1.3; }
.pinboard .pb-ft { margin-top: 14px; display: flex; align-items: center; gap: 10px; font-size: 32px; font-weight: 700; font-variant-numeric: tabular-nums; }
.pinboard .pb-ft .a { color: var(--red); } .pinboard .pb-ft .b { color: var(--green); } .pinboard .pb-ft .ar { color: var(--faint); font-size: 26px; }
`,
		render(s) {
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 5), n = items.length;
			const pad = 44, gap = 30, cw = Math.min(330, (W - pad * 2 - gap * (n - 1)) / n), ch = Math.min(380, H - 160);
			const BH = Math.min(H, ch + 190), B0 = (H - BH) / 2;
			const span = n * cw + (n - 1) * gap, x0 = (W - span) / 2, y0 = B0 + (BH - ch) / 2 + 16;
			const beetle = (tone, cx, cy) => {
				let g = '';
				for (const k of [-1, 1]) {
					for (const dy of [-8, 6, 18]) {
						g += `<path d="M ${cx + k * 14} ${cy + dy} l ${k * 20} ${dy < 0 ? -10 : dy > 10 ? 12 : 2} l ${k * 6} ${dy < 0 ? -8 : 10}" fill="none" stroke="var(--${tone})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
					}
					g += `<path d="M ${cx + k * 5} ${cy - 30} q ${k * 8} -14 ${k * 18} -16" fill="none" stroke="var(--${tone})" stroke-width="3" stroke-linecap="round"/>`;
				}
				g += `<ellipse cx="${cx}" cy="${cy + 6}" rx="20" ry="26" fill="${mix(tone, 22)}" stroke="var(--${tone})" stroke-width="${SW}"/><circle cx="${cx}" cy="${cy - 24}" r="10" fill="var(--${tone})"/><path d="M ${cx} ${cy - 14} V ${cy + 30}" stroke="var(--${tone})" stroke-width="3"/>`;
				return g;
			};
			let html = `<div class="pb-board" style="${at(0, B0, W, BH)}"></div>`;
			if (s.label) {
				html += t('pb-label nolint', at(36, B0 + 26), fmt(s.label));
			}
			items.forEach((it, i) => {
				const tone = it.tone ?? 'red', x = x0 + i * (cw + gap), y = y0 + wob(i, 3) * 10, rot = r1(wob(i, 7) * 1.6);
				const svg = `<svg width="${r1(cw)}" height="150" viewBox="0 0 ${r1(cw)} 150" style="position:absolute;left:0;top:30px"><g transform="translate(${r1(cw / 2)} 78) scale(1.5) translate(${r1(-cw / 2)} -52)">${beetle(tone, cw / 2, 52)}</g></svg>`;
				const pin = `<svg width="40" height="40" viewBox="0 0 40 40" style="position:absolute;left:${r1(cw / 2 - 20)}px;top:-18px"><circle cx="20" cy="20" r="14" fill="var(--red)"/><circle cx="15" cy="15" r="4" fill="#fff" opacity=".7"/></svg>`;
				const ft = it.from != null ? `<div class="pb-ft nolint" data-t><span class="a">${esc(it.from)}</span><span class="ar">\u2192</span><span class="b">${esc(it.to ?? '')}</span></div>` : '';
				html += `<div class="pb-c" style="${at(x, y, cw, ch)};transform:rotate(${rot}deg)" data-fit>${pin}${svg}<div style="height:156px;flex:none"></div>${t('pb-t', '', fmt(it.title ?? ''))}${it.sub ? t('pb-s', '', fmt(it.sub)) : ''}${ft}</div>`;
			});
			return heading(s) + body(`<div class="pinboard" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** Moving house: an old house on the left with a sign (a deadline), a new house on the right, and boxes travelling
	 * between them along a road, each with its name; the ones that arrived carry a green tick.
	 * Fields: eyebrow, title, from: { title, sub }, to: { title, sub }, sign: { text, tone (default 'red') },
	 * boxes (2–6): [{ title, sub, done }]. */
	'moving': {
		css: `
.moving { position: relative; width: 1728px; }
.moving .mv-h { position: absolute; display: flex; flex-direction: column; align-items: center; text-align: center; }
.moving .mv-ht { font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.moving .mv-hs { margin-top: 4px; font-size: 19px; color: var(--body); }
.moving .mv-sign { position: absolute; padding: 10px 18px; border-radius: 10px; background: #fff; box-shadow: inset 0 0 0 4px var(--fg); color: var(--fg); font-size: 22px; font-weight: 700; white-space: nowrap; }
.moving .mv-b { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-radius: 12px; background: #f6e7c8; box-shadow: inset 0 0 0 4px #b8894f; padding: 0 10px; box-sizing: border-box; }
.moving .mv-b::before { content: ''; position: absolute; left: 50%; top: 4px; bottom: 4px; width: 22px; margin-left: -11px; background: #e9d2a3; }
.moving .mv-bt { position: relative; font-size: 21px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.moving .mv-bs { position: relative; margin-top: 2px; font-size: 17px; color: #6b4e24; }
.moving .mv-ok { position: absolute; width: 40px; height: 40px; border-radius: 50%; background: var(--green); color: #fff; display: grid; place-items: center; box-shadow: 0 0 0 4px #fff; }
`,
		render(s) {
			const H = bodyHeight(s);
			const ground = H - 190, hw = 300, hh = 250;
			const house = (x, tone, fill) => `<path d="M ${x} ${ground} V ${ground - hh + 90} L ${x + hw / 2} ${ground - hh - 20} L ${x + hw} ${ground - hh + 90} V ${ground} Z" fill="${fill}" stroke="var(--${tone})" stroke-width="${SW + 2}" stroke-linejoin="round"/><rect x="${x + hw / 2 - 40}" y="${ground - 120}" width="80" height="120" rx="8" fill="#fff" stroke="var(--${tone})" stroke-width="${SW}"/><rect x="${x + 36}" y="${ground - hh + 120}" width="60" height="54" rx="6" fill="#fff" stroke="var(--${tone})" stroke-width="${SW}"/><rect x="${x + hw - 96}" y="${ground - hh + 120}" width="60" height="54" rx="6" fill="#fff" stroke="var(--${tone})" stroke-width="${SW}"/>`;
			let svg = `<path d="M 0 ${ground} H ${W}" stroke="var(--ink)" stroke-width="${SW}" stroke-linecap="round"/>`;
			svg += house(0, 'neutral', 'var(--surface)') + house(W - hw, 'blue', 'var(--blue-tint)');
			svg += `<path d="M ${hw + 30} ${ground + 30} H ${W - hw - 30}" stroke="var(--connector)" stroke-width="${SW}" stroke-dasharray="2 16" stroke-linecap="round"/><path d="M ${W - hw - 52} ${ground + 16} L ${W - hw - 30} ${ground + 30} L ${W - hw - 52} ${ground + 44}" fill="none" stroke="var(--connector)" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
			// The sign on its post, by the old house.
			const sg = s.sign ?? {}, sx = hw - 40;
			if (sg.text) {
				svg += `<path d="M ${sx + 30} ${ground - hh + 60} V ${ground - hh - 40}" stroke="var(--ink)" stroke-width="${SW + 2}" stroke-linecap="round"/>`;
			}
			const boxes = (s.boxes ?? []).slice(0, 6), n = boxes.length;
			const lane0 = hw + 50, lane1 = W - hw - 50, bw = Math.min(220, (lane1 - lane0 - 20 * (n - 1)) / Math.max(n, 1)), bh = 124;
			let html = `<div class="mv-h" style="${at(0, ground + 24, hw)}">${t('mv-ht', '', fmt(s.from?.title ?? ''))}${s.from?.sub ? t('mv-hs', '', fmt(s.from.sub)) : ''}</div>`;
			html += `<div class="mv-h" style="${at(W - hw, ground + 24, hw)}">${t('mv-ht', '', fmt(s.to?.title ?? ''))}${s.to?.sub ? t('mv-hs', '', fmt(s.to.sub)) : ''}</div>`;
			if (sg.text) {
				html += `<div class="mv-sign t-${sg.tone ?? 'red'}" style="${at(sx - 40, ground - hh - 96)}" data-t>${fmt(sg.text)}</div>`;
			}
			boxes.forEach((b, i) => {
				const x = lane0 + i * (bw + 20), y = ground - bh - 6 - (i % 2 ? 0 : 36);
				html += `<div class="mv-b" data-on="#f6e7c8" style="${at(x, y, bw, bh)}" data-fit>${t('mv-bt', '', fmt(b.title ?? ''))}${b.sub ? t('mv-bs', '', fmt(b.sub)) : ''}</div>${b.done ? `<span class="mv-ok" style="${at(x + bw - 26, y - 14)}">${ic('checkmark', 24)}</span>` : ''}`;
			});
			return heading(s) + body(`<div class="moving" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** 1–3 balance scales: each weighs two values (old and new, before and after); the beam tilts by their difference
	 * against `max`, the values hang big under the pans, and a note says whether they match.
	 * Fields: eyebrow, title, max (the difference that tilts the beam fully, default 20), items (1–3): [{ title,
	 * left: { label, value }, right: { label, value }, note, tone (note colour, default 'green') }]. */
	'scales': {
		css: `
.scales { position: relative; width: 1728px; }
.scales .sc-t { position: absolute; text-align: center; font-size: 30px; font-weight: 700; color: var(--ink); line-height: 1.15; }
.scales .sc-v { position: absolute; transform: translateX(-50%); text-align: center; white-space: nowrap; }
.scales .sc-vv { font-size: 48px; font-weight: 700; letter-spacing: -.03em; color: var(--ink); line-height: 1; font-variant-numeric: tabular-nums; }
.scales .sc-vl { margin-top: 4px; font-size: 17px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
.scales .sc-n { position: absolute; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 22px; font-weight: 600; text-align: center; }
.scales .sc-n svg { flex: none; }
`,
		render(s) {
			const H = bodyHeight(s);
			const items = (s.items ?? []).slice(0, 3), n = items.length, max = s.max ?? 20;
			const cw = W / n, postH = 290, top = Math.max(0, (H - 560) / 2), base = top + 120 + postH;
			let svg = '', html = '';
			items.forEach((it, i) => {
				const cx = cw * i + cw / 2, py = base - postH, arm = Math.min(190, cw / 2 - 135);
				const a = Number(it.left?.value) || 0, b = Number(it.right?.value) || 0;
				const tilt = Math.max(-1, Math.min(1, (a - b) / max)) * 10;
				const rad = (tilt * Math.PI) / 180, lx = cx - arm * Math.cos(rad), ly = py - arm * Math.sin(-rad), rx = cx + arm * Math.cos(rad), ry = py + arm * Math.sin(-rad);
				// Base, post, beam, strings and pans.
				svg += `<path d="M ${cx - 90} ${base} H ${cx + 90} L ${cx + 50} ${base - 30} H ${cx - 50} Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				svg += `<path d="M ${cx} ${base - 30} V ${py}" stroke="var(--ink)" stroke-width="${SW + 4}" stroke-linecap="round"/>`;
				svg += `<path d="M ${r1(lx)} ${r1(ly)} L ${r1(rx)} ${r1(ry)}" stroke="var(--ink)" stroke-width="${SW + 4}" stroke-linecap="round"/><circle cx="${cx}" cy="${py}" r="12" fill="#fff" stroke="var(--ink)" stroke-width="${SW}"/>`;
				for (const [x, y] of [[lx, ly], [rx, ry]]) {
					const pan = y + 120;
					svg += `<path d="M ${r1(x)} ${r1(y)} L ${r1(x - 58)} ${r1(pan)} M ${r1(x)} ${r1(y)} L ${r1(x + 58)} ${r1(pan)}" stroke="var(--faint)" stroke-width="3"/><path d="M ${r1(x - 76)} ${r1(pan)} Q ${r1(x)} ${r1(pan + 42)} ${r1(x + 76)} ${r1(pan)} Z" fill="var(--blue-tint)" stroke="var(--blue)" stroke-width="${SW}" stroke-linejoin="round"/>`;
				}
				const val = (side, x, y) => `<div class="sc-v" style="left:${r1(x)}px;top:${r1(y + 158)}px">${t('sc-vv nolint', '', esc(side?.value ?? ''))}${t('sc-vl nolint', '', fmt(side?.label ?? ''))}</div>`;
				html += `<div class="sc-t" style="${at(cw * i + 20, top, cw - 40)}" data-t>${fmt(it.title ?? '')}</div>`;
				html += val(it.left, lx, ly) + val(it.right, rx, ry);
				if (it.note) {
					html += `<div class="sc-n" style="${at(cw * i + 20, base + 30, cw - 40)};color:var(--${it.tone ?? 'green'})">${ic(it.tone === 'red' ? 'warning' : 'checkCircle', 28)}<span data-t>${fmt(it.note)}</span></div>`;
				}
			});
			return heading(s) + body(`<div class="scales" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},
	/** A cover with a real picture: the title on the left (eyebrow, title, sub, speaker, pills), a still on the right
	 * framed as a strip of film (frame: 'film', with the stills either side peeking in), a screen ('screen') or a card
	 * ('card'), with a small caption under it. Fields: eyebrow, title, sub, speaker: { initials, name, role }, pills,
	 * src (the picture), side: [src, src] (film only: the stills before and after), caption, frame (default 'film'). */
	'picture-cover': {
		bare: true,
		css: `
.picture-cover { position: absolute; inset: 0; }
.picture-cover .pc2-left { position: absolute; left: 96px; top: 150px; width: 760px; height: 780px; display: flex; flex-direction: column; justify-content: center; }
.picture-cover .pc2-title { margin-top: 24px; font-size: 80px; font-weight: 600; line-height: 1.05; letter-spacing: -.022em; color: var(--ink); }
.picture-cover .pc2-sub { margin-top: 26px; font-size: 28px; line-height: 1.4; color: var(--body); }
.picture-cover .pc2-who { margin-top: 40px; display: flex; align-items: center; gap: 16px; white-space: nowrap; }
.picture-cover .pc2-av { width: 54px; height: 54px; border-radius: 50%; background: var(--blue-tint); color: var(--blue); display: grid; place-items: center; font-size: 20px; font-weight: 700; }
.picture-cover .pc2-name { font-size: 26px; font-weight: 600; color: var(--ink); }
.picture-cover .pc2-role { font-size: 23px; color: var(--body); }
.picture-cover .pc2-pills { margin-top: 26px; display: flex; gap: 12px; }
.picture-cover .pc2-band { position: absolute; background: var(--ink); border-radius: 18px; }
.picture-cover .pc2-hole { position: absolute; width: 26px; height: 16px; border-radius: 4px; background: #fff; }
.picture-cover .pc2-pic { position: absolute; overflow: hidden; border-radius: 8px; background: #2a2b31; }
.picture-cover .pc2-pic img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.picture-cover .pc2-pic.dim { opacity: .45; }
.picture-cover .pc2-card { position: absolute; border-radius: 22px; overflow: hidden; box-shadow: 0 0 0 4px var(--line-strong); }
.picture-cover .pc2-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
.picture-cover .pc2-cap { position: absolute; font-size: 20px; color: var(--muted); }
`,
		render(s) {
			const sp = s.speaker;
			const who = sp ? `<div class="pc2-who"><span class="pc2-av" data-t>${esc(sp.initials ?? '')}</span><span class="pc2-name" data-t>${fmt(sp.name ?? '')}</span><span class="pc2-role" data-t>${fmt(sp.role ?? '')}</span></div>` : '';
			const left = `<div class="pc2-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="pc2-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="pc2-sub" data-t>${fmt(s.sub)}</div>` : ''}${who}${s.pills ? `<div class="pc2-pills">${s.pills.map(pill).join('')}</div>` : ''}</div>`;
			const frame = s.frame ?? 'film';
			let art = '';
			if (frame === 'film') {
				// A vertical strip of film running off the top and bottom of the page: the still in the middle, its
				// neighbours dimmed above and below.
				const x = 960, w = 860, fw = w - 120, fh = Math.round(fw * 9 / 16), cy = 560;
				art += `<div class="pc2-band" style="${at(x, -40, w, 1160)}"></div>`;
				for (let y = -20; y < 1100; y += 44) {
					art += `<span class="pc2-hole" style="${at(x + 18, y)}"></span><span class="pc2-hole" style="${at(x + w - 44, y)}"></span>`;
				}
				const side = s.side ?? [];
				const frameAt = (src, top, dim) => `<div class="pc2-pic${dim ? ' dim' : ''}" style="${at(x + 60, top, fw, fh)}">${img(src)}</div>`;
				art += frameAt(side[0], cy - fh / 2 - fh - 28, true) + frameAt(s.src, cy - fh / 2, false) + frameAt(side[1], cy + fh / 2 + 28, true);
			} else {
				const x = 940, w = 880, h = Math.round(w * 9 / 16), y = 540 - h / 2;
				art += `<div class="pc2-card" style="${at(x, y, w, h)}">${img(s.src)}</div>`;
			}
			const cap = s.caption ? `<div class="pc2-cap" style="${at(96, 980)}" data-t>${fmt(s.caption)}</div>` : '';
			return `<div class="picture-cover">${art}${left}${cap}</div>${msLogo()}`;
		},
	},
};
