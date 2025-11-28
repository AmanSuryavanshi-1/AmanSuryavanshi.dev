'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, GraduationCap, MapPin, Languages } from 'lucide-react';

interface PersonalData {
  title?: string;
  name?: string;
  phone?: string;
  email?: string;
  education?: string;
  address?: string;
  languages?: string[];
}

interface PersonalInfoProps {
  data?: PersonalData;
}

interface InfoItemProps {
  icon: React.ReactNode;
  text: string;
  label: string;
}

function PersonalInfo({ data }: PersonalInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="prose prose-forest max-w-none" itemScope itemType="http://schema.org/Person">
        <h2 className="text-lg font-semibold text-forest-900 mb-4">
          Delivering Business Impact Through Intelligent Automation
        </h2>
        <p className="text-forest-700">
          I specialize in architecting automation-first solutions that eliminate manual work and drive measurable ROI.
          My expertise lies in orchestrating AI tools, workflow platforms (N8N, Make), and modern tech stacks to create systems that work smarter, not harder.
          Every project I deliver comes with concrete metrics: time saved, revenue generated, processes automated.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <InfoItem
            icon={<User className="h-6 w-6" />}
            text={data?.name || "Your Name"}
            label="Name"
          />
          <InfoItem
            icon={<GraduationCap className="h-6 w-6" />}
            text={data?.education || "Master in Computer Science"}
            label="Education"
          />
          <InfoItem
            icon={<MapPin className="h-6 w-6" />}
            text={data?.address || "321 Blue Avenue, NY, USA"}
            label="Location"
          />
          <InfoItem
            icon={<Languages className="h-6 w-6" />}
            text={data?.languages?.join(", ") || "English, Hindi"}
            label="Languages"
          />
        </div>

        <meta itemProp="name" content={data?.name || "Aman Suryavanshi"} />
        <meta itemProp="description" content="Solutions Architect and Automation Consultant specializing in AI-powered workflow orchestration, business process automation, and intelligent system integration." />
      </div>
    </motion.div>
  );
}

function InfoItem({ icon, text, label }: InfoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3"
    >
      <span className="text-forest-500 flex-shrink-0 mt-1">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-forest-900 mb-1">{label}</h3>
        <p className="text-forest-700">{text}</p>
      </div>
    </motion.div>
  );
}

export default PersonalInfo;