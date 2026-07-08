# Central Ohio Pressure Pros — rank-and-rent site (Claude instructions)

Pressure/soft washing (house, roof, driveway), Columbus metro. Site #5, blue theme (deliberately distinct from columbus-patio-pros). No renter yet.

## The one goal
Indexed → ranking → real leads → paying renter at **$500/mo flat**. Every change must serve that; prefer direct SEO/content/outreach work over tooling.

## Hard rules (portfolio-wide, settled — do not re-litigate)
- **Organic-only, long-tail.** NO paid ads, NO Google Business Profile, NO public street address (no-address model blocks classic citations — backlinks via address-free Web 2.0 instead). Aim top-5 at winnable long-tail terms, not head terms.
- **Renter-safe + additive-only.** Generic `[Niche] [City]` branding, never a renter's name; conditional phone/CTA blocks that stay safe with no renter attached. Add, don't rewrite; keep diffs reviewable.
- **One writer per checkout.** The Mon 6 AM weekly-enhance launchd job also writes to this repo (review branches, never auto-deploys). If a second session must work here in parallel, use a `git worktree`. Check `git status`/`git reflog` before assuming a clean tree; review branches awaiting merge are fast wins.
- **No new paid tools** until a site earns rent (free tiers first).
- Energy/HERS/home-performance niches are permanently off-limits.

## Forms & leads
- Contact form POSTs to **leadsink** (migrated off Web3Forms 2026-07-05).
Never put bare `/path` literals in inline JS (Googlebot crawls them as 404s — 2026-07-03 incident).

## Deploy & verify
- Deploys via **GitHub Actions on push** (added 2026-07-03 after this site silently never deployed on push; CI needs Node 22 for wrangler 4).
- **Never trust "push succeeded" as "deployed"** — after any deploy, run the `verify-deploy` skill (cache-bust check the live URL).
- After a verified deploy: submit IndexNow; sitemap-index.xml to GSC/Bing as needed. The Google Indexing API quota (~200/day) is SHARED across all 5 sites — the daily index-ping job handles it changed-only; don't blanket-ping manually.
- `astro check` passes with 0 errors on all sites — keep it that way (@astrojs/check is not a standing dep; no CI typecheck).

## Site facts
- One of the two sites that had the silent never-deployed bug + weakest indexation — verify deploys extra carefully here.
