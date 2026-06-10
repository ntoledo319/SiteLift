# Deployment: SiteLift

## Hosting Provider
- **Platform**: GRACE OVH VPS (`15.204.209.97`) — host Caddy + Let's Encrypt.
- **Primary Domain**: `sitelift.toledotechnologies.com`
- **Webroot**: `/var/www/toledo/sitelift.toledotechnologies.com/current` (atomic release symlink).

> **History:** the site originally deployed on Vercel; `vercel.json` remains in the repo as legacy config. DNS now points at the GRACE VPS — do **not** rely on Vercel deploys, and treat any still-linked Vercel project as dormant.

## Build
- **Build Command**: `npm run build` (Vite)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Deploy (atomic, zero-downtime)
Stream the built `dist/` to the VPS as a timestamped release, then atomically flip the `current` symlink (the pattern used by all Toledo static sites; 5 releases retained for rollback):

```bash
npm run build
bash /Users/nicholastoledo/Development/business-ops/system-reconciliation/deploy-static.sh dist sitelift.toledotechnologies.com
```

Rollback: on the VPS, repoint `current` to the previous directory under `releases/`.

## Routing
- **Clean URLs / trailing slashes**: handled by Caddy (directory URLs canonicalize; both `/fit-check` and `/fit-check/` resolve).

## Environment Variables
None required at runtime. If adding backend integrations (e.g., custom webhooks), use the `VITE_` prefix for client-side access.

## Post-Deployment Validation
1. **Lighthouse Check**: ensure category scores stay ≥ 0.9 (CI asserts this via `.lighthouserc.json`).
2. **Form Check**: verify the Fit Check form posts to FormSubmit.
3. **Cross-Link Check**: ensure "Back to Home" links resolve.
4. `curl -s -o /dev/null -w '%{http_code}' https://sitelift.toledotechnologies.com/fit-check/` → expect `200`.
