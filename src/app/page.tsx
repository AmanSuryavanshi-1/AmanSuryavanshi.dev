import React from 'react'
import { Metadata } from 'next'
import Hero from "../components/hero/Hero"
import ExperienceCards from '@/components/ExperienceCards'
import WorkBanner from '@/components/WorkBanner'
import Services from '@/components/services/services'
import AboutMe from '../components/about/AboutMe'
import { portfolioData } from '@/data/portfolio'
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection'
import Contact from '@/components/contact'
import MySkills from '@/components/skills/MySkills'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amansuryavanshi.me';

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

const page = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <Hero />

      <div className="flex flex-col">
        {/* Featured Projects */}
        <FeaturedProjectsSection />

        <WorkBanner />

        {/* About Section */}
        <AboutMe
          personalInfo={portfolioData.about.personalInfo}
          qualificationsData={portfolioData.about.qualificationsData}
        // skillsData={myData.skillsData}
        />

        {/* Skills Section */}
        <MySkills />

        {/* Experience Section - After Skills */}
        <ExperienceCards />

        {/* Services Section */}
        <Services />

        {/* Contact Section */}
        <Contact />
      </div>
    </div>
  )
}


export default page
