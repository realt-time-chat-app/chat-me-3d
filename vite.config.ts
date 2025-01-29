import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5170,
    open: true,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    sourcemap: true, // Optional: Adds sourcemaps for easier debugging
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
