"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/data/portfolio";
import { SolidButton } from "@/components/solid-button";
import { Bot, Code2, Database, Sparkles, ExternalLink, ArrowRight } from "lucide-react";

const getCategoryIcon = (title: string) => {
    if (title.includes("AI") || title.includes("Automation")) return Bot;
    if (title.includes("Frontend")) return Code2;
    if (title.includes("Backend")) return Database;
    return Sparkles;
};

const getLevelColor = (level: string) => {
    switch (level) {
        case "Expert":
            return "bg-lime-500/10 text-lime-700 border-lime-500/20";
        case "Production":
            return "bg-forest-500/10 text-forest-700 border-forest-500/20";
        case "Advanced":
            return "bg-sky-500/10 text-sky-700 border-sky-500/20";
        default:
            return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    }
};

const SkillsShowcase = () => {
    const { landingSkills } = portfolioData;

    return (
        <section className="relative overflow-hidden py-8 lg:py-12">
            {/* Background Elements - Subtle/Transparent now */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[20%] -right-[5%] w-[500px] h-[500px] bg-forest-900/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-lime-500 bg-white/50 backdrop-blur-sm text-forest-900 px-4 py-1.5 text-sm font-medium">
                        Solution Architect Stack
                    </Badge>
                    <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4 tracking-tight">
                        <span className="text-forest-900">Technical </span>
                        <span className="text-lime-600">Expertise</span>
                    </h2>
                    <p className="text-forest-600 max-w-2xl mx-auto text-lg">
                        Production-proven skills across AI automation, modern frontend, and scalable backends
                    </p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {landingSkills.categories.map((category, categoryIndex) => {
                        const CategoryIcon = getCategoryIcon(category.title);

                        // Span logic for bento feel - AI/Automation takes larger space if possible, or just standard grid
                        // For this data structure, a uniform grid with nice cards works well as a "bento" feel

                        return (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                                className="group relative"
                            >
                                <div className="h-full p-6 lg:p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-white/60 shadow-lg shadow-forest-900/5 
                                              hover:bg-white/80 hover:shadow-xl hover:shadow-lime-500/10 hover:-translate-y-1
                                              transition-all duration-300 overflow-hidden flex flex-col">

                                    {/* Card Header */}
                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="p-3.5 rounded-2xl bg-forest-50 text-forest-900 group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                            <CategoryIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-forest-900">
                                            {category.title}
                                        </h3>
                                    </div>

                                    {/* Skills List */}
                                    <div className="space-y-4 flex-grow relative z-10 relative">
                                        {/* Vertical line connecting items */}
                                        <div className="absolute left-2.5 top-2 bottom-4 w-px bg-forest-900/5 group-hover:bg-lime-500/20 transition-colors duration-300" />

                                        {category.skills.map((skill, skillIndex) => (
                                            <div key={skill.name} className="relative pl-8">
                                                {/* Timeline dot */}
                                                <div className="absolute left-1.5 top-2 w-2 h-2 rounded-full bg-forest-200 group-hover:bg-lime-500 transition-colors duration-300 shadow-[0_0_0_3px_rgba(255,255,255,1)]" />

                                                <div className="flex items-baseline justify-between gap-2 mb-1">
                                                    <h4 className="font-semibold text-forest-800 text-sm group-hover:text-forest-900 transition-colors">
                                                        {skill.name}
                                                    </h4>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] px-2 py-0 h-5 border-transparent ${getLevelColor(skill.level)}`}
                                                    >
                                                        {skill.level}
                                                    </Badge>
                                                </div>

                                                {/* Related Projects - Compact */}
                                                {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2.5">
                                                        {skill.relatedProjects.map((project, idx) => (
                                                            <Link
                                                                key={idx}
                                                                href={project.url}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold
                                                                         bg-forest-50 border border-forest-100 text-forest-600 
                                                                         hover:bg-white hover:border-lime-500 hover:text-lime-600 hover:shadow-sm hover:-translate-y-0.5
                                                                         transition-all duration-200"
                                                            >
                                                                <span>{project.title}</span>
                                                                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Decorative Blur */}
                                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl group-hover:bg-lime-500/20 transition-all duration-500" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* SEO Keywords - Hidden visually but accessible for SEO */}
                <div className="sr-only" aria-hidden="true">
                    {landingSkills.keywords.map((keyword) => (
                        <span key={keyword}>{keyword}</span>
                    ))}
                </div>

                {/* Keywords Display - Subtle footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 flex flex-wrap justify-center gap-3 px-4"
                >
                    {landingSkills.keywords.map((keyword) => (
                        <span
                            key={keyword}
                            className="text-xs font-medium text-forest-500 px-3 py-1.5 rounded-full bg-white/40 border border-forest-900/5 hover:border-lime-500/30 hover:bg-white/60 transition-colors cursor-default"
                        >
                            {keyword}
                        </span>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 flex justify-center"
                >
                    <SolidButton
                        href="/about#skills"
                        label="Browse Complete Skills Arsenal"
                        icon={ArrowRight}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default SkillsShowcase;
