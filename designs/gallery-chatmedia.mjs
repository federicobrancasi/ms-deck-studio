// A gallery for inspiration (the voice-and-pen chat window world): read it for technique: sound arcs that start at the
// speaker they come from, real demo frames framed in drawn props with a ring on the spot, and a click-by-click machine
// whose every step stays bright. A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as
// they are.
// The drawings of examples/chat-media.mjs, a talk about three open pull requests in microsoft/vscode that let Copilot
// chat read answers aloud, generate images and teach the VS Code pet new moves. The world is the chat window drawn
// big; the recurring object is the answer card (answerCard): a white card with the assistant's mark and the toolbar
// under the answer (speaker, retry, copy, thumbs). Pictures are frames from the PRs' public demo videos and the pet
// sprite (assets/gallery-chatmedia/, see its NOTICE.md); the product's words and pictures come in through each
// slide's ui field.
//   gcm-cover    cover: the answer card with sound arcs from its speaker, a pen finishing its picture, the pet on the input
//   gcm-three    three changes: the answer card with three numbered spots, one card per change on the right
//   gcm-screen   a real frame in a monitor, a laptop or a wide strip, a ring on the spot, numbered points
//   gcm-pipe     a four-station machine, click by click: answer only, cleaned, cut short first, played while fetching
//   gcm-plug     one adapter file between an engine and a wall plate with two sockets: today and next
//   gcm-fork     a tool that sends the picture to you and only text back to the model
//   gcm-teach    a slash request, two tools, a strip of real frames, three big limits, four more results
//   gcm-react    three panels, click by click: teach a reaction, say the word, the sprite reacts first
//   gcm-close    blue close: branches into main, each stopped at a gate with what it still needs
import { esc, fmt, ic, pill, heading, body, bodyHeight, msLogo, logo, asset, W, r1, STYLE, t, at, layer, mix, laptop, monitor } from '../src/kit.mjs';

const DIR = 'assets/gallery-chatmedia/';
/** A picture path: a bare file name is looked up in DIR, a path starting with assets/ is used as it is. */
const full = src => (src.startsWith('assets/') ? src : DIR + src);
const SW = STYLE.stroke;
const STEEL = '#c9ccd3';
const UI_DARK = '#171717'; // the editor background in the demo frames, so the cropped frames sit on it seamlessly
const O = (w = SW) => `stroke="var(--ink)" stroke-width="${w}" stroke-linejoin="round"`;
const svgAbs = (w, h, inner, x = 0, y = 0) => `<svg style="position:absolute;left:${r1(x)}px;top:${r1(y)}px;overflow:visible" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;

/** The chat window's own words and pictures, from the slide's ui field: { assistant (the name on an answer), agent
 * (the mode), placeholder, save, slash (a slash command), picture (an image an answer holds), pictureSize: [w, h],
 * pet (a 12 x 12 sprite sitting on the input), reaction (a frame of the sprite reacting), reactionSize: [w, h] }.
 * Pictures are file names in assets/gallery-chatmedia/ or paths under assets/. Every render calls useUi(s) first, so
 * the shared helpers read the current slide's words. */
let UI = {};
const useUi = s => {
	UI = { assistant: 'Assistant', agent: 'Agent', placeholder: 'Ask anything', save: 'Save', slash: '/teach', picture: null, pictureSize: [4, 3], pet: null, reaction: null, reactionSize: [290, 340], ...(s.ui ?? {}) };
};
/** Height over width of ui.picture. */
const picRatio = () => UI.pictureSize[1] / UI.pictureSize[0];

/** A picture (a file name in assets/gallery-chatmedia/, or a path under assets/) at an absolute position; a dashed box if the file is missing. */
function pic(src, x, y, w, h, { fit = 'cover', pixel = false, pos = 'center', radius = 0, border = '' } = {}) {
	const u = src ? asset(full(src)) : null;
	const box = `position:absolute;${at(x, y, w, h)};border-radius:${radius}px;box-sizing:border-box;${border ? `border:${border};` : ''}`;
	return u
		? `<img src="${esc(u)}" alt="" style="${box}object-fit:${fit};object-position:${pos};${pixel ? 'image-rendering:pixelated;' : ''}">`
		: `<div style="${box}background:var(--surface);border:2px dashed var(--line-strong)"></div>`;
}

/** A 12 x 12 pixel sprite (ui.pet), its bottom centre at (cx, bottom); size is rounded to a multiple of 12 so every
 * sprite pixel stays square. Draws nothing when the slide gives no sprite. */
function pet(cx, bottom, size = 96, src = UI.pet) {
	if (!src) {
		return '';
	}
	const s = Math.max(12, Math.round(size / 12) * 12);
	return pic(src, Math.round(cx - s / 2), Math.round(bottom - s), s, s, { fit: 'fill', pixel: true });
}

/** Sound arcs centred on a speaker at (cx, cy), opening towards dir (degrees, 0 = right, 180 = left). */
function arcs(cx, cy, { dir = 0, n = 3, r0 = 40, step = 30, spread = 36, tone = 'blue', w = 6, opacity = 1 } = {}) {
	let g = '';
	for (let i = 0; i < n; i++) {
		const r = r0 + i * step, a0 = (dir - spread) * Math.PI / 180, a1 = (dir + spread) * Math.PI / 180;
		const p = a => [r1(cx + r * Math.cos(a)), r1(cy + r * Math.sin(a))];
		const [x0, y0] = p(a0), [x1, y1] = p(a1);
		g += `<path d="M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}" fill="none" stroke="var(--${tone})" stroke-width="${w}" stroke-linecap="round" opacity="${opacity}"/>`;
	}
	return g;
}

/** A fountain pen whose nib touches (tx, ty), its body running away at angle deg: a steel nib with a slit and a
 * breather hole, a black grip, a purple barrel with a clip, a black end cap. */
function pen(tx, ty, deg, len = 330) {
	const b0 = 104, b1 = len - 44;
	return `<g transform="translate(${r1(tx)} ${r1(ty)}) rotate(${deg})">`
		+ `<path d="M 0 0 L 62 -17 L 62 17 Z" fill="${STEEL}" ${O(3)}/><path d="M 4 0 H 46" stroke="var(--ink)" stroke-width="2.5"/><circle cx="46" cy="0" r="4" fill="var(--ink)"/>`
		+ `<rect x="60" y="-19" width="46" height="38" rx="6" fill="var(--ink)"/>`
		+ `<rect x="${b0}" y="-23" width="${b1 - b0}" height="46" rx="10" fill="var(--purple)" ${O(3)}/>`
		+ `<path d="M ${b0 + 14} -12 H ${b1 - 14}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".35"/>`
		+ `<rect x="${b1 - 150}" y="-33" width="130" height="12" rx="5" fill="${STEEL}" ${O(2.5)}/><circle cx="${b1 - 150}" cy="-27" r="7" fill="${STEEL}" ${O(2.5)}/>`
		+ `<rect x="${b1 - 6}" y="-23" width="50" height="46" rx="18" fill="var(--ink)"/>`
		+ `</g>`;
}

/** Shared CSS for every design of this deck, scoped to the design's own class. */
const kitCss = n => `
.${n} .${n}-card { position: absolute; background: #fff; border: ${SW}px solid var(--ink); border-radius: ${STYLE.radius}px; box-sizing: border-box; }
.${n} .${n}-who { position: absolute; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.${n} .${n}-bar { position: absolute; height: 12px; border-radius: 6px; background: #dfe2e8; }
.${n} .${n}-btn { position: absolute; display: grid; place-items: center; border-radius: 10px; color: #5f6168; }
.${n} .${n}-btn.on { background: var(--blue); color: #fff; box-shadow: 0 0 0 5px var(--blue-tint); }
.${n} .${n}-input { position: absolute; background: #fff; border: ${SW}px solid var(--ink); border-radius: ${STYLE.radius}px; box-sizing: border-box; }
.${n} .${n}-ph { position: absolute; font-size: 24px; color: var(--muted); white-space: nowrap; }
.${n} .${n}-ask { position: absolute; font-size: 24px; line-height: 1.3; color: var(--ink); }
.${n} .${n}-slash { display: inline-block; padding: 0 8px; margin-right: 6px; border-radius: 6px; background: var(--blue-tint); color: var(--blue); font-weight: 600; }
.${n} .${n}-mode { position: absolute; display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 600; color: var(--purple); white-space: nowrap; }
.${n} .${n}-send { position: absolute; display: grid; place-items: center; border-radius: 10px; background: var(--blue); color: #fff; }
.${n} .${n}-num { position: absolute; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; background: var(--fg); color: #fff; font-size: 24px; font-weight: 700; box-shadow: 0 0 0 4px #fff; }
.${n} .${n}-cap { position: absolute; font-size: 26px; font-weight: 600; color: var(--ink); line-height: 1.25; }
.${n} .${n}-sub { position: absolute; font-size: 22px; color: var(--body); line-height: 1.3; }
.${n} .${n}-lbl { position: absolute; font-size: 17px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.${n} .${n}-mono { font-family: var(--mono); }
.${n} .${n}-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 12px; border-radius: 999px; font-size: 18px; font-weight: 700; background: var(--tint); color: var(--fg); white-space: nowrap; }
.${n} .${n}-dark { position: absolute; background: ${UI_DARK}; border-radius: 10px; overflow: hidden; }
`;

/** The answer card, the deck's recurring object: the Copilot mark and name, a picture (optional), text lines, and the
 * toolbar under the answer (speaker, retry, copy, thumbs up, thumbs down). speaker: 'off' | 'on'.
 * Returns { html, speaker: { cx, cy } } (the speaker button's centre). */
function answerCard(n, x, y, w, h, { picture = null, picW = 0, picH = 0, bars = [0.9, 0.7], barsRight = false, speaker = 'off', toolbar = true, label = UI.assistant } = {}) {
	let html = `<div class="${n}-card" style="${at(x, y, w, h)}"></div>`;
	html += `<div class="${n}-who" style="${at(x + 24, y + 18, w - 48, 40)}">${logo('githubcopilot', 30)}${t('nolint', '', esc(label), { tag: 'span' })}</div>`;
	let ty = y + 74;
	if (picture) {
		html += pic(picture, x + 26, ty, picW, picH, { radius: 10, border: '3px solid var(--ink)' });
	}
	const bx = barsRight && picture ? x + 26 + picW + 26 : x + 26, bw = (barsRight && picture ? w - picW - 78 : w - 52);
	let by = barsRight || !picture ? ty + 6 : ty + picH + 22;
	for (const f of bars) {
		html += `<div class="${n}-bar" style="${at(bx, by, bw * f)}"></div>`;
		by += 28;
	}
	const sp = { cx: x + 26 + 22, cy: y + h - 34 };
	if (toolbar) {
		['speaker', 'repeat', 'copy', 'thumbUp', 'thumbDown'].forEach((name, i) => {
			const on = i === 0 && speaker === 'on';
			html += `<div class="${n}-btn${on ? ' on' : ''}" style="${at(x + 26 + i * 54, y + h - 56, 44, 44)}">${ic(name, 26)}</div>`;
		});
	}
	return { html, speaker: sp };
}

/** The chat input with the pet sitting on its top edge, as in the editor. ask: what is typed (a '/pet' style slash
 * command goes in slash), or a placeholder. Returns { html, slash: { x, y, w } } (the slash chip's box, roughly). */
function chatInput(n, x, y, w, h, { ask = '', slash = '', placeholder = UI.placeholder, petX = null, petSize = 72, petSrc = UI.pet, showPet = true } = {}) {
	let html = '';
	if (showPet) {
		html += pet(petX ?? x + w - 90, y + 2, petSize, petSrc);
	}
	html += `<div class="${n}-input" style="${at(x, y, w, h)}"></div>`;
	if (ask || slash) {
		html += t(`${n}-ask`, at(x + 24, y + 18, w - 48), `${slash ? `<span class="${n}-slash nolint">${esc(slash)}</span>` : ''}${fmt(ask)}`);
	} else {
		html += t(`${n}-ph nolint`, at(x + 24, y + 20, w - 48), esc(placeholder));
	}
	html += `<div class="${n}-mode" style="${at(x + 24, y + h - 46)}">${ic('bot', 22)}${t('nolint', '', esc(UI.agent), { tag: 'span' })}</div>`;
	html += `<div class="${n}-send" style="${at(x + w - 60, y + h - 54, 40, 40)}">${ic('send', 22)}</div>`;
	return { html, slash: { x: x + 24, y: y + 18, w: slash.length * 14 + 16 } };
}

/** A numbered badge centred on (cx, cy), in a tone. */
const num = (n, cx, cy, k, tone = 'blue') => t(`${n}-num t-${tone} nolint`, at(cx - 23, cy - 23), String(k));

/** The left half of a cover: eyebrow, title, sub, speaker, pills. */
function coverLeft(s, width = 820) {
	const sp = s.speaker ? `<div class="tf-speaker"><span class="tf-avatar" data-t>${esc(s.speaker.initials)}</span><span class="tf-name" data-t>${fmt(s.speaker.name)}</span><span class="tf-role" data-t>${fmt(s.speaker.role)}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left" style="width:${width}px"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="st-sub" style="margin-top:28px" data-t>${fmt(s.sub)}</div>` : ''}${sp}${pills}</div>`;
}

/** gcm-screen's strip: a wide real frame across the top in a dark rounded frame, a ring on the spot, and the points in
 * a row under it, each with its number. */
function screenStrip(n, s, H) {
	const [iw, ih] = s.size, w = W, h = Math.round(w * ih / iw);
	let html = `<div class="${n}-dark" style="${at(0, 0, w, h)};border:${SW}px solid var(--ink);box-sizing:border-box;border-radius:16px">${pic(s.src, 0, 0, w - 2 * SW, h - 2 * SW, { fit: 'cover' })}</div>`;
	const k = (w - 2 * SW) / iw;
	if (s.ring) {
		const [rx, ry, rw, rh] = s.ring, x = SW + rx * k - 6, y = SW + ry * k - 6, rW = rw * k + 12, rH = rh * k + 12;
		html += `<div class="${n}-ring" style="${at(x, y, rW, rH)}"></div>`;
	}
	const pts = (s.points ?? []).slice(0, 3), cw = (W - (pts.length - 1) * 48) / pts.length, py = h + 70;
	pts.forEach((pt, i) => {
		const x = i * (cw + 48);
		html += num(n, x + 23, py + 23, i + 1, pt.tone ?? 'blue');
		html += t(`${n}-nt`, at(x + 70, py, cw - 70), fmt(pt.title));
		if (pt.text) {
			html += t(`${n}-nx`, at(x + 70, py + 46, cw - 70), fmt(pt.text));
		}
	});
	return html;
}

const bareCss = n => `.${n} { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }${kitCss(n)}`;
const bodyCss = n => `.${n} { position: relative; width: 1728px; }${kitCss(n)}`;

export const designs = {
	/** Cover: the title on the left; on the right the chat panel: the answer card holding the real generated picture,
	 * a pen whose nib is finishing the picture's frame, the speaker button lit with sound arcs leaving it towards the
	 * title, and the chat input below with the real pet sitting on it. Fields: eyebrow, title, sub, speaker, pills, ui (picture, pictureSize, pet, assistant, placeholder, agent). */
	'gcm-cover': {
		bare: true,
		css: bareCss('gcm-cover'),
		render(s) {
			useUi(s);
			const n = 'gcm-cover';
			const px = 1130, pw = 694, py = 150, ph = 820;
			let g = `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="28" fill="var(--surface)"/>`;
			const cx = px + 30, cw = pw - 60, cy = py + 34, chh = 500;
			const picW = 420, picH = Math.round(420 * picRatio());
			const A = answerCard(n, cx, cy, cw, chh, { picture: UI.picture, picW, picH, bars: [0.92, 0.62], speaker: 'on' });
			g += arcs(A.speaker.cx, A.speaker.cy, { dir: 180, r0: 58, step: 30, spread: 24, w: 7 });
			// The pen: its nib on the picture's bottom-right corner, where the purple frame line it is drawing ends.
			const nx = cx + 26 + picW, ny = cy + 74 + picH;
			const ink = `<path d="M ${cx + 26 + 6} ${ny} H ${nx}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round"/>`;
			const I = chatInput(n, cx, py + ph - 34 - 150, cw, 150, { petX: cx + cw - 110, petSize: 96 });
			return `<div class="${n}">${coverLeft(s, 820)}${svgAbs(1920, 1080, g)}${A.html}${svgAbs(1920, 1080, ink + pen(nx, ny, -45, 270))}${I.html}${msLogo()}</div>`;
		},
	},

	/** The three PRs: on the left the chat panel (the answer card with the real picture, its toolbar, the input with a
	 * /pet command and the pet), with numbered badges on the three new ways in; on the right one card per PR: number,
	 * name, PR ref and a Draft tag, the way in, and the size. Fields: eyebrow, title, ui (picture, pet, slash), prs (3): [{ name, ref, way,
	 * wayIcon, size }], ask (the input text after the slash), slash (default ui.slash), prTag (the text of the PR tag). */
	'gcm-three': {
		css: bodyCss('gcm-three') + `
.gcm-three .gcm-three-pr { position: absolute; background: #fff; border: 2px solid var(--line-strong); border-radius: ${STYLE.radius}px; box-sizing: border-box; }
.gcm-three .gcm-three-name { position: absolute; font-size: 32px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.gcm-three .gcm-three-meta { position: absolute; display: flex; align-items: center; gap: 14px; font-size: 22px; color: var(--body); white-space: nowrap; }
.gcm-three .gcm-three-way { position: absolute; display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 600; color: var(--blue); white-space: nowrap; }
`,
		render(s) {
			useUi(s);
			const n = 'gcm-three', H = bodyHeight(s);
			let html = '', g = `<rect x="0" y="0" width="960" height="${H}" rx="28" fill="var(--surface)"/>`;
			const picW = 330, picH = Math.round(330 * picRatio());
			const A = answerCard(n, 36, 30, 888, 396, { picture: UI.picture, picW, picH, barsRight: true, bars: [0.95, 0.8, 0.9, 0.55, 0.85, 0.7], speaker: 'on' });
			html += A.html;
			const I = chatInput(n, 36, H - 30 - 132, 888, 132, { slash: s.slash ?? UI.slash, ask: s.ask ?? '', petX: 830, petSize: 72 });
			html += I.html;
			// The badges sit on the three new ways in: the speaker button, the picture, the slash command.
			html += num(n, A.speaker.cx + 30, A.speaker.cy - 30, 1) + num(n, 62 + picW - 4, 104 - 4, 2) + num(n, 36, I.slash.y + 16, 3);
			const prs = (s.prs ?? []).slice(0, 3), ch = 200, gap = (H - 3 * ch) / 2;
			prs.forEach((p, i) => {
				const x = 1008, y = i * (ch + gap), w = W - x;
				html += `<div class="${n}-pr" style="${at(x, y, w, ch)}"></div>`;
				html += num(n, x + 50, y + 52, i + 1);
				html += t(`${n}-name nolint`, at(x + 92, y + 28, w - 120, 44), fmt(p.name));
				html += `<div class="${n}-meta" style="${at(x + 92, y + 82, w - 120, 34)}">${t(`${n}-mono nolint`, '', esc(p.ref), { tag: 'span' })}${t(`${n}-tag t-orange nolint`, '', `${ic('pr', 18)}${esc(s.prTag ?? 'Draft')}`, { tag: 'span' })}${t('nolint', '', esc(p.size), { tag: 'span' })}</div>`;
				html += t(`${n}-way`, at(x + 92, y + 132, w - 120, 40), `${ic(p.wayIcon ?? 'cursor', 26)}<span>${fmt(p.way)}</span>`);
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A real frame on a monitor or a laptop standing on a desk, a ring on the spot that matters (in the picture's own
	 * pixels) with a numbered badge, and up to three numbered notes on the right (the first is the ring's).
	 * Fields: eyebrow, title, src (a 16:9 PNG for the monitor, 16:10 for the laptop), size: [w, h] (its pixels),
	 * device: 'monitor' | 'laptop' | 'strip' (a wide frame across the top, points in a row under it), ring: [x, y, w, h], points: [{ title, text, tone }]. */
	'gcm-screen': {
		css: bodyCss('gcm-screen') + `
.gcm-screen .gcm-screen-ring { position: absolute; border: 6px solid var(--blue); border-radius: 14px; box-shadow: 0 0 0 4px #fff; box-sizing: border-box; }
.gcm-screen .gcm-screen-nt { position: absolute; font-size: 30px; font-weight: 700; color: var(--ink); line-height: 1.2; }
.gcm-screen .gcm-screen-nx { position: absolute; font-size: 24px; color: var(--body); line-height: 1.35; }
`,
		render(s) {
			useUi(s);
			const n = 'gcm-screen', H = bodyHeight(s);
			if (s.device === 'strip') {
				return heading(s) + body(`<div class="${n}" style="height:${H}px">${screenStrip(n, s, H)}</div>`, { vcenter: false });
			}
			const dev = s.device === 'laptop'
				? laptop({ x: 84, y: 40, w: 880, src: full(s.src) })
				: monitor({ x: 10, y: 0, w: 940, src: full(s.src) });
			const desk = (s.device === 'laptop' ? 40 : 0) + dev.h;
			let g = `<path d="M 0 ${r1(desk)} H ${s.device === 'laptop' ? 1060 : 980}" stroke="var(--line-strong)" stroke-width="${SW}" stroke-linecap="round"/>`;
			let html = dev.html;
			const [iw] = s.size, k = dev.screen.w / iw;
			if (s.ring) {
				const [rx, ry, rw, rh] = s.ring, x = dev.screen.x + rx * k - 6, y = dev.screen.y + ry * k - 6, w = rw * k + 12, h = rh * k + 12;
				html += `<div class="${n}-ring" style="${at(x, y, w, h)}"></div>` + (s.ringBadge === 'left' ? num(n, x - 30, y + h / 2, 1) : num(n, x + w + 4, y - 4, 1));
			}
			const notes = (s.points ?? []).slice(0, 3), nx = 1040, nh = 150, ny0 = (H - notes.length * nh - (notes.length - 1) * 40) / 2;
			notes.forEach((nt, i) => {
				const y = ny0 + i * (nh + 40);
				html += num(n, nx + 23, y + 23, i + 1, nt.tone ?? 'blue');
				html += t(`${n}-nt`, at(nx + 70, y, W - nx - 70), `${fmt(nt.title)}`);
				if (nt.text) {
					html += t(`${n}-nx`, at(nx + 70, y + 46, W - nx - 70), fmt(nt.text));
				}
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** How read aloud works, as four stations left to right with the answer travelling through them (click by click,
	 * one station per click; every station stays bright): 1 only the answer (the step narration is dropped), 2 cleaned
	 * (emoji and markdown struck out), 3 cut into pieces (the first one short), 4 played while the next piece is
	 * fetched (two lanes) out of a speaker. Fields: eyebrow, title, stations (4): [{ title, sub }], lanes: [fetch,
	 * play], rate (e.g. '24 kHz'), start (the label where the sound starts), clicks, ui (assistant). */
	'gcm-pipe': {
		clicks: true,
		css: bodyCss('gcm-pipe') + `
.gcm-pipe .gcm-pipe-later { opacity: 0; }
.gcm-pipe .gcm-pipe-step { position: absolute; display: flex; align-items: center; gap: 8px; font-size: 18px; color: var(--muted); white-space: nowrap; }
.gcm-pipe .gcm-pipe-md { position: absolute; display: grid; place-items: center; font-family: var(--mono); font-size: 30px; font-weight: 700; color: var(--ink); background: var(--surface); border: 2px solid var(--line-strong); border-radius: 8px; box-sizing: border-box; white-space: nowrap; }
.gcm-pipe .gcm-pipe-piece { position: absolute; display: grid; place-items: center; height: 40px; border-radius: 8px; border: 3px solid var(--ink); box-sizing: border-box; font-size: 18px; font-weight: 700; }
.gcm-pipe .gcm-pipe-lane { position: absolute; font-size: 17px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.gcm-pipe .gcm-pipe-pn { position: absolute; text-align: center; font-size: 20px; font-weight: 700; color: var(--ink); }
.gcm-pipe .gcm-pipe-rate { position: absolute; font-size: 22px; font-weight: 700; color: var(--green); white-space: nowrap; }
`,
		render(s, ctx = {}) {
			useUi(s);
			const n = 'gcm-pipe', H = bodyHeight(s);
			const st = (s.stations ?? []).slice(0, 4), step = ctx.step ?? 4;
			const cws = [330, 330, 330, 570], gx = (W - cws.reduce((a, b) => a + b, 0)) / 3, top = 10, oh = 470;
			const X = i => cws.slice(0, i).reduce((a, b) => a + b, 0) + i * gx;
			const show = i => i < step;
			let html = '';
			const wrap = (i, inner, key = `s${i}`) => `<div class="${show(i) ? '' : `${n}-later`}" data-key="${key}">${inner}</div>`;
			// 1. The answer card: two step-narration rows (struck out) above the answer's text lines (kept, blue edge).
			{
				const x = X(0), cw = cws[0];
				const A = answerCard(n, x, top, cw, oh, { bars: [], toolbar: true, speaker: 'on' });
				let inner = A.html, sv = '';
				['search', 'document'].forEach((icn, k) => {
					const y = top + 84 + k * 44;
					inner += `<div class="${n}-step" style="${at(x + 26, y, cw - 52, 30)}">${ic(icn, 22)}<div class="${n}-bar" style="position:relative;width:${k ? 150 : 190}px;background:var(--line-strong)"></div></div>`;
					sv += `<path d="M ${x + 20} ${y + 15} H ${x + 26 + (k ? 190 : 230)}" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>`;
				});
				sv += `<rect x="${x + 24}" y="${top + 196}" width="6" height="${168}" rx="3" fill="var(--blue)"/>`;
				[0.88, 0.7, 0.82, 0.6, 0.75].forEach((f, k) => {
					inner += `<div class="${n}-bar" style="${at(x + 44, top + 202 + k * 34, (cw - 76) * f)};background:color-mix(in srgb, var(--blue) 30%, #fff)"></div>`;
				});
				html += wrap(0, inner + svgAbs(W, H, sv));
			}
			// 2. Cleaned: the same lines with the markdown marks and an emoji struck out in red.
			{
				const x = X(1), cw = cws[1];
				let inner = `<div class="${n}-card" style="${at(x, top, cw, oh)}"></div>`, sv = '';
				[['**', 0.62], ['#', 0.74], ['>', 0.5]].forEach(([md, f], k) => {
					const y = top + 70 + k * 84;
					inner += t(`${n}-md nolint`, at(x + 26, y - 14, 64, 44), esc(md));
					sv += `<path d="M ${x + 18} ${y + 22} L ${x + 98} ${y - 6}" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>`;
					inner += `<div class="${n}-bar" style="${at(x + 110, y + 2, (cw - 140) * f)}"></div>`;
				});
				const ey = top + 70 + 3 * 84;
				inner += `<div style="position:absolute;${at(x + 28, ey - 14, 36, 36)};color:var(--body)">${ic('emoji', 36)}</div>`;
				sv += `<path d="M ${x + 20} ${ey + 24} L ${x + 72} ${ey - 20}" stroke="var(--muted)" stroke-width="4" stroke-linecap="round"/>`;
				inner += `<div class="${n}-bar" style="${at(x + 110, ey, (cw - 140) * 0.66)}"></div>`;
				html += wrap(1, inner + svgAbs(W, H, sv));
			}
			// 3. Cut into pieces: strips of paper on the table, the first one short and green; scissors at its end.
			{
				const x = X(2), cw = cws[2], widths = [0.3, 0.9, 0.74, 0.96], pw = cw - 52;
				let inner = `<div class="${n}-card" style="${at(x, top, cw, oh)}"></div>`;
				widths.forEach((f, k) => {
					const y = top + 70 + k * 84, w = pw * f;
					inner += `<div class="${n}-piece" style="${at(x + 26, y, w, 48)};background:${k === 0 ? 'var(--green-tint)' : '#fff'};border-color:${k === 0 ? 'var(--green)' : 'var(--ink)'};color:${k === 0 ? 'var(--green)' : 'var(--muted)'}">${t('nolint', '', String(k + 1), { tag: 'span' })}</div>`;
				});
				inner += `<div style="position:absolute;${at(x + 26 + pw * 0.3 + 14, top + 66, 52, 52)};color:var(--ink)">${ic('cut', 52)}</div>`;
				html += wrap(2, inner);
			}
			// 4. Two lanes on one time line: fetch (white) and play (green); piece k plays while piece k + 1 is fetched.
			// A speaker stands on the line at the end; its sound leaves the tweeter upwards.
			{
				const x = X(3), cw = cws[3], lx = x + 92, spw = 84, lw = cw - 92 - spw - 30 - 80, y1 = top + 110, y2 = top + 230, lh = 56;
				const lanes = s.lanes ?? ['Fetch', 'Play'];
				let inner = t(`${n}-lane nolint`, at(x, y1 + 18, 84), esc(lanes[0])) + t(`${n}-lane nolint`, at(x, y2 + 18, 84), esc(lanes[1]));
				const fetch = [[0, 0.12], [0.12, 0.36], [0.36, 0.6], [0.6, 0.84]], play = [[0.12, 0.36], [0.36, 0.6], [0.6, 0.84], [0.84, 1]];
				let sv = '';
				fetch.forEach(([a, b], k) => {
					sv += `<rect x="${r1(lx + lw * a)}" y="${y1}" width="${r1(lw * (b - a) - 6)}" height="${lh}" rx="8" fill="#fff" ${O(3)}/>`;
					inner += `<div data-shape style="position:absolute;${at(lx + lw * a, y1, lw * (b - a) - 6, lh)}">${t(`${n}-pn nolint`, at(0, 14, lw * (b - a) - 6, 28), String(k + 1))}</div>`;
				});
				play.forEach(([a, b], k) => {
					sv += `<rect x="${r1(lx + lw * a)}" y="${y2}" width="${r1(lw * (b - a) - 6)}" height="${lh}" rx="8" fill="var(--green-tint)" stroke="var(--green)" stroke-width="3"/>`;
					inner += `<div data-shape style="position:absolute;${at(lx + lw * a, y2, lw * (b - a) - 6, lh)}">${t(`${n}-pn nolint`, `${at(0, 14, lw * (b - a) - 6, 28)};color:var(--green)`, String(k + 1))}</div>`;
				});
				const ax = lx + lw * 0.12 - 3;
				sv += `<path d="M ${r1(ax)} ${y1 - 24} V ${y2 + lh + 24}" stroke="var(--green)" stroke-width="4" stroke-dasharray="6 7"/>`;
				const base = y2 + lh + 70;
				sv += `<path d="M ${x} ${base} H ${x + cw}" stroke="var(--line-strong)" stroke-width="${SW}" stroke-linecap="round"/>`;
				const spx = x + cw - spw - 80, spy = base - 210;
				sv += `<rect x="${spx}" y="${spy}" width="${spw}" height="210" rx="12" fill="var(--ink)"/><circle cx="${spx + spw / 2}" cy="${spy + 140}" r="30" fill="${STEEL}" ${O(3)}/><circle cx="${spx + spw / 2}" cy="${spy + 140}" r="10" fill="var(--ink)"/><circle cx="${spx + spw / 2}" cy="${spy + 50}" r="15" fill="${STEEL}" ${O(3)}/>`;
				sv += arcs(spx + spw / 2, spy + 140, { dir: 0, r0: 54, step: 24, spread: 30, w: 5, tone: 'green', n: 3 });
				inner += t(`${n}-rate nolint`, at(ax + 12, base + 16, 220), `${ic('speaker', 22)} ${esc(s.start ?? 'Sound starts here')}`);
				inner += t(`${n}-rate nolint`, `${at(spx - 40, base + 16, spw + 80)};text-align:center;color:var(--body)`, esc(s.rate ?? '24 kHz'));
				html += wrap(3, svgAbs(W, H, sv) + inner);
			}
			// Arrows between the stations and the captions under them.
			st.forEach((sn, i) => {
				let inner = '';
				if (i > 0) {
					const ax = X(i) - gx + 10, ay = top + oh / 2;
					inner += svgAbs(W, H, `<path d="M ${ax} ${ay} H ${ax + gx - 24}" stroke="var(--connector)" stroke-width="5" stroke-linecap="round"/><path d="M ${ax + gx - 36} ${ay - 12} L ${ax + gx - 22} ${ay} L ${ax + gx - 36} ${ay + 12}" stroke="var(--connector)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
				}
				const cy = top + oh + 40;
				inner += num(n, X(i) + 23, cy + 20, i + 1, i === 3 ? 'green' : 'blue');
				inner += t(`${n}-cap`, at(X(i) + 60, cy, cws[i] - 60), fmt(sn.title));
				html += wrap(i, inner, `c${i}`);
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** One file between the engine and the wall: on the left the read-aloud engine (a loudspeaker cabinet), its cable
	 * asking for an endpoint and a credential, through one adapter (the credentials file) into a wall plate with two
	 * sockets: today (plugged, orange) and next (empty, dashed blue). A note under it. Fields: eyebrow, title, engine,
	 * ask (the label on the cable), file, fileSub, today: { label, text }, next: { label, text }, note: { icon, text }. */
	'gcm-plug': {
		css: bodyCss('gcm-plug') + `
.gcm-plug .gcm-plug-file { position: absolute; display: grid; place-items: center; text-align: center; font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--ink); }
.gcm-plug .gcm-plug-sock { position: absolute; font-size: 28px; font-weight: 700; line-height: 1.25; color: var(--ink); }
.gcm-plug .gcm-plug-ask { position: absolute; text-align: center; font-family: var(--mono); font-size: 21px; color: var(--body); white-space: nowrap; }
.gcm-plug .gcm-plug-note { position: absolute; display: flex; align-items: center; gap: 12px; font-size: 24px; color: var(--body); }
`,
		render(s) {
			useUi(s);
			const n = 'gcm-plug', H = bodyHeight(s);
			let g = '', html = '';
			const F = 590;
			g += `<path d="M 20 ${F} H 600" stroke="var(--line-strong)" stroke-width="${SW}" stroke-linecap="round"/>`;
			// The engine: a loudspeaker cabinet standing on the floor, a tweeter and a woofer; sound leaves the tweeter.
			const ex = 190, ey = 120, ew = 240, eh = F - ey, ecx = ex + ew / 2;
			g += `<rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" rx="18" fill="var(--ink)"/>`;
			g += `<rect x="${ex + 30}" y="${F - 4}" width="40" height="8" rx="3" fill="${STEEL}"/><rect x="${ex + ew - 70}" y="${F - 4}" width="40" height="8" rx="3" fill="${STEEL}"/>`;
			g += `<circle cx="${ecx}" cy="${ey + 100}" r="42" fill="${STEEL}" ${O(3)}/><circle cx="${ecx}" cy="${ey + 100}" r="15" fill="var(--ink)"/>`;
			g += `<circle cx="${ecx}" cy="${ey + 300}" r="92" fill="${STEEL}" ${O(3)}/><circle cx="${ecx}" cy="${ey + 300}" r="52" fill="#dfe2e8" ${O(3)}/><circle cx="${ecx}" cy="${ey + 300}" r="18" fill="var(--ink)"/>`;
			g += arcs(ecx, ey + 100, { dir: 180, r0: 150, step: 34, spread: 24, w: 6, n: 2 });
			html += t(`${n}-lbl nolint`, `${at(ex - 80, F + 18, ew + 160)};text-align:center`, esc(s.engine ?? 'The engine'));
			// The cable from the cabinet's side to the adapter: it asks for an endpoint and a credential.
			const cy = ey + 230, ax = 790, aw = 360, ah = 110, ay = cy - ah / 2;
			g += `<path d="M ${ex + ew} ${cy} H ${ax}" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"/>`;
			html += t(`${n}-ask nolint`, at(ex + ew + 20, cy - 52, ax - ex - ew - 30), esc(s.ask ?? '{ endpoint, credential }'));
			// The adapter: the one file that changes.
			g += `<rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" rx="16" fill="var(--yellow-tint)" ${O()}/>`;
			html += `<div data-shape style="position:absolute;${at(ax + 10, ay + 10, aw - 20, ah - 20)}">${t(`${n}-file nolint`, at(0, 0, aw - 20, ah - 20), esc(s.file ?? 'credentials'))}</div>`;
			html += t(`${n}-lbl nolint`, `${at(ax - 20, ay + ah + 18, aw + 40)};text-align:center`, esc(s.fileSub ?? 'The only file that changes'));
			// The wall plate with two sockets; the plug sits in the top one, its cable running back to the adapter.
			const wx = 1270, ww = 230, wy = 10, wh = 580;
			const s1 = { cx: wx + ww / 2, cy: wy + 150 }, s2 = { cx: wx + ww / 2, cy: wy + 420 };
			g += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="20" fill="#fff" ${O()}/><circle cx="${wx + ww / 2}" cy="${wy + 22}" r="6" fill="${STEEL}" ${O(2)}/><circle cx="${wx + ww / 2}" cy="${wy + wh - 22}" r="6" fill="${STEEL}" ${O(2)}/>`;
			const socket = (c, tone, dashed) => `<circle cx="${c.cx}" cy="${c.cy}" r="74" fill="var(--${tone}-tint)" stroke="var(--${tone})" stroke-width="5"${dashed ? ' stroke-dasharray="12 10"' : ''}/><rect x="${c.cx - 26}" y="${c.cy - 18}" width="12" height="36" rx="4" fill="var(--ink)"/><rect x="${c.cx + 14}" y="${c.cy - 18}" width="12" height="36" rx="4" fill="var(--ink)"/>`;
			g += socket(s1, 'orange', false) + socket(s2, 'blue', true);
			g += `<path d="M ${ax + aw} ${cy} C ${ax + aw + 100} ${cy} ${s1.cx - 190} ${s1.cy} ${s1.cx - 30} ${s1.cy}" stroke="var(--ink)" stroke-width="10" fill="none" stroke-linecap="round"/>`;
			g += `<rect x="${s1.cx - 46}" y="${s1.cy - 46}" width="92" height="92" rx="18" fill="var(--ink)"/><rect x="${s1.cx - 30}" y="${s1.cy - 30}" width="60" height="60" rx="10" fill="none" stroke="#3a3d45" stroke-width="3"/>`;
			[s1, s2].forEach((c, i) => {
				const it = i ? s.next : s.today, tone = i ? 'blue' : 'orange';
				if (it) {
					html += t(`${n}-lbl nolint t-${tone}`, `${at(wx + ww + 36, c.cy - 76, W - wx - ww - 36)};color:var(--fg)`, esc(it.label));
					html += t(`${n}-sock`, at(wx + ww + 36, c.cy - 42, W - wx - ww - 36), fmt(it.text));
				}
			});
			if (s.note) {
				html += t(`${n}-note`, at(0, H - 40, W, 40), `${ic(s.note.icon ?? 'warning', 28, 'var(--orange)')}<span>${fmt(s.note.text)}</span>`);
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** The Generate Image tool: the model (purple) calls the tool; the tool calls the MAI deployment; the picture goes to
	 * you (the answer card with the real picture and a Save button), and only text goes back to the model (a card of
	 * text lines). Three guards as tags under it. Fields: eyebrow, title, model, tool, deploy, you, back, result (the label on the text card), guards: [text],
	 * ui (picture, pictureSize, assistant, save). */
	'gcm-fork': {
		css: bodyCss('gcm-fork') + `
.gcm-fork .gcm-fork-box { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; border-radius: ${STYLE.radius}px; border: ${SW}px solid var(--ink); box-sizing: border-box; background: #fff; }
.gcm-fork .gcm-fork-t { font-size: 26px; font-weight: 700; color: var(--ink); line-height: 1.2; }
.gcm-fork .gcm-fork-s { font-size: 20px; color: var(--body); }
.gcm-fork .gcm-fork-path { position: absolute; display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 700; color: var(--fg); white-space: nowrap; }
.gcm-fork .gcm-fork-save { position: absolute; display: flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: 8px; background: var(--blue); color: #fff; font-size: 18px; font-weight: 700; }
.gcm-fork .gcm-fork-guards { position: absolute; display: flex; gap: 16px; justify-content: center; }
`,
		render(s) {
			useUi(s);
			const n = 'gcm-fork', H = bodyHeight(s);
			let g = '', html = '';
			const mid = 300, arrow = (x, y, dir, tone) => `<path d="M ${x - 16 * dir} ${y - 14} L ${x} ${y} L ${x - 16 * dir} ${y + 14}" stroke="var(--${tone})" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
			// The model, in chat.
			const mx = 0, mw = 280, mh = 200, my = mid - mh / 2;
			html += `<div class="${n}-box t-purple" style="${at(mx, my, mw, mh)};background:var(--purple-tint);border-color:var(--purple)"><span style="color:var(--purple)">${ic('bot', 56)}</span>${t(`${n}-t nolint`, '', fmt(s.model ?? 'The model'))}</div>`;
			// The tool, and above it the image deployment it calls.
			const tx = 500, tw = 340, th = 200, ty = mid - th / 2;
			html += `<div class="${n}-box" style="${at(tx, ty, tw, th)}"><span style="color:var(--purple)">${ic('image', 52)}</span>${t(`${n}-t nolint`, '', fmt(s.tool ?? 'The tool'))}</div>`;
			g += `<path d="M ${mx + mw} ${mid} H ${tx - 10}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round"/>` + arrow(tx - 8, mid, 1, 'purple');
			const dy = 20, dh = 96;
			html += `<div class="${n}-box" style="${at(tx + 20, dy, tw - 40, dh)};flex-direction:row;border-color:var(--line-strong);border-width:3px"><span style="color:var(--blue)">${ic('cloud', 36)}</span>${t(`${n}-s nolint`, '', fmt(s.deploy ?? 'The image service'))}</div>`;
			g += `<path d="M ${tx + tw / 2} ${dy + dh + 10} V ${ty - 10}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M ${tx + tw / 2 - 12} ${dy + dh + 22} L ${tx + tw / 2} ${dy + dh + 8} L ${tx + tw / 2 + 12} ${dy + dh + 22} M ${tx + tw / 2 - 12} ${ty - 22} L ${tx + tw / 2} ${ty - 8} L ${tx + tw / 2 + 12} ${ty - 22}" stroke="var(--ink)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
			// The picture to you: the answer card holding the real picture, with Save.
			const ax = 1110, aw = W - ax, picW = aw - 52, picH = Math.round(picW * picRatio()), ah = 74 + picH + 86, ay = Math.max(0, mid - ah / 2);
			const A = answerCard(n, ax, ay, aw, ah, { picture: UI.picture, picW, picH, bars: [], toolbar: true });
			html += A.html + `<div class="${n}-save" style="${at(ax + aw - 120, ay + 20, 96, 34)}">${ic('save', 20)}${t('nolint', '', esc(UI.save), { tag: 'span' })}</div>`;
			g += `<path d="M ${tx + tw} ${mid} H ${ax - 10}" stroke="var(--blue)" stroke-width="6" stroke-linecap="round"/>` + arrow(ax - 8, mid, 1, 'blue');
			html += t(`${n}-path t-blue nolint`, at(tx + tw + 24, mid - 52, ax - tx - tw - 40, 34), `${ic('person', 24)}<span>${fmt(s.you ?? 'To you: the picture')}</span>`);
			// Only text back to the model: a card of text lines under the tool, then back along the floor to the model.
			const bx = tx, bw = tw, by = 480, bh = 110;
			html += `<div class="${n}-card" style="${at(bx, by, bw, bh)};border-color:var(--purple)"></div>` + t(`${n}-s nolint`, `${at(bx + 26, by + 14, bw - 52, 28)};position:absolute`, fmt(s.result ?? 'Text result'));
			[0.85, 0.6].forEach((f, k) => {
				html += `<div class="${n}-bar" style="${at(bx + 26, by + 54 + k * 26, (bw - 52) * f)}"></div>`;
			});
			g += `<path d="M ${tx + tw / 2} ${ty + th + 4} V ${by - 8}" stroke="var(--purple)" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 12"/>`;
			g += `<path d="M ${bx - 6} ${by + bh / 2} H ${mx + mw / 2} V ${my + mh + 12}" stroke="var(--purple)" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="2 12"/>`;
			g += `<path d="M ${mx + mw / 2 - 14} ${my + mh + 28} L ${mx + mw / 2} ${my + mh + 12} L ${mx + mw / 2 + 14} ${my + mh + 28}" stroke="var(--purple)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
			html += t(`${n}-path t-purple nolint`, at(mx + mw / 2 + 24, by + bh / 2 - 48, bx - mx - mw / 2 - 40, 34), `${ic('bot', 24)}<span>${fmt(s.back ?? 'To the model: text only')}</span>`);
			const guards = (s.guards ?? []).slice(0, 3);
			html += `<div class="${n}-guards" style="${at(0, H - 44, W, 40)}">${guards.map(gd => `<span class="${n}-tag t-green" data-t>${ic('shield', 20)}${fmt(gd)}</span>`).join('')}</div>`;
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** Teaching a move: the /pet request (a user bubble), the agent's two tools, the real frames of the move it drew
	 * (cropped from the demo video, on the editor's dark background), the limits, and four more moves. Fields: eyebrow,
	 * title, slash, ask, tools: [{ name, text }], frames: [png], strip (label), limitsLabel, limits: [{ value, unit }], more: { label, items:
	 * [{ src, name }] }. */
	'gcm-teach': {
		css: bodyCss('gcm-teach') + `
.gcm-teach .gcm-teach-user { position: absolute; display: flex; align-items: center; padding: 0 24px; border-radius: ${STYLE.radius}px; background: var(--blue-tint); border: 3px solid var(--blue); box-sizing: border-box; font-size: 25px; line-height: 1.3; color: var(--ink); }
.gcm-teach .gcm-teach-tool { position: absolute; display: flex; align-items: center; gap: 12px; padding: 0 18px; height: 64px; border-radius: 14px; background: var(--purple-tint); border: 3px solid var(--purple); box-sizing: border-box; white-space: nowrap; }
.gcm-teach .gcm-teach-tn { font-family: var(--mono); font-size: 22px; font-weight: 700; color: var(--purple); }
.gcm-teach .gcm-teach-tx { font-size: 21px; color: var(--body); }
.gcm-teach .gcm-teach-big { position: absolute; font-size: 72px; font-weight: 700; line-height: 1.1; color: var(--orange); white-space: nowrap; }
.gcm-teach .gcm-teach-unit { position: absolute; font-size: 22px; color: var(--body); white-space: nowrap; }
.gcm-teach .gcm-teach-slash { display: inline-block; padding: 0 8px; margin-right: 6px; border-radius: 6px; background: #fff; color: var(--blue); font-weight: 700; }
.gcm-teach .gcm-teach-name { position: absolute; text-align: center; font-family: var(--mono); font-size: 18px; color: var(--body); white-space: nowrap; }
`,
		render(s) {
			useUi(s);
			const n = 'gcm-teach', H = bodyHeight(s);
			let g = '', html = '';
			html += t(`${n}-user nolint`, at(0, 22, 820, 96), `<span class="${n}-slash">${esc(s.slash ?? UI.slash)}</span>${fmt(s.ask ?? '')}`);
			const tools = (s.tools ?? []).slice(0, 2);
			tools.forEach((tl, i) => {
				html += `<div class="${n}-tool" style="${at(930, i * 76, 798, 64)}">${ic('wrench', 26, 'var(--purple)')}${t(`${n}-tn nolint`, '', esc(tl.name), { tag: 'span' })}${t(`${n}-tx`, '', fmt(tl.text), { tag: 'span' })}</div>`;
			});
			g += `<path d="M 830 70 H 900" stroke="var(--purple)" stroke-width="5" stroke-linecap="round"/><path d="M 888 58 L 902 70 L 888 82" stroke="var(--purple)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
			// The strip: the real frames, one tile each, on the editor's dark background.
			const frames = (s.frames ?? []).slice(0, 8), fy = 210, fw = 200, fh = Math.round(fw * 219 / 260), gap = (W - frames.length * fw) / (frames.length - 1);
			html += t(`${n}-lbl nolint`, at(0, fy - 34, 600), esc(s.strip ?? 'Frame by frame'));
			frames.forEach((f, i) => {
				const x = i * (fw + gap);
				html += `<div class="${n}-dark" style="${at(x, fy, fw, fh)}">${pic(f, 0, 0, fw, fh)}</div>`;
			});
			const ax7 = r1(6 * (fw + gap) + fw / 2);
			g += `<path d="M ${ax7} 142 V ${fy - 12}" stroke="var(--purple)" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 12"/><path d="M ${ax7 - 12} ${fy - 22} L ${ax7} ${fy - 8} L ${ax7 + 12} ${fy - 22}" stroke="var(--purple)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
			// The limits, then four more moves on the right.
			const ly = fy + fh + 80;
			html += t(`${n}-lbl nolint`, at(0, ly, 500), esc(s.limitsLabel ?? 'Limits'));
			(s.limits ?? []).slice(0, 3).forEach((l, i) => {
				html += t(`${n}-big nolint`, at(i * 260, ly + 44, 250, 84), fmt(l.value)) + t(`${n}-unit nolint`, at(i * 260, ly + 134, 250, 30), fmt(l.unit));
			});
			if (s.more) {
				const items = s.more.items.slice(0, 4), mw = 204, mh = Math.round(mw * 252 / 340), mx0 = W - items.length * mw - (items.length - 1) * 18;
				html += t(`${n}-lbl nolint`, at(mx0, ly, 760), esc(s.more.label));
				items.forEach((it, i) => {
					const x = mx0 + i * (mw + 18);
					html += `<div class="${n}-dark" style="${at(x, ly + 40, mw, mh)}">${pic(it.src, 0, 0, mw, mh)}</div>`;
					html += t(`${n}-name nolint`, at(x, ly + 48 + mh, mw), esc(it.name));
				});
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},

	/** A reaction, as three comic panels (click by click, one panel per click; every panel stays bright): 1 teach it
	 * once (a /pet bubble and a check), 2 send a message (the trigger word marked), 3 the pet reacts (the real GRR! frame)
	 * while the agent is still thinking. Fields: eyebrow, title, panels (3): [{ title }], teach, taught, message (mark
	 * the trigger with {{orange|...}}), local, thinking, ui (pet, reaction, reactionSize, slash, placeholder). */
	'gcm-react': {
		clicks: true,
		css: bodyCss('gcm-react') + `
.gcm-react .gcm-react-later { opacity: 0; }
.gcm-react .gcm-react-p { position: absolute; background: #fff; border: ${SW}px solid var(--ink); border-radius: 6px; box-sizing: border-box; }
.gcm-react .gcm-react-user { position: absolute; padding: 14px 20px; border-radius: 16px; background: var(--blue-tint); border: 3px solid var(--blue); box-sizing: border-box; font-size: 24px; line-height: 1.3; color: var(--ink); }
.gcm-react .gcm-react-ok { position: absolute; display: flex; justify-content: flex-start; align-items: center; gap: 8px; font-size: 22px; font-weight: 600; color: var(--green); white-space: nowrap; }
.gcm-react .gcm-react-think { position: absolute; font-size: 22px; color: var(--muted); white-space: nowrap; }
.gcm-react .gcm-react-in { position: absolute; background: #fff; border: 3px solid var(--ink); border-radius: 14px; box-sizing: border-box; }
.gcm-react .gcm-react-slash { display: inline-block; padding: 0 8px; margin-right: 6px; border-radius: 6px; background: #fff; color: var(--blue); font-weight: 700; }
`,
		render(s, ctx = {}) {
			useUi(s);
			const n = 'gcm-react', H = bodyHeight(s);
			const panels = (s.panels ?? []).slice(0, 3), step = ctx.step ?? 3;
			const pw = 540, gap = (W - 3 * pw) / 2, ph = 530;
			// A small chat input at the bottom of a panel, with the pet sitting on it.
			const miniInput = (x, petHtml) => `<div class="${n}-in" style="${at(x + 30, ph - 104, pw - 60, 74)}"></div>` + t(`${n}-ph nolint`, at(x + 52, ph - 84, 300, 30), esc(UI.placeholder)) + petHtml;
			let html = '';
			panels.forEach((p, i) => {
				const x = i * (pw + gap);
				let inner = `<div class="${n}-p" style="${at(x, 0, pw, ph)}"></div>`;
				if (i === 0) {
					inner += t(`${n}-user nolint`, at(x + 30, 36, pw - 60), `<span class="${n}-slash">${esc(UI.slash)}</span>${fmt(s.teach ?? '')}`);
					inner += t(`${n}-ok nolint`, at(x + 30, 190, pw - 60, 36), `${ic('checkmark', 26)}<span>${fmt(s.taught ?? 'Saved')}</span>`);
					inner += miniInput(x, pet(x + pw - 100, ph - 102, 72));
				} else if (i === 1) {
					inner += t(`${n}-user nolint`, at(x + 30, 36, pw - 60), fmt(s.message ?? ''));
					inner += t(`${n}-ok`, `${at(x + 30, 190, pw - 60, 36)};color:var(--blue)`, `${ic('laptop', 26)}<span>${fmt(s.local ?? 'Matched locally')}</span>`);
					inner += miniInput(x, pet(x + pw - 100, ph - 102, 72));
				} else {
					inner += `<div class="${n}-dark" style="${at(x + 30, 30, pw - 60, ph - 60)}"></div>` + pic(UI.reaction, x + (pw - 290) / 2, ph - 30 - Math.round(290 * UI.reactionSize[1] / UI.reactionSize[0]), 290, Math.round(290 * UI.reactionSize[1] / UI.reactionSize[0]));
					inner += `<div data-on="${UI_DARK}">${t(`${n}-think nolint`, `${at(x + 56, 54, 300, 30)};color:#9da1a9`, esc(s.thinking ?? 'Analyzing'))}</div>`;
				}
				inner += num(n, x + 23, ph + 48, i + 1, i === 2 ? 'orange' : 'blue');
				inner += t(`${n}-cap`, at(x + 60, ph + 30, pw - 60), fmt(p.title));
				html += `<div class="${i < step ? '' : `${n}-later`}" data-key="p${i}">${inner}</div>`;
			});
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${html}</div>`, { vcenter: false });
		},
	},

	/** The close, on a blue page (bg: 'blue'): three branches from the left run into main on the right, each stopped at
	 * a barrier gate; at each branch's start its feature (icon, name, PR ref) and at each gate what it waits for. The
	 * line to remember under it. Fields: eyebrow, title, branches (3): [{ icon | pet: true (ui.pet as the icon), name,
	 * ref, waits }], waitsLabel, main, line, ui (pet). */
	'gcm-close': {
		css: bodyCss('gcm-close') + `
.gcm-close .gcm-close-f { position: absolute; display: flex; align-items: center; gap: 14px; padding: 0 20px; height: 84px; border-radius: 16px; background: #fff; box-sizing: border-box; }
.gcm-close .gcm-close-fn { font-size: 26px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.gcm-close .gcm-close-fr { font-family: var(--mono); font-size: 18px; color: var(--body); white-space: nowrap; }
.gcm-close .gcm-close-w { position: absolute; font-size: 24px; font-weight: 600; line-height: 1.25; color: #fff; }
.gcm-close .gcm-close-wl { position: absolute; font-size: 16px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #fff; white-space: nowrap; }
.gcm-close .gcm-close-main { position: absolute; display: grid; place-items: center; font-family: var(--mono); font-size: 26px; font-weight: 700; color: var(--blue); }
.gcm-close .gcm-close-line { position: absolute; font-size: 36px; font-weight: 700; color: #fff; white-space: nowrap; }
`,
		render(s) {
			useUi(s);
			const n = 'gcm-close', H = bodyHeight(s);
			const br = (s.branches ?? []).slice(0, 3);
			let g = '', html = '';
			const ys = [84, 284, 484], fx = 0, fw = 420, gx = 1000, mx = 1580, my = 284;
			br.forEach((b, i) => {
				const y = ys[i];
				// The branch: from the feature card to the gate, then on to main (dashed: not merged yet).
				g += `<path d="M ${fx + fw} ${y} H ${gx}" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`;
				const ea = [-0.75, 0, 0.75][i], ex = mx - 70 * Math.cos(ea), ey = my + 70 * Math.sin(ea);
				g += `<path d="M ${gx + 120} ${y} C ${gx + 300} ${y} ${r1(ex - 160 * Math.cos(ea))} ${r1(ey + 160 * Math.sin(ea))} ${r1(ex)} ${r1(ey)}" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="4 18" opacity=".7"/>`;
				// The gate: two posts, a striped arm down across the line.
				g += `<rect x="${gx - 8}" y="${y - 70}" width="16" height="110" rx="4" fill="#fff"/><rect x="${gx + 104}" y="${y - 70}" width="16" height="110" rx="4" fill="#fff"/>`;
				g += `<rect x="${gx - 14}" y="${y - 26}" width="140" height="22" rx="6" fill="#fff" ${O(3)}/>`;
				for (let k = 0; k < 4; k++) {
					g += `<rect x="${gx - 4 + k * 34}" y="${y - 23}" width="16" height="16" fill="var(--orange)"/>`;
				}
				html += `<div class="${n}-f" style="${at(fx, y - 42, fw, 84)}" data-on="#ffffff">${b.pet && UI.pet && asset(full(UI.pet)) ? `<img src="${esc(asset(full(UI.pet)))}" alt="" style="width:36px;height:36px;image-rendering:pixelated">` : ic(b.icon ?? 'branch', 34, 'var(--blue)')}${t(`${n}-fn nolint`, '', fmt(b.name), { tag: 'span' })}${t(`${n}-fr nolint`, '', esc(b.ref), { tag: 'span' })}</div>`;
				html += t(`${n}-wl nolint`, at(fx + fw + 40, y - 74, gx - fx - fw - 70), esc(s.waitsLabel ?? 'Still needs'));
				html += t(`${n}-w`, at(fx + fw + 40, y - 46, gx - fx - fw - 70), fmt(b.waits));
			});
			g += `<circle cx="${mx}" cy="${my}" r="66" fill="#fff"/>`;
			html += `<div data-shape data-on="#ffffff" style="position:absolute;${at(mx - 60, my - 30, 120, 60)}">${t(`${n}-main nolint`, at(0, 0, 120, 60), esc(s.main ?? 'main'))}</div>`;
			if (s.line) {
				html += t(`${n}-line`, at(0, ys[2] + 100, W, 50), fmt(s.line));
			}
			return heading(s) + body(`<div class="${n}" style="height:${H}px">${layer(H, g)}${html}</div>`, { vcenter: false });
		},
	},
};
