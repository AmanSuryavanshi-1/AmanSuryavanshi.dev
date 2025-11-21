import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const tagType = defineType({
    name: 'tag',
    title: 'Tag',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Tag Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(160),
        }),
        defineField({
            name: 'color',
            title: 'Color',
            type: 'string',
            description: 'Color for the tag UI (hex code)',
            validation: (Rule) => Rule.regex(/^#[0-9A-F]{6}$/i).error('Must be a valid hex color'),
        }),
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            description: 'Emoji or icon reference',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
            description: 'Show in tag cloud or featured sections',
        }),
        defineField({
            name: 'seoMetadata',
            title: 'SEO Metadata',
            type: 'object',
            fields: [
                defineField({
                    name: 'title',
                    title: 'SEO Title',
                    type: 'string',
                }),
                defineField({
                    name: 'description',
                    title: 'SEO Description',
                    type: 'text',
                }),
            ],
        }),
    ],
})
