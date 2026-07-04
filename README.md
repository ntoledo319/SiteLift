# SiteLift

Marketing site for `sitelift.toledotechnologies.com`. SiteLift is the productized WordPress-exit offer inside Toledo Technologies LLC: platform-agnostic migrations, a default `$20/mo` hosting target on Vercel Pro plus Cloudflare Pages CMS, and a paid Delphi Fit Check as the front door.

## Live surface

- `/` — positioning, ROI story, package bands, and primary conversion
- `/fit-check/` — paid Delphi Fit Check intake and routing page

## Lead capture

The Delphi Fit Check intake form submits to the G.R.A.C.E. lead bus at
`https://eolkits.com/api/v1/lead` for durable capture: every submission is
recorded to a database and emails the owner on a working mail path. This
replaced the old FormSubmit flow, which was dead at mxroute and silently
dropped submissions. The form posts via AJAX `fetch` and renders an in-page
success state from the endpoint's JSON (`{ok, lead_id}`); it does not redirect.

## Stack

- Vite multi-page build with `src/` as the root
- Vanilla HTML, CSS, and ES modules
- ESLint, Stylelint, Jest, Lighthouse CI, and Prettier

## Local development

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run lint
npm test
npm run build
```

## Canonical commercial rules

- Published package bands: Arcadia, Aegis, Odyssey, Elysian
- Default quote for a typical small-business migration: Aegis at `$7,500 – $12,500`
- Discovery front door: Delphi Fit Check at `$750`
- Platform choice happens during discovery; default stack is not mandatory

## SEO / crawl assets

- OG asset: [`public/og-image.svg`](./public/og-image.svg)
- Favicon: [`public/favicon.svg`](./public/favicon.svg)
- Crawl files: [`public/robots.txt`](./public/robots.txt), [`public/sitemap.xml`](./public/sitemap.xml)

## Deployment

Every push to `main` deploys automatically. `.github/workflows/deploy.yml`
builds the site (`npm ci && npm run build` → `dist/`), stamps `version.txt` with the commit SHA, and streams the payload over
SSH to the G.R.A.C.E. VPS (`15.204.209.97`). A forced-command release script
(`/home/ubuntu/bin/deploy-toledo-sitelift`) extracts it into a timestamped release and atomically
swaps the `current` symlink that host Caddy serves at `sitelift.toledotechnologies.com`; the workflow
then polls `https://sitelift.toledotechnologies.com/version.txt` until the new build is provably live.

The CI pipeline is unchanged (same four secrets, same `tar | ssh` over the forced-command key, same
`version.txt` gate). What changed on 2026-07-03: the box release script was regenerated from the
shared static template (`deploy/sites/_template/deploy-static.sh.tmpl`), so every deploy now logs a
deploy event into G.R.A.C.E. — `published` on success, `failed` if the release aborts before publish
— visible on the "Living Fleet" hosting dashboard at `https://graceai.love/hosting` and via
`GET /api/v1/hosting/toledo-sitelift/deploys`. The canonical copy of this site's release script is
`deploy/sites/toledo/deploy-toledo-sitelift.sh` in grace-complete; edit there and reinstall on the
box, never hand-edit the live script.

DNS is authoritative at Porkbun (`A sitelift.toledotechnologies.com` → the VPS). Server-side pieces are
documented in the grace-complete repo at `deploy/sites/toledo/README.md`.
Required GitHub Actions secrets: `VPS_SSH_KEY`, `VPS_HOST`, `VPS_USER`,
`VPS_KNOWN_HOSTS`. Rollback: repoint `current` to a previous release (the
newest 5 are retained), or revert the commit and push.
