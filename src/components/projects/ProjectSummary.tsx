"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/components/projects/projectsData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Code2, Lightbulb, Rocket, Target } from "lucide-react";

interface ProjectSummaryProps {
    project: Project;
}

export default function ProjectSummary({ project }: ProjectSummaryProps) {
    return (
        <section className="w-full py-12 md:py-20 bg-transparent text-forest-900 overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-16"
                    >
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-forest-200 pb-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-2 flex items-center gap-3">
                                    {project.title}
                                    <Badge variant="outline" className="border-forest-200 text-forest-600 bg-forest-50">
                                        {project.category}
                                    </Badge>
                                </h2>
                                <p className="text-forest-700 text-lg max-w-2xl">
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech Stack Row */}
                            <div className="flex flex-wrap gap-3 justify-start md:justify-end max-w-xl">
                                {project.technologies.map((tech) => (
                                    <div
                                        key={tech.name}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-forest-100 text-sm text-forest-600 hover:border-forest-300 transition-colors shadow-sm"
                                    >
                                        <tech.icon className="w-4 h-4 text-forest-500" />
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Core Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Problem */}
                            <div className="bg-white p-8 rounded-3xl border border-forest-100 hover:border-forest-300 transition-all group shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Target className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-forest-900 mb-4">The Challenge</h3>
                                <p className="text-forest-700 leading-relaxed">
                                    {project.problem || "Identifying the core user pain points and technical constraints was the first step in this journey."}
                                </p>
                            </div>

                            {/* Solution */}
                            <div className="bg-white p-8 rounded-3xl border border-forest-100 hover:border-forest-300 transition-all group shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Lightbulb className="w-6 h-6 text-lime-600" />
                                </div>
                                <h3 className="text-xl font-bold text-forest-900 mb-4">The Solution</h3>
                                <p className="text-forest-700 leading-relaxed">
                                    {project.solution || "Leveraging modern technologies to build a robust, scalable, and user-centric solution."}
                                </p>
                            </div>

                            {/* Impact */}
                            <div className="bg-white p-8 rounded-3xl border border-forest-100 hover:border-forest-300 transition-all group shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Rocket className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-forest-900 mb-4">The Impact</h3>
                                <p className="text-forest-700 leading-relaxed">
                                    {project.impact || "Delivering measurable results and improving the overall user experience significantly."}
                                </p>
                            </div>
                        </div>

                        {/* Impact Metrics */}
                        {project.impactMetrics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {project.impactMetrics.map((metric, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-forest-100 text-center shadow-sm">
                                        <div className="text-3xl font-bold text-forest-800 mb-1">{metric.value}</div>
                                        <div className="text-sm text-forest-500 uppercase tracking-wider">{metric.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Detailed Description / Technical Deep Dive */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-forest-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Code2 className="w-6 h-6 text-forest-500" />
                                <h3 className="text-2xl font-bold text-forest-900">Technical Overview</h3>
                            </div>
                            <div className="prose prose-forest max-w-none text-forest-700">
                                <p className="text-lg leading-relaxed">
                                    {project.detailedDescription || project.description}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
