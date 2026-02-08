import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemas } from './schemas';

export default defineConfig({
  name: 'huisleegmakers',
  title: 'Huisleegmakers CMS',
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemas,
  },
});
