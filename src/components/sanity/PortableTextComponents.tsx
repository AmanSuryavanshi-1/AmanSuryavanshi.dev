import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
import CodeBlock from './CodeBlock';
import AutoPlayVideo from './AutoPlayVideo';
import ResponsiveImage from '@/components/blog/ResponsiveImage';

// Normalized heading styles for consistent typography across all post sources
const normalizedHeadingStyles = {
  h1: "text-4xl md:text-5xl font-bold text-forest-900 mt-12 mb-6 leading-tight",
  h2: "text-3xl md:text-4xl font-semibold text-forest-900 mt-10 mb-5 leading-tight",
  h3: "text-2xl md:text-3xl font-semibold text-forest-700 mt-8 mb-4 leading-snug",
  h4: "text-xl md:text-2xl font-medium text-forest-700 mt-6 mb-3 leading-snug",
  h5: "text-lg md:text-xl font-medium text-forest-500 mt-4 mb-2 leading-normal",
  h6: "text-base md:text-lg font-medium text-forest-500 mt-4 mb-2 leading-normal"
} as const;

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className={normalizedHeadingStyles.h1}>{children}</h1>,
    h2: ({ children }) => <h2 className={normalizedHeadingStyles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={normalizedHeadingStyles.h3}>{children}</h3>,
    h4: ({ children }) => <h4 className={normalizedHeadingStyles.h4}>{children}</h4>,
    h5: ({ children }) => <h5 className={normalizedHeadingStyles.h5}>{children}</h5>,
    h6: ({ children }) => <h6 className={normalizedHeadingStyles.h6}>{children}</h6>,
    normal: ({ children, value }) => {
      const indentMark = value?.markDefs?.find(mark => mark._type === 'indent');
      const indent = typeof indentMark?.level === 'number' ? indentMark.level : 0;
      return (
        <p className={`my-4 ${indent > 0 ? `pl-${indent * 4}` : ''}`}>
          {children}
        </p>
      );
    },
    blockquote: ({ children }) => {
      // Convert children to string to check content
      const text = React.Children.toArray(children).reduce((acc: string, child) => {
        if (typeof child === 'string') return acc + child;
        if (React.isValidElement(child) && child.props.children) {
          // This is a simplification; robust text extraction might be needed
          return acc + child.props.children;
        }
        return acc;
      }, '').toString();

      const isTip = text.startsWith('Tip:');
      const isWarning = text.startsWith('Warning:');
      const isNote = text.startsWith('Note:');

      if (isTip) {
        return (
          <div className="my-8 p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div className="prose-p:m-0 text-emerald-900">{children}</div>
            </div>
          </div>
        );
      }

      if (isWarning) {
        return (
          <div className="my-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
            <div className="flex gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="prose-p:m-0 text-amber-900">{children}</div>
            </div>
          </div>
        );
      }

      if (isNote) {
        return (
          <div className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
            <div className="flex gap-3">
              <span className="text-2xl">📝</span>
              <div className="prose-p:m-0 text-blue-900">{children}</div>
            </div>
          </div>
        );
      }

      // Default Pull Quote
      return (
        <blockquote className="my-10 p-8 bg-gradient-to-br from-sage-50 to-white rounded-2xl border border-sage-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 text-9xl leading-none text-lime-500/10 font-serif -translate-x-4 -translate-y-8">"</div>
          <div className="relative z-10 text-xl md:text-2xl font-serif italic text-forest-800 leading-relaxed text-center">
            {children}
          </div>
        </blockquote>
      );
    },
    toggle: ({ children }) => (
      <details className="my-4 rounded-lg p-4 cursor-pointer">
        <summary className="font-medium">{children}</summary>
        <div className="mt-2 pl-4">{children}</div>
      </details>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-forest-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-forest-700">{children}</em>,
    code: ({ children }) => (
      <code className="bg-sage-100 text-forest-900 rounded px-1 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline decoration-forest-500">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through text-forest-500">{children}</span>,
    highlight: ({ children }) => (
      <span className="bg-sage-100 text-forest-900 px-1 rounded">{children}</span>
    ),
    color: ({ children, value }: { children: React.ReactNode, value?: { value?: keyof typeof colorMap } }) => {
      const colorMap = {
        default: 'text-gray-900',
        primary: 'text-blue-600',
        secondary: 'text-purple-600',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
        info: 'text-cyan-600',
      } as const;
      return <span className={colorMap[value?.value || 'default']}>{children}</span>;
    },
    link: ({ children, value }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-forest-900 underline decoration-1 underline-offset-2 transition-colors duration-200 hover:text-lime-500"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc marker:text-forest-900 pl-6 space-y-2 my-4">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 my-4 [&>li]:pl-2 [&>li>ol]:my-2 [&>li>ol]:pl-4 [&>li>ol]:list-[lower-alpha] [&>li>ol>li>ol]:list-[lower-roman] marker:text-forest-900">
        {children}
      </ol>
    ),
    checkbox: ({ children }) => (
      <ul className="pl-6 space-y-2 my-4 list-none">
        {React.Children.map(children, child => (
          <li className="flex items-center gap-2">
            <input type="checkbox" checked disabled className="accent-forest-500" />
            {child}
          </li>
        ))}
      </ul>
    ),
  },
  types: {
    image: ({ value }) => {
      const { alt, caption } = value;
      return (
        <ResponsiveImage
          value={value}
          alt={alt}
          caption={caption}
          maxWidth={600}
          priority={false}
        />
      );
    },
    video: ({ value }) => {
      const { videoUrl, caption, alt } = value;

      if (!videoUrl) {
        return (
          <div className="my-8 p-4 bg-red-50 rounded-lg text-red-600">
            Video URL is missing
          </div>
        );
      }

      return <AutoPlayVideo videoUrl={videoUrl} alt={alt} caption={caption} />;
    },
    code: ({ value }: { value: { code: string; language?: string; filename?: string; title?: string; markDefs?: Array<{ _type: string; level?: number }> } }) => {
      if (!value?.code) {
        return null;
      }

      const indentMark = value?.markDefs?.find(mark => mark._type === 'indent');
      const indent = typeof indentMark?.level === 'number' ? indentMark.level : 0;

      return (
        <div className={`relative my-6 ${indent > 0 ? `ml-${indent * 4}` : ''}`}>
          <CodeBlock
            code={value.code}
            language={value.language}
            title={value.filename || value.title}
          />
        </div>
      );
    },
  },
};
