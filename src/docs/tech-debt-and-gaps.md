# Technical Debt and Gaps Analysis: SiteLift

| Priority | Category | Issue | Evidence | Impact | Recommended Fix | Effort | Risk |
|----------|----------|-------|----------|--------|-----------------|--------|------|
| P1 | Testing | Low test coverage | only 2 unit tests exist | Regressions likely in UI logic | Expand Jest suite to cover all splitText types and parallax edge cases | S | Low |
| P1 | Performance | Performance Variability | 0.81-0.97 range | Missing 100/100 target | Further optimize font loading and consider inlining critical CSS variables | S | Low |
| P2 | Accessibility | Accessibility gaps | stuck at 0.95 | Below 100/100 target | Identify remaining missing labels or contrast issues in Lighthouse report | S | Low |
| P3 | Infrastructure | Static hosting with webhook | FormSubmit.co dependency | Potential privacy/routing limits | Transition to custom Edge Function for intake routing (Vercel/Cloudflare) | S | Low |

## Critical Next Action
Perform a **surgical accessibility audit** to identify the specific elements preventing a 100/100 score (currently 0.95), focusing on color contrast in the vibrant Rebirth section or label associations in the new Fit Check form.
