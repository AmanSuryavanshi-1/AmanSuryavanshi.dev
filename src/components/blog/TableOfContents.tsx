'use client';

import { useEffect, useState } from 'react';


interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents() {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Find all h2 and h3 elements in the article body
        const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));

        const items = elements.map((elem) => {
            // Generate id if missing
            if (!elem.id) {
                elem.id = elem.textContent
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '') || '';
            }

            return {
                id: elem.id,
                text: elem.textContent || '',
                level: Number(elem.tagName.charAt(1)),
            };
        });

        setHeadings(items);

        // Intersection Observer for active state
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav className="hidden lg:block sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pl-4">
            <h4 className="text-sm font-bold text-forest-900 uppercase tracking-wider mb-4">
                On this page
            </h4>
            <ul className="space-y-3 text-sm border-l border-forest-100">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
                    >
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            className={`block pl-4 border-l-2 -ml-[1px] transition-all duration-200 ${activeId === heading.id
                                ? 'border-lime-500 text-lime-600 font-medium'
                                : 'border-transparent text-forest-500 hover:text-forest-800 hover:border-forest-300'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
