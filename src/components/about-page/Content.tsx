'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Brain,
  Coffee,
  Sparkles,
  Workflow,
  Plug
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { MotionButton } from '@/components/big-button';

const AboutContent = () => {
  const skills = [
    { icon: <Workflow className="w-4 h-4" />, label: "n8n Automation" },
    { icon: <Plug className="w-4 h-4" />, label: "API Integration" },
    { icon: <Brain className="w-4 h-4" />, label: "AI Integration" },
    { icon: <Code2 className="w-4 h-4" />, label: "Next.js Development" },
  ];

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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col h-full justify-center"
    >
      {/* Header Section */}
      <div className="mb-4 text-left">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-lime-100/50 border border-lime-200 text-forest-900 text-xs font-medium mb-3">
          <Sparkles className="w-3 h-3 text-lime-600" />
          <span>Available for new projects</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-900 mb-3 leading-tight">
          AI Automation Engineer <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-500">
            + Integration Specialist
          </span>
        </h1>

        <p className="text-forest-700 text-sm md:text-base leading-relaxed max-w-xl mb-4">
          Gluing tools together to create powerful automation workflows. I connect apps, APIs, and services into seamless systems that eliminate manual work and scale your business.
        </p>
      </div>

      {/* Skills Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-2.5 mb-6"
      >
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            variants={item}
          >
            <div className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/80 hover:border-lime-500/50 hover:shadow-lg hover:shadow-lime-500/10 transition-all duration-300">
              <div className="p-1.5 rounded-lg bg-forest-900/5 text-forest-900 group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
                {React.cloneElement(skill.icon, {
                  className: "w-4 h-4"
                })}
              </div>
              <span className="font-medium text-forest-900 text-sm group-hover:text-forest-700 transition-colors">
                {skill.label}
              </span>
            </div>
          </motion.div>
        ))}
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