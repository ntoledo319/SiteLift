/**
 * Content-Security-Policy guard for SiteLift's static pages.
 *
 * Every page ships its policy as a <meta http-equiv="Content-Security-Policy"> tag (the host
 * does not send a CSP header). This checker re-derives what each page needs from the HTML
 * itself and fails when the policy and the page drift apart:
 *   - each inline <script> and <style> must be allowed by its exact sha256 hash, and every
 *     hash in the policy must still match a block on that page (no stale hashes);
 *   - script-src never allows 'unsafe-inline' or 'unsafe-eval';
 *   - external scripts, stylesheets, images, fetch() targets, form actions, and the no-JS
 *     `_next` redirect target must all be covered by the matching directive.
 *
 * `npm run build` runs scripts/check-csp.js against dist; src/test/csp.test.js runs the same
 * audit against src and, when present, dist.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/** The production origin, which a page's 'self' covers once deployed. */
export const SITE_ORIGIN = 'https://sitelift.toledotechnologies.com';

/** Directives that browsers ignore (with a console error) when delivered via <meta>. */
const META_UNSUPPORTED = ['frame-ancestors', 'report-uri', 'report-to', 'sandbox'];

/** Script types that execute and are therefore subject to script-src. */
const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

/**
 * Formats a CSP hash source for inline content, exactly as a browser computes it.
 * @param {string} text - The inline block's content, byte for byte.
 * @returns {string} A quoted sha256 source expression.
 */
export const hashSource = (text) =>
    `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;

/**
 * Parses a policy string into a directive -> sources map.
 * @param {string} policy - The policy text.
 * @returns {Record<string, string[]>} Directives keyed by lower-case name.
 */
export const parsePolicy = (policy) =>
    Object.fromEntries(
        policy
            .split(';')
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
                const [name, ...sources] = part.split(/\s+/);
                return [name.toLowerCase(), sources];
            })
    );

const attr = (attributes, name) =>
    attributes
        .match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))
        ?.slice(1)
        .find((value) => value !== undefined);

/**
 * Whether a URL referenced by a page is allowed by a directive's source list.
 * Relative URLs and the production origin count as 'self'.
 * @param {string[] | undefined} sources - The directive's sources.
 * @param {string} reference - The referenced URL (absolute, protocol-relative, or relative).
 * @returns {boolean} True when allowed.
 */
export const allows = (sources, reference) => {
    if (!sources) return false;
    const url = reference.startsWith('//') ? `https:${reference}` : reference;
    if (url.startsWith('data:')) return sources.includes('data:');
    if (!/^https?:\/\//i.test(url) || url.startsWith(`${SITE_ORIGIN}/`) || url === SITE_ORIGIN) {
        return sources.includes("'self'") || sources.includes(SITE_ORIGIN);
    }
    const { origin } = new URL(url);
    return sources.some(
        (source) => source === origin || url.startsWith(source.replace(/\/?$/, '/'))
    );
};

/**
 * Audits one HTML document against its own meta policy.
 * @param {string} html - The page source.
 * @returns {{ problems: string[], expected: { script: string[], style: string[] } }} Result.
 */
export const auditHtml = (html) => {
    const problems = [];
    const metas = [...html.matchAll(/<meta\b([^>]*)>/gi)].filter(
        ([, attributes]) =>
            (attr(attributes, 'http-equiv') || '').toLowerCase() === 'content-security-policy'
    );
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
    const inlineScripts = scripts.filter(
        ([, attributes]) =>
            attr(attributes, 'src') === undefined &&
            EXECUTABLE_TYPES.has((attr(attributes, 'type') || '').toLowerCase())
    );
    const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)];
    const expected = {
        script: inlineScripts.map(([, , body]) => hashSource(body)),
        style: styles.map(([, body]) => hashSource(body)),
    };

    if (metas.length !== 1) {
        problems.push(`expected exactly one CSP meta tag, found ${metas.length}`);
        return { problems, expected };
    }

    const metaIndex = metas[0].index;
    const headEnd = html.search(/<\/head\s*>/i);
    const firstResource = html.search(
        /<script\b|<style\b|<link\b[^>]*\brel\s*=\s*["']?stylesheet/i
    );
    if (headEnd !== -1 && metaIndex > headEnd) problems.push('CSP meta tag is outside <head>');
    if (firstResource !== -1 && metaIndex > firstResource) {
        problems.push('CSP meta tag must come before every script, style, and stylesheet');
    }

    const csp = parsePolicy(attr(metas[0][1], 'content') || '');
    const scriptSrc = csp['script-src'] || csp['default-src'] || [];
    const styleSrc = csp['style-src'] || csp['default-src'] || [];
    const need = (condition, message) => {
        if (!condition) problems.push(message);
    };

    const validSource =
        /^'(?:self|none|unsafe-inline|unsafe-eval|strict-dynamic|sha(?:256|384|512)-[A-Za-z0-9+/]+={0,2})'$|^data:$|^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/\S*)?$/;
    for (const [directive, sources] of Object.entries(csp)) {
        for (const source of sources)
            need(validSource.test(source), `${directive} has an unrecognised source ${source}`);
    }
    for (const directive of META_UNSUPPORTED) {
        need(
            !csp[directive],
            `${directive} is ignored in a meta policy; set it as a header instead`
        );
    }
    need(csp['object-src']?.join(' ') === "'none'", "object-src must be 'none'");
    need(csp['base-uri']?.length, 'base-uri is missing');
    need(csp['default-src']?.length, 'default-src is missing');
    need(csp['form-action']?.length, 'form-action is missing');
    for (const risky of ["'unsafe-inline'", "'unsafe-eval'", '*', 'https:', 'data:']) {
        need(!scriptSrc.includes(risky), `script-src must not allow ${risky}`);
    }

    // Inline blocks: every block needs its hash, and every hash needs its block.
    const checkHashes = (kind, sources, hashes) => {
        const unsafeInline = sources.includes("'unsafe-inline'");
        const listed = sources.filter((source) => source.startsWith("'sha256-"));
        for (const hash of hashes) {
            need(
                listed.includes(hash) || (unsafeInline && !listed.length && kind === 'style'),
                `inline <${kind}> is not allowed; add ${hash} to ${kind}-src`
            );
        }
        for (const hash of listed) {
            need(
                hashes.includes(hash),
                `${kind}-src lists ${hash}, which matches no inline <${kind}> on this page`
            );
        }
    };
    checkHashes('script', scriptSrc, expected.script);
    checkHashes('style', styleSrc, expected.style);

    need(
        !/<[a-z][^>]*\sstyle\s*=/i.test(html) || styleSrc.includes("'unsafe-inline'"),
        "style attributes need 'unsafe-inline' in style-src; move them into CSS"
    );
    need(
        !/<[a-z][^>]*\son[a-z]+\s*=/i.test(html),
        'inline event handler attributes are blocked by script-src'
    );

    // External resources the page references.
    for (const [, attributes] of scripts) {
        const src = attr(attributes, 'src');
        if (src !== undefined) need(allows(scriptSrc, src), `script-src does not allow ${src}`);
    }
    for (const [, attributes] of html.matchAll(/<link\b([^>]*)>/gi)) {
        if (!/\bstylesheet\b/i.test(attr(attributes, 'rel') || '')) continue;
        const href = attr(attributes, 'href') || '';
        need(allows(styleSrc, href), `style-src does not allow ${href}`);
        if (href.startsWith('https://fonts.googleapis.com/')) {
            need(
                allows(csp['font-src'] || csp['default-src'], 'https://fonts.gstatic.com/'),
                'Google Fonts CSS needs font-src https://fonts.gstatic.com'
            );
        }
    }
    for (const [, attributes] of html.matchAll(/<img\b([^>]*)>/gi)) {
        const src = attr(attributes, 'src') || '';
        need(allows(csp['img-src'] || csp['default-src'], src), `img-src does not allow ${src}`);
    }
    const connectSrc = csp['connect-src'] || csp['default-src'];
    if (/static\.cloudflareinsights\.com\/beacon\.min\.js/.test(html)) {
        need(
            allows(connectSrc, 'https://cloudflareinsights.com/cdn-cgi/rum'),
            'the Cloudflare beacon needs connect-src https://cloudflareinsights.com'
        );
    }
    for (const [, , body] of inlineScripts) {
        for (const [, url] of body.matchAll(/fetch\(\s*['"`](https?:\/\/[^'"`]+)/g)) {
            need(allows(connectSrc, url), `connect-src does not allow ${url}`);
        }
    }
    for (const [, attributes] of html.matchAll(/<form\b([^>]*)>/gi)) {
        const action = attr(attributes, 'action') || '';
        need(allows(csp['form-action'], action), `form-action does not allow ${action}`);
    }
    for (const [, attributes] of html.matchAll(/<input\b([^>]*)>/gi)) {
        if (attr(attributes, 'name') !== '_next') continue;
        const next = attr(attributes, 'value') || '';
        // Browsers apply form-action to every redirect of a form submission.
        need(
            allows(csp['form-action'], next),
            `form-action does not allow the _next redirect ${next}`
        );
    }

    return { problems, expected };
};

const listHtml = (dir) =>
    readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name === 'node_modules' ? [] : listHtml(path);
        return name.endsWith('.html') ? [path] : [];
    });

/**
 * Audits every HTML file under a directory.
 * @param {string} dir - Directory to scan.
 * @returns {{ file: string, problems: string[], expected: object }[]} One entry per page.
 */
export const auditDirectory = (dir) =>
    listHtml(dir)
        .sort()
        .map((file) => ({ file: relative(dir, file), ...auditHtml(readFileSync(file, 'utf8')) }));
