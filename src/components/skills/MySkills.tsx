'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import skillsData from './SkillsData';
import * as LucideIcons from 'lucide-react';
import * as ReactIcons from 'react-icons/fa';
import * as SimpleIcons from 'react-icons/si';
import { Card, CardContent } from '@/components/ui/card';
import { Boxes } from 'lucide-react';

// Add interface for the skills data structure
interface SkillsData {
  categories: {
    [key: string]: {
      icon: string;
      skills: Array<{
        name: string;
        icon: string;
        url?: string;
      }>;
    };
  };
}

// Add this interface near your other interfaces
interface Skill {
  name: string;
  icon: string;
  url?: string;
}

interface SkillsShowcaseProps {
  data?: SkillsData;
}

const getIconComponent = (iconName: string): React.ElementType => {
  if (ReactIcons[iconName as keyof typeof ReactIcons]) {
    return ReactIcons[iconName as keyof typeof ReactIcons];
  }
  if (SimpleIcons[iconName as keyof typeof SimpleIcons]) {
    return SimpleIcons[iconName as keyof typeof SimpleIcons];
  }
  return (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.Circle;
};

const SkillsShowcase: React.FC<SkillsShowcaseProps> = ({ data = skillsData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Technical Skills');
  const { categories } = data;

  // Function to get all skills across categories
  const getAllSkills = () => {
    const allSkills = Object.values(categories).flatMap(category => category.skills);
    return allSkills;
  };

  // Get skills based on selected category
  const getDisplayedSkills = () => {
    if (selectedCategory === 'All') {
      return getAllSkills();
    }
    return categories[selectedCategory as keyof typeof categories]?.skills || [];
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 md:px-8">
      <div className="container max-w-6xl mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mb-4 sm:mb-6">
            <span className="text-forest-900">My </span>
            <span className="text-lime-500">Skills</span>
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto text-sm sm:text-base">
            A comprehensive showcase of my technical expertise and creative capabilities.
          </p>
        </motion.div>

        {/* Category Selector */}
        <div className="flex justify-center gap-2 md:gap-3 mb-8 sm:mb-12 md:mb-16 flex-wrap">
          <motion.button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 md:px-4 py-1 sm:py-3 rounded-full text-sm sm:text-base font-bold border-[3px] border-sage-100 transition-all duration-300 shadow-md
              ${selectedCategory === 'All'
                ? 'bg-forest-900 text-sage-100 scale-105 shadow-lg shadow-forest-500'
                : 'bg-lime-500 text-forest-900 hover:bg-forest-700 hover:text-sage-100'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Boxes className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>All Skills</span>
            </div>
          </motion.button>
          {Object.entries(categories).map(([name, category]) => {
            const CategoryIcon = getIconComponent(category.icon);
            return (
              <motion.button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold border-[3px] border-sage-100 transition-all duration-300 shadow-md
                  ${selectedCategory === name
                    ? 'bg-forest-900 text-sage-100 scale-105 shadow-lg shadow-forest-500'
                    : 'bg-lime-500 text-forest-900 hover:bg-forest-700 hover:text-sage-100'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span>{name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-3 md:gap-4 max-w-5xl mx-auto lg:mx-28"
          layout
        >
          {getDisplayedSkills().map((skill: Skill, index: number) => {
            const Icon = getIconComponent(skill.icon);
            return (
              <motion.div
                key={`${skill.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  onClick={() => skill.url && window.open(skill.url, '_blank')}
                  className={`group h-24 sm:h-28 md:h-32 overflow-hidden rounded-3xl border-4 border-sage-100 
                    bg-gradient-to-br from-lime-500 to-lime-100 hover:from-forest-900 hover:to-forest-500 
                    transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl`}
                >
                  <CardContent className="p-3 md:p-4 h-full flex flex-col items-center justify-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 rounded-full bg-forest-900 border-2 shadow-sm shadow-forest-900 
                      border-sage-100 text-lime-500 group-hover:bg-lime-500 
                      group-hover:text-forest-900 transition-colors duration-300"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-forest-900 group-hover:text-lime-500 
                      transition-colors duration-300 text-center"
                    >
                      {skill.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsShowcase;