'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { portfolioData } from '@/data/portfolio';
import { Briefcase, Calendar, TrendingUp, Target, CheckCircle2, Rocket, ExternalLink } from 'lucide-react';

const ExperienceSection = () => {
  const experienceData = portfolioData.experience;

  return (
    <section
      id="experience"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Work Experience"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-lime-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-forest-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-lime-500 text-forest-900 px-4 py-1">
            <Briefcase className="w-3 h-3 mr-2 inline" />
            Professional Experience
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
            <span className="text-forest-900">Career </span>
            <span className="text-lime-500">Journey</span>
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto text-lg">
            1+ years building production AI automation systems and full-stack applications
            that deliver measurable business impact.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {experienceData.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="border-l-4 border-l-lime-500 bg-gradient-to-br from-forest-50/80 to-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl md:text-2xl font-bold text-forest-900 flex items-center gap-2">
                          <Rocket className="w-5 h-5 text-lime-600" />
                          {experience.role}
                        </h3>
                        <Badge className="bg-lime-100 text-lime-800 border-lime-300 font-medium">
                          {experience.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-forest-600 text-sm md:text-base">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {experience.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-lime-600" />
                          {experience.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-forest-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-lime-600" />
                      Key Achievements
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {experience.achievements.map((achievement, achIndex) => (
                        <motion.li
                          key={achIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + achIndex * 0.05 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-2 text-forest-700"
                        >
                          <CheckCircle2 className="w-5 h-5 text-lime-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base leading-relaxed">{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Projects */}
                  {experience.keyProjects.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-forest-800 uppercase tracking-wider mb-3">
                        Notable Projects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.keyProjects.map((project, projIndex) => (
                          project.url ? (
                            <a
                              key={projIndex}
                              href={project.url}
                              className="inline-flex items-center gap-1.5 bg-forest-50 border border-forest-200 text-forest-700 hover:bg-lime-100 hover:border-lime-400 hover:text-lime-800 transition-all duration-200 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer group"
                            >
                              {project.title}
                              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <Badge
                              key={projIndex}
                              variant="outline"
                              className="bg-forest-50 border-forest-200 text-forest-700 px-3 py-1.5"
                            >
                              {project.title}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* SEO-focused footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-forest-600 mt-12 text-sm max-w-2xl mx-auto"
        >
          Looking for an <strong>AI automation engineer</strong> or <strong>technical solutions architect</strong>
          with hands-on experience? I bring 1+ years of building production automation systems and full-stack applications.
        </motion.p>
      </div>
    </section>
  );
};

export default ExperienceSection;