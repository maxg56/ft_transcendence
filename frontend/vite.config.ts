import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
    ],
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true, // 👈 ne garde que les hôtes valides ici
  },
});
