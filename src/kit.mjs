// Helpers for design plugins (designs/*.mjs): the same building blocks the built-in layouts use.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT as root } from './layouts.mjs';
export { ROOT, esc, fmt, plain, ic, iconTile, pill, heading, body, bodyHeight, arrowHead, arrowSvg, stepTone, pngSize, qrSvg, msLogo } from './layouts.mjs';
export { logo } from './diagrams.mjs';
export { phone, laptop, monitor, appWindow, browser } from './props.mjs';
export { person, agent, HOLDABLE } from './characters.mjs';

/** Width of the content area below the heading, in px (the slide is 1920 wide, with 96 px margins). */
export const W = 1728;

/** Rounds a coordinate to one decimal, so the SVG paths stay short. */
export const r1 = v => Math.round(v * 10) / 10;

/** An image in assets/ for an <img src>: the path relative to the built HTML, or null if the file is missing
 * (draw a placeholder then). Example: asset('assets/screens/settings.png'). */
export function asset(src) {
	const file = path.join(root, src);
	return fs.existsSync(file) ? path.relative(path.join(root, 'build'), file) : null;
}

// ---------- drawing helpers: one illustration style for every design ----------

/** The house drawing style: outline width, card corner radius, and the gap between parts. Use these, not your own. */
export const STYLE = { stroke: 4, strokeBold: 6, radius: 20, radiusSmall: 12, gap: 24 };

/** left/top (and width/height) as an inline style string. */
export const at = (x, y, w, h) => `left:${r1(x)}px;top:${r1(y)}px${w != null ? `;width:${r1(w)}px` : ''}${h != null ? `;height:${r1(h)}px` : ''}`;

/** A piece of text the build checks (overflow, overlap, safe area, words): t('my-cls', at(10, 20), fmt(s.title)).
 * nolint: a label or a name, not words to read (skipped by the word count). tag: the element (default div). */
export function t(cls, style, html, { tag = 'div', fit = false, nolint = false } = {}) {
	return `<${tag}${cls || nolint ? ` class="${[cls, nolint ? 'nolint' : ''].filter(Boolean).join(' ')}"` : ''}${style ? ` style="${style}"` : ''} data-t${fit ? ' data-fit' : ''}>${html}</${tag}>`;
}

/** A theme tone mixed with white (or another colour): mix('green', 30) is a soft green. */
export const mix = (tone, pct, base = '#fff') => `color-mix(in srgb, var(--${tone}) ${pct}%, ${base})`;

/** An SVG layer the size of the body (W × h), under the HTML parts. */
export const layer = (h, inner, w = W) => `<svg class="rd-svg" width="${r1(w)}" height="${r1(h)}" viewBox="0 0 ${r1(w)} ${r1(h)}">${inner}</svg>`;

/** A ribbon from x0 (spanning a0..b0) to x1 (spanning a1..b1) as an S-curve: flows sized by share. */
export function band(x0, a0, b0, x1, a1, b1, fill) {
	const xm = (x0 + x1) / 2;
	return `<path d="M ${r1(x0)} ${r1(a0)} C ${r1(xm)} ${r1(a0)} ${r1(xm)} ${r1(a1)} ${r1(x1)} ${r1(a1)} L ${r1(x1)} ${r1(b1)} C ${r1(xm)} ${r1(b1)} ${r1(xm)} ${r1(b0)} ${r1(x0)} ${r1(b0)} Z" fill="${fill}"/>`;
}

/** A deterministic wobble in [-1, 1] for item i: drawings look hand-placed but never change between builds. */
export const wob = (i, k = 1) => Math.sin(i * 12.9898 * k + 78.233) * 0.999;
