import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import mkcert from 'vite-plugin-mkcert'; // Add mkcert plugin for HTTPS

export default defineConfig({
  plugins: [
    react(),
    visualizer(), // Add the bundle analyzer plugin
    mkcert() // Enable HTTPS for local development
  ],
  build: {
    outDir: 'dist', // Output directory for the build
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group dependencies from node_modules into separate chunks
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size limit to 1000 kB
  },
  server: {
    port: 5173, // Define the dev server port
    https: true, // Enable HTTPS for local development
  },
});
