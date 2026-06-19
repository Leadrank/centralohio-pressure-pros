#!/usr/bin/env node
// Auto-request GSC indexing for all pages in the sitemap after deploy.
// Uses service account JWT (no extra npm deps required).

import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  join(process.env.HOME || process.env.USERPROFILE || '', '.gsc-service-account.json');

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const header = { alg: 'RS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(key.private_key).toString('base64url');
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (data.error || !data.access_token) {
    throw new Error('Token error: ' + (data.error_description || JSON.stringify(data)));
  }
  return data.access_token;
}

async function requestIndexing(url, token) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`[gsc-index] ${url} → OK`);
  } else {
    console.error(`[gsc-index] ${url} → ${res.status}`, data);
  }
}

async function main() {
  let key;
  try {
    key = JSON.parse(readFileSync(keyPath, 'utf8'));
  } catch (e) {
    console.error('[gsc-index] Could not load service account JSON from', keyPath);
    console.error('   → Set GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json or place at ~/.gsc-service-account.json');
    console.error('   → Make sure the service account is added as Owner in GSC for this property.');
    process.exit(0);
  }

  const token = await getAccessToken(key);

  const sitemapPath = join(__dirname, '../dist/sitemap-0.xml');
  let xml;
  try {
    xml = readFileSync(sitemapPath, 'utf8');
  } catch {
    console.error('[gsc-index] No sitemap-0.xml found (run build first)');
    process.exit(0);
  }

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!urls.length) {
    console.error('[gsc-index] No URLs in sitemap');
    process.exit(0);
  }

  console.log(`[gsc-index] Requesting GSC re-crawl for ${urls.length} URLs...`);

  for (const url of urls) {
    try {
      await requestIndexing(url, token);
    } catch (e) {
      console.error('[gsc-index] Error for', url, e.message);
    }
    await new Promise((r) => setTimeout(r, 30)); // be polite
  }
}

main().catch((e) => {
  console.error('[gsc-index] Fatal:', e.message);
  process.exit(1);
});
