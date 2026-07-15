# Technical debt and evidence gaps: SiteLift

Updated: 2026-07-15

This register describes current source truth. Historical Lighthouse scores and
the retired FormSubmit route are not treated as present-state evidence.

| Priority | Category | Current gap | Evidence | Next control |
|---|---|---|---|---|
| P1 | Customer proof | No publishable paid-customer migration outcome exists yet | The public Fit Check preview is explicitly illustrative | Do not publish a case study until delivery evidence, metric provenance, and written permission exist |
| P1 | Conversion evidence | A working intake path does not prove that qualified buyers complete it | Source tests cover the five-field, email-only-required contract; real conversion data is unknown | Measure requested Fit Checks and paid conversions without inventing a benchmark |
| P2 | Intake dependency | Lead capture depends on the Toledo intake service at `https://eolkits.com/api/v1/lead` | `src/fit-check/index.html` and `src/script.js` use that endpoint | Keep the visible error state, monitor endpoint health, and preserve direct email as fallback |
| P2 | Third-party fonts | Pages request Google Fonts at runtime | Every HTML entry preconnects to and loads `fonts.googleapis.com` | Reassess self-hosting if privacy, availability, or performance evidence justifies the asset work |
| P2 | Browser coverage | Source and unit tests do not replace release-browser evidence | Browser verification is an explicit release gate | Re-run exact 1440×900 and 390×844 route, overflow, navigation, legal, and form checks for every release |

## Next evidence milestone

After the truth-safe release is live, the next product milestone is one real,
permissioned Fit Check or migration with preserved before/after artifacts. A
public result still requires a clear evidence source, limitations, and written
publication approval.
