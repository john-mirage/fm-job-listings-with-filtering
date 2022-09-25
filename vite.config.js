import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/job-listings-with-filtering/",
  resolve: {
    alias: {
      '@api': resolve(__dirname, 'src/api'),
      '@components': resolve(__dirname, 'src/components'),
      '@data': resolve(__dirname, 'src/data'),
      '@images': resolve(__dirname, 'src/images'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
});