"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Filter, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterCategory = "all" | "featured" | "freelance" | "personal" | "tech";

interface FilterBarProps {
    activeCategory: FilterCategory;
    onCategoryChange: (category: FilterCategory) => void;
    onSortChange: (sort: string) => void;
    onTechFilterChange: (tech: string) => void;
}

const categories: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "All Projects" },
    { id: "featured", label: "Featured" },
    { id: "freelance", label: "Freelance" },
    { id: "personal", label: "Personal" },
    { id: "tech", label: "Tech Demos" },
];

export default function FilterBar({
    activeCategory,
    onCategoryChange,
    onSortChange,
    onTechFilterChange,
}: FilterBarProps) {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isTechOpen, setIsTechOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.querySelector(`button[data-active="true"]`);
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }
    }, [activeCategory]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-20 z-40 w-full backdrop-blur-md bg-forest-950/80 border-b border-forest-700/50 py-4"
        >
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Categories - Horizontal Scroll on Mobile */}
                <div
                    ref={scrollContainerRef}
                    className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
                >
                    <div className="flex items-center gap-2 min-w-max">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                data-active={activeCategory === category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                    activeCategory === category.id
                                        ? "bg-lime-500 text-forest-950 shadow-lg shadow-lime-500/20"
                                        : "bg-forest-900/50 text-sage-100 hover:bg-forest-800 hover:text-white border border-forest-700"
                                )}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters & Sort */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* Tech Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setIsTechOpen(!isTechOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-900/50 border border-forest-700 text-sage-100 text-sm hover:bg-forest-800 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Tech Stack</span>
                            <span className="sm:hidden">Tech</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isTechOpen && "rotate-180")} />
                        </button>

                        {isTechOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-forest-900 border border-forest-700 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                {["React", "Next.js", "TypeScript", "Tailwind", "Node.js"].map((tech) => (
                                    <button
                                        key={tech}
                                        onClick={() => {
                                            onTechFilterChange(tech);
                                            setIsTechOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-sage-100 hover:bg-forest-800 hover:text-lime-500 transition-colors"
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-900/50 border border-forest-700 text-sage-100 text-sm hover:bg-forest-800 transition-colors"
                        >
                            <SortAsc className="w-4 h-4" />
                            <span>Sort</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isSortOpen && "rotate-180")} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-forest-900 border border-forest-700 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                {[
                                    { id: "latest", label: "Latest First" },
                                    { id: "complexity", label: "Complexity" },
                                    { id: "impact", label: "High Impact" },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            onSortChange(option.id);
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-sage-100 hover:bg-forest-800 hover:text-lime-500 transition-colors"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
