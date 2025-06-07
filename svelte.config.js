import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // Usamos el adaptador estático para servir la app como SPA
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html'
    })
    // SSR se deshabilita mediante page options, no aquí
  }
};

export default config;
