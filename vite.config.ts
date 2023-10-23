import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 5173,
    https: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        dir: 'dist',
        format: 'iife',
        sourcemap: true,
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      exportAsDefault: true,
    }),
    mkcert(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
