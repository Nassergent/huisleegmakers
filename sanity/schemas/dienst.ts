import { defineType, defineField } from 'sanity';

export const dienst = defineType({
  name: 'dienst',
  title: 'Dienst',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'beschrijving',
      title: 'Beschrijving',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon naam',
      type: 'string',
      description: 'Naam van het icon (bijv: home, building, heart, shield, landmark, briefcase)',
    }),
    defineField({
      name: 'kenmerken',
      title: 'Kenmerken',
      type: 'array',
      of: [{ type: 'string' }],
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
    select: { title: 'titel', subtitle: 'beschrijving' },
  },
});
