#!/usr/bin/env node
// IndexNow submitter — pings Bing (and other IndexNow engines) with every URL in
// the built sitemap. Runs automatically after `npm run deploy`. The key is NOT a
// secret: IndexNow keys are published at the site root by design.
import { readFileSync } from 'node:fs';

const KEY = '5a45c934540a8c6ecd080878e2842488';
const HOST = 'centralohiopressurepros.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = new URL('../dist/sitemap-0.xml', import.meta.url);
const ENDPOINT = 'https://api.indexnow.org/indexnow';

let xml;
try { xml = readFileSync(SITEMAP, 'utf8'); }
catch { console.error('[indexnow] dist/sitemap-0.xml not found — run build first. Skipping.'); process.exit(0); }
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) { console.error('[indexnow] no URLs in sitemap. Skipping.'); process.exit(0); }

try {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  if (res.status === 200 || res.status === 202) console.log(`[indexnow] submitted ${urlList.length} URLs → HTTP ${res.status}`);
  else console.error(`[indexnow] HTTP ${res.status}: ${await res.text().catch(() => '')}`);
} catch (e) { console.error('[indexnow] failed:', e.message); }
