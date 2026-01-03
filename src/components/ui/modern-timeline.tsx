'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════════════════════════════════════
// MODERN TIMELINE - Interactive Career Journey Component
// ══════════════════════════════════════════════════════════════════════════

export interface TimelineItemData {
    id: string;
    year: string;
    title: string;
    description: string;
    category?: 'education' | 'career' | 'project' | 'milestone';
    highlight?: boolean;
}

export interface TimelineProps {
    items: TimelineItemData[];
    className?: string;
}

const categoryColors = {
    education: 'bg-blue-500 dark:bg-blue-400',
    career: 'bg-lime-500 dark:bg-lime-400',
    project: 'bg-amber-500 dark:bg-amber-400',
    milestone: 'bg-purple-500 dark:bg-purple-400',
};

const categoryBorders = {
    education: 'border-blue-500/30 dark:border-blue-400/30',
    career: 'border-lime-500/30 dark:border-lime-400/30',
    project: 'border-amber-500/30 dark:border-amber-400/30',
    milestone: 'border-purple-500/30 dark:border-purple-400/30',
};

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
    return (
        <div className={cn("relative w-full", className)}>
            {/* Main vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lime-500 via-forest-400 to-lime-500 dark:from-lime-400 dark:via-sage-500 dark:to-lime-400 transform md:-translate-x-1/2" />

            <div className="space-y-8 md:space-y-12">
                {items.map((item, index) => (
                    <TimelineEntry
                        key={item.id}
                        item={item}
                        index={index}
                        isEven={index % 2 === 0}
                    />
                ))}
            </div>
        </div>
    );
};

const TimelineEntry: React.FC<{
    item: TimelineItemData;
    index: number;
    isEven: boolean;
}> = ({ item, index, isEven }) => {
    const category = item.category || 'career';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className={cn(
                "relative flex items-start gap-4 md:gap-8",
                "md:justify-center"
            )}
        >
            {/* Timeline dot */}
            <div className={cn(
                "absolute left-4 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2",
                "ring-4 ring-sage-50 dark:ring-forest-950",
                "shadow-lg",
                categoryColors[category],
                item.highlight && "w-5 h-5 ring-lime-500/30 dark:ring-lime-400/30"
            )} />

            {/* Content card - alternates sides on desktop */}
            <div className={cn(
                "ml-10 md:ml-0 md:w-5/12",
                isEven ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8 md:text-left"
            )}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                        "p-4 md:p-5 rounded-xl",
                        "bg-white/60 dark:bg-forest-900/40",
                        "border",
                        categoryBorders[category],
                        "shadow-sm hover:shadow-lg",
                        "transition-all duration-300",
                        item.highlight && "ring-2 ring-lime-500/20 dark:ring-lime-400/20"
                    )}
                >
                    {/* Year badge */}
                    <span className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-xs font-mono font-bold mb-2",
                        "bg-forest-100 dark:bg-forest-800",
                        "text-forest-700 dark:text-sage-300"
                    )}>
                        {item.year}
                    </span>

                    {/* Title */}
                    <h4 className="text-base md:text-lg font-bold font-serif text-forest-900 dark:text-sage-100 mb-1">
                        {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-forest-600 dark:text-sage-300 leading-relaxed">
                        {item.description}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Pre-defined journey data (can be overridden via props)
export const myJourneyData: TimelineItemData[] = [
    {
        id: 'ece',
        year: '2020',
        title: 'Electronics & Communication Engineering',
        description: 'Started exploring how signals flow through systems—from sensor input to actuator output. This foundation shaped my systems-thinking approach.',
        category: 'education',
    },
    {
        id: 'first-code',
        year: '2021',
        title: 'First Lines of Code',
        description: 'Discovered the power of automation. Built my first web projects and fell in love with the idea of making computers do the boring work.',
        category: 'milestone',
    },
    {
        id: 'fullstack',
        year: '2023',
        title: 'Full-Stack Development',
        description: 'Mastered Next.js, React, and TypeScript. Started building production-grade applications with 95+ Lighthouse scores.',
        category: 'career',
    },
    {
        id: 'aviators',
        year: '2024',
        title: 'Aviators Training Centre',
        description: 'Delivered ₹300K+ revenue impact through SEO-optimized web presence. Achieved #1 Google rankings. First major client success.',
        category: 'project',
        highlight: true,
    },
    {
        id: 'automation',
        year: '2024',
        title: 'n8n & Multi-LLM Orchestration',
        description: 'Built 74-node production workflows with 99.7% reliability. Mastered self-healing automation architecture.',
        category: 'career',
        highlight: true,
    },
    {
        id: 'agentic',
        year: '2025',
        title: 'Agentic Systems Era',
        description: 'Combining LangGraph, CrewAI, and n8n AI Agents into complete solutions. The T-Stack: depth in orchestration, breadth across the stack.',
        category: 'milestone',
        highlight: true,
    },
];

export default Timeline;
