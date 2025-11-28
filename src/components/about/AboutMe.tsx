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
    <main id="about" className="w-full py-12">
      <article className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full" itemScope itemType="http://schema.org/ProfilePage">
        {/* SEO-optimized H1 (visually hidden but critical for SEO) */}
        <h1 className="sr-only">Aman Suryavanshi - Solutions Architect & AI Automation Consultant | Expert in N8N Workflow Orchestration, Next.js Development, and Business Process Automation</h1>

        <section aria-labelledby="about-heading">
          <SectionTitle />

          <div className="grid grid-cols-1 lg:grid-cols-12 mb-8 gap-6 lg:gap-12 items-start">
            <aside className="lg:col-span-4 py-2" aria-label="Profile image">
              <AboutImage />
            </aside>

            <div className="lg:col-span-8">
              <Tabs defaultValue="about" className="w-full max-md:mx-auto max-md:h-auto max-[375px]:mt-8">
                <TabsList
                  className="py-5 rounded-3xl bg-forest-900 border-[3px] border-sage-100 shadow-lg shadow-forest-500 text-sage-100 
                   max-md:w-full max-md:min-h-[200px] max-md:flex max-md:flex-col max-md:justify-between max-md:gap-4 max-md:p-6
                  max-[375px]:gap-2 max-[375px]:p-4"
                  role="tablist"
                  aria-label="About Aman Suryavanshi navigation"
                >
                  <TabsTrigger
                    className="mr-1 rounded-3xl border-2 border-transparent data-[state=active]:bg-lime-500 data-[state=active]:border-sage-100 data-[state=active]:shadow-sm data-[state=active]:shadow-sage-300 hover:bg-forest-500
                    max-md:w-full max-md:h-14 max-md:flex max-md:items-center max-md:justify-center max-md:mr-0 max-[375px]:h-12 max-[375px]:text-sm"
                    value="about"
                    role="tab"
                    aria-label="About and professional background"
                  >
                    <User2 className="w-4 h-4 mr-2" aria-hidden="true" />
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    className="mr-1 rounded-3xl border-2 border-transparent data-[state=active]:bg-lime-500 data-[state=active]:border-sage-100 data-[state=active]:shadow-sm data-[state=active]:shadow-sage-300 hover:bg-forest-500
                    max-md:w-full max-md:h-14 max-md:flex max-md:items-center max-md:justify-center max-md:mr-0"
                    value="personal-info"
                    role="tab"
                    aria-label="Personal information and contact details"
                  >
                    <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger
                    className="mr-1 rounded-3xl border-2 border-transparent data-[state=active]:bg-lime-500 data-[state=active]:border-sage-100 data-[state=active]:shadow-sm data-[state=active]:shadow-sage-300 hover:bg-forest-500
                    max-md:w-full max-md:h-14 max-md:flex max-md:items-center max-md:justify-center max-md:mr-0"
                    value="qualifications"
                    role="tab"
                    aria-label="Education and certifications"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" aria-hidden="true" />
                    Qualifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 h-[18rem] max-xl:min-h-fit" role="tabpanel">
                  <AboutContent />
                </TabsContent>

                <TabsContent value="personal-info" className="mt-6 h-[18rem] max-xl:min-h-fit" role="tabpanel">
                  <PersonalInfo data={personalInfo} />
                </TabsContent>

                <TabsContent value="qualifications" className="mt-6 h-[18rem] max-xl:min-h-fit" role="tabpanel">
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