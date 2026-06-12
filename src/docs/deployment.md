# Deployment: SiteLift

## Hosting Provider
- **Platform**: GRACE OVH VPS (`15.204.209.97`) — host Caddy + Let's Encrypt.
- **Primary Domain**: `sitelift.toledotechnologies.com`
- **Webroot**: `/var/www/toledo/sitelift.toledotechnologies.com/current` (atomic release symlink).

> **History:** the site originally deployed on Vercel. DNS was cut to the GRACE VPS on 2026-06-05, and `vercel.json` was removed on 2026-06-12 when push-to-deploy landed — Vercel is fully out of the path.

## Build
- **Build Command**: `npm run build` (Vite)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Deploy (atomic, zero-downtime)

**Primary path — push to `main`.** `.github/workflows/deploy.yml` builds `dist/`, stamps `version.txt` with the commit SHA, and streams the build over SSH to a least-privilege forced-command deploy key on the VPS. The release script (`/home/ubuntu/bin/deploy-toledo-sitelift`) extracts it into a timestamped directory under `releases/` and atomically flips the `current` symlink (5 releases retained). The workflow then polls `https://sitelift.toledotechnologies.com/version.txt` until the pushed SHA is live — a deploy isn't green until the new build is provably serving.

Required GitHub Actions secrets: `VPS_SSH_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_KNOWN_HOSTS`. Server-side pieces (release script, Caddy block, deploy-key security model) are documented in the grace-complete repo at `deploy/sites/toledo/README.md`.

**Manual fallback** (from a machine with full SSH access):

```bash
npm ci && npm run build
tar czf - -C dist . | ssh ubuntu@15.204.209.97 /home/ubuntu/bin/deploy-toledo-sitelift
```

Rollback: on the VPS, repoint `current` to the previous directory under `releases/` — or revert the commit and push.

## Routing
- **Clean URLs / trailing slashes**: handled by Caddy (directory URLs canonicalize; both `/fit-check` and `/fit-check/` resolve).

## Environment Variables
None required at runtime. If adding backend integrations (e.g., custom webhooks), use the `VITE_` prefix for client-side access.

## Post-Deployment Validation
1. **Lighthouse Check**: ensure category scores stay ≥ 0.9 (CI asserts this via `.lighthouserc.json`).
2. **Form Check**: verify the Fit Check form posts to FormSubmit.
3. **Cross-Link Check**: ensure "Back to Home" links resolve.
4. `curl -s -o /dev/null -w '%{http_code}' https://sitelift.toledotechnologies.com/fit-check/` → expect `200`.
