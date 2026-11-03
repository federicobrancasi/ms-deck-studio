// Characters: a detailed person and an agent (a friendly robot), drawn once in the house style so every deck can
// have real characters instead of circles on rectangles. Each is placed by its feet (x, y = the floor) and sized by
// k (1 = about 300 px tall). Poses, clothes and what the hands hold come from options, and the colours from tones.
// Returns SVG (draw it inside a layer()). See docs/designs.md (Characters) and the guide's Characters page.
import { r1, mix } from './kit.mjs';

const OUT = 'var(--ink)';
const SKINS = { light: '#f6d7c3', medium: '#e2b48f', tan: '#c98e62', deep: '#8d5a3b' };
const HAIRS = { dark: '#2b2523', brown: '#6b4a32', blonde: '#d9b26a', red: '#a3492c', grey: '#9a9da3' };

const P = (d, stroke, sw, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

/** What a hand holds, drawn at (x, y) in px, scale k. */
const PROPS = {
	laptop: (x, y, k) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(-8)"><rect x="${r1(-34 * k)}" y="${r1(-30 * k)}" width="${r1(68 * k)}" height="${r1(44 * k)}" rx="${r1(5 * k)}" fill="#1b1b1f" stroke="${OUT}" stroke-width="${r1(3 * k)}"/><rect x="${r1(-29 * k)}" y="${r1(-25 * k)}" width="${r1(58 * k)}" height="${r1(34 * k)}" rx="${r1(2 * k)}" fill="${mix('blue', 25)}"/><rect x="${r1(-40 * k)}" y="${r1(14 * k)}" width="${r1(80 * k)}" height="${r1(7 * k)}" rx="${r1(3 * k)}" fill="#c9ccd3" stroke="${OUT}" stroke-width="${r1(2.5 * k)}"/></g>`,
	clipboard: (x, y, k) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(6)"><rect x="${r1(-24 * k)}" y="${r1(-34 * k)}" width="${r1(48 * k)}" height="${r1(64 * k)}" rx="${r1(5 * k)}" fill="#c99a5b" stroke="${OUT}" stroke-width="${r1(3 * k)}"/><rect x="${r1(-19 * k)}" y="${r1(-26 * k)}" width="${r1(38 * k)}" height="${r1(50 * k)}" rx="${r1(2 * k)}" fill="#fff"/><rect x="${r1(-10 * k)}" y="${r1(-38 * k)}" width="${r1(20 * k)}" height="${r1(9 * k)}" rx="${r1(3 * k)}" fill="#9a9da3" stroke="${OUT}" stroke-width="${r1(2 * k)}"/>${[0, 1, 2, 3].map(i => `<path d="M ${r1(-13 * k)} ${r1((-16 + i * 11) * k)} h ${r1(6 * k)} M ${r1(-3 * k)} ${r1((-16 + i * 11) * k)} h ${r1(16 * k)}" stroke="${i === 1 ? 'var(--green)' : '#9a9da3'}" stroke-width="${r1(2.5 * k)}" stroke-linecap="round"/>`).join('')}</g>`,
	phone: (x, y, k) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(-12)"><rect x="${r1(-12 * k)}" y="${r1(-22 * k)}" width="${r1(24 * k)}" height="${r1(44 * k)}" rx="${r1(5 * k)}" fill="#1b1b1f" stroke="${OUT}" stroke-width="${r1(2.5 * k)}"/><rect x="${r1(-9 * k)}" y="${r1(-18 * k)}" width="${r1(18 * k)}" height="${r1(36 * k)}" rx="${r1(3 * k)}" fill="${mix('blue', 30)}"/></g>`,
	mug: (x, y, k) => `<g transform="translate(${r1(x)} ${r1(y)})"><path d="M ${r1(12 * k)} ${r1(-8 * k)} q ${r1(12 * k)} 0 ${r1(12 * k)} ${r1(10 * k)} q 0 ${r1(10 * k)} ${r1(-12 * k)} ${r1(10 * k)}" fill="none" stroke="${OUT}" stroke-width="${r1(3 * k)}"/><rect x="${r1(-14 * k)}" y="${r1(-16 * k)}" width="${r1(28 * k)}" height="${r1(32 * k)}" rx="${r1(5 * k)}" fill="#fff" stroke="${OUT}" stroke-width="${r1(3 * k)}"/><path d="M ${r1(-6 * k)} ${r1(-24 * k)} q ${r1(4 * k)} ${r1(-6 * k)} 0 ${r1(-12 * k)} M ${r1(4 * k)} ${r1(-24 * k)} q ${r1(4 * k)} ${r1(-6 * k)} 0 ${r1(-12 * k)}" fill="none" stroke="#9a9da3" stroke-width="${r1(2 * k)}" stroke-linecap="round"/></g>`,
	wrench: (x, y, k) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(-35)"><rect x="${r1(-5 * k)}" y="${r1(-34 * k)}" width="${r1(10 * k)}" height="${r1(56 * k)}" rx="${r1(4 * k)}" fill="#c9ccd3" stroke="${OUT}" stroke-width="${r1(2.5 * k)}"/><path d="M ${r1(-13 * k)} ${r1(-34 * k)} a ${r1(13 * k)} ${r1(13 * k)} 0 1 1 ${r1(26 * k)} 0 l ${r1(-6 * k)} ${r1(-2 * k)} v ${r1(-8 * k)} h ${r1(-14 * k)} v ${r1(8 * k)} Z" fill="#c9ccd3" stroke="${OUT}" stroke-width="${r1(2.5 * k)}" stroke-linejoin="round"/></g>`,
	flag: (x, y, k, tone = 'green') => `<g transform="translate(${r1(x)} ${r1(y)})"><path d="M 0 ${r1(20 * k)} V ${r1(-70 * k)}" stroke="${OUT}" stroke-width="${r1(3.5 * k)}" stroke-linecap="round"/><path d="M 0 ${r1(-70 * k)} h ${r1(40 * k)} l ${r1(-8 * k)} ${r1(12 * k)} l ${r1(8 * k)} ${r1(12 * k)} h ${r1(-40 * k)} Z" fill="var(--${tone})" stroke="${OUT}" stroke-width="${r1(2.5 * k)}" stroke-linejoin="round"/></g>`,
	magnifier: (x, y, k) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(-30)"><rect x="${r1(-4 * k)}" y="${r1(4 * k)}" width="${r1(9 * k)}" height="${r1(30 * k)}" rx="${r1(3 * k)}" fill="${OUT}"/><circle cx="0" cy="${r1(-14 * k)}" r="${r1(18 * k)}" fill="${mix('blue', 18)}" stroke="${OUT}" stroke-width="${r1(4 * k)}"/><path d="M ${r1(-8 * k)} ${r1(-22 * k)} q ${r1(4 * k)} ${r1(-5 * k)} ${r1(10 * k)} ${r1(-4 * k)}" stroke="#fff" stroke-width="${r1(3 * k)}" fill="none" stroke-linecap="round"/></g>`,
	none: () => '',
};

/**
 * A person, full body, standing (or sitting on what is under y), seen from the front.
 * o: { pose: 'stand' | 'wave' | 'point' | 'hold' | 'present' | 'sit', hold: 'laptop' | 'clipboard' | 'phone' | 'mug' |
 * 'wrench' | 'flag' | 'magnifier', top: tone of the top (default 'blue'), bottom: '#3a3d45', skin: 'light' | 'medium' |
 * 'tan' | 'deep', hair: 'dark' | 'brown' | 'blonde' | 'red' | 'grey', hairStyle: 'short' | 'long' | 'bun' | 'curly',
 * outfit: 'shirt' | 'hoodie' | 'blazer' | 'coat', glasses, badge: tone (a lanyard badge), mood: 'smile' | 'focus',
 * facing: 1 | -1 (which side the pose points to) }. Returns { svg, top, hand: [x, y], height }.
 */
export function person(x, y, k = 1, o = {}) {
	const X = v => r1(x + v * k * (o.facing === -1 ? -1 : 1)), Y = v => r1(y - v * k), sw = r1(Math.max(2, 3.6 * k)), thin = r1(Math.max(1.2, 2.2 * k));
	const top = `var(--${o.top ?? 'blue'})`, topT = mix(o.top ?? 'blue', 22), bottom = o.bottom ?? '#3a3d45';
	const skin = SKINS[o.skin ?? 'light'] ?? o.skin, hair = HAIRS[o.hair ?? 'brown'] ?? o.hair;
	const pose = o.pose ?? 'stand', sit = pose === 'sit';
	let g = '';
	// Legs and shoes (sitting: thighs forward, shins down).
	if (sit) {
		g += `<path d="M ${X(-26)} ${Y(118)} H ${X(46)} V ${Y(96)} H ${X(-26)} Z" fill="${bottom}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
		for (const lx of [12, 40]) g += `<rect x="${X(lx - 10)}" y="${Y(98)}" width="${r1(18 * k)}" height="${r1(84 * k)}" rx="${r1(6 * k)}" fill="${bottom}" stroke="${OUT}" stroke-width="${sw}"/>` + `<path d="M ${X(lx - 12)} ${Y(14)} h ${r1(30 * k)} q ${r1(6 * k)} 0 ${r1(6 * k)} ${r1(8 * k)} v ${r1(6 * k)} h ${r1(-36 * k)} Z" fill="${OUT}"/>`;
	} else {
		for (const s of [-1, 1]) {
			g += `<path d="M ${X(s * 4)} ${Y(128)} L ${X(s * 24)} ${Y(128)} L ${X(s * 22)} ${Y(14)} L ${X(s * 6)} ${Y(14)} Z" fill="${bottom}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
			g += `<path d="M ${X(s * 4)} ${Y(16)} h ${r1(s * 24 * k)} q ${r1(s * 8 * k)} 0 ${r1(s * 8 * k)} ${r1(9 * k)} v ${r1(7 * k)} h ${r1(-s * 34 * k)} Z" fill="${OUT}"/>`;
		}
	}
	// Torso: the top (shirt, hoodie, blazer or coat), its details.
	const outfit = o.outfit ?? 'shirt';
	const tBot = sit ? 112 : 126, tTop = 238, coatBot = outfit === 'coat' ? (sit ? 104 : 76) : tBot;
	g += `<path d="M ${X(-36)} ${Y(coatBot)} L ${X(-38)} ${Y(206)} C ${X(-38)} ${Y(226)} ${X(-26)} ${Y(tTop)} ${X(-12)} ${Y(tTop + 2)} L ${X(12)} ${Y(tTop + 2)} C ${X(26)} ${Y(tTop)} ${X(38)} ${Y(226)} ${X(38)} ${Y(206)} L ${X(36)} ${Y(coatBot)} Z" fill="${outfit === 'blazer' || outfit === 'coat' ? '#fff' : topT}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
	if (outfit === 'blazer' || outfit === 'coat') {
		g += `<path d="M ${X(-11)} ${Y(tTop + 1)} L ${X(0)} ${Y(196)} L ${X(11)} ${Y(tTop + 1)} Z" fill="${topT}" stroke="${OUT}" stroke-width="${thin}"/>`;
		g += `<path d="M ${X(-36)} ${Y(coatBot)} L ${X(-37)} ${Y(206)} C ${X(-37)} ${Y(224)} ${X(-26)} ${Y(tTop)} ${X(-12)} ${Y(tTop + 1)} L ${X(-2)} ${Y(170)} L ${X(-2)} ${Y(coatBot)} Z M ${X(36)} ${Y(coatBot)} L ${X(37)} ${Y(206)} C ${X(37)} ${Y(224)} ${X(26)} ${Y(tTop)} ${X(12)} ${Y(tTop + 1)} L ${X(2)} ${Y(170)} L ${X(2)} ${Y(coatBot)} Z" fill="${top}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
		g += P(`M ${X(-12)} ${Y(tTop + 1)} L ${X(-20)} ${Y(206)} L ${X(-6)} ${Y(186)} M ${X(12)} ${Y(tTop + 1)} L ${X(20)} ${Y(206)} L ${X(6)} ${Y(186)}`, OUT, thin);
		g += `<circle cx="${X(-6)}" cy="${Y(152)}" r="${r1(3.2 * k)}" fill="${OUT}"/><circle cx="${X(-6)}" cy="${Y(132)}" r="${r1(3.2 * k)}" fill="${OUT}"/>`;
		g += P(`M ${X(-30)} ${Y(140)} h ${r1(14 * k)} M ${X(16)} ${Y(140)} h ${r1(14 * k)}`, OUT, thin);
	} else if (outfit === 'hoodie') {
		g += P(`M ${X(-20)} ${Y(tTop)} Q ${X(0)} ${Y(tTop - 26)} ${X(20)} ${Y(tTop)}`, OUT, thin) + P(`M ${X(-6)} ${Y(tTop - 18)} v ${r1(-22 * k)} M ${X(6)} ${Y(tTop - 18)} v ${r1(-22 * k)}`, OUT, thin);
		g += `<path d="M ${X(-20)} ${Y(158)} H ${X(20)} L ${X(24)} ${Y(132)} H ${X(-24)} Z" fill="none" stroke="${OUT}" stroke-width="${thin}" stroke-linejoin="round"/>`;
	} else {
		g += P(`M ${X(-10)} ${Y(tTop + 1)} L ${X(0)} ${Y(tTop - 12)} L ${X(10)} ${Y(tTop + 1)}`, OUT, thin) + P(`M ${X(0)} ${Y(tTop - 12)} V ${Y(tBot + 4)}`, OUT, thin);
		for (const yy of [206, 182, 158]) g += `<circle cx="${X(0)}" cy="${Y(yy)}" r="${r1(2.6 * k)}" fill="${OUT}"/>`;
	}
	if (o.badge) {
		g += P(`M ${X(-10)} ${Y(tTop)} L ${X(12)} ${Y(178)} L ${X(10)} ${Y(tTop)}`, `var(--${o.badge})`, thin);
		g += `<rect x="${X(4)}" y="${Y(180)}" width="${r1(18 * k)}" height="${r1(24 * k)}" rx="${r1(3 * k)}" fill="#fff" stroke="${OUT}" stroke-width="${thin}"/><rect x="${X(7)}" y="${Y(176)}" width="${r1(12 * k)}" height="${r1(5 * k)}" fill="var(--${o.badge})"/>`;
	}
	// Arms by pose. A sleeve is an outlined thick stroke from the shoulder to the wrist; a hand at the end.
	const sleeve = pts => {
		const d = `M ${pts.map(([a, b]) => `${X(a)} ${Y(b)}`).join(' L ')}`;
		return P(d, OUT, r1(24 * k)) + P(d, outfit === 'blazer' || outfit === 'coat' ? top : topT, r1(24 * k - 2 * sw));
	};
	const hand = (a, b) => `<circle cx="${X(a)}" cy="${Y(b)}" r="${r1(9.5 * k)}" fill="${skin}" stroke="${OUT}" stroke-width="${sw}"/>`;
	let handAt = [36, 130], holdAt = null, rest = [[-34, 222], [-44, 176], [-42, 132]];
	if (pose === 'wave') { g += sleeve([[34, 222], [62, 214], [72, 270]]) + hand(72, 280); handAt = [72, 280]; }
	else if (pose === 'point') { g += sleeve([[34, 222], [68, 212], [100, 220]]) + hand(106, 221); handAt = [110, 221]; }
	else if (pose === 'hold' || pose === 'sit') { g += sleeve([[34, 222], [46, 172], [18, 150]]) + hand(14, 150); handAt = [14, 150]; holdAt = [14, 150]; rest = [[-34, 222], [-46, 172], [-18, 150]]; }
	else if (pose === 'present') { g += sleeve([[34, 222], [60, 190], [96, 196]]) + hand(102, 197); handAt = [102, 197]; holdAt = [104, 197]; }
	else { g += sleeve([[34, 222], [44, 176], [42, 132]]) + hand(42, 124); handAt = [42, 124]; holdAt = o.hold ? [42, 124] : null; }
	g = sleeve(rest) + hand(rest[2][0], rest[2][1] - 8) + g;
	// Neck and head: ears, face, hair, brows, eyes, nose, mouth.
	g += `<rect x="${X(-9)}" y="${Y(252)}" width="${r1(18 * k)}" height="${r1(16 * k)}" fill="${skin}" stroke="${OUT}" stroke-width="${sw}"/>`;
	const hc = 280, hairStyle = o.hairStyle ?? 'short';
	if (hairStyle === 'long') g += `<path d="M ${X(-30)} ${Y(hc + 18)} C ${X(-36)} ${Y(hc - 20)} ${X(-34)} ${Y(hc - 46)} ${X(-24)} ${Y(hc - 50)} L ${X(24)} ${Y(hc - 50)} C ${X(34)} ${Y(hc - 46)} ${X(36)} ${Y(hc - 20)} ${X(30)} ${Y(hc + 18)} Z" fill="${hair}" stroke="${OUT}" stroke-width="${sw}"/>`;
	for (const s of [-1, 1]) g += `<ellipse cx="${X(s * 26)}" cy="${Y(hc - 2)}" rx="${r1(6 * k)}" ry="${r1(8 * k)}" fill="${skin}" stroke="${OUT}" stroke-width="${sw}"/>`;
	g += `<ellipse cx="${X(0)}" cy="${Y(hc)}" rx="${r1(26 * k)}" ry="${r1(30 * k)}" fill="${skin}" stroke="${OUT}" stroke-width="${sw}"/>`;
	const hairTop = `M ${X(-27)} ${Y(hc + 4)} C ${X(-30)} ${Y(hc + 34)} ${X(-10)} ${Y(hc + 38)} ${X(2)} ${Y(hc + 36)} C ${X(22)} ${Y(hc + 36)} ${X(32)} ${Y(hc + 24)} ${X(27)} ${Y(hc + 4)} C ${X(20)} ${Y(hc + 18)} ${X(4)} ${Y(hc + 22)} ${X(-14)} ${Y(hc + 16)} C ${X(-20)} ${Y(hc + 14)} ${X(-24)} ${Y(hc + 10)} ${X(-27)} ${Y(hc + 4)} Z`;
	g += `<path d="${hairTop}" fill="${hair}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
	if (hairStyle === 'bun') g += `<circle cx="${X(0)}" cy="${Y(hc + 44)}" r="${r1(12 * k)}" fill="${hair}" stroke="${OUT}" stroke-width="${sw}"/>`;
	if (hairStyle === 'curly') for (const a of [-22, -8, 8, 22]) g += `<circle cx="${X(a)}" cy="${Y(hc + 30 - Math.abs(a) * 0.3)}" r="${r1(10 * k)}" fill="${hair}" stroke="${OUT}" stroke-width="${thin}"/>`;
	for (const s of [-1, 1]) {
		g += P(`M ${X(s * 15)} ${Y(hc + 12)} q ${r1(-s * 5 * k)} ${r1(-3 * k)} ${r1(-s * 10 * k)} 0`, OUT, thin);
		g += `<ellipse cx="${X(s * 10)}" cy="${Y(hc + 2)}" rx="${r1(3.2 * k)}" ry="${r1(4 * k)}" fill="${OUT}"/><circle cx="${X(s * 10 + 1.2)}" cy="${Y(hc + 3.5)}" r="${r1(1.2 * k)}" fill="#fff"/>`;
		g += `<circle cx="${X(s * 17)}" cy="${Y(hc - 10)}" r="${r1(4.5 * k)}" fill="${mix('red', 20)}"/>`;
	}
	if (o.glasses) g += `<rect x="${X(-18)}" y="${Y(hc + 9)}" width="${r1(15 * k)}" height="${r1(12 * k)}" rx="${r1(4 * k)}" fill="none" stroke="${OUT}" stroke-width="${thin}"/><rect x="${X(3)}" y="${Y(hc + 9)}" width="${r1(15 * k)}" height="${r1(12 * k)}" rx="${r1(4 * k)}" fill="none" stroke="${OUT}" stroke-width="${thin}"/>` + P(`M ${X(-3)} ${Y(hc + 4)} h ${r1(6 * k)}`, OUT, thin);
	g += P(`M ${X(-2)} ${Y(hc - 4)} q ${r1(3 * k)} ${r1(-4 * k)} 0 ${r1(-7 * k)}`, mix('orange', 50), thin);
	g += o.mood === 'focus' ? P(`M ${X(-7)} ${Y(hc - 16)} h ${r1(14 * k)}`, OUT, thin) : P(`M ${X(-9)} ${Y(hc - 14)} Q ${X(0)} ${Y(hc - 22)} ${X(9)} ${Y(hc - 14)}`, OUT, thin);
	// What the hand holds, last, in front.
	if (o.hold && holdAt) g += (PROPS[o.hold] ?? PROPS.none)(Number(X(holdAt[0])), Number(Y(holdAt[1] - (pose === 'stand' ? 10 : 0))), k, o.holdTone);
	return { svg: `<g>${g}</g>`, top: [x, y - 330 * k], hand: [Number(X(handAt[0])), Number(Y(handAt[1]))], height: 330 * k };
}

/**
 * The agent: a friendly robot in the AI's colour (purple by default), standing on y: an antenna with a light, a
 * rounded head with a screen face (two eyes and a smile), ear lights, a body with a chest panel, arms with
 * round hands, legs on wheels or feet. o: { pose: 'stand' | 'wave' | 'point' | 'hold', hold (as for person), tone,
 * mood: 'smile' | 'think' | 'busy', wheels: true }. Returns { svg, top, hand, height }.
 */
export function agent(x, y, k = 1, o = {}) {
	const X = v => r1(x + v * k), Y = v => r1(y - v * k), sw = r1(Math.max(2, 3.6 * k)), thin = r1(Math.max(1.2, 2.2 * k));
	const tone = o.tone ?? 'purple', T = `var(--${tone})`, Tt = mix(tone, 18), pose = o.pose ?? 'stand';
	let g = '';
	// Legs: wheels on a short axle, or two feet.
	if (o.wheels !== false) {
		g += `<rect x="${X(-30)}" y="${Y(58)}" width="${r1(60 * k)}" height="${r1(16 * k)}" rx="${r1(6 * k)}" fill="#c9ccd3" stroke="${OUT}" stroke-width="${sw}"/>`;
		for (const s of [-1, 1]) g += `<circle cx="${X(s * 26)}" cy="${Y(22)}" r="${r1(22 * k)}" fill="#3a3d45" stroke="${OUT}" stroke-width="${sw}"/><circle cx="${X(s * 26)}" cy="${Y(22)}" r="${r1(8 * k)}" fill="#c9ccd3"/>`;
	} else {
		for (const s of [-1, 1]) g += `<rect x="${X(s * 22 - 9)}" y="${Y(64)}" width="${r1(18 * k)}" height="${r1(50 * k)}" rx="${r1(6 * k)}" fill="#c9ccd3" stroke="${OUT}" stroke-width="${sw}"/><rect x="${X(s * 22 - 16)}" y="${Y(16)}" width="${r1(32 * k)}" height="${r1(16 * k)}" rx="${r1(6 * k)}" fill="${T}" stroke="${OUT}" stroke-width="${sw}"/>`;
	}
	// Arms behind the body.
	const arm = pts => { const d = `M ${pts.map(([a, b]) => `${X(a)} ${Y(b)}`).join(' L ')}`; return P(d, OUT, r1(16 * k)) + P(d, '#c9ccd3', r1(16 * k - 2 * sw)); };
	const hand = (a, b) => `<circle cx="${X(a)}" cy="${Y(b)}" r="${r1(11 * k)}" fill="${T}" stroke="${OUT}" stroke-width="${sw}"/>`;
	let handAt = [56, 96], holdAt = null;
	g += arm([[-46, 160], [-62, 120], [-58, 96]]) + hand(-58, 90);
	if (pose === 'wave') { g += arm([[46, 160], [70, 170], [80, 218]]) + hand(80, 226); handAt = [80, 226]; }
	else if (pose === 'point') { g += arm([[46, 160], [90, 166], [124, 172]]) + hand(130, 172); handAt = [134, 172]; }
	else if (pose === 'hold') { g += arm([[46, 160], [72, 136], [74, 108]]) + hand(74, 102); handAt = [74, 102]; holdAt = [82, 96]; }
	else { g += arm([[46, 160], [62, 120], [58, 96]]) + hand(58, 90); handAt = [58, 90]; holdAt = o.hold ? [58, 90] : null; }
	// Body with a chest panel (three lights and a slot).
	g += `<rect x="${X(-48)}" y="${Y(184)}" width="${r1(96 * k)}" height="${r1(120 * k)}" rx="${r1(22 * k)}" fill="#fff" stroke="${OUT}" stroke-width="${sw}"/>`;
	g += `<rect x="${X(-30)}" y="${Y(160)}" width="${r1(60 * k)}" height="${r1(56 * k)}" rx="${r1(10 * k)}" fill="${Tt}" stroke="${OUT}" stroke-width="${thin}"/>`;
	['green', 'blue', 'orange'].forEach((c, i) => { g += `<circle cx="${X(-16 + i * 16)}" cy="${Y(144)}" r="${r1(5 * k)}" fill="var(--${c})"/>`; });
	g += `<rect x="${X(-18)}" y="${Y(124)}" width="${r1(36 * k)}" height="${r1(6 * k)}" rx="${r1(3 * k)}" fill="${OUT}"/>`;
	g += `<rect x="${X(-12)}" y="${Y(194)}" width="${r1(24 * k)}" height="${r1(14 * k)}" fill="#c9ccd3" stroke="${OUT}" stroke-width="${thin}"/>`;
	// Head: a rounded box with a screen face, ear lights and an antenna.
	g += P(`M ${X(0)} ${Y(282)} V ${Y(306)}`, OUT, sw) + `<circle cx="${X(0)}" cy="${Y(312)}" r="${r1(8 * k)}" fill="${T}" stroke="${OUT}" stroke-width="${sw}"/>`;
	for (const s of [-1, 1]) g += `<rect x="${X(s * 54 - 7)}" y="${Y(250)}" width="${r1(14 * k)}" height="${r1(30 * k)}" rx="${r1(6 * k)}" fill="${T}" stroke="${OUT}" stroke-width="${sw}"/>`;
	g += `<rect x="${X(-50)}" y="${Y(284)}" width="${r1(100 * k)}" height="${r1(82 * k)}" rx="${r1(24 * k)}" fill="#fff" stroke="${OUT}" stroke-width="${sw}"/>`;
	g += `<rect x="${X(-38)}" y="${Y(270)}" width="${r1(76 * k)}" height="${r1(56 * k)}" rx="${r1(16 * k)}" fill="#1b1b1f"/>`;
	const mood = o.mood ?? 'smile';
	if (mood === 'busy') { for (const a of [-1, 1]) g += P(`M ${X(a * 14 - 6)} ${Y(250)} h ${r1(12 * k)}`, mix(tone, 70), r1(5 * k)); }
	else for (const a of [-1, 1]) g += `<ellipse cx="${X(a * 14)}" cy="${Y(248)}" rx="${r1(6 * k)}" ry="${r1((mood === 'think' ? 4 : 8) * k)}" fill="${mix(tone, 70)}"/>`;
	g += mood === 'think' ? P(`M ${X(-8)} ${Y(228)} h ${r1(16 * k)}`, mix(tone, 70), thin) : P(`M ${X(-12)} ${Y(232)} Q ${X(0)} ${Y(222)} ${X(12)} ${Y(232)}`, mix(tone, 70), r1(3 * k));
	if (o.hold && holdAt) g += (PROPS[o.hold] ?? PROPS.none)(Number(X(holdAt[0])), Number(Y(holdAt[1])), k, o.holdTone);
	return { svg: `<g>${g}</g>`, top: [x, y - 322 * k], hand: [Number(X(handAt[0])), Number(Y(handAt[1]))], height: 322 * k };
}

/** The things a character can hold, by name. */
export const HOLDABLE = Object.keys(PROPS).filter(p => p !== 'none');
