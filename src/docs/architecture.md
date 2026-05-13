# Architecture: SiteLift

## System Overview

SiteLift is a high-performance, vanilla HTML/CSS/JS marketing site designed with an "Editorial Impact" aesthetic. It prioritizes low-latency, sovereign data ownership, and a perfect Lighthouse score (100/100).

## Main Modules & Responsibilities

### Frontend Structure

- **index.html**: Canonical entry point. Uses semantic HTML5 and a modular script approach.
- **style.css**: Uses CSS Variables (tokens) for theming and layouts. Employs modern features like `clip-path` and `mask-image` for high-impact visuals without external assets.
- **script.js**: ES Module that handles:
    - Custom cursor tracking with easing.
    - Intersection Observer-based reveals.
    - Throttled scroll parallax.
    - Text splitting/staggered animations.

## Directory Structure

- `/`: Production entry points.
- `/assets/`: Optimized images and SVG motifs.
- `/docs/`: Technical documentation and project history.
- `/test/`: Jest unit tests for UI logic.

## Data Flow

The site is entirely static. User interaction is captured via standard `mailto` links or will be routed to a quote-based intake form in the future.

## Performance Strategy

- **Vanilla Only**: No heavy frameworks (React/Vue) or large libraries (GSAP/jQuery).
- **Critical CSS**: Variables and core layout defined at the top of `style.css`.
- **Deferred JS**: Scripts are loaded as `type="module"` which defers them by default.
- **Image Optimization**: Utilizes Unsplash source-level optimization (query params).

## Security Boundaries

- **Static Assets**: No backend execution, reducing the attack surface.
- **No Dependencies**: Minimized external dependency footprint (only dev-time tools).
