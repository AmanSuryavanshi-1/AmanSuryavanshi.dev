import {defineType} from 'sanity'

export const codeType = defineType({
  name: 'code',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'code',
      title: 'Code',
      type: 'text'
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
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
        ]
      }
    },
    {
      name: 'filename',
      title: 'Filename',
      type: 'string'
    }
  ]
})
