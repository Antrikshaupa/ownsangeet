import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    // Disable sourcemaps in production for better performance and security
    sourcemap: false,
    // Enable minification
    minify: 'esbuild',
    // Optimize chunk splitting
    rollupOptions: {

      onwarn(warning, warn) {
        // Suppress sourcemap warnings for node_modules
        if (warning.code === 'SOURCEMAP_ERROR' && warning.message.includes('node_modules')) {
          return;
        }
        warn(warning);
      }
    },
    // Optimize asset handling
    assetsInlineLimit: 4096,
    // Enable CSS code splitting
    cssCodeSplit: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap']
  }
});
