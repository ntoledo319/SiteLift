import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                fitCheck: resolve(__dirname, 'src/fit-check/index.html'),
                privacy: resolve(__dirname, 'src/privacy/index.html'),
                terms: resolve(__dirname, 'src/terms/index.html'),
            },
        },
    },
    server: {
        port: 3000,
    },
});
