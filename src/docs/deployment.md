# Deployment: SiteLift

## Hosting Provider
- **Platform**: Vercel (Pro recommended)
- **Primary Domain**: `sitelift.toledotechnologies.com`

## Build Settings (Vercel)
The project is configured via `vercel.json` and `vite.config.js`.

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Routing
- **Clean URLs**: Enabled (`/fit-check/` instead of `/fit-check/index.html`).
- **Trailing Slashes**: Enforced for SEO consistency.
- **SPA Fallback**: Configured to redirect all non-file requests to `index.html` (handled by `vercel.json`).

## Environment Variables
Currently, no runtime environment variables are required. If adding backend integrations (e.g., custom webhooks), use the `VITE_` prefix for client-side access.

## Manual Deployment
If using the Vercel CLI:
```bash
vercel --prod
```

## Post-Deployment Validation
After each deploy, run the following:
1. **Lighthouse Check**: Ensure Performance and SEO remain at 100.
2. **Form Check**: Verify the Fit Check form correctly posts to FormSubmit.
3. **Cross-Link Check**: Ensure the "Back to Home" links resolve correctly.
