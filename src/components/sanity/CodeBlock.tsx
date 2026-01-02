'use client';

import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  indent?: number;
}

const CodeBlock = ({ code, language, title, indent = 0 }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative my-8 rounded-xl overflow-hidden shadow-lg border border-forest-100 dark:border-forest-800 ${indent > 0 ? `ml-${indent * 4}` : ''}`}>
      {/* Title Bar with Tab Style */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-forest-100/50 dark:bg-[#162c22] border-b border-forest-100 dark:border-forest-800 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-lime-400/80" />
          </div>
          {title && (
            <span className="text-xs font-mono font-medium text-forest-600 dark:text-sage-300 px-2 py-0.5 rounded bg-forest-200/50 dark:bg-forest-800/50 border border-forest-200 dark:border-forest-700/50">
              {title}
            </span>
          )}
        </div>

        <button
          onClick={copyToClipboard}
          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md 
            bg-transparent hover:bg-forest-200/50 dark:hover:bg-forest-700/50 
            text-xs font-medium text-forest-500 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-200
            transition-all duration-200"
        >
          {copied ? (
            <>
              <span className="text-lime-600 dark:text-lime-400">✓</span>
              <span className="text-lime-600 dark:text-lime-400">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="bg-[#0f291e] overflow-x-auto">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={atomOneDark}
          customStyle={{
            padding: '1.5rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            margin: 0,
            background: 'transparent', // Let container bg show through
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          }}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
