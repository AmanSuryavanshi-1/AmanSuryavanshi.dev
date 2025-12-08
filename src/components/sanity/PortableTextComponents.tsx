// @ts-nocheck - Temporarily disable type checking due to React 19 migration
import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
import CodeBlock from './CodeBlock';
import AutoPlayVideo from './AutoPlayVideo';
import ResponsiveImage from '@/components/blog/ResponsiveImage';
import ZoomableBlogImage from '@/components/blog/ZoomableBlogImage';
import { urlFor } from '@/sanity/lib/image';

/**
 * Professional Spacing System - Tight & Consistent
 * 
 * Vertical rhythm:
 * - Paragraphs: my-3 (12px)
 * - Lists: mt-1 mb-4, space-y-1.5 between items
 * - Headings: H2 mt-8 mb-3, H3 mt-6 mb-2, H4 mt-5 mb-2
 * - Media (images, code): my-4 (16px)
 * - Blockquotes: my-4 (16px)
 */

// Normalized heading styles with tight professional spacing
const normalizedHeadingStyles = {
  // H1: Main title (rarely used in body)
  h1: "text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-950 mt-10 mb-3 leading-[1.1] tracking-tight",

  // H2: Major sections with accent
  h2: "text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-forest-900 mt-8 mb-3 leading-[1.15] tracking-tight border-l-4 border-lime-500 pl-5 py-1 bg-gradient-to-r from-lime-50/60 to-transparent rounded-r-lg",

  // H3: Subsections
  h3: "text-xl sm:text-2xl md:text-[1.75rem] font-serif font-semibold text-forest-800 mt-6 mb-2 leading-[1.2]",

  // H4: Minor headings
  h4: "text-lg sm:text-xl md:text-2xl font-serif font-semibold text-forest-700 mt-5 mb-2 leading-[1.25]",

  // H5-H6: Smallest
  h5: "text-base sm:text-lg font-sans font-semibold text-forest-600 mt-4 mb-1.5 uppercase tracking-wider",
  h6: "text-sm sm:text-base font-sans font-medium text-forest-500 uppercase tracking-widest mt-3 mb-1.5"
} as const;

// Helper to generate slug from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Helper to extract text from children
const extractText = (children: React.ReactNode): string => {
  return React.Children.toArray(children).reduce((acc: string, child) => {
    if (typeof child === 'string') return acc + child;
    if (React.isValidElement(child) && child.props.children) {
      return acc + extractText(child.props.children);
    }
    return acc;
  }, '') as string;
};

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => {
      const id = generateSlug(extractText(children));
      return <h1 id={id} className={normalizedHeadingStyles.h1}>{children}</h1>;
    },
    h2: ({ children }) => {
      const id = generateSlug(extractText(children));
      return <h2 id={id} className={normalizedHeadingStyles.h2}>{children}</h2>;
    },
    h3: ({ children }) => {
      const id = generateSlug(extractText(children));
      return <h3 id={id} className={normalizedHeadingStyles.h3}>{children}</h3>;
    },
    h4: ({ children }) => {
      const id = generateSlug(extractText(children));
      return <h4 id={id} className={normalizedHeadingStyles.h4}>{children}</h4>;
    },
    h5: ({ children }) => {
      const id = generateSlug(extractText(children));
      return <h5 id={id} className={normalizedHeadingStyles.h5}>{children}</h5>;
    },
    h6: ({ children }) => {
      const id = generateSlug(extractText(children));
      return <h6 id={id} className={normalizedHeadingStyles.h6}>{children}</h6>;
    },
    normal: ({ children, value }) => {
      const indentMark = value?.markDefs?.find(mark => mark._type === 'indent');
      const indent = typeof indentMark?.level === 'number' ? indentMark.level : 0;
      return (
        <p className={`my-3 text-forest-700 text-lg leading-[1.75] ${indent > 0 ? `pl-${indent * 6} border-l-2 border-sage-200` : ''}`}>
          {children}
        </p>
      );
    },
    blockquote: ({ children }) => {
      const text = React.Children.toArray(children).reduce((acc: string, child) => {
        if (typeof child === 'string') return acc + child;
        if (React.isValidElement(child) && child.props.children) {
          return acc + extractText(child.props.children);
        }
        return acc;
      }, '').toString();

      const isTip = text.startsWith('Tip:');
      const isWarning = text.startsWith('Warning:');
      const isNote = text.startsWith('Note:');

      if (isTip) {
        return (
          <div className="my-6 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl shadow-sm">
            <div className="flex gap-3">
              <span className="text-xl mt-0.5 flex-shrink-0">💡</span>
              <div className="prose-p:m-0 text-emerald-900 font-medium text-base">{children}</div>
            </div>
          </div>
        );
      }

      if (isWarning) {
        return (
          <div className="my-6 p-5 bg-amber-50/50 border border-amber-100 rounded-xl shadow-sm">
            <div className="flex gap-3">
              <span className="text-xl mt-0.5 flex-shrink-0">⚠️</span>
              <div className="prose-p:m-0 text-amber-900 font-medium text-base">{children}</div>
            </div>
          </div>
        );
      }

      if (isNote) {
        return (
          <div className="my-6 p-5 bg-blue-50/50 border border-blue-100 rounded-xl shadow-sm">
            <div className="flex gap-3">
              <span className="text-xl mt-0.5 flex-shrink-0">📝</span>
              <div className="prose-p:m-0 text-blue-900 font-medium text-base">{children}</div>
            </div>
          </div>
        );
      }

      // Pull Quote Style
      return (
        <blockquote className="my-6 pl-6 pr-4 py-2 border-l-4 border-lime-500 bg-gradient-to-r from-sage-50 to-transparent">
          <div className="text-lg md:text-xl font-serif italic text-forest-800 leading-relaxed">
            "{children}"
          </div>
        </blockquote>
      );
    },
    toggle: ({ children }) => (
      <details className="my-5 rounded-xl border border-sage-200 bg-white shadow-sm overflow-hidden group">
        <summary className="font-semibold p-4 cursor-pointer bg-sage-50 text-forest-900 hover:bg-sage-100 transition-colors flex items-center justify-between">
          <span>{children}</span>
          <span className="text-forest-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="p-4 bg-white text-forest-700">{children}</div>
      </details>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-forest-950">{children}</strong>,
    em: ({ children }) => <em className="italic text-forest-600 font-serif">{children}</em>,
    code: ({ children }) => (
      <code className="bg-sage-100 text-forest-800 px-1.5 py-0.5 rounded-md font-mono text-sm border border-sage-200">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline decoration-lime-400 decoration-2 underline-offset-2">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through text-forest-400 decoration-2">{children}</span>,
    highlight: ({ children }) => (
      <span className="bg-lime-100 text-forest-900 px-1 rounded-sm border-b-2 border-lime-200">{children}</span>
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
      const href = value?.href || '';

      // Extract text content from children
      const textContent = React.Children.toArray(children).reduce((acc: string, child) => {
        if (typeof child === 'string') return acc + child;
        if (React.isValidElement(child) && child.props.children) {
          return acc + extractText(child.props.children);
        }
        return acc;
      }, '').toString();

      // Hide image placeholder links
      const isImagePlaceholder =
        textContent.includes('🖼️') ||
        textContent.match(/\[Image:.*\]/i) ||
        (href.includes('cloudinary.com') && textContent.includes('[Image'));

      if (isImagePlaceholder) {
        return null;
      }

      const target = href.startsWith('http') ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="text-forest-900 border-b-2 border-lime-300 hover:border-lime-500 transition-colors duration-200 hover:bg-lime-50/50"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    // Minimal top margin, moderate bottom margin for consistent flow
    bullet: ({ children }) => (
      <ul className="pl-6 space-y-1.5 mt-1 mb-4 text-forest-700">
        {React.Children.map(children, (child) => (
          <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:bg-lime-500 before:rounded-full text-base leading-[1.6]">
            {child?.props?.children}
          </li>
        ))}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-7 space-y-1.5 mt-1 mb-4 text-forest-700 marker:text-lime-600 marker:font-semibold text-base leading-[1.6]">
        {React.Children.map(children, (child) => (
          <li className="pl-1">
            {child?.props?.children}
          </li>
        ))}
      </ol>
    ),
    checkbox: ({ children }) => (
      <ul className="pl-2 space-y-1.5 mt-1 mb-4">
        {React.Children.map(children, child => (
          <li className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-sage-50 transition-colors">
            <input type="checkbox" checked disabled className="mt-1 accent-lime-600 h-4 w-4" />
            <span className="text-forest-800 text-base">{child}</span>
          </li>
        ))}
      </ul>
    ),
  },
  types: {
    // Image spacing is handled inside ZoomableBlogImage component (my-4)
    image: ({ value }: any) => <ZoomableBlogImage value={value} />,

    // External image (Cloudinary/direct URLs) - Use ZoomableBlogImage for gallery integration
    externalImage: ({ value }: any) => {
      const { url, alt, caption } = value || {};
      if (!url) {
        return (
          <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            ⚠️ External image URL missing
          </div>
        );
      }
      // Pass the URL through the value prop so ZoomableBlogImage can detect it
      return <ZoomableBlogImage value={{ url, alt, caption }} />;
    },

    video: ({ value }) => {
      const { videoUrl, caption, alt } = value;

      if (!videoUrl) {
        return (
          <div className="my-6 p-4 bg-red-50 rounded-lg text-red-600">
            Video URL is missing
          </div>
        );
      }

      return (
        <div className="my-6">
          <AutoPlayVideo videoUrl={videoUrl} alt={alt} caption={caption} />
        </div>
      );
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
    table: ({ value }: { value: { rows: Array<{ cells: string[] }> } }) => {
      if (!value?.rows || value.rows.length === 0) {
        return null;
      }

      const [headerRow, ...bodyRows] = value.rows;

      return (
        <div className="w-fit max-w-full overflow-x-auto my-6 rounded-xl border border-forest-100 shadow-md bg-white">
          <table className="divide-y divide-forest-100 text-sm text-left border-collapse">
            <thead className="bg-forest-900 text-white">
              <tr>
                {headerRow.cells.map((cell, i) => (
                  <th key={i} className="px-5 py-3 font-bold uppercase tracking-wider whitespace-nowrap text-xs">
                    {cell.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 bg-white">
              {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-forest-50/50 transition-colors">
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-5 py-3 text-forest-700 whitespace-normal text-sm">
                      {cell.replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

