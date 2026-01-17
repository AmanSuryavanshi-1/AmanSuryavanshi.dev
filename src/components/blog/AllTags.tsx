'use client';

import Link from 'next/link';
import type { InlineTag } from '@/sanity/sanity';

interface AllTagsProps {
    tags: InlineTag[];
}

export default function AllTags({ tags }: AllTagsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="my-12">
            <h3 className="text-sm font-bold text-forest-700 uppercase tracking-wider mb-4">
                Topics
            </h3>
            <div className="flex flex-wrap gap-3">
                {tags.filter(tag => tag && tag.label).map((tag) => (
                    <Link
                        key={tag._key}
                        href={`/blogs?tag=${tag.slug}`}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border bg-sage-100/50 dark:bg-forest-800/50 border-sage-200 dark:border-forest-700 text-forest-900 dark:text-sage-100 hover:bg-lime-100 dark:hover:bg-lime-900/30"
                    >
                        {tag.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
