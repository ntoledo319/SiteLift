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

## Round 2 fixes (2026-09-24)

Built on the round-1 commit `6cbee80`, which is now `origin/main`; live `version.txt` read `6cbee80…` on 2026-09-24. Nothing from round 2 was pushed or deployed. `/fit-check/received/` returns 404 on the live site until this branch merges.

1. **Meta CSP on every page** (row 21). All 5 pages now have one policy tag, placed before any script or stylesheet. The Fit Check page's inline `<script>` and `<style>` are allowed by sha256 hash, so no page allows `'unsafe-inline'` or `'unsafe-eval'`. Every page uses the same base policy:
   - `connect-src` and `form-action` include `https://eolkits.com`, because the driver oracle checks every page against every lead-form target.
   - `form-action` also names `https://sitelift.toledotechnologies.com`. In production `'self'` already covers the `_next` redirect; the explicit origin keeps local previews working. Chromium applies `form-action` to the redirect: in a control run without it, the redirect was blocked.
   - Only the home page allows `images.unsplash.com`.
   - The policy leaves out `frame-ancestors` and reporting, which browsers ignore in `<meta>`. Framing is still blocked by the host's `X-Frame-Options`.
   - `npm run build` now ends with `scripts/check-csp.js`. It fails on hash drift, stale hashes, unsafe sources, or hosts that are not allowed, and prints the hash each changed block needs.
2. **Pause motion control** (row 18). A native toggle button in the hero pauses the looping glow, the scroll cue, and scroll parallax.
   - It is modelled on ToledoMobile's control and styled like the site's pills.
   - It starts paused under reduced motion. The visitor's explicit choice wins and is saved in localStorage.
   - Without JS the glow no longer loops, and the button stays hidden.
3. **No-JS Fit Check** (row 10). A hidden `_next` field sends a native POST to the new `/fit-check/received/` page, which shows the existing success wording. The fetch path removes `_next`, so the JSON `{ok:true}` / `{detail}` flow and request fields are unchanged. The page is `noindex` and not in the sitemap.
4. **Dev dependencies** (row 23). Non-breaking `npm audit fix` took advisories from 44 to 14, with Vite held at 8.0.16 so the shipped files stay byte-identical. The remaining 14 are in row 35.
5. **CI hardening** (row 34). Actions are pinned to commit SHAs, and `ci.yml` now has `permissions: contents: read`.
6. **Privacy notice** (rows 3 and 6) now discloses the one stored motion setting. The revision date is now 2026-09-24.

**How it was tested:**
- Jest: 34 → 53 tests.
- Build-time CSP check.
- Chromium (Playwright) sweeps at 1280 and 375 px, keyboard use, and reduced motion.
- A no-JS end-to-end run over local HTTPS stand-ins.
- axe-core.
- The four driver oracles.

Details are under Tests run.

## Applicability and findings register

| # | Check | Trigger / evidence | Class | Basis | Severity | Status | Verification |
|---|---|---|---|---|---|---|---|
| 1 | Privacy notice accuracy | Every page loads `static.cloudflareinsights.com/beacon.min.js`. The live policy said no client-side analytics. | APPLIES | Law: FTC Act §5 (deceptive statements); CalOPPA §22575 (must follow the posted policy) | High | FIXED | Captured beacon POST to `cloudflareinsights.com/cdn-cgi/rum`. New copy reviewed; content tests fail if the beacon is present and the disclosure is missing |
| 2 | Actual analytics collection | Beacon payload: page URL, pageloadId (random per load), browser brand/version, JS heap size, navigation timings, site token. Headers: UA, client hints, referer, and IP (inherent). | APPLIES | Engineering / disclosure | Info | OK | Playwright capture. No PII in URLs, because the form uses POST and never puts fields in the query string |
| 3 | Cookies and browser storage | `document.cookie` empty on all routes. localStorage and sessionStorage stay empty unless the visitor presses Pause motion, which stores one key (`sitelift-motion` = `paused`/`running`). Nothing is written by default, including under reduced motion. | APPLIES | Engineering; disclosure | — | OK | Playwright, round 2: storage empty after load; one key after pressing the control. Privacy notice now discloses it (row 6) |
| 4 | Consent banner / GPC opt-out | No advertising, no sale, no cross-site tracking, no cookies. CTDPA opt-out signals apply only to targeted advertising and sale. | NOT APPLICABLE | Law: CTDPA opt-out-signal rule (CT AG) | — | OK | No banner added (prompt §1.E). DNT/GPC behaviour disclosed |
| 5 | CT Data Privacy Act applicability | Thresholds: ≥35,000 consumers, OR any sensitive data, OR any sale. SiteLift collects no sensitive data and sells nothing. The owner's CT consumer count is not in evidence. | UNKNOWN | Law: CTDPA | — | OPEN | Would add formal rights and retention duties only if the owner crosses 35,000 consumers. See release blockers |
| 6 | CalOPPA privacy-policy contents | Lead form collects email from a nationally reachable site. | APPLIES | Law: Cal. Bus. & Prof. Code §22575 | Medium | FIXED | Policy now covers categories collected, third parties, DNT handling, and the effective date. Round 2: it also discloses the Pause motion setting kept in local storage (revision date 2026-09-24) |
| 7 | Third-party asset hosts | fonts.googleapis.com, fonts.gstatic.com, images.unsplash.com, static.cloudflareinsights.com, cloudflareinsights.com (host list captured in Playwright) | APPLIES | Disclosure / engineering | Low | FIXED | Disclosed in the policy. Self-hosting the fonts is optional (Google receives visitor IPs). Google says the Fonts API does not set cookies |
| 8 | Lead form data flow | POST to eolkits.com. Backend has CORS allowlist, honeypot, per-IP/day/global rate limits, email validation, body-size limit, durable storage with re-sent notification (source read-only). Preflight returns ACAO `https://sitelift.toledotechnologies.com`. | APPLIES | Engineering | — | OK | OPTIONS preflight only. Backend source reviewed, not the deployed binary |
| 9 | Form UX states | Before: no timeout, blind JSON success, focus lost after submit. | APPLIES | WCAG 3.3.1 / 4.1.3; engineering | Low | FIXED | Mocked endpoint in Playwright: empty submit blocked natively; success focuses the heading; 500 and `{detail}` show the error and refocus submit |
| 10 | No-JS form fallback | Before: with JS off, the native POST showed raw JSON from eolkits.com. The deployed lead API (`git show f033a400:apps/grace-api/eolkits_grace/app.py`, `_SITE_ORIGINS` + `_resolve_next`) 303-redirects to an absolute `_next` whose origin is allow-listed; `https://sitelift.toledotechnologies.com` is on that list. | APPLIES | Engineering | Low | FIXED | Hidden `_next` → `/fit-check/received/` (new `noindex` page reusing the in-page success copy word for word). The fetch path runs `data.delete('_next')`, so the JSON flow is unchanged. Real `_resolve_next` code run in isolation accepts the URL and rejects look-alike hosts. Chromium end to end over local HTTPS stand-ins: no-JS POST → 303 → confirmation page; JS POST has no `_next`, stays on the page, shows the success state. Jest content tests |
| 11 | Retention / deletion for leads | Policy offers access, correction, and deletion by email. No retention period is stated. Leads live in the GRACE lead DB. | APPLIES | Engineering; law only if CTDPA applies | Low | OPEN | Owner decision (retention period). No period was invented |
| 12 | Colour contrast | axe: `.section-label` 2.79–3.75:1, `.badge` 4.23:1, fit-check `.tier-btn` 2.09:1 | APPLIES | WCAG 2.2 AA 1.4.3 | Medium | FIXED | axe re-run: 0 violations on all 4 routes |
| 13 | Label in name | Tier button names did not contain the visible text ("Start Here", "Scale") | APPLIES | WCAG 2.5.3 (A) | Medium | FIXED | Jest content test |
| 14 | Split-text headings | Headings spoken letter by letter; hero strikethrough and italic removed at runtime | APPLIES | WCAG 1.3.1; design integrity | Medium | FIXED | Accessibility snapshot: `heading "SITELIFT"`, full paragraph read once. Screenshot shows the accents restored. Jest test |
| 15 | Mobile menu keyboard/touch | Menu stayed open after tapping an anchor. Focus reached content behind the overlay. | APPLIES | WCAG 2.4.3 / 2.4.11; functional | Medium | FIXED | Playwright at 375 px: link closes the menu; tabbing past the menu closes it. Jest test |
| 16 | Skip navigation | No skip link on any page | APPLIES | WCAG 2.4.1 | Low | FIXED | Playwright: first Tab = skip link; Enter then Tab lands inside `<main>` on all 4 routes |
| 17 | Reduced motion | JS gates parallax and cursor; CSS neutralises animations. Round 2: the Pause motion control starts pressed (paused) under reduced motion | APPLIES | WCAG 2.3.3 (AAA) / good practice | — | OK | Playwright `reducedMotion: reduce`: 0 hidden reveal elements, no custom cursor, `data-motion=paused`, toggle `aria-pressed=true` |
| 18 | Auto-moving decoration | Before: hero `leak-move` glow looped every 20 s with no way to stop it. | APPLIES | WCAG 2.2.2 (A) | Low | FIXED | Native `<button aria-pressed>` "Pause motion" in the hero (icon-only with the same accessible name at ≤640 px). It pauses the glow, the scroll cue, and scroll-linked parallax. The choice is kept in localStorage (try/catch; works when storage throws). It starts paused under reduced motion. Without JS the glow stays still and the button stays hidden. Playwright: Tab reaches it, 2 px cyan focus ring, Space/Enter toggle, state survives reload, 44×44 target, no overlap at 320/375/641/768/1024 px. axe: 0 violations. 7 Jest tests + 4 content tests |
| 19 | Reflow 320/375 px | No horizontal scroll on any route | APPLIES | WCAG 1.4.10 | — | OK | `scrollWidth == innerWidth` at 320 and 375 on all routes |
| 20 | Decorative images | Unsplash photos had descriptive alt text on purely decorative backgrounds | APPLIES | WCAG 1.1.1 | Low | FIXED | Set to `alt=""` |
| 21 | Security headers / CSP | Live: HSTS preload, nosniff, XFO SAMEORIGIN, Referrer-Policy, Permissions-Policy. No CSP. | APPLIES | Engineering (OWASP) | Low | FIXED | One `<meta http-equiv="Content-Security-Policy">` at the top of every page, including `/fit-check/received/`. The server header is not used. `script-src` and `style-src` allow the Fit Check inline blocks by sha256 only (no `'unsafe-inline'` or `'unsafe-eval'`). Plus `object-src 'none'`, `base-uri 'self'`, and a form-action that covers eolkits.com and the `_next` redirect. `npm run build` fails on drift (`scripts/check-csp.js`), and `src/test/csp.test.js` repeats the check. Chromium at 1280 and 375 px on all 5 pages: 0 violations while scrolling, using the menu, the pause control, and Fit Check success, error, and no-JS paths. The Cloudflare beacon POST reached the network. `_verify/csp-check.mjs` passes |
| 22 | Exposed files / secrets | `/.git/config` returns 404. Beacon token is a public site token. No secrets in repo files. | APPLIES | Engineering | — | OK | curl, grep |
| 23 | Dependencies | 0 production deps (static output). Before: `npm audit` found 44 dev-only advisories (15 high, 23 moderate, 6 low). | APPLIES | Engineering | Low | FIXED | Ran `npm audit fix` without `--force`: 44 → 14 (7 high, 2 moderate, 5 low). Vite is held at 8.0.16, the first release after its advisory; the 8.3.x that audit fix chose re-minifies inline CSS and JS. Build output content is byte-identical to before (only the JS chunk's filename hash changed). Build, Jest, and lint pass. The rest is row 35 |
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
| 34 | Deploy pipeline | SSH forced-command deploy, pinned host key, `contents: read`, version gate. Actions were referenced by moving tags; `ci.yml` had no `permissions` block | APPLIES | Engineering (GitHub hardening guide) | Low | FIXED | `actions/checkout` and `actions/setup-node` are pinned to the full commit SHA of the tag already in use (`# v4`/`# v6` comments; SHAs from `gh api …/git/ref/tags/…`, cross-checked with `git ls-remote`). `ci.yml` now has `permissions: contents: read`. Runners, triggers, secrets, steps, and deploy logic are unchanged. `_verify/workflow-check.mjs` passes. Not run in Actions (billing-locked) |
| 35 | Residual dev advisories | 14 advisories remain, all inside `@lhci/cli@0.13.0`'s own lighthouse 11 / puppeteer 21 tree (ws, tar-fs, tmp, extract-zip, uuid, cookie and others). They ship nothing to production. | APPLIES | Engineering | Low | OPEN | Clearing them needs `@lhci/cli` 0.15.x, a breaking 0.x upgrade. That was out of scope for a non-breaking fix. Upgrade it in its own change and re-run `npm run lighthouse` |

Counts by status (after round 2): FIXED 16 · OPEN 3 · BLOCKED 1 · OK 10 (adequate, left alone) · N/A 5. By classification: APPLIES 27 · NOT APPLICABLE 6 (grouped) · UNKNOWN 2.

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
| **Round 2 (2026-09-24)** | |
| `npm test` | 53/53 pass (was 34). New: CSP policy vs. page for src and dist, checker catches drift / stale hash / `'unsafe-inline'` / `frame-ancestors` / late meta / missing redirect origin; Pause motion (toggle, storage, reduced-motion default, stored choice both ways, throwing storage, mid-visit OS change, parallax gating); markup and CSS contracts; `_next` value, fetch strips `_next`, confirmation copy matches, `noindex`, not in sitemap |
| `npm run build` (now `vite build && node scripts/check-csp.js dist`) / `npm run lint` | Pass: 5 pages match their policies / pass |
| `npm audit` before → after `npm audit fix` (no `--force`) | 44 (15 high, 23 moderate, 6 low) → 14 (7 high, 2 moderate, 5 low); production 0 → 0. The dist sha256 list matched the baseline for every file's content. The JS chunk's filename hash changed; its content did not |
| Chromium: 5 pages × 1280 and 375 px, scrolled, Cloudflare RUM answered locally with 204 | 0 `securitypolicyviolation` events, 0 CSP console errors, 0 page errors, beacon POST reached the network layer, no horizontal scroll |
| Chromium: Pause motion | Tab reaches it; focus ring 2 px cyan; Space pauses (`aria-pressed=true`, glow `animation-play-state: paused`, parallax frozen); state survives reload; Enter resumes; reduced motion starts paused with nothing stored, and an explicit resume runs the glow; throwing localStorage raises no errors; 375 px tap works; 44×44 target; no overlap with the scroll cue at 320, 375, 641, 667×375, 768, 1024 px |
| Chromium: Fit Check with JS (lead API mocked) | Success state and focus unchanged; request body has no `_next`; `{detail}` 400 shows the error and refocuses submit; 0 violations |
| Chromium no-JS end to end: local HTTPS stand-ins for both origins (`--host-resolver-rules`, self-signed cert, lead stub mirroring `_resolve_next`) | Native POST carries `_next` → 303 → `/fit-check/received/` with the success copy, no raw JSON, 0 CSP errors. From a local preview origin the explicit production origin in `form-action` lets the redirect through. The control copy without it was blocked by `form-action` |
| Deployed `_resolve_next` (from `git show f033a400`) run in isolation | Accepts `https://sitelift.toledotechnologies.com/fit-check/received/`; rejects `https://evil.example/x` and `https://sitelift.toledotechnologies.com.evil.example/x` |
| Vite dev server (`timeout`-wrapped) | 0 CSP violations on all 5 pages |
| axe-core 4.13, WCAG 2.x A/AA + best practice | 0 violations: home (running and paused) and privacy at 1280 and 375 px, plus `/fit-check/received/` after its heading-order fix |
| `node _verify/verify-site.mjs SiteLift doc` / `build`, `node _verify/csp-check.mjs SiteLift`, `node _verify/workflow-check.mjs SiteLift` | All four print their markers |

**Untested boundaries**
- Real submission to the live lead API (forbidden). CORS was proven by preflight only.
- Actual email delivery to hello@ or the owner.
- Screen-reader testing with NVDA/VoiceOver. Only the accessibility tree was checked.
- Safari and Firefox.
- 200% text zoom beyond the reflow check.
- Whether the Cloudflare dashboard retains or uses data beyond its public docs.
- The deployed eolkits binary. Its source was reviewed, not the running build.
- The 20 s timeout path was not run in a browser (code path covered by review).
- Round 2: the no-JS redirect was proven against a stub that mirrors the deployed `_resolve_next`. The live API was not called.
- Round 2: the meta CSP was tested in Chromium only. Firefox and Safari were not run.
- Round 2: the workflows were validated by parsing and by the oracle. GitHub Actions is billing-locked, so they were not run there.

## Release-blocking issues

None of the committed changes need a credential to ship. Merging to `main` deploys them automatically. The owner should decide:

1. **Approve the privacy wording.** The round-1 correction (Cloudflare Web Analytics disclosed) is live as of `6cbee80`. Round 2 adds one sentence about the stored Pause motion setting and moves the revision date to 2026-09-24. That sentence must ship with the control, because the old text said the site uses no browser storage.
2. **Confirm `hello@toledotechnologies.com` receives mail** (mxroute). It is the only privacy-request and error-fallback channel. BLOCKED: I cannot send test mail.
3. **Retention period for Fit Check leads** in the GRACE lead DB. The policy states none. Pick one, or confirm "until you ask us to delete it", and it can be added.
4. **CTDPA headcount:** confirm Toledo Technologies processes data of fewer than 35,000 Connecticut consumers per year. If not, a fuller rights and retention notice is required.
5. CSP now ships in each page (row 21), so Caddy does not need to change. A header copy would add only `frame-ancestors` and reporting, and `X-Frame-Options` already blocks framing.
6. Merging also changes the live deploy pipeline: actions are SHA-pinned and CI has read-only permissions. It takes effect on the next push to `main`. No steps, secrets, or triggers changed.

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

Round 2 sources, checked 2026-09-24:
- W3C Content Security Policy Level 3 (`report-uri`, `frame-ancestors`, and `sandbox` are not supported in `<meta>`; hash sources): https://www.w3.org/TR/CSP3/
- W3C Understanding WCAG 2.2 SC 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- GitHub security hardening for Actions (pin to a full-length commit SHA; least-privilege `GITHUB_TOKEN`): https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- Vite `server.fs.deny` advisory fixed after 8.0.15: https://github.com/advisories/GHSA-fx2h-pf6j-xcff
- Deployed lead API redirect allowlist: `git -C eolkits show f033a400:apps/grace-api/eolkits_grace/app.py` (`_SITE_ORIGINS`, `_resolve_next`, `capture_lead`), read-only

## Migration, configuration, and rollback

- **Migration:** none. Static files only. No data, schema, environment, or secret changes.
  - Round 2 adds one route, `/fit-check/received/`. Host Caddy's existing `try_files {path}/index.html` serves it, so the server config does not change.
  - Round 2 edits only the `uses:` pins and adds `ci.yml` permissions. Workflow steps are untouched.
  - The deploy workflow's artifact check and route smoke test do not cover the new page, because steps were left unchanged. Add it there if wanted.
- **Configuration:** none required. Main content is now `id="main-content"`; the legal pages used `id="welcome"`, which nothing referenced.
- **CSP maintenance:** editing the Fit Check inline `<script>` or `<style>`, or adding a third-party host, fails `npm run build` until the policy changes.
  - The failure message prints the new sha256 to paste into that page's meta tag.
  - A Vite upgrade that minifies inline blocks (8.3.x does) trips the same check.
- **Motion setting:** the visitor's choice is kept under the localStorage key `sitelift-motion`. No server state is involved.
- **Deploy:** merging `audit/product-audit-2026-09-23` to `main` triggers `.github/workflows/deploy.yml`. Nothing was pushed from this audit.
- **Rollback:** `git revert` the audit commit(s) and push. Or, on the VPS, repoint the `current` symlink to the previous release (the newest 5 are kept), as described in the README.
- **Post-deploy check:**
  1. Run `curl https://sitelift.toledotechnologies.com/privacy/ | grep "Cloudflare Web Analytics"`.
  2. Run one real Fit Check submission as the owner to confirm the success state.
  3. Open each page with DevTools and confirm no "Content Security Policy" console errors.
  4. Optionally, submit once more with JavaScript disabled. It should land on `/fit-check/received/`. This creates a real lead.
- **Round 2 rollback:** revert the round-2 commits. The CSP lives only in the HTML, so reverting removes it. To keep everything else, delete the meta tags and the `&& node scripts/check-csp.js dist` build step.
