import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
    content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
    return (
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-lime-400 prose-a:text-lime-400 hover:prose-a:text-lime-300 prose-strong:text-lime-100 prose-code:text-lime-200 prose-pre:bg-forest-900/50 prose-pre:border prose-pre:border-forest-800">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Custom styling for other elements if needed
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-8">
                            <table className="min-w-full divide-y divide-forest-800 border border-forest-800">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="px-6 py-3 bg-forest-900/50 text-left text-xs font-medium text-lime-400 uppercase tracking-wider border-b border-forest-800">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-forest-200 border-b border-forest-800/50">
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
