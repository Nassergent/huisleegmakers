import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://huisleegmakers.gent',
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind({ configFile: './tailwind.config.cjs' }),
    sitemap({
      i18n: {
        defaultLocale: 'nl-BE',
        locales: { 'nl-BE': 'nl-BE' },
      },
    }),
  ],
});
