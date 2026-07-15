# Content Strategy: SiteLift (Productized WordPress Exit)

**Sources of truth:** [`pricing-docs/reference/pricing.md`](../../../../../pricing-docs/reference/pricing.md), [`pricing-docs/reference/charging.md`](../../../../../pricing-docs/reference/charging.md), and [`pricing-docs/services/websites/sitelift/`](../../../../../pricing-docs/services/websites/sitelift/). Numbers and payment mechanics below mirror those files; if anything drifts, those files win.

---

## Voice

Speed, safety, utility. The voice is direct and operational: surface the failure modes, show the controls, and show the math without implying a customer history that is not documented.

**Three rules:**

- Lead with the cost the client is already paying. Their current pain is more compelling than our offer.
- Use exact, labeled inputs wherever possible—_$20/mo target baseline_, _$9,500 default quote_, and _about 20–34 months estimated payback at $300–$500/mo current cost_.
- Never describe WordPress as "bad." Describe the _failure mode_ the client is escaping (plugin sludge, security maintenance, hosting overage, "the contact form broke again").

---

## Hero Pitch

**Primary headline:** _"Your WordPress site is bleeding money. We stop it."_

**Sub-line:** _"SiteLift moves your WordPress site to modern infrastructure for speed, security, and dramatically lower ongoing cost. The default Vercel Pro + Cloudflare Pages CMS stack targets a $20/month baseline before usage overages and third-party services. Want Squarespace, Webflow, or Shopify instead? We'll put you there."_

**\* footnote:** _"Other hosting platforms available upon request and may lead to price adjustment."_

**Primary CTA:** Start the Fit Check ($750) — _fixed price, 1–2 business days, 50% credits toward the kickoff Project Retainer if you proceed within 30 days, capped at that Project Retainer; unused credit lapses and does not roll forward._
**Secondary CTA:** Run the ROI Calculator — _see your payback period._
**Cross-link:** Need custom design? See ToledoWeb Odyssey.

---

## Per-Page Specs

Every page has the same skeleton: problem the visitor came with → SiteLift answer → numbers → next step. Every page ends with the same single-CTA block.

### `/` — Home (the exit pitch)

- **Source:** `pricing-docs/services/websites/sitelift/landing-page.md`
- **Sections:** Hero · Problem (the WordPress goblin) · Solution (SiteLift moves you out) · Default stack ($20/mo target math) · Package matrix (Arcadia / Aegis / Odyssey / Elysian) · Proof (explicitly illustrative format preview until verified customer evidence exists) · ROI estimate · FAQ teaser · Final CTA
- **CTA:** Start the Fit Check ($750)

### `/calculator` — ROI Calculator

- **Source:** `pricing-docs/services/websites/sitelift/roi-calculator.md`
- **Inputs:** Current monthly WordPress cost (hosting + plugins + maintenance + emergencies), package selection (Arcadia / Aegis / Odyssey / Elysian)
- **Outputs:** New monthly cost ($20 baseline), monthly savings, payback period in months, 5-year savings
- **Default scenario:** "Aegis @ $9,500, $300–$500/mo current cost, $20/mo target baseline → about 20–34 months estimated payback." Always show exclusions and label outputs as estimates.
- **CTA:** Start the Fit Check ($750) to confirm your estimate

### `/packages` — Arcadia / Aegis / Odyssey / Elysian

- **Source:** `pricing-docs/services/websites/sitelift/pricing.md`, `scope.md`
- **Layout:** Four-package matrix with What's Included / Best For / Timeline / Quote Range / Default Quote
- **Per-package detail:** Anchor link to full scope below the matrix. Pull scope from `scope.md` per package.
- **Footnote (every page):** _"Other hosting platforms available upon request and may lead to price adjustment."_
- **CTA:** Start the Fit Check ($750) to confirm package + platform fit

### `/platforms` — Platform Selection Guide

- **Source:** `pricing-docs/services/websites/sitelift/platform-selection-guide.md` + `vercel-pro-guide.md` + `cloudflare-pages-cms-guide.md`
- **Sections:** Vercel Pro (default — $20/mo) · Squarespace · Wix · Webflow · WordPress.com · Ghost · Shopify · Static / JAMstack
- **Per-platform card:** Best for / Cost / Tradeoffs / SiteLift price adjustment (e.g., "Builders typically reduce cost 15–30%; Shopify typically increases cost 20–50%")
- **CTA:** Not sure? Start the Fit Check—platform selection is part of it.

### `/fit-check` — Delphi Fit Check ($750)

- **Source:** `pricing-docs/services/websites/sitelift/discovery.md`, `qualification.md`
- **Pitch:** _"$750. 1–2 business days. We tell you which package fits, which platform makes sense, and any data risks before we quote the full project. Fixed price. 50% credits toward the kickoff Project Retainer if you proceed within 30 days, capped at that Project Retainer; unused credit lapses and does not roll forward."_
- **What you get:** Risk assessment · package recommendation · platform recommendation · price + timeline confirmation · go/no-go honesty (we'll tell you if SiteLift isn't your best route)
- **Inquiry form (no Stripe):** Five visible first-step fields: name · email · current URL · current platform · primary pain. Preserve product/source/offer context in hidden fields; collect cost, access, page count, integrations, and timeline during the paid assessment.
- **CTA:** Submit inquiry—we reply within 1–2 business days with fit, platform direction, and the $750 payment step.

### `/case-studies` (future, evidence-gated)

- **Source:** `pricing-docs/services/websites/sitelift/case-study.md`
- **Layout:** Do not publish a customer case until delivery evidence, metric provenance, and written publication permission exist. Until then, use explicitly labeled illustrative templates and capability samples.
- **Per-study:** Once verified: before/after monthly cost, measured Lighthouse runs, migration timeline, package used, platform chosen, and sourced customer outcomes.
- **CTA:** Start the Fit Check

### `/handoff` — What you own after launch

- **Source:** `pricing-docs/services/websites/sitelift/handoff.md`, `onboarding.md`, `deployment-checklists.md`
- **Pitch:** _"Your domain, hosting, CMS, repository, analytics, and email accounts remain under your control. Completed proposal-defined deliverables transfer on final payment. Toledo retains reusable methods, components, internal tools, and non-client-specific patterns unless the signed agreement says otherwise."_
- **Sections:** Account sovereignty list · Documented handoff manual · Training (1 session for Arcadia/Aegis, 2+ for Odyssey/Elysian) · Optional Care plans (link to main brand `/care`)
- **CTA:** Start the Fit Check

### `/faq`

- **Source:** `pricing-docs/services/websites/sitelift/faq.md`
- **Top objections:** _"Why $20/mo when WordPress hosting is $5?"_ (overages, plugins, maintenance, breakage) · _"Can I keep my WordPress?"_ (yes; platform direction is decided during the Fit Check) · _"What if my site is huge?"_ (Odyssey / Elysian tier) · _"What about my SEO?"_ (inventory, redirects, metadata, and launch checks reduce migration risk; rankings are never guaranteed) · _"What if I want to leave you?"_ (account control and proposal-defined ownership are written into the agreement) · _"How long does the actual migration take?"_ (timeline is confirmed after discovery)
- **CTA:** Start the Fit Check

### `/terms`

- **Sources:** `pricing-docs/reference/terms.md`, `pricing-docs/reference/charging.md`, and `pricing-docs/services/websites/sitelift/terms.md`
- **Concise summary:** Signed-scope authority, Project Retainer and milestone mechanics, proposal-defined ownership, revisions per tier, scope controls, the written support window, and optional Care retainers
- **Link out:** Canonical terms in pricing-docs

---

## Cross-link Discipline

```
Visitor                                              → Best route
─────────────────────────────────────────────────────────
"My WordPress costs me too much"                     → / (home)
"I want to see the math"                             → /calculator
"Compare the four packages"                          → /packages
"Should I go to Squarespace / Webflow / Shopify?"    → /platforms
"How does this start?"                               → /fit-check
"I want fully custom design, not productized"        → ToledoWeb Odyssey (cross-link)
"I have under $3,500 to spend"                       → Honest no (FAQ entry)
"I just want maintenance, not a migration"           → toledotechnologies.com/care
"I'm an agency offloading migrations"                → toledotechnologies.com/partner
```

---

## Proof Clusters (used across home, packages, calculator, case-studies)

- **The $20/month math** — _Vercel Pro $20/mo target baseline before traffic overages and third-party services vs. WordPress's "$5 hosting + $200 in plugins, maintenance, and overages."_ Show the receipts.
- **Estimated payback math** — _$9,500 ÷ ($300–$500 current monthly cost − $20 target baseline) = about 20–34 months. Full $7,500–$12,500 band under those assumptions is roughly 16–45 months. Exclude third-party software, traffic overages, financing, maintenance, taxes, and business value._
- **Account control** — _Domain, hosting, CMS, DNS, repository, analytics, and email accounts stay under client control as defined in the signed proposal. Deliverable ownership and reusable-work carve-outs are stated separately._
- **Platform-agnostic** — _Vercel Pro is our default, but we put you on Squarespace, Webflow, Shopify, Ghost, or static if that fits better. Decided during Fit Check._
- **Measured quality gates** — _Set explicit performance and accessibility budgets, then publish scores only from a named build and test run._
- **Productized, not custom** — _Scope-locked. Fixed price. Predictable. If you want bespoke design, that's ToledoWeb._

---

## CTA Hierarchy (every page)

1. **Primary CTA** — Start the Fit Check ($750)
2. **Secondary CTA** — Run the ROI Calculator
3. **Tertiary** — See packages / See platforms (whichever the visitor hasn't seen)
4. **Cross-link footer** — _Need custom design? ToledoWeb Odyssey._ / _Just need maintenance? toledotechnologies.com/care._

---

## Conversion Targets (per-page)

| Page            | Inquiry quality bar                                                                   |
| --------------- | ------------------------------------------------------------------------------------- |
| `/`             | Visitor reaches `/fit-check` or `/calculator` — measured.                             |
| `/calculator`   | Calculator interaction completed; "Book Fit Check" CTA click rate.                    |
| `/packages`     | Inquiry with confirmed package preference.                                            |
| `/platforms`    | Inquiry with platform preference noted (or "I don't know — recommend").               |
| `/fit-check`    | Five-field first-step completion with hidden product/source/offer attribution.        |
| `/case-studies` | Click-through to `/fit-check` or `/calculator`.                                       |

---

## Pricing Drift Note

`SiteLift/GEMINI.md`, this document, and the live site now align on **Aegis = $7,500–$12,500, default quote $9,500**. Pricing docs remain authoritative if future drift appears.

---

_Toledo Technologies LLC — SiteLift Content Specs (2026-05-10)_
