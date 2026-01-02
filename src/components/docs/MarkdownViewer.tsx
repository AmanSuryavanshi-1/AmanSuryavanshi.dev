'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useImageGallery } from '@/context/ImageGalleryContext';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

interface MarkdownViewerProps {
    content: string;
}

/**
 * Spacing System (Professional & Consistent):
 * - Section gap (between major sections): mt-10 md:mt-12
 * - Block gap (p, lists, blockquotes): mb-4 md:mb-5
 * - Heading spacing: mt-8 md:mt-10 mb-3 md:mb-4
 * - Inline elements: tight spacing
 */

// Modern, clean image component with fallback support
const MarkdownImage = ({ src, alt, ...props }: { src?: string; alt?: string;[key: string]: any }) => {
    const { registerImage, openGallery, images } = useImageGallery();
    const [imageError, setImageError] = React.useState(false);
    const [fallbackSrc, setFallbackSrc] = React.useState<string | null>(null);

    const isBadge = alt?.toLowerCase().includes('badge') || src?.toLowerCase().includes('badge') || src?.toLowerCase().includes('shield.io');
    const isMobileScreenshot = alt?.toLowerCase().includes('mobile') || alt?.toLowerCase().includes('phone');

    React.useEffect(() => {
        if (src && !isBadge) {
            registerImage({ src, alt: alt || '' });
        }
    }, [src, alt, registerImage, isBadge]);

    // Reset error state when src changes
    React.useEffect(() => {
        setImageError(false);
        setFallbackSrc(null);
    }, [src]);

    if (!src) return null;

    // Determine which source to display
    const displaySrc = imageError && fallbackSrc ? fallbackSrc : src;
    const displayAlt = imageError ? 'Fallback image' : (alt || 'Documentation image');



    if (isBadge) {
        return (
            <span className="inline-flex flex-col items-center justify-start mx-2 my-2 align-top group">
                <span
                    className={`
                        relative overflow-hidden rounded-[4px] 
                        transition-transform duration-300 hover:scale-110
                        max-w-[300px]
                    `}
                >
                    <img
                        src={displaySrc}
                        alt={displayAlt}
                        className="h-[28px] w-auto object-contain"
                        loading="lazy"
                        onError={() => {
                            if (!imageError) {
                                setImageError(true);
                            }
                        }}
                    />
                </span>
                {alt && !imageError && (
                    <span className="mt-1.5 text-[10px] uppercase tracking-wider font-semibold text-forest-400 text-center px-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {alt}
                    </span>
                )}
            </span>
        );
    }

    return (
        <figure className="my-6 md:my-8 flex flex-col items-center group">
            <div
                className={`
                    relative overflow-hidden rounded-xl 
                    shadow-md hover:shadow-xl transition-all duration-500
                    border border-forest-200/50 dark:border-forest-600 bg-white dark:bg-forest-800
                    ${!imageError ? 'cursor-zoom-in' : 'cursor-default'}
                    ${isMobileScreenshot ? 'max-w-[260px]' : 'w-full max-w-4xl'}
                `}
            >
                <img
                    src={displaySrc}
                    alt={displayAlt}
                    className={`
                        w-full h-auto object-contain 
                        transition-transform duration-700 group-hover:scale-[1.01]
                        ${isMobileScreenshot ? 'max-h-[500px]' : 'max-h-[600px]'}
                    `}
                    loading="lazy"
                    onClick={() => {
                        if (!imageError) {
                            const index = images.findIndex(img => img.src === src);
                            if (index !== -1) openGallery(index);
                        }
                    }}
                    onError={() => {
                        if (!imageError) {
                            console.warn('Image failed to load, showing fallback:', src);
                            const fallback = FallbackImageManager.getRandomFallback();
                            setFallbackSrc(fallback.path);
                            setImageError(true);
                        }
                    }}
                />
            </div>
            {alt && !imageError && (
                <figcaption className="mt-3 text-sm text-forest-500 dark:text-sage-400 text-center font-medium max-w-lg px-4">
                    {alt}
                </figcaption>
            )}
            {imageError && (
                <figcaption className="mt-3 text-sm text-forest-400 dark:text-sage-500 text-center italic max-w-lg px-4">
                    Image unavailable
                </figcaption>
            )}
        </figure>
    );
};

// Sleek code block
const CodeBlock = ({ language, children, ...props }: any) => {
    const [copied, setCopied] = React.useState(false);
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
        await navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6 md:my-8 rounded-xl overflow-hidden shadow-sm border border-forest-200/50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-white/10">
                <span className="text-xs font-mono text-gray-400 lowercase">
                    {language || 'text'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="sr-only">Copy</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-[#1e1e1e]">
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        background: 'transparent',
                        padding: '1rem 1.25rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                    }}
                    {...props}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

// Helper function to generate URL-friendly IDs from heading text
const generateHeadingId = (text: React.ReactNode): string => {
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (node && typeof node === 'object' && 'props' in node) {
            return extractText((node as any).props.children);
        }
        return '';
    };
    const plainText = extractText(text);
    return plainText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50) || 'heading';
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    // Registry to track generated IDs during this render pass
    // This ensures that if we have two headers with text "Overview", we get "overview" and "overview-1"
    const slugRegistry: Record<string, number> = {};

    const getUniqueId = (children: React.ReactNode): string => {
        const baseId = generateHeadingId(children);

        // If this ID hasn't been seen yet, initialize it
        if (slugRegistry[baseId] === undefined) {
            slugRegistry[baseId] = 0;
            return baseId;
        }

        // If it has been seen, increment counter and append it
        slugRegistry[baseId]++;
        return `${baseId}-${slugRegistry[baseId]}`;
    };

    return (
        <div className="markdown-content w-full max-w-full overflow-x-hidden prose-spacing">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                remarkRehypeOptions={{ allowDangerousHtml: true }}
                components={{
                    // === HEADINGS: Professional spacing with responsive design ===
                    h1: ({ children }) => {
                        const id = getUniqueId(children);
                        return (
                            <h1 id={id} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-forest-900 dark:text-sage-100 mt-0 mb-4 md:mb-6 scroll-mt-28 first:mt-0">
                                {children}
                            </h1>
                        );
                    },
                    h2: ({ children }) => {
                        const id = getUniqueId(children);
                        return (
                            <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-tight text-forest-900 dark:text-sage-100 mt-8 md:mt-10 mb-3 md:mb-4 scroll-mt-28 flex items-center gap-2 sm:gap-3 border-t border-forest-100 dark:border-forest-600 pt-8 md:pt-10 first:border-0 first:pt-0 first:mt-0">
                                <span className="w-1 sm:w-1.5 h-5 sm:h-6 rounded-full bg-lime-500 dark:bg-lime-400 flex-shrink-0" />
                                <span>{children}</span>
                            </h2>
                        );
                    },
                    h3: ({ children }) => {
                        const id = getUniqueId(children);
                        return (
                            <h3 id={id} className="text-lg sm:text-xl font-semibold text-forest-800 dark:text-sage-200 mt-6 md:mt-8 mb-2 md:mb-3 scroll-mt-28">
                                {children}
                            </h3>
                        );
                    },
                    h4: ({ children }) => {
                        const id = getUniqueId(children);
                        return (
                            <h4 id={id} className="text-base sm:text-lg font-semibold text-forest-700 mt-5 md:mt-6 mb-2 scroll-mt-28">
                                {children}
                            </h4>
                        );
                    },
                    h5: ({ children }) => {
                        const id = getUniqueId(children);
                        return (
                            <h5 id={id} className="text-base font-semibold text-forest-600 mt-4 md:mt-5 mb-2 scroll-mt-28">
                                {children}
                            </h5>
                        );
                    },
                    h6: ({ children }) => {
                        const id = getUniqueId(children);
                        return (
                            <h6 id={id} className="text-sm font-semibold text-forest-500 uppercase tracking-wide mt-4 mb-2 scroll-mt-28">
                                {children}
                            </h6>
                        );
                    },

                    // === TEXT: Consistent paragraph spacing ===
                    p: ({ children }) => (
                        <p className="text-base md:text-lg text-forest-700 dark:text-sage-300 leading-relaxed md:leading-relaxed mb-4 md:mb-5">
                            {children}
                        </p>
                    ),

                    // === LISTS: Uniform spacing ===
                    ul: ({ children }) => (
                        <ul className="my-4 md:my-5 space-y-2 md:space-y-2.5 list-none pl-0">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-4 md:my-5 space-y-2 md:space-y-2.5 list-decimal list-outside pl-5 text-forest-700 dark:text-sage-300">
                            {children}
                        </ol>
                    ),
                    li: ({ children, ordered, ...props }: any) => (
                        <li className={`
                            text-base md:text-lg text-forest-700 dark:text-sage-300 leading-relaxed 
                            ${!ordered ? 'flex items-start gap-2.5 sm:gap-3' : ''}
                        `} {...props}>
                            {!ordered && (
                                <span className="w-1.5 h-1.5 mt-2.5 md:mt-3 rounded-full bg-lime-500 dark:bg-lime-400 flex-shrink-0" />
                            )}
                            <span className="flex-1">{children}</span>
                        </li>
                    ),

                    // === LINKS ===
                    a: ({ href, children, ...props }) => {
                        const isExternal = href?.startsWith('http');
                        return (
                            <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="font-medium text-forest-700 dark:text-lime-400 hover:text-lime-600 dark:hover:text-lime-300 underline decoration-lime-300/50 dark:decoration-lime-500/50 underline-offset-4 hover:decoration-lime-500 dark:hover:decoration-lime-400 transition-colors"
                                {...props}
                            >
                                {children}
                                {isExternal && <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-50 dark:opacity-70" />}
                            </a>
                        );
                    },

                    // === BLOCKQUOTES: Clean callout style ===
                    blockquote: ({ children }) => (
                        <blockquote className="my-5 md:my-6 pl-4 sm:pl-5 border-l-4 border-lime-500 dark:border-lime-400 italic text-forest-600 dark:text-sage-400 leading-relaxed bg-lime-50/50 dark:bg-lime-500/10 py-3 sm:py-4 pr-4 rounded-r-lg">
                            {children}
                        </blockquote>
                    ),

                    // === TABLES: Professional data display ===
                    table: ({ children }) => (
                        <div className="my-5 md:my-6 overflow-hidden rounded-xl border border-forest-200 dark:border-forest-600 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-forest-200 dark:divide-forest-600">
                                    {children}
                                </table>
                            </div>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-forest-50 dark:bg-forest-800">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-forest-600 dark:text-sage-300 uppercase tracking-wider whitespace-nowrap">
                            {children}
                        </th>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="bg-white dark:bg-[#162c22] divide-y divide-forest-100 dark:divide-forest-600">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-forest-50/50 dark:hover:bg-forest-700/50 transition-colors">
                            {children}
                        </tr>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm md:text-base text-forest-700 dark:text-sage-300 leading-relaxed">
                            {children}
                        </td>
                    ),

                    // === CODE ===
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <CodeBlock language={match[1]} {...props}>
                                {children}
                            </CodeBlock>
                        ) : (
                            <code className="px-1.5 py-0.5 rounded-md bg-forest-50 text-forest-800 text-sm font-mono border border-forest-200/80" {...props}>
                                {children}
                            </code>
                        );
                    },

                    // === HR: Section divider ===
                    hr: () => <hr className="my-8 md:my-10 border-forest-100 dark:border-forest-600" />,

                    // === STRONG & EM ===
                    strong: ({ children }) => (
                        <strong className="font-semibold text-forest-900 dark:text-sage-100">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-forest-700 dark:text-sage-300">{children}</em>
                    ),

                    img: MarkdownImage,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
