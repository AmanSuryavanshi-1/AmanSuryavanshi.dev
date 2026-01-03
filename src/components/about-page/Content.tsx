'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Coffee,
  Sparkles,
  Workflow,
  Layers,
  Target,
  Rocket,
  type LucideIcon
} from 'lucide-react';
import { MotionButton } from '@/components/big-button';
import { portfolioData } from '@/data/portfolio';

// ══════════════════════════════════════════════════════════════════════════
// ABOUT CONTENT - Expert-Builder Hero Section
// Data fetched from centralized portfolio.tsx
// ══════════════════════════════════════════════════════════════════════════

// Icon Mapping
const IconMap: Record<string, LucideIcon> = {
  Brain,
  Workflow,
  Layers,
  Rocket,
  Sparkles,
  Target
};

const AboutContent = () => {
  const { hero } = portfolioData.about;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Helper to get icon
  const getIcon = (name: string) => IconMap[name] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col h-full justify-center"
    >
      {/* Header Section */}
      <div className="mb-4 text-left">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full 
                        bg-lime-100/50 dark:bg-lime-500/20 
                        border border-lime-200 dark:border-lime-500/30 
                        text-forest-900 dark:text-lime-400 text-xs font-medium mb-3">
          <Sparkles className="w-3 h-3 text-lime-600 dark:text-lime-400" />
          <span>{hero.badge}</span>
        </div>

        {/* Headline - Entity-Driven */}
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-900 dark:text-sage-100 mb-2 leading-tight">
          {hero.title}
        </h1>
        <p className="text-base md:text-lg font-medium text-forest-700 dark:text-sage-300 mb-3">
          {/* Parse subtitle to inject formatting manually or just styling it simply. 
               The design uses spans for colors. Since data is string, we might need a small parser or just assume robust string content.
               Given the structure "Part 1 • Part 2 • Part 3", I can split it or process it.
               The prompt says: "Production n8n Architect • <span ...>LangGraph Orchestrator</span> ..."
               The data has "Production n8n Architect • LangGraph Orchestrator • Next.js Systems Builder". 
               I will hardcode the splitting logic for the colored part to match design requirements if strictly needed, 
               or I can just render the subtitle. The design showed LangGraph in Lime.
               I will attempt to format the middle part or specific keywords if possible, 
               but for "Centralized Data", rendering the string is safest. 
               However, to maintain the "WOW" design, I'll use a dangerouslySetInnerHTML or a replace strategy similar to ContentCard.
           */}
          <span dangerouslySetInnerHTML={{ __html: hero.subtitle.replace('LangGraph Orchestrator', '<span class="text-lime-600 dark:text-lime-400">LangGraph Orchestrator</span>') }} />
        </p>

        {/* One-Line Pitch */}
        <p className="text-forest-600 dark:text-sage-300 text-sm md:text-base leading-relaxed max-w-xl mb-4 
                      border-l-2 border-lime-500 pl-3 italic">
          {hero.pitch}
        </p>
      </div>

      {/* Skills Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-2.5 mb-6"
      >
        {hero.skills.map((skill, index) => {
          const SkillIcon = getIcon(skill.icon);
          return (
            <motion.div
              key={index}
              variants={item}
            >
              <div className="group flex items-center gap-2.5 p-2.5 rounded-xl 
                              bg-white/40 dark:bg-forest-900/40 
                              border border-white/60 dark:border-white/10 
                              hover:bg-white/80 dark:hover:bg-forest-800/60 
                              hover:border-lime-500/50 dark:hover:border-lime-500/30 
                              hover:shadow-lg hover:shadow-lime-500/10 
                              transition-all duration-300">
                <div className="p-1.5 rounded-lg 
                                bg-forest-900/5 dark:bg-forest-800 
                                text-forest-900 dark:text-sage-200 
                                group-hover:bg-lime-500 group-hover:text-white 
                                transition-colors duration-300">
                  <SkillIcon className="w-4 h-4" />
                </div>
                <span className="font-medium text-forest-900 dark:text-sage-200 text-sm 
                                 group-hover:text-forest-700 dark:group-hover:text-sage-100 
                                 transition-colors">
                  {skill.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-start"
      >
        <MotionButton
          href="/#contact"
          icon={Coffee}
          label="Let's Connect"
        />
      </motion.div>
    </motion.div>
  );
};

export default AboutContent;