'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CountUp from '@/components/ui/count-up';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import experienceData from './ExperienceData';
import * as LucideIcons from 'lucide-react';

// Helper to get icon component dynamically
const getIconComponent = (iconName: string): React.ElementType => {
  const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[iconName];
  return Icon || LucideIcons.Briefcase;
};

const ExperienceCards = () => {
  const { stats, timeline } = experienceData;

  return (
    <section id="experience" className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-lime-500 text-forest-900 px-4 py-1">
            Career Journey
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
            <span className="text-forest-900">Professional </span>
            <span className="text-lime-500">Experience</span>
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto text-lg">
            A track record of delivering excellence and driving innovation in web development.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = getIconComponent(stat.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-lime-100 text-forest-900 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-forest-900 mb-1 flex items-center justify-center">
                      <CountUp to={stat.value} duration={2.5} />
                      <span className="text-lime-600">{stat.suffix}</span>
                    </div>
                    <h4 className="font-semibold text-forest-800 mb-1">{stat.label}</h4>
                    <p className="text-sm text-forest-600">{stat.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0"
            >
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-sage-200 -translate-x-1/2 last:bottom-auto last:h-full" />

              <div className={`md:flex items-center justify-between mb-12 relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] md:left-1/2 top-1 w-3 h-3 rounded-full bg-lime-500 border-4 border-white shadow-sm md:-translate-x-1/2 z-10" />

                <div className="md:w-[45%] mb-2 md:mb-0">
                  <div className={`flex items-center gap-2 text-lime-600 font-semibold mb-1 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                    <LucideIcons.Calendar className="w-4 h-4" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <div className="md:w-[45%]">
                  <Card className="border-l-4 border-l-lime-500 border-y-0 border-r-0 rounded-r-lg rounded-l-none bg-forest-50/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-forest-900 flex items-center gap-2">
                        <LucideIcons.Briefcase className="w-4 h-4 text-forest-700" />
                        {item.role}
                      </h3>
                      <p className="text-sm font-medium text-forest-700 mb-2">{item.company}</p>
                      <p className="text-sm text-forest-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceCards;