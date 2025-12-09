'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Github, Globe, Calendar, BarChart3, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import MarkdownViewer from '@/components/docs/MarkdownViewer';
import { ImageGalleryProvider } from '@/context/ImageGalleryContext';
import Lightbox from '@/components/ui/Lightbox';
import { portfolioData, Project } from '@/data/portfolio';
import { Badge } from '@/components/ui/badge';
import { SolidButton } from '@/components/solid-button';
import { TransparentButton } from '@/components/transparent-button';

interface DocPageClientProps {
    title: string;
    content: string;
    slug: string;
    project?: Project;
}

export default function DocPageClient({ title, content, slug, project }: DocPageClientProps) {
    const router = useRouter();

    // If project wasn't passed (fallback), try to find it
    const currentProject = project || portfolioData.projects.find(p =>
        p.documentation?.some(doc => doc.url.includes(slug))
    );

    // Determine next project
    const currentProjectIndex = portfolioData.projects.findIndex(p => p.id === currentProject?.id);
    const nextProjectIndex = currentProjectIndex !== -1
        ? (currentProjectIndex + 1) % portfolioData.projects.length
        : 0;
    const nextProject = portfolioData.projects[nextProjectIndex];

    return (
        <ImageGalleryProvider>
            <Lightbox />
            <main className="min-h-screen bg-sage-50 text-forest-900 selection:bg-lime-200 selection:text-forest-900">
                {/* Progress Bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-lime-500 origin-left z-50"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ scaleX: 0 }} // Needs scroll hook, but keeping simple for now
                />

                {/* Hero Section */}
                {/* Hero Section */}
                <header className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-forest-900 min-h-[60vh] flex items-center justify-center">
                    {/* Background Image - Lighter Overlay */}
                    {currentProject?.image && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={currentProject.image}
                                alt={currentProject.title}
                                className="w-full h-full object-cover blur-[2px] scale-105"
                            />
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                        </div>
                    )}

                    <div className="max-w-5xl mx-auto relative z-10 w-full">
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => router.back()}
                            className="inline-flex items-center text-sm font-medium text-forest-900/80 hover:text-forest-900 transition-colors mb-8 group cursor-pointer bg-white/40 px-4 py-2 rounded-full border border-forest-900/10 hover:bg-white/60 backdrop-blur-md shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </motion.button>

                        {/* Glass Card Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center text-center max-w-4xl mx-auto bg-white/30 backdrop-blur-xl border border-white/40 p-10 md:p-14 rounded-3xl shadow-xl"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-wrap justify-center items-center gap-3 mb-6"
                            >
                                <Badge variant="outline" className="border-forest-900/20 text-forest-800 px-4 py-1.5 bg-white/50">
                                    Executive Summary
                                </Badge>
                                {currentProject?.featured && (
                                    <Badge className="bg-lime-500 text-forest-900 border-0 font-bold shadow-md">
                                        Featured Case Study
                                    </Badge>
                                )}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-forest-900 tracking-tight mb-6 leading-[1.1] drop-shadow-sm"
                            >
                                {currentProject?.title || title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl md:text-2xl text-forest-700 leading-relaxed max-w-3xl font-medium mb-10"
                            >
                                {currentProject?.tagLine || "A deep dive into the technical implementation and business impact."}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap justify-center gap-4 md:gap-6"
                            >
                                {currentProject?.liveUrl && (
                                    <SolidButton
                                        href={currentProject.liveUrl}
                                        label="View Live Site"
                                        icon={Globe}
                                        external={true}
                                    />
                                )}
                                {currentProject?.codeUrl && (
                                    <TransparentButton
                                        href={currentProject.codeUrl}
                                        label="View Code"
                                        icon={Github}
                                        external={true}
                                    />
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Main Content */}
                        <motion.div
                            className="lg:col-span-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="prose prose-lg prose-forest max-w-none">
                                <MarkdownViewer content={content} />
                            </div>

                            {/* Navigation Footer */}
                            <div className="mt-24 pt-12 border-t border-forest-100/50">
                                <h3 className="text-sm font-bold text-forest-400 uppercase tracking-widest mb-8">Continue Reading</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Technical Documentation Link - Only show if blogUrl exists */}
                                    {currentProject?.blogUrl && (
                                        <Link href={currentProject.blogUrl} className="block h-full">
                                            <div className="group h-full p-8 rounded-3xl bg-white border border-forest-100 hover:border-lime-200 hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-center gap-3 mb-4 text-forest-400 group-hover:text-lime-600 transition-colors">
                                                    <BookOpen className="w-6 h-6" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Deep Dive</span>
                                                </div>
                                                <h4 className="text-xl font-bold text-forest-900 mb-2 font-serif">Technical Documentation</h4>
                                                <p className="text-forest-500 text-sm mb-6">Architectural decisions, code walkthrough & API specs.</p>
                                                <div className="flex items-center text-lime-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                                    Read Full Documentation <ArrowRight className="w-4 h-4 ml-2" />
                                                </div>
                                            </div>
                                        </Link>
                                    )}

                                    {/* Next Project Link */}
                                    {nextProject && (
                                        <Link href={nextProject.documentation?.[0]?.url || nextProject.blogUrl || '/projects'} className="block h-full">
                                            <div className="group h-full p-8 rounded-3xl bg-forest-900 text-white relative overflow-hidden hover:shadow-xl transition-all duration-300">
                                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <ArrowRight className="w-32 h-32 -mr-8 -mt-8" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-4 text-lime-400">
                                                        <span className="text-xs font-bold uppercase tracking-wider">Next Project</span>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-lime-300 transition-colors">
                                                        {nextProject.title}
                                                    </h4>
                                                    <p className="text-forest-300 text-sm mb-6 line-clamp-2">
                                                        {nextProject.shortDescription}
                                                    </p>
                                                    <div className="flex items-center text-lime-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                                        Read Summary <ArrowRight className="w-4 h-4 ml-2" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            <div className="sticky top-32 space-y-8">
                                {/* Project Stats */}
                                {currentProject?.metrics && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg shadow-forest-900/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500 to-forest-500" />
                                        <h3 className="text-lg font-bold text-forest-900 mb-6 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-lime-600" />
                                            Impact Metrics
                                        </h3>
                                        <div className="space-y-6">
                                            {Object.entries(currentProject.metrics).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between border-b border-forest-50 pb-4 last:border-0 last:pb-0">
                                                    <span className="text-sm text-forest-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span className="text-lg font-bold text-forest-900 font-serif">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Tech Stack */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg shadow-forest-900/5"
                                >
                                    <h3 className="text-lg font-bold text-forest-900 mb-6 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-lime-600" />
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentProject?.techStack.map((tech) => (
                                            <span key={tech} className="px-3 py-1.5 rounded-lg bg-forest-50 text-forest-700 text-xs font-semibold border border-forest-100/50">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Project Info */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-forest-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                                        <Zap className="w-5 h-5 text-lime-400" />
                                        Project Info
                                    </h3>

                                    <div className="space-y-4 relative z-10">
                                        <div>
                                            <div className="text-xs text-forest-400 uppercase tracking-wider mb-1">Role</div>
                                            <div className="font-medium">Full-Stack Developer & Automation Engineer</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-forest-400 uppercase tracking-wider mb-1">Timeline</div>
                                            <div className="font-medium">3 Months (Production)</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-forest-400 uppercase tracking-wider mb-1">Type</div>
                                            <div className="font-medium capitalize">{currentProject?.type}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </ImageGalleryProvider>
    );
}
