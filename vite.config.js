import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  base: './', // Just in case, relative base
  build: {
    rollupOptions: {
      output: {
        format: 'iife'
      }
    }
  }
});
