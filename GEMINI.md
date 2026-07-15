# SiteLift Project Guidance

## Architecture & Conventions

- **Naming:** The service is strictly named **SiteLift**.
- **Performance:** All frontend work must target a **100/100 Lighthouse score**. Use vanilla HTML/CSS/JS only. No external JS libraries or heavy frameworks allowed without explicit approval.
- **Styling:** Adhere to the **High-Impact Editorial** aesthetic. Use radical asymmetry, overlapping grid layouts, and massive typography (using the current Lora/Outfit pairing).
- **Assets:** Utilize **Laser Cyan (#06B6D4)** as the primary brand accent. Implement the "chopped up" logo motif as fragmented, parallax-driven background watermarks.
- **Imagery:** Prefer high-resolution architectural and abstract light photography (curated via Unsplash with performance query params).

## Product Data (Single Source of Truth)

- **Flagship Package:** "Aegis" — **$7,500–$12,500**.
- **Hosting Baseline:** **$20/month** (default stack: Vercel Pro + Cloudflare Pages CMS).
- **ROI Narrative:** Show payback only as an estimate with its inputs. At the `$9,500` Aegis default quote and `$300–$500/mo` current cost against a `$20/mo` target baseline, the estimate is **about 20–34 months**. The full Aegis band under those assumptions is roughly **16–45 months**.
- **Platform Disclosure:** Always include the note: _"Other hosting platforms available upon request and may lead to price adjustment."_

## Project Structure

- **Production Files:** `src/index.html`, `src/fit-check/index.html`, `src/style.css`, and `src/script.js`.
- **Design Docs:** `src/docs/`.
- **Public Assets:** `src/public/` because Vite's root is `src`.

## Deployment (this repo)

The marketing site itself is hosted on the G.R.A.C.E. VPS, **not** Vercel (the
$20/mo Vercel Pro stack above is the *client offer*, unrelated to this repo's
hosting). Pushing to `main` IS the deployment: `.github/workflows/deploy.yml`
builds `dist/` and ships an atomic release to the VPS, then verifies the
pushed SHA is live. Details: `src/docs/deployment.md` and
`grace-complete/deploy/sites/toledo/README.md`. Never reintroduce
`vercel.json` or rely on a Vercel project.
