// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// Site URL — used for canonical tags, sitemap, and absolute schema URLs.
// Sitemap priority tiers. NOTE: Google ignores <priority>/<changefreq> (Bing reads them
// mildly); the durable value is grouping the money pages high. We deliberately do NOT emit
// <lastmod> — a build-time lastmod on every page each deploy is fake freshness that can
// backfire; leave it to honest, real changes only.
const LOW_PRIORITY = new Set(['about', 'contact', 'service-areas']); // utility pages

export default defineConfig({
  site: 'https://centralohiopressurewashing.com',
  integrations: [sitemap({
    changefreq: 'monthly',
    priority: 0.8,
    filter: (page) => !page.includes('/thank-you/'),
    serialize(item) {
      const path = new URL(item.url).pathname.replace(/^\/|\/$/g, '');
      if (path === '') { item.priority = 1.0; item.changefreq = 'weekly'; }
      else if (LOW_PRIORITY.has(path)) { item.priority = 0.5; item.changefreq = 'monthly'; }
      else { item.priority = 0.8; item.changefreq = 'monthly'; }
      return item;
    },
  })],
  build: { inlineStylesheets: 'auto' },
  adapter: cloudflare(),
});
