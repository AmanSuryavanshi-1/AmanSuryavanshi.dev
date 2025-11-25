"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Project } from "@/components/projects/projectsData";
import ImpactMetrics from "./ImpactMetrics";
import TechnicalDeepDive from "./TechnicalDeepDive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectDetailCardProps {
    project: Project;
    index: number;
}

export default function ProjectDetailCard({ project, index }: ProjectDetailCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-forest-900/30 border border-forest-700/50 rounded-2xl overflow-hidden hover:border-lime-500/30 transition-all duration-300 flex flex-col h-full"
        >
            {/* Header Image/Video */}
            <div className="relative aspect-video w-full overflow-hidden bg-forest-950">
                {project.video ? (
                    <video
                        src={project.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <Image
                        src={project.image || "/placeholder.png"}
                        alt={project.title}
                        fill
                        className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700"
                    />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/50 to-transparent" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-lime-500/20 text-lime-400 border-lime-500/30 backdrop-blur-md uppercase tracking-wider text-xs font-bold">
                        {project.category}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8 relative flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">
                            {project.title}
                        </h2>
                        <p className="text-sage-300 text-base leading-relaxed max-w-2xl">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex gap-3 shrink-0 self-start md:self-auto">
                        {project.links.github && (
                            <Button size="icon" variant="outline" className="rounded-full border-forest-600 hover:border-lime-500 hover:text-lime-500 hover:bg-forest-900" asChild>
                                <Link href={project.links.github} target="_blank">
                                    <Github className="w-5 h-5" />
                                </Link>
                            </Button>
                        )}
                        {project.links.live && (
                            <Button size="icon" variant="outline" className="rounded-full border-forest-600 hover:border-lime-500 hover:text-lime-500 hover:bg-forest-900" asChild>
                                <Link href={project.links.live} target="_blank">
                                    <ExternalLink className="w-5 h-5" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Problem - Solution - Impact Grid */}
                {(project.problem || project.solution || project.impact) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {project.problem && (
                            <div className="p-4 rounded-xl bg-forest-950/50 border border-forest-800/50">
                                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">The Problem</h4>
                                <p className="text-sage-300 text-sm leading-relaxed">{project.problem}</p>
                            </div>
                        )}
                        {project.solution && (
                            <div className="p-4 rounded-xl bg-forest-950/50 border border-forest-800/50">
                                <h4 className="text-xs font-bold text-lime-500 uppercase tracking-wider mb-2">The Solution</h4>
                                <p className="text-sage-300 text-sm leading-relaxed">{project.solution}</p>
                            </div>
                        )}
                        {project.impact && (
                            <div className="p-4 rounded-xl bg-forest-950/50 border border-forest-800/50">
                                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">The Impact</h4>
                                <p className="text-sage-300 text-sm leading-relaxed">{project.impact}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Testimonial */}
                {project.testimonial && (
                    <div className="mb-8 relative">
                        <div className="absolute -top-6 -left-4 text-6xl text-lime-500/20 font-serif select-none">"</div>
                        <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-br from-lime-500/10 to-transparent border border-lime-500/20 backdrop-blur-sm">
                            <blockquote className="text-sage-100 text-lg italic text-center leading-relaxed">
                                {project.testimonial.quote}
                            </blockquote>
                            <div className="mt-4 flex items-center justify-center gap-3">
                                <div className="h-px w-8 bg-lime-500/30" />
                                <cite className="text-lime-400 not-italic font-semibold text-sm tracking-wide uppercase">
                                    {project.testimonial.author}
                                </cite>
                                <div className="h-px w-8 bg-lime-500/30" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Impact Metrics */}
                {project.impactMetrics && <ImpactMetrics metrics={project.impactMetrics} />}

                {/* Tech Stack */}
                <div className="mt-auto mb-6">
                    <h4 className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, isExpanded ? undefined : 8).map((tech) => (
                            <div
                                key={tech.name}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-900/50 border border-forest-700 text-sage-200 text-xs hover:border-lime-500/50 transition-colors"
                            >
                                <tech.icon className="w-3.5 h-3.5 text-lime-500" />
                                <span>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deep Dive Toggle */}
                {project.detailedDescription && (
                    <div className="flex justify-center mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-sage-300 hover:text-lime-500 hover:bg-forest-900/50 text-sm"
                        >
                            {isExpanded ? "Hide Technical Details" : "View Technical Deep Dive"}
                            {isExpanded ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
                        </Button>
                    </div>
                )}

                {/* Expandable Content */}
                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <TechnicalDeepDive project={project} />
                </motion.div>

            </div>
        </motion.div>
    );
}
