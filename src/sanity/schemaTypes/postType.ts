import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO & AI' },
    { name: 'meta', title: 'Metadata' },
  ],
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
      name: 'focusKeyword',
      type: 'string',
      title: 'Focus Keyword',
      description: 'Primary keyword for SEO optimization',
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
      name: 'socialImage',
      type: 'image',
      title: 'Social Share Image',
      description: 'Image for social media sharing (OG tags). Recommended size: 1200x630',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
      hidden: true, // Deprecated: Using tags instead
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Add tags for better content organization',
      of: [{
        type: 'object',
        name: 'tag',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'slug', title: 'Slug', type: 'string' }
        ],
        preview: {
          select: { title: 'label' }
        }
      }],
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
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured Post',
      initialValue: false,
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
      name: 'readingTime',
      type: 'number',
      title: 'Reading Time (minutes)',
      description: 'Estimated reading time. Can be auto-calculated or overridden.',
    }),
    defineField({
      name: 'tableOfContents',
      type: 'array',
      title: 'Table of Contents',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'slug', type: 'string' },
            { name: 'level', type: 'number' },
          ]
        })
      ],
      hidden: true, // We might want to auto-generate this, so hiding from manual edit for now or making it read-only
    }),
    defineField({
      name: 'seoTitle',
      type: 'string',
      title: 'SEO Title',
      description: 'Custom title for search engines (leave empty to use main title)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      title: 'Meta Description',
      description: 'Custom description for search engines (leave empty to use excerpt)',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      title: 'SEO Description (Automation)',
      description: 'Alias for Meta Description - used by n8n automation. Maps to metaDescription.',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('SEO descriptions should be under 160 characters'),
      hidden: true, // Hidden in UI since it duplicates metaDescription - automation writes here
    }),
    defineField({
      name: 'articleType',
      type: 'string',
      title: 'Article Type',
      description: 'Categorize the content for schema.org structured data',
      options: {
        list: [
          { title: 'Case Study', value: 'case-study' },
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Guide', value: 'guide' },
          { title: 'Opinion', value: 'opinion' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (min)',
      type: 'number',
      description: 'Estimated reading time in minutes - set by automation',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      description: 'FAQ items for AI SEO (GEO/AIO)',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' }
        ],
        preview: {
          select: { title: 'question' }
        }
      }]
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      type: 'array',
      description: 'Key takeaways for AI SEO',
      of: [{ type: 'string' }]
    }),
    // AI SEO Enhancement Fields
    defineField({
      name: 'primaryKeyword',
      title: 'Primary Keyword',
      type: 'string',
      description: 'Main focus keyword for SEO (AI-suggested)',
      group: 'seo',
    }),
    defineField({
      name: 'secondaryKeywords',
      title: 'Secondary Keywords (LSI)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Related semantic keywords for better AI engine discovery',
      group: 'seo',
    }),
    defineField({
      name: 'aiSeoScore',
      title: 'AI SEO Score',
      type: 'number',
      description: 'AI-calculated SEO optimization score (0-100)',
      readOnly: true,
      group: 'seo',
    }),
    defineField({
      name: 'lastSeoEnhanced',
      title: 'Last SEO Enhancement',
      type: 'datetime',
      description: 'When this post was last SEO-enhanced by AI',
      readOnly: true,
      group: 'seo',
    }),
    defineField({
      name: 'quotableSnippet',
      title: 'Quotable Snippet',
      type: 'text',
      rows: 2,
      description: 'Short, quotable answer for AI search engines (Perplexity, ChatGPT)',
      group: 'seo',
    }),
    defineField({
      name: 'contentSummary',
      title: 'Content Summary',
      type: 'text',
      rows: 3,
      description: '2-3 sentence summary optimized for AI citation',
      group: 'seo',
    }),
    defineField({
      name: 'canonicalUrl',
      type: 'url',
      title: 'Canonical URL',
      description: 'Override canonical URL if this content was originally published elsewhere',
    }),
    defineField({
      name: 'views',
      type: 'number',
      title: 'Views',
      description: 'Total views. Can be manually edited.',
      initialValue: 0,
    }),
    defineField({
      name: 'viewCount',
      type: 'number',
      title: 'View Count (Deprecated)',
      description: 'Legacy field. Use "views" instead.',
      readOnly: true,
      hidden: true,
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
