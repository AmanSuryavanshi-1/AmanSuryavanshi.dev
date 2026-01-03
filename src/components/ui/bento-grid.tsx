'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════════════════════════════════════
// PREMIUM BENTO GRID - 21st.dev Inspired with Dark Mode Support
// ══════════════════════════════════════════════════════════════════════════

export interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export interface BentoCardProps {
    id?: string;
    children: React.ReactNode;
    className?: string;
    /** Enable CSS-masked schematic background for ECE/Technical visual */
    hasSchematicBg?: boolean;
}

export interface BentoTitleProps {
    children: React.ReactNode;
    className?: string;
}

export interface BentoDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export interface BentoContentProps {
    children: React.ReactNode;
    className?: string;
}

// Main Bento Grid Container
export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[minmax(180px,auto)] gap-4",
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
};

// Individual Bento Card
export const BentoCard: React.FC<BentoCardProps> = ({
    id,
    children,
    className,
    hasSchematicBg = false
}) => {
    return (
        <div
            id={id}
            className={cn(
                "relative overflow-hidden rounded-2xl p-6 sm:p-8",
                // Light mode
                "bg-white/60 border border-sage-200/60",
                // Dark mode
                "dark:bg-forest-900/40 dark:border-white/10",
                // Hover effects
                "transition-all duration-300",
                "hover:shadow-lg hover:shadow-lime-500/10",
                "hover:-translate-y-1",
                "group",
                className
            )}
        >
            {/* CSS-masked Schematic Background for Visual Bridge */}
            {hasSchematicBg && (
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23436850' stroke-width='0.5'%3E%3Crect x='10' y='10' width='20' height='15' rx='2'/%3E%3Crect x='40' y='20' width='25' height='20' rx='2'/%3E%3Crect x='70' y='10' width='20' height='15' rx='2'/%3E%3Cline x1='30' y1='17' x2='40' y2='30'/%3E%3Cline x1='65' y1='30' x2='70' y2='17'/%3E%3Ccircle cx='15' cy='50' r='8'/%3E%3Ccircle cx='50' cy='60' r='12'/%3E%3Ccircle cx='85' cy='50' r='8'/%3E%3Cline x1='23' y1='50' x2='38' y2='60'/%3E%3Cline x1='62' y1='60' x2='77' y2='50'/%3E%3Crect x='20' y='75' width='60' height='10' rx='2'/%3E%3Cline x1='50' y1='72' x2='50' y2='75'/%3E%3Cpath d='M10 90 Q 30 80 50 90 Q 70 100 90 90'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '100px 100px',
                    }}
                />
            )}
            {children}
        </div>
    );
};

// Bento Card Title
export const BentoTitle: React.FC<BentoTitleProps> = ({ children, className }) => {
    if (!children) return null;

    return (
        <h3
            className={cn(
                "text-lg md:text-xl font-bold font-serif tracking-tight",
                "text-forest-900 dark:text-sage-100",
                "group-hover:text-lime-700 dark:group-hover:text-lime-400",
                "transition-colors duration-300",
                className
            )}
        >
            {children}
        </h3>
    );
};

// Bento Card Description
export const BentoDescription: React.FC<BentoDescriptionProps> = ({ children, className }) => {
    if (!children) return null;

    return (
        <p
            className={cn(
                "text-sm md:text-base leading-relaxed mt-2",
                "text-forest-600 dark:text-sage-300",
                className
            )}
        >
            {children}
        </p>
    );
};

// Bento Card Content Wrapper
export const BentoContent: React.FC<BentoContentProps> = ({ children, className }) => {
    return (
        <div className={cn("h-full w-full", className)}>
            {children}
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════════
// CLOSED-LOOP FEEDBACK VISUAL (Reliability Block)
// ══════════════════════════════════════════════════════════════════════════

export const ClosedLoopVisual: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cn("w-full flex items-center justify-center py-2", className)}>
            <svg
                viewBox="0 0 320 90"
                className="w-full max-w-[300px] h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Input Node */}
                <g className="transition-all duration-300">
                    <rect x="10" y="30" width="70" height="32" rx="6"
                        className="fill-lime-50 dark:fill-lime-500/15 stroke-lime-500 dark:stroke-lime-400" strokeWidth="1.5" />
                    <text x="45" y="50" textAnchor="middle"
                        className="fill-lime-700 dark:fill-lime-400 text-[10px] font-semibold">INPUT</text>
                </g>

                {/* Arrow 1 */}
                <path d="M80 46 L110 46"
                    className="stroke-forest-400 dark:stroke-sage-500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    markerEnd="url(#arrow1)" />

                {/* Process Node - Central */}
                <g className="transition-all duration-300">
                    <rect x="110" y="22" width="100" height="48" rx="8"
                        className="fill-forest-50 dark:fill-forest-800/80 stroke-forest-500 dark:stroke-sage-400" strokeWidth="2" />
                    <text x="160" y="44" textAnchor="middle"
                        className="fill-forest-900 dark:fill-sage-100 text-[9px] font-bold">STATE MACHINE</text>
                    <text x="160" y="58" textAnchor="middle"
                        className="fill-forest-600 dark:fill-sage-400 text-[7px]">Deterministic</text>
                </g>

                {/* Arrow 2 */}
                <path d="M210 46 L240 46"
                    className="stroke-forest-400 dark:stroke-sage-500"
                    strokeWidth="2"
                    strokeLinecap="round"
                    markerEnd="url(#arrow1)" />

                {/* Output Node */}
                <g className="transition-all duration-300">
                    <rect x="240" y="30" width="70" height="32" rx="6"
                        className="fill-lime-50 dark:fill-lime-500/15 stroke-lime-500 dark:stroke-lime-400" strokeWidth="1.5" />
                    <text x="275" y="50" textAnchor="middle"
                        className="fill-lime-700 dark:fill-lime-400 text-[10px] font-semibold">OUTPUT</text>
                </g>

                {/* Feedback Loop - Clean curved path */}
                <path d="M275 62 L275 78 Q275 85 268 85 L52 85 Q45 85 45 78 L45 62"
                    className="stroke-amber-500/70 dark:stroke-amber-400/70"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                    fill="none"
                    strokeLinecap="round" />

                {/* Feedback Arrow */}
                <polygon points="45,65 41,58 49,58"
                    className="fill-amber-500/70 dark:fill-amber-400/70" />

                {/* Arrow marker definition */}
                <defs>
                    <marker id="arrow1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <path d="M0,0 L0,8 L8,4 z" className="fill-forest-400 dark:fill-sage-500" />
                    </marker>
                </defs>
            </svg>
        </div>
    );
};

export default BentoGrid;
