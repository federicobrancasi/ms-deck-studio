// PowerPoint export: one slide per PDF page (each click is its own slide, like the PDF), the page as a full-bleed
// picture, and the speaker notes of its slide in the notes pane. The drawings stay pictures: edit the deck, not the
// .pptx. Build the deck first.
// Usage: npm run pptx -- --deck <name>   ->  out/<name>.pptx
import fs from 'node:fs';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';
import { getDeck } from './decks.mjs';
import { deckPages } from './pages.mjs';
import { plain } from './layouts.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--deck');
const name = i >= 0 ? process.argv[i + 1] : null;
if (!name) {
	console.error('Usage: npm run pptx -- --deck <name>   (build the deck first)');
	process.exit(1);
}
const got = await getDeck(name);
const deck = got.deck ?? got;
const file = deck.file ?? name;
const dir = path.join(ROOT, 'out', `${file}-slides`);
if (!fs.existsSync(dir)) {
	console.error(`No pages at out/${file}-slides/: build the deck first (node src/build.mjs --deck ${name}).`);
	process.exit(1);
}
const pngs = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const { pages } = deckPages(deck);
if (pages.length !== pngs.length) {
	console.error(`out/${file}-slides/ has ${pngs.length} pages but the deck has ${pages.length}: rebuild it first.`);
	process.exit(1);
}
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.title = plain(deck.title ?? name);
pages.forEach((p, k) => {
	const s = p.s, slide = pptx.addSlide();
	slide.addImage({ path: path.join(dir, pngs[k]), x: 0, y: 0, w: 13.333, h: 7.5 });
	const parts = [];
	if (p.step && s.clicks?.[p.step - 1]) {
		const c = s.clicks[p.step - 1];
		parts.push(`Click ${p.step} of ${p.steps}: ${plain(c.caption ?? '')}${c.say ? `\n${plain(c.say)}` : ''}`);
	}
	if (s.say) parts.push(`Say: ${plain(s.say)}`);
	if (s.notes && (p.first || !p.step)) parts.push(plain(s.notes));
	if (s.sources?.length && (p.first || !p.step)) parts.push(`Sources: ${s.sources.map(x => plain(String(x)).split(' | ')[0]).join('; ')}`);
	if (parts.length) slide.addNotes(parts.join('\n\n'));
});
const out = path.join(ROOT, 'out', `${file}.pptx`);
await pptx.writeFile({ fileName: out });
console.log(`PowerPoint: out/${file}.pptx (${pages.length} slides, one per click, speaker notes included)`);
