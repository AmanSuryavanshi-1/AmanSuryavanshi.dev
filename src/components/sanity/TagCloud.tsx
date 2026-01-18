'use client';

import React, { useRef, useState, useEffect } from 'react';
import type { Post, Tag, InlineTag } from '@/sanity/sanity';
import { X, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeTag } from '@/lib/tag-utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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

            if (color && !stats[normalizedName].color) {
                stats[normalizedName].color = color;
            }
        };

        // 2. Count from posts
        posts.forEach(post => {
            post.tags?.forEach(tag => {
                if (!tag) return;
                const tagName = (tag as InlineTag).label || (tag as any).name;
                const tagSlug = (tag as InlineTag).slug || (tag as any).slug?.current;
                const tagColor = (tag as InlineTag).color || (tag as any).color;

                countTag(tagName, tagColor, tagSlug);
            });
        });

        return stats;
    }, [posts, allTags]);

    const sortedTags = React.useMemo(() => {
        return Object.entries(tagStats)
            .filter(([, stat]) => stat.count > 0)
            .sort((a, b) => {
                const aIsPriority = PRIORITY_TAGS.some(p => p.toLowerCase() === a[0].toLowerCase());
                const bIsPriority = PRIORITY_TAGS.some(p => p.toLowerCase() === b[0].toLowerCase());

                if (aIsPriority && !bIsPriority) return -1;
                if (!aIsPriority && bIsPriority) return 1;

                return b[1].count - a[1].count;
            })
            .slice(0, 15); // Show up to 15 tags
    }, [tagStats]);

    // Check scroll position and update button visibility
    const updateScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 5
        );
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', updateScrollButtons);
            }
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [sortedTags]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 200;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (sortedTags.length === 0) return null;

    const isAllSelected = selectedTags.length === 0;

    const tagVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        tap: { scale: 0.95 }
    };

    return (
        <div className="relative flex items-center gap-2">
            {/* Left Scroll Button */}
            <AnimatePresence>
                {canScrollLeft && (
                    <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute left-0 z-20 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-forest-800 border-2 border-forest-300 dark:border-forest-600 shadow-lg hover:bg-sage-50 dark:hover:bg-forest-700 hover:border-forest-500 dark:hover:border-sage-400 transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} className="text-forest-700 dark:text-sage-200" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Left Fade Gradient */}
            {canScrollLeft && (
                <div className="absolute left-10 md:left-12 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 dark:from-[#162c22]/90 to-transparent z-10 pointer-events-none" />
            )}

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto py-2 scrollbar-hide scroll-smooth md:mx-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <div className="flex gap-2 min-w-min px-1">
                    {/* ALL Tag Button */}
                    <motion.button
                        onClick={() => selectedTags.length > 0 && onTagSelect('ALL')}
                        variants={tagVariants}
                        initial="initial"
                        animate="animate"
                        whileTap="tap"
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`
                            relative px-4 py-2 rounded-full text-sm font-semibold 
                            transition-colors duration-200 whitespace-nowrap
                            flex items-center gap-2 border-2 shadow-sm
                            ${isAllSelected
                                ? 'bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-950 border-forest-900 dark:border-lime-500'
                                : 'bg-white dark:bg-forest-800 text-forest-700 dark:text-sage-200 border-forest-300 dark:border-forest-600 hover:border-forest-500 dark:hover:border-sage-400 hover:bg-sage-50 dark:hover:bg-forest-700'
                            }
                        `}
                    >
                        <Hash size={14} className={isAllSelected ? "text-lime-400 dark:text-forest-950" : "text-forest-500 dark:text-sage-400"} />
                        All
                    </motion.button>

                    {/* Individual Tag Buttons */}
                    <AnimatePresence mode="popLayout">
                        {sortedTags.map(([tagName, stat]) => {
                            const isSelected = selectedTags.includes(tagName);
                            const isProjectsTag = tagName === 'Projects';

                            return (
                                <motion.button
                                    key={tagName}
                                    onClick={() => onTagSelect(tagName)}
                                    variants={tagVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap="tap"
                                    layout
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className={`
                                        relative px-4 py-2 rounded-full text-sm font-semibold
                                        transition-colors duration-200 whitespace-nowrap
                                        flex items-center gap-2 border-2 shadow-sm
                                        ${isSelected
                                            ? 'bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-950 border-forest-900 dark:border-lime-500'
                                            : isProjectsTag
                                                ? 'bg-lime-50 dark:bg-lime-500/10 text-forest-800 dark:text-lime-400 border-lime-500 hover:bg-lime-100 dark:hover:bg-lime-500/20'
                                                : 'bg-white dark:bg-forest-800 text-forest-700 dark:text-sage-200 border-forest-300 dark:border-forest-600 hover:border-forest-500 dark:hover:border-sage-400 hover:bg-sage-50 dark:hover:bg-forest-700'
                                        }
                                    `}
                                >
                                    <span>{tagName}</span>

                                    <AnimatePresence mode="wait">
                                        {isSelected ? (
                                            <motion.span
                                                key="x-icon"
                                                initial={{ opacity: 0, rotate: -90 }}
                                                animate={{ opacity: 1, rotate: 0 }}
                                                exit={{ opacity: 0, rotate: 90 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <X size={14} className="text-white/90 dark:text-forest-950" />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="count-badge"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                transition={{ duration: 0.15 }}
                                                className={`
                                                    text-xs px-1.5 py-0.5 rounded-md font-bold
                                                    ${isProjectsTag
                                                        ? 'bg-lime-500/20 text-lime-700 dark:text-lime-400'
                                                        : 'bg-forest-900/10 dark:bg-sage-300/10 text-forest-600 dark:text-sage-300'
                                                    }
                                                `}
                                            >
                                                {stat.count}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Fade Gradient */}
            {canScrollRight && (
                <div className="absolute right-10 md:right-12 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 dark:from-[#162c22]/90 to-transparent z-10 pointer-events-none" />
            )}

            {/* Right Scroll Button */}
            <AnimatePresence>
                {canScrollRight && (
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute right-0 z-20 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-forest-800 border-2 border-forest-300 dark:border-forest-600 shadow-lg hover:bg-sage-50 dark:hover:bg-forest-700 hover:border-forest-500 dark:hover:border-sage-400 transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} className="text-forest-700 dark:text-sage-200" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
