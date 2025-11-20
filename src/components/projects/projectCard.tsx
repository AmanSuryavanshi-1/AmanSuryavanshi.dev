import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Project } from './projectsData'

export function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play()
          } else {
            videoRef.current?.pause()
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentVideoRef = videoRef.current

    if (currentVideoRef) {
      observer.observe(currentVideoRef)
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef)
      }
    }
  }, [])

  const cardClassName = cn(
    "relative overflow-hidden rounded-3xl shadow-lg shadow-forest-500 transition-transform duration-300 group border-4 border-sage-100 bg-gradient-to-br from-lime-500 to-lime-300/10 hover:from-forest-900 hover:to-forest-500",
    {
      'row-span-2': project.size === 'tall',
      'row-span-1': project.size === 'default',
      'sm:col-span-2 col-span-1': project.size === 'wide',
    }
  )

  return (
    <motion.div
      className={cardClassName}
      // whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/95 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/95 via-forest-900/90 to-transparent">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {project.size === 'tall' ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-base text-white">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/70 mt-1 line-clamp-6">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  <div className="flex flex-wrap gap-1 pr-2">
                    {project.technologies.slice(0, 20).map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full 
                                bg-forest-800/50 border border-white/5 shrink-0"
                      >
                        <tech.icon className="w-2.5 h-2.5 text-lime-400" />
                        <span className="text-[9px] text-white/70">{tech.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Link href={project.links.live} target="_blank">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 text-lime-400 hover:text-forest-900 hover:bg-lime-400 
                                  border border-lime-400/20 hover:border-lime-400 
                                  transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={project.links.github} target="_blank">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 text-lime-400 hover:text-forest-900 hover:bg-lime-400 
                                  border border-lime-400/20 hover:border-lime-400 
                                  transition-all duration-300"
                        >
                          <FaGithub className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    {project.slug && (
                      <Link href={`/blogs/${project.slug}`}>
                        <Button
                          size="sm"
                          className="px-2 py-2 bg-lime-500 hover:bg-lime-400 text-forest-900 
                                  font-semibold transition-all duration-300 rounded-full 
                                  border border-white/20 hover:border-white/40 shadow-lg text-[10px] shrink-0"
                        >
                          View Details
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {project.title}
                    </h3>
                    <p className="text-xs text-white/70 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={project.links.live} target="_blank">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 text-lime-400 hover:text-forest-900 hover:bg-lime-400 
                                border border-lime-400/20 hover:border-lime-400 
                                transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={project.links.github} target="_blank">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 text-lime-400 hover:text-forest-900 hover:bg-lime-400 
                                border border-lime-400/20 hover:border-lime-400 
                                transition-all duration-300"
                      >
                        <FaGithub className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-wrap gap-1 max-w-[75%] overflow-y-auto max-h-20 pr-2">
                    {project.technologies.slice(0, project.size === 'wide' ? 16 : 6).map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full 
                                bg-forest-800/50 border border-white/5 shrink-0"
                      >
                        <tech.icon className="w-2.5 h-2.5 text-lime-400" />
                        <span className="text-[9px] text-white/70">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                  {project.slug && (
                    <Link href={`/blogs/${project.slug}`}>
                      <Button
                        size="sm"
                        className="ml-2 px-2 py-2 bg-lime-500 hover:bg-lime-400 text-forest-900 
                                font-semibold transition-all duration-300 rounded-full 
                                border border-white/20 hover:border-white/40 shadow-lg text-[10px] shrink-0"
                      >
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}