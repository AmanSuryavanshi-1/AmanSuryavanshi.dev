"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import ProjectMediaCarousel from "./ProjectMediaCarousel";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      id={project.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-full bg-white/50 dark:bg-[#162c22]/80 backdrop-blur-sm border border-forest-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-lime-500/50 dark:hover:border-lime-500/30 transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Media Section - Carousel */}
        <div className="w-full lg:w-2/5 relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden">
          <ProjectMediaCarousel project={project} className="w-full h-full" />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-xl md:text-2xl font-bold text-forest-900 dark:text-sage-100 font-serif">
                {project.title}
              </h2>
              <div className="h-px flex-1 bg-forest-100 dark:bg-forest-600 min-w-[50px]" />
              <div className="flex gap-2">
                {project.links.live && (
                  <Link href={project.links.live} target="_blank">
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-lime-100 dark:hover:bg-lime-500/20 hover:text-lime-700 dark:hover:text-lime-400 text-forest-400 dark:text-sage-400 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                {project.links.github && (
                  <Link href={project.links.github} target="_blank">
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-lime-100 dark:hover:bg-lime-500/20 hover:text-lime-700 dark:hover:text-lime-400 text-forest-400 dark:text-sage-400 transition-colors">
                      <Github className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <p className="text-lg font-medium text-lime-600 dark:text-lime-400 mb-4">{project.tagLine}</p>
            <p className="text-forest-600 dark:text-sage-300 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Metrics Grid */}
          {project.impactMetrics && project.impactMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {project.impactMetrics.slice(0, 4).map((metric, idx) => (
                <div key={idx} className="bg-forest-50/50 dark:bg-forest-800/50 rounded-xl p-3 border border-forest-100/50 dark:border-forest-600/50">
                  <p className="text-2xl font-bold text-forest-900 dark:text-sage-100 mb-1">{metric.value}</p>
                  <p className="text-xs font-medium text-forest-500 dark:text-sage-400 uppercase tracking-wide truncate" title={metric.label}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 8).map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-forest-800 border border-forest-100 dark:border-forest-600 text-xs text-forest-600 dark:text-sage-300 shadow-sm hover:border-lime-200 dark:hover:border-lime-500/50 hover:bg-lime-50 dark:hover:bg-forest-700 transition-colors cursor-default"
                >
                  <tech.icon className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>{tech.name}</span>
                </div>
              ))}
              {project.technologies.length > 8 && (
                <div className="px-3 py-1.5 rounded-full bg-forest-50 dark:bg-forest-800 text-xs text-forest-500 dark:text-sage-400 font-medium">
                  +{project.technologies.length - 8} more
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-forest-100 dark:border-forest-600">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                className="rounded-full border-forest-200 dark:border-forest-600 text-forest-700 dark:text-sage-300 hover:bg-forest-50 dark:hover:bg-forest-700 hover:text-forest-900 dark:hover:text-sage-100 hover:border-forest-300 transition-all"
              >
                {isExpanded ? (
                  <>Show Less <ChevronUp className="w-4 h-4 ml-2" /></>
                ) : (
                  <>View Details <ChevronDown className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              {/* Executive Summary - only if project has documentation */}
              {project.documentation?.[0]?.url && (
                <Link href={project.documentation[0].url}>
                  <Button className="rounded-full bg-forest-900 dark:bg-lime-500 text-white dark:text-forest-950 hover:bg-forest-800 dark:hover:bg-lime-400 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" title="Executive Summary">
                    <BookOpen className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Summary</span>
                  </Button>
                </Link>
              )}

              {/* Technical Docs - only if project has documentation with technical doc entry */}
              {project.documentation?.[1]?.url && (
                <Link href={project.documentation[1].url}>
                  <Button variant="outline" className="rounded-full border-forest-300 dark:border-forest-600 text-forest-700 dark:text-sage-300 hover:bg-forest-50 dark:hover:bg-forest-700 hover:border-forest-400 transition-all" title="Technical Documentation">
                    <BookOpen className="w-4 h-4 sm:mr-2" />
                    <span className="hidden xl:inline">Technical Docs</span>
                    <span className="hidden sm:inline xl:hidden">Docs</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-forest-50/30 dark:bg-forest-900/50 border-t border-forest-100 dark:border-forest-600"
          >
            <div className="p-6 md:p-10 grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h3 className="text-lg font-bold text-forest-900 dark:text-sage-100 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-lime-500 rounded-full" />
                  The Challenge
                </h3>
                <p className="text-forest-700 dark:text-sage-300 leading-relaxed text-sm md:text-base">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-forest-900 dark:text-sage-100 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-forest-900 dark:bg-sage-300 rounded-full" />
                  The Solution
                </h3>
                <p className="text-forest-700 dark:text-sage-300 leading-relaxed text-sm md:text-base">
                  {project.solution}
                </p>
              </div>
              {project.impact && project.impact.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-forest-900 dark:text-sage-100 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-forest-400 dark:bg-sage-500 rounded-full" />
                    Key Impact
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.impact.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white dark:bg-forest-800 p-4 rounded-xl border border-forest-100 dark:border-forest-600 shadow-sm dark:shadow-black/20">
                        <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-lime-500" />
                        </div>
                        <p className="text-sm text-forest-700 dark:text-sage-300 font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}