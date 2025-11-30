'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Workflow,
  Zap,
  Brain,
  Layers,
  Rocket,
  Code2
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const contentItems = [
  {
    icon: <Workflow />,
    title: "Automation Architect",
    text: "Designing complex, self-healing workflows that handle thousands of operations autonomously using n8n and custom scripts."
  },
  {
    icon: <Brain />,
    title: "AI Integration",
    text: "Seamlessly embedding LLMs (OpenAI, Anthropic) into business processes for intelligent decision-making and content generation."
  },
  {
    icon: <Layers />,
    title: "Full-Stack Orchestration",
    text: "Bridging the gap between frontend UIs and backend automation, creating unified systems that just work."
  },
  {
    icon: <Zap />,
    title: "Performance First",
    text: "Optimizing every automation for speed and cost-efficiency, ensuring your systems scale without breaking the bank."
  },
  {
    icon: <Rocket />,
    title: "Scalable Solutions",
    text: "Building robust architectures that grow with your business, from MVP to enterprise-grade automation systems."
  },
  {
    icon: <Code2 />,
    title: "Custom Development",
    text: "When no-code isn't enough, I write custom TypeScript/Node.js nodes to extend capabilities and solve unique challenges."
  }
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

const ContentCard = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto py-8"
    >
      {contentItems.map((item, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="h-full"
        >
          <Card className="group h-full overflow-hidden rounded-3xl border-2 border-white/50 bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 text-white shadow-lg shadow-lime-500/30 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(item.icon, {
                  className: "w-6 h-6"
                })}
              </div>

              <h3 className="text-xl font-serif font-bold text-forest-900 mb-3 group-hover:text-lime-600 transition-colors duration-300">
                {item.title}
              </h3>

              <p className="text-forest-700 leading-relaxed text-base">
                {item.text}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContentCard;