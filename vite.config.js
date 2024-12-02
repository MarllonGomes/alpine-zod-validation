import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    build: {
        lib: {
            entry: {
                zValidateCdn: resolve(__dirname, 'builds/cdn.js'),
                zValidatePlugin: resolve(__dirname, 'builds/plugin.js'),
            },
            name: 'zValidate',
        },
        rollupOptions: {
            external: ['alpinejs'],
            output: {
                globals: {
                    alpinejs: 'Alpine'
                },
            },
        },
        minify: true,
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        brotliSize: false,
        chunkSizeWarningLimit: 2000,
        assetsInlineLimit: 4096,
        cssCodeSplit: false,
    },
    server: {
        open: true,
        port: 3000,
    },
});