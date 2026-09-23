# SiteLift product audit — 2026-09-23

Scope: `sitelift.toledotechnologies.com` as built from `origin/main` @ `96caad9` (the live `version.txt` matched this SHA on 2026-09-23). Branch `audit/product-audit-2026-09-23`. Not pushed, not deployed.

## Summary

**What was inspected**
- All four routes (`/`, `/fit-check/`, `/privacy/`, `/terms/`), `script.js`, `style.css`, the crawl files (`robots.txt`, `sitemap.xml`, `llms.txt`), the Vite config and both GitHub workflows.
- Live response headers via read-only GETs.
- The Fit Check lead endpoint `https://eolkits.com/api/v1/lead`. I read its source (read-only) at `Product Command/PRODUCTS/eolkits/source/apps/grace-api/eolkits_grace/app.py` and sent one OPTIONS preflight, which creates no lead. **No lead was ever POSTed.**
- Real network traffic in headless Chrome. The Cloudflare beacon payload was captured and then aborted, so no analytics were sent from the audit.
- Cookies and storage, axe-core WCAG 2.2 AA plus best-practice scans, keyboard flows, mobile reflow at 320 and 375 px, and reduced motion.

**What was changed**
1. **Privacy notice was false.** The live `/privacy/` page said the site "does not currently load client-side analytics". In fact, every page loads Cloudflare Web Analytics (added in `6c93961`/`96caad9`). The notice also left out Google Fonts and Unsplash. It is now rewritten to match the traffic I captured, and it now includes a Do Not Track / GPC statement as CalOPPA requires. Revision date: 2026-09-23.
2. **Contrast failures fixed** (found by axe):
   - Section labels: 2.79–3.75:1.
   - "Default" badge: 4.23:1.
   - Fit Check "Visit ToledoWeb" button: default-blue `#0000ee` on black, 2.09:1.
   - Fit Check credit fine print (`.cta-sub`): was 40% opacity.
3. **Mobile menu bugs fixed.** The menu stayed open over the page after tapping an in-page link. Keyboard focus also went to content hidden behind the overlay. Now the menu closes when you choose a link or when focus leaves it, and opening it moves focus into the links.
4. **Split-text animation fixed.** It rebuilt headings letter by letter and removed the hero's strikethrough and italic accents. Now:
   - Screen readers get one clean copy of the text.
   - The animated copy is `aria-hidden`.
   - Inline markup is kept.
5. **Skip link added** on all four pages, targeting `#main-content`.
6. **Label-in-name fixed on tier buttons (WCAG 2.5.3).** "Start Here" was named "Start with Aegis" and "Scale" was named "Request Odyssey Fit Check". Names now start with the visible text.
7. **Fit Check form hardened:**
   - 20 s request timeout, so it can no longer sit on "Sending…" forever.
   - Success is shown only when the response is `{ok:true}`.
   - Focus moves to the success heading, or back to the submit button on error.
8. **Machine-readable pricing aligned with the page:**
   - JSON-LD no longer caps Elysian at $65,000, because the page shows "$30K-$65K+".
   - `llms.txt` no longer presents Aegis as a bare "~$9,500" and no longer says "you own all accounts". It now lists the published bands and says "client accounts stay under client control".
9. **Minor accessibility fixes:**
   - Decorative Unsplash photos now have `alt=""`.
   - The scroll-cue animation runs twice instead of forever.
10. **Regression tests added** for every item above. Jest went from 20 to 34 tests.

## Applicability and findings register

| # | Check | Trigger / evidence | Class | Basis | Severity | Status | Verification |
|---|---|---|---|---|---|---|---|
| 1 | Privacy notice accuracy | Every page loads `static.cloudflareinsights.com/beacon.min.js`. The live policy said no client-side analytics. | APPLIES | Law: FTC Act §5 (deceptive statements); CalOPPA §22575 (must follow the posted policy) | High | FIXED | Captured beacon POST to `cloudflareinsights.com/cdn-cgi/rum`. New copy reviewed; content tests fail if the beacon is present and the disclosure is missing |
| 2 | Actual analytics collection | Beacon payload: page URL, pageloadId (random per load), browser brand/version, JS heap size, navigation timings, site token. Headers: UA, client hints, referer, and IP (inherent). | APPLIES | Engineering / disclosure | Info | OK | Playwright capture. No PII in URLs, because the form uses POST and never puts fields in the query string |
| 3 | Cookies and browser storage | `document.cookie` empty. localStorage and sessionStorage empty on all 4 routes. Browser context has 0 cookies. | APPLIES | Engineering | — | OK | Playwright, before and after the fixes |
| 4 | Consent banner / GPC opt-out | No advertising, no sale, no cross-site tracking, no cookies. CTDPA opt-out signals apply only to targeted advertising and sale. | NOT APPLICABLE | Law: CTDPA opt-out-signal rule (CT AG) | — | OK | No banner added (prompt §1.E). DNT/GPC behaviour disclosed |
| 5 | CT Data Privacy Act applicability | Thresholds: ≥35,000 consumers, OR any sensitive data, OR any sale. SiteLift collects no sensitive data and sells nothing. The owner's CT consumer count is not in evidence. | UNKNOWN | Law: CTDPA | — | OPEN | Would add formal rights and retention duties only if the owner crosses 35,000 consumers. See release blockers |
| 6 | CalOPPA privacy-policy contents | Lead form collects email from a nationally reachable site. | APPLIES | Law: Cal. Bus. & Prof. Code §22575 | Medium | FIXED | Policy now covers categories collected, third parties, DNT handling, and the effective date |
| 7 | Third-party asset hosts | fonts.googleapis.com, fonts.gstatic.com, images.unsplash.com, static.cloudflareinsights.com, cloudflareinsights.com (host list captured in Playwright) | APPLIES | Disclosure / engineering | Low | FIXED | Disclosed in the policy. Self-hosting the fonts is optional (Google receives visitor IPs). Google says the Fonts API does not set cookies |
| 8 | Lead form data flow | POST to eolkits.com. Backend has CORS allowlist, honeypot, per-IP/day/global rate limits, email validation, body-size limit, durable storage with re-sent notification (source read-only). Preflight returns ACAO `https://sitelift.toledotechnologies.com`. | APPLIES | Engineering | — | OK | OPTIONS preflight only. Backend source reviewed, not the deployed binary |
| 9 | Form UX states | Before: no timeout, blind JSON success, focus lost after submit. | APPLIES | WCAG 3.3.1 / 4.1.3; engineering | Low | FIXED | Mocked endpoint in Playwright: empty submit blocked natively; success focuses the heading; 500 and `{detail}` show the error and refocus submit |
| 10 | No-JS form fallback | With JS off, the native POST returns raw JSON from eolkits.com. | APPLIES | Engineering | Low | OPEN | Needs an allow-listed `_next` thank-you route plus JS stripping `_next`. Left alone to avoid touching the working AJAX path |
| 11 | Retention / deletion for leads | Policy offers access, correction, and deletion by email. No retention period is stated. Leads live in the GRACE lead DB. | APPLIES | Engineering; law only if CTDPA applies | Low | OPEN | Owner decision (retention period). No period was invented |
| 12 | Colour contrast | axe: `.section-label` 2.79–3.75:1, `.badge` 4.23:1, fit-check `.tier-btn` 2.09:1 | APPLIES | WCAG 2.2 AA 1.4.3 | Medium | FIXED | axe re-run: 0 violations on all 4 routes |
| 13 | Label in name | Tier button names did not contain the visible text ("Start Here", "Scale") | APPLIES | WCAG 2.5.3 (A) | Medium | FIXED | Jest content test |
| 14 | Split-text headings | Headings spoken letter by letter; hero strikethrough and italic removed at runtime | APPLIES | WCAG 1.3.1; design integrity | Medium | FIXED | Accessibility snapshot: `heading "SITELIFT"`, full paragraph read once. Screenshot shows the accents restored. Jest test |
| 15 | Mobile menu keyboard/touch | Menu stayed open after tapping an anchor. Focus reached content behind the overlay. | APPLIES | WCAG 2.4.3 / 2.4.11; functional | Medium | FIXED | Playwright at 375 px: link closes the menu; tabbing past the menu closes it. Jest test |
| 16 | Skip navigation | No skip link on any page | APPLIES | WCAG 2.4.1 | Low | FIXED | Playwright: first Tab = skip link; Enter then Tab lands inside `<main>` on all 4 routes |
| 17 | Reduced motion | JS gates parallax and cursor; CSS neutralises animations | APPLIES | WCAG 2.3.3 (AAA) / good practice | — | OK | Playwright `reducedMotion: reduce`: 0 hidden reveal elements, no custom cursor |
| 18 | Auto-moving decoration | Hero `leak-move` blurred glow loops for 20 s indefinitely. Scroll cue was infinite. | APPLIES | WCAG 2.2.2 (A) | Low | OPEN | Scroll cue now runs 2× (4 s). The decorative glow is a design call: honoured under reduced motion, but no pause control |
| 19 | Reflow 320/375 px | No horizontal scroll on any route | APPLIES | WCAG 1.4.10 | — | OK | `scrollWidth == innerWidth` at 320 and 375 on all routes |
| 20 | Decorative images | Unsplash photos had descriptive alt text on purely decorative backgrounds | APPLIES | WCAG 1.1.1 | Low | FIXED | Set to `alt=""` |
| 21 | Security headers | Live: HSTS preload, nosniff, XFO SAMEORIGIN, Referrer-Policy, Permissions-Policy. No CSP. | APPLIES | Engineering (OWASP) | Low | OPEN | Headers are set in host Caddy (grace-complete), outside this repo. A CSP needs allowances for Cloudflare, Google Fonts, Unsplash, eolkits, and the inline Fit Check script |
| 22 | Exposed files / secrets | `/.git/config` returns 404. Beacon token is a public site token. No secrets in repo files. | APPLIES | Engineering | — | OK | curl, grep |
| 23 | Dependencies | 0 production deps (static output). `npm audit`: 44 dev-only advisories (15 high: babel, body-parser, brace-expansion and others via lighthouse/jest). | APPLIES | Engineering | Low | OPEN | Dev tooling only runs in CI on trusted code. `npm audit fix` is left for a separate lockfile PR |
| 24 | Pricing and claims | Bands, $750 Fit Check, credit rule, and "Estimate only" payback math are consistent across pages. JSON-LD and llms.txt drifted. | APPLIES | FTC §5 (truthful advertising) | Low | FIXED | JSON-LD Elysian now open-ended. llms.txt bands match. Jest tests |
| 25 | "$20/mo" Vercel Pro baseline | Vercel lists Pro at $20/month per deploying seat with $20 usage credit, then pay-as-you-go | APPLIES | FTC §5 | — | OK | The page already says "Usage overages and third-party services are separate". A client with more than one deploying seat pays more; the owner may want to say "per seat" |
| 26 | Image / font licensing | Unsplash License allows commercial use without attribution. Lora, Outfit, and JetBrains Mono are OFL via Google Fonts. | APPLIES | Licence terms | — | OK | Images come from `images.unsplash.com` (standard library, not Unsplash+) |
| 27 | Support/contact inbox | `hello@toledotechnologies.com` is the error fallback and the privacy-request channel. MX is mxroute; the README records earlier mxroute delivery failures (FormSubmit). | APPLIES | Engineering | Medium | BLOCKED | Delivery can't be checked without sending mail (forbidden). Owner must confirm the inbox receives mail |
| 28 | Payments, subscriptions, refunds | No checkout on site. The $750 fee is invoiced after a reply, and terms defer to the signed agreement. | NOT APPLICABLE | — | — | — | No payment code or provider on the site |
| 29 | Accounts, auth, roles, multi-tenant, uploads, UGC, DMCA, moderation | None exist (static marketing site) | NOT APPLICABLE | — | — | — | Code inspection |
| 30 | Marketing email/SMS (CAN-SPAM, TCPA) | No list sign-up. The form states "No newsletters". | NOT APPLICABLE | — | — | — | Code inspection |
| 31 | Children / age gating, health, finance, biometrics, location | B2B migration service, not child-directed. Policy has an under-13 statement. | NOT APPLICABLE | — | — | — | Content review |
| 32 | AI features / session replay / native apps / extensions | None present | NOT APPLICABLE | — | — | — | Network capture and code inspection |
| 33 | ADA Title III legal exposure | DOJ says Title III covers websites of public accommodations but sets no technical standard | UNKNOWN | Law: ADA | — | OK | Engineering target is WCAG 2.2 AA. Automated passes are not full conformance |
| 34 | Deploy pipeline | SSH forced-command deploy, pinned host key, `contents: read`, version gate | APPLIES | Engineering | — | OK | Workflows reviewed, not modified |

Counts by status: FIXED 11 · OPEN 6 · BLOCKED 1 · OK 11 (adequate, left alone). By classification: APPLIES 26 · NOT APPLICABLE 6 (grouped) · UNKNOWN 2.

## Tests run

| Command / check | Outcome |
|---|---|
| `npm test` | 34/34 pass (was 20). New: privacy-vs-beacon contract, third-party disclosure, DNT/GPC statement, skip links, label-in-name, contrast tokens, form focus/timeout, JSON-LD Elysian, llms.txt bands, menu close on link/focusout, split-text accessibility and markup preservation |
| `npm run lint` (eslint + stylelint) | Pass |
| `npm run build` | Pass (4 HTML entries) |
| axe-core 4.x in Chrome, tags wcag2a/2aa/21a/21aa/22aa/best-practice, after scrolling each page | Before: 8 contrast nodes across 4 routes. After: 0 violations on all 4 routes |
| Playwright network, cookie, and storage capture (Cloudflare RUM aborted after capture) | Hosts listed in register row 7. 0 cookies. Empty storage |
| Keyboard: Tab, skip link, Enter, Tab on each route | First stop is the skip link. Focus lands in `<main>` |
| Mobile 375×812 menu: tap anchor; keyboard tab-through | Menu closes; `#tiers` scrolled to top. Focus never left behind the overlay |
| Fit Check with mocked endpoint (success / HTTP 500 / non-ok JSON) | Correct state, focus, and button re-enable in each case. Empty email blocked with no request sent |
| Reduced motion | All reveal content visible. Parallax and cursor off |
| Reflow at 320 and 375 px | No horizontal scroll |
| Visual screenshots (hero, fit-check route button, privacy page) | Accents restored. Button readable. Privacy layout intact |
| `npm audit` / `npm audit --omit=dev` | 44 dev-only advisories / 0 production |

**Untested boundaries**
- Real submission to the live lead API (forbidden). CORS was proven by preflight only.
- Actual email delivery to hello@ or the owner.
- Screen-reader testing with NVDA/VoiceOver. Only the accessibility tree was checked.
- Safari and Firefox.
- 200% text zoom beyond the reflow check.
- Whether the Cloudflare dashboard retains or uses data beyond its public docs.
- The deployed eolkits binary. Its source was reviewed, not the running build.
- The 20 s timeout path was not run in a browser (code path covered by review).

## Release-blocking issues

None of the committed changes need a credential to ship. Merging to `main` deploys them automatically. The owner should decide:

1. **Approve the new privacy wording** in `src/privacy/index.html` before merge. It corrects a live misstatement: the site claims no analytics while Cloudflare Web Analytics runs. Merging soon is recommended.
2. **Confirm `hello@toledotechnologies.com` receives mail** (mxroute). It is the only privacy-request and error-fallback channel. BLOCKED: I cannot send test mail.
3. **Retention period for Fit Check leads** in the GRACE lead DB. The policy states none. Pick one, or confirm "until you ask us to delete it", and it can be added.
4. **CTDPA headcount:** confirm Toledo Technologies processes data of fewer than 35,000 Connecticut consumers per year. If not, a fuller rights and retention notice is required.
5. Optional: add a CSP to the host Caddy config (grace-complete, VPS). Out of scope here; it needs VPS access.

## Sources

All checked 2026-09-23.
- CT AG, Connecticut Data Privacy Act (thresholds: 35,000 consumers / sensitive data / sale; opt-out signals from 2025-01-01): https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act
- CalOPPA, Cal. Bus. & Prof. Code §22575 (policy contents, DNT disclosure): https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=22575.
- CA AG privacy laws overview: https://oag.ca.gov/privacy/privacy-laws
- FTC privacy and security enforcement (Section 5 deception): https://www.ftc.gov/news-events/topics/protecting-consumer-privacy-security/privacy-security-enforcement
- DOJ ADA web guidance: https://www.ada.gov/resources/web-guidance/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Cloudflare Web Analytics docs: https://developers.cloudflare.com/web-analytics/about/
- Cloudflare privacy-first analytics (no cookies, localStorage, or fingerprinting): https://blog.cloudflare.com/privacy-first-web-analytics/
- Google Fonts privacy FAQ (IP received; no cookies; not used for ad profiles): https://developers.google.com/fonts/faq/privacy
- Unsplash License: https://unsplash.com/license
- Vercel pricing (Pro $20/month per deploying seat, $20 usage credit): https://vercel.com/pricing

## Migration, configuration, and rollback

- **Migration:** none. Static files only. No data, schema, environment, or secret changes. Workflows are untouched.
- **Configuration:** none required. Main content is now `id="main-content"`; the legal pages used `id="welcome"`, which nothing referenced.
- **Deploy:** merging `audit/product-audit-2026-09-23` to `main` triggers `.github/workflows/deploy.yml`. Nothing was pushed from this audit.
- **Rollback:** `git revert` the audit commit(s) and push. Or, on the VPS, repoint the `current` symlink to the previous release (the newest 5 are kept), as described in the README.
- **Post-deploy check:** `curl https://sitelift.toledotechnologies.com/privacy/ | grep "Cloudflare Web Analytics"`. Then run one real Fit Check submission as the owner to confirm the success state.
