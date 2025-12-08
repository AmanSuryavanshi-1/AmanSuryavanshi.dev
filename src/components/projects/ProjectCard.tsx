"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, BookOpen, ChevronDown, ChevronUp, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageGallery } from "@/context/ImageGalleryContext";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { registerImage, openGallery, images } = useImageGallery();
  const imageSrc = project.image || "/placeholder.png";

  useEffect(() => {
    if (imageSrc) {
      registerImage({ src: imageSrc, alt: project.title });
    }
  }, [imageSrc, project.title, registerImage]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-full bg-white/50 backdrop-blur-sm border border-forest-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-lime-500/50 transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Media Section */}
        <div className="w-full lg:w-2/5 relative aspect-video lg:aspect-auto lg:min-h-[400px] overflow-hidden bg-forest-50">
          {project.video ? (
            <div className="relative w-full h-full group/video cursor-pointer" onClick={toggleVideo}>
              <video
                ref={videoRef}
                src={project.video}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                poster={project.image}
              />
              <div className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300",
                isPlaying ? "opacity-0 group-hover/video:opacity-100" : "opacity-100"
              )}>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg transition-transform group-hover/video:scale-110">
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="relative w-full h-full group/image cursor-zoom-in block border-none p-0 bg-transparent text-left"
              onClick={(e) => {
                e.stopPropagation();
                const idx = images.findIndex(img => img.src === imageSrc);
                if (idx !== -1) openGallery(idx);
              }}
            >
              <Image
                src={imageSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
            </button>
          )}

          {/* Category Badge Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-white/90 text-forest-900 backdrop-blur-md border-white/50 shadow-sm hover:bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
              {project.category}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-xl md:text-2xl font-bold text-forest-900 font-serif">
                {project.title}
              </h2>
              <div className="h-px flex-1 bg-forest-100 min-w-[50px]" />
              <div className="flex gap-2">
                {project.links.live && (
                  <Link href={project.links.live} target="_blank">
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-lime-100 hover:text-lime-700 text-forest-400 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                {project.links.github && (
                  <Link href={project.links.github} target="_blank">
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-lime-100 hover:text-lime-700 text-forest-400 transition-colors">
                      <Github className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <p className="text-lg font-medium text-lime-600 mb-4">{project.tagLine}</p>
            <p className="text-forest-600 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Metrics Grid */}
          {project.impactMetrics && project.impactMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {project.impactMetrics.slice(0, 4).map((metric, idx) => (
                <div key={idx} className="bg-forest-50/50 rounded-xl p-3 border border-forest-100/50">
                  <p className="text-2xl font-bold text-forest-900 mb-1">{metric.value}</p>
                  <p className="text-xs font-medium text-forest-500 uppercase tracking-wide truncate" title={metric.label}>
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-forest-100 text-xs text-forest-600 shadow-sm hover:border-lime-200 hover:bg-lime-50 transition-colors cursor-default"
                >
                  <tech.icon className="w-3.5 h-3.5 text-lime-600" />
                  <span>{tech.name}</span>
                </div>
              ))}
              {project.technologies.length > 8 && (
                <div className="px-3 py-1.5 rounded-full bg-forest-50 text-xs text-forest-500 font-medium">
                  +{project.technologies.length - 8} more
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-forest-100">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                className="rounded-full border-forest-200 text-forest-700 hover:bg-forest-50 hover:text-forest-900 hover:border-forest-300 transition-all"
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
                  <Button className="rounded-full bg-forest-900 text-white hover:bg-forest-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Executive Summary
                  </Button>
                </Link>
              )}

              {/* Technical Docs - only if project has blogUrl */}
              {project.blogUrl && (
                <Link href={project.blogUrl}>
                  <Button variant="outline" className="rounded-full border-forest-300 text-forest-700 hover:bg-forest-50 hover:border-forest-400 transition-all">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Technical Docs
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
            className="overflow-hidden bg-forest-50/30 border-t border-forest-100"
          >
            <div className="p-6 md:p-10 grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h3 className="text-lg font-bold text-forest-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-lime-500 rounded-full" />
                  The Challenge
                </h3>
                <p className="text-forest-700 leading-relaxed text-sm md:text-base">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-forest-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-forest-900 rounded-full" />
                  The Solution
                </h3>
                <p className="text-forest-700 leading-relaxed text-sm md:text-base">
                  {project.solution}
                </p>
              </div>
              {project.impact && project.impact.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-forest-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-forest-400 rounded-full" />
                    Key Impact
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.impact.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-forest-100 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-lime-500" />
                        </div>
                        <p className="text-sm text-forest-700 font-medium">{item}</p>
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