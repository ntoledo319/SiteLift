# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
