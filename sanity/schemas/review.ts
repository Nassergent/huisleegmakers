import { defineType, defineField } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'naam',
      title: 'Naam klant',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'locatie',
      title: 'Locatie',
      type: 'string',
    }),
    defineField({
      name: 'score',
      title: 'Score (1-5)',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'tekst',
      title: 'Review tekst',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'naam', subtitle: 'locatie' },
  },
});
