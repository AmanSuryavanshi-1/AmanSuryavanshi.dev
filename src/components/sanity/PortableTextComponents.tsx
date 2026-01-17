// @ts-nocheck - Temporarily disable type checking due to React 19 migration
import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
import CodeBlock from './CodeBlock';
import AutoPlayVideo from './AutoPlayVideo';
import SanityImageWrapper from './SanityImageWrapper';
import { urlFor } from '@/sanity/lib/image';

/**
 * Deep Forest Design System - Typography & Spacing
 * 
 * Implements "Senior Engineer Standard" vertical rhythm:
 * - Top-heavy headings to anchor sections
 * - Fluid typography using clamp()
 * - Relaxed reading measure
 * - Semantic colors for seamless dark mode
 */

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

// Helper to parse and convert markdown links [text](url) to clickable React elements
const parseMarkdownLinks = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      // Regex to match markdown links: [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

      if (!linkRegex.test(child)) {
        return child;
      }

      // Reset regex lastIndex
      linkRegex.lastIndex = 0;

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(child)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(child.slice(lastIndex, match.index));
        }

        // Add the link as a clickable element
        const [, linkText, linkUrl] = match;
        const isExternal = linkUrl.startsWith('http');
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="inline-block relative text-lime-600 dark:text-lime-400 font-medium transition-all duration-200
              after:content-[''] after:absolute after:w-full after:scale-x-100 after:h-0.5 after:bottom-0 after:left-0 after:bg-lime-500/30 after:origin-bottom-right after:transition-transform after:duration-300
              hover:after:scale-x-0 hover:text-lime-700 dark:hover:text-lime-300
              hover:bg-lime-50/50 dark:hover:bg-lime-900/10 rounded px-0.5 -mx-0.5"
          >
            {linkText}
          </a>
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after the last link
      if (lastIndex < child.length) {
        parts.push(child.slice(lastIndex));
      }

      return parts.length > 0 ? parts : child;
    }

    // If it's a React element with children, recursively parse
    if (React.isValidElement(child) && child.props.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: parseMarkdownLinks(child.props.children)
      });
    }

    return child;
  });
};

export const portableTextComponents: PortableTextComponents = {
  block: {
    // === Typography: Serif + Tracking Tight + Fluid Scale ===
    h1: ({ children }) => {
      const id = generateSlug(extractText(children));
      return (
        <h1 id={id} className="text-[clamp(1.75rem,3vw,2.25rem)] font-serif font-bold tracking-tight text-forest-900 dark:text-sage-50 mt-12 mb-5 leading-[1.15] scroll-mt-32">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = generateSlug(extractText(children));
      return (
        <h2 id={id} className="text-[clamp(1.375rem,2.5vw,1.75rem)] font-serif font-bold tracking-tight text-forest-900 dark:text-sage-50 mt-10 mb-4 leading-[1.2] border-l-4 border-lime-500 pl-5 scroll-mt-32">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = generateSlug(extractText(children));
      return (
        <h3 id={id} className="text-[clamp(1.125rem,2vw,1.375rem)] font-serif font-semibold tracking-tight text-forest-800 dark:text-sage-100 mt-8 mb-3 leading-[1.25] scroll-mt-32 flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500/70 shrink-0 mt-2" />
          <span className="flex-1">{children}</span>
        </h3>
      );
    },
    h4: ({ children }) => {
      const id = generateSlug(extractText(children));
      return (
        <h4 id={id} className="text-[clamp(1rem,1.5vw,1.25rem)] font-serif font-semibold text-forest-700 dark:text-sage-200 mt-6 mb-2 leading-[1.3] scroll-mt-32">
          {children}
        </h4>
      );
    },
    h5: ({ children }) => {
      const id = generateSlug(extractText(children));
      return (
        <h5 id={id} className="text-base sm:text-lg font-bold text-forest-600 dark:text-sage-400 mt-6 mb-2 uppercase tracking-wide scroll-mt-32">
          {children}
        </h5>
      );
    },
    h6: ({ children }) => {
      const id = generateSlug(extractText(children));
      return (
        <h6 id={id} className="text-sm sm:text-base font-bold text-forest-500 dark:text-sage-500 uppercase tracking-widest mt-6 mb-2 scroll-mt-32">
          {children}
        </h6>
      );
    },


    // === Paragraphs: Relaxed Loading + Semantic Colors + Callout Detection ===
    normal: ({ children, value }) => {
      const indentMark = value?.markDefs?.find(mark => mark._type === 'indent');
      const indent = typeof indentMark?.level === 'number' ? indentMark.level : 0;

      // Extract text for pattern detection
      const text = extractText(children);

      // TL;DR Callout - Summary/highlights
      if (text.startsWith('TL;DR:') || text.startsWith('TL;DR')) {
        return (
          <div className="my-8 p-6 bg-gradient-to-r from-lime-50 to-emerald-50/50 dark:from-lime-900/20 dark:to-emerald-900/10 border-l-4 border-lime-500 rounded-r-2xl shadow-sm">
            <div className="flex gap-4">
              <span className="text-2xl mt-0.5 shrink-0">📋</span>
              <div className="prose-p:m-0 text-forest-800 dark:text-sage-200 font-semibold text-lg leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        );
      }

      // Result/Success Callout
      if (text.startsWith('Result:') || text.startsWith('Results:')) {
        return (
          <div className="my-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl shadow-sm">
            <div className="flex gap-4">
              <span className="text-2xl mt-0.5 shrink-0">🎯</span>
              <div className="prose-p:m-0 text-emerald-900 dark:text-emerald-200 font-medium text-lg leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        );
      }

      // Key Takeaway Callout
      if (text.startsWith('Key Takeaway:') || text.startsWith('Takeaway:')) {
        return (
          <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl shadow-sm">
            <div className="flex gap-4">
              <span className="text-2xl mt-0.5 shrink-0">💎</span>
              <div className="prose-p:m-0 text-blue-900 dark:text-blue-200 font-medium text-lg leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        );
      }

      // Pro Tip Callout (direct pattern)
      if (text.startsWith('Pro Tip:') || text.startsWith('ProTip:')) {
        return (
          <div className="my-6 p-5 bg-gradient-to-r from-purple-50 to-violet-50/50 dark:from-purple-900/20 dark:to-violet-900/10 border border-purple-200 dark:border-purple-500/30 rounded-2xl shadow-sm">
            <div className="flex gap-3">
              <span className="text-xl mt-0.5 shrink-0">⚡</span>
              <div className="prose-p:m-0 text-purple-900 dark:text-purple-200 font-medium text-base leading-relaxed">
                {parseMarkdownLinks(children)}
              </div>
            </div>
          </div>
        );
      }

      // Markdown Blockquote Pattern: "> text" or "> **Pro Tip:** text"
      // This handles cases where n8n sends raw markdown blockquote syntax
      if (text.startsWith('> ') || text.startsWith('>')) {
        const cleanText = text.replace(/^>\s*/, '');

        // Check for callout types within the blockquote
        const isProTip = cleanText.includes('Pro Tip:') || cleanText.includes('ProTip:');
        const isTip = cleanText.startsWith('Tip:') || cleanText.includes('💡');
        const isWarning = cleanText.startsWith('Warning:') || cleanText.includes('⚠️');
        const isNote = cleanText.startsWith('Note:') || cleanText.includes('📝');

        // Helper to strip markdown blockquote prefix from rendered content
        const strippedChildren = React.Children.map(children, child => {
          if (typeof child === 'string') {
            return child.replace(/^>\s*/, '');
          }
          return child;
        });

        if (isProTip) {
          return (
            <div className="my-6 p-5 bg-gradient-to-r from-purple-50 to-violet-50/50 dark:from-purple-900/20 dark:to-violet-900/10 border border-purple-200 dark:border-purple-500/30 rounded-2xl shadow-sm">
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">⚡</span>
                <div className="prose-p:m-0 text-purple-900 dark:text-purple-200 font-medium text-base leading-relaxed">
                  {parseMarkdownLinks(strippedChildren)}
                </div>
              </div>
            </div>
          );
        }

        if (isTip) {
          return (
            <div className="my-6 p-5 bg-lime-50/50 dark:bg-lime-900/10 border border-lime-200 dark:border-lime-500/30 rounded-2xl shadow-sm">
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">💡</span>
                <div className="prose-p:m-0 text-forest-800 dark:text-sage-200 font-medium text-base leading-relaxed">
                  {parseMarkdownLinks(strippedChildren)}
                </div>
              </div>
            </div>
          );
        }

        if (isWarning) {
          return (
            <div className="my-6 p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl shadow-sm">
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">⚠️</span>
                <div className="prose-p:m-0 text-amber-900 dark:text-amber-200 font-medium text-base leading-relaxed">
                  {parseMarkdownLinks(strippedChildren)}
                </div>
              </div>
            </div>
          );
        }

        if (isNote) {
          return (
            <div className="my-6 p-5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl shadow-sm">
              <div className="flex gap-3">
                <span className="text-xl mt-0.5 shrink-0">📝</span>
                <div className="prose-p:m-0 text-blue-900 dark:text-blue-200 font-medium text-base leading-relaxed">
                  {parseMarkdownLinks(strippedChildren)}
                </div>
              </div>
            </div>
          );
        }

        // Default blockquote style (for generic quotes)
        return (
          <blockquote className="relative my-6 pl-6 pr-4 py-3 border-l-4 border-lime-500 bg-gradient-to-r from-forest-50/50 to-transparent dark:from-forest-900/30 rounded-r-xl">
            <div className="text-lg font-serif italic text-forest-800 dark:text-sage-200 leading-relaxed">
              {parseMarkdownLinks(strippedChildren)}
            </div>
          </blockquote>
        );
      }

      // Default paragraph - optimized for readability  
      // Parse markdown links [text](url) that weren't converted by n8n
      return (
        <p className={`my-5 text-base md:text-lg leading-relaxed text-forest-700 dark:text-sage-200 font-sans ${indent > 0 ? `pl-${indent * 6} border-l-2 border-sage-200 dark:border-forest-700` : ''}`}>
          {parseMarkdownLinks(children)}
        </p>
      );
    },

    // === Blockquotes: Deep Forest Styling ===
    blockquote: ({ children }) => {
      // Check for callout types (Tip, Warning, Note) patterns
      const text = extractText(children);

      const isTip = text.startsWith('Tip:') || text.includes('💡');
      const isWarning = text.startsWith('Warning:') || text.includes('⚠️');
      const isNote = text.startsWith('Note:') || text.includes('📝');

      if (isTip) {
        return (
          <div className="my-8 p-6 bg-lime-50/50 dark:bg-lime-900/10 border border-lime-200 dark:border-lime-500/30 rounded-2xl shadow-sm">
            <div className="flex gap-4">
              <span className="text-2xl mt-0.5 shrink-0">💡</span>
              <div className="prose-p:m-0 text-forest-800 dark:text-sage-200 font-medium text-lg leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        );
      }

      if (isWarning) {
        return (
          <div className="my-8 p-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl shadow-sm">
            <div className="flex gap-4">
              <span className="text-2xl mt-0.5 shrink-0">⚠️</span>
              <div className="prose-p:m-0 text-amber-900 dark:text-amber-200 font-medium text-lg leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        );
      }

      // Default Quote Style
      return (
        <blockquote className="relative my-10 pl-8 pr-4 py-4 border-l-4 border-lime-500 bg-gradient-to-r from-forest-50/50 to-transparent dark:from-forest-900/30 rounded-r-xl">
          <div className="text-xl md:text-2xl font-serif italic text-forest-800 dark:text-sage-200 leading-relaxed">
            "{children}"
          </div>
        </blockquote>
      );
    },

    toggle: ({ children }) => (
      <details className="my-6 rounded-xl border border-forest-100 dark:border-forest-700 bg-white dark:bg-forest-900/50 shadow-sm overflow-hidden group">
        <summary className="font-bold p-4 cursor-pointer bg-forest-50/50 dark:bg-forest-800/50 text-forest-900 dark:text-sage-100 hover:bg-forest-100 dark:hover:bg-forest-700 transition-colors flex items-center justify-between select-none">
          <span>{children}</span>
          <span className="text-lime-600 dark:text-lime-400 group-open:rotate-180 transition-transform duration-300">▼</span>
        </summary>
        <div className="p-5 bg-white dark:bg-forest-900 text-forest-700 dark:text-sage-300 border-t border-forest-100 dark:border-forest-700">
          {children}
        </div>
      </details>
    ),
  },

  marks: {
    strong: ({ children }) => <strong className="font-bold text-forest-900 dark:text-sage-100">{children}</strong>,
    em: ({ children }) => <em className="italic text-forest-600 dark:text-sage-300 font-serif font-medium">{children}</em>,

    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded-md bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 font-mono text-sm border border-forest-200 dark:border-forest-700/50">
        {children}
      </code>
    ),

    underline: ({ children }) => <span className="underline decoration-lime-400 decoration-2 underline-offset-4">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through text-forest-400 dark:text-forest-500 decoration-2">{children}</span>,

    highlight: ({ children }) => (
      <span className="bg-lime-100 dark:bg-lime-900/30 text-forest-900 dark:text-sage-100 px-1 rounded-sm border-b-2 border-lime-300 dark:border-lime-700">
        {children}
      </span>
    ),

    color: ({ children, value }: { children: React.ReactNode, value?: { value?: string } }) => {
      // Map basic colors to semantic theme colors if needed, or pass through
      return <span style={{ color: value?.value }}>{children}</span>;
    },

    link: ({ children, value }) => {
      const href = value?.href || '';

      // Extract text content from children
      const textContent = extractText(children);

      // Hide image placeholder links (legacy check)
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
          className="inline-block relative text-lime-600 dark:text-lime-400 font-medium transition-all duration-200
             after:content-[''] after:absolute after:w-full after:scale-x-100 after:h-0.5 after:bottom-0 after:left-0 after:bg-lime-500/30 after:origin-bottom-right after:transition-transform after:duration-300
             hover:after:scale-x-0 hover:text-lime-700 dark:hover:text-lime-300
             hover:bg-lime-50/50 dark:hover:bg-lime-900/10 rounded px-0.5 -mx-0.5"
        >
          {children}
        </a>
      );
    },
  },

  list: {
    bullet: ({ children }) => (
      <ul className="pl-6 space-y-3 my-6 text-forest-700 dark:text-sage-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-8 space-y-3 my-6 text-forest-700 dark:text-sage-300 marker:text-lime-600 dark:marker:text-lime-500 marker:font-bold text-lg leading-[1.7]">
        {children}
      </ol>
    ),
    checkbox: ({ children }) => (
      <ul className="pl-2 space-y-2 my-6">
        {children}
      </ul>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:bg-lime-500 before:rounded-full text-lg leading-[1.7]">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="pl-2 text-lg leading-[1.7]">
        {children}
      </li>
    ),
    checkbox: ({ children }) => (
      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-forest-50 dark:hover:bg-forest-800/50 transition-colors border border-transparent hover:border-forest-100 dark:hover:border-forest-700">
        <input type="checkbox" checked disabled className="mt-1.5 accent-lime-600 h-4 w-4 rounded-sm border-forest-300" />
        <span className="text-forest-700 dark:text-sage-300 text-lg">{children}</span>
      </li>
    ),
  },

  types: {
    image: ({ value }: any) => (
      <SanityImageWrapper value={value} />
    ),

    externalImage: ({ value }: any) => {
      const { url, alt, caption } = value || {};
      if (!url) return null;
      return (
        <SanityImageWrapper value={{ url, alt, caption }} isExternal={true} />
      );
    },

    video: ({ value }) => {
      const { videoUrl, caption, alt } = value;
      if (!videoUrl) return null;
      return (
        <div className="my-10 rounded-2xl overflow-hidden shadow-xl border border-forest-100 dark:border-forest-800">
          <AutoPlayVideo videoUrl={videoUrl} alt={alt} caption={caption} />
        </div>
      );
    },

    code: ({ value }: { value: { code: string; language?: string; filename?: string; title?: string; markDefs?: Array<{ _type: string; level?: number }> } }) => {
      if (!value?.code) return null;

      const indentMark = value?.markDefs?.find(mark => mark._type === 'indent');
      const indent = typeof indentMark?.level === 'number' ? indentMark.level : 0;

      return (
        <div className="my-10">
          <CodeBlock
            code={value.code}
            language={value.language}
            title={value.filename || value.title}
            indent={indent}
          />
        </div>
      );
    },

    table: ({ value }: { value: { rows: Array<{ cells: string[] }> } }) => {
      if (!value?.rows || value.rows.length === 0) return null;

      const [headerRow, ...bodyRows] = value.rows;

      return (
        <div className="w-full overflow-x-auto my-10 rounded-xl border border-forest-100 dark:border-forest-700 shadow-lg bg-white dark:bg-[#162c22]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-forest-50 dark:bg-forest-900 border-b border-forest-200 dark:border-forest-800">
              <tr>
                {headerRow.cells.map((cell, i) => (
                  <th key={i} className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-forest-600 dark:text-sage-300">
                    {cell.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100 dark:divide-forest-800">
              {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-forest-50/50 dark:hover:bg-forest-800/30 transition-colors">
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 text-forest-700 dark:text-sage-300 text-sm whitespace-pre-wrap">
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

