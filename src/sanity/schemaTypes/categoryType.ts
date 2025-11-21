import { TagIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Related Tags',
      type: 'array',
      description: 'Tags commonly associated with this category (used for suggestions)',
      of: [defineArrayMember({ type: 'reference', to: { type: 'tag' } })],
    }),
  ],
})
