// Level 1 layouts: simple cards. Tinted panels, big numbers, a scorecard, a breakdown grid, a versus, takeaways.
// No drawings: the numbers and the words carry the slide, so a deck is quick to make.
// Same tokens and checks as layouts.mjs: every text block carries data-t, every box that could overflow data-fit.
import { esc, fmt, heading, body, bodyHeight } from './layouts.mjs';

const tone = t => `t-${t ?? 'blue'}`;
const lbl = (text, cls = '') => (text ? `<div class="cd-lbl nolint${cls}" data-t>${fmt(text)}</div>` : '');

export const CARDS = {
	/** An overview: a solid hero card (label, title, sub) and a stat card on top, 2–4 numbered cards below.
	 * hero: { label, title, sub }, stat: { value, label, sub, tone }, items: [{ title, text, tone }] */
	cards(s) {
		const H = bodyHeight(s);
		const top = Math.round(H * 0.4), gap = 24;
		const hero = s.hero ? `<div class="cd-hero" data-fit style="height:${top}px">${lbl(s.hero.label)}<div class="cd-hero-t" data-t>${fmt(s.hero.title)}</div>${s.hero.sub ? `<div class="cd-hero-s" data-t>${fmt(s.hero.sub)}</div>` : ''}</div>` : '';
		const st = s.stat ? `<div class="cd-stat ${tone(s.stat.tone)}" data-fit style="height:${top}px"><div class="cd-stat-v nolint" data-t>${fmt(s.stat.value)}</div><div class="cd-stat-l" data-t>${fmt(s.stat.label)}</div>${s.stat.sub ? `<div class="cd-stat-s" data-t>${fmt(s.stat.sub)}</div>` : ''}</div>` : '';
		const items = (s.items ?? []).map((it, i) => `<div class="cd-card ${tone(it.tone ?? ['blue', 'green', 'purple', 'orange'][i % 4])}" data-fit><span class="cd-num nolint" data-t>${String(i + 1).padStart(2, '0')}</span><div class="cd-card-b"><div class="cd-card-t" data-t>${fmt(it.title)}</div>${it.text ? `<div class="cd-card-x" data-t>${fmt(it.text)}</div>` : ''}</div></div>`).join('');
		return heading(s) + body(`<div class="cd-over" style="height:${H}px;gap:${gap}px"><div class="cd-row" style="height:${top}px">${hero}${st}</div><div class="cd-row cd-items" style="height:${H - top - gap}px">${items}</div></div>`, { vcenter: false });
	},

	/** Head to head: two big numbers in panels with a delta badge between them, and 0–4 rows under them, each a number,
	 * a label and a line, with a bar on the left in its tone. left/right: { label, value, sub, tone }, delta: { text,
	 * tone }, rows: [{ value, label, text, tone }] */
	scorecard(s) {
		const H = bodyHeight(s);
		const rows = s.rows ?? [];
		const rowH = 74, rowGap = 14, panelH = rows.length ? H - rows.length * (rowH + rowGap) - 18 : H - 40;
		const panel = (p, side) => `<div class="cd-sc-panel ${side} ${tone(p.tone)}" data-fit><div class="cd-lbl nolint" data-t>${fmt(p.label)}</div><div class="cd-sc-v nolint" data-t>${fmt(p.value)}</div>${p.sub ? `<div class="cd-sc-s" data-t>${fmt(p.sub)}</div>` : ''}</div>`;
		const delta = s.delta ? `<div class="cd-sc-delta nolint ${tone(s.delta.tone ?? 'orange')}" data-t>${fmt(s.delta.text)}</div>` : '';
		const list = rows.map(r => `<div class="cd-sc-row ${tone(r.tone ?? 'neutral')}" style="height:${rowH}px" data-fit><span class="cd-sc-rv nolint" data-t>${fmt(r.value)}</span><span class="cd-sc-rl nolint" data-t>${fmt(r.label)}</span><span class="cd-sc-rt" data-t>${fmt(r.text ?? '')}</span></div>`).join('');
		return heading(s) + body(`<div class="cd-sc" style="height:${H}px"><div class="cd-sc-top" style="height:${Math.min(panelH, 360)}px">${panel(s.left, 'l')}${delta}${panel(s.right, 'r')}</div><div class="cd-sc-rows" style="gap:${rowGap}px">${list}</div></div>`, { vcenter: true });
	},

	/** One number that is the point, very big, with a coloured bar down the left; an optional meter beside it, and one
	 * or two panels under it (the problem, the insight). value, unit (words after it), tone, meter: { value (0–1), label },
	 * panels: [{ label, title, text, tone }] */
	bignumber(s) {
		const H = bodyHeight(s);
		const t = s.tone ?? 'orange';
		const meter = s.meter ? `<div class="cd-meter ${tone(t)}"><div class="cd-meter-bar"><i style="width:${Math.round(Math.max(0, Math.min(1, s.meter.value)) * 100)}%"></i></div><div class="cd-meter-l" data-t>${fmt(s.meter.label)}</div></div>` : '';
		const panels = (s.panels ?? []).map(p => `<div class="cd-panel ${tone(p.tone ?? 'blue')}" data-fit>${lbl(p.label)}<div class="cd-panel-t" data-t>${fmt(p.title)}</div>${p.text ? `<div class="cd-panel-x" data-t>${fmt(p.text)}</div>` : ''}</div>`).join('');
		return heading(s) + body(`<div class="cd-big ${tone(t)}" style="height:${H}px"><div class="cd-big-top"><div class="cd-big-n"><span class="cd-big-v nolint" data-t>${fmt(s.value)}</span>${s.unit ? `<span class="cd-big-u" data-t>${fmt(s.unit)}</span>` : ''}</div>${meter}</div>${panels ? `<div class="cd-panels">${panels}</div>` : ''}</div>`, { vcenter: false });
	},

	/** A breakdown: 3–6 cards in a grid, each a category, its change big in its tone (green better, red worse, grey
	 * flat) and the two numbers behind it. items: [{ title, sub, value, tone, detail }], cols (default 3) */
	breakdown(s) {
		const H = bodyHeight(s);
		const cols = s.cols ?? 3, n = s.items.length, rows = Math.ceil(n / cols), gap = 24;
		const ch = Math.min(300, (H - gap * (rows - 1)) / rows);
		const cards = s.items.map(it => `<div class="cd-bd ${tone(it.tone ?? 'neutral')}" style="height:${Math.round(ch)}px" data-fit><div class="cd-bd-t" data-t>${fmt(it.title)}</div>${it.sub ? `<div class="cd-bd-s" data-t>${fmt(it.sub)}</div>` : ''}<div class="cd-bd-v nolint" data-t>${fmt(it.value)}</div>${it.detail ? `<div class="cd-bd-d nolint" data-t>${fmt(it.detail)}</div>` : ''}</div>`).join('');
		return heading(s) + body(`<div class="cd-bds" style="grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${cards}</div>`, { vcenter: true });
	},

	/** Two options side by side, a "vs" between them; each lists 2–4 points with a bar in green (a plus) or orange (a
	 * cost). left/right: { label, title, items: [{ title, text, good }] }, vs (default 'vs') */
	versus(s) {
		const side = p => `<div class="cd-vs-p" data-fit>${lbl(p.label)}<div class="cd-vs-t" data-t>${fmt(p.title)}</div><div class="cd-vs-items">${p.items.map(it => `<div class="cd-vs-i ${it.good === false ? 't-orange' : 't-green'}"><div class="cd-vs-it" data-t>${fmt(it.title)}</div>${it.text ? `<div class="cd-vs-ix" data-t>${fmt(it.text)}</div>` : ''}</div>`).join('')}</div></div>`;
		return heading(s) + body(`<div class="cd-vs">${side(s.left)}<span class="cd-vs-c nolint" data-t>${esc(s.vs ?? 'vs')}</span>${side(s.right)}</div>`, { vcenter: true });
	},

	/** What to take away: 2–4 numbered points (a small label in the tone, a title, one line), and an optional note in a
	 * grey bar under them. items: [{ label, title, text, tone }], note */
	takeaways(s) {
		const items = s.items.map((it, i) => `<div class="cd-tk ${tone(it.tone ?? ['orange', 'blue', 'green', 'purple'][i % 4])}"><span class="cd-tk-n nolint" data-t>${i + 1}</span><div class="cd-tk-b">${lbl(it.label)}<div class="cd-tk-t" data-t>${fmt(it.title)}</div>${it.text ? `<div class="cd-tk-x" data-t>${fmt(it.text)}</div>` : ''}</div></div>`).join('');
		const note = s.note ? `<div class="cd-tk-note" data-t>${fmt(s.note)}</div>` : '';
		return heading(s) + body(`<div class="cd-tks">${items}${note}</div>`, { vcenter: true });
	},
};
