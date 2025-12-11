'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { portfolioData } from '@/data/portfolio';
import { Briefcase, Calendar, TrendingUp, Target, CheckCircle2, Rocket, ExternalLink, ArrowDown } from 'lucide-react';

const ExperienceSection = () => {
  const experienceData = portfolioData.experience;

  return (
    <section
      id="experience"
      className="w-full relative overflow-x-hidden py-8 lg:py-12"
      aria-label="Work Experience"
    >
      {/* Background Elements - completely transparent now to blend with page */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">

      </div>

      <div className="container max-w-5xl mx-auto relative z-10 px-4 sm:px-6 lg:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 relative inline-block w-full"
        >
          <Badge variant="outline" className="mb-4 border-lime-500 text-forest-900 px-4 py-1.5 bg-white/50">
            <Briefcase className="w-3 h-3 mr-2 inline" />
            Professional Experience
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4 tracking-tight">
            <span className="text-forest-900">Career </span>
            <span className="text-lime-600">Journey</span>
          </h2>
          <p className="text-forest-600 max-w-2xl mx-auto text-lg">
            Building production systems and delivering measurable impact.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-6 sm:space-y-8 md:space-y-12 relative overflow-hidden">

          {/* Central Timeline Line */}
          <div className="absolute left-[24px] sm:left-[28px] md:left-1/2 top-4 bottom-0 w-0.5 bg-forest-900/10 md:-translate-x-1/2 z-0 hidden md:block" />
          <div className="absolute left-[24px] sm:left-[28px] top-4 bottom-0 w-0.5 bg-forest-900/10 z-0 md:hidden" />

          {experienceData.map((experience, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

              {/* Timeline Node */}
              <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 flex flex-col items-center h-full z-20">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-forest-50 border-4 border-white shadow-lg shadow-lime-500/20 flex items-center justify-center z-10 relative"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-lime-500 flex items-center justify-center text-white">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </motion.div>
              </div>

              {/* Date/Duration Label (Opposite side on desktop) */}
              <div className={`w-full md:w-1/2 flex md:items-start pt-3 pl-14 sm:pl-20 md:pl-0 ${index % 2 === 0 ? 'md:justify-end md:pr-12 lg:pr-16' : 'md:justify-start md:pl-12 lg:pl-16'}`}>
                <div className={`hidden md:flex flex-col gap-1 ${index % 2 === 0 ? 'items-end text-right' : 'items-start text-left'}`}>
                  <Badge variant="outline" className="text-forest-600 border-forest-200 bg-white/50 w-fit">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {experience.period}
                  </Badge>
                  <span className="text-xs font-semibold text-lime-600 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {experience.duration}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`w-full md:w-1/2 pl-14 sm:pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 lg:pr-16' : 'md:pl-12 lg:pl-16'}`}
              >
                {/* Mobile Date Display (visible only on mobile) */}
                <div className="md:hidden flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-forest-600 border-forest-200 bg-white/50 w-fit">
                    {experience.period}
                  </Badge>
                  <span className="text-xs font-semibold text-lime-600">
                    {experience.duration}
                  </span>
                </div>

                <Card className="relative overflow-hidden border-0 shadow-lg shadow-forest-900/5 bg-white/80 backdrop-blur-md rounded-2xl group hover:-translate-y-1 transition-transform duration-300">
                  {/* Decorative colored top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500 to-forest-500" />

                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-forest-900 leading-tight">
                          {experience.role}
                        </h3>
                        <Badge className="bg-forest-100 text-forest-800 hover:bg-forest-200 border-0 ml-2 shrink-0">
                          {experience.type}
                        </Badge>
                      </div>

                      {/* Company name removed as it's not in the data source */}
                    </div>

                    {/* Achievements */}
                    <div className="mb-6 space-y-3">
                      {experience.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-3 text-forest-700">
                          <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-lime-500" />
                          <span className="text-sm md:text-base leading-relaxed">{achievement}</span>
                        </div>
                      ))}
                    </div>

                    {/* Key Projects */}
                    {experience.keyProjects.length > 0 && (
                      <div className="pt-4 border-t border-forest-50">
                        <p className="text-xs font-bold text-forest-400 uppercase tracking-widest mb-3">
                          Key Projects
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {experience.keyProjects.map((project, projIndex) => (
                            project.url ? (
                              <a
                                key={projIndex}
                                href={project.url}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold 
                                               bg-white border border-forest-100 text-forest-600 shadow-sm
                                               hover:border-lime-500 hover:text-lime-600 transition-all duration-200"
                              >
                                {project.title}
                                <ExternalLink className="w-3 h-3 text-lime-500" />
                              </a>
                            ) : (
                              <span
                                key={projIndex}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                               bg-forest-50 text-forest-600 border border-transparent"
                              >
                                {project.title}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Footer Connector */}
        <div className="flex justify-center mt-6 mb-6 relative z-20">
          <div className="p-2 rounded-full bg-white border border-dashed border-forest-300 text-forest-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* SEO-focused footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-forest-500 mt-4 text-sm max-w-2xl mx-auto"
        >
          Looking for an <strong>AI automation engineer</strong> or <strong>technical solutions architect</strong>?
        </motion.p>
      </div>
    </section>
  );
};

export default ExperienceSection;