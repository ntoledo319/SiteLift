#!/usr/bin/env node
/**
 * CLI for the meta CSP guard: node scripts/check-csp.js [dir ...]   (defaults to dist).
 * Exits non-zero and prints the hashes each page needs when a policy and its page drift.
 */
/* eslint-disable no-console -- this is a command-line reporter */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { auditDirectory } from './csp-policy.js';

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['dist'];
let failed = false;
for (const dir of dirs) {
    if (!existsSync(dir)) {
        console.error(`check-csp: ${dir} does not exist`);
        failed = true;
        continue;
    }
    const results = auditDirectory(dir);
    let dirFailed = !results.length;
    if (dirFailed) console.error(`check-csp: no HTML pages in ${dir}`);
    for (const { file, problems, expected } of results) {
        if (!problems.length) continue;
        dirFailed = true;
        console.error(`check-csp: ${join(dir, file)}`);
        for (const problem of problems) console.error(`  - ${problem}`);
        console.error(`  inline script hashes: ${expected.script.join(' ') || '(none)'}`);
        console.error(`  inline style hashes: ${expected.style.join(' ') || '(none)'}`);
    }
    if (dirFailed) failed = true;
    else console.log(`check-csp: ${results.length} pages in ${dir} match their policies`);
}
process.exit(failed ? 1 : 0);
