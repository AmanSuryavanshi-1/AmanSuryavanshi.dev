"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/data/portfolio";
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
            return "bg-lime-500/20 text-lime-700 border-lime-500/30";
        case "Production":
            return "bg-emerald-500/20 text-emerald-700 border-emerald-500/30";
        case "Advanced":
            return "bg-sky-500/20 text-sky-700 border-sky-500/30";
        default:
            return "bg-amber-500/20 text-amber-700 border-amber-500/30";
    }
};

const SkillsShowcase = () => {
    const { landingSkills } = portfolioData;

    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-forest-50 via-sage-50 to-lime-50">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-lime-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-forest-900/5 rounded-full blur-3xl" />
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-lime-500/5 to-transparent rounded-full" />
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-lime-500 text-forest-900 px-4 py-1.5 text-sm font-medium">
                        Solution Architect Stack
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">
                        <span className="text-forest-900">Technical </span>
                        <span className="text-lime-500">Expertise</span>
                    </h2>
                    <p className="text-forest-700 max-w-2xl mx-auto text-lg">
                        Production-proven skills across AI automation, modern frontend, and scalable backends
                    </p>
                </motion.div>

                {/* Skills Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {landingSkills.categories.map((category, categoryIndex) => {
                        const CategoryIcon = getCategoryIcon(category.title);

                        return (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: categoryIndex * 0.15 }}
                                className="group"
                            >
                                <div className="h-full p-6 md:p-8 rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-sage-100 
                                              hover:border-lime-500/50 hover:shadow-xl hover:shadow-lime-500/10 
                                              transition-all duration-500 relative overflow-hidden">

                                    {/* Category Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-forest-900 to-forest-800 
                                                      group-hover:from-lime-500 group-hover:to-lime-600 transition-all duration-500">
                                            <CategoryIcon className="w-6 h-6 text-sage-100" />
                                        </div>
                                        <h3 className="text-xl font-bold text-forest-900 leading-tight">
                                            {category.title}
                                        </h3>
                                    </div>

                                    {/* Skills List */}
                                    <div className="space-y-4">
                                        {category.skills.map((skill, skillIndex) => (
                                            <motion.div
                                                key={skill.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: categoryIndex * 0.15 + skillIndex * 0.1 }}
                                                className="group/skill"
                                            >
                                                <div className="p-4 rounded-xl bg-forest-50/50 hover:bg-lime-50/50 
                                                              border border-transparent hover:border-lime-200 
                                                              transition-all duration-300">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h4 className="font-semibold text-forest-900 text-sm md:text-base">
                                                            {skill.name}
                                                        </h4>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs font-medium shrink-0 ${getLevelColor(skill.level)}`}
                                                        >
                                                            {skill.level}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs md:text-sm text-forest-600 mb-2">
                                                        {skill.projects}
                                                    </p>

                                                    {/* Related Projects Links */}
                                                    {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {skill.relatedProjects.map((project, idx) => (
                                                                <Link
                                                                    key={idx}
                                                                    href={project.url}
                                                                    className="inline-flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-lime-600 
                                                                             bg-white/80 hover:bg-lime-50 px-2 py-1 rounded-md border border-forest-100 
                                                                             hover:border-lime-200 transition-all"
                                                                >
                                                                    <span>{project.title}</span>
                                                                    <ExternalLink className="w-2.5 h-2.5" />
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Decorative gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500/0 to-lime-500/5 
                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
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
                    className="mt-12 flex flex-wrap justify-center gap-3"
                >
                    {landingSkills.keywords.map((keyword) => (
                        <span
                            key={keyword}
                            className="text-xs text-forest-500 px-3 py-1.5 rounded-full bg-forest-50/50 border border-forest-100"
                        >
                            {keyword}
                        </span>
                    ))}
                </motion.div>

                {/* Browse All Skills Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <Link href="/about#skills">
                        <Button
                            size="lg"
                            className="rounded-full bg-forest-900 text-white hover:bg-forest-800 
                                     shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all px-8"
                        >
                            Browse Complete Skills Arsenal
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default SkillsShowcase;
