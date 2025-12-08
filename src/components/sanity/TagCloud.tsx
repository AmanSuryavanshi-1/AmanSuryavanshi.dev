'use client';

import React from 'react';
import type { Post, Tag } from '@/sanity/sanity';
import { X, Hash } from 'lucide-react';
import { normalizeTag } from '@/lib/tag-utils';

// Only show these important tags in the cloud
const IMPORTANT_TAGS = [
    'Projects', 'Featured', 'AI Agents', 'n8n automation',
    'Next.js', 'MCP', 'Automation', 'AI & Automation',
    'LangChain', 'React', 'TypeScript'
];

interface TagCloudProps {
    posts: Post[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    allTags?: Tag[];
}

export default function TagCloud({ posts, selectedTags, onTagSelect, allTags = [] }: TagCloudProps) {
    // Calculate tag counts with normalization
    const tagStats = React.useMemo(() => {
        const stats: Record<string, { count: number; color?: string; slug?: string }> = {};

        // 1. Initialize with all available tags (count 0)
        allTags.forEach(tag => {
            if (!tag.name) return;
            const normalizedName = normalizeTag(tag.name);

            if (!stats[normalizedName]) {
                stats[normalizedName] = {
                    count: 0,
                    color: tag.color,
                    slug: tag.slug?.current
                };
            }
        });

        // Helper to process a tag from posts
        const countTag = (tagName: string, color?: string, slug?: string) => {
            if (!tagName) return;
            const normalizedName = normalizeTag(tagName);

            if (!stats[normalizedName]) {
                stats[normalizedName] = {
                    count: 0,
                    color: color,
                    slug: slug
                };
            }
            stats[normalizedName].count += 1;

            // If the current tag has a color and the stored one doesn't, update it
            if (color && !stats[normalizedName].color) {
                stats[normalizedName].color = color;
            }
        };

        // 2. Count from posts
        posts.forEach(post => {
            post.tags?.forEach(tag => {
                if (!tag) return; // Skip null tag references
                countTag(tag.name, tag.color, tag.slug?.current);
            });
        });

        return stats;
    }, [posts, allTags]);

    const sortedTags = React.useMemo(() => {
        return Object.entries(tagStats)
            .filter(([tagName, stat]) =>
                stat.count > 0 && IMPORTANT_TAGS.includes(tagName) // Only important tags
            )
            .sort((a, b) => b[1].count - a[1].count);
    }, [tagStats]);

    if (sortedTags.length === 0) return null;

    return (
        <div className="relative group/tags">
            <div className="flex overflow-x-auto pb-2 py-2 -mx-4 px-4 sm:-mx-2 sm:px-2 scrollbar-hide snap-x">
                <div className="flex gap-3 min-w-min pr-4">
                    {/* ALL Tag */}
                    <button
                        onClick={() => selectedTags.length > 0 && onTagSelect('ALL')}
                        className={`group relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out whitespace-nowrap snap-start
                    ${selectedTags.length === 0
                                ? 'bg-forest-900 text-white border-2 border-forest-900 shadow-lg shadow-forest-900/30 ring-2 ring-forest-900 ring-offset-2'
                                : 'bg-white text-forest-900 border-2 border-forest-500 hover:border-forest-700 hover:bg-sage-100 hover:shadow-md'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Hash size={14} className={selectedTags.length === 0 ? "text-lime-500" : "text-forest-500"} />
                            All
                        </span>
                    </button>

                    {/* Individual Tags */}
                    {sortedTags.map(([tagName, stat]) => {
                        const isSelected = selectedTags.includes(tagName);
                        const isProjectsTag = tagName === 'Projects';

                        // Use forest-900 as default color
                        const baseColor = stat.color || '#12372A';

                        const style = isSelected
                            ? {
                                backgroundColor: baseColor,
                                borderColor: baseColor,
                                boxShadow: `0 6px 16px -4px ${baseColor}70`
                            }
                            : {};

                        return (
                            <button
                                key={tagName}
                                onClick={() => onTagSelect(tagName)}
                                style={style}
                                className={`group relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center gap-2 border-2 whitespace-nowrap snap-start
                            ${isSelected
                                        ? 'text-white ring-2 ring-offset-2 ring-offset-white transform scale-105 shadow-lg'
                                        : 'bg-white text-forest-900 border-forest-500 hover:border-forest-700 hover:shadow-md hover:-translate-y-0.5 hover:bg-sage-100'
                                    }
                            ${isProjectsTag && !isSelected
                                        ? 'border-lime-500 bg-lime-500/5 ring-2 ring-lime-500/40 shadow-lg shadow-lime-500/30 hover:ring-lime-500/60 hover:shadow-lime-500/40 hover:bg-lime-500/10'
                                        : ''
                                    }`}
                            >
                                <span>{tagName}</span>
                                {isSelected ? (
                                    <X size={14} className="text-white/90" />
                                ) : (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isProjectsTag
                                        ? 'bg-lime-500/20 text-lime-700'
                                        : 'bg-forest-900/10 text-forest-900'
                                        }`}>
                                        {stat.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}


