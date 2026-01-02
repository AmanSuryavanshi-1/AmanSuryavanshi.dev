"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Github, ChevronLeft, ChevronRight, BookOpen, FileText } from "lucide-react";
import { Project } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

interface FeaturedHeroProps {
    projects: Project[];
    activeIndex: number;
    virtualIndex: number;
    onVirtualIndexChange: (index: number) => void;
    className?: string;
}

export default function FeaturedHero({ projects, activeIndex, virtualIndex, onVirtualIndexChange, className }: FeaturedHeroProps) {
    const activeProject = projects[activeIndex];

    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-play video when active project changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    }, [activeIndex]);

    const nextProject = () => {
        onVirtualIndexChange(virtualIndex + 1);
    };

    const prevProject = () => {
        onVirtualIndexChange(virtualIndex - 1);
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextProject();
            if (e.key === "ArrowLeft") prevProject();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [virtualIndex, onVirtualIndexChange]); // Added dependencies

    // Handle direct navigation from "fast forward" click
    const handleJumpTo = (targetVirtualIndex: number) => {
        onVirtualIndexChange(targetVirtualIndex);
    };

    // Card width (w-28 = 7rem = 112px) + Gap (gap-4 = 1rem = 16px) = 128px
    const CARD_WIDTH = 112;
    const GAP = 16;
    const STEP = CARD_WIDTH + GAP;

    if (!activeProject) return null;

    // Generate visible indices: [virtualIndex + 7, ..., virtualIndex]
    // This puts virtualIndex (Active) at the end (Right).
    const VISIBLE_COUNT = 8;
    const visibleIndices = Array.from({ length: VISIBLE_COUNT }, (_, i) => virtualIndex + VISIBLE_COUNT - 1 - i);

    return (
        <section className={cn("relative w-full min-h-screen lg:h-[100vh] overflow-visible", className)} aria-label="Featured Projects Carousel">
            <div className="container mx-auto px-4 h-auto flex flex-col lg:flex-row gap-4 lg:gap-0">

                {/* LEFT COLUMN (Details & Thumbnails) - Order 2 on Mobile, Order 1 on Desktop */}
                <div className="w-full lg:w-[50%] flex flex-col justify-end lg:justify-start lg:gap-2 h-auto lg:h-full order-2 lg:order-1 relative z-20 pointer-events-none">

                    {/* TOP: Thumbnail Strip (Hidden on Mobile) */}
                    <div className="hidden lg:flex relative w-[120%] mr-[20%] h-[160px] items-center justify-end pointer-events-auto pl-4 flex-shrink-0">

                        {/* Navigation Buttons */}
                        <div className="absolute left-0 z-30 flex gap-2 top-1/2 -translate-y-1/2">
                            <button
                                onClick={prevProject}
                                className="w-8 h-8 rounded-full bg-white dark:bg-forest-800 border border-forest-100 dark:border-forest-600 text-forest-900 dark:text-sage-100 flex items-center justify-center hover:bg-forest-900 hover:text-white dark:hover:bg-lime-500 dark:hover:text-forest-950 transition-all shadow-lg backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Strip Container */}
                        <div className="absolute right-3 flex items-center h-full">
                            <div className="flex gap-10">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {visibleIndices.map((idx) => {
                                        const projectIndex = ((idx % projects.length) + projects.length) % projects.length;
                                        const project = projects[projectIndex];
                                        const isActive = idx === virtualIndex;

                                        return (
                                            <motion.button
                                                layout
                                                key={idx} // Use the virtual index as key to maintain identity during shifts
                                                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                    scale: isActive ? 1.1 : 1,
                                                    zIndex: isActive ? 10 : 0,
                                                    boxShadow: isActive
                                                        ? "0 0 20px rgba(34, 197, 94, 0.3)"
                                                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                                                }}
                                                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                onClick={() => handleJumpTo(idx)}
                                                className={cn(
                                                    "relative flex-shrink-0 w-28 h-28 rounded-[1.5rem] overflow-hidden transition-all duration-300",
                                                    isActive
                                                        ? "p-[3px]" // Padding for the border width
                                                        : "bg-white opacity-70 hover:opacity-100 hover:scale-105 grayscale hover:grayscale-0"
                                                )}
                                            >
                                                {/* Snake Border Animation (Only for Active) */}
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute inset-[-150%]"
                                                        style={{
                                                            background: "conic-gradient(from 0deg, transparent 0deg, transparent 340deg, #4c7f00ff 360deg)", // Lime-500
                                                        }}
                                                        animate={{ rotate: 360 }}
                                                        transition={{
                                                            duration: 4,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                    />
                                                )}

                                                {/* Inner Content Container (Masks the center) */}
                                                <div className={cn(
                                                    "relative w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden bg-white",
                                                    !isActive && "rounded-[1.5rem]"
                                                )}>
                                                    <Image
                                                        src={project.image || "/placeholder.png"}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM: Project Details */}
                    <div className="flex flex-col justify-start lg:justify-end pb-8 pl-2 pointer-events-auto lg:pr-12 pr-0 mt-4 lg:mt-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <Badge className="bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-950 px-3 py-1 text-xs rounded-full border-none capitalize">
                                        {activeProject.category}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-forest-600 dark:text-sage-300 text-xs font-medium bg-white dark:bg-forest-800 px-3 py-1 rounded-full border border-forest-100 dark:border-forest-600 shadow-sm">
                                        <span>0{activeIndex + 1}</span>
                                        <span className="w-[1.5px] h-3 bg-forest-950/80 dark:bg-sage-400" />
                                        <span>0{projects.length}</span>
                                    </div>
                                </div>

                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-forest-900 dark:text-sage-100 mb-4 leading-[1.1] lg:leading-[0.9] tracking-tight">
                                    {activeProject.title}
                                </h1>

                                <p className="text-forest-600 dark:text-sage-300 text-base leading-relaxed mb-4 max-w-lg font-medium">
                                    {activeProject.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {activeProject.technologies.slice(0, 5).map((tech) => (
                                        <div key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-forest-800 border border-forest-100 dark:border-forest-600 text-xs text-forest-700 dark:text-sage-300 shadow-sm font-medium">
                                            <tech.icon className="w-3.5 h-3.5 text-forest-500 dark:text-lime-400" />
                                            <span>{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT COLUMN (Media) - Order 1 on Mobile, Order 2 on Desktop */}
                <div className="w-full lg:w-[50%] h-auto aspect-[4/3] lg:h-full order-1 lg:order-2 relative z-10 ml-0 lg:-ml-4 mt-0 lg:mt-0">
                    {/* Enhanced Animated Glow Effect - Multiple Layers for Depth */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-forest-600/40 via-forest-400/50 to-forest-600/40 rounded-[2rem] blur-2xl animate-pulse" />
                    <div className="absolute -inset-1.5 bg-gradient-to-br from-white/30 via-forest-200/40 to-white/30 rounded-[1.85rem] blur-md" />
                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden border-2 border-forest-200/60 bg-forest-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative group ring-1 ring-forest-300/50 hover:ring-forest-400/70 transition-all duration-500">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0"
                            >
                                {activeProject.videoYouTubeId ? (
                                    <YouTubeEmbed
                                        videoId={activeProject.videoYouTubeId}
                                        title={activeProject.title}
                                        poster={activeProject.image}
                                        autoplay={true}
                                        muted={true}
                                        loop={true}
                                        controls={false}
                                        autoplayOnViewport={true}
                                        className="w-full h-full"
                                    />
                                ) : activeProject.video ? (
                                    <video
                                        ref={videoRef}
                                        src={activeProject.video}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Image
                                        src={activeProject.image || "/placeholder.png"}
                                        alt={activeProject.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                {/* Gradient for controls readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent" />

                                {/* Premium Featured Badge with Animated Indicator - Only for featured projects */}
                                {activeProject.featured && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="relative group/badge">
                                            {/* Glow behind badge */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-forest-500 via-forest-400 to-forest-600 rounded-full blur-sm opacity-60 group-hover/badge:opacity-80 transition-opacity" />
                                            {/* Badge itself */}
                                            <div className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-forest-800 via-forest-700 to-forest-800 border border-forest-500/50 shadow-xl">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
                                                </span>
                                                <span className="text-xs font-bold uppercase tracking-widest text-white">Featured</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Bottom Controls Overlay - Clean Minimal Design */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 z-20">
                            {/* Single row container - wraps on mobile only */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-3">
                                {/* Action Links - Primary */}
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                    {/* Executive Summary - find by title containing 'summary' or 'executive' */}
                                    {(() => {
                                        const summaryDoc = activeProject.documentation?.find(d =>
                                            d.title.toLowerCase().includes('summary') ||
                                            d.title.toLowerCase().includes('executive')
                                        );
                                        return summaryDoc?.url ? (
                                            <Link href={summaryDoc.url}>
                                                <Button className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 rounded-full bg-white text-forest-900 font-semibold shadow-lg transition-all hover:bg-forest-100 hover:text-forest-950 hover:scale-105 hover:shadow-xl text-[10px] sm:text-xs lg:text-sm" title="Executive Summary">
                                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1 lg:mr-1.5" />
                                                    <span className="hidden sm:inline">Summary</span>
                                                </Button>
                                            </Link>
                                        ) : null;
                                    })()}
                                    {/* Technical Docs - find by title containing 'technical' or 'documentation' */}
                                    {(() => {
                                        const techDoc = activeProject.documentation?.find(d =>
                                            d.title.toLowerCase().includes('technical') ||
                                            (d.title.toLowerCase().includes('documentation') && !d.title.toLowerCase().includes('summary'))
                                        );
                                        return techDoc?.url ? (
                                            <Link href={techDoc.url}>
                                                <Button variant="outline" className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 rounded-full border-white/50 bg-white/10 text-white hover:bg-white hover:text-forest-900 font-medium backdrop-blur-md shadow-lg transition-all hover:scale-105 text-[10px] sm:text-xs lg:text-sm" title="Technical Documentation">
                                                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1 lg:mr-1.5" />
                                                    <span className="hidden xl:inline">Technical Docs</span>
                                                    <span className="hidden sm:inline xl:hidden">Docs</span>
                                                </Button>
                                            </Link>
                                        ) : null;
                                    })()}
                                    {/* Icon buttons - Live & GitHub */}
                                    <Link href={activeProject.links.live} target="_blank">
                                        <Button variant="outline" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full border-white/40 bg-white/10 hover:bg-white hover:text-forest-900 text-white backdrop-blur-md transition-all hover:scale-110 p-0">
                                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </Button>
                                    </Link>
                                    <Link href={activeProject.links.github} target="_blank">
                                        <Button variant="outline" className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full border-white/40 bg-white/10 hover:bg-white hover:text-forest-900 text-white backdrop-blur-md transition-all hover:scale-110 p-0">
                                            <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Navigation - Compact pill */}
                                <div className="flex items-center gap-0.5 sm:gap-1 bg-white/10 backdrop-blur-md rounded-full p-0.5 sm:p-1 border border-white/20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={prevProject}
                                        className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-full hover:bg-white hover:text-forest-900 text-white transition-all"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </Button>
                                    <span className="text-white/60 text-[10px] sm:text-xs font-medium px-0.5 sm:px-1">
                                        {activeIndex + 1}/{projects.length}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={nextProject}
                                        className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-full hover:bg-white hover:text-forest-900 text-white transition-all"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
