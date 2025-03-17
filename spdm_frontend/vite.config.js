import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 4200, // change server port
        open: true, // auto open browser
    },
    resolve: {
        alias: {
            '@': '/src', // Alias for using short url
        },
    },
    build: {
        outDir: 'dist', // first folder when build
        sourcemap: true, // create source map file
    },
});
