'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Palette, 
  Brain,
  Laptop,
  Coffee,
  Sparkles
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { MotionButton } from '@/components/big-button';

const AboutContent = () => {
  const skills = [
    { icon: <Code2 className="w-5 h-5" />, label: "Web Development" },
    { icon: <Palette className="w-5 h-5" />, label: "UI/UX Design" },
    { icon: <Brain className="w-5 h-5" />, label: "Problem Solving" },
    { icon: <Laptop className="w-5 h-5" />, label: "Responsive Design" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center mb-12"
      >
        
        <h1 className="text-2xl flex items-center font-serif font-bold text-forest-700 mb-4">
        <div className="mt-2 mx-2 text-lime-500">
          <Sparkles className="w-5 h-5" />
        </div>
          Creative Web Developer & Designer
          <div className="mt-2 mx-2 text-lime-500">
          <Sparkles className="w-5 h-5" />
        </div>
        </h1>
        <p className="text-forest-700 text-lg max-w-2xl">
          Transforming ideas into exceptional digital experiences through innovative design and development.
        </p>
      </motion.div>

      {/* Skills Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {skills.map((skill, index) => (
          <Card
            key={index}
            className="group overflow-hidden rounded-3xl border-4 border-sage-100 bg-gradient-to-br from-lime-500 to-lime-100 hover:from-forest-900 hover:to-forest-500 transition-all duration-300 shadow-lg shadow-forest-500"
          >
            <motion.div
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="px-2 py-3 text-center"
            >
              <div className="p-2 rounded-full bg-forest-900 border-[3px] border-sage-100 inline-block mb-2 group-hover:bg-lime-500 transition-colors duration-300">
                {React.cloneElement(skill.icon, { 
                  className: "w-6 h-6 text-lime-500 group-hover:text-forest-900" 
                })}
              </div>
              <p className="text-forest-900 group-hover:text-sage-100 text-sm font-medium transition-colors duration-300">
                {skill.label}
              </p>
            </motion.div>
          </Card>
        ))}
      </motion.div>

      {/* Footer Section - Single Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
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