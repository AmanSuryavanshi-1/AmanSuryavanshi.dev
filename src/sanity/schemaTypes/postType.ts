import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      description: 'Short description for SEO and previews (recommended 150-160 characters)',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Main Image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required().max(100),
        },
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      description: 'Add tags for better content organization',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      description: 'Publication status of the post',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Needs Review', value: 'needs-review' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      description: 'When this post was/will be published',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      title: 'Body Content'
    }),
    defineField({
      name: 'seoTitle',
      type: 'string',
      title: 'SEO Title',
      description: 'Custom title for search engines (leave empty to use main title)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      title: 'SEO Description',
      description: 'Custom description for search engines (leave empty to use excerpt)',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'viewCount',
      type: 'number',
      title: 'View Count',
      initialValue: 0,
      validation: (Rule) => Rule.min(0)
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author, media } = selection;
      return {
        title: selection.title,
        subtitle: author?.name ? `by ${author.name}` : undefined,
        media: media?.[0]
      };
    },
  },
});
