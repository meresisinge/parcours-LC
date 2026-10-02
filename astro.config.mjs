// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  // Bind IPv4 so `http://127.0.0.1:4321` and `localhost` hit the same server.
  server: {
    host: '127.0.0.1',
    port: 4321,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});