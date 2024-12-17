import adapter from '@sveltejs/adapter-cloudflare';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['/_*']
      }
    })
  },
  preprocess: sveltePreprocess()
};

export default config;