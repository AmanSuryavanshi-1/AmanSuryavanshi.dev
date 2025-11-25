"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/components/projects/projectsData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeaturedHeroProps {
    projects: Project[];
    activeIndex: number;
    virtualIndex: number;
    onVirtualIndexChange: (index: number) => void;
}

export default function FeaturedHero({ projects, activeIndex, virtualIndex, onVirtualIndexChange }: FeaturedHeroProps) {
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
        <section className="relative w-full h-[calc(100vh-6rem)] overflow-hidden py-2" aria-label="Featured Projects Carousel">
            <div className="container mx-auto px-4 h-full flex flex-col lg:flex-row">

                {/* LEFT COLUMN (50%) - Higher Z-Index for Overlap */}
                <div className="w-full lg:w-[50%] flex flex-col justify-between h-full order-2 lg:order-1 relative z-20 pointer-events-none">

                    {/* TOP: Thumbnail Strip (Right Aligned, Cut from Left, Overlapping Right Col) */}
                    <div className="relative w-[120%] -mr-[20%] h-[160px] flex items-center justify-end pointer-events-auto pl-4 overflow-hidden">

                        {/* Navigation Buttons */}
                        <div className="absolute left-4 z-30 flex gap-2 top-1/2 -translate-y-1/2">
                            <button
                                onClick={prevProject}
                                className="w-10 h-10 rounded-full bg-white border border-forest-100 text-forest-900 flex items-center justify-center hover:bg-forest-900 hover:text-white transition-all shadow-lg backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Strip Container */}
                        <div className="absolute right-8 flex items-center h-full">
                            <div className="flex gap-4">
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
                                                    zIndex: isActive ? 10 : 0
                                                }}
                                                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                onClick={() => handleJumpTo(idx)}
                                                className={cn(
                                                    "relative flex-shrink-0 w-28 h-28 rounded-[1.5rem] overflow-hidden shadow-lg bg-white transition-shadow duration-300",
                                                    isActive
                                                        ? "ring-4 ring-white shadow-2xl"
                                                        : "opacity-80 hover:opacity-100 hover:scale-105 grayscale hover:grayscale-0"
                                                )}
                                            >
                                                <Image
                                                    src={project.image || "/placeholder.png"}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* Active Indicator Overlay */}
                                                {isActive && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                                                        >
                                                            <div className="w-2.5 h-2.5 bg-forest-900 rounded-full" />
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM: Project Details */}
                    <div className="flex flex-col justify-end pb-8 pl-2 pointer-events-auto pr-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <Badge className="bg-forest-900 text-white px-3 py-1 text-xs rounded-full border-none">
                                        {activeProject.category}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-forest-600 text-xs font-medium bg-white px-3 py-1 rounded-full border border-forest-100 shadow-sm">
                                        <span>0{activeIndex + 1}</span>
                                        <span className="w-px h-3 bg-forest-300" />
                                        <span>0{projects.length}</span>
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold text-forest-900 mb-4 leading-[0.9] tracking-tight">
                                    {activeProject.title}
                                </h1>

                                <p className="text-forest-600 text-base leading-relaxed mb-6 max-w-lg font-medium">
                                    {activeProject.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {activeProject.technologies.slice(0, 5).map((tech) => (
                                        <div key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-forest-100 text-xs text-forest-700 shadow-sm font-medium">
                                            <tech.icon className="w-3.5 h-3.5 text-forest-500" />
                                            <span>{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT COLUMN (50%) - Main Media (Lower Z-Index) */}
                <div className="w-full lg:w-[50%] h-full order-1 lg:order-2 relative z-10 -ml-12 lg:-ml-4 mt-16 lg:mt-0">
                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden border border-forest-100 bg-forest-50 shadow-2xl relative group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject.id}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0"
                            >
                                {activeProject.video ? (
                                    <video
                                        ref={videoRef}
                                        src={activeProject.video}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent opacity-40" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Bottom Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between z-20">

                            {/* Action Links */}
                            <div className="flex gap-4">
                                <Link href={activeProject.links.live} target="_blank">
                                    <Button className="h-12 px-6 rounded-full bg-white hover:bg-forest-50 text-forest-900 font-bold shadow-xl transition-all hover:scale-105 text-base">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Live Demo
                                    </Button>
                                </Link>
                                <Link href={activeProject.links.github} target="_blank">
                                    <Button variant="outline" className="h-12 w-12 rounded-full border-white/30 bg-white/20 hover:bg-white hover:text-forest-900 text-white backdrop-blur-md transition-all p-0">
                                        <Github className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Navigation Arrows */}
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={prevProject}
                                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white hover:text-forest-900 border border-white/30 text-white backdrop-blur-md transition-all hover:scale-110"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={nextProject}
                                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white hover:text-forest-900 border border-white/30 text-white backdrop-blur-md transition-all hover:scale-110"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
