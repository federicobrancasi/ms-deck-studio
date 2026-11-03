// Diagram layouts (v5): shapes that carry the idea, so the slide needs few words. Same look, tones and checks as
// layouts.mjs: every text block carries data-t, every box that could overflow carries data-fit.
import fs from 'node:fs';
import path from 'node:path';
import { LOGOS } from '../theme/logos/logos.mjs';
import { ROOT, esc, fmt, ic, iconTile, pill, stepTone, heading, body, bodyHeight, arrowHead, arrowSvg, pngSize } from './layouts.mjs';

const W = 1728;
const r1 = v => Math.round(v * 10) / 10;

const logoCache = new Map();
/** A brand mark from theme/logos (Simple Icons), in its brand colour unless a colour is given. A multicolor logo keeps
 * its own colours. */
const warned = new Set();
export function logo(slug, size = 48, color = null) {
	const meta = LOGOS[slug];
	if (!meta) {
		throw new Error(`Unknown logo "${slug}". Known logos: ${Object.keys(LOGOS).join(', ')}`);
	}
	if (!logoCache.has(slug)) {
		if (meta.local && (process.env.DECK_BRAND === 'off' || !fs.existsSync(path.join(ROOT, 'theme/logos', `${slug}.svg`)))) {
			// A mark the repo can't ship: fall back to a neutral icon, and say once where the real one goes.
			if (!warned.has(slug)) {
				warned.add(slug);
				console.warn(`Logo "${slug}" is not in the repo: drawn as a plain icon. For the real mark, drop its SVG at theme/logos/${slug}.svg (git ignores it).`);
			}
			return `<span class="logo" style="width:${size}px;height:${size}px;color:${color ?? 'var(--blue)'}">${ic('code', size)}</span>`;
		}
		logoCache.set(slug, fs.readFileSync(path.join(ROOT, 'theme/logos', `${slug}.svg`), 'utf8').replace(/<title>[^<]*<\/title>/, ''));
	}
	const svg = meta.multicolor ? logoCache.get(slug) : logoCache.get(slug).replace('<svg ', `<svg fill="${color ?? meta.hex}" `);
	return `<span class="logo" style="width:${size}px;height:${size}px">${svg}</span>`;
}

function notesList(callouts) {
	return callouts?.length ? `<div class="ui-notes">${callouts.map((nt, k) => `<div class="unote t-${nt.tone ?? stepTone(k)}"><span class="st-badge" style="width:40px;height:40px;font-size:18px;background:var(--fg)" data-t>${k + 1}</span><div><div class="t" data-t>${fmt(nt.title)}</div>${nt.text ? `<div class="s" data-t>${fmt(nt.text)}</div>` : ''}</div></div>`).join('')}</div>` : '';
}

function bezier(p0, p1, p2, p3, t) {
	const u = 1 - t;
	return {
		x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
		y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
	};
}

/** The "who" line of a story: an icon and a few words, no chip. */
function storyWho(s, style = '') {
	return s.who ? `<div class="sx-who" style="${style}" data-t>${ic(s.who.icon ?? 'building', 28)}<span>${fmt(s.who.text)}</span></div>` : '';
}

/** Full-page looks for the story layout (v8). Same data as the classic look: who, beats, outcome; the outcome is part
 * of the picture instead of a box on the side. Pick one with `look`. */
const STORY_LOOKS = {
	/** One wide road across the page: a big stop per beat, the outcome as the last, bigger stop. */
	road(s) {
		const H = bodyHeight(s);
		const o = s.outcome;
		const tone = o?.tone ?? 'green';
		const n = s.beats.length;
		const ow = o ? 520 : 0;
		const bw = (W - ow) / n;
		const dot = 108;
		const cap = 196;
		const roadY = Math.round((s.who ? 64 : 0) + (H - (s.who ? 64 : 0)) * 0.4);
		const stops = s.beats.map((b, i) => {
			const bt = b.tone ?? 'neutral';
			const left = bw * i + 12;
			return `<div class="rd-stop t-${bt}" style="left:${r1(left)}px;width:${r1(bw - 24)}px;height:${H}px">${b.time ? `<div class="sx-time rd-time" style="bottom:${r1(H - roadY + dot / 2 + 20)}px" data-t>${fmt(b.time)}</div>` : ''}<span class="rd-dot" style="left:${r1((bw - 24 - dot) / 2)}px;top:${r1(roadY - dot / 2)}px;width:${dot}px;height:${dot}px">${ic(b.icon ?? 'circle', 48)}</span><div class="rd-text" style="top:${r1(roadY + dot / 2 + 24)}px" data-t>${fmt(b.text)}</div></div>`;
		}).join('');
		let goal = '';
		const gx = W - ow + 36;
		if (o) {
			goal = `<div class="rd-goal t-${tone}" style="left:${r1(gx)}px;width:${r1(ow - 36)}px;height:${H}px"><div class="sx-time rd-time" style="bottom:${r1(H - roadY + cap / 2 + 20)}px" data-t>${fmt(o.label ?? 'Outcome')}</div><div class="rd-cap" style="top:${r1(roadY - cap / 2)}px;height:${cap}px" data-fit><span class="rd-value" data-t data-autofit="${Math.round(ow - 36 - 70)}">${fmt(o.value ?? '')}</span></div>${o.text ? `<div class="rd-text big" style="top:${r1(roadY + cap / 2 + 24)}px" data-t>${fmt(o.text)}</div>` : ''}</div>`;
		}
		const x0 = bw / 2, x1 = o ? gx - 14 : W - bw / 2;
		const lastX = bw * (n - 1) + bw / 2;
		const svg = `<svg class="rd-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M ${r1(x0)} ${roadY} H ${r1(lastX)}" stroke="var(--connector)" stroke-width="8" stroke-linecap="round"/>${o ? `<path d="M ${r1(lastX)} ${roadY} H ${r1(x1)}" stroke="var(--${tone})" stroke-width="8" stroke-linecap="round"/>${arrowHead(x1, roadY, lastX, roadY, `var(--${tone})`, 8)}` : ''}</svg>`;
		return heading(s) + body(`<div class="sx sx-road" style="height:${H}px">${storyWho(s, 'left:0;top:0')}${svg}${stops}${goal}</div>`, { vcenter: false });
	},

	/** The number is the hero, in a big disc; the beats sit around it and point into it. */
	number(s) {
		const H = bodyHeight(s);
		const o = s.outcome;
		const tone = o?.tone ?? 'blue';
		const n = s.beats.length;
		const top = s.who ? 56 : 0;
		const D = Math.min(H - top - 8, 540);
		const cx = W / 2, cy = top + (H - top) / 2;
		const cw = (W - D) / 2 - 86;
		const leftCount = Math.ceil(n / 2);
		let svg = '';
		const beats = s.beats.map((b, i) => {
			const bt = b.tone ?? 'neutral';
			const left = i < leftCount;
			const k = left ? leftCount : n - leftCount;
			const j = left ? i : i - leftCount;
			const by = top + ((H - top) * (j + 1)) / (k + 1);
			const bx = left ? 0 : W - cw;
			const ex = left ? cw + 18 : W - cw - 18;
			const ang = Math.atan2(cy - by, cx - ex);
			const tx = cx - Math.cos(ang) * (D / 2 + 14), ty = cy - Math.sin(ang) * (D / 2 + 14);
			svg += `<path d="M ${r1(ex)} ${r1(by)} L ${r1(tx)} ${r1(ty)}" stroke="var(--connector)" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>${arrowHead(tx, ty, ex, by, 'var(--connector)', 3)}`;
			return `<div class="nm-beat t-${bt}${left ? '' : ' right'}" style="left:${r1(bx)}px;top:${r1(by)}px;width:${r1(cw)}px"><span class="nm-icon">${ic(b.icon ?? 'circle', 34)}<span class="st-badge nm-n" data-t>${i + 1}</span></span><div>${b.time ? `<div class="sx-time" data-t>${fmt(b.time)}</div>` : ''}<div class="nm-text" data-t>${fmt(b.text)}</div></div></div>`;
		}).join('');
		const disc = o ? `<div class="nm-disc t-${tone}" style="left:${r1(cx - D / 2)}px;top:${r1(cy - D / 2)}px;width:${D}px;height:${D}px"><div class="sx-time" data-t>${fmt(o.label ?? 'Outcome')}</div><div class="nm-value" data-t data-autofit="${D - 90}">${fmt(o.value ?? '')}</div>${o.text ? `<div class="nm-sub" style="max-width:${D - 130}px" data-t>${fmt(o.text)}</div>` : ''}</div>` : '';
		return heading(s) + body(`<div class="sx sx-number" style="height:${H}px">${storyWho(s, 'left:0;right:0;top:0;justify-content:center')}<svg class="rd-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>${disc}${beats}</div>`, { vcenter: false });
	},

	/** A comic strip: one tall panel per beat, the outcome in the last panel in full colour. */
	panels(s) {
		const H = bodyHeight(s);
		const o = s.outcome;
		const tone = o?.tone ?? 'blue';
		const count = s.beats.length + (o ? 1 : 0);
		const gap = 22;
		const top = s.who ? 60 : 0;
		const pw = (W - gap * (count - 1)) / count;
		const panel = (i, inner, cls) => `<div class="pn ${cls}" style="left:${r1(i * (pw + gap))}px;top:${top}px;width:${r1(pw)}px;height:${H - top}px" data-fit>${inner}</div>`;
		const beats = s.beats.map((b, i) => {
			const bt = b.tone && b.tone !== 'neutral' ? b.tone : 'blue';
			return panel(i, `<div class="pn-top"><span class="st-badge pn-n" data-t>${i + 1}</span>${b.time ? `<span class="sx-time" data-t>${fmt(b.time)}</span>` : ''}</div><span class="pn-icon">${ic(b.icon ?? 'circle', 58)}</span><div class="pn-text" data-t>${fmt(b.text)}</div>`, `t-${bt}`);
		}).join('');
		const goal = o ? panel(s.beats.length, `<div class="pn-top"><span class="sx-time" data-t>${fmt(o.label ?? 'Outcome')}</span></div><div class="pn-value" data-t data-autofit="${Math.round(pw - 64)}">${fmt(o.value ?? '')}</div>${o.text ? `<div class="pn-text" data-t>${fmt(o.text)}</div>` : ''}`, `goal t-${tone}`) : '';
		return heading(s) + body(`<div class="sx sx-panels" style="height:${H}px">${storyWho(s, 'left:0;top:0')}${beats}${goal}</div>`, { vcenter: false });
	},

	/** Before and after: the page in two halves, the problem on the left, the fix and the outcome on the right.
	 * Beats go left until the first beat with side: 'after' (default: the second half goes right). before/after: labels. */
	split(s) {
		const H = bodyHeight(s);
		const o = s.outcome;
		const n = s.beats.length;
		const cut = s.beats.findIndex(b => b.side === 'after');
		const k = cut >= 0 ? cut : Math.ceil(n / 2);
		const top = s.who ? 60 : 0;
		const mid = 130;
		const hw = (W - mid) / 2;
		const rows = list => `<div class="sp-beats">${list.map(b => `<div class="sp-beat">${iconTile(b.icon ?? 'circle', { tone: b.tone ?? 'neutral', size: 76, round: true })}<div>${b.time ? `<div class="sx-time" data-t>${fmt(b.time)}</div>` : ''}<div class="sp-text" data-t>${fmt(b.text)}</div></div></div>`).join('')}</div>`;
		const beforeTone = s.beforeTone ?? 'red', afterTone = s.afterTone ?? o?.tone ?? 'green';
		const goal = o ? `<div class="sp-goal"><div class="sx-time" data-t>${fmt(o.label ?? 'Outcome')}</div><div class="sp-value" data-t data-autofit="${Math.round(hw - 100)}">${fmt(o.value ?? '')}</div>${o.text ? `<div class="sp-sub" data-t>${fmt(o.text)}</div>` : ''}</div>` : '';
		const side = (cls, tone, label, inner, left) => `<div class="sp-side ${cls} t-${tone}" style="left:${r1(left)}px;top:${top}px;width:${r1(hw)}px;height:${H - top}px" data-fit><div class="sp-head" data-t>${fmt(label)}</div>${inner}</div>`;
		const arrow = `<span class="sp-arrow t-${afterTone}" style="left:${r1(W / 2 - 46)}px;top:${r1(top + (H - top) / 2 - 46)}px">${ic('arrowRight', 44)}</span>`;
		return heading(s) + body(`<div class="sx sx-split" style="height:${H}px">${storyWho(s, 'left:0;top:0')}${side('before', beforeTone, s.before ?? 'Before', rows(s.beats.slice(0, k)), 0)}${side('after', afterTone, s.after ?? 'After', rows(s.beats.slice(k)) + goal, W - hw)}${arrow}</div>`, { vcenter: false });
	},
};

export const DIAGRAMS = {
	/** A request branching into what the agent could do. Your words cut some branches; the rest stays open.
	 * root: { label, text, icon }, branches (3-6): [{ text, cut: 'the words that cut it' }] (list the open ones last),
	 * keepLabel: label for the open branches, cutLabel: label over the cut words. */
	tree(s) {
		const H = bodyHeight(s);
		const n = s.branches.length;
		const rootW = 420, rootH = s.root.label ? 176 : 136;
		const leafX = 820, leafW = 410, leafH = 76;
		const whyX = leafX + leafW + 40;
		const gap = Math.min(34, (H - 60 - n * leafH) / Math.max(1, n - 1));
		const total = n * leafH + (n - 1) * gap;
		const top0 = (H - total) / 2 + (s.cutLabel ? 24 : 0);
		const ry = H / 2;
		let svg = '';
		let html = `<div class="tree-root" data-fit style="left:0;top:${r1(ry - rootH / 2)}px;width:${rootW}px;height:${rootH}px">${s.root.label ? `<div class="lbl" data-t>${fmt(s.root.label)}</div>` : ''}<div class="tree-root-text" data-t>${fmt(s.root.text)}</div></div>`;
		const open = [];
		s.branches.forEach((b, i) => {
			const y = top0 + i * (leafH + gap) + leafH / 2;
			const cut = !!b.cut;
			const p0 = { x: rootW, y: ry }, p1 = { x: rootW + 200, y: ry }, p2 = { x: leafX - 200, y }, p3 = { x: leafX, y };
			svg += `<path d="M ${p0.x} ${r1(p0.y)} C ${p1.x} ${r1(p1.y)}, ${p2.x} ${r1(p2.y)}, ${p3.x} ${r1(p3.y)}" fill="none" stroke="${cut ? 'var(--faint)' : 'var(--green)'}" stroke-width="${cut ? 3 : 4}"${cut ? ' stroke-dasharray="3 11"' : ''} stroke-linecap="round"/>`;
			if (cut) {
				const at = bezier(p0, p1, p2, p3, 0.8);
				html += `<span class="tree-scissors" style="left:${r1(at.x)}px;top:${r1(at.y)}px">${ic('cut', 26)}</span>`;
				html += `<div class="tree-why" style="left:${whyX}px;top:${r1(y)}px">${pill({ text: b.cut, tone: 'red', icon: 'cut', size: 'm' })}</div>`;
			} else {
				open.push(y);
			}
			html += `<div class="tree-leaf${cut ? ' cut' : ''}" data-fit style="left:${leafX}px;top:${r1(y - leafH / 2)}px;width:${leafW}px;height:${leafH}px">${ic(cut ? 'dismiss' : 'sparkle', 28)}<span data-t>${fmt(b.text)}</span></div>`;
		});
		if (open.length && s.keepLabel) {
			const y0 = Math.min(...open) - leafH / 2 + 8, y1 = Math.max(...open) + leafH / 2 - 8;
			svg += `<path d="M ${whyX} ${r1(y0)} h 16 V ${r1(y1)} h -16" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
			html += `<div class="tree-keep" style="left:${whyX + 38}px;top:${r1((y0 + y1) / 2)}px">${pill({ text: s.keepLabel, tone: 'green', icon: 'sparkle', size: 'm' })}</div>`;
		}
		if (s.cutLabel) {
			html += `<div class="tree-cutlabel lbl" data-t style="left:${whyX}px;top:${r1(top0 - 46)}px;color:var(--red)">${fmt(s.cutLabel)}</div>`;
		}
		return heading(s) + body(`<div class="tree" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${svg}</svg>${html}</div>`, { vcenter: false });
	},

	/** A scale between two extremes, with the good zone marked.
	 * left/right: { title, text, icon, tone }, zone: { from, to (0..1), title, text, tone }, marks: [{ at, label, tone }] */
	spectrum(s) {
		const H = bodyHeight(s);
		const ty = Math.round(H * 0.5);
		const lt = `var(--${s.left.tone ?? 'orange'})`, rt = `var(--${s.right.tone ?? 'orange'})`;
		let svg = `<defs><linearGradient id="spec-g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${lt}" stop-opacity=".45"/><stop offset=".3" stop-color="#eef0f3"/><stop offset=".7" stop-color="#eef0f3"/><stop offset="1" stop-color="${rt}" stop-opacity=".45"/></linearGradient></defs><rect x="18" y="${ty - 9}" width="${W - 36}" height="18" rx="9" fill="url(#spec-g)"/>`;
		svg += arrowHead(6, ty, 40, ty, 'var(--line-strong)', 4) + arrowHead(W - 6, ty, W - 40, ty, 'var(--line-strong)', 4);
		let html = '';
		const end = (e, side) => {
			const tone = e.tone ?? 'orange';
			const align = side === 'left' ? 'left:0;align-items:flex-start;text-align:left' : 'right:0;align-items:flex-end;text-align:right';
			html += `<div class="spec-end t-${tone}" style="${align};bottom:${H - ty + 40}px">${e.icon ? iconTile(e.icon, { tone, size: 60 }) : ''}<div class="spec-title" data-t>${fmt(e.title)}</div></div>`;
			if (e.text) {
				html += `<div class="spec-text" data-t style="${side === 'left' ? 'left:0;text-align:left' : 'right:0;text-align:right'};top:${ty + 40}px">${fmt(e.text)}</div>`;
			}
		};
		end(s.left, 'left');
		end(s.right, 'right');
		if (s.zone) {
			const z = s.zone;
			const tone = z.tone ?? 'green';
			const x0 = z.from * W, x1 = z.to * W, cx = (x0 + x1) / 2;
			svg += `<rect x="${r1(x0)}" y="${ty - 24}" width="${r1(x1 - x0)}" height="48" rx="24" fill="var(--${tone}-tint)" stroke="var(--${tone})" stroke-width="3"/>`;
			html += `<div class="spec-zone" style="left:${r1(cx)}px;bottom:${H - ty + 44}px">${pill({ text: z.title, tone, icon: z.icon ?? 'target', size: 'l', solid: true })}</div>`;
			if (z.text) {
				html += `<div class="spec-zone-text t-${tone}" data-fit style="left:${r1(cx)}px;top:${ty + 44}px"><span data-t>${fmt(z.text)}</span></div>`;
			}
		}
		for (const m of s.marks ?? []) {
			const tone = m.tone ?? 'blue';
			html += `<span class="spec-mark t-${tone}" style="left:${r1(m.at * W)}px;top:${ty}px"></span><div class="spec-mark-label t-${tone}" data-t style="left:${r1(m.at * W)}px;top:${ty + 34}px">${fmt(m.label)}</div>`;
		}
		return heading(s) + body(`<div class="spectrum" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;overflow:visible">${svg}</svg>${html}</div>`, { vcenter: false });
	},

	/** A conversation. messages: [{ from: 'user'|'agent'|'note', text, label, mono, icon, tone }], dark: true for a dark
	 * editor panel, width, callouts (<= 3, numbered on the right). */
	chat(s) {
		const width = s.width ?? (s.callouts?.length ? 1040 : 1240);
		const msgs = s.messages.map(m => {
			if (m.from === 'note') {
				return `<div class="chat-note" data-t>${fmt(m.text)}</div>`;
			}
			const user = m.from === 'user';
			const label = m.label ? `<div class="chat-label" data-t>${fmt(m.label)}</div>` : '';
			const avatar = user ? `<span class="chat-av">${ic('person', 28)}</span>` : iconTile(m.icon ?? 'bot', { tone: m.tone ?? 'purple', size: 52, round: true });
			const bubble = `<div class="chat-bubble${m.mono ? ' mono' : ''}" data-fit>${label}<div class="chat-text" data-t>${m.mono ? esc(m.text) : fmt(m.text)}</div></div>`;
			return `<div class="chat-row ${user ? 'user' : 'agent'}">${user ? bubble + avatar : avatar + bubble}</div>`;
		}).join('');
		const panel = `<div class="chat${s.dark ? ' dark' : ''}" style="width:${width}px">${s.window ? `<div class="chat-bar" data-t>${esc(s.window)}</div>` : ''}<div class="chat-msgs">${msgs}</div></div>`;
		return heading(s) + body(`<div class="ui-wrap${s.callouts?.length ? '' : ' center'}">${panel}${notesList(s.callouts)}</div>`);
	},

	/** A folder tree, with highlighted files explained on the right.
	 * root: folder name, items: [{ path: 'a/b/FILE.md' (end folders with /), title, text, icon, tone }] (an item
	 * without a title is drawn but not explained). */
	files(s) {
		const H = bodyHeight(s);
		const rows = [{ name: s.root ?? 'my-app', depth: 0, folder: true }];
		const seen = new Set();
		for (const it of s.items) {
			const isFolder = it.path.endsWith('/');
			const parts = it.path.replace(/\/$/, '').split('/');
			let acc = '';
			parts.forEach((p, i) => {
				acc += (acc ? '/' : '') + p;
				const last = i === parts.length - 1;
				if (!last || isFolder) {
					if (!seen.has(acc)) {
						seen.add(acc);
						rows.push({ name: p, depth: i + 1, folder: true, item: last ? it : null });
					}
				} else {
					rows.push({ name: p, depth: i + 1, folder: false, item: it });
				}
			});
		}
		const panelW = s.panelWidth ?? 640;
		const barH = 58;
		const rowH = Math.min(56, (H - barH - 28) / rows.length);
		const panelH = barH + rows.length * rowH + 20;
		const panelTop = (H - panelH) / 2;
		const explained = [];
		let k = 0;
		const rowHtml = rows.map((r, i) => {
			const it = r.item;
			const tone = it?.tone ?? (it?.title ? stepTone(k) : null);
			const y = panelTop + barH + i * rowH + rowH / 2;
			let badge = '';
			if (it?.title) {
				explained.push({ it, tone, y, k });
				badge = `<span class="st-badge" style="width:30px;height:30px;font-size:15px;background:var(--fg);margin-left:auto" data-t>${k + 1}</span>`;
				k++;
			}
			return `<div class="fx-row${tone ? ` on t-${tone}` : ''}${it?.dim ? ' dim' : ''}" style="height:${r1(rowH)}px;padding-left:${18 + r.depth * 30}px">${ic(r.folder ? 'folder' : 'document', 26, tone ? 'var(--fg)' : 'var(--muted)')}<span class="fx-name" data-t>${esc(r.name)}${r.folder ? '/' : ''}</span>${badge}</div>`;
		}).join('');
		const panel = `<div class="fx-panel" style="left:0;top:${r1(panelTop)}px;width:${panelW}px;height:${r1(panelH)}px"><div class="fx-bar" style="height:${barH}px"><span class="lbl" data-t>Explorer</span></div>${rowHtml}</div>`;
		// Notes on the right, near their row, pushed apart so they never overlap.
		const noteX = panelW + 120;
		const noteH = s.noteHeight ?? 128;
		const gap = 22;
		const ys = explained.map(e => e.y - noteH / 2);
		for (let i = 1; i < ys.length; i++) {
			ys[i] = Math.max(ys[i], ys[i - 1] + noteH + gap);
		}
		const overflow = ys.length ? ys[ys.length - 1] + noteH - H : 0;
		if (overflow > 0) {
			for (let i = ys.length - 1; i >= 0; i--) {
				ys[i] -= overflow;
				if (i > 0) {
					ys[i - 1] = Math.min(ys[i - 1], ys[i] - noteH - gap);
				}
			}
		}
		let svg = '';
		let notes = '';
		explained.forEach((e, i) => {
			const ny = Math.max(0, ys[i]);
			const cy = ny + noteH / 2;
			svg += `<path d="M ${panelW + 6} ${r1(e.y)} C ${panelW + 66} ${r1(e.y)}, ${noteX - 66} ${r1(cy)}, ${noteX - 8} ${r1(cy)}" fill="none" stroke="var(--${e.tone})" stroke-width="3" stroke-linecap="round"/><circle cx="${panelW + 6}" cy="${r1(e.y)}" r="6" fill="var(--${e.tone})"/>`;
			notes += `<div class="fx-note t-${e.tone}" data-fit style="left:${noteX}px;top:${r1(ny)}px;width:${W - noteX}px;height:${noteH}px">${iconTile(e.it.icon ?? 'document', { tone: e.tone, size: 60 })}<div><div class="t" data-t>${fmt(e.it.title)}</div>${e.it.text ? `<div class="s" data-t>${fmt(e.it.text)}</div>` : ''}</div></div>`;
		});
		return heading(s) + body(`<div class="files" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${svg}</svg>${panel}${notes}</div>`, { vcenter: false });
	},

	/** A loop of 3-6 steps around a circle. steps: [{ icon, title, sub, tone }], center: { title, icon },
	 * aside: { label, title, text } (a card on the right). */
	cycle(s) {
		const H = bodyHeight(s);
		const n = s.steps.length;
		const node = 92;
		const labelH = s.steps.some(st => st.sub) ? 80 : 44;
		const r = Math.min(s.radius ?? 230, (H - 2 * (node / 2 + 18 + labelH)) / 2);
		const cx = s.aside ? 640 : W / 2, cy = H / 2;
		const lw = s.aside ? 270 : 330;
		const ang = i => -Math.PI / 2 + (i * 2 * Math.PI) / n;
		const pt = a => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
		let svg = '';
		let html = '';
		const gapA = (node / 2 + 16) / r;
		for (let i = 0; i < n; i++) {
			const a0 = ang(i) + gapA, a1 = ang(i + 1) - gapA;
			const p0 = pt(a0), p1 = pt(a1);
			const before = pt(a1 - 0.08);
			svg += `<path d="M ${r1(p0.x)} ${r1(p0.y)} A ${r1(r)} ${r1(r)} 0 0 1 ${r1(p1.x)} ${r1(p1.y)}" fill="none" stroke="var(--connector)" stroke-width="4" stroke-linecap="round"/>${arrowHead(p1.x, p1.y, before.x, before.y, 'var(--connector)', 4)}`;
		}
		s.steps.forEach((st, i) => {
			const tone = st.tone ?? stepTone(i);
			const a = ang(i);
			const p = pt(a);
			html += `<span class="cy-node t-${tone}" style="left:${r1(p.x)}px;top:${r1(p.y)}px;width:${node}px;height:${node}px">${ic(st.icon ?? 'circle', 44)}</span>`;
			const c = Math.cos(a), sn = Math.sin(a);
			let style;
			if (Math.abs(c) < 0.35) {
				const ly = sn < 0 ? p.y - node / 2 - 14 - labelH : p.y + node / 2 + 14;
				style = `left:${r1(p.x - lw / 2)}px;top:${r1(ly)}px;width:${lw}px;text-align:center`;
			} else if (c > 0) {
				style = `left:${r1(p.x + node / 2 + 20)}px;top:${r1(p.y - labelH / 2)}px;width:${lw}px;text-align:left`;
			} else {
				style = `left:${r1(p.x - node / 2 - 20 - lw)}px;top:${r1(p.y - labelH / 2)}px;width:${lw}px;text-align:right`;
			}
			html += `<div class="cy-label t-${tone}" style="${style};height:${labelH}px"><div class="t" data-t>${fmt(st.title)}</div>${st.sub ? `<div class="s" data-t>${fmt(st.sub)}</div>` : ''}</div>`;
		});
		if (s.center) {
			html += `<div class="cy-center" style="left:${r1(cx)}px;top:${r1(cy)}px;width:${r1(Math.min(300, 2 * r - node - 48))}px">${s.center.icon ? ic(s.center.icon, 40, 'var(--blue)') : ''}<div data-t>${fmt(s.center.title)}</div></div>`;
		}
		let aside = '';
		if (s.aside) {
			const a = s.aside;
			aside = `<div class="st-card cy-aside" data-fit style="left:1240px;width:${W - 1240}px">${a.label ? `<div class="lbl" style="color:var(--blue)" data-t>${fmt(a.label)}</div>` : ''}${a.title ? `<div class="aside-title" data-t>${fmt(a.title)}</div>` : ''}${a.text ? `<div class="aside-body" data-t>${fmt(a.text)}</div>` : ''}</div>`;
		}
		return heading(s) + body(`<div class="cycle" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${svg}</svg>${html}${aside}</div>`, { vcenter: false });
	},

	/** Boxes and arrows on a grid, with yes/no branches. nodes: [{ id, col, row, title, sub, icon, tone, kind: 'decision' }],
	 * edges: [{ from, to, label, bend: 'below'|'above', tone, dashed }], cols, rows, boxWidth, boxHeight. */
	flow(s) {
		const H = bodyHeight(s);
		const C = s.cols ?? Math.max(...s.nodes.map(nd => nd.col)) + 1;
		const R = s.rows ?? Math.max(...s.nodes.map(nd => nd.row)) + 1;
		const cw = W / C, rh = H / R;
		const bw = Math.min(s.boxWidth ?? 390, cw - 64);
		const bh = s.boxHeight ?? (R >= 3 ? 150 : 170);
		const pos = new Map(s.nodes.map(nd => [nd.id, { x: (nd.col + 0.5) * cw, y: (nd.row + 0.5) * rh }]));
		const clip = (c, tx, ty, pad) => {
			const dx = tx - c.x, dy = ty - c.y;
			const kx = dx === 0 ? Infinity : (bw / 2 + pad) / Math.abs(dx);
			const ky = dy === 0 ? Infinity : (bh / 2 + pad) / Math.abs(dy);
			const k = Math.min(kx, ky);
			return { x: c.x + dx * k, y: c.y + dy * k };
		};
		let svg = '';
		let html = '';
		for (const e of s.edges) {
			const a = pos.get(e.from), b = pos.get(e.to);
			if (!a || !b) {
				throw new Error(`flow: unknown node in edge ${e.from} -> ${e.to}`);
			}
			const color = `var(--${e.tone ?? 'connector'})`;
			const dash = e.dashed ? ' stroke-dasharray="8 10"' : '';
			let mid;
			if (e.bend) {
				const amount = e.bendAmount ?? rh * 0.55;
				const off = { below: [0, amount], above: [0, -amount], left: [-amount, 0], right: [amount, 0] }[e.bend];
				const c = { x: (a.x + b.x) / 2 + off[0], y: Math.min(H - 8, Math.max(8, (a.y + b.y) / 2 + off[1])) };
				const p0 = clip(a, c.x, c.y, 6), p1 = clip(b, c.x, c.y, 14);
				svg += `<path d="M ${r1(p0.x)} ${r1(p0.y)} Q ${r1(c.x)} ${r1(c.y)} ${r1(p1.x)} ${r1(p1.y)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"${dash}/>${arrowHead(p1.x, p1.y, c.x, c.y, color, 3.5)}`;
				mid = { x: 0.25 * p0.x + 0.5 * c.x + 0.25 * p1.x, y: 0.25 * p0.y + 0.5 * c.y + 0.25 * p1.y };
			} else {
				const p0 = clip(a, b.x, b.y, 6), p1 = clip(b, a.x, a.y, 14);
				svg += `<path d="M ${r1(p0.x)} ${r1(p0.y)} L ${r1(p1.x)} ${r1(p1.y)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"${dash}/>${arrowHead(p1.x, p1.y, p0.x, p0.y, color, 3.5)}`;
				mid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
			}
			if (e.label) {
				html += `<div class="flow-label${e.tone ? ` t-${e.tone}` : ''}" data-t style="left:${r1(mid.x)}px;top:${r1(mid.y)}px">${fmt(e.label)}</div>`;
			}
		}
		for (const nd of s.nodes) {
			const p = pos.get(nd.id);
			const tone = nd.tone ?? (nd.kind === 'decision' ? 'orange' : 'blue');
			html += `<div class="flow-node t-${tone}${nd.kind === 'decision' ? ' decision' : ''}${nd.on ? ' on' : ''}" data-fit style="left:${r1(p.x - bw / 2)}px;top:${r1(p.y - bh / 2)}px;width:${r1(bw)}px;height:${bh}px">${iconTile(nd.icon ?? (nd.kind === 'decision' ? 'question' : 'circle'), { tone, size: 52, round: nd.kind === 'decision' })}<div><div class="t" data-t>${fmt(nd.title)}</div>${nd.sub ? `<div class="s" data-t>${fmt(nd.sub)}</div>` : ''}</div></div>`;
		}
		return heading(s) + body(`<div class="flow" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;overflow:visible">${svg}</svg>${html}</div>`, { vcenter: false });
	},

	/** A bar chart. bars: [{ label, value, text, tone, on }], unit, max, horizontal: true for long labels, note. */
	bars(s) {
		const H = bodyHeight(s) - (s.note ? 64 : 0);
		const n = s.bars.length;
		const max = s.max ?? Math.max(...s.bars.map(b => b.value));
		const valueText = b => b.text ?? `${b.value}${s.unit ?? ''}`;
		let html = '';
		if (s.horizontal) {
			const rowH = Math.min(96, H / n);
			const labelW = s.labelWidth ?? 440, valueW = 170;
			const trackW = W - labelW - valueW - 48;
			const top = (H - rowH * n) / 2;
			s.bars.forEach((b, i) => {
				const tone = b.tone ?? (b.on ? 'blue' : null);
				const y = top + i * rowH;
				const bw = Math.max(6, (b.value / max) * trackW);
				html += `<div class="bar-hlabel" data-t style="top:${r1(y)}px;height:${r1(rowH)}px;width:${labelW}px">${fmt(b.label)}</div>`;
				html += `<div class="bar-h${tone ? ` on t-${tone}` : ''}" style="left:${labelW + 24}px;top:${r1(y + rowH * 0.2)}px;width:${r1(bw)}px;height:${r1(rowH * 0.6)}px"></div>`;
				html += `<div class="bar-hvalue${tone ? ` t-${tone}` : ''}" data-t style="left:${r1(labelW + 24 + bw + 18)}px;top:${r1(y)}px;height:${r1(rowH)}px">${fmt(valueText(b))}</div>`;
			});
		} else {
			const labelH = 76, valueH = 64;
			const chartH = H - labelH - valueH;
			const slot = W / n;
			const bw = Math.min(s.barWidth ?? 156, slot * 0.62);
			s.bars.forEach((b, i) => {
				const tone = b.tone ?? (b.on ? 'blue' : null);
				const h = Math.max(4, (b.value / max) * chartH);
				const x = i * slot + (slot - bw) / 2;
				const y = valueH + chartH - h;
				html += `<div class="bar-v${tone ? ` on t-${tone}` : ''}" style="left:${r1(x)}px;top:${r1(y)}px;width:${r1(bw)}px;height:${r1(h)}px"></div>`;
				html += `<div class="bar-value${tone ? ` t-${tone}` : ''}" data-t style="left:${r1(i * slot + slot / 2)}px;top:${r1(y - 56)}px">${fmt(valueText(b))}</div>`;
				html += `<div class="bar-label" data-t style="left:${r1(i * slot + 6)}px;top:${r1(valueH + chartH + 16)}px;width:${r1(slot - 12)}px">${fmt(b.label)}</div>`;
			});
			html += `<div class="bar-base" style="top:${valueH + chartH}px"></div>`;
		}
		return heading(s) + body(`<div class="bars" style="height:${H}px">${html}</div>${s.note ? `<div class="counters-note" data-t>${fmt(s.note)}</div>` : ''}`, { vcenter: false });
	},

	/** Narrowing stages with numbers. stages (2-5): [{ value, label, tone }], note. */
	funnel(s) {
		const H = bodyHeight(s) - (s.note ? 64 : 0);
		const n = s.stages.length;
		const gap = 14;
		const bh = (H - gap * (n - 1)) / n;
		const topW = s.topWidth ?? 1560, botW = s.bottomWidth ?? 620;
		const wAt = y => topW - (topW - botW) * (y / H);
		let svg = '';
		let html = '';
		s.stages.forEach((st, i) => {
			const tone = st.tone ?? (i === n - 1 ? 'red' : 'neutral');
			const y0 = i * (bh + gap), y1 = y0 + bh;
			const w0 = wAt(y0), w1 = wAt(y1);
			svg += `<polygon points="${r1(W / 2 - w0 / 2)},${r1(y0)} ${r1(W / 2 + w0 / 2)},${r1(y0)} ${r1(W / 2 + w1 / 2)},${r1(y1)} ${r1(W / 2 - w1 / 2)},${r1(y1)}" fill="var(--${tone}-tint)" stroke="var(--${tone === 'neutral' ? 'line-strong' : tone})" stroke-width="2.5" stroke-linejoin="round"/>`;
			html += `<div class="fn-stage t-${tone}" data-fit style="left:${r1(W / 2 - w1 / 2 + 20)}px;top:${r1(y0)}px;width:${r1(w1 - 40)}px;height:${r1(bh)}px"><span class="fn-value" data-t>${fmt(st.value)}</span><span class="fn-label" data-t>${fmt(st.label)}</span></div>`;
		});
		return heading(s) + body(`<div class="funnel" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${svg}</svg>${html}</div>${s.note ? `<div class="counters-note" data-t>${fmt(s.note)}</div>` : ''}`, { vcenter: false });
	},

	/** One giant number or word, with an optional brand logo. logo: slug in theme/logos, logoText, icon, value, label,
	 * sub (a pill under it), subTone, tone, align: 'left'. Use bg: 'dark' | 'blue' on the slide for a full-colour page. */
	hero(s) {
		const tone = s.tone ?? 'blue';
		let mark = '';
		if (s.logo) {
			mark = `<div class="hero-logo">${logo(s.logo, s.logoSize ?? 112, s.bg === 'dark' || s.bg === 'blue' ? '#ffffff' : null)}${s.logoText ? `<span class="hero-logo-text" data-t style="color:${s.bg === 'dark' || s.bg === 'blue' ? '#ffffff' : LOGOS[s.logo].hex}">${esc(s.logoText)}</span>` : ''}</div>`;
		} else if (s.icon) {
			mark = `<div class="hero-logo">${iconTile(s.icon, { tone, size: 120 })}</div>`;
		}
		const value = s.value ? `<div class="hero-value t-${tone}" data-t data-autofit="${W}">${fmt(s.value)}</div>` : '';
		const label = s.label ? `<div class="hero-label" data-t>${fmt(s.label)}</div>` : '';
		const sub = s.sub ? `<div class="hero-sub">${pill({ text: s.sub, tone: s.subTone ?? 'red', icon: s.subIcon ?? 'warning', size: 'l', white: s.bg === 'dark' || s.bg === 'blue' })}</div>` : '';
		const inner = `<div class="hero${s.align === 'left' ? ' left' : ''}">${mark}${value}${label}${sub}</div>`;
		if (s.title) {
			return heading(s) + body(inner);
		}
		return body(`${s.eyebrow ? `<div class="st-eyebrow hero-eyebrow" data-t>${fmt(s.eyebrow)}</div>` : ''}${inner}`, { full: true });
	},

	/** Two or three overlapping circles. sets: [{ title, sub, tone }], center: { title, icon } (where they meet). */
	venn(s) {
		const H = bodyHeight(s);
		const n = s.sets.length;
		const cy = H / 2;
		let circles;
		if (n === 2) {
			const r = Math.min(300, H / 2 - 16);
			const d = r * 0.6;
			circles = [{ x: W / 2 - d, y: cy, r, lx: W / 2 - d - r * 0.42, ly: cy }, { x: W / 2 + d, y: cy, r, lx: W / 2 + d + r * 0.42, ly: cy }];
		} else {
			const r = Math.min(216, (H - 24) / 3.1);
			const d = r * 0.62;
			const ccy = (H - (1.5 * d + 2 * r)) / 2 + d + r;
			circles = [-Math.PI / 2, Math.PI / 6, (Math.PI * 5) / 6].map(a => ({
				x: W / 2 + d * Math.cos(a), y: ccy + d * Math.sin(a), r,
				lx: W / 2 + (d + r * 0.5) * Math.cos(a), ly: ccy + (d + r * 0.5) * Math.sin(a),
			}));
		}
		let svg = '';
		let html = '';
		s.sets.forEach((st, i) => {
			const c = circles[i];
			const tone = st.tone ?? stepTone(i);
			svg += `<circle cx="${r1(c.x)}" cy="${r1(c.y)}" r="${r1(c.r)}" fill="var(--${tone})" fill-opacity=".09" stroke="var(--${tone})" stroke-width="3"/>`;
			html += `<div class="venn-label t-${tone}" style="left:${r1(c.lx)}px;top:${r1(c.ly)}px;width:${r1(c.r * (n === 2 ? 0.9 : 0.86))}px"><div class="t" data-t>${fmt(st.title)}</div>${st.sub ? `<div class="s" data-t>${fmt(st.sub)}</div>` : ''}</div>`;
		});
		if (s.center) {
			const ccx = W / 2, ccy = n === 2 ? cy : circles.reduce((a, c) => a + c.y, 0) / 3;
			html += `<div class="venn-center" style="left:${r1(ccx)}px;top:${r1(ccy)}px">${pill({ text: s.center.title, tone: s.center.tone ?? 'blue', icon: s.center.icon, solid: true, size: 'l' })}</div>`;
		}
		return heading(s) + body(`<div class="venn" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${svg}</svg>${html}</div>`, { vcenter: false });
	},

	/** What you see versus what sits under the water. top: { label, items: [text] }, bottom: { label, items: [text] }. */
	iceberg(s) {
		const H = bodyHeight(s);
		const wy = Math.round(H * 0.34);
		const cx = W / 2 + 120;
		const tip = [[cx - 210, wy], [cx - 120, wy - 120], [cx - 50, wy - 150], [cx + 10, wy - 205], [cx + 80, wy - 140], [cx + 150, wy - 100], [cx + 215, wy]];
		const shade = [[cx + 10, wy - 205], [cx + 80, wy - 140], [cx + 150, wy - 100], [cx + 215, wy], [cx + 40, wy]];
		const mass = [[cx - 215, wy], [cx - 430, wy + 70], [cx - 580, wy + 190], [cx - 540, wy + 300], [cx - 340, H - 18], [cx + 40, H - 6], [cx + 400, H - 40], [cx + 580, wy + 240], [cx + 620, wy + 120], [cx + 430, wy + 40], [cx + 215, wy]];
		const pts = arr => arr.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');
		let svg = `<rect x="0" y="${wy}" width="${W}" height="${H - wy}" fill="var(--blue-tint)"/>`;
		svg += `<polygon points="${pts(mass)}" fill="#d4e6fa" stroke="#a9c9ee" stroke-width="3" stroke-linejoin="round"/>`;
		svg += `<polygon points="${pts(tip)}" fill="#ffffff" stroke="#a9c9ee" stroke-width="3" stroke-linejoin="round"/><polygon points="${pts(shade)}" fill="#e6f0fb"/>`;
		svg += `<line x1="0" y1="${wy}" x2="${W}" y2="${wy}" stroke="var(--blue)" stroke-width="3" stroke-dasharray="14 10"/>`;
		const chips = (items, tone, white) => items.map(t => pill({ text: t, tone, size: 'l', white })).join('');
		let html = `<div class="ice-side" style="top:${wy - 88}px"><div class="lbl" data-t>${fmt(s.top.label)}</div></div>`;
		html += `<div class="ice-side" style="top:${wy + 26}px"><div class="lbl" style="color:var(--blue)" data-t>${fmt(s.bottom.label)}</div></div>`;
		html += `<div class="ice-top" style="left:${cx}px;top:${wy - 76}px">${chips(s.top.items, 'blue', false)}</div>`;
		html += `<div class="ice-bottom" style="left:${cx - 440}px;top:${wy + 70}px;width:900px;height:${H - wy - 100}px">${chips(s.bottom.items, 'blue', true)}</div>`;
		return heading(s) + body(`<div class="iceberg" style="height:${H}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${svg}</svg>${html}</div>`, { vcenter: false });
	},

	/** Pictures: 1-6 frames (screenshots, video stills, renders) with captions, or groups of stacked strips.
	 * items: [{ src, alt, caption, sub, kind: 'image'|'video'|'website'|'motion'|'cad'|'svg', fit: 'cover'|'contain', placeholder }],
	 * cols, height, groups: [{ title, tone, icon, items: [{ src, alt }] }] (stacked at one scale, e.g. chat lines). */
	media(s) {
		const H = bodyHeight(s);
		const rel = file => path.relative(path.join(ROOT, 'build'), file);
		const KIND_ICON = { image: 'image', video: 'videoClip', website: 'globe', motion: 'film', cad: 'cube', svg: 'shapes' };
		const frame = (it, w, h, fit) => {
			const file = it.src ? path.join(ROOT, it.src) : null;
			const play = it.kind === 'video' || it.kind === 'motion' ? `<span class="md-play">${ic('play', 44)}</span>` : '';
			if (file && fs.existsSync(file)) {
				return `<div class="md-frame" style="width:${r1(w)}px;height:${r1(h)}px"><img src="${rel(file)}" alt="${esc(it.alt ?? '')}" style="object-fit:${it.fit ?? fit}">${play}</div>`;
			}
			return `<div class="md-frame missing" data-missing="${esc(it.src ?? '')}" style="width:${r1(w)}px;height:${r1(h)}px"><div class="ph">${ic(KIND_ICON[it.kind] ?? 'image', 64, 'var(--faint)')}<div data-t>${fmt(it.placeholder ?? it.alt ?? it.caption ?? 'Picture')}</div></div></div>`;
		};
		if (s.groups) {
			const headH = 56, headGap = 14, itemGap = 14, groupGap = 30;
			const sizes = s.groups.map(g => g.items.map(it => {
				const file = path.join(ROOT, it.src);
				return fs.existsSync(file) ? pngSize(file) : { width: 2400, height: 200 };
			}));
			const fixed = s.groups.reduce((a, g) => a + headH + headGap + itemGap * (g.items.length - 1), 0) + groupGap * (s.groups.length - 1);
			const sumH = sizes.flat().reduce((a, z) => a + z.height, 0);
			const maxW = Math.max(...sizes.flat().map(z => z.width));
			const k = Math.min(s.scale ?? 0.62, (H - fixed) / sumH, W / maxW);
			const groups = s.groups.map((g, gi) => {
				const tone = g.tone ?? stepTone(gi);
				const items = g.items.map((it, ii) => {
					const z = sizes[gi][ii];
					return frame(it, z.width * k, z.height * k, 'cover');
				}).join('');
				return `<div class="md-group" style="gap:${itemGap}px"><div style="height:${headH}px;display:flex;align-items:center">${pill({ text: g.title, tone, icon: g.icon, size: 'l' })}</div>${items}</div>`;
			}).join('');
			return heading(s) + body(`<div class="md-stack" style="gap:${groupGap}px">${groups}</div>`);
		}
		const n = s.items.length;
		const cols = s.cols ?? (n <= 3 ? n : n === 4 ? 2 : 3);
		const rows = Math.ceil(n / cols);
		const gap = 30;
		const capH = s.items.some(it => it.caption) ? (s.items.some(it => it.sub) ? 92 : 54) : 0;
		const cellW = (W - gap * (cols - 1)) / cols;
		const frameH = Math.min(s.height ?? Infinity, (H - rows * capH - gap * (rows - 1)) / rows);
		const frameW = n === 1 ? Math.min(W, s.width ?? frameH * (s.aspect ?? 16 / 9)) : cellW;
		const cells = s.items.map(it => `<figure class="md-cell" style="width:${r1(frameW)}px">${frame(it, frameW, frameH, n === 1 ? 'contain' : 'cover')}${it.caption ? `<figcaption style="height:${capH}px"><div class="t" data-t>${fmt(it.caption)}</div>${it.sub ? `<div class="s" data-t>${fmt(it.sub)}</div>` : ''}</figcaption>` : ''}</figure>`).join('');
		return heading(s) + body(`<div class="md-grid" style="gap:${gap}px;max-width:${r1(cols * frameW + (cols - 1) * gap + 1)}px">${cells}</div>`);
	},

	/** A terminal with commands and their output. lines: [{ cmd } | { out, tone } | { comment }], window, width, fontSize,
	 * callouts (<= 3). */
	terminal(s) {
		const width = s.width ?? (s.callouts?.length ? 1080 : 1360);
		const lines = s.lines.map(l => {
			if (l.cmd !== undefined) {
				return `<div class="tx-line cmd"><span class="tx-ps">${esc(l.prompt ?? '$')}</span><span data-t>${esc(l.cmd)}</span></div>`;
			}
			if (l.comment !== undefined) {
				return `<div class="tx-line comment" data-t># ${esc(l.comment)}</div>`;
			}
			return `<div class="tx-line out${l.tone ? ` t-${l.tone}` : ''}" data-t>${esc(l.out ?? '')}</div>`;
		}).join('');
		const win = `<div class="txwin" data-fit style="width:${width}px"><div class="tx-bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span class="wt" data-t>${esc(s.window ?? 'Terminal')}</span></div><div class="tx-body" style="font-size:${s.fontSize ?? 26}px">${lines}</div></div>`;
		return heading(s) + body(`<div class="ui-wrap${s.callouts?.length ? '' : ' center'}">${win}${notesList(s.callouts)}</div>`);
	},

	/** What happened: a real event told in 3-5 beats on a timeline, with the outcome on the right. Use it BEFORE the slide
	 * that draws the point, so nobody has to know the story already.
	 * who: { icon, text } (who it happened to), beats (3-5): [{ time, text (<= 14 words), icon, tone }],
	 * outcome: { label (small caps, default 'Outcome'), value (big, <= 7 chars), text (<= 16 words), pill, pillTone, tone }.
	 * look: 'road' | 'number' | 'panels' | 'split' draws the same story full page (see STORY_LOOKS); no look = the classic
	 * list with the outcome on the right. */
	story(s) {
		if (s.look) {
			if (!STORY_LOOKS[s.look]) {
				throw new Error(`Unknown story look "${s.look}" on ${s.id}. Known looks: ${Object.keys(STORY_LOOKS).join(', ')}`);
			}
			return STORY_LOOKS[s.look](s);
		}
		const tone = s.outcome?.tone ?? 'red';
		const who = s.who ? `<div class="story-who">${pill({ text: s.who.text, icon: s.who.icon ?? 'building', tone: 'neutral', size: 'm' })}</div>` : '';
		const beats = s.beats.map((b, i) => {
			const bt = b.tone ?? (i === s.beats.length - 1 ? tone : 'neutral');
			return `<div class="beat t-${bt}"><span class="beat-dot">${ic(b.icon ?? 'circle', 26)}</span><div class="beat-body">${b.time ? `<div class="beat-time" data-t>${fmt(b.time)}</div>` : ''}<div class="beat-text" data-t>${fmt(b.text)}</div></div></div>`;
		}).join('');
		let outcome = '';
		if (s.outcome) {
			const o = s.outcome;
			outcome = `<div class="story-outcome t-${tone}" data-fit><div class="lbl" data-t>${fmt(o.label ?? 'Outcome')}</div>${o.value ? `<div class="story-value" data-t data-autofit="470">${fmt(o.value)}</div>` : ''}${o.text ? `<div class="story-text" data-t>${fmt(o.text)}</div>` : ''}${o.pill ? `<div class="story-pill">${pill({ text: o.pill, tone: o.pillTone ?? 'neutral', icon: o.pillIcon, size: 'm', white: true })}</div>` : ''}</div>`;
		}
		return heading(s) + body(`<div class="story"><div class="story-left">${who}<div class="story-beats">${beats}</div></div>${outcome}</div>`);
	},

	/** A row of 2-5 big icons with one to three words each. items: [{ icon, title, sub, tone }], arrows: true, note. */
	icons(s) {
		const n = s.items.length;
		const size = s.size ?? (n <= 3 ? 176 : n === 4 ? 156 : 136);
		const items = s.items.map((it, i) => {
			const tone = it.tone ?? stepTone(i);
			const el = `<div class="icons-item t-${tone}"><span class="icons-circle" style="width:${size}px;height:${size}px">${ic(it.icon, Math.round(size * 0.46))}</span><div class="icons-title" data-t>${fmt(it.title)}</div>${it.sub ? `<div class="icons-sub" data-t>${fmt(it.sub)}</div>` : ''}</div>`;
			return i < n - 1 && s.arrows ? `${el}<div class="icons-arrow" style="margin-top:${size / 2 - 12}px">${arrowSvg(64)}</div>` : el;
		}).join('');
		return heading(s) + body(`<div class="icons${s.arrows ? ' arrows' : ''}">${items}</div>${s.note ? `<div class="counters-note icons-note" data-t>${fmt(s.note)}</div>` : ''}`);
	},

	/** Who does what: steps left to right in 2-3 lanes (e.g. People and AI), so you see which steps a person does.
	 * lanes: [{ id, title, icon, tone }], steps: [{ lane (a lane id; null = across all lanes, e.g. the release), icon, title,
	 * sub }], hops: ['', 'label on the line from step 1 to step 2', ...]. */
	lanes(s) {
		const H = bodyHeight(s);
		const L = s.lanes.length;
		const labelW = 230;
		const laneGap = 18;
		const laneH = (H - laneGap * (L - 1)) / L;
		const n = s.steps.length;
		const slot = (W - labelW) / n;
		const dot = 96;
		const laneTop = j => j * (laneH + laneGap);
		const pos = s.steps.map((st, i) => {
			const j = st.lane == null ? -1 : s.lanes.findIndex(l => l.id === st.lane);
			if (st.lane != null && j < 0) {
				throw new Error(`lanes: step "${st.title}" names an unknown lane "${st.lane}" on ${s.id}`);
			}
			const cy = j < 0 ? H / 2 - 24 : laneTop(j) + laneH * 0.42;
			return { x: labelW + slot * i + slot / 2, y: cy, j };
		});
		const bands = s.lanes.map((l, j) => `<div class="ln-band t-${l.tone ?? stepTone(j)}" style="top:${r1(laneTop(j))}px;height:${r1(laneH)}px"><div class="ln-label" style="width:${labelW - 30}px">${ic(l.icon ?? 'person', 40)}<span data-t>${fmt(l.title)}</span></div></div>`).join('');
		let svg = '';
		pos.forEach((p, i) => {
			if (i === 0) {
				return;
			}
			const a = pos[i - 1];
			const x1 = a.x + dot / 2 + 10, x2 = p.x - dot / 2 - 14;
			let d;
			if (Math.abs(a.y - p.y) < 1) {
				d = `M ${r1(x1)} ${r1(a.y)} L ${r1(x2)} ${r1(p.y)}`;
			} else {
				// Change lanes between the two columns, where there is no text: right, down (or up), right.
				const xm = (a.x + p.x) / 2;
				const r = 26 * Math.sign(p.y - a.y);
				d = `M ${r1(x1)} ${r1(a.y)} H ${r1(xm - 26)} Q ${r1(xm)} ${r1(a.y)} ${r1(xm)} ${r1(a.y + r)} V ${r1(p.y - r)} Q ${r1(xm)} ${r1(p.y)} ${r1(xm + 26)} ${r1(p.y)} H ${r1(x2)}`;
			}
			svg += `<path d="${d}" fill="none" stroke="var(--connector)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${arrowHead(x2, p.y, x2 - 30, p.y, 'var(--connector)', 4)}`;
		});
		const hops = (s.hops ?? []).map((h, i) => {
			if (!h || !pos[i + 1]) {
				return '';
			}
			const a = pos[i], b = pos[i + 1];
			return `<div class="ln-hop" style="left:${r1((a.x + b.x) / 2)}px;top:${r1((a.y + b.y) / 2 - 46)}px" data-t>${fmt(h)}</div>`;
		}).join('');
		const steps = s.steps.map((st, i) => {
			const p = pos[i];
			const tone = p.j < 0 ? (st.tone ?? 'blue') : (st.tone ?? s.lanes[p.j].tone ?? stepTone(p.j));
			return `<div class="ln-step t-${tone}${p.j < 0 ? ' across' : ''}" style="left:${r1(p.x - slot / 2 + 8)}px;top:${r1(p.y - dot / 2)}px;width:${r1(slot - 16)}px"><span class="ln-dot" style="width:${dot}px;height:${dot}px">${ic(st.icon ?? 'circle', 44)}</span><div class="ln-title" data-t>${fmt(st.title)}</div>${st.sub ? `<div class="ln-sub" data-t>${fmt(st.sub)}</div>` : ''}</div>`;
		}).join('');
		return heading(s) + body(`<div class="lanes" style="height:${H}px">${bands}<svg class="rd-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>${hops}${steps}</div>`, { vcenter: false });
	},
};
