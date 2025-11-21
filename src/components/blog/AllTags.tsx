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
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Topics
            </h3>
            <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                    <Link
                        key={tag._id}
                        href={`/blogs?tag=${tag.slug.current}`}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border"
                        style={{
                            backgroundColor: tag.color ? `${tag.color}20` : 'rgba(0,0,0,0.05)',
                            borderColor: tag.color || '#e5e7eb',
                            color: tag.color || '#374151'
                        }}
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
