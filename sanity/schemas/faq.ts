import { defineType, defineField } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'vraag',
      title: 'Vraag',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'antwoord',
      title: 'Antwoord',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Volgorde',
      name: 'volgordeAsc',
      by: [{ field: 'volgorde', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'vraag' },
  },
});
