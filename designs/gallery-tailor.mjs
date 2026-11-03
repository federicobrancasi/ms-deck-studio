// A gallery for inspiration (the tailor's rack world): read it for technique: one shared jacket drawn with lapels,
// pockets, stitching and a wooden hanger at any size, tape measures that show a need against a size with the gap in red,
// and flows sized by share that end at labels pushed apart so they never collide.
// A new deck draws its own pictures in designs/local-<deck>.mjs; do not reuse these as they are. Every visible word
// comes from the slide's fields; examples/fitting-room.mjs shows them in a deck.
// One tailor's rack, one object: a jacket on a hanger (a model, cut to four sizes, with a price tag) comes back on
// every page; a request is a customer with four measurements, and the cheapest jacket that fits every one wins.
//   gtl-cover-rail: a cover: the request's order slip with four tapes, a clothes rail on wheels, jackets by price
//   gtl-two-sizes:  one tape and a rail with only two jackets; the whole pool on a rail with those two in colour; a stamp
//   gtl-measure:    the customer on a platform says what they need, the tailor measures, out comes the order slip (clicks)
//   gtl-try-on:     jackets tried cheapest first, each with four tapes and a red gap where it falls short (clicks)
//   gtl-rails:      the catalogue as two wall rails: jackets added, empty outlines removed, a big counter
//   gtl-coins:      cost as stacks of coins you can count, the saved stacks as dashed outlines
//   gtl-languages:  one row per language group (a sewn-in label), a dot per group inside one narrow band
//   gtl-flight:     an A/B test: two equal crowds, the change per metric as bars, the biggest win bold
//   gtl-traffic:    bands sized by share from a source through a router card to every model (clicks)
//   gtl-sewing:     a drawn close on a blue page: a sewing machine on the bench and an order board of next jobs
import { W, STYLE, at, body, bodyHeight, esc, fmt, heading, ic, layer, logo, mix, msLogo, pill, r1, band } from '../src/kit.mjs';

// ---------- materials: one look for every hanger, rail, tape and tag ----------
const INK = 'var(--ink)';
const WOOD = { fill: '#d9b27c', dark: '#b8894f', line: '#7d5a2f' };
const CHROME = { fill: '#e4e7eb', mid: '#c3c8cf', line: '#7b818a' };
const TAPE = { fill: '#f6d76b', line: '#b38f1f', tick: '#8a6d12' };
const SKIN = ['#f0c8a0', '#b97f55'];
const sw = s => r1(Math.max(2.2, STYLE.stroke * Math.min(1, s * 1.1)));

/** The colours of a jacket: its tone (purple: a model), greyed when it is not in play, white on a blue page. */
function cloth(tone, { dim = false, paint = null } = {}) {
	if (paint) return { f: paint.fill, s: paint.fill, l: 'rgba(255,255,255,.08)', line: paint.stroke, btn: paint.stroke };
	if (dim) return { f: '#f4f5f7', s: '#e9ebef', l: '#e1e4e9', line: '#b9bcc4', btn: '#d3d8e0' };
	return { f: mix(tone, 18), s: mix(tone, 34), l: mix(tone, 62), line: INK, btn: mix(tone, 75, '#1b1b1f') };
}

/** A jacket on a wooden hanger, hook top at (cx, y), w wide at the shoulders (200 by default): the hook, the hanger's
 * ends peeking out at the shoulders, sleeves with cuffs and cuff buttons, two front panels, the lining in the V, a
 * back collar, notched lapels with stitching, a breast pocket with a folded square, two flap pockets, two buttons and a
 * stitched hem. Returns { svg, cuff (the left cuff button, for a tag's string), h (height), top, bottom }. */
function jacket(cx, y, w = 200, { tone = 'purple', dim = false, ghost = false, paint = null, hanger = true } = {}) {
	const s = w / 200, p = (u, v) => `${r1(cx + u * s)} ${r1(y + v * s)}`, lw = sw(s);
	const C = cloth(tone, { dim, paint });
	const dash = ghost ? ` stroke-dasharray="${r1(9 * s)} ${r1(7 * s)}"` : '';
	const sh = (d, fill, extra = '') => `<path d="${d}" fill="${ghost ? 'none' : fill}" stroke="${ghost ? `var(--${tone})` : C.line}" stroke-width="${lw}" stroke-linejoin="round"${dash}${extra}/>`;
	const thin = (d, extra = '') => ghost ? '' : `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${r1(lw * 0.55)}" stroke-linecap="round"${extra}/>`;
	const stitch = d => ghost ? '' : `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${r1(Math.max(1.2, lw * 0.4))}" stroke-dasharray="${r1(4 * s)} ${r1(4 * s)}" opacity=".7"/>`;
	let g = '';
	if (hanger) {
		const metal = paint ? paint.stroke : dim ? CHROME.mid : CHROME.line;
		g += `<path d="M ${p(0, 40)} L ${p(0, 16)} C ${p(0, 2)} ${p(18, 0)} ${p(18, 12)} C ${p(18, 20)} ${p(12, 24)} ${p(8, 22)}" fill="none" stroke="${metal}" stroke-width="${r1(lw * 1.1)}" stroke-linecap="round"/>`;
	}
	const wood = hanger ? `<path d="M ${p(-112, 80)} Q ${p(0, 30)} ${p(112, 80)} L ${p(108, 92)} Q ${p(0, 46)} ${p(-108, 92)} Z" fill="${paint ? paint.fill : dim ? '#ece3d6' : WOOD.fill}" stroke="${paint ? paint.stroke : dim ? '#cdbfa9' : WOOD.line}" stroke-width="${lw}" stroke-linejoin="round"/><path d="M ${p(-96, 82)} Q ${p(0, 40)} ${p(96, 82)}" fill="none" stroke="${paint ? paint.stroke : dim ? '#ddd0bc' : WOOD.dark}" stroke-width="${r1(lw * 0.45)}" opacity=".8"/>` : '';
	if (ghost) g += wood;
	// Sleeves, behind the body.
	for (const k of [-1, 1]) {
		g += sh(`M ${p(90 * k, 72)} C ${p(104 * k, 76)} ${p(112 * k, 84)} ${p(114 * k, 100)} L ${p(120 * k, 276)} L ${p(88 * k, 282)} L ${p(80 * k, 118)} Z`, C.s);
		g += thin(`M ${p(119 * k, 256)} L ${p(89 * k, 262)}`);
		if (!ghost) g += `<circle cx="${r1(cx + 109 * k * s)}" cy="${r1(y + 269 * s)}" r="${r1(3.2 * s)}" fill="${C.btn}"/><circle cx="${r1(cx + 99 * k * s)}" cy="${r1(y + 271 * s)}" r="${r1(3.2 * s)}" fill="${C.btn}"/>`;
	}
	// The lining in the V, then the two panels (the left one on top: it buttons over the right).
	if (!ghost) g += `<path d="M ${p(-24, 46)} L ${p(24, 46)} L ${p(5, 178)} L ${p(-5, 178)} Z" fill="${C.l}"/>`;
	g += sh(`M ${p(24, 46)} L ${p(90, 72)} C ${p(84, 100)} ${p(80, 120)} ${p(80, 140)} L ${p(78, 196)} L ${p(84, 296)} Q ${p(84, 306)} ${p(74, 306)} L ${p(2, 306)} L ${p(5, 178)} Z`, C.f);
	g += sh(`M ${p(-24, 46)} L ${p(-90, 72)} C ${p(-84, 100)} ${p(-80, 120)} ${p(-80, 140)} L ${p(-78, 196)} L ${p(-84, 296)} Q ${p(-84, 306)} ${p(-74, 306)} L ${p(-8, 306)} Q ${p(8, 300)} ${p(6, 282)} L ${p(-5, 178)} Z`, C.f);
	if (!ghost) g += wood;
	// Back collar and notched lapels.
	g += sh(`M ${p(-24, 46)} Q ${p(0, 36)} ${p(24, 46)} L ${p(20, 57)} Q ${p(0, 50)} ${p(-20, 57)} Z`, C.s);
	for (const k of [-1, 1]) {
		g += sh(`M ${p(24 * k, 46)} L ${p(46 * k, 94)} L ${p(38 * k, 100)} L ${p(60 * k, 106)} Q ${p(32 * k, 142)} ${p(5 * k, 178)} L ${p(20 * k, 60)} Z`, C.s);
		g += stitch(`M ${p(53 * k, 110)} Q ${p(30 * k, 140)} ${p(10 * k, 166)}`);
	}
	// Breast pocket with a folded square, two flap pockets, buttons, hem stitching.
	g += sh(`M ${p(36, 126)} L ${p(70, 119)} L ${p(71, 128)} L ${p(37, 135)} Z`, C.s);
	if (!ghost) g += `<path d="M ${p(42, 125)} L ${p(48, 112)} L ${p(54, 121)} L ${p(60, 110)} L ${p(65, 120)} Z" fill="#fff" stroke="${C.line}" stroke-width="${r1(lw * 0.5)}" stroke-linejoin="round"/>`;
	for (const k of [-1, 1]) {
		g += sh(`M ${p(34 * k, 230)} L ${p(74 * k, 230)} L ${p(74 * k, 242)} Q ${p(74 * k, 248)} ${p(68 * k, 248)} L ${p(40 * k, 248)} Q ${p(34 * k, 248)} ${p(34 * k, 242)} Z`, C.s);
		g += stitch(`M ${p(38 * k, 243)} L ${p(70 * k, 243)}`);
		g += stitch(`M ${p(78 * k, 297)} L ${p(10 * k, 297)}`);
	}
	if (!ghost) for (const v of [200, 240]) g += `<circle cx="${r1(cx - 2 * s)}" cy="${r1(y + v * s)}" r="${r1(5 * s)}" fill="${C.btn}"/><circle cx="${r1(cx - 2 * s)}" cy="${r1(y + v * s)}" r="${r1(1.6 * s)}" fill="${C.f}"/>`;
	return { svg: g, cuff: [cx - 109 * s, y + 269 * s], cuffR: [cx + 109 * s, y + 269 * s], h: 306 * s, top: y, bottom: y + 306 * s, half: 120 * s };
}

/** A clothes rail: a chrome bar between two uprights; on wheels (two castors per foot) or screwed to a wall with two
 * brackets. The hooks of the hangers hang over the bar at y. */
function clothesRail(x0, x1, y, floorY, { wheels = true, paint = null } = {}) {
	const line = paint ? paint.stroke : CHROME.line, fill = paint ? paint.fill : CHROME.fill, mid = paint ? paint.fill : CHROME.mid;
	let g = '';
	if (wheels) {
		for (const x of [x0, x1]) {
			g += `<rect x="${r1(x - 7)}" y="${r1(y)}" width="14" height="${r1(floorY - 40 - y)}" rx="6" fill="${fill}" stroke="${line}" stroke-width="3"/>`;
			g += `<rect x="${r1(x - 54)}" y="${r1(floorY - 46)}" width="108" height="14" rx="7" fill="${mid}" stroke="${line}" stroke-width="3"/>`;
			for (const wx of [x - 40, x + 40]) {
				g += `<line x1="${r1(wx)}" y1="${r1(floorY - 32)}" x2="${r1(wx)}" y2="${r1(floorY - 22)}" stroke="${line}" stroke-width="4"/><circle cx="${r1(wx)}" cy="${r1(floorY - 12)}" r="12" fill="${paint ? 'none' : '#4b5058'}" stroke="${line}" stroke-width="3"/><circle cx="${r1(wx)}" cy="${r1(floorY - 12)}" r="4" fill="${fill}"/>`;
			}
		}
	} else {
		g += `<rect x="${r1(x0 - 4)}" y="${r1(y - 44)}" width="${r1(x1 - x0 + 8)}" height="16" rx="4" fill="${paint ? 'none' : '#e9ddc7'}" stroke="${paint ? paint.stroke : '#a88c5f'}" stroke-width="2.5"/>`;
		for (const x of [x0 + 20, x1 - 20]) {
			g += `<path d="M ${r1(x - 12)} ${r1(y - 34)} L ${r1(x + 12)} ${r1(y - 34)} L ${r1(x + 6)} ${r1(y + 6)} L ${r1(x - 6)} ${r1(y + 6)} Z" fill="${mid}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/><circle cx="${r1(x)}" cy="${r1(y - 24)}" r="3.5" fill="${line}"/>`;
		}
	}
	g += `<rect x="${r1(x0 - 14)}" y="${r1(y - 7)}" width="${r1(x1 - x0 + 28)}" height="14" rx="7" fill="${fill}" stroke="${line}" stroke-width="3"/><line x1="${r1(x0)}" y1="${r1(y - 2)}" x2="${r1(x1)}" y2="${r1(y - 2)}" stroke="#fff" stroke-width="3" opacity=".8"/>`;
	return g;
}

/** A price tag on a string from (fx, fy): card with a clipped top, a reinforced eyelet and the string through it. The
 * text goes on top in HTML (see tagText). */
function tagSvg(x, y, w, h, { tone = 'neutral', from = null } = {}) {
	const c = 12, ex = x + w / 2, ey = y + 12;
	let g = '';
	const st = tone === 'neutral' ? 'var(--faint)' : `var(--${tone})`, fill = tone === 'green' ? mix('green', 12) : '#fff';
	g += `<path d="M ${r1(x + c)} ${r1(y)} L ${r1(x + w - c)} ${r1(y)} L ${r1(x + w)} ${r1(y + c)} L ${r1(x + w)} ${r1(y + h)} L ${r1(x)} ${r1(y + h)} L ${r1(x)} ${r1(y + c)} Z" fill="${fill}" stroke="${st}" stroke-width="3" stroke-linejoin="round"/>`;
	g += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="6" fill="#fff" stroke="${st}" stroke-width="2.5"/>`;
	if (from) g += `<path d="M ${r1(from[0])} ${r1(from[1])} C ${r1(from[0])} ${r1((from[1] + ey) / 2 + 10)} ${r1(ex)} ${r1(ey - 30)} ${r1(ex)} ${r1(ey)}" fill="none" stroke="var(--muted)" stroke-width="2"/><circle cx="${r1(ex)}" cy="${r1(ey)}" r="2.2" fill="var(--muted)"/>`;
	return g;
}
const tagText = (x, y, w, h, html, { cls = 'gtl-price', hid = false } = {}) => `<div class="gtl-tagbox${hid ? ' gtl-hid' : ''}" style="${at(x, y + 18, w, h - 18)}" data-shape><span class="${cls} nolint" data-t>${html}</span></div>`;

/** A tape measure laid flat, w long for the 0..1 scale: yellow tape with ticks and a metal tab. need: the customer's
 * chalk mark (a notch above the tape); cap: the jacket's size, as a strip of its cloth under the tape; where the cloth
 * stops short of the mark, the gap is red. */
function tapeRow(x, y, w, { need = null, cap = null, tone = 'purple', h = 20 } = {}) {
	let g = `<rect x="${r1(x - 8)}" y="${r1(y - 2)}" width="10" height="${h + 4}" rx="2" fill="${CHROME.mid}" stroke="${CHROME.line}" stroke-width="2"/>`;
	g += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${h}" rx="3" fill="${TAPE.fill}" stroke="${TAPE.line}" stroke-width="2"/>`;
	for (let i = 1; i < 20; i++) {
		const tx = x + (w * i) / 20, len = i % 10 === 0 ? h * 0.75 : i % 2 === 0 ? h * 0.5 : h * 0.3;
		g += `<line x1="${r1(tx)}" y1="${r1(y)}" x2="${r1(tx)}" y2="${r1(y + len)}" stroke="${TAPE.tick}" stroke-width="1.6"/>`;
	}
	if (cap != null) {
		const cy = y + h + 5, ok = need == null || cap >= need - 1e-9;
		g += `<rect x="${r1(x)}" y="${r1(cy)}" width="${r1(w * cap)}" height="12" rx="4" fill="${mix(tone, 45)}"/>`;
		if (!ok) g += `<rect x="${r1(x + w * cap)}" y="${r1(cy)}" width="${r1(w * (need - cap))}" height="12" rx="3" fill="${mix('red', 35)}" stroke="var(--red)" stroke-width="2" stroke-dasharray="4 3"/>`;
	}
	if (need != null) {
		const mx = x + w * need, bad = cap != null && cap < need - 1e-9;
		const col = bad ? 'var(--red)' : INK;
		g += `<path d="M ${r1(mx - 8)} ${r1(y - 13)} L ${r1(mx + 8)} ${r1(y - 13)} L ${r1(mx)} ${r1(y - 2)} Z" fill="${col}"/><line x1="${r1(mx)}" y1="${r1(y)}" x2="${r1(mx)}" y2="${r1(y + h + (cap != null ? 18 : 0))}" stroke="${col}" stroke-width="3"/>`;
	}
	return g;
}

/** A person standing at (cx, ground), h tall: shoes, trousers, a shirt with sleeves and hands, a neck, a head with
 * ears, eyes, a nose, a smile and hair. role 'customer': blue shirt and a tape measure round the chest. role 'tailor':
 * white shirt, a purple waistcoat with buttons, glasses, a tape measure round the neck and a notepad in hand. */
function person(cx, ground, h, { role = 'customer', paint = null } = {}) {
	const s = h / 420, p = (u, v) => `${r1(cx + u * s)} ${r1(ground + v * s)}`, lw = sw(s);
	const ol = paint ? paint.stroke : INK;
	const shape = (d, fill, w = lw) => `<path d="${d}" fill="${paint ? paint.fill : fill}" stroke="${ol}" stroke-width="${r1(w)}" stroke-linejoin="round" stroke-linecap="round"/>`;
	const tailor = role === 'tailor';
	const skin = tailor ? SKIN[1] : SKIN[0];
	const shirt = tailor ? '#ffffff' : mix('blue', 32);
	const trousers = tailor ? '#3e434b' : '#5c6470';
	let g = '';
	g += shape(`M ${p(-40, -10)} Q ${p(-42, 0)} ${p(-28, 0)} L ${p(-4, 0)} L ${p(-6, -14)} Z`, '#2b2f35');
	g += shape(`M ${p(40, -10)} Q ${p(42, 0)} ${p(28, 0)} L ${p(4, 0)} L ${p(6, -14)} Z`, '#2b2f35');
	g += shape(`M ${p(-42, -216)} L ${p(42, -216)} L ${p(38, -12)} L ${p(6, -12)} L ${p(0, -168)} L ${p(-6, -12)} L ${p(-38, -12)} Z`, trousers);
	if (!tailor) g += shape(`M ${p(-43, -222)} L ${p(43, -222)} L ${p(43, -210)} L ${p(-43, -210)} Z`, '#3b2f28');
	// Arms (sleeves and hands), behind the torso.
	for (const k of [-1, 1]) {
		g += shape(`M ${p(54 * k, -330)} L ${p(76 * k, -318)} L ${p(86 * k, -222)} L ${p(66 * k, -220)} L ${p(58 * k, -296)} Z`, shirt);
	}
	const hand = k => `<path d="M ${p(70 * k, -222)} Q ${p(88 * k, -224)} ${p(88 * k, -206)} Q ${p(86 * k, -194)} ${p(76 * k, -194)} Q ${p(66 * k, -196)} ${p(66 * k, -208)} Z" fill="${paint ? paint.fill : skin}" stroke="${ol}" stroke-width="${r1(lw * 0.7)}" stroke-linejoin="round"/><path d="M ${p(70 * k, -214)} Q ${p(60 * k, -212)} ${p(62 * k, -202)}" fill="none" stroke="${ol}" stroke-width="${r1(lw * 0.6)}" stroke-linecap="round"/>`;
	g += shape(`M ${p(-56, -330)} Q ${p(0, -346)} ${p(56, -330)} L ${p(48, -212)} L ${p(-48, -212)} Z`, shirt);
	g += hand(-1);
	if (tailor) {
		g += shape(`M ${p(-46, -326)} L ${p(-16, -336)} L ${p(0, -286)} L ${p(16, -336)} L ${p(46, -326)} L ${p(48, -214)} L ${p(0, -204)} L ${p(-48, -214)} Z`, paint ? paint.fill : mix('purple', 55));
		for (const v of [-272, -252, -232]) g += `<circle cx="${r1(cx)}" cy="${r1(ground + v * s)}" r="${r1(3.5 * s)}" fill="${paint ? paint.stroke : '#fff'}"/>`;
		// The tape measure round the neck, hanging down both sides.
		for (const k of [-1, 1]) g += `<path d="M ${p(14 * k, -338)} L ${p(24 * k, -246)} L ${p(34 * k, -246)} L ${p(26 * k, -340)} Z" fill="${paint ? 'none' : TAPE.fill}" stroke="${paint ? paint.stroke : TAPE.line}" stroke-width="${r1(lw * 0.6)}"/>`;
		// A notepad in the right hand.
		g += shape(`M ${p(74, -244)} L ${p(106, -248)} L ${p(110, -200)} L ${p(78, -196)} Z`, '#fff', lw * 0.8);
		for (const v of [-236, -226, -216]) g += `<line x1="${r1(cx + 84 * s)}" y1="${r1(ground + v * s)}" x2="${r1(cx + 102 * s)}" y2="${r1(ground + (v - 2) * s)}" stroke="${ol}" stroke-width="${r1(lw * 0.4)}"/>`;
		g += hand(1);
	} else {
		g += hand(1);
		// A tape measure wrapped round the chest.
		g += `<path d="M ${p(-54, -296)} Q ${p(0, -284)} ${p(54, -296)} L ${p(53, -282)} Q ${p(0, -270)} ${p(-53, -282)} Z" fill="${paint ? 'none' : TAPE.fill}" stroke="${paint ? paint.stroke : TAPE.line}" stroke-width="${r1(lw * 0.6)}"/>`;
		for (let i = -4; i <= 4; i++) g += `<line x1="${r1(cx + i * 11 * s)}" y1="${r1(ground - (288 - Math.abs(i) * 0.6) * s)}" x2="${r1(cx + i * 11 * s)}" y2="${r1(ground - (283 - Math.abs(i) * 0.6) * s)}" stroke="${paint ? paint.stroke : TAPE.tick}" stroke-width="${r1(Math.max(1, lw * 0.35))}"/>`;
		g += shape(`M ${p(-14, -336)} L ${p(0, -318)} L ${p(14, -336)}`, 'none', lw * 0.7);
	}
	// Neck, head, ears, face and hair.
	g += shape(`M ${p(-10, -350)} L ${p(10, -350)} L ${p(10, -332)} L ${p(-10, -332)} Z`, skin, lw * 0.7);
	for (const k of [-1, 1]) g += `<circle cx="${r1(cx + 30 * k * s)}" cy="${r1(ground - 376 * s)}" r="${r1(6 * s)}" fill="${paint ? paint.fill : skin}" stroke="${ol}" stroke-width="${r1(lw * 0.7)}"/>`;
	g += `<circle cx="${r1(cx)}" cy="${r1(ground - 378 * s)}" r="${r1(30 * s)}" fill="${paint ? paint.fill : skin}" stroke="${ol}" stroke-width="${lw}"/>`;
	g += tailor
		? shape(`M ${p(-31, -382)} Q ${p(-30, -414)} ${p(0, -412)} Q ${p(30, -414)} ${p(31, -382)} Q ${p(24, -396)} ${p(0, -398)} Q ${p(-24, -396)} ${p(-31, -382)} Z`, '#8d939b', lw * 0.7)
		: shape(`M ${p(-31, -380)} Q ${p(-34, -416)} ${p(2, -414)} Q ${p(34, -414)} ${p(31, -378)} Q ${p(14, -400)} ${p(-6, -394)} Q ${p(-22, -392)} ${p(-31, -380)} Z`, '#4a3426', lw * 0.7);
	for (const k of [-1, 1]) g += `<circle cx="${r1(cx + 10 * k * s)}" cy="${r1(ground - 380 * s)}" r="${r1(3 * s)}" fill="${ol}"/>`;
	if (tailor) for (const k of [-1, 1]) g += `<circle cx="${r1(cx + 10 * k * s)}" cy="${r1(ground - 380 * s)}" r="${r1(8 * s)}" fill="none" stroke="${ol}" stroke-width="${r1(lw * 0.5)}"/>`;
	if (tailor) g += `<line x1="${r1(cx - 2 * s)}" y1="${r1(ground - 380 * s)}" x2="${r1(cx + 2 * s)}" y2="${r1(ground - 380 * s)}" stroke="${ol}" stroke-width="${r1(lw * 0.5)}"/>`;
	g += `<path d="M ${p(-1, -376)} L ${p(-3, -369)} L ${p(1, -369)}" fill="none" stroke="${ol}" stroke-width="${r1(lw * 0.45)}" stroke-linecap="round"/>`;
	g += `<path d="M ${p(-9, -362)} Q ${p(0, -355)} ${p(9, -362)}" fill="none" stroke="${ol}" stroke-width="${r1(lw * 0.55)}" stroke-linecap="round"/>`;
	return g;
}

/** A low wooden platform the customer stands on to be measured. */
const platform = (cx, y, w) => `<path d="M ${r1(cx - w / 2)} ${r1(y)} L ${r1(cx + w / 2)} ${r1(y)} L ${r1(cx + w / 2 - 10)} ${r1(y + 22)} L ${r1(cx - w / 2 + 10)} ${r1(y + 22)} Z" fill="${WOOD.fill}" stroke="${WOOD.line}" stroke-width="3" stroke-linejoin="round"/>`;
/** A shop floor line. */
const floor = (x0, x1, y) => `<line x1="${r1(x0)}" y1="${r1(y)}" x2="${r1(x1)}" y2="${r1(y)}" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>`;
/** A wooden bench top. */
const bench = (x0, x1, y) => `<rect x="${r1(x0)}" y="${r1(y)}" width="${r1(x1 - x0)}" height="18" rx="6" fill="#e9ddc7" stroke="#a88c5f" stroke-width="3"/>`;

/** An order slip: a white card, the request on top, then one tape per measurement with its name
 * and value. Returns { svg, html }. */
function orderSlip(x, y, w, s, { label = 'Request', need = [], names = [], showValues = true, hid = false } = {}) {
	const rowH = 46, top = y + (s ? 104 : 74), h = (s ? 116 : 86) + need.length * rowH;
	let svg = `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="14" fill="#fff" stroke="var(--blue)" stroke-width="4"/>`;
	let html = `<div class="gtl-a${hid ? ' gtl-hid' : ''}" style="${at(x + 22, y + 16, w - 70)}"><div class="lbl" style="color:var(--blue)" data-t>${fmt(label)}</div>${s ? `<div class="gtl-req" data-t>${fmt(s)}</div>` : ''}</div>`;
	need.forEach((v, i) => {
		const ry = top + i * rowH;
		svg += tapeRow(x + 148, ry, w - 226, { need: v });
		html += T('gtl-a gtl-tn nolint', x + 20, ry - 6, fmt(names[i] ?? ''), { hid });
		if (showValues) html += T('gtl-a gtl-tv nolint', x + w - 64, ry - 4, esc(String(v).replace(/^0/, '')), { hid });
	});
	return { svg, html, h };
}

// ---------- shared CSS: every selector starts with the design's class ----------
function css(n, extra = '') {
	return `
.${n} { position: relative; width: ${W}px; }
.${n}.gtl-bare { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.${n} .rd-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.${n} .gtl-a { position: absolute; }
.${n} .gtl-cx { position: absolute; transform: translateX(-50%); text-align: center; }
.${n} .gtl-lg { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); line-height: 0; }
.${n} .gtl-name { font-size: 26px; font-weight: 600; color: var(--ink); line-height: 1.2; white-space: nowrap; }
.${n} .gtl-sub { font-size: 22px; color: var(--body); line-height: 1.3; white-space: nowrap; }
.${n} .gtl-big { font-size: 72px; font-weight: 700; letter-spacing: -.035em; line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.${n} .gtl-num { font-size: 24px; font-weight: 700; line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.${n} .gtl-price { font-size: 21px; font-weight: 700; color: var(--ink); white-space: nowrap; font-variant-numeric: tabular-nums; }
.${n} .gtl-req { font-size: 23px; font-weight: 600; color: var(--ink); line-height: 1.25; }
.${n} .gtl-tn { font-size: 19px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.${n} .gtl-tv { font-size: 21px; font-weight: 700; color: var(--blue); white-space: nowrap; font-variant-numeric: tabular-nums; }
.${n} .gtl-tagbox { position: absolute; display: flex; align-items: center; justify-content: center; }
.${n} .gtl-hid { visibility: hidden; }
${extra}`;
}
const T = (cls, x, y, html, { w = null, nolint = false, hid = false, style = '', fit = false } = {}) =>
	`<div class="${cls}${nolint ? ' nolint' : ''}${hid ? ' gtl-hid' : ''}" style="${at(x, y, w)}${style ? ';' + style : ''}" data-t${fit ? ' data-fit' : ''}>${html}</div>`;
const LG = (x, y, inner, hid = false) => `<div class="gtl-lg${hid ? ' gtl-hid' : ''}" style="${at(x, y)}">${inner}</div>`;
const svgVis = show => (show ? '' : ' visibility="hidden"');
const NEEDS = ['Reasoning', 'Code gen', 'Debugging', 'Tool use'];

/** The left column of a cover: eyebrow, title, sub, authors (with a line break after authorBreak names), affiliation,
 * product line and pills, in the built-in title styles. */
function coverLeft(s, n, width = 820) {
	const names = (s.authors ?? []).map(a => `<span class="${n}-au" style="white-space:nowrap">${fmt(a)}</span>`);
	const dot = ' <span class="' + n + '-dot">\u00b7</span> ', cut = s.authorBreak ?? names.length;
	const authors = [names.slice(0, cut).join(dot), names.slice(cut).join(dot)].filter(Boolean).join('<br>');
	const product = s.product ? `<div class="${n}-prod">${(s.product.logos ?? []).map(l => logo(l, 40)).join('')}<span class="${n}-prod-t" data-t>${fmt(s.product.text)}</span></div>` : '';
	const pills = s.pills ? `<div class="tf-pills">${s.pills.map(pill).join('')}</div>` : '';
	return `<div class="tf-left ${n}-left" style="width:${width}px"><div class="st-eyebrow" data-t>${fmt(s.eyebrow ?? '')}</div><div class="st-title-xl tf-title" data-t>${fmt(s.title ?? '')}</div>${s.sub ? `<div class="tf-quote" data-t>${fmt(s.sub)}</div>` : ''}${authors ? `<div class="${n}-authors nolint" data-t>${authors}</div>` : ''}${s.affil ? `<div class="${n}-affil" data-t>${fmt(s.affil)}</div>` : ''}${product}${pills}</div>`;
}
const coverCss = n => `
.${n} .${n}-authors { margin-top: 34px; font-size: 23px; line-height: 1.5; color: var(--ink); font-weight: 600; }
.${n} .${n}-authors .${n}-dot { color: var(--faint); margin: 0 10px; font-weight: 400; }
.${n} .${n}-affil { margin-top: 4px; font-size: 21px; color: var(--body); }
.${n} .${n}-prod { margin-top: 30px; display: flex; align-items: center; gap: 14px; }
.${n} .${n}-prod-t { font-size: 23px; color: var(--ink); font-weight: 600; margin-left: 4px; }
`;

/** A product mark: its logo when the slide gives one, else an icon (default a box). */
const mk = (m, size, color = null) => (m?.logo ? logo(m.logo, size, color) : ic(m?.icon ?? 'cube', size, color ?? 'var(--muted)'));

// ---------- the designs ----------
export const designs = {
	/** Cover: the request's order slip in a sign holder on top of a clothes rail on wheels (its four measurements on
	 * tapes); jackets hang on the rail from cheapest to dearest, a price tag on a string under each; the cheapest that
	 * fits is in colour with a green tag and a tick, the cheaper ones say they are too small, the dearer ones are greyed.
	 * A low crossbar carries the cheapest-to-dearest arrow. Fields: eyebrow, title, sub, authors, authorBreak, affil,
	 * product: { logos, text }, pills, request, requestLabel, needs (4 names), need (4 values 0..1), jackets (cheapest
	 * first): [{ price }], pick (index), fits (word under the picked tag), small (word under the cheaper tags),
	 * rail: { from, to }. */
	'gtl-cover-rail': {
		bare: true,
		css: css('gtl-cover-rail', coverCss('gtl-cover-rail') + `
.gtl-cover-rail .gtl-rail { font-size: 21px; color: var(--body); white-space: nowrap; }
.gtl-cover-rail .gtl-fit { display: flex; align-items: center; gap: 6px; font-size: 21px; font-weight: 700; white-space: nowrap; }
`),
		render(s) {
			const n = 'gtl-cover-rail', jackets = s.jackets ?? [], pick = s.pick ?? 1;
			let svg = '', html = '';
			const barY = 470, x0 = 1010, x1 = 1770, floorY = 1012, pitch = (x1 - x0) / jackets.length, jw = 160;
			// The order slip, in a sign holder on top of the rail.
			const slip = orderSlip(1060, 60, 620, s.request, { label: s.requestLabel ?? 'Request', need: s.need ?? [], names: s.needs ?? NEEDS });
			for (const px of [1160, 1580]) svg += `<rect x="${px - 5}" y="${60 + slip.h - 4}" width="10" height="${r1(barY - 60 - slip.h + 2)}" rx="4" fill="${CHROME.fill}" stroke="${CHROME.line}" stroke-width="2.5"/><rect x="${px - 18}" y="${60 + slip.h - 10}" width="36" height="14" rx="4" fill="${CHROME.mid}" stroke="${CHROME.line}" stroke-width="2.5"/>`;
			svg += slip.svg;
			html += slip.html;
			// The rail on wheels and its jackets; the tags hang from a button under each jacket.
			let hangers = '';
			jackets.forEach((j, i) => {
				const cx = x0 + pitch * (i + 0.5), on = i === pick, small = i < pick;
				const J = jacket(cx, barY - 12 * (jw / 200), jw, { dim: !on });
				hangers += J.svg;
				const tx = cx - 50, ty = J.bottom + 22;
				hangers += tagSvg(tx, ty, 100, 58, { from: [cx - 2, J.bottom - 4], tone: on ? 'green' : small ? 'red' : 'neutral' });
				html += tagText(tx, ty, 100, 58, esc(j.price ?? ''));
				const word = on ? s.fits : small ? s.small : null;
				if (word) html += `<div class="gtl-cx gtl-fit" style="${at(cx, ty + 68)};color:var(--${on ? 'green' : 'red'})" data-t>${ic(on ? 'checkmark' : 'dismiss', 22)}<span>${fmt(word)}</span></div>`;
			});
			const ay = 902;
			svg += clothesRail(x0 - 20, x1 + 20, barY, floorY) + `<rect x="${x0 - 20}" y="${ay + 16}" width="${x1 - x0 + 40}" height="12" rx="6" fill="${CHROME.fill}" stroke="${CHROME.line}" stroke-width="3"/>` + hangers;
			svg += `<line x1="${x0 + 60}" y1="${ay}" x2="${x1 - 70}" y2="${ay}" stroke="var(--faint)" stroke-width="4" stroke-linecap="round"/><path d="M ${x1 - 84} ${ay - 12} L ${x1 - 68} ${ay} L ${x1 - 84} ${ay + 12}" fill="none" stroke="var(--faint)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
			html += T('gtl-a gtl-rail', x0 + 60, ay - 40, fmt(s.rail?.from ?? ''), { nolint: true });
			html += `<div class="gtl-rail nolint" style="position:absolute;right:${1920 - x1 + 70}px;top:${ay - 40}px" data-t>${fmt(s.rail?.to ?? '')}</div>`;
			return `<div class="${n} gtl-bare">${layer(1080, svg, 1920)}${coverLeft(s, n, 860)}${html}${msLogo()}</div>`;
		},
	},

	/** The old router as a shop with two sizes: one tape (one score) and a wall rail with only two jackets, small and
	 * large; on the right the whole pool on one rail, only those two in colour; a stamp for what every change costs.
	 * Fields: eyebrow, title, before: { label, text }, need (one value), pool: { label, text }, models: [{ name (\n
	 * allowed), logo or icon, on, role, big (the larger of the two; default: role is 'Strong') }], stamp. */
	'gtl-two-sizes': {
		css: css('gtl-two-sizes', `
.gtl-two-sizes .gtl-mname { font-size: 19px; font-weight: 600; color: var(--ink); line-height: 1.15; text-align: center; white-space: nowrap; }
.gtl-two-sizes .gtl-mname.off { color: var(--muted); font-weight: 500; }
.gtl-two-sizes .gtl-role { display: flex; align-items: center; gap: 8px; font-size: 21px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gtl-two-sizes .gtl-stamp { position: absolute; transform: rotate(-5deg); border: 5px solid var(--red); color: var(--red); border-radius: 14px; padding: 8px 24px; font-size: 30px; font-weight: 700; white-space: nowrap; background: #fff; }
.gtl-two-sizes .gtl-say { font-size: 28px; font-weight: 600; color: var(--ink); line-height: 1.25; }
`),
		render(s) {
			const H = bodyHeight(s), models = s.models ?? [];
			let svg = '', html = '';
			// Left: one tape, one mark; a rail with only two sizes.
			html += T('gtl-a lbl', 0, 0, fmt(s.before?.label ?? ''), { style: 'color:var(--blue)' });
			svg += tapeRow(10, 84, 560, { need: s.need ?? 0.6 });
			html += T('gtl-a gtl-say', 0, 128, fmt(s.before?.text ?? ''), { w: 600 });
			const big = m => m.big ?? m.role === 'Strong';
			const known = models.filter(m => m.on).sort((a, b) => big(a) - big(b));
			svg += clothesRail(40, 600, 250, 0, { wheels: false });
			known.forEach((m, i) => {
				const strong = big(m), w = strong ? 176 : 122, cx = i ? 450 : 170;
				const J = jacket(cx, 250 - 12 * (w / 200), w);
				svg += J.svg;
				html += `<div class="gtl-a gtl-role nolint" style="${at(cx - 110, 562, 220)};justify-content:center" data-t>${mk(m, 26)}<span>${fmt(m.name.replace('\n', ' '))}</span></div>`;
				html += T('gtl-cx lbl', cx, 600, fmt(m.role ?? ''), { style: `color:var(--${strong ? 'purple' : 'body'})` });
			});
			svg += `<line x1="680" y1="10" x2="680" y2="${H - 10}" stroke="var(--line)" stroke-width="3"/>`;
			// Right: the whole pool.
			const px0 = 740, pitch = (W - px0) / Math.max(1, models.length), ry = 96;
			html += T('gtl-a lbl', px0, 0, fmt(s.pool?.label ?? ''));
			svg += clothesRail(px0 + 20, W - 20, ry, 0, { wheels: false });
			let jk = '';
			models.forEach((m, i) => {
				const cx = px0 + pitch * (i + 0.5), J = jacket(cx, ry - 12 * 0.46, 92, { dim: !m.on });
				jk += J.svg;
				html += LG(cx, J.bottom + 26, mk(m, 26, m.on ? null : '#b9bcc4'));
				html += T(`gtl-cx gtl-mname nolint${m.on ? '' : ' off'}`, cx, J.bottom + 48, fmt(m.name).replace('\n', '<br>'));
			});
			svg += jk;
			html += T('gtl-a gtl-say', px0, 400, fmt(s.pool?.text ?? ''), { w: 440 });
			if (s.stamp) {
				// A new jacket arrives on its own hanger: the old router can't use it until it is retrained.
				const nx = W - 110;
				svg += clothesRail(nx - 90, nx + 90, 420, 0, { wheels: false }) + jacket(nx, 420 - 12 * 0.6, 120, { ghost: true, tone: 'orange' }).svg;
				html += T('gtl-stamp', px0 + 20, 520, fmt(s.stamp));
			}
			return heading(s) + body(`<div class="gtl-two-sizes" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** How a request is read: the customer stands on the platform with a tape round the chest and says what they
	 * need; the tailor (a small encoder: its name above) takes the measurements; out comes the order slip with four
	 * measurements. Click 1: customer and tailor; click 2: the slip. Fields: eyebrow, title, request, reader: { name,
	 * sub }, slip (label on the slip), needs (4), need (4), chip: { icon, text }. */
	'gtl-measure': {
		clicks: true,
		css: css('gtl-measure', `
.gtl-measure .gtl-bubble { position: absolute; box-sizing: border-box; display: flex; align-items: center; background: #fff; border: 4px solid var(--blue); border-radius: 22px; padding: 16px 22px; font-size: 25px; font-weight: 600; color: var(--ink); line-height: 1.25; }
.gtl-measure .gtl-who { font-size: 27px; font-weight: 700; color: var(--purple); white-space: nowrap; }
.gtl-measure .gtl-chip { position: absolute; display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 600; color: var(--purple); white-space: nowrap; }
.gtl-measure .gtl-tn { font-size: 22px; }
.gtl-measure .gtl-tv { font-size: 24px; }
`),
		render(s, ctx = {}) {
			const H = bodyHeight(s), step = ctx.step ?? Infinity, on2 = step >= 2;
			let svg = '', html = '';
			const floorY = 650;
			svg += floor(0, W, floorY);
			// The customer on the platform, and what they ask for.
			const cu = { cx: 250, ground: floorY - 22 };
			svg += platform(cu.cx, cu.ground, 240) + person(cu.cx, cu.ground, 450, { role: 'customer' });
			html += `<div class="gtl-bubble" style="${at(10, 0, 470, 112)}" data-fit>${fmt(s.request ?? '')}</div>`;
			svg += `<path d="M ${cu.cx + 10} 108 L ${cu.cx + 34} 168 L ${cu.cx + 54} 108" fill="#fff" stroke="var(--blue)" stroke-width="4" stroke-linejoin="round"/><rect x="${cu.cx + 6}" y="100" width="52" height="10" fill="#fff"/>`;
			// The tailor, with the encoder's name over them, holding out a tape to the customer's chest.
			const tx = 690, sc = 450 / 420;
			svg += person(tx, floorY, 450, { role: 'tailor' });
			const ha = [tx - 78 * sc, floorY - 210 * sc], hb = [cu.cx + 56 * (450 / 420), cu.ground - 288 * (450 / 420)];
			svg += `<path d="M ${r1(ha[0])} ${r1(ha[1])} Q ${r1((ha[0] + hb[0]) / 2)} ${r1(ha[1] + 30)} ${r1(hb[0])} ${r1(hb[1])}" fill="none" stroke="${TAPE.line}" stroke-width="13" stroke-linecap="round"/><path d="M ${r1(ha[0])} ${r1(ha[1])} Q ${r1((ha[0] + hb[0]) / 2)} ${r1(ha[1] + 30)} ${r1(hb[0])} ${r1(hb[1])}" fill="none" stroke="${TAPE.fill}" stroke-width="9" stroke-linecap="round"/><path d="M ${r1(ha[0])} ${r1(ha[1])} Q ${r1((ha[0] + hb[0]) / 2)} ${r1(ha[1] + 30)} ${r1(hb[0])} ${r1(hb[1])}" fill="none" stroke="${TAPE.tick}" stroke-width="5" stroke-dasharray="1.5 9"/>`;
			html += T('gtl-cx gtl-who nolint', tx, 112, fmt(s.reader?.name ?? ''));
			html += T('gtl-cx gtl-sub', tx, 150, fmt(s.reader?.sub ?? ''));
			// Out comes the order slip.
			const sx = 940, sy = 120;
			const slip = orderSlip(sx, sy, W - sx, '', { label: s.slip ?? 'Needs', need: s.need ?? [], names: s.needs ?? NEEDS, hid: !on2 });
			svg += `<g${svgVis(on2)}>${slip.svg}<path d="M ${tx + 130} 420 C ${tx + 190} 420 ${sx - 80} 330 ${sx - 22} 330" fill="none" stroke="var(--purple)" stroke-width="5" stroke-linecap="round"/><path d="M ${sx - 38} 316 L ${sx - 20} 330 L ${sx - 38} 344" fill="none" stroke="var(--purple)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
			html += slip.html;
			html += `<div class="gtl-chip${on2 ? '' : ' gtl-hid'}" data-key="chip" style="${at(sx + 24, sy + slip.h + 26)}" data-t>${ic(s.chip?.icon ?? 'timer', 30)}<span>${fmt(s.chip?.text ?? '')}</span></div>`;
			return heading(s) + body(`<div class="gtl-measure" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** The hardest slide: three jackets tried against the same measurements, cheapest first. Each column: the model's
	 * logo, name and price; its jacket on a wall rail with the price tag; one tape per measurement (the customer's mark,
	 * the jacket's size as a strip of its cloth, a red gap where it falls short); the shortfall and a verdict. One column
	 * per click. Fields: eyebrow, title, order (words over the columns), needs (4), need (4), jackets (cheapest first):
	 * [{ name, logo, price, size (4), shortfall, verdict }], shortLabel. */
	'gtl-try-on': {
		clicks: true,
		css: css('gtl-try-on', `
.gtl-try-on .gtl-head { position: absolute; display: flex; align-items: center; gap: 12px; transform: translateX(-50%); }
.gtl-try-on .gtl-short { font-size: 52px; font-weight: 700; letter-spacing: -.03em; line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gtl-try-on .gtl-tn { font-size: 20px; }
`),
		render(s, ctx = {}) {
			const H = bodyHeight(s), step = ctx.step ?? Infinity;
			const J = s.jackets ?? [], need = s.need ?? [], names = s.needs ?? NEEDS;
			const L = 150, colW = (W - L) / Math.max(1, J.length);
			let svg = '', html = '';
			svg += `<line x1="${L + 40}" y1="10" x2="${W - 40}" y2="10" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/><path d="M ${W - 54} -2 L ${W - 40} 10 L ${W - 54} 22" fill="none" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
			html += T('gtl-a lbl', L + 40, 20, fmt(s.order ?? ''));
			const rowY = k => 420 + k * 50;
			svg += clothesRail(L + 40, W - 30, 150, 0, { wheels: false });
			names.forEach((nm, k) => { html += T('gtl-a gtl-tn nolint', 0, rowY(k) - 2, fmt(nm)); });
			J.forEach((j, i) => {
				const show = step >= i + 1, cx = L + colW * (i + 0.5);
				const fits = need.every((v, k) => (j.size?.[k] ?? 0) >= v - 1e-9), tone = fits ? 'green' : 'red';
				const done = step >= J.length;
				const JK = jacket(cx, 150 - 12 * 0.72, 144, { dim: done && !fits });
				let g = JK.svg;
				const tgx = JK.cuffR[0] + 24, tgy = JK.cuffR[1] - 14;
				g += tagSvg(tgx, tgy, 104, 56, { from: JK.cuffR, tone: fits ? 'green' : 'neutral' });
				html += tagText(tgx, tgy, 104, 56, esc(j.price ?? ''), { hid: !show });
				need.forEach((v, k) => { g += tapeRow(cx - colW / 2 + 40, rowY(k), colW - 90, { need: v, cap: j.size?.[k] ?? 0 }); });
				svg += `<g${svgVis(show)}>${g}</g>`;
				html += `<div class="gtl-head${show ? '' : ' gtl-hid'}" data-key="head-${i}" style="${at(cx, 54)}">${j.logo ? logo(j.logo, 34) : ''}<span class="gtl-name nolint" data-t>${fmt(j.name)}</span></div>`;
				html += T('gtl-a lbl', cx - colW / 2 + 40, 618, fmt(s.shortLabel ?? 'Shortfall'), { hid: !show, style: `color:var(--${tone})` });
				html += T('gtl-a gtl-short', cx - colW / 2 + 40, 640, esc(j.shortfall ?? ''), { hid: !show, style: `color:var(--${tone})` });
				html += `<div class="gtl-a${show ? '' : ' gtl-hid'}" style="${at(cx + 10, 640)}">${pill({ text: j.verdict ?? '', tone, icon: fits ? 'checkCircle' : 'dismissCircle' })}</div>`;
			});
			return heading(s) + body(`<div class="gtl-try-on" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** The catalogue as two wall rails under a sign with the file's name: the jackets added hang on the top rail (a green
	 * plus on each tag), the empty hangers of the ones removed on the bottom rail (a dashed outline, a red minus); a big
	 * counter on the right. Fields: eyebrow, title, file, added: { label, count }, removed: { label, count },
	 * counter: { value, label, sub }, note: { icon, text }. */
	'gtl-rails': {
		css: css('gtl-rails', `
.gtl-rails .gtl-file { position: absolute; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 23px; font-weight: 600; color: var(--ink); background: #fff; border: 3px solid var(--line-strong); border-radius: 6px 16px 6px 6px; padding: 6px 20px; white-space: nowrap; }
.gtl-rails .gtl-count { font-size: 220px; font-weight: 700; letter-spacing: -.04em; line-height: .9; color: var(--green); }
.gtl-rails .gtl-cl { font-size: 34px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gtl-rails .gtl-note { display: flex; align-items: flex-start; gap: 14px; font-size: 25px; line-height: 1.3; color: var(--ink); }
.gtl-rails .gtl-note .ic { flex: none; margin-top: 2px; }
`),
		render(s) {
			const H = bodyHeight(s), add = s.added?.count ?? 6, rem = s.removed?.count ?? 3;
			let svg = '', html = '';
			const X0 = 30, X1 = 1060, pitch = (X1 - X0) / 6, jw = 122;
			html += `<div class="gtl-file nolint" style="${at((X0 + X1) / 2, -2)}" data-t>${ic('documentText', 26, 'var(--muted)')}<span>${esc(s.file ?? 'models.yaml')}</span></div>`;
			const rows = [{ y: 150, n: add, kind: 'add', g: s.added }, { y: 458, n: rem, kind: 'rem', g: s.removed }];
			rows.forEach(r => {
				const tone = r.kind === 'add' ? 'green' : 'red';
				html += T('gtl-a lbl', X0 + 10, r.y - 72, fmt(`${r.g?.label ?? (r.kind === 'add' ? 'Added' : 'Removed')}: ${r.n}`), { style: `color:var(--${tone});font-size:20px;font-weight:700` });
				svg += clothesRail(X0 + 10, X1 + 50, r.y, 0, { wheels: false });
				for (let i = 0; i < r.n; i++) {
					const cx = X0 + pitch * (i + 0.5), J = jacket(cx, r.y - 12 * (jw / 200), jw, r.kind === 'add' ? {} : { ghost: true, tone: 'red' });
					svg += J.svg;
					const tx = J.cuffR[0] - 6, ty = J.cuffR[1] + 14;
					svg += tagSvg(tx, ty, 48, 50, { from: J.cuffR, tone });
					html += `<div class="gtl-tagbox" style="${at(tx, ty + 16, 48, 34)}">${ic(r.kind === 'add' ? 'add' : 'subtract', 24, `var(--${tone})`)}</div>`;
				}
			});
			const cx = 1190;
			html += T('gtl-a gtl-count', cx, 90, esc(s.counter?.value ?? '0'));
			html += T('gtl-a gtl-cl', cx + 8, 312, fmt(s.counter?.label ?? ''));
			html += T('gtl-a gtl-sub', cx + 8, 360, fmt(s.counter?.sub ?? ''));
			svg += `<line x1="${cx + 8}" y1="450" x2="${W}" y2="450" stroke="var(--line)" stroke-width="3"/>`;
			if (s.note) html += `<div class="gtl-a gtl-note" style="${at(cx + 8, 490, W - cx - 8)}" data-t>${ic(s.note.icon ?? 'checkCircle', 32, 'var(--green)')}<span>${fmt(s.note.text)}</span></div>`;
			return heading(s) + body(`<div class="gtl-rails" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** Cost as coins you can count: one row per router, ten stacks of ten coins for the full price, the stacks it saved
	 * drawn as green dashed outlines; on the right what it saved and the quality it kept. The highlighted row is bold, the
	 * rest grey. Fields: eyebrow, title, heads: { cost, saved, quality }, rows: [{ name, logo, sub, cost (% of the full
	 * price), saved, quality, hi }]. */
	'gtl-coins': {
		css: css('gtl-coins', `
.gtl-coins .gtl-rn { display: flex; align-items: center; gap: 12px; }
.gtl-coins .gtl-rbig { font-size: 60px; font-weight: 700; letter-spacing: -.03em; line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gtl-coins .gtl-muted { color: var(--muted) !important; }
`),
		render(s) {
			const H = bodyHeight(s);
			let svg = '', html = '';
			const rows = s.rows ?? [], rowH = 200, y0 = 40;
			const X = { coins: 400, step: 72, saved: 1230, quality: 1500 };
			html += T('gtl-a lbl', X.coins - 30, 60, fmt(s.heads?.cost ?? ''));
			html += T('gtl-a lbl', X.saved, 60, fmt(s.heads?.saved ?? ''));
			html += T('gtl-a lbl', X.quality, 60, fmt(s.heads?.quality ?? ''));
			const coin = (x, y, on) => `<ellipse cx="${r1(x)}" cy="${r1(y + 5)}" rx="28" ry="9" fill="${on ? '#c99a1c' : '#c4c8cf'}"/><ellipse cx="${r1(x)}" cy="${r1(y)}" rx="28" ry="9" fill="${on ? 'var(--yellow)' : '#eceef1'}" stroke="${on ? '#a87d00' : '#b9bcc4'}" stroke-width="2.5"/>`;
			rows.forEach((r, i) => {
				const yc = y0 + rowH * i + rowH / 2, base = yc + 56, on = !!r.hi;
				if (i) {
					svg += `<line x1="0" y1="${y0 + rowH * i}" x2="${W}" y2="${y0 + rowH * i}" stroke="var(--line)" stroke-width="2"/>`;
				}
				const coins = Math.round((r.cost ?? 100));
				for (let st = 0; st < 10; st++) {
					const x = X.coins + st * X.step, n = Math.max(0, Math.min(10, coins - st * 10));
					if (!n) {
						svg += `<ellipse cx="${x}" cy="${base}" rx="28" ry="9" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="7 6"/>`;
						continue;
					}
					for (let c = 0; c < n; c++) {
						svg += coin(x, base - c * 9, on);
					}
				}
				html += `<div class="gtl-a gtl-rn" style="${at(0, yc - 44)}">${r.logo ? logo(r.logo, 34, on ? null : '#b9bcc4') : ''}<span class="gtl-name nolint${on ? '' : ' gtl-muted'}" data-t>${fmt(r.name)}</span></div>`;
				html += T(`gtl-a gtl-sub${on ? '' : ' gtl-muted'}`, 0, yc + 2, fmt(r.sub ?? ''), { style: on ? 'color:var(--ink);font-weight:600' : '' });
				html += T(`gtl-a gtl-rbig${on ? '' : ' gtl-muted'}`, X.saved, yc - 30, esc(r.saved ?? ''), { style: on ? 'color:var(--green)' : '' });
				html += T(`gtl-a gtl-rbig${on ? '' : ' gtl-muted'}`, X.quality, yc - 30, esc(r.quality ?? ''), { style: on ? 'color:var(--ink)' : '' });
			});
			return heading(s) + body(`<div class="gtl-coins" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** The same routing in every language: one row per language group (a sewn-in garment label with a letter of its script), on a
	 * scale: the router's dot and the strongest single model's ring, joined; the router's dots sit in one narrow band. Fields:
	 * eyebrow, title, axis: { from, to, label }, band: { from, to, label }, legend: { a, b }, rows: [{ name, glyph, n, a, b }]. */
	'gtl-languages': {
		css: css('gtl-languages', `
.gtl-languages .gtl-glyph { position: absolute; transform: translate(-50%, -50%); font-size: 24px; font-weight: 700; color: var(--blue); line-height: 1; }
.gtl-languages .gtl-lv { font-size: 26px; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gtl-languages .gtl-leg { display: flex; align-items: center; gap: 10px; font-size: 22px; color: var(--body); white-space: nowrap; }
.gtl-languages .gtl-tick { font-size: 20px; color: var(--body); white-space: nowrap; font-variant-numeric: tabular-nums; }
`),
		render(s) {
			const H = bodyHeight(s);
			let svg = '', html = '';
			const a0 = s.axis?.from ?? 79, a1 = s.axis?.to ?? 85, X0 = 520, X1 = 1640;
			const X = v => X0 + ((v - a0) / (a1 - a0)) * (X1 - X0);
			const rows = s.rows ?? [], top = 120, step = 118, axisY = top + step * rows.length - 30;
			// The band the router stays in.
			const b0 = X(s.band?.from ?? 80), b1 = X(s.band?.to ?? 81);
			svg += `<rect x="${r1(b0)}" y="${top - 52}" width="${r1(b1 - b0)}" height="${axisY - top + 40}" rx="10" fill="${mix('blue', 14)}"/>`;
			html += T('gtl-cx lbl', (b0 + b1) / 2, top - 92, fmt(s.band?.label ?? ''), { style: 'color:var(--blue)' });
			for (let v = a0; v <= a1; v += 2) {
				svg += `<line x1="${r1(X(v))}" y1="${axisY}" x2="${r1(X(v))}" y2="${axisY + 12}" stroke="var(--faint)" stroke-width="3"/>`;
				html += T('gtl-cx gtl-tick nolint', X(v), axisY + 18, esc(String(v)));
			}
			svg += `<line x1="${X0 - 20}" y1="${axisY}" x2="${X1 + 20}" y2="${axisY}" stroke="var(--faint)" stroke-width="3"/>`;
			html += T('gtl-a lbl', X0 - 20, axisY + 56, fmt(s.axis?.label ?? ''));
			rows.forEach((r, i) => {
				const y = top + step * i;
				// A sewn-in garment label with a letter of the group's script on it.
				svg += `<path d="M 6 ${y - 30} L 70 ${y - 30} L 70 ${y + 26} L 38 ${y + 34} L 6 ${y + 26} Z" fill="${mix('blue', 10)}" stroke="var(--blue)" stroke-width="3" stroke-linejoin="round"/>`;
				svg += `<path d="M 12 ${y - 24} L 64 ${y - 24} L 64 ${y + 22} L 38 ${y + 28} L 12 ${y + 22} Z" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
				svg += `<rect x="2" y="${y - 38}" width="72" height="10" rx="3" fill="${mix('blue', 25)}" stroke="var(--blue)" stroke-width="2"/>`;
				html += `<div class="gtl-glyph nolint" style="${at(38, y)}" data-t>${esc(r.glyph ?? '')}</div>`;
				html += T('gtl-a gtl-name nolint', 92, y - 26, fmt(r.name));
				html += T('gtl-a gtl-sub nolint', 92, y + 6, fmt(r.n ?? ''));
				svg += `<line x1="${r1(X(r.a))}" y1="${y}" x2="${r1(X(r.b))}" y2="${y}" stroke="#a9aeb6" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8"/>`;
				svg += `<circle cx="${r1(X(r.b))}" cy="${y}" r="11" fill="#fff" stroke="#b9bcc4" stroke-width="4"/>`;
				svg += `<circle cx="${r1(X(r.a))}" cy="${y}" r="15" fill="var(--blue)"/>`;
				html += `<div class="gtl-lv nolint" style="position:absolute;right:${r1(W - X(r.a) + 34)}px;top:${y - 16}px;color:var(--blue)" data-t>${esc((+r.a).toFixed(1))}</div>`;
				html += T('gtl-a gtl-lv nolint', X(r.b) + 24, y - 14, esc((+r.b).toFixed(1)), { style: 'color:var(--muted);font-weight:500;font-size:22px' });
			});
			html += `<div class="gtl-a gtl-leg nolint" style="${at(X1 - 330, 4)}" data-t><svg width="26" height="26"><circle cx="13" cy="13" r="11" fill="var(--blue)"/></svg>${fmt(s.legend?.a ?? '')}</div>`;
			html += `<div class="gtl-a gtl-leg nolint" style="${at(X1 - 330, 40)}" data-t><svg width="26" height="26"><circle cx="13" cy="13" r="9" fill="#fff" stroke="#b9bcc4" stroke-width="4"/></svg>${fmt(s.legend?.b ?? '')}</div>`;
			return heading(s) + body(`<div class="gtl-languages" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** The A/B flight: two equal crowds on the left (control in grey, the new arm in blue), the change per metric on the right
	 * as bars from zero, the biggest win bold and the rest muted, a flat one in grey; one calm caveat under it. Fields:
	 * eyebrow, title, arms: [{ name, users }], users (word under the number), when, head, rows: [{ label, value (number,
	 * size of the change), text, hi, flat, note }], caveat: { icon, text }. */
	'gtl-flight': {
		css: css('gtl-flight', `
.gtl-flight .gtl-ml { font-size: 25px; font-weight: 600; color: var(--ink); white-space: nowrap; text-align: right; }
.gtl-flight .gtl-ml.mut { color: var(--body); font-weight: 500; }
.gtl-flight .gtl-mv { font-size: 30px; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gtl-flight .gtl-mn { font-size: 20px; color: var(--muted); white-space: nowrap; }
.gtl-flight .gtl-arm { font-size: 46px; font-weight: 700; letter-spacing: -.02em; line-height: 1; white-space: nowrap; }
.gtl-flight .gtl-caveat { display: flex; align-items: center; gap: 12px; font-size: 23px; color: var(--ink); white-space: nowrap; }
`),
		render(s) {
			const H = bodyHeight(s);
			let svg = '', html = '';
			// Two equal crowds.
			const arms = s.arms ?? [];
			arms.forEach((a, i) => {
				const y0 = i * 300, tone = i ? 'var(--blue)' : '#a9aeb6';
				html += T('gtl-a lbl', 0, y0, fmt(a.name), { style: `color:${i ? 'var(--blue)' : 'var(--body)'}` });
				for (let r = 0; r < 3; r++) {
					for (let c = 0; c < 8; c++) {
						const x = 18 + c * 46 + (r % 2) * 10, y = y0 + 64 + r * 50;
						svg += `<circle cx="${x}" cy="${y}" r="10" fill="${tone}"/><path d="M ${x - 15} ${y + 32} Q ${x - 15} ${y + 13} ${x} ${y + 13} Q ${x + 15} ${y + 13} ${x + 15} ${y + 32} Z" fill="${tone}"/>`;
					}
				}
				html += `<div class="gtl-a" style="${at(0, y0 + 210)};display:flex;align-items:baseline;gap:12px"><span class="gtl-arm" data-t style="color:${i ? 'var(--blue)' : 'var(--body)'}">${esc(a.users ?? '')}</span><span class="gtl-sub nolint" data-t>${fmt(s.users ?? '')}</span></div>`;
			});
			html += T('gtl-a lbl', 0, 610, fmt(s.when ?? ''));
			svg += `<line x1="470" y1="10" x2="470" y2="${H - 10}" stroke="var(--line)" stroke-width="3"/>`;
			// The change per metric.
			const L = 920, Z = 950, perPt = 30, rows = s.rows ?? [], rh = 70, ry0 = 74;
			html += T('gtl-a lbl', 540, 0, fmt(s.head ?? ''));
			svg += `<line x1="${Z}" y1="${ry0 - 30}" x2="${Z}" y2="${ry0 + rh * rows.length - 26}" stroke="var(--faint)" stroke-width="3"/>`;
			rows.forEach((r, i) => {
				const y = ry0 + rh * i, len = Math.max(6, Math.abs(r.value) * perPt);
				const fill = r.flat ? '#d3d8e0' : r.hi ? 'var(--green)' : mix('green', 45);
				svg += `<rect x="${Z}" y="${y - 16}" width="${r1(len)}" height="32" rx="8" fill="${fill}"/>`;
				html += `<div class="gtl-ml nolint${r.hi ? '' : ' mut'}" style="position:absolute;right:${W - L}px;top:${y - 17}px" data-t>${fmt(r.label)}</div>`;
				html += T('gtl-a gtl-mv nolint', Z + len + 16, y - 19, esc(r.text ?? ''), { style: `color:${r.flat ? 'var(--muted)' : 'var(--green)'}${r.hi ? '' : ';font-size:26px;top:' + (y - 16) + 'px'}` });
				if (r.note) {
					html += T('gtl-a gtl-mn', Z + len + 120, y - 12, fmt(r.note));
				}
			});
			if (s.caveat) {
				html += `<div class="gtl-a gtl-caveat" style="${at(540, 610)}" data-t>${ic(s.caveat.icon ?? 'info', 30, 'var(--orange)')}<span>${fmt(s.caveat.text)}</span></div>`;
			}
			return heading(s) + body(`<div class="gtl-flight" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** Live traffic as bands sized by share: the source (its product logos or an icon, the weekly count), the router (the tailor,
	 * its latency), then one band per model, the width its share of decisions, each band ending at its own
	 * label; the few to highlight in green with a bracket and their total. Click 1: source and router; 2: every band
	 * (grey); 3: the highlighted ones. Fields: eyebrow, title, source: { logos, icon, name, sub, value, unit }, node: { name,
	 * sub }, models: [{ name, logo, icon, share, hi }], total: { value, label }. */
	'gtl-traffic': {
		clicks: true,
		css: css('gtl-traffic', `
.gtl-traffic .gtl-src { position: absolute; box-sizing: border-box; border: 4px solid var(--blue); border-radius: 20px; background: #fff; padding: 22px 24px; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
.gtl-traffic .gtl-src .gtl-logos { display: flex; gap: 12px; margin-bottom: 6px; }
.gtl-traffic .gtl-row { position: absolute; display: flex; align-items: center; gap: 12px; height: 40px; width: 420px; }
.gtl-traffic .gtl-share { font-size: 30px; font-weight: 700; width: 92px; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gtl-traffic .gtl-mname { font-size: 24px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.gtl-traffic .gtl-mut { color: var(--body) !important; font-weight: 500 !important; }
.gtl-traffic .gtl-total { font-size: 80px; font-weight: 700; letter-spacing: -.035em; line-height: 1; color: var(--green); white-space: nowrap; }
`),
		render(s, ctx = {}) {
			const H = bodyHeight(s), step = ctx.step ?? Infinity;
			let svg = '', html = '';
			const models = s.models ?? [], total = models.reduce((a, m) => a + m.share, 0);
			const S = 4.0, cy = 340, half = 50 * S, gapY = 14;
			const src = { x0: 0, x1: 330 }, nd = { x0: 430, x1: 660 }, bx = 1030, lx = 1110;
			// Where each band ends: stacked with small gaps, centred on the node's middle.
			const ws = models.map(m => (m.share * S * 100) / total);
			const stackH = ws.reduce((a, w) => a + w, 0) + gapY * (models.length - 1);
			let y = cy - stackH / 2;
			const ends = ws.map(w => { const e = { a: y, b: y + w, c: y + w / 2 }; y += w + gapY; return e; });
			// Labels: at their band's centre, pushed apart to at least 58 px, then kept inside the body.
			const minGap = 58, ly = ends.map(e => e.c);
			for (let i = 1; i < ly.length; i++) ly[i] = Math.max(ly[i], ly[i - 1] + minGap);
			const over = ly[ly.length - 1] - (H - 30);
			if (over > 0) for (let i = 0; i < ly.length; i++) ly[i] -= over;
			for (let i = ly.length - 2; i >= 0; i--) ly[i] = Math.min(ly[i], ly[i + 1] - minGap);
			// Source to the router.
			svg += band(src.x1, cy - half, cy + half, nd.x0, cy - half, cy + half, mix('blue', 14));
			const so = s.source ?? {};
			html += `<div class="gtl-src" style="${at(src.x0, cy - half, src.x1 - src.x0, 2 * half)}" data-fit><div class="gtl-logos">${(so.logos ?? []).map(l => logo(l, 44)).join('')}${so.icon ? ic(so.icon, 44, 'var(--blue)') : ''}</div><div class="gtl-name nolint" data-t>${fmt(so.name ?? '')}</div><div class="gtl-sub" data-t>${fmt(so.sub ?? '')}</div><div class="gtl-big" data-t style="font-size:64px;color:var(--blue);margin-top:14px">${esc(so.value ?? '')}</div><div class="gtl-sub" data-t>${fmt(so.unit ?? '')}</div></div>`;
			// The router: a card with the tailor in it.
			svg += `<rect x="${nd.x0}" y="${cy - half}" width="${nd.x1 - nd.x0}" height="${2 * half}" rx="20" fill="#fff" stroke="var(--purple)" stroke-width="4"/>`;
			const ncx = (nd.x0 + nd.x1) / 2;
			svg += `<line x1="${ncx - 70}" y1="${cy + 54}" x2="${ncx + 70}" y2="${cy + 54}" stroke="var(--line-strong)" stroke-width="4" stroke-linecap="round"/>` + person(ncx, cy + 52, 236, { role: 'tailor' });
			html += T('gtl-cx gtl-name nolint', (nd.x0 + nd.x1) / 2, cy + 70, fmt(s.node?.name ?? ''), { style: 'color:var(--purple);font-size:30px' });
			html += T('gtl-cx gtl-sub', (nd.x0 + nd.x1) / 2, cy + 112, fmt(s.node?.sub ?? ''));
			// The router to each model: the band leaves the node in order and ends at its slot; a thin leader to the label.
			let acc = cy - half, grey = '', green = '';
			models.forEach((m, i) => {
				const lit = m.hi && step >= 3, w = ws[i], e = ends[i];
				const fill = lit ? mix('green', 45) : '#e3e6eb';
				const b = band(nd.x1, acc, acc + w, bx, e.a, e.b, fill)
					+ `<path d="M ${bx} ${r1(e.c)} C ${bx + 40} ${r1(e.c)} ${lx - 50} ${r1(ly[i])} ${lx - 10} ${r1(ly[i])}" fill="none" stroke="${lit ? 'var(--green)' : '#c9ced6'}" stroke-width="3"/>`;
				if (lit) green += b; else grey += b;
				acc += w;
				html += `<div class="gtl-row${step >= 2 ? '' : ' gtl-hid'}" data-key="row-${i}" style="${at(lx, ly[i] - 20)}"><span class="gtl-share nolint" data-t style="color:${lit ? 'var(--green)' : 'var(--body)'}">${esc(`${m.share}%`)}</span>${m.logo ? logo(m.logo, 30, lit ? null : '#9aa0a8') : ic(m.icon ?? 'beaker', 30, '#9aa0a8')}<span class="gtl-mname nolint${lit ? '' : ' gtl-mut'}" data-t>${fmt(m.name)}</span></div>`;
			});
			svg += `<g${svgVis(step >= 2)}>${grey}${green}</g>`;
			// The bracket and the total of the highlighted rows.
			const hi = models.map((m, i) => (m.hi ? i : -1)).filter(i => i >= 0);
			if (hi.length) {
				const ya = ly[hi[0]] - 22, yb = ly[hi[hi.length - 1]] + 22, bxr = 1460;
				svg += `<path d="M ${bxr} ${r1(ya)} L ${bxr + 16} ${r1(ya)} L ${bxr + 16} ${r1(yb)} L ${bxr} ${r1(yb)}" fill="none" stroke="var(--green)" stroke-width="4" stroke-linejoin="round"${svgVis(step >= 3)}/>`;
				html += T('gtl-a gtl-total', bxr + 36, (ya + yb) / 2 - 58, esc(s.total?.value ?? ''), { hid: step < 3 });
				html += T('gtl-a gtl-sub', bxr + 40, (ya + yb) / 2 + 30, fmt(s.total?.label ?? ''), { hid: step < 3, style: 'color:var(--green);font-weight:600' });
			}
			return heading(s) + body(`<div class="gtl-traffic" style="height:${H}px">${layer(H, svg)}${html}</div>`, { vcenter: false });
		},
	},

	/** A drawn close on a blue page: a sewing machine on the bench (a bed with the stitch plate, the pillar with the
	 * stitch dial, the arm with the handwheel, the head with the needle bar, presser foot and tension disc, a spool on its
	 * pin and the thread running to the needle), sewing a seam into a piece of cloth. On the right an order board on two
	 * posts with one ticket per job that comes next. Fields: eyebrow, title, board (small caps on the board),
	 * next: [{ icon, title, sub }]. */
	'gtl-sewing': {
		css: css('gtl-sewing', `
.gtl-sewing .gtl-tagt { font-size: 27px; font-weight: 700; color: var(--ink); white-space: nowrap; }
.gtl-sewing .gtl-tags { font-size: 20px; color: var(--body); white-space: nowrap; }
`),
		render(s) {
			const H = bodyHeight(s);
			let svg = '', html = '';
			const white = '#fff', tint = 'rgba(255,255,255,.16)', tint2 = 'rgba(255,255,255,.3)', solid = '#4a9be0';
			const line = (x1, y1, x2, y2, w = 4) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${white}" stroke-width="${w}" stroke-linecap="round"/>`;
			const box = (x, y, w, h, rx = 10, f = tint) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${f}" stroke="${white}" stroke-width="4"/>`;
			const benchY = 640;
			svg += `<rect x="0" y="${benchY}" width="${W}" height="18" rx="6" fill="${tint2}" stroke="${white}" stroke-width="3"/>`;
			// The bed, with the stitch plate and the cloth on it.
			svg += box(70, 560, 860, benchY - 560, 18);
			svg += `<path d="M 96 560 L 96 540 L 560 536 L 572 560 Z" fill="rgba(255,255,255,.55)" stroke="${white}" stroke-width="3" stroke-linejoin="round"/>`;
			svg += `<path d="M 110 548 L 244 547" fill="none" stroke="var(--blue)" stroke-width="3" stroke-dasharray="8 6"/>`;
			svg += box(196, 556, 104, 10, 3, solid);
			// The pillar, the arm and the head.
			svg += `<path d="M 700 560 L 700 330 Q 700 214 600 214 L 250 214 Q 186 214 186 278 L 186 440 Q 186 464 210 464 L 290 464 Q 312 464 312 440 L 312 340 L 640 340 Q 680 340 680 380 L 680 560 Z" fill="${solid}" stroke="${white}" stroke-width="4" stroke-linejoin="round"/>`;
			svg += `<path d="M 700 560 L 820 560 L 820 300 Q 820 214 720 214 L 600 214" fill="${solid}" stroke="${white}" stroke-width="4" stroke-linejoin="round"/>`;
			svg += line(330, 250, 640, 250, 2.5) + line(330, 300, 640, 300, 2.5);
			// The stitch dial on the pillar, the handwheel on the right.
			svg += `<circle cx="760" cy="430" r="30" fill="${tint2}" stroke="${white}" stroke-width="4"/>` + line(760, 430, 772, 408, 4);
			svg += `<circle cx="868" cy="290" r="64" fill="${tint}" stroke="${white}" stroke-width="5"/><circle cx="868" cy="290" r="44" fill="none" stroke="${white}" stroke-width="3"/><circle cx="868" cy="290" r="12" fill="${white}"/>`;
			for (let a = 0; a < 3; a++) {
				const t = (a * 120 * Math.PI) / 180;
				svg += line(868 + Math.cos(t) * 12, 290 + Math.sin(t) * 12, 868 + Math.cos(t) * 44, 290 + Math.sin(t) * 44, 4);
			}
			// The needle bar, the needle and the presser foot.
			svg += box(236, 464, 16, 66, 3, tint2) + line(244, 530, 244, 552, 3);
			svg += `<path d="M 218 540 L 270 540 L 274 552 L 214 552 Z" fill="${tint2}" stroke="${white}" stroke-width="3" stroke-linejoin="round"/>` + box(264, 480, 10, 64, 3, tint2);
			// The spool on its pin, the thread over a guide and the tension disc, down to the needle.
			svg += line(600, 214, 600, 168, 5);
			svg += `<rect x="582" y="160" width="36" height="8" rx="3" fill="${white}"/><rect x="586" y="172" width="28" height="36" rx="4" fill="${tint2}" stroke="${white}" stroke-width="3"/><rect x="582" y="206" width="36" height="8" rx="3" fill="${white}"/>`;
			svg += `<circle cx="300" cy="262" r="16" fill="${tint2}" stroke="${white}" stroke-width="3"/><circle cx="440" cy="206" r="6" fill="${white}"/>`;
			svg += `<path d="M 600 176 Q 520 160 440 206 Q 360 230 300 246 Q 270 262 270 300 L 250 520 L 244 532" fill="none" stroke="${white}" stroke-width="2"/>`;
			// The order board on two posts: one ticket per job waiting at the bench.
			const next = s.next ?? [], bx0 = 1010, by0 = 120, bh = 320, pitch = (W - bx0 - 40) / Math.max(1, next.length);
			[bx0 + 60, W - 60].forEach(x => { svg += box(x - 14, by0 + bh - 10, 28, benchY - by0 - bh + 10, 4); });
			svg += box(bx0, by0, W - bx0, bh, 16, tint2);
			if (s.board) html += T('gtl-a lbl', bx0 + 26, by0 + 22, fmt(s.board), { style: 'color:#fff' });
			next.forEach((n, i) => {
				const x = bx0 + 20 + pitch * i + 10, y = by0 + 74, w = pitch - 20, h = bh - 100;
				html += `<div class="gtl-a" style="${at(x, y + 8, w, h - 8)};background:#fff;border-radius:12px;padding:24px 20px;box-sizing:border-box;display:flex;flex-direction:column;gap:8px" data-on="#ffffff" data-fit>${ic(n.icon ?? 'add', 48, 'var(--blue)')}<div class="gtl-tagt" data-t style="margin-top:10px">${fmt(n.title)}</div><div class="gtl-tags" data-t style="white-space:normal">${fmt(n.sub ?? '')}</div></div>`;
			});
			let pins = '';
			next.forEach((n, i) => { const x = bx0 + 20 + pitch * i + 10, w = pitch - 20; pins += `<circle cx="${r1(x + w / 2)}" cy="${by0 + 82}" r="9" fill="var(--orange)" stroke="#fff" stroke-width="3"/>`; });
			return heading(s) + body(`<div class="gtl-sewing" style="height:${H}px">${layer(H, svg)}${html}<svg class="rd-svg" width="${W}" height="${H}" style="pointer-events:none">${pins}</svg></div>`, { vcenter: false });
		},
	},
};
