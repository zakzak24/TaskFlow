import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Utilisation de jsdom pour simuler le DOM
    globals: true, // Utilisation des API globales comme describe, it, expect
    setupFiles: './src/tests/setup.ts', // Optionnel : pour des configurations globales comme jest-dom
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
