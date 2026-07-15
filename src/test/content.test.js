import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = process.cwd();
const read = (path) => readFileSync(resolve(repoRoot, path), 'utf8');

const home = read('src/index.html');
const fitCheck = read('src/fit-check/index.html');
const privacy = read('src/privacy/index.html');
const terms = read('src/terms/index.html');
const sitemap = read('src/public/sitemap.xml');
const viteConfig = read('vite.config.js');
const styles = read('src/style.css');

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
