"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, ChevronLeft, ChevronRight, BookOpen, FileText } from "lucide-react";
import { portfolioData, Project } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FallbackImageManager } from "@/lib/fallback-image-manager";

export default function FeaturedCarousel() {
    const featuredProjects = portfolioData.projects.filter((p) => p.featured);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
        }
    };

    return (
        <section className="relative py-12 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
                {/* <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-2"
                    >
                        Featured <span className="text-lime-500">Works</span>
                    </motion.h2>
                    <p className="text-sage-300 max-w-xl">
                        A selection of projects that define my journey and technical expertise.
                    </p>
                </div> */}

                <div className="hidden md:flex gap-2">
                    <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full border-forest-700 hover:bg-lime-500 hover:text-forest-950 hover:border-lime-500 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full border-forest-700 hover:bg-lime-500 hover:text-forest-950 hover:border-lime-500 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="pl-4 md:pl-[max(1rem,calc((100vw-1280px)/2+1rem))]">
                <motion.div
                    ref={carouselRef}
                    className="flex gap-6 overflow-x-auto pb-8 pr-8 snap-x snap-mandatory scrollbar-hide"
                    whileTap={{ cursor: "grabbing" }}
                >
                    {featuredProjects.map((project, index) => (
                        <FeaturedCard key={project.id} project={project} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered && videoRef.current) {
            videoRef.current.play();
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered]);

    return (
        <motion.div
            className="min-w-[90vw] md:min-w-[600px] lg:min-w-[700px] snap-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="relative h-[60vh] md:h-[500px] rounded-3xl overflow-hidden group border border-forest-800 bg-forest-900/50">
                {/* Background Media */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    {project.video ? (
                        <video
                            ref={videoRef}
                            src={project.video}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                        />
                    ) : (
                        <Image
                            src={project.image || FallbackImageManager.getRandomFallback().path}
                            alt={project.title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                        />
                    )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-10 pb-12 md:pb-16 flex flex-col justify-end">
                    <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-lime-500 text-forest-950 hover:bg-lime-400 font-bold px-3 py-1">
                                {project.category}
                            </Badge>
                            {project.impactMetrics && project.impactMetrics[0] && (
                                <Badge variant="outline" className="text-sage-100 border-sage-100/30 backdrop-blur-sm">
                                    {project.impactMetrics[0].label}: {project.impactMetrics[0].value}
                                </Badge>
                            )}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                            {project.title}
                        </h3>

                        <p className="text-sage-200 text-base md:text-lg mb-6 line-clamp-2 max-w-2xl group-hover:text-white transition-colors">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {project.technologies.slice(0, 5).map((tech) => (
                                <div key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-950/60 border border-forest-700/50 backdrop-blur-md">
                                    <tech.icon className="w-3.5 h-3.5 text-lime-400" />
                                    <span className="text-xs text-sage-200">{tech.name}</span>
                                </div>
                            ))}
                            {project.technologies.length > 5 && (
                                <div className="px-3 py-1.5 rounded-full bg-forest-950/60 border border-forest-700/50 backdrop-blur-md text-xs text-sage-200">
                                    +{project.technologies.length - 5} more
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Executive Summary - only if project has documentation */}
                            {project.documentation?.[0]?.url && (
                                <Link href={project.documentation[0].url}>
                                    <Button className="bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-full px-2.5 sm:px-5 text-xs sm:text-sm whitespace-nowrap" title="Executive Summary">
                                        <FileText className="w-4 h-4 sm:mr-1.5" />
                                        <span className="hidden sm:inline">Summary</span>
                                    </Button>
                                </Link>
                            )}
                            {/* Technical Docs - only if project has documentation with technical doc entry */}
                            {project.documentation?.[1]?.url && (
                                <Link href={project.documentation[1].url}>
                                    <Button variant="outline" className="border-sage-100/50 text-sage-100 hover:bg-sage-100/10 rounded-full px-2.5 sm:px-5 text-xs sm:text-sm whitespace-nowrap" title="Technical Documentation">
                                        <BookOpen className="w-4 h-4 sm:mr-1.5" />
                                        <span className="hidden xl:inline">Technical Docs</span>
                                        <span className="hidden sm:inline xl:hidden">Docs</span>
                                    </Button>
                                </Link>
                            )}
                            <div className="flex gap-1.5 sm:gap-2">
                                <Link href={project.links.live} target="_blank">
                                    <Button size="icon" variant="outline" className="rounded-full border-forest-600 bg-forest-950/30 hover:bg-lime-500 hover:text-forest-950 hover:border-lime-500 transition-colors w-8 h-8 sm:w-10 sm:h-10">
                                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Button>
                                </Link>
                                <Link href={project.links.github} target="_blank">
                                    <Button size="icon" variant="outline" className="rounded-full border-forest-600 bg-forest-950/30 hover:bg-lime-500 hover:text-forest-950 hover:border-lime-500 transition-colors w-8 h-8 sm:w-10 sm:h-10">
                                        <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
