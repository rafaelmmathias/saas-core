import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const VENDOR_CHUNKS: Record<string, string[]> = {
  'vendor-react': ['/react/', '/react-dom/'],
  'vendor-router': ['/react-router/'],
  'vendor-radix': ['/radix-ui/', '/@radix-ui/'],
  'vendor-ui': ['/lucide-react/', '/date-fns/'],
  'vendor-dnd': ['/@dnd-kit/'],
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
