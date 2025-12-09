'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User2, Info, GraduationCap } from 'lucide-react';

import SectionTitle from '@/components/about/SectionTitle';
import ActionButtons from '@/components/about/ActionButtons';
import Qualifications from '@/components/about/Qualifications';
import PersonalInfo from '@/components/about/PersonalInfo';
import AboutContent from './AboutContent';
import AboutImage from './AboutImage';

interface PersonalInfoData {
  name: string;
  email: string;
  phone: string;
  location?: string;
}

interface QualificationItem {
  title: string;
  institution: string;
  year: string;
  icon: string;
}

interface AboutMeProps {
  personalInfo?: PersonalInfoData;
  qualificationsData?: {
    qualifications: {
      EducationData: QualificationItem[];
      CertificationData: QualificationItem[];
    };
  };
}

const defaultProps: AboutMeProps = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: ''
  },
  qualificationsData: {
    qualifications: {
      EducationData: [],
      CertificationData: []
    }
  }
};

// Main AboutMe Component
const AboutMe = ({ personalInfo = defaultProps.personalInfo,
  qualificationsData = defaultProps.qualificationsData }: AboutMeProps) => {
  return (
    <main id="about" className="w-full py-8 lg:py-12">
      <article className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full" itemScope itemType="http://schema.org/ProfilePage">
        {/* SEO-optimized H1 (visually hidden but critical for SEO) */}
        <h1 className="sr-only">Aman Suryavanshi - Solutions Architect & AI Automation Consultant | Expert in N8N Workflow Orchestration, Next.js Development, and Business Process Automation</h1>

        <section aria-labelledby="about-heading">
          <SectionTitle />

          <div className="grid grid-cols-1 lg:grid-cols-12 py-4 gap-6 lg:gap-8 items-start">
            <aside className="lg:col-span-4 py-2" aria-label="Profile image">
              <AboutImage />
            </aside>

            <div className="lg:col-span-8">
              <Tabs defaultValue="about" className="w-full max-md:mx-auto max-md:h-auto max-[375px]:mt-8">
                {/* Centered Tab Navigation Container */}
                <div className="flex justify-center w-full mb-2">
                  <TabsList
                    className="inline-flex py-2 px-2 rounded-full bg-forest-900/95 backdrop-blur-sm border-2 border-forest-700/50 shadow-xl shadow-forest-900/20 text-sage-100 
                     gap-1
                     max-md:flex-col max-md:w-full max-md:rounded-2xl max-md:p-3 max-md:gap-2
                     max-[375px]:gap-1.5 max-[375px]:p-2"
                    role="tablist"
                    aria-label="About Aman Suryavanshi navigation"
                  >
                    <TabsTrigger
                      className="px-5 py-2.5 rounded-full border-2 border-transparent font-medium text-sm transition-all duration-300 text-sage-100
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-500 data-[state=active]:to-lime-400 
                      data-[state=active]:!text-forest-900 data-[state=active]:font-semibold data-[state=active]:border-lime-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-lime-500/30
                      hover:bg-lime-500/20 hover:text-lime-100 hover:border-lime-500/30
                      max-md:w-full max-md:py-3 max-md:justify-center max-[375px]:py-2.5 max-[375px]:text-sm"
                      value="about"
                      role="tab"
                      aria-label="About and professional background"
                    >
                      <User2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      className="px-5 py-2.5 rounded-full border-2 border-transparent font-medium text-sm transition-all duration-300 text-sage-100
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-500 data-[state=active]:to-lime-400 
                      data-[state=active]:!text-forest-900 data-[state=active]:font-semibold data-[state=active]:border-lime-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-lime-500/30
                      hover:bg-lime-500/20 hover:text-lime-100 hover:border-lime-500/30
                      max-md:w-full max-md:py-3 max-md:justify-center"
                      value="personal-info"
                      role="tab"
                      aria-label="Personal information and contact details"
                    >
                      <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger
                      className="px-5 py-2.5 rounded-full border-2 border-transparent font-medium text-sm transition-all duration-300 text-sage-100
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-500 data-[state=active]:to-lime-400 
                      data-[state=active]:!text-forest-900 data-[state=active]:font-semibold data-[state=active]:border-lime-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-lime-500/30
                      hover:bg-lime-500/20 hover:text-lime-100 hover:border-lime-500/30
                      max-md:w-full max-md:py-3 max-md:justify-center"
                      value="qualifications"
                      role="tab"
                      aria-label="Education and certifications"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" aria-hidden="true" />
                      Qualifications
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="about" className="mt-6 min-h-[18rem]" role="tabpanel">
                  <AboutContent />
                </TabsContent>

                <TabsContent value="personal-info" className="mt-6 min-h-[18rem]" role="tabpanel">
                  <PersonalInfo data={personalInfo} />
                </TabsContent>

                <TabsContent value="qualifications" className="mt-6 min-h-[18rem]" role="tabpanel">
                  <Qualifications data={qualificationsData} />
                </TabsContent>
              </Tabs>

              <div className="mt-8">
                <ActionButtons />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Schema.org ProfilePage markup */}
        <link itemProp="mainEntity" href="#about" />
      </article>
    </main>
  );
};

export default AboutMe;