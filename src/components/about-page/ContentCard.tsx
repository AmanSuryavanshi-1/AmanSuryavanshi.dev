'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Workflow,
  Zap,
  Layers,
  Cpu,
  Code2,
  ArrowRight,
  GraduationCap,
  Target,
  Sparkles,
  CheckCircle,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';
import {
  BentoGrid,
  BentoCard,
  BentoTitle,
  ClosedLoopVisual
} from '@/components/ui/bento-grid';
import { Timeline } from '@/components/ui/modern-timeline';
import { Badge } from '@/components/ui/badge';
import { portfolioData } from '@/data/portfolio';

// ══════════════════════════════════════════════════════════════════════════
// PREMIUM CONTENT CARD - Expert-Builder Bento Grid Layout
// Data fetched from centralized portfolio.tsx
// ══════════════════════════════════════════════════════════════════════════

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Icon Mapping for Dynamic Data
const IconMap: Record<string, LucideIcon> = {
  Workflow,
  Zap,
  Layers,
  Cpu,
  Code2,
  GraduationCap,
  Target,
  Sparkles,
  CheckCircle,
  TrendingUp
};

const ContentCard = () => {
  const { bentoGrid, timeline } = portfolioData.about;

  // Helper to get icon component safely
  const getIcon = (iconName: string) => {
    const Icon = IconMap[iconName] || Sparkles;
    return Icon;
  };

  const OriginIcon = getIcon(bentoGrid.origins.icon);
  const TStackIcon = getIcon(bentoGrid.tStack.icon);
  const PhilosophyIcon = getIcon(bentoGrid.philosophy.icon);
  const ArchIcon = getIcon(bentoGrid.systemArchitecture.icon);
  const ProofIcon = getIcon(bentoGrid.proofOfWork.icon);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <motion.div variants={item} className="text-center mb-8">
        <Badge variant="secondary" className="mb-3 bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-500/30">
          {bentoGrid.badge}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-forest-900 dark:text-sage-100">
          Building <span className="text-lime-600 dark:text-lime-400">Intelligent Systems</span> End-to-End
        </h2>
      </motion.div>

      {/* Optimized Bento Grid - Better space utilization */}
      <BentoGrid className="lg:grid-cols-4 gap-4">
        {/* ═══════════════════════════════════════════════════════════════════
            ROW 1: Origins (1 col) + T-Stack (2 cols) + Philosophy (1 col)
        ═══════════════════════════════════════════════════════════════════ */}

        {/* Origins Cell - Visual Bridge (ECE Schematic Background) */}
        <motion.div variants={item} className="lg:col-span-1">
          <BentoCard hasSchematicBg className="h-full min-h-[200px]">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                <OriginIcon className="w-5 h-5" />
              </div>
              <div>
                <BentoTitle>{bentoGrid.origins.title}</BentoTitle>
                <span className="text-xs font-mono text-forest-500 dark:text-sage-400">{bentoGrid.origins.subtitle}</span>
              </div>
            </div>
            <div
              className="text-sm text-forest-600 dark:text-sage-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bentoGrid.origins.description.replace('Electronics & Communication', '<strong class="text-forest-900 dark:text-sage-100">Electronics & Communication</strong>').replace('digital nervous systems', '<em>digital nervous systems</em>') }}
            />
          </BentoCard>
        </motion.div>

        {/* T-Stack Cell - Primary Value Proposition */}
        <motion.div variants={item} className="lg:col-span-2">
          <BentoCard className="h-full min-h-[200px]">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400 shrink-0">
                <TStackIcon className="w-5 h-5" />
              </div>
              <div>
                <BentoTitle>{bentoGrid.tStack.title}</BentoTitle>
                <span className="text-xs text-forest-500 dark:text-sage-400">{bentoGrid.tStack.subtitle}</span>
              </div>
            </div>

            <p className="text-sm text-forest-600 dark:text-sage-300 mb-3">
              {bentoGrid.tStack.descriptionPart1.replace('brain', '').replace('body', '')} <strong className="text-forest-900 dark:text-sage-100">brain</strong> but not the <strong className="text-forest-900 dark:text-sage-100">body</strong>.
              <span className="text-lime-600 dark:text-lime-400 font-semibold"> {bentoGrid.tStack.highlight}</span>
            </p>

            <div className="grid grid-cols-1 gap-1.5">
              {bentoGrid.tStack.layers.map((layer, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-1.5 rounded-lg ${layer.type === 'depth'
                    ? 'bg-lime-50 dark:bg-lime-500/10 border border-lime-200 dark:border-lime-500/30'
                    : 'bg-forest-50/50 dark:bg-forest-800/30'
                    }`}
                >
                  <div className={`w-1 h-6 rounded-full shrink-0 ${layer.type === 'depth' ? 'bg-lime-500' : 'bg-forest-300 dark:bg-sage-500'
                    }`} />
                  <span className={`text-xs font-medium ${layer.type === 'depth'
                    ? 'text-lime-700 dark:text-lime-400'
                    : 'text-forest-700 dark:text-sage-200'
                    }`}>
                    {layer.label}
                  </span>
                  <span className="text-[10px] text-forest-500 dark:text-sage-400 ml-auto hidden sm:block">
                    {layer.detail}
                  </span>
                  {layer.type === 'depth' && (
                    <Badge className="text-[9px] px-1.5 py-0 bg-lime-200 dark:bg-lime-500/30 text-lime-700 dark:text-lime-400 border-0 ml-1">
                      DEPTH
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </BentoCard>
        </motion.div>

        {/* Philosophy Cell - Compact */}
        <motion.div variants={item} className="lg:col-span-1">
          <BentoCard className="h-full min-h-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0">
                <PhilosophyIcon className="w-5 h-5" />
              </div>
              <BentoTitle>{bentoGrid.philosophy.title}</BentoTitle>
            </div>
            <div className="space-y-2">
              {bentoGrid.philosophy.items.map((item, idx) => {
                const ItemIcon = getIcon(item.icon);
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <ItemIcon className="w-3.5 h-3.5 text-lime-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-forest-900 dark:text-sage-100 block">{item.label}</span>
                      <span className="text-[10px] text-forest-500 dark:text-sage-400">{item.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoCard>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            ROW 2: System Architecture (2 cols) + Proof of Work (2 cols)
        ═══════════════════════════════════════════════════════════════════ */}

        {/* System Architecture - Clean Professional Visual */}
        <motion.div variants={item} className="lg:col-span-2">
          <BentoCard className="h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                <ArchIcon className="w-5 h-5" />
              </div>
              <div>
                <BentoTitle>{bentoGrid.systemArchitecture.title}</BentoTitle>
                <span className="text-xs text-forest-500 dark:text-sage-400">{bentoGrid.systemArchitecture.subtitle}</span>
              </div>
            </div>

            {/* Professional Closed-Loop Visual */}
            <div className="flex justify-center mb-4">
              <ClosedLoopVisual className="max-w-[320px]" />
            </div>

            {/* Key Principles - Clean Tags */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {bentoGrid.systemArchitecture.tags.map((tag, idx) => {
                const TagIcon = getIcon(tag.icon);
                return (
                  <span key={idx} className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1
                        ${tag.label === 'Self-Healing'
                      ? 'bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400 border border-lime-200 dark:border-lime-500/30'
                      : 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 border border-forest-200 dark:border-forest-600'}`}>
                    <TagIcon className="w-2.5 h-2.5" />
                    {tag.label}
                  </span>
                );
              })}
            </div>
          </BentoCard>
        </motion.div>

        {/* Proof of Work - Business Transformation Titles */}
        <motion.div variants={item} className="lg:col-span-2">
          <BentoCard className="h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400 shrink-0">
                <ProofIcon className="w-5 h-5" />
              </div>
              <div>
                <BentoTitle>{bentoGrid.proofOfWork.title}</BentoTitle>
                <span className="text-xs text-forest-500 dark:text-sage-400">{bentoGrid.proofOfWork.subtitle}</span>
              </div>
            </div>

            <div className="space-y-3">
              {bentoGrid.proofOfWork.items.map((work, idx) => (
                <Link
                  key={idx}
                  href={work.url}
                  className="group/proof block p-3 rounded-xl bg-forest-50/50 dark:bg-forest-800/30 
                             border border-forest-100 dark:border-forest-700
                             hover:border-lime-500/50 dark:hover:border-lime-500/30
                             hover:shadow-md hover:shadow-lime-500/10
                             transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold font-serif text-forest-900 dark:text-sage-100 text-sm
                                   group-hover/proof:text-lime-600 dark:group-hover/proof:text-lime-400 
                                   transition-colors leading-tight">
                      {work.title}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-forest-200 dark:bg-forest-700 text-forest-600 dark:text-sage-300 shrink-0">
                      {work.year}
                    </span>
                  </div>
                  <p className="text-[10px] text-forest-500 dark:text-sage-400 mb-2">
                    {work.project}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {work.metrics.map((metric, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[9px] px-1.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-500/20 
                                   text-lime-700 dark:text-lime-400 font-medium flex items-center gap-0.5"
                      >
                        <TrendingUp className="w-2 h-2" />
                        {metric}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-lime-600 dark:text-lime-400 font-medium ml-auto">
                      Read Case Study
                      <ArrowRight className="w-2.5 h-2.5 group-hover/proof:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </BentoCard>
        </motion.div>
      </BentoGrid>

      {/* ═══════════════════════════════════════════════════════════════════
          MY JOURNEY TIMELINE - Corrected Dates
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={item}
        className="mt-16"
      >
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3 bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 border-forest-200 dark:border-forest-600">
            {timeline.badge}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-forest-900 dark:text-sage-100">
            From <span className="text-lime-600 dark:text-lime-400">ECE</span> to <span className="text-lime-600 dark:text-lime-400">Agentic Systems</span>
          </h2>
        </div>

        <Timeline items={timeline.items} />
      </motion.div>
    </motion.div>
  );
};

export default ContentCard;