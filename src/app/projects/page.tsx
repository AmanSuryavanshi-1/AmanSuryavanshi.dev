"use client";

import { useState } from "react";
import FeaturedHero from "@/components/projects/FeaturedHero";
import ProjectSummary from "@/components/projects/ProjectSummary";
import { projects } from "@/components/projects/projectsData";

export default function ProjectsPage() {
    // Filter only featured projects as per user request
    const featuredProjects = projects.filter(p => p.featured);

    // State for infinite carousel
    const [virtualIndex, setVirtualIndex] = useState(featuredProjects.length * 100);
    const activeIndex = ((virtualIndex % featuredProjects.length) + featuredProjects.length) % featuredProjects.length;

    return (
        <main className="min-h-screen bg-transparent text-forest-900 relative selection:bg-lime-500/30 pt-16">
            <div className="relative z-10">

                {/* Featured Hero Section - Controlled Component */}
                <FeaturedHero
                    projects={featuredProjects}
                    activeIndex={activeIndex}
                    virtualIndex={virtualIndex}
                    onVirtualIndexChange={setVirtualIndex}
                />

                {/* Project Summary Section - Syncs with Hero */}
                {featuredProjects.length > 0 && (
                    <ProjectSummary project={featuredProjects[activeIndex]} />
                )}
            </div>
        </main>
    );
}
