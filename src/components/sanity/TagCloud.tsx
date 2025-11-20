'use client';

import React from 'react';
import type { Post } from '@/sanity/sanity';
import { X } from 'lucide-react';
import { normalizeTag } from '@/lib/tag-utils';

interface TagCloudProps {
    posts: Post[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    allTags?: { title: string }[];
}

const getTagColor = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (['ai', 'agent', 'mcp'].some(k => lowerTag.includes(k))) {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100 hover:bg-blue-200';
    }
    if (['web', 'next', 'react', 'css', 'html'].some(k => lowerTag.includes(k))) {
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-100 hover:bg-purple-200';
    }
    if (['automation', 'n8n', 'workflow'].some(k => lowerTag.includes(k))) {
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-100 hover:bg-emerald-200';
    }
    if (['projects', 'project', 'my projects'].some(k => lowerTag.includes(k))) {
        return 'bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse hover:bg-amber-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transition-all duration-300 font-bold ring-2 ring-amber-400/30';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200';
};

export default function TagCloud({ posts, selectedTags, onTagSelect, allTags = [] }: TagCloudProps) {
    // Calculate tag counts
    const tagCounts = React.useMemo(() => {
        const counts: Record<string, number> = {};

        // Initialize with all available tags (count 0)
        allTags.forEach(tag => {
            if (tag.title) {
                const normalized = normalizeTag(tag.title);
                counts[normalized] = 0;
            }
        });

        posts.forEach(post => {
            // Add tags
            post.tags?.forEach(tag => {
                const normalized = normalizeTag(tag);
                counts[normalized] = (counts[normalized] || 0) + 1;
            });

            // Add categories as tags
            post.categories?.forEach(category => {
                if (category.title) {
                    const normalized = normalizeTag(category.title);
                    counts[normalized] = (counts[normalized] || 0) + 1;
                }
            });
        });
        return counts;
    }, [posts, allTags]);

    const sortedTags = React.useMemo(() => {
        return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    }, [tagCounts]);

    if (sortedTags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
                onClick={() => selectedTags.length > 0 && onTagSelect('ALL')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${selectedTags.length === 0
                    ? 'bg-lime-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                    }`}
            >
                All Posts
            </button>
            {sortedTags.map(([tag, count]) => {
                const isSelected = selectedTags.includes(tag);
                const colorClass = isSelected
                    ? 'bg-lime-500 text-white shadow-md pr-3'
                    : getTagColor(tag);

                const isProjectsTag = ['projects', 'project', 'my projects'].some(k => tag.toLowerCase().includes(k));

                return (
                    <button
                        key={tag}
                        onClick={() => onTagSelect(tag)}
                        style={isProjectsTag ? { animationDuration: '3s' } : undefined}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2 ${colorClass}`}
                    >
                        {tag}
                        {isSelected ? (
                            <X size={14} className="text-white" />
                        ) : (
                            <span className={`text-xs opacity-80`}>
                                ({count})
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
