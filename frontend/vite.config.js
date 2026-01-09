// /frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslintPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
});
