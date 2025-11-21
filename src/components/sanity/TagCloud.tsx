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
        <div className="flex flex-wrap gap-2.5 justify-start">
            <button
                onClick={() => selectedTags.length > 0 && onTagSelect('ALL')}
                className={`group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-out
                    ${selectedTags.length === 0
                        ? 'bg-forest-900 text-white shadow-lg shadow-forest-900/20 ring-2 ring-forest-900 ring-offset-2'
                        : 'bg-white text-forest-600 border border-forest-200 hover:border-forest-400 hover:bg-forest-50 hover:shadow-sm'
                    }`}
            >
                <span className="relative z-10 flex items-center gap-2">
                    <Hash size={14} className={selectedTags.length === 0 ? "text-lime-400" : "text-forest-400"} />
                    All
                </span>
            </button>

            {sortedTags.map(([tagName, stat]) => {
                const isSelected = selectedTags.includes(tagName);
                const isProjectsTag = tagName === 'Projects';

                // Dynamic styling based on tag color
                const baseColor = stat.color || '#436850'; // Default to forest-500 if no color

                const style = isSelected
                    ? {
                        backgroundColor: baseColor,
                        borderColor: baseColor,
                        boxShadow: `0 4px 12px -2px ${baseColor}66` // 40% opacity shadow
                    }
                    : {
                        borderColor: stat.color ? `${baseColor}50` : undefined, // Increased border opacity
                        color: stat.color ? baseColor : undefined,
                        backgroundColor: stat.color ? `${baseColor}15` : undefined // Increased background opacity (approx 8%)
                    };

                return (
                    <button
                        key={tagName}
                        onClick={() => onTagSelect(tagName)}
                        style={style}
                        className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-out flex items-center gap-2 border
                            ${isSelected
                                ? 'text-white ring-2 ring-offset-2 ring-offset-white transform scale-105'
                                : 'bg-white border-forest-200 text-forest-700 hover:border-forest-400 hover:shadow-md hover:-translate-y-0.5'
                            }
                            ${isProjectsTag && !isSelected ? 'ring-2 ring-lime-400 ring-opacity-60 animate-pulse-slow shadow-lg shadow-lime-400/30' : ''}`}
                    >
                        <span>{tagName}</span>
                        {isSelected ? (
                            <X size={14} className="text-white/90" />
                        ) : (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-forest-900/10 font-bold ${stat.color ? '' : 'text-forest-500'}`}
                                style={stat.color ? { backgroundColor: `${baseColor}20`, color: baseColor } : undefined}>
                                {stat.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
