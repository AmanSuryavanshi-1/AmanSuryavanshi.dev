'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useImageGallery } from '@/context/ImageGalleryContext';
import { ExternalLink } from 'lucide-react';

interface MarkdownViewerProps {
    content: string;
}

// Image component that handles both regular and Cloudinary images
const MarkdownImage = ({ src, alt, ...props }: { src?: string; alt?: string;[key: string]: any }) => {
    const { registerImage, openGallery, images } = useImageGallery();
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        if (src) {
            registerImage({ src, alt: alt || '' });
        }
    }, [src, alt, registerImage]);

    if (!src || imageError) return null;

    // Determine if it's a mobile/portrait screenshot based on alt text or aspect ratio will be handled by CSS
    const isMobileScreenshot = alt?.toLowerCase().includes('mobile') || alt?.toLowerCase().includes('phone');

    return (
        <figure className="my-8 flex justify-center">
            <div
                className={`
                    relative overflow-hidden rounded-xl shadow-lg border border-forest-100 bg-white 
                    cursor-zoom-in transition-all duration-300 hover:shadow-2xl hover:border-lime-200
                    ${isMobileScreenshot ? 'max-w-[280px] sm:max-w-[320px]' : 'w-full max-w-4xl'}
                `}
            >
                <img
                    src={src}
                    alt={alt || 'Documentation image'}
                    className={`
                        w-full h-auto object-contain 
                        transition-transform duration-300 group-hover:scale-[1.02]
                        ${isMobileScreenshot
                            ? 'max-h-[500px] sm:max-h-[600px]'
                            : 'max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]'
                        }
                    `}
                    loading="lazy"
                    onClick={() => {
                        const index = images.findIndex(img => img.src === src);
                        if (index !== -1) openGallery(index);
                    }}
                    onError={() => {
                        console.error('Image failed to load:', src);
                        setImageError(true);
                    }}
                />
            </div>
        </figure>
    );
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    return (
        <div className="prose prose-lg md:prose-xl max-w-none text-forest-900
            prose-headings:font-serif prose-headings:font-bold prose-headings:!text-forest-900 prose-headings:tracking-tight
            prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-5 prose-h2:mt-10 prose-h2:!text-forest-900
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:!text-forest-900
            prose-h4:text-lg prose-h4:md:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:!text-forest-900
            prose-p:!text-forest-900 prose-p:leading-relaxed prose-p:mb-5
            prose-strong:!text-forest-900 prose-strong:font-bold
            prose-em:text-forest-600 prose-em:italic
            prose-ul:!text-forest-900 prose-ul:my-4 prose-ul:pl-5
            prose-ol:!text-forest-900 prose-ol:my-4 prose-ol:pl-5
            prose-li:!text-forest-900 prose-li:my-1.5 prose-li:leading-relaxed
            prose-li:marker:text-lime-600 prose-li:marker:font-bold
            prose-a:text-lime-600 prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-lime-200 hover:prose-a:text-lime-700 hover:prose-a:border-lime-500 prose-a:transition-colors
            prose-blockquote:border-l-4 prose-blockquote:border-lime-500 prose-blockquote:bg-lime-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-forest-700 prose-blockquote:not-italic prose-blockquote:my-8 prose-blockquote:shadow-sm
            prose-code:text-lime-700 prose-code:bg-lime-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-lime-100
            prose-pre:bg-[#1e1e1e] prose-pre:text-forest-50 prose-pre:shadow-xl prose-pre:rounded-2xl prose-pre:p-0 prose-pre:my-8 prose-pre:border prose-pre:border-forest-800
            prose-hr:border-forest-200 prose-hr:my-16
            prose-table:w-full prose-table:my-8 prose-table:border-collapse prose-table:text-base
            prose-th:bg-forest-900 prose-th:text-white prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:text-sm prose-th:uppercase prose-th:tracking-wider
            prose-td:p-4 prose-td:border prose-td:border-forest-100 prose-td:text-forest-700 prose-td:bg-white
            prose-figure:my-0"
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                remarkRehypeOptions={{ allowDangerousHtml: true }}
                components={{
                    // Enhanced code block with language label
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="relative group my-8">
                                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-forest-800 rounded-t-2xl border-b border-forest-700">
                                    <span className="text-xs font-mono text-forest-400 uppercase tracking-wider">
                                        {match[1]}
                                    </span>
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                </div>
                                <div className="pt-10">
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            borderRadius: '0 0 1rem 1rem',
                                            background: '#1e1e1e',
                                            padding: '1.5rem',
                                        }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Enhanced image handling with responsive sizing
                    img: MarkdownImage,
                    // Enhanced table with better styling
                    table: ({ children }) => (
                        <div className="w-fit max-w-full overflow-x-auto my-10 rounded-2xl border border-forest-100 shadow-lg bg-white">
                            <table className="divide-y divide-forest-100 border-collapse">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-forest-900">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            {children}
                        </th>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="bg-white divide-y divide-forest-50">
                            {children}
                        </tbody>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-forest-50/50 transition-colors">
                            {children}
                        </tr>
                    ),
                    td: ({ children }) => (
                        <td className="px-6 py-4 text-sm text-forest-700 whitespace-normal">
                            {children}
                        </td>
                    ),
                    // Enhanced links with external indicator
                    a: ({ href, children, ...props }) => {
                        const isExternal = href?.startsWith('http');
                        return (
                            <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="inline-flex items-center gap-1 text-lime-600 font-medium border-b border-lime-200 hover:text-lime-700 hover:border-lime-500 transition-colors"
                                {...props}
                            >
                                {children}
                                {isExternal && <ExternalLink className="w-3.5 h-3.5 inline-block opacity-60" />}
                            </a>
                        );
                    },
                    // Enhanced blockquote styling
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-lime-500 bg-lime-50 py-4 px-6 rounded-r-xl my-8 shadow-sm not-italic">
                            {children}
                        </blockquote>
                    ),
                    // Enhanced horizontal rule
                    hr: () => (
                        <div className="my-16 flex items-center justify-center gap-2">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-forest-200" />
                            <div className="w-2 h-2 rounded-full bg-lime-500" />
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-forest-200" />
                        </div>
                    ),
                    // Enhanced list items
                    li: ({ children, ordered, ...props }: any) => (
                        <li className="my-2 leading-[1.75] text-forest-700" {...props}>
                            {children}
                        </li>
                    ),
                    // Enhanced emphasis (italic) for captions
                    em: ({ children }) => (
                        <em className="text-forest-500 text-sm italic block text-center -mt-6 mb-8">
                            {children}
                        </em>
                    ),
                    // Enhanced strong text
                    strong: ({ children }) => (
                        <strong className="font-bold text-forest-900">
                            {children}
                        </strong>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
