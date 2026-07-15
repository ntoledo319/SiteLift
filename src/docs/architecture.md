# Architecture: SiteLift

## System Overview

SiteLift is a static vanilla HTML/CSS/JS marketing site with an "Editorial Impact" aesthetic. It prioritizes low-latency delivery, explicit account and ownership terms, and measurable release checks without publishing unsupported score claims.

## Main Modules & Responsibilities

### Frontend Structure

- **`src/index.html`**: Canonical marketing entry point.
- **`src/fit-check/index.html`**: Five-field paid-discovery intake; only email is required.
- **`src/privacy/index.html` and `src/terms/index.html`**: Site-specific legal records grounded in Toledo's corporate policy and signed-agreement boundaries.
- **`src/style.css`**: CSS variables, responsive layout, and visual system.
- **`src/script.js`**: ES module that handles:
    - Custom cursor tracking with easing.
    - Intersection Observer-based reveals.
    - Throttled scroll parallax.
    - Text splitting/staggered animations.

## Directory Structure

- `src/`: Vite root and production HTML/CSS/JS source.
- `src/public/`: Deployable favicon, OG, robots, sitemap, and `llms.txt` assets.
- `src/docs/`: Technical documentation and project history.
- `src/test/`: Jest unit and content-contract tests.
- `vite.config.js`: Explicit multi-page build inputs for home, Fit Check, privacy, and terms.

## Data Flow

The site is static except for outbound lead capture. The Fit Check form POSTs to `https://eolkits.com/api/v1/lead`, which stores the inquiry in Toledo's operating lead database and emails the owner; the page renders success or failure in place. Direct `mailto` remains available.

## Performance Strategy

- **Vanilla Only**: No heavy frameworks (React/Vue) or large libraries (GSAP/jQuery).
- **Critical CSS**: Variables and core layout defined at the top of `style.css`.
- **Deferred JS**: Scripts are loaded as `type="module"` which defers them by default.
- **Image Optimization**: Utilizes Unsplash source-level optimization (query params).

## Security Boundaries

- **Static Assets**: No backend execution, reducing the attack surface.
- **No client framework**: Runtime code remains vanilla; build, lint, and test dependencies are development-only.
- **No secrets in the site**: The public form endpoint and routing context are non-secret; credentials remain outside the repository.
