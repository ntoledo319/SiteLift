import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = process.cwd();
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8');

const home = read('src/index.html');
const fitCheck = read('src/fit-check/index.html');
const privacy = read('src/privacy/index.html');
const terms = read('src/terms/index.html');
const received = read('src/fit-check/received/index.html');
const sitemap = read('src/public/sitemap.xml');
const viteConfig = read('vite.config.js');
const styles = read('src/style.css');
const llms = read('src/public/llms.txt');
const pages = { home, fitCheck, privacy, terms, received };

const expectCanonicalCreditRule = (content) => {
    expect(content).toMatch(/50%[\s\S]*within 30 days/i);
    expect(content).toMatch(/capped at (?:that|the) Project Retainer/i);
    expect(content).toMatch(/unused\s+credit\s+lapses/i);
    expect(content).toMatch(/does not roll forward|no roll-forward/i);
};

describe('commercial truth contract', () => {
    test('publishes the payback as an estimate with visible inputs and exclusions', () => {
        expect(home).toContain('EST. 20-34 MONTHS.');
        expect(home).toContain('$9,500</strong> Aegis default quote');
        expect(home).toContain('$300-$500</strong> current monthly cost');
        expect(home).toContain('$20</strong> target baseline');
        expect(home).toContain('The full $7,500-$12,500 Aegis band produces roughly 16-45');
        expect(home).toContain('Estimate only.');
    });

    test('does not claim registered-service-mark status', () => {
        expect(home).not.toMatch(/registered service mark/i);
    });

    test('states the complete Fit Check credit mechanics everywhere public', () => {
        expectCanonicalCreditRule(home);
        expectCanonicalCreditRule(fitCheck);
    });

    test('qualifies the hosting baseline and ownership transfer', () => {
        expect(home).toContain('$20/mo Target Baseline');
        expect(home).toMatch(/Usage\s+overages and third-party services are separate\./);
        expect(home).toContain('proposal-defined deliverables transfer on final payment');
        expect(home).toContain('reusable methods and components remain Toledo property');
        expect(home).not.toContain('You own the code.');
    });

    test('labels sample proof as illustrative and not a customer result', () => {
        expect(fitCheck).toContain('Illustrative redacted template // no client data');
        expect(fitCheck).toContain('not a completed assessment or customer result');
    });
});

describe('Fit Check intake contract', () => {
    test('keeps the first step to five visible fields', () => {
        const form = fitCheck.match(/<form\b[\s\S]*?<\/form>/)?.[0];
        expect(form).toBeTruthy();

        const controls = [...form.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)].filter(
            ([, , attributes]) =>
                !/type="hidden"/i.test(attributes) && !/name="_honey"/i.test(attributes)
        );

        expect(controls).toHaveLength(5);
        const requiredControls = controls.filter(([, , attributes]) => /\brequired\b/i.test(attributes));

        expect(requiredControls).toHaveLength(1);
        expect(requiredControls[0][1].toLowerCase()).toBe('input');
        expect(requiredControls[0][2]).toMatch(/type="email"/i);
        expect(requiredControls[0][2]).toMatch(/name="email"/i);
    });

    test('preserves product and offer context in hidden fields', () => {
        for (const name of ['product', 'source', 'service', 'offer', 'context']) {
            expect(fitCheck).toMatch(new RegExp(`type="hidden" name="${name}"`));
        }
        expectCanonicalCreditRule(fitCheck);
    });
});

describe('legal route contract', () => {
    test('publishes site-specific privacy and terms records', () => {
        expect(privacy).toContain('The only required public intake field is your email address.');
        expect(privacy).toContain('https://eolkits.com/api/v1/lead');
        expect(privacy).toContain('We do not sell or rent personal information');
        expect(terms).toContain('Completed proposal-defined deliverables transfer after final payment.');
        expect(terms).toContain('limited to the written support window and agreed scope');
        expect(terms).toContain('does not create a client relationship');
    });

    test('wires legal routes into navigation, build inputs, and the sitemap', () => {
        for (const route of ['/privacy/', '/terms/']) {
            expect(home).toContain(`href="${route}"`);
            expect(fitCheck).toContain(`href="${route}"`);
            expect(sitemap).toContain(`https://sitelift.toledotechnologies.com${route}`);
        }
        expect(viteConfig).toContain("privacy: resolve(__dirname, 'src/privacy/index.html')");
        expect(viteConfig).toContain("terms: resolve(__dirname, 'src/terms/index.html')");
    });
});

describe('progressive enhancement and asset contracts', () => {
    test('uses a 48px menu target and reveal-ready gating', () => {
        expect(styles).toMatch(/\.menu-toggle\s*\{[\s\S]*?width: 48px;[\s\S]*?height: 48px;/);
        expect(styles).toContain('.reveal-ready [data-scroll-reveal]');
        expect(styles).toMatch(/\[data-scroll-reveal\]\s*\{\s*opacity: 1;/);
    });

    test.each(['favicon.svg', 'og-image.svg', 'robots.txt', 'sitemap.xml', 'llms.txt'])(
        'places %s under the Vite public root',
        (asset) => {
            expect(existsSync(resolve(repoRoot, 'src/public', asset))).toBe(true);
        }
    );
});

describe('privacy notice matches actual collection (audit 2026-09-23)', () => {
    const loadsBeacon = (html) => /static\.cloudflareinsights\.com\/beacon\.min\.js/.test(html);

    test('discloses Cloudflare Web Analytics whenever a page loads the beacon', () => {
        const anyBeacon = Object.values(pages).some(loadsBeacon);
        if (anyBeacon) {
            expect(privacy).toContain('Cloudflare Web Analytics');
            expect(privacy).not.toMatch(/does not currently load client-side analytics/i);
            expect(privacy).toMatch(/sets no cookies/i);
        }
    });

    test('discloses third-party asset hosts the pages actually request', () => {
        const all = Object.values(pages).join('\n');
        if (all.includes('fonts.googleapis.com')) expect(privacy).toContain('Google Fonts');
        if (all.includes('images.unsplash.com')) expect(privacy).toContain('Unsplash');
    });

    test('states how browser tracking signals are handled', () => {
        expect(privacy).toMatch(/Do Not Track/);
        expect(privacy).toMatch(/Global Privacy Control/);
    });
});

describe('accessibility contracts (audit 2026-09-23)', () => {
    test.each(Object.entries(pages))('%s has a working skip link to main content', (_name, html) => {
        expect(html).toContain('<a class="skip-link" href="#main-content">');
        expect(html).toMatch(/<main[^>]*id="main-content"/);
    });

    test('tier button accessible names start with their visible text (WCAG 2.5.3)', () => {
        const buttons = [...home.matchAll(/<a[^>]*class="tier-btn"[^>]*aria-label="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/a\s*>/g)];
        expect(buttons).toHaveLength(4);
        for (const [, label, visible] of buttons) {
            expect(label.toLowerCase().startsWith(visible.trim().toLowerCase())).toBe(true);
        }
    });

    test('section labels and fine print are not faded below contrast minimums', () => {
        expect(styles).toMatch(/\.section-label\s*\{[\s\S]*?opacity: 0\.68;/);
        expect(styles).toMatch(/\.cta-sub\s*\{[\s\S]*?opacity: 0\.72;/);
    });

    test('fit check success moves focus and the request cannot hang forever', () => {
        expect(fitCheck).toContain('id="fit-success-heading" tabindex="-1"');
        expect(fitCheck).toContain('AbortController');
        expect(fitCheck).toMatch(/result\.ok !== true/);
    });
});

describe('machine-readable pricing matches visible copy (audit 2026-09-23)', () => {
    test('Elysian is open-ended in JSON-LD because the page shows $30K-$65K+', () => {
        expect(home).toContain('$30K-$65K+');
        const ld = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        const elysian = ld.hasOfferCatalog.itemListElement.find((offer) => offer.name === 'Elysian');
        expect(elysian.priceSpecification.minPrice).toBe(30000);
        expect(elysian.priceSpecification.maxPrice).toBeUndefined();
    });

    test('llms.txt publishes bands instead of a bare Aegis price', () => {
        expect(llms).toContain('Aegis $7,500–$12,500');
        expect(llms).not.toMatch(/~\$9,500/);
    });
});

describe('Pause motion control markup and styles (audit round 2)', () => {
    const rule = (selector) => {
        const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return styles.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? null;
    };

    test('home ships a native, initially hidden toggle button named "Pause motion"', () => {
        const button = home.match(
            /<button\b([^>]*\bdata-motion-toggle\b[^>]*)>([\s\S]*?)<\/button>/
        );
        expect(button).toBeTruthy();
        expect(button[1]).toMatch(/type="button"/);
        expect(button[1]).toMatch(/aria-pressed="false"/);
        expect(button[1]).toMatch(/\bhidden\b/);
        expect(
            button[2]
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
        ).toBe('Pause motion');
    });

    test('the looping glow only runs while script.js reports motion as running', () => {
        expect(rule('.hero-light-leak')).not.toMatch(/animation/);
        expect(rule('[data-motion] .hero-light-leak')).toMatch(/animation: leak-move 20s infinite/);
        expect(styles).toMatch(
            /\[data-motion='paused'\] \.hero-light-leak,\s*\[data-motion='paused'\] \.mouse::before\s*\{\s*animation-play-state: paused;/
        );
    });

    test('the toggle respects [hidden], has a visible focus ring, and a 44px target', () => {
        expect(rule('.motion-toggle[hidden]')).toMatch(/display: none;/);
        expect(rule('.motion-toggle:focus-visible')).toMatch(/outline: 2px solid/);
        expect(rule('.motion-toggle')).toMatch(/min-width: 44px;/);
        expect(rule('.motion-toggle')).toMatch(/min-height: 44px;/);
    });

    test('the privacy notice discloses the remembered motion setting', () => {
        expect(privacy).toMatch(/Pause motion control/);
        expect(privacy).toMatch(/local storage/);
        expect(privacy).not.toMatch(
            /does not use browser storage\.<\/p>\s*<\/section>\s*<section class="legal-section legal-section--wide">\s*<h2>Changes/
        );
    });
});

describe('no-JS Fit Check fallback (audit round 2)', () => {
    const next = fitCheck.match(/<input type="hidden" name="_next" value="([^"]+)" \/>/)?.[1];
    const successCopy = [
        'Brief received.',
        'We will review the details and reply within 1-2 business days with package fit, destination platform direction, and Delphi Fit Check invoice instructions.',
        'A reply from hello@toledotechnologies.com.',
        '$750 fixed. 50% credited toward the kickoff Project Retainer if you proceed within 30 days, capped at that Project Retainer; unused credit lapses and does not roll forward.',
    ];
    const flat = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    test('the native POST asks the lead API to redirect to the SiteLift confirmation page', () => {
        expect(next).toBe('https://sitelift.toledotechnologies.com/fit-check/received/');
        expect(viteConfig).toContain("resolve(__dirname, 'src/fit-check/received/index.html')");
    });

    test('the in-page fetch drops _next so the API keeps answering with JSON', () => {
        const script = fitCheck.match(/<script>([\s\S]*?)<\/script>/)[1];
        const drop = script.indexOf("data.delete('_next')");
        expect(drop).toBeGreaterThan(script.indexOf('new FormData(form)'));
        expect(drop).toBeLessThan(script.indexOf('fetch('));
        expect(script).toMatch(/result\.ok !== true/);
    });

    test('the confirmation page reuses the existing success copy and is not indexed', () => {
        for (const line of successCopy) {
            expect(flat(fitCheck)).toContain(line);
            expect(flat(received)).toContain(line);
        }
        expect(received).toContain('<meta name="robots" content="noindex,follow" />');
        expect(sitemap).not.toContain('/fit-check/received/');
    });
});
