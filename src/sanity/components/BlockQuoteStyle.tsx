'use client'

import type { ReactNode } from 'react'

/**
 * Custom BlockQuote style component for Sanity Studio Portable Text editor.
 * 
 * This fixes the hydration error: "<div> cannot be a descendant of <p>"
 * that occurs with Sanity v4 + Next.js 15+ / React 19.
 * 
 * The issue is that Sanity's default BlockQuote component renders a <p> tag
 * which then contains <div> elements, causing invalid HTML nesting.
 * 
 * This custom component uses a <blockquote> with proper semantic HTML structure.
 */
interface BlockQuoteStyleProps {
    children: ReactNode
}

export function BlockQuoteStyle({ children }: BlockQuoteStyleProps) {

    return (
        <blockquote
            style={{
                borderLeft: '4px solid #84cc16', // lime-500
                paddingLeft: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                margin: '0.5rem 0',
                backgroundColor: 'rgba(132, 204, 22, 0.1)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: 'inherit',
            }}
        >
            {children}
        </blockquote>
    )
}
