# SiteLift

Marketing site for `sitelift.toledotechnologies.com`. SiteLift is the productized WordPress-exit offer inside Toledo Technologies LLC: platform-agnostic migrations, a default `$20/mo` hosting target on Vercel Pro plus Cloudflare Pages CMS before overages and third-party services, and a paid Delphi Fit Check as the front door.

## Live surface

- `/` — positioning, ROI story, package bands, and primary conversion
- `/fit-check/` — paid Delphi Fit Check intake and routing page
- `/privacy/` — SiteLift-specific inquiry and request-data policy
- `/terms/` — website terms and signed-agreement boundaries

## Lead capture

The Delphi Fit Check intake form submits to the G.R.A.C.E. lead bus at
`https://eolkits.com/api/v1/lead` for durable capture: every submission is
recorded to a database and emails the owner on a working mail path. This
replaced the old FormSubmit flow, which was dead at mxroute and silently
dropped submissions. The form posts via AJAX `fetch` and renders an in-page
success state from the endpoint's JSON (`{ok, lead_id}`); it does not redirect. The first
step has five visible fields, requires only email, and carries hidden product, source, offer, and collection-context
fields so the lead remains attributable without front-loading the full paid assessment.

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
- Discovery credit: 50% toward the kickoff Project Retainer within 30 days, capped at that Project Retainer; unused credit lapses with no roll-forward
- Platform choice happens during discovery; default stack is not mandatory
- Account control and deliverable ownership are separate: completed proposal-defined deliverables transfer on final payment, while reusable methods, components, and internal tools remain Toledo property unless the signed agreement says otherwise
- Public payback example is an estimate: `$9,500 ÷ ($300–$500 current monthly cost − $20 target baseline) = about 20–34 months`; the full Aegis band under those assumptions is roughly 16–45 months

## SEO / crawl assets

- OG asset: [`src/public/og-image.svg`](./src/public/og-image.svg)
- Favicon: [`src/public/favicon.svg`](./src/public/favicon.svg)
- Crawl files: [`src/public/robots.txt`](./src/public/robots.txt), [`src/public/sitemap.xml`](./src/public/sitemap.xml)

Vite is rooted at `src/`, so deployable public files must live in `src/public/`.

## Deployment

Every push to `main` deploys automatically. `.github/workflows/deploy.yml`
installs dependencies, runs lint and Jest, builds the site into `dist/`, verifies
the home, Fit Check, privacy, terms, and sitemap artifacts, stamps `version.txt`
with the commit SHA, and streams the payload over
SSH to the G.R.A.C.E. VPS (`15.204.209.97`). A forced-command release script
(`/home/ubuntu/bin/deploy-toledo-sitelift`) extracts it into a timestamped release and atomically
swaps the `current` symlink that host Caddy serves at `sitelift.toledotechnologies.com`; the workflow
then polls `https://sitelift.toledotechnologies.com/version.txt` until the new build is provably live and smoke-checks the public conversion and legal routes.

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
