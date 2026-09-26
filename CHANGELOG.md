# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Meta Content-Security-Policy on every page, with hash-allowed inline code and a build-time drift check.
- "Pause motion" control for the hero glow, scroll cue, and parallax (WCAG 2.2.2), remembered per visitor.
- No-JS Fit Check confirmation at `/fit-check/received/` via the lead API's `_next` redirect.
- Explicitly illustrative, redacted Fit Check format preview.
- Regression coverage for reveal fail-open behavior, commercial copy, form context, and public assets.
- Site-specific privacy and terms routes, with build, sitemap, and content-contract coverage.
- CI lint, Jest, build-artifact, and post-deploy route gates.

### Changed
- Privacy notice now states that inquiry records are deleted automatically 24 months after submission (revised September 26, 2026).
- Pinned GitHub Actions to commit SHAs and gave CI read-only permissions.
- Applied non-breaking dev-dependency security updates (npm audit 44 → 14, all dev-only).
- Labeled payback as an estimate and published the calculation, assumptions, and wider package-range outcome.
- Reduced the first Fit Check brief to five visible fields while preserving hidden lead context.
- Replaced “Book” language with direct “Start” language for the in-site Fit Check route.

### Fixed
- Removed the unsupported registered-service-mark statement.
- Made scroll reveals fail open without JavaScript/IntersectionObserver and immediate under reduced motion.
- Expanded the mobile-menu control to a 48×48px target and stacked narrow-screen footer content.
- Moved all Vite public assets under `src/public/` so they are emitted in production builds.

## [1.0.0] - 2026-07-02
### Added
- Lead forms point at GRACE /api/v1/lead capture.
- `llms.txt` for AEO (AI Engine Optimization).
- `prefers-reduced-motion` a11y support.
- Delphi Fit Check page with intake form.
- Automated deployment to G.R.A.C.E. VPS via GitHub Actions.
- Performance optimizations: passive mousemove, RAF pause on tab hide, hero preload hints.

### Fixed
- Moved `llms.txt` into `src/public` since Vite root is `src/`.
- Stylelint empty-line-before error in reduced-motion block.
- Enforced real Lighthouse floor and synced pricing docs.

### Removed
- Redundant Vercel hosting references and deploy workflow (switched to G.R.A.C.E. VPS auto-deploy).
