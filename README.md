# SiteLift

Marketing site for `sitelift.toledotechnologies.com`. SiteLift is the productized WordPress-exit offer inside Toledo Technologies LLC: platform-agnostic migrations, a default `$20/mo` hosting target on Vercel Pro plus Cloudflare Pages CMS, and a paid Delphi Fit Check as the front door.

## Live surface

- `/` — positioning, ROI story, package bands, and primary conversion
- `/fit-check/` — paid Delphi Fit Check intake and routing page

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
- Default quote for a typical small-business migration: Aegis at `$9,500`
- Discovery front door: Delphi Fit Check at `$750`
- Platform choice happens during discovery; default stack is not mandatory

## SEO / crawl assets

- OG asset: [`public/og-image.svg`](./public/og-image.svg)
- Favicon: [`public/favicon.svg`](./public/favicon.svg)
- Crawl files: [`public/robots.txt`](./public/robots.txt), [`public/sitemap.xml`](./public/sitemap.xml)
