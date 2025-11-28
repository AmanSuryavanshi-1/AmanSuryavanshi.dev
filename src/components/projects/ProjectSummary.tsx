"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/components/projects/projectsData";
import { ArrowUpRight, Code2, Lightbulb, Rocket, Target, Layers, Zap, FileJson } from "lucide-react";
import Image from "next/image";

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
                        className="flex flex-col gap-12"
                    >
                        {/* Challenge & Solution Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Challenge */}
                            <div className="bg-white p-8 rounded-3xl border border-forest-100 hover:border-forest-300 transition-all group shadow-sm hover:shadow-md h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Target className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-forest-900">The Challenge</h3>
                                </div>
                                <p className="text-forest-700 leading-relaxed text-lg">
                                    {project.challenge || project.problem || "Identifying the core user pain points and technical constraints was the first step in this journey."}
                                </p>
                            </div>

                            {/* Solution */}
                            <div className="bg-white p-8 rounded-3xl border border-forest-100 hover:border-forest-300 transition-all group shadow-sm hover:shadow-md h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Lightbulb className="w-6 h-6 text-lime-600" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-forest-900">The Solution</h3>
                                </div>
                                <p className="text-forest-700 leading-relaxed text-lg">
                                    {project.solution || "Leveraging modern technologies to build a robust, scalable, and user-centric solution."}
                                </p>
                            </div>
                        </div>

                        {/* Technical Overview */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-forest-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                    <Code2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-forest-900">Technical Overview</h3>
                            </div>
                            <div className="prose prose-forest max-w-none text-forest-700">
                                <p className="text-lg leading-relaxed">
                                    {project.technicalOverview || project.detailedDescription || project.description}
                                </p>
                            </div>
                        </div>

                        {/* Documentation Section */}
                        {project.documentation && project.documentation.length > 0 && (
                            <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-forest-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                                        <FileJson className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-forest-900">Documentation</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.documentation.map((doc, idx) => (
                                        <a
                                            key={idx}
                                            href={doc.url}
                                            className="flex items-center justify-between p-4 rounded-xl border border-forest-100 hover:border-lime-500 hover:bg-lime-50/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center group-hover:bg-lime-100 transition-colors">
                                                    <FileJson className="w-5 h-5 text-forest-600 group-hover:text-lime-600" />
                                                </div>
                                                <span className="font-medium text-forest-900">{doc.title}</span>
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 text-forest-400 group-hover:text-lime-500 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Impact Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Impact Text */}
                            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-forest-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                                        <Rocket className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-forest-900">Key Impact</h3>
                                </div>
                                <ul className="space-y-4">
                                    {Array.isArray(project.impact) ? (
                                        project.impact.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-forest-700 text-lg">
                                                <Zap className="w-5 h-5 text-lime-500 mt-1 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-start gap-3 text-forest-700 text-lg">
                                            <Zap className="w-5 h-5 text-lime-500 mt-1 flex-shrink-0" />
                                            <span>{project.impact || "Delivering measurable results and improving the overall user experience significantly."}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Metrics Grid */}
                            <div className="lg:col-span-1 flex flex-col gap-4">
                                {project.impactMetrics && project.impactMetrics.map((metric, idx) => (
                                    <div key={idx} className="bg-forest-900 p-6 rounded-2xl text-center shadow-md flex-1 flex flex-col justify-center items-center group hover:scale-[1.02] transition-transform">
                                        <div className="text-3xl md:text-4xl font-bold text-lime-400 mb-2">{metric.value}</div>
                                        <div className="text-sm text-forest-200 uppercase tracking-wider font-medium">{metric.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Gallery (Placeholder for Carousel) */}
                        <div className="bg-white p-4 rounded-[2rem] border border-forest-100 shadow-sm overflow-hidden">
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden">
                                <Image
                                    src={project.imageUrl || project.image || "/placeholder.png"}
                                    alt={`${project.title} Gallery`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent flex items-end p-8">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                                        Project Gallery
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
