# Content Strategy: SiteLift (Productized WordPress Exit)

**Source of truth:** [`../../pricing-docs/PRICING.md`](../../pricing-docs/PRICING.md), [`../../pricing-docs/services/websites/sitelift/`](../../pricing-docs/services/websites/sitelift/). Numbers below mirror those files; if anything drifts, those files win.

---

## Voice

Speed, safety, utility. The voice of someone who has done this migration 50 times and knows where the bodies are buried — and is offering to pull them out for a fixed price. Direct. Numerical. Never preachy about WordPress; just shows the math.

**Three rules:**

- Lead with the cost the client is already paying. Their current pain is more compelling than our offer.
- Use exact numbers wherever possible — _$20/mo_, _$9,500_, _9–29 month payback_. Vagueness reads as evasion.
- Never describe WordPress as "bad." Describe the _failure mode_ the client is escaping (plugin sludge, security maintenance, hosting overage, "the contact form broke again").

---

## Hero Pitch

**Primary headline:** _"Your WordPress site is bleeding money. We stop it."_

**Sub-line:** _"SiteLift moves your WordPress site to modern infrastructure for speed, security, and dramatically lower ongoing cost. Default stack — Vercel Pro + Cloudflare Pages CMS — runs at $20/month.\* Want Squarespace, Webflow, or Shopify instead? We'll put you there."_

**\* footnote:** _"Other hosting platforms available upon request and may lead to price adjustment."_

**Primary CTA:** Book a Fit Check ($750) — _fixed price, 1–2 days, 50% credits to your project._
**Secondary CTA:** Run the ROI Calculator — _see your payback period._
**Cross-link:** Need custom design? See ToledoWeb Odyssey.

---

## Per-Page Specs

Every page has the same skeleton: problem the visitor came with → SiteLift answer → numbers → next step. Every page ends with the same single-CTA block.

### `/` — Home (the exit pitch)

- **Source:** `pricing-docs/services/websites/sitelift/landing-page.md`
- **Sections:** Hero · Problem (the WordPress goblin) · Solution (SiteLift moves you out) · Default stack ($20/mo math) · Package matrix (Arcadia / Aegis / Odyssey / Elysian) · Proof (case study card) · ROI mini-calculator embed · FAQ teaser · Final CTA
- **CTA:** Book a Fit Check ($750)

### `/calculator` — ROI Calculator

- **Source:** `pricing-docs/services/websites/sitelift/roi-calculator.md`
- **Inputs:** Current monthly WordPress cost (hosting + plugins + maintenance + emergencies), package selection (Arcadia / Aegis / Odyssey / Elysian)
- **Outputs:** New monthly cost ($20 baseline), monthly savings, payback period in months, 5-year savings
- **Default scenario:** "Aegis @ $9,500, $250/mo current cost → 27-month payback, $13,800 saved over 5 years"
- **CTA:** Book a Fit Check ($750) to confirm your number

### `/packages` — Arcadia / Aegis / Odyssey / Elysian

- **Source:** `pricing-docs/services/websites/sitelift/pricing.md`, `scope.md`
- **Layout:** Four-package matrix with What's Included / Best For / Timeline / Quote Range / Default Quote
- **Per-package detail:** Anchor link to full scope below the matrix. Pull scope from `scope.md` per package.
- **Footnote (every page):** _"Other hosting platforms available upon request and may lead to price adjustment."_
- **CTA:** Book a Fit Check ($750) to confirm package + platform fit

### `/platforms` — Platform Selection Guide

- **Source:** `pricing-docs/services/websites/sitelift/platform-selection-guide.md` + `vercel-pro-guide.md` + `cloudflare-pages-cms-guide.md`
- **Sections:** Vercel Pro (default — $20/mo) · Squarespace · Wix · Webflow · WordPress.com · Ghost · Shopify · Static / JAMstack
- **Per-platform card:** Best for / Cost / Tradeoffs / SiteLift price adjustment (e.g., "Builders typically reduce cost 15–30%; Shopify typically increases cost 20–50%")
- **CTA:** Not sure? Book a Fit Check — platform selection is part of it.

### `/fit-check` — Delphi Fit Check ($750)

- **Source:** `pricing-docs/services/websites/sitelift/discovery.md`, `qualification.md`
- **Pitch:** _"$750. 1–2 business days. We tell you which package fits, which platform makes sense, and any data risks before we quote the full project. Fixed price. 50% credits to your project deposit if you proceed within 30 days."_
- **What you get:** Risk assessment · package recommendation · platform recommendation · price + timeline confirmation · go/no-go honesty (we'll tell you if SiteLift isn't your best route)
- **Inquiry form (no Stripe):** Current platform · current monthly cost · traffic · page count · content size · integrations · timeline · contact
- **CTA:** Submit inquiry — we reply within 1 business day with the $750 invoice + scheduling.

### `/case-studies`

- **Source:** `pricing-docs/services/websites/sitelift/case-study.md`
- **Layout:** Anchor case study (full detail) + supporting cards as we ship more
- **Per-study:** Before/after monthly cost, before/after Lighthouse, migration timeline, package used, platform chosen, "what changed for the client"
- **CTA:** Book a Fit Check

### `/handoff` — What you own after launch

- **Source:** `pricing-docs/services/websites/sitelift/handoff.md`, `onboarding.md`, `deployment-checklists.md`
- **Pitch:** _"You own everything. Domain, hosting, CMS, analytics, email — all under your name from day one. If we part ways tomorrow, nothing breaks and nothing follows us out the door."_
- **Sections:** Account sovereignty list · Documented handoff manual · Training (1 session for Arcadia/Aegis, 2+ for Odyssey/Elysian) · Optional Care plans (link to main brand `/care`)
- **CTA:** Book a Fit Check

### `/faq`

- **Source:** `pricing-docs/services/websites/sitelift/faq.md`
- **Top objections:** _"Why $20/mo when WordPress hosting is $5?"_ (overages, plugins, maintenance, breakage) · _"Can I keep my WordPress?"_ (yes, but we don't recommend it; we'll tell you why during Fit Check) · _"What if my site is huge?"_ (Odyssey / Elysian tier) · _"What about my SEO?"_ (redirect mapping is included; we preserve it) · _"What if I want to leave you?"_ (you keep everything; nothing is locked) · _"How long does the actual migration take?"_ (1–2 weeks for Arcadia/Aegis, 4–8 for Odyssey, 6–12+ for Elysian)
- **CTA:** Book a Fit Check

### `/terms`

- **Source:** `pricing-docs/services/websites/sitelift/terms.md`
- **Concise summary:** Payment structure (50% deposit, 50% on launch), revisions per tier, scope kill switches, what's included in support window, how Care retainers work post-launch
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

- **The $20/month math** — _Vercel Pro $20/mo all-in vs. WordPress's "$5 hosting + $200 in plugins, maintenance, and overages."_ Show the receipts.
- **9–29 month payback** — _Most clients break even between month 9 and month 29 depending on their current spend._
- **Account sovereignty** — _Everything in your name from day one. Domain, hosting, CMS, DNS, analytics, email. We never own your stack._
- **Platform-agnostic** — _Vercel Pro is our default, but we put you on Squarespace, Webflow, Shopify, Ghost, or static if that fits better. Decided during Fit Check._
- **100/100 Lighthouse** — _Performance, Accessibility, Best Practices, SEO. Every site we ship._
- **Productized, not custom** — _Scope-locked. Fixed price. Predictable. If you want bespoke design, that's ToledoWeb._

---

## CTA Hierarchy (every page)

1. **Primary CTA** — Book a Fit Check ($750)
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
| `/fit-check`    | Form completion with current platform, monthly cost, traffic, content size, timeline. |
| `/case-studies` | Click-through to `/fit-check` or `/calculator`.                                       |

---

## Pricing Drift Note

`SiteLift/GEMINI.md` currently says **"Aegis starts at $8,500."** Canonical (`pricing-docs/services/websites/sitelift/pricing.md`) says **Aegis = $7,500–$12,500, default quote $9,500**. Resolve by either updating GEMINI.md or by treating pricing-docs as authoritative. **Recommended:** update GEMINI.md to match canonical (next pass).

---

_Toledo Technologies LLC — SiteLift Content Specs (2026-05-10)_
