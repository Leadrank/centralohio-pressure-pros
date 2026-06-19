// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// Sitemap priority tiers. NOTE: Google ignores <priority>/<changefreq> (Bing still
// reads them mildly); the durable value is just grouping the money pages high. We do
// NOT stamp <lastmod> here — a build-time lastmod on every page on every deploy is fake
// freshness that can backfire. Leave lastmod to honest, real changes only.
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
