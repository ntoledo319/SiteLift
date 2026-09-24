import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditDirectory, auditHtml, hashSource, parsePolicy } from '../../scripts/csp-policy.js';

const repoRoot = process.cwd();
const srcDir = resolve(repoRoot, 'src');
const distDir = resolve(repoRoot, 'dist');
const fitCheck = readFileSync(resolve(srcDir, 'fit-check/index.html'), 'utf8');

describe('meta Content-Security-Policy (audit round 2)', () => {
    test('every source page carries a policy that matches its inline code and resources', () => {
        const results = auditDirectory(srcDir);
        expect(results.map(({ file }) => file)).toEqual([
            'fit-check/index.html',
            'fit-check/received/index.html',
            'index.html',
            'privacy/index.html',
            'terms/index.html',
        ]);
        for (const { file, problems } of results)
            expect({ file, problems }).toEqual({ file, problems: [] });
    });

    const built = existsSync(resolve(distDir, 'index.html'));
    (built ? test : test.skip)('the built pages still match their policies byte for byte', () => {
        const results = auditDirectory(distDir);
        expect(results).toHaveLength(auditDirectory(srcDir).length);
        for (const { file, problems } of results)
            expect({ file, problems }).toEqual({ file, problems: [] });
    });

    test('script-src relies on hashes, never unsafe-inline or unsafe-eval', () => {
        const policy = parsePolicy(
            fitCheck.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1]
        );
        const inline = fitCheck.match(/<script>([\s\S]*?)<\/script>/)[1];
        expect(policy['script-src']).toContain(hashSource(inline));
        expect(policy['script-src']).not.toContain("'unsafe-inline'");
        expect(policy['script-src']).not.toContain("'unsafe-eval'");
        expect(policy['object-src']).toEqual(["'none'"]);
        expect(policy['form-action']).toEqual(
            expect.arrayContaining([
                'https://eolkits.com',
                'https://sitelift.toledotechnologies.com',
            ])
        );
    });

    test('the checker catches drift, stale hashes, and unsafe policies', () => {
        const edited = fitCheck.replace("data.delete('_next');", "data.delete('_next'); // edited");
        expect(auditHtml(edited).problems.join('\n')).toMatch(
            /inline <script> is not allowed; add 'sha256-/
        );
        expect(auditHtml(edited).problems.join('\n')).toMatch(/matches no inline <script>/);

        const restyled = fitCheck.replace('cursor: auto;', 'cursor: default;');
        expect(auditHtml(restyled).problems.join('\n')).toMatch(/inline <style> is not allowed/);

        const lax = fitCheck.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'");
        expect(auditHtml(lax).problems).toContain("script-src must not allow 'unsafe-inline'");

        const framed = fitCheck.replace(
            "object-src 'none'",
            "object-src 'none'; frame-ancestors 'none'"
        );
        expect(auditHtml(framed).problems.join('\n')).toMatch(
            /frame-ancestors is ignored in a meta policy/
        );

        const late = fitCheck
            .replace(/\n\s*<meta http-equiv="Content-Security-Policy"[^>]*>/, '')
            .replace(
                '</head>',
                `<meta http-equiv="Content-Security-Policy" content="default-src 'self'" /></head>`
            );
        expect(auditHtml(late).problems.join('\n')).toMatch(/must come before every script/);

        const missing = fitCheck.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '');
        expect(auditHtml(missing).problems).toEqual(['expected exactly one CSP meta tag, found 0']);

        const noRedirect = fitCheck.replace(
            "form-action 'self' https://eolkits.com https://sitelift.toledotechnologies.com",
            'form-action https://eolkits.com'
        );
        expect(auditHtml(noRedirect).problems.join('\n')).toMatch(
            /form-action does not allow the _next redirect/
        );
    });
});
