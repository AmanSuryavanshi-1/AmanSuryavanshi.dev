'use client';

import { useEffect, useState } from 'react';
import { BiTime } from 'react-icons/bi';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    mobile?: boolean;
    onClose?: () => void;
    readTime?: number;
}

export default function TableOfContents({ mobile, onClose, readTime = 5 }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<number>(readTime);

    useEffect(() => {
        // Find all h2 and h3 elements in the article body
        const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));

        const usedIds = new Set<string>();

        const items = elements.map((elem) => {
            // Generate id if missing or ensure uniqueness
            let id = elem.id;

            if (!id) {
                const baseId = elem.textContent
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '') || 'heading';

                id = baseId;
                let counter = 1;

                // If ID already exists in our set, or (less likely) in DOM but not in our set yet
                while (usedIds.has(id)) {
                    id = `${baseId}-${counter}`;
                    counter++;
                }
            } else {
                // Elem had an ID, but we still need to track it to prevent future collisions
                let baseId = id;
                let counter = 1;
                while (usedIds.has(id)) {
                    id = `${baseId}-${counter}`;
                    counter++;
                }
            }

            // Assign the unique ID back to the element so anchors work
            elem.id = id;
            usedIds.add(id);

            return {
                id,
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

        // Time remaining calculation
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = window.scrollY / totalHeight;
            const remaining = Math.ceil(readTime * (1 - progress));
            setTimeRemaining(remaining > 0 ? remaining : 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [readTime]);

    if (headings.length === 0) return null;

    return (
        <nav className={`${mobile ? '' : 'hidden xl:block sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto'}`}>
            <div className="bg-white dark:bg-[#162c22] rounded-2xl p-6 border border-forest-100 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h5 className="text-xs font-bold text-forest-900 dark:text-sage-100 uppercase tracking-wider mb-4 flex items-center gap-2 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    On this page
                </h5>

                <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar dark-scrollbar">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(heading.id);
                                    if (element) {
                                        const headerOffset = 100;
                                        const elementPosition = element.getBoundingClientRect().top;
                                        const offsetPosition = elementPosition + window.scrollY - headerOffset;

                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: 'smooth'
                                        });
                                    }
                                    if (onClose) onClose();
                                }}
                                className={`
                                    block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 border-l-2
                                    ${activeId === heading.id
                                        ? 'border-lime-500 bg-lime-50 dark:bg-lime-500/20 text-forest-900 dark:text-lime-300 font-medium'
                                        : 'border-transparent text-forest-500 dark:text-sage-200 hover:text-forest-700 dark:hover:text-white hover:bg-forest-50 dark:hover:bg-forest-700'
                                    }
                                `}
                                style={{
                                    paddingLeft: heading.level === 3 ? '1.5rem' : '0.75rem',
                                    fontSize: heading.level === 3 ? '0.85rem' : '0.9rem'
                                }}
                            >
                                <span className="line-clamp-2">{heading.text}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
