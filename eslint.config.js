import html from 'eslint-plugin-html';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'warn',
        },
    },
    {
        files: ['src/test/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
    {
        files: ['**/*.html'],
        plugins: {
            html,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                ...globals.browser,
            },
        },
    },
    prettier,
];
