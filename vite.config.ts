import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure only one React instance is bundled to prevent "Invalid hook call"
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-avatar', '@radix-ui/react-slot'],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
  },
});
