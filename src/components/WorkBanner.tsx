'use client';

import React from 'react';
import {
  Briefcase, Globe, Clock, Database, Code, Server, Monitor, Zap, Feather, Settings, Figma, TrendingUp, Film, Edit3, ImageIcon, Brain, Book, PenTool, BookOpen, Layers, Package,
  Workflow, Bot, MessageSquare, Search, Code2, FileJson, Palette, Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';

const iconMap: { [key: string]: React.ElementType } = {
  Briefcase, Globe, Clock, Database, Code, Server, Monitor, Zap, Feather, Settings, Figma, TrendingUp, Film, Edit3, ImageIcon, Brain, Book, PenTool, BookOpen, Layers, Package,
  Workflow, Bot, MessageSquare, Search, Code2, FileJson, Palette, Cloud
};

const WorkBanner = () => {
  const works = portfolioData.workBanner;

  return (
    <section
      className="w-full relative py-6"
      aria-label="Work Experience and Skills"
      data-testid="work-banner"
    >
      {/* Glassmorphic Container */}
      <div className="absolute inset-x-0 top-0 bottom-0 glass-surface-heavy" />

      <div className="relative overflow-hidden flex items-center">
        {/* Gradient Masks - Subtle fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 z-10 bg-gradient-to-r from-[var(--bg-primary)]/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 z-10 bg-gradient-to-l from-[var(--bg-primary)]/80 to-transparent pointer-events-none" />

        {/* For SEO */}
        <h2 className="sr-only">Work Experience and Skills</h2>

        <motion.div
          aria-label="Scrolling list of skills and experiences"
          animate={{
            x: ["0%", "-50%"],
            transition: {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 90,
                ease: "linear",
              },
            },
          }}
          className="flex gap-8 whitespace-nowrap min-w-max pl-8"
        >
          {[...works, ...works].map((item, index) => {
            const Icon = iconMap[item.icon] || Code;
            return (
              <div
                key={index}
                className="group flex items-center gap-3 px-4 py-2 rounded-full border 
                           border-forest-900/10 bg-white/40
                           dark:border-sage-300/10 dark:bg-forest-800/40
                           hover:bg-white hover:border-lime-500 hover:shadow-md hover:-translate-y-0.5 
                           dark:hover:bg-forest-700 dark:hover:border-lime-400
                           cursor-default"
              >
                <span className="text-forest-400 group-hover:text-lime-600 dark:text-sage-400 dark:group-hover:text-lime-400">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-base font-medium text-forest-700 group-hover:text-forest-900 dark:text-sage-200 dark:group-hover:text-sage-100">
                  {item.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WorkBanner;