"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'
import { TransparentButton } from '../transparent-button'
import { SolidButton } from '../solid-button'
import ProjectCard from './ProjectCard'

export default function ProjectsSection() {
    return (
        <section id='projects' className="py-20 min-h-screen max-w-6xl mx-auto">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="projects-cards-heading"
                    className="text-2xl md:text-4xl font-bold font-serif text-forest-900 mb-8 text-center">
                    My <span className="text-lime-500">Projects</span>
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] gap-3 mb-12">
                    {portfolioData.projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                <motion.div
                    className="flex justify-center gap-4 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    <SolidButton
                        href="/blogs#projects-tab"
                        icon={ArrowRight}
                        label="Explore More"
                    />

                    <TransparentButton
                        href="/#contact"
                        icon={MessageSquare}
                        label="Let's Work Together"
                    />
                </motion.div>
            </div>
        </section>
    )
}