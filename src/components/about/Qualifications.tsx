'use client';

import { motion } from 'framer-motion';
import { Award, GraduationCap, Code2, Code, School, LayoutTemplate } from 'lucide-react';

interface QualificationItem {
  title: string;
  institution: string;
  year: string;
  icon: string;
}

interface QualificationsProps {
  data?: {
    qualifications?: {
      EducationData: QualificationItem[];
      CertificationData: QualificationItem[];
    };
  };
}

const iconMap: { [key: string]: React.ReactNode } = {
  'graduation-cap': <GraduationCap className="w-5 h-5" />,
  'school': <School className="w-5 h-5" />,
  'code-2': <Code2 className="w-5 h-5" />,
  'code': <Code className="w-5 h-5" />,
  'layout-template': <LayoutTemplate className="w-5 h-5" />
};

const QualificationItem = ({ item, index }: { item: QualificationItem; index: number }) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-4 sm:pl-6 border-l-2 border-sage-300 dark:border-forest-500"
  >
    <div className="absolute left-[-4px] top-1">
      <div className="w-1.5 h-1.5 rounded-full bg-lime-500" />
    </div>
    <div className="flex items-center gap-1 mb-1">
      <span className="text-forest-500 dark:text-lime-400">
        <span className="w-4 h-4 sm:w-5 sm:h-5">
          {iconMap[item.icon]}
        </span>
      </span>
      <h3 className="text-sm sm:text-base font-semibold text-forest-900 dark:text-sage-100">{item.title}</h3>
    </div>
    <p className="text-xs sm:text-sm text-forest-700 dark:text-sage-300 mt-0.5">{item.institution}</p>
    <p className="text-xs text-forest-500 dark:text-sage-400 mt-0.5">{item.year}</p>
  </motion.div>
);

const Qualifications = ({ data }: QualificationsProps) => {
  if (!data?.qualifications) return null;

  const { EducationData, CertificationData } = data.qualifications;

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 overflow-hidden">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-x-6">
        {/* Education Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-forest-700 dark:text-lime-400" />
            <h2 className="text-lg sm:text-xl font-medium text-forest-900 dark:text-sage-100">Education</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {EducationData.map((item, index) => (
              <QualificationItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Certification Column */}
        <div className="mt-8 md:mt-0">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-forest-700 dark:text-lime-400" />
            <h2 className="text-lg sm:text-xl font-medium text-forest-900 dark:text-sage-100">Certification</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {CertificationData.map((item, index) => (
              <QualificationItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qualifications;