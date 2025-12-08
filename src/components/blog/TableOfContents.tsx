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
        <nav className={`${mobile ? '' : 'hidden lg:block sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pl-4'}`}>
            {!mobile && (
                <div className="mb-6 p-4 bg-sage-50 rounded-xl border border-sage-100">
                    <div className="flex items-center gap-2 text-forest-700 font-medium text-sm mb-1">
                        <BiTime className="text-lime-600" />
                        <span>{timeRemaining} min remaining</span>
                    </div>
                    <div className="w-full bg-sage-200 rounded-full h-1.5 mt-2">
                        <div
                            className="bg-lime-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(0, Math.min(100, 100 - (timeRemaining / readTime) * 100))}%` }}
                        />
                    </div>
                </div>
            )}

            <h4 className="text-sm font-bold text-forest-900 uppercase tracking-wider mb-4">
                On this page
            </h4>
            <ul className={`space-y-3 text-sm ${mobile ? '' : 'border-l border-forest-100'}`}>
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
                    >
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(heading.id);
                                if (element) {
                                    const headerOffset = 100; // Adjust for fixed header
                                    const elementPosition = element.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                                if (onClose) onClose();
                            }}
                            className={`block ${mobile ? 'py-2' : 'pl-4 border-l-2 -ml-[1px]'} transition-all duration-200 ${activeId === heading.id
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
