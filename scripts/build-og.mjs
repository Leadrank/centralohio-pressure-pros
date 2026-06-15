// Per-site OG image (1200x630) for Central Ohio Pressure Washing.
// Blue + yellow identity to match the site theme. Run: node scripts/build-og.mjs
// (og.png is preserved across site-factory regenerations.)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og.png');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#084E7A"/><stop offset="1" stop-color="#0E6BA8"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="14" fill="#FFC400"/>
  <g font-family="'Avenir Next','Segoe UI',system-ui,sans-serif">
    <text x="70" y="225" fill="#ffffff" font-size="88" font-weight="700">Central Ohio</text>
    <text x="70" y="320" fill="#ffffff" font-size="88" font-weight="700">Pressure Washing</text>
    <text x="74" y="385" fill="#d6e8f5" font-size="34">House Soft Washing &#183; Roof Washing &#183; Pressure Cleaning</text>
    <text x="74" y="555" fill="#FFC400" font-size="30" font-weight="700">Columbus, Ohio &#183; Free Estimates</text>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote public/og.png (1200x630, blue/yellow)');
