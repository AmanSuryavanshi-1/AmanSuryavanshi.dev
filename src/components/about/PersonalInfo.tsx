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
        <h2 className="text-2xl font-bold mb-4 text-forest-800">
          {data?.title || "Unmatched Service Quality for Over 10 Years"}
        </h2>
        
        <p className="text-forest-700 leading-relaxed mb-4" itemProp="description">
          Hi, I&apos;m a <span itemProp="jobTitle">web developer and UI/UX designer</span> dedicated to creating beautiful, functional, and user-centered digital experiences. With a keen eye for design and a strong technical foundation, I bridge the gap between aesthetics and functionality.
        </p>
        
        <p className="text-forest-700 leading-relaxed mb-6">
          I believe that design is about more than just making things look pretty - it&apos;s about solving problems and creating intuitive, enjoyable experiences for users. Whether I&apos;m working on a website or a mobile app, I bring my commitment to design excellence and user-centered thinking to every project I work on.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <InfoItem 
            icon={<User className="h-5 w-5"/>} 
            text={data?.name || "Your Name"}
            label="Name"
          />
          <InfoItem 
            icon={<Phone className="h-5 w-5"/>} 
            text={data?.phone || "+012 345 6789"}
            label="Phone"
          />
          <InfoItem 
            icon={<Mail className="h-5 w-5"/>} 
            text={data?.email || "youremail@email.com"}
            label="Email"
          />
          <InfoItem 
            icon={<GraduationCap className="h-5 w-5"/>} 
            text={data?.education || "Master in Computer Science"}
            label="Education"
          />
          <InfoItem 
            icon={<MapPin className="h-5 w-5"/>} 
            text={data?.address || "321 Blue Avenue, NY, USA"}
            label="Location"
          />
          
          <div className="col-span-2">
            <div className="flex items-start gap-3">
              <Languages className="h-5 w-5 text-forest-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-forest-800 mb-1">Languages</h3>
                <p className="text-forest-700">
                  {data?.languages?.join(", ") || "English, French, Spanish, Italian"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <meta itemProp="name" content={data?.name || "Aman Suryavanshi"} />
        <meta itemProp="description" content="Web developer and UI/UX designer dedicated to creating beautiful, functional, and user-centered digital experiences." />
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
      <span className="text-forest-600 flex-shrink-0 mt-1">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-forest-800 mb-1">{label}</h3>
        <p className="text-forest-700">{text}</p>
      </div>
    </motion.div>
  );
}

export default PersonalInfo;