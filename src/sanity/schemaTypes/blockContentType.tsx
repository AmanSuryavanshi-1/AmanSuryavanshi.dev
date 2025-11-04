import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
        {title: 'Toggle', value: 'toggle'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
        {title: 'Checkbox', value: 'checkbox'}
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline'},
          {title: 'Highlight', value: 'highlight'},
        ],
        annotations: [
          {
            name: 'color',
            type: 'object',
            title: 'Color',
            fields: [
              {
                name: 'value',
                type: 'string',
                title: 'Color',
                options: {
                  list: [
                    {title: 'Default', value: 'default'},
                    {title: 'Primary', value: 'primary'},
                    {title: 'Secondary', value: 'secondary'},
                    {title: 'Success', value: 'success'},
                    {title: 'Warning', value: 'warning'},
                    {title: 'Danger', value: 'danger'},
                    {title: 'Info', value: 'info'},
                  ],
                },
              },
            ],
          },
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'Url',
              },
            ],
          },
          {
            name: 'indent',
            type: 'object',
            title: 'Indent',
            fields: [
              {
                name: 'level',
                type: 'number',
                title: 'Indent Level',
                validation: Rule => Rule.required().min(0).max(5)
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: Rule => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineArrayMember({
      type: 'video',
      title: 'Video',
      preview: {
        select: {
          title: 'caption',
          media: 'videoFile'
        }
      }
    }),
    defineArrayMember({
      type: 'code',
      name: 'code',
      title: 'Code Block',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'Python', value: 'python'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'Bash', value: 'bash'},
          {title: 'JSX', value: 'jsx'},
          {title: 'TSX', value: 'tsx'},
        ],
        withFilename: true,
      },
    })
  ]
})
