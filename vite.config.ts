import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    base: './',
    resolve: {
        alias: {
            '@appdeploy/client': path.resolve(__dirname, './src/lib/appdeploy-client.ts'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    build: {
        outDir: process.env.APPDEPLOY_VITE_OUT_DIR || 'dist',
        sourcemap: process.env.APPDEPLOY_VITE_SOURCEMAP === 'hidden' ? 'hidden' : false,
        rollupOptions: {
            maxParallelFileOps: 128,
        },
    },
});
