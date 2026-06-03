import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Set this to your production URL before deploying.
export default defineConfig({
  site: 'https://strategy.thisismattsmith.com',
  integrations: [mdx(), sitemap()],
});
