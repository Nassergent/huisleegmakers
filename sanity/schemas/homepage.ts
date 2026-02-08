import { defineType, defineField } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO Titel',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Beschrijving',
      type: 'text',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'text',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'telefoon',
      title: 'Telefoonnummer',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
    }),
    defineField({
      name: 'adres',
      title: 'Adres',
      type: 'string',
    }),
    defineField({
      name: 'openingstijden',
      title: 'Openingstijden',
      type: 'text',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Media Afbeelding',
      type: 'image',
      description: 'Wordt getoond bij delen op Facebook/LinkedIn (1200x630px)',
    }),
  ],
  preview: {
    select: { title: 'heroTitle' },
  },
});
