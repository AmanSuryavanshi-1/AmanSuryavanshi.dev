'use client';

import Link from 'next/link';

interface Tag {
    _id: string;
    name: string;
    slug: { current: string };
    color?: string;
}

interface AllTagsProps {
    tags: Tag[];
}

export default function AllTags({ tags }: AllTagsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="my-12">
            <h3 className="text-sm font-bold text-forest-700 uppercase tracking-wider mb-4">
                Topics
            </h3>
            <div className="flex flex-wrap gap-3">
                {tags.filter(tag => tag && tag.name).map((tag) => (
                    <Link
                        key={tag._id}
                        href={`/blogs?tag=${tag.slug.current}`}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border"
                        style={{
                            backgroundColor: tag.color ? `${tag.color}20` : 'rgb(243 244 246 / 0.5)', // sage-100/50 fallback
                            borderColor: tag.color || '#E5E7EB', // sage-200 fallback
                            color: tag.color || '#12372A' // forest-900 fallback
                        }}
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
