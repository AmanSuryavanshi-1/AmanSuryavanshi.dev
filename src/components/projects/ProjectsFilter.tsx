"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectsFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    technologies: string[];
    activeTech: string;
    onTechChange: (tech: string) => void;
    categoryLabels?: Record<string, string>;
}

// Professional category labels mapping
const DEFAULT_CATEGORY_LABELS: Record<string, string> = {
    "All": "All",
    "featured": "Featured",
    "web": "Web Apps",
    "automation": "AI & Automation",
    "personal": "Personal",
    "freelance": "Freelance",
};

export default function ProjectsFilter({
    categories,
    activeCategory,
    onCategoryChange,
    technologies,
    activeTech,
    onTechChange,
    categoryLabels = DEFAULT_CATEGORY_LABELS
}: ProjectsFilterProps) {
    // Get display label for a category
    const getLabel = (category: string) => categoryLabels[category] || category;

    return (
        <div className="w-full mb-12 space-y-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={cn(
                            "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            activeCategory === category
                                ? "text-white"
                                : "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                        )}
                    >
                        {activeCategory === category && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-forest-900 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                // Prevent layout shift affecting parent elements
                                style={{ position: "absolute" }}
                            />
                        )}
                        <span className="relative z-10">{getLabel(category)}</span>
                    </button>
                ))}
            </div>

            {/* Tech Filter Dropdown */}
            <div className="flex justify-center">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "rounded-full border-forest-200 px-6 h-10 transition-all",
                                activeTech !== "All Tech"
                                    ? "bg-lime-50 border-lime-200 text-lime-700 hover:bg-lime-100"
                                    : "bg-white text-forest-600 hover:bg-forest-50"
                            )}
                        >
                            <span className="mr-2">Tech: {activeTech}</span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="center"
                        className="w-56 max-h-[300px] overflow-y-auto bg-white/90 backdrop-blur-md border-forest-100 p-2 rounded-xl shadow-xl"
                        sideOffset={8}
                    >
                        {technologies.map((tech) => (
                            <DropdownMenuItem
                                key={tech}
                                onClick={() => onTechChange(tech)}
                                className={cn(
                                    "rounded-lg cursor-pointer focus:bg-forest-50 focus:text-forest-900",
                                    activeTech === tech && "bg-lime-50 text-lime-700 font-medium"
                                )}
                            >
                                {tech}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
