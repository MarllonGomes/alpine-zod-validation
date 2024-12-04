import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    build: {
        lib: {
            entry: {
                cdn: resolve(__dirname, 'builds/cdn.js'),
                plugin: resolve(__dirname, 'builds/plugin.js'),
            },
            name: 'zValidate',
        },
        minify: true,
        target: 'es6',
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        chunkSizeWarningLimit: 2000,
        assetsInlineLimit: 4096,
        cssCodeSplit: false,
    },
    server: {
        open: true,
        port: 3000,
        cors: true,
        host: '0.0.0.0'
    },
});