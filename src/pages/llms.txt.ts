// Serves /llms.txt — a concise, curated map of the site for AI assistants / LLMs
// (the emerging llmstxt.org convention; the GEO analogue of robots.txt + sitemap).
// DATA-DRIVEN: built entirely from src/consts.ts, so it auto-stays in sync as
// services/locations/guides are added. Prerendered to a static text file at build.
// Template-portable: copied into every site by site-factory; nothing per-site to edit.
import type { APIRoute } from 'astro';
import { SITE, SERVICES, SERVICE_AREAS, NEIGHBORHOODS, RESOURCES } from '../consts';

export const prerender = true;

export const GET: APIRoute = () => {
  const S = SITE as any;
  const base = S.url.replace(/\/$/, '');
  const live = <T extends { live?: boolean }>(arr: readonly T[]) =>
    (arr || []).filter((x) => x.live !== false);

  const services = live(SERVICES as any);
  const areas = live(NEIGHBORHOODS as any);

  const out: string[] = [];
  out.push(`# ${S.brand}`);
  out.push('');
  out.push(`> ${S.tagline}`);
  out.push('');
  out.push(
    `${S.brand} provides ${S.serviceNoun || 'local services'} for homeowners and ` +
    `property owners across ${S.city}, ${S.state} and the surrounding area. This file ` +
    `is a curated map of the site for AI assistants and language models — every key ` +
    `page is listed below with a short description so they can cite the site accurately.`,
  );
  out.push('');

  if (services.length) {
    out.push('## Services');
    out.push('');
    for (const s of services as any[]) out.push(`- [${s.name}](${base}/${s.slug}/): ${s.short}`);
    out.push('');
  }

  if (areas.length) {
    out.push('## Service Areas (dedicated local pages)');
    out.push('');
    for (const n of areas as any[]) out.push(`- [${n.name}](${base}/${n.slug}/): ${n.blurb}`);
    out.push('');
  }

  if (SERVICE_AREAS && SERVICE_AREAS.length) {
    out.push(`We also serve the wider area, including: ${(SERVICE_AREAS as readonly string[]).join(', ')}.`);
    out.push('');
  }

  if (RESOURCES && RESOURCES.length) {
    out.push('## Guides & Resources');
    out.push('');
    for (const r of RESOURCES as readonly any[]) out.push(`- [${r.title}](${base}/${r.slug}/): ${r.blurb}`);
    out.push('');
  }

  out.push('## Key Pages');
  out.push('');
  out.push(`- [All Services](${base}/services/)`);
  out.push(`- [Service Areas](${base}/service-areas/)`);
  if (S.hasReviews !== false) out.push(`- [Reviews](${base}/reviews/)`);
  out.push(`- [About](${base}/about/)`);
  out.push(`- [Frequently Asked Questions](${base}/faq/)`);
  out.push(`- [Contact / Free Estimate](${base}/contact/)`);
  out.push('');

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
