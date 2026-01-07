"use client";

import { useState, useMemo, useEffect } from "react";
import { portfolioData } from "@/data/portfolio";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsFilter from "@/components/projects/ProjectsFilter";
import { motion } from "framer-motion";

import { ImageGalleryProvider } from "@/context/ImageGalleryContext";
import Lightbox from "@/components/ui/Lightbox";

// Custom project order priority
const PROJECT_ORDER: Record<string, number> = {
    "aviators-training-centre": 1,
    "n8n-automation-suite": 2,
    "n8n-github-backup": 3,
    "barkat-enterprise": 4,
    "av-newsstream": 5,
    "foodah": 6,
    "portfolio-website": 7,
    "ecommerce-platform": 8,
};

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeTech, setActiveTech] = useState("All Tech");

    // Sort projects once by custom order
    const sortedProjects = useMemo(() => {
        return [...portfolioData.projects].sort((a, b) => {
            const orderA = PROJECT_ORDER[a.id] ?? 999;
            const orderB = PROJECT_ORDER[b.id] ?? 999;
            return orderA - orderB;
        });
    }, []);

    // Define professional category labels
    const categoryLabels: Record<string, string> = {
        "All": "All",
        "featured": "Featured",
        "web": "Web Apps",
        "automation": "AI & Automation",
    };

    // Extract unique categories dynamically from projects
    const categories = useMemo(() => {
        const cats = new Set(sortedProjects.map(p => p.category));
        return ["All", ...Array.from(cats).filter(cat => categoryLabels[cat])];
    }, [sortedProjects]);

    const technologies = useMemo(() => {
        const techs = new Set(sortedProjects.flatMap(p => p.techStack));
        return ["All Tech", ...Array.from(techs).sort()];
    }, [sortedProjects]);

    // Filter projects
    const filteredProjects = useMemo(() => {
        return sortedProjects.filter(project => {
            const matchesCategory = activeCategory === "All" || project.category === activeCategory;
            const matchesTech = activeTech === "All Tech" || project.techStack.includes(activeTech);
            return matchesCategory && matchesTech;
        });
    }, [activeCategory, activeTech, sortedProjects]);

    // Scroll to hash target on page load
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Small delay to ensure DOM is rendered
            const timeoutId = setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                    // Add highlight effect
                    element.classList.add("ring-2", "ring-lime-500", "ring-offset-4");
                    setTimeout(() => {
                        element.classList.remove("ring-2", "ring-lime-500", "ring-offset-4");
                    }, 2000);
                }
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, []);

    return (
        <ImageGalleryProvider>
            <Lightbox />
            <main className="min-h-screen bg-[#D3E6BB] dark:bg-[#0a1f15] text-forest-900 dark:text-sage-100 pt-24 pb-20 transition-colors duration-300">
                <div className="container mx-auto px-4">

                    {/* Page Header */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight"
                        >
                            <span className="text-forest-900 dark:text-sage-100">All </span>
                            <span className="text-lime-500 dark:text-lime-400">Projects</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-forest-600 dark:text-sage-300 max-w-2xl mx-auto text-lg"
                        >
                            A comprehensive archive of my work in web development, automation, and design.
                        </motion.p>
                    </div>

                    {/* Filters */}
                    <ProjectsFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        technologies={technologies}
                        activeTech={activeTech}
                        onTechChange={setActiveTech}
                    />

                    {/* Projects List */}
                    <div className="space-y-12 md:space-y-20 max-w-6xl mx-auto">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-xl text-forest-500 dark:text-sage-400">No projects found matching your criteria.</p>
                                <button
                                    onClick={() => { setActiveCategory("All"); setActiveTech("All Tech"); }}
                                    className="mt-4 text-lime-600 dark:text-lime-400 hover:underline font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </ImageGalleryProvider>
    );
}
