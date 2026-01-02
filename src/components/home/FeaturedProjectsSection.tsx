"use client";

import { useState, useMemo } from "react";
import FeaturedHero from "@/components/projects/FeaturedHero";
import { portfolioData } from "@/data/portfolio";
import { ArrowRight, MessageSquare } from "lucide-react";
import { SolidButton } from "@/components/solid-button";
import { TransparentButton } from "@/components/transparent-button";

// Custom project order priority - same as /projects page
const PROJECT_ORDER: Record<string, number> = {
    "aviators-training-centre": 1,
    "n8n-automation-suite": 2,
    "barkat-enterprise": 3,
    "av-newsstream": 4,
    "foodah": 5,
    "portfolio-website": 6,
    "ecommerce-platform": 7,
};

export default function FeaturedProjectsSection() {
    // Filter and sort projects in custom order (showing ALL projects now)
    const featuredProjects = useMemo(() => {
        return portfolioData.projects
            // .filter(p => p.featured) // Removed filter to show all projects
            .sort((a, b) => {
                const orderA = PROJECT_ORDER[a.id] ?? 999;
                const orderB = PROJECT_ORDER[b.id] ?? 999;
                return orderA - orderB;
            });
    }, []);

    // State for infinite carousel
    const [virtualIndex, setVirtualIndex] = useState(featuredProjects.length * 100);
    const activeIndex = ((virtualIndex % featuredProjects.length) + featuredProjects.length) % featuredProjects.length;

    return (
        <section id="projects" className="relative z-10 section-padding">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center mb-12 lg:mb-16 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4 tracking-tight">
                        <span className="text-forest-900 dark:text-sage-100">Featured </span>
                        <span className="text-lime-500 dark:text-lime-400">Projects</span>
                    </h2>
                    <p className="text-forest-600 dark:text-sage-300 max-w-2xl text-lg">
                        A selection of my recent work in web development, automation, and design.
                    </p>
                </div>

                {/* Carousel */}
                <div className="mb-8">
                    <FeaturedHero
                        projects={featuredProjects}
                        activeIndex={activeIndex}
                        virtualIndex={virtualIndex}
                        onVirtualIndexChange={setVirtualIndex}
                        className="min-h-0 h-auto lg:h-auto"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <SolidButton
                        href="/projects"
                        icon={ArrowRight}
                        label="View All Projects"
                    />

                    <TransparentButton
                        href="#contact"
                        icon={MessageSquare}
                        label="Let's Work Together"
                    />
                </div>
            </div>
        </section>
    );
}
