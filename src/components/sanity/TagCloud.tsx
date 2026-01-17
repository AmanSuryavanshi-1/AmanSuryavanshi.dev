'use client';

import React, { useRef, useState, useCallback } from 'react';
import type { Post, Tag, InlineTag } from '@/sanity/sanity';
import { X, Hash, GripHorizontal } from 'lucide-react';
import { normalizeTag } from '@/lib/tag-utils';

// Priority tags shown first, then others by count
const PRIORITY_TAGS = [
    'Projects', 'Featured', 'AI Agents', 'n8n Automation', 'n8n Workflows',
    'Next.js', 'MCP', 'Automation', 'AI & Automation', 'Agentic AI',
    'LangChain', 'React', 'TypeScript', 'Case Study', 'Tutorial',
    'Lead Automation', 'Full-Stack', 'SEO', 'Machine Learning'
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

        // 2. Count from posts (InlineTags: label, slug (string))
        posts.forEach(post => {
            post.tags?.forEach(tag => {
                if (!tag) return;
                // Check if it's an InlineTag (has label) or legacy reference (has name)
                const tagName = (tag as InlineTag).label || (tag as any).name;
                const tagSlug = (tag as InlineTag).slug || (tag as any).slug?.current;
                const tagColor = (tag as InlineTag).color || (tag as any).color;

                countTag(tagName, tagColor, tagSlug);
            });
        });

        return stats;
    }, [posts, allTags]);

    const sortedTags = React.useMemo(() => {
        // Get all tags with count > 0, sorted by: priority tags first, then by count
        return Object.entries(tagStats)
            .filter(([, stat]) => stat.count > 0)
            .sort((a, b) => {
                const aIsPriority = PRIORITY_TAGS.some(p => p.toLowerCase() === a[0].toLowerCase());
                const bIsPriority = PRIORITY_TAGS.some(p => p.toLowerCase() === b[0].toLowerCase());

                // Priority tags first
                if (aIsPriority && !bIsPriority) return -1;
                if (!aIsPriority && bIsPriority) return 1;

                // Then by count
                return b[1].count - a[1].count;
            })
            .slice(0, 12); // Show up to 12 tags
    }, [tagStats]);

    // Drag to scroll functionality - must be before early return!
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Use refs to track drag state without causing re-renders
    const dragState = useRef({
        isDown: false,
        startX: 0,
        scrollLeft: 0,
        hasMoved: false, // Track if we actually moved (to differentiate click vs drag)
        moveThreshold: 5, // Pixels moved before considering it a drag
    });

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        dragState.current = {
            ...dragState.current,
            isDown: true,
            startX: e.clientX,
            scrollLeft: container.scrollLeft,
            hasMoved: false,
        };

        // Capture pointer for smooth tracking even outside element
        container.setPointerCapture(e.pointerId);
    }, []);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!scrollContainerRef.current) return;

        dragState.current.isDown = false;
        setIsDragging(false);

        // Release pointer capture
        scrollContainerRef.current.releasePointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragState.current.isDown || !scrollContainerRef.current) return;

        const dx = e.clientX - dragState.current.startX;

        // Check if movement exceeds threshold
        if (Math.abs(dx) > dragState.current.moveThreshold) {
            dragState.current.hasMoved = true;
            setIsDragging(true);
        }

        if (dragState.current.hasMoved) {
            e.preventDefault();
            scrollContainerRef.current.scrollLeft = dragState.current.scrollLeft - dx;
        }
    }, []);

    // Prevent click on tags when dragging
    const handleTagClick = useCallback((tagName: string) => {
        // Only trigger if we didn't drag
        if (!dragState.current.hasMoved) {
            onTagSelect(tagName);
        }
    }, [onTagSelect]);

    if (sortedTags.length === 0) return null;

    return (
        <div className="relative group/tags">
            {/* Drag hint indicator */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-50 group-hover/tags:opacity-80 transition-opacity">
                <div className="bg-gradient-to-l from-sage-200 dark:from-forest-800 to-transparent w-12 h-full absolute right-0" />
                <GripHorizontal size={16} className="text-forest-500 dark:text-sage-400 mr-1" />
            </div>
            <div
                ref={scrollContainerRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'pan-y' }}
                className={`flex overflow-x-auto pb-2 py-2 -mx-4 px-4 sm:-mx-2 sm:px-2 scrollbar-hide snap-x select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div className="flex gap-2 min-w-min pr-8">
                    {/* ALL Tag */}
                    <button
                        onClick={() => selectedTags.length > 0 && handleTagClick('ALL')}
                        className={`group relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap snap-start shrink-0
                    ${selectedTags.length === 0
                                ? 'bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-950 border border-forest-900 dark:border-lime-500 shadow-md'
                                : 'bg-white dark:bg-forest-800 text-forest-900 dark:text-sage-100 border border-forest-400 dark:border-forest-600 hover:border-forest-600 hover:bg-sage-100 dark:hover:bg-forest-700'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-1.5">
                            <Hash size={12} className={selectedTags.length === 0 ? "text-lime-400 dark:text-forest-950" : "text-forest-500 dark:text-sage-400"} />
                            All
                        </span>
                    </button>

                    {/* Individual Tags */}
                    {sortedTags.map(([tagName, stat]) => {
                        const isSelected = selectedTags.includes(tagName);
                        const isProjectsTag = tagName === 'Projects';

                        return (
                            <button
                                key={tagName}
                                onClick={() => handleTagClick(tagName)}
                                className={`group relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border whitespace-nowrap snap-start shrink-0
                            ${isSelected
                                        ? 'bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-950 border-forest-900 dark:border-lime-500 shadow-md'
                                        : 'bg-white dark:bg-forest-800 text-forest-900 dark:text-sage-100 border-forest-400 dark:border-forest-600 hover:border-forest-600 hover:shadow-sm hover:bg-sage-100 dark:hover:bg-forest-700'
                                    }
                            ${isProjectsTag && !isSelected
                                        ? 'border-lime-500 bg-lime-500/5 dark:bg-lime-500/10 shadow-sm'
                                        : ''
                                    }`}
                            >
                                <span>{tagName}</span>
                                {isSelected ? (
                                    <X size={12} className="text-white/90 dark:text-forest-950" />
                                ) : (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isProjectsTag
                                        ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400'
                                        : 'bg-forest-900/10 dark:bg-sage-300/10 text-forest-700 dark:text-sage-300'
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


