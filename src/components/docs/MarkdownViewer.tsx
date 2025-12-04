import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useImageGallery } from '@/context/ImageGalleryContext';

interface MarkdownViewerProps {
    content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    const { registerImage, openGallery, images } = useImageGallery();

    return (
        <div className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-forest-900
            prose-p:text-forest-700 prose-p:leading-relaxed
            prose-strong:text-forest-900 prose-strong:font-bold
            prose-ul:text-forest-700 prose-ol:text-forest-700
            prose-li:marker:text-lime-600
            prose-a:text-lime-600 prose-a:no-underline hover:prose-a:text-lime-700 hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-lime-500 prose-blockquote:bg-forest-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-forest-700 prose-blockquote:not-italic
            prose-code:text-lime-600 prose-code:bg-forest-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-forest-900 prose-pre:text-forest-50 prose-pre:shadow-lg prose-pre:rounded-xl
            prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8 prose-img:border prose-img:border-forest-100
            prose-hr:border-forest-100 prose-hr:my-12
            prose-table:w-full prose-table:my-8 prose-table:border-collapse
            prose-th:bg-forest-50 prose-th:text-forest-900 prose-th:p-4 prose-th:text-left prose-th:font-bold prose-th:border prose-th:border-forest-100
            prose-td:p-4 prose-td:border prose-td:border-forest-100 prose-td:text-forest-700"
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                remarkRehypeOptions={{ allowDangerousHtml: true }}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="relative group">
                                <div className="absolute -top-3 right-4 text-xs font-mono text-forest-400 bg-forest-900 px-2 py-1 rounded-b-md border-x border-b border-forest-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {match[1]}
                                </div>
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0.75rem',
                                        background: 'transparent',
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    img: ({ src, alt, ...props }) => {
                        // Register image effect
                        useEffect(() => {
                            if (src) {
                                registerImage({ src, alt: alt || '' });
                            }
                        }, [src, alt, registerImage]);

                        return (
                            <img
                                src={src}
                                alt={alt}
                                {...props}
                                onClick={() => {
                                    // Find index of this image in the registered images
                                    const index = images.findIndex(img => img.src === src);
                                    if (index !== -1) openGallery(index);
                                }}
                            />
                        );
                    },
                    // Custom styling for other elements if needed
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-8 rounded-xl border border-forest-100 shadow-lg">
                            <table className="min-w-full divide-y divide-forest-100 bg-white/50 backdrop-blur-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="px-6 py-4 bg-forest-50 text-left text-xs font-bold text-forest-900 uppercase tracking-wider border-b border-forest-200">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-700 border-b border-forest-100 hover:bg-forest-50/50 transition-colors">
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
