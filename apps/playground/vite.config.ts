import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

/**
 * Maps chunk name → package name prefixes to match against the module path.
 * New package: append to the right group. New group: add a new entry.
 * Unknown packages fall through to Rollup's default chunking.
 */
const VENDOR_CHUNKS: Record<string, string[]> = {
  'vendor-react': ['/react/', '/react-dom/'],
  'vendor-router': ['/react-router/'],
  'vendor-i18n': ['/i18next/', '/react-i18next/'],
  'vendor-radix': ['/radix-ui/', '/@radix-ui/'],
  'vendor-ui': ['/lucide-react/', '/cmdk/', '/vaul/', '/date-fns/'],
  'vendor-form': ['/react-hook-form/', '/@hookform/', '/zod/'],
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          for (const [chunk, pkgs] of Object.entries(VENDOR_CHUNKS)) {
            if (pkgs.some((pkg) => id.includes(pkg))) return chunk;
          }
        },
      },
    },
  },
});
