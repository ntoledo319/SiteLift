# SiteLift Brief

## What the site is

SiteLift is the productized WordPress-exit microsite for Toledo Technologies LLC. It is the custom-website counterweight to ToledoWeb: lower floor, tighter scope, cleaner conversion path, and honest math about the WordPress tax.

## Live route map

- `/` — positioning, ROI story, package bands, and the main sales page
- `/fit-check/` — paid Delphi Fit Check intake page

## Canonical commercial rules

- Discovery front door: **Delphi Fit Check** at `$750`
- Package bands: **Arcadia**, **Aegis**, **Odyssey**, **Elysian`
- Default quote for a typical small-business migration: **Aegis at $9,500**
- Default stack: **Vercel Pro + Cloudflare Pages CMS** at about `$20/mo`
- Platform choice is part of discovery; SiteLift is platform-agnostic

## Site audience

- Small businesses tired of paying the monthly WordPress tax
- Nonprofits and local organizations with brochure sites that need a clean exit
- Marketing or ops leads who need a credible migration story with lower ongoing cost

## Tone and design

- High-impact editorial, but still commercial
- Direct, not snarky
- WordPress is framed as monthly drag, not moral failure
- The pages should sell utility, sovereignty, and cost removal first

## Technical reality

- Vite multi-page site rooted in `src/`
- Vanilla HTML, CSS, and ES modules
- Home page plus a dedicated fit-check route
- Crawl assets and social metadata are committed locally so the site can ship cleanly without platform magic
