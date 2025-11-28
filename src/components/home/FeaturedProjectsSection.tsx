"use client";

import { useState } from "react";
import FeaturedHero from "@/components/projects/FeaturedHero";
import { projects } from "@/components/projects/projectsData";
import { ArrowRight, MessageSquare } from "lucide-react";
import { SolidButton } from "@/components/solid-button";
import { TransparentButton } from "@/components/transparent-button";

export default function FeaturedProjectsSection() {
    // Filter only featured projects
    const featuredProjects = projects.filter(p => p.featured);

    // State for infinite carousel
    const [virtualIndex, setVirtualIndex] = useState(featuredProjects.length * 100);
    const activeIndex = ((virtualIndex % featuredProjects.length) + featuredProjects.length) % featuredProjects.length;

    return (
        <section id="projects" className="relative z-10 py-12 lg:py-20 bg-forest-50/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center mb-8 lg:mb-12 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4 tracking-tight">
                        <span className="text-forest-900">Featured </span>
                        <span className="text-lime-500">Projects</span>
                    </h2>
                    <p className="text-forest-600 max-w-2xl text-lg">
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
                        label="Explore More"
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
