# Testing Strategy: SiteLift

## Current Framework

- **Jest**: Unit testing for JS logic.
- **JSDOM**: Mocking the browser environment.

## Test Types

- **Unit Tests**: Found in `test/script.test.js`. These test the core interaction functions (`initMobileMenu`, `updateParallax`).
- **Lighthouse (Manual)**: Performance/SEO validation (target 100/100).

## How to Run Tests

```bash
npm test
```

## Coverage Gaps

- **Animation Orchestration**: Testing that `splitTexts` correctly creates the expected DOM structure.
- **Visual Regressions**: No current automated system for CSS/Visual regressions.
- **Accessibility**: No automated WCAG audit in the CI pipeline.

## Recommended Next Tests

- Add a test for `splitTexts` to verify character span generation.
- Add a test for `initCursor` to ensure mousemove events update internal state (may require mocking `requestAnimationFrame` timing).
