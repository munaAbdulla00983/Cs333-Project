import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/repository-name/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  root: resolve(__dirname),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'public/events.html'),
        createEvent: resolve(__dirname, 'public/create-event.html'),
        eventDetails: resolve(__dirname, 'public/event-details.html'),
      },
    },
  },
});