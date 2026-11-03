// Design plugins for the frame of a talk: a cover, the section dividers, an opening picture and a wall of work.
//   cover-signpost:   on a blue page, a yellow hiking signpost: one arrow plate per part of the agenda with its time, a
//                     white plate on top with the total; the title, quote and speaker beside it
//   divider-signpost: a section as a hiking signpost: a big yellow arrow plate with the section's number, title and
//                     minutes, its stops below, and the trail of all sections along the ground, one waymark each
//   bridge:           the theme over a gorge: a bridge built in seconds, the builder waiting on the far side, you at the
//                     near end by a round weight-limit sign that only shows a question mark
//   gallery-wall:     a gallery wall hung salon style: five framed works on nails and picture wire, each with a brass plate
// A deck draws every section divider with the signpost by setting `divider: 'divider-signpost'` in its default export.
import { esc, fmt, ic, pill, heading, body, bodyHeight, W, r1, asset } from '../src/kit.mjs';
import { msLogo } from '../src/layouts.mjs';

const INK = '#1b1b1f';
/** The yellow of hiking signs (dark text on it passes WCAG AA). */
const SIGN = '#f2c94c';

export const designs = {
	/** A cover on a blue page (set bg: 'blue'): a hiking signpost with one yellow arrow plate per part of the agenda and
	 * its time, and a white plate on top with the total. Left: eyebrow, title, quote, speaker and pills; the Microsoft
	 * logo at the bottom. Fields (the same as the built-in title): eyebrow, title, quote, speaker: { initials, name, role },
	 * pills, card: { label (default 'Today'), big, sub, rows: [{ title, value, note }] }, or rows: 'blocks' to list the
	 * blocks of the deck with their minutes (computed by the build), labels: { 'Block name': 'shorter label' }. */
	'cover-signpost': {
		bare: true,
		css: `
.cover-signpost { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.cover-signpost .cs-left { position: absolute; left: 96px; top: 110px; width: 1010px; height: 830px; display: flex; flex-direction: column; justify-content: center; }
.cover-signpost .cs-left .st-eyebrow { color: #fff; }
.cover-signpost .cs-title { margin-top: 24px; font-size: 100px; font-weight: 600; line-height: 1.04; letter-spacing: -.022em; color: #fff; }
.cover-signpost .cs-quote { margin-top: 36px; max-width: 900px; font-size: 29px; line-height: 1.42; color: #fff; text-wrap: balance; }
.cover-signpost .cs-who { margin-top: 50px; display: flex; align-items: center; gap: 18px; white-space: nowrap; }
.cover-signpost .cs-av { width: 58px; height: 58px; border-radius: 50%; background: #fff; color: var(--blue); display: grid; place-items: center; font-size: 22px; font-weight: 700; flex: none; }
.cover-signpost .cs-name { font-size: 28px; font-weight: 600; color: #fff; }
.cover-signpost .cs-role { font-size: 25px; color: #fff; }
.cover-signpost .cs-pills { margin-top: 30px; display: flex; align-items: center; gap: 14px; }
.cover-signpost .ms-logo { top: 968px; }
.cover-signpost .ms-logo .mark { padding: 0; margin: 0; background: none; }
.cover-signpost .ms-logo .name { color: #fff; }
.cover-signpost .cs-loc { position: absolute; display: flex; flex-direction: column; justify-content: center; padding: 0 40px; }
.cover-signpost .cs-loc .lbl { color: var(--blue); font-size: 18px; }
.cover-signpost .cs-total { margin-top: 10px; display: flex; align-items: baseline; gap: 20px; white-space: nowrap; }
.cover-signpost .cs-big { font-size: 62px; font-weight: 700; letter-spacing: -.02em; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; }
.cover-signpost .cs-sub { font-size: 24px; color: var(--body); }
.cover-signpost .cs-plate { position: absolute; display: flex; align-items: center; gap: 20px; padding-left: 40px; }
.cover-signpost .cs-dest { flex: 1; min-width: 0; font-size: 28px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.cover-signpost .cs-time { font-size: 25px; font-weight: 600; color: var(--ink); white-space: nowrap; font-variant-numeric: tabular-nums; }
`,
		render(s, ctx = {}) {
			const c = s.card ?? {};
			// The rows, the total and the count, computed like the built-in title card.
			const auto = c.rows === 'blocks';
			const list = auto ? (ctx.blocks ?? []).map(b => ({ title: c.labels?.[b.block] ?? b.block, value: b.minutes, note: `${Math.round(b.minutes)} min` })) : (c.rows ?? []);
			const big = auto ? `~${Math.round(ctx.coreTotal ?? 0)} min` : (c.big ?? '');
			const sub = auto ? `${list.length} blocks${ctx.hasBreak ? '  \u00b7  1 break' : ''}` : (c.sub ?? '');
			const poleX = 1190, poleW = 30, poleTop = 122;
			const x0 = poleX - 34, x1 = 1824, tip = 48;
			const loc = { y: 146, h: 178 };
			const top = loc.y + loc.h + 30, bottom = 938, gap = 14;
			const n = Math.max(list.length, 1);
			const h = Math.min(78, (bottom - top - gap * (n - 1)) / n);
			let svg = `<rect x="${poleX - poleW / 2}" y="${poleTop}" width="${poleW}" height="${1080 - poleTop}" rx="${poleW / 2}" fill="${INK}"/>`;
			svg += `<rect x="${x0}" y="${loc.y}" width="${x1 - x0}" height="${loc.h}" rx="14" fill="#fff"/>`;
			// Two clamps hold each plate to the pole.
			const clamp = y => `<rect x="${poleX - poleW / 2 - 5}" y="${r1(y)}" width="${poleW + 10}" height="10" rx="4" fill="${INK}"/>`;
			const plates = list.map((r, i) => {
				const y = top + i * (h + gap);
				svg += `<path d="M ${x0 + 4} ${r1(y + 4)} H ${x1 - tip} L ${x1 - 4} ${r1(y + h / 2)} L ${x1 - tip} ${r1(y + h - 4)} H ${x0 + 4} Z" fill="${SIGN}" stroke="${SIGN}" stroke-width="8" stroke-linejoin="round"/>`;
				return `<div class="cs-plate" data-on="#f2c94c" style="left:${x0}px;top:${r1(y)}px;width:${x1 - x0 - tip - 14}px;height:${r1(h)}px" data-fit><span class="cs-dest" data-t>${fmt(r.title)}</span><span class="cs-time" data-t>${esc(r.note ?? r.value ?? '')}</span></div>`;
			}).join('');
			svg += clamp(loc.y - 14) + list.map((r, i) => clamp(top + i * (h + gap) + h + 2)).join('');
			const sp = s.speaker ?? {};
			const left = `<div class="cs-left"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="cs-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="cs-quote" data-t>${fmt(s.sub)}</div>` : ''}${s.quote ? `<div class="cs-quote" data-t>\u201c${fmt(s.quote)}\u201d</div>` : ''}${s.speaker ? `<div class="cs-who"><span class="cs-av" data-t>${esc(sp.initials ?? '')}</span><span class="cs-name" data-t>${fmt(sp.name ?? '')}</span><span class="cs-role" data-t>${fmt(sp.role ?? '')}</span></div>` : ''}${s.pills ? `<div class="cs-pills">${s.pills.map(p => pill(p)).join('')}</div>` : ''}</div>`;
			const loc0 = `<div class="cs-loc" data-on="#ffffff" style="left:${x0}px;top:${loc.y}px;width:${x1 - x0}px;height:${loc.h}px" data-fit><div class="lbl" data-t>${fmt(c.label ?? 'Today')}</div><div class="cs-total"><span class="cs-big" data-t>${fmt(big)}</span><span class="cs-sub" data-t>${fmt(sub)}</span></div></div>`;
			return `<div class="cover-signpost"><svg class="rd-svg" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>${left}${loc0}${plates}${msLogo()}</div>`;
		},
	},

	/** A section divider as a hiking signpost: a white plate with the place (the eyebrow without its minutes), a big yellow
	 * arrow plate with the section's number (in its tone), title and minutes, the stops (chips) below with the subtitle,
	 * and the trail of all sections along the ground, one waymark each: walked (yellow), here (the tone), ahead (white).
	 * Same fields as the built-in section, and the number, "Part N" and the minutes are computed the same way: number,
	 * eyebrow ('Part N  ·  Name  ·  M minutes'), title (up to ~42 characters), sub (up to ~100), chips (3: { icon, text }),
	 * tone. Use it for every divider of a deck with `divider: 'divider-signpost'`. */
	'divider-signpost': {
		css: `
.divider-signpost { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.divider-signpost .ds-place { position: absolute; display: flex; align-items: center; height: 66px; padding: 0 30px; border-radius: 10px; background: #fff; box-shadow: inset 0 0 0 4px var(--ink); white-space: nowrap; }
.divider-signpost .ds-place .st-eyebrow { color: var(--ink); font-size: 20px; }
.divider-signpost .ds-num { position: absolute; border-radius: 22px; background: var(--fg); color: #fff; display: grid; place-items: center; font-size: 104px; letter-spacing: -.03em; line-height: 1; }
.divider-signpost .ds-title { position: absolute; display: flex; align-items: center; }
.divider-signpost .ds-title > div { font-size: 74px; font-weight: 600; line-height: 1.06; letter-spacing: -.02em; color: var(--ink); }
.divider-signpost .ds-min { position: absolute; display: flex; align-items: center; justify-content: flex-end; font-size: 34px; font-weight: 700; color: var(--ink); white-space: nowrap; font-variant-numeric: tabular-nums; }
.divider-signpost .ds-below { position: absolute; display: flex; flex-direction: column; gap: 40px; }
.divider-signpost .ds-sub { font-size: 31px; line-height: 1.38; color: var(--body); text-wrap: balance; }
.divider-signpost .ds-stops { display: flex; flex-direction: column; gap: 14px; }
.divider-signpost .ds-stop { display: flex; align-items: center; gap: 18px; }
.divider-signpost .ds-stop .lbl { font-size: 21px; letter-spacing: .1em; color: var(--ink); }
.divider-signpost .ds-mark { width: 44px; height: 44px; display: grid; place-items: center; flex: none; position: relative; color: var(--ink); }
.divider-signpost .ds-mark::before { content: ''; position: absolute; inset: 6px; transform: rotate(45deg); border-radius: 4px; background: #f2c94c; box-shadow: inset 0 0 0 2.5px var(--ink); }
.divider-signpost .ds-mark .ic { position: relative; }
.divider-signpost .ds-wm { position: absolute; display: grid; place-items: center; font-size: 13px; font-weight: 700; color: var(--ink); line-height: 1; }
.divider-signpost .ds-wm.here { font-size: 26px; color: #fff; }
.divider-signpost .ds-here { position: absolute; transform: translateX(-50%); color: var(--fg); font-size: 18px; }
`,
		render(s, ctx = {}) {
			const tone = s.tone ?? 'blue';
			// The number is the section's position among the sections of the deck; "Part N" and the minutes are rewritten
			// from ctx, like the built-in section divider.
			const cur = ctx.parts?.findIndex(p => p.id === ctx.sectionId) ?? -1;
			const label = i => String(i + 1).padStart(2, '0');
			const number = cur >= 0 ? label(cur) : (s.number ?? '');
			let eyebrow = cur >= 0 ? String(s.eyebrow ?? '').replace(/^Part \d+/, `Part ${cur + 1}`) : String(s.eyebrow ?? '');
			if (ctx.minutes) {
				eyebrow = eyebrow.replace(/\d+\s+minutes?$/, `${ctx.minutes} minutes`);
			}
			// The minutes go on the arrow plate, like the time on a hiking sign; the rest of the eyebrow on the white plate.
			const m = /^(.*?)\s*\u00b7\s*(\d+)\s+minutes?$/.exec(eyebrow);
			const place = m ? m[1] : eyebrow;
			const minutes = m ? `${m[2]} min` : '';
			// A divider with a sources line (or a QR badge) raises the trail, so the section's name under it stays clear.
			const poleX = 250, poleW = 28, ground = s.sources?.length || s.link ? 918 : 958;
			const px0 = 228, px1 = 1806, tip = 94, py = 254, ph = 258;
			const num = { x: 272, y: py + 37, w: 184 };
			let svg = `<rect x="${poleX - poleW / 2}" y="138" width="${poleW}" height="${ground - 138}" rx="${poleW / 2}" fill="${INK}"/>`;
			svg += `<path d="M ${px0 + 5} ${py + 5} H ${px1 - tip} L ${px1 - 5} ${py + ph / 2} L ${px1 - tip} ${py + ph - 5} H ${px0 + 5} Z" fill="${SIGN}" stroke="${SIGN}" stroke-width="10" stroke-linejoin="round"/>`;
			svg += `<rect x="${poleX - poleW / 2 - 6}" y="${py + ph + 6}" width="${poleW + 12}" height="12" rx="5" fill="${INK}"/><rect x="${poleX - poleW / 2 - 6}" y="${py - 18}" width="${poleW + 12}" height="12" rx="5" fill="${INK}"/>`;
			// The trail of all sections along the ground: walked (solid), ahead (dotted); a waymark per section.
			const parts = ctx.parts ?? [];
			const n = parts.length;
			const tx0 = 340, tx1 = 1780;
			// Even steps, and a longer one on each side of the current waymark, which is bigger than the others.
			const steps = Array.from({ length: Math.max(n - 1, 0) }, (_, i) => (i === cur - 1 || i === cur ? 1.75 : 1));
			const unit = (tx1 - tx0) / (steps.reduce((a, b) => a + b, 0) || 1);
			const xs = [tx0];
			steps.forEach(st => xs.push(xs[xs.length - 1] + st * unit));
			const hereX = cur >= 0 ? xs[cur] : tx0;
			svg += `<path d="M 96 ${ground} H ${r1(hereX)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
			svg += `<path d="M ${r1(hereX)} ${ground} H 1824" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/>`;
			const wms = parts.map((p, i) => {
				const x = r1(xs[i]);
				if (i === cur) {
					const d = 46;
					svg += `<rect x="${x - d}" y="${ground - d}" width="${d * 2}" height="${d * 2}" rx="10" transform="rotate(45 ${x} ${ground})" fill="var(--${tone})" stroke="#fff" stroke-width="8"/>`;
					return `<div class="ds-wm here st-badge" style="left:${x - 34}px;top:${ground - 34}px;width:68px;height:68px" data-t>${label(i)}</div>`;
				}
				const d = 15;
				svg += `<rect x="${x - d}" y="${ground - d}" width="${d * 2}" height="${d * 2}" rx="4" transform="rotate(45 ${x} ${ground})" fill="${i < cur ? SIGN : '#fff'}" stroke="${INK}" stroke-width="3"/>`;
				return `<div class="ds-wm st-badge" style="left:${x - 16}px;top:${ground - 16}px;width:32px;height:32px" data-t>${label(i)}</div>`;
			}).join('');
			const hereName = cur >= 0 ? parts[cur].short ?? parts[cur].title : '';
			const hereLeft = Math.max(150, Math.min(1770, hereX));
			const here = hereName ? `<div class="ds-here lbl t-${tone}" style="left:${r1(hereLeft)}px;top:${ground + 62}px" data-t>${fmt(hereName)}</div>` : '';
			const chips = (s.chips ?? []).slice(0, 3).map(c => (typeof c === 'string' ? { text: c } : c));
			const stops = chips.length ? `<div class="ds-stops">${chips.map(c => `<div class="ds-stop"><span class="ds-mark">${c.icon ? ic(c.icon, 20) : ''}</span><span class="lbl" data-t>${fmt(c.text)}</span></div>`).join('')}</div>` : '';
			const tx = num.x + num.w + 38;
			return `<div class="divider-signpost t-${tone}"><svg class="rd-svg" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>
${place ? `<div class="ds-place" style="left:${px0}px;top:150px" data-fit><span class="st-eyebrow" data-t>${fmt(place)}</span></div>` : ''}
<div class="ds-num st-badge" style="left:${num.x}px;top:${num.y}px;width:${num.w}px;height:${num.w}px" data-t>${esc(number)}</div>
<div class="ds-title" style="left:${tx}px;top:${py + 20}px;width:${px1 - tip - 190 - tx}px;height:${ph - 40}px" data-fit><div data-t>${fmt(s.title ?? '')}</div></div>
<div class="ds-min" style="left:${px1 - tip - 176}px;top:${py}px;width:160px;height:${ph}px" data-t>${esc(minutes)}</div>
<div class="ds-below" style="left:${tx}px;top:${py + ph + 36}px;width:${1760 - tx}px">${s.sub ? `<div class="ds-sub" data-t>${fmt(s.sub)}</div>` : ''}${stops}</div>
${wms}${here}
</div>`;
		},
	},

	/** An opening picture over a gorge: something was built across it in seconds (a suspension bridge, in purple) and its
	 * builder waits on the far side; you stand at the near end by a round weight-limit sign that shows no number, only a
	 * question mark. The sentence sits above the gorge. White page. Fields: eyebrow, text (the sentence; mark words with
	 * {{blue|...}} and {{orange|...}}), built (the label on the far side, blue), ask (your label, orange),
	 * builtIcon (default 'timer'), askIcon (default 'question'), builder (icon on the far side, default 'bot'),
	 * you (icon on the near side, default 'person'), sign (default '?'), unit (default 't'). */
	bridge: {
		css: `
.bridge { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.bridge .br-text { position: absolute; left: 160px; top: 128px; width: 1600px; }
.bridge .br-say { margin-top: 22px; font-size: 62px; font-weight: 600; line-height: 1.2; letter-spacing: -.015em; color: var(--ink); }
.bridge .br-tag { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 34px; font-weight: 700; white-space: nowrap; color: var(--fg); }
.bridge .br-disc { position: absolute; display: grid; place-items: center; border-radius: 50%; }
.bridge .br-q { position: absolute; display: flex; align-items: baseline; justify-content: center; gap: 2px; font-weight: 700; line-height: 1; color: var(--ink); }
.bridge .br-q b { font-size: 62px; font-weight: 700; }
.bridge .br-q i { font-style: normal; font-size: 34px; }
`,
		render(s) {
			const g = 742; // the top of both cliffs
			const L = 520, R = 1400; // the edges of the gorge
			const wallL = `M ${L} ${g} C ${L + 40} ${g + 90} ${L + 30} ${g + 220} ${L + 90} 1080`;
			const wallR = `M ${R} ${g} C ${R - 40} ${g + 90} ${R - 30} ${g + 220} ${R - 90} 1080`;
			let svg = `<defs><clipPath id="br-cliff-l"><path d="M 0 ${g} H ${L} C ${L + 40} ${g + 90} ${L + 30} ${g + 220} ${L + 90} 1080 H 0 Z"/></clipPath><clipPath id="br-cliff-r"><path d="M 1920 ${g} H ${R} C ${R - 40} ${g + 90} ${R - 30} ${g + 220} ${R - 90} 1080 H 1920 Z"/></clipPath></defs>`;
			// The two cliffs, with rock layers and grass on top, and the river far below.
			for (const [id, wall, side] of [['br-cliff-l', wallL, 0], ['br-cliff-r', wallR, 1920]]) {
				svg += `<path d="${wall} H ${side} V ${g} Z" fill="var(--green-tint)"/>`;
				const layers = [g + 96, g + 178, g + 262].map((y, k) => (side ? `M 1920 ${y + 8} C 1700 ${y - 10} 1560 ${y + 22} 1300 ${y + 4 - k * 6}` : `M 0 ${y} C 200 ${y + 18} 380 ${y - 14} 640 ${y + 6 + k * 4}`)).join(' ');
				svg += `<g clip-path="url(#${id})"><path d="${layers}" fill="none" stroke="var(--green)" stroke-width="3" stroke-opacity=".28" stroke-linecap="round"/></g>`;
				svg += `<path d="${wall}" fill="none" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>`;
			}
			svg += `<path d="M 0 ${g} H ${L} M ${R} ${g} H 1920" stroke="var(--green)" stroke-width="5" stroke-linecap="round"/>`;
			svg += [70, 150, 300, 1590, 1780, 1860].map(x => `<path d="M ${x} ${g} l -8 -16 M ${x + 6} ${g} l 2 -20 M ${x + 12} ${g} l 10 -14" stroke="var(--green)" stroke-width="3.5" stroke-linecap="round"/>`).join('');
			svg += `<path d="M ${L + 72} 1024 C ${L + 200} 1008 ${R - 200} 1008 ${R - 72} 1024 L ${R - 80} 1080 H ${L + 80} Z" fill="var(--blue-tint)"/>`;
			svg += [1036, 1060].map((y, k) => `<path d="M ${L + 150 + k * 60} ${y} q 40 -12 80 0 t 80 0 t 80 0 M ${R - 470 + k * 50} ${y + 4} q 40 -12 80 0 t 80 0 t 80 0" fill="none" stroke="var(--blue)" stroke-width="3" stroke-linecap="round" stroke-opacity=".55"/>`).join('');
			// The suspension bridge: deck, two towers, the main cable and its hangers, all in purple.
			const tL = 660, tR = 1260, tTop = 452, sag = 846, aL = 430, aR = 1490;
			const cableY = x => {
				if (x <= tL) {
					return g - 6 + (tTop - (g - 6)) * ((x - aL) / (tL - aL)) ** 1.15;
				}
				if (x >= tR) {
					return g - 6 + (tTop - (g - 6)) * ((aR - x) / (aR - tR)) ** 1.15;
				}
				const t = (x - tL) / (tR - tL);
				return (1 - t) ** 2 * tTop + 2 * (1 - t) * t * sag + t ** 2 * tTop;
			};
			let hangers = '';
			for (let x = aL + 40; x < aR - 20; x += 40) {
				if (Math.abs(x - tL) < 14 || Math.abs(x - tR) < 14) {
					continue;
				}
				hangers += `M ${x} ${r1(cableY(x) + 3)} V ${g - 12} `;
			}
			svg += `<path d="${hangers}" stroke="var(--purple)" stroke-width="3" stroke-opacity=".7"/>`;
			let cable = `M ${aL} ${g - 6}`;
			for (let x = aL + 10; x <= aR; x += 10) {
				cable += ` L ${x} ${r1(cableY(x))}`;
			}
			svg += `<path d="${cable}" fill="none" stroke="var(--purple)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`;
			for (const x of [tL, tR]) {
				svg += `<rect x="${x - 14}" y="${tTop - 16}" width="28" height="${g - tTop + 44}" rx="6" fill="var(--purple)"/>`;
			}
			svg += `<rect x="${aL - 60}" y="${g - 18}" width="${aR - aL + 120}" height="24" rx="6" fill="var(--purple)"/>`;
			svg += `<path d="M ${aL - 50} ${g - 44} H ${aR + 50}" stroke="var(--purple)" stroke-width="4" stroke-linecap="round"/>`;
			// The round weight-limit sign at the near end of the bridge: its number is a question mark.
			const sx = 474, sy = 574, sr = 58;
			svg += `<rect x="${sx - 5}" y="${sy + sr - 6}" width="10" height="${g - 18 - sy - sr + 6}" fill="${INK}"/><circle cx="${sx}" cy="${sy}" r="${sr}" fill="#fff" stroke="var(--red)" stroke-width="14"/>`;
			const you = { x: 214, y: g - 74 }, bot = { x: 1700, y: g - 74 }, R0 = 62;
			return `<div class="bridge"><svg class="rd-svg" width="1920" height="1080" viewBox="0 0 1920 1080">${svg}</svg>
<div class="br-text"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="br-say" data-t>${fmt(s.text ?? '')}</div></div>
<div class="br-q" style="left:${sx - 46}px;top:${sy - 33}px;width:92px;height:66px" data-t><b>${esc(s.sign ?? '?')}</b><i>${esc(s.unit ?? 't')}</i></div>
<div class="br-disc" style="left:${you.x - R0}px;top:${you.y - R0}px;width:${R0 * 2}px;height:${R0 * 2}px;background:var(--orange-tint);box-shadow:inset 0 0 0 5px var(--orange);color:var(--orange)">${ic(s.you ?? 'person', 66)}</div>
<div class="br-disc" style="left:${bot.x - R0}px;top:${bot.y - R0}px;width:${R0 * 2}px;height:${R0 * 2}px;background:var(--purple);color:#fff">${ic(s.builder ?? 'bot', 66)}</div>
${s.ask ? `<div class="br-tag t-orange" style="left:100px;top:${you.y - R0 - 70}px">${ic(s.askIcon ?? 'question', 36)}<span data-t>${fmt(s.ask)}</span></div>` : ''}
${s.built ? `<div class="br-tag t-blue" style="right:96px;top:${bot.y - R0 - 70}px">${ic(s.builtIcon ?? 'timer', 36)}<span data-t>${fmt(s.built)}</span></div>` : ''}
</div>`;
		},
	},

	/** A gallery wall hung salon style: up to five framed works on nails and picture wire, a big one in the middle and two
	 * on each side (ink, gilt and thin frames), each with a brass plate for its caption and sub. A missing picture shows a
	 * placeholder canvas with the kind's icon and its placeholder text. Fields: eyebrow, title, items (up to 5, the first
	 * hangs in the middle): [{ src (an image in assets/), alt, kind: 'image' | 'video' | 'website' | 'motion' | 'cad' |
	 * 'svg', caption, sub, placeholder, fit ('cover' | 'contain') }]. */
	'gallery-wall': {
		css: `
.gallery-wall { position: relative; width: 1728px; --yellow: #9a6700; }
.gallery-wall .gw-canvas { position: absolute; overflow: hidden; background: var(--blue-tint); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 0 18px; box-sizing: border-box; text-align: center; color: var(--blue); }
.gallery-wall .gw-canvas img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.gallery-wall .gw-ph { font-size: 22px; font-weight: 600; line-height: 1.25; color: var(--blue); }
.gallery-wall .gw-plate { position: absolute; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 22px; border-radius: 6px; background: #f2c94c; box-shadow: 0 0 0 4px #fff; white-space: nowrap; }
.gallery-wall .gw-cap { font-size: 24px; font-weight: 700; line-height: 1.15; color: var(--ink); }
.gallery-wall .gw-sub { font-size: 17px; font-weight: 600; line-height: 1.2; color: var(--ink); }
`,
		render(s) {
			const H = bodyHeight(s);
			const KIND_ICON = { image: 'image', video: 'videoClip', website: 'globe', motion: 'film', cad: 'cube', svg: 'shapes' };
			// Where each work hangs (a big one in the middle, two on each side) and its frame: ink, gilt or a thin one with a
			// wide mat.
			const slots = [
				{ x: 590, y: 100, w: 650, h: 458, frame: 'ink', wire: 44 },
				{ x: 70, y: 64, w: 420, h: 260, frame: 'gilt', wire: 44 },
				{ x: 1300, y: 50, w: 290, h: 340, frame: 'thin', wire: 40 },
				{ x: 220, y: 404, w: 330, h: 250, frame: 'thin', wire: 40 },
				{ x: 1394, y: 452, w: 330, h: 196, frame: 'gilt', wire: 38 },
			];
			const items = (s.items ?? []).slice(0, slots.length);
			let svg = '';
			const works = items.map((it, i) => {
				const b = slots[i];
				const cx = b.x + b.w / 2, ny = b.y - b.wire;
				// The nail and the picture wire.
				svg += `<path d="M ${r1(b.x + b.w * 0.16)} ${b.y + 3} L ${cx} ${ny} L ${r1(b.x + b.w * 0.84)} ${b.y + 3}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${cx}" cy="${ny}" r="7" fill="${INK}"/>`;
				// The frame and its mat; k is the inset of the picture.
				let k;
				if (b.frame === 'gilt') {
					k = 34;
					svg += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="4" fill="var(--yellow)"/><rect x="${b.x + 7}" y="${b.y + 7}" width="${b.w - 14}" height="${b.h - 14}" fill="none" stroke="${SIGN}" stroke-width="5"/><rect x="${b.x + 18}" y="${b.y + 18}" width="${b.w - 36}" height="${b.h - 36}" fill="#fff"/>`;
				} else if (b.frame === 'thin') {
					k = 40;
					svg += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="3" fill="${INK}"/><rect x="${b.x + 7}" y="${b.y + 7}" width="${b.w - 14}" height="${b.h - 14}" fill="#fff"/><rect x="${b.x + k - 4}" y="${b.y + k - 4}" width="${b.w - 2 * k + 8}" height="${b.h - 2 * k + 8}" fill="none" stroke="${INK}" stroke-width="2"/>`;
				} else {
					k = 34;
					svg += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="5" fill="${INK}"/><rect x="${b.x + 16}" y="${b.y + 16}" width="${b.w - 32}" height="${b.h - 32}" fill="#fff"/>`;
				}
				const cw = b.w - 2 * k, ch = b.h - 2 * k;
				const src = it.src ? asset(it.src) : null;
				// A placeholder is fine when no picture was named; a named picture that is missing is reported by the build.
				const missing = it.src ? ` data-missing="${esc(it.src)}"` : '';
				const pic = src
					? `<div class="gw-canvas" style="left:${b.x + k}px;top:${b.y + k}px;width:${cw}px;height:${ch}px"><img src="${esc(src)}" alt="${esc(it.alt ?? it.caption ?? '')}" style="object-fit:${it.fit ?? 'cover'}"></div>`
					: `<div class="gw-canvas"${missing} style="left:${b.x + k}px;top:${b.y + k}px;width:${cw}px;height:${ch}px" data-fit>${ic(KIND_ICON[it.kind] ?? 'image', i ? 46 : 72)}${it.placeholder ? `<div class="gw-ph" data-t>${fmt(it.placeholder)}</div>` : ''}</div>`;
				// The brass plate on the bottom of the frame: the caption, and the sub under it.
				const ph = it.sub ? 66 : 44;
				const plate = it.caption ? `<div class="gw-plate" style="left:${cx}px;top:${b.y + b.h - ph / 2 - 2}px;height:${ph}px"><span class="gw-cap" data-t>${fmt(it.caption)}</span>${it.sub ? `<span class="gw-sub" data-t>${fmt(it.sub)}</span>` : ''}</div>` : '';
				return pic + plate;
			}).join('');
			return heading(s) + body(`<div class="gallery-wall" style="height:${H}px">
<svg class="rd-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>
${works}
</div>`, { vcenter: false });
		},
	},
};
