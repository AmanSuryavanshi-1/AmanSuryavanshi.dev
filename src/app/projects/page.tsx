"use client";

import { useState, useMemo } from "react";
import { portfolioData } from "@/data/portfolio";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsFilter from "@/components/projects/ProjectsFilter";
import { motion } from "framer-motion";

import { ImageGalleryProvider } from "@/context/ImageGalleryContext";
import Lightbox from "@/components/ui/Lightbox";

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeTech, setActiveTech] = useState("All Tech");

    // Extract unique categories and technologies
    const categories = useMemo(() => {
        const cats = new Set(portfolioData.projects.map(p => p.category));
        return ["All", ...Array.from(cats)];
    }, []);

    const technologies = useMemo(() => {
        const techs = new Set(portfolioData.projects.flatMap(p => p.techStack));
        return ["All Tech", ...Array.from(techs).sort()];
    }, []);

    // Filter projects
    const filteredProjects = useMemo(() => {
        return portfolioData.projects.filter(project => {
            const matchesCategory = activeCategory === "All" || project.category === activeCategory;
            const matchesTech = activeTech === "All Tech" || project.techStack.includes(activeTech);
            return matchesCategory && matchesTech;
        });
    }, [activeCategory, activeTech]);

    return (
        <ImageGalleryProvider>
            <Lightbox />
            <main className="min-h-screen bg-forest-50/30 text-forest-900 pt-24 pb-20">
                <div className="container mx-auto px-4">

                    {/* Page Header */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight"
                        >
                            <span className="text-forest-900">All </span>
                            <span className="text-lime-500">Projects</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-forest-600 max-w-2xl mx-auto text-lg"
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
                                <p className="text-xl text-forest-500">No projects found matching your criteria.</p>
                                <button
                                    onClick={() => { setActiveCategory("All"); setActiveTech("All Tech"); }}
                                    className="mt-4 text-lime-600 hover:underline font-medium"
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
